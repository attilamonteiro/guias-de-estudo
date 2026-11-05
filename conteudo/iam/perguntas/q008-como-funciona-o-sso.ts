import type { Pergunta } from "../../tipos";

// Q08 · Como funciona o SSO
export const q008: Pergunta = {
  numero: 8,
  modulo: "fundamentos",
  metodo: "firstprinciples",
  pt: {
    titulo: "Como funciona o SSO",
    pergunta:
      "Como funciona o Single Sign-On? Parta de duas aplicações com login próprio e mostre o que muda para o usuário se autenticar uma só vez, e quais riscos isso cria.",
    porqueEsteMetodo:
      "O SSO parece mágica (“entrei uma vez e já estou em tudo”) até você partir de dois logins separados e perguntar o que precisa existir para a segunda aplicação aceitar quem já entrou na primeira. Cada peça nasce de uma necessidade.",
    resposta30s:
      "No **SSO**, o login sai das aplicações e vai para um **IdP**: ele autentica a pessoa uma vez e abre uma **sessão própria**; cada aplicação, ao receber alguém sem sessão, o redireciona ao IdP e recebe de volta uma **prova assinada** (ID token ou assertion SAML) com a qual cria a sessão dela. Na segunda aplicação, o IdP reconhece a sessão e emite outra prova **sem pedir senha**. O preço: o IdP vira **ponto único de falha** e uma conta comprometida abre tudo, então exige **MFA forte**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo o SSO, uma necessidade por vez",
        passos: [
          {
            titulo: "0. O ponto de partida",
            texto:
              "Duas aplicações, cada uma com a própria tabela de usuários, a própria senha e a própria sessão. O usuário decora (ou reaproveita) duas senhas, redefine ambas no suporte, passa por duas telas de MFA diferentes e, na saída da empresa, alguém precisa lembrar de desativar as duas contas.",
          },
          {
            titulo: "1. Primeiro conserto: compartilhar a senha",
            texto:
              "Usar o mesmo e-mail e a mesma senha nas duas, ou até um banco de usuários comum. → Quebra: cada aplicação passa a ver ou a guardar a senha, o vazamento de uma compromete a outra e cada aplicativo novo repete o problema. Se várias pessoas dividem a mesma conta, soma-se a perda de rastreio (não se sabe quem fez o quê) e a dificuldade de revogar o acesso de uma só.",
          },
          {
            titulo: "2. Tirar o login das aplicações",
            texto:
              "Uma terceira peça, o **IdP**, passa a ser o único lugar onde a senha e o MFA são digitados. A aplicação, ao receber alguém sem sessão, o **redireciona ao IdP**; o IdP o autentica e cria uma **sessão do IdP** (um cookie no domínio do IdP). → Falta: a aplicação ainda não sabe quem chegou.",
          },
          {
            titulo: "3. Uma prova assinada por aplicação",
            texto:
              "O IdP devolve o navegador à aplicação com uma prova assinada: um **ID token** (OpenID Connect) ou uma **assertion SAML**, destinada àquela aplicação (`aud`), com emissor, momento do login e validade curta. A aplicação valida a assinatura e esses campos e cria a **sessão da aplicação**, o cookie dela. No SAML, é essa assertion que viabiliza o SSO no navegador.",
          },
          {
            titulo: "4. A segunda aplicação não pede senha",
            texto:
              "O usuário abre a aplicação B, que o redireciona ao IdP; o IdP encontra a sessão ainda válida e, **sem mostrar tela de login**, emite uma nova prova para B (veja o exemplo abaixo). Isso é o SSO: **uma autenticação, várias sessões de aplicação**, cada uma com a sua prova. → Quebra: agora existem três sessões independentes, e ninguém combinou como elas terminam.",
          },
          {
            titulo: "5. Sessões e logout",
            texto:
              "Sair da aplicação A encerra só a sessão de A: a do IdP e a de B seguem vivas, e o usuário pode voltar a A sem digitar nada. Um **logout único** (o Single Logout do SAML, ou o logout por canal frontal ou de fundo no OpenID Connect) tenta propagar o encerramento, mas depende de cada aplicação, falha em silêncio e não revoga tokens já emitidos. Use sessões e tokens de vida curta e renove consultando o IdP.",
          },
          {
            titulo: "6. O que o SSO cria de risco",
            texto:
              "**Ponto único de falha:** com o IdP fora do ar, ninguém entra em nada. **Impacto maior:** uma conta ou uma sessão do IdP comprometida abre todas as aplicações. Por isso o IdP exige o que aplicações isoladas não exigiam: **MFA forte** (de preferência passkeys), acesso condicional, alta disponibilidade, monitoramento e contas de emergência protegidas.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O passo 4 no protocolo: a segunda aplicação sem tela de login",
        legenda: "HTTP",
        codigo: `# O usuário já entrou na aplicação A. Agora abre a B, que o redireciona ao IdP:
GET /authorize?client_id=app-b&response_type=code&scope=openid&state=Xk2&nonce=Qp9&... HTTP/1.1
Host: idp.exemplo.com
Cookie: idp_session=7Hq3...

# Sem tela de login: o IdP reconhece a sessão e devolve o navegador à aplicação B
HTTP/1.1 302 Found
Location: https://b.exemplo.com/cb?code=SplxlOBe&state=Xk2`,
        nota: "O cookie `idp_session` foi criado no login em A. O `...` esconde os parâmetros `redirect_uri` e do PKCE, que fazem parte de uma requisição real.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra",
        texto:
          "SSO não é “uma sessão para todas as aplicações”: é **uma autenticação** e **uma sessão por aplicação**, ligadas por um IdP que reconhece a sua própria sessão. Quem decide por quanto tempo cada sessão vale, e como ela termina, é cada aplicação junto com o IdP. Por isso o desenho do SSO inclui o que fazer no logout, na expiração e na revogação, não só no login.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Os riscos de credenciais compartilhadas, e o que o SSO conserta",
        texto:
          "Senha compartilhada entre sistemas, ou conta compartilhada entre pessoas, tem três custos: um vazamento abre vários sistemas, não há trilha de quem fez o quê e revogar o acesso de uma só pessoa obriga a trocar a senha de todas. O SSO troca isso por uma identidade individual, uma credencial protegida num só lugar (com MFA) e um ponto único para desativar. A contrapartida é concentrar o risco no IdP: proteja-o mais que qualquer aplicação.",
      },
    ],
    armadilhas: [
      "Achar que SSO é uma sessão compartilhada: são sessões separadas (IdP e cada aplicação), e o logout em uma não encerra as outras sozinho.",
      "Esquecer que o IdP vira alvo principal: sem MFA forte, acesso condicional e contas de emergência, uma conta comprometida abre tudo.",
      "Aceitar a prova sem validar assinatura, emissor, destinatário (`aud`) e validade: uma assertion feita para outra aplicação passa a valer na sua.",
      "Prometer “logout em todos os lugares” sem testar: o Single Logout depende de cada aplicação e não invalida tokens já emitidos.",
    ],
    autoteste: [
      {
        pergunta: "Por que a segunda aplicação não pede senha quando você já entrou na primeira?",
        resposta:
          "Porque a senha foi digitada só no IdP, que guardou uma sessão própria. Ao ser redirecionado pela segunda aplicação, o IdP reconhece essa sessão e emite uma nova prova assinada para ela, sem repetir o login.",
      },
      {
        pergunta: "Quais são os dois principais riscos do SSO e como mitigá-los?",
        resposta:
          "O IdP é ponto único de falha (mitigue com alta disponibilidade e contas de emergência) e uma conta ou sessão comprometida abre todas as aplicações (mitigue com MFA forte, de preferência passkeys, acesso condicional, sessões curtas e monitoramento).",
      },
    ],
  },
  en: {
    titulo: "How SSO works",
    pergunta:
      "How does Single Sign-On work? Start from two applications with their own logins and show what changes so the user authenticates only once, and what risks that creates.",
    porqueEsteMetodo:
      "SSO looks like magic (“I signed in once and I’m in everything”) until you start from two separate logins and ask what must exist for the second application to accept someone who already signed in to the first. Each piece is born from a need.",
    resposta30s:
      "In **SSO**, login leaves the applications and moves to an **IdP**: it authenticates the person once and opens **its own session**; each application, on receiving someone with no session, redirects them to the IdP and gets back a **signed proof** (an ID token or SAML assertion) with which it creates its own session. At the second application, the IdP recognizes the session and issues another proof **without asking for a password**. The price: the IdP becomes a **single point of failure** and one compromised account opens everything, so it demands **strong MFA**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building SSO, one need at a time",
        passos: [
          {
            titulo: "0. The starting point",
            texto:
              "Two applications, each with its own user table, its own password and its own session. The user memorizes (or reuses) two passwords, resets both at the help desk, goes through two different MFA screens and, when leaving the company, someone must remember to deactivate both accounts.",
          },
          {
            titulo: "1. First fix: share the password",
            texto:
              "Use the same email and password on both, or even a common user database. → Breaks: each application now sees or stores the password, a leak at one compromises the other and each new application repeats the problem. If several people share one account, you also lose traceability (no one knows who did what) and the ability to revoke one person’s access alone.",
          },
          {
            titulo: "2. Take login out of the applications",
            texto:
              "A third piece, the **IdP**, becomes the only place where the password and MFA are typed. An application receiving someone with no session **redirects them to the IdP**; the IdP authenticates them and creates an **IdP session** (a cookie on the IdP’s domain). → Missing: the application does not yet know who arrived.",
          },
          {
            titulo: "3. A signed proof per application",
            texto:
              "The IdP sends the browser back to the application with a signed proof: an **ID token** (OpenID Connect) or a **SAML assertion**, addressed to that application (`aud`), with an issuer, the time of login and a short validity. The application validates the signature and those fields and creates the **application session**, its own cookie. In SAML, it is this assertion that makes browser SSO possible.",
          },
          {
            titulo: "4. The second application does not ask for a password",
            texto:
              "The user opens application B, which redirects them to the IdP; the IdP finds the session still valid and, **without showing a login page**, issues a new proof for B (see the example below). That is SSO: **one authentication, several application sessions**, each with its own proof. → Breaks: there are now three independent sessions, and nobody agreed on how they end.",
          },
          {
            titulo: "5. Sessions and logout",
            texto:
              "Signing out of application A ends only A’s session: the IdP’s and B’s stay alive, and the user can return to A without typing anything. A **single logout** (SAML Single Logout, or front-channel or back-channel logout in OpenID Connect) tries to propagate the ending, but it depends on each application, fails silently and does not revoke tokens already issued. Use short-lived sessions and tokens and renew by asking the IdP.",
          },
          {
            titulo: "6. The risk SSO creates",
            texto:
              "**Single point of failure:** with the IdP down, nobody gets into anything. **Bigger impact:** a compromised IdP account or session opens every application. That is why the IdP demands what isolated applications did not: **strong MFA** (preferably passkeys), conditional access, high availability, monitoring and protected emergency accounts.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Step 4 on the wire: the second application with no login page",
        legenda: "HTTP",
        codigo: `# The user already signed in to application A. Now they open B, which redirects to the IdP:
GET /authorize?client_id=app-b&response_type=code&scope=openid&state=Xk2&nonce=Qp9&... HTTP/1.1
Host: idp.example.com
Cookie: idp_session=7Hq3...

# No login page: the IdP recognizes the session and sends the browser back to application B
HTTP/1.1 302 Found
Location: https://b.example.com/cb?code=SplxlOBe&state=Xk2`,
        nota: "The `idp_session` cookie was created at the login in A. The `...` hides the `redirect_uri` and PKCE parameters, which a real request includes.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule",
        texto:
          "SSO is not “one session for every application”: it is **one authentication** and **one session per application**, tied together by an IdP that recognizes its own session. How long each session lives, and how it ends, is up to each application together with the IdP. So the design of SSO includes what to do at logout, at expiry and at revocation, not just at login.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The risks of shared credentials, and what SSO fixes",
        texto:
          "A password shared across systems, or an account shared among people, has three costs: one leak opens several systems, there is no trail of who did what and revoking one person’s access forces a password change for everyone. SSO swaps that for an individual identity, one credential protected in one place (with MFA) and a single point to deactivate. The trade-off is concentrating risk in the IdP: protect it more than any application.",
      },
    ],
    armadilhas: [
      "Thinking SSO is a shared session: they are separate sessions (the IdP and each application), and logging out of one does not end the others by itself.",
      "Forgetting the IdP becomes the main target: without strong MFA, conditional access and emergency accounts, one compromised account opens everything.",
      "Accepting the proof without validating signature, issuer, audience (`aud`) and validity: an assertion made for another application starts to count as yours.",
      "Promising “logout everywhere” without testing it: Single Logout depends on each application and does not invalidate tokens already issued.",
    ],
    autoteste: [
      {
        pergunta: "Why does the second application not ask for a password when you already signed in to the first?",
        resposta:
          "Because the password was typed only at the IdP, which kept its own session. When the second application redirects the user, the IdP recognizes that session and issues a new signed proof for it, without repeating the login.",
      },
      {
        pergunta: "What are the two main risks of SSO and how do you mitigate them?",
        resposta:
          "The IdP is a single point of failure (mitigate with high availability and emergency accounts) and one compromised account or session opens every application (mitigate with strong MFA, preferably passkeys, conditional access, short sessions and monitoring).",
      },
    ],
  },
};
