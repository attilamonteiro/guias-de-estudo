import type { Pergunta } from "../../tipos";

// Q106 · ReBAC e Zanzibar
export const q106: Pergunta = {
  numero: 106,
  modulo: "autorizacao",
  metodo: "feynman",
  pt: {
    titulo: "ReBAC e Zanzibar",
    pergunta:
      "O que é ReBAC (autorização baseada em relacionamentos) e como sistemas inspirados no Zanzibar modelam permissões de documentos, pastas e organizações?",
    porqueEsteMetodo:
      "O ReBAC é fácil de entender como uma árvore genealógica, em que o acesso decorre de quem se relaciona com quem, e difícil de ver só em siglas. A analogia leva ao mecanismo (tuplas e consulta) e ao ponto em que a imagem para de valer: um grafo precisa estar sempre atualizado.",
    resposta30s:
      "O **ReBAC** decide o acesso pelo **grafo de relacionamentos** entre pessoas e coisas (“Ana é editora da pasta; a pasta contém o documento”), em vez de papéis fixos ou atributos soltos. Os sistemas inspirados no **Zanzibar** guardam **tuplas (objeto, relação, sujeito)**, descrevem num modelo como uma relação deriva de outras (herança por pasta, grupo ou organização) e respondem à consulta **check** (“este sujeito tem esta relação com este objeto?”). Ferramentas como **OpenFGA** e **SpiceDB** entregam isso, ao custo de manter um serviço de autorização e um grafo consistente com o banco.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense numa árvore genealógica: ninguém lhe dá uma permissão por escrito, mas, se você é filho de alguém, herda o que decorre dessa relação. No ReBAC, o acesso nasce do mesmo jeito, de quem se relaciona com quem: “Ana é editora da pasta Financeiro” e “a pasta contém o documento”. Quem é editor da pasta alcança o que está dentro, e se a relação desaparece, o acesso desaparece junto.",
        tecnico:
          "Os sistemas inspirados no **Zanzibar** (o sistema de autorização do Google, descrito em artigo público) guardam **tuplas** no formato (objeto, relação, sujeito), por exemplo `documento:balanco#leitor@usuario:ana`. O sujeito pode ser outro conjunto (`time:contabilidade#membro`), o que permite grupos e herança. Um **modelo** descreve como as relações se derivam: por exemplo, o leitor de um documento inclui os leitores da pasta-pai. A operação central é o **check**, “este sujeito tem esta relação com este objeto?”, resolvido percorrendo o grafo; há também operações para listar objetos e sujeitos. OpenFGA e SpiceDB são exemplos de ferramentas desse tipo.",
        limite:
          "A árvore genealógica é estática, e o grafo de permissões não: as relações mudam o tempo todo, e a resposta tem de refletir o presente. Um acesso revogado que ainda aparece por atraso de propagação, ou uma pasta nova que herda um leitor antigo, é falha de segurança. Além disso, o grafo só diz **quem se relaciona com quem**; regras como “só em horário comercial” não são relações.",
      },
      {
        tipo: "tabela",
        titulo: "Casos e como ficam em tuplas",
        colunas: ["Caso", "Como se modela", "Por que RBAC ou ABAC sofrem"],
        linhas: [
          [
            "Compartilhar um documento com uma pessoa",
            "Uma tupla: `leitor` do documento para o usuário",
            "Um papel por documento é inviável, e atributos não guardam “quem recebeu o convite”",
          ],
          [
            "Pastas e herança",
            "Tupla `pai` entre documento e pasta; o modelo diz que o leitor da pasta é leitor do que está dentro",
            "A herança em árvore vira regra espalhada ou cópia de permissões que envelhece",
          ],
          [
            "Grupos e times aninhados",
            "O sujeito da tupla é um conjunto, como os membros de um time; times podem conter times",
            "Papéis planos não representam bem o aninhamento",
          ],
          [
            "Organizações e multi-tenant",
            "O usuário é membro da organização, os recursos pertencem a ela e o modelo propaga as permissões",
            "O isolamento por tenant precisa ser repetido em cada checagem",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Como um check se resolve",
        etapas: [
          "Pergunta: `check(usuario:ana, leitor, documento:balanco)`",
          "O modelo diz que **leitor** do documento é quem foi dado como leitor direto **ou** é leitor do **pai** do documento",
          "Não há tupla direta entre Ana e o documento",
          "O sistema busca o pai do documento e encontra a tupla que liga `pasta:financeiro` como `pai` de `documento:balanco`",
          "Pergunta se Ana é leitora de `pasta:financeiro`: há uma tupla direta, então a resposta é **permitido**",
          "Se a tupla de Ana (ou a do pai) for removida, a resposta passa a **negado** sem tocar no documento",
        ],
      },
      {
        tipo: "codigo",
        titulo: "Tuplas de relacionamento",
        legenda: "JSON",
        codigo: `[
  { "user": "usuario:ana", "relation": "leitor", "object": "pasta:financeiro" },
  { "user": "pasta:financeiro", "relation": "pai", "object": "documento:balanco" },
  { "user": "time:contabilidade#membro", "relation": "editor", "object": "pasta:financeiro" }
]`,
        nota: "Formato semelhante ao do OpenFGA: os campos são `user`, `relation` e `object`, e os nomes dos tipos e das relações são definidos pelo seu modelo. A terceira tupla usa um conjunto como sujeito (`#membro`): todo membro do time é editor da pasta. Confira o formato exato na documentação da ferramenta escolhida.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Consistência e custo de adoção",
        texto:
          "A autorização vira um **serviço extra**, com armazenamento próprio, que precisa ficar consistente com o banco da aplicação: se você exclui o documento (ou tira a pessoa do time) e a tupla demora a sair, o acesso continua. O artigo do Zanzibar descreve o **problema do novo inimigo**: alguém é removido de uma pasta, e uma leitura desatualizada ainda lhe mostra o conteúdo novo; ele é tratado com **tokens de consistência** (os “zookies”), e cada ferramenta tem o seu mecanismo (confira a documentação). Planeje a modelagem do esquema, a escrita coordenada com o banco (transação ou outbox), a carga inicial das relações existentes, a latência e o cache do `check`, e as consultas de listagem (“que documentos a Ana pode ver?”), que custam mais que o `check`. Para poucos recursos e papéis estáveis, o RBAC basta.",
      },
    ],
    armadilhas: [
      "Tratar o grafo como uma cópia solta do banco: se a remoção da tupla atrasa ou falha, o acesso continua. Escreva a relação e a mudança de dados de forma coordenada e planeje a reconciliação.",
      "Modelar tudo como relação, inclusive regras que são atributos (horário, valor): o ReBAC não expressa bem condições de contexto. Combine com ABAC; algumas ferramentas oferecem condições.",
      "Esquecer a revogação: remover a tupla errada, ou não remover a do grupo, deixa a permissão herdada de pé. Teste “quem perde o acesso quando…?”.",
      "Grafos profundos ou com ciclos sem limite: consultas caras e laços. Pense na profundidade, no cache e no custo das consultas de listagem.",
    ],
    autoteste: [
      {
        pergunta: "Como o ReBAC faz um documento herdar as permissões da pasta?",
        resposta:
          "Com uma relação `pai` entre o documento e a pasta e uma regra no modelo: o leitor do documento é o leitor direto ou o leitor do pai. O `check` percorre o grafo e encontra a permissão pela pasta.",
      },
      {
        pergunta: "Quando o RBAC ou o ABAC bastam, e o ReBAC seria exagero?",
        resposta:
          "Com poucos recursos, papéis estáveis e sem compartilhamento objeto a objeto, o RBAC resolve. O ReBAC compensa quando a permissão depende da relação com cada objeto (compartilhar documento a documento, pastas, times aninhados, multi-tenant) em escala.",
      },
    ],
  },
  en: {
    titulo: "ReBAC and Zanzibar",
    pergunta:
      "What is ReBAC (relationship-based access control), and how do Zanzibar-inspired systems model permissions for documents, folders and organizations?",
    porqueEsteMetodo:
      "ReBAC is easy to grasp as a family tree, where access follows from who is related to whom, and hard to see from acronyms alone. The analogy leads to the mechanism (tuples and the query) and to the point where the picture stops holding: a graph has to stay up to date.",
    resposta30s:
      "**ReBAC** decides access from the **graph of relationships** between people and things (“Ana is an editor of the folder; the folder contains the document”), instead of fixed roles or loose attributes. **Zanzibar**-inspired systems store **tuples (object, relation, subject)**, describe in a model how one relation derives from others (inheritance through folders, groups or organizations) and answer the **check** query (“does this subject have this relation to this object?”). Tools such as **OpenFGA** and **SpiceDB** provide this, at the cost of running an authorization service and keeping its graph consistent with your database.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a family tree: nobody hands you a permission in writing, but if you are someone’s child, you inherit what follows from that relationship. In ReBAC, access arises the same way, from who is related to whom: “Ana is an editor of the Finance folder” and “the folder contains the document”. Whoever edits the folder reaches what is inside, and if the relationship disappears, the access disappears with it.",
        tecnico:
          "**Zanzibar**-inspired systems (Zanzibar is Google’s authorization system, described in a public paper) store **tuples** shaped as (object, relation, subject), for example `document:balance#viewer@user:ana`. The subject can be another set (`team:accounting#member`), which allows groups and inheritance. A **model** describes how relations derive from one another: for example, a document’s viewers include the viewers of its parent folder. The central operation is **check**, “does this subject have this relation to this object?”, resolved by walking the graph; there are also operations to list objects and subjects. OpenFGA and SpiceDB are examples of such tools.",
        limite:
          "A family tree is static, and a permission graph is not: relationships change all the time, and the answer must reflect the present. A revoked access that still shows up because of propagation delay, or a new folder that inherits an old viewer, is a security flaw. Also, the graph only says **who is related to whom**; rules such as “only during business hours” are not relationships.",
      },
      {
        tipo: "tabela",
        titulo: "Cases and how they look as tuples",
        colunas: ["Case", "How it is modeled", "Why RBAC or ABAC struggle"],
        linhas: [
          [
            "Sharing a document with one person",
            "One tuple: `viewer` of the document for the user",
            "A role per document is unworkable, and attributes do not record “who received the invitation”",
          ],
          [
            "Folders and inheritance",
            "A `parent` tuple between document and folder; the model says the folder’s viewer is a viewer of what is inside",
            "Tree inheritance becomes scattered rules or copied permissions that go stale",
          ],
          [
            "Nested groups and teams",
            "The tuple’s subject is a set, such as a team’s members; teams can contain teams",
            "Flat roles do not represent nesting well",
          ],
          [
            "Organizations and multi-tenant",
            "The user is a member of the organization, resources belong to it and the model propagates permissions",
            "Tenant isolation has to be repeated in every check",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "How a check is resolved",
        etapas: [
          "Question: `check(user:ana, viewer, document:balance)`",
          "The model says a document’s **viewer** is someone given as a direct viewer **or** a viewer of the document’s **parent**",
          "There is no direct tuple between Ana and the document",
          "The system looks up the document’s parent and finds the tuple linking `folder:finance` as `parent` of `document:balance`",
          "It asks whether Ana is a viewer of `folder:finance`: there is a direct tuple, so the answer is **allowed**",
          "If Ana’s tuple (or the parent’s) is removed, the answer becomes **denied** without touching the document",
        ],
      },
      {
        tipo: "codigo",
        titulo: "Relationship tuples",
        legenda: "JSON",
        codigo: `[
  { "user": "user:ana", "relation": "viewer", "object": "folder:finance" },
  { "user": "folder:finance", "relation": "parent", "object": "document:balance" },
  { "user": "team:accounting#member", "relation": "editor", "object": "folder:finance" }
]`,
        nota: "A format similar to OpenFGA’s: the fields are `user`, `relation` and `object`, and the names of types and relations are defined by your model. The third tuple uses a set as the subject (`#member`): every member of the team is an editor of the folder. Check the exact format in the documentation of the tool you choose.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Consistency and cost of adoption",
        texto:
          "Authorization becomes an **extra service**, with its own storage, that must stay consistent with the application’s database: if you delete the document (or remove the person from the team) and the tuple is slow to go, access continues. The Zanzibar paper describes the **new enemy problem**: someone is removed from a folder, and a stale read still shows them new content; it is handled with **consistency tokens** (the “zookies”), and each tool has its own mechanism (check the documentation). Plan for schema modeling, writes coordinated with the database (a transaction or an outbox), the initial load of existing relationships, `check` latency and caching, and listing queries (“which documents can Ana see?”), which cost more than `check`. For few resources and stable roles, RBAC is enough.",
      },
    ],
    armadilhas: [
      "Treating the graph as a loose copy of the database: if the tuple removal is delayed or fails, access continues. Write the relationship and the data change in a coordinated way and plan for reconciliation.",
      "Modeling everything as a relationship, including rules that are attributes (time, amount): ReBAC does not express context conditions well. Combine it with ABAC; some tools offer conditions.",
      "Forgetting revocation: removing the wrong tuple, or not removing the group’s, leaves the inherited permission standing. Test “who loses access when…?”.",
      "Deep or cyclic graphs with no limit: expensive queries and loops. Think about depth, caching and the cost of listing queries.",
    ],
    autoteste: [
      {
        pergunta: "How does ReBAC make a document inherit the folder’s permissions?",
        resposta:
          "With a `parent` relation between the document and the folder and a rule in the model: a document’s viewer is the direct viewer or a viewer of the parent. The `check` walks the graph and finds the permission through the folder.",
      },
      {
        pergunta: "When are RBAC or ABAC enough, and ReBAC overkill?",
        resposta:
          "With few resources, stable roles and no object-by-object sharing, RBAC does the job. ReBAC pays off when the permission depends on the relationship to each object (sharing document by document, folders, nested teams, multi-tenant) at scale.",
      },
    ],
  },
};
