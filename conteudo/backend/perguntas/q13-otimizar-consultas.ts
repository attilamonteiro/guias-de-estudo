import type { Pergunta } from "../../tipos";

// Q13 · Otimizar consultas
export const q13: Pergunta = {
  numero: 13,
  modulo: "cache-e-desempenho",
  metodo: "playbook",
  pt: {
    titulo: "Otimizar consultas",
    pergunta: "Quais são algumas técnicas para otimizar consultas de banco de dados?",
    porqueEsteMetodo:
      "Otimizar é um procedimento, não uma lista de truques. A ordem importa: medir, ler o plano, corrigir a causa e medir de novo. Um playbook impede o erro mais comum, otimizar sem medir.",
    resposta30s:
      "Primeiro **meça** (log de consultas lentas, `pg_stat_statements`), depois **leia o plano** (`EXPLAIN ANALYZE`), e só então corrija: **índices** certos, SQL **sargável** (sem função na coluna indexada, sem `SELECT *`), menos linhas (filtros cedo, paginação por chave em vez de `OFFSET` grande), fim do **N+1**, pré-agregação e, por último, cache e réplicas. Meça de novo: todo índice novo custa escrita.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Meça primeiro",
            texto:
              "Ative o log de consultas lentas ou `pg_stat_statements`. Ordene pelo **tempo total** (frequência × duração): uma consulta de 5 ms rodada 1 milhão de vezes pesa mais que uma de 2 s rodada 10.",
          },
          {
            titulo: "Leia o plano",
            texto:
              "`EXPLAIN (ANALYZE, BUFFERS)`: procure Seq Scan em tabela grande, diferença entre linhas estimadas e reais (estatísticas velhas: rode `ANALYZE`), sort ou hash gravando em disco, nested loops enormes.",
          },
          {
            titulo: "Índices certos",
            texto:
              "Colunas de `WHERE`, `JOIN` e `ORDER BY`. Compostos com igualdade antes de intervalo; parciais (`WHERE ativo`) e covering (`INCLUDE`) quando valem a pena.",
          },
          {
            titulo: "SQL sargável",
            texto:
              "Não aplique função na coluna indexada (`lower(email)`), evite `LIKE '%x'`, tipos iguais dos dois lados, e liste só as colunas necessárias em vez de `SELECT *`.",
          },
          {
            titulo: "Leia menos linhas",
            texto:
              "Filtre cedo; pagine por chave (`WHERE id > :ultimo LIMIT 50`) em vez de `OFFSET` grande, que lê e descarta tudo que veio antes.",
          },
          {
            titulo: "Elimine o N+1",
            texto:
              "Uma consulta por item de uma lista: troque por `JOIN`, `IN (...)` ou carregamento em lote (eager loading do ORM).",
          },
          {
            titulo: "Mova o trabalho",
            texto:
              "Tabelas de resumo, views materializadas, desnormalização consciente, particionamento de tabelas enormes.",
          },
          {
            titulo: "Operação e infraestrutura",
            texto: "Pool de conexões, inserts em lote, `VACUUM`/`ANALYZE`, réplicas de leitura, cache da aplicação.",
          },
          {
            titulo: "Meça de novo",
            texto: "Compare antes e depois. Se não melhorou, desfaça. Todo índice novo tem custo na escrita.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Duas correções clássicas",
        legenda: "sql",
        codigo:
          "-- N+1: 1 consulta + 1 por pedido\nSELECT * FROM pedidos;                       -- depois, em loop:\nSELECT * FROM itens WHERE pedido_id = ?;\n-- Correção: uma consulta só\nSELECT * FROM itens WHERE pedido_id = ANY(:ids);\n\n-- OFFSET grande lê e descarta 100.000 linhas\nSELECT * FROM eventos ORDER BY id LIMIT 50 OFFSET 100000;\n-- Paginação por chave: salta direto\nSELECT * FROM eventos WHERE id > :ultimo_id ORDER BY id LIMIT 50;",
      },
    ],
    armadilhas: [
      "Otimizar sem medir: gastar um dia numa consulta que responde 1% do tempo total.",
      "Criar um índice para cada consulta: as escritas ficam mais lentas e o ganho some.",
      "Ignorar o N+1 gerado pelo ORM: o código parece simples e dispara centenas de consultas.",
      "Confiar nas estimativas do plano sem `ANALYZE`: estatísticas velhas levam a planos ruins.",
    ],
    autoteste: [
      {
        pergunta: "Por que paginar por chave é melhor que `OFFSET` grande?",
        resposta:
          "O `OFFSET` obriga o banco a ler e descartar todas as linhas anteriores; a paginação por chave usa o índice para saltar direto ao ponto.",
      },
      {
        pergunta: "O que é uma consulta N+1?",
        resposta:
          "Uma consulta para listar e mais uma por item da lista. Resolve-se com JOIN, IN ou carregamento em lote.",
      },
    ],
  },
  en: {
    titulo: "Optimizing queries",
    pergunta: "What are some techniques for optimizing database queries?",
    porqueEsteMetodo:
      "Optimizing is a procedure, not a list of tricks. Order matters: measure, read the plan, fix the cause and measure again. A playbook prevents the most common mistake, optimizing without measuring.",
    resposta30s:
      "First **measure** (slow-query log, `pg_stat_statements`), then **read the plan** (`EXPLAIN ANALYZE`), and only then fix: the right **indexes**, **sargable** SQL (no function on the indexed column, no `SELECT *`), fewer rows (early filters, key-based pagination instead of big `OFFSET`), kill the **N+1**, pre-aggregate and, last, cache and replicas. Measure again: every new index costs writes.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Measure first",
            texto:
              "Enable the slow-query log or `pg_stat_statements`. Sort by **total time** (frequency × duration): a 5 ms query run 1 million times weighs more than a 2 s query run 10 times.",
          },
          {
            titulo: "Read the plan",
            texto:
              "`EXPLAIN (ANALYZE, BUFFERS)`: look for Seq Scan on big tables, gaps between estimated and actual rows (stale statistics: run `ANALYZE`), sorts or hashes spilling to disk, huge nested loops.",
          },
          {
            titulo: "The right indexes",
            texto:
              "Columns in `WHERE`, `JOIN` and `ORDER BY`. Composites with equality before range; partial (`WHERE active`) and covering (`INCLUDE`) when worthwhile.",
          },
          {
            titulo: "Sargable SQL",
            texto:
              "Do not apply a function to the indexed column (`lower(email)`), avoid `LIKE '%x'`, same types on both sides, and list only the needed columns instead of `SELECT *`.",
          },
          {
            titulo: "Read fewer rows",
            texto:
              "Filter early; paginate by key (`WHERE id > :last LIMIT 50`) instead of a big `OFFSET`, which reads and discards everything before.",
          },
          {
            titulo: "Kill the N+1",
            texto:
              "One query per list item: replace with `JOIN`, `IN (...)` or batch loading (the ORM’s eager loading).",
          },
          {
            titulo: "Move the work",
            texto: "Summary tables, materialized views, conscious denormalization, partitioning of huge tables.",
          },
          {
            titulo: "Operations and infrastructure",
            texto: "Connection pooling, batch inserts, `VACUUM`/`ANALYZE`, read replicas, application cache.",
          },
          {
            titulo: "Measure again",
            texto: "Compare before and after. If it did not improve, revert. Every new index has a write cost.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Two classic fixes",
        legenda: "sql",
        codigo:
          "-- N+1: 1 query + 1 per order\nSELECT * FROM orders;                         -- then, in a loop:\nSELECT * FROM items WHERE order_id = ?;\n-- Fix: a single query\nSELECT * FROM items WHERE order_id = ANY(:ids);\n\n-- A big OFFSET reads and discards 100,000 rows\nSELECT * FROM events ORDER BY id LIMIT 50 OFFSET 100000;\n-- Key-based pagination jumps straight there\nSELECT * FROM events WHERE id > :last_id ORDER BY id LIMIT 50;",
      },
    ],
    armadilhas: [
      "Optimizing without measuring: spending a day on a query that accounts for 1% of total time.",
      "Creating an index for every query: writes get slower and the gain disappears.",
      "Ignoring the ORM-generated N+1: the code looks simple and fires hundreds of queries.",
      "Trusting plan estimates without `ANALYZE`: stale statistics lead to bad plans.",
    ],
    autoteste: [
      {
        pergunta: "Why is key-based pagination better than a big `OFFSET`?",
        resposta:
          "`OFFSET` forces the database to read and discard all previous rows; key-based pagination uses the index to jump straight to the point.",
      },
      {
        pergunta: "What is an N+1 query problem?",
        resposta: "One query to list plus one more per list item. It is solved with JOIN, IN or batch loading.",
      },
    ],
  },
};
