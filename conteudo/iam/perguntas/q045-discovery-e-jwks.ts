import type { Pergunta } from "../../tipos";

// Q45 · Discovery e JWKS
export const q045: Pergunta = {
  numero: 45,
  modulo: "oidc",
  metodo: "feynman",
  pt: {
    titulo: "Discovery e JWKS",
    pergunta:
      "Para que servem o documento de descoberta (.well-known/openid-configuration) e o endpoint JWKS no OpenID Connect? Como um cliente ou uma API os usa?",
    porqueEsteMetodo:
      "Discovery e JWKS são duas ideias simples escondidas atrás de siglas. Uma analogia concreta dá o modelo mental, e o fluxo mostra o que a biblioteca faz de fato quando você informa só o `issuer`.",
    resposta30s:
      "O **documento de descoberta** é um JSON publicado pelo emissor (`issuer`) em `/.well-known/openid-configuration`, com os **endpoints, os recursos suportados e o `jwks_uri`**; por ele, o cliente é configurado só com o `issuer`. O **JWKS** é o conjunto de **chaves públicas** do emissor: o cliente ou a API lê o `kid` do cabeçalho do token, busca a chave correspondente, a mantém em **cache** e verifica a assinatura. Com isso a **rotação de chaves** não exige redeploy, desde que você confira o `issuer` do documento e rejeite o que não puder ser verificado.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense numa lista telefônica oficial de uma instituição, que você acha pelo nome dela. Nela estão os endereços de cada setor (onde se pede acesso, onde se retira o documento, onde se consulta o cadastro) e, na última página, as amostras de assinatura das pessoas autorizadas a assinar em nome da instituição. Você só precisa saber o nome da instituição: o resto você lê na lista, e cada carta recebida é conferida contra as amostras.",
        tecnico:
          "O nome da instituição é o **`issuer`**, uma URL HTTPS. Acrescentando `/.well-known/openid-configuration` a ela, o cliente baixa o **documento de descoberta**, um JSON que lista os endpoints (`authorization_endpoint`, `token_endpoint`, `userinfo_endpoint`), os recursos suportados (escopos, algoritmos de assinatura, PKCE) e o `jwks_uri`. Este aponta para o **JWKS**, o conjunto de chaves públicas do emissor (formato JWK, RFC 7517): um objeto com a lista `keys`, em que cada chave traz `kty`, `kid`, `use`, `alg` e os parâmetros públicos (`n` e `e` no RSA). O cabeçalho do JWT informa o `kid`, e a chave de mesmo `kid` verifica a assinatura. O resultado é **configuração zero** (só o `issuer`) e **rotação de chaves** sem redeploy: o IdP publica a chave nova no JWKS antes de assinar com ela e mantém a antiga até os tokens que ela assinou expirarem.",
        limite:
          "A analogia falha em dois pontos. A lista **não prova nada sobre si mesma**: a confiança vem de você ter obtido o `issuer` de um lugar confiável (a sua configuração) e de baixar o documento por HTTPS, e por isso o `issuer` escrito no documento precisa ser idêntico ao que você usou para buscá-lo. E as chaves **mudam**: uma lista guardada semana passada pode estar velha, então o cache precisa de prazo e de uma nova busca quando aparecer um `kid` desconhecido.",
      },
      {
        tipo: "fluxo",
        titulo: "Do issuer à verificação de um token",
        etapas: [
          "Você configura só o `issuer` (algumas bibliotecas o chamam de `authority`), por exemplo `https://id.example.com`, e ele vem da sua configuração, nunca de um token",
          "A biblioteca faz um `GET` em `<issuer>/.well-known/openid-configuration` por HTTPS e guarda a resposta em cache",
          "Ela confere que o campo `issuer` do documento é idêntico ao `issuer` configurado; se for diferente, rejeita o documento",
          "Os endpoints do documento (`authorization_endpoint`, `token_endpoint`…) passam a ser usados no login, sem nenhuma URL fixa no código",
          "Chega um JWT: a biblioteca lê o cabeçalho (`alg`, `kid`), mas só aceita o algoritmo que você fixou",
          "Ela busca no JWKS (`jwks_uri`, em cache) a chave com aquele `kid` e verifica a assinatura; depois valida `iss`, `aud` e `exp` (veja Q48)",
          "Se o `kid` é desconhecido, rebusca o JWKS uma vez, com intervalo mínimo entre buscas; se ainda não achar a chave, rejeita o token",
        ],
        nota: "Para tokens de acesso emitidos por esse mesmo IdP o roteiro é o mesmo; muda o que se valida nas claims.",
      },
      {
        tipo: "codigo",
        titulo: "Documento de descoberta (trecho)",
        legenda: "JSON",
        codigo:
          '{\n  "issuer": "https://id.example.com",\n  "authorization_endpoint": "https://id.example.com/authorize",\n  "token_endpoint": "https://id.example.com/token",\n  "userinfo_endpoint": "https://id.example.com/userinfo",\n  "jwks_uri": "https://id.example.com/jwks.json",\n  "end_session_endpoint": "https://id.example.com/logout",\n  "scopes_supported": ["openid", "profile", "email"],\n  "id_token_signing_alg_values_supported": ["RS256", "ES256"],\n  "code_challenge_methods_supported": ["S256"]\n}',
        nota: "Cada IdP publica o seu conjunto de campos; a lista completa está na especificação OpenID Connect Discovery.",
      },
      {
        tipo: "codigo",
        titulo: "Descobrir o JWKS e verificar um token",
        legenda: "TypeScript",
        codigo:
          'import { createRemoteJWKSet, jwtVerify } from "jose";\n\nconst issuer = "https://id.example.com"; // vem da configuração, não do token\n\nexport async function criarVerificador() {\n  const resposta = await fetch(issuer + "/.well-known/openid-configuration");\n  const config = await resposta.json();\n  if (config.issuer !== issuer) throw new Error("issuer do documento difere do configurado");\n\n  // Cache de chaves, com rebusca limitada quando aparece um kid desconhecido\n  const jwks = createRemoteJWKSet(new URL(config.jwks_uri), {\n    cooldownDuration: 30_000,\n    cacheMaxAge: 600_000,\n  });\n\n  return async (token: string) => {\n    const opcoes = { issuer, audience: "minha-api", algorithms: ["RS256"] };\n    const { payload } = await jwtVerify(token, jwks, opcoes);\n    return payload;\n  };\n}',
        nota: "As opções de cache (`cooldownDuration`, `cacheMaxAge`) são da biblioteca `jose`; confira os nomes e os padrões na documentação da sua versão.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Quando o JWKS fica indisponível",
        texto:
          "Com as chaves em cache, os tokens de `kid` já conhecido continuam sendo validados. O problema aparece na **rotação**: um token com `kid` novo não pode ser verificado enquanto o JWKS não responde, e a resposta certa é **rejeitá-lo** (falhar fechado), nunca aceitá-lo sem verificar. Defina um prazo de cache, um timeout na busca, se vale reaproveitar a cópia vencida por um tempo limitado quando a busca falha, e um alerta para quando isso acontecer. E limite as rebuscas: quem envia tokens com `kid` aleatório pode transformar a sua API num gerador de tráfego contra o IdP.",
      },
    ],
    armadilhas: [
      "Obedecer ao cabeçalho do token: `jku`, `x5u` ou uma chave embutida em `jwk` deixam o atacante apontar para a chave dele. As chaves vêm apenas do `jwks_uri` do emissor que você configurou.",
      "Buscar o JWKS a cada requisição (lento e frágil) ou nunca atualizá-lo (a primeira rotação de chaves derruba todos os logins).",
      "Pular a conferência do `issuer` do documento ou aceitar `http://`: o documento não é assinado, e é o HTTPS mais o `issuer` configurado que sustentam a confiança nele.",
      "Rebuscar o JWKS a cada `kid` desconhecido sem intervalo mínimo, o que abre caminho para negação de serviço contra o IdP e contra a sua própria API.",
    ],
    autoteste: [
      {
        pergunta: "Por que o cliente compara o `issuer` do documento com o que ele mesmo usou para buscá-lo?",
        resposta:
          "Porque o documento não é assinado. Se um servidor entregasse um documento com outro `issuer`, os endpoints e o `jwks_uri` poderiam ser de outro emissor. A comparação, somada ao HTTPS, garante que o documento descreve o emissor que você configurou.",
      },
      {
        pergunta: "Um token chega com um `kid` que não está no cache. O que acontece?",
        resposta:
          "A biblioteca rebusca o JWKS uma vez, respeitando um intervalo mínimo entre buscas. Se a chave aparece (rotação), a validação segue normalmente; se não, o token é rejeitado. Nunca se tenta outra chave ao acaso nem se aceita sem verificar.",
      },
    ],
  },
  en: {
    titulo: "Discovery and JWKS",
    pergunta:
      "What are the discovery document (.well-known/openid-configuration) and the JWKS endpoint for in OpenID Connect? How do a client or an API use them?",
    porqueEsteMetodo:
      "Discovery and JWKS are two simple ideas hidden behind acronyms. A concrete analogy gives the mental model, and the flow shows what the library actually does when you hand it only the `issuer`.",
    resposta30s:
      "The **discovery document** is a JSON published by the issuer (`issuer`) at `/.well-known/openid-configuration`, listing the **endpoints, the supported features and the `jwks_uri`**; with it, a client needs only the `issuer` to be configured. The **JWKS** is the issuer’s set of **public keys**: the client or API reads the `kid` from the token header, fetches the matching key, keeps it in a **cache** and verifies the signature. **Key rotation** then no longer requires a redeploy, as long as you check the document’s `issuer` and reject anything you cannot verify.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of an institution’s official phone directory, which you find by the institution’s name. It lists the address of each department (where to ask for access, where to collect the document, where to look up the records) and, on the last page, the sample signatures of the people allowed to sign on the institution’s behalf. All you need to know is the institution’s name: you read the rest in the directory, and every letter you receive is checked against the samples.",
        tecnico:
          "The institution’s name is the **`issuer`**, an HTTPS URL. Append `/.well-known/openid-configuration` to it and the client downloads the **discovery document**, a JSON that lists the endpoints (`authorization_endpoint`, `token_endpoint`, `userinfo_endpoint`), the supported features (scopes, signing algorithms, PKCE) and the `jwks_uri`. That one points to the **JWKS**, the issuer’s set of public keys (JWK format, RFC 7517): an object with a `keys` list, where each key carries `kty`, `kid`, `use`, `alg` and the public parameters (`n` and `e` for RSA). The JWT header names the `kid`, and the key with the same `kid` verifies the signature. The result is **zero configuration** (just the `issuer`) and **key rotation** without a redeploy: the IdP publishes the new key in the JWKS before signing with it and keeps the old one until the tokens it signed have expired.",
        limite:
          "The analogy breaks in two places. The directory **proves nothing about itself**: trust comes from having obtained the `issuer` from a trustworthy place (your configuration) and downloading the document over HTTPS, which is why the `issuer` written in the document must be identical to the one you used to fetch it. And keys **change**: a directory saved last week may be stale, so the cache needs a lifetime and a fresh fetch when an unknown `kid` shows up.",
      },
      {
        tipo: "fluxo",
        titulo: "From the issuer to verifying a token",
        etapas: [
          "You configure only the `issuer` (some libraries call it `authority`), for example `https://id.example.com`, and it comes from your configuration, never from a token",
          "The library sends a `GET` to `<issuer>/.well-known/openid-configuration` over HTTPS and caches the response",
          "It checks that the document’s `issuer` field is identical to the configured `issuer`; if it differs, it rejects the document",
          "The document’s endpoints (`authorization_endpoint`, `token_endpoint`…) are used for the login, with no hard-coded URL in the code",
          "A JWT arrives: the library reads the header (`alg`, `kid`) but accepts only the algorithm you fixed",
          "It looks up the key with that `kid` in the JWKS (`jwks_uri`, cached) and verifies the signature; then it validates `iss`, `aud` and `exp` (see Q48)",
          "If the `kid` is unknown, it refetches the JWKS once, with a minimum interval between fetches; if it still cannot find the key, it rejects the token",
        ],
        nota: "For access tokens issued by the same IdP the routine is the same; what changes is what you validate in the claims.",
      },
      {
        tipo: "codigo",
        titulo: "Discovery document (excerpt)",
        legenda: "JSON",
        codigo:
          '{\n  "issuer": "https://id.example.com",\n  "authorization_endpoint": "https://id.example.com/authorize",\n  "token_endpoint": "https://id.example.com/token",\n  "userinfo_endpoint": "https://id.example.com/userinfo",\n  "jwks_uri": "https://id.example.com/jwks.json",\n  "end_session_endpoint": "https://id.example.com/logout",\n  "scopes_supported": ["openid", "profile", "email"],\n  "id_token_signing_alg_values_supported": ["RS256", "ES256"],\n  "code_challenge_methods_supported": ["S256"]\n}',
        nota: "Each IdP publishes its own set of fields; the full list is in the OpenID Connect Discovery specification.",
      },
      {
        tipo: "codigo",
        titulo: "Discovering the JWKS and verifying a token",
        legenda: "TypeScript",
        codigo:
          'import { createRemoteJWKSet, jwtVerify } from "jose";\n\nconst issuer = "https://id.example.com"; // comes from configuration, not from the token\n\nexport async function createVerifier() {\n  const response = await fetch(issuer + "/.well-known/openid-configuration");\n  const config = await response.json();\n  if (config.issuer !== issuer) throw new Error("document issuer differs from the configured one");\n\n  // Key cache, with a limited refetch when an unknown kid appears\n  const jwks = createRemoteJWKSet(new URL(config.jwks_uri), {\n    cooldownDuration: 30_000,\n    cacheMaxAge: 600_000,\n  });\n\n  return async (token: string) => {\n    const options = { issuer, audience: "my-api", algorithms: ["RS256"] };\n    const { payload } = await jwtVerify(token, jwks, options);\n    return payload;\n  };\n}',
        nota: "The cache options (`cooldownDuration`, `cacheMaxAge`) belong to the `jose` library; check the names and defaults in the documentation for your version.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "When the JWKS is unavailable",
        texto:
          "With the keys in cache, tokens with an already known `kid` keep being validated. The problem shows up at **rotation**: a token with a new `kid` cannot be verified while the JWKS is not answering, and the right response is to **reject it** (fail closed), never to accept it unverified. Define a cache lifetime, a fetch timeout, whether it is worth reusing the expired copy for a limited time when the fetch fails, and an alert for when that happens. And limit refetches: someone sending tokens with random `kid` values can turn your API into a traffic generator against the IdP.",
      },
    ],
    armadilhas: [
      "Obeying the token header: `jku`, `x5u` or a key embedded in `jwk` let the attacker point to their own key. Keys come only from the `jwks_uri` of the issuer you configured.",
      "Fetching the JWKS on every request (slow and fragile) or never refreshing it (the first key rotation takes every login down).",
      "Skipping the check of the document’s `issuer`, or accepting `http://`: the document is not signed, and it is HTTPS plus the configured `issuer` that support the trust in it.",
      "Refetching the JWKS for every unknown `kid` with no minimum interval, which opens the door to denial of service against the IdP and against your own API.",
    ],
    autoteste: [
      {
        pergunta: "Why does the client compare the document’s `issuer` with the one it used to fetch it?",
        resposta:
          "Because the document is not signed. If a server handed back a document with a different `issuer`, the endpoints and the `jwks_uri` could belong to another issuer. The comparison, together with HTTPS, ensures the document describes the issuer you configured.",
      },
      {
        pergunta: "A token arrives with a `kid` that is not in the cache. What happens?",
        resposta:
          "The library refetches the JWKS once, respecting a minimum interval between fetches. If the key shows up (rotation), validation proceeds normally; if not, the token is rejected. It never tries another key at random and never accepts the token unverified.",
      },
    ],
  },
};
