import type { Pergunta } from "../../tipos";

// P77 · Polling, long polling, SSE e WebSockets
export const p077: Pergunta = {
  numero: 777,
  modulo: "pawanmkr-desempenho",
  metodo: "compare",
  pt: {
    titulo: "Polling, long polling, SSE e WebSockets",
    pergunta: "Compare polling, long polling, Server-Sent Events e WebSockets.",
    porqueEsteMetodo:
      "As quatro técnicas resolvem o mesmo problema (o cliente saber o que acontece no servidor) com custos diferentes. Uma matriz lado a lado, fechada por uma regra de decisão, mostra o que cada uma ganha e o que perde.",
    resposta30s:
      "Todas levam novidades do servidor ao cliente, em níveis crescentes de tempo real: o **polling** pergunta de tempos em tempos, o **long polling** deixa a pergunta pendente até haver resposta, o **SSE** mantém uma conexão HTTP aberta por onde o servidor empurra eventos (**um sentido**, com reconexão automática no `EventSource`) e o **WebSocket** abre um canal **bidirecional** de baixa latência. Se só o servidor empurra, prefira SSE; se os dois lados falam, WebSocket; polling e long polling servem a casos simples, legados ou ambientes restritos.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "As quatro técnicas lado a lado",
        colunas: ["Aspecto", "Polling", "Long polling", "SSE", "WebSocket"],
        linhas: [
          [
            "Direção",
            "O cliente pergunta e o servidor responde",
            "O mesmo, mas a resposta espera haver dado",
            "Um sentido: do servidor para o cliente (o cliente envia por requisições comuns)",
            "Dois sentidos, a qualquer momento",
          ],
          [
            "Conexão",
            "Curtas e repetidas",
            "Uma requisição pendente por vez, reaberta a cada resposta",
            "Uma conexão HTTP longa e aberta",
            "Uma conexão longa, iniciada por um handshake HTTP, com protocolo próprio",
          ],
          ["Latência", "Até um intervalo de espera", "Baixa, mais o tempo de reabrir a requisição", "Baixa", "Baixa"],
          [
            "Custo no servidor",
            "Muitas requisições (cabeçalhos, autenticação) mesmo sem novidade",
            "Uma conexão pendente por cliente e reaberturas frequentes",
            "Uma conexão aberta por cliente",
            "Uma conexão aberta por cliente, mais o estado de cada conexão",
          ],
          [
            "Navegadores e proxies",
            "Funciona em qualquer lugar",
            "Funciona em qualquer lugar, mas sofre com proxies que cortam requisições pendentes",
            "`EventSource` nos navegadores; um proxy que guarda a resposta em buffer atrasa os eventos",
            "API `WebSocket` nos navegadores; alguns proxies e firewalls barram o handshake",
          ],
          [
            "Balanceadores, timeouts e HTTP/2",
            "Sem problema: requisições curtas, e o cache condicional (`ETag`, `304`) ajuda",
            "Responda antes do timeout de ociosidade do balanceador e reabra",
            "Envie um batimento (comentário ou evento) para a conexão não ser cortada; o HTTP/2 multiplexa e alivia o limite de conexões por origem do HTTP/1.1",
            "Ajuste o timeout do balanceador e use ping/pong; o suporte a WebSocket sobre HTTP/2 varia, então confira o seu proxy",
          ],
          [
            "Reconexão",
            "É o próprio laço do cliente",
            "O cliente reabre a cada resposta",
            "Automática no `EventSource`, que reenvia `Last-Event-ID` para retomar",
            "Por sua conta, ou por biblioteca (como o Socket.IO; veja D71)",
          ],
          [
            "Formato dos dados",
            "Qualquer, inclusive binário (HTTP comum)",
            "Qualquer, inclusive binário",
            "Só texto (UTF-8); binário exige codificação",
            "Texto e binário",
          ],
          [
            "Uso típico",
            "Status que muda devagar, tarefas sem urgência, sistemas legados",
            "Notificações quando SSE e WebSocket não são possíveis",
            "Notificações, painéis ao vivo, progresso de tarefas, feeds",
            "Chat, jogos, edição colaborativa e qualquer interação bidirecional",
          ],
        ],
        nota: "Para WebSockets em detalhe, veja D54.",
      },
      {
        tipo: "codigo",
        titulo: "SSE em um servidor Express",
        legenda: "JavaScript",
        codigo: `import express from "express";

const app = express();

app.get("/eventos", (req, res) => {
  res.set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache" });
  res.flushHeaders();

  const timer = setInterval(() => {
    res.write("event: progresso\\ndata: " + JSON.stringify({ em: Date.now() }) + "\\n\\n");
  }, 1000);

  req.on("close", () => clearInterval(timer)); // o cliente saiu: limpe o que ficou rodando
});`,
        nota: "No navegador, `new EventSource('/eventos')` e um ouvinte para `progresso` bastam; ele reconecta sozinho. O formato é texto: linhas `event:` e `data:` e uma linha em branco para fechar cada evento. Para retomar após uma queda, o servidor precisa guardar eventos recentes com `id:` e ler o `Last-Event-ID`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Só o servidor empurra (notificações, progresso, painel)? **SSE**: HTTP comum e reconexão pronta. Os dois lados falam com baixa latência (chat, jogo, edição colaborativa)? **WebSocket**. Ambiente que não aceita conexões longas, ou cliente legado? **Long polling**. A informação muda pouco e uma latência de alguns segundos serve? **Polling** com intervalo e cache condicional.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Conexão longa tem custo",
        texto:
          "SSE, long polling e WebSocket mantêm uma conexão aberta por cliente: contam descritores e memória, pedem batimento para não serem cortadas por balanceadores, exigem cuidado com o cliente lento (`write()` devolvendo `false` pede backpressure) e precisam de um canal entre instâncias para o evento chegar ao cliente certo. O modelo orientado a eventos do Node.js combina com muitas conexões ociosas, mas o limite real depende de memória, descritores e carga: meça. Compressão e proxies com buffer atrasam o SSE, e o `EventSource` só faz `GET` e não aceita cabeçalhos personalizados (autentique por cookie, por exemplo).",
      },
    ],
    armadilhas: [
      "Escolher WebSocket por reflexo quando só o servidor empurra dados: o SSE entrega com menos estado, reconexão pronta e HTTP comum.",
      "Polling agressivo sem cache condicional: carga constante no servidor mesmo sem novidade. Use intervalos maiores com `ETag` e `304`, ou migre para SSE.",
      "Esquecer a limpeza quando o cliente sai (timers, ouvintes, assinaturas): a conexão fecha e o servidor continua trabalhando para ninguém, até esgotar a memória.",
      "Ignorar a infraestrutura no caminho: proxy com buffer, timeout de ociosidade do balanceador sem batimento e várias instâncias sem canal compartilhado fazem o evento atrasar, a conexão cair ou o evento nunca chegar.",
    ],
    autoteste: [
      {
        pergunta:
          "Um painel mostra o progresso de um processamento que roda no servidor. Qual técnica escolher e por quê?",
        resposta:
          "SSE: só o servidor empurra atualizações, o HTTP comum e o `EventSource` já trazem a reconexão, e há menos estado que num WebSocket. O polling serviria se a atualização fosse rara.",
      },
      {
        pergunta: "Em que o long polling difere do polling simples?",
        resposta:
          "No polling o servidor responde na hora, mesmo sem novidade; no long polling a requisição fica pendente até haver dado ou até um timeout. A latência cai e há menos respostas vazias, ao custo de uma conexão pendente por cliente e de uma reabertura a cada resposta.",
      },
    ],
  },
  en: {
    titulo: "Polling, long polling, SSE and WebSockets",
    pergunta: "Compare polling, long polling, Server-Sent Events, and WebSockets.",
    porqueEsteMetodo:
      "The four techniques solve the same problem (the client learning what happens on the server) at different costs. A side-by-side matrix, closed by a decision rule, shows what each one gains and what it gives up.",
    resposta30s:
      "All of them bring news from the server to the client, in increasing levels of real time: **polling** asks every so often, **long polling** leaves the question pending until there is an answer, **SSE** keeps an HTTP connection open through which the server pushes events (**one direction**, with automatic reconnection in `EventSource`) and **WebSocket** opens a low-latency **bidirectional** channel. If only the server pushes, prefer SSE; if both sides talk, WebSocket; polling and long polling suit simple cases, legacy clients or restricted environments.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The four techniques side by side",
        colunas: ["Aspect", "Polling", "Long polling", "SSE", "WebSocket"],
        linhas: [
          [
            "Direction",
            "The client asks and the server answers",
            "The same, but the answer waits until there is data",
            "One way: server to client (the client sends through ordinary requests)",
            "Two ways, at any moment",
          ],
          [
            "Connection",
            "Short and repeated",
            "One pending request at a time, reopened after each answer",
            "One long, open HTTP connection",
            "One long connection, started by an HTTP handshake, with its own protocol",
          ],
          ["Latency", "Up to one waiting interval", "Low, plus the time to reopen the request", "Low", "Low"],
          [
            "Server cost",
            "Many requests (headers, authentication) even with no news",
            "One pending connection per client and frequent reopenings",
            "One open connection per client",
            "One open connection per client, plus the state of each connection",
          ],
          [
            "Browsers and proxies",
            "Works everywhere",
            "Works everywhere, but suffers with proxies that cut pending requests",
            "`EventSource` in browsers; a proxy that buffers the response delays the events",
            "`WebSocket` API in browsers; some proxies and firewalls block the handshake",
          ],
          [
            "Load balancers, timeouts and HTTP/2",
            "No problem: short requests, and conditional caching (`ETag`, `304`) helps",
            "Answer before the load balancer’s idle timeout and reopen",
            "Send a heartbeat (comment or event) so the connection is not cut; HTTP/2 multiplexes and eases the per-origin connection limit of HTTP/1.1",
            "Tune the load balancer timeout and use ping/pong; WebSocket over HTTP/2 support varies, so check your proxy",
          ],
          [
            "Reconnection",
            "It is the client’s own loop",
            "The client reopens after each answer",
            "Automatic in `EventSource`, which resends `Last-Event-ID` to resume",
            "On your own, or through a library (such as Socket.IO; see D71)",
          ],
          [
            "Data format",
            "Anything, including binary (plain HTTP)",
            "Anything, including binary",
            "Text only (UTF-8); binary needs encoding",
            "Text and binary",
          ],
          [
            "Typical use",
            "Slow-changing status, non-urgent tasks, legacy systems",
            "Notifications when SSE and WebSocket are not possible",
            "Notifications, live dashboards, task progress, feeds",
            "Chat, games, collaborative editing and any bidirectional interaction",
          ],
        ],
        nota: "For WebSockets in detail, see D54.",
      },
      {
        tipo: "codigo",
        titulo: "SSE in an Express server",
        legenda: "JavaScript",
        codigo: `import express from "express";

const app = express();

app.get("/events", (req, res) => {
  res.set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache" });
  res.flushHeaders();

  const timer = setInterval(() => {
    res.write("event: progress\\ndata: " + JSON.stringify({ at: Date.now() }) + "\\n\\n");
  }, 1000);

  req.on("close", () => clearInterval(timer)); // the client left: clean up what kept running
});`,
        nota: "In the browser, `new EventSource('/events')` and a listener for `progress` are enough; it reconnects by itself. The format is text: `event:` and `data:` lines and a blank line to close each event. To resume after a drop, the server must keep recent events with `id:` and read the `Last-Event-ID`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Only the server pushes (notifications, progress, dashboards)? **SSE**: plain HTTP and reconnection built in. Both sides talk with low latency (chat, games, collaborative editing)? **WebSocket**. An environment that does not accept long connections, or a legacy client? **Long polling**. The data changes little and a few seconds of latency is fine? **Polling** with an interval and conditional caching.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A long connection has a cost",
        texto:
          "SSE, long polling and WebSocket keep one open connection per client: they use up descriptors and memory, need a heartbeat so load balancers do not cut them, call for care with slow clients (`write()` returning `false` calls for backpressure) and need a channel between instances so the event reaches the right client. Node.js’s event-driven model suits many idle connections, but the real limit depends on memory, descriptors and load: measure. Compression and buffering proxies delay SSE, and `EventSource` only does `GET` and does not accept custom headers (authenticate with a cookie, for example).",
      },
    ],
    armadilhas: [
      "Choosing WebSocket by reflex when only the server pushes data: SSE delivers it with less state, built-in reconnection and plain HTTP.",
      "Aggressive polling with no conditional caching: constant server load even with no news. Use longer intervals with `ETag` and `304`, or move to SSE.",
      "Forgetting cleanup when the client leaves (timers, listeners, subscriptions): the connection closes and the server keeps working for nobody, until memory runs out.",
      "Ignoring the infrastructure in the path: a buffering proxy, a load balancer idle timeout with no heartbeat and several instances with no shared channel make the event late, the connection drop or the event never arrive.",
    ],
    autoteste: [
      {
        pergunta:
          "A dashboard shows the progress of a job running on the server. Which technique do you pick, and why?",
        resposta:
          "SSE: only the server pushes updates, plain HTTP and `EventSource` already give you reconnection, and there is less state than with a WebSocket. Polling would do if updates were rare.",
      },
      {
        pergunta: "How does long polling differ from plain polling?",
        resposta:
          "With polling the server answers right away, even with no news; with long polling the request stays pending until there is data or a timeout. Latency drops and there are fewer empty responses, at the cost of a pending connection per client and a reopening after each answer.",
      },
    ],
  },
};
