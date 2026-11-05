import type { Pergunta } from "../../tipos";

// Q136 · IDOR e BOLA
export const q136: Pergunta = {
  numero: 136,
  modulo: "ataques-e-depuracao",
  metodo: "threat",
  pt: {
    titulo: "IDOR e BOLA",
    pergunta:
      "O que são IDOR e BOLA (Broken Object Level Authorization)? Como ocorrem em APIs e como evitá-los e testá-los?",
    porqueEsteMetodo:
      "IDOR e BOLA são simples de explicar e muito comuns, e a defesa depende de entender onde a checagem falta. Os pares mostram como a falha ocorre e como evitá-la, e os passos mostram como testá-la.",
    resposta30s:
      "**IDOR** (referência direta insegura a objeto) é o nome clássico e **BOLA** o nome da lista OWASP de APIs para a mesma falha: a API autentica o usuário, mas **não confere se aquele objeto é dele**, e basta trocar o `id` na requisição para ler ou alterar dados alheios. A causa é autorização só no login ou na rota; a cura é **checar propriedade e permissão em todo acesso a objeto**, no servidor e de preferência na própria consulta, com política central e negação por padrão (IDs imprevisíveis ajudam, mas não substituem a checagem). Teste com dois usuários e uma **matriz de acesso automatizada**.",
    blocos: [
      {
        tipo: "pares",
        titulo: "IDOR e BOLA: como ocorre → como evitar",
        rotuloOrigem: "Como ocorre",
        rotuloDestino: "Como evitar",
        pares: [
          {
            origem:
              "**Troca do identificador**: `GET /pedidos/1001` vira `/pedidos/1002` e devolve o pedido de outro cliente. O ID pode estar no caminho, na query, no corpo JSON, em cabeçalhos ou em objetos aninhados.",
            destino:
              "Autorizar **cada acesso a objeto** no servidor: a decisão leva sujeito, ação e objeto (`pode(usuario, 'ler', pedido)`). Autenticou não quer dizer liberou.",
          },
          {
            origem:
              "A checagem olha só a rota ou o papel (“é cliente?”), nunca a relação com o objeto (“este pedido é deste cliente?”).",
            destino:
              "Pôr o dono ou o tenant **na própria consulta** (`WHERE id = $1 AND cliente_id = $2`), com o sujeito vindo do token validado, e não de um campo da requisição.",
          },
          {
            origem:
              "Só o `GET` foi protegido; `PUT`, `PATCH`, `DELETE`, ações em lote, rotas aninhadas e os resolvers de campo do GraphQL ficaram abertos.",
            destino:
              "Política **centralizada** (middleware, decorator, biblioteca de políticas, PEP e PDP: veja Q114 e Q115) aplicada a todos os caminhos, com **negação por padrão** para rota sem política declarada.",
          },
          {
            origem: "IDs sequenciais deixam o alvo fácil de varrer: 1001, 1002, 1003…",
            destino:
              "IDs imprevisíveis (UUID aleatório, ULID) dificultam a varredura, mas são **camada extra**, não a defesa. Responder 404 (e não 403) para o objeto alheio evita confirmar que ele existe.",
          },
          {
            origem: "Banco compartilhado entre tenants: um filtro esquecido numa consulta vaza dados de outro cliente.",
            destino:
              "Isolamento também no banco: **row-level security** (por exemplo, no PostgreSQL) e escopo de tenant na camada de dados, como rede de segurança atrás da checagem da aplicação (veja Q117).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Autenticou, mas não verificou de quem é o objeto",
        legenda: "TypeScript",
        codigo: `// VULNERÁVEL: autenticou, mas não verificou de quem é o pedido
app.get("/pedidos/:id", autenticar, async (req, res) => {
  const { rows } = await db.query("SELECT * FROM pedidos WHERE id = $1", [req.params.id]);
  res.json(rows[0]);
});

// CORRETO: o dono vem do token e faz parte da própria consulta
app.get("/pedidos/:id", autenticar, async (req, res) => {
  const { rows } = await db.query(
    "SELECT id, status, total FROM pedidos WHERE id = $1 AND tenant_id = $2 AND cliente_id = $3",
    [req.params.id, req.usuario.tenantId, req.usuario.id],
  );
  if (rows.length === 0) return res.sendStatus(404); // não revela se o pedido existe
  res.json(rows[0]);
});`,
        nota: "Quando há papéis como suporte ou administrador, a regra entra na política central (por exemplo, `pode(usuario, 'ler', pedido)`), e não num `if` solto em cada rota. A consulta devolve só as colunas necessárias, o que também evita expor propriedades demais.",
      },
      {
        tipo: "pares",
        titulo: "Outras falhas comuns de controle de acesso",
        rotuloOrigem: "Falha",
        rotuloDestino: "Mitigação",
        pares: [
          {
            origem:
              "**Função administrativa exposta (BFLA)**: `/admin/usuarios` ou `DELETE /usuarios/:id` acessível a quem só tem papel comum.",
            destino:
              "Autorização **por função** em cada endpoint (escopo ou papel exigido declarado), rotas administrativas separadas e protegidas, e testes para todos os verbos.",
          },
          {
            origem:
              "**Mass assignment**: o corpo `{ nome: 'Ana', papel: 'admin' }` grava campos que o cliente não deveria definir, ou a resposta devolve propriedades internas.",
            destino:
              "DTO com **lista permitida** de campos graváveis e de campos devolvidos (autorização por propriedade). Nunca ligar o corpo direto ao modelo de dados.",
          },
          {
            origem:
              "**Controle só no cliente**: botão escondido, rota “protegida” apenas no front-end, ou decisão baseada em dado do cliente (`isAdmin: true`, cookie editável).",
            destino:
              "Toda decisão no servidor, com dados do token validado ou do banco. O front-end só mostra ou esconde.",
          },
          {
            origem:
              "**Acesso forçado e caminhos**: `/relatorios/2023.pdf` adivinhado, `../` em nomes de arquivo, URLs pré-assinadas que não expiram.",
            destino:
              "Servir arquivos por identificador autorizado (nunca por caminho cru), normalizar e restringir caminhos, e usar URLs assinadas curtas e por usuário.",
          },
          {
            origem:
              "**Padrão “permitir” e privilégios em excesso**: contas com poder demais, sem revisão, e políticas que liberam o que não foi previsto.",
            destino:
              "Menor privilégio, **negar por padrão**, revisão periódica de acessos (Q109 e Q119) e registro e alerta de acessos negados em volume (Q139).",
          },
        ],
      },
      {
        tipo: "passos",
        titulo: "Como testar",
        passos: [
          {
            titulo: "1. Mapeie os identificadores",
            texto:
              "Para cada endpoint, liste onde há IDs de objeto (caminho, query, corpo, cabeçalhos, GraphQL) e quais verbos existem.",
          },
          {
            titulo: "2. Monte as identidades de teste",
            texto:
              "Pelo menos dois usuários comuns de tenants diferentes (A e B), um com papel de suporte ou administrador e um sem login, cada um com recursos próprios.",
          },
          {
            titulo: "3. Ataque na horizontal e na vertical",
            texto:
              "Repita cada requisição de A, com o token de A, usando os IDs de B (horizontal), e as rotas administrativas com token comum (vertical), em todos os verbos. O esperado é 403 ou 404, sem dados no corpo, e o recurso de B intacto depois de `PUT` e `DELETE`.",
          },
          {
            titulo: "4. Automatize a matriz",
            texto:
              "Uma tabela sujeito × recurso × ação com o resultado esperado, executada no CI a cada mudança. Todo endpoint novo entra na matriz ou o build falha. Complete com revisão de código e com ferramentas que repetem o tráfego com outra sessão (veja Q146).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Duas perguntas em todo acesso",
        texto:
          "**Quem é você?** (autenticação) e **isto é seu, ou você pode fazer isto com este objeto?** (autorização de objeto e de função). O BOLA é a segunda pergunta que nunca foi feita. Decida no servidor, perto dos dados, com política central e negação por padrão; use IDs imprevisíveis só como complemento; e prove com testes de matriz, não com fé.",
      },
    ],
    armadilhas: [
      "Achar que UUID resolve: o ID imprevisível esconde o alvo, mas qualquer ID que vaze (e-mail, link compartilhado, listagem) vira acesso total se não houver checagem.",
      "Verificar só o papel (“é cliente?”) e não a relação com o objeto (“este pedido é deste cliente?”).",
      "Cobrir só o GET: `PUT`, `PATCH`, `DELETE`, rotas aninhadas (`/clientes/1/pedidos/9`), ações em lote, IDs no corpo e em cabeçalhos costumam ficar sem a checagem.",
      "Confiar em campos que vêm do cliente: `usuarioId` no corpo, `role` em JSON (mass assignment) ou checagem apenas no front-end.",
    ],
    autoteste: [
      {
        pergunta:
          "Qual é a diferença entre autenticação, autorização por função e autorização por objeto, e qual delas falta no BOLA?",
        resposta:
          "A autenticação diz quem é o usuário; a autorização por função diz que tipo de ação ele pode fazer (a falta dela é o BFLA); a autorização por objeto diz se este objeto específico pode ser acessado por ele. No BOLA falta a de objeto.",
      },
      {
        pergunta: "Como testar BOLA de forma repetível?",
        resposta:
          "Com dois usuários de tenants diferentes e recursos de cada um: repetir cada requisição com o token de A contra recursos de B, em todos os verbos e em todos os lugares do ID, esperando 403 ou 404, e automatizar isso como uma matriz no CI.",
      },
    ],
  },
  en: {
    titulo: "IDOR and BOLA",
    pergunta:
      "What are IDOR and BOLA (Broken Object Level Authorization)? How do they occur in APIs, and how do you prevent and test for them?",
    porqueEsteMetodo:
      "IDOR and BOLA are easy to explain and very common, and the defense depends on understanding where the check is missing. The pairs show how the flaw occurs and how to avoid it, and the steps show how to test for it.",
    resposta30s:
      "**IDOR** (insecure direct object reference) is the classic name and **BOLA** the name used in the OWASP API list for the same flaw: the API authenticates the user but **does not check that the object is theirs**, so changing the `id` in the request is enough to read or change somebody else’s data. The cause is authorization only at login or at the route; the cure is to **check ownership and permission on every object access**, on the server and preferably in the query itself, with a central policy and deny by default (unpredictable IDs help but do not replace the check). Test with two users and an **automated access matrix**.",
    blocos: [
      {
        tipo: "pares",
        titulo: "IDOR and BOLA: how it occurs → how to prevent it",
        rotuloOrigem: "How it occurs",
        rotuloDestino: "How to prevent it",
        pares: [
          {
            origem:
              "**Swapping the identifier**: `GET /orders/1001` becomes `/orders/1002` and returns another customer’s order. The ID can be in the path, the query, the JSON body, headers or nested objects.",
            destino:
              "Authorize **every object access** on the server: the decision takes subject, action and object (`can(user, 'read', order)`). Authenticated does not mean allowed.",
          },
          {
            origem:
              "The check only looks at the route or the role (“is a customer?”), never at the relationship with the object (“does this order belong to this customer?”).",
            destino:
              "Put the owner or tenant **in the query itself** (`WHERE id = $1 AND customer_id = $2`), with the subject coming from the validated token, not from a request field.",
          },
          {
            origem:
              "Only `GET` was protected; `PUT`, `PATCH`, `DELETE`, bulk actions, nested routes and GraphQL field resolvers were left open.",
            destino:
              "A **centralized** policy (middleware, decorator, policy library, PEP and PDP: see Q114 and Q115) applied to every path, with **deny by default** for a route with no declared policy.",
          },
          {
            origem: "Sequential IDs make the target easy to sweep: 1001, 1002, 1003…",
            destino:
              "Unpredictable IDs (random UUID, ULID) make sweeping harder, but are an **extra layer**, not the defense. Answering 404 (not 403) for somebody else’s object avoids confirming it exists.",
          },
          {
            origem: "A database shared between tenants: a forgotten filter in one query leaks another customer’s data.",
            destino:
              "Isolation in the database too: **row-level security** (for example, in PostgreSQL) and tenant scoping in the data layer, as a safety net behind the application’s check (see Q117).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Authenticated, but the object’s owner was not checked",
        legenda: "TypeScript",
        codigo: `// VULNERABLE: authenticated, but did not check whose order it is
app.get("/orders/:id", authenticate, async (req, res) => {
  const { rows } = await db.query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
  res.json(rows[0]);
});

// CORRECT: the owner comes from the token and is part of the query itself
app.get("/orders/:id", authenticate, async (req, res) => {
  const { rows } = await db.query(
    "SELECT id, status, total FROM orders WHERE id = $1 AND tenant_id = $2 AND customer_id = $3",
    [req.params.id, req.user.tenantId, req.user.id],
  );
  if (rows.length === 0) return res.sendStatus(404); // does not reveal whether the order exists
  res.json(rows[0]);
});`,
        nota: "When there are roles such as support or administrator, the rule goes into the central policy (for example, `can(user, 'read', order)`), not into a loose `if` in every route. The query returns only the necessary columns, which also avoids exposing too many properties.",
      },
      {
        tipo: "pares",
        titulo: "Other common access control failures",
        rotuloOrigem: "Failure",
        rotuloDestino: "Mitigation",
        pares: [
          {
            origem:
              "**Exposed administrative function (BFLA)**: `/admin/users` or `DELETE /users/:id` reachable by someone who only has an ordinary role.",
            destino:
              "**Function-level** authorization on every endpoint (required scope or role declared), separate and protected admin routes, and tests for every verb.",
          },
          {
            origem:
              "**Mass assignment**: the body `{ name: 'Ana', role: 'admin' }` writes fields the client should not set, or the response returns internal properties.",
            destino:
              "A DTO with an **allowlist** of writable fields and of returned fields (property-level authorization). Never bind the body straight to the data model.",
          },
          {
            origem:
              "**Control only on the client**: a hidden button, a route “protected” only in the front end, or a decision based on client data (`isAdmin: true`, an editable cookie).",
            destino:
              "Every decision on the server, using data from the validated token or from the database. The front end only shows or hides.",
          },
          {
            origem:
              "**Forced browsing and paths**: a guessed `/reports/2023.pdf`, `../` in file names, pre-signed URLs that never expire.",
            destino:
              "Serve files by an authorized identifier (never by raw path), normalize and restrict paths, and use short, per-user signed URLs.",
          },
          {
            origem:
              "**“Allow” default and excess privilege**: accounts with too much power, never reviewed, and policies that allow whatever was not anticipated.",
            destino:
              "Least privilege, **deny by default**, periodic access review (Q109 and Q119) and logging and alerting on denied accesses in volume (Q139).",
          },
        ],
      },
      {
        tipo: "passos",
        titulo: "How to test",
        passos: [
          {
            titulo: "1. Map the identifiers",
            texto:
              "For each endpoint, list where object IDs appear (path, query, body, headers, GraphQL) and which verbs exist.",
          },
          {
            titulo: "2. Build the test identities",
            texto:
              "At least two ordinary users in different tenants (A and B), one with a support or administrator role and one not logged in, each with their own resources.",
          },
          {
            titulo: "3. Attack horizontally and vertically",
            texto:
              "Repeat each of A’s requests, with A’s token, using B’s IDs (horizontal), and the admin routes with an ordinary token (vertical), on every verb. Expect 403 or 404, with no data in the body, and B’s resource intact after `PUT` and `DELETE`.",
          },
          {
            titulo: "4. Automate the matrix",
            texto:
              "A subject × resource × action table with the expected result, run in CI on every change. Every new endpoint enters the matrix or the build fails. Complete it with code review and tools that replay traffic with another session (see Q146).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Two questions on every access",
        texto:
          "**Who are you?** (authentication) and **is this yours, or can you do this with this object?** (object-level and function-level authorization). BOLA is the second question that was never asked. Decide on the server, close to the data, with a central policy and deny by default; use unpredictable IDs only as a complement; and prove it with matrix tests, not with faith.",
      },
    ],
    armadilhas: [
      "Believing a UUID solves it: an unpredictable ID hides the target, but any ID that leaks (email, shared link, listing) becomes full access if there is no check.",
      "Checking only the role (“is a customer?”) and not the relationship with the object (“does this order belong to this customer?”).",
      "Covering only GET: `PUT`, `PATCH`, `DELETE`, nested routes (`/customers/1/orders/9`), bulk actions, and IDs in the body and headers tend to go unchecked.",
      "Trusting fields that come from the client: a `userId` in the body, a `role` in JSON (mass assignment) or a check only in the front end.",
    ],
    autoteste: [
      {
        pergunta:
          "What is the difference between authentication, function-level authorization and object-level authorization, and which one is missing in BOLA?",
        resposta:
          "Authentication says who the user is; function-level authorization says what kind of action they may perform (its absence is BFLA); object-level authorization says whether this specific object may be accessed by them. BOLA lacks the object-level one.",
      },
      {
        pergunta: "How do you test for BOLA in a repeatable way?",
        resposta:
          "With two users in different tenants and resources for each: repeat every request with A’s token against B’s resources, on every verb and every place the ID appears, expecting 403 or 404, and automate it as a matrix in CI.",
      },
    ],
  },
};
