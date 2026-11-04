import type { Pergunta } from "../../tipos";

// L47 · JWT vs sessão
export const l047: Pergunta = {
  numero: 147,
  modulo: "linkedin-express",
  metodo: "compare",
  pt: {
    titulo: "JWT vs sessão",
    pergunta: "Qual é a diferença entre autenticação com JWT e autenticação baseada em sessão?",
    porqueEsteMetodo:
      "JWT e sessão resolvem o mesmo problema com trocas opostas: onde fica o estado, quem consegue revogar e o que cada lado precisa guardar. Uma matriz lado a lado mostra essas trocas, e a regra de decisão diz quando cada uma compensa.",
    resposta30s:
      "Na **sessão**, o servidor guarda o estado e o cliente leva só um **id opaco** em cookie: revogar é apagar a sessão, mas escalar exige um armazenamento compartilhado (como Redis). No **JWT**, o estado vai **dentro de um token assinado** que qualquer instância valida sem consultar ninguém, mas ele **vale até expirar**, e revogar é difícil. Para usar JWT com segurança: **expiração curta e refresh com rotação**, validação de `alg`, `iss`, `aud` e `exp`, chaves fora do código e token em cookie `HttpOnly`, não em `localStorage`.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Sessão com cookie x JWT",
        colunas: ["Aspecto", "Sessão (cookie + estado no servidor)", "JWT (token assinado)"],
        linhas: [
          [
            "Onde fica o estado",
            "No servidor (memória, Redis ou banco); o cliente leva só um id opaco",
            "Dentro do token, nas claims assinadas; o servidor só valida a assinatura",
          ],
          ["O que o cliente envia", "Cookie com o id da sessão", "O token, em `Authorization: Bearer` ou em um cookie"],
          [
            "Revogação e logout",
            "Imediatos: basta apagar a sessão",
            "Difíceis: o token vale até o `exp`; exige expiração curta, lista de `jti` revogados ou versão por usuário (volta a ter estado)",
          ],
          [
            "Escala entre instâncias",
            "Precisa de um armazenamento compartilhado de sessões",
            "Qualquer instância valida só com a chave, sem consulta",
          ],
          [
            "Conteúdo e tamanho",
            "Id curto; os dados ficam no servidor",
            "Maior; as claims são legíveis por quem tem o token (assinado, não cifrado)",
          ],
          [
            "Vários serviços e terceiros",
            "Mais trabalhoso entre domínios e serviços",
            "Natural em microsserviços, APIs e login único (o OpenID Connect usa JWT)",
          ],
          [
            "Riscos típicos",
            "CSRF, já que o navegador envia o cookie sozinho (use `SameSite` e token CSRF)",
            "Roubo por XSS se estiver no `localStorage`; token roubado vale até expirar; erros de validação (`alg`)",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Aplicação web com um backend (ou poucos) e necessidade de logout e revogação imediatos: **sessão com cookie HttpOnly**. API consumida por vários clientes ou serviços, login único ou validação distribuída: **JWT de vida curta**, de preferência emitido por um provedor de identidade. JWT não é “melhor”: troca a revogação simples por validação sem consulta. Muitos sistemas combinam os dois: token de acesso curto mais um refresh token guardado no servidor.",
      },
      {
        tipo: "pares",
        titulo: "Como proteger a autenticação por JWT",
        rotuloOrigem: "Risco",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem: "Token roubado (XSS, log, dispositivo comprometido)",
            destino:
              "Expiração curta (minutos); cookie `HttpOnly; Secure; SameSite` em vez de `localStorage`; nunca colocar o token na URL nem em logs",
          },
          {
            origem: "Token forjado ou adulterado (`alg: none`, troca de HS256 por RS256)",
            destino:
              "Verificar sempre a assinatura e fixar a lista de `algorithms` e a chave no servidor, sem confiar no `alg` do cabeçalho",
          },
          {
            origem: "Token válido de outro emissor ou de outro serviço",
            destino: "Conferir `iss` (emissor), `aud` (destinatário) e `exp` (validade) em toda requisição",
          },
          {
            origem: "Segredo fraco ou vazado",
            destino:
              "Segredo longo e aleatório fora do repositório (veja L126), ou par de chaves assimétricas com a chave privada só no emissor; rotação com `kid`",
          },
          {
            origem: "Refresh token roubado ou sem revogação",
            destino:
              "Refresh token de uso único, com rotação: cada uso emite um novo e invalida o antigo; o servidor o guarda (como hash), detecta reuso e revoga a cadeia",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Validando um JWT no servidor",
        legenda: "JavaScript",
        codigo: [
          'import jwt from "jsonwebtoken";',
          "",
          "export function validar(token) {",
          "  return jwt.verify(token, process.env.JWT_SEGREDO, {",
          '    algorithms: ["HS256"], // lista fechada: nunca aceite "none" nem o que o cabeçalho pedir',
          '    issuer: "https://auth.exemplo.com",',
          '    audience: "api-pedidos",',
          "  }); // lança erro se assinatura, `exp`, emissor ou público não baterem",
          "}",
        ].join("\n"),
        nota: "`jwt.decode` só lê o conteúdo e NÃO verifica a assinatura: nunca use o resultado dele para autenticar. Com várias aplicações, prefira chaves assimétricas (a API só precisa da chave pública).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "JWT não é criptografia, e “stateless” tem preço",
        texto:
          "O conteúdo do JWT é só codificado em Base64URL: qualquer portador o lê, então nada sensível vai no payload. A assinatura garante integridade, não sigilo. E ser “sem estado” significa que o servidor não consegue revogar sozinho: todo recurso de revogação (lista de `jti`, refresh token no servidor) reintroduz estado. Veja também CSRF e XSS em L124 e a escolha entre autenticação e autorização em L45.",
      },
    ],
    armadilhas: [
      "Achar que JWT é mais seguro ou sempre melhor: ele troca revogação simples por validação sem consulta, e para uma aplicação web com um backend a sessão costuma ser mais simples e segura.",
      "Guardar o JWT no `localStorage`: qualquer script injetado (XSS) consegue lê-lo e enviá-lo para fora.",
      "Emitir tokens de acesso com validade de dias ou semanas, sem como revogá-los, “porque é stateless”.",
      "Aceitar o `alg` que o token informa, pular a conferência de `iss` e `aud`, ou usar `jwt.decode` sem verificar a assinatura.",
    ],
    autoteste: [
      {
        pergunta: "Por que o logout e a revogação são mais difíceis com JWT?",
        resposta:
          "O token é autossuficiente e vale até o `exp`; o servidor não consulta nada ao validá-lo. Para revogar, é preciso reintroduzir estado (lista de `jti`, versão do usuário) ou usar tokens curtos com refresh token revogável.",
      },
      {
        pergunta: "O payload de um JWT é secreto?",
        resposta:
          "Não. Ele é apenas codificado em Base64URL e qualquer portador o lê. A assinatura garante a integridade, não o sigilo, então não coloque dados sensíveis nele.",
      },
    ],
  },
  en: {
    titulo: "JWT vs sessions",
    pergunta: "What is the difference between JWT and session-based authentication?",
    porqueEsteMetodo:
      "JWT and sessions solve the same problem with opposite trade-offs: where the state lives, who can revoke it and what each side must store. A side-by-side matrix shows those trade-offs, and the decision rule says when each one pays off.",
    resposta30s:
      "With a **session**, the server keeps the state and the client carries only an **opaque id** in a cookie: revoking means deleting the session, but scaling needs shared storage (such as Redis). With a **JWT**, the state travels **inside a signed token** that any instance can validate without asking anyone, but it **stays valid until it expires**, and revoking is hard. To use JWT safely: **short expiry and refresh with rotation**, validation of `alg`, `iss`, `aud` and `exp`, keys kept out of the code and the token in an `HttpOnly` cookie, not in `localStorage`.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Cookie session vs JWT",
        colunas: ["Aspect", "Session (cookie + server-side state)", "JWT (signed token)"],
        linhas: [
          [
            "Where the state lives",
            "On the server (memory, Redis or database); the client carries only an opaque id",
            "Inside the token, in the signed claims; the server only validates the signature",
          ],
          [
            "What the client sends",
            "A cookie with the session id",
            "The token, in `Authorization: Bearer` or in a cookie",
          ],
          [
            "Revocation and logout",
            "Immediate: just delete the session",
            "Hard: the token is valid until `exp`; needs short expiry, a list of revoked `jti` values or a per-user version (state comes back)",
          ],
          [
            "Scaling across instances",
            "Needs shared session storage",
            "Any instance validates with just the key, no lookup",
          ],
          [
            "Content and size",
            "Short id; the data stays on the server",
            "Larger; the claims are readable by whoever holds the token (signed, not encrypted)",
          ],
          [
            "Multiple services and third parties",
            "More work across domains and services",
            "Natural for microservices, APIs and single sign-on (OpenID Connect uses JWT)",
          ],
          [
            "Typical risks",
            "CSRF, since the browser sends the cookie on its own (use `SameSite` and a CSRF token)",
            "Theft via XSS if kept in `localStorage`; a stolen token is valid until it expires; validation mistakes (`alg`)",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "A web application with one backend (or a few) that needs immediate logout and revocation: **a session with an HttpOnly cookie**. An API used by several clients or services, single sign-on or distributed validation: a **short-lived JWT**, preferably issued by an identity provider. JWT is not “better”: it trades simple revocation for validation without a lookup. Many systems combine both: a short access token plus a refresh token stored on the server.",
      },
      {
        tipo: "pares",
        titulo: "How to secure JWT-based authentication",
        rotuloOrigem: "Risk",
        rotuloDestino: "Defense",
        pares: [
          {
            origem: "Stolen token (XSS, logs, a compromised device)",
            destino:
              "Short expiry (minutes); an `HttpOnly; Secure; SameSite` cookie instead of `localStorage`; never put the token in the URL or in logs",
          },
          {
            origem: "Forged or tampered token (`alg: none`, swapping HS256 for RS256)",
            destino:
              "Always verify the signature and fix the list of `algorithms` and the key on the server, without trusting the header’s `alg`",
          },
          {
            origem: "A valid token from another issuer or meant for another service",
            destino: "Check `iss` (issuer), `aud` (audience) and `exp` (expiry) on every request",
          },
          {
            origem: "Weak or leaked secret",
            destino:
              "A long random secret kept out of the repository (see L126), or an asymmetric key pair with the private key only at the issuer; rotate with `kid`",
          },
          {
            origem: "Stolen or unrevocable refresh token",
            destino:
              "Single-use refresh token with rotation: each use issues a new one and invalidates the old; the server stores it (hashed), detects reuse and revokes the chain",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Validating a JWT on the server",
        legenda: "JavaScript",
        codigo: [
          'import jwt from "jsonwebtoken";',
          "",
          "export function validate(token) {",
          "  return jwt.verify(token, process.env.JWT_SECRET, {",
          '    algorithms: ["HS256"], // closed list: never accept "none" or whatever the header asks for',
          '    issuer: "https://auth.example.com",',
          '    audience: "orders-api",',
          "  }); // throws if the signature, `exp`, issuer or audience do not match",
          "}",
        ].join("\n"),
        nota: "`jwt.decode` only reads the content and does NOT verify the signature: never use its result to authenticate. With several applications, prefer asymmetric keys (the API only needs the public key).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "JWT is not encryption, and “stateless” has a price",
        texto:
          "A JWT’s content is only Base64URL-encoded: anyone holding it can read it, so nothing sensitive goes in the payload. The signature guarantees integrity, not secrecy. And being “stateless” means the server cannot revoke on its own: every revocation feature (a `jti` list, a server-side refresh token) brings state back. See also CSRF and XSS in L124 and authentication versus authorization in L45.",
      },
    ],
    armadilhas: [
      "Thinking JWT is more secure or always better: it trades simple revocation for validation without a lookup, and for a web application with one backend a session is usually simpler and safer.",
      "Storing the JWT in `localStorage`: any injected script (XSS) can read it and send it elsewhere.",
      "Issuing access tokens valid for days or weeks with no way to revoke them, “because it is stateless”.",
      "Accepting the `alg` the token reports, skipping the `iss` and `aud` checks, or using `jwt.decode` without verifying the signature.",
    ],
    autoteste: [
      {
        pergunta: "Why are logout and revocation harder with JWT?",
        resposta:
          "The token is self-contained and valid until `exp`; the server looks nothing up when validating it. To revoke, you must bring state back (a `jti` list, a per-user version) or use short tokens with a revocable refresh token.",
      },
      {
        pergunta: "Is a JWT payload secret?",
        resposta:
          "No. It is only Base64URL-encoded, and anyone holding the token can read it. The signature guarantees integrity, not secrecy, so do not put sensitive data in it.",
      },
    ],
  },
};
