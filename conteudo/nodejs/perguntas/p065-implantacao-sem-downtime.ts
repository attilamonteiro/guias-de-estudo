import type { Pergunta } from "../../tipos";

// P65 · Implantação sem downtime
export const p065: Pergunta = {
  numero: 765,
  modulo: "pawanmkr-distribuidos",
  metodo: "compare",
  pt: {
    titulo: "Implantação sem downtime",
    pergunta: "Como funciona a implantação sem downtime e quais são as estratégias comuns para alcançá-la?",
    porqueEsteMetodo:
      "Cada estratégia troca custo, velocidade de volta e risco de um jeito diferente. A matriz mostra essas trocas lado a lado, e a regra de decisão diz qual escolher em cada situação.",
    resposta30s:
      "**Implantação sem downtime** é trocar a versão sem que o usuário perceba interrupção: a nova sobe, fica **pronta** (verificação de prontidão), recebe tráfego, e a antiga **drena** as conexões e sai. As estratégias comuns são **rolling** (troca gradual de instâncias), **blue-green** (dois ambientes completos e troca do tráfego, com volta imediata e custo dobrado) e **canary** (uma pequena parcela do tráfego primeiro). Para funcionar, a aplicação precisa de prontidão, desligamento gracioso e um banco compatível com as duas versões.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Estratégias de implantação",
        colunas: ["Estratégia", "Como funciona", "Downtime e custo", "Rollback", "Quando usar"],
        linhas: [
          [
            "Recriar",
            "Para a versão antiga e só então sobe a nova",
            "Há downtime entre parar e a nova ficar pronta; sem custo extra",
            "Reimplantar a versão anterior, com novo downtime",
            "Ambiente de teste, janela de manutenção combinada ou mudança em que as duas versões não podem coexistir",
          ],
          [
            "Rolling (gradual)",
            "Troca as instâncias aos poucos: sobe uma nova, espera ficar pronta, retira uma antiga e repete; durante a troca, as duas versões atendem ao mesmo tempo",
            "Sem downtime se houver capacidade e verificação de prontidão; custo extra pequeno (algumas instâncias a mais durante a troca)",
            "Reverter a implantação, que é outra troca gradual (leva tempo)",
            "O ponto de partida para a maioria dos serviços sem estado, quando as duas versões convivem sem problema",
          ],
          [
            "Blue-green",
            "Dois ambientes completos: o verde recebe a versão nova enquanto o azul atende; depois de testar, o tráfego é trocado de uma vez",
            "Sem downtime; custo de manter a capacidade dobrada durante a troca",
            "Imediato: devolver o tráfego ao azul, enquanto ele existir",
            "Mudanças que você quer validar inteiras antes de expor, ou quando precisa de volta rápida; exige banco compatível com as duas versões",
          ],
          [
            "Canary",
            "Libera a versão nova para uma pequena parcela do tráfego, observa erros e latência e a amplia aos poucos",
            "Sem downtime; custo pequeno, mas exige roteamento por peso e boas métricas",
            "Rápido: tirar a parcela do tráfego",
            "Mudanças arriscadas em serviços com bastante tráfego, quando há métricas para decidir",
          ],
        ],
        nota: "Rolling, blue-green e canary só valem sem downtime se a aplicação souber subir e descer direito (veja os passos abaixo).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Escolha pelo risco da mudança e pelo que você pode pagar. **Rolling** é o ponto de partida para serviços sem estado. **Blue-green** quando você quer validar o ambiente novo inteiro antes de expor e precisa de volta imediata, aceitando o custo da capacidade dobrada. **Canary** quando a mudança é arriscada e há métricas para dizer se a parcela pequena está saudável. **Recriar** só onde um downtime é aceitável. Em qualquer uma, **separe implantar de liberar** com feature flags (veja P66): o código sobe desligado e é ligado depois.",
      },
      {
        tipo: "passos",
        titulo: "O que a aplicação precisa fazer, qualquer que seja a estratégia",
        passos: [
          {
            titulo: "Dizer quando está pronta",
            texto:
              "Exponha uma verificação de vida (o processo está de pé) e outra de **prontidão** (conexões abertas, caches aquecidos, pronta para tráfego). O balanceador ou o Kubernetes só manda tráfego depois que a prontidão responde bem.",
          },
          {
            titulo: "Desligar com graça",
            texto:
              "Ao receber `SIGTERM`, a instância falha a prontidão para sair do balanceamento, para de aceitar conexões novas, termina as requisições em andamento, fecha pools e filas e sai antes do prazo do orquestrador (veja L115).",
          },
          {
            titulo: "Drenar as conexões",
            texto:
              "Conexões keep-alive, WebSockets e consultas longas atrasam o encerramento. Dê a elas um prazo, avise os clientes para reconectar e encerre as ociosas; senão a instância fica pendurada até ser morta à força.",
          },
          {
            titulo: "Não guardar estado na instância",
            texto:
              "Sessão em Redis ou em token, arquivos em armazenamento externo, trabalho agendado em fila. A memória e o disco local somem quando a instância sai.",
          },
          {
            titulo: "Manter o banco compatível com as duas versões",
            texto:
              "Durante a troca, a versão antiga e a nova usam o mesmo banco. Faça as migrações em duas fases, **expandir e contrair** (veja P87): adicione colunas e tabelas opcionais primeiro, migre os dados e só depois remova o antigo. O mesmo vale para o formato das mensagens em filas.",
          },
          {
            titulo: "Ter volta",
            texto:
              "Mantenha a versão anterior pronta (imagem imutável com tag) e o procedimento de volta ensaiado. Voltar o código é fácil; uma migração de dados já aplicada é que não volta sozinha.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Como implementar em aplicações Node.js",
        colunas: ["Mecanismo", "Como entrega sem downtime", "Cuidado"],
        linhas: [
          [
            "Balanceador ou proxy reverso (Nginx, HAProxy, Envoy e similares)",
            "Apontam para um grupo de instâncias; no blue-green, troque o grupo ativo; no rolling e no canary, mude as instâncias ou os pesos, recarregando a configuração sem derrubar as conexões",
            "Precisa de verificação de saúde ativa e de recarga graciosa (veja D64)",
          ],
          [
            "PM2 em modo cluster",
            "O `pm2 reload` reinicia os workers um de cada vez, com os outros atendendo; o `restart` derruba todos de uma vez",
            "Vale para um único host; o app deve tratar o sinal de encerramento que o PM2 envia (confira a documentação); não cobre blue-green",
          ],
          [
            "Kubernetes: Deployment",
            "A estratégia `RollingUpdate` (com `maxSurge` e `maxUnavailable`) troca os pods aos poucos, guiada pela `readinessProbe`; `preStop` e `terminationGracePeriodSeconds` dão tempo de drenar",
            "Sem `readinessProbe`, o pod recebe tráfego antes da hora; o app precisa tratar o `SIGTERM`",
          ],
          [
            "Kubernetes: blue-green e canary",
            "Blue-green: dois Deployments e o seletor do Service (ou o roteamento do Ingress) aponta para um ou para o outro. Canary: divisão do tráfego por pesos no controlador de ingress, em uma malha de serviços ou em ferramentas de entrega progressiva, como Argo Rollouts e Flagger",
            "Cada ferramenta tem recursos e limites próprios: confira a documentação",
          ],
          [
            "Plataformas gerenciadas",
            "Muitas oferecem slots de implantação ou implantação gradual ou blue-green nativa",
            "Confira como tratam a prontidão, o banco e a volta",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Sem downtime não significa sem risco",
        texto:
          "O blue-green devolve o tráfego ao ambiente antigo em segundos, mas **não desfaz uma migração de dados** já aplicada nem as gravações que a versão nova fez em formato novo. Duas versões convivem no rolling, no canary e até na janela do blue-green: se a nova grava algo que a antiga não entende, ou remove uma coluna que a antiga usa, a troca quebra mesmo com a infraestrutura perfeita. O mesmo vale para mensagens em filas e contratos de API.",
      },
    ],
    armadilhas: [
      "Achar que o blue-green resolve o banco: uma migração incompatível derruba o azul e o verde, e voltar o tráfego não adianta.",
      "Não ter verificação de prontidão: a instância nova recebe tráfego antes de abrir o pool e aquecer, e a troca vira uma rajada de erros 5xx.",
      "Ignorar o `SIGTERM`: o orquestrador mata a instância no fim do prazo e corta as requisições em andamento (veja L115).",
      "Fazer um canary sem critério: uma parcela pequena que ninguém observa, sem regra para promover ou abortar, não protege nada.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre blue-green e canary?",
        resposta:
          "O blue-green mantém dois ambientes completos e troca todo o tráfego de uma vez, com volta imediata e custo dobrado. O canary libera a versão nova a uma pequena parcela do tráfego e a amplia conforme as métricas, expondo menos usuários a um defeito.",
      },
      {
        pergunta: "Por que a migração de banco é a parte mais difícil de uma implantação sem downtime?",
        resposta:
          "Porque, durante a troca, a versão antiga e a nova usam o mesmo banco. A migração precisa ser compatível com as duas, em duas fases: expandir (adicionar sem remover) e, depois que a versão antiga sai, contrair (remover o que sobrou).",
      },
    ],
  },
  en: {
    titulo: "Zero-downtime deployment",
    pergunta: "How does zero-downtime deployment work and what are common strategies to achieve it?",
    porqueEsteMetodo:
      "Each strategy trades cost, speed of rollback and risk in a different way. The matrix shows those trades side by side, and the decision rule says which to pick in each situation.",
    resposta30s:
      "**Zero-downtime deployment** means switching versions without users noticing an interruption: the new one starts, becomes **ready** (a readiness check), receives traffic, and the old one **drains** its connections and exits. The common strategies are **rolling** (gradual replacement of instances), **blue-green** (two full environments and a traffic switch, with instant rollback and double the cost) and **canary** (a small share of the traffic first). For it to work, the application needs readiness checks, graceful shutdown and a database compatible with both versions.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Deployment strategies",
        colunas: ["Strategy", "How it works", "Downtime and cost", "Rollback", "When to use"],
        linhas: [
          [
            "Recreate",
            "Stops the old version and only then starts the new one",
            "There is downtime between stopping and the new one being ready; no extra cost",
            "Redeploy the previous version, with new downtime",
            "A test environment, an agreed maintenance window, or a change where the two versions cannot coexist",
          ],
          [
            "Rolling",
            "Replaces instances gradually: starts a new one, waits for it to be ready, removes an old one and repeats; during the switch, both versions serve at the same time",
            "No downtime if there is capacity and a readiness check; small extra cost (a few more instances during the switch)",
            "Revert the deployment, which is another gradual switch (it takes time)",
            "The starting point for most stateless services, when both versions coexist without trouble",
          ],
          [
            "Blue-green",
            "Two full environments: green receives the new version while blue serves; after testing, traffic is switched all at once",
            "No downtime; the cost of keeping double the capacity during the switch",
            "Immediate: send traffic back to blue, while it still exists",
            "Changes you want to validate whole before exposing, or when you need a fast way back; requires a database compatible with both versions",
          ],
          [
            "Canary",
            "Releases the new version to a small share of the traffic, watches errors and latency, and widens it little by little",
            "No downtime; small cost, but needs weighted routing and good metrics",
            "Fast: take the share out of the traffic",
            "Risky changes in services with plenty of traffic, when there are metrics to decide with",
          ],
        ],
        nota: "Rolling, blue-green and canary are only zero-downtime if the application knows how to start and stop properly (see the steps below).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Choose by the risk of the change and what you can pay. **Rolling** is the starting point for stateless services. **Blue-green** when you want to validate the whole new environment before exposing it and need an instant way back, accepting the cost of double capacity. **Canary** when the change is risky and there are metrics to tell whether the small share is healthy. **Recreate** only where downtime is acceptable. With any of them, **separate deploying from releasing** with feature flags (see P66): the code goes out switched off and is turned on later.",
      },
      {
        tipo: "passos",
        titulo: "What the application must do, whatever the strategy",
        passos: [
          {
            titulo: "Say when it is ready",
            texto:
              "Expose a liveness check (the process is up) and a **readiness** check (connections open, caches warm, ready for traffic). The load balancer or Kubernetes only sends traffic once readiness answers well.",
          },
          {
            titulo: "Shut down gracefully",
            texto:
              "On `SIGTERM`, the instance fails readiness to leave the balancing, stops accepting new connections, finishes in-flight requests, closes pools and queues and exits before the orchestrator’s deadline (see L115).",
          },
          {
            titulo: "Drain connections",
            texto:
              "Keep-alive connections, WebSockets and long queries delay the shutdown. Give them a deadline, tell clients to reconnect and close the idle ones; otherwise the instance hangs until it is killed by force.",
          },
          {
            titulo: "Keep no state on the instance",
            texto:
              "Sessions in Redis or in a token, files in external storage, scheduled work in a queue. Memory and local disk vanish when the instance leaves.",
          },
          {
            titulo: "Keep the database compatible with both versions",
            texto:
              "During the switch, the old and the new version use the same database. Make migrations in two phases, **expand and contract** (see P87): add optional columns and tables first, migrate the data and only then remove the old. The same goes for the format of messages in queues.",
          },
          {
            titulo: "Have a way back",
            texto:
              "Keep the previous version ready (an immutable, tagged image) and the rollback procedure rehearsed. Reverting code is easy; a data migration already applied is what does not revert by itself.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "How to implement it in Node.js applications",
        colunas: ["Mechanism", "How it delivers zero downtime", "Watch out for"],
        linhas: [
          [
            "Load balancer or reverse proxy (Nginx, HAProxy, Envoy and similar)",
            "They point to a group of instances; in blue-green, switch the active group; in rolling and canary, change the instances or the weights, reloading the configuration without dropping connections",
            "Needs active health checks and a graceful reload (see D64)",
          ],
          [
            "PM2 in cluster mode",
            "`pm2 reload` restarts workers one at a time, with the others serving; `restart` takes them all down at once",
            "Covers a single host; the app must handle the shutdown signal PM2 sends (check the documentation); it does not cover blue-green",
          ],
          [
            "Kubernetes: Deployment",
            "The `RollingUpdate` strategy (with `maxSurge` and `maxUnavailable`) replaces pods gradually, guided by the `readinessProbe`; `preStop` and `terminationGracePeriodSeconds` give time to drain",
            "Without a `readinessProbe`, the pod gets traffic too early; the app must handle `SIGTERM`",
          ],
          [
            "Kubernetes: blue-green and canary",
            "Blue-green: two Deployments, and the Service selector (or the Ingress routing) points to one or the other. Canary: traffic split by weights in the ingress controller, in a service mesh or in progressive delivery tools, such as Argo Rollouts and Flagger",
            "Each tool has its own features and limits: check the documentation",
          ],
          [
            "Managed platforms",
            "Many offer deployment slots or native gradual or blue-green deployment",
            "Check how they handle readiness, the database and rollback",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Zero downtime does not mean zero risk",
        texto:
          "Blue-green sends traffic back to the old environment in seconds, but it **does not undo a data migration** already applied, nor the writes the new version made in a new format. Two versions coexist in rolling, in canary and even in the blue-green window: if the new one writes something the old one does not understand, or drops a column the old one uses, the switch breaks even with perfect infrastructure. The same goes for messages in queues and API contracts.",
      },
    ],
    armadilhas: [
      "Thinking blue-green solves the database: an incompatible migration takes down both blue and green, and sending traffic back does not help.",
      "Having no readiness check: the new instance gets traffic before opening its pool and warming up, and the switch becomes a burst of 5xx errors.",
      "Ignoring `SIGTERM`: the orchestrator kills the instance at the end of the deadline and cuts in-flight requests (see L115).",
      "Running a canary without criteria: a small share nobody watches, with no rule to promote or abort, protects nothing.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between blue-green and canary?",
        resposta:
          "Blue-green keeps two full environments and switches all the traffic at once, with instant rollback and double the cost. Canary releases the new version to a small share of the traffic and widens it according to the metrics, exposing fewer users to a defect.",
      },
      {
        pergunta: "Why is the database migration the hardest part of a zero-downtime deployment?",
        resposta:
          "Because, during the switch, the old and the new version use the same database. The migration must be compatible with both, in two phases: expand (add without removing) and, once the old version is gone, contract (remove what is left).",
      },
    ],
  },
};
