import type { Pergunta } from "../../tipos";

// S28 · Significado dos três pontos
export const s028: Pergunta = {
  numero: 628,
  modulo: "simplilearn-eventos",
  metodo: "compare",
  pt: {
    titulo: "Significado dos três pontos",
    pergunta: 'O que significam os três pontos (...) no React? (Exemplo: <Image {...aspects} source="img_source" />)',
    porqueEsteMetodo:
      "Os três pontos são um só símbolo com papéis que se parecem e não são iguais: espalhar props, copiar sem mutar e reunir o restante. Uma matriz separa cada papel e a regra de decisão diz quando usar cada um.",
    resposta30s:
      'Os três pontos são **sintaxe do JavaScript** com dois sentidos opostos: **spread** (espalhar) e **rest** (reunir). No JSX, `{...aspects}` espalha cada chave do objeto como uma prop, então `<Image {...aspects} source="img_source" />` equivale a escrever cada atributo à mão. Em `[...lista, novo]` e `{ ...objeto, campo }` o spread copia sem mutar, base das atualizações de state, e em `function Botao({ rotulo, ...resto })` o rest reúne o que sobrou.',
    blocos: [
      {
        tipo: "tabela",
        titulo: "Os três pontos têm papéis diferentes",
        colunas: ["Papel", "Onde aparece", "O que faz", "Exemplo"],
        linhas: [
          [
            "Spread de objeto nas props (JSX)",
            "Entre as props de um elemento",
            "Espalha cada chave do objeto como uma prop. Os atributos escritos depois sobrescrevem os espalhados",
            '`<Image {...aspects} source="img_source" />`',
          ],
          [
            "Spread de objeto num literal",
            "Dentro de `{ }`, ao criar um objeto",
            "Copia as chaves para um objeto novo (cópia rasa). As chaves seguintes sobrescrevem as anteriores",
            '`{ ...usuario, nome: "Bia" }`',
          ],
          [
            "Spread de array",
            "Dentro de `[ ]` ou nos argumentos de uma chamada",
            "Copia os elementos de um iterável para outro array, ou os passa como argumentos separados",
            "`[...lista, novo]` e `Math.max(...numeros)`",
          ],
          [
            "Rest em desestruturação",
            "Do lado esquerdo: parâmetros do componente e `const { a, ...resto } = obj`",
            "Reúne o que sobrou do objeto (ou do array) numa variável nova",
            "`function Botao({ rotulo, ...resto })`",
          ],
          [
            "Rest em parâmetros de função",
            "No último parâmetro de uma função",
            "Reúne os argumentos restantes num array de verdade",
            "`function somar(...numeros)`",
          ],
        ],
        nota: "O mesmo símbolo, dois sentidos opostos: onde se usa um valor, ele espalha (spread); onde se declara, ele reúne (rest).",
      },
      {
        tipo: "codigo",
        titulo: "Rest e spread nas props",
        legenda: "JSX",
        codigo: `// rest: reúne o que sobrou (onClick, disabled, aria-...)
function Botao({ rotulo, variante = "primario", ...resto }) {
  return (
    <button className={"btn btn-" + variante} {...resto}>
      {rotulo}
    </button>
  );
}

const aspects = { width: 320, height: 180, alt: "Capa" };

// spread nas props: cada chave vira um atributo
<Image {...aspects} source="img_source" />;
// equivale a:
<Image width={320} height={180} alt="Capa" source="img_source" />;

// a ordem importa: o último valor vence
<Image {...aspects} width={640} />; // width = 640
<Image width={640} {...aspects} />; // width = 320`,
      },
      {
        tipo: "codigo",
        titulo: "Spread para atualizar o state sem mutar",
        legenda: "JSX",
        codigo: `const [usuario, setUsuario] = useState({ nome: "Ana", endereco: { cidade: "Recife" } });
const [tarefas, setTarefas] = useState(["lavar"]);

// objeto: copia as chaves e troca só uma
setUsuario((atual) => ({ ...atual, nome: "Bia" }));

// array: copia os itens e acrescenta um (o original não muda)
setTarefas((atual) => [...atual, "estudar"]);

// cópia rasa: para mexer num objeto interno, copie também o interno
setUsuario((atual) => ({
  ...atual,
  endereco: { ...atual.endereco, cidade: "Olinda" },
}));`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Spread ou props explícitas?",
        texto:
          "Use **spread** para repassar adiante o que o componente não consome (um wrapper de `<button>` ou `<input>`, um componente de apresentação) e para copiar state sem mutar. Use **props explícitas** quando o componente conhece e valida o que recebe: elas documentam o contrato, o TypeScript confere e uma prop nova não entra no DOM sem ninguém perceber. No meio-termo está o rest: desestruture as props que são suas e espalhe só o `resto`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cuidado ao repassar props desconhecidas ao DOM",
        texto:
          "`<div {...props}>` com tudo que o componente recebeu leva ao DOM props que não são atributos (`variante`, `ehAtivo`): o React avisa que não reconhece a prop, e dados internos podem vazar para o HTML. Também deixa o chamador sobrescrever o `className`, o `onClick` ou o `style` que o componente definiu antes do spread. A ordem manda: o último valor vence, então decida de propósito se o chamador pode sobrescrever (spread por último) ou não (spread antes). E o spread é uma cópia rasa; passar `key` por spread pode gerar aviso nas versões recentes, então escreva a `key` explicitamente.",
      },
    ],
    armadilhas: [
      "Achar que `...` é recurso do React: é sintaxe do JavaScript, e o JSX só a reaproveita nas props.",
      "Errar a ordem: `{...props}` depois das props fixas deixa o chamador sobrescrever o que você definiu; antes delas, o seu valor vence.",
      "Esperar que o spread copie fundo: a cópia é rasa, e objetos e arrays internos continuam compartilhados com o original, então mexer neles muta o state.",
      "Repassar `{...props}` inteiro a um elemento do DOM: props desconhecidas viram aviso e atributos indesejados.",
    ],
    autoteste: [
      {
        pergunta: "Como saber se os três pontos são spread ou rest?",
        resposta:
          "Pela posição. Onde se usa um valor (chamada de função, literal de array ou de objeto, props do JSX), eles espalham. Onde se declara algo (parâmetros, desestruturação), eles reúnem o que sobrou.",
      },
      {
        pergunta: "O que renderiza `<Image {...aspects} width={640} />` se `aspects` tem `width: 320`?",
        resposta:
          "A largura 640. As props são aplicadas em ordem e o último valor vence; se `width={640}` viesse antes do spread, ganharia o 320 de `aspects`.",
      },
    ],
  },
  en: {
    titulo: "What the three dots mean",
    pergunta: 'What Do the Three Dots (...) Mean in React? (Example: <Image {...aspects} source="img_source" />)',
    porqueEsteMetodo:
      "The three dots are a single symbol with roles that look alike and are not the same: spreading props, copying without mutating and gathering the rest. A matrix separates each role and the decision rule says when to use each one.",
    resposta30s:
      'The three dots are **JavaScript syntax** with two opposite meanings: **spread** (expand) and **rest** (gather). In JSX, `{...aspects}` spreads each key of the object as a prop, so `<Image {...aspects} source="img_source" />` is the same as writing every attribute by hand. In `[...list, item]` and `{ ...object, field }` spread copies without mutating, the basis of state updates, and in `function Button({ label, ...rest })` rest gathers what is left.',
    blocos: [
      {
        tipo: "tabela",
        titulo: "The three dots play different roles",
        colunas: ["Role", "Where it appears", "What it does", "Example"],
        linhas: [
          [
            "Object spread in props (JSX)",
            "Among an element’s props",
            "Spreads each key of the object as a prop. Attributes written after override the spread ones",
            '`<Image {...aspects} source="img_source" />`',
          ],
          [
            "Object spread in a literal",
            "Inside `{ }`, when creating an object",
            "Copies the keys into a new object (shallow copy). Later keys override earlier ones",
            '`{ ...user, name: "Bea" }`',
          ],
          [
            "Array spread",
            "Inside `[ ]` or in a call’s arguments",
            "Copies the elements of an iterable into another array, or passes them as separate arguments",
            "`[...list, item]` and `Math.max(...numbers)`",
          ],
          [
            "Rest in destructuring",
            "On the left side: component parameters and `const { a, ...rest } = obj`",
            "Gathers what is left of the object (or array) into a new variable",
            "`function Button({ label, ...rest })`",
          ],
          [
            "Rest in function parameters",
            "In a function’s last parameter",
            "Gathers the remaining arguments into a real array",
            "`function sum(...numbers)`",
          ],
        ],
        nota: "One symbol, two opposite meanings: where a value is used, it spreads; where something is declared, it gathers (rest).",
      },
      {
        tipo: "codigo",
        titulo: "Rest and spread in props",
        legenda: "JSX",
        codigo: `// rest: gathers what is left (onClick, disabled, aria-...)
function Button({ label, variant = "primary", ...rest }) {
  return (
    <button className={"btn btn-" + variant} {...rest}>
      {label}
    </button>
  );
}

const aspects = { width: 320, height: 180, alt: "Cover" };

// spread in props: each key becomes an attribute
<Image {...aspects} source="img_source" />;
// is the same as:
<Image width={320} height={180} alt="Cover" source="img_source" />;

// order matters: the last value wins
<Image {...aspects} width={640} />; // width = 640
<Image width={640} {...aspects} />; // width = 320`,
      },
      {
        tipo: "codigo",
        titulo: "Spread to update state without mutating",
        legenda: "JSX",
        codigo: `const [user, setUser] = useState({ name: "Ann", address: { city: "Recife" } });
const [tasks, setTasks] = useState(["wash"]);

// object: copy the keys and change just one
setUser((current) => ({ ...current, name: "Bea" }));

// array: copy the items and add one (the original does not change)
setTasks((current) => [...current, "study"]);

// shallow copy: to change an inner object, copy the inner one too
setUser((current) => ({
  ...current,
  address: { ...current.address, city: "Olinda" },
}));`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Spread or explicit props?",
        texto:
          "Use **spread** to pass along what the component does not consume (a wrapper around `<button>` or `<input>`, a presentational component) and to copy state without mutating. Use **explicit props** when the component knows and validates what it receives: they document the contract, TypeScript checks them and a new prop does not slip into the DOM unnoticed. Rest sits in the middle: destructure the props that are yours and spread only the `rest`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Careful when passing unknown props to the DOM",
        texto:
          "`<div {...props}>` with everything the component received sends non-attribute props to the DOM (`variant`, `isActive`): React warns that it does not recognize the prop, and internal data can leak into the HTML. It also lets the caller override the `className`, `onClick` or `style` the component set before the spread. Order rules: the last value wins, so decide on purpose whether the caller may override (spread last) or not (spread first). And spread is a shallow copy; passing `key` through a spread may trigger a warning in recent versions, so write the `key` explicitly.",
      },
    ],
    armadilhas: [
      "Thinking `...` is a React feature: it is JavaScript syntax, and JSX only reuses it for props.",
      "Getting the order wrong: `{...props}` after fixed props lets the caller override what you set; before them, your value wins.",
      "Expecting spread to copy deeply: the copy is shallow, and inner objects and arrays stay shared with the original, so changing them mutates the state.",
      "Passing the whole `{...props}` to a DOM element: unknown props turn into warnings and unwanted attributes.",
    ],
    autoteste: [
      {
        pergunta: "How can you tell whether the three dots are spread or rest?",
        resposta:
          "By position. Where a value is used (function call, array or object literal, JSX props), they spread. Where something is declared (parameters, destructuring), they gather what is left.",
      },
      {
        pergunta: "What does `<Image {...aspects} width={640} />` render if `aspects` has `width: 320`?",
        resposta:
          "A width of 640. Props are applied in order and the last value wins; if `width={640}` came before the spread, the 320 from `aspects` would win.",
      },
    ],
  },
};
