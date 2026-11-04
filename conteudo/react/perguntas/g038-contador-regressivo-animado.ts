import type { Pergunta } from "../../tipos";

// G38 · Contador regressivo animado
export const g038: Pergunta = {
  numero: 338,
  modulo: "glassdoor-exercicios",
  metodo: "design",
  pt: {
    titulo: "Contador regressivo animado",
    pergunta:
      "Construa uma animação de temporizador de contagem regressiva em React (exercício para fazer em casa ou de live coding).",
    porqueEsteMetodo:
      "É um exercício de projeto em miniatura, e um roteiro evita o improviso que dá errado em entrevista: requisitos, estado mínimo, fonte do tempo, efeito com limpeza, animação, acessibilidade e testes, nessa ordem.",
    resposta30s:
      "Modele o mínimo: o **instante final** (`fimEm`) enquanto roda e o **tempo restante** quando parado ou pausado; todo o resto (texto, porcentagem, “terminou”) deriva disso. Um `setInterval` só decide **quando redesenhar**, e o valor vem do **relógio** (`fimEm - Date.now()`), para não acumular deriva; o efeito **limpa o intervalo** ao pausar, terminar ou desmontar. O progresso anima por CSS ou SVG, o fim é avisado em uma região acessível e o conjunto se testa com **timers falsos**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Funcionais: duração configurável, iniciar, pausar, retomar e reiniciar, tempo restante legível (`mm:ss`), progresso animado e um aviso ao terminar. Não funcionais: o tempo não pode derivar, nenhum timer pode vazar ao desmontar, e o aviso precisa ser acessível.",
          },
          {
            titulo: "2. Estado mínimo",
            texto:
              "Grave só o que não dá para calcular: `fimEm` (o instante final, enquanto roda) e `restanteMs` (o que falta, quando parado ou pausado). O texto, a porcentagem e o “terminou” **derivam** disso. Pausar guarda o que restava e apaga o `fimEm`; retomar calcula `Date.now() + restanteMs`.",
          },
          {
            titulo: "3. De onde vem o tempo",
            texto:
              "Do **relógio**, não da contagem de ticks: o que se mostra é `fimEm - agora`, e o `setInterval` só decide quando redesenhar (veja a tabela). Para durações, `performance.now()` não sofre ajustes do relógio do sistema; `Date.now()` basta para este exercício.",
          },
          {
            titulo: "4. Efeito e limpeza",
            texto:
              "O intervalo existe só enquanto `rodando` é verdadeiro, e a função de limpeza o cancela ao pausar, ao terminar e ao desmontar. Em desenvolvimento, o StrictMode monta, desmonta e monta de novo o efeito; com a limpeza certa, isso é inofensivo.",
          },
          {
            titulo: "5. Animação do progresso",
            texto:
              "A fração `restante / duracao` alimenta um anel SVG (`stroke-dashoffset`) ou uma barra (`transform: scaleX`). Para suavizar entre os ticks, use uma transição CSS linear curta; prefira propriedades baratas, como `transform`, e evite animar `width`, que força layout.",
          },
          {
            titulo: "6. Término e acessibilidade",
            texto:
              "Ao chegar a zero, o estado vira “terminou” e dispara `onFim`. O aviso vai em texto visível numa região de status (veja o aviso abaixo), e o contador não anuncia cada segundo: o leitor de tela falaria sem parar. Não dependa só de som ou de cor, e respeite `prefers-reduced-motion`.",
          },
          {
            titulo: "7. Testes",
            texto:
              "Com timers falsos (`vi.useFakeTimers()` no Vitest, `jest.useFakeTimers()` no Jest), avance o relógio dentro de `act`: iniciar, avançar 3 s, pausar, avançar mais e conferir que o valor congelou, retomar, chegar a zero e ver o aviso. Teste também que desmontar não deixa timers vivos (`vi.getTimerCount()`).",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Quem dá o ritmo",
        colunas: ["Fonte do tick", "Boa para", "Cuidados"],
        linhas: [
          [
            "`setInterval`",
            "Atualizar o número na tela (décimos ou segundos)",
            "Não é preciso: o atraso do navegador e as abas em segundo plano espaçam os ticks. Por isso o valor vem do relógio. Sempre `clearInterval` na limpeza",
          ],
          [
            "`setTimeout` agendado para o próximo segundo",
            "Alinhar o tick à virada do segundo, corrigindo o atraso a cada passo",
            "Mais código; cada agendamento precisa ser cancelado na limpeza",
          ],
          [
            "`requestAnimationFrame`",
            "Animação visual quadro a quadro (anel, barra)",
            "Pausa em aba oculta e não é um relógio: calcule pelo tempo real. Cancele com `cancelAnimationFrame`. Atualizar o estado a cada quadro re-renderiza o componente a cada quadro: escreva direto no elemento por `ref` ou deixe o CSS animar",
          ],
          [
            "Transição ou animação CSS",
            "Progresso suave sem JavaScript por quadro",
            "Não conta o tempo, só o desenha; precisa acompanhar a pausa (`animation-play-state`) e o tempo real",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "O hook do temporizador",
        legenda: "TSX",
        codigo: [
          'import { useEffect, useState } from "react";',
          "",
          "export function useContagem(duracaoMs: number) {",
          "  const [restanteMs, setRestanteMs] = useState(duracaoMs); // parado ou pausado",
          "  const [fimEm, setFimEm] = useState<number | null>(null); // só enquanto roda",
          "  const [agora, setAgora] = useState(() => Date.now()); // renova a cada tick",
          "  const restante = fimEm === null ? restanteMs : Math.max(0, fimEm - agora);",
          "  const rodando = fimEm !== null;",
          "  useEffect(() => {",
          "    if (!rodando) return;",
          "    const id = setInterval(() => setAgora(Date.now()), 100);",
          "    return () => clearInterval(id); // ao pausar, terminar ou desmontar",
          "  }, [rodando]);",
          "  useEffect(() => {",
          "    if (rodando && restante === 0) { setFimEm(null); setRestanteMs(0); } // terminou",
          "  }, [rodando, restante]);",
          "",
          "  const iniciar = () => { const t = Date.now(); setAgora(t); setFimEm(t + restanteMs); };",
          "  const pausar = () => { setRestanteMs(restante); setFimEm(null); }; // guarda o que a tela mostrava",
          "  const reiniciar = () => { setFimEm(null); setRestanteMs(duracaoMs); };",
          "  return { restante, rodando, iniciar, pausar, reiniciar };",
          "}",
        ].join("\n"),
        nota: "O componente só desenha: `Math.ceil(restante / 1000)` para os segundos, `restante / duracaoMs` para o anel. O 100 ms é só o ritmo de redesenho, não a precisão do tempo.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra: conte pelo relógio e guarde o mínimo",
        texto:
          "Não faça `setSegundos(s => s - 1)` a cada tick: cada tick atrasado soma erro. Guarde o **instante final** e calcule `restante = fimEm - agora`: atraso, aba em segundo plano e re-render lento deixam de acumular deriva, porque o próximo cálculo corrige tudo. O mesmo vale para o resto: se dá para calcular a partir de `fimEm` e `restanteMs` (texto, porcentagem, “terminou”), não vira estado.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Estado e eventos eficientes (pausar e retomar)",
        texto:
          'Isole o relógio: o componente que re-renderiza a cada tick deve ser pequeno, para o resto da tela não renderizar a cada 100 ms. Pausar e retomar são só duas trocas de estado (`fimEm` vira nulo e depois é calculado de novo) e não exigem `useCallback` se os filhos não são memoizados. O aviso de fim vai numa região com `role="status"`, com texto como “Tempo esgotado”; o contador em si pode usar `role="timer"`, que não anuncia automaticamente. Cuidado com o clássico `setInterval` num efeito com `[]` que lê `restante`: ele fica com o valor da primeira renderização (closure obsoleta); calcular pelo relógio contorna o problema.',
      },
    ],
    armadilhas: [
      "Contar ticks (`s - 1` a cada `setInterval`): o tempo deriva, abas em segundo plano atrasam e o contador mente depois de poucos minutos.",
      "Esquecer a limpeza do efeito, ou recriar o intervalo a cada render por uma dependência errada: intervalos duplicados, contagem acelerada e `setState` depois que o componente saiu da tela.",
      "Atualizar o estado do React a cada quadro para animar: re-renderiza o componente inteiro; deixe o CSS ou o SVG fazer a animação.",
      "Anunciar cada segundo em uma região `aria-live`, ou avisar o fim só por cor ou som: o leitor de tela fica ruidoso e quem não vê ou não ouve perde o aviso.",
    ],
    autoteste: [
      {
        pergunta: "Por que `fimEm - Date.now()` é melhor do que decrementar um contador a cada tick?",
        resposta:
          "Porque o `setInterval` não garante o intervalo: os ticks atrasam e ficam espaçados em abas em segundo plano. Cada tick atrasado soma erro ao contador, enquanto o cálculo pelo relógio dá o valor certo no momento em que é lido.",
      },
      {
        pergunta: "Como pausar e retomar sem perder o tempo?",
        resposta:
          "Ao pausar, guarde o que restava (`restanteMs`) e apague o `fimEm`, o que também cancela o intervalo pela limpeza do efeito. Ao retomar, grave `fimEm = Date.now() + restanteMs`.",
      },
    ],
  },
  en: {
    titulo: "Animated countdown timer",
    pergunta: "Build a countdown timer animation in React (a take-home / live coding exercise).",
    porqueEsteMetodo:
      "This is a design exercise in miniature, and a script avoids the improvisation that goes wrong in interviews: requirements, minimal state, source of time, effect with cleanup, animation, accessibility and tests, in that order.",
    resposta30s:
      "Model the minimum: the **end instant** (`endsAt`) while running and the **remaining time** when stopped or paused; everything else (text, percentage, “finished”) derives from it. A `setInterval` only decides **when to redraw**, and the value comes from the **clock** (`endsAt - Date.now()`), so drift never accumulates; the effect **clears the interval** on pause, finish or unmount. Progress animates with CSS or SVG, the end is announced in an accessible region and the whole thing is tested with **fake timers**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "Functional: configurable duration, start, pause, resume and reset, a readable remaining time (`mm:ss`), animated progress and a notice when it ends. Non-functional: time must not drift, no timer may leak on unmount, and the notice must be accessible.",
          },
          {
            titulo: "2. Minimal state",
            texto:
              "Store only what cannot be computed: `endsAt` (the end instant, while running) and `remainingMs` (what is left, when stopped or paused). The text, the percentage and “finished” **derive** from them. Pausing saves what was left and clears `endsAt`; resuming computes `Date.now() + remainingMs`.",
          },
          {
            titulo: "3. Where time comes from",
            texto:
              "From the **clock**, not from counting ticks: what is shown is `endsAt - now`, and `setInterval` only decides when to redraw (see the table). For durations, `performance.now()` is not affected by system clock adjustments; `Date.now()` is enough for this exercise.",
          },
          {
            titulo: "4. Effect and cleanup",
            texto:
              "The interval exists only while `running` is true, and the cleanup function cancels it on pause, on finish and on unmount. In development, StrictMode mounts, unmounts and mounts the effect again; with correct cleanup, that is harmless.",
          },
          {
            titulo: "5. Progress animation",
            texto:
              "The fraction `remaining / duration` drives an SVG ring (`stroke-dashoffset`) or a bar (`transform: scaleX`). To smooth things between ticks, use a short linear CSS transition; prefer cheap properties such as `transform` and avoid animating `width`, which forces layout.",
          },
          {
            titulo: "6. Finish and accessibility",
            texto:
              "At zero, the state becomes “finished” and fires `onFinish`. The notice goes in visible text inside a status region (see the warning below), and the counter does not announce every second: a screen reader would talk nonstop. Do not rely on sound or color alone, and respect `prefers-reduced-motion`.",
          },
          {
            titulo: "7. Tests",
            texto:
              "With fake timers (`vi.useFakeTimers()` in Vitest, `jest.useFakeTimers()` in Jest), advance the clock inside `act`: start, advance 3 s, pause, advance more and check the value stayed frozen, resume, reach zero and see the notice. Also test that unmounting leaves no live timers (`vi.getTimerCount()`).",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "What sets the pace",
        colunas: ["Tick source", "Good for", "Caveats"],
        linhas: [
          [
            "`setInterval`",
            "Updating the number on screen (tenths or seconds)",
            "Not precise: browser delay and background tabs space the ticks out. That is why the value comes from the clock. Always `clearInterval` in the cleanup",
          ],
          [
            "`setTimeout` scheduled for the next second",
            "Aligning the tick with the turn of the second, correcting the delay at every step",
            "More code; each scheduled call must be cancelled in the cleanup",
          ],
          [
            "`requestAnimationFrame`",
            "Frame-by-frame visual animation (ring, bar)",
            "Pauses in a hidden tab and is not a clock: compute from real time. Cancel with `cancelAnimationFrame`. Updating state every frame re-renders the component every frame: write straight to the element through a `ref` or let CSS animate",
          ],
          [
            "CSS transition or animation",
            "Smooth progress with no per-frame JavaScript",
            "It does not count time, it only draws it; it must follow the pause (`animation-play-state`) and real time",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The timer hook",
        legenda: "TSX",
        codigo: [
          'import { useEffect, useState } from "react";',
          "",
          "export function useCountdown(durationMs: number) {",
          "  const [remainingMs, setRemainingMs] = useState(durationMs); // stopped or paused",
          "  const [endsAt, setEndsAt] = useState<number | null>(null); // only while running",
          "  const [now, setNow] = useState(() => Date.now()); // refreshed every tick",
          "  const remaining = endsAt === null ? remainingMs : Math.max(0, endsAt - now);",
          "  const running = endsAt !== null;",
          "  useEffect(() => {",
          "    if (!running) return;",
          "    const id = setInterval(() => setNow(Date.now()), 100);",
          "    return () => clearInterval(id); // on pause, finish or unmount",
          "  }, [running]);",
          "  useEffect(() => {",
          "    if (running && remaining === 0) { setEndsAt(null); setRemainingMs(0); } // finished",
          "  }, [running, remaining]);",
          "",
          "  const start = () => { const t = Date.now(); setNow(t); setEndsAt(t + remainingMs); };",
          "  const pause = () => { setRemainingMs(remaining); setEndsAt(null); }; // keeps what the screen showed",
          "  const reset = () => { setEndsAt(null); setRemainingMs(durationMs); };",
          "  return { remaining, running, start, pause, reset };",
          "}",
        ].join("\n"),
        nota: "The component only draws: `Math.ceil(remaining / 1000)` for the seconds, `remaining / durationMs` for the ring. The 100 ms is just the redraw pace, not the precision of the time.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule: count by the clock and store the minimum",
        texto:
          "Do not write `setSeconds(s => s - 1)` on every tick: each late tick adds error. Store the **end instant** and compute `remaining = endsAt - now`: delay, background tabs and slow re-renders stop accumulating drift, because the next computation corrects everything. The same goes for the rest: if it can be computed from `endsAt` and `remainingMs` (text, percentage, “finished”), it does not become state.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Efficient state and events (pause and resume)",
        texto:
          'Isolate the clock: the component that re-renders on every tick should be small, so the rest of the screen does not render every 100 ms. Pause and resume are just two state changes (`endsAt` becomes null and is later computed again) and do not need `useCallback` unless the children are memoized. The end notice goes in a region with `role="status"`, with text such as “Time is up”; the counter itself can use `role="timer"`, which does not announce automatically. Beware of the classic `setInterval` inside an effect with `[]` that reads `remaining`: it keeps the first render’s value (a stale closure); computing from the clock sidesteps the problem.',
      },
    ],
    armadilhas: [
      "Counting ticks (`s - 1` on every `setInterval`): time drifts, background tabs fall behind and the counter lies after a few minutes.",
      "Forgetting the effect’s cleanup, or recreating the interval on every render through a wrong dependency: duplicated intervals, a speeding-up count and `setState` after the component left the screen.",
      "Updating React state every frame to animate: it re-renders the whole component; let CSS or SVG do the animating.",
      "Announcing every second in an `aria-live` region, or signaling the end only by color or sound: the screen reader gets noisy and people who cannot see or hear miss the notice.",
    ],
    autoteste: [
      {
        pergunta: "Why is `endsAt - Date.now()` better than decrementing a counter on every tick?",
        resposta:
          "Because `setInterval` does not guarantee its interval: ticks run late and get spaced out in background tabs. Each late tick adds error to the counter, while computing from the clock gives the right value at the moment it is read.",
      },
      {
        pergunta: "How do you pause and resume without losing time?",
        resposta:
          "When pausing, store what was left (`remainingMs`) and clear `endsAt`, which also cancels the interval through the effect’s cleanup. When resuming, set `endsAt = Date.now() + remainingMs`.",
      },
    ],
  },
};
