import type { Pergunta } from "../../tipos";

// M27 · Arquitetura serverless
export const m27: Pergunta = {
  numero: 227,
  modulo: "mentorcruise",
  metodo: "feynman",
  pt: {
    titulo: "Arquitetura serverless",
    pergunta: "Você pode explicar o conceito de arquitetura serverless e dar um exemplo de uso?",
    porqueEsteMetodo:
      "O nome engana (“sem servidor”), então a intuição vem primeiro, com uma analogia sobre quem cuida de quê (carro próprio ou táxi). Depois entram o mecanismo real, um exemplo e o ponto em que a analogia deixa de valer.",
    resposta30s:
      "**Serverless** não é ausência de servidores: é deixar o provedor **provisionar, escalar e manter** a infraestrutura. Você entrega funções (**FaaS**) disparadas por eventos e usa serviços gerenciados, com **escala automática (até zero)** e **cobrança por uso**. Exemplo: ao enviar uma foto, um evento aciona uma função que gera a miniatura. O preço: **cold start**, limite de tempo, **ausência de estado**, dependência do fornecedor e custo alto com carga alta e constante.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Carro próprio: você compra, paga seguro, imposto e garagem, e cuida da manutenção mesmo com o carro parado; em troca, dirige sem restrições e conhece cada peça. Corrida por aplicativo: você só diz o destino, paga pelo trajeto e não vê garagem nem oficina. Se ninguém pede carro, você não paga nada; se cinquenta pessoas pedem ao mesmo tempo, a empresa manda cinquenta carros.",
        tecnico:
          "Serverless não quer dizer “sem servidores”: eles existem, mas provisionar, aplicar correções, escalar e desligar é problema do provedor. Há duas peças. **FaaS** (função como serviço): você envia uma função e ela roda quando um **evento** a dispara (requisição HTTP, arquivo gravado, mensagem em fila, agenda), em um ambiente efêmero. **Serviços gerenciados** (banco, fila, armazenamento de objetos, autenticação) que escalam e cobram por uso. O provedor cria quantas instâncias a demanda pedir, inclusive nenhuma quando não há tráfego (**escala a zero**), e você paga pelas execuções (tempo e memória), não por máquina ociosa.",
        limite:
          "A corrida tem um carro que precisa chegar até você, o que lembra o **cold start**; viagens muito longas e diárias saem mais caras que ter carro próprio, o que lembra o **custo com carga constante**; e você não escolhe o modelo do carro, o que lembra os **limites de tempo, memória e linguagem**. Além disso, trocar de aplicativo de corrida custa pouco, mas trocar de provedor serverless custa muito, porque gatilhos e serviços são específicos de cada fornecedor.",
      },
      {
        tipo: "fluxo",
        titulo: "Exemplo: gerar a miniatura de uma imagem no upload",
        etapas: [
          "O usuário envia a foto direto ao armazenamento de objetos (por uma URL pré-assinada)",
          "O armazenamento emite o evento “objeto criado”",
          "O provedor inicia uma instância da função com os dados do evento",
          "A função baixa a imagem, gera a miniatura e a grava de volta no armazenamento",
          "Grava os metadados no banco e termina; a instância some depois de ociosa",
        ],
        nota: "Sem uploads, nada executa e a função não gera cobrança. Muitos provedores entregam o evento ao menos uma vez, então a função precisa ser idempotente (veja Q30). Os mesmos ingredientes servem para receber um webhook de pagamento ou rodar uma tarefa agendada toda madrugada.",
      },
      {
        tipo: "tabela",
        titulo: "O que se ganha e o que se paga",
        colunas: ["Característica", "O que significa", "O preço"],
        linhas: [
          [
            "Escala automática, até zero",
            "Sem tráfego não há instância; um pico cria muitas instâncias em paralelo",
            "A escala rápida sobrecarrega o que está atrás: conexões de banco esgotadas, limites de APIs de terceiros; há também limites de concorrência da conta",
          ],
          [
            "Cobrança por uso",
            "Paga-se por execução e por tempo, não por servidor ocioso",
            "Com carga alta e constante, servidores ou contêineres dedicados podem sair mais baratos; faça a conta com o seu volume",
          ],
          [
            "Cold start",
            "A primeira chamada depois de ociosidade prepara o ambiente e demora mais",
            "Pesa nas latências de cauda; mitiga-se com pacotes leves, menos inicialização e capacidade pré-aquecida (varia por provedor)",
          ],
          [
            "Limites de tempo e recursos",
            "Cada execução tem tempo máximo, memória e tamanho de pacote limitados",
            "Trabalho longo precisa ser quebrado em etapas ou ir para outro tipo de serviço",
          ],
          [
            "Sem estado",
            "As instâncias são efêmeras; o estado vive em banco, cache ou armazenamento externo",
            "Não confie em memória ou disco local entre chamadas: pode ser reaproveitado, mas sem garantia",
          ],
          [
            "Dependência do fornecedor",
            "Gatilhos, permissões e serviços gerenciados são específicos de cada provedor",
            "Migrar custa; mantenha a regra de negócio separada da cola com o provedor",
          ],
          [
            "Observabilidade e depuração",
            "Muitas funções pequenas e efêmeras, sem máquina onde entrar",
            "Logs centralizados, id de correlação e tracing distribuído desde o início; reproduzir o ambiente localmente é mais difícil",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Quando faz sentido",
        texto:
          "Tráfego **irregular ou imprevisível**, trabalho **disparado por eventos** (miniaturas, webhooks, tarefas agendadas, filas, integrações pontuais), times pequenos que não querem operar servidores e protótipos que precisam sair rápido. A pergunta que decide: o uso fica parado boa parte do tempo e dá picos? Se sim, pagar só pelo que roda costuma compensar.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Quando não usar",
        texto:
          "Carga **alta, constante e previsível** (servidor ou contêiner dedicado costuma custar menos), latência muito baixa e estável (o cold start atrapalha), processos **longos** ou com muita memória, conexões persistentes de longa duração (como WebSockets, que pedem serviços específicos) e casos em que portabilidade entre provedores é requisito forte.",
      },
    ],
    armadilhas: [
      "Entender “serverless” ao pé da letra: configuração, permissões, limites e custos continuam sendo seus.",
      "Guardar estado na memória ou no disco local da função esperando encontrá-lo na próxima chamada.",
      "Ignorar o que está atrás da função: milhares de execuções simultâneas esgotam as conexões do banco ou estouram o limite de uma API externa.",
      "Escolher pelo preço de tabela sem calcular: com carga constante e alta, pagar por execução pode custar mais que servidores dedicados.",
    ],
    autoteste: [
      {
        pergunta: "Serverless significa que não existem servidores?",
        resposta:
          "Não. Eles existem; o provedor é quem os provisiona, escala e mantém, e a cobrança segue o uso, não a máquina reservada.",
      },
      {
        pergunta: "O que é cold start e como reduzir seu impacto?",
        resposta:
          "É o tempo extra da primeira execução depois de ociosidade, quando o ambiente é criado e o código é carregado. Reduz-se com pacotes menores, menos trabalho na inicialização, capacidade pré-aquecida (conforme o provedor) ou tirando a função do caminho crítico, tornando o trabalho assíncrono.",
      },
      {
        pergunta: "Por que uma função disparada por evento deve ser idempotente?",
        resposta:
          "Porque o gatilho pode entregar o mesmo evento mais de uma vez e há retentativas automáticas. Sem idempotência, o efeito (uma cobrança, um e-mail) se repetiria.",
      },
    ],
  },
  en: {
    titulo: "Serverless architecture",
    pergunta: "Can you explain the concept of serverless architecture and provide an example of its use?",
    porqueEsteMetodo:
      "The name is misleading (“no servers”), so intuition comes first, through an analogy about who looks after what (your own car or a taxi). Then come the real mechanism, an example and the point where the analogy stops holding.",
    resposta30s:
      "**Serverless** does not mean no servers: it means letting the provider **provision, scale and maintain** the infrastructure. You ship functions (**FaaS**) triggered by events and use managed services, with **automatic scaling (down to zero)** and **pay-per-use billing**. Example: when a photo is uploaded, an event triggers a function that creates the thumbnail. The price: **cold starts**, time limits, **no local state**, vendor dependence and high cost under heavy, constant load.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Your own car: you buy it, pay insurance, taxes and a garage, and handle maintenance even while it sits idle; in return, you drive without restrictions and know every part. A ride-hailing trip: you just state the destination, pay for the route and never see a garage or workshop. If nobody orders a car you pay nothing; if fifty people order at once, the company sends fifty cars.",
        tecnico:
          "Serverless does not mean “no servers”: they exist, but provisioning, patching, scaling and shutting down are the provider’s problem. There are two pieces. **FaaS** (function as a service): you upload a function and it runs when an **event** triggers it (an HTTP request, a file written, a queue message, a schedule), in an ephemeral environment. **Managed services** (database, queue, object storage, authentication) that scale and bill by usage. The provider creates as many instances as demand requires, including none when there is no traffic (**scale to zero**), and you pay for executions (time and memory), not for idle machines.",
        limite:
          "The ride has a car that must travel to reach you, which resembles the **cold start**; long daily trips cost more than owning a car, which resembles the **cost under constant load**; and you do not choose the car model, which resembles the **limits on time, memory and language**. Also, switching ride apps is cheap, but switching serverless providers is expensive, because triggers and services are specific to each vendor.",
      },
      {
        tipo: "fluxo",
        titulo: "Example: generating an image thumbnail on upload",
        etapas: [
          "The user uploads the photo straight to object storage (through a pre-signed URL)",
          "The storage emits the “object created” event",
          "The provider starts a function instance with the event data",
          "The function downloads the image, creates the thumbnail and writes it back to storage",
          "It saves the metadata in the database and ends; the instance disappears once idle",
        ],
        nota: "With no uploads, nothing runs and the function costs nothing. Many providers deliver the event at least once, so the function must be idempotent (see Q30). The same ingredients serve to receive a payment webhook or run a scheduled task every night.",
      },
      {
        tipo: "tabela",
        titulo: "What you gain and what you pay",
        colunas: ["Characteristic", "What it means", "The price"],
        linhas: [
          [
            "Automatic scaling, down to zero",
            "No traffic means no instances; a spike creates many instances in parallel",
            "Fast scaling overloads what sits behind it: exhausted database connections, third-party API limits; there are also account-level concurrency limits",
          ],
          [
            "Pay-per-use billing",
            "You pay per execution and per time, not for an idle server",
            "Under heavy, constant load, dedicated servers or containers can be cheaper; do the math with your own volume",
          ],
          [
            "Cold start",
            "The first call after idleness prepares the environment and takes longer",
            "Hurts tail latencies; mitigated with light packages, less initialization and pre-warmed capacity (varies by provider)",
          ],
          [
            "Time and resource limits",
            "Each execution has a maximum time, memory and package size",
            "Long work has to be split into steps or moved to another kind of service",
          ],
          [
            "No local state",
            "Instances are ephemeral; state lives in a database, cache or external storage",
            "Do not rely on local memory or disk between calls: they may be reused, but with no guarantee",
          ],
          [
            "Vendor dependence",
            "Triggers, permissions and managed services are specific to each provider",
            "Migrating is costly; keep business logic apart from the provider glue",
          ],
          [
            "Observability and debugging",
            "Many small, ephemeral functions, with no machine to log into",
            "Centralized logs, correlation IDs and distributed tracing from day one; reproducing the environment locally is harder",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "When it makes sense",
        texto:
          "**Irregular or unpredictable** traffic, **event-driven** work (thumbnails, webhooks, scheduled tasks, queues, one-off integrations), small teams that do not want to run servers, and prototypes that must ship fast. The deciding question: does usage sit idle much of the time and spike now and then? If so, paying only for what runs usually pays off.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "When not to use it",
        texto:
          "**Heavy, constant, predictable** load (a dedicated server or container usually costs less), very low and steady latency (cold starts get in the way), **long-running** or memory-hungry processes, long-lived persistent connections (such as WebSockets, which call for specific services) and cases where portability across providers is a strong requirement.",
      },
    ],
    armadilhas: [
      "Reading “serverless” literally: configuration, permissions, limits and costs are still yours.",
      "Keeping state in the function’s memory or local disk and expecting to find it on the next call.",
      "Ignoring what sits behind the function: thousands of concurrent executions exhaust database connections or blow through an external API’s limit.",
      "Choosing by list price without calculating: under heavy, constant load, paying per execution can cost more than dedicated servers.",
    ],
    autoteste: [
      {
        pergunta: "Does serverless mean there are no servers?",
        resposta:
          "No. They exist; the provider provisions, scales and maintains them, and billing follows usage, not reserved machines.",
      },
      {
        pergunta: "What is a cold start and how do you reduce its impact?",
        resposta:
          "It is the extra time of the first execution after idleness, when the environment is created and the code is loaded. Reduce it with smaller packages, less work at initialization, pre-warmed capacity (depending on the provider), or by taking the function off the critical path, making the work asynchronous.",
      },
      {
        pergunta: "Why must an event-triggered function be idempotent?",
        resposta:
          "Because the trigger may deliver the same event more than once and there are automatic retries. Without idempotency, the effect (a charge, an email) would repeat.",
      },
    ],
  },
};
