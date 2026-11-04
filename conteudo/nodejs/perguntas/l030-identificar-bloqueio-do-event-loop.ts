import type { Pergunta } from "../../tipos";

// L30 · Identificar bloqueio do laço
export const l030: Pergunta = {
  numero: 130,
  modulo: "linkedin-assincrono",
  metodo: "playbook",
  pt: {
    titulo: "Identificar bloqueio do laço",
    pergunta: "Como você identifica código que bloqueia o event loop?",
    porqueEsteMetodo:
      "Achar bloqueio é uma investigação com ordem certa: confirmar o sintoma, medir o atraso do laço, localizar o culpado no perfil e só então corrigir e medir de novo. Um playbook dá o sinal que você procura em cada passo.",
    resposta30s:
      "Bloqueio do laço aparece como **latência alta em todas as rotas ao mesmo tempo** e timers atrasados. Confirme medindo o **atraso do event loop** com `monitorEventLoopDelay` (de `node:perf_hooks`), ache o culpado com um **perfil de CPU** (`--cpu-prof`) lido como flame graph, cruzado com os logs de requisições lentas. Os suspeitos de sempre são chamadas `*Sync`, JSON enorme, regex catastrófica e laços pesados; previna com limites de entrada, streaming e worker threads, e alerte sobre o p99 do atraso.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: de “está lento” à linha culpada",
        passos: [
          {
            titulo: "Reconheça o sintoma",
            texto:
              "Todas as rotas ficam lentas juntas, timers disparam atrasados e um núcleo vai a 100% de CPU, enquanto banco e rede estão normais. Se só uma rota é lenta e a CPU está ociosa, o problema é espera de E/S, não bloqueio do laço (veja T28).",
          },
          {
            titulo: "Meça o atraso do laço",
            texto:
              "Use `monitorEventLoopDelay` (histograma) e, se quiser, `performance.eventLoopUtilization()`, ambos de `node:perf_hooks`. Critério: compare p99 e máximo com a linha de base do seu serviço e com o seu SLO; atraso alto e sustentado é o sinal.",
          },
          {
            titulo: "Correlacione com as requisições",
            texto:
              "Registre duração, rota e tamanho do corpo de cada requisição lenta. Sinal: os picos de atraso do laço coincidem com uma rota, um cliente ou um tamanho de payload.",
          },
          {
            titulo: "Perfile a CPU",
            texto:
              "Rode com `node --cpu-prof app.js` (ou conecte o Chrome DevTools com `--inspect`) e abra o `.cpuprofile` no DevTools. Procure funções largas, com muito tempo próprio (self time), que executam de forma síncrona.",
          },
          {
            titulo: "Confira os suspeitos conhecidos",
            texto:
              "Chamadas `*Sync`, `JSON.parse` ou `JSON.stringify` de objetos grandes, expressões regulares com backtracking, ordenações e laços sobre listas enormes, compressão e criptografia síncronas. Os mais comuns estão na tabela abaixo.",
          },
          {
            titulo: "Corrija e meça de novo",
            texto:
              "Troque por versão assíncrona ou stream, mova a CPU para `worker_threads` (veja L73), limite a entrada ou quebre o trabalho em pedaços. Sinal de acerto: o p99 do atraso cai e as rotas deixam de se afetar.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Medindo o atraso do laço",
        legenda: "JavaScript",
        codigo: [
          'import { monitorEventLoopDelay } from "node:perf_hooks";',
          "",
          "const histograma = monitorEventLoopDelay({ resolution: 20 }); // amostra a cada 20 ms",
          "histograma.enable();",
          "",
          "setInterval(() => {",
          "  const p99 = histograma.percentile(99) / 1e6; // o histograma vem em nanossegundos",
          "  const max = histograma.max / 1e6;",
          '  console.log(JSON.stringify({ evento: "lag_do_laco", p99_ms: p99, max_ms: max }));',
          "  histograma.reset();",
          "}, 10_000).unref();",
        ].join("\n"),
        nota: "Em produção, envie esses números como métrica (e não só como log) para poder desenhar o gráfico e criar o alerta.",
      },
      {
        tipo: "tabela",
        titulo: "Os suspeitos mais comuns",
        colunas: ["Suspeito", "Por que bloqueia", "Saída"],
        linhas: [
          [
            "`readFileSync`, `pbkdf2Sync` e outras `*Sync`",
            "Prendem a thread até terminar",
            "Versão assíncrona ou `fs/promises`; `*Sync` só na inicialização",
          ],
          [
            "`JSON.parse` ou `JSON.stringify` de objeto enorme",
            "É CPU síncrona proporcional ao tamanho",
            "Limite o corpo, pagine, use streaming ou parser incremental",
          ],
          [
            "Regex com backtracking catastrófico",
            "Uma entrada hostil faz o tempo explodir",
            "Reescreva a expressão, limite o tamanho da entrada, use outro parser",
          ],
          [
            "Laços e ordenações sobre milhares de itens",
            "Trabalho de CPU na thread principal",
            "Ceda o laço entre lotes (`setImmediate`) ou use `worker_threads`",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Prevenir em produção",
        texto:
          "Combine quatro camadas: **limites** (tamanho de corpo, tempo por requisição, paginação), **estrutura** (streaming no lugar de carregar tudo, `worker_threads` ou fila com workers para CPU pesada), **regras de lint** que proíbem `*Sync` fora da inicialização e **alerta** sobre o p99 do atraso do laço, com teste de carga usando payloads grandes antes de publicar. Para o conjunto de métricas de produção, veja L118.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O atraso mostra o sintoma, não o culpado",
        texto:
          "Um atraso alto diz que algo ocupou a thread, mas não o quê: só o perfil aponta a função. Perfile com dados e volume reais, e em produção com cuidado (uma instância, por pouco tempo), pois o perfilador também custa CPU.",
      },
    ],
    armadilhas: [
      "Olhar só a média: bloqueios esporádicos somem nela; acompanhe p99 e máximo.",
      "Confundir bloqueio com dependência lenta: banco lento deixa o laço livre e a CPU baixa, e perfilar CPU não vai ajudar.",
      "Perfilar só em desenvolvimento, com dados pequenos: o problema aparece com o payload e o volume reais.",
      "Achar que `async` resolve: uma `async function` com um laço pesado dentro continua bloqueando, pois só espera de E/S libera o laço.",
    ],
    autoteste: [
      {
        pergunta: "Que métrica indica que o event loop está bloqueado e como ela é coletada?",
        resposta:
          "O atraso (lag) do laço, coletado com `monitorEventLoopDelay` de `node:perf_hooks`, que devolve um histograma em nanossegundos. A utilização do laço (`eventLoopUtilization`) é um complemento.",
      },
      {
        pergunta: "Como descobrir qual função está bloqueando?",
        resposta:
          "Gerando um perfil de CPU (`--cpu-prof` ou DevTools com `--inspect`) e procurando no flame graph as funções largas com muito tempo próprio, cruzando com os logs das requisições lentas.",
      },
    ],
  },
  en: {
    titulo: "Finding event-loop blocking",
    pergunta: "How do you identify event-loop blocking code?",
    porqueEsteMetodo:
      "Finding blocking is an investigation with a right order: confirm the symptom, measure the loop delay, locate the culprit in the profile and only then fix and measure again. A playbook gives you the signal to look for at each step.",
    resposta30s:
      "A blocked loop shows up as **high latency on every route at once** and late timers. Confirm it by measuring the **event loop delay** with `monitorEventLoopDelay` (from `node:perf_hooks`), find the culprit with a **CPU profile** (`--cpu-prof`) read as a flame graph, cross-checked against slow-request logs. The usual suspects are `*Sync` calls, huge JSON, catastrophic regexes and heavy loops; prevent it with input limits, streaming and worker threads, and alert on the p99 of the delay.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from “it’s slow” to the guilty line",
        passos: [
          {
            titulo: "Recognize the symptom",
            texto:
              "Every route slows down together, timers fire late and one core hits 100% CPU, while the database and network look normal. If only one route is slow and the CPU is idle, the problem is waiting on I/O, not a blocked loop (see T28).",
          },
          {
            titulo: "Measure the loop delay",
            texto:
              "Use `monitorEventLoopDelay` (a histogram) and, if you like, `performance.eventLoopUtilization()`, both from `node:perf_hooks`. Criterion: compare p99 and maximum with your service’s baseline and your SLO; high, sustained delay is the signal.",
          },
          {
            titulo: "Correlate with requests",
            texto:
              "Log duration, route and body size for every slow request. Signal: the loop-delay spikes line up with one route, one client or one payload size.",
          },
          {
            titulo: "Profile the CPU",
            texto:
              "Run with `node --cpu-prof app.js` (or attach Chrome DevTools with `--inspect`) and open the `.cpuprofile` in DevTools. Look for wide functions with a lot of self time that run synchronously.",
          },
          {
            titulo: "Check the known suspects",
            texto:
              "`*Sync` calls, `JSON.parse` or `JSON.stringify` of large objects, regular expressions with backtracking, sorts and loops over huge lists, synchronous compression and cryptography. The most common ones are in the table below.",
          },
          {
            titulo: "Fix and measure again",
            texto:
              "Swap in an async version or a stream, move CPU work to `worker_threads` (see L73), limit the input or split the work into chunks. Sign of success: the p99 of the delay drops and routes stop affecting each other.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Measuring the loop delay",
        legenda: "JavaScript",
        codigo: [
          'import { monitorEventLoopDelay } from "node:perf_hooks";',
          "",
          "const histogram = monitorEventLoopDelay({ resolution: 20 }); // sample every 20 ms",
          "histogram.enable();",
          "",
          "setInterval(() => {",
          "  const p99 = histogram.percentile(99) / 1e6; // the histogram is in nanoseconds",
          "  const max = histogram.max / 1e6;",
          '  console.log(JSON.stringify({ event: "event_loop_lag", p99_ms: p99, max_ms: max }));',
          "  histogram.reset();",
          "}, 10_000).unref();",
        ].join("\n"),
        nota: "In production, send these numbers as a metric (not just a log line) so you can chart them and set up the alert.",
      },
      {
        tipo: "tabela",
        titulo: "The most common suspects",
        colunas: ["Suspect", "Why it blocks", "The way out"],
        linhas: [
          [
            "`readFileSync`, `pbkdf2Sync` and other `*Sync` calls",
            "They hold the thread until they finish",
            "Async version or `fs/promises`; `*Sync` only at startup",
          ],
          [
            "`JSON.parse` or `JSON.stringify` of a huge object",
            "Synchronous CPU work proportional to the size",
            "Limit the body, paginate, use streaming or an incremental parser",
          ],
          [
            "Regex with catastrophic backtracking",
            "A hostile input makes the time explode",
            "Rewrite the expression, cap the input size, use another parser",
          ],
          [
            "Loops and sorts over thousands of items",
            "CPU work on the main thread",
            "Yield the loop between batches (`setImmediate`) or use `worker_threads`",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Preventing it in production",
        texto:
          "Combine four layers: **limits** (body size, time per request, pagination), **structure** (streaming instead of loading everything, `worker_threads` or a queue with workers for heavy CPU), **lint rules** that forbid `*Sync` outside startup and an **alert** on the p99 of the loop delay, with a load test using large payloads before you ship. For the full set of production metrics, see L118.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The delay shows the symptom, not the culprit",
        texto:
          "A high delay says something occupied the thread, but not what: only the profile points to the function. Profile with real data and volume, and in production carefully (one instance, for a short time), because the profiler also costs CPU.",
      },
    ],
    armadilhas: [
      "Looking only at the average: sporadic blocks vanish in it; track p99 and the maximum.",
      "Confusing blocking with a slow dependency: a slow database leaves the loop free and the CPU low, and profiling the CPU will not help.",
      "Profiling only in development, with small data: the problem shows up with real payloads and volume.",
      "Thinking `async` solves it: an `async function` with a heavy loop inside still blocks, because only waiting on I/O frees the loop.",
    ],
    autoteste: [
      {
        pergunta: "Which metric shows the event loop is blocked, and how is it collected?",
        resposta:
          "The loop delay (lag), collected with `monitorEventLoopDelay` from `node:perf_hooks`, which returns a histogram in nanoseconds. Event loop utilization (`eventLoopUtilization`) is a complement.",
      },
      {
        pergunta: "How do you find which function is blocking?",
        resposta:
          "By taking a CPU profile (`--cpu-prof` or DevTools with `--inspect`) and looking in the flame graph for wide functions with a lot of self time, cross-checked against the slow-request logs.",
      },
    ],
  },
};
