import type { Pergunta } from "../../tipos";

// L126 · O que são as Actions
export const l126: Pergunta = {
  numero: 126,
  modulo: "linkedin-react19",
  metodo: "feynman",
  pt: {
    titulo: "O que são as Actions",
    pergunta: "O que são Actions no React?",
    porqueEsteMetodo:
      "Action é um conceito que junta várias peças (transição, formulário, estado pendente, erro, otimismo). Uma imagem do cotidiano ajuda a ver o todo antes dos hooks, e depois o mecanismo real mostra o que o React passa a cuidar por você.",
    resposta30s:
      "Uma **Action** é uma **função, geralmente assíncrona, que o React executa dentro de uma transição** para mudar dados (enviar um formulário, salvar, excluir). Em troca, o React cuida do que dava trabalho: **estado pendente**, **erros**, **atualizações otimistas** e a **ordem** das operações, e `<form action={fn}>` chama a função com os dados do formulário. As peças que acompanham são `useActionState`, `useFormStatus` e `useOptimistic`; é um recurso recente, então confira react.dev.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense numa comanda de restaurante. Você preenche o pedido (o formulário) e entrega ao garçom (o React), que leva à cozinha (o servidor, uma função assíncrona) e já deixa na sua mesa uma plaquinha de “pedido em andamento” (o estado pendente). Se você pedir de novo, ele anota na ordem. Quando a cozinha responde, a plaquinha sai e o prato (o resultado) chega; se faltou ingrediente, o garçom volta com o aviso (o erro). Você não precisa controlar nada disso à mão.",
        tecnico:
          "Uma **Action** é uma função, geralmente assíncrona, que o React executa **dentro de uma transição** para mudar dados. Ao passar uma função para `<form action={fn}>`, o React a chama com os dados do formulário (`FormData`). Como ela roda numa transição, a interface continua responsiva e o React expõe o estado **pendente**, leva um erro lançado ao Error Boundary mais próximo (ou você o devolve como estado), permite **atualizações otimistas** e ajuda a manter a **ordem** das operações. `useActionState`, `useFormStatus` e `useOptimistic` são as peças que expõem essas capacidades. Por convenção, uma prop que espera uma Action costuma se chamar `action` ou terminar em `Action`.",
        limite:
          "A comanda só vale para o que passa pelo balcão: o React cuida do pendente, do erro e da ordem para o que roda dentro de uma transição. Um `await` solto fora de transição, ou uma atualização de estado depois do `await` sem `startTransition`, escapa dessa proteção. E não confunda com a action do Redux (veja L88): lá é um objeto que descreve um evento; aqui é uma função que muda dados.",
      },
      {
        tipo: "tabela",
        titulo: "O que a Action entrega e quem ajuda",
        colunas: ["O que entrega", "Como funciona", "Quem ajuda"],
        linhas: [
          [
            "Estado pendente",
            "Enquanto a função assíncrona roda, o React sabe que há uma operação em andamento e você desabilita botões e mostra progresso",
            "`isPending` de `useTransition` e de `useActionState`; `pending` de `useFormStatus`",
          ],
          [
            "Tratamento de erros",
            "Um erro lançado vai para o Error Boundary mais próximo; um erro esperado (validação) é melhor devolvido como estado",
            "`useActionState` guarda o valor devolvido",
          ],
          [
            "Atualização otimista",
            "A tela mostra o resultado esperado enquanto a operação roda e volta ao estado real quando ela termina",
            "`useOptimistic`",
          ],
          [
            "Ordem das respostas",
            "Em formulários e em `useActionState`, o React lida com a ordem para os casos comuns; com `startTransition` direto ela não é garantida, e você pode precisar de fila ou cancelamento",
            "`<form action>` e `useActionState`",
          ],
          [
            "Formulários",
            "`<form action={fn}>` chama `fn` com `FormData`, e o React reinicia os campos não controlados quando a Action termina com sucesso",
            "`<form action>` e `formAction` do botão",
          ],
          [
            "Servidor",
            "Em frameworks compatíveis, uma Server Function pode ser a Action (veja L149)",
            "Funções marcadas com `use server`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um formulário com uma Action e um botão que sabe do pendente",
        legenda: "TSX",
        codigo: `import { useFormStatus } from "react-dom";

async function salvar(dados: FormData) {
  const resposta = await fetch("/api/contatos", { method: "POST", body: dados });
  if (!resposta.ok) throw new Error("Falha ao salvar"); // vai para o Error Boundary
}

function BotaoSalvar() {
  const { pending } = useFormStatus(); // lê o estado do <form> pai
  return <button disabled={pending}>{pending ? "Salvando…" : "Salvar"}</button>;
}

export function Contato() {
  return (
    <form action={salvar}>
      <input name="email" type="email" required />
      <BotaoSalvar />
    </form>
  );
}`,
        nota: "`salvar` é a Action: o React a chama com o `FormData` dentro de uma transição. `useFormStatus` precisa estar num componente filho do `<form>`, e não no mesmo que o renderiza.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Em uma frase",
        texto:
          "Action = **função assíncrona executada numa transição**. Pendente, erro, otimismo e ordem são consequências disso, e `useActionState`, `useFormStatus` e `useOptimistic` são atalhos para ler e usar essas consequências. Formulários e Server Functions são os usos mais comuns, mas não os únicos.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Recurso recente: confira a documentação",
        texto:
          "As Actions e seus hooks são recentes e a API continua a ser refinada (um deles já mudou de nome). Os detalhes de ordem das operações, de reinício de formulários e de como atualizar estado depois de um `await` dentro de uma transição valem ser conferidos em react.dev para a versão que você usa. O que se mantém: a ideia de função assíncrona numa transição.",
      },
    ],
    armadilhas: [
      "Achar que Action é um recurso só de formulário ou só do servidor: é qualquer função assíncrona executada numa transição; formulários e Server Functions são usos comuns.",
      "Atualizar estado depois de um `await` sem `startTransition`: essa atualização deixa de fazer parte da transição, e o pendente e o otimismo podem se comportar de forma diferente do esperado.",
      "Lançar exceção para erro esperado (validação): a interface cai no Error Boundary em vez de mostrar a mensagem ao lado do campo; devolva o erro como estado.",
      "Chamar `useFormStatus` no mesmo componente que renderiza o `<form>`: ele lê o formulário pai, então precisa estar num componente filho.",
    ],
    autoteste: [
      {
        pergunta: "O que é uma Action no React, em uma frase?",
        resposta:
          "Uma função, geralmente assíncrona, que o React executa dentro de uma transição para mudar dados; em troca ele cuida do estado pendente, dos erros, das atualizações otimistas e da ordem.",
      },
      {
        pergunta: "Que hooks acompanham as Actions e para que serve cada um?",
        resposta:
          "`useActionState` guarda o estado devolvido pela Action e informa se está pendente; `useFormStatus` deixa um componente filho ler o estado do formulário pai; `useOptimistic` mostra um resultado provisório enquanto a Action roda.",
      },
    ],
  },
  en: {
    titulo: "What React Actions are",
    pergunta: "What are Actions in React?",
    porqueEsteMetodo:
      "Action is a concept that ties together several pieces (transition, form, pending state, error, optimism). An everyday picture helps you see the whole before the hooks, and then the real mechanism shows what React now takes care of for you.",
    resposta30s:
      "An **Action** is a **function, usually asynchronous, that React runs inside a transition** to change data (submit a form, save, delete). In return, React takes care of what used to be a chore: **pending state**, **errors**, **optimistic updates** and the **order** of operations, and `<form action={fn}>` calls the function with the form’s data. The accompanying pieces are `useActionState`, `useFormStatus` and `useOptimistic`; it is a recent feature, so check react.dev.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a restaurant order slip. You fill in the order (the form) and hand it to the waiter (React), who takes it to the kitchen (the server, an asynchronous function) and leaves a little “order in progress” sign on your table (the pending state). If you order again, the waiter notes it in sequence. When the kitchen answers, the sign goes away and the dish (the result) arrives; if an ingredient ran out, the waiter comes back with the news (the error). You do not have to manage any of it by hand.",
        tecnico:
          "An **Action** is a function, usually asynchronous, that React runs **inside a transition** to change data. When you pass a function to `<form action={fn}>`, React calls it with the form’s data (`FormData`). Because it runs in a transition, the interface stays responsive and React exposes the **pending** state, sends a thrown error to the nearest Error Boundary (or you return it as state), allows **optimistic updates** and helps keep operations in **order**. `useActionState`, `useFormStatus` and `useOptimistic` are the pieces that expose those capabilities. By convention, a prop that expects an Action is usually named `action` or ends in `Action`.",
        limite:
          "The order slip only covers what goes through the counter: React handles the pending state, the error and the order for what runs inside a transition. A loose `await` outside a transition, or a state update after the `await` without `startTransition`, escapes that protection. And do not confuse it with Redux’s action (see L88): there it is an object describing an event; here it is a function that changes data.",
      },
      {
        tipo: "tabela",
        titulo: "What an Action delivers and what helps",
        colunas: ["What it delivers", "How it works", "What helps"],
        linhas: [
          [
            "Pending state",
            "While the asynchronous function runs, React knows an operation is in progress and you disable buttons and show progress",
            "`isPending` from `useTransition` and `useActionState`; `pending` from `useFormStatus`",
          ],
          [
            "Error handling",
            "A thrown error goes to the nearest Error Boundary; an expected error (validation) is better returned as state",
            "`useActionState` stores the returned value",
          ],
          [
            "Optimistic update",
            "The screen shows the expected result while the operation runs and returns to the real state when it ends",
            "`useOptimistic`",
          ],
          [
            "Order of responses",
            "In forms and in `useActionState`, React handles ordering for the common cases; with a bare `startTransition` it is not guaranteed, and you may need a queue or cancellation",
            "`<form action>` and `useActionState`",
          ],
          [
            "Forms",
            "`<form action={fn}>` calls `fn` with `FormData`, and React resets uncontrolled fields when the Action finishes successfully",
            "`<form action>` and the button’s `formAction`",
          ],
          [
            "Server",
            "In compatible frameworks, a Server Function can be the Action (see L149)",
            "Functions marked with `use server`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A form with an Action and a button that knows about pending",
        legenda: "TSX",
        codigo: `import { useFormStatus } from "react-dom";

async function save(data: FormData) {
  const response = await fetch("/api/contacts", { method: "POST", body: data });
  if (!response.ok) throw new Error("Failed to save"); // goes to the Error Boundary
}

function SaveButton() {
  const { pending } = useFormStatus(); // reads the parent <form> status
  return <button disabled={pending}>{pending ? "Saving…" : "Save"}</button>;
}

export function Contact() {
  return (
    <form action={save}>
      <input name="email" type="email" required />
      <SaveButton />
    </form>
  );
}`,
        nota: "`save` is the Action: React calls it with the `FormData` inside a transition. `useFormStatus` must be in a child component of the `<form>`, not in the same one that renders it.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "In one sentence",
        texto:
          "Action = **an asynchronous function run in a transition**. Pending, error, optimism and ordering are consequences of that, and `useActionState`, `useFormStatus` and `useOptimistic` are shortcuts to read and use those consequences. Forms and Server Functions are the most common uses, but not the only ones.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A recent feature: check the documentation",
        texto:
          "Actions and their hooks are recent and the API is still being refined (one of them has already been renamed). The details of operation ordering, form resets and how to update state after an `await` inside a transition are worth checking on react.dev for the version you use. What stays the same: the idea of an asynchronous function in a transition.",
      },
    ],
    armadilhas: [
      "Thinking Action is a form-only or server-only feature: it is any asynchronous function run in a transition; forms and Server Functions are common uses.",
      "Updating state after an `await` without `startTransition`: that update stops being part of the transition, and the pending state and optimism may behave differently from what you expect.",
      "Throwing an exception for an expected error (validation): the interface falls to the Error Boundary instead of showing the message next to the field; return the error as state.",
      "Calling `useFormStatus` in the same component that renders the `<form>`: it reads the parent form, so it must be in a child component.",
    ],
    autoteste: [
      {
        pergunta: "What is an Action in React, in one sentence?",
        resposta:
          "A function, usually asynchronous, that React runs inside a transition to change data; in return it takes care of the pending state, errors, optimistic updates and ordering.",
      },
      {
        pergunta: "Which hooks go with Actions and what is each one for?",
        resposta:
          "`useActionState` stores the state returned by the Action and reports whether it is pending; `useFormStatus` lets a child component read the parent form’s status; `useOptimistic` shows a provisional result while the Action runs.",
      },
    ],
  },
};
