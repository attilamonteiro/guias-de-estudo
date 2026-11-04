import type { Pergunta } from "../../tipos";

// R07 · Gerenciamento de sessão
export const r07: Pergunta = {
  numero: 107,
  modulo: "roadmap-iniciante",
  metodo: "trace",
  pt: {
    titulo: "Gerenciamento de sessão",
    pergunta: "Descreva como funciona o gerenciamento de sessão em aplicações web.",
    porqueEsteMetodo:
      "Uma sessão tem um ciclo de vida com início, uso e fim. Seguir o ID da sessão desde o login até o logout mostra cada decisão (onde guardar, como enviar, quando expirar).",
    resposta30s:
      "No login o servidor cria uma **sessão** com um **ID aleatório e imprevisível**, guarda os dados dela num armazenamento (de preferência Redis) e envia o ID ao cliente num **cookie** (`HttpOnly`, `Secure`, `SameSite`). A cada requisição o cliente reenvia o cookie e o servidor busca a sessão pelo ID. A sessão termina por **logout** ou **expiração**. Boa prática: gerar um **novo ID após o login**.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Ciclo de vida de uma sessão",
        etapas: [
          "Login válido",
          "Servidor cria a sessão (ID aleatório) e guarda os dados",
          "Envia o ID num cookie `HttpOnly; Secure; SameSite`",
          "Cliente reenvia o cookie a cada requisição",
          "Servidor busca a sessão pelo ID",
          "Logout ou expiração: a sessão é apagada",
        ],
      },
      {
        tipo: "tabela",
        titulo: "Onde guardar a sessão",
        colunas: ["Local", "Quando usar"],
        linhas: [
          ["Memória do processo", "Só em desenvolvimento ou instância única: perde ao reiniciar e não escala"],
          ["Redis ou Memcached", "Padrão em produção: rápido, TTL nativo, compartilhado entre servidores"],
          ["Banco de dados", "Quando precisa de durabilidade e consulta; mais lento"],
          [
            "Dentro do cookie (assinado ou criptografado)",
            "Sem armazenamento no servidor, mas limite de ~4 KB e revogação difícil",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Boas práticas",
        texto:
          "ID aleatório de 128 bits ou mais, **novo ID após o login** (evita fixação de sessão), expiração por inatividade e absoluta, invalidar no logout, e cookie com `HttpOnly`, `Secure` e `SameSite`. Veja a Q16 para comparar com JWT e OAuth.",
      },
    ],
    armadilhas: [
      "ID previsível, ou na URL (vaza em logs e no cabeçalho referer).",
      "Reaproveitar o mesmo ID antes e depois do login (fixação de sessão).",
      "Sessão sem expiração.",
      "Guardar a sessão em memória e escalar horizontalmente.",
    ],
    autoteste: [
      {
        pergunta: "Por que trocar o ID da sessão após o login?",
        resposta:
          "Para evitar fixação de sessão: um atacante que plantou um ID antes do login não ganha acesso autenticado.",
      },
      {
        pergunta: "O que cada flag do cookie de sessão faz?",
        resposta:
          "`HttpOnly` esconde o cookie do JavaScript, `Secure` só o envia por HTTPS e `SameSite` limita o envio em requisições de outros sites.",
      },
    ],
  },
  en: {
    titulo: "Session management",
    pergunta: "Describe how session management works in web applications.",
    porqueEsteMetodo:
      "A session has a life cycle with a start, use and end. Following the session ID from login to logout shows each decision (where to store, how to send, when to expire).",
    resposta30s:
      "On login the server creates a **session** with a **random, unpredictable ID**, stores its data in a store (preferably Redis) and sends the ID to the client in a **cookie** (`HttpOnly`, `Secure`, `SameSite`). On every request the client resends the cookie and the server looks up the session by ID. The session ends by **logout** or **expiry**. Good practice: generate a **new ID after login**.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Life cycle of a session",
        etapas: [
          "Valid login",
          "Server creates the session (random ID) and stores the data",
          "Sends the ID in an `HttpOnly; Secure; SameSite` cookie",
          "Client resends the cookie on every request",
          "Server looks up the session by ID",
          "Logout or expiry: the session is deleted",
        ],
      },
      {
        tipo: "tabela",
        titulo: "Where to store the session",
        colunas: ["Where", "When to use"],
        linhas: [
          ["Process memory", "Development or a single instance only: lost on restart and does not scale"],
          ["Redis or Memcached", "Production default: fast, native TTL, shared across servers"],
          ["Database", "When you need durability and querying; slower"],
          ["Inside the cookie (signed or encrypted)", "No server-side storage, but a ~4 KB limit and hard revocation"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Best practices",
        texto:
          "Random ID of 128 bits or more, **new ID after login** (prevents session fixation), idle and absolute expiry, invalidate on logout, and a cookie with `HttpOnly`, `Secure` and `SameSite`. See Q16 to compare with JWT and OAuth.",
      },
    ],
    armadilhas: [
      "A predictable ID, or one in the URL (leaks in logs and the referer header).",
      "Reusing the same ID before and after login (session fixation).",
      "A session that never expires.",
      "Keeping the session in memory and scaling horizontally.",
    ],
    autoteste: [
      {
        pergunta: "Why change the session ID after login?",
        resposta:
          "To prevent session fixation: an attacker who planted an ID before login does not gain authenticated access.",
      },
      {
        pergunta: "What does each session-cookie flag do?",
        resposta:
          "`HttpOnly` hides the cookie from JavaScript, `Secure` sends it only over HTTPS and `SameSite` limits sending on requests from other sites.",
      },
    ],
  },
};
