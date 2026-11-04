import type { Pergunta } from "../../tipos";

// L93 · Conexões de banco
export const l093: Pergunta = {
  numero: 193,
  modulo: "linkedin-arquitetura",
  metodo: "playbook",
  pt: {
    titulo: "Conexões de banco",
    pergunta: "Como você gerencia conexões de banco de dados no Node.js?",
    porqueEsteMetodo:
      "“Como você gerencia…” pede um procedimento. Um playbook dá a ordem (criar o pool uma vez, dimensioná-lo contra o banco, definir timeouts, devolver sempre a conexão, medir) e o sinal que confirma cada passo.",
    resposta30s:
      "Você usa um **pool de conexões** criado **uma vez** por processo e compartilhado, em vez de abrir uma conexão por requisição: o pool reaproveita conexões abertas e limita quantas existem. Dimensione `max × instâncias` abaixo do limite do banco, defina **timeouts** e **devolva sempre a conexão no `finally`**; meça conexões em uso e em espera para flagrar vazamentos.",
    blocos: [
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Pool de conexões, em um parágrafo",
        texto:
          "Um **pool de conexões** é um conjunto de conexões já abertas que a aplicação empresta e devolve. Abrir uma conexão é caro (rede, TLS, autenticação) e o banco limita quantas aceita; o pool reaproveita as abertas e **limita as simultâneas**. Quando todas estão emprestadas, as próximas requisições esperam na fila do pool ou estouram o timeout. O pool protege o banco; ele não aumenta a capacidade dele.",
      },
      {
        tipo: "passos",
        titulo: "Playbook: conexões sob controle",
        passos: [
          {
            titulo: "Crie o pool uma única vez",
            texto:
              "Crie o pool na inicialização do processo e exporte-o para o resto do código; não abra uma conexão por requisição nem crie pools dentro de handlers. Com recarga automática em desenvolvimento, evite criar um pool novo a cada recarga. Sinal de acerto: o número de conexões no banco fica estável sob carga.",
          },
          {
            titulo: "Dimensione contra o limite do banco",
            texto:
              "O banco aceita um número máximo de conexões. O `max` do pool × o número de processos e réplicas precisa caber nele, com folga para migrações, ferramentas de administração e outros serviços. Comece pequeno e aumente medindo: mais conexões simultâneas não deixam o banco mais rápido.",
          },
          {
            titulo: "Defina os timeouts",
            texto:
              "Um tempo máximo para obter uma conexão do pool (`connectionTimeoutMillis` no `pg`), um prazo para fechar conexões ociosas e um limite de duração por consulta no banco (como `statement_timeout` no PostgreSQL). Critério: com o pool cheio, a requisição falha rápido em vez de esperar para sempre.",
          },
          {
            titulo: "Devolva sempre a conexão",
            texto:
              "Para uma consulta isolada, use `pool.query()`, que empresta e devolve sozinho. Quando precisar de um cliente exclusivo (transações, veja L95), chame `release()` num `finally`, para valer também em caso de erro ou de `return` antecipado.",
          },
          {
            titulo: "Trate a queda de conexões",
            texto:
              "Conexões ociosas podem ser derrubadas pelo banco, por um proxy ou pela rede. Registre o evento `error` do pool (no `pg`, sem ele o erro pode derrubar o processo), deixe o pool descartar a conexão ruim e exponha um health check simples, como `SELECT 1`.",
          },
          {
            titulo: "Meça e tenha cuidado ao escalar",
            texto:
              "Acompanhe conexões em uso, ociosas e requisições esperando (no `pg`: `totalCount`, `idleCount` e `waitingCount`), além do tempo de espera por uma conexão. Em serverless ou com muitas instâncias, use pools pequenos e um proxy de conexões (como o PgBouncer ou serviços gerenciados equivalentes) para o banco não enxergar milhares de conexões.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um pool compartilhado e um empréstimo que sempre devolve",
        legenda: "JavaScript",
        codigo: [
          'import pg from "pg"; // npm install pg',
          "",
          "// Um único pool para o processo inteiro: exporte e reutilize",
          "export const pool = new pg.Pool({",
          "  max: 10, // por processo: max × instâncias deve caber no limite do banco",
          "  idleTimeoutMillis: 30_000, // fecha conexões ociosas",
          "  connectionTimeoutMillis: 2_000, // falha rápido se o pool estiver cheio",
          "});",
          'pool.on("error", (erro) => console.error("erro em conexão ociosa", erro)); // sem isto, derruba o processo',
          "",
          "// pool.query() empresta e devolve sozinho; para um cliente exclusivo, SEMPRE devolva no finally",
          "export async function comConexao(trabalho) {",
          "  const client = await pool.connect();",
          "  try {",
          "    return await trabalho(client);",
          "  } finally {",
          "    client.release(); // sem isto, o pool esvazia e as requisições ficam esperando",
          "  }",
          "}",
        ].join("\n"),
        nota: "O `pg` é um driver de PostgreSQL; outros drivers (como o `mysql2`) e os ORMs têm pools equivalentes, com outros nomes de opção. Confira a documentação do seu driver.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Vazamento de conexão: como acontece e como achar",
        texto:
          "Há vazamento quando uma conexão é emprestada e **não volta ao pool**: `release()` esquecido, `return` ou erro antes dele, transação deixada aberta, cursor ou stream não fechado. Sintomas: `idleCount` zerado e `waitingCount` crescendo sem mais tráfego, timeouts ao obter conexão e sessões `idle in transaction` na visão `pg_stat_activity` do PostgreSQL. Previna com um helper que sempre usa `finally` (como `comConexao`), com um limite de tempo para sessões paradas dentro de uma transação (`idle_in_transaction_session_timeout`) e com revisão de código; para achar, registre quem pegou cada conexão e alerte quando a espera passar de um limite.",
      },
    ],
    armadilhas: [
      "Abrir (e fechar) uma conexão por requisição, ou criar um pool novo a cada chamada ou recarga: o banco se afoga em conexões e a vantagem do pool some.",
      "Dimensionar só pelo processo: 10 conexões × 20 instâncias são 200 conexões. Esquecer o limite do banco é a causa clássica de “too many connections”.",
      "Chamar `release()` fora do `finally`: um erro no meio da consulta deixa a conexão presa e, aos poucos, o pool esvazia.",
      "Aumentar o pool para “resolver” lentidão: mais conexões simultâneas sobrecarregam o banco; corrija a consulta lenta.",
    ],
    autoteste: [
      {
        pergunta: "Por que o pool não deve ser criado dentro do handler da requisição?",
        resposta:
          "Cada criação abriria conexões novas e nunca as reaproveitaria, que é justamente o que o pool existe para evitar. Crie-o uma vez, na partida do processo, e compartilhe.",
      },
      {
        pergunta: "Como você percebe que há vazamento de conexões?",
        resposta:
          "`waitingCount` sustentado acima de zero com `idleCount` em zero sem aumento de carga, timeouts ao obter conexão e sessões `idle in transaction` presas em `pg_stat_activity`. Para localizar a origem, registre quem emprestou cada conexão.",
      },
    ],
  },
  en: {
    titulo: "Database connections",
    pergunta: "How do you manage database connections in Node.js?",
    porqueEsteMetodo:
      "“How do you manage…” asks for a procedure. A playbook gives the order (create the pool once, size it against the database, set timeouts, always give the connection back, measure) and the signal that confirms each step.",
    resposta30s:
      "You use a **connection pool** created **once** per process and shared, instead of opening a connection per request: the pool reuses open connections and caps how many exist. Size `max × instances` below the database limit, set **timeouts** and **always release the connection in a `finally`**; measure connections in use and waiting to catch leaks.",
    blocos: [
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A connection pool in one paragraph",
        texto:
          "A **connection pool** is a set of already-open connections that the application borrows and returns. Opening a connection is expensive (network, TLS, authentication) and the database limits how many it accepts; the pool reuses the open ones and **caps the concurrent ones**. When all are borrowed, the next requests wait in the pool’s queue or hit the timeout. The pool protects the database; it does not raise its capacity.",
      },
      {
        tipo: "passos",
        titulo: "Playbook: connections under control",
        passos: [
          {
            titulo: "Create the pool exactly once",
            texto:
              "Create the pool at process startup and export it to the rest of the code; do not open a connection per request or create pools inside handlers. With auto-reload in development, avoid creating a new pool on every reload. Sign of success: the number of connections on the database stays steady under load.",
          },
          {
            titulo: "Size it against the database limit",
            texto:
              "The database accepts a maximum number of connections. The pool’s `max` × the number of processes and replicas must fit under it, leaving room for migrations, admin tools and other services. Start small and raise it by measuring: more simultaneous connections do not make the database faster.",
          },
          {
            titulo: "Set the timeouts",
            texto:
              "A maximum wait to get a connection from the pool (`connectionTimeoutMillis` in `pg`), a time after which idle connections are closed, and a per-query limit on the database side (such as `statement_timeout` in PostgreSQL). Criterion: with the pool full, the request fails fast instead of waiting forever.",
          },
          {
            titulo: "Always give the connection back",
            texto:
              "For a single query, use `pool.query()`, which borrows and returns on its own. When you need an exclusive client (transactions, see L95), call `release()` in a `finally`, so it runs even on an error or an early `return`.",
          },
          {
            titulo: "Handle dropped connections",
            texto:
              "Idle connections can be dropped by the database, a proxy or the network. Register the pool’s `error` event (in `pg`, without it the error can crash the process), let the pool discard the bad connection and expose a simple health check, such as `SELECT 1`.",
          },
          {
            titulo: "Measure, and be careful when scaling out",
            texto:
              "Track connections in use, idle and requests waiting (in `pg`: `totalCount`, `idleCount` and `waitingCount`), plus the time spent waiting for a connection. With serverless or many instances, use small pools and a connection proxy (such as PgBouncer or equivalent managed services) so the database does not see thousands of connections.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A shared pool and a borrow that always returns",
        legenda: "JavaScript",
        codigo: [
          'import pg from "pg"; // npm install pg',
          "",
          "// One pool for the whole process: export it and reuse it",
          "export const pool = new pg.Pool({",
          "  max: 10, // per process: max × instances must fit the database limit",
          "  idleTimeoutMillis: 30_000, // closes idle connections",
          "  connectionTimeoutMillis: 2_000, // fails fast if the pool is full",
          "});",
          'pool.on("error", (error) => console.error("idle connection error", error)); // without this, it crashes the process',
          "",
          "// pool.query() borrows and returns on its own; for an exclusive client, ALWAYS give it back in the finally",
          "export async function withConnection(work) {",
          "  const client = await pool.connect();",
          "  try {",
          "    return await work(client);",
          "  } finally {",
          "    client.release(); // without this, the pool drains and requests keep waiting",
          "  }",
          "}",
        ].join("\n"),
        nota: "`pg` is a PostgreSQL driver; other drivers (such as `mysql2`) and ORMs have equivalent pools, with different option names. Check your driver’s documentation.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Connection leaks: how they happen and how to find them",
        texto:
          "A leak happens when a connection is borrowed and **never goes back to the pool**: a forgotten `release()`, a `return` or error before it, a transaction left open, a cursor or stream not closed. Symptoms: `idleCount` at zero and `waitingCount` growing without more traffic, timeouts when acquiring a connection, and `idle in transaction` sessions in PostgreSQL’s `pg_stat_activity` view. Prevent them with a helper that always uses `finally` (like `withConnection`), a limit on how long a session may sit idle inside a transaction (`idle_in_transaction_session_timeout`) and code review; to find them, record who borrowed each connection and alert when the wait passes a threshold.",
      },
    ],
    armadilhas: [
      "Opening (and closing) a connection per request, or creating a new pool on every call or reload: the database drowns in connections and the pool’s advantage disappears.",
      "Sizing only per process: 10 connections × 20 instances is 200 connections. Forgetting the database limit is the classic cause of “too many connections”.",
      "Calling `release()` outside the `finally`: an error in the middle of a query leaves the connection stuck and, little by little, the pool drains.",
      "Raising the pool size to “fix” slowness: more simultaneous connections overload the database; fix the slow query.",
    ],
    autoteste: [
      {
        pergunta: "Why should the pool not be created inside the request handler?",
        resposta:
          "Each creation would open new connections and never reuse them, which is exactly what a pool exists to avoid. Create it once, at process startup, and share it.",
      },
      {
        pergunta: "How do you tell there is a connection leak?",
        resposta:
          "`waitingCount` staying above zero with `idleCount` at zero and no increase in load, timeouts when acquiring a connection, and `idle in transaction` sessions stuck in `pg_stat_activity`. To find the source, record who borrowed each connection.",
      },
    ],
  },
};
