import type { Pergunta } from "../../tipos";

// Q92 · FIDO2, WebAuthn e CTAP
export const q092: Pergunta = {
  numero: 92,
  modulo: "mfa-e-passkeys",
  metodo: "feynman",
  pt: {
    titulo: "FIDO2, WebAuthn e CTAP",
    pergunta:
      "Qual é a relação entre FIDO2, WebAuthn e CTAP? Que papel têm o autenticador, o navegador e o Relying Party, e o que diferencia autenticadores de plataforma e roaming?",
    porqueEsteMetodo:
      "Três siglas parecidas confundem até quem já usou passkeys. Uma imagem simples fixa a ideia central, e depois as tabelas separam quem fala com quem e onde cada autenticador vive.",
    resposta30s:
      "**FIDO2** é o conjunto de padrões que troca senhas por **criptografia de chave pública**: o **WebAuthn** (W3C) é a API que o navegador oferece ao site (o **Relying Party**), e o **CTAP** é o protocolo entre o navegador e o **autenticador** externo. O autenticador cria uma chave **por site**, guarda a privada e assina desafios só para o domínio certo (`rpId`), depois de verificar o usuário por PIN ou biometria. Uma **passkey** é essa credencial, em geral descobrível e sincronizável.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine um chaveiro mágico. Quando você se cadastra num prédio, ele fabrica uma chave nova que só gira na fechadura daquele endereço exato e entrega ao prédio apenas o molde da fechadura. Se alguém constrói uma fachada idêntica em outra rua, a chave não gira lá, por mais convincente que seja a fachada. E o chaveiro só funciona depois que você prova que é você, com dedo, rosto ou PIN.",
        tecnico:
          "O chaveiro é o **autenticador**; o endereço é o **`rpId`** (o domínio do serviço); o molde da fechadura é a **chave pública**, que o servidor guarda. No login, o servidor manda um desafio e o autenticador o assina com a chave privada daquele endereço. O site (o Relying Party) fala com o navegador pela API **WebAuthn**; o navegador, que sabe de que origem a página veio, fala com um autenticador externo pelo protocolo **CTAP**. As duas especificações juntas formam o **FIDO2**.",
        limite:
          "O chaveiro não protege contra tudo: se o aparelho for infectado, ou se a conta que sincroniza as passkeys for tomada, o ladrão passa (veja Q95). E não existe um chaveiro só: o autenticador pode ser o próprio celular ou uma chave física, com garantias diferentes.",
      },
      {
        tipo: "tabela",
        titulo: "Quem é quem",
        colunas: ["Peça", "O que é", "Fala com", "O que faz"],
        linhas: [
          [
            "Relying Party (RP)",
            "O serviço que quer autenticar: seu backend e a página",
            "O navegador, pela API WebAuthn (JavaScript)",
            "Gera o desafio, define o `rpId`, valida a resposta e guarda a chave pública, o credential id e o contador",
          ],
          [
            "WebAuthn",
            "Padrão do W3C: a API `navigator.credentials.create/get` e os formatos dos dados",
            "Página ↔ navegador",
            "Define a cerimônia e as estruturas (`clientDataJSON`, `authenticatorData`)",
          ],
          [
            "Cliente (navegador ou sistema operacional)",
            "Quem implementa o WebAuthn no dispositivo",
            "O RP e o autenticador",
            "Confere se o `rpId` combina com a origem, monta o `clientDataJSON` com a origem real e repassa ao autenticador",
          ],
          [
            "CTAP",
            "Padrão da FIDO Alliance (o CTAP2 evoluiu do U2F, ou CTAP1)",
            "Navegador ↔ autenticador externo (USB, NFC, Bluetooth)",
            "Transporta os comandos “criar credencial” e “assinar” entre o cliente e a chave física ou o celular",
          ],
          [
            "Autenticador",
            "Hardware ou software que guarda as chaves",
            "O cliente (API do sistema ou CTAP)",
            "Gera o par de chaves por `rpId`, guarda a privada, exige verificação do usuário e assina",
          ],
          [
            "FIDO2",
            "O conjunto: WebAuthn + CTAP2",
            "Não é uma peça, é o nome do conjunto",
            "Substitui o segredo compartilhado por um par de chaves, resistente a phishing",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Autenticador de plataforma × roaming",
        colunas: ["Aspecto", "De plataforma", "Roaming (externo)"],
        linhas: [
          [
            "O que é",
            "Embutido no dispositivo: Touch ID e Face ID, Windows Hello, biometria do Android",
            "Dispositivo separado e portátil: chave de segurança USB, NFC ou Bluetooth, ou um celular usado como autenticador",
          ],
          [
            "Como o navegador fala com ele",
            "Pelas APIs do sistema operacional, sem CTAP externo",
            "Por CTAP (USB, NFC, Bluetooth) ou pelo fluxo entre dispositivos (QR code e proximidade)",
          ],
          [
            "Verificação do usuário",
            "Biometria ou PIN do dispositivo",
            "PIN da chave, biometria da chave ou só um toque (presença)",
          ],
          [
            "Credencial",
            "Muitas vezes sincronizável entre os aparelhos do usuário (passkey)",
            "Normalmente presa à chave física, que se leva de um computador a outro",
          ],
          [
            "Quando preferir",
            "Conveniência e adoção em massa",
            "Contas privilegiadas, alta garantia, computadores compartilhados e reserva",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Passkey e os termos vizinhos",
        texto:
          "Uma **passkey** é uma credencial FIDO **descobrível** (guardada no autenticador junto com o `rpId` e o identificador do usuário, o que permite entrar sem digitar o nome de usuário) e, em geral, **sincronizável**. A credencial **não descobrível** exige que o servidor informe o credential id. **Verificação de usuário (UV)** é o PIN ou a biometria; **presença de usuário (UP)** é só o toque. Para o RP, o essencial é que o `rpId` ata a credencial ao domínio e o servidor guarda apenas a chave pública (veja Q93 e Q94).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Certificação e confusões comuns",
        texto:
          "A **certificação FIDO** testa autenticadores e servidores quanto à interoperabilidade e à segurança, e os metadados da FIDO descrevem modelos certificados; ela é útil quando você usa atestação, mas **uma passkey não exige** produto certificado. **FIDO2 não é U2F**: o U2F (CTAP1) era só segundo fator, enquanto o CTAP2 permite login sem senha e credenciais descobríveis. E **FIDO2 não é um produto pronto**: o seu backend implementa o papel de Relying Party, em geral com uma biblioteca madura.",
      },
    ],
    armadilhas: [
      "Tratar FIDO2, WebAuthn e passkey como sinônimos: FIDO2 é o conjunto, WebAuthn é a API do navegador, CTAP é o protocolo com o autenticador externo e passkey é a credencial.",
      "Achar que a biometria vai para o servidor: ela só destrava a chave local, e o servidor recebe uma assinatura.",
      "Escolher o `rpId` errado (um subdomínio específico quando se quer vários): ele define onde a credencial vale e não muda depois de criada.",
      "Supor que toda passkey é sincronizada: numa chave de segurança física, a credencial fica só nela.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a relação entre FIDO2, WebAuthn e CTAP?",
        resposta:
          "O FIDO2 reúne dois padrões: o WebAuthn, a API entre o site e o navegador, e o CTAP, o protocolo entre o navegador e o autenticador externo.",
      },
      {
        pergunta: "O que diferencia um autenticador de plataforma de um roaming?",
        resposta:
          "O de plataforma é embutido no aparelho e fala com o navegador pelo sistema; o roaming é um dispositivo portátil (chave física ou celular) que fala por CTAP. Muda onde a chave vive e se ela viaja entre dispositivos.",
      },
    ],
  },
  en: {
    titulo: "FIDO2, WebAuthn and CTAP",
    pergunta:
      "How do FIDO2, WebAuthn and CTAP relate to one another? What roles do the authenticator, the browser and the Relying Party play, and what distinguishes platform from roaming authenticators?",
    porqueEsteMetodo:
      "Three similar acronyms confuse even people who have used passkeys. A simple image fixes the central idea, and then the tables separate who talks to whom and where each authenticator lives.",
    resposta30s:
      "**FIDO2** is the set of standards that replaces passwords with **public-key cryptography**: **WebAuthn** (W3C) is the API the browser offers the site (the **Relying Party**), and **CTAP** is the protocol between the browser and the external **authenticator**. The authenticator creates a key **per site**, keeps the private half and signs challenges only for the right domain (`rpId`), after verifying the user by PIN or biometric. A **passkey** is that credential, usually discoverable and syncable.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine a magic key ring. When you sign up at a building, it makes a new key that turns only in the lock at that exact address and hands the building just the mold of the lock. If someone builds an identical facade on another street, the key does not turn there, however convincing the facade. And the key ring only works after you prove it is you, with a finger, a face or a PIN.",
        tecnico:
          "The key ring is the **authenticator**; the address is the **`rpId`** (the service’s domain); the mold of the lock is the **public key**, which the server stores. At login, the server sends a challenge and the authenticator signs it with the private key for that address. The site (the Relying Party) talks to the browser through the **WebAuthn** API; the browser, which knows which origin the page came from, talks to an external authenticator through the **CTAP** protocol. The two specifications together make up **FIDO2**.",
        limite:
          "The key ring does not protect against everything: if the device is infected, or the account that syncs the passkeys is taken over, the thief gets through (see Q95). And there is not just one key ring: the authenticator can be the phone itself or a physical key, with different guarantees.",
      },
      {
        tipo: "tabela",
        titulo: "Who is who",
        colunas: ["Piece", "What it is", "Talks to", "What it does"],
        linhas: [
          [
            "Relying Party (RP)",
            "The service that wants to authenticate: your backend and the page",
            "The browser, through the WebAuthn API (JavaScript)",
            "Generates the challenge, sets the `rpId`, validates the response and stores the public key, the credential id and the counter",
          ],
          [
            "WebAuthn",
            "W3C standard: the `navigator.credentials.create/get` API and the data formats",
            "Page ↔ browser",
            "Defines the ceremony and the structures (`clientDataJSON`, `authenticatorData`)",
          ],
          [
            "Client (browser or operating system)",
            "Whoever implements WebAuthn on the device",
            "The RP and the authenticator",
            "Checks that the `rpId` matches the origin, builds the `clientDataJSON` with the real origin and passes it to the authenticator",
          ],
          [
            "CTAP",
            "FIDO Alliance standard (CTAP2 evolved from U2F, or CTAP1)",
            "Browser ↔ external authenticator (USB, NFC, Bluetooth)",
            "Carries the “create credential” and “sign” commands between the client and the physical key or the phone",
          ],
          [
            "Authenticator",
            "Hardware or software that holds the keys",
            "The client (system API or CTAP)",
            "Generates the key pair per `rpId`, keeps the private key, requires user verification and signs",
          ],
          [
            "FIDO2",
            "The set: WebAuthn + CTAP2",
            "Not a piece, it is the name of the set",
            "Replaces the shared secret with a key pair, resistant to phishing",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Platform vs roaming authenticator",
        colunas: ["Aspect", "Platform", "Roaming (external)"],
        linhas: [
          [
            "What it is",
            "Built into the device: Touch ID and Face ID, Windows Hello, Android biometrics",
            "A separate, portable device: a USB, NFC or Bluetooth security key, or a phone used as an authenticator",
          ],
          [
            "How the browser talks to it",
            "Through operating-system APIs, with no external CTAP",
            "Through CTAP (USB, NFC, Bluetooth) or the cross-device flow (QR code and proximity)",
          ],
          [
            "User verification",
            "The device’s biometric or PIN",
            "The key’s PIN, the key’s biometric or just a touch (presence)",
          ],
          [
            "Credential",
            "Often syncable across the user’s devices (a passkey)",
            "Usually tied to the physical key, which you carry from one computer to another",
          ],
          [
            "When to prefer it",
            "Convenience and mass adoption",
            "Privileged accounts, high assurance, shared computers and backup",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Passkey and the neighboring terms",
        texto:
          "A **passkey** is a **discoverable** FIDO credential (kept on the authenticator together with the `rpId` and the user identifier, which allows signing in without typing a username) and, generally, **syncable**. A **non-discoverable** credential requires the server to supply the credential id. **User verification (UV)** is the PIN or biometric; **user presence (UP)** is just the touch. For the RP, the essential point is that the `rpId` ties the credential to the domain and the server stores only the public key (see Q93 and Q94).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Certification and common confusions",
        texto:
          "**FIDO certification** tests authenticators and servers for interoperability and security, and FIDO metadata describes certified models; it is useful when you use attestation, but **a passkey does not require** a certified product. **FIDO2 is not U2F**: U2F (CTAP1) was second factor only, while CTAP2 allows passwordless login and discoverable credentials. And **FIDO2 is not a ready-made product**: your backend implements the Relying Party role, usually with a mature library.",
      },
    ],
    armadilhas: [
      "Treating FIDO2, WebAuthn and passkey as synonyms: FIDO2 is the set, WebAuthn is the browser API, CTAP is the protocol with the external authenticator and a passkey is the credential.",
      "Thinking the biometric goes to the server: it only unlocks the local key, and the server receives a signature.",
      "Choosing the wrong `rpId` (a specific subdomain when you want several): it defines where the credential is valid and cannot change once created.",
      "Assuming every passkey is synced: on a physical security key, the credential lives only there.",
    ],
    autoteste: [
      {
        pergunta: "How do FIDO2, WebAuthn and CTAP relate to one another?",
        resposta:
          "FIDO2 bundles two standards: WebAuthn, the API between the site and the browser, and CTAP, the protocol between the browser and the external authenticator.",
      },
      {
        pergunta: "What distinguishes a platform authenticator from a roaming one?",
        resposta:
          "The platform one is built into the device and talks to the browser through the system; the roaming one is a portable device (a physical key or a phone) that talks over CTAP. What changes is where the key lives and whether it travels between devices.",
      },
    ],
  },
};
