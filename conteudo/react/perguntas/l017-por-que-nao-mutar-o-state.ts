import type { Pergunta } from "../../tipos";

// L17 · Por que não mutar o state
export const l017: Pergunta = {
  numero: 17,
  modulo: "linkedin-fundamentos",
  metodo: "whys",
  pt: {
    titulo: "Por que não mutar o state",
    pergunta: "Por que o state não deve ser mutado diretamente?",
    porqueEsteMetodo:
      "“Não mute o state” soa como regra de estilo até você seguir a cadeia de causas: o que o React compara, o que depende dessa comparação e o que quebra quando a referência não muda. A sequência de “por quês” leva à causa-raiz.",
    resposta30s:
      "O React decide se algo mudou **comparando referências** com `Object.is`. Se você muta um objeto ou array no lugar, a referência é a mesma: o setter não vê mudança, a tela não atualiza e `memo`, `useMemo` e as dependências dos Hooks também não percebem. Por isso o state é **imutável**: você cria uma **cópia nova** (spread, `map`, `filter` ou Immer) e a passa ao setter, o que também dá previsibilidade e histórico.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que mutar um objeto no lugar não atualiza a tela?",
            resposta:
              "Porque o setter compara o valor novo com o atual por `Object.is`. Se for o mesmo objeto (a mesma referência), o React entende “nada mudou” e pula a renderização: você alterou o conteúdo da caixa, mas entregou a mesma caixa. Se outra coisa fizer o componente renderizar, a tela mostra o dado mutado, e por isso o bug parece intermitente.",
          },
          {
            pergunta: "Por que o React compara referências em vez de comparar o conteúdo?",
            resposta:
              "Porque comparar o conteúdo a fundo seria caro e imprevisível em estruturas grandes, e comparar referências é instantâneo. O contrato é: se algo mudou, entregue um objeto novo; se for o mesmo objeto, nada mudou.",
          },
          {
            pergunta: "Por que a memoização e as dependências dos Hooks dependem disso também?",
            resposta:
              "Porque `React.memo`, `useMemo`, `useCallback` e os arrays de dependências de `useEffect` comparam referências, item a item. Um objeto mutado no lugar mantém a referência: o filho memoizado não renderiza com o dado novo, o `useMemo` devolve o cálculo antigo e o efeito não roda de novo. Ferramentas de otimização, como o React Compiler, partem da mesma premissa. O erro aparece longe de onde a mutação foi feita.",
          },
          {
            pergunta: "Por que isso importa para renderizações repetidas, interrompidas ou concorrentes?",
            resposta:
              "Porque o React pode chamar sua função de renderização mais de uma vez (o Strict Mode faz isso em desenvolvimento) e pode interromper e descartar uma renderização. Se o state fosse mutado durante ou entre elas, versões diferentes da tela leriam o mesmo objeto alterado e veriam dados incoerentes. Snapshots imutáveis permitem que cada renderização veja um estado consistente.",
          },
          {
            pergunta: "Por que copiar compensa, em vez de ser um custo à toa?",
            resposta:
              "A cópia é rasa: só o caminho alterado ganha um objeto novo, e o resto continua compartilhado. Em troca você ganha referências que dizem “mudou” de verdade, versões anteriores intactas (desfazer e refazer, depuração com histórico) e previsibilidade: quem leu o objeto antes não o vê mudar sozinho.",
          },
        ],
        causaRaiz:
          "O React só sabe que algo mudou se a **referência** mudar. Mutar no lugar esconde a mudança dele; copiar a revela. Imutabilidade é o contrato entre o seu código e o React para **detectar, otimizar e repetir** renderizações com segurança.",
      },
      {
        tipo: "tabela",
        titulo: "Mutar contra copiar",
        colunas: ["Quer fazer", "Não use (muta)", "Use (cópia nova)"],
        linhas: [
          ["Adicionar a um array", "`lista.push(x)`", "`[...lista, x]`"],
          ["Remover um item", "`lista.splice(i, 1)`", "`lista.filter((_, j) => j !== i)`"],
          ["Trocar um item", "`lista[i] = x`", "`lista.map((e, j) => (j === i ? x : e))`"],
          ["Ordenar ou inverter", "`lista.sort()`, `lista.reverse()`", "`[...lista].sort()`"],
          ["Alterar um campo", '`obj.nome = "Ana"`', '`{ ...obj, nome: "Ana" }`'],
          [
            "Alterar um campo aninhado",
            '`obj.endereco.cidade = "Rio"`',
            '`{ ...obj, endereco: { ...obj.endereco, cidade: "Rio" } }`',
          ],
        ],
        nota: "O spread faz cópia rasa: copie cada nível do caminho que muda. Para estruturas muito aninhadas, o Immer (`produce` ou `useImmer`) permite escrever como se fosse mutação, num rascunho, e entrega uma cópia imutável.",
      },
      {
        tipo: "codigo",
        titulo: "Errado e certo, com a forma funcional",
        legenda: "JSX",
        codigo: `// Dentro do componente, com: const [tarefas, setTarefas] = useState([...]);

// Errado: a mesma referência volta ao setter, e o React vê "nada mudou"
function marcarErrado(id) {
  const tarefa = tarefas.find((t) => t.id === id);
  tarefa.feita = true;
  setTarefas(tarefas);
}

// Certo: cópia nova do array e do item alterado
function marcar(id) {
  setTarefas((atual) => atual.map((t) => (t.id === id ? { ...t, feita: true } : t)));
}

const adicionar = (t) => setTarefas((atual) => [...atual, t]);
const remover = (id) => setTarefas((atual) => atual.filter((t) => t.id !== id));`,
        nota: "A forma funcional (`atual => ...`) recebe sempre o valor mais recente do state, o que evita perder atualizações em sequência.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Parecer funcionar não prova nada",
        texto:
          "Mutar e depois chamar o setter às vezes “funciona”, porque outra atualização faz o componente renderizar e a tela mostra o dado mutado. O bug fica intermitente e some nos testes. Outros erros comuns: `sort()` e `reverse()` mutam o array original, e copiar só o nível de cima de um objeto aninhado deixa os níveis internos compartilhados. Em caso de dúvida, trate todo state e toda prop como congelados.",
      },
    ],
    armadilhas: [
      "Fazer `lista.push(x)` seguido de `setLista(lista)`: é a mesma referência, e o React não atualiza (ou atualiza por acaso).",
      "Usar `sort()` ou `reverse()` direto no state: ambos mutam o array original; copie antes.",
      "Copiar só o nível de cima de um objeto aninhado: os níveis internos continuam compartilhados e a mutação volta pela porta dos fundos.",
      "Concluir que “funcionou” porque a tela mudou uma vez: o bug pode ficar intermitente e passar pelos testes.",
    ],
    autoteste: [
      {
        pergunta: "O que `Object.is` tem a ver com `useState`?",
        resposta:
          "O setter compara o valor novo com o atual por `Object.is`. Se forem o mesmo (a mesma referência), o React pula a renderização; por isso é preciso entregar um objeto ou array novo.",
      },
      {
        pergunta: "Como atualizar um item de uma lista no state sem mutar?",
        resposta:
          "Com `map`: `setLista((l) => l.map((i) => (i.id === id ? { ...i, campo: novo } : i)))`. O array e o item alterado ganham referências novas, e o resto é compartilhado.",
      },
    ],
  },
  en: {
    titulo: "Why not mutate state",
    pergunta: "Why should state not be mutated directly?",
    porqueEsteMetodo:
      "“Don’t mutate state” sounds like a style rule until you follow the chain of causes: what React compares, what depends on that comparison and what breaks when the reference does not change. The sequence of whys leads to the root cause.",
    resposta30s:
      "React decides whether something changed by **comparing references** with `Object.is`. If you mutate an object or array in place, the reference stays the same: the setter sees no change, the screen does not update, and `memo`, `useMemo` and Hook dependencies do not notice either. That is why state is **immutable**: you create a **new copy** (spread, `map`, `filter` or Immer) and pass it to the setter, which also gives predictability and history.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why doesn’t mutating an object in place update the screen?",
            resposta:
              "Because the setter compares the new value with the current one using `Object.is`. If it is the same object (the same reference), React concludes “nothing changed” and skips the render: you changed what is inside the box but handed over the same box. If something else makes the component render, the screen shows the mutated data, which is why the bug looks intermittent.",
          },
          {
            pergunta: "Why does React compare references instead of comparing content?",
            resposta:
              "Because deeply comparing content would be expensive and unpredictable on large structures, while comparing references is instant. The contract is: if something changed, hand over a new object; if it is the same object, nothing changed.",
          },
          {
            pergunta: "Why do memoization and Hook dependencies depend on this too?",
            resposta:
              "Because `React.memo`, `useMemo`, `useCallback` and the dependency arrays of `useEffect` compare references, item by item. An object mutated in place keeps its reference: the memoized child does not render with the new data, `useMemo` returns the old calculation and the effect does not run again. Optimization tools, such as React Compiler, start from the same premise. The error shows up far from where the mutation happened.",
          },
          {
            pergunta: "Why does this matter for repeated, interrupted or concurrent renders?",
            resposta:
              "Because React may call your render function more than once (Strict Mode does so in development) and may interrupt and discard a render. If state were mutated during or between them, different versions of the screen would read the same altered object and see inconsistent data. Immutable snapshots let each render see a consistent state.",
          },
          {
            pergunta: "Why is copying worth it, rather than a pointless cost?",
            resposta:
              "The copy is shallow: only the changed path gets a new object, and the rest stays shared. In return you get references that truly say “changed”, intact earlier versions (undo and redo, debugging with history) and predictability: whoever read the object before does not see it change on its own.",
          },
        ],
        causaRaiz:
          "React only knows something changed if the **reference** changes. Mutating in place hides the change from it; copying reveals it. Immutability is the contract between your code and React to **detect, optimize and repeat** renders safely.",
      },
      {
        tipo: "tabela",
        titulo: "Mutating versus copying",
        colunas: ["You want to", "Don’t use (mutates)", "Use (new copy)"],
        linhas: [
          ["Add to an array", "`list.push(x)`", "`[...list, x]`"],
          ["Remove an item", "`list.splice(i, 1)`", "`list.filter((_, j) => j !== i)`"],
          ["Replace an item", "`list[i] = x`", "`list.map((e, j) => (j === i ? x : e))`"],
          ["Sort or reverse", "`list.sort()`, `list.reverse()`", "`[...list].sort()`"],
          ["Change a field", '`obj.name = "Ann"`', '`{ ...obj, name: "Ann" }`'],
          [
            "Change a nested field",
            '`obj.address.city = "Rio"`',
            '`{ ...obj, address: { ...obj.address, city: "Rio" } }`',
          ],
        ],
        nota: "Spread makes a shallow copy: copy every level along the path that changes. For deep structures, Immer (`produce` or `useImmer`) lets you write as if mutating, on a draft, and hands back an immutable copy.",
      },
      {
        tipo: "codigo",
        titulo: "Wrong and right, with the functional form",
        legenda: "JSX",
        codigo: `// Inside the component, with: const [tasks, setTasks] = useState([...]);

// Wrong: the same reference goes back to the setter, and React sees "nothing changed"
function markWrong(id) {
  const task = tasks.find((t) => t.id === id);
  task.done = true;
  setTasks(tasks);
}

// Right: a new copy of the array and of the changed item
function mark(id) {
  setTasks((current) => current.map((t) => (t.id === id ? { ...t, done: true } : t)));
}

const add = (t) => setTasks((current) => [...current, t]);
const remove = (id) => setTasks((current) => current.filter((t) => t.id !== id));`,
        nota: "The functional form (`current => ...`) always receives the latest state, which avoids losing updates made in sequence.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Seeming to work proves nothing",
        texto:
          "Mutating and then calling the setter sometimes “works”, because another update makes the component render and the screen shows the mutated data. The bug becomes intermittent and vanishes in tests. Other common mistakes: `sort()` and `reverse()` mutate the original array, and copying only the top level of a nested object leaves the inner levels shared. When in doubt, treat all state and props as frozen.",
      },
    ],
    armadilhas: [
      "Calling `list.push(x)` followed by `setList(list)`: it is the same reference, and React does not update (or updates by accident).",
      "Calling `sort()` or `reverse()` directly on state: both mutate the original array; copy first.",
      "Copying only the top level of a nested object: the inner levels stay shared and the mutation comes back through the back door.",
      "Concluding it “worked” because the screen changed once: the bug may stay intermittent and slip past tests.",
    ],
    autoteste: [
      {
        pergunta: "What does `Object.is` have to do with `useState`?",
        resposta:
          "The setter compares the new value with the current one using `Object.is`. If they are the same (the same reference), React skips the render; that is why you must hand over a new object or array.",
      },
      {
        pergunta: "How do you update one item of a list in state without mutating?",
        resposta:
          "With `map`: `setList((l) => l.map((i) => (i.id === id ? { ...i, field: next } : i)))`. The array and the changed item get new references, and the rest stays shared.",
      },
    ],
  },
};
