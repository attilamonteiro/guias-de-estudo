import type { Pergunta } from "../../tipos";

// L157 · Envio assíncrono de formulários
export const l157: Pergunta = {
  numero: 157,
  modulo: "linkedin-formularios-e-dados",
  metodo: "trace",
  pt: {
    titulo: "Envio assíncrono de formulários",
    pergunta: "Como você lida com o envio assíncrono de formulários?",
    porqueEsteMetodo:
      "Um envio é uma sequência de estados que a pessoa enxerga: clique, espera, sucesso ou erro. Seguir um envio do começo ao fim, inclusive onde ele falha, mostra o que a interface precisa dizer em cada passo.",
    resposta30s:
      "Um envio passa por **parado → enviando → enviado ou erro**: no clique você chama `preventDefault`, valida, marca “enviando” (botão desabilitado, carregamento visível), faz o `fetch`, **confere `resposta.ok`** (o `fetch` não rejeita em 4xx e 5xx), mostra o sucesso ou o erro e **sempre** sai do estado “enviando”. O React moderno oferece **Actions** (`<form action>`, `useActionState`, `useFormStatus`) que cuidam do estado pendente por você; os detalhes dependem da versão, então confira react.dev.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Um envio, no caminho feliz",
        etapas: [
          "A pessoa clica em “Enviar” (ou aperta Enter): o navegador dispara `submit` e o `onSubmit` chama `preventDefault()` para não navegar para outra página",
          "A validação do cliente passa (veja L156); se falhar, o fluxo para aqui, sem requisição",
          "O estado vira “enviando”: botão desabilitado, texto “Enviando…” e erro anterior limpo; o React re-renderiza antes de a resposta chegar",
          "O `fetch` sai com os dados (`FormData` ou JSON) e a interface continua responsiva enquanto espera",
          'A resposta chega com status 2xx: o estado vira “enviado”, a interface confirma (`role="status"`) e os campos são limpos ou a pessoa segue para a próxima tela',
        ],
        nota: "Em todos os desfechos o estado “enviando” precisa terminar (`finally` ou o equivalente), senão o botão fica preso. O indicador de carregamento pode ser texto no botão, `aria-busy` ou um esqueleto da tela.",
      },
      {
        tipo: "passos",
        titulo: "Agora os caminhos em que dá errado",
        passos: [
          {
            titulo: "O servidor recusa (4xx)",
            texto:
              "O `fetch` **não rejeita** em 400 ou 422: a promise resolve com `ok === false`. Confira `resposta.ok`, leia o corpo, mostre cada erro no campo certo e mantenha o que a pessoa digitou.",
          },
          {
            titulo: "A rede falha ou estoura o tempo",
            texto:
              "Aqui o `fetch` rejeita (um `TypeError` ou um erro de aborto). Capture no `catch`, mostre uma mensagem clara (“Não foi possível enviar. Verifique a conexão e tente de novo”), libere o botão e preserve os dados para outra tentativa.",
          },
          {
            titulo: "O servidor falha (5xx)",
            texto:
              "Mensagem genérica, sem detalhes técnicos, e botão liberado. Se o envio pode ter funcionado e a resposta se perdeu, uma nova tentativa duplica o efeito: o servidor deve aceitar uma chave de idempotência.",
          },
          {
            titulo: "Clique duplo ou saída da tela",
            texto:
              "`disabled` no botão evita o segundo clique, mas uma guarda no manipulador cobre Enter e cliques rápidos. Um botão desabilitado perde o foco do teclado; a alternativa é `aria-disabled` e ignorar o clique. Se a tela for desmontada, cancele a requisição com `AbortController`.",
          },
          {
            titulo: "Limpar o erro",
            texto:
              'O erro some quando um novo envio começa ou quando a pessoa corrige o campo. Erro de campo fica junto do campo; erro geral vai num aviso com `role="alert"`.',
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Caminho clássico: onSubmit com fetch",
        legenda: "TSX",
        codigo: [
          'import { useState, type FormEvent } from "react";',
          "export function Contato() {",
          '  const [estado, setEstado] = useState<"parado" | "enviando" | "enviado" | "erro">("parado");',
          "  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {",
          "    evento.preventDefault();",
          '    if (estado === "enviando") return; // barreira extra contra envio duplo',
          "    const dados = new FormData(evento.currentTarget); // leia antes do primeiro await",
          '    setEstado("enviando");',
          '    const ok = await fetch("/api/contato", { method: "POST", body: dados })',
          "      .then((resposta) => resposta.ok) // 4xx e 5xx não rejeitam: confira o status",
          "      .catch(() => false); // falha de rede",
          '    setEstado(ok ? "enviado" : "erro");',
          "  }",
          "  return (",
          "    <form onSubmit={aoEnviar}>",
          '      <textarea name="mensagem" required />',
          '      <button disabled={estado === "enviando"}>{estado === "enviando" ? "Enviando…" : "Enviar"}</button>',
          '      {estado === "erro" && <p role="alert">Não foi possível enviar. Tente de novo.</p>}',
          '      {estado === "enviado" && <p role="status">Mensagem enviada.</p>}',
          "    </form>",
          "  );",
          "}",
        ].join("\n"),
        nota: "Você escreve a máquina de estados e protege cada saída. Em código real, separe a mensagem de rede da mensagem de recusa do servidor.",
      },
      {
        tipo: "codigo",
        titulo: "Caminho moderno: Action com useActionState",
        legenda: "TSX",
        codigo: [
          'import { useActionState } from "react";',
          "",
          "type Estado = { erro: string | null; enviado: boolean };",
          "",
          "async function enviarContato(_anterior: Estado, dados: FormData): Promise<Estado> {",
          '  const ok = await fetch("/api/contato", { method: "POST", body: dados })',
          "    .then((resposta) => resposta.ok)",
          "    .catch(() => false);",
          '  return ok ? { erro: null, enviado: true } : { erro: "Não foi possível enviar. Tente de novo.", enviado: false };',
          "}",
          "",
          "export function Contato() {",
          "  const [estado, acao, pendente] = useActionState(enviarContato, { erro: null, enviado: false });",
          "  return (",
          "    <form action={acao}>",
          '      <textarea name="mensagem" required />',
          '      <button disabled={pendente}>{pendente ? "Enviando…" : "Enviar"}</button>',
          '      {estado.erro && <p role="alert">{estado.erro}</p>}',
          '      {estado.enviado && <p role="status">Mensagem enviada.</p>}',
          "    </form>",
          "  );",
          "}",
        ].join("\n"),
        nota: "O React marca a Action como pendente e entrega `pendente` pronto; depois da Action, ele também limpa os campos não controlados, então devolva no estado o que precisa ser preservado. Os nomes e o comportamento exato dependem da versão: confira react.dev.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que as Actions mudam e o que continua com você",
        texto:
          "No caminho clássico você escreve a máquina de estados e o `preventDefault`. Com Actions, o React cuida do estado pendente e da ordem das atualizações: `useActionState` guarda o resultado (veja L161), `useFormStatus` lê o estado pendente em componentes filhos do formulário (veja L162) e `useOptimistic` mostra o efeito antes da confirmação (veja L164). Nenhum dos dois caminhos dispensa validar no servidor, tratar cada tipo de falha e escrever mensagens que a pessoa entenda.",
      },
    ],
    armadilhas: [
      "Esquecer `resposta.ok`: o `fetch` só rejeita por falha de rede; um 422 ou 500 resolve a promise e a interface acaba mostrando “sucesso”.",
      "Não sair do estado “enviando” em todos os desfechos (sem `finally` ou sem tratar o erro): o botão fica preso para sempre.",
      "Ler `evento.currentTarget` depois de um `await`: ele já é `null`; leia os dados antes ou guarde uma referência.",
      "Perder o que a pessoa digitou quando o envio falha, ou deixar o erro antigo na tela durante o novo envio.",
    ],
    autoteste: [
      {
        pergunta: "Por que uma resposta 500 não cai no `catch` do `fetch`?",
        resposta:
          "Porque o `fetch` só rejeita quando não consegue obter uma resposta (rede, aborto). Qualquer status HTTP é uma resposta; é preciso conferir `resposta.ok` ou `resposta.status` e tratar o erro à mão.",
      },
      {
        pergunta: "O que as Actions do React moderno mudam em relação ao `onSubmit` com `fetch`?",
        resposta:
          "Você passa uma função ao `action` do formulário e o React passa a controlar o estado pendente (`useActionState`, `useFormStatus`), a ordem das atualizações e a limpeza dos campos não controlados. Você ainda decide o que mostrar no erro e valida no servidor.",
      },
    ],
  },
  en: {
    titulo: "Async form submission",
    pergunta: "How do you handle asynchronous form submission?",
    porqueEsteMetodo:
      "A submission is a sequence of states the person sees: click, wait, success or error. Following one submission from start to finish, including where it fails, shows what the interface has to say at each step.",
    resposta30s:
      "A submission goes through **idle → submitting → done or error**: on click you call `preventDefault`, validate, mark “submitting” (button disabled, loading visible), run the `fetch`, **check `response.ok`** (`fetch` does not reject on 4xx and 5xx), show success or error and **always** leave the “submitting” state. Modern React offers **Actions** (`<form action>`, `useActionState`, `useFormStatus`) that manage the pending state for you; details depend on the version, so check react.dev.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One submission, on the happy path",
        etapas: [
          "The person clicks “Send” (or presses Enter): the browser fires `submit` and `onSubmit` calls `preventDefault()` so the page does not navigate away",
          "Client validation passes (see L156); if it fails, the flow stops here, with no request",
          "The state becomes “submitting”: button disabled, “Sending…” text and the previous error cleared; React re-renders before the response arrives",
          "The `fetch` goes out with the data (`FormData` or JSON) and the interface stays responsive while it waits",
          'A 2xx response arrives: the state becomes “done”, the interface confirms (`role="status"`) and the fields are cleared or the person moves on to the next screen',
        ],
        nota: "In every outcome the “submitting” state has to end (`finally` or the equivalent), or the button stays stuck. The loading indicator can be button text, `aria-busy` or a screen skeleton.",
      },
      {
        tipo: "passos",
        titulo: "Now the paths where it goes wrong",
        passos: [
          {
            titulo: "The server refuses (4xx)",
            texto:
              "`fetch` **does not reject** on 400 or 422: the promise resolves with `ok === false`. Check `response.ok`, read the body, show each error on the right field and keep what the person typed.",
          },
          {
            titulo: "The network fails or times out",
            texto:
              "Here `fetch` rejects (a `TypeError` or an abort error). Catch it in `catch`, show a clear message (“Could not send. Check your connection and try again”), release the button and keep the data for another attempt.",
          },
          {
            titulo: "The server fails (5xx)",
            texto:
              "A generic message with no technical detail, and the button released. If the submission may have worked and only the response was lost, a retry duplicates the effect: the server should accept an idempotency key.",
          },
          {
            titulo: "Double click or leaving the screen",
            texto:
              "`disabled` on the button prevents the second click, but a guard in the handler covers Enter and fast clicks. A disabled button loses keyboard focus; the alternative is `aria-disabled` and ignoring the click. If the screen is unmounted, cancel the request with `AbortController`.",
          },
          {
            titulo: "Clearing the error",
            texto:
              'The error goes away when a new submission starts or when the person fixes the field. A field error stays next to the field; a general error goes in a notice with `role="alert"`.',
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The classic way: onSubmit with fetch",
        legenda: "TSX",
        codigo: [
          'import { useState, type FormEvent } from "react";',
          "export function Contact() {",
          '  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");',
          "  async function onSubmit(event: FormEvent<HTMLFormElement>) {",
          "    event.preventDefault();",
          '    if (status === "submitting") return; // extra barrier against double submits',
          "    const data = new FormData(event.currentTarget); // read before the first await",
          '    setStatus("submitting");',
          '    const ok = await fetch("/api/contact", { method: "POST", body: data })',
          "      .then((response) => response.ok) // 4xx and 5xx do not reject: check the status",
          "      .catch(() => false); // network failure",
          '    setStatus(ok ? "done" : "error");',
          "  }",
          "  return (",
          "    <form onSubmit={onSubmit}>",
          '      <textarea name="message" required />',
          '      <button disabled={status === "submitting"}>{status === "submitting" ? "Sending…" : "Send"}</button>',
          '      {status === "error" && <p role="alert">Could not send. Try again.</p>}',
          '      {status === "done" && <p role="status">Message sent.</p>}',
          "    </form>",
          "  );",
          "}",
        ].join("\n"),
        nota: "You write the state machine and guard every exit. In real code, separate the network message from the server’s refusal message.",
      },
      {
        tipo: "codigo",
        titulo: "The modern way: an Action with useActionState",
        legenda: "TSX",
        codigo: [
          'import { useActionState } from "react";',
          "",
          "type State = { error: string | null; sent: boolean };",
          "",
          "async function sendContact(_previous: State, data: FormData): Promise<State> {",
          '  const ok = await fetch("/api/contact", { method: "POST", body: data })',
          "    .then((response) => response.ok)",
          "    .catch(() => false);",
          '  return ok ? { error: null, sent: true } : { error: "Could not send. Try again.", sent: false };',
          "}",
          "",
          "export function Contact() {",
          "  const [state, action, pending] = useActionState(sendContact, { error: null, sent: false });",
          "  return (",
          "    <form action={action}>",
          '      <textarea name="message" required />',
          '      <button disabled={pending}>{pending ? "Sending…" : "Send"}</button>',
          '      {state.error && <p role="alert">{state.error}</p>}',
          '      {state.sent && <p role="status">Message sent.</p>}',
          "    </form>",
          "  );",
          "}",
        ].join("\n"),
        nota: "React marks the Action as pending and hands you `pending` ready-made; after the Action it also resets uncontrolled fields, so return in the state whatever must be preserved. Names and exact behavior depend on the version: check react.dev.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What Actions change and what stays with you",
        texto:
          "In the classic way you write the state machine and the `preventDefault`. With Actions, React manages the pending state and the order of updates: `useActionState` keeps the result (see L161), `useFormStatus` reads the pending state in child components of the form (see L162) and `useOptimistic` shows the effect before confirmation (see L164). Neither way spares you from validating on the server, handling each kind of failure and writing messages the person can understand.",
      },
    ],
    armadilhas: [
      "Forgetting `response.ok`: `fetch` only rejects on network failure; a 422 or 500 resolves the promise and the interface ends up showing “success”.",
      "Not leaving the “submitting” state in every outcome (no `finally`, or an unhandled error): the button stays stuck forever.",
      "Reading `event.currentTarget` after an `await`: it is already `null`; read the data first or keep a reference.",
      "Losing what the person typed when the submission fails, or leaving the old error on screen during the new submission.",
    ],
    autoteste: [
      {
        pergunta: "Why does a 500 response not land in the `catch` of `fetch`?",
        resposta:
          "Because `fetch` only rejects when it cannot get a response at all (network, abort). Any HTTP status is a response; you have to check `response.ok` or `response.status` and handle the error by hand.",
      },
      {
        pergunta: "What do modern React Actions change compared with `onSubmit` plus `fetch`?",
        resposta:
          "You pass a function to the form’s `action` and React takes over the pending state (`useActionState`, `useFormStatus`), the order of updates and the reset of uncontrolled fields. You still decide what to show on error and validate on the server.",
      },
    ],
  },
};
