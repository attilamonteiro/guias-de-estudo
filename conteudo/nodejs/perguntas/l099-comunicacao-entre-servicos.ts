import type { Pergunta } from "../../tipos";

// L99 · Comunicação entre serviços
export const l099: Pergunta = {
  numero: 199,
  modulo: "linkedin-arquitetura",
  metodo: "compare",
  pt: {
    titulo: "Comunicação entre serviços",
    pergunta: "Como os serviços se comunicam entre si?",
    porqueEsteMetodo:
      "REST, gRPC e mensageria resolvem o mesmo problema de jeitos diferentes. A matriz os coloca lado a lado e a regra de decisão mostra a pergunta que escolhe entre eles: o chamador precisa da resposta agora?",
    resposta30s:
      "Serviços se comunicam de forma **síncrona** (REST sobre HTTP, gRPC), quando o chamador precisa da resposta agora, ou de forma **assíncrona**, por mensagens e eventos num broker (fila ou publicação/assinatura), quando o trabalho pode esperar ou vários serviços precisam saber de um fato. Toda chamada pela rede exige **timeout**, retentativa só com idempotência e um **contrato versionado**. O síncrono é simples, mas acopla no tempo; o assíncrono desacopla, ao custo de consistência eventual e de duplicatas.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "REST, gRPC e mensageria",
        colunas: ["Aspecto", "REST (HTTP/JSON)", "gRPC", "Mensageria / eventos"],
        linhas: [
          [
            "Estilo",
            "Síncrono, pedido e resposta sobre HTTP",
            "Síncrono (e streaming), chamada de procedimento remoto sobre HTTP/2",
            "Assíncrono: o produtor publica no broker e segue; o consumidor processa depois",
          ],
          [
            "Contrato",
            "OpenAPI/JSON Schema, opcional mas recomendável",
            "Arquivo `.proto` obrigatório; o código do cliente e do servidor é gerado",
            "Esquema da mensagem (JSON Schema, Avro, Protobuf), de preferência num registro compartilhado",
          ],
          [
            "Formato e custo",
            "JSON em texto: legível e fácil de depurar, um pouco mais pesado",
            "Protobuf binário: compacto e rápido, menos legível",
            "Varia com o broker e o formato; o broker é mais uma peça para operar",
          ],
          [
            "Acoplamento no tempo",
            "Alto: o outro serviço precisa estar no ar e responder agora",
            "Alto, como no REST",
            "Baixo: o broker guarda a mensagem enquanto o consumidor está fora",
          ],
          [
            "Bom para",
            "APIs públicas, navegadores, integração com terceiros, consultas simples",
            "Chamadas internas frequentes e de baixa latência, streaming, contratos fortes",
            "Propagar fatos a vários serviços, trabalho em segundo plano, absorver picos (veja L103)",
          ],
          [
            "Principais cuidados",
            "Timeout, retentativa só com idempotência, versionamento da API",
            "Evoluir o `.proto` sem reaproveitar números de campo; o navegador exige uma camada extra (gRPC-Web); balanceador compatível com HTTP/2",
            "Entrega ao menos uma vez (duplicatas), ordem, idempotência, fila de mensagens mortas, consistência eventual",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Pergunte: **o chamador precisa da resposta agora para continuar?** Se sim, use chamada síncrona: REST na borda e com terceiros, gRPC no tráfego interno intenso. Se o trabalho pode esperar, ou vários serviços precisam saber de um fato (“pedido criado”), use mensagens ou eventos. Em qualquer chamada pela rede, defina **timeout**, retente só o que for idempotente (veja L104 e L105) e trate o contrato como uma API pública, com versão.",
      },
      {
        tipo: "codigo",
        titulo: "Uma chamada síncrona com timeout e um evento publicado",
        legenda: "JavaScript",
        codigo: [
          'import { randomUUID } from "node:crypto";',
          "",
          "// 1) Síncrono: preciso da resposta agora. Sempre com timeout.",
          'const res = await fetch("http://estoque/itens/42", {',
          "  signal: AbortSignal.timeout(2_000), // não espera para sempre",
          "});",
          "if (!res.ok) throw new Error(`estoque respondeu ${res.status}`);",
          "const item = await res.json();",
          "",
          "// 2) Assíncrono: aviso um fato e sigo; quem se interessa reage depois.",
          'await broker.publicar("pedido.criado", {',
          "  eventoId: randomUUID(), // permite ao consumidor descartar duplicatas",
          "  pedidoId: 123,",
          "  versao: 1, // contrato versionado",
          "});",
        ].join("\n"),
        nota: "`broker` representa o cliente do seu RabbitMQ, SQS, Kafka etc. (o método `publicar` é ilustrativo). `fetch` e `AbortSignal.timeout` existem nas versões atuais do Node.js; confira a documentação da sua versão.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Chamada de rede não é chamada de função",
        texto:
          "Uma chamada pela rede pode ser lenta, falhar ou ser repetida. Uma cadeia de chamadas síncronas soma as latências e multiplica as indisponibilidades, e sem timeout uma dependência lenta esgota as conexões e a memória de quem chama. Para evoluir contratos, acrescente campos opcionais (compatível) em vez de remover ou renomear (quebra); quando precisar quebrar, publique outra versão (`/v2`, outro tipo de evento) e mantenha a antiga até todos migrarem.",
      },
    ],
    armadilhas: [
      "Montar uma cadeia de chamadas síncronas (A→B→C→D): as latências somam, a disponibilidade se multiplica e uma lentidão no fim derruba o começo.",
      "Chamar outro serviço sem timeout, ou retentar sem idempotência: a chamada pendura recursos e a repetição duplica o efeito.",
      "Usar fila ou evento onde o usuário precisa da resposta agora, ou REST onde o fluxo poderia ser assíncrono: complexidade sem ganho.",
      "Mudar o contrato sem versionar (remover ou renomear campos): quebra consumidores que você talvez nem conheça.",
    ],
    autoteste: [
      {
        pergunta: "Quando preferir gRPC a REST?",
        resposta:
          "Em chamadas internas frequentes entre serviços, onde um contrato forte com código gerado, o formato binário e o streaming ajudam. O REST continua melhor para APIs públicas e para navegadores.",
      },
      {
        pergunta: "Qual a diferença entre comunicação síncrona e assíncrona na disponibilidade?",
        resposta:
          "Na síncrona, o chamador depende de o outro serviço estar no ar agora. Na assíncrona, o broker guarda a mensagem e o consumidor a processa quando voltar, ao custo de consistência eventual, duplicatas e ordem a tratar.",
      },
    ],
  },
  en: {
    titulo: "Service communication",
    pergunta: "How do services communicate with each other?",
    porqueEsteMetodo:
      "REST, gRPC and messaging solve the same problem in different ways. The matrix puts them side by side and the decision rule shows the question that chooses between them: does the caller need the answer now?",
    resposta30s:
      "Services communicate **synchronously** (REST over HTTP, gRPC), when the caller needs the answer now, or **asynchronously**, through messages and events on a broker (queue or publish/subscribe), when the work can wait or several services need to know about a fact. Every network call needs a **timeout**, retries only with idempotency and a **versioned contract**. Synchronous is simple but couples in time; asynchronous decouples, at the cost of eventual consistency and duplicates.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "REST, gRPC and messaging",
        colunas: ["Aspect", "REST (HTTP/JSON)", "gRPC", "Messaging / events"],
        linhas: [
          [
            "Style",
            "Synchronous, request and response over HTTP",
            "Synchronous (and streaming), remote procedure call over HTTP/2",
            "Asynchronous: the producer publishes to the broker and moves on; the consumer processes later",
          ],
          [
            "Contract",
            "OpenAPI/JSON Schema, optional but recommended",
            "A `.proto` file is required; client and server code is generated",
            "Message schema (JSON Schema, Avro, Protobuf), preferably in a shared registry",
          ],
          [
            "Format and cost",
            "Text JSON: readable and easy to debug, a bit heavier",
            "Binary Protobuf: compact and fast, less readable",
            "Varies with the broker and the format; the broker is one more piece to operate",
          ],
          [
            "Coupling in time",
            "High: the other service must be up and answer now",
            "High, as with REST",
            "Low: the broker keeps the message while the consumer is down",
          ],
          [
            "Good for",
            "Public APIs, browsers, third-party integration, simple queries",
            "Frequent, low-latency internal calls, streaming, strong contracts",
            "Spreading facts to several services, background work, absorbing spikes (see L103)",
          ],
          [
            "Main cautions",
            "Timeout, retries only with idempotency, API versioning",
            "Evolve the `.proto` without reusing field numbers; browsers need an extra layer (gRPC-Web); a load balancer that supports HTTP/2",
            "At-least-once delivery (duplicates), ordering, idempotency, dead-letter queue, eventual consistency",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Ask: **does the caller need the answer now to continue?** If so, use a synchronous call: REST at the edge and with third parties, gRPC for heavy internal traffic. If the work can wait, or several services need to know about a fact (“order created”), use messages or events. On any network call, set a **timeout**, retry only what is idempotent (see L104 and L105) and treat the contract as a public API, with a version.",
      },
      {
        tipo: "codigo",
        titulo: "A synchronous call with a timeout and a published event",
        legenda: "JavaScript",
        codigo: [
          'import { randomUUID } from "node:crypto";',
          "",
          "// 1) Synchronous: I need the answer now. Always with a timeout.",
          'const res = await fetch("http://inventory/items/42", {',
          "  signal: AbortSignal.timeout(2_000), // does not wait forever",
          "});",
          "if (!res.ok) throw new Error(`inventory answered ${res.status}`);",
          "const item = await res.json();",
          "",
          "// 2) Asynchronous: I announce a fact and move on; whoever cares reacts later.",
          'await broker.publish("order.created", {',
          "  eventId: randomUUID(), // lets the consumer discard duplicates",
          "  orderId: 123,",
          "  version: 1, // versioned contract",
          "});",
        ].join("\n"),
        nota: "`broker` stands for the client of your RabbitMQ, SQS, Kafka and so on (the `publish` method is illustrative). `fetch` and `AbortSignal.timeout` exist in current Node.js versions; check the documentation for your version.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A network call is not a function call",
        texto:
          "A network call can be slow, fail or be repeated. A chain of synchronous calls adds up the latencies and multiplies the unavailabilities, and without a timeout a slow dependency exhausts the caller’s connections and memory. To evolve contracts, add optional fields (compatible) instead of removing or renaming them (breaking); when you must break, publish another version (`/v2`, another event type) and keep the old one until everyone has migrated.",
      },
    ],
    armadilhas: [
      "Building a chain of synchronous calls (A→B→C→D): latencies add up, availability multiplies and a slowdown at the end brings down the start.",
      "Calling another service with no timeout, or retrying without idempotency: the call hangs on to resources and the repeat duplicates the effect.",
      "Using a queue or an event where the user needs the answer now, or REST where the flow could be asynchronous: complexity for no gain.",
      "Changing the contract without versioning (removing or renaming fields): it breaks consumers you may not even know about.",
    ],
    autoteste: [
      {
        pergunta: "When should you prefer gRPC over REST?",
        resposta:
          "For frequent internal calls between services, where a strong contract with generated code, the binary format and streaming help. REST remains better for public APIs and for browsers.",
      },
      {
        pergunta:
          "What is the difference between synchronous and asynchronous communication when it comes to availability?",
        resposta:
          "With synchronous, the caller depends on the other service being up right now. With asynchronous, the broker keeps the message and the consumer processes it when it is back, at the cost of eventual consistency, duplicates and ordering to handle.",
      },
    ],
  },
};
