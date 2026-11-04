import type { Pergunta } from "../../tipos";

// M09 · Consulta cara vs barata
export const m09: Pergunta = {
  numero: 209,
  modulo: "mentorcruise",
  metodo: "whys",
  pt: {
    titulo: "Consulta cara vs barata",
    pergunta: "Você consegue diferenciar uma chamada ao banco de dados cara de uma barata?",
    porqueEsteMetodo:
      "“Cara” é um sintoma; a pergunta pede a causa. Encadear “por quês” leva do tempo observado até o trabalho proporcional ao tamanho da tabela, que é o que separa uma consulta cara de uma barata.",
    resposta30s:
      "O custo de uma chamada é o **trabalho que o banco faz**: linhas e páginas lidas, ordenação, CPU, travas e **idas e voltas de rede**. **Barata**: busca por chave primária ou por índice seletivo, poucas linhas e poucas colunas. **Cara**: varredura completa, join sem limite, ordenação sem índice, **N+1**, `SELECT *` e resultados enormes. A causa-raiz é o trabalho crescer com o **tamanho da tabela**, e não com o do resultado; confirme com `EXPLAIN`.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que uma chamada ao banco custa algo?",
            resposta:
              "Porque cada chamada gasta recursos finitos: rede para ir e voltar, CPU para planejar e executar, leitura de páginas (da memória ou do disco), memória para ordenar e juntar, e travas que podem bloquear outras consultas. O custo é a soma disso.",
          },
          {
            pergunta: "Por que a mesma consulta pode ser rápida numa tabela pequena e lenta numa grande?",
            resposta:
              "Porque o custo é dominado por quantas linhas o banco precisa **ler** para achar o que você pediu, não por quantas devolve. Uma consulta que devolve uma linha pode ter lido um milhão.",
          },
          {
            pergunta: "Por que o banco às vezes precisa ler todas as linhas?",
            resposta:
              "Porque não tem um atalho utilizável. Sem índice para o filtro, ou com um filtro que o anula (função na coluna, tipos diferentes, `LIKE '%x'`), a única forma de achar as linhas é varrer a tabela inteira. O mesmo vale para ordenar sem índice, que ordena tudo, e para juntar tabelas sem condição seletiva.",
          },
          {
            pergunta: "Por que um índice resolve?",
            resposta:
              "Porque é uma estrutura ordenada (em geral uma árvore B) que leva ao ponto certo em poucos passos, e o número de passos cresce devagar com o tamanho da tabela. Numa busca por chave primária o banco toca poucas páginas. O atalho só compensa se o filtro for seletivo: pedir 40% da tabela por índice não ajuda.",
          },
          {
            pergunta: "Por que uma consulta barata sozinha também pode ficar cara?",
            resposta:
              "Porque cada ida e volta tem uma latência fixa de rede, por mais simples que seja a consulta. No N+1, 1.000 consultas de 1 ms levam cerca de 1 s só em idas e voltas. E `SELECT *` ou um resultado enorme gastam rede e memória com colunas e linhas que ninguém vai usar.",
          },
        ],
        causaRaiz:
          "Consulta cara = **trabalho proporcional ao tamanho da tabela** (ou ao número de idas e voltas), e não ao tamanho do resultado. Consulta barata = o banco chega direto às linhas certas por um índice e devolve só o necessário.",
      },
      {
        tipo: "tabela",
        titulo: "Tende a ser barata vs tende a ser cara",
        colunas: ["Aspecto", "Barata", "Cara"],
        linhas: [
          [
            "Acesso às linhas",
            "Busca por chave primária ou índice seletivo: poucos passos até a linha",
            "Varredura completa (seq scan) de uma tabela grande",
          ],
          [
            "Filtro",
            "Condição direta sobre coluna indexada, como `WHERE id = 42`",
            "Função na coluna, `LIKE '%x'` ou tipos diferentes, que impedem o uso do índice",
          ],
          [
            "Ordenação",
            "`ORDER BY` na ordem de um índice, com `LIMIT`",
            "`ORDER BY` sem índice sobre muitas linhas: ordena tudo, às vezes em disco",
          ],
          [
            "Junção",
            "Join por chave indexada, com o filtro aplicado cedo",
            "Join sem condição seletiva nem índice, ou sem `LIMIT`: explosão de combinações",
          ],
          [
            "Colunas e resultado",
            "Só as colunas necessárias e poucas linhas",
            "`SELECT *` e resultado enorme: gasto de rede e de memória",
          ],
          [
            "Número de chamadas",
            "Uma chamada que traz tudo de que a tela precisa",
            "N+1: uma consulta por item, e a latência de cada ida e volta se soma",
          ],
          [
            "Travas",
            "Leitura curta, transação curta",
            "Transação longa segurando travas e bloqueando outras (veja Q09)",
          ],
        ],
        nota: "É uma tendência, não uma lei: o otimizador decide o plano com base em estatísticas, e o tamanho da tabela muda a decisão. Para índices, veja Q07; para o roteiro de otimização, Q13.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Não adivinhe: peça o plano",
        texto:
          "`EXPLAIN` mostra o plano que o banco escolheu e a estimativa de custo; `EXPLAIN ANALYZE` (Postgres e MySQL recentes) executa de verdade e mostra tempo e linhas reais. Sinais de consulta cara: varredura completa em tabela grande, muito mais linhas lidas do que devolvidas, estimativa bem diferente da realidade e ordenação ou hash que vai para o disco. O nome do comando e o formato do plano variam por banco. Cuidado: `EXPLAIN ANALYZE` de um `UPDATE` ou `DELETE` executa a mudança, então envolva em uma transação e faça `ROLLBACK`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Barata sozinha, cara em volume",
        texto:
          "Custo é duração vezes frequência. Uma consulta de 1 ms chamada 10 mil vezes por segundo consome mais do banco que uma de 200 ms rodada uma vez por hora. E uma tabela pequena em desenvolvimento esconde a varredura completa: o mesmo SQL só aparece como problema depois que os dados crescem.",
      },
    ],
    armadilhas: [
      "Julgar pelo tempo em desenvolvimento, com tabela pequena: a varredura completa parece instantânea até a tabela crescer.",
      "Achar que índice sempre resolve: um filtro pouco seletivo não se beneficia, o índice custa escrita e certos filtros o anulam.",
      "Olhar uma consulta isolada e ignorar a frequência: N+1 e chamadas em laço transformam consultas baratas em carga alta.",
      "Confundir tamanho do resultado com custo: uma consulta que devolve uma linha pode ter lido a tabela inteira.",
    ],
    autoteste: [
      {
        pergunta: "Uma consulta devolve apenas uma linha. Ela pode ser cara? Por quê?",
        resposta:
          "Pode: se o banco varreu a tabela inteira para achar essa linha. O custo vem das linhas lidas, não das devolvidas.",
      },
      {
        pergunta: "Por que `SELECT *` pode ser um problema mesmo com índice?",
        resposta:
          "Traz colunas desnecessárias (rede e memória) e, em geral, impede que o banco responda só pelo índice, obrigando-o a ir também à tabela.",
      },
      {
        pergunta: "Qual a primeira ferramenta para descobrir se uma consulta é cara?",
        resposta:
          "O plano de execução (`EXPLAIN`, e `EXPLAIN ANALYZE` para tempos e linhas reais), junto com o registro de consultas lentas do banco.",
      },
    ],
  },
  en: {
    titulo: "Expensive vs cheap queries",
    pergunta: "Can you differentiate between a database call being expensive and a database call being cheap?",
    porqueEsteMetodo:
      "“Expensive” is a symptom; the question asks for the cause. Chaining “whys” leads from the observed time to work proportional to the size of the table, which is what separates an expensive query from a cheap one.",
    resposta30s:
      "The cost of a call is the **work the database does**: rows and pages read, sorting, CPU, locks and **network round trips**. **Cheap**: a lookup by primary key or selective index, few rows and few columns. **Expensive**: a full scan, an unbounded join, sorting without an index, **N+1**, `SELECT *` and huge results. The root cause is work that grows with the **size of the table**, not the size of the result; confirm with `EXPLAIN`.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does a database call cost anything?",
            resposta:
              "Because each call spends finite resources: network to go and come back, CPU to plan and execute, page reads (from memory or disk), memory to sort and join, and locks that can block other queries. The cost is the sum of those.",
          },
          {
            pergunta: "Why can the same query be fast on a small table and slow on a large one?",
            resposta:
              "Because the cost is dominated by how many rows the database has to **read** to find what you asked for, not by how many it returns. A query that returns one row may have read a million.",
          },
          {
            pergunta: "Why does the database sometimes have to read every row?",
            resposta:
              "Because it has no usable shortcut. With no index for the filter, or a filter that defeats it (a function on the column, mismatched types, `LIKE '%x'`), the only way to find the rows is to scan the whole table. The same goes for sorting without an index, which sorts everything, and for joining tables without a selective condition.",
          },
          {
            pergunta: "Why does an index fix that?",
            resposta:
              "Because it is an ordered structure (usually a B-tree) that leads to the right spot in a few steps, and the number of steps grows slowly with the size of the table. On a primary key lookup the database touches few pages. The shortcut only pays off if the filter is selective: asking for 40% of the table through an index does not help.",
          },
          {
            pergunta: "Why can a cheap query on its own also become expensive?",
            resposta:
              "Because every round trip has a fixed network latency, however simple the query is. With N+1, 1,000 queries of 1 ms take about 1 s in round trips alone. And `SELECT *` or a huge result spends network and memory on columns and rows nobody will use.",
          },
        ],
        causaRaiz:
          "Expensive query = **work proportional to the size of the table** (or to the number of round trips), not to the size of the result. Cheap query = the database goes straight to the right rows through an index and returns only what is needed.",
      },
      {
        tipo: "tabela",
        titulo: "Tends to be cheap vs tends to be expensive",
        colunas: ["Aspect", "Cheap", "Expensive"],
        linhas: [
          [
            "Row access",
            "Lookup by primary key or selective index: few steps to the row",
            "Full scan (seq scan) of a large table",
          ],
          [
            "Filter",
            "A direct condition on an indexed column, such as `WHERE id = 42`",
            "A function on the column, `LIKE '%x'` or mismatched types, which prevent the index from being used",
          ],
          [
            "Sorting",
            "`ORDER BY` following an index order, with `LIMIT`",
            "`ORDER BY` without an index over many rows: sorts everything, sometimes on disk",
          ],
          [
            "Join",
            "Join on an indexed key, with the filter applied early",
            "Join with no selective condition or index, or no `LIMIT`: combinations explode",
          ],
          [
            "Columns and result",
            "Only the needed columns and few rows",
            "`SELECT *` and a huge result: wasted network and memory",
          ],
          [
            "Number of calls",
            "One call that brings everything the screen needs",
            "N+1: one query per item, and the latency of each round trip adds up",
          ],
          ["Locks", "Short read, short transaction", "A long transaction holding locks and blocking others (see Q09)"],
        ],
        nota: "It is a tendency, not a law: the optimizer picks the plan from statistics, and table size changes its choice. For indexes, see Q07; for the optimization routine, Q13.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Do not guess: ask for the plan",
        texto:
          "`EXPLAIN` shows the plan the database chose and its cost estimate; `EXPLAIN ANALYZE` (Postgres and recent MySQL) actually runs the query and shows real time and rows. Signs of an expensive query: a full scan on a large table, far more rows read than returned, an estimate far from reality, and a sort or hash spilling to disk. The command name and plan format vary by database. Careful: `EXPLAIN ANALYZE` on an `UPDATE` or `DELETE` performs the change, so wrap it in a transaction and `ROLLBACK`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cheap alone, expensive in volume",
        texto:
          "Cost is duration times frequency. A 1 ms query called 10 thousand times per second consumes more of the database than a 200 ms query run once an hour. And a small table in development hides the full scan: the same SQL only shows up as a problem once the data grows.",
      },
    ],
    armadilhas: [
      "Judging by development timings, on a small table: the full scan looks instant until the table grows.",
      "Assuming an index always helps: a low-selectivity filter does not benefit, the index costs writes and some filters defeat it.",
      "Looking at one query in isolation and ignoring frequency: N+1 and calls in a loop turn cheap queries into heavy load.",
      "Confusing result size with cost: a query that returns one row may have read the whole table.",
    ],
    autoteste: [
      {
        pergunta: "A query returns just one row. Can it be expensive? Why?",
        resposta:
          "It can: if the database scanned the whole table to find that row. The cost comes from rows read, not rows returned.",
      },
      {
        pergunta: "Why can `SELECT *` be a problem even with an index?",
        resposta:
          "It brings unneeded columns (network and memory) and usually prevents the database from answering from the index alone, forcing it to visit the table too.",
      },
      {
        pergunta: "What is the first tool for finding out whether a query is expensive?",
        resposta:
          "The execution plan (`EXPLAIN`, and `EXPLAIN ANALYZE` for real times and rows), together with the database’s slow-query log.",
      },
    ],
  },
};
