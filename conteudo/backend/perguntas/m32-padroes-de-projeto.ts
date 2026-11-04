import type { Pergunta } from "../../tipos";

// M32 · Padrões de projeto
export const m32: Pergunta = {
  numero: 232,
  modulo: "mentorcruise",
  metodo: "compare",
  pt: {
    titulo: "Padrões de projeto",
    pergunta:
      "Quais são alguns exemplos de padrões de projeto de software que você costuma usar no desenvolvimento backend?",
    porqueEsteMetodo:
      "Cada padrão resolve um problema diferente e tem um custo. Uma matriz com intenção, exemplo de backend e quando evitar mostra isso lado a lado, e a regra de decisão ensina a escolher, que é o que a entrevista testa.",
    resposta30s:
      "Padrão é **vocabulário para problemas recorrentes**, não meta. No backend aparecem muito: **Repository** (isolar o acesso a dados), **Strategy** (trocar algoritmos), **Adapter** (isolar um SDK ou API externa), **Decorator/middleware** (comportamento em volta), **Factory**, **injeção de dependência** (testabilidade), **eventos/Observer**, **Circuit Breaker** e **Outbox**. Na entrevista, escolha três, diga o **problema** que cada um resolveu, o **resultado** e quando você **não** o usaria. Evite o excesso de engenharia.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Organização do código",
        colunas: ["Padrão", "Intenção", "Exemplo no backend", "Quando evitar"],
        linhas: [
          [
            "Repository",
            "Esconder o acesso a dados atrás de uma interface parecida com uma coleção",
            "`PedidoRepository.buscarPorId()` isola SQL ou ORM da regra de negócio e permite um repositório em memória nos testes",
            "CRUD simples em que o ORM já é a abstração e a camada só repassa chamadas",
          ],
          [
            "Factory",
            "Centralizar a criação de objetos cuja escolha ou montagem é complexa",
            "Criar o cliente de pagamento certo (sandbox ou produção) a partir da configuração; criar uma entidade já validada",
            "Quando um `new` simples basta: fábrica para uma classe só é cerimônia",
          ],
          [
            "Strategy",
            "Trocar um algoritmo atrás de uma interface, em tempo de execução",
            "Calcular frete, desconto ou imposto conforme a regra; escolher o formato de exportação (CSV ou PDF)",
            "Quando existe uma só variação e nada indica outra: um `if` basta",
          ],
          [
            "Decorator / middleware",
            "Acrescentar comportamento em volta de algo sem alterar o seu código",
            "Cadeia de middlewares HTTP (autenticação, log, métricas, limite de taxa); envolver um repositório com cache",
            "Cadeias longas e implícitas: a ordem importa e o fluxo fica difícil de depurar",
          ],
          [
            "Injeção de dependência",
            "Receber as dependências de fora em vez de criá-las por dentro",
            "Passar repositório e cliente de e-mail pelo construtor e trocá-los por dublês nos testes",
            "Contêiner “mágico” em script pequeno; injetar tudo torna o grafo difícil de seguir",
          ],
          [
            "Singleton",
            "Garantir uma única instância com ponto de acesso global",
            "Pool de conexões, configuração carregada uma vez, cliente HTTP compartilhado (de preferência criado uma vez e injetado)",
            "Quando vira estado global escondido: dificulta testes e esconde dependências. É único por processo, não pelo sistema: cada réplica tem o seu",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Integração, eventos e resiliência",
        colunas: ["Padrão", "Intenção", "Exemplo no backend", "Quando evitar"],
        linhas: [
          [
            "Observer / eventos",
            "Avisar interessados sem acoplar quem emite a quem reage",
            "Pedido confirmado dispara e-mail, estoque e nota fiscal por eventos de domínio ou mensageria (veja Q04)",
            "Quando é preciso resposta imediata e ordem estrita; eventos demais escondem o caminho do dado",
          ],
          [
            "Adapter",
            "Traduzir a interface de um componente para a que o seu código espera",
            "Encapsular o SDK de um gateway de pagamento atrás de uma interface sua, como uma camada anticorrupção (veja R30)",
            "Quando a interface externa já é estável e igual à sua: adaptar por adaptar só soma uma camada",
          ],
          [
            "Circuit Breaker",
            "Parar de chamar uma dependência que está falhando, para falhar rápido e permitir a recuperação",
            "Chamadas a serviços de terceiros ou a outros serviços, com fallback (veja M28)",
            "Dependência local e confiável, ou sem política clara do que fazer quando o circuito abre",
          ],
          [
            "Outbox",
            "Gravar o evento na mesma transação do dado e publicá-lo depois, sem perder",
            "Salvar o pedido e a linha de outbox juntos; um processo à parte publica no broker, com consumidores idempotentes (veja Q29)",
            "Quando nada precisa ser publicado, ou quando um simples commit local já resolve",
          ],
          [
            "CQRS",
            "Separar o modelo de escrita do modelo de leitura",
            "Escrever em tabelas normalizadas e ler de uma visão ou projeção pronta para consulta (veja M31)",
            "CRUD comum: dois modelos custam sincronização e consistência eventual sem ganho",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão e como responder",
        texto:
          "**Comece pelo problema, não pelo padrão.** Aplique um padrão quando houver uma dor concreta (dependência difícil de testar, `if` que cresce a cada novo caso, SDK espalhado pelo código), e não porque ele existe. Na resposta, escolha **três** e use a forma problema → padrão → resultado: por exemplo, “o `Repository` isolou o SQL da regra de negócio e permitiu testar com um repositório em memória; o `Strategy` trocou um `if` gigante de cálculo de frete por uma estratégia por transportadora; o `Adapter` deixou o SDK do gateway de pagamento num módulo só”. Troque pelos exemplos que você de fato usou. Se nunca aplicou um padrão de propósito, diga isso e aponte os que já aparecem no seu framework (middleware e injeção de dependência são muito comuns); mostrar que entende o porquê vale mais que uma lista longa.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Excesso de engenharia",
        texto:
          "Padrão sem dor é custo: uma interface com uma única implementação, uma fábrica para uma classe, camadas que só repassam chamadas, abstrações para um futuro que talvez nunca venha. Código simples e direto vence até o problema pedir estrutura. O Singleton merece cuidado extra: costuma ser estado global disfarçado.",
      },
    ],
    armadilhas: [
      "Listar vários nomes de padrão sem dizer qual problema cada um resolveu: parece decoreba.",
      "Aplicar padrão por hábito ou para parecer sofisticado: camadas e interfaces que só aumentam o caminho até o código que importa.",
      "Singleton como atalho para estado compartilhado: acopla tudo, atrapalha os testes e engana quando há várias réplicas.",
      "Confundir padrão com biblioteca ou framework: o padrão é a ideia, que existe independente de nome de classe ou ferramenta.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre Strategy e um `if` com vários casos?",
        resposta:
          "O Strategy põe cada variação atrás de uma interface comum e deixa quem chama escolher (ou receber) a estratégia, então novos casos entram sem mexer no código existente. Com poucos casos estáveis, o `if` é mais simples e basta.",
      },
      {
        pergunta: "Por que o Singleton é um padrão controverso?",
        resposta:
          "Porque vira estado global escondido: dificulta os testes, esconde dependências e exige cuidado com concorrência. Além disso é único por processo, não no sistema inteiro. Uma instância única criada uma vez e injetada resolve a maior parte dos usos.",
      },
      {
        pergunta: "Como responder se pedirem exemplos de padrões que você usa?",
        resposta:
          "Escolha três, diga o problema de cada um, como o padrão o resolveu e quando você não o usaria. Se a experiência for pequena, diga isso e mostre os padrões que seu framework já aplica, como middleware e injeção de dependência.",
      },
    ],
  },
  en: {
    titulo: "Design patterns",
    pergunta: "What are some examples of software design patterns you often use in your backend development?",
    porqueEsteMetodo:
      "Each pattern solves a different problem and has a cost. A matrix with intent, backend example and when to avoid it shows that side by side, and the decision rule teaches how to choose, which is what the interview tests.",
    resposta30s:
      "A pattern is a **vocabulary for recurring problems**, not a goal. In the backend these show up a lot: **Repository** (isolate data access), **Strategy** (swap algorithms), **Adapter** (isolate an SDK or external API), **Decorator/middleware** (behavior around something), **Factory**, **dependency injection** (testability), **events/Observer**, **Circuit Breaker** and **Outbox**. In an interview, pick three, say the **problem** each solved, the **result** and when you would **not** use it. Avoid over-engineering.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Code organization",
        colunas: ["Pattern", "Intent", "Backend example", "When to avoid"],
        linhas: [
          [
            "Repository",
            "Hide data access behind a collection-like interface",
            "`OrderRepository.findById()` isolates SQL or the ORM from business logic and allows an in-memory repository in tests",
            "Simple CRUD where the ORM already is the abstraction and the layer just forwards calls",
          ],
          [
            "Factory",
            "Centralize the creation of objects whose choice or assembly is complex",
            "Create the right payment client (sandbox or production) from configuration; create an already-validated entity",
            "When a plain `new` is enough: a factory for a single class is ceremony",
          ],
          [
            "Strategy",
            "Swap an algorithm behind an interface, at runtime",
            "Compute shipping, discount or tax by rule; choose the export format (CSV or PDF)",
            "When there is one variation and nothing suggests another: an `if` is enough",
          ],
          [
            "Decorator / middleware",
            "Add behavior around something without changing its code",
            "A chain of HTTP middleware (authentication, logging, metrics, rate limiting); wrapping a repository with a cache",
            "Long, implicit chains: order matters and the flow gets hard to debug",
          ],
          [
            "Dependency injection",
            "Receive dependencies from outside instead of creating them inside",
            "Pass the repository and the email client through the constructor and swap them for test doubles",
            "A “magic” container in a small script; injecting everything makes the graph hard to follow",
          ],
          [
            "Singleton",
            "Guarantee a single instance with a global access point",
            "Connection pool, configuration loaded once, a shared HTTP client (preferably created once and injected)",
            "When it becomes hidden global state: it hampers tests and hides dependencies. It is unique per process, not per system: each replica has its own",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Integration, events and resilience",
        colunas: ["Pattern", "Intent", "Backend example", "When to avoid"],
        linhas: [
          [
            "Observer / events",
            "Notify interested parties without coupling the emitter to whoever reacts",
            "A confirmed order triggers email, inventory and invoice through domain events or messaging (see Q04)",
            "When an immediate answer and strict order are needed; too many events hide the data’s path",
          ],
          [
            "Adapter",
            "Translate a component’s interface into the one your code expects",
            "Wrap a payment gateway SDK behind an interface of your own, as an anticorruption layer (see R30)",
            "When the external interface is already stable and equal to yours: adapting for its own sake just adds a layer",
          ],
          [
            "Circuit Breaker",
            "Stop calling a failing dependency, to fail fast and allow recovery",
            "Calls to third-party services or other services, with a fallback (see M28)",
            "A local, reliable dependency, or no clear policy for what to do when the circuit opens",
          ],
          [
            "Outbox",
            "Write the event in the same transaction as the data and publish it later, without loss",
            "Save the order and an outbox row together; a separate process publishes to the broker, with idempotent consumers (see Q29)",
            "When nothing needs to be published, or a plain local commit already solves it",
          ],
          [
            "CQRS",
            "Separate the write model from the read model",
            "Write to normalized tables and read from a view or projection ready for querying (see M31)",
            "Ordinary CRUD: two models cost synchronization and eventual consistency for no gain",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule and how to answer",
        texto:
          "**Start from the problem, not from the pattern.** Apply a pattern when there is a concrete pain (a dependency that is hard to test, an `if` that grows with every new case, an SDK scattered through the code), not because it exists. In the answer, pick **three** and use the form problem → pattern → result: for example, “the `Repository` isolated SQL from business logic and allowed testing with an in-memory repository; the `Strategy` replaced a giant shipping-cost `if` with one strategy per carrier; the `Adapter` kept the payment gateway SDK in a single module”. Swap in the examples you really used. If you never applied a pattern on purpose, say so and point to the ones already present in your framework (middleware and dependency injection are very common); showing that you understand the why is worth more than a long list.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Over-engineering",
        texto:
          "A pattern without pain is a cost: an interface with a single implementation, a factory for one class, layers that merely forward calls, abstractions for a future that may never come. Simple, direct code wins until the problem asks for structure. The Singleton deserves extra care: it is often global state in disguise.",
      },
    ],
    armadilhas: [
      "Listing many pattern names without saying which problem each solved: it sounds memorized.",
      "Applying a pattern out of habit or to look sophisticated: layers and interfaces that only lengthen the path to the code that matters.",
      "Singleton as a shortcut for shared state: it couples everything, hinders tests and misleads when there are several replicas.",
      "Confusing a pattern with a library or framework: the pattern is the idea, which exists regardless of a class or tool name.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between Strategy and an `if` with several cases?",
        resposta:
          "Strategy puts each variation behind a common interface and lets the caller choose (or receive) the strategy, so new cases come in without touching existing code. With a few stable cases, the `if` is simpler and enough.",
      },
      {
        pergunta: "Why is the Singleton a controversial pattern?",
        resposta:
          "Because it becomes hidden global state: it hampers tests, hides dependencies and needs care with concurrency. It is also unique per process, not across the whole system. A single instance created once and injected covers most uses.",
      },
      {
        pergunta: "How do you answer when asked for examples of patterns you use?",
        resposta:
          "Pick three, state each one’s problem, how the pattern solved it and when you would not use it. If your experience is small, say so and show the patterns your framework already applies, such as middleware and dependency injection.",
      },
    ],
  },
};
