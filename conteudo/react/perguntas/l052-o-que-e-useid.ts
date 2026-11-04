import type { Pergunta } from "../../tipos";

// L52 · O que é useId
export const l052: Pergunta = {
  numero: 52,
  modulo: "linkedin-hooks",
  metodo: "whys",
  pt: {
    titulo: "O que é useId",
    pergunta: "O que é useId()?",
    porqueEsteMetodo:
      "`useId` parece um detalhe, até você perguntar por que não basta `Math.random()`. A cadeia de por quês leva da acessibilidade à hidratação e mostra o problema que só o React consegue resolver.",
    resposta30s:
      "`useId` gera um **identificador único por instância do componente**, usado para ligar `label` e `input`, `aria-describedby` e atributos parecidos. Como é derivado da posição do componente na árvore, ele é **idêntico no servidor e no cliente**, o que `Math.random()` ou um contador global não garantem e causariam **erro de hidratação**. Não serve como `key` de lista nem para seletores CSS.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que um componente precisa de um identificador único?",
            resposta:
              "Porque vários atributos ligam elementos por id: `htmlFor` do `label` com o `id` do `input`, `aria-describedby`, `aria-labelledby`, `aria-controls`. Se o id se repete na página, o `label` focaliza o campo errado e o leitor de tela lê a descrição de outro elemento.",
          },
          {
            pergunta: 'Por que não escrever um id fixo, como `id="email"`?',
            resposta:
              "Porque componentes são reaproveitados. A segunda instância repete o id, e id duplicado é inválido em HTML e quebra a ligação. O id tem de ser **por instância**, não por componente.",
          },
          {
            pergunta: "Por que `Math.random()` ou um contador global não servem?",
            resposta:
              "Com renderização no servidor, o HTML sai com um valor e o navegador, ao hidratar, recalcula outro: os ids **não coincidem** e o React acusa erro de hidratação, além de deixar as ligações quebradas. `Math.random()` também torna a renderização impura (muda a cada vez que o React renderiza). O contador global depende da ordem em que os componentes são renderizados, que pode diferir entre servidor e cliente (Suspense, carregamento sob demanda), e vaza estado entre requisições no servidor.",
          },
          {
            pergunta: "Como o `useId` resolve?",
            resposta:
              'Ele deriva o id da **posição do componente na árvore do React**, que é a mesma no servidor e no cliente. Por isso é estável entre renderizações do mesmo componente, igual dos dois lados e diferente entre instâncias. Para vários ids no mesmo componente, chame `useId` uma vez e acrescente sufixos (`id + "-ajuda"`).',
          },
          {
            pergunta: "Para que o `useId` não serve?",
            resposta:
              "Não é para `key` de lista: a `key` deve vir dos dados (o id do registro), não do componente. Não é para seletores CSS ou `querySelector`: o formato do texto gerado é detalhe interno e pode ter caracteres que exigem escape, então não dependa dele. E não é para identificar dados (chave de cache, id de banco), porque muda entre montagens.",
          },
        ],
        causaRaiz:
          "O id precisa ser **único por instância** e **igual no servidor e no cliente**. Só o React, que conhece a posição de cada componente na árvore, consegue garantir as duas coisas ao mesmo tempo.",
      },
      {
        tipo: "codigo",
        titulo: "Ligando label, campo e ajuda",
        legenda: "TSX",
        codigo: `import { useId } from "react";

export function CampoDeSenha({ ajuda }: { ajuda: string }) {
  const id = useId();
  const idCampo = id + "-campo";
  const idAjuda = id + "-ajuda";

  return (
    <div>
      <label htmlFor={idCampo}>Senha</label>
      <input id={idCampo} type="password" aria-describedby={idAjuda} />
      <p id={idAjuda}>{ajuda}</p>
    </div>
  );
}`,
        nota: "Duas instâncias de `CampoDeSenha` na mesma página recebem ids diferentes, e cada uma recebe o mesmo id no servidor e na hidratação.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra",
        texto:
          "Use `useId` para **ligar elementos de acessibilidade e formulário** dentro de um componente. Para qualquer outra coisa (chave de lista, dado, seletor), use a fonte certa: o dado, um id do registro ou uma classe.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não confunda com identidade de dado",
        texto:
          "O `useId` identifica uma **posição na árvore**, não um registro. Se você precisa de um id que sobreviva à desmontagem, vá ao servidor, ao banco ou ao estado. Se a página tiver mais de um app React, o React documenta um prefixo de identificador na raiz para evitar colisões; veja react.dev.",
      },
    ],
    armadilhas: [
      "Usar `useId` como `key` de itens de lista: a `key` deve vir dos dados, e o id do componente não identifica o item.",
      "Usar o valor em seletores CSS ou `querySelector`, ou depender do formato do texto: o formato é detalhe interno do React.",
      "Trocar por `Math.random()`, `Date.now()` ou um contador global: a hidratação quebra e a renderização deixa de ser pura.",
      "Gerar com `useId` ids de dados (chave de cache, persistência): o valor muda entre montagens e serve só para ligar elementos.",
    ],
    autoteste: [
      {
        pergunta: "Por que `Math.random()` causa erro de hidratação?",
        resposta:
          "Porque o servidor gera um valor e o navegador gera outro ao hidratar, então o HTML renderizado não coincide com o que o React espera no cliente.",
      },
      {
        pergunta: "Duas instâncias do mesmo componente com `useId` recebem o mesmo id?",
        resposta:
          "Não. Cada instância tem o seu, derivado da posição na árvore, e esse id é o mesmo no servidor e no cliente.",
      },
    ],
  },
  en: {
    titulo: "What useId is",
    pergunta: "What is useId()?",
    porqueEsteMetodo:
      "`useId` looks like a detail until you ask why `Math.random()` is not enough. The chain of whys leads from accessibility to hydration and shows the problem only React can solve.",
    resposta30s:
      "`useId` generates a **unique identifier per component instance**, used to link a `label` to an `input`, `aria-describedby` and similar attributes. Because it is derived from the component’s position in the tree, it is **identical on the server and on the client**, which `Math.random()` or a global counter do not guarantee and would cause a **hydration error**. It is not for list `key`s or CSS selectors.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does a component need a unique identifier?",
            resposta:
              "Because several attributes link elements by id: the `label`’s `htmlFor` with the `input`’s `id`, `aria-describedby`, `aria-labelledby`, `aria-controls`. If the id repeats on the page, the `label` focuses the wrong field and the screen reader reads another element’s description.",
          },
          {
            pergunta: 'Why not write a fixed id, like `id="email"`?',
            resposta:
              "Because components are reused. The second instance repeats the id, and a duplicate id is invalid HTML and breaks the link. The id has to be **per instance**, not per component.",
          },
          {
            pergunta: "Why do `Math.random()` or a global counter not work?",
            resposta:
              "With server rendering, the HTML goes out with one value and the browser, when hydrating, computes another: the ids **do not match** and React reports a hydration error, besides leaving the links broken. `Math.random()` also makes rendering impure (it changes every time React renders). A global counter depends on the order components render in, which can differ between server and client (Suspense, lazy loading), and leaks state between requests on the server.",
          },
          {
            pergunta: "How does `useId` solve it?",
            resposta:
              'It derives the id from the **component’s position in the React tree**, which is the same on the server and on the client. That makes it stable across renders of the same component, equal on both sides and different between instances. For several ids in the same component, call `useId` once and append suffixes (`id + "-help"`).',
          },
          {
            pergunta: "What is `useId` not for?",
            resposta:
              "It is not for list `key`s: the `key` should come from the data (the record’s id), not from the component. It is not for CSS selectors or `querySelector`: the generated text format is an internal detail and may contain characters that need escaping, so do not depend on it. And it is not for identifying data (a cache key, a database id), because it changes between mounts.",
          },
        ],
        causaRaiz:
          "The id must be **unique per instance** and **equal on the server and on the client**. Only React, which knows each component’s position in the tree, can guarantee both at the same time.",
      },
      {
        tipo: "codigo",
        titulo: "Linking label, field and help text",
        legenda: "TSX",
        codigo: `import { useId } from "react";

export function PasswordField({ help }: { help: string }) {
  const id = useId();
  const fieldId = id + "-field";
  const helpId = id + "-help";

  return (
    <div>
      <label htmlFor={fieldId}>Password</label>
      <input id={fieldId} type="password" aria-describedby={helpId} />
      <p id={helpId}>{help}</p>
    </div>
  );
}`,
        nota: "Two instances of `PasswordField` on the same page get different ids, and each gets the same id on the server and at hydration.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule",
        texto:
          "Use `useId` to **link accessibility and form elements** inside a component. For anything else (list key, data, selector), use the right source: the data, a record id or a class.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Do not confuse it with data identity",
        texto:
          "`useId` identifies a **position in the tree**, not a record. If you need an id that survives unmounting, go to the server, the database or state. If the page has more than one React app, React documents an identifier prefix on the root to avoid collisions; see react.dev.",
      },
    ],
    armadilhas: [
      "Using `useId` as the `key` of list items: the `key` should come from the data, and the component’s id does not identify the item.",
      "Using the value in CSS selectors or `querySelector`, or depending on the text format: the format is an internal React detail.",
      "Swapping it for `Math.random()`, `Date.now()` or a global counter: hydration breaks and rendering stops being pure.",
      "Generating data ids (a cache key, persistence) with `useId`: the value changes between mounts and only serves to link elements.",
    ],
    autoteste: [
      {
        pergunta: "Why does `Math.random()` cause a hydration error?",
        resposta:
          "Because the server generates one value and the browser generates another when hydrating, so the rendered HTML does not match what React expects on the client.",
      },
      {
        pergunta: "Do two instances of the same component using `useId` get the same id?",
        resposta:
          "No. Each instance has its own, derived from its position in the tree, and that id is the same on the server and on the client.",
      },
    ],
  },
};
