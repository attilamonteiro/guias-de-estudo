import type { Pergunta } from "../../tipos";

// F83 · Projetar um servidor de chat
export const f083: Pergunta = {
  numero: 483,
  modulo: "founditgulf-cenarios",
  metodo: "design",
  pt: {
    titulo: "Projetar um servidor de chat",
    pergunta: "Como você projetaria um servidor de chat com o Node.js?",
    porqueEsteMetodo:
      "É uma pergunta aberta de projeto, e um roteiro fixo (requisitos, estimativas, decisão central, contrato, dados e operação) evita esquecer partes e mantém a conversa ordenada.",
    resposta30s:
      "Receba as mensagens por **WebSocket** autenticado no upgrade e **grave no banco antes de confirmar**, com um id gerado pelo cliente (para deduplicar) e um **`seq` por conversa** (para ordenar). Distribua entre as instâncias por **pub/sub (Redis) ou um broker**, com entrega **pelo menos uma vez**, acks do cliente e recuperação pelo `seq`; quem está offline recebe notificação push. Escale com gateways sem estado atrás de um balanceador e dados particionados por conversa, e limite a taxa e o tamanho das mensagens.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Funcionais: conversas 1:1 e em grupo, presença (quem está online), histórico paginado, anexos, notificações e indicação de entrega e leitura. Não funcionais: baixa latência, muitos usuários conectados ao mesmo tempo, **nenhuma mensagem perdida** e alta disponibilidade. Combine o que fica de fora (chamadas de áudio e vídeo, criptografia ponta a ponta) antes de desenhar.",
          },
          {
            titulo: "2. Estimativas",
            texto:
              "Multiplique usuários conectados pela frequência de mensagens e pelo tamanho médio dos grupos: o fan-out faz uma mensagem de grupo virar várias entregas. Cada conexão ocupa memória e um descritor de arquivo, e a conta diz quantas conexões cabem em uma instância e quantas instâncias você precisa. Use os números do seu caso.",
          },
          {
            titulo: "3. Decisão central",
            texto:
              "Conexão WebSocket persistente (veja D54) em **gateways** que só cuidam de conexões e autenticação, separados do **serviço de mensagens**, que grava e distribui. O banco é a fonte da verdade; o tempo real é só o caminho rápido.",
          },
          {
            titulo: "4. Contrato",
            texto:
              "Pela conexão: `enviar` (com um `idCliente` gerado pelo cliente), `ack` do servidor (com o `seq` da conversa), `mensagem` recebida, `recebida` e `lida`. Por HTTP: histórico paginado (`GET /conversas/{id}/mensagens?antes=`), criação de grupos e anexos por URL assinada (veja L67). A autenticação acontece no upgrade.",
          },
          {
            titulo: "5. Dados",
            texto:
              "`conversas` e `membros` (com o último `seq` lido por membro); `mensagens` com id, conversa, `seq` crescente por conversa, remetente, corpo, `idCliente` (único por remetente e conversa) e data. Particione por conversa. A presença fica no Redis, com expiração, e não no banco principal.",
          },
          {
            titulo: "6. Operação",
            texto:
              "Limites (taxa por usuário, tamanho da mensagem, anexos), moderação e denúncia, métricas (conexões, latência de entrega, fila de offline), logs com id de correlação, deploy com encerramento gracioso que drena conexões (veja L115) e reconexão do cliente com espera crescente.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Como a mensagem chega a outro servidor",
        colunas: ["Opção", "Como funciona", "Vantagens", "Limites"],
        linhas: [
          [
            "Redis pub/sub",
            "Um canal por conversa ou por usuário; cada gateway assina os canais dos usuários conectados nele",
            "Simples e rápido",
            "Não guarda nada: se um gateway estiver fora, perde o evento. Por isso a gravação no banco vem antes e o cliente se recupera pelo `seq`",
          ],
          [
            "Redis Streams ou um log",
            "Eventos gravados em sequência e lidos por grupos de consumidores",
            "Permite reler o que faltou e dividir a carga",
            "Mais peças para operar e uma retenção para configurar",
          ],
          [
            "Broker de mensagens (RabbitMQ, Kafka)",
            "Filas ou tópicos com acks e retenção (veja D82 e L103)",
            "Garantias fortes e escala maior",
            "Mais complexidade e latência; o tamanho do projeto precisa justificar",
          ],
          [
            "Socket.IO com adaptador",
            "Salas, acks e reconexão prontos; o adaptador distribui entre servidores (veja D71)",
            "Atalho que poupa muito código",
            "Prende ao protocolo do Socket.IO; as garantias de entrega continuam sendo suas",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "O caminho de uma mensagem 1:1, com o destinatário online ou offline",
        etapas: [
          "A envia `{ idCliente, conversaId, texto }` pela conexão WebSocket autenticada, que está presa a um gateway",
          "O gateway confere se A é membro da conversa, o tamanho e a taxa de envio, e passa a mensagem ao serviço de mensagens",
          "O serviço **grava no banco** (`INSERT` com `UNIQUE` em `idCliente`) e atribui o `seq` da conversa. Só então responde `ack` a A (estado “enviada”). Se A reenviar o mesmo `idCliente`, recebe o mesmo `ack`, sem duplicar (veja L104)",
          "O serviço publica o evento `mensagem.nova` no canal compartilhado (Redis pub/sub ou broker)",
          "Cada gateway que tem conexões de membros da conversa entrega a mensagem pelo WebSocket. O cliente de B responde `recebida`, e A passa a ver “entregue”",
          "Se B está offline (sem conexão e sem presença), a mensagem já está no banco; o serviço dispara uma notificação push, sem o conteúdo sensível. Quando B reconecta, pede “tudo depois do meu último `seq`” e recebe o que faltou; o cliente deduplica pelo id",
          "B abre a conversa e envia `lida` até um `seq`; o servidor atualiza o último lido e avisa A",
        ],
        nota: "Em grupos, a entrega do passo 5 se repete para cada membro (fan-out). Grupos muito grandes pedem outra estratégia, como buscar sob demanda em vez de empurrar para todos.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Persistir antes de confirmar, entregar depois",
        texto:
          "O banco é a fonte da verdade, e o WebSocket e o pub/sub só aceleram: se um evento em tempo real se perder, o cliente se recupera pelo `seq`. Entrega **pelo menos uma vez** mais deduplicação pelo `idCliente` dá ao usuário o efeito de “exatamente uma vez”. A ordem que importa é a **por conversa**, não a global.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "WebSocket não é garantia de entrega",
        texto:
          "A conexão cai sem avisar, e um `send` bem-sucedido não prova que o outro lado recebeu. A confiabilidade vem da gravação, dos acks, do reenvio e da recuperação por `seq`. E nunca ordene pelo horário do cliente ou pelo relógio das máquinas: use o `seq` da conversa.",
      },
    ],
    armadilhas: [
      "Confirmar o envio ao remetente antes de gravar a mensagem: o usuário acha que foi enviada, mas ela se perde se o servidor cair.",
      "Guardar conexões e salas só na memória de um processo, sem canal entre instâncias: os membros de um grupo que estão em outro servidor não recebem.",
      "Ordenar por horário do cliente ou do relógio das máquinas: use um `seq` por conversa, atribuído no momento da gravação.",
      "Não impor limites (taxa, tamanho, anexos) nem tratar o cliente lento: um usuário abusivo ou uma conexão lenta degrada o serviço para todos.",
    ],
    autoteste: [
      {
        pergunta: "Como garantir que uma mensagem não seja perdida nem duplicada?",
        resposta:
          "Grave no banco antes de confirmar ao remetente, com um `idCliente` único para o reenvio não duplicar. O destinatário confirma o recebimento e, ao reconectar, pede o que veio depois do último `seq`. É entrega pelo menos uma vez, com deduplicação.",
      },
      {
        pergunta: "Como o chat escala além de uma instância?",
        resposta:
          "Com gateways sem estado atrás de um balanceador, um canal compartilhado (Redis pub/sub ou broker) que leva cada mensagem aos gateways com membros da conversa, e o banco particionado por conversa.",
      },
    ],
  },
  en: {
    titulo: "Designing a chat server",
    pergunta: "How would you design a chat server using Node.js?",
    porqueEsteMetodo:
      "This is an open-ended design question, and a fixed script (requirements, estimates, central decision, contract, data and operations) avoids forgetting parts and keeps the conversation orderly.",
    resposta30s:
      "Receive messages over a **WebSocket** authenticated on upgrade and **write to the database before acknowledging**, with a client-generated id (to deduplicate) and a **per-conversation `seq`** (to order). Distribute across instances through **pub/sub (Redis) or a broker**, with **at-least-once** delivery, client acks and recovery by `seq`; offline users get a push notification. Scale with stateless gateways behind a load balancer and data partitioned by conversation, and limit the rate and size of messages.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "Functional: 1:1 and group conversations, presence (who is online), paginated history, attachments, notifications and delivery and read receipts. Non-functional: low latency, many users connected at once, **no lost messages** and high availability. Agree on what is out of scope (audio and video calls, end-to-end encryption) before designing.",
          },
          {
            titulo: "2. Estimates",
            texto:
              "Multiply connected users by message frequency and by average group size: fan-out turns one group message into several deliveries. Each connection takes memory and a file descriptor, and the math tells you how many connections fit on one instance and how many instances you need. Use the numbers for your case.",
          },
          {
            titulo: "3. Central decision",
            texto:
              "A persistent WebSocket connection (see D54) on **gateways** that only handle connections and authentication, separate from the **message service**, which writes and distributes. The database is the source of truth; real time is just the fast path.",
          },
          {
            titulo: "4. Contract",
            texto:
              "Over the connection: `send` (with a client-generated `clientId`), the server’s `ack` (with the conversation’s `seq`), incoming `message`, `received` and `read`. Over HTTP: paginated history (`GET /conversations/{id}/messages?before=`), group creation and attachments through signed URLs (see L67). Authentication happens on upgrade.",
          },
          {
            titulo: "5. Data",
            texto:
              "`conversations` and `members` (with each member’s last read `seq`); `messages` with id, conversation, an increasing per-conversation `seq`, sender, body, `clientId` (unique per sender and conversation) and date. Partition by conversation. Presence lives in Redis, with expiry, not in the main database.",
          },
          {
            titulo: "6. Operations",
            texto:
              "Limits (rate per user, message size, attachments), moderation and reporting, metrics (connections, delivery latency, offline queue), logs with a correlation id, deploys with a graceful shutdown that drains connections (see L115) and client reconnection with growing waits.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "How the message reaches another server",
        colunas: ["Option", "How it works", "Advantages", "Limits"],
        linhas: [
          [
            "Redis pub/sub",
            "One channel per conversation or per user; each gateway subscribes to the channels of the users connected to it",
            "Simple and fast",
            "It stores nothing: if a gateway is down, the event is lost. That is why the database write comes first and the client recovers by `seq`",
          ],
          [
            "Redis Streams or a log",
            "Events written in sequence and read by consumer groups",
            "Lets you re-read what was missed and share the load",
            "More pieces to operate and a retention to configure",
          ],
          [
            "Message broker (RabbitMQ, Kafka)",
            "Queues or topics with acks and retention (see D82 and L103)",
            "Strong guarantees and larger scale",
            "More complexity and latency; the project’s size must justify it",
          ],
          [
            "Socket.IO with an adapter",
            "Rooms, acks and reconnection ready-made; the adapter distributes across servers (see D71)",
            "A shortcut that saves a lot of code",
            "Ties you to the Socket.IO protocol; delivery guarantees are still yours",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "The path of a 1:1 message, with the recipient online or offline",
        etapas: [
          "A sends `{ clientId, conversationId, text }` over the authenticated WebSocket connection, which is pinned to one gateway",
          "The gateway checks that A is a member of the conversation, the size and the send rate, and hands the message to the message service",
          "The service **writes to the database** (`INSERT` with `UNIQUE` on `clientId`) and assigns the conversation’s `seq`. Only then does it send `ack` to A (state “sent”). If A resends the same `clientId`, it gets the same `ack`, with no duplicate (see L104)",
          "The service publishes a `message.new` event on the shared channel (Redis pub/sub or broker)",
          "Each gateway that holds connections of the conversation’s members delivers the message over the WebSocket. B’s client answers `received`, and A now sees “delivered”",
          "If B is offline (no connection and no presence), the message is already in the database; the service triggers a push notification, without the sensitive content. When B reconnects, it asks for “everything after my last `seq`” and receives what was missed; the client deduplicates by id",
          "B opens the conversation and sends `read` up to a `seq`; the server updates the last-read mark and tells A",
        ],
        nota: "In groups, the delivery in step 5 repeats for each member (fan-out). Very large groups call for another strategy, such as fetching on demand instead of pushing to everyone.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Persist before acknowledging, deliver afterwards",
        texto:
          "The database is the source of truth, and the WebSocket and pub/sub only speed things up: if a real-time event is lost, the client recovers by `seq`. **At-least-once** delivery plus deduplication by `clientId` gives the user the effect of “exactly once”. The order that matters is **per conversation**, not global.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "WebSocket is not a delivery guarantee",
        texto:
          "The connection drops without warning, and a successful `send` does not prove the other side received it. Reliability comes from the write, the acks, the resend and the recovery by `seq`. And never order by the client’s time or by the machines’ clocks: use the conversation’s `seq`.",
      },
    ],
    armadilhas: [
      "Acknowledging the send to the sender before writing the message: the user thinks it went out, but it is lost if the server crashes.",
      "Keeping connections and rooms only in one process’s memory, with no channel between instances: group members on another server do not receive it.",
      "Ordering by the client’s time or the machines’ clocks: use a per-conversation `seq`, assigned at write time.",
      "Imposing no limits (rate, size, attachments) and not handling the slow client: one abusive user or one slow connection degrades the service for everyone.",
    ],
    autoteste: [
      {
        pergunta: "How do you make sure a message is neither lost nor duplicated?",
        resposta:
          "Write to the database before acknowledging to the sender, with a unique `clientId` so a resend does not duplicate. The recipient acknowledges receipt and, on reconnecting, asks for what came after the last `seq`. It is at-least-once delivery, with deduplication.",
      },
      {
        pergunta: "How does the chat scale beyond one instance?",
        resposta:
          "With stateless gateways behind a load balancer, a shared channel (Redis pub/sub or a broker) that carries each message to the gateways with members of the conversation, and the database partitioned by conversation.",
      },
    ],
  },
};
