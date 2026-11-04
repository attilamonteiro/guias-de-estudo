import type { Pergunta } from "../../tipos";

// R19 · Conexões de banco sob alta carga
export const r19: Pergunta = {
  numero: 119,
  modulo: "roadmap-intermediario",
  metodo: "whys",
  pt: {
    titulo: "Conexões de banco sob alta carga",
    pergunta: "Que estratégias você usaria para gerenciar conexões de banco de dados em um cenário de alta carga?",
    porqueEsteMetodo:
      "A solução (pool) só faz sentido depois de entender por que a conexão é um recurso escasso. A cadeia de porquês constrói a estratégia a partir do problema.",
    resposta30s:
      "A conexão ao banco é **cara e limitada**. Use um **pool de conexões** para reutilizá-las, **dimensione o pool** pelo limite do banco (somando todas as instâncias), **ocupe cada conexão por menos tempo** (queries rápidas, transações curtas), distribua leituras em **réplicas**, e use um **pooler** (PgBouncer, RDS Proxy) quando houver muitas instâncias.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que conexões viram problema sob carga?",
            resposta:
              "Cada conexão é cara: abre um processo ou thread no banco, aloca memória e exige handshake e autenticação. O banco aguenta algumas centenas, não milhares.",
          },
          {
            pergunta: "Por que abrir uma por requisição não funciona?",
            resposta:
              "Porque o custo de abrir e fechar domina o tempo da consulta, e muitas requisições simultâneas esgotam o limite (`max_connections`).",
          },
          {
            pergunta: "Por que um pool resolve?",
            resposta:
              "Ele mantém um conjunto de conexões abertas e as **reutiliza**: a requisição pega uma, usa e devolve. Elimina o custo de abrir e limita o total.",
          },
          {
            pergunta: "Por que o tamanho do pool importa?",
            resposta:
              "Pool pequeno enfileira requisições; grande demais sobrecarrega o banco. Comece pequeno (dezenas) e ajuste por medição. A soma de todas as instâncias não pode passar do limite do banco.",
          },
          {
            pergunta: "Por que ainda é preciso reduzir o tempo de cada conexão?",
            resposta:
              "Quanto menos tempo cada consulta ocupa a conexão, mais requisições o mesmo pool atende: otimize queries, mantenha transações curtas e não segure conexão durante chamadas externas.",
          },
        ],
        causaRaiz: "O recurso escasso é a **conexão**: reutilize (pool), limite e **ocupe por menos tempo**.",
      },
      {
        tipo: "passos",
        titulo: "Táticas complementares",
        passos: [
          {
            titulo: "PgBouncer ou RDS Proxy",
            texto: "Pooler externo que multiplexa muitas conexões de aplicação em poucas conexões reais ao banco.",
          },
          {
            titulo: "Réplicas de leitura",
            texto: "Distribuem as consultas de leitura entre bancos.",
          },
          {
            titulo: "Timeouts e limites",
            texto: "Timeout para obter conexão do pool, `statement_timeout` e fila limitada: falhe rápido.",
          },
          {
            titulo: "Cache",
            texto: "Tira leituras repetidas do banco.",
          },
        ],
      },
    ],
    armadilhas: [
      "Pool por instância sem somar: 50 instâncias × 20 conexões = 1.000 no banco.",
      "Vazar conexões (não devolvê-las ao pool depois de um erro): use `finally`.",
      "Manter transação aberta durante uma chamada HTTP externa.",
      "Aumentar o pool para curar lentidão: costuma piorar.",
    ],
    autoteste: [
      {
        pergunta: "Por que um pool maior nem sempre ajuda?",
        resposta:
          "O banco tem capacidade limitada; mais conexões simultâneas aumentam a contenção e podem deixá-lo mais lento.",
      },
      {
        pergunta: "O que faz um pooler como o PgBouncer?",
        resposta: "Multiplexa muitas conexões de clientes num número pequeno de conexões reais ao banco.",
      },
    ],
  },
  en: {
    titulo: "Database connections under load",
    pergunta: "What strategies would you use to manage database connections in a high-load scenario?",
    porqueEsteMetodo:
      "The solution (a pool) only makes sense after understanding why a connection is a scarce resource. The chain of whys builds the strategy from the problem.",
    resposta30s:
      "A database connection is **expensive and limited**. Use a **connection pool** to reuse them, **size the pool** by the database limit (summing all instances), **hold each connection for less time** (fast queries, short transactions), spread reads across **replicas**, and use a **pooler** (PgBouncer, RDS Proxy) when there are many instances.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why do connections become a problem under load?",
            resposta:
              "Each connection is expensive: it opens a process or thread in the database, allocates memory and needs a handshake and authentication. The database handles a few hundred, not thousands.",
          },
          {
            pergunta: "Why does opening one per request not work?",
            resposta:
              "Because the cost of opening and closing dominates the query time, and many simultaneous requests exhaust the limit (`max_connections`).",
          },
          {
            pergunta: "Why does a pool solve it?",
            resposta:
              "It keeps a set of connections open and **reuses** them: a request takes one, uses it and returns it. It removes the opening cost and caps the total.",
          },
          {
            pergunta: "Why does pool size matter?",
            resposta:
              "A small pool queues requests; too big overloads the database. Start small (tens) and tune by measurement. The sum across all instances cannot exceed the database limit.",
          },
          {
            pergunta: "Why must you still shorten each connection’s hold time?",
            resposta:
              "The less time each query holds the connection, the more requests the same pool serves: optimize queries, keep transactions short and do not hold a connection during external calls.",
          },
        ],
        causaRaiz: "The scarce resource is the **connection**: reuse it (pool), cap it and **hold it for less time**.",
      },
      {
        tipo: "passos",
        titulo: "Complementary tactics",
        passos: [
          {
            titulo: "PgBouncer or RDS Proxy",
            texto:
              "An external pooler that multiplexes many application connections into few real database connections.",
          },
          {
            titulo: "Read replicas",
            texto: "Spread read queries across databases.",
          },
          {
            titulo: "Timeouts and limits",
            texto: "A timeout to get a pooled connection, `statement_timeout` and a bounded queue: fail fast.",
          },
          {
            titulo: "Cache",
            texto: "Takes repeated reads off the database.",
          },
        ],
      },
    ],
    armadilhas: [
      "A pool per instance without summing: 50 instances × 20 connections = 1,000 on the database.",
      "Leaking connections (not returning them to the pool after an error): use `finally`.",
      "Holding a transaction open during an external HTTP call.",
      "Growing the pool to cure slowness: it usually makes things worse.",
    ],
    autoteste: [
      {
        pergunta: "Why does a bigger pool not always help?",
        resposta:
          "The database has limited capacity; more simultaneous connections raise contention and can make it slower.",
      },
      {
        pergunta: "What does a pooler like PgBouncer do?",
        resposta: "It multiplexes many client connections into a small number of real database connections.",
      },
    ],
  },
};
