import type { Pergunta } from "../../tipos";

// Q09 · Evitar deadlocks
export const q09: Pergunta = {
  numero: 9,
  modulo: "bancos-de-dados",
  metodo: "whys",
  pt: {
    titulo: "Evitar deadlocks",
    pergunta: "Como evitar deadlocks em um banco de dados relacional?",
    porqueEsteMetodo:
      "Deadlock se previne removendo a causa. Perguntar “por quê?” repetidamente leva até a espera circular, e é dela que sai toda a lista de prevenções.",
    resposta30s:
      "Deadlock é quando duas (ou mais) transações seguram, cada uma, um bloqueio de que a outra precisa e esperam para sempre; o banco detecta o ciclo e aborta uma delas. Previna quebrando a **espera circular**: adquira bloqueios sempre na **mesma ordem**, mantenha transações **curtas**, toque o mínimo de linhas (com bons índices) e, como não dá para zerar o risco, **repita a transação** quando receber o erro de deadlock.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o deadlock acontece?",
            resposta:
              "Porque T1 segura o lock da linha A e quer B, enquanto T2 segura B e quer A. Cada uma espera a outra: espera circular.",
          },
          {
            pergunta: "Por que cada uma pegou os locks em ordem diferente?",
            resposta:
              "Porque caminhos de código distintos (API, job, tela administrativa) tocam as mesmas linhas em sequências diferentes: um atualiza origem → destino, outro destino → origem.",
          },
          {
            pergunta: "Por que elas ficam segurando os locks enquanto esperam?",
            resposta:
              "Porque o banco mantém os locks até o fim da transação (two-phase locking): só se liberam no `COMMIT` ou `ROLLBACK`. Quanto mais longa a transação, maior a janela de colisão.",
          },
          {
            pergunta: "Por que as transações demoram ou travam mais linhas do que o necessário?",
            resposta:
              "Falta de índice (a varredura trava muitas linhas), chamadas HTTP ou espera de usuário dentro da transação, lotes grandes numa só transação.",
          },
          {
            pergunta: "Por que, então, a prevenção é quebrar a espera circular?",
            resposta:
              "Deadlock exige quatro condições juntas (Coffman): exclusão mútua, “segura e espera”, sem preempção e espera circular. A mais fácil de eliminar na prática é a circular, impondo uma ordem global.",
          },
        ],
        causaRaiz:
          "Deadlock = ordem inconsistente de bloqueios + transações longas. Conserte a ordem e o tempo; para o resto, tenha **retentativa**.",
      },
      {
        tipo: "passos",
        titulo: "Prevenção, em ordem de custo-benefício",
        passos: [
          {
            titulo: "Ordem consistente de acesso",
            texto:
              "Sempre atualize linhas e tabelas na mesma sequência (por exemplo, ordenando os IDs antes de travar).",
          },
          {
            titulo: "Transações curtas",
            texto: "Nada de I/O externo, espera de usuário ou processamento pesado entre `BEGIN` e `COMMIT`.",
          },
          {
            titulo: "Menos linhas, bons índices",
            texto: "Uma consulta sem índice varre e trava mais linhas do que precisa.",
          },
          {
            titulo: "Tipo de lock certo",
            texto:
              "`SELECT … FOR UPDATE NOWAIT` ou `SKIP LOCKED` para não esperar; lock otimista (coluna `versao`) onde há pouca disputa; `lock_timeout` para limitar a espera.",
          },
          {
            titulo: "Retentativa automática",
            texto:
              "Ao receber o erro de deadlock (`40P01` no Postgres, `1213` no MySQL), repita a transação inteira com um pequeno atraso.",
          },
          {
            titulo: "Diagnóstico",
            texto:
              "Ligue o log de deadlocks e leia o grafo (`pg_locks`, `SHOW ENGINE INNODB STATUS`) para achar quais consultas colidem.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Ordem inconsistente (deadlock) vs ordem fixa",
        legenda: "sql",
        codigo:
          "-- T1: transfere 1 -> 2            -- T2: transfere 2 -> 1\nUPDATE contas ... WHERE id = 1;    UPDATE contas ... WHERE id = 2;\nUPDATE contas ... WHERE id = 2;    UPDATE contas ... WHERE id = 1;   -- ciclo!\n\n-- Correção: ambas travam em ordem crescente de id\nSELECT id FROM contas WHERE id IN (1, 2) ORDER BY id FOR UPDATE;",
      },
    ],
    armadilhas: [
      "Prometer “eliminar” deadlocks: sob concorrência alta eles acontecem; o objetivo é reduzi-los e tratar o erro.",
      "Resolver só com timeout: ele limita a espera, mas a causa (ordem e duração) continua.",
      "Confundir deadlock com contenção de lock: na contenção a espera termina quando o outro faz commit; no deadlock nunca termina sozinha.",
      "Não repetir a transação: o usuário vê um erro 500 por algo que uma segunda tentativa resolveria.",
    ],
    autoteste: [
      {
        pergunta: "Como o banco “resolve” um deadlock?",
        resposta:
          "Detecta o ciclo de espera, escolhe uma transação como vítima, desfaz (rollback) e devolve um erro; as outras seguem.",
      },
      {
        pergunta: "Qual a medida preventiva mais simples e mais eficaz?",
        resposta:
          "Padronizar a ordem em que as transações adquirem os bloqueios (por exemplo, sempre por ID crescente).",
      },
    ],
  },
  en: {
    titulo: "Avoiding deadlocks",
    pergunta: "How do you avoid deadlocks in a relational database?",
    porqueEsteMetodo:
      "Deadlocks are prevented by removing the cause. Asking “why?” repeatedly leads to circular wait, and the entire list of preventions comes out of it.",
    resposta30s:
      "A deadlock is when two (or more) transactions each hold a lock the other needs and wait forever; the database detects the cycle and aborts one. Prevent it by breaking the **circular wait**: acquire locks always in the **same order**, keep transactions **short**, touch as few rows as possible (with good indexes) and, since risk cannot be zeroed, **retry the transaction** when you get the deadlock error.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does the deadlock happen?",
            resposta:
              "Because T1 holds the lock on row A and wants B, while T2 holds B and wants A. Each waits for the other: circular wait.",
          },
          {
            pergunta: "Why did each take locks in a different order?",
            resposta:
              "Because different code paths (API, job, admin screen) touch the same rows in different sequences: one updates source → target, another target → source.",
          },
          {
            pergunta: "Why do they keep holding locks while waiting?",
            resposta:
              "Because the database keeps locks until the end of the transaction (two-phase locking): they are released only on `COMMIT` or `ROLLBACK`. The longer the transaction, the bigger the collision window.",
          },
          {
            pergunta: "Why do transactions run long or lock more rows than needed?",
            resposta:
              "Missing indexes (the scan locks many rows), HTTP calls or user waits inside the transaction, big batches in a single transaction.",
          },
          {
            pergunta: "Why, then, is prevention about breaking circular wait?",
            resposta:
              "A deadlock needs four conditions together (Coffman): mutual exclusion, hold-and-wait, no preemption and circular wait. The easiest to eliminate in practice is circular wait, by imposing a global order.",
          },
        ],
        causaRaiz:
          "Deadlock = inconsistent lock order + long transactions. Fix the order and the duration; for the rest, have a **retry**.",
      },
      {
        tipo: "passos",
        titulo: "Prevention, in order of cost-benefit",
        passos: [
          {
            titulo: "Consistent access order",
            texto: "Always update rows and tables in the same sequence (for example, sorting the IDs before locking).",
          },
          {
            titulo: "Short transactions",
            texto: "No external I/O, user waits or heavy processing between `BEGIN` and `COMMIT`.",
          },
          {
            titulo: "Fewer rows, good indexes",
            texto: "A query without an index scans and locks more rows than it needs.",
          },
          {
            titulo: "The right lock type",
            texto:
              "`SELECT … FOR UPDATE NOWAIT` or `SKIP LOCKED` to avoid waiting; optimistic locking (a `version` column) where contention is low; `lock_timeout` to cap the wait.",
          },
          {
            titulo: "Automatic retry",
            texto:
              "On the deadlock error (`40P01` in Postgres, `1213` in MySQL), repeat the whole transaction after a small delay.",
          },
          {
            titulo: "Diagnosis",
            texto:
              "Turn on deadlock logging and read the graph (`pg_locks`, `SHOW ENGINE INNODB STATUS`) to find which queries collide.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Inconsistent order (deadlock) vs fixed order",
        legenda: "sql",
        codigo:
          "-- T1: transfers 1 -> 2            -- T2: transfers 2 -> 1\nUPDATE accounts ... WHERE id = 1;  UPDATE accounts ... WHERE id = 2;\nUPDATE accounts ... WHERE id = 2;  UPDATE accounts ... WHERE id = 1;  -- cycle!\n\n-- Fix: both lock in ascending id order\nSELECT id FROM accounts WHERE id IN (1, 2) ORDER BY id FOR UPDATE;",
      },
    ],
    armadilhas: [
      "Promising to “eliminate” deadlocks: under high concurrency they happen; the goal is to reduce them and handle the error.",
      "Solving it with a timeout alone: it caps the wait, but the cause (order and duration) remains.",
      "Confusing deadlock with lock contention: in contention the wait ends when the other commits; in a deadlock it never ends on its own.",
      "Not retrying the transaction: the user sees a 500 for something a second attempt would solve.",
    ],
    autoteste: [
      {
        pergunta: "How does the database “resolve” a deadlock?",
        resposta:
          "It detects the wait cycle, picks one transaction as the victim, rolls it back and returns an error; the others proceed.",
      },
      {
        pergunta: "What is the simplest and most effective preventive measure?",
        resposta: "Standardize the order in which transactions acquire locks (for example, always by ascending ID).",
      },
    ],
  },
};
