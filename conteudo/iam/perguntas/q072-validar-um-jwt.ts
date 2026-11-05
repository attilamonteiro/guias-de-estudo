import type { Pergunta } from "../../tipos";

// Q72 · Validar um JWT
export const q072: Pergunta = {
  numero: 72,
  modulo: "tokens-e-sessoes",
  metodo: "playbook",
  pt: {
    titulo: "Validar um JWT",
    pergunta:
      "Que passos uma API deve seguir para validar um JWT recebido? Explique a diferença entre decodificar e verificar e o que cada checagem impede.",
    porqueEsteMetodo:
      "Validar um JWT é uma sequência em que a ordem importa: nenhuma claim pode ser lida como verdade antes de a assinatura ser verificada com uma chave confiável. O playbook dá a ordem e diz o que cada checagem impede.",
    resposta30s:
      "**Decodificar** é ler o JSON sem chave nenhuma; **verificar** é provar a assinatura com uma chave confiável e só depois conferir as claims. Na ordem: **algoritmo fixado pelo servidor**, chave pelo `kid` no JWKS **do emissor que você configurou**, **assinatura**, `iss`, `aud`, `exp` e `nbf` (com pouca tolerância de relógio) e, por fim, escopos e papéis. Use a biblioteca do seu framework e escreva testes negativos.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: validar um JWT recebido",
        passos: [
          {
            titulo: "1. Triagem barata",
            texto:
              "Extraia o token do cabeçalho `Authorization: Bearer`, limite o tamanho e confirme os três segmentos. Se a API só aceita access tokens, confira o tipo esperado (`typ`) quando o seu emissor o define. Impede: processar lixo e aceitar um tipo de token no lugar de outro (um ID token no lugar de um access token).",
          },
          {
            titulo: "2. Fixe o algoritmo no servidor",
            texto:
              "Use uma lista permitida (por exemplo, só `RS256`) e ignore o que o header pedir. Rejeite `none`. Impede: token sem assinatura aceito e **confusão de algoritmo** (trocar `RS256` por `HS256` e assinar com a chave pública).",
          },
          {
            titulo: "3. Escolha a chave pelo `kid`, no JWKS confiável",
            texto:
              "Procure o `kid` do header entre as chaves do emissor que você configurou (pelo `jwks_uri` do discovery, veja Q45). Nunca busque chave em `jku`, `x5u` ou `jwk` vindos do token (veja Q133). Com `kid` desconhecido, recarregue o JWKS uma vez, com limite (veja Q73). Impede: o atacante apresentar a própria chave.",
          },
          {
            titulo: "4. Verifique a assinatura",
            texto:
              "Com a chave e o algoritmo dos passos anteriores. Falhou: 401, sem mais nada. Até aqui, nada do payload merece confiança. Impede: token forjado ou alterado.",
          },
          {
            titulo: "5. Confira `iss` e `aud`",
            texto:
              "`iss` igual ao emissor esperado, em texto exato (em multi-tenant, o emissor do tenant, veja Q53). `aud` contém o identificador **desta** API. Impede: token bem assinado por outro emissor, e token emitido para outra API sendo usado nesta (substituição de token).",
          },
          {
            titulo: "6. Confira o tempo",
            texto:
              "`exp` no futuro, `nbf` no passado, exigindo que `exp` exista. Use tolerância de relógio pequena (segundos) para compensar a diferença entre servidores: uma tolerância grande estende a vida de tokens vencidos. Impede: reutilização de token velho e uso antes da hora.",
          },
          {
            titulo: "7. Autorize",
            texto:
              "Só agora leia `scope`, papéis e `sub` e decida se esta ação neste recurso é permitida (veja Q115 e Q76). Se a revogação imediata importa, consulte a introspecção ou uma lista de `jti` revogados (veja Q77). Impede: um token válido executando o que não deveria.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Verificação com jose",
        legenda: "TypeScript",
        codigo: `import { createRemoteJWKSet, jwtVerify } from "jose";

// Só o JWKS do emissor configurado; a biblioteca faz cache e recarrega com limite
const jwks = createRemoteJWKSet(new URL("https://id.exemplo.com/.well-known/jwks.json"));

export async function validar(token: string) {
  const { payload } = await jwtVerify(token, jwks, {
    algorithms: ["RS256"], // fixado pelo servidor, nunca pelo header
    issuer: "https://id.exemplo.com", // iss exato
    audience: "api://pedidos", // aud contém esta API
    clockTolerance: 30, // segundos de tolerância de relógio
    requiredClaims: ["exp", "sub"], // sem exp, o token não vale
  });

  const escopos = String(payload.scope ?? "").split(" ");
  if (!escopos.includes("pedidos:ler")) throw new Error("403: escopo insuficiente");
  return payload;
}`,
        nota: "Confira os nomes das opções na documentação da sua versão da `jose`. Os valores (emissor, audiência, algoritmo) vêm da configuração da API, nunca do token.",
      },
      {
        tipo: "codigo",
        titulo: "O mesmo em ASP.NET Core",
        legenda: "C#",
        codigo: `builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.Authority = "https://id.exemplo.com"; // descobre o JWKS pelo metadata do emissor
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = "https://id.exemplo.com",
            ValidAudience = "api://pedidos",
            ValidAlgorithms = new[] { "RS256" }, // lista fixada no servidor
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            RequireExpirationTime = true,
            RequireSignedTokens = true,
            ClockSkew = TimeSpan.FromSeconds(30), // o padrão é bem maior
        };
    });`,
        nota: "A autorização por escopo ou papel vem depois, nas políticas (`[Authorize]`). Confira os padrões de cada opção na documentação do ASP.NET Core.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decodificar × verificar",
        texto:
          "**Decodificar** é base64url e JSON: não usa chave e não prova nada, e qualquer pessoa fabrica um token que decodifica bem. **Verificar** é a assinatura com uma chave confiável e algoritmo fixado, mais as regras das claims (`iss`, `aud`, `exp`, `nbf`). Só o que passou na verificação é dado; o resto é afirmação do portador. Por isso `decodeJwt` e `jwt.decode` servem para depurar e para ler o `kid`, nunca para decidir acesso. Prefira a biblioteca ou o middleware do framework, que já seguem a ordem acima, e nunca escreva a verificação de assinatura à mão.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Erros típicos e testes negativos",
        texto:
          "Os erros mais comuns: decodificar sem verificar, aceitar `none`, deixar o `alg` do header escolher o método, não conferir `aud` (qualquer token do emissor passa em qualquer API) e aceitar token sem `exp`. Escreva testes que **devem falhar**: assinatura alterada, `alg: none`, `HS256` assinado com a chave pública, `iss` ou `aud` de outro, token expirado, ainda não válido, sem `exp` e com `kid` desconhecido. A RFC 8725 (JWT Best Current Practices) reúne essas recomendações, e o IETF trabalha em uma atualização dela; confira o texto vigente antes de citar números de seção.",
      },
    ],
    armadilhas: [
      "Usar uma função de decodificar e confiar no resultado: sem verificação, o payload é só uma afirmação do portador.",
      "Não validar `aud`: qualquer token legítimo do mesmo emissor, emitido para outra API, passa a ser aceito (substituição de token).",
      "Tolerância de relógio enorme “para parar o erro”: ela estende a vida de tokens vencidos; corrija a sincronização dos relógios (NTP) em vez disso.",
      "Deixar o JWKS ser configurável pelo token (`jku`, `x5u`, `jwk`), ou desligar a validação de emissor e audiência em teste e esquecer de religar.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre decodificar e verificar um JWT?",
        resposta:
          "Decodificar lê o header e o payload sem chave e não prova nada. Verificar confere a assinatura com uma chave confiável e um algoritmo fixado pelo servidor e depois as claims (`iss`, `aud`, `exp`, `nbf`).",
      },
      {
        pergunta: "O que a checagem de `aud` impede?",
        resposta:
          "Que um token emitido para outra API, mas assinado pelo mesmo emissor, seja aceito nesta. Sem ela, uma assinatura válida não diz que o token foi feito para você.",
      },
    ],
  },
  en: {
    titulo: "Validating a JWT",
    pergunta:
      "What steps must an API follow to validate an incoming JWT? Explain the difference between decoding and verifying, and what each check prevents.",
    porqueEsteMetodo:
      "Validating a JWT is a sequence in which order matters: no claim may be read as true before the signature is verified with a trusted key. The playbook gives the order and says what each check prevents.",
    resposta30s:
      "**Decoding** is reading the JSON with no key at all; **verifying** is proving the signature with a trusted key and only then checking the claims. In order: **algorithm fixed by the server**, key by `kid` from the JWKS **of the issuer you configured**, **signature**, `iss`, `aud`, `exp` and `nbf` (with little clock tolerance) and, last, scopes and roles. Use your framework’s library and write negative tests.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: validate an incoming JWT",
        passos: [
          {
            titulo: "1. Cheap triage",
            texto:
              "Extract the token from the `Authorization: Bearer` header, limit its size and confirm the three segments. If the API accepts only access tokens, check the expected type (`typ`) when your issuer defines one. Prevents: processing garbage and accepting one type of token in place of another (an ID token instead of an access token).",
          },
          {
            titulo: "2. Fix the algorithm on the server",
            texto:
              "Use an allowlist (for example, only `RS256`) and ignore whatever the header asks for. Reject `none`. Prevents: an unsigned token being accepted and **algorithm confusion** (swapping `RS256` for `HS256` and signing with the public key).",
          },
          {
            titulo: "3. Pick the key by `kid`, from the trusted JWKS",
            texto:
              "Look up the header’s `kid` among the keys of the issuer you configured (through the discovery document’s `jwks_uri`, see Q45). Never fetch a key from `jku`, `x5u` or `jwk` coming from the token (see Q133). With an unknown `kid`, reload the JWKS once, with a limit (see Q73). Prevents: the attacker presenting their own key.",
          },
          {
            titulo: "4. Verify the signature",
            texto:
              "With the key and algorithm from the previous steps. If it fails: 401, nothing more. Until here, nothing in the payload deserves trust. Prevents: a forged or altered token.",
          },
          {
            titulo: "5. Check `iss` and `aud`",
            texto:
              "`iss` equal to the expected issuer, exact text (in multi-tenant, the tenant’s issuer, see Q53). `aud` contains **this** API’s identifier. Prevents: a token well signed by another issuer, and a token issued for another API being used on this one (token substitution).",
          },
          {
            titulo: "6. Check the time",
            texto:
              "`exp` in the future, `nbf` in the past, requiring `exp` to exist. Use a small clock tolerance (seconds) to absorb differences between servers: a large tolerance extends the life of expired tokens. Prevents: reuse of an old token and use before its time.",
          },
          {
            titulo: "7. Authorize",
            texto:
              "Only now read `scope`, roles and `sub` and decide whether this action on this resource is allowed (see Q115 and Q76). If immediate revocation matters, consult introspection or a list of revoked `jti` values (see Q77). Prevents: a valid token doing what it should not.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Verification with jose",
        legenda: "TypeScript",
        codigo: `import { createRemoteJWKSet, jwtVerify } from "jose";

// Only the configured issuer's JWKS; the library caches and reloads with a limit
const jwks = createRemoteJWKSet(new URL("https://id.example.com/.well-known/jwks.json"));

export async function validate(token: string) {
  const { payload } = await jwtVerify(token, jwks, {
    algorithms: ["RS256"], // fixed by the server, never by the header
    issuer: "https://id.example.com", // exact iss
    audience: "api://orders", // aud contains this API
    clockTolerance: 30, // seconds of clock tolerance
    requiredClaims: ["exp", "sub"], // without exp, the token is not valid
  });

  const scopes = String(payload.scope ?? "").split(" ");
  if (!scopes.includes("orders:read")) throw new Error("403: insufficient scope");
  return payload;
}`,
        nota: "Check the option names in the documentation for your version of `jose`. The values (issuer, audience, algorithm) come from the API’s configuration, never from the token.",
      },
      {
        tipo: "codigo",
        titulo: "The same in ASP.NET Core",
        legenda: "C#",
        codigo: `builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.Authority = "https://id.example.com"; // discovers the JWKS from the issuer's metadata
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = "https://id.example.com",
            ValidAudience = "api://orders",
            ValidAlgorithms = new[] { "RS256" }, // list fixed on the server
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            RequireExpirationTime = true,
            RequireSignedTokens = true,
            ClockSkew = TimeSpan.FromSeconds(30), // the default is much larger
        };
    });`,
        nota: "Authorization by scope or role comes afterwards, in policies (`[Authorize]`). Check the defaults of each option in the ASP.NET Core documentation.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decoding vs verifying",
        texto:
          "**Decoding** is base64url and JSON: it uses no key and proves nothing, and anyone can fabricate a token that decodes fine. **Verifying** is the signature with a trusted key and a fixed algorithm, plus the claim rules (`iss`, `aud`, `exp`, `nbf`). Only what passed verification is data; the rest is the bearer’s claim. That is why `decodeJwt` and `jwt.decode` are for debugging and for reading the `kid`, never for deciding access. Prefer the framework’s library or middleware, which already follow the order above, and never write signature verification by hand.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Typical mistakes and negative tests",
        texto:
          "The most common mistakes: decoding without verifying, accepting `none`, letting the header’s `alg` choose the method, not checking `aud` (any token from the issuer passes on any API) and accepting a token without `exp`. Write tests that **must fail**: altered signature, `alg: none`, `HS256` signed with the public key, another `iss` or `aud`, an expired token, one not yet valid, one without `exp` and one with an unknown `kid`. RFC 8725 (JWT Best Current Practices) gathers these recommendations, and the IETF is working on an update to it; check the current text before citing section numbers.",
      },
    ],
    armadilhas: [
      "Using a decode function and trusting the result: without verification, the payload is just the bearer’s claim.",
      "Not validating `aud`: any legitimate token from the same issuer, issued for another API, becomes accepted (token substitution).",
      "A huge clock tolerance “to make the error go away”: it extends the life of expired tokens; fix clock synchronization (NTP) instead.",
      "Letting the token configure the JWKS (`jku`, `x5u`, `jwk`), or turning off issuer and audience validation in testing and forgetting to turn it back on.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between decoding and verifying a JWT?",
        resposta:
          "Decoding reads the header and payload with no key and proves nothing. Verifying checks the signature with a trusted key and an algorithm fixed by the server, and then the claims (`iss`, `aud`, `exp`, `nbf`).",
      },
      {
        pergunta: "What does the `aud` check prevent?",
        resposta:
          "A token issued for another API, but signed by the same issuer, being accepted on this one. Without it, a valid signature does not say the token was made for you.",
      },
    ],
  },
};
