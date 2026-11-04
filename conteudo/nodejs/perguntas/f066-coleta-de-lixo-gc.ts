import type { Pergunta } from "../../tipos";

// F66 · Coleta de lixo (GC)
export const f066: Pergunta = {
  numero: 466,
  modulo: "founditgulf-avancadas",
  metodo: "feynman",
  pt: {
    titulo: "Coleta de lixo (GC)",
    pergunta: "Como funciona a coleta de lixo no Node.js?",
    porqueEsteMetodo:
      "A coleta de lixo é invisível até dar problema, e a imagem de uma faxina na mesa de trabalho torna a regra intuitiva: o que ainda está ligado a você fica, o resto vai embora. Depois vêm o mecanismo real do V8 e o ponto em que a imagem para de valer, que é exatamente o vazamento.",
    resposta30s:
      "O Node.js usa a coleta de lixo do **V8**, que libera um objeto quando ele **não é mais alcançável** a partir das raízes (escopos ativos e globais). O heap é **geracional**: um **espaço novo** pequeno, limpo com frequência (*scavenge*), e um **espaço antigo**, limpo por *mark-sweep* e compactação, em boa parte de forma incremental e concorrente para manter as pausas curtas. Quem causa vazamento é **referência ainda viva**, e um GC pesado aparece como latência.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense na faxina de uma mesa de trabalho. Os papéis em uso estão na sua mão, e cada papel pode apontar para outras pastas (“veja a pasta de contratos”). O faxineiro começa pelo que está na sua mão, segue todas as indicações e marca o que alcança. Tudo o que ninguém consegue alcançar é lixo e vai embora, sem você avisar. Como a maioria dos papéis é rascunho de vida curta, ele varre a bandeja de rascunhos com frequência e rapidez, e só de vez em quando arruma a gaveta dos documentos de longo prazo.",
        tecnico:
          "O V8 decide por **alcançabilidade**: um objeto é lixo quando não há caminho até ele a partir das **raízes** (variáveis de escopos ativos, globais, pilha de chamadas). Não é contagem de referências, então ciclos entre objetos não vazam. O heap é **geracional**: objetos novos nascem no **espaço novo**, pequeno e coletado com frequência por cópia dos sobreviventes (*scavenge*); os que sobrevivem a algumas rodadas são promovidos ao **espaço antigo**, coletado com menos frequência por marcação e varredura (*mark-sweep*), com compactação (*mark-compact*) quando preciso. Para encurtar as pausas, o V8 faz boa parte do trabalho de forma **incremental** (em fatias), **concorrente** (em threads auxiliares enquanto o JavaScript roda) e **paralela** (várias threads ajudam durante a pausa). O espaço antigo tem teto, ajustável por `--max-old-space-size` (o padrão depende da versão e da memória disponível: confira em nodejs.org).",
        limite:
          "O faxineiro olha só a alcançabilidade, não a sua intenção: um papel esquecido numa pasta que ainda está na sua mão **nunca é lixo**, mesmo que você jamais o use de novo. É assim que nascem os vazamentos. E ele só cuida da mesa do JavaScript: sockets, arquivos abertos e memória de código nativo precisam ser fechados ou liberados por você ou pelo módulo que os criou.",
      },
      {
        tipo: "tabela",
        titulo: "Onde vive cada coisa e como é coletada",
        colunas: ["Região", "O que guarda", "Como é coletada", "Custo e frequência"],
        linhas: [
          [
            "Espaço novo (*young generation*)",
            "Objetos recém-criados",
            "Cópia dos sobreviventes para outra área (*scavenge*)",
            "Frequente e rápida, com pausas curtas",
          ],
          [
            "Espaço antigo (*old generation*)",
            "Objetos que sobreviveram a várias coletas",
            "Marcação e varredura (*mark-sweep*), com compactação quando preciso; parte incremental e concorrente",
            "Mais rara e mais cara; é onde os vazamentos aparecem",
          ],
          [
            "Fora do heap",
            "Conteúdo de `Buffer` e `ArrayBuffer`, memória de módulos nativos",
            "Liberada quando o objeto JavaScript dono é coletado, ou pelo próprio código nativo",
            "Aparece em `external`, `arrayBuffers` e `rss`, não em `heapUsed`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Observando a memória e as coletas",
        legenda: "JavaScript",
        codigo: [
          'import { PerformanceObserver } from "node:perf_hooks";',
          "",
          "const mb = (n) => (n / 1024 / 1024).toFixed(1);",
          "",
          "setInterval(() => {",
          "  const { heapUsed, heapTotal, rss, external } = process.memoryUsage();",
          "  console.log(`heap ${mb(heapUsed)}/${mb(heapTotal)} MB, rss ${mb(rss)} MB, externo ${mb(external)} MB`);",
          "}, 5000).unref();",
          "",
          '// Cada coleta vira uma entrada de desempenho do tipo "gc"',
          "new PerformanceObserver((lista) => {",
          '  for (const e of lista.getEntries()) console.log("gc de", e.duration.toFixed(1), "ms");',
          '}).observe({ entryTypes: ["gc"] });',
        ].join("\n"),
        nota: "`node --trace-gc app.js` imprime cada coleta sem alterar o código, e `v8.getHeapStatistics()` mostra o limite do heap. Para achar quem segura a memória, compare heap snapshots (veja L110).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "GC pesado vira latência, e vazamento é referência viva",
        texto:
          "Quando o heap se aproxima do limite, o V8 coleta cada vez mais e recupera cada vez menos: a CPU sobe, as pausas ficam longas e a latência cresce **antes** de o processo cair com “JavaScript heap out of memory”. O sinal é um `heapUsed` cujo ponto baixo, depois de cada coleta, também sobe. Aumentar `--max-old-space-size` só adia: ache quem segura a referência (cache sem limite, ouvinte nunca removido, timer ativo, variável global) ou reduza as alocações no caminho quente.",
      },
    ],
    armadilhas: [
      "Achar que o GC resolve vazamento: se ainda há uma referência (cache sem limite, listener, timer, global), o objeto é “vivo” para o V8 e nunca é coletado.",
      "Tentar forçar a coleta em produção: `global.gc()` só existe com `--expose-gc`, serve para teste e diagnóstico e atrapalha o agendamento do V8.",
      "Medir a memória num instante isolado: o heap cresce até a próxima coleta; observe a tendência e o ponto baixo depois dos GCs.",
      "Olhar só o `heapUsed`: `Buffer`s grandes ficam fora do heap e podem estourar o limite do contêiner mesmo com o heap pequeno.",
    ],
    autoteste: [
      {
        pergunta: "Como o V8 decide que um objeto é lixo?",
        resposta:
          "Pela alcançabilidade: se não há caminho até o objeto a partir das raízes (escopos ativos, globais, pilha), ele pode ser coletado. Não é contagem de referências, então ciclos entre objetos não vazam.",
      },
      {
        pergunta: "Por que um vazamento aparece como lentidão antes de o processo cair?",
        resposta:
          "Com o heap perto do limite, o GC roda com mais frequência e libera pouco a cada vez, consumindo CPU e causando pausas longas. Só depois, sem espaço, vem o erro de heap esgotado.",
      },
    ],
  },
  en: {
    titulo: "Garbage collection",
    pergunta: "How does garbage collection work in Node.js?",
    porqueEsteMetodo:
      "Garbage collection is invisible until it causes trouble, and the image of tidying a work desk makes the rule intuitive: what is still tied to you stays, the rest goes. Then come V8’s real mechanism and the point where the image stops holding, which is exactly the leak.",
    resposta30s:
      "Node.js uses **V8**’s garbage collector, which frees an object when it is **no longer reachable** from the roots (active scopes and globals). The heap is **generational**: a small **new space**, cleaned often (*scavenge*), and an **old space**, cleaned by *mark-sweep* and compaction, largely in an incremental and concurrent way to keep pauses short. A leak is caused by a **reference that is still alive**, and heavy GC shows up as latency.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of tidying a work desk. The papers in use are in your hand, and each paper may point to other folders (“see the contracts folder”). The cleaner starts from what is in your hand, follows every pointer and marks what it reaches. Anything nobody can reach is trash and goes away, without you saying so. Since most papers are short-lived drafts, the cleaner sweeps the drafts tray often and quickly, and only now and then tidies the drawer of long-term documents.",
        tecnico:
          "V8 decides by **reachability**: an object is garbage when there is no path to it from the **roots** (variables in active scopes, globals, the call stack). It is not reference counting, so cycles between objects do not leak. The heap is **generational**: new objects are born in the **new space**, small and collected often by copying the survivors (*scavenge*); those that survive a few rounds are promoted to the **old space**, collected less often by mark and sweep (*mark-sweep*), with compaction (*mark-compact*) when needed. To shorten pauses, V8 does much of the work in an **incremental** way (in slices), **concurrently** (on helper threads while JavaScript runs) and **in parallel** (several threads help during the pause). The old space has a ceiling, adjustable with `--max-old-space-size` (the default depends on the version and the available memory: check nodejs.org).",
        limite:
          "The cleaner looks only at reachability, not at your intention: a paper forgotten in a folder still in your hand is **never trash**, even if you never use it again. That is how leaks are born. And it only tends the JavaScript desk: sockets, open files and native memory have to be closed or freed by you or by the module that created them.",
      },
      {
        tipo: "tabela",
        titulo: "Where each thing lives and how it is collected",
        colunas: ["Region", "What it holds", "How it is collected", "Cost and frequency"],
        linhas: [
          [
            "New space (*young generation*)",
            "Freshly created objects",
            "Copying the survivors to another area (*scavenge*)",
            "Frequent and fast, with short pauses",
          ],
          [
            "Old space (*old generation*)",
            "Objects that survived several collections",
            "Mark and sweep (*mark-sweep*), with compaction when needed; partly incremental and concurrent",
            "Rarer and more expensive; this is where leaks show up",
          ],
          [
            "Outside the heap",
            "The contents of `Buffer` and `ArrayBuffer`, native module memory",
            "Freed when the owning JavaScript object is collected, or by the native code itself",
            "Shows up in `external`, `arrayBuffers` and `rss`, not in `heapUsed`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Watching memory and collections",
        legenda: "JavaScript",
        codigo: [
          'import { PerformanceObserver } from "node:perf_hooks";',
          "",
          "const mb = (n) => (n / 1024 / 1024).toFixed(1);",
          "",
          "setInterval(() => {",
          "  const { heapUsed, heapTotal, rss, external } = process.memoryUsage();",
          "  console.log(`heap ${mb(heapUsed)}/${mb(heapTotal)} MB, rss ${mb(rss)} MB, external ${mb(external)} MB`);",
          "}, 5000).unref();",
          "",
          '// Each collection becomes a performance entry of type "gc"',
          "new PerformanceObserver((list) => {",
          '  for (const e of list.getEntries()) console.log("gc took", e.duration.toFixed(1), "ms");',
          '}).observe({ entryTypes: ["gc"] });',
        ].join("\n"),
        nota: "`node --trace-gc app.js` prints each collection without changing the code, and `v8.getHeapStatistics()` shows the heap limit. To find who holds the memory, compare heap snapshots (see L110).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Heavy GC becomes latency, and a leak is a live reference",
        texto:
          "When the heap nears its limit, V8 collects more and more and recovers less and less: CPU climbs, pauses get long and latency grows **before** the process dies with “JavaScript heap out of memory”. The sign is a `heapUsed` whose low point after each collection also keeps rising. Raising `--max-old-space-size` only postpones it: find who holds the reference (an unbounded cache, a listener never removed, an active timer, a global variable) or reduce allocations on the hot path.",
      },
    ],
    armadilhas: [
      "Thinking GC fixes a leak: if a reference still exists (unbounded cache, listener, timer, global), the object is “alive” to V8 and is never collected.",
      "Trying to force collection in production: `global.gc()` only exists with `--expose-gc`, is meant for tests and diagnostics and interferes with V8’s scheduling.",
      "Measuring memory at a single instant: the heap grows until the next collection; watch the trend and the low point after GCs.",
      "Looking only at `heapUsed`: large `Buffer`s live outside the heap and can blow the container limit even with a small heap.",
    ],
    autoteste: [
      {
        pergunta: "How does V8 decide that an object is garbage?",
        resposta:
          "By reachability: if there is no path to the object from the roots (active scopes, globals, the stack), it can be collected. It is not reference counting, so cycles between objects do not leak.",
      },
      {
        pergunta: "Why does a leak show up as slowness before the process dies?",
        resposta:
          "With the heap near its limit, GC runs more often and frees little each time, consuming CPU and causing long pauses. Only later, with no space left, does the out-of-memory error arrive.",
      },
    ],
  },
};
