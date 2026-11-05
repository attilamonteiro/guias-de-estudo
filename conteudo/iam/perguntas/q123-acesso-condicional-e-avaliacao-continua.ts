import type { Pergunta } from "../../tipos";

// Q123 · Acesso condicional e avaliação contínua
export const q123: Pergunta = {
  numero: 123,
  modulo: "autorizacao",
  metodo: "feynman",
  pt: {
    titulo: "Acesso condicional e avaliação contínua",
    pergunta:
      "O que é acesso condicional e avaliação contínua de acesso? Como sinais como dispositivo, localização, risco do usuário e sensibilidade do recurso entram na decisão?",
    porqueEsteMetodo:
      "Acesso condicional parece um emaranhado de regras até você enxergar um porteiro que olha várias coisas antes de abrir a porta. A analogia dá a intuição; o mecanismo (sinais, resultados, eventos) vem depois, junto com o ponto em que a imagem para de valer.",
    resposta30s:
      "**Acesso condicional** é um conjunto de regras “se sinais, então resultado”, avaliadas a cada autenticação: identidade, dispositivo, local, risco e sensibilidade do recurso levam a permitir, exigir MFA ou dispositivo conforme, limitar a sessão ou bloquear. A **avaliação contínua de acesso** repete a verificação depois do login: quando acontece um evento crítico (conta desativada, risco alto, dispositivo fora da conformidade), os recursos recusam o token antes de ele expirar. Comece sempre em modo só-relatório e preserve contas de emergência.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine o porteiro de um prédio comercial. Ele não se limita a olhar o crachá: confere **quem é** a pessoa, **que horas são**, **a que andar** ela quer ir e **em que estado** chega (crachá novo, crachá reportado como perdido). As regras são do tipo “se... então...”: crachá válido em horário comercial, entra; fora do horário, precisa de uma segunda confirmação; para o andar do cofre, só com autorização especial; crachá reportado como roubado, não entra. E o porteiro não esquece de você depois que entra: se a administração cancela o seu crachá no meio do expediente, ele recebe o aviso por rádio e acompanha você até a saída.",
        tecnico:
          "O **acesso condicional** é um motor de políticas: **se** (usuário ou grupo, aplicação, dispositivo, localização, risco, aplicativo cliente) **então** (permitir, exigir MFA ou autenticação resistente a phishing, exigir dispositivo conforme, limitar a sessão, bloquear). Ele roda quando a pessoa se autentica e o IdP emite o token. A política é **dinâmica**: decide com os sinais do momento, ao contrário da regra estática (“esta faixa de IP entra”), que não muda com o contexto. A **avaliação contínua de acesso** (CAE) leva a decisão para depois da emissão: o IdP publica eventos críticos (conta desativada, senha trocada, sessão revogada, risco alto, mudança de local) e os recursos inscritos passam a recusar o token **antes de ele expirar**; o cliente volta ao IdP, que reavalia. Há padrões para esse aviso, como o Shared Signals Framework e o perfil CAEP, da OpenID Foundation; confira o suporte do seu fornecedor.",
        limite:
          "O porteiro reconhece rostos; o sistema só enxerga **sinais**, e sinais erram: um IP de VPN parece viagem impossível, a geolocalização é imprecisa e a postura de um dispositivo declarada por ele mesmo pode ser falsa se não houver atestação por hardware ou gerenciamento. A política também decide **o acesso à aplicação**, e não o que a pessoa pode fazer lá dentro (isso é autorização, veja Q115). E, sem CAE, um token já emitido vale até expirar (veja Q77 e Q78).",
      },
      {
        tipo: "tabela",
        titulo: "Os sinais e o que cada um acrescenta",
        colunas: ["Sinal", "O que informa", "Exemplo de condição", "Resultado típico"],
        linhas: [
          [
            "Identidade, grupo e papel",
            "Quem é e o que costuma poder fazer",
            "Usuário é administrador",
            "Exigir autenticação mais forte",
          ],
          [
            "Postura do dispositivo",
            "Saúde: gerenciado, conforme, cifrado, EDR ativo, sistema atualizado",
            "Dispositivo não conforme",
            "Bloquear ou dar acesso só pelo navegador, sem download",
          ],
          [
            "Tipo de dispositivo (corporativo, pessoal, móvel, IoT)",
            "Nível de controle da empresa sobre o aparelho",
            "Dispositivo pessoal (BYOD)",
            "Sessão limitada por aplicativo, sem baixar arquivos; IoT por certificado do dispositivo e segmento restrito",
          ],
          [
            "Local e rede",
            "País, rede conhecida, reputação do IP, viagem impossível",
            "Login de um país nunca usado",
            "Exigir MFA ou bloquear",
          ],
          [
            "Risco de login e de usuário",
            "Probabilidade de comprometimento, calculada pelo IdP",
            "Risco médio ou alto",
            "Exigir MFA, troca de senha ou bloquear",
          ],
          [
            "Sensibilidade do recurso",
            "Quanto custa um erro neste aplicativo ou dado",
            "Folha de pagamento, console de produção",
            "Exigir dispositivo conforme e sessão curta",
          ],
          [
            "Força da autenticação e cliente",
            "Como e há quanto tempo a pessoa autenticou; qual aplicativo cliente",
            "Protocolo legado sem MFA, SMS como único fator",
            "Bloquear o cliente legado; exigir método resistente a phishing",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Uma política como dado",
        legenda: "JSON",
        codigo: `{
  "nome": "Folha de pagamento: MFA forte e sessão limitada",
  "modo": "somente_relatorio",
  "se": {
    "aplicacao": "folha-de-pagamento",
    "usuarios": { "incluir": ["todos"], "excluir": ["contas-de-emergencia"] },
    "qualquer_um_de": [{ "risco_de_login": "medio_ou_alto" }, { "dispositivo_conforme": false }]
  },
  "entao": {
    "exigir": ["mfa_resistente_a_phishing"],
    "sessao": { "reautenticar_apos": "4h", "baixar_arquivos": false }
  }
}`,
        nota: "Formato ilustrativo, de nenhum produto específico. Nos produtos reais o modo só-relatório (“report-only”) tem outros nomes; confira a documentação do seu IdP.",
      },
      {
        tipo: "fluxo",
        titulo: "Do login à revogação em quase tempo real",
        etapas: [
          "No login, o IdP avalia as políticas com os sinais do momento (pessoa, dispositivo, local, risco) e, se preciso, exige MFA",
          "Se o resultado permite, o IdP emite um token de **curta duração** para o aplicativo",
          "A pessoa trabalha normalmente; o aplicativo aceita o token enquanto ele for válido",
          "Ocorre um evento crítico: o RH desliga a pessoa, o dispositivo perde a conformidade ou o risco sobe",
          "O IdP avisa os recursos inscritos (por exemplo, por eventos CAEP); o recurso recusa o token mesmo dentro do prazo e responde com um desafio",
          "O cliente volta ao IdP, que reavalia a política: se ainda atende, emite um token novo; se não, bloqueia ou exige outra verificação",
        ],
        nota: "Sem CAE, um token roubado ou uma conta desativada só deixam de funcionar quando o token expira ou o aplicativo consulta o IdP (introspecção, veja Q35). Por isso o tempo de vida curto dos tokens continua importante. E autenticação contínua não é pedir a senha o tempo todo: é reavaliar os sinais durante a sessão e exigir uma nova verificação só quando eles mudam.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Evite trancar a casa e confiar em sinal fraco",
        texto:
          "Para desenhar a política de um aplicativo em nuvem: classifique o aplicativo, defina quem precisa dele, escolha os sinais e o resultado de cada caso e rode em **modo só-relatório** (avalia e registra o que teria acontecido, sem bloquear). Analise o impacto, aplique primeiro a um grupo piloto, monitore, ajuste e só então estenda a todos. **Contas de emergência** (veja Q118) ficam fora das políticas que dependam do próprio IdP ou do dispositivo, mas com alerta em qualquer uso. Toda **exceção** tem dono, motivo e data de fim. Em BYOD, não exija controle total do aparelho: use controles por aplicativo e sessões limitadas. E lembre que acesso condicional não substitui a autorização dentro da aplicação.",
      },
    ],
    armadilhas: [
      "Achar que acesso condicional é só “bloquear por país”: o valor está em combinar vários sinais e escolher um resultado proporcional (MFA, sessão limitada), não apenas bloquear.",
      "Aplicar a política a todos de uma vez, sem modo só-relatório e sem contas de emergência: um erro tranca a empresa.",
      "Confiar em postura de dispositivo autodeclarada: sem atestação (gerenciamento e, quando possível, hardware), o sinal pode ser forjado.",
      "Pensar que a política protege depois da emissão do token: sem CAE e com tokens longos, o acesso continua depois de uma demissão ou de um roubo.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre acesso condicional e avaliação contínua de acesso?",
        resposta:
          "O acesso condicional decide no momento da autenticação e da emissão do token. A avaliação contínua estende a decisão à sessão: o IdP avisa eventos críticos e o recurso passa a recusar o token antes da expiração, sem esperar o vencimento.",
      },
      {
        pergunta: "Por que começar em modo só-relatório?",
        resposta:
          "Porque a política mostra o que teria bloqueado sem afetar ninguém, revelando erros e exceções antes de aplicar. Evita tirar o acesso de usuários legítimos, de contas de serviço ou de administradores por engano.",
      },
    ],
  },
  en: {
    titulo: "Conditional access and continuous evaluation",
    pergunta:
      "What are conditional access and continuous access evaluation? How do signals such as device, location, user risk and resource sensitivity feed into the decision?",
    porqueEsteMetodo:
      "Conditional access looks like a tangle of rules until you picture a doorman who checks several things before opening the door. The analogy gives the intuition; the mechanism (signals, outcomes, events) follows, along with the point where the picture stops holding.",
    resposta30s:
      "**Conditional access** is a set of “if signals, then outcome” rules, evaluated at every authentication: identity, device, location, risk and resource sensitivity lead to allowing, requiring MFA or a compliant device, limiting the session or blocking. **Continuous access evaluation** repeats the check after login: when a critical event happens (account disabled, high risk, device out of compliance), resources refuse the token before it expires. Always start in report-only mode and protect emergency accounts.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Picture the doorman of an office building. He does not just glance at the badge: he checks **who** the person is, **what time** it is, **which floor** they want and **what state** they arrive in (a new badge, a badge reported lost). The rules are “if... then...”: a valid badge during office hours gets in; outside hours it needs a second confirmation; for the vault floor, only with special authorization; a badge reported stolen does not get in. And the doorman does not forget you once you are inside: if management cancels your badge mid-shift, he gets the word by radio and walks you to the exit.",
        tecnico:
          "**Conditional access** is a policy engine: **if** (user or group, application, device, location, risk, client application) **then** (allow, require MFA or phishing-resistant authentication, require a compliant device, limit the session, block). It runs when the person authenticates and the IdP issues the token. The policy is **dynamic**: it decides with the signals of the moment, unlike a static rule (“this IP range gets in”) that does not change with context. **Continuous access evaluation** (CAE) carries the decision past issuance: the IdP publishes critical events (account disabled, password changed, session revoked, high risk, location change) and subscribed resources start refusing the token **before it expires**; the client goes back to the IdP, which reevaluates. There are standards for this notification, such as the Shared Signals Framework and the CAEP profile from the OpenID Foundation; check your vendor’s support.",
        limite:
          "The doorman recognizes faces; the system only sees **signals**, and signals err: a VPN IP looks like impossible travel, geolocation is imprecise and a device’s self-declared posture can be false without hardware attestation or management. The policy also decides **access to the application**, not what the person can do inside it (that is authorization, see Q115). And, without CAE, a token already issued is valid until it expires (see Q77 and Q78).",
      },
      {
        tipo: "tabela",
        titulo: "The signals and what each one adds",
        colunas: ["Signal", "What it tells you", "Example condition", "Typical outcome"],
        linhas: [
          [
            "Identity, group and role",
            "Who they are and what they usually can do",
            "User is an administrator",
            "Require stronger authentication",
          ],
          [
            "Device posture",
            "Health: managed, compliant, encrypted, EDR active, system up to date",
            "Non-compliant device",
            "Block, or allow browser-only access with no download",
          ],
          [
            "Device type (corporate, personal, mobile, IoT)",
            "How much control the company has over the device",
            "Personal device (BYOD)",
            "Session limited per application, no file downloads; IoT by device certificate and a restricted segment",
          ],
          [
            "Location and network",
            "Country, known network, IP reputation, impossible travel",
            "Sign-in from a country never used",
            "Require MFA or block",
          ],
          [
            "Sign-in and user risk",
            "Probability of compromise, computed by the IdP",
            "Medium or high risk",
            "Require MFA, a password change or block",
          ],
          [
            "Resource sensitivity",
            "How much a mistake costs in this application or data set",
            "Payroll, production console",
            "Require a compliant device and a short session",
          ],
          [
            "Authentication strength and client",
            "How and how long ago the person authenticated; which client application",
            "Legacy protocol with no MFA, SMS as the only factor",
            "Block the legacy client; require a phishing-resistant method",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A policy as data",
        legenda: "JSON",
        codigo: `{
  "name": "Payroll: strong MFA and limited session",
  "mode": "report_only",
  "if": {
    "application": "payroll",
    "users": { "include": ["all"], "exclude": ["emergency-accounts"] },
    "any_of": [{ "sign_in_risk": "medium_or_high" }, { "device_compliant": false }]
  },
  "then": {
    "require": ["phishing_resistant_mfa"],
    "session": { "reauthenticate_after": "4h", "download_files": false }
  }
}`,
        nota: "Illustrative format, not from any specific product. In real products the report-only mode goes by other names; check your IdP’s documentation.",
      },
      {
        tipo: "fluxo",
        titulo: "From login to near-real-time revocation",
        etapas: [
          "At login, the IdP evaluates the policies with the signals of the moment (person, device, location, risk) and, if needed, requires MFA",
          "If the result allows it, the IdP issues a **short-lived** token to the application",
          "The person works normally; the application accepts the token while it is valid",
          "A critical event occurs: HR offboards the person, the device loses compliance or the risk rises",
          "The IdP notifies the subscribed resources (for example, through CAEP events); the resource refuses the token even within its lifetime and answers with a challenge",
          "The client goes back to the IdP, which reevaluates the policy: if it still passes, it issues a new token; if not, it blocks or asks for another check",
        ],
        nota: "Without CAE, a stolen token or a disabled account only stops working when the token expires or the application queries the IdP (introspection, see Q35). That is why short token lifetimes remain important. And continuous authentication does not mean asking for the password all the time: it means reevaluating the signals during the session and asking for a new check only when they change.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Avoid locking the house and trusting weak signals",
        texto:
          "To design the policy for a cloud application: classify the application, define who needs it, choose the signals and the outcome for each case, and run it in **report-only mode** (it evaluates and logs what would have happened, without blocking). Analyze the impact, apply it first to a pilot group, monitor, adjust and only then extend it to everyone. **Emergency accounts** (see Q118) stay out of policies that depend on the IdP itself or on the device, but with an alert on any use. Every **exception** has an owner, a reason and an end date. For BYOD, do not demand full control of the device: use per-application controls and limited sessions. And remember that conditional access does not replace authorization inside the application.",
      },
    ],
    armadilhas: [
      "Thinking conditional access is just “block by country”: the value lies in combining several signals and choosing a proportional outcome (MFA, limited session), not only blocking.",
      "Applying the policy to everyone at once, with no report-only mode and no emergency accounts: one mistake locks the company out.",
      "Trusting self-declared device posture: without attestation (management and, where possible, hardware), the signal can be forged.",
      "Believing the policy protects after the token is issued: without CAE and with long tokens, access continues after a dismissal or a theft.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between conditional access and continuous access evaluation?",
        resposta:
          "Conditional access decides at the moment of authentication and token issuance. Continuous evaluation extends the decision to the session: the IdP signals critical events and the resource starts refusing the token before it expires, instead of waiting for the expiry.",
      },
      {
        pergunta: "Why start in report-only mode?",
        resposta:
          "Because the policy shows what it would have blocked without affecting anyone, revealing mistakes and exceptions before enforcing. It avoids cutting off legitimate users, service accounts or administrators by accident.",
      },
    ],
  },
};
