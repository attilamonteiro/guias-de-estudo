import type { Pergunta } from "../../tipos";

// Q08 · Propriedades ACID
export const q08: Pergunta = {
  numero: 8,
  modulo: "bancos-de-dados",
  metodo: "whys",
  pt: {
    titulo: "Propriedades ACID",
    pergunta: "Quais são as propriedades do ACID em um banco de dados? Por que eles são importantes?",
    porqueEsteMetodo:
      "A pergunta já pede o “por que importa”. Uma cadeia de porquês, usando uma transferência bancária, faz cada letra aparecer como consequência de um problema real, em vez de definição decorada.",
    resposta30s:
      "**A**tomicidade: tudo ou nada. **C**onsistência: a transação leva o banco de um estado válido a outro, respeitando as regras. **I**solamento: transações simultâneas não se enxergam pela metade. **D**urabilidade: o que foi confirmado sobrevive a um crash. Juntas, permitem raciocinar como se cada operação rodasse sozinha e o hardware nunca falhasse.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que ACID importa?",
            resposta:
              "Porque uma operação de negócio quase nunca é uma escrita só: transferir R$ 100 é debitar A **e** creditar B, e as duas só fazem sentido juntas.",
          },
          {
            pergunta: "Por que não basta executar as duas escritas em sequência?",
            resposta:
              "Porque o sistema pode falhar entre elas: o débito acontece, o crédito não, e o dinheiro some. Falta **atomicidade**: tudo ou nada, com desfazer (rollback) automático.",
          },
          {
            pergunta: "Por que, mesmo atômico, ainda pode dar errado?",
            resposta:
              "Porque dois usuários operam ao mesmo tempo: ambos leem saldo 100, ambos gravam 50, e um débito se perde (lost update). Falta **isolamento**: cada transação enxerga o mundo como se estivesse sozinha.",
          },
          {
            pergunta: "Por que o resultado ainda precisa ser “válido”?",
            resposta:
              "Porque saldo negativo, chave estrangeira órfã ou CPF duplicado violam as regras do negócio. A **consistência** garante que a transação nunca deixa o banco violando as regras declaradas.",
          },
          {
            pergunta: "Por que a confirmação precisa sobreviver a uma queda?",
            resposta:
              "Porque dizer “transferência feita” e perder a escrita num corte de energia é pior que recusar. A **durabilidade** grava no log de escrita antecipada (WAL) em disco antes de confirmar.",
          },
        ],
        causaRaiz:
          "ACID transforma “várias operações incertas” numa única operação **tudo-ou-nada, correta mesmo com concorrência e falhas**. Quem programa pode raciocinar como se estivesse sozinho e o computador nunca falhasse.",
      },
      {
        tipo: "tabela",
        colunas: ["", "O que garante", "Como o banco faz", "Sem isso"],
        linhas: [
          ["Atomicidade", "Tudo ou nada", "Log de desfazer / rollback", "Transferência pela metade"],
          [
            "Consistência",
            "Estado válido → estado válido",
            "Constraints, FKs, triggers (+ regras da aplicação)",
            "Saldo negativo, registros órfãos",
          ],
          [
            "Isolamento",
            "Concorrentes não interferem",
            "Locks ou MVCC; níveis read committed, repeatable read, serializable",
            "Lost update, leitura suja, fantasmas",
          ],
          ["Durabilidade", "Commit sobrevive a crash", "WAL + fsync, replicação", "Pedido confirmado que desaparece"],
        ],
      },
      {
        tipo: "codigo",
        legenda: "sql",
        codigo:
          "BEGIN;\nUPDATE contas SET saldo = saldo - 100 WHERE id = 1 AND saldo >= 100;\nUPDATE contas SET saldo = saldo + 100 WHERE id = 2;\nCOMMIT;   -- ou ROLLBACK se algo falhar",
        nota: "Repare em `saldo = saldo - 100`: a conta é feita dentro do banco, de forma atômica, em vez de ler, calcular na aplicação e gravar. Isso já evita o lost update no nível padrão.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Os dois “C” são diferentes",
        texto:
          "O C do ACID quer dizer “respeita as regras”, e quem define as regras também é a aplicação. O C do teorema CAP quer dizer que todos os nós veem o mesmo dado (linearizabilidade). Não são o mesmo conceito.",
      },
    ],
    armadilhas: [
      "Achar que o banco garante a consistência de negócio sozinho: ele só aplica as regras que você declarou.",
      "Esquecer que cada comando em autocommit é uma transação própria; duas escritas relacionadas precisam do mesmo `BEGIN … COMMIT`.",
      "Supor que o nível padrão (read committed) evita todo problema de concorrência: o lost update pede update atômico, `SELECT … FOR UPDATE` ou lock otimista.",
      "Dizer que “NoSQL não tem ACID”: muitos têm, em escopo limitado (um documento, uma partição).",
    ],
    autoteste: [
      {
        pergunta: "Qual letra do ACID protege contra um crash no meio de uma transferência?",
        resposta:
          "Atomicidade (tudo ou nada). A Durabilidade protege depois do commit: o que foi confirmado não se perde.",
      },
      {
        pergunta: "Que anomalia o isolamento evita no exemplo de dois saques simultâneos?",
        resposta: "O lost update: duas transações leem o mesmo saldo e a segunda gravação sobrescreve a primeira.",
      },
    ],
  },
  en: {
    titulo: "ACID properties",
    pergunta: "What are the ACID properties in a database? Why are they important?",
    porqueEsteMetodo:
      "The question already asks “why it matters”. A chain of whys, using a bank transfer, makes each letter appear as the consequence of a real problem instead of a memorized definition.",
    resposta30s:
      "**A**tomicity: all or nothing. **C**onsistency: a transaction takes the database from one valid state to another, respecting the rules. **I**solation: concurrent transactions do not see each other half-done. **D**urability: what was committed survives a crash. Together they let you reason as if each operation ran alone and hardware never failed.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does ACID matter?",
            resposta:
              "Because a business operation is rarely a single write: moving $100 means debiting A **and** crediting B, and the two only make sense together.",
          },
          {
            pergunta: "Why is running the two writes one after the other not enough?",
            resposta:
              "Because the system can fail between them: the debit happens, the credit does not, and the money vanishes. **Atomicity** is missing: all or nothing, with automatic undo (rollback).",
          },
          {
            pergunta: "Why can it still go wrong even when atomic?",
            resposta:
              "Because two users act at the same time: both read balance 100, both write 50, and one debit is lost (lost update). **Isolation** is missing: each transaction sees the world as if it were alone.",
          },
          {
            pergunta: "Why must the result still be “valid”?",
            resposta:
              "Because a negative balance, an orphan foreign key or a duplicate tax ID violate business rules. **Consistency** guarantees a transaction never leaves the database breaking the declared rules.",
          },
          {
            pergunta: "Why must a confirmation survive a crash?",
            resposta:
              "Because saying “transfer done” and losing the write in a power cut is worse than refusing. **Durability** writes to the write-ahead log (WAL) on disk before confirming.",
          },
        ],
        causaRaiz:
          "ACID turns “several uncertain operations” into a single **all-or-nothing operation that is correct even with concurrency and failures**. A programmer can reason as if alone and the computer never failed.",
      },
      {
        tipo: "tabela",
        colunas: ["", "What it guarantees", "How the database does it", "Without it"],
        linhas: [
          ["Atomicity", "All or nothing", "Undo log / rollback", "A half-done transfer"],
          [
            "Consistency",
            "Valid state → valid state",
            "Constraints, FKs, triggers (+ application rules)",
            "Negative balance, orphan records",
          ],
          [
            "Isolation",
            "Concurrent work does not interfere",
            "Locks or MVCC; levels read committed, repeatable read, serializable",
            "Lost update, dirty reads, phantoms",
          ],
          ["Durability", "A commit survives a crash", "WAL + fsync, replication", "A confirmed order that disappears"],
        ],
      },
      {
        tipo: "codigo",
        legenda: "sql",
        codigo:
          "BEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1 AND balance >= 100;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;   -- or ROLLBACK if anything fails",
        nota: "Note `balance = balance - 100`: the arithmetic happens inside the database, atomically, instead of reading, computing in the application and writing back. That alone avoids the lost update at the default level.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The two “C”s are different",
        texto:
          "The C in ACID means “respects the rules”, and the application also defines those rules. The C in the CAP theorem means all nodes see the same data (linearizability). They are not the same concept.",
      },
    ],
    armadilhas: [
      "Believing the database guarantees business consistency alone: it only enforces the rules you declared.",
      "Forgetting that each autocommit statement is its own transaction; two related writes need the same `BEGIN … COMMIT`.",
      "Assuming the default level (read committed) prevents every concurrency problem: a lost update needs an atomic update, `SELECT … FOR UPDATE` or optimistic locking.",
      "Saying “NoSQL has no ACID”: many do, within a limited scope (one document, one partition).",
    ],
    autoteste: [
      {
        pergunta: "Which ACID letter protects against a crash in the middle of a transfer?",
        resposta: "Atomicity (all or nothing). Durability protects after the commit: what was confirmed is not lost.",
      },
      {
        pergunta: "Which anomaly does isolation prevent in the two-simultaneous-withdrawals example?",
        resposta: "The lost update: two transactions read the same balance and the second write overwrites the first.",
      },
    ],
  },
};
