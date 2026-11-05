import type { Pergunta } from "../../tipos";

// Q93 · Cerimônia de registro WebAuthn
export const q093: Pergunta = {
  numero: 93,
  modulo: "mfa-e-passkeys",
  metodo: "trace",
  pt: {
    titulo: "Cerimônia de registro WebAuthn",
    pergunta:
      "Descreva passo a passo a cerimônia de registro do WebAuthn. O que o servidor envia, o que o autenticador cria e o que o servidor valida e armazena?",
    porqueEsteMetodo:
      "No registro, o dado passa por várias mãos (servidor, página, navegador, autenticador) e é fácil perder o fio. Seguir um único cadastro, e ver o que falha em cada ponto, mostra o que o servidor precisa conferir e guardar.",
    resposta30s:
      "O servidor gera um **challenge** aleatório e as **opções** (`rpId`, usuário, algoritmos), e a página chama `navigator.credentials.create`. O autenticador, depois de verificar o usuário, **cria um par de chaves ligado ao `rpId`** e devolve o `attestationObject` e o `clientDataJSON`. O servidor valida **challenge, origem e `rpId`** e guarda a **chave pública, o credential id e o contador**; a chave privada nunca sai do autenticador.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "O registro, do começo ao fim",
        etapas: [
          "A pessoa pede para criar uma passkey. O servidor gera um `challenge` aleatório de uso único, guarda-o com validade curta e devolve as opções de criação (`rp.id`, dados do usuário, algoritmos aceitos, exigência de verificação do usuário)",
          "A página chama `navigator.credentials.create({ publicKey: opcoes })`",
          "O navegador confere se o `rp.id` combina com a origem da página (o domínio atual ou um sufixo registrável dele, em contexto seguro), monta o `clientDataJSON` com `type: webauthn.create`, o challenge e a origem real, e calcula seu hash",
          "O autenticador (de plataforma ou uma chave externa, por CTAP) pede presença e verificação do usuário: toque, PIN ou biometria",
          "O autenticador gera um **par de chaves novo, ligado ao hash do `rpId`**, guarda a privada e monta o `authenticatorData` (hash do `rpId`, flags, contador, credential id e chave pública em formato COSE) dentro do `attestationObject`",
          "O navegador devolve à página o `id` da credencial, o `clientDataJSON` e o `attestationObject`",
          "A página envia tudo ao servidor, que valida e armazena",
        ],
        nota: "A chave privada nunca aparece nesse fluxo. O que viaja de volta é só a parte pública, mais as provas de que o autenticador a criou para este `rpId` e para esta tentativa.",
      },
      {
        tipo: "codigo",
        titulo: "O que o servidor envia: opções de criação",
        legenda: "JSON",
        codigo: `{
  "challenge": "kQ3vP9xT1mZ8yR2aLw5cHn7uJd4sBf6EoGiVtX0pY1U",
  "rp": { "id": "exemplo.com.br", "name": "Exemplo" },
  "user": { "id": "dXNyXzQyMQ", "name": "ana@exemplo.com.br", "displayName": "Ana" },
  "pubKeyCredParams": [
    { "type": "public-key", "alg": -7 },
    { "type": "public-key", "alg": -257 }
  ],
  "authenticatorSelection": { "residentKey": "preferred", "userVerification": "preferred" },
  "excludeCredentials": [],
  "attestation": "none",
  "timeout": 300000
}`,
        nota: "`challenge` e `user.id` vão em base64url. O challenge deve ser aleatório (ao menos 16 bytes; use 32), de uso único e guardado no servidor com validade curta. `alg` é o identificador COSE do algoritmo: -7 é ES256 e -257 é RS256. O `user.id` é um identificador opaco, nunca o e-mail. `excludeCredentials` lista as credenciais já registradas, para o autenticador não criar uma duplicata.",
      },
      {
        tipo: "passos",
        titulo: "O que o servidor valida e armazena, nesta ordem",
        passos: [
          {
            titulo: "Challenge e tipo",
            texto:
              "Lê o `clientDataJSON` e confere que o `challenge` é o que ele emitiu para esta sessão, ainda válido e não usado, e que `type` é `webauthn.create`. Depois, descarta o challenge.",
          },
          {
            titulo: "Origem",
            texto:
              "Confere que `origin` está na lista de origens esperadas (esquema, host e porta, em comparação exata).",
          },
          {
            titulo: "`rpId`",
            texto:
              "Decodifica o `attestationObject` (CBOR), extrai o `authenticatorData` e confere que o hash do `rpId` dentro dele é o SHA-256 do seu `rpId`.",
          },
          {
            titulo: "Flags",
            texto:
              "Confere que o bit de presença do usuário está ligado e, se você exigiu, o de verificação do usuário. Registra também os bits de backup, que dizem se a credencial é sincronizável.",
          },
          {
            titulo: "Atestação",
            texto:
              "Com `attestation: none`, não há o que verificar. Se pediu atestação, valida o formato e a cadeia de certificados contra os metadados do fabricante e decide se aceita aquele modelo.",
          },
          {
            titulo: "Extrair a credencial",
            texto:
              "Lê o credential id, o algoritmo e a chave pública (formato COSE) do `authenticatorData` e confere que o credential id ainda não está cadastrado.",
          },
          {
            titulo: "Armazenar",
            texto:
              "Grava, ligados ao usuário: credential id (único e indexado), chave pública, contador, `transports`, flags de backup, AAGUID e um apelido com a data. Não há segredo para guardar: tudo o que o servidor tem é público.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "O que falha e o que olhar",
        colunas: ["Sintoma", "Causa provável e verificação"],
        linhas: [
          [
            "`SecurityError` no navegador",
            "O `rp.id` não é o domínio da página nem um sufixo registrável dele, ou a página não está em contexto seguro (HTTPS; `localhost` é exceção). Confira o `rp.id` e o endereço real.",
          ],
          [
            "`NotAllowedError`",
            "A pessoa cancelou, o tempo acabou ou a chamada não veio de um gesto do usuário. Não é ataque nem erro do servidor: ofereça tentar de novo.",
          ],
          [
            "`InvalidStateError`",
            "O autenticador já tem uma credencial listada em `excludeCredentials`: o usuário já registrou este dispositivo.",
          ],
          [
            "Servidor: o challenge não confere",
            "Sessão perdida, challenge expirado ou reutilizado, ou cliques repetidos gerando vários challenges. Guarde um challenge por tentativa e invalide-o ao usar.",
          ],
          [
            "Servidor: origem ou hash do `rpId` não confere",
            "Proxy, domínio ou porta diferente do esperado, subdomínio fora da lista ou aplicativo móvel com origem própria. Ajuste a lista de origens esperadas.",
          ],
          [
            "Servidor: verificação ou atestação recusada",
            "Autenticador sem PIN ou biometria quando você exigiu verificação, formato de atestação desconhecido ou modelo fora da lista. Use `attestation: none` salvo necessidade real.",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Atestação, em poucas palavras",
        texto:
          "**Atestação** (`attestation`) é a prova, assinada pelo fabricante, de qual modelo de autenticador criou a chave. Quase sempre `none` basta: você só precisa saber que a chave existe e é única. Peça atestação direta ou corporativa só quando uma política exigir modelos certificados (ambientes regulados) e trate-a como dado de privacidade, porque ela identifica o tipo de dispositivo. O que protege contra phishing não é a atestação, e sim a checagem de origem e de `rpId` (veja Q96).",
      },
    ],
    armadilhas: [
      "Reutilizar o challenge ou gerá-lo sem aleatoriedade segura: abre a porta ao replay.",
      "Validar só o formato e esquecer origem e hash do `rpId`: a proteção contra phishing está nessas conferências.",
      "Usar o e-mail ou outro dado pessoal como `user.id`: ele é um identificador opaco que o autenticador guarda.",
      "Permitir uma única credencial por conta: se o aparelho se perde, sobra a recuperação, que é o elo fraco. Estimule uma segunda credencial.",
    ],
    autoteste: [
      {
        pergunta: "O que o servidor guarda depois do registro e por que isso não é um segredo?",
        resposta:
          "Credential id, chave pública, contador e metadados. A chave privada fica no autenticador, então o vazamento do banco não permite fazer login.",
      },
      {
        pergunta: "Por que o challenge precisa ser aleatório, de uso único e guardado no servidor?",
        resposta:
          "Porque ele garante que a resposta foi criada agora, para esta tentativa. Um challenge previsível ou reaproveitável permitiria repetir uma resposta antiga.",
      },
    ],
  },
  en: {
    titulo: "WebAuthn registration ceremony",
    pergunta:
      "Walk through the WebAuthn registration ceremony step by step. What does the server send, what does the authenticator create, and what does the server validate and store?",
    porqueEsteMetodo:
      "In registration, the data passes through several hands (server, page, browser, authenticator) and it is easy to lose the thread. Following one single enrollment, and seeing what fails at each point, shows what the server must check and keep.",
    resposta30s:
      "The server generates a random **challenge** and the **options** (`rpId`, user, algorithms), and the page calls `navigator.credentials.create`. The authenticator, after verifying the user, **creates a key pair bound to the `rpId`** and returns the `attestationObject` and the `clientDataJSON`. The server validates **challenge, origin and `rpId`** and stores the **public key, the credential id and the counter**; the private key never leaves the authenticator.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Registration, start to finish",
        etapas: [
          "The person asks to create a passkey. The server generates a random single-use `challenge`, stores it with a short expiry and returns the creation options (`rp.id`, user data, accepted algorithms, user-verification requirement)",
          "The page calls `navigator.credentials.create({ publicKey: options })`",
          "The browser checks that `rp.id` matches the page’s origin (the current domain or a registrable suffix of it, in a secure context), builds the `clientDataJSON` with `type: webauthn.create`, the challenge and the real origin, and computes its hash",
          "The authenticator (a platform one or an external key, over CTAP) asks for presence and user verification: touch, PIN or biometric",
          "The authenticator generates a **new key pair, bound to the hash of the `rpId`**, keeps the private key and assembles the `authenticatorData` (hash of the `rpId`, flags, counter, credential id and public key in COSE format) inside the `attestationObject`",
          "The browser returns the credential `id`, the `clientDataJSON` and the `attestationObject` to the page",
          "The page sends everything to the server, which validates and stores it",
        ],
        nota: "The private key never appears in this flow. What travels back is only the public half, plus the proof that the authenticator created it for this `rpId` and this attempt.",
      },
      {
        tipo: "codigo",
        titulo: "What the server sends: creation options",
        legenda: "JSON",
        codigo: `{
  "challenge": "kQ3vP9xT1mZ8yR2aLw5cHn7uJd4sBf6EoGiVtX0pY1U",
  "rp": { "id": "example.com", "name": "Example" },
  "user": { "id": "dXNyXzQyMQ", "name": "ana@example.com", "displayName": "Ana" },
  "pubKeyCredParams": [
    { "type": "public-key", "alg": -7 },
    { "type": "public-key", "alg": -257 }
  ],
  "authenticatorSelection": { "residentKey": "preferred", "userVerification": "preferred" },
  "excludeCredentials": [],
  "attestation": "none",
  "timeout": 300000
}`,
        nota: "`challenge` and `user.id` are base64url. The challenge must be random (at least 16 bytes; use 32), single-use and stored on the server with a short expiry. `alg` is the COSE algorithm identifier: -7 is ES256 and -257 is RS256. `user.id` is an opaque identifier, never the e-mail. `excludeCredentials` lists credentials already registered, so the authenticator does not create a duplicate.",
      },
      {
        tipo: "passos",
        titulo: "What the server validates and stores, in this order",
        passos: [
          {
            titulo: "Challenge and type",
            texto:
              "Reads the `clientDataJSON` and checks that the `challenge` is the one it issued for this session, still valid and unused, and that `type` is `webauthn.create`. Then it discards the challenge.",
          },
          {
            titulo: "Origin",
            texto: "Checks that `origin` is in the list of expected origins (scheme, host and port, exact comparison).",
          },
          {
            titulo: "`rpId`",
            texto:
              "Decodes the `attestationObject` (CBOR), extracts the `authenticatorData` and checks that the `rpId` hash inside it is the SHA-256 of its own `rpId`.",
          },
          {
            titulo: "Flags",
            texto:
              "Checks that the user-presence bit is set and, if you required it, the user-verification bit. It also records the backup bits, which say whether the credential is syncable.",
          },
          {
            titulo: "Attestation",
            texto:
              "With `attestation: none`, there is nothing to verify. If you asked for attestation, it validates the format and the certificate chain against the manufacturer’s metadata and decides whether to accept that model.",
          },
          {
            titulo: "Extract the credential",
            texto:
              "Reads the credential id, the algorithm and the public key (COSE format) from the `authenticatorData` and checks that the credential id is not already registered.",
          },
          {
            titulo: "Store",
            texto:
              "Saves, tied to the user: credential id (unique and indexed), public key, counter, `transports`, backup flags, AAGUID and a nickname with the date. There is no secret to keep: everything the server has is public.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "What fails and what to look at",
        colunas: ["Symptom", "Likely cause and what to check"],
        linhas: [
          [
            "`SecurityError` in the browser",
            "`rp.id` is not the page’s domain or a registrable suffix of it, or the page is not in a secure context (HTTPS; `localhost` is an exception). Check `rp.id` and the real address.",
          ],
          [
            "`NotAllowedError`",
            "The person canceled, time ran out or the call did not come from a user gesture. It is neither an attack nor a server error: offer to try again.",
          ],
          [
            "`InvalidStateError`",
            "The authenticator already holds a credential listed in `excludeCredentials`: the user already registered this device.",
          ],
          [
            "Server: the challenge does not match",
            "Lost session, expired or reused challenge, or repeated clicks creating several challenges. Keep one challenge per attempt and invalidate it on use.",
          ],
          [
            "Server: origin or `rpId` hash does not match",
            "A proxy, a different domain or port than expected, a subdomain missing from the list or a mobile app with its own origin. Adjust the list of expected origins.",
          ],
          [
            "Server: verification or attestation refused",
            "An authenticator without PIN or biometric when you required verification, an unknown attestation format or a model outside the list. Use `attestation: none` unless you really need more.",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Attestation, in a few words",
        texto:
          "**Attestation** (`attestation`) is proof, signed by the manufacturer, of which authenticator model created the key. `none` almost always suffices: you only need to know the key exists and is unique. Ask for direct or enterprise attestation only when a policy requires certified models (regulated environments), and treat it as privacy-relevant data, because it identifies the device type. What protects against phishing is not attestation but the origin and `rpId` checks (see Q96).",
      },
    ],
    armadilhas: [
      "Reusing the challenge or generating it without secure randomness: it opens the door to replay.",
      "Validating only the format and forgetting the origin and `rpId` hash: the phishing protection lives in those checks.",
      "Using the e-mail or other personal data as `user.id`: it is an opaque identifier that the authenticator stores.",
      "Allowing a single credential per account: if the device is lost, recovery is all that is left, and that is the weak link. Encourage a second credential.",
    ],
    autoteste: [
      {
        pergunta: "What does the server store after registration, and why is it not a secret?",
        resposta:
          "Credential id, public key, counter and metadata. The private key stays on the authenticator, so a database leak does not allow anyone to log in.",
      },
      {
        pergunta: "Why must the challenge be random, single-use and stored on the server?",
        resposta:
          "Because it guarantees the response was created now, for this attempt. A predictable or reusable challenge would allow an old response to be replayed.",
      },
    ],
  },
};
