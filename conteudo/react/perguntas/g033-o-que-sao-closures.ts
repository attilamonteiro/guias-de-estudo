import type { Pergunta } from "../../tipos";

// G33 · O que são closures
export const g033: Pergunta = {
  numero: 333,
  modulo: "glassdoor-javascript",
  metodo: "feynman",
  pt: {
    titulo: "O que são closures",
    pergunta: "O que são closures em JavaScript?",
    porqueEsteMetodo:
      "Closure se entende melhor com uma imagem: a função que carrega uma mochila. Depois vêm o mecanismo (escopo léxico) e o ponto em que a imagem engana, que é onde moram os bugs de verdade em React.",
    resposta30s:
      "Uma **closure** é uma função que **lembra das variáveis do escopo onde foi criada**, mesmo depois que esse escopo terminou, graças ao **escopo léxico**: o que uma função enxerga depende de onde ela foi escrita. Serve para **estado privado, funções fábrica, memoização e callbacks**, e é a base dos hooks. O custo: em React, uma função de um render antigo pode ler valores velhos (**stale closure**), e variáveis capturadas podem manter memória viva.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine que cada função, ao nascer, ganha uma **mochila** e coloca nela as variáveis do lugar onde nasceu. Ela pode ser levada para qualquer lugar, passada a outra pessoa ou chamada daqui a uma hora: quando precisar de uma variável que não é dela, abre a mochila e usa.",
        tecnico:
          "Uma **closure** é a combinação de uma função com o **ambiente léxico** em que foi criada. O JavaScript usa **escopo léxico**: o alcance de uma variável é definido pela posição no código, e a função, ao ser criada, guarda uma referência ao escopo externo. Isso aparece sempre que uma função interna sobrevive ao retorno da externa (ela é devolvida, passada como callback ou guardada). As variáveis capturadas continuam vivas enquanto a função puder ser alcançada.",
        limite:
          "A mochila não guarda **cópias**: guarda **ligações para as variáveis vivas**. Se a variável muda, quem a carrega vê a mudança, e duas funções criadas no mesmo escopo compartilham a mesma. É por isso que o `var` num laço dá `3 3 3` e que, em React, uma função de um render antigo continua vendo o valor daquele render (stale closure). E a mochila impede o coletor de lixo de liberar o que está nela enquanto a função existir.",
      },
      {
        tipo: "codigo",
        titulo: "Contador e função fábrica",
        legenda: "JavaScript",
        codigo: `function criarContador() {
  let total = 0; // vive no escopo de criarContador
  return () => ++total; // a função interna leva total na mochila
}

const a = criarContador();
const b = criarContador();
a(); // 1
a(); // 2
b(); // 1: cada chamada cria a sua própria mochila
// total não é acessível de fora: é estado privado

const multiplicarPor = (n) => (x) => x * n; // função fábrica
const dobro = multiplicarPor(2);
dobro(5); // 10`,
      },
      {
        tipo: "tabela",
        titulo: "Onde as closures aparecem, e o cuidado de cada uma",
        colunas: ["Uso", "Como a closure entra", "Cuidado"],
        linhas: [
          [
            "Estado privado (encapsulamento)",
            "A variável fica no escopo externo e só as funções devolvidas a alcançam",
            "Cada chamada à fábrica cria um estado novo e independente",
          ],
          [
            "Função fábrica",
            "`multiplicarPor(2)` devolve uma função que lembra do `2`",
            "Os parâmetros capturados ficam vivos enquanto a função existir",
          ],
          [
            "Memoização e cache",
            "O cache vive no escopo externo da função memoizada",
            "Cache sem limite vira vazamento de memória",
          ],
          [
            "Callbacks e handlers",
            "O callback usa variáveis do lugar que o registrou (`onClick`, `setTimeout`, `.then`)",
            "Executa depois: o valor lido pode ter ficado velho",
          ],
          [
            "Hooks do React",
            "Cada render cria funções que capturam as props e o estado **daquele render**",
            "Efeitos e intervalos com dependências erradas leem valores antigos (stale closure)",
          ],
          [
            "Laços com `var`",
            "Todas as funções compartilham o mesmo `i`",
            "`for (var i…)` com timers imprime o valor final; use `let`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Stale closure num useEffect",
        legenda: "JSX",
        codigo: `import { useEffect, useState } from "react";

function RelogioComBug() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setS(s + 1), 1000); // s ficou preso em 0: a tela para em 1
    return () => clearInterval(id);
  }, []);
  return <p>{s}</p>;
}

function Relogio() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setS((atual) => atual + 1), 1000); // não depende do s capturado
    return () => clearInterval(id);
  }, []);
  return <p>{s}</p>;
}`,
        nota: "O efeito com `[]` roda uma vez e a função do intervalo captura o `s` daquele primeiro render. A versão funcional (`s => s + 1`) pede ao React o valor atual em vez de depender da variável capturada.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Stale closure e memória",
        texto:
          "Em React, cada render é um instantâneo: as funções criadas nele enxergam as props e o estado daquele instante. Um efeito que roda uma vez (`[]`) e usa uma variável de estado vê sempre o primeiro valor. Soluções: declarar as dependências corretamente, usar a forma funcional (`setX((v) => v + 1)`), guardar o valor mais recente numa `ref` ou, para ler o último valor dentro de um efeito sem reexecutá-lo, o recurso recente `useEffectEvent` (confira o estado atual em react.dev). Quanto à memória: ouvintes, timers e caches que guardam closures com objetos grandes impedem a coleta; remova-os na limpeza do efeito (veja L72).",
      },
    ],
    armadilhas: [
      "Achar que a closure copia o valor: ela guarda a ligação com a variável (por isso `var` em laço com timer imprime o valor final).",
      "Efeito ou callback com dependências erradas, ou `[]`, que lê estado: valores velhos (stale closure).",
      "Guardar funções que capturam objetos grandes em ouvintes, timers ou caches e não removê-los: a memória não é liberada.",
      "Esperar que `setX(x + 1)` chamado várias vezes no mesmo handler some os incrementos: todas as chamadas leem o mesmo `x` do render; use a forma funcional.",
    ],
    autoteste: [
      {
        pergunta:
          "Por que `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i))` imprime 3 3 3, e como corrigir?",
        resposta:
          "Com `var` há uma única variável `i` para o laço todo, e os callbacks, que rodam depois, leem o valor final. Use `let` (uma variável nova por iteração) ou uma função que receba `i`.",
      },
      {
        pergunta: "O que é uma stale closure em React?",
        resposta:
          "Uma função criada num render antigo, por exemplo dentro de um `useEffect` ou `setInterval` sem as dependências certas, que continua lendo as props e o estado daquele render. Resolve-se com dependências corretas, atualização funcional ou uma `ref`.",
      },
    ],
  },
  en: {
    titulo: "What closures are",
    pergunta: "What are closures in JavaScript?",
    porqueEsteMetodo:
      "A closure is easier to grasp with an image: a function carrying a backpack. Then come the mechanism (lexical scope) and the point where the image misleads, which is where the real bugs live in React.",
    resposta30s:
      "A **closure** is a function that **remembers the variables of the scope where it was created**, even after that scope has finished, thanks to **lexical scope**: what a function can see depends on where it was written. It is used for **private state, factory functions, memoization and callbacks**, and it underlies hooks. The cost: in React, a function from an old render may read stale values (a **stale closure**), and captured variables may keep memory alive.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine that every function, when it is born, gets a **backpack** and puts in it the variables from the place where it was born. It can be taken anywhere, handed to someone else or called an hour later: when it needs a variable that is not its own, it opens the backpack and uses it.",
        tecnico:
          "A **closure** is the combination of a function with the **lexical environment** in which it was created. JavaScript uses **lexical scope**: a variable’s reach is defined by its position in the code, and a function, when created, keeps a reference to the outer scope. This shows up whenever an inner function outlives the outer one’s return (it is returned, passed as a callback or stored). The captured variables stay alive as long as the function can be reached.",
        limite:
          "The backpack does not hold **copies**: it holds **links to the live variables**. If the variable changes, whoever carries it sees the change, and two functions created in the same scope share the same one. That is why `var` in a loop gives `3 3 3` and why, in React, a function from an old render keeps seeing that render’s value (a stale closure). And the backpack keeps the garbage collector from freeing what is in it for as long as the function exists.",
      },
      {
        tipo: "codigo",
        titulo: "Counter and factory function",
        legenda: "JavaScript",
        codigo: `function createCounter() {
  let total = 0; // lives in createCounter's scope
  return () => ++total; // the inner function carries total in its backpack
}

const a = createCounter();
const b = createCounter();
a(); // 1
a(); // 2
b(); // 1: each call creates its own backpack
// total is not reachable from outside: it is private state

const multiplyBy = (n) => (x) => x * n; // factory function
const double = multiplyBy(2);
double(5); // 10`,
      },
      {
        tipo: "tabela",
        titulo: "Where closures show up, and the caution for each",
        colunas: ["Use", "How the closure comes in", "Caution"],
        linhas: [
          [
            "Private state (encapsulation)",
            "The variable stays in the outer scope and only the returned functions reach it",
            "Each call to the factory creates a new, independent state",
          ],
          [
            "Factory function",
            "`multiplyBy(2)` returns a function that remembers the `2`",
            "Captured parameters stay alive as long as the function exists",
          ],
          [
            "Memoization and caching",
            "The cache lives in the memoized function’s outer scope",
            "An unbounded cache becomes a memory leak",
          ],
          [
            "Callbacks and handlers",
            "The callback uses variables from the place that registered it (`onClick`, `setTimeout`, `.then`)",
            "It runs later: the value it reads may have gone stale",
          ],
          [
            "React hooks",
            "Each render creates functions that capture the props and state **of that render**",
            "Effects and intervals with wrong dependencies read old values (stale closure)",
          ],
          [
            "Loops with `var`",
            "All the functions share the same `i`",
            "`for (var i…)` with timers prints the final value; use `let`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A stale closure in a useEffect",
        legenda: "JSX",
        codigo: `import { useEffect, useState } from "react";

function BuggyClock() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setS(s + 1), 1000); // s is stuck at 0: the screen stops at 1
    return () => clearInterval(id);
  }, []);
  return <p>{s}</p>;
}

function Clock() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setS((current) => current + 1), 1000); // does not depend on the captured s
    return () => clearInterval(id);
  }, []);
  return <p>{s}</p>;
}`,
        nota: "The effect with `[]` runs once and the interval’s function captures the `s` of that first render. The functional version (`s => s + 1`) asks React for the current value instead of depending on the captured variable.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Stale closures and memory",
        texto:
          "In React, every render is a snapshot: the functions created in it see that moment’s props and state. An effect that runs once (`[]`) and uses a state variable always sees the first value. Fixes: declare the dependencies correctly, use the functional form (`setX((v) => v + 1)`), keep the latest value in a `ref` or, to read the latest value inside an effect without rerunning it, the recent `useEffectEvent` feature (check its current status on react.dev). As for memory: listeners, timers and caches that hold closures with large objects prevent collection; remove them in the effect cleanup (see L72).",
      },
    ],
    armadilhas: [
      "Thinking the closure copies the value: it keeps a link to the variable (which is why `var` in a loop with a timer prints the final value).",
      "An effect or callback with wrong dependencies, or `[]`, that reads state: stale values (a stale closure).",
      "Keeping functions that capture large objects in listeners, timers or caches and never removing them: the memory is not freed.",
      "Expecting `setX(x + 1)` called several times in the same handler to add up: every call reads the same `x` from that render; use the functional form.",
    ],
    autoteste: [
      {
        pergunta:
          "Why does `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i))` print 3 3 3, and how do you fix it?",
        resposta:
          "With `var` there is a single `i` for the whole loop, and the callbacks, which run later, read the final value. Use `let` (a new variable per iteration) or a function that takes `i`.",
      },
      {
        pergunta: "What is a stale closure in React?",
        resposta:
          "A function created in an old render, for example inside a `useEffect` or `setInterval` without the right dependencies, that keeps reading that render’s props and state. Fix it with correct dependencies, a functional update or a `ref`.",
      },
    ],
  },
};
