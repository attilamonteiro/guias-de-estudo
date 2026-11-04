import type { Pergunta } from "../../tipos";

// D41 · O papel do ORM
export const d041: Pergunta = {
  numero: 341,
  modulo: "devinterview-testes-e-dados",
  metodo: "compare",
  pt: {
    titulo: "O papel do ORM",
    pergunta: "Qual é o papel de um ORM no Node.js?",
    porqueEsteMetodo:
      "ORM, query builder e SQL puro resolvem o mesmo problema com doses diferentes de abstração. Lado a lado, fica claro o que cada um dá e o que cobra, e a escolha vira uma decisão com critério.",
    resposta30s:
      "Um **ORM** (mapeamento objeto-relacional) liga as tabelas do banco a modelos e objetos do seu código: monta o SQL, cuida das relações, das **migrações** e, em muitos casos, dos **tipos**, o que traz produtividade. O preço é uma **abstração que vaza** (o problema **N+1**, SQL gerado que você não vê, consultas complexas que pedem SQL cru). Entre o ORM e o SQL puro há o **query builder**, que compõe SQL sem mapear objetos.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O que um ORM faz por você",
        passos: [
          {
            titulo: "1. Mapeia tabelas em modelos",
            texto:
              "Cada tabela vira um modelo, cada linha um objeto e cada coluna um campo, com tipos. Você escreve `usuario.email` em vez de montar texto SQL e converter o resultado.",
          },
          {
            titulo: "2. Gera e parametriza o SQL",
            texto:
              "As operações comuns (criar, buscar, filtrar, atualizar, remover) viram SQL com parâmetros, o que também reduz o risco de injeção. Alguns ORMs funcionam com vários bancos.",
          },
          {
            titulo: "3. Cuida de relações e migrações",
            texto:
              "Descreve um a muitos e muitos a muitos, carrega relações sob demanda e versiona o esquema do banco em migrações, para todos os ambientes terem a mesma estrutura.",
          },
          {
            titulo: "4. Oferece transações e tipos",
            texto:
              "Agrupa operações em transações (veja L95), usa o pool de conexões (veja L93) e, em TypeScript, tipa o resultado das consultas a partir do esquema.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "SQL puro, query builder e ORM",
        colunas: ["Abordagem", "O que oferece", "O que cobra", "Quando faz sentido"],
        linhas: [
          [
            "SQL puro com um driver (`pg`, `mysql2`)",
            "Controle total do SQL e do plano de execução; nenhuma camada extra",
            "Mapeamento, migrações, tipos e cuidado com parâmetros ficam por sua conta; mais código repetitivo",
            "Consultas complexas e críticas, relatórios, poucos modelos, equipe forte em SQL",
          ],
          [
            "Query builder (Knex)",
            "Compõe SQL com funções encadeadas, parametriza por padrão, ajuda com migrações e vários bancos",
            "Não mapeia para objetos com regras nem acompanha relações; você continua pensando em SQL",
            "SQL composável e dinâmico, sem abstração pesada",
          ],
          [
            "ORM (Prisma, Sequelize, TypeORM, Drizzle)",
            "Modelos ligados às tabelas, relações, migrações, tipos e as consultas comuns prontas",
            "Curva de aprendizado própria, abstração que vaza (N+1, SQL gerado), consultas complexas pedem SQL cru",
            "CRUD e relações em torno de um domínio; equipe que quer produtividade e tipos",
          ],
        ],
        nota: "Os ORMs citados têm filosofias diferentes: cliente gerado a partir de um esquema próprio (Prisma), modelos e entidades com decorators (Sequelize, TypeORM), esquema em TypeScript e consultas próximas do SQL (Drizzle). Compare na documentação de cada um; a lista não é um ranking.",
      },
      {
        tipo: "codigo",
        titulo: "A abstração que vaza: o problema N+1",
        legenda: "JavaScript",
        codigo: `// Sintaxe do Prisma, só como exemplo; outros ORMs têm equivalentes

// N+1: 1 consulta para os pedidos + 1 para os itens de cada pedido
const pedidos = await prisma.pedido.findMany();
for (const pedido of pedidos) {
  pedido.itens = await prisma.item.findMany({ where: { pedidoId: pedido.id } });
}

// Carregando a relação junto: o ORM resolve em poucas consultas
const comItens = await prisma.pedido.findMany({ include: { itens: true } });

// Consulta complexa: SQL cru, mas parametrizado (nunca concatenado)
const top = await prisma.$queryRaw\`SELECT cliente_id, SUM(total_cents) AS total
  FROM pedidos WHERE criado_em > \${desde} GROUP BY cliente_id ORDER BY total DESC LIMIT 10\`;`,
        nota: "Com 100 pedidos, o primeiro trecho faz 101 idas ao banco; o segundo, um número pequeno e fixo. O ORM não avisa: ligue o log das consultas em desenvolvimento.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Comece pela **complexidade das consultas e pela equipe**. CRUD e relações em volta de um domínio, com time que quer tipos e migrações: ORM. Muito SQL dinâmico, mas sem querer objetos de domínio: query builder. Relatórios e consultas críticas: SQL puro (também dentro do ORM, pela porta do SQL cru). Misturar é normal: ORM para o dia a dia e SQL para os poucos casos que pedem controle.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Abstração não é desculpa para ignorar o SQL",
        texto:
          "Quem usa ORM sem saber o SQL que ele gera acaba com N+1, consultas sem índice e transações abertas por tempo demais. Leia o SQL gerado, use carregamento explícito das relações e saiba como o ORM usa o pool e as transações. A lista de ORMs e as suas APIs mudam com o tempo; confira a documentação oficial.",
      },
    ],
    armadilhas: [
      "Carregar relações dentro de um laço (`for` com `await`): é o N+1, uma consulta por item, e só aparece com dados reais.",
      "Escolher o ORM como se ele eliminasse o SQL: o esquema, os índices e o plano de execução continuam sendo problema seu.",
      "Montar SQL cru concatenando texto com a entrada do usuário: use sempre a forma parametrizada (veja L123).",
      "Alterar o esquema à mão em produção, fora das migrações: os ambientes divergem e o ORM passa a descrever um banco que não existe.",
    ],
    autoteste: [
      {
        pergunta: "O que é o problema N+1 e como evitá-lo?",
        resposta:
          "É fazer 1 consulta para uma lista e mais N consultas, uma por item, para buscar as relações. Evita-se carregando as relações junto (join ou `include`) ou buscando todos os ids de uma vez com `IN`.",
      },
      {
        pergunta: "Quando vale usar um query builder ou SQL puro em vez de um ORM?",
        resposta:
          "Quando as consultas são complexas, dinâmicas ou críticas para o desempenho, ou quando você não precisa de modelos de domínio. O query builder compõe o SQL com segurança, e o SQL puro dá controle total.",
      },
    ],
  },
  en: {
    titulo: "The role of an ORM",
    pergunta: "What’s the role of ORM in Node.js?",
    porqueEsteMetodo:
      "ORM, query builder and plain SQL solve the same problem with different amounts of abstraction. Side by side, it is clear what each one gives and what it charges, and the choice becomes a decision with criteria.",
    resposta30s:
      "An **ORM** (object-relational mapper) connects database tables to models and objects in your code: it builds the SQL, handles relationships, **migrations** and, in many cases, **types**, which brings productivity. The price is a **leaky abstraction** (the **N+1** problem, generated SQL you do not see, complex queries that need raw SQL). Between the ORM and plain SQL sits the **query builder**, which composes SQL without mapping objects.",
    blocos: [
      {
        tipo: "passos",
        titulo: "What an ORM does for you",
        passos: [
          {
            titulo: "1. Maps tables to models",
            texto:
              "Each table becomes a model, each row an object and each column a field, with types. You write `user.email` instead of assembling SQL text and converting the result.",
          },
          {
            titulo: "2. Generates and parameterizes the SQL",
            texto:
              "Common operations (create, find, filter, update, delete) become SQL with parameters, which also lowers the risk of injection. Some ORMs work with several databases.",
          },
          {
            titulo: "3. Handles relationships and migrations",
            texto:
              "Describes one-to-many and many-to-many, loads relations on demand and versions the database schema in migrations, so every environment has the same structure.",
          },
          {
            titulo: "4. Offers transactions and types",
            texto:
              "Groups operations into transactions (see L95), uses the connection pool (see L93) and, in TypeScript, types the query results from the schema.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Plain SQL, query builder and ORM",
        colunas: ["Approach", "What it offers", "What it charges", "When it makes sense"],
        linhas: [
          [
            "Plain SQL with a driver (`pg`, `mysql2`)",
            "Full control of the SQL and the execution plan; no extra layer",
            "Mapping, migrations, types and care with parameters are on you; more repetitive code",
            "Complex and critical queries, reports, few models, a team strong in SQL",
          ],
          [
            "Query builder (Knex)",
            "Composes SQL with chained functions, parameterizes by default, helps with migrations and multiple databases",
            "Does not map to objects with rules or track relationships; you still think in SQL",
            "Composable, dynamic SQL without heavy abstraction",
          ],
          [
            "ORM (Prisma, Sequelize, TypeORM, Drizzle)",
            "Models tied to tables, relationships, migrations, types and the common queries ready-made",
            "Its own learning curve, a leaky abstraction (N+1, generated SQL), complex queries need raw SQL",
            "CRUD and relationships around a domain; a team that wants productivity and types",
          ],
        ],
        nota: "The ORMs listed have different philosophies: a client generated from its own schema (Prisma), models and entities with decorators (Sequelize, TypeORM), a TypeScript schema with queries close to SQL (Drizzle). Compare them in each one’s documentation; the list is not a ranking.",
      },
      {
        tipo: "codigo",
        titulo: "The leaky abstraction: the N+1 problem",
        legenda: "JavaScript",
        codigo: `// Prisma syntax, just as an example; other ORMs have equivalents

// N+1: 1 query for the orders + 1 for each order's items
const orders = await prisma.order.findMany();
for (const order of orders) {
  order.items = await prisma.item.findMany({ where: { orderId: order.id } });
}

// Loading the relation together: the ORM solves it in a few queries
const withItems = await prisma.order.findMany({ include: { items: true } });

// Complex query: raw SQL, but parameterized (never concatenated)
const top = await prisma.$queryRaw\`SELECT customer_id, SUM(total_cents) AS total
  FROM orders WHERE created_at > \${since} GROUP BY customer_id ORDER BY total DESC LIMIT 10\`;`,
        nota: "With 100 orders, the first snippet makes 101 trips to the database; the second, a small fixed number. The ORM does not warn you: turn on query logging in development.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Start from **query complexity and the team**. CRUD and relationships around a domain, with a team that wants types and migrations: ORM. Lots of dynamic SQL, but no wish for domain objects: query builder. Reports and critical queries: plain SQL (also inside the ORM, through its raw SQL door). Mixing is normal: ORM for everyday work and SQL for the few cases that need control.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Abstraction is no excuse to ignore SQL",
        texto:
          "Using an ORM without knowing the SQL it generates leads to N+1, queries with no index and transactions left open for too long. Read the generated SQL, load relations explicitly and know how the ORM uses the pool and transactions. The list of ORMs and their APIs change over time; check the official documentation.",
      },
    ],
    armadilhas: [
      "Loading relations inside a loop (`for` with `await`): that is N+1, one query per item, and it only shows up with real data.",
      "Choosing the ORM as if it removed SQL: the schema, the indexes and the execution plan are still your problem.",
      "Building raw SQL by concatenating text with user input: always use the parameterized form (see L123).",
      "Changing the schema by hand in production, outside migrations: environments diverge and the ORM ends up describing a database that does not exist.",
    ],
    autoteste: [
      {
        pergunta: "What is the N+1 problem and how do you avoid it?",
        resposta:
          "It is making 1 query for a list and N more queries, one per item, to fetch the relations. You avoid it by loading the relations together (a join or `include`) or by fetching all the ids at once with `IN`.",
      },
      {
        pergunta: "When is it worth using a query builder or plain SQL instead of an ORM?",
        resposta:
          "When queries are complex, dynamic or critical for performance, or when you do not need domain models. The query builder composes SQL safely, and plain SQL gives total control.",
      },
    ],
  },
};
