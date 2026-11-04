import type { Pergunta } from "../../tipos";

// M24 · Plataformas de nuvem
export const m24: Pergunta = {
  numero: 224,
  modulo: "mentorcruise",
  metodo: "compare",
  pt: {
    titulo: "Experiência com nuvem",
    pergunta: "Que experiência você tem com plataformas de nuvem (como Amazon AWS, Google Cloud ou Microsoft Azure)?",
    porqueEsteMetodo:
      "A pergunta cita três provedores, e a tabela de equivalências mostra que as peças básicas se repetem entre eles, o que ajuda a falar dos que você conhece menos. A regra de resposta mostra como transformar isso numa resposta específica e honesta.",
    resposta30s:
      "Responda com **especificidade**, não com uma lista de siglas: quais serviços, para quê, por que essa escolha, quanto custou, como foi protegido e quais trade-offs surgiram. Os provedores têm **equivalentes** para as peças básicas (máquinas virtuais, Kubernetes, funções, objetos, bancos, mensageria, identidade, monitoramento), então quem domina os conceitos transfere o conhecimento. Se a experiência for pequena ou de estudo, diga isso e mostre o raciocínio: **responsabilidade compartilhada**, infraestrutura como código, controle de custos e desenho por regiões e zonas.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Equivalências aproximadas entre os três provedores",
        colunas: ["Categoria", "AWS", "Google Cloud", "Azure"],
        linhas: [
          ["Máquinas virtuais", "EC2", "Compute Engine", "Virtual Machines"],
          ["Kubernetes gerenciado", "EKS", "GKE", "AKS"],
          ["Funções serverless", "Lambda", "Cloud Functions", "Azure Functions"],
          ["Armazenamento de objetos", "S3", "Cloud Storage", "Blob Storage"],
          ["Banco relacional gerenciado", "RDS (ou Aurora)", "Cloud SQL", "Azure SQL Database"],
          ["NoSQL", "DynamoDB", "Firestore ou Bigtable", "Cosmos DB"],
          ["Mensageria", "SQS e SNS", "Pub/Sub", "Service Bus e Event Grid"],
          ["Identidade e acesso", "IAM", "IAM", "Microsoft Entra ID e Azure RBAC"],
          ["Monitoramento", "CloudWatch", "Cloud Monitoring", "Azure Monitor"],
        ],
        nota: "A equivalência é aproximada: nomes parecidos escondem diferenças de limites, preços, modelo de consistência e recursos. Confira a documentação antes de assumir que dois serviços se comportam igual. Os nomes e a oferta também mudam com o tempo.",
      },
      {
        tipo: "tabela",
        titulo: "Conceitos que valem em qualquer provedor",
        colunas: ["Conceito", "Ideia central", "O que mostrar na resposta"],
        linhas: [
          [
            "Responsabilidade compartilhada",
            "O provedor cuida da nuvem em si (instalações, hardware, a base de cada serviço); você cuida do que coloca nela (dados, identidades, configuração, código). Quanto mais gerenciado o serviço, mais o provedor assume, mas dados e acesso continuam sendo seus",
            "Saber quem corrige o quê: o patch do sistema operacional de uma VM é seu, o de um serviço gerenciado não; permissões e configuração são sempre suas",
          ],
          [
            "Infraestrutura como código",
            "Os recursos são descritos em arquivos versionados (como Terraform ou OpenTofu, Pulumi, CloudFormation ou Bicep), revisados e aplicados por pipeline",
            "Ambientes reproduzíveis, revisão por pull request, detecção de desvio entre o código e o real, nada criado “no clique” em produção",
          ],
          [
            "Controle de custos",
            "Paga-se pelo uso, então o que está ocioso ou esquecido custa. Pontos de atenção: tamanho dos recursos, saída de dados e tráfego entre regiões, armazenamento esquecido, ambientes de teste ligados à toa",
            "Como estimou antes de subir, tags por time e ambiente, orçamentos com alerta, dimensionamento revisado e compromissos de uso quando a carga é estável",
          ],
          [
            "Regiões e zonas de disponibilidade",
            "Região é uma área geográfica; zonas são locais isolados dentro dela (um ou mais datacenters). Distribuir em várias zonas sobrevive à queda de uma; várias regiões atendem recuperação de desastre, latência ou exigência legal, com mais custo e complexidade",
            "Como escolheu a região (latência dos usuários, onde os dados podem ficar, preço, serviços disponíveis) e o que acontece se uma zona cair",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Como estruturar a resposta",
        texto:
          "Para cada experiência que citar, percorra: **contexto** (que sistema, que carga), **serviços e por quê** (o que considerou e descartou), **segurança** (IAM com privilégio mínimo, segredos fora do código, rede privada, criptografia, backups), **custo** (como estimou e acompanhou) e **trade-off** (o que ficou difícil e o que mudaria). Dois ou três exemplos com esse nível de detalhe convencem mais do que uma lista de vinte serviços.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Sem torcida e sem exagero",
        texto:
          "Não declare um provedor melhor que os outros: a escolha depende do contexto (ecossistema e contratos que a empresa já tem, serviços necessários, onde os dados podem ficar, habilidades do time, preço). Também não infle a experiência: o entrevistador aprofunda o que você citar, e “estudei a documentação e montei um projeto de teste” é uma resposta honesta e aceitável.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Se a sua experiência é pequena",
        texto:
          "Diga em que nível está (estudo, projeto pessoal, uso supervisionado) e mostre o raciocínio: explique bem um serviço que conhece e como seria o equivalente nos outros provedores, usando os conceitos da tabela. Mostre que aprende rápido: um projeto pequeno descrito como código, com orçamento e alerta de gasto configurados.",
      },
    ],
    armadilhas: [
      "Listar siglas (EC2, S3, Lambda…) sem dizer para que serviram, por que foram escolhidas ou quanto custaram.",
      "Ignorar a responsabilidade compartilhada: achar que “está na nuvem” significa que o provedor cuida da segurança dos seus dados e dos backups.",
      "Criar recursos pelo console em produção, sem código: o ambiente não se reproduz e ninguém sabe o que mudou.",
      "Escolher região, tamanho e serviço sem olhar o custo: tráfego de saída, recursos esquecidos e superdimensionamento só aparecem na fatura.",
    ],
    autoteste: [
      {
        pergunta: "Qual é o equivalente do S3 no Google Cloud e no Azure?",
        resposta: "Cloud Storage no Google Cloud e Blob Storage no Azure; os três são armazenamento de objetos.",
      },
      {
        pergunta: "O que é o modelo de responsabilidade compartilhada?",
        resposta:
          "O provedor protege a infraestrutura da nuvem; o cliente protege o que coloca nela (dados, identidades, configuração, código). Quanto mais gerenciado o serviço, mais o provedor assume, mas dados e acesso continuam sendo do cliente.",
      },
      {
        pergunta: "Por que distribuir uma aplicação por mais de uma zona de disponibilidade?",
        resposta:
          "Para continuar funcionando se uma zona (um ou mais datacenters) falhar. Várias regiões entram para recuperação de desastre ou exigência legal, com mais custo e complexidade.",
      },
    ],
  },
  en: {
    titulo: "Cloud experience",
    pergunta: "What experience do you have with cloud platforms (like Amazon AWS, Google Cloud, or Microsoft Azure)?",
    porqueEsteMetodo:
      "The question names three providers, and the equivalence table shows that the basic building blocks repeat across them, which helps you talk about the ones you know less. The answer rule shows how to turn that into a specific, honest answer.",
    resposta30s:
      "Answer with **specifics**, not a list of acronyms: which services, for what, why that choice, what it cost, how it was secured and which trade-offs came up. Providers have **equivalents** for the basic building blocks (virtual machines, Kubernetes, functions, objects, databases, messaging, identity, monitoring), so whoever masters the concepts transfers the knowledge. If your experience is small or comes from study, say so and show your reasoning: **shared responsibility**, infrastructure as code, cost control and design by regions and zones.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Approximate equivalents across the three providers",
        colunas: ["Category", "AWS", "Google Cloud", "Azure"],
        linhas: [
          ["Virtual machines", "EC2", "Compute Engine", "Virtual Machines"],
          ["Managed Kubernetes", "EKS", "GKE", "AKS"],
          ["Serverless functions", "Lambda", "Cloud Functions", "Azure Functions"],
          ["Object storage", "S3", "Cloud Storage", "Blob Storage"],
          ["Managed relational database", "RDS (or Aurora)", "Cloud SQL", "Azure SQL Database"],
          ["NoSQL", "DynamoDB", "Firestore or Bigtable", "Cosmos DB"],
          ["Messaging", "SQS and SNS", "Pub/Sub", "Service Bus and Event Grid"],
          ["Identity and access", "IAM", "IAM", "Microsoft Entra ID and Azure RBAC"],
          ["Monitoring", "CloudWatch", "Cloud Monitoring", "Azure Monitor"],
        ],
        nota: "The equivalence is approximate: similar names hide differences in limits, pricing, consistency model and features. Check the documentation before assuming two services behave the same. Names and offerings also change over time.",
      },
      {
        tipo: "tabela",
        titulo: "Concepts that hold on any provider",
        colunas: ["Concept", "Core idea", "What to show in your answer"],
        linhas: [
          [
            "Shared responsibility",
            "The provider looks after the cloud itself (facilities, hardware, the base of each service); you look after what you put in it (data, identities, configuration, code). The more managed the service, the more the provider takes on, but data and access remain yours",
            "Knowing who fixes what: the operating system patch of a VM is yours, a managed service’s is not; permissions and configuration are always yours",
          ],
          [
            "Infrastructure as code",
            "Resources are described in versioned files (such as Terraform or OpenTofu, Pulumi, CloudFormation or Bicep), reviewed and applied by a pipeline",
            "Reproducible environments, pull-request review, drift detection between the code and what is real, nothing created by “clicking” in production",
          ],
          [
            "Cost control",
            "You pay for use, so anything idle or forgotten costs money. Watch points: resource sizes, data egress and cross-region traffic, forgotten storage, test environments left running",
            "How you estimated before launching, tags by team and environment, budgets with alerts, right-sizing reviews and usage commitments when the load is stable",
          ],
          [
            "Regions and availability zones",
            "A region is a geographic area; zones are isolated locations inside it (one or more data centers). Spreading across zones survives the loss of one; multiple regions serve disaster recovery, latency or legal requirements, at more cost and complexity",
            "How you chose the region (user latency, where data may live, price, available services) and what happens if a zone goes down",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "How to structure the answer",
        texto:
          "For each experience you cite, walk through: **context** (what system, what load), **services and why** (what you considered and rejected), **security** (least-privilege IAM, secrets outside the code, private networking, encryption, backups), **cost** (how you estimated and tracked it) and **trade-off** (what was hard and what you would change). Two or three examples with this level of detail persuade more than a list of twenty services.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "No cheerleading, no exaggeration",
        texto:
          "Do not declare one provider better than the others: the choice depends on context (the ecosystem and contracts the company already has, the services needed, where data may live, team skills, price). Do not inflate your experience either: the interviewer digs into whatever you cite, and “I studied the documentation and built a test project” is an honest, acceptable answer.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "If your experience is small",
        texto:
          "Say what level you are at (study, personal project, supervised use) and show your reasoning: explain well a service you know and how its equivalent would look on the other providers, using the concepts in the table. Show that you learn fast: a small project described as code, with a budget and a spending alert configured.",
      },
    ],
    armadilhas: [
      "Listing acronyms (EC2, S3, Lambda…) without saying what they were for, why they were chosen or what they cost.",
      "Ignoring shared responsibility: believing “it is in the cloud” means the provider takes care of the security of your data and your backups.",
      "Creating resources through the console in production, without code: the environment cannot be reproduced and nobody knows what changed.",
      "Choosing region, size and service without looking at cost: egress traffic, forgotten resources and oversizing only show up on the bill.",
    ],
    autoteste: [
      {
        pergunta: "What is the equivalent of S3 on Google Cloud and on Azure?",
        resposta: "Cloud Storage on Google Cloud and Blob Storage on Azure; all three are object storage.",
      },
      {
        pergunta: "What is the shared responsibility model?",
        resposta:
          "The provider secures the cloud infrastructure; the customer secures what they put in it (data, identities, configuration, code). The more managed the service, the more the provider takes on, but data and access remain the customer’s.",
      },
      {
        pergunta: "Why spread an application across more than one availability zone?",
        resposta:
          "To keep working if one zone (one or more data centers) fails. Multiple regions come in for disaster recovery or legal requirements, at more cost and complexity.",
      },
    ],
  },
};
