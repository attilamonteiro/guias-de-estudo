import type { Pergunta } from "../../tipos";

// Q83 · Fixação de sessão
export const q083: Pergunta = {
  numero: 83,
  modulo: "tokens-e-sessoes",
  metodo: "threat",
  pt: {
    titulo: "Fixação de sessão",
    pergunta:
      "O que é fixação de sessão (session fixation)? Descreva como o ataque acontece e como a regeneração do identificador no login o impede.",
    porqueEsteMetodo:
      "O ataque só se entende pela ordem dos fatos (o invasor planta, a vítima autentica, o invasor entra), e cada elo tem a sua defesa. Os pares ataque → defesa mostram o que o invasor controla em cada etapa e qual regra tira esse controle.",
    resposta30s:
      "Na **fixação de sessão**, o invasor faz a vítima usar um id de sessão que ele já conhece (por um link com o id na URL ou por um cookie injetado a partir de um subdomínio) e, quando a vítima faz login, **herda a sessão autenticada**. A causa é que o id **não muda ao elevar o privilégio**. A defesa central é **gerar um id novo no login** (e em toda mudança de privilégio) e destruir o antigo, somada a nunca aceitar id pela URL e ao prefixo `__Host-`.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ataque → defesa",
        rotuloOrigem: "Ataque",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "O invasor abre o site, recebe um id de sessão anônimo (`sid=ABC123`) e o entrega à vítima num link com o id na URL (`?sid=ABC123` ou `;jsessionid=`)",
            destino:
              "**Nunca aceitar o id pela URL**: só por cookie. Desligue a reescrita de URL do framework e rejeite o parâmetro.",
          },
          {
            origem:
              "O invasor planta o cookie sem precisar de link: um subdomínio comprometido (ou um site irmão) envia `Set-Cookie: sid=ABC123; Domain=.exemplo.com`, ou alguém na rede o injeta numa resposta HTTP",
            destino:
              "Prefixo **`__Host-`** (sem `Domain`, com `Secure` e `Path=/`), **HSTS** para impedir o HTTP e `Secure` em todo cookie de sessão (veja Q79).",
          },
          {
            origem:
              "A vítima faz login com o id plantado e o servidor mantém o mesmo id, agora autenticado: o invasor, que o conhece, herda a sessão",
            destino:
              "**Gerar um id novo no login** e destruir o antigo. É a defesa central: o id que o invasor conhece deixa de valer depois da autenticação.",
          },
          {
            origem:
              "A elevação de privilégio no meio da sessão (MFA, step-up, virar administrador, impersonação) mantém o mesmo id",
            destino:
              "**Regenerar o id a cada mudança de nível de confiança**, e não só no login, e invalidar o id anterior.",
          },
          {
            origem:
              "O servidor aceita um id escolhido pelo cliente, que ele nunca emitiu, e cria uma sessão com ele (modo permissivo de alguns servidores)",
            destino:
              "**Só aceitar ids que o próprio servidor emitiu**: um id desconhecido é descartado e gera uma sessão nova, com id novo.",
          },
          {
            origem:
              "O invasor mantém viva a sessão anônima plantada (com requisições periódicas) à espera de que a vítima se autentique",
            destino:
              "**Não criar sessão antes de precisar**, dar prazo curto às sessões anônimas e aplicar os tetos ocioso e absoluto (veja Q78 e Q81).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O ataque e a correção, no fio",
        legenda: "HTTP",
        codigo: `# 1. O invasor abre o site e recebe um id anônimo
HTTP/1.1 200 OK
Set-Cookie: sid=ABC123; Path=/; HttpOnly

# 2. A vítima usa o id plantado e faz login
POST /login HTTP/1.1
Cookie: sid=ABC123

# 3. Vulnerável: o servidor mantém ABC123 e o invasor entra.
#    Correto: id novo, e o ABC123 é descartado
HTTP/1.1 302 Found
Set-Cookie: __Host-sid=Zq9mT4...; Path=/; Secure; HttpOnly; SameSite=Lax`,
      },
      {
        tipo: "codigo",
        titulo: "Regenerar o id no login",
        legenda: "TypeScript",
        codigo: `app.post("/login", async (req, res, next) => {
  const usuario = await autenticar(req.body.email, req.body.senha);
  if (!usuario) return res.status(401).end();

  req.session.regenerate((erro) => { // novo id; a sessão anterior é destruída
    if (erro) return next(erro);
    req.session.usuarioId = usuario.id; // só agora o estado autenticado entra
    req.session.save(() => res.redirect("/conta"));
  });
});`,
        nota: "Exemplo com `express-session`: o `regenerate` cria uma sessão nova, com outro id, e destrói a anterior; só então os dados autenticados são gravados. Repita o gesto ao elevar o privilégio (MFA, step-up).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A regra",
        texto:
          "O identificador **muda sempre que o nível de confiança sobe**. Quem conhecia o id anônimo não conhece o autenticado. A causa raiz é que o id que existia antes da autenticação continuou sendo a credencial depois dela.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Fixação não é roubo de sessão",
        texto:
          "Na **fixação**, o invasor **escolhe** o id antes do login; no **roubo**, ele **obtém** o id depois (XSS, rede, malware). Regenerar o id no login impede o primeiro e não ajuda contra o segundo, para o qual valem `HttpOnly`, HTTPS, prazos curtos e revogação (veja Q79 e Q82). Em fluxos de SSO, a mesma regra vale para o cookie de sessão do IdP e para o da aplicação que recebe o retorno: cada um troca o seu id ao autenticar.",
      },
    ],
    armadilhas: [
      "Regenerar o id só no login e esquecer as outras elevações (MFA, step-up, impersonação, troca de papel).",
      "Gerar um id novo e não invalidar o antigo: o id plantado continua sendo aceito.",
      "Aceitar o id pela URL (`?sid=`, `jsessionid`) por compatibilidade, ou deixar o servidor aceitar ids que ele nunca emitiu.",
      "Achar que `HttpOnly` e `SameSite` bastam: eles não impedem que o id seja plantado por um subdomínio ou por um link; quem impede é a regeneração, com o apoio do `__Host-`.",
    ],
    autoteste: [
      {
        pergunta: "Em uma frase, por que regenerar o id no login impede a fixação?",
        resposta:
          "Porque o id plantado só existia na sessão anônima; ao autenticar, o servidor emite outro id que o invasor nunca viu e descarta o antigo, então o que o invasor conhece não aponta para nenhuma sessão autenticada.",
      },
      {
        pergunta: "Como um invasor planta um id na vítima sem ter acesso ao dispositivo dela?",
        resposta:
          "Por um link com o id na URL (se a aplicação o aceita), por um cookie injetado a partir de um subdomínio ou site irmão (usando o `Domain` do domínio pai) ou por uma resposta HTTP adulterada numa rede aberta. O `__Host-`, o HSTS e a recusa de ids pela URL fecham esses caminhos.",
      },
    ],
  },
  en: {
    titulo: "Session fixation",
    pergunta:
      "What is session fixation? Describe how the attack happens and how regenerating the identifier at login prevents it.",
    porqueEsteMetodo:
      "The attack only makes sense in order (the attacker plants, the victim authenticates, the attacker walks in), and each link has its own defense. The attack → defense pairs show what the attacker controls at each stage and which rule takes that control away.",
    resposta30s:
      "In **session fixation**, the attacker makes the victim use a session id the attacker already knows (through a link with the id in the URL, or a cookie injected from a subdomain) and, when the victim logs in, **inherits the authenticated session**. The cause is that the id **does not change when privilege is elevated**. The central defense is to **generate a new id at login** (and on every privilege change) and destroy the old one, together with never accepting an id from the URL and using the `__Host-` prefix.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Attack → defense",
        rotuloOrigem: "Attack",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "The attacker opens the site, receives an anonymous session id (`sid=ABC123`) and hands it to the victim in a link with the id in the URL (`?sid=ABC123` or `;jsessionid=`)",
            destino:
              "**Never accept the id from the URL**: cookie only. Turn off the framework’s URL rewriting and reject the parameter.",
          },
          {
            origem:
              "The attacker plants the cookie without needing a link: a compromised subdomain (or a sibling site) sends `Set-Cookie: sid=ABC123; Domain=.example.com`, or someone on the network injects it into an HTTP response",
            destino:
              "The **`__Host-`** prefix (no `Domain`, with `Secure` and `Path=/`), **HSTS** to block HTTP, and `Secure` on every session cookie (see Q79).",
          },
          {
            origem:
              "The victim logs in with the planted id and the server keeps the same id, now authenticated: the attacker, who knows it, inherits the session",
            destino:
              "**Generate a new id at login** and destroy the old one. This is the central defense: the id the attacker knows stops being valid once authentication happens.",
          },
          {
            origem:
              "Privilege elevation in the middle of the session (MFA, step-up, becoming an administrator, impersonation) keeps the same id",
            destino:
              "**Regenerate the id on every change of trust level**, not just at login, and invalidate the previous id.",
          },
          {
            origem:
              "The server accepts a client-chosen id that it never issued and creates a session with it (the permissive mode of some servers)",
            destino:
              "**Accept only ids the server itself issued**: an unknown id is discarded and produces a new session, with a new id.",
          },
          {
            origem:
              "The attacker keeps the planted anonymous session alive (with periodic requests) waiting for the victim to authenticate",
            destino:
              "**Don’t create a session before you need one**, give anonymous sessions a short lifetime and apply the idle and absolute ceilings (see Q78 and Q81).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The attack and the fix, on the wire",
        legenda: "HTTP",
        codigo: `# 1. The attacker opens the site and receives an anonymous id
HTTP/1.1 200 OK
Set-Cookie: sid=ABC123; Path=/; HttpOnly

# 2. The victim uses the planted id and logs in
POST /login HTTP/1.1
Cookie: sid=ABC123

# 3. Vulnerable: the server keeps ABC123 and the attacker gets in.
#    Correct: a new id, and ABC123 is discarded
HTTP/1.1 302 Found
Set-Cookie: __Host-sid=Zq9mT4...; Path=/; Secure; HttpOnly; SameSite=Lax`,
      },
      {
        tipo: "codigo",
        titulo: "Regenerating the id at login",
        legenda: "TypeScript",
        codigo: `app.post("/login", async (req, res, next) => {
  const user = await authenticate(req.body.email, req.body.password);
  if (!user) return res.status(401).end();

  req.session.regenerate((err) => { // new id; the previous session is destroyed
    if (err) return next(err);
    req.session.userId = user.id; // only now does the authenticated state go in
    req.session.save(() => res.redirect("/account"));
  });
});`,
        nota: "Example with `express-session`: `regenerate` creates a new session, with another id, and destroys the previous one; only then is the authenticated data written. Repeat the gesture when elevating privilege (MFA, step-up).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The rule",
        texto:
          "The identifier **changes whenever the trust level goes up**. Whoever knew the anonymous id does not know the authenticated one. The root cause is that the id that existed before authentication kept being the credential after it.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Fixation is not session theft",
        texto:
          "In **fixation**, the attacker **chooses** the id before login; in **theft**, the attacker **obtains** the id afterwards (XSS, network, malware). Regenerating the id at login stops the first and does not help against the second, for which `HttpOnly`, HTTPS, short lifetimes and revocation apply (see Q79 and Q82). In SSO flows the same rule holds for the IdP’s session cookie and for that of the application receiving the return: each swaps its id on authentication.",
      },
    ],
    armadilhas: [
      "Regenerating the id only at login and forgetting the other elevations (MFA, step-up, impersonation, role switching).",
      "Generating a new id without invalidating the old one: the planted id is still accepted.",
      "Accepting the id from the URL (`?sid=`, `jsessionid`) for compatibility, or letting the server accept ids it never issued.",
      "Thinking `HttpOnly` and `SameSite` are enough: they do not stop an id from being planted by a subdomain or a link; regeneration does, with `__Host-` as support.",
    ],
    autoteste: [
      {
        pergunta: "In one sentence, why does regenerating the id at login prevent fixation?",
        resposta:
          "Because the planted id only existed in the anonymous session; on authentication the server issues another id the attacker has never seen and discards the old one, so what the attacker knows points to no authenticated session.",
      },
      {
        pergunta: "How does an attacker plant an id on a victim without access to the victim’s device?",
        resposta:
          "Through a link with the id in the URL (if the application accepts it), through a cookie injected from a subdomain or sibling site (using the parent domain’s `Domain`), or through an HTTP response tampered with on an open network. `__Host-`, HSTS and refusing ids from the URL close those paths.",
      },
    ],
  },
};
