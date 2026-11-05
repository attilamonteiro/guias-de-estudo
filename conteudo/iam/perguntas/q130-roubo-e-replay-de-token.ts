import type { Pergunta } from "../../tipos";

// Q130 · Roubo e replay de token
export const q130: Pergunta = {
  numero: 130,
  modulo: "ataques-e-depuracao",
  metodo: "threat",
  pt: {
    titulo: "Roubo e replay de token",
    pergunta:
      "Como tokens são roubados e reutilizados (replay) e como limitar o dano? Considere vazamento em logs, XSS, malware, replay entre APIs e confused deputy.",
    porqueEsteMetodo:
      "O roubo de token tem vários vetores e nenhuma defesa única resolve todos. Os pares ligam cada vetor à contramedida que reduz o dano, o que mostra a defesa em camadas que a entrevista espera.",
    resposta30s:
      "Um **bearer token** vale para quem o apresentar, então basta roubá-lo (de **logs e URLs**, por **XSS**, por **malware**) ou reapresentá-lo na API errada (**replay entre APIs**, **confused deputy**) para agir como o usuário. Você limita o dano em camadas: **vida curta**, **`aud` restrita por API**, token **vinculado ao remetente** (DPoP, mTLS), nunca em URL, logs redigidos, **rotação do refresh token** e **detecção e revogação** rápidas. Contra malware no dispositivo, nenhuma camada sozinha basta.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Vetor → defesa",
        rotuloOrigem: "Vetor",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "**Logs e URLs**: token na query string (`?access_token=`), em logs de requisição, em traces de APM, em mensagens de erro, em capturas coladas em chamados ou em decodificadores online, e no cabeçalho `Referer`.",
            destino:
              "Token só no cabeçalho `Authorization`, nunca na URL; **redação** de `Authorization`, `Cookie` e query strings em logs e traces; `Referrer-Policy` restritiva; nunca colar token real em chamado, chat ou ferramenta online. A RFC 6750 já trata o token na query como último recurso: hoje, trate como proibido.",
          },
          {
            origem:
              "**XSS**: o script injetado lê tokens guardados em `localStorage` ou na memória, ou chama a API com a sessão do usuário (veja Q127).",
            destino:
              "Prevenir o XSS (escape, CSP); não guardar tokens onde o script lê; **BFF** com os tokens no servidor e cookie `HttpOnly` para o navegador (veja Q41 e Q80); access token de vida curta.",
          },
          {
            origem:
              "**Malware e spyware** no dispositivo (infostealer, keylogger, extensão maliciosa): capturam senha e código de MFA e leem cookies e arquivos do perfil do navegador. O cookie roubado já carrega o MFA feito (veja Q97): é assim que o spyware esvazia o IAM, agindo depois da autenticação forte.",
            destino:
              "Nenhuma defesa de token vence um dispositivo totalmente comprometido; o objetivo é **limitar o raio**: vida curta, reautenticação em ação sensível (step-up, Q99), token **vinculado ao remetente** para não ser levado a outra máquina, acesso condicional e postura do dispositivo (Q123) e detecção de uso anômalo.",
          },
          {
            origem:
              "**Replay entre APIs**: o token emitido para a API A é aceito pela API B, ou por um serviço que o repassa, porque ninguém conferiu para quem ele foi emitido.",
            destino:
              "**Audience restrita**: pedir o token para um recurso específico (`audience` ou `resource`, RFC 8707) e fazer cada API validar `iss`, `aud` e escopos, recusando o que não é para ela. Para encadear chamadas, **trocar o token** (token exchange ou on-behalf-of, Q36) em vez de repassar o mesmo. Um token vinculado ao remetente também impede a API B de reutilizá-lo contra a C.",
          },
          {
            origem:
              "**Confused deputy**: um serviço com poder próprio é induzido por quem não tem esse direito (ou aceita um token destinado a outro) e usa o privilégio dele em nome do atacante.",
            destino:
              "O serviço **age com a identidade e os escopos do chamador** (delegação), valida `aud` e a permissão do chamador sobre o recurso pedido (veja Q136), não aceita IDs de usuário ou de cliente vindos do corpo como prova e carrega o mínimo de privilégio.",
          },
          {
            origem: "**Refresh token** roubado: renova access tokens por dias ou semanas, em silêncio.",
            destino:
              "**Rotação com detecção de reuso** (um refresh usado duas vezes revoga a família), validade limitada, ligação ao cliente (e ao remetente em cliente público) e revogação (RFC 7009). Veja Q34 e Q35.",
          },
          {
            origem: "O token roubado é usado de outro lugar e ninguém percebe até o dano.",
            destino:
              "Monitorar o uso (IP, ASN, país, user agent, volume atípico, viagem impossível), correlacionar por `jti` e sessão e **revogar rápido** por sessão, usuário ou dispositivo (introspecção, lista de revogação, avaliação contínua). Veja Q77, Q123 e Q139.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Claims que limitam o estrago",
        legenda: "JWT",
        codigo: `// Payload de um access token de curta duração, para uma API só
{
  "iss": "https://idp.example.com",
  "sub": "user-123",
  "aud": "https://api-pedidos.example.com",
  "scope": "pedidos:ler",
  "iat": 1767225600,
  "exp": 1767225900,
  "jti": "9f8c1a52-3c0e-4b7e-9a31-5d2e0a7b6c11",
  "cnf": { "jkt": "0ZcOCORZNYy-DWpqq30jZyJGHTN0d2HglBV3uiguA4I" }
}`,
        nota: "`aud` restringe o token a uma API, `exp` (aqui, cinco minutos depois de `iat`) limita a janela, `scope` limita o que ele faz e `cnf.jkt` o liga à chave do cliente (DPoP, RFC 9449). No mTLS a ligação é feita por `cnf` com o hash do certificado (RFC 8705).",
      },
      {
        tipo: "codigo",
        titulo: "Token vinculado ao remetente (DPoP)",
        legenda: "HTTP",
        codigo:
          "# Requisição legítima: token mais a prova assinada pela chave do cliente\nGET /pedidos/1001 HTTP/1.1\nHost: api-pedidos.example.com\nAuthorization: DPoP eyJhbGciOiJSUzI1NiIs...\nDPoP: eyJ0eXAiOiJkcG9wK2p3dCIsImFsZyI6IkVTMjU2In0...\n\n# Token roubado, sem a prova de posse: a API responde 401\nGET /pedidos/1001 HTTP/1.1\nHost: api-pedidos.example.com\nAuthorization: DPoP eyJhbGciOiJSUzI1NiIs...",
        nota: "A prova `DPoP` é um JWT assinado com a chave privada do cliente que cobre o método (`htm`), a URL (`htu`), um identificador único (`jti`) e o hash do token (`ath`). A API confere a assinatura, a frescura e se a chave bate com o `cnf.jkt` do token.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A regra de limitação do dano",
        texto:
          "**Bearer** significa que quem apresenta o token é tratado como o dono. Não dá para impedir todo vazamento, então limite o valor do que vazou: **onde vale** (`aud` por API), **por quanto tempo** (expiração curta, refresh com rotação), **para quem** (token vinculado ao remetente), **o que revela** (nunca em URL, logs redigidos) e **quão rápido some** (detecção e revogação).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Dispositivo comprometido",
        texto:
          "Se o dispositivo está comprometido, nenhuma camada garante: o malware pode usar a sessão e até a chave a partir de dentro da máquina. A vinculação ao remetente impede **levar** o token para outro lugar, não **agir** de onde o usuário está. Trate esse caso como incidente (veja Q140) e reduza o que uma sessão pode fazer sem reautenticar.",
      },
    ],
    armadilhas: [
      "Registrar cabeçalhos e URLs completos “para depurar”: o log vira um depósito de tokens válidos. Redija `Authorization`, `Cookie` e query strings.",
      "Usar o mesmo access token para várias APIs (`aud` genérico) ou repassá-lo a jusante: um serviço comprometido ou enganado o reaproveita em todas.",
      "Achar que o MFA protege a sessão depois do login: o cookie ou token roubado ao fim da autenticação já carrega o MFA. Proteja o token, não só a entrada.",
      "Confiar só na expiração curta, ou deixar um refresh token longo sem rotação e sem detecção de reuso: ele gera novos access tokens indefinidamente.",
    ],
    autoteste: [
      {
        pergunta: "Por que um token emitido para a API A não deve funcionar na API B, e o que a B precisa conferir?",
        resposta:
          "Porque um bearer token vale em qualquer lugar que o aceite, e um serviço enganado vira confused deputy. A B deve conferir a assinatura, o `iss` e se o `aud` contém o seu identificador, além dos escopos.",
      },
      {
        pergunta: "O que muda com DPoP ou mTLS em relação a um bearer token simples?",
        resposta:
          "O token fica ligado a uma chave do cliente (`cnf`), e a API exige uma prova de posse a cada requisição. Um token roubado sozinho não serve. Isso não cobre malware que usa a chave dentro do próprio dispositivo.",
      },
    ],
  },
  en: {
    titulo: "Token theft and replay",
    pergunta:
      "How are tokens stolen and replayed, and how do you limit the damage? Consider leaks in logs, XSS, malware, cross-API replay and the confused deputy.",
    porqueEsteMetodo:
      "Token theft has several vectors and no single defense solves them all. The pairs link each vector to the countermeasure that reduces the damage, which shows the layered defense an interview expects.",
    resposta30s:
      "A **bearer token** is valid for whoever presents it, so it is enough to steal it (from **logs and URLs**, through **XSS**, through **malware**) or to present it to the wrong API (**cross-API replay**, **confused deputy**) to act as the user. You limit the damage in layers: **short lifetime**, **`aud` restricted per API**, **sender-bound** tokens (DPoP, mTLS), never in a URL, redacted logs, **refresh token rotation** and fast **detection and revocation**. Against malware on the device, no single layer is enough.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Vector → defense",
        rotuloOrigem: "Vector",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "**Logs and URLs**: a token in the query string (`?access_token=`), in request logs, in APM traces, in error messages, in captures pasted into tickets or online decoders, and in the `Referer` header.",
            destino:
              "Token only in the `Authorization` header, never in the URL; **redaction** of `Authorization`, `Cookie` and query strings in logs and traces; a restrictive `Referrer-Policy`; never paste a real token into a ticket, chat or online tool. RFC 6750 already treats the query-string token as a last resort: today, treat it as forbidden.",
          },
          {
            origem:
              "**XSS**: the injected script reads tokens kept in `localStorage` or in memory, or calls the API with the user’s session (see Q127).",
            destino:
              "Prevent XSS (escaping, CSP); do not keep tokens where scripts can read them; a **BFF** with the tokens on the server and an `HttpOnly` cookie for the browser (see Q41 and Q80); short-lived access tokens.",
          },
          {
            origem:
              "**Malware and spyware** on the device (infostealer, keylogger, malicious extension): they capture the password and the MFA code and read cookies and browser profile files. The stolen cookie already carries the completed MFA (see Q97): this is how spyware hollows out IAM, acting after the strong authentication.",
            destino:
              "No token defense beats a fully compromised device; the goal is to **limit the blast radius**: short lifetime, re-authentication for sensitive actions (step-up, Q99), **sender-bound** tokens so they cannot be carried to another machine, conditional access and device posture (Q123), and detection of anomalous use.",
          },
          {
            origem:
              "**Cross-API replay**: the token issued for API A is accepted by API B, or by a service that forwards it, because nobody checked who it was issued for.",
            destino:
              "**Restricted audience**: request the token for a specific resource (`audience` or `resource`, RFC 8707) and have each API validate `iss`, `aud` and scopes, refusing what is not meant for it. To chain calls, **exchange the token** (token exchange or on-behalf-of, Q36) instead of forwarding the same one. A sender-bound token also stops API B from reusing it against C.",
          },
          {
            origem:
              "**Confused deputy**: a service with its own power is tricked by someone who lacks that right (or accepts a token meant for another) and uses its privilege on the attacker’s behalf.",
            destino:
              "The service **acts with the caller’s identity and scopes** (delegation), validates `aud` and the caller’s permission on the requested resource (see Q136), does not accept user or client IDs from the body as proof, and holds minimal privilege.",
          },
          {
            origem: "A stolen **refresh token**: it renews access tokens for days or weeks, silently.",
            destino:
              "**Rotation with reuse detection** (a refresh used twice revokes the family), limited validity, binding to the client (and to the sender for public clients) and revocation (RFC 7009). See Q34 and Q35.",
          },
          {
            origem: "The stolen token is used from somewhere else and nobody notices until the damage is done.",
            destino:
              "Monitor use (IP, ASN, country, user agent, atypical volume, impossible travel), correlate by `jti` and session, and **revoke fast** by session, user or device (introspection, revocation list, continuous evaluation). See Q77, Q123 and Q139.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Claims that limit the damage",
        legenda: "JWT",
        codigo: `// Payload of a short-lived access token, for a single API
{
  "iss": "https://idp.example.com",
  "sub": "user-123",
  "aud": "https://api-orders.example.com",
  "scope": "orders:read",
  "iat": 1767225600,
  "exp": 1767225900,
  "jti": "9f8c1a52-3c0e-4b7e-9a31-5d2e0a7b6c11",
  "cnf": { "jkt": "0ZcOCORZNYy-DWpqq30jZyJGHTN0d2HglBV3uiguA4I" }
}`,
        nota: "`aud` restricts the token to one API, `exp` (here, five minutes after `iat`) limits the window, `scope` limits what it can do and `cnf.jkt` binds it to the client’s key (DPoP, RFC 9449). With mTLS the binding is done through `cnf` with the certificate hash (RFC 8705).",
      },
      {
        tipo: "codigo",
        titulo: "Sender-bound token (DPoP)",
        legenda: "HTTP",
        codigo:
          "# Legitimate request: the token plus the proof signed by the client’s key\nGET /orders/1001 HTTP/1.1\nHost: api-orders.example.com\nAuthorization: DPoP eyJhbGciOiJSUzI1NiIs...\nDPoP: eyJ0eXAiOiJkcG9wK2p3dCIsImFsZyI6IkVTMjU2In0...\n\n# Stolen token, without the proof of possession: the API answers 401\nGET /orders/1001 HTTP/1.1\nHost: api-orders.example.com\nAuthorization: DPoP eyJhbGciOiJSUzI1NiIs...",
        nota: "The `DPoP` proof is a JWT signed with the client’s private key that covers the method (`htm`), the URL (`htu`), a unique identifier (`jti`) and the token hash (`ath`). The API checks the signature, the freshness and whether the key matches the token’s `cnf.jkt`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The damage-limiting rule",
        texto:
          "**Bearer** means whoever presents the token is treated as the owner. You cannot prevent every leak, so limit the value of what leaked: **where it works** (`aud` per API), **for how long** (short expiry, refresh with rotation), **for whom** (sender-bound token), **what it reveals** (never in a URL, redacted logs) and **how fast it disappears** (detection and revocation).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A compromised device",
        texto:
          "If the device is compromised, no layer guarantees anything: the malware can use the session, and even the key, from inside the machine. Sender binding stops the token from being **carried away** to another place, not from being **used** where the user is. Treat this case as an incident (see Q140) and reduce what a session can do without re-authenticating.",
      },
    ],
    armadilhas: [
      "Logging complete headers and URLs “for debugging”: the log becomes a store of valid tokens. Redact `Authorization`, `Cookie` and query strings.",
      "Using the same access token for several APIs (a generic `aud`) or forwarding it downstream: a compromised or tricked service reuses it everywhere.",
      "Believing MFA protects the session after login: the cookie or token stolen at the end of authentication already carries the MFA. Protect the token, not just the entrance.",
      "Relying only on short expiry, or leaving a long refresh token with no rotation and no reuse detection: it mints new access tokens indefinitely.",
    ],
    autoteste: [
      {
        pergunta: "Why should a token issued for API A not work at API B, and what must B check?",
        resposta:
          "Because a bearer token works anywhere that accepts it, and a tricked service becomes a confused deputy. B must check the signature, the `iss` and that the `aud` contains its own identifier, plus the scopes.",
      },
      {
        pergunta: "What changes with DPoP or mTLS compared with a plain bearer token?",
        resposta:
          "The token is bound to a client key (`cnf`), and the API requires proof of possession on every request. A stolen token alone is useless. It does not cover malware that uses the key inside the device itself.",
      },
    ],
  },
};
