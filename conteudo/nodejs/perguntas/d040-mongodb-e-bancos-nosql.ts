import type { Pergunta } from "../../tipos";

// D40 · MongoDB e bancos NoSQL
export const d040: Pergunta = {
  numero: 340,
  modulo: "devinterview-testes-e-dados",
  metodo: "compare",
  pt: {
    titulo: "MongoDB e bancos NoSQL",
    pergunta: "Explique como bancos NoSQL como o MongoDB podem ser usados com o Node.js.",
    porqueEsteMetodo:
      "A pergunta tem duas metades: como ligar o banco ao Node.js e quando um banco NoSQL faz sentido. A matriz contra o relacional responde à segunda; o roteiro de uso e o código respondem à primeira.",
    resposta30s:
      "O MongoDB guarda **documentos** (JSON/BSON) em coleções, que mapeiam quase direto para objetos JavaScript. No Node.js você usa o **driver oficial** (`mongodb`) ou o **Mongoose**, que acrescenta esquemas e validação, com **um cliente por processo** (ele mantém o pool de conexões). Modele pelos acessos (embuta o que é lido junto, referencie o resto), crie **índices** e valide a entrada; prefira NoSQL quando os dados têm forma de documento e o esquema evolui, e o relacional quando há muitas relações e integridade forte.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "MongoDB (documentos) x banco relacional",
        colunas: ["Aspecto", "MongoDB / NoSQL de documentos", "SQL relacional"],
        linhas: [
          [
            "Modelo de dados",
            "Documentos aninhados em coleções; o objeto JavaScript e o documento têm quase a mesma forma",
            "Tabelas com linhas e colunas; objetos precisam ser mapeados (veja D41)",
          ],
          [
            "Esquema",
            "Flexível: documentos da mesma coleção podem ter formas diferentes; a validação é opcional (esquema do servidor ou Mongoose)",
            "Rígido: colunas e tipos definidos, e mudanças passam por migração",
          ],
          [
            "Relações",
            "Embute o que é lido junto e referencia o resto; `$lookup` existe, mas não é o caminho principal",
            "Chaves estrangeiras e `JOIN` são o padrão",
          ],
          [
            "Consistência",
            "Operações em um documento são atômicas; transações com vários documentos existem, com custo",
            "Transações ACID entre linhas e tabelas são o padrão",
          ],
          [
            "Escala",
            "Réplicas e particionamento (sharding) fazem parte do desenho do banco",
            "Réplicas de leitura são comuns; dividir os dados entre servidores costuma exigir mais trabalho",
          ],
          [
            "Bom para",
            "Catálogos, perfis, eventos, conteúdo e dados cujo formato muda com frequência",
            "Dados muito relacionados, integridade forte, relatórios e consultas variadas",
          ],
        ],
        nota: "NoSQL também inclui chave-valor (Redis), colunas (Cassandra) e grafos (Neo4j); aqui o foco é o banco de documentos, o mais comum com Node.js.",
      },
      {
        tipo: "passos",
        titulo: "Como usar com o Node.js",
        passos: [
          {
            titulo: "1. Conecte uma vez",
            texto:
              "Crie um único `MongoClient` por processo, na partida, e reutilize-o: ele já gerencia um pool de conexões. Abrir um cliente por requisição esgota conexões (veja L93). Feche-o no encerramento da aplicação.",
          },
          {
            titulo: "2. Driver oficial ou Mongoose",
            texto:
              "O driver oficial é fino: você escreve as consultas e os documentos chegam como objetos. O Mongoose é um ODM que acrescenta esquemas, conversão de tipos, validação, valores padrão e middlewares, ao custo de uma camada a mais. Escolha pela estrutura que a equipe quer impor.",
          },
          {
            titulo: "3. Modele pelos acessos",
            texto:
              "Embuta o que é lido junto e tem tamanho limitado (os itens de um pedido). Referencie o que é compartilhado, cresce sem limite ou muda por conta própria (o cliente, os comentários de um post popular). Duplicar um dado muito lido é aceitável se você souber como mantê-lo atualizado.",
          },
          {
            titulo: "4. Indexe e meça",
            texto:
              "Crie índices para os filtros e ordenações das consultas reais e confira o plano com `explain()`. Sem índice, o banco varre a coleção inteira. Todo índice custa espaço e tempo de escrita.",
          },
          {
            titulo: "5. Conte com a consistência que existe",
            texto:
              "Como cada documento é atômico, a modelagem tenta manter o que muda junto no mesmo documento. Transações com vários documentos existem em implantações com réplicas, mas custam desempenho; se você precisa delas o tempo todo, o modelo relacional pode servir melhor. Confira os níveis de leitura e escrita na documentação oficial.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Driver oficial: um cliente, um índice, documento embutido",
        legenda: "JavaScript",
        codigo: `import { MongoClient } from "mongodb";

// Um cliente por processo: ele mantém o pool de conexões
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const pedidos = client.db("loja").collection("pedidos");

// Índice para a consulta por cliente, da mais recente para a mais antiga
await pedidos.createIndex({ clienteId: 1, criadoEm: -1 });

await pedidos.insertOne({
  clienteId: "c-42",
  criadoEm: new Date(),
  itens: [{ sku: "A1", qtd: 2, precoCents: 1990 }], // embutido: sempre lido com o pedido
});

const recentes = await pedidos.find({ clienteId: "c-42" }).sort({ criadoEm: -1 }).limit(10).toArray();`,
        nota: "O código é um exemplo de uso do driver; a URI vem do ambiente e o dinheiro fica em centavos. Confira a documentação do driver para a API da versão que você instalar.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Escolha pela **forma dos dados e das consultas**, não pela moda. Dados que são naturalmente documentos, lidos quase sempre inteiros e com esquema que evolui: documento. Muitas relações, regras de integridade e consultas que cruzam entidades: relacional. Usar os dois no mesmo sistema é comum (por exemplo, relacional como fonte principal e Redis para cache).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "“Sem esquema” não é “sem modelo”",
        texto:
          'O esquema não desaparece: ele muda do banco para o seu código, e documentos com formas diferentes viram bugs em produção. Valide na entrada e no banco (Mongoose ou esquema do servidor). Cuidado também com a **injeção de operador**: se `req.body.email` chegar como `{ "$ne": null }` e for passado direto ao filtro, a consulta casa com qualquer usuário (veja L123).',
      },
    ],
    armadilhas: [
      "Achar que “sem esquema” dispensa modelar e validar: documentos inconsistentes só aparecem quando o código lê o campo errado.",
      "Passar `req.body` direto ao filtro: um objeto com `$ne` ou `$gt` altera a consulta (injeção de operador); valide os tipos e exija strings.",
      "Consultar por campos sem índice: cada consulta varre a coleção inteira, e o problema cresce com os dados.",
      "Embutir em um documento uma lista que só cresce (comentários, eventos): o documento tem tamanho máximo e fica cada vez mais pesado de ler e gravar.",
    ],
    autoteste: [
      {
        pergunta: "Quando embutir e quando referenciar em um modelo de documentos?",
        resposta:
          "Embuta o que é lido junto e tem tamanho limitado, como os itens de um pedido. Referencie o que é compartilhado entre documentos, cresce sem limite ou é atualizado de forma independente.",
      },
      {
        pergunta: "O que o Mongoose acrescenta ao driver oficial, e qual é o custo?",
        resposta:
          "Esquemas, conversão de tipos, validação, valores padrão e middlewares. O custo é uma camada de abstração a mais, com sua própria API e comportamento, sobre um driver que já entrega objetos JavaScript.",
      },
    ],
  },
  en: {
    titulo: "MongoDB and NoSQL",
    pergunta: "Explain how NoSQL databases like MongoDB can be used with Node.js.",
    porqueEsteMetodo:
      "The question has two halves: how to connect the database to Node.js and when a NoSQL database makes sense. The matrix against the relational model answers the second; the usage script and the code answer the first.",
    resposta30s:
      "MongoDB stores **documents** (JSON/BSON) in collections, which map almost directly to JavaScript objects. In Node.js you use the **official driver** (`mongodb`) or **Mongoose**, which adds schemas and validation, with **one client per process** (it keeps the connection pool). Model by access patterns (embed what is read together, reference the rest), create **indexes** and validate input; prefer NoSQL when the data is document-shaped and the schema evolves, and relational when there are many relationships and strong integrity.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "MongoDB (documents) vs relational database",
        colunas: ["Aspect", "MongoDB / document NoSQL", "Relational SQL"],
        linhas: [
          [
            "Data model",
            "Nested documents in collections; the JavaScript object and the document have almost the same shape",
            "Tables with rows and columns; objects have to be mapped (see D41)",
          ],
          [
            "Schema",
            "Flexible: documents in the same collection can have different shapes; validation is optional (server-side schema or Mongoose)",
            "Rigid: columns and types are defined, and changes go through a migration",
          ],
          [
            "Relationships",
            "Embeds what is read together and references the rest; `$lookup` exists, but it is not the main path",
            "Foreign keys and `JOIN` are the default",
          ],
          [
            "Consistency",
            "Operations on a single document are atomic; multi-document transactions exist, at a cost",
            "ACID transactions across rows and tables are the default",
          ],
          [
            "Scaling",
            "Replicas and partitioning (sharding) are part of the database design",
            "Read replicas are common; splitting data across servers usually takes more work",
          ],
          [
            "Good for",
            "Catalogs, profiles, events, content and data whose shape changes often",
            "Highly related data, strong integrity, reports and varied queries",
          ],
        ],
        nota: "NoSQL also includes key-value (Redis), wide-column (Cassandra) and graph (Neo4j) stores; the focus here is the document database, the most common with Node.js.",
      },
      {
        tipo: "passos",
        titulo: "How to use it with Node.js",
        passos: [
          {
            titulo: "1. Connect once",
            texto:
              "Create a single `MongoClient` per process, at startup, and reuse it: it already manages a connection pool. Opening a client per request exhausts connections (see L93). Close it when the application shuts down.",
          },
          {
            titulo: "2. Official driver or Mongoose",
            texto:
              "The official driver is thin: you write the queries and documents arrive as objects. Mongoose is an ODM that adds schemas, type casting, validation, defaults and middleware, at the cost of an extra layer. Choose by how much structure the team wants to enforce.",
          },
          {
            titulo: "3. Model by access patterns",
            texto:
              "Embed what is read together and has a bounded size (an order’s items). Reference what is shared, grows without limit or changes on its own (the customer, the comments on a popular post). Duplicating a heavily read value is acceptable if you know how to keep it up to date.",
          },
          {
            titulo: "4. Index and measure",
            texto:
              "Create indexes for the filters and sorts of the real queries and check the plan with `explain()`. Without an index, the database scans the whole collection. Every index costs space and write time.",
          },
          {
            titulo: "5. Rely on the consistency that exists",
            texto:
              "Because each document is atomic, modeling tries to keep what changes together in the same document. Multi-document transactions exist in replicated deployments, but they cost performance; if you need them all the time, the relational model may fit better. Check the read and write concern levels in the official documentation.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Official driver: one client, one index, an embedded document",
        legenda: "JavaScript",
        codigo: `import { MongoClient } from "mongodb";

// One client per process: it keeps the connection pool
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const orders = client.db("shop").collection("orders");

// Index for the per-customer query, newest first
await orders.createIndex({ customerId: 1, createdAt: -1 });

await orders.insertOne({
  customerId: "c-42",
  createdAt: new Date(),
  items: [{ sku: "A1", qty: 2, priceCents: 1990 }], // embedded: always read with the order
});

const recent = await orders.find({ customerId: "c-42" }).sort({ createdAt: -1 }).limit(10).toArray();`,
        nota: "The code is an example of using the driver; the URI comes from the environment and money is kept in cents. Check the driver documentation for the API of the version you install.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Choose by the **shape of the data and of the queries**, not by fashion. Data that is naturally documents, almost always read whole, with an evolving schema: document. Many relationships, integrity rules and queries that cross entities: relational. Using both in the same system is common (for example, relational as the main source and Redis for caching).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "“Schemaless” is not “modelless”",
        texto:
          'The schema does not disappear: it moves from the database into your code, and documents with different shapes become production bugs. Validate on input and in the database (Mongoose or a server-side schema). Watch out for **operator injection** too: if `req.body.email` arrives as `{ "$ne": null }` and is passed straight into the filter, the query matches any user (see L123).',
      },
    ],
    armadilhas: [
      "Thinking “schemaless” means no need to model or validate: inconsistent documents only show up when the code reads the wrong field.",
      "Passing `req.body` straight into the filter: an object with `$ne` or `$gt` changes the query (operator injection); validate types and require strings.",
      "Querying fields with no index: every query scans the whole collection, and the problem grows with the data.",
      "Embedding a list that only grows (comments, events) in one document: documents have a maximum size and get heavier to read and write.",
    ],
    autoteste: [
      {
        pergunta: "When do you embed and when do you reference in a document model?",
        resposta:
          "Embed what is read together and has a bounded size, such as an order’s items. Reference what is shared between documents, grows without limit or is updated independently.",
      },
      {
        pergunta: "What does Mongoose add to the official driver, and what is the cost?",
        resposta:
          "Schemas, type casting, validation, defaults and middleware. The cost is an extra abstraction layer, with its own API and behavior, on top of a driver that already delivers JavaScript objects.",
      },
    ],
  },
};
