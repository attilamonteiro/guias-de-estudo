import type { Pergunta } from "../../tipos";

// Q43 · libuv
export const q43: Pergunta = {
  numero: 43,
  modulo: "turing-avancadas",
  metodo: "feynman",
  pt: {
    titulo: "libuv",
    pergunta: "O que é libuv?",
    porqueEsteMetodo:
      "O libuv fica escondido sob o Node.js, então uma analogia concreta ajuda a enxergá-lo: quem espera, quem trabalha e quem avisa. Depois vêm o mecanismo real e o ponto em que a analogia deixa de valer.",
    resposta30s:
      "O **libuv** é uma biblioteca em C, multiplataforma, que dá ao Node.js a **E/S assíncrona**: o **laço de eventos** (event loop), sockets, timers, sinais, processos filhos e um **pool de threads** (4 por padrão, ajustável por `UV_THREADPOOL_SIZE`). Rede e timers usam mecanismos do sistema operacional; o que o SO não faz de forma assíncrona (a maior parte do `fs`, o `dns.lookup`, partes do `crypto` e do `zlib`) vai para o pool. O seu JavaScript continua em uma thread só, no V8.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine a recepção de um hotel com **um único recepcionista**. Os hóspedes que têm campainha própria avisam por um painel de luzes: o recepcionista só olha o painel, sem ficar parado esperando cada um. O serviço que não tem campainha, como lavar uma roupa, ele entrega à equipe de apoio (quatro funcionários) e continua atendendo. Quando a roupa fica pronta, a equipe avisa e ele chama o hóspede de volta.",
        tecnico:
          "O recepcionista é o **laço de eventos** e o painel de luzes é o mecanismo de notificação do sistema operacional (`epoll` no Linux, `kqueue` no macOS, IOCP no Windows). A equipe de apoio é o **pool de threads** do libuv. O libuv reúne tudo isso atrás de uma interface única: laço de eventos, sockets TCP/UDP, timers, sinais, processos filhos, observação de arquivos e pool de threads, escondendo as diferenças entre sistemas operacionais. Ele nasceu para o Node.js. O seu JavaScript roda na thread principal, no V8; o libuv cuida de esperar e avisar (o laço em si é o assunto da Q28).",
        limite:
          "No hotel de verdade há vários recepcionistas, mas o Node.js tem uma thread para o seu JavaScript: se ela ficar ocupada fazendo conta (CPU), ninguém é atendido, nem quem já tocou a campainha. A equipe de apoio também é pequena e compartilhada: muita lavanderia (criptografia, arquivos) atrasa até o `dns.lookup` de outras requisições.",
      },
      {
        tipo: "tabela",
        titulo: "Quem trabalha em cada operação",
        colunas: ["Operação", "Quem faz o trabalho", "Observação"],
        linhas: [
          [
            "Rede (TCP, UDP, HTTP)",
            "O mecanismo do SO (epoll, kqueue, IOCP), avisando o laço",
            "Sem thread por conexão; é o que permite muitas conexões abertas",
          ],
          [
            "Timers (`setTimeout`, `setInterval`)",
            "O próprio laço de eventos",
            "Sem thread; disparam atrasados se o laço estiver ocupado",
          ],
          [
            "Sistema de arquivos (`fs` assíncrono)",
            "Pool de threads",
            "As chamadas do SO são bloqueantes e rodam numa thread do pool",
          ],
          [
            "`dns.lookup`",
            "Pool de threads",
            "Usa uma chamada bloqueante do SO; já o `dns.resolve*` faz consultas de rede sem o pool",
          ],
          [
            "`crypto` (pbkdf2, scrypt, randomBytes) e `zlib`",
            "Pool de threads",
            "Trabalho de CPU que sai da thread principal",
          ],
          ["Processos filhos e sinais", "O libuv com o SO", "Comunicação por pipes e sinais, sem ocupar o pool"],
          ["Seu código JavaScript", "Thread principal (V8)", "Se bloquear, o laço inteiro para (veja Q28)"],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Do fs.readFile ao callback",
        etapas: [
          "Seu JavaScript chama `fs.readFile(...)` na thread principal",
          "A camada C++ do Node.js cria uma requisição e a entrega ao libuv",
          "O libuv coloca o trabalho na fila do pool de threads (se as quatro threads estiverem ocupadas, ele espera)",
          "Uma thread do pool faz a leitura bloqueante do arquivo",
          "Ao terminar, a thread avisa o laço de eventos",
          "O laço agenda o callback, e o V8 o executa na thread principal",
        ],
        nota: "Só o trabalho bloqueante sai da thread principal. O seu callback sempre volta a rodar nela.",
      },
      {
        tipo: "codigo",
        titulo: "Vendo o pool de threads em ação",
        legenda: "JavaScript",
        codigo:
          'import { pbkdf2 } from "node:crypto";\n\nconst inicio = Date.now();\n\nfor (let i = 1; i <= 6; i++) {\n  pbkdf2("senha", "sal", 200_000, 64, "sha512", () => {\n    console.log(`tarefa ${i} terminou em ${Date.now() - inicio} ms`);\n  });\n}\n// Com o pool padrão (4 threads) e núcleos livres, as quatro primeiras terminam\n// por volta do mesmo tempo, e a 5ª e a 6ª esperam uma vaga.\n// Rode também com UV_THREADPOOL_SIZE=8 e compare.',
        nota: "Defina a variável de ambiente antes de iniciar o processo (por exemplo, `UV_THREADPOOL_SIZE=8 node pool.mjs` no Linux e no macOS). Os tempos dependem da máquina.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Quem faz o quê",
        texto:
          "O **V8** executa o seu JavaScript, numa thread. O **libuv** espera, agenda e avisa: laço de eventos, rede, timers e o pool de threads. A **camada C++ do Node.js** liga um ao outro. O paralelismo que existe vem do pool e do sistema operacional, não do seu código JavaScript.",
      },
    ],
    armadilhas: [
      "Dizer que o Node.js usa uma thread só, e pronto: o JavaScript roda em uma, mas o libuv usa threads para `fs`, `dns.lookup`, `crypto` e `zlib` (veja Q16).",
      "Achar que toda E/S passa pelo pool de threads: a rede usa o mecanismo de notificação do sistema operacional.",
      "Esgotar o pool com muitas operações lentas: arquivos, `scrypt`/`pbkdf2` e `dns.lookup` dividem as mesmas vagas, e tudo que depende delas atrasa.",
      "Aumentar `UV_THREADPOOL_SIZE` como remédio automático: mais threads do que núcleos não acelera trabalho de CPU e custa memória. Meça antes e depois.",
    ],
    autoteste: [
      {
        pergunta: "O que o libuv oferece ao Node.js?",
        resposta:
          "E/S assíncrona multiplataforma: o laço de eventos, sockets, timers, sinais, processos filhos, observação de arquivos e um pool de threads, atrás de uma interface única para Linux, macOS e Windows.",
      },
      {
        pergunta: "Quais operações usam o pool de threads e quais usam o sistema operacional diretamente?",
        resposta:
          "Vão para o pool a maior parte do `fs`, o `dns.lookup` e trabalhos de `crypto` e `zlib`. Rede e timers usam o mecanismo do sistema operacional e o próprio laço, sem o pool.",
      },
      {
        pergunta: "Qual é o tamanho padrão do pool e como mudá-lo?",
        resposta:
          "Quatro threads. Muda-se com a variável de ambiente `UV_THREADPOOL_SIZE`, definida ao iniciar o processo.",
      },
    ],
  },
  en: {
    titulo: "libuv",
    pergunta: "What is libuv?",
    porqueEsteMetodo:
      "libuv hides under Node.js, so a concrete analogy helps you see it: who waits, who works and who notifies. Then come the real mechanism and the point where the analogy stops holding.",
    resposta30s:
      "**libuv** is a cross-platform C library that gives Node.js its **asynchronous I/O**: the **event loop**, sockets, timers, signals, child processes and a **thread pool** (4 by default, adjustable with `UV_THREADPOOL_SIZE`). Networking and timers use operating-system mechanisms; whatever the OS cannot do asynchronously (most of `fs`, `dns.lookup`, parts of `crypto` and `zlib`) goes to the pool. Your JavaScript still runs on a single thread, in V8.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Picture a hotel front desk with **a single receptionist**. Guests who have their own call button signal through a light panel: the receptionist just glances at the panel instead of standing around waiting for each one. Work that has no button, like doing a load of laundry, goes to the support staff (four employees) while the receptionist keeps serving people. When the laundry is ready, the staff signals back and the receptionist calls the guest.",
        tecnico:
          "The receptionist is the **event loop** and the light panel is the operating system’s notification mechanism (`epoll` on Linux, `kqueue` on macOS, IOCP on Windows). The support staff is libuv’s **thread pool**. libuv gathers all of this behind one interface: event loop, TCP/UDP sockets, timers, signals, child processes, file watching and the thread pool, hiding the differences between operating systems. It was created for Node.js. Your JavaScript runs on the main thread, in V8; libuv takes care of waiting and notifying (the loop itself is the subject of Q28).",
        limite:
          "A real hotel has several receptionists, but Node.js has one thread for your JavaScript: if it gets busy doing math (CPU), nobody is served, not even those who already pressed the button. The support staff is also small and shared: too much laundry (cryptography, files) delays even other requests’ `dns.lookup`.",
      },
      {
        tipo: "tabela",
        titulo: "Who does the work for each operation",
        colunas: ["Operation", "Who does the work", "Note"],
        linhas: [
          [
            "Networking (TCP, UDP, HTTP)",
            "The OS mechanism (epoll, kqueue, IOCP), notifying the loop",
            "No thread per connection; this is what allows many open connections",
          ],
          [
            "Timers (`setTimeout`, `setInterval`)",
            "The event loop itself",
            "No thread; they fire late if the loop is busy",
          ],
          ["File system (async `fs`)", "Thread pool", "The OS calls are blocking and run on a pool thread"],
          [
            "`dns.lookup`",
            "Thread pool",
            "It uses a blocking OS call; `dns.resolve*`, by contrast, does network queries without the pool",
          ],
          ["`crypto` (pbkdf2, scrypt, randomBytes) and `zlib`", "Thread pool", "CPU work that leaves the main thread"],
          [
            "Child processes and signals",
            "libuv with the OS",
            "Communication through pipes and signals, without occupying the pool",
          ],
          ["Your JavaScript code", "Main thread (V8)", "If it blocks, the whole loop stops (see Q28)"],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "From fs.readFile to the callback",
        etapas: [
          "Your JavaScript calls `fs.readFile(...)` on the main thread",
          "Node.js’s C++ layer creates a request and hands it to libuv",
          "libuv puts the work in the thread pool queue (if all four threads are busy, it waits)",
          "A pool thread performs the blocking file read",
          "When done, the thread notifies the event loop",
          "The loop schedules the callback, and V8 runs it on the main thread",
        ],
        nota: "Only the blocking work leaves the main thread. Your callback always runs back on it.",
      },
      {
        tipo: "codigo",
        titulo: "Seeing the thread pool at work",
        legenda: "JavaScript",
        codigo:
          'import { pbkdf2 } from "node:crypto";\n\nconst start = Date.now();\n\nfor (let i = 1; i <= 6; i++) {\n  pbkdf2("password", "salt", 200_000, 64, "sha512", () => {\n    console.log(`task ${i} finished in ${Date.now() - start} ms`);\n  });\n}\n// With the default pool (4 threads) and free cores, the first four finish\n// at about the same time, and the 5th and 6th wait for a slot.\n// Also run it with UV_THREADPOOL_SIZE=8 and compare.',
        nota: "Set the environment variable before starting the process (for example, `UV_THREADPOOL_SIZE=8 node pool.mjs` on Linux and macOS). The timings depend on the machine.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Who does what",
        texto:
          "**V8** runs your JavaScript, on one thread. **libuv** waits, schedules and notifies: event loop, networking, timers and the thread pool. **Node.js’s C++ layer** connects the two. Whatever parallelism exists comes from the pool and the operating system, not from your JavaScript code.",
      },
    ],
    armadilhas: [
      "Saying Node.js uses a single thread, full stop: JavaScript runs on one, but libuv uses threads for `fs`, `dns.lookup`, `crypto` and `zlib` (see Q16).",
      "Thinking all I/O goes through the thread pool: networking uses the operating system’s notification mechanism.",
      "Exhausting the pool with many slow operations: files, `scrypt`/`pbkdf2` and `dns.lookup` share the same slots, and everything that depends on them gets delayed.",
      "Raising `UV_THREADPOOL_SIZE` as an automatic remedy: more threads than cores does not speed up CPU work and costs memory. Measure before and after.",
    ],
    autoteste: [
      {
        pergunta: "What does libuv give Node.js?",
        resposta:
          "Cross-platform asynchronous I/O: the event loop, sockets, timers, signals, child processes, file watching and a thread pool, behind one interface for Linux, macOS and Windows.",
      },
      {
        pergunta: "Which operations use the thread pool and which use the operating system directly?",
        resposta:
          "Most of `fs`, `dns.lookup` and `crypto` and `zlib` jobs go to the pool. Networking and timers use the operating system’s mechanism and the loop itself, without the pool.",
      },
      {
        pergunta: "What is the default size of the pool and how do you change it?",
        resposta:
          "Four threads. You change it with the `UV_THREADPOOL_SIZE` environment variable, set when the process starts.",
      },
    ],
  },
};
