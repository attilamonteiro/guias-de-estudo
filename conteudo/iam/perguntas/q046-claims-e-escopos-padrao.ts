import type { Pergunta } from "../../tipos";

// Q46 · Claims e escopos padrão
export const q046: Pergunta = {
  numero: 46,
  modulo: "oidc",
  metodo: "feynman",
  pt: {
    titulo: "Claims e escopos padrão",
    pergunta:
      "Quais são os escopos padrão do OIDC (openid, profile, email, address, phone) e as claims que cada um libera? Como tratar claims customizadas e o parâmetro claims?",
    porqueEsteMetodo:
      "Escopo e claim se confundem com facilidade, e uma imagem do dia a dia (um formulário com caixas de seleção) separa os dois. Depois vêm o mapa exato de escopo para claims e os pontos em que a imagem deixa de valer.",
    resposta30s:
      "**Claims** são afirmações sobre o usuário (`sub`, `name`, `email`, `email_verified`…); **escopos** são os pedidos que liberam grupos de claims: `openid` (obrigatório, entrega o `sub`), `profile`, `email`, `address` e `phone`. Elas chegam no **ID token** e/ou no endpoint **UserInfo**, e o parâmetro **`claims`** pede claims específicas (e essenciais) sem liberar o grupo inteiro. Claims customizadas precisam de **nome sem colisão** (um namespace) e de **mínimo de dados**; o identificador estável é o **`sub`**, e `email` só se confia junto com `email_verified`.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine o formulário de autorização de um cadastro, com caixas de seleção: “compartilhar meu perfil”, “compartilhar meu e-mail”, “compartilhar meu endereço”. Cada caixa marcada libera um bloco de campos, e quem recebe o formulário só vê os campos dos blocos que você autorizou. O app marca as caixas que quer (os escopos), e o provedor de identidade preenche os campos (as claims).",
        tecnico:
          "Um **escopo** é um pedido de acesso que agrupa claims; uma **claim** é um par nome-valor sobre o usuário. O escopo `openid` é obrigatório e ativa o OIDC (a resposta traz o `sub`); `profile`, `email`, `address` e `phone` liberam os blocos da tabela abaixo. Pela especificação, num fluxo com authorization code essas claims saem do endpoint **UserInfo** (chamado com o access token), e só vão direto no ID token quando não há access token; na prática, muitos IdPs também as colocam no ID token, e isso costuma ser configurável. Se usar o UserInfo, confira que o `sub` dele é igual ao do ID token. Para pedir claims individuais, use o parâmetro **`claims`**, um JSON com os membros `userinfo` e `id_token`.",
        limite:
          "O formulário promete mais do que o mundo real entrega. O escopo é um **pedido, não uma garantia**: o usuário pode negar, a política do IdP pode barrar, e o campo pode estar vazio. Nem toda claim vale o mesmo: `email` sem `email_verified: true` é só o que alguém digitou. E a posição importa: as claims do ID token servem ao cliente que fez o login; uma API deve autorizar pelo access token, não pelo ID token (veja Q54).",
      },
      {
        tipo: "tabela",
        titulo: "Escopos padrão e o que liberam",
        colunas: ["Escopo", "Claims liberadas", "Observação"],
        linhas: [
          [
            "`openid`",
            "`sub` (e, no ID token, `iss`, `aud`, `exp`, `iat`)",
            "Obrigatório: sem ele a requisição não é OIDC. Dá o identificador do usuário, não dados pessoais",
          ],
          [
            "`profile`",
            "`name`, `given_name`, `family_name`, `nickname`, `preferred_username`, `picture`, `locale`, `zoneinfo`, `updated_at` e outras",
            "Bloco largo: peça só se a interface realmente usa esses dados",
          ],
          [
            "`email`",
            "`email`, `email_verified`",
            "Leia as duas juntas: o e-mail só vale como verificado se `email_verified` for verdadeiro",
          ],
          [
            "`address`",
            "`address`, um objeto com `formatted`, `street_address`, `locality`, `region`, `postal_code`, `country`",
            "Dado sensível e raramente necessário; peça apenas com finalidade clara",
          ],
          [
            "`phone`",
            "`phone_number`, `phone_number_verified`",
            "Mesmo cuidado de `email`: confira a verificação antes de usar o número",
          ],
          [
            "`offline_access`",
            "Nenhuma claim; pede um refresh token",
            "Não é escopo de dados do usuário, mas aparece junto dos outros e muda o que o app guarda",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Pedir claims específicas com o parâmetro claims",
        legenda: "JSON",
        codigo:
          '{\n  "userinfo": {\n    "email": { "essential": true },\n    "email_verified": null,\n    "given_name": null\n  },\n  "id_token": {\n    "auth_time": { "essential": true },\n    "acr": { "values": ["urn:example:acr:mfa"] }\n  }\n}',
        nota: "Vai na requisição de autorização, codificado como URL, no parâmetro `claims`. `null` pede a claim sem condições. Nem todo IdP aceita o parâmetro: procure `claims_parameter_supported` no documento de descoberta (veja Q45).",
      },
      {
        tipo: "codigo",
        titulo: "Um ID token com claim customizada",
        legenda: "JWT",
        codigo:
          '{\n  "iss": "https://id.example.com",\n  "sub": "248289761001",\n  "aud": "meu-cliente",\n  "exp": 1760000600,\n  "iat": 1760000000,\n  "nonce": "n-0S6_WzA2Mj",\n  "name": "Maria Souza",\n  "email": "maria@example.com",\n  "email_verified": true,\n  "https://example.com/claims/papeis": ["financeiro"]\n}',
        nota: "Payload decodificado. A claim customizada leva um nome qualificado por URL para não colidir com claims padrão nem com as de outros sistemas.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regras práticas para claims",
        texto:
          "**Identifique por `sub`** (junto do `iss`, veja Q52), nunca por `email` ou `name`. **Peça o mínimo**: cada escopo a mais amplia o consentimento, os dados guardados e o vazamento possível, e a LGPD pede dados necessários à finalidade. **Claims customizadas** (papéis, tenant, código interno) são configuradas no IdP, com nome sem colisão (um namespace) e valores curtos; não ponha dado sensível nem listas enormes no token, que é assinado mas legível por quem o tiver. E **trate `email` só com `email_verified`**, e mesmo assim não como chave.",
      },
    ],
    armadilhas: [
      "Usar `email` como identificador do usuário, ou confiar nele sem `email_verified`: o endereço muda, é reatribuído e pode ser declarado por um IdP que não o verificou (veja Q52).",
      "Pedir `profile`, `address` e `phone` “por garantia”: amplia o consentimento e os dados que você terá de proteger sem necessidade.",
      "Colocar dado sensível ou listas grandes (grupos, permissões) em claims customizadas: o token é legível por quem o tem e tokens grandes estouram limites de cabeçalho.",
      "Usar o ID token numa API para decidir permissões: ele é endereçado ao cliente, e a API deve validar o access token com a sua própria audience.",
    ],
    autoteste: [
      {
        pergunta: "Com os escopos `openid email`, que claims o app recebe e por onde?",
        resposta:
          "O `sub` (do `openid`) e `email` e `email_verified` (do `email`). Pela especificação, num fluxo com authorization code as duas últimas saem do UserInfo; muitos IdPs também as incluem no ID token. Confira o `sub` do UserInfo com o do ID token.",
      },
      {
        pergunta: "Para que serve o parâmetro `claims` se já existem escopos?",
        resposta:
          "Para pedir claims individuais, separadamente para o ID token e para o UserInfo, e marcá-las como essenciais ou com valores esperados (por exemplo `acr`), sem liberar o bloco inteiro de um escopo. Nem todo IdP o suporta, e o IdP pode devolver menos do que o pedido.",
      },
    ],
  },
  en: {
    titulo: "Standard claims and scopes",
    pergunta:
      "What are the standard OIDC scopes (openid, profile, email, address, phone) and the claims each one releases? How do you handle custom claims and the claims parameter?",
    porqueEsteMetodo:
      "Scope and claim are easy to mix up, and an everyday image (a form with checkboxes) keeps them apart. Then come the exact map from scope to claims and the points where the image stops holding.",
    resposta30s:
      "**Claims** are statements about the user (`sub`, `name`, `email`, `email_verified`…); **scopes** are the requests that release groups of claims: `openid` (mandatory, delivers `sub`), `profile`, `email`, `address` and `phone`. They arrive in the **ID token** and/or the **UserInfo** endpoint, and the **`claims`** parameter requests specific (and essential) claims without releasing the whole group. Custom claims need a **collision-free name** (a namespace) and a **minimum of data**; the stable identifier is **`sub`**, and `email` is only trusted together with `email_verified`.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Picture the authorization form of a sign-up, with checkboxes: “share my profile”, “share my email”, “share my address”. Each ticked box releases a block of fields, and whoever receives the form sees only the fields of the blocks you authorized. The app ticks the boxes it wants (the scopes), and the identity provider fills in the fields (the claims).",
        tecnico:
          "A **scope** is an access request that groups claims; a **claim** is a name-value pair about the user. The `openid` scope is mandatory and turns on OIDC (the response carries `sub`); `profile`, `email`, `address` and `phone` release the blocks in the table below. By the specification, in an authorization code flow those claims come from the **UserInfo** endpoint (called with the access token), and go straight into the ID token only when no access token is issued; in practice many IdPs also put them in the ID token, and that is often configurable. If you use UserInfo, check that its `sub` equals the one in the ID token. To ask for individual claims, use the **`claims`** parameter, a JSON with the members `userinfo` and `id_token`.",
        limite:
          "The form promises more than the real world delivers. A scope is a **request, not a guarantee**: the user may refuse, the IdP’s policy may block it, and the field may be empty. Not every claim is worth the same: `email` without `email_verified: true` is just what someone typed. And position matters: ID token claims serve the client that did the login; an API should authorize by the access token, not the ID token (see Q54).",
      },
      {
        tipo: "tabela",
        titulo: "Standard scopes and what they release",
        colunas: ["Scope", "Claims released", "Note"],
        linhas: [
          [
            "`openid`",
            "`sub` (and, in the ID token, `iss`, `aud`, `exp`, `iat`)",
            "Mandatory: without it the request is not OIDC. It gives the user’s identifier, not personal data",
          ],
          [
            "`profile`",
            "`name`, `given_name`, `family_name`, `nickname`, `preferred_username`, `picture`, `locale`, `zoneinfo`, `updated_at` and others",
            "A wide block: ask only if the interface really uses this data",
          ],
          [
            "`email`",
            "`email`, `email_verified`",
            "Read both together: the email counts as verified only if `email_verified` is true",
          ],
          [
            "`address`",
            "`address`, an object with `formatted`, `street_address`, `locality`, `region`, `postal_code`, `country`",
            "Sensitive data and rarely needed; ask only with a clear purpose",
          ],
          [
            "`phone`",
            "`phone_number`, `phone_number_verified`",
            "Same care as `email`: check the verification before using the number",
          ],
          [
            "`offline_access`",
            "No claims; asks for a refresh token",
            "Not a user-data scope, but it appears alongside the others and changes what the app stores",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Requesting specific claims with the claims parameter",
        legenda: "JSON",
        codigo:
          '{\n  "userinfo": {\n    "email": { "essential": true },\n    "email_verified": null,\n    "given_name": null\n  },\n  "id_token": {\n    "auth_time": { "essential": true },\n    "acr": { "values": ["urn:example:acr:mfa"] }\n  }\n}',
        nota: "It goes in the authorization request, URL-encoded, in the `claims` parameter. `null` requests the claim with no conditions. Not every IdP accepts the parameter: look for `claims_parameter_supported` in the discovery document (see Q45).",
      },
      {
        tipo: "codigo",
        titulo: "An ID token with a custom claim",
        legenda: "JWT",
        codigo:
          '{\n  "iss": "https://id.example.com",\n  "sub": "248289761001",\n  "aud": "my-client",\n  "exp": 1760000600,\n  "iat": 1760000000,\n  "nonce": "n-0S6_WzA2Mj",\n  "name": "Maria Souza",\n  "email": "maria@example.com",\n  "email_verified": true,\n  "https://example.com/claims/roles": ["finance"]\n}',
        nota: "Decoded payload. The custom claim carries a URL-qualified name so it does not collide with standard claims or with other systems’ claims.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Practical rules for claims",
        texto:
          "**Identify by `sub`** (together with `iss`, see Q52), never by `email` or `name`. **Ask for the minimum**: every extra scope widens consent, the data you store and the possible leak, and data-protection laws such as Brazil’s LGPD ask for data necessary to the purpose. **Custom claims** (roles, tenant, internal code) are configured in the IdP, with a collision-free name (a namespace) and short values; keep sensitive data and huge lists out of the token, which is signed but readable by anyone who holds it. And **treat `email` only with `email_verified`**, and even then not as a key.",
      },
    ],
    armadilhas: [
      "Using `email` as the user’s identifier, or trusting it without `email_verified`: the address changes, gets reassigned and can be declared by an IdP that never verified it (see Q52).",
      "Asking for `profile`, `address` and `phone` “just in case”: it widens consent and the data you will have to protect for no reason.",
      "Putting sensitive data or big lists (groups, permissions) in custom claims: the token is readable by whoever has it, and large tokens blow past header limits.",
      "Using the ID token in an API to decide permissions: it is addressed to the client, and the API should validate the access token against its own audience.",
    ],
    autoteste: [
      {
        pergunta: "With the scopes `openid email`, which claims does the app receive and through where?",
        resposta:
          "`sub` (from `openid`) plus `email` and `email_verified` (from `email`). By the specification, in an authorization code flow the last two come from UserInfo; many IdPs also include them in the ID token. Check UserInfo’s `sub` against the ID token’s.",
      },
      {
        pergunta: "What is the `claims` parameter for if scopes already exist?",
        resposta:
          "To request individual claims, separately for the ID token and for UserInfo, and mark them as essential or with expected values (for example `acr`), without releasing a scope’s whole block. Not every IdP supports it, and the IdP may return less than what was requested.",
      },
    ],
  },
};
