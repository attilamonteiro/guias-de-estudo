import type { Pergunta } from "../../tipos";

// P97 · Sidecars
export const p097: Pergunta = {
  numero: 797,
  modulo: "pawanmkr-devops",
  metodo: "feynman",
  pt: {
    titulo: "Sidecars",
    pergunta: "O que são sidecars em microsserviços e quais são seus casos de uso típicos?",
    porqueEsteMetodo:
      "O sidecar é um padrão de implantação que se entende bem por uma imagem física: o carrinho preso à moto. A analogia dá a intuição, e depois vêm o mecanismo real, os usos e o ponto em que a imagem para de valer.",
    resposta30s:
      "Um **sidecar** é um contêiner ou processo auxiliar implantado **junto** do serviço, no mesmo pod ou host, compartilhando rede, volumes e ciclo de vida, e que assume funções que o serviço não precisa carregar: **proxy de rede e service mesh** (mTLS, retentativas, métricas), **coleta de logs**, **sincronização de configuração e segredos** e **adaptação de protocolo**. A aplicação Node.js fica mais simples e as funções valem para qualquer linguagem, ao custo de mais recursos, um salto a mais e mais complexidade operacional. Quando a função é simples ou precisa estar dentro do processo, prefira uma biblioteca.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Uma moto é feita para ser leve e rápida. Para levar bagagem ou um passageiro, prende-se um sidecar ao lado: ele vai junto aonde a moto for, vira quando ela vira e carrega o que a moto não precisa carregar. Dá para trocar o sidecar sem mexer no motor, e a moto continua sendo a mesma.",
        tecnico:
          "No padrão sidecar, um segundo contêiner ou processo roda ao lado do serviço principal: no Kubernetes, no mesmo **pod**; fora dele, no mesmo host. Os dois compartilham a rede (conversam por `localhost`), os volumes e o ciclo de vida: sobem, descem e escalam juntos, mas têm imagens, versões e recursos separados. O serviço em Node.js cuida do negócio, e o sidecar cuida de funções transversais, iguais para todos os serviços, qualquer que seja a linguagem em que cada um foi escrito.",
        limite:
          "O sidecar da moto é inerte; o de software consome CPU e memória, acrescenta um salto de rede local, pode falhar sozinho e precisa ser atualizado e depurado. Ele também não é invisível: a aplicação e o sidecar precisam combinar a ordem de início e de fim.",
      },
      {
        tipo: "fluxo",
        titulo: "Uma chamada entre dois serviços com sidecars de service mesh",
        etapas: [
          'O serviço A (Node.js) faz `fetch("http://pagamentos/...")`. O tráfego de saída do pod é desviado para o **sidecar proxy** do próprio pod, em geral por regras de rede configuradas na implantação; o código da aplicação não muda',
          "O sidecar de A descobre as instâncias de `pagamentos`, escolhe uma (balanceamento), abre a conexão com **mTLS** (cada serviço prova a sua identidade) e aplica **timeout** e **retentativa** conforme a política",
          "A chamada atravessa a rede até o pod de B; o sidecar de B termina o TLS, verifica identidade e autorização e entrega a requisição à aplicação de B por `localhost`",
          "A resposta volta pelo mesmo caminho. Os dois sidecars registram **métricas** da chamada (latência, status) e propagam o **trace**",
          "Quando a política muda (outro timeout, outra regra de retentativa), o plano de controle atualiza os sidecars, em geral sem alterar nem reiniciar as aplicações",
        ],
        nota: "O mesmo desenho vale para outros sidecars: um coletor de logs ou um agente de segredos só muda o que faz ao lado da aplicação.",
      },
      {
        tipo: "tabela",
        titulo: "Casos de uso típicos",
        colunas: ["Caso de uso", "O que o sidecar faz", "Exemplos", "O que sai da aplicação Node.js"],
        linhas: [
          [
            "Proxy de rede e service mesh",
            "mTLS entre serviços, balanceamento, timeouts, retentativas, métricas e traces do tráfego",
            "Envoy, o proxy do Linkerd e malhas como o Istio",
            "Código de TLS entre serviços, retentativas e instrumentação de rede em cada cliente HTTP",
          ],
          [
            "Coleta de logs",
            "Lê os logs que a aplicação deixa no stdout ou em um volume compartilhado e os envia ao armazenamento central (veja P54)",
            "Fluent Bit, Vector",
            "O envio dos logs: a aplicação só escreve JSON",
          ],
          [
            "Configuração e segredos",
            "Busca no cofre ou no serviço de configuração, renova e entrega em um volume compartilhado ou em `localhost`",
            "Agentes de cofres de segredos, como o Vault Agent",
            "Conhecer o cofre e renovar credenciais: a aplicação só lê um arquivo",
          ],
          [
            "Adaptador de protocolo",
            "Traduz o que a aplicação fala para o que o resto do sistema espera (por exemplo, expor métricas no formato esperado pelo monitoramento ou falar um protocolo legado)",
            "Exportadores de métricas e proxies de protocolo, conforme o caso",
            "A tradução de formato e a dependência do protocolo legado",
          ],
          [
            "Proxy de acesso a serviços gerenciados",
            "Autentica e protege a conexão com um banco de dados ou serviço de nuvem",
            "Proxies de autenticação de provedores de nuvem, como o Cloud SQL Auth Proxy",
            "Credenciais e TLS específicos daquele serviço",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Sidecar ou biblioteca?",
        texto:
          "Prefira **sidecar** quando a função é transversal e igual para todos os serviços, os serviços usam linguagens diferentes (Node.js, Java, Go…) e você quer uma implementação só, ou quando o time de plataforma precisa atualizá-la sem pedir a cada time que recompile e reimplante. Prefira **biblioteca** quando a função é simples, precisa estar dentro do processo (acesso a objetos da requisição, regra de negócio, latência mínima) ou quando o custo de um processo extra por instância não compensa. Regra: sidecar para infraestrutura igual para todos; biblioteca para lógica da aplicação. Não confunda com o proxy reverso na frente do serviço (veja D64), que é compartilhado e fica na borda: o sidecar é um por instância e também cuida do tráfego de saída.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Os custos do sidecar",
        texto:
          "Cada sidecar é um processo a mais por instância: CPU, memória, um salto local extra de latência e mais uma peça para versionar, atualizar e depurar. Há **dois pontos de falha**: o sidecar pode cair com a aplicação saudável. Cuide da **ordem**: a aplicação não deve enviar tráfego antes de o proxy estar pronto, e, no desligamento, o sidecar precisa viver até a aplicação drenar as conexões (veja L115). Em tarefas que terminam (Jobs), um sidecar que nunca sai pode impedir o pod de concluir. Versões recentes do Kubernetes têm suporte nativo a sidecars, com ordem de início e de fim (confira a documentação), e algumas malhas de serviço já oferecem modos sem sidecar.",
      },
    ],
    armadilhas: [
      "Tratar o sidecar como uma biblioteca: é outro processo, com recursos, versão e falhas próprios.",
      "Esquecer a ordem de início e de fim: a aplicação chama a rede antes de o proxy estar pronto, ou o sidecar morre antes de a aplicação terminar de responder.",
      "Pôr regra de negócio no sidecar: ele é para infraestrutura transversal; a lógica da aplicação fica no serviço.",
      "Subestimar o custo: um sidecar por pod, em centenas de pods, multiplica CPU, memória e trabalho de atualização.",
    ],
    autoteste: [
      {
        pergunta: "O que um sidecar compartilha com a aplicação e o que mantém separado?",
        resposta:
          "Compartilha o pod ou o host: a rede (`localhost`), os volumes e o ciclo de vida (sobe, desce e escala junto). Mantém separados a imagem, a versão, o processo e os recursos de CPU e memória, o que permite atualizá-lo sem mexer no código da aplicação.",
      },
      {
        pergunta: "Quando você preferiria uma biblioteca a um sidecar?",
        resposta:
          "Quando a função é simples, está na mesma linguagem em todos os serviços, precisa viver dentro do processo (por exemplo, usar o objeto da requisição ou ter latência mínima) ou quando o custo de um processo extra por instância não compensa.",
      },
    ],
  },
  en: {
    titulo: "Sidecars",
    pergunta: "What are sidecars in microservices and what are their typical use cases?",
    porqueEsteMetodo:
      "The sidecar is a deployment pattern that is easy to grasp through a physical image: the side car attached to a motorcycle. The analogy gives the intuition, and then come the real mechanism, the uses and the point where the picture stops holding.",
    resposta30s:
      "A **sidecar** is a helper container or process deployed **alongside** the service, in the same pod or host, sharing network, volumes and lifecycle, and taking over functions the service should not have to carry: **network proxy and service mesh** (mTLS, retries, metrics), **log collection**, **configuration and secrets sync** and **protocol adaptation**. The Node.js application stays simpler and the functions work for any language, at the cost of more resources, an extra hop and more operational complexity. When the function is simple or must live inside the process, prefer a library.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "A motorcycle is built to be light and fast. To carry luggage or a passenger, you attach a sidecar to its side: it goes wherever the motorcycle goes, turns when it turns and carries what the motorcycle does not need to carry. You can swap the sidecar without touching the engine, and the motorcycle stays the same.",
        tecnico:
          "In the sidecar pattern, a second container or process runs next to the main service: on Kubernetes, in the same **pod**; outside it, on the same host. The two share the network (they talk over `localhost`), the volumes and the lifecycle: they start, stop and scale together, but have separate images, versions and resources. The Node.js service takes care of the business, and the sidecar takes care of cross-cutting functions, the same for every service, whatever language each one is written in.",
        limite:
          "A motorcycle’s sidecar is inert; a software one consumes CPU and memory, adds a local network hop, can fail on its own and must be updated and debugged. It is not invisible either: the application and the sidecar must agree on the order of startup and shutdown.",
      },
      {
        tipo: "fluxo",
        titulo: "A call between two services with service-mesh sidecars",
        etapas: [
          'Service A (Node.js) calls `fetch("http://payments/...")`. The pod’s outbound traffic is diverted to the pod’s own **sidecar proxy**, usually by network rules set up at deployment; the application code does not change',
          "A’s sidecar discovers the instances of `payments`, picks one (load balancing), opens the connection with **mTLS** (each service proves its identity) and applies **timeout** and **retry** according to policy",
          "The call crosses the network to B’s pod; B’s sidecar terminates TLS, checks identity and authorization and hands the request to B’s application over `localhost`",
          "The response returns along the same path. Both sidecars record the call’s **metrics** (latency, status) and propagate the **trace**",
          "When the policy changes (another timeout, another retry rule), the control plane updates the sidecars, usually without changing or restarting the applications",
        ],
        nota: "The same design holds for other sidecars: a log collector or a secrets agent only changes what it does next to the application.",
      },
      {
        tipo: "tabela",
        titulo: "Typical use cases",
        colunas: ["Use case", "What the sidecar does", "Examples", "What leaves the Node.js application"],
        linhas: [
          [
            "Network proxy and service mesh",
            "mTLS between services, load balancing, timeouts, retries, traffic metrics and traces",
            "Envoy, Linkerd’s proxy and meshes such as Istio",
            "TLS code between services, retries and network instrumentation in every HTTP client",
          ],
          [
            "Log collection",
            "Reads the logs the application leaves on stdout or in a shared volume and ships them to central storage (see P54)",
            "Fluent Bit, Vector",
            "Shipping the logs: the application only writes JSON",
          ],
          [
            "Configuration and secrets",
            "Fetches from the vault or configuration service, renews and delivers in a shared volume or on `localhost`",
            "Secrets-vault agents, such as Vault Agent",
            "Knowing the vault and renewing credentials: the application only reads a file",
          ],
          [
            "Protocol adapter",
            "Translates what the application speaks into what the rest of the system expects (for example, exposing metrics in the format monitoring expects, or speaking a legacy protocol)",
            "Metrics exporters and protocol proxies, as the case may be",
            "The format translation and the dependency on the legacy protocol",
          ],
          [
            "Proxy for managed services",
            "Authenticates and protects the connection to a database or cloud service",
            "Authentication proxies from cloud providers, such as Cloud SQL Auth Proxy",
            "Credentials and TLS specific to that service",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Sidecar or library?",
        texto:
          "Prefer a **sidecar** when the function is cross-cutting and identical for all services, the services use different languages (Node.js, Java, Go…) and you want a single implementation, or when the platform team must update it without asking every team to rebuild and redeploy. Prefer a **library** when the function is simple, must live inside the process (access to request objects, business rules, minimal latency) or when the cost of an extra process per instance is not worth it. Rule: sidecar for infrastructure that is the same for everyone; library for application logic. Do not confuse it with the reverse proxy in front of the service (see D64), which is shared and sits at the edge: the sidecar is one per instance and also handles outbound traffic.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The costs of a sidecar",
        texto:
          "Each sidecar is an extra process per instance: CPU, memory, an extra local hop of latency and one more piece to version, update and debug. There are **two points of failure**: the sidecar can go down while the application is healthy. Watch the **order**: the application must not send traffic before the proxy is ready, and, at shutdown, the sidecar must stay alive until the application drains its connections (see L115). In tasks that finish (Jobs), a sidecar that never exits can keep the pod from completing. Recent Kubernetes versions have native sidecar support, with start and stop ordering (check the documentation), and some service meshes already offer sidecar-less modes.",
      },
    ],
    armadilhas: [
      "Treating the sidecar like a library: it is another process, with its own resources, version and failures.",
      "Forgetting the startup and shutdown order: the application calls the network before the proxy is ready, or the sidecar dies before the application finishes responding.",
      "Putting business rules in the sidecar: it is for cross-cutting infrastructure; application logic stays in the service.",
      "Underestimating the cost: one sidecar per pod, across hundreds of pods, multiplies CPU, memory and update work.",
    ],
    autoteste: [
      {
        pergunta: "What does a sidecar share with the application and what does it keep separate?",
        resposta:
          "It shares the pod or host: the network (`localhost`), the volumes and the lifecycle (it starts, stops and scales together). It keeps separate the image, the version, the process and the CPU and memory resources, which lets you update it without touching the application code.",
      },
      {
        pergunta: "When would you prefer a library over a sidecar?",
        resposta:
          "When the function is simple, is in the same language across all services, must live inside the process (for example, using the request object or needing minimal latency), or when the cost of an extra process per instance is not worth it.",
      },
    ],
  },
};
