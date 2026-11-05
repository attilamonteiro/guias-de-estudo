import type { Pergunta } from "../../tipos";

// Q06 · Login por senha do zero
export const q006: Pergunta = {
  numero: 6,
  modulo: "fundamentos",
  metodo: "firstprinciples",
  pt: {
    titulo: "Login por senha do zero",
    pergunta:
      "Como você construiria um sistema de login por e-mail e senha do zero, e que componentes acrescentaria ao descobrir cada falha da versão ingênua?",
    porqueEsteMetodo:
      "Um sistema de login seguro parece uma lista arbitrária de exigências até você ver cada uma nascer de um ataque. Partir da versão ingênua e consertar uma falha por vez mostra por que ele é assim, e onde vale parar de construir.",
    resposta30s:
      "Comece com o mínimo (senha em texto, cookie com o id do usuário) e conserte uma falha por vez: **hash lento com sal** para a base vazada, **id de sessão aleatório** e **cookie seguro** (`Secure`, `HttpOnly`, `SameSite`) para o roubo e a forja de sessão, **limite de tentativas** para a adivinhação, **reset e verificação por token de uso único** e **MFA** para a senha roubada. Ao chegar aqui, cada item é uma superfície de ataque a manter: quando o produto precisa de SSO, passkeys ou federação, **delegue a um IdP** com OpenID Connect.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma falha por vez",
        passos: [
          {
            titulo: "0. O que se quer",
            texto:
              "Um usuário prova que controla uma conta com e-mail e senha, e o servidor reconhece as próximas requisições dele sem pedir a senha de novo. As ameaças a vencer: vazamento da base, adivinhação de senhas, roubo ou previsão de sessões e abuso dos fluxos de recuperação.",
          },
          {
            titulo: "1. A versão ingênua",
            texto:
              "Tabela `usuarios(email, senha)` com a senha em texto e, depois do login, um cookie `usuario_id=42`. → Quebra: um vazamento do banco entrega todas as senhas (e muita gente as reutiliza em outros sites), e qualquer pessoa pode editar o cookie para virar o usuário 43.",
          },
          {
            titulo: "2. Hash lento com sal",
            texto:
              "Guarde só o resultado de **argon2id, scrypt ou bcrypt** com sal único por senha e confira em tempo constante, com a mesma resposta (“e-mail ou senha incorretos”) para usuário inexistente e senha errada. → Resolve o vazamento da base (veja o guia de backend sobre armazenar senhas). → Ainda quebra: o cookie continua forjável.",
          },
          {
            titulo: "3. Identificador de sessão aleatório",
            texto:
              "Depois do login, o servidor gera um id aleatório com um gerador criptograficamente seguro (por exemplo, 32 bytes), guarda `id → usuário, expiração` e entrega só o id. Gere **um id novo a cada login** (impede a fixação de sessão) e invalide-o no logout. → Quebra: o id viaja num cookie, e quem o roubar vira o usuário.",
          },
          {
            titulo: "4. Cookie seguro",
            texto:
              "Marque o cookie como `Secure` (só HTTPS), `HttpOnly` (o JavaScript não lê, o que limita o roubo por XSS) e `SameSite=Lax` (reduz o CSRF), use o prefixo `__Host-`, dê expiração por inatividade e absoluta e sirva tudo em HTTPS com HSTS. Para ações que alteram estado, acrescente defesa contra CSRF. → Quebra: um atacante ainda pode tentar milhões de senhas pela tela de login.",
          },
          {
            titulo: "5. Limitar tentativas",
            texto:
              "Limite por conta e por IP com espera crescente, alerte sobre picos de falhas, peça um desafio (CAPTCHA) depois de certo número e recuse senhas comuns ou já vazadas, como o NIST SP 800-63B recomenda, em vez de exigir regras de composição complicadas. Cuidado: bloqueio rígido de conta deixa qualquer um trancar a conta de outra pessoa. → Quebra: o usuário esquece a senha.",
          },
          {
            titulo: "6. Reset de senha e verificação de e-mail",
            texto:
              "Gere um token aleatório, de uso único e prazo curto, guarde só o hash dele e envie o link por e-mail; responda igual exista ou não o endereço e invalide as sessões ao trocar a senha. Faça o mesmo para confirmar o e-mail antes de confiar nele. → Quebra: a senha, sozinha, ainda se rouba por phishing.",
          },
          {
            titulo: "7. MFA",
            texto:
              "Acrescente um segundo fator: TOTP, chave de segurança ou passkey (resistente a phishing), com códigos de recuperação guardados com o cuidado de uma senha e um fluxo de recuperação que não seja o elo fraco. → Quebra: agora são muitas peças para manter e proteger por conta própria.",
          },
          {
            titulo: "8. Quando delegar a um IdP",
            texto:
              "Cada item acima é uma superfície de ataque e exige manutenção constante. Quando o produto precisa de SSO, MFA e passkeys, login social, federação com clientes corporativos ou conformidade, entregue a autenticação a um IdP com OpenID Connect (authorization code com PKCE) e fique com a sessão da aplicação e a autorização. Você deixa de guardar senhas.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O fim do login: a resposta que abre a sessão",
        legenda: "HTTP",
        codigo: `POST /login HTTP/1.1
Host: app.exemplo.com
Content-Type: application/json

{"email":"maria@empresa.com","senha":"********"}

HTTP/1.1 204 No Content
Set-Cookie: __Host-sid=Zk3vT9...; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=3600
Cache-Control: no-store`,
        nota: "O id é aleatório e opaco: não carrega o usuário nem papéis. O `__Host-` obriga `Secure`, `Path=/` e nenhum `Domain`, o que impede outro subdomínio de sobrescrever o cookie.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra",
        texto:
          "Cada componente nasceu de uma falha concreta: o hash lento, da base vazada; o id aleatório, do cookie forjado; as flags do cookie, do roubo e do CSRF; o limite de tentativas, da adivinhação; o token de uso único, do reset; o MFA, da senha roubada. Se você não consegue dizer a falha que um componente conserta, não o acrescente; e se a lista cresceu, avalie delegar a um IdP.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Os detalhes que mais vazam",
        texto:
          "Mensagens diferentes para “usuário não existe” e “senha errada” permitem enumerar contas. Reset por pergunta secreta, ou por link que não expira, é a porta dos fundos. Registrar a senha digitada em log, mesmo em caso de erro, vaza credenciais. E nunca invente o seu esquema de criptografia ou de token: use bibliotecas e padrões maduros.",
      },
    ],
    armadilhas: [
      "Achar que hash com sal basta: ele protege a base vazada, mas não impede adivinhação online nem phishing.",
      "Usar `Math.random()` ou algo previsível (data, contador) para id de sessão ou token de reset.",
      "Deixar o cookie sem `Secure`, `HttpOnly` ou `SameSite`, ou manter o mesmo id de sessão antes e depois do login.",
      "Revelar se o e-mail existe (no login, no reset ou no cadastro), ou bloquear a conta de um jeito que qualquer pessoa consiga trancar a de outra.",
    ],
    autoteste: [
      {
        pergunta: "Por que se gera um novo id de sessão no login?",
        resposta:
          "Para impedir a fixação de sessão: se um atacante tivesse induzido a vítima a usar um id que ele conhece, esse id deixaria de valer no momento da autenticação.",
      },
      {
        pergunta: "Em que ponto vale parar de construir e delegar a um IdP?",
        resposta:
          "Quando o produto precisa de SSO, MFA e passkeys, login social, federação com clientes corporativos ou conformidade, porque manter tudo isso com segurança é caro. Aí a aplicação usa OpenID Connect (authorization code com PKCE) e deixa de guardar senhas.",
      },
    ],
  },
  en: {
    titulo: "Password login from scratch",
    pergunta:
      "How would you build an email-and-password login system from scratch, and which components would you add as you discover each flaw in the naive version?",
    porqueEsteMetodo:
      "A secure login system looks like an arbitrary list of requirements until you watch each one appear in response to an attack. Starting from the naive version and fixing one flaw at a time shows why it ends up this way, and where it is worth stopping.",
    resposta30s:
      "Start with the minimum (a plain-text password, a cookie holding the user id) and fix one flaw at a time: a **slow hash with a salt** for the leaked database, a **random session id** and a **secure cookie** (`Secure`, `HttpOnly`, `SameSite`) for session theft and forgery, **attempt limits** for guessing, **single-use tokens for reset and verification** and **MFA** for the stolen password. By then every item is an attack surface you must maintain: when the product needs SSO, passkeys or federation, **delegate to an IdP** with OpenID Connect.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one flaw at a time",
        passos: [
          {
            titulo: "0. What you want",
            texto:
              "A user proves they control an account with an email and a password, and the server recognizes their next requests without asking for the password again. The threats to beat: a leaked database, password guessing, session theft or prediction, and abuse of the recovery flows.",
          },
          {
            titulo: "1. The naive version",
            texto:
              "A `users(email, password)` table with the password in plain text and, after login, a cookie `user_id=42`. → Breaks: a database leak hands over every password (and many people reuse them on other sites), and anyone can edit the cookie to become user 43.",
          },
          {
            titulo: "2. A slow hash with a salt",
            texto:
              "Store only the output of **argon2id, scrypt or bcrypt** with a unique salt per password and compare in constant time, giving the same answer (“incorrect email or password”) for an unknown user and a wrong password. → Fixes the leaked database (see the backend guide on storing passwords). → Still breaks: the cookie is still forgeable.",
          },
          {
            titulo: "3. A random session identifier",
            texto:
              "After login the server generates a random id with a cryptographically secure generator (for example, 32 bytes), stores `id → user, expiry` and hands out only the id. Generate **a new id at every login** (prevents session fixation) and invalidate it on logout. → Breaks: the id travels in a cookie, and whoever steals it becomes the user.",
          },
          {
            titulo: "4. A secure cookie",
            texto:
              "Mark the cookie `Secure` (HTTPS only), `HttpOnly` (JavaScript cannot read it, which limits theft through XSS) and `SameSite=Lax` (reduces CSRF), use the `__Host-` prefix, set both an idle and an absolute expiry and serve everything over HTTPS with HSTS. For state-changing actions, add CSRF protection. → Breaks: an attacker can still try millions of passwords on the login page.",
          },
          {
            titulo: "5. Limit attempts",
            texto:
              "Limit per account and per IP with growing delays, alert on spikes of failures, ask for a challenge (CAPTCHA) after a number of attempts and reject common or already-leaked passwords, as NIST SP 800-63B recommends, instead of demanding complicated composition rules. Careful: a rigid account lockout lets anyone lock another person out. → Breaks: the user forgets the password.",
          },
          {
            titulo: "6. Password reset and email verification",
            texto:
              "Generate a random, single-use, short-lived token, store only its hash and email the link; answer the same whether or not the address exists, and invalidate sessions when the password changes. Do the same to confirm the email before trusting it. → Breaks: a password alone can still be phished.",
          },
          {
            titulo: "7. MFA",
            texto:
              "Add a second factor: TOTP, a security key or a passkey (phishing-resistant), with recovery codes guarded as carefully as a password and a recovery flow that is not the weak link. → Breaks: now there are many pieces to maintain and protect on your own.",
          },
          {
            titulo: "8. When to delegate to an IdP",
            texto:
              "Every item above is an attack surface and needs constant maintenance. When the product needs SSO, MFA and passkeys, social login, federation with corporate customers or compliance, hand authentication to an IdP using OpenID Connect (authorization code with PKCE) and keep the application session and authorization. You stop storing passwords.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The end of login: the response that opens the session",
        legenda: "HTTP",
        codigo: `POST /login HTTP/1.1
Host: app.example.com
Content-Type: application/json

{"email":"maria@company.com","password":"********"}

HTTP/1.1 204 No Content
Set-Cookie: __Host-sid=Zk3vT9...; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=3600
Cache-Control: no-store`,
        nota: "The id is random and opaque: it carries neither the user nor roles. `__Host-` requires `Secure`, `Path=/` and no `Domain`, which stops another subdomain from overwriting the cookie.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule",
        texto:
          "Each component was born from a concrete flaw: the slow hash from the leaked database; the random id from the forged cookie; the cookie flags from theft and CSRF; attempt limits from guessing; the single-use token from the reset; MFA from the stolen password. If you cannot name the flaw a component fixes, do not add it; and if the list has grown, consider delegating to an IdP.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The details that leak the most",
        texto:
          "Different messages for “user does not exist” and “wrong password” let people enumerate accounts. Reset by secret question, or by a link that never expires, is the back door. Writing the typed password to a log, even on error, leaks credentials. And never invent your own cryptography or token scheme: use mature libraries and standards.",
      },
    ],
    armadilhas: [
      "Thinking a salted hash is enough: it protects a leaked database, but does not stop online guessing or phishing.",
      "Using `Math.random()` or anything predictable (a date, a counter) for a session id or reset token.",
      "Leaving the cookie without `Secure`, `HttpOnly` or `SameSite`, or keeping the same session id before and after login.",
      "Revealing whether an email exists (at login, reset or sign-up), or locking accounts in a way that lets anyone lock out someone else.",
    ],
    autoteste: [
      {
        pergunta: "Why generate a new session id at login?",
        resposta:
          "To prevent session fixation: if an attacker had tricked the victim into using an id the attacker knows, that id stops being valid the moment authentication happens.",
      },
      {
        pergunta: "At what point is it worth stopping the build and delegating to an IdP?",
        resposta:
          "When the product needs SSO, MFA and passkeys, social login, federation with corporate customers or compliance, because keeping all of that secure is expensive. The application then uses OpenID Connect (authorization code with PKCE) and stops storing passwords.",
      },
    ],
  },
};
