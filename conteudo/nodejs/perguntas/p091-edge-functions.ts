import type { Pergunta } from "../../tipos";

// P91 · Edge functions
export const p091: Pergunta = {
  numero: 791,
  modulo: "pawanmkr-devops",
  metodo: "compare",
  pt: {
    titulo: "Edge functions",
    pergunta: "O que são edge functions e como elas se comparam a serviços de backend tradicionais?",
    porqueEsteMetodo:
      "Edge functions são uma opção de onde rodar código, e a escolha só faz sentido diante das alternativas. Uma matriz com os critérios que mudam na prática (latência, limites, dados, custo) mostra quando a borda ajuda e quando atrapalha.",
    resposta30s:
      "**Edge functions** são funções executadas em **pontos de presença** perto do usuário (a rede de uma CDN), em ambientes isolados e leves. Em troca de **baixa latência** e de um **início quase instantâneo**, elas têm **limites** de tempo, memória e APIs (em geral Web APIs, não o Node.js completo, sem sistema de arquivos nem conexões longas) e ficam longe dos dados. Servem para lógica leve na borda (redirecionar, autenticar, teste A/B, personalizar, cache), enquanto a lógica de negócio com banco e o processamento pesado continuam em um serviço regional ou tradicional.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Edge, serverless regional e backend tradicional",
        colunas: [
          "Aspecto",
          "Edge function",
          "Serverless regional (veja D85)",
          "Backend tradicional (servidor ou contêiner)",
        ],
        linhas: [
          [
            "Onde roda",
            "Em muitos pontos de presença, perto do usuário",
            "Em uma região escolhida",
            "Na região e nas máquinas que você define",
          ],
          [
            "Latência até o usuário",
            "A menor para a lógica em si, pela proximidade",
            "Depende da distância até a região",
            "Depende da distância até a região (ou de uma CDN na frente)",
          ],
          [
            "Início a frio (cold start)",
            "Em geral bem menor, pelo ambiente enxuto de isolados; varia por plataforma",
            "Perceptível; cresce com o pacote e as dependências",
            "Quase nenhum com a instância ligada; o custo é mantê-la ligada",
          ],
          [
            "Limites de execução",
            "Rígidos: tempo, memória e tamanho do código pequenos",
            "Maiores, mas existem (tempo e memória por execução)",
            "Os do seu hardware e da sua configuração",
          ],
          [
            "APIs disponíveis",
            "Em geral Web APIs (`fetch`, `Request`, `Response`, `URL`, Web Crypto); sem `fs` e sem módulos nativos; parte dos módulos do Node.js, conforme a plataforma",
            "Runtime do Node.js completo, com restrições de disco e de tempo",
            "Node.js completo, com módulos nativos e acesso ao sistema",
          ],
          [
            "Estado e conexões",
            "Sem estado; conexões longas (pool de banco, WebSocket de longa duração) dependem da plataforma",
            "Sem estado entre invocações; conexões reaproveitadas só enquanto a instância vive",
            "Estado em memória e pools de conexão persistentes",
          ],
          [
            "Dados",
            "Longe do banco: cada ida e volta a uma região distante anula o ganho; pede dados na borda (cache, armazenamento chave-valor, réplicas) ou chamadas HTTP enxutas",
            "Perto do banco, se estiver na mesma região",
            "Perto do banco, com conexões persistentes",
          ],
          [
            "Custo e dependência do provedor",
            "Cobrança por uso (confira o modelo atual); APIs e armazenamento próprios da plataforma aumentam o lock-in",
            "Cobrança por uso; o código muda pouco, mas gatilhos e serviços prendem ao provedor",
            "Custo da capacidade ligada; menor lock-in",
          ],
          [
            "Depuração e testes",
            "Emuladores locais diferem da produção; logs espalhados por muitos pontos de presença",
            "Logs centralizados no provedor; emuladores e testes locais",
            "Depurador, profiling e acesso direto à máquina",
          ],
        ],
        nota: "Exemplos de plataformas de borda: Cloudflare Workers, Vercel Edge, Netlify Edge Functions, Deno Deploy. Os recursos e limites mudam com frequência: confira a documentação de cada uma.",
      },
      {
        tipo: "tabela",
        titulo: "O que cabe na borda",
        colunas: ["Caso de uso", "Cabe na borda?", "Por quê"],
        linhas: [
          ["Redirecionar ou reescrever URLs", "Sim", "Decisão rápida sobre caminho e cabeçalhos, sem dados externos"],
          [
            "Autenticar (verificar um token assinado)",
            "Sim",
            "Valida a assinatura localmente e barra requisições inválidas antes da origem; consultar sessão num banco distante já não vale",
          ],
          [
            "Teste A/B e feature flags",
            "Sim",
            "Escolhe a variante por cookie ou sorteio e repassa; a configuração é pequena ou replicada na borda",
          ],
          [
            "Personalizar por país, idioma ou dispositivo",
            "Sim",
            "Usa informações da própria requisição para escolher a resposta ou a chave de cache",
          ],
          [
            "Cache e transformação de respostas",
            "Sim",
            "Ajusta cabeçalhos, chaves de cache e partes da resposta perto do usuário",
          ],
          [
            "API com várias consultas a um banco central",
            "Em geral não",
            "Cada consulta atravessa a distância até o banco; mantenha na região do dado ou replique os dados",
          ],
          [
            "Processamento pesado, trabalho longo ou bibliotecas nativas",
            "Não",
            "Limites de tempo, memória e APIs; use serviços regionais, filas e workers",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Coloque na borda a lógica **leve, sem estado e que ganha com a proximidade** do usuário (decidir, validar, redirecionar, personalizar, fazer cache). Mantenha no serviço regional ou tradicional o que precisa de **banco central, conexões longas, bibliotecas nativas ou processamento pesado**. O desenho que costuma funcionar é híbrido: a borda decide e filtra, e a origem faz o trabalho de negócio.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Borda não é Node.js completo",
        texto:
          "O ambiente é enxuto e varia por plataforma: confira quais APIs e módulos existem antes de depender deles (código com `fs`, módulos nativos ou drivers que abrem sockets TCP pode não rodar). O ganho de latência também desaparece quando a função faz várias idas e voltas a um banco em outra região: aproxime os dados (cache, armazenamento replicado, réplicas de leitura) ou mantenha a função perto do dado. Prefira Web APIs padrão, para limitar o lock-in.",
      },
    ],
    armadilhas: [
      "Levar uma API inteira para a borda e deixar o banco numa única região: cada requisição faz várias viagens longas até o dado e fica mais lenta do que na região.",
      "Assumir que existe todo o Node.js (`fs`, módulos nativos, drivers que abrem sockets, pacotes que dependem de `process`) e descobrir no deploy que o pacote não roda.",
      "Guardar estado em variável global ou na memória da função: o ambiente é efêmero e replicado em muitos pontos de presença, então cada um vê um valor. Use o armazenamento da plataforma e pense em consistência.",
      "Ignorar limites, custo por invocação e lock-in: tempo e memória pequenos, funções muito chamadas e APIs proprietárias de armazenamento pesam na conta e dificultam sair do provedor, e a observabilidade fraca por ponto de presença atrapalha o diagnóstico.",
    ],
    autoteste: [
      {
        pergunta: "Por que acessar um banco em outra região pode anular o ganho de uma edge function?",
        resposta:
          "Porque o ganho é a distância curta entre o usuário e a função; se a função faz várias consultas a um banco distante, cada ida e volta paga a distância longa. A latência total passa a ser dominada pelo trajeto até o dado.",
      },
      {
        pergunta: "Uma edge function é o mesmo que um servidor Node.js numa CDN?",
        resposta:
          "Não. Em geral é um runtime enxuto de isolados, com Web APIs e só parte das APIs do Node.js, sem sistema de arquivos e com limites de tempo e de memória. Confira na documentação da plataforma o que está disponível.",
      },
    ],
  },
  en: {
    titulo: "Edge functions",
    pergunta: "What are edge functions and how do they compare to traditional backend services?",
    porqueEsteMetodo:
      "Edge functions are one option for where to run code, and the choice only makes sense against the alternatives. A matrix with the criteria that change in practice (latency, limits, data, cost) shows when the edge helps and when it hurts.",
    resposta30s:
      "**Edge functions** are functions that run at **points of presence** close to the user (a CDN’s network), in isolated, lightweight environments. In exchange for **low latency** and an **almost instant start**, they have **limits** on time, memory and APIs (usually Web APIs, not the full Node.js, with no file system and no long connections) and sit far from the data. They suit light logic at the edge (redirecting, authenticating, A/B tests, personalizing, caching), while business logic with a database and heavy processing stay in a regional or traditional service.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Edge, regional serverless and traditional backend",
        colunas: [
          "Aspect",
          "Edge function",
          "Regional serverless (see D85)",
          "Traditional backend (server or container)",
        ],
        linhas: [
          [
            "Where it runs",
            "At many points of presence, close to the user",
            "In one chosen region",
            "In the region and on the machines you define",
          ],
          [
            "Latency to the user",
            "The lowest for the logic itself, because of proximity",
            "Depends on the distance to the region",
            "Depends on the distance to the region (or on a CDN in front)",
          ],
          [
            "Cold start",
            "Usually much smaller, thanks to the lean isolate environment; varies by platform",
            "Noticeable; grows with the package and dependencies",
            "Almost none with the instance running; the cost is keeping it running",
          ],
          [
            "Execution limits",
            "Strict: small time, memory and code size",
            "Larger, but they exist (time and memory per execution)",
            "Those of your hardware and configuration",
          ],
          [
            "Available APIs",
            "Usually Web APIs (`fetch`, `Request`, `Response`, `URL`, Web Crypto); no `fs` and no native modules; some Node.js modules, depending on the platform",
            "A full Node.js runtime, with disk and time restrictions",
            "Full Node.js, with native modules and system access",
          ],
          [
            "State and connections",
            "Stateless; long connections (database pool, long-lived WebSocket) depend on the platform",
            "Stateless between invocations; connections are reused only while the instance lives",
            "In-memory state and persistent connection pools",
          ],
          [
            "Data",
            "Far from the database: each round trip to a distant region cancels the gain; needs data at the edge (cache, key-value storage, replicas) or lean HTTP calls",
            "Close to the database, if in the same region",
            "Close to the database, with persistent connections",
          ],
          [
            "Cost and provider dependence",
            "Billed by use (check the current model); the platform’s own APIs and storage raise the lock-in",
            "Billed by use; the code changes little, but triggers and services tie you to the provider",
            "Cost of the capacity kept running; lower lock-in",
          ],
          [
            "Debugging and testing",
            "Local emulators differ from production; logs scattered across many points of presence",
            "Logs centralized at the provider; local emulators and tests",
            "Debugger, profiling and direct access to the machine",
          ],
        ],
        nota: "Examples of edge platforms: Cloudflare Workers, Vercel Edge, Netlify Edge Functions, Deno Deploy. Features and limits change often: check each one’s documentation.",
      },
      {
        tipo: "tabela",
        titulo: "What fits at the edge",
        colunas: ["Use case", "Fits at the edge?", "Why"],
        linhas: [
          ["Redirecting or rewriting URLs", "Yes", "A quick decision about path and headers, with no external data"],
          [
            "Authenticating (verifying a signed token)",
            "Yes",
            "Validates the signature locally and blocks invalid requests before the origin; looking up a session in a distant database no longer pays off",
          ],
          [
            "A/B tests and feature flags",
            "Yes",
            "Picks the variant by cookie or draw and forwards it; the configuration is small or replicated at the edge",
          ],
          [
            "Personalizing by country, language or device",
            "Yes",
            "Uses information from the request itself to choose the response or the cache key",
          ],
          [
            "Caching and transforming responses",
            "Yes",
            "Adjusts headers, cache keys and parts of the response close to the user",
          ],
          [
            "An API with several queries to a central database",
            "Usually not",
            "Each query crosses the distance to the database; keep it in the data’s region or replicate the data",
          ],
          [
            "Heavy processing, long-running work or native libraries",
            "No",
            "Limits on time, memory and APIs; use regional services, queues and workers",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Put at the edge the logic that is **light, stateless and gains from proximity** to the user (deciding, validating, redirecting, personalizing, caching). Keep in the regional or traditional service whatever needs a **central database, long connections, native libraries or heavy processing**. The design that tends to work is hybrid: the edge decides and filters, and the origin does the business work.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The edge is not full Node.js",
        texto:
          "The environment is lean and varies by platform: check which APIs and modules exist before depending on them (code that uses `fs`, native modules or drivers that open TCP sockets may not run). The latency gain also disappears when the function makes several round trips to a database in another region: bring the data closer (cache, replicated storage, read replicas) or keep the function near the data. Prefer standard Web APIs to limit lock-in.",
      },
    ],
    armadilhas: [
      "Moving a whole API to the edge and leaving the database in a single region: each request makes several long trips to the data and ends up slower than in the region.",
      "Assuming all of Node.js exists (`fs`, native modules, drivers that open sockets, packages that depend on `process`) and finding out at deploy time that the package does not run.",
      "Keeping state in a global variable or in the function’s memory: the environment is ephemeral and replicated across many points of presence, so each one sees a different value. Use the platform’s storage and think about consistency.",
      "Ignoring limits, per-invocation cost and lock-in: small time and memory, heavily called functions and proprietary storage APIs weigh on the bill and make leaving the provider hard, and weak observability per point of presence gets in the way of diagnosis.",
    ],
    autoteste: [
      {
        pergunta: "Why can accessing a database in another region cancel the gain of an edge function?",
        resposta:
          "Because the gain is the short distance between the user and the function; if the function makes several queries to a distant database, each round trip pays the long distance. Total latency becomes dominated by the trip to the data.",
      },
      {
        pergunta: "Is an edge function the same as a Node.js server on a CDN?",
        resposta:
          "No. It is usually a lean isolate runtime, with Web APIs and only part of the Node.js APIs, no file system and limits on time and memory. Check the platform’s documentation for what is available.",
      },
    ],
  },
};
