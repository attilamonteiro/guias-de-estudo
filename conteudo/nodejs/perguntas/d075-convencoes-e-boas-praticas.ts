import type { Pergunta } from "../../tipos";

// D75 · Convenções e boas práticas
export const d075: Pergunta = {
  numero: 375,
  modulo: "devinterview-integracoes",
  metodo: "playbook",
  pt: {
    titulo: "Convenções e boas práticas",
    pergunta: "Quais são algumas convenções de código e boas práticas no Node.js?",
    porqueEsteMetodo:
      "“Boas práticas” viram uma lista solta e fácil de esquecer. Um playbook as ordena como um checklist de projeto, do começo ao encerramento, com um critério verificável para cada passo.",
    resposta30s:
      "Organize o projeto por funcionalidade, automatize **lint e formatação**, use `async`/`await` com tratamento de erros e **nunca bloqueie o laço de eventos**. Leia a configuração do **ambiente** e valide a entrada, registre **logs estruturados**, mantenha o **lockfile** e as dependências sob controle e escreva **testes**. Termine com **desligamento gracioso**. Uma convenção boa é a que uma ferramenta confere no CI.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Checklist de um projeto Node.js",
        passos: [
          {
            titulo: "Estruture e padronize",
            texto:
              "Organize por funcionalidade, não só por camada (veja L97), com arquivos pequenos e de um assunto. Adote lint e formatador (veja D77) e rode os dois no CI. Nomes: `camelCase` para variáveis e funções, `PascalCase` para classes e um padrão único para arquivos. Isso é convenção da comunidade, não regra do Node: o que importa é o time seguir uma só.",
          },
          {
            titulo: "Fixe o ambiente de execução",
            texto:
              "Use o prefixo `node:` nos módulos embutidos (`node:fs`), declare `engines` e um `.nvmrc`, escolha ESM ou CommonJS e seja consistente, versione o **lockfile** (veja T22) e instale com `npm ci` no CI e no build.",
          },
          {
            titulo: "Escreva o assíncrono com cuidado",
            texto:
              "`async`/`await` com `try/catch` nos pontos certos, nenhuma promise solta e erros como `Error` (ou subclasses, com `cause`). Nunca bloqueie o laço: `*Sync` só na inicialização e trabalho pesado de CPU em `worker_threads` ou fora do processo (veja T28).",
          },
          {
            titulo: "Configure por ambiente",
            texto:
              "Leia `process.env` em um só lugar, **valide na partida** e falhe cedo se faltar algo (veja L20). Segredos nunca vão para o repositório nem para os logs (veja L126).",
          },
          {
            titulo: "Valide entradas e registre logs estruturados",
            texto:
              "Toda entrada externa passa por um esquema (Zod, Ajv). Os logs saem em JSON no `stdout`, com nível e id de correlação, sem dados sensíveis (veja L117).",
          },
          {
            titulo: "Cuide das dependências",
            texto:
              "Poucas e conhecidas, com `npm audit`, atualização contínua (Dependabot ou Renovate) e atenção aos scripts de instalação (veja L131).",
          },
          {
            titulo: "Teste, tipe e encerre bem",
            texto:
              "Testes automatizados no CI (runner nativo, Jest ou Vitest), tipos com TypeScript (veja D69) ou JSDoc com `checkJs`, e **desligamento gracioso**: no `SIGTERM`, pare de aceitar conexões, termine o que está em curso e feche pools (veja L115).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Convenções em miniatura",
        legenda: "JavaScript",
        codigo: `import { createServer } from "node:http"; // prefixo node: nos módulos embutidos

const porta = Number(process.env.PORT ?? 3000); // configuração vem do ambiente
if (!Number.isInteger(porta)) throw new Error("PORT inválida"); // falha cedo, na partida

const server = createServer(async (req, res) => {
  try {
    res.end("ok"); // aqui entraria o trabalho assíncrono, com await
  } catch (erro) {
    console.error(JSON.stringify({ nivel: "erro", mensagem: erro.message })); // log estruturado
    res.statusCode = 500;
    res.end();
  }
}).listen(porta);

process.on("SIGTERM", () => server.close(() => process.exit(0))); // desligamento gracioso`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Convenção só vale se for automática",
        texto:
          "Regra que depende da memória do revisor se perde. Transforme as convenções em **ferramentas**: lint e formatador no pre-commit e no CI, `npm ci`, testes e validação da configuração na partida. Se o CI não reprova, é só uma sugestão.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Estilo não é correção",
        texto:
          "Nomes e formatação se discutem uma vez e depois se automatizam. O que protege o sistema são as regras de comportamento: erros tratados, laço livre, entrada validada e segredos fora do código. Não gaste a revisão com o que uma ferramenta confere.",
      },
    ],
    armadilhas: [
      "Tratar convenções de nome como regras do Node: elas são acordos do time, e o Node não as impõe.",
      "Usar funções `*Sync` ou laços pesados no código de requisição: um único caso trava todos os usuários.",
      "Ler `process.env` espalhado pelo código, sem validar: o erro aparece tarde, longe da causa.",
      "Não versionar o lockfile ou instalar com `npm install` no CI: duas máquinas, duas árvores de dependências.",
    ],
    autoteste: [
      {
        pergunta: "Por que validar a configuração na partida?",
        resposta:
          "Porque falhar cedo, com uma mensagem clara, é melhor do que descobrir uma variável ausente no meio de uma requisição, horas depois do deploy.",
      },
      {
        pergunta: "Para que servem o prefixo `node:` e o campo `engines`?",
        resposta:
          "O prefixo deixa claro que o módulo é embutido do Node, e não um pacote do npm com o mesmo nome. O `engines` declara as versões de Node para as quais o projeto foi feito, e o npm ou o CI podem avisar quando há divergência.",
      },
    ],
  },
  en: {
    titulo: "Conventions and best practices",
    pergunta: "What are some coding conventions and best practices in Node.js?",
    porqueEsteMetodo:
      "“Best practices” turn into a loose list that is easy to forget. A playbook orders them as a project checklist, from start to shutdown, with a verifiable criterion for each step.",
    resposta30s:
      "Organize the project by feature, automate **linting and formatting**, use `async`/`await` with error handling and **never block the event loop**. Read configuration from the **environment** and validate input, write **structured logs**, keep the **lockfile** and dependencies under control and write **tests**. Finish with a **graceful shutdown**. A good convention is one that a tool checks in CI.",
    blocos: [
      {
        tipo: "passos",
        titulo: "A Node.js project checklist",
        passos: [
          {
            titulo: "Structure and standardize",
            texto:
              "Organize by feature, not only by layer (see L97), with small, single-topic files. Adopt a linter and a formatter (see D77) and run both in CI. Names: `camelCase` for variables and functions, `PascalCase` for classes and a single pattern for file names. This is community convention, not a Node rule: what matters is that the team follows one.",
          },
          {
            titulo: "Pin the runtime environment",
            texto:
              "Use the `node:` prefix on built-in modules (`node:fs`), declare `engines` and an `.nvmrc`, pick ESM or CommonJS and stay consistent, commit the **lockfile** (see T22) and install with `npm ci` in CI and in the build.",
          },
          {
            titulo: "Write async code carefully",
            texto:
              "`async`/`await` with `try/catch` in the right places, no floating promises and errors as `Error` (or subclasses, with `cause`). Never block the loop: `*Sync` only at startup and heavy CPU work in `worker_threads` or outside the process (see T28).",
          },
          {
            titulo: "Configure per environment",
            texto:
              "Read `process.env` in one place, **validate at startup** and fail early if something is missing (see L20). Secrets never go into the repository or the logs (see L126).",
          },
          {
            titulo: "Validate input and write structured logs",
            texto:
              "Every external input goes through a schema (Zod, Ajv). Logs go out as JSON on `stdout`, with a level and a correlation id, and no sensitive data (see L117).",
          },
          {
            titulo: "Look after dependencies",
            texto:
              "Few and well known, with `npm audit`, continuous updates (Dependabot or Renovate) and attention to install scripts (see L131).",
          },
          {
            titulo: "Test, type and shut down well",
            texto:
              "Automated tests in CI (the built-in runner, Jest or Vitest), types with TypeScript (see D69) or JSDoc with `checkJs`, and a **graceful shutdown**: on `SIGTERM`, stop accepting connections, finish what is in flight and close pools (see L115).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Conventions in miniature",
        legenda: "JavaScript",
        codigo: `import { createServer } from "node:http"; // node: prefix on built-in modules

const port = Number(process.env.PORT ?? 3000); // configuration comes from the environment
if (!Number.isInteger(port)) throw new Error("Invalid PORT"); // fail early, at startup

const server = createServer(async (req, res) => {
  try {
    res.end("ok"); // the async work, with await, would go here
  } catch (error) {
    console.error(JSON.stringify({ level: "error", message: error.message })); // structured log
    res.statusCode = 500;
    res.end();
  }
}).listen(port);

process.on("SIGTERM", () => server.close(() => process.exit(0))); // graceful shutdown`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A convention only counts if it is automatic",
        texto:
          "A rule that depends on the reviewer’s memory gets lost. Turn conventions into **tools**: a linter and a formatter in pre-commit and CI, `npm ci`, tests and configuration validation at startup. If CI does not fail on it, it is only a suggestion.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Style is not correctness",
        texto:
          "Names and formatting are discussed once and then automated. What protects the system are the behavioral rules: handled errors, a free loop, validated input and secrets kept out of the code. Do not spend review time on what a tool can check.",
      },
    ],
    armadilhas: [
      "Treating naming conventions as Node rules: they are team agreements, and Node does not enforce them.",
      "Using `*Sync` functions or heavy loops in request code: a single case freezes every user.",
      "Reading `process.env` scattered through the code, without validating: the error shows up late, far from the cause.",
      "Not committing the lockfile or installing with `npm install` in CI: two machines, two dependency trees.",
    ],
    autoteste: [
      {
        pergunta: "Why validate configuration at startup?",
        resposta:
          "Because failing early with a clear message beats discovering a missing variable in the middle of a request, hours after the deploy.",
      },
      {
        pergunta: "What are the `node:` prefix and the `engines` field for?",
        resposta:
          "The prefix makes it clear the module is built into Node and not an npm package with the same name. `engines` declares the Node versions the project was built for, and npm or CI can warn when there is a mismatch.",
      },
    ],
  },
};
