import type { Pergunta } from "../../tipos";

// Q97 · Bypass de MFA por AiTM
export const q097: Pergunta = {
  numero: 97,
  modulo: "mfa-e-passkeys",
  metodo: "threat",
  pt: {
    titulo: "Bypass de MFA por AiTM",
    pergunta:
      "Como atacantes contornam o MFA com proxies adversary-in-the-middle e roubo de cookie de sessão? Que defesas realmente quebram essa cadeia?",
    porqueEsteMetodo:
      "O ataque só se entende seguindo o que o invasor controla em cada passo. Os pares ataque → defesa mostram qual elo da cadeia cada defesa corta e por que algumas defesas populares não cortam nenhum.",
    resposta30s:
      "Num ataque **adversary-in-the-middle (AiTM)**, a vítima entra numa página falsa que repassa o login ao site verdadeiro em tempo real: o invasor vê a senha, o código do MFA e, no fim, **captura o cookie de sessão** já autenticado e o reutiliza. A causa é que o segundo fator (OTP, push, SMS) é **repassável** e a sessão é **portável**. Quebram a cadeia as **passkeys/FIDO2** (a assinatura é presa à origem real), as **sessões e tokens vinculados ao dispositivo**, as sessões curtas com reautenticação e a **avaliação contínua de acesso** com detecção de sessão anômala.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A cadeia do ataque, passo a passo",
        etapas: [
          "A vítima recebe um link (e-mail, mensagem, anúncio) para um domínio parecido com o do serviço real, com certificado TLS válido para o domínio do invasor",
          "O servidor do invasor funciona como **proxy reverso**: mostra à vítima a página verdadeira, em tempo real, e repassa cada requisição ao site de verdade",
          "A vítima digita usuário e senha; o proxy os repassa e os guarda",
          "O site real pede o segundo fator: a vítima digita o código (OTP, SMS) ou aprova o push, e o proxy repassa também. Para o site real, o MFA foi cumprido",
          "O site real emite o **cookie de sessão** autenticado; o proxy o copia antes de entregá-lo à vítima, que entra normalmente e não percebe nada",
          "O invasor importa o cookie no próprio navegador e age como a vítima, sem nova senha nem novo MFA, até a sessão expirar ou ser revogada",
        ],
        nota: "O MFA não foi “quebrado”: foi cumprido de verdade, por quem estava no meio. Por isso a defesa precisa tornar o fator impossível de repassar e a sessão inútil fora do dispositivo de origem.",
      },
      {
        tipo: "pares",
        titulo: "Ataque → defesa",
        rotuloOrigem: "Elo da cadeia",
        rotuloDestino: "O que o quebra",
        pares: [
          {
            origem: "Página falsa com TLS válido para o domínio do invasor: o usuário não distingue",
            destino:
              "**Passkey (WebAuthn/FIDO2)**: a credencial é presa ao domínio verdadeiro (`rpId`) e a assinatura inclui a origem da página. No domínio falso, o navegador não oferece a credencial, e uma assinatura feita ali é rejeitada pelo servidor real. O usuário não precisa notar a fraude.",
          },
          {
            origem:
              "Código de 6 dígitos, SMS, chamada ou push aprovado: tudo o que uma pessoa digita ou aprova pode ser repassado",
            destino:
              "Trocar por **método resistente a phishing** (passkey, chave de segurança FIDO2, certificado em cartão), começando pelas contas privilegiadas. OTP e push ficam como etapa de transição. Number matching e limite de pedidos reduzem a fadiga de MFA, não o AiTM.",
          },
          {
            origem: "Cookie de sessão copiado e reutilizado em outra máquina",
            destino:
              "**Vincular a sessão ao dispositivo**: tokens OAuth com prova de posse (DPoP, RFC 9449) ou ligados a certificado mTLS (RFC 8705) e, para cookies de navegador, mecanismos de sessão ligada ao dispositivo, ainda em adoção (confira o suporte). Sem a chave privada, o token roubado não funciona.",
          },
          {
            origem: "Sessão de dias: o cookie roubado vale por muito tempo",
            destino:
              "**Sessões curtas** e tempo ocioso, reautenticação forte nas ações sensíveis (step-up, veja Q99) e revogação da sessão e do refresh token ao primeiro sinal de risco.",
          },
          {
            origem: "Cookie usado de um IP, país, ASN ou dispositivo diferente do login",
            destino:
              "**Detecção e avaliação contínua de acesso**: comparar a sessão com o contexto do login (IP, localização, agente de usuário, dispositivo), pontuar o risco e exigir nova prova ou revogar. Protocolos como o CAEP (Continuous Access Evaluation Profile, do OpenID Shared Signals) permitem ao provedor cortar um token no meio da vida; confira o suporte do seu provedor e das suas APIs.",
          },
          {
            origem:
              "Token roubado direto do dispositivo da vítima (malware que coleta cookies), sem nenhuma página falsa",
            destino:
              "Defesa no ponto final: acesso condicionado a **dispositivo gerenciado e em conformidade**, antivírus/EDR e vinculação do token ao dispositivo. O resultado é o mesmo (sessão roubada), e a defesa da sessão também.",
          },
          {
            origem:
              "Interceptação na rede, rebaixamento para HTTP ou cookie enviado sem TLS (a pergunta sobre o canal cliente-servidor)",
            destino:
              "**TLS** em todo o login, **HSTS**, cookies com `Secure`, `HttpOnly` e prefixo `__Host-`, e validação de certificado nos clientes e APIs. Protegem o canal, mas não contra o AiTM, em que o canal com o proxy é legítimo (veja o aviso abaixo).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Por que a passkey não se deixa repassar",
        legenda: "JSON",
        codigo: `{
  "type": "webauthn.get",
  "challenge": "q3Zx0m2k9vJ1bT5hYw8dRg",
  "origin": "https://entrar-banco-seguro.example",
  "crossOrigin": false
}`,
        nota: "Este é o `clientDataJSON` que o navegador monta e assina junto com a credencial. Na página falsa, `origin` é o domínio do invasor: o servidor real, que espera `https://entrar.banco.example`, rejeita a asserção, e o proxy não pode alterar o campo sem invalidar a assinatura. Além disso, o navegador só oferece credenciais cujo `rpId` corresponde ao domínio da página.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que realmente quebra a cadeia",
        texto:
          "Dois cortes, um em cada ponta. **No fator**: usar um autenticador preso à origem verdadeira (passkey), de modo que o proxy não tenha nada para repassar. **Na sessão**: prendê-la ao dispositivo e ao tempo (vinculação, expiração curta, reautenticação em ação sensível, avaliação contínua), de modo que o cookie roubado não sirva fora da vítima. Quem não pode migrar todo mundo de uma vez começa pelas contas privilegiadas e remove delas os métodos repassáveis.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O que não resolve (e o canal protegido por TLS)",
        texto:
          "Acrescentar outro fator repassável (mais um OTP, SMS ou push) não muda nada: o proxy repassa. TLS, `HttpOnly` e `SameSite` protegem o canal e o cookie contra outras ameaças, mas no AiTM a conexão entre a vítima e o proxy é legítima, e o `Set-Cookie` chega ao proxy como chegaria a qualquer cliente. Treinar usuários ajuda, mas não é controle: o domínio falso engana até quem é cuidadoso. E atenção ao rebaixamento: se a passkey existe, mas a tela ainda oferece “usar um código”, o atacante induz a vítima a escolher o método fraco.",
      },
    ],
    armadilhas: [
      "Achar que “ativar MFA” encerra o assunto: OTP, SMS e push cumprem o MFA para o site real, mas um proxy os repassa.",
      "Oferecer a passkey ao lado de senha, OTP e SMS como alternativas: o atacante induz o rebaixamento. Em contas críticas, retire os métodos repassáveis.",
      "Contar com `Secure`, `HttpOnly` ou `SameSite` contra o AiTM: essas flags protegem contra XSS e vazamento na rede, mas o proxy recebe o cookie de forma legítima.",
      "Deixar a sessão válida por dias, sem reautenticação nem revogação: um cookie roubado vira acesso longo e silencioso.",
    ],
    autoteste: [
      {
        pergunta: "Por que a passkey resiste a um proxy AiTM e um código de 6 dígitos não?",
        resposta:
          "O código é só um valor que a pessoa digita onde achar que deve, e o proxy o repassa ao site real. A passkey assina um desafio junto com a origem da página e só existe para o domínio verdadeiro: o navegador não a oferece no domínio falso, e o servidor rejeita uma origem inesperada.",
      },
      {
        pergunta: "O invasor já tem o cookie de sessão. O que ainda pode impedi-lo?",
        resposta:
          "Se a sessão está presa ao dispositivo (prova de posse), o cookie sozinho não basta. Sem isso, restam a expiração curta, a reautenticação forte em ações sensíveis, a detecção de uso anômalo (IP, dispositivo) e a revogação imediata da sessão e dos refresh tokens.",
      },
    ],
  },
  en: {
    titulo: "MFA bypass via AiTM",
    pergunta:
      "How do attackers bypass MFA with adversary-in-the-middle proxies and session cookie theft? Which defenses actually break this chain?",
    porqueEsteMetodo:
      "The attack only makes sense when you follow what the attacker controls at each step. The attack → defense pairs show which link of the chain each defense cuts, and why some popular defenses cut none.",
    resposta30s:
      "In an **adversary-in-the-middle (AiTM)** attack, the victim logs in through a fake page that relays the login to the real site in real time: the attacker sees the password, the MFA code and, in the end, **captures the authenticated session cookie** and replays it. The cause is that the second factor (OTP, push, SMS) is **relayable** and the session is **portable**. What breaks the chain is **passkeys/FIDO2** (the signature is bound to the real origin), **device-bound sessions and tokens**, short sessions with re-authentication, and **continuous access evaluation** with anomalous-session detection.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "The attack chain, step by step",
        etapas: [
          "The victim receives a link (email, message, ad) to a domain that looks like the real service, with a valid TLS certificate for the attacker’s domain",
          "The attacker’s server acts as a **reverse proxy**: it shows the victim the real page, live, and forwards every request to the real site",
          "The victim types username and password; the proxy relays them and keeps a copy",
          "The real site asks for the second factor: the victim types the code (OTP, SMS) or approves the push, and the proxy relays that too. To the real site, MFA was satisfied",
          "The real site issues the authenticated **session cookie**; the proxy copies it before handing it to the victim, who signs in normally and notices nothing",
          "The attacker imports the cookie into their own browser and acts as the victim, with no new password and no new MFA, until the session expires or is revoked",
        ],
        nota: "MFA was not “broken”: it was genuinely satisfied, by whoever sat in the middle. So the defense has to make the factor impossible to relay and the session useless away from the device it started on.",
      },
      {
        tipo: "pares",
        titulo: "Attack → defense",
        rotuloOrigem: "Link in the chain",
        rotuloDestino: "What breaks it",
        pares: [
          {
            origem: "Fake page with valid TLS for the attacker’s domain: the user cannot tell the difference",
            destino:
              "**Passkey (WebAuthn/FIDO2)**: the credential is bound to the real domain (`rpId`) and the signature includes the page’s origin. On the fake domain the browser does not offer the credential, and a signature made there is rejected by the real server. The user does not need to spot the fraud.",
          },
          {
            origem:
              "6-digit code, SMS, phone call or approved push: anything a person types or approves can be relayed",
            destino:
              "Switch to a **phishing-resistant method** (passkey, FIDO2 security key, smart-card certificate), starting with privileged accounts. OTP and push stay as a transition step. Number matching and request limits reduce MFA fatigue, not AiTM.",
          },
          {
            origem: "Session cookie copied and replayed from another machine",
            destino:
              "**Bind the session to the device**: OAuth tokens with proof of possession (DPoP, RFC 9449) or bound to an mTLS certificate (RFC 8705) and, for browser cookies, device-bound session mechanisms, still being adopted (check support). Without the private key, a stolen token does not work.",
          },
          {
            origem: "Multi-day sessions: the stolen cookie stays valid for a long time",
            destino:
              "**Short sessions** and idle timeouts, strong re-authentication for sensitive actions (step-up, see Q99) and revocation of the session and refresh token at the first sign of risk.",
          },
          {
            origem: "Cookie used from an IP, country, ASN or device different from the login",
            destino:
              "**Detection and continuous access evaluation**: compare the session with the login context (IP, location, user agent, device), score the risk and demand a new proof or revoke. Protocols such as CAEP (Continuous Access Evaluation Profile, from OpenID Shared Signals) let the provider cut a token mid-life; check the support in your provider and your APIs.",
          },
          {
            origem:
              "Token stolen straight from the victim’s device (malware that harvests cookies), with no fake page at all",
            destino:
              "Endpoint defense: access conditional on a **managed, compliant device**, antivirus/EDR and binding the token to the device. The result is the same (a stolen session), and so is the session defense.",
          },
          {
            origem:
              "Network interception, downgrade to HTTP or a cookie sent without TLS (the question about the client-server channel)",
            destino:
              "**TLS** across the whole login, **HSTS**, cookies with `Secure`, `HttpOnly` and the `__Host-` prefix, and certificate validation in clients and APIs. They protect the channel, but not against AiTM, where the channel to the proxy is legitimate (see the warning below).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Why a passkey cannot be relayed",
        legenda: "JSON",
        codigo: `{
  "type": "webauthn.get",
  "challenge": "q3Zx0m2k9vJ1bT5hYw8dRg",
  "origin": "https://secure-bank-login.example",
  "crossOrigin": false
}`,
        nota: "This is the `clientDataJSON` that the browser builds and signs together with the credential. On the fake page, `origin` is the attacker’s domain: the real server, which expects `https://login.bank.example`, rejects the assertion, and the proxy cannot change the field without invalidating the signature. Besides, the browser only offers credentials whose `rpId` matches the page’s domain.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What really breaks the chain",
        texto:
          "Two cuts, one at each end. **At the factor**: use an authenticator bound to the real origin (a passkey), so the proxy has nothing to relay. **At the session**: bind it to the device and to time (binding, short expiry, re-authentication on sensitive actions, continuous evaluation), so a stolen cookie is useless away from the victim. Teams that cannot migrate everyone at once start with privileged accounts and remove the relayable methods from them.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What does not solve it (and the TLS-protected channel)",
        texto:
          "Adding another relayable factor (one more OTP, SMS or push) changes nothing: the proxy relays it. TLS, `HttpOnly` and `SameSite` protect the channel and the cookie against other threats, but in AiTM the connection between the victim and the proxy is legitimate, and the `Set-Cookie` reaches the proxy as it would reach any client. Training users helps but is not a control: the fake domain fools even careful people. And watch out for downgrades: if the passkey exists but the screen still offers “use a code instead”, the attacker nudges the victim into picking the weak method.",
      },
    ],
    armadilhas: [
      "Believing that “turning on MFA” settles the matter: OTP, SMS and push satisfy MFA for the real site, but a proxy relays them.",
      "Offering the passkey next to password, OTP and SMS as alternatives: the attacker induces a downgrade. On critical accounts, remove the relayable methods.",
      "Counting on `Secure`, `HttpOnly` or `SameSite` against AiTM: those flags protect against XSS and network leaks, but the proxy receives the cookie legitimately.",
      "Leaving the session valid for days, with no re-authentication or revocation: a stolen cookie becomes long, silent access.",
    ],
    autoteste: [
      {
        pergunta: "Why does a passkey resist an AiTM proxy while a 6-digit code does not?",
        resposta:
          "The code is just a value the person types wherever they think they should, and the proxy forwards it to the real site. A passkey signs a challenge together with the page’s origin and exists only for the real domain: the browser does not offer it on the fake domain, and the server rejects an unexpected origin.",
      },
      {
        pergunta: "The attacker already has the session cookie. What can still stop them?",
        resposta:
          "If the session is bound to the device (proof of possession), the cookie alone is not enough. Without that, what remains is short expiry, strong re-authentication on sensitive actions, detection of anomalous use (IP, device) and immediate revocation of the session and refresh tokens.",
      },
    ],
  },
};
