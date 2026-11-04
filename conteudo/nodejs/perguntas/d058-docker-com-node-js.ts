import type { Pergunta } from "../../tipos";

// D58 · Docker com Node.js
export const d058: Pergunta = {
  numero: 358,
  modulo: "devinterview-seguranca-e-implantacao",
  metodo: "playbook",
  pt: {
    titulo: "Docker com Node.js",
    pergunta: "Explique como você usaria o Docker com uma aplicação Node.js.",
    porqueEsteMetodo:
      "Conteinerizar uma aplicação é uma sequência de decisões pequenas em que a ordem importa (cache de camadas, usuário, sinais). Um playbook em passos, com o critério de cada um, evita o Dockerfile copiado sem entendimento.",
    resposta30s:
      'A aplicação vai numa **imagem** construída por um Dockerfile em **multi-stage**: base de uma versão **LTS**, `package*.json` copiado antes do código (para aproveitar o **cache de camadas**), `npm ci --omit=dev`, `USER node` e `CMD ["node", ...]` na forma exec, para o processo receber os sinais. Um `.dockerignore`, configuração por variáveis de ambiente, health check e limite de memória completam a imagem, e o **docker compose** sobe a aplicação com o banco no desenvolvimento. O ganho é **reprodutibilidade, isolamento e portabilidade**: a mesma imagem roda no notebook, no CI e em produção.',
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: da aplicação à imagem",
        passos: [
          {
            titulo: "1. Escolha a imagem base",
            texto:
              "Use a imagem oficial do Node.js de uma versão LTS, fixada no Dockerfile (confira o calendário em nodejs.org). `slim` (Debian) é o padrão seguro e compatível com módulos nativos; `alpine` é menor, mas usa outra biblioteca C (musl), e pacotes com binários nativos podem falhar. Critério: a imagem sobe e passa nos testes com o que você escolheu.",
          },
          {
            titulo: "2. Ordene as camadas pelo cache",
            texto:
              "Copie só `package*.json`, rode `npm ci` e só então copie o código. Enquanto as dependências não mudam, o Docker reaproveita a camada pesada. Sinal de acerto: mudar uma linha de código reconstrói a imagem em segundos, sem baixar pacotes de novo.",
          },
          {
            titulo: "3. Corte o contexto com `.dockerignore`",
            texto:
              "Liste `node_modules`, `.git`, `.env`, logs e artefatos locais. Menos arquivos no contexto de build significam builds mais rápidos, e o `.env` nunca entra por engano na imagem.",
          },
          {
            titulo: "4. Separe build e execução (multi-stage)",
            texto:
              "O primeiro estágio instala tudo e compila (TypeScript, empacotador). O estágio final copia só o resultado e instala as dependências de produção. Resultado: imagem menor e com menos superfície de ataque, sem compilador nem código-fonte desnecessário.",
          },
          {
            titulo: "5. Rode como usuário comum e receba os sinais",
            texto:
              '`USER node` evita rodar como administrador. `CMD ["node", "dist/server.js"]` (forma exec) faz o `node` ser o processo principal; `CMD npm start` ou a forma shell põem intermediários que podem não repassar `SIGTERM`. Use `docker run --init` (ou `init: true` no compose) para um init cuidar de processos zumbis e sinais, e trate `SIGTERM` na aplicação (veja L115).',
          },
          {
            titulo: "6. Configuração, saúde e limites",
            texto:
              "`ENV NODE_ENV=production`; segredos entram na execução (variáveis, secrets da plataforma), nunca com `COPY` ou `ENV` no Dockerfile. Defina um `HEALTHCHECK` (ou as probes do orquestrador) e um limite de memória do contêiner; ajuste o limite de heap do Node.js (`--max-old-space-size`) abaixo dele, para o V8 coletar lixo antes de o kernel matar o processo.",
          },
          {
            titulo: "7. Ambiente de desenvolvimento com compose",
            texto:
              "Um `compose.yaml` sobe a aplicação, o banco e o cache com um comando, monta o código como volume e roda com `node --watch`. Todos da equipe têm o mesmo ambiente; o que muda para produção é a imagem final, não o código.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Dockerfile multi-stage",
        legenda: "Dockerfile",
        codigo:
          'FROM node:lts-slim AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:lts-slim\nENV NODE_ENV=production\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY --from=build /app/dist ./dist\nUSER node\nEXPOSE 3000\nCMD ["node", "dist/server.js"]',
        nota: "Em produção, fixe a versão exata do major LTS (e, se possível, o digest) no lugar de `lts-slim`, para o build ser reproduzível. Confira os nomes de tag atuais no Docker Hub.",
      },
      {
        tipo: "tabela",
        titulo: "Benefícios da conteinerização",
        colunas: ["Benefício", "O que significa para uma aplicação Node.js"],
        linhas: [
          [
            "Reprodutibilidade",
            "Mesma versão do Node.js, mesmas dependências e mesmo sistema em qualquer máquina: acaba o “na minha máquina funciona”",
          ],
          [
            "Isolamento",
            "A aplicação e suas dependências ficam separadas das outras no mesmo host, com limites de CPU e memória; o contêiner compartilha o kernel do host, ao contrário de uma VM, que traz um sistema inteiro",
          ],
          [
            "Portabilidade",
            "A mesma imagem roda no notebook, no CI e em qualquer nuvem ou orquestrador, o que reduz a dependência de um provedor (veja D84)",
          ],
          [
            "Escala e deploy",
            "Subir réplicas é iniciar mais contêineres da mesma imagem, e voltar uma versão é trocar a tag (veja D89)",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Erros que a imagem esconde",
        texto:
          "Imagem não é segurança automática: varra vulnerabilidades, atualize a base e mantenha a imagem enxuta. Não grave segredos em camadas (elas ficam no histórico da imagem, mesmo que você apague o arquivo depois). Dados que precisam durar (uploads, banco) vão em volumes ou serviços externos, porque o sistema de arquivos do contêiner some com ele. E o contêiner precisa tratar `SIGTERM` para o `docker stop` não terminar em corte à força.",
      },
    ],
    armadilhas: [
      "Copiar o projeto inteiro antes do `npm ci`: qualquer mudança no código invalida o cache e reinstala todas as dependências.",
      "Usar `CMD npm start` ou rodar como administrador: os sinais não chegam ao `node` e a aplicação ganha privilégio que não precisa.",
      "Pôr segredos na imagem (`COPY .env`, `ENV SENHA=...`): ficam gravados nas camadas e vazam com a imagem.",
      "Tratar o contêiner como uma máquina que persiste: arquivos gravados nele somem na troca de versão, e o estado em disco local quebra com várias réplicas.",
    ],
    autoteste: [
      {
        pergunta: "Por que copiar `package*.json` e rodar `npm ci` antes de copiar o código?",
        resposta:
          "Porque cada instrução do Dockerfile é uma camada em cache: enquanto os arquivos de dependências não mudam, a camada do `npm ci` é reaproveitada. Se o código fosse copiado antes, qualquer edição invalidaria o cache e reinstalaria tudo.",
      },
      {
        pergunta: "Qual é a diferença entre um contêiner e uma máquina virtual?",
        resposta:
          "A VM traz um sistema operacional inteiro sobre um hipervisor; o contêiner isola processos e arquivos mas compartilha o kernel do host. Por isso é mais leve e inicia mais rápido, e o isolamento é menos forte que o de uma VM.",
      },
    ],
  },
  en: {
    titulo: "Docker with Node.js",
    pergunta: "Explain how you would use Docker with a Node.js application.",
    porqueEsteMetodo:
      "Containerizing an application is a sequence of small decisions where order matters (layer cache, user, signals). A step-by-step playbook, with the criterion for each step, avoids the Dockerfile copied without understanding.",
    resposta30s:
      'The application goes into an **image** built from a **multi-stage** Dockerfile: an **LTS** base, `package*.json` copied before the code (to benefit from the **layer cache**), `npm ci --omit=dev`, `USER node` and `CMD ["node", ...]` in exec form, so the process receives signals. A `.dockerignore`, configuration through environment variables, a health check and a memory limit complete the image, and **docker compose** brings up the application with its database during development. The payoff is **reproducibility, isolation and portability**: the same image runs on a laptop, in CI and in production.',
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from application to image",
        passos: [
          {
            titulo: "1. Choose the base image",
            texto:
              "Use the official Node.js image of an LTS version, pinned in the Dockerfile (check the schedule on nodejs.org). `slim` (Debian) is the safe default and compatible with native modules; `alpine` is smaller but uses a different C library (musl), and packages with native binaries may fail. Criterion: the image builds and passes the tests with what you chose.",
          },
          {
            titulo: "2. Order the layers for the cache",
            texto:
              "Copy only `package*.json`, run `npm ci` and only then copy the code. As long as the dependencies don’t change, Docker reuses the heavy layer. Sign of success: changing one line of code rebuilds the image in seconds, without downloading packages again.",
          },
          {
            titulo: "3. Trim the context with `.dockerignore`",
            texto:
              "List `node_modules`, `.git`, `.env`, logs and local artifacts. Fewer files in the build context mean faster builds, and `.env` never ends up in the image by mistake.",
          },
          {
            titulo: "4. Separate build from runtime (multi-stage)",
            texto:
              "The first stage installs everything and compiles (TypeScript, bundler). The final stage copies only the result and installs production dependencies. Outcome: a smaller image with less attack surface, with no compiler or needless source code.",
          },
          {
            titulo: "5. Run as a regular user and receive signals",
            texto:
              '`USER node` avoids running as administrator. `CMD ["node", "dist/server.js"]` (exec form) makes `node` the main process; `CMD npm start` or the shell form add intermediaries that may not forward `SIGTERM`. Use `docker run --init` (or `init: true` in compose) so an init process handles zombie processes and signals, and handle `SIGTERM` in the application (see L115).',
          },
          {
            titulo: "6. Configuration, health and limits",
            texto:
              "`ENV NODE_ENV=production`; secrets are supplied at run time (variables, platform secrets), never with `COPY` or `ENV` in the Dockerfile. Define a `HEALTHCHECK` (or the orchestrator’s probes) and a container memory limit; set Node.js’s heap limit (`--max-old-space-size`) below it, so V8 garbage-collects before the kernel kills the process.",
          },
          {
            titulo: "7. Development environment with compose",
            texto:
              "A `compose.yaml` brings up the application, database and cache with one command, mounts the code as a volume and runs with `node --watch`. Everyone on the team gets the same environment; what changes for production is the final image, not the code.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Multi-stage Dockerfile",
        legenda: "Dockerfile",
        codigo:
          'FROM node:lts-slim AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:lts-slim\nENV NODE_ENV=production\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY --from=build /app/dist ./dist\nUSER node\nEXPOSE 3000\nCMD ["node", "dist/server.js"]',
        nota: "In production, pin the exact LTS major version (and, if possible, the digest) in place of `lts-slim`, so the build is reproducible. Check the current tag names on Docker Hub.",
      },
      {
        tipo: "tabela",
        titulo: "Benefits of containerization",
        colunas: ["Benefit", "What it means for a Node.js application"],
        linhas: [
          [
            "Reproducibility",
            "The same Node.js version, dependencies and system on any machine: “it works on my machine” goes away",
          ],
          [
            "Isolation",
            "The application and its dependencies are kept apart from others on the same host, with CPU and memory limits; a container shares the host kernel, unlike a VM, which brings a whole system",
          ],
          [
            "Portability",
            "The same image runs on a laptop, in CI and on any cloud or orchestrator, which reduces provider dependence (see D84)",
          ],
          [
            "Scaling and deploy",
            "Adding replicas means starting more containers from the same image, and going back a version means switching the tag (see D89)",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What the image hides",
        texto:
          "An image is not automatic security: scan for vulnerabilities, update the base and keep the image lean. Don’t bake secrets into layers (they stay in the image history even if you delete the file afterward). Data that must last (uploads, database) goes in volumes or external services, because the container’s filesystem disappears with it. And the container must handle `SIGTERM` so `docker stop` doesn’t end in a forced kill.",
      },
    ],
    armadilhas: [
      "Copying the whole project before `npm ci`: any change to the code invalidates the cache and reinstalls every dependency.",
      "Using `CMD npm start` or running as administrator: signals don’t reach `node` and the application gets privileges it doesn’t need.",
      "Putting secrets in the image (`COPY .env`, `ENV PASSWORD=...`): they stay recorded in the layers and leak with the image.",
      "Treating the container as a machine that persists: files written in it vanish on a version change, and state on local disk breaks with several replicas.",
    ],
    autoteste: [
      {
        pergunta: "Why copy `package*.json` and run `npm ci` before copying the code?",
        resposta:
          "Because every Dockerfile instruction is a cached layer: as long as the dependency files don’t change, the `npm ci` layer is reused. If the code were copied first, any edit would invalidate the cache and reinstall everything.",
      },
      {
        pergunta: "What is the difference between a container and a virtual machine?",
        resposta:
          "A VM carries a whole operating system on top of a hypervisor; a container isolates processes and files but shares the host kernel. That makes it lighter and faster to start, and its isolation is weaker than a VM’s.",
      },
    ],
  },
};
