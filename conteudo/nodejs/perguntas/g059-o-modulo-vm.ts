import type { Pergunta } from "../../tipos";

// G59 · O módulo vm
export const g059: Pergunta = {
  numero: 659,
  modulo: "gist-avancado",
  metodo: "threat",
  pt: {
    titulo: "O módulo vm",
    pergunta: "Quais são os casos de uso do módulo central vm do Node.js?",
    porqueEsteMetodo:
      "O `vm` tem usos legítimos, mas a pergunta de entrevista de verdade é por que ele não serve para rodar código não confiável. O método de ameaças lista o que um atacante tenta e a defesa que de fato funciona.",
    resposta30s:
      "O **`node:vm`** compila e executa código JavaScript **em outro contexto global**, dentro do mesmo processo (`runInNewContext`, `Script`, `createContext`). Os usos legítimos são avaliar **expressões e templates** de origem confiável, o **REPL**, ferramentas de **teste e carregadores** que dão globais próprios a cada arquivo e **transformadores** de código. A documentação avisa que ele **não é um mecanismo de segurança**: para código não confiável, use outro processo, contêiner ou um isolamento de verdade.",
    blocos: [
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Para que o `vm` serve",
        texto:
          "Ele roda código com **variáveis globais separadas** das do seu programa, sem criar outro processo. Usos reais: **avaliar fórmulas e templates** escritos por quem você controla; o **REPL** do Node, que avalia o que você digita num contexto próprio; **frameworks de teste e carregadores de módulos**, que dão a cada arquivo seus próprios globais; **transformadores e ferramentas de build**, que compilam e rodam código gerado (`vm.Script` compila uma vez e executa muitas vezes). Há ainda `vm.runInThisContext`, que roda no global atual, mas não enxerga as variáveis locais do módulo, e `SourceTextModule`, para módulos ES, que é experimental e exige flag.",
      },
      {
        tipo: "codigo",
        titulo: "Avaliar uma fórmula de origem confiável",
        legenda: "JavaScript",
        codigo: `import vm from "node:vm";

// Compila uma vez; roda quantas vezes quiser em contextos diferentes
const formula = new vm.Script("preco * quantidade - desconto");

// O contexto só enxerga o que você colocar nele (e só dados, nunca objetos do host)
const contexto = vm.createContext({ preco: 120, quantidade: 3, desconto: 36 });

const total = formula.runInContext(contexto, { timeout: 50 }); // 324
console.log(total);`,
        nota: "Isto serve para configuração escrita por sua equipe. Não protege contra código hostil, como mostram os pares abaixo.",
      },
      {
        tipo: "pares",
        titulo: "Se você usar o `vm` como sandbox",
        rotuloOrigem: "Ameaça",
        rotuloDestino: "Defesa ou alternativa",
        pares: [
          {
            origem:
              "**Escape pelo construtor**: um objeto criado no contexto principal e entregue ao contexto (até o objeto de globais que você passa) traz o `constructor` do host. Por ele o código alcança o `Function` do processo principal e, dali, `process` e `require`.",
            destino:
              "Não tente tapar as brechas uma a uma: este é só um caminho conhecido, e a documentação avisa que o módulo não é um mecanismo de segurança. Para código não confiável, isole em **outro processo** sem privilégios, **contêiner** ou **isolated-vm** (isolates do V8 separados; confira o modelo de ameaça).",
          },
          {
            origem: "**Laço infinito** (`while (true) {}`) que trava o laço de eventos do seu servidor inteiro.",
            destino:
              "A opção `timeout` interrompe a execução síncrona do trecho, mas não cobre trabalho agendado depois nem funções do host que o código chame. Rode em **worker thread** ou **processo filho** que você consiga encerrar à força.",
          },
          {
            origem:
              "**Consumo de memória** sem limite: o contexto aloca até estourar o heap, e o heap é o do seu processo.",
            destino:
              "O `vm` não limita memória por contexto. Use os limites de recursos de uma worker thread, ou limites do sistema (processo, cgroup, contêiner).",
          },
          {
            origem:
              "**Ponte para o host**: você injeta `require`, `process`, `console` ou uma função “útil”, e o código usa isso para sair.",
            destino:
              "Nunca injete módulos, `process` nem objetos do host; passe só dados simples, de preferência copiados (JSON ou clone estruturado). Cada referência é uma ponte de volta.",
          },
          {
            origem:
              "**Entrada do usuário executada como código** (`vm.runInNewContext(entrada)`) para calcular expressões.",
            destino:
              "Não execute entrada como código. Use um **analisador de expressões** com gramática própria e fechada, ou **WebAssembly**, que só alcança o que você importar.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O `vm` isola nomes, não privilégios",
        texto:
          "Um contexto novo separa variáveis globais, mas o código dentro dele continua no **mesmo processo, com os mesmos privilégios** e disputando a mesma memória e o mesmo laço de eventos. Isso basta para organizar código confiável e não basta para contê-lo se ele for hostil. O modelo de permissões do Node (veja L88) também não substitui um isolamento real. Em caso de dúvida, trate o código como não confiável e coloque a fronteira fora do processo.",
      },
    ],
    armadilhas: [
      "Usar `vm.runInNewContext` para executar código de usuário “com segurança”: é a armadilha central, e a documentação alerta contra isso.",
      "Achar que o `timeout` resolve o problema de laços e de negação de serviço: ele cobre só a execução síncrona e não limita memória.",
      "Passar ao contexto objetos ou funções do host (`console`, `process`, `require`, até um objeto comum): cada um é uma ponte de volta ao host.",
      "Esperar que `runInThisContext` isole algo: ele roda no global atual, só não enxerga as variáveis locais do módulo.",
    ],
    autoteste: [
      {
        pergunta: "Cite dois usos legítimos do `vm` e diga por que são aceitáveis.",
        resposta:
          "Avaliar fórmulas ou templates escritos por quem você controla e dar globais próprios a cada arquivo num carregador ou framework de teste. O objetivo é organizar e separar nomes de código confiável, não conter um adversário.",
      },
      {
        pergunta: "Por que o `timeout` não torna o `vm` um sandbox seguro?",
        resposta:
          "Ele só interrompe a execução síncrona do trecho. Não limita memória, não cobre trabalho agendado depois e não impede o escape pelo construtor, que alcança o processo principal com todos os seus privilégios.",
      },
    ],
  },
  en: {
    titulo: "The vm module",
    pergunta: 'What are the use cases for the Node.js "vm" core module?',
    porqueEsteMetodo:
      "`vm` has legitimate uses, but the real interview question is why it is not for running untrusted code. The threat method lists what an attacker tries and the defense that actually works.",
    resposta30s:
      "**`node:vm`** compiles and runs JavaScript **in another global context**, inside the same process (`runInNewContext`, `Script`, `createContext`). Legitimate uses are evaluating **expressions and templates** from a trusted source, the **REPL**, **test tools and loaders** that give each file its own globals, and code **transformers**. The documentation warns that it is **not a security mechanism**: for untrusted code, use another process, a container or real isolation.",
    blocos: [
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "What `vm` is for",
        texto:
          "It runs code with **global variables separate** from your program’s, without creating another process. Real uses: **evaluating formulas and templates** written by people you control; Node’s **REPL**, which evaluates what you type in its own context; **test frameworks and module loaders**, which give each file its own globals; **transformers and build tools**, which compile and run generated code (`vm.Script` compiles once and runs many times). There are also `vm.runInThisContext`, which runs in the current global but cannot see the module’s local variables, and `SourceTextModule`, for ES modules, which is experimental and needs a flag.",
      },
      {
        tipo: "codigo",
        titulo: "Evaluating a formula from a trusted source",
        legenda: "JavaScript",
        codigo: `import vm from "node:vm";

// Compile once; run as many times as you like in different contexts
const formula = new vm.Script("price * quantity - discount");

// The context only sees what you put in it (and only data, never host objects)
const context = vm.createContext({ price: 120, quantity: 3, discount: 36 });

const total = formula.runInContext(context, { timeout: 50 }); // 324
console.log(total);`,
        nota: "This suits configuration written by your own team. It does not protect against hostile code, as the pairs below show.",
      },
      {
        tipo: "pares",
        titulo: "If you use `vm` as a sandbox",
        rotuloOrigem: "Threat",
        rotuloDestino: "Defense or alternative",
        pares: [
          {
            origem:
              "**Escape through the constructor**: an object created in the main context and handed to the context (even the globals object you pass) carries the host’s `constructor`. Through it the code reaches the main process’s `Function` and, from there, `process` and `require`.",
            destino:
              "Do not try to plug the holes one by one: this is just one known path, and the documentation warns that the module is not a security mechanism. For untrusted code, isolate in **another process** with no privileges, a **container** or **isolated-vm** (separate V8 isolates; check the threat model).",
          },
          {
            origem: "An **infinite loop** (`while (true) {}`) that freezes your whole server’s event loop.",
            destino:
              "The `timeout` option interrupts the snippet’s synchronous execution, but it does not cover work scheduled later or host functions the code calls. Run in a **worker thread** or **child process** you can kill by force.",
          },
          {
            origem:
              "**Unbounded memory use**: the context allocates until the heap blows up, and the heap is your process’s.",
            destino:
              "`vm` does not limit memory per context. Use a worker thread’s resource limits, or system limits (process, cgroup, container).",
          },
          {
            origem:
              "**A bridge to the host**: you inject `require`, `process`, `console` or a “handy” function, and the code uses it to get out.",
            destino:
              "Never inject modules, `process` or host objects; pass only plain data, preferably copied (JSON or structured clone). Every reference is a bridge back.",
          },
          {
            origem: "**User input executed as code** (`vm.runInNewContext(input)`) to compute expressions.",
            destino:
              "Do not execute input as code. Use an **expression parser** with its own closed grammar, or **WebAssembly**, which only reaches what you import.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "`vm` isolates names, not privileges",
        texto:
          "A new context separates global variables, but the code inside it stays in the **same process, with the same privileges**, competing for the same memory and the same event loop. That is enough to organize trusted code and not enough to contain hostile code. Node’s permission model (see L88) does not replace real isolation either. When in doubt, treat the code as untrusted and put the boundary outside the process.",
      },
    ],
    armadilhas: [
      "Using `vm.runInNewContext` to run user code “safely”: it is the central trap, and the documentation warns against it.",
      "Thinking `timeout` solves loops and denial of service: it covers only synchronous execution and does not limit memory.",
      "Passing host objects or functions into the context (`console`, `process`, `require`, even a plain object): each one is a bridge back to the host.",
      "Expecting `runInThisContext` to isolate anything: it runs in the current global and only cannot see the module’s local variables.",
    ],
    autoteste: [
      {
        pergunta: "Name two legitimate uses of `vm` and say why they are acceptable.",
        resposta:
          "Evaluating formulas or templates written by people you control, and giving each file its own globals in a loader or test framework. The goal is to organize and separate names in trusted code, not to contain an adversary.",
      },
      {
        pergunta: "Why does `timeout` not make `vm` a safe sandbox?",
        resposta:
          "It only interrupts the snippet’s synchronous execution. It does not limit memory, does not cover work scheduled later and does not stop the escape through the constructor, which reaches the main process with all its privileges.",
      },
    ],
  },
};
