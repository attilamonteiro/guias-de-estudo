import type { Pergunta } from "../../tipos";

// G20 · return callback x chamar callback
export const g020: Pergunta = {
  numero: 620,
  modulo: "gist-iniciante",
  metodo: "trace",
  pt: {
    titulo: "return callback x chamar callback",
    pergunta: "Qual é a diferença entre retornar um callback e apenas chamá-lo?",
    porqueEsteMetodo:
      "O efeito do `return` só aparece quando você segue uma chamada passo a passo: sem ele, a mesma operação passa duas vezes pelo callback. Acompanhar o caminho errado e o certo, lado a lado, mostra exatamente onde o bug nasce.",
    resposta30s:
      "Em `return callback(err)`, o que importa é o **`return`**: ele **interrompe a função** logo depois de chamar o callback; o valor devolvido é ignorado por quem chamou. Chamar o callback sem `return` deixa a função seguir adiante, e o resultado clássico é o callback ser chamado **duas vezes** (primeiro com o erro, depois com sucesso) ou efeitos colaterais rodarem depois do erro. Hoje o `async`/`await` evita o assunto.",
    blocos: [
      {
        tipo: "codigo",
        titulo: "Validar a entrada e ler um arquivo",
        legenda: "JavaScript",
        codigo: [
          'import { readFile } from "node:fs";',
          "",
          "function lerTexto(caminho, callback) {",
          '  if (!caminho.endsWith(".txt")) {',
          '    callback(new Error("só arquivos .txt")); // BUG: sem return, a função segue adiante',
          '    // correção: return callback(new Error("só arquivos .txt"));',
          "  }",
          '  readFile(caminho, "utf8", (err, texto) => {',
          "    if (err) return callback(err); // aqui o return evita o callback seguinte",
          "    callback(null, texto);",
          "  });",
          "}",
          "",
          'lerTexto("leia-me.md", (err) => console.log(err ? "erro" : "ok"));',
        ].join("\n"),
        nota: "Com o bug, se `leia-me.md` existir, imprime `erro` e depois `ok`: o mesmo callback recebeu um erro e um sucesso para uma única operação.",
      },
      {
        tipo: "passos",
        titulo: "Seguindo a chamada sem o `return`",
        passos: [
          {
            titulo: "A chamada",
            texto:
              'Você chama `lerTexto("leia-me.md", cb)`. O `cb` imprime `erro` se receber um erro e `ok` caso contrário. O arquivo existe, mas a função só aceita `.txt`.',
          },
          {
            titulo: "A validação falha",
            texto:
              "A extensão não é `.txt`, e a função chama `callback(new Error(...))`. O `cb` roda agora, na mesma pilha, e imprime `erro`.",
          },
          {
            titulo: "Nada interrompe a função",
            texto:
              "Sem `return`, `callback(...)` é uma chamada comum: quando ela volta, a execução sai do `if` e segue para o `readFile`, que inicia a leitura como se nada tivesse acontecido.",
          },
          {
            titulo: "A segunda chamada",
            texto:
              "A leitura termina numa volta posterior do laço de eventos e o callback do `readFile` chama `callback(null, texto)`. O mesmo `cb` roda de novo e imprime `ok`.",
          },
          {
            titulo: "O estrago",
            texto:
              "O chamador recebeu um erro e depois um sucesso para uma operação só. Num handler HTTP, isso vira duas respostas para a mesma requisição (com erros como `ERR_HTTP_HEADERS_SENT`); numa fila, uma tarefa dada como falha e concluída ao mesmo tempo.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "A mesma chamada com `return callback(err)`",
        etapas: [
          '`lerTexto("leia-me.md", cb)` é chamada',
          "A validação falha e a função executa `return callback(new Error(...))`",
          "O `cb` roda uma vez e imprime `erro`; o `return` encerra `lerTexto`",
          "O `readFile` nunca é chamado: não há segunda chamada nem leitura inútil",
        ],
        nota: "O valor que `return callback(...)` devolve é ignorado por quem chamou `lerTexto`: o resultado chega pelos argumentos do callback. `callback(err); return;` faz exatamente o mesmo, e a forma em uma linha é só um atalho.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A regra",
        texto:
          "O `return` serve para **parar a função**, não para entregar um valor. Em código com callbacks, cada caminho deve chamar o callback **exatamente uma vez**: depois de chamá-lo com o erro, saia da função (`return callback(err)`); no caminho de sucesso, chame-o uma vez, no fim. Se a pergunta quis dizer “uma função que devolve outra função” (fábrica ou closure), esse é outro assunto: aqui o tema é o idioma do padrão error-first (veja T32).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Síncrono ou assíncrono, nunca os dois (Zalgo)",
        texto:
          "Mesmo corrigida, `lerTexto` entrega o erro de validação de forma **síncrona** e o resultado da leitura de forma **assíncrona**. Misturar os dois (um defeito apelidado de “Zalgo”) faz o chamador se comportar de um jeito num caminho e de outro no restante: um callback que usa algo definido depois da chamada funciona no caminho assíncrono e falha no síncrono. Entregue sempre de forma assíncrona: `return process.nextTick(callback, new Error(...))`, ou `setImmediate` (veja L27 para a diferença). Hoje o `async`/`await` evita o problema: uma função `async` sempre devolve uma promise e o erro vira rejeição, sem callback para chamar duas vezes.",
      },
    ],
    armadilhas: [
      "Chamar `callback(err)` e esquecer o `return`: o código seguinte roda e o callback pode ser chamado de novo, agora com sucesso.",
      "Achar que o valor de `return callback(...)` chega ao chamador: ele é ignorado; só o que vai nos argumentos do callback chega.",
      "Chamar o callback dentro de um `try` cujo `catch` também o chama: se o próprio callback lançar uma exceção, o `catch` o chama uma segunda vez.",
      "Misturar caminhos síncronos e assíncronos na mesma função (Zalgo): a ordem de execução do chamador passa a depender do caminho.",
    ],
    autoteste: [
      {
        pergunta: "`return callback(err)` e `callback(err); return;` fazem a mesma coisa?",
        resposta:
          "Sim. O `return` interrompe a função e o valor devolvido é ignorado por quem chamou. A diferença em relação a `callback(err)` sozinho é que, sem o `return`, a função continua e pode chamar o callback de novo ou repetir efeitos.",
      },
      {
        pergunta: "O que acontece se uma função error-first chama `callback(err)` e continua executando?",
        resposta:
          "Ela pode chamar o callback outra vez (por exemplo, com sucesso, depois do erro) ou repetir efeitos colaterais, e o chamador recebe resultados contraditórios para a mesma operação.",
      },
    ],
  },
  en: {
    titulo: "return callback vs calling it",
    pergunta: "What is the difference between returning a callback and just calling a callback?",
    porqueEsteMetodo:
      "The effect of `return` only shows up when you follow a call step by step: without it, the same operation goes through the callback twice. Tracing the wrong path and the right one side by side shows exactly where the bug is born.",
    resposta30s:
      "In `return callback(err)`, what matters is the **`return`**: it **stops the function** right after calling the callback; the returned value is ignored by the caller. Calling the callback without `return` lets the function carry on, and the classic result is the callback being called **twice** (first with the error, then with success) or side effects running after the error. Today `async`/`await` avoids the issue.",
    blocos: [
      {
        tipo: "codigo",
        titulo: "Validating the input and reading a file",
        legenda: "JavaScript",
        codigo: [
          'import { readFile } from "node:fs";',
          "",
          "function readText(path, callback) {",
          '  if (!path.endsWith(".txt")) {',
          '    callback(new Error("only .txt files")); // BUG: without return, the function carries on',
          '    // fix: return callback(new Error("only .txt files"));',
          "  }",
          '  readFile(path, "utf8", (err, text) => {',
          "    if (err) return callback(err); // here the return prevents the next callback",
          "    callback(null, text);",
          "  });",
          "}",
          "",
          'readText("read-me.md", (err) => console.log(err ? "error" : "ok"));',
        ].join("\n"),
        nota: "With the bug, if `read-me.md` exists, it prints `error` and then `ok`: the same callback received an error and a success for a single operation.",
      },
      {
        tipo: "passos",
        titulo: "Following the call without the `return`",
        passos: [
          {
            titulo: "The call",
            texto:
              'You call `readText("read-me.md", cb)`. The `cb` prints `error` if it receives an error and `ok` otherwise. The file exists, but the function only accepts `.txt`.',
          },
          {
            titulo: "The validation fails",
            texto:
              "The extension is not `.txt`, and the function calls `callback(new Error(...))`. The `cb` runs now, on the same stack, and prints `error`.",
          },
          {
            titulo: "Nothing stops the function",
            texto:
              "Without `return`, `callback(...)` is an ordinary call: when it comes back, execution leaves the `if` and moves on to `readFile`, which starts the read as if nothing had happened.",
          },
          {
            titulo: "The second call",
            texto:
              "The read finishes on a later turn of the event loop and the `readFile` callback calls `callback(null, text)`. The same `cb` runs again and prints `ok`.",
          },
          {
            titulo: "The damage",
            texto:
              "The caller got an error and then a success for a single operation. In an HTTP handler, that becomes two responses to the same request (with errors such as `ERR_HTTP_HEADERS_SENT`); in a queue, a task reported as both failed and done.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "The same call with `return callback(err)`",
        etapas: [
          '`readText("read-me.md", cb)` is called',
          "The validation fails and the function runs `return callback(new Error(...))`",
          "The `cb` runs once and prints `error`; the `return` ends `readText`",
          "`readFile` is never called: no second call and no pointless read",
        ],
        nota: "The value that `return callback(...)` returns is ignored by whoever called `readText`: the result arrives through the callback's arguments. `callback(err); return;` does exactly the same, and the one-line form is just a shortcut.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The rule",
        texto:
          "The `return` is there to **stop the function**, not to deliver a value. In callback code, every path must call the callback **exactly once**: after calling it with the error, leave the function (`return callback(err)`); on the success path, call it once, at the end. If the question meant “a function that returns another function” (a factory or closure), that is a different topic: here the subject is the idiom of the error-first pattern (see T32).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Sync or async, never both (Zalgo)",
        texto:
          "Even when fixed, `readText` delivers the validation error **synchronously** and the read result **asynchronously**. Mixing the two (a flaw nicknamed “Zalgo”) makes the caller behave one way on one path and another way on the rest: a callback that uses something defined after the call works on the async path and fails on the sync one. Always deliver asynchronously: `return process.nextTick(callback, new Error(...))`, or `setImmediate` (see L27 for the difference). Today `async`/`await` avoids the problem: an `async` function always returns a promise and the error becomes a rejection, with no callback to call twice.",
      },
    ],
    armadilhas: [
      "Calling `callback(err)` and forgetting the `return`: the next code runs and the callback may be called again, now with success.",
      "Thinking the value of `return callback(...)` reaches the caller: it is ignored; only what goes in the callback's arguments arrives.",
      "Calling the callback inside a `try` whose `catch` also calls it: if the callback itself throws, the `catch` calls it a second time.",
      "Mixing sync and async paths in the same function (Zalgo): the caller's order of execution starts to depend on the path.",
    ],
    autoteste: [
      {
        pergunta: "Do `return callback(err)` and `callback(err); return;` do the same thing?",
        resposta:
          "Yes. The `return` stops the function and the returned value is ignored by the caller. The difference from a bare `callback(err)` is that, without the `return`, the function carries on and may call the callback again or repeat effects.",
      },
      {
        pergunta: "What happens if an error-first function calls `callback(err)` and keeps running?",
        resposta:
          "It may call the callback again (for example with success, after the error) or repeat side effects, and the caller gets contradictory results for the same operation.",
      },
    ],
  },
};
