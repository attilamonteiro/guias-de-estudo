import type { Pergunta } from "../../tipos";

// D83 · ZeroMQ
export const d083: Pergunta = {
  numero: 383,
  modulo: "devinterview-escala",
  metodo: "compare",
  pt: {
    titulo: "ZeroMQ",
    pergunta: "Qual é a importância do ZeroMQ em aplicações Node.js?",
    porqueEsteMetodo:
      "A importância do ZeroMQ só aparece ao compará-lo com o que ele não é: um broker. A matriz contra RabbitMQ, Kafka e Redis mostra o que se ganha ao abrir mão da peça central e o que se perde.",
    resposta30s:
      "O **ZeroMQ** é uma biblioteca de mensagens, não um broker: oferece **sockets com padrões** (REQ/REP, PUB/SUB, PUSH/PULL) entre processos, **sem servidor central** e com **baixa latência**; no Node.js, usa-se o pacote `zeromq`. A troca é que ele **não persiste mensagens**: se o par cair, o que estava em trânsito pode se perder, e retentativa, descoberta e monitoramento ficam por sua conta. Faz sentido para comunicação rápida entre componentes que você controla; para garantias de entrega, use um broker como o RabbitMQ ou o Kafka.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Os padrões de socket do ZeroMQ",
        colunas: ["Padrão", "Como funciona", "Uso típico", "Se o par cai"],
        linhas: [
          [
            "REQ/REP",
            "Pedido e resposta, estritamente alternados: o REQ envia e espera a resposta antes de enviar de novo",
            "Chamada remota simples entre dois serviços",
            "O REQ pode ficar esperando para sempre: use timeout e recrie o socket",
          ],
          [
            "PUB/SUB",
            "O publicador envia a todos os assinantes, que filtram por prefixo de tópico (`subscribe`)",
            "Telemetria, cotações ao vivo, avisos a muitos",
            "Quem não estava conectado, ou estava lento, perde mensagens; o publicador não sabe",
          ],
          [
            "PUSH/PULL",
            "O PUSH distribui as tarefas entre os PULL conectados, sem resposta",
            "Pipeline de trabalho: distribuidor, trabalhadores e coletor",
            "Sem trabalhador conectado, o envio espera; o que já estava com um trabalhador que cai se perde",
          ],
        ],
        nota: "Existem também DEALER/ROUTER (a versão assíncrona do REQ/REP, base para construir brokers e roteadores) e PAIR. Os transportes incluem `tcp`, `ipc` e `inproc` (dentro do mesmo processo).",
      },
      {
        tipo: "tabela",
        titulo: "ZeroMQ x brokers",
        colunas: ["Aspecto", "ZeroMQ", "RabbitMQ", "Kafka", "Redis (pub/sub e streams)"],
        linhas: [
          [
            "Natureza",
            "Biblioteca de sockets de mensagens dentro do seu processo; sem servidor central",
            "Broker de filas, com exchanges, filas e acks",
            "Plataforma de log distribuído, em cluster",
            "Servidor em memória com pub/sub e streams",
          ],
          [
            "Durabilidade",
            "Nenhuma própria: as mensagens vivem na memória e se perdem se o par cai",
            "Filas duráveis e mensagens persistentes, com acks",
            "Log persistente, com retenção e reprocessamento",
            "O pub/sub não guarda nada; os streams guardam, com limites",
          ],
          [
            "Endereços e topologia",
            "Você escolhe os endereços (`bind` e `connect`); não há registro central",
            "Todos falam com o broker",
            "Todos falam com o cluster; consumidores em grupos",
            "Todos falam com o servidor",
          ],
          [
            "Operação",
            "Nada para operar, mas retentativa, supervisão e monitoramento são construídos por você",
            "Um servidor ou cluster para operar",
            "Um cluster para operar, em geral mais complexo",
            "Um servidor que muitas equipes já operam",
          ],
          [
            "Bom para",
            "Comunicação rápida entre processos que você controla, pipelines, telemetria que pode perder alguma mensagem",
            "Filas de trabalho e roteamento flexível com garantias",
            "Eventos em grande volume, com histórico e vários leitores",
            "Cache já existente, pub/sub simples, filas leves",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Pipeline PUSH/PULL com o pacote zeromq",
        legenda: "JavaScript",
        codigo: `import * as zmq from "zeromq";

// Processo 1: distribui tarefas (faz bind no endereço)
const push = new zmq.Push();
await push.bind("tcp://127.0.0.1:5557");
for (let i = 1; i <= 3; i++) await push.send("tarefa " + i); // espera um trabalhador conectar

// Processos 2, 3, 4...: trabalhadores (fazem connect)
const pull = new zmq.Pull();
pull.connect("tcp://127.0.0.1:5557");
for await (const [msg] of pull) {
  console.log("fazendo", msg.toString());
}`,
        nota: "Os dois lados são processos diferentes; aparecem juntos só para comparar. A API mostrada usa promessas e `for await`; versões antigas do pacote usavam callbacks, então confira a documentação da versão que você instalar.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Pergunte: **a mensagem precisa sobreviver à queda de quem recebe?** Se sim (pedidos, pagamentos, eventos que não podem se perder), use um broker (RabbitMQ, Kafka) ou os streams do Redis. Se a baixa latência e a ausência de uma peça central pesam mais, e a perda ocasional é tolerável ou tratada por você (telemetria, cotações ao vivo, comunicação entre processos que você controla), o ZeroMQ cabe.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "ZeroMQ não é um broker",
        texto:
          "Ele não grava mensagens em disco, não tem ack de aplicação, retentativa, monitoramento nem descoberta: **tudo isso fica por sua conta**. Perder mensagens quando o par cai é comportamento esperado do desenho, não um defeito. Por isso a importância dele em aplicações Node.js é de nicho: a maioria usa um broker ou Redis, e o ZeroMQ aparece em sistemas de baixa latência e na ligação de componentes escritos em linguagens diferentes. Autenticação e criptografia também precisam ser configuradas.",
      },
    ],
    armadilhas: [
      "Tratar o ZeroMQ como fila durável ou broker: as mensagens vivem na memória e se perdem se o par cai ou o buffer enche.",
      "Esquecer o `subscribe` no PUB/SUB (sem assinatura nada chega) e ignorar que quem conecta depois perde o que já foi publicado.",
      "Desconsiderar que o REQ/REP é estrito (envia, recebe, envia): sem timeout, um REQ sem resposta trava o socket.",
      "Subestimar o que falta: ack, retentativa, descoberta de endereços, monitoramento e segurança são por sua conta.",
    ],
    autoteste: [
      {
        pergunta: "Por que se diz que o ZeroMQ é uma biblioteca e não um broker?",
        resposta:
          "Porque ele roda dentro dos seus processos, oferecendo sockets com padrões de mensagem. Não há um servidor central que guarde, roteie e confirme mensagens: cada processo faz `bind` ou `connect` direto ao outro.",
      },
      {
        pergunta: "Quando a falta de persistência é um problema, e o que usar então?",
        resposta:
          "Quando perder uma mensagem tem custo, como em pedidos ou pagamentos, ou quando o receptor pode ficar fora do ar. Use um broker com filas duráveis e acks (RabbitMQ) ou um log persistente (Kafka).",
      },
    ],
  },
  en: {
    titulo: "ZeroMQ",
    pergunta: "What is the significance of ZeroMQ in Node.js applications?",
    porqueEsteMetodo:
      "ZeroMQ’s significance only shows when you compare it with what it is not: a broker. The matrix against RabbitMQ, Kafka and Redis shows what you gain by giving up the central piece and what you lose.",
    resposta30s:
      "**ZeroMQ** is a messaging library, not a broker: it offers **sockets with patterns** (REQ/REP, PUB/SUB, PUSH/PULL) between processes, **with no central server** and **low latency**; in Node.js you use the `zeromq` package. The trade is that it **does not persist messages**: if the peer goes down, what was in transit may be lost, and retries, discovery and monitoring are up to you. It fits fast communication between components you control; for delivery guarantees, use a broker such as RabbitMQ or Kafka.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "ZeroMQ’s socket patterns",
        colunas: ["Pattern", "How it works", "Typical use", "If the peer goes down"],
        linhas: [
          [
            "REQ/REP",
            "Request and reply, strictly alternating: REQ sends and waits for the reply before sending again",
            "A simple remote call between two services",
            "REQ may wait forever: use a timeout and recreate the socket",
          ],
          [
            "PUB/SUB",
            "The publisher sends to all subscribers, who filter by topic prefix (`subscribe`)",
            "Telemetry, live quotes, notices to many",
            "Anyone not connected, or slow, misses messages; the publisher does not know",
          ],
          [
            "PUSH/PULL",
            "PUSH spreads tasks among the connected PULLs, with no reply",
            "A work pipeline: distributor, workers and collector",
            "With no worker connected, sending waits; whatever was with a worker that goes down is lost",
          ],
        ],
        nota: "There are also DEALER/ROUTER (the asynchronous version of REQ/REP, a base for building brokers and routers) and PAIR. Transports include `tcp`, `ipc` and `inproc` (inside the same process).",
      },
      {
        tipo: "tabela",
        titulo: "ZeroMQ vs brokers",
        colunas: ["Aspect", "ZeroMQ", "RabbitMQ", "Kafka", "Redis (pub/sub and streams)"],
        linhas: [
          [
            "Nature",
            "A messaging-socket library inside your process; no central server",
            "A queue broker, with exchanges, queues and acks",
            "A distributed log platform, in a cluster",
            "An in-memory server with pub/sub and streams",
          ],
          [
            "Durability",
            "None of its own: messages live in memory and are lost if the peer goes down",
            "Durable queues and persistent messages, with acks",
            "A persistent log, with retention and replay",
            "Pub/sub stores nothing; streams do, with limits",
          ],
          [
            "Addresses and topology",
            "You choose the addresses (`bind` and `connect`); there is no central registry",
            "Everyone talks to the broker",
            "Everyone talks to the cluster; consumers in groups",
            "Everyone talks to the server",
          ],
          [
            "Operations",
            "Nothing to operate, but retries, supervision and monitoring are built by you",
            "A server or cluster to operate",
            "A cluster to operate, usually more complex",
            "A server many teams already operate",
          ],
          [
            "Good for",
            "Fast communication between processes you control, pipelines, telemetry that can lose a message",
            "Work queues and flexible routing with guarantees",
            "High-volume events, with history and several readers",
            "An existing cache, simple pub/sub, lightweight queues",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A PUSH/PULL pipeline with the zeromq package",
        legenda: "JavaScript",
        codigo: `import * as zmq from "zeromq";

// Process 1: distributes tasks (binds to the address)
const push = new zmq.Push();
await push.bind("tcp://127.0.0.1:5557");
for (let i = 1; i <= 3; i++) await push.send("task " + i); // waits for a worker to connect

// Processes 2, 3, 4...: workers (connect)
const pull = new zmq.Pull();
pull.connect("tcp://127.0.0.1:5557");
for await (const [msg] of pull) {
  console.log("working on", msg.toString());
}`,
        nota: "The two sides are different processes; they appear together only for comparison. The API shown uses promises and `for await`; older versions of the package used callbacks, so check the documentation of the version you install.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Ask: **must the message survive the receiver going down?** If so (orders, payments, events that cannot be lost), use a broker (RabbitMQ, Kafka) or Redis streams. If low latency and having no central piece weigh more, and an occasional loss is tolerable or handled by you (telemetry, live quotes, communication between processes you control), ZeroMQ fits.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "ZeroMQ is not a broker",
        texto:
          "It does not write messages to disk and has no application-level ack, retry, monitoring or discovery: **all of that is up to you**. Losing messages when the peer goes down is expected behavior of the design, not a defect. That is why its significance in Node.js applications is niche: most use a broker or Redis, and ZeroMQ shows up in low-latency systems and in linking components written in different languages. Authentication and encryption also need to be configured.",
      },
    ],
    armadilhas: [
      "Treating ZeroMQ as a durable queue or broker: messages live in memory and are lost if the peer goes down or the buffer fills.",
      "Forgetting `subscribe` on PUB/SUB (without a subscription nothing arrives) and ignoring that whoever connects later misses what was already published.",
      "Overlooking that REQ/REP is strict (send, receive, send): with no timeout, a REQ with no reply blocks the socket.",
      "Underestimating what is missing: ack, retries, address discovery, monitoring and security are up to you.",
    ],
    autoteste: [
      {
        pergunta: "Why is ZeroMQ called a library and not a broker?",
        resposta:
          "Because it runs inside your processes, offering sockets with messaging patterns. There is no central server that stores, routes and acknowledges messages: each process does `bind` or `connect` straight to the other.",
      },
      {
        pergunta: "When is the lack of persistence a problem, and what do you use then?",
        resposta:
          "When losing a message has a cost, as with orders or payments, or when the receiver may be offline. Use a broker with durable queues and acks (RabbitMQ) or a persistent log (Kafka).",
      },
    ],
  },
};
