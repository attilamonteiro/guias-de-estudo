import type { Pergunta } from "../../tipos";

// L114 · Perfilar uma aplicação React
export const l114: Pergunta = {
  numero: 114,
  modulo: "linkedin-desempenho",
  metodo: "compare",
  pt: {
    titulo: "Perfilar uma aplicação React",
    pergunta: "Como você faz o profiling de uma aplicação React?",
    porqueEsteMetodo:
      "Cada ferramenta responde a uma pergunta diferente: o Profiler vê componentes, a aba Performance vê o navegador, o Lighthouse vê o carregamento e o monitoramento vê os usuários reais. A matriz as coloca lado a lado e a regra de decisão diz por onde começar.",
    resposta30s:
      "Perfilar é **medir antes de otimizar**, com a ferramenta certa para o sintoma: o **Profiler do React DevTools** mostra quais componentes renderizaram, por quê e quanto custou; a aba **Performance** do navegador mostra tarefas longas, layout e pintura; o **Lighthouse** audita o carregamento e os Web Vitals; e o **monitoramento em produção** mostra o que usuários reais sentem. Grave **uma interação específica**, em **build de produção ou de profiling** (o modo de desenvolvimento distorce os números), e compare antes e depois.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Cada ferramenta responde a uma pergunta",
        colunas: ["Ferramenta", "Responde a", "Use quando", "Limite"],
        linhas: [
          [
            "Profiler do React DevTools (e o componente `<Profiler>`)",
            "Quais componentes renderizaram em cada commit, quanto custaram e por que renderizaram",
            "Interação lenta, suspeita de re-renders desnecessários, componente caro",
            "Não vê rede, layout nem pintura do navegador; no modo de desenvolvimento os tempos são inflados",
          ],
          [
            "Aba Performance do navegador",
            "O que a thread principal fez ao longo do tempo: scripts, tarefas longas, layout, pintura, rede",
            "Travamentos, rolagem engasgada, resposta lenta a cliques, JavaScript de terceiros",
            "Mostra o React em baixo nível; nomes minificados pedem source maps",
          ],
          [
            "Lighthouse",
            "Auditoria sintética do carregamento: LCP, CLS, tempo bloqueado e sugestões",
            "Visão geral de uma página, regressões na integração contínua",
            "Ambiente simulado e uma carga só; não cobre interações nem usuários reais",
          ],
          [
            "Análise do bundle",
            "O que compõe o JavaScript entregue e quanto pesa",
            "Carregamento inicial lento (veja L107)",
            "Mostra tamanho, não tempo de execução",
          ],
          [
            "Monitoramento em produção (dados de usuários reais)",
            "Web Vitals e erros reais, por dispositivo, rede e página",
            "Confirmar que o problema existe, priorizar e checar se a correção funcionou",
            "Mostra o sintoma e a tendência, não a causa; é preciso das outras ferramentas para diagnosticar",
          ],
        ],
        nota: "Versões recentes do React também publicam trilhas próprias na aba Performance do Chrome (em desenvolvimento e em builds de profiling); confira react.dev para o estado atual.",
      },
      {
        tipo: "passos",
        titulo: "Como gravar e ler um registro do Profiler",
        passos: [
          {
            titulo: "Prepare o ambiente",
            texto:
              "Use um build de produção ou de profiling (frameworks costumam ter uma opção de build para isso; confira a documentação), desligue extensões e, na aba Performance, limite CPU e rede para imitar um aparelho comum. Sinal: a lentidão que o usuário sente aparece também na sua máquina.",
          },
          {
            titulo: "Grave uma interação só",
            texto:
              "Na aba Profiler, clique em gravar, faça a ação suspeita (digitar, abrir um filtro, trocar de aba) e pare. Registros curtos têm poucos commits e são fáceis de ler. Ative a opção de registrar por que cada componente renderizou.",
          },
          {
            titulo: "Leia os commits",
            texto:
              "Cada barra no topo é um commit (uma atualização aplicada ao DOM); as mais altas e de cor mais quente são as mais lentas. Compare o tempo do commit com o orçamento de um quadro (cerca de 16 ms para 60 quadros por segundo).",
          },
          {
            titulo: "Flamegraph e ranked",
            texto:
              "O **flamegraph** mostra a árvore: a largura de cada barra é o tempo daquele componente com os filhos, e os cinzas não renderizaram nesse commit. O **ranked** ordena do mais lento para o mais rápido e vai direto ao culpado. Clique no componente para ver o motivo (props, estado, Hook ou renderização do pai).",
          },
          {
            titulo: "Cruze com o resto e repita",
            texto:
              "Se o commit é rápido mas a tela trava, o problema está fora do React: abra a aba Performance e procure tarefas longas, layout e terceiros. Faça uma mudança, grave a mesma interação de novo e compare.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Escolha pelo sintoma. **A página demora a aparecer**: Lighthouse, Network e análise do bundle. **A interação é lenta ou trava**: grave com o Profiler e com a aba Performance. **Só alguns usuários reclamam**: monitoramento em produção, para achar o perfil (dispositivo, rede, página). Nenhuma ferramenta basta sozinha: o Profiler diz quem renderizou, e a aba Performance diz o que o navegador fez com isso.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não meça só no modo de desenvolvimento",
        texto:
          "O modo de desenvolvimento do React faz verificações extras (inclusive renderizações duplicadas no Strict Mode), não minifica e é mais lento, então os números exageram e podem apontar problemas que o usuário não tem. Sua máquina também costuma ser mais rápida que a média: use limitação de CPU. E meça uma interação por vez, depois da primeira (a primeira inclui aquecimento e carregamento de código).",
      },
    ],
    armadilhas: [
      "Medir só em modo de desenvolvimento e tomar o resultado como verdade: os tempos são inflados e há renderizações extras do Strict Mode.",
      "Gravar a página inteira por minutos: o registro fica enorme e o ponto ruim se perde; grave a interação específica.",
      "Otimizar o componente mais largo do flamegraph sem olhar o motivo da renderização: ele pode ter renderizado só porque o pai renderizou.",
      "Confiar numa ferramenta só: o Lighthouse não mostra interações e o Profiler não mostra rede nem layout.",
    ],
    autoteste: [
      {
        pergunta: "Que tipo de problema o Profiler do React DevTools não ajuda a achar?",
        resposta:
          "Problemas fora da renderização do React: rede, tamanho do bundle, layout e pintura, tarefas longas de scripts de terceiros. Para eles, use o Network, a aba Performance e a análise do bundle.",
      },
      {
        pergunta: "Por que gravar uma interação específica, em build de produção ou de profiling?",
        resposta:
          "Porque um registro curto isola o commit que importa, e um build fiel ao que o usuário recebe evita números distorcidos pelas verificações e pela falta de minificação do modo de desenvolvimento.",
      },
    ],
  },
  en: {
    titulo: "Profiling a React application",
    pergunta: "How do you profile a React application?",
    porqueEsteMetodo:
      "Each tool answers a different question: the Profiler sees components, the Performance tab sees the browser, Lighthouse sees loading and monitoring sees real users. The matrix puts them side by side and the decision rule says where to start.",
    resposta30s:
      "Profiling is **measuring before optimizing**, with the right tool for the symptom: the **React DevTools Profiler** shows which components rendered, why and how much it cost; the browser’s **Performance** tab shows long tasks, layout and paint; **Lighthouse** audits loading and Web Vitals; and **production monitoring** shows what real users feel. Record **one specific interaction**, on a **production or profiling build** (development mode distorts the numbers), and compare before and after.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Each tool answers a different question",
        colunas: ["Tool", "Answers", "Use it when", "Limit"],
        linhas: [
          [
            "React DevTools Profiler (and the `<Profiler>` component)",
            "Which components rendered in each commit, what they cost and why they rendered",
            "A slow interaction, suspected unnecessary re-renders, an expensive component",
            "It does not see the network, layout or paint; in development mode the timings are inflated",
          ],
          [
            "Browser Performance tab",
            "What the main thread did over time: scripts, long tasks, layout, paint, network",
            "Freezes, janky scrolling, slow response to clicks, third-party JavaScript",
            "Shows React at a low level; minified names need source maps",
          ],
          [
            "Lighthouse",
            "A synthetic audit of loading: LCP, CLS, blocking time and suggestions",
            "An overview of a page, regressions in continuous integration",
            "Simulated environment and a single load; does not cover interactions or real users",
          ],
          [
            "Bundle analysis",
            "What makes up the shipped JavaScript and how much it weighs",
            "Slow initial loading (see L107)",
            "Shows size, not execution time",
          ],
          [
            "Production monitoring (real-user data)",
            "Web Vitals and real errors, by device, network and page",
            "Confirming the problem exists, prioritizing, and checking that the fix worked",
            "Shows the symptom and the trend, not the cause; you need the other tools to diagnose",
          ],
        ],
        nota: "Recent React versions also publish their own tracks in Chrome’s Performance tab (in development and profiling builds); check react.dev for the current state.",
      },
      {
        tipo: "passos",
        titulo: "How to record and read a Profiler trace",
        passos: [
          {
            titulo: "Prepare the environment",
            texto:
              "Use a production or profiling build (frameworks usually have a build option for this; check the documentation), turn off extensions and, in the Performance tab, throttle CPU and network to imitate an ordinary device. Sign: the slowness users feel shows up on your machine too.",
          },
          {
            titulo: "Record a single interaction",
            texto:
              "In the Profiler tab, click record, perform the suspect action (typing, opening a filter, switching tabs) and stop. Short recordings have few commits and are easy to read. Turn on the option to record why each component rendered.",
          },
          {
            titulo: "Read the commits",
            texto:
              "Each bar at the top is a commit (an update applied to the DOM); the taller, warmer-coloured ones are the slowest. Compare the commit time with the budget of one frame (about 16 ms for 60 frames per second).",
          },
          {
            titulo: "Flamegraph and ranked",
            texto:
              "The **flamegraph** shows the tree: each bar’s width is that component’s time including its children, and grey ones did not render in this commit. The **ranked** view sorts from slowest to fastest and goes straight to the culprit. Click a component to see the reason (props, state, a Hook, or the parent rendering).",
          },
          {
            titulo: "Cross-check and repeat",
            texto:
              "If the commit is fast but the screen freezes, the problem is outside React: open the Performance tab and look for long tasks, layout and third parties. Make one change, record the same interaction again and compare.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Choose by symptom. **The page is slow to appear**: Lighthouse, Network and bundle analysis. **The interaction is slow or freezes**: record with the Profiler and the Performance tab. **Only some users complain**: production monitoring, to find the profile (device, network, page). No tool is enough on its own: the Profiler says who rendered, and the Performance tab says what the browser did with that.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Do not measure only in development mode",
        texto:
          "React’s development mode runs extra checks (including double renders in Strict Mode), does not minify and is slower, so the numbers are exaggerated and can point at problems the user does not have. Your machine is also usually faster than average: use CPU throttling. And measure one interaction at a time, after the first one (the first includes warm-up and code loading).",
      },
    ],
    armadilhas: [
      "Measuring only in development mode and taking the result as truth: timings are inflated and Strict Mode adds extra renders.",
      "Recording the whole page for minutes: the trace becomes huge and the bad moment gets lost; record the specific interaction.",
      "Optimizing the widest component in the flamegraph without checking why it rendered: it may have rendered only because its parent did.",
      "Trusting a single tool: Lighthouse does not show interactions and the Profiler does not show the network or layout.",
    ],
    autoteste: [
      {
        pergunta: "What kind of problem does the React DevTools Profiler not help you find?",
        resposta:
          "Problems outside React’s rendering: network, bundle size, layout and paint, long tasks from third-party scripts. For those, use Network, the Performance tab and bundle analysis.",
      },
      {
        pergunta: "Why record one specific interaction, on a production or profiling build?",
        resposta:
          "Because a short recording isolates the commit that matters, and a build faithful to what the user receives avoids numbers distorted by the extra checks and the lack of minification in development mode.",
      },
    ],
  },
};
