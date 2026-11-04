import type { Pergunta } from "../../tipos";

// Q02 · Vantagens e desvantagens
export const q02: Pergunta = {
  numero: 2,
  modulo: "turing-basicas",
  metodo: "compare",
  pt: {
    titulo: "Vantagens e desvantagens",
    pergunta: "Quais são as principais vantagens e desvantagens em usar o Node.js?",
    porqueEsteMetodo:
      "Vantagem e desvantagem são os dois lados da mesma escolha de projeto. Numa matriz, aspecto por aspecto, fica claro que quase toda vantagem tem um custo, e a regra de decisão diz quando o Node.js compensa.",
    resposta30s:
      "**Vantagens**: muita concorrência de E/S com poucos recursos (laço de eventos e E/S não bloqueante), **JavaScript/TypeScript** no servidor e no navegador, o enorme ecossistema do **npm**, desenvolvimento rápido e **multiplataforma** (Windows, macOS e Linux). **Desvantagens**: tarefas pesadas de **CPU bloqueiam** o laço de eventos, o modelo assíncrono exige disciplina com erros, a qualidade e a segurança das dependências variam e o ecossistema muda rápido. Use onde o gargalo é E/S e delegue a CPU.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspecto", "Vantagem", "Desvantagem"],
        linhas: [
          [
            "Concorrência",
            "Atende muitas conexões ao mesmo tempo com poucos recursos: o laço de eventos não fica parado esperando a E/S",
            "Uma conta pesada na thread principal trava todas as requisições até terminar",
          ],
          [
            "Linguagem",
            "Um idioma só (JavaScript ou TypeScript) no front-end e no back-end; times, validações e tipos se reaproveitam",
            "JavaScript é dinâmico: muitos erros só aparecem em execução, e o TypeScript reduz o risco com custo de configuração",
          ],
          [
            "Ecossistema",
            "O npm tem pacote para quase tudo, e instalar é simples",
            "Qualidade desigual, árvores enormes de dependências e risco de pacote abandonado ou malicioso",
          ],
          [
            "Produtividade",
            "Protótipos rápidos, JSON nativo e ferramentas de desenvolvimento ricas",
            "Poucas convenções impostas: a equipe precisa escolher e padronizar estrutura e bibliotecas",
          ],
          [
            "Modelo assíncrono",
            "Natural para E/S: rede, banco e arquivos em paralelo sem gerenciar threads à mão",
            "Callbacks, promises e `async`/`await` pedem cuidado: uma rejeição não tratada pode encerrar o processo ou esconder uma falha",
          ],
          [
            "Escala",
            "Fácil de replicar em vários processos e contêineres; `cluster` e workers ajudam a usar vários núcleos",
            "A thread principal usa um núcleo: para aproveitar a máquina inteira são necessários processos, workers ou várias instâncias",
          ],
          [
            "Multiplataforma",
            "O mesmo código roda em Windows, macOS e Linux",
            "Diferenças de sistema (caminhos, sinais, quebras de linha) e módulos nativos compilados por plataforma pedem atenção",
          ],
          [
            "Manutenção",
            "Versões LTS dão uma janela de suporte previsível",
            "O ecossistema muda rápido: dependências e APIs evoluem, e atualizar dá trabalho (veja Q54)",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "O Node.js compensa quando o gargalo é **E/S** (APIs, tempo real, proxies, ferramentas) e o time já conhece JavaScript. Pense duas vezes quando o núcleo do produto é **cálculo pesado de CPU** (processamento de vídeo, treino de modelos, simulações): para essa parte, use `worker_threads`, processos separados ou outra tecnologia, e deixe o Node.js na orquestração.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "“Uma thread só” não quer dizer “não escala”",
        texto:
          "O JavaScript do seu código roda em uma thread, mas o Node.js usa o sistema operacional e outras threads por baixo para a E/S, e você escala com vários processos, workers e instâncias atrás de um balanceador. A desvantagem real é bloquear o laço de eventos, e não uma suposta incapacidade de crescer (veja Q16 e Q50).",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "O Node.js é multiplataforma?",
        texto:
          "Sim: roda em Windows, macOS e Linux (entre outras plataformas), e o mesmo código costuma funcionar em todas. Para não quebrar, monte caminhos com `node:path` em vez de concatenar `/` ou `\\`, não presuma sinais nem comandos de shell de um sistema só e lembre que módulos nativos podem precisar de compilação ou de binários por plataforma.",
      },
    ],
    armadilhas: [
      "Dizer que o Node.js é “rápido” sem dizer em quê: ele é bom em E/S concorrente, não em cálculo pesado.",
      "Rodar tarefas de CPU (compressão grande, laços enormes, criptografia pesada) direto na thread principal.",
      "Esquecer que cada dependência é código de terceiros: sem `npm audit`, lockfile e revisão, o risco entra pelo `node_modules`.",
      "Responder só com vantagens: numa entrevista, mostre os custos e diga quando você não escolheria o Node.js.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a principal desvantagem do Node.js e como contorná-la?",
        resposta:
          "Tarefas de CPU bloqueiam o laço de eventos. Contorne com `worker_threads`, processos filhos, uma fila com workers ou um serviço em outra tecnologia para essa parte.",
      },
      {
        pergunta: "Por que o Node.js lida bem com muitas conexões ao mesmo tempo?",
        resposta:
          "Porque a E/S é não bloqueante: enquanto uma requisição espera, o laço de eventos atende outras, sem uma thread por conexão.",
      },
      {
        pergunta: "O Node.js é multiplataforma?",
        resposta:
          "Sim. O mesmo código roda em Windows, macOS e Linux; os cuidados são com caminhos, sinais, comandos de shell e módulos nativos.",
      },
    ],
  },
  en: {
    titulo: "Pros and cons",
    pergunta: "What are the main advantages and disadvantages of using Node.js?",
    porqueEsteMetodo:
      "Advantages and disadvantages are two sides of the same design choice. In a matrix, aspect by aspect, it becomes clear that almost every advantage has a cost, and the decision rule says when Node.js pays off.",
    resposta30s:
      "**Advantages**: lots of I/O concurrency with few resources (event loop and non-blocking I/O), **JavaScript/TypeScript** on the server and in the browser, the huge **npm** ecosystem, fast development and **cross-platform** support (Windows, macOS and Linux). **Disadvantages**: heavy **CPU** work **blocks** the event loop, the async model demands discipline with errors, dependency quality and security vary, and the ecosystem moves fast. Use it where the bottleneck is I/O and delegate the CPU work.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspect", "Advantage", "Disadvantage"],
        linhas: [
          [
            "Concurrency",
            "Serves many connections at once with few resources: the event loop does not sit idle waiting for I/O",
            "One heavy computation on the main thread freezes every request until it finishes",
          ],
          [
            "Language",
            "A single language (JavaScript or TypeScript) on the front end and back end; teams, validations and types are reused",
            "JavaScript is dynamic: many errors only show up at run time, and TypeScript lowers the risk at a configuration cost",
          ],
          [
            "Ecosystem",
            "npm has a package for almost everything, and installing is simple",
            "Uneven quality, huge dependency trees and the risk of abandoned or malicious packages",
          ],
          [
            "Productivity",
            "Quick prototypes, native JSON and rich development tooling",
            "Few enforced conventions: the team must choose and standardize structure and libraries",
          ],
          [
            "Async model",
            "Natural for I/O: network, database and files in parallel without managing threads by hand",
            "Callbacks, promises and `async`/`await` need care: an unhandled rejection can end the process or hide a failure",
          ],
          [
            "Scaling",
            "Easy to replicate across processes and containers; `cluster` and workers help use several cores",
            "The main thread uses one core: using the whole machine takes processes, workers or several instances",
          ],
          [
            "Cross-platform",
            "The same code runs on Windows, macOS and Linux",
            "System differences (paths, signals, line endings) and native modules built per platform need attention",
          ],
          [
            "Maintenance",
            "LTS releases give a predictable support window",
            "The ecosystem moves fast: dependencies and APIs evolve, and upgrading takes work (see Q54)",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Node.js pays off when the bottleneck is **I/O** (APIs, real time, proxies, tooling) and the team already knows JavaScript. Think twice when the core of the product is **heavy CPU computation** (video processing, model training, simulations): for that part use `worker_threads`, separate processes or another technology, and keep Node.js for orchestration.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "“Single thread” does not mean “does not scale”",
        texto:
          "Your JavaScript runs on one thread, but Node.js uses the operating system and other threads underneath for I/O, and you scale with several processes, workers and instances behind a load balancer. The real disadvantage is blocking the event loop, not some supposed inability to grow (see Q16 and Q50).",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Is Node.js cross-platform?",
        texto:
          "Yes: it runs on Windows, macOS and Linux (among other platforms), and the same code usually works on all of them. To avoid breakage, build paths with `node:path` instead of concatenating `/` or `\\`, do not assume signals or shell commands from a single system, and remember that native modules may need compilation or per-platform binaries.",
      },
    ],
    armadilhas: [
      "Saying Node.js is “fast” without saying at what: it is good at concurrent I/O, not at heavy computation.",
      "Running CPU tasks (large compression, huge loops, heavy cryptography) directly on the main thread.",
      "Forgetting that every dependency is third-party code: without `npm audit`, a lockfile and review, risk enters through `node_modules`.",
      "Answering with advantages only: in an interview, show the costs and say when you would not pick Node.js.",
    ],
    autoteste: [
      {
        pergunta: "What is Node.js’s main disadvantage and how do you work around it?",
        resposta:
          "CPU-heavy tasks block the event loop. Work around it with `worker_threads`, child processes, a queue with workers or a service in another technology for that part.",
      },
      {
        pergunta: "Why does Node.js handle many simultaneous connections well?",
        resposta:
          "Because I/O is non-blocking: while one request waits, the event loop serves others, without a thread per connection.",
      },
      {
        pergunta: "Is Node.js cross-platform?",
        resposta:
          "Yes. The same code runs on Windows, macOS and Linux; the care points are paths, signals, shell commands and native modules.",
      },
    ],
  },
};
