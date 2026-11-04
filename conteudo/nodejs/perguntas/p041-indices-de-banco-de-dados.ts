import type { Pergunta } from "../../tipos";

// P41 · Índices de banco de dados
export const p041: Pergunta = {
  numero: 741,
  modulo: "pawanmkr-bancos",
  metodo: "feynman",
  pt: {
    titulo: "Índices de banco de dados",
    pergunta: "Como funcionam os índices de banco de dados e como eles afetam o desempenho das consultas?",
    porqueEsteMetodo:
      "O índice de um banco é a ideia do índice remissivo aplicada a tabelas. A analogia dá a intuição certa (ir direto à página), e o limite dela mostra o custo que o livro não tem: o índice precisa ser mantido a cada escrita.",
    resposta30s:
      "Um **índice** é uma estrutura auxiliar, em geral uma **B-tree** ordenada, que permite ao banco achar linhas por valor sem **varrer a tabela inteira**: o custo da busca cresce devagar com o tamanho da tabela. Ele acelera filtros, junções e ordenações nas colunas indexadas, mas **custa escrita mais lenta, espaço e manutenção**, e só ajuda quando a consulta é **seletiva** e escrita de um modo que o índice possa ser usado. Confirme sempre no plano de execução (veja P42).",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense no índice remissivo no fim de um livro. Para achar onde se fala de “replicação”, você poderia ler o livro inteiro, página por página, ou olhar a lista ordenada de termos e ir direto às páginas indicadas. O índice é essa lista: termos em ordem, cada um apontando para onde o assunto está.",
        tecnico:
          "No banco, o índice mais comum é a **B-tree**: uma árvore ordenada com os valores da coluna, cada um apontando para a linha correspondente. Achar um valor, uma faixa (`BETWEEN`, `>`) ou uma ordenação percorre poucos níveis da árvore em vez de ler a tabela toda (a varredura completa). Um **índice composto** `(a, b)` é ordenado por `a` e, dentro de cada `a`, por `b`: serve a filtros por `a` e por `a` + `b`, mas em geral não a filtros só por `b`, então a ordem das colunas importa. Um **índice de cobertura** contém todas as colunas que a consulta pede e pode responder sem visitar a tabela. A **seletividade** (quantos valores distintos existem e quão poucas linhas casam) decide se compensa. Um índice **único** também impõe a regra de não repetir. Em Node.js você os declara em migrações (veja P87), em decorators ou esquemas do ORM, ou com `createIndex` no MongoDB, que também tem índices compostos com a mesma regra da ordem.",
        limite:
          "Num livro, o índice é impresso uma vez e nunca muda. No banco, ele precisa ser **atualizado a cada INSERT, UPDATE e DELETE** da tabela, ocupa espaço e pode simplesmente não ser usado: quem decide é o planejador (veja P42), que às vezes prefere ler a tabela toda. Mais índices não significam mais velocidade.",
      },
      {
        tipo: "tabela",
        titulo: "Quando o índice ajuda e quando não ajuda",
        colunas: ["Situação", "O que acontece", "O que fazer"],
        linhas: [
          [
            "Igualdade, faixa ou ordenação em coluna indexada (`WHERE email = $1`, `ORDER BY criado_em`)",
            "A B-tree vai direto ao valor ou percorre uma faixa já ordenada",
            "Caso feliz: indexe as colunas que as consultas filtram, juntam e ordenam",
          ],
          [
            "Filtro só pela segunda coluna de um composto `(cliente_id, criado_em)`",
            "O índice está ordenado primeiro por `cliente_id`, então ajuda pouco ou nada",
            "Coloque as colunas de igualdade primeiro e a de faixa ou ordenação depois; crie outro índice se for preciso",
          ],
          [
            "Consulta que só pede colunas presentes no índice",
            "Pode ser respondida só pelo índice, sem visitar a tabela",
            "Índice de cobertura (no PostgreSQL, `INCLUDE`); vale para consultas muito frequentes",
          ],
          [
            "Função ou cálculo na coluna (`WHERE lower(email) = $1`)",
            "O índice de `email` não casa com a expressão",
            "Crie um índice de expressão em `lower(email)` ou reescreva a consulta",
          ],
          [
            "`LIKE '%texto'` (coringa no início)",
            "A B-tree precisa do começo do valor para navegar",
            "Prefixo fixo (`LIKE 'texto%'`) pode usar o índice, conforme o banco e o collation; para o meio do texto, busca de texto completo ou trigramas",
          ],
          [
            "Baixa seletividade (booleano, status com poucos valores) ou tabela pequena",
            "O filtro devolve boa parte da tabela, e ler tudo em sequência sai mais barato",
            "Não indexe; ou use um índice parcial se você consulta só o valor raro",
          ],
          [
            "Tipos incompatíveis (coluna numérica comparada com texto)",
            "A conversão implícita aplicada à coluna pode impedir o uso do índice",
            "Envie o parâmetro com o mesmo tipo da coluna",
          ],
        ],
        nota: "Além da B-tree: **hash** (só igualdade), **GIN** (itens dentro de arrays, JSONB e texto completo no PostgreSQL) e outros tipos, como GiST e BRIN, para casos específicos. Os tipos disponíveis variam de banco para banco.",
      },
      {
        tipo: "codigo",
        titulo: "Criando índices",
        legenda: "SQL",
        codigo:
          "-- Composto: igualdade primeiro, depois faixa ou ordenação\nCREATE INDEX idx_pedido_cliente_data ON pedido (cliente_id, criado_em);\n\n-- Parcial: só as linhas que a consulta procura\nCREATE INDEX idx_pedido_pendente ON pedido (criado_em) WHERE status = 'pendente';\n\n-- De expressão: casa com WHERE lower(email) = $1\nCREATE INDEX idx_usuario_email_lower ON usuario (lower(email));\n\n-- Único: índice mais regra de integridade\nCREATE UNIQUE INDEX uq_usuario_documento ON usuario (documento);\n\n-- Usa o composto: o filtro e a ordem já vêm do índice\nSELECT id, criado_em FROM pedido WHERE cliente_id = $1 ORDER BY criado_em DESC LIMIT 20;",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra",
        texto:
          "Indexe pelo que as consultas **realmente** fazem: colunas de filtro, junção e ordenação das consultas frequentes e seletivas, com as de igualdade antes das de faixa. Cada índice é uma troca: leitura mais rápida por escrita mais lenta e mais espaço. Meça antes e depois com `EXPLAIN` (veja P42) e remova os índices que ninguém usa.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O custo aparece na escrita e na migração",
        texto:
          "Cada `INSERT`, cada `UPDATE` das colunas indexadas e cada `DELETE` precisa atualizar todos os índices da tabela, então uma tabela cheia de índices fica lenta para gravar. Em tabelas grandes, criar um índice pode bloquear as escritas: o PostgreSQL oferece `CREATE INDEX CONCURRENTLY`, e a migração precisa lidar com isso (veja P87). Confira a documentação do seu banco.",
      },
    ],
    armadilhas: [
      "Indexar tudo “por precaução”: escrita mais lenta, espaço desperdiçado e o planejador com mais caminhos para escolher mal.",
      "Escrever a consulta de um jeito que invalida o índice: função na coluna, `LIKE '%x'`, tipos diferentes.",
      "Errar a ordem das colunas de um índice composto: `(criado_em, cliente_id)` não substitui `(cliente_id, criado_em)`.",
      "Achar que o índice sempre será usado: com baixa seletividade ou estatísticas velhas, o planejador pode preferir ler a tabela.",
    ],
    autoteste: [
      {
        pergunta: "Por que o índice acelera a leitura, mas atrasa a escrita?",
        resposta:
          "Ele é uma estrutura ordenada separada da tabela: achar um valor é rápido, mas cada inserção, alteração ou remoção também precisa atualizar o índice, mantendo a ordem.",
      },
      {
        pergunta: "Existe um índice em `(cliente_id, criado_em)`. Ele serve a `WHERE criado_em > …` sozinho?",
        resposta:
          "Em geral não: o índice está ordenado primeiro por `cliente_id`. Ele serve a `cliente_id = ?` e a `cliente_id = ? AND criado_em > ?`. Para filtrar só por data, crie outro índice, se a consulta for frequente.",
      },
    ],
  },
  en: {
    titulo: "Database indexes",
    pergunta: "How do database indexes work and how do they impact query performance?",
    porqueEsteMetodo:
      "A database index is the book-index idea applied to tables. The analogy gives the right intuition (go straight to the page), and its limit shows the cost a book does not have: the index must be maintained on every write.",
    resposta30s:
      "An **index** is an auxiliary structure, usually a sorted **B-tree**, that lets the database find rows by value without **scanning the whole table**: the cost of a lookup grows slowly with table size. It speeds up filters, joins and sorts on the indexed columns, but **costs slower writes, space and maintenance**, and only helps when the query is **selective** and written so the index can be used. Always confirm in the execution plan (see P42).",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of the index at the back of a book. To find where “replication” is discussed, you could read the whole book page by page, or look at the sorted list of terms and jump straight to the pages listed. The index is that list: terms in order, each pointing to where the subject is.",
        tecnico:
          "In a database, the most common index is the **B-tree**: a sorted tree of the column’s values, each pointing to the matching row. Finding a value, a range (`BETWEEN`, `>`) or a sort order walks a few levels of the tree instead of reading the whole table (the full scan). A **composite index** `(a, b)` is sorted by `a` and, within each `a`, by `b`: it serves filters on `a` and on `a` + `b`, but generally not on `b` alone, so column order matters. A **covering index** contains every column the query asks for and can answer without visiting the table. **Selectivity** (how many distinct values there are and how few rows match) decides whether it pays off. A **unique** index also enforces the no-duplicates rule. In Node.js you declare them in migrations (see P87), in ORM decorators or schemas, or with `createIndex` in MongoDB, which also has compound indexes with the same column-order rule.",
        limite:
          "In a book, the index is printed once and never changes. In a database, it must be **updated on every INSERT, UPDATE and DELETE** of the table, takes space, and may simply not be used: the planner decides (see P42), and it sometimes prefers to read the whole table. More indexes do not mean more speed.",
      },
      {
        tipo: "tabela",
        titulo: "When an index helps and when it does not",
        colunas: ["Situation", "What happens", "What to do"],
        linhas: [
          [
            "Equality, range or sort on an indexed column (`WHERE email = $1`, `ORDER BY created_at`)",
            "The B-tree goes straight to the value or walks an already sorted range",
            "The happy path: index the columns your queries filter, join and sort on",
          ],
          [
            "Filtering only on the second column of a composite `(customer_id, created_at)`",
            "The index is sorted by `customer_id` first, so it helps little or not at all",
            "Put equality columns first and the range or sort column after; create another index if needed",
          ],
          [
            "A query that asks only for columns present in the index",
            "It can be answered from the index alone, without visiting the table",
            "A covering index (in PostgreSQL, `INCLUDE`); worth it for very frequent queries",
          ],
          [
            "A function or calculation on the column (`WHERE lower(email) = $1`)",
            "The index on `email` does not match the expression",
            "Create an expression index on `lower(email)` or rewrite the query",
          ],
          [
            "`LIKE '%text'` (wildcard at the start)",
            "The B-tree needs the beginning of the value to navigate",
            "A fixed prefix (`LIKE 'text%'`) can use the index, depending on the database and collation; for the middle of the text, use full-text search or trigrams",
          ],
          [
            "Low selectivity (boolean, a status with few values) or a small table",
            "The filter returns a large part of the table, and reading it all sequentially is cheaper",
            "Do not index; or use a partial index if you only query the rare value",
          ],
          [
            "Mismatched types (a numeric column compared with text)",
            "An implicit conversion applied to the column can prevent the index from being used",
            "Send the parameter with the same type as the column",
          ],
        ],
        nota: "Beyond the B-tree: **hash** (equality only), **GIN** (items inside arrays, JSONB and full-text in PostgreSQL) and other types, such as GiST and BRIN, for specific cases. The available types vary from database to database.",
      },
      {
        tipo: "codigo",
        titulo: "Creating indexes",
        legenda: "SQL",
        codigo:
          "-- Composite: equality first, then range or sort\nCREATE INDEX idx_orders_customer_date ON orders (customer_id, created_at);\n\n-- Partial: only the rows the query looks for\nCREATE INDEX idx_orders_pending ON orders (created_at) WHERE status = 'pending';\n\n-- Expression: matches WHERE lower(email) = $1\nCREATE INDEX idx_users_email_lower ON users (lower(email));\n\n-- Unique: an index plus an integrity rule\nCREATE UNIQUE INDEX uq_users_document ON users (document);\n\n-- Uses the composite: the filter and the order both come from the index\nSELECT id, created_at FROM orders WHERE customer_id = $1 ORDER BY created_at DESC LIMIT 20;",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule",
        texto:
          "Index what the queries **really** do: the filter, join and sort columns of frequent, selective queries, with equality columns before range columns. Every index is a trade: faster reads for slower writes and more space. Measure before and after with `EXPLAIN` (see P42) and drop the indexes nobody uses.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The cost shows up in writes and in migrations",
        texto:
          "Every `INSERT`, every `UPDATE` of indexed columns and every `DELETE` must update all of the table’s indexes, so a table full of indexes is slow to write. On large tables, building an index can block writes: PostgreSQL offers `CREATE INDEX CONCURRENTLY`, and the migration must handle it (see P87). Check your database’s documentation.",
      },
    ],
    armadilhas: [
      "Indexing everything “just in case”: slower writes, wasted space and a planner with more paths to choose badly from.",
      "Writing the query in a way that defeats the index: a function on the column, `LIKE '%x'`, mismatched types.",
      "Getting the column order of a composite index wrong: `(created_at, customer_id)` does not replace `(customer_id, created_at)`.",
      "Assuming the index will always be used: with low selectivity or stale statistics, the planner may prefer to read the table.",
    ],
    autoteste: [
      {
        pergunta: "Why does an index speed up reads but slow down writes?",
        resposta:
          "It is a sorted structure separate from the table: finding a value is fast, but every insert, update or delete must also update the index, keeping it in order.",
      },
      {
        pergunta: "There is an index on `(customer_id, created_at)`. Does it serve `WHERE created_at > …` alone?",
        resposta:
          "Generally not: the index is sorted by `customer_id` first. It serves `customer_id = ?` and `customer_id = ? AND created_at > ?`. To filter by date alone, create another index if the query is frequent.",
      },
    ],
  },
};
