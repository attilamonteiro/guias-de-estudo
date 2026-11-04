import type { Pergunta } from "../../tipos";

// P35 · Event Sourcing
export const p035: Pergunta = {
  numero: 735,
  modulo: "pawanmkr-arquitetura",
  metodo: "trace",
  pt: {
    titulo: "Event Sourcing",
    pergunta: "O que é Event Sourcing e como ele pode ser aplicado em um sistema Node.js?",
    porqueEsteMetodo:
      "Event Sourcing inverte o hábito de guardar o estado atual, e isso só fica claro seguindo um caso concreto do começo ao fim: uma conta, evento a evento, incluindo o que acontece quando a regra recusa, quando duas operações colidem e quando é preciso corrigir o passado.",
    resposta30s:
      "No **Event Sourcing** você não guarda o estado atual, e sim a **sequência de eventos** que aconteceram (`ContaAberta`, `DepositoFeito`, `SaqueFeito`) num log **só de acréscimo**; o estado é a **soma desses eventos** (replay), e correções são novos eventos, nunca edições. Dá auditoria completa e permite refazer leituras, ao custo de complexidade, consistência eventual e um esquema de eventos que precisa durar. Em Node, costuma-se usar um stream por agregado com **controle de concorrência otimista**, em Postgres ou num banco próprio para eventos, como o EventStoreDB.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma conta bancária, evento a evento",
        etapas: [
          "Abre-se a conta: grava-se `ContaAberta` no stream `conta-123` (versão 1). Não existe uma linha “saldo”",
          "Depósito de 100: grava-se `DepositoFeito { valor: 100 }` (versão 2)",
          "Saque de 30: grava-se `SaqueFeito { valor: 30 }` (versão 3)",
          "Para saber o saldo, lê-se o stream em ordem e aplica-se cada evento ao estado: 0, depois 100, depois 70 (**replay**)",
          "Para listar contas na tela, uma **projeção** (veja P34) consome os eventos e mantém uma tabela de leitura com o saldo de cada conta",
        ],
        nota: "Evento é um **fato já ocorrido**, por isso o nome vai no passado e ele nunca é alterado. Quem pode ser recusado é o comando (“sacar”); o evento só registra o que de fato aconteceu.",
      },
      {
        tipo: "passos",
        titulo: "E quando algo dá errado",
        passos: [
          {
            titulo: "A regra recusa o saque",
            texto:
              "Um saque de 100 chega com saldo 70. O handler faz o replay, vê que 70 é menor que 100 e lança erro: nenhum evento é gravado. A regra de negócio mora no comando; só o que passa por ela vira evento.",
          },
          {
            titulo: "Dois saques ao mesmo tempo",
            texto:
              "As duas requisições leem o stream na versão 3 e decidem com base nela. A primeira grava informando `versaoEsperada: 3` e passa. A segunda também informa 3, mas o stream já está na 4: o armazenamento recusa por conflito. A segunda relê, refaz a decisão e tenta de novo (ou desiste). É a **concorrência otimista**, sem lock.",
          },
          {
            titulo: "Um depósito foi lançado errado",
            texto:
              "Não se edita nem se apaga o evento antigo. Grava-se um **evento compensatório** (`DepositoEstornado`, ou `CorrecaoLancada` com o motivo). O replay passa a dar o saldo certo, e a história mostra o erro e a correção, o que é exatamente o que uma auditoria quer ver.",
          },
          {
            titulo: "O stream ficou enorme",
            texto:
              "Refazer o replay de milhares de eventos a cada comando custa. Um **snapshot** (retrato do estado a cada N eventos) permite carregar o último retrato e aplicar só os eventos posteriores. O snapshot é uma otimização descartável: a fonte da verdade continua sendo o log.",
          },
          {
            titulo: "O formato do evento mudou",
            texto:
              "Eventos antigos ficam guardados para sempre no formato antigo. Por isso se versiona o esquema e se escreve um conversor (um “upcaster”) que traz o evento velho para o formato novo na leitura. Quem lê os eventos precisa tolerar tipos que não conhece.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Replay e gravação com versão esperada",
        legenda: "JavaScript",
        codigo: [
          "function aplicar(conta, evento) {",
          "  switch (evento.tipo) {",
          '    case "ContaAberta":   return { aberta: true, saldo: 0 };',
          '    case "DepositoFeito": return { ...conta, saldo: conta.saldo + evento.valor };',
          '    case "SaqueFeito":    return { ...conta, saldo: conta.saldo - evento.valor };',
          "    default:              return conta; // evento desconhecido não quebra o replay",
          "  }",
          "}",
          "",
          "export async function sacar(store, contaId, valor) {",
          "  const stream = `conta-${contaId}`;",
          "  const { eventos, versao } = await store.ler(stream);",
          "  const conta = eventos.reduce(aplicar, { aberta: false, saldo: 0 });",
          '  if (conta.saldo < valor) throw new Error("saldo insuficiente");',
          "  // falha se alguém gravou depois da versão lida",
          '  await store.acrescentar(stream, [{ tipo: "SaqueFeito", valor }], { versaoEsperada: versao });',
          "}",
        ].join("\n"),
        nota: "`store` é ilustrativo. Valores em centavos. No Postgres, uma tabela `eventos (stream, versao, tipo, dados)` com chave única em `(stream, versao)` já dá a concorrência otimista: a gravação conflitante falha.",
      },
      {
        tipo: "tabela",
        titulo: "O que se ganha e o que se paga",
        colunas: ["Tema", "Ganho", "Custo"],
        linhas: [
          [
            "Histórico",
            "Linha do tempo completa e auditoria quase de graça; dá para ver o estado em qualquer momento do passado",
            "O log só cresce; ler o estado atual exige replay ou snapshot",
          ],
          [
            "Novos usos",
            "Criar uma projeção nova ou corrigir uma errada relendo todo o passado",
            "As leituras são eventualmente consistentes (veja P34) e reconstruir projeções leva tempo",
          ],
          [
            "Correção",
            "Corrigir por evento compensatório preserva o rastro do que aconteceu",
            "O esquema dos eventos é um contrato permanente: versionar e converter eventos antigos dá trabalho",
          ],
          [
            "Dados pessoais",
            "Os eventos podem registrar quem fez o quê e quando",
            "O log é imutável, o que colide com o direito de apagar dados (LGPD): evite dado pessoal no evento ou cifre-o com uma chave que possa ser descartada, com orientação jurídica",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Como montar em Node",
        texto:
          "Use **um stream por agregado** (uma conta, um pedido), com versão crescente e gravação com **versão esperada**. O armazenamento pode ser uma tabela em Postgres ou um banco feito para eventos, como o EventStoreDB; confira a documentação do que escolher. Publique os eventos aos consumidores com outbox ou pelo próprio log e mantenha as projeções idempotentes. Não confunda com publicar eventos entre serviços: Event Sourcing é sobre **como o estado é guardado**, e é opcional, mesmo em sistemas orientados a eventos. Adote onde a história importa (dinheiro, auditoria, fluxos longos), não por padrão.",
      },
    ],
    armadilhas: [
      "Editar ou apagar um evento antigo para “corrigir”: quebra a auditoria e as projeções já calculadas. Grave um evento compensatório.",
      "Eventos com forma de CRUD (`ContaAtualizada` com todos os campos): perdem a intenção de negócio. Nomeie o fato (`LimiteAlterado`) e guarde só o que mudou.",
      "Ignorar o crescimento do log e a evolução do esquema: sem snapshots o replay fica lento, e sem versionamento um evento antigo quebra o código novo.",
      "Pôr dado pessoal direto nos eventos sem plano para apagá-lo: o log é imutável, e o pedido de exclusão chegará.",
    ],
    autoteste: [
      {
        pergunta: "Como se descobre o saldo se o banco só guarda eventos?",
        resposta:
          "Lê-se o stream da conta em ordem e aplica-se cada evento ao estado (um `reduce`): o saldo é o resultado do replay. Com snapshots, parte-se do último retrato e aplicam-se só os eventos posteriores.",
      },
      {
        pergunta: "Um depósito foi lançado com o valor errado. Como corrigir?",
        resposta:
          "Não se edita o passado: grava-se um evento compensatório (estorno ou correção, com o motivo). O replay passa a dar o valor certo e o histórico mantém o erro e a sua correção.",
      },
    ],
  },
  en: {
    titulo: "Event Sourcing",
    pergunta: "What is Event Sourcing and how can it be applied in a Node.js system?",
    porqueEsteMetodo:
      "Event Sourcing inverts the habit of storing the current state, and that only becomes clear by following one concrete case from start to finish: an account, event by event, including what happens when a rule rejects, when two operations collide and when the past has to be corrected.",
    resposta30s:
      "With **Event Sourcing** you do not store the current state, you store the **sequence of events** that happened (`AccountOpened`, `DepositMade`, `WithdrawalMade`) in an **append-only** log; the state is the **sum of those events** (replay), and fixes are new events, never edits. It gives a complete audit trail and lets you rebuild reads, at the cost of complexity, eventual consistency and an event schema that has to last. In Node, you typically use one stream per aggregate with **optimistic concurrency control**, on Postgres or a database built for events, such as EventStoreDB.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A bank account, event by event",
        etapas: [
          "The account is opened: `AccountOpened` is written to the stream `account-123` (version 1). There is no “balance” row",
          "A deposit of 100: `DepositMade { amount: 100 }` is written (version 2)",
          "A withdrawal of 30: `WithdrawalMade { amount: 30 }` is written (version 3)",
          "To know the balance, read the stream in order and apply each event to the state: 0, then 100, then 70 (**replay**)",
          "To list accounts on a screen, a **projection** (see P34) consumes the events and keeps a read table with each account’s balance",
        ],
        nota: "An event is a **fact that already happened**, which is why its name is in the past tense and it is never changed. What can be rejected is the command (“withdraw”); the event only records what actually happened.",
      },
      {
        tipo: "passos",
        titulo: "And when something goes wrong",
        passos: [
          {
            titulo: "The rule rejects the withdrawal",
            texto:
              "A withdrawal of 100 arrives with a balance of 70. The handler replays the stream, sees that 70 is less than 100 and throws: no event is written. The business rule lives in the command; only what passes through it becomes an event.",
          },
          {
            titulo: "Two withdrawals at the same time",
            texto:
              "Both requests read the stream at version 3 and decide based on it. The first writes with `expectedVersion: 3` and succeeds. The second also says 3, but the stream is now at 4: the store rejects it as a conflict. The second one rereads, redoes the decision and retries (or gives up). This is **optimistic concurrency**, with no lock.",
          },
          {
            titulo: "A deposit was entered wrongly",
            texto:
              "The old event is neither edited nor deleted. A **compensating event** is written (`DepositReversed`, or `CorrectionEntered` with the reason). The replay now yields the right balance, and the history shows both the mistake and the fix, which is exactly what an audit wants to see.",
          },
          {
            titulo: "The stream became huge",
            texto:
              "Replaying thousands of events on every command is costly. A **snapshot** (a picture of the state every N events) lets you load the latest picture and apply only the later events. The snapshot is a disposable optimization: the source of truth is still the log.",
          },
          {
            titulo: "The event format changed",
            texto:
              "Old events stay stored forever in the old format. That is why you version the schema and write a converter (an “upcaster”) that brings the old event to the new format at read time. Whoever reads the events has to tolerate types it does not know.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Replay and writing with an expected version",
        legenda: "JavaScript",
        codigo: [
          "function apply(account, event) {",
          "  switch (event.type) {",
          '    case "AccountOpened":  return { open: true, balance: 0 };',
          '    case "DepositMade":    return { ...account, balance: account.balance + event.amount };',
          '    case "WithdrawalMade": return { ...account, balance: account.balance - event.amount };',
          "    default:               return account; // an unknown event does not break the replay",
          "  }",
          "}",
          "",
          "export async function withdraw(store, accountId, amount) {",
          "  const stream = `account-${accountId}`;",
          "  const { events, version } = await store.read(stream);",
          "  const account = events.reduce(apply, { open: false, balance: 0 });",
          '  if (account.balance < amount) throw new Error("insufficient funds");',
          "  // fails if someone wrote after the version we read",
          '  await store.append(stream, [{ type: "WithdrawalMade", amount }], { expectedVersion: version });',
          "}",
        ].join("\n"),
        nota: "`store` is illustrative. Amounts are in cents. On Postgres, an `events (stream, version, type, data)` table with a unique key on `(stream, version)` already gives you optimistic concurrency: the conflicting write fails.",
      },
      {
        tipo: "tabela",
        titulo: "What you gain and what you pay",
        colunas: ["Topic", "Gain", "Cost"],
        linhas: [
          [
            "History",
            "A complete timeline and an almost free audit trail; you can see the state at any moment in the past",
            "The log only grows; reading the current state needs a replay or a snapshot",
          ],
          [
            "New uses",
            "Build a new projection, or fix a wrong one, by rereading the whole past",
            "Reads are eventually consistent (see P34) and rebuilding projections takes time",
          ],
          [
            "Corrections",
            "Fixing with a compensating event preserves the trail of what happened",
            "The event schema is a permanent contract: versioning and converting old events is work",
          ],
          [
            "Personal data",
            "Events can record who did what and when",
            "The log is immutable, which clashes with the right to erasure (GDPR, LGPD): keep personal data out of events or encrypt it with a key that can be discarded, with legal advice",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "How to build it in Node",
        texto:
          "Use **one stream per aggregate** (an account, an order), with an increasing version and writes that carry the **expected version**. Storage can be a Postgres table or a database built for events, such as EventStoreDB; check the documentation of whatever you choose. Publish the events to consumers with an outbox or through the log itself and keep projections idempotent. Do not confuse it with publishing events between services: Event Sourcing is about **how state is stored**, and it is optional, even in event-driven systems. Adopt it where history matters (money, auditing, long workflows), not by default.",
      },
    ],
    armadilhas: [
      "Editing or deleting an old event to “fix” it: it breaks the audit trail and the projections already computed. Write a compensating event.",
      "Events shaped like CRUD (`AccountUpdated` with every field): they lose the business intent. Name the fact (`LimitChanged`) and store only what changed.",
      "Ignoring log growth and schema evolution: without snapshots the replay gets slow, and without versioning an old event breaks the new code.",
      "Putting personal data straight into events with no plan to erase it: the log is immutable, and the deletion request will come.",
    ],
    autoteste: [
      {
        pergunta: "How do you find the balance if the database only stores events?",
        resposta:
          "Read the account stream in order and apply each event to the state (a `reduce`): the balance is the result of the replay. With snapshots, start from the latest picture and apply only the later events.",
      },
      {
        pergunta: "A deposit was entered with the wrong amount. How do you fix it?",
        resposta:
          "You do not edit the past: you write a compensating event (a reversal or correction, with the reason). The replay then gives the right value and the history keeps both the mistake and its correction.",
      },
    ],
  },
};
