import type { Pergunta } from "../../tipos";

// Q01 · Autenticação × autorização
export const q001: Pergunta = {
  numero: 1,
  modulo: "fundamentos",
  metodo: "compare",
  pt: {
    titulo: "Autenticação × autorização",
    pergunta:
      "Qual é a diferença entre autenticação e autorização? Dê um exemplo em que as duas acontecem em momentos e lugares diferentes do sistema.",
    porqueEsteMetodo:
      "Os dois termos soam parecidos e são cobrados juntos. A matriz lado a lado separa o que cada um decide, onde, quando e como falha, e o exemplo mostra que são duas decisões independentes.",
    resposta30s:
      "**Autenticação** (AuthN) responde “quem é você?” e termina numa sessão ou num token; **autorização** (AuthZ) responde “o que você pode fazer aqui?” e compara identidade, papéis e atributos com uma política, a cada recurso e ação. Acontecem em momentos e lugares diferentes (login no IdP, checagem em toda requisição na API) e falham de forma diferente: **401** quando não se sabe quem é, **403** quando se sabe e a resposta é não. O **OAuth 2.0** é de autorização; para autenticar usam-se **OpenID Connect** ou **SAML**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Duas perguntas, duas decisões",
        colunas: ["Aspecto", "Autenticação (AuthN)", "Autorização (AuthZ)"],
        linhas: [
          ["Pergunta que responde", "Quem é você? Prove.", "Você pode fazer isto, neste recurso, agora?"],
          [
            "Analogia",
            "O crachá na portaria prova que você é funcionário",
            "A porta de cada sala só abre para quem o sistema autoriza",
          ],
          [
            "O que examina",
            "Credenciais e fatores: senha, passkey, código de MFA, certificado",
            "Papéis, grupos, atributos, escopos e políticas diante de um recurso e de uma ação",
          ],
          [
            "Quando acontece",
            "No login, na renovação da sessão e em reautenticações para ações sensíveis",
            "A cada requisição ou ação, e de novo quando as permissões mudam",
          ],
          [
            "Onde acontece",
            "No IdP ou servidor de autorização (tela de login, MFA)",
            "Na API ou no serviço dono do recurso, no gateway ou num motor de políticas",
          ],
          [
            "Resultado",
            "Uma sessão, um ID token ou uma assertion SAML afirmando quem é o usuário",
            "Permitir ou negar, e muitas vezes filtrar o que volta (só os registros dele)",
          ],
          [
            "Falha em HTTP",
            "`401 Unauthorized` (na prática, “não autenticado”)",
            "`403 Forbidden` (autenticado, mas sem permissão)",
          ],
          [
            "Padrões típicos",
            "OpenID Connect, SAML 2.0, Kerberos, WebAuthn e passkeys",
            "OAuth 2.0 (acesso delegado por escopos), RBAC, ABAC e políticas centralizadas",
          ],
          [
            "No trabalho de IAM",
            "Política de senha e MFA, SSO, recuperação de conta",
            "Privilégio mínimo, papéis, revisão periódica de acessos, separação de funções",
          ],
        ],
        nota: "Os dois se encadeiam: sem saber quem é o principal, a autorização não tem a quem aplicar a política.",
      },
      {
        tipo: "fluxo",
        titulo: "Um exemplo em momentos e lugares diferentes",
        etapas: [
          "Segunda, 8h, no IdP: Maria entra com senha e passkey. Isso é **autenticação**; o IdP emite um ID token e abre uma sessão",
          "O aplicativo de RH valida o token (assinatura, `iss`, `aud`, `exp`) e cria a sessão dele. Ainda não decidiu nada sobre o que Maria pode fazer",
          "Horas depois, na API de folha: `GET /folha/2026-10`. A API confere o access token e extrai o principal (`sub`, papéis, escopos)",
          "A API aplica a política: “analista de RH da unidade 12 pode ler a folha da unidade 12?”. Sim: `200`, só com os registros da unidade. Não: `403`. Isso é **autorização**, decidida pelo serviço dono do dado, não pelo IdP",
          "Na quarta, o RH retira o papel dela. A sessão continua autenticada, mas a autorização passa a negar assim que a API enxerga a mudança: na hora, se consulta a fonte, ou quando o token expirar, se os papéis viajam dentro dele",
        ],
        nota: "Se a API só conferisse que o token é válido e nunca olhasse papéis e escopos, qualquer pessoa autenticada leria qualquer folha.",
      },
      {
        tipo: "codigo",
        titulo: "401 e 403 na prática",
        legenda: "HTTP",
        codigo: `# 1. Sem credencial: o servidor não sabe quem é
GET /folha/2026-10 HTTP/1.1
Host: api.exemplo.com

HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="folha"

# 2. Token válido, mas sem permissão para este recurso
GET /folha/2026-10 HTTP/1.1
Host: api.exemplo.com
Authorization: Bearer eyJhbGciOi...

HTTP/1.1 403 Forbidden`,
        nota: "As linhas com # são anotações do exemplo, não fazem parte do protocolo.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Pergunte primeiro “sei quem é?”. Se não, o problema é de **autenticação** (401: mande para o login). Se sim, pergunte “posso permitir esta ação neste recurso?”. Se não, é **autorização** (403). Um token válido só prova a primeira resposta. O **OAuth 2.0** existe para a segunda: dá a um aplicativo acesso delegado e limitado (por escopos) a uma API. Quem diz quem é a pessoa é o **OpenID Connect**, uma camada de identidade sobre o OAuth, ou o SAML.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O erro comum: tratar token válido como permissão",
        texto:
          "Assinatura correta, `exp` no futuro e `aud` certo provam que o token é genuíno, não que o dono pode fazer **aquela** ação sobre **aquele** objeto. Confira também escopo ou papel e o dono do recurso (o pedido 42 é dele?). Sem isso, qualquer usuário autenticado lê os dados dos outros, a falha conhecida como BOLA ou IDOR. Outro tropeço: usar um access token OAuth como se fosse prova de login.",
      },
    ],
    armadilhas: [
      "Tratar um token válido como permissão: verificar assinatura, `exp` e `aud` não substitui conferir escopo, papel e o dono do objeto.",
      "Usar OAuth 2.0 puro como “login”: o access token diz o que o cliente pode fazer, não garante quem é a pessoa; para isso existe o OpenID Connect.",
      "Confundir 401 e 403: 401 pede credencial, 403 diz que a credencial não basta. Para não revelar que um recurso existe, algumas APIs respondem 404 de propósito.",
      "Autorizar só no front-end ou só no login: esconder um botão não protege a API, e papéis gravados no token ficam desatualizados até ele expirar.",
    ],
    autoteste: [
      {
        pergunta: "Um usuário já logado recebe 403 ao abrir uma tela. O que isso diz sobre autenticação e autorização?",
        resposta:
          "Que a autenticação funcionou (o sistema sabe quem ele é) e a autorização negou: a política não permite aquela ação naquele recurso. Trocar a senha não resolve; é preciso mudar o papel ou a política.",
      },
      {
        pergunta: "Para qual dos dois o OAuth 2.0 serve, e o que se usa para autenticar?",
        resposta:
          "Para autorização: acesso delegado, com escopos, de um aplicativo a uma API. Para autenticar usam-se o OpenID Connect (camada de identidade sobre o OAuth), o SAML ou o fluxo de login do próprio IdP.",
      },
    ],
  },
  en: {
    titulo: "AuthN vs AuthZ",
    pergunta:
      "What is the difference between authentication and authorization? Give an example where the two happen at different points and places in a system.",
    porqueEsteMetodo:
      "The two terms sound alike and are always asked together. A side-by-side matrix separates what each one decides, where, when and how it fails, and the example shows they are two independent decisions.",
    resposta30s:
      "**Authentication** (AuthN) answers “who are you?” and ends in a session or a token; **authorization** (AuthZ) answers “what can you do here?” and checks identity, roles and attributes against a policy, for each resource and action. They happen at different times and places (login at the IdP, a check on every API request) and fail differently: **401** when the caller is unknown, **403** when the caller is known and the answer is no. **OAuth 2.0** is about authorization; to authenticate you use **OpenID Connect** or **SAML**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Two questions, two decisions",
        colunas: ["Aspect", "Authentication (AuthN)", "Authorization (AuthZ)"],
        linhas: [
          ["Question it answers", "Who are you? Prove it.", "Can you do this, on this resource, right now?"],
          [
            "Analogy",
            "The badge at the front desk proves you are an employee",
            "Each room’s door opens only for whom the system allows",
          ],
          [
            "What it examines",
            "Credentials and factors: password, passkey, MFA code, certificate",
            "Roles, groups, attributes, scopes and policies against a resource and an action",
          ],
          [
            "When it happens",
            "At login, on session renewal and on re-authentication for sensitive actions",
            "On every request or action, and again whenever permissions change",
          ],
          [
            "Where it happens",
            "At the IdP or authorization server (login page, MFA)",
            "In the API or the service that owns the resource, in the gateway or in a policy engine",
          ],
          [
            "Result",
            "A session, an ID token or a SAML assertion stating who the user is",
            "Allow or deny, and often filter what comes back (only their own records)",
          ],
          [
            "Failure in HTTP",
            "`401 Unauthorized` (in practice, “not authenticated”)",
            "`403 Forbidden` (authenticated, but not permitted)",
          ],
          [
            "Typical standards",
            "OpenID Connect, SAML 2.0, Kerberos, WebAuthn and passkeys",
            "OAuth 2.0 (delegated access through scopes), RBAC, ABAC and centralized policies",
          ],
          [
            "In IAM work",
            "Password policy and MFA, SSO, account recovery",
            "Least privilege, roles, periodic access reviews, separation of duties",
          ],
        ],
        nota: "The two chain together: without knowing who the principal is, authorization has nobody to apply the policy to.",
      },
      {
        tipo: "fluxo",
        titulo: "An example at different times and places",
        etapas: [
          "Monday, 8 a.m., at the IdP: Maria signs in with a password and a passkey. That is **authentication**; the IdP issues an ID token and opens a session",
          "The HR application validates the token (signature, `iss`, `aud`, `exp`) and creates its own session. It has decided nothing yet about what Maria may do",
          "Hours later, at the payroll API: `GET /payroll/2026-10`. The API checks the access token and extracts the principal (`sub`, roles, scopes)",
          "The API applies the policy: “may an HR analyst from unit 12 read unit 12’s payroll?”. Yes: `200`, with only that unit’s records. No: `403`. That is **authorization**, decided by the service that owns the data, not by the IdP",
          "On Wednesday HR removes her role. The session stays authenticated, but authorization starts denying as soon as the API sees the change: immediately if it queries the source, or when the token expires if roles travel inside it",
        ],
        nota: "If the API only checked that the token is valid and never looked at roles and scopes, any authenticated person could read any payroll.",
      },
      {
        tipo: "codigo",
        titulo: "401 and 403 in practice",
        legenda: "HTTP",
        codigo: `# 1. No credential: the server does not know who is calling
GET /payroll/2026-10 HTTP/1.1
Host: api.example.com

HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="payroll"

# 2. Valid token, but no permission for this resource
GET /payroll/2026-10 HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOi...

HTTP/1.1 403 Forbidden`,
        nota: "The lines starting with # are annotations for the example, not part of the protocol.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "First ask “do I know who this is?”. If not, the problem is **authentication** (401: send them to log in). If so, ask “may I allow this action on this resource?”. If not, it is **authorization** (403). A valid token only proves the first answer. **OAuth 2.0** exists for the second: it gives an application delegated, limited access (through scopes) to an API. What says who the person is comes from **OpenID Connect**, an identity layer on top of OAuth, or from SAML.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The common mistake: treating a valid token as permission",
        texto:
          "A correct signature, a future `exp` and the right `aud` prove the token is genuine, not that its owner may perform **that** action on **that** object. Also check the scope or role and the owner of the resource (is order 42 theirs?). Without that, any authenticated user reads other people’s data, the flaw known as BOLA or IDOR. Another slip: using an OAuth access token as if it were proof of login.",
      },
    ],
    armadilhas: [
      "Treating a valid token as permission: verifying signature, `exp` and `aud` does not replace checking scope, role and the owner of the object.",
      "Using plain OAuth 2.0 as a “login”: the access token says what the client may do, not who the person is; that is what OpenID Connect is for.",
      "Mixing up 401 and 403: 401 asks for a credential, 403 says the credential is not enough. To avoid revealing that a resource exists, some APIs answer 404 on purpose.",
      "Authorizing only in the front end or only at login: hiding a button does not protect the API, and roles baked into the token go stale until it expires.",
    ],
    autoteste: [
      {
        pergunta:
          "A logged-in user gets a 403 when opening a screen. What does that say about authentication and authorization?",
        resposta:
          "That authentication worked (the system knows who they are) and authorization said no: the policy does not allow that action on that resource. Changing the password will not help; the role or the policy has to change.",
      },
      {
        pergunta: "Which of the two is OAuth 2.0 for, and what do you use to authenticate?",
        resposta:
          "Authorization: delegated access, with scopes, from an application to an API. To authenticate you use OpenID Connect (an identity layer on top of OAuth), SAML or the IdP’s own login flow.",
      },
    ],
  },
};
