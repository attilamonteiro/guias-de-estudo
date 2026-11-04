import type { Pergunta } from "../../tipos";

// M39 · GraphQL e contêineres
export const m39: Pergunta = {
  numero: 239,
  modulo: "mentorcruise",
  metodo: "playbook",
  pt: {
    titulo: "GraphQL e contêineres",
    pergunta: "Qual é a sua familiaridade com GraphQL e contêineres?",
    porqueEsteMetodo:
      "Perguntas de familiaridade avaliam honestidade e profundidade ao mesmo tempo. Um playbook dá a ordem certa: declarar o nível, provar com poucos fatos, mostrar uma armadilha de cada tema e ligar os dois assuntos.",
    resposta30s:
      "Declare o nível com precisão, **só com o que você de fato fez**, e prove o entendimento com poucos fatos. **GraphQL**: API com **schema tipado** e endpoint único, em que o cliente escolhe os campos; **resolvers** buscam os dados, então atenção ao **N+1** e a consultas caras. **Contêineres**: uma **imagem** imutável vira um **processo isolado** (namespaces e cgroups, kernel compartilhado), efêmero, com o estado fora. Juntos: a API GraphQL empacotada numa imagem, publicada num registry e executada em réplicas por um orquestrador.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Como responder, em ordem",
        passos: [
          {
            titulo: "Entenda o que a pergunta testa",
            texto:
              "Não é prova de vocabulário. O entrevistador quer calibrar a profundidade da conversa, ver se você sabe quando usar (e quando não usar) cada tecnologia e se é honesto sobre os limites do que sabe.",
          },
          {
            titulo: "Declare o nível, em palavras concretas",
            texto:
              "“Conheço o conceito”, “fiz projetos pequenos” e “operei em produção” são coisas diferentes: use só a que for verdadeira. Modelo: “Em [tema], meu nível é [o real]: [o que você de fato fez ou estudou].” Se faltar experiência, diga sem rodeios e passe ao que você entende.",
          },
          {
            titulo: "Três fatos-chave de cada",
            texto:
              "**GraphQL**: (1) schema tipado e endpoint único; (2) o cliente escolhe os campos da resposta; (3) resolvers, um por campo, buscam os dados. **Contêineres**: (1) imagem imutável x contêiner em execução; (2) isolamento por namespaces e cgroups sobre o kernel compartilhado; (3) efêmeros, com estado e configuração fora. Três por tema mostram estrutura sem virar palestra.",
          },
          {
            titulo: "Uma armadilha de cada",
            texto:
              "GraphQL: o **N+1** nos resolvers e as consultas arbitrariamente caras, que se mitigam com dataloader e limites de profundidade e complexidade. Contêineres: tratar o contêiner como uma VM pequena, guardando dados dentro dele ou rodando como root. Citar a armadilha mostra que você vai além do folheto.",
          },
          {
            titulo: "Mostre como se combinam",
            texto:
              "Uma API GraphQL é empacotada numa imagem, publicada num registry e executada em réplicas por um orquestrador; como ela não guarda estado local, escalar é subir mais réplicas (veja o fluxo abaixo). Se aprofundarem, compare com REST (veja Q03) e com o conceito geral de contêiner (veja R11).",
          },
          {
            titulo: "Convide a aprofundar",
            texto:
              "Feche perguntando em qual dos dois a vaga mais se apoia, ou oferecendo detalhar um ponto (como evitar o N+1, como montar uma imagem pequena e segura). Isso mostra interesse e leva a conversa para onde você é mais forte.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Primer de GraphQL",
        colunas: ["Conceito", "O essencial"],
        linhas: [
          [
            "Schema e tipos",
            "O contrato da API, escrito numa linguagem de definição de esquema: tipos de objeto, campos, relações e tipos de entrada. O servidor valida toda consulta contra ele, e ferramentas geram documentação e código a partir dele.",
          ],
          [
            "Endpoint único",
            "Um endpoint (geralmente `POST /graphql`) recebe a consulta, na qual o cliente descreve o formato da resposta, e devolve exatamente esses campos. Evita over-fetching (dados demais) e under-fetching (várias chamadas para montar uma tela).",
          ],
          [
            "Query, mutation e subscription",
            "Query lê dados; mutation altera dados; subscription entrega eventos em tempo real, geralmente por uma conexão longa como o WebSocket.",
          ],
          [
            "Resolvers",
            "Uma função por campo, que sabe de onde vem o valor (banco, outro serviço, cache). A execução percorre a consulta e chama os resolvers dos campos pedidos.",
          ],
          [
            "N+1 e dataloader",
            "Se o resolver de um campo faz uma consulta por item de uma lista, uma consulta de lista vira 1 + N. O **dataloader** junta as chaves pedidas na mesma requisição e faz uma busca em lote (e guarda em cache dentro da requisição).",
          ],
          [
            "Cache e limites de custo",
            "Com um endpoint só, o cache HTTP por URL ajuda menos; usam-se caches por entidade no cliente e consultas persistidas. Como o cliente monta a consulta, defina limites de profundidade, complexidade e tempo para que uma consulta aninhada não derrube o servidor.",
          ],
          [
            "Paginação",
            "O padrão comum é por **cursor** (conexões com `edges`, `cursor` e `pageInfo`), mais estável que `offset` quando os dados mudam.",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Primer de contêineres",
        colunas: ["Conceito", "O essencial"],
        linhas: [
          [
            "Imagem x contêiner",
            "A imagem é o pacote imutável (sistema de arquivos com runtime, bibliotecas e código); o contêiner é uma instância dela em execução: um processo isolado, com uma camada gravável por cima.",
          ],
          [
            "Isolamento",
            "No Linux, **namespaces** dão a cada contêiner sua própria visão de processos, rede e sistema de arquivos, e **cgroups** limitam CPU e memória. O kernel é compartilhado com o host: por isso sobe rápido e isola menos que uma VM.",
          ],
          [
            "Dockerfile e camadas",
            "O Dockerfile é a receita; cada instrução gera uma camada que pode ficar em cache. Ponha o que muda pouco (dependências) antes do que muda sempre (código) e use build em múltiplos estágios para uma imagem final menor.",
          ],
          [
            "Registry",
            "Repositório de imagens com versões (tags e digests). O CI publica ali e os servidores puxam de lá. Evite depender da tag `latest`.",
          ],
          [
            "Efêmero e sem estado",
            "O contêiner pode ser destruído e recriado a qualquer momento. O que precisa durar fica em volumes ou serviços externos (banco, armazenamento de objetos); a configuração entra por variáveis de ambiente ou segredos.",
          ],
          [
            "Orquestração",
            "O Kubernetes (ou similar) decide em quais máquinas rodar os contêineres, mantém o número de réplicas, faz atualizações graduais e reinicia os que falham.",
          ],
          [
            "Segurança",
            "Rodar como usuário não root, imagens mínimas (menos pacotes, menos superfície), nenhum segredo dentro da imagem, varredura de vulnerabilidades e atualização das imagens base.",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Um deploy que combina os dois",
        etapas: [
          "Commit e pull request: o CI roda os testes e confere se a mudança no schema GraphQL não quebra clientes existentes",
          "O CI constrói a imagem a partir do Dockerfile (estágios, usuário não root) e a marca com uma versão imutável",
          "A imagem é enviada ao registry",
          "O orquestrador (por exemplo, o Kubernetes) sobe réplicas novas e só manda tráfego para as que passam no health check; as antigas saem aos poucos (atualização gradual)",
          "Configuração e segredos entram por variáveis de ambiente ou pelo gerenciador de segredos; o estado fica no banco, fora do contêiner",
          "Em produção, métricas por operação e por resolver e limites de profundidade e de custo ativos; o rollback é voltar à versão anterior da imagem",
        ],
        nota: "Como o contêiner é descartável e a API não guarda estado local, escalar é subir mais réplicas atrás de um balanceador.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Nível claro vence nível inflado",
        texto:
          "O entrevistador aprofunda o que você afirma. Declarar o nível com precisão e raciocinar corretamente dentro dele é uma resposta mais forte do que afirmar mais do que sabe e ser desmascarado na pergunta seguinte.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "E se você nunca usou um dos dois?",
        texto:
          "Diga isso de forma direta, em uma frase, e mostre o modelo mental que você já tem (por exemplo, o que conhece de APIs REST ou de deploy em servidores). Explique como aprenderia: uma API GraphQL pequena com dois tipos relacionados e uma imagem Docker dela, rodando como usuário não root. Nunca invente um projeto que não existe.",
      },
    ],
    armadilhas: [
      "Inflar o nível: o entrevistador aprofunda exatamente o que você afirmou.",
      "Responder só com definições de dicionário, sem um trade-off nem um problema real (como o N+1 ou o estado guardado dentro do contêiner).",
      "Dizer que GraphQL “substitui o REST” ou “é mais rápido”: ele resolve over-fetching e under-fetching, mas troca isso por custo de consulta imprevisível e cache mais difícil.",
      "Dizer que contêiner “é uma VM leve”: ele compartilha o kernel do host e isola menos.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre imagem e contêiner?",
        resposta:
          "A imagem é o pacote imutável (sistema de arquivos, runtime e código); o contêiner é uma instância dela em execução, um processo isolado com uma camada gravável por cima.",
      },
      {
        pergunta: "O que é o problema N+1 em GraphQL e como se resolve?",
        resposta:
          "O resolver de uma lista dispara uma consulta por item. O dataloader agrupa as chaves pedidas na mesma requisição e faz uma busca em lote, trocando N consultas por uma.",
      },
      {
        pergunta: "Como responder se você só estudou os dois temas e nunca os usou em produção?",
        resposta:
          "Diga isso com clareza, mostre o que entende (fatos-chave e uma armadilha de cada) e explique como praticaria, sem inventar experiência.",
      },
    ],
  },
  en: {
    titulo: "GraphQL and containers",
    pergunta: "How familiar are you with GraphQL and Containers?",
    porqueEsteMetodo:
      "Familiarity questions assess honesty and depth at once. A playbook gives the right order: state your level, prove it with a few facts, show one pitfall for each topic and connect the two.",
    resposta30s:
      "State your level precisely, **using only what you have actually done**, and prove understanding with a few facts. **GraphQL**: an API with a **typed schema** and a single endpoint where the client picks the fields; **resolvers** fetch the data, so watch for **N+1** and expensive queries. **Containers**: an immutable **image** becomes an **isolated process** (namespaces and cgroups, shared kernel), ephemeral, with state kept outside. Together: the GraphQL API packaged into an image, pushed to a registry and run as replicas by an orchestrator.",
    blocos: [
      {
        tipo: "passos",
        titulo: "How to answer, in order",
        passos: [
          {
            titulo: "Understand what the question tests",
            texto:
              "It is not a vocabulary quiz. The interviewer wants to calibrate how deep to go, see whether you know when to use (and when not to use) each technology, and check that you are honest about the limits of what you know.",
          },
          {
            titulo: "State your level in concrete words",
            texto:
              "“I know the concept”, “I built small projects” and “I ran it in production” are different things: use only the one that is true. Template: “With [topic], my level is [the real one]: [what you actually did or studied].” If experience is missing, say so plainly and move on to what you understand.",
          },
          {
            titulo: "Three key facts about each",
            texto:
              "**GraphQL**: (1) typed schema and a single endpoint; (2) the client chooses the fields of the response; (3) resolvers, one per field, fetch the data. **Containers**: (1) immutable image vs running container; (2) isolation through namespaces and cgroups on top of a shared kernel; (3) ephemeral, with state and configuration kept outside. Three per topic show structure without turning into a lecture.",
          },
          {
            titulo: "One pitfall for each",
            texto:
              "GraphQL: **N+1** in resolvers and arbitrarily expensive queries, mitigated with a dataloader and depth and complexity limits. Containers: treating the container as a small VM, keeping data inside it or running as root. Naming the pitfall shows you go beyond the brochure.",
          },
          {
            titulo: "Show how they combine",
            texto:
              "A GraphQL API is packaged into an image, pushed to a registry and run as replicas by an orchestrator; since it keeps no local state, scaling means starting more replicas (see the flow below). If they dig deeper, compare with REST (see Q03) and with the general concept of containers (see R11).",
          },
          {
            titulo: "Invite a deeper dive",
            texto:
              "Close by asking which of the two the role leans on most, or by offering to detail one point (how to avoid N+1, how to build a small and secure image). It shows interest and steers the conversation to where you are strongest.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "GraphQL primer",
        colunas: ["Concept", "The essentials"],
        linhas: [
          [
            "Schema and types",
            "The API contract, written in a schema definition language: object types, fields, relations and input types. The server validates every query against it, and tools generate documentation and code from it.",
          ],
          [
            "Single endpoint",
            "One endpoint (usually `POST /graphql`) receives the query, in which the client describes the shape of the response, and returns exactly those fields. It avoids over-fetching (too much data) and under-fetching (several calls to build one screen).",
          ],
          [
            "Query, mutation and subscription",
            "A query reads data; a mutation changes data; a subscription delivers real-time events, usually over a long-lived connection such as a WebSocket.",
          ],
          [
            "Resolvers",
            "One function per field, which knows where the value comes from (database, another service, cache). Execution walks the query and calls the resolvers of the requested fields.",
          ],
          [
            "N+1 and dataloader",
            "If a field’s resolver runs one query per list item, one list query becomes 1 + N. A **dataloader** collects the keys requested within the same request and does one batched fetch (and caches within the request).",
          ],
          [
            "Cache and cost limits",
            "With a single endpoint, HTTP caching by URL helps less; use per-entity client caches and persisted queries. Since the client builds the query, set limits on depth, complexity and time so a deeply nested query cannot take the server down.",
          ],
          [
            "Pagination",
            "The common pattern is **cursor-based** (connections with `edges`, `cursor` and `pageInfo`), more stable than `offset` when the data changes.",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Containers primer",
        colunas: ["Concept", "The essentials"],
        linhas: [
          [
            "Image vs container",
            "The image is the immutable package (a file system with runtime, libraries and code); the container is a running instance of it: an isolated process with a writable layer on top.",
          ],
          [
            "Isolation",
            "On Linux, **namespaces** give each container its own view of processes, network and file system, and **cgroups** limit CPU and memory. The kernel is shared with the host: that is why it starts fast and isolates less than a VM.",
          ],
          [
            "Dockerfile and layers",
            "The Dockerfile is the recipe; each instruction produces a layer that can be cached. Put what rarely changes (dependencies) before what always changes (code) and use multi-stage builds for a smaller final image.",
          ],
          [
            "Registry",
            "A repository of images with versions (tags and digests). CI pushes there and servers pull from it. Avoid depending on the `latest` tag.",
          ],
          [
            "Ephemeral and stateless",
            "A container can be destroyed and recreated at any moment. What must last lives in volumes or external services (database, object storage); configuration comes in through environment variables or secrets.",
          ],
          [
            "Orchestration",
            "Kubernetes (or similar) decides which machines run the containers, keeps the replica count, does rolling updates and restarts the ones that fail.",
          ],
          [
            "Security",
            "Run as a non-root user, minimal images (fewer packages, less surface), no secrets inside the image, vulnerability scanning and updated base images.",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "A deploy that combines both",
        etapas: [
          "Commit and pull request: CI runs the tests and checks that the GraphQL schema change does not break existing clients",
          "CI builds the image from the Dockerfile (stages, non-root user) and tags it with an immutable version",
          "The image is pushed to the registry",
          "The orchestrator (for example, Kubernetes) starts new replicas and only sends traffic to those that pass the health check; the old ones leave gradually (rolling update)",
          "Configuration and secrets arrive through environment variables or the secrets manager; state stays in the database, outside the container",
          "In production, metrics per operation and per resolver and depth and cost limits switched on; rollback means going back to the previous image version",
        ],
        nota: "Since the container is disposable and the API keeps no local state, scaling means starting more replicas behind a load balancer.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A clear level beats an inflated one",
        texto:
          "The interviewer digs into what you claim. Stating your level precisely and reasoning correctly within it is a stronger answer than claiming more than you know and being exposed by the next question.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "What if you have never used one of them?",
        texto:
          "Say so directly, in one sentence, and show the mental model you already have (for example, what you know about REST APIs or server deployments). Explain how you would learn: a small GraphQL API with two related types and a Docker image of it, running as a non-root user. Never invent a project that does not exist.",
      },
    ],
    armadilhas: [
      "Inflating your level: the interviewer digs into exactly what you claimed.",
      "Answering with dictionary definitions only, with no trade-off and no real problem (such as N+1 or state kept inside the container).",
      "Saying GraphQL “replaces REST” or “is faster”: it solves over-fetching and under-fetching, but trades that for unpredictable query cost and harder caching.",
      "Saying a container “is a lightweight VM”: it shares the host kernel and isolates less.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between an image and a container?",
        resposta:
          "The image is the immutable package (file system, runtime and code); the container is a running instance of it, an isolated process with a writable layer on top.",
      },
      {
        pergunta: "What is the N+1 problem in GraphQL and how do you fix it?",
        resposta:
          "A list resolver fires one query per item. A dataloader collects the keys requested within the same request and does one batched fetch, turning N queries into one.",
      },
      {
        pergunta: "How do you answer if you have only studied both topics and never used them in production?",
        resposta:
          "Say so clearly, show what you understand (key facts and one pitfall for each) and explain how you would practice, without inventing experience.",
      },
    ],
  },
};
