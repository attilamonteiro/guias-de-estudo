import type { Pergunta } from "../../tipos";

// P38 · Teorema CAP
export const p038: Pergunta = {
  numero: 738,
  modulo: "pawanmkr-bancos",
  metodo: "firstprinciples",
  pt: {
    titulo: "Teorema CAP",
    pergunta: "Explique o teorema CAP e como ele influencia decisões de arquitetura de backend.",
    porqueEsteMetodo:
      "O CAP costuma ser decorado como “escolha 2 de 3”, o que esconde o essencial. Partir de um único servidor e acrescentar uma restrição por vez mostra de onde vem cada letra e por que a escolha só aparece quando a rede falha.",
    resposta30s:
      "O **teorema CAP** diz que, num sistema de dados distribuído, quando a **rede entre os nós sofre uma partição**, você precisa escolher entre **consistência** (toda leitura vê a última escrita confirmada) e **disponibilidade** (todo nó de pé responde). Partições acontecem, então a escolha real é **CP ou AP durante a falha**, e não “2 de 3” o tempo todo; sem partição dá para ter as duas, ao custo de latência (extensão **PACELC**). Na prática, decida por operação o que é pior: recusar ou servir um dado possivelmente velho.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma restrição por vez",
        passos: [
          {
            titulo: "0. As três palavras",
            texto:
              "**Consistência** (no CAP): toda leitura devolve a escrita confirmada mais recente, como se existisse uma cópia só (linearizabilidade). **Disponibilidade**: toda requisição a um nó que está de pé recebe uma resposta, não um erro. **Tolerância a partições**: o sistema segue funcionando mesmo que a rede entre os nós perca mensagens ou se divida em grupos que não se falam.",
          },
          {
            titulo: "1. A versão mais simples: um servidor",
            texto:
              "Uma máquina guarda tudo. É consistente (uma cópia, uma ordem das escritas) e disponível enquanto estiver de pé; como não há rede entre cópias, não existe partição para tolerar. → Quebra: se a máquina cai, o sistema inteiro cai, e a capacidade tem teto.",
          },
          {
            titulo: "2. Réplicas, para sobreviver e dividir a carga",
            texto:
              "Copiar os dados em várias máquinas tolera a queda de uma e distribui as leituras. → Quebra: agora há várias cópias que precisam concordar, e copiar leva tempo. Com replicação assíncrona, uma leitura numa réplica pode devolver um dado antigo; com replicação síncrona, a escrita espera as outras e fica mais lenta (e dependente delas).",
          },
          {
            titulo: "3. A rede entre as réplicas falha",
            texto:
              "Um cabo, um roteador ou um congestionamento deixa dois grupos de máquinas vivas, mas incomunicáveis. O cliente 1 escreve no grupo A; o cliente 2 lê no grupo B. Surge a pergunta que o teorema formaliza: o que B responde? Não existe resposta ao mesmo tempo imediata e garantidamente atual, porque B não tem como saber o que aconteceu em A.",
          },
          {
            titulo: "4. Escolha 1: consistência (CP)",
            texto:
              "B recusa a escrita ou espera até falar com os demais. Muitos sistemas deixam seguir apenas o grupo que tem a **maioria** das réplicas (quórum), e o minoritário devolve erro ou estoura o tempo. → Ganho: nunca existem duas verdades. → Custo: parte dos clientes fica sem serviço, ou seja, perde-se disponibilidade.",
          },
          {
            titulo: "5. Escolha 2: disponibilidade (AP)",
            texto:
              "Cada grupo continua aceitando escritas e respondendo com o que tem. → Ganho: ninguém é recusado. → Custo: leituras podem vir desatualizadas e dois clientes podem gravar valores conflitantes; quando a rede volta, é preciso **reconciliar** (o último a escrever vence, versões por nó, tipos de dados feitos para mesclar ou uma regra do negócio).",
          },
          {
            titulo: "6. Sem partição: o que sobra",
            texto:
              "Sem falha de rede dá para ter consistência e disponibilidade; por isso o CAP é uma escolha **durante a partição**, não “2 de 3” sempre. Mesmo sem falha, porém, replicar de forma síncrona custa latência. É a extensão **PACELC**: se há Partição, escolha entre A e C; senão (Else), escolha entre Latência e Consistência. Muitos bancos expõem esse botão por operação.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "CP x AP durante a partição",
        colunas: ["Aspecto", "CP (prioriza consistência)", "AP (prioriza disponibilidade)"],
        linhas: [
          ["Escrita no lado sem quórum", "Recusada ou em espera até o tempo esgotar", "Aceita e gravada localmente"],
          [
            "Leitura",
            "Nunca devolve dado possivelmente velho, mas pode devolver erro",
            "Responde sempre, mas pode devolver dado antigo",
          ],
          [
            "Quando a rede volta",
            "Nada a reconciliar: existe uma só história",
            "Versões divergentes precisam ser reconciliadas",
          ],
          [
            "Combina com",
            "Saldo, estoque limitado, unicidade (e-mail, número de pedido), eleição de líder",
            "Carrinho, feed, contadores aproximados, presença, catálogo e caches",
          ],
          [
            "No código Node.js",
            "Trate erro e tempo esgotado, repita com idempotência (veja P81) e mostre a indisponibilidade com clareza",
            "Tolere dado velho e duplicado, use ids idempotentes e mostre estados como “pendente” ao usuário",
          ],
        ],
        nota: "Produtos reais raramente são só CP ou só AP: o comportamento depende da configuração (por exemplo, `writeConcern` e `readConcern` no MongoDB, o nível de consistência no Cassandra, a leitura fortemente consistente opcional no DynamoDB, a replicação síncrona ou assíncrona no PostgreSQL). Confira a documentação do seu.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Pergunte o que é pior quando a rede falha: **recusar** ou **servir um dado possivelmente velho**? Se o erro custa dinheiro ou duplica algo que deveria ser único (saldo, estoque, número de pedido), escolha consistência. Se um dado de segundos atrás é aceitável e ficar fora do ar é pior (carrinho, feed, contador), escolha disponibilidade. Decida **por operação**, não por sistema: o pagamento pode ser CP e a listagem de produtos, AP. Em microsserviços o mesmo dilema leva a consistência eventual e a sagas (veja P37).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Dois equívocos comuns",
        texto:
          "O **C do CAP não é o C do ACID**: no CAP é linearizabilidade (todos veem a mesma escrita mais recente); no ACID é a transação deixar os dados dentro das regras de integridade. E o CAP **não trata de velocidade**: “banco rápido” não é sinônimo de “AP”. A tensão entre latência e consistência sem partição é a parte E/L do PACELC. Por fim, “disponibilidade” aqui é rigorosa (toda requisição a um nó vivo recebe resposta), mais forte que o uptime de um contrato de serviço.",
      },
    ],
    armadilhas: [
      "Repetir “escolha 2 de 3” como se fosse uma escolha permanente: partições são eventos de falha, e sem elas você tem consistência e disponibilidade.",
      "Achar que dá para escolher “CA” num sistema distribuído: redes falham, então tolerar partição não é opcional. CA só descreve um nó único.",
      "Rotular um produto como CP ou AP para sempre: o comportamento muda com a configuração e com a operação (quórum de leitura, replicação síncrona).",
      "Ler de uma réplica logo depois de escrever no primário e esperar ver a própria escrita: a replicação assíncrona não garante isso; leia do primário quando precisar dela.",
    ],
    autoteste: [
      {
        pergunta: "Por que a tolerância a partições não é opcional?",
        resposta:
          "Porque a rede entre máquinas falha (cabos, roteadores, congestionamento, pausas longas), e um sistema que não tolera partição deixa de funcionar quando ela ocorre. Sobra escolher, durante a falha, entre recusar (consistência) e responder (disponibilidade).",
      },
      {
        pergunta: "Se a rede está saudável, o CAP obriga a abrir mão de algo?",
        resposta:
          "Não: dá para ter consistência e disponibilidade. Mas replicar de forma síncrona custa latência, e é isso que o PACELC descreve: sem partição, você troca latência por consistência.",
      },
    ],
  },
  en: {
    titulo: "The CAP theorem",
    pergunta: "Explain the CAP theorem and how it impacts backend architecture decisions.",
    porqueEsteMetodo:
      "CAP is usually memorized as “pick 2 of 3”, which hides the essential part. Starting from a single server and adding one constraint at a time shows where each letter comes from and why the choice only shows up when the network fails.",
    resposta30s:
      "The **CAP theorem** says that, in a distributed data system, when the **network between nodes is partitioned**, you must choose between **consistency** (every read sees the latest confirmed write) and **availability** (every live node answers). Partitions do happen, so the real choice is **CP or AP during the failure**, not “2 of 3” all the time; with no partition you can have both, at the price of latency (the **PACELC** extension). In practice, decide per operation which is worse: refusing, or serving possibly stale data.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one constraint at a time",
        passos: [
          {
            titulo: "0. The three words",
            texto:
              "**Consistency** (in CAP): every read returns the most recent confirmed write, as if there were a single copy (linearizability). **Availability**: every request to a node that is up gets a response, not an error. **Partition tolerance**: the system keeps working even if the network between nodes drops messages or splits into groups that cannot talk to each other.",
          },
          {
            titulo: "1. The simplest version: one server",
            texto:
              "One machine holds everything. It is consistent (one copy, one order of writes) and available as long as it is up; with no network between copies, there is no partition to tolerate. → Breaks: if the machine goes down, the whole system goes down, and capacity has a ceiling.",
          },
          {
            titulo: "2. Replicas, to survive and share the load",
            texto:
              "Copying the data onto several machines tolerates the loss of one and spreads the reads. → Breaks: now there are several copies that must agree, and copying takes time. With asynchronous replication, a read on a replica may return old data; with synchronous replication, the write waits for the others and becomes slower (and dependent on them).",
          },
          {
            titulo: "3. The network between replicas fails",
            texto:
              "A cable, a router or congestion leaves two groups of machines alive but unable to talk. Client 1 writes to group A; client 2 reads from group B. The question the theorem formalizes appears: what does B answer? There is no answer that is both immediate and guaranteed up to date, because B cannot know what happened in A.",
          },
          {
            titulo: "4. Choice 1: consistency (CP)",
            texto:
              "B refuses the write or waits until it can reach the others. Many systems let only the group holding the **majority** of replicas (a quorum) carry on, and the minority returns an error or times out. → Gain: there are never two truths. → Cost: some clients are left without service, that is, availability is lost.",
          },
          {
            titulo: "5. Choice 2: availability (AP)",
            texto:
              "Each group keeps accepting writes and answering with what it has. → Gain: nobody is turned away. → Cost: reads may be stale and two clients may write conflicting values; when the network heals, you must **reconcile** (last write wins, per-node versions, data types designed to merge, or a business rule).",
          },
          {
            titulo: "6. With no partition: what remains",
            texto:
              "With no network failure you can have consistency and availability; that is why CAP is a choice **during the partition**, not “2 of 3” always. Even with no failure, though, replicating synchronously costs latency. That is the **PACELC** extension: if there is a Partition, choose between A and C; Else, choose between Latency and Consistency. Many databases expose this dial per operation.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "CP vs AP during the partition",
        colunas: ["Aspect", "CP (favors consistency)", "AP (favors availability)"],
        linhas: [
          ["Write on the side without a quorum", "Refused, or waits until the timeout", "Accepted and stored locally"],
          [
            "Read",
            "Never returns possibly stale data, but may return an error",
            "Always answers, but may return old data",
          ],
          [
            "When the network heals",
            "Nothing to reconcile: there is a single history",
            "Diverging versions must be reconciled",
          ],
          [
            "Fits",
            "Balances, limited stock, uniqueness (email, order number), leader election",
            "Carts, feeds, approximate counters, presence, catalogs and caches",
          ],
          [
            "In Node.js code",
            "Handle errors and timeouts, retry with idempotency (see P81) and show the unavailability clearly",
            "Tolerate stale and duplicate data, use idempotent ids and show states like “pending” to the user",
          ],
        ],
        nota: "Real products are rarely just CP or just AP: behavior depends on configuration (for example, `writeConcern` and `readConcern` in MongoDB, the consistency level in Cassandra, the optional strongly consistent read in DynamoDB, synchronous or asynchronous replication in PostgreSQL). Check the documentation for yours.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Ask what is worse when the network fails: **refusing**, or **serving possibly stale data**? If the error costs money or duplicates something that should be unique (balance, stock, order number), choose consistency. If data from a few seconds ago is acceptable and being down is worse (cart, feed, counter), choose availability. Decide **per operation**, not per system: payment can be CP and the product listing AP. In microservices the same dilemma leads to eventual consistency and sagas (see P37).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Two common mistakes",
        texto:
          "The **C in CAP is not the C in ACID**: in CAP it is linearizability (everyone sees the same latest write); in ACID it is a transaction leaving the data within its integrity rules. And CAP is **not about speed**: a “fast database” does not mean “AP”. The tension between latency and consistency without a partition is the E/L part of PACELC. Finally, “availability” here is strict (every request to a live node gets a response), stronger than the uptime in a service agreement.",
      },
    ],
    armadilhas: [
      "Repeating “pick 2 of 3” as if it were a permanent choice: partitions are failure events, and without them you have both consistency and availability.",
      "Thinking you can pick “CA” in a distributed system: networks fail, so partition tolerance is not optional. CA only describes a single node.",
      "Labeling a product CP or AP forever: behavior changes with configuration and with the operation (read quorum, synchronous replication).",
      "Reading from a replica right after writing to the primary and expecting to see your own write: asynchronous replication does not guarantee that; read from the primary when you need it.",
    ],
    autoteste: [
      {
        pergunta: "Why is partition tolerance not optional?",
        resposta:
          "Because the network between machines fails (cables, routers, congestion, long pauses), and a system that does not tolerate partitions stops working when one happens. What is left is choosing, during the failure, between refusing (consistency) and answering (availability).",
      },
      {
        pergunta: "If the network is healthy, does CAP force you to give something up?",
        resposta:
          "No: you can have consistency and availability. But replicating synchronously costs latency, and that is what PACELC describes: with no partition, you trade latency for consistency.",
      },
    ],
  },
};
