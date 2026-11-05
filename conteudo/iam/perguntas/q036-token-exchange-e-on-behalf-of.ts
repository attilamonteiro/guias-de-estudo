import type { Pergunta } from "../../tipos";

// Q36 · Token Exchange e on-behalf-of
export const q036: Pergunta = {
  numero: 36,
  modulo: "oauth",
  metodo: "trace",
  pt: {
    titulo: "Token Exchange e on-behalf-of",
    pergunta:
      "O que é Token Exchange (RFC 8693) e o fluxo on-behalf-of? Como um serviço chama outro em nome do usuário sem repassar o token original?",
    porqueEsteMetodo:
      "A troca de tokens só faz sentido quando você segue o pedido por toda a cadeia (usuário, API A, authorization server, API B) e vê o que cada token carrega; o caminho errado, repassar o token, mostra o problema que a troca resolve.",
    resposta30s:
      "No **Token Exchange** (RFC 8693), a API A envia ao `/token` o token que recebeu (`subject_token`) e pede um **novo token para a API B**, com audiência e escopos de B; o servidor decide se A pode fazer isso e emite um token que registra **quem age** (claim `act`) em nome de **quem** (`sub`). O **on-behalf-of** (OBO) é a variante do Microsoft Entra ID para o mesmo cenário. Repassar o token original quebra a audiência e abre a porta ao **confused deputy**.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A cadeia, no caminho feliz",
        etapas: [
          "O usuário entra no aplicativo (authorization code com PKCE) e recebe um access token com `aud` igual à API A e o escopo `orders:read`",
          "O aplicativo chama a API A, que valida o token (assinatura, `iss`, `aud`, `exp` e escopo; veja Q40)",
          "Para montar a resposta, A precisa de dados da API B. Em vez de reenviar o token, A faz `POST /token` com `grant_type=urn:ietf:params:oauth:grant-type:token-exchange`, o `subject_token` recebido, `audience` igual a B, o menor escopo possível e a sua própria autenticação como client",
          "O authorization server confere a política: A pode trocar tokens por tokens para B? O `subject_token` ainda é válido? Os escopos pedidos cabem no que o usuário e A já têm? Se sim, emite um token novo",
          "O token novo tem `aud` igual a B, escopo reduzido, vida curta, o mesmo `sub` do usuário e `act` identificando A",
          "A chama a API B com o token novo; B o valida como qualquer outro, usa `sub` para autorizar e `act` para auditar",
        ],
        nota: "Cada salto emite um token novo e mais estreito. Nenhum token sai da audiência para a qual foi emitido.",
      },
      {
        tipo: "codigo",
        titulo: "A troca no endpoint de token",
        legenda: "HTTP",
        codigo: `POST /oauth2/token HTTP/1.1
Host: auth.example.com
Authorization: Basic <credenciais da API A>
Content-Type: application/x-www-form-urlencoded

grant_type=urn:ietf:params:oauth:grant-type:token-exchange
&subject_token=<token recebido pela API A>
&subject_token_type=urn:ietf:params:oauth:token-type:access_token
&audience=https://api-b.example.com
&scope=invoices:read

HTTP/1.1 200 OK
Content-Type: application/json

{ "access_token": "AT-B",
  "issued_token_type": "urn:ietf:params:oauth:token-type:access_token",
  "token_type": "Bearer", "expires_in": 300, "scope": "invoices:read" }`,
        nota: "A API A se autentica como client. O token devolvido serve só à API B e só com o escopo `invoices:read`.",
      },
      {
        tipo: "codigo",
        titulo: "O token emitido para B, decodificado",
        legenda: "JSON",
        codigo: `{
  "iss": "https://auth.example.com",
  "sub": "u-42",
  "aud": "https://api-b.example.com",
  "scope": "invoices:read",
  "act": { "sub": "api-a", "act": { "sub": "gateway" } },
  "exp": 1767226500
}`,
        nota: "`sub` continua sendo o usuário; `act` registra quem agiu. O `act` mais externo é o ator atual, e os aninhados listam os anteriores da cadeia.",
      },
      {
        tipo: "passos",
        titulo: "O caminho errado: repassar o token",
        passos: [
          {
            titulo: "O atalho",
            texto:
              "A reenvia a B o mesmo access token que recebeu. Funciona no teste, porque B só confere assinatura e `exp`.",
          },
          {
            titulo: "Por que é perigoso",
            texto:
              "O token foi emitido para A (`aud` igual a A), com os escopos que o usuário deu a A. Se B o aceita, a audiência deixou de significar algo: qualquer API que receba o token pode reusá-lo em outra (*replay*), e um serviço comprometido ou um log com o token abre todas as APIs que o aceitam.",
          },
          {
            titulo: "Confused deputy",
            texto:
              "B não sabe que A está agindo; vê só o usuário, com poderes que ele delegou a outra coisa. Um ator com menos privilégio pode enganar A para chamar B com a autoridade do token. A auditoria também se perde: quem fez o quê?",
          },
          {
            titulo: "O conserto",
            texto:
              "Cada API só aceita tokens com a **sua** audiência (é o que a RFC 9700 pede) e recebe um token emitido para ela, por troca. O servidor aplica política: quem pode trocar, por qual audiência, com quais escopos e por quanto tempo.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Delegação × impersonação, OBO e limites",
        texto:
          "Na **delegação**, o token novo mostra o usuário (`sub`) **e** o ator (`act`): B sabe que A age em nome dele. Na **impersonação**, o token parece ser do próprio usuário e o rastro de A desaparece; é mais perigosa e só se justifica com política e auditoria fortes. No **Microsoft Entra ID**, o equivalente é o fluxo **on-behalf-of**: a API A envia ao `/token` o token recebido como `assertion`, com `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer` e `requested_token_use=on_behalf_of`, pedindo o escopo da API B; o consentimento do usuário ou do administrador para A acessar B precisa existir antes (confira a documentação do fornecedor e o guia de Entra ID). Limite a **profundidade da cadeia** (poucos saltos, cada um mais estreito), mantenha vidas curtas e não use troca para acesso sem usuário: de serviço para serviço, o caminho é **client credentials**.",
      },
    ],
    armadilhas: [
      "Repassar o token recebido à API seguinte: quebra a audiência e permite *replay* entre APIs.",
      "Aceitar na API B qualquer token válido do mesmo emissor, sem conferir `aud`: é o que torna o confused deputy possível.",
      "Pedir na troca escopos mais largos que os do token original, ou deixar o servidor sem política de quem troca o quê: a troca vira escalonamento de privilégio.",
      "Esquecer a auditoria: sem `act` (ou equivalente) no token e nos logs, não se sabe qual serviço agiu por quem.",
    ],
    autoteste: [
      {
        pergunta: "Por que não basta repassar o token da API A para a API B?",
        resposta:
          "Porque o token foi emitido para A, com a audiência e os escopos de A. Aceitá-lo em B desfaz a restrição de audiência, permite reuso do token em qualquer API e faz B perder a noção de quem está agindo. A troca dá a B um token próprio, mais estreito, com o ator registrado.",
      },
      {
        pergunta: "Qual a diferença entre delegação e impersonação no Token Exchange?",
        resposta:
          "Na delegação, o token novo identifica o usuário e o serviço que age por ele (`sub` e `act`), então há rastro de quem fez o quê. Na impersonação, o token parece ser do próprio usuário e o serviço some do registro; é mais arriscada e exige política e auditoria rígidas.",
      },
    ],
  },
  en: {
    titulo: "Token exchange and on-behalf-of",
    pergunta:
      "What is Token Exchange (RFC 8693) and the on-behalf-of flow? How does one service call another on behalf of a user without passing the original token along?",
    porqueEsteMetodo:
      "Token exchange only makes sense once you follow the request along the whole chain (user, API A, authorization server, API B) and see what each token carries; the wrong path, passing the token along, shows the problem the exchange solves.",
    resposta30s:
      "In **Token Exchange** (RFC 8693), API A sends the token it received (`subject_token`) to `/token` and asks for a **new token for API B**, with B’s audience and scopes; the server decides whether A may do that and issues a token that records **who is acting** (the `act` claim) on behalf of **whom** (`sub`). **On-behalf-of** (OBO) is Microsoft Entra ID’s variant for the same scenario. Passing the original token along breaks the audience and opens the door to the **confused deputy**.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "The chain, on the happy path",
        etapas: [
          "The user signs in to the application (authorization code with PKCE) and receives an access token with `aud` equal to API A and the scope `orders:read`",
          "The application calls API A, which validates the token (signature, `iss`, `aud`, `exp` and scope; see Q40)",
          "To build its response, A needs data from API B. Instead of resending the token, A makes `POST /token` with `grant_type=urn:ietf:params:oauth:grant-type:token-exchange`, the received `subject_token`, `audience` equal to B, the smallest possible scope and its own client authentication",
          "The authorization server checks the policy: may A exchange tokens for tokens to B? Is the `subject_token` still valid? Do the requested scopes fit within what the user and A already have? If so, it issues a new token",
          "The new token has `aud` equal to B, a reduced scope, a short life, the same `sub` as the user and `act` identifying A",
          "A calls API B with the new token; B validates it like any other, uses `sub` to authorize and `act` to audit",
        ],
        nota: "Each hop issues a new, narrower token. No token ever leaves the audience it was issued for.",
      },
      {
        tipo: "codigo",
        titulo: "The exchange at the token endpoint",
        legenda: "HTTP",
        codigo: `POST /oauth2/token HTTP/1.1
Host: auth.example.com
Authorization: Basic <API A credentials>
Content-Type: application/x-www-form-urlencoded

grant_type=urn:ietf:params:oauth:grant-type:token-exchange
&subject_token=<token received by API A>
&subject_token_type=urn:ietf:params:oauth:token-type:access_token
&audience=https://api-b.example.com
&scope=invoices:read

HTTP/1.1 200 OK
Content-Type: application/json

{ "access_token": "AT-B",
  "issued_token_type": "urn:ietf:params:oauth:token-type:access_token",
  "token_type": "Bearer", "expires_in": 300, "scope": "invoices:read" }`,
        nota: "API A authenticates as a client. The returned token is good only for API B and only with the `invoices:read` scope.",
      },
      {
        tipo: "codigo",
        titulo: "The token issued for B, decoded",
        legenda: "JSON",
        codigo: `{
  "iss": "https://auth.example.com",
  "sub": "u-42",
  "aud": "https://api-b.example.com",
  "scope": "invoices:read",
  "act": { "sub": "api-a", "act": { "sub": "gateway" } },
  "exp": 1767226500
}`,
        nota: "`sub` is still the user; `act` records who acted. The outermost `act` is the current actor, and nested ones list the earlier actors in the chain.",
      },
      {
        tipo: "passos",
        titulo: "The wrong path: passing the token along",
        passos: [
          {
            titulo: "The shortcut",
            texto:
              "A resends to B the same access token it received. It works in the test, because B only checks signature and `exp`.",
          },
          {
            titulo: "Why it is dangerous",
            texto:
              "The token was issued to A (`aud` equal to A), with the scopes the user gave A. If B accepts it, the audience no longer means anything: any API that receives the token can reuse it elsewhere (*replay*), and a compromised service or a log containing the token opens every API that accepts it.",
          },
          {
            titulo: "Confused deputy",
            texto:
              "B does not know A is acting; it sees only the user, with powers the user delegated for something else. A less-privileged actor can trick A into calling B with the token’s authority. The audit trail is lost too: who did what?",
          },
          {
            titulo: "The fix",
            texto:
              "Each API accepts only tokens with **its own** audience (which is what RFC 9700 asks for) and receives a token issued for it, through exchange. The server applies policy: who may exchange, for which audience, with which scopes and for how long.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Delegation vs impersonation, OBO and limits",
        texto:
          "In **delegation**, the new token shows the user (`sub`) **and** the actor (`act`): B knows A is acting on the user’s behalf. In **impersonation**, the token looks like it belongs to the user and A’s trace disappears; it is riskier and only justified with strong policy and auditing. In **Microsoft Entra ID**, the equivalent is the **on-behalf-of** flow: API A sends the received token to `/token` as the `assertion`, with `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer` and `requested_token_use=on_behalf_of`, asking for API B’s scope; the user’s or administrator’s consent for A to reach B has to exist beforehand (check the vendor’s documentation and the Entra ID guide). Limit the **depth of the chain** (few hops, each narrower), keep lifetimes short and do not use exchange for access without a user: from service to service, the path is **client credentials**.",
      },
    ],
    armadilhas: [
      "Passing the received token to the next API: it breaks the audience and allows *replay* across APIs.",
      "Accepting any valid token from the same issuer on API B without checking `aud`: that is what makes the confused deputy possible.",
      "Requesting scopes wider than the original token’s in the exchange, or leaving the server with no policy on who exchanges what: the exchange becomes privilege escalation.",
      "Forgetting auditing: without `act` (or an equivalent) in the token and logs, you cannot tell which service acted for whom.",
    ],
    autoteste: [
      {
        pergunta: "Why is it not enough to pass API A’s token on to API B?",
        resposta:
          "Because the token was issued to A, with A’s audience and scopes. Accepting it in B undoes the audience restriction, lets the token be reused on any API and makes B lose track of who is acting. The exchange gives B its own token, narrower, with the actor recorded.",
      },
      {
        pergunta: "What is the difference between delegation and impersonation in Token Exchange?",
        resposta:
          "In delegation, the new token identifies the user and the service acting for them (`sub` and `act`), so there is a trace of who did what. In impersonation, the token looks like the user’s own and the service vanishes from the record; it is riskier and demands strict policy and auditing.",
      },
    ],
  },
};
