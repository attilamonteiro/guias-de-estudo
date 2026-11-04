import type { Pergunta } from "../../tipos";

// D82 · RabbitMQ no Node.js
export const d082: Pergunta = {
  numero: 382,
  modulo: "devinterview-escala",
  metodo: "trace",
  pt: {
    titulo: "RabbitMQ no Node.js",
    pergunta: "Como você implementa o RabbitMQ com o Node.js?",
    porqueEsteMetodo:
      "O que confunde no RabbitMQ é o caminho: produtor, exchange, binding, fila e consumidor são peças diferentes. Seguir uma mensagem de ponta a ponta, inclusive quando o consumidor cai, mostra o papel de cada uma e de cada garantia.",
    resposta30s:
      "Com o **`amqplib`**, o produtor abre um **canal** e publica em um **exchange** com uma **routing key**; os **bindings** copiam a mensagem para as **filas** que casam, e o consumidor recebe com `consume`, processa e confirma com **`ack`**. Use filas **duráveis**, mensagens **persistentes**, `prefetch` para limitar a carga, **dead-letter** para o que falha e consumidores **idempotentes**: se o consumidor cair antes do ack, a mensagem volta para a fila e é entregue de novo (pelo menos uma vez).",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma mensagem, do produtor ao ack",
        etapas: [
          "O produtor (a API de pedidos) abre uma conexão e um canal com o broker pelo `amqplib` e declara o exchange `pedidos`, do tipo `topic` e durável. Ele não conhece filas: só publica no exchange",
          '`publish("pedidos", "pedido.criado", Buffer, { persistent: true })`: a mensagem sai com uma **routing key** e marcada como persistente. Com um canal de confirmação (`createConfirmChannel`), o broker avisa quando a recebeu',
          "O exchange compara a routing key com os **bindings**: a fila `emails`, ligada a `pedido.*`, e a fila `faturamento`, ligada a `pedido.criado`, casam, e cada uma recebe uma cópia. Se nenhuma casasse, a mensagem seria descartada, a menos que se use `mandatory` ou um exchange alternativo",
          "A fila durável guarda a mensagem (em disco, por ser persistente) até haver um consumidor disponível",
          "O consumidor definiu `prefetch(10)` e chamou `consume`: o broker entrega até 10 mensagens sem ack por vez. O consumidor processa a mensagem (envia o e-mail)",
          "Só depois de terminar, ele chama `ack`, e o broker apaga a mensagem da fila. É o fim do caminho feliz",
        ],
        nota: "Tipos de exchange: `direct` (a routing key precisa ser igual à do binding), `topic` (padrões com `*` e `#`) e `fanout` (copia para todas as filas ligadas, ignorando a chave). Enviar com `sendToQueue` usa o exchange padrão, que roteia pelo nome da fila.",
      },
      {
        tipo: "codigo",
        titulo: "Produtor e consumidor com o amqplib",
        legenda: "JavaScript",
        codigo: `import amqp from "amqplib";
const conn = await amqp.connect(process.env.AMQP_URL);
const ch = await conn.createConfirmChannel();
await ch.assertExchange("pedidos", "topic", { durable: true });
await ch.assertQueue("emails", { durable: true });
await ch.bindQueue("emails", "pedidos", "pedido.*"); // roteia pelo padrão da chave

ch.publish("pedidos", "pedido.criado", Buffer.from(JSON.stringify({ id: 42 })), { persistent: true });
await ch.waitForConfirms(); // o broker confirmou o recebimento

await ch.prefetch(10); // no máximo 10 mensagens sem ack por consumidor
await ch.consume("emails", async (msg) => {
  if (msg === null) return; // consumo cancelado pelo broker
  try {
    await enviarEmail(JSON.parse(msg.content.toString()));
    ch.ack(msg); // só depois de concluir o trabalho
  } catch {
    ch.nack(msg, false, false); // não recoloca na fila: vai para a dead-letter, se houver
  }
});`,
        nota: "Produtor e consumidor ficam no mesmo trecho só para caber aqui; na prática são processos separados. Para ter dead-letter, declare a fila com `deadLetterExchange` (e crie esse exchange e uma fila de mortas). Confira a documentação do `amqplib` para a API da versão instalada.",
      },
      {
        tipo: "passos",
        titulo: "Quando algo dá errado",
        passos: [
          {
            titulo: "O consumidor cai antes do ack",
            texto:
              "A conexão se fecha, o broker devolve a mensagem à fila (marcada como `redelivered`) e a entrega a outro consumidor. Nada se perde, mas ela pode ser **processada duas vezes** se o trabalho já tinha terminado e o ack não saiu. A garantia é “pelo menos uma vez”.",
          },
          {
            titulo: "O consumidor precisa ser idempotente",
            texto:
              "Guarde o id da mensagem ou use uma restrição `UNIQUE` no efeito (veja L104), para a reentrega não duplicar e-mails, cobranças ou lançamentos.",
          },
          {
            titulo: "O processamento falha",
            texto:
              "Use `nack` sem recolocar na fila e uma **dead-letter exchange** configurada na fila, para a mensagem ir a uma fila de mortas e ser inspecionada. Recolocar a cada erro cria um laço infinito com mensagens “venenosas”. Para tentar de novo, use uma fila de espera com TTL e um limite de tentativas.",
          },
          {
            titulo: "O broker reinicia ou a conexão cai",
            texto:
              "Filas duráveis com mensagens persistentes sobrevivem à reinicialização do broker, e as confirmações do publicador reduzem a janela de perda. O `amqplib` não reconecta sozinho: trate os eventos `close` e `error` da conexão e recrie canal e consumidores.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A regra das três garantias",
        texto:
          "**Ack só depois de concluir o trabalho**, **consumidor idempotente** e **dead-letter para o que não tem jeito**. Com isso a fila entrega “pelo menos uma vez” sem perder mensagens e sem travar com mensagens ruins. Escolha o RabbitMQ para filas de trabalho e roteamento flexível com garantias por mensagem; para um log de eventos que pode ser relido, compare com o Kafka (veja L103).",
      },
    ],
    armadilhas: [
      "Dar `ack` antes de terminar o trabalho: se o processo cair em seguida, a mensagem se perde.",
      "Recolocar na fila (`requeue`) a mensagem que falha por um erro permanente: ela volta para sempre; use dead-letter e um limite de tentativas.",
      "Achar que durabilidade é só a fila: é preciso fila durável, mensagem `persistent` e, de preferência, confirmações do publicador.",
      "Não usar `prefetch` (um consumidor recebe tudo e os outros ficam ociosos) e não tratar a reconexão, já que o `amqplib` não reconecta sozinho.",
    ],
    autoteste: [
      {
        pergunta: "O que acontece com uma mensagem se o consumidor cai antes do ack?",
        resposta:
          "O broker percebe que a conexão fechou, devolve a mensagem à fila com a marca de reentrega e a entrega a outro consumidor. Nada se perde, mas ela pode ser processada duas vezes, por isso o consumidor precisa ser idempotente.",
      },
      {
        pergunta: "Qual é o papel do exchange e do binding, e por que o produtor não envia direto para a fila?",
        resposta:
          "O exchange recebe a mensagem e decide, pelos bindings (regras que ligam a routing key às filas), para quais filas copiá-la. Assim o produtor não conhece os consumidores, e novas filas entram sem alterá-lo.",
      },
    ],
  },
  en: {
    titulo: "RabbitMQ with Node.js",
    pergunta: "How do you implement RabbitMQ with Node.js?",
    porqueEsteMetodo:
      "What confuses people about RabbitMQ is the path: producer, exchange, binding, queue and consumer are different pieces. Following one message end to end, including when the consumer crashes, shows the role of each piece and of each guarantee.",
    resposta30s:
      "With **`amqplib`**, the producer opens a **channel** and publishes to an **exchange** with a **routing key**; the **bindings** copy the message to the **queues** that match, and the consumer receives it with `consume`, processes it and confirms with **`ack`**. Use **durable** queues, **persistent** messages, `prefetch` to limit load, a **dead-letter** path for what fails and **idempotent** consumers: if the consumer crashes before the ack, the message goes back to the queue and is delivered again (at least once).",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One message, from producer to ack",
        etapas: [
          "The producer (the orders API) opens a connection and a channel to the broker through `amqplib` and declares the `orders` exchange, of type `topic` and durable. It does not know queues: it only publishes to the exchange",
          '`publish("orders", "order.created", Buffer, { persistent: true })`: the message leaves with a **routing key** and marked persistent. With a confirm channel (`createConfirmChannel`), the broker tells you when it has received it',
          "The exchange compares the routing key with the **bindings**: the `emails` queue, bound to `order.*`, and the `billing` queue, bound to `order.created`, both match, and each gets a copy. If none matched, the message would be dropped, unless you use `mandatory` or an alternate exchange",
          "The durable queue keeps the message (on disk, since it is persistent) until a consumer is available",
          "The consumer set `prefetch(10)` and called `consume`: the broker delivers up to 10 unacknowledged messages at a time. The consumer processes the message (sends the email)",
          "Only after finishing does it call `ack`, and the broker deletes the message from the queue. That is the end of the happy path",
        ],
        nota: "Exchange types: `direct` (the routing key must equal the binding’s), `topic` (patterns with `*` and `#`) and `fanout` (copies to every bound queue, ignoring the key). Sending with `sendToQueue` uses the default exchange, which routes by queue name.",
      },
      {
        tipo: "codigo",
        titulo: "Producer and consumer with amqplib",
        legenda: "JavaScript",
        codigo: `import amqp from "amqplib";
const conn = await amqp.connect(process.env.AMQP_URL);
const ch = await conn.createConfirmChannel();
await ch.assertExchange("orders", "topic", { durable: true });
await ch.assertQueue("emails", { durable: true });
await ch.bindQueue("emails", "orders", "order.*"); // routes by key pattern

ch.publish("orders", "order.created", Buffer.from(JSON.stringify({ id: 42 })), { persistent: true });
await ch.waitForConfirms(); // the broker confirmed receipt

await ch.prefetch(10); // at most 10 unacknowledged messages per consumer
await ch.consume("emails", async (msg) => {
  if (msg === null) return; // consumption cancelled by the broker
  try {
    await sendEmail(JSON.parse(msg.content.toString()));
    ch.ack(msg); // only after the work is done
  } catch {
    ch.nack(msg, false, false); // do not requeue: goes to the dead letter path, if any
  }
});`,
        nota: "Producer and consumer share a snippet only to fit here; in practice they are separate processes. To get a dead-letter path, declare the queue with `deadLetterExchange` (and create that exchange and a dead-letter queue). Check the `amqplib` documentation for the API of the installed version.",
      },
      {
        tipo: "passos",
        titulo: "When something goes wrong",
        passos: [
          {
            titulo: "The consumer crashes before the ack",
            texto:
              "The connection closes, the broker puts the message back in the queue (flagged `redelivered`) and delivers it to another consumer. Nothing is lost, but it may be **processed twice** if the work had finished and the ack did not go out. The guarantee is “at least once”.",
          },
          {
            titulo: "The consumer must be idempotent",
            texto:
              "Store the message id or use a `UNIQUE` constraint on the effect (see L104), so redelivery does not duplicate emails, charges or entries.",
          },
          {
            titulo: "Processing fails",
            texto:
              "Use `nack` without requeueing and a **dead-letter exchange** configured on the queue, so the message goes to a dead-letter queue and can be inspected. Requeueing on every error creates an endless loop of “poison” messages. To retry, use a wait queue with a TTL and a cap on attempts.",
          },
          {
            titulo: "The broker restarts or the connection drops",
            texto:
              "Durable queues with persistent messages survive a broker restart, and publisher confirms shrink the window for loss. `amqplib` does not reconnect by itself: handle the connection’s `close` and `error` events and recreate the channel and consumers.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The rule of three guarantees",
        texto:
          "**Ack only after the work is done**, **an idempotent consumer** and **a dead-letter path for what cannot be fixed**. With that, the queue delivers “at least once” without losing messages and without getting stuck on bad ones. Choose RabbitMQ for work queues and flexible routing with per-message guarantees; for an event log that can be replayed, compare it with Kafka (see L103).",
      },
    ],
    armadilhas: [
      "Calling `ack` before the work is finished: if the process crashes right after, the message is lost.",
      "Requeueing (`requeue`) a message that fails for a permanent error: it comes back forever; use a dead-letter path and a cap on attempts.",
      "Thinking durability is just the queue: you need a durable queue, a `persistent` message and, preferably, publisher confirms.",
      "Skipping `prefetch` (one consumer gets everything and the others sit idle) and skipping reconnection handling, since `amqplib` does not reconnect by itself.",
    ],
    autoteste: [
      {
        pergunta: "What happens to a message if the consumer crashes before the ack?",
        resposta:
          "The broker notices the connection closed, puts the message back in the queue with the redelivery flag and delivers it to another consumer. Nothing is lost, but it may be processed twice, which is why the consumer must be idempotent.",
      },
      {
        pergunta:
          "What is the role of the exchange and the binding, and why does the producer not send straight to the queue?",
        resposta:
          "The exchange receives the message and decides, through the bindings (rules that tie the routing key to queues), which queues to copy it to. That way the producer does not know the consumers, and new queues can be added without changing it.",
      },
    ],
  },
};
