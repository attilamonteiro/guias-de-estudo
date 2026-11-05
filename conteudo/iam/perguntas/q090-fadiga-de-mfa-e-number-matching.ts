import type { Pergunta } from "../../tipos";

// Q90 · Fadiga de MFA e number matching
export const q090: Pergunta = {
  numero: 90,
  modulo: "mfa-e-passkeys",
  metodo: "threat",
  pt: {
    titulo: "Fadiga de MFA e number matching",
    pergunta:
      "O que é fadiga de MFA (MFA fatigue) em notificações push e como o number matching e outras proteções reduzem esse ataque?",
    porqueEsteMetodo:
      "O ataque explora uma decisão humana repetida, então cada defesa precisa tirar uma parte do poder do atacante. Pares ataque → defesa mostram o que cada medida corta e o que sobra.",
    resposta30s:
      "A **fadiga de MFA** acontece quando um invasor que já tem a senha dispara dezenas de **notificações push** até a vítima aprovar por cansaço, engano ou só para parar o barulho. A causa é a **aprovação de um toque, sem contexto**. O **number matching** (a pessoa digita no aplicativo o número mostrado na tela de login) acaba com a aprovação às cegas, e o restante é contexto, limite de tentativas, alerta e a migração para **métodos resistentes a phishing**.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Como o push funciona e onde o ataque entra",
        etapas: [
          "A pessoa informa usuário e senha. O servidor de identidade confirma a senha e pede o segundo fator",
          "O serviço envia um pedido ao aplicativo autenticador, pelo serviço de notificações do sistema (APNs ou FCM), ligado à conta e à tentativa de login",
          "O aplicativo mostra “Aprovar ou negar?”, a pessoa libera com biometria ou PIN local, e o aplicativo responde com uma mensagem assinada pela chave guardada no aparelho no cadastro",
          "O servidor valida a assinatura e conclui o login. Não há código para digitar nem para interceptar",
          "**Onde o ataque entra**: com a senha roubada, o invasor repete as etapas 1 e 2 quantas vezes quiser, e cada tentativa gera um pedido real no telefone da vítima. Basta uma aprovação, por engano, por cansaço ou depois de uma ligação “do suporte”",
        ],
        nota: "Frente ao SMS e ao TOTP, o push tem vantagens reais: não há código para digitar ou interceptar, a resposta é ligada a uma chave do aparelho, a notificação pode mostrar contexto e a experiência é boa. O ponto fraco é a aprovação simples, e é nela que o ataque se apoia.",
      },
      {
        tipo: "pares",
        titulo: "Ataque → defesa",
        rotuloOrigem: "Ataque",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem: "Dezenas de pedidos seguidos, em geral de madrugada, até a vítima aprovar",
            destino:
              "**Number matching**: o login mostra um número e o aplicativo só aprova se a pessoa o digitar. Quem não está diante da tela de login não sabe o número, então tocar em “Aprovar” deixa de funcionar.",
          },
          {
            origem: "Pedido sem contexto: um botão “Aprovar” que não diz o que está sendo aprovado",
            destino:
              "Mostrar **a aplicação, a cidade ou o país aproximado e o dispositivo** na notificação, para a pessoa perceber que não foi ela. A localização por IP é aproximada, então serve de sinal, não de prova.",
          },
          {
            origem: "Pedidos ilimitados: o atacante tem quantas tentativas quiser",
            destino:
              "**Limitar** os pedidos por usuário e por janela de tempo, com intervalo entre eles; depois de algumas negações ou pedidos ignorados, suspender o push por um tempo e exigir outro caminho.",
          },
          {
            origem: "A vítima nega, mas ninguém fica sabendo que a conta está sob ataque",
            destino:
              "Botão **“Não fui eu”** que reporta, revoga sessões e força a troca de senha; **alerta ao usuário e à equipe de segurança** quando há pico de negações; bloqueio da conta ou da origem suspeita.",
          },
          {
            origem:
              "Engenharia social complementar: o atacante liga ou escreve fingindo ser o suporte e pede que a vítima aprove ou digite o número",
            destino:
              "Treinamento e um canal oficial de suporte que nunca pede aprovação por telefone. Com number matching, a aprovação exige um dado que o atacante precisa fazer a vítima digitar: isso reduz o ataque, mas não o encerra.",
          },
          {
            origem: "O push simples como método principal para todos, inclusive para contas privilegiadas",
            destino:
              "Migrar para **métodos resistentes a phishing** (passkeys, chaves FIDO2) e desativar o push simples por política de acesso condicional, mantendo-o, no máximo, como reserva.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Por que as passkeys evitam a fadiga",
        texto:
          "Na passkey **não existe pedido que o invasor possa disparar de longe**. A janela de autenticação aparece no navegador ou no aparelho de quem está tentando entrar, e a assinatura só sai se a credencial for do domínio daquele site. Um atacante que só tem a senha não faz o telefone da vítima tocar, e o fluxo entre dispositivos usa proximidade (Bluetooth). Não há um “Aprovar” cego para insistir nem um número a ditar para um terceiro (veja Q92 e Q96).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O number matching não é bala de prata",
        texto:
          "Number matching e contexto reduzem muito o ataque simples, mas não impedem o phishing em tempo real nem o golpista que convence a vítima a digitar o número. Meça a taxa de negações, os pedidos sem login correspondente e as contas com picos, e combine tudo com limites e com a migração para fatores resistentes a phishing. Os detalhes de configuração são do seu provedor de identidade: confira a documentação dele, pois a oferta muda.",
      },
    ],
    armadilhas: [
      "Achar que o push com um toque é seguro por ser “do aplicativo”: sem number matching e contexto, a aprovação é só um botão.",
      "Tratar uma negação como fim da história: se a vítima nega e o atacante insiste, a senha provavelmente vazou. Alerte e force a troca.",
      "Ligar o number matching e deixar o push simples habilitado como alternativa: o atacante usa o método mais fraco que ainda estiver ativo.",
      "Tomar o contexto de localização como prova: VPN e IPs de operadoras móveis enganam, então use-o como sinal.",
    ],
    autoteste: [
      {
        pergunta: "O que o number matching muda no ataque de fadiga?",
        resposta:
          "A aprovação passa a exigir digitar o número exibido na tela de login. Quem toca em “Aprovar” sem estar diante dessa tela não consegue concluir, e só um golpe adicional de engenharia social (levar a vítima a digitar o número) restaura o ataque.",
      },
      {
        pergunta: "Por que a passkey não sofre fadiga de MFA?",
        resposta:
          "Porque não há pedido que o invasor possa disparar remotamente no aparelho da vítima: a cerimônia só acontece no dispositivo de quem está entrando e só assina para o domínio certo.",
      },
    ],
  },
  en: {
    titulo: "MFA fatigue and number matching",
    pergunta:
      "What is MFA fatigue in push notifications, and how do number matching and other protections reduce that attack?",
    porqueEsteMetodo:
      "The attack exploits a repeated human decision, so each defense has to take away part of the attacker’s power. Attack → defense pairs show what each measure cuts and what remains.",
    resposta30s:
      "**MFA fatigue** happens when an attacker who already has the password fires dozens of **push notifications** until the victim approves out of tiredness, confusion or just to stop the noise. The cause is **one-tap approval with no context**. **Number matching** (the person types into the app the number shown on the login screen) ends blind approval, and the rest is context, attempt limits, alerts and a move to **phishing-resistant methods**.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "How push works and where the attack enters",
        etapas: [
          "The person enters username and password. The identity server confirms the password and asks for the second factor",
          "The service sends a request to the authenticator app through the system notification service (APNs or FCM), tied to the account and the login attempt",
          "The app shows “Approve or deny?”, the person unlocks it with a local biometric or PIN, and the app replies with a message signed by the key stored on the device at enrollment",
          "The server validates the signature and completes the login. There is no code to type or to intercept",
          "**Where the attack enters**: with the stolen password, the attacker repeats steps 1 and 2 as often as they like, and each attempt produces a real prompt on the victim’s phone. One approval is enough, by mistake, out of fatigue or after a call “from support”",
        ],
        nota: "Compared with SMS and TOTP, push has real advantages: no code to type or intercept, the response is tied to a key on the device, the notification can show context and the experience is good. The weak point is simple approval, and that is what the attack leans on.",
      },
      {
        tipo: "pares",
        titulo: "Attack → defense",
        rotuloOrigem: "Attack",
        rotuloDestino: "Defense",
        pares: [
          {
            origem: "Dozens of requests in a row, usually at night, until the victim approves",
            destino:
              "**Number matching**: the login shows a number and the app approves only if the person types it. Someone who is not in front of the login screen does not know the number, so tapping “Approve” stops working.",
          },
          {
            origem: "A request with no context: an “Approve” button that does not say what is being approved",
            destino:
              "Show **the application, the approximate city or country and the device** in the notification, so the person can tell it was not them. IP-based location is approximate, so it is a signal, not proof.",
          },
          {
            origem: "Unlimited requests: the attacker gets as many attempts as they want",
            destino:
              "**Limit** requests per user and per time window, with a gap between them; after a few denials or ignored prompts, suspend push for a while and require another route.",
          },
          {
            origem: "The victim denies, but nobody learns the account is under attack",
            destino:
              "A **“It wasn’t me”** button that reports, revokes sessions and forces a password change; **alerts to the user and the security team** when denials spike; blocking the account or the suspicious source.",
          },
          {
            origem:
              "Complementary social engineering: the attacker calls or writes pretending to be support and asks the victim to approve or type the number",
            destino:
              "Training and an official support channel that never asks for approval by phone. With number matching, approval needs a value the attacker has to get the victim to type: that reduces the attack but does not end it.",
          },
          {
            origem: "Simple push as the main method for everyone, including privileged accounts",
            destino:
              "Move to **phishing-resistant methods** (passkeys, FIDO2 keys) and disable simple push through a conditional access policy, keeping it at most as a fallback.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Why passkeys avoid fatigue",
        texto:
          "With a passkey **there is no request the attacker can trigger from afar**. The authentication prompt appears in the browser or on the device of whoever is trying to sign in, and the signature only comes out if the credential belongs to that site’s domain. An attacker who has only the password cannot make the victim’s phone ring, and the cross-device flow relies on proximity (Bluetooth). There is no blind “Approve” to keep pushing and no number to read out to a third party (see Q92 and Q96).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Number matching is not a silver bullet",
        texto:
          "Number matching and context greatly reduce the simple attack, but they do not stop real-time phishing or the scammer who convinces the victim to type the number. Measure the denial rate, requests with no matching login and accounts with spikes, and combine everything with limits and with the move to phishing-resistant factors. Configuration details belong to your identity provider: check its documentation, because the offering changes.",
      },
    ],
    armadilhas: [
      "Assuming one-tap push is safe because it comes from “the app”: without number matching and context, approval is just a button.",
      "Treating a denial as the end of the story: if the victim denies and the attacker persists, the password has probably leaked. Alert and force a change.",
      "Turning on number matching and leaving simple push enabled as an alternative: the attacker uses the weakest method still active.",
      "Taking location context as proof: VPNs and mobile-carrier IPs mislead, so use it as a signal.",
    ],
    autoteste: [
      {
        pergunta: "What does number matching change in a fatigue attack?",
        resposta:
          "Approval now requires typing the number shown on the login screen. Someone who taps “Approve” without being in front of that screen cannot complete it, and only an extra social-engineering trick (getting the victim to type the number) restores the attack.",
      },
      {
        pergunta: "Why do passkeys not suffer from MFA fatigue?",
        resposta:
          "Because there is no request the attacker can trigger remotely on the victim’s device: the ceremony only happens on the device of whoever is signing in and only signs for the right domain.",
      },
    ],
  },
};
