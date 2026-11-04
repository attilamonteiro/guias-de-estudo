import type { Pergunta } from "../../tipos";

// L72 · O que é um stale closure
export const l072: Pergunta = {
  numero: 72,
  modulo: "linkedin-regras-e-effects",
  metodo: "playbook",
  pt: {
    titulo: "O que é um stale closure",
    pergunta: "O que é um stale closure?",
    porqueEsteMetodo:
      "Stale closure é um defeito a diagnosticar: o sintoma aparece longe da causa. Um playbook leva do sintoma ao ponto em que o valor foi capturado e depois às correções, da mais simples à mais pesada.",
    resposta30s:
      "Um **stale closure** (closure desatualizada) é uma função que **capturou state ou props de uma renderização antiga** e continua usando esses valores depois que eles mudaram. Em React, cada renderização cria as suas próprias funções com os valores daquela renderização, então callbacks de vida longa (`setInterval`, listeners, efeitos com dependências incompletas) ficam presos ao passado. A correção é usar **dependências corretas**, a **forma funcional do setter**, um **`useRef`** para o valor mais recente ou recriar o efeito.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: do sintoma à correção",
        passos: [
          {
            titulo: "Reconheça o sintoma",
            texto:
              "Um valor “fica para trás” dentro de algo que roda depois: o contador que trava em 1 dentro do `setInterval`, o listener que mostra o state antigo, o `setTimeout` que usa a prop de três cliques atrás.",
          },
          {
            titulo: "Entenda a causa",
            texto:
              "O state de uma renderização é uma constante daquela renderização. Cada render cria funções novas que **fecham sobre** (capturam) esses valores. Se uma função criada na renderização 1 continua viva (entregue a um timer, a um listener ou a um efeito que não refez), ela enxerga para sempre os valores da renderização 1.",
          },
          {
            titulo: "Ache quem capturou",
            texto:
              "Procure a função de vida longa e quando ela foi criada: um efeito com `[]` ou com dependências incompletas, um `setTimeout` ou `setInterval`, um listener registrado uma vez, um callback entregue a uma biblioteca. A regra `react-hooks/exhaustive-deps` do linter costuma apontar o efeito suspeito.",
          },
          {
            titulo: "Aplique a correção mais simples que serve",
            texto:
              "Prefira, nesta ordem: a forma funcional do setter; as dependências corretas (o efeito refaz e a função se renova); um `useRef`, ou um Effect Event (`useEffectEvent`, recurso recente: confira em react.dev), para ler o valor mais recente. A tabela abaixo mostra cada caso.",
          },
          {
            titulo: "Não silencie o linter",
            texto:
              "Omitir uma dependência para o efeito “parar de rodar” é a origem do problema. Se rodar demais incomoda, reestruture o efeito, não o array.",
          },
          {
            titulo: "Prove a correção",
            texto:
              "Mude o state algumas vezes e confira, com um `console.log` dentro da função de vida longa, se ela enxerga o valor novo. Em testes, avance timers falsos e verifique o resultado.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O contador que trava em 1",
        legenda: "JSX",
        codigo: [
          "function Errado() {",
          "  const [n, setN] = useState(0);",
          "  useEffect(() => {",
          "    const id = setInterval(() => setN(n + 1), 1000); // `n` vale 0 nesta closure",
          "    return () => clearInterval(id);",
          "  }, []); // o linter reclama: falta `n`. O contador trava em 1",
          "  return <p>{n}</p>;",
          "}",
          "",
          "function Certo() {",
          "  const [n, setN] = useState(0);",
          "  useEffect(() => {",
          "    const id = setInterval(() => setN((atual) => atual + 1), 1000); // não lê `n`",
          "    return () => clearInterval(id);",
          "  }, []);",
          "  return <p>{n}</p>;",
          "}",
        ].join("\n"),
        nota: "Em `Errado`, o intervalo nasce uma vez, na primeira renderização, e `n` vale 0 nessa closure: toda chamada faz `setN(0 + 1)`. Em `Certo`, o React entrega o valor corrente ao callback do setter.",
      },
      {
        tipo: "tabela",
        titulo: "Qual correção usar",
        colunas: ["Situação", "Correção", "Observação"],
        linhas: [
          [
            "Só precisa do valor anterior para calcular o próximo",
            "Forma funcional do setter: `setN((atual) => atual + 1)`",
            "Não lê o state, então ele não vira dependência",
          ],
          [
            "O efeito deve se refazer quando o valor muda (a conexão depende da sala)",
            "Incluir o valor nas dependências, com função de limpeza",
            "O efeito e a closure são recriados, e o listener ou timer antigo é desfeito",
          ],
          [
            "Uma função de vida longa precisa do valor mais recente sem reiniciar o efeito",
            "`useRef` atualizado em um efeito ou handler, ou um Effect Event (`useEffectEvent`)",
            "Não escreva em `ref.current` durante a renderização; confira o `useEffectEvent` em react.dev",
          ],
          [
            "Vários estados que mudam juntos e dependem uns dos outros",
            "`useReducer`: a lógica lê o estado atual dentro do reducer",
            "O `dispatch` tem identidade estável",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Nem todo valor antigo é bug",
        texto:
          "Um handler de clique enxerga o state da renderização em que foi criado, e isso costuma ser o desejado: um `setTimeout` de três segundos que mostra o texto como estava no clique está certo. O problema é o inverso: uma função que **precisava** do valor atual e ficou presa a um valor velho.",
      },
    ],
    armadilhas: [
      "Resolver com `// eslint-disable-next-line react-hooks/exhaustive-deps`: o aviso é o diagnóstico, e escondê-lo mantém o bug.",
      "Usar `setN(n + 1)` dentro de um intervalo criado com `[]`: `n` é o da primeira renderização; use a forma funcional.",
      "Escrever em `ref.current` durante a renderização para “resolver” o stale closure: atualize a ref em um efeito ou em um handler.",
      "Achar que o React “perde” o state: o state está certo, é a função que guarda uma foto antiga dele.",
    ],
    autoteste: [
      {
        pergunta: "Por que o contador trava em 1 num `setInterval` criado com `[]` que faz `setN(n + 1)`?",
        resposta:
          "Porque o intervalo nasceu na primeira renderização, em que `n` é 0, e essa closure nunca é substituída. Toda chamada calcula `0 + 1`. A forma funcional `setN((atual) => atual + 1)` lê o valor corrente em vez do capturado.",
      },
      {
        pergunta: "Cite duas formas de fazer uma função de vida longa enxergar o valor mais novo.",
        resposta:
          "Incluir o valor nas dependências para o efeito se refazer (com limpeza), ou guardá-lo numa `ref` atualizada a cada mudança (ou usar um Effect Event) e ler `ref.current` dentro da função.",
      },
    ],
  },
  en: {
    titulo: "What a stale closure is",
    pergunta: "What is a stale closure?",
    porqueEsteMetodo:
      "A stale closure is a defect to diagnose: the symptom shows up far from the cause. A playbook leads from the symptom to the point where the value was captured, and then to the fixes, from the simplest to the heaviest.",
    resposta30s:
      "A **stale closure** is a function that **captured state or props from an old render** and keeps using those values after they changed. In React, every render creates its own functions with that render’s values, so long-lived callbacks (`setInterval`, listeners, effects with incomplete dependencies) stay stuck in the past. The fix is **correct dependencies**, the **functional form of the setter**, a **`useRef`** for the latest value, or recreating the effect.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from symptom to fix",
        passos: [
          {
            titulo: "Recognize the symptom",
            texto:
              "A value “lags behind” inside something that runs later: the counter stuck at 1 inside `setInterval`, the listener that shows old state, the `setTimeout` that uses the prop from three clicks ago.",
          },
          {
            titulo: "Understand the cause",
            texto:
              "A render’s state is a constant for that render. Each render creates new functions that **close over** (capture) those values. If a function created in render 1 stays alive (handed to a timer, a listener or an effect that did not re-run), it sees render 1’s values forever.",
          },
          {
            titulo: "Find who captured it",
            texto:
              "Look for the long-lived function and when it was created: an effect with `[]` or with incomplete dependencies, a `setTimeout` or `setInterval`, a listener registered once, a callback handed to a library. The linter’s `react-hooks/exhaustive-deps` rule usually points at the suspect effect.",
          },
          {
            titulo: "Apply the simplest fix that works",
            texto:
              "Prefer, in this order: the functional form of the setter; correct dependencies (the effect re-runs and the function is renewed); a `useRef`, or an Effect Event (`useEffectEvent`, a recent feature: check react.dev), to read the latest value. The table below shows each case.",
          },
          {
            titulo: "Don’t silence the linter",
            texto:
              "Omitting a dependency to make the effect “stop running” is the origin of the problem. If running too often bothers you, restructure the effect, not the array.",
          },
          {
            titulo: "Prove the fix",
            texto:
              "Change the state a few times and check, with a `console.log` inside the long-lived function, whether it sees the new value. In tests, advance fake timers and check the result.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The counter stuck at 1",
        legenda: "JSX",
        codigo: [
          "function Wrong() {",
          "  const [n, setN] = useState(0);",
          "  useEffect(() => {",
          "    const id = setInterval(() => setN(n + 1), 1000); // `n` is 0 in this closure",
          "    return () => clearInterval(id);",
          "  }, []); // the linter complains: `n` is missing. The counter sticks at 1",
          "  return <p>{n}</p>;",
          "}",
          "",
          "function Right() {",
          "  const [n, setN] = useState(0);",
          "  useEffect(() => {",
          "    const id = setInterval(() => setN((current) => current + 1), 1000); // does not read `n`",
          "    return () => clearInterval(id);",
          "  }, []);",
          "  return <p>{n}</p>;",
          "}",
        ].join("\n"),
        nota: "In `Wrong`, the interval is created once, on the first render, and `n` is 0 in that closure: every tick runs `setN(0 + 1)`. In `Right`, React hands the current value to the setter callback.",
      },
      {
        tipo: "tabela",
        titulo: "Which fix to use",
        colunas: ["Situation", "Fix", "Note"],
        linhas: [
          [
            "You only need the previous value to compute the next",
            "Functional form of the setter: `setN((current) => current + 1)`",
            "It does not read the state, so the state is not a dependency",
          ],
          [
            "The effect should re-run when the value changes (the connection depends on the room)",
            "Include the value in the dependencies, with a cleanup function",
            "The effect and the closure are recreated, and the old listener or timer is undone",
          ],
          [
            "A long-lived function needs the latest value without restarting the effect",
            "A `useRef` updated in an effect or handler, or an Effect Event (`useEffectEvent`)",
            "Don’t write to `ref.current` during render; check `useEffectEvent` at react.dev",
          ],
          [
            "Several pieces of state change together and depend on each other",
            "`useReducer`: the logic reads the current state inside the reducer",
            "`dispatch` has a stable identity",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Not every old value is a bug",
        texto:
          "A click handler sees the state of the render it was created in, and that is usually what you want: a three-second `setTimeout` that shows the text as it was at the click is correct. The problem is the opposite: a function that **needed** the current value and got stuck with an old one.",
      },
    ],
    armadilhas: [
      "Fixing it with `// eslint-disable-next-line react-hooks/exhaustive-deps`: the warning is the diagnosis, and hiding it keeps the bug.",
      "Using `setN(n + 1)` inside an interval created with `[]`: `n` is the first render’s value; use the functional form.",
      "Writing to `ref.current` during render to “fix” the stale closure: update the ref in an effect or a handler.",
      "Thinking React “loses” the state: the state is right, it is the function that holds an old snapshot of it.",
    ],
    autoteste: [
      {
        pergunta: "Why does the counter stick at 1 in a `setInterval` created with `[]` that runs `setN(n + 1)`?",
        resposta:
          "Because the interval was created on the first render, where `n` is 0, and that closure is never replaced. Every tick computes `0 + 1`. The functional form `setN((current) => current + 1)` reads the current value instead of the captured one.",
      },
      {
        pergunta: "Name two ways to make a long-lived function see the newest value.",
        resposta:
          "Include the value in the dependencies so the effect re-runs (with cleanup), or keep it in a `ref` updated on every change (or use an Effect Event) and read `ref.current` inside the function.",
      },
    ],
  },
};
