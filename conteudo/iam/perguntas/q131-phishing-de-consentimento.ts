import type { Pergunta } from "../../tipos";

// Q131 · Phishing de consentimento
export const q131: Pergunta = {
  numero: 131,
  modulo: "ataques-e-depuracao",
  metodo: "threat",
  pt: {
    titulo: "Phishing de consentimento",
    pergunta:
      "O que é phishing de consentimento (consent phishing) e device code phishing? Como um aplicativo malicioso obtém acesso sem roubar senha, e como a organização se defende?",
    porqueEsteMetodo:
      "Aqui o ataque não passa por senha nem por MFA, então é preciso enxergar o caminho exato do invasor. Os pares mostram cada etapa e o controle, quase sempre organizacional, que a bloqueia.",
    resposta30s:
      "No **consent phishing**, o usuário aprova, numa tela de consentimento verdadeira, escopos amplos para um app do invasor, que passa a acessar os dados pela API do provedor com tokens próprios, sem nunca ver a senha. No **device code phishing**, o invasor inicia o fluxo e convence a vítima a digitar o código dele na página legítima; quem recebe os tokens é o dispositivo do invasor. O MFA não ajuda, porque o usuário se autentica de verdade: a defesa é **consentimento do administrador, apps verificados, escopos mínimos, device code bloqueado onde possível e monitoramento das concessões**.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ataque → defesa",
        rotuloOrigem: "Ataque ou causa",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "**Consent phishing**: um e-mail ou mensagem leva à página real do provedor de identidade, que mostra o consentimento de um app registrado pelo invasor (nome e logotipo parecidos com um produto conhecido) pedindo escopos amplos, como ler e-mail e arquivos e manter acesso offline. O usuário já está autenticado e clica em aceitar.",
            destino:
              "**Política de consentimento**: o usuário só consente escopos de baixo risco e em apps de **publisher verificado**; o resto cai em **consentimento do administrador**, com um fluxo de solicitação de aprovação.",
          },
          {
            origem:
              "Depois do aceite, o app recebe access e refresh token e lê os dados direto pela API, em nome do usuário. Não há senha a trocar nem MFA a repetir, e trocar a senha não revoga a concessão.",
            destino:
              "Revogar a **concessão** e os tokens do app, e remover o app da organização; trocar a senha não basta. Inventariar as concessões existentes e agir sobre as de risco (veja Q140).",
          },
          {
            origem:
              "**Device code phishing**: o invasor inicia o fluxo de device code (RFC 8628) no provedor real e recebe um `user_code`. Por e-mail, chat ou ligação, convence a vítima a abrir o endereço legítimo do provedor, digitar o código e fazer login, inclusive com MFA. O dispositivo do invasor, que consulta o provedor em ciclos, recebe os tokens.",
            destino:
              "**Bloquear ou restringir o device code**: permitir só para quem precisa (TVs, CLIs, dispositivos sem teclado), por política de acesso condicional ou configuração do provedor, e confirmar na documentação do seu fornecedor como filtrar esse fluxo.",
          },
          {
            origem:
              "A isca do código chega de fora (“digite este código para ver o documento” ou “para entrar na reunião”), e a página de verificação não mostra quem iniciou o fluxo.",
            destino:
              "Treinar para uma regra simples: um código só se digita no aparelho que **você** está configurando, nunca a pedido de terceiros. A página de verificação deve mostrar o nome do app e pedir confirmação, e o código deve ter validade curta (a RFC 8628 discute esse risco).",
          },
          {
            origem:
              "Apps maliciosos com aparência confiável, registrados em outro tenant ou com nome e logotipo de produtos conhecidos.",
            destino:
              "**Apps verificados**: exigir verificação de publisher, manter lista permitida de apps e bloquear o consentimento de apps de fora da organização quando o negócio permitir.",
          },
          {
            origem: "Escopos amplos e duradouros aprovados sem entendimento, porque todo app pede tudo.",
            destino:
              "Nos **seus** apps, pedir o mínimo e de forma incremental, para que um pedido amplo pareça anômalo. Mostrar nome do app, publisher e escopos em linguagem clara (veja Q30).",
          },
          {
            origem: "A concessão nova passa despercebida por semanas.",
            destino:
              "**Monitorar e alertar**: novos consentimentos com escopos de alto risco, apps novos com acesso a e-mail ou arquivos, leitura em massa. Revisão periódica das concessões (Q119) e trilha de auditoria (Q139).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A resposta do device code, que o invasor mesmo pediu",
        legenda: "JSON",
        codigo: `{
  "device_code": "GmRhmhcxhwAzkoEqiMEg_DnyEysNkuNhszIySk9eS",
  "user_code": "WDJB-MJHT",
  "verification_uri": "https://idp.example.com/device",
  "expires_in": 900,
  "interval": 5
}`,
        nota: "O endereço e o certificado são os do provedor real: o que o invasor controla é o `user_code`, que ele envia à vítima. Quando ela o digita e aprova, o `device_code` (que só o invasor conhece) passa a render tokens no `token_endpoint`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O ataque pede autorização, não credencial",
        texto:
          "Senha forte, MFA e passkeys protegem o **login**, não a **decisão de consentir**. A defesa está no que pode ser consentido (política de consentimento, publishers verificados, aprovação do administrador), nos fluxos permitidos (device code só onde há necessidade) e no monitoramento das concessões. O consentimento é uma decisão de privilégio: mínimo para o usuário, administrador para o resto.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A página é legítima",
        texto:
          "Domínio e certificado estão corretos, então “confira o endereço” não resolve. O usuário precisa checar **qual app** pede **quais escopos** e, no device code, **de onde veio o código**. Os controles variam por provedor (Entra ID, Okta, Google Workspace, entre outros): aqui estão os conceitos, e os detalhes ficam na documentação do fornecedor.",
      },
    ],
    armadilhas: [
      "Achar que o MFA ou a passkey resolve: o usuário se autentica de verdade e depois autoriza o app do invasor.",
      "Deixar qualquer usuário consentir qualquer app e escopo “para não atrapalhar”: cada consentimento amplo é uma credencial duradoura emitida pelo próprio usuário.",
      "Responder só trocando a senha: sem revogar a concessão, os tokens e o app, o acesso continua.",
      "Manter o device code habilitado para todos por padrão, quando só alguns casos (CLIs, TVs) realmente o usam.",
    ],
    autoteste: [
      {
        pergunta: "Por que o MFA não impede o consent phishing?",
        resposta:
          "Porque não há senha a roubar nem login a forjar: o usuário real se autentica, com o MFA dele, e então consente. O app do invasor recebe tokens autorizados legitimamente.",
      },
      {
        pergunta: "No device code phishing, onde a vítima digita o código e quem recebe os tokens?",
        resposta:
          "Ela digita na página legítima do provedor; quem recebe os tokens é o dispositivo do invasor, que iniciou o fluxo e consulta o provedor em ciclos. A defesa é restringir o device code e nunca digitar códigos recebidos de terceiros.",
      },
    ],
  },
  en: {
    titulo: "Consent phishing",
    pergunta:
      "What are consent phishing and device code phishing? How does a malicious app gain access without stealing a password, and how does the organization defend itself?",
    porqueEsteMetodo:
      "Here the attack goes through neither password nor MFA, so you need to see the attacker’s exact path. The pairs show each step and the control, usually organizational, that blocks it.",
    resposta30s:
      "In **consent phishing**, the user approves, on a genuine consent screen, broad scopes for an attacker’s app, which then reads the data through the provider’s API with its own tokens, never seeing the password. In **device code phishing**, the attacker starts the flow and convinces the victim to type the attacker’s code on the legitimate page; the attacker’s device receives the tokens. MFA does not help, because the user really authenticates: the defense is **admin consent, verified apps, minimal scopes, device code blocked where possible and monitoring of grants**.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Attack → defense",
        rotuloOrigem: "Attack or cause",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "**Consent phishing**: an email or message leads to the real identity provider page, which shows the consent of an app registered by the attacker (name and logo similar to a known product) asking for broad scopes, such as reading mail and files and keeping offline access. The user is already authenticated and clicks accept.",
            destino:
              "**Consent policy**: the user may only consent to low-risk scopes and to apps from a **verified publisher**; everything else falls to **admin consent**, with an approval-request flow.",
          },
          {
            origem:
              "After the accept, the app receives an access and a refresh token and reads the data straight through the API, on the user’s behalf. There is no password to change and no MFA to repeat, and changing the password does not revoke the grant.",
            destino:
              "Revoke the **grant** and the app’s tokens, and remove the app from the organization; changing the password is not enough. Inventory the existing grants and act on the risky ones (see Q140).",
          },
          {
            origem:
              "**Device code phishing**: the attacker starts the device code flow (RFC 8628) at the real provider and gets a `user_code`. By email, chat or phone call, they convince the victim to open the provider’s legitimate address, type the code and sign in, MFA included. The attacker’s device, which polls the provider, receives the tokens.",
            destino:
              "**Block or restrict device code**: allow it only for those who need it (TVs, CLIs, devices without a keyboard), through a conditional access policy or the provider’s configuration, and check your vendor’s documentation for how to filter this flow.",
          },
          {
            origem:
              "The code bait arrives from outside (“type this code to see the document” or “to join the meeting”), and the verification page does not show who started the flow.",
            destino:
              "Train people on one simple rule: a code is only typed on the device that **you** are setting up, never at someone else’s request. The verification page should show the app name and ask for confirmation, and the code should be short-lived (RFC 8628 discusses this risk).",
          },
          {
            origem:
              "Malicious apps that look trustworthy, registered in another tenant or using the name and logo of well-known products.",
            destino:
              "**Verified apps**: require publisher verification, keep an allowlist of apps and block consent for apps from outside the organization where the business allows.",
          },
          {
            origem: "Broad, long-lived scopes approved without understanding, because every app asks for everything.",
            destino:
              "In **your** apps, ask for the minimum and incrementally, so a broad request looks anomalous. Show the app name, the publisher and the scopes in plain language (see Q30).",
          },
          {
            origem: "The new grant goes unnoticed for weeks.",
            destino:
              "**Monitor and alert**: new consents with high-risk scopes, new apps with access to mail or files, bulk reads. Periodic review of grants (Q119) and an audit trail (Q139).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The device code response, which the attacker requested",
        legenda: "JSON",
        codigo: `{
  "device_code": "GmRhmhcxhwAzkoEqiMEg_DnyEysNkuNhszIySk9eS",
  "user_code": "WDJB-MJHT",
  "verification_uri": "https://idp.example.com/device",
  "expires_in": 900,
  "interval": 5
}`,
        nota: "The address and the certificate are the real provider’s: what the attacker controls is the `user_code`, which they send to the victim. When the victim types it and approves, the `device_code` (known only to the attacker) starts yielding tokens at the `token_endpoint`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The attack asks for authorization, not credentials",
        texto:
          "A strong password, MFA and passkeys protect the **login**, not the **decision to consent**. The defense lies in what can be consented to (consent policy, verified publishers, admin approval), in the flows allowed (device code only where needed) and in monitoring grants. Consent is a privilege decision: minimal for the user, administrator for the rest.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The page is legitimate",
        texto:
          "The domain and certificate are correct, so “check the address” does not solve it. The user has to check **which app** is asking for **which scopes** and, with device code, **where the code came from**. Controls vary by provider (Entra ID, Okta, Google Workspace, among others): the concepts are here, and the details are in the vendor’s documentation.",
      },
    ],
    armadilhas: [
      "Believing MFA or a passkey solves it: the user truly authenticates and then authorizes the attacker’s app.",
      "Letting any user consent to any app and scope “so as not to get in the way”: every broad consent is a long-lived credential issued by the user.",
      "Responding only by changing the password: without revoking the grant, the tokens and the app, the access continues.",
      "Keeping device code enabled for everyone by default, when only a few cases (CLIs, TVs) really use it.",
    ],
    autoteste: [
      {
        pergunta: "Why does MFA not stop consent phishing?",
        resposta:
          "Because there is no password to steal and no login to forge: the real user authenticates, with their own MFA, and then consents. The attacker’s app receives tokens that were legitimately authorized.",
      },
      {
        pergunta: "In device code phishing, where does the victim type the code and who receives the tokens?",
        resposta:
          "They type it on the provider’s legitimate page; the tokens go to the attacker’s device, which started the flow and polls the provider. The defense is to restrict device code and never type codes received from third parties.",
      },
    ],
  },
};
