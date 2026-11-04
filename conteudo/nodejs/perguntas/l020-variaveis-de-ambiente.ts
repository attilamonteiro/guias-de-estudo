import type { Pergunta } from "../../tipos";

// L20 · Variáveis de ambiente
export const l020: Pergunta = {
  numero: 120,
  modulo: "linkedin-fundamentos",
  metodo: "playbook",
  pt: {
    titulo: "Variáveis de ambiente",
    pergunta: "O que são variáveis de ambiente?",
    porqueEsteMetodo:
      "A definição cabe numa frase; o que importa é a rotina segura de usar variáveis de ambiente (ler, definir, validar, separar por ambiente e proteger segredos). Isso é uma sequência de passos, cada um com um critério de acerto.",
    resposta30s:
      "**Variáveis de ambiente** são pares nome=valor que o sistema operacional entrega ao processo na partida. No Node.js você as lê em **`process.env`**, e todo valor é **texto**. Servem para configurar a aplicação por ambiente (porta, URL do banco, chaves) **sem mudar o código**, como no 12-factor app: defina fora do código, **valide na partida** e **nunca versione segredos**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: usar variáveis de ambiente com segurança",
        passos: [
          {
            titulo: "Entenda o que chega: texto",
            texto:
              'Com `PORT=3000`, `process.env.PORT` vale `"3000"` (uma string), e uma variável ausente é `undefined`. Atribuir a `process.env` também converte o valor para texto. O processo filho herda o ambiente do pai. Sinal de acerto: você sabe que `"false"` é verdadeiro num `if` e converte tudo de forma explícita.',
          },
          {
            titulo: "Defina fora do código",
            texto:
              'No terminal (`PORT=3000 node app.js` no bash; `$env:PORT = "3000"` no PowerShell), no painel da plataforma ou do orquestrador, ou num arquivo `.env` carregado com `node --env-file=.env app.js` ou com o pacote dotenv. A flag `--env-file` existe em versões recentes; confira a documentação da sua versão em nodejs.org. Critério: o mesmo código roda em outra máquina mudando só o ambiente.',
          },
          {
            titulo: "Centralize a leitura e valide na partida",
            texto:
              "Um módulo de configuração lê, converte e valida tudo uma única vez. Se faltar algo, o processo falha ao subir, com uma mensagem clara, em vez de quebrar na primeira requisição que usar a variável. Esquemas como Zod ou Joi ajudam. Sinal de acerto: nenhum `process.env` espalhado pelo resto do código.",
          },
          {
            titulo: "Separe a configuração por ambiente",
            texto:
              'O mesmo artefato (a mesma build) roda em desenvolvimento, teste e produção; só o ambiente muda (princípio do 12-factor). `NODE_ENV` é uma convenção que bibliotecas como o Express leem para otimizar; não use `if (process.env.NODE_ENV === "production")` para trocar regra de negócio.',
          },
          {
            titulo: "Proteja os segredos",
            texto:
              "Coloque o `.env` no `.gitignore` e versione só um `.env.example` com os nomes e valores falsos. Em produção, use um gerenciador de segredos ou os segredos da plataforma (veja L126). Nunca imprima o `process.env` inteiro nos logs. Critério: nenhum segredo no repositório nem no histórico.",
          },
          {
            titulo: "Teste a falha e documente",
            texto:
              "Suba a aplicação com cada variável obrigatória ausente e com valores inválidos, e confirme que ela recusa a partida. Documente nome, formato, valor padrão e obrigatoriedade de cada variável no README ou no `.env.example`.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Ler, converter e validar uma vez",
        legenda: "config.js",
        codigo: [
          'const obrigatorias = ["DATABASE_URL", "JWT_SECRET"];',
          "const ausentes = obrigatorias.filter((nome) => !process.env[nome]);",
          "if (ausentes.length > 0) {",
          '  throw new Error(`Variáveis de ambiente ausentes: ${ausentes.join(", ")}`);',
          "}",
          "",
          "const porta = Number(process.env.PORT ?? 3000);",
          'if (!Number.isInteger(porta)) throw new Error("PORT deve ser um número inteiro");',
          "",
          "export const config = {",
          "  porta,",
          '  depuracao: process.env.DEBUG === "true", // "false" é texto, e texto não vazio é truthy',
          "  databaseUrl: process.env.DATABASE_URL,",
          "  jwtSecret: process.env.JWT_SECRET,",
          "};",
        ].join("\n"),
        nota: "O resto da aplicação importa `config`; ninguém mais lê `process.env`. Se algo estiver errado, o processo cai na partida, com a causa na mensagem.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Três regras",
        texto:
          "**Tudo é texto**: converta e valide. **Falhe cedo**: confira na partida, não na primeira requisição. **Segredo fora do repositório**: variável de ambiente é a forma de entregar o segredo ao processo, não de guardá-lo.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Variável de ambiente não é um cofre",
        texto:
          "As variáveis aparecem em despejos do processo, em painéis de depuração e em logs de erro, e são herdadas pelos processos filhos. Para segredos de alto valor, prefira um gerenciador de segredos com rotação e acesso auditado. Em aplicações que geram JavaScript para o navegador, variáveis injetadas pelo bundler ficam visíveis a qualquer pessoa: nunca coloque um segredo nelas. Se um segredo vazou, apagar o arquivo não basta: revogue e troque a credencial.",
      },
    ],
    armadilhas: [
      'Tratar o valor como número ou booleano: `"false"` é verdadeiro num `if` e `"3000"` não é número. Converta e valide.',
      "Versionar o `.env`: o segredo fica no histórico do git. É preciso revogar a credencial, não só apagar o arquivo.",
      "Ler `process.env.NOME` em vários pontos do código: um nome digitado errado vira `undefined` em silêncio. Centralize num módulo de configuração.",
      "Imprimir `process.env` ou o objeto de configuração inteiro nos logs, vazando segredos.",
    ],
    autoteste: [
      {
        pergunta: "Por que `if (process.env.DEBUG)` entra no bloco quando `DEBUG=false`?",
        resposta:
          'Porque o valor é a string `"false"`, que não é vazia e, portanto, é verdadeira. Compare com `=== "true"` ou converta de forma explícita.',
      },
      {
        pergunta: "O que significa validar as variáveis na partida e por que isso importa?",
        resposta:
          "Conferir, ao subir o processo, se as obrigatórias existem e têm o formato esperado, e recusar a partida se não tiverem. Assim, o erro aparece na hora do deploy, com a causa clara, e não numa requisição de usuário.",
      },
    ],
  },
  en: {
    titulo: "Environment variables",
    pergunta: "What are environment variables?",
    porqueEsteMetodo:
      "The definition fits in one sentence; what matters is the safe routine for using environment variables (reading, setting, validating, separating by environment and protecting secrets). That is a sequence of steps, each with a success criterion.",
    resposta30s:
      "**Environment variables** are name=value pairs the operating system hands to a process at startup. In Node.js you read them from **`process.env`**, and every value is **text**. They configure the application per environment (port, database URL, keys) **without changing the code**, as in the 12-factor app: set them outside the code, **validate at startup** and **never commit secrets**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: using environment variables safely",
        passos: [
          {
            titulo: "Understand what arrives: text",
            texto:
              'With `PORT=3000`, `process.env.PORT` is `"3000"` (a string), and a missing variable is `undefined`. Assigning to `process.env` also converts the value to text. A child process inherits its parent’s environment. A sign you got it: you know `"false"` is truthy in an `if` and you convert everything explicitly.',
          },
          {
            titulo: "Set them outside the code",
            texto:
              'In the terminal (`PORT=3000 node app.js` in bash; `$env:PORT = "3000"` in PowerShell), in the platform or orchestrator dashboard, or in a `.env` file loaded with `node --env-file=.env app.js` or with the dotenv package. The `--env-file` flag exists in recent versions; check the documentation for your version on nodejs.org. Criterion: the same code runs on another machine by changing only the environment.',
          },
          {
            titulo: "Centralize reading and validate at startup",
            texto:
              "A configuration module reads, converts and validates everything once. If something is missing, the process fails on startup with a clear message, instead of breaking on the first request that uses the variable. Schemas such as Zod or Joi help. A sign you got it: no `process.env` scattered through the rest of the code.",
          },
          {
            titulo: "Separate configuration by environment",
            texto:
              'The same artifact (the same build) runs in development, test and production; only the environment changes (the 12-factor principle). `NODE_ENV` is a convention that libraries such as Express read to optimize; do not use `if (process.env.NODE_ENV === "production")` to switch business rules.',
          },
          {
            titulo: "Protect the secrets",
            texto:
              "Put `.env` in `.gitignore` and commit only a `.env.example` with names and fake values. In production, use a secrets manager or the platform’s secrets (see L126). Never print the whole `process.env` to the logs. Criterion: no secret in the repository or in its history.",
          },
          {
            titulo: "Test the failure and document",
            texto:
              "Start the application with each required variable missing and with invalid values, and confirm it refuses to start. Document each variable’s name, format, default value and whether it is required in the README or in `.env.example`.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Read, convert and validate once",
        legenda: "config.js",
        codigo: [
          'const required = ["DATABASE_URL", "JWT_SECRET"];',
          "const missing = required.filter((name) => !process.env[name]);",
          "if (missing.length > 0) {",
          '  throw new Error(`Missing environment variables: ${missing.join(", ")}`);',
          "}",
          "",
          "const port = Number(process.env.PORT ?? 3000);",
          'if (!Number.isInteger(port)) throw new Error("PORT must be an integer");',
          "",
          "export const config = {",
          "  port,",
          '  debug: process.env.DEBUG === "true", // "false" is text, and non-empty text is truthy',
          "  databaseUrl: process.env.DATABASE_URL,",
          "  jwtSecret: process.env.JWT_SECRET,",
          "};",
        ].join("\n"),
        nota: "The rest of the application imports `config`; nobody else reads `process.env`. If something is wrong, the process dies at startup, with the cause in the message.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Three rules",
        texto:
          "**Everything is text**: convert and validate. **Fail early**: check at startup, not on the first request. **Secrets stay out of the repository**: an environment variable is a way to deliver the secret to the process, not to store it.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "An environment variable is not a vault",
        texto:
          "Variables show up in process dumps, in debugging panels and in error logs, and child processes inherit them. For high-value secrets, prefer a secrets manager with rotation and audited access. In applications that generate JavaScript for the browser, variables injected by the bundler are visible to anyone: never put a secret in them. If a secret leaked, deleting the file is not enough: revoke and replace the credential.",
      },
    ],
    armadilhas: [
      'Treating the value as a number or a boolean: `"false"` is truthy in an `if` and `"3000"` is not a number. Convert and validate.',
      "Committing `.env`: the secret stays in the git history. You must revoke the credential, not just delete the file.",
      "Reading `process.env.NAME` in many places in the code: a misspelled name becomes `undefined` silently. Centralize it in a configuration module.",
      "Printing `process.env` or the whole configuration object to the logs, leaking secrets.",
    ],
    autoteste: [
      {
        pergunta: "Why does `if (process.env.DEBUG)` enter the block when `DEBUG=false`?",
        resposta:
          'Because the value is the string `"false"`, which is not empty and therefore truthy. Compare with `=== "true"` or convert explicitly.',
      },
      {
        pergunta: "What does validating variables at startup mean and why does it matter?",
        resposta:
          "Checking, when the process starts, that the required ones exist and have the expected format, and refusing to start if they do not. That way the error shows up at deploy time, with a clear cause, not on a user’s request.",
      },
    ],
  },
};
