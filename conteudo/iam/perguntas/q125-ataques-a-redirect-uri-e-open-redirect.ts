import type { Pergunta } from "../../tipos";

// Q125 · Ataques a redirect_uri e open redirect
export const q125: Pergunta = {
  numero: 125,
  modulo: "ataques-e-depuracao",
  metodo: "threat",
  pt: {
    titulo: "Ataques a redirect_uri e open redirect",
    pergunta:
      "Como ataques ao redirect_uri e a open redirects permitem roubar um authorization code ou token? Que defesas quebram essa cadeia?",
    porqueEsteMetodo:
      "A defesa do `redirect_uri` parece um detalhe de configuração até você ver o ataque inteiro: para onde o code vai e por quê. Cada par ataque → defesa mostra o que o invasor controla e a regra que tira esse controle.",
    resposta30s:
      "O authorization code (ou o token) é entregue no endereço do `redirect_uri`. Se o servidor aceita um endereço que o invasor controla (por **curinga, prefixo ou subdomínio** permissivo) ou que **redireciona para qualquer lugar (open redirect)**, o code vai parar nas mãos dele: a causa é a **validação frouxa do destino**. Quebram a cadeia a **correspondência exata de string** com o URI registrado, a ausência de curingas e de open redirects, e o **PKCE** com **`state`**, para que um code roubado não sirva.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ataque → defesa",
        rotuloOrigem: "Ataque",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "`redirect_uri` registrado com curinga (`https://*.exemplo.com/*`) ou comparado por prefixo: o invasor usa um subdomínio esquecido ou uma página que controla e recebe o `code`",
            destino:
              "**Correspondência exata de string** do URI completo, registrado de antemão e sem curinga (é o que a RFC 9700 recomenda, com a exceção da porta variável do loopback em aplicativos nativos). Remova registros e subdomínios que ninguém usa mais.",
          },
          {
            origem:
              "**Open redirect** na aplicação legítima (`/sair?next=https://invasor.example`): o `redirect_uri` parece do seu domínio, mas a página redireciona o navegador e leva o `code` ou o token junto (um token em fragmento atravessa redirecionamentos)",
            destino:
              "Eliminar open redirects: aceitar só **caminhos relativos** ou uma allowlist de destinos internos (ou assinar o `next`). Com correspondência exata, o invasor não consegue apontar o `redirect_uri` para essa página, a menos que ela seja justamente a registrada.",
          },
          {
            origem:
              "Comparação “esperta” demais: ignora a query, normaliza `..`, maiúsculas ou barras, ou aceita `redirect_uri` parcial ou omitido quando há vários registrados",
            destino:
              "Compare a **string recebida** com as registradas, sem reinterpretá-la. Se o cliente tem mais de um URI, o `redirect_uri` é **obrigatório** na requisição, e o mesmo valor deve voltar na troca do code pelo token.",
          },
          {
            origem:
              "Servidor de autorização que, ao receber um `redirect_uri` inválido, **redireciona assim mesmo** com o erro: ele próprio vira um open redirect",
            destino:
              "Se o `redirect_uri` ou o `client_id` são inválidos, o servidor mostra uma **página de erro própria** e não redireciona (é o que a RFC 6749 manda).",
          },
          {
            origem:
              "O `code` ou o token aparece na URL e vaza por `Referer`, histórico, logs ou scripts de terceiros na página do callback",
            destino:
              "Authorization code com troca imediata (nada de implicit, veja Q33), `code` de uso único e curta duração, `Referrer-Policy` restritiva (como `no-referrer`), nenhum recurso de terceiros na página do callback e nenhum log da URL completa.",
          },
          {
            origem:
              "O invasor consegue o `code` mesmo assim (esquema customizado em app nativo interceptado por outro aplicativo; code injetado na sessão da vítima)",
            destino:
              "**PKCE** (veja Q28): o code só serve a quem tem o `code_verifier`. **`state`** liga resposta e requisição (veja Q29 e Q126). Em apps nativos, prefira redirecionamentos `https` verificados ou loopback a esquemas customizados. PAR (veja Q38) leva os parâmetros pelo canal de fundo.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O ataque, com um servidor que aceita curinga",
        legenda: "HTTP",
        codigo: `# Registrado (curinga, ERRADO): https://*.exemplo.com/callback
# O invasor controla um subdomínio esquecido: antigo.exemplo.com

GET /authorize?response_type=code&client_id=app-web&state=abc&redirect_uri=https%3A%2F%2Fantigo.exemplo.com%2Fcallback HTTP/1.1
Host: auth.exemplo.com

HTTP/1.1 302 Found
Location: https://antigo.exemplo.com/callback?code=SplxlOBeZQQYbYS6WxSbIA&state=abc

# Com correspondência exata, a resposta é uma página de erro do próprio servidor, sem redirecionar.`,
        nota: "A vítima só precisa clicar no link do invasor e fazer login: o servidor, que aceitou o curinga, entrega o code a quem controla o subdomínio. Sem o PKCE, o invasor troca o code por token.",
      },
      {
        tipo: "codigo",
        titulo: "As duas verificações que quebram a cadeia",
        legenda: "TypeScript",
        codigo: `// 1) Servidor de autorização: o redirect_uri tem de ser IGUAL a um registrado
function redirectUriValido(recebido: string, registrados: readonly string[]): boolean {
  return registrados.includes(recebido); // comparação de string: sem curinga, prefixo ou normalização
}

// 2) Aplicação: nunca redirecionar para um destino livre vindo da requisição
function destinoInterno(next: string | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\\\")) return "/";
  return next; // só caminhos relativos do próprio site
}`,
        nota: "O filtro de caminho é só um ponto de partida: navegadores tratam `//` e `\\` como início de host. Prefira um mapa de destinos conhecidos (`painel` → `/painel`) a filtrar texto livre.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A cadeia e onde quebrá-la",
        texto:
          "Para roubar o code, o invasor precisa de **(1)** um destino que ele controle ou que repasse o navegador, **(2)** uma vítima que faça login pelo link dele e **(3)** um code que sirva a quem o recebe. A correspondência exata corta o **(1)**; o `state` e a ligação com o navegador que iniciou o fluxo atrapalham o **(2)**; o PKCE corta o **(3)**. Use as três camadas: se uma falhar, as outras seguram. A RFC 9700 reúne essas práticas de segurança do OAuth 2.0.",
      },
    ],
    armadilhas: [
      "Registrar `https://*.exemplo.com/*` “por comodidade”: cada subdomínio abandonado vira um receptor de code.",
      "Corrigir só o servidor de autorização e deixar open redirects na aplicação (`?next=`, `?returnTo=`), ou o inverso: o invasor usa o elo mais fraco.",
      "Permitir `http://` ou `localhost` em produção, ou esquemas customizados em apps nativos sem PKCE.",
      "Achar que o PKCE basta e relaxar o `redirect_uri`: o PKCE protege o code, mas o redirecionamento aberto ainda serve a phishing e a vazamentos de outros parâmetros. Use camadas.",
    ],
    autoteste: [
      {
        pergunta: "Por que a correspondência exata do `redirect_uri` é melhor que prefixo ou curinga?",
        resposta:
          "Porque prefixo e curinga ampliam o conjunto de destinos aceitos para qualquer coisa que o invasor consiga hospedar ou alterar (um subdomínio esquecido, uma página com open redirect). A comparação exata deixa só o endereço que você registrou.",
      },
      {
        pergunta: "Mesmo com o `redirect_uri` correto, como o PKCE protege um code vazado?",
        resposta:
          "O servidor só troca o code por token se o pedido trouxer o `code_verifier` cujo hash foi enviado no início do fluxo. Quem roubou só o code não tem o verifier, e a troca falha.",
      },
    ],
  },
  en: {
    titulo: "redirect_uri and open redirect attacks",
    pergunta:
      "How do attacks on redirect_uri and open redirects let an attacker steal an authorization code or token? Which defenses break the chain?",
    porqueEsteMetodo:
      "Defending `redirect_uri` looks like a configuration detail until you see the whole attack: where the code goes and why. Each attack → defense pair shows what the attacker controls and the rule that takes that control away.",
    resposta30s:
      "The authorization code (or token) is delivered to the `redirect_uri` address. If the server accepts an address the attacker controls (through a permissive **wildcard, prefix or subdomain**) or one that **redirects anywhere (an open redirect)**, the code ends up in their hands: the cause is **loose validation of the destination**. The chain is broken by **exact string matching** against the registered URI, no wildcards and no open redirects, and **PKCE** with **`state`**, so that a stolen code is useless.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Attack → defense",
        rotuloOrigem: "Attack",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "`redirect_uri` registered with a wildcard (`https://*.example.com/*`) or compared by prefix: the attacker uses a forgotten subdomain or a page they control and receives the `code`",
            destino:
              "**Exact string matching** of the full URI, registered in advance and with no wildcard (this is what RFC 9700 recommends, with the exception of the variable loopback port in native apps). Remove registrations and subdomains nobody uses anymore.",
          },
          {
            origem:
              "An **open redirect** in the legitimate application (`/logout?next=https://attacker.example`): the `redirect_uri` looks like it is on your domain, but the page redirects the browser and carries the `code` or token along (a token in a fragment survives redirects)",
            destino:
              "Eliminate open redirects: accept only **relative paths** or an allowlist of internal destinations (or sign the `next`). With exact matching, the attacker cannot point the `redirect_uri` at that page, unless it happens to be the registered one.",
          },
          {
            origem:
              "Over-clever comparison: it ignores the query, normalizes `..`, case or slashes, or accepts a partial or omitted `redirect_uri` when several are registered",
            destino:
              "Compare the **received string** with the registered ones, without reinterpreting it. If the client has more than one URI, `redirect_uri` is **required** in the request, and the same value must come back when the code is exchanged for the token.",
          },
          {
            origem:
              "An authorization server that, on receiving an invalid `redirect_uri`, **redirects anyway** with the error: it becomes an open redirect itself",
            destino:
              "If the `redirect_uri` or the `client_id` is invalid, the server shows **its own error page** and does not redirect (this is what RFC 6749 requires).",
          },
          {
            origem:
              "The `code` or token appears in the URL and leaks through `Referer`, history, logs or third-party scripts on the callback page",
            destino:
              "Authorization code with immediate exchange (no implicit, see Q33), a single-use, short-lived `code`, a restrictive `Referrer-Policy` (such as `no-referrer`), no third-party resources on the callback page and no logging of the full URL.",
          },
          {
            origem:
              "The attacker gets the `code` anyway (a custom scheme in a native app intercepted by another app; a code injected into the victim’s session)",
            destino:
              "**PKCE** (see Q28): the code only works for whoever holds the `code_verifier`. **`state`** ties response to request (see Q29 and Q126). In native apps, prefer verified `https` redirects or loopback to custom schemes. PAR (see Q38) carries the parameters over the back channel.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The attack, against a server that accepts a wildcard",
        legenda: "HTTP",
        codigo: `# Registered (wildcard, WRONG): https://*.example.com/callback
# The attacker controls a forgotten subdomain: old.example.com

GET /authorize?response_type=code&client_id=web-app&state=abc&redirect_uri=https%3A%2F%2Fold.example.com%2Fcallback HTTP/1.1
Host: auth.example.com

HTTP/1.1 302 Found
Location: https://old.example.com/callback?code=SplxlOBeZQQYbYS6WxSbIA&state=abc

# With exact matching, the response is the server's own error page, with no redirect.`,
        nota: "The victim only has to click the attacker’s link and sign in: the server, which accepted the wildcard, hands the code to whoever controls the subdomain. Without PKCE, the attacker exchanges the code for a token.",
      },
      {
        tipo: "codigo",
        titulo: "The two checks that break the chain",
        legenda: "TypeScript",
        codigo: `// 1) Authorization server: the redirect_uri must be EQUAL to a registered one
function isValidRedirectUri(received: string, registered: readonly string[]): boolean {
  return registered.includes(received); // string comparison: no wildcard, prefix or normalization
}

// 2) Application: never redirect to a free destination taken from the request
function internalTarget(next: string | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\\\")) return "/";
  return next; // relative paths on your own site only
}`,
        nota: "The path filter is only a starting point: browsers treat `//` and `\\` as the start of a host. Prefer a map of known destinations (`dashboard` → `/dashboard`) over filtering free text.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The chain and where to break it",
        texto:
          "To steal the code, the attacker needs **(1)** a destination they control or that relays the browser, **(2)** a victim who signs in through their link and **(3)** a code that works for whoever receives it. Exact matching cuts **(1)**; `state` and the tie to the browser that started the flow get in the way of **(2)**; PKCE cuts **(3)**. Use all three layers: if one fails, the others hold. RFC 9700 gathers these OAuth 2.0 security practices.",
      },
    ],
    armadilhas: [
      "Registering `https://*.example.com/*` “for convenience”: every abandoned subdomain becomes a code receiver.",
      "Fixing only the authorization server and leaving open redirects in the application (`?next=`, `?returnTo=`), or the other way around: the attacker uses the weakest link.",
      "Allowing `http://` or `localhost` in production, or custom schemes in native apps without PKCE.",
      "Thinking PKCE is enough and relaxing the `redirect_uri`: PKCE protects the code, but an open redirect still serves phishing and the leakage of other parameters. Use layers.",
    ],
    autoteste: [
      {
        pergunta: "Why is exact `redirect_uri` matching better than a prefix or a wildcard?",
        resposta:
          "Because a prefix or wildcard widens the set of accepted destinations to anything the attacker can host or change (a forgotten subdomain, a page with an open redirect). Exact comparison leaves only the address you registered.",
      },
      {
        pergunta: "Even with the correct `redirect_uri`, how does PKCE protect a leaked code?",
        resposta:
          "The server only exchanges the code for a token if the request carries the `code_verifier` whose hash was sent at the start of the flow. Whoever stole only the code does not have the verifier, and the exchange fails.",
      },
    ],
  },
};
