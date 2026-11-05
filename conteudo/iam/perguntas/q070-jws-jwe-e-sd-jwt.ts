import type { Pergunta } from "../../tipos";

// Q70 · JWS, JWE e SD-JWT
export const q070: Pergunta = {
  numero: 70,
  modulo: "tokens-e-sessoes",
  metodo: "compare",
  pt: {
    titulo: "JWS, JWE e SD-JWT",
    pergunta:
      "Compare JWS e JWE, e explique onde entra o SD-JWT. Quando assinar, quando criptografar e quando divulgar claims seletivamente?",
    porqueEsteMetodo:
      "JWS, JWE e SD-JWT parecem variações da mesma coisa, mas cada um garante algo diferente: autenticidade, sigilo ou revelação parcial. A matriz os coloca lado a lado, e a regra de decisão aponta qual usar.",
    resposta30s:
      "O **JWS** assina (**integridade e autenticidade**, conteúdo legível), o **JWE** criptografa (**confidencialidade**; quem precisa dos dois **assina primeiro e criptografa depois**, num JWT aninhado) e o **SD-JWT** é um JWS em que as claims ocultáveis viram hashes e o **titular escolhe quais revelar** a cada verificador, como numa credencial verificável. **Assine por padrão; criptografe só quando o conteúdo precisa ficar escondido de quem carrega o token; use SD-JWT quando o titular decide o que mostrar.**",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Quatro formatos, quatro garantias",
        colunas: ["Formato", "O que garante", "Quem lê o conteúdo", "Como funciona", "Quando usar"],
        linhas: [
          [
            "JWS (assinado, RFC 7515)",
            "Integridade e autenticidade: não foi alterado e foi emitido por quem tem a chave",
            "Qualquer portador (é base64url)",
            "Três segmentos; a assinatura cobre header e payload, com HMAC ou chave privada (veja Q71)",
            "O caso comum: access tokens e ID tokens cujo conteúdo não é segredo",
          ],
          [
            "JWE (criptografado, RFC 7516)",
            "Confidencialidade e integridade (cifra autenticada). Não prova quem o criou, pois qualquer um pode criptografar para uma chave pública",
            "Só quem tem a chave de decifrar",
            "Cinco segmentos; uma chave de conteúdo aleatória cifra o payload, e essa chave é cifrada para o destinatário (`alg` escolhe como, `enc` escolhe a cifra)",
            "Quando o conteúdo precisa ficar escondido de quem carrega ou transporta o token, além do TLS",
          ],
          [
            "JWT aninhado (assina e depois criptografa)",
            "Autenticidade, integridade e confidencialidade",
            "Só o destinatário, que decifra e depois verifica a assinatura interna",
            "Um JWS dentro de um JWE (header `cty` com valor `JWT`)",
            "Quando se precisa dos dois, como um ID token entregue cifrado a um cliente",
          ],
          [
            "SD-JWT (divulgação seletiva)",
            "Autenticidade e integridade do que foi revelado; o titular escolhe quais claims mostrar",
            "O verificador vê só o que o titular enviou; o resto fica como hash",
            "O emissor assina um JWS com os hashes (`_sd`) das claims ocultáveis; cada claim vai numa “disclosure” (sal, nome, valor) que o titular envia se quiser, separadas por `~`",
            "Credenciais verificáveis e carteiras de identidade: provar uma ou duas claims sem entregar o documento inteiro",
          ],
        ],
        nota: "O SD-JWT é um padrão do IETF (veja a RFC correspondente e a especificação da credencial que você usa). Na apresentação pode haver um JWT de vínculo com a chave do titular (key binding), para que o token roubado não sirva a outra pessoa.",
      },
      {
        tipo: "codigo",
        titulo: "Como o SD-JWT esconde uma claim",
        legenda: "JSON",
        codigo: `// Payload assinado pelo emissor: só o hash da claim ocultável
{
  "iss": "https://emissor.exemplo.gov",
  "iat": 1793000000,
  "_sd": ["<hash da disclosure 1>", "<hash da disclosure 2>"],
  "_sd_alg": "sha-256"
}

// Disclosure 1 (JSON em base64url): [sal aleatório, nome, valor]
["<sal>", "data_nascimento", "1990-05-17"]

// O titular envia: JWT-do-emissor~disclosure(s) escolhida(s)~
// Quem não recebe a disclosure só vê o hash e não consegue adivinhar o valor.`,
        nota: "O verificador recalcula o hash de cada disclosure recebida e confere se ele consta em `_sd`, dentro do JWT assinado. O sal aleatório impede adivinhar valores previsíveis a partir do hash.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "**Assine sempre; criptografe quando precisar; divulgue seletivamente quando o titular decide.** O conteúdo pode ser lido por quem carrega o token e não tem nada sensível? JWS basta. Há dado que o portador, o navegador ou um intermediário não devem ver, e o TLS não cobre esse trecho? JWE (ou, melhor ainda, guarde o dado no servidor e emita um token opaco, veja Q74). O mesmo token precisa ser autêntico e sigiloso? JWT aninhado. Um titular vai apresentar a verificadores diferentes, e cada um deve ver só o necessário? SD-JWT.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Criptografar não substitui assinar",
        texto:
          "Quem tem a chave pública do destinatário consegue criar um JWE válido, então o JWE sozinho **não prova a origem**: para tokens de acesso, assine, e criptografe a mais, se for o caso. O JWE tem custo: gestão das chaves de decifrar, mais CPU, tokens maiores e opacos para gateways e logs, que deixam de inspecionar as claims. Evite algoritmos de gestão de chave desaconselhados, como `RSA1_5`, e siga as recomendações da RFC 8725 e da documentação da biblioteca. No SD-JWT, cada disclosure aumenta o tamanho, e hashes iguais entre apresentações permitem correlacionar o titular; avalie isso quando a privacidade for o objetivo.",
      },
    ],
    armadilhas: [
      "Achar que um JWT é sigiloso porque está assinado: o JWS não esconde nada.",
      "Usar JWE com a chave pública do destinatário, sem assinar, e confiar na origem: qualquer pessoa pode criptografar para essa chave.",
      "Criptografar o token e esquecer que o cliente ou o gateway não consegue mais ler `exp`, `aud` e `scope`; defina quem decifra e quem precisa ler.",
      "Escolher SD-JWT sem o modelo emissor, titular e verificador: ele só faz sentido quando o titular guarda a credencial e a apresenta (uma carteira).",
    ],
    autoteste: [
      {
        pergunta: "Por que um JWE sozinho não basta para autenticar quem enviou?",
        resposta:
          "Porque o JWE é criptografado para a chave pública do destinatário, que é pública: qualquer pessoa pode produzir um. Para provar a origem é preciso assinar (JWS), e para ter os dois, assinar primeiro e depois criptografar.",
      },
      {
        pergunta: "Como o SD-JWT permite revelar só algumas claims sem quebrar a assinatura?",
        resposta:
          "O emissor assina um JWT que contém apenas os hashes das claims ocultáveis. Cada claim fica numa disclosure separada, e o verificador recalcula o hash das disclosures recebidas e compara com a lista assinada; as não enviadas continuam escondidas.",
      },
    ],
  },
  en: {
    titulo: "JWS, JWE and SD-JWT",
    pergunta:
      "Compare JWS and JWE, and explain where SD-JWT fits. When do you sign, when do you encrypt, and when do you disclose claims selectively?",
    porqueEsteMetodo:
      "JWS, JWE and SD-JWT look like variations of the same thing, but each guarantees something different: authenticity, secrecy or partial disclosure. The matrix puts them side by side, and the decision rule says which to use.",
    resposta30s:
      "**JWS** signs (**integrity and authenticity**, readable content), **JWE** encrypts (**confidentiality**; whoever needs both **signs first and encrypts afterwards**, in a nested JWT) and **SD-JWT** is a JWS in which the hideable claims become hashes and the **holder chooses which to reveal** to each verifier, as in a verifiable credential. **Sign by default; encrypt only when the content must stay hidden from whoever carries the token; use SD-JWT when the holder decides what to show.**",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Four formats, four guarantees",
        colunas: ["Format", "What it guarantees", "Who reads the content", "How it works", "When to use it"],
        linhas: [
          [
            "JWS (signed, RFC 7515)",
            "Integrity and authenticity: it was not altered and was issued by whoever has the key",
            "Any bearer (it is base64url)",
            "Three segments; the signature covers header and payload, with HMAC or a private key (see Q71)",
            "The common case: access tokens and ID tokens whose content is not secret",
          ],
          [
            "JWE (encrypted, RFC 7516)",
            "Confidentiality and integrity (authenticated cipher). It does not prove who created it, since anyone can encrypt to a public key",
            "Only whoever has the decryption key",
            "Five segments; a random content key encrypts the payload, and that key is encrypted for the recipient (`alg` chooses how, `enc` chooses the cipher)",
            "When the content must stay hidden from whoever carries or transports the token, beyond TLS",
          ],
          [
            "Nested JWT (sign, then encrypt)",
            "Authenticity, integrity and confidentiality",
            "Only the recipient, who decrypts and then verifies the inner signature",
            "A JWS inside a JWE (header `cty` with the value `JWT`)",
            "When you need both, such as an ID token delivered encrypted to a client",
          ],
          [
            "SD-JWT (selective disclosure)",
            "Authenticity and integrity of what was revealed; the holder chooses which claims to show",
            "The verifier sees only what the holder sent; the rest stays as hashes",
            "The issuer signs a JWS with the hashes (`_sd`) of the hideable claims; each claim goes in a “disclosure” (salt, name, value) that the holder sends if they wish, separated by `~`",
            "Verifiable credentials and identity wallets: proving one or two claims without handing over the whole document",
          ],
        ],
        nota: "SD-JWT is an IETF standard (see the corresponding RFC and the specification of the credential you use). A presentation may include a key-binding JWT tied to the holder’s key, so a stolen token is useless to someone else.",
      },
      {
        tipo: "codigo",
        titulo: "How SD-JWT hides a claim",
        legenda: "JSON",
        codigo: `// Payload signed by the issuer: only the hash of the hideable claim
{
  "iss": "https://issuer.example.gov",
  "iat": 1793000000,
  "_sd": ["<hash of disclosure 1>", "<hash of disclosure 2>"],
  "_sd_alg": "sha-256"
}

// Disclosure 1 (JSON in base64url): [random salt, name, value]
["<salt>", "birth_date", "1990-05-17"]

// The holder sends: issuer-JWT~chosen-disclosure(s)~
// Whoever does not receive the disclosure sees only the hash and cannot guess the value.`,
        nota: "The verifier recomputes the hash of each disclosure received and checks that it appears in `_sd`, inside the signed JWT. The random salt prevents guessing predictable values from the hash.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "**Always sign; encrypt when you must; disclose selectively when the holder decides.** Can the content be read by whoever carries the token, and holds nothing sensitive? JWS is enough. Is there data the bearer, the browser or an intermediary must not see, and TLS does not cover that stretch? JWE (or, better still, keep the data on the server and issue an opaque token, see Q74). Must the same token be both authentic and secret? Nested JWT. Will a holder present to different verifiers, each of which should see only what it needs? SD-JWT.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Encrypting does not replace signing",
        texto:
          "Whoever has the recipient’s public key can create a valid JWE, so a JWE alone **does not prove the origin**: for access tokens, sign, and add encryption on top if needed. JWE has a cost: management of the decryption keys, more CPU, larger tokens that are opaque to gateways and logs, which can no longer inspect the claims. Avoid discouraged key-management algorithms such as `RSA1_5`, and follow the recommendations of RFC 8725 and of your library’s documentation. In SD-JWT, each disclosure adds size, and identical hashes across presentations allow the holder to be correlated; weigh that when privacy is the goal.",
      },
    ],
    armadilhas: [
      "Believing a JWT is confidential because it is signed: JWS hides nothing.",
      "Using JWE with the recipient’s public key, without signing, and trusting the origin: anyone can encrypt to that key.",
      "Encrypting the token and forgetting that the client or the gateway can no longer read `exp`, `aud` and `scope`; decide who decrypts and who needs to read.",
      "Choosing SD-JWT without the issuer, holder and verifier model: it only makes sense when the holder keeps the credential and presents it (a wallet).",
    ],
    autoteste: [
      {
        pergunta: "Why is a JWE alone not enough to authenticate the sender?",
        resposta:
          "Because a JWE is encrypted to the recipient’s public key, and that key is public: anyone can produce one. To prove the origin you must sign (JWS), and to have both, sign first and then encrypt.",
      },
      {
        pergunta: "How does SD-JWT let you reveal only some claims without breaking the signature?",
        resposta:
          "The issuer signs a JWT that contains only the hashes of the hideable claims. Each claim sits in a separate disclosure, and the verifier recomputes the hash of the disclosures received and compares it with the signed list; the ones not sent stay hidden.",
      },
    ],
  },
};
