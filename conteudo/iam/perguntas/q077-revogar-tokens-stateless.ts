import type { Pergunta } from "../../tipos";

// Q77 · Revogar tokens stateless
export const q077: Pergunta = {
  numero: 77,
  modulo: "tokens-e-sessoes",
  metodo: "firstprinciples",
  pt: {
    titulo: "Revogar tokens stateless",
    pergunta:
      "Como você projetaria a revogação de tokens em um sistema com JWTs stateless? Parta da opção mais simples e acrescente soluções a cada limitação encontrada.",
    porqueEsteMetodo:
      "A revogação de JWT parece um paradoxo: o token existe justamente para ser validado sem consultar ninguém, e mesmo assim precisa poder ser desfeito. Partir do cenário sem revogação e acrescentar uma solução por limitação encontrada mostra o que cada camada compra e quanto estado ela devolve ao sistema.",
    resposta30s:
      "Um JWT stateless **não se revoga sozinho**: a API confere assinatura e `exp`, e o token vale até expirar. Por isso o desenho combina **access token de vida curta**, **refresh token revogável e rotacionado** (o estado fica no servidor de autorização) e, onde o risco pede, uma **checagem de estado barata**: lista de `jti` revogados com TTL, **versão da sessão** do usuário ou introspecção em operações sensíveis. Cada camada troca um pouco de estado por mais controle, e um **kill switch por chave** fica reservado para incidentes.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma limitação por vez",
        passos: [
          {
            titulo: "1. A versão mais simples: sem revogação",
            texto:
              "A API valida assinatura, `iss`, `aud` e `exp` (veja Q72) sem consultar ninguém, e é isso que torna o JWT escalável. Funciona até alguém precisar desfazer um token: logout, troca de senha, dispositivo roubado, desligamento (veja Q13). → Quebra: o token roubado vale até o `exp`, e o logout só apaga a cópia que está no cliente.",
          },
          {
            titulo: "2. Expiração curta com refresh token",
            texto:
              "Access token de poucos minutos e um refresh token guardado e controlado pelo servidor de autorização, que pode recusá-lo (veja Q34). A janela de exposição cai para a vida do access token, e a renovação passa por um ponto que tem estado. → Quebra: nesses minutos o token roubado ainda funciona, e um refresh token roubado renovaria o acesso indefinidamente.",
          },
          {
            titulo: "3. Rotação do refresh token",
            texto:
              "Cada uso do refresh token emite um novo e invalida o anterior. Se o antigo reaparece, alguém o copiou: o servidor derruba toda a família de tokens daquela sessão. → Resolve: o refresh roubado é detectado e cortado. → Ainda quebra: o access token já emitido segue válido até expirar.",
          },
          {
            titulo: "4. Lista de revogação por `jti`",
            texto:
              "Todo token leva um identificador único (`jti`). Ao revogar, grave o `jti` num cache rápido (Redis, por exemplo) **com TTL igual ao tempo que falta para o `exp`**: depois disso o token expiraria de qualquer forma, e a lista nunca cresce além dos tokens ainda vivos. A API consulta a lista a cada requisição. → Quebra: voltou o estado e uma consulta por chamada, só dá para revogar o que você consegue identificar, e “todos os tokens do usuário” exigiria listar cada `jti`.",
          },
          {
            titulo: "5. Versão da sessão ou do usuário",
            texto:
              "O token carrega uma versão (`ver`) ou o `sid` da sessão, e o servidor guarda o valor atual por usuário. Trocar a senha, “sair de todos” ou desligar alguém vira incrementar um número: todo token com versão antiga é recusado, sem listar nada. Variante: um carimbo “válido a partir de” comparado ao `iat`. → Quebra: ainda é uma leitura por requisição (pequena e cacheável, mas o cache atrasa a revogação), e a granularidade é o usuário ou a sessão, não o token.",
          },
          {
            titulo: "6. Introspecção nas operações sensíveis",
            texto:
              "Para ações de alto risco (transferência, troca de e-mail, ato administrativo), a API pergunta ao servidor de autorização se o token ainda está ativo (RFC 7662) e recebe o estado de agora, inclusive conta desabilitada ou sessão encerrada. → Quebra: latência e dependência do servidor de autorização em cada chamada; por isso só onde o risco justifica, com cache curtíssimo, e o resto segue na validação local.",
          },
          {
            titulo: "7. Kill switch por chave",
            texto:
              "No incidente grave (chave vazada, emissão indevida em massa), retire a chave de assinatura da JWKS ou troque-a: todo token assinado com aquele `kid` deixa de validar de uma vez (veja Q73). → Limite: derruba todos os usuários, não é seletivo e depende de cada API renovar o seu cache da JWKS.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Validação local mais o estado mínimo da revogação",
        legenda: "TypeScript",
        codigo: `import { jwtVerify, createRemoteJWKSet } from "jose";

const jwks = createRemoteJWKSet(new URL("https://idp.exemplo.com/jwks"));

export async function autenticar(token: string) {
  const { payload } = await jwtVerify(token, jwks, {
    issuer: "https://idp.exemplo.com",
    audience: "api://pedidos",
    algorithms: ["RS256"], // algoritmo fixo, nunca o do cabeçalho
  });
  // Estado mínimo que a revogação exige: duas leituras no Redis
  if (await redis.exists("revogado:" + payload.jti)) throw new Error("token revogado");
  const atual = Number(await redis.get("versao:" + payload.sub)) || 0;
  if (Number(payload.ver) !== atual) throw new Error("sessão encerrada");
  return payload;
}

export async function revogar(jti: string, exp: number) {
  const ttl = exp - Math.floor(Date.now() / 1000); // some quando o token expiraria de qualquer jeito
  if (ttl > 0) await redis.set("revogado:" + jti, "1", "EX", ttl);
}`,
        nota: "Exemplo simplificado: `redis` é um cliente já configurado. Se o Redis cair, decida de antemão se a API falha fechada (recusa) ou aberta (aceita) e monitore essa escolha.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra",
        texto:
          "Revogar é escolher **quanto estado** aceitar. Comece com access token curto e refresh token rotacionado, que resolvem a maioria dos casos; acrescente a **versão da sessão** onde logout e troca de senha precisam valer em segundos, a **introspecção** só nas operações sensíveis, a lista de `jti` para casos pontuais e o **kill switch por chave** para incidentes. Em cada checagem de estado, decida o que acontece quando o armazenamento cai (falhar fechado ou aberto).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O que nenhuma camada resolve",
        texto:
          "O token roubado funciona até a próxima checagem ou o `exp`; revogar o refresh token não derruba o access token já emitido; e revogar no servidor de autorização não encerra sozinho a sessão de cada aplicação (veja Q82). Se a revogação imediata for requisito em toda chamada, um token opaco com introspecção (veja Q74) ou uma sessão no servidor (veja Q75) é mais honesto do que um JWT remendado até virar sessão.",
      },
    ],
    armadilhas: [
      "Achar que apagar o token do navegador no logout o revoga: a cópia roubada continua válida até o `exp`.",
      "Lista de `jti` sem TTL (cresce para sempre) ou token sem `jti`: só dá para revogar o que se consegue identificar.",
      "Revogar só um lado: o refresh token mas não o access token já emitido, ou a sessão no servidor de autorização mas não nas APIs que aceitam o token.",
      "Cache de revogação com validade longa, ou API que falha aberta sem monitoramento: a revogação existe no papel e não funciona na hora do incidente.",
    ],
    autoteste: [
      {
        pergunta: "Por que a entrada da lista de `jti` revogados pode expirar sozinha?",
        resposta:
          "Porque, passado o `exp` do token, a validação normal já o rejeita; a entrada só precisa durar o tempo que falta para o `exp`. É isso que impede a lista de crescer sem limite.",
      },
      {
        pergunta: "O usuário trocou a senha. Como derrubar todos os access tokens antigos sem listar cada `jti`?",
        resposta:
          "Com a versão do usuário (ou um carimbo “válido a partir de” comparado ao `iat`): incrementa-se o valor e a API recusa tokens com a versão antiga. Custa uma leitura pequena por requisição e o atraso do cache.",
      },
    ],
  },
  en: {
    titulo: "Revoking stateless tokens",
    pergunta:
      "How would you design token revocation in a system using stateless JWTs? Start from the simplest option and add solutions for each limitation you run into.",
    porqueEsteMetodo:
      "JWT revocation looks like a paradox: the token exists precisely so it can be validated without asking anyone, yet it must be possible to undo it. Starting from no revocation and adding one fix per limitation shows what each layer buys and how much state it hands back to the system.",
    resposta30s:
      "A stateless JWT **cannot revoke itself**: the API checks the signature and `exp`, and the token is good until it expires. So the design combines **short-lived access tokens**, **revocable, rotated refresh tokens** (the state lives in the authorization server) and, where the risk demands it, a **cheap state check**: a list of revoked `jti` values with a TTL, a per-user **session version**, or introspection on sensitive operations. Each layer trades a little state for more control, and a **signing-key kill switch** is kept for incidents.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one limitation at a time",
        passos: [
          {
            titulo: "1. The simplest version: no revocation",
            texto:
              "The API validates the signature, `iss`, `aud` and `exp` (see Q72) without asking anyone, which is what makes JWTs scale. It works until someone has to undo a token: logout, a password change, a stolen device, an offboarding (see Q13). → Breaks: a stolen token is good until `exp`, and logout only deletes the copy on the client.",
          },
          {
            titulo: "2. Short expiry with a refresh token",
            texto:
              "An access token of a few minutes and a refresh token kept and controlled by the authorization server, which can refuse it (see Q34). The exposure window drops to the access token’s lifetime, and renewal passes through a point that holds state. → Breaks: during those minutes a stolen token still works, and a stolen refresh token would renew access indefinitely.",
          },
          {
            titulo: "3. Refresh token rotation",
            texto:
              "Each use of the refresh token issues a new one and invalidates the old one. If the old one shows up again, someone copied it: the server tears down the whole family of tokens for that session. → Fixes: a stolen refresh token is detected and cut off. → Still breaks: the access token already issued stays valid until it expires.",
          },
          {
            titulo: "4. A revocation list by `jti`",
            texto:
              "Every token carries a unique identifier (`jti`). When you revoke, store the `jti` in a fast cache (Redis, for example) **with a TTL equal to the time left until `exp`**: after that the token would expire anyway, and the list never grows beyond tokens that are still alive. The API checks the list on every request. → Breaks: state is back and there is one lookup per call, you can only revoke what you can identify, and “every token of this user” would require listing each `jti`.",
          },
          {
            titulo: "5. A session or user version",
            texto:
              "The token carries a version (`ver`) or the session’s `sid`, and the server keeps the current value per user. Changing the password, “sign out everywhere” or offboarding someone becomes incrementing a number: every token with an old version is refused, with nothing to list. Variant: a “valid from” timestamp compared with `iat`. → Breaks: it is still one read per request (small and cacheable, but the cache delays revocation), and the granularity is the user or the session, not the token.",
          },
          {
            titulo: "6. Introspection on sensitive operations",
            texto:
              "For high-risk actions (a transfer, an e-mail change, an administrative act), the API asks the authorization server whether the token is still active (RFC 7662) and gets the state as of now, including a disabled account or an ended session. → Breaks: latency and a dependency on the authorization server on every call; so use it only where the risk justifies it, with a very short cache, and leave the rest on local validation.",
          },
          {
            titulo: "7. A key kill switch",
            texto:
              "In a serious incident (leaked key, mass improper issuance), remove the signing key from the JWKS or replace it: every token signed with that `kid` stops validating at once (see Q73). → Limit: it logs out every user, it is not selective, and it depends on each API refreshing its JWKS cache.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Local validation plus the minimum revocation state",
        legenda: "TypeScript",
        codigo: `import { jwtVerify, createRemoteJWKSet } from "jose";

const jwks = createRemoteJWKSet(new URL("https://idp.example.com/jwks"));

export async function authenticate(token: string) {
  const { payload } = await jwtVerify(token, jwks, {
    issuer: "https://idp.example.com",
    audience: "api://orders",
    algorithms: ["RS256"], // fixed algorithm, never the one in the header
  });
  // The minimum state revocation needs: two Redis reads
  if (await redis.exists("revoked:" + payload.jti)) throw new Error("token revoked");
  const current = Number(await redis.get("version:" + payload.sub)) || 0;
  if (Number(payload.ver) !== current) throw new Error("session ended");
  return payload;
}

export async function revoke(jti: string, exp: number) {
  const ttl = exp - Math.floor(Date.now() / 1000); // vanishes when the token would expire anyway
  if (ttl > 0) await redis.set("revoked:" + jti, "1", "EX", ttl);
}`,
        nota: "Simplified example: `redis` is an already configured client. If Redis goes down, decide in advance whether the API fails closed (refuses) or open (accepts) and monitor that choice.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule",
        texto:
          "Revoking is choosing **how much state** to accept. Start with short access tokens and rotated refresh tokens, which cover most cases; add the **session version** where logout and password change must take effect within seconds, **introspection** only on sensitive operations, the `jti` list for one-off cases and the **key kill switch** for incidents. On every state check, decide what happens when the store goes down (fail closed or open).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What no layer solves",
        texto:
          "A stolen token works until the next check or `exp`; revoking the refresh token does not kill an access token already issued; and revoking at the authorization server does not by itself end the session in each application (see Q82). If immediate revocation is a hard requirement on every call, an opaque token with introspection (see Q74) or a server-side session (see Q75) is more honest than a JWT patched until it becomes a session.",
      },
    ],
    armadilhas: [
      "Believing that deleting the token in the browser at logout revokes it: a stolen copy stays valid until `exp`.",
      "A `jti` list with no TTL (it grows forever) or a token with no `jti`: you can only revoke what you can identify.",
      "Revoking only one side: the refresh token but not the access token already issued, or the session at the authorization server but not at the APIs that accept the token.",
      "A revocation cache with a long validity, or an API that fails open with no monitoring: revocation exists on paper and does not work when the incident hits.",
    ],
    autoteste: [
      {
        pergunta: "Why can an entry in the revoked-`jti` list expire on its own?",
        resposta:
          "Because once the token’s `exp` has passed, normal validation already rejects it; the entry only needs to last for the time left until `exp`. That is what keeps the list from growing without limit.",
      },
      {
        pergunta: "The user changed their password. How do you drop every old access token without listing each `jti`?",
        resposta:
          "With the user’s version (or a “valid from” timestamp compared with `iat`): you increment the value and the API refuses tokens carrying the old version. It costs one small read per request and the cache delay.",
      },
    ],
  },
};
