import type { Pergunta } from "../../tipos";

// P79 · Suporte multirregião
export const p079: Pergunta = {
  numero: 779,
  modulo: "pawanmkr-resiliencia",
  metodo: "design",
  pt: {
    titulo: "Suporte multirregião",
    pergunta: "Como você implementaria suporte multirregião em um sistema de backend global?",
    porqueEsteMetodo:
      "É desenho de sistema com muitas decisões que se afetam (latência, dados, falhas, custo, lei). O roteiro parte dos requisitos e só aceita a complexidade que um requisito pede, um nível de cada vez.",
    resposta30s:
      "Comece pelos **requisitos** (latência por região de usuário, disponibilidade, **RTO/RPO** e **residência de dados**) e escolha a topologia: **ativo-passivo** (uma região atende e outra espera) ou **ativo-ativo** (várias atendem), roteando com **DNS por latência**, balanceador global ou anycast e CDN. A parte difícil são os **dados**: réplicas de leitura locais e escrita em uma região, ou particionamento por região, aceitando **consistência eventual** e conflitos se mais de uma região escreve. Adote em etapas e **ensaie o failover**, porque failover nunca testado costuma falhar quando é preciso.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos primeiro",
            texto:
              "Meça de onde vêm os usuários e qual latência cada grupo tem hoje. Defina o objetivo de disponibilidade, o **RTO** (quanto tempo se tolera até voltar a operar) e o **RPO** (quantos dados se aceita perder, medido em tempo). Levante restrições de **residência de dados** (lei e contrato) e o orçamento. Multirregião resolve latência e a perda de uma região inteira, não bug nem banco mal indexado.",
          },
          {
            titulo: "2. Escolha a topologia",
            texto:
              "Ativo-passivo (uma região atende e a outra recebe a réplica e assume no failover) ou ativo-ativo (várias regiões atendem ao mesmo tempo). Comece pelo mais simples que cumpre o requisito (tabela abaixo). Uma aplicação Node.js sem estado e configurada por variáveis de ambiente roda igual em qualquer região, o que torna a camada de aplicação a parte fácil.",
          },
          {
            titulo: "3. Roteie o tráfego",
            texto:
              "DNS por latência ou por geografia, anycast ou um balanceador global levam o usuário à região adequada, com health checks que tiram uma região doente da rotação. Lembre que o cache de DNS e o TTL atrasam o failover. Uma CDN serve o conteúdo estático e armazena respostas perto do usuário (veja P91).",
          },
          {
            titulo: "4. Resolva os dados (a parte difícil)",
            texto:
              "Opções: réplicas de leitura em cada região, com a escrita em uma só (a escrita distante paga a latência); particionar por região, de modo que cada tenant ou usuário tenha uma região dona dos seus dados; ou aceitar escrita em várias regiões e resolver conflitos (última escrita vence, mesclagem, tipos de dados sem conflito). No Node.js, o repositório costuma ter dois pools: um para a réplica local (leituras) e outro para a região primária (escritas). Veja P38 e P60 para o que cada escolha cede.",
          },
          {
            titulo: "5. Estado em volta dos dados",
            texto:
              "Cache por região (aquecido localmente, sem tentar replicar tudo), filas por região e uma regra clara para mensagens que atravessam regiões, arquivos em armazenamento replicado, e sessões e identidade que não dependam de uma só região (por exemplo, tokens assinados verificados localmente com as chaves públicas do emissor, em vez de uma consulta a um serviço de outra região).",
          },
          {
            titulo: "6. Opere, teste e controle o custo",
            texto:
              "Automatize failover e failback ou documente o procedimento manual, e **ensaie a falha** (simule a perda de uma região). Tenha observabilidade por região (métricas, logs e traces com o rótulo da região), implantação e configuração idênticas via código e atenção ao custo de tráfego entre regiões e de dados duplicados.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Topologias comuns",
        colunas: ["Topologia", "Como funciona", "Vantagens", "Custos e riscos"],
        linhas: [
          [
            "Ativo-passivo",
            "Uma região atende tudo; a outra recebe a réplica dos dados e assume no failover",
            "A mais simples; boa proteção contra a perda de uma região",
            "Custo da região em espera; o RPO depende da replicação (em geral assíncrona); o failover precisa ser ensaiado; usuários distantes continuam com latência alta",
          ],
          [
            "Ativo-ativo com escrita em uma região",
            "Várias regiões atendem; as leituras são locais (réplicas) e as escritas vão à região primária",
            "Leitura rápida em todo lugar e failover mais ágil",
            "A escrita distante tem latência alta; a leitura pode estar atrasada (consistência eventual)",
          ],
          [
            "Ativo-ativo particionado por região",
            "Cada tenant ou usuário “mora” em uma região, que é a dona dos seus dados",
            "Escrita local e boa aderência à residência de dados",
            "Roteamento pela região dona; consultas entre regiões e mudança de região são complicadas",
          ],
          [
            "Ativo-ativo com várias regiões escrevendo (multi-mestre)",
            "Várias regiões aceitam escrita do mesmo dado e replicam entre si",
            "Escrita local em todo lugar; sobrevive à perda de qualquer região",
            "Conflitos exigem regra de resolução e podem perder atualizações; é o mais complexo",
          ],
        ],
        nota: "A consistência cedida em cada linha está em P38 (teorema CAP) e P60 (consistência eventual).",
      },
      {
        tipo: "fluxo",
        titulo: "Adoção gradual",
        etapas: [
          "Uma região bem feita: várias zonas de disponibilidade, infraestrutura como código e backups restaurados em ensaio (veja L122)",
          "Segunda região em espera (ativo-passivo): réplica dos dados, mesma configuração e failover ensaiado",
          "Leituras perto do usuário: CDN, cache regional e réplicas de leitura, com a escrita ainda em uma região",
          "Escrita local só se o requisito exigir: particionar por região, ou multi-mestre com regra de conflito",
          "Ensaios de falha regulares e revisão de custo, de residência de dados e de capacidade em cada região",
        ],
        nota: "Pare no primeiro degrau que cumpre o requisito. Cada degrau seguinte custa muito mais que o anterior.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Deixe o requisito escolher. Se o problema é sobreviver à perda de uma região, **ativo-passivo** com RTO e RPO claros costuma bastar. Se é a latência de leitura, acrescente **réplicas e cache perto do usuário**. Só vá a **escrita em várias regiões** se a latência de escrita ou a disponibilidade exigirem, e prefira particionar por região a resolver conflitos.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Dados mandam na dificuldade",
        texto:
          "A replicação entre regiões costuma ser **assíncrona**: no failover, as últimas escritas podem se perder (o RPO fica acima de zero), e uma leitura na réplica pode ver dado antigo. Escrever o mesmo registro em duas regiões gera conflito. E a legislação de proteção de dados (como LGPD e GDPR) ou um contrato podem **proibir** replicar certos dados para outra região: confirme com a área jurídica antes de desenhar a replicação.",
      },
    ],
    armadilhas: [
      "Tratar multirregião como “copiar o deploy”: sem desenhar os dados, as regiões divergem, as escritas conflitam e o failover entrega dado velho ou perdido.",
      "Failover nunca ensaiado: DNS com TTL longo, certificados e segredos só na região principal e capacidade insuficiente na secundária. Descobrir isso durante o incidente é tarde demais.",
      "Dependência escondida de uma região (identidade, fila, configuração ou banco só na primária): a outra região cai junto, ou as chamadas entre regiões a cada requisição anulam o ganho de latência.",
      "Ignorar custo e residência de dados: o tráfego entre regiões e os dados duplicados custam, e replicar dados pessoais para fora da região permitida pode violar lei ou contrato.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre RTO e RPO, e como a multirregião afeta cada um?",
        resposta:
          "O RTO é o tempo máximo tolerado para voltar a operar; o RPO é a quantidade máxima de dados que se aceita perder, medida em tempo. Uma região em espera reduz o RTO, mas com replicação assíncrona o RPO fica acima de zero; replicação síncrona entre regiões reduz o RPO ao custo de mais latência de escrita.",
      },
      {
        pergunta: "Por que ativo-ativo é muito mais difícil que ativo-passivo?",
        resposta:
          "Porque os dados passam a ser lidos e escritos em várias regiões ao mesmo tempo: surgem leituras atrasadas, conflitos de escrita e a necessidade de decidir o nível de consistência (veja P38 e P60). No ativo-passivo, só uma região escreve.",
      },
    ],
  },
  en: {
    titulo: "Multi-region support",
    pergunta: "How would you implement multi-region support in a global backend system?",
    porqueEsteMetodo:
      "It is a system design with many decisions that affect each other (latency, data, failures, cost, law). The script starts from the requirements and only accepts the complexity a requirement asks for, one level at a time.",
    resposta30s:
      "Start with the **requirements** (latency per user region, availability, **RTO/RPO** and **data residency**) and pick the topology: **active-passive** (one region serves and another waits) or **active-active** (several serve), routing with **latency-based DNS**, a global load balancer or anycast and a CDN. The hard part is the **data**: local read replicas and writes in one region, or partitioning by region, accepting **eventual consistency** and conflicts if more than one region writes. Adopt it in stages and **rehearse the failover**, because a failover that was never tested tends to fail when it is needed.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements first",
            texto:
              "Measure where users come from and what latency each group has today. Define the availability goal, the **RTO** (how long you tolerate before operating again) and the **RPO** (how much data you accept losing, measured in time). Gather **data residency** constraints (law and contract) and the budget. Multi-region solves latency and the loss of a whole region, not bugs or a poorly indexed database.",
          },
          {
            titulo: "2. Choose the topology",
            texto:
              "Active-passive (one region serves and the other receives the replica and takes over on failover) or active-active (several regions serve at the same time). Start with the simplest one that meets the requirement (table below). A stateless Node.js application configured through environment variables runs the same in any region, which makes the application layer the easy part.",
          },
          {
            titulo: "3. Route the traffic",
            texto:
              "Latency-based or geographic DNS, anycast or a global load balancer send the user to the right region, with health checks that take a sick region out of rotation. Remember that DNS caching and TTL delay the failover. A CDN serves static content and caches responses close to the user (see P91).",
          },
          {
            titulo: "4. Solve the data (the hard part)",
            texto:
              "Options: read replicas in each region, with writes in one only (a distant write pays the latency); partitioning by region, so each tenant or user has a home region that owns its data; or accepting writes in several regions and resolving conflicts (last write wins, merging, conflict-free data types). In Node.js, the repository usually has two pools: one for the local replica (reads) and one for the primary region (writes). See P38 and P60 for what each choice gives up.",
          },
          {
            titulo: "5. State around the data",
            texto:
              "A cache per region (warmed locally, without trying to replicate everything), queues per region and a clear rule for messages that cross regions, files in replicated storage, and sessions and identity that do not depend on a single region (for example, signed tokens verified locally with the issuer’s public keys, instead of a lookup in a service in another region).",
          },
          {
            titulo: "6. Operate, test and control the cost",
            texto:
              "Automate failover and failback or document the manual procedure, and **rehearse the failure** (simulate losing a region). Have observability per region (metrics, logs and traces labeled with the region), identical deployment and configuration through code, and attention to the cost of cross-region traffic and duplicated data.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Common topologies",
        colunas: ["Topology", "How it works", "Advantages", "Costs and risks"],
        linhas: [
          [
            "Active-passive",
            "One region serves everything; the other receives the data replica and takes over on failover",
            "The simplest; good protection against losing a region",
            "Cost of the standby region; the RPO depends on replication (usually asynchronous); the failover must be rehearsed; distant users keep high latency",
          ],
          [
            "Active-active with writes in one region",
            "Several regions serve; reads are local (replicas) and writes go to the primary region",
            "Fast reads everywhere and a quicker failover",
            "A distant write has high latency; reads may lag (eventual consistency)",
          ],
          [
            "Active-active partitioned by region",
            "Each tenant or user “lives” in one region, which owns its data",
            "Local writes and a good fit for data residency",
            "Routing by the owning region; cross-region queries and moving a user between regions are complicated",
          ],
          [
            "Active-active with several regions writing (multi-master)",
            "Several regions accept writes to the same data and replicate to each other",
            "Local writes everywhere; survives the loss of any region",
            "Conflicts need a resolution rule and can lose updates; the most complex",
          ],
        ],
        nota: "The consistency given up in each row is covered in P38 (CAP theorem) and P60 (eventual consistency).",
      },
      {
        tipo: "fluxo",
        titulo: "Gradual adoption",
        etapas: [
          "One region done well: several availability zones, infrastructure as code and backups restored in rehearsal (see L122)",
          "A second region on standby (active-passive): data replica, same configuration and a rehearsed failover",
          "Reads close to the user: CDN, regional cache and read replicas, with writes still in one region",
          "Local writes only if the requirement demands them: partition by region, or multi-master with a conflict rule",
          "Regular failure rehearsals and a review of cost, data residency and capacity in each region",
        ],
        nota: "Stop at the first step that meets the requirement. Each following step costs far more than the one before.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Let the requirement choose. If the problem is surviving the loss of a region, **active-passive** with clear RTO and RPO is usually enough. If it is read latency, add **replicas and cache close to the user**. Go to **writes in several regions** only if write latency or availability demand it, and prefer partitioning by region to resolving conflicts.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Data sets the difficulty",
        texto:
          "Replication between regions is usually **asynchronous**: on failover, the latest writes may be lost (the RPO is above zero), and a read on the replica may see old data. Writing the same record in two regions creates conflicts. And data protection law (such as LGPD and GDPR) or a contract may **forbid** replicating certain data to another region: confirm with the legal team before designing the replication.",
      },
    ],
    armadilhas: [
      "Treating multi-region as “copying the deploy”: without designing the data, the regions diverge, writes conflict and the failover delivers old or lost data.",
      "A failover that was never rehearsed: DNS with a long TTL, certificates and secrets only in the main region and insufficient capacity in the secondary. Finding that out during the incident is too late.",
      "A hidden dependency on one region (identity, queue, configuration or a database only in the primary): the other region goes down with it, or cross-region calls on every request cancel the latency gain.",
      "Ignoring cost and data residency: cross-region traffic and duplicated data cost money, and replicating personal data outside the permitted region may break a law or a contract.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between RTO and RPO, and how does multi-region affect each?",
        resposta:
          "RTO is the maximum time tolerated to be operating again; RPO is the maximum amount of data you accept losing, measured in time. A standby region reduces the RTO, but with asynchronous replication the RPO stays above zero; synchronous replication between regions reduces the RPO at the cost of more write latency.",
      },
      {
        pergunta: "Why is active-active much harder than active-passive?",
        resposta:
          "Because data starts being read and written in several regions at the same time: stale reads, write conflicts and the need to decide the consistency level appear (see P38 and P60). In active-passive, only one region writes.",
      },
    ],
  },
};
