import type { Pergunta } from "../../tipos";

// D94 · Node.js e DevOps
export const d094: Pergunta = {
  numero: 394,
  modulo: "devinterview-cenarios",
  metodo: "feynman",
  pt: {
    titulo: "Node.js e DevOps",
    pergunta: "Qual é o papel de uma aplicação Node.js em DevOps?",
    porqueEsteMetodo:
      "A pergunta mistura dois níveis: o que é DevOps e o que uma aplicação precisa oferecer para ser operada. A analogia separa os dois, e a tabela mostra, item a item, como uma aplicação Node.js ajuda a equipe.",
    resposta30s:
      "**DevOps** é uma cultura e um conjunto de práticas que aproximam desenvolvimento e operação para entregar mudanças pequenas, frequentes e seguras; não é um “papel do app” nem uma ferramenta. O que uma aplicação Node.js faz é ser **operável**: build reproduzível (lockfile), configuração por ambiente, **health checks**, **logs, métricas e traces**, **desligamento gracioso**, contêiner e pipeline de CI/CD. O Node.js também serve de **ferramenta** de DevOps, em scripts, CLIs e automações.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense num carro de corrida e na equipe de box. Trocar os pneus em poucos segundos só é possível porque o carro foi desenhado para isso: porcas padronizadas, um painel que mostra temperatura e pressão, pontos de acesso previstos. E só funciona porque projetistas e mecânicos conversam desde o projeto, em vez de um jogar o carro por cima do muro para o outro.",
        tecnico:
          "**DevOps** junta quem desenvolve e quem opera em torno de um objetivo comum: entregar mudanças pequenas, frequentes e seguras, com feedback rápido e responsabilidade compartilhada (muitas equipes adotam “quem constrói também opera”). Automação, CI/CD e infraestrutura como código são meios, não o fim. Daí o papel de uma aplicação: ser fácil de **construir, configurar, implantar, observar e recuperar**. E o Node.js entra duas vezes: como aplicação a ser operada e como ferramenta para automatizar.",
        limite:
          "A analogia faz parecer que DevOps é só o pit stop. Na prática é a corrida inteira, e o carro nunca fica pronto: a equipe aprende com cada volta (incidentes, métricas) e muda o projeto. DevOps também não é um cargo nem uma ferramenta que se compra: contratar alguém “de DevOps” não cria a cultura.",
      },
      {
        tipo: "tabela",
        titulo: "O que uma aplicação Node.js oferece para ser operável",
        colunas: ["Capacidade", "Como a aplicação a oferece", "Onde estudar"],
        linhas: [
          [
            "Build reproduzível",
            "Lockfile commitado, `npm ci` e versão do Node.js fixada (`.nvmrc`, `engines`)",
            "L16 e T54",
          ],
          [
            "Configuração por ambiente",
            "Variáveis de ambiente validadas na partida e nenhum segredo no código",
            "L20 e L126",
          ],
          ["Health checks", "Rotas de “vivo” e de “pronto” para o balanceador e o orquestrador", "L115"],
          ["Logs estruturados", "JSON no `stdout`, com id de correlação por requisição", "L117"],
          [
            "Métricas e traces",
            "Latência, erros, saturação e atraso do laço de eventos; instrumentação com OpenTelemetry",
            "L118",
          ],
          [
            "Desligamento gracioso",
            "No `SIGTERM`, para de aceitar conexões, termina o que está em curso e fecha pools",
            "L115",
          ],
          ["Contêiner e CI/CD", "Imagem enxuta, sem root, construída e promovida por um pipeline", "D58 e D89"],
          [
            "Infraestrutura como código",
            "Ambientes descritos em arquivos versionados, revisados como o resto do código",
            "D84",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Vivo não é o mesmo que pronto",
        legenda: "JavaScript",
        codigo:
          'import { createServer } from "node:http";\n\nlet pronto = false; // vira true quando banco e filas estiverem conectados\n\nconst servidor = createServer((req, res) => {\n  if (req.url === "/saude") {\n    res.writeHead(200); // o processo está vivo?\n    res.end("vivo");\n  } else if (req.url === "/pronto") {\n    res.writeHead(pronto ? 200 : 503); // pode receber tráfego?\n    res.end();\n  } else {\n    res.writeHead(404);\n    res.end();\n  }\n});\n\nservidor.listen(3000, () => {\n  // conecte às dependências aqui e só então marque como pronto\n  pronto = true;\n});',
        nota: "O orquestrador reinicia o processo quando a rota de “vivo” falha e deixa de enviar tráfego enquanto a de “pronto” falha. Confira os nomes de probe e a configuração na documentação da sua plataforma.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Node.js como ferramenta de DevOps",
        texto:
          "O npm e o runtime também automatizam o trabalho da equipe: scripts em `package.json`, CLIs próprias (com bibliotecas como `commander` ou `yargs`), scripts de migração e de implantação, ações personalizadas de CI escritas em JavaScript, ferramentas de build e infraestrutura como código em TypeScript (Pulumi, AWS CDK). Vantagens: a equipe já conhece a linguagem, `npx` roda ferramentas sem instalá-las, e a E/S assíncrona facilita falar com várias APIs de uma vez.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cultura, não cargo",
        texto:
          "A pergunta provavelmente quer dizer “o que a aplicação precisa ter para a prática de DevOps funcionar”: DevOps em si não é um papel do app, e sim um jeito de trabalhar. Numa entrevista, responda nos dois níveis: a prática (ciclos curtos, automação, feedback, responsabilidade compartilhada) e o que a aplicação oferece para ser operada. Evite reduzir DevOps a “ter pipeline” ou a “usar Docker”.",
      },
    ],
    armadilhas: [
      "Reduzir DevOps a ferramentas (Docker, Jenkins, Kubernetes) e ignorar a parte cultural: responsabilidade compartilhada, ciclos curtos e aprender com os incidentes.",
      "Entregar uma aplicação que só funciona na máquina de quem a escreveu: sem lockfile, sem versão do Node.js fixada e com configuração dentro do código.",
      "Fazer um health check que só diz “o processo existe” e não reflete a prontidão (banco conectado, filas disponíveis).",
      "Não ter observabilidade: sem logs estruturados, métricas e traces, a operação trabalha às cegas e o tempo de recuperação cresce.",
    ],
    autoteste: [
      {
        pergunta: "Em uma frase, o que é DevOps?",
        resposta:
          "Uma cultura e um conjunto de práticas que unem desenvolvimento e operação, com automação e feedback rápido, para entregar mudanças pequenas e seguras com responsabilidade compartilhada.",
      },
      {
        pergunta: "O que uma aplicação Node.js precisa oferecer para ser fácil de operar?",
        resposta:
          "Build reproduzível, configuração por variáveis de ambiente, health checks de vida e de prontidão, logs estruturados, métricas e traces, desligamento gracioso e empacotamento em contêiner com um pipeline automatizado.",
      },
    ],
  },
  en: {
    titulo: "Node.js and DevOps",
    pergunta: "What is the role of a Node.js application in DevOps?",
    porqueEsteMetodo:
      "The question mixes two levels: what DevOps is and what an application must offer to be operated. The analogy separates the two, and the table shows, item by item, how a Node.js application helps the team.",
    resposta30s:
      "**DevOps** is a culture and a set of practices that bring development and operations together to ship small, frequent, safe changes; it is not an “app role” or a tool. What a Node.js application does is be **operable**: a reproducible build (lockfile), per-environment configuration, **health checks**, **logs, metrics and traces**, **graceful shutdown**, a container and a CI/CD pipeline. Node.js also serves as a DevOps **tool**, in scripts, CLIs and automation.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a race car and its pit crew. Changing tires in a few seconds is only possible because the car was designed for it: standardized lug nuts, a dashboard showing temperature and pressure, planned access points. And it only works because designers and mechanics talk from the design stage, instead of one throwing the car over the wall to the other.",
        tecnico:
          "**DevOps** brings those who develop and those who operate together around a common goal: shipping small, frequent, safe changes, with fast feedback and shared responsibility (many teams adopt “you build it, you run it”). Automation, CI/CD and infrastructure as code are means, not the end. Hence an application’s role: be easy to **build, configure, deploy, observe and recover**. And Node.js comes in twice: as an application to be operated and as a tool for automating.",
        limite:
          "The analogy makes DevOps look like just the pit stop. In practice it is the whole race, and the car is never finished: the team learns from every lap (incidents, metrics) and changes the design. DevOps is also not a job title or a tool you buy: hiring someone “for DevOps” doesn’t create the culture.",
      },
      {
        tipo: "tabela",
        titulo: "What a Node.js application offers to be operable",
        colunas: ["Capability", "How the application provides it", "Where to study"],
        linhas: [
          [
            "Reproducible build",
            "A committed lockfile, `npm ci` and a pinned Node.js version (`.nvmrc`, `engines`)",
            "L16 and T54",
          ],
          [
            "Per-environment configuration",
            "Environment variables validated at startup and no secrets in the code",
            "L20 and L126",
          ],
          ["Health checks", "“Alive” and “ready” routes for the load balancer and the orchestrator", "L115"],
          ["Structured logs", "JSON on `stdout`, with a correlation id per request", "L117"],
          [
            "Metrics and traces",
            "Latency, errors, saturation and event loop delay; instrumentation with OpenTelemetry",
            "L118",
          ],
          [
            "Graceful shutdown",
            "On `SIGTERM`, stops accepting connections, finishes what is in flight and closes pools",
            "L115",
          ],
          ["Container and CI/CD", "A lean image, non-root, built and promoted by a pipeline", "D58 and D89"],
          [
            "Infrastructure as code",
            "Environments described in versioned files, reviewed like the rest of the code",
            "D84",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Alive is not the same as ready",
        legenda: "JavaScript",
        codigo:
          'import { createServer } from "node:http";\n\nlet ready = false; // becomes true once the database and queues are connected\n\nconst server = createServer((req, res) => {\n  if (req.url === "/health") {\n    res.writeHead(200); // is the process alive?\n    res.end("alive");\n  } else if (req.url === "/ready") {\n    res.writeHead(ready ? 200 : 503); // can it take traffic?\n    res.end();\n  } else {\n    res.writeHead(404);\n    res.end();\n  }\n});\n\nserver.listen(3000, () => {\n  // connect to dependencies here and only then mark as ready\n  ready = true;\n});',
        nota: "The orchestrator restarts the process when the “alive” route fails and stops sending traffic while the “ready” route fails. Check the probe names and configuration in your platform’s documentation.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Node.js as a DevOps tool",
        texto:
          "npm and the runtime also automate the team’s work: scripts in `package.json`, your own CLIs (with libraries such as `commander` or `yargs`), migration and deploy scripts, custom CI actions written in JavaScript, build tools and infrastructure as code in TypeScript (Pulumi, AWS CDK). Advantages: the team already knows the language, `npx` runs tools without installing them, and asynchronous I/O makes it easy to talk to several APIs at once.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Culture, not a job title",
        texto:
          "The question probably means “what the application needs for the DevOps practice to work”: DevOps itself is not an app role, it is a way of working. In an interview, answer on both levels: the practice (short cycles, automation, feedback, shared responsibility) and what the application offers to be operated. Avoid reducing DevOps to “having a pipeline” or “using Docker”.",
      },
    ],
    armadilhas: [
      "Reducing DevOps to tools (Docker, Jenkins, Kubernetes) and ignoring the cultural side: shared responsibility, short cycles and learning from incidents.",
      "Delivering an application that only works on its author’s machine: no lockfile, no pinned Node.js version and configuration inside the code.",
      "Writing a health check that only says “the process exists” and doesn’t reflect readiness (database connected, queues available).",
      "Having no observability: without structured logs, metrics and traces, operations work blind and recovery time grows.",
    ],
    autoteste: [
      {
        pergunta: "In one sentence, what is DevOps?",
        resposta:
          "A culture and a set of practices that unite development and operations, with automation and fast feedback, to ship small, safe changes with shared responsibility.",
      },
      {
        pergunta: "What does a Node.js application need to offer to be easy to operate?",
        resposta:
          "A reproducible build, configuration through environment variables, liveness and readiness health checks, structured logs, metrics and traces, graceful shutdown and container packaging with an automated pipeline.",
      },
    ],
  },
};
