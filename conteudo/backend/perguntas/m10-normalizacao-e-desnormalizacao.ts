import type { Pergunta } from "../../tipos";

// M10 · Normalização e desnormalização
export const m10: Pergunta = {
  numero: 210,
  modulo: "mentorcruise",
  metodo: "compare",
  pt: {
    titulo: "Normalização vs desnormalização",
    pergunta: "Você pode explicar a normalização e a desnormalização de bancos de dados?",
    porqueEsteMetodo:
      "É um “X vs Y”: as formas normais mostram o que se ganha ao organizar os dados, a matriz põe os dois lados lado a lado e a regra de decisão diz quando abrir mão da normalização, que é o que a entrevista realmente testa.",
    resposta30s:
      "**Normalizar** é organizar as tabelas para que cada fato seja guardado **uma só vez** (1FN, 2FN, 3FN), o que evita as **anomalias** de inserção, atualização e exclusão. **Desnormalizar** é duplicar ou pré-calcular dados de propósito para **ler mais rápido**, ao custo de **escrita mais cara** e de risco de inconsistência. Regra prática: comece normalizado e desnormalize só com um motivo medido, deixando claro quem mantém as cópias em dia.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "As três primeiras formas normais",
        colunas: ["Forma", "Regra", "Violação (exemplo)", "Correção"],
        linhas: [
          [
            "1FN",
            "Cada célula guarda um valor atômico, sem listas dentro de uma coluna, e cada linha é identificável",
            "`pedido(id, itens)` com `itens = 'caneta, caderno'`",
            "Uma linha por item em `item_pedido(pedido_id, produto_id, qtd)`",
          ],
          [
            "2FN",
            "Já em 1FN, e todo atributo fora da chave depende da chave inteira (só importa com chave composta)",
            "`item_pedido(pedido_id, produto_id, qtd, nome_produto)`: `nome_produto` depende só de `produto_id`",
            "Mover `nome_produto` para `produto(id, nome)`",
          ],
          [
            "3FN",
            "Já em 2FN, e nenhum atributo fora da chave depende de outro atributo fora da chave (dependência transitiva)",
            "`funcionario(id, departamento_id, nome_departamento)`: `nome_departamento` depende de `departamento_id`, não de `id`",
            "Mover para `departamento(id, nome)` e guardar só a chave estrangeira",
          ],
        ],
        nota: "Regra de bolso: todo atributo depende da chave, da chave inteira e de nada além da chave. Existem formas mais fortes (BCNF, 4FN, 5FN), mas a 3FN costuma ser o alvo prático.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "As três anomalias que a normalização previne",
        texto:
          "**Inserção**: numa tabela única de pedidos com dados do produto, não dá para cadastrar um produto que ainda não foi vendido. **Atualização**: o endereço do cliente repetido em 50 linhas; mudar 49 e esquecer uma deixa dados contraditórios. **Exclusão**: apagar o único pedido de um cliente apaga junto os dados do cliente.",
      },
      {
        tipo: "tabela",
        titulo: "Normalizado vs desnormalizado",
        colunas: ["Aspecto", "Normalizado", "Desnormalizado"],
        linhas: [
          [
            "Ideia",
            "Cada fato guardado uma vez; tabelas ligadas por chaves",
            "Cópias ou agregados guardados de propósito, junto de quem lê",
          ],
          ["Leitura", "Mais joins para montar uma tela ou um relatório", "Uma leitura traz quase tudo; menos joins"],
          [
            "Escrita",
            "Atualiza em um só lugar: escrita simples e barata",
            "Atualiza várias cópias: escrita mais cara e mais complexa",
          ],
          [
            "Consistência",
            "O próprio esquema ajuda a garantir: há uma única fonte da verdade",
            "Cópias podem divergir; a aplicação ou um processo precisa mantê-las sincronizadas",
          ],
          ["Espaço", "Menos redundância", "Mais espaço, em geral um custo secundário"],
          [
            "Evolução do esquema",
            "Mudar um fato mexe em uma tabela",
            "Mudar um fato ou um formato mexe em várias cópias",
          ],
          [
            "Casos típicos",
            "Sistemas transacionais: pedidos, contas, cadastros",
            "Leitura pesada, relatórios e análises, documentos embutidos em NoSQL, resumos e contadores",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Comece normalizado (até a 3FN) e desnormalize **só com motivo medido**: uma leitura crítica ainda lenta depois de índices e de um bom plano (veja Q13), um padrão de acesso com muito mais leitura que escrita, ou um modelo de documentos em que a consulta principal sempre lê o agregado inteiro. Desnormalizar é uma decisão por consulta, não por tabela, e vem com um dono: quem atualiza as cópias e o que acontece se a atualização falhar no meio?",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Técnicas de desnormalização controlada",
        texto:
          "**Visões materializadas**: o resultado de uma consulta guardado e atualizado sob demanda ou por agenda (uma view comum não guarda nada). **Colunas de resumo**: `total_pedido`, `qtd_comentarios`, atualizadas na mesma transação ou por gatilho. **Tabelas de relatório**: alimentadas por jobs. **Documentos embutidos** em NoSQL: copiar o nome do autor dentro do post. **Cache** (veja Q11): também é uma cópia derivada, e também pode ficar velha.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O custo escondido",
        texto:
          "Cópia sem dono vira inconsistência. Antes de desnormalizar, responda: quem mantém a cópia em dia? O que acontece se a escrita da tabela funcionar e a do resumo falhar? Quanto tempo de atraso é aceitável (veja Q25)? Desnormalizar cedo demais troca um problema de leitura hipotético por um bug de dados real.",
      },
    ],
    armadilhas: [
      "Dizer que “normalizar é sempre melhor” ou que “desnormalizar é sempre mais rápido”: depende do padrão de acesso, e sem medir é chute.",
      "Desnormalizar antes de tentar o básico: índices, reescrita da consulta e cache.",
      "Esquecer quem mantém as cópias consistentes, e o que acontece numa falha parcial.",
      "Tratar como erro copiar o preço ou o endereço no item de um pedido: é um fato histórico (o valor no momento da compra), diferente do preço atual do produto.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre a 2FN e a 3FN?",
        resposta:
          "Na 2FN, nenhum atributo depende só de parte de uma chave composta. Na 3FN, nenhum atributo fora da chave depende de outro atributo fora da chave.",
      },
      {
        pergunta: "Quais são as três anomalias de um esquema mal normalizado?",
        resposta:
          "Inserção (não dá para registrar um fato sem outro), atualização (a mesma informação em várias linhas fica contraditória) e exclusão (apagar uma linha leva dados de outro fato junto).",
      },
      {
        pergunta: "Quando uma coluna de resumo, como `total` no pedido, se justifica?",
        resposta:
          "Quando a leitura é frequente e medida como lenta sem ela, e a coluna é atualizada de forma confiável (por exemplo, na mesma transação que altera os itens). Sem esses dois pontos, é só redundância.",
      },
    ],
  },
  en: {
    titulo: "Normalization vs denormalization",
    pergunta: "Can you explain database normalization and de-normalization?",
    porqueEsteMetodo:
      "It is an “X vs Y” question: the normal forms show what you gain by organizing data, the matrix puts both sides next to each other and the decision rule says when to give up normalization, which is what an interview really tests.",
    resposta30s:
      "**Normalizing** means organizing tables so every fact is stored **only once** (1NF, 2NF, 3NF), which avoids insert, update and delete **anomalies**. **Denormalizing** means duplicating or pre-computing data on purpose to **read faster**, at the cost of **more expensive writes** and a risk of inconsistency. Rule of thumb: start normalized and denormalize only with a measured reason, making clear who keeps the copies up to date.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The first three normal forms",
        colunas: ["Form", "Rule", "Violation (example)", "Fix"],
        linhas: [
          [
            "1NF",
            "Every cell holds an atomic value, no lists inside a column, and every row is identifiable",
            "`orders(id, items)` with `items = 'pen, notebook'`",
            "One row per item in `order_items(order_id, product_id, qty)`",
          ],
          [
            "2NF",
            "Already in 1NF, and every non-key attribute depends on the whole key (only matters with a composite key)",
            "`order_items(order_id, product_id, qty, product_name)`: `product_name` depends only on `product_id`",
            "Move `product_name` to `products(id, name)`",
          ],
          [
            "3NF",
            "Already in 2NF, and no non-key attribute depends on another non-key attribute (transitive dependency)",
            "`employees(id, department_id, department_name)`: `department_name` depends on `department_id`, not on `id`",
            "Move it to `departments(id, name)` and keep only the foreign key",
          ],
        ],
        nota: "Rule of thumb: every attribute depends on the key, the whole key and nothing but the key. Stronger forms exist (BCNF, 4NF, 5NF), but 3NF is usually the practical target.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "The three anomalies normalization prevents",
        texto:
          "**Insert**: in a single orders table that carries product data, you cannot register a product that has not been sold yet. **Update**: a customer’s address repeated across 50 rows; changing 49 and missing one leaves contradictory data. **Delete**: removing a customer’s only order also removes the customer’s data.",
      },
      {
        tipo: "tabela",
        titulo: "Normalized vs denormalized",
        colunas: ["Aspect", "Normalized", "Denormalized"],
        linhas: [
          [
            "Idea",
            "Each fact stored once; tables linked by keys",
            "Copies or aggregates stored on purpose, next to whoever reads them",
          ],
          ["Reads", "More joins to build a screen or a report", "One read brings almost everything; fewer joins"],
          [
            "Writes",
            "Updates in one place: simple, cheap writes",
            "Updates several copies: costlier, more complex writes",
          ],
          [
            "Consistency",
            "The schema itself helps guarantee it: a single source of truth",
            "Copies can diverge; the application or a process must keep them in sync",
          ],
          ["Space", "Less redundancy", "More space, usually a secondary cost"],
          [
            "Schema evolution",
            "Changing a fact touches one table",
            "Changing a fact or a format touches several copies",
          ],
          [
            "Typical cases",
            "Transactional systems: orders, accounts, registries",
            "Read-heavy workloads, reports and analytics, documents embedded in NoSQL, summaries and counters",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Start normalized (up to 3NF) and denormalize **only with a measured reason**: a critical read that is still slow after indexes and a good plan (see Q13), an access pattern with far more reads than writes, or a document model where the main query always reads the whole aggregate. Denormalizing is a per-query decision, not a per-table one, and it comes with an owner: who updates the copies, and what happens if the update fails midway?",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Controlled denormalization techniques",
        texto:
          "**Materialized views**: a query result stored and refreshed on demand or on a schedule (a plain view stores nothing). **Summary columns**: `order_total`, `comment_count`, updated in the same transaction or by a trigger. **Reporting tables**: fed by jobs. **Embedded documents** in NoSQL: copying the author’s name into the post. **Cache** (see Q11): also a derived copy, and it can also go stale.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The hidden cost",
        texto:
          "A copy without an owner becomes an inconsistency. Before denormalizing, answer: who keeps the copy up to date? What happens if the write to the table succeeds and the write to the summary fails? How much lag is acceptable (see Q25)? Denormalizing too early trades a hypothetical read problem for a real data bug.",
      },
    ],
    armadilhas: [
      "Saying “normalizing is always better” or “denormalizing is always faster”: it depends on the access pattern, and without measuring it is a guess.",
      "Denormalizing before trying the basics: indexes, query rewrites and caching.",
      "Forgetting who keeps the copies consistent, and what happens on a partial failure.",
      "Treating as a mistake the copying of the price or address into an order line: it is a historical fact (the value at purchase time), different from the product’s current price.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between 2NF and 3NF?",
        resposta:
          "In 2NF, no attribute depends on only part of a composite key. In 3NF, no non-key attribute depends on another non-key attribute.",
      },
      {
        pergunta: "What are the three anomalies of a poorly normalized schema?",
        resposta:
          "Insert (you cannot record one fact without another), update (the same information in several rows becomes contradictory) and delete (removing a row takes another fact’s data with it).",
      },
      {
        pergunta: "When is a summary column, such as `total` on an order, justified?",
        resposta:
          "When the read is frequent and measured as slow without it, and the column is updated reliably (for example, in the same transaction that changes the items). Without both points, it is just redundancy.",
      },
    ],
  },
};
