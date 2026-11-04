import type { Pergunta } from "../../tipos";

// M38 · Tabela hash distribuída
export const m38: Pergunta = {
  numero: 238,
  modulo: "mentorcruise",
  metodo: "firstprinciples",
  pt: {
    titulo: "Tabela hash distribuída",
    pergunta: "Você pode explicar como funciona uma Tabela Hash Distribuída (DHT)?",
    porqueEsteMetodo:
      "Uma DHT não surge pronta: nasce de uma tabela hash comum que quebra a cada nova restrição (muitos dados, nós que entram e saem, ausência de coordenador). Construir do zero mostra por que o anel, os nós virtuais e o roteamento existem.",
    resposta30s:
      "Uma DHT **espalha pares chave–valor por muitos nós sem coordenador central**. O começo ingênuo, `hash(chave) mod N`, remapeia quase tudo quando N muda; o conserto é o **hashing consistente**: nós e chaves ficam num **anel**, e cada chave pertence ao primeiro nó no sentido horário, então entrar ou sair move só uma fração das chaves. **Nós virtuais** equilibram a carga, **réplicas nos sucessores** dão tolerância a falhas, e o **roteamento** (Chord, com O(log n) saltos; Kademlia, com distância XOR) acha o dono sem que ninguém conheça todos os nós.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma restrição por vez",
        passos: [
          {
            titulo: "0. O problema",
            texto:
              "Há mais pares chave–valor e mais tráfego do que cabe numa máquina, e não se quer um servidor central de diretório, que seria gargalo e ponto único de falha. Além disso, máquinas entram e saem o tempo todo. Precisa-se de uma regra que diga, a qualquer nó ou cliente, quem guarda cada chave.",
          },
          {
            titulo: "1. A versão mais simples",
            texto:
              "Uma tabela hash em memória numa máquina: `hash(chave)` escolhe o balde, e a busca custa O(1) em média. → Quebra: memória, vazão e disponibilidade são as de uma máquina só.",
          },
          {
            titulo: "2. Espalhar por N nós",
            texto:
              "Escolha o nó por `hash(chave) mod N`. Qualquer cliente calcula o dono sozinho, sem diretório. → Quebra: quando N muda, o resultado do `mod` muda para quase todas as chaves (de 4 para 5 nós, cerca de 4 em cada 5 chaves trocam de dono). Adicionar uma máquina vira migração em massa, ou uma enxurrada de falhas num cache.",
          },
          {
            titulo: "3. Hashing consistente: o anel",
            texto:
              "Trate o espaço de hash como um **anel** (depois do maior valor volta ao zero). Coloque cada nó numa posição, `hash(id do nó)`; cada chave pertence ao **primeiro nó que encontra andando no sentido horário** (o sucessor). Entrar ou sair mexe só na faixa entre o nó e seu vizinho: em média, algo como 1/N das chaves muda de dono. → Quebra: com poucos nós, posições aleatórias deixam faixas desiguais; e quando um nó cai, todo o seu trabalho recai sobre um único vizinho.",
          },
          {
            titulo: "4. Nós virtuais",
            texto:
              "Cada máquina ocupa **muitos pontos** do anel (dezenas ou centenas, por exemplo), calculados com `hash(id da máquina, i)`. As faixas ficam pequenas e parecidas, a carga se distribui melhor e, quando uma máquina cai, suas faixas se espalham por vários vizinhos. Máquinas mais fortes podem receber mais pontos.",
          },
          {
            titulo: "5. Replicação",
            texto:
              "Guarde cada chave no dono e nos **k−1 sucessores seguintes**, pulando os pontos da mesma máquina para cair em máquinas distintas. A falha de um nó não perde dados. Lendo de R réplicas e confirmando a escrita em W, `R + W > k` faz leitura e escrita se encontrarem em ao menos uma réplica; reduzir R e W troca consistência por latência e disponibilidade (veja Q25).",
          },
          {
            titulo: "6. Achar o dono sem coordenador",
            texto:
              "Se todo nó conhecesse todos os outros, a busca seria direta (um salto): alguns sistemas, como o Dynamo, fazem isso espalhando a lista de membros por gossip, a troca periódica de informações entre nós. Em redes enormes ou abertas isso não escala, então cada nó conhece poucos vizinhos e **a busca salta de nó em nó**. No **Chord**, cada nó guarda seu sucessor e cerca de log n atalhos (a finger table) para nós a distâncias 1, 2, 4, 8… no anel; a cada salto a distância restante cai pelo menos pela metade, e a busca termina em **O(log n)** saltos. No **Kademlia**, a distância entre dois IDs é o **XOR** deles; cada nó guarda contatos por faixa de distância e a busca se aproxima do ID procurado, também em O(log n) saltos.",
          },
          {
            titulo: "7. Entrada, saída e falhas",
            texto:
              "Um nó novo contata qualquer nó conhecido, descobre sua posição, recebe as chaves da faixa que passa a ser dele e avisa os vizinhos. Rotinas periódicas de estabilização corrigem ponteiros desatualizados. Falhas são detectadas por heartbeats ou gossip e as réplicas assumem; alguns sistemas guardam temporariamente as escritas de um nó fora do ar em outro (hinted handoff) e reparam réplicas divergentes em segundo plano.",
          },
          {
            titulo: "8. Os custos que sobram",
            texto:
              "Com réplicas e partições de rede, escolhe-se entre consistência e disponibilidade (veja R36). O hash espalha as chaves, não a popularidade: uma **chave quente** sobrecarrega os nós que a guardam. E, como chaves vizinhas caem em nós diferentes, consultas por intervalo ficam caras.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O anel em poucas linhas",
        legenda: "pseudocódigo",
        codigo: `# anel = lista ordenada de pontos (posição, nó); cada máquina entra com vários pontos
adicionar_no(no, pontos = 100):                  # 100 é só um valor ilustrativo
  para i em 0 .. pontos - 1:
    anel.inserir(hash(no, i), no)

dono_de(chave):
  h = hash(chave)
  ponto = primeiro ponto do anel com posição >= h   # busca binária
  se não existe: ponto = primeiro ponto do anel     # dá a volta no anel
  return ponto.no

replicas_de(chave, k):
  andar no sentido horário a partir do dono, pulando pontos de máquinas já escolhidas,
  até juntar k máquinas distintas`,
        nota: "Remover uma máquina é apagar os pontos dela: suas chaves passam, naturalmente, para os próximos pontos do anel.",
      },
      {
        tipo: "tabela",
        titulo: "Onde a ideia aparece",
        colunas: ["Sistema", "Como usa a ideia", "Detalhe"],
        linhas: [
          [
            "Dynamo (artigo da Amazon) e Cassandra",
            "Anel com hashing consistente, nós virtuais e réplicas nos nós seguintes do anel",
            "Cada nó conhece a topologia por gossip, então a busca costuma ser direta",
          ],
          [
            "Clientes de cache (por exemplo, Memcached)",
            "O cliente aplica hashing consistente sobre a lista de servidores",
            "Adicionar um servidor invalida só uma fração do cache, não quase tudo",
          ],
          [
            "Redis Cluster",
            "Espaço fixo de slots de hash atribuídos aos nós, em vez de um anel",
            "Rebalancear é mover slots entre nós; a ideia de chave → partição → nó é a mesma",
          ],
          [
            "BitTorrent e IPFS",
            "DHT estilo Kademlia numa rede aberta, sem coordenador",
            "Guarda quem tem o conteúdo, não o conteúdo em si; a busca leva O(log n) saltos",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Hashing consistente x DHT",
        texto:
          "O **hashing consistente** responde a “quem é o dono desta chave?”. A **DHT** acrescenta “como qualquer nó acha esse dono sem um coordenador e sem conhecer todos os outros?”. A primeira ideia é o anel; a segunda é o roteamento (Chord, Kademlia).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O hash equilibra chaves, não carga",
        texto:
          "Mesmo com nós virtuais, uma chave muito acessada continua nos mesmos nós. As saídas são um cache na frente, mais réplicas de leitura para a chave quente ou dividi-la em várias subchaves. E réplicas sem coordenação central trazem consistência eventual: duas escritas concorrentes podem divergir e exigem uma regra de reconciliação.",
      },
    ],
    armadilhas: [
      "Usar `hash(chave) mod N` e achar que escala: adicionar um nó invalida quase tudo.",
      "Achar que o hashing consistente equilibra a carga: sem nós virtuais as faixas ficam desiguais, e nenhum esquema resolve sozinho a chave quente.",
      "Esperar consulta por intervalo ou ordenação: o hash espalha chaves vizinhas por nós diferentes (para varreduras por faixa, particione por intervalo).",
      "Tratar a DHT como banco fortemente consistente: com réplicas e partições de rede, ela costuma entregar consistência eventual.",
    ],
    autoteste: [
      {
        pergunta: "Por que `hash(chave) mod N` é ruim quando o número de nós muda?",
        resposta:
          "Porque o resultado do `mod` muda para quase todas as chaves: de 4 para 5 nós, cerca de 4 em cada 5 trocam de dono, o que causa migração em massa ou uma enxurrada de falhas de cache.",
      },
      {
        pergunta: "O que os nós virtuais resolvem no anel?",
        resposta:
          "Eles dão a cada máquina muitos pontos, o que equilibra o tamanho das faixas e faz a carga de uma máquina que cai se espalhar por vários vizinhos, não por um só.",
      },
      {
        pergunta: "Por que a busca no Chord leva O(log n) saltos?",
        resposta:
          "Porque cada nó tem atalhos para distâncias 1, 2, 4, 8… no anel, e cada salto reduz a distância restante pelo menos pela metade.",
      },
    ],
  },
  en: {
    titulo: "Distributed hash table",
    pergunta: "Can you explain how a Distributed Hash Table (DHT) works?",
    porqueEsteMetodo:
      "A DHT does not appear fully formed: it starts as an ordinary hash table that breaks under each new constraint (lots of data, nodes joining and leaving, no coordinator). Building it from scratch shows why the ring, virtual nodes and routing exist.",
    resposta30s:
      "A DHT **spreads key–value pairs across many nodes with no central coordinator**. The naive start, `hash(key) mod N`, remaps almost everything when N changes; the fix is **consistent hashing**: nodes and keys sit on a **ring**, and each key belongs to the first node clockwise, so a join or leave moves only a fraction of the keys. **Virtual nodes** balance the load, **replicas on the successors** give fault tolerance, and **routing** (Chord, with O(log n) hops; Kademlia, with XOR distance) finds the owner without anyone knowing every node.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building up, one constraint at a time",
        passos: [
          {
            titulo: "0. The problem",
            texto:
              "There are more key–value pairs and more traffic than one machine can hold, and you do not want a central directory server, which would be a bottleneck and a single point of failure. Machines also join and leave all the time. You need a rule that tells any node or client who holds each key.",
          },
          {
            titulo: "1. The simplest version",
            texto:
              "An in-memory hash table on one machine: `hash(key)` picks the bucket, and lookup costs O(1) on average. → Breaks: memory, throughput and availability are those of a single machine.",
          },
          {
            titulo: "2. Spread across N nodes",
            texto:
              "Pick the node with `hash(key) mod N`. Any client computes the owner on its own, with no directory. → Breaks: when N changes, the result of the `mod` changes for almost every key (going from 4 to 5 nodes, about 4 in every 5 keys change owner). Adding a machine becomes a mass migration, or a flood of cache misses.",
          },
          {
            titulo: "3. Consistent hashing: the ring",
            texto:
              "Treat the hash space as a **ring** (after the largest value it wraps to zero). Place each node at a position, `hash(node id)`; each key belongs to the **first node it meets walking clockwise** (the successor). A join or leave touches only the range between the node and its neighbor: on average, something like 1/N of the keys change owner. → Breaks: with few nodes, random positions leave uneven ranges; and when a node dies, all its work falls on a single neighbor.",
          },
          {
            titulo: "4. Virtual nodes",
            texto:
              "Each machine takes **many points** on the ring (tens or hundreds, say), computed as `hash(machine id, i)`. Ranges become small and similar, load spreads better and, when a machine dies, its ranges scatter across many neighbors. Stronger machines can get more points.",
          },
          {
            titulo: "5. Replication",
            texto:
              "Store each key on the owner and on the **next k−1 successors**, skipping points of the same machine so the copies land on distinct machines. A node failure loses no data. Reading from R replicas and confirming a write on W, `R + W > k` makes reads and writes meet on at least one replica; lowering R and W trades consistency for latency and availability (see Q25).",
          },
          {
            titulo: "6. Finding the owner without a coordinator",
            texto:
              "If every node knew every other node, lookup would be direct (one hop): some systems, like Dynamo, do this by spreading the membership list through gossip, the periodic exchange of information between nodes. In huge or open networks that does not scale, so each node knows only a few neighbors and **the lookup hops from node to node**. In **Chord**, each node keeps its successor and about log n shortcuts (the finger table) to nodes at distances 1, 2, 4, 8… around the ring; each hop at least halves the remaining distance, and the lookup ends in **O(log n)** hops. In **Kademlia**, the distance between two IDs is their **XOR**; each node keeps contacts per distance range and the lookup closes in on the target ID, also in O(log n) hops.",
          },
          {
            titulo: "7. Joins, leaves and failures",
            texto:
              "A new node contacts any known node, finds its position, receives the keys of the range that becomes its own and tells its neighbors. Periodic stabilization routines fix stale pointers. Failures are detected by heartbeats or gossip and replicas take over; some systems temporarily keep the writes meant for a downed node on another one (hinted handoff) and repair diverged replicas in the background.",
          },
          {
            titulo: "8. The costs that remain",
            texto:
              "With replicas and network partitions, you choose between consistency and availability (see R36). The hash spreads keys, not popularity: a **hot key** overloads the nodes that hold it. And since neighboring keys land on different nodes, range queries become expensive.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The ring in a few lines",
        legenda: "pseudocode",
        codigo: `# ring = sorted list of points (position, node); each machine joins with many points
add_node(node, points = 100):                    # 100 is just an illustrative value
  for i in 0 .. points - 1:
    ring.insert(hash(node, i), node)

owner_of(key):
  h = hash(key)
  point = first ring point with position >= h       # binary search
  if none exists: point = first point on the ring   # wrap around the ring
  return point.node

replicas_of(key, k):
  walk clockwise from the owner, skipping points of machines already chosen,
  until k distinct machines are collected`,
        nota: "Removing a machine means deleting its points: its keys naturally fall to the next points on the ring.",
      },
      {
        tipo: "tabela",
        titulo: "Where the idea shows up",
        colunas: ["System", "How it uses the idea", "Detail"],
        linhas: [
          [
            "Dynamo (Amazon paper) and Cassandra",
            "Ring with consistent hashing, virtual nodes and replicas on the following ring nodes",
            "Each node knows the topology through gossip, so lookup is usually direct",
          ],
          [
            "Cache clients (for example, Memcached)",
            "The client applies consistent hashing over the list of servers",
            "Adding a server invalidates only a fraction of the cache, not almost all of it",
          ],
          [
            "Redis Cluster",
            "A fixed space of hash slots assigned to nodes, instead of a ring",
            "Rebalancing means moving slots between nodes; the key → partition → node idea is the same",
          ],
          [
            "BitTorrent and IPFS",
            "Kademlia-style DHT on an open network, with no coordinator",
            "It stores who has the content, not the content itself; lookup takes O(log n) hops",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Consistent hashing vs DHT",
        texto:
          "**Consistent hashing** answers “who owns this key?”. A **DHT** adds “how does any node find that owner without a coordinator and without knowing every other node?”. The first idea is the ring; the second is routing (Chord, Kademlia).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The hash balances keys, not load",
        texto:
          "Even with virtual nodes, a heavily accessed key stays on the same nodes. The ways out are a cache in front, more read replicas for the hot key, or splitting it into several subkeys. And replicas without a central coordinator bring eventual consistency: two concurrent writes can diverge and need a reconciliation rule.",
      },
    ],
    armadilhas: [
      "Using `hash(key) mod N` and thinking it scales: adding a node invalidates almost everything.",
      "Thinking consistent hashing balances load: without virtual nodes the ranges are uneven, and no scheme alone fixes a hot key.",
      "Expecting range queries or ordering: the hash scatters neighboring keys across different nodes (for range scans, partition by range).",
      "Treating the DHT as a strongly consistent database: with replicas and network partitions, it usually delivers eventual consistency.",
    ],
    autoteste: [
      {
        pergunta: "Why is `hash(key) mod N` bad when the number of nodes changes?",
        resposta:
          "Because the `mod` result changes for almost every key: going from 4 to 5 nodes, about 4 in 5 change owner, causing a mass migration or a flood of cache misses.",
      },
      {
        pergunta: "What do virtual nodes solve on the ring?",
        resposta:
          "They give each machine many points, which balances range sizes and makes the load of a failed machine spread across many neighbors instead of just one.",
      },
      {
        pergunta: "Why does a Chord lookup take O(log n) hops?",
        resposta:
          "Because each node has shortcuts to distances 1, 2, 4, 8… around the ring, and each hop at least halves the remaining distance.",
      },
    ],
  },
};
