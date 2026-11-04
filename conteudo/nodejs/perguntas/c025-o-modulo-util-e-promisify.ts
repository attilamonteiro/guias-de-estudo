import type { Pergunta } from "../../tipos";

// C25 · O módulo util e promisify
export const c025: Pergunta = {
  numero: 525,
  modulo: "coderpad-senior",
  metodo: "feynman",
  pt: {
    titulo: "O módulo util e promisify",
    pergunta:
      "Explique o papel da função util.promisify do Node.js e como ela simplifica o trabalho com funções assíncronas que usam callbacks. Dê um exemplo de uso do util.promisify para converter uma função baseada em callback em uma função baseada em Promise.",
    porqueEsteMetodo:
      "O `promisify` é um adaptador, e a imagem de um adaptador de tomada mostra de imediato o que ele converte e o que não faz. A pergunta pede um exemplo; aqui ele é descrito passo a passo, antes e depois, para você contar o método em voz alta.",
    resposta30s:
      "O **`util.promisify`** converte uma função no padrão **error-first** (callback como **último** argumento, chamado com `(erro, valor)`) em uma função que **devolve uma Promise**: ela resolve com o valor ou rejeita com o erro, o que permite `await` e evita o aninhamento de callbacks. Você a chama com os mesmos argumentos, sem o callback. Prefira os módulos nativos `fs/promises` e `timers/promises` quando existirem; o módulo `util` ainda traz `inspect`, `format`, `types`, `parseArgs`, `deprecate` e outros.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine um aparelho antigo com plugue de três pinos e uma tomada moderna, de outro formato, na parede. Você não reforma o aparelho nem a parede: compra um adaptador. O adaptador não gera energia nem muda o que o aparelho faz, só converte o encaixe. O `util.promisify` é esse adaptador entre o jeito antigo de entregar um resultado (você entrega uma função e espera que alguém a chame com `(erro, valor)`) e o jeito moderno (você recebe uma Promise e usa `await`).",
        tecnico:
          "O `util.promisify(funcao)` recebe uma função que segue o padrão **error-first**: o último parâmetro é um callback chamado como `callback(erro, valor)`. Ele devolve uma função nova, com os mesmos parâmetros menos o callback, que retorna uma Promise: resolvida com `valor` quando `erro` é `null` ou `undefined`, e rejeitada com `erro` caso contrário. Por baixo, a função nova cria a Promise, chama a original com os seus argumentos mais um callback próprio e liga esse callback ao `resolve` e ao `reject`. Quando uma API precisa de um comportamento diferente do padrão, ela mesma declara a sua versão pelo símbolo `util.promisify.custom`: é assim que `child_process.exec` promisificado resolve com `{ stdout, stderr }`. O caminho inverso, de Promise para callback, é o `util.callbackify`.",
        limite:
          "O adaptador só serve ao padrão para o qual foi feito: se o callback não for o último argumento, não começar por `erro` ou entregar vários valores, o encaixe falha ou perde dados. E ele só muda a **forma** de entregar o resultado: o trabalho não fica mais rápido nem mais assíncrono do que já era.",
      },
      {
        tipo: "passos",
        titulo: "O exemplo em palavras: de callback para Promise",
        passos: [
          {
            titulo: "Antes: uma função no estilo callback",
            texto:
              'Considere `fs.readFile(caminho, "utf8", callback)`. Ela inicia a leitura e, ao terminar, chama `callback(erro, texto)`: se falhou, `erro` vem preenchido; se deu certo, `erro` é `null` e `texto` traz o conteúdo. Quem usa passa uma função, testa `erro` primeiro e só então usa `texto` (veja T32); com várias etapas em sequência, isso vira aninhamento (veja T38).',
          },
          {
            titulo: "Conferir o encaixe",
            texto:
              "A função serve ao `promisify` se o callback for o **último** argumento e for chamado como `(erro, valor)`. Se um dos dois requisitos falhar, o adaptador não encaixa (veja o aviso adiante).",
          },
          {
            titulo: "Converter",
            texto:
              "Chame `util.promisify(fs.readFile)` e guarde o resultado numa constante, por exemplo `lerArquivo`. Nada é lido nesse momento: a conversão só cria uma função nova. Faça isso uma vez, no topo do módulo.",
          },
          {
            titulo: "Depois: usar a versão com Promise",
            texto:
              'Chame `lerArquivo(caminho, "utf8")` com os mesmos argumentos, **sem** o callback. A chamada devolve uma Promise: com `await` dentro de um `try/catch`, ou com `.then` e `.catch`, o código fica linear em vez de aninhado.',
          },
          {
            titulo: "O que acontece por dentro",
            texto:
              "A função nova cria uma Promise, chama a original com os seus argumentos mais um callback próprio e liga esse callback à Promise: se ele receber `erro`, a Promise é **rejeitada** com ele; senão, é **resolvida** com o valor.",
          },
          {
            titulo: "Quando a original falha",
            texto:
              'Se o arquivo não existir, a original entregaria ao callback um `erro` com `code: "ENOENT"`; na versão promisificada, o mesmo objeto de erro vira a rejeição e cai no `catch`. A informação é a mesma, só muda o caminho por onde ela chega.',
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "O módulo util em visão geral",
        colunas: ["Utilitário", "Para que serve", "Observação"],
        linhas: [
          [
            "`promisify` e `callbackify`",
            "Converter uma função com callback error-first em uma que devolve Promise, e o inverso",
            "Prefira os módulos `/promises` nativos quando existirem",
          ],
          [
            "`inspect`",
            "Transformar um valor em texto legível, que é o que o `console.log` usa; aceita opções como `depth` e `colors`",
            "`util.inspect.custom` personaliza a exibição de uma classe",
          ],
          [
            "`format`",
            "Formatar texto no estilo printf, com marcadores como `%s`, `%d`, `%j` e `%o`",
            "É a base da formatação do `console.log`",
          ],
          [
            "`types`",
            "Verificações confiáveis de tipos internos: `isPromise`, `isDate`, `isRegExp`, `isTypedArray`…",
            "Mais fiel que `instanceof` para valores vindos de outro contexto",
          ],
          [
            "`parseArgs`",
            "Ler argumentos de linha de comando declarados (opções, valores, posicionais) a partir de `process.argv`",
            "Confira o estado de estabilidade na documentação da sua versão",
          ],
          [
            "`deprecate`",
            "Embrulhar uma função e emitir um aviso de depreciação, uma vez, quando alguém a chama",
            "Evolui uma API de biblioteca sem quebrar quem a usa",
          ],
          [
            "`TextEncoder` e `TextDecoder`",
            "Converter texto em bytes (UTF-8) e bytes em texto",
            "Também existem como globais, como no navegador",
          ],
          [
            "`isDeepStrictEqual`",
            "Comparar dois valores em profundidade, com igualdade estrita",
            "É o mesmo critério do `assert.deepStrictEqual`",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Quando usar o promisify",
        texto:
          "Use `util.promisify` quando precisar de `await` numa API de callback que você **não controla** e que segue o padrão error-first. Se existir uma versão nativa com Promises (`fs/promises`, `timers/promises`, `stream/promises`, `dns/promises`, `readline/promises`), use-a: o Node.js a mantém e ela já cuida dos detalhes. Se o formato for outro (callback sem `erro`, eventos, vários valores), escreva a Promise à mão com `new Promise` ou use a versão `util.promisify.custom` que a própria API declara.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Quando o adaptador não encaixa",
        texto:
          "Se o callback não for o último argumento, ou não receber `erro` primeiro, o primeiro valor será tratado como erro: aparecem rejeições estranhas ou dados perdidos. Se o callback entrega vários valores (`(erro, a, b)`), a Promise resolve só com o primeiro (`a`). Um método que usa `this` precisa de `bind` se for extraído: `util.promisify(obj.metodo.bind(obj))`. E o `promisify` não torna nada mais rápido nem tira trabalho da thread principal: só muda a forma de receber o resultado.",
      },
    ],
    armadilhas: [
      "Promisificar uma função que não segue o padrão (callback fora da última posição, ou sem `erro` primeiro): o primeiro valor é tratado como erro e surgem rejeições falsas ou dados perdidos.",
      "Extrair um método e promisificá-lo sem `bind`: `util.promisify(obj.metodo)` chamado solto perde o `this`.",
      "Esperar vários valores do callback: a Promise resolve só com o primeiro, a menos que a API defina `util.promisify.custom`.",
      "Reinventar o que já existe: para arquivos, timers, streams e DNS há módulos `/promises` nativos, melhores que um `promisify` manual.",
    ],
    autoteste: [
      {
        pergunta: "O que o `util.promisify` exige da função original?",
        resposta:
          "Que o callback seja o último argumento e seja chamado como `(erro, valor)`, com `erro` nulo em caso de sucesso. A função nova tem os mesmos argumentos, sem o callback, e devolve uma Promise.",
      },
      {
        pergunta: "Uma API chama `callback(erro, a, b)`. O que a versão promisificada entrega?",
        resposta:
          "Resolve só com `a`, o primeiro valor. Para entregar os dois, a API precisaria declarar `util.promisify.custom`, ou você escreve a Promise à mão.",
      },
    ],
  },
  en: {
    titulo: "The util module and promisify",
    pergunta:
      "Explain the role of the Node.js util.promisify function and how it simplifies working with asynchronous functions that use callbacks. Provide an example of using util.promisify to convert a callback-based function into a Promise-based function.",
    porqueEsteMetodo:
      "`promisify` is an adapter, and the image of a plug adapter shows at once what it converts and what it does not do. The question asks for an example; here it is described step by step, before and after, so you can tell the method out loud.",
    resposta30s:
      "**`util.promisify`** converts a function in the **error-first** pattern (callback as the **last** argument, called with `(err, value)`) into a function that **returns a Promise**: it resolves with the value or rejects with the error, which allows `await` and avoids nesting callbacks. You call it with the same arguments, minus the callback. Prefer the native `fs/promises` and `timers/promises` modules when they exist; the `util` module also provides `inspect`, `format`, `types`, `parseArgs`, `deprecate` and more.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Picture an old appliance with a three-pin plug and a modern wall socket of a different shape. You do not rebuild the appliance or the wall: you buy an adapter. The adapter does not generate power or change what the appliance does, it only converts the fit. `util.promisify` is that adapter between the old way of delivering a result (you hand over a function and hope someone calls it with `(err, value)`) and the modern way (you receive a Promise and use `await`).",
        tecnico:
          "`util.promisify(fn)` takes a function that follows the **error-first** pattern: the last parameter is a callback called as `callback(err, value)`. It returns a new function, with the same parameters minus the callback, that returns a Promise: resolved with `value` when `err` is `null` or `undefined`, and rejected with `err` otherwise. Underneath, the new function creates the Promise, calls the original with your arguments plus a callback of its own and wires that callback to `resolve` and `reject`. When an API needs behavior different from the pattern, it declares its own version through the `util.promisify.custom` symbol: that is how a promisified `child_process.exec` resolves with `{ stdout, stderr }`. The reverse direction, from Promise to callback, is `util.callbackify`.",
        limite:
          "The adapter only serves the pattern it was made for: if the callback is not the last argument, does not start with `err` or delivers several values, the fit fails or loses data. And it only changes the **form** in which the result is delivered: the work does not become faster or more asynchronous than it already was.",
      },
      {
        tipo: "passos",
        titulo: "The example in words: from callback to Promise",
        passos: [
          {
            titulo: "Before: a callback-style function",
            texto:
              'Consider `fs.readFile(path, "utf8", callback)`. It starts the read and, when done, calls `callback(err, text)`: if it failed, `err` is filled in; if it worked, `err` is `null` and `text` holds the content. The caller passes a function, checks `err` first and only then uses `text` (see T32); with several steps in sequence, this turns into nesting (see T38).',
          },
          {
            titulo: "Check the fit",
            texto:
              "The function suits `promisify` if the callback is the **last** argument and is called as `(err, value)`. If either requirement fails, the adapter does not fit (see the warning below).",
          },
          {
            titulo: "Convert",
            texto:
              "Call `util.promisify(fs.readFile)` and store the result in a constant, for example `readFileAsync`. Nothing is read at this moment: the conversion only creates a new function. Do it once, at the top of the module.",
          },
          {
            titulo: "After: use the Promise version",
            texto:
              'Call `readFileAsync(path, "utf8")` with the same arguments, **without** the callback. The call returns a Promise: with `await` inside a `try/catch`, or with `.then` and `.catch`, the code becomes linear instead of nested.',
          },
          {
            titulo: "What happens inside",
            texto:
              "The new function creates a Promise, calls the original with your arguments plus a callback of its own and ties that callback to the Promise: if it receives `err`, the Promise is **rejected** with it; otherwise it is **resolved** with the value.",
          },
          {
            titulo: "When the original fails",
            texto:
              'If the file does not exist, the original would hand the callback an `err` with `code: "ENOENT"`; in the promisified version, the same error object becomes the rejection and lands in the `catch`. The information is the same, only the path it arrives by changes.',
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "The util module at a glance",
        colunas: ["Utility", "What it is for", "Note"],
        linhas: [
          [
            "`promisify` and `callbackify`",
            "Convert an error-first callback function into one that returns a Promise, and the reverse",
            "Prefer the native `/promises` modules when they exist",
          ],
          [
            "`inspect`",
            "Turn a value into readable text, which is what `console.log` uses; accepts options such as `depth` and `colors`",
            "`util.inspect.custom` customizes how a class is displayed",
          ],
          [
            "`format`",
            "Format text printf-style, with placeholders such as `%s`, `%d`, `%j` and `%o`",
            "It is the basis of `console.log` formatting",
          ],
          [
            "`types`",
            "Reliable checks for built-in types: `isPromise`, `isDate`, `isRegExp`, `isTypedArray`…",
            "More faithful than `instanceof` for values from another context",
          ],
          [
            "`parseArgs`",
            "Read declared command-line arguments (options, values, positionals) from `process.argv`",
            "Check its stability status in the documentation for your version",
          ],
          [
            "`deprecate`",
            "Wrap a function and emit a deprecation warning, once, when someone calls it",
            "Evolves a library API without breaking its users",
          ],
          [
            "`TextEncoder` and `TextDecoder`",
            "Convert text to bytes (UTF-8) and bytes to text",
            "Also available as globals, as in the browser",
          ],
          [
            "`isDeepStrictEqual`",
            "Compare two values in depth, with strict equality",
            "The same criterion as `assert.deepStrictEqual`",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "When to use promisify",
        texto:
          "Use `util.promisify` when you need `await` on a callback API you **do not control** and that follows the error-first pattern. If a native Promise version exists (`fs/promises`, `timers/promises`, `stream/promises`, `dns/promises`, `readline/promises`), use it: Node.js maintains it and it already handles the details. If the format is different (a callback without `err`, events, several values), write the Promise by hand with `new Promise` or use the `util.promisify.custom` version the API itself declares.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "When the adapter does not fit",
        texto:
          "If the callback is not the last argument, or does not receive `err` first, the first value will be treated as an error: odd rejections or lost data appear. If the callback delivers several values (`(err, a, b)`), the Promise resolves with only the first (`a`). A method that uses `this` needs `bind` if you detach it: `util.promisify(obj.method.bind(obj))`. And `promisify` does not make anything faster or take work off the main thread: it only changes how you receive the result.",
      },
    ],
    armadilhas: [
      "Promisifying a function that does not follow the pattern (callback not in the last position, or without `err` first): the first value is treated as an error and false rejections or lost data appear.",
      "Detaching a method and promisifying it without `bind`: `util.promisify(obj.method)` called loose loses `this`.",
      "Expecting several values from the callback: the Promise resolves with only the first, unless the API defines `util.promisify.custom`.",
      "Reinventing what already exists: for files, timers, streams and DNS there are native `/promises` modules, better than a manual `promisify`.",
    ],
    autoteste: [
      {
        pergunta: "What does `util.promisify` require from the original function?",
        resposta:
          "That the callback is the last argument and is called as `(err, value)`, with `err` null on success. The new function has the same arguments, minus the callback, and returns a Promise.",
      },
      {
        pergunta: "An API calls `callback(err, a, b)`. What does the promisified version deliver?",
        resposta:
          "It resolves with only `a`, the first value. To deliver both, the API would have to declare `util.promisify.custom`, or you write the Promise by hand.",
      },
    ],
  },
};
