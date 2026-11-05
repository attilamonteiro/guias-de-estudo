import type { Pergunta } from "../../tipos";

// Q120 · Princípios do zero trust
export const q120: Pergunta = {
  numero: 120,
  modulo: "autorizacao",
  metodo: "whys",
  pt: {
    titulo: "Princípios do zero trust",
    pergunta:
      "Por que o modelo de zero trust (NIST SP 800-207) surgiu e quais são seus princípios? O que significa “nunca confie, sempre verifique” na prática?",
    porqueEsteMetodo:
      "O zero trust costuma ser decorado como slogan (“nunca confie, sempre verifique”). A cadeia de porquês mostra que cada princípio é consequência de uma falha concreta do modelo anterior.",
    resposta30s:
      "O modelo de perímetro tratava a rede interna como confiável, o que deixou de valer com **nuvem, SaaS, trabalho remoto e movimento lateral** de quem já entrou. O **zero trust** (NIST SP 800-207) parte de uma rede vista como comprometida e decide **cada acesso por requisição**, com identidade, dispositivo e contexto, seguindo **verificar explicitamente, privilégio mínimo e assumir violação**. “Nunca confie, sempre verifique” significa que nenhuma rede nem login anterior concede acesso automático.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o modelo de perímetro falhou?",
            resposta:
              "Porque assumia que **dentro da rede = confiável** e que existia um “dentro” bem definido. Hoje os aplicativos estão em SaaS e em várias nuvens, as pessoas trabalham de qualquer lugar e usam dispositivos pessoais, e parceiros e contratados precisam de acesso. O perímetro ficou poroso e deixou de coincidir com aquilo que se quer proteger.",
          },
          {
            pergunta: "Por que isso é tão grave quando o perímetro é violado?",
            resposta:
              "Porque, dentro, a rede era plana e a confiança implícita: quem entra com uma credencial roubada ou um dispositivo infectado se move **lateralmente** (veja Q138), de um servidor a outro, sem ser questionado. Um firewall tradicional decide por endereço, porta e protocolo; não sabe quem é a pessoa, em que estado está o dispositivo nem se aquilo é normal para ela. Por isso não basta, embora continue útil como camada.",
          },
          {
            pergunta: "Por que a identidade passa a ser o centro?",
            resposta:
              "Porque a localização de rede deixou de dizer quem é quem. O que acompanha **toda** requisição, em qualquer rede, é a identidade (de pessoas, dispositivos e cargas de trabalho) e o contexto. O IdP, o MFA forte e o acesso condicional (veja Q123) viram o plano de controle, e a rede, inclusive a interna, é tratada como **não confiável**: tráfego cifrado e autenticado em qualquer lugar.",
          },
          {
            pergunta: "Por que verificar a cada requisição, e não só no login?",
            resposta:
              "Porque a confiança envelhece: o dispositivo pode ser comprometido, o token roubado, o risco mudar no meio da sessão. Por isso a decisão vale por requisição ou por sessão curta, com reavaliação quando os sinais mudam (a verificação contínua também faz parte do ZTNA, veja Q122). A política pesa identidade, dispositivo, localização, sensibilidade do recurso e risco, e concede o **mínimo** necessário (veja Q109).",
          },
          {
            pergunta: "Por que supor que a violação já aconteceu (assume breach)?",
            resposta:
              "Porque nenhuma defesa é perfeita, e planejar como se o invasor já estivesse dentro muda o projeto: **segmentar** para conter o dano, **limitar privilégios** e usar credenciais de curta duração, **registrar tudo** para detectar e responder rápido. O objetivo é reduzir a superfície de ataque e o raio de explosão, não prometer que nada falhará.",
          },
        ],
        causaRaiz:
          "A **confiança implícita por localização de rede** deixou de ser segura. O zero trust a troca por confiança **explícita, mínima e reavaliada**, centrada em identidade e contexto, e parte do princípio de que a violação é possível.",
      },
      {
        tipo: "tabela",
        titulo: "Os princípios e o que significam na prática",
        colunas: ["Princípio", "Significado", "Na prática"],
        linhas: [
          [
            "Verificar explicitamente (verify explicitly)",
            "Autenticar e autorizar com todos os sinais disponíveis em cada acesso",
            "MFA forte, postura do dispositivo, risco e sensibilidade do recurso entram na decisão",
          ],
          [
            "Privilégio mínimo",
            "Só o acesso necessário, pelo tempo necessário",
            "Papéis enxutos, acesso JIT (veja Q118), sessões e tokens curtos",
          ],
          [
            "Assumir violação (assume breach)",
            "Projetar supondo que alguém já está dentro",
            "Segmentação, registro completo, detecção e resposta, credenciais descartáveis",
          ],
          [
            "Decisão por requisição",
            "Cada acesso é decidido no momento, não herdado da rede",
            "Um ponto de aplicação (PEP) consulta o motor de política (veja Q121)",
          ],
          [
            "Fronteira de confiança junto do recurso",
            "A verificação fica o mais perto possível do que se protege",
            "Em vez de um muro em volta da rede, um portão por aplicação, API e dado",
          ],
        ],
        nota: "Modelos de maturidade (como o da CISA) organizam o trabalho em pilares: identidade, dispositivos, redes, aplicações e dados. Confira a versão atual do documento.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "“Nunca confie, sempre verifique” na prática",
        texto:
          "Nenhuma rede, endereço IP, VPN ou login anterior é motivo suficiente para liberar um acesso. Cada requisição é decidida contra uma política que considera identidade, dispositivo e contexto, concede o menor privilégio possível e fica registrada. Na linguagem do NIST SP 800-207, o ponto de aplicação (PEP) fica na frente do recurso, e o que está atrás dele é uma zona de confiança implícita que se quer a menor possível: essa é a **fronteira de confiança** no zero trust.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Equívocos comuns",
        texto:
          "Zero trust **não é um produto** que se compra: é uma estratégia que combina identidade, dispositivos, rede, aplicações, dados e monitoramento. **Não elimina a rede, o firewall nem a VPN**: reduz a confiança que se dá a eles. **Não é desconfiar das pessoas**, e sim não conceder acesso por localização ou por login anterior. **Não é um projeto com data de fim**: é adoção gradual (veja Q124). E quando perguntam como outra tecnologia “se relaciona” com zero trust (MFA, IAM, microssegmentação, ZTNA, EDR), a resposta costuma ser que ela é uma peça, e o zero trust é o conjunto de princípios que organiza as peças.",
      },
    ],
    armadilhas: [
      "Tratar zero trust como produto ou como projeto com data de fim: é estratégia e adoção gradual.",
      "Achar que MFA, ou uma VPN com MFA, já é zero trust: a decisão continua sendo “entrou na rede, passou”.",
      "Dizer “sem firewall” ou “sem confiança nenhuma”: a rede continua existindo, muda o que se concede por estar nela.",
      "Verificar só no login e esquecer a sessão: token roubado e dispositivo que perde a conformidade seguem valendo.",
    ],
    autoteste: [
      {
        pergunta: "Explique “nunca confie, sempre verifique” sem usar o slogan.",
        resposta:
          "Nenhum acesso é concedido por estar na rede ou por já ter feito login: cada requisição é avaliada contra uma política com identidade, estado do dispositivo e contexto, e recebe só o privilégio necessário. Se os sinais mudam, a decisão muda.",
      },
      {
        pergunta: "Por que um firewall de perímetro não basta?",
        resposta:
          "Porque decide por endereço, porta e protocolo, não por identidade e contexto, e o tráfego interno e o dos serviços em nuvem nem passam por ele. Continua útil como uma camada, mas quem já entrou se move livremente se nada mais verificar.",
      },
    ],
  },
  en: {
    titulo: "Zero trust principles",
    pergunta:
      "Why did the zero trust model (NIST SP 800-207) emerge, and what are its principles? What does “never trust, always verify” mean in practice?",
    porqueEsteMetodo:
      "Zero trust is often memorized as a slogan (“never trust, always verify”). The chain of whys shows that each principle is the consequence of a concrete failure of the earlier model.",
    resposta30s:
      "The perimeter model treated the internal network as trusted, which stopped holding with **cloud, SaaS, remote work and lateral movement** by whoever got in. **Zero trust** (NIST SP 800-207) starts from a network seen as compromised and decides **every access per request**, using identity, device and context, following **verify explicitly, least privilege and assume breach**. “Never trust, always verify” means that no network and no earlier login grants access automatically.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why did the perimeter model fail?",
            resposta:
              "Because it assumed **inside the network = trusted** and that a well-defined “inside” existed. Today applications live in SaaS and several clouds, people work from anywhere on personal devices, and partners and contractors need access. The perimeter became porous and stopped coinciding with what you want to protect.",
          },
          {
            pergunta: "Why is that so serious when the perimeter is breached?",
            resposta:
              "Because, inside, the network was flat and trust was implicit: whoever gets in with a stolen credential or an infected device moves **laterally** (see Q138), from one server to another, without being questioned. A traditional firewall decides by address, port and protocol; it does not know who the person is, what state the device is in or whether this is normal for them. That is why it is not enough, even though it remains useful as a layer.",
          },
          {
            pergunta: "Why does identity become the center?",
            resposta:
              "Because network location no longer says who is who. What accompanies **every** request, on any network, is identity (of people, devices and workloads) and context. The IdP, strong MFA and conditional access (see Q123) become the control plane, and the network, the internal one included, is treated as **untrusted**: encrypted, authenticated traffic everywhere.",
          },
          {
            pergunta: "Why verify on every request, not just at login?",
            resposta:
              "Because trust ages: the device can be compromised, the token stolen, the risk can change in the middle of the session. So the decision applies per request or per short session, with reevaluation when signals change (continuous verification is part of ZTNA too, see Q122). The policy weighs identity, device, location, resource sensitivity and risk, and grants the **minimum** needed (see Q109).",
          },
          {
            pergunta: "Why assume the breach has already happened (assume breach)?",
            resposta:
              "Because no defense is perfect, and planning as if the intruder were already inside changes the design: **segment** to contain the damage, **limit privileges** and use short-lived credentials, **log everything** to detect and respond fast. The goal is to reduce the attack surface and the blast radius, not to promise that nothing will fail.",
          },
        ],
        causaRaiz:
          "**Implicit trust based on network location** stopped being safe. Zero trust replaces it with **explicit, minimal, reevaluated** trust, centered on identity and context, and starts from the premise that a breach is possible.",
      },
      {
        tipo: "tabela",
        titulo: "The principles and what they mean in practice",
        colunas: ["Principle", "Meaning", "In practice"],
        linhas: [
          [
            "Verify explicitly",
            "Authenticate and authorize using all available signals on every access",
            "Strong MFA, device posture, risk and resource sensitivity feed the decision",
          ],
          [
            "Least privilege",
            "Only the access needed, for only as long as needed",
            "Lean roles, JIT access (see Q118), short sessions and tokens",
          ],
          [
            "Assume breach",
            "Design as if someone is already inside",
            "Segmentation, full logging, detection and response, disposable credentials",
          ],
          [
            "Per-request decision",
            "Each access is decided at that moment, not inherited from the network",
            "An enforcement point (PEP) consults the policy engine (see Q121)",
          ],
          [
            "Trust boundary next to the resource",
            "Verification sits as close as possible to what it protects",
            "Instead of a wall around the network, a gate per application, API and data set",
          ],
        ],
        nota: "Maturity models (such as CISA’s) organize the work into pillars: identity, devices, networks, applications and data. Check the current version of the document.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "“Never trust, always verify” in practice",
        texto:
          "No network, IP address, VPN or earlier login is reason enough to release an access. Each request is decided against a policy that considers identity, device and context, grants the least privilege possible and is logged. In NIST SP 800-207 terms, the enforcement point (PEP) sits in front of the resource, and what lies behind it is an implicit trust zone you want as small as possible: that is the **trust boundary** in zero trust.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Common misconceptions",
        texto:
          "Zero trust is **not a product** you buy: it is a strategy that combines identity, devices, network, applications, data and monitoring. It **does not eliminate the network, the firewall or the VPN**: it reduces the trust you give them. It is **not about distrusting people**, but about not granting access by location or by an earlier login. It is **not a project with an end date**: it is gradual adoption (see Q124). And when someone asks how another technology “relates” to zero trust (MFA, IAM, microsegmentation, ZTNA, EDR), the answer is usually that it is one piece, while zero trust is the set of principles that organizes the pieces.",
      },
    ],
    armadilhas: [
      "Treating zero trust as a product or as a project with an end date: it is a strategy and gradual adoption.",
      "Thinking MFA, or a VPN with MFA, is already zero trust: the decision is still “you got onto the network, you pass”.",
      "Saying “no firewall” or “no trust at all”: the network still exists, what changes is what being on it grants.",
      "Verifying only at login and forgetting the session: a stolen token and a device that loses compliance keep working.",
    ],
    autoteste: [
      {
        pergunta: "Explain “never trust, always verify” without using the slogan.",
        resposta:
          "No access is granted for being on the network or for having logged in before: every request is evaluated against a policy using identity, device state and context, and receives only the privilege it needs. If the signals change, the decision changes.",
      },
      {
        pergunta: "Why is a perimeter firewall not enough?",
        resposta:
          "Because it decides by address, port and protocol, not by identity and context, and internal traffic and traffic between cloud services never even cross it. It remains useful as a layer, but whoever is already inside moves freely if nothing else verifies.",
      },
    ],
  },
};
