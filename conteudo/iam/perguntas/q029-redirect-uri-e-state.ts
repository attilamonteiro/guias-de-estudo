import type { Pergunta } from "../../tipos";

// Q29 · redirect_uri e state
export const q029: Pergunta = {
  numero: 29,
  modulo: "oauth",
  metodo: "feynman",
  pt: {
    titulo: "redirect_uri e state",
    pergunta:
      "Para que servem o redirect_uri com correspondência exata e o parâmetro state no OAuth 2.0? O que cada um protege e o que acontece se forem omitidos?",
    porqueEsteMetodo:
      "São dois parâmetros pequenos que protegem coisas diferentes e vivem sendo confundidos. Uma analogia de entrega de encomenda separa os dois papéis; depois vêm o mecanismo real e o ponto em que a imagem deixa de valer.",
    resposta30s:
      "O **`redirect_uri`** pré-registrado e comparado por **igualdade exata de string** garante que o code seja entregue **só ao destino certo**; sem isso, um link adulterado manda o code ao atacante. O **`state`** é um valor aleatório preso à sessão do navegador e **conferido na volta**: garante que a resposta pertence ao pedido que **este** navegador fez, e bloqueia o CSRF de login. Faltando o primeiro, o code vaza; faltando o segundo, o atacante liga a própria conta à sessão da vítima.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Você faz um pedido em uma loja online. A loja só entrega nos **endereços que você cadastrou antes**: se alguém tenta mudar a entrega para outro endereço na hora do pedido, ela recusa, mesmo que o endereço “pareça” com um dos seus. E, quando a caixa chega, você confere o **número do pedido** da etiqueta com o que anotou ao pedir. Caixa sem o seu número? Alguém mandou entregar algo que você não pediu, e você não abre.",
        tecnico:
          "O endereço cadastrado é o **`redirect_uri`**: as URIs de retorno são registradas no authorization server e, a cada pedido, a enviada é comparada com a lista por **igualdade exata de string** (sem curinga, sem prefixo, sem comparar só o domínio); a RFC 9700 admite exceção apenas para a porta em redirecionamentos de loopback de apps nativos. Se não bater, o AS mostra o erro na própria tela e **não redireciona**. O número do pedido é o **`state`**: o client gera um valor aleatório e imprevisível, guarda-o ligado à sessão do navegador (na sessão do servidor ou em um cookie), envia no `/authorize`, e o AS o devolve intacto na volta, onde o client o compara e o descarta. Ele também pode carregar o estado da aplicação (para onde voltar), desde que seja uma referência opaca, não um dado em que se confie.",
        limite:
          "O `state` não impede que alguém **veja** a encomenda: só impede que você aceite uma que não pediu. Quem roubar um code a caminho precisa ser barrado por outro mecanismo (o PKCE, veja Q28). E, ao contrário da loja, que é uma só, no OAuth quem confere o endereço é o **AS** e quem confere o número do pedido é o **client**: são checagens de lados diferentes, e uma não faz a outra.",
      },
      {
        tipo: "tabela",
        titulo: "O que cada um protege",
        colunas: ["Aspecto", "`redirect_uri` com correspondência exata", "`state`"],
        linhas: [
          [
            "Quem verifica",
            "O authorization server, no `/authorize` (e de novo no `/token`)",
            "O client, ao receber a volta no callback",
          ],
          [
            "Protege",
            "**Para onde** o code (ou o token) é entregue",
            "**De quem** é a resposta: do pedido iniciado neste navegador",
          ],
          [
            "Como funciona",
            "URIs pré-registradas; comparação por igualdade de string; HTTPS; sem curinga",
            "Valor aleatório e imprevisível, preso à sessão do navegador, de uso único",
          ],
          [
            "Ataque que bloqueia",
            "Link de login adulterado que manda o code ao site do atacante; redirecionamento aberto no domínio do client",
            "CSRF de login: o atacante faz a vítima abrir o callback com um code que é do atacante",
          ],
          [
            "Se for omitido",
            "O code (e, com ele, o acesso) vai parar com o atacante",
            "O client aceita uma resposta que ninguém pediu e liga a sessão da vítima à conta do atacante",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Gerar e conferir o state",
        legenda: "TypeScript",
        codigo: [
          'import { randomBytes, timingSafeEqual } from "node:crypto";',
          "",
          "declare const sessao: { oauthState?: string }; // sessão do servidor, presa ao cookie do navegador",
          "",
          "export function novoState(): string {",
          '  const state = randomBytes(16).toString("base64url");',
          "  sessao.oauthState = state; // guardado ANTES de redirecionar ao /authorize",
          "  return state;",
          "}",
          "",
          "export function stateConfere(recebido: string | null): boolean {",
          "  const esperado = sessao.oauthState;",
          "  delete sessao.oauthState; // uso único: a segunda volta com o mesmo valor falha",
          "  if (!recebido || !esperado) return false;",
          "  const a = Buffer.from(recebido);",
          "  const b = Buffer.from(esperado);",
          "  return a.length === b.length && timingSafeEqual(a, b);",
          "}",
        ].join("\n"),
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Exato quer dizer exato",
        texto:
          "`https://app.exemplo.com/cb`, `https://app.exemplo.com/cb/` e `https://app.exemplo.com/cb?x=1` são URIs **diferentes**. Registre cada uma que usa, sem curinga (`https://*.exemplo.com/*`) nem prefixo: um curinga, um subdomínio de terceiros ou um redirecionamento aberto em qualquer página do domínio deixam o atacante receber o code. Use HTTPS (exceto o loopback de apps nativos) e, no `/token`, envie a mesma `redirect_uri` do `/authorize`. Se o AS receber um `client_id` ou uma `redirect_uri` inválidos, **não deve redirecionar** o usuário para ela: mostra o erro ao usuário, porque redirecionar entregaria a resposta a um possível atacante e transformaria o AS em um redirecionador aberto. Para lembrar para onde voltar depois do login, não confie em uma URL vinda no `state`: guarde uma referência opaca e valide o destino contra uma lista de caminhos seus.",
      },
    ],
    armadilhas: [
      "Registrar `redirect_uri` com curinga ou por prefixo “para facilitar” ambientes e subdomínios: um subdomínio de terceiros ou um redirecionamento aberto vira ponto de roubo do code.",
      "Gerar um `state` previsível ou fixo (contador, data, valor constante), ou gerá-lo e não conferir (ou conferir sem descartar, permitindo reuso).",
      "Pôr dados sensíveis dentro do `state`, que viaja pela URL, ou confiar numa URL de retorno que veio nele: vira redirecionamento aberto depois do login.",
      "Achar que PKCE, `nonce` e `state` se substituem: cada um fecha uma porta diferente (veja Q28 para o PKCE e Q47 para o `nonce`).",
    ],
    autoteste: [
      {
        pergunta: "Por que o servidor de autorização não redireciona quando a `redirect_uri` não está registrada?",
        resposta:
          "Porque redirecionar para uma URL arbitrária entregaria a resposta a quem montou o link e faria o servidor funcionar como redirecionador aberto. Ele mostra o erro ao usuário.",
      },
      {
        pergunta: "Descreva o ataque que o `state` impede.",
        resposta:
          "Login CSRF: o atacante inicia um fluxo com a conta dele, guarda o code e faz o navegador da vítima abrir o callback com ele. Sem `state`, o client troca o code e liga a sessão da vítima à conta do atacante. Com `state`, o valor não bate com o da sessão e o client aborta.",
      },
    ],
  },
  en: {
    titulo: "redirect_uri and state",
    pergunta:
      "What are exact redirect_uri matching and the state parameter for in OAuth 2.0? What does each protect, and what happens if they are omitted?",
    porqueEsteMetodo:
      "These are two small parameters that protect different things and keep getting confused. A parcel-delivery analogy separates the two roles; then comes the real mechanism and the point where the picture stops holding.",
    resposta30s:
      "A **`redirect_uri`** that is pre-registered and compared by **exact string equality** guarantees the code is delivered **only to the right destination**; without it, a tampered link sends the code to the attacker. **`state`** is a random value tied to the browser session and **checked on return**: it guarantees the response belongs to the request **this** browser made, and it blocks login CSRF. Without the first, the code leaks; without the second, the attacker ties their own account to the victim’s session.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "You place an order at an online store. The store only delivers to the **addresses you registered beforehand**: if someone tries to change the delivery to another address at order time, it refuses, even if the address “looks like” one of yours. And when the box arrives, you compare the **order number** on the label with the one you noted when ordering. A box without your number? Someone had something delivered that you did not order, and you do not open it.",
        tecnico:
          "The registered address is the **`redirect_uri`**: return URIs are registered at the authorization server and, on every request, the one sent is compared with the list by **exact string equality** (no wildcard, no prefix, no comparing only the domain); RFC 9700 allows an exception only for the port on loopback redirects of native apps. If it does not match, the AS shows the error on its own page and **does not redirect**. The order number is the **`state`**: the client generates a random, unpredictable value, stores it tied to the browser session (in the server session or a cookie), sends it at `/authorize`, and the AS returns it untouched on the way back, where the client compares it and discards it. It can also carry application state (where to go back to), as long as it is an opaque reference, not data you trust.",
        limite:
          "`state` does not stop anyone from **seeing** the parcel: it only stops you from accepting one you did not order. Whoever steals a code on its way must be stopped by another mechanism (PKCE, see Q28). And, unlike the store, which is a single party, in OAuth the one who checks the address is the **AS** and the one who checks the order number is the **client**: the checks belong to different sides, and one does not do the other’s job.",
      },
      {
        tipo: "tabela",
        titulo: "What each one protects",
        colunas: ["Aspect", "Exact `redirect_uri` matching", "`state`"],
        linhas: [
          [
            "Who verifies",
            "The authorization server, at `/authorize` (and again at `/token`)",
            "The client, when it receives the callback",
          ],
          [
            "Protects",
            "**Where** the code (or token) is delivered",
            "**Whose** response it is: the request started in this browser",
          ],
          [
            "How it works",
            "Pre-registered URIs; string-equality comparison; HTTPS; no wildcard",
            "Random, unpredictable value, tied to the browser session, single use",
          ],
          [
            "Attack it blocks",
            "A tampered login link that sends the code to the attacker’s site; an open redirect on the client’s domain",
            "Login CSRF: the attacker makes the victim open the callback with the attacker’s own code",
          ],
          [
            "If omitted",
            "The code (and, with it, the access) ends up with the attacker",
            "The client accepts a response nobody asked for and ties the victim’s session to the attacker’s account",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Generating and checking state",
        legenda: "TypeScript",
        codigo: [
          'import { randomBytes, timingSafeEqual } from "node:crypto";',
          "",
          "declare const session: { oauthState?: string }; // server session, tied to the browser cookie",
          "",
          "export function newState(): string {",
          '  const state = randomBytes(16).toString("base64url");',
          "  session.oauthState = state; // stored BEFORE redirecting to /authorize",
          "  return state;",
          "}",
          "",
          "export function stateMatches(received: string | null): boolean {",
          "  const expected = session.oauthState;",
          "  delete session.oauthState; // single use: a second return with the same value fails",
          "  if (!received || !expected) return false;",
          "  const a = Buffer.from(received);",
          "  const b = Buffer.from(expected);",
          "  return a.length === b.length && timingSafeEqual(a, b);",
          "}",
        ].join("\n"),
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Exact means exact",
        texto:
          "`https://app.exemplo.com/cb`, `https://app.exemplo.com/cb/` and `https://app.exemplo.com/cb?x=1` are **different** URIs. Register each one you use, with no wildcard (`https://*.exemplo.com/*`) and no prefix: a wildcard, a third-party subdomain or an open redirect on any page of the domain lets the attacker receive the code. Use HTTPS (except loopback for native apps) and, at `/token`, send the same `redirect_uri` as at `/authorize`. If the AS receives an invalid `client_id` or `redirect_uri`, it **must not redirect** the user to it: it shows the error to the user, because redirecting would hand the response to a possible attacker and turn the AS into an open redirector. To remember where to go back to after login, do not trust a URL arriving in `state`: store an opaque reference and validate the destination against a list of your own paths.",
      },
    ],
    armadilhas: [
      "Registering a `redirect_uri` with a wildcard or by prefix “to make environments and subdomains easier”: a third-party subdomain or an open redirect becomes a place to steal the code.",
      "Generating a predictable or fixed `state` (counter, date, constant value), or generating it and never checking it (or checking without discarding, which allows reuse).",
      "Putting sensitive data inside `state`, which travels in the URL, or trusting a return URL that came inside it: it becomes an open redirect after login.",
      "Thinking PKCE, `nonce` and `state` replace each other: each one closes a different door (see Q28 for PKCE and Q47 for the `nonce`).",
    ],
    autoteste: [
      {
        pergunta: "Why does the authorization server not redirect when the `redirect_uri` is not registered?",
        resposta:
          "Because redirecting to an arbitrary URL would hand the response to whoever built the link and make the server act as an open redirector. It shows the error to the user instead.",
      },
      {
        pergunta: "Describe the attack that `state` prevents.",
        resposta:
          "Login CSRF: the attacker starts a flow with their own account, keeps the code and makes the victim’s browser open the callback with it. Without `state`, the client exchanges the code and ties the victim’s session to the attacker’s account. With `state`, the value does not match the session’s and the client aborts.",
      },
    ],
  },
};
