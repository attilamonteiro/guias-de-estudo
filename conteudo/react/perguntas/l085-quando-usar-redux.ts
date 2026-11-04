import type { Pergunta } from "../../tipos";

// L85 · Quando usar Redux
export const l085: Pergunta = {
  numero: 85,
  modulo: "linkedin-estado",
  metodo: "whys",
  pt: {
    titulo: "Quando usar Redux",
    pergunta: "Quando você usaria o Redux?",
    porqueEsteMetodo:
      "O Redux se justifica pelos problemas que resolve, e só quando eles existem. Encadear os “por quês” mostra a razão de cada característica dele e deixa claro quando dispensá-lo.",
    resposta30s:
      "O **Redux** é um contêiner de estado previsível: a aplicação tem uma **store**, as mudanças são descritas por **actions** e calculadas por **reducers** puros. Vale quando o estado é **compartilhado por muitas partes**, muda com frequência e de formas complexas, e a equipe precisa de **previsibilidade, rastreabilidade (devtools, time travel) e lógica de atualização centralizada e testável**. Em apps pequenos, com estado local ou de servidor, não compensa; hoje se escreve Redux com o **Redux Toolkit**.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o Redux existe?",
            resposta:
              "Porque, em aplicações grandes, o estado é lido e alterado por muitas partes, e fica difícil saber **quem mudou o quê e quando**. O Redux concentra o estado numa **store** e restringe as mudanças a um caminho único: um evento é descrito por uma **action**, e um **reducer** calcula o estado novo.",
          },
          {
            pergunta: "Por que a previsibilidade importa?",
            resposta:
              "Porque o reducer é uma função pura: dados o estado anterior e a action, devolve sempre o mesmo estado novo. A mesma sequência de ações reproduz o mesmo estado, o que facilita reproduzir um bug, escrever testes sem interface e raciocinar sobre o comportamento.",
          },
          {
            pergunta: "Por que a rastreabilidade (devtools, time travel) é um benefício?",
            resposta:
              "Porque toda mudança passa por uma action que pode ser registrada. O Redux DevTools lista as ações, mostra o estado antes e depois e permite voltar a um ponto anterior. Em sistemas em que descobrir “como chegamos aqui” é caro, isso economiza tempo.",
          },
          {
            pergunta: "Por que centralizar a lógica de atualização?",
            resposta:
              "Porque as regras de negócio ficam em reducers e middleware, num lugar testável, em vez de espalhadas por componentes. Equipes grandes seguem o mesmo padrão, e os efeitos assíncronos têm um ponto de entrada (thunks, listeners, RTK Query).",
          },
          {
            pergunta: "Por que, mesmo assim, muitas aplicações não precisam dele?",
            resposta:
              "Porque o custo é cerimônia (conceitos, arquivos, indireção), e ela só se paga quando a complexidade do estado é real. Estado local fica em `useState`; dado de servidor é cache e é mais bem atendido por uma ferramenta de dados; estado que muda pouco cabe no Context. E, quando o Redux se justifica, a forma recomendada de escrevê-lo é o **Redux Toolkit**, que reduz o boilerplate e já traz boas práticas.",
          },
        ],
        causaRaiz:
          "O Redux compra **previsibilidade e rastreabilidade** ao custo de **cerimônia**. Vale quando o estado é compartilhado e complexo o bastante para a falta dessas qualidades doer; antes disso, é custo sem retorno.",
      },
      {
        tipo: "fluxo",
        titulo: "O ciclo de uma atualização no Redux",
        etapas: [
          "A interface chama `dispatch(action)`, uma descrição do que aconteceu (por exemplo, “item adicionado”)",
          "O middleware, se houver, observa a action: é onde entram chamadas assíncronas, logs e outros efeitos",
          "O reducer, uma função pura, recebe o estado anterior e a action e devolve o estado novo (no Redux Toolkit, o Immer permite escrever como se mutasse)",
          "A store guarda o estado novo e avisa os assinantes",
          "Os componentes cujo `useSelector` devolve um valor diferente re-renderizam; os demais, não",
        ],
        nota: "A leitura é por seletores e a escrita só por actions: esse caminho único é o que torna o fluxo rastreável.",
      },
      {
        tipo: "tabela",
        titulo: "Quando usar e quando evitar",
        colunas: ["Use Redux quando…", "Evite quando…"],
        linhas: [
          [
            "O estado é compartilhado por muitas partes distantes da aplicação",
            "A aplicação é pequena ou o estado é local a poucos componentes",
          ],
          [
            "As atualizações são frequentes ou complexas e vêm de vários lugares",
            "O estado muda pouco, e Context ou props resolvem",
          ],
          [
            "A equipe precisa de padrão, rastreabilidade e lógica de atualização testável",
            "O dado vem do servidor e precisa de cache e revalidação: use uma ferramenta de dados",
          ],
          [
            "Depurar o histórico de mudanças (devtools, time travel) tem valor real",
            "Você só quer evitar prop drilling: composição ou Context bastam",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "“Que desafios você enfrentou com Redux?”",
        texto:
          "É uma pergunta de experiência: responda só com o que você viveu e explique o seu raciocínio. Desafios comuns, com a resposta usual: **boilerplate** (adotar o Redux Toolkit), **estado demais na store** (manter o estado local no componente), **dado de servidor na store** (migrar para RTK Query ou outra ferramenta de dados), **dados derivados** (calcular com seletores, memoizados quando caro), **re-renders** (seletores específicos) e **assíncrono** (thunks ou listeners).",
      },
    ],
    armadilhas: [
      "Adotar Redux por reflexo, em apps pequenos ou para estado de formulário e de interface local.",
      "Guardar na store dados do servidor e reimplementar cache, carregamento e revalidação à mão.",
      "Mutar o estado dentro de um reducer escrito à mão, fora do Redux Toolkit: quebra a previsibilidade e as devtools (no Toolkit, o Immer cuida disso).",
      "Escrever Redux “antigo”, com constantes, switch e arquivos para tudo, em vez de `configureStore` e `createSlice`.",
    ],
    autoteste: [
      {
        pergunta: "O que é o Redux e que problemas ele resolve?",
        resposta:
          "É um contêiner de estado previsível: uma store, actions que descrevem eventos e reducers puros que calculam o novo estado. Resolve a falta de previsibilidade, de rastreabilidade e de lógica centralizada quando muitos pontos leem e alteram o mesmo estado.",
      },
      {
        pergunta: "Em que casos você não usaria Redux, e o que usaria no lugar?",
        resposta:
          "Em apps pequenos ou com estado local, `useState` ou `useReducer`; para dados que mudam pouco, o Context; para dado de servidor, uma ferramenta de dados como TanStack Query ou RTK Query.",
      },
    ],
  },
  en: {
    titulo: "When to use Redux",
    pergunta: "When would you use Redux?",
    porqueEsteMetodo:
      "Redux is justified by the problems it solves, and only when they exist. Chaining the whys shows the reason behind each of its traits and makes clear when to skip it.",
    resposta30s:
      "**Redux** is a predictable state container: the application has one **store**, changes are described by **actions** and computed by pure **reducers**. It pays off when state is **shared by many parts**, changes often and in complex ways, and the team needs **predictability, traceability (devtools, time travel) and centralized, testable update logic**. In small apps, with local or server state, it does not pay off; today Redux is written with **Redux Toolkit**.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does Redux exist?",
            resposta:
              "Because in large applications the state is read and changed by many parts, and it becomes hard to know **who changed what and when**. Redux concentrates the state in a **store** and restricts changes to a single path: an event is described by an **action**, and a **reducer** computes the new state.",
          },
          {
            pergunta: "Why does predictability matter?",
            resposta:
              "Because the reducer is a pure function: given the previous state and the action, it always returns the same new state. The same sequence of actions reproduces the same state, which makes it easier to reproduce a bug, write tests without a UI and reason about behavior.",
          },
          {
            pergunta: "Why is traceability (devtools, time travel) a benefit?",
            resposta:
              "Because every change goes through an action that can be recorded. Redux DevTools lists the actions, shows the state before and after and lets you go back to an earlier point. In systems where finding out “how did we get here” is expensive, that saves time.",
          },
          {
            pergunta: "Why centralize the update logic?",
            resposta:
              "Because business rules live in reducers and middleware, in a testable place, instead of scattered across components. Large teams follow the same pattern, and async effects have an entry point (thunks, listeners, RTK Query).",
          },
          {
            pergunta: "Why, even so, do many applications not need it?",
            resposta:
              "Because the cost is ceremony (concepts, files, indirection), and it only pays off when the state’s complexity is real. Local state stays in `useState`; server data is a cache and is better served by a data tool; state that rarely changes fits in Context. And when Redux is justified, the recommended way to write it is **Redux Toolkit**, which cuts the boilerplate and brings good practices built in.",
          },
        ],
        causaRaiz:
          "Redux buys **predictability and traceability** at the cost of **ceremony**. It pays off when the state is shared and complex enough for the lack of those qualities to hurt; before that, it is cost with no return.",
      },
      {
        tipo: "fluxo",
        titulo: "The cycle of a Redux update",
        etapas: [
          "The UI calls `dispatch(action)`, a description of what happened (for example, “item added”)",
          "Middleware, if any, observes the action: this is where async calls, logging and other effects go",
          "The reducer, a pure function, receives the previous state and the action and returns the new state (in Redux Toolkit, Immer lets you write as if mutating)",
          "The store keeps the new state and notifies subscribers",
          "Components whose `useSelector` returns a different value re-render; the others do not",
        ],
        nota: "Reads go through selectors and writes only through actions: that single path is what makes the flow traceable.",
      },
      {
        tipo: "tabela",
        titulo: "When to use it and when to avoid it",
        colunas: ["Use Redux when…", "Avoid it when…"],
        linhas: [
          [
            "State is shared by many distant parts of the application",
            "The application is small or the state is local to a few components",
          ],
          [
            "Updates are frequent or complex and come from several places",
            "The state rarely changes, and Context or props are enough",
          ],
          [
            "The team needs a standard, traceability and testable update logic",
            "The data comes from the server and needs caching and revalidation: use a data tool",
          ],
          [
            "Debugging the history of changes (devtools, time travel) has real value",
            "You only want to avoid prop drilling: composition or Context is enough",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "“What challenges have you faced with Redux?”",
        texto:
          "This is an experience question: answer only with what you actually lived through and explain your reasoning. Common challenges, with the usual answer: **boilerplate** (adopt Redux Toolkit), **too much state in the store** (keep local state in the component), **server data in the store** (move to RTK Query or another data tool), **derived data** (compute with selectors, memoized when expensive), **re-renders** (specific selectors) and **async work** (thunks or listeners).",
      },
    ],
    armadilhas: [
      "Adopting Redux by reflex, in small apps or for form and local UI state.",
      "Storing server data in the store and reimplementing caching, loading and revalidation by hand.",
      "Mutating state inside a hand-written reducer, outside Redux Toolkit: it breaks predictability and devtools (in Toolkit, Immer handles this).",
      "Writing “old” Redux, with constants, switch statements and files for everything, instead of `configureStore` and `createSlice`.",
    ],
    autoteste: [
      {
        pergunta: "What is Redux and what problems does it solve?",
        resposta:
          "It is a predictable state container: one store, actions that describe events and pure reducers that compute the new state. It solves the lack of predictability, traceability and centralized logic when many places read and change the same state.",
      },
      {
        pergunta: "In which cases would you not use Redux, and what would you use instead?",
        resposta:
          "In small apps or with local state, `useState` or `useReducer`; for data that rarely changes, Context; for server data, a data tool such as TanStack Query or RTK Query.",
      },
    ],
  },
};
