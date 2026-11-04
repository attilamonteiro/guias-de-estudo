import type { Pergunta } from "../../tipos";

// R01 · O que é um endpoint de API
export const r01: Pergunta = {
  numero: 101,
  modulo: "roadmap-iniciante",
  metodo: "feynman",
  pt: {
    titulo: "O que é um endpoint de API",
    pergunta: "Explique o que é um endpoint de API.",
    porqueEsteMetodo:
      "Endpoint é um conceito simples que fica claro com uma analogia de endereço e guichê, seguida do mecanismo real (URL + método) e do ponto em que a analogia falha.",
    resposta30s:
      "Um **endpoint** é um ponto de entrada de uma API: a combinação de **URL + método HTTP** (por exemplo `GET /pedidos/42`) que o cliente chama para usar uma funcionalidade do servidor. Ele recebe uma requisição (talvez com parâmetros ou corpo) e devolve uma resposta com status e dados, e normalmente corresponde a uma capacidade do sistema.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Um prédio com vários guichês: cada um tem uma placa (endereço) e atende um tipo de pedido. Você vai ao guichê certo, entrega o formulário e recebe um protocolo ou o documento.",
        tecnico:
          "A URL identifica o **recurso** (`/pedidos/42`) e o método diz a **ação** (`GET` ler, `POST` criar, `PUT`/`PATCH` alterar, `DELETE` apagar). O mesmo caminho com métodos diferentes são endpoints diferentes: `GET /pedidos` lista, `POST /pedidos` cria. Parâmetros vão no caminho (`/pedidos/{id}`), na query (`?status=pago`), nos cabeçalhos ou no corpo (JSON).",
        limite:
          "Um guichê real atende uma pessoa de cada vez e lembra de você. Um endpoint não tem memória (cada requisição é independente) e atende milhares de clientes ao mesmo tempo.",
      },
      {
        tipo: "codigo",
        legenda: "http",
        codigo:
          'GET /pedidos/42?incluir=itens HTTP/1.1\nHost: api.exemplo.com\nAuthorization: Bearer <token>\n\nHTTP/1.1 200 OK\nContent-Type: application/json\n{ "id": 42, "status": "pago", "itens": [ ... ] }',
      },
    ],
    armadilhas: [
      "Achar que endpoint é só a URL: `GET /pedidos` e `POST /pedidos` são endpoints distintos.",
      "Colocar verbos no caminho (`/criarPedido`): o método HTTP já diz a ação.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre `GET /pedidos` e `POST /pedidos`?",
        resposta: "São endpoints diferentes: o primeiro lista pedidos, o segundo cria um novo. O que muda é o método.",
      },
      {
        pergunta: "O que um endpoint recebe e devolve?",
        resposta:
          "Recebe método, URL, cabeçalhos e, às vezes, um corpo; devolve um status code, cabeçalhos e, normalmente, um corpo com os dados.",
      },
    ],
  },
  en: {
    titulo: "What an API endpoint is",
    pergunta: "Explain what an API endpoint is.",
    porqueEsteMetodo:
      "An endpoint is a simple concept that becomes clear with an address-and-service-window analogy, followed by the real mechanism (URL + method) and the point where the analogy fails.",
    resposta30s:
      "An **endpoint** is an entry point of an API: the combination of **URL + HTTP method** (for example `GET /orders/42`) that the client calls to use a server feature. It receives a request (maybe with parameters or a body) and returns a response with a status and data, and it usually maps to one capability of the system.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "A building with several service windows: each has a sign (address) and handles one kind of request. You go to the right window, hand in the form and get a receipt or the document.",
        tecnico:
          "The URL identifies the **resource** (`/orders/42`) and the method says the **action** (`GET` read, `POST` create, `PUT`/`PATCH` change, `DELETE` remove). The same path with different methods gives different endpoints: `GET /orders` lists, `POST /orders` creates. Parameters go in the path (`/orders/{id}`), the query (`?status=paid`), headers or the body (JSON).",
        limite:
          "A real window serves one person at a time and remembers you. An endpoint has no memory (each request is independent) and serves thousands of clients at once.",
      },
      {
        tipo: "codigo",
        legenda: "http",
        codigo:
          'GET /orders/42?include=items HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer <token>\n\nHTTP/1.1 200 OK\nContent-Type: application/json\n{ "id": 42, "status": "paid", "items": [ ... ] }',
      },
    ],
    armadilhas: [
      "Thinking an endpoint is just the URL: `GET /orders` and `POST /orders` are distinct endpoints.",
      "Putting verbs in the path (`/createOrder`): the HTTP method already says the action.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `GET /orders` and `POST /orders`?",
        resposta:
          "They are different endpoints: the first lists orders, the second creates a new one. Only the method changes.",
      },
      {
        pergunta: "What does an endpoint receive and return?",
        resposta:
          "It receives a method, URL, headers and sometimes a body; it returns a status code, headers and usually a body with the data.",
      },
    ],
  },
};
