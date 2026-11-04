import type { Pergunta } from "../../tipos";

// Q32 · Callbacks
export const q32: Pergunta = {
  numero: 32,
  modulo: "turing-intermediarias",
  metodo: "feynman",
  pt: {
    titulo: "Callbacks",
    pergunta: "Para que serve a função callback?",
    porqueEsteMetodo:
      "Callback é uma ideia simples que costuma ser explicada de forma confusa. Uma analogia do dia a dia (“me ligue quando estiver pronto”) dá a intuição, e depois o código mostra o mecanismo e onde a analogia falha.",
    resposta30s:
      "Callback é uma **função passada como argumento** para ser chamada **mais tarde**, quando algo acontecer ou terminar. Serve para dizer “o que fazer depois” sem travar a thread esperando: `fs.readFile`, `setTimeout` e ouvintes de evento usam isso. Em Node.js o padrão é **error-first**, `(err, dados)`. Ele funciona, mas aninhado vira “callback hell”, e por isso hoje se usam **promises** e `async`/`await`.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Você deixa o carro na oficina e, em vez de ficar esperando no balcão, deixa seu telefone: “me ligue quando estiver pronto”. A oficina guarda essa instrução e a executa quando o serviço termina. O telefone que você deixou é o callback: o que fazer depois, entregue a quem sabe quando o “depois” chega.",
        tecnico:
          "Um callback é uma **função passada como argumento** a outra função. Em JavaScript, funções são valores, então isso é natural. Há dois usos: **síncrono** (`[1, 2, 3].map(fn)`: o `fn` roda durante a chamada e já acabou quando `map` retorna) e **assíncrono** (`fs.readFile`, `setTimeout`, eventos: a função retorna logo e o callback roda depois, quando a operação termina). No Node.js a convenção é **error-first**: o callback é o último argumento e recebe `(err, resultado)`, com `err` nulo quando deu certo.",
        limite:
          "Na oficina, você sabe que vão ligar uma única vez, quando o carro estiver pronto. No código, nada garante isso: um callback pode ser chamado duas vezes, nunca, ou às vezes de forma síncrona e às vezes assíncrona. E um `throw` dentro de um callback assíncrono não cai no `try/catch` de quem iniciou a operação, porque aquele `try` já terminou; por isso o erro viaja como primeiro argumento.",
      },
      {
        tipo: "codigo",
        titulo: "Usar e escrever um callback error-first",
        legenda: "JavaScript",
        codigo: [
          'import { readFile } from "node:fs";',
          "",
          "// 1. Usando um callback error-first (padrão do Node.js)",
          'readFile("dados.json", "utf8", (err, texto) => {',
          '  if (err) return console.error("falhou:", err.message);',
          '  console.log("lido:", texto.length, "caracteres");',
          "});",
          'console.log("isto aparece primeiro"); // readFile retornou sem esperar',
          "",
          "// 2. Escrevendo uma função que recebe um callback",
          "function somarDepois(a, b, callback) {",
          "  setTimeout(() => callback(null, a + b), 100);",
          "}",
          "somarDepois(2, 3, (err, soma) => console.log(soma)); // 5",
        ].join("\n"),
        nota: "O `return` depois de tratar o erro evita que o código seguinte rode com `texto` indefinido.",
      },
      {
        tipo: "tabela",
        titulo: "Dois tipos de callback",
        colunas: ["", "Síncrono", "Assíncrono"],
        linhas: [
          [
            "Quando roda",
            "Durante a chamada, antes de a função retornar",
            "Depois de a função retornar, quando o evento ou a operação termina",
          ],
          [
            "Exemplos",
            "`arr.map(fn)`, `arr.filter(fn)`, `arr.sort(fn)`",
            '`fs.readFile`, `setTimeout`, `server.on("request", fn)`, `stream.on("data", fn)`',
          ],
          [
            "Erro",
            "Um `try/catch` em volta da chamada captura o `throw`",
            "Um `try/catch` em volta da chamada **não** captura; o erro chega como `err` ou por um evento `error`",
          ],
          [
            "Quantas vezes",
            "Uma por elemento, enquanto a função principal roda",
            "Uma só (resultado de operação) ou várias (eventos como `data`)",
          ],
          [
            "Para que serve",
            "Personalizar um algoritmo: o que fazer com cada item",
            "Dizer o que fazer quando algo demorado terminar, sem travar a thread",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "E as promises?",
        texto:
          "Promises e `async`/`await` resolvem os incômodos dos callbacks (aninhamento, erro espalhado), mas por baixo continuam sendo o mesmo mecanismo: algo é chamado depois. Para converter uma API de callback, use `util.promisify(fn)` ou os módulos `node:fs/promises` e similares. Veja Q38 (callback hell) e Q41 (controle de fluxo).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Uma vez, sempre do mesmo jeito",
        texto:
          "Um callback de operação deve ser chamado **exatamente uma vez**, e sempre de forma assíncrona (ou sempre síncrona), nunca dependendo de um `if`. O erro clássico é esquecer o `return` depois de `callback(err)`: o código continua e o callback é chamado duas vezes.",
      },
    ],
    armadilhas: [
      "Chamar o callback duas vezes (por exemplo, esquecendo o `return` depois de tratar o erro) ou nunca (em algum ramo do `if`).",
      "Colocar a chamada assíncrona dentro de um `try/catch` esperando capturar o erro do callback: o `try` termina antes.",
      "Ignorar o `err` e usar o resultado direto: com falha, o segundo argumento vem indefinido.",
      "Misturar comportamento síncrono e assíncrono na mesma função (por exemplo, responder de um cache na hora e do disco depois): quem chama não sabe quando o callback roda.",
    ],
    autoteste: [
      {
        pergunta: "O que significa o padrão error-first?",
        resposta:
          "O primeiro argumento do callback é o erro (nulo ou indefinido se deu certo) e os resultados vêm depois: `(err, dados)`. O callback é o último parâmetro da função.",
      },
      {
        pergunta: "Por que um `try/catch` ao redor de `readFile(arquivo, callback)` não captura a falha da leitura?",
        resposta:
          "Porque `readFile` retorna na hora e o `try` termina; a falha acontece depois, em outra volta do laço de eventos, e chega ao callback como `err`.",
      },
      {
        pergunta: "`arr.map(fn)` usa um callback assíncrono?",
        resposta: "Não. É um callback síncrono: o `fn` roda durante a chamada de `map`, antes de ela retornar.",
      },
    ],
  },
  en: {
    titulo: "Callbacks",
    pergunta: "What is a callback function for?",
    porqueEsteMetodo:
      "A callback is a simple idea that tends to be explained confusingly. An everyday analogy (“call me when it is ready”) builds the intuition, then the code shows the mechanism and where the analogy fails.",
    resposta30s:
      "A callback is a **function passed as an argument** to be called **later**, when something happens or finishes. It says “what to do next” without blocking the thread while waiting: `fs.readFile`, `setTimeout` and event listeners all use it. In Node.js the convention is **error-first**, `(err, data)`. It works, but nested deeply it turns into “callback hell”, which is why **promises** and `async`/`await` are used today.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "You leave your car at the repair shop and, instead of waiting at the counter, you leave your phone number: “call me when it is ready”. The shop keeps that instruction and carries it out when the job is done. The number you left is the callback: what to do next, handed to whoever knows when “next” arrives.",
        tecnico:
          "A callback is a **function passed as an argument** to another function. In JavaScript functions are values, so this is natural. There are two uses: **synchronous** (`[1, 2, 3].map(fn)`: `fn` runs during the call and has finished by the time `map` returns) and **asynchronous** (`fs.readFile`, `setTimeout`, events: the function returns right away and the callback runs later, when the operation finishes). In Node.js the convention is **error-first**: the callback is the last argument and receives `(err, result)`, with `err` null on success.",
        limite:
          "At the shop, you know they will call exactly once, when the car is ready. In code nothing guarantees that: a callback can be called twice, never, or sometimes synchronously and sometimes asynchronously. And a `throw` inside an async callback does not land in the `try/catch` of whoever started the operation, because that `try` is long finished; that is why the error travels as the first argument.",
      },
      {
        tipo: "codigo",
        titulo: "Using and writing an error-first callback",
        legenda: "JavaScript",
        codigo: [
          'import { readFile } from "node:fs";',
          "",
          "// 1. Using an error-first callback (the Node.js convention)",
          'readFile("data.json", "utf8", (err, text) => {',
          '  if (err) return console.error("failed:", err.message);',
          '  console.log("read:", text.length, "characters");',
          "});",
          'console.log("this prints first"); // readFile returned without waiting',
          "",
          "// 2. Writing a function that takes a callback",
          "function addLater(a, b, callback) {",
          "  setTimeout(() => callback(null, a + b), 100);",
          "}",
          "addLater(2, 3, (err, sum) => console.log(sum)); // 5",
        ].join("\n"),
        nota: "The `return` after handling the error keeps the following code from running without a valid `text`.",
      },
      {
        tipo: "tabela",
        titulo: "Two kinds of callback",
        colunas: ["", "Synchronous", "Asynchronous"],
        linhas: [
          [
            "When it runs",
            "During the call, before the function returns",
            "After the function has returned, when the event or operation finishes",
          ],
          [
            "Examples",
            "`arr.map(fn)`, `arr.filter(fn)`, `arr.sort(fn)`",
            '`fs.readFile`, `setTimeout`, `server.on("request", fn)`, `stream.on("data", fn)`',
          ],
          [
            "Errors",
            "A `try/catch` around the call catches the `throw`",
            "A `try/catch` around the call does **not** catch it; the error arrives as `err` or through an `error` event",
          ],
          [
            "How many times",
            "Once per element, while the main function runs",
            "Once (an operation’s result) or many times (events such as `data`)",
          ],
          [
            "What it is for",
            "Customizing an algorithm: what to do with each item",
            "Saying what to do when something slow finishes, without blocking the thread",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "What about promises?",
        texto:
          "Promises and `async`/`await` fix the annoyances of callbacks (nesting, scattered error handling), but underneath it is still the same mechanism: something is called later. To convert a callback API, use `util.promisify(fn)` or modules such as `node:fs/promises`. See Q38 (callback hell) and Q41 (control flow).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Once, always the same way",
        texto:
          "An operation’s callback must be called **exactly once**, and always asynchronously (or always synchronously), never depending on an `if`. The classic mistake is forgetting the `return` after `callback(err)`: the code carries on and the callback is called twice.",
      },
    ],
    armadilhas: [
      "Calling the callback twice (for example, forgetting the `return` after handling the error) or never (in some branch of an `if`).",
      "Putting the async call inside a `try/catch` expecting it to catch the callback’s error: the `try` finishes first.",
      "Ignoring `err` and using the result directly: on failure, the second argument is empty and using it breaks.",
      "Mixing sync and async behavior in one function (for example, answering from a cache instantly and from disk later): the caller cannot tell when the callback runs.",
    ],
    autoteste: [
      {
        pergunta: "What does the error-first convention mean?",
        resposta:
          "The callback’s first argument is the error (null or absent on success) and the results follow: `(err, data)`. The callback is the function’s last parameter.",
      },
      {
        pergunta: "Why does a `try/catch` around `readFile(path, callback)` not catch the read failure?",
        resposta:
          "Because `readFile` returns immediately and the `try` ends; the failure happens later, on another turn of the event loop, and reaches the callback as `err`.",
      },
      {
        pergunta: "Does `arr.map(fn)` use an asynchronous callback?",
        resposta: "No. It is a synchronous callback: `fn` runs during the `map` call, before it returns.",
      },
    ],
  },
};
