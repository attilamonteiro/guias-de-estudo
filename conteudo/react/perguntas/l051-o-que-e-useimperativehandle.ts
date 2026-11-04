import type { Pergunta } from "../../tipos";

// L51 · O que é useImperativeHandle
export const l051: Pergunta = {
  numero: 51,
  modulo: "linkedin-hooks",
  metodo: "design",
  pt: {
    titulo: "O que é useImperativeHandle",
    pergunta: "O que é useImperativeHandle()?",
    porqueEsteMetodo:
      "Uma API imperativa mal desenhada vira porta dos fundos do componente. Partir do requisito, definir o contrato mínimo e só então implementar mostra o que expor, o que esconder e quando nem usar o Hook.",
    resposta30s:
      "`useImperativeHandle(ref, criar, deps)` define **o que o `ref` recebido do pai revela**: em vez do nó do DOM, um objeto com **comandos** como `focar()`, `rolarParaOTopo()` ou `limpar()`. É um **último recurso**, para ações que props não expressam bem; o fluxo declarativo (props, state elevado, `key`) vem primeiro. Nas versões recentes o `ref` chega como prop de componente de função, e antes se usava `forwardRef`; confira react.dev.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado: um campo de texto com API mínima",
        passos: [
          {
            titulo: "1. O problema",
            texto:
              "O pai precisa **mandar** o filho fazer algo pontual: focar o campo depois de um erro, limpar o formulário, rolar uma lista até o topo, tocar ou pausar um vídeo. São comandos, não dados. Antes de seguir, pergunte se dá para resolver de forma declarativa (uma prop como `autoFocus` ou `open`, estado elevado, uma `key` para reiniciar o filho). Se der, pare aqui.",
          },
          {
            titulo: "2. O contrato mínimo",
            texto:
              "Liste só os verbos de que o pai precisa (`focar`, `limpar`), com nomes de intenção, e tipe o contrato. Não exponha o nó do DOM nem setters internos: o que o ref revela vira API pública do componente, e cada método extra é um compromisso.",
          },
          {
            titulo: "3. A implementação",
            texto:
              "Dentro do filho, guarde o nó numa ref **interna** e chame `useImperativeHandle(ref, () => ({ focar, limpar }), deps)`. O React coloca o objeto devolvido em `ref.current` do pai. O pai nunca recebe o `<input>`.",
          },
          {
            titulo: "4. As dependências",
            texto:
              "A função `criar` roda de novo quando as dependências mudam. Se os métodos só usam refs internas, `[]` basta. Se leem props ou state, liste-os, senão o pai chama uma versão velha. Sem o array, o objeto é recriado a cada renderização.",
          },
          {
            titulo: "5. O uso no pai",
            texto:
              "O pai guarda um `useRef` e chama os métodos em **eventos ou efeitos**, nunca durante a renderização, e com `?.`: `current` é `null` antes de montar e depois de desmontar.",
          },
          {
            titulo: "6. Testes e documentação",
            texto:
              "Trate o contrato como API pública: teste chamando os métodos pelo ref e conferindo um efeito observável (o foco foi para o campo, o valor foi limpo). Se o contrato crescer demais, é sinal de que faltam props.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O filho expõe só dois comandos",
        legenda: "TSX",
        codigo: `import { useImperativeHandle, useRef, type Ref } from "react";

export type CampoApi = { focar(): void; limpar(): void };

export function Campo({ ref }: { ref?: Ref<CampoApi> }) {
  const input = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focar() {
      input.current?.focus();
    },
    limpar() {
      if (input.current) input.current.value = "";
    },
  }), []);

  return <input ref={input} />;
}`,
        nota: "Nas versões recentes do React, `ref` chega como prop comum em componentes de função; nas anteriores, o componente é envolvido em `forwardRef` e recebe o ref como segundo argumento. Confira react.dev para a forma atual.",
      },
      {
        tipo: "codigo",
        titulo: "O pai usa o contrato, sem tocar no DOM do filho",
        legenda: "TSX",
        codigo: `import { useRef } from "react";
import { Campo, type CampoApi } from "./Campo";

export function Formulario() {
  const campo = useRef<CampoApi>(null);

  return (
    <>
      <Campo ref={campo} />
      <button onClick={() => campo.current?.focar()}>Focar</button>
      <button onClick={() => campo.current?.limpar()}>Limpar</button>
    </>
  );
}`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Primeiro tente o fluxo declarativo: props, estado elevado, `key`. Só use `useImperativeHandle` para **comandos pontuais** (foco, rolagem, reprodução) que não cabem em props, e exponha **ações**, nunca o nó do DOM inteiro.",
      },
    ],
    armadilhas: [
      "Usar para o que props resolvem (abrir um modal, definir um valor): o código vira uma sequência de chamadas imperativas, difícil de seguir e de testar.",
      "Expor o nó do DOM ou métodos demais: o pai passa a depender de detalhes internos, e qualquer mudança no filho quebra quem o usa.",
      "Omitir ou errar as dependências: os métodos enxergam props e state velhos. Sem o array, o objeto é recriado a cada renderização.",
      "Chamar os métodos durante a renderização ou antes de montar: `ref.current` é `null`. Chame em eventos ou efeitos, com `?.`.",
    ],
    autoteste: [
      {
        pergunta: "O que o pai recebe em `ref.current` quando o filho usa `useImperativeHandle`?",
        resposta: "O objeto que a função `criar` devolve (por exemplo `{ focar, limpar }`), não o nó do DOM.",
      },
      {
        pergunta: "Quando preferir props a `useImperativeHandle`?",
        resposta:
          "Sempre que o comportamento puder ser descrito como estado ou entrada (`open`, `value`, `autoFocus`, uma `key` para reiniciar). O handle serve a comandos pontuais, como foco, rolagem e reprodução.",
      },
    ],
  },
  en: {
    titulo: "What useImperativeHandle is",
    pergunta: "What is useImperativeHandle()?",
    porqueEsteMetodo:
      "A poorly designed imperative API becomes a back door into the component. Starting from the requirement, defining the minimal contract and only then implementing shows what to expose, what to hide and when not to use the Hook at all.",
    resposta30s:
      "`useImperativeHandle(ref, create, deps)` defines **what the `ref` received from the parent reveals**: instead of the DOM node, an object with **commands** such as `focus()`, `scrollToTop()` or `clear()`. It is a **last resort**, for actions that props cannot express well; the declarative flow (props, lifted state, `key`) comes first. In recent versions `ref` arrives as a prop of function components, and before that `forwardRef` was used; check react.dev.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied: a text field with a minimal API",
        passos: [
          {
            titulo: "1. The problem",
            texto:
              "The parent needs to **tell** the child to do something specific: focus the field after an error, clear the form, scroll a list to the top, play or pause a video. These are commands, not data. Before going on, ask whether it can be solved declaratively (a prop such as `autoFocus` or `open`, lifted state, a `key` to reset the child). If it can, stop here.",
          },
          {
            titulo: "2. The minimal contract",
            texto:
              "List only the verbs the parent needs (`focus`, `clear`), with intent-revealing names, and type the contract. Do not expose the DOM node or internal setters: what the ref reveals becomes the component’s public API, and every extra method is a commitment.",
          },
          {
            titulo: "3. The implementation",
            texto:
              "Inside the child, keep the node in an **internal** ref and call `useImperativeHandle(ref, () => ({ focus, clear }), deps)`. React puts the returned object in the parent’s `ref.current`. The parent never receives the `<input>`.",
          },
          {
            titulo: "4. The dependencies",
            texto:
              "The `create` function runs again when the dependencies change. If the methods only use internal refs, `[]` is enough. If they read props or state, list them, or the parent calls a stale version. Without the array, the object is recreated on every render.",
          },
          {
            titulo: "5. Use in the parent",
            texto:
              "The parent keeps a `useRef` and calls the methods in **events or effects**, never during rendering, and with `?.`: `current` is `null` before mounting and after unmounting.",
          },
          {
            titulo: "6. Tests and documentation",
            texto:
              "Treat the contract as a public API: test by calling the methods through the ref and checking an observable effect (focus moved to the field, the value was cleared). If the contract grows too large, it is a sign that props are missing.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The child exposes only two commands",
        legenda: "TSX",
        codigo: `import { useImperativeHandle, useRef, type Ref } from "react";

export type FieldApi = { focus(): void; clear(): void };

export function Field({ ref }: { ref?: Ref<FieldApi> }) {
  const input = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      input.current?.focus();
    },
    clear() {
      if (input.current) input.current.value = "";
    },
  }), []);

  return <input ref={input} />;
}`,
        nota: "In recent versions of React, `ref` arrives as an ordinary prop in function components; in earlier ones, the component is wrapped in `forwardRef` and receives the ref as a second argument. Check react.dev for the current form.",
      },
      {
        tipo: "codigo",
        titulo: "The parent uses the contract, without touching the child’s DOM",
        legenda: "TSX",
        codigo: `import { useRef } from "react";
import { Field, type FieldApi } from "./Field";

export function Form() {
  const field = useRef<FieldApi>(null);

  return (
    <>
      <Field ref={field} />
      <button onClick={() => field.current?.focus()}>Focus</button>
      <button onClick={() => field.current?.clear()}>Clear</button>
    </>
  );
}`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Try the declarative flow first: props, lifted state, `key`. Use `useImperativeHandle` only for **one-off commands** (focus, scrolling, playback) that do not fit in props, and expose **actions**, never the whole DOM node.",
      },
    ],
    armadilhas: [
      "Using it for what props solve (opening a modal, setting a value): the code turns into a sequence of imperative calls, hard to follow and to test.",
      "Exposing the DOM node or too many methods: the parent starts depending on internal details, and any change in the child breaks its users.",
      "Omitting or getting the dependencies wrong: the methods see stale props and state. Without the array, the object is recreated on every render.",
      "Calling the methods during rendering or before mounting: `ref.current` is `null`. Call them in events or effects, with `?.`.",
    ],
    autoteste: [
      {
        pergunta: "What does the parent receive in `ref.current` when the child uses `useImperativeHandle`?",
        resposta: "The object the `create` function returns (for example `{ focus, clear }`), not the DOM node.",
      },
      {
        pergunta: "When should you prefer props over `useImperativeHandle`?",
        resposta:
          "Whenever the behavior can be described as state or input (`open`, `value`, `autoFocus`, a `key` to reset). The handle is for one-off commands such as focus, scrolling and playback.",
      },
    ],
  },
};
