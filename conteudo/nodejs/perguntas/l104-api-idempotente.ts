import type { Pergunta } from "../../tipos";

// L104 · API idempotente
export const l104: Pergunta = {
  numero: 204,
  modulo: "linkedin-arquitetura",
  metodo: "trace",
  pt: {
    titulo: "API idempotente",
    pergunta: "Como você torna uma API idempotente?",
    porqueEsteMetodo:
      "Idempotência só aparece quando algo se repete. Seguir um mesmo pedido que chega duas vezes, inclusive no caminho em que o servidor cai no meio, mostra cada peça do mecanismo e a razão de existir.",
    resposta30s:
      "Uma operação é **idempotente** quando repeti-la tem o mesmo efeito de executá-la uma vez. `GET`, `PUT` e `DELETE` já são; `POST` (criar, cobrar) não. Para torná-lo, o cliente envia uma **`Idempotency-Key`** por intenção, e o servidor grava a chave com uma restrição **`UNIQUE`**, junto da resposta, na mesma transação do efeito; ao ver a chave de novo, devolve a resposta guardada sem executar outra vez. Para evitar processamento duplicado em consumidores de fila, vale o mesmo: registrar o id da mensagem e ignorar as repetidas.",
    blocos: [
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que é idempotente",
        texto:
          "Idempotente é o efeito no servidor, não a resposta. `GET` apenas lê, `PUT` substitui o recurso por um estado dado e `DELETE` deixa o recurso removido: repetir não muda o resultado (o segundo `DELETE` pode devolver `404`, e o estado final é o mesmo). `POST` costuma criar algo novo a cada chamada, e `PATCH` depende: “definir o status como pago” é idempotente, “somar 10 ao saldo” não. É nesses casos que entra a chave de idempotência.",
      },
      {
        tipo: "fluxo",
        titulo: "Um pagamento que chega duas vezes",
        etapas: [
          "O cliente envia `POST /pagamentos` com `Idempotency-Key: 7f3a…`, uma chave nova para cada intenção de pagar, gerada no cliente",
          "A API abre uma transação e tenta inserir a chave numa tabela com `UNIQUE (usuario_id, chave)`: a inserção vence, então este é o primeiro pedido",
          "Na mesma transação, cria o pagamento, grava o status e o corpo da resposta junto da chave e faz o commit",
          "A resposta `201` sai, mas a rede falha e o cliente não a recebe; ele repete o mesmo pedido com a mesma chave",
          "A inserção da chave viola o `UNIQUE`: a API sabe que já viu o pedido, lê a resposta guardada e devolve o mesmo `201`, sem cobrar de novo",
          "Se o segundo pedido chega enquanto o primeiro ainda executa, o banco o faz esperar (ou a API responde `409`) em vez de executar duas vezes",
        ],
        nota: "Se a mesma chave voltar com um corpo diferente, é erro do cliente: recuse com um `4xx` (por exemplo, `422`), conforme o contrato que você definir. O comportamento de espera na etapa 6 varia por banco; confira o do seu.",
      },
      {
        tipo: "passos",
        titulo: "Agora os caminhos em que dá errado",
        passos: [
          {
            titulo: "O servidor cai no meio",
            texto:
              "Se a chave e o efeito estão na mesma transação, ou os dois existem ou nenhum. Se o efeito é externo (um gateway de pagamento), grave a chave como “em andamento” e repasse a mesma chave de idempotência ao serviço externo.",
          },
          {
            titulo: "Dois pedidos ao mesmo tempo",
            texto:
              "Um `SELECT` seguido de `INSERT` deixa os dois passarem juntos. O árbitro é a restrição `UNIQUE` do banco, que aceita uma só inserção.",
          },
          {
            titulo: "O consumidor de fila recebe a mensagem duas vezes",
            texto:
              "Mesmo princípio: guarde o id da mensagem numa tabela de processadas com `UNIQUE`, na transação do efeito, ou use uma operação naturalmente idempotente (um upsert, “definir o status como X”).",
          },
          {
            titulo: "A chave nunca expira",
            texto:
              "Guarde as chaves por um prazo coerente com o tempo em que os clientes reenviam (horas ou dias, conforme o negócio) e limpe depois.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O servidor, em resumo",
        legenda: "JavaScript",
        codigo: [
          'app.post("/pagamentos", async (req, res) => {',
          '  const chave = req.get("Idempotency-Key");',
          '  if (!chave) return res.status(400).json({ erro: "Idempotency-Key obrigatória" });',
          "",
          "  const resposta = await comTransacao(async (tx) => {",
          "    // UNIQUE (usuario_id, chave): só o primeiro pedido consegue inserir",
          "    const inseriu = await tx.inserirChave(req.usuario.id, chave);",
          "    if (!inseriu) return tx.lerResposta(req.usuario.id, chave); // repetido: mesma resposta",
          "",
          "    const pagamento = await tx.criarPagamento(req.body); // efeito e chave: mesma transação",
          "    const nova = { status: 201, corpo: pagamento };",
          "    await tx.guardarResposta(req.usuario.id, chave, nova);",
          "    return nova;",
          "  });",
          "",
          "  res.status(resposta.status).json(resposta.corpo);",
          "});",
        ].join("\n"),
        nota: "`comTransacao` e os métodos de `tx` são auxiliares hipotéticos (BEGIN/COMMIT/ROLLBACK e SQL por baixo). No PostgreSQL, um `INSERT … ON CONFLICT DO NOTHING` espera a transação concorrente com a mesma chave terminar; confira o comportamento do seu banco.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A chave identifica a intenção, não o conteúdo",
        texto:
          "Dois pagamentos iguais de R$ 10, feitos de propósito, não são duplicata. Quem gera a chave é o cliente: o reenvio automático reutiliza a mesma, e uma nova ação deliberada do usuário gera outra. Deduplicar por conteúdo bloquearia pedidos legítimos.",
      },
    ],
    armadilhas: [
      "Verificar com `SELECT` e só então inserir: duas requisições simultâneas passam pela verificação juntas. O árbitro é a restrição `UNIQUE` do banco.",
      "Guardar a chave fora da transação do efeito: se o servidor cai no meio, cobra sem registrar ou registra sem cobrar.",
      "Aceitar a mesma chave com um corpo diferente como se fosse o mesmo pedido: compare uma impressão (hash) do corpo e recuse a divergência.",
      "Guardar as chaves para sempre ou por tempo curto demais: defina um prazo coerente com os reenvios dos clientes e limpe depois.",
    ],
    autoteste: [
      {
        pergunta: "`PUT` e `POST`: qual é idempotente por definição, e por quê?",
        resposta:
          "O `PUT`: ele substitui o recurso por um estado dado, e repetir deixa o mesmo estado. O `POST` costuma criar algo novo a cada chamada, então repetir cria duplicatas, a menos que se use uma chave de idempotência.",
      },
      {
        pergunta: "Como a restrição `UNIQUE` ajuda quando duas instâncias recebem o mesmo pedido ao mesmo tempo?",
        resposta:
          "O banco aceita só uma inserção da chave; a outra falha ou espera, e então lê a resposta guardada. Um `if` na aplicação não dá essa garantia entre processos diferentes.",
      },
    ],
  },
  en: {
    titulo: "Idempotent API",
    pergunta: "How do you make an API idempotent?",
    porqueEsteMetodo:
      "Idempotency only shows up when something repeats. Following one request that arrives twice, including the path where the server crashes midway, shows each piece of the mechanism and why it exists.",
    resposta30s:
      "An operation is **idempotent** when repeating it has the same effect as running it once. `GET`, `PUT` and `DELETE` already are; `POST` (create, charge) is not. To make it so, the client sends an **`Idempotency-Key`** per intent, and the server stores the key with a **`UNIQUE`** constraint, together with the response, in the same transaction as the effect; when it sees the key again, it returns the stored response without running anything twice. Preventing duplicate processing in queue consumers works the same way: record the message id and ignore repeats.",
    blocos: [
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What idempotent means",
        texto:
          "What is idempotent is the effect on the server, not the response. `GET` only reads, `PUT` replaces the resource with a given state and `DELETE` leaves the resource removed: repeating does not change the outcome (the second `DELETE` may return `404`, and the final state is the same). `POST` usually creates something new on each call, and `PATCH` depends: “set the status to paid” is idempotent, “add 10 to the balance” is not. That is where the idempotency key comes in.",
      },
      {
        tipo: "fluxo",
        titulo: "A payment that arrives twice",
        etapas: [
          "The client sends `POST /payments` with `Idempotency-Key: 7f3a…`, a new key for each intent to pay, generated on the client",
          "The API opens a transaction and tries to insert the key into a table with `UNIQUE (user_id, key)`: the insert wins, so this is the first request",
          "In the same transaction, it creates the payment, stores the status and response body next to the key, and commits",
          "The `201` response goes out, but the network fails and the client never receives it; it repeats the same request with the same key",
          "Inserting the key violates the `UNIQUE` constraint: the API knows it has seen the request, reads the stored response and returns the same `201`, without charging again",
          "If the second request arrives while the first is still running, the database makes it wait (or the API replies `409`) instead of running twice",
        ],
        nota: "If the same key comes back with a different body, it is a client error: reject it with a `4xx` (for example, `422`), according to the contract you define. The waiting behavior in step 6 varies by database; check yours.",
      },
      {
        tipo: "passos",
        titulo: "Now the paths where it goes wrong",
        passos: [
          {
            titulo: "The server crashes midway",
            texto:
              "If the key and the effect are in the same transaction, either both exist or neither does. If the effect is external (a payment gateway), store the key as “in progress” and pass the same idempotency key on to the external service.",
          },
          {
            titulo: "Two requests at once",
            texto:
              "A `SELECT` followed by an `INSERT` lets both through together. The referee is the database’s `UNIQUE` constraint, which accepts a single insert.",
          },
          {
            titulo: "The queue consumer gets the message twice",
            texto:
              "Same principle: store the message id in a processed-messages table with `UNIQUE`, in the effect’s transaction, or use a naturally idempotent operation (an upsert, “set the status to X”).",
          },
          {
            titulo: "The key never expires",
            texto:
              "Keep the keys for a period consistent with how long clients resend (hours or days, depending on the business) and clean them up afterwards.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The server, in short",
        legenda: "JavaScript",
        codigo: [
          'app.post("/payments", async (req, res) => {',
          '  const key = req.get("Idempotency-Key");',
          '  if (!key) return res.status(400).json({ error: "Idempotency-Key is required" });',
          "",
          "  const response = await withTransaction(async (tx) => {",
          "    // UNIQUE (user_id, key): only the first request can insert",
          "    const inserted = await tx.insertKey(req.user.id, key);",
          "    if (!inserted) return tx.readResponse(req.user.id, key); // repeat: same response",
          "",
          "    const payment = await tx.createPayment(req.body); // effect and key: same transaction",
          "    const fresh = { status: 201, body: payment };",
          "    await tx.storeResponse(req.user.id, key, fresh);",
          "    return fresh;",
          "  });",
          "",
          "  res.status(response.status).json(response.body);",
          "});",
        ].join("\n"),
        nota: "`withTransaction` and the `tx` methods are hypothetical helpers (BEGIN/COMMIT/ROLLBACK and SQL underneath). In PostgreSQL, an `INSERT … ON CONFLICT DO NOTHING` waits for the concurrent transaction with the same key to finish; check your database’s behavior.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The key identifies the intent, not the content",
        texto:
          "Two identical $10 payments made on purpose are not a duplicate. The client generates the key: an automatic resend reuses the same one, and a new deliberate action by the user generates another. Deduplicating by content would block legitimate requests.",
      },
    ],
    armadilhas: [
      "Checking with a `SELECT` and only then inserting: two simultaneous requests pass the check together. The referee is the database’s `UNIQUE` constraint.",
      "Storing the key outside the effect’s transaction: if the server crashes midway, you charge without recording or record without charging.",
      "Accepting the same key with a different body as if it were the same request: compare a fingerprint (hash) of the body and reject any mismatch.",
      "Keeping keys forever or for too short a time: set a period consistent with how clients resend, and clean up afterwards.",
    ],
    autoteste: [
      {
        pergunta: "`PUT` and `POST`: which is idempotent by definition, and why?",
        resposta:
          "`PUT`: it replaces the resource with a given state, and repeating leaves the same state. `POST` usually creates something new on each call, so repeating creates duplicates unless you use an idempotency key.",
      },
      {
        pergunta: "How does the `UNIQUE` constraint help when two instances receive the same request at the same time?",
        resposta:
          "The database accepts only one insert of the key; the other fails or waits and then reads the stored response. An `if` in the application cannot give that guarantee across different processes.",
      },
    ],
  },
};
