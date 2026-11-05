import type { Pergunta } from "../../tipos";

// Q75 · JWT × sessão com cookie
export const q075: Pergunta = {
  numero: 75,
  modulo: "tokens-e-sessoes",
  metodo: "compare",
  pt: {
    titulo: "JWT × sessão com cookie",
    pergunta:
      "Compare JWT stateless e sessão no servidor com cookie. Quando cada um é a melhor escolha para uma aplicação web e para uma API?",
    porqueEsteMetodo:
      "“JWT ou sessão?” costuma virar disputa de moda. A matriz compara os dois por critérios concretos (estado, revogação, ataques, domínios), e a regra de decisão separa o caso da aplicação web própria do caso de API e federação.",
    resposta30s:
      "A **sessão no servidor** guarda o estado num armazenamento e entrega ao navegador só um **identificador opaco em cookie** (`HttpOnly`, `Secure`, `SameSite`), com logout e revogação imediatos. O **JWT stateless** leva o estado no próprio token, que qualquer serviço valida com a chave pública, mas ele dura até expirar. Para uma **aplicação web própria**, a sessão com cookie costuma ser mais simples e segura; para **APIs, vários serviços e federação**, tokens (JWT ou opacos) são o caminho: o JWT não é “melhor”, ele resolve outro problema.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Sessão com cookie × JWT",
        colunas: ["Critério", "Sessão no servidor + cookie", "JWT stateless"],
        linhas: [
          [
            "Onde está o estado",
            "No servidor (memória compartilhada, Redis ou banco); o cookie leva só um identificador aleatório",
            "No próprio token, em poder do cliente; o servidor só verifica a assinatura",
          ],
          [
            "Revogação e logout",
            "Imediatos: apagar o registro encerra a sessão, inclusive “sair de todos os dispositivos” (veja Q82)",
            "O token vale até expirar, a menos que se acrescente estado (lista de revogação, vida curta com refresh, veja Q77)",
          ],
          [
            "Escala",
            "Exige um armazenamento de sessão compartilhado entre as instâncias; uma consulta por requisição, que costuma ser barata",
            "Qualquer instância valida sem consulta, o que ajuda quando há muitos serviços; o estado reaparece em refresh tokens, revogação e rotação de chaves",
          ],
          ["Tamanho por requisição", "Pequeno: um identificador", "Cresce com as claims e vai em toda requisição"],
          [
            "XSS",
            "O cookie `HttpOnly` não é lido por script; ainda assim, um XSS faz requisições como o usuário, a partir da página",
            "Em `localStorage`, o script lê o token e o leva embora; em cookie `HttpOnly`, o risco é o do cookie (veja Q80 e Q127)",
          ],
          [
            "CSRF",
            "O navegador envia o cookie sozinho: exige `SameSite`, token anti-CSRF e checagem de `Origin` (veja Q126)",
            "Token no cabeçalho `Authorization` não é enviado sozinho, então não sofre o CSRF clássico; em cookie, sofre como qualquer cookie",
          ],
          [
            "Vários domínios e terceiros",
            "O cookie é preso ao domínio, e os navegadores restringem cookies de terceiros: fica pior entre sites diferentes",
            "Atravessa domínios e APIs (com CORS configurado); natural para federação e clientes de terceiros",
          ],
          [
            "Mobile e serviço a serviço",
            "Desajeitado fora do navegador",
            "Natural: `Authorization: Bearer` em qualquer cliente",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "O que viaja em cada modelo",
        legenda: "HTTP",
        codigo: `# Sessão: o cookie guarda só um identificador opaco, preso a este host
Set-Cookie: __Host-sid=Zk3q9TnW1xPq7Lb0; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=28800

# O servidor busca no armazenamento o usuário e os papéis dessa sessão.

# JWT numa API: o cliente envia o token no cabeçalho
Authorization: Bearer <jwt>`,
        nota: "O prefixo `__Host-` exige `Secure`, `Path=/` e nenhum `Domain`, o que prende o cookie ao host. Veja Q79 para os atributos de cookies seguros.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "**Aplicação web própria: sessão com cookie. API, vários clientes e federação: tokens.** Navegador, mesmo domínio, logout e revogação importantes: sessão no servidor, com cookie `HttpOnly; Secure; SameSite`. Mobile, serviços chamando serviços, terceiros e SSO federado: token no cabeçalho (JWT ou opaco, veja Q74). Uma SPA com API própria pode ter o melhor dos dois com um **BFF**: o navegador só tem o cookie de sessão, e o BFF guarda os tokens e chama as APIs (veja Q41).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O que o “stateless” esconde",
        texto:
          "“Stateless” não é sinônimo de “mais simples”. JWT como sessão, sem plano de revogação, deixa válida até expirar a conta de quem foi desligado. Tratar revogação, refresh tokens, rotação de chaves e tamanho recria o estado e a complexidade que a sessão já resolvia. E um JWT em `localStorage` põe uma credencial ao alcance de qualquer XSS. Escolha pelo risco e pela arquitetura, não pela promessa de escala: uma consulta ao Redis por requisição costuma não ser o gargalo.",
      },
    ],
    armadilhas: [
      "Usar JWT de vida longa como sessão, sem lista de revogação nem logout no servidor: o “sair” só apaga o token no cliente.",
      "Guardar o JWT em `localStorage` por conveniência: qualquer XSS rouba o token e o usa fora da página.",
      "Achar que o cookie de sessão dispensa defesa contra CSRF, ou que o token no cabeçalho dispensa defesa contra XSS.",
      "Escolher JWT “porque escala”, sem medir: uma consulta a um armazenamento de sessão costuma ser barata, e a complexidade do JWT é permanente.",
    ],
    autoteste: [
      {
        pergunta: "Em uma aplicação web própria, por que a sessão com cookie costuma ser a melhor escolha?",
        resposta:
          "Porque o estado fica no servidor, o cookie é só um identificador, e a revogação e o logout são imediatos. Com `HttpOnly`, `Secure` e `SameSite`, o navegador protege o identificador de scripts e de envios entre sites.",
      },
      {
        pergunta: "Quando o JWT é uma escolha melhor do que a sessão?",
        resposta:
          "Quando o cliente não é um navegador do seu domínio (mobile, outros serviços, terceiros) ou quando há federação entre sistemas: a validação local com a chave pública evita consultar um armazenamento compartilhado.",
      },
    ],
  },
  en: {
    titulo: "JWT vs cookie session",
    pergunta:
      "Compare stateless JWT and a server-side session with a cookie. When is each the better choice for a web application and for an API?",
    porqueEsteMetodo:
      "“JWT or session?” tends to turn into a fashion fight. The matrix compares the two on concrete criteria (state, revocation, attacks, domains), and the decision rule separates the first-party web application case from the API and federation case.",
    resposta30s:
      "A **server-side session** keeps the state in a store and gives the browser only an **opaque identifier in a cookie** (`HttpOnly`, `Secure`, `SameSite`), with immediate logout and revocation. A **stateless JWT** carries the state in the token itself, which any service validates with the public key, but it lasts until it expires. For a **first-party web application**, the cookie session is usually simpler and safer; for **APIs, multiple services and federation**, tokens (JWT or opaque) are the way: a JWT is not “better”, it solves a different problem.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Cookie session vs JWT",
        colunas: ["Criterion", "Server-side session + cookie", "Stateless JWT"],
        linhas: [
          [
            "Where the state lives",
            "On the server (shared memory, Redis or a database); the cookie carries only a random identifier",
            "In the token itself, held by the client; the server only verifies the signature",
          ],
          [
            "Revocation and logout",
            "Immediate: deleting the record ends the session, including “sign out of all devices” (see Q82)",
            "The token is valid until it expires, unless state is added (a revocation list, a short lifetime with refresh, see Q77)",
          ],
          [
            "Scale",
            "Needs a session store shared among instances; one lookup per request, which is usually cheap",
            "Any instance validates without a lookup, which helps with many services; state reappears in refresh tokens, revocation and key rotation",
          ],
          ["Size per request", "Small: an identifier", "Grows with the claims and goes on every request"],
          [
            "XSS",
            "An `HttpOnly` cookie is not readable by script; even so, an XSS makes requests as the user, from the page",
            "In `localStorage`, the script reads the token and takes it away; in an `HttpOnly` cookie, the risk is the cookie’s (see Q80 and Q127)",
          ],
          [
            "CSRF",
            "The browser sends the cookie on its own: it needs `SameSite`, an anti-CSRF token and an `Origin` check (see Q126)",
            "A token in the `Authorization` header is not sent on its own, so it does not suffer classic CSRF; in a cookie, it suffers like any cookie",
          ],
          [
            "Multiple domains and third parties",
            "The cookie is bound to the domain, and browsers restrict third-party cookies: it gets worse across different sites",
            "Crosses domains and APIs (with CORS configured); natural for federation and third-party clients",
          ],
          [
            "Mobile and service to service",
            "Awkward outside the browser",
            "Natural: `Authorization: Bearer` from any client",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "What travels in each model",
        legenda: "HTTP",
        codigo: `# Session: the cookie holds only an opaque identifier, bound to this host
Set-Cookie: __Host-sid=Zk3q9TnW1xPq7Lb0; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=28800

# The server looks up the user and roles for this session in its store.

# JWT on an API: the client sends the token in the header
Authorization: Bearer <jwt>`,
        nota: "The `__Host-` prefix requires `Secure`, `Path=/` and no `Domain`, which pins the cookie to the host. See Q79 for the attributes of secure cookies.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "**First-party web application: cookie session. API, multiple clients and federation: tokens.** Browser, same domain, logout and revocation matter: a server-side session, with an `HttpOnly; Secure; SameSite` cookie. Mobile, services calling services, third parties and federated SSO: a token in the header (JWT or opaque, see Q74). An SPA with its own API can get the best of both with a **BFF**: the browser holds only the session cookie, and the BFF keeps the tokens and calls the APIs (see Q41).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What “stateless” hides",
        texto:
          "“Stateless” is not a synonym for “simpler”. A JWT as a session, with no revocation plan, leaves the account of someone who was offboarded valid until it expires. Handling revocation, refresh tokens, key rotation and size recreates the state and the complexity the session already solved. And a JWT in `localStorage` puts a credential within reach of any XSS. Choose by risk and architecture, not by the promise of scale: one Redis lookup per request is usually not the bottleneck.",
      },
    ],
    armadilhas: [
      "Using a long-lived JWT as a session, with no revocation list and no server-side logout: “sign out” only deletes the token on the client.",
      "Keeping the JWT in `localStorage` for convenience: any XSS steals the token and uses it outside the page.",
      "Thinking a session cookie removes the need for CSRF defense, or that a token in the header removes the need for XSS defense.",
      "Choosing JWT “because it scales”, without measuring: a session-store lookup is usually cheap, and the JWT’s complexity is permanent.",
    ],
    autoteste: [
      {
        pergunta: "In a first-party web application, why is the cookie session usually the best choice?",
        resposta:
          "Because the state stays on the server, the cookie is just an identifier, and revocation and logout are immediate. With `HttpOnly`, `Secure` and `SameSite`, the browser protects the identifier from scripts and from cross-site sends.",
      },
      {
        pergunta: "When is a JWT a better choice than a session?",
        resposta:
          "When the client is not a browser on your domain (mobile, other services, third parties) or when systems federate: local validation with the public key avoids querying a shared store.",
      },
    ],
  },
};
