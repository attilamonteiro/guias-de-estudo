import type { Pergunta } from "../../tipos";

// R26 · Processos longos em requisições web
export const r26: Pergunta = {
  numero: 126,
  modulo: "roadmap-intermediario",
  metodo: "trace",
  pt: {
    titulo: "Processos longos em requisições web",
    pergunta: "Explique como você lidaria com processos de longa duração em requisições web.",
    porqueEsteMetodo:
      "Um processo longo atravessa várias etapas fora da requisição. Seguir o pedido do cliente até o resultado mostra por que não se segura o HTTP aberto.",
    resposta30s:
      "Não mantenha a requisição aberta. Use o padrão **request-reply assíncrono**: a API valida, grava e **enfileira o trabalho**, responde logo **`202 Accepted`** com um **ID e uma URL de status**, um **worker** executa e o cliente descobre o resultado por **polling, webhook, WebSocket ou SSE**. Isso evita timeouts de proxy e navegador e libera a capacidade do servidor.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Request-reply assíncrono",
        etapas: [
          "Cliente envia o pedido",
          "API valida, grava e enfileira o trabalho",
          "API responde `202 Accepted` + `jobId` + URL de status",
          "Worker executa (segundos a horas)",
          "Cliente consulta `GET /jobs/{id}`, ou recebe webhook, WebSocket ou SSE",
          "Resultado pronto: `200` com os dados ou um link para baixar",
        ],
      },
      {
        tipo: "tabela",
        titulo: "Como o cliente descobre que terminou",
        colunas: ["Mecanismo", "Quando"],
        linhas: [
          ["Polling com intervalo (e `Retry-After`)", "Simples e universal; custo de requisições repetidas"],
          ["Webhook", "O cliente é um servidor com endpoint público"],
          ["WebSocket ou SSE", "Navegador ou app que quer atualização em tempo real"],
          ["E-mail ou notificação", "Processo muito longo; o usuário não precisa esperar na tela"],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Por que não deixar a requisição aberta",
        texto:
          "Timeouts de navegador, proxy e balanceador (30 a 60 s é comum) cortam a conexão e o cliente fica sem saber se o trabalho foi feito. Prender uma thread ou conexão por minutos também derruba a capacidade do servidor. Veja as Q02 e Q05.",
      },
    ],
    armadilhas: [
      "Manter o HTTP aberto esperando o resultado.",
      "Não dar ID do trabalho nem endpoint de status.",
      "Não permitir cancelamento nem expirar o resultado.",
      "Job não idempotente quando o cliente reenvia o pedido.",
    ],
    autoteste: [
      {
        pergunta: "Que status HTTP indica que o pedido foi aceito para processamento posterior?",
        resposta: "`202 Accepted`, normalmente com um ID e um link de status.",
      },
      {
        pergunta: "Como o cliente fica sabendo do resultado?",
        resposta: "Por polling no endpoint de status, ou por webhook, WebSocket ou SSE.",
      },
    ],
  },
  en: {
    titulo: "Long-running processes in web requests",
    pergunta: "Explain how you would deal with long-running processes in web requests.",
    porqueEsteMetodo:
      "A long process crosses several stages outside the request. Following the client’s request to the result shows why you do not hold HTTP open.",
    resposta30s:
      "Do not keep the request open. Use the **asynchronous request-reply** pattern: the API validates, stores and **enqueues the work**, immediately replies **`202 Accepted`** with an **ID and a status URL**, a **worker** runs it and the client learns the result by **polling, webhook, WebSocket or SSE**. This avoids proxy and browser timeouts and frees server capacity.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Asynchronous request-reply",
        etapas: [
          "Client sends the request",
          "API validates, stores and enqueues the work",
          "API replies `202 Accepted` + `jobId` + status URL",
          "Worker runs (seconds to hours)",
          "Client polls `GET /jobs/{id}`, or receives a webhook, WebSocket or SSE",
          "Result ready: `200` with the data or a download link",
        ],
      },
      {
        tipo: "tabela",
        titulo: "How the client learns it finished",
        colunas: ["Mechanism", "When"],
        linhas: [
          ["Polling with an interval (and `Retry-After`)", "Simple and universal; the cost of repeated requests"],
          ["Webhook", "The client is a server with a public endpoint"],
          ["WebSocket or SSE", "A browser or app that wants real-time updates"],
          ["Email or notification", "A very long process; the user need not wait on screen"],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Why not leave the request open",
        texto:
          "Browser, proxy and load-balancer timeouts (30 to 60 s is common) cut the connection and the client never learns whether the work was done. Holding a thread or connection for minutes also drains server capacity. See Q02 and Q05.",
      },
    ],
    armadilhas: [
      "Keeping HTTP open waiting for the result.",
      "Giving no job ID or status endpoint.",
      "Not allowing cancellation or expiring the result.",
      "A non-idempotent job when the client resends the request.",
    ],
    autoteste: [
      {
        pergunta: "Which HTTP status says the request was accepted for later processing?",
        resposta: "`202 Accepted`, usually with an ID and a status link.",
      },
      {
        pergunta: "How does the client learn the result?",
        resposta: "By polling the status endpoint, or by webhook, WebSocket or SSE.",
      },
    ],
  },
};
