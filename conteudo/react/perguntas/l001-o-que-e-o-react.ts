import type { Pergunta } from "../../tipos";

// L01 · O que é o React
export const l001: Pergunta = {
  numero: 1,
  modulo: "linkedin-fundamentos",
  metodo: "feynman",
  pt: {
    titulo: "O que é o React",
    pergunta: "O que é o React?",
    porqueEsteMetodo:
      "O React parece difícil até aparecer a ideia simples por trás dele: a tela é uma função do state. Uma analogia primeiro, o mecanismo real depois e o ponto em que a imagem para de valer respondem de uma vez às variações da pergunta (o que é, por que usar, biblioteca ou framework, quais recursos).",
    resposta30s:
      "O **React** é uma **biblioteca JavaScript declarativa** para construir interfaces a partir de **componentes** reutilizáveis: você descreve como a tela deve ficar para um dado **state** e o React cuida de atualizar o DOM. É uma **biblioteca**: cuida da camada de visão, enquanto roteamento, dados e build vêm de outras ferramentas ou de frameworks construídos sobre ele. Os recursos centrais são componentes, **JSX**, **Virtual DOM**, **fluxo de dados unidirecional** e **Hooks**.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense no painel de voos de um aeroporto. Ninguém sai apagando letras e escrevendo “atrasado” à mão: alguém atualiza a lista de voos e o painel se redesenha a partir dela. Cada linha é um modelo único (origem, destino, horário, situação) preenchido com os dados de um voo, e o painel nunca fica diferente da lista.",
        tecnico:
          "O **React** é uma biblioteca JavaScript de código aberto para construir interfaces a partir de **componentes**: funções que recebem **props** e devolvem **JSX** descrevendo a tela para aqueles dados. Quando o **state** muda, o React chama os componentes de novo, compara a descrição nova com a anterior e atualiza só o que mudou no DOM. É o modelo **declarativo**: você diz **o que** mostrar, não os passos de **como** mexer no DOM. Por isso se usa: a tela vira consequência dos dados (menos erros de sincronia), as peças se reaproveitam, o fluxo é previsível e o ecossistema é enorme. O mesmo modelo chega ao celular com o React Native.",
        limite:
          "O painel não decide de onde vêm os voos, e é aí que a imagem cobre o debate **biblioteca ou framework**: o React cuida da camada de **visão**; busca de dados, rotas, build e renderização no servidor vêm de outras ferramentas ou de frameworks construídos sobre ele. Também não é mágica: se você mutar o state em vez de atualizá-lo pelo setter, o painel não se redesenha (veja L17).",
      },
      {
        tipo: "tabela",
        titulo: "Os recursos centrais",
        colunas: ["Recurso", "O que é", "Por que ajuda"],
        linhas: [
          [
            "Componentes",
            "Funções que recebem props e devolvem a descrição de um pedaço da interface; combinam-se entre si",
            "Reutilização e organização: a tela vira uma árvore de peças pequenas",
          ],
          [
            "JSX",
            "Sintaxe que mistura marcação e JavaScript e vira chamadas de função na compilação (veja L06)",
            "A descrição da tela fica legível e usa JavaScript de verdade, sem uma linguagem de template própria",
          ],
          [
            "Declarativo",
            "Você descreve a tela para cada state e o React calcula como chegar lá",
            "Menos manipulação manual do DOM e menos telas fora de sincronia com os dados",
          ],
          [
            "Virtual DOM",
            "Descrição da interface em objetos leves, comparada com a anterior para aplicar só a diferença (veja L21)",
            "Atualizações sem você rastrear o DOM à mão",
          ],
          [
            "Fluxo unidirecional",
            "Os dados descem por props e as mudanças sobem por callbacks (veja L18)",
            "Cada dado tem um dono e o caminho de uma mudança é fácil de seguir",
          ],
          [
            "Hooks",
            "Funções como `useState` e `useEffect` que dão state, efeitos e lógica reaproveitável aos componentes de função (veja L42)",
            "Lógica compartilhada por custom Hooks, sem classes",
          ],
        ],
        nota: "Recursos mais novos (Server Components, Actions, React Compiler) aparecem em outras perguntas deste guia; confira react.dev para o estado atual.",
      },
      {
        tipo: "fluxo",
        titulo: "Como o React funciona, em passos",
        etapas: [
          "Você escreve componentes: funções que recebem props e devolvem JSX",
          "Na primeira renderização o React chama os componentes e obtém uma descrição da interface (uma árvore de elementos, o Virtual DOM)",
          "O React cria os nós correspondentes no DOM real",
          "Um evento (um clique, uma resposta de rede) chama o setter do state",
          "O React agenda uma nova renderização: chama de novo os componentes afetados, agora com o state novo",
          "Compara a descrição nova com a anterior e aplica no DOM real só as diferenças",
        ],
        nota: "Os detalhes do Virtual DOM estão em L21 e os do JSX em L06.",
      },
      {
        tipo: "codigo",
        titulo: "Um componente com state",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function Contador({ inicio = 0 }) {
  const [valor, setValor] = useState(inicio);

  return (
    <button onClick={() => setValor(valor + 1)}>
      Cliques: {valor}
    </button>
  );
}`,
        nota: "Não há `querySelector` nem `textContent`: o componente só declara o que mostrar para cada valor, e o React atualiza o botão.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Biblioteca, não framework",
        texto:
          "O React é uma **biblioteca**: resolve a camada de visão (componentes, renderização, Hooks) e deixa o resto à sua escolha. Roteamento, busca e cache de dados, build e renderização no servidor vêm de bibliotecas, de uma ferramenta de build ou de um **framework** construído sobre o React, que traz essas peças integradas e opina sobre a estrutura do projeto. Na entrevista, uma boa resposta é “uma biblioteca, normalmente usada dentro de um framework ou junto de outras bibliotecas”. A recomendação oficial de como começar um projeto muda com o tempo; confira react.dev.",
      },
    ],
    armadilhas: [
      "Chamar o React de framework completo e esperar roteamento, busca de dados e state global prontos: essas peças vêm de outras bibliotecas ou de um framework.",
      "Dizer que o Virtual DOM torna o React sempre mais rápido que JavaScript puro: o ganho principal é o modelo declarativo, não velocidade garantida (veja L21).",
      "Confundir React com JSX: o JSX é uma sintaxe opcional e o React funciona sem ela (veja L06).",
      "Misturar manipulação manual do DOM (`document.querySelector`, `innerHTML`) dentro de um componente, brigando com o React pelo controle da tela.",
    ],
    autoteste: [
      {
        pergunta: "Por que se diz que o React é declarativo?",
        resposta:
          "Porque você descreve como a interface deve ficar para um dado state e o React calcula e aplica as mudanças no DOM, em vez de você escrever os passos de cada alteração.",
      },
      {
        pergunta: "O React é uma biblioteca ou um framework? Justifique.",
        resposta:
          "Uma biblioteca: ele cuida da camada de visão (componentes e renderização). Roteamento, busca de dados e build vêm de outras ferramentas ou de frameworks construídos sobre o React.",
      },
    ],
  },
  en: {
    titulo: "What React is",
    pergunta: "What is React?",
    porqueEsteMetodo:
      "React looks hard until the simple idea behind it shows up: the screen is a function of state. An analogy first, the real mechanism next and the point where the picture stops holding answer every variation of the question at once (what it is, why use it, library or framework, which features).",
    resposta30s:
      "**React** is a **declarative JavaScript library** for building interfaces out of reusable **components**: you describe how the screen should look for a given **state** and React takes care of updating the DOM. It is a **library**: it handles the view layer, while routing, data and build tooling come from other tools or from frameworks built on top of it. Its core features are components, **JSX**, the **Virtual DOM**, **one-way data flow** and **Hooks**.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of the departures board at an airport. Nobody goes around erasing letters and writing “delayed” by hand: someone updates the list of flights and the board redraws itself from that list. Each row is a single template (origin, destination, time, status) filled with one flight’s data, and the board never drifts away from the list.",
        tecnico:
          "**React** is an open-source JavaScript library for building interfaces out of **components**: functions that receive **props** and return **JSX** describing the screen for that data. When **state** changes, React calls the components again, compares the new description with the previous one and updates only what changed in the DOM. This is the **declarative** model: you say **what** to show, not the steps of **how** to touch the DOM. That is why people use it: the screen becomes a consequence of the data (fewer sync bugs), pieces are reusable, the data flow is predictable and the ecosystem is huge. The same model also reaches mobile through React Native.",
        limite:
          "The board does not decide where the flights come from, and that is where the picture covers the **library or framework** debate: React handles the **view** layer; data fetching, routing, build tooling and server rendering come from other tools or from frameworks built on top of it. It is not magic either: if you mutate state instead of updating it through the setter, the board does not redraw (see L17).",
      },
      {
        tipo: "tabela",
        titulo: "The core features",
        colunas: ["Feature", "What it is", "Why it helps"],
        linhas: [
          [
            "Components",
            "Functions that receive props and return the description of a piece of the interface; they combine with each other",
            "Reuse and organization: the screen becomes a tree of small pieces",
          ],
          [
            "JSX",
            "Syntax that mixes markup and JavaScript and turns into function calls at compile time (see L06)",
            "The screen description stays readable and uses real JavaScript, with no template language of its own",
          ],
          [
            "Declarative",
            "You describe the screen for each state and React works out how to get there",
            "Less manual DOM manipulation and fewer screens out of sync with the data",
          ],
          [
            "Virtual DOM",
            "A description of the interface in lightweight objects, compared with the previous one so only the difference is applied (see L21)",
            "Updates without you tracking the DOM by hand",
          ],
          [
            "One-way data flow",
            "Data goes down through props and changes go up through callbacks (see L18)",
            "Every piece of data has one owner and the path of a change is easy to follow",
          ],
          [
            "Hooks",
            "Functions such as `useState` and `useEffect` that give function components state, effects and reusable logic (see L42)",
            "Shared logic through custom Hooks, without classes",
          ],
        ],
        nota: "Newer features (Server Components, Actions, React Compiler) appear in other questions of this guide; check react.dev for the current state.",
      },
      {
        tipo: "fluxo",
        titulo: "How React works, step by step",
        etapas: [
          "You write components: functions that receive props and return JSX",
          "On the first render React calls the components and gets a description of the interface (a tree of elements, the Virtual DOM)",
          "React creates the matching nodes in the real DOM",
          "An event (a click, a network response) calls the state setter",
          "React schedules a new render: it calls the affected components again, now with the new state",
          "It compares the new description with the previous one and applies only the differences to the real DOM",
        ],
        nota: "The details of the Virtual DOM are in L21 and those of JSX in L06.",
      },
      {
        tipo: "codigo",
        titulo: "A component with state",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function Counter({ start = 0 }) {
  const [value, setValue] = useState(start);

  return (
    <button onClick={() => setValue(value + 1)}>
      Clicks: {value}
    </button>
  );
}`,
        nota: "There is no `querySelector` or `textContent`: the component only declares what to show for each value, and React updates the button.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A library, not a framework",
        texto:
          "React is a **library**: it solves the view layer (components, rendering, Hooks) and leaves the rest to you. Routing, data fetching and caching, build tooling and server rendering come from libraries, from a build tool or from a **framework** built on top of React, which ships those pieces integrated and has opinions about project structure. In an interview, a good answer is “a library, usually used inside a framework or alongside other libraries”. The official advice on how to start a project changes over time; check react.dev.",
      },
    ],
    armadilhas: [
      "Calling React a full framework and expecting routing, data fetching and global state out of the box: those pieces come from other libraries or from a framework.",
      "Saying the Virtual DOM always makes React faster than plain JavaScript: the main gain is the declarative model, not guaranteed speed (see L21).",
      "Confusing React with JSX: JSX is optional syntax and React works without it (see L06).",
      "Mixing manual DOM manipulation (`document.querySelector`, `innerHTML`) into a component, fighting React for control of the screen.",
    ],
    autoteste: [
      {
        pergunta: "Why is React called declarative?",
        resposta:
          "Because you describe how the interface should look for a given state and React works out and applies the DOM changes, instead of you writing the steps of every change.",
      },
      {
        pergunta: "Is React a library or a framework? Justify your answer.",
        resposta:
          "A library: it handles the view layer (components and rendering). Routing, data fetching and build tooling come from other tools or from frameworks built on top of React.",
      },
    ],
  },
};
