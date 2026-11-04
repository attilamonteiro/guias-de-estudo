import type { Pergunta } from "../../tipos";

// R44 · Evicção de cache no servidor
export const r44: Pergunta = {
  numero: 144,
  modulo: "roadmap-avancado",
  metodo: "compare",
  pt: {
    titulo: "Evicção de cache no servidor",
    pergunta: "Descreva como você implementaria uma estratégia de evicção de cache no servidor.",
    porqueEsteMetodo:
      "A evicção é uma escolha entre políticas com pontos fortes e fracos. A matriz mostra qual política serve a qual padrão de acesso, e os passos mostram como defini-la.",
    resposta30s:
      "Defina o **teto de memória** que dispara a remoção, escolha uma **política** pelo padrão de acesso (**LRU** como padrão, **LFU** para itens consistentemente populares, **TTL** para validade natural, FIFO ou aleatória em casos simples), combine com **invalidação** (que cuida de dado desatualizado, não de espaço) e **monitore** hit ratio e taxa de evicção.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Política", "Remove", "Bom para", "Ponto fraco"],
        linhas: [
          [
            "LRU",
            "O menos usado recentemente",
            "Uso geral, localidade temporal",
            "Uma varredura grande “polui” o cache",
          ],
          [
            "LFU",
            "O menos usado em frequência",
            "Itens populares estáveis",
            "Um item antigo popular nunca sai; custo dos contadores",
          ],
          ["FIFO", "O que entrou primeiro", "Simplicidade", "Ignora o uso: pode expulsar o item mais quente"],
          ["Aleatória", "Um item aleatório", "Custo muito baixo", "Sem inteligência"],
          ["TTL", "O que expirou", "Dados com validade natural", "Não limita a memória sozinho"],
        ],
      },
      {
        tipo: "passos",
        titulo: "Como definir a estratégia",
        passos: [
          {
            titulo: "Limite de tamanho",
            texto: "Defina o teto (memória ou número de itens) que dispara a remoção (`maxmemory` no Redis).",
          },
          {
            titulo: "Escolha a política pelo padrão de acesso",
            texto:
              "LRU como padrão; LFU quando há itens muito populares; TTL para validade; combine (`allkeys-lru` + TTL).",
          },
          {
            titulo: "Invalidação",
            texto: "A evicção cuida de espaço; a **invalidação** cuida de dado desatualizado (por evento ou TTL).",
          },
          {
            titulo: "Monitore",
            texto: "Hit ratio, taxa de evicção, memória e latência; ajuste quando o hit ratio cair.",
          },
        ],
      },
      {
        tipo: "codigo",
        legenda: "redis.conf",
        codigo: "maxmemory 2gb\nmaxmemory-policy allkeys-lru",
      },
    ],
    armadilhas: [
      "Confundir evicção (liberar espaço) com invalidação (remover dado velho).",
      "Sem limite de memória: o cache cresce até derrubar o servidor.",
      "LRU com varreduras em lote que expulsam os itens quentes.",
      "Não monitorar a taxa de evicção.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre evicção e invalidação?",
        resposta:
          "Evicção remove itens por falta de espaço; invalidação remove ou atualiza itens porque o dado de origem mudou.",
      },
      {
        pergunta: "Quando LFU é melhor que LRU?",
        resposta:
          "Quando há itens consistentemente populares que não devem sair só porque ficaram um tempo sem acesso.",
      },
    ],
  },
  en: {
    titulo: "Server-side cache eviction",
    pergunta: "Describe how you would implement a server-side cache eviction strategy.",
    porqueEsteMetodo:
      "Eviction is a choice between policies with strengths and weaknesses. The matrix shows which policy fits which access pattern, and the steps show how to define it.",
    resposta30s:
      "Define the **memory ceiling** that triggers removal, choose a **policy** by access pattern (**LRU** as the default, **LFU** for consistently popular items, **TTL** for natural validity, FIFO or random in simple cases), combine it with **invalidation** (which handles stale data, not space) and **monitor** hit ratio and eviction rate.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Policy", "Removes", "Good for", "Weak point"],
        linhas: [
          ["LRU", "The least recently used", "General use, temporal locality", "A big scan “pollutes” the cache"],
          [
            "LFU",
            "The least frequently used",
            "Stable popular items",
            "An old popular item never leaves; counter cost",
          ],
          ["FIFO", "The first one in", "Simplicity", "Ignores usage: may evict the hottest item"],
          ["Random", "A random item", "Very low cost", "No intelligence"],
          ["TTL", "What has expired", "Data with natural validity", "Does not bound memory on its own"],
        ],
      },
      {
        tipo: "passos",
        titulo: "How to define the strategy",
        passos: [
          {
            titulo: "Size limit",
            texto: "Define the ceiling (memory or item count) that triggers removal (`maxmemory` in Redis).",
          },
          {
            titulo: "Pick the policy by access pattern",
            texto:
              "LRU as the default; LFU when there are very popular items; TTL for validity; combine (`allkeys-lru` + TTL).",
          },
          {
            titulo: "Invalidation",
            texto: "Eviction handles space; **invalidation** handles stale data (by event or TTL).",
          },
          {
            titulo: "Monitor",
            texto: "Hit ratio, eviction rate, memory and latency; adjust when the hit ratio drops.",
          },
        ],
      },
      {
        tipo: "codigo",
        legenda: "redis.conf",
        codigo: "maxmemory 2gb\nmaxmemory-policy allkeys-lru",
      },
    ],
    armadilhas: [
      "Confusing eviction (freeing space) with invalidation (removing stale data).",
      "No memory limit: the cache grows until it takes the server down.",
      "LRU with batch scans that evict the hot items.",
      "Not monitoring the eviction rate.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between eviction and invalidation?",
        resposta:
          "Eviction removes items for lack of space; invalidation removes or updates items because the source data changed.",
      },
      {
        pergunta: "When is LFU better than LRU?",
        resposta:
          "When there are consistently popular items that should not leave just because they went a while without access.",
      },
    ],
  },
};
