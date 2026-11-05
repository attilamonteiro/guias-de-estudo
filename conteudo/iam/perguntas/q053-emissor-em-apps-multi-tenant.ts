import type { Pergunta } from "../../tipos";

// Q53 · Emissor em apps multi-tenant
export const q053: Pergunta = {
  numero: 53,
  modulo: "oidc",
  metodo: "whys",
  pt: {
    titulo: "Emissor em apps multi-tenant",
    pergunta:
      "Em um app multi-tenant com Entra ID e endpoint common, como validar o iss e o tid do token? Por que aceitar qualquer emissor é perigoso?",
    porqueEsteMetodo:
      "Aceitar qualquer emissor parece inofensivo porque “a assinatura é válida”. A cadeia de porquês mostra por que essa premissa falha num app multi-tenant e o que de fato precisa ser validado.",
    resposta30s:
      "Com o endpoint `common`, as chaves assinam tokens de **todos os tenants** e o `issuer` do documento é um template com `{tenantid}`; assim, uma assinatura válida só prova que o **Entra ID** emitiu o token, não que o tenant é um dos seus. Valide o `tid` contra uma **lista de tenants autorizados**, monte o `iss` esperado trocando `{tenantid}` pelo `tid` e exija igualdade, e identifique pessoas por `tid` + `oid`, não por e-mail. Aceitar qualquer emissor deixa o tenant de um atacante, com claims que ele controla, entrar nos dados de um cliente.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o endpoint `common` complica a validação do `iss`?",
            resposta:
              "Porque `common` (assim como `organizations` e `consumers`) não pertence a nenhum tenant. O documento de descoberta dele anuncia o `issuer` com o **placeholder** `{tenantid}` (algo como `https://login.microsoftonline.com/{tenantid}/v2.0`), e o `iss` real do token traz o identificador do tenant de quem entrou. Comparar os dois literalmente sempre falha, e o atalho tentador, desligar a validação do emissor (`ValidateIssuer = false`) ou aceitar qualquer `iss` que comece com o endereço da Microsoft, é o que torna o app inseguro.",
          },
          {
            pergunta: "Por que uma assinatura válida não prova que o tenant é autorizado?",
            resposta:
              "Porque o endpoint comum entrega o JWKS usado para os tokens de **todos** os tenants: a mesma autoridade assina para qualquer organização. A assinatura prova que o **Entra ID emitiu** o token, e nada mais. Qualquer organização ou pessoa com um tenant próprio consegue um token legítimo, com a audience do seu app multi-tenant, que passa em assinatura, `aud` e `exp`.",
          },
          {
            pergunta: "O que o atacante ganha se você aceita qualquer emissor?",
            resposta:
              "Ele controla o próprio tenant e, portanto, o conteúdo das claims: nome, `email`, `upn`, grupos e papéis são dele. Se o app localiza o usuário por e-mail ou por domínio, ele se passa por alguém de outra empresa; se o app só confere `aud`, uma conta de outro tenant entra no espaço de dados de um cliente (confusão de tenant). Numa API, o token de qualquer tenant leva a operações no seu serviço.",
          },
          {
            pergunta: "Como validar o `iss` e o `tid` do jeito certo?",
            resposta:
              "Em ordem: (a) leia o `tid` do token, ainda sem confiar nele, e recuse se não estiver na **lista de tenants autorizados** (os clientes cadastrados no onboarding do produto); (b) verifique a assinatura exigindo o `iss` esperado, montado trocando `{tenantid}` pelo `tid`, no formato da versão do token (os tokens v1.0 e v2.0 têm formatos de `iss` diferentes), e a `aud` do seu app; (c) identifique a pessoa por `tid` + `oid` (o `sub` do Entra é por aplicação), nunca por e-mail; (d) use o `tid` como filtro de todos os dados e permissões. Contas pessoais Microsoft também chegam pelo `common`, com um `tid` próprio: se o produto é só corporativo, use o endpoint `organizations` ou recuse esse `tid`.",
          },
          {
            pergunta: "Por que uma lista de tenants, e não “qualquer tenant que deu consentimento”?",
            resposta:
              "Porque o consentimento do administrador do tenant diz que **ele** aceita o seu app, não que **você** aceita o tenant. Num produto B2B, o cliente entra por um onboarding (contrato, consentimento do administrador, registro do `tid` na sua base), e o resto é recusado ou cai numa fila de aprovação. Num SaaS aberto, aceitar tenants novos pode ser uma decisão consciente, desde que cada um seja um espaço isolado e sem privilégios herdados.",
          },
        ],
        causaRaiz:
          "Num app multi-tenant, a assinatura só prova que o **Entra ID** emitiu o token; **qual tenant** é e se você o aceita é decisão sua. Valide o `tid` (e o `iss` derivado dele) contra os tenants que você autorizou, e identifique pessoas por `tid` + `oid`, nunca por e-mail.",
      },
      {
        tipo: "tabela",
        titulo: "Claims que importam num app multi-tenant",
        colunas: ["Claim", "O que é", "Como usar"],
        linhas: [
          [
            "`iss`",
            "O emissor do token; no Entra ID inclui o identificador do tenant e muda de formato entre tokens v1.0 e v2.0",
            "Igualdade exata com o valor montado a partir do `tid` autorizado",
          ],
          [
            "`tid`",
            "O tenant (diretório) de onde o usuário veio",
            "Conferir numa lista de tenants autorizados e usar como filtro dos dados",
          ],
          [
            "`oid`",
            "O identificador do usuário dentro do tenant, igual em todas as aplicações",
            "Junto com `tid`, é a chave da pessoa",
          ],
          [
            "`sub`",
            "O identificador do usuário, diferente para cada aplicação",
            "Estável para o seu app: guarde com o `iss`, ou prefira `tid` + `oid`",
          ],
          [
            "`email`, `upn`, `preferred_username`",
            "Atributos que o tenant do usuário pode definir e mudar",
            "Nunca como chave nem como prova de que a pessoa pertence a uma empresa",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Validar com lista de tenants autorizados",
        legenda: "TypeScript",
        codigo:
          'import { createRemoteJWKSet, decodeJwt, jwtVerify } from "jose";\n\nconst jwks = createRemoteJWKSet(new URL("https://login.microsoftonline.com/common/discovery/v2.0/keys"));\nconst tenantsAutorizados = new Set(["<tid do cliente A>", "<tid do cliente B>"]); // vem do onboarding\n\nexport async function validar(token: string) {\n  const { tid } = decodeJwt(token); // ainda sem confiar: só para escolher o emissor esperado\n  if (typeof tid !== "string" || !tenantsAutorizados.has(tid)) throw new Error("tenant não autorizado");\n\n  const { payload } = await jwtVerify(token, jwks, {\n    issuer: "https://login.microsoftonline.com/" + tid + "/v2.0", // {tenantid} trocado pelo tid\n    audience: "<client id do app>",\n    algorithms: ["RS256"],\n  });\n  return { tenant: tid, usuario: tid + ":" + payload.oid }; // chave da pessoa: tid + oid\n}',
        nota: "Os endereços são os documentados pela Microsoft para tokens v2.0; confira a documentação do fornecedor para a sua nuvem e versão de token. No ASP.NET Core, o equivalente é um validador de emissor (por exemplo, `IssuerValidator`) em vez de desligar `ValidateIssuer`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Desligar a validação do emissor não é solução",
        texto:
          "Desligar a validação do emissor, ou aceitar qualquer `iss` com o prefixo da Microsoft, faz o login funcionar para todo mundo, inclusive para quem não deveria. A forma segura é validar com uma lista: por tenant autorizado, ou por um validador que monte o `iss` esperado a partir do `tid` e recuse tenants desconhecidos. As bibliotecas da Microsoft costumam tratar o placeholder `{tenantid}`, mas a decisão de **quais tenants aceitar** continua sendo da sua aplicação. Detalhes de configuração do Entra ID ficam na documentação do fornecedor.",
      },
    ],
    armadilhas: [
      "Desligar a validação de emissor (`ValidateIssuer = false`) para “fazer o `common` funcionar”: qualquer tenant passa a entrar.",
      "Comparar o `iss` do token com o `issuer` literal do documento do `common` (falha sempre) ou aceitar qualquer `iss` que comece pelo endereço da Microsoft: o prefixo é de todos os tenants.",
      "Separar dados e permissões por domínio de e-mail ou `upn` em vez de `tid`: o atacante define esses atributos no tenant dele.",
      "Esquecer que o formato do `iss` muda entre tokens v1.0 e v2.0 e que contas pessoais chegam com um `tid` próprio: tokens legítimos falham ou tokens indesejados passam.",
    ],
    autoteste: [
      {
        pergunta: "Por que uma assinatura válida não prova que o tenant é autorizado?",
        resposta:
          "Porque as chaves do endpoint comum assinam tokens de todos os tenants. A assinatura só prova que o Entra ID emitiu o token; se o tenant é um dos seus clientes é uma checagem do `tid` contra a sua lista.",
      },
      {
        pergunta: "Como compor o `iss` esperado no `common`?",
        resposta:
          "Troca-se o `{tenantid}` do template pelo `tid` do token, depois de confirmar que o `tid` está na lista de tenants autorizados, no formato da versão do token. Ao verificar a assinatura, exige-se que o `iss` do token seja exatamente esse valor.",
      },
    ],
  },
  en: {
    titulo: "Issuer validation in multi-tenant apps",
    pergunta:
      "In a multi-tenant app using Entra ID and the common endpoint, how do you validate the token’s iss and tid? Why is accepting any issuer dangerous?",
    porqueEsteMetodo:
      "Accepting any issuer looks harmless because “the signature is valid”. The chain of whys shows why that premise fails in a multi-tenant app and what really needs to be validated.",
    resposta30s:
      "With the `common` endpoint, the keys sign tokens for **all tenants** and the document’s `issuer` is a template with `{tenantid}`; so a valid signature only proves that **Entra ID** issued the token, not that the tenant is one of yours. Validate the `tid` against a **list of authorized tenants**, build the expected `iss` by replacing `{tenantid}` with the `tid` and require equality, and identify people by `tid` + `oid`, not by email. Accepting any issuer lets an attacker’s tenant, with claims it controls, into a customer’s data.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does the `common` endpoint complicate `iss` validation?",
            resposta:
              "Because `common` (like `organizations` and `consumers`) belongs to no tenant. Its discovery document announces the `issuer` with the **placeholder** `{tenantid}` (something like `https://login.microsoftonline.com/{tenantid}/v2.0`), and the token’s real `iss` carries the identifier of the tenant the user came from. Comparing the two literally always fails, and the tempting shortcut, turning issuer validation off (`ValidateIssuer = false`) or accepting any `iss` that starts with Microsoft’s address, is what makes the app insecure.",
          },
          {
            pergunta: "Why does a valid signature not prove the tenant is authorized?",
            resposta:
              "Because the common endpoint serves the JWKS used for the tokens of **all** tenants: the same authority signs for any organization. The signature proves that **Entra ID issued** the token, and nothing more. Any organization or person with a tenant of their own can get a legitimate token, with your multi-tenant app’s audience, that passes signature, `aud` and `exp`.",
          },
          {
            pergunta: "What does the attacker gain if you accept any issuer?",
            resposta:
              "They control their own tenant and therefore the content of the claims: name, `email`, `upn`, groups and roles are theirs. If the app finds the user by email or domain, they impersonate someone from another company; if the app only checks `aud`, an account from another tenant enters a customer’s data space (tenant confusion). In an API, a token from any tenant leads to operations on your service.",
          },
          {
            pergunta: "How do you validate `iss` and `tid` the right way?",
            resposta:
              "In order: (a) read the token’s `tid`, still without trusting it, and reject it if it is not on the **list of authorized tenants** (the customers registered in your product’s onboarding); (b) verify the signature requiring the expected `iss`, built by replacing `{tenantid}` with the `tid`, in the format of the token version (v1.0 and v2.0 tokens have different `iss` formats), and your app’s `aud`; (c) identify the person by `tid` + `oid` (Entra’s `sub` is per application), never by email; (d) use the `tid` as the filter for all data and permissions. Personal Microsoft accounts also arrive through `common`, with a `tid` of their own: if the product is corporate-only, use the `organizations` endpoint or reject that `tid`.",
          },
          {
            pergunta: "Why a list of tenants, and not “any tenant that gave consent”?",
            resposta:
              "Because the tenant administrator’s consent says that **they** accept your app, not that **you** accept the tenant. In a B2B product, the customer comes in through onboarding (contract, administrator consent, your database recording the `tid`), and everything else is rejected or goes to an approval queue. In an open SaaS, accepting new tenants can be a conscious decision, as long as each one is an isolated space with no inherited privileges.",
          },
        ],
        causaRaiz:
          "In a multi-tenant app, the signature only proves that **Entra ID** issued the token; **which tenant** it is and whether you accept it is your decision. Validate the `tid` (and the `iss` derived from it) against the tenants you authorized, and identify people by `tid` + `oid`, never by email.",
      },
      {
        tipo: "tabela",
        titulo: "Claims that matter in a multi-tenant app",
        colunas: ["Claim", "What it is", "How to use it"],
        linhas: [
          [
            "`iss`",
            "The token’s issuer; in Entra ID it includes the tenant identifier and changes format between v1.0 and v2.0 tokens",
            "Exact equality with the value built from the authorized `tid`",
          ],
          [
            "`tid`",
            "The tenant (directory) the user came from",
            "Check it against a list of authorized tenants and use it as the data filter",
          ],
          [
            "`oid`",
            "The user’s identifier within the tenant, the same across all applications",
            "Together with `tid`, it is the person’s key",
          ],
          [
            "`sub`",
            "The user’s identifier, different for each application",
            "Stable for your app: store it with `iss`, or prefer `tid` + `oid`",
          ],
          [
            "`email`, `upn`, `preferred_username`",
            "Attributes the user’s tenant can set and change",
            "Never as a key or as proof that the person belongs to a company",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Validating with a list of authorized tenants",
        legenda: "TypeScript",
        codigo:
          'import { createRemoteJWKSet, decodeJwt, jwtVerify } from "jose";\n\nconst jwks = createRemoteJWKSet(new URL("https://login.microsoftonline.com/common/discovery/v2.0/keys"));\nconst authorizedTenants = new Set(["<customer A tid>", "<customer B tid>"]); // comes from onboarding\n\nexport async function validate(token: string) {\n  const { tid } = decodeJwt(token); // not trusted yet: only to pick the expected issuer\n  if (typeof tid !== "string" || !authorizedTenants.has(tid)) throw new Error("tenant not authorized");\n\n  const { payload } = await jwtVerify(token, jwks, {\n    issuer: "https://login.microsoftonline.com/" + tid + "/v2.0", // {tenantid} replaced by tid\n    audience: "<app client id>",\n    algorithms: ["RS256"],\n  });\n  return { tenant: tid, user: tid + ":" + payload.oid }; // the person’s key: tid + oid\n}',
        nota: "The addresses are the ones Microsoft documents for v2.0 tokens; check the vendor’s documentation for your cloud and token version. In ASP.NET Core, the equivalent is an issuer validator (for example `IssuerValidator`) instead of turning `ValidateIssuer` off.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Turning issuer validation off is not a fix",
        texto:
          "Turning issuer validation off, or accepting any `iss` with Microsoft’s prefix, makes login work for everyone, including people who should not get in. The safe way is to validate against a list: per authorized tenant, or with a validator that builds the expected `iss` from the `tid` and rejects unknown tenants. Microsoft’s libraries usually handle the `{tenantid}` placeholder, but the decision of **which tenants to accept** stays with your application. Entra ID configuration details belong in the vendor’s documentation.",
      },
    ],
    armadilhas: [
      "Turning issuer validation off (`ValidateIssuer = false`) to “make `common` work”: any tenant can now sign in.",
      "Comparing the token’s `iss` with the literal `issuer` from the `common` document (it always fails) or accepting any `iss` that starts with Microsoft’s address: the prefix belongs to every tenant.",
      "Separating data and permissions by email domain or `upn` instead of `tid`: the attacker sets those attributes in their own tenant.",
      "Forgetting that the `iss` format changes between v1.0 and v2.0 tokens and that personal accounts arrive with a `tid` of their own: legitimate tokens fail or unwanted ones pass.",
    ],
    autoteste: [
      {
        pergunta: "Why does a valid signature not prove the tenant is authorized?",
        resposta:
          "Because the common endpoint’s keys sign tokens for all tenants. The signature only proves Entra ID issued the token; whether the tenant is one of your customers is a check of the `tid` against your list.",
      },
      {
        pergunta: "How do you build the expected `iss` on `common`?",
        resposta:
          "You replace the template’s `{tenantid}` with the token’s `tid`, after confirming the `tid` is on the list of authorized tenants, in the format of the token version, and require exact equality with the `iss` while verifying the signature.",
      },
    ],
  },
};
