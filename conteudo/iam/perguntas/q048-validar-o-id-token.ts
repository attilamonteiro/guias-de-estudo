import type { Pergunta } from "../../tipos";

// Q48 · Validar o ID token
export const q048: Pergunta = {
  numero: 48,
  modulo: "oidc",
  metodo: "playbook",
  pt: {
    titulo: "Validar o ID token",
    pergunta:
      "Que checagens um cliente deve fazer ao receber um ID token? Liste a ordem e explique o que cada validação impede.",
    porqueEsteMetodo:
      "“Que checagens, em que ordem?” pede uma lista de verificação. Um playbook dá a sequência, o motivo de cada passo e o critério que separa aceitar de recusar.",
    resposta30s:
      "Valide **a assinatura primeiro**, com a chave do JWKS do emissor e o algoritmo que **você** fixou (nunca `none`), e só então as claims: **`iss`** igual ao emissor esperado, **`aud`** com o seu `client_id` (e `azp` quando houver várias audiences), **`exp`** e **`iat`** com pequena tolerância de relógio, **`nonce`** igual ao guardado, e **`at_hash`** ou **`c_hash`** quando existirem. Cada checagem fecha um ataque: forja, token de outro emissor ou de outra aplicação, token velho, replay e troca do access token. Use uma biblioteca e, se algo falhar, recuse o login.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: a ordem das validações",
        passos: [
          {
            titulo: "Decifre (se for JWE) e verifique a assinatura com o algoritmo que você fixou",
            texto:
              "Se o IdP criptografa o ID token, decifre antes. Depois verifique a assinatura com a chave do JWKS do emissor **configurado**, localizada pelo `kid` (veja Q45), e com o algoritmo esperado (em geral `RS256` ou `ES256`), nunca o que o cabeçalho disser. Rejeite `alg: none`. **Impede:** token forjado ou adulterado e a confusão de algoritmo (a chave pública usada como segredo de HMAC). Sinal de acerto: um token com uma letra trocada falha aqui.",
          },
          {
            titulo: "Confira o `iss`",
            texto:
              "O `iss` deve ser idêntico, caractere por caractere, ao emissor que você configurou. Em apps multi-tenant vale a regra da Q53. **Impede:** aceitar token de outro IdP ou de outro tenant, mesmo com assinatura válida num conjunto de chaves compartilhado. Critério: igualdade exata, nunca “começa com”.",
          },
          {
            titulo: "Confira o `aud` e o `azp`",
            texto:
              "O `aud` deve conter o seu `client_id`. Se houver mais de uma audience, o `azp` deve estar presente e ser o seu `client_id`. **Impede:** usar como seu um token emitido para outra aplicação do mesmo IdP. Critério: o seu `client_id` está na audience; qualquer outra situação é recusa.",
          },
          {
            titulo: "Confira `exp` e `iat` (e `nbf`) com tolerância de relógio",
            texto:
              "O `exp` precisa estar no futuro; o `iat` não pode estar muito distante do agora, e o `nbf`, se existir, não pode estar à frente. Aceite uma folga curta para a diferença entre relógios (segundos, não horas) e mantenha os servidores sincronizados. **Impede:** reuso de token velho e aceitação de token que ainda não vale.",
          },
          {
            titulo: "Confira o `nonce`",
            texto:
              "Compare a claim `nonce` com o valor guardado na sessão do navegador que iniciou o login e depois apague esse valor. Se você enviou o `nonce` e o token não o traz, recuse. **Impede:** replay e substituição do ID token (veja Q47). Critério: igualdade exata.",
          },
          {
            titulo: "Confira `at_hash` e `c_hash`, quando existirem",
            texto:
              "O `at_hash` é a metade esquerda do hash do access token, em base64url, calculado com o algoritmo de hash do `alg` do ID token (SHA-256 para `RS256`); o `c_hash` faz o mesmo com o `code` nos fluxos hybrid. Recalcule e compare. **Impede:** trocar o access token (ou o código) por outro enquanto o ID token continua válido.",
          },
          {
            titulo: "Confira `acr` e `auth_time`, quando você os exigiu",
            texto:
              "Se pediu `max_age` ou `acr_values`, o `auth_time` não pode ser mais antigo que o `max_age`, e o `acr` precisa estar entre os níveis que você aceita (veja Q50). **Impede:** aceitar uma autenticação velha ou fraca como se fosse a exigida. Critério: a falta da claim exigida é recusa.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Verificar um ID token com uma chave pública",
        legenda: "TypeScript",
        codigo:
          'import { importSPKI, jwtVerify } from "jose";\n\ntype Esperado = { issuer: string; clientId: string; nonce: string };\n\nexport async function verificarIdToken(idToken: string, pem: string, esperado: Esperado) {\n  const chave = await importSPKI(pem, "RS256"); // chave pública do emissor\n  const { payload } = await jwtVerify(idToken, chave, {\n    algorithms: ["RS256"], // fixo: nada de "none" nem do que o cabeçalho pedir\n    issuer: esperado.issuer, // iss idêntico, caractere por caractere\n    audience: esperado.clientId, // aud contém o seu client_id\n    requiredClaims: ["exp", "iat", "sub"],\n    clockTolerance: 60, // segundos de folga entre relógios\n  });\n  const varias = Array.isArray(payload.aud) && payload.aud.length > 1;\n  if (varias && payload.azp !== esperado.clientId) throw new Error("azp inválido");\n  if (payload.nonce !== esperado.nonce) throw new Error("nonce não confere");\n  return payload; // só agora as claims podem ser usadas\n}',
        nota: "Em produção a chave vem do JWKS do emissor (`createRemoteJWKSet`, veja Q45), não de um PEM fixo; o PEM aqui só mostra a verificação com uma chave pública. Os nomes das opções são da biblioteca `jose`; confira a documentação da sua versão.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Use a **biblioteca** do seu IdP ou da sua plataforma (`jose` ou `openid-client` em Node.js, o pacote `Microsoft.IdentityModel` no ASP.NET Core): ela faz tudo isso numa chamada, com os casos de borda já tratados. Escreva a validação à mão só para estudar ou sem alternativa, e então teste cada falha (assinatura, `iss`, `aud`, `exp`, `nonce`). Em qualquer caso: **assinatura primeiro, claims depois, e nenhuma claim é usada antes de a verificação passar**. O emissor e o algoritmo vêm da sua configuração, nunca do token.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Decodificar não é verificar, e o ID token não é para a API",
        texto:
          "Funções como `decode` só leem o payload e não provam nada. Quando alguma checagem falha, **recuse o login**: não crie sessão, registre o motivo sem gravar o token inteiro e mostre ao usuário uma mensagem genérica. O ID token tem como audience o seu cliente; não o envie como credencial a uma API, que valida o **access token** com a sua própria audience. A especificação admite dispensar a assinatura quando o token vem direto do endpoint de token por TLS verificado, mas validá-la custa pouco e é o que as bibliotecas fazem.",
      },
    ],
    armadilhas: [
      "Aceitar `alg: none` ou o algoritmo que o cabeçalho indicar, inclusive a confusão em que a chave pública RSA é usada como segredo HMAC: fixe o algoritmo esperado.",
      "Ignorar o `aud` (ou o `iss`): um ID token legítimo emitido para outra aplicação do mesmo IdP passa a abrir a sua.",
      "Usar `decode` no lugar de `verify`, ou ler claims antes de a assinatura ser verificada.",
      "Ampliar a tolerância de relógio “para parar de dar erro” em vez de sincronizar os servidores, ou esquecer de conferir o `nonce` que você mesmo enviou.",
    ],
    autoteste: [
      {
        pergunta: "Por que verificar a assinatura não basta?",
        resposta:
          "Ela prova que o IdP emitiu o token e que nada mudou, mas não que o token foi emitido para você (`aud`), pelo emissor certo (`iss`), ainda vale (`exp`) e pertence a este login (`nonce`). Cada claim fecha uma lacuna que a assinatura deixa.",
      },
      {
        pergunta: "O que o `at_hash` confere?",
        resposta:
          "Que o access token recebido é o que o IdP vinculou ao ID token: recalcula-se a metade esquerda do hash do access token, com o hash do `alg` do ID token (SHA-256 para `RS256`), em base64url, e compara-se. Impede a troca do access token por outro.",
      },
    ],
  },
  en: {
    titulo: "Validating the ID token",
    pergunta:
      "What checks must a client make when it receives an ID token? List them in order and explain what each validation prevents.",
    porqueEsteMetodo:
      "“What checks, in what order?” asks for a checklist. A playbook gives the sequence, the reason for each step and the criterion that separates accepting from rejecting.",
    resposta30s:
      "Validate **the signature first**, with the issuer’s JWKS key and the algorithm **you** fixed (never `none`), and only then the claims: **`iss`** equal to the expected issuer, **`aud`** containing your `client_id` (and `azp` when there are several audiences), **`exp`** and **`iat`** with a small clock tolerance, **`nonce`** equal to the stored one, and **`at_hash`** or **`c_hash`** when present. Each check closes an attack: forgery, a token from another issuer or application, an old token, replay and swapping the access token. Use a library and, if anything fails, reject the login.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: the order of validations",
        passos: [
          {
            titulo: "Decrypt (if it is a JWE) and verify the signature with the algorithm you fixed",
            texto:
              "If the IdP encrypts the ID token, decrypt first. Then verify the signature with the key from the **configured** issuer’s JWKS, located by `kid` (see Q45), and with the expected algorithm (usually `RS256` or `ES256`), never whatever the header says. Reject `alg: none`. **Prevents:** a forged or tampered token and algorithm confusion (the public key used as an HMAC secret). Sign of success: a token with one letter changed fails here.",
          },
          {
            titulo: "Check `iss`",
            texto:
              "`iss` must be identical, character for character, to the issuer you configured. In multi-tenant apps the rule from Q53 applies. **Prevents:** accepting a token from another IdP or another tenant, even with a valid signature from a shared key set. Criterion: exact equality, never “starts with”.",
          },
          {
            titulo: "Check `aud` and `azp`",
            texto:
              "`aud` must contain your `client_id`. If there is more than one audience, `azp` must be present and equal to your `client_id`. **Prevents:** using as yours a token issued for another application of the same IdP. Criterion: your `client_id` is in the audience; any other situation is a rejection.",
          },
          {
            titulo: "Check `exp` and `iat` (and `nbf`) with clock tolerance",
            texto:
              "`exp` must be in the future; `iat` must not be too far from now, and `nbf`, if present, must not be ahead. Allow a short margin for clock differences (seconds, not hours) and keep the servers synchronized. **Prevents:** reuse of an old token and acceptance of a token that is not valid yet.",
          },
          {
            titulo: "Check the `nonce`",
            texto:
              "Compare the `nonce` claim with the value stored in the session of the browser that started the login, then delete that value. If you sent the `nonce` and the token does not carry it, reject. **Prevents:** ID token replay and substitution (see Q47). Criterion: exact equality.",
          },
          {
            titulo: "Check `at_hash` and `c_hash`, when present",
            texto:
              "`at_hash` is the left half of the access token’s hash, in base64url, computed with the hash algorithm of the ID token’s `alg` (SHA-256 for `RS256`); `c_hash` does the same with the `code` in hybrid flows. Recompute and compare. **Prevents:** swapping the access token (or the code) for another while the ID token stays valid.",
          },
          {
            titulo: "Check `acr` and `auth_time`, when you required them",
            texto:
              "If you asked for `max_age` or `acr_values`, `auth_time` cannot be older than `max_age`, and `acr` must be among the levels you accept (see Q50). **Prevents:** accepting an old or weak authentication as if it were the one required. Criterion: a missing required claim is a rejection.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Verifying an ID token with a public key",
        legenda: "TypeScript",
        codigo:
          'import { importSPKI, jwtVerify } from "jose";\n\ntype Expected = { issuer: string; clientId: string; nonce: string };\n\nexport async function verifyIdToken(idToken: string, pem: string, expected: Expected) {\n  const key = await importSPKI(pem, "RS256"); // the issuer’s public key\n  const { payload } = await jwtVerify(idToken, key, {\n    algorithms: ["RS256"], // fixed: no "none", nothing the header asks for\n    issuer: expected.issuer, // iss identical, character for character\n    audience: expected.clientId, // aud contains your client_id\n    requiredClaims: ["exp", "iat", "sub"],\n    clockTolerance: 60, // seconds of slack between clocks\n  });\n  const several = Array.isArray(payload.aud) && payload.aud.length > 1;\n  if (several && payload.azp !== expected.clientId) throw new Error("invalid azp");\n  if (payload.nonce !== expected.nonce) throw new Error("nonce mismatch");\n  return payload; // only now can the claims be used\n}',
        nota: "In production the key comes from the issuer’s JWKS (`createRemoteJWKSet`, see Q45), not from a fixed PEM; the PEM here only shows verification with a public key. The option names belong to the `jose` library; check the documentation for your version.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Use your IdP’s or platform’s **library** (`jose` or `openid-client` in Node.js, the `Microsoft.IdentityModel` package in ASP.NET Core): it does all of this in one call, with the edge cases already handled. Write the validation by hand only to study or when there is no alternative, and then test every failure (signature, `iss`, `aud`, `exp`, `nonce`). Either way: **signature first, claims after, and no claim is used before verification passes**. The issuer and the algorithm come from your configuration, never from the token.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Decoding is not verifying, and the ID token is not for the API",
        texto:
          "Functions such as `decode` only read the payload and prove nothing. When any check fails, **reject the login**: do not create a session, log the reason without storing the whole token and show the user a generic message. The ID token’s audience is your client; do not send it as a credential to an API, which validates the **access token** against its own audience. The specification allows skipping the signature when the token comes directly from the token endpoint over verified TLS, but validating it costs little and is what libraries do.",
      },
    ],
    armadilhas: [
      "Accepting `alg: none` or whatever algorithm the header names, including the confusion where the RSA public key is used as an HMAC secret: fix the expected algorithm.",
      "Ignoring `aud` (or `iss`): a legitimate ID token issued for another application of the same IdP now opens yours.",
      "Using `decode` instead of `verify`, or reading claims before the signature is verified.",
      "Widening the clock tolerance “to stop the errors” instead of synchronizing the servers, or forgetting to check the `nonce` you yourself sent.",
    ],
    autoteste: [
      {
        pergunta: "Why is verifying the signature not enough?",
        resposta:
          "It proves the IdP issued the token and nothing changed, but not that the token was issued for you (`aud`), by the right issuer (`iss`), is still valid (`exp`) and belongs to this login (`nonce`). Each claim closes a gap the signature leaves open.",
      },
      {
        pergunta: "What does `at_hash` check?",
        resposta:
          "That the received access token is the one the IdP bound to the ID token: you recompute the left half of the access token’s hash, using the hash of the ID token’s `alg` (SHA-256 for `RS256`), in base64url, and compare. It prevents swapping the access token for another.",
      },
    ],
  },
};
