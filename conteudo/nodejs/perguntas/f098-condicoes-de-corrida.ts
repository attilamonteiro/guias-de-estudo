import type { Pergunta } from "../../tipos";

// F98 · Condições de corrida
export const f098: Pergunta = {
  numero: 498,
  modulo: "founditgulf-experientes",
  metodo: "whys",
  pt: {
    titulo: "Condições de corrida",
    pergunta: "Como você lida com condições de corrida (race conditions) no Node.js?",
    porqueEsteMetodo:
      "Condição de corrida soa contraditória em Node.js (“é uma thread só”), então a cadeia de por quês é o melhor caminho: de onde a corrida vem, por que a solução óbvia (uma trava em memória) falha e por que a defesa mora no banco.",
    resposta30s:
      "O JavaScript roda em uma thread, mas **cada `await` cede o controle**: entre ler e gravar, outra requisição pode rodar, e ainda há vários processos e o banco. Por isso o padrão **verifica-depois-age** gera corridas (saldo, estoque, “criar se não existe”). A defesa é tornar verificar-e-agir **atômico no banco** (`UPDATE` condicional, `UNIQUE`, upsert), usar **transações e bloqueios** (otimista com versão, pessimista com `SELECT ... FOR UPDATE`), **idempotência** e, para ordem, uma **fila serial por chave**; o lock distribuído fica como último recurso.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que existem condições de corrida se o JavaScript roda em uma thread?",
            resposta:
              "Porque a thread única garante que dois trechos **síncronos** nunca se intercalam, mas cada `await` devolve o controle ao laço de eventos. Entre uma linha e a seguinte, outra requisição pode rodar inteira. Quando o resultado depende de quem chega primeiro, é uma condição de corrida. O padrão clássico é o **verifica-depois-age**: ler um valor, decidir e gravar em passos separados.",
          },
          {
            pergunta: "Por que o `await` entre a leitura e a escrita é o problema?",
            resposta:
              "Porque abre a janela em que o valor lido fica velho. Duas compras de R$ 80 com saldo de R$ 100: A lê 100, B lê 100, as duas passam na verificação e as duas gravam 20. Foram aprovadas duas compras que o saldo não cobre, e o banco registra só uma. O mesmo vale para vender duas vezes o último item do estoque e para “criar se não existe”, que cria um duplicado.",
          },
          {
            pergunta: "Por que uma trava ou flag em memória não resolve?",
            resposta:
              "Porque em produção há vários processos e instâncias (cluster, contêineres), cada um com a sua memória: a flag protege só um processo, e o pedido concorrente pode cair em outra instância. O banco recebe os dois pedidos ao mesmo tempo. A proteção precisa estar no lugar por onde todos passam. (E uma flag com um `await` entre o teste e a marcação ainda tem a própria corrida.)",
          },
          {
            pergunta: "Por que a defesa mais forte mora no banco?",
            resposta:
              "Porque ele é o único ponto que vê todas as escritas e sabe serializá-las. Faça a condição e a escrita numa **única instrução atômica** (`UPDATE ... WHERE saldo >= valor`), use `UNIQUE` e upsert para “criar se não existe” e, quando a lógica for maior, uma transação com bloqueio pessimista (`SELECT ... FOR UPDATE`) ou otimista (coluna de versão ou `ETag`: se nenhuma linha for afetada, houve conflito e o cliente relê).",
          },
          {
            pergunta: "Por que a atomicidade no banco ainda não basta sempre?",
            resposta:
              "Porque a corrida também aparece em **retentativas** (cliente, fila ou webhook repetem o pedido), na **ordem** (eventos da mesma entidade fora de sequência) e em recursos fora do banco. Para as retentativas, use idempotência (veja L104); para a ordem, uma fila serial por chave, com um consumidor por conta ou pedido; para recursos externos, um lock distribuído (Redis) com cautela, porque ele expira e uma pausa do processo pode deixar dois donos do lock.",
          },
        ],
        causaRaiz:
          "Verificar e agir em **dois passos separados**, com uma pausa no meio e mais de um ator. A defesa é transformar verificar-e-agir em **um único passo atômico**, no lugar por onde todos passam (o banco) e, onde isso não for possível, serializar por chave ou tornar a operação idempotente.",
      },
      {
        tipo: "codigo",
        titulo: "Duas requisições simultâneas: com corrida e atômico",
        legenda: "JavaScript",
        codigo: `// Com corrida: ler, decidir e gravar em passos separados (valores em centavos)
async function debitarComCorrida(id, valor) {
  const { saldo } = await db.contas.obter(id);
  if (saldo < valor) throw new Error("saldo insuficiente");
  await db.contas.atualizar(id, { saldo: saldo - valor }); // outra requisição pode ter passado aqui
}

// Atômico: a condição e a escrita numa única instrução
async function debitar(id, valor) {
  const r = await db.query("UPDATE contas SET saldo = saldo - $1 WHERE id = $2 AND saldo >= $1", [valor, id]);
  if (r.rowCount === 0) throw new Error("saldo insuficiente"); // ninguém foi debitado
}

// Saldo de 10000, duas requisições de 8000 ao mesmo tempo
await Promise.allSettled([debitar(1, 8000), debitar(1, 8000)]); // uma é rejeitada`,
        nota: "O exemplo usa a sintaxe do node-postgres (`pg`), em que `rowCount` é o número de linhas afetadas; outros clientes expõem essa contagem de outra forma. Troque `debitar` por `debitarComCorrida` para ver as duas requisições passarem.",
      },
      {
        tipo: "tabela",
        titulo: "As defesas, da mais forte à mais frágil",
        colunas: ["Defesa", "Como funciona", "Quando usar e limites"],
        linhas: [
          [
            "Operação atômica no banco (`UPDATE` condicional, `UNIQUE`, upsert)",
            "A condição e a escrita viram uma só instrução, e o banco serializa por linha",
            "Primeira escolha: saldo, estoque, contadores, “criar se não existe”. Não cobre lógica longa com várias etapas",
          ],
          [
            "Bloqueio otimista (coluna de versão, `ETag`)",
            "Lê com a versão e grava com `WHERE versao = ?`; nenhuma linha afetada é conflito, e o cliente relê e tenta de novo (ou recebe `409` ou `412`)",
            "Conflitos raros e edição de registros; não segura bloqueio, mas exige tratar a nova tentativa",
          ],
          [
            "Bloqueio pessimista (`SELECT ... FOR UPDATE`)",
            "Dentro de uma transação, trava a linha até o `COMMIT`, e os outros esperam",
            "Conflitos frequentes e lógica mais longa. Cuidado com deadlock e transações longas (veja L95)",
          ],
          [
            "Fila serial por chave",
            "Todas as operações de uma conta ou pedido vão para a mesma fila ou partição, com um consumidor por vez",
            "Garante a ordem por entidade; limita o paralelismo por chave",
          ],
          [
            "Idempotência (chave de idempotência e `UNIQUE`)",
            "Repetir a mesma operação não repete o efeito (veja L104)",
            "Retentativas, webhooks e cliques duplos; não resolve operações diferentes que concorrem",
          ],
          [
            "Lock distribuído (Redis)",
            "Quem pega o lock executa, e ele expira por tempo",
            "Último recurso: expiração e pausas podem gerar dois donos; use um token de cerco (fencing) ou prefira o banco",
          ],
        ],
        nota: "`Atomics` e `SharedArrayBuffer` só coordenam worker threads do mesmo processo (veja L73); não ajudam entre processos.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não adianta “conferir de novo” nem dormir um pouco",
        texto:
          "Mutex em memória, uma segunda verificação antes de gravar e um atraso aleatório só diminuem a chance da corrida, sem eliminá-la, e não funcionam entre instâncias. A prova é um teste: dispare várias requisições simultâneas (`Promise.all`) contra o endpoint e confira o estado final. Se o resultado depende da sorte, a proteção não está no lugar onde todos passam.",
      },
    ],
    armadilhas: [
      "Achar que “o Node.js tem uma thread só” dispensa o cuidado: cada `await` é um ponto em que outra requisição pode se intercalar.",
      "Usar um mutex ou uma flag em memória como solução com várias instâncias: ela protege um processo só.",
      "Fazer `SELECT` seguido de `INSERT` para “criar se não existe”, sem `UNIQUE`: duas requisições simultâneas criam duplicados.",
      "Usar lock distribuído sem expiração e token de cerco, ou manter uma transação aberta durante uma chamada externa lenta: dois donos do lock ou bloqueios longos.",
    ],
    autoteste: [
      {
        pergunta: "O Node.js tem uma thread só. Por que ainda há condições de corrida?",
        resposta:
          "Porque cada `await` devolve o controle ao laço de eventos, e outra requisição pode rodar entre a leitura e a escrita. Além disso, há vários processos e o próprio banco recebendo pedidos ao mesmo tempo.",
      },
      {
        pergunta: "Como debitar um saldo sem permitir saldo negativo com duas requisições simultâneas?",
        resposta:
          "Com uma única instrução atômica no banco: `UPDATE contas SET saldo = saldo - valor WHERE id = ... AND saldo >= valor`. Se nenhuma linha for afetada, o saldo era insuficiente e a operação é recusada.",
      },
    ],
  },
  en: {
    titulo: "Race conditions",
    pergunta: "How do you handle race conditions in Node.js?",
    porqueEsteMetodo:
      "A race condition sounds contradictory in Node.js (“it is a single thread”), so the chain of whys is the best path: where the race comes from, why the obvious fix (an in-memory lock) fails and why the defense lives in the database.",
    resposta30s:
      "JavaScript runs on one thread, but **every `await` yields control**: between reading and writing, another request can run, and there are also several processes and the database. That is why the **check-then-act** pattern creates races (balance, stock, “create if it does not exist”). The defense is to make check-and-act **atomic in the database** (a conditional `UPDATE`, `UNIQUE`, upsert), use **transactions and locks** (optimistic with a version, pessimistic with `SELECT ... FOR UPDATE`), **idempotency** and, for ordering, a **serial queue per key**; a distributed lock is the last resort.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why are there race conditions if JavaScript runs on one thread?",
            resposta:
              "Because the single thread guarantees that two **synchronous** pieces of code never interleave, but every `await` hands control back to the event loop. Between one line and the next, another request can run in full. When the outcome depends on who arrives first, that is a race condition. The classic pattern is **check-then-act**: read a value, decide and write in separate steps.",
          },
          {
            pergunta: "Why is the `await` between the read and the write the problem?",
            resposta:
              "Because it opens a window in which the value you read goes stale. Two purchases of $80 with a balance of $100: A reads 100, B reads 100, both pass the check and both write 20. Two purchases the balance cannot cover were approved, and the database records only one. The same goes for selling the last item in stock twice and for “create if it does not exist”, which creates a duplicate.",
          },
          {
            pergunta: "Why does an in-memory lock or flag not solve it?",
            resposta:
              "Because in production there are several processes and instances (cluster, containers), each with its own memory: the flag protects one process only, and the concurrent request may land on another instance. The database receives both requests at the same time. The protection has to sit where everyone passes. (And a flag with an `await` between the test and the marking has its own race.)",
          },
          {
            pergunta: "Why does the strongest defense live in the database?",
            resposta:
              "Because it is the only point that sees every write and knows how to serialize them. Put the condition and the write in a **single atomic statement** (`UPDATE ... WHERE balance >= amount`), use `UNIQUE` and upsert for “create if it does not exist” and, when the logic is bigger, a transaction with pessimistic locking (`SELECT ... FOR UPDATE`) or optimistic locking (a version column or `ETag`: if no row is affected, there was a conflict and the client re-reads).",
          },
          {
            pergunta: "Why is atomicity in the database still not always enough?",
            resposta:
              "Because the race also shows up in **retries** (a client, queue or webhook repeating the request), in **ordering** (events of the same entity out of sequence) and in resources outside the database. For retries, use idempotency (see L104); for ordering, a serial queue per key, with one consumer per account or order; for external resources, a distributed lock (Redis) with caution, because it expires and a process pause can leave two owners of the lock.",
          },
        ],
        causaRaiz:
          "Checking and acting in **two separate steps**, with a pause in between and more than one actor. The defense is to turn check-and-act into **a single atomic step**, in the place everyone passes through (the database) and, where that is not possible, to serialize by key or make the operation idempotent.",
      },
      {
        tipo: "codigo",
        titulo: "Two simultaneous requests: racy and atomic",
        legenda: "JavaScript",
        codigo: `// Racy: read, decide and write in separate steps (amounts in cents)
async function debitRacy(id, amount) {
  const { balance } = await db.accounts.get(id);
  if (balance < amount) throw new Error("insufficient balance");
  await db.accounts.update(id, { balance: balance - amount }); // another request may have slipped in here
}

// Atomic: the condition and the write in a single statement
async function debit(id, amount) {
  const r = await db.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND balance >= $1", [amount, id]);
  if (r.rowCount === 0) throw new Error("insufficient balance"); // nobody was debited
}

// Balance of 10000, two requests of 8000 at the same time
await Promise.allSettled([debit(1, 8000), debit(1, 8000)]); // one is rejected`,
        nota: "The example uses node-postgres (`pg`) syntax, where `rowCount` is the number of affected rows; other clients expose that count differently. Swap `debit` for `debitRacy` to see both requests go through.",
      },
      {
        tipo: "tabela",
        titulo: "The defenses, from strongest to most fragile",
        colunas: ["Defense", "How it works", "When to use it and limits"],
        linhas: [
          [
            "Atomic database operation (conditional `UPDATE`, `UNIQUE`, upsert)",
            "The condition and the write become one statement, and the database serializes per row",
            "First choice: balance, stock, counters, “create if it does not exist”. It does not cover long logic with several steps",
          ],
          [
            "Optimistic locking (version column, `ETag`)",
            "Reads with the version and writes with `WHERE version = ?`; no affected row is a conflict, and the client re-reads and retries (or gets `409` or `412`)",
            "Rare conflicts and record editing; it holds no lock, but you must handle the retry",
          ],
          [
            "Pessimistic locking (`SELECT ... FOR UPDATE`)",
            "Inside a transaction, it locks the row until `COMMIT`, and others wait",
            "Frequent conflicts and longer logic. Watch for deadlocks and long transactions (see L95)",
          ],
          [
            "Serial queue per key",
            "All operations on one account or order go to the same queue or partition, one consumer at a time",
            "Guarantees order per entity; limits parallelism per key",
          ],
          [
            "Idempotency (idempotency key and `UNIQUE`)",
            "Repeating the same operation does not repeat the effect (see L104)",
            "Retries, webhooks and double clicks; it does not solve different operations that compete",
          ],
          [
            "Distributed lock (Redis)",
            "Whoever takes the lock runs, and it expires after a timeout",
            "Last resort: expiry and pauses can produce two owners; use a fencing token or prefer the database",
          ],
        ],
        nota: "`Atomics` and `SharedArrayBuffer` only coordinate worker threads of the same process (see L73); they do not help across processes.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "“Checking again” or sleeping a little does not help",
        texto:
          "An in-memory mutex, a second check before writing and a random delay only reduce the chance of the race without removing it, and they do not work across instances. The proof is a test: fire several simultaneous requests (`Promise.all`) at the endpoint and check the final state. If the result depends on luck, the protection is not in the place where everyone passes.",
      },
    ],
    armadilhas: [
      "Thinking that “Node.js has a single thread” removes the need for care: every `await` is a point where another request can interleave.",
      "Using an in-memory mutex or flag as the solution with several instances: it protects one process only.",
      "Doing a `SELECT` followed by an `INSERT` for “create if it does not exist”, with no `UNIQUE`: two simultaneous requests create duplicates.",
      "Using a distributed lock without expiry and a fencing token, or keeping a transaction open during a slow external call: two lock owners or long locks.",
    ],
    autoteste: [
      {
        pergunta: "Node.js has a single thread. Why are there still race conditions?",
        resposta:
          "Because every `await` hands control back to the event loop, and another request can run between the read and the write. On top of that, there are several processes and the database itself receiving requests at the same time.",
      },
      {
        pergunta: "How do you debit a balance without allowing a negative balance with two simultaneous requests?",
        resposta:
          "With a single atomic statement in the database: `UPDATE accounts SET balance = balance - amount WHERE id = ... AND balance >= amount`. If no row is affected, the balance was insufficient and the operation is refused.",
      },
    ],
  },
};
