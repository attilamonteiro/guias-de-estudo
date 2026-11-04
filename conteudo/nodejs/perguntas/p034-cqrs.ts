import type { Pergunta } from "../../tipos";

// P34 · CQRS
export const p034: Pergunta = {
  numero: 734,
  modulo: "pawanmkr-arquitetura",
  metodo: "feynman",
  pt: {
    titulo: "CQRS",
    pergunta: "O que é CQRS (Command Query Responsibility Segregation) e como ele é implementado em APIs de backend?",
    porqueEsteMetodo:
      "CQRS tem nome pesado e ideia simples: quem escreve e quem lê têm necessidades diferentes. A analogia do restaurante torna a separação natural, e o resto da explicação mostra os níveis em que ela pode ser feita e onde ela custa.",
    resposta30s:
      "**CQRS** separa o modelo que **muda** o estado (**comandos**: validam regras e gravam) do modelo que **lê** (**consultas**: só devolvem dados, num formato pronto para a tela). Numa API, `POST`/`PUT`/`DELETE` passam por handlers de comando e os `GET` leem de um modelo de leitura que pode ser só uma view ou um armazenamento à parte alimentado por eventos, com **consistência eventual** entre os dois lados. Vale quando leituras e escritas são muito assimétricas ou o domínio é complexo; num CRUD simples é exagero.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense num restaurante. O **caixa** registra pedidos: confere se o prato existe, se ainda há ingrediente e se o pagamento passou. É um trabalho cuidadoso, cheio de regras, feito um pedido de cada vez. Já o **cardápio na tela** e o painel de “pedido pronto” são lidos por muita gente, o tempo todo, e precisam estar num formato fácil de olhar, não no formato do livro-caixa. Com um caderno único para as duas coisas, ou o caixa ficaria lento por causa de quem só quer olhar, ou o painel ficaria ilegível por causa das regras do caixa.",
        tecnico:
          "**CQRS** (Command Query Responsibility Segregation) separa as **escritas** das **leituras**. Um **comando** expressa a intenção de mudar o estado (`CriarPedido`, `CancelarPedido`), passa pelas regras do domínio e pode ser recusado. Uma **consulta** só lê e nunca muda nada; ela lê de um **modelo de leitura** desenhado para o que a tela precisa (já agregado, filtrado e com os nomes certos). Numa API HTTP, o mais comum é `POST`, `PUT`, `PATCH` e `DELETE` irem para handlers de comando e os `GET` para consultas, cada lado com o seu modelo e, se preciso, o seu armazenamento.",
        limite:
          "A analogia esconde o preço: o painel nem sempre mostra o pedido no mesmo instante em que o caixa o registra. Quando os dois lados têm armazenamento separado, existe um intervalo de **consistência eventual** entre eles. E CQRS não exige dois bancos nem dois serviços: no nível mais simples é só separar o código que escreve do código que lê.",
      },
      {
        tipo: "tabela",
        titulo: "Os níveis de CQRS",
        colunas: ["Nível", "Como é", "A leitura vê a escrita?", "Custo"],
        linhas: [
          [
            "1. Modelos separados, mesmo banco",
            "Handlers de comando com as regras de domínio; consultas com SQL ou views sob medida, devolvendo objetos prontos para a tela",
            "Na hora: é o mesmo banco",
            "Baixo: é organização de código e costuma ser um bom ponto de partida",
          ],
          [
            "2. Modelo de leitura materializado",
            "Tabela ou view materializada para leitura, atualizada junto com a escrita ou por um job",
            "Na hora se for na mesma transação; com atraso se for por job",
            "Médio: é preciso manter a tabela de leitura em dia",
          ],
          [
            "3. Armazenamentos separados",
            "Escrita num banco; leitura em outro (busca, cache, documentos) alimentado por eventos por meio de uma **projeção**",
            "Com atraso: consistência eventual",
            "Alto: broker, projetores idempotentes, reconstrução e monitoramento",
          ],
          [
            "4. Com Event Sourcing",
            "O lado de escrita guarda eventos (veja P35) e as projeções montam as leituras",
            "Com atraso: consistência eventual",
            "Alto: soma-se o custo do Event Sourcing",
          ],
        ],
        nota: "Os níveis respondem à necessidade, não ao tamanho da empresa: comece no 1 e suba só quando uma dor real (leitura lenta, telas que pedem formatos muito diferentes) justificar.",
      },
      {
        tipo: "fluxo",
        titulo: "O caminho de um comando com leitura separada (nível 3)",
        etapas: [
          "O cliente envia `POST /pedidos`; o controlador valida o formato da entrada e cria o comando `CriarPedido`",
          "O **handler** do comando aplica as regras do domínio (itens válidos, crédito, estoque) e recusa se alguma falhar",
          "Se tudo passa, grava o novo estado e, **na mesma transação**, registra o evento `PedidoCriado` (padrão outbox); a API responde com o id, sem devolver um modelo de leitura",
          "Um publicador entrega o evento ao broker (fila ou log de eventos)",
          "O **projetor** consome o evento, de forma idempotente, e atualiza o modelo de leitura (por exemplo, a tabela `pedidos_resumo`)",
          "`GET /pedidos` lê direto do modelo de leitura, rápido e já no formato da tela",
        ],
        nota: "Entre a terceira e a quinta etapa há um intervalo. Responder o comando com o id, atualizar a tela de forma otimista ou ler do lado da escrita logo após gravar resolve o “gravei e não apareceu”.",
      },
      {
        tipo: "codigo",
        titulo: "Os dois lados em Node",
        legenda: "JavaScript",
        codigo: [
          'import { randomUUID } from "node:crypto";',
          "",
          "// Lado da escrita: valida, muda o estado e anuncia o que aconteceu",
          "export async function criarPedido(comando, { db }) {",
          '  if (comando.itens.length === 0) throw new Error("pedido sem itens");',
          "  const pedido = { id: randomUUID(), clienteId: comando.clienteId, itens: comando.itens };",
          "  await db.transaction(async (tx) => {",
          "    await tx.pedidos.insert(pedido);",
          '    await tx.outbox.insert({ tipo: "PedidoCriado", dados: pedido }); // mesma transação',
          "  });",
          "  return pedido.id;",
          "}",
          "",
          "// Lado da leitura: o projetor mantém um modelo feito para a tela",
          "export async function aoReceber(evento, { leitura }) {",
          '  if (evento.tipo !== "PedidoCriado") return;',
          "  const total = evento.dados.itens.reduce((soma, i) => soma + i.qtd * i.precoCents, 0);",
          "  await leitura.pedidosResumo.upsert({ id: evento.dados.id, total }); // repetir não duplica",
          "}",
        ].join("\n"),
        nota: "`db` e `leitura` representam o seu cliente de banco; os nomes são ilustrativos. O dinheiro está em centavos.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Quando vale e quando é exagero",
        texto:
          "CQRS compensa quando leituras e escritas são **muito assimétricas** (muitas consultas para cada gravação), quando as telas pedem formatos bem diferentes do modelo de gravação ou quando o domínio tem regras complexas que não devem se misturar com consultas. Num CRUD simples é exagero: duas peças, projetores e consistência eventual para resolver um problema que você não tem. Não exige Event Sourcing (veja P35) nem microsserviços, embora combine bem com ambos. Existem módulos prontos (por exemplo, o de CQRS do NestJS), mas o padrão cabe em funções simples; confira a documentação do que adotar.",
      },
    ],
    armadilhas: [
      "Adotar CQRS num CRUD simples: dois modelos, fila e projetores para um formulário que um único modelo resolvia.",
      "Esquecer a consistência eventual: o usuário grava e a lista ainda não mostra o item. Devolva o id no comando, atualize a tela de forma otimista ou leia do lado da escrita quando for essencial.",
      "Achar que CQRS exige Event Sourcing ou dois bancos: os níveis mais simples usam o mesmo banco, e os dois padrões são independentes.",
      "Projeção que não é idempotente nem pode ser reconstruída do zero: eventos repetidos duplicam dados, e um erro no projetor vira dado errado para sempre.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre um comando e uma consulta?",
        resposta:
          "O comando expressa a intenção de mudar o estado, passa pelas regras do domínio e pode ser recusado; devolve pouco (um id ou uma confirmação). A consulta só lê, nunca muda nada e pode ler de um modelo desenhado para a tela.",
      },
      {
        pergunta: "É preciso ter dois bancos e Event Sourcing para usar CQRS?",
        resposta:
          "Não. O nível mais simples só separa o código que escreve do que lê, no mesmo banco. Armazenamentos separados e Event Sourcing são degraus opcionais; com bancos separados a leitura passa a ser eventualmente consistente.",
      },
    ],
  },
  en: {
    titulo: "CQRS",
    pergunta: "What is CQRS (Command Query Responsibility Segregation) and how is it implemented in backend APIs?",
    porqueEsteMetodo:
      "CQRS has a heavy name and a simple idea: whoever writes and whoever reads have different needs. The restaurant analogy makes the split feel natural, and the rest of the explanation shows the levels at which it can be done and where it costs.",
    resposta30s:
      "**CQRS** separates the model that **changes** state (**commands**: validate rules and write) from the model that **reads** (**queries**: only return data, in a shape ready for the screen). In an API, `POST`/`PUT`/`DELETE` go through command handlers and `GET` reads from a read model that can be just a view or a separate store fed by events, with **eventual consistency** between the two sides. It pays off when reads and writes are very asymmetric or the domain is complex; for a simple CRUD it is overkill.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a restaurant. The **cashier** records orders: checks that the dish exists, that an ingredient is left and that the payment went through. It is careful work, full of rules, done one order at a time. The **menu on the screen** and the “order ready” board, on the other hand, are read by many people, all the time, and need a shape that is easy to glance at, not the shape of the cash ledger. With a single notebook for both jobs, either the cashier would slow down because of people who only want to look, or the board would be unreadable because of the cashier’s rules.",
        tecnico:
          "**CQRS** (Command Query Responsibility Segregation) separates **writes** from **reads**. A **command** expresses the intent to change state (`CreateOrder`, `CancelOrder`), goes through the domain rules and can be rejected. A **query** only reads and never changes anything; it reads from a **read model** designed for what the screen needs (already aggregated, filtered and with the right names). In an HTTP API, the most common arrangement is `POST`, `PUT`, `PATCH` and `DELETE` going to command handlers and `GET` going to queries, each side with its own model and, if needed, its own storage.",
        limite:
          "The analogy hides the price: the board does not always show the order at the same instant the cashier records it. When the two sides have separate storage, there is an **eventual consistency** gap between them. And CQRS is not necessarily two databases or two services: at its simplest it is just separating the code that writes from the code that reads.",
      },
      {
        tipo: "tabela",
        titulo: "The levels of CQRS",
        colunas: ["Level", "What it looks like", "Does the read see the write?", "Cost"],
        linhas: [
          [
            "1. Separate models, same database",
            "Command handlers with the domain rules; queries using tailored SQL or views, returning objects ready for the screen",
            "Right away: it is the same database",
            "Low: it is code organization and is usually a good starting point",
          ],
          [
            "2. Materialized read model",
            "A read table or materialized view, updated together with the write or by a job",
            "Right away if in the same transaction; delayed if done by a job",
            "Medium: the read table has to be kept up to date",
          ],
          [
            "3. Separate stores",
            "Writes go to one database; reads come from another (search, cache, documents) fed by events through a **projection**",
            "Delayed: eventual consistency",
            "High: broker, idempotent projectors, rebuilds and monitoring",
          ],
          [
            "4. With Event Sourcing",
            "The write side stores events (see P35) and projections build the reads",
            "Delayed: eventual consistency",
            "High: the cost of Event Sourcing is added",
          ],
        ],
        nota: "The levels answer a need, not a company size: start at 1 and move up only when a real pain (slow reads, screens that ask for very different shapes) justifies it.",
      },
      {
        tipo: "fluxo",
        titulo: "The path of a command with a separate read side (level 3)",
        etapas: [
          "The client sends `POST /orders`; the controller validates the shape of the input and creates the `CreateOrder` command",
          "The command **handler** applies the domain rules (valid items, credit, stock) and rejects the command if any of them fails",
          "If everything passes, it saves the new state and, **in the same transaction**, records the `OrderCreated` event (outbox pattern); the API answers with the id, without returning a read model",
          "A publisher delivers the event to the broker (queue or event log)",
          "The **projector** consumes the event, idempotently, and updates the read model (for example, the `orders_summary` table)",
          "`GET /orders` reads straight from the read model, fast and already in the shape of the screen",
        ],
        nota: "Between the third and fifth steps there is a gap. Answering the command with the id, updating the screen optimistically or reading from the write side right after saving fixes the “I saved it and it did not show up” problem.",
      },
      {
        tipo: "codigo",
        titulo: "Both sides in Node",
        legenda: "JavaScript",
        codigo: [
          'import { randomUUID } from "node:crypto";',
          "",
          "// Write side: validates, changes state and announces what happened",
          "export async function createOrder(command, { db }) {",
          '  if (command.items.length === 0) throw new Error("order without items");',
          "  const order = { id: randomUUID(), customerId: command.customerId, items: command.items };",
          "  await db.transaction(async (tx) => {",
          "    await tx.orders.insert(order);",
          '    await tx.outbox.insert({ type: "OrderCreated", data: order }); // same transaction',
          "  });",
          "  return order.id;",
          "}",
          "",
          "// Read side: the projector keeps a model built for the screen",
          "export async function onEvent(event, { reads }) {",
          '  if (event.type !== "OrderCreated") return;',
          "  const total = event.data.items.reduce((sum, i) => sum + i.qty * i.priceCents, 0);",
          "  await reads.ordersSummary.upsert({ id: event.data.id, total }); // repeating it does not duplicate",
          "}",
        ].join("\n"),
        nota: "`db` and `reads` stand for your database client; the names are illustrative. Money is in cents.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "When it pays off and when it is overkill",
        texto:
          "CQRS pays off when reads and writes are **very asymmetric** (many queries for every write), when the screens ask for shapes quite different from the write model, or when the domain has complex rules that should not mix with queries. In a simple CRUD it is overkill: two moving parts, projectors and eventual consistency to solve a problem you do not have. It does not require Event Sourcing (see P35) or microservices, although it combines well with both. Ready-made modules exist (for example, NestJS has a CQRS module), but the pattern fits in plain functions; check the documentation of whatever you adopt.",
      },
    ],
    armadilhas: [
      "Adopting CQRS for a simple CRUD: two models, a queue and projectors for a form that a single model handled fine.",
      "Forgetting eventual consistency: the user saves and the list does not show the item yet. Return the id from the command, update the screen optimistically or read from the write side when it is essential.",
      "Thinking CQRS requires Event Sourcing or two databases: the simplest levels use the same database, and the two patterns are independent.",
      "A projection that is neither idempotent nor rebuildable from scratch: repeated events duplicate data, and a bug in the projector becomes wrong data forever.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between a command and a query?",
        resposta:
          "A command expresses the intent to change state, goes through the domain rules and can be rejected; it returns little (an id or a confirmation). A query only reads, never changes anything and can read from a model designed for the screen.",
      },
      {
        pergunta: "Do you need two databases and Event Sourcing to use CQRS?",
        resposta:
          "No. The simplest level only separates the code that writes from the code that reads, in the same database. Separate stores and Event Sourcing are optional steps; with separate databases the read side becomes eventually consistent.",
      },
    ],
  },
};
