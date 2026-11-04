import type { Pergunta } from "../../tipos";

// P40 · Normalização x desnormalização
export const p040: Pergunta = {
  numero: 740,
  modulo: "pawanmkr-bancos",
  metodo: "compare",
  pt: {
    titulo: "Normalização x desnormalização",
    pergunta: "Quais são as trocas entre normalização e desnormalização no design de bancos de dados?",
    porqueEsteMetodo:
      "A pergunta pede literalmente as trocas. Uma matriz lado a lado mostra o que cada lado ganha e perde, e a regra de decisão diz quando vale pagar o preço da desnormalização.",
    resposta30s:
      "**Normalizar** é organizar os dados para que cada fato exista em um só lugar (as formas normais), ligados por chaves: sem redundância, com integridade garantida e atualizações simples, ao custo de **junções** na leitura. **Desnormalizar** é duplicar ou pré-calcular dados para ler mais rápido e com menos junções, ao custo de escrita mais cara e de **risco de inconsistência** entre as cópias. Regra prática: normalize primeiro e desnormalize só os caminhos de leitura que a medição mostrar que precisam.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Normalizado x desnormalizado",
        colunas: ["Aspecto", "Normalizado", "Desnormalizado"],
        linhas: [
          [
            "Ideia",
            "Cada fato em um só lugar, ligado por chaves (formas normais)",
            "Dados duplicados ou pré-calculados para serem lidos de uma vez",
          ],
          [
            "Leitura",
            "Precisa de junções; com índices costumam ser baratas, mas somam trabalho por consulta",
            "Uma leitura direta: menos junções e resposta mais previsível",
          ],
          [
            "Escrita",
            "A mudança acontece em um só lugar",
            "É preciso atualizar todas as cópias: mais caro e mais código",
          ],
          [
            "Integridade",
            "O esquema ajuda a garantir (chaves estrangeiras, restrições)",
            "Nada impede as cópias de divergir; a garantia passa para o seu código",
          ],
          ["Espaço", "Menor", "Maior"],
          ["Mudança de regra", "Alteração localizada", "Alteração espalhada por todas as cópias"],
          [
            "Combina com",
            "Sistemas transacionais, dados que mudam, relações complexas",
            "Leitura pesada, painéis e relatórios, agregados em cache, documentos lidos inteiros",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "O pedido e seus itens",
        legenda: "SQL",
        codigo:
          "-- Normalizado: o total é calculado a cada leitura\nSELECT p.id, SUM(i.qtd * i.preco_cents) AS total_cents\nFROM pedido p\nJOIN item_pedido i ON i.pedido_id = p.id\nWHERE p.cliente_id = $1\nGROUP BY p.id;\n\n-- Desnormalizado: o total fica gravado no pedido (coluna total_cents)\nBEGIN;\nINSERT INTO item_pedido (pedido_id, produto_id, qtd, preco_cents) VALUES ($1, $2, $3, $4);\nUPDATE pedido SET total_cents = total_cents + $3 * $4 WHERE id = $1;\nCOMMIT;\n\nSELECT id, total_cents FROM pedido WHERE cliente_id = $1;",
        nota: "Os `$n` são os parâmetros de cada comando. Atualizar ou apagar um item também precisa corrigir `total_cents`: deixe essa regra em um só lugar (uma função do serviço, um trigger ou a própria transação) para nenhum caminho de escrita esquecê-la.",
      },
      {
        tipo: "tabela",
        titulo: "Como manter a cópia coerente",
        colunas: ["Técnica", "Como funciona", "Custo e cuidado"],
        linhas: [
          [
            "Mesma transação",
            "A escrita e a atualização da cópia acontecem no mesmo `BEGIN` … `COMMIT`",
            "Consistente, mas a escrita fica mais cara e todo caminho de escrita precisa lembrar de fazê-lo",
          ],
          [
            "Trigger ou coluna gerada",
            "O próprio banco atualiza a cópia (a coluna gerada cobre só dados da mesma linha)",
            "Regra escondida no banco, mais difícil de testar e depurar; custo em toda escrita",
          ],
          [
            "Evento (assíncrono)",
            "Um evento é publicado e um consumidor atualiza a cópia, como uma projeção de leitura",
            "Consistência eventual: a cópia atrasa; o consumidor precisa ser idempotente (veja P81)",
          ],
          [
            "Recalcular",
            "Uma tarefa periódica ou uma visão materializada refaz a cópia",
            "O dado fica velho entre as rodadas; a recomputação tem custo",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "**Normalize primeiro**: é o modelo mais seguro e, com bons índices (veja P41), quase sempre rápido o bastante. **Desnormalize depois, com medição** (tempo real e plano de execução, veja P42), apenas o caminho de leitura que provou ser gargalo, e escolhendo de antemão **como a cópia será mantida** e **qual é a fonte de verdade**. Em bancos de documentos a mesma pergunta aparece como “embutir ou referenciar”: embuta o que é lido junto e muda junto; referencie o que cresce sem limite ou é compartilhado (veja D40).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Nem toda cópia é desnormalização",
        texto:
          "O preço pago em cada item e o endereço de entrega do pedido são **fatos históricos**: devem ser copiados de propósito e nunca sincronizados com o cadastro, porque o preço de hoje não muda o que foi vendido ontem. Desnormalização é a cópia **derivada**, que sempre deve concordar com a fonte. Distinguir as duas evita “corrigir” um dado que estava certo.",
      },
    ],
    armadilhas: [
      "Desnormalizar por palpite: uma junção com índice costuma ser barata, e você ganha redundância sem ganho de leitura.",
      "Esquecer um caminho de escrita (script, importação, outro serviço) que não atualiza a cópia: a divergência é silenciosa.",
      "Chamar de desnormalização o que é fato histórico (preço pago, endereço de entrega) e “sincronizá-lo” depois.",
      "No outro extremo, normalizar além da conta, com tabelas minúsculas e longas cadeias de junção em toda tela, sem olhar o que a leitura precisa.",
    ],
    autoteste: [
      {
        pergunta: "Por que a atualização é mais simples no modelo normalizado?",
        resposta:
          "Porque cada fato existe em um só lugar: mudar o nome de um cliente é um único `UPDATE`, e o esquema não tem como discordar de si mesmo.",
      },
      {
        pergunta: "Quando você escolheria desnormalizar?",
        resposta:
          "Quando uma leitura frequente e cara foi medida como gargalo e a junção, o índice e o cache não resolvem. Aí se grava a cópia (um total, um nome) com um mecanismo claro de atualização e uma fonte de verdade definida.",
      },
    ],
  },
  en: {
    titulo: "Normalization vs denormalization",
    pergunta: "What are the tradeoffs between normalization and denormalization in database design?",
    porqueEsteMetodo:
      "The question asks for the tradeoffs literally. A side-by-side matrix shows what each side gains and loses, and the decision rule says when it is worth paying the price of denormalization.",
    resposta30s:
      "**Normalizing** means organizing data so each fact exists in one place (the normal forms), linked by keys: no redundancy, guaranteed integrity and simple updates, at the cost of **joins** on reads. **Denormalizing** means duplicating or precomputing data to read faster with fewer joins, at the cost of more expensive writes and a **risk of inconsistency** between copies. Rule of thumb: normalize first and denormalize only the read paths that measurement shows need it.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Normalized vs denormalized",
        colunas: ["Aspect", "Normalized", "Denormalized"],
        linhas: [
          [
            "Idea",
            "Each fact in one place, linked by keys (normal forms)",
            "Data duplicated or precomputed so it can be read in one go",
          ],
          [
            "Reads",
            "Needs joins; with indexes they are usually cheap, but they add work per query",
            "One direct read: fewer joins and a more predictable response",
          ],
          ["Writes", "The change happens in one place", "Every copy must be updated: more expensive and more code"],
          [
            "Integrity",
            "The schema helps enforce it (foreign keys, constraints)",
            "Nothing stops the copies from diverging; the guarantee moves into your code",
          ],
          ["Space", "Smaller", "Larger"],
          ["Changing a rule", "A localized change", "A change spread across every copy"],
          [
            "Fits",
            "Transactional systems, data that changes, complex relations",
            "Read-heavy workloads, dashboards and reports, cached aggregates, documents read whole",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "An order and its items",
        legenda: "SQL",
        codigo:
          "-- Normalized: the total is computed on every read\nSELECT p.id, SUM(i.qty * i.price_cents) AS total_cents\nFROM orders p\nJOIN order_item i ON i.order_id = p.id\nWHERE p.customer_id = $1\nGROUP BY p.id;\n\n-- Denormalized: the total is stored on the order (total_cents column)\nBEGIN;\nINSERT INTO order_item (order_id, product_id, qty, price_cents) VALUES ($1, $2, $3, $4);\nUPDATE orders SET total_cents = total_cents + $3 * $4 WHERE id = $1;\nCOMMIT;\n\nSELECT id, total_cents FROM orders WHERE customer_id = $1;",
        nota: "The `$n` are the parameters of each statement. Updating or deleting an item must also fix `total_cents`: keep that rule in one place (a service function, a trigger or the transaction itself) so no write path forgets it.",
      },
      {
        tipo: "tabela",
        titulo: "Keeping the copy coherent",
        colunas: ["Technique", "How it works", "Cost and caution"],
        linhas: [
          [
            "Same transaction",
            "The write and the update of the copy happen in the same `BEGIN` … `COMMIT`",
            "Consistent, but the write gets more expensive and every write path must remember to do it",
          ],
          [
            "Trigger or generated column",
            "The database itself updates the copy (a generated column covers only data from the same row)",
            "A rule hidden in the database, harder to test and debug; a cost on every write",
          ],
          [
            "Event (asynchronous)",
            "An event is published and a consumer updates the copy, like a read projection",
            "Eventual consistency: the copy lags; the consumer must be idempotent (see P81)",
          ],
          [
            "Recompute",
            "A periodic job or a materialized view rebuilds the copy",
            "The data is stale between runs; the recomputation has a cost",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "**Normalize first**: it is the safest model and, with good indexes (see P41), almost always fast enough. **Denormalize later, with measurement** (real timings and the execution plan, see P42), only the read path that proved to be a bottleneck, and decide in advance **how the copy will be kept in sync** and **which one is the source of truth**. In document databases the same question appears as “embed or reference”: embed what is read together and changes together; reference what grows without bound or is shared (see D40).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Not every copy is denormalization",
        texto:
          "The price paid on each item and the order’s delivery address are **historical facts**: they should be copied on purpose and never synchronized with the master record, because today’s price does not change what was sold yesterday. Denormalization is the **derived** copy, which must always agree with its source. Telling the two apart avoids “fixing” data that was correct.",
      },
    ],
    armadilhas: [
      "Denormalizing on a hunch: a join with an index is usually cheap, and you gain redundancy without a read gain.",
      "Forgetting a write path (script, import, another service) that does not update the copy: the divergence is silent.",
      "Calling denormalization what is really a historical fact (price paid, delivery address) and “syncing” it later.",
      "At the other extreme, normalizing too far, with tiny tables and long join chains on every screen, without looking at what the read needs.",
    ],
    autoteste: [
      {
        pergunta: "Why is updating simpler in the normalized model?",
        resposta:
          "Because each fact exists in one place: changing a customer’s name is a single `UPDATE`, and the schema has no way of disagreeing with itself.",
      },
      {
        pergunta: "When would you choose to denormalize?",
        resposta:
          "When a frequent, expensive read has been measured as a bottleneck and the join, the index and the cache do not fix it. Then you store the copy (a total, a name) with a clear update mechanism and a defined source of truth.",
      },
    ],
  },
};
