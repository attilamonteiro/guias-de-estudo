import type { Pergunta } from "../../tipos";

// R45 · Correlation IDs
export const r45: Pergunta = {
  numero: 145,
  modulo: "roadmap-avancado",
  metodo: "feynman",
  pt: {
    titulo: "Correlation IDs",
    pergunta: "O que são correlation IDs e como podem ser usados para rastrear requisições entre serviços?",
    porqueEsteMetodo:
      "O código de rastreio de uma encomenda é a analogia exata. Ela dá a ideia, e o ponto em que quebra (todo mundo precisa repassar a etiqueta) é o que a prática exige.",
    resposta30s:
      "Um **correlation ID** (ou request/trace ID) é um identificador único **gerado na entrada** do sistema e **repassado em todas as chamadas seguintes** (cabeçalho `X-Request-Id` ou o `traceparent` do W3C Trace Context), em mensagens de fila e **em todos os logs**. Procurando o ID nos logs, você reconstrói o caminho completo de uma requisição entre serviços; no tracing, ele liga os spans.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "O código de rastreio de uma encomenda: a mesma etiqueta acompanha o pacote pelo centro de distribuição, pela transportadora e pela entrega. Com ela, você reconstrói o caminho todo.",
        tecnico:
          "Gerado no gateway (ou no primeiro serviço), o ID viaja em cabeçalhos HTTP, atributos de mensagem e no contexto da thread, e entra em **todo log** como campo fixo. Pesquisando o ID no sistema de logs, você vê o que cada serviço fez por aquela requisição; no tracing distribuído (OpenTelemetry), o mesmo ID liga os spans e mostra onde o tempo foi gasto.",
        limite:
          "A etiqueta só ajuda se **todos** a carregarem. Um serviço que não repassa o ID quebra a trilha ali. E o ID da requisição não é o ID do usuário.",
      },
      {
        tipo: "codigo",
        legenda: "http + logs",
        codigo:
          'GET /pedidos/42            X-Request-Id: 9f3c1a      (gerado no gateway)\n  -> servico pedidos  log: {"trace_id":"9f3c1a","msg":"buscando pedido"}\n  -> servico estoque  log: {"trace_id":"9f3c1a","msg":"consulta saldo"}   (mesmo ID, repassado)',
      },
      {
        tipo: "passos",
        titulo: "Como implementar",
        passos: [
          {
            titulo: "Gerar na borda",
            texto: "Se a requisição já traz um ID válido, reutilize; senão, crie (UUID ou ID de trace).",
          },
          {
            titulo: "Propagar",
            texto:
              "Cabeçalho nas chamadas HTTP, atributo nas mensagens de fila e contexto da thread ou do async local no código.",
          },
          {
            titulo: "Registrar em todos os logs",
            texto: "Via middleware ou logger de contexto, como campo fixo.",
          },
          {
            titulo: "Devolver ao cliente",
            texto: "Como cabeçalho de resposta, para o suporte pedir “me passe o ID”.",
          },
        ],
      },
    ],
    armadilhas: [
      "Gerar um ID diferente em cada serviço: não correlaciona nada.",
      "Esquecer filas e tarefas assíncronas.",
      "Logs sem o campo do ID.",
      "Confiar sem validar no ID enviado por clientes externos.",
    ],
    autoteste: [
      {
        pergunta: "Para que serve um correlation ID?",
        resposta: "Para acompanhar uma requisição por todos os serviços e logs, facilitando depurar e achar gargalos.",
      },
      {
        pergunta: "Onde ele deve ser gerado e como se propaga?",
        resposta:
          "Na entrada do sistema (gateway), repassado por cabeçalhos, mensagens e contexto, e gravado em todos os logs.",
      },
    ],
  },
  en: {
    titulo: "Correlation IDs",
    pergunta: "What are correlation IDs, and how can they be used for tracing requests across services?",
    porqueEsteMetodo:
      "A parcel tracking code is the exact analogy. It gives the idea, and the point where it breaks (everyone must pass the label along) is what practice demands.",
    resposta30s:
      "A **correlation ID** (or request/trace ID) is a unique identifier **generated at the system’s entry** and **passed on in every following call** (the `X-Request-Id` header or the W3C Trace Context `traceparent`), in queue messages and **in every log**. Searching the ID in the logs, you rebuild a request’s whole path across services; in tracing, it links the spans.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "A parcel tracking code: the same label follows the package through the distribution center, the carrier and the delivery. With it, you rebuild the whole path.",
        tecnico:
          "Generated at the gateway (or the first service), the ID travels in HTTP headers, message attributes and thread context, and goes into **every log** as a fixed field. Searching the ID in the log system, you see what each service did for that request; in distributed tracing (OpenTelemetry), the same ID links the spans and shows where time was spent.",
        limite:
          "The label only helps if **everyone** carries it. A service that does not pass the ID on breaks the trail there. And the request ID is not the user ID.",
      },
      {
        tipo: "codigo",
        legenda: "http + logs",
        codigo:
          'GET /orders/42             X-Request-Id: 9f3c1a      (generated at the gateway)\n  -> orders service     log: {"trace_id":"9f3c1a","msg":"fetching order"}\n  -> inventory service  log: {"trace_id":"9f3c1a","msg":"checking stock"}   (same ID, passed on)',
      },
      {
        tipo: "passos",
        titulo: "How to implement",
        passos: [
          {
            titulo: "Generate at the edge",
            texto: "If the request already carries a valid ID, reuse it; otherwise create one (UUID or trace ID).",
          },
          {
            titulo: "Propagate",
            texto: "A header on HTTP calls, an attribute on queue messages and thread or async-local context in code.",
          },
          {
            titulo: "Record in every log",
            texto: "Via middleware or a context logger, as a fixed field.",
          },
          {
            titulo: "Return to the client",
            texto: "As a response header, so support can ask “send me the ID”.",
          },
        ],
      },
    ],
    armadilhas: [
      "Generating a different ID in each service: nothing correlates.",
      "Forgetting queues and asynchronous tasks.",
      "Logs without the ID field.",
      "Trusting the ID sent by external clients without validating it.",
    ],
    autoteste: [
      {
        pergunta: "What is a correlation ID for?",
        resposta: "To follow a request across all services and logs, making it easier to debug and find bottlenecks.",
      },
      {
        pergunta: "Where should it be generated and how does it propagate?",
        resposta:
          "At the system’s entry (gateway), passed along through headers, messages and context, and written to every log.",
      },
    ],
  },
};
