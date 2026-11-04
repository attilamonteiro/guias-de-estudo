import type { Pergunta } from "../../tipos";

// Q01 · Monolito vs microserviços
export const q01: Pergunta = {
  numero: 1,
  modulo: "arquitetura",
  metodo: "compare",
  pt: {
    titulo: "Monolito vs microserviços",
    pergunta: "Qual é a diferença entre arquitetura monolítica e arquitetura de microserviços?",
    porqueEsteMetodo:
      "É um “X vs Y”: a matriz mostra as diferenças lado a lado e a regra de decisão diz quando cada lado compensa, que é o que a entrevista realmente testa.",
    resposta30s:
      "Monolito é **uma única unidade implantável** com todos os módulos; microserviços são **vários serviços pequenos, com deploy e dados independentes**. Troca-se simplicidade operacional por autonomia de times e escala seletiva. Regra prática: comece com um **monolito modular** e só separe quando a dor (times se atropelando, escala muito desigual, deploys lentos) for real e medida.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspecto", "Monolito", "Microserviços"],
        linhas: [
          ["Deploy", "Um artefato; tudo sobe junto", "Cada serviço sobe sozinho, no seu ritmo"],
          [
            "Código e times",
            "Uma base de código; todos mexem nela",
            "Fronteiras por domínio; cada time é dono de um serviço",
          ],
          [
            "Dados",
            "Um banco compartilhado; joins e transações ACID simples",
            "Um banco por serviço (idealmente); sem joins entre serviços",
          ],
          ["Escala", "Replica a aplicação inteira, mesmo que só um módulo precise", "Escala só o serviço sob carga"],
          [
            "Comunicação",
            "Chamada de função em memória (rápida, não falha)",
            "Rede: HTTP/gRPC/mensageria (mais lenta, pode falhar)",
          ],
          ["Falhas", "Um bug grave pode derrubar tudo", "Falha isolada, se houver timeout, retry e circuit breaker"],
          ["Consistência", "Uma transação resolve", "Consistência eventual, sagas, idempotência"],
          [
            "Custo operacional",
            "Baixo: um pipeline, um log, um debug",
            "Alto: orquestração, observabilidade distribuída, contratos versionados",
          ],
          [
            "Melhor momento",
            "Produto novo, time pequeno, domínio ainda mudando",
            "Muitos times, perfis de escala distintos, domínio estável",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Comece com um **monolito modular** (módulos com fronteiras claras dentro de um só deploy). Extraia um serviço quando houver motivo medido: times se atropelando nos deploys, uma parte que precisa escalar muito mais que o resto, ou requisitos de isolamento/tecnologia diferentes. A arquitetura acaba espelhando a organização (Lei de Conway): com 5 pessoas, 20 microserviços são custo, não benefício.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Monolito distribuído",
        texto:
          "Serviços que só funcionam se implantados juntos, ou que dividem o mesmo banco, juntam o pior dos dois mundos: a latência e a complexidade de rede dos microserviços sem a independência que os justificaria.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "A conta que o hype esconde",
        texto:
          "Disponibilidades se multiplicam: 5 serviços com 99,9% chamados em cadeia dão 0,999⁵ ≈ 99,5%, cerca de 44 h/ano fora do ar contra 8,8 h de um único serviço.",
      },
    ],
    armadilhas: [
      "Escolher microserviços pelo hype (“a Netflix usa”) com um time de poucas pessoas.",
      "Dividir por camada técnica (um serviço “de banco”) em vez de por capacidade de negócio.",
      "Cadeias de chamadas síncronas entre serviços: latência e falhas se acumulam.",
      "Serviços que compartilham tabelas: acoplamento escondido que impede deploy independente.",
    ],
    autoteste: [
      {
        pergunta: "Por que 5 serviços a 99,9% chamados em cadeia não dão 99,9%?",
        resposta:
          "As disponibilidades se multiplicam: 0,999⁵ ≈ 99,5%, cerca de 44 horas de indisponibilidade por ano em vez de 8,8.",
      },
      {
        pergunta: "Quando você extrairia o primeiro serviço de um monolito?",
        resposta:
          "Quando houver dor medida: times bloqueando os deploys uns dos outros, uma parte com escala muito diferente, ou necessidade de isolar falha ou tecnologia. Não antes.",
      },
    ],
  },
  en: {
    titulo: "Monolith vs microservices",
    pergunta: "What is the difference between monolithic and microservices architecture?",
    porqueEsteMetodo:
      "It is an “X vs Y” question: the matrix shows the differences side by side and the decision rule says when each side pays off, which is what an interview really tests.",
    resposta30s:
      "A monolith is **one deployable unit** holding every module; microservices are **many small services with independent deploys and data**. You trade operational simplicity for team autonomy and selective scaling. Rule of thumb: start with a **modular monolith** and split only when the pain (teams colliding, very uneven scaling, slow deploys) is real and measured.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspect", "Monolith", "Microservices"],
        linhas: [
          ["Deploy", "One artifact; everything ships together", "Each service ships alone, at its own pace"],
          ["Code and teams", "One codebase; everyone edits it", "Domain boundaries; each team owns a service"],
          [
            "Data",
            "One shared database; joins and simple ACID transactions",
            "A database per service (ideally); no cross-service joins",
          ],
          ["Scaling", "Replicates the whole app even if one module needs it", "Scales only the service under load"],
          [
            "Communication",
            "In-memory function call (fast, cannot fail)",
            "Network: HTTP/gRPC/messaging (slower, can fail)",
          ],
          [
            "Failures",
            "One serious bug can take everything down",
            "Isolated failure, if timeouts, retries and circuit breakers exist",
          ],
          ["Consistency", "One transaction solves it", "Eventual consistency, sagas, idempotency"],
          [
            "Operational cost",
            "Low: one pipeline, one log, one debugger",
            "High: orchestration, distributed observability, versioned contracts",
          ],
          [
            "Best moment",
            "New product, small team, domain still changing",
            "Many teams, distinct scaling profiles, stable domain",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Start with a **modular monolith** (modules with clear boundaries inside one deploy). Extract a service when there is a measured reason: teams colliding on deploys, one part that must scale far more than the rest, or different isolation/technology needs. Architecture ends up mirroring the organization (Conway’s Law): with 5 people, 20 microservices are a cost, not a benefit.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Distributed monolith",
        texto:
          "Services that only work when deployed together, or that share one database, combine the worst of both worlds: the latency and network complexity of microservices without the independence that would justify them.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "The math hype hides",
        texto:
          "Availabilities multiply: 5 services at 99.9% called in a chain give 0.999⁵ ≈ 99.5%, about 44 h/year of downtime versus 8.8 h for a single service.",
      },
    ],
    armadilhas: [
      "Choosing microservices because of hype (“Netflix does it”) with a handful of engineers.",
      "Splitting by technical layer (a “database service”) instead of by business capability.",
      "Chains of synchronous calls between services: latency and failures accumulate.",
      "Services that share tables: hidden coupling that blocks independent deploys.",
    ],
    autoteste: [
      {
        pergunta: "Why do 5 services at 99.9% called in a chain not give 99.9%?",
        resposta: "Availabilities multiply: 0.999⁵ ≈ 99.5%, roughly 44 hours of downtime a year instead of 8.8.",
      },
      {
        pergunta: "When would you extract the first service from a monolith?",
        resposta:
          "When there is measured pain: teams blocking each other’s deploys, one part with very different scaling, or a need to isolate failure or technology. Not before.",
      },
    ],
  },
};
