import type { Pergunta } from "../../tipos";

// L127 · O que é useActionState
export const l127: Pergunta = {
  numero: 127,
  modulo: "linkedin-react19",
  metodo: "trace",
  pt: {
    titulo: "O que é useActionState",
    pergunta: "O que é useActionState()?",
    porqueEsteMetodo:
      "O `useActionState` confunde porque três coisas acontecem em tempos diferentes: a função roda, o estado pendente liga e desliga, e o valor devolvido vira estado. Seguir um único envio de formulário, do clique ao novo estado, alinha tudo isso.",
    resposta30s:
      "**`useActionState(acao, estadoInicial)`** liga uma função de Action a um estado e devolve **`[estado, acaoDoFormulario, pendente]`**. Ao enviar o formulário, o React chama `acao(estadoAnterior, dadosDoFormulario)`, mantém `pendente` verdadeiro enquanto ela roda e guarda o **valor devolvido** como o novo `estado`, que a interface mostra (erros, mensagens). É um hook recente, que já teve outro nome (`useFormState`); confira react.dev.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Um envio de formulário, do clique ao novo estado",
        etapas: [
          "Primeira renderização: `estado` vale o `estadoInicial` (`{ erro: null }`) e `pendente` é `false`; a `acao` devolvida vai em `<form action={acao}>`",
          "O usuário envia o formulário: o React chama a sua função com dois argumentos, o **estado anterior** e o **`FormData`**, dentro de uma transição, e `pendente` passa a `true`",
          "A função valida e chama o servidor (`await`); enquanto isso a interface segue responsiva e o botão pode mostrar “Enviando…”",
          "A função termina e **devolve** um valor, por exemplo `{ erro: 'E-mail inválido' }`",
          "O React guarda esse valor como o novo `estado`, volta `pendente` a `false` e renderiza de novo: a mensagem de erro aparece",
          "No próximo envio, a função recebe esse estado como `estadoAnterior`, útil para acumular, contar tentativas ou manter o que o usuário já fez",
        ],
      },
      {
        tipo: "codigo",
        titulo: "Formulário de inscrição com `useActionState`",
        legenda: "TSX",
        codigo: `import { useActionState } from "react";

type Estado = { erro: string | null; salvo?: boolean };
async function inscrever(_anterior: Estado, dados: FormData): Promise<Estado> {
  const email = String(dados.get("email") ?? "");
  if (!email.includes("@")) return { erro: "E-mail inválido" }; // erro esperado: devolva, não lance
  await fetch("/api/inscricoes", { method: "POST", body: dados });
  return { erro: null, salvo: true };
}

export function Inscricao() {
  const [estado, acao, pendente] = useActionState(inscrever, { erro: null });
  return (
    <form action={acao}>
      <input name="email" type="email" />
      <button disabled={pendente}>{pendente ? "Enviando…" : "Inscrever"}</button>
      {estado.erro && <p role="alert">{estado.erro}</p>}
      {estado.salvo && <p role="status">Inscrição feita!</p>}
    </form>
  );
}`,
        nota: "A função recebe `(estadoAnterior, dados)`; aqui o estado anterior não é usado. Erros esperados são **devolvidos**; só os inesperados são lançados.",
      },
      {
        tipo: "passos",
        titulo: "Os desvios do caminho feliz",
        passos: [
          {
            titulo: "Erro esperado (validação)",
            texto:
              "Devolva um objeto de erro como estado, como no código: a tela mostra a mensagem e o formulário continua utilizável. É o uso principal do hook.",
          },
          {
            titulo: "Exceção lançada",
            texto:
              "Se a função lançar, o estado não é atualizado e o erro sobe para o Error Boundary mais próximo. Reserve isso para falhas inesperadas.",
          },
          {
            titulo: "Vários envios seguidos",
            texto:
              "As chamadas da Action devolvida são tratadas em ordem, e cada uma recebe o estado deixado pela anterior; por isso o `estadoAnterior` é confiável. Confira react.dev para os detalhes do comportamento atual.",
          },
          {
            titulo: "Com Server Functions e sem JavaScript",
            texto:
              "Quando a Action é uma Server Function (`use server`) e o formulário vem do servidor, ele pode ser enviado como uma requisição comum antes de o JavaScript carregar: o servidor executa a função e devolve a página já com o novo estado. O terceiro argumento opcional de `useActionState` (o `permalink`) indica a URL para onde o navegador vai nesse caso, e o framework cuida do resto.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Os três retornos",
        texto:
          "`const [estado, acao, pendente] = useActionState(fn, estadoInicial)`: **`estado`** é o último valor devolvido por `fn` (no início, o inicial); **`acao`** é a versão da função que você passa a `<form action>` (ou ao `formAction` de um botão); **`pendente`** é um booleano verdadeiro enquanto a Action roda. A assinatura de `fn` muda: ela recebe `(estadoAnterior, ...argumentos)`, e num formulário o argumento é o `FormData`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Recurso recente, nome antigo",
        texto:
          "O hook foi lançado com outro nome (`useFormState`, do pacote `react-dom`) e hoje vem do pacote `react`; textos antigos ainda usam o nome anterior. Não o confunda com `useFormStatus`, que só lê o estado do formulário pai (veja L162). Confira react.dev para a API atual.",
      },
    ],
    armadilhas: [
      "Esquecer o argumento do estado anterior: com `useActionState` a função recebe `(estadoAnterior, dados)`, e quem escreve `(dados) =>` lê o argumento errado.",
      "Lançar exceção para erros de validação: o usuário vê o Error Boundary, não a mensagem ao lado do campo; devolva o erro como estado.",
      "Confundir com `useFormStatus`: ele só diz se o formulário pai está pendente, enquanto `useActionState` guarda o resultado e também informa a pendência.",
      "Guardar no estado devolvido algo que não pode ser serializado quando a Action é uma Server Function: o valor precisa atravessar a rede.",
    ],
    autoteste: [
      {
        pergunta: "Que três valores `useActionState` devolve e o que cada um é?",
        resposta:
          "`[estado, acao, pendente]`: o último valor devolvido pela função (ou o inicial), a função a passar para `<form action>` e um booleano que é verdadeiro enquanto a Action roda.",
      },
      {
        pergunta: "O que a função recebe e o que ela deve devolver?",
        resposta:
          "Recebe o estado anterior e, num formulário, o `FormData`. Deve devolver o novo estado (por exemplo, um erro ou uma mensagem de sucesso), que o React guarda e a interface exibe.",
      },
    ],
  },
  en: {
    titulo: "What useActionState is",
    pergunta: "What is useActionState()?",
    porqueEsteMetodo:
      "`useActionState` confuses people because three things happen at different times: the function runs, the pending state switches on and off, and the returned value becomes state. Following a single form submission, from the click to the new state, lines it all up.",
    resposta30s:
      "**`useActionState(action, initialState)`** connects an Action function to a piece of state and returns **`[state, formAction, isPending]`**. When the form is submitted, React calls `action(previousState, formData)`, keeps `isPending` true while it runs and stores the **returned value** as the new `state`, which the interface shows (errors, messages). It is a recent hook that already had another name (`useFormState`); check react.dev.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One form submission, from the click to the new state",
        etapas: [
          "First render: `state` equals the `initialState` (`{ error: null }`) and `isPending` is `false`; the returned `formAction` goes into `<form action={formAction}>`",
          "The user submits the form: React calls your function with two arguments, the **previous state** and the **`FormData`**, inside a transition, and `isPending` becomes `true`",
          "The function validates and calls the server (`await`); meanwhile the interface stays responsive and the button can show “Sending…”",
          "The function finishes and **returns** a value, for example `{ error: 'Invalid e-mail' }`",
          "React stores that value as the new `state`, sets `isPending` back to `false` and renders again: the error message appears",
          "On the next submission, the function receives that state as `previousState`, useful for accumulating, counting attempts or keeping what the user already did",
        ],
      },
      {
        tipo: "codigo",
        titulo: "Sign-up form with `useActionState`",
        legenda: "TSX",
        codigo: `import { useActionState } from "react";

type State = { error: string | null; saved?: boolean };
async function subscribe(_previous: State, data: FormData): Promise<State> {
  const email = String(data.get("email") ?? "");
  if (!email.includes("@")) return { error: "Invalid e-mail" }; // expected error: return it, do not throw
  await fetch("/api/subscriptions", { method: "POST", body: data });
  return { error: null, saved: true };
}

export function Subscribe() {
  const [state, formAction, isPending] = useActionState(subscribe, { error: null });
  return (
    <form action={formAction}>
      <input name="email" type="email" />
      <button disabled={isPending}>{isPending ? "Sending…" : "Subscribe"}</button>
      {state.error && <p role="alert">{state.error}</p>}
      {state.saved && <p role="status">You are subscribed!</p>}
    </form>
  );
}`,
        nota: "The function receives `(previousState, data)`; here the previous state is not used. Expected errors are **returned**; only unexpected ones are thrown.",
      },
      {
        tipo: "passos",
        titulo: "The detours from the happy path",
        passos: [
          {
            titulo: "Expected error (validation)",
            texto:
              "Return an error object as state, as in the code: the screen shows the message and the form stays usable. This is the hook’s main use.",
          },
          {
            titulo: "A thrown exception",
            texto:
              "If the function throws, the state is not updated and the error climbs to the nearest Error Boundary. Reserve this for unexpected failures.",
          },
          {
            titulo: "Several submissions in a row",
            texto:
              "Calls to the returned Action are handled in order, and each one receives the state left by the previous one; that is why `previousState` is reliable. Check react.dev for the details of the current behaviour.",
          },
          {
            titulo: "With Server Functions and without JavaScript",
            texto:
              "When the Action is a Server Function (`use server`) and the form comes from the server, it can be submitted as an ordinary request before the JavaScript loads: the server runs the function and returns the page already with the new state. The optional third argument of `useActionState` (the `permalink`) gives the URL the browser goes to in that case, and the framework handles the rest.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The three return values",
        texto:
          "`const [state, formAction, isPending] = useActionState(fn, initialState)`: **`state`** is the last value returned by `fn` (at first, the initial one); **`formAction`** is the version of the function you pass to `<form action>` (or to a button’s `formAction`); **`isPending`** is a boolean that is true while the Action runs. The signature of `fn` changes: it receives `(previousState, ...arguments)`, and in a form the argument is the `FormData`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A recent feature with an old name",
        texto:
          "The hook shipped under another name (`useFormState`, from the `react-dom` package) and now comes from the `react` package; older articles still use the previous name. Do not confuse it with `useFormStatus`, which only reads the parent form’s status (see L162). Check react.dev for the current API.",
      },
    ],
    armadilhas: [
      "Forgetting the previous-state argument: with `useActionState` the function receives `(previousState, data)`, and anyone who writes `(data) =>` reads the wrong argument.",
      "Throwing an exception for validation errors: the user sees the Error Boundary, not the message next to the field; return the error as state.",
      "Confusing it with `useFormStatus`: that one only says whether the parent form is pending, while `useActionState` stores the result and also reports the pending state.",
      "Putting something non-serializable in the returned state when the Action is a Server Function: the value has to travel over the network.",
    ],
    autoteste: [
      {
        pergunta: "Which three values does `useActionState` return and what is each one?",
        resposta:
          "`[state, formAction, isPending]`: the last value returned by the function (or the initial one), the function to pass to `<form action>`, and a boolean that is true while the Action runs.",
      },
      {
        pergunta: "What does the function receive and what should it return?",
        resposta:
          "It receives the previous state and, in a form, the `FormData`. It should return the new state (for example an error or a success message), which React stores and the interface displays.",
      },
    ],
  },
};
