import type { Pergunta } from "../../tipos";

// L33 · AbortController e cancelamento
export const l033: Pergunta = {
  numero: 133,
  modulo: "linkedin-assincrono",
  metodo: "feynman",
  pt: {
    titulo: "AbortController e cancelamento",
    pergunta: "O que é AbortController?",
    porqueEsteMetodo:
      "Cancelar uma operação é um conceito de aviso e cooperação, que uma imagem do dia a dia explica bem: quem pede aperta um botão e quem trabalha escuta a campainha. A analogia também deixa claro o limite: o botão avisa, mas não desfaz.",
    resposta30s:
      "O **`AbortController`** é o mecanismo padrão para **cancelar operações assíncronas**: você cria um controller, passa o **`signal`** dele para a API (`fetch`, `fs/promises`, `timers/promises`…) e chama **`abort()`** quando quiser interromper; a promise então rejeita com um erro de cancelamento. O cancelamento é **cooperativo**: só para quem respeita o sinal, e você mesmo precisa limpar timers e listeners. `AbortSignal.timeout(ms)` cobre o caso comum de dar prazo a uma operação.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine um pedido enviado à cozinha com uma campainha de cancelamento ligada a ele. Você segura o botão (o `AbortController`); quem prepara o pedido escuta a campainha (o `AbortSignal`). Se você mudar de ideia, aperta o botão: a campainha toca para todos que trabalham naquele pedido, e cada um para por conta própria, desligando o fogão e guardando os ingredientes antes de sair.",
        tecnico:
          "`new AbortController()` cria o par: `controller.signal` (o `AbortSignal`, que você passa adiante) e `controller.abort(motivo?)` (o botão). Ao chamar `abort()`, `signal.aborted` vira `true`, o evento `'abort'` dispara e `signal.reason` guarda o motivo. As APIs que aceitam `{ signal }` escutam esse evento, interrompem o trabalho e rejeitam a promise com um erro de cancelamento (`AbortError`, ou o `reason` informado, conforme a API). `AbortSignal.timeout(ms)` cria um sinal que aborta sozinho depois do prazo, e `AbortSignal.any([...])` combina vários sinais (confira a documentação da sua versão do Node.js).",
        limite:
          "A campainha só avisa: a comida pode já ter sido servida. No código, `abort()` não desfaz o que já aconteceu (um `POST` pode ter chegado ao servidor) nem interrompe uma função que não olha o `signal`. E o botão é de uso único: um controller abortado não volta atrás, então crie outro para a próxima tentativa.",
      },
      {
        tipo: "codigo",
        titulo: "`fetch` com timeout e limpeza",
        legenda: "JavaScript",
        codigo: [
          "const controller = new AbortController();",
          "const timer = setTimeout(() => controller.abort(), 5000); // cancela depois de 5 s",
          "",
          "try {",
          '  const resposta = await fetch("https://api.exemplo.com/dados", { signal: controller.signal });',
          "  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);",
          "  console.log(await resposta.json());",
          "} catch (err) {",
          '  if (err.name === "AbortError") console.error("requisição cancelada");',
          "  else throw err;",
          "} finally {",
          "  clearTimeout(timer); // limpeza: não deixa o timer segurando o processo",
          "}",
        ].join("\n"),
        nota: "Para apenas limitar o tempo, `fetch(url, { signal: AbortSignal.timeout(5000) })` faz o mesmo sem timer manual; nesse caso o erro chega com o nome `TimeoutError`. Um `controller.abort()` de outro ponto do código (o usuário saiu da tela, por exemplo) cancela do mesmo jeito.",
      },
      {
        tipo: "tabela",
        titulo: "Onde o `signal` entra",
        colunas: ["API", "Como passar o sinal", "O que acontece ao abortar"],
        linhas: [
          [
            "`fetch`, `http.request`",
            "`{ signal }` nas opções",
            "A requisição é interrompida e falha com um erro de cancelamento",
          ],
          [
            "`node:timers/promises`",
            "`setTimeout(ms, valor, { signal })`",
            "O timer é cancelado e a promise rejeita com `AbortError`",
          ],
          [
            "`node:fs/promises`",
            "`readFile(caminho, { signal })`",
            "A operação para quando possível (confira a documentação de cada função)",
          ],
          [
            "`stream.pipeline`, `child_process`, `events.once`",
            "`{ signal }` nas opções",
            "Streams são destruídas, o processo filho é encerrado, a espera rejeita",
          ],
          [
            "Uma função sua",
            "Receba `{ signal }` e use `signal.throwIfAborted()` ou o evento `'abort'`",
            "Você decide o que interromper e limpar",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Como cancelar qualquer operação assíncrona",
        texto:
          "Uma `Promise` não tem cancelamento embutido. Prefira APIs que aceitam `signal`; nas suas próprias funções, receba um `signal` e cheque-o entre as etapas, limpando o que abriu. Se a operação não aceita sinal, o máximo que dá para fazer é **ignorar o resultado** (por exemplo com um `Promise.race`, veja L26), e o trabalho continua rodando por baixo. Trate o `AbortError` como parte do fluxo normal, não como falha.",
      },
    ],
    armadilhas: [
      "Achar que `abort()` desfaz o efeito: a requisição pode ter sido processada pelo servidor, então escritas devem ser idempotentes.",
      "Tratar o cancelamento como erro inesperado: ele rejeita a promise, e sem `catch` vira rejeição não tratada (veja L32) ou um log de falha falso.",
      "Reaproveitar um controller já abortado: o `signal` continua abortado e a próxima chamada falha de imediato; crie um novo por tentativa.",
      "Esquecer a limpeza: um timer sem `clearTimeout` ou um listener de `'abort'` sem remover segura memória e pode manter o processo vivo.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre `AbortController` e `AbortSignal`?",
        resposta:
          "O controller é quem cancela (`abort()`); o signal é o que você passa para quem faz o trabalho, que o escuta ou o consulta (`aborted`, `reason`). Cada controller tem um signal.",
      },
      {
        pergunta: "Como dar um timeout de 5 segundos a um `fetch` sem timer manual, e que erro chega?",
        resposta:
          "Com `fetch(url, { signal: AbortSignal.timeout(5000) })`. Passado o prazo, a promise rejeita com um erro de nome `TimeoutError`.",
      },
    ],
  },
  en: {
    titulo: "AbortController and cancellation",
    pergunta: "What is AbortController?",
    porqueEsteMetodo:
      "Cancelling an operation is a concept of notice and cooperation, which an everyday picture explains well: whoever asks presses a button and whoever works hears the bell. The analogy also makes the limit clear: the button notifies, but it does not undo.",
    resposta30s:
      "**`AbortController`** is the standard mechanism for **cancelling asynchronous operations**: you create a controller, pass its **`signal`** to the API (`fetch`, `fs/promises`, `timers/promises`…) and call **`abort()`** when you want to stop; the promise then rejects with a cancellation error. Cancellation is **cooperative**: it only stops what respects the signal, and you must clean up timers and listeners yourself. `AbortSignal.timeout(ms)` covers the common case of putting a deadline on an operation.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine an order sent to the kitchen with a cancellation bell attached to it. You hold the button (the `AbortController`); whoever prepares the order listens for the bell (the `AbortSignal`). If you change your mind, you press the button: the bell rings for everyone working on that order, and each person stops on their own, turning off the stove and putting the ingredients away before leaving.",
        tecnico:
          "`new AbortController()` creates the pair: `controller.signal` (the `AbortSignal`, which you pass along) and `controller.abort(reason?)` (the button). When you call `abort()`, `signal.aborted` becomes `true`, the `'abort'` event fires and `signal.reason` holds the reason. APIs that accept `{ signal }` listen for that event, stop the work and reject the promise with a cancellation error (`AbortError`, or the `reason` you supplied, depending on the API). `AbortSignal.timeout(ms)` creates a signal that aborts by itself after the deadline, and `AbortSignal.any([...])` combines several signals (check the documentation for your Node.js version).",
        limite:
          "The bell only notifies: the food may already have been served. In code, `abort()` does not undo what already happened (a `POST` may have reached the server) and does not stop a function that never looks at the `signal`. And the button is single-use: an aborted controller does not go back, so create a new one for the next attempt.",
      },
      {
        tipo: "codigo",
        titulo: "`fetch` with a timeout and cleanup",
        legenda: "JavaScript",
        codigo: [
          "const controller = new AbortController();",
          "const timer = setTimeout(() => controller.abort(), 5000); // cancel after 5 s",
          "",
          "try {",
          '  const response = await fetch("https://api.example.com/data", { signal: controller.signal });',
          "  if (!response.ok) throw new Error(`HTTP ${response.status}`);",
          "  console.log(await response.json());",
          "} catch (err) {",
          '  if (err.name === "AbortError") console.error("request cancelled");',
          "  else throw err;",
          "} finally {",
          "  clearTimeout(timer); // cleanup: do not let the timer hold the process open",
          "}",
        ].join("\n"),
        nota: "To merely limit the time, `fetch(url, { signal: AbortSignal.timeout(5000) })` does the same without a manual timer; in that case the error arrives named `TimeoutError`. A `controller.abort()` from elsewhere in the code (the user left the screen, for example) cancels the same way.",
      },
      {
        tipo: "tabela",
        titulo: "Where the `signal` goes",
        colunas: ["API", "How to pass the signal", "What happens on abort"],
        linhas: [
          [
            "`fetch`, `http.request`",
            "`{ signal }` in the options",
            "The request is interrupted and fails with a cancellation error",
          ],
          [
            "`node:timers/promises`",
            "`setTimeout(ms, value, { signal })`",
            "The timer is cancelled and the promise rejects with `AbortError`",
          ],
          [
            "`node:fs/promises`",
            "`readFile(path, { signal })`",
            "The operation stops when possible (check each function’s documentation)",
          ],
          [
            "`stream.pipeline`, `child_process`, `events.once`",
            "`{ signal }` in the options",
            "Streams are destroyed, the child process is ended, the wait rejects",
          ],
          [
            "Your own function",
            "Take `{ signal }` and use `signal.throwIfAborted()` or the `'abort'` event",
            "You decide what to interrupt and clean up",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "How to cancel any asynchronous operation",
        texto:
          "A `Promise` has no built-in cancellation. Prefer APIs that accept a `signal`; in your own functions, take a `signal` and check it between steps, cleaning up whatever you opened. If the operation takes no signal, the most you can do is **ignore the result** (for example with a `Promise.race`, see L26), and the work keeps running underneath. Treat `AbortError` as part of the normal flow, not as a failure.",
      },
    ],
    armadilhas: [
      "Thinking `abort()` undoes the effect: the request may have been processed by the server, so writes should be idempotent.",
      "Treating cancellation as an unexpected error: it rejects the promise, and without a `catch` it becomes an unhandled rejection (see L32) or a false failure log.",
      "Reusing a controller that was already aborted: the `signal` stays aborted and the next call fails at once; create a new one per attempt.",
      "Forgetting cleanup: a timer without `clearTimeout` or an `'abort'` listener left in place holds memory and can keep the process alive.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `AbortController` and `AbortSignal`?",
        resposta:
          "The controller is who cancels (`abort()`); the signal is what you hand to whoever does the work, which listens to it or checks it (`aborted`, `reason`). Each controller has one signal.",
      },
      {
        pergunta: "How do you give a `fetch` a 5-second timeout without a manual timer, and what error arrives?",
        resposta:
          "With `fetch(url, { signal: AbortSignal.timeout(5000) })`. After the deadline, the promise rejects with an error named `TimeoutError`.",
      },
    ],
  },
};
