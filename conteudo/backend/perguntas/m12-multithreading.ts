import type { Pergunta } from "../../tipos";

// M12 · Multithreading
export const m12: Pergunta = {
  numero: 212,
  modulo: "mentorcruise",
  metodo: "feynman",
  pt: {
    titulo: "Multithreading no backend",
    pergunta: "Você pode explicar o que é multithreading no desenvolvimento backend?",
    porqueEsteMetodo:
      "Threads parecem abstratas até você imaginar uma cozinha: a analogia ancora memória compartilhada, pool e sincronização, e o ponto em que ela falha (corridas silenciosas, GIL) é o que a entrevista costuma explorar.",
    resposta30s:
      "**Multithreading** é rodar várias **threads** (linhas de execução) dentro de um mesmo processo, **compartilhando memória**. Serve para aproveitar vários núcleos (**paralelismo**) e para não parar enquanto se espera E/S (**concorrência**), em geral com um **pool de threads**. O preço é a **sincronização**: condições de corrida, deadlocks e problemas de visibilidade. Alternativas: o **laço de eventos** (Node), **processos** separados (Python, por causa do **GIL**) e passagem de mensagens, para não compartilhar estado.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Uma cozinha de restaurante. O fogão, a geladeira, a bancada e a lista de pedidos são a memória compartilhada; os cozinheiros são as threads. Com um cozinheiro só, ele intercala: põe a água para ferver e, enquanto espera, pica a cebola. Com vários, há trabalho de fato simultâneo, mas todos dividem o mesmo fogão: se dois pegam a mesma panela, ou um muda o sal da receita enquanto outro a prova, o prato sai estragado. A cozinha se protege com regras: uma panela por cozinheiro de cada vez (lock), uma fila de pedidos na janela e uma equipe de tamanho fixo (pool) em vez de chamar um cozinheiro novo a cada pedido.",
        tecnico:
          "Um processo tem memória própria; as threads dentro dele compartilham essa memória (o heap e as variáveis globais), mas cada uma tem a sua pilha e o seu ponto de execução. Isso torna a comunicação barata e a sincronização obrigatória. **Concorrência** é estruturar o programa para fazer progresso em várias tarefas, intercalando-as; **paralelismo** é executá-las de fato ao mesmo tempo, em núcleos diferentes. Um servidor costuma usar um **pool de threads** (número limitado, reaproveitadas) em vez de uma thread por requisição, porque cada thread custa memória e trocas de contexto. Threads ajudam em duas situações: aproveitar vários núcleos (trabalho de CPU) e não parar tudo enquanto uma tarefa espera rede, disco ou banco (trabalho de E/S). Para o segundo caso, o laço de eventos (veja Q02) faz o mesmo com uma thread só.",
        limite:
          "Na cozinha, os cozinheiros se veem e conversam; threads não: sem sincronização, uma não sabe que a outra mexeu no dado, e os erros aparecem raramente e são difíceis de reproduzir. Mais cozinheiros também não significa mais rapidez: com um fogão só (um lock muito disputado, poucos núcleos, ou o GIL), o trabalho vira fila.",
      },
      {
        tipo: "tabela",
        titulo: "Modelos de execução em um servidor",
        colunas: ["Modelo", "Como funciona", "Bom para", "Cuidado"],
        linhas: [
          [
            "Uma thread por requisição",
            "Cada requisição ganha uma thread dedicada",
            "Código simples e sequencial, que bloqueia à vontade",
            "Com muitas conexões, a memória e as trocas de contexto pesam",
          ],
          [
            "Pool de threads",
            "Número fixo de threads reaproveitadas, com fila de espera",
            "Limitar o uso de recursos; tarefas curtas",
            "Pool pequeno com tarefas que bloqueiam faz a fila crescer; pool grande demais gera disputa",
          ],
          [
            "Laço de eventos (thread única)",
            "Uma thread atende muitas conexões com E/S não bloqueante",
            "Muitas conexões, quase todas esperando E/S",
            "Um cálculo pesado ou uma chamada bloqueante trava todas as requisições",
          ],
          [
            "Processos ou workers separados",
            "Memória isolada; comunicação por mensagens",
            "Trabalho de CPU e isolamento de falhas",
            "Custo de enviar dados entre eles; mais memória",
          ],
        ],
        nota: "Na prática os modelos se combinam: um laço de eventos que entrega trabalho pesado a um pool ou a processos separados.",
      },
      {
        tipo: "tabela",
        titulo: "O que dá errado com estado compartilhado",
        colunas: ["Problema", "O que é", "Exemplo", "Remédio"],
        linhas: [
          [
            "Condição de corrida",
            "O resultado depende da ordem em que as threads se intercalam",
            "Duas threads fazem `contador += 1` (ler, somar, gravar) e uma atualização se perde",
            "Exclusão mútua (lock), operações atômicas, ou não compartilhar o dado",
          ],
          [
            "Deadlock",
            "Duas ou mais threads esperam umas pelas outras para sempre",
            "T1 segura o lock A e quer o B; T2 segura o B e quer o A (a mesma situação de Q09, só que em memória)",
            "Ordem global dos locks, tempo-limite, menos locks",
          ],
          [
            "Problema de visibilidade",
            "Uma thread escreve, mas outra continua vendo o valor antigo (cache da CPU, reordenação de instruções)",
            "Uma flag `parar = true` que a outra thread nunca enxerga",
            "Primitivas de sincronização ou de memória, que variam por linguagem (por exemplo `volatile` em Java, tipos atômicos)",
          ],
          [
            "Contenção",
            "Muitas threads disputam o mesmo lock e esperam em fila",
            "Um único lock global em torno de um cache compartilhado",
            "Locks menores, estruturas concorrentes, ou dividir o estado",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Alternativas sem estado compartilhado",
        texto:
          "A forma mais segura de evitar corridas é **não compartilhar**: dados **imutáveis**; **passagem de mensagens** por filas ou canais (o modelo de atores segue essa linha); **processos isolados**; e servidores **sem estado** que deixam o estado no banco ou em um cache externo, onde a concorrência é problema do armazenamento. Quando for preciso compartilhar, compartilhe pouco e proteja com estruturas já testadas, em vez de montar locks à mão.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "GIL do Python e laço único do Node",
        texto:
          "**Python (CPython)**: o GIL deixa só uma thread executar código Python por vez. Threads não aceleram trabalho de CPU em Python puro, mas ajudam em E/S, porque a thread libera o GIL ao esperar. Para CPU use processos (`multiprocessing`) ou extensões nativas que liberam o GIL; há esforço em curso para tornar o GIL opcional em versões recentes, então confira a sua versão. **Node.js**: o seu código JavaScript roda em uma thread, com laço de eventos; a E/S não bloqueante e algumas tarefas internas (como arquivos e criptografia) saem desse caminho. Trabalho de CPU pesado trava o laço, e a saída são `worker_threads`: cada worker tem o seu próprio laço e memória isolada, comunicando-se por mensagens (compartilhar memória só com `SharedArrayBuffer`, de forma explícita).",
      },
    ],
    armadilhas: [
      "Dizer que “mais threads é mais rápido”: acima do número de núcleos (para CPU) ou do que o recurso aguenta (conexões do banco), só aumenta a disputa e as trocas de contexto.",
      "Confundir concorrência com paralelismo, ou assíncrono com multithreading: um laço de eventos com uma thread só já é concorrente (veja Q02).",
      "Generalizar o GIL (“Python não faz concorrência”): ele limita o paralelismo de CPU entre threads, mas não impede E/S concorrente nem o uso de processos.",
      "Achar que um lock resolve tudo: lock demais gera deadlock e gargalo; o melhor caminho é compartilhar menos estado.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre concorrência e paralelismo?",
        resposta:
          "Concorrência é lidar com várias tarefas em progresso, intercalando-as (pode ser com uma thread só). Paralelismo é executar várias tarefas literalmente ao mesmo tempo, em núcleos diferentes.",
      },
      {
        pergunta: "Por que usar um pool de threads em vez de uma thread por requisição?",
        resposta:
          "Porque cada thread consome memória e gera trocas de contexto. Um pool limita esse custo, reaproveita as threads e enfileira o excesso em vez de derrubar o servidor.",
      },
      {
        pergunta: "O que acontece em Node.js se um handler faz um cálculo pesado, e como resolver?",
        resposta:
          "O laço de eventos fica ocupado e todas as outras requisições esperam. A saída é mover o cálculo para `worker_threads`, para um processo separado ou para uma fila com workers.",
      },
    ],
  },
  en: {
    titulo: "Multithreading in the backend",
    pergunta: "Can you explain multithreading in back-end development?",
    porqueEsteMetodo:
      "Threads feel abstract until you picture a kitchen: the analogy anchors shared memory, pools and synchronization, and the point where it breaks down (silent races, the GIL) is what interviews tend to explore.",
    resposta30s:
      "**Multithreading** means running several **threads** (lines of execution) inside one process, **sharing memory**. It is used to take advantage of several cores (**parallelism**) and to avoid stalling while waiting on I/O (**concurrency**), usually with a **thread pool**. The price is **synchronization**: race conditions, deadlocks and visibility problems. Alternatives: the **event loop** (Node), separate **processes** (Python, because of the **GIL**) and message passing, so state is not shared.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "A restaurant kitchen. The stove, the fridge, the countertop and the order list are the shared memory; the cooks are the threads. With a single cook, they interleave: put the water on to boil and, while waiting, chop the onion. With several, work truly happens at the same time, but they all share the same stove: if two grab the same pot, or one changes the salt in the recipe while another tastes it, the dish is ruined. The kitchen protects itself with rules: one cook per pot at a time (a lock), a queue of orders at the pass, and a fixed-size crew (a pool) instead of calling in a new cook for every order.",
        tecnico:
          "A process has its own memory; the threads inside it share that memory (the heap and global variables), but each has its own stack and execution point. That makes communication cheap and synchronization mandatory. **Concurrency** is structuring a program to make progress on several tasks by interleaving them; **parallelism** is actually running them at the same time on different cores. A server usually uses a **thread pool** (a limited number of reused threads) instead of one thread per request, because each thread costs memory and context switches. Threads help in two situations: using several cores (CPU work) and not stalling everything while a task waits on network, disk or database (I/O work). For the second case, the event loop (see Q02) does the same with a single thread.",
        limite:
          "In the kitchen, cooks see and talk to each other; threads do not: without synchronization one has no idea the other changed the data, and the bugs appear rarely and are hard to reproduce. More cooks also does not mean more speed: with a single stove (a heavily contended lock, few cores, or the GIL), the work becomes a queue.",
      },
      {
        tipo: "tabela",
        titulo: "Execution models in a server",
        colunas: ["Model", "How it works", "Good for", "Watch out for"],
        linhas: [
          [
            "One thread per request",
            "Each request gets a dedicated thread",
            "Simple, sequential code that can block freely",
            "With many connections, memory and context switches add up",
          ],
          [
            "Thread pool",
            "A fixed number of reused threads, with a waiting queue",
            "Limiting resource use; short tasks",
            "A small pool with blocking tasks makes the queue grow; a pool too large causes contention",
          ],
          [
            "Event loop (single thread)",
            "One thread serves many connections using non-blocking I/O",
            "Many connections, nearly all waiting on I/O",
            "A heavy computation or a blocking call stalls every request",
          ],
          [
            "Separate processes or workers",
            "Isolated memory; communication by messages",
            "CPU-bound work and fault isolation",
            "Cost of sending data between them; more memory",
          ],
        ],
        nota: "In practice the models combine: an event loop that hands heavy work to a pool or to separate processes.",
      },
      {
        tipo: "tabela",
        titulo: "What goes wrong with shared state",
        colunas: ["Problem", "What it is", "Example", "Remedy"],
        linhas: [
          [
            "Race condition",
            "The result depends on the order in which threads interleave",
            "Two threads run `counter += 1` (read, add, write) and one update is lost",
            "Mutual exclusion (a lock), atomic operations, or not sharing the data",
          ],
          [
            "Deadlock",
            "Two or more threads wait on each other forever",
            "T1 holds lock A and wants B; T2 holds B and wants A (the same situation as Q09, only in memory)",
            "A global lock order, timeouts, fewer locks",
          ],
          [
            "Visibility problem",
            "One thread writes, but another keeps seeing the old value (CPU cache, instruction reordering)",
            "A `stop = true` flag the other thread never sees",
            "Synchronization or memory primitives, which vary by language (for example `volatile` in Java, atomic types)",
          ],
          [
            "Contention",
            "Many threads fight for the same lock and wait in line",
            "A single global lock around a shared cache",
            "Smaller locks, concurrent data structures, or splitting the state",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Alternatives without shared state",
        texto:
          "The safest way to avoid races is **not to share**: **immutable** data; **message passing** through queues or channels (the actor model follows this line); **isolated processes**; and **stateless** servers that keep state in the database or an external cache, where concurrency is the storage’s problem. When sharing is unavoidable, share little and protect it with tried and tested structures instead of hand-built locks.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Python’s GIL and Node’s single loop",
        texto:
          "**Python (CPython)**: the GIL lets only one thread execute Python code at a time. Threads do not speed up CPU-bound work in pure Python, but they help with I/O, because a thread releases the GIL while waiting. For CPU work use processes (`multiprocessing`) or native extensions that release the GIL; there is ongoing work to make the GIL optional in recent versions, so check yours. **Node.js**: your JavaScript runs on one thread, with an event loop; non-blocking I/O and some internal tasks (such as files and cryptography) are handled off that path. Heavy CPU work blocks the loop, and the way out is `worker_threads`: each worker has its own loop and isolated memory, communicating by messages (sharing memory only through `SharedArrayBuffer`, explicitly).",
      },
    ],
    armadilhas: [
      "Saying “more threads means faster”: beyond the number of cores (for CPU work) or what the resource can take (database connections), it only adds contention and context switches.",
      "Confusing concurrency with parallelism, or async with multithreading: an event loop with a single thread is already concurrent (see Q02).",
      "Overgeneralizing the GIL (“Python can’t do concurrency”): it limits CPU parallelism across threads, but it does not prevent concurrent I/O or the use of processes.",
      "Thinking a lock solves everything: too many locks cause deadlocks and bottlenecks; the better path is sharing less state.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between concurrency and parallelism?",
        resposta:
          "Concurrency is dealing with several tasks in progress by interleaving them (it can be done with a single thread). Parallelism is literally running several tasks at the same time, on different cores.",
      },
      {
        pergunta: "Why use a thread pool instead of one thread per request?",
        resposta:
          "Because each thread consumes memory and causes context switches. A pool caps that cost, reuses threads and queues the excess instead of bringing the server down.",
      },
      {
        pergunta: "What happens in Node.js if a handler does a heavy computation, and how do you fix it?",
        resposta:
          "The event loop is busy and every other request waits. The fix is to move the computation to `worker_threads`, to a separate process or to a queue with workers.",
      },
    ],
  },
};
