import type { Pergunta } from "../../tipos";

// R24 · Webhooks
export const r24: Pergunta = {
  numero: 124,
  modulo: "roadmap-intermediario",
  metodo: "trace",
  pt: {
    titulo: "Webhooks",
    pergunta: "O que são webhooks e como você os implementou em projetos anteriores?",
    porqueEsteMetodo:
      "Um webhook é uma conversa entre dois sistemas. Seguir um evento do provedor até o seu processamento (e a retentativa) mostra o que o receptor precisa garantir.",
    resposta30s:
      "Um **webhook** é um **callback HTTP definido pelo usuário**: quando um evento acontece, o provedor faz um `POST` na URL que você cadastrou, evitando que você precise consultar (polling). Para recebê-lo com segurança: **verifique a assinatura (HMAC)**, **responda `2xx` rápido** e processe depois (fila), seja **idempotente** (os eventos podem chegar repetidos) e não assuma ordem.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Ciclo de um webhook",
        etapas: [
          "O evento ocorre no provedor (ex.: pagamento aprovado)",
          "O provedor envia um `POST` para a sua URL, com JSON e assinatura",
          "Seu endpoint **verifica a assinatura** (HMAC)",
          "Grava o evento e responde `2xx` em segundos",
          "Processa de forma assíncrona (fila)",
          "Sem `2xx`, o provedor tenta de novo com backoff",
        ],
      },
      {
        tipo: "passos",
        titulo: "Como implementar",
        passos: [
          {
            titulo: "Defina eventos e payload",
            texto: "Quais eventos disparam, o formato JSON, um `event_id` único e a versão do esquema.",
          },
          {
            titulo: "Endpoint receptor",
            texto:
              "`POST` em HTTPS que valida o corpo **bruto** contra a assinatura (HMAC-SHA256 com segredo compartilhado) e o timestamp (evita replay).",
          },
          {
            titulo: "Responda rápido, processe depois",
            texto:
              "Confirme com `200` ou `202` e jogue numa fila; trabalho pesado dentro da requisição gera timeout e reenvios.",
          },
          {
            titulo: "Idempotência",
            texto: "O provedor reenvia (ao menos uma vez): guarde os `event_id` já processados e ignore os repetidos.",
          },
          {
            titulo: "Do lado de quem envia",
            texto:
              "Assine as mensagens, retente com backoff exponencial, registre o histórico de entregas e permita reenvio manual.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Webhook vs polling",
        texto:
          "No **polling** o cliente pergunta de tempos em tempos (desperdício e atraso). No **webhook** o servidor avisa quando algo acontece (eficiente), mas o receptor precisa estar no ar, ter URL pública e se proteger.",
      },
    ],
    armadilhas: [
      "Aceitar qualquer `POST` sem verificar a assinatura.",
      "Processar tudo dentro da requisição e estourar o timeout.",
      "Não tratar duplicatas e reentregas.",
      "Assumir a ordem de chegada dos eventos.",
    ],
    autoteste: [
      {
        pergunta: "Como confirmar que um webhook veio mesmo do provedor?",
        resposta:
          "Verificando a assinatura HMAC do corpo bruto com o segredo compartilhado (e conferindo o timestamp).",
      },
      {
        pergunta: "Por que responder rápido ao webhook?",
        resposta: "Para não estourar o timeout do provedor, que reenviaria o evento; processe depois, em fila.",
      },
    ],
  },
  en: {
    titulo: "Webhooks",
    pergunta: "What are webhooks and how have you implemented them in past projects?",
    porqueEsteMetodo:
      "A webhook is a conversation between two systems. Following an event from the provider to its processing (and the retry) shows what the receiver must guarantee.",
    resposta30s:
      "A **webhook** is a **user-defined HTTP callback**: when an event happens, the provider makes a `POST` to the URL you registered, so you do not have to poll. To receive it safely: **verify the signature (HMAC)**, **reply `2xx` fast** and process later (queue), be **idempotent** (events may arrive repeated) and do not assume order.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Life cycle of a webhook",
        etapas: [
          "The event occurs at the provider (e.g. payment approved)",
          "The provider sends a `POST` to your URL, with JSON and a signature",
          "Your endpoint **verifies the signature** (HMAC)",
          "Stores the event and replies `2xx` within seconds",
          "Processes asynchronously (queue)",
          "With no `2xx`, the provider retries with backoff",
        ],
      },
      {
        tipo: "passos",
        titulo: "How to implement",
        passos: [
          {
            titulo: "Define events and payload",
            texto: "Which events fire, the JSON format, a unique `event_id` and the schema version.",
          },
          {
            titulo: "Receiving endpoint",
            texto:
              "An HTTPS `POST` that validates the **raw** body against the signature (HMAC-SHA256 with a shared secret) and the timestamp (prevents replay).",
          },
          {
            titulo: "Reply fast, process later",
            texto:
              "Acknowledge with `200` or `202` and push to a queue; heavy work inside the request causes timeouts and resends.",
          },
          {
            titulo: "Idempotency",
            texto: "The provider resends (at least once): store processed `event_id`s and ignore repeats.",
          },
          {
            titulo: "On the sender’s side",
            texto: "Sign messages, retry with exponential backoff, keep a delivery history and allow manual resend.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Webhook vs polling",
        texto:
          "With **polling** the client asks every so often (waste and delay). With a **webhook** the server notifies when something happens (efficient), but the receiver must be up, have a public URL and protect itself.",
      },
    ],
    armadilhas: [
      "Accepting any `POST` without verifying the signature.",
      "Processing everything inside the request and hitting the timeout.",
      "Not handling duplicates and redeliveries.",
      "Assuming events arrive in order.",
    ],
    autoteste: [
      {
        pergunta: "How do you confirm a webhook really came from the provider?",
        resposta:
          "By verifying the HMAC signature of the raw body with the shared secret (and checking the timestamp).",
      },
      {
        pergunta: "Why reply quickly to a webhook?",
        resposta:
          "So you do not hit the provider’s timeout, which would resend the event; process afterwards, in a queue.",
      },
    ],
  },
};
