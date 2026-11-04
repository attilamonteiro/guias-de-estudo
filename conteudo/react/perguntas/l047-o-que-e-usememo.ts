import type { Pergunta } from "../../tipos";

// L47 · O que é useMemo
export const l047: Pergunta = {
  numero: 47,
  modulo: "linkedin-hooks",
  metodo: "playbook",
  pt: {
    titulo: "O que é useMemo",
    pergunta: "O que é useMemo()?",
    porqueEsteMetodo:
      "Definir `useMemo` é fácil; o difícil é saber **quando** ele compensa, e é isso que a entrevista cobra. Um playbook dá a ordem certa: medir, confirmar o motivo, aplicar com dependências corretas e verificar o ganho.",
    resposta30s:
      "`useMemo(calcular, dependências)` guarda o **resultado de um cálculo** entre renderizações e só o refaz quando uma dependência muda (comparada com `Object.is`). Serve para pular um cálculo **realmente caro** ou para manter a **mesma referência** de um objeto ou array passado a um filho memoizado, mas é uma **dica de desempenho, não uma garantia**: o código tem de funcionar sem ele. Meça antes de usar, e lembre que o React Compiler automatiza boa parte dessa memoização.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: devo usar `useMemo`?",
        passos: [
          {
            titulo: "Meça antes de mexer",
            texto:
              "Sinal: a interação fica perceptivelmente lenta (digitar, filtrar, trocar de aba). Use o Profiler do React DevTools para ver qual componente renderiza e quanto demora, e `console.time` em volta do cálculo suspeito. Teste num build de produção ou com a CPU limitada: em desenvolvimento tudo parece mais lento. Sem medida, não há o que otimizar.",
          },
          {
            titulo: "Confirme o motivo",
            texto:
              "Há dois motivos bons: (1) o cálculo é **caro de verdade** e se repete sem necessidade quando só outro estado mudou (filtrar, ordenar ou agregar milhares de itens); (2) a **referência** importa: o objeto ou array vai para um filho em `React.memo` ou é dependência de outro Hook. Se nenhum dos dois vale, pare aqui.",
          },
          {
            titulo: "Aplique com dependências corretas",
            texto:
              "Em `useMemo(() => calcular(a, b), [a, b])`, a primeira renderização chama a função e guarda o resultado; as seguintes comparam as dependências com `Object.is` e, se nenhuma mudou, devolvem o valor guardado sem chamar a função. Liste **todo** valor reativo usado lá dentro (o lint `exhaustive-deps` confere) e mantenha a função **pura**.",
          },
          {
            titulo: "Verifique o ganho",
            texto:
              "Meça de novo, no mesmo cenário. Critério: a diferença aparece no Profiler ou no `console.time`. Se não aparecer, remova o `useMemo`. Confira também que a dependência é estável: um objeto ou função criado no corpo do componente muda a cada renderização e derruba o cache.",
          },
          {
            titulo: "Considere alternativas mais baratas",
            texto:
              "Para otimizar cálculos custosos, avalie também: mover o cálculo para fora do componente quando ele não depende de props, aproximar o estado de quem o usa, reduzir o volume (paginação, virtualização), adiar a parte lenta com `useDeferredValue` (veja L54) ou calcular no servidor. Veja ainda se o projeto usa o React Compiler: ele pode memoizar sozinho.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Filtrar uma lista sem refazer o trabalho ao trocar o tema",
        legenda: "TSX",
        codigo: `import { useMemo, useState } from "react";

export function ListaFiltrada({ itens }: { itens: string[] }) {
  const [busca, setBusca] = useState("");
  const [escuro, setEscuro] = useState(false);

  // Refaz só quando itens ou busca mudam; alternar o tema reaproveita o resultado.
  const visiveis = useMemo(
    () => itens.filter((item) => item.toLowerCase().includes(busca.toLowerCase())),
    [itens, busca],
  );

  return (
    <div className={escuro ? "escuro" : "claro"}>
      <input value={busca} onChange={(e) => setBusca(e.target.value)} />
      <button onClick={() => setEscuro(!escuro)}>Tema</button>
      <ul>{visiveis.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}`,
        nota: "`itens` precisa manter a mesma referência entre renderizações (vindo de props estáveis ou de state). Se o pai criar um array novo a cada renderização, o cache nunca vale.",
      },
      {
        tipo: "tabela",
        titulo: "Quando vale e quando não vale",
        colunas: ["Situação", "Vale a pena?", "Motivo"],
        linhas: [
          [
            "Filtrar, ordenar ou agregar milhares de itens a cada renderização",
            "Sim, depois de medir",
            "O trabalho se repete sem necessidade quando só outro estado mudou",
          ],
          [
            "Objeto ou array passado a um filho em `React.memo` ou usado como dependência de Hook",
            "Sim",
            "Estabiliza a referência; sem isso, o filho ou o efeito reage a cada renderização",
          ],
          [
            "Conta simples, concatenação de texto, poucos itens",
            "Não",
            "Guardar e comparar dependências custa tanto quanto recalcular, ou mais",
          ],
          [
            "Dependência que muda a cada renderização (objeto ou função criados no corpo)",
            "Não",
            "O cache é invalidado sempre: paga-se o custo e nunca se ganha",
          ],
          [
            "Efeito colateral, requisição, `Date.now()` ou número aleatório",
            "Não",
            "O cálculo tem de ser puro; efeitos vão em handlers ou em `useEffect`",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Comece **sem** `useMemo`. Adicione quando uma medição mostrar um cálculo caro repetido sem necessidade, ou quando uma referência estável fizer um filho memoizado (ou um Hook) deixar de trabalhar à toa. `useCallback` é o mesmo mecanismo aplicado a funções (veja L48).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "É dica de desempenho, não garantia",
        texto:
          "O React pode descartar o valor guardado e recalcular, então o código tem de continuar correto sem a memoização: não use `useMemo` para guardar estado nem para impedir que algo rode. Em desenvolvimento, o Strict Mode chama a função de cálculo duas vezes para expor impurezas. Com o React Compiler, grande parte dessa memoização passa a ser automática na compilação, e `useMemo` e `useCallback` ficam como controle manual (por exemplo, um valor usado como dependência de efeito). Confira em react.dev o que o compilador cobre.",
      },
    ],
    armadilhas: [
      "Envolver tudo em `useMemo` ou `useCallback` por precaução: o código fica mais difícil de ler e a comparação de dependências custa mais do que economiza.",
      "Omitir dependências para evitar o recálculo: o resultado fica velho em silêncio. Se o lint reclama, o problema está no desenho, não no aviso.",
      "Memoizar o valor, mas o filho que o recebe não está em `React.memo`: ele renderiza do mesmo jeito e o `useMemo` não serviu para nada.",
      "Tratar `useMemo` como garantia (guardar estado, executar só uma vez): o React pode descartar o cache, é só uma dica de desempenho.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre `useMemo` e `useCallback`?",
        resposta:
          "`useMemo(() => valor, deps)` guarda o **resultado** de uma função; `useCallback(fn, deps)` guarda a **própria função** e equivale a `useMemo(() => fn, deps)`. Veja L48.",
      },
      {
        pergunta: "Uma lista de 50 itens é filtrada na renderização e a tela está fluida. Vale adicionar `useMemo`?",
        resposta:
          "Não. Sem lentidão medida e sem filho memoizado dependendo da referência, o custo de guardar e comparar não se paga. Meça primeiro.",
      },
    ],
  },
  en: {
    titulo: "What useMemo is",
    pergunta: "What is useMemo()?",
    porqueEsteMetodo:
      "Defining `useMemo` is easy; the hard part is knowing **when** it pays off, and that is what interviews test. A playbook gives the right order: measure, confirm the reason, apply it with correct dependencies and verify the gain.",
    resposta30s:
      "`useMemo(calculate, dependencies)` stores the **result of a calculation** between renders and only redoes it when a dependency changes (compared with `Object.is`). It is for skipping a **truly expensive** calculation or for keeping the **same reference** of an object or array passed to a memoized child, but it is a **performance hint, not a guarantee**: the code must work without it. Measure before using it, and remember that the React Compiler automates much of this memoization.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: should I use `useMemo`?",
        passos: [
          {
            titulo: "Measure before touching anything",
            texto:
              "Sign: the interaction feels noticeably slow (typing, filtering, switching tabs). Use the React DevTools Profiler to see which component renders and how long it takes, and `console.time` around the suspect calculation. Test on a production build or with a throttled CPU: in development everything looks slower. Without a measurement, there is nothing to optimize.",
          },
          {
            titulo: "Confirm the reason",
            texto:
              "There are two good reasons: (1) the calculation is **truly expensive** and repeats needlessly when only some other state changed (filtering, sorting or aggregating thousands of items); (2) the **reference** matters: the object or array goes to a child wrapped in `React.memo` or is a dependency of another Hook. If neither applies, stop here.",
          },
          {
            titulo: "Apply it with correct dependencies",
            texto:
              "In `useMemo(() => calculate(a, b), [a, b])`, the first render calls the function and stores the result; later renders compare the dependencies with `Object.is` and, if none changed, return the stored value without calling the function. List **every** reactive value used inside (the `exhaustive-deps` lint checks it) and keep the function **pure**.",
          },
          {
            titulo: "Verify the gain",
            texto:
              "Measure again, in the same scenario. Criterion: the difference shows up in the Profiler or in `console.time`. If it does not, remove the `useMemo`. Also check that the dependency is stable: an object or function created in the component body changes on every render and defeats the cache.",
          },
          {
            titulo: "Consider cheaper alternatives",
            texto:
              "To optimize expensive calculations, also weigh: moving the calculation outside the component when it does not depend on props, moving state closer to where it is used, reducing the volume (pagination, virtualization), deferring the slow part with `useDeferredValue` (see L54) or computing on the server. And check whether the project uses the React Compiler: it can memoize on its own.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Filtering a list without redoing the work when the theme changes",
        legenda: "TSX",
        codigo: `import { useMemo, useState } from "react";

export function FilteredList({ items }: { items: string[] }) {
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);

  // Redone only when items or search change; toggling the theme reuses the result.
  const visible = useMemo(
    () => items.filter((item) => item.toLowerCase().includes(search.toLowerCase())),
    [items, search],
  );

  return (
    <div className={dark ? "dark" : "light"}>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <button onClick={() => setDark(!dark)}>Theme</button>
      <ul>{visible.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}`,
        nota: "`items` must keep the same reference between renders (coming from stable props or from state). If the parent creates a new array on every render, the cache never hits.",
      },
      {
        tipo: "tabela",
        titulo: "When it pays off and when it does not",
        colunas: ["Situation", "Worth it?", "Reason"],
        linhas: [
          [
            "Filtering, sorting or aggregating thousands of items on every render",
            "Yes, after measuring",
            "The work repeats needlessly when only some other state changed",
          ],
          [
            "An object or array passed to a child in `React.memo` or used as a Hook dependency",
            "Yes",
            "It stabilizes the reference; without it, the child or the effect reacts on every render",
          ],
          [
            "A simple calculation, string concatenation, a few items",
            "No",
            "Storing and comparing dependencies costs as much as recomputing, or more",
          ],
          [
            "A dependency that changes on every render (an object or function created in the body)",
            "No",
            "The cache is always invalidated: you pay the cost and never gain",
          ],
          [
            "A side effect, a request, `Date.now()` or a random number",
            "No",
            "The calculation must be pure; effects belong in handlers or in `useEffect`",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Start **without** `useMemo`. Add it when a measurement shows an expensive calculation repeated needlessly, or when a stable reference makes a memoized child (or a Hook) stop working for nothing. `useCallback` is the same mechanism applied to functions (see L48).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A performance hint, not a guarantee",
        texto:
          "React may discard the stored value and recompute, so the code must stay correct without the memoization: do not use `useMemo` to hold state or to stop something from running. In development, Strict Mode calls the calculation function twice to expose impurities. With the React Compiler, much of this memoization becomes automatic at compile time, and `useMemo` and `useCallback` remain as manual control (for example, a value used as an effect dependency). Check react.dev for what the compiler covers.",
      },
    ],
    armadilhas: [
      "Wrapping everything in `useMemo` or `useCallback` just in case: the code gets harder to read and comparing dependencies costs more than it saves.",
      "Omitting dependencies to avoid recomputing: the result goes stale silently. If the lint complains, the problem is in the design, not in the warning.",
      "Memoizing the value while the child that receives it is not in `React.memo`: it renders anyway and `useMemo` achieved nothing.",
      "Treating `useMemo` as a guarantee (holding state, running only once): React may discard the cache, it is only a performance hint.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `useMemo` and `useCallback`?",
        resposta:
          "`useMemo(() => value, deps)` stores the **result** of a function; `useCallback(fn, deps)` stores the **function itself** and is equivalent to `useMemo(() => fn, deps)`. See L48.",
      },
      {
        pergunta: "A 50-item list is filtered during render and the screen is smooth. Is it worth adding `useMemo`?",
        resposta:
          "No. Without measured slowness and without a memoized child depending on the reference, the cost of storing and comparing does not pay off. Measure first.",
      },
    ],
  },
};
