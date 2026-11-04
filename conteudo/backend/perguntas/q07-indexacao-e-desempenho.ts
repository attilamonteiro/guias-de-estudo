import type { Pergunta } from "../../tipos";

// Q07 · Indexação e desempenho
export const q07: Pergunta = {
  numero: 7,
  modulo: "bancos-de-dados",
  metodo: "feynman",
  pt: {
    titulo: "Indexação e desempenho",
    pergunta: "Explique a indexação de banco de dados e seu impacto no desempenho.",
    porqueEsteMetodo:
      "Indexação é intuitiva se você pensar no índice remissivo de um livro. A analogia explica o ganho; o ponto onde ela quebra (custo na escrita) é justamente o que se cobra em entrevista.",
    resposta30s:
      "Um **índice** é uma estrutura à parte (em geral uma B-Tree) que mantém os valores de uma coluna ordenados, com ponteiros para as linhas, transformando uma busca de O(n) (ler a tabela inteira) em O(log n). Acelera `WHERE`, `JOIN` e `ORDER BY`, mas ocupa espaço e deixa `INSERT/UPDATE/DELETE` mais lentos, porque o índice também precisa ser atualizado.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Para achar onde o livro fala de “deadlock” você vai ao índice remissivo no fim: ele lista os termos em ordem e diz as páginas. Sem índice, folheia o livro inteiro.",
        tecnico:
          "Sem índice o banco faz um **full table scan**: lê todas as linhas. Com um índice B-Tree ele desce uma árvore balanceada de poucos níveis (para 1 milhão de linhas, ~3 a 4 leituras de página) e chega direto às linhas. Há outros tipos: hash (igualdade), GIN (arrays, JSONB, full-text), GiST (geoespacial), BRIN (dados enormes e ordenados). Um índice **composto** `(a, b, c)` atende consultas por `a`, `a+b` e `a+b+c` (prefixo à esquerda), mas não `b` sozinho.",
        limite:
          "O índice do livro é feito uma vez. O do banco precisa ser reescrito a cada alteração de dados, então cada índice extra deixa as escritas mais lentas e ocupa disco e memória. E o banco só o usa se o otimizador achar vantajoso: uma consulta que devolve metade da tabela ignora o índice.",
      },
      {
        tipo: "codigo",
        legenda: "sql",
        codigo:
          "CREATE INDEX idx_pedidos_cliente_data\n  ON pedidos (cliente_id, criado_em DESC);\n\nEXPLAIN ANALYZE\nSELECT * FROM pedidos\nWHERE cliente_id = 42\nORDER BY criado_em DESC LIMIT 10;\n-- Antes:  Seq Scan    (lê 1.000.000 de linhas)\n-- Depois: Index Scan  (lê ~10 linhas, já ordenadas)",
      },
      {
        tipo: "tabela",
        titulo: "Quando o índice não ajuda",
        colunas: ["Situação", "Por quê"],
        linhas: [
          [
            "`WHERE lower(email) = ...` com índice em `email`",
            "A função na coluna impede o uso; crie um índice funcional em `lower(email)`",
          ],
          ["`LIKE '%texto'`", "Prefixo desconhecido: a B-Tree não consegue usar a ordenação; use full-text ou trigram"],
          [
            "Coluna de baixa seletividade (ex.: booleano)",
            "Metade da tabela casa; ler tudo é mais barato que pular pelo índice",
          ],
          ["Tabela pequena", "Um scan é mais rápido que descer a árvore"],
          ["Tipos diferentes (`WHERE id = '42'` em coluna inteira)", "A conversão implícita pode invalidar o índice"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Covering index",
        texto:
          "Se o índice já contém todas as colunas que a consulta pede (`INCLUDE`), o banco responde só pelo índice (**index-only scan**), sem tocar na tabela.",
      },
    ],
    armadilhas: [
      "Indexar tudo “por garantia”: cada índice custa em escrita, espaço e manutenção.",
      "Esquecer a ordem das colunas no índice composto: igualdade primeiro, depois intervalo ou ordenação.",
      "Não olhar o `EXPLAIN`: você acha que usa o índice, mas o plano mostra Seq Scan.",
      "Função ou conversão de tipo na coluna indexada dentro do `WHERE`.",
    ],
    autoteste: [
      {
        pergunta: "Por que um índice deixa o INSERT mais lento?",
        resposta: "Porque cada índice também é uma estrutura ordenada que precisa ser atualizada a cada escrita.",
      },
      {
        pergunta: "Você tem o índice (a, b). Ele ajuda `WHERE b = 1`?",
        resposta:
          "Em geral não: o índice composto só atende a prefixos à esquerda (`a`, ou `a` e `b`). Seria preciso um índice em `b`.",
      },
    ],
  },
  en: {
    titulo: "Indexing and performance",
    pergunta: "Explain database indexing and its impact on performance.",
    porqueEsteMetodo:
      "Indexing is intuitive if you picture a book’s back-of-the-book index. The analogy explains the gain; the point where it breaks (write cost) is exactly what interviews probe.",
    resposta30s:
      "An **index** is a separate structure (usually a B-Tree) that keeps a column’s values sorted, with pointers to the rows, turning an O(n) search (reading the whole table) into O(log n). It speeds up `WHERE`, `JOIN` and `ORDER BY`, but takes space and slows `INSERT/UPDATE/DELETE`, because the index must be updated too.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "To find where a book talks about “deadlock” you go to the index at the back: it lists terms in order and gives page numbers. Without it you flip through the whole book.",
        tecnico:
          "Without an index the database does a **full table scan**: it reads every row. With a B-Tree index it walks a balanced tree of few levels (for 1 million rows, ~3 to 4 page reads) and lands directly on the rows. Other types exist: hash (equality), GIN (arrays, JSONB, full-text), GiST (geospatial), BRIN (huge ordered data). A **composite** index `(a, b, c)` serves queries on `a`, `a+b` and `a+b+c` (leftmost prefix), but not `b` alone.",
        limite:
          "A book’s index is built once. The database’s must be rewritten on every data change, so each extra index slows writes and uses disk and memory. And the database only uses it if the optimizer judges it worthwhile: a query returning half the table ignores the index.",
      },
      {
        tipo: "codigo",
        legenda: "sql",
        codigo:
          "CREATE INDEX idx_orders_customer_date\n  ON orders (customer_id, created_at DESC);\n\nEXPLAIN ANALYZE\nSELECT * FROM orders\nWHERE customer_id = 42\nORDER BY created_at DESC LIMIT 10;\n-- Before: Seq Scan    (reads 1,000,000 rows)\n-- After:  Index Scan  (reads ~10 rows, already sorted)",
      },
      {
        tipo: "tabela",
        titulo: "When an index does not help",
        colunas: ["Situation", "Why"],
        linhas: [
          [
            "`WHERE lower(email) = ...` with an index on `email`",
            "The function on the column blocks its use; create a functional index on `lower(email)`",
          ],
          ["`LIKE '%text'`", "Unknown prefix: the B-Tree cannot use its ordering; use full-text or trigram"],
          [
            "Low-selectivity column (e.g. boolean)",
            "Half the table matches; reading everything is cheaper than hopping through the index",
          ],
          ["Small table", "A scan is faster than descending the tree"],
          ["Mismatched types (`WHERE id = '42'` on an integer column)", "Implicit conversion can invalidate the index"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Covering index",
        texto:
          "If the index already contains every column the query asks for (`INCLUDE`), the database answers from the index alone (**index-only scan**), without touching the table.",
      },
    ],
    armadilhas: [
      "Indexing everything “just in case”: every index costs write time, space and maintenance.",
      "Forgetting column order in a composite index: equality first, then range or sort.",
      "Not reading `EXPLAIN`: you think the index is used, but the plan shows Seq Scan.",
      "A function or type conversion on the indexed column inside the `WHERE`.",
    ],
    autoteste: [
      {
        pergunta: "Why does an index make INSERT slower?",
        resposta: "Because each index is also a sorted structure that must be updated on every write.",
      },
      {
        pergunta: "You have an index on (a, b). Does it help `WHERE b = 1`?",
        resposta:
          "Usually not: a composite index only serves leftmost prefixes (`a`, or `a` and `b`). You would need an index on `b`.",
      },
    ],
  },
};
