import type { Pergunta } from "../../tipos";

// Q25 · Consistência eventual vs forte
export const q25: Pergunta = {
  numero: 25,
  modulo: "design-de-sistemas",
  metodo: "feynman",
  pt: {
    titulo: "Consistência eventual vs forte",
    pergunta: "Explique a consistência eventual e a forte consistência em sistemas distribuídos.",
    porqueEsteMetodo:
      "A ideia cabe numa imagem (um placar único vs muitos telões). Depois dela, a versão técnica (linearizabilidade, quórum, CAP) e o ponto em que a imagem falha: conflitos de escrita.",
    resposta30s:
      "**Consistência forte**: depois que uma escrita é confirmada, toda leitura vê esse valor (ou mais novo), como se houvesse uma só cópia; custa coordenação, então mais **latência** e menos **disponibilidade** numa partição. **Consistência eventual**: se parar de escrever, as réplicas **convergem**, mas leituras podem ver dado velho; é rápida e disponível. Na prática se escolhe **por operação**: saldo pede forte; curtidas toleram eventual.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Um estádio com um único placar: o árbitro marca o gol e todos olham para o mesmo número (forte). Um estádio com muitos telões: o árbitro avisa e cada telão atualiza em alguns segundos. Por instantes, telões diferentes mostram placares diferentes, mas sem novo gol todos acabam iguais (eventual).",
        tecnico:
          "**Forte (linearizável)**: após o `ack` de uma escrita, toda leitura posterior vê esse valor ou um mais novo. Exige coordenação (líder, consenso, quórum): mais latência e, numa partição de rede, pode ser preciso recusar requisições. **Eventual**: réplicas aceitam leituras e escritas localmente e sincronizam depois; ótimo para latência e disponibilidade. Entre os dois existem garantias intermediárias: read-your-writes, monotonic reads, consistência causal, bounded staleness.",
        limite:
          "No estádio só há um árbitro, então não existe conflito. Em sistemas eventuais, duas réplicas podem aceitar escritas diferentes ao mesmo tempo sobre o mesmo dado, e é preciso **resolver o conflito** (último vence, vector clocks, CRDTs). Esse é o custo oculto.",
      },
      {
        tipo: "tabela",
        colunas: ["", "Forte", "Eventual"],
        linhas: [
          ["Garantia", "Lê sempre o valor mais recente", "Converge se parar de escrever; leitura pode ser velha"],
          ["Latência", "Maior (espera coordenação ou quórum)", "Menor (responde localmente)"],
          ["Numa partição de rede", "Pode recusar para manter a correção (CP)", "Continua respondendo (AP)"],
          [
            "Exemplos",
            "Spanner, etcd/ZooKeeper, líder do Postgres, DynamoDB com leitura forte",
            "DynamoDB padrão, Cassandra (nível ONE), DNS, caches, réplicas de leitura",
          ],
          [
            "Bom para",
            "Saldo bancário, estoque final, locks, eleição de líder",
            "Feed, curtidas, contadores, carrinho, catálogo",
          ],
          ["Custo para o dev", "Menor: raciocínio simples", "Maior: conflitos, leituras velhas, impacto na UX"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Consistência ajustável por quórum",
        legenda: "regra",
        codigo:
          "N = 3 replicas\nW = 2, R = 2   (W + R > N)   -> toda leitura encontra ao menos 1 replica atualizada: forte\nW = 1, R = 1   (W + R <= N)  -> rapido e disponivel, pode ler valor velho: eventual",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "CAP e PACELC",
        texto:
          "Numa **partição** de rede você escolhe entre **C**onsistência e **A**vailability (CAP). **Sem partição**, o PACELC lembra que ainda há troca entre **L**atência e **C**onsistência. Quem decide é a operação, não o sistema inteiro: o saldo pode ser forte e as curtidas, eventuais.",
      },
    ],
    armadilhas: [
      "Confundir o C do CAP (todos veem o mesmo dado) com o C do ACID (respeita as regras).",
      "Entender “eventual” como “inconsistente para sempre”: significa que converge se não houver novas escritas.",
      "Escolher um modelo para o sistema inteiro em vez de por operação.",
      "Ignorar conflitos de escrita em sistemas multilíder ou sem líder.",
      "Ler da réplica logo após escrever e achar que é um bug: é o comportamento esperado.",
    ],
    autoteste: [
      {
        pergunta: "O que significa W + R > N?",
        resposta:
          "Os conjuntos de escrita e de leitura se sobrepõem em ao menos uma réplica, então a leitura enxerga a última escrita confirmada.",
      },
      {
        pergunta: "Dê um dado que exige consistência forte e outro que tolera eventual.",
        resposta: "Forte: saldo bancário, estoque final, lock. Eventual: curtidas, feed, contador de visitas.",
      },
    ],
  },
  en: {
    titulo: "Eventual vs strong consistency",
    pergunta: "Explain eventual consistency and strong consistency in distributed systems.",
    porqueEsteMetodo:
      "The idea fits in one image (a single scoreboard vs many screens). After it comes the technical version (linearizability, quorum, CAP) and the point where the image fails: write conflicts.",
    resposta30s:
      "**Strong consistency**: once a write is acknowledged, every read sees that value (or newer), as if there were one copy; it costs coordination, so more **latency** and less **availability** during a partition. **Eventual consistency**: if writes stop, replicas **converge**, but reads may see stale data; it is fast and available. In practice you choose **per operation**: a balance needs strong; likes tolerate eventual.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "A stadium with a single scoreboard: the referee scores the goal and everyone looks at the same number (strong). A stadium with many screens: the referee signals and each screen updates within seconds. For a moment different screens show different scores, but with no new goal they all end up equal (eventual).",
        tecnico:
          "**Strong (linearizable)**: after a write’s `ack`, every later read sees that value or a newer one. It needs coordination (leader, consensus, quorum): more latency and, in a network partition, requests may have to be refused. **Eventual**: replicas accept reads and writes locally and sync later; great for latency and availability. In between lie intermediate guarantees: read-your-writes, monotonic reads, causal consistency, bounded staleness.",
        limite:
          "In the stadium there is only one referee, so there is no conflict. In eventual systems two replicas can accept different writes to the same data at the same time, and the **conflict must be resolved** (last write wins, vector clocks, CRDTs). That is the hidden cost.",
      },
      {
        tipo: "tabela",
        colunas: ["", "Strong", "Eventual"],
        linhas: [
          ["Guarantee", "Always reads the most recent value", "Converges if writes stop; a read may be stale"],
          ["Latency", "Higher (waits for coordination or quorum)", "Lower (answers locally)"],
          ["During a network partition", "May refuse to stay correct (CP)", "Keeps answering (AP)"],
          [
            "Examples",
            "Spanner, etcd/ZooKeeper, Postgres leader, DynamoDB strong reads",
            "DynamoDB default, Cassandra (ONE level), DNS, caches, read replicas",
          ],
          ["Good for", "Bank balance, final stock, locks, leader election", "Feeds, likes, counters, carts, catalogs"],
          ["Cost for the developer", "Lower: simple reasoning", "Higher: conflicts, stale reads, UX impact"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Tunable consistency via quorum",
        legenda: "rule",
        codigo:
          "N = 3 replicas\nW = 2, R = 2   (W + R > N)   -> every read finds at least 1 up-to-date replica: strong\nW = 1, R = 1   (W + R <= N)  -> fast and available, may read a stale value: eventual",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "CAP and PACELC",
        texto:
          "During a network **partition** you choose between **C**onsistency and **A**vailability (CAP). **Without a partition**, PACELC reminds you there is still a trade-off between **L**atency and **C**onsistency. The operation decides, not the whole system: the balance can be strong and the likes eventual.",
      },
    ],
    armadilhas: [
      "Confusing the C in CAP (everyone sees the same data) with the C in ACID (respects the rules).",
      "Reading “eventual” as “inconsistent forever”: it means it converges if no new writes arrive.",
      "Picking one model for the whole system instead of per operation.",
      "Ignoring write conflicts in multi-leader or leaderless systems.",
      "Reading from a replica right after writing and thinking it is a bug: it is expected behavior.",
    ],
    autoteste: [
      {
        pergunta: "What does W + R > N mean?",
        resposta:
          "The write and read sets overlap in at least one replica, so the read sees the latest acknowledged write.",
      },
      {
        pergunta: "Give data that needs strong consistency and data that tolerates eventual.",
        resposta: "Strong: bank balance, final stock, lock. Eventual: likes, feed, visit counter.",
      },
    ],
  },
};
