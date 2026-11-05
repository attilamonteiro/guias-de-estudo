import type { Pergunta } from "../../tipos";

// Q129 · Injeção de code e mix-up attack
export const q129: Pergunta = {
  numero: 129,
  modulo: "ataques-e-depuracao",
  metodo: "threat",
  pt: {
    titulo: "Injeção de code e mix-up attack",
    pergunta:
      "O que são injeção de authorization code e mix-up attack no OAuth? Como PKCE, o parâmetro iss e a validação da resposta os impedem?",
    porqueEsteMetodo:
      "São dois ataques com defesas diferentes que costumam ser misturados. Os pares ligam cada passo do ataque ao controle que o interrompe e deixam claro o que o PKCE resolve e o que só o `iss` resolve.",
    resposta30s:
      "Na **injeção de authorization code**, o invasor faz o cliente resgatar um `code` que não foi pedido por aquela sessão; o **PKCE** impede, porque o `code` só vale com o `code_verifier` de quem iniciou o fluxo. No **mix-up**, um cliente que fala com vários servidores confunde quem emitiu a resposta e entrega o `code` ao servidor do invasor; o PKCE não basta, e o que resolve é conferir o **`iss`** (RFC 9207) antes de usar o `code`, além de um `redirect_uri` por servidor. Em ambos, valide o `state` da resposta.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Injeção de authorization code",
        rotuloOrigem: "Ataque ou causa",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "Um `code` válido da vítima vaza (log, cabeçalho `Referer`, histórico, extensão) e o invasor o apresenta no callback do cliente legítimo, numa sessão que ele controla, para entrar como a vítima.",
            destino:
              "**PKCE** (RFC 7636, método `S256`): o `code` fica ligado ao `code_challenge` do fluxo que o pediu, e a troca só funciona com o `code_verifier` correspondente, que o invasor não tem.",
          },
          {
            origem:
              "Variante: o invasor faz o fluxo com a conta dele, guarda o `code` e faz o navegador da vítima abrir o callback com ele; a sessão da vítima no cliente passa a usar a conta do invasor.",
            destino:
              "**`state`** preso ao navegador que iniciou o fluxo (descartar o callback sem correspondência). O PKCE também barra: o verifier da vítima não casa com o challenge do invasor. Veja Q126 e Q29.",
          },
          {
            origem:
              "Rebaixamento: o pedido chega sem `code_challenge`, ou o cliente confidencial dispensa o PKCE por já ter segredo. O segredo não impede que um `code` seja injetado na sessão do próprio cliente.",
            destino:
              "PKCE em **todos** os clientes (a RFC 9700 recomenda). O servidor exige o challenge, recusa `plain` e rejeita um `code_verifier` quando o pedido original não tinha challenge.",
          },
          {
            origem: "`code` com vida longa ou que pode ser usado mais de uma vez.",
            destino:
              "`code` de **uso único**, validade de poucos minutos e ligado ao `client_id` e ao `redirect_uri`. Se um `code` for reapresentado, o servidor nega e, se possível, revoga os tokens emitidos com ele (RFC 6749).",
          },
        ],
      },
      {
        tipo: "pares",
        titulo: "Mix-up attack",
        rotuloOrigem: "Passo do ataque ou causa",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "O cliente aceita vários servidores de autorização (vários provedores de login, tenants, descoberta dinâmica) e um é do invasor. O usuário inicia o login por ele, que o redireciona ao servidor honesto com o `client_id` do cliente.",
            destino:
              "Limitar os emissores aceitos a uma **lista permitida** configurada, sem descoberta de emissor arbitrário informado de fora, cada um com configuração fixa (veja Q53).",
          },
          {
            origem:
              "O usuário se autentica no servidor honesto, que devolve o `code` ao cliente. O cliente, que anotou “esta sessão é do servidor do invasor”, entrega o `code` (e o verifier) ao `token_endpoint` do invasor. O PKCE não ajuda: o invasor controla o pedido que repassou.",
            destino:
              "**Parâmetro `iss` na resposta de autorização (RFC 9207)**: o cliente guarda o emissor ao iniciar o fluxo e compara com o `iss` recebido **antes** de enviar o `code` a qualquer lugar. Se diferir, descarta.",
          },
          {
            origem:
              "Servidores que não enviam `iss`, ou respostas de servidores diferentes chegando ao mesmo endereço do cliente.",
            destino:
              "Um **`redirect_uri` por servidor** (por exemplo `/cb/idp-a` e `/cb/idp-b`): o caminho em que a resposta chega diz de quem ela é, e o cliente confere se bate com o emissor da sessão.",
          },
          {
            origem: "Cliente que usa as mesmas credenciais, ou lê endpoints do callback, em todos os servidores.",
            destino:
              "Configuração **por emissor**: `token_endpoint`, `client_id` e segredo próprios, vindos do cadastro ou do metadata desse emissor e nunca do callback; um servidor não recebe credenciais de outro.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Pedido com PKCE e resposta com iss",
        legenda: "HTTP",
        codigo:
          "GET /authorize?response_type=code&client_id=app123\n  &redirect_uri=https%3A%2F%2Fapp.example.com%2Fcb%2Fidp-a\n  &state=af0ifjsldkj\n  &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM\n  &code_challenge_method=S256 HTTP/1.1\nHost: idp-a.example\n\nHTTP/1.1 302 Found\nLocation: https://app.example.com/cb/idp-a?code=SplxlOBeZQQYbYS6WxSbIA&state=af0ifjsldkj&iss=https%3A%2F%2Fidp-a.example",
        nota: "As quebras de linha da URL são só para leitura. Na troca (POST ao `token_endpoint`), o cliente envia o `code` e o `code_verifier`; o servidor calcula o SHA-256 do verifier e compara com o challenge guardado.",
      },
      {
        tipo: "codigo",
        titulo: "Conferir a resposta antes de trocar o code",
        legenda: "TypeScript",
        codigo: `type Sessao = {
  state: string;
  codeVerifier: string;
  servidor: { issuer: string; tokenEndpoint: string; anunciaIss: boolean };
};

async function aoVoltarDoLogin(url: URL, s: Sessao) {
  if (url.searchParams.get("state") !== s.state) throw new Error("state inválido");

  const iss = url.searchParams.get("iss");
  if (iss !== null ? iss !== s.servidor.issuer : s.servidor.anunciaIss) {
    throw new Error("emissor inesperado ou ausente: possível mix-up");
  }

  const code = url.searchParams.get("code");
  if (!code) throw new Error("resposta sem code");
  // Só agora o code sai, e só para o endpoint DESTE servidor
  return trocarCodePorTokens(s.servidor.tokenEndpoint, code, s.codeVerifier);
}`,
        nota: "`trocarCodePorTokens` é hipotética. Se o servidor anuncia suporte ao `iss` nos metadados, a ausência do parâmetro já é motivo para recusar. Confira o `iss` também nas respostas de erro, antes de agir sobre elas.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Cada ataque é uma ligação que falta",
        texto:
          "**Injeção:** o `code` não está ligado à **instância do cliente** que o pediu, e o PKCE (com o `state` para o navegador) faz essa ligação. **Mix-up:** a resposta não está ligada ao **emissor** que deveria enviá-la, e quem faz essa ligação é o `iss` (RFC 9207) ou um `redirect_uri` por servidor. O PKCE não vence o mix-up e o `iss` não vence a injeção: use os dois, mais `state`. No OpenID Connect, some o `nonce` e o `iss` do ID token (veja Q47 e Q48). A RFC 9700 reúne essas práticas.",
      },
    ],
    armadilhas: [
      "Achar que o PKCE basta contra o mix-up: o `code` e o verifier seguem para o servidor do invasor, que controla o pedido repassado.",
      "Usar PKCE só em cliente público: cliente confidencial também pode receber um `code` injetado, e o segredo dele não impede isso.",
      "Conferir o `iss` do ID token só depois de já ter enviado o `code` ao endpoint errado: a checagem tem de vir antes da troca.",
      "Aceitar `code_challenge_method=plain`, pedido sem challenge ou `code_verifier` sem challenge original: abre um rebaixamento do PKCE.",
    ],
    autoteste: [
      {
        pergunta: "O que o PKCE amarra ao `code` e como isso derrota a injeção?",
        resposta:
          "Amarra ao verifier da instância que iniciou o fluxo: o servidor guarda o challenge junto com o `code` e só aceita a troca com o verifier correspondente. Quem injeta um `code` roubado não tem esse verifier.",
      },
      {
        pergunta: "Em que o mix-up difere da injeção, e que checagem o impede?",
        resposta:
          "Na injeção, um `code` indevido entra numa sessão; no mix-up, o `code` certo vai para o servidor errado porque o cliente não sabe quem respondeu. Impede-se comparando o `iss` da resposta (RFC 9207) com o emissor da sessão antes da troca, ou usando um `redirect_uri` por servidor.",
      },
    ],
  },
  en: {
    titulo: "Code injection and mix-up attack",
    pergunta:
      "What are authorization code injection and the mix-up attack in OAuth? How do PKCE, the iss parameter and response validation prevent them?",
    porqueEsteMetodo:
      "These are two attacks with different defenses that are often mixed together. The pairs link each step of the attack to the control that interrupts it and make clear what PKCE solves and what only `iss` solves.",
    resposta30s:
      "In **authorization code injection**, the attacker makes the client redeem a `code` that this session did not request; **PKCE** stops it, because the `code` is only valid with the `code_verifier` of whoever started the flow. In the **mix-up**, a client that talks to several servers confuses who issued the response and hands the `code` to the attacker’s server; PKCE is not enough, and what solves it is checking the **`iss`** (RFC 9207) before using the `code`, plus one `redirect_uri` per server. In both, validate the response `state`.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Authorization code injection",
        rotuloOrigem: "Attack or cause",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "A valid `code` of the victim leaks (log, `Referer` header, history, extension) and the attacker presents it at the legitimate client’s callback, in a session they control, to sign in as the victim.",
            destino:
              "**PKCE** (RFC 7636, `S256` method): the `code` is tied to the `code_challenge` of the flow that requested it, and the exchange only works with the matching `code_verifier`, which the attacker does not have.",
          },
          {
            origem:
              "Variant: the attacker runs the flow with their own account, keeps the `code` and makes the victim’s browser open the callback with it; the victim’s session at the client starts using the attacker’s account.",
            destino:
              "**`state`** bound to the browser that started the flow (discard a callback with no match). PKCE also blocks it: the victim’s verifier does not match the attacker’s challenge. See Q126 and Q29.",
          },
          {
            origem:
              "Downgrade: the request arrives without `code_challenge`, or a confidential client skips PKCE because it already has a secret. The secret does not stop a `code` from being injected into the client’s own session.",
            destino:
              "PKCE for **all** clients (RFC 9700 recommends it). The server requires the challenge, rejects `plain` and rejects a `code_verifier` when the original request had no challenge.",
          },
          {
            origem: "A `code` with a long life, or one that can be used more than once.",
            destino:
              "A **single-use** `code`, valid for a few minutes and tied to the `client_id` and `redirect_uri`. If a `code` is presented again, the server denies it and, where possible, revokes the tokens issued from it (RFC 6749).",
          },
        ],
      },
      {
        tipo: "pares",
        titulo: "Mix-up attack",
        rotuloOrigem: "Attack step or cause",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "The client accepts several authorization servers (many login providers, tenants, dynamic discovery) and one belongs to the attacker. The user starts the login through it, and it redirects the user to the honest server with the client’s `client_id`.",
            destino:
              "Limit the accepted issuers to a configured **allowlist**, with no discovery of arbitrary issuers supplied from outside, each with a fixed configuration (see Q53).",
          },
          {
            origem:
              "The user authenticates at the honest server, which returns the `code` to the client. The client, which noted “this session is with the attacker’s server”, hands the `code` (and the verifier) to the attacker’s `token_endpoint`. PKCE does not help: the attacker controls the request it relayed.",
            destino:
              "**The `iss` parameter in the authorization response (RFC 9207)**: the client stores the issuer when starting the flow and compares it with the received `iss` **before** sending the `code` anywhere. If it differs, discard.",
          },
          {
            origem:
              "Servers that do not send `iss`, or responses from different servers reaching the same client address.",
            destino:
              "**One `redirect_uri` per server** (for example `/cb/idp-a` and `/cb/idp-b`): the path the response arrives on says who it is from, and the client checks that it matches the session’s issuer.",
          },
          {
            origem: "A client that uses the same credentials, or reads endpoints from the callback, for every server.",
            destino:
              "**Per-issuer** configuration: its own `token_endpoint`, `client_id` and secret, taken from that issuer’s registration or metadata and never from the callback; one server never receives another’s credentials.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Request with PKCE and a response with iss",
        legenda: "HTTP",
        codigo:
          "GET /authorize?response_type=code&client_id=app123\n  &redirect_uri=https%3A%2F%2Fapp.example.com%2Fcb%2Fidp-a\n  &state=af0ifjsldkj\n  &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM\n  &code_challenge_method=S256 HTTP/1.1\nHost: idp-a.example\n\nHTTP/1.1 302 Found\nLocation: https://app.example.com/cb/idp-a?code=SplxlOBeZQQYbYS6WxSbIA&state=af0ifjsldkj&iss=https%3A%2F%2Fidp-a.example",
        nota: "The line breaks in the URL are only for reading. On the exchange (a POST to the `token_endpoint`), the client sends the `code` and the `code_verifier`; the server computes the SHA-256 of the verifier and compares it with the stored challenge.",
      },
      {
        tipo: "codigo",
        titulo: "Checking the response before exchanging the code",
        legenda: "TypeScript",
        codigo: `type Session = {
  state: string;
  codeVerifier: string;
  server: { issuer: string; tokenEndpoint: string; announcesIss: boolean };
};

async function onLoginReturn(url: URL, s: Session) {
  if (url.searchParams.get("state") !== s.state) throw new Error("invalid state");

  const iss = url.searchParams.get("iss");
  if (iss !== null ? iss !== s.server.issuer : s.server.announcesIss) {
    throw new Error("unexpected or missing issuer: possible mix-up");
  }

  const code = url.searchParams.get("code");
  if (!code) throw new Error("response without code");
  // Only now does the code leave, and only to THIS server's endpoint
  return exchangeCodeForTokens(s.server.tokenEndpoint, code, s.codeVerifier);
}`,
        nota: "`exchangeCodeForTokens` is hypothetical. If the server announces `iss` support in its metadata, a missing parameter is already a reason to reject. Check `iss` on error responses too, before acting on them.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Each attack is a missing link",
        texto:
          "**Injection:** the `code` is not tied to the **client instance** that requested it, and PKCE (with `state` for the browser) makes that link. **Mix-up:** the response is not tied to the **issuer** that should have sent it, and what makes that link is `iss` (RFC 9207) or one `redirect_uri` per server. PKCE does not defeat mix-up and `iss` does not defeat injection: use both, plus `state`. In OpenID Connect, add the `nonce` and the ID token `iss` (see Q47 and Q48). RFC 9700 gathers these practices.",
      },
    ],
    armadilhas: [
      "Believing PKCE is enough against mix-up: the `code` and the verifier still go to the attacker’s server, which controls the relayed request.",
      "Using PKCE only on public clients: a confidential client can also receive an injected `code`, and its secret does not prevent that.",
      "Checking the ID token `iss` only after the `code` has already gone to the wrong endpoint: the check must come before the exchange.",
      "Accepting `code_challenge_method=plain`, a request without a challenge, or a `code_verifier` with no original challenge: it opens a PKCE downgrade.",
    ],
    autoteste: [
      {
        pergunta: "What does PKCE tie to the `code`, and how does that defeat injection?",
        resposta:
          "It ties it to the verifier of the instance that started the flow: the server stores the challenge with the `code` and only accepts the exchange with the matching verifier. Whoever injects a stolen `code` does not have that verifier.",
      },
      {
        pergunta: "How does the mix-up differ from injection, and which check stops it?",
        resposta:
          "In injection, an unwanted `code` enters a session; in the mix-up, the right `code` goes to the wrong server because the client does not know who answered. It is stopped by comparing the response `iss` (RFC 9207) with the session’s issuer before the exchange, or by using one `redirect_uri` per server.",
      },
    ],
  },
};
