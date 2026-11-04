import type { Pergunta } from "../../tipos";

// D72 · GraphQL com Node.js
export const d072: Pergunta = {
  numero: 372,
  modulo: "devinterview-integracoes",
  metodo: "compare",
  pt: {
    titulo: "GraphQL com Node.js",
    pergunta: "Explique como o GraphQL pode ser usado com o Node.js.",
    porqueEsteMetodo:
      "GraphQL é uma alternativa de desenho de API, e só se entende o que ele resolve ao compará-lo ao REST. Primeiro as peças de um servidor em Node.js, depois a matriz, a regra de decisão e os riscos que o acompanham.",
    resposta30s:
      "O GraphQL é uma linguagem de consulta para APIs: o servidor publica um **esquema tipado** (SDL) e o cliente pede, em **um endpoint**, exatamente os campos que quer. No Node.js você descreve o esquema, escreve **resolvers** (funções que obtêm cada campo) e o expõe com uma biblioteca como Apollo Server, GraphQL Yoga ou mercurius, usando o **DataLoader** para evitar o N+1. Compensa com vários clientes e dados em grafo; exige limites de profundidade e complexidade e autorização por campo.",
    blocos: [
      {
        tipo: "passos",
        titulo: "As peças de um servidor GraphQL em Node.js",
        passos: [
          {
            titulo: "1. Esquema (SDL)",
            texto:
              "O contrato, escrito na linguagem de esquema do GraphQL: tipos, campos e três pontos de entrada, `Query` (ler), `Mutation` (alterar) e `Subscription` (receber eventos, em geral sobre WebSocket ou SSE). Tudo é tipado, e `!` marca um campo obrigatório.",
          },
          {
            titulo: "2. Resolvers",
            texto:
              "Funções que dizem como obter cada campo, com os argumentos `(pai, args, contexto, info)`. Campo sem resolver usa a propriedade de mesmo nome do objeto pai. O `contexto` é criado a cada requisição e leva o usuário autenticado, conexões e loaders.",
          },
          {
            titulo: "3. Servidor",
            texto:
              "Uma biblioteca expõe o esquema em um endpoint HTTP (em geral `/graphql`), valida e executa a consulta. Apollo Server, GraphQL Yoga e mercurius (sobre o Fastify) são opções comuns, e há integração com Express e NestJS. Compare na documentação de cada um, sem ranquear.",
          },
          {
            titulo: "4. DataLoader contra o N+1",
            texto:
              "Cada campo é resolvido separadamente: listar 50 livros e pedir o autor de cada um geraria 50 buscas. O DataLoader reúne as chamadas feitas no mesmo ciclo do event loop em uma só (batching) e guarda os resultados em cache durante a requisição.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "GraphQL x REST",
        colunas: ["Aspecto", "GraphQL", "REST"],
        linhas: [
          [
            "Endpoints e formato",
            "Um endpoint; o cliente descreve a forma da resposta",
            "Vários endpoints por recurso; o servidor define a forma",
          ],
          [
            "Busca de dados",
            "O cliente pede só os campos que precisa e vários recursos relacionados em uma ida",
            "Respostas fixas: podem trazer a mais (over-fetching) ou exigir várias chamadas (under-fetching)",
          ],
          [
            "Cache HTTP",
            "Em geral um `POST` para um endpoint só: o cache HTTP e o CDN ajudam pouco; usam-se cache por id no cliente, consultas persistidas e cache por campo",
            "Um `GET` por URL: cache HTTP, `ETag` e CDN funcionam de graça",
          ],
          [
            "Contrato e tipos",
            "Esquema tipado e inspecionável; gera tipos, documentação e validação",
            "O contrato é opcional e descrito à parte (por exemplo, OpenAPI)",
          ],
          [
            "Evolução e versionamento",
            "Evolui acrescentando campos e marcando outros como `@deprecated`; versão na URL não é a regra",
            "Costuma versionar por URL ou cabeçalho (veja L52)",
          ],
          [
            "Riscos no servidor",
            "O cliente monta a consulta: ela pode ser profunda ou cara, e o N+1 está à espreita",
            "Rotas fixas, com custo mais previsível",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Esquema, resolvers e DataLoader por requisição",
        legenda: "JavaScript",
        codigo: `import DataLoader from "dataloader";

const typeDefs = /* GraphQL */ \`
  type Autor { id: ID!  nome: String! }
  type Livro { id: ID!  titulo: String!  autor: Autor! }
  type Query { livros: [Livro!]! }
\`;

// Contexto novo a cada requisição: o cache do DataLoader não pode vazar entre usuários
const criarContexto = () => ({
  autores: new DataLoader(async (ids) => {
    const linhas = await db.autores.buscarPorIds(ids); // UMA consulta para todos os ids
    return ids.map((id) => linhas.find((a) => a.id === id)); // mesma ordem dos ids
  }),
});

const resolvers = {
  Query: { livros: () => db.livros.todos() },
  Livro: { autor: (livro, _args, ctx) => ctx.autores.load(livro.autorId) },
};`,
        nota: "O objeto `db` representa a sua camada de dados. O esquema e os resolvers são entregues ao servidor escolhido (Apollo Server, GraphQL Yoga, mercurius); a forma exata de criar o contexto muda de uma biblioteca para outra.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "GraphQL compensa quando **vários clientes** (web, mobile, parceiros) precisam de recortes diferentes dos mesmos dados e quando os dados formam um **grafo** com muitas relações. REST segue melhor para APIs simples e públicas, com cache por URL, uploads, streaming e operações bem definidas. Os dois convivem: é comum um GraphQL agregando serviços REST por trás.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Segurança: o cliente monta a consulta",
        texto:
          "Limite **profundidade** e **complexidade** (custo por campo), tamanho e tempo de execução; em APIs privadas, considere consultas persistidas (lista permitida). Desligar a **introspecção** em produção é opcional e **não é segurança**: o esquema não é segredo, quem protege é a autorização. Aplique **autorização por campo e por objeto** nos resolvers ou no domínio, porque o mesmo dado pode ser alcançado por vários caminhos do grafo, e limite a taxa por custo, não só por requisição.",
      },
    ],
    armadilhas: [
      "Resolvers aninhados que consultam o banco um a um, sem DataLoader: a lista de 50 itens vira 51 consultas (N+1).",
      "Criar o DataLoader no escopo do módulo: o cache é compartilhado e pode vazar dados entre usuários; crie um por requisição.",
      "Autorizar só na consulta de entrada e não por campo ou objeto: o dado é exposto por outro caminho do grafo.",
      "Aceitar qualquer consulta, sem limite de profundidade ou custo, ou achar que desligar a introspecção protege a API.",
    ],
    autoteste: [
      {
        pergunta: "Como o DataLoader evita o problema N+1?",
        resposta:
          "Ele junta as chamadas `load(id)` feitas no mesmo ciclo do event loop em uma única função de lote, que busca todos os ids de uma vez e devolve os resultados na mesma ordem. Os resultados ficam em cache durante a requisição.",
      },
      {
        pergunta: "Por que o GraphQL exige limites de profundidade e complexidade, e o REST nem tanto?",
        resposta:
          "Porque no GraphQL o cliente decide a forma da consulta, que pode aninhar relações e pedir muito trabalho em uma única requisição. No REST, as rotas são fixas e o custo de cada uma é mais previsível.",
      },
    ],
  },
  en: {
    titulo: "GraphQL with Node.js",
    pergunta: "Explain how GraphQL can be used with Node.js.",
    porqueEsteMetodo:
      "GraphQL is an alternative way to design an API, and you only see what it solves by comparing it with REST. First the parts of a Node.js server, then the matrix, the decision rule and the risks that come with it.",
    resposta30s:
      "GraphQL is a query language for APIs: the server publishes a **typed schema** (SDL) and the client asks, at **a single endpoint**, for exactly the fields it wants. In Node.js you describe the schema, write **resolvers** (functions that fetch each field) and expose it with a library such as Apollo Server, GraphQL Yoga or mercurius, using **DataLoader** to avoid N+1. It pays off with several clients and graph-shaped data; it needs depth and complexity limits and field-level authorization.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The parts of a GraphQL server in Node.js",
        passos: [
          {
            titulo: "1. Schema (SDL)",
            texto:
              "The contract, written in GraphQL’s schema language: types, fields and three entry points, `Query` (read), `Mutation` (change) and `Subscription` (receive events, usually over WebSocket or SSE). Everything is typed, and `!` marks a required field.",
          },
          {
            titulo: "2. Resolvers",
            texto:
              "Functions that say how to get each field, with the arguments `(parent, args, context, info)`. A field with no resolver uses the property of the same name on the parent object. The `context` is created on every request and carries the authenticated user, connections and loaders.",
          },
          {
            titulo: "3. Server",
            texto:
              "A library exposes the schema at an HTTP endpoint (usually `/graphql`), validates and runs the query. Apollo Server, GraphQL Yoga and mercurius (on top of Fastify) are common options, and there is integration with Express and NestJS. Compare them in each one’s documentation, without ranking.",
          },
          {
            titulo: "4. DataLoader against N+1",
            texto:
              "Each field is resolved separately: listing 50 books and asking for each one’s author would trigger 50 lookups. DataLoader collects the calls made in the same event-loop cycle into one (batching) and caches the results during the request.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "GraphQL vs REST",
        colunas: ["Aspect", "GraphQL", "REST"],
        linhas: [
          [
            "Endpoints and shape",
            "One endpoint; the client describes the shape of the response",
            "Several endpoints per resource; the server defines the shape",
          ],
          [
            "Fetching data",
            "The client asks only for the fields it needs and for several related resources in one trip",
            "Fixed responses: they may bring too much (over-fetching) or require several calls (under-fetching)",
          ],
          [
            "HTTP caching",
            "Usually a `POST` to a single endpoint: HTTP caching and CDNs help little; use per-id client caches, persisted queries and per-field caching",
            "A `GET` per URL: HTTP caching, `ETag` and CDNs work for free",
          ],
          [
            "Contract and types",
            "A typed, inspectable schema; it generates types, documentation and validation",
            "The contract is optional and described separately (for example, OpenAPI)",
          ],
          [
            "Evolution and versioning",
            "Evolves by adding fields and marking others `@deprecated`; a URL version is not the rule",
            "Usually versions by URL or header (see L52)",
          ],
          [
            "Server-side risks",
            "The client builds the query: it can be deep or expensive, and N+1 lurks",
            "Fixed routes, with more predictable cost",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Schema, resolvers and a per-request DataLoader",
        legenda: "JavaScript",
        codigo: `import DataLoader from "dataloader";

const typeDefs = /* GraphQL */ \`
  type Author { id: ID!  name: String! }
  type Book { id: ID!  title: String!  author: Author! }
  type Query { books: [Book!]! }
\`;

// A new context for every request: the DataLoader cache must not leak between users
const createContext = () => ({
  authors: new DataLoader(async (ids) => {
    const rows = await db.authors.findByIds(ids); // ONE query for all the ids
    return ids.map((id) => rows.find((a) => a.id === id)); // same order as the ids
  }),
});

const resolvers = {
  Query: { books: () => db.books.all() },
  Book: { author: (book, _args, ctx) => ctx.authors.load(book.authorId) },
};`,
        nota: "The `db` object stands for your data layer. The schema and resolvers are handed to the server you choose (Apollo Server, GraphQL Yoga, mercurius); the exact way to create the context differs from one library to another.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "GraphQL pays off when **several clients** (web, mobile, partners) need different slices of the same data and when the data forms a **graph** with many relationships. REST remains better for simple, public APIs, with per-URL caching, uploads, streaming and well-defined operations. The two coexist: a GraphQL layer aggregating REST services behind it is common.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Security: the client builds the query",
        texto:
          "Limit **depth** and **complexity** (cost per field), size and execution time; for private APIs, consider persisted queries (an allowlist). Turning off **introspection** in production is optional and **is not security**: the schema is not a secret, authorization is what protects. Apply **field-level and object-level authorization** in the resolvers or the domain, because the same data can be reached through several paths of the graph, and rate-limit by cost, not only by request.",
      },
    ],
    armadilhas: [
      "Nested resolvers that hit the database one by one, with no DataLoader: a list of 50 items becomes 51 queries (N+1).",
      "Creating the DataLoader at module scope: the cache is shared and can leak data between users; create one per request.",
      "Authorizing only at the entry query and not per field or object: the data is exposed through another path of the graph.",
      "Accepting any query, with no depth or cost limit, or believing that turning off introspection protects the API.",
    ],
    autoteste: [
      {
        pergunta: "How does DataLoader avoid the N+1 problem?",
        resposta:
          "It gathers the `load(id)` calls made in the same event-loop cycle into a single batch function, which fetches all the ids at once and returns the results in the same order. The results stay cached during the request.",
      },
      {
        pergunta: "Why does GraphQL need depth and complexity limits, and REST much less so?",
        resposta:
          "Because in GraphQL the client decides the shape of the query, which can nest relations and ask for a lot of work in one request. In REST, the routes are fixed and the cost of each one is more predictable.",
      },
    ],
  },
};
