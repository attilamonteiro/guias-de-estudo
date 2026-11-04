import type { Pergunta } from "../../tipos";

// M07 · Programação orientada a objetos
export const m07: Pergunta = {
  numero: 207,
  modulo: "mentorcruise",
  metodo: "feynman",
  pt: {
    titulo: "Programação orientada a objetos",
    pergunta: "Você pode explicar o que é POO (Programação Orientada a Objetos)?",
    porqueEsteMetodo:
      "POO é um conceito abstrato que se aprende por intuição: uma analogia do dia a dia ancora os quatro pilares, e o ponto em que ela falha (herança profunda, estado mutável) é onde a entrevista costuma aprofundar.",
    resposta30s:
      "POO organiza o código em torno de **objetos**: unidades que juntam **estado** (dados) e **comportamento** (métodos) atrás de uma interface. Os quatro pilares são **encapsulamento**, **abstração**, **herança** e **polimorfismo**. No backend aparece em serviços, repositórios e entidades de domínio, e a prática atual prefere **composição sobre herança** e depender de interfaces (ideias do **SOLID**). Não é o único paradigma: o funcional e o procedural resolvem os mesmos problemas com outras trocas.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Uma locadora de veículos. Cada veículo guarda o seu próprio estado (quilometragem, nível do tanque) e sabe fazer coisas (acelerar, frear). O cliente não abre o capô: usa volante e pedais, a interface. Esses mesmos controles servem para um carro a diesel ou um elétrico, e o balcão só pede “um veículo da categoria média”, sem saber qual será entregue. Veículos da mesma família reaproveitam um projeto-base e cada modelo acrescenta o que é seu.",
        tecnico:
          "O veículo é o **objeto**: estado mais comportamento. O capô fechado é o **encapsulamento**: o estado só muda por métodos que garantem as regras. Pedir “um veículo da categoria média” é **abstração**: depender do que o objeto faz, não de como faz. O projeto-base reaproveitado é a **herança**. Dirigir qualquer modelo com os mesmos controles é o **polimorfismo**: a mesma chamada, comportamentos diferentes conforme o objeto real. Em backend, o “veículo” pode ser uma conta, um pedido ou um meio de pagamento, e o “cliente” é o código que o usa.",
        limite:
          "Na locadora, empilhar categorias (esportivo, conversível, elétrico, esportivo elétrico…) parece natural; em código, hierarquias profundas viram um emaranhado em que mudar a base quebra as filhas. Na vida real você monta um veículo combinando peças (motor, câmbio), e é isso que a composição faz. Além disso, objetos em memória não se persistem sozinhos: um banco relacional não guarda objetos, guarda linhas, e a ponte entre os dois (ORM) tem custo próprio.",
      },
      {
        tipo: "tabela",
        titulo: "Os quatro pilares",
        colunas: ["Pilar", "Ideia", "Exemplo de backend", "O que previne"],
        linhas: [
          [
            "Encapsulamento",
            "Estado privado; só muda por métodos que protegem as regras",
            "`Conta` expõe `sacar(valor)` e não deixa mexer em `saldo` direto; a regra “saldo não fica negativo” mora em um só lugar",
            "Estado inválido e a mesma regra repetida pelo código",
          ],
          [
            "Abstração",
            "Mostrar o que o objeto faz e esconder como faz",
            "`RepositorioDeUsuarios.buscarPorId(id)`: quem chama não sabe se por trás há Postgres, cache ou memória",
            "Acoplamento a detalhes; trocar o banco vira reescrita",
          ],
          [
            "Herança",
            "Um tipo reaproveita e especializa outro (relação “é um”)",
            "Um `ErroDeNegocio` base, com `SaldoInsuficiente` e `PedidoNaoEncontrado` especializando e sendo traduzidos em respostas 4xx",
            "Repetição de código; em troca, cria acoplamento forte com a classe-base",
          ],
          [
            "Polimorfismo",
            "Mesma chamada, comportamento conforme o objeto real",
            "`meio.cobrar(valor)` funciona para cartão, Pix ou boleto sem um `if` por tipo",
            "Cadeias de `if`/`switch` por tipo que crescem a cada caso novo",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Polimorfismo e composição em um checkout",
        legenda: "typescript",
        codigo:
          "interface MeioDePagamento {\n  cobrar(valorEmCentavos: number): Promise<string>; // devolve o id da cobrança\n}\n\nclass PagamentoComCartao implements MeioDePagamento {\n  constructor(private readonly gateway: GatewayDeCartao) {}\n  async cobrar(valorEmCentavos: number) {\n    return this.gateway.autorizar(valorEmCentavos);\n  }\n}\n\nclass PagamentoComPix implements MeioDePagamento {\n  async cobrar(valorEmCentavos: number) {\n    return gerarCobrancaPix(valorEmCentavos);\n  }\n}\n\n// O serviço recebe a interface, não uma classe concreta\nclass Checkout {\n  constructor(private readonly meio: MeioDePagamento) {}\n  finalizar(pedido: Pedido) {\n    return this.meio.cobrar(pedido.totalEmCentavos);\n  }\n}",
        nota: "`GatewayDeCartao`, `Pedido` e `gerarCobrancaPix` são suposições do exemplo. Para testar o `Checkout`, basta passar um meio de pagamento falso que implemente a mesma interface.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Composição sobre herança",
        texto:
          "Herança fixa a relação na hora de escrever o código e deixa a subclasse dependente de detalhes da classe-base. Composição monta o objeto com peças que cumprem interfaces pequenas e permite trocá-las. Herde só quando “é um” valer em todos os contextos (a subclasse pode ser usada onde a base é esperada sem surpresas, o princípio de substituição de Liskov); para reaproveitar comportamento, componha.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "SOLID e onde a POO aparece no backend",
        texto:
          "**SOLID** reúne cinco heurísticas de design: responsabilidade única, aberto/fechado, substituição de Liskov, segregação de interfaces e inversão de dependência. A última é a do exemplo: o `Checkout` depende de uma abstração e recebe a implementação de fora (injeção de dependência, comum em frameworks como NestJS e Spring). No dia a dia isso aparece em **serviços** (orquestram casos de uso), **repositórios** (escondem o acesso a dados) e **entidades de domínio** (guardam estado e regras). São heurísticas, não leis.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Alternativas, sem guerra de paradigmas",
        texto:
          "O estilo **procedural** organiza o código em funções que operam sobre dados; o **funcional** prefere funções puras e dados imutáveis, o que torna a concorrência mais simples. Há linguagens com perfis diferentes: Go não tem herança de classes e usa structs e interfaces; Rust usa traits. Sistemas reais misturam estilos, por exemplo um núcleo de regras com funções puras e objetos nas bordas (serviços, adaptadores). Responda com critérios (o que o problema pede, o que o time domina), não com torcida.",
      },
    ],
    armadilhas: [
      "Reduzir POO a “classes e herança”: o centro da ideia é objeto como estado mais comportamento protegido por uma interface.",
      "Usar herança profunda só para reaproveitar código: o acoplamento com a base cobra a conta na primeira mudança.",
      "Encapsulamento de fachada: um getter e um setter para cada campo é dado público com outra roupa, e a regra de negócio acaba espalhada pelos serviços.",
      "Tratar POO como o único jeito certo, ou como coisa ultrapassada: o entrevistador quer ver critério, não religião.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre classe e objeto?",
        resposta:
          "A classe é a definição (campos e métodos); o objeto é uma instância concreta em memória, com o seu próprio estado.",
      },
      {
        pergunta: "Por que se diz “composição sobre herança”?",
        resposta:
          "Porque herança acopla a subclasse à base e fixa a relação cedo; composição permite montar e trocar comportamentos por meio de interfaces pequenas, com menos acoplamento.",
      },
      {
        pergunta: "Como o polimorfismo elimina um `if` por tipo de pagamento?",
        resposta:
          "Todos os meios de pagamento implementam a mesma interface; quem chama invoca `cobrar` e o objeto real decide o que fazer. Um novo meio entra criando uma classe, sem editar o fluxo existente.",
      },
    ],
  },
  en: {
    titulo: "Object-oriented programming",
    pergunta: "Can you explain what OOP (Object-Oriented Programming) is?",
    porqueEsteMetodo:
      "OOP is an abstract concept learned by intuition: an everyday analogy anchors the four pillars, and the point where it breaks down (deep inheritance, mutable state) is where interviews tend to dig deeper.",
    resposta30s:
      "OOP organizes code around **objects**: units that bundle **state** (data) and **behavior** (methods) behind an interface. The four pillars are **encapsulation**, **abstraction**, **inheritance** and **polymorphism**. In the backend it shows up in services, repositories and domain entities, and current practice favors **composition over inheritance** and depending on interfaces (ideas from **SOLID**). It is not the only paradigm: functional and procedural styles solve the same problems with different trade-offs.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "A car rental company. Each vehicle keeps its own state (mileage, fuel level) and knows how to do things (accelerate, brake). The customer does not open the hood: they use the steering wheel and pedals, the interface. Those same controls work for a diesel car or an electric one, and the counter only asks for “a mid-size vehicle” without knowing which one will be handed over. Vehicles from the same family reuse a base design and each model adds what is its own.",
        tecnico:
          "The vehicle is the **object**: state plus behavior. The closed hood is **encapsulation**: state changes only through methods that enforce the rules. Asking for “a mid-size vehicle” is **abstraction**: depending on what the object does, not how it does it. The reused base design is **inheritance**. Driving any model with the same controls is **polymorphism**: the same call, different behavior depending on the actual object. In a backend the “vehicle” may be an account, an order or a payment method, and the “customer” is the code that uses it.",
        limite:
          "At the rental company, stacking categories (sports, convertible, electric, electric sports…) feels natural; in code, deep hierarchies turn into a tangle where changing the base breaks the children. In real life you assemble a vehicle by combining parts (engine, gearbox), and that is what composition does. Also, objects in memory do not persist by themselves: a relational database stores rows, not objects, and the bridge between the two (an ORM) has its own cost.",
      },
      {
        tipo: "tabela",
        titulo: "The four pillars",
        colunas: ["Pillar", "Idea", "Backend example", "What it prevents"],
        linhas: [
          [
            "Encapsulation",
            "Private state; it changes only through methods that protect the rules",
            "`Account` exposes `withdraw(amount)` and does not let anyone touch `balance` directly; the rule “balance never goes negative” lives in one place",
            "Invalid state and the same rule repeated across the code",
          ],
          [
            "Abstraction",
            "Show what the object does and hide how it does it",
            "`UserRepository.findById(id)`: the caller does not know whether Postgres, a cache or memory sits behind it",
            "Coupling to details; swapping the database becomes a rewrite",
          ],
          [
            "Inheritance",
            "One type reuses and specializes another (an “is a” relationship)",
            "A base `BusinessError`, specialized by `InsufficientFunds` and `OrderNotFound` and translated into 4xx responses",
            "Repeated code; in exchange, it creates tight coupling to the base class",
          ],
          [
            "Polymorphism",
            "Same call, behavior chosen by the actual object",
            "`method.charge(amount)` works for card, Pix or bank slip without an `if` per type",
            "`if`/`switch` chains per type that grow with every new case",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Polymorphism and composition in a checkout",
        legenda: "typescript",
        codigo:
          "interface PaymentMethod {\n  charge(amountInCents: number): Promise<string>; // returns the charge id\n}\n\nclass CardPayment implements PaymentMethod {\n  constructor(private readonly gateway: CardGateway) {}\n  async charge(amountInCents: number) {\n    return this.gateway.authorize(amountInCents);\n  }\n}\n\nclass PixPayment implements PaymentMethod {\n  async charge(amountInCents: number) {\n    return createPixCharge(amountInCents);\n  }\n}\n\n// The service receives the interface, not a concrete class\nclass Checkout {\n  constructor(private readonly method: PaymentMethod) {}\n  finish(order: Order) {\n    return this.method.charge(order.totalInCents);\n  }\n}",
        nota: "`CardGateway`, `Order` and `createPixCharge` are assumptions of the example. To test `Checkout`, just pass a fake payment method that implements the same interface.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Composition over inheritance",
        texto:
          "Inheritance fixes the relationship when the code is written and leaves the subclass dependent on details of the base class. Composition builds the object from parts that honor small interfaces and lets you swap them. Inherit only when “is a” holds in every context (the subclass can be used wherever the base is expected without surprises, the Liskov substitution principle); to reuse behavior, compose.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "SOLID and where OOP shows up in the backend",
        texto:
          "**SOLID** bundles five design heuristics: single responsibility, open/closed, Liskov substitution, interface segregation and dependency inversion. The last one is the example above: `Checkout` depends on an abstraction and receives the implementation from outside (dependency injection, common in frameworks such as NestJS and Spring). Day to day it appears in **services** (orchestrate use cases), **repositories** (hide data access) and **domain entities** (hold state and rules). They are heuristics, not laws.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Alternatives, without a paradigm war",
        texto:
          "The **procedural** style organizes code as functions that operate on data; the **functional** style favors pure functions and immutable data, which makes concurrency simpler. Languages differ too: Go has no class inheritance and uses structs and interfaces; Rust uses traits. Real systems mix styles, for example a core of rules written as pure functions with objects at the edges (services, adapters). Answer with criteria (what the problem asks for, what the team knows well), not with tribalism.",
      },
    ],
    armadilhas: [
      "Reducing OOP to “classes and inheritance”: the core idea is an object as state plus behavior protected by an interface.",
      "Using deep inheritance just to reuse code: the coupling to the base class sends the bill on the first change.",
      "Cosmetic encapsulation: a getter and a setter for every field is public data in disguise, and the business rule ends up scattered across services.",
      "Treating OOP as the only right way, or as outdated: the interviewer wants to see judgment, not religion.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between a class and an object?",
        resposta:
          "The class is the definition (fields and methods); the object is a concrete instance in memory, with its own state.",
      },
      {
        pergunta: "Why do people say “composition over inheritance”?",
        resposta:
          "Because inheritance couples the subclass to the base and fixes the relationship early; composition lets you assemble and swap behaviors through small interfaces, with less coupling.",
      },
      {
        pergunta: "How does polymorphism remove an `if` per payment type?",
        resposta:
          "Every payment method implements the same interface; the caller invokes `charge` and the actual object decides what to do. A new method enters by adding a class, without editing the existing flow.",
      },
    ],
  },
};
