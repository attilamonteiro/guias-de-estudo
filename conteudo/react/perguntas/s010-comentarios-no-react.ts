import type { Pergunta } from "../../tipos";

// S10 · Comentários no React
export const s010: Pergunta = {
  numero: 610,
  modulo: "simplilearn-componentes",
  metodo: "playbook",
  pt: {
    titulo: "Comentários no React",
    pergunta: "Como você escreve comentários no React?",
    porqueEsteMetodo:
      "A resposta certa depende do lugar onde o comentário está, e o erro típico é usar a sintaxe do lugar errado. Um playbook por local, cada um com o seu critério, evita decorar e errar.",
    resposta30s:
      "Em React, o comentário depende de **onde** ele está: fora do JSX vale o comentário normal do JavaScript (`//` e `/* */`), e **entre os filhos de um elemento JSX** usa-se `{/* ... */}`, um bloco de comentário dentro de chaves, porque o JSX não é HTML e uma `//` solta apareceria como texto na tela. Dentro da tag, entre atributos, também funcionam `//` e `/* */`. Comentário não gera nada no DOM.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: onde está o comentário?",
        passos: [
          {
            titulo: "Fora do JSX: comentário normal",
            texto:
              "No corpo da função, antes do `return`, em hooks, imports e funções, vale o comentário do JavaScript: `//` para uma linha e `/* ... */` para várias. Critério: o texto está em código JavaScript, e não entre tags.",
          },
          {
            titulo: "Entre os filhos de um elemento: `{/* ... */}`",
            texto:
              "Dentro do JSX, o que fica entre as tags é conteúdo, então `// nota` seria texto na tela. As chaves abrem uma expressão JavaScript, e um comentário de bloco dentro dela deixa a expressão vazia, que não renderiza nada. Critério: comentário entre filhos = chaves + `/* */`, de uma ou de várias linhas.",
          },
          {
            titulo: "Dentro da tag, entre atributos: `//` e `/* */` valem",
            texto:
              "Na abertura de um elemento, entre os atributos, o JSX aceita comentários de JavaScript sem chaves. Serve para explicar uma prop ou desligar um atributo por um momento. Critério: o comentário está depois do nome da tag e antes do `>`.",
          },
          {
            titulo: "Comentar um trecho de JSX",
            texto:
              "Envolva o trecho em `{/* ... */}`. Critério: o trecho não pode conter outro `*/` (um comentário de bloco dentro dele), porque o primeiro `*/` encerra o comentário e sobra lixo. Se já houver comentários dentro, remova-os ou apague o trecho: o Git guarda o histórico.",
          },
          {
            titulo: "Deixe o editor escolher a sintaxe",
            texto:
              "O atalho de comentar do editor (como `Ctrl+/` no VS Code, ou `Cmd+/` no Mac) olha onde está o cursor: em JavaScript põe `//`, entre filhos de JSX põe `{/* */}`. Critério: confira o resultado, porque o editor pode errar numa linha que mistura JSX e JavaScript.",
          },
          {
            titulo: "Diretivas seguem a mesma regra",
            texto:
              "`// eslint-disable-next-line` e `// @ts-expect-error` precisam de `{/* ... */}` quando a linha seguinte é JSX entre filhos. Critério: o aviso do linter ou do TypeScript só some se a diretiva estiver na sintaxe certa para o lugar.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Os três lugares num componente",
        legenda: "TSX",
        codigo: `export function Perfil({ nome }: { nome: string }) {
  // Comentário normal: fora do JSX
  const saudacao = "Olá, " + nome;

  return (
    <section>
      {/* Entre os filhos: bloco de comentário dentro de chaves */}
      <h1>{saudacao}</h1>

      <input
        // Dentro da tag, entre atributos: aceita // e /* */
        type="text"
        /* este também */
        defaultValue={nome}
      />

      // Isto aparece na tela como texto!
    </section>
  );
}`,
        nota: "A última linha não é comentário: está entre os filhos do `<section>`, então vira texto visível.",
      },
      {
        tipo: "tabela",
        titulo: "O que cada forma produz",
        colunas: ["Forma", "Onde", "Resultado"],
        linhas: [
          [
            "`// nota` ou `/* nota */`",
            "Fora do JSX (corpo da função, antes do `return`)",
            "Comentário de JavaScript: não aparece em lugar nenhum",
          ],
          [
            "`{/* nota */}`",
            "Entre os filhos de um elemento JSX",
            "Comentário: a expressão fica vazia e não renderiza nada",
          ],
          [
            "`// nota` ou `/* nota */`",
            "Dentro da tag de abertura, entre atributos",
            "Comentário aceito pelo JSX: não vira atributo",
          ],
          ["`// nota`", "Solto entre os filhos de um elemento", "Texto visível na tela: `// nota` é conteúdo"],
          ["`<!-- nota -->`", "Em qualquer lugar do JSX", "Erro de sintaxe: o JSX não é HTML"],
          [
            "`{// nota}`",
            "Entre os filhos, tudo na mesma linha",
            "Erro de sintaxe: o `//` comenta também a chave de fechamento",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Comentário não gera nada no DOM",
        texto:
          "Um comentário de JSX não vira nó: o DOM final não tem sinal dele, diferente do `<!-- -->` do HTML, que cria um nó de comentário visível nas ferramentas do navegador. Em geral o minificador também o remove do pacote de produção. Comente o **porquê**, não o quê: o código já mostra o quê.",
      },
    ],
    armadilhas: [
      "Escrever `// nota` solto entre os filhos de um elemento: aparece como texto na tela.",
      "Usar `<!-- nota -->` do HTML: o JSX não é HTML, e isso é erro de sintaxe.",
      "Escrever `{// nota}` na mesma linha: o `//` comenta a chave de fechamento e quebra a compilação. Use `{/* nota */}`.",
      "Comentar um trecho de JSX que já tem `{/* */}` dentro: o primeiro `*/` encerra o comentário e sobra código solto.",
    ],
    autoteste: [
      {
        pergunta: "Por que `{/* comentário */}` precisa de chaves?",
        resposta:
          "As chaves abrem uma expressão JavaScript dentro do JSX. O comentário é a única coisa na expressão, que fica vazia e não renderiza nada. Sem as chaves, o texto entre as tags é conteúdo e aparece na tela.",
      },
      {
        pergunta: "Um comentário de JSX vai para o HTML final?",
        resposta:
          "Não. Ele não gera nó no DOM. Diferente do `<!-- -->` do HTML, que cria um nó de comentário visível nas ferramentas do navegador, o comentário do JSX some na compilação.",
      },
    ],
  },
  en: {
    titulo: "Writing comments in React",
    pergunta: "How do you write comments in React?",
    porqueEsteMetodo:
      "The right answer depends on where the comment sits, and the typical mistake is using the syntax of the wrong place. A playbook by location, each with its own criterion, avoids memorizing and getting it wrong.",
    resposta30s:
      "In React, the comment depends on **where** it is: outside JSX the ordinary JavaScript comment applies (`//` and `/* */`), and **between the children of a JSX element** you use `{/* ... */}`, a block comment inside braces, because JSX is not HTML and a bare `//` would show up as text on the screen. Inside the tag, between attributes, `//` and `/* */` also work. A comment produces nothing in the DOM.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: where is the comment?",
        passos: [
          {
            titulo: "Outside JSX: an ordinary comment",
            texto:
              "In the function body, before the `return`, in hooks, imports and functions, the JavaScript comment applies: `//` for one line and `/* ... */` for several. Criterion: the text is in JavaScript code, not between tags.",
          },
          {
            titulo: "Between the children of an element: `{/* ... */}`",
            texto:
              "Inside JSX, what sits between tags is content, so `// note` would be text on the screen. The braces open a JavaScript expression, and a block comment inside it leaves the expression empty, which renders nothing. Criterion: a comment between children = braces + `/* */`, on one line or several.",
          },
          {
            titulo: "Inside the tag, between attributes: `//` and `/* */` work",
            texto:
              "In an element’s opening tag, between attributes, JSX accepts JavaScript comments without braces. It is useful to explain a prop or to switch an attribute off for a moment. Criterion: the comment is after the tag name and before the `>`.",
          },
          {
            titulo: "Commenting out a piece of JSX",
            texto:
              "Wrap the piece in `{/* ... */}`. Criterion: the piece cannot contain another `*/` (a block comment inside it), because the first `*/` ends the comment and leaves debris. If comments are already inside, remove them or delete the piece: Git keeps the history.",
          },
          {
            titulo: "Let the editor pick the syntax",
            texto:
              "The editor’s comment shortcut (such as `Ctrl+/` in VS Code, or `Cmd+/` on a Mac) looks at where the cursor is: in JavaScript it inserts `//`, between JSX children it inserts `{/* */}`. Criterion: check the result, because the editor can slip on a line that mixes JSX and JavaScript.",
          },
          {
            titulo: "Directives follow the same rule",
            texto:
              "`// eslint-disable-next-line` and `// @ts-expect-error` need `{/* ... */}` when the next line is JSX between children. Criterion: the linter or TypeScript warning only goes away if the directive uses the right syntax for the place.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The three places in one component",
        legenda: "TSX",
        codigo: `export function Profile({ name }: { name: string }) {
  // Ordinary comment: outside JSX
  const greeting = "Hello, " + name;

  return (
    <section>
      {/* Between children: a block comment inside braces */}
      <h1>{greeting}</h1>

      <input
        // Inside the tag, between attributes: accepts // and /* */
        type="text"
        /* this one too */
        defaultValue={name}
      />

      // This shows up on the screen as text!
    </section>
  );
}`,
        nota: "The last line is not a comment: it sits between the children of the `<section>`, so it becomes visible text.",
      },
      {
        tipo: "tabela",
        titulo: "What each form produces",
        colunas: ["Form", "Where", "Result"],
        linhas: [
          [
            "`// note` or `/* note */`",
            "Outside JSX (function body, before the `return`)",
            "A JavaScript comment: it appears nowhere",
          ],
          [
            "`{/* note */}`",
            "Between the children of a JSX element",
            "A comment: the expression is empty and renders nothing",
          ],
          [
            "`// note` or `/* note */`",
            "Inside the opening tag, between attributes",
            "A comment accepted by JSX: it does not become an attribute",
          ],
          ["`// note`", "Bare, between the children of an element", "Visible text on the screen: `// note` is content"],
          ["`<!-- note -->`", "Anywhere in JSX", "A syntax error: JSX is not HTML"],
          [
            "`{// note}`",
            "Between children, all on one line",
            "A syntax error: the `//` also comments out the closing brace",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "A comment produces nothing in the DOM",
        texto:
          "A JSX comment does not become a node: the final DOM has no trace of it, unlike HTML’s `<!-- -->`, which creates a comment node visible in the browser tools. The minifier also usually strips it from the production bundle. Comment the **why**, not the what: the code already shows the what.",
      },
    ],
    armadilhas: [
      "Writing a bare `// note` between the children of an element: it shows up as text on the screen.",
      "Using HTML’s `<!-- note -->`: JSX is not HTML, and that is a syntax error.",
      "Writing `{// note}` all on one line: the `//` comments out the closing brace and breaks compilation. Use `{/* note */}`.",
      "Commenting out a piece of JSX that already has `{/* */}` inside: the first `*/` ends the comment and leaves loose code behind.",
    ],
    autoteste: [
      {
        pergunta: "Why does `{/* comment */}` need braces?",
        resposta:
          "The braces open a JavaScript expression inside JSX. The comment is the only thing in the expression, which ends up empty and renders nothing. Without the braces, the text between tags is content and appears on the screen.",
      },
      {
        pergunta: "Does a JSX comment end up in the final HTML?",
        resposta:
          "No. It produces no DOM node. Unlike HTML’s `<!-- -->`, which creates a comment node visible in the browser tools, a JSX comment disappears at compile time.",
      },
    ],
  },
};
