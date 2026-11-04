import type { Pergunta } from "../../tipos";

// S16 · Formulários no ReactJS
export const s016: Pergunta = {
  numero: 616,
  modulo: "simplilearn-estado-e-formularios",
  metodo: "trace",
  pt: {
    titulo: "Formulários no ReactJS",
    pergunta: "O que são formulários no ReactJS?",
    porqueEsteMetodo:
      "Formulário no React é uma sequência de eventos e renderizações: a tecla, o state, a nova renderização e o envio. Seguir uma digitação e depois um envio, inclusive o caminho em que o campo trava ou a validação recusa, mostra o mecanismo inteiro.",
    resposta30s:
      "Um formulário React costuma usar **inputs controlados**: o valor do campo vive no **state**. Digitar dispara `onChange`, o handler chama o `set...`, o componente renderiza de novo e devolve o `value` atualizado, então o campo sempre reflete o state. No envio, `onSubmit` com `preventDefault` lê o state, valida e mostra os erros; a alternativa **não controlada** lê o DOM só no envio (`FormData` ou `ref`), e as versões recentes oferecem **Actions** para o envio (veja C29).",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "O ciclo de um input controlado, a cada tecla",
        etapas: [
          "Você digita “a”: o navegador atualiza o campo e dispara o evento de entrada, e o React chama o `onChange` do `<input>` com o evento",
          "O handler lê `e.target.value` e chama `setNome(...)` (ou `setForm` com uma cópia do objeto): o novo valor entra na fila de atualizações",
          "O React renderiza o componente de novo; dessa vez `nome` já vale o texto novo",
          "O JSX devolve `<input value={nome} />` e o React compara com a descrição anterior, gravando no DOM só o que mudou",
          "O campo mostra o valor do state: a fonte da verdade é o state, não o DOM, e é por isso que dá para validar, formatar ou limitar enquanto se digita",
          "No caminho que dá errado, o handler não atualiza o state (ou nem existe): a renderização devolve o valor antigo e o campo parece travado, sem aceitar digitação",
        ],
        nota: "Cada tecla percorre esse ciclo. É o preço do controle: uma renderização por tecla, que costuma ser barata, mas pode pesar em formulários muito grandes.",
      },
      {
        tipo: "passos",
        titulo: "Do clique em Enviar ao erro na tela",
        passos: [
          {
            titulo: "`onSubmit` e `preventDefault`",
            texto:
              "Use `onSubmit` no `<form>` (e não só `onClick` no botão, para o Enter também enviar) e chame `e.preventDefault()`. Sem isso, o navegador recarrega a página e o state se perde.",
          },
          {
            titulo: "Leia os valores",
            texto:
              "Num formulário controlado, eles vêm do state. Num não controlado, vêm de `new FormData(e.currentTarget)` ou de uma `ref`, e `Object.fromEntries(dados)` transforma o `FormData` num objeto.",
          },
          {
            titulo: "Valide",
            texto:
              "Uma função pura recebe os valores e devolve um objeto de erros, como `{ nome: 'Informe o nome' }`. Havendo erros, guarde-os no state e pare. Valide também no servidor: a validação do navegador é conveniência, não segurança.",
          },
          {
            titulo: "Envie",
            texto:
              "Chame a API e guarde um estado de envio para desabilitar o botão e evitar clique duplo. Se falhar (rede ou recusa do servidor), mostre a mensagem sem apagar o que a pessoa digitou.",
          },
          {
            titulo: "Mostre os erros de forma acessível",
            texto:
              "A mensagem fica perto do campo, ligada por `aria-describedby`, com `aria-invalid` no campo, cada campo com um `<label>` associado e o foco indo ao primeiro campo com erro.",
          },
          {
            titulo: "Nas versões recentes",
            texto:
              "Com `<form action={função}>`, `useActionState` e `useFormStatus`, o React cuida do estado de envio, do resultado e do erro (veja C29 e L126). O padrão muda, mas os conceitos acima continuam valendo. Confira react.dev.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Vários campos com um objeto de estado",
        legenda: "JSX",
        codigo: `import { useState } from "react";

export function Cadastro() {
  const [form, setForm] = useState({ nome: "", termos: false });
  const [erro, setErro] = useState("");

  function alterar({ target: { name, type, value, checked } }) {
    setForm((atual) => ({ ...atual, [name]: type === "checkbox" ? checked : value }));
  }
  function enviar(e) {
    e.preventDefault(); // sem isto, a página recarrega
    setErro(form.nome.trim() ? "" : "Informe o nome");
  }
  return (
    <form onSubmit={enviar}>
      <input name="nome" value={form.nome} onChange={alterar} />
      <input type="checkbox" name="termos" checked={form.termos} onChange={alterar} />
      {erro && <p role="alert">{erro}</p>}
      <button disabled={!form.termos}>Enviar</button>
    </form>
  );
}`,
        nota: "Um handler genérico, guiado por `name`, atende vários campos com um só objeto de estado. Faltam os `<label>`, que um formulário real precisa ter.",
      },
      {
        tipo: "tabela",
        titulo: "Cada tipo de campo",
        colunas: ["Campo", "Liga ao state por", "Lê do evento", "Observação"],
        linhas: [
          [
            "Texto, e-mail, senha, número",
            "`value`",
            "`e.target.value`",
            '`type="number"` também devolve texto; converta quando precisar',
          ],
          [
            "`<textarea>`",
            "`value` (e não o texto entre as tags)",
            "`e.target.value`",
            "Em HTML o texto vai entre as tags; em React, vai em `value`",
          ],
          [
            "`<select>`",
            "`value` no próprio `<select>`",
            "`e.target.value`",
            "Não se marca `selected` na `<option>`; com `multiple`, o valor é um array",
          ],
          ["Checkbox", "`checked`", "`e.target.checked`", "É um booleano; um grupo vira um array ou um objeto"],
          [
            "Radio",
            '`checked={escolha === "a"}` em cada opção',
            "`e.target.value`",
            "As opções do grupo compartilham o mesmo `name`",
          ],
          [
            'Arquivo (`type="file"`)',
            "Não pode ser controlado",
            "`e.target.files`",
            "O valor é só de leitura: leia pelo evento ou por uma `ref`",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Controlado ou não controlado",
        texto:
          "Use **controlado** quando a tela reage ao que se digita (validar na hora, formatar, habilitar o botão, campos que dependem uns dos outros). Use **não controlado** (`defaultValue`, `FormData` ou `ref`) quando só se lê no envio ou o campo é de arquivo: dá menos código e menos renderizações. Não misture: `value` sem `onChange` trava o campo (use `defaultValue` ou `readOnly`), e um valor que começa `undefined` e depois vira texto faz o React avisar que o campo passou de não controlado a controlado. Comece com uma string vazia. Veja L20.",
      },
    ],
    armadilhas: [
      "`value` sem `onChange` (ou `checked` sem `onChange`): o campo fica travado e o React avisa. Para não controlar, use `defaultValue`.",
      "Esquecer `e.preventDefault()` no `onSubmit`: a página recarrega e o state se perde.",
      "Atualizar o objeto de estado sem espalhar o anterior (`setForm({ nome })`) ou mutá-lo (`form.nome = ...`): os outros campos somem ou a tela nem renderiza. Use `{ ...atual, [name]: valor }`.",
      "Começar um campo com `undefined` ou `null`: ele nasce não controlado e vira controlado depois, com aviso. Comece com uma string vazia.",
    ],
    autoteste: [
      {
        pergunta: "O que torna um input “controlado”?",
        resposta:
          "O `value` (ou o `checked`) vem do state do React e só muda por meio do `onChange`. O state é a fonte da verdade, e o campo apenas reflete o que a renderização devolve.",
      },
      {
        pergunta: "Quando preferir um formulário não controlado?",
        resposta:
          "Quando o valor só interessa no envio, quando o campo é de arquivo (que não pode ser controlado) ou quando renderizar a cada tecla pesa. Leia com `FormData` ou `ref` e use `defaultValue` para o valor inicial.",
      },
    ],
  },
  en: {
    titulo: "Forms in ReactJS",
    pergunta: "What are forms in ReactJS?",
    porqueEsteMetodo:
      "A form in React is a sequence of events and renders: the keystroke, the state, the new render and the submit. Following one keystroke and then one submit, including the path where the field gets stuck or validation rejects, shows the whole mechanism.",
    resposta30s:
      "A React form usually relies on **controlled inputs**: the field’s value lives in **state**. Typing fires `onChange`, the handler calls the `set...` function, the component renders again and returns the updated `value`, so the field always mirrors the state. On submit, `onSubmit` with `preventDefault` reads the state, validates and shows the errors; the **uncontrolled** alternative reads the DOM only on submit (`FormData` or a `ref`), and recent versions offer **Actions** for submitting (see C29).",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "The cycle of a controlled input, on every keystroke",
        etapas: [
          "You type “a”: the browser updates the field and fires the input event, and React calls the `<input>`’s `onChange` with the event",
          "The handler reads `e.target.value` and calls `setName(...)` (or `setForm` with a copy of the object): the new value enters the update queue",
          "React renders the component again; this time `name` already holds the new text",
          "The JSX returns `<input value={name} />` and React compares it with the previous description, writing to the DOM only what changed",
          "The field shows the state’s value: the source of truth is the state, not the DOM, which is why you can validate, format or limit while typing",
          "On the path that goes wrong, the handler does not update the state (or does not exist): the render returns the old value and the field looks stuck, accepting no typing",
        ],
        nota: "Every keystroke goes through this cycle. That is the price of control: one render per keystroke, which is usually cheap but can weigh on very large forms.",
      },
      {
        tipo: "passos",
        titulo: "From clicking Submit to the error on screen",
        passos: [
          {
            titulo: "`onSubmit` and `preventDefault`",
            texto:
              "Use `onSubmit` on the `<form>` (and not just `onClick` on the button, so Enter also submits) and call `e.preventDefault()`. Without it, the browser reloads the page and the state is lost.",
          },
          {
            titulo: "Read the values",
            texto:
              "In a controlled form, they come from the state. In an uncontrolled one, they come from `new FormData(e.currentTarget)` or a `ref`, and `Object.fromEntries(data)` turns the `FormData` into an object.",
          },
          {
            titulo: "Validate",
            texto:
              "A pure function takes the values and returns an errors object, such as `{ name: 'Enter a name' }`. If there are errors, store them in state and stop. Validate on the server too: browser validation is convenience, not security.",
          },
          {
            titulo: "Submit",
            texto:
              "Call the API and keep a submitting state to disable the button and prevent double clicks. If it fails (network or server rejection), show the message without erasing what the person typed.",
          },
          {
            titulo: "Show errors accessibly",
            texto:
              "The message sits near the field, tied by `aria-describedby`, with `aria-invalid` on the field, each field with an associated `<label>` and focus moving to the first field with an error.",
          },
          {
            titulo: "In recent versions",
            texto:
              "With `<form action={function}>`, `useActionState` and `useFormStatus`, React takes care of the submit state, the result and the error (see C29 and L126). The pattern changes, but the concepts above still apply. Check react.dev.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Several fields with one state object",
        legenda: "JSX",
        codigo: `import { useState } from "react";

export function Signup() {
  const [form, setForm] = useState({ name: "", terms: false });
  const [error, setError] = useState("");

  function change({ target: { name, type, value, checked } }) {
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }
  function submit(e) {
    e.preventDefault(); // without this, the page reloads
    setError(form.name.trim() ? "" : "Enter a name");
  }
  return (
    <form onSubmit={submit}>
      <input name="name" value={form.name} onChange={change} />
      <input type="checkbox" name="terms" checked={form.terms} onChange={change} />
      {error && <p role="alert">{error}</p>}
      <button disabled={!form.terms}>Submit</button>
    </form>
  );
}`,
        nota: "One generic handler, driven by `name`, serves several fields with a single state object. The `<label>`s are missing, and a real form needs them.",
      },
      {
        tipo: "tabela",
        titulo: "Each type of field",
        colunas: ["Field", "Bound to state by", "Read from the event", "Note"],
        linhas: [
          [
            "Text, email, password, number",
            "`value`",
            "`e.target.value`",
            '`type="number"` also returns text; convert when needed',
          ],
          [
            "`<textarea>`",
            "`value` (not the text between the tags)",
            "`e.target.value`",
            "In HTML the text goes between the tags; in React, it goes in `value`",
          ],
          [
            "`<select>`",
            "`value` on the `<select>` itself",
            "`e.target.value`",
            "You do not mark `selected` on the `<option>`; with `multiple`, the value is an array",
          ],
          ["Checkbox", "`checked`", "`e.target.checked`", "A boolean; a group becomes an array or an object"],
          [
            "Radio",
            '`checked={choice === "a"}` on each option',
            "`e.target.value`",
            "The options in the group share the same `name`",
          ],
          [
            'File (`type="file"`)',
            "Cannot be controlled",
            "`e.target.files`",
            "The value is read-only: read it from the event or through a `ref`",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Controlled or uncontrolled",
        texto:
          "Use **controlled** when the screen reacts to what is typed (validating on the spot, formatting, enabling the button, fields that depend on each other). Use **uncontrolled** (`defaultValue`, `FormData` or a `ref`) when you only read on submit or the field is a file input: it takes less code and fewer renders. Do not mix them: `value` without `onChange` freezes the field (use `defaultValue` or `readOnly`), and a value that starts `undefined` and later becomes text makes React warn that the field went from uncontrolled to controlled. Start with an empty string. See L20.",
      },
    ],
    armadilhas: [
      "`value` without `onChange` (or `checked` without `onChange`): the field gets stuck and React warns. To leave it uncontrolled, use `defaultValue`.",
      "Forgetting `e.preventDefault()` in `onSubmit`: the page reloads and the state is lost.",
      "Updating the state object without spreading the previous one (`setForm({ name })`) or mutating it (`form.name = ...`): the other fields vanish or the screen does not even render. Use `{ ...current, [name]: value }`.",
      "Starting a field with `undefined` or `null`: it begins uncontrolled and becomes controlled later, with a warning. Start with an empty string.",
    ],
    autoteste: [
      {
        pergunta: "What makes an input “controlled”?",
        resposta:
          "Its `value` (or `checked`) comes from React state and only changes through `onChange`. The state is the source of truth, and the field just mirrors what the render returns.",
      },
      {
        pergunta: "When should you prefer an uncontrolled form?",
        resposta:
          "When the value only matters on submit, when the field is a file input (which cannot be controlled) or when rendering on every keystroke is costly. Read it with `FormData` or a `ref` and use `defaultValue` for the initial value.",
      },
    ],
  },
};
