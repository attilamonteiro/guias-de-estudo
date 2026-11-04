import type { Pergunta } from "../../tipos";

// G23 · Ferramentas para depurar React
export const g023: Pergunta = {
  numero: 323,
  modulo: "glassdoor-react",
  metodo: "playbook",
  pt: {
    titulo: "Ferramentas para depurar React",
    pergunta: "Que ferramentas você usa para depurar seu código React?",
    porqueEsteMetodo:
      "Depurar é um processo, não uma lista de ferramentas. O playbook mostra a ordem: reproduzir, ler o erro, inspecionar o estado, isolar a causa, confirmar a correção e vigiar a produção, com a ferramenta certa em cada passo.",
    resposta30s:
      "Primeiro **leio o erro e reproduzo** o problema com os **DevTools do navegador** (console, breakpoints, aba Rede, source maps). Depois uso o **React Developer Tools** para inspecionar a árvore de componentes, props, state e hooks, e o **Profiler** para ver quem renderizou e por quê. O **StrictMode** expõe efeitos impuros em desenvolvimento, um **teste** que reproduz o bug fixa a correção e, em produção, um **rastreador de erros** com source maps cobre o que não dá para ver no navegador do usuário.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: do sintoma à correção",
        passos: [
          {
            titulo: "1. Reproduza e leia o erro",
            texto:
              "Descreva o passo a passo mínimo que causa o problema. Leia a mensagem e a pilha no console: em desenvolvimento o React dá mensagens claras (inclusive avisos sobre `key`, hooks e hidratação). Com **source maps**, a pilha aponta o arquivo e a linha originais, não o código empacotado.",
          },
          {
            titulo: "2. Inspecione com o React Developer Tools",
            texto:
              "Na aba **Components**, selecione o componente e veja props, state e hooks atuais; edite um valor para testar uma hipótese e suba a árvore para descobrir quem passou a prop errada. O componente selecionado fica disponível no console como `$r`.",
          },
          {
            titulo: "3. Pare o código onde ele erra",
            texto:
              "No navegador, use `debugger` ou um breakpoint na aba Sources. Breakpoints condicionais e logpoints evitam encher o console, e “pausar em exceções” mostra onde o erro nasce. Olhe a pilha de chamadas e o escopo para ver os valores naquele instante.",
          },
          {
            titulo: "4. Confira dados e rede",
            texto:
              "Na aba **Rede**, veja status, corpo da resposta, tempo e ordem das respostas (veja L219). Muita falha de interface é dado errado ou ausente, não um bug de React.",
          },
          {
            titulo: "5. Use o Profiler para renderizações",
            texto:
              "Grave uma interação no **Profiler** do React Developer Tools: veja os commits, a duração de cada componente e, ativando a opção, **por que** cada um renderizou (props, state, contexto ou o pai). Combine com a aba Performance do navegador para achar tarefas longas (veja L115).",
          },
          {
            titulo: "6. Exponha efeitos impuros e fixe com um teste",
            texto:
              "Em desenvolvimento, o `<StrictMode>` renderiza duas vezes e reexecuta os efeitos para mostrar renderização impura e limpeza ausente (veja C22). Reproduza o bug num **teste** (por exemplo, com a Testing Library): ele falha antes e passa depois da correção, e protege contra a volta do problema.",
          },
          {
            titulo: "7. Confirme e vigie em produção",
            texto:
              "Repita o roteiro de reprodução, compare o Profiler antes e depois, rode os testes e remova os logs temporários. Em produção, use um rastreador de erros com source maps e uma **fronteira de erro** que reporte (veja C24 e G29).",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Sintoma, primeira ferramenta e o que procurar",
        colunas: ["Sintoma", "Comece por", "O que procurar"],
        linhas: [
          [
            "A tela quebra com um erro",
            "Console e pilha, com source maps",
            "Arquivo e linha de origem; qual valor está `undefined` ou nulo",
          ],
          [
            "Valor errado na tela",
            "React Developer Tools (Components)",
            "Props e state atuais, quem passou o valor e hooks com valor velho",
          ],
          ["Dados vazios ou antigos", "Aba Rede", "Status, corpo da resposta, ordem das respostas e cache"],
          [
            "Renderiza demais ou fica lento",
            "Profiler e aba Performance",
            "Quem renderizou e por quê; tarefas longas; cálculos pesados",
          ],
          [
            "Comportamento estranho nos efeitos",
            "StrictMode e logs",
            "Efeito rodando duas vezes, falta de limpeza e dependências erradas",
          ],
          [
            "Só acontece em produção",
            "Rastreador de erros e source maps",
            "Versão, navegador, rota e os passos anteriores ao erro",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um log temporário: qual dependência mudou?",
        legenda: "JavaScript",
        codigo: `import { useEffect, useRef } from "react";

// Ferramenta de depuração temporária: mostra o que mudou entre dois renders
function useQuemMudou(nome, valores) {
  const anterior = useRef(valores);
  useEffect(() => {
    const mudou = Object.keys(valores).filter((k) => !Object.is(anterior.current[k], valores[k]));
    if (mudou.length) console.log("[" + nome + "] mudou:", mudou);
    anterior.current = valores;
  }); // sem array de dependências: roda a cada render, de propósito
}

// uso: useQuemMudou("Lista", { filtro, itens, aoSelecionar });`,
        nota: "Se uma função ou um objeto aparece como “mudou” a cada render, ele é recriado a cada render: é a pista para memoizar ou estabilizar essa referência. Remova o hook depois de usar.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra",
        texto:
          "Isole antes de mexer: reduza ao menor caso que reproduz, descubra **qual camada** erra (dado, estado, renderização, efeito, rede, ambiente) e só então corrija. Mudar código ao acaso apaga a pista.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "As ferramentas mudam com as versões",
        texto:
          "O React Developer Tools, o Profiler, o StrictMode e as bibliotecas de teste evoluem, e algumas opções mudam de nome ou de lugar. Confira react.dev e a documentação de cada ferramenta. O `console.log` serve, mas remova-o depois; um log no corpo do componente pode aparecer duas vezes por causa do StrictMode.",
      },
    ],
    armadilhas: [
      "Depurar o build de produção minificado, sem source maps: a pilha aponta para código ilegível.",
      "Tratar a duplicação de efeitos do StrictMode como bug do React: ela mostra que o efeito não limpa o que cria.",
      "Encher o código de `console.log` e esquecer de removê-los; prefira breakpoints e logpoints.",
      "Concluir cedo demais que “é um bug do React”: na maior parte dos casos o problema é o dado, um estado mutado ou a dependência de um efeito.",
    ],
    autoteste: [
      {
        pergunta: "Um componente mostra um valor antigo. Que ferramentas você usa, em que ordem?",
        resposta:
          "React Developer Tools para ver props, state e hooks atuais e quem os passou; a aba Rede para checar se o dado chegou certo; um breakpoint (ou `debugger`) para ver o valor na hora da leitura; por fim, um teste que reproduz o caso.",
      },
      {
        pergunta: "Para que serve o `<StrictMode>` ao depurar?",
        resposta:
          "Em desenvolvimento ele renderiza duas vezes e monta e desmonta os efeitos para expor renderização impura e efeitos sem limpeza. Não tem esse efeito em produção.",
      },
    ],
  },
  en: {
    titulo: "Tools for debugging React",
    pergunta: "What tools do you use for debugging your React code?",
    porqueEsteMetodo:
      "Debugging is a process, not a list of tools. The playbook shows the order: reproduce, read the error, inspect the state, isolate the cause, confirm the fix and watch production, with the right tool at each step.",
    resposta30s:
      "First I **read the error and reproduce** the problem with the **browser DevTools** (console, breakpoints, Network tab, source maps). Then I use **React Developer Tools** to inspect the component tree, props, state and hooks, and the **Profiler** to see who rendered and why. **StrictMode** exposes impure effects in development, a **test** that reproduces the bug locks in the fix and, in production, an **error tracker** with source maps covers what you cannot see in the user’s browser.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from symptom to fix",
        passos: [
          {
            titulo: "1. Reproduce and read the error",
            texto:
              "Describe the minimal steps that cause the problem. Read the message and the stack in the console: in development React gives clear messages (including warnings about `key`, hooks and hydration). With **source maps**, the stack points to the original file and line, not the bundled code.",
          },
          {
            titulo: "2. Inspect with React Developer Tools",
            texto:
              "In the **Components** tab, select the component and see its current props, state and hooks; edit a value to test a hypothesis and walk up the tree to find who passed the wrong prop. The selected component is available in the console as `$r`.",
          },
          {
            titulo: "3. Stop the code where it fails",
            texto:
              "In the browser, use `debugger` or a breakpoint in the Sources tab. Conditional breakpoints and logpoints avoid flooding the console, and “pause on exceptions” shows where the error is born. Look at the call stack and the scope to see the values at that moment.",
          },
          {
            titulo: "4. Check data and network",
            texto:
              "In the **Network** tab, look at status, response body, timing and the order of responses (see L219). Many UI failures are wrong or missing data, not a React bug.",
          },
          {
            titulo: "5. Use the Profiler for renders",
            texto:
              "Record an interaction in the React Developer Tools **Profiler**: see the commits, the duration of each component and, with the option on, **why** each one rendered (props, state, context or the parent). Combine it with the browser’s Performance tab to find long tasks (see L115).",
          },
          {
            titulo: "6. Expose impure effects and lock it in with a test",
            texto:
              "In development, `<StrictMode>` renders twice and reruns effects to show impure rendering and missing cleanup (see C22). Reproduce the bug in a **test** (for example, with Testing Library): it fails before the fix and passes after, and guards against the problem coming back.",
          },
          {
            titulo: "7. Confirm and watch production",
            texto:
              "Repeat the reproduction steps, compare the Profiler before and after, run the tests and remove temporary logs. In production, use an error tracker with source maps and an **error boundary** that reports (see C24 and G29).",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Symptom, first tool and what to look for",
        colunas: ["Symptom", "Start with", "What to look for"],
        linhas: [
          [
            "The screen breaks with an error",
            "Console and stack, with source maps",
            "Source file and line; which value is `undefined` or null",
          ],
          [
            "Wrong value on screen",
            "React Developer Tools (Components)",
            "Current props and state, who passed the value and hooks holding a stale value",
          ],
          ["Empty or old data", "Network tab", "Status, response body, order of responses and caching"],
          [
            "Renders too much or is slow",
            "Profiler and Performance tab",
            "Who rendered and why; long tasks; heavy computations",
          ],
          [
            "Strange behavior in effects",
            "StrictMode and logs",
            "An effect running twice, missing cleanup and wrong dependencies",
          ],
          [
            "Only happens in production",
            "Error tracker and source maps",
            "Version, browser, route and the steps leading up to the error",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A temporary log: which dependency changed?",
        legenda: "JavaScript",
        codigo: `import { useEffect, useRef } from "react";

// Temporary debugging tool: shows what changed between two renders
function useWhatChanged(name, values) {
  const previous = useRef(values);
  useEffect(() => {
    const changed = Object.keys(values).filter((k) => !Object.is(previous.current[k], values[k]));
    if (changed.length) console.log("[" + name + "] changed:", changed);
    previous.current = values;
  }); // no dependency array: runs on every render, on purpose
}

// usage: useWhatChanged("List", { filter, items, onSelect });`,
        nota: "If a function or an object shows up as “changed” on every render, it is recreated on every render: that is the clue to memoize or stabilize that reference. Remove the hook after using it.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule",
        texto:
          "Isolate before you touch: reduce it to the smallest case that reproduces, find **which layer** is wrong (data, state, rendering, effect, network, environment) and only then fix it. Changing code at random erases the trail.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The tools change with versions",
        texto:
          "React Developer Tools, the Profiler, StrictMode and the testing libraries evolve, and some options change name or place. Check react.dev and each tool’s documentation. `console.log` works, but remove it afterwards; a log in a component body may appear twice because of StrictMode.",
      },
    ],
    armadilhas: [
      "Debugging the minified production build without source maps: the stack points at unreadable code.",
      "Treating StrictMode’s duplicated effects as a React bug: they show that the effect does not clean up what it creates.",
      "Filling the code with `console.log` and forgetting to remove it; prefer breakpoints and logpoints.",
      "Concluding too early that “it is a React bug”: in most cases the problem is the data, a mutated state or an effect’s dependency.",
    ],
    autoteste: [
      {
        pergunta: "A component shows an old value. Which tools do you use, in what order?",
        resposta:
          "React Developer Tools to see the current props, state and hooks and who passed them; the Network tab to check the data arrived right; a breakpoint (or `debugger`) to see the value at read time; finally, a test that reproduces the case.",
      },
      {
        pergunta: "What is `<StrictMode>` for when debugging?",
        resposta:
          "In development it renders twice and mounts and unmounts effects to expose impure rendering and effects without cleanup. It does not do this in production.",
      },
    ],
  },
};
