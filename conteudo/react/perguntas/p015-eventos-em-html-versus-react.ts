import type { Pergunta } from "../../tipos";

// P15 · Eventos em HTML versus React
export const p015: Pergunta = {
  numero: 415,
  modulo: "pedrincandido-core",
  metodo: "compare",
  pt: {
    titulo: "Eventos em HTML versus React",
    pergunta: "Qual a diferença entre tratamento de eventos em HTML e React?",
    porqueEsteMetodo:
      "A pergunta pede diferenças, e elas são pontuais e paralelas: nome, valor, cancelamento, objeto do evento e lugar do ouvinte. Uma matriz lado a lado mostra tudo de uma vez, e a regra de decisão diz o que fazer na prática.",
    resposta30s:
      'Em HTML você escreve `onclick="fazer()"` em minúsculas, com uma **string de código**, e cancela o padrão com `return false`. Em React escreve `onClick={fazer}` em **camelCase**, passando uma **função**, e cancela com `e.preventDefault()`. O `e` não é o evento nativo, e sim um **evento sintético** (`SyntheticEvent`), um invólucro que dá a mesma interface em todos os navegadores e expõe o nativo em `e.nativeEvent`; os ouvintes ficam na **raiz** da aplicação, que despacha cada evento ao handler certo (**delegação**).',
    blocos: [
      {
        tipo: "tabela",
        titulo: "Tratamento de eventos: HTML x React",
        colunas: ["Aspecto", "HTML", "React (JSX)"],
        linhas: [
          ["Nome do atributo", "Minúsculas: `onclick`, `onsubmit`", "camelCase: `onClick`, `onSubmit`"],
          [
            "O que você passa",
            'Uma string com código, que o navegador transforma em função: `onclick="fazer()"`',
            "Uma função (referência ou closure): `onClick={fazer}`. Não é string",
          ],
          [
            "Cancelar a ação padrão",
            "`return false` no atributo, ou `e.preventDefault()`",
            "Só `e.preventDefault()`: devolver `false` do handler não cancela nada",
          ],
          [
            "Objeto do evento",
            "`Event` nativo, com pequenas diferenças entre navegadores",
            "`SyntheticEvent`: mesma interface em todos os navegadores; o nativo fica em `e.nativeEvent`",
          ],
          [
            "Onde o ouvinte é registrado",
            "No próprio elemento, pelo atributo ou por `addEventListener`",
            "Você não chama `addEventListener`: o React registra ouvintes na raiz e despacha ao handler certo (delegação)",
          ],
          [
            "Mudança em campo de texto",
            "`change` só dispara quando o campo perde o foco; `input` dispara a cada tecla",
            "`onChange` dispara a cada alteração, como o `input` nativo",
          ],
          [
            "Foco e desfoco",
            "`focus` e `blur` não borbulham; `focusin` e `focusout` borbulham",
            "`onFocus` e `onBlur` borbulham pela árvore do React",
          ],
          ["Fase de captura", "`addEventListener(tipo, fn, true)`", "Sufixo `Capture`: `onClickCapture`"],
        ],
        nota: "Nas versões antigas do React os ouvintes ficavam no `document`; hoje ficam no contêiner da raiz. Confira o histórico em react.dev.",
      },
      {
        tipo: "codigo",
        titulo: "O mesmo formulário, na forma do React",
        legenda: "JSX",
        codigo: `// HTML: <form onsubmit="return validar()"> ... <button onclick="salvar()">

import { useState } from "react";

export function Formulario() {
  const [nome, setNome] = useState("");

  function enviar(e) {
    e.preventDefault(); // não existe "return false" em JSX
    console.log("enviando", nome, e.nativeEvent.type); // "submit"
  }

  return (
    <form onSubmit={enviar}>
      <input value={nome} onChange={(e) => setNome(e.target.value)} />
      <button type="submit">Enviar</button>
    </form>
  );
}`,
        nota: "`onChange` roda a cada tecla; `onSubmit` recebe a função `enviar`, sem parênteses.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que é um evento sintético",
        texto:
          "Um **evento sintético** é o objeto que o React entrega aos seus handlers: um invólucro em volta do evento nativo, com a mesma interface dos eventos do DOM (`preventDefault`, `stopPropagation`, `target`, `currentTarget`, `type`…), que se comporta igual em todos os navegadores. Como o React usa **delegação**, ele escuta na raiz, descobre qual elemento React foi o alvo e chama os handlers, simulando a propagação (captura e borbulhamento) pela árvore de componentes. Precisa de algo específico do navegador? Use `e.nativeEvent`. Nas versões antigas os objetos eram reaproveitados (**pooling**) e ler `e` depois de uma operação assíncrona exigia `e.persist()`; nas versões atuais isso não acontece e o `persist()` não faz nada.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Chamar x passar, e handlers inline",
        texto:
          "`onClick={fazer()}` com parênteses **chama** a função durante o render e entrega o retorno ao React como se fosse o handler. Passe a referência, ou uma arrow quando precisar de argumento. Já `onClick={() => fazer(id)}` cria uma função nova a cada render: quase sempre isso não tem importância, mas passa a ter quando ela vai para um filho memorizado com `React.memo` ou entra nas dependências de um hook, porque a identidade nova anula a otimização (veja P16).",
      },
    ],
    armadilhas: [
      "Escrever `onClick={fazer()}`: a função é chamada a cada render e o React recebe o retorno, não a função.",
      "Devolver `false` do handler para cancelar o envio ou o clique: em React só `e.preventDefault()` funciona.",
      "Esperar que `onChange` só dispare quando o usuário sai do campo, como o `change` do HTML: ele dispara a cada alteração.",
      "Tratar o evento sintético como o nativo: para APIs que o React não expõe use `e.nativeEvent`, e lembre que ouvintes adicionados à mão com `addEventListener` recebem eventos nativos e não passam pela delegação do React.",
    ],
    autoteste: [
      {
        pergunta: "Por que `onClick={fazer()}` está errado?",
        resposta:
          "Os parênteses chamam `fazer` durante o render, e o React recebe o retorno (normalmente `undefined`) como handler. Passe a função: `onClick={fazer}`, ou `onClick={() => fazer(x)}` quando precisar de argumentos.",
      },
      {
        pergunta: "O que é um evento sintético e como chegar ao evento nativo?",
        resposta:
          "É o invólucro que o React cria em volta do evento nativo, com a mesma interface em todos os navegadores. O evento nativo está em `e.nativeEvent`.",
      },
    ],
  },
  en: {
    titulo: "Event handling: HTML vs React",
    pergunta: "What is the difference between event handling in HTML and in React?",
    porqueEsteMetodo:
      "The question asks for differences, and they are specific and parallel: name, value, cancelling, the event object and where the listener lives. A side-by-side matrix shows everything at once, and the decision rule says what to do in practice.",
    resposta30s:
      'In HTML you write `onclick="doIt()"` in lowercase, with a **string of code**, and cancel the default with `return false`. In React you write `onClick={doIt}` in **camelCase**, passing a **function**, and cancel with `e.preventDefault()`. The `e` is not the native event but a **synthetic event** (`SyntheticEvent`), a wrapper that gives the same interface in every browser and exposes the native one as `e.nativeEvent`; the listeners live at the application **root**, which dispatches each event to the right handler (**delegation**).',
    blocos: [
      {
        tipo: "tabela",
        titulo: "Event handling: HTML vs React",
        colunas: ["Aspect", "HTML", "React (JSX)"],
        linhas: [
          ["Attribute name", "Lowercase: `onclick`, `onsubmit`", "camelCase: `onClick`, `onSubmit`"],
          [
            "What you pass",
            'A string of code that the browser turns into a function: `onclick="doIt()"`',
            "A function (a reference or a closure): `onClick={doIt}`. Not a string",
          ],
          [
            "Cancelling the default action",
            "`return false` in the attribute, or `e.preventDefault()`",
            "Only `e.preventDefault()`: returning `false` from the handler cancels nothing",
          ],
          [
            "Event object",
            "Native `Event`, with small differences between browsers",
            "`SyntheticEvent`: the same interface in every browser; the native one is in `e.nativeEvent`",
          ],
          [
            "Where the listener is registered",
            "On the element itself, by attribute or by `addEventListener`",
            "You do not call `addEventListener`: React registers listeners at the root and dispatches to the right handler (delegation)",
          ],
          [
            "Change in a text field",
            "`change` only fires when the field loses focus; `input` fires on every keystroke",
            "`onChange` fires on every change, like the native `input`",
          ],
          [
            "Focus and blur",
            "`focus` and `blur` do not bubble; `focusin` and `focusout` do",
            "`onFocus` and `onBlur` bubble through the React tree",
          ],
          ["Capture phase", "`addEventListener(type, fn, true)`", "`Capture` suffix: `onClickCapture`"],
        ],
        nota: "In older versions of React the listeners lived on `document`; today they live on the root container. Check the history on react.dev.",
      },
      {
        tipo: "codigo",
        titulo: "The same form, the React way",
        legenda: "JSX",
        codigo: `// HTML: <form onsubmit="return validate()"> ... <button onclick="save()">

import { useState } from "react";

export function Form() {
  const [name, setName] = useState("");

  function submit(e) {
    e.preventDefault(); // there is no "return false" in JSX
    console.log("submitting", name, e.nativeEvent.type); // "submit"
  }

  return (
    <form onSubmit={submit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Send</button>
    </form>
  );
}`,
        nota: "`onChange` runs on every keystroke; `onSubmit` receives the `submit` function, without parentheses.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What a synthetic event is",
        texto:
          "A **synthetic event** is the object React hands to your handlers: a wrapper around the native event, with the same interface as DOM events (`preventDefault`, `stopPropagation`, `target`, `currentTarget`, `type`…), that behaves the same in every browser. Because React uses **delegation**, it listens at the root, works out which React element was the target and calls the handlers, simulating propagation (capture and bubbling) through the component tree. Need something browser-specific? Use `e.nativeEvent`. In older versions the objects were reused (**pooling**) and reading `e` after an asynchronous operation required `e.persist()`; in current versions that no longer happens and `persist()` does nothing.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Calling vs passing, and inline handlers",
        texto:
          "`onClick={doIt()}` with parentheses **calls** the function during render and hands the return value to React as if it were the handler. Pass the reference, or an arrow when you need an argument. As for `onClick={() => doIt(id)}`, it creates a new function on every render: almost always that does not matter, but it starts to when the function goes to a child wrapped in `React.memo` or into a hook dependency list, because the new identity defeats the optimization (see P16).",
      },
    ],
    armadilhas: [
      "Writing `onClick={doIt()}`: the function is called on every render and React receives the return value, not the function.",
      "Returning `false` from the handler to cancel a submit or a click: in React only `e.preventDefault()` works.",
      "Expecting `onChange` to fire only when the user leaves the field, like the HTML `change`: it fires on every change.",
      "Treating the synthetic event as the native one: for APIs React does not expose use `e.nativeEvent`, and remember that listeners added by hand with `addEventListener` receive native events and do not go through React’s delegation.",
    ],
    autoteste: [
      {
        pergunta: "Why is `onClick={doIt()}` wrong?",
        resposta:
          "The parentheses call `doIt` during render, and React receives the return value (usually `undefined`) as the handler. Pass the function: `onClick={doIt}`, or `onClick={() => doIt(x)}` when you need arguments.",
      },
      {
        pergunta: "What is a synthetic event and how do you reach the native event?",
        resposta:
          "It is the wrapper React creates around the native event, with the same interface in every browser. The native event is in `e.nativeEvent`.",
      },
    ],
  },
};
