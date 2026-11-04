import type { Pergunta } from "../../tipos";

// R04 · Ciclo requisição/resposta HTTP
export const r04: Pergunta = {
  numero: 104,
  modulo: "roadmap-iniciante",
  metodo: "trace",
  pt: {
    titulo: "Ciclo requisição/resposta HTTP",
    pergunta: "Você pode descrever um ciclo típico de requisição e resposta HTTP?",
    porqueEsteMetodo:
      "O ciclo é uma sequência de etapas que acontecem em ordem. Seguir uma única requisição, do DNS à resposta, mostra o que cada etapa faz e onde o tempo é gasto.",
    resposta30s:
      "O cliente **resolve o DNS**, abre uma **conexão TCP** (e, em HTTPS, faz o **handshake TLS**), envia a **requisição** (método, URL, versão, cabeçalhos e corpo opcional), o servidor a **processa** e devolve uma **resposta** (versão, status code, cabeçalhos e corpo opcional). A conexão pode ser mantida aberta (keep-alive) ou multiplexada (HTTP/2) para as próximas requisições.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Do clique à resposta",
        etapas: [
          "DNS: `api.exemplo.com` → endereço IP",
          "TCP: abre a conexão (porta 80, ou 443 em HTTPS)",
          "TLS: handshake e chaves (só em HTTPS)",
          "Requisição: `GET /pedidos/42` + cabeçalhos",
          "Servidor processa (auth, banco, regra)",
          "Resposta: `200 OK` + cabeçalhos + corpo",
          "Conexão reaproveitada (keep-alive) ou fechada",
        ],
      },
      {
        tipo: "tabela",
        titulo: "As partes da mensagem",
        colunas: ["", "Requisição", "Resposta"],
        linhas: [
          [
            "Primeira linha",
            "Método + caminho + versão (`GET /pedidos/42 HTTP/1.1`)",
            "Versão + status (`HTTP/1.1 200 OK`)",
          ],
          [
            "Cabeçalhos",
            "`Host`, `Authorization`, `Accept`, `Content-Type`",
            "`Content-Type`, `Cache-Control`, `Set-Cookie`",
          ],
          ["Corpo", "Opcional (`POST`, `PUT`)", "Opcional (dados, HTML, erro)"],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Famílias de status",
        colunas: ["Código", "Significado"],
        linhas: [
          ["2xx", "Sucesso (200 OK, 201 Created, 204 No Content)"],
          ["3xx", "Redirecionamento (301, 302, 304 Not Modified)"],
          ["4xx", "Erro do cliente (400, 401, 403, 404, 409, 429)"],
          ["5xx", "Erro do servidor (500, 502, 503, 504)"],
        ],
      },
    ],
    armadilhas: [
      "Confundir 401 (não autenticado) com 403 (autenticado, sem permissão).",
      "Achar que HTTP mantém sessão na conexão: HTTP é sem estado, a conexão é só transporte.",
      "Ignorar o custo de DNS + TCP + TLS: é por isso que existem keep-alive e HTTP/2.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre 401 e 403?",
        resposta:
          "401: você não está autenticado (ou o token é inválido). 403: está autenticado, mas não tem permissão.",
      },
      {
        pergunta: "Por que reaproveitar a conexão (keep-alive) ajuda?",
        resposta: "Evita repetir DNS, TCP e TLS a cada requisição, o que reduz a latência.",
      },
    ],
  },
  en: {
    titulo: "HTTP request/response cycle",
    pergunta: "Can you describe a typical HTTP request/response cycle?",
    porqueEsteMetodo:
      "The cycle is a sequence of steps that happen in order. Following a single request, from DNS to the response, shows what each step does and where time is spent.",
    resposta30s:
      "The client **resolves DNS**, opens a **TCP connection** (and, for HTTPS, does the **TLS handshake**), sends the **request** (method, URL, version, headers and optional body), the server **processes** it and returns a **response** (version, status code, headers and optional body). The connection can be kept open (keep-alive) or multiplexed (HTTP/2) for the next requests.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "From click to response",
        etapas: [
          "DNS: `api.example.com` → IP address",
          "TCP: opens the connection (port 80, or 443 for HTTPS)",
          "TLS: handshake and keys (HTTPS only)",
          "Request: `GET /orders/42` + headers",
          "Server processes (auth, database, rules)",
          "Response: `200 OK` + headers + body",
          "Connection reused (keep-alive) or closed",
        ],
      },
      {
        tipo: "tabela",
        titulo: "The parts of the message",
        colunas: ["", "Request", "Response"],
        linhas: [
          ["First line", "Method + path + version (`GET /orders/42 HTTP/1.1`)", "Version + status (`HTTP/1.1 200 OK`)"],
          [
            "Headers",
            "`Host`, `Authorization`, `Accept`, `Content-Type`",
            "`Content-Type`, `Cache-Control`, `Set-Cookie`",
          ],
          ["Body", "Optional (`POST`, `PUT`)", "Optional (data, HTML, error)"],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Status families",
        colunas: ["Code", "Meaning"],
        linhas: [
          ["2xx", "Success (200 OK, 201 Created, 204 No Content)"],
          ["3xx", "Redirection (301, 302, 304 Not Modified)"],
          ["4xx", "Client error (400, 401, 403, 404, 409, 429)"],
          ["5xx", "Server error (500, 502, 503, 504)"],
        ],
      },
    ],
    armadilhas: [
      "Confusing 401 (not authenticated) with 403 (authenticated, no permission).",
      "Thinking HTTP keeps a session on the connection: HTTP is stateless, the connection is only transport.",
      "Ignoring the cost of DNS + TCP + TLS: that is why keep-alive and HTTP/2 exist.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between 401 and 403?",
        resposta:
          "401: you are not authenticated (or the token is invalid). 403: you are authenticated but lack permission.",
      },
      {
        pergunta: "Why does reusing the connection (keep-alive) help?",
        resposta: "It avoids repeating DNS, TCP and TLS on every request, which lowers latency.",
      },
    ],
  },
};
