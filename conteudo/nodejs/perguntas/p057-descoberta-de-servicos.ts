import type { Pergunta } from "../../tipos";

// P57 · Descoberta de serviços
export const p057: Pergunta = {
  numero: 757,
  modulo: "pawanmkr-distribuidos",
  metodo: "feynman",
  pt: {
    titulo: "Descoberta de serviços",
    pergunta: "Qual é o papel da descoberta de serviços (service discovery) em microsserviços?",
    porqueEsteMetodo:
      "Descoberta de serviços resolve um problema que cabe numa frase (“onde está o serviço X agora?”), mas as variações (cliente ou servidor, registro ou DNS) confundem. Uma analogia simples firma a ideia, e a tabela mostra como cada abordagem a realiza.",
    resposta30s:
      "A **descoberta de serviços** responde, em tempo de execução, à pergunta “em que endereço está o serviço X agora?”, porque em microsserviços as instâncias sobem, caem e mudam de IP o tempo todo. Um **registro** guarda o nome do serviço e as suas instâncias saudáveis (com **health checks**), e a consulta acontece **no cliente**, que escolhe a instância, ou **no servidor**, por um balanceador, pelo DNS interno ou pelo Kubernetes. Numa plataforma de orquestração isso já vem pronto; fora dela, ferramentas como o Consul cumprem esse papel.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine uma lista telefônica que se atualiza sozinha. Quando uma filial nova do restaurante abre, ela entra na lista; quando uma fecha, ou para de atender o telefone, o nome sai ou é marcado como fora do ar. Quem quer pedir uma pizza não decora números: procura “pizzaria” e recebe um número que atende agora. Se a lista fosse impressa uma vez por ano, metade dos números estaria errada.",
        tecnico:
          "Em microsserviços, as instâncias são criadas e destruídas a toda hora (escala, deploy, falha) e recebem endereços (IP e porta) que mudam, então não dá para escrevê-los no código ou numa variável de ambiente fixa. A **descoberta de serviços** dá a cada serviço um **nome lógico** (`pagamentos`) e mantém um **registro** que relaciona o nome às instâncias saudáveis de agora. As instâncias entram nele (elas mesmas ou a plataforma por elas), os clientes consultam, e quem consulta ganha, de quebra, o **balanceamento** entre as instâncias.",
        limite:
          "A lista telefônica não sabe que um número parou de atender, e o registro também não, a menos que alguém verifique: sem **health checks** (ou expiração por TTL), ele aponta para instâncias mortas. E quem consulta pode guardar uma cópia velha da lista (o cache de DNS do cliente, uma conexão que continua aberta). A lista pode estar certa e o cliente continuar errado.",
      },
      {
        tipo: "fluxo",
        titulo: "O ciclo de vida de uma instância",
        etapas: [
          "Uma instância de `pagamentos` sobe em um endereço qualquer (por exemplo, `10.0.3.7:3000`) e fica pronta para atender",
          "Ela é **registrada** sob o nome `pagamentos`, por si mesma ou pela plataforma",
          "O registro verifica a saúde dela com frequência (um `GET /saude`, um heartbeat ou um TTL que ela renova)",
          "Um cliente pede “`pagamentos`” e recebe as instâncias saudáveis; escolhe uma (rodízio, menos conexões) e chama",
          "Quando a instância é desligada, ela se **desregistra** antes de encerrar; se cair sem aviso, falha nos health checks e é removida",
          "O cliente usa timeout e tenta outra instância se a escolhida falhar, porque o registro pode estar alguns segundos atrasado",
        ],
      },
      {
        tipo: "tabela",
        titulo: "Onde acontece a consulta",
        colunas: ["Abordagem", "Quem consulta e escolhe", "Exemplos", "Atenção"],
        linhas: [
          [
            "Do lado do cliente",
            "O cliente (uma biblioteca no código) consulta o registro e escolhe a instância",
            "Registros como Consul ou Eureka",
            "Permite balancear por zona ou peso e evita um salto extra, mas leva a lógica para cada cliente e linguagem",
          ],
          [
            "Do lado do servidor",
            "Um balanceador, proxy ou a própria plataforma consulta e encaminha; o cliente chama um nome estável",
            "Kubernetes Services, balanceadores de nuvem, proxy reverso",
            "O cliente fica simples, mas o balanceador vira uma peça crítica e um salto a mais",
          ],
          [
            "Por DNS",
            "O DNS devolve os endereços do nome (registros A ou SRV) e o cliente usa um deles",
            "DNS interno do cluster, DNS de um registro como o Consul",
            "Simples e universal, mas sujeito a cache (TTL) e sem checagem de saúde mais fina",
          ],
        ],
        nota: "As abordagens se misturam: um Service do Kubernetes é descoberta do lado do servidor, anunciada por DNS.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Quando nem é preciso um registro próprio",
        texto:
          "Se os serviços já rodam numa plataforma de orquestração, como o Kubernetes, ela resolve o problema: o seu código chama `http://pagamentos` e o DNS do cluster e o Service cuidam do resto, com as probes de saúde da própria plataforma. Um registro à parte (Consul, por exemplo) faz sentido quando há máquinas virtuais, mais de uma plataforma ou necessidade de metadados e health checks próprios. Quanto menos peças, melhor; confira a documentação da sua plataforma.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Duas armadilhas que aparecem em Node",
        texto:
          "Conexões keep-alive, que o `fetch`, o `undici` e o `http.Agent` reutilizam, continuam presas ao IP resolvido antes: depois de uma troca de instância, o cliente pode seguir falando com um endereço antigo até a conexão fechar, então limite o tempo de vida das conexões ou renove o pool de tempos em tempos. E o registro é uma dependência crítica: guarde a última lista conhecida e continue funcionando se ele ficar fora do ar. Veja também P10 sobre DNS.",
      },
    ],
    armadilhas: [
      "Fixar IP e porta no código ou em variáveis que ninguém atualiza: no primeiro deploy ou na primeira troca de máquina, o endereço envelhece.",
      "Instâncias mortas no registro: sem health check ou TTL, e sem desregistrar no encerramento (`SIGTERM`, veja L115), os clientes recebem endereços que não respondem.",
      "Confiar no cache: o cache de DNS do cliente e as conexões keep-alive seguram endereços antigos depois de a lista mudar.",
      "Tornar o registro um ponto único de falha: se cada chamada depende de consultá-lo e ele cai, o sistema inteiro cai junto; guarde a última lista conhecida.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre descoberta do lado do cliente e do lado do servidor?",
        resposta:
          "No lado do cliente, o próprio cliente consulta o registro e escolhe a instância. No lado do servidor, o cliente chama um nome estável e um balanceador, proxy ou a plataforma consulta o registro e encaminha, o que deixa o cliente mais simples.",
      },
      {
        pergunta: "Num cluster Kubernetes, é preciso instalar um registro como o Consul para descobrir serviços?",
        resposta:
          "Em geral não: o Service e o DNS do cluster já dão nome estável e balanceamento, e as probes retiram instâncias doentes. Um registro à parte só vale se houver necessidade fora do cluster ou recursos que a plataforma não oferece.",
      },
    ],
  },
  en: {
    titulo: "Service discovery",
    pergunta: "What is the role of service discovery in microservices?",
    porqueEsteMetodo:
      "Service discovery solves a problem that fits in one sentence (“where is service X right now?”), but its variations (client or server, registry or DNS) cause confusion. A simple analogy anchors the idea, and the table shows how each approach carries it out.",
    resposta30s:
      "**Service discovery** answers, at runtime, the question “at which address is service X right now?”, because in microservices instances come up, go down and change IPs all the time. A **registry** stores the service name and its healthy instances (with **health checks**), and the lookup happens **on the client**, which picks the instance, or **on the server side**, through a load balancer, internal DNS or Kubernetes. On an orchestration platform this comes built in; outside one, tools such as Consul fill that role.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine a phone book that updates itself. When a new branch of the restaurant opens, it is added to the list; when one closes, or stops picking up the phone, its name is removed or marked as out of service. Someone who wants a pizza does not memorize numbers: they look up “pizzeria” and get a number that answers right now. If the book were printed once a year, half the numbers would be wrong.",
        tecnico:
          "In microservices, instances are created and destroyed all the time (scaling, deploys, failures) and get addresses (IP and port) that change, so you cannot write them in the code or in a fixed environment variable. **Service discovery** gives each service a **logical name** (`payments`) and keeps a **registry** that maps the name to the healthy instances of the moment. Instances enter it (by themselves, or the platform does it for them), clients query it, and whoever queries also gets **load balancing** across the instances as a bonus.",
        limite:
          "The phone book does not know that a number stopped answering, and neither does the registry unless someone checks: without **health checks** (or expiry by TTL), it points to dead instances. And whoever queries may keep an old copy of the list (the client’s DNS cache, a connection that stays open). The list can be right and the client still wrong.",
      },
      {
        tipo: "fluxo",
        titulo: "The life cycle of an instance",
        etapas: [
          "An instance of `payments` starts at some address (for example, `10.0.3.7:3000`) and becomes ready to serve",
          "It is **registered** under the name `payments`, by itself or by the platform",
          "The registry checks its health frequently (a `GET /health`, a heartbeat or a TTL it renews)",
          "A client asks for “`payments`” and receives the healthy instances; it picks one (round robin, fewest connections) and calls it",
          "When the instance is shut down, it **deregisters** before exiting; if it crashes without warning, it fails the health checks and is removed",
          "The client uses a timeout and tries another instance if the chosen one fails, because the registry may be a few seconds behind",
        ],
      },
      {
        tipo: "tabela",
        titulo: "Where the lookup happens",
        colunas: ["Approach", "Who looks up and chooses", "Examples", "Watch out for"],
        linhas: [
          [
            "Client-side",
            "The client (a library in the code) queries the registry and picks the instance",
            "Registries such as Consul or Eureka",
            "Allows balancing by zone or weight and avoids an extra hop, but moves the logic into every client and language",
          ],
          [
            "Server-side",
            "A load balancer, proxy or the platform itself queries and forwards; the client calls a stable name",
            "Kubernetes Services, cloud load balancers, a reverse proxy",
            "The client stays simple, but the balancer becomes a critical part and an extra hop",
          ],
          [
            "Through DNS",
            "DNS returns the addresses for the name (A or SRV records) and the client uses one of them",
            "The cluster’s internal DNS, the DNS interface of a registry such as Consul",
            "Simple and universal, but subject to caching (TTL) and without finer health checking",
          ],
        ],
        nota: "The approaches mix: a Kubernetes Service is server-side discovery, announced through DNS.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "When you do not even need a registry of your own",
        texto:
          "If the services already run on an orchestration platform such as Kubernetes, it solves the problem: your code calls `http://payments` and the cluster DNS and the Service take care of the rest, with the platform’s own health probes. A separate registry (Consul, for example) makes sense when there are virtual machines, more than one platform, or a need for metadata and health checks of your own. The fewer moving parts, the better; check the documentation of your platform.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Two traps that show up in Node",
        texto:
          "Keep-alive connections, which `fetch`, `undici` and `http.Agent` reuse, stay tied to the IP resolved earlier: after an instance swap, the client may keep talking to an old address until the connection closes, so limit the connection lifetime or refresh the pool from time to time. And the registry is a critical dependency: keep the last known list and keep working if it goes down. See also P10 about DNS.",
      },
    ],
    armadilhas: [
      "Hard-coding an IP and port in the code or in variables nobody updates: at the first deploy or machine swap, the address goes stale.",
      "Dead instances in the registry: with no health check or TTL, and no deregistration on shutdown (`SIGTERM`, see L115), clients receive addresses that do not answer.",
      "Trusting the cache: the client’s DNS cache and keep-alive connections hold old addresses after the list has changed.",
      "Making the registry a single point of failure: if every call depends on querying it and it goes down, the whole system goes with it; keep the last known list.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between client-side and server-side discovery?",
        resposta:
          "In client-side discovery, the client itself queries the registry and picks the instance. In server-side discovery, the client calls a stable name and a load balancer, proxy or the platform queries the registry and forwards, which keeps the client simpler.",
      },
      {
        pergunta: "In a Kubernetes cluster, do you need to install a registry such as Consul to discover services?",
        resposta:
          "Generally not: the Service and the cluster DNS already provide a stable name and load balancing, and probes remove unhealthy instances. A separate registry is only worth it if you need something outside the cluster or features the platform does not offer.",
      },
    ],
  },
};
