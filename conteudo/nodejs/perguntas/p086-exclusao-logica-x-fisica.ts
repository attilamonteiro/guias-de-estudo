import type { Pergunta } from "../../tipos";

// P86 · Exclusão lógica x física
export const p086: Pergunta = {
  numero: 786,
  modulo: "pawanmkr-resiliencia",
  metodo: "compare",
  pt: {
    titulo: "Exclusão lógica x física",
    pergunta: "Qual é a diferença entre exclusões físicas (hard) e lógicas (soft) em bancos de dados?",
    porqueEsteMetodo:
      "Duas abordagens que parecem equivalentes (“apagar”) têm consequências bem diferentes em consulta, integridade e lei. Uma matriz mostra o que cada uma ganha e perde, e a regra de decisão diz quando usar cada uma.",
    resposta30s:
      "Na **exclusão física** (hard delete), o `DELETE` remove a linha de vez: é simples e libera espaço, mas é **irreversível**. Na **exclusão lógica** (soft delete), você marca o registro como apagado (por exemplo, com `deleted_at`) e ele continua no banco: dá para **restaurar e auditar**, mas toda consulta precisa filtrar os apagados, índices e unicidade ficam mais complicados e o dado **não sai de fato**, o que importa para LGPD e GDPR. Escolha pela necessidade de histórico e restauração e pela obrigação de eliminar dados.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Exclusão física x lógica",
        colunas: ["Aspecto", "Física (hard delete)", "Lógica (soft delete)"],
        linhas: [
          [
            "O que faz",
            "`DELETE` remove a linha",
            "Marca a linha (`deleted_at`, um estado ou `ativo = false`) e ela continua lá",
          ],
          ["Recuperação", "Só com backup", "Basta desmarcar"],
          [
            "Consultas",
            "Nada de especial",
            "Toda consulta, junção e relatório precisa filtrar os apagados (ou usar uma view ou o escopo do ORM)",
          ],
          [
            "Espaço e desempenho",
            "Libera espaço (depois da limpeza interna do banco)",
            "A tabela só cresce; tabelas e índices ficam maiores",
          ],
          [
            "Integridade referencial",
            "A chave estrangeira impede apagar o que tem filhos, ou propaga com `ON DELETE CASCADE` / `SET NULL`",
            "A chave continua apontando para uma linha existente; “filho de pai apagado” vira regra da aplicação",
          ],
          [
            "Unicidade",
            "O valor fica livre para ser reutilizado",
            "O e-mail de uma conta apagada continua ocupando o `UNIQUE`, a não ser que o índice seja parcial",
          ],
          ["Auditoria", "Perde o histórico, a menos que haja um log à parte", "Preserva o histórico"],
          [
            "LGPD / GDPR",
            "Atende ao pedido de eliminação (backups e logs à parte)",
            "Não atende sozinha: os dados pessoais continuam no banco",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Soft delete no PostgreSQL",
        legenda: "SQL",
        codigo:
          "ALTER TABLE usuario ADD COLUMN deleted_at timestamptz;\n\n-- “Apagar” é marcar\nUPDATE usuario SET deleted_at = now() WHERE id = $1 AND deleted_at IS NULL;\n\n-- Unicidade só entre os registros vivos (índice parcial)\nCREATE UNIQUE INDEX uq_usuario_email_ativo ON usuario (email) WHERE deleted_at IS NULL;\n\n-- Toda consulta precisa filtrar; uma view evita o esquecimento\nCREATE VIEW usuario_ativo AS SELECT * FROM usuario WHERE deleted_at IS NULL;",
        nota: "Índice parcial existe no PostgreSQL; outros bancos usam outro nome ou outra técnica, então confira o seu. Em Node.js, alguns ORMs automatizam o filtro: o TypeORM tem `@DeleteDateColumn` com `softDelete` e `restore`, e o Sequelize tem a opção `paranoid`; no Prisma não há soft delete nativo, e a prática comum é uma extensão do client ou uma view. Confira a documentação.",
      },
      {
        tipo: "tabela",
        titulo: "Alternativas e complementos",
        colunas: ["Estratégia", "Como funciona", "Quando usar"],
        linhas: [
          [
            "Tabela de arquivo",
            "Move a linha para uma tabela `*_arquivado` na mesma transação; a principal fica limpa",
            "Quer manter o histórico sem poluir as consultas e os índices do dia a dia",
          ],
          [
            "Histórico ou auditoria",
            "Registra cada mudança (quem, quando, o quê) em uma tabela de eventos ou log de auditoria",
            "Precisa reconstruir o que aconteceu, apagando ou não",
          ],
          [
            "Retenção com expurgo agendado",
            "Soft delete agora e uma tarefa que apaga fisicamente depois do prazo definido",
            "Quer uma janela de restauração e também a obrigação de eliminar o dado",
          ],
          [
            "Anonimização",
            "Troca os dados pessoais por valores neutros e mantém o registro",
            "Precisa preservar totais, relatórios e chaves estrangeiras sem manter dados pessoais",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Se o registro é de negócio, referenciado por outros (pedidos, faturas) ou precisa ser **restaurado ou auditado**, prefira soft delete ou arquivo, com um **prazo de retenção** e um expurgo. Se o dado é temporário, sem valor depois de sair, ou se há o dever de **eliminar**, use hard delete (ou anonimização, quando ainda precisar das agregações). Na dúvida, marque como inativo, que é reversível, e defina por quanto tempo vai guardar.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Soft delete não atende, sozinho, o pedido de eliminação",
        texto:
          "A LGPD e o GDPR dão à pessoa o direito de pedir a eliminação dos seus dados pessoais, com exceções (como a obrigação legal de guardar certos registros). Uma linha marcada com `deleted_at` ainda contém nome, e-mail e o resto. Planeje o expurgo físico ou a anonimização e consulte o time jurídico sobre prazos e exceções. Lembre-se também dos backups e dos logs, que guardam cópias.",
      },
    ],
    armadilhas: [
      "Esquecer o filtro `deleted_at IS NULL` numa consulta, relatório ou junção: os apagados reaparecem e podem vazar. Use uma view, o escopo padrão do ORM ou política de acesso por linha.",
      "Deixar a unicidade ignorar o estado: o e-mail de uma conta apagada continua ocupado, ou, ao liberar sem cuidado, nascem duplicados entre os vivos. Use um índice único parcial.",
      "Esperar que o soft delete se propague: marcar o pai não marca os filhos, e o hard delete com `ON DELETE CASCADE` apaga filhos sem aviso.",
      "Achar que soft delete atende LGPD ou GDPR: sem expurgo ou anonimização, o dado pessoal continua guardado.",
    ],
    autoteste: [
      {
        pergunta: "Quando você preferiria soft delete a hard delete?",
        resposta:
          "Quando o registro precisa ser restaurado, auditado ou continuar referenciável por outros (como pedidos de um cliente inativado) e não há dever de eliminá-lo, ou há um expurgo programado depois de um prazo.",
      },
      {
        pergunta: "Como manter a unicidade do e-mail com soft delete?",
        resposta:
          "Com um índice único parcial, que vale só para as linhas não apagadas (`WHERE deleted_at IS NULL`), de modo que o e-mail de uma conta apagada possa ser reutilizado sem permitir duplicatas entre as ativas.",
      },
    ],
  },
  en: {
    titulo: "Hard vs soft deletes",
    pergunta: "What is the difference between hard and soft deletes in databases?",
    porqueEsteMetodo:
      "Two approaches that look equivalent (“delete”) have very different consequences for queries, integrity and the law. A matrix shows what each gains and loses, and the decision rule says when to use which.",
    resposta30s:
      "In a **hard delete**, `DELETE` removes the row for good: it is simple and frees space, but it is **irreversible**. In a **soft delete**, you mark the record as deleted (for example with `deleted_at`) and it stays in the database: you can **restore and audit**, but every query must filter out the deleted rows, indexes and uniqueness get more complicated, and the data **never really leaves**, which matters for GDPR and similar laws. Choose by the need for history and restoration and by any obligation to erase data.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Hard vs soft delete",
        colunas: ["Aspect", "Hard delete", "Soft delete"],
        linhas: [
          [
            "What it does",
            "`DELETE` removes the row",
            "Marks the row (`deleted_at`, a state or `active = false`) and it stays there",
          ],
          ["Recovery", "Only from a backup", "Just unmark it"],
          [
            "Queries",
            "Nothing special",
            "Every query, join and report must filter out deleted rows (or use a view or the ORM scope)",
          ],
          [
            "Space and performance",
            "Frees space (after the database’s internal cleanup)",
            "The table only grows; tables and indexes get larger",
          ],
          [
            "Referential integrity",
            "The foreign key blocks deleting what has children, or propagates with `ON DELETE CASCADE` / `SET NULL`",
            "The key still points to an existing row; “child of a deleted parent” becomes an application rule",
          ],
          [
            "Uniqueness",
            "The value is free to be reused",
            "A deleted account’s email still occupies the `UNIQUE`, unless the index is partial",
          ],
          ["Auditing", "History is lost unless a separate log exists", "History is preserved"],
          [
            "GDPR / similar laws",
            "Satisfies an erasure request (backups and logs aside)",
            "Does not satisfy it on its own: the personal data stays in the database",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Soft delete in PostgreSQL",
        legenda: "SQL",
        codigo:
          "ALTER TABLE users ADD COLUMN deleted_at timestamptz;\n\n-- “Deleting” is marking\nUPDATE users SET deleted_at = now() WHERE id = $1 AND deleted_at IS NULL;\n\n-- Uniqueness only among live records (partial index)\nCREATE UNIQUE INDEX uq_users_email_active ON users (email) WHERE deleted_at IS NULL;\n\n-- Every query must filter; a view prevents forgetting\nCREATE VIEW active_users AS SELECT * FROM users WHERE deleted_at IS NULL;",
        nota: "Partial indexes exist in PostgreSQL; other databases use a different name or technique, so check yours. In Node.js, some ORMs automate the filter: TypeORM has `@DeleteDateColumn` with `softDelete` and `restore`, and Sequelize has the `paranoid` option; Prisma has no native soft delete, and the common practice is a client extension or a view. Check the documentation.",
      },
      {
        tipo: "tabela",
        titulo: "Alternatives and complements",
        colunas: ["Strategy", "How it works", "When to use"],
        linhas: [
          [
            "Archive table",
            "Moves the row to an `*_archive` table in the same transaction; the main one stays clean",
            "You want to keep history without polluting day-to-day queries and indexes",
          ],
          [
            "History or audit",
            "Records each change (who, when, what) in an events table or audit log",
            "You need to reconstruct what happened, whether or not you delete",
          ],
          [
            "Retention with scheduled purge",
            "Soft delete now and a job that physically deletes after the defined period",
            "You want a restore window and also an obligation to erase the data",
          ],
          [
            "Anonymization",
            "Replaces personal data with neutral values and keeps the record",
            "You must preserve totals, reports and foreign keys without keeping personal data",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "If the record is business data, referenced by others (orders, invoices) or must be **restored or audited**, prefer soft delete or an archive, with a **retention period** and a purge. If the data is temporary, worthless once it leaves, or there is a duty to **erase** it, use hard delete (or anonymization, when you still need the aggregates). When in doubt, mark it inactive, which is reversible, and define how long you will keep it.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Soft delete alone does not satisfy an erasure request",
        texto:
          "The GDPR and similar laws give people the right to ask for their personal data to be erased, with exceptions (such as a legal obligation to keep certain records). A row marked with `deleted_at` still holds the name, the email and everything else. Plan a physical purge or anonymization, and ask your legal team about periods and exceptions. Remember backups and logs too, which keep copies.",
      },
    ],
    armadilhas: [
      "Forgetting the `deleted_at IS NULL` filter in a query, report or join: deleted rows reappear and can leak. Use a view, the ORM’s default scope or row-level access policies.",
      "Letting uniqueness ignore the state: a deleted account’s email stays taken, or, when freed carelessly, duplicates appear among live rows. Use a partial unique index.",
      "Expecting soft delete to propagate: marking the parent does not mark the children, and a hard delete with `ON DELETE CASCADE` removes children without warning.",
      "Assuming soft delete satisfies GDPR or similar laws: without a purge or anonymization, the personal data is still stored.",
    ],
    autoteste: [
      {
        pergunta: "When would you prefer soft delete over hard delete?",
        resposta:
          "When the record must be restorable, auditable or still referenceable by others (such as the orders of an inactivated customer) and there is no duty to erase it, or there is a scheduled purge after a set period.",
      },
      {
        pergunta: "How do you keep email uniqueness with soft delete?",
        resposta:
          "With a partial unique index that applies only to non-deleted rows (`WHERE deleted_at IS NULL`), so a deleted account’s email can be reused without allowing duplicates among active ones.",
      },
    ],
  },
};
