import type { Pergunta } from "../../tipos";

// Q96 · Por que passkeys resistem a phishing
export const q096: Pergunta = {
  numero: 96,
  modulo: "mfa-e-passkeys",
  metodo: "whys",
  pt: {
    titulo: "Por que passkeys resistem a phishing",
    pergunta:
      "Por que passkeys e WebAuthn resistem a phishing, enquanto TOTP e push não? Explique o papel do vínculo com a origem.",
    porqueEsteMetodo:
      "Dizer que passkeys “resistem a phishing” só convence quando se vê a cadeia causal: o que o phishing explora, o que o WebAuthn muda e onde isso para de valer. Os porquês seguem essa cadeia até a causa-raiz.",
    resposta30s:
      "O phishing funciona porque a prova de identidade (senha, código TOTP, aprovação de push) é **transferível**: a pessoa a entrega a quem está na frente, e um proxy a repassa em tempo real. No WebAuthn, a resposta inclui a **origem real** vista pelo navegador e é assinada com uma chave **ligada ao `rpId`**, então um site falso não obtém uma resposta válida para o site verdadeiro. A resistência não cobre malware, roubo de sessão nem um método mais fraco que ainda esteja ativo.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que TOTP e push são vulneráveis a phishing?",
            resposta:
              "Porque quem confere o site é o **ser humano**, que erra. A pessoa digita a senha e o código (ou aprova o push) numa página que parece a verdadeira, e um proxy reverso (ataque adversary-in-the-middle, ou AiTM) repassa tudo ao serviço real **na hora** e fica com a sessão resultante. O código não sabe onde foi digitado, e a aprovação não diz para qual site vale.",
          },
          {
            pergunta: "Por que o WebAuthn não depende de o usuário reconhecer o site?",
            resposta:
              "Porque a verificação passa para a máquina. O navegador conhece a **origem** real da página (esquema, host e porta) e a grava no `clientDataJSON`, que o autenticador assina junto com o challenge. A pessoa não digita nem lê nada que possa ser repassado.",
          },
          {
            pergunta: "Por que um site falso não consegue uma resposta válida?",
            resposta:
              "Porque a credencial nasce ligada a um `rpId` (por exemplo, `exemplo.com.br`), e o autenticador só assina para esse `rpId`. Numa página em `exemp1o.com`, o `rpId` possível é outro: o autenticador não encontra credencial e não há o que assinar. Se a página tentar declarar o `rpId` do site verdadeiro, o navegador recusa.",
          },
          {
            pergunta: "Por que a página maliciosa não pode simplesmente mentir sobre a origem?",
            resposta:
              "Porque a origem do `clientDataJSON` é preenchida pelo **navegador**, não pelo JavaScript da página, e o navegador só aceita um `rpId` que seja o domínio da página ou um sufixo registrável dele. Se um proxy reenviar ao servidor real uma resposta feita para a origem dele, o servidor a recusa ao conferir `origin` e o hash do `rpId`. O modelo confia no navegador: uma extensão ou um navegador adulterado é outra história.",
          },
          {
            pergunta: "Por que não há um segredo reutilizável para roubar?",
            resposta:
              "Porque a chave privada nunca sai do autenticador, o servidor guarda só a pública e cada site tem um par diferente. Um vazamento do banco, ou uma página falsa, não entrega nada que sirva em outro lugar, ao contrário de uma senha ou da semente do TOTP.",
          },
        ],
        causaRaiz:
          "O phishing só vence quando a prova de identidade pode ser **entregue a outra parte**. No WebAuthn, a prova é **ligada à origem** e conferida por software, então a resposta que o atacante consegue vale apenas para o site dele.",
      },
      {
        tipo: "tabela",
        titulo: "Quem confere o site, e dá para repassar?",
        colunas: ["Método", "Quem confere o site", "Um proxy em tempo real consegue usar?", "Por quê"],
        linhas: [
          ["Senha", "A pessoa", "Sim", "É um segredo que se digita onde quer que a pessoa acredite ser o site certo"],
          [
            "TOTP ou código por SMS",
            "A pessoa",
            "Sim, dentro da janela de validade",
            "O código vale para a conta, não para o site onde foi digitado",
          ],
          [
            "Push (aprovação)",
            "A pessoa",
            "Sim; com number matching, só com um golpe adicional",
            "A aprovação não carrega a origem, e o atacante é quem inicia o login real",
          ],
          [
            "Passkey ou chave FIDO2",
            "O navegador e o autenticador, pelo `rpId` e pela origem assinada",
            "Não",
            "A resposta só é produzida para o `rpId` e a origem corretos e é assinada com eles",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O que continua possível",
        texto:
          "Resistência a phishing **não é imunidade**. Malware no aparelho ou no navegador age depois do login. O **roubo do cookie ou do token de sessão** dá acesso sem refazer a autenticação (vale também com passkey). O atacante pode induzir a pessoa a usar o **método mais fraco** que ainda estiver ativo, por isso desative senha com TOTP e SMS nas contas críticas. A **recuperação de conta** engana o suporte. E há golpes que nem roubam credencial, como o **consentimento a um aplicativo OAuth malicioso**. A passkey fecha a porta da frente, não as outras.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "E o Zero Trust?",
        texto:
          "O **Zero Trust** (NIST SP 800-207) não impede alguém de cair no phishing; ele limita o estrago. Cada acesso é decidido por identidade, **estado do dispositivo** e contexto, com privilégio mínimo, sessões curtas e revalidação, e a rede deixa de ser sinal de confiança. Uma senha ou um código roubado, sozinho, vale pouco: o atacante não tem um dispositivo gerenciado e em conformidade, aparece em contexto anômalo e esbarra em segmentação que limita o alcance. Para recursos sensíveis, a política exige método **resistente a phishing**, e aí as duas ideias se somam: a passkey evita o roubo da prova, e o Zero Trust reduz o que se perde se algo vazar.",
      },
    ],
    armadilhas: [
      "Dizer que passkeys eliminam o phishing: elas bloqueiam o roubo e o repasse da credencial, mas não o roubo de sessão, o malware nem a recuperação fraca.",
      "Manter senha, TOTP ou SMS ativos como alternativa e achar que a conta ficou resistente: o atacante força o downgrade para o método mais fraco.",
      "Achar que number matching no push equivale a resistência a phishing: ele dificulta o ataque cego, mas um proxy ainda mostra o número real na página falsa e a vítima o digita.",
      "Esquecer a conferência de origem e de hash do `rpId` no servidor: ela é parte essencial da defesa.",
    ],
    autoteste: [
      {
        pergunta: "Qual campo do WebAuthn faz o vínculo com a origem e quem o preenche?",
        resposta:
          "O `clientDataJSON` traz a `origin`, preenchida pelo navegador (não pelo JavaScript da página) e assinada pelo autenticador junto com o challenge. O servidor confere a origem e o hash do `rpId`.",
      },
      {
        pergunta: "Por que um proxy AiTM derrota TOTP e push, mas não uma passkey?",
        resposta:
          "O código e a aprovação valem para a conta e podem ser repassados na hora ao serviço real. A resposta da passkey só existe para o `rpId` e a origem corretos: num domínio falso não há credencial, e uma resposta feita para a origem do atacante é recusada pelo servidor real.",
      },
    ],
  },
  en: {
    titulo: "Why passkeys resist phishing",
    pergunta:
      "Why do passkeys and WebAuthn resist phishing while TOTP and push do not? Explain the role of origin binding.",
    porqueEsteMetodo:
      "Saying passkeys “resist phishing” only convinces once you see the causal chain: what phishing exploits, what WebAuthn changes and where that stops holding. The whys follow that chain down to the root cause.",
    resposta30s:
      "Phishing works because the proof of identity (password, TOTP code, push approval) is **transferable**: the person hands it to whoever is in front of them, and a proxy relays it in real time. In WebAuthn, the response includes the **real origin** seen by the browser and is signed with a key **bound to the `rpId`**, so a fake site cannot obtain a valid response for the real site. The resistance does not cover malware, session theft or a weaker method that is still enabled.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why are TOTP and push vulnerable to phishing?",
            resposta:
              "Because the one who checks the site is the **human**, who makes mistakes. The person types the password and the code (or approves the push) on a page that looks real, and a reverse proxy (an adversary-in-the-middle, or AiTM, attack) relays everything to the real service **on the spot** and keeps the resulting session. The code does not know where it was typed, and the approval does not say which site it is for.",
          },
          {
            pergunta: "Why does WebAuthn not depend on the user recognizing the site?",
            resposta:
              "Because verification moves to the machine. The browser knows the page’s real **origin** (scheme, host and port) and writes it into the `clientDataJSON`, which the authenticator signs together with the challenge. The person types or reads nothing that could be relayed.",
          },
          {
            pergunta: "Why can a fake site not obtain a valid response?",
            resposta:
              "Because the credential is born bound to an `rpId` (for example, `example.com`), and the authenticator only signs for that `rpId`. On a page at `examp1e.com`, the possible `rpId` is a different one: the authenticator finds no credential and there is nothing to sign. If the page tries to declare the real site’s `rpId`, the browser refuses.",
          },
          {
            pergunta: "Why can the malicious page not simply lie about the origin?",
            resposta:
              "Because the origin in the `clientDataJSON` is filled in by the **browser**, not by the page’s JavaScript, and the browser only accepts an `rpId` that is the page’s domain or a registrable suffix of it. If a proxy resends to the real server a response made for its own origin, the server refuses it when checking `origin` and the `rpId` hash. The model trusts the browser: a tampered extension or browser is another story.",
          },
          {
            pergunta: "Why is there no reusable secret to steal?",
            resposta:
              "Because the private key never leaves the authenticator, the server stores only the public one and each site has a different pair. A database leak, or a fake page, yields nothing that works elsewhere, unlike a password or a TOTP seed.",
          },
        ],
        causaRaiz:
          "Phishing only wins when the proof of identity can be **handed to someone else**. In WebAuthn, the proof is **bound to the origin** and checked by software, so the response the attacker obtains is valid only for their own site.",
      },
      {
        tipo: "tabela",
        titulo: "Who checks the site, and can it be relayed?",
        colunas: ["Method", "Who checks the site", "Can a real-time proxy use it?", "Why"],
        linhas: [
          [
            "Password",
            "The person",
            "Yes",
            "It is a secret typed wherever the person believes the site to be the right one",
          ],
          [
            "TOTP or SMS code",
            "The person",
            "Yes, within the validity window",
            "The code is valid for the account, not for the site where it was typed",
          ],
          [
            "Push (approval)",
            "The person",
            "Yes; with number matching, only with an extra trick",
            "The approval carries no origin, and the attacker is the one who starts the real login",
          ],
          [
            "Passkey or FIDO2 key",
            "The browser and the authenticator, through the `rpId` and the signed origin",
            "No",
            "The response is only produced for the correct `rpId` and origin and is signed with them",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What is still possible",
        texto:
          "Phishing resistance is **not immunity**. Malware on the device or in the browser acts after login. **Theft of the session cookie or token** grants access without redoing authentication (this holds with passkeys too). The attacker can nudge the person toward the **weakest method** still enabled, which is why you should disable password-plus-TOTP and SMS on critical accounts. **Account recovery** fools the help desk. And some scams steal no credential at all, such as **consent to a malicious OAuth app**. A passkey locks the front door, not the others.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "And Zero Trust?",
        texto:
          "**Zero Trust** (NIST SP 800-207) does not stop someone from falling for phishing; it limits the damage. Each access is decided by identity, **device state** and context, with least privilege, short sessions and revalidation, and the network stops being a signal of trust. A stolen password or code alone is worth little: the attacker has no managed, compliant device, shows up in an anomalous context and runs into segmentation that limits reach. For sensitive resources, the policy requires a **phishing-resistant** method, and then the two ideas add up: the passkey prevents theft of the proof, and Zero Trust reduces what is lost if something leaks.",
      },
    ],
    armadilhas: [
      "Saying passkeys eliminate phishing: they block theft and relay of the credential, but not session theft, malware or weak recovery.",
      "Keeping password, TOTP or SMS enabled as an alternative and thinking the account became resistant: the attacker forces a downgrade to the weakest method.",
      "Thinking number matching on push equals phishing resistance: it hampers the blind attack, but a proxy still shows the real number on the fake page and the victim types it.",
      "Forgetting the origin and `rpId` hash check on the server: it is an essential part of the defense.",
    ],
    autoteste: [
      {
        pergunta: "Which WebAuthn field binds to the origin, and who fills it in?",
        resposta:
          "The `clientDataJSON` carries the `origin`, filled in by the browser (not by the page’s JavaScript) and signed by the authenticator together with the challenge. The server checks the origin and the `rpId` hash.",
      },
      {
        pergunta: "Why does an AiTM proxy defeat TOTP and push but not a passkey?",
        resposta:
          "The code and the approval are valid for the account and can be relayed on the spot to the real service. The passkey’s response exists only for the correct `rpId` and origin: on a fake domain there is no credential, and a response made for the attacker’s origin is refused by the real server.",
      },
    ],
  },
};
