import type { Pergunta } from "../../tipos";

// R16 · Busca full-text
export const r16: Pergunta = {
  numero: 116,
  modulo: "roadmap-intermediario",
  metodo: "firstprinciples",
  pt: {
    titulo: "Busca full-text",
    pergunta: "Descreva como você implementaria uma busca full-text em um banco de dados.",
    porqueEsteMetodo:
      "Busca de texto não nasce pronta: começa num `LIKE` ingênuo que quebra a cada exigência (acento, plural, relevância, escala). Construir do zero mostra por que existe o índice invertido.",
    resposta30s:
      "Normalize o texto (**tokenização, minúsculas, remoção de acentos e stop words, stemming**), construa um **índice invertido** (`palavra → documentos`), normalize a consulta do mesmo jeito e **ordene por relevância** (TF-IDF ou BM25). Na prática, use o recurso nativo do banco (`tsvector` + GIN no Postgres, `FULLTEXT` no MySQL) ou um motor como **Elasticsearch/OpenSearch/Meilisearch** quando precisar de escala e relevância avançada.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma restrição por vez",
        passos: [
          {
            titulo: "0. O problema",
            texto: "Achar documentos que contêm palavras, mesmo com variações, rápido e ordenados por relevância.",
          },
          {
            titulo: "1. O jeito ingênuo",
            texto:
              "`WHERE texto LIKE '%palavra%'` varre tudo, não ignora acento nem plural e não ordena por relevância. Não escala.",
          },
          {
            titulo: "2. Normalizar o texto",
            texto:
              "Minúsculas, remoção de acentos, **tokenização**, remoção de **stop words** (de, a, o) e **stemming/lematização** (`carros` → `carro`).",
          },
          {
            titulo: "3. Índice invertido",
            texto:
              "Um mapa `palavra → lista de documentos (e posições)`. Buscar vira consultar o mapa e cruzar as listas.",
          },
          {
            titulo: "4. Consulta e ranking",
            texto:
              "A consulta passa pela mesma normalização. Resultados ordenados por relevância (TF-IDF ou BM25: palavras raras e frequentes no documento pesam mais), com busca por frase e tolerância a erro de digitação (fuzzy).",
          },
          {
            titulo: "5. Escolha prática",
            texto:
              "Nativo do banco para volumes moderados; Elasticsearch, OpenSearch ou Meilisearch quando precisar de escala, facetas e relevância avançada.",
          },
        ],
      },
      {
        tipo: "codigo",
        legenda: "sql (postgres)",
        codigo:
          "CREATE INDEX idx_docs_busca ON docs USING GIN (to_tsvector('portuguese', texto));\n\nSELECT id, ts_rank(to_tsvector('portuguese', texto), q) AS rank\nFROM docs, plainto_tsquery('portuguese', 'carro eletrico') q\nWHERE to_tsvector('portuguese', texto) @@ q\nORDER BY rank DESC LIMIT 20;",
      },
    ],
    armadilhas: [
      "Usar `LIKE '%x%'` e esperar escala e relevância.",
      "Indexar com um idioma e consultar com outro.",
      "Deixar o índice de busca desatualizado em relação ao banco principal.",
      "Tratar o motor de busca como fonte da verdade.",
    ],
    autoteste: [
      {
        pergunta: "O que é um índice invertido?",
        resposta:
          "Um mapa de cada palavra para os documentos (e posições) em que ela aparece, o que torna a busca uma consulta ao mapa.",
      },
      {
        pergunta: "Por que normalizar a consulta do mesmo jeito que o texto?",
        resposta: "Para que “Carros” na busca encontre “carro” no texto; os dois precisam passar pela mesma análise.",
      },
    ],
  },
  en: {
    titulo: "Full-text search",
    pergunta: "Describe how you would implement full-text search in a database.",
    porqueEsteMetodo:
      "Text search is not born finished: it starts as a naive `LIKE` that breaks at each demand (accents, plurals, relevance, scale). Building from scratch shows why the inverted index exists.",
    resposta30s:
      "Normalize the text (**tokenization, lowercase, accent and stop-word removal, stemming**), build an **inverted index** (`word → documents`), normalize the query the same way and **rank by relevance** (TF-IDF or BM25). In practice, use the database’s native feature (`tsvector` + GIN in Postgres, `FULLTEXT` in MySQL) or an engine such as **Elasticsearch/OpenSearch/Meilisearch** when you need scale and advanced relevance.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building up, one constraint at a time",
        passos: [
          {
            titulo: "0. The problem",
            texto: "Find documents containing words, even with variations, fast and ranked by relevance.",
          },
          {
            titulo: "1. The naive way",
            texto:
              "`WHERE text LIKE '%word%'` scans everything, ignores neither accents nor plurals and does not rank by relevance. It does not scale.",
          },
          {
            titulo: "2. Normalize the text",
            texto:
              "Lowercase, accent removal, **tokenization**, **stop-word** removal (the, a, of) and **stemming/lemmatization** (`cars` → `car`).",
          },
          {
            titulo: "3. Inverted index",
            texto:
              "A map `word → list of documents (and positions)`. Searching becomes looking up the map and intersecting the lists.",
          },
          {
            titulo: "4. Query and ranking",
            texto:
              "The query goes through the same normalization. Results ranked by relevance (TF-IDF or BM25: rare words and words frequent in the document weigh more), with phrase search and typo tolerance (fuzzy).",
          },
          {
            titulo: "5. Practical choice",
            texto:
              "Native database features for moderate volumes; Elasticsearch, OpenSearch or Meilisearch when you need scale, facets and advanced relevance.",
          },
        ],
      },
      {
        tipo: "codigo",
        legenda: "sql (postgres)",
        codigo:
          "CREATE INDEX idx_docs_search ON docs USING GIN (to_tsvector('english', body));\n\nSELECT id, ts_rank(to_tsvector('english', body), q) AS rank\nFROM docs, plainto_tsquery('english', 'electric car') q\nWHERE to_tsvector('english', body) @@ q\nORDER BY rank DESC LIMIT 20;",
      },
    ],
    armadilhas: [
      "Using `LIKE '%x%'` and expecting scale and relevance.",
      "Indexing with one language and querying with another.",
      "Leaving the search index out of sync with the main database.",
      "Treating the search engine as the source of truth.",
    ],
    autoteste: [
      {
        pergunta: "What is an inverted index?",
        resposta:
          "A map from each word to the documents (and positions) where it appears, which makes search a lookup in the map.",
      },
      {
        pergunta: "Why normalize the query the same way as the text?",
        resposta: "So “Cars” in the search finds “car” in the text; both must go through the same analysis.",
      },
    ],
  },
};
