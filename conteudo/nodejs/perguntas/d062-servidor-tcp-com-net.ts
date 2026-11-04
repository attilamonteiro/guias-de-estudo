import type { Pergunta } from "../../tipos";

// D62 · Servidor TCP com net
export const d062: Pergunta = {
  numero: 362,
  modulo: "devinterview-avancado",
  metodo: "trace",
  pt: {
    titulo: "Servidor TCP com net",
    pergunta: "Como você pode criar um servidor TCP simples no Node.js?",
    porqueEsteMetodo:
      "Um servidor TCP é pequeno de escrever e traiçoeiro de entender: os bytes chegam em pedaços, a conexão pode cair a qualquer momento e o `socket` é um stream. Acompanhar uma conexão do início ao fim, inclusive onde ela falha, mostra tudo isso.",
    resposta30s:
      "Com o módulo **`node:net`**: `createServer` recebe um callback que roda a cada conexão, com um **`socket`** (um stream Duplex), e `listen(porta)` começa a aceitar clientes. Você lê pelo evento `data`, escreve com `socket.write` e trata `end`, `error` e `close`. O ponto central é que o **TCP é um fluxo de bytes sem fronteira de mensagem**: o que chega em um `data` pode ser metade de uma mensagem ou duas coladas, então você precisa de um **enquadramento** (delimitador, como `\\n`, ou prefixo de tamanho).",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma conexão, do connect ao close",
        etapas: [
          "O servidor chama `listen(4000)`: o sistema operacional reserva a porta e passa a enfileirar conexões que chegam",
          "O cliente (`nc localhost 4000`) conclui o handshake TCP, feito pelo sistema operacional; o Node.js emite `connection` e o callback do `createServer` roda com um `socket` novo, só desse cliente",
          "O cliente digita `oi` e Enter: os bytes chegam, o libuv avisa o laço de eventos e o `socket` emite `data` com um `Buffer` (ou uma string, com `setEncoding`)",
          "Seu código acumula o texto até achar o delimitador `\\n`, monta a mensagem completa e responde com `socket.write(...)`; se `write` devolver `false`, o buffer interno encheu e é hora de esperar o `drain`",
          "O cliente encerra a conexão (Ctrl+C no `nc`): o `socket` emite `end` (não há mais dados a ler) e, por padrão, o Node.js fecha o seu lado também; por fim vem o `close`, quando o descritor foi liberado",
        ],
        nota: "Cada cliente tem o seu `socket`, mas todos são atendidos pela mesma thread do JavaScript, o que funciona porque a espera é de E/S (veja T28).",
      },
      {
        tipo: "passos",
        titulo: "Agora os caminhos em que dá errado",
        passos: [
          {
            titulo: "A mensagem chega partida ou colada",
            texto:
              "Um cliente manda `ola\\nmundo\\n` e o servidor recebe `ol`, depois `a\\nmun` e `do\\n`, ou tudo de uma vez: o TCP preserva a ordem dos bytes, não os limites das mensagens. Tratar cada `data` como uma mensagem corrompe o protocolo. Conserto: acumular num buffer e cortar por um delimitador, ou usar um prefixo de tamanho (quatro bytes com o tamanho do corpo, seguidos do corpo).",
          },
          {
            titulo: "O cliente some sem se despedir",
            texto:
              "Uma queda de rede ou um processo morto pode resultar em `ECONNRESET` ou `EPIPE`, entregues no evento `error` do `socket`. Sem um ouvinte de `error`, o Node.js lança a exceção e derruba o processo (é um EventEmitter, veja T61). Pior é a conexão “meio morta”, que nunca avisa: use `socket.setTimeout(...)` e encerre quem fica ocioso, e `socket.setKeepAlive(true)` para sondas do TCP.",
          },
          {
            titulo: "O cliente lê mais devagar do que você escreve",
            texto:
              "Se você escreve sem olhar o retorno de `write`, os dados se acumulam na memória do servidor: é a pressão contrária (veja L62). Respeite o `false` e o evento `drain`, ou conecte os streams com `pipeline`.",
          },
          {
            titulo: "A porta ou os limites falham",
            texto:
              "`listen` numa porta ocupada falha com `EADDRINUSE`, no evento `error` do servidor. Muitas conexões abertas esgotam os descritores de arquivo do processo: ajuste `server.maxConnections` e feche as ociosas.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Servidor de eco por linhas",
        legenda: "JavaScript",
        codigo: [
          'import { createServer } from "node:net";',
          "",
          "const servidor = createServer((socket) => {",
          '  socket.setEncoding("utf8");',
          '  socket.setTimeout(30_000, () => socket.end("tempo esgotado\\n"));',
          '  let resto = ""; // o TCP não preserva as fronteiras das mensagens',
          '  socket.on("data", (pedaco) => {',
          "    resto += pedaco;",
          "    let i;",
          '    while ((i = resto.indexOf("\\n")) !== -1) { // uma mensagem por linha',
          "      const linha = resto.slice(0, i);",
          "      resto = resto.slice(i + 1);",
          "      socket.write(`eco: ${linha}\\n`);",
          "    }",
          "  });",
          '  socket.on("error", (erro) => console.error("socket:", erro.code)); // ECONNRESET etc.',
          '  socket.on("close", () => console.log("cliente saiu"));',
          "});",
          'servidor.listen(4000, () => console.log("ouvindo na porta 4000"));',
        ].join("\n"),
        nota: "Teste com `nc localhost 4000` e digite algumas linhas. `setEncoding` evita partir um caractere multibyte ao meio entre dois pedaços.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "TCP é um fluxo de bytes, e o HTTP é construído em cima dele",
        texto:
          "O `socket` é um **stream Duplex** (veja T37): lê e escreve ao mesmo tempo, com as mesmas regras de eventos e de backpressure dos outros streams. O HTTP é só um protocolo de texto, com regras de enquadramento próprias (cabeçalhos, linha em branco, `Content-Length`), que roda sobre o TCP: o `node:http` usa o `node:net` por baixo. Quando você escreve um protocolo próprio sobre `net`, o enquadramento é uma decisão sua.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O `net` não cifra nada",
        texto:
          "Tudo o que passa por um `socket` de `node:net` viaja em claro. Para cifrar, use o **`node:tls`**: `tls.createServer({ key, cert }, ...)` entrega um socket com a mesma interface, já protegido (veja F65). Em produção, é comum terminar o TLS num proxy ou balanceador e deixar o serviço TCP falar em claro só na rede interna.",
      },
    ],
    armadilhas: [
      "Tratar cada evento `data` como uma mensagem completa: os pedaços chegam partidos ou colados, e o protocolo se corrompe sob carga.",
      "Esquecer o ouvinte de `error` no `socket`: um `ECONNRESET` comum de cliente que caiu derruba o processo inteiro.",
      "Não definir timeout nem keep-alive: conexões ociosas ou meio mortas se acumulam até acabarem os descritores de arquivo.",
      "Confundir `end` com `close`: `end` significa que o outro lado terminou de enviar; `close` significa que o socket foi totalmente liberado.",
    ],
    autoteste: [
      {
        pergunta: "Por que um evento `data` não equivale a uma mensagem?",
        resposta:
          "Porque o TCP entrega um fluxo de bytes em ordem, sem preservar onde cada mensagem começa e termina. Um `data` pode trazer parte de uma mensagem ou várias coladas. Por isso o protocolo precisa de um delimitador ou de um prefixo de tamanho, e o código acumula os bytes até ter a mensagem inteira.",
      },
      {
        pergunta: "Qual é a relação entre TCP e HTTP, e entre `node:net` e `node:http`?",
        resposta:
          "O HTTP é um protocolo de aplicação que roda sobre conexões TCP, e o `node:http` é construído sobre o `node:net`: ele lê os bytes do socket, interpreta o texto do protocolo e entrega `req` e `res`. Com `net` você trabalha na camada de baixo e define o seu próprio protocolo.",
      },
    ],
  },
  en: {
    titulo: "A TCP server with net",
    pergunta: "How can you create a simple TCP server in Node.js?",
    porqueEsteMetodo:
      "A TCP server is small to write and tricky to understand: bytes arrive in pieces, the connection can drop at any moment and the `socket` is a stream. Following one connection from start to finish, including where it fails, shows all of that.",
    resposta30s:
      "Use the **`node:net`** module: `createServer` takes a callback that runs on every connection, with a **`socket`** (a Duplex stream), and `listen(port)` starts accepting clients. You read through the `data` event, write with `socket.write` and handle `end`, `error` and `close`. The key point is that **TCP is a byte stream with no message boundaries**: what arrives in one `data` may be half a message or two glued together, so you need **framing** (a delimiter such as `\\n`, or a length prefix).",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One connection, from connect to close",
        etapas: [
          "The server calls `listen(4000)`: the operating system reserves the port and starts queuing incoming connections",
          "The client (`nc localhost 4000`) completes the TCP handshake, done by the operating system; Node.js emits `connection` and the `createServer` callback runs with a new `socket`, belonging only to that client",
          "The client types `hi` and Enter: the bytes arrive, libuv notifies the event loop and the `socket` emits `data` with a `Buffer` (or a string, with `setEncoding`)",
          "Your code accumulates the text until it finds the `\\n` delimiter, builds the full message and answers with `socket.write(...)`; if `write` returns `false`, the internal buffer is full and it is time to wait for `drain`",
          "The client ends the connection (Ctrl+C in `nc`): the `socket` emits `end` (no more data to read) and, by default, Node.js closes its side too; finally `close` comes, once the descriptor has been released",
        ],
        nota: "Each client has its own `socket`, but they are all served by the same JavaScript thread, which works because the waiting is I/O (see T28).",
      },
      {
        tipo: "passos",
        titulo: "Now the paths where it goes wrong",
        passos: [
          {
            titulo: "The message arrives split or glued",
            texto:
              "A client sends `hello\\nworld\\n` and the server receives `hel`, then `lo\\nwor` and `ld\\n`, or everything at once: TCP preserves the order of the bytes, not the limits of the messages. Treating each `data` as a message corrupts the protocol. Fix: accumulate in a buffer and cut at a delimiter, or use a length prefix (four bytes with the body size, followed by the body).",
          },
          {
            titulo: "The client vanishes without saying goodbye",
            texto:
              "A network drop or a killed process can produce `ECONNRESET` or `EPIPE`, delivered on the `socket`’s `error` event. With no `error` listener, Node.js throws the exception and takes the process down (it is an EventEmitter, see T61). Worse is the “half-dead” connection that never reports: use `socket.setTimeout(...)` and close the idle ones, and `socket.setKeepAlive(true)` for TCP probes.",
          },
          {
            titulo: "The client reads slower than you write",
            texto:
              "If you write without checking the return value of `write`, data piles up in the server’s memory: that is backpressure (see L62). Respect the `false` and the `drain` event, or connect the streams with `pipeline`.",
          },
          {
            titulo: "The port or the limits fail",
            texto:
              "`listen` on a busy port fails with `EADDRINUSE`, on the server’s `error` event. Many open connections exhaust the process’s file descriptors: tune `server.maxConnections` and close the idle ones.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A line-based echo server",
        legenda: "JavaScript",
        codigo: [
          'import { createServer } from "node:net";',
          "",
          "const server = createServer((socket) => {",
          '  socket.setEncoding("utf8");',
          '  socket.setTimeout(30_000, () => socket.end("timed out\\n"));',
          '  let rest = ""; // TCP does not preserve message boundaries',
          '  socket.on("data", (chunk) => {',
          "    rest += chunk;",
          "    let i;",
          '    while ((i = rest.indexOf("\\n")) !== -1) { // one message per line',
          "      const line = rest.slice(0, i);",
          "      rest = rest.slice(i + 1);",
          "      socket.write(`echo: ${line}\\n`);",
          "    }",
          "  });",
          '  socket.on("error", (error) => console.error("socket:", error.code)); // ECONNRESET etc.',
          '  socket.on("close", () => console.log("client left"));',
          "});",
          'server.listen(4000, () => console.log("listening on port 4000"));',
        ].join("\n"),
        nota: "Try it with `nc localhost 4000` and type a few lines. `setEncoding` avoids splitting a multibyte character in half between two chunks.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "TCP is a byte stream, and HTTP is built on top of it",
        texto:
          "The `socket` is a **Duplex stream** (see T37): it reads and writes at the same time, with the same event and backpressure rules as other streams. HTTP is just a text protocol, with its own framing rules (headers, a blank line, `Content-Length`), running over TCP: `node:http` uses `node:net` underneath. When you write your own protocol on top of `net`, framing is your decision.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "`net` encrypts nothing",
        texto:
          "Everything that crosses a `node:net` socket travels in the clear. To encrypt, use **`node:tls`**: `tls.createServer({ key, cert }, ...)` gives you a socket with the same interface, already protected (see F65). In production it is common to terminate TLS at a proxy or load balancer and leave the TCP service talking in the clear only on the internal network.",
      },
    ],
    armadilhas: [
      "Treating each `data` event as a complete message: chunks arrive split or glued, and the protocol gets corrupted under load.",
      "Forgetting the `error` listener on the `socket`: an ordinary `ECONNRESET` from a dropped client takes the whole process down.",
      "Setting no timeout or keep-alive: idle or half-dead connections pile up until the file descriptors run out.",
      "Confusing `end` with `close`: `end` means the other side finished sending; `close` means the socket was fully released.",
    ],
    autoteste: [
      {
        pergunta: "Why is a `data` event not the same as a message?",
        resposta:
          "Because TCP delivers an ordered stream of bytes without preserving where each message starts and ends. One `data` can carry part of a message or several glued together. That is why the protocol needs a delimiter or a length prefix, and the code accumulates bytes until it has the whole message.",
      },
      {
        pergunta: "What is the relationship between TCP and HTTP, and between `node:net` and `node:http`?",
        resposta:
          "HTTP is an application protocol that runs over TCP connections, and `node:http` is built on `node:net`: it reads the bytes from the socket, parses the protocol’s text and hands you `req` and `res`. With `net` you work one layer down and define your own protocol.",
      },
    ],
  },
};
