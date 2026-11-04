import type { Pergunta } from "../../tipos";

// D05 · Node.js x servidores tradicionais
export const d005: Pergunta = {
  numero: 305,
  modulo: "devinterview-fundamentos",
  metodo: "compare",
  pt: {
    titulo: "Node.js x servidores tradicionais",
    pergunta: "Qual é a diferença entre o Node.js e as tecnologias tradicionais de servidor web?",
    porqueEsteMetodo:
      "A pergunta pede uma diferença, e a resposta honesta é “depende de onde o tempo de cada requisição é gasto”. Uma matriz lado a lado mostra em que critério cada modelo ganha, em vez de declarar um vencedor.",
    resposta30s:
      "Nos modelos clássicos (Apache em modo de processos ou threads, PHP-FPM, contêineres de servlets), cada requisição em andamento ocupa um **worker**, isto é, uma **thread ou um processo**. O Node.js atende todas com **um laço de eventos e E/S não bloqueante** (veja T28): enquanto uma requisição espera o banco ou a rede, a mesma thread atende outra. Isso favorece **muitas conexões esperando E/S**, e não **CPU pesada por requisição**; não é “sempre mais rápido”.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Os dois modelos, critério a critério",
        colunas: ["Critério", "Node.js (laço de eventos)", "Worker por requisição (thread ou processo)"],
        linhas: [
          [
            "Como atende várias requisições",
            "Uma thread de JavaScript alterna entre elas: quando uma espera E/S, o laço atende outra",
            "Cada requisição em andamento ocupa um worker de um pool; o sistema operacional reparte o tempo entre eles",
          ],
          [
            "Memória por conexão ociosa",
            "Pequena: um socket e o estado da requisição no heap",
            "Maior: a thread (com pilha própria) ou o processo costuma ficar preso à requisição enquanto ela espera",
          ],
          [
            "Muitas conexões abertas esperando (chat, streaming, WebSocket)",
            "Ponto forte: milhares de conexões quase paradas custam pouco",
            "O pool de workers pode esgotar; exige ajuste ou um modo orientado a eventos do próprio servidor",
          ],
          [
            "CPU pesada por requisição",
            "Ponto fraco: o cálculo trava o laço e atrasa todos; pede `worker_threads`, processos ou outro serviço (veja T16)",
            "Ponto forte: a requisição pesada ocupa o seu worker e as outras seguem em outros núcleos",
          ],
          [
            "Código bloqueante simples",
            "Perigoso: uma chamada síncrona demorada para o servidor inteiro (veja T28)",
            "Natural e seguro: bloquear só ocupa o próprio worker",
          ],
          [
            "Isolamento entre requisições",
            "Todas dividem um processo e a memória; uma exceção não tratada derruba todas",
            "Com processo por worker, uma falha afeta uma requisição; com threads, a memória do processo ainda é dividida",
          ],
          [
            "Uso de vários núcleos",
            "Uma instância usa um núcleo para o seu JavaScript; escala com `cluster`, réplicas ou workers (veja T45)",
            "Natural: várias threads ou processos ocupam vários núcleos",
          ],
        ],
        nota: "Servidores modernos misturam as ideias: o Nginx e o modo de eventos do Apache também usam E/S orientada a eventos, e vários runtimes atuais combinam eventos com threads leves. O contraste vale para o desenho clássico.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Pergunte onde o tempo de cada requisição é gasto. Se é **espera** (banco, outra API, disco, rede) e há muitas conexões ao mesmo tempo, o laço de eventos do Node.js rende muito com poucos recursos. Se é **cálculo** dentro da requisição, ou se o time depende de código bloqueante simples e de isolamento por requisição, um worker por requisição é mais simples e seguro. Em sistemas reais, costuma valer combinar: o Node.js na borda de E/S e serviços ou workers para o cálculo.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "“O Node.js é mais rápido” não é resposta",
        texto:
          "O Node.js é um **runtime**, não um servidor web pronto como o Apache: você escreve o servidor em JavaScript (`node:http`, Express) e costuma colocar um proxy reverso, como o Nginx, na frente. O ganho do modelo é de **escala em conexões concorrentes**, não de velocidade por requisição: uma requisição isolada não fica mais rápida só por estar no Node.js. Compare com a sua carga real, medindo latência e uso de memória, antes de decidir.",
      },
    ],
    armadilhas: [
      "Dizer que o Node.js é “mais rápido” sem dizer em quê: para CPU pesada ou pouca concorrência, a vantagem some e pode virar desvantagem.",
      "Comparar o Node.js com uma configuração ruim do outro lado: servidores tradicionais bem ajustados, ou em modo de eventos, também atendem muitas conexões.",
      "Tratar Node.js e Apache como equivalentes: um é um ambiente de execução onde você programa o servidor, o outro é um servidor configurado, e é comum usar os dois juntos.",
      "Esquecer que “uma thread” é a do seu JavaScript: por baixo, o libuv e o sistema operacional também trabalham em paralelo.",
    ],
    autoteste: [
      {
        pergunta:
          "Por que mil conexões de chat quase paradas custam menos num servidor Node.js do que num servidor com uma thread por conexão?",
        resposta:
          "No Node.js cada conexão é só um socket e algum estado na memória, e a thread de JavaScript só trabalha quando chega um evento. No modelo clássico, uma conexão presa a um worker mantém uma thread (com pilha própria) ou um processo ocupado enquanto espera.",
      },
      {
        pergunta: "Em que caso um servidor com um worker por requisição é a melhor escolha?",
        resposta:
          "Quando cada requisição faz muito cálculo, quando o código é bloqueante e simples ou quando o isolamento entre requisições importa. O cálculo ocupa só o worker daquela requisição; no Node.js ele travaria o laço de todos.",
      },
    ],
  },
  en: {
    titulo: "Node.js vs traditional servers",
    pergunta: "What is the difference between Node.js and traditional web server technologies?",
    porqueEsteMetodo:
      "The question asks for a difference, and the honest answer is “it depends on where each request spends its time”. A side-by-side matrix shows which criterion each model wins, instead of declaring a winner.",
    resposta30s:
      "In the classic models (Apache in process or thread mode, PHP-FPM, servlet containers), every request in flight occupies a **worker**, that is, a **thread or a process**. Node.js serves them all with **one event loop and non-blocking I/O** (see T28): while one request waits for the database or the network, the same thread serves another. That favors **many connections waiting on I/O**, not **heavy CPU work per request**; it is not “always faster”.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The two models, criterion by criterion",
        colunas: ["Criterion", "Node.js (event loop)", "Worker per request (thread or process)"],
        linhas: [
          [
            "How it serves many requests",
            "One JavaScript thread switches between them: when one waits on I/O, the loop serves another",
            "Each request in flight occupies a worker from a pool; the operating system shares time among them",
          ],
          [
            "Memory per idle connection",
            "Small: a socket and the request state on the heap",
            "Larger: the thread (with its own stack) or the process is usually tied to the request while it waits",
          ],
          [
            "Many open connections waiting (chat, streaming, WebSocket)",
            "Strength: thousands of nearly idle connections cost little",
            "The worker pool can run out; it needs tuning or an event-driven mode in the server itself",
          ],
          [
            "Heavy CPU work per request",
            "Weakness: the computation blocks the loop and delays everyone; it calls for `worker_threads`, processes or another service (see T16)",
            "Strength: the heavy request occupies its own worker and the others carry on on other cores",
          ],
          [
            "Simple blocking code",
            "Dangerous: a slow synchronous call stops the whole server (see T28)",
            "Natural and safe: blocking only ties up its own worker",
          ],
          [
            "Isolation between requests",
            "All share one process and its memory; an unhandled exception takes everyone down",
            "With a process per worker, a failure affects one request; with threads, the process memory is still shared",
          ],
          [
            "Use of multiple cores",
            "One instance uses one core for its JavaScript; it scales with `cluster`, replicas or workers (see T45)",
            "Natural: several threads or processes occupy several cores",
          ],
        ],
        nota: "Modern servers mix the ideas: Nginx and Apache’s event mode also use event-driven I/O, and several current runtimes combine events with lightweight threads. The contrast holds for the classic design.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Ask where each request spends its time. If it is **waiting** (database, another API, disk, network) and there are many simultaneous connections, the Node.js event loop gets a lot done with few resources. If it is **computation** inside the request, or if the team relies on simple blocking code and isolation per request, a worker per request is simpler and safer. In real systems, combining them often pays off: Node.js at the I/O edge and services or workers for the computation.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "“Node.js is faster” is not an answer",
        texto:
          "Node.js is a **runtime**, not a ready-made web server like Apache: you write the server in JavaScript (`node:http`, Express) and usually put a reverse proxy such as Nginx in front. The model’s gain is **scale in concurrent connections**, not speed per request: a single request does not get faster just because it runs on Node.js. Compare with your real load, measuring latency and memory use, before deciding.",
      },
    ],
    armadilhas: [
      "Saying Node.js is “faster” without saying at what: for heavy CPU work or little concurrency the advantage disappears and can become a disadvantage.",
      "Comparing Node.js with a poor setup on the other side: well-tuned traditional servers, or ones in event mode, also handle many connections.",
      "Treating Node.js and Apache as equivalents: one is an execution environment where you program the server, the other is a configured server, and using both together is common.",
      "Forgetting that “one thread” is the one running your JavaScript: underneath, libuv and the operating system also work in parallel.",
    ],
    autoteste: [
      {
        pergunta:
          "Why do a thousand nearly idle chat connections cost less on a Node.js server than on a thread-per-connection server?",
        resposta:
          "In Node.js each connection is just a socket and some state in memory, and the JavaScript thread only works when an event arrives. In the classic model, a connection tied to a worker keeps a thread (with its own stack) or a process busy while it waits.",
      },
      {
        pergunta: "In which case is a server with one worker per request the best choice?",
        resposta:
          "When each request does a lot of computation, when the code is simple and blocking, or when isolation between requests matters. The computation occupies only that request’s worker; in Node.js it would block everyone’s loop.",
      },
    ],
  },
};
