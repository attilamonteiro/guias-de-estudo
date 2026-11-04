import type { Pergunta } from "../../tipos";

// R50 · Armazenamento global e altamente disponível
export const r50: Pergunta = {
  numero: 150,
  modulo: "roadmap-avancado",
  metodo: "design",
  pt: {
    titulo: "Armazenamento global e altamente disponível",
    pergunta:
      "Descreva o processo de criar uma solução de armazenamento de dados global e de alta disponibilidade para uma aplicação multinacional.",
    porqueEsteMetodo:
      "Um armazenamento global é um desenho completo com muitos trade-offs (consistência, latência, custo, conformidade). O roteiro de system design organiza as decisões em ordem.",
    resposta30s:
      "Use **várias regiões, cada uma com várias zonas de disponibilidade**, **replique os dados** entre elas, **roteie o usuário** para a região saudável mais próxima (DNS geográfico, anycast, balanceador global) e **escolha a consistência por operação** (forte onde o negócio exige, eventual onde tolera). Mantenha dados **perto de quem os usa** (afinidade e conformidade, como residência de dados) e **teste o failover**. Bancos globais prontos (Spanner, CockroachDB, Cosmos DB, DynamoDB Global Tables, Cassandra) ajudam.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Disponibilidade-alvo (99,99%?), latência por região, consistência (forte ou eventual por operação), RPO e RTO, volume, conformidade (residência de dados: GDPR, LGPD).",
          },
          {
            titulo: "2. Topologia",
            texto:
              "Várias **regiões**, cada uma com várias **zonas**; replicação entre zonas (síncrona, baixa latência) e entre regiões (em geral assíncrona).",
          },
          {
            titulo: "3. Modelo de replicação",
            texto:
              "**Multilíder** (um líder por região), **líder global com réplicas** ou **sem líder (quórum)**; ou bancos globais prontos.",
          },
          {
            titulo: "4. Consistência",
            texto:
              "Forte onde o negócio exige (saldos): o consenso (Paxos/Raft) paga a latência entre regiões. Eventual onde tolera (perfil, catálogo), com resolução de conflitos.",
          },
          {
            titulo: "5. Roteamento",
            texto:
              "DNS geográfico, anycast e balanceadores globais levam o usuário à região mais próxima e saudável; failover automático com health checks.",
          },
          {
            titulo: "6. Particionamento por localidade",
            texto:
              "Os dados de um usuário ficam na sua região de origem (afinidade de dados), para baixa latência e conformidade; sharding por chave.",
          },
          {
            titulo: "7. Falhas e recuperação",
            texto:
              "Failover entre zonas e regiões, backups e PITR em outra região, exercícios de caos e de recuperação (game days).",
          },
          {
            titulo: "8. Governança e custo",
            texto:
              "Criptografia, controle de acesso, residência de dados, observabilidade global e o custo da transferência entre regiões.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "O trade-off central",
        colunas: ["Escolha", "Ganha", "Paga"],
        linhas: [
          [
            "Replicação síncrona entre regiões",
            "RPO ≈ 0 e consistência forte",
            "Latência de escrita alta; menos disponível numa partição",
          ],
          [
            "Replicação assíncrona",
            "Escrita local rápida e alta disponibilidade",
            "Pode perder as últimas escritas num failover; conflitos",
          ],
        ],
      },
    ],
    armadilhas: [
      "Prometer consistência forte global e baixa latência ao mesmo tempo.",
      "Nunca testar o failover.",
      "Esquecer a residência de dados e o custo de transferência.",
      "Uma zona só chamada de “alta disponibilidade”.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre zona de disponibilidade e região?",
        resposta:
          "Zonas são datacenters isolados dentro de uma região (baixa latência entre si); regiões são áreas geográficas distantes, que protegem contra falhas regionais e aproximam o usuário.",
      },
      {
        pergunta: "Por que replicação assíncrona entre regiões?",
        resposta:
          "Para não pagar a latência da distância em cada escrita, aceitando que um failover possa perder as últimas escritas.",
      },
    ],
  },
  en: {
    titulo: "Global high-availability storage",
    pergunta:
      "Describe the process of creating a global, high-availability data storage solution for a multinational application.",
    porqueEsteMetodo:
      "Global storage is a complete design with many trade-offs (consistency, latency, cost, compliance). The system-design script organizes the decisions in order.",
    resposta30s:
      "Use **several regions, each with several availability zones**, **replicate the data** between them, **route the user** to the nearest healthy region (geo DNS, anycast, global load balancer) and **choose consistency per operation** (strong where the business demands it, eventual where it tolerates). Keep data **close to its users** (affinity and compliance, such as data residency) and **test failover**. Ready-made global databases (Spanner, CockroachDB, Cosmos DB, DynamoDB Global Tables, Cassandra) help.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "Availability target (99.99%?), per-region latency, consistency (strong or eventual per operation), RPO and RTO, volume, compliance (data residency: GDPR, LGPD).",
          },
          {
            titulo: "2. Topology",
            texto:
              "Several **regions**, each with several **zones**; replication between zones (synchronous, low latency) and between regions (usually asynchronous).",
          },
          {
            titulo: "3. Replication model",
            texto:
              "**Multi-leader** (one leader per region), **global leader with replicas** or **leaderless (quorum)**; or ready-made global databases.",
          },
          {
            titulo: "4. Consistency",
            texto:
              "Strong where the business demands it (balances): consensus (Paxos/Raft) pays cross-region latency. Eventual where it tolerates (profile, catalog), with conflict resolution.",
          },
          {
            titulo: "5. Routing",
            texto:
              "Geo DNS, anycast and global load balancers send the user to the nearest healthy region; automatic failover with health checks.",
          },
          {
            titulo: "6. Locality partitioning",
            texto:
              "A user’s data lives in their home region (data affinity), for low latency and compliance; sharding by key.",
          },
          {
            titulo: "7. Failure and recovery",
            texto:
              "Failover across zones and regions, backups and PITR in another region, chaos and recovery exercises (game days).",
          },
          {
            titulo: "8. Governance and cost",
            texto:
              "Encryption, access control, data residency, global observability and the cost of cross-region transfer.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "The central trade-off",
        colunas: ["Choice", "Gains", "Pays"],
        linhas: [
          [
            "Synchronous cross-region replication",
            "RPO ≈ 0 and strong consistency",
            "High write latency; less available in a partition",
          ],
          [
            "Asynchronous replication",
            "Fast local writes and high availability",
            "May lose the latest writes on failover; conflicts",
          ],
        ],
      },
    ],
    armadilhas: [
      "Promising global strong consistency and low latency at the same time.",
      "Never testing failover.",
      "Forgetting data residency and transfer cost.",
      "A single zone called “high availability”.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between an availability zone and a region?",
        resposta:
          "Zones are isolated datacenters within a region (low latency between them); regions are distant geographic areas, protecting against regional failures and bringing users closer.",
      },
      {
        pergunta: "Why asynchronous replication between regions?",
        resposta:
          "To avoid paying distance latency on every write, accepting that a failover may lose the latest writes.",
      },
    ],
  },
};
