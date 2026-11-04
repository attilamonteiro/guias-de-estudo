import type { Pergunta } from "../../tipos";

// Q05 · REPL
export const q05: Pergunta = {
  numero: 5,
  modulo: "turing-basicas",
  metodo: "playbook",
  pt: {
    titulo: "REPL",
    pergunta: "O que significa REPL no Node.js?",
    porqueEsteMetodo:
      "O REPL é uma ferramenta que se aprende usando. Um playbook em passos, com o comando e o sinal esperado em cada um, ensina a sigla e também o jeito de usá-lo no dia a dia.",
    resposta30s:
      "**REPL** significa **Read-Eval-Print Loop**: o Node.js **lê** o que você digita, **avalia** o código, **imprime** o resultado e **repete**. Para abri-lo, rode `node` sem argumentos. Serve para **testar ideias rápidas**, explorar APIs e inspecionar expressões sem criar arquivo. O último resultado fica em `_`, os comandos com ponto (`.help`, `.exit`, `.load`, `.save`, `.editor`) controlam a sessão e o `await` funciona direto. Para programas de verdade, escreva um arquivo.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Passo a passo",
        passos: [
          {
            titulo: "Abra o REPL",
            texto: "Digite `node` sem nenhum arquivo. Sinal: o prompt muda para `>`.",
          },
          {
            titulo: "Avalie expressões",
            texto:
              "Digite `2 + 2` e Enter: o resultado aparece na hora. Uma declaração (`const x = 1`) imprime `undefined`, e isso é normal: o REPL mostra o valor da expressão, e declarações não têm valor. Um erro é mostrado sem encerrar a sessão.",
          },
          {
            titulo: "Reaproveite o último resultado",
            texto:
              "A variável `_` guarda o valor da última expressão (`_ * 10`). As setas para cima e para baixo percorrem o histórico, e `Tab` completa nomes e lista propriedades.",
          },
          {
            titulo: "Escreva em várias linhas",
            texto:
              "Ao abrir uma chave ou um parêntese e apertar Enter, o REPL continua na linha seguinte (`...`). Para colar um bloco maior, use `.editor` e finalize com Ctrl+D; Ctrl+C cancela.",
          },
          {
            titulo: "Use módulos, `await` e arquivos",
            texto:
              'Os módulos nativos já estão à mão (`os.cpus().length`, `path.basename("/a/b.txt")`) e `require()` carrega arquivos seus. O `await` de nível superior funciona direto (`await Promise.resolve(42)`). `.save sessao.js` grava o que você digitou e `.load sessao.js` executa um arquivo dentro da sessão.',
          },
          {
            titulo: "Saia",
            texto:
              "`.exit`, Ctrl+D ou Ctrl+C duas vezes. Sinal: volta o prompt do seu terminal. As variáveis da sessão se perdem; o histórico de comandos normalmente é guardado.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Comandos do REPL",
        colunas: ["Comando", "O que faz"],
        linhas: [
          ["`.help`", "Lista os comandos disponíveis"],
          ["`.editor`", "Entra no modo de edição de várias linhas (Ctrl+D executa, Ctrl+C cancela)"],
          ["`.load arquivo.js`", "Carrega e executa um arquivo na sessão atual"],
          ["`.save arquivo.js`", "Grava em um arquivo tudo o que foi digitado na sessão"],
          ["`.break`", "Abandona a expressão de várias linhas em andamento (o mesmo que Ctrl+C)"],
          ["`.exit`", "Encerra o REPL (também Ctrl+D)"],
          ["`_`", "Não é um comando: é a variável com o resultado da última expressão (`_error` guarda o último erro)"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Uma sessão de exemplo",
        legenda: "Sessão no terminal",
        codigo: `$ node
> const nomes = ["ana", "bia"]
undefined
> nomes.map((n) => n.toUpperCase())
[ 'ANA', 'BIA' ]
> _.length
2
> await Promise.resolve(42)
42
> .exit`,
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Uma linha sem abrir o REPL",
        texto:
          '`node -e "console.log(2 + 2)"` executa um trecho e sai; `node -p "2 + 2"` já imprime o resultado. Para embutir um REPL no seu próprio programa (um console administrativo, por exemplo), existe o módulo `node:repl`.',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Limitações",
        texto:
          'O estado morre com a sessão e editar várias linhas é desconfortável, então o REPL não é lugar de código definitivo: o que importa vai para um arquivo (`.save` ajuda). O `import` estático não funciona na sessão; use `await import("node:fs")` ou `require`. E o REPL não substitui testes automatizados.',
      },
    ],
    armadilhas: [
      "Estranhar o `undefined` depois de declarar uma variável: é o valor da declaração, e não um erro.",
      "Usar `import` estático no REPL e achar que o Node.js está com defeito: na sessão, use `await import(...)` ou `require`.",
      "Tratar o REPL como lugar de código definitivo: ao sair, o estado se perde; passe o que importa para um arquivo.",
      "Confundir o REPL com o console do navegador: no REPL não há `window` nem `document`; há `process`, `require` e os módulos nativos.",
    ],
    autoteste: [
      {
        pergunta: "O que significa cada letra de REPL?",
        resposta: "Read (ler), Eval (avaliar), Print (imprimir) e Loop (repetir).",
      },
      {
        pergunta: "Como reaproveitar o resultado da expressão anterior?",
        resposta: "Com a variável `_`, que guarda o valor da última expressão avaliada.",
      },
      {
        pergunta: "Como guardar o que você digitou numa sessão?",
        resposta: "Com `.save arquivo.js`; depois `.load arquivo.js` executa o arquivo numa sessão nova.",
      },
    ],
  },
  en: {
    titulo: "REPL",
    pergunta: "What does REPL mean in Node.js?",
    porqueEsteMetodo:
      "The REPL is a tool you learn by using it. A step-by-step playbook, with the command and the expected signal at each step, teaches the acronym and also how to use it day to day.",
    resposta30s:
      "**REPL** stands for **Read-Eval-Print Loop**: Node.js **reads** what you type, **evaluates** the code, **prints** the result and **loops**. Open it by running `node` with no arguments. It is for **quick experiments**, exploring APIs and inspecting expressions without creating a file. The last result lives in `_`, dot commands (`.help`, `.exit`, `.load`, `.save`, `.editor`) control the session and `await` works directly. For real programs, write a file.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Step by step",
        passos: [
          {
            titulo: "Open the REPL",
            texto: "Type `node` with no file. Signal: the prompt changes to `>`.",
          },
          {
            titulo: "Evaluate expressions",
            texto:
              "Type `2 + 2` and press Enter: the result appears right away. A declaration (`const x = 1`) prints `undefined`, and that is normal: the REPL shows the value of the expression, and declarations have no value. An error is shown without ending the session.",
          },
          {
            titulo: "Reuse the last result",
            texto:
              "The `_` variable holds the value of the last expression (`_ * 10`). The up and down arrows walk through the history, and `Tab` completes names and lists properties.",
          },
          {
            titulo: "Write multiple lines",
            texto:
              "After opening a brace or parenthesis and pressing Enter, the REPL continues on the next line (`...`). To paste a larger block, use `.editor` and finish with Ctrl+D; Ctrl+C cancels.",
          },
          {
            titulo: "Use modules, `await` and files",
            texto:
              'Built-in modules are already at hand (`os.cpus().length`, `path.basename("/a/b.txt")`) and `require()` loads your own files. Top-level `await` works directly (`await Promise.resolve(42)`). `.save session.js` writes what you typed and `.load session.js` runs a file inside the session.',
          },
          {
            titulo: "Exit",
            texto:
              "`.exit`, Ctrl+D or Ctrl+C twice. Signal: your terminal prompt returns. Session variables are lost; the command history is normally kept.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "REPL commands",
        colunas: ["Command", "What it does"],
        linhas: [
          ["`.help`", "Lists the available commands"],
          ["`.editor`", "Enters multi-line editing mode (Ctrl+D runs, Ctrl+C cancels)"],
          ["`.load file.js`", "Loads and runs a file in the current session"],
          ["`.save file.js`", "Writes everything typed in the session to a file"],
          ["`.break`", "Abandons the multi-line expression in progress (same as Ctrl+C)"],
          ["`.exit`", "Ends the REPL (also Ctrl+D)"],
          ["`_`", "Not a command: the variable holding the last expression’s result (`_error` holds the last error)"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A sample session",
        legenda: "Terminal session",
        codigo: `$ node
> const names = ["ann", "bob"]
undefined
> names.map((n) => n.toUpperCase())
[ 'ANN', 'BOB' ]
> _.length
2
> await Promise.resolve(42)
42
> .exit`,
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "One line without opening the REPL",
        texto:
          '`node -e "console.log(2 + 2)"` runs a snippet and exits; `node -p "2 + 2"` prints the result for you. To embed a REPL in your own program (an admin console, for example), there is the `node:repl` module.',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Limitations",
        texto:
          'State dies with the session and editing several lines is awkward, so the REPL is not the place for final code: what matters goes into a file (`.save` helps). Static `import` does not work in the session; use `await import("node:fs")` or `require`. And the REPL does not replace automated tests.',
      },
    ],
    armadilhas: [
      "Being puzzled by the `undefined` after declaring a variable: it is the value of the declaration, not an error.",
      "Using static `import` in the REPL and assuming Node.js is broken: in the session, use `await import(...)` or `require`.",
      "Treating the REPL as the place for final code: on exit the state is lost; move what matters into a file.",
      "Confusing the REPL with the browser console: the REPL has no `window` or `document`; it has `process`, `require` and the built-in modules.",
    ],
    autoteste: [
      {
        pergunta: "What does each letter of REPL stand for?",
        resposta: "Read, Eval, Print and Loop.",
      },
      {
        pergunta: "How do you reuse the result of the previous expression?",
        resposta: "With the `_` variable, which holds the value of the last evaluated expression.",
      },
      {
        pergunta: "How do you keep what you typed in a session?",
        resposta: "With `.save file.js`; later `.load file.js` runs the file in a new session.",
      },
    ],
  },
};
