import type { Pergunta } from "../../tipos";

// D84 · Nuvem e Node.js
export const d084: Pergunta = {
  numero: 384,
  modulo: "devinterview-escala",
  metodo: "compare",
  pt: {
    titulo: "Nuvem e Node.js",
    pergunta: "Como plataformas de nuvem como AWS, Azure ou GCP facilitam a implantação de aplicações Node.js?",
    porqueEsteMetodo:
      "As nuvens oferecem alternativas que se parecem por fora e diferem em quem cuida de quê. Uma matriz mostra, na mesma linha de leitura, o que cada modelo exige de você e o que ele custa em controle e em trabalho.",
    resposta30s:
      "As nuvens oferecem quatro degraus para rodar Node.js: **máquinas virtuais** (controle total, você opera tudo), **PaaS** (você entrega o código), **contêineres gerenciados** (você entrega a imagem e o provedor a executa) e **funções serverless** (você entrega só a função). Em todos eles a nuvem soma **escala automática, balanceador e certificados TLS, gerenciador de segredos, logs e métricas, banco gerenciado e CDN**. A escolha equilibra controle, trabalho de operação, custo e dependência do provedor.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Os modelos de implantação",
        colunas: ["Modelo", "O que você gerencia", "Exemplos (genéricos)", "Bom para", "Limites"],
        linhas: [
          [
            "Máquina virtual (IaaS)",
            "O sistema operacional, o Node.js, o supervisor, o proxy, os patches e a segurança da máquina",
            "Máquinas virtuais dos três provedores (por exemplo EC2, Virtual Machines, Compute Engine)",
            "Controle total, sistemas legados, requisitos específicos de rede ou de software",
            "Mais trabalho de operação; escala e recuperação por sua conta (ou por scripts e grupos de escala)",
          ],
          [
            "Plataforma como serviço (PaaS)",
            "O código e a configuração; a plataforma cuida do sistema, do runtime e do balanceamento",
            "Elastic Beanstalk, App Service, App Engine",
            "Equipes pequenas e APIs web comuns, com deploy a partir do repositório",
            "Menos controle do ambiente, regras da plataforma e migração trabalhosa de uma plataforma para outra",
          ],
          [
            "Contêineres gerenciados e orquestração",
            "A imagem (veja D58) e a configuração de execução; o provedor roda o cluster ou o serviço",
            "ECS, EKS ou Fargate; Container Apps ou AKS; Cloud Run ou GKE",
            "Várias aplicações, microsserviços e portabilidade entre provedores",
            "Um orquestrador completo (Kubernetes) tem curva de aprendizado e custo operacional maior que o de um PaaS",
          ],
          [
            "Funções serverless (FaaS)",
            "Só a função e seus gatilhos; o provedor cuida dos servidores e da escala",
            "Lambda, Azure Functions, funções do Google Cloud",
            "Cargas por evento, irregulares e tarefas curtas (veja D85)",
            "Cold start, limites de tempo e memória, sem estado e mais difícil de depurar localmente",
          ],
        ],
        nota: "Os nomes dos produtos mudam e cada provedor tem variações. Use a tabela como mapa e confira o catálogo atual do provedor.",
      },
      {
        tipo: "tabela",
        titulo: "O que a nuvem entrega ao redor do seu código",
        colunas: ["Capacidade", "O que muda para uma aplicação Node.js"],
        linhas: [
          [
            "Escala automática",
            "Mais ou menos instâncias conforme CPU, requisições ou fila; exige aplicação sem estado (veja T50)",
          ],
          [
            "Balanceador e certificados TLS",
            "Entrada gerenciada, com HTTPS e certificados renovados pela plataforma (veja D64)",
          ],
          [
            "Gerenciador de segredos e configuração",
            "Chaves e senhas fora do código, entregues por variável de ambiente ou lidas na partida (veja L126)",
          ],
          [
            "Logs, métricas e traces",
            "A saída padrão vira busca, painéis e alertas sem montar a infraestrutura de observabilidade (veja L118)",
          ],
          [
            "Banco e cache gerenciados",
            "Backups, réplicas e atualizações feitos pelo provedor; você continua cuidando do pool e das consultas",
          ],
          ["CDN e armazenamento de objetos", "Arquivos estáticos e uploads grandes saem do seu servidor (veja L67)"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Comece pelo modelo **mais gerenciado que atende** ao seu caso e só desça um degrau quando precisar de mais controle: PaaS ou contêiner gerenciado para uma API web comum; contêineres e orquestração quando há várias aplicações ou necessidade de portabilidade; funções para cargas por evento e irregulares; VM quando a exigência é do sistema ou do software. O que decide é a equipe que vai operar, o perfil de carga (constante ou em picos), a latência exigida e as regras de região e de dados.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Custos, limites e dependência do provedor",
        texto:
          "Gerenciar menos custa em outro lugar: cobrança por uso que cresce sem teto quando a escala automática não tem limite, tráfego de saída e serviços auxiliares cobrados à parte, cotas por conta e por região e **lock-in**. Contêineres reduzem a dependência na parte de computação, mas banco, filas e identidade gerenciados prendem mais. Defina limites e alertas de orçamento, mantenha a infraestrutura como código e decida conscientemente onde aceitar a dependência. Confira preços e cotas na documentação do provedor.",
      },
    ],
    armadilhas: [
      "Escolher pela moda (Kubernetes ou serverless “porque todo mundo usa”): a equipe e a carga é que decidem, e um PaaS simples resolve muitos casos.",
      "Tratar a nuvem como um servidor remoto: estado em disco local ou na memória quebra com escala automática e instâncias descartáveis.",
      "Deixar a escala automática sem teto nem alerta de orçamento: um erro ou um ataque vira custo.",
      "Ignorar a responsabilidade compartilhada: o provedor cuida da infraestrutura, mas código, configuração, permissões e dados continuam sendo seus.",
    ],
    autoteste: [
      {
        pergunta: "Quando uma VM ainda faz mais sentido que um PaaS ou serverless?",
        resposta:
          "Quando você precisa de controle do sistema ou da rede (software específico, dependências nativas, requisitos de conformidade), tem processos longos e constantes, ou está migrando um sistema legado que assume uma máquina dedicada.",
      },
      {
        pergunta: "Como reduzir a dependência de um provedor numa aplicação Node.js?",
        resposta:
          "Empacotar em contêiner, manter a configuração em variáveis de ambiente, isolar o acesso a serviços proprietários atrás de interfaces próprias e preferir padrões abertos (SQL, HTTP, OpenTelemetry) onde fizer sentido. Dependência zero não existe: o objetivo é saber onde ela está e quanto custaria sair.",
      },
    ],
  },
  en: {
    titulo: "Cloud and Node.js",
    pergunta: "How do cloud platforms like AWS, Azure, or GCP facilitate Node.js application deployment?",
    porqueEsteMetodo:
      "Clouds offer alternatives that look alike from outside and differ in who looks after what. A matrix shows, along the same line of reading, what each model demands of you and what it costs in control and in work.",
    resposta30s:
      "Clouds offer four rungs for running Node.js: **virtual machines** (full control, you operate everything), **PaaS** (you hand over the code), **managed containers** (you hand over the image and the provider runs it) and **serverless functions** (you hand over just the function). In all of them the cloud adds **autoscaling, a load balancer and TLS certificates, a secrets manager, logs and metrics, a managed database and a CDN**. The choice balances control, operational work, cost and provider dependence.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The deployment models",
        colunas: ["Model", "What you manage", "Examples (generic)", "Good for", "Limits"],
        linhas: [
          [
            "Virtual machine (IaaS)",
            "The operating system, Node.js, the supervisor, the proxy, patches and the machine’s security",
            "Virtual machines from the three providers (for example EC2, Virtual Machines, Compute Engine)",
            "Full control, legacy systems, specific network or software requirements",
            "More operational work; scaling and recovery are on you (or on scripts and scaling groups)",
          ],
          [
            "Platform as a service (PaaS)",
            "The code and configuration; the platform handles the system, the runtime and load balancing",
            "Elastic Beanstalk, App Service, App Engine",
            "Small teams and ordinary web APIs, with deploy straight from the repository",
            "Less control over the environment, platform rules and laborious migration from one platform to another",
          ],
          [
            "Managed containers and orchestration",
            "The image (see D58) and the run configuration; the provider runs the cluster or the service",
            "ECS, EKS or Fargate; Container Apps or AKS; Cloud Run or GKE",
            "Several applications, microservices and portability between providers",
            "A full orchestrator (Kubernetes) has a learning curve and a higher operational cost than a PaaS",
          ],
          [
            "Serverless functions (FaaS)",
            "Just the function and its triggers; the provider handles servers and scaling",
            "Lambda, Azure Functions, Google Cloud functions",
            "Event-driven, irregular loads and short tasks (see D85)",
            "Cold start, time and memory limits, no state and harder to debug locally",
          ],
        ],
        nota: "Product names change and each provider has variations. Use the table as a map and check the provider’s current catalog.",
      },
      {
        tipo: "tabela",
        titulo: "What the cloud delivers around your code",
        colunas: ["Capability", "What changes for a Node.js application"],
        linhas: [
          [
            "Autoscaling",
            "More or fewer instances depending on CPU, requests or queue; requires a stateless application (see T50)",
          ],
          [
            "Load balancer and TLS certificates",
            "A managed entry point, with HTTPS and certificates renewed by the platform (see D64)",
          ],
          [
            "Secrets and configuration manager",
            "Keys and passwords outside the code, delivered through environment variables or read at startup (see L126)",
          ],
          [
            "Logs, metrics and traces",
            "Standard output becomes search, dashboards and alerts without building the observability infrastructure (see L118)",
          ],
          [
            "Managed database and cache",
            "Backups, replicas and updates done by the provider; you still look after the pool and the queries",
          ],
          ["CDN and object storage", "Static files and large uploads leave your server (see L67)"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Start with the **most managed model that fits** your case and step down only when you need more control: PaaS or a managed container for an ordinary web API; containers and orchestration when there are several applications or a need for portability; functions for event-driven, irregular loads; a VM when the requirement is about the system or the software. What decides is the team that will operate it, the load profile (steady or spiky), the required latency and the region and data rules.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Costs, limits and provider dependence",
        texto:
          "Managing less costs you elsewhere: usage-based billing that grows without a ceiling when autoscaling has no limit, egress traffic and auxiliary services billed separately, quotas per account and region, and **lock-in**. Containers reduce dependence on the compute side, but managed databases, queues and identity tie you in more. Set budget limits and alerts, keep the infrastructure as code and decide consciously where to accept dependence. Check prices and quotas in the provider’s documentation.",
      },
    ],
    armadilhas: [
      "Choosing by fashion (Kubernetes or serverless “because everyone uses it”): the team and the load decide, and a simple PaaS solves many cases.",
      "Treating the cloud as a remote server: state on local disk or in memory breaks with autoscaling and disposable instances.",
      "Leaving autoscaling with no ceiling or budget alert: a bug or an attack turns into a bill.",
      "Ignoring shared responsibility: the provider looks after the infrastructure, but code, configuration, permissions and data remain yours.",
    ],
    autoteste: [
      {
        pergunta: "When does a VM still make more sense than a PaaS or serverless?",
        resposta:
          "When you need control of the system or the network (specific software, native dependencies, compliance requirements), have long, steady processes, or are migrating a legacy system that assumes a dedicated machine.",
      },
      {
        pergunta: "How do you reduce dependence on a provider in a Node.js application?",
        resposta:
          "Package in a container, keep configuration in environment variables, isolate access to proprietary services behind your own interfaces and prefer open standards (SQL, HTTP, OpenTelemetry) where it makes sense. Zero dependence doesn’t exist: the goal is to know where it is and what leaving would cost.",
      },
    ],
  },
};
