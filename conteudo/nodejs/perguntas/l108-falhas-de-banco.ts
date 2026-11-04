import type { Pergunta } from "../../tipos";

// L108 · Falhas de banco
export const l108: Pergunta = {
  numero: 208,
  modulo: "linkedin-arquitetura",
  metodo: "playbook",
  pt: {
    titulo: "Falhas de banco",
    pergunta: "Como você lidaria com falhas de banco de dados?",
    porqueEsteMetodo:
      "Falha de banco não se improvisa no meio do incidente. Um playbook organiza, em ordem, o que se prepara antes (timeouts, failover, backup) e o que a aplicação faz durante a falha.",
    resposta30s:
      "Planeje a falha antes dela: **timeouts** em conexões e consultas, **retentativas** só para erros transitórios (com backoff e jitter), **circuit breaker** e limite de concorrência para proteger o banco, e **degradação** controlada (cache, réplicas de leitura, fila para escritas que podem esperar). Tenha **failover**, **backups com restauração testada** (RPO e RTO definidos) e **alertas** de conexões, latência e atraso de replicação. Nunca invente sucesso: escritas críticas falham de forma clara ou entram numa fila idempotente.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: o banco falhou",
        passos: [
          {
            titulo: "Limite o dano com timeouts",
            texto:
              "Defina timeout de conexão, de espera no pool e de consulta (`statement_timeout`, no PostgreSQL). O critério é falhar rápido em vez de empilhar requisições esperando um banco que não responde (veja L93).",
          },
          {
            titulo: "Retente só o que é seguro",
            texto:
              "Erros transitórios (conexão perdida, deadlock, falha de serialização) permitem repetir a transação inteira, com backoff, jitter e poucas tentativas (veja L105). Escrita só se repete se for idempotente ou se a transação anterior foi desfeita por completo.",
          },
          {
            titulo: "Proteja o banco com circuit breaker e limites",
            texto:
              "Se o banco está falhando, mais tráfego só atrasa a recuperação. Abra o circuito, limite a concorrência e recuse rápido com `503` e `Retry-After`, em vez de aceitar tudo e acumular.",
          },
          {
            titulo: "Degrade com elegância",
            texto:
              "Sirva leituras do cache ou de uma réplica (dado um pouco velho), desligue recursos não essenciais, entre em modo somente leitura e enfileire escritas que podem esperar, com idempotência, respondendo `202`. Decida isso por rota, antes da falha.",
          },
          {
            titulo: "Tenha réplicas e failover",
            texto:
              "Uma primária com réplica(s) e failover automático (por serviço gerenciado ou ferramenta de alta disponibilidade). A aplicação precisa reconectar ao novo destino e tolerar a janela de transição. Com replicação assíncrona, a réplica tem atraso (lag): leitura que precisa estar atualizada vai à primária.",
          },
          {
            titulo: "Faça backup e ensaie a restauração",
            texto:
              "Backups automáticos e recuperação até um ponto no tempo (PITR). Defina o RPO (quanto dado se aceita perder) e o RTO (quanto tempo se aceita ficar fora). O sinal de acerto é ter restaurado de verdade e medido o tempo.",
          },
          {
            titulo: "Observe e alerte",
            texto:
              "Conexões em uso e esperando, latência das consultas, taxa de erro, locks e deadlocks, atraso de replicação e espaço em disco. Alerte antes do limite, mantenha um runbook e ensaie a falha de tempos em tempos.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Pool que falha rápido (node-postgres)",
        legenda: "JavaScript",
        codigo: [
          'import pg from "pg";',
          "",
          "const pool = new pg.Pool({",
          "  connectionString: process.env.DATABASE_URL,",
          "  max: 10,",
          "  connectionTimeoutMillis: 2000, // não espera para sempre por uma conexão",
          "  idleTimeoutMillis: 30000,",
          "  statement_timeout: 5000, // o banco aborta consultas longas",
          "});",
          "",
          "// sem este ouvinte, o erro de uma conexão ociosa derruba o processo",
          'pool.on("error", (erro) => console.error("erro em conexão ociosa", erro));',
        ].join("\n"),
        nota: "Os nomes seguem o `pg` (node-postgres); outros drivers têm opções equivalentes. Confira a documentação do seu.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decida o que degradar antes da falha",
        texto:
          "A resposta muda por operação. **Leitura** pode ir ao cache ou à réplica, com dado um pouco velho. **Escrita crítica** (pagamento, pedido) deve **falhar de forma clara** ou entrar numa fila idempotente com resposta “em processamento”, e nunca fingir sucesso. Escreva essa tabela de decisões e teste-a: um banco que cai com a aplicação despreparada vira uma queda geral.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Failover não é invisível, e réplica não é cópia exata",
        texto:
          "Num failover, as conexões e as transações em andamento se perdem, e com replicação assíncrona as últimas escritas podem não ter chegado à nova primária. Retentativa sem limite contra um banco que se recupera o derruba de novo. E uma réplica lê dado atrasado: leitura logo após uma escrita pode vir velha.",
      },
    ],
    armadilhas: [
      "Não ter timeout no pool nem nas consultas: a lentidão do banco empilha requisições até a aplicação cair junto.",
      "Retentar sem limite quando o banco está se recuperando: o tráfego de retentativas atrasa a volta.",
      "Tratar a réplica como cópia exata: com replicação assíncrona há atraso, e um failover pode perder as últimas escritas.",
      "Ter backup e nunca ter restaurado: só se sabe que ele funciona quando a restauração é ensaiada e o tempo medido.",
    ],
    autoteste: [
      {
        pergunta: "O que muda entre retentar uma leitura e retentar uma escrita?",
        resposta:
          "A leitura pode ser repetida com segurança. A escrita só se for idempotente ou se a tentativa anterior foi desfeita por completo; senão, repetir duplica o efeito caso a primeira tentativa tenha chegado a gravar.",
      },
      {
        pergunta: "O que são RPO e RTO?",
        resposta:
          "RPO é quanto dado você aceita perder, a distância entre a última gravação preservada e a falha. RTO é quanto tempo você aceita ficar fora do ar até restabelecer o serviço.",
      },
    ],
  },
  en: {
    titulo: "Database failures",
    pergunta: "How would you handle database failures?",
    porqueEsteMetodo:
      "A database failure is not something to improvise mid-incident. A playbook puts in order what you prepare ahead (timeouts, failover, backups) and what the application does during the failure.",
    resposta30s:
      "Plan for failure before it happens: **timeouts** on connections and queries, **retries** only for transient errors (with backoff and jitter), a **circuit breaker** and a concurrency limit to protect the database, and controlled **degradation** (cache, read replicas, a queue for writes that can wait). Have **failover**, **backups with a tested restore** (RPO and RTO defined) and **alerts** on connections, latency and replication lag. Never fake success: critical writes fail clearly or go into an idempotent queue.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: the database failed",
        passos: [
          {
            titulo: "Limit the damage with timeouts",
            texto:
              "Set a connection timeout, a pool wait timeout and a query timeout (`statement_timeout`, in PostgreSQL). The criterion is to fail fast instead of stacking requests waiting for a database that does not answer (see L93).",
          },
          {
            titulo: "Retry only what is safe",
            texto:
              "Transient errors (lost connection, deadlock, serialization failure) allow repeating the whole transaction, with backoff, jitter and few attempts (see L105). A write is only repeated if it is idempotent or the previous transaction was fully rolled back.",
          },
          {
            titulo: "Protect the database with a circuit breaker and limits",
            texto:
              "If the database is failing, more traffic only delays recovery. Open the circuit, limit concurrency and refuse quickly with `503` and `Retry-After`, instead of accepting everything and piling up.",
          },
          {
            titulo: "Degrade gracefully",
            texto:
              "Serve reads from the cache or a replica (slightly stale data), switch off non-essential features, go read-only and queue the writes that can wait, with idempotency, replying `202`. Decide this per route, before the failure.",
          },
          {
            titulo: "Have replicas and failover",
            texto:
              "A primary with replica(s) and automatic failover (through a managed service or a high-availability tool). The application must reconnect to the new target and tolerate the transition window. With asynchronous replication, the replica lags: a read that must be current goes to the primary.",
          },
          {
            titulo: "Back up and rehearse the restore",
            texto:
              "Automated backups and point-in-time recovery (PITR). Define the RPO (how much data you accept losing) and the RTO (how long you accept being down). A sign of success is having actually restored and timed it.",
          },
          {
            titulo: "Observe and alert",
            texto:
              "Connections in use and waiting, query latency, error rate, locks and deadlocks, replication lag and disk space. Alert before the limit, keep a runbook and rehearse the failure from time to time.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A pool that fails fast (node-postgres)",
        legenda: "JavaScript",
        codigo: [
          'import pg from "pg";',
          "",
          "const pool = new pg.Pool({",
          "  connectionString: process.env.DATABASE_URL,",
          "  max: 10,",
          "  connectionTimeoutMillis: 2000, // does not wait forever for a connection",
          "  idleTimeoutMillis: 30000,",
          "  statement_timeout: 5000, // the database aborts long queries",
          "});",
          "",
          "// without this listener, an idle connection error crashes the process",
          'pool.on("error", (error) => console.error("idle connection error", error));',
        ].join("\n"),
        nota: "The names follow `pg` (node-postgres); other drivers have equivalent options. Check the documentation for yours.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decide what to degrade before the failure",
        texto:
          "The answer changes per operation. A **read** can go to the cache or a replica, with slightly stale data. A **critical write** (payment, order) must **fail clearly** or go into an idempotent queue with a “processing” reply, and never pretend to succeed. Write this table of decisions down and test it: a database that fails while the application is unprepared becomes a general outage.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Failover is not invisible, and a replica is not an exact copy",
        texto:
          "In a failover, connections and in-flight transactions are lost, and with asynchronous replication the latest writes may not have reached the new primary. Unlimited retries against a recovering database knock it down again. And a replica reads stale data: a read right after a write may come back old.",
      },
    ],
    armadilhas: [
      "Having no timeout on the pool or the queries: database slowness stacks up requests until the application falls over too.",
      "Retrying with no limit while the database is recovering: retry traffic delays its return.",
      "Treating the replica as an exact copy: with asynchronous replication there is lag, and a failover can lose the latest writes.",
      "Having backups and never having restored one: you only know it works once the restore has been rehearsed and timed.",
    ],
    autoteste: [
      {
        pergunta: "What changes between retrying a read and retrying a write?",
        resposta:
          "A read can be repeated safely. A write only if it is idempotent or the previous attempt was fully rolled back; otherwise repeating duplicates the effect if the first attempt did manage to save.",
      },
      {
        pergunta: "What are RPO and RTO?",
        resposta:
          "RPO is how much data you accept losing, the gap between the last preserved write and the failure. RTO is how long you accept being down until the service is back.",
      },
    ],
  },
};
