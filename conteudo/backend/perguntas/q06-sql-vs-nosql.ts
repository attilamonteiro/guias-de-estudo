import type { Pergunta } from "../../tipos";

// Q06 · SQL vs NoSQL
export const q06: Pergunta = {
  numero: 6,
  modulo: "bancos-de-dados",
  metodo: "compare",
  pt: {
    titulo: "SQL vs NoSQL",
    pergunta: "Qual é a diferença entre bancos de dados SQL e NoSQL? Quando você usaria cada um?",
    porqueEsteMetodo:
      "A resposta útil é uma regra de decisão: o que cada família entrega e para que padrões de uso cada uma é a escolha certa. Por isso, matriz mais critérios de escolha.",
    resposta30s:
      "**SQL** (relacional) guarda dados em tabelas com esquema rígido, relacionamentos por chave estrangeira, joins e transações ACID. **NoSQL** é um guarda-chuva de modelos (documento, chave-valor, coluna larga, grafo) que troca parte dessas garantias por esquema flexível e escala horizontal mais simples. Ponto de partida: SQL (Postgres); escolha NoSQL quando um padrão de acesso específico ou uma escala medida justificar.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspecto", "SQL (relacional)", "NoSQL"],
        linhas: [
          [
            "Modelo",
            "Tabelas, linhas, colunas, relacionamentos",
            "Documento (MongoDB), chave-valor (Redis, DynamoDB), coluna larga (Cassandra), grafo (Neo4j)",
          ],
          ["Esquema", "Definido antes; muda por migração", "Flexível; a estrutura vive no código (schema-on-read)"],
          [
            "Consultas",
            "SQL expressivo: joins, agregações, consultas ad hoc",
            "Rápido pelo acesso previsto; consulta nova pode exigir remodelar",
          ],
          [
            "Transações",
            "ACID completo entre várias tabelas",
            "Varia: muitos dão ACID só por documento ou partição; outros, nenhum",
          ],
          [
            "Escala",
            "Vertical + réplicas de leitura; sharding dá trabalho",
            "Horizontal por desenho (partições distribuídas)",
          ],
          ["Consistência", "Forte por padrão", "Frequentemente eventual ou ajustável (quórum)"],
          ["Modelagem", "Normalizar e perguntar depois", "Modelar pelas consultas; duplicar dados de propósito"],
        ],
      },
      {
        tipo: "passos",
        titulo: "Como escolher",
        passos: [
          {
            titulo: "Dados relacionados e integridade importam? (pedidos, financeiro, cadastros)",
            texto: "SQL. Chaves estrangeiras, constraints e transações evitam estados impossíveis.",
          },
          {
            titulo: "Precisa de relatórios e consultas que ainda não conhece?",
            texto: "SQL. A flexibilidade de consulta é o ponto forte.",
          },
          {
            titulo: "O acesso é quase sempre “busque por esta chave” numa escala enorme?",
            texto: "Chave-valor ou documento (DynamoDB, Redis, MongoDB) ou coluna larga.",
          },
          {
            titulo: "Escrita massiva e contínua (logs, séries temporais, IoT)?",
            texto: "Coluna larga ou série temporal (Cassandra, TimescaleDB, ClickHouse).",
          },
          {
            titulo: "O valor está nos relacionamentos profundos (recomendação, fraude)?",
            texto: "Grafo (Neo4j).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Atalho",
        texto:
          "Postgres com `JSONB` cobre boa parte do que se procura em “documento” e ainda dá SQL e ACID. O ponto de partida sensato é ele; saia dele com um motivo medido.",
      },
    ],
    armadilhas: [
      "“NoSQL não tem schema”: tem, só que no código; sem disciplina vira um depósito de documentos incompatíveis.",
      "Escolher NoSQL por moda e depois reinventar joins e transações na aplicação.",
      "Usar um banco só para tudo ou, no outro extremo, cinco bancos para um sistema pequeno.",
      "Confundir SQL (a linguagem) com relacional (o modelo): existem bancos relacionais distribuídos (CockroachDB, Spanner).",
    ],
    autoteste: [
      {
        pergunta: "Quando você escolheria Cassandra em vez de Postgres?",
        resposta:
          "Escrita massiva e contínua, escala horizontal obrigatória e padrões de acesso fixos e conhecidos (séries temporais, mensagens), aceitando consistência ajustável e menos consultas ad hoc.",
      },
      {
        pergunta: "Por que modelar em NoSQL “pelas consultas”?",
        resposta:
          "Porque sem joins cada consulta precisa de uma estrutura que a responda numa leitura; por isso se duplicam dados de propósito.",
      },
    ],
  },
  en: {
    titulo: "SQL vs NoSQL",
    pergunta: "What is the difference between SQL and NoSQL databases? When would you use each?",
    porqueEsteMetodo:
      "The useful answer is a decision rule: what each family delivers and for which usage patterns it is the right choice. Hence a matrix plus selection criteria.",
    resposta30s:
      "**SQL** (relational) stores data in tables with a rigid schema, foreign-key relationships, joins and ACID transactions. **NoSQL** is an umbrella of models (document, key-value, wide-column, graph) that trades some of those guarantees for a flexible schema and simpler horizontal scaling. Starting point: SQL (Postgres); choose NoSQL when a specific access pattern or a measured scale justifies it.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspect", "SQL (relational)", "NoSQL"],
        linhas: [
          [
            "Model",
            "Tables, rows, columns, relationships",
            "Document (MongoDB), key-value (Redis, DynamoDB), wide-column (Cassandra), graph (Neo4j)",
          ],
          ["Schema", "Defined up front; changes via migration", "Flexible; structure lives in code (schema-on-read)"],
          [
            "Queries",
            "Expressive SQL: joins, aggregations, ad hoc queries",
            "Fast for the planned access; a new query may require remodeling",
          ],
          [
            "Transactions",
            "Full ACID across several tables",
            "Varies: many give ACID only per document or partition; others none",
          ],
          [
            "Scaling",
            "Vertical + read replicas; sharding takes effort",
            "Horizontal by design (distributed partitions)",
          ],
          ["Consistency", "Strong by default", "Often eventual or tunable (quorum)"],
          ["Modeling", "Normalize, ask questions later", "Model around the queries; duplicate data on purpose"],
        ],
      },
      {
        tipo: "passos",
        titulo: "How to choose",
        passos: [
          {
            titulo: "Do related data and integrity matter? (orders, finance, records)",
            texto: "SQL. Foreign keys, constraints and transactions prevent impossible states.",
          },
          {
            titulo: "Do you need reports and queries you do not know yet?",
            texto: "SQL. Query flexibility is its strength.",
          },
          {
            titulo: "Is access almost always “fetch by this key” at huge scale?",
            texto: "Key-value or document (DynamoDB, Redis, MongoDB) or wide-column.",
          },
          {
            titulo: "Massive, continuous writes (logs, time series, IoT)?",
            texto: "Wide-column or time-series (Cassandra, TimescaleDB, ClickHouse).",
          },
          {
            titulo: "Is the value in deep relationships (recommendations, fraud)?",
            texto: "Graph (Neo4j).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Shortcut",
        texto:
          "Postgres with `JSONB` covers much of what people look for in “document” stores and still gives SQL and ACID. It is the sensible starting point; leave it for a measured reason.",
      },
    ],
    armadilhas: [
      "“NoSQL has no schema”: it does, just in code; without discipline it becomes a dump of incompatible documents.",
      "Picking NoSQL by fashion and then reinventing joins and transactions in the application.",
      "Using one database for everything or, at the other extreme, five databases for a small system.",
      "Confusing SQL (the language) with relational (the model): distributed relational databases exist (CockroachDB, Spanner).",
    ],
    autoteste: [
      {
        pergunta: "When would you pick Cassandra over Postgres?",
        resposta:
          "Massive, continuous writes, mandatory horizontal scaling and fixed, known access patterns (time series, messages), accepting tunable consistency and fewer ad hoc queries.",
      },
      {
        pergunta: "Why model NoSQL “around the queries”?",
        resposta:
          "Because without joins each query needs a structure that answers it in one read; that is why data is duplicated on purpose.",
      },
    ],
  },
};
