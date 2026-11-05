import type { Pergunta } from "../../tipos";

// Q81 · Sessão segura do zero
export const q081: Pergunta = {
  numero: 81,
  modulo: "tokens-e-sessoes",
  metodo: "firstprinciples",
  pt: {
    titulo: "Sessão segura do zero",
    pergunta:
      "Como você construiria um mecanismo de sessão segura no servidor, do identificador aleatório ao armazenamento, à expiração e à invalidação?",
    porqueEsteMetodo:
      "Uma sessão segura parece uma lista de boas práticas soltas. Partir do cookie mais ingênuo e consertar uma falha por vez mostra que cada componente (id aleatório, armazenamento, regeneração, dois relógios, destruição) existe porque um ataque o exigiu.",
    resposta30s:
      "Uma sessão segura é um **identificador aleatório e opaco** (128 bits ou mais, de um gerador criptográfico) num **cookie seguro**, que aponta para um estado guardado **no servidor** (Redis ou banco), de preferência pelo hash do id. O id é **regenerado no login** e em mudanças de privilégio, expira por **inatividade e por prazo absoluto** e é **destruído** no logout e na troca de senha. Cada peça fecha uma falha: adivinhação, fixação, roubo, sessão esquecida e impossibilidade de invalidar.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma falha por vez",
        passos: [
          {
            titulo: "1. A versão mais simples: um id previsível no cookie",
            texto:
              "O servidor grava `sessao=42` (o número do usuário) ou um contador no cookie e confia nele. → Quebra: qualquer pessoa troca o 42 por 43 e vira outro usuário, ou adivinha os ids vizinhos. Conserto: o cookie não diz quem você é; só aponta para algo que ninguém consegue adivinhar.",
          },
          {
            titulo: "2. Id aleatório de alta entropia",
            texto:
              "Gere o identificador com um gerador criptograficamente seguro (`randomBytes` no Node.js, `RandomNumberGenerator` no .NET), com 128 bits ou mais e nenhum dado do usuário dentro. Nunca `Math.random()`, data ou contador. → Resolve: adivinhar ou enumerar ids vira inviável. → Ainda quebra: o que a sessão sabe precisa morar em algum lugar.",
          },
          {
            titulo: "3. Estado no servidor, não no cookie",
            texto:
              "Guarde os dados da sessão num armazenamento do servidor (Redis ou banco), indexado pelo id; o cookie leva só o id opaco. Guarde o **hash** do id (SHA-256 basta, porque o id já é aleatório) para que o vazamento do armazenamento ou de um backup não entregue ids utilizáveis. Um cookie assinado com os dados dentro até funciona, mas não se invalida no servidor, o mesmo problema do JWT (veja Q75). → Resolve: dá para alterar e apagar a sessão a qualquer momento. → Quebra: se o id sobrevive ao login, vem a fixação.",
          },
          {
            titulo: "4. Regenerar o id no login",
            texto:
              "Quem recebeu um id antes de autenticar (e talvez o tenha escolhido, veja Q83) não pode conservá-lo depois. Ao autenticar, e em toda elevação de privilégio (MFA, virar administrador), gere um id novo e destrua o antigo. → Resolve: a fixação de sessão. → Ainda quebra: o cookie pode ser lido, interceptado ou usado por outro site.",
          },
          {
            titulo: "5. Cookie seguro",
            texto:
              "`__Host-`, `Secure`, `HttpOnly` e `SameSite` (veja Q79), `Cache-Control: no-store` nas respostas autenticadas, o id nunca na URL nem em log, e token anti-CSRF nas requisições que mudam estado (veja Q126). → Resolve: leitura por script, interceptação, injeção por subdomínio e o CSRF básico. → Ainda quebra: uma sessão esquecida ou roubada duraria para sempre.",
          },
          {
            titulo: "6. Dois relógios de expiração",
            texto:
              "Expiração **ociosa** (o TTL é renovado a cada uso) e **absoluta** (teto contado desde o login), conferidas no servidor e não só pela validade do cookie (veja Q78). A sessão anônima, quando existir, vive pouco. → Resolve: dispositivos abandonados e sessões roubadas mantidas vivas. → Ainda quebra: a pessoa pode querer, ou precisar, encerrar antes do prazo.",
          },
          {
            titulo: "7. Invalidação e vínculo ao contexto",
            texto:
              "O logout destrói o registro no servidor, e não só o cookie. A troca de senha, a troca de fator de MFA e o “sair de todos” destroem as outras sessões do usuário, o que pede um índice usuário → sessões (veja Q82). Opcionalmente, guarde sinais do dispositivo (user agent, rede, uma chave do dispositivo) e use-os como alerta ou motivo de reautenticação, não como regra rígida: o IP muda em redes móveis. Cada falha ganhou um componente.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Criar e ler uma sessão no servidor",
        legenda: "TypeScript",
        codigo: `import { randomBytes, createHash } from "node:crypto";

const OCIOSO = 30 * 60; // segundos sem uso
const ABSOLUTO = 8 * 60 * 60; // teto desde o login
const hash = (id: string) => createHash("sha256").update(id).digest("hex");

export async function criarSessao(usuarioId: string) {
  const id = randomBytes(32).toString("base64url"); // 256 bits aleatórios
  const dados = { usuarioId, criadaEm: Date.now() };
  await redis.set("sessao:" + hash(id), JSON.stringify(dados), "EX", OCIOSO);
  await redis.sadd("sessoes:" + usuarioId, hash(id)); // índice para "sair de todos"
  return id; // vai só no cookie __Host-sid, HttpOnly
}

export async function lerSessao(id: string) {
  const bruto = await redis.get("sessao:" + hash(id));
  if (!bruto) return null;
  const s = JSON.parse(bruto);
  if (Date.now() - s.criadaEm > ABSOLUTO * 1000) return null;
  await redis.expire("sessao:" + hash(id), OCIOSO); // renova a janela ociosa
  return s;
}`,
        nota: "Exemplo simplificado: `redis` é um cliente já configurado, e o índice `sessoes:` precisa de limpeza dos ids que expiraram. No login, chame `criarSessao` depois de destruir o id antigo.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra",
        texto:
          "O cookie carrega só um **identificador opaco e aleatório**; o resto (quem é, quando entrou, o que pode) mora no servidor, onde pode ser mudado e apagado. Cada componente existe por causa de uma falha: aleatoriedade (adivinhação), armazenamento no servidor (invalidação), regeneração (fixação), cookie seguro (roubo e CSRF), dois relógios (sessões esquecidas) e destruição (logout e troca de senha).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Configure uma biblioteca madura, não invente",
        texto:
          "Frameworks maduros (ASP.NET Core, Spring Session, Django e, em Node.js, o `express-session` com um armazenamento externo) já trazem a maior parte disso; o trabalho é configurá-los (cookie, TTLs, regeneração) e revisar os padrões. Sessão no servidor dá controle, mas custa um armazenamento compartilhado e disponível entre as instâncias (compare com o JWT em Q75). O id é um segredo ao portador: trate-o como uma senha, sem log, sem URL e sem armazená-lo em claro.",
      },
    ],
    armadilhas: [
      "Gerar o id com `Math.random()`, data ou contador, ou derivá-lo de dados do usuário: ele fica previsível.",
      "Manter o mesmo id depois do login (fixação) ou aceitar o id vindo da URL.",
      "Só apagar o cookie no logout, sem destruir o registro no servidor: o id copiado continua valendo.",
      "Guardar o id em claro no armazenamento, em logs ou na URL: quem lê o Redis, um backup ou um log assume as sessões.",
    ],
    autoteste: [
      {
        pergunta: "Por que guardar o hash do id de sessão no servidor, e não o id?",
        resposta:
          "Porque o id é um segredo ao portador: quem o tiver assume a sessão. Se o armazenamento, um backup ou um log vazar, os hashes não servem como cookie. Como o id já é aleatório e longo, um SHA-256 basta, sem precisar de um hash lento.",
      },
      {
        pergunta: "Quais eventos devem regenerar ou destruir a sessão?",
        resposta:
          "Regenerar: o login e toda elevação de privilégio (MFA, virar administrador). Destruir: o logout, a troca de senha ou de fator de MFA (as outras sessões), o “sair de todos”, o desligamento e as expirações ociosa e absoluta.",
      },
    ],
  },
  en: {
    titulo: "Secure session from scratch",
    pergunta:
      "How would you build a secure server-side session mechanism, from the random identifier to storage, expiration and invalidation?",
    porqueEsteMetodo:
      "A secure session looks like a list of loose best practices. Starting from the most naive cookie and fixing one flaw at a time shows that each component (random id, storage, regeneration, two clocks, destruction) exists because an attack demanded it.",
    resposta30s:
      "A secure session is a **random, opaque identifier** (128 bits or more, from a cryptographic generator) in a **secure cookie**, pointing to state kept **on the server** (Redis or a database), preferably under the hash of the id. The id is **regenerated at login** and on privilege changes, expires by **inactivity and by an absolute deadline**, and is **destroyed** on logout and password change. Each piece closes a flaw: guessing, fixation, theft, forgotten sessions and the inability to invalidate.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one flaw at a time",
        passos: [
          {
            titulo: "1. The simplest version: a predictable id in the cookie",
            texto:
              "The server writes `session=42` (the user’s number) or a counter into the cookie and trusts it. → Breaks: anyone changes 42 to 43 and becomes another user, or guesses neighboring ids. The fix: the cookie does not say who you are; it only points to something nobody can guess.",
          },
          {
            titulo: "2. A high-entropy random id",
            texto:
              "Generate the identifier with a cryptographically secure generator (`randomBytes` in Node.js, `RandomNumberGenerator` in .NET), with 128 bits or more and no user data inside. Never `Math.random()`, a date or a counter. → Fixes: guessing or enumerating ids becomes infeasible. → Still breaks: what the session knows has to live somewhere.",
          },
          {
            titulo: "3. State on the server, not in the cookie",
            texto:
              "Keep the session data in a server-side store (Redis or a database), indexed by the id; the cookie carries only the opaque id. Store the **hash** of the id (SHA-256 is enough, because the id is already random) so a leak of the store or of a backup does not hand out usable ids. A signed cookie with the data inside does work, but it cannot be invalidated on the server, the same problem as the JWT (see Q75). → Fixes: you can change and delete the session at any time. → Breaks: if the id survives login, fixation follows.",
          },
          {
            titulo: "4. Regenerate the id at login",
            texto:
              "Whoever received an id before authenticating (and perhaps chose it, see Q83) must not keep it afterwards. On authentication, and on every privilege elevation (MFA, becoming an administrator), generate a new id and destroy the old one. → Fixes: session fixation. → Still breaks: the cookie can be read, intercepted or used by another site.",
          },
          {
            titulo: "5. A secure cookie",
            texto:
              "`__Host-`, `Secure`, `HttpOnly` and `SameSite` (see Q79), `Cache-Control: no-store` on authenticated responses, the id never in the URL or in logs, and an anti-CSRF token on state-changing requests (see Q126). → Fixes: reading by script, interception, injection by a subdomain and basic CSRF. → Still breaks: a forgotten or stolen session would last forever.",
          },
          {
            titulo: "6. Two expiry clocks",
            texto:
              "**Idle** expiry (the TTL is renewed on every use) and **absolute** expiry (a ceiling counted from login), checked on the server and not only through the cookie’s validity (see Q78). An anonymous session, when one exists, lives briefly. → Fixes: abandoned devices and stolen sessions kept alive. → Still breaks: the person may want, or need, to end it before the deadline.",
          },
          {
            titulo: "7. Invalidation and binding to context",
            texto:
              "Logout destroys the record on the server, not just the cookie. A password change, an MFA factor change and “sign out everywhere” destroy the user’s other sessions, which calls for a user → sessions index (see Q82). Optionally, store device signals (user agent, network, a device key) and use them as an alert or a reason to reauthenticate, not as a hard rule: the IP changes on mobile networks. Every flaw has now earned a component.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Creating and reading a server-side session",
        legenda: "TypeScript",
        codigo: `import { randomBytes, createHash } from "node:crypto";

const IDLE = 30 * 60; // seconds without use
const ABSOLUTE = 8 * 60 * 60; // ceiling since login
const hash = (id: string) => createHash("sha256").update(id).digest("hex");

export async function createSession(userId: string) {
  const id = randomBytes(32).toString("base64url"); // 256 random bits
  const data = { userId, createdAt: Date.now() };
  await redis.set("session:" + hash(id), JSON.stringify(data), "EX", IDLE);
  await redis.sadd("sessions:" + userId, hash(id)); // index for "sign out everywhere"
  return id; // goes only in the __Host-sid cookie, HttpOnly
}

export async function readSession(id: string) {
  const raw = await redis.get("session:" + hash(id));
  if (!raw) return null;
  const s = JSON.parse(raw);
  if (Date.now() - s.createdAt > ABSOLUTE * 1000) return null;
  await redis.expire("session:" + hash(id), IDLE); // renews the idle window
  return s;
}`,
        nota: "Simplified example: `redis` is an already configured client, and the `sessions:` index needs cleanup of expired ids. At login, call `createSession` after destroying the old id.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule",
        texto:
          "The cookie carries only an **opaque, random identifier**; everything else (who you are, when you came in, what you may do) lives on the server, where it can be changed and deleted. Each component exists because of a flaw: randomness (guessing), server-side storage (invalidation), regeneration (fixation), a secure cookie (theft and CSRF), two clocks (forgotten sessions) and destruction (logout and password change).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Configure a mature library, don’t invent",
        texto:
          "Mature frameworks (ASP.NET Core, Spring Session, Django and, in Node.js, `express-session` with an external store) already provide most of this; the work is configuring them (cookie, TTLs, regeneration) and reviewing the defaults. A server-side session gives control, but costs a shared store that is available to every instance (compare with the JWT in Q75). The id is a bearer secret: treat it like a password, with no logging, no URL and no storing in the clear.",
      },
    ],
    armadilhas: [
      "Generating the id with `Math.random()`, a date or a counter, or deriving it from user data: it becomes predictable.",
      "Keeping the same id after login (fixation) or accepting the id from the URL.",
      "Only deleting the cookie at logout, without destroying the server-side record: the copied id keeps working.",
      "Storing the id in the clear in the store, in logs or in the URL: whoever reads Redis, a backup or a log takes over the sessions.",
    ],
    autoteste: [
      {
        pergunta: "Why store the hash of the session id on the server instead of the id?",
        resposta:
          "Because the id is a bearer secret: whoever has it takes over the session. If the store, a backup or a log leaks, the hashes are useless as a cookie. Since the id is already random and long, a SHA-256 is enough, with no need for a slow hash.",
      },
      {
        pergunta: "Which events should regenerate or destroy the session?",
        resposta:
          "Regenerate: login and every privilege elevation (MFA, becoming an administrator). Destroy: logout, a password or MFA factor change (the other sessions), “sign out everywhere”, offboarding and the idle and absolute expirations.",
      },
    ],
  },
};
