import type { Pergunta } from "../../tipos";

// Q132 · JWT: alg none e confusão de chave
export const q132: Pergunta = {
  numero: 132,
  modulo: "ataques-e-depuracao",
  metodo: "threat",
  pt: {
    titulo: "JWT: alg none e confusão de chave",
    pergunta:
      "Como funcionam os ataques alg: none e de confusão de algoritmo (RS256 para HS256) contra JWTs? O que a validação correta deve fixar?",
    porqueEsteMetodo:
      "Os dois ataques exploram o mesmo erro de raciocínio. Ver o token forjado ao lado da validação correta mostra por que fixar o algoritmo no servidor resolve.",
    resposta30s:
      "Nos dois ataques, o verificador **confia no `alg` do header, e quem escreve o header é o atacante**. Com `alg: none` ele aceita um token sem assinatura; na confusão RS256 para HS256, a **chave pública** (que é pública) vira o **segredo HMAC** com que o invasor assina o token. A correção é **fixar no servidor o algoritmo e o tipo de chave esperados**, usar uma biblioteca atualizada e manter testes negativos (veja Q72).",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ataque → defesa",
        rotuloOrigem: "Ataque ou causa",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "**`alg: none`**: o invasor troca o header por `none` (ou `None`, `nOnE`), edita as claims (`role: admin`) e remove a assinatura. Um verificador que obedece ao `alg` não tem o que verificar e aceita o token. A RFC 7519 descreve o JWT sem assinatura, mas ele não serve para autenticar.",
            destino:
              "**Nunca aceitar `none`** em tokens de acesso ou de identidade: a lista de algoritmos permitidos, definida no servidor, não o inclui. Uma lista de permitidos, não uma lista de proibidos.",
          },
          {
            origem:
              "**Confusão RS256 para HS256**: o invasor pega a chave pública (JWKS, certificado), troca o `alg` para `HS256` e assina o token com HMAC usando a chave pública como segredo. O verificador, que passa a “chave configurada” ao algoritmo que o token pede, calcula o mesmo HMAC e aceita.",
            destino:
              "**Fixar o algoritmo por chave ou por emissor** (`algorithms: [RS256]`): `HS256` nunca é tentado com uma chave pública, e o token que declara outro algoritmo é recusado antes de qualquer conta.",
          },
          {
            origem:
              "Causa comum: o algoritmo vem do token, e uma mesma variável “chave” serve para qualquer algoritmo.",
            destino:
              "**Tipar a chave**: chave pública RSA ou EC só para algoritmos assimétricos, segredo só para HS*. Se o JWKS publica `alg` e `use` para a chave, respeite-os e recuse a divergência.",
          },
          {
            origem: "Biblioteca desatualizada, ou verificador escrito em casa que lê o header e decide sozinho.",
            destino:
              "Biblioteca mantida e atualizada (`jose`, o `JwtBearer` do ASP.NET Core), nunca um verificador próprio, e atenção aos avisos de segurança. A RFC 8725 reúne as boas práticas para JWT.",
          },
          {
            origem: "Regressão silenciosa: alguém remove a lista de algoritmos ou troca de biblioteca.",
            destino:
              "**Testes negativos** no CI: token `none`, HS256 assinado com a chave pública, `alg` diferente do esperado, assinatura adulterada, `exp` vencido, `aud` errado. Todos devem resultar em 401.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Os dois tokens forjados",
        legenda: "JWT",
        codigo: `// 1. alg none: sem assinatura (repare no ponto final)
cabeçalho: { "alg": "none", "typ": "JWT" }
payload:   { "sub": "123", "role": "admin" }
assinatura: (vazia)

// 2. Confusão RS256 para HS256: o invasor assina com a chave PÚBLICA
cabeçalho: { "alg": "HS256", "typ": "JWT" }
payload:   { "sub": "123", "role": "admin" }
assinatura: HMAC-SHA256(chave pública do servidor, cabeçalho.payload)`,
        nota: "O verificador vulnerável lê o `alg` do cabeçalho e verifica do jeito que o token pediu: com `none` não há o que verificar, e com HS256 ele usa como segredo a chave configurada, que era a pública.",
      },
      {
        tipo: "codigo",
        titulo: "Validação com o algoritmo fixado no servidor",
        legenda: "TypeScript",
        codigo: `import { createRemoteJWKSet, jwtVerify } from "jose";

const jwks = createRemoteJWKSet(new URL("https://idp.example.com/.well-known/jwks.json"));

export async function validar(token: string) {
  const { payload } = await jwtVerify(token, jwks, {
    algorithms: ["RS256"], // fixado aqui, não no token: none e HS256 são recusados
    issuer: "https://idp.example.com",
    audience: "https://api.example.com",
  });
  return payload;
}`,
        nota: "No ASP.NET Core, o equivalente é restringir `TokenValidationParameters.ValidAlgorithms`. Nos dois casos, o algoritmo vem da configuração do servidor.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que a validação deve fixar",
        texto:
          "O header **descreve** o token; quem **decide** como verificá-lo é o servidor. Fixe o **algoritmo** (por emissor ou chave), a **chave** (do JWKS do emissor esperado, nunca do token: veja Q133), o **`iss`**, o **`aud`**, o **tempo** (`exp`, `nbf`) e, quando usado, o **tipo** do token. Só então as claims merecem confiança. O passo a passo completo está em Q72.",
      },
    ],
    armadilhas: [
      "Barrar só o texto `none` em minúsculas ou filtrar palavras: variantes de caixa e outros algoritmos escapam. Use uma lista de algoritmos permitidos.",
      "Aceitar `RS256` e `HS256` “por compatibilidade” no mesmo verificador, com a mesma variável de chave.",
      "Ler o `alg` do token para escolher como verificar e depois “validar” o que o token declarou. O header só descreve.",
      "Achar que `exp`, `iss` e `aud` corretos bastam: sem assinatura e algoritmo válidos, o invasor escreve as claims que quiser.",
    ],
    autoteste: [
      {
        pergunta: "Por que o `alg: none` funciona num verificador mal escrito?",
        resposta:
          "Porque o verificador pergunta ao próprio token como verificá-lo. O `none` significa “sem assinatura”, e obedecer a isso deixa o verificador sem nada para conferir, então o token é aceito.",
      },
      {
        pergunta: "Na confusão RS256 para HS256, por que o invasor consegue assinar um token que o servidor aceita?",
        resposta:
          "Porque a chave pública é pública e, quando o header diz HS256, o verificador a usa como segredo HMAC. O invasor calcula o mesmo HMAC com a mesma chave. A correção é fixar o algoritmo e o tipo de chave no servidor.",
      },
    ],
  },
  en: {
    titulo: "JWT alg none and key confusion",
    pergunta:
      "How do alg: none and algorithm confusion attacks (RS256 to HS256) work against JWTs? What must correct validation pin down?",
    porqueEsteMetodo:
      "Both attacks exploit the same reasoning error. Seeing the forged token next to the correct validation shows why pinning the algorithm on the server solves it.",
    resposta30s:
      "In both attacks, the verifier **trusts the header’s `alg`, and the attacker writes the header**. With `alg: none` it accepts a token with no signature; in RS256 to HS256 confusion, the **public key** (which is public) becomes the **HMAC secret** with which the attacker signs the token. The fix is to **pin the expected algorithm and key type on the server**, use an up-to-date library and keep negative tests (see Q72).",
    blocos: [
      {
        tipo: "pares",
        titulo: "Attack → defense",
        rotuloOrigem: "Attack or cause",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "**`alg: none`**: the attacker swaps the header for `none` (or `None`, `nOnE`), edits the claims (`role: admin`) and removes the signature. A verifier that obeys `alg` has nothing to verify and accepts the token. RFC 7519 describes an unsigned JWT, but it is not meant for authentication.",
            destino:
              "**Never accept `none`** in access or identity tokens: the list of allowed algorithms, defined on the server, does not include it. An allowlist, not a denylist.",
          },
          {
            origem:
              "**RS256 to HS256 confusion**: the attacker takes the public key (JWKS, certificate), changes `alg` to `HS256` and signs the token with HMAC using the public key as the secret. The verifier, which hands the “configured key” to whichever algorithm the token asks for, computes the same HMAC and accepts it.",
            destino:
              "**Pin the algorithm per key or per issuer** (`algorithms: [RS256]`): `HS256` is never tried with a public key, and a token that declares another algorithm is refused before any computation.",
          },
          {
            origem:
              "Common cause: the algorithm comes from the token, and a single “key” variable serves any algorithm.",
            destino:
              "**Type the key**: an RSA or EC public key only for asymmetric algorithms, a secret only for HS*. If the JWKS publishes `alg` and `use` for the key, respect them and reject any mismatch.",
          },
          {
            origem: "An outdated library, or a home-made verifier that reads the header and decides on its own.",
            destino:
              "A maintained, up-to-date library (`jose`, ASP.NET Core’s `JwtBearer`), never a verifier of your own, and attention to security advisories. RFC 8725 gathers JWT best practices.",
          },
          {
            origem: "Silent regression: someone removes the algorithm list or switches libraries.",
            destino:
              "**Negative tests** in CI: a `none` token, HS256 signed with the public key, an `alg` different from the expected one, a tampered signature, an expired `exp`, a wrong `aud`. All must result in 401.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The two forged tokens",
        legenda: "JWT",
        codigo: `// 1. alg none: no signature (note the trailing dot)
header:    { "alg": "none", "typ": "JWT" }
payload:   { "sub": "123", "role": "admin" }
signature: (empty)

// 2. RS256 to HS256 confusion: the attacker signs with the PUBLIC key
header:    { "alg": "HS256", "typ": "JWT" }
payload:   { "sub": "123", "role": "admin" }
signature: HMAC-SHA256(server public key, header.payload)`,
        nota: "The vulnerable verifier reads `alg` from the header and verifies the way the token asked: with `none` there is nothing to verify, and with HS256 it uses the configured key, which was the public one, as the secret.",
      },
      {
        tipo: "codigo",
        titulo: "Validation with the algorithm pinned on the server",
        legenda: "TypeScript",
        codigo: `import { createRemoteJWKSet, jwtVerify } from "jose";

const jwks = createRemoteJWKSet(new URL("https://idp.example.com/.well-known/jwks.json"));

export async function validate(token: string) {
  const { payload } = await jwtVerify(token, jwks, {
    algorithms: ["RS256"], // pinned here, not in the token: none and HS256 are refused
    issuer: "https://idp.example.com",
    audience: "https://api.example.com",
  });
  return payload;
}`,
        nota: "In ASP.NET Core, the equivalent is restricting `TokenValidationParameters.ValidAlgorithms`. In both cases, the algorithm comes from the server’s configuration.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What validation must pin down",
        texto:
          "The header **describes** the token; the server **decides** how to verify it. Pin the **algorithm** (per issuer or key), the **key** (from the expected issuer’s JWKS, never from the token: see Q133), the **`iss`**, the **`aud`**, the **time** (`exp`, `nbf`) and, when used, the token **type**. Only then do the claims deserve trust. The full step-by-step is in Q72.",
      },
    ],
    armadilhas: [
      "Blocking only the lowercase text `none` or filtering words: case variants and other algorithms slip through. Use a list of allowed algorithms.",
      "Accepting both `RS256` and `HS256` “for compatibility” in the same verifier, with the same key variable.",
      "Reading `alg` from the token to choose how to verify and then “validating” what the token declared. The header only describes.",
      "Thinking correct `exp`, `iss` and `aud` are enough: without a valid signature and algorithm, the attacker writes whatever claims they want.",
    ],
    autoteste: [
      {
        pergunta: "Why does `alg: none` work against a badly written verifier?",
        resposta:
          "Because the verifier asks the token itself how to verify it. `none` means “no signature”, and obeying that leaves nothing to check, so the token is accepted.",
      },
      {
        pergunta: "In RS256 to HS256 confusion, why can the attacker sign a token the server accepts?",
        resposta:
          "Because the public key is public and, when the header says HS256, the verifier uses it as the HMAC secret. The attacker computes the same HMAC with the same key. The fix is to pin the algorithm and key type on the server.",
      },
    ],
  },
};
