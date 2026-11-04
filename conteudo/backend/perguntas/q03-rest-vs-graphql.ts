import type { Pergunta } from "../../tipos";

// Q03 · REST vs GraphQL
export const q03: Pergunta = {
  numero: 3,
  modulo: "arquitetura",
  metodo: "compare",
  pt: {
    titulo: "REST vs GraphQL",
    pergunta: "O que são APIs RESTful e como elas diferem do GraphQL?",
    porqueEsteMetodo:
      "É um “X vs Y”: a matriz isola as diferenças e a regra de decisão diz em que cenário cada estilo é a escolha mais barata.",
    resposta30s:
      "**REST** modela a API como recursos com URLs e verbos HTTP (`GET /orders/42`), usa status codes e o cache do próprio HTTP. **GraphQL** expõe um único endpoint com esquema tipado, e o cliente descreve exatamente os campos que quer, evitando over e under-fetching. REST é simples, cacheável e universal; GraphQL brilha com vários clientes e dados em grafo, mas exige cuidado com custo de queries, N+1 e cache.",
    blocos: [
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que torna uma API “RESTful”",
        texto:
          "Seguir as restrições de REST: cliente-servidor, **stateless** (cada requisição carrega tudo de que precisa), cacheável, interface uniforme (recursos identificados por URL, manipulados com verbos HTTP de semântica correta) e em camadas. Devolver JSON por HTTP, sozinho, não torna uma API RESTful.",
      },
      {
        tipo: "codigo",
        titulo: "O mesmo dado nos dois estilos",
        legenda: "REST vs GraphQL",
        codigo:
          "# REST: 2 chamadas, campos que talvez você não use\nGET /users/42\nGET /users/42/orders?limit=3\n\n# GraphQL: 1 chamada, só os campos pedidos\nPOST /graphql\nquery {\n  user(id: 42) {\n    name\n    orders(first: 3) { id total }\n  }\n}",
      },
      {
        tipo: "tabela",
        colunas: ["Aspecto", "REST", "GraphQL"],
        linhas: [
          ["Endpoint", "Vários, um por recurso", "Um só (`/graphql`)"],
          ["Quem define a resposta", "O servidor (formato fixo por endpoint)", "O cliente (escolhe os campos)"],
          ["Over/under-fetching", "Comum: sobram campos ou faltam chamadas", "Evitado por desenho"],
          [
            "Cache",
            "Nativo do HTTP (CDN, ETag, `Cache-Control`)",
            "Difícil: tudo é `POST` num URL só; exige cache por ID ou queries persistidas",
          ],
          ["Contrato e tipos", "Opcional (OpenAPI)", "Esquema tipado obrigatório, com introspecção"],
          ["Versionamento", "`/v1`, `/v2` ou negociação", "Evolui o esquema; campos são depreciados"],
          [
            "Riscos",
            "Muitas viagens de rede",
            "Queries caras ou profundas (DoS), N+1 nos resolvers, autorização por campo",
          ],
          ["Tempo real", "SSE/WebSocket à parte", "Subscriptions"],
          [
            "Brilha em",
            "APIs públicas, CRUD, integrações, cache agressivo",
            "Muitas telas e clientes (web, mobile), agregação de várias fontes",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "API pública ou de integração simples, com cache importante: REST. Front-ends diferentes (web, iOS, Android) pedindo recortes distintos dos mesmos dados, ou um gateway agregando vários serviços: GraphQL (ou um BFF). Muitas empresas usam os dois.",
      },
    ],
    armadilhas: [
      "Chamar de REST uma API com `POST /getUser` que devolve 200 para tudo.",
      "GraphQL sem limite de profundidade, custo e paginação: uma única query pode derrubar o servidor.",
      "N+1 nos resolvers (uma consulta ao banco por item); a correção clássica é batching com DataLoader.",
      "Achar que GraphQL substitui o REST sempre: ele troca problemas, não os elimina.",
    ],
    autoteste: [
      {
        pergunta: "O que é over-fetching e como o GraphQL o evita?",
        resposta:
          "Receber mais campos do que a tela precisa. No GraphQL o cliente lista os campos que quer, então a resposta traz só eles.",
      },
      {
        pergunta: "Por que cache é mais difícil em GraphQL?",
        resposta:
          "Porque as consultas costumam ser `POST` para um único URL, então o cache HTTP/CDN não distingue uma query da outra; é preciso cache por ID de entidade ou queries persistidas.",
      },
    ],
  },
  en: {
    titulo: "REST vs GraphQL",
    pergunta: "What are RESTful APIs and how do they differ from GraphQL?",
    porqueEsteMetodo:
      "It is an “X vs Y” question: the matrix isolates the differences and the decision rule says in which scenario each style is the cheapest choice.",
    resposta30s:
      "**REST** models the API as resources with URLs and HTTP verbs (`GET /orders/42`), uses status codes and HTTP’s own caching. **GraphQL** exposes a single endpoint with a typed schema, and the client describes exactly the fields it wants, avoiding over- and under-fetching. REST is simple, cacheable and universal; GraphQL shines with many clients and graph-shaped data, but needs care with query cost, N+1 and caching.",
    blocos: [
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What makes an API “RESTful”",
        texto:
          "Following REST’s constraints: client-server, **stateless** (each request carries everything it needs), cacheable, uniform interface (resources identified by URL, manipulated with HTTP verbs of correct semantics) and layered. Returning JSON over HTTP alone does not make an API RESTful.",
      },
      {
        tipo: "codigo",
        titulo: "The same data in both styles",
        legenda: "REST vs GraphQL",
        codigo:
          "# REST: 2 calls, fields you may not use\nGET /users/42\nGET /users/42/orders?limit=3\n\n# GraphQL: 1 call, only the fields asked for\nPOST /graphql\nquery {\n  user(id: 42) {\n    name\n    orders(first: 3) { id total }\n  }\n}",
      },
      {
        tipo: "tabela",
        colunas: ["Aspect", "REST", "GraphQL"],
        linhas: [
          ["Endpoint", "Many, one per resource", "A single one (`/graphql`)"],
          ["Who shapes the response", "The server (fixed format per endpoint)", "The client (picks the fields)"],
          ["Over/under-fetching", "Common: extra fields or missing calls", "Avoided by design"],
          [
            "Caching",
            "Native to HTTP (CDN, ETag, `Cache-Control`)",
            "Hard: everything is `POST` to one URL; needs per-ID caching or persisted queries",
          ],
          ["Contract and types", "Optional (OpenAPI)", "Mandatory typed schema with introspection"],
          ["Versioning", "`/v1`, `/v2` or negotiation", "Evolve the schema; deprecate fields"],
          [
            "Risks",
            "Many network round trips",
            "Expensive or deep queries (DoS), N+1 in resolvers, per-field authorization",
          ],
          ["Real time", "SSE/WebSocket on the side", "Subscriptions"],
          [
            "Shines at",
            "Public APIs, CRUD, integrations, aggressive caching",
            "Many screens and clients (web, mobile), aggregating several sources",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Public or simple integration API where caching matters: REST. Different front ends (web, iOS, Android) asking for different slices of the same data, or a gateway aggregating several services: GraphQL (or a BFF). Many companies use both.",
      },
    ],
    armadilhas: [
      "Calling an API REST when it has `POST /getUser` and returns 200 for everything.",
      "GraphQL without depth, cost and pagination limits: a single query can take the server down.",
      "N+1 in resolvers (one database query per item); the classic fix is batching with DataLoader.",
      "Believing GraphQL always replaces REST: it trades problems, it does not remove them.",
    ],
    autoteste: [
      {
        pergunta: "What is over-fetching and how does GraphQL avoid it?",
        resposta:
          "Receiving more fields than the screen needs. In GraphQL the client lists the fields it wants, so the response carries only those.",
      },
      {
        pergunta: "Why is caching harder in GraphQL?",
        resposta:
          "Because queries are usually `POST` to a single URL, so HTTP/CDN caches cannot tell one query from another; you need per-entity ID caching or persisted queries.",
      },
    ],
  },
};
