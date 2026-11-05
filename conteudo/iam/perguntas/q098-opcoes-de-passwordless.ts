import type { Pergunta } from "../../tipos";

// Q98 · Opções de passwordless
export const q098: Pergunta = {
  numero: 98,
  modulo: "mfa-e-passkeys",
  metodo: "compare",
  pt: {
    titulo: "Opções de passwordless",
    pergunta:
      "Compare as formas de passwordless (link mágico, OTP por e-mail, passkey, autenticador de app). Quais as vantagens, os limites e as armadilhas de cada uma?",
    porqueEsteMetodo:
      "Cada forma de passwordless troca um risco por outro, e só uma matriz lado a lado mostra isso. A regra de decisão diz qual usar em cada situação, que é o que se espera numa entrevista.",
    resposta30s:
      "A **passkey** é a melhor opção: rápida e **resistente a phishing**, porque a credencial é presa ao domínio verdadeiro. **Link mágico** e **OTP por e-mail** são cômodos, mas transferem a segurança para a caixa de e-mail e resistem mal a phishing; o **autenticador de app** (TOTP ou push) é um bom segundo fator, mas só é passwordless quando substitui a senha. A regra é **passkey como padrão e e-mail como fallback com limites** (uso único, validade de minutos, preso ao navegador que pediu), sempre com uma recuperação bem pensada.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Matriz das quatro opções",
        colunas: ["Opção", "Segurança e phishing", "Usabilidade", "Dependências e recuperação", "Armadilha principal"],
        linhas: [
          [
            "Link mágico (e-mail)",
            "Prova o controle da caixa de e-mail. Resistência a phishing média se o link só vale no navegador que o pediu; baixa se vale em qualquer lugar",
            "Um clique, sem digitar. Quebra ao abrir o link em outro dispositivo ou navegador",
            "Depende do e-mail (entrega, atraso, spam) e do provedor dele; a recuperação é o próprio e-mail",
            "Scanner de e-mail abre o link e o consome; link reutilizável ou de validade longa",
          ],
          [
            "OTP por e-mail",
            "Mesma base do link, mas o código é digitado onde o usuário estiver, então um proxy de phishing o repassa. Resistência baixa",
            "Funciona em qualquer dispositivo; exige abrir o e-mail e copiar o código",
            "Depende do e-mail; atraso e filtro de spam derrubam a experiência",
            "Código curto sem limite de tentativas nem expiração; e-mail comprometido vira conta comprometida",
          ],
          [
            "Passkey (WebAuthn)",
            "Chave criptográfica presa ao domínio: alta resistência a phishing e nenhum segredo compartilhado no servidor",
            "Biometria ou PIN do dispositivo; muito rápida. A primeira vez e a troca de ecossistema podem confundir",
            "Depende do dispositivo ou do gerenciador de credenciais que a sincroniza; perder todos os dispositivos exige recuperação sólida (veja Q100)",
            "Recuperação fraca (SMS, e-mail) que anula a segurança da passkey; não cadastrar uma segunda",
          ],
          [
            "Autenticador de app (TOTP ou push)",
            "TOTP: código digitável, logo repassável por proxy (resistência baixa). Push com number matching: melhor, mas ainda aprovável sob engano",
            "Exige instalar e configurar; o código funciona offline, o push precisa de rede",
            "Depende do celular; trocar de aparelho sem backup do segredo tranca o usuário",
            "Push sem number matching leva à fadiga de MFA; segredo TOTP mal guardado no servidor",
          ],
        ],
        nota: "O código TOTP, sozinho, costuma ser um segundo fator depois da senha. Ele só entra no passwordless quando substitui a senha (por exemplo, a aprovação por push com number matching no aplicativo).",
      },
      {
        tipo: "tabela",
        titulo: "Para a empresa: o que se ganha e o que custa",
        colunas: ["Tema", "O que se ganha", "Custo ou limite"],
        linhas: [
          [
            "Segurança",
            "Menos phishing, reaproveitamento e roubo de senha; nada reutilizável no servidor para vazar",
            "Só vale por inteiro se os métodos fracos de fallback saírem de cena",
          ],
          [
            "Suporte",
            "Menos pedidos de redefinição de senha e menos esforço do suporte",
            "Chamados novos: dispositivo perdido, troca de aparelho, dúvida entre dispositivos",
          ],
          [
            "Experiência",
            "Login rápido, sem senha para lembrar; menos abandono no cadastro e no login",
            "Curva de aprendizado e conceitos novos (passkey, sincronização) para parte dos usuários",
          ],
          [
            "Compatibilidade",
            "Padrão aberto (WebAuthn/FIDO2), com suporte nos principais sistemas e navegadores",
            "Aplicações legadas, dispositivos compartilhados e navegadores antigos pedem um caminho alternativo; confira o suporte atual",
          ],
          [
            "Implantação",
            "Convive com a senha, então a migração pode ser gradual",
            "Projeto de inscrição e comunicação, chaves de hardware para contas privilegiadas e recuperação desenhada antes de remover a senha",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "**Passkey como padrão** para quem usa dispositivos modernos. **E-mail como fallback com limites**: link ou código de uso único, validade de poucos minutos, preso à sessão do navegador que o pediu, limite de tentativas e de envios, e nunca como único caminho para ações sensíveis ou contas privilegiadas. **Autenticador de app** como segundo fator ou etapa de transição, e **chave de hardware** para administradores. Só retire a senha depois que a recuperação estiver pronta (veja Q100).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Armadilhas dos links e códigos por e-mail",
        texto:
          "Scanners de segurança de e-mail e pré-visualizadores abrem os links sozinhos: se a ação acontece num `GET`, o link é consumido antes de o usuário clicar. Faça o link abrir uma página com um botão de confirmação, que envia um `POST`. Link ou código reutilizável, ou com validade de horas, vira uma credencial de longa duração na caixa de entrada. E o e-mail é um **ponto único de falha**: quem controla a caixa controla a conta, e a recuperação do e-mail está fora do seu controle.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Para onde caminha o MFA",
        texto:
          "Tendências, não promessas: passkeys como método padrão (inclusive sincronizadas entre dispositivos), sessões ligadas ao dispositivo, avaliação contínua de risco em vez de uma verificação única no login, sinais de segurança compartilhados entre provedores e carteiras de credenciais verificáveis. Em paralelo, voz e vídeo sintéticos enfraquecem a verificação humana por telefone, o que reforça os métodos criptográficos. Confira os padrões e o suporte atuais antes de decidir.",
      },
    ],
    armadilhas: [
      "Executar a ação do link mágico num `GET`: o scanner do e-mail o consome e o usuário vê “link inválido”. Peça uma confirmação por `POST`.",
      "Dar ao link ou ao código validade de horas ou permitir reutilização: a caixa de entrada passa a guardar uma credencial de longa duração.",
      "Tratar o e-mail como canal seguro por padrão: ele é um ponto único de falha, e quem o controla controla a conta.",
      "Chamar de passwordless o que apenas esconde a senha: se o fallback continua sendo senha mais SMS, o atacante usa o fallback.",
    ],
    autoteste: [
      {
        pergunta: "Que cuidados mínimos tornam o link ou código por e-mail aceitável como fallback?",
        resposta:
          "Token aleatório e de uso único, guardado só como hash; validade de poucos minutos; preso ao navegador que pediu o login; confirmação por `POST` para os scanners não o consumirem; limite de tentativas e de envios; aviso ao usuário; e restrição a operações de baixo risco.",
      },
      {
        pergunta: "Cite duas desvantagens reais do passwordless para uma empresa e como mitigá-las.",
        resposta:
          "Recuperação e dispositivos perdidos: exigir mais de uma passkey, códigos de backup e um fluxo de recuperação verificado (veja Q100). Compatibilidade com sistemas legados e dispositivos compartilhados: manter um método alternativo controlado, migrar em ondas e usar chaves de hardware onde necessário.",
      },
    ],
  },
  en: {
    titulo: "Passwordless options",
    pergunta:
      "Compare the passwordless options (magic link, email OTP, passkey, authenticator app). What are the advantages, limits and pitfalls of each?",
    porqueEsteMetodo:
      "Each passwordless option trades one risk for another, and only a side-by-side matrix shows that. The decision rule says which to use in each situation, which is what an interview expects.",
    resposta30s:
      "The **passkey** is the best option: fast and **phishing-resistant**, because the credential is bound to the real domain. **Magic links** and **email OTP** are convenient, but they move the security onto the mailbox and resist phishing poorly; the **authenticator app** (TOTP or push) is a good second factor, but it is only passwordless when it replaces the password. The rule is **passkey as the default and email as a limited fallback** (single use, validity of minutes, tied to the browser that asked), always with a well-thought-out recovery.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Matrix of the four options",
        colunas: ["Option", "Security and phishing", "Usability", "Dependencies and recovery", "Main pitfall"],
        linhas: [
          [
            "Magic link (email)",
            "Proves control of the mailbox. Medium phishing resistance if the link only works in the browser that requested it; low if it works anywhere",
            "One click, no typing. Breaks when the link is opened on another device or browser",
            "Depends on email (delivery, delay, spam) and on the email provider; recovery is the email itself",
            "An email scanner opens and consumes the link; a reusable or long-lived link",
          ],
          [
            "Email OTP",
            "Same basis as the link, but the code is typed wherever the user is, so a phishing proxy relays it. Low resistance",
            "Works on any device; requires opening the email and copying the code",
            "Depends on email; delay and spam filters ruin the experience",
            "A short code with no attempt limit or expiry; a compromised mailbox means a compromised account",
          ],
          [
            "Passkey (WebAuthn)",
            "Cryptographic key bound to the domain: high phishing resistance and no shared secret on the server",
            "Device biometrics or PIN; very fast. The first time and switching ecosystems can confuse",
            "Depends on the device or on the credential manager that syncs it; losing every device calls for solid recovery (see Q100)",
            "Weak recovery (SMS, email) that cancels the passkey’s security; not enrolling a second one",
          ],
          [
            "Authenticator app (TOTP or push)",
            "TOTP: a typeable code, so a proxy can relay it (low resistance). Push with number matching: better, but still approvable under deception",
            "Needs installing and setup; the code works offline, push needs a network",
            "Depends on the phone; switching devices without backing up the secret locks the user out",
            "Push without number matching leads to MFA fatigue; a TOTP secret poorly stored on the server",
          ],
        ],
        nota: "A TOTP code on its own is usually a second factor after the password. It only counts as passwordless when it replaces the password (for example, push approval with number matching in the app).",
      },
      {
        tipo: "tabela",
        titulo: "For the business: what you gain and what it costs",
        colunas: ["Topic", "What you gain", "Cost or limit"],
        linhas: [
          [
            "Security",
            "Less phishing, password reuse and password theft; nothing reusable on the server to leak",
            "Only fully effective if the weak fallback methods go away",
          ],
          [
            "Support",
            "Fewer password reset requests and less support effort",
            "New tickets: lost device, device switch, confusion across devices",
          ],
          [
            "Experience",
            "Fast sign-in with no password to remember; less drop-off at sign-up and sign-in",
            "Learning curve and new concepts (passkey, syncing) for some users",
          ],
          [
            "Compatibility",
            "Open standard (WebAuthn/FIDO2), supported by the main systems and browsers",
            "Legacy applications, shared devices and old browsers need an alternative path; check current support",
          ],
          [
            "Rollout",
            "Coexists with the password, so migration can be gradual",
            "Enrollment and communication project, hardware keys for privileged accounts and recovery designed before the password is removed",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "**Passkey as the default** for people on modern devices. **Email as a limited fallback**: a single-use link or code, validity of a few minutes, tied to the session of the browser that asked, limits on attempts and on sends, and never the only path for sensitive actions or privileged accounts. **Authenticator app** as a second factor or transition step, and **hardware keys** for administrators. Remove the password only after recovery is ready (see Q100).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Pitfalls of email links and codes",
        texto:
          "Email security scanners and link previewers open links on their own: if the action happens on a `GET`, the link is consumed before the user clicks. Make the link open a page with a confirmation button that sends a `POST`. A reusable link or code, or one valid for hours, becomes a long-lived credential sitting in the inbox. And email is a **single point of failure**: whoever controls the mailbox controls the account, and recovering that mailbox is outside your control.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Where MFA is heading",
        texto:
          "Trends, not promises: passkeys as the default method (including ones synced across devices), device-bound sessions, continuous risk evaluation instead of a single check at login, security signals shared between providers and wallets of verifiable credentials. Meanwhile, synthetic voice and video weaken human verification over the phone, which strengthens cryptographic methods. Check current standards and support before deciding.",
      },
    ],
    armadilhas: [
      "Performing the magic-link action on a `GET`: the email scanner consumes it and the user sees “invalid link”. Ask for a confirmation by `POST`.",
      "Giving the link or code a validity of hours or allowing reuse: the inbox ends up holding a long-lived credential.",
      "Treating email as a secure channel by default: it is a single point of failure, and whoever controls it controls the account.",
      "Calling something passwordless when it merely hides the password: if the fallback is still password plus SMS, the attacker uses the fallback.",
    ],
    autoteste: [
      {
        pergunta: "What minimum precautions make an email link or code acceptable as a fallback?",
        resposta:
          "A random single-use token, stored only as a hash; a validity of a few minutes; tied to the browser that requested the login; confirmation by `POST` so scanners do not consume it; limits on attempts and sends; a notice to the user; and restriction to low-risk operations.",
      },
      {
        pergunta: "Name two real drawbacks of passwordless for a business and how to mitigate them.",
        resposta:
          "Recovery and lost devices: require more than one passkey, backup codes and a verified recovery flow (see Q100). Compatibility with legacy systems and shared devices: keep a controlled alternative method, migrate in waves and use hardware keys where needed.",
      },
    ],
  },
};
