import type { Pergunta } from "../../tipos";

// D85 · Serverless e Node.js
export const d085: Pergunta = {
  numero: 385,
  modulo: "devinterview-escala",
  metodo: "feynman",
  pt: {
    titulo: "Serverless e Node.js",
    pergunta: "O que é a arquitetura serverless e como ela se relaciona com o Node.js?",
    porqueEsteMetodo:
      "Serverless é um nome enganoso e um conceito que a analogia do táxi explica bem: pagar pela corrida, não pelo carro. Depois vêm o mecanismo (eventos, instâncias, cold start) e o ponto em que a imagem para de valer.",
    resposta30s:
      "Em **serverless** você entrega o código e o provedor cuida dos servidores. O modelo mais comum é o **FaaS** (AWS Lambda, Azure Functions…): uma função é **disparada por um evento**, **escala por demanda** (até zero) e é **cobrada pelo uso**. O Node.js combina bem porque inicia rápido e vive de E/S assíncrona, mas o **cold start** depende do tamanho do pacote e das dependências, a função é **sem estado e de curta duração** e as **conexões de banco** precisam ser reaproveitadas fora do handler.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Ter servidor próprio é como ter carro próprio: você paga mesmo com ele parado na garagem e cuida de seguro, conserto e estacionamento, mas ele está sempre à porta. Serverless é chamar um táxi: você pede quando precisa, paga pela corrida e nunca pensa em estacionamento. Em compensação, o táxi leva um tempo para chegar, não guarda o que você deixou no banco da corrida anterior e, se você roda o dia inteiro, a conta pode ficar maior que a do carro.",
        tecnico:
          "**Serverless** não significa “sem servidores”: eles existem, mas são do provedor, que aloca, escala e corrige tudo. No modelo **FaaS** (AWS Lambda, Azure Functions, funções do Google Cloud), você publica uma função que o provedor executa em resposta a um **evento** (requisição HTTP, mensagem de fila, arquivo novo no armazenamento, agendamento). Há tantas instâncias quantas forem necessárias, inclusive nenhuma, e a cobrança acompanha o uso (confira o modelo atual do provedor). O Node.js é escolha frequente: o runtime sobe depressa, e o código de cola, feito de chamadas HTTP e acessos a serviços, é E/S assíncrona, o ponto forte da plataforma (veja T28).",
        limite:
          "O táxi tem limites que o carro próprio não tem: a função é **sem estado** (nada em memória ou em disco local está garantido na próxima chamada), de **curta duração** (há limite de tempo e de memória por execução) e a primeira chamada de uma instância nova paga o **cold start**. Para carga alta e constante, ou processos longos, um servidor ou contêiner sempre ligado costuma ser mais simples e, em muitos casos, mais barato.",
      },
      {
        tipo: "fluxo",
        titulo: "A vida de uma invocação",
        etapas: [
          "Chega um evento (HTTP, fila, arquivo novo, agenda) e o provedor procura uma instância livre da função",
          "Sem instância livre, ocorre o **cold start**: baixa o pacote, inicia o runtime do Node.js e executa o código fora do handler (imports, conexões)",
          "O provedor chama o seu **handler** com o evento; ele faz o trabalho e devolve o resultado",
          "A instância fica “morna” por um tempo: um novo evento nessa janela reaproveita o que foi criado fora do handler",
          "Sem tráfego, a instância é descartada; com picos, o provedor cria mais instâncias em paralelo, cada uma com as suas conexões",
        ],
      },
      {
        tipo: "codigo",
        titulo: "Reaproveitar a conexão fora do handler",
        legenda: "JavaScript",
        codigo:
          'import { criarPool } from "./banco.js"; // seu cliente de banco (hipotético)\n\n// Fora do handler: roda uma vez por instância e é reaproveitado\n// nas invocações seguintes, enquanto a instância estiver morna\nconst pool = criarPool({ max: 1 });\n\nexport async function handler(evento) {\n  const { id } = JSON.parse(evento.body);\n  const resultado = await pool.query("select * from pedidos where id = $1", [id]);\n\n  return {\n    statusCode: 200,\n    body: JSON.stringify(resultado.rows[0] ?? null),\n  };\n}',
        nota: "A assinatura do handler e o formato do evento variam por provedor. O reaproveitamento entre chamadas é uma otimização, não uma garantia: nunca guarde estado importante ali. Em picos, muitas instâncias abrem muitas conexões; um proxy ou pool de conexões do lado do banco costuma ser necessário.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Quando usar e quando não",
        texto:
          "Combina com **APIs de tráfego irregular**, webhooks, tarefas disparadas por evento (processar um arquivo enviado, mandar um e-mail), automação agendada e protótipos. Pesa contra: processamento longo ou de CPU contínua, tráfego alto e constante, latência muito baixa e previsível (cold start), estado em memória, WebSockets de longa duração e dependência de bibliotecas nativas ou pacotes enormes.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cold start e conexões de banco",
        texto:
          "No Node.js, o cold start cresce com o **tamanho do pacote** e com o que roda na carga do módulo: dependências pesadas, `import` de tudo no começo, abertura de conexões. Reduza o pacote (empacotador, só o que a função usa, carregamento sob demanda). E lembre que cada instância concorrente tem o seu pool: com mil execuções simultâneas, um pool de dez conexões vira dez mil. Use pool pequeno, um proxy de conexões ou um banco pensado para isso.",
      },
    ],
    armadilhas: [
      "Guardar estado em variável global ou em disco local esperando que esteja lá na próxima chamada: as instâncias são criadas e descartadas sem aviso.",
      "Abrir a conexão de banco dentro do handler a cada invocação (lento) ou criar um pool grande por instância (esgota o banco em picos).",
      "Empacotar o `node_modules` inteiro, com dependências de desenvolvimento e bibliotecas que a função não usa: o cold start cresce com o pacote.",
      "Esquecer limites e repetição: a função pode estourar o tempo, e eventos de fila costumam ser entregues mais de uma vez, então o código precisa ser idempotente (veja L104).",
    ],
    autoteste: [
      {
        pergunta: "Serverless quer dizer que não existem servidores?",
        resposta:
          "Não. Os servidores existem, mas são alocados, escalados e mantidos pelo provedor. “Sem servidor” vale do ponto de vista de quem escreve o código: você não provisiona nem administra máquinas.",
      },
      {
        pergunta: "Por que a conexão de banco fica fora do handler?",
        resposta:
          "Porque o que está fora do handler roda uma vez por instância e é reaproveitado enquanto ela estiver morna; dentro, o custo de abrir a conexão se repetiria em toda invocação. Como o reaproveitamento não é garantido, o código deve tolerar uma conexão nova.",
      },
    ],
  },
  en: {
    titulo: "Serverless and Node.js",
    pergunta: "What is serverless architecture, and how does it relate to Node.js?",
    porqueEsteMetodo:
      "Serverless is a misleading name and a concept the taxi analogy explains well: paying for the ride, not for the car. Then come the mechanism (events, instances, cold start) and the point where the picture stops holding.",
    resposta30s:
      "In **serverless** you hand over the code and the provider looks after the servers. The most common model is **FaaS** (AWS Lambda, Azure Functions…): a function is **triggered by an event**, **scales on demand** (down to zero) and is **billed by use**. Node.js fits well because it starts quickly and lives on asynchronous I/O, but **cold start** depends on the package size and dependencies, the function is **stateless and short-lived** and **database connections** must be reused outside the handler.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Owning a server is like owning a car: you pay even while it sits in the garage and take care of insurance, repairs and parking, but it is always at the door. Serverless is calling a taxi: you order it when you need it, pay for the ride and never think about parking. In return, the taxi takes a while to arrive, doesn’t keep what you left on the seat from the previous ride and, if you ride all day, the bill can exceed the car’s.",
        tecnico:
          "**Serverless** does not mean “no servers”: they exist, but they belong to the provider, which allocates, scales and patches everything. In the **FaaS** model (AWS Lambda, Azure Functions, Google Cloud functions), you publish a function that the provider runs in response to an **event** (an HTTP request, a queue message, a new file in storage, a schedule). There are as many instances as needed, including none, and billing follows usage (check the provider’s current model). Node.js is a frequent choice: the runtime starts fast, and glue code made of HTTP calls and service access is asynchronous I/O, the platform’s strong suit (see T28).",
        limite:
          "The taxi has limits the car doesn’t: the function is **stateless** (nothing in memory or on local disk is guaranteed on the next call), **short-lived** (there is a time and memory limit per execution) and the first call on a new instance pays the **cold start**. For high, steady load, or long processes, an always-on server or container is usually simpler and, in many cases, cheaper.",
      },
      {
        tipo: "fluxo",
        titulo: "The life of an invocation",
        etapas: [
          "An event arrives (HTTP, queue, new file, schedule) and the provider looks for a free instance of the function",
          "With no free instance, a **cold start** happens: it downloads the package, starts the Node.js runtime and runs the code outside the handler (imports, connections)",
          "The provider calls your **handler** with the event; it does the work and returns the result",
          "The instance stays “warm” for a while: a new event in that window reuses what was created outside the handler",
          "With no traffic, the instance is discarded; with spikes, the provider creates more instances in parallel, each with its own connections",
        ],
      },
      {
        tipo: "codigo",
        titulo: "Reusing the connection outside the handler",
        legenda: "JavaScript",
        codigo:
          'import { createPool } from "./db.js"; // your database client (hypothetical)\n\n// Outside the handler: runs once per instance and is reused\n// by later invocations while the instance stays warm\nconst pool = createPool({ max: 1 });\n\nexport async function handler(event) {\n  const { id } = JSON.parse(event.body);\n  const result = await pool.query("select * from orders where id = $1", [id]);\n\n  return {\n    statusCode: 200,\n    body: JSON.stringify(result.rows[0] ?? null),\n  };\n}',
        nota: "The handler signature and the event shape vary by provider. Reuse between calls is an optimization, not a guarantee: never keep important state there. In spikes, many instances open many connections; a connection proxy or pool on the database side is usually needed.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "When to use it and when not",
        texto:
          "It fits **APIs with irregular traffic**, webhooks, event-driven tasks (processing an uploaded file, sending an email), scheduled automation and prototypes. It counts against: long or continuously CPU-bound processing, high steady traffic, very low and predictable latency (cold start), in-memory state, long-lived WebSockets and reliance on native libraries or huge packages.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cold start and database connections",
        texto:
          "In Node.js, cold start grows with the **package size** and with what runs at module load: heavy dependencies, importing everything up front, opening connections. Shrink the package (bundler, only what the function uses, lazy loading). And remember each concurrent instance has its own pool: with a thousand simultaneous executions, a pool of ten connections becomes ten thousand. Use a small pool, a connection proxy or a database designed for it.",
      },
    ],
    armadilhas: [
      "Keeping state in a global variable or on local disk and expecting it on the next call: instances are created and discarded without notice.",
      "Opening the database connection inside the handler on every invocation (slow) or creating a large pool per instance (exhausts the database in spikes).",
      "Packaging the whole `node_modules`, with development dependencies and libraries the function doesn’t use: cold start grows with the package.",
      "Forgetting limits and repetition: the function may hit the time limit, and queue events are often delivered more than once, so the code must be idempotent (see L104).",
    ],
    autoteste: [
      {
        pergunta: "Does serverless mean there are no servers?",
        resposta:
          "No. Servers exist, but the provider allocates, scales and maintains them. “Serverless” holds from the point of view of whoever writes the code: you don’t provision or administer machines.",
      },
      {
        pergunta: "Why does the database connection live outside the handler?",
        resposta:
          "Because what is outside the handler runs once per instance and is reused while it stays warm; inside, the cost of opening the connection would repeat on every invocation. Since reuse isn’t guaranteed, the code must tolerate a fresh connection.",
      },
    ],
  },
};
