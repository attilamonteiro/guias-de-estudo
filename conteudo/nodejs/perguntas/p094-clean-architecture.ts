import type { Pergunta } from "../../tipos";

// P94 · Clean architecture
export const p094: Pergunta = {
  numero: 794,
  modulo: "pawanmkr-devops",
  metodo: "compare",
  pt: {
    titulo: "Clean architecture",
    pergunta: "Quais são os princípios da clean architecture e como aplicá-los em apps Node.js?",
    porqueEsteMetodo:
      "“Clean architecture” se confunde com arquitetura em camadas e com hexagonal, e a entrevista quer ouvir o que a distingue e quando compensa. A matriz põe as três lado a lado, e a regra de decisão mostra o tamanho certo de cerimônia.",
    resposta30s:
      "A **clean architecture** organiza o código em anéis concêntricos (**entidades**, **casos de uso**, **adaptadores de interface** e **frameworks e drivers**) sob uma regra: as **dependências apontam para dentro**, então a regra de negócio não conhece Express, banco nem biblioteca alguma. Em Node.js isso vira casos de uso como funções ou classes puras que recebem as dependências (repositórios, como interfaces) por parâmetro, com Express e ORM só na camada externa e a montagem num ponto único. Ganha-se testabilidade e liberdade para trocar framework ou banco, ao custo de mais arquivos e cerimônia, o que é exagero num CRUD simples.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Camadas simples, hexagonal e clean architecture",
        colunas: ["Aspecto", "Camadas simples", "Hexagonal (portas e adaptadores)", "Clean architecture"],
        linhas: [
          [
            "Sentido da dependência",
            "De cima para baixo: a regra de negócio depende da camada de dados",
            "Para dentro: o núcleo define portas, e o lado de fora as implementa",
            "Para dentro, em anéis: entidades ← casos de uso ← adaptadores ← frameworks",
          ],
          [
            "Onde mora a regra de negócio",
            "Na camada de serviço, em geral conhecendo o ORM",
            "No núcleo da aplicação, sem conhecer HTTP nem banco",
            "Nas entidades (regras gerais) e nos casos de uso (regras da aplicação)",
          ],
          [
            "Como o núcleo fala com o mundo",
            "Chama direto a camada de baixo",
            "Por portas (interfaces) e adaptadores que as implementam",
            "Por interfaces de repositório e serviços declaradas no núcleo e implementadas na borda",
          ],
          [
            "Trocar banco ou framework",
            "Atinge várias camadas",
            "Troca o adaptador",
            "Troca a camada externa, sem tocar nos anéis internos",
          ],
          [
            "Custo",
            "Baixo, quase sem cerimônia",
            "Médio: portas e adaptadores",
            "Maior: mais anéis, mapeamento entre modelos e mais arquivos",
          ],
          [
            "Quando basta",
            "CRUD simples e protótipos",
            "Domínios com várias integrações",
            "Regras complexas e sistemas de vida longa",
          ],
        ],
        nota: "Hexagonal e clean architecture são ideias muito parecidas (a regra de dependência é a mesma): a hexagonal fala em portas e adaptadores, e a clean architecture detalha os anéis. Na prática os vocabulários se misturam.",
      },
      {
        tipo: "passos",
        titulo: "Como aplicar em Node.js",
        passos: [
          {
            titulo: "Comece pelas entidades e regras puras",
            texto:
              "Funções e classes sem `import` de Express, de ORM nem de `process.env`: calculam, validam e decidem. Critério: testáveis só com `node:test` ou outro executor de testes, sem subir nada.",
          },
          {
            titulo: "Escreva cada caso de uso como função ou classe",
            texto:
              "Um caso de uso por intenção (`criarPedido`, `cancelarPedido`) recebe dados simples e as **dependências por parâmetro**, e devolve um resultado ou lança um erro de domínio.",
          },
          {
            titulo: "Declare as portas no núcleo",
            texto:
              "Se o caso de uso precisa de `pedidos.salvar(pedido)`, isso é um contrato: em JavaScript, um objeto com métodos; em TypeScript, uma `interface`. O núcleo não sabe se por trás há SQL, MongoDB ou uma memória.",
          },
          {
            titulo: "Implemente os adaptadores na borda",
            texto:
              "Repositórios com o driver ou ORM da sua escolha, controllers de Express ou Fastify que convertem HTTP em entrada do caso de uso e o resultado em HTTP. **Express e ORM só aparecem aqui**; objetos como `req` e `res` nunca entram no núcleo.",
          },
          {
            titulo: "Monte tudo num ponto só",
            texto:
              "Um arquivo de composição (por exemplo o `main`) cria os adaptadores e os injeta nos casos de uso. Em Node, funções fábricas, como no exemplo, bastam; contêineres de injeção, como o do NestJS, `awilix` ou `tsyringe`, ajudam em projetos grandes (veja L97 e G88).",
          },
          {
            titulo: "Teste por camada",
            texto:
              "Muitos testes unitários nos casos de uso, com repositório em memória e relógio fixo; testes de integração nos adaptadores contra o banco real; poucos testes ponta a ponta pela API.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Núcleo puro e borda",
        legenda: "JavaScript",
        codigo: [
          "// núcleo: caso de uso puro, sem Express nem banco",
          "export const criarPedido = ({ pedidos, relogio }) => async ({ clienteId, itens }) => {",
          '  if (itens.length === 0) throw new Error("Pedido sem itens");',
          '  const pedido = { clienteId, itens, status: "pendente", criadoEm: relogio() };',
          "  await pedidos.salvar(pedido); // porta: quem implementa é a borda",
          "  return pedido;",
          "};",
          "",
          "// borda: adaptador, composição e Express (só aqui aparecem)",
          'const pedidos = { salvar: (p) => db.insert("pedidos", p) }; // ou Prisma, Knex, pg…',
          "const criar = criarPedido({ pedidos, relogio: () => new Date() });",
          "",
          'app.post("/pedidos", async (req, res) => {',
          "  res.status(201).json(await criar(req.body));",
          "});",
        ].join("\n"),
        nota: "O caso de uso não importa nada: recebe `pedidos` e `relogio` por parâmetro, então o teste passa um repositório em memória e um relógio fixo. Num projeto real, converter e validar `req.body` é papel do controller.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A regra da dependência",
        texto:
          "O código-fonte só pode apontar **para dentro**: entidades ← casos de uso ← adaptadores de interface ← frameworks e drivers. O círculo interno não importa nada do externo, nem nomes, nem formatos de dados. Quando o núcleo precisa de algo do mundo (salvar, enviar e-mail), ele declara uma interface e o círculo externo a implementa (**inversão de dependência**). Teste prático: abra um arquivo de caso de uso; se há `import` de `express`, de um ORM ou de `process.env`, a regra foi quebrada.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cerimônia custa",
        texto:
          "Mais anéis e arquivos, mapeamento entre modelos (entidade, DTO, registro do banco) e abstrações que só se pagam se algo realmente mudar ou se a regra for complexa. Num CRUD simples, um handler com ORM resolve com menos código. Adote no tamanho da necessidade: comece separando a regra de negócio de HTTP e de banco, e acrescente portas quando houver uma segunda implementação ou necessidade de teste. Pastas com nomes de camadas, sem a regra de dependência, são só organização, não clean architecture.",
      },
    ],
    armadilhas: [
      "Copiar as pastas (`entities`, `usecases`…) sem a regra de dependência: se o caso de uso importa o ORM ou o `req` do Express, é arquitetura em camadas com nome novo.",
      "Passar objetos do framework (`req`, `res`, modelos do ORM) para dentro do núcleo: o acoplamento volta pela porta dos fundos; converta na borda para dados simples.",
      "Criar interface e adaptador para tudo desde o início: abstrações sem segunda implementação nem necessidade de teste só adicionam arquivos.",
      "Deixar o caso de uso virar um “serviço” que faz de tudo: prefira um caso de uso por intenção do usuário, com responsabilidade clara.",
    ],
    autoteste: [
      {
        pergunta: "O que diz a regra da dependência?",
        resposta:
          "Que as dependências de código apontam sempre para dentro: o núcleo (entidades e casos de uso) não conhece os círculos externos. Quando precisa de algo externo, define uma interface que a borda implementa.",
      },
      {
        pergunta: "Qual a diferença entre clean architecture e arquitetura hexagonal?",
        resposta:
          "São ideias muito próximas: ambas isolam o núcleo e invertem a dependência. A hexagonal descreve isso em portas e adaptadores; a clean architecture detalha os anéis (entidades, casos de uso, adaptadores e frameworks). Na prática os vocabulários se misturam.",
      },
    ],
  },
  en: {
    titulo: "Clean architecture",
    pergunta: "What are the principles of clean architecture and how can they be applied to Node.js apps?",
    porqueEsteMetodo:
      "“Clean architecture” gets confused with layered and hexagonal architecture, and an interview wants to hear what sets it apart and when it pays off. The matrix puts the three side by side, and the decision rule shows the right amount of ceremony.",
    resposta30s:
      "**Clean architecture** organizes the code in concentric rings (**entities**, **use cases**, **interface adapters** and **frameworks and drivers**) under one rule: **dependencies point inward**, so the business logic knows nothing about Express, the database or any library. In Node.js that becomes use cases as plain functions or classes that receive their dependencies (repositories, as interfaces) as parameters, with Express and the ORM only in the outer layer and the wiring in a single place. You gain testability and the freedom to swap framework or database, at the cost of more files and ceremony, which is overkill for a simple CRUD.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Simple layers, hexagonal and clean architecture",
        colunas: ["Aspect", "Simple layers", "Hexagonal (ports and adapters)", "Clean architecture"],
        linhas: [
          [
            "Direction of dependency",
            "Top to bottom: the business logic depends on the data layer",
            "Inward: the core defines ports, and the outside implements them",
            "Inward, in rings: entities ← use cases ← adapters ← frameworks",
          ],
          [
            "Where the business logic lives",
            "In the service layer, usually aware of the ORM",
            "In the application core, unaware of HTTP and the database",
            "In entities (general rules) and use cases (application rules)",
          ],
          [
            "How the core talks to the world",
            "Calls the layer below directly",
            "Through ports (interfaces) and the adapters that implement them",
            "Through repository and service interfaces declared in the core and implemented at the edge",
          ],
          [
            "Swapping database or framework",
            "Touches several layers",
            "Swap the adapter",
            "Swap the outer layer, leaving the inner rings untouched",
          ],
          [
            "Cost",
            "Low, almost no ceremony",
            "Medium: ports and adapters",
            "Higher: more rings, mapping between models and more files",
          ],
          [
            "When it is enough",
            "Simple CRUD and prototypes",
            "Domains with several integrations",
            "Complex rules and long-lived systems",
          ],
        ],
        nota: "Hexagonal and clean architecture are very similar ideas (the dependency rule is the same): hexagonal talks about ports and adapters, and clean architecture details the rings. In practice the vocabularies get mixed.",
      },
      {
        tipo: "passos",
        titulo: "How to apply it in Node.js",
        passos: [
          {
            titulo: "Start with entities and pure rules",
            texto:
              "Functions and classes with no `import` of Express, an ORM or `process.env`: they calculate, validate and decide. Criterion: testable with just `node:test` or another test runner, without starting anything.",
          },
          {
            titulo: "Write each use case as a function or class",
            texto:
              "One use case per intent (`createOrder`, `cancelOrder`) receives plain data and its **dependencies as parameters**, and returns a result or throws a domain error.",
          },
          {
            titulo: "Declare the ports in the core",
            texto:
              "If the use case needs `orders.save(order)`, that is a contract: in JavaScript, an object with methods; in TypeScript, an `interface`. The core does not know whether SQL, MongoDB or memory sits behind it.",
          },
          {
            titulo: "Implement the adapters at the edge",
            texto:
              "Repositories with the driver or ORM of your choice, Express or Fastify controllers that turn HTTP into use-case input and the result back into HTTP. **Express and the ORM appear only here**; objects such as `req` and `res` never enter the core.",
          },
          {
            titulo: "Wire everything in one place",
            texto:
              "A composition file (for example `main`) creates the adapters and injects them into the use cases. In Node, factory functions, as in the example, are enough; injection containers, such as NestJS’s, `awilix` or `tsyringe`, help in large projects (see L97 and G88).",
          },
          {
            titulo: "Test by layer",
            texto:
              "Many unit tests on the use cases, with an in-memory repository and a fixed clock; integration tests on the adapters against the real database; few end-to-end tests through the API.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A pure core and the edge",
        legenda: "JavaScript",
        codigo: [
          "// core: a pure use case, no Express and no database",
          "export const createOrder = ({ orders, clock }) => async ({ customerId, items }) => {",
          '  if (items.length === 0) throw new Error("Order without items");',
          '  const order = { customerId, items, status: "pending", createdAt: clock() };',
          "  await orders.save(order); // port: the edge implements it",
          "  return order;",
          "};",
          "",
          "// edge: adapter, wiring and Express (they appear only here)",
          'const orders = { save: (o) => db.insert("orders", o) }; // or Prisma, Knex, pg…',
          "const create = createOrder({ orders, clock: () => new Date() });",
          "",
          'app.post("/orders", async (req, res) => {',
          "  res.status(201).json(await create(req.body));",
          "});",
        ].join("\n"),
        nota: "The use case imports nothing: it receives `orders` and `clock` as parameters, so a test passes an in-memory repository and a fixed clock. In a real project, converting and validating `req.body` is the controller’s job.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The dependency rule",
        texto:
          "Source code may only point **inward**: entities ← use cases ← interface adapters ← frameworks and drivers. The inner circle imports nothing from the outer one, neither names nor data formats. When the core needs something from the world (saving, sending e-mail), it declares an interface and the outer circle implements it (**dependency inversion**). A practical test: open a use-case file; if it has an `import` of `express`, an ORM or `process.env`, the rule was broken.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Ceremony has a cost",
        texto:
          "More rings and files, mapping between models (entity, DTO, database record) and abstractions that only pay off if something really changes or the rules are complex. In a simple CRUD, a handler with an ORM does the job with less code. Adopt it in proportion to the need: start by separating business logic from HTTP and from the database, and add ports when there is a second implementation or a testing need. Folders named after layers, without the dependency rule, are just organization, not clean architecture.",
      },
    ],
    armadilhas: [
      "Copying the folders (`entities`, `usecases`…) without the dependency rule: if the use case imports the ORM or Express’s `req`, it is layered architecture with a new name.",
      "Passing framework objects (`req`, `res`, ORM models) into the core: the coupling returns through the back door; convert to plain data at the edge.",
      "Creating an interface and an adapter for everything from the start: abstractions with no second implementation or testing need only add files.",
      "Letting the use case become a “service” that does everything: prefer one use case per user intent, with a clear responsibility.",
    ],
    autoteste: [
      {
        pergunta: "What does the dependency rule say?",
        resposta:
          "That code dependencies always point inward: the core (entities and use cases) knows nothing about the outer circles. When it needs something external, it defines an interface that the edge implements.",
      },
      {
        pergunta: "What is the difference between clean architecture and hexagonal architecture?",
        resposta:
          "They are very close ideas: both isolate the core and invert the dependency. Hexagonal describes it in ports and adapters; clean architecture details the rings (entities, use cases, adapters and frameworks). In practice the vocabularies get mixed.",
      },
    ],
  },
};
