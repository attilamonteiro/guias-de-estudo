import type { Pergunta } from "../../tipos";

// R21 · Cache distribuído
export const r21: Pergunta = {
  numero: 121,
  modulo: "roadmap-intermediario",
  metodo: "firstprinciples",
  pt: {
    titulo: "Cache distribuído",
    pergunta: "Você pode descrever uma estratégia de cache distribuído para uma aplicação de alta disponibilidade?",
    porqueEsteMetodo:
      "Um cache distribuído nasce de um cache num nó só que quebra a cada restrição (memória, falha, mudança do cluster). Construir do zero mostra por que existe o hash consistente.",
    resposta30s:
      "Distribua as chaves entre vários nós de cache (**sharding**) usando **hash consistente**, para que entrar ou sair um nó mova só uma fração das chaves. Acrescente **replicação** (tolerância a falhas), **invalidação** (TTL, eventos, versionamento) e proteções contra **stampede** e **hot keys**, com **fallback ao banco** se o cache cair.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma restrição por vez",
        passos: [
          {
            titulo: "0. O problema",
            texto: "Um cache num nó só não cabe todos os dados e é ponto único de falha.",
          },
          {
            titulo: "1. Vários nós",
            texto: "Distribuir as chaves entre N nós (cluster Redis ou Memcached) soma memória e vazão.",
          },
          {
            titulo: "2. Como distribuir",
            texto:
              "`nó = hash(chave) mod N` funciona, mas mudar N remaneja quase todas as chaves (uma tempestade de misses).",
          },
          {
            titulo: "3. Hash consistente",
            texto:
              "Chaves e nós ficam num anel e cada chave pertence ao próximo nó. Entrar ou sair um nó move só ~1/N das chaves. (O Redis Cluster usa 16.384 slots de hash.)",
          },
          {
            titulo: "4. Replicação",
            texto:
              "Cada shard tem uma réplica; se o primário cair, ela assume (tolerância a falhas e alta disponibilidade).",
          },
          {
            titulo: "5. Invalidação e consistência",
            texto:
              "TTL, invalidação por evento e versionamento de chaves; aceite que as cópias podem ficar velhas por instantes.",
          },
          {
            titulo: "6. Proteções",
            texto:
              "Evite stampede (single-flight, TTL com jitter), trate hot keys (réplicas, cache local) e tenha fallback ao banco se o cache cair.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Veja também",
        texto:
          "O funcionamento básico do cache e as estratégias de leitura e escrita estão na Q11; as políticas de remoção, na R44.",
      },
    ],
    armadilhas: [
      "`hash mod N` e depois adicionar um nó: despeja quase todo o cache.",
      "Cache sem replicação: a queda de um nó vira uma enxurrada no banco.",
      "Esquecer a invalidação.",
      "Hot key concentrada num único nó.",
    ],
    autoteste: [
      {
        pergunta: "Por que usar hash consistente?",
        resposta:
          "Porque adicionar ou remover um nó remaneja só uma fração das chaves, evitando invalidar o cache todo.",
      },
      {
        pergunta: "Para que serve a replicação no cache distribuído?",
        resposta: "Para tolerar a queda de um nó sem perder a camada de cache (e sem sobrecarregar o banco).",
      },
    ],
  },
  en: {
    titulo: "Distributed caching",
    pergunta: "Can you describe a distributed caching strategy for a high-availability application?",
    porqueEsteMetodo:
      "A distributed cache is born from a single-node cache that breaks at each constraint (memory, failure, cluster change). Building from scratch shows why consistent hashing exists.",
    resposta30s:
      "Spread the keys across several cache nodes (**sharding**) using **consistent hashing**, so a node joining or leaving moves only a fraction of keys. Add **replication** (fault tolerance), **invalidation** (TTL, events, versioning) and protection against **stampede** and **hot keys**, with a **fallback to the database** if the cache goes down.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building up, one constraint at a time",
        passos: [
          {
            titulo: "0. The problem",
            texto: "A single-node cache cannot hold all the data and is a single point of failure.",
          },
          {
            titulo: "1. Several nodes",
            texto: "Spreading keys across N nodes (Redis or Memcached cluster) adds memory and throughput.",
          },
          {
            titulo: "2. How to distribute",
            texto: "`node = hash(key) mod N` works, but changing N remaps almost every key (a storm of misses).",
          },
          {
            titulo: "3. Consistent hashing",
            texto:
              "Keys and nodes sit on a ring and each key belongs to the next node. A node joining or leaving moves only ~1/N of the keys. (Redis Cluster uses 16,384 hash slots.)",
          },
          {
            titulo: "4. Replication",
            texto:
              "Each shard has a replica; if the primary dies, the replica takes over (fault tolerance and high availability).",
          },
          {
            titulo: "5. Invalidation and consistency",
            texto: "TTL, event-based invalidation and key versioning; accept that copies may be stale for moments.",
          },
          {
            titulo: "6. Protections",
            texto:
              "Avoid stampede (single-flight, TTL with jitter), handle hot keys (replicas, local cache) and fall back to the database if the cache is down.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "See also",
        texto: "The basics of caching and the read/write strategies are in Q11; eviction policies are in R44.",
      },
    ],
    armadilhas: [
      "`hash mod N` and then adding a node: it dumps almost the whole cache.",
      "A cache without replication: losing a node becomes a flood on the database.",
      "Forgetting invalidation.",
      "A hot key concentrated on a single node.",
    ],
    autoteste: [
      {
        pergunta: "Why use consistent hashing?",
        resposta:
          "Because adding or removing a node remaps only a fraction of keys, avoiding invalidating the whole cache.",
      },
      {
        pergunta: "What is replication for in a distributed cache?",
        resposta: "To tolerate a node loss without losing the cache layer (and without overloading the database).",
      },
    ],
  },
};
