import type { Pergunta } from "../../tipos";

// P90 · Backend-for-Frontend (BFF)
export const p090: Pergunta = {
  numero: 790,
  modulo: "pawanmkr-devops",
  metodo: "feynman",
  pt: {
    titulo: "Backend-for-Frontend (BFF)",
    pergunta: "Qual é o papel de um BFF (Backend-for-Frontend) e quando ele deve ser usado?",
    porqueEsteMetodo:
      "O BFF resolve um problema de relacionamento entre cliente e serviços, e uma imagem do dia a dia o torna óbvio. Depois da analogia vêm o mecanismo real, a comparação com gateway e GraphQL e o ponto em que a imagem deixa de valer.",
    resposta30s:
      "Um **BFF** (Backend for Frontend) é uma camada de backend **feita sob medida para um tipo de cliente** (web, app móvel…): recebe a chamada da tela, **agrega** as respostas de vários serviços e devolve só o que aquele cliente precisa, no formato e no tamanho certos, escondendo os detalhes internos e cuidando da sessão do cliente. Faz sentido quando clientes diferentes têm necessidades muito diferentes ou quando os microsserviços são pequenos demais para o front chamá-los direto; para um único cliente com uma API simples, é exagero. O risco é virar um monólito de regras de negócio: o BFF compõe e traduz, e as regras ficam nos serviços.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Num restaurante grande, imagine um balcão único onde todo mundo grita o pedido do seu jeito, e a cozinha tem várias estações (grelha, massas, sobremesas). Agora imagine um garçom por mesa: o da mesa da família sabe pedir o prato completo e trazer tudo junto; o da mesa de quem está com pressa leva só o essencial, em embalagem para viagem. Cada garçom conhece a sua mesa, passa pelas estações certas e volta com um pedido só.",
        tecnico:
          "Um **BFF** (Backend for Frontend) é uma camada de backend dedicada a **um tipo de cliente** (web, app móvel, TV…). Ele recebe a chamada da tela, consulta os serviços internos (em paralelo, quando possível), **agrega** as respostas e **adapta** formato, campos e tamanho ao que aquela tela precisa. Também esconde a topologia interna e cuida do que pertence ao cliente: sessão, token de acesso, cache de apresentação. Em geral é mantido pela mesma equipe do front, que muda a API quando a tela muda.",
        limite:
          "O garçom não deve virar cozinheiro. Se o BFF começa a calcular preço, aplicar desconto ou gravar dados, vira um segundo monólito, com a regra de negócio repetida a cada cliente. A regra de negócio fica nos serviços; o BFF só **traduz e compõe**.",
      },
      {
        tipo: "tabela",
        titulo: "BFF, API gateway e GraphQL: papéis diferentes",
        colunas: ["Aspecto", "BFF", "API gateway", "GraphQL"],
        linhas: [
          [
            "Para quem",
            "Um tipo de cliente (web, mobile, TV…)",
            "Todos os clientes, da mesma forma",
            "Qualquer cliente, que escolhe os campos",
          ],
          [
            "O que faz",
            "Agrega chamadas, adapta formato e tamanho, cuida da sessão do cliente",
            "Roteia e aplica políticas transversais: autenticação, limite de taxa, logs (veja P99)",
            "Linguagem de consulta e esquema único, com um resolvedor por campo",
          ],
          [
            "Composição",
            "Em código, sob medida para cada tela",
            "Quase nenhuma, de propósito",
            "No servidor, nos resolvedores",
          ],
          [
            "Quem mantém",
            "Em geral a equipe do front correspondente",
            "Equipe de plataforma",
            "Equipe da API, ou do front, conforme o desenho",
          ],
          [
            "Combinam?",
            "Sim: costuma ficar atrás de um gateway",
            "Sim: fica na frente dos BFFs e dos serviços",
            "Sim: um BFF pode expor GraphQL ou consumir um",
          ],
        ],
        nota: "GraphQL dá ao cliente a escolha dos campos e pode dispensar um BFF por cliente em alguns casos; o BFF continua útil para sessão, composição específica e adaptação além do formato (veja D72).",
      },
      {
        tipo: "codigo",
        titulo: "Uma chamada do app, três nos serviços",
        legenda: "JavaScript",
        codigo: [
          "// app é uma aplicação Express; USUARIOS, PEDIDOS e CATALOGO são URLs internas",
          "const chamar = (url, req) =>",
          "  fetch(url, {",
          '    headers: { authorization: req.get("authorization") ?? "" },',
          "    signal: AbortSignal.timeout(800), // não espere um serviço lento",
          "  }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))));",
          "",
          'app.get("/mobile/home", async (req, res) => {',
          "  const [perfil, pedidos, ofertas] = await Promise.allSettled([",
          "    chamar(`${USUARIOS}/me`, req),",
          "    chamar(`${PEDIDOS}/recentes?limite=3`, req),",
          "    chamar(`${CATALOGO}/ofertas?limite=5`, req),",
          "  ]);",
          "  res.json({",
          "    nome: perfil.value?.nome, // só o que a tela usa",
          "    pedidos: pedidos.value ?? [], // falha parcial: a tela degrada, não quebra",
          "    ofertas: ofertas.value ?? [],",
          "  });",
          "});",
        ].join("\n"),
        nota: "`Promise.allSettled` (veja L26) devolve o resultado de todas as chamadas, mesmo das que falharam, o que permite resposta parcial; `AbortSignal.timeout` (veja L33) corta a espera. Aqui o token do usuário é repassado; num BFF com sessão por cookie, o token ficaria no servidor e seria anexado neste ponto.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Quando usar, quando dispensar",
        texto:
          "**Use** quando web e mobile precisam de formatos ou ritmos bem diferentes; quando os microsserviços são pequenos demais para o front chamá-los um a um (telas que juntam dados de vários serviços); quando a equipe do front precisa evoluir a API no ritmo da tela sem negociar com vários times; ou quando você quer manter tokens fora do navegador (o BFF guarda a sessão e anexa o token, veja P29). **Dispense** quando há um só cliente, quando o backend já é um serviço com API sob medida ou quando um gateway com GraphQL resolve: o BFF vira só mais um salto de rede e mais um serviço para operar.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Custos e a armadilha clássica",
        texto:
          "Mais serviços para implantar, monitorar e proteger; duplicação entre BFFs (o mesmo mapeamento em dois lugares); e um salto de rede a mais, atenuado com chamadas em paralelo, timeouts e cache. A armadilha clássica é a regra de negócio migrar para o BFF “porque ali é mais fácil”: cada cliente passa a ter a sua versão da regra. Se dois BFFs repetem a mesma lógica, ela pertence a um serviço ou biblioteca compartilhada. E um BFF único para todos os clientes é só um segundo gateway.",
      },
    ],
    armadilhas: [
      "Colocar regras de negócio (preço, desconto, permissões de domínio) no BFF: cada cliente passa a ter a sua versão, e o BFF vira o monólito que a arquitetura queria evitar.",
      "Criar um único BFF para todos os clientes: perde a razão de ser (sob medida para cada cliente) e vira um gateway cheio de composições.",
      "Encadear chamadas em série ou sem timeout: a tela fica tão lenta quanto a soma de todos os serviços; faça chamadas independentes em paralelo, com timeout e resposta parcial.",
      "Adotar BFF onde um backend único já atende bem: mais um serviço para operar, sem ganho.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre um BFF e um API gateway?",
        resposta:
          "O gateway é um ponto de entrada comum a todos os clientes e cuida de preocupações transversais (autenticação, limite de taxa, roteamento). O BFF é específico de um tipo de cliente e compõe e adapta dados para a tela dele. É comum ter um gateway na frente dos BFFs.",
      },
      {
        pergunta: "O que não deve ficar num BFF?",
        resposta:
          "Regras de negócio. Ele traduz e agrega; as regras ficam nos serviços, para não serem duplicadas por cliente.",
      },
    ],
  },
  en: {
    titulo: "Backend-for-Frontend (BFF)",
    pergunta: "What is the role of a BFF (Backend-for-Frontend) and when should it be used?",
    porqueEsteMetodo:
      "The BFF solves a relationship problem between clients and services, and an everyday image makes it obvious. After the analogy come the real mechanism, the comparison with a gateway and GraphQL, and the point where the image stops holding.",
    resposta30s:
      "A **BFF** (Backend for Frontend) is a backend layer **tailored to one type of client** (web, mobile app…): it receives the screen’s call, **aggregates** the responses of several services and returns only what that client needs, in the right shape and size, hiding internal details and handling the client’s session. It makes sense when different clients have very different needs or when the microservices are too small for the front end to call directly; for a single client with a simple API, it is overkill. The risk is becoming a monolith of business rules: the BFF composes and translates, and the rules stay in the services.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "In a big restaurant, imagine a single counter where everyone shouts their order in their own way, and the kitchen has several stations (grill, pasta, desserts). Now imagine one waiter per table: the family’s waiter knows how to order the full meal and bring everything together; the waiter for the table in a hurry takes only the essentials, in takeaway packaging. Each waiter knows their table, visits the right stations and comes back with a single order.",
        tecnico:
          "A **BFF** (Backend for Frontend) is a backend layer dedicated to **one type of client** (web, mobile app, TV…). It receives the screen’s call, queries the internal services (in parallel when possible), **aggregates** the responses and **adapts** format, fields and size to what that screen needs. It also hides the internal topology and handles what belongs to the client: session, access token, presentation cache. It is usually maintained by the same team as the front end, which changes the API when the screen changes.",
        limite:
          "The waiter must not become the cook. If the BFF starts calculating prices, applying discounts or writing data, it becomes a second monolith, with the business rule repeated for every client. Business rules stay in the services; the BFF only **translates and composes**.",
      },
      {
        tipo: "tabela",
        titulo: "BFF, API gateway and GraphQL: different roles",
        colunas: ["Aspect", "BFF", "API gateway", "GraphQL"],
        linhas: [
          [
            "For whom",
            "One type of client (web, mobile, TV…)",
            "All clients, in the same way",
            "Any client, which picks the fields",
          ],
          [
            "What it does",
            "Aggregates calls, adapts format and size, handles the client’s session",
            "Routes and applies cross-cutting policies: authentication, rate limiting, logs (see P99)",
            "A query language and a single schema, with one resolver per field",
          ],
          [
            "Composition",
            "In code, tailored to each screen",
            "Almost none, on purpose",
            "On the server, in the resolvers",
          ],
          [
            "Who maintains it",
            "Usually the matching front-end team",
            "A platform team",
            "The API team, or the front end’s, depending on the design",
          ],
          [
            "Do they combine?",
            "Yes: it usually sits behind a gateway",
            "Yes: it sits in front of the BFFs and the services",
            "Yes: a BFF can expose GraphQL or consume one",
          ],
        ],
        nota: "GraphQL lets the client pick the fields and can remove the need for a BFF per client in some cases; a BFF is still useful for session, specific composition and adaptation beyond format (see D72).",
      },
      {
        tipo: "codigo",
        titulo: "One call from the app, three to the services",
        legenda: "JavaScript",
        codigo: [
          "// app is an Express application; USERS, ORDERS and CATALOG are internal URLs",
          "const call = (url, req) =>",
          "  fetch(url, {",
          '    headers: { authorization: req.get("authorization") ?? "" },',
          "    signal: AbortSignal.timeout(800), // do not wait on a slow service",
          "  }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))));",
          "",
          'app.get("/mobile/home", async (req, res) => {',
          "  const [profile, orders, offers] = await Promise.allSettled([",
          "    call(`${USERS}/me`, req),",
          "    call(`${ORDERS}/recent?limit=3`, req),",
          "    call(`${CATALOG}/offers?limit=5`, req),",
          "  ]);",
          "  res.json({",
          "    name: profile.value?.name, // only what the screen uses",
          "    orders: orders.value ?? [], // partial failure: the screen degrades, not breaks",
          "    offers: offers.value ?? [],",
          "  });",
          "});",
        ].join("\n"),
        nota: "`Promise.allSettled` (see L26) returns the result of every call, even the ones that failed, which allows a partial response; `AbortSignal.timeout` (see L33) cuts the wait. Here the user’s token is forwarded; in a BFF with a cookie session, the token would stay on the server and be attached at this point.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "When to use it, when to skip it",
        texto:
          "**Use it** when web and mobile need quite different shapes or paces; when the microservices are too small for the front end to call one by one (screens that combine data from several services); when the front-end team must evolve the API at the pace of the screen without negotiating with several teams; or when you want tokens kept out of the browser (the BFF holds the session and attaches the token, see P29). **Skip it** when there is a single client, when the backend is already one service with a tailored API, or when a gateway with GraphQL solves it: the BFF becomes just one more network hop and one more service to operate.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Costs and the classic trap",
        texto:
          "More services to deploy, monitor and secure; duplication between BFFs (the same mapping in two places); and an extra network hop, softened with parallel calls, timeouts and caching. The classic trap is business rules migrating into the BFF “because it is easier there”: each client ends up with its own version of the rule. If two BFFs repeat the same logic, it belongs in a shared service or library. And a single BFF for all clients is just a second gateway.",
      },
    ],
    armadilhas: [
      "Putting business rules (price, discount, domain permissions) in the BFF: each client ends up with its own version, and the BFF becomes the monolith the architecture wanted to avoid.",
      "Creating one BFF for all clients: it loses its reason to exist (tailored to each client) and becomes a gateway full of compositions.",
      "Chaining calls in series or without a timeout: the screen becomes as slow as the sum of all the services; make independent calls in parallel, with timeouts and partial responses.",
      "Adopting a BFF where a single backend already serves well: one more service to operate, with no gain.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between a BFF and an API gateway?",
        resposta:
          "The gateway is an entry point common to all clients and handles cross-cutting concerns (authentication, rate limiting, routing). The BFF is specific to one type of client and composes and adapts data for its screen. It is common to have a gateway in front of the BFFs.",
      },
      {
        pergunta: "What should not live in a BFF?",
        resposta:
          "Business rules. It translates and aggregates; the rules stay in the services, so they are not duplicated per client.",
      },
    ],
  },
};
