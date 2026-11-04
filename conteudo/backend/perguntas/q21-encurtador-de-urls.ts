import type { Pergunta } from "../../tipos";

// Q21 · Encurtador de URLs
export const q21: Pergunta = {
  numero: 21,
  modulo: "design-de-sistemas",
  metodo: "design",
  pt: {
    titulo: "Encurtador de URLs",
    pergunta: "Como você projetaria um serviço de encurtamento de URLs como o Bitly?",
    porqueEsteMetodo:
      "Projetar um produto inteiro pede um roteiro fixo para não esquecer nada nem se perder em detalhes: requisitos, números, API, dados, arquitetura e gargalos, nessa ordem.",
    resposta30s:
      "Siga o roteiro. É um sistema com **leitura muito maior que escrita** (~100:1): `POST /urls` gera um código curto em **base62 de 7 caracteres** (62⁷ ≈ 3,5 trilhões de combinações) e grava `código → URL longa` num armazenamento chave-valor; `GET /{código}` responde `302` lendo antes de um **cache** (Redis). O coração é **gerar o código sem colisão**; o resto é cache, CDN, expiração e combate a abuso.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Funcionais: encurtar uma URL, redirecionar, alias personalizado opcional, expiração opcional, estatísticas de cliques. Não funcionais: redirecionamento em poucos milissegundos, alta disponibilidade, ~100 leituras para cada escrita, links não adivinháveis em sequência.",
          },
          {
            titulo: "2. Estimativas",
            texto:
              "100 milhões de novas URLs por mês ≈ 40 escritas/s. Leitura 100× maior ≈ 4.000/s em média, ~40.000/s em pico. Em 5 anos: 6 bilhões de registros × ~500 B ≈ 3 TB. Cabe num armazenamento distribuído simples.",
          },
          {
            titulo: "3. API",
            texto:
              "`POST /urls {longUrl, alias?, ttl?}` → `201 {shortUrl}`. `GET /{code}` → `302` com `Location`. Alias já usado: `409`.",
          },
          {
            titulo: "4. Geração do código",
            texto: "É a decisão central; veja a tabela abaixo.",
          },
          {
            titulo: "5. Dados",
            texto:
              "`code` (chave primária), `long_url`, `user_id`, `created_at`, `expires_at`. O acesso é sempre por chave: KV (DynamoDB, Cassandra) ou SQL particionado por `code`.",
          },
          {
            titulo: "6. Arquitetura",
            texto:
              "Cliente → CDN/balanceador → servidores de aplicação stateless → **cache** (Redis, LRU) → armazenamento. Cerca de 20% dos links respondem por ~80% do tráfego, então o cache absorve quase tudo.",
          },
          {
            titulo: "7. Gargalos e extras",
            texto:
              "Link viral (hot key), abuso e malware (blocklist, rate limit), limpeza de expirados, estatísticas por fila (fora do caminho do redirect), multirregião.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Como gerar o código (decisão central)",
        colunas: ["Opção", "Como", "Prós e contras"],
        linhas: [
          [
            "Hash da URL, truncado",
            "Hash (MD5/SHA) convertido em base62, 7 primeiros caracteres",
            "Sem coordenação; **colisões** exigem verificar e tentar de novo; a mesma URL vira o mesmo código",
          ],
          [
            "Contador global + base62",
            "ID sequencial convertido em base62",
            "Único por construção; previsível (enumerável: embaralhe); o contador é ponto único, então aloque **faixas** por servidor",
          ],
          [
            "Gerador de chaves pré-calculadas (KGS)",
            "Um serviço gera códigos aleatórios antes; cada servidor pega um lote",
            "Sem colisão e sem coordenação por requisição; precisa gerir lotes e falhas",
          ],
          [
            "ID tipo Snowflake",
            "Timestamp + id da máquina + sequência, em base62",
            "Distribuído e ordenável; código mais longo",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Leitura (o caminho quente)",
        etapas: [
          "Cliente abre o link curto",
          "Cache Redis (hit em ~1 ms)",
          "Em caso de miss, consulta o armazenamento e preenche o cache",
          "Responde `302` + `Location`",
          "O clique vai para uma fila (assíncrono)",
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Escrita",
        etapas: [
          "Valida a URL (esquema, tamanho, blocklist)",
          "Obtém um código (KGS ou faixa do contador)",
          "Grava `código → URL` (rejeita alias repetido com `409`)",
          "Devolve `https://sho.rt/aZ3k9Qb`",
        ],
      },
      {
        tipo: "tabela",
        titulo: "301 ou 302?",
        colunas: ["Código", "Efeito"],
        linhas: [
          [
            "301 (permanente)",
            "Navegadores e CDNs guardam o destino: menos carga, mas você **perde** a contagem de cliques e não consegue mudar o destino depois",
          ],
          [
            "302 (temporário)",
            "Toda visita passa por você: dá estatísticas e controle, com mais tráfego. Escolha comum em encurtadores com analytics",
          ],
        ],
      },
    ],
    armadilhas: [
      "Usar hash truncado sem tratar colisão: dois links diferentes acabam com o mesmo código.",
      "Contador sequencial exposto: qualquer um enumera todos os links, inclusive os privados.",
      "Registrar o clique de forma síncrona no caminho do redirect: a latência e a falha da estatística passam a afetar o redirecionamento.",
      "Não tratar abuso (phishing, malware): o encurtador vira ferramenta de ataque.",
      "Desenhar antes de estimar: sem os números não dá para justificar cache, particionamento ou escolha de banco.",
    ],
    autoteste: [
      {
        pergunta: "Por que 7 caracteres em base62 bastam?",
        resposta: "62⁷ ≈ 3,5 trilhões de combinações, muito mais que os ~6 bilhões de links estimados para 5 anos.",
      },
      {
        pergunta: "Por que o redirect lê do cache e não do banco?",
        resposta:
          "A leitura é ~100× a escrita e se concentra em poucos links; o cache responde a quase tudo em ~1 ms, poupando o armazenamento.",
      },
    ],
  },
  en: {
    titulo: "URL shortener",
    pergunta: "How would you design a URL-shortening service like Bitly?",
    porqueEsteMetodo:
      "Designing a whole product needs a fixed script so nothing is forgotten and you do not drown in details: requirements, numbers, API, data, architecture and bottlenecks, in that order.",
    resposta30s:
      "Follow the script. It is a system with **far more reads than writes** (~100:1): `POST /urls` generates a short code in **7-character base62** (62⁷ ≈ 3.5 trillion combinations) and stores `code → long URL` in a key-value store; `GET /{code}` answers `302` reading first from a **cache** (Redis). The heart is **generating the code without collisions**; the rest is cache, CDN, expiry and abuse control.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "Functional: shorten a URL, redirect, optional custom alias, optional expiry, click statistics. Non-functional: redirect in a few milliseconds, high availability, ~100 reads per write, links not guessable in sequence.",
          },
          {
            titulo: "2. Estimates",
            texto:
              "100 million new URLs per month ≈ 40 writes/s. Reads 100× larger ≈ 4,000/s average, ~40,000/s at peak. Over 5 years: 6 billion records × ~500 B ≈ 3 TB. Fits a simple distributed store.",
          },
          {
            titulo: "3. API",
            texto:
              "`POST /urls {longUrl, alias?, ttl?}` → `201 {shortUrl}`. `GET /{code}` → `302` with `Location`. Alias already taken: `409`.",
          },
          {
            titulo: "4. Code generation",
            texto: "The central decision; see the table below.",
          },
          {
            titulo: "5. Data",
            texto:
              "`code` (primary key), `long_url`, `user_id`, `created_at`, `expires_at`. Access is always by key: KV (DynamoDB, Cassandra) or SQL partitioned by `code`.",
          },
          {
            titulo: "6. Architecture",
            texto:
              "Client → CDN/load balancer → stateless app servers → **cache** (Redis, LRU) → storage. About 20% of links account for ~80% of traffic, so the cache absorbs almost everything.",
          },
          {
            titulo: "7. Bottlenecks and extras",
            texto:
              "Viral link (hot key), abuse and malware (blocklist, rate limiting), expired-link cleanup, statistics through a queue (off the redirect path), multi-region.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "How to generate the code (central decision)",
        colunas: ["Option", "How", "Pros and cons"],
        linhas: [
          [
            "Truncated URL hash",
            "Hash (MD5/SHA) converted to base62, first 7 characters",
            "No coordination; **collisions** require checking and retrying; the same URL gives the same code",
          ],
          [
            "Global counter + base62",
            "Sequential ID converted to base62",
            "Unique by construction; predictable (enumerable: scramble it); the counter is a single point, so allocate **ranges** per server",
          ],
          [
            "Pre-generated key service (KGS)",
            "A service generates random codes ahead of time; each server takes a batch",
            "No collisions and no per-request coordination; must manage batches and failures",
          ],
          [
            "Snowflake-style ID",
            "Timestamp + machine id + sequence, in base62",
            "Distributed and sortable; longer code",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Read (the hot path)",
        etapas: [
          "Client opens the short link",
          "Redis cache (hit in ~1 ms)",
          "On a miss, query storage and fill the cache",
          "Respond `302` + `Location`",
          "The click goes to a queue (asynchronous)",
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Write",
        etapas: [
          "Validate the URL (scheme, length, blocklist)",
          "Obtain a code (KGS or counter range)",
          "Store `code → URL` (reject a repeated alias with `409`)",
          "Return `https://sho.rt/aZ3k9Qb`",
        ],
      },
      {
        tipo: "tabela",
        titulo: "301 or 302?",
        colunas: ["Code", "Effect"],
        linhas: [
          [
            "301 (permanent)",
            "Browsers and CDNs cache the destination: less load, but you **lose** click counts and cannot change the destination later",
          ],
          [
            "302 (temporary)",
            "Every visit goes through you: gives statistics and control, with more traffic. The common choice for shorteners with analytics",
          ],
        ],
      },
    ],
    armadilhas: [
      "Using a truncated hash without handling collisions: two different links end up with the same code.",
      "An exposed sequential counter: anyone can enumerate all links, including private ones.",
      "Recording the click synchronously on the redirect path: the statistics’ latency and failures start affecting redirects.",
      "Not handling abuse (phishing, malware): the shortener becomes an attack tool.",
      "Designing before estimating: without numbers you cannot justify cache, partitioning or database choice.",
    ],
    autoteste: [
      {
        pergunta: "Why are 7 base62 characters enough?",
        resposta: "62⁷ ≈ 3.5 trillion combinations, far more than the ~6 billion links estimated over 5 years.",
      },
      {
        pergunta: "Why does the redirect read from the cache and not the database?",
        resposta:
          "Reads are ~100× writes and concentrate on a few links; the cache answers almost everything in ~1 ms, sparing the storage.",
      },
    ],
  },
};
