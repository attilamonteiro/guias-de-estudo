import type { Pergunta } from "../../tipos";

// D56 · Implantar em produção
export const d056: Pergunta = {
  numero: 356,
  modulo: "devinterview-seguranca-e-implantacao",
  metodo: "firstprinciples",
  pt: {
    titulo: "Implantar em produção",
    pergunta: "Como você implanta uma aplicação Node.js em produção?",
    porqueEsteMetodo:
      "Não existe uma receita única de deploy: existe uma lista de problemas que aparecem quando o `node app.js` sai do seu computador. Partir desse comando e acrescentar uma restrição por vez mostra por que cada peça está lá e deixa você adaptá-las ao seu caso.",
    resposta30s:
      "Em produção, `node app.js` num servidor não basta. Acrescente, uma restrição por vez: um **supervisor** que reinicie o processo, **várias instâncias** atrás de um **proxy reverso ou balanceador** que termina o TLS, **configuração e segredos fora do código** (`NODE_ENV=production`, `npm ci --omit=dev`) e **logs, health checks e desligamento gracioso**. No fim, tudo vira um **pipeline automatizado**, em geral com contêineres, com atualização gradual e **rollback**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma restrição por vez",
        passos: [
          {
            titulo: "1. A versão mais simples",
            texto:
              "Conectar por SSH, clonar o repositório, rodar `npm install` e `node app.js`. → Quebra: ao fechar o terminal, ou no primeiro erro não tratado, o processo morre e ninguém o levanta. Um reinício do servidor também o derruba.",
          },
          {
            titulo: "2. Um supervisor",
            texto:
              "Entregar o processo a quem o vigia: `systemd`, PM2 (veja D57) ou um orquestrador de contêineres. Ele sobe o processo no boot, reinicia quando cai e junta a saída em logs. → Quebra: o processo usa um núcleo só, e atualizar significa parar e subir, com a aplicação fora do ar nesse intervalo.",
          },
          {
            titulo: "3. Várias instâncias",
            texto:
              "Uma instância por núcleo (`cluster`, PM2 em modo cluster; veja T45) ou várias réplicas em máquinas diferentes. → Quebra: o estado guardado na memória de uma instância não existe nas outras (sessões, cache, limite de taxa), e alguém precisa distribuir os pedidos entre elas.",
          },
          {
            titulo: "4. Porta 80/443, TLS e distribuição",
            texto:
              "Os usuários chegam por HTTPS. Em vez de dar privilégio especial ao Node.js para abrir portas baixas, ponha na frente um **proxy reverso** ou balanceador (Nginx, Caddy, HAProxy ou o da nuvem; veja D64): ele termina o TLS, distribui os pedidos e só encaminha às instâncias saudáveis. A aplicação escuta numa porta alta, em rede privada. → Quebra: cada ambiente precisa de endereços, chaves e senhas diferentes.",
          },
          {
            titulo: "5. Configuração, segredos e dependências",
            texto:
              "Variáveis de ambiente por ambiente, nunca no repositório (veja L20 e L126), e segredos num cofre ou no gerenciador da plataforma. Defina `NODE_ENV=production` e instale com `npm ci --omit=dev`: o lockfile garante as versões testadas, e as dependências de desenvolvimento ficam de fora. → Quebra: você ainda não vê o que acontece lá dentro.",
          },
          {
            titulo: "6. Logs, saúde e desligamento gracioso",
            texto:
              "Logs estruturados no `stdout`, coletados pela plataforma (veja L117); rotas de saúde para o balanceador e o orquestrador; tratamento de `SIGTERM` que para de aceitar conexões, termina as requisições em curso e fecha pools (veja L115). → Quebra: a atualização ainda é manual e arriscada.",
          },
          {
            titulo: "7. Deploy sem downtime e rollback",
            texto:
              "Troque as instâncias aos poucos (rolling) ou suba a versão nova ao lado da antiga e vire o tráfego (blue-green). Guarde o artefato anterior para voltar em minutos, e faça as migrações de banco compatíveis com as duas versões durante a troca. → Quebra: refazer tudo isso à mão a cada versão.",
          },
          {
            titulo: "8. Reprodutível e automático",
            texto:
              "Empacote em **contêiner** (veja D58), construa uma vez e promova a mesma imagem por staging e produção, tudo disparado por **CI/CD** (veja D89). O servidor deixa de ser único e insubstituível e passa a ser algo que se recria a qualquer momento.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "O caminho de uma mudança até a produção",
        etapas: [
          "Commit numa branch de trabalho e pull request revisado",
          "CI: `npm ci`, lint, checagem de tipos e testes",
          "Build único: imagem ou pacote com tag imutável (o hash do commit)",
          "Deploy em staging e testes de fumaça (rota de saúde e um fluxo crítico)",
          "Promoção do mesmo artefato para produção, em atualização gradual, com monitoramento e rollback pronto",
        ],
        nota: "Staging deve se parecer com a produção na configuração e nos serviços: é nas diferenças entre os dois que os defeitos se escondem.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra",
        texto:
          "Cada exigência de produção responde a uma falha concreta: **cair** (supervisor), **um núcleo só** (instâncias), **porta e TLS** (proxy), **configuração divergente** (ambiente + lockfile), **cegueira** (logs e saúde) e **atualização arriscada** (deploy gradual + rollback). As ferramentas variam (VM, PaaS, contêineres, serverless; veja D84), mas a lista de problemas é a mesma.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Separe construir de executar",
        texto:
          "Compilar (TypeScript, empacotadores) costuma exigir dependências de desenvolvimento; rodar, não. Instale tudo na etapa de build e deixe só as dependências de produção (`--omit=dev`) no que vai ao ar, de preferência numa imagem final. Evite `npm install` direto no servidor: as versões podem divergir das testadas. Confira as opções atuais na documentação do npm e do Node.js (nodejs.org).",
      },
    ],
    armadilhas: [
      "Rodar em produção num terminal aberto, com `npm start` ou `nodemon` e sem supervisor: nada reinicia o processo nem o devolve depois de um reboot.",
      "Instalar com `npm install` no servidor, sem lockfile ou sem `npm ci`: as versões podem diferir das testadas.",
      "Guardar segredos no repositório ou na imagem, ou imprimi-los nos logs.",
      "Fazer deploy sem rollback ensaiado, ou com migração de banco incompatível com a versão anterior: voltar deixa de ser possível.",
    ],
    autoteste: [
      {
        pergunta: "Por que não expor o Node.js diretamente na porta 80?",
        resposta:
          "Portas baixas costumam exigir privilégio especial, o que amplia o estrago de uma falha, e TLS, compressão, arquivos estáticos e balanceamento ficam melhor num proxy reverso feito para isso. O Node.js escuta numa porta alta e privada, e o proxy faz a frente (veja D64).",
      },
      {
        pergunta: "O que `npm ci --omit=dev` faz de diferente de `npm install`?",
        resposta:
          "`npm ci` parte de um `node_modules` limpo e instala exatamente o que o lockfile descreve, falhando se ele e o `package.json` divergirem; `--omit=dev` deixa de fora as dependências de desenvolvimento. O resultado é reprodutível e menor.",
      },
    ],
  },
  en: {
    titulo: "Deploying to production",
    pergunta: "How do you deploy a Node.js application in production?",
    porqueEsteMetodo:
      "There is no single deploy recipe: there is a list of problems that appear when `node app.js` leaves your computer. Starting from that command and adding one constraint at a time shows why each piece is there and lets you adapt them to your case.",
    resposta30s:
      "In production, `node app.js` on a server is not enough. Add, one constraint at a time: a **supervisor** that restarts the process, **several instances** behind a **reverse proxy or load balancer** that terminates TLS, **configuration and secrets outside the code** (`NODE_ENV=production`, `npm ci --omit=dev`) and **logs, health checks and graceful shutdown**. In the end, it all becomes an **automated pipeline**, usually with containers, gradual rollout and **rollback**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one constraint at a time",
        passos: [
          {
            titulo: "1. The simplest version",
            texto:
              "SSH in, clone the repository, run `npm install` and `node app.js`. → Breaks: when you close the terminal, or at the first unhandled error, the process dies and nobody brings it back. A server reboot kills it too.",
          },
          {
            titulo: "2. A supervisor",
            texto:
              "Hand the process to something that watches it: `systemd`, PM2 (see D57) or a container orchestrator. It starts the process at boot, restarts it when it crashes and gathers its output into logs. → Breaks: the process uses a single core, and updating means stopping and starting, with the application down in between.",
          },
          {
            titulo: "3. Several instances",
            texto:
              "One instance per core (`cluster`, PM2 in cluster mode; see T45) or several replicas on different machines. → Breaks: state kept in one instance’s memory does not exist in the others (sessions, cache, rate limits), and someone has to spread the requests among them.",
          },
          {
            titulo: "4. Port 80/443, TLS and distribution",
            texto:
              "Users arrive over HTTPS. Instead of giving Node.js special privileges to open low ports, put a **reverse proxy** or load balancer in front (Nginx, Caddy, HAProxy or the cloud’s own; see D64): it terminates TLS, spreads the requests and forwards only to healthy instances. The application listens on a high port, on a private network. → Breaks: each environment needs different addresses, keys and passwords.",
          },
          {
            titulo: "5. Configuration, secrets and dependencies",
            texto:
              "Environment variables per environment, never in the repository (see L20 and L126), and secrets in a vault or the platform’s secret manager. Set `NODE_ENV=production` and install with `npm ci --omit=dev`: the lockfile guarantees the tested versions, and development dependencies stay out. → Breaks: you still can’t see what is happening inside.",
          },
          {
            titulo: "6. Logs, health and graceful shutdown",
            texto:
              "Structured logs on `stdout`, collected by the platform (see L117); health routes for the load balancer and the orchestrator; a `SIGTERM` handler that stops accepting connections, finishes in-flight requests and closes pools (see L115). → Breaks: updating is still manual and risky.",
          },
          {
            titulo: "7. Zero-downtime deploys and rollback",
            texto:
              "Swap instances gradually (rolling) or bring up the new version beside the old one and switch the traffic (blue-green). Keep the previous artifact so you can go back in minutes, and make database migrations compatible with both versions during the switch. → Breaks: redoing all of this by hand for every release.",
          },
          {
            titulo: "8. Reproducible and automatic",
            texto:
              "Package in a **container** (see D58), build once and promote the same image through staging and production, all triggered by **CI/CD** (see D89). The server stops being unique and irreplaceable and becomes something you can recreate at any time.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "A change’s path to production",
        etapas: [
          "Commit on a working branch and a reviewed pull request",
          "CI: `npm ci`, lint, type checking and tests",
          "A single build: an image or package with an immutable tag (the commit hash)",
          "Deploy to staging and smoke tests (health route and one critical flow)",
          "Promote the same artifact to production, gradually, with monitoring and a rollback ready",
        ],
        nota: "Staging should resemble production in configuration and services: defects hide in the differences between the two.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule",
        texto:
          "Every production requirement answers a concrete failure: **crashing** (supervisor), **one core only** (instances), **port and TLS** (proxy), **diverging configuration** (environment + lockfile), **blindness** (logs and health) and **risky updates** (gradual deploy + rollback). The tools vary (VM, PaaS, containers, serverless; see D84), but the list of problems is the same.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Separate building from running",
        texto:
          "Compiling (TypeScript, bundlers) usually needs development dependencies; running does not. Install everything in the build stage and leave only production dependencies (`--omit=dev`) in what goes live, preferably in a final image. Avoid `npm install` directly on the server: versions can drift from the tested ones. Check the current options in the npm and Node.js documentation (nodejs.org).",
      },
    ],
    armadilhas: [
      "Running production in an open terminal, with `npm start` or `nodemon` and no supervisor: nothing restarts the process or brings it back after a reboot.",
      "Installing with `npm install` on the server, without a lockfile or without `npm ci`: versions may differ from the tested ones.",
      "Keeping secrets in the repository or in the image, or printing them in logs.",
      "Deploying without a rehearsed rollback, or with a database migration incompatible with the previous version: going back stops being possible.",
    ],
    autoteste: [
      {
        pergunta: "Why not expose Node.js directly on port 80?",
        resposta:
          "Low ports usually require special privileges, which widens the damage of a flaw, and TLS, compression, static files and load balancing are better handled by a reverse proxy built for it. Node.js listens on a high, private port and the proxy fronts it (see D64).",
      },
      {
        pergunta: "How does `npm ci --omit=dev` differ from `npm install`?",
        resposta:
          "`npm ci` starts from a clean `node_modules` and installs exactly what the lockfile describes, failing if it and `package.json` disagree; `--omit=dev` leaves out the development dependencies. The result is reproducible and smaller.",
      },
    ],
  },
};
