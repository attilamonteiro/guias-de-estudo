import type { Pergunta } from "../../tipos";

// D76 · Twelve-factor app
export const d076: Pergunta = {
  numero: 376,
  modulo: "devinterview-integracoes",
  metodo: "playbook",
  pt: {
    titulo: "Twelve-factor app",
    pergunta: "Como você garante que sua aplicação Node.js siga os princípios do twelve-factor app?",
    porqueEsteMetodo:
      "Os doze fatores são uma lista, e a entrevista quer ver você ligá-los ao dia a dia de uma aplicação Node.js. Um mapa de fator para prática, mais um jeito de verificar cada um, transforma o princípio em checklist.",
    resposta30s:
      "O **twelve-factor app** é um conjunto de doze princípios para aplicações em nuvem: um código-base, dependências declaradas, **configuração no ambiente**, serviços de apoio como recursos, build/release/run separados, **processos sem estado**, port binding, escala por processos, **descartabilidade**, paridade entre ambientes, **logs em `stdout`** e tarefas administrativas avulsas. Em Node.js isso vira `package.json` com lockfile, `process.env`, `PORT`, réplicas, `SIGTERM` tratado e logs em JSON. Para garantir, use um checklist de revisão e testes que simulam réplicas e reinícios.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Os doze fatores no Node.js",
        colunas: ["Fator", "Como fica no Node.js", "Sinal de que está certo"],
        linhas: [
          [
            "1. Base de código",
            "Um repositório por aplicação (ou, num monorepo, um pacote com deploy próprio); o mesmo código vai para todos os ambientes",
            "Desenvolvimento, homologação e produção rodam o mesmo commit, só com configuração diferente",
          ],
          [
            "2. Dependências",
            "Tudo no `package.json`, com o lockfile versionado; `npm ci` instala; nada de pacote global assumido; `engines` declara o Node",
            "Clonar o repositório e rodar `npm ci` basta para a aplicação subir",
          ],
          [
            "3. Configuração",
            "`process.env`, lido em um só lugar e validado na partida; `.env` só em desenvolvimento; segredos fora do repositório",
            "O mesmo artefato sobe em qualquer ambiente trocando apenas variáveis",
          ],
          [
            "4. Serviços de apoio",
            "Banco, cache, fila e armazenamento de objetos acessados por URL e credenciais que vêm da configuração",
            "Trocar o banco local pelo gerenciado muda uma variável, não o código",
          ],
          [
            "5. Build, release, run",
            "`npm ci` e `npm run build` geram um artefato ou imagem imutável; a release une artefato e configuração; o run só executa o `node`",
            "Nada é instalado nem compilado na hora de rodar, e dá para voltar à release anterior",
          ],
          [
            "6. Processos",
            "Sem estado em memória nem no disco local: sessões, cache e uploads vão para Redis, banco ou armazenamento de objetos (veja D79)",
            "Matar qualquer instância não faz ninguém perder dados",
          ],
          [
            "7. Port binding",
            "A aplicação sobe o próprio servidor HTTP (`node:http`, Express, Fastify) e escuta `process.env.PORT`",
            "`node server.js` já atende, sem servidor de aplicação externo",
          ],
          [
            "8. Concorrência",
            "Escalar com mais processos: réplicas atrás de um balanceador, ou `cluster`/PM2 numa máquina (veja T45); processos separados para web e para workers de fila",
            "Dobrar as réplicas dobra a capacidade, sem mexer no código",
          ],
          [
            "9. Descartabilidade",
            "Partida rápida e `SIGTERM` tratado: parar de aceitar conexões, terminar o que está em curso e fechar pools (veja L115); jobs reentregues se o worker morrer",
            "Deploys e reinícios acontecem sem requisições cortadas",
          ],
          [
            "10. Paridade dev/prod",
            "Os mesmos serviços de apoio em desenvolvimento (por exemplo, em contêineres), a mesma versão do Node (`.nvmrc`) e deploys frequentes",
            "O bug que “só acontece em produção” é raro",
          ],
          [
            "11. Logs",
            "`console.log` ou um logger (pino, winston) escreve eventos em JSON no `stdout`; a plataforma coleta e roteia",
            "A aplicação não abre arquivos de log nem cuida de rotação",
          ],
          [
            "12. Tarefas administrativas",
            "Migrações e scripts de manutenção como comandos avulsos (`npm run migrar`), com o mesmo código e a mesma configuração, executados como processo ou job único",
            "Não existe um “console de produção” com código diferente do que está no ar",
          ],
        ],
        nota: "Os doze fatores vêm de um manifesto público (12factor.net) e funcionam como guia, não como certificação; confira o texto original para as nuances.",
      },
      {
        tipo: "passos",
        titulo: "Como garantir, e não só declarar",
        passos: [
          {
            titulo: "Faça o mapa",
            texto:
              "Revise o projeto fator a fator com a tabela e anote o que está violado, o custo do conserto e quem decide. O resultado é um checklist, não uma opinião.",
          },
          {
            titulo: "Automatize o que dá",
            texto:
              "`npm ci` no CI, validação das variáveis na partida (falha se faltar alguma), lint e testes. Quanto mais o pipeline reprova, menos a conformidade depende de memória.",
          },
          {
            titulo: "Prove a ausência de estado e a descartabilidade",
            texto:
              "Suba duas réplicas atrás de um balanceador e faça a mesma sessão passar pelas duas; mate um processo sob carga e envie `SIGTERM` durante um deploy. Sinal de acerto: nenhum dado perdido e nenhuma requisição cortada.",
          },
          {
            titulo: "Revise a cada mudança",
            texto:
              "Inclua os fatores no checklist de PR de infraestrutura e de serviços novos, e refaça o mapa quando a arquitetura mudar.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A ideia por trás dos doze",
        texto:
          "Os doze fatores descrevem uma aplicação **sem estado, configurável de fora, descartável e observável**. Com essas quatro propriedades ela pode ser replicada, movida e reiniciada à vontade, que é o que a nuvem pede.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Nuances que o manifesto não resolve sozinho",
        texto:
          "Variáveis de ambiente são práticas, mas vazam para processos filhos e podem aparecer em relatórios de diagnóstico; para segredos sensíveis, um gerenciador de segredos (veja L126) complementa a regra. E “sem estado” não proíbe um cache em memória como otimização, desde que perdê-lo seja inofensivo.",
      },
    ],
    armadilhas: [
      "Guardar sessão, cache essencial ou uploads na memória ou no disco do processo: ao escalar ou reiniciar, os dados somem ou divergem entre réplicas.",
      "Manter arquivos de configuração por ambiente no repositório (`config.prod.js`), com segredos dentro: configuração é variável de ambiente.",
      "Ignorar o `SIGTERM`: a cada deploy, o orquestrador mata o processo no meio das requisições.",
      "Gravar logs em arquivos dentro do contêiner, com rotação própria: escreva no `stdout` e deixe a plataforma coletar.",
    ],
    autoteste: [
      {
        pergunta: "Por que o twelve-factor pede processos sem estado?",
        resposta:
          "Porque assim qualquer instância atende qualquer requisição e pode ser criada ou destruída a qualquer momento; o estado precisa ficar em serviços de apoio (banco, Redis, armazenamento de objetos).",
      },
      {
        pergunta: "Como você mostraria que uma aplicação Node.js é descartável?",
        resposta:
          "Enviando `SIGTERM` durante uma carga: ela para de aceitar conexões, termina as requisições em curso, fecha pools e sai, sem que o cliente perceba, e uma nova instância sobe rápido.",
      },
    ],
  },
  en: {
    titulo: "The twelve-factor app",
    pergunta: "How do you ensure your Node.js application adheres to the twelve-factor app principles?",
    porqueEsteMetodo:
      "The twelve factors are a list, and an interview wants to see you connect them to the daily life of a Node.js application. A map from factor to practice, plus a way to verify each one, turns the principle into a checklist.",
    resposta30s:
      "The **twelve-factor app** is a set of twelve principles for cloud applications: one codebase, declared dependencies, **configuration in the environment**, backing services as resources, separate build/release/run, **stateless processes**, port binding, scaling out through processes, **disposability**, parity between environments, **logs on `stdout`** and one-off admin tasks. In Node.js that becomes `package.json` with a lockfile, `process.env`, `PORT`, replicas, a handled `SIGTERM` and JSON logs. To ensure it, use a review checklist and tests that simulate replicas and restarts.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The twelve factors in Node.js",
        colunas: ["Factor", "How it looks in Node.js", "Sign you got it right"],
        linhas: [
          [
            "1. Codebase",
            "One repository per application (or, in a monorepo, a package with its own deploy); the same code goes to every environment",
            "Development, staging and production run the same commit, with different configuration only",
          ],
          [
            "2. Dependencies",
            "Everything in `package.json`, with the lockfile committed; `npm ci` installs; no assumed global packages; `engines` declares Node",
            "Cloning the repository and running `npm ci` is enough for the application to start",
          ],
          [
            "3. Config",
            "`process.env`, read in one place and validated at startup; `.env` only in development; secrets outside the repository",
            "The same artifact starts in any environment by changing only variables",
          ],
          [
            "4. Backing services",
            "Database, cache, queue and object storage reached through URLs and credentials that come from configuration",
            "Swapping the local database for the managed one changes a variable, not the code",
          ],
          [
            "5. Build, release, run",
            "`npm ci` and `npm run build` produce an immutable artifact or image; the release joins artifact and configuration; run only executes `node`",
            "Nothing is installed or compiled at run time, and you can roll back to the previous release",
          ],
          [
            "6. Processes",
            "No state in memory or on local disk: sessions, cache and uploads go to Redis, a database or object storage (see D79)",
            "Killing any instance makes nobody lose data",
          ],
          [
            "7. Port binding",
            "The application starts its own HTTP server (`node:http`, Express, Fastify) and listens on `process.env.PORT`",
            "`node server.js` already serves requests, with no external application server",
          ],
          [
            "8. Concurrency",
            "Scale out with more processes: replicas behind a load balancer, or `cluster`/PM2 on one machine (see T45); separate processes for web and queue workers",
            "Doubling the replicas doubles the capacity, without touching the code",
          ],
          [
            "9. Disposability",
            "Fast startup and a handled `SIGTERM`: stop accepting connections, finish what is in flight and close pools (see L115); jobs redelivered if a worker dies",
            "Deploys and restarts happen without cut-off requests",
          ],
          [
            "10. Dev/prod parity",
            "The same backing services in development (for example, in containers), the same Node version (`.nvmrc`) and frequent deploys",
            "The “only happens in production” bug is rare",
          ],
          [
            "11. Logs",
            "`console.log` or a logger (pino, winston) writes events as JSON to `stdout`; the platform collects and routes them",
            "The application opens no log files and does no rotation",
          ],
          [
            "12. Admin processes",
            "Migrations and maintenance scripts as one-off commands (`npm run migrate`), with the same code and configuration, run as a single process or job",
            "There is no “production console” running code different from what is deployed",
          ],
        ],
        nota: "The twelve factors come from a public manifesto (12factor.net) and work as a guide, not as a certification; check the original text for the nuances.",
      },
      {
        tipo: "passos",
        titulo: "How to ensure it, not just declare it",
        passos: [
          {
            titulo: "Draw the map",
            texto:
              "Review the project factor by factor using the table and note what is violated, the cost of fixing it and who decides. The result is a checklist, not an opinion.",
          },
          {
            titulo: "Automate what you can",
            texto:
              "`npm ci` in CI, validation of variables at startup (fail if any is missing), lint and tests. The more the pipeline rejects, the less compliance depends on memory.",
          },
          {
            titulo: "Prove statelessness and disposability",
            texto:
              "Start two replicas behind a load balancer and send the same session through both; kill a process under load and send `SIGTERM` during a deploy. Sign you got it right: no data lost and no request cut off.",
          },
          {
            titulo: "Review on every change",
            texto:
              "Put the factors in the PR checklist for infrastructure and new services, and redraw the map when the architecture changes.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The idea behind the twelve",
        texto:
          "The twelve factors describe an application that is **stateless, configurable from outside, disposable and observable**. With those four properties it can be replicated, moved and restarted at will, which is what the cloud asks for.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Nuances the manifesto does not settle on its own",
        texto:
          "Environment variables are practical, but they leak to child processes and can show up in diagnostic reports; for sensitive secrets, a secrets manager (see L126) complements the rule. And “stateless” does not forbid an in-memory cache as an optimization, as long as losing it is harmless.",
      },
    ],
    armadilhas: [
      "Keeping sessions, essential cache or uploads in the process’s memory or on its disk: when you scale or restart, the data vanishes or diverges between replicas.",
      "Keeping per-environment config files in the repository (`config.prod.js`), with secrets inside: configuration belongs in environment variables.",
      "Ignoring `SIGTERM`: on every deploy, the orchestrator kills the process in the middle of requests.",
      "Writing logs to files inside the container, with your own rotation: write to `stdout` and let the platform collect them.",
    ],
    autoteste: [
      {
        pergunta: "Why does the twelve-factor app ask for stateless processes?",
        resposta:
          "Because then any instance can serve any request and can be created or destroyed at any moment; state has to live in backing services (a database, Redis, object storage).",
      },
      {
        pergunta: "How would you show that a Node.js application is disposable?",
        resposta:
          "By sending `SIGTERM` during a load: it stops accepting connections, finishes the requests in flight, closes pools and exits without the client noticing, and a new instance starts quickly.",
      },
    ],
  },
};
