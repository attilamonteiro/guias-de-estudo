import type { Pergunta } from "../../tipos";

// P60 · Consistência eventual
export const p060: Pergunta = {
  numero: 760,
  modulo: "pawanmkr-distribuidos",
  metodo: "whys",
  pt: {
    titulo: "Consistência eventual",
    pergunta: "Como você implementaria consistência eventual em um sistema distribuído?",
    porqueEsteMetodo:
      "Consistência eventual parece um defeito aceito por preguiça. A cadeia de “por quês” mostra que é uma troca deliberada e, ao mesmo tempo, lista as obrigações que vêm com ela: convergir, tolerar repetição e desordem, resolver conflitos e ser honesta com o usuário.",
    resposta30s:
      "**Consistência eventual** significa que réplicas e serviços podem divergir por um tempo, mas, se as escritas pararem, **todos convergem** para o mesmo valor. Para implementá-la, use **eventos ou filas** com entrega pelo menos uma vez e **consumidores idempotentes**, **outbox transacional** para não perder eventos, **versões** para ordenar e resolver conflitos e **reconciliação periódica**; e projete a interface para o intervalo (“processando”, ler o próprio resultado). Não serve onde a regra exige consistência forte, como checar o saldo antes de gastar.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que um sistema distribuído não fica consistente de imediato?",
            resposta:
              "Porque os dados vivem em vários lugares (réplicas do banco, serviços com bancos próprios, caches, índices de busca) e a atualização viaja pela rede, que tem latência e falha. Atualizar todos ao mesmo tempo exigiria coordenação síncrona: todos confirmando antes de qualquer resposta.",
          },
          {
            pergunta: "Por que então aceitar um intervalo em que eles divergem?",
            resposta:
              "Porque a coordenação síncrona tem preço: mais latência e, quando um participante está lento ou inacessível, menos disponibilidade (veja P38). Entre serviços com bancos separados, uma transação única nem existe. Para muita coisa (contador de curtidas, feed, estoque exibido, status do pedido), alguns segundos de atraso são aceitáveis.",
          },
          {
            pergunta: "Por que isso exige garantir que o sistema converge?",
            resposta:
              "Porque “eventual” só vale se, ao cessarem as escritas, todos chegam ao mesmo valor. Uma mensagem perdida deixaria uma réplica errada para sempre. Daí o conjunto de mecanismos: **entrega pelo menos uma vez** (filas, retentativas) com **consumidores idempotentes** para duplicatas (veja L104), **outbox transacional** para o evento não se perder entre gravar e publicar, e **reconciliação periódica** que compara as fontes e corrige o que escapou.",
          },
          {
            pergunta: "Por que ordem e conflitos são a parte difícil?",
            resposta:
              "Porque mensagens chegam fora de ordem e duas réplicas podem aceitar escritas diferentes ao mesmo tempo. É preciso uma regra determinística: **número de versão ou de sequência** para descartar o que é mais antigo, **relógios lógicos** para saber o que veio antes do quê, e uma política de conflito: a **última escrita vence** (simples, mas perde dados), o **merge** guiado pela regra de negócio ou **CRDTs**, estruturas de dados que se combinam sem conflito por construção.",
          },
          {
            pergunta: "Por que a interface precisa ser desenhada para isso?",
            resposta:
              "Porque o usuário grava e a tela seguinte pode mostrar o valor antigo. As saídas são o **read-your-writes**: devolver o resultado na própria resposta do comando, atualizar a tela de forma otimista ou ler do lado da escrita logo depois de gravar; e dizer a verdade, com estados como “processando” em vez de “concluído” antes da hora.",
          },
        ],
        causaRaiz:
          "Consistência eventual não é “inconsistência tolerada”, e sim um **contrato**: as cópias podem divergir por um tempo, mas o projeto garante a **convergência** (nada se perde, se duplica ou se aplica fora de ordem de forma permanente) e a interface é **honesta** sobre o intervalo.",
      },
      {
        tipo: "codigo",
        titulo: "Um consumidor seguro contra repetição e desordem",
        legenda: "JavaScript",
        codigo: [
          '// Recebe eventos "estoque alterado" que podem chegar repetidos ou fora de ordem',
          "export async function aoReceber(evento, db) {",
          "  await db.transaction(async (tx) => {",
          "    if (await tx.processados.existe(evento.id)) return; // repetido: ignora",
          "",
          "    const atual = await tx.estoqueLido.obter(evento.produtoId);",
          "    if (atual && atual.versao >= evento.versao) return; // mais antigo que o que já temos",
          "",
          "    await tx.estoqueLido.gravar({",
          "      id: evento.produtoId,",
          "      quantidade: evento.quantidade,",
          "      versao: evento.versao,",
          "    });",
          "    await tx.processados.registrar(evento.id); // junto com o efeito, na mesma transação",
          "  });",
          "}",
        ].join("\n"),
        nota: "`db` e `tx` são ilustrativos. A versão vem do lado que escreve, por agregado. Registrar o id junto com o efeito, na mesma transação, é o que torna a repetição inofensiva.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Quando NÃO usar",
        texto:
          "Onde a regra de negócio depende de ver o valor mais recente, use **consistência forte** (transação no banco, serialização por chave): checar o saldo antes de debitar, garantir que o último item em estoque não seja vendido duas vezes, impor unicidade (um e-mail por conta, por exemplo). Uma réplica atrasada deixaria gastar duas vezes o mesmo valor. O desenho comum é misturar: forte na **checagem da invariante** (dentro de um serviço ou de uma partição) e eventual no que apenas **reflete** o resultado (extrato, notificação, busca, painéis).",
      },
    ],
    armadilhas: [
      "Consumidor que não é idempotente com entrega pelo menos uma vez: a mesma mensagem cobra ou baixa o estoque duas vezes. Registre o id processado junto com o efeito (veja L104).",
      "Gravar no banco e publicar o evento em duas etapas, sem outbox: se o processo cai no meio, as cópias divergem para sempre e nada as reconcilia.",
      "Resolver conflito por “última escrita vence” com o relógio de cada máquina: os relógios diferem, e a escrita certa pode ser descartada em silêncio. Prefira versões ou relógios lógicos.",
      "Mostrar “pago!” ou uma lista que ainda não reflete o que o usuário acabou de fazer: sem read-your-writes nem estado “processando”, a pessoa repete a ação.",
    ],
    autoteste: [
      {
        pergunta: "Como impedir que uma mensagem entregue duas vezes tenha o efeito duplicado?",
        resposta:
          "Tornando o consumidor idempotente: guarda-se o id da mensagem processada na mesma transação do efeito e ignora-se uma repetição, ou usa-se uma operação naturalmente idempotente (gravar o valor com a sua versão, em vez de somar).",
      },
      {
        pergunta: "Por que checar o saldo antes de um débito costuma pedir consistência forte, e o extrato não?",
        resposta:
          "A regra “não gastar mais do que existe” depende do valor mais recente; uma cópia atrasada permitiria gastar duas vezes. O extrato e as notificações apenas refletem o que já aconteceu e toleram atraso.",
      },
    ],
  },
  en: {
    titulo: "Eventual consistency",
    pergunta: "How would you implement eventual consistency in a distributed system?",
    porqueEsteMetodo:
      "Eventual consistency looks like a defect accepted out of laziness. The chain of “whys” shows that it is a deliberate trade-off and, at the same time, lists the obligations that come with it: converging, tolerating repeats and disorder, resolving conflicts and being honest with the user.",
    resposta30s:
      "**Eventual consistency** means replicas and services may diverge for a while but, if writes stop, **they all converge** to the same value. To implement it, use **events or queues** with at-least-once delivery and **idempotent consumers**, a **transactional outbox** so events are not lost, **versions** to order and resolve conflicts, and **periodic reconciliation**; and design the interface for the gap (“processing”, reading your own result). It does not fit where the rule needs strong consistency, such as checking a balance before spending.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why is a distributed system not consistent right away?",
            resposta:
              "Because the data lives in several places (database replicas, services with their own databases, caches, search indexes) and the update travels over a network that has latency and failures. Updating everything at once would require synchronous coordination: everyone confirming before any answer is given.",
          },
          {
            pergunta: "Then why accept a gap in which they diverge?",
            resposta:
              "Because synchronous coordination has a price: more latency and, when a participant is slow or unreachable, less availability (see P38). Between services with separate databases, a single transaction does not even exist. For plenty of things (like counters, feeds, displayed stock, order status), a few seconds of delay is acceptable.",
          },
          {
            pergunta: "Why does that require making sure the system converges?",
            resposta:
              "Because “eventual” only holds if, once writes stop, everyone reaches the same value. A lost message would leave a replica wrong forever. Hence the set of mechanisms: **at-least-once delivery** (queues, retries) with **idempotent consumers** for duplicates (see L104), a **transactional outbox** so the event is not lost between saving and publishing, and **periodic reconciliation** that compares the sources and fixes what slipped through.",
          },
          {
            pergunta: "Why are ordering and conflicts the hard part?",
            resposta:
              "Because messages arrive out of order and two replicas may accept different writes at the same time. You need a deterministic rule: a **version or sequence number** to discard what is older, **logical clocks** to know what came before what, and a conflict policy: **last write wins** (simple, but loses data), a **merge** guided by the business rule, or **CRDTs**, data structures that combine without conflict by construction.",
          },
          {
            pergunta: "Why does the interface need to be designed for this?",
            resposta:
              "Because the user saves and the next screen may show the old value. The ways out are **read-your-writes**: returning the result in the command’s own response, updating the screen optimistically or reading from the write side right after saving; and telling the truth, with states like “processing” instead of “done” too early.",
          },
        ],
        causaRaiz:
          "Eventual consistency is not “tolerated inconsistency”; it is a **contract**: copies may diverge for a while, but the design guarantees **convergence** (nothing is permanently lost, duplicated or applied out of order) and the interface is **honest** about the gap.",
      },
      {
        tipo: "codigo",
        titulo: "A consumer that is safe against repeats and disorder",
        legenda: "JavaScript",
        codigo: [
          '// Receives "stock changed" events that may arrive repeated or out of order',
          "export async function onEvent(event, db) {",
          "  await db.transaction(async (tx) => {",
          "    if (await tx.processed.exists(event.id)) return; // repeated: ignore",
          "",
          "    const current = await tx.stockRead.get(event.productId);",
          "    if (current && current.version >= event.version) return; // older than what we have",
          "",
          "    await tx.stockRead.save({",
          "      id: event.productId,",
          "      quantity: event.quantity,",
          "      version: event.version,",
          "    });",
          "    await tx.processed.record(event.id); // together with the effect, in the same transaction",
          "  });",
          "}",
        ].join("\n"),
        nota: "`db` and `tx` are illustrative. The version comes from the writing side, per aggregate. Recording the id together with the effect, in the same transaction, is what makes a repeat harmless.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "When NOT to use it",
        texto:
          "Where the business rule depends on seeing the latest value, use **strong consistency** (a database transaction, serialization per key): checking the balance before debiting, making sure the last item in stock is not sold twice, enforcing uniqueness (one email per account, for example). A stale replica would let the same value be spent twice. The common design is to mix: strong at the **invariant check** (inside one service or partition) and eventual for whatever merely **reflects** the result (statements, notifications, search, dashboards).",
      },
    ],
    armadilhas: [
      "A consumer that is not idempotent under at-least-once delivery: the same message charges or decrements stock twice. Record the processed id together with the effect (see L104).",
      "Writing to the database and publishing the event in two separate steps, with no outbox: if the process crashes in between, the copies diverge forever and nothing reconciles them.",
      "Resolving conflicts by “last write wins” with each machine’s own clock: clocks differ, and the right write can be silently discarded. Prefer versions or logical clocks.",
      "Showing “paid!” or a list that does not yet reflect what the user just did: with no read-your-writes and no “processing” state, people repeat the action.",
    ],
    autoteste: [
      {
        pergunta: "How do you stop a message delivered twice from having its effect twice?",
        resposta:
          "By making the consumer idempotent: store the processed message id in the same transaction as the effect and ignore a repeat, or use a naturally idempotent operation (setting the value with its version, rather than adding to it).",
      },
      {
        pergunta:
          "Why does checking the balance before a debit usually need strong consistency, while a statement does not?",
        resposta:
          "The rule “do not spend more than exists” depends on the latest value; a stale copy would allow spending twice. Statements and notifications only reflect what already happened and tolerate delay.",
      },
    ],
  },
};
