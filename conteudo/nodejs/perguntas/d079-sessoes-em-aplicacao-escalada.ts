import type { Pergunta } from "../../tipos";

// D79 · Sessões em aplicação escalada
export const d079: Pergunta = {
  numero: 379,
  modulo: "devinterview-escala",
  metodo: "compare",
  pt: {
    titulo: "Sessões em aplicação escalada",
    pergunta: "Como você lida com o gerenciamento de sessões em uma aplicação Node.js escalada?",
    porqueEsteMetodo:
      "Há várias saídas para o mesmo problema (a sessão não pode ficar na memória de uma instância), cada uma com limites diferentes. A matriz as compara e a regra de decisão mostra qual escolher.",
    resposta30s:
      "Uma sessão guardada na memória do processo **quebra** quando há várias instâncias: a próxima requisição pode cair em outra e a sessão “some”. As saídas são **sticky sessions** (o balanceador manda o cliente sempre à mesma instância), um **store compartilhado** como o Redis (o cookie leva só o id), um **token sem estado** (JWT) ou um **cookie assinado**. Na maioria dos casos o caminho é **Redis com cookie seguro** (`HttpOnly`, `Secure`, `SameSite`); sticky serve de complemento, não de solução.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Onde guardar o estado da sessão",
        colunas: ["Opção", "Como funciona", "Vantagens", "Limites"],
        linhas: [
          [
            "Memória do processo (padrão do `express-session`)",
            "O objeto da sessão fica na memória da instância; o cookie leva o id",
            "Zero configuração; serve para desenvolvimento",
            "Não escala: outra instância não a enxerga, um reinício apaga tudo, e a documentação do próprio `express-session` a desaconselha em produção",
          ],
          [
            "Sticky sessions",
            "O balanceador manda o mesmo cliente sempre à mesma instância, por cookie de afinidade ou por hash",
            "Não exige mudar a aplicação",
            "Distribui mal a carga; a sessão se perde se a instância cair, reiniciar ou sair no escalonamento; não é resiliência",
          ],
          [
            "Store compartilhado (Redis ou banco)",
            "O cookie leva só o id; os dados ficam num serviço que todas as instâncias consultam",
            "Qualquer instância atende; sobrevive a reinícios; revogar é apagar a chave; expiração pelo TTL",
            "Uma ida à rede por requisição; o store vira dependência crítica e precisa de alta disponibilidade",
          ],
          [
            "Token sem estado (JWT)",
            "O estado vai dentro de um token assinado; o servidor só verifica a assinatura (veja L47)",
            "Nada guardado no servidor; escala fácil",
            "Revogar antes da expiração é difícil; o token cresce com os dados e quem o tem consegue lê-los",
          ],
          [
            "Cookie assinado ou criptografado (sessão no cliente)",
            "Os dados da sessão ficam no próprio cookie, assinados ou criptografados com um segredo do servidor",
            "Sem store; qualquer instância valida",
            "Limite de tamanho do cookie (cerca de 4 KB); sem revogação pelo servidor; exige rotação de chaves",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Sessão no Redis com cookie seguro",
        legenda: "JavaScript",
        codigo: `import express from "express";
import session from "express-session";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

const app = express();
app.set("trust proxy", 1); // atrás do balanceador, para o cookie Secure funcionar
app.use(
  session({
    store: new RedisStore({ client: redis }), // o estado sai do processo
    secret: process.env.SESSION_SECRET, // vem do ambiente, nunca do código
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: true, sameSite: "lax", maxAge: 8 * 60 * 60 * 1000 },
  }),
);`,
        nota: "A forma de importar o `RedisStore` varia conforme a versão do `connect-redis`; confira o README do pacote. A mesma ideia vale com outros stores (banco, Memcached).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Tire o estado do processo. Precisa **revogar** sessões e guardar dados no servidor? **Store compartilhado** (Redis), com o cookie levando só o id. Sessão curta e sem necessidade de revogação imediata? **Token** ou **cookie assinado**. **Sticky** é complemento: serve ao Socket.IO com long polling e para ganhar tempo numa migração, não como única solução, porque não sobrevive a reinício nem à queda da instância.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Sticky no cluster e no Socket.IO, e o cookie seguro",
        texto:
          "No módulo `cluster` do Node, o primário reparte as conexões entre os workers e, por padrão, não há afinidade: a sessão em memória falha mesmo numa máquina só. O Socket.IO com long polling faz várias requisições HTTP no mesmo handshake e precisa que todas cheguem à mesma instância (sticky), ou o uso apenas de WebSocket; para transmitir entre instâncias, use um adaptador (como o de Redis). Qualquer que seja a opção: cookie com `HttpOnly`, `Secure` e `SameSite`, id regenerado no login (`req.session.regenerate`) e expiração por inatividade e absoluta. O `secret` do `express-session` aceita uma lista, o que permite rotacioná-lo.",
      },
    ],
    armadilhas: [
      "Deixar o `MemoryStore` padrão do `express-session` em produção: vaza memória e não funciona com mais de uma instância.",
      "Tratar sticky session como solução definitiva: ela some com a instância (reinício, deploy, escalonamento) e deixa a carga desigual.",
      "Esquecer `trust proxy` atrás do balanceador: com cookie `Secure`, o Express acha que a conexão não é HTTPS e não envia o cookie.",
      "Não regenerar o id da sessão no login nem expirar sessões: abre espaço para fixação de sessão e sessões eternas.",
    ],
    autoteste: [
      {
        pergunta: "Por que a sessão em memória falha com várias instâncias?",
        resposta:
          "Porque cada instância tem a própria memória: se a próxima requisição cai em outra instância, o id do cookie não existe lá e o usuário parece deslogado.",
      },
      {
        pergunta: "Quando você ainda precisaria de sticky sessions mesmo com um store compartilhado?",
        resposta:
          "No Socket.IO com long polling, em que várias requisições do mesmo handshake precisam chegar à mesma instância. Para sessão HTTP comum, com o estado no Redis, o sticky não é necessário.",
      },
    ],
  },
  en: {
    titulo: "Sessions in a scaled app",
    pergunta: "How do you handle session management in a scaled Node.js application?",
    porqueEsteMetodo:
      "There are several ways out of the same problem (the session cannot live in one instance’s memory), each with different limits. The matrix compares them and the decision rule shows which to choose.",
    resposta30s:
      "A session kept in the process’s memory **breaks** when there are several instances: the next request may land on another one and the session “disappears”. The ways out are **sticky sessions** (the load balancer always sends the client to the same instance), a **shared store** such as Redis (the cookie carries only the id), a **stateless token** (JWT) or a **signed cookie**. In most cases the path is **Redis with a secure cookie** (`HttpOnly`, `Secure`, `SameSite`); sticky is a complement, not a solution.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Where to keep the session state",
        colunas: ["Option", "How it works", "Advantages", "Limits"],
        linhas: [
          [
            "Process memory (the `express-session` default)",
            "The session object lives in the instance’s memory; the cookie carries the id",
            "Zero setup; fine for development",
            "Does not scale: another instance cannot see it, a restart wipes everything, and the `express-session` documentation itself advises against it in production",
          ],
          [
            "Sticky sessions",
            "The load balancer always sends the same client to the same instance, by affinity cookie or hash",
            "No application change needed",
            "Spreads load unevenly; the session is lost if the instance crashes, restarts or is removed by autoscaling; it is not resilience",
          ],
          [
            "Shared store (Redis or a database)",
            "The cookie carries only the id; the data lives in a service every instance queries",
            "Any instance can serve; survives restarts; revoking is deleting the key; expiry through TTL",
            "A network round trip per request; the store becomes a critical dependency and needs high availability",
          ],
          [
            "Stateless token (JWT)",
            "The state travels inside a signed token; the server only verifies the signature (see L47)",
            "Nothing stored on the server; scales easily",
            "Revoking before expiry is hard; the token grows with the data and whoever holds it can read it",
          ],
          [
            "Signed or encrypted cookie (client-side session)",
            "The session data lives in the cookie itself, signed or encrypted with a server secret",
            "No store; any instance can validate",
            "Cookie size limit (around 4 KB); no server-side revocation; needs key rotation",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A Redis-backed session with a secure cookie",
        legenda: "JavaScript",
        codigo: `import express from "express";
import session from "express-session";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

const app = express();
app.set("trust proxy", 1); // behind the load balancer, so the Secure cookie works
app.use(
  session({
    store: new RedisStore({ client: redis }), // the state leaves the process
    secret: process.env.SESSION_SECRET, // comes from the environment, never the code
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: true, sameSite: "lax", maxAge: 8 * 60 * 60 * 1000 },
  }),
);`,
        nota: "How `RedisStore` is imported varies with the `connect-redis` version; check the package README. The same idea works with other stores (a database, Memcached).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Take the state out of the process. Need to **revoke** sessions and keep data on the server? A **shared store** (Redis), with the cookie carrying only the id. A short session with no need for immediate revocation? A **token** or a **signed cookie**. **Sticky** is a complement: it serves Socket.IO with long polling and buys time during a migration, but not as the only solution, because it survives neither a restart nor an instance crash.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Sticky in cluster and in Socket.IO, and the secure cookie",
        texto:
          "In Node’s `cluster` module, the primary spreads connections across the workers and, by default, there is no affinity: an in-memory session fails even on a single machine. Socket.IO with long polling makes several HTTP requests in the same handshake and needs them all to reach the same instance (sticky), or WebSocket-only use; to broadcast across instances, use an adapter (such as the Redis one). Whatever the option: a cookie with `HttpOnly`, `Secure` and `SameSite`, the id regenerated at login (`req.session.regenerate`) and both idle and absolute expiry. The `express-session` `secret` accepts a list, which lets you rotate it.",
      },
    ],
    armadilhas: [
      "Leaving the `express-session` default `MemoryStore` in production: it leaks memory and does not work with more than one instance.",
      "Treating sticky sessions as the final answer: they vanish with the instance (restart, deploy, autoscaling) and leave the load uneven.",
      "Forgetting `trust proxy` behind the load balancer: with a `Secure` cookie, Express thinks the connection is not HTTPS and does not send the cookie.",
      "Not regenerating the session id at login or expiring sessions: it opens the door to session fixation and everlasting sessions.",
    ],
    autoteste: [
      {
        pergunta: "Why does an in-memory session fail with several instances?",
        resposta:
          "Because each instance has its own memory: if the next request lands on another instance, the cookie’s id does not exist there and the user looks logged out.",
      },
      {
        pergunta: "When would you still need sticky sessions even with a shared store?",
        resposta:
          "With Socket.IO using long polling, where several requests of the same handshake must reach the same instance. For ordinary HTTP sessions with the state in Redis, sticky is not needed.",
      },
    ],
  },
};
