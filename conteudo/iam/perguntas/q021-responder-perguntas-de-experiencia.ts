import type { Pergunta } from "../../tipos";

// Q21 · Responder perguntas de experiência
export const q021: Pergunta = {
  numero: 21,
  modulo: "fundamentos",
  metodo: "playbook",
  pt: {
    titulo: "Responder perguntas de experiência",
    pergunta:
      "Como estruturar boas respostas a perguntas de experiência em IAM (ferramentas usadas, desafios de administração, latência, trabalho com auditores), mesmo quando sua experiência é parcial?",
    porqueEsteMetodo:
      "Pergunta de experiência não se responde com definição: pede uma história curta e verificável. O playbook dá a ordem da resposta (contexto, problema, decisão, resultado, aprendizado) e o que fazer quando a sua experiência é parcial.",
    resposta30s:
      "Estruture a resposta em cinco partes: **contexto e escala**, **problema**, **decisão e alternativas descartadas**, **resultado medido** e **aprendizado**, ligando-a a princípios como menor privilégio e auditabilidade. Fale de ferramentas pelo **critério de escolha**, não como lista de marcas. Quando a experiência é parcial, diga com precisão o que você **fez**, o que **estudou ou montou em laboratório** e como abordaria o resto: **não invente**, porque o entrevistador vai aprofundar.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Roteiro de resposta",
        passos: [
          {
            titulo: "1. Descubra o que a pergunta mede",
            texto:
              "“Que ferramentas usou?” e “que desafios enfrentou?” testam julgamento: como você decide sob restrições, não só que nomes conhece. Identifique o tipo (ferramenta, desafio, política, colaboração, desempenho) e responda a ele. Sinal: sua primeira frase mostra que você entendeu o que está sendo perguntado.",
          },
          {
            titulo: "2. Contexto e escala, em uma ou duas frases",
            texto:
              "Que tipo de organização, quantos usuários e aplicações, quais ambientes e qual era o seu papel exato (fez, ajudou, acompanhou). Sinal: o ouvinte consegue dimensionar o problema.",
          },
          {
            titulo: "3. O problema, com um sintoma concreto",
            texto:
              "“Os logins demoravam”, “as contas de quem saía continuavam ativas”. Um sintoma observável vale mais que um adjetivo. Sinal: dá para perguntar “como você percebeu?” e você tem resposta.",
          },
          {
            titulo: "4. Decisão e alternativas descartadas",
            texto:
              "O que foi escolhido, o que foi considerado e por que foi descartado. É aqui que aparece o julgamento: custo, risco, prazo, o que o negócio aceitava. Sinal: ao menos uma alternativa real e um motivo.",
          },
          {
            titulo: "5. Resultado medido",
            texto:
              "O que mudou e como se sabe: tempo de login, chamados, cobertura, achados de auditoria. Sem número, diga qualitativamente o que melhorou e como verificaria. Nunca invente números. Sinal: o resultado é verificável.",
          },
          {
            titulo: "6. Aprendizado e princípio",
            texto:
              "Uma lição e o que faria diferente, ligada a um princípio (menor privilégio, defesa em profundidade, rastreabilidade). Sinal: a história termina em algo reutilizável.",
          },
          {
            titulo: "7. Se a experiência é parcial",
            texto:
              "Diga o que fez de fato, o que viu de perto, o que estudou ou montou em laboratório e como abordaria o restante, com o raciocínio. Sinal: o entrevistador sabe exatamente onde termina a prática e começa o estudo.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Cenários comuns e onde focar",
        colunas: ["Pergunta típica", "O que o entrevistador quer ouvir", "O que evitar"],
        linhas: [
          [
            "Ferramentas de IAM que já usou e a favorita",
            "Para que cada uma foi usada, em que contexto, com que critério foi escolhida e quais pontos fortes e fracos você viu. “Favorita” depende do cenário: justifique pelo critério. Se a pergunta cita Amazon IAM, Azure AD (hoje Microsoft Entra ID) e Google Cloud IAM, fale dos conceitos comuns (principal, papel, política, escopo, identidade de carga de trabalho) e diga quais usou e quais conhece só em teoria",
            "Lista de marcas sem contexto; dizer que domina o que só leu",
          ],
          [
            "Desafios de administrar um sistema de IAM",
            "Um problema real e como foi tratado: acúmulo de permissões, contas órfãs, sincronização com o RH, exceções, atraso em revisões, diferenças entre ambientes. Foque na solução e na prevenção",
            "Reclamar de pessoas ou ferramentas; problema sem desfecho",
          ],
          [
            "Latência ao implantar IAM",
            "Método: medir primeiro onde está o tempo (IdP, rede, diretório, chamada por requisição). Soluções: validar tokens localmente com as chaves em cache (JWKS) em vez de consultar o IdP a cada chamada, cachear decisões de autorização com TTL curto, usar pool de conexões ao diretório, aproximar o IdP da região, manter os claims enxutos. A troca: cache longo atrasa a revogação",
            "Cachear tudo sem pensar na revogação; otimizar sem medir",
          ],
          [
            "Participação em políticas e procedimentos",
            "Sua contribuição concreta: levantamento de requisitos, rascunho, revisão com jurídico, RH e donos de negócio, tratamento de exceções, comunicação e medição de cumprimento. Distinga política (o quê), padrão (a especificação) e procedimento (como)",
            "Dizer que “participou” sem detalhar o que fez",
          ],
          [
            "Trabalho com auditores e jurídico",
            "Como as evidências foram pedidas e entregues (amostras, relatórios, logs), como exigências legais viraram controles técnicos e como os achados viraram plano de ação (veja Q19). Se não trabalhou, descreva como se prepararia",
            "Tratar o auditor como adversário; prometer conformidade absoluta",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A espinha da resposta",
        texto:
          "**Contexto, problema, decisão, resultado, aprendizado**, nessa ordem, em cerca de dois minutos, terminando no princípio que a história ilustra (menor privilégio, rastreabilidade, defesa em profundidade). É o esqueleto do método STAR (situação, tarefa, ação, resultado) com a decisão e as alternativas em destaque, que é o que mais interessa em IAM. Prepare de duas a quatro histórias reais suas e adapte cada uma a várias perguntas.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Experiência parcial: honestidade vence bravata",
        texto:
          "Não invente projetos, números, cargos nem ferramentas. O entrevistador aprofunda (“e quando o token expirou?”), e um detalhe inventado derruba o resto da conversa. Use “eu” para o que você fez e “nós” para o time. Separe três níveis: **usei em produção**, **montei em laboratório ou estudei** e **conheço o conceito**. Depois mostre o raciocínio: “não implantei X em produção; num laboratório com Y fiz Z, e o cuidado que eu teria é…”. Admitir um limite com clareza costuma pesar mais a seu favor do que uma resposta inflada.",
      },
    ],
    armadilhas: [
      "Responder com definições ou lista de ferramentas quando a pergunta pede uma história com decisão e resultado.",
      "Dizer “nós” para tudo e não deixar claro o seu papel, ou dizer “eu” para o que foi do time.",
      "Inventar números, projetos ou familiaridade com uma ferramenta: o entrevistador aprofunda e a inconsistência aparece.",
      "Falar mal de ex-equipes, fornecedores ou auditores, ou contar um problema sem dizer como foi resolvido e o que se aprendeu.",
    ],
    autoteste: [
      {
        pergunta: "Como estruturar uma resposta de experiência em IAM?",
        resposta:
          "Contexto e escala, problema com um sintoma concreto, decisão e alternativas descartadas, resultado medido e aprendizado ligado a um princípio, em cerca de dois minutos.",
      },
      {
        pergunta: "O que dizer quando você conhece uma ferramenta só de forma teórica?",
        resposta:
          "Dizer isso com clareza: o que usou em produção, o que montou ou estudou e como abordaria o resto, mostrando o raciocínio e os conceitos comuns às ferramentas (principal, papel, política, escopo), sem fingir experiência.",
      },
    ],
  },
  en: {
    titulo: "Answering experience questions",
    pergunta:
      "How do you structure strong answers to IAM experience questions (tools used, administration challenges, latency, working with auditors), even when your experience is partial?",
    porqueEsteMetodo:
      "An experience question is not answered with a definition: it asks for a short, checkable story. The playbook gives the order of the answer (context, problem, decision, result, lesson) and what to do when your experience is partial.",
    resposta30s:
      "Structure the answer in five parts: **context and scale**, **problem**, **decision and rejected alternatives**, **measured result** and **lesson**, tying it to principles such as least privilege and auditability. Talk about tools through your **selection criteria**, not as a list of brands. When experience is partial, say precisely what you **did**, what you **studied or built in a lab** and how you would approach the rest: **do not invent**, because the interviewer will dig deeper.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Answer script",
        passos: [
          {
            titulo: "1. Find out what the question measures",
            texto:
              "“Which tools have you used?” and “which challenges did you face?” test judgment: how you decide under constraints, not just which names you know. Identify the type (tool, challenge, policy, collaboration, performance) and answer that. Signal: your first sentence shows you understood what is being asked.",
          },
          {
            titulo: "2. Context and scale, in a sentence or two",
            texto:
              "What kind of organization, how many users and applications, which environments and what your exact role was (did, helped, followed). Signal: the listener can size the problem.",
          },
          {
            titulo: "3. The problem, with a concrete symptom",
            texto:
              "“Sign-ins were slow”, “accounts of people who left stayed active”. An observable symptom beats an adjective. Signal: someone can ask “how did you notice?” and you have an answer.",
          },
          {
            titulo: "4. Decision and rejected alternatives",
            texto:
              "What was chosen, what was considered and why it was dropped. This is where judgment shows: cost, risk, deadline, what the business would accept. Signal: at least one real alternative and a reason.",
          },
          {
            titulo: "5. Measured result",
            texto:
              "What changed and how you know: sign-in time, tickets, coverage, audit findings. With no number, say qualitatively what improved and how you would verify it. Never invent numbers. Signal: the result is checkable.",
          },
          {
            titulo: "6. Lesson and principle",
            texto:
              "One lesson and what you would do differently, tied to a principle (least privilege, defense in depth, traceability). Signal: the story ends in something reusable.",
          },
          {
            titulo: "7. If your experience is partial",
            texto:
              "Say what you actually did, what you saw up close, what you studied or built in a lab and how you would approach the rest, with the reasoning. Signal: the interviewer knows exactly where practice ends and study begins.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Common scenarios and where to focus",
        colunas: ["Typical question", "What the interviewer wants to hear", "What to avoid"],
        linhas: [
          [
            "IAM tools you have used, and your favorite",
            "What each was used for, in what context, by what criteria it was chosen and the strengths and weaknesses you saw. “Favorite” depends on the scenario: justify it by criteria. If the question names Amazon IAM, Azure AD (now Microsoft Entra ID) and Google Cloud IAM, talk about the shared concepts (principal, role, policy, scope, workload identity) and say which you used and which you only know in theory",
            "A list of brands with no context; claiming mastery of what you only read about",
          ],
          [
            "Challenges of administering an IAM system",
            "A real problem and how it was handled: permission creep, orphaned accounts, HR synchronization, exceptions, late reviews, differences between environments. Focus on the solution and on prevention",
            "Complaining about people or tools; a problem with no outcome",
          ],
          [
            "Latency when implementing IAM",
            "Method: measure first where the time goes (IdP, network, directory, per-request calls). Fixes: validate tokens locally with cached keys (JWKS) instead of asking the IdP on every call, cache authorization decisions with a short TTL, use connection pools to the directory, bring the IdP closer to the region, keep claims lean. The trade-off: a long cache delays revocation",
            "Caching everything without thinking about revocation; optimizing without measuring",
          ],
          [
            "Taking part in policies and procedures",
            "Your concrete contribution: gathering requirements, drafting, review with legal, HR and business owners, handling exceptions, communication and measuring compliance. Tell policy (the what), standard (the specification) and procedure (the how) apart",
            "Saying you “took part” without detailing what you did",
          ],
          [
            "Working with auditors and legal",
            "How evidence was requested and delivered (samples, reports, logs), how legal requirements became technical controls and how findings became an action plan (see Q19). If you have not, describe how you would prepare",
            "Treating the auditor as an adversary; promising absolute compliance",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The backbone of the answer",
        texto:
          "**Context, problem, decision, result, lesson**, in that order, in about two minutes, ending on the principle the story illustrates (least privilege, traceability, defense in depth). It is the skeleton of the STAR method (situation, task, action, result) with the decision and alternatives highlighted, which is what matters most in IAM. Prepare two to four real stories of your own and adapt each to several questions.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Partial experience: honesty beats bravado",
        texto:
          "Do not invent projects, numbers, titles or tools. The interviewer digs deeper (“and when the token expired?”), and one made-up detail sinks the rest of the conversation. Use “I” for what you did and “we” for the team. Separate three levels: **I used it in production**, **I built it in a lab or studied it** and **I know the concept**. Then show the reasoning: “I have not deployed X in production; in a lab with Y I did Z, and the care I would take is…”. Admitting a limit clearly usually counts more in your favor than an inflated answer.",
      },
    ],
    armadilhas: [
      "Answering with definitions or a list of tools when the question asks for a story with a decision and a result.",
      "Saying “we” for everything and leaving your role unclear, or saying “I” for what the team did.",
      "Inventing numbers, projects or familiarity with a tool: the interviewer digs deeper and the inconsistency shows.",
      "Speaking badly of former teams, vendors or auditors, or telling about a problem without saying how it was solved and what was learned.",
    ],
    autoteste: [
      {
        pergunta: "How do you structure an IAM experience answer?",
        resposta:
          "Context and scale, a problem with a concrete symptom, decision and rejected alternatives, a measured result and a lesson tied to a principle, in about two minutes.",
      },
      {
        pergunta: "What do you say when you know a tool only in theory?",
        resposta:
          "Say so clearly: what you used in production, what you built or studied and how you would approach the rest, showing the reasoning and the concepts the tools share (principal, role, policy, scope), without pretending to have experience.",
      },
    ],
  },
};
