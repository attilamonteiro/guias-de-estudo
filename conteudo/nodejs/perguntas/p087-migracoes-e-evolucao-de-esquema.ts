import type { Pergunta } from "../../tipos";

// P87 · Migrações e evolução de esquema
export const p087: Pergunta = {
  numero: 787,
  modulo: "pawanmkr-resiliencia",
  metodo: "playbook",
  pt: {
    titulo: "Migrações e evolução de esquema",
    pergunta: "Como os ORMs lidam com migrações e versionamento de banco de dados?",
    porqueEsteMetodo:
      "Migrar um esquema em produção é um procedimento em que a ordem dos passos decide se há parada ou perda de dados. Um playbook mostra primeiro como a ferramenta versiona e aplica, e depois como mudar sem quebrar a versão do código que ainda está no ar.",
    resposta30s:
      "Os ORMs e as ferramentas de migração tratam o esquema como código: cada mudança vira uma **migração versionada e ordenada** no repositório (`up` e, às vezes, `down`), e uma **tabela de controle** no próprio banco registra o que já foi aplicado, para rodar só as pendentes, em ordem, no deploy. Revise o SQL gerado e escreva migrações **compatíveis com a versão antiga e a nova** do código (expandir e contrair), preenchendo dados em lotes e evitando bloqueios longos. O mesmo cuidado vale para contratos de API e de eventos.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: como a migração funciona e como aplicá-la bem",
        passos: [
          {
            titulo: "Versione cada mudança",
            texto:
              "Uma mudança, um arquivo, com nome ordenado (data e hora ou número), no repositório e na revisão de código como qualquer outro código. Várias ferramentas guardam um checksum e reclamam se um arquivo já aplicado for alterado. Sinal de acerto: ninguém altera banco “na mão”. Se errou, crie outra migração.",
          },
          {
            titulo: "Deixe a ferramenta controlar o que já rodou",
            texto:
              "Ela cria no próprio banco uma tabela de controle, compara a pasta de migrações com ela, aplica as pendentes em ordem e registra cada uma, de preferência com um bloqueio para que duas execuções não se atropelem. No PostgreSQL, um erro no meio de uma migração em transação desfaz tudo; em bancos que confirmam implicitamente a cada comando de estrutura (como o MySQL), uma falha pode deixar o banco pela metade, então mantenha cada migração pequena.",
          },
          {
            titulo: "Gere se quiser, mas leia o SQL",
            texto:
              "O ORM compara o modelo com o banco e gera o SQL. Revise antes de aplicar: um renomear pode sair como remover e criar (perde dados), e mudar o tipo de uma coluna pode reescrever a tabela inteira. Não ligue a sincronização automática do ORM em produção.",
          },
          {
            titulo: "Rode no deploy, uma vez, antes da versão nova",
            texto:
              "Execute as migrações em uma etapa própria do pipeline (ou tarefa de implantação), e não no `start` de cada réplica: várias instâncias subindo juntas disputam a mesma tarefa. No CI, teste a sequência inteira contra um banco descartável, do zero e a partir do estado da versão anterior.",
          },
          {
            titulo: "Evite bloqueios e preencha em lotes",
            texto:
              "Adicione colunas como opcionais, crie índices sem bloquear escritas (no PostgreSQL, `CREATE INDEX CONCURRENTLY`, fora de transação) e preencha dados antigos em lotes pequenos, repetindo até acabar, em vez de um único `UPDATE` que segura bloqueios e infla o log. Defina um tempo máximo de espera por bloqueio para a migração desistir em vez de travar o tráfego.",
          },
          {
            titulo: "Planeje a volta",
            texto:
              "O `down` raramente desfaz de verdade: uma coluna removida já levou os dados. A volta real costuma ser uma nova migração para frente, mais um backup recente e uma restauração testada. Critério: antes de uma mudança destrutiva, saiba como voltar.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Expandir e contrair: renomear sem parada",
        etapas: [
          "Expandir: uma migração adiciona a coluna ou tabela nova, opcional, sem remover nada. A versão antiga do código segue funcionando.",
          "Uma versão nova do código passa a escrever nos dois lugares (o antigo e o novo), ainda lendo do antigo.",
          "Preencher: os dados existentes são copiados para o novo em lotes pequenos.",
          "Trocar a leitura para o novo, num deploy à parte, mantendo a escrita dupla por um tempo para poder recuar.",
          "Contrair: quando nenhuma versão no ar usa mais o antigo, outra migração o remove.",
        ],
        nota: "Cada etapa é um deploy ou uma migração separada. Se juntar tudo num passo só, a troca gradual de versões quebra: a versão antiga ainda lê a coluna que você removeu.",
      },
      {
        tipo: "codigo",
        titulo: "Renomear `fone` para `telefone`, em partes",
        legenda: "SQL",
        codigo:
          "-- 1. Expandir: coluna nova e opcional (a versão antiga ignora)\nALTER TABLE cliente ADD COLUMN telefone text;\n\n-- 2. Preencher em lotes pequenos (repita até afetar 0 linhas)\nUPDATE cliente SET telefone = fone\nWHERE id IN (\n  SELECT id FROM cliente WHERE telefone IS NULL AND fone IS NOT NULL ORDER BY id LIMIT 1000\n);\n\n-- 3. Índice sem bloquear escritas (PostgreSQL; fora de transação)\nCREATE INDEX CONCURRENTLY idx_cliente_telefone ON cliente (telefone);\n\n-- 4. Contrair: só depois que nenhuma versão do código lê `fone`\n-- ALTER TABLE cliente DROP COLUMN fone;",
        nota: "`CREATE INDEX CONCURRENTLY` não roda dentro de uma transação, e muitas ferramentas embrulham cada migração em uma: confira como a sua desliga isso para um arquivo.",
      },
      {
        tipo: "tabela",
        titulo: "Como as ferramentas versionam",
        colunas: ["Ferramenta", "Como versiona e aplica", "Observação"],
        linhas: [
          [
            "Prisma Migrate",
            "O modelo fica no `schema.prisma`; `prisma migrate dev` gera uma pasta com o SQL de cada migração e `prisma migrate deploy` aplica as pendentes em produção",
            "Dá para editar o SQL gerado antes de aplicar; o histórico fica numa tabela de controle própria",
          ],
          [
            "Sequelize",
            "Arquivos com `up` e `down`, escritos à mão com `queryInterface`, executados pela CLI (`sequelize-cli`)",
            "Registra as aplicadas numa tabela de controle (`SequelizeMeta`, por padrão)",
          ],
          [
            "TypeORM",
            "Pode gerar a migração comparando as entidades com o banco (`migration:generate`) ou você a escreve; `up` e `down`",
            "A opção `synchronize` automática não é para produção",
          ],
          [
            "Knex",
            "Arquivos JavaScript ou TypeScript com `up` e `down`, aplicados por `knex migrate:latest`",
            "É um query builder, não um ORM; registra numa tabela (`knex_migrations`)",
          ],
          [
            "Flyway (e Liquibase)",
            "SQL versionado pelo nome do arquivo (como `V2__criar_indice.sql`), independente de linguagem",
            "Roda como etapa de deploy, fora da aplicação Node.js",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Contratos também evoluem",
        texto:
          "O esquema de uma API ou de um evento muda como o do banco: **acrescente** campos opcionais em vez de mudar o significado dos existentes, nunca reaproveite um nome para outra coisa e faça os consumidores **ignorarem campos desconhecidos**. Para uma quebra real, publique uma versão nova e mantenha a antiga durante um período de depreciação (veja L52). Em bancos de documentos, o esquema vive no código: guarde uma versão no documento (por exemplo, `schemaVersion`) e migre sob demanda ou em lote.",
      },
    ],
    armadilhas: [
      "Editar uma migração já aplicada: nos outros ambientes ela já rodou, o histórico diverge e as ferramentas com checksum recusam. Crie outra migração.",
      "Aplicar o SQL gerado sem ler (um renomear pode sair como remover e criar, perdendo dados), ou ligar a sincronização automática do ORM em produção.",
      "Rodar uma migração que bloqueia a tabela (alteração pesada, índice sem `CONCURRENTLY`, preenchimento num `UPDATE` único) e travar a aplicação.",
      "Remover a coluna no mesmo deploy que deixa de usá-la: durante a troca gradual, a versão antiga do código ainda a lê e quebra.",
    ],
    autoteste: [
      {
        pergunta: "Como renomear uma coluna sem derrubar a aplicação?",
        resposta:
          "Expandindo e contraindo: adicione a coluna nova, grave nas duas, preencha os dados antigos em lotes, passe a ler da nova e só em outro deploy remova a antiga.",
      },
      {
        pergunta: "Para que serve a tabela de controle das migrações?",
        resposta:
          "Ela registra o que já foi aplicado naquele banco (e, em várias ferramentas, o checksum), para a ferramenta executar só as pendentes, em ordem, e detectar migrações alteradas ou ausentes.",
      },
    ],
  },
  en: {
    titulo: "Migrations and schema evolution",
    pergunta: "How do ORMs handle database migrations and versioning?",
    porqueEsteMetodo:
      "Migrating a schema in production is a procedure in which the order of the steps decides whether there is downtime or data loss. A playbook shows first how the tool versions and applies changes, then how to change things without breaking the code version that is still running.",
    resposta30s:
      "ORMs and migration tools treat the schema as code: each change becomes a **versioned, ordered migration** in the repository (`up` and sometimes `down`), and a **tracking table** in the database itself records what has been applied, so only the pending ones run, in order, at deploy time. Review the generated SQL and write migrations that are **compatible with both the old and the new** code version (expand and contract), backfilling data in batches and avoiding long locks. The same care applies to API and event contracts.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: how a migration works and how to apply it well",
        passos: [
          {
            titulo: "Version every change",
            texto:
              "One change, one file, with an ordered name (timestamp or number), in the repository and in code review like any other code. Several tools store a checksum and complain if an already applied file is edited. A sign of success: nobody changes the database by hand. If you got it wrong, create another migration.",
          },
          {
            titulo: "Let the tool track what has run",
            texto:
              "It creates a tracking table in the database itself, compares the migrations folder against it, applies the pending ones in order and records each one, preferably with a lock so two runs do not trample each other. In PostgreSQL, an error in the middle of a migration inside a transaction rolls everything back; in databases that commit implicitly on every schema statement (such as MySQL), a failure can leave the database half-changed, so keep each migration small.",
          },
          {
            titulo: "Generate if you like, but read the SQL",
            texto:
              "The ORM compares the model with the database and generates the SQL. Review it before applying: a rename can come out as drop and create (data is lost), and changing a column’s type can rewrite the whole table. Do not turn on the ORM’s automatic synchronization in production.",
          },
          {
            titulo: "Run at deploy, once, before the new version",
            texto:
              "Run migrations in their own pipeline step (or deployment task), not in the `start` of every replica: several instances starting together compete for the same job. In CI, test the whole sequence against a disposable database, from scratch and from the previous version’s state.",
          },
          {
            titulo: "Avoid locks and backfill in batches",
            texto:
              "Add columns as optional, build indexes without blocking writes (in PostgreSQL, `CREATE INDEX CONCURRENTLY`, outside a transaction) and backfill old data in small batches, repeating until done, instead of a single `UPDATE` that holds locks and bloats the log. Set a maximum lock wait so the migration gives up instead of freezing traffic.",
          },
          {
            titulo: "Plan the way back",
            texto:
              "`down` rarely undoes things for real: a dropped column has already taken its data with it. The real way back is usually a new forward migration, plus a recent backup and a tested restore. Criterion: before a destructive change, know how to go back.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Expand and contract: renaming with no downtime",
        etapas: [
          "Expand: a migration adds the new column or table, optional, removing nothing. The old code version keeps working.",
          "A new code version starts writing to both places (the old and the new), still reading from the old.",
          "Backfill: the existing data is copied to the new one in small batches.",
          "Switch the read to the new one, in a separate deploy, keeping the double write for a while so you can step back.",
          "Contract: when no running version uses the old one any more, another migration removes it.",
        ],
        nota: "Each stage is a separate deploy or migration. If you squeeze everything into one step, the gradual rollout breaks: the old version still reads the column you removed.",
      },
      {
        tipo: "codigo",
        titulo: "Renaming `phone` to `phone_number`, in parts",
        legenda: "SQL",
        codigo:
          "-- 1. Expand: a new, optional column (the old version ignores it)\nALTER TABLE customer ADD COLUMN phone_number text;\n\n-- 2. Backfill in small batches (repeat until 0 rows are affected)\nUPDATE customer SET phone_number = phone\nWHERE id IN (\n  SELECT id FROM customer WHERE phone_number IS NULL AND phone IS NOT NULL ORDER BY id LIMIT 1000\n);\n\n-- 3. Index without blocking writes (PostgreSQL; outside a transaction)\nCREATE INDEX CONCURRENTLY idx_customer_phone_number ON customer (phone_number);\n\n-- 4. Contract: only after no code version reads `phone`\n-- ALTER TABLE customer DROP COLUMN phone;",
        nota: "`CREATE INDEX CONCURRENTLY` cannot run inside a transaction, and many tools wrap each migration in one: check how yours turns that off for a given file.",
      },
      {
        tipo: "tabela",
        titulo: "How the tools version changes",
        colunas: ["Tool", "How it versions and applies", "Note"],
        linhas: [
          [
            "Prisma Migrate",
            "The model lives in `schema.prisma`; `prisma migrate dev` generates a folder with each migration’s SQL and `prisma migrate deploy` applies the pending ones in production",
            "You can edit the generated SQL before applying; the history lives in its own tracking table",
          ],
          [
            "Sequelize",
            "Files with `up` and `down`, written by hand with `queryInterface`, run by the CLI (`sequelize-cli`)",
            "Records the applied ones in a tracking table (`SequelizeMeta` by default)",
          ],
          [
            "TypeORM",
            "Can generate the migration by comparing entities with the database (`migration:generate`) or you write it; `up` and `down`",
            "The automatic `synchronize` option is not for production",
          ],
          [
            "Knex",
            "JavaScript or TypeScript files with `up` and `down`, applied by `knex migrate:latest`",
            "A query builder, not an ORM; records in a table (`knex_migrations`)",
          ],
          [
            "Flyway (and Liquibase)",
            "SQL versioned by file name (like `V2__create_index.sql`), language-independent",
            "Runs as a deploy step, outside the Node.js application",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Contracts evolve too",
        texto:
          "The schema of an API or an event changes like the database’s: **add** optional fields instead of changing the meaning of existing ones, never reuse a name for something else, and make consumers **ignore unknown fields**. For a real break, publish a new version and keep the old one through a deprecation period (see L52). In document databases, the schema lives in the code: store a version in the document (for example `schemaVersion`) and migrate on demand or in bulk.",
      },
    ],
    armadilhas: [
      "Editing an already applied migration: it has already run in other environments, the history diverges and tools with checksums refuse. Create another migration.",
      "Applying generated SQL without reading it (a rename can come out as drop and create, losing data), or turning on the ORM’s automatic synchronization in production.",
      "Running a migration that locks the table (a heavy alteration, an index without `CONCURRENTLY`, a backfill in one `UPDATE`) and freezing the application.",
      "Dropping the column in the same deploy that stops using it: during the gradual rollout, the old code version still reads it and breaks.",
    ],
    autoteste: [
      {
        pergunta: "How do you rename a column without taking the application down?",
        resposta:
          "By expanding and contracting: add the new column, write to both, backfill the old data in batches, switch reads to the new one and only in another deploy drop the old one.",
      },
      {
        pergunta: "What is the migrations tracking table for?",
        resposta:
          "It records what has already been applied to that database (and, in many tools, the checksum), so the tool runs only the pending ones, in order, and detects altered or missing migrations.",
      },
    ],
  },
};
