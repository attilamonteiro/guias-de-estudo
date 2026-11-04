import type { Pergunta } from "../../tipos";

// M47 · Para que serve forwardRef
export const m047: Pergunta = {
  numero: 747,
  modulo: "medium-avancado",
  metodo: "whys",
  pt: {
    titulo: "Para que serve forwardRef",
    pergunta: "Qual é a finalidade do forwardRef no React?",
    porqueEsteMetodo:
      "O `forwardRef` só faz sentido depois de entender o problema que ele resolve, e esse problema nasce de decisões do React sobre o que é uma prop e o que é uma ref. Seguir os “por quês” dá a explicação e mostra o que mudou.",
    resposta30s:
      "Uma `ref` **não é uma prop comum**: em componentes de função, nas versões anteriores às mais recentes, `<Campo ref={r} />` não entrega a `ref` ao componente e `r.current` fica `null`. O **`forwardRef`** envolve o componente e passa a `ref` como segundo argumento, para você ligá-la a um nó interno (um `<input>`, por exemplo) e o pai poder focá-lo ou medi-lo; com `useImperativeHandle` dá para expor só alguns métodos. Nas versões mais recentes, a `ref` vira uma **prop comum** em componentes de função e o `forwardRef` fica desnecessário: confira react.dev.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que um pai precisa do nó DOM de um filho?",
            resposta:
              "Para ações imperativas que props e estado não expressam bem: focar um campo, rolar até um elemento, medir um tamanho, tocar um vídeo. Para isso o React oferece as refs, que apontam para o nó.",
          },
          {
            pergunta: "Por que a `ref` não chega ao filho sozinha?",
            resposta:
              "Porque `ref` (como `key`) é tratada de forma especial pelo React e não faz parte de `props`. Além disso, um componente de função não tem instância para a ref apontar. O resultado: `ref` fica `null` e o React avisa que componentes de função não recebem refs.",
          },
          {
            pergunta: "Por que o `forwardRef` resolve isso?",
            resposta:
              "Ele envolve o componente e entrega a ref recebida como segundo argumento da função. Você a repassa a um nó interno (`<input ref={ref} />`), e a ref do pai passa a apontar para esse nó.",
          },
          {
            pergunta: "Por que às vezes é melhor não entregar o nó inteiro?",
            resposta:
              "Expor o DOM do filho deixa o pai mexer em qualquer detalhe interno, o que acopla os dois. Com `useImperativeHandle(ref, () => ({ focar() { ... } }))`, o pai enxerga só os métodos que o filho decidiu expor (veja M34).",
          },
          {
            pergunta: "Por que isso mudou nas versões recentes?",
            resposta:
              "O tratamento especial da ref era uma fonte de confusão e de código extra. Nas versões mais recentes, componentes de função recebem `ref` como uma prop comum, bastando lê-la nos parâmetros. A documentação indica que o `forwardRef` deve ser descontinuado no futuro, mas o código existente segue funcionando: confira react.dev.",
          },
        ],
        causaRaiz:
          "Refs são um canal à parte das props. O `forwardRef` (ou, nas versões novas, a ref como prop) abre esse canal até o nó que o pai precisa alcançar.",
      },
      {
        tipo: "codigo",
        titulo: "forwardRef: o pai foca o input do filho",
        legenda: "TSX",
        codigo: [
          'import { forwardRef, useRef } from "react";',
          "",
          "const Campo = forwardRef<HTMLInputElement, { rotulo: string }>(function Campo({ rotulo }, ref) {",
          "  return (",
          "    <label>",
          "      {rotulo} <input ref={ref} />",
          "    </label>",
          "  );",
          "});",
          "",
          "export function Formulario() {",
          "  const campo = useRef<HTMLInputElement>(null);",
          "  return (",
          "    <>",
          '      <Campo ref={campo} rotulo="Nome" />',
          "      <button onClick={() => campo.current?.focus()}>Focar</button>",
          "    </>",
          "  );",
          "}",
        ].join("\n"),
        nota: "Sem o `forwardRef`, `campo.current` ficaria `null` e o botão não faria nada.",
      },
      {
        tipo: "codigo",
        titulo: "ref como prop, mostrando só o que o pai precisa",
        legenda: "TSX",
        codigo: [
          'import { useImperativeHandle, useRef, type Ref } from "react";',
          "",
          "export interface CampoApi {",
          "  focar(): void;",
          "}",
          "",
          "function Campo({ ref, rotulo }: { ref?: Ref<CampoApi>; rotulo: string }) {",
          "  const entrada = useRef<HTMLInputElement>(null);",
          "",
          "  // o pai enxerga só `focar`, não o <input>",
          "  useImperativeHandle(ref, () => ({ focar: () => entrada.current?.focus() }), []);",
          "",
          "  return (",
          "    <label>",
          "      {rotulo} <input ref={entrada} />",
          "    </label>",
          "  );",
          "}",
        ].join("\n"),
        nota: "Aqui a `ref` chega como prop, sem `forwardRef`, o que depende de uma versão recente do React. Nas versões anteriores, a mesma ideia usa `forwardRef` com `useImperativeHandle`. O pai cria `useRef<CampoApi>(null)` e chama `campo.current?.focar()`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Refs são uma saída de emergência",
        texto:
          "Use ref para ações imperativas (foco, rolagem, medição, mídia), não para dados que deveriam ser props ou estado (veja C19 e M15). Encaminhe a ref a **um** nó que o pai precise alcançar, e evite entregar o DOM inteiro quando uma ação basta. Ler `ref.current` durante a renderização é um erro: na primeira renderização ele ainda é `null`.",
      },
    ],
    armadilhas: [
      "Esperar a `ref` em `props.ref` onde ainda é preciso `forwardRef`: ela não chega.",
      "Esquecer de repassar a `ref` ao nó interno dentro do `forwardRef`: o componente a recebe e a ref do pai continua `null`.",
      "Entregar o nó DOM inteiro quando o pai só precisa de uma ação: prefira `useImperativeHandle` com poucos métodos.",
      "Usar a ref como atalho para mexer no DOM do filho no lugar de props e estado, ou ler `ref.current` durante a renderização.",
    ],
    autoteste: [
      {
        pergunta:
          "O que acontece com `<Campo ref={r} />` em um componente de função sem `forwardRef`, nas versões anteriores às mais recentes?",
        resposta:
          "A ref não é entregue ao componente: `r.current` fica `null` e o React avisa. Com `forwardRef`, a ref chega como segundo argumento e você a liga a um nó interno.",
      },
      {
        pergunta: "Para que serve o `useImperativeHandle` junto com o `forwardRef`?",
        resposta:
          "Para limitar o que o pai enxerga: em vez do nó DOM inteiro, o filho expõe um objeto com poucos métodos, como `focar`.",
      },
    ],
  },
  en: {
    titulo: "Purpose of forwardRef",
    pergunta: "What is the purpose of forwardRef in React?",
    porqueEsteMetodo:
      "`forwardRef` only makes sense once you understand the problem it solves, and that problem comes from React’s decisions about what a prop is and what a ref is. Following the “whys” gives the explanation and shows what changed.",
    resposta30s:
      "A `ref` is **not an ordinary prop**: on function components, in versions before the most recent ones, `<Field ref={r} />` does not hand the `ref` to the component and `r.current` stays `null`. **`forwardRef`** wraps the component and passes the `ref` as a second argument, so you can attach it to an inner node (an `<input>`, for example) and the parent can focus or measure it; with `useImperativeHandle` you can expose only a few methods. In the most recent versions, `ref` becomes an **ordinary prop** on function components and `forwardRef` is unnecessary: check react.dev.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does a parent need a child’s DOM node?",
            resposta:
              "For imperative actions that props and state do not express well: focusing a field, scrolling to an element, measuring a size, playing a video. React offers refs for that; they point to the node.",
          },
          {
            pergunta: "Why does the `ref` not reach the child on its own?",
            resposta:
              "Because `ref` (like `key`) is treated specially by React and is not part of `props`. Also, a function component has no instance for the ref to point to. The result: `ref` stays `null` and React warns that function components cannot receive refs.",
          },
          {
            pergunta: "Why does `forwardRef` fix this?",
            resposta:
              "It wraps the component and hands the received ref over as the function’s second argument. You pass it on to an inner node (`<input ref={ref} />`), and the parent’s ref now points to that node.",
          },
          {
            pergunta: "Why is it sometimes better not to hand over the whole node?",
            resposta:
              "Exposing the child’s DOM lets the parent poke at any internal detail, which couples the two. With `useImperativeHandle(ref, () => ({ focus() { ... } }))`, the parent sees only the methods the child chose to expose (see M34).",
          },
          {
            pergunta: "Why did this change in recent versions?",
            resposta:
              "The special treatment of ref was a source of confusion and extra code. In the most recent versions, function components receive `ref` as an ordinary prop, so you just read it from the parameters. The documentation indicates that `forwardRef` is to be deprecated in the future, but existing code keeps working: check react.dev.",
          },
        ],
        causaRaiz:
          "Refs are a channel separate from props. `forwardRef` (or, in new versions, ref as a prop) opens that channel down to the node the parent needs to reach.",
      },
      {
        tipo: "codigo",
        titulo: "forwardRef: the parent focuses the child’s input",
        legenda: "TSX",
        codigo: [
          'import { forwardRef, useRef } from "react";',
          "",
          "const Field = forwardRef<HTMLInputElement, { label: string }>(function Field({ label }, ref) {",
          "  return (",
          "    <label>",
          "      {label} <input ref={ref} />",
          "    </label>",
          "  );",
          "});",
          "",
          "export function Form() {",
          "  const field = useRef<HTMLInputElement>(null);",
          "  return (",
          "    <>",
          '      <Field ref={field} label="Name" />',
          "      <button onClick={() => field.current?.focus()}>Focus</button>",
          "    </>",
          "  );",
          "}",
        ].join("\n"),
        nota: "Without `forwardRef`, `field.current` would stay `null` and the button would do nothing.",
      },
      {
        tipo: "codigo",
        titulo: "ref as a prop, showing only what the parent needs",
        legenda: "TSX",
        codigo: [
          'import { useImperativeHandle, useRef, type Ref } from "react";',
          "",
          "export interface FieldApi {",
          "  focus(): void;",
          "}",
          "",
          "function Field({ ref, label }: { ref?: Ref<FieldApi>; label: string }) {",
          "  const input = useRef<HTMLInputElement>(null);",
          "",
          "  // the parent sees only `focus`, not the <input>",
          "  useImperativeHandle(ref, () => ({ focus: () => input.current?.focus() }), []);",
          "",
          "  return (",
          "    <label>",
          "      {label} <input ref={input} />",
          "    </label>",
          "  );",
          "}",
        ].join("\n"),
        nota: "Here the `ref` arrives as a prop, without `forwardRef`, which depends on a recent React version. In earlier versions, the same idea uses `forwardRef` with `useImperativeHandle`. The parent creates `useRef<FieldApi>(null)` and calls `field.current?.focus()`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Refs are an escape hatch",
        texto:
          "Use a ref for imperative actions (focus, scrolling, measuring, media), not for data that should be props or state (see C19 and M15). Forward the ref to **one** node the parent needs to reach, and avoid handing over the whole DOM when one action is enough. Reading `ref.current` during render is a mistake: on the first render it is still `null`.",
      },
    ],
    armadilhas: [
      "Expecting the ref in `props.ref` where `forwardRef` is still needed: it does not arrive.",
      "Forgetting to pass the `ref` on to the inner node inside `forwardRef`: the component receives it and the parent’s ref stays `null`.",
      "Handing over the whole DOM node when the parent only needs one action: prefer `useImperativeHandle` with a few methods.",
      "Using the ref as a shortcut to poke at the child’s DOM instead of props and state, or reading `ref.current` during render.",
    ],
    autoteste: [
      {
        pergunta:
          "What happens with `<Field ref={r} />` on a function component without `forwardRef`, in versions before the most recent ones?",
        resposta:
          "The ref is not handed to the component: `r.current` stays `null` and React warns. With `forwardRef`, the ref arrives as the second argument and you attach it to an inner node.",
      },
      {
        pergunta: "What is `useImperativeHandle` for when used with `forwardRef`?",
        resposta:
          "To limit what the parent sees: instead of the whole DOM node, the child exposes an object with a few methods, such as `focus`.",
      },
    ],
  },
};
