import type { Pergunta } from "../../tipos";

// G41 · Lista de tarefas em React
export const g041: Pergunta = {
  numero: 341,
  modulo: "glassdoor-exercicios",
  metodo: "design",
  pt: {
    titulo: "Lista de tarefas em React",
    pergunta: "Construa uma lista de tarefas funcional em React (adicionar, editar e excluir tarefas).",
    porqueEsteMetodo:
      "É o exercício mais comum de entrevista de React, e as decisões que o separam de uma versão frágil são de projeto: o modelo de dados, onde o estado mora e como a lista muda. Um roteiro as coloca na ordem certa.",
    resposta30s:
      "Modele cada tarefa como `{ id, texto, concluida }`, com um **`id` estável** gerado uma vez, e deixe o estado da lista no componente que a desenha. Adicionar, editar e excluir são **operações imutáveis** (`[...lista, nova]`, `map`, `filter`), de preferência num `useReducer` quando as ações crescem; cada linha usa **`key={tarefa.id}`**, e nunca o índice. O formulário é **controlado**, recusa texto vazio e todo campo tem rótulo.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Adicionar, marcar como concluída, editar e excluir; recusar texto vazio; manter a lista ao recarregar (opcional); funcionar por teclado e leitor de tela. Fica de fora num primeiro passo: arrastar para reordenar, filtros e sincronização com servidor.",
          },
          {
            titulo: "2. Modelo de dados",
            texto:
              "`{ id, texto, concluida }`. O `id` nasce **uma vez**, na criação (`crypto.randomUUID()` em contexto seguro, ou um contador), e nunca muda: o índice e o texto não servem como identidade.",
          },
          {
            titulo: "3. Onde mora o estado",
            texto:
              "No menor ancestral comum de quem lê e de quem escreve a lista: o componente da lista. O texto do campo “nova tarefa” fica no formulário, e o que é efêmero de uma linha (estou editando? qual o rascunho?) fica no próprio item. Levante o estado só até onde alguém de fora precisa dele.",
          },
          {
            titulo: "4. Operações imutáveis",
            texto:
              "Adicionar é `[...lista, nova]`; editar e alternar são `map` que devolve um objeto novo só para o item alterado; excluir é `filter`. Nada de `push`, `splice` ou `tarefa.concluida = true`: o React compara referências, e mutar deixa a tela desatualizada. Quando as ações crescem, concentre-as num `useReducer`, uma função pura e fácil de testar (veja o código).",
          },
          {
            titulo: "5. Lista e keys",
            texto:
              "Cada linha recebe `key={tarefa.id}`. A key é a identidade que o React usa para casar as linhas entre renderizações, preservar o estado de cada uma (foco, modo de edição) e mover em vez de recriar.",
          },
          {
            titulo: "6. Edição inline e validação",
            texto:
              "O botão “Editar” troca o texto por um `<input>` com foco; Enter ou perder o foco salva, Esc cancela. Salvar vazio descarta a alteração, e tentar adicionar vazio mostra uma mensagem ligada ao campo (`aria-describedby`). O campo de nova tarefa é **controlado** (`value` e `onChange`) e o formulário usa `onSubmit` com `preventDefault`.",
          },
          {
            titulo: "7. Acessibilidade, persistência e testes",
            texto:
              "Todo campo com `<label>`, botões com nome claro (“Excluir tarefa: comprar pão”) e foco devolvido ao campo depois de adicionar ou excluir. Para persistir, leia o `localStorage` na inicialização do estado (função inicial do `useReducer` ou do `useState`), grave num `useEffect` que depende de `tarefas` e tolere JSON inválido ou `localStorage` indisponível (`try/catch`). Teste o comportamento com Testing Library, por papéis e rótulos (`getByRole`): digitar, adicionar, editar, marcar e excluir.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O reducer, puro e imutável",
        legenda: "TSX",
        codigo: [
          "type Tarefa = { id: string; texto: string; concluida: boolean };",
          "type Acao =",
          '  | { tipo: "adicionar"; id: string; texto: string }',
          '  | { tipo: "editar"; id: string; texto: string }',
          '  | { tipo: "alternar"; id: string }',
          '  | { tipo: "excluir"; id: string };',
          "",
          "export function tarefasReducer(estado: Tarefa[], acao: Acao): Tarefa[] {",
          "  switch (acao.tipo) {",
          '    case "adicionar":',
          "      return [...estado, { id: acao.id, texto: acao.texto, concluida: false }];",
          '    case "editar":',
          "      return estado.map((t) => (t.id === acao.id ? { ...t, texto: acao.texto } : t));",
          '    case "alternar":',
          "      return estado.map((t) => (t.id === acao.id ? { ...t, concluida: !t.concluida } : t));",
          '    case "excluir":',
          "      return estado.filter((t) => t.id !== acao.id);",
          "  }",
          "}",
        ].join("\n"),
        nota: "O `id` vem na ação porque o reducer precisa ser puro: sortear um id dentro dele daria resultados diferentes a cada chamada (o StrictMode chama duas vezes). `crypto.randomUUID()` exige contexto seguro (HTTPS ou localhost).",
      },
      {
        tipo: "codigo",
        titulo: "O componente: formulário controlado e lista com key estável",
        legenda: "TSX",
        codigo: [
          "export function Tarefas() {",
          "  const [tarefas, dispatch] = useReducer(tarefasReducer, []);",
          '  const [texto, setTexto] = useState("");',
          "",
          "  function adicionar(e: FormEvent) {",
          "    e.preventDefault();",
          "    const limpo = texto.trim();",
          "    if (!limpo) return; // recusa entrada vazia",
          '    dispatch({ tipo: "adicionar", id: crypto.randomUUID(), texto: limpo });',
          '    setTexto("");',
          "  }",
          "",
          "  return (",
          "    <>",
          "      <form onSubmit={adicionar}>",
          "        <label>Nova tarefa <input value={texto} onChange={(e) => setTexto(e.target.value)} /></label>",
          '        <button type="submit">Adicionar</button>',
          "      </form>",
          "      <ul>{tarefas.map((t) => <Item key={t.id} tarefa={t} dispatch={dispatch} />)}</ul>",
          "    </>",
          "  );",
          "}",
        ].join("\n"),
        nota: "Imports de `react` (`useReducer`, `useState`, `FormEvent`) omitidos. `Item` mostra o texto com um checkbox e os botões Editar e Excluir; na edição inline ele guarda `editando` e `rascunho` no próprio estado local.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra: identidade estável e dados imutáveis",
        texto:
          "Cada tarefa tem um **`id` estável**, e a lista só muda por **cópias**. Com isso, a `key` é o `id`, o React casa as linhas certas e comparações por referência (`memo`, `useMemo`) funcionam. Use `useReducer` quando o mesmo estado recebe várias ações ou as regras se combinam (aqui, quatro ações); com uma ou duas, `useState` basta. O id nasce no manipulador de evento, não no reducer.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A armadilha do índice como key",
        texto:
          "Com `key={indice}`, a identidade da linha é a posição. Abra a edição da tarefa 2 e exclua a tarefa 1: as tarefas 2 e 3 sobem uma posição, e o estado de edição (e o rascunho), preso à posição 1, passa a aparecer na tarefa 3. O mesmo vale para o foco e para um checkbox não controlado. Com `key={tarefa.id}`, o estado acompanha a tarefa. O índice só serve para uma lista estática, que nunca é reordenada, filtrada nem editada. `Math.random()` como key é pior ainda: recria todas as linhas a cada render.",
      },
    ],
    armadilhas: [
      "Usar o índice (ou `Math.random()`) como `key`: o estado das linhas, como edição, foco e checkbox, vai parar na tarefa errada depois de excluir ou reordenar.",
      "Mutar o estado (`lista.push(...)`, `tarefa.concluida = true` e `setTarefas(lista)`): a referência é a mesma, o React não vê mudança e a tela fica desatualizada.",
      "Gerar o id durante a renderização ou dentro do reducer, ou usar o texto como id: ids que mudam a cada render ou repetidos para tarefas iguais. Gere no manipulador de evento.",
      "Ler o `localStorage` no corpo do componente, a cada render, ou sem `try/catch`: fica lento, e quebra onde ele não existe (renderização no servidor) ou está bloqueado. Use a inicialização preguiçosa do estado e grave num efeito.",
    ],
    autoteste: [
      {
        pergunta: "Por que `key={tarefa.id}` e não `key={indice}` numa lista que permite excluir?",
        resposta:
          "Porque o React usa a key como identidade da linha: com o índice, excluir um item faz as seguintes ocuparem a posição da anterior e herdarem o estado dela (edição, foco, checkbox). Com um id estável, o estado acompanha a tarefa.",
      },
      {
        pergunta: "Quando migrar de `useState` para `useReducer`, e por que o reducer não deve gerar o id?",
        resposta:
          "Quando o mesmo estado recebe várias ações ou regras que se combinam; o reducer concentra as transições numa função pura e testável. Ele não gera o id porque precisa ser puro: o React pode chamá-lo mais de uma vez (o StrictMode faz isso de propósito), e um sorteio daria resultados diferentes. O id vai na ação.",
      },
    ],
  },
  en: {
    titulo: "To-do list in React",
    pergunta: "Build a functional to-do list in React (add, edit and delete tasks).",
    porqueEsteMetodo:
      "This is the most common React interview exercise, and the decisions that separate it from a brittle version are design decisions: the data model, where state lives and how the list changes. A script puts them in the right order.",
    resposta30s:
      "Model each task as `{ id, text, done }`, with a **stable `id`** generated once, and keep the list state in the component that renders it. Adding, editing and deleting are **immutable operations** (`[...list, item]`, `map`, `filter`), preferably in a `useReducer` once the actions grow; each row uses **`key={task.id}`**, never the index. The form is **controlled**, rejects empty text and every field has a label.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "Add, mark as done, edit and delete; reject empty text; keep the list across reloads (optional); work with keyboard and screen reader. Left out of a first pass: drag to reorder, filters and server sync.",
          },
          {
            titulo: "2. Data model",
            texto:
              "`{ id, text, done }`. The `id` is born **once**, at creation (`crypto.randomUUID()` in a secure context, or a counter), and never changes: the index and the text do not work as identity.",
          },
          {
            titulo: "3. Where state lives",
            texto:
              "In the lowest common ancestor of whoever reads and whoever writes the list: the list component. The “new task” field text stays in the form, and whatever is ephemeral to one row (am I editing? what is the draft?) stays in the item itself. Lift state only as far as someone outside needs it.",
          },
          {
            titulo: "4. Immutable operations",
            texto:
              "Adding is `[...list, item]`; editing and toggling are a `map` that returns a new object only for the changed item; deleting is a `filter`. No `push`, `splice` or `task.done = true`: React compares references, and mutating leaves the screen stale. When the actions grow, gather them in a `useReducer`, a pure function that is easy to test (see the code).",
          },
          {
            titulo: "5. List and keys",
            texto:
              "Each row gets `key={task.id}`. The key is the identity React uses to match rows between renders, preserve each row’s state (focus, edit mode) and move rows instead of recreating them.",
          },
          {
            titulo: "6. Inline editing and validation",
            texto:
              "The “Edit” button swaps the text for a focused `<input>`; Enter or losing focus saves, Esc cancels. Saving empty discards the change, and trying to add empty shows a message tied to the field (`aria-describedby`). The new-task field is **controlled** (`value` and `onChange`) and the form uses `onSubmit` with `preventDefault`.",
          },
          {
            titulo: "7. Accessibility, persistence and tests",
            texto:
              "Every field gets a `<label>`, buttons get clear names (“Delete task: buy bread”) and focus returns to the field after adding or deleting. To persist, read `localStorage` when initializing state (the initializer of `useReducer` or `useState`), write in a `useEffect` that depends on `tasks` and tolerate invalid JSON or unavailable `localStorage` (`try/catch`). Test behavior with Testing Library, by roles and labels (`getByRole`): type, add, edit, toggle and delete.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The reducer, pure and immutable",
        legenda: "TSX",
        codigo: [
          "type Task = { id: string; text: string; done: boolean };",
          "type Action =",
          '  | { type: "add"; id: string; text: string }',
          '  | { type: "edit"; id: string; text: string }',
          '  | { type: "toggle"; id: string }',
          '  | { type: "delete"; id: string };',
          "",
          "export function tasksReducer(state: Task[], action: Action): Task[] {",
          "  switch (action.type) {",
          '    case "add":',
          "      return [...state, { id: action.id, text: action.text, done: false }];",
          '    case "edit":',
          "      return state.map((t) => (t.id === action.id ? { ...t, text: action.text } : t));",
          '    case "toggle":',
          "      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));",
          '    case "delete":',
          "      return state.filter((t) => t.id !== action.id);",
          "  }",
          "}",
        ].join("\n"),
        nota: "The `id` comes in the action because the reducer must be pure: drawing an id inside it would give different results on each call (StrictMode calls it twice). `crypto.randomUUID()` requires a secure context (HTTPS or localhost).",
      },
      {
        tipo: "codigo",
        titulo: "The component: controlled form and list with stable keys",
        legenda: "TSX",
        codigo: [
          "export function Tasks() {",
          "  const [tasks, dispatch] = useReducer(tasksReducer, []);",
          '  const [text, setText] = useState("");',
          "",
          "  function add(e: FormEvent) {",
          "    e.preventDefault();",
          "    const clean = text.trim();",
          "    if (!clean) return; // reject empty input",
          '    dispatch({ type: "add", id: crypto.randomUUID(), text: clean });',
          '    setText("");',
          "  }",
          "",
          "  return (",
          "    <>",
          "      <form onSubmit={add}>",
          "        <label>New task <input value={text} onChange={(e) => setText(e.target.value)} /></label>",
          '        <button type="submit">Add</button>',
          "      </form>",
          "      <ul>{tasks.map((t) => <Item key={t.id} task={t} dispatch={dispatch} />)}</ul>",
          "    </>",
          "  );",
          "}",
        ].join("\n"),
        nota: "`react` imports (`useReducer`, `useState`, `FormEvent`) omitted. `Item` shows the text with a checkbox and the Edit and Delete buttons; for inline editing it keeps `editing` and `draft` in its own local state.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule: stable identity and immutable data",
        texto:
          "Each task has a **stable `id`**, and the list only changes through **copies**. With that, the `key` is the `id`, React matches the right rows and reference comparisons (`memo`, `useMemo`) work. Use `useReducer` when the same state receives several actions or the rules combine (here, four actions); with one or two, `useState` is enough. The id is born in the event handler, not in the reducer.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The index-as-key trap",
        texto:
          "With `key={index}`, a row’s identity is its position. Open task 2 for editing and delete task 1: tasks 2 and 3 move up one position, and the edit state (and the draft), stuck to position 1, now shows up on task 3. The same goes for focus and for an uncontrolled checkbox. With `key={task.id}`, the state follows the task. The index only works for a static list that is never reordered, filtered or edited. `Math.random()` as a key is even worse: it recreates every row on every render.",
      },
    ],
    armadilhas: [
      "Using the index (or `Math.random()`) as `key`: row state such as editing, focus and checkboxes ends up on the wrong task after a delete or reorder.",
      "Mutating state (`list.push(...)`, `task.done = true` and `setTasks(list)`): the reference is the same, React sees no change and the screen goes stale.",
      "Generating the id during rendering or inside the reducer, or using the text as id: ids that change on every render, or repeat for identical tasks. Generate it in the event handler.",
      "Reading `localStorage` in the component body, on every render, or without `try/catch`: it is slow, and breaks where it does not exist (server rendering) or is blocked. Use lazy state initialization and write in an effect.",
    ],
    autoteste: [
      {
        pergunta: "Why `key={task.id}` and not `key={index}` in a list that allows deletion?",
        resposta:
          "Because React uses the key as the row’s identity: with the index, deleting an item makes the following ones take the previous position and inherit its state (editing, focus, checkbox). With a stable id, the state follows the task.",
      },
      {
        pergunta: "When should you move from `useState` to `useReducer`, and why must the reducer not generate the id?",
        resposta:
          "When the same state receives several actions or rules that combine; the reducer gathers the transitions in a pure, testable function. It does not generate the id because it must be pure: React may call it more than once (StrictMode does so on purpose), and a random draw would give different results. The id goes in the action.",
      },
    ],
  },
};
