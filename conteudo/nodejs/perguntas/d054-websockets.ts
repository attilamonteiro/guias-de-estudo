import type { Pergunta } from "../../tipos";

// D54 · WebSockets
export const d054: Pergunta = {
  numero: 354,
  modulo: "devinterview-seguranca-e-implantacao",
  metodo: "trace",
  pt: {
    titulo: "WebSockets",
    pergunta: "O que são WebSockets e como funcionam com o Node.js?",
    porqueEsteMetodo:
      "WebSocket só faz sentido acompanhando uma conexão do começo ao fim: o handshake que muda de protocolo, as mensagens, o broadcast e o que acontece quando a conexão cai. O caminho de uma mensagem de chat mostra tudo isso na ordem em que acontece.",
    resposta30s:
      "O WebSocket transforma uma conexão HTTP em um canal **persistente e full-duplex**: o cliente pede um `Upgrade`, o servidor responde `101` e, depois disso, os dois lados trocam mensagens a qualquer momento, sem novo pedido. No Node.js você sobe o servidor com a biblioteca `ws` (eventos `connection`, `message` e `close`), e no navegador usa `new WebSocket(url)`. Em produção, autentique no upgrade, limite o tamanho das mensagens, use heartbeat e reconexão e, com várias instâncias, um canal compartilhado como o Redis pub/sub.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma mensagem de chat, do handshake à queda",
        etapas: [
          'O navegador executa `new WebSocket("wss://chat.exemplo.com")` e envia um `GET` HTTP comum com `Upgrade: websocket`, `Connection: Upgrade` e uma `Sec-WebSocket-Key` (mais o `Origin` e os cookies do site)',
          "O servidor Node recebe o pedido no evento `upgrade` do servidor HTTP (a `ws` cuida disso). É aqui que se confere a origem e a autenticação; estando tudo certo, ele responde `101 Switching Protocols` com um `Sec-WebSocket-Accept` derivado da chave",
          "A mesma conexão TCP deixa de falar HTTP e passa a falar WebSocket: **persistente e full-duplex**, com mensagens em **quadros** (frames) de texto, binário e controle (ping, pong, close). No servidor dispara o evento `connection`, que entrega o objeto do socket",
          "A envia “oi”: um quadro de texto chega ao servidor e dispara `message` naquele socket. O servidor valida (tamanho, formato, permissão) e percorre os outros sockets abertos, chamando `send` em cada um",
          "Nos navegadores dos outros usuários, `onmessage` recebe o texto. Não houve novo pedido HTTP nem cabeçalhos repetidos: o servidor falou quando quis",
          "De tempos em tempos o servidor manda um `ping`, e o navegador responde `pong` sozinho. Sem resposta, a conexão é considerada morta e encerrada",
          "A fecha a aba: normalmente é enviado um quadro `close` (com código e motivo) e o servidor dispara `close`; se a rede cai sem aviso, o servidor só percebe pela falta de `pong` ou pelo tempo limite do TCP. Nos dois casos, limpe o estado (presença, salas) e deixe o cliente reconectar com espera crescente",
        ],
        nota: "Para o servidor, cada conexão é um objeto na memória daquele processo. Isso é o que complica a escala (veja os passos abaixo). As perguntas “como montar um servidor WebSocket” e “como implementar comunicação WebSocket” são respondidas por este caminho e pelo código a seguir.",
      },
      {
        tipo: "codigo",
        titulo: "Servidor com a biblioteca ws: broadcast e heartbeat",
        legenda: "JavaScript",
        codigo: `import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080, maxPayload: 64 * 1024 }); // limita cada mensagem

wss.on("connection", (socket) => {
  socket.isAlive = true;
  socket.on("pong", () => (socket.isAlive = true)); // resposta ao ping
  socket.on("message", (dados) => {
    for (const outro of wss.clients) if (outro.readyState === WebSocket.OPEN) outro.send(dados.toString());
  });
  socket.on("close", () => console.log("saiu")); // limpe presença, salas, assinaturas
});

setInterval(() => {
  for (const s of wss.clients) {
    if (!s.isAlive) s.terminate(); // não respondeu ao ping da rodada anterior
    else { s.isAlive = false; s.ping(); }
  }
}, 30_000);`,
        nota: "No navegador, o cliente é `const ws = new WebSocket(url)` com `ws.onopen`, `ws.onmessage` (o texto está em `event.data`), `ws.send(texto)` e `ws.onclose`. Confira a documentação da `ws` para a API da versão que você instalar.",
      },
      {
        tipo: "passos",
        titulo: "Onde o caminho quebra, e o conserto",
        passos: [
          {
            titulo: "Quem está se conectando?",
            texto:
              "O `WebSocket` do navegador não permite cabeçalhos próprios. Autentique no `upgrade`, antes de aceitar a conexão (na `ws`, com `noServer: true` e `handleUpgrade`): use o cookie de sessão, conferindo o `Origin` contra sequestro entre sites, ou um ticket de uso único e vida curta, em vez de um token longo na URL, que vai parar em logs. Recuse com 401 ou 403 sem completar o handshake.",
          },
          {
            titulo: "Mensagem grande ou abusiva",
            texto:
              "Limite o tamanho de cada mensagem (`maxPayload`), a taxa por conexão e o número de conexões por usuário. Valide cada mensagem como qualquer entrada externa.",
          },
          {
            titulo: "Conexão morta e cliente lento",
            texto:
              "Redes, NATs e balanceadores derrubam conexões ociosas em silêncio: use heartbeat. Um cliente lento acumula dados no buffer de saída: observe `bufferedAmount`, e pare de enviar, descarte ou desconecte em vez de deixar a memória crescer (backpressure).",
          },
          {
            titulo: "Reconexão",
            texto:
              "O `WebSocket` do navegador não reconecta sozinho. O cliente reconecta com espera crescente e jitter e, ao voltar, pede o que perdeu (por exemplo, a partir do último id recebido), porque nada do que foi enviado durante a queda chega.",
          },
          {
            titulo: "Vários processos e proxies",
            texto:
              "Cada processo conhece só as suas conexões. Para o broadcast alcançar todos, publique em um canal compartilhado (Redis pub/sub ou um broker) que cada instância assina e repassa aos seus sockets. Sticky sessions só são necessárias se o protocolo faz vários pedidos HTTP antes do upgrade (o caso do Socket.IO, veja D71) ou se há estado só em memória. Proxy e balanceador precisam repassar `Upgrade` e `Connection` e ter timeout de ociosidade maior que o intervalo do heartbeat.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Quando usar WebSocket",
        texto:
          "Use quando **os dois lados precisam falar a qualquer momento**, com baixa latência (chat, jogos, cotações ao vivo, edição colaborativa). Se só o servidor empurra dados, Server-Sent Events costumam bastar; se as atualizações são raras, uma requisição comum ou polling resolve. WebSocket mantém **uma conexão aberta por cliente**, então a capacidade do servidor passa a ser medida em conexões simultâneas, não só em requisições por segundo. Em produção, use `wss://` (com TLS).",
      },
    ],
    armadilhas: [
      "Autenticar só depois de aceitar a conexão, ou confiar no cookie sem conferir o `Origin`: qualquer site pode abrir a conexão em nome do usuário.",
      "Não ter heartbeat: conexões mortas parecem abertas, acumulam e consomem memória e descritores.",
      "Enviar sem olhar a fila de saída (`bufferedAmount`): um único cliente lento pode fazer o servidor crescer em memória.",
      "Guardar salas e usuários só na memória de um processo quando há várias instâncias: quem está em outra instância não recebe o broadcast.",
    ],
    autoteste: [
      {
        pergunta: "O que significa a resposta `101` e o que muda depois dela?",
        resposta:
          "`101 Switching Protocols` aceita o `Upgrade`: a mesma conexão TCP deixa de falar HTTP e passa a falar WebSocket, persistente e full-duplex, em que cliente e servidor enviam quadros a qualquer momento.",
      },
      {
        pergunta: "Por que um broadcast em memória deixa de funcionar com duas instâncias, e como resolver?",
        resposta:
          "Cada instância só tem as conexões dela, então um `send` em loop não alcança os clientes da outra. A solução é publicar a mensagem em um canal compartilhado (Redis pub/sub, um broker) que todas as instâncias assinam e repassam aos seus sockets.",
      },
    ],
  },
  en: {
    titulo: "WebSockets",
    pergunta: "What are WebSockets and how do they work with Node.js?",
    porqueEsteMetodo:
      "WebSocket only makes sense when you follow a connection from start to finish: the handshake that switches protocols, the messages, the broadcast and what happens when the connection drops. The path of one chat message shows all of this in the order it happens.",
    resposta30s:
      "A WebSocket turns an HTTP connection into a **persistent, full-duplex** channel: the client asks for an `Upgrade`, the server answers `101` and, after that, both sides exchange messages at any time, with no new request. In Node.js you run the server with the `ws` library (`connection`, `message` and `close` events), and in the browser you use `new WebSocket(url)`. In production, authenticate on upgrade, cap message size, use heartbeat and reconnection and, with several instances, a shared channel such as Redis pub/sub.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One chat message, from handshake to disconnect",
        etapas: [
          'The browser runs `new WebSocket("wss://chat.example.com")` and sends an ordinary HTTP `GET` with `Upgrade: websocket`, `Connection: Upgrade` and a `Sec-WebSocket-Key` (plus the `Origin` and the site’s cookies)',
          "The Node server receives the request on the HTTP server’s `upgrade` event (`ws` handles it). This is where origin and authentication are checked; if all is well, it answers `101 Switching Protocols` with a `Sec-WebSocket-Accept` derived from the key",
          "The same TCP connection stops speaking HTTP and starts speaking WebSocket: **persistent and full-duplex**, with messages in **frames** of text, binary and control kinds (ping, pong, close). On the server the `connection` event fires and hands over the socket object",
          "A sends “hi”: a text frame reaches the server and fires `message` on that socket. The server validates (size, format, permission) and walks the other open sockets, calling `send` on each one",
          "In the other users’ browsers, `onmessage` receives the text. There was no new HTTP request and no repeated headers: the server spoke when it wanted to",
          "From time to time the server sends a `ping`, and the browser answers `pong` by itself. With no answer, the connection is considered dead and closed",
          "A closes the tab: normally a `close` frame (with code and reason) is sent and the server fires `close`; if the network drops with no warning, the server only notices through the missing `pong` or the TCP timeout. Either way, clean up state (presence, rooms) and let the client reconnect with growing waits",
        ],
        nota: "To the server, each connection is an object in that process’s memory. That is what complicates scaling (see the steps below). The questions “how do you set up a WebSocket server” and “how do you implement WebSocket communication” are answered by this path and the code that follows.",
      },
      {
        tipo: "codigo",
        titulo: "Server with the ws library: broadcast and heartbeat",
        legenda: "JavaScript",
        codigo: `import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080, maxPayload: 64 * 1024 }); // caps each message

wss.on("connection", (socket) => {
  socket.isAlive = true;
  socket.on("pong", () => (socket.isAlive = true)); // answer to the ping
  socket.on("message", (data) => {
    for (const other of wss.clients) if (other.readyState === WebSocket.OPEN) other.send(data.toString());
  });
  socket.on("close", () => console.log("left")); // clean up presence, rooms, subscriptions
});

setInterval(() => {
  for (const s of wss.clients) {
    if (!s.isAlive) s.terminate(); // did not answer the previous round's ping
    else { s.isAlive = false; s.ping(); }
  }
}, 30_000);`,
        nota: "In the browser, the client is `const ws = new WebSocket(url)` with `ws.onopen`, `ws.onmessage` (the text is in `event.data`), `ws.send(text)` and `ws.onclose`. Check the `ws` documentation for the API of the version you install.",
      },
      {
        tipo: "passos",
        titulo: "Where the path breaks, and the fix",
        passos: [
          {
            titulo: "Who is connecting?",
            texto:
              "The browser’s `WebSocket` does not allow custom headers. Authenticate on `upgrade`, before accepting the connection (in `ws`, with `noServer: true` and `handleUpgrade`): use the session cookie, checking the `Origin` against cross-site hijacking, or a single-use, short-lived ticket instead of a long token in the URL, which ends up in logs. Refuse with 401 or 403 without completing the handshake.",
          },
          {
            titulo: "Large or abusive messages",
            texto:
              "Cap the size of each message (`maxPayload`), the rate per connection and the number of connections per user. Validate each message like any external input.",
          },
          {
            titulo: "Dead connections and slow clients",
            texto:
              "Networks, NATs and load balancers silently drop idle connections: use a heartbeat. A slow client piles data up in the send buffer: watch `bufferedAmount`, and stop sending, drop or disconnect instead of letting memory grow (backpressure).",
          },
          {
            titulo: "Reconnection",
            texto:
              "The browser’s `WebSocket` does not reconnect by itself. The client reconnects with growing waits and jitter and, once back, asks for what it missed (for example, from the last id received), because nothing sent during the outage arrives.",
          },
          {
            titulo: "Several processes and proxies",
            texto:
              "Each process knows only its own connections. For a broadcast to reach everyone, publish to a shared channel (Redis pub/sub or a broker) that every instance subscribes to and relays to its sockets. Sticky sessions are only needed if the protocol makes several HTTP requests before the upgrade (the Socket.IO case, see D71) or if there is state held only in memory. The proxy and load balancer must forward `Upgrade` and `Connection` and have an idle timeout longer than the heartbeat interval.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "When to use WebSocket",
        texto:
          "Use it when **both sides need to talk at any moment**, with low latency (chat, games, live quotes, collaborative editing). If only the server pushes data, Server-Sent Events are often enough; if updates are rare, an ordinary request or polling does the job. A WebSocket keeps **one open connection per client**, so server capacity is now measured in simultaneous connections, not only requests per second. In production, use `wss://` (with TLS).",
      },
    ],
    armadilhas: [
      "Authenticating only after accepting the connection, or trusting the cookie without checking the `Origin`: any site can open the connection on the user’s behalf.",
      "Having no heartbeat: dead connections look open, pile up and consume memory and descriptors.",
      "Sending without looking at the send queue (`bufferedAmount`): a single slow client can make the server grow in memory.",
      "Keeping rooms and users only in one process’s memory when there are several instances: whoever is on another instance does not get the broadcast.",
    ],
    autoteste: [
      {
        pergunta: "What does the `101` response mean and what changes after it?",
        resposta:
          "`101 Switching Protocols` accepts the `Upgrade`: the same TCP connection stops speaking HTTP and starts speaking WebSocket, persistent and full-duplex, where client and server send frames at any time.",
      },
      {
        pergunta: "Why does an in-memory broadcast stop working with two instances, and how do you fix it?",
        resposta:
          "Each instance only has its own connections, so a `send` loop does not reach the other instance’s clients. The fix is to publish the message to a shared channel (Redis pub/sub, a broker) that all instances subscribe to and relay to their sockets.",
      },
    ],
  },
};
