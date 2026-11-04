import type { Pergunta } from "../../tipos";

// D37 · Benchmark e teste de carga
export const d037: Pergunta = {
  numero: 337,
  modulo: "devinterview-testes-e-dados",
  metodo: "playbook",
  pt: {
    titulo: "Benchmark e teste de carga",
    pergunta: "Por que o benchmarking é importante no Node.js?",
    porqueEsteMetodo:
      "Medir desempenho só vale quando o procedimento é confiável: um número tirado do ambiente errado engana mais do que ajuda. Um playbook mostra a ordem certa, do objetivo à leitura dos percentis, e os cuidados em cada passo.",
    resposta30s:
      "Benchmarking é importante porque, sem medir, otimizar é **palpite**: o gargalo real raramente está onde se imagina. Medir evita otimização prematura, **detecta regressões** (um commit que piorou a latência) e dá base para **planejar capacidade** (quanto uma instância aguenta e quando escalar). Faça a diferença entre o **micro-benchmark** (esta função ficou mais rápida?) e o **teste de carga** (o sistema aguenta o tráfego esperado?), e leia sempre os percentis, não só a média.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: um teste de carga confiável",
        passos: [
          {
            titulo: "Defina a pergunta e a meta",
            texto:
              "“A API aguenta 500 requisições por segundo com p99 abaixo de 300 ms?” ou “esta mudança piorou a latência?”. Sem meta numérica (ligada a uma necessidade do negócio), o resultado não decide nada.",
          },
          {
            titulo: "Monte um ambiente estável e parecido com produção",
            texto:
              "Mesma versão do Node.js, build de produção (`NODE_ENV=production`), mesmos limites de CPU e memória do contêiner, banco com volume de dados realista e nada mais disputando a máquina. Sinal de acerto: duas execuções seguidas dão resultados próximos.",
          },
          {
            titulo: "Prepare tráfego realista",
            texto:
              "Misture rotas, tamanhos de corpo e usuários como em produção (com dados anonimizados). A mesma requisição repetida acerta sempre o cache e uma tabela vazia faz toda consulta parecer rápida.",
          },
          {
            titulo: "Aqueça e escolha o modelo de carga",
            texto:
              "Rode um período de aquecimento (compilação JIT do V8, caches, pools de conexão) e descarte-o. Depois escolha: carga **fechada** (N usuários virtuais, cada um espera a resposta antes de enviar a próxima) ou **aberta** (chegam X requisições por segundo, esteja o servidor lento ou não), que se parece mais com tráfego real.",
          },
          {
            titulo: "Suba a carga em degraus",
            texto:
              "Aumente aos poucos até achar o ponto em que a latência dispara (o “joelho” da curva). Depois mantenha a carga esperada por bastante tempo (um teste de resistência) para expor vazamentos de memória e degradação lenta.",
          },
          {
            titulo: "Observe o servidor por dentro",
            texto:
              "Durante o teste, acompanhe CPU, memória, o atraso do laço de eventos (veja L30), conexões em uso no pool e as dependências, principalmente o banco. O gerador de carga só diz que está lento; o servidor diz por quê.",
          },
          {
            titulo: "Leia por percentil e compare com uma linha de base",
            texto:
              "Olhe p50, p95, p99 e a taxa de erro, repita algumas vezes e mude uma coisa por vez. Guarde os números e compare a cada mudança importante; no CI, um teste curto pode avisar de regressões.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Ferramentas comuns",
        colunas: ["Ferramenta", "Serve para", "Bom saber"],
        linhas: [
          [
            "`console.time` / `performance.now()` / `perf_hooks`",
            "Medir o tempo de um trecho de código",
            "Simples, mas sujeito a ruído de JIT e do sistema; repita e use bibliotecas de micro-benchmark (como o `tinybench`) para estatística",
          ],
          [
            "autocannon",
            "Gerar carga HTTP a partir da linha de comando ou de um script Node.js",
            "Instala com `npm`, mostra latência por percentil; ótimo para um teste rápido",
          ],
          [
            "wrk",
            "Gerar carga HTTP com muita vazão a partir de poucos recursos",
            "Escrito em C; cenários mais elaborados exigem scripts em Lua",
          ],
          [
            "k6",
            "Teste de carga com cenários em JavaScript, rampas e limiares de aprovação",
            "O executor não é o Node.js; bom para rodar no CI com limites que reprovam a execução",
          ],
          [
            "Artillery",
            "Cenários de usuário com várias requisições encadeadas, descritos em YAML",
            "Bom para fluxos (login, carrinho, pagamento) e para WebSocket",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Medir o atraso do laço de eventos durante o teste",
        legenda: "JavaScript",
        codigo: [
          'import { monitorEventLoopDelay } from "node:perf_hooks";',
          "",
          "const atraso = monitorEventLoopDelay({ resolution: 20 });",
          "atraso.enable();",
          "",
          "setInterval(() => {",
          "  console.log({",
          "    p99AtrasoMs: atraso.percentile(99) / 1e6, // o histograma vem em nanossegundos",
          "    rssMB: Math.round(process.memoryUsage().rss / 1e6),",
          "  });",
          "  atraso.reset();",
          "}, 5000).unref();",
        ].join("\n"),
        nota: "Rode isso dentro do servidor testado e compare com a latência vista pelo gerador de carga. Atraso do laço alto com CPU em 100% aponta para trabalho síncrono no JavaScript.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Três perguntas, três instrumentos",
        texto:
          "O **micro-benchmark** responde “esta função é mais rápida que aquela?”. O **teste de carga** responde “o sistema aguenta o tráfego esperado e onde ele quebra?”. O **perfil** (CPU e memória) responde “para onde vai o tempo?”. Meça antes de otimizar e meça de novo depois: a otimização que não aparece nos números não aconteceu. Quem mede evita gastar a semana acelerando o que não era o gargalo.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Os erros que invalidam o resultado",
        texto:
          "A **média** esconde a cauda: com p50 de 40 ms, o p99 pode estar em dois segundos, e é ele que o usuário azarado vê. O **gerador de carga na mesma máquina** do servidor disputa CPU com ele, e você acaba medindo o teste. Um **micro-benchmark sem aquecimento**, ou cujo resultado ninguém usa, deixa o V8 otimizar ou eliminar o código, e o número não significa nada. E nunca dispare carga pesada contra produção ou contra serviços de terceiros sem combinar.",
      },
    ],
    armadilhas: [
      "Reportar só a média: ela esconde a cauda lenta, e o p99 é o que o usuário azarado sente.",
      "Rodar o gerador de carga na mesma máquina do servidor, ou por uma rede local irreal: você mede o teste, não o sistema.",
      "Usar dados irreais, como uma única requisição repetida ou uma tabela quase vazia: o cache e os índices escondem o custo de produção.",
      "Medir uma função sem aquecimento e sem usar o resultado: o V8 pode otimizar ou eliminar o trabalho, e o número fica sem sentido.",
    ],
    autoteste: [
      {
        pergunta: "Por que olhar o p99 em vez da média?",
        resposta:
          "A média mistura as requisições rápidas com as lentas e esconde a cauda. O p99 mostra o tempo abaixo do qual 99% das requisições terminam, ou seja, o que os usuários mais azarados sentem. Uma média boa pode conviver com um p99 inaceitável.",
      },
      {
        pergunta: "Qual é a diferença entre carga fechada e aberta, e por que importa?",
        resposta:
          "Na carga fechada, cada usuário virtual espera a resposta antes de pedir de novo: se o servidor desacelera, o teste também desacelera e esconde o problema. Na aberta, as requisições chegam a uma taxa fixa, e uma lentidão faz a fila crescer, como acontece com milhares de usuários independentes.",
      },
    ],
  },
  en: {
    titulo: "Benchmarking and load testing",
    pergunta: "Why is benchmarking important in Node.js?",
    porqueEsteMetodo:
      "Measuring performance only pays off when the procedure is reliable: a number taken in the wrong environment misleads more than it helps. A playbook shows the right order, from goal to reading percentiles, and the care needed at each step.",
    resposta30s:
      "Benchmarking matters because without measuring, optimizing is **guesswork**: the real bottleneck is rarely where you think. Measuring avoids premature optimization, **catches regressions** (a commit that worsened latency) and gives a basis for **capacity planning** (how much one instance handles and when to scale). Tell the **micro-benchmark** (did this function get faster?) apart from the **load test** (does the system handle the expected traffic?), and always read percentiles, not just the average.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: a reliable load test",
        passos: [
          {
            titulo: "Define the question and the target",
            texto:
              "“Does the API handle 500 requests per second with p99 under 300 ms?” or “did this change make latency worse?”. Without a numeric target (tied to a business need), the result decides nothing.",
          },
          {
            titulo: "Build a stable environment that resembles production",
            texto:
              "Same Node.js version, production build (`NODE_ENV=production`), the same CPU and memory limits as the container, a database with realistic data volume and nothing else competing for the machine. Sign of success: two runs in a row give close results.",
          },
          {
            titulo: "Prepare realistic traffic",
            texto:
              "Mix routes, body sizes and users the way production does (with anonymized data). The same request repeated always hits the cache, and an empty table makes every query look fast.",
          },
          {
            titulo: "Warm up and choose the load model",
            texto:
              "Run a warm-up period (V8’s JIT compilation, caches, connection pools) and discard it. Then choose: **closed** load (N virtual users, each waits for the response before sending the next) or **open** load (X requests per second arrive whether the server is slow or not), which looks more like real traffic.",
          },
          {
            titulo: "Raise the load in steps",
            texto:
              "Increase gradually until you find the point where latency takes off (the “knee” of the curve). Then hold the expected load for a long time (a soak test) to expose memory leaks and slow degradation.",
          },
          {
            titulo: "Watch the server from the inside",
            texto:
              "During the test, track CPU, memory, event loop delay (see L30), connections in use in the pool and the dependencies, mainly the database. The load generator only says it is slow; the server says why.",
          },
          {
            titulo: "Read by percentile and compare with a baseline",
            texto:
              "Look at p50, p95, p99 and the error rate, repeat a few times and change one thing at a time. Keep the numbers and compare after each important change; in CI, a short test can warn about regressions.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Common tools",
        colunas: ["Tool", "What it is for", "Good to know"],
        linhas: [
          [
            "`console.time` / `performance.now()` / `perf_hooks`",
            "Timing a piece of code",
            "Simple, but subject to JIT and system noise; repeat it and use micro-benchmark libraries (such as `tinybench`) for statistics",
          ],
          [
            "autocannon",
            "Generating HTTP load from the command line or a Node.js script",
            "Installs with `npm`, shows latency by percentile; great for a quick test",
          ],
          [
            "wrk",
            "Generating high-throughput HTTP load from few resources",
            "Written in C; more elaborate scenarios need Lua scripts",
          ],
          [
            "k6",
            "Load testing with JavaScript scenarios, ramps and pass/fail thresholds",
            "The runner is not Node.js; good in CI with limits that fail the run",
          ],
          [
            "Artillery",
            "User scenarios with several chained requests, described in YAML",
            "Good for flows (login, cart, payment) and for WebSocket",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Measure event loop delay during the test",
        legenda: "JavaScript",
        codigo: [
          'import { monitorEventLoopDelay } from "node:perf_hooks";',
          "",
          "const delay = monitorEventLoopDelay({ resolution: 20 });",
          "delay.enable();",
          "",
          "setInterval(() => {",
          "  console.log({",
          "    p99DelayMs: delay.percentile(99) / 1e6, // the histogram is in nanoseconds",
          "    rssMB: Math.round(process.memoryUsage().rss / 1e6),",
          "  });",
          "  delay.reset();",
          "}, 5000).unref();",
        ].join("\n"),
        nota: "Run this inside the server under test and compare it with the latency the load generator sees. High loop delay with CPU at 100% points to synchronous work in JavaScript.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Three questions, three instruments",
        texto:
          "The **micro-benchmark** answers “is this function faster than that one?”. The **load test** answers “does the system handle the expected traffic, and where does it break?”. The **profile** (CPU and memory) answers “where does the time go?”. Measure before optimizing and measure again afterward: an optimization that does not show up in the numbers did not happen. Measuring spares you from spending the week speeding up what was not the bottleneck.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The mistakes that invalidate the result",
        texto:
          "The **average** hides the tail: with a p50 of 40 ms, the p99 may be two seconds, and that is what the unlucky user sees. A **load generator on the same machine** as the server competes for CPU with it, and you end up measuring the test. A **micro-benchmark without warm-up**, or whose result nobody uses, lets V8 optimize or eliminate the code, and the number means nothing. And never fire heavy load at production or at third-party services without agreement.",
      },
    ],
    armadilhas: [
      "Reporting only the average: it hides the slow tail, and p99 is what the unlucky user feels.",
      "Running the load generator on the same machine as the server, or over an unrealistic local network: you measure the test, not the system.",
      "Using unrealistic data, like a single repeated request or an almost empty table: caches and indexes hide the production cost.",
      "Timing a function without warm-up and without using the result: V8 may optimize or eliminate the work, and the number becomes meaningless.",
    ],
    autoteste: [
      {
        pergunta: "Why look at p99 instead of the average?",
        resposta:
          "The average mixes fast and slow requests and hides the tail. p99 shows the time under which 99% of requests finish, that is, what the unluckiest users feel. A good average can coexist with an unacceptable p99.",
      },
      {
        pergunta: "What is the difference between closed and open load, and why does it matter?",
        resposta:
          "In closed load, each virtual user waits for the response before asking again: if the server slows down, the test slows down too and hides the problem. In open load, requests arrive at a fixed rate and slowness makes the queue grow, as it does with thousands of independent users.",
      },
    ],
  },
};
