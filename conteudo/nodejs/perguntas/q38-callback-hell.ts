import type { Pergunta } from "../../tipos";

// Q38 · Callback hell
export const q38: Pergunta = {
  numero: 38,
  modulo: "turing-intermediarias",
  metodo: "playbook",
  pt: {
    titulo: "Callback hell",
    pergunta: "O que é callback hell?",
    porqueEsteMetodo:
      "Saber o nome do problema é só metade da resposta; a outra metade é como sair dele. Refatorar tem ordem (proteger com teste, achatar, converter, paralelizar, verificar), e um playbook evita reescrever tudo de uma vez.",
    resposta30s:
      "**Callback hell** (ou “pirâmide da perdição”) é o **aninhamento profundo de callbacks** quando cada passo assíncrono depende do anterior: o código vai se deslocando para a direita, o tratamento de erro se repete a cada nível e fica difícil ler, testar e reutilizar. A saída, em ordem: **nomear e achatar** as funções, usar **promises** e depois `async`/`await` com **um único** `try/catch`, deixando em `Promise.all` o que é independente.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook para sair da pirâmide",
        passos: [
          {
            titulo: "Reconheça os sinais",
            texto:
              "Indentação em pirâmide; uma fila de `});` no fim; `if (err) return ...` repetido a cada nível; variável de um nível usada três níveis abaixo; dificuldade para dizer onde cada função termina.",
          },
          {
            titulo: "Proteja com um teste",
            texto:
              "Antes de mexer, escreva um teste do comportamento atual (caminho feliz e uma falha, como arquivo inexistente). Critério: ele passa antes e depois de cada passo da refatoração.",
          },
          {
            titulo: "Dê nome e achate",
            texto:
              "Tire cada callback para uma função nomeada (`lerConfig`, `processar`, `gravar`) e passe-as por referência. Use retorno antecipado (`if (err) return cb(err)`) em vez de `else` aninhado. Só isso já tira boa parte da pirâmide, sem mudar a lógica.",
          },
          {
            titulo: "Converta para promises",
            texto:
              "Use as versões prontas (`node:fs/promises`) ou `util.promisify` para APIs error-first. Se encadear com `.then()`, retorne a próxima promise em vez de aninhar um `.then()` dentro de outro.",
          },
          {
            titulo: "Reescreva com async/await",
            texto:
              "Cada passo vira uma linha com `await`, em estilo sequencial. Um único `try/catch` em volta de tudo substitui os vários `if (err)`.",
          },
          {
            titulo: "Paralelize o que é independente",
            texto:
              "Passos que não dependem um do outro vão para `Promise.all([...])` (ou `Promise.allSettled`, se uma falha parcial for aceitável). Em série fica só o que precisa do resultado anterior.",
          },
          {
            titulo: "Verifique",
            texto:
              "Rode o teste do passo 2 e provoque falhas (arquivo inexistente, JSON inválido) para ver o erro chegar ao `catch`. Confira se nenhuma promise ficou sem `await` ou `catch`.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Antes: a pirâmide",
        legenda: "JavaScript",
        codigo: [
          'import { readFile, writeFile } from "node:fs";',
          "",
          'readFile("config.json", "utf8", (err, texto) => {',
          "  if (err) return console.error(err);",
          "  const config = JSON.parse(texto); // se falhar, ninguém captura",
          '  readFile(config.entrada, "utf8", (err, dados) => {',
          "    if (err) return console.error(err);",
          "    writeFile(config.saida, dados.toUpperCase(), (err) => {",
          "      if (err) return console.error(err);",
          '      console.log("pronto");',
          "    });",
          "  });",
          "});",
        ].join("\n"),
      },
      {
        tipo: "codigo",
        titulo: "Depois: async/await com um só tratamento de erro",
        legenda: "JavaScript",
        codigo: [
          'import { readFile, writeFile } from "node:fs/promises";',
          "",
          "try {",
          '  const config = JSON.parse(await readFile("config.json", "utf8"));',
          '  const dados = await readFile(config.entrada, "utf8");',
          "  await writeFile(config.saida, dados.toUpperCase());",
          '  console.log("pronto");',
          "} catch (err) {",
          "  console.error(err); // inclusive o erro do JSON.parse",
          "}",
        ].join("\n"),
        nota: "Os passos continuam em série porque cada um usa o resultado do anterior. Se fossem independentes, `Promise.all` os executaria juntos.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O objetivo",
        texto:
          "Não é “eliminar callbacks”, e sim recuperar o fluxo linear: uma coluna de código, **um lugar para tratar erros** e passos com nome, que se possam testar. Callbacks continuam corretos para eventos e para APIs simples; o problema é o aninhamento de passos dependentes.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O inferno também existe com promises",
        texto:
          "Aninhar `.then()` dentro de `.then()` recria a pirâmide com outra sintaxe. E `await` dentro de um `for` executa as chamadas em série: quando elas são independentes, use `Promise.all`. Veja Q32 (callbacks) e Q41 (controle de fluxo).",
      },
    ],
    armadilhas: [
      "Achar que o problema é a sintaxe do callback e não o aninhamento: funções nomeadas já resolvem boa parte.",
      "Migrar para promises mantendo a pirâmide (`.then` dentro de `.then`).",
      "Usar `await` dentro de um `for` quando os passos são independentes: o que podia ser paralelo vira série e fica lento.",
      "Esquecer o tratamento de erro ao refatorar: uma promise rejeitada sem `await` nem `catch` pode derrubar o processo.",
    ],
    autoteste: [
      {
        pergunta: "Cite três sinais de callback hell.",
        resposta:
          "Indentação em pirâmide, uma fila de `});` no fim, `if (err)` repetido a cada nível e variáveis de níveis externos usadas bem dentro.",
      },
      {
        pergunta: "Qual é o primeiro passo de refatoração que não exige trocar callbacks por promises?",
        resposta:
          "Dar nome às funções e achatar: extrair cada callback para uma função nomeada de nível superior e usar retorno antecipado.",
      },
      {
        pergunta: "Por que `await` dentro de um `for` pode ser um problema de desempenho?",
        resposta:
          "Porque cada iteração espera a anterior terminar. Se as chamadas são independentes, `Promise.all` as executa ao mesmo tempo.",
      },
    ],
  },
  en: {
    titulo: "Callback hell",
    pergunta: "What is callback hell?",
    porqueEsteMetodo:
      "Knowing the problem’s name is only half the answer; the other half is how to get out. Refactoring has an order (protect with a test, flatten, convert, parallelize, verify), and a playbook avoids rewriting everything at once.",
    resposta30s:
      "**Callback hell** (or the “pyramid of doom”) is the **deep nesting of callbacks** when each async step depends on the previous one: the code drifts to the right, error handling repeats at every level, and it becomes hard to read, test and reuse. The way out, in order: **name and flatten** the functions, use **promises** and then `async`/`await` with a **single** `try/catch`, leaving independent work to `Promise.all`.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook for leaving the pyramid",
        passos: [
          {
            titulo: "Recognize the signs",
            texto:
              "Pyramid-shaped indentation; a row of `});` at the end; `if (err) return ...` repeated at every level; a variable from one level used three levels down; trouble telling where each function ends.",
          },
          {
            titulo: "Protect with a test",
            texto:
              "Before touching anything, write a test of the current behavior (happy path and one failure, such as a missing file). Criterion: it passes before and after every refactoring step.",
          },
          {
            titulo: "Name and flatten",
            texto:
              "Pull each callback out into a named function (`readConfig`, `process`, `save`) and pass them by reference. Use early returns (`if (err) return cb(err)`) instead of a nested `else`. This alone removes much of the pyramid without changing the logic.",
          },
          {
            titulo: "Convert to promises",
            texto:
              "Use the ready-made versions (`node:fs/promises`) or `util.promisify` for error-first APIs. If you chain with `.then()`, return the next promise instead of nesting one `.then()` inside another.",
          },
          {
            titulo: "Rewrite with async/await",
            texto:
              "Each step becomes one line with `await`, in sequential style. A single `try/catch` around everything replaces the many `if (err)` checks.",
          },
          {
            titulo: "Parallelize what is independent",
            texto:
              "Steps that do not depend on each other go into `Promise.all([...])` (or `Promise.allSettled`, if partial failure is acceptable). Only what needs the previous result stays in series.",
          },
          {
            titulo: "Verify",
            texto:
              "Run the test from step 2 and provoke failures (missing file, invalid JSON) to see the error reach the `catch`. Check that no promise was left without an `await` or a `catch`.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Before: the pyramid",
        legenda: "JavaScript",
        codigo: [
          'import { readFile, writeFile } from "node:fs";',
          "",
          'readFile("config.json", "utf8", (err, text) => {',
          "  if (err) return console.error(err);",
          "  const config = JSON.parse(text); // if this throws, nobody catches it",
          '  readFile(config.input, "utf8", (err, data) => {',
          "    if (err) return console.error(err);",
          "    writeFile(config.output, data.toUpperCase(), (err) => {",
          "      if (err) return console.error(err);",
          '      console.log("done");',
          "    });",
          "  });",
          "});",
        ].join("\n"),
      },
      {
        tipo: "codigo",
        titulo: "After: async/await with one error handler",
        legenda: "JavaScript",
        codigo: [
          'import { readFile, writeFile } from "node:fs/promises";',
          "",
          "try {",
          '  const config = JSON.parse(await readFile("config.json", "utf8"));',
          '  const data = await readFile(config.input, "utf8");',
          "  await writeFile(config.output, data.toUpperCase());",
          '  console.log("done");',
          "} catch (err) {",
          "  console.error(err); // including the JSON.parse error",
          "}",
        ].join("\n"),
        nota: "The steps stay in series because each one uses the previous result. If they were independent, `Promise.all` would run them together.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The goal",
        texto:
          "It is not “eliminate callbacks”, it is recovering a linear flow: one column of code, **one place to handle errors** and named steps you can test. Callbacks remain correct for events and simple APIs; the problem is nesting dependent steps.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Hell exists with promises too",
        texto:
          "Nesting `.then()` inside `.then()` recreates the pyramid with different syntax. And `await` inside a `for` loop runs the calls in series: when they are independent, use `Promise.all`. See Q32 (callbacks) and Q41 (control flow).",
      },
    ],
    armadilhas: [
      "Thinking the problem is callback syntax rather than nesting: named functions already solve much of it.",
      "Migrating to promises while keeping the pyramid (`.then` inside `.then`).",
      "Using `await` inside a `for` loop when the steps are independent: what could run in parallel runs in series and gets slow.",
      "Forgetting error handling while refactoring: a rejected promise with no `await` or `catch` can take the process down.",
    ],
    autoteste: [
      {
        pergunta: "Name three signs of callback hell.",
        resposta:
          "Pyramid-shaped indentation, a row of `});` at the end, `if (err)` repeated at every level, and variables from outer levels used deep inside.",
      },
      {
        pergunta: "What is the first refactoring step that does not require swapping callbacks for promises?",
        resposta: "Naming and flattening: extract each callback into a named top-level function and use early returns.",
      },
      {
        pergunta: "Why can `await` inside a `for` loop be a performance problem?",
        resposta:
          "Because each iteration waits for the previous one to finish. If the calls are independent, `Promise.all` runs them at the same time.",
      },
    ],
  },
};
