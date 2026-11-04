import type { Pergunta } from "../../tipos";

// G40 · Semáforo em React
export const g040: Pergunta = {
  numero: 340,
  modulo: "glassdoor-exercicios",
  metodo: "firstprinciples",
  pt: {
    titulo: "Semáforo em React",
    pergunta: "Construa uma interface de semáforo com funcionalidade simples em React.",
    porqueEsteMetodo:
      "O semáforo parece trivial, e é por isso que a versão ingênua aparece tanto: vários booleanos, vários `if`s, timer sem limpeza. Partir da versão mais simples e consertar uma falha por vez mostra de onde vêm o estado único, a tabela de transições e o efeito com limpeza.",
    resposta30s:
      "Guarde **um único estado**, a luz ativa (`'vermelho' | 'verde' | 'amarelo'`), e descreva o comportamento em uma **tabela de transições** com a duração e a próxima luz de cada estado, no lugar de vários `if`s. Um `useEffect` que depende da luz agenda um `setTimeout` para a próxima troca e **limpa o timer** ao trocar de luz ou desmontar. Estilo e texto **derivam** do estado, e a cor nunca é o único sinal.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma restrição por vez",
        passos: [
          {
            titulo: "0. O que se quer",
            texto:
              "Três luzes, só **uma** acesa por vez, trocando sozinhas numa ordem fixa (vermelho, verde, amarelo e de volta ao vermelho), cada uma com a sua duração.",
          },
          {
            titulo: "1. A versão mais simples",
            texto:
              "Três booleanos (`vermelhoAceso`, `verdeAceso`, `amareloAceso`) e um `setInterval` de um segundo que acende uma luz e apaga as outras. → Quebra: nada impede duas luzes acesas, ou nenhuma (estados impossíveis), cada troca mexe em três valores e todos os estados duram o mesmo tempo.",
          },
          {
            titulo: "2. Um único estado",
            texto:
              "Guarde só `luz`: `'vermelho' | 'verde' | 'amarelo'`. Cada lâmpada pergunta `luz === cor`, e o estilo **deriva** daí. → Resolve: os estados impossíveis deixam de existir. → Ainda quebra: ninguém diz qual é a próxima luz nem quanto cada uma dura.",
          },
          {
            titulo: "3. A tabela de transições",
            texto:
              "Uma tabela com, para cada estado, a duração e a próxima luz (veja o código). Mudar uma duração ou inserir uma luz é editar uma linha, e não caçar `if`s espalhados. → Ainda quebra: falta quem faça o tempo andar.",
          },
          {
            titulo: "4. O efeito que faz o tempo andar",
            texto:
              "Um `setTimeout` por estado, dentro de um `useEffect` que depende de `luz`: cada troca executa o efeito de novo, agenda a próxima e a função de limpeza cancela o timer anterior. → Resolve: durações diferentes e nenhuma troca depois que o componente sai de cena. → Quebra se a limpeza faltar ou se as dependências forem `[]`: o efeito ficaria com a luz da primeira renderização.",
          },
          {
            titulo: "5. Não depender só de cor",
            texto:
              "Quem não distingue vermelho de verde, ou usa leitor de tela, precisa de outro sinal: posição fixa das luzes, texto do estado (“Pare”, “Atenção”, “Siga”) e a luz ativa marcada também por brilho ou borda. Veja o aviso abaixo.",
          },
          {
            titulo: "6. Variações e testes",
            texto:
              "O botão de pedestre vira um **evento** novo da máquina (por exemplo, um pedido guardado que encurta o verde); com mais eventos, passe para `useReducer`, em que cada ação consulta a tabela. Teste com timers falsos (`vi.useFakeTimers()` e `vi.advanceTimersByTime`): comece no vermelho, avance a duração, espere o verde e confira que desmontar cancela o timer.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A máquina de estados em um componente",
        legenda: "TSX",
        codigo: [
          'import { useEffect, useState } from "react";',
          "const CICLO = {",
          '  vermelho: { ms: 4000, proxima: "verde", texto: "Pare" },',
          '  verde: { ms: 3000, proxima: "amarelo", texto: "Siga" },',
          '  amarelo: { ms: 1000, proxima: "vermelho", texto: "Atenção" },',
          "} as const;",
          "type Luz = keyof typeof CICLO;",
          "",
          "export function Semaforo() {",
          '  const [luz, setLuz] = useState<Luz>("vermelho");',
          "  useEffect(() => {",
          "    const id = setTimeout(() => setLuz(CICLO[luz].proxima), CICLO[luz].ms);",
          "    return () => clearTimeout(id); // ao trocar de luz ou desmontar",
          "  }, [luz]);",
          "",
          "  return (",
          '    <div role="group" aria-label="Semáforo">',
          "      {(Object.keys(CICLO) as Luz[]).map((c) => <span key={c} className={c} data-acesa={c === luz} />)}",
          '      <p role="status">{CICLO[luz].texto}</p>',
          "    </div>",
          "  );",
          "}",
        ].join("\n"),
        nota: "O CSS acende a lâmpada pelo atributo `[data-acesa=true]`. As durações são exemplos e não vêm de nenhuma norma de trânsito.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A regra",
        texto:
          "Estado = **um nome**; comportamento = **uma tabela**. Com um único estado `luz` e uma tabela de transições, o efeito depende só de `luz`, o estilo e o texto derivam dele e não há `if` espalhado: adicionar uma luz ou mudar uma duração é editar uma linha. É uma **máquina de estados** finita: estados e transições explícitos tornam o impossível irrepresentável.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cor sozinha não basta",
        texto:
          'Quem não distingue vermelho de verde, ou usa leitor de tela, precisa de outro sinal: posição fixa, texto e `role="status"` com o significado atual (“Pare”). Use `aria-live` com moderação, porque um anúncio a cada troca pode ser insistente, e, se houver animação de piscar, respeite `prefers-reduced-motion`. Lembre também de que um semáforo de treino não é um semáforo real: nada aqui é controle de segurança.',
      },
    ],
    armadilhas: [
      "Vários estados paralelos (um booleano por luz) que podem divergir: aparecem duas luzes acesas ou nenhuma. Um único estado elimina a classe inteira de bugs.",
      "Esquecer a limpeza do timer: timers órfãos disparam depois da troca ou da desmontagem, e o StrictMode, que executa o efeito duas vezes em desenvolvimento, ajuda a expor o erro.",
      "Usar `[]` como dependências e ler `luz` de dentro do `setInterval` ou `setTimeout`: o callback fica preso à primeira renderização (closure obsoleta) e a luz não avança além da primeira troca.",
      "Mostrar só a cor da lâmpada como informação: quem tem daltonismo ou usa leitor de tela fica sem o estado atual.",
    ],
    autoteste: [
      {
        pergunta: "Por que o efeito depende de `[luz]` e usa `setTimeout` em vez de um único `setInterval`?",
        resposta:
          "Porque cada estado tem a sua duração: a cada troca o efeito é executado de novo, agenda um timer com a duração da nova luz e a limpeza cancela o anterior. Um `setInterval` teria período único ou exigiria recriá-lo a cada troca.",
      },
      {
        pergunta: "Como acrescentar um botão de pedestre sem espalhar `if`s?",
        resposta:
          "Trate o clique como um evento da máquina: guarde o pedido (por exemplo, `pedido: true`) e consulte-o na transição, encurtando o verde ou indo ao amarelo mais cedo. Com mais de um evento, use `useReducer` com ações (`avancar`, `pedirTravessia`) que consultam a tabela de transições.",
      },
    ],
  },
  en: {
    titulo: "React traffic light",
    pergunta: "Build a traffic light UI with simple functionality in React.",
    porqueEsteMetodo:
      "A traffic light looks trivial, which is why the naive version shows up so often: several booleans, several `if`s, a timer with no cleanup. Starting from the simplest version and fixing one flaw at a time shows where the single state, the transition table and the effect with cleanup come from.",
    resposta30s:
      "Keep **a single state**, the active light (`'red' | 'green' | 'yellow'`), and describe the behavior in a **transition table** holding each state’s duration and next light, instead of several `if`s. A `useEffect` that depends on the light schedules a `setTimeout` for the next switch and **clears the timer** when the light changes or the component unmounts. Style and text **derive** from the state, and color is never the only signal.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one constraint at a time",
        passos: [
          {
            titulo: "0. What you want",
            texto:
              "Three lights, only **one** lit at a time, switching on their own in a fixed order (red, green, yellow and back to red), each with its own duration.",
          },
          {
            titulo: "1. The simplest version",
            texto:
              "Three booleans (`redOn`, `greenOn`, `yellowOn`) and a one-second `setInterval` that lights one lamp and turns the others off. → Breaks: nothing prevents two lights on, or none (impossible states), each switch touches three values and every state lasts the same time.",
          },
          {
            titulo: "2. A single state",
            texto:
              "Store only `light`: `'red' | 'green' | 'yellow'`. Each lamp asks `light === color`, and the style **derives** from that. → Fixes: impossible states stop existing. → Still breaks: nobody says which light comes next or how long each lasts.",
          },
          {
            titulo: "3. The transition table",
            texto:
              "A table holding, for each state, the duration and the next light (see the code). Changing a duration or adding a light means editing one row instead of hunting for scattered `if`s. → Still breaks: nothing makes time move.",
          },
          {
            titulo: "4. The effect that makes time move",
            texto:
              "One `setTimeout` per state, inside a `useEffect` that depends on `light`: each switch runs the effect again, schedules the next one and the cleanup function cancels the previous timer. → Fixes: different durations and no switching after the component leaves. → Breaks if the cleanup is missing or the dependencies are `[]`: the effect would keep the first render’s light.",
          },
          {
            titulo: "5. Not relying on color alone",
            texto:
              "People who cannot tell red from green, or who use a screen reader, need another signal: fixed light positions, a state text (“Stop”, “Caution”, “Go”) and the active light also marked by brightness or border. See the warning below.",
          },
          {
            titulo: "6. Variations and tests",
            texto:
              "A pedestrian button becomes a new **event** of the machine (for example, a stored request that shortens the green); with more events, move to `useReducer`, where each action consults the table. Test with fake timers (`vi.useFakeTimers()` and `vi.advanceTimersByTime`): start on red, advance the duration, expect green and check that unmounting cancels the timer.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The state machine in one component",
        legenda: "TSX",
        codigo: [
          'import { useEffect, useState } from "react";',
          "const CYCLE = {",
          '  red: { ms: 4000, next: "green", text: "Stop" },',
          '  green: { ms: 3000, next: "yellow", text: "Go" },',
          '  yellow: { ms: 1000, next: "red", text: "Caution" },',
          "} as const;",
          "type Light = keyof typeof CYCLE;",
          "",
          "export function TrafficLight() {",
          '  const [light, setLight] = useState<Light>("red");',
          "  useEffect(() => {",
          "    const id = setTimeout(() => setLight(CYCLE[light].next), CYCLE[light].ms);",
          "    return () => clearTimeout(id); // on light change or unmount",
          "  }, [light]);",
          "",
          "  return (",
          '    <div role="group" aria-label="Traffic light">',
          "      {(Object.keys(CYCLE) as Light[]).map((c) => <span key={c} className={c} data-lit={c === light} />)}",
          '      <p role="status">{CYCLE[light].text}</p>',
          "    </div>",
          "  );",
          "}",
        ].join("\n"),
        nota: "The CSS lights the lamp through the `[data-lit=true]` attribute. The durations are examples and do not come from any traffic regulation.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The rule",
        texto:
          "State = **a name**; behavior = **a table**. With a single `light` state and a transition table, the effect depends only on `light`, the style and the text derive from it and there is no scattered `if`: adding a light or changing a duration means editing one row. It is a finite **state machine**: explicit states and transitions make the impossible unrepresentable.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Color alone is not enough",
        texto:
          'People who cannot tell red from green, or who use a screen reader, need another signal: fixed position, text and a `role="status"` with the current meaning (“Stop”). Use `aria-live` sparingly, because an announcement on every switch can be insistent, and, if there is a blinking animation, respect `prefers-reduced-motion`. Also remember that a practice traffic light is not a real one: nothing here is a safety control.',
      },
    ],
    armadilhas: [
      "Several parallel states (one boolean per light) that can diverge: you get two lights on, or none. A single state removes that whole class of bugs.",
      "Forgetting the timer cleanup: orphaned timers fire after a switch or an unmount, and StrictMode, which runs the effect twice in development, helps expose the bug.",
      "Using `[]` as dependencies and reading `light` from inside `setInterval` or `setTimeout`: the callback is stuck on the first render (a stale closure) and the light never moves past the first switch.",
      "Showing only the lamp’s color as information: people with color blindness or screen readers lose the current state.",
    ],
    autoteste: [
      {
        pergunta: "Why does the effect depend on `[light]` and use `setTimeout` instead of a single `setInterval`?",
        resposta:
          "Because each state has its own duration: on every switch the effect runs again, schedules a timer with the new light’s duration and the cleanup cancels the previous one. A `setInterval` would have a single period or would have to be recreated on every switch.",
      },
      {
        pergunta: "How do you add a pedestrian button without scattering `if`s?",
        resposta:
          "Treat the click as an event of the machine: store the request (for example, `requested: true`) and check it in the transition, shortening the green or going to yellow earlier. With more than one event, use `useReducer` with actions (`advance`, `requestCrossing`) that consult the transition table.",
      },
    ],
  },
};
