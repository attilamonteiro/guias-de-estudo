import type { Pergunta } from "../../tipos";

// Q76 · Papéis dentro do JWT
export const q076: Pergunta = {
  numero: 76,
  modulo: "tokens-e-sessoes",
  metodo: "whys",
  pt: {
    titulo: "Papéis dentro do JWT",
    pergunta:
      "É seguro confiar nos papéis (roles) dentro de um JWT válido? Que problemas surgem quando as permissões mudam antes de o token expirar?",
    porqueEsteMetodo:
      "“Não confie cegamente nos papéis do token” só convence quando se entende cada porquê: o que a assinatura prova, por que o retrato envelhece, o que mitiga e onde a decisão de permissão deve morar. A cadeia de porquês chega à separação entre identidade e permissão.",
    resposta30s:
      "**Não, não por si só.** A assinatura prova que o **emissor disse** aquilo e que nada foi alterado, mas não que a permissão **continua valendo**: o token é um **retrato do momento da emissão**, e o papel pode mudar antes do `exp`. Reduza o risco com **tokens curtos**, **claims mínimas** e **consulta ao serviço de autorização nas ações sensíveis**, e deixe a decisão fina (qual recurso, qual tenant) fora do token.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que uma assinatura válida não basta para confiar nos papéis?",
            resposta:
              "Porque a assinatura prova **origem e integridade**: o emissor afirmou aquilo e ninguém alterou. Ela não diz que a afirmação **continua verdadeira**. O token é um retrato de quando foi emitido, e a API que o valida localmente não pergunta nada ao emissor depois disso.",
          },
          {
            pergunta: "Por que o retrato fica desatualizado?",
            resposta:
              "Porque o mundo muda enquanto o token vive: o administrador remove um papel, a pessoa muda de área ou é desligada, o grupo é alterado, a conta é bloqueada. Até o `exp`, a API continua aceitando o papel antigo. A renovação por refresh token só traz papéis novos se o emissor reler os dados atuais, e isso varia de emissor para emissor (confira a documentação do seu). Quanto mais longo o token, mais velho o retrato.",
          },
          {
            pergunta: "Por que tokens curtos e consulta nas ações sensíveis ajudam?",
            resposta:
              "A janela de erro é, no máximo, a vida do token: minutos em vez de horas reduzem o problema sem custo por requisição. Nas ações em que um engano é caro (pagamento, mudança de papel, exclusão de dados), a API **pergunta a quem decide hoje** (serviço de autorização, ponto de decisão de política, introspecção) ou exige nova autenticação (step-up, veja Q99). Rotas comuns usam o retrato; rotas sensíveis, o dado atual.",
          },
          {
            pergunta: "Por que manter poucas claims no token?",
            resposta:
              "Por três razões: **tamanho** (cabeçalhos e cookies têm limite, e listas de papéis e grupos crescem), **privacidade** (as claims são legíveis, veja Q69) e **acoplamento** (cada API passa a depender do modelo de papéis do emissor). O Entra ID tem um caso especial: quando a pessoa pertence a grupos demais, o token não os lista e traz um indicador de excesso (“overage”), e a API precisa consultar o Microsoft Graph para obter os grupos. Prefira papéis de aplicação (“app roles”) ou grupos atribuídos à aplicação, e confira a documentação do Entra ID.",
          },
          {
            pergunta: "Por que separar identidade de permissão?",
            resposta:
              "Porque mudam em ritmos e com donos diferentes. A **identidade** (quem é: `sub`, como autenticou) muda pouco e é função do IdP. A **permissão** (o que pode fazer neste recurso, agora) depende do domínio, do tenant e do estado do dado, e muda com frequência. Papéis grossos no token servem de pista; a decisão por recurso (“este pedido é deste tenant?”) é da API, com dados atuais (veja Q104, Q115 e Q136).",
          },
        ],
        causaRaiz:
          "O JWT é uma **afirmação assinada e datada**, e não uma permissão em vigor. Confie nele para saber **quem** emitiu e **o que disse na época**, e decida **o que é permitido agora** no serviço que conhece o estado atual.",
      },
      {
        tipo: "codigo",
        titulo: "Retrato para o comum, dado atual para o sensível",
        legenda: "TypeScript",
        codigo: `const { payload } = await jwtVerify(token, jwks, { issuer, audience, algorithms: ["RS256"] });
const papeis = Array.isArray(payload.roles) ? payload.roles : [];

// Rota comum: o papel do token (um retrato) basta
if (!papeis.includes("pedidos.leitor")) return res.status(403).end();

// Ação sensível: pergunte a quem decide HOJE (serviço de autorização)
if (acao === "aprovar-pagamento") {
  const ok = await autorizacao.checar({ sub: payload.sub, acao, recurso: pagamentoId });
  if (!ok) return res.status(403).end();
}`,
        nota: "`autorizacao` representa o seu serviço ou ponto de decisão de política (veja Q114), e `res` é a resposta HTTP do seu framework.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que pôr no token e quando checar",
        texto:
          "Ponha **identidade e o mínimo grosso** (`sub`, `iss`, `aud`, escopos ou poucos papéis de aplicação) e um tempo de vida **curto**. Use o retrato nas rotas comuns e **consulte a fonte atual** nas ações sensíveis, nas decisões por recurso e quando a revogação imediata importa (veja Q77). Se uma mudança de permissão precisa valer agora, trate-a como evento: encerre sessões, revogue refresh tokens e aceite que o access token ainda circulará até expirar.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Papel no token não é regra de segurança no cliente",
        texto:
          "Papéis lidos do token **no navegador** servem para esconder botões, nunca para proteger dados: a regra tem de ser aplicada na API. E só leia `roles` depois de verificar assinatura, `iss` e `aud` (veja Q72), porque a claim `roles` de um emissor não significa o mesmo que a de outro. Cuidado com claims alimentadas por atributos que o próprio usuário edita: elas viram permissão sem que ninguém perceba.",
      },
    ],
    armadilhas: [
      "Tokens de horas ou dias com papéis dentro: quem perdeu o papel (ou foi desligado) segue com acesso até o token expirar.",
      "Aplicar a autorização só no front-end, com papéis lidos do token decodificado.",
      "Empilhar todas as permissões no token: ele incha, vaza informação e envelhece mais rápido.",
      "Assumir que a claim de grupos sempre vem completa (excesso de grupos no Entra ID) e negar ou liberar acesso por engano quando ela some.",
    ],
    autoteste: [
      {
        pergunta: "Se a assinatura do JWT é válida, o que isso garante sobre os papéis dentro dele?",
        resposta:
          "Garante que o emissor os afirmou e que ninguém os alterou. Não garante que continuam valendo: o token é um retrato do momento da emissão.",
      },
      {
        pergunta: "Como lidar com permissões que mudam antes do `exp`?",
        resposta:
          "Com tokens de vida curta, claims mínimas e consulta ao serviço de autorização nas ações sensíveis. Quando a mudança precisa valer na hora, revogue sessões e refresh tokens e, se necessário, use token opaco com introspecção.",
      },
    ],
  },
  en: {
    titulo: "Roles inside a JWT",
    pergunta:
      "Is it safe to trust the roles inside a valid JWT? What problems appear when permissions change before the token expires?",
    porqueEsteMetodo:
      "“Do not blindly trust the roles in the token” only convinces once you understand each why: what the signature proves, why the snapshot ages, what mitigates it and where the permission decision should live. The chain of whys ends at the separation of identity from permission.",
    resposta30s:
      "**No, not by itself.** The signature proves the **issuer said** it and that nothing was altered, but not that the permission **is still in force**: the token is a **snapshot of the moment of issuance**, and the role may change before `exp`. Reduce the risk with **short tokens**, **minimal claims** and a **query to the authorization service on sensitive actions**, and keep the fine-grained decision (which resource, which tenant) out of the token.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why is a valid signature not enough to trust the roles?",
            resposta:
              "Because the signature proves **origin and integrity**: the issuer asserted it and nobody altered it. It does not say the assertion **is still true**. The token is a snapshot of when it was issued, and the API that validates it locally asks the issuer nothing after that.",
          },
          {
            pergunta: "Why does the snapshot go stale?",
            resposta:
              "Because the world changes while the token lives: the administrator removes a role, the person changes department or is offboarded, the group is edited, the account is blocked. Until `exp`, the API keeps accepting the old role. Renewal by refresh token only brings new roles if the issuer rereads current data, and that varies from issuer to issuer (check the documentation of yours). The longer the token, the older the snapshot.",
          },
          {
            pergunta: "Why do short tokens and a query on sensitive actions help?",
            resposta:
              "The error window is at most the token’s lifetime: minutes instead of hours shrinks the problem at no per-request cost. On actions where a mistake is expensive (payments, role changes, data deletion), the API **asks whoever decides today** (an authorization service, a policy decision point, introspection) or requires fresh authentication (step-up, see Q99). Ordinary routes use the snapshot; sensitive routes use current data.",
          },
          {
            pergunta: "Why keep few claims in the token?",
            resposta:
              "For three reasons: **size** (headers and cookies have limits, and lists of roles and groups grow), **privacy** (claims are readable, see Q69) and **coupling** (every API comes to depend on the issuer’s role model). Entra ID has a special case: when a person belongs to too many groups, the token does not list them and carries an overage indicator, and the API must query Microsoft Graph to get the groups. Prefer application roles (“app roles”) or groups assigned to the application, and check the Entra ID documentation.",
          },
          {
            pergunta: "Why separate identity from permission?",
            resposta:
              "Because they change at different paces and have different owners. **Identity** (who: `sub`, how they authenticated) changes little and is the IdP’s job. **Permission** (what they can do on this resource, now) depends on the domain, the tenant and the state of the data, and changes often. Coarse roles in the token serve as a hint; the per-resource decision (“does this order belong to this tenant?”) belongs to the API, with current data (see Q104, Q115 and Q136).",
          },
        ],
        causaRaiz:
          "A JWT is a **signed, dated assertion**, not a permission in force. Trust it to know **who** issued it and **what it said at the time**, and decide **what is allowed now** in the service that knows the current state.",
      },
      {
        tipo: "codigo",
        titulo: "A snapshot for the ordinary, current data for the sensitive",
        legenda: "TypeScript",
        codigo: `const { payload } = await jwtVerify(token, jwks, { issuer, audience, algorithms: ["RS256"] });
const roles = Array.isArray(payload.roles) ? payload.roles : [];

// Ordinary route: the role in the token (a snapshot) is enough
if (!roles.includes("orders.reader")) return res.status(403).end();

// Sensitive action: ask whoever decides TODAY (authorization service)
if (action === "approve-payment") {
  const ok = await authorization.check({ sub: payload.sub, action, resource: paymentId });
  if (!ok) return res.status(403).end();
}`,
        nota: "`authorization` stands for your service or policy decision point (see Q114), and `res` is the HTTP response of your framework.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What to put in the token and when to check",
        texto:
          "Put **identity and the coarse minimum** (`sub`, `iss`, `aud`, scopes or a few application roles) and a **short** lifetime. Use the snapshot on ordinary routes and **consult the current source** on sensitive actions, on per-resource decisions and when immediate revocation matters (see Q77). If a permission change must take effect now, treat it as an event: end sessions, revoke refresh tokens and accept that the access token will still circulate until it expires.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A role in the token is not a security rule on the client",
        texto:
          "Roles read from the token **in the browser** are for hiding buttons, never for protecting data: the rule must be enforced on the API. And only read `roles` after verifying signature, `iss` and `aud` (see Q72), because one issuer’s `roles` claim does not mean the same as another’s. Beware of claims fed by attributes the user edits: they become permissions without anyone noticing.",
      },
    ],
    armadilhas: [
      "Tokens that last hours or days with roles inside: someone who lost the role (or was offboarded) keeps access until the token expires.",
      "Enforcing authorization only on the front end, with roles read from the decoded token.",
      "Piling every permission into the token: it bloats, leaks information and goes stale faster.",
      "Assuming the groups claim always arrives complete (group overage in Entra ID) and denying or granting access by mistake when it disappears.",
    ],
    autoteste: [
      {
        pergunta: "If the JWT signature is valid, what does that guarantee about the roles inside it?",
        resposta:
          "It guarantees the issuer asserted them and nobody altered them. It does not guarantee they are still in force: the token is a snapshot of the moment of issuance.",
      },
      {
        pergunta: "How do you deal with permissions that change before `exp`?",
        resposta:
          "With short-lived tokens, minimal claims and a query to the authorization service on sensitive actions. When the change must take effect at once, revoke sessions and refresh tokens and, if needed, use an opaque token with introspection.",
      },
    ],
  },
};
