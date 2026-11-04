import type { Pergunta } from "../../tipos";

// L139 · Progressive enhancement em formulários
export const l139: Pergunta = {
  numero: 139,
  modulo: "linkedin-react19",
  metodo: "whys",
  pt: {
    titulo: "Progressive enhancement em formulários",
    pergunta: "O que é progressive enhancement em formulários React?",
    porqueEsteMetodo:
      "Progressive enhancement soa como boa prática abstrata até você perguntar por que o formulário deveria funcionar sem JavaScript. A cadeia de “por quês” liga o problema (a janela antes da hidratação) ao mecanismo do `action` e aos limites.",
    resposta30s:
      "**Progressive enhancement** é fazer o formulário funcionar com HTML puro e **melhorá-lo** quando o JavaScript chega. No React, ao passar uma **Server Function** à propriedade `action` do `<form>`, o navegador faz um `POST` nativo mesmo **antes da hidratação** (ou sem JavaScript); depois o React assume o envio, sem recarregar a página, com estado pendente e validação no cliente. Depende de um **framework** com servidor: confira react.dev.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o formulário deveria funcionar antes de o JavaScript carregar?",
            resposta:
              "Porque o JavaScript demora (rede lenta, bundle grande, hidratação em andamento) ou falha (erro, script bloqueado, aparelho fraco). Nesse intervalo, a pessoa vê o formulário, preenche, clica em enviar e nada acontece. O `<form>` do HTML já sabe enviar dados sozinho, então a base do envio não precisa depender de script.",
          },
          {
            pergunta: "Por que passar uma Server Function ao `action` torna isso possível?",
            resposta:
              "Porque o servidor gera o HTML do formulário já identificando qual função deve tratar o envio. Sem JavaScript, o navegador faz o `POST` nativo com os campos (pelos atributos `name`); o framework o recebe, executa a função no servidor e responde com a página atualizada. Uma função comum definida no cliente não existe antes da hidratação, por isso não tem esse efeito (veja L136).",
          },
          {
            pergunta: "Por que o comportamento muda depois da hidratação?",
            resposta:
              "Porque o React passa a interceptar o envio: chama a função por requisição, sem recarregar a página, mantém o estado dos campos, a rolagem e o foco, e habilita o que só existe com JavaScript: estado pendente (`useFormStatus`, veja L129), UI otimista (veja L128) e validação no cliente. Mesmo formulário, dois caminhos, o mesmo resultado.",
          },
          {
            pergunta: "Por que isso depende do framework?",
            resposta:
              "Porque alguém precisa receber o `POST` nativo, achar a função certa, executá-la e renderizar a resposta. Isso exige servidor, roteamento e build, que o React sozinho (um app só de cliente) não tem. Confira como o seu framework expõe o recurso e o que ele suporta.",
          },
          {
            pergunta: "Por que ainda assim há limites?",
            resposta:
              "Porque tudo que depende de JavaScript some no caminho nativo: validação em tempo real, máscaras, campos controlados e UI otimista. Por isso a validação **no servidor** é obrigatória (e já deveria ser), os erros precisam voltar de um jeito que a página renderizada pelo servidor consiga exibir, e todos os campos precisam ter `name`.",
          },
        ],
        causaRaiz:
          "A web começou com formulários HTML. Se a base (HTML mais um servidor que trata o `POST`) funciona sozinha, o JavaScript só **acrescenta conforto**, e uma falha de script deixa de ser uma falha de funcionalidade.",
      },
      {
        tipo: "codigo",
        titulo: "Um formulário que funciona antes do JavaScript",
        legenda: "TSX",
        codigo: `// acoes.ts
"use server";

export async function inscrever(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email.includes("@")) return; // valide sempre também no servidor
  await salvarInscricao(email);
}

// Newsletter.tsx
import { inscrever } from "./acoes";

export function Newsletter() {
  return (
    <form action={inscrever}>
      <input name="email" type="email" required aria-label="E-mail" />
      <button type="submit">Inscrever</button>
    </form>
  );
}`,
        nota: '`salvarInscricao` é uma função sua. Os atributos nativos `required` e `type="email"` já dão uma primeira validação sem JavaScript.',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O que precisa estar no lugar",
        texto:
          'Para funcionar sem JavaScript: um `<form>` com `action` e um botão `type="submit"` de verdade; `name` em cada campo (o `FormData` nasce deles); atributos nativos como primeira validação; validação de novo no servidor, com os erros devolvidos de modo que a página do servidor possa exibi-los. Não dependa de `onClick` ou `onChange` para a lógica essencial. E lembre: só ações que o servidor consegue identificar (Server Functions) têm o comportamento nativo. É um recurso recente e dependente de framework: confira react.dev.',
      },
    ],
    armadilhas: [
      "Campos sem o atributo `name`: o `FormData` (e o `POST` nativo) sai vazio, mesmo que o React funcione bem depois da hidratação.",
      "Depender de `onClick` ou de um `onSubmit` em JavaScript para o envio essencial: antes da hidratação, o formulário não faz nada.",
      "Validar só no cliente: sem JavaScript (ou com uma requisição forjada) a validação não roda. O servidor sempre precisa validar.",
      "Esperar que uma função comum do cliente tenha o mesmo efeito: só ações que o servidor identifica (Server Functions) funcionam antes da hidratação.",
    ],
    autoteste: [
      {
        pergunta: "O que acontece se a pessoa enviar o formulário antes da hidratação?",
        resposta:
          "Com uma Server Function no `action`, o navegador faz um `POST` nativo ao servidor, que executa a função e responde com a página atualizada. Com uma função comum do cliente, nada acontece até o JavaScript carregar.",
      },
      {
        pergunta: "O que o JavaScript acrescenta depois da hidratação?",
        resposta:
          "Envio sem recarregar a página, estado pendente, UI otimista, validação em tempo real e preservação do estado dos campos: tudo como melhoria sobre um formulário que já funciona.",
      },
    ],
  },
  en: {
    titulo: "Progressive enhancement in forms",
    pergunta: "What is progressive enhancement in React forms?",
    porqueEsteMetodo:
      "Progressive enhancement sounds like abstract good practice until you ask why a form should work without JavaScript. The chain of whys connects the problem (the window before hydration) to the mechanism of `action` and to the limits.",
    resposta30s:
      "**Progressive enhancement** means making the form work with plain HTML and **improving it** once JavaScript arrives. In React, when you pass a **Server Function** to the `<form>`’s `action` prop, the browser makes a native `POST` even **before hydration** (or without JavaScript); afterwards React takes over the submission, without reloading the page, with a pending state and client-side validation. It depends on a **framework** with a server: check react.dev.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why should the form work before JavaScript loads?",
            resposta:
              "Because JavaScript is slow (a slow network, a large bundle, hydration still in progress) or fails (an error, a blocked script, a weak device). In that window, the person sees the form, fills it in, clicks submit and nothing happens. The HTML `<form>` already knows how to send data on its own, so the basis of submission doesn’t need to depend on a script.",
          },
          {
            pergunta: "Why does passing a Server Function to `action` make that possible?",
            resposta:
              "Because the server generates the form’s HTML already identifying which function should handle the submission. Without JavaScript, the browser makes the native `POST` with the fields (through the `name` attributes); the framework receives it, runs the function on the server and responds with the updated page. A plain function defined on the client doesn’t exist before hydration, so it doesn’t have this effect (see L136).",
          },
          {
            pergunta: "Why does the behavior change after hydration?",
            resposta:
              "Because React starts intercepting the submission: it calls the function through a request, without reloading the page, keeps the fields’ state, the scroll position and the focus, and enables what only exists with JavaScript: a pending state (`useFormStatus`, see L129), optimistic UI (see L128) and client-side validation. Same form, two paths, the same result.",
          },
          {
            pergunta: "Why does this depend on the framework?",
            resposta:
              "Because someone has to receive the native `POST`, find the right function, run it and render the response. That requires a server, routing and a build, which React alone (a client-only app) doesn’t have. Check how your framework exposes the feature and what it supports.",
          },
          {
            pergunta: "Why are there still limits?",
            resposta:
              "Because everything that depends on JavaScript disappears on the native path: real-time validation, input masks, controlled fields and optimistic UI. That is why validation **on the server** is mandatory (and already should be), errors must come back in a way the server-rendered page can display, and every field needs a `name`.",
          },
        ],
        causaRaiz:
          "The web began with HTML forms. If the base (HTML plus a server that handles the `POST`) works on its own, JavaScript only **adds comfort**, and a script failure stops being a functionality failure.",
      },
      {
        tipo: "codigo",
        titulo: "A form that works before JavaScript",
        legenda: "TSX",
        codigo: `// actions.ts
"use server";

export async function subscribe(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email.includes("@")) return; // always validate on the server too
  await saveSubscription(email);
}

// Newsletter.tsx
import { subscribe } from "./actions";

export function Newsletter() {
  return (
    <form action={subscribe}>
      <input name="email" type="email" required aria-label="Email" />
      <button type="submit">Subscribe</button>
    </form>
  );
}`,
        nota: '`saveSubscription` is your own function. The native `required` and `type="email"` attributes already give a first validation without JavaScript.',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What has to be in place",
        texto:
          'To work without JavaScript: a `<form>` with `action` and a real `type="submit"` button; a `name` on every field (the `FormData` is built from them); native attributes as a first validation; validation again on the server, with errors returned in a way the server-rendered page can display. Don’t depend on `onClick` or `onChange` for essential logic. And remember: only actions the server can identify (Server Functions) get the native behavior. It is a recent, framework-dependent feature: check react.dev.',
      },
    ],
    armadilhas: [
      "Fields without a `name` attribute: the `FormData` (and the native `POST`) comes out empty, even though React works fine after hydration.",
      "Depending on `onClick` or a JavaScript `onSubmit` for the essential submission: before hydration, the form does nothing.",
      "Validating only on the client: without JavaScript (or with a forged request) the validation doesn’t run. The server must always validate.",
      "Expecting a plain client function to have the same effect: only actions the server can identify (Server Functions) work before hydration.",
    ],
    autoteste: [
      {
        pergunta: "What happens if the person submits the form before hydration?",
        resposta:
          "With a Server Function in `action`, the browser makes a native `POST` to the server, which runs the function and responds with the updated page. With a plain client function, nothing happens until the JavaScript loads.",
      },
      {
        pergunta: "What does JavaScript add after hydration?",
        resposta:
          "Submission without a page reload, a pending state, optimistic UI, real-time validation and preserved field state: all as improvements over a form that already works.",
      },
    ],
  },
};
