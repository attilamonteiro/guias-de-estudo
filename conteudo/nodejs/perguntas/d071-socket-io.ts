import type { Pergunta } from "../../tipos";

// D71 · Socket.IO
export const d071: Pergunta = {
  numero: 371,
  modulo: "devinterview-integracoes",
  metodo: "compare",
  pt: {
    titulo: "Socket.IO",
    pergunta: "O que é o Socket.IO e como ele funciona com o Node.js?",
    porqueEsteMetodo:
      "O Socket.IO costuma ser confundido com WebSocket, e a diferença está nos recursos que ele soma e no protocolo que ele impõe. A matriz contra o `ws` puro mostra o que você ganha e o que paga.",
    resposta30s:
      "O **Socket.IO** é uma biblioteca de tempo real que usa **WebSocket**, com **long polling** como alternativa de reserva, e acrescenta **reconexão automática**, **eventos nomeados**, **confirmações (acks)**, **salas e namespaces** e um **adaptador** (como o Redis) para vários servidores. Não é WebSocket puro: ele tem **protocolo próprio**, então um cliente `ws` simples não conversa com um servidor Socket.IO, nem o contrário. Use-o quando você controla os dois lados e quer esses recursos prontos; use `ws` quando precisa do protocolo padrão ou do mínimo de camada.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "ws puro x Socket.IO",
        colunas: ["Aspecto", "ws (WebSocket puro)", "Socket.IO"],
        linhas: [
          [
            "Protocolo",
            "WebSocket padrão: qualquer cliente WebSocket (navegador, app, outra linguagem) conversa com ele",
            "Protocolo próprio da biblioteca, sobre WebSocket ou long polling: só clientes Socket.IO conversam com ele",
          ],
          [
            "Transporte de reserva",
            "Nenhum: se o WebSocket não passar, não há conexão",
            "Pode começar por HTTP long polling e subir para WebSocket quando possível",
          ],
          [
            "Reconexão e heartbeat",
            "Você implementa (ping, espera crescente, retomada)",
            "Reconexão automática com espera crescente e detecção de queda embutidas",
          ],
          [
            "Mensagens",
            "Fluxo de mensagens de texto ou binárias; você define o formato (por exemplo, JSON com um campo `tipo`)",
            "Eventos nomeados (`emit` e `on`) com dados serializáveis e confirmação (ack) por evento",
          ],
          [
            "Salas e namespaces",
            "Você implementa (mapas de conexões por sala)",
            "`join`, `to(sala).emit` e namespaces para separar áreas da aplicação",
          ],
          [
            "Vários servidores",
            "Você publica em um canal compartilhado (veja D54)",
            "Um adaptador (por exemplo, Redis) leva o broadcast a todas as instâncias; com long polling, sticky sessions",
          ],
          [
            "Peso",
            "Pequeno e fácil de entender por inteiro",
            "Mais código e uma camada própria de protocolo; cliente e servidor precisam ser compatíveis entre versões",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Salas, evento nomeado e ack",
        legenda: "JavaScript",
        codigo: `// Servidor
import { Server } from "socket.io";

const io = new Server(3000, { cors: { origin: "https://app.exemplo.com" } });

io.on("connection", (socket) => {
  socket.on("entrar", (sala) => socket.join(sala));
  socket.on("mensagem", ({ sala, texto }, confirmar) => {
    io.to(sala).emit("mensagem", { de: socket.id, texto }); // broadcast para a sala
    confirmar?.({ ok: true }); // ack: resposta ao emissor
  });
});

// Cliente (navegador ou Node), com o pacote socket.io-client
import { io as conectar } from "socket.io-client";

const socket = conectar("https://chat.exemplo.com");
socket.emit("entrar", "geral");
socket.emit("mensagem", { sala: "geral", texto: "oi" }, (resposta) => console.log(resposta.ok));
socket.on("mensagem", (m) => console.log(m.de, m.texto));`,
        nota: "Servidor e cliente ficam em projetos diferentes; estão juntos aqui só para comparar. Confira a documentação do Socket.IO para a API da versão que você instalar.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Escolha **Socket.IO** quando você controla cliente e servidor e quer salas, acks, reconexão e alternativa de reserva prontos, em vez de reconstruí-los. Escolha **`ws`** (ou o WebSocket nativo) quando precisa do protocolo padrão, com clientes de terceiros, dispositivos, apps nativos ou outros serviços, ou do mínimo possível de camada. O básico de conexão, quadros e heartbeat (veja D54) vale para os dois.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não é WebSocket puro",
        texto:
          "Um `new WebSocket(...)` do navegador, ou um cliente `ws`, não conversa com um servidor Socket.IO; do outro lado, use o `socket.io-client`. Autentique na conexão (middleware `io.use` lendo `socket.handshake.auth`), configure o CORS e valide cada evento recebido. Com várias instâncias, use o adaptador e, havendo long polling, sticky sessions. Confira na documentação a compatibilidade entre as versões do cliente e do servidor.",
      },
    ],
    armadilhas: [
      "Conectar um cliente WebSocket comum (ou `ws`) a um servidor Socket.IO, ou o contrário: o protocolo é diferente e a conexão não funciona.",
      "Subir várias instâncias sem adaptador (e sem sticky sessions quando há long polling): o broadcast só alcança quem está no mesmo processo e as requisições da mesma sessão caem em instâncias diferentes.",
      "Tratar o ack como prova de que o usuário final recebeu ou leu: ele é a resposta do outro lado da conexão; o que precisa sobreviver deve ir para um banco.",
      "Aceitar qualquer conexão e qualquer evento: autentique no handshake e valide cada payload.",
    ],
    autoteste: [
      {
        pergunta: "Por que um cliente `ws` simples não conversa com um servidor Socket.IO?",
        resposta:
          "Porque o Socket.IO não é só WebSocket: ele coloca um protocolo próprio por cima (pacotes com tipo de evento, ids de ack, handshake de sessão e transporte de reserva). Os dois lados precisam usar a biblioteca.",
      },
      {
        pergunta: "O que faz o adaptador do Socket.IO com Redis?",
        resposta:
          "Replica os broadcasts entre instâncias: quando um servidor emite para uma sala, o adaptador publica no Redis e os outros servidores repassam a mensagem aos clientes que estão conectados neles.",
      },
    ],
  },
  en: {
    titulo: "Socket.IO",
    pergunta: "What is Socket.IO and how does it work with Node.js?",
    porqueEsteMetodo:
      "Socket.IO is often confused with WebSocket, and the difference lies in the features it adds and the protocol it imposes. The matrix against plain `ws` shows what you gain and what you pay.",
    resposta30s:
      "**Socket.IO** is a real-time library that uses **WebSocket**, with **long polling** as a fallback, and adds **automatic reconnection**, **named events**, **acknowledgements (acks)**, **rooms and namespaces** and an **adapter** (such as Redis) for multiple servers. It is not plain WebSocket: it has its **own protocol**, so a simple `ws` client does not talk to a Socket.IO server, nor the other way around. Use it when you control both sides and want those features ready-made; use `ws` when you need the standard protocol or the thinnest possible layer.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Plain ws vs Socket.IO",
        colunas: ["Aspect", "ws (plain WebSocket)", "Socket.IO"],
        linhas: [
          [
            "Protocol",
            "Standard WebSocket: any WebSocket client (browser, app, another language) can talk to it",
            "The library’s own protocol, over WebSocket or long polling: only Socket.IO clients can talk to it",
          ],
          [
            "Fallback transport",
            "None: if WebSocket does not get through, there is no connection",
            "Can start with HTTP long polling and move up to WebSocket when possible",
          ],
          [
            "Reconnection and heartbeat",
            "You implement it (ping, growing waits, resumption)",
            "Automatic reconnection with growing waits and drop detection built in",
          ],
          [
            "Messages",
            "A stream of text or binary messages; you define the format (for example, JSON with a `type` field)",
            "Named events (`emit` and `on`) with serializable data and an acknowledgement (ack) per event",
          ],
          [
            "Rooms and namespaces",
            "You implement it (maps of connections per room)",
            "`join`, `to(room).emit` and namespaces to separate areas of the application",
          ],
          [
            "Multiple servers",
            "You publish to a shared channel (see D54)",
            "An adapter (for example, Redis) carries the broadcast to every instance; with long polling, sticky sessions",
          ],
          [
            "Weight",
            "Small and easy to understand in full",
            "More code and a protocol layer of its own; client and server must be compatible across versions",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Rooms, a named event and an ack",
        legenda: "JavaScript",
        codigo: `// Server
import { Server } from "socket.io";

const io = new Server(3000, { cors: { origin: "https://app.example.com" } });

io.on("connection", (socket) => {
  socket.on("join", (room) => socket.join(room));
  socket.on("message", ({ room, text }, confirm) => {
    io.to(room).emit("message", { from: socket.id, text }); // broadcast to the room
    confirm?.({ ok: true }); // ack: answer to the sender
  });
});

// Client (browser or Node), with the socket.io-client package
import { io as connect } from "socket.io-client";

const socket = connect("https://chat.example.com");
socket.emit("join", "general");
socket.emit("message", { room: "general", text: "hi" }, (reply) => console.log(reply.ok));
socket.on("message", (m) => console.log(m.from, m.text));`,
        nota: "Server and client live in different projects; they sit together here only for comparison. Check the Socket.IO documentation for the API of the version you install.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Choose **Socket.IO** when you control client and server and want rooms, acks, reconnection and a fallback ready-made, instead of rebuilding them. Choose **`ws`** (or native WebSocket) when you need the standard protocol, with third-party clients, devices, native apps or other services, or the thinnest possible layer. The basics of connection, frames and heartbeat (see D54) apply to both.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "It is not plain WebSocket",
        texto:
          "A browser `new WebSocket(...)`, or a `ws` client, does not talk to a Socket.IO server; on the other side, use `socket.io-client`. Authenticate on connection (an `io.use` middleware reading `socket.handshake.auth`), configure CORS and validate every event received. With several instances, use the adapter and, where long polling is in play, sticky sessions. Check the documentation for compatibility between client and server versions.",
      },
    ],
    armadilhas: [
      "Connecting a regular WebSocket client (or `ws`) to a Socket.IO server, or the other way around: the protocol is different and the connection does not work.",
      "Running several instances without an adapter (and without sticky sessions when long polling is used): the broadcast only reaches those in the same process, and requests from the same session land on different instances.",
      "Treating the ack as proof that the end user received or read the message: it is the answer from the other end of the connection; whatever must survive should go to a database.",
      "Accepting any connection and any event: authenticate in the handshake and validate every payload.",
    ],
    autoteste: [
      {
        pergunta: "Why does a simple `ws` client not talk to a Socket.IO server?",
        resposta:
          "Because Socket.IO is not just WebSocket: it layers its own protocol on top (packets with an event type, ack ids, a session handshake and a fallback transport). Both sides have to use the library.",
      },
      {
        pergunta: "What does the Socket.IO Redis adapter do?",
        resposta:
          "It replicates broadcasts across instances: when one server emits to a room, the adapter publishes to Redis and the other servers relay the message to the clients connected to them.",
      },
    ],
  },
};
