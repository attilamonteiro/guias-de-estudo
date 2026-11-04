import type { Pergunta } from "../../tipos";

// L65 · Efeitos colaterais na renderização
export const l065: Pergunta = {
  numero: 65,
  modulo: "linkedin-regras-e-effects",
  metodo: "whys",
  pt: {
    titulo: "Efeitos colaterais na renderização",
    pergunta: "Por que efeitos colaterais não devem rodar durante a renderização?",
    porqueEsteMetodo:
      "A regra parece dogma até você encadear as razões: o que o React espera do corpo do componente, o que ele se reserva o direito de fazer com ele e o que dá errado quando há um efeito ali. A cadeia de “por quês” transforma a regra em consequência.",
    resposta30s:
      "A renderização é um **cálculo**: o corpo do componente deve ser uma **função pura** de props, state e context, que devolve JSX e não altera nada que já existia. O React **pode chamá-lo várias vezes, interrompê-lo ou descartar o resultado** (renderização concorrente, Strict Mode), então um fetch, um timer ou uma mutação ali se repetiria, vazaria ou daria resultados diferentes. Efeitos vão em **handlers de eventos** (resposta a uma ação) ou no **`useEffect`** (sincronizar com algo de fora, depois do commit).",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o corpo do componente precisa ser puro?",
            resposta:
              "Porque o React o trata como uma **receita para calcular a tela**: mesma entrada (props, state, context), mesmo JSX. Pura quer dizer duas coisas: não depende de nada além dessas entradas e não altera nada que existia antes da chamada. Com essa garantia o React fica livre para decidir quando, quantas vezes e se vale a pena chamar o componente, e você consegue raciocinar sobre a UI sem conhecer a ordem das chamadas.",
          },
          {
            pergunta: "Por que o React poderia chamar a renderização mais de uma vez, ou jogar o resultado fora?",
            resposta:
              "Porque **renderizar não é o mesmo que atualizar a tela**: a tela só muda no commit. Em renderização concorrente o React pode pausar uma renderização para atender algo mais urgente, retomá-la depois ou abandoná-la (transições, Suspense). Um componente também renderiza de novo sempre que o pai renderiza, e em desenvolvimento o **Strict Mode** chama o corpo duas vezes de propósito para expor impurezas.",
          },
          {
            pergunta: "Por que um efeito colateral ali se repetiria ou vazaria?",
            resposta:
              "Porque ele acompanha a renderização, não o commit. Um `fetch` no corpo dispara a cada chamada (e, se a resposta gravar state, provoca outra renderização e outra requisição: um laço). Um `setInterval` criado ali nasce a cada render e, como a renderização pode ser descartada, ninguém guarda o identificador para limpar. Mutar uma variável externa dá resultados diferentes conforme a ordem e o número de chamadas.",
          },
          {
            pergunta: "Existe alguma mutação aceitável durante a renderização?",
            resposta:
              "Sim: a **mutação local**. Um array ou objeto criado dentro da própria renderização e usado só nela pode ser montado com `push` à vontade, porque nasce e morre dentro da chamada e ninguém de fora o enxerga. O proibido é alterar o que veio de fora: props, objetos do state, variáveis de módulo, o DOM. Ler `Math.random()` ou `Date.now()` direto no corpo também torna o resultado imprevisível.",
          },
          {
            pergunta: "Então onde os efeitos colaterais devem ir?",
            resposta:
              "Para onde o React garante o momento certo. Uma **resposta a uma ação do usuário** (enviar, salvar) vai num **handler de evento**, que roda uma vez por ação e nunca durante a renderização. A **sincronização com algo de fora** (rede ao exibir uma tela, DOM imperativo, assinaturas, timers) vai no **`useEffect`**, que roda depois do commit e pode devolver uma função de limpeza. Dado derivado não é efeito: calcule no render.",
          },
        ],
        causaRaiz:
          "A renderização é um **cálculo que o React controla** (quando, quantas vezes, se vale), e só o commit mexe no mundo. Efeito colateral dentro do cálculo é efeito fora de controle: por isso ele mora em handlers e no `useEffect`.",
      },
      {
        tipo: "tabela",
        titulo: "Onde cada efeito colateral deve morar",
        colunas: ["Efeito colateral", "Por que não no corpo", "Onde colocar"],
        linhas: [
          [
            "Buscar dados ao exibir o componente",
            "Repete a cada renderização e pode disparar outra renderização",
            "`useEffect` com limpeza (veja L70), ou uma biblioteca ou framework de dados",
          ],
          [
            "Enviar um formulário, salvar, notificar",
            "É resposta a uma ação do usuário, não parte do cálculo da tela",
            "Handler de evento (`onSubmit`, `onClick`)",
          ],
          [
            "Mexer no DOM de forma imperativa, foco, medidas",
            "A tela ainda não foi atualizada nesse ponto",
            "`useEffect` (ou `useLayoutEffect` para medir antes da pintura) e refs",
          ],
          [
            "Timers, listeners e assinaturas",
            "Nascem a cada renderização e nada os limpa",
            "`useEffect` com função de limpeza (veja L69)",
          ],
          [
            "Mudar variável de módulo, objeto de props ou do state",
            "O resultado depende da ordem e do número de chamadas",
            "Setter do state, ou calcule uma cópia nova",
          ],
          [
            "Ler `Math.random()` ou `Date.now()` para exibir",
            "Cada chamada devolve um valor diferente",
            "Gerar no handler ou no efeito e guardar no state, ou receber por props",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Impuro, puro e mutação local aceitável",
        legenda: "JSX",
        codigo: [
          "let convidados = 0;",
          "",
          "function CopoImpuro() {",
          "  convidados = convidados + 1; // muda algo que existia antes da chamada",
          "  return <p>Copo nº {convidados}</p>; // cada chamada devolve um JSX diferente",
          "}",
          "",
          "function Copo({ numero }) {",
          "  return <p>Copo nº {numero}</p>; // pura: mesma entrada, mesma saída",
          "}",
          "",
          "function Lista({ nomes }) {",
          "  const itens = []; // nasce nesta renderização: mutação local é segura",
          "  for (const nome of nomes) itens.push(<li key={nome}>{nome}</li>);",
          "  return <ul>{itens}</ul>;",
          "}",
        ].join("\n"),
        nota: "Com o Strict Mode, os números de `CopoImpuro` saltariam, porque a chamada extra também incrementa a variável. É assim que o erro aparece em desenvolvimento.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O Strict Mode é o detector, não o problema",
        texto:
          "Em desenvolvimento, o Strict Mode chama o corpo do componente duas vezes e também executa e limpa os efeitos uma vez a mais (veja L69). Se algo muda de comportamento por causa disso, existe uma impureza ou uma limpeza que falta: corrija a causa em vez de remover o Strict Mode. Em produção não há essa chamada extra, mas a renderização concorrente continua podendo repetir ou descartar renderizações.",
      },
    ],
    armadilhas: [
      "Achar que o corpo “só roda uma vez” porque o componente aparece uma vez na tela: ele executa a cada renderização, e o React pode renderizar sem confirmar nada na tela.",
      "Chamar `setState` incondicionalmente no corpo, ou disparar ali um `fetch` que grava state: cria um laço de renderizações.",
      "Confundir mutação local com mutação de fora: montar um array novo com `push` é seguro; mexer em props, objetos do state ou variáveis de módulo não é.",
      "Tratar o Strict Mode como defeito e removê-lo: ele existe para denunciar exatamente esse tipo de erro.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre renderização e commit, e por que ela importa aqui?",
        resposta:
          "Renderizar é chamar os componentes para calcular o JSX; o commit é quando o React aplica a mudança no DOM. O React pode renderizar sem fazer commit (pausar, descartar), então um efeito colateral na renderização pode acontecer sem que a tela mude e se repetir sem controle.",
      },
      {
        pergunta: "Montar um array com `push` dentro do componente é um efeito colateral proibido?",
        resposta:
          "Não. É mutação local: o array nasceu na própria renderização e ninguém de fora o enxerga. O proibido é mudar algo que existia antes da chamada, como props, objetos do state ou variáveis de módulo.",
      },
    ],
  },
  en: {
    titulo: "Side effects during render",
    pergunta: "Why should side effects not run during rendering?",
    porqueEsteMetodo:
      "The rule feels like dogma until you chain the reasons: what React expects from a component body, what it reserves the right to do with it and what goes wrong when a side effect lives there. The chain of whys turns the rule into a consequence.",
    resposta30s:
      "Rendering is a **calculation**: the component body should be a **pure function** of props, state and context that returns JSX and changes nothing that existed before. React **may call it several times, pause it or throw the result away** (concurrent rendering, Strict Mode), so a fetch, a timer or a mutation there would repeat, leak or give different results. Side effects belong in **event handlers** (a response to an action) or in **`useEffect`** (syncing with something outside React, after the commit).",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why must the component body be pure?",
            resposta:
              "Because React treats it as a **recipe for computing the screen**: same input (props, state, context), same JSX. Pure means two things: it depends on nothing but those inputs, and it changes nothing that existed before the call. With that guarantee React is free to decide when, how many times and whether to call the component, and you can reason about the UI without knowing the order of calls.",
          },
          {
            pergunta: "Why might React call rendering more than once, or throw the result away?",
            resposta:
              "Because **rendering is not the same as updating the screen**: the screen only changes at commit. With concurrent rendering React can pause a render to handle something more urgent, resume it later or abandon it (transitions, Suspense). A component also renders again whenever its parent renders, and in development **Strict Mode** calls the body twice on purpose to expose impurities.",
          },
          {
            pergunta: "Why would a side effect there repeat or leak?",
            resposta:
              "Because it follows rendering, not the commit. A `fetch` in the body fires on every call (and if the response writes state, it triggers another render and another request: a loop). A `setInterval` created there is born on every render and, since a render can be discarded, nobody keeps the id to clean it up. Mutating an outside variable gives different results depending on the order and number of calls.",
          },
          {
            pergunta: "Is any mutation during render acceptable?",
            resposta:
              "Yes: **local mutation**. An array or object created inside the render itself and used only there can be built freely with `push`, because it is born and dies within the call and nobody outside sees it. What is forbidden is changing what came from outside: props, state objects, module variables, the DOM. Reading `Math.random()` or `Date.now()` directly in the body also makes the result unpredictable.",
          },
          {
            pergunta: "So where do side effects go?",
            resposta:
              "Where React guarantees the right moment. A **response to a user action** (submit, save) goes in an **event handler**, which runs once per action and never during rendering. **Syncing with something outside** (network on display, imperative DOM, subscriptions, timers) goes in **`useEffect`**, which runs after the commit and can return a cleanup function. Derived data is not an effect: compute it during render.",
          },
        ],
        causaRaiz:
          "Rendering is a **calculation React controls** (when, how many times, whether it counts), and only the commit touches the world. A side effect inside the calculation is a side effect out of control, which is why it lives in handlers and in `useEffect`.",
      },
      {
        tipo: "tabela",
        titulo: "Where each side effect belongs",
        colunas: ["Side effect", "Why not in the body", "Where it goes"],
        linhas: [
          [
            "Fetching data when the component appears",
            "Repeats on every render and can trigger another render",
            "`useEffect` with cleanup (see L70), or a data library or framework",
          ],
          [
            "Submitting a form, saving, notifying",
            "It responds to a user action; it is not part of computing the screen",
            "Event handler (`onSubmit`, `onClick`)",
          ],
          [
            "Imperative DOM work, focus, measurements",
            "The screen has not been updated at that point",
            "`useEffect` (or `useLayoutEffect` to measure before paint) and refs",
          ],
          [
            "Timers, listeners and subscriptions",
            "They are created on every render and nothing cleans them up",
            "`useEffect` with a cleanup function (see L69)",
          ],
          [
            "Changing a module variable, a props object or a state object",
            "The result depends on the order and number of calls",
            "The state setter, or compute a fresh copy",
          ],
          [
            "Reading `Math.random()` or `Date.now()` to display",
            "Every call returns a different value",
            "Generate it in a handler or an effect and store it in state, or receive it as a prop",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Impure, pure and acceptable local mutation",
        legenda: "JSX",
        codigo: [
          "let guests = 0;",
          "",
          "function ImpureCup() {",
          "  guests = guests + 1; // changes something that existed before the call",
          "  return <p>Cup no. {guests}</p>; // every call returns different JSX",
          "}",
          "",
          "function Cup({ number }) {",
          "  return <p>Cup no. {number}</p>; // pure: same input, same output",
          "}",
          "",
          "function List({ names }) {",
          "  const items = []; // born in this render: local mutation is safe",
          "  for (const name of names) items.push(<li key={name}>{name}</li>);",
          "  return <ul>{items}</ul>;",
          "}",
        ].join("\n"),
        nota: "With Strict Mode, the numbers from `ImpureCup` would jump, because the extra call also increments the variable. That is how the bug shows up in development.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Strict Mode is the detector, not the problem",
        texto:
          "In development, Strict Mode calls the component body twice and also runs and cleans up effects one extra time (see L69). If something behaves differently because of that, there is an impurity or a missing cleanup: fix the cause instead of removing Strict Mode. Production has no such extra call, but concurrent rendering can still repeat or discard renders.",
      },
    ],
    armadilhas: [
      "Assuming the body “runs only once” because the component appears once on screen: it runs on every render, and React can render without committing anything.",
      "Calling `setState` unconditionally in the body, or firing a `fetch` there that writes state: it creates a render loop.",
      "Mixing up local mutation with outside mutation: building a new array with `push` is safe; touching props, state objects or module variables is not.",
      "Treating Strict Mode as a defect and removing it: it exists to flag exactly this kind of mistake.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between rendering and commit, and why does it matter here?",
        resposta:
          "Rendering means calling components to compute JSX; the commit is when React applies the change to the DOM. React can render without committing (pause, discard), so a side effect during render can happen without the screen changing and can repeat without control.",
      },
      {
        pergunta: "Is building an array with `push` inside a component a forbidden side effect?",
        resposta:
          "No. It is local mutation: the array was born in that very render and nobody outside sees it. What is forbidden is changing something that existed before the call, such as props, state objects or module variables.",
      },
    ],
  },
};
