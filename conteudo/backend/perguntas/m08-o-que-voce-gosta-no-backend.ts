import type { Pergunta } from "../../tipos";

// M08 · O que você gosta no backend
export const m08: Pergunta = {
  numero: 208,
  modulo: "mentorcruise",
  metodo: "playbook",
  pt: {
    titulo: "Gostos e desgostos no backend",
    pergunta: "Quais são os seus aspectos favoritos e menos favoritos no desenvolvimento backend?",
    porqueEsteMetodo:
      "Não há resposta técnica certa: o que separa uma resposta boa de uma fraca é a estrutura. Um playbook dá a ordem (entender o que se avalia, escolher, mostrar como lida, conferir os sinais de alerta, conectar à vaga) e deixa as lacunas para você preencher com o que é verdade.",
    resposta30s:
      "Escolha **um favorito real, ligado a impacto** (por exemplo modelar dados ou tornar um sistema confiável) e **um ponto menos favorito real, com a forma como você lida com ele** (por exemplo o trabalho invisível ou o plantão). Evite **culpar pessoas ou desprezar áreas**, e feche conectando as duas respostas ao dia a dia da vaga. O entrevistador avalia **autoconhecimento e adequação**, não procura uma resposta “certa”.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Entenda o que está sendo avaliado",
            texto:
              "Três coisas: **autoconhecimento** (você sabe o que lhe dá energia e o que lhe pesa?), **maturidade** (fala do lado ruim sem drama e com um plano?) e **adequação** (o dia a dia da vaga combina com o que você descreve?). Critério: a resposta traz preferências concretas, não adjetivos soltos como “gosto de desafios”.",
          },
          {
            titulo: "Escolha um favorito real e ligue a impacto",
            texto:
              "Parta do que de fato lhe atrai, e não do que soa bem. Critério: dá para dizer o que muda para o usuário, para o negócio ou para o time. Modelo, com lacunas: “Do que mais gosto é [aspecto], porque [o que isso permite ou protege]. Por exemplo, em [situação que você realmente viveu ou estudou], [o efeito].”",
          },
          {
            titulo: "Escolha um menos favorito que seja verdadeiro",
            texto:
              "Nem um falso defeito (“sou perfeccionista”) nem algo que a vaga exige todo dia (“não gosto de escrever código”). Critério: é algo real, do trabalho e não de pessoas, que você consegue descrever sem amargura. Modelo: “O que mais me custa é [aspecto real do trabalho].”",
          },
          {
            titulo: "Mostre como você lida com ele",
            texto:
              "A mitigação é o que prova maturidade. Critério: uma ação concreta e repetível (automatizar, documentar, escrever um roteiro de operação, reservar um horário), não “aguento firme”. Modelo: “Para lidar com isso, eu [prática concreta].” Se ainda não lida bem, diga o que quer tentar.",
          },
          {
            titulo: "Passe pelos sinais de alerta",
            texto:
              "Releia a resposta e tire: culpa de pessoas ou times, desprezo por áreas (front-end, testes, documentação, suporte), resposta de “não há nada de que eu não goste” e qualquer ponto que soe como “não faço isso”. Critério: nenhuma frase fala mal de alguém.",
          },
          {
            titulo: "Conecte à vaga e feche curto",
            texto:
              "Descubra antes o que a vaga envolve (plantão, sistema legado, produto novo, muitos dados, integrações) e mostre a ligação. Critério: 60 a 90 segundos e uma ponte final, por exemplo: “Pelo que entendi da vaga, [ligação com o dia a dia dela].” Se não tiver exemplo próprio, fale da preferência e do motivo; honestidade vale mais que uma história enfeitada.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Ângulos honestos para escolher (use o que for verdade para você)",
        colunas: ["Ângulo", "Como favorito (com impacto)", "Como ponto difícil (com mitigação)"],
        linhas: [
          [
            "Modelagem de dados",
            "Uma boa decisão de modelo evita uma classe inteira de bugs e deixa as consultas simples",
            "Migrações em tabelas grandes exigem cautela; mitigação: fazer em etapas, ensaiar em cópia e ter plano de reversão",
          ],
          [
            "Confiabilidade",
            "Tornar a falha previsível e tratável: timeouts, retentativas, alertas que ajudam",
            "Depurar problema intermitente cansa; mitigação: logs estruturados, identificadores de correlação e reprodução em ambiente de teste",
          ],
          [
            "Trabalho invisível",
            "O valor silencioso: quando o backend vai bem, ninguém percebe e o usuário simplesmente consegue comprar",
            "O reconhecimento é menor que no que aparece na tela; mitigação: acompanhar métricas visíveis (latência, taxa de erro) e comunicar o resultado em termos de impacto",
          ],
          [
            "Plantão e operação",
            "Ser dono do serviço de ponta a ponta, inclusive operá-lo, e aprender com o que acontece em produção",
            "Chamados fora do horário pesam; mitigação: roteiros de operação, alertas só para o que exige ação e revisão depois de cada incidente",
          ],
          [
            "Código legado",
            "Melhorar aos poucos um sistema que já está em uso e tem usuários reais",
            "Mexer em código sem testes dá medo; mitigação: escrever testes de caracterização antes de alterar e fazer mudanças pequenas",
          ],
        ],
        nota: "As células descrevem ângulos, não a sua história. Só use um se ele for verdadeiro para você.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Modelo de resposta (preencha com o que for verdade)",
        texto:
          "“Do que mais gosto é [aspecto], porque [impacto concreto para usuário, time ou negócio]. O que menos me atrai é [aspecto real do trabalho], e lido com isso [prática concreta]. Pelo que entendi da vaga, [ligação com o dia a dia dela].” Troque os colchetes por conteúdo seu; um modelo copiado sem adaptação é fácil de perceber.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Sinais de alerta",
        texto:
          "Culpar pessoas ou times (“odeio quando o produto muda de ideia”), desprezar uma área (“front-end é fácil”, “teste é perda de tempo”), apontar como menos favorito algo que a vaga exige todos os dias, ou dar um defeito disfarçado de qualidade. Qualquer um deles diz mais sobre a sua postura do que sobre o assunto.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "E se faltar experiência?",
        texto:
          "Fale do que já estudou ou construiu e deixe claro que é isso. Quem nunca fez plantão pode dizer que não tem essa experiência e o que espera aprender sobre ela. Não invente um incidente nem um projeto: perguntas de acompanhamento desmontam história inventada, e uma resposta honesta e curiosa costuma render mais que uma decorada.",
      },
    ],
    armadilhas: [
      "Responder com uma lista de tecnologias (“gosto de Postgres e Redis”) sem dizer por quê nem qual impacto elas têm.",
      "Dar um “menos favorito” falso ou frouxo (“gosto de tudo”), que parece falta de autoconhecimento.",
      "Falar mal de um time, de uma pessoa ou de uma área para ilustrar o ponto difícil.",
      "Escolher um ponto que é o centro da vaga (por exemplo, dizer que detesta plantão numa vaga com plantão) sem mostrar como lidaria.",
    ],
    autoteste: [
      {
        pergunta: "O que o entrevistador quer descobrir com essa pergunta?",
        resposta:
          "Autoconhecimento, maturidade para falar do lado ruim com um plano e adequação entre o que você valoriza e o dia a dia da vaga.",
      },
      {
        pergunta: "Qual a estrutura de uma boa resposta?",
        resposta:
          "Um favorito real ligado a impacto, um ponto menos favorito real com a forma de lidar com ele, nenhum sinal de alerta e uma ponte final para a vaga.",
      },
    ],
  },
  en: {
    titulo: "Backend likes and dislikes",
    pergunta: "What are your favorite and least favorite aspects of backend development?",
    porqueEsteMetodo:
      "There is no right technical answer: what separates a good response from a weak one is its structure. A playbook gives the order (understand what is being assessed, choose, show how you cope, check the red flags, connect to the role) and leaves the blanks for you to fill with what is true.",
    resposta30s:
      "Pick **one real favorite, tied to impact** (for example data modeling or making a system reliable) and **one real least favorite, with how you cope with it** (for example invisible work or on-call). Avoid **blaming people or looking down on areas**, and close by connecting both answers to the day-to-day of the role. The interviewer assesses **self-awareness and fit**, not a “correct” answer.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Understand what is being assessed",
            texto:
              "Three things: **self-awareness** (do you know what energizes you and what weighs on you?), **maturity** (can you discuss the downside calmly and with a plan?) and **fit** (does the role’s day-to-day match what you describe?). Criterion: the answer brings concrete preferences, not loose adjectives like “I enjoy challenges”.",
          },
          {
            titulo: "Pick a real favorite and tie it to impact",
            texto:
              "Start from what genuinely attracts you, not from what sounds good. Criterion: you can say what changes for the user, the business or the team. Template, with blanks: “What I like most is [aspect], because [what it enables or protects]. For example, in [a situation you really lived or studied], [the effect].”",
          },
          {
            titulo: "Pick a least favorite that is true",
            texto:
              "Not a fake flaw (“I’m a perfectionist”) and not something the role demands daily (“I don’t like writing code”). Criterion: it is real, about the work and not about people, and you can describe it without bitterness. Template: “What costs me the most is [real aspect of the work].”",
          },
          {
            titulo: "Show how you cope with it",
            texto:
              "The mitigation is what proves maturity. Criterion: a concrete, repeatable action (automate, document, write a runbook, block out time), not “I just push through”. Template: “To deal with that, I [concrete practice].” If you do not cope well yet, say what you want to try.",
          },
          {
            titulo: "Run the red-flag check",
            texto:
              "Reread the answer and remove: blaming people or teams, contempt for areas (front end, testing, documentation, support), a “there is nothing I dislike” answer and anything that sounds like “I won’t do that”. Criterion: no sentence speaks ill of anyone.",
          },
          {
            titulo: "Connect to the role and close short",
            texto:
              "Find out beforehand what the role involves (on-call, legacy system, new product, lots of data, integrations) and show the link. Criterion: 60 to 90 seconds and a closing bridge, for example: “From what I understand of the role, [link to its day-to-day].” If you have no example of your own, talk about the preference and the reason; honesty beats a polished story.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Honest angles to choose from (use what is true for you)",
        colunas: ["Angle", "As a favorite (with impact)", "As a hard part (with mitigation)"],
        linhas: [
          [
            "Data modeling",
            "A good modeling decision prevents a whole class of bugs and keeps queries simple",
            "Migrations on large tables demand care; mitigation: do them in stages, rehearse on a copy and keep a rollback plan",
          ],
          [
            "Reliability",
            "Making failure predictable and manageable: timeouts, retries, alerts that actually help",
            "Debugging an intermittent problem is draining; mitigation: structured logs, correlation IDs and reproduction in a test environment",
          ],
          [
            "Invisible work",
            "The quiet value: when the backend does well, nobody notices and the user simply manages to check out",
            "Recognition is lower than for what appears on screen; mitigation: track visible metrics (latency, error rate) and report results in terms of impact",
          ],
          [
            "On-call and operations",
            "Owning the service end to end, operating it included, and learning from what happens in production",
            "Out-of-hours calls weigh on you; mitigation: runbooks, alerts only for what needs action and a review after each incident",
          ],
          [
            "Legacy code",
            "Gradually improving a system that is already in use and has real users",
            "Touching code without tests is scary; mitigation: write characterization tests before changing it and make small changes",
          ],
        ],
        nota: "The cells describe angles, not your story. Use one only if it is true for you.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Answer template (fill in with what is true)",
        texto:
          "“What I like most is [aspect], because [concrete impact for the user, team or business]. What appeals to me least is [real aspect of the work], and I handle it by [concrete practice]. From what I understand of the role, [link to its day-to-day].” Replace the brackets with your own content; a template copied without adapting it is easy to spot.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Red flags",
        texto:
          "Blaming people or teams (“I hate it when product changes its mind”), looking down on an area (“front end is easy”, “testing is a waste of time”), naming as a least favorite something the role requires every day, or offering a flaw disguised as a virtue. Any of these says more about your attitude than about the topic.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "What if you lack experience?",
        texto:
          "Talk about what you studied or built and make clear that is what it is. Someone who never did on-call can say they have no experience with it and what they expect to learn about it. Do not invent an incident or a project: follow-up questions dismantle an invented story, and an honest, curious answer usually earns more than a rehearsed one.",
      },
    ],
    armadilhas: [
      "Answering with a list of technologies (“I like Postgres and Redis”) without saying why or what impact they have.",
      "Giving a fake or weak “least favorite” (“I like everything”), which looks like a lack of self-awareness.",
      "Speaking ill of a team, a person or an area to illustrate the hard part.",
      "Choosing a point that is the core of the role (for example, saying you hate on-call for a role with on-call) without showing how you would cope.",
    ],
    autoteste: [
      {
        pergunta: "What does the interviewer want to find out with this question?",
        resposta:
          "Self-awareness, the maturity to discuss the downside with a plan, and the fit between what you value and the role’s day-to-day.",
      },
      {
        pergunta: "What is the structure of a good answer?",
        resposta:
          "A real favorite tied to impact, a real least favorite with how you cope with it, no red flags and a closing bridge to the role.",
      },
    ],
  },
};
