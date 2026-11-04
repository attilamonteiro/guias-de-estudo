import type { Pergunta } from "../../tipos";

// G16 · Observar arquivos
export const g016: Pergunta = {
  numero: 616,
  modulo: "gist-iniciante",
  metodo: "compare",
  pt: {
    titulo: "Observar arquivos",
    pergunta: "Como você pode monitorar modificações em um arquivo no Node.js?",
    porqueEsteMetodo:
      "Há mais de uma maneira de observar um arquivo, e cada uma troca confiabilidade, custo e portabilidade de um jeito. A matriz as coloca lado a lado e a regra de decisão diz qual escolher em cada situação.",
    resposta30s:
      "O caminho nativo é **`fs.watch`** (ou **`fs/promises.watch`**, que devolve um iterador assíncrono): ele usa o aviso do sistema operacional e emite eventos `rename` e `change`, mas o comportamento varia entre plataformas (nome ausente, eventos duplicados, `recursive` desigual). **`fs.watchFile`** consulta o `stat` periodicamente: funciona em mais ambientes e custa mais. Observe a **pasta**, aplique **debounce** e, se precisar de comportamento uniforme, use uma biblioteca como chokidar; para reiniciar o programa durante o desenvolvimento, existe `node --watch`.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Formas de observar um arquivo",
        colunas: ["Opção", "Como funciona", "Pontos fortes", "Limitações"],
        linhas: [
          [
            "`fs.watch`",
            "Pede ao sistema operacional para avisar (inotify, FSEvents, ReadDirectoryChangesW…) e chama o listener com `rename` ou `change`",
            "Rápido, sem consulta periódica e barato em CPU",
            "Varia por sistema: o nome do arquivo pode vir vazio, um salvamento pode gerar vários eventos e o suporte a `recursive` depende da plataforma; contêineres e discos de rede podem não avisar",
          ],
          [
            "`fs.watchFile`",
            "Consulta o `stat` do arquivo a cada intervalo e chama o listener quando algo muda (recebe o estado atual e o anterior)",
            "Funciona onde o aviso do sistema não chega (disco de rede, volume de contêiner) e se comporta igual em todas as plataformas",
            "Atraso de até um intervalo e custo maior por arquivo: serve para poucos arquivos; a documentação recomenda `fs.watch` quando possível",
          ],
          [
            "`fs/promises.watch`",
            "A mesma base do `fs.watch`, mas devolve um iterador assíncrono (`for await`) e aceita `AbortSignal`",
            "Código linear, fácil de cancelar e de combinar com `await`",
            "Herda as limitações do `fs.watch`; ao cancelar, o laço termina com `AbortError`",
          ],
          [
            "`node --watch`",
            "Opção do próprio Node que reinicia o processo quando o arquivo de entrada ou os módulos carregados mudam",
            "Nenhum código: ótimo para recarregar durante o desenvolvimento",
            "Não é uma API para reagir a um arquivo de dados em tempo de execução; é um recurso recente, confira o estado na sua versão",
          ],
          [
            "Bibliotecas (chokidar)",
            "Embrulham as APIs nativas (e, se preciso, a consulta periódica), normalizam os eventos e acrescentam opções",
            "Comportamento mais uniforme entre sistemas e opções como esperar a gravação terminar",
            "Mais uma dependência; continuam sujeitas aos limites do sistema",
          ],
        ],
        nota: "Em Linux, observar muitos arquivos pode esgotar o limite do inotify e gerar o erro `ENOSPC` (“limite de observadores atingido”): o limite se ajusta no sistema operacional, não no Node. Veja também L65, sobre o módulo `fs`.",
      },
      {
        tipo: "codigo",
        titulo: "Observar a pasta, filtrar o nome e agrupar a rajada de eventos",
        legenda: "JavaScript",
        codigo: [
          'import { watch } from "node:fs/promises";',
          "",
          'const pasta = "./config";',
          'const alvo = "app.json";',
          "const ac = new AbortController(); // ac.abort() encerra a observação",
          "let espera;",
          "",
          "try {",
          "  for await (const { eventType, filename } of watch(pasta, { signal: ac.signal })) {",
          "    if (filename && filename !== alvo) continue; // nome pode vir vazio: na dúvida, trate como mudança",
          "    clearTimeout(espera);",
          "    espera = setTimeout(() => console.log(`${alvo} mudou (${eventType})`), 100); // debounce",
          "  }",
          "} catch (erro) {",
          '  if (erro.name !== "AbortError") throw erro;',
          "}",
        ].join("\n"),
        nota: "Um único salvamento costuma gerar vários eventos; o `setTimeout` reinicia a cada um e só reage quando a rajada acaba. Na reação, leia o arquivo de novo e tolere uma leitura incompleta (tente outra vez se a conversão falhar).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Escolha pelo contexto. Para **reiniciar o programa** quando o código muda, durante o desenvolvimento: `node --watch`. Para **reagir a um arquivo** em código, num ambiente que você controla: `fs/promises.watch` na **pasta**, com filtro de nome e debounce. Onde o aviso do sistema falha (volume de contêiner, disco de rede) ou quando o comportamento precisa ser igual em vários sistemas: `fs.watchFile` (poucos arquivos) ou uma biblioteca como chokidar. E pergunte antes se observar é necessário: para recarregar configuração em produção, muitas equipes preferem um gatilho explícito (sinal `SIGHUP`, rota administrativa ou novo deploy).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Um evento não é um fato",
        texto:
          "`fs.watch` não promete um evento por mudança nem diz o que mudou: `rename` e `change` são pistas, e um mesmo salvamento pode gerar vários avisos, um deles antes de a gravação terminar. Por isso use debounce, releia o arquivo (ou confira com `stat`) em vez de confiar no tipo do evento e aceite que a primeira leitura pode vir pela metade. Além disso, muitos editores salvam gravando um arquivo temporário e trocando o original: quem observa o arquivo pode perder o alvo, quem observa a pasta continua recebendo avisos.",
      },
    ],
    armadilhas: [
      "Observar o arquivo em vez da pasta: se o editor salvar trocando o arquivo, a observação pode deixar de avisar.",
      "Reagir a cada evento: um único salvamento costuma gerar vários, e o processamento roda repetido; use debounce.",
      "Ler o arquivo no primeiro aviso: ele pode estar pela metade; espere a rajada acabar e trate falhas de leitura e de conversão.",
      "Testar só no seu computador: contêineres com volumes montados, discos de rede e o limite de observadores do Linux (`ENOSPC`) mudam o resultado em outros ambientes.",
    ],
    autoteste: [
      {
        pergunta: "Por que é mais seguro observar a pasta do que o arquivo?",
        resposta:
          "Porque muitos editores salvam gravando um arquivo novo e trocando o original; a observação presa ao arquivo antigo pode deixar de avisar. Na pasta, a troca aparece como um evento e a observação continua valendo, bastando filtrar pelo nome.",
      },
      {
        pergunta: "Quando `fs.watchFile` é melhor do que `fs.watch`?",
        resposta:
          "Quando o aviso do sistema operacional não funciona de forma confiável, como em discos de rede e volumes de contêiner. Ele consulta o `stat` periodicamente: é mais lento e mais caro, mas igual em todas as plataformas.",
      },
    ],
  },
  en: {
    titulo: "Watching files",
    pergunta: "How you can monitor a file for modifications in Node.js?",
    porqueEsteMetodo:
      "There is more than one way to watch a file, and each trades reliability, cost and portability differently. The matrix puts them side by side and the decision rule says which to pick in each situation.",
    resposta30s:
      "The native route is **`fs.watch`** (or **`fs/promises.watch`**, which returns an async iterator): it relies on the operating system's notifications and emits `rename` and `change` events, but behavior varies across platforms (missing filename, duplicate events, uneven `recursive`). **`fs.watchFile`** polls `stat` periodically: it works in more environments and costs more. Watch the **folder**, apply **debounce** and, if you need uniform behavior, use a library such as chokidar; to restart the program during development, there is `node --watch`.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Ways to watch a file",
        colunas: ["Option", "How it works", "Strengths", "Limitations"],
        linhas: [
          [
            "`fs.watch`",
            "Asks the operating system to notify (inotify, FSEvents, ReadDirectoryChangesW…) and calls the listener with `rename` or `change`",
            "Fast, no periodic polling and cheap on CPU",
            "Varies by system: the filename may be empty, one save can produce several events and `recursive` support depends on the platform; containers and network drives may not notify",
          ],
          [
            "`fs.watchFile`",
            "Polls the file's `stat` every interval and calls the listener when something changes (it receives the current and previous state)",
            "Works where the system's notifications do not arrive (network drive, container volume) and behaves the same on every platform",
            "Up to one interval of delay and a higher cost per file: fine for a few files; the documentation recommends `fs.watch` when possible",
          ],
          [
            "`fs/promises.watch`",
            "The same foundation as `fs.watch`, but it returns an async iterator (`for await`) and accepts an `AbortSignal`",
            "Linear code, easy to cancel and to combine with `await`",
            "Inherits the limitations of `fs.watch`; when cancelled, the loop ends with `AbortError`",
          ],
          [
            "`node --watch`",
            "A Node option that restarts the process when the entry file or the loaded modules change",
            "No code at all: great for reloading during development",
            "Not an API for reacting to a data file at runtime; it is a recent feature, so check its status in your version",
          ],
          [
            "Libraries (chokidar)",
            "Wrap the native APIs (and, if needed, polling), normalize the events and add options",
            "More uniform behavior across systems and options such as waiting for a write to finish",
            "One more dependency; still subject to the system's limits",
          ],
        ],
        nota: "On Linux, watching many files can exhaust the inotify limit and raise the `ENOSPC` error (“watcher limit reached”): the limit is adjusted in the operating system, not in Node. See also L65, about the `fs` module.",
      },
      {
        tipo: "codigo",
        titulo: "Watch the folder, filter by name and group the burst of events",
        legenda: "JavaScript",
        codigo: [
          'import { watch } from "node:fs/promises";',
          "",
          'const folder = "./config";',
          'const target = "app.json";',
          "const ac = new AbortController(); // ac.abort() stops watching",
          "let wait;",
          "",
          "try {",
          "  for await (const { eventType, filename } of watch(folder, { signal: ac.signal })) {",
          "    if (filename && filename !== target) continue; // name may be empty: when in doubt, treat it as a change",
          "    clearTimeout(wait);",
          "    wait = setTimeout(() => console.log(`${target} changed (${eventType})`), 100); // debounce",
          "  }",
          "} catch (error) {",
          '  if (error.name !== "AbortError") throw error;',
          "}",
        ].join("\n"),
        nota: "A single save often produces several events; the `setTimeout` restarts on each one and only reacts when the burst ends. When reacting, read the file again and tolerate a partial read (retry if parsing fails).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Choose by context. To **restart the program** when code changes, during development: `node --watch`. To **react to a file** in code, in an environment you control: `fs/promises.watch` on the **folder**, with a name filter and debounce. Where the system's notifications fail (container volume, network drive) or when behavior must be the same across systems: `fs.watchFile` (a few files) or a library such as chokidar. And ask first whether watching is necessary: to reload configuration in production, many teams prefer an explicit trigger (a `SIGHUP` signal, an admin route or a new deploy).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "An event is not a fact",
        texto:
          "`fs.watch` does not promise one event per change nor tell you what changed: `rename` and `change` are hints, and one save can produce several notifications, one of them before the write has finished. So use debounce, read the file again (or check with `stat`) instead of trusting the event type, and accept that the first read may come back half-written. Also, many editors save by writing a temporary file and swapping it for the original: whoever watches the file may lose the target, whoever watches the folder keeps receiving notifications.",
      },
    ],
    armadilhas: [
      "Watching the file instead of the folder: if the editor saves by swapping the file, the watch may stop notifying.",
      "Reacting to every event: a single save often produces several, and the processing runs repeatedly; use debounce.",
      "Reading the file on the first notification: it may be half-written; wait for the burst to end and handle read and parse failures.",
      "Testing only on your own machine: containers with mounted volumes, network drives and the Linux watcher limit (`ENOSPC`) change the outcome in other environments.",
    ],
    autoteste: [
      {
        pergunta: "Why is it safer to watch the folder than the file?",
        resposta:
          "Because many editors save by writing a new file and swapping the original; a watch tied to the old file may stop notifying. On the folder, the swap shows up as an event and the watch stays valid; you just filter by name.",
      },
      {
        pergunta: "When is `fs.watchFile` better than `fs.watch`?",
        resposta:
          "When the operating system's notifications are not reliable, such as on network drives and container volumes. It polls `stat` periodically: slower and more expensive, but the same on every platform.",
      },
    ],
  },
};
