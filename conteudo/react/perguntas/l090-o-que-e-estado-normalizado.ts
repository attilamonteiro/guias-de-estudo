import type { Pergunta } from "../../tipos";

// L90 · O que é estado normalizado
export const l090: Pergunta = {
  numero: 90,
  modulo: "linkedin-estado",
  metodo: "design",
  pt: {
    titulo: "O que é estado normalizado",
    pergunta: "O que é estado normalizado?",
    porqueEsteMetodo:
      "O formato do estado é uma decisão de projeto, e é fácil errá-la olhando só para a tela. Partir dos requisitos (o que se repete, o que muda e como se lê) leva à solução e mostra o preço dela.",
    resposta30s:
      "**Estado normalizado** é guardar cada tipo de entidade numa **tabela indexada por id** (`entities`) mais uma **lista de ids** para a ordem, ligando as entidades por **referência (id)** em vez de aninhar cópias, como num banco relacional. Assim cada dado existe em **um só lugar**: atualizar é mexer num ponto, sem duplicação nem inconsistência, e buscar por id é direto. O custo é a leitura, que precisa de **seletores** para remontar os dados; `createEntityAdapter` (Redux Toolkit) e o `normalizr` ajudam.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Imagine um blog: posts, autores e comentários vindos de uma API. O mesmo autor aparece em muitos posts e comentários; ao corrigir o nome dele, **todas** as telas precisam mostrar o nome novo; a tela de um post abre por id; há listas longas, atualizadas com frequência.",
          },
          {
            titulo: "2. O problema do formato aninhado",
            texto:
              "A API devolve `posts: [{ id, titulo, autor: { id, nome }, comentarios: [{ id, texto, autor: { id, nome } }] }]`. O autor está **copiado** em cada lugar: mudar o nome exige achar e alterar todas as cópias (esqueça uma e a tela se contradiz); achar um comentário exige varrer a lista; e uma atualização imutável profunda recria todos os níveis acima dele, gerando referências novas e renders a mais.",
          },
          {
            titulo: "3. Decisão central: tabelas por id e relações por referência",
            texto:
              "Cada tipo de entidade vira uma **tabela indexada por id** (`entities`) mais uma **lista de ids** (`ids`) que guarda a ordem. Quem se relaciona com outra entidade guarda só o **id** dela (`autorId`), nunca uma cópia. É a ideia de chave estrangeira de um banco relacional.",
          },
          {
            titulo: "4. Leitura: seletores que remontam",
            texto:
              "A tela quer o post **com** o autor: um seletor junta as peças (`usuarios.entities[post.autorId]`). Use seletores memoizados (`createSelector`) para não criar objetos novos a cada leitura, o que faria o componente renderizar sem necessidade (veja L100).",
          },
          {
            titulo: "5. Escrita: um dado, um lugar",
            texto:
              "Alterar o nome do autor é mexer em **uma** entidade; adicionar ou remover é atualizar a tabela e a lista de ids. No Redux Toolkit, o `createEntityAdapter` entrega esse formato (`ids` e `entities`), operações prontas (`addOne`, `upsertMany`, `updateOne`, `removeOne`) e seletores (`selectAll`, `selectById`), com `selectId` e `sortComparer` configuráveis.",
          },
          {
            titulo: "6. Entrada de dados e ferramentas",
            texto:
              "Normalize na **borda**: quando a resposta da API chega, converta-a para o formato por id. Faça à mão quando o formato é simples, ou use o **normalizr**, que descreve o aninhamento por esquemas e devolve `entities` e `result`. Daí em diante o resto do app só conhece o formato normalizado.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O mesmo dado, aninhado e normalizado",
        legenda: "JavaScript",
        codigo: `// Aninhado: o autor está copiado em cada post
const aninhado = [
  { id: "p1", titulo: "Olá", autor: { id: "u1", nome: "Ana" } },
  { id: "p2", titulo: "Hooks", autor: { id: "u1", nome: "Ana" } },
];

// Normalizado: uma tabela por tipo, relações por id
const normalizado = {
  usuarios: { ids: ["u1"], entities: { u1: { id: "u1", nome: "Ana" } } },
  posts: {
    ids: ["p1", "p2"],
    entities: {
      p1: { id: "p1", titulo: "Olá", autorId: "u1" },
      p2: { id: "p2", titulo: "Hooks", autorId: "u1" },
    },
  },
};

// Leitura: o seletor remonta o que a tela precisa
const autorDoPost = (s, postId) => s.usuarios.entities[s.posts.entities[postId].autorId];`,
        nota: "`ids` e `entities` são os nomes que o `createEntityAdapter` usa. Para renomear a Ana, basta alterar `usuarios.entities.u1`; os dois posts passam a mostrar o nome novo.",
      },
      {
        tipo: "tabela",
        titulo: "Ganhos e custos",
        colunas: ["Aspecto", "Aninhado", "Normalizado"],
        linhas: [
          ["Atualizar um dado repetido", "Alterar cada cópia; esquecer uma gera inconsistência", "Alterar um só ponto"],
          ["Buscar por id", "Varrer listas e níveis", "Acesso direto em `entities[id]`"],
          ["Ler para a tela", "Já vem pronto", "Exige seletores que remontam as relações"],
          [
            "Renders",
            "Uma mudança profunda cria referências novas em toda a cadeia de pais",
            "Cada componente seleciona só a entidade que usa e renderiza quando ela muda",
          ],
          [
            "Esforço de entrada",
            "Nenhum: usa a resposta da API como veio",
            "Normalizar ao receber (à mão ou com `normalizr`)",
          ],
          [
            "Boa escolha para",
            "Dado pequeno, lido uma vez, sem entidades compartilhadas",
            "Entidades repetidas, relações, listas grandes e atualizações frequentes",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Normalize quando o mesmo dado aparece em **mais de um lugar**, as entidades se **relacionam** e há **atualizações frequentes** ou busca por id em listas grandes. Mantenha aninhado o que é pequeno, lido uma vez e sem identidade compartilhada. Pense como num banco relacional: uma tabela por tipo, chaves para as relações e um passo de leitura (a “junção”) quando a tela precisar do conjunto.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O preço da normalização",
        texto:
          'Leitura mais trabalhosa, seletores para manter e a conversão na entrada. Cuidado com **referências penduradas**: ao remover um autor, os posts que apontam para ele precisam ser tratados. Os ids devem ser únicos **por tipo**, e as chaves de um objeto são sempre texto (`1` e `"1"` são a mesma chave). Se os dados vêm de uma biblioteca de cache de servidor (TanStack Query, RTK Query), o cache dela é por consulta e, por padrão, não é normalizado: normalizar por cima, à mão, só vale a pena quando há entidades realmente compartilhadas entre consultas.',
      },
    ],
    armadilhas: [
      "Normalizar por reflexo dados pequenos, lidos uma vez ou que já estão num cache de servidor: complexidade sem ganho.",
      "Guardar a versão aninhada **e** a normalizada: duas verdades que divergem.",
      "Esquecer o que acontece com as referências ao remover uma entidade, ou misturar ids de tipos diferentes na mesma tabela.",
      "Montar objetos novos dentro de `useSelector` sem memoizar: cada leitura devolve outra referência e o componente renderiza a cada mudança do store.",
    ],
    autoteste: [
      {
        pergunta: "Que problemas do estado aninhado a normalização resolve?",
        resposta:
          "A duplicação do mesmo dado, a atualização em vários pontos (com risco de inconsistência), a busca por id que obriga a varrer listas e os renders desnecessários causados por atualizações profundas.",
      },
      {
        pergunta: "O que o `createEntityAdapter` entrega?",
        resposta:
          "O formato `{ ids, entities }`, reducers prontos (`addOne`, `upsertMany`, `updateOne`, `removeOne` etc.) e seletores (`selectAll`, `selectById` etc.), com `selectId` e `sortComparer` para configurar a chave e a ordem.",
      },
    ],
  },
  en: {
    titulo: "What normalized state is",
    pergunta: "What is normalized state?",
    porqueEsteMetodo:
      "State shape is a design decision, and it is easy to get wrong when you look only at the screen. Starting from the requirements (what repeats, what changes and how it is read) leads to the solution and shows its price.",
    resposta30s:
      "**Normalized state** means storing each entity type in a **table indexed by id** (`entities`) plus a **list of ids** for ordering, linking entities by **reference (id)** instead of nesting copies, like a relational database. Each piece of data then lives in **one place**: updating touches one spot, with no duplication or inconsistency, and lookup by id is direct. The cost is reading, which needs **selectors** to reassemble the data; `createEntityAdapter` (Redux Toolkit) and `normalizr` help.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "Picture a blog: posts, authors and comments coming from an API. The same author appears in many posts and comments; when that author’s name is corrected, **every** screen must show the new name; a post screen opens by id; there are long lists, updated often.",
          },
          {
            titulo: "2. The problem with the nested shape",
            texto:
              "The API returns `posts: [{ id, title, author: { id, name }, comments: [{ id, text, author: { id, name } }] }]`. The author is **copied** everywhere: changing the name means finding and editing every copy (miss one and the screen contradicts itself); finding a comment means scanning the list; and a deep immutable update recreates every level above it, producing new references and extra renders.",
          },
          {
            titulo: "3. Central decision: tables by id and relations by reference",
            texto:
              "Each entity type becomes a **table indexed by id** (`entities`) plus a **list of ids** (`ids`) that keeps the order. Whoever relates to another entity stores only its **id** (`authorId`), never a copy. It is the foreign-key idea from a relational database.",
          },
          {
            titulo: "4. Reading: selectors that reassemble",
            texto:
              "The screen wants the post **with** its author: a selector joins the pieces (`users.entities[post.authorId]`). Use memoized selectors (`createSelector`) so reads do not create new objects every time, which would make the component render needlessly (see L100).",
          },
          {
            titulo: "5. Writing: one fact, one place",
            texto:
              "Changing the author’s name touches **one** entity; adding or removing updates the table and the list of ids. In Redux Toolkit, `createEntityAdapter` delivers this shape (`ids` and `entities`), ready-made operations (`addOne`, `upsertMany`, `updateOne`, `removeOne`) and selectors (`selectAll`, `selectById`), with configurable `selectId` and `sortComparer`.",
          },
          {
            titulo: "6. Data entry and tools",
            texto:
              "Normalize at the **edge**: when the API response arrives, convert it to the by-id shape. Do it by hand when the shape is simple, or use **normalizr**, which describes the nesting with schemas and returns `entities` and `result`. From then on the rest of the app only knows the normalized shape.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The same data, nested and normalized",
        legenda: "JavaScript",
        codigo: `// Nested: the author is copied into every post
const nested = [
  { id: "p1", title: "Hello", author: { id: "u1", name: "Ana" } },
  { id: "p2", title: "Hooks", author: { id: "u1", name: "Ana" } },
];

// Normalized: one table per type, relations by id
const normalized = {
  users: { ids: ["u1"], entities: { u1: { id: "u1", name: "Ana" } } },
  posts: {
    ids: ["p1", "p2"],
    entities: {
      p1: { id: "p1", title: "Hello", authorId: "u1" },
      p2: { id: "p2", title: "Hooks", authorId: "u1" },
    },
  },
};

// Reading: the selector reassembles what the screen needs
const authorOfPost = (s, postId) => s.users.entities[s.posts.entities[postId].authorId];`,
        nota: "`ids` and `entities` are the names `createEntityAdapter` uses. To rename Ana, just change `users.entities.u1`; both posts then show the new name.",
      },
      {
        tipo: "tabela",
        titulo: "Gains and costs",
        colunas: ["Aspect", "Nested", "Normalized"],
        linhas: [
          ["Updating a repeated fact", "Change every copy; missing one causes inconsistency", "Change a single spot"],
          ["Lookup by id", "Scan lists and levels", "Direct access with `entities[id]`"],
          ["Reading for the screen", "Comes ready-made", "Needs selectors that reassemble the relations"],
          [
            "Renders",
            "A deep change creates new references all the way up the parent chain",
            "Each component selects only the entity it uses and renders when that one changes",
          ],
          [
            "Intake effort",
            "None: use the API response as it came",
            "Normalize on arrival (by hand or with `normalizr`)",
          ],
          [
            "Good choice for",
            "Small data, read once, with no shared entities",
            "Repeated entities, relations, large lists and frequent updates",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Normalize when the same data shows up in **more than one place**, entities **relate** to each other and there are **frequent updates** or lookups by id in large lists. Keep nested what is small, read once and without shared identity. Think like a relational database: one table per type, keys for relations and a read step (the “join”) when the screen needs the whole picture.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The price of normalization",
        texto:
          'Harder reads, selectors to maintain and a conversion on the way in. Watch for **dangling references**: when an author is removed, the posts pointing to that author need handling. Ids must be unique **per type**, and object keys are always text (`1` and `"1"` are the same key). If your data comes from a server-cache library (TanStack Query, RTK Query), its cache is per query and, by default, not normalized: normalizing on top by hand only pays off when entities are truly shared across queries.',
      },
    ],
    armadilhas: [
      "Normalizing out of habit data that is small, read once or already in a server cache: complexity with no gain.",
      "Keeping the nested version **and** the normalized one: two truths that drift apart.",
      "Forgetting what happens to references when an entity is removed, or mixing ids of different types in the same table.",
      "Building new objects inside `useSelector` without memoizing: every read returns another reference and the component renders on every store change.",
    ],
    autoteste: [
      {
        pergunta: "Which problems of nested state does normalization solve?",
        resposta:
          "Duplication of the same data, updates in several places (with a risk of inconsistency), lookups by id that force you to scan lists, and needless renders caused by deep updates.",
      },
      {
        pergunta: "What does `createEntityAdapter` provide?",
        resposta:
          "The `{ ids, entities }` shape, ready-made reducers (`addOne`, `upsertMany`, `updateOne`, `removeOne` and so on) and selectors (`selectAll`, `selectById` and so on), with `selectId` and `sortComparer` to configure the key and the order.",
      },
    ],
  },
};
