import type { Pergunta } from "../../tipos";

// L48 · O que é useCallback
export const l048: Pergunta = {
  numero: 48,
  modulo: "linkedin-hooks",
  metodo: "feynman",
  pt: {
    titulo: "O que é useCallback",
    pergunta: "O que é useCallback()?",
    porqueEsteMetodo:
      "A confusão com `useCallback` nasce de não enxergar o problema que ele resolve. A imagem de guardar a mesma ferramenta, em vez de pegar uma cópia nova a cada vez, mostra por que a referência da função importa e quando não importa.",
    resposta30s:
      "A cada renderização o corpo do componente roda de novo e cria funções novas, e duas funções com o mesmo código são valores diferentes para `===`. `useCallback(fn, dependências)` devolve a **mesma função** entre renderizações enquanto as dependências não mudam, o que só traz ganho quando alguém **compara a referência**: um filho em `React.memo` ou uma lista de dependências de efeito. Fora disso é custo sem retorno, e o React Compiler pode fazer essa memoização sozinho.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine um cozinheiro que, a cada pedido, compra uma faca idêntica e joga a anterior fora. A faca corta igual, mas o fiscal que confere o inventário vê um objeto novo toda vez e refaz a conferência. `useCallback` é guardar a faca na gaveta: enquanto as condições (as dependências) forem as mesmas, o cozinheiro usa sempre a mesma faca, e o fiscal não tem o que reclamar.",
        tecnico:
          "O corpo do componente roda a cada renderização e recria as funções declaradas nele. `useCallback(fn, deps)` devolve a **mesma referência** enquanto as dependências (comparadas com `Object.is`) não mudam. Isso importa quando alguém compara a referência: um filho em `React.memo` (que compara as props) ou a lista de dependências de `useEffect`, `useMemo` ou de outro `useCallback`. É equivalente a `useMemo(() => fn, deps)`.",
        limite:
          "A gaveta só ajuda se houver um fiscal. Sem filho memoizado e sem dependência, a função nova é inofensiva e `useCallback` só soma custo. Ele também não impede a função de ser criada a cada renderização: só escolhe qual referência devolver. E a função guardada lembra os valores do momento em que nasceu, então dependências omitidas deixam props e state velhos lá dentro.",
      },
      {
        tipo: "tabela",
        titulo: "Quando `useCallback` ajuda e quando não",
        colunas: ["Situação", "Ajuda?", "Por quê"],
        linhas: [
          [
            "Função passada a um filho em `React.memo`",
            "Sim",
            "A referência estável deixa o filho pular a renderização (as outras props também precisam ser estáveis)",
          ],
          [
            "Função listada como dependência de `useEffect`, `useMemo` ou `useCallback`",
            "Às vezes",
            "Sem referência estável, o efeito roda a cada renderização; antes, avalie mover a função para dentro do efeito",
          ],
          [
            "Handler passado a `<button onClick>` ou a um filho sem `memo`",
            "Não",
            "Nada compara a referência, e criar a função é barato",
          ],
          ["Função usada só dentro do próprio componente", "Não", "Ninguém de fora observa a identidade dela"],
          [
            "A função `set` devolvida por `useState`",
            "Desnecessário",
            "O React já garante que a identidade dela não muda",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um filho memoizado que não renderiza à toa",
        legenda: "TSX",
        codigo: `import { memo, useCallback, useState } from "react";

const Botao = memo(function Botao({ aoClicar }: { aoClicar: () => void }) {
  console.log("Botao renderizou");
  return <button onClick={aoClicar}>+1</button>;
});

export function Contador() {
  const [total, setTotal] = useState(0);
  const [texto, setTexto] = useState("");

  // Mesma referência em toda renderização: não há dependências.
  const somar = useCallback(() => setTotal((t) => t + 1), []);

  return (
    <>
      <input value={texto} onChange={(e) => setTexto(e.target.value)} />
      <p>{total}</p>
      <Botao aoClicar={somar} />
    </>
  );
}`,
        nota: "Digitar no campo re-renderiza `Contador`; como `somar` é estável e `Botao` está em `memo`, o botão não renderiza de novo. Sem `useCallback`, ele renderizaria a cada tecla. A forma `(t) => t + 1` evita listar `total` nas dependências.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Use `useCallback` só quando houver **quem compare a referência**: um filho em `React.memo` ou uma lista de dependências. Sem filho memoizado e sem dependência, deixe a função solta. Para guardar o **resultado** de uma chamada, o Hook certo é `useMemo` (veja L47).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O React Compiler muda o jogo",
        texto:
          "Com o React Compiler, a memoização de funções e valores pode ser feita automaticamente na compilação, e em código novo escrever `useCallback` à mão tende a ser desnecessário. Ele continua válido como controle explícito, por exemplo para fixar a identidade de uma função usada como dependência de efeito. Confira em react.dev o que o compilador cobre e como ligá-lo.",
      },
    ],
    armadilhas: [
      "Aplicar `useCallback` em todo handler por reflexo: cada chamada guarda e compara dependências, e o ganho é zero quando ninguém compara a referência.",
      "Usar `useCallback` e esquecer o `React.memo` no filho, ou passar outra prop nova (um objeto ou array literal): a referência estável da função não adianta, o filho renderiza de qualquer jeito.",
      "Omitir dependências para manter a função estável: ela enxerga props e state de uma renderização antiga (stale closure). Use a forma funcional de `setState` ou um ref, sem esconder o aviso do lint.",
      "Achar que `useCallback` evita criar a função ou a torna mais rápida: ela é criada em toda renderização, e o Hook só decide qual referência devolver.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a relação entre `useCallback` e `useMemo`?",
        resposta:
          "`useCallback(fn, deps)` equivale a `useMemo(() => fn, deps)`: o primeiro guarda a função; `useMemo` guarda o resultado de executar uma função.",
      },
      {
        pergunta: "Um `<button onClick={...}>` ganha algo com `useCallback`?",
        resposta:
          "Em geral, não. O elemento do DOM não se importa com a identidade do handler. O ganho só aparece quando a função alimenta um filho em `memo` ou uma lista de dependências.",
      },
    ],
  },
  en: {
    titulo: "What useCallback is",
    pergunta: "What is useCallback()?",
    porqueEsteMetodo:
      "The confusion around `useCallback` comes from not seeing the problem it solves. The image of keeping the same tool instead of grabbing a new copy every time shows why a function’s reference matters and when it does not.",
    resposta30s:
      "On every render the component body runs again and creates new functions, and two functions with the same code are different values for `===`. `useCallback(fn, dependencies)` returns the **same function** across renders while the dependencies do not change, which only pays off when someone **compares the reference**: a child in `React.memo` or an effect’s dependency list. Otherwise it is cost with no return, and the React Compiler can do this memoization on its own.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine a cook who, for every order, buys an identical knife and throws the previous one away. The knife cuts the same, but the inspector checking the inventory sees a new object every time and redoes the check. `useCallback` is keeping the knife in a drawer: as long as the conditions (the dependencies) stay the same, the cook uses the same knife, and the inspector has nothing to flag.",
        tecnico:
          "The component body runs on every render and recreates the functions declared in it. `useCallback(fn, deps)` returns the **same reference** while the dependencies (compared with `Object.is`) do not change. That matters when someone compares the reference: a child in `React.memo` (which compares props) or the dependency list of `useEffect`, `useMemo` or another `useCallback`. It is equivalent to `useMemo(() => fn, deps)`.",
        limite:
          "The drawer only helps if there is an inspector. With no memoized child and no dependency, the new function is harmless and `useCallback` just adds cost. It also does not stop the function from being created on every render: it only chooses which reference to return. And the stored function remembers the values from the moment it was born, so omitted dependencies leave stale props and state inside it.",
      },
      {
        tipo: "tabela",
        titulo: "When `useCallback` helps and when it does not",
        colunas: ["Situation", "Helps?", "Why"],
        linhas: [
          [
            "A function passed to a child in `React.memo`",
            "Yes",
            "A stable reference lets the child skip rendering (the other props must be stable too)",
          ],
          [
            "A function listed as a dependency of `useEffect`, `useMemo` or `useCallback`",
            "Sometimes",
            "Without a stable reference the effect runs on every render; first consider moving the function inside the effect",
          ],
          [
            "A handler passed to `<button onClick>` or to a child without `memo`",
            "No",
            "Nothing compares the reference, and creating the function is cheap",
          ],
          ["A function used only inside the component itself", "No", "Nobody outside observes its identity"],
          [
            "The `set` function returned by `useState`",
            "Unnecessary",
            "React already guarantees its identity does not change",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A memoized child that does not render for nothing",
        legenda: "TSX",
        codigo: `import { memo, useCallback, useState } from "react";

const Button = memo(function Button({ onPress }: { onPress: () => void }) {
  console.log("Button rendered");
  return <button onClick={onPress}>+1</button>;
});

export function Counter() {
  const [total, setTotal] = useState(0);
  const [text, setText] = useState("");

  // Same reference on every render: there are no dependencies.
  const add = useCallback(() => setTotal((t) => t + 1), []);

  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <p>{total}</p>
      <Button onPress={add} />
    </>
  );
}`,
        nota: "Typing in the field re-renders `Counter`; because `add` is stable and `Button` is in `memo`, the button does not render again. Without `useCallback`, it would render on every keystroke. The `(t) => t + 1` form avoids listing `total` in the dependencies.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Use `useCallback` only when **someone compares the reference**: a child in `React.memo` or a dependency list. With no memoized child and no dependency, leave the function alone. To store the **result** of a call, the right Hook is `useMemo` (see L47).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The React Compiler changes the game",
        texto:
          "With the React Compiler, memoizing functions and values can happen automatically at compile time, and in new code writing `useCallback` by hand tends to be unnecessary. It remains valid as explicit control, for example to pin the identity of a function used as an effect dependency. Check react.dev for what the compiler covers and how to turn it on.",
      },
    ],
    armadilhas: [
      "Applying `useCallback` to every handler by reflex: each call stores and compares dependencies, and the gain is zero when nobody compares the reference.",
      "Using `useCallback` but forgetting `React.memo` on the child, or passing another new prop (an object or array literal): the stable function reference does not help, and the child renders anyway.",
      "Omitting dependencies to keep the function stable: it sees props and state from an old render (a stale closure). Use the functional form of `setState` or a ref instead of hiding the lint warning.",
      "Thinking `useCallback` avoids creating the function or makes it faster: it is created on every render, and the Hook only decides which reference to return.",
    ],
    autoteste: [
      {
        pergunta: "How are `useCallback` and `useMemo` related?",
        resposta:
          "`useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`: the first stores the function; `useMemo` stores the result of running a function.",
      },
      {
        pergunta: "Does a `<button onClick={...}>` gain anything from `useCallback`?",
        resposta:
          "Usually not. The DOM element does not care about the handler’s identity. The gain only appears when the function feeds a child in `memo` or a dependency list.",
      },
    ],
  },
};
