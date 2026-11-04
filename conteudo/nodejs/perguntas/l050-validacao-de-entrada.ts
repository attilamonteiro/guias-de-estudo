import type { Pergunta } from "../../tipos";

// L50 · Validação de entrada
export const l050: Pergunta = {
  numero: 150,
  modulo: "linkedin-express",
  metodo: "compare",
  pt: {
    titulo: "Validação de entrada",
    pergunta: "Como você valida a entrada de uma API?",
    porqueEsteMetodo:
      "Há várias ferramentas e etapas que parecem intercambiáveis (Zod, Joi, Ajv; validar, normalizar, sanitizar). A matriz coloca cada uma ao lado das outras e a regra de decisão diz onde e como validar.",
    resposta30s:
      "Valide **no servidor, na borda da API**, com um **esquema** declarativo (Zod, Joi ou Ajv com JSON Schema) que confere tipo, formato, intervalo e **tamanho** de tudo o que vem de fora: corpo, query, parâmetros de rota e cabeçalhos. Aceite só o que o esquema permite (**allowlist**), rejeite o resto com `400` ou `422` e uma lista de erros por campo, e entregue ao restante do código o dado já validado. Validar não substitui consulta parametrizada nem escape na saída.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Bibliotecas de esquema",
        colunas: ["Aspecto", "Zod", "Joi", "Ajv + JSON Schema"],
        linhas: [
          [
            "Como se descreve o esquema",
            "Código TypeScript encadeado (`z.object({...})`)",
            "Código JavaScript encadeado (`Joi.object({...})`)",
            "Documento JSON Schema (dados), compilado numa função validadora",
          ],
          [
            "Tipos TypeScript",
            "Inferidos do esquema (`z.infer`): uma única fonte de verdade",
            "Costumam ser escritos à parte do esquema",
            "Precisam de ferramenta auxiliar para gerar ou conferir os tipos",
          ],
          [
            "Reaproveitamento",
            "Ecossistema TypeScript; conversão para JSON Schema por bibliotecas auxiliares",
            "Ecossistema JavaScript maduro, com muita base instalada",
            "Padrão aberto, reaproveitável na documentação OpenAPI; o Fastify, por exemplo, valida por JSON Schema",
          ],
          [
            "Quando escolher",
            "Projeto TypeScript que quer tipo e validação no mesmo lugar",
            "Base JavaScript que já usa Joi",
            "Contrato compartilhado entre serviços ou linguagens, ou framework que já valida por JSON Schema",
          ],
        ],
        nota: "As APIs mudam entre versões principais das bibliotecas: confira a documentação da versão que você usa.",
      },
      {
        tipo: "tabela",
        titulo: "Validar, normalizar e sanitizar",
        colunas: ["Etapa", "O que faz", "Exemplo", "Se falhar"],
        linhas: [
          [
            "Validar",
            "Confere se o dado cumpre o contrato e rejeita o que não cumpre",
            "`idade` é inteiro entre 0 e 130; `papel` é “leitor” ou “editor”",
            "Resposta `400` ou `422`; nada é processado",
          ],
          [
            "Normalizar",
            "Converte para a forma canônica antes de usar",
            "`trim()`, e-mail em minúsculas, o texto “42” da query virando número",
            "Se a conversão não der um valor válido, também rejeita",
          ],
          [
            "Sanitizar / escapar",
            "Neutraliza o dado conforme o destino em que ele será usado",
            "Escape de HTML na saída; parâmetros em vez de concatenar SQL",
            "É defesa em profundidade: não substitui a validação",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Middleware de validação com Zod",
        legenda: "JavaScript (Express + Zod)",
        codigo:
          'import { z } from "zod";\n\nconst NovoUsuario = z.object({\n  nome: z.string().trim().min(1).max(80),\n  idade: z.coerce.number().int().min(0).max(130),\n  papel: z.enum(["leitor", "editor"]),\n}).strict(); // campo desconhecido é rejeitado\n\nconst validar = (esquema) => (req, res, next) => {\n  const r = esquema.safeParse(req.body);\n  if (!r.success) {\n    const erros = r.error.issues.map((i) => ({ campo: i.path.join("."), mensagem: i.message }));\n    return res.status(422).json({ erros });\n  }\n  req.body = r.data; // só o dado validado segue adiante\n  next();\n};\n\napp.post("/usuarios", express.json({ limit: "10kb" }), validar(NovoUsuario), criarUsuario);',
        nota: "O limite do `express.json` barra corpos enormes antes mesmo da validação. O mesmo padrão vale para `req.query` e `req.params`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Valide **na borda**, antes de qualquer regra de negócio ou acesso a dados, e **no servidor**: a validação do front-end é só conforto de uso. Prefira **allowlist** (aceitar o que é conhecido) a blacklist, **rejeite** em vez de “consertar” e ponha **limites** em tudo: bytes do corpo, comprimento de strings, itens de arrays, profundidade. Use `400` para requisição malformada (JSON quebrado, tipo errado) e `422` quando a sintaxe está certa mas os valores violam as regras; o essencial é escolher um padrão e repeti-lo em todos os endpoints (veja L55).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Validar não é limpar, e nenhum dos dois é a defesa inteira",
        texto:
          "Tentar “limpar” `<script>` ou aspas com regex falha. A defesa certa é o **escape no contexto de saída**: SQL parametrizado, HTML escapado, comando sem concatenação (veja L123 e L124). Cuidado também com regex de validação mal escrita, que pode travar o laço de eventos (ReDoS), e com esquemas que aceitam “qualquer coisa” num campo.",
      },
    ],
    armadilhas: [
      "Confiar na validação do front-end: qualquer pessoa chama a API direto, com `curl` ou um script.",
      "Validar só o corpo e esquecer `query`, parâmetros de rota, cabeçalhos e arquivos enviados.",
      "Aceitar campos extras e gravar o objeto inteiro (mass assignment): alguém envia `papel: “admin”` e vira administrador. Use esquema estrito ou escolha os campos um a um.",
      "Não limitar tamanho: uma string de dezenas de MB, um array com milhões de itens ou um JSON muito aninhado derrubam o processo antes de a regra de negócio rodar.",
    ],
    autoteste: [
      {
        pergunta: "Por que validar no servidor se o formulário do front-end já valida?",
        resposta:
          "Porque o servidor não controla o cliente: qualquer pessoa envia requisições à mão, sem passar pelo formulário. A validação do front-end melhora a experiência; só a do servidor protege.",
      },
      {
        pergunta: "Qual é a diferença entre validar e sanitizar?",
        resposta:
          "Validar decide se o dado é aceitável e rejeita o que não for. Sanitizar (ou escapar) neutraliza o dado para o lugar em que será usado, como HTML ou SQL. Um não substitui o outro.",
      },
    ],
  },
  en: {
    titulo: "Input validation",
    pergunta: "How do you validate API input?",
    porqueEsteMetodo:
      "Several tools and stages look interchangeable (Zod, Joi, Ajv; validate, normalize, sanitize). The matrix puts each one beside the others and the decision rule says where and how to validate.",
    resposta30s:
      "Validate **on the server, at the edge of the API**, with a declarative **schema** (Zod, Joi, or Ajv with JSON Schema) that checks type, format, range and **size** of everything that comes from outside: body, query, route params and headers. Accept only what the schema allows (an **allowlist**), reject the rest with `400` or `422` and a per-field error list, and hand the rest of the code data that is already validated. Validation does not replace parameterized queries or output escaping.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Schema libraries",
        colunas: ["Aspect", "Zod", "Joi", "Ajv + JSON Schema"],
        linhas: [
          [
            "How the schema is described",
            "Chained TypeScript code (`z.object({...})`)",
            "Chained JavaScript code (`Joi.object({...})`)",
            "A JSON Schema document (data), compiled into a validator function",
          ],
          [
            "TypeScript types",
            "Inferred from the schema (`z.infer`): a single source of truth",
            "Usually written separately from the schema",
            "Need a helper tool to generate or check the types",
          ],
          [
            "Reuse",
            "TypeScript ecosystem; conversion to JSON Schema through helper libraries",
            "Mature JavaScript ecosystem with a large installed base",
            "Open standard, reusable in OpenAPI documentation; Fastify, for example, validates with JSON Schema",
          ],
          [
            "When to pick it",
            "A TypeScript project that wants type and validation in one place",
            "A JavaScript codebase that already uses Joi",
            "A contract shared across services or languages, or a framework that already validates with JSON Schema",
          ],
        ],
        nota: "Library APIs change between major versions: check the documentation of the version you use.",
      },
      {
        tipo: "tabela",
        titulo: "Validate, normalize and sanitize",
        colunas: ["Stage", "What it does", "Example", "If it fails"],
        linhas: [
          [
            "Validate",
            "Checks that the data meets the contract and rejects what does not",
            "`age` is an integer between 0 and 130; `role` is “reader” or “editor”",
            "`400` or `422` response; nothing is processed",
          ],
          [
            "Normalize",
            "Converts to the canonical form before use",
            "`trim()`, lowercase email, the text “42” from the query becoming a number",
            "If the conversion does not yield a valid value, it also rejects",
          ],
          [
            "Sanitize / escape",
            "Neutralizes the data for the place where it will be used",
            "HTML escaping on output; parameters instead of concatenating SQL",
            "It is defense in depth: it does not replace validation",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Validation middleware with Zod",
        legenda: "JavaScript (Express + Zod)",
        codigo:
          'import { z } from "zod";\n\nconst NewUser = z.object({\n  name: z.string().trim().min(1).max(80),\n  age: z.coerce.number().int().min(0).max(130),\n  role: z.enum(["reader", "editor"]),\n}).strict(); // unknown fields are rejected\n\nconst validate = (schema) => (req, res, next) => {\n  const r = schema.safeParse(req.body);\n  if (!r.success) {\n    const errors = r.error.issues.map((i) => ({ field: i.path.join("."), message: i.message }));\n    return res.status(422).json({ errors });\n  }\n  req.body = r.data; // only validated data moves on\n  next();\n};\n\napp.post("/users", express.json({ limit: "10kb" }), validate(NewUser), createUser);',
        nota: "The `express.json` limit rejects huge bodies even before validation runs. The same pattern applies to `req.query` and `req.params`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Validate **at the edge**, before any business rule or data access, and **on the server**: front-end validation is only a usability nicety. Prefer an **allowlist** (accept what is known) over a blocklist, **reject** instead of “fixing”, and put **limits** on everything: body bytes, string length, array items, nesting depth. Use `400` for a malformed request (broken JSON, wrong type) and `422` when the syntax is fine but the values break the rules; what matters is picking one convention and repeating it on every endpoint (see L55).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Validating is not cleaning, and neither is the whole defense",
        texto:
          "Trying to “clean” `<script>` or quotes with a regex fails. The right defense is **escaping for the output context**: parameterized SQL, escaped HTML, commands without concatenation (see L123 and L124). Also watch out for badly written validation regexes, which can freeze the event loop (ReDoS), and for schemas that accept “anything” in a field.",
      },
    ],
    armadilhas: [
      "Trusting front-end validation: anyone can call the API directly, with `curl` or a script.",
      "Validating only the body and forgetting `query`, route params, headers and uploaded files.",
      "Accepting extra fields and saving the whole object (mass assignment): someone sends `role: “admin”` and becomes an administrator. Use a strict schema or pick fields one by one.",
      "Not limiting size: a string of tens of MB, an array with millions of items or deeply nested JSON can take the process down before the business rule even runs.",
    ],
    autoteste: [
      {
        pergunta: "Why validate on the server if the front-end form already validates?",
        resposta:
          "Because the server does not control the client: anyone can send requests by hand, bypassing the form. Front-end validation improves the experience; only server validation protects.",
      },
      {
        pergunta: "What is the difference between validating and sanitizing?",
        resposta:
          "Validating decides whether the data is acceptable and rejects what is not. Sanitizing (or escaping) neutralizes the data for the place where it will be used, such as HTML or SQL. One does not replace the other.",
      },
    ],
  },
};
