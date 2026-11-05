import type { Pergunta } from "../../tipos";

// Q43 · ID token, access token e UserInfo
export const q043: Pergunta = {
  numero: 43,
  modulo: "oidc",
  metodo: "compare",
  pt: {
    titulo: "ID token, access token e UserInfo",
    pergunta:
      "Qual é a diferença entre ID token, access token e o endpoint UserInfo no OpenID Connect? Para quem cada um é destinado e o que cada um deve (ou não) conter?",
    porqueEsteMetodo:
      "Os três carregam informação sobre o usuário ou sobre o acesso e se confundem com facilidade. Uma matriz por destinatário, finalidade e conteúdo mostra o que cada um é, e a regra de decisão diz qual usar em cada situação.",
    resposta30s:
      "O **ID token** é um JWT para o **cliente**: prova que o usuário se autenticou, com `iss`, `sub`, `aud` e `nonce`. O **access token** é a credencial para a **API**: o cliente o trata como opaco e só o envia ao resource server. O **UserInfo** é um endpoint que devolve claims adicionais sobre o usuário quando chamado com o access token; não troque os papéis: **ID token não vai para a API**, e o cliente não deve interpretar o access token.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Os três lado a lado",
        colunas: ["Aspecto", "ID token", "Access token", "UserInfo"],
        linhas: [
          [
            "Para quem é",
            "O cliente, a aplicação que pediu o login: `aud` é o `client_id`",
            "A API (resource server): `aud` é a API",
            "O cliente, que o consulta",
          ],
          [
            "O que representa",
            "Prova de que houve autenticação, quando e como (`auth_time`, `acr`, `amr`)",
            "Autorização para acessar recursos, expressa em escopos",
            "Dados do usuário (perfil, e-mail, telefone), conforme os escopos pedidos",
          ],
          [
            "Formato",
            "Sempre um JWT assinado",
            "Opaco ou JWT: é um acordo entre o authorization server e a API",
            "Resposta a uma chamada HTTP, em JSON (ou JWT assinado)",
          ],
          [
            "Quem valida ou lê",
            "O cliente valida assinatura, `iss`, `aud`, `exp` e `nonce`",
            "A API valida (veja Q40); o cliente não deve ler o conteúdo",
            "O cliente confere que o `sub` é igual ao do ID token",
          ],
          [
            "Claims típicas",
            "`iss`, `sub`, `aud`, `exp`, `iat`, `nonce`, `auth_time`, `at_hash`; algumas de perfil",
            "`iss`, `sub`, `aud`, `exp`, `scope`, `client_id`, `jti`",
            "`sub` (obrigatória), `name`, `email`, `email_verified`, `picture` e outras",
          ],
          [
            "Vida e uso",
            "Curta; serve para criar a sessão do cliente, não para chamar API",
            "Curta; enviado a cada chamada de API",
            "Chamado sob demanda, com um access token válido que tenha o escopo `openid`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "ID token e access token, decodificados lado a lado",
        legenda: "JSON",
        codigo: `{
  "id_token": {
    "iss": "https://auth.example.com",
    "sub": "u-42",
    "aud": "spa-web",
    "nonce": "n-0S6_WzA2Mj",
    "auth_time": 1767225590,
    "amr": ["pwd", "otp"],
    "exp": 1767225900
  },
  "access_token": {
    "iss": "https://auth.example.com",
    "sub": "u-42",
    "aud": "https://api.example.com",
    "client_id": "spa-web",
    "scope": "orders:read",
    "exp": 1767226200
  }
}`,
        nota: "São duas cargas úteis decodificadas, mostradas juntas só para comparar; na prática são dois JWTs separados. Note o `aud`: o primeiro é para o cliente, o segundo para a API.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Pergunte **para quem é a pergunta**. “Quem é este usuário e ele se autenticou agora?” é do **cliente**: ID token. “Este chamador pode acessar esta API?” é da **API**: access token, com `aud` e escopo da própria API. “Preciso de mais dados do usuário?” vem do **UserInfo** (ou de claims no ID token, se couberem). A identidade estável do usuário é o par `iss` mais `sub`; o e-mail pode mudar e não identifica sozinho.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Erros que viram vulnerabilidade",
        texto:
          "Enviar o ID token à API como credencial: ele não tem a audiência da API, e aceitá-lo deixa qualquer app que recebeu um ID token chamá-la. Ler claims do access token no cliente: o formato é um acordo entre o servidor e a API e pode mudar ou ser opaco; peça ao UserInfo ou use o ID token. Pôr dados demais nos tokens (dados pessoais, grupos, permissões): eles são apenas codificados, vão a muitos lugares e ficam enormes; mantenha o mínimo e busque o resto no UserInfo. Aceitar o UserInfo sem conferir que o `sub` bate com o do ID token.",
      },
    ],
    armadilhas: [
      "Usar o ID token como bearer para chamar a API: ele é para o cliente, e a API deve rejeitá-lo por causa do `aud`.",
      "Decodificar o access token no front-end para ler nome ou papéis e depender disso: quando o formato mudar (ou for opaco), o app quebra.",
      "Tomar o e-mail como identificador do usuário em vez de `iss` mais `sub`: e-mails mudam e podem ser reaproveitados.",
      "Esquecer de validar `nonce`, `aud`, `iss` e a assinatura do ID token, ou de conferir que o `sub` do UserInfo é o mesmo do ID token.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre o ID token e o access token?",
        resposta:
          "O ID token é para o cliente e prova a autenticação (quem é o usuário, quando e como); é sempre um JWT. O access token é para a API e autoriza o acesso aos recursos; o cliente o trata como opaco. Cada um tem a sua audiência (`aud`), e o ID token não deve ser aceito por uma API.",
      },
      {
        pergunta: "Para que serve o UserInfo se o ID token já tem claims?",
        resposta:
          "O ID token deve ser pequeno e passa pelo navegador; o UserInfo entrega dados adicionais ou mais atuais sob demanda, com escopo, sem inflar o token. O `sub` do UserInfo deve ser igual ao do ID token.",
      },
    ],
  },
  en: {
    titulo: "ID token, access token and UserInfo",
    pergunta:
      "What is the difference between the ID token, the access token and the UserInfo endpoint in OpenID Connect? Who is each one meant for, and what should (or should not) each contain?",
    porqueEsteMetodo:
      "All three carry information about the user or about access, and they are easy to confuse. A matrix by recipient, purpose and content shows what each one is, and the decision rule says which to use in each situation.",
    resposta30s:
      "The **ID token** is a JWT for the **client**: it proves the user authenticated, with `iss`, `sub`, `aud` and `nonce`. The **access token** is the credential for the **API**: the client treats it as opaque and only sends it to the resource server. **UserInfo** is an endpoint that returns additional claims about the user when called with the access token; do not swap the roles: **the ID token does not go to the API**, and the client should not interpret the access token.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The three side by side",
        colunas: ["Aspect", "ID token", "Access token", "UserInfo"],
        linhas: [
          [
            "Who it is for",
            "The client, the application that asked for the login: `aud` is the `client_id`",
            "The API (resource server): `aud` is the API",
            "The client, which queries it",
          ],
          [
            "What it represents",
            "Proof that authentication happened, when and how (`auth_time`, `acr`, `amr`)",
            "Authorization to access resources, expressed as scopes",
            "User data (profile, email, phone), according to the scopes requested",
          ],
          [
            "Format",
            "Always a signed JWT",
            "Opaque or JWT: an agreement between the authorization server and the API",
            "A response to an HTTP call, in JSON (or a signed JWT)",
          ],
          [
            "Who validates or reads it",
            "The client validates signature, `iss`, `aud`, `exp` and `nonce`",
            "The API validates (see Q40); the client should not read the contents",
            "The client checks that the `sub` equals the ID token’s",
          ],
          [
            "Typical claims",
            "`iss`, `sub`, `aud`, `exp`, `iat`, `nonce`, `auth_time`, `at_hash`; some profile claims",
            "`iss`, `sub`, `aud`, `exp`, `scope`, `client_id`, `jti`",
            "`sub` (required), `name`, `email`, `email_verified`, `picture` and others",
          ],
          [
            "Life and use",
            "Short; used to create the client’s session, not to call APIs",
            "Short; sent on every API call",
            "Called on demand, with a valid access token that has the `openid` scope",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "ID token and access token, decoded side by side",
        legenda: "JSON",
        codigo: `{
  "id_token": {
    "iss": "https://auth.example.com",
    "sub": "u-42",
    "aud": "spa-web",
    "nonce": "n-0S6_WzA2Mj",
    "auth_time": 1767225590,
    "amr": ["pwd", "otp"],
    "exp": 1767225900
  },
  "access_token": {
    "iss": "https://auth.example.com",
    "sub": "u-42",
    "aud": "https://api.example.com",
    "client_id": "spa-web",
    "scope": "orders:read",
    "exp": 1767226200
  }
}`,
        nota: "These are two decoded payloads shown together only for comparison; in practice they are two separate JWTs. Note the `aud`: the first is for the client, the second for the API.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Ask **who the question is for**. “Who is this user, and did they authenticate just now?” belongs to the **client**: ID token. “May this caller access this API?” belongs to the **API**: access token, with the API’s own `aud` and scope. “Do I need more data about the user?” comes from **UserInfo** (or from claims in the ID token, if they fit). The user’s stable identity is the pair `iss` plus `sub`; an email can change and does not identify on its own.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Mistakes that become vulnerabilities",
        texto:
          "Sending the ID token to the API as a credential: it does not carry the API’s audience, and accepting it lets any app that received an ID token call the API. Reading access token claims on the client: the format is an agreement between the server and the API and may change or be opaque; ask UserInfo or use the ID token. Putting too much in the tokens (personal data, groups, permissions): they are merely encoded, travel to many places and grow huge; keep the minimum and fetch the rest from UserInfo. Accepting UserInfo without checking that its `sub` matches the ID token’s.",
      },
    ],
    armadilhas: [
      "Using the ID token as a bearer to call the API: it is meant for the client, and the API should reject it because of the `aud`.",
      "Decoding the access token in the front end to read the name or roles and depending on it: when the format changes (or is opaque), the app breaks.",
      "Taking the email as the user identifier instead of `iss` plus `sub`: emails change and can be reassigned.",
      "Forgetting to validate the ID token’s `nonce`, `aud`, `iss` and signature, or to check that UserInfo’s `sub` is the same as the ID token’s.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between the ID token and the access token?",
        resposta:
          "The ID token is for the client and proves authentication (who the user is, when and how); it is always a JWT. The access token is for the API and authorizes access to resources; the client treats it as opaque. Each has its own audience (`aud`), and the ID token must not be accepted by an API.",
      },
      {
        pergunta: "What is UserInfo for if the ID token already has claims?",
        resposta:
          "The ID token should be small and passes through the browser; UserInfo delivers additional or fresher data on demand, scoped, without inflating the token. UserInfo’s `sub` must equal the ID token’s.",
      },
    ],
  },
};
