import type { Pergunta } from "../../tipos";

// R03 · API RESTful e seus princípios
export const r03: Pergunta = {
  numero: 103,
  modulo: "roadmap-iniciante",
  metodo: "whys",
  pt: {
    titulo: "API RESTful e seus princípios",
    pergunta: "O que é uma API RESTful e quais são os seus princípios centrais?",
    porqueEsteMetodo:
      "Cada princípio de REST existe por causa de um benefício concreto. Perguntar “por quê?” transforma a lista de restrições numa cadeia de causa e efeito, mais fácil de lembrar do que seis itens soltos.",
    resposta30s:
      "RESTful é a API que respeita as restrições do estilo REST: **cliente-servidor**, **stateless**, **cacheável**, **interface uniforme** (recursos com URI, manipulados por representações, mensagens autodescritivas e, idealmente, hipermídia/HATEOAS), **em camadas** e, opcionalmente, código sob demanda. Cada restrição compra uma propriedade: escala, simplicidade, desempenho ou evolução independente.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que separar cliente e servidor?",
            resposta:
              "Para que cada lado evolua sozinho (o app móvel e o site usam a mesma API) e o servidor não se preocupe com a interface.",
          },
          {
            pergunta: "Por que cada requisição precisa ser independente (stateless)?",
            resposta:
              "Porque assim qualquer servidor atende qualquer requisição: dá para escalar horizontalmente sem prender o usuário a uma máquina.",
          },
          {
            pergunta: "Por que marcar respostas como cacheáveis?",
            resposta: "Para clientes, CDNs e proxies reaproveitarem respostas, reduzindo latência e carga no servidor.",
          },
          {
            pergunta: "Por que uma interface uniforme?",
            resposta:
              "Para que qualquer cliente entenda qualquer recurso sem conhecimento especial: URIs identificam recursos, os verbos HTTP têm semântica fixa, as mensagens dizem como interpretá-las (tipo de conteúdo) e as respostas trazem links das ações possíveis (HATEOAS).",
          },
          {
            pergunta: "Por que permitir camadas?",
            resposta:
              "Para colocar gateway, balanceador, cache e segurança no meio sem que cliente ou servidor percebam.",
          },
        ],
        causaRaiz:
          "Cada princípio de REST é uma troca consciente: abre-se mão de liberdade (não guardar estado, usar verbos padrão) para ganhar **escala, simplicidade e evolução independente**.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Na prática",
        texto:
          "A maioria das “APIs REST” usa recursos, verbos, JSON e stateless, mas ignora HATEOAS. No modelo de maturidade de Richardson isso é o nível 2 de 3; o nível 3 inclui hipermídia. Veja também a Q03 (REST vs GraphQL).",
      },
    ],
    armadilhas: [
      "Chamar de RESTful qualquer API JSON sobre HTTP.",
      "Guardar estado de sessão no servidor e ainda dizer que a API é stateless.",
      "Usar `POST` para tudo, perdendo semântica e cache.",
    ],
    autoteste: [
      {
        pergunta: "O que significa stateless em REST?",
        resposta:
          "Cada requisição traz todas as informações necessárias para ser processada; o servidor não depende de memória de requisições anteriores.",
      },
      {
        pergunta: "O que é HATEOAS?",
        resposta:
          "Respostas que trazem links para as ações possíveis daquele recurso, para o cliente descobri-las sem conhecer as URLs de antemão.",
      },
    ],
  },
  en: {
    titulo: "RESTful API and its principles",
    pergunta: "What is a RESTful API and what are its core principles?",
    porqueEsteMetodo:
      "Every REST principle exists because of a concrete benefit. Asking “why?” turns the list of constraints into a chain of cause and effect, easier to remember than six loose items.",
    resposta30s:
      "RESTful means the API respects the constraints of the REST style: **client-server**, **stateless**, **cacheable**, **uniform interface** (resources with a URI, manipulated through representations, self-descriptive messages and, ideally, hypermedia/HATEOAS), **layered** and, optionally, code on demand. Each constraint buys a property: scale, simplicity, performance or independent evolution.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why separate client and server?",
            resposta:
              "So each side evolves on its own (the mobile app and the website use the same API) and the server does not worry about the interface.",
          },
          {
            pergunta: "Why must each request be independent (stateless)?",
            resposta:
              "Because then any server can serve any request: you can scale horizontally without tying a user to one machine.",
          },
          {
            pergunta: "Why mark responses as cacheable?",
            resposta: "So clients, CDNs and proxies reuse responses, cutting latency and server load.",
          },
          {
            pergunta: "Why a uniform interface?",
            resposta:
              "So any client understands any resource without special knowledge: URIs identify resources, HTTP verbs have fixed semantics, messages say how to interpret them (content type) and responses carry links to the possible actions (HATEOAS).",
          },
          {
            pergunta: "Why allow layers?",
            resposta:
              "To put a gateway, load balancer, cache and security in the middle without client or server noticing.",
          },
        ],
        causaRaiz:
          "Each REST principle is a conscious trade: it gives up freedom (no stored state, standard verbs) to gain **scale, simplicity and independent evolution**.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "In practice",
        texto:
          "Most “REST APIs” use resources, verbs, JSON and stateless, but ignore HATEOAS. On Richardson’s maturity model that is level 2 of 3; level 3 includes hypermedia. See also Q03 (REST vs GraphQL).",
      },
    ],
    armadilhas: [
      "Calling any JSON-over-HTTP API RESTful.",
      "Keeping session state on the server and still calling the API stateless.",
      "Using `POST` for everything, losing semantics and caching.",
    ],
    autoteste: [
      {
        pergunta: "What does stateless mean in REST?",
        resposta:
          "Each request carries everything needed to process it; the server does not depend on memory of earlier requests.",
      },
      {
        pergunta: "What is HATEOAS?",
        resposta:
          "Responses that carry links to the possible actions on that resource, so the client can discover them without knowing the URLs in advance.",
      },
    ],
  },
};
