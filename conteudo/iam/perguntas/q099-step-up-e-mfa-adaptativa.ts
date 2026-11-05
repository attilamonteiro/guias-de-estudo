import type { Pergunta } from "../../tipos";

// Q99 · Step-up e MFA adaptativa
export const q099: Pergunta = {
  numero: 99,
  modulo: "mfa-e-passkeys",
  metodo: "feynman",
  pt: {
    titulo: "Step-up e MFA adaptativa",
    pergunta:
      "O que são step-up authentication e autenticação adaptativa baseada em risco? Como decidir quando exigir um fator adicional sem prejudicar a experiência?",
    porqueEsteMetodo:
      "Os dois conceitos soam técnicos, mas a ideia é cotidiana: o atrito deve subir com o risco. A analogia do caixa eletrônico explica a intenção, o mecanismo mostra como o sistema decide e o limite da analogia aponta onde isso dá errado.",
    resposta30s:
      "**Step-up** é pedir uma prova mais forte no meio da sessão, só quando a operação exige (uma transferência alta, mudar o e-mail); a **autenticação adaptativa** calcula um **risco** a partir de sinais (dispositivo, rede, localização, comportamento, sensibilidade da ação) e escolhe entre permitir, pedir um fator ou negar. A decisão é sempre do **servidor**, que exige `acr` e `max_age` e confere o resultado no token, com **atrito proporcional ao risco**: quase nenhum no uso rotineiro, firme no que importa. O custo é o erro da pontuação (falsos positivos irritam, falsos negativos deixam passar), então comece por regras simples, explique o motivo ao usuário e meça.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "No caixa eletrônico, consultar o saldo pede só o cartão e a senha. Uma transferência alta pede mais uma prova (um código, a confirmação no celular). Se o banco estranha a hora ou o lugar, pede ainda mais ou bloqueia. Você não é incomodado a cada operação: o atrito sobe com o risco.",
        tecnico:
          "**Step-up** é pedir, no meio de uma sessão, uma garantia de autenticação maior do que a já obtida, quando a operação exige (mudar o e-mail de recuperação, aprovar um pagamento). A **autenticação adaptativa baseada em risco** calcula, a cada tentativa, uma pontuação a partir de sinais (dispositivo conhecido e em conformidade, rede e localização, reputação do IP, horário, comportamento como padrão de uso e de digitação, sensibilidade do recurso e da ação) e a traduz em uma decisão: permitir, pedir um fator adicional, pedir um fator forte ou negar. No OpenID Connect, a aplicação pede o nível com `acr_values` e a idade máxima da autenticação com `max_age`, e o token volta com `acr`, `amr` e `auth_time` (veja Q102). No Zero Trust, é a mesma ideia como princípio: a confiança não é dada uma vez, na entrada, mas recalculada a cada acesso e durante a sessão (NIST SP 800-207).",
        limite:
          "O caixa eletrônico tem regras fixas e sinais claros. Na internet os sinais são ruidosos (VPN, viagem, rede móvel compartilhada) e a pontuação erra nos dois sentidos: o **falso positivo** barra ou irrita quem é legítimo, o **falso negativo** deixa o atacante passar. A analogia também esconde um ponto: a decisão tem de ser tomada **no servidor**, nunca no aplicativo do cliente, que o invasor controla.",
      },
      {
        tipo: "fluxo",
        titulo: "Do sinal à decisão",
        etapas: [
          "A pessoa tenta entrar ou executar uma ação; o ponto de aplicação da política (gateway, IdP ou API) reúne os sinais disponíveis: dispositivo, rede, localização, horário, histórico e a sensibilidade da ação",
          "O motor de decisão aplica regras e/ou uma pontuação de risco; um modelo de aprendizado de máquina pode ser um dos sinais, mas as regras ao redor dele precisam ser explicáveis",
          "A decisão é graduada: **permitir** sem atrito, **pedir um fator adicional**, **exigir um fator forte** (resistente a phishing) ou **negar e alertar**",
          "Para elevar o nível, o IdP é chamado de novo com `acr_values` e/ou `max_age`; a pessoa prova o fator e recebe um token com `acr` e `auth_time` atualizados",
          "A API de recurso confere `acr` e `auth_time` no token assinado antes de executar a ação sensível; se faltarem, responde com um desafio de step-up (RFC 9470) em vez de executar",
          "A avaliação continua durante a sessão: se o contexto muda (IP novo, risco do dispositivo, alerta de ameaça), o sistema pode reduzir a confiança, pedir nova prova ou revogar",
        ],
        nota: "Aprendizado de máquina e análise de comportamento ajudam a ver o que regras fixas não veem, mas funcionam como um sinal entre outros. Comece com regras simples e mensuráveis, rode a política em modo de observação antes de aplicá-la e deixe a IA sugerir ajustes que uma pessoa aprova.",
      },
      {
        tipo: "tabela",
        titulo: "Quando exigir mais, na prática",
        colunas: ["Situação", "Risco", "Resposta típica"],
        linhas: [
          [
            "Consultar o saldo ou a lista de pedidos, em dispositivo conhecido e rede habitual",
            "Baixo",
            "Permitir sem nova pergunta",
          ],
          [
            "Login em dispositivo novo, no país habitual",
            "Médio",
            "Pedir um fator adicional e oferecer registrar o dispositivo",
          ],
          [
            "Transferência acima do limite, mesmo com a sessão aberta",
            "Alto pela ação",
            "Step-up com fator forte e `max_age` curto",
          ],
          [
            "Alterar e-mail, telefone ou o próprio MFA",
            "Alto: porta de entrada para tomada de conta",
            "Step-up forte, notificação ao titular e, se for o caso, atraso",
          ],
          [
            "Login de IP anômalo com comportamento incomum",
            "Muito alto",
            "Negar ou exigir fator forte; alertar e revogar as sessões existentes",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "O desafio de step-up e a nova autenticação",
        legenda: "HTTP",
        codigo: `HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer error="insufficient_user_authentication",
  error_description="Autenticação mais forte necessária",
  acr_values="urn:exemplo:mfa-forte", max_age="300"

GET /authorize?response_type=code&client_id=app-web&scope=openid
  &acr_values=urn%3Aexemplo%3Amfa-forte&max_age=300
  &redirect_uri=https%3A%2F%2Fapp.exemplo.com%2Fcallback
  &code_challenge=...&code_challenge_method=S256&state=...`,
        nota: "A API recusa a chamada e diz o que faltou; o cliente redireciona a pessoa ao IdP com os mesmos valores. Os valores de `acr` são combinados entre o IdP e a aplicação (confira a documentação do fornecedor), e as quebras de linha estão aí só para leitura. O `acr_values` é um pedido: confira o `acr` do token que volta.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O servidor decide, e o atrito é proporcional",
        texto:
          "Quem decide é o servidor (o motor de política e a API que confere `acr` e `auth_time`), nunca um indicador no cliente. Dentro disso, cobre o fator na medida do risco: quase nada no uso rotineiro, firmeza no que importa. Para não prejudicar a experiência, **explique o porquê** do pedido, lembre o dispositivo com cuidado (veja Q101), ofereça alternativas e **meça** a taxa de desafios, de abandono e de falsos positivos para ajustar a política.",
      },
    ],
    armadilhas: [
      "Decidir no cliente (esconder o botão ou guardar `mfaOk` no front-end): a API continua aceitando a chamada. Cada endpoint sensível confere a garantia no servidor.",
      "Confiar num único sinal, como o IP geolocalizado: VPN, rede móvel e viagem geram falsos positivos, e atacantes conseguem imitar a localização.",
      "Pedir fator demais e sem explicar: o usuário aprende a aprovar por reflexo (fadiga de MFA) ou abandona. Diga por que está pedindo.",
      "Reaproveitar um MFA antigo numa ação sensível, sem `max_age`: o fator feito de manhã não prova quem está no teclado agora.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre step-up e MFA adaptativa?",
        resposta:
          "O step-up é disparado pela **operação**: mesmo com a sessão válida, uma ação sensível exige um nível maior. A adaptativa é disparada pelo **contexto** (risco do dispositivo, da rede, do comportamento) e pode pedir um fator no login ou durante a sessão. Na prática, as duas se combinam na mesma política.",
      },
      {
        pergunta: "Por que o servidor, e não o front-end, deve decidir se um fator extra é necessário?",
        resposta:
          "Porque o cliente é controlado por quem o usa, inclusive por um invasor: uma flag `mfaConcluido` no navegador pode ser forjada. O servidor aplica a política, e a API confere `acr` e `auth_time` num token assinado antes de executar a ação.",
      },
    ],
  },
  en: {
    titulo: "Step-up and adaptive MFA",
    pergunta:
      "What are step-up authentication and adaptive risk-based authentication? How do you decide when to require an additional factor without hurting the experience?",
    porqueEsteMetodo:
      "Both concepts sound technical, but the idea is an everyday one: friction should rise with risk. The ATM analogy explains the intent, the mechanism shows how the system decides, and the limit of the analogy points to where it goes wrong.",
    resposta30s:
      "**Step-up** means asking for a stronger proof in the middle of a session, only when the operation demands it (a large transfer, changing the email); **adaptive authentication** computes a **risk** from signals (device, network, location, behavior, sensitivity of the action) and chooses between allowing, asking for a factor or denying. The decision always belongs to the **server**, which requires `acr` and `max_age` and checks the result in the token, with **friction proportional to risk**: almost none for routine use, firm where it matters. The cost is scoring error (false positives annoy, false negatives let attackers through), so start with simple rules, explain the reason to the user and measure.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "At an ATM, checking your balance takes only the card and the PIN. A large transfer asks for one more proof (a code, a confirmation on your phone). If the bank finds the time or the place odd, it asks for even more or blocks it. You are not bothered on every operation: friction rises with risk.",
        tecnico:
          "**Step-up** means asking, in the middle of a session, for a higher authentication assurance than the one already obtained, when the operation demands it (changing the recovery email, approving a payment). **Adaptive risk-based authentication** computes, on each attempt, a score from signals (known and compliant device, network and location, IP reputation, time of day, behavior such as usage and typing patterns, sensitivity of the resource and of the action) and turns it into a decision: allow, ask for an additional factor, ask for a strong factor or deny. In OpenID Connect, the application requests the level with `acr_values` and the maximum age of the authentication with `max_age`, and the token returns with `acr`, `amr` and `auth_time` (see Q102). In Zero Trust it is the same idea as a principle: trust is not granted once, at the door, but recomputed on every access and during the session (NIST SP 800-207).",
        limite:
          "The ATM has fixed rules and clear signals. On the internet the signals are noisy (VPN, travel, shared mobile networks) and the score errs both ways: a **false positive** blocks or annoys a legitimate person, a **false negative** lets the attacker through. The analogy also hides one point: the decision has to be made **on the server**, never in the client application, which the attacker controls.",
      },
      {
        tipo: "fluxo",
        titulo: "From signal to decision",
        etapas: [
          "The person tries to sign in or perform an action; the policy enforcement point (gateway, IdP or API) gathers the available signals: device, network, location, time, history and the sensitivity of the action",
          "The decision engine applies rules and/or a risk score; a machine learning model can be one of the signals, but the rules around it must be explainable",
          "The decision is graded: **allow** with no friction, **ask for an additional factor**, **require a strong factor** (phishing-resistant) or **deny and alert**",
          "To raise the level, the IdP is called again with `acr_values` and/or `max_age`; the person proves the factor and receives a token with updated `acr` and `auth_time`",
          "The resource API checks `acr` and `auth_time` in the signed token before running the sensitive action; if they are missing, it answers with a step-up challenge (RFC 9470) instead of executing",
          "Evaluation continues during the session: if the context changes (new IP, device risk, threat alert), the system can lower trust, ask for a new proof or revoke",
        ],
        nota: "Machine learning and behavioral analytics help see what fixed rules miss, but they work as one signal among others. Start with simple, measurable rules, run the policy in observation mode before enforcing it, and let AI suggest adjustments that a person approves.",
      },
      {
        tipo: "tabela",
        titulo: "When to ask for more, in practice",
        colunas: ["Situation", "Risk", "Typical response"],
        linhas: [
          [
            "Checking the balance or the order list, on a known device and usual network",
            "Low",
            "Allow with no extra prompt",
          ],
          [
            "Sign-in on a new device, in the usual country",
            "Medium",
            "Ask for an additional factor and offer to register the device",
          ],
          [
            "Transfer above the limit, even with the session open",
            "High because of the action",
            "Step-up with a strong factor and a short `max_age`",
          ],
          [
            "Changing the email, phone or the MFA itself",
            "High: a doorway to account takeover",
            "Strong step-up, notification to the owner and, where appropriate, a delay",
          ],
          [
            "Sign-in from an anomalous IP with unusual behavior",
            "Very high",
            "Deny or require a strong factor; alert and revoke existing sessions",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The step-up challenge and the new authentication",
        legenda: "HTTP",
        codigo: `HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer error="insufficient_user_authentication",
  error_description="A stronger authentication is required",
  acr_values="urn:example:strong-mfa", max_age="300"

GET /authorize?response_type=code&client_id=web-app&scope=openid
  &acr_values=urn%3Aexample%3Astrong-mfa&max_age=300
  &redirect_uri=https%3A%2F%2Fapp.example.com%2Fcallback
  &code_challenge=...&code_challenge_method=S256&state=...`,
        nota: "The API refuses the call and says what was missing; the client redirects the person to the IdP with the same values. `acr` values are agreed between the IdP and the application (check the vendor’s documentation), and the line breaks are only for readability. `acr_values` is a request: check the `acr` in the token that comes back.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The server decides, and friction is proportional",
        texto:
          "The server decides (the policy engine and the API that checks `acr` and `auth_time`), never a flag in the client. Within that, ask for the factor in proportion to the risk: almost nothing for routine use, firmness where it matters. To avoid hurting the experience, **explain why** you are asking, remember the device carefully (see Q101), offer alternatives and **measure** the challenge rate, the drop-off and the false positives to tune the policy.",
      },
    ],
    armadilhas: [
      "Deciding in the client (hiding the button or keeping `mfaOk` in the front end): the API still accepts the call. Every sensitive endpoint checks the assurance on the server.",
      "Trusting a single signal, such as the geolocated IP: VPNs, mobile networks and travel produce false positives, and attackers can imitate a location.",
      "Asking for too many factors without explaining: users learn to approve by reflex (MFA fatigue) or give up. Say why you are asking.",
      "Reusing an old MFA for a sensitive action, with no `max_age`: the factor completed this morning does not prove who is at the keyboard now.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between step-up and adaptive MFA?",
        resposta:
          "Step-up is triggered by the **operation**: even with a valid session, a sensitive action demands a higher level. Adaptive is triggered by **context** (risk of the device, network or behavior) and can ask for a factor at sign-in or during the session. In practice the two combine in the same policy.",
      },
      {
        pergunta: "Why should the server, not the front end, decide whether an extra factor is needed?",
        resposta:
          "Because the client is controlled by whoever uses it, including an attacker: an `mfaDone` flag in the browser can be forged. The server applies the policy, and the API checks `acr` and `auth_time` in a signed token before running the action.",
      },
    ],
  },
};
