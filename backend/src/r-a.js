/* roadmap.sh · Iniciante (R01-R15, ids 101-115). Perguntas de https://roadmap.sh/questions/backend; respostas e métodos são próprios.
   Entradas com "alias" reaproveitam a explicação de uma pergunta da lista original (progresso conta uma vez). */
window.QS = window.QS || [];

/* R01 */
window.QS.push({
  n: 101, g: "I", m: "feynman",
  pt: {
    s: "O que é um endpoint de API",
    q: "Explique o que é um endpoint de API.",
    why: "Endpoint é um conceito simples que fica claro com uma analogia de endereço e guichê, seguida do mecanismo real (URL + método) e do ponto em que a analogia falha.",
    one: "Um **endpoint** é um ponto de entrada de uma API: a combinação de **URL + método HTTP** (por exemplo `GET /pedidos/42`) que o cliente chama para usar uma funcionalidade do servidor. Ele recebe uma requisição (talvez com parâmetros ou corpo) e devolve uma resposta com status e dados, e normalmente corresponde a uma capacidade do sistema.",
    b: [
      { t: "an",
        s: "Um prédio com vários guichês: cada um tem uma placa (endereço) e atende um tipo de pedido. Você vai ao guichê certo, entrega o formulário e recebe um protocolo ou o documento.",
        k: "A URL identifica o **recurso** (`/pedidos/42`) e o método diz a **ação** (`GET` ler, `POST` criar, `PUT`/`PATCH` alterar, `DELETE` apagar). O mesmo caminho com métodos diferentes são endpoints diferentes: `GET /pedidos` lista, `POST /pedidos` cria. Parâmetros vão no caminho (`/pedidos/{id}`), na query (`?status=pago`), nos cabeçalhos ou no corpo (JSON).",
        b: "Um guichê real atende uma pessoa de cada vez e lembra de você. Um endpoint não tem memória (cada requisição é independente) e atende milhares de clientes ao mesmo tempo." },
      { t: "cd", l: "http", c: `GET /pedidos/42?incluir=itens HTTP/1.1
Host: api.exemplo.com
Authorization: Bearer <token>

HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 42, "status": "pago", "itens": [ ... ] }` }
    ],
    traps: [
      "Achar que endpoint é só a URL: `GET /pedidos` e `POST /pedidos` são endpoints distintos.",
      "Colocar verbos no caminho (`/criarPedido`): o método HTTP já diz a ação."
    ],
    rc: [
      ["Qual a diferença entre `GET /pedidos` e `POST /pedidos`?", "São endpoints diferentes: o primeiro lista pedidos, o segundo cria um novo. O que muda é o método."],
      ["O que um endpoint recebe e devolve?", "Recebe método, URL, cabeçalhos e, às vezes, um corpo; devolve um status code, cabeçalhos e, normalmente, um corpo com os dados."]
    ]
  },
  en: {
    s: "What an API endpoint is",
    q: "Explain what an API endpoint is.",
    why: "An endpoint is a simple concept that becomes clear with an address-and-service-window analogy, followed by the real mechanism (URL + method) and the point where the analogy fails.",
    one: "An **endpoint** is an entry point of an API: the combination of **URL + HTTP method** (for example `GET /orders/42`) that the client calls to use a server feature. It receives a request (maybe with parameters or a body) and returns a response with a status and data, and it usually maps to one capability of the system.",
    b: [
      { t: "an",
        s: "A building with several service windows: each has a sign (address) and handles one kind of request. You go to the right window, hand in the form and get a receipt or the document.",
        k: "The URL identifies the **resource** (`/orders/42`) and the method says the **action** (`GET` read, `POST` create, `PUT`/`PATCH` change, `DELETE` remove). The same path with different methods gives different endpoints: `GET /orders` lists, `POST /orders` creates. Parameters go in the path (`/orders/{id}`), the query (`?status=paid`), headers or the body (JSON).",
        b: "A real window serves one person at a time and remembers you. An endpoint has no memory (each request is independent) and serves thousands of clients at once." },
      { t: "cd", l: "http", c: `GET /orders/42?include=items HTTP/1.1
Host: api.example.com
Authorization: Bearer <token>

HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 42, "status": "paid", "items": [ ... ] }` }
    ],
    traps: [
      "Thinking an endpoint is just the URL: `GET /orders` and `POST /orders` are distinct endpoints.",
      "Putting verbs in the path (`/createOrder`): the HTTP method already says the action."
    ],
    rc: [
      ["What is the difference between `GET /orders` and `POST /orders`?", "They are different endpoints: the first lists orders, the second creates a new one. Only the method changes."],
      ["What does an endpoint receive and return?", "It receives a method, URL, headers and sometimes a body; it returns a status code, headers and usually a body with the data."]
    ]
  }
});

/* R02 */
window.QS.push({
  n: 102, g: "I", alias: 6,
  pt: { s: "Diferença entre SQL e NoSQL", q: "Você pode explicar a diferença entre bancos de dados SQL e NoSQL?" },
  en: { s: "SQL vs NoSQL databases", q: "Can you explain the difference between SQL and NoSQL databases?" }
});

/* R03 */
window.QS.push({
  n: 103, g: "I", m: "whys",
  pt: {
    s: "API RESTful e seus princípios",
    q: "O que é uma API RESTful e quais são os seus princípios centrais?",
    why: "Cada princípio de REST existe por causa de um benefício concreto. Perguntar “por quê?” transforma a lista de restrições numa cadeia de causa e efeito, mais fácil de lembrar do que seis itens soltos.",
    one: "RESTful é a API que respeita as restrições do estilo REST: **cliente-servidor**, **stateless**, **cacheável**, **interface uniforme** (recursos com URI, manipulados por representações, mensagens autodescritivas e, idealmente, hipermídia/HATEOAS), **em camadas** e, opcionalmente, código sob demanda. Cada restrição compra uma propriedade: escala, simplicidade, desempenho ou evolução independente.",
    b: [
      { t: "why", rows: [
        ["Por que separar cliente e servidor?", "Para que cada lado evolua sozinho (o app móvel e o site usam a mesma API) e o servidor não se preocupe com a interface."],
        ["Por que cada requisição precisa ser independente (stateless)?", "Porque assim qualquer servidor atende qualquer requisição: dá para escalar horizontalmente sem prender o usuário a uma máquina."],
        ["Por que marcar respostas como cacheáveis?", "Para clientes, CDNs e proxies reaproveitarem respostas, reduzindo latência e carga no servidor."],
        ["Por que uma interface uniforme?", "Para que qualquer cliente entenda qualquer recurso sem conhecimento especial: URIs identificam recursos, os verbos HTTP têm semântica fixa, as mensagens dizem como interpretá-las (tipo de conteúdo) e as respostas trazem links das ações possíveis (HATEOAS)."],
        ["Por que permitir camadas?", "Para colocar gateway, balanceador, cache e segurança no meio sem que cliente ou servidor percebam."]
      ], root: "Cada princípio de REST é uma troca consciente: abre-se mão de liberdade (não guardar estado, usar verbos padrão) para ganhar **escala, simplicidade e evolução independente**." },
      { t: "tp", k: "tip", h: "Na prática", x: "A maioria das “APIs REST” usa recursos, verbos, JSON e stateless, mas ignora HATEOAS. No modelo de maturidade de Richardson isso é o nível 2 de 3; o nível 3 inclui hipermídia. Veja também a Q03 (REST vs GraphQL)." }
    ],
    traps: [
      "Chamar de RESTful qualquer API JSON sobre HTTP.",
      "Guardar estado de sessão no servidor e ainda dizer que a API é stateless.",
      "Usar `POST` para tudo, perdendo semântica e cache."
    ],
    rc: [
      ["O que significa stateless em REST?", "Cada requisição traz todas as informações necessárias para ser processada; o servidor não depende de memória de requisições anteriores."],
      ["O que é HATEOAS?", "Respostas que trazem links para as ações possíveis daquele recurso, para o cliente descobri-las sem conhecer as URLs de antemão."]
    ]
  },
  en: {
    s: "RESTful API and its principles",
    q: "What is a RESTful API and what are its core principles?",
    why: "Every REST principle exists because of a concrete benefit. Asking “why?” turns the list of constraints into a chain of cause and effect, easier to remember than six loose items.",
    one: "RESTful means the API respects the constraints of the REST style: **client-server**, **stateless**, **cacheable**, **uniform interface** (resources with a URI, manipulated through representations, self-descriptive messages and, ideally, hypermedia/HATEOAS), **layered** and, optionally, code on demand. Each constraint buys a property: scale, simplicity, performance or independent evolution.",
    b: [
      { t: "why", rows: [
        ["Why separate client and server?", "So each side evolves on its own (the mobile app and the website use the same API) and the server does not worry about the interface."],
        ["Why must each request be independent (stateless)?", "Because then any server can serve any request: you can scale horizontally without tying a user to one machine."],
        ["Why mark responses as cacheable?", "So clients, CDNs and proxies reuse responses, cutting latency and server load."],
        ["Why a uniform interface?", "So any client understands any resource without special knowledge: URIs identify resources, HTTP verbs have fixed semantics, messages say how to interpret them (content type) and responses carry links to the possible actions (HATEOAS)."],
        ["Why allow layers?", "To put a gateway, load balancer, cache and security in the middle without client or server noticing."]
      ], root: "Each REST principle is a conscious trade: it gives up freedom (no stored state, standard verbs) to gain **scale, simplicity and independent evolution**." },
      { t: "tp", k: "tip", h: "In practice", x: "Most “REST APIs” use resources, verbs, JSON and stateless, but ignore HATEOAS. On Richardson’s maturity model that is level 2 of 3; level 3 includes hypermedia. See also Q03 (REST vs GraphQL)." }
    ],
    traps: [
      "Calling any JSON-over-HTTP API RESTful.",
      "Keeping session state on the server and still calling the API stateless.",
      "Using `POST` for everything, losing semantics and caching."
    ],
    rc: [
      ["What does stateless mean in REST?", "Each request carries everything needed to process it; the server does not depend on memory of earlier requests."],
      ["What is HATEOAS?", "Responses that carry links to the possible actions on that resource, so the client can discover them without knowing the URLs in advance."]
    ]
  }
});

/* R04 */
window.QS.push({
  n: 104, g: "I", m: "trace",
  pt: {
    s: "Ciclo requisição/resposta HTTP",
    q: "Você pode descrever um ciclo típico de requisição e resposta HTTP?",
    why: "O ciclo é uma sequência de etapas que acontecem em ordem. Seguir uma única requisição, do DNS à resposta, mostra o que cada etapa faz e onde o tempo é gasto.",
    one: "O cliente **resolve o DNS**, abre uma **conexão TCP** (e, em HTTPS, faz o **handshake TLS**), envia a **requisição** (método, URL, versão, cabeçalhos e corpo opcional), o servidor a **processa** e devolve uma **resposta** (versão, status code, cabeçalhos e corpo opcional). A conexão pode ser mantida aberta (keep-alive) ou multiplexada (HTTP/2) para as próximas requisições.",
    b: [
      { t: "fl", ti: "Do clique à resposta", n: ["DNS: `api.exemplo.com` → endereço IP", "TCP: abre a conexão (porta 80, ou 443 em HTTPS)", "TLS: handshake e chaves (só em HTTPS)", "Requisição: `GET /pedidos/42` + cabeçalhos", "Servidor processa (auth, banco, regra)", "Resposta: `200 OK` + cabeçalhos + corpo", "Conexão reaproveitada (keep-alive) ou fechada"] },
      { t: "tb", ti: "As partes da mensagem", h: ["", "Requisição", "Resposta"], r: [
        ["Primeira linha", "Método + caminho + versão (`GET /pedidos/42 HTTP/1.1`)", "Versão + status (`HTTP/1.1 200 OK`)"],
        ["Cabeçalhos", "`Host`, `Authorization`, `Accept`, `Content-Type`", "`Content-Type`, `Cache-Control`, `Set-Cookie`"],
        ["Corpo", "Opcional (`POST`, `PUT`)", "Opcional (dados, HTML, erro)"]
      ] },
      { t: "tb", ti: "Famílias de status", h: ["Código", "Significado"], r: [
        ["2xx", "Sucesso (200 OK, 201 Created, 204 No Content)"],
        ["3xx", "Redirecionamento (301, 302, 304 Not Modified)"],
        ["4xx", "Erro do cliente (400, 401, 403, 404, 409, 429)"],
        ["5xx", "Erro do servidor (500, 502, 503, 504)"]
      ] }
    ],
    traps: [
      "Confundir 401 (não autenticado) com 403 (autenticado, sem permissão).",
      "Achar que HTTP mantém sessão na conexão: HTTP é sem estado, a conexão é só transporte.",
      "Ignorar o custo de DNS + TCP + TLS: é por isso que existem keep-alive e HTTP/2."
    ],
    rc: [
      ["Qual a diferença entre 401 e 403?", "401: você não está autenticado (ou o token é inválido). 403: está autenticado, mas não tem permissão."],
      ["Por que reaproveitar a conexão (keep-alive) ajuda?", "Evita repetir DNS, TCP e TLS a cada requisição, o que reduz a latência."]
    ]
  },
  en: {
    s: "HTTP request/response cycle",
    q: "Can you describe a typical HTTP request/response cycle?",
    why: "The cycle is a sequence of steps that happen in order. Following a single request, from DNS to the response, shows what each step does and where time is spent.",
    one: "The client **resolves DNS**, opens a **TCP connection** (and, for HTTPS, does the **TLS handshake**), sends the **request** (method, URL, version, headers and optional body), the server **processes** it and returns a **response** (version, status code, headers and optional body). The connection can be kept open (keep-alive) or multiplexed (HTTP/2) for the next requests.",
    b: [
      { t: "fl", ti: "From click to response", n: ["DNS: `api.example.com` → IP address", "TCP: opens the connection (port 80, or 443 for HTTPS)", "TLS: handshake and keys (HTTPS only)", "Request: `GET /orders/42` + headers", "Server processes (auth, database, rules)", "Response: `200 OK` + headers + body", "Connection reused (keep-alive) or closed"] },
      { t: "tb", ti: "The parts of the message", h: ["", "Request", "Response"], r: [
        ["First line", "Method + path + version (`GET /orders/42 HTTP/1.1`)", "Version + status (`HTTP/1.1 200 OK`)"],
        ["Headers", "`Host`, `Authorization`, `Accept`, `Content-Type`", "`Content-Type`, `Cache-Control`, `Set-Cookie`"],
        ["Body", "Optional (`POST`, `PUT`)", "Optional (data, HTML, error)"]
      ] },
      { t: "tb", ti: "Status families", h: ["Code", "Meaning"], r: [
        ["2xx", "Success (200 OK, 201 Created, 204 No Content)"],
        ["3xx", "Redirection (301, 302, 304 Not Modified)"],
        ["4xx", "Client error (400, 401, 403, 404, 409, 429)"],
        ["5xx", "Server error (500, 502, 503, 504)"]
      ] }
    ],
    traps: [
      "Confusing 401 (not authenticated) with 403 (authenticated, no permission).",
      "Thinking HTTP keeps a session on the connection: HTTP is stateless, the connection is only transport.",
      "Ignoring the cost of DNS + TCP + TLS: that is why keep-alive and HTTP/2 exist."
    ],
    rc: [
      ["What is the difference between 401 and 403?", "401: you are not authenticated (or the token is invalid). 403: you are authenticated but lack permission."],
      ["Why does reusing the connection (keep-alive) help?", "It avoids repeating DNS, TCP and TLS on every request, which lowers latency."]
    ]
  }
});

/* R05 */
window.QS.push({
  n: 105, g: "I", m: "playbook",
  pt: {
    s: "Upload de arquivos",
    q: "Como você trataria o upload de arquivos em uma aplicação web?",
    why: "Upload é uma sequência de decisões de segurança e de desempenho. Um playbook na ordem em que você as tomaria evita esquecer uma etapa que vira vulnerabilidade.",
    one: "Valide **no servidor** (tamanho, tipo real, quantidade), use **HTTPS e autenticação**, **nunca confie no nome do arquivo** (gere um nome único), guarde **fora de pasta executável** (de preferência em object storage), registre **metadados** no banco, use **URL pré-assinada e multipart** para arquivos grandes e processe (miniatura, antivírus) **de forma assíncrona**.",
    b: [
      { t: "st", ti: "Playbook", i: [
        ["Valide no servidor", "Tamanho máximo, tipo real (confira os bytes iniciais, o magic number, e não só a extensão ou o `Content-Type` enviado), quantidade de arquivos e, se possível, varredura de vírus."],
        ["Canal seguro e autenticado", "HTTPS; só quem tem permissão envia; limite de taxa e de tamanho no gateway para evitar abuso."],
        ["Nunca confie no nome do arquivo", "Gere um nome único (UUID) para evitar colisão e path traversal (`../../`). Guarde o nome original como metadado para o download."],
        ["Armazene fora do código executável", "Em object storage (S3, Blob) ou pasta sem permissão de execução, nunca na pasta pública servindo scripts."],
        ["Registre metadados", "Dono, nome original, tipo, tamanho, hash, data e local de armazenamento, no banco."],
        ["Arquivos grandes", "Upload direto ao storage por URL pré-assinada, multipart com retomada; o servidor não carrega o arquivo inteiro na memória (use streaming)."],
        ["Processe depois, de forma assíncrona", "Miniaturas, antivírus e conversões numa fila; o arquivo só fica disponível depois de aprovado."],
        ["Entrega", "Servir por URL temporária ou CDN, com `Content-Disposition` e `X-Content-Type-Options: nosniff`."]
      ] }
    ],
    traps: [
      "Confiar na extensão ou no `Content-Type` informado pelo cliente.",
      "Salvar com o nome enviado: sobrescreve arquivos e permite path traversal.",
      "Carregar o arquivo inteiro na memória do servidor.",
      "Servir uploads do mesmo domínio da aplicação: um HTML ou SVG enviado vira XSS."
    ],
    rc: [
      ["Por que gerar um novo nome para o arquivo enviado?", "Evita colisões e ataques de path traversal; o nome original vira só metadado."],
      ["Como receber arquivos muito grandes sem sobrecarregar o servidor?", "Com URL pré-assinada para o storage e upload multipart retomável; o servidor só valida e registra."]
    ]
  },
  en: {
    s: "File uploads",
    q: "How would you handle file uploads in a web application?",
    why: "An upload is a sequence of security and performance decisions. A playbook in the order you would take them avoids skipping a step that becomes a vulnerability.",
    one: "Validate **on the server** (size, real type, count), use **HTTPS and authentication**, **never trust the file name** (generate a unique one), store **outside executable folders** (preferably in object storage), record **metadata** in the database, use **pre-signed URLs and multipart** for large files and process (thumbnails, antivirus) **asynchronously**.",
    b: [
      { t: "st", ti: "Playbook", i: [
        ["Validate on the server", "Maximum size, real type (check the leading bytes, the magic number, not only the extension or the sent `Content-Type`), file count and, if possible, a virus scan."],
        ["Secure, authenticated channel", "HTTPS; only permitted users upload; rate and size limits at the gateway to avoid abuse."],
        ["Never trust the file name", "Generate a unique name (UUID) to avoid collisions and path traversal (`../../`). Keep the original name as metadata for download."],
        ["Store away from executable code", "In object storage (S3, Blob) or a folder without execute permission, never in the public folder serving scripts."],
        ["Record metadata", "Owner, original name, type, size, hash, date and storage location, in the database."],
        ["Large files", "Direct upload to storage through a pre-signed URL, resumable multipart; the server does not load the whole file into memory (use streaming)."],
        ["Process later, asynchronously", "Thumbnails, antivirus and conversions in a queue; the file becomes available only after approval."],
        ["Delivery", "Serve through a temporary URL or CDN, with `Content-Disposition` and `X-Content-Type-Options: nosniff`."]
      ] }
    ],
    traps: [
      "Trusting the extension or the `Content-Type` reported by the client.",
      "Saving under the sent name: it overwrites files and allows path traversal.",
      "Loading the entire file into server memory.",
      "Serving uploads from the application’s own domain: an uploaded HTML or SVG becomes XSS."
    ],
    rc: [
      ["Why generate a new name for the uploaded file?", "It avoids collisions and path-traversal attacks; the original name becomes just metadata."],
      ["How do you receive very large files without overloading the server?", "With a pre-signed URL to storage and a resumable multipart upload; the server only validates and records."]
    ]
  }
});

/* R06 */
window.QS.push({
  n: 106, g: "I", m: "playbook",
  pt: {
    s: "Testes para um novo endpoint",
    q: "Que tipos de testes você escreveria para um novo endpoint de API?",
    why: "Testar um endpoint é percorrer uma lista de cenários. Um playbook por categoria garante que você cubra além do caminho feliz.",
    one: "Cubra o endpoint por camadas: **unitários** para a regra de negócio, **integração** pelo endpoint real com banco de teste, e **carga** antes de ir para produção. Dentro dos de integração, teste o **caminho feliz**, a **validação**, a **autenticação e autorização**, os **erros e casos de borda**, as **falhas de dependências** e o **contrato** da resposta.",
    b: [
      { t: "st", ti: "O que cobrir", i: [
        ["Caminho feliz", "Entrada válida → status e corpo esperados, e o efeito no banco confirmado."],
        ["Validação", "Campos obrigatórios ausentes, tipos errados, limites (texto muito longo, número negativo) → `400` ou `422` com mensagem útil."],
        ["Autenticação e autorização", "Sem token → `401`. Usuário sem permissão, ou recurso de outro usuário → `403` ou `404`."],
        ["Erros e casos de borda", "Recurso inexistente (`404`), conflito (`409`), duplicidade, lista vazia, paginação, repetição da mesma requisição (idempotência)."],
        ["Falhas de dependências", "Banco ou API externa fora do ar → erro tratado (`5xx` controlado), timeout, retry."],
        ["Contrato", "Formato da resposta (esquema/OpenAPI), cabeçalhos e códigos estáveis para os consumidores."],
        ["Níveis", "Unitários para a regra; integração pelo endpoint real; carga/desempenho como etapa final antes de produção."]
      ] },
      { t: "cd", l: "javascript (jest + supertest)", c: `test("POST /pedidos sem token devolve 401", async () => {
  const r = await request(app).post("/pedidos").send({ itens: [] })
  expect(r.status).toBe(401)
})
test("usuario A nao le o pedido do usuario B", async () => {
  const r = await request(app).get("/pedidos/" + pedidoDoB.id).set(authComo(usuarioA))
  expect([403, 404]).toContain(r.status)
})` }
    ],
    traps: [
      "Testar só o caminho feliz.",
      "Mockar tanto que o teste não toca o banco nem a serialização reais.",
      "Testes que dependem da ordem de execução ou de dados do ambiente."
    ],
    rc: [
      ["Que teste cobre o acesso ao recurso de outro usuário?", "Autorização: autenticar como o usuário A e pedir o recurso do usuário B deve falhar (`403` ou `404`)."],
      ["Por que testar o contrato da resposta?", "Porque os consumidores dependem de campos e códigos estáveis; mudar sem perceber quebra os clientes."]
    ]
  },
  en: {
    s: "Tests for a new endpoint",
    q: "What kinds of tests would you write for a new API endpoint?",
    why: "Testing an endpoint means walking through a list of scenarios. A playbook by category ensures you cover more than the happy path.",
    one: "Cover the endpoint in layers: **unit** tests for the business rule, **integration** tests through the real endpoint with a test database, and **load** tests before going to production. Within integration, test the **happy path**, **validation**, **authentication and authorization**, **errors and edge cases**, **dependency failures** and the response **contract**.",
    b: [
      { t: "st", ti: "What to cover", i: [
        ["Happy path", "Valid input → expected status and body, with the effect on the database confirmed."],
        ["Validation", "Missing required fields, wrong types, limits (very long text, negative number) → `400` or `422` with a useful message."],
        ["Authentication and authorization", "No token → `401`. User without permission, or another user’s resource → `403` or `404`."],
        ["Errors and edge cases", "Nonexistent resource (`404`), conflict (`409`), duplicates, empty list, pagination, repeating the same request (idempotency)."],
        ["Dependency failures", "Database or external API down → handled error (controlled `5xx`), timeout, retry."],
        ["Contract", "Response format (schema/OpenAPI), headers and status codes stable for consumers."],
        ["Levels", "Unit for the rule; integration through the real endpoint; load/performance as the final step before production."]
      ] },
      { t: "cd", l: "javascript (jest + supertest)", c: `test("POST /orders without a token returns 401", async () => {
  const r = await request(app).post("/orders").send({ items: [] })
  expect(r.status).toBe(401)
})
test("user A cannot read user B's order", async () => {
  const r = await request(app).get("/orders/" + orderOfB.id).set(authAs(userA))
  expect([403, 404]).toContain(r.status)
})` }
    ],
    traps: [
      "Testing only the happy path.",
      "Mocking so much that the test never touches the real database or serialization.",
      "Tests that depend on execution order or environment data."
    ],
    rc: [
      ["Which test covers access to another user’s resource?", "Authorization: authenticate as user A and request user B’s resource; it should fail (`403` or `404`)."],
      ["Why test the response contract?", "Because consumers depend on stable fields and codes; changing them unnoticed breaks clients."]
    ]
  }
});

/* R07 */
window.QS.push({
  n: 107, g: "I", m: "trace",
  pt: {
    s: "Gerenciamento de sessão",
    q: "Descreva como funciona o gerenciamento de sessão em aplicações web.",
    why: "Uma sessão tem um ciclo de vida com início, uso e fim. Seguir o ID da sessão desde o login até o logout mostra cada decisão (onde guardar, como enviar, quando expirar).",
    one: "No login o servidor cria uma **sessão** com um **ID aleatório e imprevisível**, guarda os dados dela num armazenamento (de preferência Redis) e envia o ID ao cliente num **cookie** (`HttpOnly`, `Secure`, `SameSite`). A cada requisição o cliente reenvia o cookie e o servidor busca a sessão pelo ID. A sessão termina por **logout** ou **expiração**. Boa prática: gerar um **novo ID após o login**.",
    b: [
      { t: "fl", ti: "Ciclo de vida de uma sessão", n: ["Login válido", "Servidor cria a sessão (ID aleatório) e guarda os dados", "Envia o ID num cookie `HttpOnly; Secure; SameSite`", "Cliente reenvia o cookie a cada requisição", "Servidor busca a sessão pelo ID", "Logout ou expiração: a sessão é apagada"] },
      { t: "tb", ti: "Onde guardar a sessão", h: ["Local", "Quando usar"], r: [
        ["Memória do processo", "Só em desenvolvimento ou instância única: perde ao reiniciar e não escala"],
        ["Redis ou Memcached", "Padrão em produção: rápido, TTL nativo, compartilhado entre servidores"],
        ["Banco de dados", "Quando precisa de durabilidade e consulta; mais lento"],
        ["Dentro do cookie (assinado ou criptografado)", "Sem armazenamento no servidor, mas limite de ~4 KB e revogação difícil"]
      ] },
      { t: "tp", k: "key", h: "Boas práticas", x: "ID aleatório de 128 bits ou mais, **novo ID após o login** (evita fixação de sessão), expiração por inatividade e absoluta, invalidar no logout, e cookie com `HttpOnly`, `Secure` e `SameSite`. Veja a Q16 para comparar com JWT e OAuth." }
    ],
    traps: [
      "ID previsível, ou na URL (vaza em logs e no cabeçalho referer).",
      "Reaproveitar o mesmo ID antes e depois do login (fixação de sessão).",
      "Sessão sem expiração.",
      "Guardar a sessão em memória e escalar horizontalmente."
    ],
    rc: [
      ["Por que trocar o ID da sessão após o login?", "Para evitar fixação de sessão: um atacante que plantou um ID antes do login não ganha acesso autenticado."],
      ["O que cada flag do cookie de sessão faz?", "`HttpOnly` esconde o cookie do JavaScript, `Secure` só o envia por HTTPS e `SameSite` limita o envio em requisições de outros sites."]
    ]
  },
  en: {
    s: "Session management",
    q: "Describe how session management works in web applications.",
    why: "A session has a life cycle with a start, use and end. Following the session ID from login to logout shows each decision (where to store, how to send, when to expire).",
    one: "On login the server creates a **session** with a **random, unpredictable ID**, stores its data in a store (preferably Redis) and sends the ID to the client in a **cookie** (`HttpOnly`, `Secure`, `SameSite`). On every request the client resends the cookie and the server looks up the session by ID. The session ends by **logout** or **expiry**. Good practice: generate a **new ID after login**.",
    b: [
      { t: "fl", ti: "Life cycle of a session", n: ["Valid login", "Server creates the session (random ID) and stores the data", "Sends the ID in an `HttpOnly; Secure; SameSite` cookie", "Client resends the cookie on every request", "Server looks up the session by ID", "Logout or expiry: the session is deleted"] },
      { t: "tb", ti: "Where to store the session", h: ["Where", "When to use"], r: [
        ["Process memory", "Development or a single instance only: lost on restart and does not scale"],
        ["Redis or Memcached", "Production default: fast, native TTL, shared across servers"],
        ["Database", "When you need durability and querying; slower"],
        ["Inside the cookie (signed or encrypted)", "No server-side storage, but a ~4 KB limit and hard revocation"]
      ] },
      { t: "tp", k: "key", h: "Best practices", x: "Random ID of 128 bits or more, **new ID after login** (prevents session fixation), idle and absolute expiry, invalidate on logout, and a cookie with `HttpOnly`, `Secure` and `SameSite`. See Q16 to compare with JWT and OAuth." }
    ],
    traps: [
      "A predictable ID, or one in the URL (leaks in logs and the referer header).",
      "Reusing the same ID before and after login (session fixation).",
      "A session that never expires.",
      "Keeping the session in memory and scaling horizontally."
    ],
    rc: [
      ["Why change the session ID after login?", "To prevent session fixation: an attacker who planted an ID before login does not gain authenticated access."],
      ["What does each session-cookie flag do?", "`HttpOnly` hides the cookie from JavaScript, `Secure` sends it only over HTTPS and `SameSite` limits sending on requests from other sites."]
    ]
  }
});

/* R08 */
window.QS.push({
  n: 108, g: "I", m: "compare",
  pt: {
    s: "Versionamento de API",
    q: "Como você aborda o versionamento de API em seus projetos?",
    why: "Versionar é escolher entre estratégias com prós e contras diferentes. Uma matriz mais uma regra de decisão responde melhor do que uma lista.",
    one: "As formas comuns são a **versão no caminho** (`/v1/pedidos`), na **query** (`?v=1`), num **cabeçalho próprio** (`API-Version: 2`) ou na **negociação de conteúdo** (`Accept: application/vnd.x.v2+json`). A mais usada e mais clara é a do caminho. O essencial: **só crie versão nova para mudanças que quebram compatibilidade**, avise a depreciação com data e meça o uso antes de desligar a antiga.",
    b: [
      { t: "tb", h: ["Estratégia", "Exemplo", "Prós", "Contras"], r: [
        ["No caminho", "`/v1/pedidos`", "Visível, simples, fácil de rotear e de cachear", "A URL muda entre versões"],
        ["Na query", "`/pedidos?v=1`", "Fácil de testar", "Mistura versão com filtros; pior para cache e roteamento"],
        ["Cabeçalho próprio", "`API-Version: 2`", "URL estável", "Menos visível; difícil testar no navegador"],
        ["Negociação de conteúdo", "`Accept: application/vnd.x.v2+json`", "Fiel ao HTTP", "Mais complexo para os clientes"]
      ] },
      { t: "tp", k: "key", h: "Regra de decisão", x: "Na maioria dos casos, **versão no caminho** pela clareza. Mudança **aditiva** (campo novo opcional) não exige versão; mudança que **quebra** (remover ou renomear campo, mudar tipo ou semântica, tornar obrigatório algo opcional) exige." },
      { t: "st", ti: "Ciclo de vida de uma versão", i: [
        ["Lançar", "Documente o que mudou e como migrar."],
        ["Depreciar", "Avise com data (cabeçalhos `Deprecation` e `Sunset`), comunique os clientes."],
        ["Medir", "Acompanhe quem ainda usa cada versão."],
        ["Desligar", "Só depois do prazo e com o uso próximo de zero."]
      ] }
    ],
    traps: [
      "Criar versão nova a cada mudança, multiplicando o que precisa ser mantido.",
      "Desligar a versão antiga sem aviso nem métrica de uso.",
      "Versionar o código interno em vez do contrato público."
    ],
    rc: [
      ["O que é uma mudança que quebra compatibilidade?", "Remover ou renomear um campo, mudar tipo, formato ou significado, ou tornar obrigatório um parâmetro opcional."],
      ["Como retirar uma versão antiga com segurança?", "Anunciar a depreciação com data, medir quem ainda usa, avisar esses clientes e só então desligar."]
    ]
  },
  en: {
    s: "API versioning",
    q: "How do you approach API versioning in your projects?",
    why: "Versioning means choosing between strategies with different pros and cons. A matrix plus a decision rule answers better than a list.",
    one: "Common forms are **version in the path** (`/v1/orders`), in the **query** (`?v=1`), in a **custom header** (`API-Version: 2`) or via **content negotiation** (`Accept: application/vnd.x.v2+json`). The most used and clearest is the path. The essentials: **only create a new version for breaking changes**, announce deprecation with a date and measure usage before switching the old one off.",
    b: [
      { t: "tb", h: ["Strategy", "Example", "Pros", "Cons"], r: [
        ["In the path", "`/v1/orders`", "Visible, simple, easy to route and cache", "The URL changes between versions"],
        ["In the query", "`/orders?v=1`", "Easy to test", "Mixes version with filters; worse for caching and routing"],
        ["Custom header", "`API-Version: 2`", "Stable URL", "Less visible; hard to test in a browser"],
        ["Content negotiation", "`Accept: application/vnd.x.v2+json`", "Faithful to HTTP", "More complex for clients"]
      ] },
      { t: "tp", k: "key", h: "Decision rule", x: "In most cases, **version in the path** for clarity. An **additive** change (new optional field) needs no version; a **breaking** change (removing or renaming a field, changing type or semantics, making something optional required) does." },
      { t: "st", ti: "Life cycle of a version", i: [
        ["Release", "Document what changed and how to migrate."],
        ["Deprecate", "Announce with a date (`Deprecation` and `Sunset` headers), notify clients."],
        ["Measure", "Track who still uses each version."],
        ["Switch off", "Only after the deadline and with usage near zero."]
      ] }
    ],
    traps: [
      "Creating a new version for every change, multiplying what must be maintained.",
      "Switching off the old version with no notice or usage metric.",
      "Versioning internal code instead of the public contract."
    ],
    rc: [
      ["What is a breaking change?", "Removing or renaming a field, changing type, format or meaning, or making an optional parameter required."],
      ["How do you retire an old version safely?", "Announce deprecation with a date, measure who still uses it, notify those clients and only then switch it off."]
    ]
  }
});

/* R09 */
window.QS.push({
  n: 109, g: "I", alias: 17,
  pt: { s: "Proteger contra injeção SQL", q: "Como você protege um servidor contra ataques de injeção SQL?" },
  en: { s: "Protecting against SQL injection", q: "How do you protect a server from SQL injection attacks?" }
});

/* R10 */
window.QS.push({
  n: 110, g: "I", m: "feynman",
  pt: {
    s: "Statelessness do HTTP",
    q: "Explique o conceito de statelessness no HTTP e como ele impacta os serviços de backend.",
    why: "Stateless parece abstrato, mas uma analogia (um atendente sem memória) deixa o conceito óbvio, e o ponto em que ela falha (o estado só muda de lugar) traz o impacto real.",
    one: "HTTP é **stateless**: cada requisição é independente e o servidor não guarda nada da anterior. Se a aplicação precisa de continuidade (login, carrinho), o estado vai **com a requisição** (token, ID de sessão) ou fica **fora do processo** (Redis, banco). O impacto é positivo para a escala (qualquer instância atende qualquer requisição) e exige que o estado seja gerenciado de propósito.",
    b: [
      { t: "an",
        s: "Um atendente com amnésia: a cada visita ele não lembra de você, então você mostra o crachá e o pedido completo toda vez.",
        k: "O servidor trata cada requisição como nova. Para continuidade, o estado viaja **na requisição** (cookie com ID de sessão, token) ou fica **num armazenamento compartilhado**. Consequência: qualquer instância pode atender qualquer requisição, o que permite escalar horizontalmente, reiniciar e substituir servidores sem perder usuários.",
        b: "O estado não desapareceu, só mudou de lugar. Alguém precisa guardá-lo (cliente, cache ou banco), e isso tem custo e riscos (token roubado, cache fora do ar)." },
      { t: "tb", ti: "Onde o estado pode ficar", h: ["Onde", "Exemplo", "Consequência"], r: [
        ["No cliente", "JWT, cookie com dados", "Servidor leve; token difícil de revogar e dado exposto"],
        ["Em armazenamento compartilhado", "Sessão no Redis, carrinho no banco", "Revogável e confiável; dependência extra"],
        ["Na memória do servidor", "Sessão em RAM", "Exige sticky session e perde o estado ao reiniciar"]
      ] }
    ],
    traps: [
      "Guardar estado na memória do processo e escalar horizontalmente.",
      "Entender stateless como “sem estado em lugar nenhum”.",
      "Confundir HTTP stateless com uma conexão TCP persistente."
    ],
    rc: [
      ["Por que stateless facilita escalar?", "Porque qualquer instância responde qualquer requisição; basta adicionar mais atrás do balanceador."],
      ["Como manter o usuário logado num protocolo stateless?", "Enviando a cada requisição um token ou ID de sessão, cujo estado fica no próprio token ou num armazenamento compartilhado."]
    ]
  },
  en: {
    s: "HTTP statelessness",
    q: "Explain the concept of statelessness in HTTP and how it impacts backend services.",
    why: "Stateless sounds abstract, but an analogy (an attendant with no memory) makes it obvious, and the point where it fails (state just moves elsewhere) brings the real impact.",
    one: "HTTP is **stateless**: each request is independent and the server keeps nothing from the previous one. If the application needs continuity (login, cart), the state goes **with the request** (token, session ID) or lives **outside the process** (Redis, database). The impact is positive for scale (any instance serves any request) and requires state to be managed on purpose.",
    b: [
      { t: "an",
        s: "An attendant with amnesia: on every visit they do not remember you, so you show your badge and the full request each time.",
        k: "The server treats each request as new. For continuity, state travels **in the request** (cookie with a session ID, token) or lives **in a shared store**. Consequence: any instance can serve any request, which allows horizontal scaling, restarting and replacing servers without losing users.",
        b: "State did not disappear, it just moved. Someone must store it (client, cache or database), and that has cost and risks (stolen token, cache down)." },
      { t: "tb", ti: "Where state can live", h: ["Where", "Example", "Consequence"], r: [
        ["On the client", "JWT, cookie with data", "Light server; token hard to revoke and data exposed"],
        ["In shared storage", "Session in Redis, cart in the database", "Revocable and reliable; extra dependency"],
        ["In server memory", "Session in RAM", "Needs sticky sessions and loses state on restart"]
      ] }
    ],
    traps: [
      "Keeping state in process memory and scaling horizontally.",
      "Reading stateless as “no state anywhere”.",
      "Confusing stateless HTTP with a persistent TCP connection."
    ],
    rc: [
      ["Why does stateless make scaling easier?", "Because any instance answers any request; you just add more behind the load balancer."],
      ["How do you keep a user logged in over a stateless protocol?", "By sending a token or session ID on each request, whose state lives in the token itself or in a shared store."]
    ]
  }
});

/* R11 */
window.QS.push({
  n: 111, g: "I", m: "feynman",
  pt: {
    s: "Containerização",
    q: "O que é containerização e como ela beneficia o desenvolvimento de backend?",
    why: "O contêiner de navio é a analogia que todo mundo já usa para este conceito. Ela dá a intuição, e o ponto em que quebra (compartilha o kernel) é o que separa contêiner de máquina virtual.",
    one: "Containerização **empacota a aplicação com suas dependências** numa imagem que roda como um **processo isolado** do sistema (usando recursos do kernel como namespaces e cgroups). É muito mais leve que uma VM e garante o **mesmo ambiente** do desenvolvimento à produção. Benefícios: consistência, isolamento de dependências, deploy e rollback por troca de imagem, escala com orquestradores (Kubernetes) e CI/CD reprodutível.",
    b: [
      { t: "an",
        s: "O contêiner de navio: a carga vai numa caixa de tamanho padrão, e o porto, o navio e o caminhão não precisam saber o que há dentro. Funciona igual em qualquer lugar.",
        k: "Uma **imagem** é o pacote imutável (runtime, bibliotecas, código, configuração padrão); um **contêiner** é uma instância em execução dela. Como compartilha o kernel do host, é um processo isolado, sem sistema operacional próprio, então sobe em segundos e ocupa dezenas de MB. A mesma imagem que passou nos testes é a que vai para produção.",
        b: "O contêiner **compartilha o kernel** do host, então isola menos que uma VM (segurança, outro sistema operacional). E “funciona na minha máquina” vira “funciona no contêiner”, mas dados, rede e segredos ainda exigem cuidado." },
      { t: "tb", ti: "Contêiner vs máquina virtual", h: ["", "Contêiner", "VM"], r: [
        ["Isolamento", "Processo (kernel compartilhado)", "Sistema operacional completo"],
        ["Tamanho", "Dezenas a centenas de MB", "Gigabytes"],
        ["Inicialização", "Segundos ou menos", "Minutos"],
        ["Densidade", "Muitos por servidor", "Poucos"]
      ] }
    ],
    traps: [
      "Guardar dados importantes dentro do contêiner: ele é descartável (use volumes ou serviços externos).",
      "Imagem enorme, com ferramentas de build e segredos dentro.",
      "Rodar como root dentro do contêiner.",
      "Achar que o contêiner é uma fronteira de segurança tão forte quanto uma VM."
    ],
    rc: [
      ["Qual a diferença entre imagem e contêiner?", "A imagem é o pacote imutável (o modelo); o contêiner é uma instância em execução dessa imagem."],
      ["Por que contêineres são mais leves que VMs?", "Compartilham o kernel do host em vez de trazer um sistema operacional completo por instância."]
    ]
  },
  en: {
    s: "Containerization",
    q: "What is containerization and how does it benefit backend development?",
    why: "The shipping container is the analogy everyone already uses for this concept. It gives the intuition, and the point where it breaks (shared kernel) is what separates a container from a virtual machine.",
    one: "Containerization **packages the application with its dependencies** into an image that runs as a **process isolated** from the system (using kernel features like namespaces and cgroups). It is far lighter than a VM and guarantees the **same environment** from development to production. Benefits: consistency, dependency isolation, deploy and rollback by swapping images, scaling with orchestrators (Kubernetes) and reproducible CI/CD.",
    b: [
      { t: "an",
        s: "The shipping container: the cargo goes in a standard-sized box, and the port, the ship and the truck do not need to know what is inside. It works the same anywhere.",
        k: "An **image** is the immutable package (runtime, libraries, code, default configuration); a **container** is a running instance of it. Since it shares the host kernel, it is an isolated process with no operating system of its own, so it starts in seconds and takes tens of MB. The same image that passed the tests is the one that goes to production.",
        b: "The container **shares the host kernel**, so it isolates less than a VM (security, a different operating system). And “works on my machine” becomes “works in the container”, but data, network and secrets still need care." },
      { t: "tb", ti: "Container vs virtual machine", h: ["", "Container", "VM"], r: [
        ["Isolation", "Process (shared kernel)", "Full operating system"],
        ["Size", "Tens to hundreds of MB", "Gigabytes"],
        ["Startup", "Seconds or less", "Minutes"],
        ["Density", "Many per server", "Few"]
      ] }
    ],
    traps: [
      "Storing important data inside the container: it is disposable (use volumes or external services).",
      "A huge image with build tools and secrets inside.",
      "Running as root inside the container.",
      "Believing the container is as strong a security boundary as a VM."
    ],
    rc: [
      ["What is the difference between an image and a container?", "The image is the immutable package (the template); the container is a running instance of that image."],
      ["Why are containers lighter than VMs?", "They share the host kernel instead of bringing a full operating system per instance."]
    ]
  }
});

/* R12 */
window.QS.push({
  n: 112, g: "I", m: "threat",
  pt: {
    s: "Proteger uma API nova",
    q: "Que medidas você tomaria para proteger uma API recém-desenvolvida?",
    why: "Proteger uma API é fechar cada risco com uma medida específica. O formato ameaça → defesa mostra o que cada medida impede, para você não aplicá-las por ritual.",
    one: "Combine **autenticação** (OAuth/OIDC, JWT de vida curta ou chave de API), **autorização por recurso em cada endpoint**, **HTTPS** em todo tráfego, **CORS** com allowlist, **validação de entrada** e consultas parametrizadas, **rate limiting**, respostas **sem dados em excesso**, **segredos em cofre** e **logs e testes de segurança**. O erro mais comum é autenticar e esquecer a **autorização por objeto**.",
    b: [
      { t: "pr", a: "Risco", b: "Medida", r: [
        ["Qualquer um chama a API", "**Autenticação**: OAuth 2.0/OIDC, JWT de vida curta ou chave de API; nunca credenciais na URL."],
        ["Um usuário acessa dados de outro", "**Autorização** por recurso e por ação em cada endpoint, negando por padrão."],
        ["Dados interceptados", "**HTTPS/TLS** em todo o tráfego e HSTS."],
        ["Sites de outras origens lendo respostas", "**CORS** com allowlist explícita."],
        ["Entrada maliciosa", "**Validação** de tipo, tamanho e formato, e consultas parametrizadas."],
        ["Abuso e força bruta", "**Rate limiting** e cotas por cliente."],
        ["Dados em excesso e erros detalhados", "Devolva só os campos necessários; não exponha stack traces, IDs internos nem dados sensíveis."],
        ["Segredos vazados", "Segredos em cofre, não no repositório; rotação de chaves."],
        ["Falhas despercebidas", "Logs de segurança, auditoria, alertas, e testes (SAST/DAST, varredura de dependências)."]
      ] },
      { t: "tp", k: "key", h: "O risco nº 1 em APIs", x: "No OWASP API Security Top 10 o primeiro item é a **quebra de autorização por objeto** (BOLA/IDOR): acessar `/pedidos/123` de outro usuário só trocando o ID. Autenticar não basta. Veja também a Q19." }
    ],
    traps: [
      "Autenticar e esquecer a autorização por objeto.",
      "`CORS: *` combinado com credenciais, ou em API sensível.",
      "Expor mensagens de erro detalhadas ao cliente.",
      "Segredos no código ou em variáveis de build públicas."
    ],
    rc: [
      ["Qual a diferença entre autenticação e autorização?", "Autenticação confirma quem você é; autorização decide o que você pode fazer com cada recurso."],
      ["Qual o principal risco de APIs segundo o OWASP?", "A quebra de autorização por objeto (BOLA/IDOR): acessar o recurso de outro usuário ao trocar um ID."]
    ]
  },
  en: {
    s: "Securing a new API",
    q: "What measures would you take to secure a newly developed API?",
    why: "Securing an API means closing each risk with a specific measure. The threat → defense format shows what each measure prevents, so you do not apply them as ritual.",
    one: "Combine **authentication** (OAuth/OIDC, short-lived JWT or an API key), **per-resource authorization on every endpoint**, **HTTPS** on all traffic, **CORS** with an allowlist, **input validation** and parameterized queries, **rate limiting**, responses **without excess data**, **secrets in a vault**, and **security logs and tests**. The most common mistake is authenticating and forgetting **object-level authorization**.",
    b: [
      { t: "pr", a: "Risk", b: "Measure", r: [
        ["Anyone can call the API", "**Authentication**: OAuth 2.0/OIDC, short-lived JWT or an API key; never credentials in the URL."],
        ["One user reads another’s data", "**Authorization** per resource and action on every endpoint, deny by default."],
        ["Data intercepted", "**HTTPS/TLS** on all traffic and HSTS."],
        ["Other origins reading responses", "**CORS** with an explicit allowlist."],
        ["Malicious input", "**Validation** of type, size and format, plus parameterized queries."],
        ["Abuse and brute force", "**Rate limiting** and per-client quotas."],
        ["Excess data and detailed errors", "Return only the needed fields; do not expose stack traces, internal IDs or sensitive data."],
        ["Leaked secrets", "Secrets in a vault, not in the repository; key rotation."],
        ["Unnoticed failures", "Security logs, auditing, alerts, and tests (SAST/DAST, dependency scanning)."]
      ] },
      { t: "tp", k: "key", h: "The #1 API risk", x: "In the OWASP API Security Top 10 the first item is **broken object-level authorization** (BOLA/IDOR): reading another user’s `/orders/123` just by changing the ID. Authenticating is not enough. See also Q19." }
    ],
    traps: [
      "Authenticating and forgetting object-level authorization.",
      "`CORS: *` combined with credentials, or on a sensitive API.",
      "Exposing detailed error messages to the client.",
      "Secrets in code or in public build variables."
    ],
    rc: [
      ["What is the difference between authentication and authorization?", "Authentication confirms who you are; authorization decides what you may do with each resource."],
      ["What is the main API risk according to OWASP?", "Broken object-level authorization (BOLA/IDOR): reading another user’s resource by changing an ID."]
    ]
  }
});

/* R13 */
window.QS.push({
  n: 113, g: "I", m: "playbook",
  pt: {
    s: "Escalar num pico de tráfego",
    q: "Como você escalaria uma aplicação backend durante um pico de tráfego?",
    why: "Um pico tem antes, durante e depois. Um playbook por fase mostra o que preparar para que a escala funcione no momento em que for preciso.",
    one: "A resposta direta é **escala horizontal**: várias instâncias **stateless** atrás de um **balanceador de carga**, com **autoscaling**. Prepare antes (stateless, cache, fila, réplicas de leitura), adicione instâncias durante o pico, **proteja o essencial** (rate limit, load shedding, degradação graciosa) e aprenda depois. Lembre que o banco costuma ser o próximo gargalo. Para a conta completa, veja a Q15.",
    b: [
      { t: "st", ti: "Playbook", i: [
        ["Antes: aplicação stateless", "Sessão fora do processo e nada de arquivos locais: qualquer instância atende qualquer requisição."],
        ["Antes: autoscaling", "Várias instâncias atrás de um balanceador, com regra de escala por CPU, requisições por instância ou latência, e um mínimo de instâncias aquecidas."],
        ["Antes: alivie o que é caro", "Cache e CDN para leituras repetidas, fila para o que pode esperar, réplicas de leitura e pool de conexões."],
        ["Durante: escala horizontal", "Mais cópias atrás do balanceador. Atenção ao tempo de subida e ao próximo gargalo, o banco."],
        ["Durante: proteja o essencial", "Rate limit, load shedding (descartar o menos importante), degradação graciosa (desligar recursos opcionais) e backpressure."],
        ["Depois: aprenda", "Teste de carga com o pico observado, revise limites e alertas, ajuste a capacidade mínima."]
      ] },
      { t: "tp", k: "warn", h: "Vertical vs horizontal", x: "Escala **vertical** (máquina maior) é rápida, mas tem teto e costuma exigir reinício. **Horizontal** (mais instâncias) é a resposta para picos, e só funciona bem com aplicação stateless." }
    ],
    traps: [
      "Escalar a aplicação e esquecer o banco, que satura primeiro.",
      "Autoscaling lento: a instância nova chega depois do pico.",
      "Estado em memória que impede escalar horizontalmente.",
      "Escalar sem proteção: o custo dispara e um ataque também passa a ser atendido."
    ],
    rc: [
      ["Por que a aplicação precisa ser stateless para escalar horizontalmente?", "Porque qualquer instância tem de poder atender qualquer requisição; estado local prende o usuário a uma máquina."],
      ["O que fazer quando o pico passa da capacidade mesmo escalando?", "Proteger o essencial: rate limit, load shedding e degradação graciosa."]
    ]
  },
  en: {
    s: "Scaling during a traffic surge",
    q: "How would you scale a backend application during a traffic surge?",
    why: "A surge has a before, a during and an after. A playbook by phase shows what to prepare so scaling works at the moment it is needed.",
    one: "The direct answer is **horizontal scaling**: several **stateless** instances behind a **load balancer**, with **autoscaling**. Prepare ahead (stateless, cache, queue, read replicas), add instances during the surge, **protect the essentials** (rate limiting, load shedding, graceful degradation) and learn afterwards. Remember the database is often the next bottleneck. For the full math, see Q15.",
    b: [
      { t: "st", ti: "Playbook", i: [
        ["Before: stateless application", "Session outside the process and no local files: any instance serves any request."],
        ["Before: autoscaling", "Several instances behind a load balancer, with a scaling rule on CPU, requests per instance or latency, and a minimum of warm instances."],
        ["Before: relieve what is expensive", "Cache and CDN for repeated reads, a queue for what can wait, read replicas and connection pooling."],
        ["During: horizontal scaling", "More copies behind the load balancer. Mind startup time and the next bottleneck, the database."],
        ["During: protect the essentials", "Rate limiting, load shedding (drop the least important), graceful degradation (turn off optional features) and backpressure."],
        ["After: learn", "Load test with the observed peak, review limits and alerts, adjust minimum capacity."]
      ] },
      { t: "tp", k: "warn", h: "Vertical vs horizontal", x: "**Vertical** scaling (a bigger machine) is quick but has a ceiling and usually needs a restart. **Horizontal** (more instances) is the answer to surges, and works well only with a stateless application." }
    ],
    traps: [
      "Scaling the application and forgetting the database, which saturates first.",
      "Slow autoscaling: the new instance arrives after the surge.",
      "In-memory state that blocks horizontal scaling.",
      "Scaling without protection: costs spike and an attack also gets served."
    ],
    rc: [
      ["Why must the application be stateless to scale horizontally?", "Because any instance must be able to serve any request; local state ties the user to one machine."],
      ["What do you do when the surge exceeds capacity even after scaling?", "Protect the essentials: rate limiting, load shedding and graceful degradation."]
    ]
  }
});

/* R14 */
window.QS.push({
  n: 114, g: "I", m: "playbook",
  pt: {
    s: "Depurar um backend",
    q: "Que ferramentas e técnicas você usa para depurar uma aplicação backend?",
    why: "Depurar é um método com ferramentas diferentes por ambiente. Um playbook separa o que se usa na sua máquina do que se usa no servidor.",
    one: "Na sua máquina, use o **debugger da IDE** (breakpoints, inspeção, passo a passo) e um **teste que reproduza** o bug. No servidor, use **observabilidade**: logs estruturados com ID da requisição, métricas, tracing, relatório de erros (Sentry) e APM. O método é o mesmo: **reproduzir, isolar, formular hipótese, corrigir a causa e deixar um teste de regressão**.",
    b: [
      { t: "tb", ti: "Por ambiente", h: ["Ambiente", "Ferramentas e técnicas"], r: [
        ["Local", "Debugger da IDE (breakpoints, watch, passo a passo), testes que reproduzem o bug, logs em nível debug"],
        ["Staging e produção", "Logs estruturados com trace ID, métricas e dashboards, tracing distribuído, relatório de erros (Sentry), APM (New Relic, Datadog)"],
        ["Desempenho", "Profilers e flame graphs (`pprof`, clinic.js, async-profiler), `EXPLAIN` no banco"],
        ["Rede e integração", "`curl`, Postman, logs do proxy, captura de pacotes (Wireshark) quando necessário"]
      ] },
      { t: "st", ti: "O método", i: [
        ["Reproduza", "Ache o menor caso que dispara o problema e escreva um teste que falhe."],
        ["Isole", "Bissecção: qual versão, qual endpoint, qual dado, qual dependência."],
        ["Hipótese e observação", "Use logs, métricas e debugger para confirmar a causa, e não só o sintoma."],
        ["Corrija e proteja", "Corrija a causa-raiz e deixe o teste de regressão. Veja também as Q27 e Q28."]
      ] }
    ],
    traps: [
      "Mexer no código por palpite antes de reproduzir o problema.",
      "Pausar uma instância de produção com breakpoint.",
      "Logs sem contexto (sem ID da requisição).",
      "Corrigir o sintoma e não a causa."
    ],
    rc: [
      ["Como depurar algo que só acontece em produção?", "Com observabilidade: logs estruturados com trace ID, métricas, tracing e relatório de erros, mais um teste que reproduza o caso em ambiente controlado."],
      ["Por que escrever um teste antes de corrigir?", "Prova que você reproduziu o bug e impede que ele volte (regressão)."]
    ]
  },
  en: {
    s: "Debugging a backend",
    q: "What tools and techniques do you use for debugging a backend application?",
    why: "Debugging is a method with different tools per environment. A playbook separates what you use on your machine from what you use on the server.",
    one: "On your machine, use the **IDE debugger** (breakpoints, inspection, stepping) and a **test that reproduces** the bug. On the server, use **observability**: structured logs with a request ID, metrics, tracing, error reporting (Sentry) and APM. The method is the same: **reproduce, isolate, form a hypothesis, fix the cause and leave a regression test**.",
    b: [
      { t: "tb", ti: "By environment", h: ["Environment", "Tools and techniques"], r: [
        ["Local", "IDE debugger (breakpoints, watch, stepping), tests that reproduce the bug, debug-level logs"],
        ["Staging and production", "Structured logs with trace ID, metrics and dashboards, distributed tracing, error reporting (Sentry), APM (New Relic, Datadog)"],
        ["Performance", "Profilers and flame graphs (`pprof`, clinic.js, async-profiler), `EXPLAIN` on the database"],
        ["Network and integration", "`curl`, Postman, proxy logs, packet capture (Wireshark) when needed"]
      ] },
      { t: "st", ti: "The method", i: [
        ["Reproduce", "Find the smallest case that triggers the problem and write a failing test."],
        ["Isolate", "Bisect: which version, endpoint, data, dependency."],
        ["Hypothesis and observation", "Use logs, metrics and the debugger to confirm the cause, not just the symptom."],
        ["Fix and protect", "Fix the root cause and leave the regression test. See also Q27 and Q28."]
      ] }
    ],
    traps: [
      "Changing code by guesswork before reproducing the problem.",
      "Pausing a production instance with a breakpoint.",
      "Logs with no context (no request ID).",
      "Fixing the symptom and not the cause."
    ],
    rc: [
      ["How do you debug something that only happens in production?", "With observability: structured logs with trace ID, metrics, tracing and error reporting, plus a test that reproduces the case in a controlled environment."],
      ["Why write a test before fixing?", "It proves you reproduced the bug and prevents it from coming back (regression)."]
    ]
  }
});

/* R15 */
window.QS.push({
  n: 115, g: "I", m: "whys",
  pt: {
    s: "Código manutenível",
    q: "Como você garante que seu código de backend seja fácil de manter e entender?",
    why: "Cada prática de manutenibilidade responde a um custo concreto. A cadeia de porquês liga cada hábito (nomes, módulos, testes, refatoração) ao problema que ele evita.",
    one: "Código manutenível é aquele cuja **próxima mudança é barata e segura**. Para isso: **nomes e funções claros**, **módulos coesos e pouco acoplados**, **testes automatizados**, **refatoração contínua**, **padrões automatizados** (linter, formatador, revisão de código) e **comentários que explicam o porquê**, não o que o código já diz. Tratamento de erros consistente também conta.",
    b: [
      { t: "why", rows: [
        ["Por que manutenibilidade importa?", "Porque o código é lido e alterado muito mais vezes do que é escrito: o custo real está em mudá-lo com segurança."],
        ["Por que nomes e estrutura claros?", "Porque quem lê precisa entender a intenção sem decifrar a implementação. **Nomes que revelam intenção** e funções pequenas com uma responsabilidade reduzem o esforço de leitura."],
        ["Por que módulos coesos e pouco acoplados?", "Porque uma mudança deve ficar num lugar só. **Modularidade** isola o impacto e permite alterar uma parte sem quebrar outras."],
        ["Por que testes automatizados?", "Porque ninguém muda com segurança o que não consegue verificar. Os **testes** dão coragem para refatorar."],
        ["Por que refatorar com frequência e padronizar?", "Porque a dívida técnica cresce com juros. **Refatoração contínua**, linters, formatadores e revisão de código mantêm o padrão e evitam o acúmulo."]
      ], root: "Código manutenível é **legível, modular, testado e consistente**, de modo que a próxima mudança seja barata e segura." },
      { t: "tp", k: "tip", h: "Comentários", x: "Comente o **porquê** (decisão, restrição, armadilha) e deixe o **o quê** para o próprio código. Padronize também as mensagens e o tratamento de erros em toda a plataforma." }
    ],
    traps: [
      "Comentar o óbvio e deixar o “porquê” sem registro.",
      "Abstrações prematuras: complexidade sem necessidade.",
      "Refatorar sem testes.",
      "Regras de estilo sem automação (linter e formatador)."
    ],
    rc: [
      ["O que um comentário deve explicar?", "A razão da decisão (o porquê), sem repetir o que o código já mostra."],
      ["Que prática dá segurança para refatorar?", "Testes automatizados."]
    ]
  },
  en: {
    s: "Maintainable code",
    q: "How do you ensure your backend code is maintainable and easy to understand?",
    why: "Each maintainability practice answers a concrete cost. The chain of whys ties each habit (names, modules, tests, refactoring) to the problem it prevents.",
    one: "Maintainable code is code whose **next change is cheap and safe**. For that: **clear names and functions**, **cohesive, loosely coupled modules**, **automated tests**, **continuous refactoring**, **automated standards** (linter, formatter, code review) and **comments that explain why**, not what the code already says. Consistent error handling counts too.",
    b: [
      { t: "why", rows: [
        ["Why does maintainability matter?", "Because code is read and changed far more often than it is written: the real cost is changing it safely."],
        ["Why clear names and structure?", "Because the reader must grasp intent without decoding the implementation. **Intention-revealing names** and small single-purpose functions cut reading effort."],
        ["Why cohesive, loosely coupled modules?", "Because a change should stay in one place. **Modularity** isolates impact and lets you alter one part without breaking others."],
        ["Why automated tests?", "Because nobody safely changes what they cannot verify. **Tests** give the courage to refactor."],
        ["Why refactor often and standardize?", "Because technical debt accrues interest. **Continuous refactoring**, linters, formatters and code review keep the standard and prevent buildup."]
      ], root: "Maintainable code is **readable, modular, tested and consistent**, so the next change is cheap and safe." },
      { t: "tp", k: "tip", h: "Comments", x: "Comment the **why** (decision, constraint, trap) and leave the **what** to the code itself. Also standardize messages and error handling across the platform." }
    ],
    traps: [
      "Commenting the obvious and leaving the “why” unrecorded.",
      "Premature abstractions: complexity without need.",
      "Refactoring without tests.",
      "Style rules without automation (linter and formatter)."
    ],
    rc: [
      ["What should a comment explain?", "The reason for the decision (the why), without repeating what the code already shows."],
      ["Which practice gives safety to refactor?", "Automated tests."]
    ]
  }
});
