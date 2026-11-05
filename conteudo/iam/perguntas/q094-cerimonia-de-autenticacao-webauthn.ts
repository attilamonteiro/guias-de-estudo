import type { Pergunta } from "../../tipos";

// Q94 · Cerimônia de autenticação WebAuthn
export const q094: Pergunta = {
  numero: 94,
  modulo: "mfa-e-passkeys",
  metodo: "trace",
  pt: {
    titulo: "Cerimônia de autenticação WebAuthn",
    pergunta:
      "Descreva passo a passo a cerimônia de autenticação do WebAuthn. Como o challenge, a assinatura e a verificação de origem provam que o usuário é quem diz ser?",
    porqueEsteMetodo:
      "A autenticação é uma troca curta de desafio e resposta em que cada campo prova uma coisa diferente. Seguir um login do pedido até a sessão mostra o que cada verificação impede, inclusive o replay.",
    resposta30s:
      "O servidor envia um **challenge** novo e as credenciais permitidas, a página chama `navigator.credentials.get`, e o autenticador, depois da verificação do usuário, **assina o `authenticatorData` e o hash do `clientDataJSON`** com a chave privada do `rpId`. O servidor confere a **assinatura** com a chave pública, o **challenge**, a **origem**, o **`rpId`**, as flags e o **contador**. Isso prova a posse da chave, que a resposta é recente e que veio do site certo, sem enviar segredo nenhum.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Um login, passo a passo",
        etapas: [
          "A pessoa escolhe entrar. O servidor gera um `challenge` aleatório de uso único, guarda-o com validade curta e devolve as opções: `rpId`, `allowCredentials` (os credential ids do usuário) e `userVerification`",
          "A página chama `navigator.credentials.get({ publicKey: opcoes })`",
          "O navegador confere se o `rpId` combina com a origem da página, monta o `clientDataJSON` com `type: webauthn.get`, o challenge e a origem real, e calcula seu hash",
          "O autenticador localiza a credencial daquele `rpId` e pede presença e verificação do usuário (toque, PIN ou biometria)",
          "Ele assina o `authenticatorData` seguido do hash do `clientDataJSON` com a chave privada e atualiza o contador, se tiver um",
          "O navegador devolve `id`, `clientDataJSON`, `authenticatorData`, `signature` e, nas credenciais descobríveis, o `userHandle`",
          "A página envia tudo ao servidor, que verifica e, estando tudo certo, abre a sessão",
        ],
      },
      {
        tipo: "passos",
        titulo: "O que o servidor verifica, nesta ordem",
        passos: [
          {
            titulo: "Credencial",
            texto:
              "Localiza a credencial pelo `id` e carrega a chave pública. Com o `userHandle`, confere que o dono dela é quem se espera (ou o identifica, no login sem usuário).",
          },
          {
            titulo: "Challenge e tipo",
            texto:
              "O `challenge` do `clientDataJSON` é o emitido, ainda dentro do prazo e não usado, e `type` é `webauthn.get`. Depois de usar, invalida.",
          },
          {
            titulo: "Origem e `rpId`",
            texto:
              "A `origin` está na lista esperada e o hash do `rpId` no `authenticatorData` é o SHA-256 do seu `rpId`.",
          },
          {
            titulo: "Flags",
            texto: "Presença do usuário ligada e, se a política exigir, verificação do usuário.",
          },
          {
            titulo: "Assinatura",
            texto:
              "Verifica a `signature` com a chave pública guardada, sobre os bytes do `authenticatorData` seguidos do SHA-256 do `clientDataJSON`.",
          },
          {
            titulo: "Contador",
            texto:
              "Se o contador guardado ou o novo for diferente de zero, o novo precisa ser maior que o guardado; do contrário, há sinal de clone ou replay: recuse ou alerte. Se passar, atualize o valor. Passkeys sincronizadas costumam manter 0 nos dois, o que é normal.",
          },
          {
            titulo: "Sessão",
            texto: "Só então emite a sessão (cookie ou token) e descarta o challenge.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A assinatura cobre bytes que o servidor reconstrói",
        legenda: "TypeScript",
        codigo: `import { createHash, createPublicKey, verify, type JsonWebKey } from "node:crypto";

// A chave pública (JWK, ES256) vem do que foi guardado no registro
export function assinaturaValida(
  chavePublica: JsonWebKey,
  authenticatorData: Buffer,
  clientDataJSON: Buffer,
  assinatura: Buffer,
): boolean {
  const chave = createPublicKey({ key: chavePublica, format: "jwk" });
  const hashDoCliente = createHash("sha256").update(clientDataJSON).digest();
  const assinado = Buffer.concat([authenticatorData, hashDoCliente]);
  return verify("sha256", assinado, chave, assinatura); // ES256: assinatura em DER
}`,
        nota: "Em produção, use uma biblioteca de WebAuthn mantida (por exemplo, `@simplewebauthn/server` em TypeScript ou a Fido2NetLib em C#), que converte a chave COSE, trata todos os algoritmos e cobre os casos de borda. O trecho só mostra o que a assinatura cobre.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Por que isso prova quem é você",
        texto:
          "Três provas se somam. A **assinatura** prova a posse da chave privada, que só o autenticador tem. O **challenge** novo prova que a resposta foi gerada agora, para esta tentativa. A **origem** e o **`rpId`** dentro do que foi assinado provam que a assinatura foi feita para o seu site e não para um imitador. A **verificação do usuário** (PIN ou biometria) acrescenta que quem estava com o autenticador era a pessoa. Nada do que viaja serve em outro lugar ou em outra hora.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Login sem usuário e replay",
        texto:
          "No login **sem usuário** (passkeys descobríveis), o servidor envia `allowCredentials` vazio, o navegador mostra as credenciais daquele `rpId`, a pessoa escolhe, e o `userHandle` na resposta diz de quem é: o servidor então busca a credencial e confere que ela pertence a esse usuário. Quanto ao **replay**, uma resposta capturada não funciona: o challenge é novo a cada tentativa e é invalidado ao ser usado, a origem assinada não muda, e o contador (quando existe) denuncia credencial clonada. Sem um challenge guardado e de uso único no servidor, nada disso vale.",
      },
    ],
    armadilhas: [
      "Não invalidar o challenge depois do uso, ou aceitar um challenge enviado pelo cliente: o replay volta a funcionar.",
      "Tratar contador zero como erro: passkeys sincronizadas costumam não usar contador. Compare só quando houver valor maior que zero.",
      "Aceitar a credencial só pelo `id`, sem checar que ela pertence ao usuário esperado (principalmente no login descobrível).",
      "Esquecer de exigir verificação do usuário em ações sensíveis: sem ela, a prova é só de posse (presença).",
    ],
    autoteste: [
      {
        pergunta: "Que campos fazem a prova de identidade e o que cada um impede?",
        resposta:
          "O challenge impede replay; a assinatura impede que quem não tem a chave privada se passe pelo usuário; e a origem com o `rpId` impede que uma resposta feita para um site falso sirva no verdadeiro.",
      },
      {
        pergunta: "Como funciona o login sem usuário?",
        resposta:
          "O servidor envia `allowCredentials` vazio, o autenticador oferece as credenciais descobríveis daquele `rpId`, e a resposta traz o `userHandle`, com o qual o servidor identifica o usuário e confere a credencial.",
      },
    ],
  },
  en: {
    titulo: "WebAuthn authentication ceremony",
    pergunta:
      "Walk through the WebAuthn authentication ceremony step by step. How do the challenge, the signature and origin verification prove the user is who they claim to be?",
    porqueEsteMetodo:
      "Authentication is a short challenge-and-response exchange in which each field proves something different. Following one login from request to session shows what each check prevents, replay included.",
    resposta30s:
      "The server sends a fresh **challenge** and the allowed credentials, the page calls `navigator.credentials.get`, and the authenticator, after user verification, **signs the `authenticatorData` and the hash of the `clientDataJSON`** with the private key for the `rpId`. The server checks the **signature** with the public key, the **challenge**, the **origin**, the **`rpId`**, the flags and the **counter**. That proves possession of the key, that the response is recent and that it came from the right site, without sending any secret.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One login, step by step",
        etapas: [
          "The person chooses to sign in. The server generates a random single-use `challenge`, stores it with a short expiry and returns the options: `rpId`, `allowCredentials` (the user’s credential ids) and `userVerification`",
          "The page calls `navigator.credentials.get({ publicKey: options })`",
          "The browser checks that the `rpId` matches the page’s origin, builds the `clientDataJSON` with `type: webauthn.get`, the challenge and the real origin, and computes its hash",
          "The authenticator finds the credential for that `rpId` and asks for presence and user verification (touch, PIN or biometric)",
          "It signs the `authenticatorData` followed by the hash of the `clientDataJSON` with the private key and updates the counter, if it has one",
          "The browser returns `id`, `clientDataJSON`, `authenticatorData`, `signature` and, for discoverable credentials, the `userHandle`",
          "The page sends everything to the server, which verifies it and, if all is well, opens the session",
        ],
      },
      {
        tipo: "passos",
        titulo: "What the server verifies, in this order",
        passos: [
          {
            titulo: "Credential",
            texto:
              "Looks up the credential by `id` and loads the public key. With the `userHandle`, it checks that the owner is who is expected (or identifies them, in a username-less login).",
          },
          {
            titulo: "Challenge and type",
            texto:
              "The `challenge` in the `clientDataJSON` is the one issued, still within its time limit and unused, and `type` is `webauthn.get`. After use, it invalidates it.",
          },
          {
            titulo: "Origin and `rpId`",
            texto:
              "The `origin` is in the expected list and the `rpId` hash in the `authenticatorData` is the SHA-256 of its own `rpId`.",
          },
          {
            titulo: "Flags",
            texto: "User presence set and, if the policy requires it, user verification.",
          },
          {
            titulo: "Signature",
            texto:
              "Verifies the `signature` with the stored public key, over the bytes of the `authenticatorData` followed by the SHA-256 of the `clientDataJSON`.",
          },
          {
            titulo: "Counter",
            texto:
              "If either the stored counter or the new one is non-zero, the new one must be greater than the stored one; otherwise there is a sign of a clone or a replay: refuse or alert. If it passes, update the value. Synced passkeys often stay at 0 on both sides, which is normal.",
          },
          {
            titulo: "Session",
            texto: "Only then does it issue the session (cookie or token) and discard the challenge.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The signature covers bytes the server rebuilds",
        legenda: "TypeScript",
        codigo: `import { createHash, createPublicKey, verify, type JsonWebKey } from "node:crypto";

// The public key (JWK, ES256) comes from what was stored at registration
export function signatureIsValid(
  publicKey: JsonWebKey,
  authenticatorData: Buffer,
  clientDataJSON: Buffer,
  signature: Buffer,
): boolean {
  const key = createPublicKey({ key: publicKey, format: "jwk" });
  const clientHash = createHash("sha256").update(clientDataJSON).digest();
  const signed = Buffer.concat([authenticatorData, clientHash]);
  return verify("sha256", signed, key, signature); // ES256: DER-encoded signature
}`,
        nota: "In production, use a maintained WebAuthn library (for example, `@simplewebauthn/server` in TypeScript or Fido2NetLib in C#), which converts the COSE key, handles every algorithm and covers the edge cases. The snippet only shows what the signature covers.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Why this proves who you are",
        texto:
          "Three proofs add up. The **signature** proves possession of the private key, which only the authenticator holds. The fresh **challenge** proves the response was generated now, for this attempt. The **origin** and the **`rpId`** inside what was signed prove the signature was made for your site and not for an imitator. **User verification** (PIN or biometric) adds that whoever held the authenticator was the person. Nothing that travels is useful in another place or at another time.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Username-less login and replay",
        texto:
          "In **username-less** login (discoverable passkeys), the server sends an empty `allowCredentials`, the browser shows the credentials for that `rpId`, the person picks one, and the `userHandle` in the response says whose it is: the server then looks up the credential and checks that it belongs to that user. As for **replay**, a captured response does not work: the challenge is new each attempt and invalidated when used, the signed origin does not change, and the counter (when present) reveals a cloned credential. Without a stored, single-use challenge on the server, none of this holds.",
      },
    ],
    armadilhas: [
      "Not invalidating the challenge after use, or accepting a challenge sent by the client: replay works again.",
      "Treating a zero counter as an error: synced passkeys often do not use a counter. Compare only when the value is greater than zero.",
      "Accepting the credential by `id` alone, without checking it belongs to the expected user (mainly in discoverable login).",
      "Forgetting to require user verification for sensitive actions: without it, the proof is only possession (presence).",
    ],
    autoteste: [
      {
        pergunta: "Which fields make up the proof of identity, and what does each one prevent?",
        resposta:
          "The challenge prevents replay; the signature prevents someone without the private key from posing as the user; and the origin with the `rpId` prevents a response made for a fake site from working on the real one.",
      },
      {
        pergunta: "How does username-less login work?",
        resposta:
          "The server sends an empty `allowCredentials`, the authenticator offers the discoverable credentials for that `rpId`, and the response carries the `userHandle`, which the server uses to identify the user and check the credential.",
      },
    ],
  },
};
