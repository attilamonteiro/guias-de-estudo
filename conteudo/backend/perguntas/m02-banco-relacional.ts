import type { Pergunta } from "../../tipos";

// M02 · Banco de dados relacional
export const m02: Pergunta = {
  numero: 202,
  modulo: "mentorcruise",
  metodo: "feynman",
  pt: {
    titulo: "Banco de dados relacional",
    pergunta: "Você pode explicar o que é um banco de dados relacional e como ele funciona?",
    porqueEsteMetodo:
      "Há muitas peças (tabelas, chaves, SQL, índices, transações) e uma boa explicação as amarra numa imagem só. Uma analogia concreta, o mecanismo real e o ponto em que a imagem falha deixam claro o que o banco faz por você.",
    resposta30s:
      "Um banco **relacional** guarda dados em **tabelas** (linhas e colunas com tipos definidos) e liga uma tabela à outra por **chaves**: a **primária** identifica a linha, a **estrangeira** aponta para outra tabela. Você consulta em **SQL**, dizendo o que quer; o **planejador** decide como obter, usando **índices**. As **transações** (ACID) mantêm tudo consistente mesmo com falhas e acessos simultâneos.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine a secretaria de um clube de bairro com três cadernos. O de sócios dá a cada pessoa um número e anota nome e e-mail. O de aulas lista cada aula com um código. O de inscrições só guarda pares: número do sócio e código da aula. O telefone de alguém fica em um único lugar, o caderno de sócios; nas inscrições aparece apenas o número. Para saber quem faz natação, a secretária percorre as inscrições dessa aula e usa cada número para buscar o nome no caderno de sócios. Ela também recusa duas coisas: repetir um número de sócio e inscrever um número que não existe.",
        tecnico:
          "Os cadernos são **tabelas**; cada anotação é uma **linha** e cada informação, uma **coluna** com tipo definido. O número do sócio é a **chave primária** (identifica a linha sem repetir); na inscrição ele aparece como **chave estrangeira**, e o banco recusa um valor que não exista na tabela apontada. O **esquema** descreve tabelas, tipos e regras. A consulta em **SQL** é declarativa: você descreve o resultado (um `JOIN` combina tabelas pelas chaves) e o **planejador** escolhe o caminho, usando **índices** quando existem (veja Q07). As **transações** (veja Q08) fazem um grupo de mudanças valer por inteiro ou por nada, mesmo com falhas ou acessos simultâneos.",
        limite:
          "A secretária só segue as regras se lembrar delas; o banco as aplica sempre, para qualquer cliente que se conecte. Os cadernos atendem uma pessoa por vez, enquanto o banco atende muitas ao mesmo tempo, com isolamento entre elas. E o banco mantém índices (o fichário remissivo) e um registro das mudanças para sobreviver a quedas, o que o caderno não tem.",
      },
      {
        tipo: "tabela",
        titulo: "O vocabulário, no exemplo do clube",
        colunas: ["Conceito", "O que é", "No exemplo"],
        linhas: [
          [
            "Tabela",
            "Conjunto de linhas com as mesmas colunas, sobre um tipo de coisa",
            "`socio`, `aula`, `inscricao`",
          ],
          ["Linha", "Um registro, um fato", "Uma pessoa; uma inscrição"],
          ["Coluna", "Um atributo, com tipo definido", "`nome`, `email`"],
          ["Esquema", "A definição das tabelas, dos tipos e das regras", "Os `CREATE TABLE` do clube"],
          ["Chave primária", "Coluna (ou colunas) que identifica a linha de forma única", "O número do sócio"],
          [
            "Chave estrangeira",
            "Coluna que aponta para a chave de outra tabela; o banco confere que o valor existe lá",
            "`socio_id` em `inscricao`",
          ],
          [
            "Índice",
            "Estrutura auxiliar que acelera buscas, ao custo de espaço e de escrita (veja Q07)",
            "O fichário por nome do sócio",
          ],
          ["Join", "Combina linhas de tabelas diferentes pelas chaves", "Cruzar inscrições com sócios"],
          [
            "Transação",
            "Grupo de operações que vale por inteiro ou por nada (veja Q08)",
            "Inscrever a pessoa e lançar a taxa juntos",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "O caminho de uma consulta SQL",
        etapas: [
          "O cliente envia o texto SQL",
          "O analisador confere a sintaxe e se as tabelas e colunas existem",
          "O planejador estima custos e escolhe um plano: índice ou leitura completa, ordem dos joins",
          "O executor lê as páginas necessárias, da memória ou do disco",
          "As linhas do resultado voltam ao cliente",
        ],
        nota: "Nas escritas, a maioria dos bancos também registra a mudança num log antes de confirmar; é isso que permite recuperar-se de uma queda.",
      },
      {
        tipo: "codigo",
        titulo: "O clube em SQL",
        legenda: "sql",
        codigo:
          "CREATE TABLE socio (\n  id    integer PRIMARY KEY,\n  nome  text NOT NULL,\n  email text UNIQUE\n);\nCREATE TABLE aula (\n  id   integer PRIMARY KEY,\n  nome text NOT NULL\n);\nCREATE TABLE inscricao (\n  socio_id integer REFERENCES socio (id),\n  aula_id  integer REFERENCES aula (id),\n  PRIMARY KEY (socio_id, aula_id)\n);\n\n-- Quem está inscrito em natação?\nSELECT s.nome\nFROM inscricao i\nJOIN socio s ON s.id = i.socio_id\nJOIN aula  a ON a.id = i.aula_id\nWHERE a.nome = 'Natação';",
        nota: "A sintaxe é próxima da do PostgreSQL; detalhes variam de um banco para outro.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "As duas ideias que carregam o modelo",
        texto:
          "Guarde cada fato uma única vez e ligue os dados por chaves, para que corrigir um telefone seja mudar um lugar só. E diga ao banco o que você quer, não como buscar: o planejador escolhe o caminho.",
      },
    ],
    armadilhas: [
      "Explicar “relacional” como “as tabelas se relacionam”: o termo vem de relação, o nome teórico de uma tabela. As chaves estrangeiras são uma consequência, não a origem do nome.",
      "Achar que o SQL manda no como: a mesma consulta pode ganhar planos diferentes conforme índices e estatísticas.",
      "Supor que toda chave estrangeira ganha um índice sozinha: em alguns bancos (como o PostgreSQL) a coluna que referencia fica sem índice, e joins e exclusões em cascata podem ficar lentos.",
      "Tratar o banco como um arquivo passivo e deixar todas as regras só na aplicação: `NOT NULL`, `UNIQUE` e chaves estrangeiras protegem os dados de qualquer cliente.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre chave primária e chave estrangeira?",
        resposta:
          "A primária identifica de forma única cada linha da própria tabela. A estrangeira é uma coluna que guarda a chave de outra tabela, e o banco garante que o valor existe lá.",
      },
      {
        pergunta: "Por que se diz que o SQL é declarativo?",
        resposta:
          "Porque você descreve o resultado que quer, e não os passos para obtê-lo. Quem decide se usa índice ou leitura completa, e em que ordem faz os joins, é o planejador.",
      },
      {
        pergunta: "O que o planejador de consultas usa para escolher um plano?",
        resposta:
          "Estatísticas sobre os dados, os índices disponíveis e uma estimativa de custo de cada plano possível. Estatísticas desatualizadas podem levar a planos ruins.",
      },
    ],
  },
  en: {
    titulo: "Relational database",
    pergunta: "Can you explain what a relational database is and how it works?",
    porqueEsteMetodo:
      "There are many pieces (tables, keys, SQL, indexes, transactions) and a good explanation ties them into a single picture. A concrete analogy, the real mechanism and the point where the picture fails make clear what the database does for you.",
    resposta30s:
      "A **relational** database stores data in **tables** (rows and columns with defined types) and links one table to another through **keys**: the **primary** key identifies the row, the **foreign** key points to another table. You query in **SQL**, saying what you want; the **planner** decides how to get it, using **indexes**. **Transactions** (ACID) keep everything consistent despite failures and concurrent access.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Picture the front desk of a neighborhood club with three notebooks. The members notebook gives each person a number and records name and email. The lessons notebook lists each lesson with a code. The enrollments notebook holds only pairs: member number and lesson code. Someone’s phone number lives in a single place, the members notebook; enrollments show only the number. To find out who takes swimming, the clerk goes through that lesson’s enrollments and uses each number to look up the name in the members notebook. The clerk also refuses two things: repeating a member number and enrolling a number that does not exist.",
        tecnico:
          "The notebooks are **tables**; each entry is a **row** and each piece of information is a **column** with a defined type. The member number is the **primary key** (it identifies the row without repeating); in the enrollment it appears as a **foreign key**, and the database rejects a value that does not exist in the table it points to. The **schema** describes tables, types and rules. A query in **SQL** is declarative: you describe the result (a `JOIN` combines tables through their keys) and the **planner** picks the path, using **indexes** when they exist (see Q07). **Transactions** (see Q08) make a group of changes apply entirely or not at all, even with failures or concurrent access.",
        limite:
          "The clerk follows the rules only if she remembers them; the database enforces them always, for any client that connects. Notebooks serve one person at a time, while the database serves many at once, with isolation between them. And the database keeps indexes (the cross-reference cards) and a record of changes so it can survive crashes, which a notebook does not have.",
      },
      {
        tipo: "tabela",
        titulo: "The vocabulary, in the club example",
        colunas: ["Concept", "What it is", "In the example"],
        linhas: [
          ["Table", "A set of rows with the same columns, about one kind of thing", "`member`, `lesson`, `enrollment`"],
          ["Row", "One record, one fact", "A person; an enrollment"],
          ["Column", "An attribute with a defined type", "`name`, `email`"],
          ["Schema", "The definition of the tables, types and rules", "The club’s `CREATE TABLE` statements"],
          ["Primary key", "Column (or columns) that uniquely identifies the row", "The member number"],
          [
            "Foreign key",
            "Column that points to the key of another table; the database checks that the value exists there",
            "`member_id` in `enrollment`",
          ],
          [
            "Index",
            "Auxiliary structure that speeds up lookups, at the cost of space and writes (see Q07)",
            "The cross-reference cards by member name",
          ],
          ["Join", "Combines rows from different tables through their keys", "Matching enrollments with members"],
          [
            "Transaction",
            "A group of operations that applies entirely or not at all (see Q08)",
            "Enrolling the person and posting the fee together",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "The path of a SQL query",
        etapas: [
          "The client sends the SQL text",
          "The parser checks the syntax and that the tables and columns exist",
          "The planner estimates costs and picks a plan: index or full scan, join order",
          "The executor reads the pages it needs, from memory or disk",
          "The result rows go back to the client",
        ],
        nota: "For writes, most databases also record the change in a log before confirming; that is what lets them recover from a crash.",
      },
      {
        tipo: "codigo",
        titulo: "The club in SQL",
        legenda: "sql",
        codigo:
          "CREATE TABLE member (\n  id    integer PRIMARY KEY,\n  name  text NOT NULL,\n  email text UNIQUE\n);\nCREATE TABLE lesson (\n  id   integer PRIMARY KEY,\n  name text NOT NULL\n);\nCREATE TABLE enrollment (\n  member_id integer REFERENCES member (id),\n  lesson_id integer REFERENCES lesson (id),\n  PRIMARY KEY (member_id, lesson_id)\n);\n\n-- Who is enrolled in swimming?\nSELECT m.name\nFROM enrollment e\nJOIN member m ON m.id = e.member_id\nJOIN lesson l ON l.id = e.lesson_id\nWHERE l.name = 'Swimming';",
        nota: "The syntax is close to PostgreSQL’s; details vary from one database to another.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The two ideas that carry the model",
        texto:
          "Store each fact once and link data through keys, so fixing a phone number means changing a single place. And tell the database what you want, not how to fetch it: the planner picks the path.",
      },
    ],
    armadilhas: [
      "Explaining “relational” as “the tables relate to each other”: the term comes from relation, the theoretical name for a table. Foreign keys are a consequence, not the origin of the name.",
      "Thinking SQL controls the how: the same query can get different plans depending on indexes and statistics.",
      "Assuming every foreign key gets an index automatically: in some databases (such as PostgreSQL) the referencing column has no index, and joins and cascading deletes can become slow.",
      "Treating the database as a passive file and leaving all rules to the application: `NOT NULL`, `UNIQUE` and foreign keys protect the data from any client.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between a primary key and a foreign key?",
        resposta:
          "The primary key uniquely identifies each row in its own table. The foreign key is a column holding the key of another table, and the database guarantees the value exists there.",
      },
      {
        pergunta: "Why is SQL called declarative?",
        resposta:
          "Because you describe the result you want, not the steps to get it. The planner decides whether to use an index or a full scan, and in what order to join.",
      },
      {
        pergunta: "What does the query planner use to choose a plan?",
        resposta:
          "Statistics about the data, the available indexes and a cost estimate for each possible plan. Outdated statistics can lead to bad plans.",
      },
    ],
  },
};
