import type { Pergunta } from "../../tipos";

// L115 · Depurar uma página React lenta
export const l115: Pergunta = {
  numero: 115,
  modulo: "linkedin-desempenho",
  metodo: "playbook",
  pt: {
    titulo: "Depurar uma página React lenta",
    pergunta: "Como você depuraria uma página React lenta?",
    porqueEsteMetodo:
      "“Está lenta” é um sintoma com muitas causas possíveis; sem ordem, você muda o que parece culpado e não descobre nada. Um playbook de diagnóstico impõe a sequência certa: reproduzir, classificar, aprofundar e medir de novo.",
    resposta30s:
      "Primeiro **reproduza e meça** o sintoma, em build de produção e em condições realistas. Depois **classifique a origem**: **rede** (requisições, bundle, imagens), **renderização** (re-renders, listas grandes, cálculos caros, estado alto demais) ou **execução no navegador** (tarefas longas, layout, JavaScript de terceiros), usando Network, Performance e o Profiler. Formule uma hipótese, **corrija um ponto por vez** e **meça de novo**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: do sintoma ao ganho comprovado",
        passos: [
          {
            titulo: "Reproduza e meça",
            texto:
              "Defina o sintoma com precisão: qual tela, qual ação e quão lenta (carregar, clicar, digitar, rolar). Reproduza em build de produção, com CPU e rede limitadas. Sinal: você tem um número e uma forma repetível de provocar o problema.",
          },
          {
            titulo: "Classifique pela primeira olhada",
            texto:
              "Grave uma passada na aba Performance e olhe o Network. Se o tempo vai para esperar respostas ou baixar arquivos, é **rede**. Se a thread principal está ocupada com scripts do React, é **renderização**. Se há tarefas longas fora do React, layout ou pintura, é **execução no navegador**. Sinal: uma das três famílias concentra a maior parte do tempo.",
          },
          {
            titulo: "Aprofunde na família certa",
            texto:
              "Use a tabela abaixo: cada família tem suas ferramentas e suas causas típicas. Entre pelas de maior impacto, não pelas mais fáceis de consertar.",
          },
          {
            titulo: "Formule uma hipótese e confirme",
            texto:
              "“O filtro renderiza a tabela inteira a cada tecla” é uma hipótese; o Profiler a confirma ou a derruba. Não corrija o que você não conseguiu apontar nas medições.",
          },
          {
            titulo: "Corrija um ponto por vez",
            texto:
              "Uma mudança, uma nova medição, nas mesmas condições. Assim você sabe o que funcionou e evita acumular otimizações que não ajudam e complicam o código.",
          },
          {
            titulo: "Fixe o ganho",
            texto:
              "Acrescente um orçamento de desempenho no CI, métricas de usuários reais em produção e, se couber, um teste que proteja o caso. Sinal: a regressão aparece antes de chegar ao usuário.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "As três famílias de lentidão",
        colunas: ["Origem", "Sinais", "Onde olhar", "Correções típicas"],
        linhas: [
          [
            "Rede",
            "Tela vazia por muito tempo, requisições em cascata, respostas grandes, imagens pesadas",
            "Aba Network (cascata, tamanhos, cache), Lighthouse, análise do bundle",
            "Paralelizar requisições, paginar, usar cache, comprimir, otimizar imagens e dividir o bundle (veja L107 e L108)",
          ],
          [
            "Renderização (React)",
            "A interface trava depois de um clique ou de uma tecla; muitos componentes renderizam sem que nada tenha mudado para eles",
            "Profiler do React DevTools (quem renderizou e por quê)",
            "Descer o estado para perto de quem o usa, `memo`, `useMemo` e `useCallback` onde a medição mostrar ganho, listas virtualizadas (veja L109), chaves estáveis, transições, React Compiler",
          ],
          [
            "Execução no navegador",
            "Tarefas longas na thread principal, rolagem engasgada, atraso para responder a toques e cliques",
            "Aba Performance (tarefas longas, layout, pintura) e a lista de scripts de terceiros",
            "Dividir trabalho pesado, mover para um Web Worker, adiar terceiros, evitar leituras e escritas de layout alternadas, reduzir o número de nós do DOM",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Uma hipótese, uma mudança, uma medição",
        texto:
          "Quem muda cinco coisas e vê a página mais rápida não sabe o que ajudou e deixa quatro mudanças inúteis no código. A ordem é sempre: medir, localizar, formular a hipótese, corrigir um ponto e medir de novo.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Meça em build de produção",
        texto:
          "O modo de desenvolvimento é mais lento por desenho (verificações extras, Strict Mode, código sem minificação) e pode mostrar problemas que o usuário não tem ou esconder os que ele tem. Compare sempre com o build de produção, de preferência com limitação de CPU próxima do pior caso real.",
      },
    ],
    armadilhas: [
      "Envolver tudo em `useMemo` e `memo` antes de medir: sem diagnóstico isso só adiciona complexidade e pode não mudar nada (veja L59).",
      "Diagnosticar no modo de desenvolvimento ou só no seu computador rápido: o problema real pode ser outro.",
      "Procurar só dentro do React: muita lentidão é rede, bundle, imagens ou script de terceiros.",
      "Corrigir vários pontos de uma vez sem saber o que funcionou, ou não deixar proteção nenhuma contra a volta do problema.",
    ],
    autoteste: [
      {
        pergunta: "Como saber rapidamente se a lentidão é de rede, de renderização ou do navegador?",
        resposta:
          "Grave uma passada na aba Performance e veja o Network: tempo esperando respostas ou arquivos aponta a rede; a thread ocupada com scripts do React aponta a renderização; tarefas longas, layout e pintura fora do React apontam a execução no navegador.",
      },
      {
        pergunta: "Por que corrigir um ponto por vez?",
        resposta:
          "Porque só assim a nova medição prova o efeito de cada mudança. Várias mudanças juntas escondem quais ajudaram e deixam código mais complexo sem ganho.",
      },
    ],
  },
  en: {
    titulo: "Debugging a slow React page",
    pergunta: "How would you debug a slow React page?",
    porqueEsteMetodo:
      "“It’s slow” is a symptom with many possible causes; without an order, you change whatever looks guilty and learn nothing. A diagnostic playbook imposes the right sequence: reproduce, classify, dig in and measure again.",
    resposta30s:
      "First **reproduce and measure** the symptom, on a production build and in realistic conditions. Then **classify the origin**: **network** (requests, bundle, images), **rendering** (re-renders, large lists, expensive calculations, state held too high) or **browser execution** (long tasks, layout, third-party JavaScript), using Network, Performance and the Profiler. Form a hypothesis, **fix one point at a time** and **measure again**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from symptom to proven gain",
        passos: [
          {
            titulo: "Reproduce and measure",
            texto:
              "Define the symptom precisely: which screen, which action and how slow (loading, clicking, typing, scrolling). Reproduce on a production build, with throttled CPU and network. Sign: you have a number and a repeatable way to trigger the problem.",
          },
          {
            titulo: "Classify at first glance",
            texto:
              "Record one pass in the Performance tab and look at Network. If the time goes to waiting for responses or downloading files, it is **network**. If the main thread is busy with React scripts, it is **rendering**. If there are long tasks outside React, layout or paint, it is **browser execution**. Sign: one of the three families holds most of the time.",
          },
          {
            titulo: "Dig into the right family",
            texto:
              "Use the table below: each family has its own tools and typical causes. Start with the highest-impact ones, not the easiest to fix.",
          },
          {
            titulo: "Form a hypothesis and confirm it",
            texto:
              "“The filter renders the whole table on every keystroke” is a hypothesis; the Profiler confirms or refutes it. Do not fix what you could not point to in the measurements.",
          },
          {
            titulo: "Fix one point at a time",
            texto:
              "One change, one new measurement, under the same conditions. That way you know what worked and avoid piling up optimizations that do not help and complicate the code.",
          },
          {
            titulo: "Lock in the gain",
            texto:
              "Add a performance budget to CI, real-user metrics in production and, where it fits, a test that protects the case. Sign: the regression shows up before it reaches the user.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "The three families of slowness",
        colunas: ["Origin", "Signs", "Where to look", "Typical fixes"],
        linhas: [
          [
            "Network",
            "A blank screen for a long time, request waterfalls, large responses, heavy images",
            "Network tab (waterfall, sizes, cache), Lighthouse, bundle analysis",
            "Parallelize requests, paginate, use caching, compress, optimize images and split the bundle (see L107 and L108)",
          ],
          [
            "Rendering (React)",
            "The interface freezes after a click or a keystroke; many components render although nothing changed for them",
            "React DevTools Profiler (who rendered and why)",
            "Move state closer to where it is used, `memo`, `useMemo` and `useCallback` where measurement shows a gain, virtualized lists (see L109), stable keys, transitions, React Compiler",
          ],
          [
            "Browser execution",
            "Long tasks on the main thread, janky scrolling, delay in responding to taps and clicks",
            "Performance tab (long tasks, layout, paint) and the list of third-party scripts",
            "Split heavy work, move it to a Web Worker, defer third parties, avoid interleaved layout reads and writes, reduce the number of DOM nodes",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "One hypothesis, one change, one measurement",
        texto:
          "Someone who changes five things and sees a faster page does not know what helped and leaves four useless changes in the code. The order is always: measure, locate, form the hypothesis, fix one point and measure again.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Measure on a production build",
        texto:
          "Development mode is slower by design (extra checks, Strict Mode, unminified code) and can show problems the user does not have or hide the ones they do. Always compare with the production build, preferably with CPU throttling close to the real worst case.",
      },
    ],
    armadilhas: [
      "Wrapping everything in `useMemo` and `memo` before measuring: without a diagnosis it only adds complexity and may change nothing (see L59).",
      "Diagnosing in development mode or only on your fast computer: the real problem may be another one.",
      "Looking only inside React: much slowness is network, bundle, images or third-party scripts.",
      "Fixing several points at once without knowing what worked, or leaving no protection against the problem coming back.",
    ],
    autoteste: [
      {
        pergunta: "How can you quickly tell whether the slowness is network, rendering or the browser?",
        resposta:
          "Record one pass in the Performance tab and check Network: time spent waiting for responses or files points to the network; the thread busy with React scripts points to rendering; long tasks, layout and paint outside React point to browser execution.",
      },
      {
        pergunta: "Why fix one point at a time?",
        resposta:
          "Because only then does the new measurement prove the effect of each change. Several changes together hide which ones helped and leave more complex code with no gain.",
      },
    ],
  },
};
