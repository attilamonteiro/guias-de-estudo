import type { Pergunta } from "../../tipos";

// R37 · Migrações de esquema em CD
export const r37: Pergunta = {
  numero: 137,
  modulo: "roadmap-avancado",
  metodo: "playbook",
  pt: {
    titulo: "Migrações de esquema em CD",
    pergunta: "Como você gerencia migrações de esquema em um ambiente de entrega contínua?",
    porqueEsteMetodo:
      "Mudar o esquema sem parar o sistema é um procedimento em fases. O playbook mostra a ordem que permite o deploy e o rollback com o banco compartilhado.",
    resposta30s:
      "Trate as migrações como **código versionado**, aplicadas por uma **ferramenta no pipeline** (Flyway, Liquibase, Prisma Migrate, Alembic), **nunca editadas depois de aplicadas**. Mantenha o esquema **compatível com a versão anterior e a próxima** usando o padrão **expandir → migrar → contrair**, evite bloqueios longos e ensaie contra cópia dos dados.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Migrações como código, versionadas",
            texto: "Arquivos numerados no repositório, revisados em PR junto com o código que dependem delas.",
          },
          {
            titulo: "Automatize no pipeline",
            texto:
              "A ferramenta aplica o que falta, em ordem, registra o que foi aplicado (tabela de histórico) e roda igual em todos os ambientes.",
          },
          {
            titulo: "Nunca edite migração já aplicada",
            texto: "Corrija com uma migração nova (o checksum registrado acusaria a diferença).",
          },
          {
            titulo: "Expandir, migrar, contrair",
            texto:
              "1) **Expandir**: adicione a coluna ou tabela nova (anulável). 2) **Migrar**: o código passa a escrever nos dois e os dados antigos são preenchidos. 3) Troque as leituras. 4) **Contrair**: remova o antigo num deploy posterior.",
          },
          {
            titulo: "Cuidado com bloqueios",
            texto:
              "`ALTER TABLE` em tabela grande pode travar: use operações online, `lock_timeout`, índices `CONCURRENTLY` e preenchimento em lotes.",
          },
          {
            titulo: "Teste e ensaie",
            texto: "Rode contra uma cópia do esquema e dos dados de produção; tenha backup e plano de reversão.",
          },
          {
            titulo: "Separe migrar de deployar",
            texto:
              "A migração aditiva vai antes do código novo; a destrutiva só depois que nada mais usa o objeto antigo.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Renomear uma coluna sem derrubar ninguém",
        legenda: "sql",
        codigo:
          "-- 1) expandir\nALTER TABLE clientes ADD COLUMN nome_completo text;\n-- 2) o codigo novo grava nos dois; preencher o antigo em lotes\nUPDATE clientes SET nome_completo = nome\n WHERE id BETWEEN 1 AND 10000 AND nome_completo IS NULL;\n-- 3) as leituras passam a usar nome_completo\n-- 4) contrair, num deploy posterior\nALTER TABLE clientes DROP COLUMN nome;",
      },
    ],
    armadilhas: [
      "Renomear ou remover coluna no mesmo deploy do código: a versão antiga quebra.",
      "`ALTER` longo em horário de pico.",
      "Migração manual, fora do versionamento.",
      "Preencher milhões de linhas numa única transação.",
    ],
    autoteste: [
      {
        pergunta: "O que é o padrão expandir/contrair?",
        resposta:
          "Alterar o esquema em fases compatíveis: adicionar o novo, migrar código e dados, e só depois remover o antigo.",
      },
      {
        pergunta: "Por que nunca editar uma migração já aplicada?",
        resposta:
          "Porque os ambientes que já a aplicaram ficam diferentes dos novos, e a ferramenta detecta a divergência pelo checksum.",
      },
    ],
  },
  en: {
    titulo: "Schema migrations in CD",
    pergunta: "How do you manage schema migrations in a continuous delivery environment?",
    porqueEsteMetodo:
      "Changing the schema without stopping the system is a phased procedure. The playbook shows the order that allows deploy and rollback with a shared database.",
    resposta30s:
      "Treat migrations as **versioned code**, applied by a **tool in the pipeline** (Flyway, Liquibase, Prisma Migrate, Alembic), **never edited after being applied**. Keep the schema **compatible with the previous and the next version** using the **expand → migrate → contract** pattern, avoid long locks and rehearse against a copy of the data.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Migrations as versioned code",
            texto: "Numbered files in the repository, reviewed in a PR together with the code that depends on them.",
          },
          {
            titulo: "Automate in the pipeline",
            texto:
              "The tool applies what is missing, in order, records what was applied (history table) and runs the same in every environment.",
          },
          {
            titulo: "Never edit an applied migration",
            texto: "Fix it with a new migration (the recorded checksum would flag the difference).",
          },
          {
            titulo: "Expand, migrate, contract",
            texto:
              "1) **Expand**: add the new column or table (nullable). 2) **Migrate**: the code writes to both and old data is backfilled. 3) Switch the reads. 4) **Contract**: remove the old one in a later deploy.",
          },
          {
            titulo: "Watch for locks",
            texto:
              "`ALTER TABLE` on a big table can block: use online operations, `lock_timeout`, `CONCURRENTLY` indexes and batched backfills.",
          },
          {
            titulo: "Test and rehearse",
            texto: "Run against a copy of production schema and data; have a backup and a rollback plan.",
          },
          {
            titulo: "Separate migrating from deploying",
            texto:
              "The additive migration goes before the new code; the destructive one only after nothing uses the old object.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Renaming a column without taking anyone down",
        legenda: "sql",
        codigo:
          "-- 1) expand\nALTER TABLE customers ADD COLUMN full_name text;\n-- 2) new code writes to both; backfill the old one in batches\nUPDATE customers SET full_name = name\n WHERE id BETWEEN 1 AND 10000 AND full_name IS NULL;\n-- 3) reads switch to full_name\n-- 4) contract, in a later deploy\nALTER TABLE customers DROP COLUMN name;",
      },
    ],
    armadilhas: [
      "Renaming or dropping a column in the same deploy as the code: the old version breaks.",
      "A long `ALTER` at peak time.",
      "A manual migration, outside version control.",
      "Backfilling millions of rows in a single transaction.",
    ],
    autoteste: [
      {
        pergunta: "What is the expand/contract pattern?",
        resposta:
          "Changing the schema in compatible phases: add the new, migrate code and data, and only then remove the old.",
      },
      {
        pergunta: "Why never edit an already-applied migration?",
        resposta:
          "Because environments that applied it become different from new ones, and the tool detects the divergence via the checksum.",
      },
    ],
  },
};
