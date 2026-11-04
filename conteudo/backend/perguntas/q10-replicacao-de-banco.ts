import type { Pergunta } from "../../tipos";

// Q10 · Replicação de banco
export const q10: Pergunta = {
  numero: 10,
  modulo: "bancos-de-dados",
  metodo: "whys",
  pt: {
    titulo: "Replicação de banco",
    pergunta: "O que é replicação de banco de dados e por que ela é útil?",
    porqueEsteMetodo:
      "“Por que ela é útil” é literalmente uma cadeia de porquês: cada benefício nasce de um problema do servidor único, e cada custo nasce do benefício.",
    resposta30s:
      "Replicação mantém **cópias do mesmo dado em vários nós** (tipicamente um líder que recebe escritas e seguidores que as repetem). Serve para **disponibilidade** (failover quando o líder cai), **durabilidade**, **escala de leitura** e **latência** (réplica perto do usuário). O preço é o **atraso de replicação**: ler de uma réplica pode devolver dado velho. Replicação não é backup.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que replicar?",
            resposta:
              "Porque um único servidor é ponto único de falha: se ele cai, o serviço cai e, se o disco morre, o dado se perde.",
          },
          {
            pergunta: "Por que um backup não resolve?",
            resposta:
              "Restaurar um backup leva minutos a horas e perde o que aconteceu desde ele. Uma réplica já está pronta e quase atualizada: o failover leva segundos (RTO e RPO baixos).",
          },
          {
            pergunta: "Por que isso também melhora o desempenho?",
            resposta:
              "Em geral há muito mais leituras que escritas. As réplicas respondem as leituras e o líder fica só com as escritas: escala horizontal de leitura. Réplicas em outras regiões encurtam a distância até o usuário.",
          },
          {
            pergunta: "Por que isso cria um problema novo?",
            resposta:
              "Porque copiar leva tempo (replication lag). Você grava no líder, lê da réplica e não vê sua própria escrita; duas réplicas podem mostrar valores diferentes por instantes.",
          },
          {
            pergunta: "Por que então é uma escolha de trade-off?",
            resposta:
              "Replicação síncrona dá mais consistência e durabilidade, mas aumenta a latência e a dependência de cada réplica. A assíncrona é rápida e disponível, mas pode perder as últimas escritas num failover.",
          },
        ],
        causaRaiz:
          "Replicação compra **disponibilidade, durabilidade e escala de leitura**, e cobra **consistência e complexidade operacional**.",
      },
      {
        tipo: "tabela",
        titulo: "Modelos de topologia",
        colunas: ["Modelo", "Como funciona", "Prós e contras"],
        linhas: [
          [
            "Líder–seguidor",
            "Escritas só no líder; seguidores copiam o log (WAL/binlog)",
            "Simples e o mais comum; escrita não escala; failover exige promoção",
          ],
          [
            "Multilíder",
            "Vários nós aceitam escrita e trocam as alterações",
            "Escrita em várias regiões; exige resolver conflitos",
          ],
          [
            "Sem líder (quórum)",
            "Escreve em W nós e lê de R nós, com R + W > N (Dynamo, Cassandra)",
            "Muito disponível; consistência ajustável; reparo e conflitos",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Síncrona vs assíncrona",
        colunas: ["Tipo", "Líder confirma quando…", "Efeito"],
        linhas: [
          ["Síncrona", "a réplica já gravou", "Sem perda de dados; mais lenta; uma réplica fora pode travar escritas"],
          ["Assíncrona", "ele mesmo gravou", "Rápida; pode perder as últimas escritas num failover; atraso de leitura"],
          ["Semi-síncrona", "ao menos uma réplica gravou", "Meio-termo: durabilidade sem depender de todas"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Como lidar com o atraso",
        texto:
          "Leia do líder logo após escrever (ou por alguns segundos), use “read-your-writes” por sessão (posição do log ou timestamp) e deixe relatórios e buscas tolerarem dado de segundos atrás.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Replicação não é backup",
        texto:
          "Um `DROP TABLE` ou um `UPDATE` sem `WHERE` é replicado em segundos para todas as cópias. Backups e recuperação em ponto no tempo (PITR) continuam necessários.",
      },
    ],
    armadilhas: [
      "Tratar a réplica de leitura como se estivesse sempre atualizada.",
      "Failover automático sem quórum e sem fencing: dois nós se julgam líderes (split-brain) e gravam dados divergentes.",
      "Confundir replicação (copiar tudo) com sharding (dividir os dados entre nós).",
      "Monitorar só o CPU da réplica e não o atraso de replicação.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre replicação e sharding?",
        resposta:
          "Replicação copia o mesmo dado em vários nós (disponibilidade e leitura); sharding divide o dado entre nós (escala de escrita e de volume).",
      },
      {
        pergunta: "O que é split-brain?",
        resposta:
          "Quando, após uma partição de rede, dois nós se consideram o líder e aceitam escritas divergentes. Evita-se com quórum e fencing.",
      },
    ],
  },
  en: {
    titulo: "Database replication",
    pergunta: "What is database replication and why is it useful?",
    porqueEsteMetodo:
      "“Why is it useful” is literally a chain of whys: each benefit stems from a single-server problem, and each cost stems from the benefit.",
    resposta30s:
      "Replication keeps **copies of the same data on several nodes** (typically a leader that takes writes and followers that replay them). It serves **availability** (failover when the leader dies), **durability**, **read scaling** and **latency** (a replica near the user). The price is **replication lag**: reading from a replica can return stale data. Replication is not backup.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why replicate?",
            resposta:
              "Because a single server is a single point of failure: if it goes down the service goes down, and if the disk dies the data is lost.",
          },
          {
            pergunta: "Why does a backup not solve it?",
            resposta:
              "Restoring a backup takes minutes to hours and loses what happened since. A replica is already running and nearly current: failover takes seconds (low RTO and RPO).",
          },
          {
            pergunta: "Why does it also improve performance?",
            resposta:
              "There are usually far more reads than writes. Replicas answer the reads and the leader keeps only writes: horizontal read scaling. Replicas in other regions shorten the distance to users.",
          },
          {
            pergunta: "Why does that create a new problem?",
            resposta:
              "Because copying takes time (replication lag). You write to the leader, read from a replica and do not see your own write; two replicas can show different values for moments.",
          },
          {
            pergunta: "Why is it then a trade-off?",
            resposta:
              "Synchronous replication gives more consistency and durability but adds latency and a dependency on each replica. Asynchronous is fast and available but can lose the latest writes on failover.",
          },
        ],
        causaRaiz:
          "Replication buys **availability, durability and read scaling**, and charges **consistency and operational complexity**.",
      },
      {
        tipo: "tabela",
        titulo: "Topology models",
        colunas: ["Model", "How it works", "Pros and cons"],
        linhas: [
          [
            "Leader–follower",
            "Writes only on the leader; followers copy the log (WAL/binlog)",
            "Simple and the most common; writes do not scale; failover needs promotion",
          ],
          [
            "Multi-leader",
            "Several nodes accept writes and exchange changes",
            "Writes in several regions; requires conflict resolution",
          ],
          [
            "Leaderless (quorum)",
            "Write to W nodes and read from R nodes, with R + W > N (Dynamo, Cassandra)",
            "Highly available; tunable consistency; repair and conflicts",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Synchronous vs asynchronous",
        colunas: ["Type", "Leader confirms when…", "Effect"],
        linhas: [
          ["Synchronous", "the replica has written", "No data loss; slower; a down replica can block writes"],
          ["Asynchronous", "it has written itself", "Fast; may lose latest writes on failover; read lag"],
          [
            "Semi-synchronous",
            "at least one replica has written",
            "Middle ground: durability without depending on all",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Handling the lag",
        texto:
          "Read from the leader right after writing (or for a few seconds), use per-session “read-your-writes” (log position or timestamp) and let reports and searches tolerate seconds-old data.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Replication is not backup",
        texto:
          "A `DROP TABLE` or an `UPDATE` without `WHERE` is replicated to every copy within seconds. Backups and point-in-time recovery (PITR) are still required.",
      },
    ],
    armadilhas: [
      "Treating the read replica as if it were always current.",
      "Automatic failover without quorum and fencing: two nodes believe they are leader (split-brain) and write divergent data.",
      "Confusing replication (copy everything) with sharding (split data across nodes).",
      "Monitoring only the replica’s CPU and not its replication lag.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between replication and sharding?",
        resposta:
          "Replication copies the same data to several nodes (availability and reads); sharding splits the data across nodes (write and volume scaling).",
      },
      {
        pergunta: "What is split-brain?",
        resposta:
          "When, after a network partition, two nodes consider themselves the leader and accept divergent writes. It is avoided with quorum and fencing.",
      },
    ],
  },
};
