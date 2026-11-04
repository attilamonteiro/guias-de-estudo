import type { Pergunta } from "../../tipos";

// D98 · Machine learning com Node.js
export const d098: Pergunta = {
  numero: 398,
  modulo: "devinterview-cenarios",
  metodo: "compare",
  pt: {
    titulo: "Machine learning com Node.js",
    pergunta: "É possível usar o Node.js para machine learning? Se sim, como?",
    porqueEsteMetodo:
      "“Sim ou não?” pede nuance: as alternativas existem de verdade e se diferenciam por onde o modelo roda. Uma matriz mostra os caminhos lado a lado, com o que cada um custa.",
    resposta30s:
      "**Sim, com limites:** o Node.js executa **inferência** (TensorFlow.js, ONNX Runtime para Node, Transformers.js), chama **APIs de modelos hospedados**, incluindo LLMs, ou orquestra um **serviço em Python** por REST, gRPC ou fila. Ele brilha em orquestração, tempo real e E/S, enquanto o **treino** de modelos pesados, com seu ecossistema e a GPU, fica em Python. Trabalho de CPU deve sair do laço de eventos, em **worker threads** (veja L73).",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Quatro caminhos",
        colunas: ["Abordagem", "Como funciona", "Bom para", "Limites"],
        linhas: [
          [
            "Inferência dentro do Node.js",
            "Carrega um modelo já treinado (TensorFlow.js, ONNX Runtime, Transformers.js) e o executa no próprio processo",
            "Modelos pequenos e médios, baixa latência sem rede e dados que não podem sair do seu ambiente",
            "Usa CPU (ou a aceleração disponível) e memória do processo; modelo grande multiplica a memória por instância; trava o laço se rodar na thread principal",
          ],
          [
            "API de modelo hospedado",
            "O Node.js envia a entrada por HTTP ou SDK e recebe a resposta, muitas vezes em streaming",
            "Linguagem natural e visão sem operar infraestrutura, e começar rápido",
            "Latência de rede, custo por uso, limites de taxa, privacidade dos dados enviados e dependência do provedor",
          ],
          [
            "Serviço Python separado",
            "O treino e a inferência rodam em Python (com GPU, se houver); o Node.js expõe a API e coordena por REST, gRPC ou fila",
            "Treino pesado, bibliotecas científicas maduras e equipes de dados e de back-end separadas",
            "Dois runtimes para operar, contratos entre serviços, versionamento do modelo e observabilidade dos dois lados",
          ],
          [
            "Bindings nativos e WebAssembly",
            "O Node.js chama uma biblioteca em C++ ou um módulo WASM",
            "Desempenho próximo do nativo num trecho específico",
            "Compilação e compatibilidade por plataforma, e manutenção do binding",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Ferramentas, sem ranking",
        colunas: ["Ferramenta", "Para que serve", "Ressalva"],
        linhas: [
          [
            "TensorFlow.js",
            "Executar (e treinar modelos pequenos) em JavaScript, no navegador ou no Node.js, com backend nativo opcional no servidor",
            "Confira a manutenção atual e a compatibilidade com a sua versão do Node.js",
          ],
          [
            "ONNX Runtime para Node",
            "Executar modelos exportados no formato ONNX (de PyTorch, scikit-learn e outros)",
            "Depende de exportar o modelo corretamente e de binários por plataforma",
          ],
          [
            "Transformers.js",
            "Rodar modelos abertos de linguagem, visão e áudio, no navegador e no Node.js",
            "Modelos grandes são pesados, e o conjunto de modelos suportados muda",
          ],
          [
            "SDKs de provedores de modelos",
            "Chamar LLMs e outros modelos hospedados, com tipos e streaming",
            "Cada SDK acompanha um provedor; isolá-lo atrás de uma interface própria facilita trocar",
          ],
          [
            "Bibliotecas de ML clássico em JavaScript",
            "Casos simples (regressão, árvores, agrupamento) sem sair do Node.js",
            "Escopo e maturidade variam muito: avalie antes de adotar",
          ],
        ],
        nota: "A lista é ilustrativa e não indica preferência. Maturidade e manutenção mudam com o tempo: confira o repositório, os lançamentos recentes e a documentação antes de adotar.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Treinar ou inferir",
        texto:
          "**Treinar** exige muito cálculo, dados em volume e, em geral, GPU: faça em Python (ou numa plataforma de treino gerenciada) e exporte o modelo. **Inferir**, isto é, usar o modelo pronto, cabe no Node.js quando o modelo é pequeno ou quando é uma chamada de API. Regra: o Node.js é boa ideia como **cola e produto** (orquestração, tempo real, streaming, E/S, APIs) e má ideia como **laboratório de treino**.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não bloqueie o laço de eventos",
        texto:
          "Inferência no processo é trabalho de CPU: na thread principal, ela congela todas as requisições. Mova-a para **worker threads** (veja L73), um serviço separado ou uma fila (veja L77). Cada worker ou réplica carrega a sua própria cópia do modelo na memória, então dimensione com isso em mente. Dados enviados a APIs externas saem do seu ambiente: considere privacidade e conformidade, e trate a saída de um modelo como entrada não confiável, validando antes de agir.",
      },
    ],
    armadilhas: [
      "Treinar um modelo grande em Node.js (ou na thread principal de um servidor web): o ecossistema, a GPU e as ferramentas estão em Python, e o laço de eventos trava.",
      "Rodar inferência de CPU na thread principal: a API inteira para durante cada predição.",
      "Carregar o modelo a cada requisição, em vez de uma vez na partida (ou por worker): latência e memória explodem.",
      "Confundir “chamar uma API de LLM” com dominar ML, ou enviar dados sensíveis a um provedor sem avaliar privacidade e contrato.",
    ],
    autoteste: [
      {
        pergunta: "Quando você escolheria um serviço Python em vez de rodar o modelo no Node.js?",
        resposta:
          "Quando é preciso treinar, usar GPU, bibliotecas científicas sem equivalente em JavaScript ou modelos grandes. O Node.js continua na frente, expondo a API e orquestrando por REST, gRPC ou fila.",
      },
      {
        pergunta: "Como evitar que a inferência trave a API?",
        resposta:
          "Tirar o trabalho de CPU da thread principal: worker threads, um serviço separado ou uma fila com workers. Carregar o modelo uma vez por worker e limitar a concorrência.",
      },
    ],
  },
  en: {
    titulo: "Machine learning with Node.js",
    pergunta: "Can you use Node.js for machine learning? If so, how?",
    porqueEsteMetodo:
      "“Yes or no?” calls for nuance: the alternatives really exist and differ in where the model runs. A matrix shows the paths side by side, with what each one costs.",
    resposta30s:
      "**Yes, with limits:** Node.js runs **inference** (TensorFlow.js, ONNX Runtime for Node, Transformers.js), calls **hosted model APIs**, including LLMs, or orchestrates a **Python service** over REST, gRPC or a queue. It shines at orchestration, real time and I/O, while **training** heavy models, with its ecosystem and the GPU, stays in Python. CPU work must leave the event loop, in **worker threads** (see L73).",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Four paths",
        colunas: ["Approach", "How it works", "Good for", "Limits"],
        linhas: [
          [
            "Inference inside Node.js",
            "Loads an already trained model (TensorFlow.js, ONNX Runtime, Transformers.js) and runs it in the process itself",
            "Small and medium models, low latency without a network and data that can’t leave your environment",
            "Uses CPU (or whatever acceleration is available) and process memory; a large model multiplies memory per instance; it blocks the loop if it runs on the main thread",
          ],
          [
            "Hosted model API",
            "Node.js sends the input over HTTP or an SDK and receives the response, often streamed",
            "Natural language and vision without operating infrastructure, and a quick start",
            "Network latency, per-use cost, rate limits, privacy of the data sent and provider dependence",
          ],
          [
            "Separate Python service",
            "Training and inference run in Python (with a GPU, if available); Node.js exposes the API and coordinates over REST, gRPC or a queue",
            "Heavy training, mature scientific libraries and separate data and back-end teams",
            "Two runtimes to operate, contracts between services, model versioning and observability on both sides",
          ],
          [
            "Native bindings and WebAssembly",
            "Node.js calls a C++ library or a WASM module",
            "Near-native performance for a specific piece",
            "Compilation and per-platform compatibility, and maintaining the binding",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Tools, unranked",
        colunas: ["Tool", "What it is for", "Caveat"],
        linhas: [
          [
            "TensorFlow.js",
            "Running (and training small models) in JavaScript, in the browser or Node.js, with an optional native backend on the server",
            "Check current maintenance and compatibility with your Node.js version",
          ],
          [
            "ONNX Runtime for Node",
            "Running models exported in the ONNX format (from PyTorch, scikit-learn and others)",
            "Depends on exporting the model correctly and on per-platform binaries",
          ],
          [
            "Transformers.js",
            "Running open language, vision and audio models, in the browser and in Node.js",
            "Large models are heavy, and the set of supported models changes",
          ],
          [
            "Model-provider SDKs",
            "Calling LLMs and other hosted models, with types and streaming",
            "Each SDK follows one provider; isolating it behind your own interface makes switching easier",
          ],
          [
            "Classical ML libraries in JavaScript",
            "Simple cases (regression, trees, clustering) without leaving Node.js",
            "Scope and maturity vary widely: evaluate before adopting",
          ],
        ],
        nota: "The list is illustrative and implies no preference. Maturity and maintenance change over time: check the repository, recent releases and the documentation before adopting.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Train or infer",
        texto:
          "**Training** takes a lot of computation, data in volume and, usually, a GPU: do it in Python (or on a managed training platform) and export the model. **Inference**, that is, using the finished model, fits in Node.js when the model is small or when it is an API call. Rule: Node.js is a good idea as **glue and product** (orchestration, real time, streaming, I/O, APIs) and a bad idea as a **training lab**.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Don’t block the event loop",
        texto:
          "In-process inference is CPU work: on the main thread, it freezes every request. Move it to **worker threads** (see L73), a separate service or a queue (see L77). Each worker or replica loads its own copy of the model into memory, so size things with that in mind. Data sent to external APIs leaves your environment: consider privacy and compliance, and treat a model’s output as untrusted input, validating before acting.",
      },
    ],
    armadilhas: [
      "Training a large model in Node.js (or on a web server’s main thread): the ecosystem, the GPU and the tooling are in Python, and the event loop locks up.",
      "Running CPU inference on the main thread: the whole API stops during each prediction.",
      "Loading the model on every request instead of once at startup (or per worker): latency and memory explode.",
      "Confusing “calling an LLM API” with mastering ML, or sending sensitive data to a provider without assessing privacy and the contract.",
    ],
    autoteste: [
      {
        pergunta: "When would you choose a Python service instead of running the model in Node.js?",
        resposta:
          "When you need to train, use a GPU, scientific libraries with no JavaScript equivalent, or large models. Node.js stays in front, exposing the API and orchestrating over REST, gRPC or a queue.",
      },
      {
        pergunta: "How do you keep inference from blocking the API?",
        resposta:
          "Take the CPU work off the main thread: worker threads, a separate service or a queue with workers. Load the model once per worker and limit concurrency.",
      },
    ],
  },
};
