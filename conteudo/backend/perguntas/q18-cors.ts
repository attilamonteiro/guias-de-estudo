import type { Pergunta } from "../../tipos";

// Q18 · CORS
export const q18: Pergunta = {
  numero: 18,
  modulo: "seguranca",
  metodo: "trace",
  pt: {
    titulo: "CORS",
    pergunta: "O que é o Compartilhamento de Recursos entre Origens (CORS) e como ele funciona?",
    porqueEsteMetodo:
      "CORS só faz sentido seguindo uma requisição de verdade pelo navegador: quem pergunta, quem responde, quem decide. Rastrear o fluxo (inclusive o preflight) elimina a confusão mais comum, de quem está sendo protegido.",
    resposta30s:
      "Por padrão o navegador aplica a **Same-Origin Policy**: um script só lê respostas da mesma origem (esquema + host + porta). **CORS** é o conjunto de cabeçalhos HTTP com que o **servidor de outra origem diz ao navegador** quem pode ler suas respostas (`Access-Control-Allow-Origin` etc.). Quem aplica a regra é o **navegador**, não o servidor: `curl` e Postman ignoram CORS, e CORS protege o **usuário**, não a API.",
    blocos: [
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Quem protege quem",
        texto:
          "Sem a Same-Origin Policy, um site malicioso aberto em outra aba poderia ler, com os seus cookies, a resposta do seu banco. O CORS é a forma controlada de **relaxar** essa regra para origens que o servidor aprova.",
      },
      {
        tipo: "fluxo",
        titulo: "Requisição simples (GET/POST com cabeçalhos básicos)",
        etapas: [
          "JS em `app.example.com` chama `api.example.com`",
          "Navegador envia a requisição com `Origin: https://app.example.com`",
          "API responde com `Access-Control-Allow-Origin: https://app.example.com`",
          "Navegador confere e entrega a resposta ao JS (senão, bloqueia a leitura)",
        ],
        nota: "Atenção: nesse caso a requisição **chegou ao servidor e foi processada**; o navegador apenas esconde a resposta do script.",
      },
      {
        tipo: "passos",
        titulo: "Requisição com preflight (PUT, DELETE, JSON, `Authorization`…)",
        passos: [
          {
            titulo: "O navegador pergunta antes",
            texto: "Envia `OPTIONS` com `Origin`, `Access-Control-Request-Method` e `Access-Control-Request-Headers`.",
          },
          {
            titulo: "O servidor responde a política",
            texto:
              "`204` com `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers` e, opcionalmente, `Access-Control-Max-Age` (cache do preflight).",
          },
          {
            titulo: "O navegador decide",
            texto: "Se método, cabeçalhos e origem foram permitidos, envia a requisição real; se não, ela nem sai.",
          },
          {
            titulo: "A resposta real volta",
            texto: "Também precisa de `Access-Control-Allow-Origin`, senão o JS não a lê.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Configuração no servidor",
        legenda: "javascript (Express)",
        codigo:
          'app.use(cors({\n  origin: ["https://app.example.com"],       // allowlist explicita\n  methods: ["GET", "POST", "PUT", "DELETE"],\n  allowedHeaders: ["Content-Type", "Authorization"],\n  credentials: true,                          // permite cookies\n  maxAge: 600                                 // cache do preflight, em segundos\n}))',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cookies e credenciais",
        texto:
          "Para enviar cookies: o cliente usa `credentials: 'include'` e o servidor responde `Access-Control-Allow-Credentials: true` com uma **origem explícita**. `Access-Control-Allow-Origin: *` não pode ser combinado com credenciais. Se o servidor devolve a origem dinamicamente, adicione `Vary: Origin`.",
      },
    ],
    armadilhas: [
      "Refletir qualquer `Origin` recebido (ou usar `*` em API com dados sensíveis): anula a proteção.",
      "Achar que CORS protege a API de chamadas de fora: `curl`, scripts e servidores ignoram CORS. A API se protege com autenticação e autorização.",
      "Achar que CORS impede CSRF: em requisições simples a requisição é enviada mesmo assim; use `SameSite` e tokens anti-CSRF.",
      "Ler “erro de CORS” como “servidor fora do ar”: veja na aba Rede se o preflight falhou ou se faltou cabeçalho.",
      "Esquecer que o preflight (`OPTIONS`) também precisa ser respondido sem exigir autenticação.",
    ],
    autoteste: [
      {
        pergunta: "Quem faz valer a política de CORS: o servidor ou o navegador?",
        resposta:
          "O navegador. O servidor apenas declara a política por meio dos cabeçalhos; `curl` e Postman a ignoram.",
      },
      {
        pergunta: "Quando o navegador envia um preflight?",
        resposta:
          "Quando a requisição não é “simples”: métodos como PUT/DELETE, `Content-Type: application/json`, ou cabeçalhos personalizados como `Authorization`.",
      },
    ],
  },
  en: {
    titulo: "CORS",
    pergunta: "What is Cross-Origin Resource Sharing (CORS) and how does it work?",
    porqueEsteMetodo:
      "CORS only makes sense by following a real request through the browser: who asks, who answers, who decides. Tracing the flow (including the preflight) clears up the most common confusion, which is who is being protected.",
    resposta30s:
      "By default the browser enforces the **Same-Origin Policy**: a script can only read responses from the same origin (scheme + host + port). **CORS** is the set of HTTP headers through which the **other origin’s server tells the browser** who may read its responses (`Access-Control-Allow-Origin` etc.). The **browser** enforces the rule, not the server: `curl` and Postman ignore CORS, and CORS protects the **user**, not the API.",
    blocos: [
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Who protects whom",
        texto:
          "Without the Same-Origin Policy, a malicious site open in another tab could read, with your cookies, the response from your bank. CORS is the controlled way to **relax** that rule for origins the server approves.",
      },
      {
        tipo: "fluxo",
        titulo: "Simple request (GET/POST with basic headers)",
        etapas: [
          "JS on `app.example.com` calls `api.example.com`",
          "Browser sends the request with `Origin: https://app.example.com`",
          "API replies with `Access-Control-Allow-Origin: https://app.example.com`",
          "Browser checks and hands the response to the JS (otherwise it blocks the read)",
        ],
        nota: "Note: in this case the request **reached the server and was processed**; the browser only hides the response from the script.",
      },
      {
        tipo: "passos",
        titulo: "Request with preflight (PUT, DELETE, JSON, `Authorization`…)",
        passos: [
          {
            titulo: "The browser asks first",
            texto:
              "It sends `OPTIONS` with `Origin`, `Access-Control-Request-Method` and `Access-Control-Request-Headers`.",
          },
          {
            titulo: "The server answers the policy",
            texto:
              "`204` with `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers` and, optionally, `Access-Control-Max-Age` (preflight cache).",
          },
          {
            titulo: "The browser decides",
            texto:
              "If method, headers and origin were allowed, it sends the real request; otherwise it never goes out.",
          },
          {
            titulo: "The real response returns",
            texto: "It also needs `Access-Control-Allow-Origin`, or the JS cannot read it.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Server configuration",
        legenda: "javascript (Express)",
        codigo:
          'app.use(cors({\n  origin: ["https://app.example.com"],       // explicit allowlist\n  methods: ["GET", "POST", "PUT", "DELETE"],\n  allowedHeaders: ["Content-Type", "Authorization"],\n  credentials: true,                          // allows cookies\n  maxAge: 600                                 // preflight cache, in seconds\n}))',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cookies and credentials",
        texto:
          "To send cookies: the client uses `credentials: 'include'` and the server answers `Access-Control-Allow-Credentials: true` with an **explicit origin**. `Access-Control-Allow-Origin: *` cannot be combined with credentials. If the server returns the origin dynamically, add `Vary: Origin`.",
      },
    ],
    armadilhas: [
      "Reflecting any received `Origin` (or using `*` on an API with sensitive data): it cancels the protection.",
      "Thinking CORS protects the API from outside calls: `curl`, scripts and servers ignore CORS. The API protects itself with authentication and authorization.",
      "Thinking CORS prevents CSRF: for simple requests the request is sent anyway; use `SameSite` and anti-CSRF tokens.",
      "Reading a “CORS error” as “server down”: check the Network tab for a failed preflight or a missing header.",
      "Forgetting that the preflight (`OPTIONS`) must also be answered without requiring authentication.",
    ],
    autoteste: [
      {
        pergunta: "Who enforces the CORS policy: the server or the browser?",
        resposta: "The browser. The server only declares the policy through headers; `curl` and Postman ignore it.",
      },
      {
        pergunta: "When does the browser send a preflight?",
        resposta:
          "When the request is not “simple”: methods like PUT/DELETE, `Content-Type: application/json`, or custom headers such as `Authorization`.",
      },
    ],
  },
};
