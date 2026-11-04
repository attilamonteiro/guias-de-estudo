import type { Pergunta } from "../../tipos";

// C16 · useMemo ou useCallback
export const c016: Pergunta = {
  numero: 516,
  modulo: "coddy-intermediario",
  metodo: "compare",
  pt: {
    titulo: "useMemo ou useCallback",
    pergunta: "Qual é a diferença entre useMemo e useCallback?",
    porqueEsteMetodo:
      "Os dois hooks têm a mesma assinatura e quase o mesmo mecanismo, e por isso se confundem. Uma matriz lado a lado mostra o que cada um guarda e devolve, e a regra de decisão diz quando nenhum dos dois vale a pena.",
    resposta30s:
      "Os dois **memorizam entre renderizações enquanto as dependências não mudam**: `useMemo(() => calcular(), deps)` guarda o **resultado** de um cálculo, e `useCallback(fn, deps)` guarda a **própria função**. Na prática, `useCallback(fn, deps)` equivale a `useMemo(() => fn, deps)`. Só vale a pena quando o cálculo é caro de verdade ou quando uma referência estável evita re-renderizar um filho memorizado ou disparar um efeito; fora disso é custo e risco de dependência errada. O React Compiler pode fazer essa memorização automaticamente.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "useMemo x useCallback",
        colunas: ["Aspecto", "`useMemo`", "`useCallback`"],
        linhas: [
          ["O que guarda", "O valor devolvido por uma função de cálculo", "A própria função"],
          ["Assinatura", "`useMemo(() => calcular(a, b), [a, b])`", "`useCallback((x) => tratar(x, a), [a])`"],
          [
            "O que o React executa",
            "Chama a função de cálculo durante o render quando as dependências mudam",
            "Não chama a função: só devolve a mesma referência enquanto as dependências não mudam",
          ],
          [
            "Relação entre os dois",
            "Pode devolver qualquer valor, inclusive uma função",
            "É um `useMemo` especializado em funções: `useCallback(fn, deps)` equivale a `useMemo(() => fn, deps)`",
          ],
          [
            "Uso típico",
            "Cálculo caro; objeto ou array estável passado a um filho memorizado ou a uma dependência de hook",
            "Handler ou callback estável passado a um filho memorizado ou a uma dependência de hook",
          ],
          ["O que se ganha", "Evita recalcular e mantém a mesma referência", "Mantém a mesma referência da função"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Os dois juntos, com um filho memorizado",
        legenda: "JSX",
        codigo: `import { memo, useCallback, useMemo, useState } from "react";

const Tabela = memo(function Tabela({ linhas, aoSelecionar }) {
  return linhas.map((l) => <button key={l.id} onClick={() => aoSelecionar(l.id)}>{l.nome}</button>);
});

export function Painel({ pessoas }) {
  const [filtro, setFiltro] = useState("");
  const [escolhida, setEscolhida] = useState(null);
  // useMemo guarda o RESULTADO: o array só é refeito se pessoas ou filtro mudarem
  const linhas = useMemo(() => pessoas.filter((p) => p.nome.includes(filtro)), [pessoas, filtro]);

  // useCallback guarda a FUNÇÃO: mesma referência entre renderizações
  const selecionar = useCallback((id) => setEscolhida(id), []);
  return (
    <>
      <input value={filtro} onChange={(e) => setFiltro(e.target.value)} />
      <p>Escolhida: {escolhida}</p>
      <Tabela linhas={linhas} aoSelecionar={selecionar} />
    </>
  );
}`,
        nota: "Digitar no campo refaz `linhas` e re-renderiza `Tabela`, o que é esperado. Escolher uma pessoa muda só `escolhida`: `linhas` e `selecionar` mantêm a referência e o `Tabela`, memorizado, é pulado.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Pergunte: o que muda se eu **não** memorizar? Só memorize quando (1) o cálculo é comprovadamente caro, ou (2) a referência estável é consumida por algo que a compara: um filho em `React.memo` ou a lista de dependências de `useEffect`, `useMemo` ou `useCallback`. Valor: `useMemo`. Função: `useCallback`. Sem um desses motivos, deixe sem.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Memorização é otimização, não garantia",
        texto:
          "O React pode descartar o cache, então o código precisa funcionar sem ele. Dependências erradas geram valores velhos (closure obsoleta); dependências que são objetos recriados a cada render fazem a memorização nunca acertar. Memorizar tudo de saída soma comparações, memória e ruído. O React Compiler automatiza boa parte disso: em projetos que o usam, escreva primeiro o código simples e confira react.dev antes de manter `useMemo` e `useCallback` à mão.",
      },
    ],
    armadilhas: [
      "Usar `useCallback` num handler passado a um filho que não está em `React.memo` (nem entra em dependências): não evita nenhum render.",
      "Esquecer dependências ou listar objetos recriados a cada render: o valor fica obsoleto, ou a memorização nunca é reaproveitada.",
      "Colocar efeito colateral (requisição, escrita no DOM) dentro de `useMemo`: a função deve ser pura; efeitos vão em `useEffect` ou em handlers.",
      "Memorizar por reflexo, sem medir: o ganho é inexistente, e a comparação das dependências ainda custa.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a relação entre `useCallback(fn, deps)` e `useMemo`?",
        resposta:
          "São equivalentes: `useCallback(fn, deps)` é o mesmo que `useMemo(() => fn, deps)`. O primeiro guarda a função; o segundo, o valor que a função de cálculo devolve.",
      },
      {
        pergunta: "Em que caso o `useCallback` realmente evita trabalho?",
        resposta:
          "Quando a função vai para um filho memorizado com `React.memo` (ou é dependência de um hook): a referência estável impede o re-render ou a reexecução do efeito. Sem isso, só acrescenta custo.",
      },
    ],
  },
  en: {
    titulo: "useMemo or useCallback",
    pergunta: "What is the difference between useMemo and useCallback?",
    porqueEsteMetodo:
      "The two hooks share a signature and almost the same mechanism, which is why they get mixed up. A side-by-side matrix shows what each one stores and returns, and the decision rule says when neither is worth it.",
    resposta30s:
      "Both **cache between renders while the dependencies stay the same**: `useMemo(() => compute(), deps)` stores the **result** of a calculation, and `useCallback(fn, deps)` stores the **function itself**. In practice, `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`. They only pay off when the calculation is genuinely expensive or when a stable reference avoids re-rendering a memoized child or firing an effect; otherwise they are cost and a risk of wrong dependencies. The React Compiler can do this memoization automatically.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "useMemo vs useCallback",
        colunas: ["Aspect", "`useMemo`", "`useCallback`"],
        linhas: [
          ["What it stores", "The value returned by a calculation function", "The function itself"],
          ["Signature", "`useMemo(() => compute(a, b), [a, b])`", "`useCallback((x) => handle(x, a), [a])`"],
          [
            "What React runs",
            "Calls the calculation function during render when the dependencies change",
            "Does not call the function: it only returns the same reference while the dependencies stay the same",
          ],
          [
            "Relationship between them",
            "Can return any value, including a function",
            "A `useMemo` specialized for functions: `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`",
          ],
          [
            "Typical use",
            "An expensive calculation; a stable object or array passed to a memoized child or a hook dependency",
            "A stable handler or callback passed to a memoized child or a hook dependency",
          ],
          ["What you gain", "Avoids recomputing and keeps the same reference", "Keeps the same function reference"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Both together, with a memoized child",
        legenda: "JSX",
        codigo: `import { memo, useCallback, useMemo, useState } from "react";

const Table = memo(function Table({ rows, onSelect }) {
  return rows.map((r) => <button key={r.id} onClick={() => onSelect(r.id)}>{r.name}</button>);
});

export function Panel({ people }) {
  const [filter, setFilter] = useState("");
  const [picked, setPicked] = useState(null);
  // useMemo stores the RESULT: the array is only rebuilt if people or filter change
  const rows = useMemo(() => people.filter((p) => p.name.includes(filter)), [people, filter]);

  // useCallback stores the FUNCTION: the same reference across renders
  const select = useCallback((id) => setPicked(id), []);
  return (
    <>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <p>Picked: {picked}</p>
      <Table rows={rows} onSelect={select} />
    </>
  );
}`,
        nota: "Typing in the field rebuilds `rows` and re-renders `Table`, as expected. Picking a person changes only `picked`: `rows` and `select` keep their reference, and the memoized `Table` is skipped.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Ask: what changes if I do **not** memoize? Only memoize when (1) the calculation is demonstrably expensive, or (2) the stable reference is consumed by something that compares it: a `React.memo` child or the dependency list of `useEffect`, `useMemo` or `useCallback`. Value: `useMemo`. Function: `useCallback`. With neither reason, leave it out.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Memoization is an optimization, not a guarantee",
        texto:
          "React may discard the cache, so the code must work without it. Wrong dependencies produce stale values (a stale closure); dependencies that are objects recreated on every render make the memoization never hit. Memoizing everything up front adds comparisons, memory and noise. The React Compiler automates a good part of this: in projects that use it, write the simple code first and check react.dev before keeping `useMemo` and `useCallback` by hand.",
      },
    ],
    armadilhas: [
      "Using `useCallback` on a handler passed to a child that is not in `React.memo` (and is not a dependency): it prevents no render.",
      "Forgetting dependencies or listing objects recreated on every render: the value goes stale, or the memoization is never reused.",
      "Putting a side effect (a request, a DOM write) inside `useMemo`: the function must be pure; effects belong in `useEffect` or in handlers.",
      "Memoizing by reflex, without measuring: the gain is nil, and comparing the dependencies still costs.",
    ],
    autoteste: [
      {
        pergunta: "What is the relationship between `useCallback(fn, deps)` and `useMemo`?",
        resposta:
          "They are equivalent: `useCallback(fn, deps)` is the same as `useMemo(() => fn, deps)`. The first stores the function; the second stores the value the calculation function returns.",
      },
      {
        pergunta: "When does `useCallback` actually avoid work?",
        resposta:
          "When the function goes to a child memoized with `React.memo` (or is a hook dependency): the stable reference prevents the re-render or the re-run of the effect. Without that, it only adds cost.",
      },
    ],
  },
};
