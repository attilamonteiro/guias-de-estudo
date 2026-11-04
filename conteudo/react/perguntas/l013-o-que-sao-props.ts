import type { Pergunta } from "../../tipos";

// L13 · O que são props
export const l013: Pergunta = {
  numero: 13,
  modulo: "linkedin-fundamentos",
  metodo: "feynman",
  pt: {
    titulo: "O que são props",
    pergunta: "O que são props?",
    porqueEsteMetodo:
      "Props são só os argumentos de uma função, e a analogia com parâmetros resolve a maior parte das dúvidas (o que passar, como receber, por que não alterar). Depois vêm os detalhes do React e o ponto em que a imagem para de valer: objetos recebidos por referência.",
    resposta30s:
      "**Props** (de “properties”) são os **argumentos** que o componente pai passa ao filho, recebidos como **um objeto somente leitura**. O filho as usa para decidir o que mostrar e **nunca as altera**: para mudar algo, o pai muda o dado, ou passa uma **função** que o filho chama para avisá-lo. A prop especial `children` recebe o que for escrito entre as tags do componente.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense na ficha de pedido que o garçom entrega à cozinha. A cozinha prepara o prato com base no que está na ficha e não rabisca nela; se algo precisa mudar, a ficha volta ao garçom, que decide e entrega uma nova. As props são essa ficha, e o componente é a cozinha.",
        tecnico:
          'Em JSX, `<Cartao titulo="A" />` equivale a chamar a função com um único argumento, um **objeto**: `Cartao({ titulo: "A" })`. Esse objeto de props pode levar qualquer valor JavaScript (texto, número, objeto, array, função, até JSX), e o componente costuma **desestruturar** na assinatura, com **valores padrão**. A regra do React é tratá-lo como **somente leitura**: o componente é uma função das suas props, e quem quer outro resultado passa props diferentes. O pai pode passar valores novos a cada renderização, e então o filho renderiza de novo com eles.',
        limite:
          "A ficha de papel não mostra que objetos e arrays chegam por **referência**: o filho recebe o mesmo objeto do pai, e um `props.itens.push(x)` altera o dado do pai sem o React perceber, ao contrário do que a ficha “intocável” sugere. O “somente leitura” é uma regra que você precisa respeitar, não uma trava que o JavaScript impõe a tudo.",
      },
      {
        tipo: "tabela",
        titulo: "Formas de passar e receber props",
        colunas: ["Recurso", "Como se escreve", "Para que serve"],
        linhas: [
          ["Texto fixo", '`titulo="Olá"`', "Valor literal de texto"],
          [
            "Qualquer valor JavaScript",
            "`idade={30}`, `itens={lista}`, `usuario={obj}`",
            "Números, booleanos, objetos, arrays, funções e JSX, entre chaves",
          ],
          ["Atalho booleano", "`<Campo desativado />`", "Equivale a `desativado={true}`"],
          [
            "Espalhar",
            "`<Campo {...dados} />`",
            "Passa cada chave do objeto como prop; prático, mas esconde o que está sendo passado",
          ],
          ["Desestruturação", "`function Campo({ nome, idade })`", "Extrai as props direto da assinatura"],
          [
            "Valor padrão",
            '`function Campo({ nome = "Anônimo" })`',
            "Vale quando a prop é `undefined` (não para `null`)",
          ],
          ["Função como prop", "`aoSalvar={salvar}`", "O filho chama a função para avisar o pai"],
          [
            "`children`",
            "`<Cartao>conteúdo</Cartao>`",
            "Recebe o que está entre as tags, de texto a outros componentes",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Padrão, callback e children juntos",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function Botao({ tipo = "primario", aoClicar, children }) {
  return (
    <button className={tipo} onClick={aoClicar}>
      {children}
    </button>
  );
}

export default function Pagina() {
  const [total, setTotal] = useState(0);

  return (
    <Botao aoClicar={() => setTotal(total + 1)}>
      Somar (total: {total})
    </Botao>
  );
}`,
        nota: "`tipo` usa o valor padrão, `aoClicar` é a função com que o filho avisa o pai e `children` é o texto entre as tags. Quem guarda o state é o pai.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Props são somente leitura, e isso inclui o que vem dentro delas",
        texto:
          "Nunca escreva em `props.x` nem altere objetos e arrays recebidos (`props.itens.push(...)`, `props.usuario.nome = ...`). A mutação muda o dado do pai sem o React saber: a tela pode não atualizar, e pai e filho passam a dividir uma alteração escondida. Para derivar um valor, crie uma cópia (`[...itens, novo]`, `{ ...usuario, nome }`); para mudar o dado do pai, chame a função que ele passou (veja L17 e L18). Props “mudam” do ponto de vista do pai, que passa valores novos, mas são imutáveis para quem as recebe.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Como os dados circulam entre componentes",
        texto:
          "**Pai para filho:** atributos (props). **Filho para pai:** uma função recebida por prop. **Entre irmãos:** pelo pai comum, que guarda o state e passa valor e função aos dois (veja L18). **Entre muitos níveis:** passe elementos prontos por `children` ou por props (veja L19 e L80) e, quando for mesmo preciso, use Context (veja L81).",
      },
    ],
    armadilhas: [
      "Alterar `props.algo` ou mutar objetos e arrays recebidos: quebra a previsibilidade e a tela pode não atualizar.",
      "Copiar uma prop para o state na primeira renderização (`useState(props.valor)`): o state guarda só o valor inicial e ignora mudanças posteriores; derive durante a renderização ou reinicie a instância com `key`.",
      "Esperar que o valor padrão valha para `null`: ele só se aplica a `undefined`.",
      "Espalhar `{...props}` em tudo: esconde o contrato do componente e repassa props que o filho não deveria receber.",
    ],
    autoteste: [
      {
        pergunta: "Props são mutáveis?",
        resposta:
          "Para quem as recebe, não: são somente leitura. O pai pode passar valores novos a cada renderização e o filho renderiza de novo com eles, mas o filho não deve alterá-las, nem os objetos que vêm dentro delas.",
      },
      {
        pergunta: "Como o filho avisa o pai que algo aconteceu?",
        resposta:
          "O pai passa uma função como prop (por exemplo `aoSalvar`) e o filho a chama com os dados. Quem muda o state é o pai.",
      },
    ],
  },
  en: {
    titulo: "What props are",
    pergunta: "What are props?",
    porqueEsteMetodo:
      "Props are just the arguments of a function, and the analogy with parameters settles most doubts (what to pass, how to receive it, why not to change it). Then come the React details and the point where the picture stops holding: objects received by reference.",
    resposta30s:
      "**Props** (short for “properties”) are the **arguments** a parent component passes to a child, received as **a read-only object**. The child uses them to decide what to show and **never changes them**: to change something, the parent changes the data, or passes a **function** the child calls to notify it. The special `children` prop receives whatever is written between the component’s tags.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of the order slip a waiter hands to the kitchen. The kitchen prepares the dish from what is on the slip and does not scribble on it; if something must change, the slip goes back to the waiter, who decides and hands over a new one. Props are that slip, and the component is the kitchen.",
        tecnico:
          'In JSX, `<Card title="A" />` is equivalent to calling the function with a single argument, an **object**: `Card({ title: "A" })`. That props object can carry any JavaScript value (text, number, object, array, function, even JSX), and the component usually **destructures** it in its signature, with **default values**. React’s rule is to treat it as **read-only**: the component is a function of its props, and whoever wants another result passes different props. The parent can pass new values on every render, and the child then renders again with them.',
        limite:
          "The paper slip does not show that objects and arrays arrive by **reference**: the child receives the very same object as the parent, and a `props.items.push(x)` changes the parent’s data without React noticing, unlike what an “untouchable” slip suggests. “Read-only” is a rule you have to respect, not a lock that JavaScript enforces on everything.",
      },
      {
        tipo: "tabela",
        titulo: "Ways to pass and receive props",
        colunas: ["Feature", "How it is written", "What it is for"],
        linhas: [
          ["Fixed text", '`title="Hello"`', "A literal text value"],
          [
            "Any JavaScript value",
            "`age={30}`, `items={list}`, `user={obj}`",
            "Numbers, booleans, objects, arrays, functions and JSX, inside braces",
          ],
          ["Boolean shorthand", "`<Field disabled />`", "Equivalent to `disabled={true}`"],
          [
            "Spreading",
            "`<Field {...data} />`",
            "Passes each key of the object as a prop; handy, but hides what is being passed",
          ],
          ["Destructuring", "`function Field({ name, age })`", "Extracts the props straight from the signature"],
          [
            "Default value",
            '`function Field({ name = "Anonymous" })`',
            "Applies when the prop is `undefined` (not for `null`)",
          ],
          ["Function as a prop", "`onSave={save}`", "The child calls the function to notify the parent"],
          [
            "`children`",
            "`<Card>content</Card>`",
            "Receives what sits between the tags, from text to other components",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Default, callback and children together",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function Button({ kind = "primary", onPress, children }) {
  return (
    <button className={kind} onClick={onPress}>
      {children}
    </button>
  );
}

export default function Page() {
  const [total, setTotal] = useState(0);

  return (
    <Button onPress={() => setTotal(total + 1)}>
      Add (total: {total})
    </Button>
  );
}`,
        nota: "`kind` uses the default value, `onPress` is the function the child uses to notify the parent and `children` is the text between the tags. The parent owns the state.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Props are read-only, and that includes what is inside them",
        texto:
          "Never write to `props.x` or change objects and arrays you receive (`props.items.push(...)`, `props.user.name = ...`). The mutation changes the parent’s data without React knowing: the screen may not update, and parent and child start sharing a hidden change. To derive a value, make a copy (`[...items, next]`, `{ ...user, name }`); to change the parent’s data, call the function it passed (see L17 and L18). Props “change” from the parent’s point of view, since it passes new values, but they are immutable for whoever receives them.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "How data moves between components",
        texto:
          "**Parent to child:** attributes (props). **Child to parent:** a function received as a prop. **Between siblings:** through the common parent, which holds the state and passes a value and a function to both (see L18). **Across many levels:** pass ready-made elements through `children` or props (see L19 and L80) and, when you really need to, use Context (see L81).",
      },
    ],
    armadilhas: [
      "Changing `props.something` or mutating objects and arrays you received: it breaks predictability and the screen may not update.",
      "Copying a prop into state on the first render (`useState(props.value)`): the state keeps only the initial value and ignores later changes; derive during render or reset the instance with `key`.",
      "Expecting the default value to apply to `null`: it only applies to `undefined`.",
      "Spreading `{...props}` everywhere: it hides the component’s contract and forwards props the child should not receive.",
    ],
    autoteste: [
      {
        pergunta: "Are props mutable?",
        resposta:
          "For whoever receives them, no: they are read-only. The parent can pass new values on every render and the child renders again with them, but the child must not change them, nor the objects inside them.",
      },
      {
        pergunta: "How does a child tell its parent that something happened?",
        resposta:
          "The parent passes a function as a prop (for example `onSave`) and the child calls it with the data. The parent is the one that changes state.",
      },
    ],
  },
};
