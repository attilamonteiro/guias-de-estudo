import type { Pergunta } from "../../tipos";

// P61 · Locks distribuídos
export const p061: Pergunta = {
  numero: 761,
  modulo: "pawanmkr-distribuidos",
  metodo: "trace",
  pt: {
    titulo: "Locks distribuídos",
    pergunta: "Como funcionam os locks distribuídos e quando você os usaria?",
    porqueEsteMetodo:
      "Um lock distribuído parece simples até você seguir uma aquisição e ver o que acontece quando o dono pausa. O rastro do caminho feliz e do caminho infeliz mostra por que existem o TTL, o token do dono e o fencing.",
    resposta30s:
      "Um **lock distribuído** é uma exclusão mútua entre processos em máquinas diferentes, quase sempre com **TTL**: o cliente grava uma chave única só se ela não existir (no Redis, `SET chave valor NX PX ttl`), executa a seção crítica e libera **apenas se o valor ainda for o seu**. Como o TTL pode expirar durante uma pausa e outro cliente assumir, a correção estrita pede um **fencing token** verificado pelo recurso. E, sempre que possível, prefira evitar o lock: idempotência, `UPDATE` condicional ou fila serial por chave.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A aquisição, no caminho feliz",
        etapas: [
          "O cliente A quer gerar a fatura 42 sem que mais ninguém o faça ao mesmo tempo. Cria um **token único** (um UUID) e executa `SET lock:fatura:42 <tokenA> NX PX 30000`",
          "`NX` grava só se a chave não existir; `PX 30000` faz a chave expirar em 30 segundos. O Redis responde `OK`: A é o dono",
          "O cliente B tenta o mesmo `SET` e recebe `nil`: o lock está ocupado. B espera e tenta de novo, ou desiste",
          "A executa a seção crítica (gera a fatura)",
          "A libera o lock com um script atômico: apaga a chave **somente se o valor ainda for `<tokenA>`**",
          "Agora B consegue adquirir",
        ],
        nota: "O TTL existe para o lock não ficar preso para sempre se A morrer no meio. Mas é ele mesmo que cria o problema da próxima seção.",
      },
      {
        tipo: "passos",
        titulo: "Quando algo dá errado",
        passos: [
          {
            titulo: "A pausa",
            texto:
              "Depois de adquirir, o processo de A para por mais de 30 segundos: uma coleta de lixo longa, uma VM congelada, uma rede lenta, um laço que bloqueou o event loop. A não percebe, porque do seu ponto de vista o tempo não passou.",
          },
          {
            titulo: "O TTL expira",
            texto: "O Redis apaga a chave. B pede o lock, recebe `OK` e começa a seção crítica, com toda a razão.",
          },
          {
            titulo: "A volta e escreve por cima",
            texto:
              "A acorda, continua convencido de que é o dono e grava o resultado. Agora dois clientes mexeram no mesmo recurso, e a escrita de A, que é a mais antiga, sobrescreve a de B.",
          },
          {
            titulo: "O `unlock` seguro não resolve isso",
            texto:
              "Ao tentar liberar, A descobre que o valor não é mais o seu e não apaga nada, que era o que se queria: não derrubar o lock de B. Mas a escrita errada já aconteceu.",
          },
          {
            titulo: "A saída: o fencing token",
            texto:
              "Cada aquisição devolve um **número crescente** (A recebeu 33 e B recebeu 34). Quem escreve manda o número junto, e o **recurso protegido** (o banco, o armazenamento) recusa números menores que o maior já visto: A, com 33, é recusado depois que B gravou com 34. Em SQL, algo como `UPDATE ... WHERE token_atual < $1`. Sistemas de consenso como etcd e ZooKeeper oferecem contadores crescentes (revisões, nós sequenciais); com Redis é preciso construí-lo, atento a trocas de primário. Confira a documentação.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Adquirir, trabalhar e liberar só se for o dono",
        legenda: "JavaScript",
        codigo: [
          'import { randomUUID } from "node:crypto";',
          "",
          "const LIBERAR = `",
          '  if redis.call("get", KEYS[1]) == ARGV[1] then',
          '    return redis.call("del", KEYS[1])',
          "  end",
          "  return 0`;",
          "",
          "export async function comLock(redis, chave, ttlMs, trabalho) {",
          "  const token = randomUUID(); // identifica o dono",
          "  const ok = await redis.set(chave, token, { NX: true, PX: ttlMs }); // só se não existir",
          '  if (ok !== "OK") return { adquirido: false };',
          "  try {",
          "    return { adquirido: true, resultado: await trabalho() };",
          "  } finally {",
          "    await redis.eval(LIBERAR, { keys: [chave], arguments: [token] }); // só apaga se ainda for meu",
          "  }",
          "}",
        ].join("\n"),
        nota: "A sintaxe é a do pacote `redis` para Node; em outros clientes, como o `ioredis`, os argumentos mudam de forma, então confira a documentação. O script Lua faz a comparação e a remoção de forma atômica no servidor.",
      },
      {
        tipo: "tabela",
        titulo: "Antes de pôr um lock, veja se isto resolve",
        colunas: ["Problema", "Alternativa sem lock", "Por que funciona"],
        linhas: [
          [
            "A mesma requisição processada duas vezes ao mesmo tempo",
            "Chave de idempotência com restrição `UNIQUE` (veja L104)",
            "O banco decide quem chegou primeiro, e o outro recebe a resposta guardada",
          ],
          [
            "Duas atualizações do mesmo registro",
            "`UPDATE` condicional ou versão otimista (`WHERE versao = $1`)",
            "A comparação e a escrita são um único passo atômico no banco; quem perde tenta de novo",
          ],
          [
            "Ordem das operações sobre a mesma entidade",
            "Fila serial por chave (partição pelo id da entidade)",
            "Um consumidor por chave: não há disputa para arbitrar",
          ],
          [
            "Exclusão mútua dentro de um único banco",
            "Lock do próprio banco (`SELECT ... FOR UPDATE`, advisory lock)",
            "Liberado com a transação ou a sessão, sem TTL e sem relógios",
          ],
          [
            "Tarefa agendada que só uma instância deve rodar",
            "Aqui o lock vale, com a tarefa idempotente",
            "Se duas instâncias rodarem por engano, o efeito repetido é inofensivo",
          ],
        ],
        nota: "Veja também F98.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Um lock com TTL é uma concessão, não uma garantia",
        texto:
          "Ele vale enquanto o processo e os relógios cooperam. Serve bem para **eficiência** (evitar que duas instâncias façam o mesmo trabalho, com custo pequeno se acontecer) e, para **correção** estrita, só junto de um fencing token verificado pelo recurso. Escolha um TTL maior que a seção crítica típica, mas não tão grande que uma queda pare tudo; se o trabalho pode demorar, **renove** o lock (só se o valor ainda for o seu) em intervalos menores que o TTL, lembrando que a renovação não impede pausas. O **Redlock**, algoritmo para adquirir o lock em várias instâncias independentes de Redis por maioria, é **controverso** quanto à segurança: há críticas publicadas (relógios, pausas, ausência de fencing token) e respostas a elas, então leia os dois lados antes de depender dele em algo crítico. E um Redis de um nó só, ou com replicação assíncrona, pode perder o lock numa troca de primário.",
      },
    ],
    armadilhas: [
      "Liberar com um `DEL` simples, sem conferir o dono: o lock de quem chegou depois é apagado, e a exclusão mútua se perde.",
      "TTL curto demais (expira no meio do trabalho) ou longo demais (uma queda deixa todo mundo esperando), sem renovação nem fencing.",
      "Achar que o lock garante exclusão absoluta: pausas e diferenças de relógio quebram a garantia, então o recurso precisa se proteger (fencing token, `UPDATE` condicional).",
      "Usar lock onde uma restrição `UNIQUE`, a idempotência ou uma fila por chave bastava, ou confiar num Redis de um nó só sem pensar no que acontece quando ele troca de primário ou reinicia.",
    ],
    autoteste: [
      {
        pergunta: "Por que o valor do lock é um token único e o `unlock` compara antes de apagar?",
        resposta:
          "Porque, se o TTL expirou e outro cliente adquiriu, apagar às cegas derrubaria o lock dele. O token identifica o dono, e o script atômico só apaga a chave se o valor ainda for o do cliente que está liberando.",
      },
      {
        pergunta: "O que é um fencing token e quem o verifica?",
        resposta:
          "É um número crescente emitido a cada aquisição do lock. O recurso protegido (o banco, o armazenamento) o verifica e recusa escritas com número menor que o maior já visto, o que barra o dono antigo que voltou de uma pausa depois de o lock ter expirado.",
      },
    ],
  },
  en: {
    titulo: "Distributed locks",
    pergunta: "How do distributed locks work and when would you use them?",
    porqueEsteMetodo:
      "A distributed lock looks simple until you follow one acquisition and see what happens when the owner pauses. Tracing the happy path and the unhappy path shows why the TTL, the owner token and fencing exist.",
    resposta30s:
      "A **distributed lock** is mutual exclusion between processes on different machines, almost always with a **TTL**: the client writes a unique key only if it does not exist (in Redis, `SET key value NX PX ttl`), runs the critical section and releases **only if the value is still its own**. Because the TTL can expire during a pause and another client take over, strict correctness needs a **fencing token** checked by the resource. And wherever possible, prefer avoiding the lock: idempotency, a conditional `UPDATE` or a serial queue per key.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "The acquisition, on the happy path",
        etapas: [
          "Client A wants to generate invoice 42 without anyone else doing it at the same time. It creates a **unique token** (a UUID) and runs `SET lock:invoice:42 <tokenA> NX PX 30000`",
          "`NX` writes only if the key does not exist; `PX 30000` makes the key expire in 30 seconds. Redis answers `OK`: A is the owner",
          "Client B tries the same `SET` and gets `nil`: the lock is taken. B waits and tries again, or gives up",
          "A runs the critical section (generates the invoice)",
          "A releases the lock with an atomic script: it deletes the key **only if the value is still `<tokenA>`**",
          "Now B can acquire it",
        ],
        nota: "The TTL exists so the lock is not held forever if A dies midway. But it is also what creates the problem in the next section.",
      },
      {
        tipo: "passos",
        titulo: "When something goes wrong",
        passos: [
          {
            titulo: "The pause",
            texto:
              "After acquiring, A’s process stops for more than 30 seconds: a long garbage collection, a frozen VM, a slow network, a loop that blocked the event loop. A does not notice, because from its point of view no time has passed.",
          },
          {
            titulo: "The TTL expires",
            texto:
              "Redis deletes the key. B asks for the lock, gets `OK` and starts the critical section, quite rightly.",
          },
          {
            titulo: "A comes back and writes over it",
            texto:
              "A wakes up, still convinced it is the owner, and writes its result. Now two clients have touched the same resource, and A’s write, the older one, overwrites B’s.",
          },
          {
            titulo: "A safe `unlock` does not fix this",
            texto:
              "When it tries to release, A finds that the value is no longer its own and deletes nothing, which is what we wanted: not to knock out B’s lock. But the wrong write has already happened.",
          },
          {
            titulo: "The way out: the fencing token",
            texto:
              "Each acquisition returns an **increasing number** (A got 33 and B got 34). Whoever writes sends the number along, and the **protected resource** (the database, the storage) rejects numbers lower than the highest it has seen: A, with 33, is rejected after B wrote with 34. In SQL, something like `UPDATE ... WHERE current_token < $1`. Consensus systems such as etcd and ZooKeeper offer increasing counters (revisions, sequential nodes); with Redis you have to build one, mindful of primary failovers. Check the documentation.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Acquire, work and release only if you are the owner",
        legenda: "JavaScript",
        codigo: [
          'import { randomUUID } from "node:crypto";',
          "",
          "const RELEASE = `",
          '  if redis.call("get", KEYS[1]) == ARGV[1] then',
          '    return redis.call("del", KEYS[1])',
          "  end",
          "  return 0`;",
          "",
          "export async function withLock(redis, key, ttlMs, work) {",
          "  const token = randomUUID(); // identifies the owner",
          "  const ok = await redis.set(key, token, { NX: true, PX: ttlMs }); // only if it does not exist",
          '  if (ok !== "OK") return { acquired: false };',
          "  try {",
          "    return { acquired: true, result: await work() };",
          "  } finally {",
          "    await redis.eval(RELEASE, { keys: [key], arguments: [token] }); // deletes only if still mine",
          "  }",
          "}",
        ].join("\n"),
        nota: "The syntax is that of the `redis` package for Node; in other clients, such as `ioredis`, the arguments take a different shape, so check the documentation. The Lua script does the comparison and the removal atomically on the server.",
      },
      {
        tipo: "tabela",
        titulo: "Before adding a lock, see if this solves it",
        colunas: ["Problem", "Lock-free alternative", "Why it works"],
        linhas: [
          [
            "The same request processed twice at the same time",
            "An idempotency key with a `UNIQUE` constraint (see L104)",
            "The database decides who arrived first, and the other receives the stored response",
          ],
          [
            "Two updates to the same record",
            "A conditional `UPDATE` or optimistic versioning (`WHERE version = $1`)",
            "The comparison and the write are a single atomic step in the database; whoever loses retries",
          ],
          [
            "Order of operations on the same entity",
            "A serial queue per key (partitioned by entity id)",
            "One consumer per key: there is no contention to arbitrate",
          ],
          [
            "Mutual exclusion inside a single database",
            "The database’s own lock (`SELECT ... FOR UPDATE`, advisory lock)",
            "Released with the transaction or session, with no TTL and no clocks",
          ],
          [
            "A scheduled task that only one instance should run",
            "Here the lock is worth it, with an idempotent task",
            "If two instances run by mistake, the repeated effect is harmless",
          ],
        ],
        nota: "See also F98.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A lock with a TTL is a lease, not a guarantee",
        texto:
          "It holds as long as the process and the clocks cooperate. It works well for **efficiency** (keeping two instances from doing the same work, at small cost if it happens) and, for strict **correctness**, only together with a fencing token checked by the resource. Choose a TTL longer than the typical critical section, but not so long that a crash stops everything; if the work can take long, **renew** the lock (only if the value is still yours) at intervals shorter than the TTL, remembering that renewal does not prevent pauses. **Redlock**, an algorithm for acquiring the lock on several independent Redis instances by majority, is **controversial** regarding safety: there are published criticisms (clocks, pauses, no fencing token) and replies to them, so read both sides before relying on it for anything critical. And a single-node Redis, or one with asynchronous replication, can lose the lock on a primary failover.",
      },
    ],
    armadilhas: [
      "Releasing with a plain `DEL`, without checking the owner: the lock of whoever came next is deleted, and mutual exclusion is lost.",
      "A TTL that is too short (it expires midway through the work) or too long (a crash leaves everyone waiting), with no renewal and no fencing.",
      "Assuming the lock guarantees absolute exclusion: pauses and clock differences break the guarantee, so the resource must protect itself (fencing token, conditional `UPDATE`).",
      "Using a lock where a `UNIQUE` constraint, idempotency or a queue per key was enough, or trusting a single-node Redis without thinking about what happens when it fails over or restarts.",
    ],
    autoteste: [
      {
        pergunta: "Why is the lock value a unique token, and why does `unlock` compare before deleting?",
        resposta:
          "Because, if the TTL expired and another client acquired the lock, deleting blindly would knock out its lock. The token identifies the owner, and the atomic script only deletes the key if the value is still that of the client releasing it.",
      },
      {
        pergunta: "What is a fencing token and who checks it?",
        resposta:
          "It is an increasing number issued with each acquisition of the lock. The protected resource (the database, the storage) checks it and rejects writes with a number lower than the highest it has seen, which stops the old owner that came back from a pause after the lock had expired.",
      },
    ],
  },
};
