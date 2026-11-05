import type { Pergunta } from "../../tipos";

// Q133 · JWT: kid, jku e x5u
export const q133: Pergunta = {
  numero: 133,
  modulo: "ataques-e-depuracao",
  metodo: "threat",
  pt: {
    titulo: "JWT: kid, jku e x5u",
    pergunta:
      "Como headers como kid, jku, x5u e jwk podem ser abusados em ataques a JWT (injeção, SSRF, chave do atacante)? Como se defender?",
    porqueEsteMetodo:
      "Cada campo do header que escolhe ou aponta uma chave é uma porta diferente. Os pares percorrem as portas uma a uma, com a defesa de cada, e a regra final une todas.",
    resposta30s:
      "O header do JWT é controlado pelo atacante, e alguns campos **escolhem a chave que vai verificar o token**: `jwk` embute a chave do invasor, `jku` e `x5u` apontam para o servidor dele (e ainda provocam **SSRF**), e `kid` pode virar caminho de arquivo ou **injeção de SQL**. A defesa é inverter o controle: **a chave vem de uma fonte que você controla** (o JWKS do emissor esperado), os campos que carregam ou apontam chaves são ignorados, e o `kid` é só um índice sanitizado.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ataque → defesa",
        rotuloOrigem: "Ataque",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "**`jwk` no header**: o invasor gera um par de chaves, embute a pública no header e assina com a privada. O verificador usa “a chave que veio no token” e a assinatura confere.",
            destino:
              "Nunca usar o `jwk` do header como chave de verificação. As chaves vêm só de armazenamento confiável: o JWKS do emissor configurado.",
          },
          {
            origem:
              "**`jku` e `x5u`**: apontam para um JWKS ou certificado hospedado pelo invasor. O verificador baixa o conteúdo e confia nele.",
            destino:
              "**Ignorar `jku` e `x5u`**. Se um caso real exigir, aceitar só uma URL exata, fixa e vinda da configuração por emissor, com HTTPS e sem seguir redirecionamentos para outro host.",
          },
          {
            origem:
              "**SSRF**: mesmo sem aceitar a chave, o servidor busca a URL do token. O invasor aponta para serviços internos ou para o endereço de metadados da nuvem (`http://169.254.169.254/`) e usa o servidor como ponte.",
            destino:
              "Não buscar nenhuma URL tirada do token. A busca do JWKS sai só para a URL configurada, com tempo limite, tamanho máximo e cache, e a rede de saída do serviço fica restrita ao necessário.",
          },
          {
            origem:
              "**`x5c`**: o token traz a cadeia de certificados embutida, com um certificado autoassinado do invasor, “validada” contra a raiz que veio junto.",
            destino:
              "Ignorar o `x5c` do token. Comparar com o certificado ou a chave cadastrados para o emissor, ancorados em uma raiz que você configurou.",
          },
          {
            origem:
              "**`kid` como caminho**: `../../../../dev/null` faz a aplicação ler um arquivo como chave. O arquivo vazio vira a “chave” HMAC, conhecida do invasor, que assina com ela.",
            destino:
              "O `kid` é só **chave de busca** num mapa de chaves já carregadas (`chaves.get(kid)`), com formato validado (caracteres e tamanho permitidos). Nunca entra em caminho de arquivo, comando ou texto SQL.",
          },
          {
            origem:
              "**`kid` com SQL**: `x' UNION SELECT 'segredo'--` numa consulta montada por concatenação devolve uma chave escolhida pelo invasor, que assina com ela.",
            destino:
              "Consulta parametrizada e, melhor, nenhum banco no caminho: o JWKS fica em memória. A chave encontrada ainda precisa ter o tipo e o algoritmo esperados (veja Q132).",
          },
          {
            origem:
              "**`kid` desconhecido em volume**: cada token com `kid` novo faz o serviço buscar o JWKS de novo, o que sobrecarrega o provedor e o próprio serviço.",
            destino:
              "Cache do JWKS com um intervalo mínimo entre atualizações: uma releitura limitada por `kid` desconhecido e, depois, recusa. Bibliotecas como a `jose` já oferecem esse intervalo; veja Q73.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Campos do header que escolhem a chave",
        legenda: "JWT",
        codigo: `// Cada ataque usa UM destes campos para escolher a chave:
{ "alg": "RS256", "jku": "https://evil.example/jwks.json" }
{ "alg": "RS256", "x5u": "https://evil.example/cert.pem" }
{ "alg": "RS256", "jwk": { "kty": "RSA", "n": "<chave do invasor>", "e": "AQAB" } }
{ "alg": "HS256", "kid": "../../../../dev/null" }
{ "alg": "HS256", "kid": "x' UNION SELECT 'segredo'--" }`,
        nota: "Todos os valores aqui foram escolhidos pelo atacante. A assinatura confere em todos os casos, porque ele a produziu com a chave que ele mesmo indicou.",
      },
      {
        tipo: "codigo",
        titulo: "A chave vem da configuração, não do token",
        legenda: "TypeScript",
        codigo: `import { createRemoteJWKSet, jwtVerify } from "jose";

// A URL do JWKS vem da configuração do emissor, nunca do token
const jwks = createRemoteJWKSet(new URL(config.jwksUri));

export function validar(token: string) {
  // jku, x5u, jwk e x5c do header não são usados: a chave vem do jwks acima,
  // escolhida pelo kid entre as chaves que o emissor esperado publica
  return jwtVerify(token, jwks, {
    issuer: config.issuer,
    audience: config.audience,
    algorithms: ["RS256"],
  });
}`,
        nota: "`config` é hipotético. Confira na documentação da biblioteca como ela trata cada campo do header e atualize-a, porque o comportamento de bibliotecas antigas pode diferir.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Quem escolhe a chave é você",
        texto:
          "O token **descreve** e o servidor **decide**. A chave de verificação sai de uma lista que você controla (o JWKS do emissor esperado, de uma URL da sua configuração) e o `kid` é apenas o índice dentro dela. Todo campo do header que **carrega** ou **aponta para** uma chave (`jwk`, `jku`, `x5u`, `x5c`) é entrada hostil, e o `kid` é entrada não confiável como qualquer outra.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Lista de domínios não basta",
        texto:
          "Validar a URL do `jku` por prefixo, expressão regular ou “termina em meudominio.com” é frágil: `https://idp.example.com.evil.net`, o caractere `@` e redirecionamentos abertos em um domínio permitido contornam esse tipo de checagem. Compare a URL exata com a configurada, ou melhor, ignore o campo.",
      },
    ],
    armadilhas: [
      "Validar o `jku` por `startsWith` ou expressão regular: subdomínios parecidos, `@` e redirecionamentos abertos contornam a checagem.",
      "Usar o `kid` em caminho de arquivo, comando ou SQL concatenado: ele é entrada não confiável como qualquer outra.",
      "Confiar no `x5c` porque a cadeia “confere”: uma cadeia trazida pelo invasor só se valida contra a raiz que ele mesmo incluiu.",
      "Resolver o `kid` só com sanitização e esquecer de fixar algoritmo e tipo de chave (veja Q132): as defesas se somam.",
    ],
    autoteste: [
      {
        pergunta: "Por que `jku` e `jwk` no header são perigosos mesmo quando a assinatura é verificada?",
        resposta:
          "Porque a assinatura é verificada com uma chave que o próprio atacante forneceu, então o token “se autentica” sozinho. A chave precisa vir de uma fonte confiável que o servidor controla.",
      },
      {
        pergunta: "Qual deve ser o papel do `kid` na validação?",
        resposta:
          "Apenas um identificador para escolher, entre chaves já confiáveis (o JWKS do emissor configurado), qual delas verifica o token. É tratado como entrada não confiável (sem caminho, SQL ou shell), e um `kid` desconhecido leva a, no máximo, uma releitura limitada do JWKS e à recusa.",
      },
    ],
  },
  en: {
    titulo: "JWT kid, jku and x5u abuse",
    pergunta:
      "How can headers such as kid, jku, x5u and jwk be abused in JWT attacks (injection, SSRF, attacker-controlled keys)? How do you defend?",
    porqueEsteMetodo:
      "Each header field that chooses or points to a key is a different door. The pairs walk through the doors one by one, with the defense for each, and the final rule ties them together.",
    resposta30s:
      "The JWT header is attacker-controlled, and some fields **choose the key that will verify the token**: `jwk` embeds the attacker’s key, `jku` and `x5u` point to their server (and also cause **SSRF**), and `kid` can turn into a file path or **SQL injection**. The defense is to reverse the control: **the key comes from a source you control** (the expected issuer’s JWKS), the fields that carry or point to keys are ignored, and `kid` is only a sanitized index.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Attack → defense",
        rotuloOrigem: "Attack",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "**`jwk` in the header**: the attacker generates a key pair, embeds the public key in the header and signs with the private one. The verifier uses “the key that came in the token” and the signature checks out.",
            destino:
              "Never use the header `jwk` as the verification key. Keys come only from trusted storage: the configured issuer’s JWKS.",
          },
          {
            origem:
              "**`jku` and `x5u`**: they point to a JWKS or certificate hosted by the attacker. The verifier downloads the content and trusts it.",
            destino:
              "**Ignore `jku` and `x5u`**. If a real case requires them, accept only an exact, fixed URL taken from per-issuer configuration, over HTTPS and without following redirects to another host.",
          },
          {
            origem:
              "**SSRF**: even without accepting the key, the server fetches the URL from the token. The attacker points it at internal services or at the cloud metadata address (`http://169.254.169.254/`) and uses the server as a bridge.",
            destino:
              "Never fetch any URL taken from the token. The JWKS fetch goes only to the configured URL, with a timeout, a maximum size and a cache, and the service’s outbound network is restricted to what it needs.",
          },
          {
            origem:
              "**`x5c`**: the token carries the certificate chain embedded, with a self-signed attacker certificate, “validated” against the root that came along with it.",
            destino:
              "Ignore the token’s `x5c`. Compare with the certificate or key registered for the issuer, anchored in a root that you configured.",
          },
          {
            origem:
              "**`kid` as a path**: `../../../../dev/null` makes the application read a file as the key. The empty file becomes the HMAC “key”, known to the attacker, who signs with it.",
            destino:
              "`kid` is only a **lookup key** into a map of already-loaded keys (`keys.get(kid)`), with a validated format (allowed characters and length). It never enters a file path, a command or SQL text.",
          },
          {
            origem:
              "**`kid` with SQL**: `x' UNION SELECT 'secret'--` in a query built by concatenation returns a key chosen by the attacker, who signs with it.",
            destino:
              "A parameterized query and, better, no database in the path: the JWKS stays in memory. The key found must still have the expected type and algorithm (see Q132).",
          },
          {
            origem:
              "**Unknown `kid` in volume**: each token with a new `kid` makes the service fetch the JWKS again, which overloads the provider and the service itself.",
            destino:
              "A JWKS cache with a minimum interval between refreshes: one limited reload for an unknown `kid` and, after that, rejection. Libraries such as `jose` already offer this interval; see Q73.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Header fields that choose the key",
        legenda: "JWT",
        codigo: `// Each attack uses ONE of these fields to choose the key:
{ "alg": "RS256", "jku": "https://evil.example/jwks.json" }
{ "alg": "RS256", "x5u": "https://evil.example/cert.pem" }
{ "alg": "RS256", "jwk": { "kty": "RSA", "n": "<attacker key>", "e": "AQAB" } }
{ "alg": "HS256", "kid": "../../../../dev/null" }
{ "alg": "HS256", "kid": "x' UNION SELECT 'secret'--" }`,
        nota: "Every value here was chosen by the attacker. The signature checks out in every case, because they produced it with the key they themselves indicated.",
      },
      {
        tipo: "codigo",
        titulo: "The key comes from configuration, not from the token",
        legenda: "TypeScript",
        codigo: `import { createRemoteJWKSet, jwtVerify } from "jose";

// The JWKS URL comes from the issuer’s configuration, never from the token
const jwks = createRemoteJWKSet(new URL(config.jwksUri));

export function validate(token: string) {
  // jku, x5u, jwk and x5c in the header are not used: the key comes from the jwks above,
  // picked by kid among the keys the expected issuer publishes
  return jwtVerify(token, jwks, {
    issuer: config.issuer,
    audience: config.audience,
    algorithms: ["RS256"],
  });
}`,
        nota: "`config` is hypothetical. Check the library documentation for how it treats each header field and keep it updated, because the behavior of old libraries can differ.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "You choose the key",
        texto:
          "The token **describes** and the server **decides**. The verification key comes from a list you control (the expected issuer’s JWKS, from a URL in your configuration) and `kid` is only the index into it. Every header field that **carries** or **points to** a key (`jwk`, `jku`, `x5u`, `x5c`) is hostile input, and `kid` is untrusted input like any other.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A domain list is not enough",
        texto:
          "Validating the `jku` URL by prefix, regular expression or “ends with mydomain.com” is fragile: `https://idp.example.com.evil.net`, the `@` character and open redirects on an allowed domain bypass this kind of check. Compare the exact URL with the configured one, or better, ignore the field.",
      },
    ],
    armadilhas: [
      "Validating `jku` with `startsWith` or a regular expression: look-alike subdomains, `@` and open redirects bypass the check.",
      "Using `kid` in a file path, a command or concatenated SQL: it is untrusted input like any other.",
      "Trusting `x5c` because the chain “checks out”: a chain supplied by the attacker only validates against the root they included themselves.",
      "Fixing `kid` only with sanitization and forgetting to pin the algorithm and key type (see Q132): the defenses add up.",
    ],
    autoteste: [
      {
        pergunta: "Why are `jku` and `jwk` in the header dangerous even when the signature is verified?",
        resposta:
          "Because the signature is verified with a key the attacker supplied, so the token “authenticates itself”. The key must come from a trusted source that the server controls.",
      },
      {
        pergunta: "What should the role of `kid` be in validation?",
        resposta:
          "Only an identifier to choose, among already-trusted keys (the configured issuer’s JWKS), which one verifies the token. It is treated as untrusted input (no path, SQL or shell), and an unknown `kid` leads to at most one limited JWKS reload and then rejection.",
      },
    ],
  },
};
