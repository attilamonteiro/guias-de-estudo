import type { Pergunta } from "../../tipos";

// M37 · Autenticação segura
export const m37: Pergunta = {
  numero: 237,
  modulo: "mentorcruise",
  metodo: "threat",
  pt: {
    titulo: "Autenticação segura",
    pergunta: "Como você implementaria um sistema de autenticação seguro no backend?",
    porqueEsteMetodo:
      "Autenticação segura não é uma lista de recursos, é uma resposta a ataques conhecidos. Cada defesa existe para barrar uma forma concreta de invasão, e pensar em pares ataque → defesa mostra o que está coberto e o que ficou de fora.",
    resposta30s:
      "Pense em **ataque → defesa**. Senhas: guardar só **hash lento com sal** (argon2id, bcrypt ou scrypt). Força bruta e credential stuffing: **limitação de taxa**, bloqueio progressivo, **MFA** e checagem de senhas vazadas. Sessões: cookies **Secure, HttpOnly e SameSite**, expiração curta e ID novo no login. Tokens: acesso de vida curta, **refresh com rotação** e validação de `alg`, `iss`, `aud` e `exp`. Contra phishing, **passkeys (WebAuthn)**. Some mensagens genéricas, tokens de uso único na redefinição, logs e alertas, e prefira **biblioteca madura ou provedor OIDC** a código próprio.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ataque → defesa",
        rotuloOrigem: "Ataque",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "Credential stuffing e força bruta: pares e-mail/senha vazados de outros sites, ou palpites em massa, testados contra o login",
            destino:
              "**Limitação de taxa** por conta, por IP e por dispositivo; atraso progressivo e desafio extra (como CAPTCHA) após falhas, em vez de bloquear a conta para sempre; **MFA**; e **checagem de senhas vazadas** no cadastro e na troca, sem expor a senha a terceiros.",
          },
          {
            origem: "Vazamento do banco de senhas: o atacante testa palpites offline, sem nenhum limite de taxa",
            destino:
              "Guardar só um **hash lento com sal único** (argon2id, bcrypt ou scrypt), com custo configurável e refeito no login quando o custo sobe. Nunca texto puro, nem um hash rápido como SHA-256 sozinho (veja Q20).",
          },
          {
            origem:
              "Sequestro de sessão: o ID da sessão é roubado (rede, XSS, log) ou imposto à vítima antes do login (session fixation)",
            destino:
              "ID aleatório gerado pelo servidor; cookie com **Secure, HttpOnly e SameSite**; HTTPS em tudo; **ID novo a cada login** e a cada mudança de privilégio; expiração por inatividade e absoluta; logout que invalida a sessão no servidor.",
          },
          {
            origem: "Token roubado: um token de acesso ou de refresh cai em mãos erradas",
            destino:
              "**Token de acesso de vida curta**; **refresh token com rotação** (cada uso emite um novo e invalida o anterior; se um já usado reaparecer, revogue a família inteira); guardar onde scripts da página não leiam (cookie `HttpOnly` em vez de `localStorage`); poder revogar.",
          },
          {
            origem:
              "JWT forjado ou mal validado: `alg: none`, troca de algoritmo, token de outro serviço ou já expirado",
            destino:
              "Fixar no servidor o algoritmo aceito e **validar assinatura, `exp`, `iss` e `aud`** a cada uso; chaves rotacionáveis (`kid`/JWKS); lembrar que o conteúdo do JWT é só codificado, não secreto (veja Q16).",
          },
          {
            origem: "Phishing e senha reaproveitada: o usuário digita as credenciais num site falso",
            destino:
              "**MFA**, de preferência resistente a phishing: **passkeys (WebAuthn)**, em que a credencial só responde ao domínio onde foi registrada. Códigos TOTP são melhores que nada, mas um site falso pode repassá-los em tempo real; SMS é o mais frágil dos segundos fatores (SIM swap, interceptação).",
          },
          {
            origem:
              "Enumeração de contas: descobrir quais e-mails existem pelas diferenças nas respostas (texto, código, tempo)",
            destino:
              "Mensagens **genéricas** no login e na recuperação (“e-mail ou senha incorretos”; “se o e-mail existir, enviamos instruções”), tempo de resposta parecido nos dois casos e limitação de taxa também no cadastro e na recuperação.",
          },
          {
            origem: "CSRF: outro site faz o navegador enviar uma requisição que carrega o cookie de sessão",
            destino:
              "`SameSite` nos cookies, **token anti-CSRF** nas requisições que alteram estado e conferência do cabeçalho `Origin`. CORS não substitui isso (veja Q18).",
          },
          {
            origem: "Redefinição de senha como porta dos fundos: link adivinhado, reaproveitado ou vazado",
            destino:
              "Token aleatório longo, **de uso único e curta validade**, guardado no servidor só como hash; invalidar ao usar; **encerrar as outras sessões** depois da troca; avisar o dono da conta por e-mail; não deixar a recuperação virar um caminho que ignora o MFA.",
          },
          {
            origem: "Ataque em andamento que ninguém vê",
            destino:
              "**Logs de autenticação** (login, falha, troca de senha, MFA, redefinição) sem gravar senhas nem tokens; alertas para picos de falhas e para login de local novo; tela em que o usuário vê e encerra as próprias sessões (veja Q28).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Cookie de sessão com os atributos certos",
        legenda: "http",
        codigo: `# resposta do servidor depois do login (e depois de gerar um ID de sessão novo)
Set-Cookie: __Host-sid=<id aleatório gerado pelo servidor>; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=3600

# Secure:   só trafega por HTTPS
# HttpOnly: JavaScript da página não consegue ler o cookie
# SameSite: o navegador não o envia em requisições disparadas por outros sites (reduz CSRF)`,
        nota: "O prefixo `__Host-` faz o navegador exigir `Secure` e `Path=/` e proibir `Domain`. `HttpOnly` limita o roubo do cookie por script injetado, mas não impede que esse script faça requisições em nome do usuário.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Não escreva o seu",
        texto:
          "Prefira o suporte de autenticação maduro do seu framework e, quando possível, um provedor de identidade com OpenID Connect e OAuth 2.0 (veja Q16) a implementar sessões, hashing e redefinição de senha à mão. Os erros que derrubam contas são sutis: comparação de segredos que não é em tempo constante, validação incompleta de tokens, um caso de borda no fluxo de redefinição.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Autenticar não é autorizar",
        texto:
          "O login prova quem a pessoa é; não diz o que ela pode fazer. Um sistema com login impecável ainda vaza dados se cada endpoint não verificar a permissão sobre o recurso pedido (por exemplo, trocar o ID na URL e ver o pedido de outra pessoa).",
      },
    ],
    armadilhas: [
      "Usar um hash rápido (MD5, SHA-256 puro) para senhas, mesmo com sal: o atacante testa um número enorme de palpites por segundo.",
      "Guardar um JWT de longa vida no `localStorage`: qualquer script injetado o lê, e é difícil revogá-lo.",
      "Responder “usuário não existe” num caso e “senha incorreta” no outro, ou levar tempos diferentes: entrega a lista de contas ao atacante.",
      "Bloquear a conta para sempre após N falhas: o atacante tranca a vítima de propósito, e o bloqueio vira ferramenta de negação de serviço.",
    ],
    autoteste: [
      {
        pergunta: "Por que o hash de senha precisa ser lento e ter sal?",
        resposta:
          "Lento, para encarecer cada palpite se o banco vazar e o atacante testar offline. Sal único por usuário, para impedir tabelas pré-calculadas e para que senhas iguais não gerem o mesmo hash.",
      },
      {
        pergunta: "O que a rotação de refresh token adiciona?",
        resposta:
          "Cada uso emite um token novo e invalida o anterior. Se um token já usado aparecer de novo, é sinal de roubo, e toda a cadeia de tokens daquela sessão é revogada.",
      },
      {
        pergunta: "Por que passkeys resistem a phishing?",
        resposta:
          "A credencial só responde ao domínio em que foi registrada, então um site falso não consegue uma resposta válida. Também não há segredo digitado que o usuário possa entregar.",
      },
    ],
  },
  en: {
    titulo: "Secure authentication",
    pergunta: "How would you go about implementing a secure authentication system on the backend?",
    porqueEsteMetodo:
      "Secure authentication is not a feature list, it is a response to known attacks. Each defense exists to stop a concrete way in, and thinking in attack → defense pairs shows what is covered and what was left out.",
    resposta30s:
      "Think **attack → defense**. Passwords: store only a **slow, salted hash** (argon2id, bcrypt or scrypt). Brute force and credential stuffing: **rate limiting**, progressive lockout, **MFA** and a check against leaked passwords. Sessions: **Secure, HttpOnly and SameSite** cookies, short lifetimes and a new ID at login. Tokens: short-lived access, **refresh with rotation** and validation of `alg`, `iss`, `aud` and `exp`. Against phishing, **passkeys (WebAuthn)**. Add generic messages, single-use reset tokens, logs and alerts, and prefer a **mature library or an OIDC provider** over homemade code.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Attack → defense",
        rotuloOrigem: "Attack",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "Credential stuffing and brute force: email/password pairs leaked from other sites, or mass guessing, tried against the login",
            destino:
              "**Rate limiting** per account, per IP and per device; progressive delay and an extra challenge (such as a CAPTCHA) after failures, instead of locking the account forever; **MFA**; and a **check against leaked passwords** at sign-up and password change, without exposing the password to third parties.",
          },
          {
            origem: "Password database leak: the attacker tests guesses offline, with no rate limit at all",
            destino:
              "Store only a **slow hash with a unique salt** (argon2id, bcrypt or scrypt), with a configurable cost that is redone at login when the cost goes up. Never plain text, nor a fast hash like bare SHA-256 (see Q20).",
          },
          {
            origem:
              "Session hijacking: the session ID is stolen (network, XSS, logs) or imposed on the victim before login (session fixation)",
            destino:
              "Random ID generated by the server; cookie with **Secure, HttpOnly and SameSite**; HTTPS everywhere; a **new ID at every login** and every privilege change; idle and absolute expiry; logout that invalidates the session on the server.",
          },
          {
            origem: "Stolen token: an access or refresh token falls into the wrong hands",
            destino:
              "**Short-lived access token**; **refresh token with rotation** (each use issues a new one and invalidates the previous; if a used one shows up again, revoke the whole family); store it where page scripts cannot read it (an `HttpOnly` cookie instead of `localStorage`); keep revocation possible.",
          },
          {
            origem:
              "Forged or poorly validated JWT: `alg: none`, algorithm swap, a token from another service or an expired one",
            destino:
              "Pin the accepted algorithm on the server and **validate signature, `exp`, `iss` and `aud`** on every use; rotatable keys (`kid`/JWKS); remember that a JWT’s content is only encoded, not secret (see Q16).",
          },
          {
            origem: "Phishing and reused passwords: the user types credentials into a fake site",
            destino:
              "**MFA**, preferably phishing-resistant: **passkeys (WebAuthn)**, where the credential only answers to the domain it was registered for. TOTP codes are better than nothing, but a fake site can relay them in real time; SMS is the weakest second factor (SIM swap, interception).",
          },
          {
            origem:
              "Account enumeration: finding out which emails exist from differences in responses (text, status, timing)",
            destino:
              "**Generic** messages on login and recovery (“incorrect email or password”; “if the email exists, we sent instructions”), similar response time in both cases, and rate limiting on sign-up and recovery too.",
          },
          {
            origem: "CSRF: another site makes the browser send a request that carries the session cookie",
            destino:
              "`SameSite` on cookies, an **anti-CSRF token** on state-changing requests, and a check of the `Origin` header. CORS does not replace this (see Q18).",
          },
          {
            origem: "Password reset as a back door: a link that is guessed, reused or leaked",
            destino:
              "A long random token that is **single-use and short-lived**, stored on the server only as a hash; invalidate it on use; **end the other sessions** after the change; notify the account owner by email; do not let recovery become a path that skips MFA.",
          },
          {
            origem: "An attack in progress that nobody sees",
            destino:
              "**Authentication logs** (login, failure, password change, MFA, reset) that never record passwords or tokens; alerts for spikes in failures and for logins from a new location; a screen where users see and end their own sessions (see Q28).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A session cookie with the right attributes",
        legenda: "http",
        codigo: `# server response after login (and after generating a new session ID)
Set-Cookie: __Host-sid=<random id generated by the server>; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=3600

# Secure:   only sent over HTTPS
# HttpOnly: page JavaScript cannot read the cookie
# SameSite: the browser does not send it on requests triggered by other sites (reduces CSRF)`,
        nota: "The `__Host-` prefix makes the browser require `Secure` and `Path=/` and forbid `Domain`. `HttpOnly` limits cookie theft by injected script, but does not stop that script from making requests on the user’s behalf.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Do not write your own",
        texto:
          "Prefer your framework’s mature authentication support and, when possible, an identity provider speaking OpenID Connect and OAuth 2.0 (see Q16) over hand-rolling sessions, hashing and password reset. The mistakes that bring accounts down are subtle: secret comparisons that are not constant-time, incomplete token validation, an edge case in the reset flow.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Authenticating is not authorizing",
        texto:
          "Login proves who the person is; it does not say what they may do. A system with flawless login still leaks data if every endpoint does not check permission on the requested resource (for example, changing the ID in the URL to see someone else’s order).",
      },
    ],
    armadilhas: [
      "Using a fast hash (MD5, bare SHA-256) for passwords, even with a salt: the attacker tests an enormous number of guesses per second.",
      "Keeping a long-lived JWT in `localStorage`: any injected script reads it, and it is hard to revoke.",
      "Answering “user does not exist” in one case and “wrong password” in the other, or taking different times: it hands the attacker the list of accounts.",
      "Locking the account forever after N failures: the attacker locks the victim out on purpose, and the lockout becomes a denial-of-service tool.",
    ],
    autoteste: [
      {
        pergunta: "Why must a password hash be slow and salted?",
        resposta:
          "Slow, to make every guess expensive if the database leaks and the attacker tests offline. A unique salt per user, to defeat precomputed tables and so identical passwords do not produce the same hash.",
      },
      {
        pergunta: "What does refresh token rotation add?",
        resposta:
          "Each use issues a new token and invalidates the previous one. If an already-used token appears again, it signals theft, and the whole chain of tokens for that session is revoked.",
      },
      {
        pergunta: "Why are passkeys resistant to phishing?",
        resposta:
          "The credential only answers to the domain it was registered for, so a fake site cannot obtain a valid response. There is also no typed secret the user could hand over.",
      },
    ],
  },
};
