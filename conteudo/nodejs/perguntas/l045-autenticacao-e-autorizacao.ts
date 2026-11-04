import type { Pergunta } from "../../tipos";

// L45 · Autenticação e autorização
export const l045: Pergunta = {
  numero: 145,
  modulo: "linkedin-express",
  metodo: "trace",
  pt: {
    titulo: "Autenticação e autorização",
    pergunta: "Como você implementa autenticação?",
    porqueEsteMetodo:
      "Autenticação e autorização são duas decisões tomadas em momentos diferentes da vida de uma requisição. Seguir um usuário do login até uma rota protegida mostra onde cada uma acontece e o que dá errado quando falta uma delas.",
    resposta30s:
      "**Autenticação** prova **quem é** o usuário (login com a senha guardada como hash lento, ou delegação a um provedor OAuth/OpenID Connect) e entrega uma prova reutilizável: uma **sessão** ou um **token**. **Autorização** decide **o que ele pode fazer**, por papel (RBAC) e por atributos como a posse do recurso (ABAC). As duas rodam no **servidor, a cada requisição**, em middlewares: sem identidade válida, `401`; autenticado sem permissão, `403`.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Do login a uma rota protegida",
        etapas: [
          "`POST /login` chega por HTTPS; o handler busca o usuário e compara a senha com o **hash lento** guardado (argon2id, scrypt ou bcrypt; veja L125), sem revelar se o erro foi no e-mail ou na senha",
          "Credenciais corretas: o servidor emite a **prova de identidade**, um id de sessão em cookie `HttpOnly` (o estado fica no servidor) ou um token assinado de vida curta (veja L47)",
          "`GET /pedidos/42` chega com essa prova, no cookie ou em `Authorization: Bearer ...`",
          "O middleware de **autenticação** valida a prova (a sessão existe e não expirou, ou assinatura, `exp`, `iss` e `aud` do token) e grava a identidade em `req.user`; sem prova válida, responde `401`",
          "O middleware de **autorização** confere se `req.user` pode executar essa ação (papel ou permissão: RBAC) sobre esse recurso (o pedido 42 é dele? ABAC); senão, `403`",
          "O handler roda com a identidade já confiável, e a consulta ao banco também filtra pelo dono (`WHERE id = $1 AND usuario_id = $2`)",
        ],
        nota: "Nada disso vem do cliente: o servidor decide a cada requisição. Esconder um botão na interface não é autorização.",
      },
      {
        tipo: "passos",
        titulo: "O caminho em que algo dá errado",
        passos: [
          {
            titulo: "Sem prova, ou prova vencida: 401",
            texto:
              "Falta o cookie, a assinatura não confere ou o token expirou. O cliente deve se autenticar de novo ou renovar o token. `401` quer dizer “não sei quem você é”.",
          },
          {
            titulo: "Autenticado, mas sem permissão: 403",
            texto:
              "O usuário é conhecido, mas o papel dele não permite a ação. Para o recurso de outra pessoa, alguns sistemas respondem `404` para não revelar que ele existe; escolha uma política e mantenha-a em toda a API.",
          },
          {
            titulo: "Pedido de outro usuário (IDOR)",
            texto:
              "O usuário troca `/pedidos/42` por `/pedidos/43` e recebe o pedido de outra pessoa, porque só se checou o login. A defesa é conferir a posse em **toda** leitura e escrita, de preferência na própria consulta.",
          },
          {
            titulo: "Login que ajuda o atacante",
            texto:
              "Mensagens diferentes para “e-mail inexistente” e “senha errada” permitem descobrir contas, e um login sem limite de tentativas permite força bruta (veja L49). Responda igual nos dois casos e limite o ritmo.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Middlewares de autenticação e de papel",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          "",
          "const app = express();",
          "",
          "const autenticar = async (req, res, next) => {",
          "  const usuario = await identificar(req); // cookie de sessão ou token Bearer, validado no servidor",
          '  if (!usuario) return res.status(401).json({ erro: "Não autenticado" });',
          "  req.user = usuario; // identidade confiável daqui em diante",
          "  next();",
          "};",
          "",
          "const exigirPapel = (...papeis) => (req, res, next) =>",
          '  papeis.includes(req.user.papel) ? next() : res.status(403).json({ erro: "Sem permissão" });',
          "",
          'app.post("/login", entrar); // pública: fica antes do middleware',
          "app.use(autenticar); // negar por padrão: tudo abaixo exige login",
          'app.delete("/pedidos/:id", exigirPapel("admin"), apagarPedido);',
        ].join("\n"),
        nota: "O papel responde “pode apagar pedidos?”. A posse (“este pedido é dele?”) é conferida na consulta ou no serviço, não só no middleware.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Duas perguntas, dois códigos de status",
        texto:
          "**Autenticação**: “quem é você?” (senha, sessão, token ou provedor externo), e falha com `401`. **Autorização**: “o que você pode fazer aqui?”, por papel (**RBAC**) ou por atributos e posse (**ABAC**), e falha com `403`. Prefira peças prontas: o **Passport** é um middleware de “estratégias” (senha, JWT, OAuth), e o **OpenID Connect** (camada de identidade sobre o OAuth 2.0) delega o login a um provedor, que prova a identidade e devolve tokens. Sessão ou token: veja L47.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Como responder bem na entrevista",
        texto:
          "Comece separando as duas perguntas (autenticar e autorizar), descreva o fluxo de uma requisição e só então justifique as escolhas: sessão ou token, quem guarda a senha (você ou um provedor) e como o papel e a posse são verificados. Cite também o que você **não** faria: guardar senha em texto puro, inventar a própria criptografia e confiar no cliente para decidir permissões.",
      },
    ],
    armadilhas: [
      "Confundir os dois conceitos, ou checar permissão só no front-end: o cliente é controlável, e esconder um botão não protege a rota.",
      "Guardar senha em texto puro ou com hash rápido (veja L125), ou inventar o próprio esquema de criptografia ou de sessão.",
      "Autorizar só pelo papel e esquecer a posse do recurso (IDOR), ou deixar rotas fora do middleware: prefira negar por padrão e abrir as exceções públicas explicitamente.",
      "Mensagens de login diferentes para e-mail inexistente e senha errada, e login sem limite de tentativas: facilitam a enumeração de contas e a força bruta.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre `401` e `403`?",
        resposta:
          "`401`: não autenticado (sem prova válida; faça o login de novo). `403`: autenticado, mas sem permissão para a ação ou o recurso.",
      },
      {
        pergunta:
          "Um usuário logado troca `/pedidos/42` por `/pedidos/43` e vê o pedido de outra pessoa. Qual é a falha e a correção?",
        resposta:
          "É autorização por objeto ausente (IDOR): checar só o login não basta. Confira a posse em toda leitura e escrita, por exemplo filtrando a consulta pelo `usuario_id` da identidade.",
      },
    ],
  },
  en: {
    titulo: "Authentication and authorization",
    pergunta: "How do you implement authentication?",
    porqueEsteMetodo:
      "Authentication and authorization are two decisions made at different moments in a request’s life. Following a user from login to a protected route shows where each one happens and what goes wrong when one is missing.",
    resposta30s:
      "**Authentication** proves **who the user is** (login with a password stored as a slow hash, or delegation to an OAuth/OpenID Connect provider) and hands back a reusable proof: a **session** or a **token**. **Authorization** decides **what they may do**, by role (RBAC) and by attributes such as ownership of the resource (ABAC). Both run on the **server, on every request**, in middleware: no valid identity, `401`; authenticated but not allowed, `403`.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "From login to a protected route",
        etapas: [
          "`POST /login` arrives over HTTPS; the handler finds the user and compares the password with the stored **slow hash** (argon2id, scrypt or bcrypt; see L125), without revealing whether the email or the password was wrong",
          "Correct credentials: the server issues the **proof of identity**, a session id in an `HttpOnly` cookie (the state stays on the server) or a short-lived signed token (see L47)",
          "`GET /orders/42` arrives with that proof, in the cookie or in `Authorization: Bearer ...`",
          "The **authentication** middleware validates the proof (the session exists and has not expired, or the token’s signature, `exp`, `iss` and `aud`) and stores the identity in `req.user`; with no valid proof, it answers `401`",
          "The **authorization** middleware checks whether `req.user` may perform that action (role or permission: RBAC) on that resource (is order 42 theirs? ABAC); otherwise, `403`",
          "The handler runs with an identity it can now trust, and the database query also filters by owner (`WHERE id = $1 AND user_id = $2`)",
        ],
        nota: "None of this comes from the client: the server decides on every request. Hiding a button in the interface is not authorization.",
      },
      {
        tipo: "passos",
        titulo: "The path where something goes wrong",
        passos: [
          {
            titulo: "No proof, or an expired one: 401",
            texto:
              "The cookie is missing, the signature does not check out or the token expired. The client must authenticate again or renew the token. `401` means “I do not know who you are”.",
          },
          {
            titulo: "Authenticated but not allowed: 403",
            texto:
              "The user is known, but their role does not allow the action. For another person’s resource, some systems answer `404` so as not to reveal that it exists; pick one policy and keep it across the whole API.",
          },
          {
            titulo: "Another user’s order (IDOR)",
            texto:
              "The user swaps `/orders/42` for `/orders/43` and gets someone else’s order, because only the login was checked. The defense is to verify ownership on **every** read and write, preferably in the query itself.",
          },
          {
            titulo: "A login that helps the attacker",
            texto:
              "Different messages for “unknown email” and “wrong password” reveal which accounts exist, and a login with no attempt limit allows brute force (see L49). Answer the same way in both cases and limit the rate.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Authentication and role middleware",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          "",
          "const app = express();",
          "",
          "const authenticate = async (req, res, next) => {",
          "  const user = await identify(req); // session cookie or Bearer token, validated on the server",
          '  if (!user) return res.status(401).json({ error: "Not authenticated" });',
          "  req.user = user; // a trusted identity from here on",
          "  next();",
          "};",
          "",
          "const requireRole = (...roles) => (req, res, next) =>",
          '  roles.includes(req.user.role) ? next() : res.status(403).json({ error: "Forbidden" });',
          "",
          'app.post("/login", signIn); // public: stays before the middleware',
          "app.use(authenticate); // deny by default: everything below requires login",
          'app.delete("/orders/:id", requireRole("admin"), deleteOrder);',
        ].join("\n"),
        nota: "The role answers “may they delete orders?”. Ownership (“is this order theirs?”) is checked in the query or the service, not only in the middleware.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Two questions, two status codes",
        texto:
          "**Authentication**: “who are you?” (password, session, token or an external provider), and it fails with `401`. **Authorization**: “what may you do here?”, by role (**RBAC**) or by attributes and ownership (**ABAC**), and it fails with `403`. Prefer ready-made parts: **Passport** is a middleware of “strategies” (password, JWT, OAuth), and **OpenID Connect** (an identity layer on top of OAuth 2.0) delegates login to a provider, which proves the identity and returns tokens. Session or token: see L47.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "How to answer well in an interview",
        texto:
          "Start by separating the two questions (authenticate and authorize), describe the flow of one request and only then justify the choices: session or token, who stores the password (you or a provider) and how role and ownership are checked. Also name what you would **not** do: store passwords in plain text, invent your own cryptography and trust the client to decide permissions.",
      },
    ],
    armadilhas: [
      "Mixing up the two concepts, or checking permission only in the front end: the client is controllable, and hiding a button does not protect the route.",
      "Storing passwords in plain text or with a fast hash (see L125), or inventing your own cryptography or session scheme.",
      "Authorizing by role only and forgetting resource ownership (IDOR), or leaving routes outside the middleware: prefer deny by default and open public exceptions explicitly.",
      "Different login messages for an unknown email and a wrong password, and login with no attempt limit: they make account enumeration and brute force easier.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `401` and `403`?",
        resposta:
          "`401`: not authenticated (no valid proof; log in again). `403`: authenticated, but not allowed to perform the action or access the resource.",
      },
      {
        pergunta:
          "A logged-in user swaps `/orders/42` for `/orders/43` and sees someone else’s order. What is the flaw and the fix?",
        resposta:
          "It is missing object-level authorization (IDOR): checking the login alone is not enough. Verify ownership on every read and write, for example by filtering the query by the identity’s `user_id`.",
      },
    ],
  },
};
