import type { Pergunta } from "../../tipos";

// M03 · Integridade de dados
export const m03: Pergunta = {
  numero: 203,
  modulo: "mentorcruise",
  metodo: "playbook",
  pt: {
    titulo: "Integridade de dados",
    pergunta: "Como você garantiria a integridade dos dados em um banco de dados?",
    porqueEsteMetodo:
      "Integridade não vem de um recurso só: vem de camadas que se complementam, cada uma pegando o erro que a outra deixa passar. Um playbook as organiza numa ordem que dá para seguir e checar.",
    resposta30s:
      "Em **camadas**, com o **banco como última linha de defesa**: **restrições no esquema** (tipos, `NOT NULL`, `UNIQUE`, chaves primária e estrangeira, `CHECK`), **transações** com o isolamento certo, **controle de concorrência** e **escritas idempotentes**; **validação na aplicação** para regras e mensagens; **migrações** seguras; **backups com restauração testada**; e **auditoria** com monitoramento de dados órfãos.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook, de dentro para fora",
        passos: [
          {
            titulo: "Coloque as regras no esquema",
            texto:
              "Tipos corretos (dinheiro em inteiro de centavos ou decimal, nunca ponto flutuante), `NOT NULL`, `UNIQUE`, chave primária, chave estrangeira com a ação de exclusão definida (`RESTRICT`, `CASCADE`…) e `CHECK` para faixas e estados válidos. Sinal de que falta: o código tem `if` para proteger algo que o banco poderia recusar.",
          },
          {
            titulo: "Agrupe em transações",
            texto:
              "Operações que só fazem sentido juntas (debitar e creditar, criar o pedido e seus itens) entram na mesma transação: tudo ou nada (veja Q08). Escolha o nível de isolamento sabendo quais anomalias ele ainda permite, como a atualização perdida.",
          },
          {
            titulo: "Controle a concorrência e repita com segurança",
            texto:
              "Contra o “ler, alterar, gravar” de duas pessoas ao mesmo tempo: **lock otimista** (coluna de versão conferida no `UPDATE`) ou **pessimista** (`SELECT … FOR UPDATE`); veja Q09 para o risco de deadlock. Para retentativas não duplicarem efeitos, use escritas **idempotentes**: `UNIQUE` sobre uma chave de idempotência e inserção que trata o conflito.",
          },
          {
            titulo: "Valide também na aplicação",
            texto:
              "A aplicação dá mensagens claras e checa regras que o esquema não expressa, como as que cruzam várias tabelas. É a primeira linha de defesa, não a única: outros serviços, scripts e ferramentas administrativas também escrevem no banco.",
          },
          {
            titulo: "Faça migrações seguras",
            texto:
              "Versionadas, revisadas e ensaiadas numa cópia dos dados. Em mudanças grandes, vá em etapas (acrescentar, preencher, trocar o código, remover) para a versão antiga e a nova da aplicação conviverem. Em tabelas grandes, veja se o seu banco permite adicionar a restrição sem travar escritas e validá-la depois.",
          },
          {
            titulo: "Backup e restauração testada",
            texto:
              "Backups automáticos, guardados fora do servidor principal, com a possibilidade de voltar a um ponto no tempo quando o banco oferece. Sinal de que funciona: você restaurou numa máquina separada, conferiu os dados e mediu quanto tempo levou. Backup que nunca foi restaurado é uma hipótese.",
          },
          {
            titulo: "Audite e monitore",
            texto:
              "Trilha de auditoria (quem mudou o quê e quando) nas tabelas sensíveis, e consultas periódicas que procuram o que não deveria existir: filhos sem pai (órfãos), totais que não batem, estados impossíveis. Alerte quando aparecerem.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Qual camada pega qual problema",
        colunas: ["Problema", "Defesa principal"],
        linhas: [
          ["Campo obrigatório vazio, tipo errado", "Tipos e `NOT NULL`"],
          ["Dois cadastros com o mesmo e-mail", "`UNIQUE`"],
          ["Pedido apontando para um cliente que não existe", "Chave estrangeira"],
          ["Quantidade ou preço negativo, status inválido", "`CHECK`"],
          ["Débito gravado sem o crédito correspondente", "Transação"],
          ["Duas edições simultâneas, uma apaga a outra", "Lock otimista ou pessimista"],
          ["Retentativa cobrando duas vezes", "Escrita idempotente"],
          ["Migração que corrompe dados", "Migração em etapas, ensaiada"],
          ["Exclusão acidental, falha de disco", "Backup com restauração testada"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Esquema e lock otimista",
        legenda: "sql",
        codigo:
          "CREATE TABLE pedido (\n  id          bigint  PRIMARY KEY,\n  cliente_id  bigint  NOT NULL REFERENCES cliente (id) ON DELETE RESTRICT,\n  total_cents bigint  NOT NULL CHECK (total_cents >= 0),\n  status      text    NOT NULL CHECK (status IN ('novo', 'pago', 'cancelado')),\n  chave_idem  text    UNIQUE,\n  versao      integer NOT NULL DEFAULT 1\n);\n\n-- Lock otimista: só atualiza se ninguém mudou o pedido desde a leitura\nUPDATE pedido\nSET status = 'pago', versao = versao + 1\nWHERE id = 42 AND versao = 7;\n-- 0 linhas afetadas = conflito: reler e tentar de novo",
        nota: "Sintaxe próxima da do PostgreSQL; varia por banco. Dinheiro em centavos inteiros evita erros de arredondamento do ponto flutuante.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O banco é a última linha de defesa",
        texto:
          "A aplicação pode ter um bug, e nem toda escrita passa por ela. Só o banco vê todas as escritas, então só ele garante uma regra em qualquer caminho. Valide na aplicação para a experiência, restrinja no banco para a garantia.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Desligar uma restrição é uma decisão, não um atalho",
        texto:
          "Há sistemas que abrem mão de chaves estrangeiras de propósito, por escala ou por dados espalhados em vários bancos. Nesse caso a garantia precisa ser reposta de outro modo: verificações periódicas, correção automática dos órfãos e alertas. Sem isso, os problemas aparecem em silêncio.",
      },
    ],
    armadilhas: [
      "Validar só na aplicação: outro serviço, um script ou um bug grava o dado inválido direto no banco.",
      "Desligar chaves estrangeiras “por desempenho” sem plano para verificar o que elas garantiam.",
      "Ter backup e nunca ter feito uma restauração de teste.",
      "Confiar no isolamento padrão sem saber quais anomalias ele permite: a atualização perdida e o “write skew” (duas transações leem o mesmo estado e gravam coisas que, juntas, violam uma regra) passam em muitos níveis.",
    ],
    autoteste: [
      {
        pergunta: "Por que validar só na aplicação não basta?",
        resposta:
          "Porque há outros caminhos até o banco (outros serviços, scripts, ferramentas administrativas) e a própria aplicação pode ter bugs. Só o banco vê todas as escritas, então só ele garante a regra sempre.",
      },
      {
        pergunta: "Como impedir que duas pessoas sobrescrevam a edição uma da outra?",
        resposta:
          "Com lock otimista (uma coluna de versão: o `UPDATE … WHERE versao = <a que foi lida>` falha se alguém mudou antes) ou com lock pessimista (`SELECT … FOR UPDATE` trava a linha durante a edição).",
      },
      {
        pergunta: "Como saber se o backup serve?",
        resposta:
          "Restaurando-o periodicamente num ambiente separado, conferindo os dados e medindo o tempo da restauração. Só assim se descobre um backup corrompido ou incompleto antes do dia em que ele for necessário.",
      },
    ],
  },
  en: {
    titulo: "Data integrity",
    pergunta: "How would you ensure data integrity in a database?",
    porqueEsteMetodo:
      "Integrity does not come from a single feature: it comes from layers that complement each other, each catching the error the others let through. A playbook arranges them in an order you can follow and check.",
    resposta30s:
      "In **layers**, with the **database as the last line of defense**: **schema constraints** (types, `NOT NULL`, `UNIQUE`, primary and foreign keys, `CHECK`), **transactions** with the right isolation, **concurrency control** and **idempotent writes**; **application-level validation** for rules and messages; safe **migrations**; **backups with tested restores**; and **auditing** with monitoring for orphaned data.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook, from the inside out",
        passos: [
          {
            titulo: "Put the rules in the schema",
            texto:
              "Correct types (money as integer cents or decimal, never floating point), `NOT NULL`, `UNIQUE`, primary key, foreign key with the delete action defined (`RESTRICT`, `CASCADE`…) and `CHECK` for valid ranges and states. Sign something is missing: the code has an `if` guarding something the database could reject.",
          },
          {
            titulo: "Group work into transactions",
            texto:
              "Operations that only make sense together (debit and credit, create the order and its items) go in the same transaction: all or nothing (see Q08). Pick the isolation level knowing which anomalies it still allows, such as the lost update.",
          },
          {
            titulo: "Control concurrency and retry safely",
            texto:
              "Against two people doing “read, change, write” at once: **optimistic locking** (a version column checked in the `UPDATE`) or **pessimistic locking** (`SELECT … FOR UPDATE`); see Q09 for the deadlock risk. So retries do not duplicate effects, use **idempotent** writes: `UNIQUE` on an idempotency key and an insert that handles the conflict.",
          },
          {
            titulo: "Validate in the application too",
            texto:
              "The application gives clear messages and checks rules the schema cannot express, such as ones spanning several tables. It is the first line of defense, not the only one: other services, scripts and admin tools also write to the database.",
          },
          {
            titulo: "Make migrations safe",
            texto:
              "Versioned, reviewed and rehearsed on a copy of the data. For large changes, go in stages (add, backfill, switch the code, remove) so the old and new application versions can coexist. On big tables, check whether your database lets you add the constraint without blocking writes and validate it afterwards.",
          },
          {
            titulo: "Backups with a tested restore",
            texto:
              "Automated backups, stored away from the main server, with point-in-time recovery where the database offers it. Sign it works: you restored onto a separate machine, checked the data and measured how long it took. A backup that was never restored is a hypothesis.",
          },
          {
            titulo: "Audit and monitor",
            texto:
              "An audit trail (who changed what and when) on sensitive tables, and periodic queries that look for what should not exist: children without a parent (orphans), totals that do not add up, impossible states. Alert when they show up.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Which layer catches which problem",
        colunas: ["Problem", "Main defense"],
        linhas: [
          ["Required field empty, wrong type", "Types and `NOT NULL`"],
          ["Two accounts with the same email", "`UNIQUE`"],
          ["Order pointing to a customer that does not exist", "Foreign key"],
          ["Negative quantity or price, invalid status", "`CHECK`"],
          ["Debit recorded without the matching credit", "Transaction"],
          ["Two simultaneous edits, one wipes the other", "Optimistic or pessimistic locking"],
          ["Retry charging twice", "Idempotent write"],
          ["Migration that corrupts data", "Staged, rehearsed migration"],
          ["Accidental deletion, disk failure", "Backup with a tested restore"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Schema and optimistic locking",
        legenda: "sql",
        codigo:
          "CREATE TABLE orders (\n  id              bigint  PRIMARY KEY,\n  customer_id     bigint  NOT NULL REFERENCES customers (id) ON DELETE RESTRICT,\n  total_cents     bigint  NOT NULL CHECK (total_cents >= 0),\n  status          text    NOT NULL CHECK (status IN ('new', 'paid', 'canceled')),\n  idempotency_key text    UNIQUE,\n  version         integer NOT NULL DEFAULT 1\n);\n\n-- Optimistic locking: update only if nobody changed the order since the read\nUPDATE orders\nSET status = 'paid', version = version + 1\nWHERE id = 42 AND version = 7;\n-- 0 rows affected = conflict: re-read and try again",
        nota: "Syntax close to PostgreSQL’s; it varies by database. Money in integer cents avoids floating-point rounding errors.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The database is the last line of defense",
        texto:
          "The application can have a bug, and not every write goes through it. Only the database sees all writes, so only it can guarantee a rule on every path. Validate in the application for the experience, constrain in the database for the guarantee.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Dropping a constraint is a decision, not a shortcut",
        texto:
          "Some systems give up foreign keys on purpose, for scale or because data is spread across several databases. In that case the guarantee has to be restored another way: periodic checks, automatic repair of orphans and alerts. Without that, problems surface silently.",
      },
    ],
    armadilhas: [
      "Validating only in the application: another service, a script or a bug writes invalid data straight to the database.",
      "Turning off foreign keys “for performance” with no plan to verify what they used to guarantee.",
      "Having backups and never having run a test restore.",
      "Trusting the default isolation without knowing which anomalies it allows: the lost update and “write skew” (two transactions read the same state and write things that together break a rule) get through at many levels.",
    ],
    autoteste: [
      {
        pergunta: "Why is validating only in the application not enough?",
        resposta:
          "Because there are other paths into the database (other services, scripts, admin tools) and the application itself can have bugs. Only the database sees every write, so only it guarantees the rule every time.",
      },
      {
        pergunta: "How do you stop two people from overwriting each other’s edits?",
        resposta:
          "With optimistic locking (a version column: `UPDATE … WHERE version = <the one read>` fails if someone changed it first) or pessimistic locking (`SELECT … FOR UPDATE` locks the row during the edit).",
      },
      {
        pergunta: "How do you know the backup is good?",
        resposta:
          "By restoring it periodically in a separate environment, checking the data and measuring how long the restore takes. That is the only way to discover a corrupt or incomplete backup before the day you need it.",
      },
    ],
  },
};
