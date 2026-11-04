import type { Pergunta } from "../../tipos";

// L185 · Evitar componentes muito acoplados
export const l185: Pergunta = {
  numero: 185,
  modulo: "linkedin-rotas-e-arquitetura",
  metodo: "whys",
  pt: {
    titulo: "Evitar componentes muito acoplados",
    pergunta: "Como você evita componentes fortemente acoplados?",
    porqueEsteMetodo:
      "A pergunta pede o motivo antes da técnica: quem só decorou “use composição” não sabe quando aplicar. A cadeia de “por quês” parte do sintoma (mexi aqui e quebrou ali) e chega à causa e aos remédios.",
    resposta30s:
      "Componentes **fortemente acoplados** dependem dos detalhes uns dos outros: mudar um quebra o outro, testar exige montar o mundo inteiro e reusar vira copiar. Evita-se tornando a dependência **explícita, estreita e substituível**: **composição** com `children`, dados e funções por **props pequenas**, serviços por **Context**, lógica isolada em **hooks** e **fronteiras claras** entre módulos.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que mudar um componente quebra outro?",
            resposta:
              "Porque o segundo depende de **detalhes** do primeiro: o formato exato de uma prop, a estrutura do DOM, o estado interno, o nome de um campo da API. Cada dependência escondida é um contrato que ninguém escreveu; mudou o detalhe, quebrou quem contava com ele.",
          },
          {
            pergunta: "Por que o componente acaba conhecendo tantos detalhes?",
            resposta:
              "Porque ele faz coisas demais: busca dados, conhece a URL e o formato da resposta, lê o store global, decide regra de negócio e ainda desenha. Os sinais clássicos são props demais, um objeto inteiro recebido só para ler um campo e importações diretas do cliente de API ou do store dentro do componente visual.",
          },
          {
            pergunta: "Por que isso estraga os testes e o reuso?",
            resposta:
              "Para renderizar o componente num teste, ou em outra tela, é preciso montar tudo o que ele conhece: servidor falso, provedor, store, rota. Um componente que só recebe dados e callbacks funciona em qualquer lugar; um que sabe de onde os dados vêm só serve onde nasceu.",
          },
          {
            pergunta: "Por que composição e injeção resolvem?",
            resposta:
              "Em vez de o componente buscar o que precisa, quem o usa **entrega**: o conteúdo por `children` ou por props de encaixe, os dados e as funções por props, os serviços por Context. A dependência passa a ser visível, pequena e trocável, inclusive por um dublê no teste.",
          },
          {
            pergunta: "Por que hooks e fronteiras de módulo ajudam?",
            resposta:
              "Um **hook customizado** isola a lógica (busca, formulário, filtros) da apresentação: o componente visual fica simples e o hook se testa e se reaproveita sozinho. As **fronteiras de módulo** (cada pasta expõe uma entrada pública e os outros módulos não importam arquivos internos) impedem que o acoplamento se espalhe; uma regra de lint sobre importações pode vigiar isso.",
          },
        ],
        causaRaiz:
          "O acoplamento nasce de **dependências implícitas e largas**: o componente depende de mais coisas, e de mais detalhes delas, do que precisa. A cura é **tornar a dependência explícita, estreita e substituível**: receber por props, `children` ou Context o que precisa e esconder o resto atrás de um contrato pequeno.",
      },
      {
        tipo: "codigo",
        titulo: "O sintoma e a cura",
        legenda: "TSX",
        codigo: `import { useEffect, useState, type ReactNode } from "react";

// Acoplado: busca, conhece a API e o store e ainda desenha
function CartaoDoUsuario({ id }: { id: string }) {
  const [u, setU] = useState<any>(null);
  const tema = useLojaGlobal((s) => s.tema); // um store global qualquer
  useEffect(() => {
    fetch("/api/v2/users/" + id).then((r) => r.json()).then(setU);
  }, [id]);
  return <div className={tema.cartao}>{u?.profile.fullName}</div>;
}

// Desacoplado: recebe só o que precisa; o conteúdo vem por children
function Cartao({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <section className="cartao">
      <h3>{titulo}</h3>
      {children}
    </section>
  );
}
// A busca vai para um hook: const { nome } = useUsuario(id);`,
        nota: "O segundo componente não sabe de API, de store nem de quem o usa. Quem monta a tela decide o título e o que entra no meio: `<Cartao titulo={nome}><BotaoSeguir /></Cartao>`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Sinais de acoplamento e o remédio mais barato",
        texto:
          "Desconfie quando o componente tem props demais, importa `fetch` ou o store diretamente, exige provedores e servidor para ser testado, ou muda sempre que o formato da API muda. O remédio mais barato costuma ser separar **quem sabe de onde vêm os dados** (um hook ou um componente contêiner) de **quem sabe desenhá-los** (um componente que só recebe props).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Desacoplar também tem custo",
        texto:
          "Context não é remédio universal: ele esconde a dependência (ela some das props) e os consumidores re-renderizam quando o valor muda, então use-o para dados realmente transversais, como tema e sessão. Abstrair cedo demais gera componentes “genéricos” com dezenas de props de configuração. Um pouco de duplicação costuma custar menos que a abstração errada: agrupe o que **muda junto**.",
      },
    ],
    armadilhas: [
      "Resolver o prop drilling jogando tudo num Context ou num store global: o acoplamento continua, só deixa de aparecer nas props.",
      "Passar o objeto inteiro (`usuario`, a resposta da API) a um componente que usa só um campo: ele passa a depender do formato todo.",
      "Abstrair cedo demais, com um componente “genérico” cheio de props de configuração (`variant`, `mode`, `renderX`): troca um acoplamento por outro.",
      "Importar arquivos internos de outro módulo (`../checkout/utils/formatar`) em vez da entrada pública dele: quem reorganiza o módulo quebra quem furou a fronteira.",
    ],
    autoteste: [
      {
        pergunta: "Que sinais mostram que um componente está fortemente acoplado?",
        resposta:
          "Props demais ou objetos inteiros passados para ler um campo, importação direta de API ou de store global, testes que exigem montar provedores e servidor, e mudanças que se espalham por vários arquivos sem relação aparente.",
      },
      {
        pergunta: "Como `children`, Context e hooks reduzem o acoplamento, e qual o cuidado com o Context?",
        resposta:
          "`children` e props de encaixe deixam quem usa decidir o conteúdo; o Context injeta um serviço ou uma configuração sem passar por todos os níveis; os hooks isolam a lógica da apresentação. O cuidado: o Context esconde a dependência e faz os consumidores re-renderizarem quando o valor muda, então serve para dados transversais.",
      },
    ],
  },
  en: {
    titulo: "Preventing tight coupling",
    pergunta: "How do you prevent tightly coupled components?",
    porqueEsteMetodo:
      "The question asks for the reason before the technique: someone who only memorized “use composition” does not know when to apply it. The chain of whys starts at the symptom (I changed this and that broke) and reaches the cause and the remedies.",
    resposta30s:
      "**Tightly coupled** components depend on each other’s details: changing one breaks the other, testing means assembling the whole world, and reuse turns into copy-paste. You prevent it by making the dependency **explicit, narrow and replaceable**: **composition** with `children`, data and functions through **small props**, services through **Context**, logic isolated in **hooks** and **clear boundaries** between modules.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does changing one component break another?",
            resposta:
              "Because the second depends on **details** of the first: the exact shape of a prop, the DOM structure, internal state, the name of an API field. Every hidden dependency is a contract nobody wrote down; change the detail and whoever counted on it breaks.",
          },
          {
            pergunta: "Why does a component end up knowing so many details?",
            resposta:
              "Because it does too much: it fetches data, knows the URL and the response shape, reads the global store, decides business rules and also draws the UI. The classic signs are too many props, a whole object received just to read one field, and direct imports of the API client or the store inside the visual component.",
          },
          {
            pergunta: "Why does that ruin tests and reuse?",
            resposta:
              "To render the component in a test, or on another screen, you must assemble everything it knows about: a fake server, a provider, a store, a route. A component that only receives data and callbacks works anywhere; one that knows where its data comes from only works where it was born.",
          },
          {
            pergunta: "Why do composition and injection fix it?",
            resposta:
              "Instead of the component fetching what it needs, whoever uses it **supplies** it: content through `children` or slot props, data and functions through props, services through Context. The dependency becomes visible, small and replaceable, even by a test double.",
          },
          {
            pergunta: "Why do hooks and module boundaries help?",
            resposta:
              "A **custom hook** isolates the logic (fetching, forms, filters) from the presentation: the visual component stays simple, and the hook can be tested and reused on its own. **Module boundaries** (each folder exposes one public entry point and other modules do not import its internal files) stop the coupling from spreading; a lint rule on imports can enforce this.",
          },
        ],
        causaRaiz:
          "Coupling comes from **implicit, wide dependencies**: the component depends on more things, and on more details of them, than it needs. The cure is to **make the dependency explicit, narrow and replaceable**: receive what it needs through props, `children` or Context, and hide the rest behind a small contract.",
      },
      {
        tipo: "codigo",
        titulo: "The symptom and the cure",
        legenda: "TSX",
        codigo: `import { useEffect, useState, type ReactNode } from "react";

// Coupled: fetches, knows the API and the store, and also draws the UI
function UserCard({ id }: { id: string }) {
  const [u, setU] = useState<any>(null);
  const theme = useGlobalStore((s) => s.theme); // any global store
  useEffect(() => {
    fetch("/api/v2/users/" + id).then((r) => r.json()).then(setU);
  }, [id]);
  return <div className={theme.card}>{u?.profile.fullName}</div>;
}

// Decoupled: receives only what it needs; content comes in as children
function Card({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      {children}
    </section>
  );
}
// The fetching moves into a hook: const { name } = useUser(id);`,
        nota: "The second component knows nothing about APIs, stores or who uses it. Whoever builds the screen decides the title and what goes inside: `<Card title={name}><FollowButton /></Card>`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Signs of coupling and the cheapest remedy",
        texto:
          "Be suspicious when a component has too many props, imports `fetch` or the store directly, needs providers and a server to be tested, or changes whenever the API shape changes. The cheapest remedy is usually to separate **whoever knows where the data comes from** (a hook or a container component) from **whoever knows how to draw it** (a component that only receives props).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Decoupling has a cost too",
        texto:
          "Context is not a universal remedy: it hides the dependency (it disappears from the props) and consumers re-render when the value changes, so use it for genuinely cross-cutting data such as theme and session. Abstracting too early produces “generic” components with dozens of configuration props. A little duplication often costs less than the wrong abstraction: group what **changes together**.",
      },
    ],
    armadilhas: [
      "Solving prop drilling by dumping everything into a Context or a global store: the coupling stays, it just stops showing up in the props.",
      "Passing the whole object (`user`, the API response) to a component that uses a single field: it now depends on the entire shape.",
      "Abstracting too early, with a “generic” component full of configuration props (`variant`, `mode`, `renderX`): it trades one coupling for another.",
      "Importing internal files of another module (`../checkout/utils/format`) instead of its public entry point: whoever reorganizes that module breaks whoever crossed the boundary.",
    ],
    autoteste: [
      {
        pergunta: "What signs show that a component is tightly coupled?",
        resposta:
          "Too many props or whole objects passed to read one field, direct imports of an API or global store, tests that require assembling providers and a server, and changes that spread across several files with no obvious relationship.",
      },
      {
        pergunta: "How do `children`, Context and hooks reduce coupling, and what is the caution with Context?",
        resposta:
          "`children` and slot props let the caller decide the content; Context injects a service or a setting without passing it through every level; hooks isolate logic from presentation. The caution: Context hides the dependency and makes consumers re-render when the value changes, so it suits cross-cutting data.",
      },
    ],
  },
};
