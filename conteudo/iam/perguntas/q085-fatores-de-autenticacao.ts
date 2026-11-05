import type { Pergunta } from "../../tipos";

// Q85 · Fatores de autenticação
export const q085: Pergunta = {
  numero: 85,
  modulo: "mfa-e-passkeys",
  metodo: "feynman",
  pt: {
    titulo: "Fatores de autenticação",
    pergunta:
      "O que são fatores de autenticação (conhecimento, posse, inerência) e por que combinar fatores de categorias diferentes? Dois fatores do mesmo tipo contam como MFA?",
    porqueEsteMetodo:
      "A ideia de fatores é simples demais para soar abstrata e cheia de armadilhas demais para ser decorada. Uma analogia (o cofre com chave e combinação) dá a intuição da independência entre categorias, e o mecanismo real mostra as categorias, os ataques contra cada uma e o que não conta como fator.",
    resposta30s:
      "Fatores são **categorias** de prova de identidade: **conhecimento** (o que você sabe), **posse** (o que você tem) e **inerência** (o que você é). A autenticação multifator combina **categorias diferentes** para que o vazamento de uma só não baste; duas senhas, ou senha mais pergunta secreta, são **um fator usado duas vezes**, e não MFA. O contexto (local, dispositivo, risco) é um **sinal** para decidir quando pedir mais, e não um fator.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine um cofre que só abre com uma chave física e uma combinação. Quem rouba só a chave não abre; quem espia só a combinação também não: o ladrão precisa de dois golpes de natureza diferente. Agora imagine um cofre com duas combinações (ou com uma combinação e uma pergunta como “nome do seu cachorro”): um único golpe do mesmo tipo, como alguém espiando por cima do ombro, descobre as duas.",
        tecnico:
          "Fatores são **categorias** de prova de identidade: **conhecimento** (senha, PIN), **posse** (celular com aplicativo autenticador, chave de segurança FIDO2, cartão) e **inerência** (impressão digital, rosto). A autenticação multifator (MFA) exige duas ou mais **categorias diferentes**; 2FA é o caso de exatamente dois, e todo 2FA é MFA. Misturar categorias dá **independência**: vazar uma senha (phishing, vazamento de base) não diz nada sobre o telefone, e roubar o telefone não diz nada sobre a senha, então o invasor precisa de dois ataques distintos. Dois itens da mesma categoria caem pelo mesmo golpe: é um fator só, usado duas vezes. O **contexto** (localização, dispositivo conhecido, horário, risco) é um **sinal** usado para decidir quando pedir mais (veja Q99 e Q123), e não algo que a pessoa prove.",
        limite:
          "A analogia do cofre supõe um ladrão que só rouba o que está guardado. Na prática, o invasor também engana a pessoa: um proxy de phishing (AiTM, veja Q97) recebe o segundo fator e o repassa na hora, e uma notificação de aprovação pode ser aceita por cansaço (veja Q90). E nem todo fator tem a mesma força: um código por SMS e uma chave FIDO2 são ambos “posse”, mas resistem de formas muito diferentes.",
      },
      {
        tipo: "tabela",
        titulo: "As categorias, as técnicas e os ataques típicos",
        colunas: ["Categoria", "Técnicas comuns (clássicas e recentes)", "Ataques típicos", "Observação"],
        linhas: [
          [
            "Conhecimento (o que você sabe)",
            "Senha, PIN, frase-senha; perguntas de segurança (fracas)",
            "Phishing, vazamento de bases e credential stuffing, adivinhação, keylogger, engenharia social",
            "É o fator mais fácil de roubar em escala e de reutilizar; sozinho, é o elo fraco",
          ],
          [
            "Posse (o que você tem)",
            "Aplicativo TOTP, notificação push com number matching, chave de segurança FIDO2, passkey no dispositivo, cartão inteligente, código por SMS",
            "Roubo ou perda do dispositivo, SIM swap (SMS), malware, interceptação e repasse do código (AiTM), fadiga de notificações",
            "Forças muito diferentes: SMS e TOTP podem ser repassados por phishing; FIDO2 e passkeys são ligadas ao domínio e resistem (veja Q96)",
          ],
          [
            "Inerência (o que você é)",
            "Impressão digital, rosto, íris; em geral comparada no próprio dispositivo para liberar uma chave local",
            "Falsificação (foto, molde, deepfake), ataque ao sensor, vazamento do modelo biométrico",
            "Não dá para trocar a biometria depois de um vazamento; use-a para desbloquear uma chave local, e não como segredo enviado ao servidor (veja Q91)",
          ],
          [
            "Contexto (não é fator)",
            "Localização, IP, dispositivo conhecido, horário, pontuação de risco",
            "Falsificação do sinal (VPN, IP residencial, cookie roubado)",
            "Alimenta a decisão de pedir MFA ou bloquear (MFA adaptativa); nunca substitui um fator",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Esta combinação conta como MFA?",
        colunas: ["Combinação", "Conta como MFA?", "Por quê"],
        linhas: [
          ["Senha + PIN", "Não", "Dois itens de conhecimento: um golpe só (phishing, keylogger) captura os dois"],
          [
            "Senha + pergunta secreta",
            "Não",
            "Também é conhecimento, e a resposta costuma estar em perfis públicos ou em vazamentos",
          ],
          [
            "Senha + código TOTP do aplicativo",
            "Sim (2FA)",
            "Conhecimento + posse; ainda vulnerável a phishing em tempo real",
          ],
          [
            "Senha + código por SMS",
            "Sim, mas fraco",
            "Conhecimento + posse (do número), exposta a SIM swap e à interceptação; melhor que só a senha, pior que as demais opções (veja Q89)",
          ],
          [
            "Passkey ou chave FIDO2 com verificação do usuário",
            "Sim, em um só gesto",
            "Posse da chave privada + o PIN ou a biometria local que a libera; resistente a phishing (veja Q92 e Q102)",
          ],
          [
            "Senha + localização ou dispositivo conhecido",
            "Não",
            "Contexto é um sinal, e não um fator: não é algo que a pessoa sabe, tem ou é",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra",
        texto:
          "MFA é **categorias diferentes**, e não quantidade de passos. A segunda categoria reduz o risco porque o vazamento de uma só não basta; o ganho real depende da **resistência a phishing** do segundo fator (FIDO2 e passkeys acima de TOTP e push, e o SMS por último). O contexto serve para decidir quando pedir o fator, nunca para substituí-lo.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Os erros comuns de quem responde sobre MFA",
        texto:
          "O clássico é chamar de MFA o que é um fator repetido (senha + pergunta secreta, duas senhas). Outros: tratar o contexto como fator, achar que MFA é à prova de phishing (código e push podem ser repassados por um proxy ou vencidos por cansaço), esquecer que a **recuperação de conta** é um caminho que contorna o MFA (veja Q100) e esquecer o papel no Zero Trust: o MFA verifica a pessoa a cada acesso relevante, em vez de confiar na localização na rede (veja Q120).",
      },
    ],
    armadilhas: [
      "Chamar de MFA a senha + pergunta secreta, a senha + PIN ou duas senhas: é um fator só, usado duas vezes.",
      "Tratar IP, localização ou dispositivo conhecido como fator: é um sinal para decidir, e pode ser falsificado.",
      "Achar que MFA é à prova de phishing: código e notificação podem ser repassados por um proxy ou aprovados por cansaço (veja Q90 e Q97); só os métodos ligados ao domínio resistem.",
      "Deixar a recuperação de conta mais fraca que o login: ela vira a porta dos fundos do MFA (veja Q100).",
    ],
    autoteste: [
      {
        pergunta: "Senha mais pergunta secreta é MFA? Por quê?",
        resposta:
          "Não. As duas são conhecimento, da mesma categoria, e o mesmo golpe (phishing, vazamento, pesquisa em perfis públicos) captura as duas. MFA exige categorias diferentes.",
      },
      {
        pergunta: "Por que combinar categorias diferentes reduz o risco, e por que o contexto não conta como fator?",
        resposta:
          "Porque cada categoria é atacada por técnicas diferentes: quem vazou a senha ainda precisaria do dispositivo ou da biometria, o que exige outro ataque, independente. O contexto não é algo que a pessoa sabe, tem ou é: é um sinal que o sistema observa e que pode ser falsificado; serve para decidir quando pedir o fator, e não para substituí-lo.",
      },
    ],
  },
  en: {
    titulo: "Authentication factors",
    pergunta:
      "What are authentication factors (knowledge, possession, inherence), and why combine factors from different categories? Do two factors of the same type count as MFA?",
    porqueEsteMetodo:
      "The idea of factors is too simple to feel abstract and has too many traps to be memorized. An analogy (the safe with a key and a combination) gives the intuition of independence between categories, and the real mechanism shows the categories, the attacks against each and what does not count as a factor.",
    resposta30s:
      "Factors are **categories** of identity proof: **knowledge** (what you know), **possession** (what you have) and **inherence** (what you are). Multi-factor authentication combines **different categories** so the leak of one alone is not enough; two passwords, or a password plus a secret question, are **one factor used twice**, not MFA. Context (location, device, risk) is a **signal** for deciding when to ask for more, not a factor.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine a safe that only opens with a physical key and a combination. Someone who steals only the key cannot open it; someone who spies only the combination cannot either: the thief needs two blows of a different nature. Now imagine a safe with two combinations (or one combination and a question like “your dog’s name”): a single blow of the same kind, such as someone looking over your shoulder, reveals both.",
        tecnico:
          "Factors are **categories** of identity proof: **knowledge** (password, PIN), **possession** (a phone with an authenticator app, a FIDO2 security key, a card) and **inherence** (fingerprint, face). Multi-factor authentication (MFA) requires two or more **different categories**; 2FA is the case of exactly two, and every 2FA is MFA. Mixing categories gives **independence**: leaking a password (phishing, a database breach) says nothing about the phone, and stealing the phone says nothing about the password, so the attacker needs two distinct attacks. Two items of the same category fall to the same blow: it is one factor, used twice. **Context** (location, known device, time of day, risk) is a **signal** used to decide when to ask for more (see Q99 and Q123), not something the person proves.",
        limite:
          "The safe analogy assumes a thief who only takes what is stored. In practice the attacker also deceives the person: a phishing proxy (AiTM, see Q97) receives the second factor and relays it on the spot, and an approval prompt can be accepted out of fatigue (see Q90). And not every factor has the same strength: an SMS code and a FIDO2 key are both “possession”, but they resist in very different ways.",
      },
      {
        tipo: "tabela",
        titulo: "The categories, the techniques and the typical attacks",
        colunas: ["Category", "Common techniques (classic and recent)", "Typical attacks", "Note"],
        linhas: [
          [
            "Knowledge (what you know)",
            "Password, PIN, passphrase; security questions (weak)",
            "Phishing, database leaks and credential stuffing, guessing, keyloggers, social engineering",
            "The easiest factor to steal at scale and to reuse; on its own, it is the weak link",
          ],
          [
            "Possession (what you have)",
            "TOTP app, push notification with number matching, FIDO2 security key, passkey on the device, smart card, SMS code",
            "Theft or loss of the device, SIM swap (SMS), malware, interception and relay of the code (AiTM), notification fatigue",
            "Very different strengths: SMS and TOTP can be relayed by phishing; FIDO2 and passkeys are bound to the domain and resist (see Q96)",
          ],
          [
            "Inherence (what you are)",
            "Fingerprint, face, iris; usually matched on the device itself to unlock a local key",
            "Spoofing (photo, mold, deepfake), sensor attacks, leakage of the biometric template",
            "A biometric cannot be changed after a leak; use it to unlock a local key, not as a secret sent to the server (see Q91)",
          ],
          [
            "Context (not a factor)",
            "Location, IP, known device, time of day, risk score",
            "Spoofing the signal (VPN, residential IP, stolen cookie)",
            "Feeds the decision to ask for MFA or block (adaptive MFA); never replaces a factor",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Does this combination count as MFA?",
        colunas: ["Combination", "Counts as MFA?", "Why"],
        linhas: [
          ["Password + PIN", "No", "Two knowledge items: a single blow (phishing, a keylogger) captures both"],
          [
            "Password + secret question",
            "No",
            "It is also knowledge, and the answer is often on public profiles or in leaks",
          ],
          ["Password + app TOTP code", "Yes (2FA)", "Knowledge + possession; still vulnerable to real-time phishing"],
          [
            "Password + SMS code",
            "Yes, but weak",
            "Knowledge + possession (of the number), exposed to SIM swap and interception; better than the password alone, worse than the other options (see Q89)",
          ],
          [
            "Passkey or FIDO2 key with user verification",
            "Yes, in a single gesture",
            "Possession of the private key + the local PIN or biometric that unlocks it; phishing-resistant (see Q92 and Q102)",
          ],
          [
            "Password + location or known device",
            "No",
            "Context is a signal, not a factor: it is not something the person knows, has or is",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule",
        texto:
          "MFA means **different categories**, not a number of steps. The second category lowers the risk because the leak of one alone is not enough; the real gain depends on the second factor’s **phishing resistance** (FIDO2 and passkeys above TOTP and push, with SMS last). Context serves to decide when to ask for the factor, never to replace it.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The common mistakes when answering about MFA",
        texto:
          "The classic one is calling a repeated factor MFA (password + secret question, two passwords). Others: treating context as a factor, believing MFA is phishing-proof (codes and push can be relayed by a proxy or beaten by fatigue), forgetting that **account recovery** is a path that bypasses MFA (see Q100), and forgetting its role in Zero Trust: MFA verifies the person at each relevant access instead of trusting network location (see Q120).",
      },
    ],
    armadilhas: [
      "Calling password + secret question, password + PIN or two passwords MFA: it is one factor used twice.",
      "Treating IP, location or a known device as a factor: it is a signal for deciding, and it can be spoofed.",
      "Thinking MFA is phishing-proof: codes and prompts can be relayed by a proxy or approved out of fatigue (see Q90 and Q97); only domain-bound methods resist.",
      "Leaving account recovery weaker than login: it becomes the back door around MFA (see Q100).",
    ],
    autoteste: [
      {
        pergunta: "Is a password plus a secret question MFA? Why?",
        resposta:
          "No. Both are knowledge, the same category, and the same blow (phishing, a leak, searching public profiles) captures both. MFA requires different categories.",
      },
      {
        pergunta: "Why does combining different categories lower the risk, and why does context not count as a factor?",
        resposta:
          "Because each category is attacked by different techniques: whoever leaked the password would still need the device or the biometric, which takes another, independent attack. Context is not something the person knows, has or is: it is a signal the system observes and that can be spoofed; it serves to decide when to ask for the factor, not to replace it.",
      },
    ],
  },
};
