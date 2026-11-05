import type { Pergunta } from "../../tipos";

// Q89 · Riscos de SMS como fator
export const q089: Pergunta = {
  numero: 89,
  modulo: "mfa-e-passkeys",
  metodo: "threat",
  pt: {
    titulo: "Riscos de SMS como fator",
    pergunta:
      "Por que SMS e chamadas de voz são considerados fatores fracos? Descreva os ataques (SIM swap, SS7, interceptação) e quando ainda são aceitáveis.",
    porqueEsteMetodo:
      "Para entender por que o canal é fraco, é preciso ver o que o atacante controla em cada ataque. Pares ataque → defesa mostram onde cada defesa para de funcionar e por que a solução de fundo é trocar de fator.",
    resposta30s:
      "SMS e voz dependem de um canal que **pertence à operadora, não ao usuário nem ao serviço**. Ele pode ser capturado por **SIM swap** (o número vai para o chip do atacante por engenharia social), por falhas na rede de sinalização (**SS7**) e interceptação, ou lido por **malware**, e o código ainda pode ser **repassado por phishing**. Serve como **reserva**, ou quando a alternativa é só a senha, com monitoramento; o caminho é TOTP, push com number matching ou passkeys.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ataque → defesa",
        rotuloOrigem: "Ataque",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "**SIM swap**: o atacante convence a operadora (ou um funcionário) a transferir o número para um chip dele e passa a receber as mensagens e as chamadas da vítima",
            destino:
              "Consultar sinais de troca recente de chip ou de portabilidade (APIs de operadoras e de agregadores) e exigir verificação extra, ou atrasar ações sensíveis, depois da troca. O usuário pode pedir à operadora um PIN ou o bloqueio de portabilidade. A defesa estrutural é **não depender do número**: TOTP, push com contexto ou passkeys.",
          },
          {
            origem:
              "**Interceptação na rede**: o SS7 (e protocolos parecidos) foi desenhado para uma rede fechada entre operadoras, e quem consegue acesso a ela, por operadora comprometida ou serviço abusivo, pode redirecionar SMS. No ar, estações falsas e redes antigas (2G) enfraquecem a proteção do tráfego",
            destino:
              "Do seu lado não há como consertar a rede: **trate o canal como não confiável**. Não mande dado sensível na mensagem, deixe o código com validade curta e uso único e migre para fatores que não passam pela telefonia.",
          },
          {
            origem:
              "**Malware e exposição no aparelho**: aplicativo com permissão de SMS, espelhamento de notificações e código visível na tela bloqueada",
            destino:
              "Código curto, de uso único e com validade de poucos minutos; mensagem que cita o serviço e usa o formato de código vinculado ao domínio (`@dominio #codigo`, na última linha), para o preenchimento automático só funcionar no site certo. Proteja o aparelho (atualizações, gestão de dispositivos) e, de novo, use um fator fora do SMS.",
          },
          {
            origem:
              "**Phishing do código**: um site falso ou uma ligação falsa pede o código e o usa na hora no serviço verdadeiro",
            destino:
              "O texto da mensagem dizer para que serve o código e avisar para não compartilhá-lo ajuda, mas não resolve: uma pessoa convencida entrega o código. Só fatores **resistentes a phishing** (passkeys, chaves FIDO2) fecham esse caminho (veja Q96).",
          },
          {
            origem:
              "**SMS como recuperação de conta**: quem controla o número redefine a senha e anula qualquer fator mais forte",
            destino:
              "Não deixe a recuperação ser mais fraca que o login: exija um fator forte já registrado, use verificação de identidade mais robusta e um prazo de segurança, e avise por todos os canais quando um fator for trocado.",
          },
          {
            origem:
              "**Abuso do canal**: o atacante dispara milhares de SMS para números que rendem receita a ele (SMS pumping) ou bombardeia a vítima com mensagens",
            destino:
              "Limite o envio por conta, por número e por origem, valide o dispositivo ou use CAPTCHA antes de enviar, restrinja os países atendidos e monitore o custo por região.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A causa e a regra de decisão",
        texto:
          "O número de telefone é um **identificador que muda de dono**, não uma credencial, e o canal é **da operadora**. Por isso o SMS prova, no máximo, que alguém controla o número agora. Prefira, nesta ordem: passkeys ou chaves FIDO2, TOTP ou push com number matching e só então SMS ou voz. O NIST SP 800-63B trata a entrega por rede de telefonia como autenticador restrito, que pede avisar o risco, oferecer alternativa e monitorar; confira a revisão vigente.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Quando ainda é aceitável",
        texto:
          "(1) Como **segundo fator de reserva** em serviço de risco baixo ou médio, onde a alternativa realista é só a senha: o SMS ainda barra credential stuffing e boa parte dos ataques automatizados. (2) Para **verificar a posse** do número no cadastro, o que é diferente de autenticar. (3) Para públicos sem smartphone, com limites de envio e monitoramento de troca de chip. A voz tem os mesmos riscos e mais um, o correio de voz com PIN padrão. Nunca como único fator de contas administrativas, privilegiadas ou financeiras de alto valor.",
      },
    ],
    armadilhas: [
      "Dar o MFA por resolvido só porque o código chega por SMS: o fator é tão forte quanto o processo de troca de chip da operadora.",
      "Usar o mesmo número como canal de login e de recuperação sem nenhum controle adicional.",
      "Mensagens com código de validade longa, reutilizável ou previsível, ou que trazem dados sensíveis junto com o código.",
      "Esquecer custo e abuso: sem limite de envio, o SMS vira ataque financeiro (SMS pumping) e canal de assédio.",
    ],
    autoteste: [
      {
        pergunta: "Por que o SIM swap derrota o SMS como fator?",
        resposta:
          "Porque o código vai para o número, não para a pessoa. Quem convence a operadora a mover o número para outro chip passa a receber os códigos como se fosse a vítima, sem ter o aparelho dela.",
      },
      {
        pergunta: "Em que situação o SMS ainda é razoável?",
        resposta:
          "Como reserva em serviços de risco baixo ou médio, com limites, monitoramento de troca de chip e uma alternativa mais forte oferecida, ou para verificar a posse do número no cadastro. Nunca como único fator de contas privilegiadas.",
      },
    ],
  },
  en: {
    titulo: "Risks of SMS as a factor",
    pergunta:
      "Why are SMS and voice calls considered weak factors? Describe the attacks (SIM swap, SS7, interception) and when they are still acceptable.",
    porqueEsteMetodo:
      "To see why the channel is weak, you need to see what the attacker controls in each attack. Attack → defense pairs show where each defense stops working and why the underlying fix is to change factor.",
    resposta30s:
      "SMS and voice rely on a channel that **belongs to the carrier, not to the user or the service**. It can be captured by **SIM swap** (the number moves to the attacker’s SIM through social engineering), by weaknesses in the signaling network (**SS7**) and interception, or read by **malware**, and the code can also be **relayed by phishing**. It works as a **fallback**, or when the alternative is the password alone, with monitoring; the way forward is TOTP, push with number matching or passkeys.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Attack → defense",
        rotuloOrigem: "Attack",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "**SIM swap**: the attacker convinces the carrier (or an employee) to move the number to a SIM of theirs and starts receiving the victim’s messages and calls",
            destino:
              "Check for signs of a recent SIM change or number port (carrier and aggregator APIs) and require extra verification, or delay sensitive actions, after the change. Users can ask the carrier for a PIN or a port-out lock. The structural defense is **not depending on the number**: TOTP, push with context or passkeys.",
          },
          {
            origem:
              "**Network interception**: SS7 (and similar protocols) was designed for a closed network between carriers, and whoever gains access to it, through a compromised carrier or an abusive service, can redirect SMS. Over the air, fake base stations and older networks (2G) weaken the protection of the traffic",
            destino:
              "On your side there is no way to fix the network: **treat the channel as untrusted**. Do not put sensitive data in the message, keep the code short-lived and single-use, and move to factors that do not go through telephony.",
          },
          {
            origem:
              "**Malware and exposure on the device**: an app with SMS permission, notification mirroring and the code visible on the lock screen",
            destino:
              "A short, single-use code valid for a few minutes; a message that names the service and uses the domain-bound code format (`@domain #code`, on the last line), so autofill works only on the right site. Protect the device (updates, device management) and, again, use a factor outside SMS.",
          },
          {
            origem:
              "**Phishing of the code**: a fake site or a fake call asks for the code and uses it right away on the real service",
            destino:
              "A message text that says what the code is for and warns not to share it helps, but does not solve it: a convinced person hands the code over. Only **phishing-resistant** factors (passkeys, FIDO2 keys) close this path (see Q96).",
          },
          {
            origem:
              "**SMS as account recovery**: whoever controls the number resets the password and cancels any stronger factor",
            destino:
              "Do not let recovery be weaker than login: require a strong factor already enrolled, use more robust identity verification and a safety delay, and notify through every channel when a factor is changed.",
          },
          {
            origem:
              "**Channel abuse**: the attacker fires thousands of SMS to numbers that earn them revenue (SMS pumping) or floods the victim with messages",
            destino:
              "Limit sending per account, per number and per source, validate the device or use a CAPTCHA before sending, restrict the countries you serve and monitor cost by region.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The cause and the decision rule",
        texto:
          "A phone number is an **identifier that changes hands**, not a credential, and the channel is **the carrier’s**. So SMS proves, at most, that someone controls the number right now. Prefer, in this order: passkeys or FIDO2 keys, TOTP or push with number matching, and only then SMS or voice. NIST SP 800-63B treats delivery over the telephone network as a restricted authenticator, one that calls for disclosing the risk, offering an alternative and monitoring; check the current revision.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "When it is still acceptable",
        texto:
          "(1) As a **backup second factor** in a low- or medium-risk service, where the realistic alternative is the password alone: SMS still stops credential stuffing and much automated abuse. (2) To **verify possession** of the number at sign-up, which is different from authenticating. (3) For audiences without smartphones, with sending limits and SIM-change monitoring. Voice has the same risks plus one more, voicemail with a default PIN. Never as the only factor for administrative, privileged or high-value financial accounts.",
      },
    ],
    armadilhas: [
      "Calling MFA done just because the code arrives by SMS: the factor is only as strong as the carrier’s SIM-change process.",
      "Using the same number as both the login channel and the recovery channel with no extra control.",
      "Messages with a long-lived, reusable or predictable code, or that carry sensitive data next to the code.",
      "Forgetting cost and abuse: with no sending limit, SMS becomes a financial attack (SMS pumping) and a harassment channel.",
    ],
    autoteste: [
      {
        pergunta: "Why does SIM swap defeat SMS as a factor?",
        resposta:
          "Because the code goes to the number, not to the person. Whoever convinces the carrier to move the number to another SIM receives the codes as if they were the victim, without holding the victim’s phone.",
      },
      {
        pergunta: "In what situation is SMS still reasonable?",
        resposta:
          "As a fallback in low- or medium-risk services, with limits, SIM-change monitoring and a stronger alternative on offer, or to verify possession of the number at sign-up. Never as the only factor for privileged accounts.",
      },
    ],
  },
};
