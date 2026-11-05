import type { Pergunta } from "../../tipos";

// Q140 · Resposta a conta comprometida
export const q140: Pergunta = {
  numero: 140,
  modulo: "ataques-e-depuracao",
  metodo: "playbook",
  pt: {
    titulo: "Resposta a conta comprometida",
    pergunta:
      "Você detecta um padrão de login suspeito ou uma conta comprometida. Que passos de resposta executa, em que ordem, e como verifica que o invasor foi contido?",
    porqueEsteMetodo:
      "Numa conta comprometida a ordem importa: o que se corta primeiro e o que se preserva decidem o estrago. O playbook dá a sequência e o sinal de “pronto” de cada etapa.",
    resposta30s:
      "Confirme o sinal nos logs e preserve a evidência; **contenha logo**: revogue sessões e tokens, redefina a credencial e **remova fatores de MFA desconhecidos**. Depois avalie o alcance (linha do tempo do que a conta acessou), **procure persistência** (regras de e-mail, aplicativos consentidos, novas chaves) e erradique. Notifique conforme as exigências legais e contratuais, aprenda com a causa-raiz e verifique a contenção testando que os tokens antigos são recusados e que não há novos sinais.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook de conta comprometida",
        passos: [
          {
            titulo: "1. Confirme o sinal e preserve a evidência",
            texto:
              "Reúna dos logs: hora (UTC), IPs, user agents, aplicação, método de autenticação, resultado e ID da sessão, e compare com o histórico da conta e com as explicações inocentes (veja a tabela). Copie os logs relevantes para um lugar seguro, pois alguns serviços os retêm por pouco tempo. Sinal de que é real: fatos que a pessoa não reconhece ou persistência já criada. Na dúvida razoável, contenha: reativar uma conta custa menos do que deixá-la aberta.",
          },
          {
            titulo: "2. Contenha, na ordem certa",
            texto:
              "(1) **Revogue sessões e tokens** (cookies e refresh tokens; um access token autônomo vale até expirar se a API não consultar o emissor, veja Q77 e Q35). (2) **Redefina a credencial** e invalide senhas de aplicativo e chaves de API da pessoa. (3) **Revise os fatores de MFA**: remova os desconhecidos e exija novo registro com verificação forte de identidade (veja Q100). (4) Se o risco for alto, desabilite a conta durante a análise. Avise a pessoa por um canal já conhecido, nunca pelo e-mail da própria conta. Sinal de sucesso: nenhuma sessão ativa, e o cookie e o refresh token antigos são recusados.",
          },
          {
            titulo: "3. Avalie o alcance",
            texto:
              "Monte a linha do tempo da conta desde o **primeiro** sinal (o primeiro login suspeito raramente é o primeiro acesso do invasor): o que foi acessado, baixado, enviado ou alterado, e que outras contas e sistemas a credencial alcançou (veja Q138). Descubra a origem provável: phishing, reutilização de senha vazada, malware no dispositivo ou interceptação em tempo real (veja Q97).",
          },
          {
            titulo: "4. Procure persistência e erradique",
            texto:
              "O invasor deixa meios de voltar: regras de caixa de entrada que encaminham e-mail, aplicativos com consentimento OAuth (veja Q131), chaves de API, tokens de acesso pessoal, chaves SSH, fatores de MFA e dispositivos registrados, delegações, usuários ou papéis criados. Remova tudo. Se a conta era privilegiada ou o dispositivo está suspeito, isole-o e rotacione os segredos que a conta conhecia.",
          },
          {
            titulo: "5. Recupere e verifique a contenção",
            texto:
              "Devolva o acesso com autenticação forte (de preferência resistente a phishing, veja Q96) e vigie a conta por um tempo com alertas mais sensíveis. Critérios: o token e o cookie antigos são recusados (teste de verdade); não há login novo do IP, da rede ou do dispositivo do invasor depois da contenção; nenhuma regra, consentimento ou fator novo apareceu; as outras contas que usavam a mesma senha foram redefinidas.",
          },
          {
            titulo: "6. Notifique",
            texto:
              "Acione o responsável por segurança, o jurídico e, quando for o caso, o RH. Se dados pessoais ou de clientes foram acessados, leis de proteção de dados e contratos podem exigir aviso a autoridades e às pessoas afetadas, com prazos: confirme com o jurídico o que se aplica. Registre quem decidiu o quê e quando.",
          },
          {
            titulo: "7. Aprenda",
            texto:
              "Faça uma revisão sem culpa da causa-raiz e do que atrasou a detecção e a contenção: faltou MFA resistente a phishing, bloqueio de senhas vazadas, acesso condicional por dispositivo ou um alerta? Vire isso em ajuste de regra, de política e do próprio roteiro. O guia de tratamento de incidentes do NIST (SP 800-61) descreve o ciclo: preparar, detectar e analisar, conter, erradicar e recuperar, aprender.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Padrões de login suspeito e como confirmá-los",
        colunas: ["Padrão", "Como confirmar", "Explicação inocente comum"],
        linhas: [
          [
            "Login de local ou rede nunca vistos, ou “viagem impossível” entre dois logins",
            "Compare IP, país, provedor, dispositivo e user agent com o histórico",
            "VPN, rede móvel, viagem real",
          ],
          [
            "Muitas falhas seguidas de um sucesso (força bruta, password spray, credential stuffing)",
            "Conte as falhas por conta e por IP; veja se o mesmo IP tentou várias contas (veja Q134)",
            "Pessoa que esqueceu a senha; integração com senha antiga",
          ],
          [
            "Pedidos de MFA em série que a pessoa não iniciou",
            "Veja o volume de desafios e se algum foi aprovado; pergunte à pessoa por um canal conhecido (veja Q90)",
            "Aplicativo com sessão expirada pedindo autenticação",
          ],
          [
            "Registro de novo fator ou dispositivo logo depois de um login atípico",
            "Veja quem registrou, de onde, e a ordem dos eventos",
            "Troca de celular",
          ],
          [
            "Token ou sessão usados de dois lugares ao mesmo tempo",
            "Compare IP e user agent em chamadas simultâneas (veja Q130)",
            "Dispositivo trocando de rede",
          ],
          [
            "Acesso a aplicações ou volume de dados que a pessoa nunca usou",
            "Compare com a linha de base dela e do grupo",
            "Início de um projeto novo",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Contenção primeiro, análise profunda depois",
        texto:
          "Quando o sinal é forte, **contenha antes de concluir a investigação**: cada hora com a sessão do invasor aberta amplia o alcance. A ressalva é preservar a evidência antes (cópia dos logs) e anotar o que foi feito e em que ordem. Em conta de alto privilégio (administrador, serviço), acione o roteiro completo de incidente, não só o da conta de usuário.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Trocar a senha não expulsa o invasor",
        texto:
          "A senha nova não encerra sessões já abertas nem refresh tokens, e o invasor pode ter registrado o próprio fator de MFA, criado um aplicativo consentido ou uma regra de encaminhamento. Sem revogar sessões, revisar fatores e caçar persistência, ele continua com acesso ou volta quando quiser.",
      },
    ],
    armadilhas: [
      "Só trocar a senha: sessões e refresh tokens continuam vivos, e o invasor pode ter registrado o próprio fator de MFA.",
      "Esquecer a persistência (regras de encaminhamento, aplicativos consentidos, chaves de API): o invasor volta depois de a senha mudar.",
      "Avisar a pessoa pelo canal comprometido (o e-mail da própria conta) ou investigar por muito tempo antes de conter.",
      "Declarar “resolvido” sem testar a contenção nem achar a causa-raiz (senha reutilizada, phishing, malware no dispositivo).",
    ],
    autoteste: [
      {
        pergunta: "Por que trocar a senha não basta numa conta comprometida?",
        resposta:
          "Porque sessões abertas e refresh tokens continuam válidos, e o invasor pode ter deixado persistência: um fator de MFA registrado, um aplicativo consentido, uma regra de encaminhamento ou uma chave de API. É preciso revogar sessões e tokens, revisar fatores e remover o que ele criou.",
      },
      {
        pergunta: "Que evidências mostram que o invasor foi contido?",
        resposta:
          "O cookie e o refresh token antigos são recusados num teste real; não há atividade nova do IP, da rede ou do dispositivo do invasor depois da contenção; nenhum fator, consentimento ou regra novo apareceu; e as contas com a mesma senha foram redefinidas. Tudo registrado com horários.",
      },
    ],
  },
  en: {
    titulo: "Responding to a compromised account",
    pergunta:
      "You detect a suspicious login pattern or a compromised account. What response steps do you take, in what order, and how do you verify the attacker has been contained?",
    porqueEsteMetodo:
      "With a compromised account, order matters: what you cut first and what you preserve decide the damage. The playbook gives the sequence and the “done” signal of each stage.",
    resposta30s:
      "Confirm the signal in the logs and preserve the evidence; **contain quickly**: revoke sessions and tokens, reset the credential and **remove unknown MFA factors**. Then assess the reach (a timeline of what the account accessed), **hunt for persistence** (mail rules, consented apps, new keys) and eradicate. Notify as legal and contractual requirements demand, learn from the root cause and verify containment by testing that the old tokens are rejected and that no new signs appear.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Compromised-account playbook",
        passos: [
          {
            titulo: "1. Confirm the signal and preserve the evidence",
            texto:
              "Gather from the logs: time (UTC), IPs, user agents, application, authentication method, result and session ID, and compare with the account’s history and the innocent explanations (see the table). Copy the relevant logs to a safe place, since some services keep them only briefly. A sign it is real: facts the person does not recognize or persistence already created. With reasonable doubt, contain: reactivating an account costs less than leaving it open.",
          },
          {
            titulo: "2. Contain, in the right order",
            texto:
              "(1) **Revoke sessions and tokens** (cookies and refresh tokens; a self-contained access token is valid until it expires unless the API asks the issuer, see Q77 and Q35). (2) **Reset the credential** and invalidate the person’s app passwords and API keys. (3) **Review the MFA factors**: remove unknown ones and require re-enrollment with strong identity verification (see Q100). (4) If the risk is high, disable the account during the analysis. Contact the person through an already-known channel, never through the account’s own email. Sign of success: no active sessions, and the old cookie and refresh token are rejected.",
          },
          {
            titulo: "3. Assess the reach",
            texto:
              "Build the account’s timeline from the **first** signal (the first suspicious login is rarely the attacker’s first access): what was accessed, downloaded, sent or changed, and which other accounts and systems the credential reached (see Q138). Find the likely origin: phishing, reuse of a leaked password, malware on the device or real-time interception (see Q97).",
          },
          {
            titulo: "4. Hunt for persistence and eradicate",
            texto:
              "The attacker leaves ways back in: inbox rules that forward mail, apps with OAuth consent (see Q131), API keys, personal access tokens, SSH keys, registered MFA factors and devices, delegations, created users or roles. Remove everything. If the account was privileged or the device is suspect, isolate it and rotate the secrets the account knew.",
          },
          {
            titulo: "5. Recover and verify containment",
            texto:
              "Give access back with strong authentication (preferably phishing-resistant, see Q96) and watch the account for a while with more sensitive alerts. Criteria: the old token and cookie are rejected (test it for real); there is no new login from the attacker’s IP, network or device after containment; no new rule, consent or factor appeared; other accounts using the same password were reset.",
          },
          {
            titulo: "6. Notify",
            texto:
              "Bring in the security owner, legal and, where relevant, HR. If personal or customer data was accessed, data protection laws and contracts may require notice to authorities and affected people, with deadlines: confirm with legal what applies. Record who decided what and when.",
          },
          {
            titulo: "7. Learn",
            texto:
              "Run a blameless review of the root cause and of what delayed detection and containment: was phishing-resistant MFA, leaked-password blocking, device-based conditional access or an alert missing? Turn it into rule, policy and runbook changes. NIST’s incident handling guide (SP 800-61) describes the cycle: prepare, detect and analyze, contain, eradicate and recover, learn.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Suspicious login patterns and how to confirm them",
        colunas: ["Pattern", "How to confirm", "Common innocent explanation"],
        linhas: [
          [
            "Login from a location or network never seen, or an “impossible travel” between two logins",
            "Compare IP, country, provider, device and user agent with the history",
            "VPN, mobile network, real travel",
          ],
          [
            "Many failures followed by a success (brute force, password spray, credential stuffing)",
            "Count failures per account and per IP; see whether the same IP tried several accounts (see Q134)",
            "A person who forgot the password; an integration with an old password",
          ],
          [
            "A burst of MFA prompts the person did not start",
            "Look at the volume of challenges and whether any was approved; ask the person through a known channel (see Q90)",
            "An app with an expired session asking for authentication",
          ],
          [
            "Registration of a new factor or device right after an atypical login",
            "See who registered it, from where, and the order of events",
            "A phone replacement",
          ],
          [
            "A token or session used from two places at once",
            "Compare IP and user agent across simultaneous calls (see Q130)",
            "A device switching networks",
          ],
          [
            "Access to applications or a data volume the person never used",
            "Compare with their own baseline and their group’s",
            "Start of a new project",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Contain first, analyze deeply later",
        texto:
          "When the signal is strong, **contain before finishing the investigation**: every hour with the attacker’s session open widens the reach. The caveat is to preserve evidence first (copy the logs) and to note what was done and in what order. For a high-privilege account (administrator, service), trigger the full incident runbook, not only the user-account one.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Changing the password does not evict the attacker",
        texto:
          "A new password does not end sessions that are already open or refresh tokens, and the attacker may have enrolled their own MFA factor, created a consented app or a forwarding rule. Without revoking sessions, reviewing factors and hunting persistence, they keep access or come back whenever they like.",
      },
    ],
    armadilhas: [
      "Only changing the password: sessions and refresh tokens stay alive, and the attacker may have enrolled their own MFA factor.",
      "Forgetting persistence (forwarding rules, consented apps, API keys): the attacker returns after the password changes.",
      "Contacting the person through the compromised channel (the account’s own email) or investigating too long before containing.",
      "Declaring it “resolved” without testing containment or finding the root cause (reused password, phishing, malware on the device).",
    ],
    autoteste: [
      {
        pergunta: "Why is changing the password not enough on a compromised account?",
        resposta:
          "Because open sessions and refresh tokens remain valid, and the attacker may have left persistence: an enrolled MFA factor, a consented app, a forwarding rule or an API key. You must revoke sessions and tokens, review factors and remove what they created.",
      },
      {
        pergunta: "What evidence shows the attacker has been contained?",
        resposta:
          "The old cookie and refresh token are rejected in a real test; there is no new activity from the attacker’s IP, network or device after containment; no new factor, consent or rule appeared; and accounts sharing the password were reset. All of it recorded with timestamps.",
      },
    ],
  },
};
