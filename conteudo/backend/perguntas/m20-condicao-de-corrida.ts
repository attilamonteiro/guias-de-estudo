import type { Pergunta } from "../../tipos";

// M20 · Condição de corrida
export const m20: Pergunta = {
  numero: 220,
  modulo: "mentorcruise",
  metodo: "trace",
  pt: {
    titulo: "Condição de corrida",
    pergunta: "Você pode explicar o que é uma condição de corrida e como evitá-la?",
    porqueEsteMetodo:
      "Uma condição de corrida só existe quando duas execuções se intercalam, e descrevê-la em abstrato convence pouco. Seguir dois pedidos passo a passo numa linha do tempo mostra onde nasce o resultado errado e qual correção fecha essa brecha.",
    resposta30s:
      "É quando o resultado depende da **ordem de intercalação** de operações concorrentes sobre um estado compartilhado, tipicamente num padrão **verifica-e-age** (lê, decide, grava) que não é atômico. Previne-se juntando a verificação e a ação numa só operação: `UPDATE` atômico condicional, transação com `SELECT … FOR UPDATE` ou isolamento adequado, trava otimista com coluna de versão ou restrição `UNIQUE`. Onde há retentativa, some **idempotência**. Para detectar, use testes de estresse concorrentes.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Dois saques de R$ 80 numa conta com R$ 100",
        colunas: ["Instante", "Pedido A", "Pedido B", "Saldo no banco"],
        linhas: [
          ["t1", "`SELECT saldo` devolve 100", "aguardando", "100"],
          ["t2", "aguardando", "`SELECT saldo` devolve 100", "100"],
          ["t3", "100 ≥ 80: aprovado", "100 ≥ 80: aprovado", "100"],
          ["t4", "`UPDATE` grava saldo = 20", "aguardando", "20"],
          ["t5", "aguardando", "`UPDATE` grava saldo = 20", "20"],
          ["t6", "Responde: sucesso", "Responde: sucesso", "20"],
        ],
        nota: "Saíram R$ 160 de uma conta com R$ 100, e o saldo final diz 20, como se só um saque tivesse ocorrido. O segundo `UPDATE` gravou um valor calculado a partir de uma leitura que já estava velha (atualização perdida). Nenhum dos dois pedidos tem erro isolado: o defeito está na intercalação.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A causa: verificar e agir são dois passos",
        texto:
          "Todo “ler, decidir, gravar” fora de uma unidade atômica deixa uma janela entre a leitura e a gravação. Toda correção fecha essa janela de um destes jeitos: **junta** os passos numa operação só, **faz um pedido esperar** o outro, ou **detecta o conflito** e desfaz ou repete. Não confunda “data race” (acesso à memória sem sincronização) com “race condition” (lógica que depende da ordem): são parentes, e a segunda acontece também em linguagens sem data races, até entre processos e servidores.",
      },
      {
        tipo: "passos",
        titulo: "A mesma disputa, com a correção mais simples",
        passos: [
          {
            titulo: "A envia o UPDATE condicional",
            texto:
              "`UPDATE contas SET saldo = saldo - 80 WHERE id = 1 AND saldo >= 80`. O banco trava a linha, confere a condição (100 ≥ 80) e grava 20 numa única instrução.",
          },
          {
            titulo: "B envia o mesmo UPDATE ao mesmo tempo",
            texto: "Ele chega à mesma linha e espera, porque A ainda segura a trava até confirmar.",
          },
          {
            titulo: "B reavalia a condição",
            texto:
              "Com a linha liberada, a condição `saldo >= 80` é conferida sobre o valor novo (20): falsa, **0 linhas afetadas**. O comportamento exato depende do banco e do nível de isolamento; em alguns casos o banco aborta B e a aplicação retenta.",
          },
          {
            titulo: "A aplicação lê o número de linhas afetadas",
            texto:
              "A responde sucesso; B responde “saldo insuficiente”. Resultado: um único saque, saldo 20, sem trava explícita nem laço de retentativa.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "As ferramentas, da mais próxima do dado à mais distante",
        colunas: ["Técnica", "Como funciona", "Cuidado"],
        linhas: [
          [
            "`UPDATE` atômico condicional",
            "A regra vira condição do `WHERE`; 0 linhas afetadas significa recusar",
            "Só serve quando a regra cabe numa instrução",
          ],
          [
            "Transação com trava de linha",
            "`BEGIN; SELECT … FOR UPDATE; … UPDATE; COMMIT;` faz o segundo pedido esperar o primeiro",
            "Transações curtas e ordem consistente das travas, ou surgem deadlocks (veja Q09)",
          ],
          [
            "Nível de isolamento",
            "Níveis mais fortes (como `SERIALIZABLE`) fazem o banco abortar uma das transações em conflito",
            "A garantia de cada nível varia por banco; exige retentar quando a transação é abortada",
          ],
          [
            "Trava otimista",
            "Coluna de versão: `UPDATE … WHERE id = ? AND versao = ?`; 0 linhas significa conflito, então recarregue e tente de novo (veja R46)",
            "Exige tratar o conflito; ruim quando a disputa é constante",
          ],
          [
            "Restrição `UNIQUE`",
            "Para “criar se não existir” (e-mail, cupom, um assento por reserva): o banco rejeita o segundo `INSERT`",
            "Tratar a violação como “já existe”; use o upsert do banco (`ON CONFLICT`, `ON DUPLICATE KEY`)",
          ],
          [
            "Mutex em processo",
            "Protege memória compartilhada entre threads do mesmo processo",
            "Não protege nada entre várias instâncias da aplicação",
          ],
          [
            "Trava distribuída",
            "Um serviço de coordenação (como Redis, etcd ou ZooKeeper) concede uma trava a um dono por vez",
            "A trava expira e o dono pode ter pausado: sem um token de fencing, ele age mesmo depois de perdê-la. Prefira a garantia do banco",
          ],
          [
            "Idempotência",
            "Chave de idempotência por operação: repetir o pedido não repete o efeito (veja Q30)",
            "Resolve a duplicação por retentativa; não substitui a atomicidade",
          ],
          [
            "Serializar por chave com fila",
            "Pedidos da mesma conta vão para a mesma fila ou partição, processada por um consumidor por vez",
            "A ordem só vale dentro da chave; acrescenta latência e uma peça de infraestrutura",
          ],
        ],
        nota: "Regra de escolha: use a garantia mais próxima do dado (condição atômica, restrição, trava do banco) antes de recorrer a coordenação externa.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Como detectar",
        texto:
          "Corridas são intermitentes e somem no teste simples. Dispare muitos pedidos simultâneos contra o mesmo recurso (por exemplo, 50 saques de R$ 80 em paralelo numa conta de R$ 100) e confira os invariantes: o saldo nunca fica negativo e só um saque tem sucesso. Use uma barreira para largar todos juntos e, se preciso, introduza atrasos entre a verificação e a ação. Os detectores de data race da linguagem (como o `-race` do Go ou o ThreadSanitizer) pegam corridas em memória, mas não as lógicas no banco.",
      },
    ],
    armadilhas: [
      "Verificar na aplicação e gravar depois (`if saldo >= valor`): a janela entre ler e gravar é exatamente a corrida.",
      "Achar que envolver tudo numa transação basta: sem trava ou isolamento adequado, os dois pedidos ainda leem o mesmo valor antigo.",
      "Usar mutex em memória com várias instâncias da aplicação: cada processo tem o seu, e nenhum enxerga o outro.",
      "Confiar numa trava distribuída sem pensar na expiração: o dono pode perdê-la (pausa longa, relógio) e continuar agindo.",
    ],
    autoteste: [
      {
        pergunta: "Por que `UPDATE … SET saldo = saldo - 80 WHERE saldo >= 80` resolve o saque duplo?",
        resposta:
          "Porque verifica e age numa única instrução atômica: o banco trava a linha, o segundo pedido espera e reavalia a condição sobre o valor já atualizado.",
      },
      {
        pergunta: "Quando preferir uma restrição `UNIQUE` a uma trava?",
        resposta:
          "Quando a regra é de unicidade (um cupom por pedido, um e-mail por conta): o banco garante isso mesmo com várias instâncias, e a violação é tratada como “já existe”.",
      },
      {
        pergunta: "Por que um mutex em memória não resolve numa aplicação com várias instâncias?",
        resposta:
          "Ele só protege threads do mesmo processo; as outras instâncias têm o próprio mutex e acessam o mesmo banco ao mesmo tempo.",
      },
    ],
  },
  en: {
    titulo: "Race condition",
    pergunta: "Can you explain what a race condition is and how to prevent it?",
    porqueEsteMetodo:
      "A race condition only exists when two executions interleave, and describing it in the abstract convinces few people. Following two requests step by step on a timeline shows where the wrong result is born and which fix closes the gap.",
    resposta30s:
      "It happens when the result depends on the **order of interleaving** of concurrent operations on shared state, typically in a **check-then-act** pattern (read, decide, write) that is not atomic. You prevent it by merging the check and the action into one operation: a conditional atomic `UPDATE`, a transaction with `SELECT … FOR UPDATE` or suitable isolation, optimistic locking with a version column, or a `UNIQUE` constraint. Where retries exist, add **idempotency**. To detect it, use concurrent stress tests.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Two withdrawals of $80 from an account holding $100",
        colunas: ["Time", "Request A", "Request B", "Balance in the database"],
        linhas: [
          ["t1", "`SELECT balance` returns 100", "waiting", "100"],
          ["t2", "waiting", "`SELECT balance` returns 100", "100"],
          ["t3", "100 ≥ 80: approved", "100 ≥ 80: approved", "100"],
          ["t4", "`UPDATE` writes balance = 20", "waiting", "20"],
          ["t5", "waiting", "`UPDATE` writes balance = 20", "20"],
          ["t6", "Responds: success", "Responds: success", "20"],
        ],
        nota: "$160 left an account holding $100, and the final balance says 20, as if only one withdrawal had happened. The second `UPDATE` wrote a value computed from a read that was already stale (a lost update). Neither request is wrong on its own: the defect is in the interleaving.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The cause: checking and acting are two steps",
        texto:
          "Every “read, decide, write” outside an atomic unit leaves a window between the read and the write. Every fix closes that window in one of these ways: it **merges** the steps into one operation, **makes one request wait** for the other, or **detects the conflict** and undoes or repeats. Do not confuse a “data race” (memory access without synchronization) with a “race condition” (logic that depends on ordering): they are relatives, and the second also happens in languages without data races, even across processes and servers.",
      },
      {
        tipo: "passos",
        titulo: "The same contest, with the simplest fix",
        passos: [
          {
            titulo: "A sends the conditional UPDATE",
            texto:
              "`UPDATE accounts SET balance = balance - 80 WHERE id = 1 AND balance >= 80`. The database locks the row, checks the condition (100 ≥ 80) and writes 20 in a single statement.",
          },
          {
            titulo: "B sends the same UPDATE at the same time",
            texto: "It reaches the same row and waits, because A still holds the lock until it commits.",
          },
          {
            titulo: "B re-evaluates the condition",
            texto:
              "With the row released, the condition `balance >= 80` is checked against the new value (20): false, **0 rows affected**. The exact behavior depends on the database and the isolation level; in some cases the database aborts B and the application retries.",
          },
          {
            titulo: "The application reads the affected-row count",
            texto:
              "A answers success; B answers “insufficient balance”. Result: a single withdrawal, balance 20, with no explicit lock and no retry loop.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "The tools, from closest to the data to furthest",
        colunas: ["Technique", "How it works", "Watch out for"],
        linhas: [
          [
            "Conditional atomic `UPDATE`",
            "The rule becomes a `WHERE` condition; 0 affected rows means refuse",
            "Only works when the rule fits in one statement",
          ],
          [
            "Transaction with a row lock",
            "`BEGIN; SELECT … FOR UPDATE; … UPDATE; COMMIT;` makes the second request wait for the first",
            "Short transactions and a consistent lock order, or deadlocks appear (see Q09)",
          ],
          [
            "Isolation level",
            "Stronger levels (such as `SERIALIZABLE`) make the database abort one of the conflicting transactions",
            "What each level guarantees varies by database; you must retry when a transaction is aborted",
          ],
          [
            "Optimistic locking",
            "A version column: `UPDATE … WHERE id = ? AND version = ?`; 0 rows means a conflict, so reload and try again (see R46)",
            "You must handle the conflict; poor when contention is constant",
          ],
          [
            "`UNIQUE` constraint",
            "For “create if it does not exist” (e-mail, coupon, one seat per booking): the database rejects the second `INSERT`",
            "Treat the violation as “already exists”; use the database’s upsert (`ON CONFLICT`, `ON DUPLICATE KEY`)",
          ],
          [
            "In-process mutex",
            "Protects shared memory between threads of the same process",
            "Protects nothing across multiple application instances",
          ],
          [
            "Distributed lock",
            "A coordination service (such as Redis, etcd or ZooKeeper) grants a lock to one owner at a time",
            "The lock expires and the owner may have paused: without a fencing token, it acts even after losing it. Prefer the database’s guarantee",
          ],
          [
            "Idempotency",
            "An idempotency key per operation: repeating the request does not repeat the effect (see Q30)",
            "Solves duplication from retries; it does not replace atomicity",
          ],
          [
            "Serializing by key with a queue",
            "Requests for the same account go to the same queue or partition, handled by one consumer at a time",
            "Order only holds within the key; adds latency and one more piece of infrastructure",
          ],
        ],
        nota: "Rule of choice: use the guarantee closest to the data (atomic condition, constraint, database lock) before reaching for external coordination.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "How to detect it",
        texto:
          "Races are intermittent and vanish in a simple test. Fire many simultaneous requests at the same resource (for example, 50 withdrawals of $80 in parallel against a $100 account) and check the invariants: the balance never goes negative and only one withdrawal succeeds. Use a barrier to release them all together and, if needed, inject delays between the check and the action. A language’s data race detectors (such as Go’s `-race` or ThreadSanitizer) catch races in memory, but not logical ones in the database.",
      },
    ],
    armadilhas: [
      "Checking in the application and writing later (`if balance >= amount`): the window between reading and writing is precisely the race.",
      "Thinking that wrapping everything in a transaction is enough: without a lock or suitable isolation, both requests still read the same old value.",
      "Using an in-memory mutex with several application instances: each process has its own, and none sees the other.",
      "Trusting a distributed lock without thinking about expiry: the owner can lose it (a long pause, clock issues) and keep acting.",
    ],
    autoteste: [
      {
        pergunta: "Why does `UPDATE … SET balance = balance - 80 WHERE balance >= 80` solve the double withdrawal?",
        resposta:
          "Because it checks and acts in a single atomic statement: the database locks the row, the second request waits and re-evaluates the condition against the already updated value.",
      },
      {
        pergunta: "When would you prefer a `UNIQUE` constraint to a lock?",
        resposta:
          "When the rule is about uniqueness (one coupon per order, one e-mail per account): the database enforces it even with many instances, and the violation is handled as “already exists”.",
      },
      {
        pergunta: "Why does an in-memory mutex not solve it in an application with several instances?",
        resposta:
          "It only protects threads of the same process; the other instances have their own mutex and hit the same database at the same time.",
      },
    ],
  },
};
