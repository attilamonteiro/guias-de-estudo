import type { Pergunta } from "../../tipos";

// L129 · O que é useFormStatus
export const l129: Pergunta = {
  numero: 129,
  modulo: "linkedin-react19",
  metodo: "compare",
  pt: {
    titulo: "O que é useFormStatus",
    pergunta: "O que é useFormStatus()?",
    porqueEsteMetodo:
      "O `useFormStatus` costuma ser confundido com o `useActionState` e com um `isPending` feito à mão, e a regra de uso (só em um filho do form) é o que pega as pessoas. Lado a lado, fica claro o que cada um devolve, onde é chamado e quando escolher qual.",
    resposta30s:
      "O `useFormStatus` é um hook do `react-dom` que lê o **estado do envio do `<form>` pai**: devolve `{ pending, data, method, action }` sem passar props. Ele só funciona em um **componente filho do form**, nunca no mesmo componente que renderiza o `<form>`, e serve para desabilitar o botão e mostrar “Enviando…”. Para obter o **resultado** da action (erros, mensagem), use `useActionState`.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Três formas de saber que o envio está pendente",
        colunas: ["Critério", "`useFormStatus`", "`useActionState`", "`isPending` manual"],
        linhas: [
          [
            "O que devolve",
            "`{ pending, data, method, action }` do `<form>` pai: `data` é o `FormData` enviado (ou `null` sem envio) e `action` é a função do form",
            "`[estado, formAction, isPending]`: o último retorno da action, a action para o form e o pendente",
            "Um booleano que você mantém com `useState` (ou o `isPending` do `useTransition`)",
          ],
          [
            "Onde é chamado",
            "Em um componente **dentro** do `<form>` (um botão, um aviso)",
            "No componente que cria o form e é dono da action",
            "Em qualquer componente, com ou sem `<form>`",
          ],
          [
            "Traz o resultado da action?",
            "Não: só o estado do envio em andamento",
            "Sim: o valor retornado pela action (erros de validação, mensagem de sucesso)",
            "Só o que você guardar à mão",
          ],
          [
            "Bom para",
            "Botão de envio, spinner ou campo reutilizável, sem receber props de carregamento",
            "Formulário que precisa mostrar o resultado ou os erros da action",
            "Um envio fora de `<form>` (um clique que chama uma API) ou lógica própria",
          ],
        ],
        nota: "O `useFormStatus` vem de `react-dom`; `useActionState` e `useTransition` vêm de `react`. Recurso do conjunto de Actions: confira os detalhes em react.dev.",
      },
      {
        tipo: "codigo",
        titulo: "Botão de envio que lê o form pai",
        legenda: "TSX",
        codigo: `import { useFormStatus } from "react-dom";

function BotaoEnviar() {
  const { pending } = useFormStatus(); // lê o <form> pai, sem props
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Enviando…" : "Enviar"}
    </button>
  );
}

export function FormularioContato({ enviar }: { enviar: (dados: FormData) => Promise<void> }) {
  return (
    <form action={enviar}>
      <input name="email" type="email" required />
      <BotaoEnviar /> {/* filho do form: aqui o pending funciona */}
    </form>
  );
}`,
        nota: "Chamar `useFormStatus()` direto em `FormularioContato`, o componente que renderiza o `<form>`, devolveria `pending` sempre `false`: ali não existe um form pai.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Se o componente que precisa saber do envio está **dentro do form**, longe do dono da action, use `useFormStatus`: ele evita repassar `isPending` por props. Se o componente é o **dono** do form e precisa do resultado da action, use `useActionState`, que já traz o `isPending`. Fora de um `<form>`, use `useTransition` ou um estado seu.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Onde ele deixa de funcionar",
        texto:
          "O hook olha **para cima**, para o `<form>` ancestral: no mesmo componente do `<form>`, `pending` fica sempre `false`. Ele acompanha os envios feitos pela propriedade `action` do form; para um fluxo com `onSubmit` e `fetch` manuais, mantenha seu próprio estado. E ele só lê: desabilitar o botão não impede um reenvio por outros meios, então a proteção contra duplicidade continua sendo do servidor (veja L127 para o resultado da action).",
      },
    ],
    armadilhas: [
      "Chamar `useFormStatus` no mesmo componente que renderiza o `<form>`: o `pending` nunca vira `true`. Extraia um componente filho, como o botão.",
      "Esperar que ele devolva o resultado ou o erro da action: ele só informa o envio em andamento. Para o resultado, use `useActionState` (veja L127).",
      "Importar o hook de `react` em vez de `react-dom`, ou usá-lo com `onSubmit` e `fetch` manuais, sem `action`: o estado não acompanha esse fluxo.",
      "Achar que desabilitar o botão basta contra o envio duplicado: a proteção definitiva é no servidor, com idempotência.",
    ],
    autoteste: [
      {
        pergunta: "Por que meu `useFormStatus` sempre devolve `pending: false`?",
        resposta:
          "Provavelmente ele é chamado no mesmo componente que renderiza o `<form>`. O hook lê o form **pai**; mova a chamada para um componente filho, como o botão de envio.",
      },
      {
        pergunta: "Quando usar `useFormStatus` e quando `useActionState`?",
        resposta:
          "`useFormStatus` em um filho do form (botão, spinner) que só precisa saber se está enviando, sem props. `useActionState` no dono da action, para obter o resultado (erros, mensagem) e também o `isPending`.",
      },
    ],
  },
  en: {
    titulo: "What useFormStatus is",
    pergunta: "What is useFormStatus()?",
    porqueEsteMetodo:
      "`useFormStatus` is easily confused with `useActionState` and with a hand-rolled `isPending`, and its usage rule (only in a child of the form) is what trips people up. Side by side, it becomes clear what each returns, where it is called and when to pick which.",
    resposta30s:
      "`useFormStatus` is a `react-dom` hook that reads the **submission state of the parent `<form>`**: it returns `{ pending, data, method, action }` without passing props. It only works in a **child component of the form**, never in the same component that renders the `<form>`, and it is used to disable the button and show “Submitting…”. To get the **result** of the action (errors, a message), use `useActionState`.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Three ways to know a submission is pending",
        colunas: ["Criterion", "`useFormStatus`", "`useActionState`", "Manual `isPending`"],
        linhas: [
          [
            "What it returns",
            "`{ pending, data, method, action }` of the parent `<form>`: `data` is the submitted `FormData` (or `null` with no submission) and `action` is the form’s function",
            "`[state, formAction, isPending]`: the action’s last return value, the action to give the form and the pending flag",
            "A boolean you keep with `useState` (or the `isPending` from `useTransition`)",
          ],
          [
            "Where it is called",
            "In a component **inside** the `<form>` (a button, a notice)",
            "In the component that creates the form and owns the action",
            "In any component, with or without a `<form>`",
          ],
          [
            "Does it carry the action’s result?",
            "No: only the state of the submission in progress",
            "Yes: the value returned by the action (validation errors, a success message)",
            "Only what you store by hand",
          ],
          [
            "Good for",
            "A submit button, spinner or reusable field that receives no loading props",
            "A form that must show the action’s result or errors",
            "A submission outside a `<form>` (a click that calls an API) or custom logic",
          ],
        ],
        nota: "`useFormStatus` comes from `react-dom`; `useActionState` and `useTransition` come from `react`. It belongs to the Actions feature set: check the details on react.dev.",
      },
      {
        tipo: "codigo",
        titulo: "A submit button that reads the parent form",
        legenda: "TSX",
        codigo: `import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus(); // reads the parent <form>, no props
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting…" : "Submit"}
    </button>
  );
}

export function ContactForm({ send }: { send: (data: FormData) => Promise<void> }) {
  return (
    <form action={send}>
      <input name="email" type="email" required />
      <SubmitButton /> {/* child of the form: pending works here */}
    </form>
  );
}`,
        nota: "Calling `useFormStatus()` directly in `ContactForm`, the component that renders the `<form>`, would return `pending` as `false` forever: there is no parent form there.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "If the component that needs to know about the submission is **inside the form**, far from the owner of the action, use `useFormStatus`: it avoids passing `isPending` down through props. If the component **owns** the form and needs the action’s result, use `useActionState`, which already brings `isPending`. Outside a `<form>`, use `useTransition` or your own state.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Where it stops working",
        texto:
          "The hook looks **upward**, at the ancestor `<form>`: in the same component as the `<form>`, `pending` is always `false`. It tracks submissions made through the form’s `action` prop; for a flow with a manual `onSubmit` and `fetch`, keep your own state. And it only reads: disabling the button does not prevent a resubmission by other means, so protection against duplicates remains the server’s job (see L127 for the action’s result).",
      },
    ],
    armadilhas: [
      "Calling `useFormStatus` in the same component that renders the `<form>`: `pending` never becomes `true`. Extract a child component, such as the button.",
      "Expecting it to return the action’s result or error: it only reports the submission in progress. For the result, use `useActionState` (see L127).",
      "Importing the hook from `react` instead of `react-dom`, or using it with a manual `onSubmit` and `fetch`, without `action`: the state does not follow that flow.",
      "Thinking that disabling the button is enough against double submission: the definitive protection is on the server, with idempotency.",
    ],
    autoteste: [
      {
        pergunta: "Why does my `useFormStatus` always return `pending: false`?",
        resposta:
          "It is probably called in the same component that renders the `<form>`. The hook reads the **parent** form; move the call into a child component, such as the submit button.",
      },
      {
        pergunta: "When should I use `useFormStatus` and when `useActionState`?",
        resposta:
          "`useFormStatus` in a child of the form (button, spinner) that only needs to know whether it is submitting, with no props. `useActionState` in the owner of the action, to get the result (errors, a message) and also `isPending`.",
      },
    ],
  },
};
