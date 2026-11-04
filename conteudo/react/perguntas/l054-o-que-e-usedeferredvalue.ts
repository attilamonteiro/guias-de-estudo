import type { Pergunta } from "../../tipos";

// L54 · O que é useDeferredValue
export const l054: Pergunta = {
  numero: 54,
  modulo: "linkedin-hooks",
  metodo: "compare",
  pt: {
    titulo: "O que é useDeferredValue",
    pergunta: "O que é useDeferredValue()?",
    porqueEsteMetodo:
      "`useDeferredValue` convive com `useTransition` e com o debounce, e a entrevista costuma pedir a diferença. Uma matriz coloca os três lado a lado, e a regra de decisão diz qual escolher.",
    resposta30s:
      "`useDeferredValue(valor)` devolve uma **cópia atrasada** do valor: o React renderiza primeiro com o valor antigo (urgente e barato) e depois refaz a renderização em segundo plano com o novo, **interrompendo** o trabalho se o valor mudar de novo. Diferente do debounce, não há tempo fixo; diferente de `useTransition`, você **não precisa controlar o `setState`**, basta receber o valor. Combine com `memo` no filho pesado.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "`useDeferredValue`, `useTransition` e debounce ou throttle",
        colunas: ["Aspecto", "`useDeferredValue`", "`useTransition`", "Debounce ou throttle"],
        linhas: [
          [
            "O que adia",
            "Um **valor** (uma versão atrasada dele)",
            "Uma **atualização de state**",
            "Uma **chamada de função** (por exemplo, o envio de uma requisição)",
          ],
          [
            "Quando usar",
            "Você só recebe o valor (prop, Hook de outra biblioteca) ou não quer mexer no state",
            "Você controla o `setState` e pode envolvê-lo em `startTransition`",
            "Trabalho caro fora da renderização (rede, escrita) ou limite de frequência",
          ],
          [
            "Quem decide quando",
            "O React, por prioridades, com renderização em segundo plano e interrompível",
            "O React, do mesmo jeito",
            "Um tempo fixo que você escolhe",
          ],
          ["Feedback de “atrasado”", "Você compara `valor !== adiado`", "Vem pronto em `isPending`", "Você implementa"],
          ["Em máquina rápida", "Quase não há atraso", "Quase não há atraso", "Sempre espera o tempo fixo"],
          ["Reduz requisições de rede?", "Não, por si só", "Não, por si só", "Sim: é o seu objetivo"],
        ],
        nota: "O benefício depende da renderização concorrente (raiz criada com `createRoot` em vez da API antiga). Em versões recentes, o Hook aceita um segundo argumento, o valor inicial, usado na primeira renderização; confira react.dev.",
      },
      {
        tipo: "codigo",
        titulo: "Busca com resultados pesados",
        legenda: "TSX",
        codigo: `import { memo, useDeferredValue, useState } from "react";

const Resultados = memo(function Resultados({ consulta }: { consulta: string }) {
  // ...renderização pesada: milhares de itens filtrados pela consulta
  return <ul>{/* itens */}</ul>;
});

export function Busca() {
  const [consulta, setConsulta] = useState("");
  const adiada = useDeferredValue(consulta);
  const atrasado = consulta !== adiada;

  return (
    <>
      <input value={consulta} onChange={(e) => setConsulta(e.target.value)} />
      <div style={{ opacity: atrasado ? 0.6 : 1 }}>
        <Resultados consulta={adiada} />
      </div>
    </>
  );
}`,
        nota: "Na renderização urgente, `adiada` ainda tem o valor antigo, então `Resultados` (em `memo`) é pulado e o campo responde na hora. Depois o React renderiza `Resultados` com o valor novo em segundo plano.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Você controla o `setState`? Use `useTransition`. Só recebe o valor e quer que ele chegue atrasado a um filho pesado? Use `useDeferredValue`. Quer reduzir chamadas à rede ou a efeitos caros? Use debounce, e cancele ou descarte respostas velhas.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Sem `memo`, não ajuda",
        texto:
          "O filho que recebe o valor adiado precisa estar em `memo` (ou ser memoizado pelo React Compiler), senão ele re-renderiza na renderização urgente com as mesmas props e o ganho some. O valor adiado também não é debounce: não há tempo de espera, e uma requisição baseada nele pode continuar sendo disparada para vários valores intermediários. E passe valores primitivos ou objetos criados fora da renderização: um objeto novo a cada renderização muda sempre e provoca renderizações em segundo plano à toa.",
      },
    ],
    armadilhas: [
      "Esperar que o Hook reduza requisições: ele não é debounce, e uma busca na rede baseada no valor adiado pode continuar disparando para vários valores intermediários.",
      "Esquecer o `memo` no filho lento: a renderização urgente o refaz e o Hook não traz benefício.",
      "Passar um objeto criado na renderização como valor: a identidade muda toda vez e o React renderiza em segundo plano sem parar.",
      "Achar que o valor adiado torna o trabalho mais rápido: o custo é o mesmo, só a prioridade muda.",
    ],
    autoteste: [
      {
        pergunta: "Quando preferir `useDeferredValue` a `useTransition`?",
        resposta:
          "Quando você não controla o `setState` (o valor vem de uma prop ou de um Hook alheio) ou prefere adiar o consumo do valor, não a atualização dele.",
      },
      {
        pergunta: "Quanto vale o valor adiado enquanto a pessoa digita?",
        resposta:
          "O valor anterior, até a renderização em segundo plano com o novo terminar. Se chegar outro valor antes, essa renderização é abandonada e recomeça.",
      },
    ],
  },
  en: {
    titulo: "What useDeferredValue is",
    pergunta: "What is useDeferredValue()?",
    porqueEsteMetodo:
      "`useDeferredValue` lives alongside `useTransition` and debouncing, and interviews often ask for the difference. A matrix puts the three side by side, and the decision rule says which to pick.",
    resposta30s:
      "`useDeferredValue(value)` returns a **lagging copy** of the value: React first renders with the old value (urgent and cheap) and then redoes the render in the background with the new one, **interrupting** the work if the value changes again. Unlike debouncing, there is no fixed delay; unlike `useTransition`, you **do not need to control the `setState`**, you just receive the value. Combine it with `memo` on the heavy child.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "`useDeferredValue`, `useTransition` and debounce or throttle",
        colunas: ["Aspect", "`useDeferredValue`", "`useTransition`", "Debounce or throttle"],
        linhas: [
          [
            "What it defers",
            "A **value** (a lagging version of it)",
            "A **state update**",
            "A **function call** (for example, sending a request)",
          ],
          [
            "When to use",
            "You only receive the value (a prop, a Hook from another library) or do not want to touch the state",
            "You control the `setState` and can wrap it in `startTransition`",
            "Expensive work outside rendering (network, writes) or a frequency limit",
          ],
          [
            "Who decides when",
            "React, by priorities, with interruptible background rendering",
            "React, the same way",
            "A fixed delay you choose",
          ],
          ["“Lagging” feedback", "You compare `value !== deferred`", "Comes ready in `isPending`", "You implement it"],
          [
            "On a fast machine",
            "There is almost no delay",
            "There is almost no delay",
            "It always waits the fixed time",
          ],
          ["Reduces network requests?", "No, by itself", "No, by itself", "Yes: that is its purpose"],
        ],
        nota: "The benefit depends on concurrent rendering (a root created with `createRoot` instead of the old API). In recent versions, the Hook accepts a second argument, the initial value, used on the first render; check react.dev.",
      },
      {
        tipo: "codigo",
        titulo: "Search with heavy results",
        legenda: "TSX",
        codigo: `import { memo, useDeferredValue, useState } from "react";

const Results = memo(function Results({ query }: { query: string }) {
  // ...heavy rendering: thousands of items filtered by the query
  return <ul>{/* items */}</ul>;
});

export function Search() {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const stale = query !== deferred;

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <div style={{ opacity: stale ? 0.6 : 1 }}>
        <Results query={deferred} />
      </div>
    </>
  );
}`,
        nota: "In the urgent render, `deferred` still holds the old value, so `Results` (in `memo`) is skipped and the field responds right away. Then React renders `Results` with the new value in the background.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Do you control the `setState`? Use `useTransition`. Do you only receive the value and want it to reach a heavy child late? Use `useDeferredValue`. Want to cut network calls or expensive effects? Use debouncing, and cancel or discard stale responses.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Without `memo`, it does not help",
        texto:
          "The child that receives the deferred value must be in `memo` (or memoized by the React Compiler), or it re-renders in the urgent render with the same props and the gain disappears. The deferred value is also not debouncing: there is no waiting time, and a request based on it may still fire for several intermediate values. And pass primitive values or objects created outside rendering: a new object on every render always changes and triggers pointless background renders.",
      },
    ],
    armadilhas: [
      "Expecting the Hook to reduce requests: it is not debouncing, and a network search based on the deferred value may still fire for several intermediate values.",
      "Forgetting `memo` on the slow child: the urgent render redoes it and the Hook brings no benefit.",
      "Passing an object created during rendering as the value: its identity changes every time and React renders in the background non-stop.",
      "Thinking the deferred value makes the work faster: the cost is the same, only the priority changes.",
    ],
    autoteste: [
      {
        pergunta: "When should you prefer `useDeferredValue` over `useTransition`?",
        resposta:
          "When you do not control the `setState` (the value comes from a prop or someone else’s Hook), or you prefer to defer the consumption of the value rather than its update.",
      },
      {
        pergunta: "What is the deferred value while the person types?",
        resposta:
          "The previous value, until the background render with the new one finishes. If another value arrives first, that render is abandoned and starts over.",
      },
    ],
  },
};
