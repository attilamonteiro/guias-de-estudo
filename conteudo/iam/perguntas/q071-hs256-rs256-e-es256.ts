import type { Pergunta } from "../../tipos";

// Q71 · HS256, RS256 e ES256
export const q071: Pergunta = {
  numero: 71,
  modulo: "tokens-e-sessoes",
  metodo: "compare",
  pt: {
    titulo: "HS256, RS256 e ES256",
    pergunta:
      "Compare HS256, RS256 e ES256 (e EdDSA) para assinar JWTs. Qual escolher para um emissor com muitas APIs consumidoras e por quê?",
    porqueEsteMetodo:
      "Escolher o algoritmo é escolher quem pode assinar e quem pode verificar. A matriz mostra o que cada um implica na distribuição de chaves, e a regra de decisão responde à pergunta do emissor com muitas APIs.",
    resposta30s:
      "O **HS256** é simétrico: a mesma chave secreta assina e verifica, então toda API que valida também consegue **forjar** tokens. **RS256**, **ES256** e **EdDSA** são assimétricos: a **chave privada fica só no emissor** e as APIs recebem a **chave pública** (por JWKS). Para um emissor com muitas APIs, escolha **assimétrico**: RS256 pela compatibilidade ampla, ou ES256 (ou EdDSA) para assinaturas menores e rápidas, sempre com o **algoritmo fixado pelo servidor** na verificação.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Os algoritmos lado a lado",
        colunas: [
          "Algoritmo",
          "Tipo e chave",
          "Quem assina e quem verifica",
          "Assinatura e custo",
          "Suporte e observações",
        ],
        linhas: [
          [
            "HS256",
            "Simétrico: HMAC com SHA-256 e um segredo compartilhado",
            "Quem sabe o segredo faz as duas coisas: todo verificador também pode assinar",
            "32 bytes; o mais barato de calcular",
            "Suportado em tudo. Serve quando quem emite e quem valida são o mesmo serviço. O segredo deve ser aleatório e ter pelo menos 256 bits",
          ],
          [
            "RS256",
            "Assimétrico: RSA (PKCS#1 v1.5) com SHA-256; chaves de 2048 bits ou mais",
            "Só o emissor assina (chave privada); qualquer um verifica (chave pública)",
            "Do tamanho da chave (256 bytes com RSA de 2048 bits); verificar é rápido, e assinar é mais lento que nas curvas elípticas",
            "O mais compatível: é o padrão em muitos provedores e bibliotecas. O `PS256` (RSA-PSS) é a variante com preenchimento probabilístico",
          ],
          [
            "ES256",
            "Assimétrico: ECDSA na curva P-256 com SHA-256",
            "Como no RS256",
            "64 bytes, tamanho fixo; assinar e verificar são rápidos; chaves pequenas",
            "Amplamente suportado hoje; confira o suporte nos clientes e dispositivos que você precisa atender",
          ],
          [
            "EdDSA (Ed25519)",
            "Assimétrico: curva de Edwards (Ed25519), assinatura determinística",
            "Como no RS256",
            "64 bytes; rápido, com chaves pequenas",
            "Suporte ainda irregular em bibliotecas e provedores. Veja a observação sobre o nome do algoritmo abaixo",
          ],
        ],
        nota: "Tamanhos e velocidades são ordens de grandeza; meça com a sua biblioteca e o seu hardware se isso importar. Nas APIs, a verificação é barata em todos os casos; no emissor, o que mais pesa é o custo de assinar.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "**Vários verificadores, assimétrico.** Com HS256, cada API guarda o segredo que também emite tokens: basta uma ser comprometida (ou o segredo cair num log) para alguém forjar tokens aceitos por todas. Com chave assimétrica, a privada fica só no emissor (de preferência num cofre de chaves ou HSM), as APIs só têm a pública e a rotação se faz por `kid` no JWKS (veja Q73). Entre as assimétricas, escolha **RS256 pela interoperabilidade** (é o que todo provedor e biblioteca entendem) e **ES256 ou EdDSA** quando você controla os consumidores e quer assinaturas menores. HS256 só quando emissor e validador são o mesmo serviço, com um segredo forte.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Por que o nome `EdDSA` foi aposentado",
        texto:
          "No JOSE, `EdDSA` é um identificador **polimórfico**: o mesmo nome cobre Ed25519 e Ed448, e quem verifica precisa olhar a curva da chave (`crv`) para saber qual algoritmo é. A RFC 9864, citada na pergunta, define identificadores **totalmente especificados** (`Ed25519` e `Ed448`) e torna obsoleto o nome genérico. A razão é a mesma da regra de “algoritmo fixado pelo servidor”: o identificador sozinho deve dizer exatamente qual algoritmo é, para a lista permitida ser precisa e não depender de parâmetros da chave. O `ES256`, por exemplo, já é totalmente especificado, pois nomeia a curva e o hash. Na prática, confira se a sua biblioteca e o seu provedor aceitam os nomes novos, migre com uma fase em que ambos são aceitos e leia o texto da RFC.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Segredo fraco e confusão de algoritmo",
        texto:
          "Dois erros clássicos. **HS256 com segredo fraco** (uma palavra, `secret`, `changeme`): quem capturar um token testa candidatos offline até acertar e passa a forjar tokens; use bytes aleatórios longos, vindos de um cofre de segredos, nunca do código. **Confusão de algoritmo**: o verificador usa o `alg` do header para decidir como verificar, e o atacante troca `RS256` por `HS256` e assina com a chave pública (que é pública) como se fosse o segredo HMAC. A defesa é o servidor fixar a lista de algoritmos aceitos e associar cada chave a um único algoritmo (veja Q72 e Q132).",
      },
      {
        tipo: "codigo",
        titulo: "Assimétrico na prática: a privada assina, a pública vai para o JWKS",
        legenda: "TypeScript",
        codigo: `import { generateKeyPair, SignJWT, exportJWK } from "jose";

const { publicKey, privateKey } = await generateKeyPair("ES256");

// No emissor: só a chave privada assina
const token = await new SignJWT({ scope: "pedidos:ler" })
  .setProtectedHeader({ alg: "ES256", kid: "2026-10" })
  .setIssuer("https://id.exemplo.com")
  .setAudience("api://pedidos")
  .setExpirationTime("10m")
  .sign(privateKey);

// Nas APIs: só esta parte pública, publicada no JWKS
const jwk = { ...(await exportJWK(publicKey)), kid: "2026-10", alg: "ES256", use: "sig" };`,
        nota: "Em produção, a chave privada vive num cofre de chaves ou HSM e não é gerada no processo da aplicação; o exemplo só mostra qual parte vai para onde.",
      },
    ],
    armadilhas: [
      "Usar HS256 entre um emissor e muitas APIs: cada API passa a poder emitir tokens.",
      "Segredo HS256 curto, previsível ou guardado no repositório.",
      "Deixar o `alg` do header decidir como verificar, em vez de fixar a lista no servidor.",
      "Escolher EdDSA sem checar o suporte dos consumidores (bibliotecas, provedores, dispositivos), ou trocar de nome (`EdDSA` por `Ed25519`) sem uma fase de transição.",
    ],
    autoteste: [
      {
        pergunta: "Por que o HS256 é uma má escolha para um emissor com muitas APIs consumidoras?",
        resposta:
          "Porque o mesmo segredo assina e verifica: cada API precisa conhecê-lo e, portanto, pode forjar tokens aceitos por todas as outras. Com RS256 ou ES256, as APIs só têm a chave pública.",
      },
      {
        pergunta: "Quando você escolheria ES256 em vez de RS256?",
        resposta:
          "Quando você controla os consumidores e quer assinaturas e chaves menores e assinatura mais rápida. O RS256 continua sendo a opção mais compatível quando há clientes e bibliotecas variados.",
      },
    ],
  },
  en: {
    titulo: "HS256, RS256 and ES256",
    pergunta:
      "Compare HS256, RS256 and ES256 (and EdDSA) for signing JWTs. Which one do you choose for an issuer with many consuming APIs, and why?",
    porqueEsteMetodo:
      "Choosing the algorithm means choosing who can sign and who can verify. The matrix shows what each one implies for key distribution, and the decision rule answers the question of an issuer with many APIs.",
    resposta30s:
      "**HS256** is symmetric: the same secret key signs and verifies, so every API that validates can also **forge** tokens. **RS256**, **ES256** and **EdDSA** are asymmetric: the **private key stays only with the issuer** and the APIs get the **public key** (through a JWKS). For an issuer with many APIs, choose **asymmetric**: RS256 for broad compatibility, or ES256 (or EdDSA) for smaller, faster signatures, always with the **algorithm fixed by the server** at verification.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The algorithms side by side",
        colunas: ["Algorithm", "Type and key", "Who signs and who verifies", "Signature and cost", "Support and notes"],
        linhas: [
          [
            "HS256",
            "Symmetric: HMAC with SHA-256 and a shared secret",
            "Whoever knows the secret does both: every verifier can also sign",
            "32 bytes; the cheapest to compute",
            "Supported everywhere. Fits when the issuer and the validator are the same service. The secret must be random and at least 256 bits",
          ],
          [
            "RS256",
            "Asymmetric: RSA (PKCS#1 v1.5) with SHA-256; keys of 2048 bits or more",
            "Only the issuer signs (private key); anyone verifies (public key)",
            "The size of the key (256 bytes with 2048-bit RSA); verifying is fast, and signing is slower than with elliptic curves",
            "The most compatible: the default in many providers and libraries. `PS256` (RSA-PSS) is the variant with probabilistic padding",
          ],
          [
            "ES256",
            "Asymmetric: ECDSA on the P-256 curve with SHA-256",
            "As with RS256",
            "64 bytes, fixed size; signing and verifying are fast; small keys",
            "Widely supported today; check support in the clients and devices you must serve",
          ],
          [
            "EdDSA (Ed25519)",
            "Asymmetric: Edwards curve (Ed25519), deterministic signature",
            "As with RS256",
            "64 bytes; fast, with small keys",
            "Support is still uneven across libraries and providers. See the note on the algorithm name below",
          ],
        ],
        nota: "Sizes and speeds are orders of magnitude; measure with your library and hardware if it matters. On the APIs, verification is cheap in every case; on the issuer, the cost of signing weighs most.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "**Many verifiers, asymmetric.** With HS256, each API holds the secret that also mints tokens: one compromised API (or the secret landing in a log) is enough for someone to forge tokens accepted by all of them. With an asymmetric key, the private one stays only with the issuer (preferably in a key vault or HSM), the APIs hold only the public one and rotation happens by `kid` in the JWKS (see Q73). Among the asymmetric ones, choose **RS256 for interoperability** (it is what every provider and library understands) and **ES256 or EdDSA** when you control the consumers and want smaller signatures. HS256 only when the issuer and the validator are the same service, with a strong secret.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Why the name `EdDSA` was retired",
        texto:
          "In JOSE, `EdDSA` is a **polymorphic** identifier: the same name covers Ed25519 and Ed448, and the verifier must look at the key’s curve (`crv`) to know which algorithm it is. RFC 9864, cited in the question, defines **fully specified** identifiers (`Ed25519` and `Ed448`) and deprecates the generic name. The reason is the same as the “algorithm fixed by the server” rule: the identifier alone should say exactly which algorithm it is, so the allowlist is precise and does not depend on key parameters. `ES256`, for example, is already fully specified, since it names the curve and the hash. In practice, check whether your library and provider accept the new names, migrate with a phase in which both are accepted and read the text of the RFC.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Weak secret and algorithm confusion",
        texto:
          "Two classic mistakes. **HS256 with a weak secret** (a word, `secret`, `changeme`): whoever captures a token tests candidates offline until one fits and can then forge tokens; use long random bytes from a secrets vault, never from the code. **Algorithm confusion**: the verifier uses the header’s `alg` to decide how to verify, and the attacker swaps `RS256` for `HS256` and signs with the public key (which is public) as if it were the HMAC secret. The defense is for the server to fix the list of accepted algorithms and tie each key to a single algorithm (see Q72 and Q132).",
      },
      {
        tipo: "codigo",
        titulo: "Asymmetric in practice: the private key signs, the public key goes to the JWKS",
        legenda: "TypeScript",
        codigo: `import { generateKeyPair, SignJWT, exportJWK } from "jose";

const { publicKey, privateKey } = await generateKeyPair("ES256");

// At the issuer: only the private key signs
const token = await new SignJWT({ scope: "orders:read" })
  .setProtectedHeader({ alg: "ES256", kid: "2026-10" })
  .setIssuer("https://id.example.com")
  .setAudience("api://orders")
  .setExpirationTime("10m")
  .sign(privateKey);

// At the APIs: only this public part, published in the JWKS
const jwk = { ...(await exportJWK(publicKey)), kid: "2026-10", alg: "ES256", use: "sig" };`,
        nota: "In production, the private key lives in a key vault or HSM and is not generated inside the application process; the example only shows which part goes where.",
      },
    ],
    armadilhas: [
      "Using HS256 between one issuer and many APIs: every API becomes able to issue tokens.",
      "A short, predictable HS256 secret, or one kept in the repository.",
      "Letting the header’s `alg` decide how to verify, instead of fixing the list on the server.",
      "Choosing EdDSA without checking consumer support (libraries, providers, devices), or switching names (`EdDSA` to `Ed25519`) without a transition phase.",
    ],
    autoteste: [
      {
        pergunta: "Why is HS256 a poor choice for an issuer with many consuming APIs?",
        resposta:
          "Because the same secret signs and verifies: every API must know it and therefore can forge tokens accepted by all the others. With RS256 or ES256, the APIs hold only the public key.",
      },
      {
        pergunta: "When would you pick ES256 over RS256?",
        resposta:
          "When you control the consumers and want smaller signatures and keys and faster signing. RS256 remains the most compatible option when clients and libraries vary.",
      },
    ],
  },
};
