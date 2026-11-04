import type { Pergunta } from "../../tipos";

// L95 · Transações de banco
export const l095: Pergunta = {
  numero: 195,
  modulo: "linkedin-arquitetura",
  metodo: "trace",
  pt: {
    titulo: "Transações de banco",
    pergunta: "Como você lida com transações de banco de dados?",
    porqueEsteMetodo:
      "Uma transação é uma sequência de comandos que precisa se comportar como um só. Seguir uma transferência de saldo do `BEGIN` ao `COMMIT`, e depois o caminho em que algo falha, mostra o que o `ROLLBACK`, o cliente dedicado e a retentativa realmente fazem.",
    resposta30s:
      "Uma **transação** agrupa vários comandos num bloco tudo-ou-nada: `BEGIN`, os comandos, e `COMMIT` se deu certo ou `ROLLBACK` se algo falhou. No Node.js, você pega **um cliente exclusivo do pool**, executa tudo nele com `async`/`await`, desfaz no `catch` e o devolve no `finally`. Sob concorrência, escolha o **isolamento** adequado e **repita a transação inteira** quando o banco a abortar por deadlock; entre serviços não existe transação única, e entram a saga e o outbox.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma transferência de saldo, no caminho feliz",
        etapas: [
          "Chega `POST /transferencias`: pegue um **cliente exclusivo** do pool (`pool.connect()`); todos os comandos da transação precisam usar a mesma conexão",
          "`BEGIN`: a partir daqui, as alterações ficam provisórias e os outros ainda não as enxergam",
          "Um `UPDATE` debita a conta de origem (`saldo = saldo - 100`, só se `saldo >= 100`) e você confere se uma linha foi afetada; outro `UPDATE` credita o destino",
          "Um `INSERT` registra o lançamento no extrato, ainda na mesma transação",
          "`COMMIT`: as três mudanças passam a valer juntas; o `finally` devolve o cliente ao pool e a resposta sai",
        ],
        nota: "Repare no débito feito dentro do próprio `UPDATE` (`saldo = saldo - 100`): o banco faz a conta com a linha travada, em vez de você ler o saldo no JavaScript e gravar o resultado depois, o que permitiria perder uma atualização concorrente.",
      },
      {
        tipo: "passos",
        titulo: "Agora os caminhos em que dá errado",
        passos: [
          {
            titulo: "Falha no meio",
            texto:
              "O débito passou, mas o crédito falha (conta inexistente, erro de rede, restrição violada). O `catch` executa `ROLLBACK` e o débito desaparece: o dinheiro nunca fica “no ar”. Se o processo cair antes do `COMMIT`, o próprio banco desfaz a transação ao perceber a conexão encerrada.",
          },
          {
            titulo: "A regra de negócio recusa",
            texto:
              "Saldo insuficiente aparece no `rowCount` do `UPDATE` do débito; lance um erro para cair no `catch`. Responder com erro sem fazer o `ROLLBACK` deixaria a transação aberta, segurando travas.",
          },
          {
            titulo: "Deadlock ou falha de serialização",
            texto:
              "Duas transferências em sentidos opostos (1→2 e 2→1) travam as mesmas linhas em ordem diferente e esperam uma pela outra. O banco aborta uma delas (no PostgreSQL, SQLSTATE `40P01` para deadlock e `40001` para falha de serialização). Resposta correta: repetir a transação inteira, com limite de tentativas e pausa crescente. Para evitar, trave sempre na mesma ordem (por exemplo, pelo menor id) e mantenha a transação curta.",
          },
          {
            titulo: "Efeito de fora da transação",
            texto:
              "Enviar e-mail ou chamar uma API de pagamento dentro da transação segura travas durante a espera da rede, e um `ROLLBACK` não desfaz o que já saiu. Faça o efeito externo depois do `COMMIT` ou grave o evento na própria transação para publicá-lo depois (outbox, veja abaixo).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um helper de transação com o pool",
        legenda: "JavaScript",
        codigo: [
          "export async function transacao(pool, trabalho) {",
          "  const client = await pool.connect(); // cliente exclusivo",
          "  try {",
          '    await client.query("BEGIN");',
          "    const resultado = await trabalho(client);",
          '    await client.query("COMMIT");',
          "    return resultado;",
          "  } catch (erro) {",
          '    await client.query("ROLLBACK"); // desfaz tudo desde o BEGIN',
          "    throw erro;",
          "  } finally {",
          "    client.release();",
          "  }",
          "}",
          "",
          "await transacao(pool, async (db) => { // transfere 100 da conta 1 para a 2",
          '  const debito = await db.query("UPDATE contas SET saldo = saldo - $1 WHERE id = $2 AND saldo >= $1", [100, 1]);',
          '  if (debito.rowCount === 0) throw new Error("saldo insuficiente");',
          '  await db.query("UPDATE contas SET saldo = saldo + $1 WHERE id = $2", [100, 2]);',
          "});",
        ].join("\n"),
        nota: "Em produção, trate também a falha do próprio `ROLLBACK` (conexão quebrada) e repita a função quando o erro for deadlock ou falha de serialização.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Isolamento: o que as transações enxergam umas das outras",
        texto:
          "Atomicidade é o tudo-ou-nada; **isolamento** define o que uma transação enxerga das concorrentes. Níveis mais fortes (como `REPEATABLE READ` e `SERIALIZABLE`) evitam mais anomalias ao custo de mais conflitos e retentativas, e o nível padrão varia conforme o banco: confira o do seu. Na maioria dos casos, comece pelo padrão e proteja o que importa com operações atômicas (`saldo = saldo - $1`), travas explícitas (`SELECT ... FOR UPDATE`) ou controle otimista (coluna de versão).",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Entre serviços e com ORMs",
        texto:
          "Uma transação vale para **um banco**. Entre serviços não existe `ROLLBACK` global: use uma **saga** (cada passo tem uma ação de compensação) e o padrão **outbox** (gravar o evento na mesma transação do dado e publicá-lo depois; veja L104 e L103). ORMs e construtores de consultas têm a mesma ideia (`prisma.$transaction`, `knex.transaction`, `sequelize.transaction`, `dataSource.transaction` do TypeORM): use o objeto de transação recebido (`tx`, `trx`) em todas as consultas, nunca o cliente global, ou elas rodam fora da transação.",
      },
    ],
    armadilhas: [
      "Usar `pool.query` para cada comando da transação: o pool pode mandar cada um por uma conexão diferente, e o `BEGIN` não vale para os demais.",
      "Esquecer o `ROLLBACK` no `catch` ou o `release()` no `finally`: a conexão volta ao pool com a transação aberta, segurando travas.",
      "Chamar API externa, enviar e-mail ou esperar o usuário dentro da transação: as travas ficam presas e o `ROLLBACK` não desfaz o efeito de fora.",
      "Tratar deadlock como bug raro e deixar o erro subir: sob concorrência ele é esperado, e a resposta é repetir a transação inteira, com limite.",
    ],
    autoteste: [
      {
        pergunta: "Por que a transação precisa de um cliente dedicado em vez de `pool.query`?",
        resposta:
          "Porque a transação pertence a uma conexão. Cada `pool.query` pode usar uma conexão diferente, e o `BEGIN`, o `COMMIT` e o `ROLLBACK` só valem na conexão em que foram enviados.",
      },
      {
        pergunta: "O que fazer ao receber um erro de deadlock ou de falha de serialização?",
        resposta:
          "O banco já desfez essa transação. Repita a função inteira, a partir do `BEGIN`, com limite de tentativas e pausa crescente (com variação aleatória), e garanta que o que ela faz possa ser repetido sem efeito duplicado.",
      },
    ],
  },
  en: {
    titulo: "Database transactions",
    pergunta: "How do you handle database transactions?",
    porqueEsteMetodo:
      "A transaction is a sequence of commands that must behave as one. Following a balance transfer from `BEGIN` to `COMMIT`, and then the paths where something fails, shows what `ROLLBACK`, the dedicated client and the retry actually do.",
    resposta30s:
      "A **transaction** groups several commands into an all-or-nothing block: `BEGIN`, the commands, then `COMMIT` if it worked or `ROLLBACK` if something failed. In Node.js, you take **an exclusive client from the pool**, run everything on it with `async`/`await`, undo in the `catch` and give it back in the `finally`. Under concurrency, pick the right **isolation** and **retry the whole transaction** when the database aborts it for a deadlock; across services there is no single transaction, so sagas and the outbox come in.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A balance transfer, on the happy path",
        etapas: [
          "`POST /transfers` arrives: take an **exclusive client** from the pool (`pool.connect()`); every command in the transaction must use the same connection",
          "`BEGIN`: from here on, changes are provisional and others do not see them yet",
          "An `UPDATE` debits the source account (`balance = balance - 100`, only if `balance >= 100`) and you check that one row was affected; another `UPDATE` credits the destination",
          "An `INSERT` records the entry in the statement, still in the same transaction",
          "`COMMIT`: the three changes take effect together; the `finally` returns the client to the pool and the response goes out",
        ],
        nota: "Note that the debit happens inside the `UPDATE` itself (`balance = balance - 100`): the database does the math with the row locked, instead of you reading the balance in JavaScript and writing the result back later, which could lose a concurrent update.",
      },
      {
        tipo: "passos",
        titulo: "Now the paths where it goes wrong",
        passos: [
          {
            titulo: "Failure midway",
            texto:
              "The debit went through, but the credit fails (missing account, network error, violated constraint). The `catch` runs `ROLLBACK` and the debit disappears: the money is never left “in the air”. If the process dies before `COMMIT`, the database itself undoes the transaction when it notices the connection closed.",
          },
          {
            titulo: "A business rule refuses",
            texto:
              "Insufficient balance shows up in the debit `UPDATE`’s `rowCount`; throw an error to land in the `catch`. Answering with an error without doing the `ROLLBACK` would leave the transaction open, holding locks.",
          },
          {
            titulo: "Deadlock or serialization failure",
            texto:
              "Two transfers in opposite directions (1→2 and 2→1) lock the same rows in a different order and wait for each other. The database aborts one of them (in PostgreSQL, SQLSTATE `40P01` for a deadlock and `40001` for a serialization failure). The right response: retry the whole transaction, with a cap on attempts and a growing pause. To avoid it, always lock in the same order (for example, lowest id first) and keep the transaction short.",
          },
          {
            titulo: "A side effect outside the transaction",
            texto:
              "Sending an email or calling a payment API inside the transaction holds locks while the network responds, and a `ROLLBACK` does not undo what already left. Do the external effect after the `COMMIT`, or write the event in the same transaction and publish it later (outbox, see below).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A transaction helper built on the pool",
        legenda: "JavaScript",
        codigo: [
          "export async function transaction(pool, work) {",
          "  const client = await pool.connect(); // exclusive client",
          "  try {",
          '    await client.query("BEGIN");',
          "    const result = await work(client);",
          '    await client.query("COMMIT");',
          "    return result;",
          "  } catch (error) {",
          '    await client.query("ROLLBACK"); // undoes everything since BEGIN',
          "    throw error;",
          "  } finally {",
          "    client.release();",
          "  }",
          "}",
          "",
          "await transaction(pool, async (db) => { // transfers 100 from account 1 to 2",
          '  const debit = await db.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND balance >= $1", [100, 1]);',
          '  if (debit.rowCount === 0) throw new Error("insufficient balance");',
          '  await db.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [100, 2]);',
          "});",
        ].join("\n"),
        nota: "In production, also handle a failure of the `ROLLBACK` itself (broken connection) and rerun the function when the error is a deadlock or a serialization failure.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Isolation: what transactions see of each other",
        texto:
          "Atomicity is the all-or-nothing; **isolation** defines what a transaction sees of the concurrent ones. Stronger levels (such as `REPEATABLE READ` and `SERIALIZABLE`) prevent more anomalies at the cost of more conflicts and retries, and the default level varies by database: check yours. In most cases, start from the default and protect what matters with atomic operations (`balance = balance - $1`), explicit locks (`SELECT ... FOR UPDATE`) or optimistic control (a version column).",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Across services and with ORMs",
        texto:
          "A transaction covers **one database**. Across services there is no global `ROLLBACK`: use a **saga** (each step has a compensating action) and the **outbox** pattern (write the event in the same transaction as the data and publish it later; see L104 and L103). ORMs and query builders have the same idea (`prisma.$transaction`, `knex.transaction`, `sequelize.transaction`, TypeORM’s `dataSource.transaction`): use the transaction object you receive (`tx`, `trx`) in every query, never the global client, or they run outside the transaction.",
      },
    ],
    armadilhas: [
      "Using `pool.query` for each command of the transaction: the pool may send each one over a different connection, and the `BEGIN` does not apply to the others.",
      "Forgetting the `ROLLBACK` in the `catch` or the `release()` in the `finally`: the connection goes back to the pool with the transaction open, holding locks.",
      "Calling an external API, sending an email or waiting for the user inside the transaction: locks stay held and the `ROLLBACK` does not undo the outside effect.",
      "Treating a deadlock as a rare bug and letting the error bubble up: under concurrency it is expected, and the response is to retry the whole transaction, with a cap.",
    ],
    autoteste: [
      {
        pergunta: "Why does a transaction need a dedicated client instead of `pool.query`?",
        resposta:
          "Because a transaction belongs to one connection. Each `pool.query` may use a different connection, and `BEGIN`, `COMMIT` and `ROLLBACK` only apply on the connection where they were sent.",
      },
      {
        pergunta: "What should you do when you get a deadlock or serialization failure error?",
        resposta:
          "The database already undid that transaction. Rerun the whole function from the `BEGIN`, with a cap on attempts and a growing pause (with random jitter), and make sure what it does can be repeated without a duplicate effect.",
      },
    ],
  },
};
