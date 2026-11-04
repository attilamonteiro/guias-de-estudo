import type { Pergunta } from "../../tipos";

// Q24 · Armazenamento distribuído de arquivos
export const q24: Pergunta = {
  numero: 24,
  modulo: "design-de-sistemas",
  metodo: "firstprinciples",
  pt: {
    titulo: "Armazenamento distribuído de arquivos",
    pergunta: "Como você projetaria um sistema distribuído de armazenamento de arquivos?",
    porqueEsteMetodo:
      "Sistemas como GFS, HDFS e S3 parecem complexos, mas cada peça é o conserto de um problema do servidor único. Construir do zero, uma restrição por vez, revela o desenho.",
    resposta30s:
      "Divida cada arquivo em **blocos** (chunks) espalhados por muitos nós, guarde onde está cada bloco num **serviço de metadados** replicado por consenso (separado do caminho dos dados), proteja os blocos com **3 réplicas** em racks/zonas diferentes ou **erasure coding**, valide com **checksums** e **re-replique** automaticamente quando um nó morrer. Exponha uma API de objetos (PUT/GET) com upload multipart, URLs pré-assinadas e CDN na leitura.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma restrição por vez",
        passos: [
          {
            titulo: "0. O problema",
            texto:
              "Guardar muitos arquivos, alguns enormes, com durabilidade altíssima, sobrevivendo a falhas de discos, servidores e até de datacenters.",
          },
          {
            titulo: "1. Um servidor",
            texto: "Um disco, um servidor: limite de capacidade e ponto único de falha. → Precisa-se de vários nós.",
          },
          {
            titulo: "2. Quebrar em blocos",
            texto:
              "Divida o arquivo em **chunks** de 64 a 128 MB e espalhe pelos nós. Arquivos maiores que um disco passam a caber, e a leitura vira paralela.",
          },
          {
            titulo: "3. Metadados",
            texto:
              "Quem sabe onde está cada chunk? Um **serviço de metadados** (arquivo → chunks → nós) replicado por consenso (Raft/Paxos). Separe o **plano de controle** (pequeno) do **plano de dados** (os bytes vão direto entre cliente e nós), para os metadados não virarem gargalo.",
          },
          {
            titulo: "4. Durabilidade",
            texto:
              "Cada chunk em 3 cópias, em racks ou zonas diferentes, ou **erasure coding** (ex.: 10 dados + 4 paridade). Heartbeats detectam nó morto e o sistema **re-replica** sozinho.",
          },
          {
            titulo: "5. Integridade e escrita",
            texto:
              "Checksum por bloco, conferido na leitura e em varreduras periódicas (scrubbing). Escrita em pipeline cliente → primário → réplicas, ou por quórum (W + R > N). Objetos imutáveis (nova versão em vez de editar) simplificam tudo.",
          },
          {
            titulo: "6. Escalar os metadados",
            texto:
              "Particione o espaço de nomes (hash ou prefixo do caminho), cada partição com sua própria réplica de consenso.",
          },
          {
            titulo: "7. Upload e acesso",
            texto:
              "Upload multipart com retomada; URLs pré-assinadas; controle de acesso; CDN na frente da leitura; camadas quente/fria por custo; deduplicação pelo hash do conteúdo.",
          },
          {
            titulo: "8. Operação",
            texto:
              "Balanceamento ao entrar disco novo, coleta de blocos órfãos, monitoramento de espaço, de reconstruções e de erros de checksum.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O que o sistema guarda",
        legenda: "layout",
        codigo:
          'arquivo "video.mp4" (1 GB)\n  chunk 1 (128 MB) -> nos A, C, F    (3 copias, racks diferentes)\n  chunk 2 (128 MB) -> nos B, D, G\n  ...\nmetadados: video.mp4 -> [chunk1: A,C,F] [chunk2: B,D,G] ...\ncliente: pergunta aos metadados, depois le/escreve os bytes DIRETO nos nos',
        nota: "Sistemas reais com essa ideia: GFS/HDFS, Ceph, Amazon S3, MinIO.",
      },
      {
        tipo: "tabela",
        titulo: "Réplicas 3× vs erasure coding",
        colunas: ["", "Réplicas (3×)", "Erasure coding (10+4)"],
        linhas: [
          ["Espaço usado", "3× o original (200% extra)", "1,4× o original (40% extra)"],
          ["Tolerância", "Perde 2 cópias", "Perde até 4 fragmentos"],
          ["Leitura", "Rápida: lê uma cópia", "Reúne fragmentos (mais CPU e latência)"],
          ["Reconstrução", "Copia o bloco", "Recalcula a partir de vários fragmentos (cara)"],
          ["Uso típico", "Dados quentes, arquivos pequenos", "Dados frios e grandes"],
        ],
        nota: "Exemplo: 1 PB lógico ocupa 3 PB com réplicas ×3 e 1,4 PB com erasure coding 10+4.",
      },
    ],
    armadilhas: [
      "Fazer os bytes passarem pelo serviço de metadados: ele vira o gargalo.",
      "Todas as réplicas no mesmo rack ou zona: uma falha de energia perde as três.",
      "Replicar sem checksum: corrupção silenciosa (bit rot) se espalha para as cópias.",
      "Demorar a re-replicar: uma segunda falha antes do reparo perde dados.",
      "Permitir editar arquivos no lugar em vez de versões imutáveis: complica consistência e cache.",
    ],
    autoteste: [
      {
        pergunta: "Por que separar metadados de dados?",
        resposta:
          "Os metadados são pequenos e consultados o tempo todo; os dados são enormes. Se os bytes passassem pelo serviço de metadados, ele viraria o gargalo.",
      },
      {
        pergunta: "Quando preferir erasure coding a réplicas?",
        resposta:
          "Para dados frios e grandes, em que economizar espaço compensa o maior custo de CPU e de reconstrução.",
      },
    ],
  },
  en: {
    titulo: "Distributed file storage",
    pergunta: "How would you design a distributed file storage system?",
    porqueEsteMetodo:
      "Systems like GFS, HDFS and S3 look complex, but each piece fixes a single-server problem. Building from scratch, one constraint at a time, reveals the design.",
    resposta30s:
      "Split each file into **blocks** (chunks) spread across many nodes, keep where each block lives in a **metadata service** replicated by consensus (separate from the data path), protect blocks with **3 replicas** in different racks/zones or with **erasure coding**, verify with **checksums** and **re-replicate** automatically when a node dies. Expose an object API (PUT/GET) with multipart upload, pre-signed URLs and a CDN on reads.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building up, one constraint at a time",
        passos: [
          {
            titulo: "0. The problem",
            texto:
              "Store many files, some enormous, with very high durability, surviving disk, server and even datacenter failures.",
          },
          {
            titulo: "1. One server",
            texto: "One disk, one server: capacity limit and a single point of failure. → You need several nodes.",
          },
          {
            titulo: "2. Break into blocks",
            texto:
              "Split the file into **chunks** of 64 to 128 MB and spread them across nodes. Files bigger than one disk now fit, and reads become parallel.",
          },
          {
            titulo: "3. Metadata",
            texto:
              "Who knows where each chunk is? A **metadata service** (file → chunks → nodes) replicated by consensus (Raft/Paxos). Separate the **control plane** (small) from the **data plane** (bytes flow directly between client and nodes), so metadata does not become a bottleneck.",
          },
          {
            titulo: "4. Durability",
            texto:
              "Each chunk in 3 copies, in different racks or zones, or **erasure coding** (e.g. 10 data + 4 parity). Heartbeats detect a dead node and the system **re-replicates** by itself.",
          },
          {
            titulo: "5. Integrity and writes",
            texto:
              "Per-block checksum, verified on reads and in periodic sweeps (scrubbing). Writes in a client → primary → replicas pipeline, or by quorum (W + R > N). Immutable objects (a new version instead of editing) simplify everything.",
          },
          {
            titulo: "6. Scaling the metadata",
            texto: "Partition the namespace (hash or path prefix), each partition with its own consensus group.",
          },
          {
            titulo: "7. Upload and access",
            texto:
              "Resumable multipart upload; pre-signed URLs; access control; a CDN in front of reads; hot/cold tiers for cost; deduplication by content hash.",
          },
          {
            titulo: "8. Operations",
            texto:
              "Rebalancing when a new disk joins, garbage collection of orphan blocks, monitoring of space, rebuilds and checksum errors.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "What the system stores",
        legenda: "layout",
        codigo:
          'file "video.mp4" (1 GB)\n  chunk 1 (128 MB) -> nodes A, C, F    (3 copies, different racks)\n  chunk 2 (128 MB) -> nodes B, D, G\n  ...\nmetadata: video.mp4 -> [chunk1: A,C,F] [chunk2: B,D,G] ...\nclient: asks metadata, then reads/writes the bytes DIRECTLY on the nodes',
        nota: "Real systems built on this idea: GFS/HDFS, Ceph, Amazon S3, MinIO.",
      },
      {
        tipo: "tabela",
        titulo: "3× replicas vs erasure coding",
        colunas: ["", "Replicas (3×)", "Erasure coding (10+4)"],
        linhas: [
          ["Space used", "3× the original (200% extra)", "1.4× the original (40% extra)"],
          ["Tolerance", "Loses 2 copies", "Loses up to 4 fragments"],
          ["Read", "Fast: reads one copy", "Gathers fragments (more CPU and latency)"],
          ["Rebuild", "Copy the block", "Recompute from several fragments (expensive)"],
          ["Typical use", "Hot data, small files", "Cold and large data"],
        ],
        nota: "Example: 1 PB logical takes 3 PB with ×3 replicas and 1.4 PB with 10+4 erasure coding.",
      },
    ],
    armadilhas: [
      "Passing the bytes through the metadata service: it becomes the bottleneck.",
      "All replicas in the same rack or zone: one power failure loses all three.",
      "Replicating without checksums: silent corruption (bit rot) spreads to the copies.",
      "Re-replicating slowly: a second failure before repair loses data.",
      "Allowing in-place edits instead of immutable versions: complicates consistency and caching.",
    ],
    autoteste: [
      {
        pergunta: "Why separate metadata from data?",
        resposta:
          "Metadata is small and queried constantly; data is huge. If the bytes flowed through the metadata service it would become the bottleneck.",
      },
      {
        pergunta: "When would you prefer erasure coding over replicas?",
        resposta: "For cold, large data, where saving space outweighs the higher CPU and rebuild cost.",
      },
    ],
  },
};
