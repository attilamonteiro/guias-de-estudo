import type { Pergunta } from "../../tipos";

// L20 · Controlado ou não controlado
export const l020: Pergunta = {
  numero: 20,
  modulo: "linkedin-fundamentos",
  metodo: "compare",
  pt: {
    titulo: "Controlado ou não controlado",
    pergunta: "Qual é a diferença entre componentes controlados e não controlados?",
    porqueEsteMetodo:
      "São duas respostas para a mesma pergunta (quem guarda o valor do campo?) e a escolha depende do caso. Uma matriz lado a lado, com a regra de escolha no fim, cobre as variações (o que é um input controlado, o que é um não controlado, quando usar cada um).",
    resposta30s:
      'Em um componente **controlado** o valor do campo vive no **state do React**: você passa `value` e `onChange`, e o React é a fonte da verdade. No **não controlado** o **DOM** guarda o valor: você dá um `defaultValue` e lê depois por **ref** ou `FormData`. O controlado permite validar e formatar em tempo real, ao custo de renderizar a cada tecla; o não controlado é mais simples e leve para formulários lidos só no envio, e `<input type="file">` é sempre não controlado.',
    blocos: [
      {
        tipo: "tabela",
        titulo: "Controlado contra não controlado",
        colunas: ["Aspecto", "Controlado", "Não controlado"],
        linhas: [
          ["Onde mora o valor", "No state do React", "No próprio DOM"],
          ["Como se configura", "`value` e `onChange`", "`defaultValue` (ou `defaultChecked`)"],
          [
            "Como se lê",
            "Direto do state, a qualquer momento",
            "Por ref (`ref.current.value`) ou por `FormData` no envio",
          ],
          [
            "Validação e formatação em tempo real",
            "Natural: o handler valida e formata antes de guardar",
            "Mais difícil: é preciso ler o DOM; dá para validar no envio ou com atributos HTML",
          ],
          ["Renderizações", "A cada mudança (a cada tecla)", "Nenhuma por tecla"],
          [
            "Mudar o valor de fora (limpar, preencher)",
            "Troca o state",
            "`reset()` do formulário, `ref` ou uma `key` nova para reiniciar",
          ],
          [
            "Bom para",
            "Campos de que o resto da tela depende: busca com sugestões, máscara, botão que só habilita quando válido",
            'Formulários simples, integração com código fora do React, `<input type="file">`',
          ],
          [
            "Atenção",
            "Todo `value` exige `onChange`, senão o campo fica travado",
            "O valor inicial só vale na montagem",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Controlado: o state é a fonte da verdade",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function Busca() {
  const [texto, setTexto] = useState("");
  const valido = texto.trim().length >= 3; // derivado do state

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input value={texto} onChange={(e) => setTexto(e.target.value)} />
      <button disabled={!valido}>Buscar</button>
    </form>
  );
}`,
        nota: "O botão reage a cada tecla porque o valor está no state; o `valido` é calculado na renderização, sem virar outro state.",
      },
      {
        tipo: "codigo",
        titulo: "Não controlado: o DOM guarda, o envio lê",
        legenda: "JSX",
        codigo: `function Cadastro() {
  function enviar(evento) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    console.log(dados.get("email"), dados.get("avatar"));
  }

  return (
    <form onSubmit={enviar}>
      <input name="email" defaultValue="" />
      <input name="avatar" type="file" />
      <button>Enviar</button>
    </form>
  );
}`,
        nota: "Os campos precisam de `name` para entrar no `FormData`. O arquivo é lido do envio (ou de `input.files`), nunca de um `value`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de escolha",
        texto:
          "Precisa **reagir ao valor enquanto a pessoa digita** (validar, formatar, habilitar um botão, filtrar, campos que dependem uns dos outros)? **Controlado.** Só precisa dos valores **no envio**, ou o formulário é grande e simples? **Não controlado**, com `FormData`. Em formulários complexos, bibliotecas de formulário reduzem renderizações (o React Hook Form, por exemplo, registra campos não controlados por padrão); confira a documentação de cada uma. O React também tem Actions de formulário (`<form action={...}>`), que recebem o `FormData` e combinam bem com campos não controlados; confira react.dev.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Trocar de um modo para o outro",
        texto:
          'O React avisa quando um campo muda de não controlado para controlado: acontece quando `value` é `undefined` na primeira renderização e depois recebe um valor (por exemplo `value={usuario.nome}` antes de os dados chegarem). Inicialize com `""` ou use `value ?? ""`. Também não misture `value` e `defaultValue` no mesmo campo, e lembre que `value` sem `onChange` deixa o campo somente leitura. O `<input type="file">` é sempre não controlado: por segurança, só a pessoa escolhe o arquivo.',
      },
    ],
    armadilhas: [
      "Passar `value` sem `onChange` (ou com um `onChange` que não atualiza o state): o campo trava e não aceita digitação.",
      'Começar com `value={undefined}` (ou `null`) e depois passar um texto: o React avisa da troca de não controlado para controlado; inicialize com `""`.',
      "Misturar `value` e `defaultValue` no mesmo campo.",
      'Controlar tudo por hábito e renderizar um formulário enorme a cada tecla, ou tentar controlar um `<input type="file">`.',
    ],
    autoteste: [
      {
        pergunta: 'Por que um `<input type="file">` não pode ser controlado?',
        resposta:
          "Porque o navegador só deixa a pessoa escolher o arquivo: o código não pode definir o valor, por segurança. Leia `input.files` por ref, ou o `FormData` no envio.",
      },
      {
        pergunta: "Quando o controlado compensa?",
        resposta:
          "Quando o resto da tela depende do valor enquanto ele é digitado: validação, máscara, contador de caracteres, botão habilitado só quando válido, filtros em tempo real. Para ler só no envio, o não controlado basta.",
      },
    ],
  },
  en: {
    titulo: "Controlled versus uncontrolled",
    pergunta: "What is the difference between controlled and uncontrolled components?",
    porqueEsteMetodo:
      "They are two answers to the same question (who holds the field’s value?) and the choice depends on the case. A side-by-side matrix, with the choice rule at the end, covers the variations (what a controlled input is, what an uncontrolled one is, when to use each).",
    resposta30s:
      'In a **controlled** component the field’s value lives in **React state**: you pass `value` and `onChange`, and React is the source of truth. In an **uncontrolled** one the **DOM** holds the value: you give a `defaultValue` and read it later through a **ref** or `FormData`. Controlled lets you validate and format in real time, at the cost of rendering on every keystroke; uncontrolled is simpler and lighter for forms read only on submit, and `<input type="file">` is always uncontrolled.',
    blocos: [
      {
        tipo: "tabela",
        titulo: "Controlled versus uncontrolled",
        colunas: ["Aspect", "Controlled", "Uncontrolled"],
        linhas: [
          ["Where the value lives", "In React state", "In the DOM itself"],
          ["How it is set up", "`value` and `onChange`", "`defaultValue` (or `defaultChecked`)"],
          [
            "How it is read",
            "Straight from state, at any time",
            "Through a ref (`ref.current.value`) or `FormData` on submit",
          ],
          [
            "Real-time validation and formatting",
            "Natural: the handler validates and formats before storing",
            "Harder: you have to read the DOM; you can validate on submit or with HTML attributes",
          ],
          ["Renders", "On every change (every keystroke)", "None per keystroke"],
          [
            "Changing the value from outside (clear, fill in)",
            "Change the state",
            "The form’s `reset()`, a `ref` or a new `key` to restart",
          ],
          [
            "Good for",
            "Fields the rest of the screen depends on: search with suggestions, masks, a button enabled only when valid",
            'Simple forms, integration with non-React code, `<input type="file">`',
          ],
          [
            "Watch out",
            "Every `value` needs an `onChange`, otherwise the field is stuck",
            "The initial value only applies on mount",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Controlled: state is the source of truth",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function Search() {
  const [text, setText] = useState("");
  const valid = text.trim().length >= 3; // derived from state

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button disabled={!valid}>Search</button>
    </form>
  );
}`,
        nota: "The button reacts on every keystroke because the value is in state; `valid` is computed during render, without becoming another state.",
      },
      {
        tipo: "codigo",
        titulo: "Uncontrolled: the DOM holds it, submit reads it",
        legenda: "JSX",
        codigo: `function SignUp() {
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get("email"), data.get("avatar"));
  }

  return (
    <form onSubmit={submit}>
      <input name="email" defaultValue="" />
      <input name="avatar" type="file" />
      <button>Send</button>
    </form>
  );
}`,
        nota: "Fields need a `name` to show up in the `FormData`. The file is read on submit (or from `input.files`), never from a `value`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Choice rule",
        texto:
          "Do you need to **react to the value while the person types** (validate, format, enable a button, filter, fields that depend on each other)? **Controlled.** Do you only need the values **on submit**, or is the form large and simple? **Uncontrolled**, with `FormData`. In complex forms, form libraries reduce renders (React Hook Form, for example, registers uncontrolled fields by default); check each one’s documentation. React also has form Actions (`<form action={...}>`), which receive the `FormData` and pair well with uncontrolled fields; check react.dev.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Switching from one mode to the other",
        texto:
          'React warns when a field goes from uncontrolled to controlled: it happens when `value` is `undefined` on the first render and later receives a value (for example `value={user.name}` before the data arrives). Initialize with `""` or use `value ?? ""`. Also do not mix `value` and `defaultValue` on the same field, and remember that `value` without `onChange` makes the field read-only. `<input type="file">` is always uncontrolled: for security, only the person picks the file.',
      },
    ],
    armadilhas: [
      "Passing `value` without `onChange` (or with an `onChange` that does not update state): the field gets stuck and accepts no typing.",
      'Starting with `value={undefined}` (or `null`) and later passing a text: React warns about the switch from uncontrolled to controlled; initialize with `""`.',
      "Mixing `value` and `defaultValue` on the same field.",
      'Controlling everything out of habit and rendering a huge form on every keystroke, or trying to control an `<input type="file">`.',
    ],
    autoteste: [
      {
        pergunta: 'Why can’t an `<input type="file">` be controlled?',
        resposta:
          "Because the browser only lets the person choose the file: code cannot set the value, for security. Read `input.files` through a ref, or the `FormData` on submit.",
      },
      {
        pergunta: "When is controlled worth it?",
        resposta:
          "When the rest of the screen depends on the value while it is being typed: validation, masks, character counters, a button enabled only when valid, real-time filters. If you only read on submit, uncontrolled is enough.",
      },
    ],
  },
};
