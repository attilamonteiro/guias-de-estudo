import type { Pergunta } from "../../tipos";

// L42 · CORS e preflight
export const l042: Pergunta = {
  numero: 142,
  modulo: "linkedin-express",
  metodo: "trace",
  pt: {
    titulo: "CORS e preflight",
    pergunta: "O que é CORS?",
    porqueEsteMetodo:
      "CORS é uma conversa entre navegador e servidor que acontece em etapas, e quase todo erro vem de uma etapa que falhou. Acompanhar um pedido entre duas origens, do preflight à leitura da resposta, deixa claro quem decide o quê.",
    resposta30s:
      "**CORS** (Cross-Origin Resource Sharing) é o mecanismo pelo qual o servidor diz ao **navegador** quais outras **origens** (esquema + domínio + porta) podem ler as suas respostas; sem isso, a política de mesma origem impede o JavaScript da página de ler respostas de outra origem. Em pedidos “não simples” (`PUT`, `Authorization`, JSON), o navegador envia antes um **preflight** `OPTIONS`, e o servidor responde com os cabeçalhos `Access-Control-Allow-*`. É uma regra do navegador, **não é autenticação**: `curl` e outros servidores a ignoram.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Um pedido entre origens: app.exemplo.com chama api.exemplo.com",
        etapas: [
          "O JavaScript de `https://app.exemplo.com` usa `fetch` para um `PUT` com JSON e o cabeçalho `Authorization` em `https://api.exemplo.com`: host diferente, logo **outra origem**",
          "O navegador vê um pedido “não simples” e **segura o pedido real**; antes envia o **preflight**: `OPTIONS` com `Origin`, `Access-Control-Request-Method: PUT` e `Access-Control-Request-Headers: authorization, content-type`",
          "O servidor responde `204` com `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods` e `Access-Control-Allow-Headers` (e, se quiser, `Access-Control-Max-Age`)",
          "O navegador confere se origem, método e cabeçalhos pedidos foram permitidos; se sim, envia o `PUT` de verdade, com o cabeçalho `Origin`",
          "O servidor executa o handler e responde com os dados e, de novo, `Access-Control-Allow-Origin`",
          "O navegador confere esse cabeçalho na resposta real; só então o JavaScript da página consegue ler o resultado",
        ],
        nota: "Pedidos “simples” (um `GET`, ou o `POST` de um formulário) dispensam o preflight: seguem direto, e só a **leitura** da resposta depende do cabeçalho. `Content-Type: application/json`, `Authorization`, `PUT`, `PATCH`, `DELETE` e cabeçalhos personalizados disparam o preflight.",
      },
      {
        tipo: "passos",
        titulo: "Onde costuma dar errado",
        passos: [
          {
            titulo: "O preflight não é respondido direito",
            texto:
              "O `OPTIONS` cai numa rota que não existe (`404` ou `405`) ou num middleware de autenticação que devolve `401`, já que o preflight nunca leva credenciais. O navegador desiste e o pedido real **nem chega a ser enviado**. Registre o CORS antes da autenticação e das rotas.",
          },
          {
            titulo: "A resposta real não traz o cabeçalho",
            texto:
              "Um `500` ou `401` gerado fora do middleware de CORS sai sem `Access-Control-Allow-Origin`. O console diz “bloqueado por CORS” e esconde o problema verdadeiro: olhe a aba Rede, não só o console.",
          },
          {
            titulo: "Credenciais com curinga",
            texto:
              "Com `fetch` e `credentials: 'include'`, o servidor precisa enviar `Access-Control-Allow-Credentials: true` e uma origem **explícita**: `*` é recusado. Se a origem permitida varia por pedido, envie também `Vary: Origin`.",
          },
          {
            titulo: "Funciona no `curl`, falha no navegador",
            texto:
              "É o esperado: CORS é uma regra que o **navegador** aplica a scripts de páginas. `curl`, Postman e outros servidores a ignoram. Por isso ela protege o usuário no navegador, não a sua API.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Os cabeçalhos principais",
        colunas: ["Cabeçalho", "Quem envia", "O que significa"],
        linhas: [
          ["`Origin`", "Navegador, no pedido", "De que origem (esquema + host + porta) vem a página que fez o pedido"],
          [
            "`Access-Control-Allow-Origin`",
            "Servidor, na resposta",
            "Qual origem pode ler a resposta (uma origem específica ou `*`)",
          ],
          [
            "`Access-Control-Allow-Methods` e `Access-Control-Allow-Headers`",
            "Servidor, na resposta ao preflight",
            "Métodos e cabeçalhos de pedido que o navegador pode usar",
          ],
          [
            "`Access-Control-Allow-Credentials`",
            "Servidor, na resposta",
            "Permite cookies e credenciais; exige uma origem explícita",
          ],
          [
            "`Access-Control-Max-Age`",
            "Servidor, no preflight",
            "Por quanto tempo o navegador pode reaproveitar a resposta do preflight",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "CORS com o pacote cors",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          'import cors from "cors";',
          "",
          "const app = express();",
          "",
          "app.use(",
          "  cors({",
          '    origin: ["https://app.exemplo.com"], // lista fechada; evite refletir qualquer origem',
          '    methods: ["GET", "POST", "PUT", "DELETE"],',
          '    allowedHeaders: ["Content-Type", "Authorization"],',
          '    credentials: true, // permite cookies; exige origem explícita, nunca "*"',
          "    maxAge: 600, // o navegador reaproveita o preflight por 10 minutos",
          "  }),",
          "); // antes das rotas e da autenticação: responde ao OPTIONS por você",
        ].join("\n"),
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "CORS não é autenticação nem proteção da API",
        texto:
          "CORS só diz ao navegador quais páginas podem **ler** respostas. Não impede que um script, o `curl` ou outro servidor chame a API, e pedidos simples (como o `POST` de um formulário) chegam ao servidor de qualquer forma. Quem protege os dados é a autenticação e a autorização (veja L45); contra requisições forjadas a partir do navegador, veja CSRF em L124. E não “resolva” um erro de CORS com `*` nem refletindo qualquer `Origin`: use uma lista fechada de origens conhecidas.",
      },
    ],
    armadilhas: [
      "Tratar CORS como segurança da API: ele não barra clientes fora do navegador nem impede que pedidos simples cheguem ao servidor.",
      "Liberar `*`, ou refletir qualquer `Origin` junto com credenciais, para “fazer parar o erro”: qualquer site visitado pelo usuário passa a poder ler as respostas dele.",
      "Registrar o `cors` depois da autenticação ou das rotas, de modo que o `OPTIONS` receba `401` ou `404` e o pedido real nunca saia.",
      "Esquecer que respostas de erro (`4xx` e `5xx`) também precisam dos cabeçalhos de CORS; sem eles o navegador exibe um erro de CORS que esconde o problema real.",
    ],
    autoteste: [
      {
        pergunta: "Por que a mesma chamada funciona no `curl` e falha no navegador?",
        resposta:
          "Porque CORS é imposto pelo navegador, que bloqueia a leitura da resposta quando falta o cabeçalho permitindo a origem. O `curl` não aplica essa política.",
      },
      {
        pergunta: "Por que `Access-Control-Allow-Origin: *` não serve quando a requisição leva cookies?",
        resposta:
          "Com credenciais, o navegador exige uma origem explícita e `Access-Control-Allow-Credentials: true`; o curinga é recusado.",
      },
    ],
  },
  en: {
    titulo: "CORS and preflight",
    pergunta: "What is CORS?",
    porqueEsteMetodo:
      "CORS is a conversation between browser and server that happens in stages, and almost every error comes from a stage that failed. Following one cross-origin request, from the preflight to reading the response, makes clear who decides what.",
    resposta30s:
      "**CORS** (Cross-Origin Resource Sharing) is the mechanism by which the server tells the **browser** which other **origins** (scheme + domain + port) may read its responses; without it, the same-origin policy stops the page’s JavaScript from reading responses from another origin. For “non-simple” requests (`PUT`, `Authorization`, JSON), the browser first sends an `OPTIONS` **preflight**, and the server answers with the `Access-Control-Allow-*` headers. It is a browser rule, **not authentication**: `curl` and other servers ignore it.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A cross-origin request: app.example.com calls api.example.com",
        etapas: [
          "JavaScript on `https://app.example.com` uses `fetch` to send a `PUT` with JSON and an `Authorization` header to `https://api.example.com`: a different host, so a **different origin**",
          "The browser sees a “non-simple” request and **holds the real request**; first it sends the **preflight**: `OPTIONS` with `Origin`, `Access-Control-Request-Method: PUT` and `Access-Control-Request-Headers: authorization, content-type`",
          "The server answers `204` with `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers` (and, if it wants, `Access-Control-Max-Age`)",
          "The browser checks that the origin, method and requested headers were allowed; if so, it sends the real `PUT`, with the `Origin` header",
          "The server runs the handler and responds with the data and, again, `Access-Control-Allow-Origin`",
          "The browser checks that header on the real response; only then can the page’s JavaScript read the result",
        ],
        nota: "“Simple” requests (a `GET`, or a form `POST`) skip the preflight: they go straight through, and only **reading** the response depends on the header. `Content-Type: application/json`, `Authorization`, `PUT`, `PATCH`, `DELETE` and custom headers trigger the preflight.",
      },
      {
        tipo: "passos",
        titulo: "Where it usually goes wrong",
        passos: [
          {
            titulo: "The preflight is not answered properly",
            texto:
              "The `OPTIONS` lands on a route that does not exist (`404` or `405`) or on an authentication middleware that returns `401`, since the preflight never carries credentials. The browser gives up and the real request is **never even sent**. Register CORS before authentication and the routes.",
          },
          {
            titulo: "The real response lacks the header",
            texto:
              "A `500` or `401` produced outside the CORS middleware goes out without `Access-Control-Allow-Origin`. The console says “blocked by CORS” and hides the real problem: look at the Network tab, not just the console.",
          },
          {
            titulo: "Credentials with a wildcard",
            texto:
              "With `fetch` and `credentials: 'include'`, the server must send `Access-Control-Allow-Credentials: true` and an **explicit** origin: `*` is rejected. If the allowed origin varies per request, also send `Vary: Origin`.",
          },
          {
            titulo: "Works in `curl`, fails in the browser",
            texto:
              "That is expected: CORS is a rule the **browser** applies to page scripts. `curl`, Postman and other servers ignore it. So it protects the user in the browser, not your API.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "The main headers",
        colunas: ["Header", "Who sends it", "What it means"],
        linhas: [
          [
            "`Origin`",
            "Browser, on the request",
            "Which origin (scheme + host + port) the page that made the request comes from",
          ],
          [
            "`Access-Control-Allow-Origin`",
            "Server, on the response",
            "Which origin may read the response (a specific origin or `*`)",
          ],
          [
            "`Access-Control-Allow-Methods` and `Access-Control-Allow-Headers`",
            "Server, on the preflight response",
            "The request methods and headers the browser may use",
          ],
          [
            "`Access-Control-Allow-Credentials`",
            "Server, on the response",
            "Allows cookies and credentials; requires an explicit origin",
          ],
          [
            "`Access-Control-Max-Age`",
            "Server, on the preflight",
            "How long the browser may reuse the preflight response",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "CORS with the cors package",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          'import cors from "cors";',
          "",
          "const app = express();",
          "",
          "app.use(",
          "  cors({",
          '    origin: ["https://app.example.com"], // closed list; avoid reflecting any origin',
          '    methods: ["GET", "POST", "PUT", "DELETE"],',
          '    allowedHeaders: ["Content-Type", "Authorization"],',
          '    credentials: true, // allows cookies; needs an explicit origin, never "*"',
          "    maxAge: 600, // the browser reuses the preflight for 10 minutes",
          "  }),",
          "); // before the routes and authentication: it answers OPTIONS for you",
        ].join("\n"),
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "CORS is not authentication or API protection",
        texto:
          "CORS only tells the browser which pages may **read** responses. It does not stop a script, `curl` or another server from calling the API, and simple requests (like a form `POST`) reach the server anyway. What protects data is authentication and authorization (see L45); against forged requests from the browser, see CSRF in L124. And do not “fix” a CORS error with `*` or by reflecting any `Origin`: use a closed list of known origins.",
      },
    ],
    armadilhas: [
      "Treating CORS as API security: it does not stop clients outside the browser or keep simple requests from reaching the server.",
      "Allowing `*`, or reflecting any `Origin` together with credentials, to “make the error go away”: any site the user visits can then read their responses.",
      "Registering `cors` after authentication or the routes, so the `OPTIONS` gets `401` or `404` and the real request never goes out.",
      "Forgetting that error responses (`4xx` and `5xx`) also need the CORS headers; without them the browser shows a CORS error that hides the real problem.",
    ],
    autoteste: [
      {
        pergunta: "Why does the same call work in `curl` and fail in the browser?",
        resposta:
          "Because CORS is enforced by the browser, which blocks reading the response when the header allowing the origin is missing. `curl` does not apply that policy.",
      },
      {
        pergunta: "Why does `Access-Control-Allow-Origin: *` not work when the request carries cookies?",
        resposta:
          "With credentials, the browser requires an explicit origin and `Access-Control-Allow-Credentials: true`; the wildcard is rejected.",
      },
    ],
  },
};
