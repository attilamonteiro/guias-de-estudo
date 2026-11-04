import type { Pergunta } from "../../tipos";

// P42 · Planejador de consultas e EXPLAIN
export const p042: Pergunta = {
  numero: 742,
  modulo: "pawanmkr-bancos",
  metodo: "playbook",
  pt: {
    titulo: "Planejador de consultas e EXPLAIN",
    pergunta:
      "O que é um planejador de consultas (query planner) e como analisar o desempenho de consultas no PostgreSQL ou no MongoDB?",
    porqueEsteMetodo:
      "Analisar uma consulta lenta é um procedimento com ordem: achar a consulta certa, pedir o plano, lê-lo, agir sobre a causa e medir de novo. Um roteiro com o sinal de cada passo evita o erro de otimizar por palpite.",
    resposta30s:
      "O **planejador** (otimizador) transforma a consulta, que diz o que você quer, em um **plano de execução** (qual índice, em que ordem juntar, com qual algoritmo), escolhendo o de menor custo estimado a partir de **estatísticas** da tabela. Para analisar: ache a consulta lenta, rode `EXPLAIN (ANALYZE, BUFFERS)` no PostgreSQL ou `explain('executionStats')` no MongoDB, compare o **estimado com o real** e os **documentos examinados com os devolvidos**, corrija o índice, a consulta ou as estatísticas e **meça de novo**.",
    blocos: [
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que é o planejador",
        texto:
          "O SQL diz **o que** você quer, não **como** obtê-lo. O planejador gera planos candidatos, **estima o custo** de cada um com base em estatísticas (número de linhas, distribuição dos valores) e executa o mais barato. Um plano ruim quase sempre vem de **estatística velha**, de **índice ausente** ou de uma consulta escrita de um jeito que o índice não pode ser usado. O MongoDB faz algo parecido: testa planos candidatos e guarda o vencedor.",
      },
      {
        tipo: "passos",
        titulo: "Roteiro: da consulta lenta ao plano melhor",
        passos: [
          {
            titulo: "Pegue a consulta certa",
            texto:
              "Não otimize por palpite. No PostgreSQL, o log de consultas lentas (`log_min_duration_statement`) e a extensão `pg_stat_statements` mostram o que mais consome tempo no total (tempo × frequência). No MongoDB, o profiler (`slowms`, `db.setProfilingLevel`) registra as operações lentas. A métrica da aplicação ou o rastreamento (veja P52) indica qual rota sofre. Critério: a consulta que mais custa no conjunto, não só a mais lenta.",
          },
          {
            titulo: "Reproduza com dados parecidos com os reais",
            texto:
              "O plano depende do volume e da distribuição dos dados. Teste com parâmetros reais, numa cópia de tamanho semelhante ao de produção; com uma base de desenvolvimento minúscula, o planejador escolherá outro caminho.",
          },
          {
            titulo: "Peça o plano com execução real",
            texto:
              "No PostgreSQL: `EXPLAIN (ANALYZE, BUFFERS) <consulta>`. No MongoDB: `explain('executionStats')` sobre a consulta. O `EXPLAIN` sem `ANALYZE` mostra só a estimativa, sem executar.",
          },
          {
            titulo: "Leia o plano",
            texto:
              "Procure o nó mais caro e compare o estimado com o real. PostgreSQL: `Seq Scan` x `Index Scan`, tipo de junção (`Nested Loop`, `Hash Join`, `Merge Join`), `rows` estimado x `actual rows`, `Buffers` (páginas do cache e do disco), `Sort` em disco. MongoDB: `COLLSCAN` x `IXSCAN`, `totalDocsExamined` e `totalKeysExamined` contra `nReturned`. Muito trabalho para poucas linhas devolvidas é o sinal clássico de índice faltando.",
          },
          {
            titulo: "Aja sobre a causa",
            texto:
              "Crie ou ajuste o índice (veja P41), reescreva a consulta (tire a função da coluna, peça só as colunas necessárias, elimine o N+1, veja L120) ou atualize as estatísticas com `ANALYZE` (o comando, que não é o `EXPLAIN ANALYZE`). Faça uma mudança por vez para saber o que funcionou.",
          },
          {
            titulo: "Meça de novo e compare",
            texto:
              "Repita a medição na mesma situação e compare o antes e o depois. A primeira execução costuma ser mais lenta por causa do cache frio, então rode algumas vezes. Guarde o plano antigo e o novo e confirme em produção que a consulta realmente melhorou.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "O que olhar no plano",
        colunas: ["O que olhar", "PostgreSQL (`EXPLAIN`)", "MongoDB (`explain`)"],
        linhas: [
          [
            "Como acha os dados",
            "`Seq Scan` (tabela toda) x `Index Scan`, `Index Only Scan`, `Bitmap Heap Scan`",
            "`COLLSCAN` (coleção toda) x `IXSCAN` seguido de `FETCH`",
          ],
          [
            "Trabalho x resultado",
            "`Rows Removed by Filter` alto; `actual rows` x `rows` estimado",
            "`totalDocsExamined` e `totalKeysExamined` muito acima de `nReturned`",
          ],
          [
            "Ordenação",
            "`Sort` com `Sort Method: external merge` indica uso de disco",
            "Estágio `SORT` em memória, quando nenhum índice entrega a ordem",
          ],
          [
            "Estimativa x realidade",
            "Estimado muito diferente do real: estatísticas velhas, rode `ANALYZE`",
            "`allPlansExecution` mostra os planos concorrentes; `rejectedPlans` os descartados",
          ],
          [
            "Custo de I/O e tempo",
            "`Buffers: shared hit` (cache) e `read` (disco), `Execution Time`",
            "`executionTimeMillis` e `executionStages`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Pedindo o plano a partir do Node.js",
        legenda: "JavaScript",
        codigo:
          'import pg from "pg";\nimport { MongoClient } from "mongodb";\n\n// PostgreSQL: o ANALYZE executa de verdade; BEGIN/ROLLBACK protege contra escritas\nconst pgCliente = new pg.Client();\nawait pgCliente.connect();\nawait pgCliente.query("BEGIN");\nconst { rows } = await pgCliente.query(\n  "EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT id FROM pedido WHERE cliente_id = 42 ORDER BY criado_em DESC LIMIT 20",\n);\nawait pgCliente.query("ROLLBACK");\nconsole.log(JSON.stringify(rows[0]["QUERY PLAN"], null, 2));\n\n// MongoDB: compare documentos examinados com documentos devolvidos\nconst mongo = await MongoClient.connect(process.env.MONGO_URL);\nconst plano = await mongo.db("loja").collection("pedidos")\n  .find({ clienteId: 42 }).sort({ criadoEm: -1 }).limit(20).explain("executionStats");\nconsole.log(plano.executionStats.totalDocsExamined, plano.executionStats.nReturned);',
        nota: "Em produção, prefira rodar o `EXPLAIN` numa réplica ou numa cópia, e mantenha a conexão e as credenciais fora do código.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "`EXPLAIN ANALYZE` executa de verdade",
        texto:
          "No PostgreSQL, `EXPLAIN ANALYZE` **roda o comando**: num `UPDATE` ou `DELETE`, ele altera os dados. Faça dentro de `BEGIN` … `ROLLBACK` e, em produção, prefira uma réplica ou cópia, porque uma consulta pesada continua pesada. Não confunda com o comando `ANALYZE` sozinho, que apenas atualiza as estatísticas. E um `Seq Scan` nem sempre é ruim: em tabela pequena, ou quando a consulta lê boa parte da tabela, é a escolha certa.",
      },
    ],
    armadilhas: [
      "Rodar `EXPLAIN ANALYZE` num `UPDATE` ou `DELETE` sem transação, sem perceber que ele executa; ou confundi-lo com o comando `ANALYZE`, que só atualiza estatísticas.",
      "Medir uma vez só: o cache frio engana. Repita e compare o antes e o depois nas mesmas condições.",
      "Tratar todo `Seq Scan` como problema, ou criar um índice sem conferir no plano que ele passou a ser usado.",
      "Analisar com dados de desenvolvimento: o plano muda com o volume e a distribuição, e um plano bom com poucos dados pode ser ruim com muitos.",
    ],
    autoteste: [
      {
        pergunta: "O plano estimado diz 10 linhas e o real mostra milhares. O que isso sugere?",
        resposta:
          "Estatísticas desatualizadas ou insuficientes: o planejador escolheu o plano com base numa estimativa errada. Rode `ANALYZE` na tabela; se persistir, ajuste a estatística da coluna ou reescreva a consulta.",
      },
      {
        pergunta: "No MongoDB, `totalDocsExamined` é muito maior que `nReturned`. O que fazer?",
        resposta:
          "Provavelmente falta um índice adequado (o plano é um `COLLSCAN` ou usa um índice pouco seletivo). Crie um índice composto que cubra o filtro e a ordenação, com os campos de igualdade primeiro, e meça de novo.",
      },
    ],
  },
  en: {
    titulo: "Query planner and EXPLAIN",
    pergunta: "What is a query planner and how can you analyze query performance in PostgreSQL or MongoDB?",
    porqueEsteMetodo:
      "Analyzing a slow query is a procedure with an order: find the right query, ask for the plan, read it, act on the cause and measure again. A playbook with the signal for each step avoids the mistake of optimizing on a hunch.",
    resposta30s:
      "The **planner** (optimizer) turns the query, which says what you want, into an **execution plan** (which index, in what join order, with which algorithm), choosing the one with the lowest estimated cost from table **statistics**. To analyze: find the slow query, run `EXPLAIN (ANALYZE, BUFFERS)` in PostgreSQL or `explain('executionStats')` in MongoDB, compare **estimated with actual** and **documents examined with documents returned**, fix the index, the query or the statistics, and **measure again**.",
    blocos: [
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What the planner is",
        texto:
          "SQL says **what** you want, not **how** to get it. The planner generates candidate plans, **estimates the cost** of each from statistics (row counts, value distribution) and runs the cheapest. A bad plan almost always comes from **stale statistics**, a **missing index** or a query written so the index cannot be used. MongoDB does something similar: it tries candidate plans and keeps the winner.",
      },
      {
        tipo: "passos",
        titulo: "Playbook: from slow query to better plan",
        passos: [
          {
            titulo: "Pick the right query",
            texto:
              "Do not optimize on a hunch. In PostgreSQL, the slow query log (`log_min_duration_statement`) and the `pg_stat_statements` extension show what consumes the most time in total (time × frequency). In MongoDB, the profiler (`slowms`, `db.setProfilingLevel`) records slow operations. Application metrics or tracing (see P52) tell you which route suffers. Criterion: the query that costs the most overall, not just the slowest one.",
          },
          {
            titulo: "Reproduce with data close to the real thing",
            texto:
              "The plan depends on data volume and distribution. Test with real parameters, on a copy of a size similar to production; with a tiny development database, the planner will pick a different path.",
          },
          {
            titulo: "Ask for the plan with real execution",
            texto:
              "In PostgreSQL: `EXPLAIN (ANALYZE, BUFFERS) <query>`. In MongoDB: `explain('executionStats')` on the query. `EXPLAIN` without `ANALYZE` shows only the estimate, without running anything.",
          },
          {
            titulo: "Read the plan",
            texto:
              "Look for the most expensive node and compare estimated with actual. PostgreSQL: `Seq Scan` vs `Index Scan`, join type (`Nested Loop`, `Hash Join`, `Merge Join`), estimated `rows` vs `actual rows`, `Buffers` (pages from cache and from disk), `Sort` on disk. MongoDB: `COLLSCAN` vs `IXSCAN`, `totalDocsExamined` and `totalKeysExamined` against `nReturned`. A lot of work for few rows returned is the classic sign of a missing index.",
          },
          {
            titulo: "Act on the cause",
            texto:
              "Create or adjust the index (see P41), rewrite the query (take the function off the column, ask only for the columns you need, remove the N+1, see L120) or refresh the statistics with `ANALYZE` (the command, which is not `EXPLAIN ANALYZE`). Change one thing at a time so you know what worked.",
          },
          {
            titulo: "Measure again and compare",
            texto:
              "Repeat the measurement in the same situation and compare before and after. The first run is often slower because of a cold cache, so run it a few times. Keep the old and new plans, and confirm in production that the query really improved.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "What to look at in the plan",
        colunas: ["What to look at", "PostgreSQL (`EXPLAIN`)", "MongoDB (`explain`)"],
        linhas: [
          [
            "How it finds the data",
            "`Seq Scan` (whole table) vs `Index Scan`, `Index Only Scan`, `Bitmap Heap Scan`",
            "`COLLSCAN` (whole collection) vs `IXSCAN` followed by `FETCH`",
          ],
          [
            "Work vs result",
            "High `Rows Removed by Filter`; `actual rows` vs estimated `rows`",
            "`totalDocsExamined` and `totalKeysExamined` far above `nReturned`",
          ],
          [
            "Sorting",
            "`Sort` with `Sort Method: external merge` means disk use",
            "An in-memory `SORT` stage, when no index delivers the order",
          ],
          [
            "Estimate vs reality",
            "Estimate far from actual: stale statistics, run `ANALYZE`",
            "`allPlansExecution` shows the competing plans; `rejectedPlans` the discarded ones",
          ],
          [
            "I/O cost and time",
            "`Buffers: shared hit` (cache) and `read` (disk), `Execution Time`",
            "`executionTimeMillis` and `executionStages`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Asking for the plan from Node.js",
        legenda: "JavaScript",
        codigo:
          'import pg from "pg";\nimport { MongoClient } from "mongodb";\n\n// PostgreSQL: ANALYZE really runs it; BEGIN/ROLLBACK protects against writes\nconst pgClient = new pg.Client();\nawait pgClient.connect();\nawait pgClient.query("BEGIN");\nconst { rows } = await pgClient.query(\n  "EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT id FROM orders WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 20",\n);\nawait pgClient.query("ROLLBACK");\nconsole.log(JSON.stringify(rows[0]["QUERY PLAN"], null, 2));\n\n// MongoDB: compare documents examined with documents returned\nconst mongo = await MongoClient.connect(process.env.MONGO_URL);\nconst plan = await mongo.db("shop").collection("orders")\n  .find({ customerId: 42 }).sort({ createdAt: -1 }).limit(20).explain("executionStats");\nconsole.log(plan.executionStats.totalDocsExamined, plan.executionStats.nReturned);',
        nota: "In production, prefer to run `EXPLAIN` on a replica or a copy, and keep the connection settings and credentials out of the code.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "`EXPLAIN ANALYZE` really executes",
        texto:
          "In PostgreSQL, `EXPLAIN ANALYZE` **runs the statement**: on an `UPDATE` or `DELETE`, it changes the data. Do it inside `BEGIN` … `ROLLBACK` and, in production, prefer a replica or a copy, because a heavy query stays heavy. Do not confuse it with the plain `ANALYZE` command, which only refreshes statistics. And a `Seq Scan` is not always bad: on a small table, or when the query reads a large part of the table, it is the right choice.",
      },
    ],
    armadilhas: [
      "Running `EXPLAIN ANALYZE` on an `UPDATE` or `DELETE` without a transaction, not realizing it executes; or confusing it with the `ANALYZE` command, which only refreshes statistics.",
      "Measuring only once: a cold cache misleads. Repeat and compare before and after under the same conditions.",
      "Treating every `Seq Scan` as a problem, or creating an index without checking in the plan that it is now used.",
      "Analyzing with development data: the plan changes with volume and distribution, and a plan that is good with little data can be bad with a lot.",
    ],
    autoteste: [
      {
        pergunta: "The estimated plan says 10 rows and the actual one shows thousands. What does that suggest?",
        resposta:
          "Stale or insufficient statistics: the planner chose its plan from a wrong estimate. Run `ANALYZE` on the table; if it persists, adjust the column’s statistics target or rewrite the query.",
      },
      {
        pergunta: "In MongoDB, `totalDocsExamined` is much larger than `nReturned`. What do you do?",
        resposta:
          "A suitable index is probably missing (the plan is a `COLLSCAN` or uses a poorly selective index). Create a compound index that covers the filter and the sort, with the equality fields first, and measure again.",
      },
    ],
  },
};
