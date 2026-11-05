import type { Pergunta } from "../../tipos";

// Q143 · Depurar token rejeitado pela API
export const q143: Pergunta = {
  numero: 143,
  modulo: "ataques-e-depuracao",
  metodo: "playbook",
  pt: {
    titulo: "Depurar token rejeitado pela API",
    pergunta:
      "Uma API devolve 401 para um token aparentemente válido. Como você depura: relógio (clock skew), iss, aud, kid e cache de JWKS, escopos e algoritmo?",
    porqueEsteMetodo:
      "O 401 é um sintoma com várias causas independentes, e adivinhar custa caro. Um playbook com uma ordem de verificação, do mais barato ao mais específico, separa o token errado da configuração errada.",
    resposta30s:
      "Comece pela resposta (`WWW-Authenticate`) e pelo log de validação da API, decodifique o token **sem confiar nele** e compare cada valor com a configuração: `iss` e `aud` **idênticos**, `exp` e `nbf` coerentes com o relógio, `kid` presente no JWKS atual (cache velho depois de uma rotação), algoritmo permitido e escopos exigidos. Depois separe o **token errado** (de outro ambiente, expirado, ID token no lugar do access token) da **configuração errada** testando um token novo. Nunca corrija desligando validações.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Ordem de verificação",
        passos: [
          {
            titulo: "1. Reproduza e leia a resposta",
            texto:
              'Chame a API com o mesmo token e leia o status e o `WWW-Authenticate` (RFC 6750): `error="invalid_token"` com 401 é problema do token (ou da validação); `insufficient_scope` vem com 403 e é falta de permissão, não de autenticação. Abra o log de validação da API, que deve gravar o **motivo interno** (assinatura, `aud`, `exp`...) mesmo que ao cliente só vá uma resposta genérica. Confirme também que o cabeçalho `Authorization: Bearer ...` chega inteiro: proxy que o remove, token truncado, preflight CORS (`OPTIONS`) sem o cabeçalho.',
          },
          {
            titulo: "2. Decodifique o token sem confiar nele",
            texto:
              "Separe as três partes e decodifique cabeçalho e carga em base64url, **localmente**. É só leitura: nada ali foi verificado. Veja `alg`, `kid`, `iss`, `aud`, `exp`, `nbf`, `iat`, `sub` e os escopos. Se não decodifica, é um token opaco: use a introspecção (veja Q35 e Q74). Se o `aud` é o ID do aplicativo cliente, você provavelmente mandou o **ID token** em vez do access token.",
          },
          {
            titulo: "3. Compare `iss` e `aud` com a configuração da API",
            texto:
              "Ambos devem ser **idênticos**, caractere a caractere, ao configurado: barra final, `https`, tenant ou realm, versão do endpoint (algumas plataformas emitem `iss` diferente por versão) e ambiente (homologação ou produção). O `aud` precisa ser o identificador desta API, não o de outra.",
          },
          {
            titulo: "4. Verifique o relógio",
            texto:
              "Compare `exp`, `nbf` e `iat` (segundos desde 1970, em UTC) com a hora do servidor da API. Um servidor adiantado ou atrasado rejeita um token recém-emitido (`nbf` no futuro) ou aceita um vencido. Sincronize por NTP e use tolerância curta, de segundos: aumentá-la para minutos ou horas esconde o problema e amplia a janela de uso de um token roubado.",
          },
          {
            titulo: "5. Confira chave e algoritmo",
            texto:
              "O `kid` do cabeçalho precisa existir no JWKS que a API tem em cache. Logo depois de uma rotação, um cache velho não conhece a chave nova: busque o `jwks_uri` (veja Q45) e compare; o cache deve ser atualizado ao ver um `kid` desconhecido, com limite de frequência (veja Q73). Confira se a API alcança o `jwks_uri` (firewall, proxy, DNS). O `alg` precisa estar na lista **fixada na API**, nunca lida do token (veja Q132).",
          },
          {
            titulo: "6. Confira escopos e papéis",
            texto:
              "Veja se o token traz os escopos ou papéis exigidos pela rota, e em qual claim (`scope`, `scp`, `roles`): o nome varia por IdP e a API pode estar lendo o errado. Token de usuário e token de aplicação (client credentials) trazem coisas diferentes. Falta de permissão deveria dar 403, não 401.",
          },
          {
            titulo: "7. Separe token errado de configuração errada",
            texto:
              "Obtenha um token novo do mesmo IdP, para a mesma API e os mesmos escopos, e chame de novo. Se passa, o token anterior estava errado (expirado, de outro ambiente, audiência errada). Se falha do mesmo jeito, a configuração da API está errada (authority, audience, algoritmo, JWKS, rede). Teste também o mesmo token em outra instância ou ambiente para achar a divergência.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Sintoma → causa provável",
        colunas: ["Sintoma", "Causa provável", "Como confirmar"],
        linhas: [
          [
            "Funciona em homologação e falha em produção",
            "`iss`, `aud` ou JWKS de outro ambiente",
            "Compare o `iss` do token com a authority configurada e o `aud` com o identificador da API",
          ],
          [
            "Falha logo depois de o IdP rotacionar chaves",
            "`kid` ausente no JWKS em cache",
            "Busque o JWKS e procure o `kid`; veja quando o cache foi atualizado pela última vez",
          ],
          [
            "Falha só em algumas requisições ou instâncias",
            "Relógio dessincronizado numa instância, ou cache de JWKS diferente por réplica",
            "Compare a hora de cada instância e os logs de validação por instância",
          ],
          [
            "O navegador falha, mas o curl funciona",
            "Preflight `OPTIONS` sem `Authorization`, ou cabeçalho removido por um proxy",
            "Veja qual método falhou na aba Rede e o que chegou à API",
          ],
          [
            "Token recém-emitido rejeitado com `nbf` ou `iat` no futuro",
            "Relógio do emissor adiantado em relação ao da API",
            "Decodifique o token e compare com a hora atual do servidor da API",
          ],
          [
            "401 por falta de escopo, ou 403 `insufficient_scope`",
            "A claim de escopo tem outro nome ou formato do que a API espera",
            "Compare as claims do token com a política da rota",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Validar e dizer qual verificação falhou",
        legenda: "TypeScript",
        codigo: `import { createRemoteJWKSet, decodeJwt, decodeProtectedHeader, errors, jwtVerify } from "jose";
const jwks = createRemoteJWKSet(new URL("https://idp.example.com/.well-known/jwks.json"));

export async function diagnosticar(token: string) {
  console.log(decodeProtectedHeader(token), decodeJwt(token)); // só olhar: decodificar não valida
  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: "https://idp.example.com/",
      audience: "https://api.example.com",
      algorithms: ["RS256"], // fixado na API, nunca lido do token
      clockTolerance: 30, // segundos
    });
    return "ok, escopos: " + payload.scope;
  } catch (e) {
    if (e instanceof errors.JWTExpired) return "exp: token velho ou relógio";
    if (e instanceof errors.JWTClaimValidationFailed) return e.claim + ": " + e.reason;
    if (e instanceof errors.JWKSNoMatchingKey) return "kid fora do JWKS";
    if (e instanceof errors.JWSSignatureVerificationFailed) return "assinatura inválida";
    throw e;
  }
}`,
        nota: "A biblioteca `jose` refaz a busca do JWKS quando vê um `kid` desconhecido, com um intervalo mínimo entre as buscas (confira a documentação). Em produção, grave o motivo no log interno e devolva ao cliente só um 401 genérico.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não conserte desligando a validação",
        texto:
          "Ignorar `iss` ou `aud`, desligar a checagem de expiração, aceitar qualquer `alg` ou subir a tolerância de relógio para horas faz o 401 sumir e abre a API a tokens de outros emissores, de outras APIs e a tokens vencidos. E não cole tokens de produção em sites de terceiros: decodifique localmente.",
      },
    ],
    armadilhas: [
      "Desligar a validação de `iss`, `aud` ou expiração (ou aceitar qualquer `alg`) “para ver se passa” e esquecer ligado.",
      "Enviar o ID token à API em vez do access token: o `aud` do ID token é o cliente, não a API.",
      "Um cache de JWKS que nunca é atualizado depois de uma rotação, ou o oposto: buscar o JWKS a cada requisição.",
      "Subir a tolerância de relógio para horas em vez de corrigir o NTP, ou colar tokens reais em sites de decodificação de terceiros.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença de significado entre 401 e 403 numa API com tokens?",
        resposta:
          "O 401 diz que a autenticação falhou (token ausente, inválido, expirado, assinatura ou audiência erradas); o 403 diz que o token é válido, mas não autoriza aquela ação (por exemplo, `insufficient_scope`). Investigar um e outro leva a lugares diferentes.",
      },
      {
        pergunta: "Os tokens novos passam a falhar logo depois de o IdP rotacionar as chaves. O que verificar?",
        resposta:
          "Se o `kid` do token existe no JWKS que a API tem em cache. Cache velho não conhece a chave nova; a API deve buscar o JWKS de novo ao ver um `kid` desconhecido, com limite de frequência, e respeitar o tempo de cache indicado pelo IdP.",
      },
    ],
  },
  en: {
    titulo: "Debugging a rejected token",
    pergunta:
      "An API returns 401 for a seemingly valid token. How do you debug it: clock skew, iss, aud, kid and JWKS cache, scopes and algorithm?",
    porqueEsteMetodo:
      "The 401 is a symptom with several independent causes, and guessing is expensive. A playbook with a verification order, from the cheapest to the most specific, separates the wrong token from the wrong configuration.",
    resposta30s:
      "Start from the response (`WWW-Authenticate`) and the API’s validation log, decode the token **without trusting it** and compare each value with the configuration: `iss` and `aud` **identical**, `exp` and `nbf` consistent with the clock, `kid` present in the current JWKS (a stale cache after a rotation), allowed algorithm and required scopes. Then separate the **wrong token** (from another environment, expired, an ID token in place of an access token) from the **wrong configuration** by testing a fresh token. Never fix it by turning validations off.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Order of verification",
        passos: [
          {
            titulo: "1. Reproduce and read the response",
            texto:
              'Call the API with the same token and read the status and the `WWW-Authenticate` header (RFC 6750): `error="invalid_token"` with 401 is a problem with the token (or the validation); `insufficient_scope` comes with 403 and is a lack of permission, not of authentication. Open the API’s validation log, which should record the **internal reason** (signature, `aud`, `exp`...) even if the client only gets a generic reply. Also confirm that the `Authorization: Bearer ...` header arrives whole: a proxy that strips it, a truncated token, a CORS preflight (`OPTIONS`) without the header.',
          },
          {
            titulo: "2. Decode the token without trusting it",
            texto:
              "Split the three parts and decode header and payload from base64url, **locally**. It is read-only: nothing in there has been verified. Look at `alg`, `kid`, `iss`, `aud`, `exp`, `nbf`, `iat`, `sub` and the scopes. If it does not decode, it is an opaque token: use introspection (see Q35 and Q74). If the `aud` is the client application’s ID, you probably sent the **ID token** instead of the access token.",
          },
          {
            titulo: "3. Compare `iss` and `aud` with the API’s configuration",
            texto:
              "Both must be **identical**, character for character, to what is configured: trailing slash, `https`, tenant or realm, endpoint version (some platforms issue a different `iss` per version) and environment (staging or production). The `aud` must be this API’s identifier, not another one’s.",
          },
          {
            titulo: "4. Check the clock",
            texto:
              "Compare `exp`, `nbf` and `iat` (seconds since 1970, in UTC) with the API server’s time. A server that runs fast or slow rejects a freshly issued token (`nbf` in the future) or accepts an expired one. Synchronize through NTP and use a short tolerance, in seconds: raising it to minutes or hours hides the problem and widens the window for using a stolen token.",
          },
          {
            titulo: "5. Check key and algorithm",
            texto:
              "The header’s `kid` must exist in the JWKS the API has cached. Right after a rotation, a stale cache does not know the new key: fetch the `jwks_uri` (see Q45) and compare; the cache should refresh when it sees an unknown `kid`, with a rate limit (see Q73). Check that the API can reach the `jwks_uri` (firewall, proxy, DNS). The `alg` must be in the list **fixed in the API**, never read from the token (see Q132).",
          },
          {
            titulo: "6. Check scopes and roles",
            texto:
              "See whether the token carries the scopes or roles the route requires, and in which claim (`scope`, `scp`, `roles`): the name varies by IdP and the API may be reading the wrong one. A user token and an application token (client credentials) carry different things. A lack of permission should return 403, not 401.",
          },
          {
            titulo: "7. Separate the wrong token from the wrong configuration",
            texto:
              "Get a fresh token from the same IdP, for the same API and the same scopes, and call again. If it passes, the previous token was wrong (expired, from another environment, wrong audience). If it fails the same way, the API’s configuration is wrong (authority, audience, algorithm, JWKS, network). Also test the same token on another instance or environment to find the divergence.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Symptom → likely cause",
        colunas: ["Symptom", "Likely cause", "How to confirm"],
        linhas: [
          [
            "Works in staging and fails in production",
            "`iss`, `aud` or JWKS from another environment",
            "Compare the token’s `iss` with the configured authority and the `aud` with the API identifier",
          ],
          [
            "Fails right after the IdP rotates keys",
            "`kid` missing from the cached JWKS",
            "Fetch the JWKS and look for the `kid`; check when the cache was last refreshed",
          ],
          [
            "Fails only on some requests or instances",
            "Clock out of sync on one instance, or a different JWKS cache per replica",
            "Compare each instance’s time and the validation logs per instance",
          ],
          [
            "The browser fails but curl works",
            "Preflight `OPTIONS` without `Authorization`, or a header stripped by a proxy",
            "See which method failed in the Network tab and what reached the API",
          ],
          [
            "A freshly issued token rejected with `nbf` or `iat` in the future",
            "Issuer’s clock ahead of the API’s",
            "Decode the token and compare with the API server’s current time",
          ],
          [
            "401 for a missing scope, or 403 `insufficient_scope`",
            "The scope claim has a different name or format than the API expects",
            "Compare the token’s claims with the route’s policy",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Validate and say which check failed",
        legenda: "TypeScript",
        codigo: `import { createRemoteJWKSet, decodeJwt, decodeProtectedHeader, errors, jwtVerify } from "jose";
const jwks = createRemoteJWKSet(new URL("https://idp.example.com/.well-known/jwks.json"));

export async function diagnose(token: string) {
  console.log(decodeProtectedHeader(token), decodeJwt(token)); // look only: decoding is not validating
  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: "https://idp.example.com/",
      audience: "https://api.example.com",
      algorithms: ["RS256"], // fixed in the API, never read from the token
      clockTolerance: 30, // seconds
    });
    return "ok, scopes: " + payload.scope;
  } catch (e) {
    if (e instanceof errors.JWTExpired) return "exp: old token or clock";
    if (e instanceof errors.JWTClaimValidationFailed) return e.claim + ": " + e.reason;
    if (e instanceof errors.JWKSNoMatchingKey) return "kid not in the JWKS";
    if (e instanceof errors.JWSSignatureVerificationFailed) return "invalid signature";
    throw e;
  }
}`,
        nota: "The `jose` library fetches the JWKS again when it sees an unknown `kid`, with a minimum interval between fetches (check the documentation). In production, write the reason to the internal log and return only a generic 401 to the client.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Do not fix it by switching validation off",
        texto:
          "Ignoring `iss` or `aud`, turning off the expiry check, accepting any `alg` or raising the clock tolerance to hours makes the 401 disappear and opens the API to tokens from other issuers, other APIs and expired tokens. And do not paste production tokens into third-party sites: decode them locally.",
      },
    ],
    armadilhas: [
      "Turning off `iss`, `aud` or expiry validation (or accepting any `alg`) “to see if it passes” and forgetting it on.",
      "Sending the ID token to the API instead of the access token: the ID token’s `aud` is the client, not the API.",
      "A JWKS cache that is never refreshed after a rotation, or the opposite: fetching the JWKS on every request.",
      "Raising the clock tolerance to hours instead of fixing NTP, or pasting real tokens into third-party decoding sites.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference in meaning between 401 and 403 on an API with tokens?",
        resposta:
          "A 401 says authentication failed (missing, invalid or expired token, wrong signature or audience); a 403 says the token is valid but does not authorize that action (for example, `insufficient_scope`). Investigating one or the other leads to different places.",
      },
      {
        pergunta: "New tokens start failing right after the IdP rotates its keys. What do you check?",
        resposta:
          "Whether the token’s `kid` exists in the JWKS the API has cached. A stale cache does not know the new key; the API should fetch the JWKS again when it sees an unknown `kid`, with a rate limit, and respect the cache lifetime the IdP indicates.",
      },
    ],
  },
};
