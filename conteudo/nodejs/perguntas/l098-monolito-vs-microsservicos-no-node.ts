import type { Pergunta } from "../../tipos";

// L98 · Monolito vs microsserviços
export const l098: Pergunta = {
  numero: 198,
  modulo: "linkedin-arquitetura",
  metodo: "compare",
  pt: {
    titulo: "Monolito vs microsserviços",
    pergunta: "Monolito vs microsserviços no Node.js?",
    porqueEsteMetodo:
      "É um “X vs Y”: a matriz mostra o que muda de um lado para o outro, com o que é específico do Node.js (thread única, ferramentas), e a regra de decisão diz quando separar compensa. A comparação geral está na Q01 do guia de backend.",
    resposta30s:
      "Um **monolito** é uma única unidade implantável; **microsserviços** são vários serviços com deploy e dados próprios, trocando simplicidade operacional por autonomia e escala seletiva. No Node.js, comece por um **monolito modular** (fronteiras claras por módulo; NestJS ou Fastify ajudam) e escale com réplicas; extraia um serviço só quando a dor for medida. Como cada processo tem uma thread de JavaScript, um laço bloqueado derruba o monolito inteiro, mas `worker_threads` ou uma fila costumam resolver sem separar o sistema.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "O que muda de um lado para o outro",
        colunas: ["Aspecto", "Monolito modular", "Microsserviços"],
        linhas: [
          [
            "Deploy e processo",
            "Um artefato e um processo (ou várias réplicas idênticas dele); tudo sobe junto",
            "Cada serviço tem o seu deploy, o seu processo e o seu ritmo",
          ],
          [
            "Escala",
            "Replica a aplicação inteira (sem estado) e, se preciso, usa `cluster` (veja T45); é simples, mas escala tudo junto",
            "Escala só o serviço sob carga, com os recursos dele",
          ],
          [
            "Laço de eventos e falhas",
            "Uma thread de JavaScript por processo: um handler que bloqueia o laço ou um vazamento de memória afeta todos os módulos daquele processo",
            "O problema fica isolado no serviço; os outros seguem de pé, se houver timeout e circuit breaker",
          ],
          [
            "Dados",
            "Um banco; joins e transações simples (veja L95)",
            "Um banco por serviço, no ideal; consistência eventual, saga e outbox",
          ],
          [
            "Comunicação",
            "Chamada de função em memória: rápida e sem falha de rede",
            "Rede: HTTP, gRPC ou mensageria (veja L99); pode ser lenta e falhar",
          ],
          [
            "Custo operacional",
            "Baixo: um pipeline, um log, um depurador",
            "Alto: vários pipelines, observabilidade distribuída, contratos versionados",
          ],
          [
            "Ferramentas em Node.js",
            "NestJS (módulos e injeção de dependência) ou os plugins encapsulados do Fastify ajudam a manter as fronteiras (veja T13)",
            "Cada serviço pode ser pequeno (Fastify, Express); o NestJS também oferece suporte a microsserviços, com vários transportes",
          ],
          [
            "Melhor momento",
            "Produto novo, time pequeno, domínio ainda mudando",
            "Vários times, perfis de carga bem diferentes, domínio estável",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Comece com um **monolito modular** (módulos com interface pública, um só deploy; veja L97) e escale com réplicas. Extraia um serviço quando houver motivo medido: times se atropelando nos deploys, uma parte com perfil de carga muito diferente (WebSockets, trabalho de CPU) ou que exige isolamento de falha, ou ciclos de release incompatíveis. Antes de separar por causa de CPU, avalie `worker_threads` ou uma fila com workers (veja T59 e L77): costuma custar bem menos que um serviço novo.",
      },
      {
        tipo: "fluxo",
        titulo: "Caminho de evolução",
        etapas: [
          "Monolito modular: um deploy, módulos com fronteiras claras e interfaces públicas",
          "Meça: tempo de deploy, conflitos entre times, uso de recursos por módulo, atraso do laço de eventos",
          "Extraia o módulo que dói, trocando a chamada de função por chamada de rede (ou por eventos) na interface que já existia",
          "Separe os dados desse módulo por último e com cuidado, deixando um único dono para cada tabela",
        ],
        nota: "Cada extração custa rede, deploy e observabilidade: pare quando a dor acabar, não quando o monolito desaparecer.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Monolito distribuído e nanosserviços",
        texto:
          "Serviços que só funcionam implantados juntos, que compartilham o mesmo banco ou que dividem uma biblioteca com regra de negócio ficam com a complexidade da rede sem a independência que a justificaria. O mesmo vale para serviços tão pequenos que cada mudança toca vários deles. Para a comparação geral, não limitada ao Node.js, veja a Q01 do guia de backend.",
      },
    ],
    armadilhas: [
      "Escolher microsserviços por moda com um time pequeno: você paga em deploy, observabilidade e rede sem receber o benefício.",
      "Separar serviços que compartilham o mesmo banco ou que precisam ser implantados juntos: é um monolito distribuído.",
      "Encadear chamadas HTTP síncronas entre serviços: as latências somam e as falhas se propagam (veja L99 e L105).",
      "Achar que um monolito Node.js não escala: sem estado em memória, réplicas e `cluster` escalam bem; o limite real é o trabalho de CPU na thread única.",
    ],
    autoteste: [
      {
        pergunta: "O que é um monolito modular e por que começar por ele?",
        resposta:
          "É um único deploy com módulos de fronteiras claras e interface pública. É simples de operar, barato de mudar e deixa os módulos prontos para serem extraídos se um dia for preciso.",
      },
      {
        pergunta: "Cite dois sinais de que vale extrair um serviço.",
        resposta:
          "Times se atropelando nos deploys, ou uma parte com carga e necessidade de escala muito diferentes do resto (ou que precisa de isolamento de falha). Ciclos de release incompatíveis também contam.",
      },
    ],
  },
  en: {
    titulo: "Monolith vs microservices",
    pergunta: "Monolith vs microservices in Node.js?",
    porqueEsteMetodo:
      "It is an “X vs Y”: the matrix shows what changes from one side to the other, including what is specific to Node.js (single thread, tooling), and the decision rule says when splitting pays off. The general comparison is in Q01 of the backend guide.",
    resposta30s:
      "A **monolith** is a single deployable unit; **microservices** are several services with their own deploys and data, trading operational simplicity for autonomy and selective scaling. In Node.js, start with a **modular monolith** (clear boundaries per module; NestJS or Fastify help) and scale with replicas; extract a service only when the pain is measured. Since each process has one JavaScript thread, a blocked loop takes the whole monolith down, but `worker_threads` or a queue usually fix that without splitting the system.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "What changes from one side to the other",
        colunas: ["Aspect", "Modular monolith", "Microservices"],
        linhas: [
          [
            "Deploy and process",
            "One artifact and one process (or several identical replicas of it); everything ships together",
            "Each service has its own deploy, its own process and its own pace",
          ],
          [
            "Scaling",
            "Replicates the whole application (stateless) and, if needed, uses `cluster` (see T45); simple, but scales everything together",
            "Scales only the service under load, with its own resources",
          ],
          [
            "Event loop and failures",
            "One JavaScript thread per process: a handler that blocks the loop or a memory leak affects every module in that process",
            "The problem stays inside the service; the others keep running, if there are timeouts and a circuit breaker",
          ],
          [
            "Data",
            "One database; simple joins and transactions (see L95)",
            "Ideally one database per service; eventual consistency, saga and outbox",
          ],
          [
            "Communication",
            "In-memory function call: fast and with no network failure",
            "Network: HTTP, gRPC or messaging (see L99); can be slow and can fail",
          ],
          [
            "Operational cost",
            "Low: one pipeline, one log, one debugger",
            "High: several pipelines, distributed observability, versioned contracts",
          ],
          [
            "Tooling in Node.js",
            "NestJS (modules and dependency injection) or Fastify’s encapsulated plugins help keep the boundaries (see T13)",
            "Each service can be small (Fastify, Express); NestJS also supports microservices, with several transports",
          ],
          [
            "Best moment",
            "New product, small team, domain still changing",
            "Several teams, very different load profiles, stable domain",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Start with a **modular monolith** (modules with a public interface, a single deploy; see L97) and scale with replicas. Extract a service when there is a measured reason: teams stepping on each other in deploys, a part with a very different load profile (WebSockets, CPU work) or one that needs failure isolation, or incompatible release cycles. Before splitting because of CPU, consider `worker_threads` or a queue with workers (see T59 and L77): it usually costs far less than a new service.",
      },
      {
        tipo: "fluxo",
        titulo: "Path of evolution",
        etapas: [
          "Modular monolith: one deploy, modules with clear boundaries and public interfaces",
          "Measure: deploy time, conflicts between teams, resource use per module, event loop delay",
          "Extract the module that hurts, replacing the function call with a network call (or events) at the interface that already existed",
          "Split that module’s data last and carefully, leaving a single owner for each table",
        ],
        nota: "Each extraction costs network, deploys and observability: stop when the pain is gone, not when the monolith has disappeared.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Distributed monolith and nanoservices",
        texto:
          "Services that only work when deployed together, that share the same database or that share a library holding business rules end up with the complexity of the network without the independence that would justify it. The same goes for services so small that every change touches several of them. For the general comparison, not limited to Node.js, see Q01 of the backend guide.",
      },
    ],
    armadilhas: [
      "Choosing microservices because they are fashionable with a small team: you pay in deploys, observability and network without getting the benefit.",
      "Splitting services that share the same database or must be deployed together: that is a distributed monolith.",
      "Chaining synchronous HTTP calls between services: latencies add up and failures spread (see L99 and L105).",
      "Thinking a Node.js monolith cannot scale: with no in-memory state, replicas and `cluster` scale well; the real limit is CPU work on the single thread.",
    ],
    autoteste: [
      {
        pergunta: "What is a modular monolith and why start with it?",
        resposta:
          "It is a single deploy with modules that have clear boundaries and a public interface. It is simple to operate, cheap to change and leaves the modules ready to be extracted if that ever becomes necessary.",
      },
      {
        pergunta: "Name two signs that it is worth extracting a service.",
        resposta:
          "Teams stepping on each other in deploys, or a part with a load and scaling need very different from the rest (or one that needs failure isolation). Incompatible release cycles count too.",
      },
    ],
  },
};
