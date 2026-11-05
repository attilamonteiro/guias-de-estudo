import type { Pergunta } from "../../tipos";

// Q109 · Princípio do menor privilégio
export const q109: Pergunta = {
  numero: 109,
  modulo: "autorizacao",
  metodo: "whys",
  pt: {
    titulo: "Princípio do menor privilégio",
    pergunta:
      "Por que o princípio do menor privilégio é central em segurança, e como aplicá-lo na prática a pessoas, serviços e pipelines sem travar o trabalho?",
    porqueEsteMetodo:
      "O menor privilégio costuma ser recitado como regra, e a entrevista pede o raciocínio: por que importa, por que os acessos crescem sozinhos e o que fazer sem paralisar o trabalho. A cadeia de porquês leva da ideia ao método e à forma de medir o progresso.",
    resposta30s:
      "Dar a cada pessoa, serviço ou pipeline **só o acesso necessário, pelo tempo necessário**, limita o **raio de impacto** de erro, abuso e comprometimento e dificulta o **movimento lateral**. Na prática: **parta de zero e acrescente**, conceda por tarefa, use **acesso temporário** para o raro e arriscado, **reduza com base no uso real** e **revise periodicamente**. Não trava o trabalho quando o caminho certo é o mais fácil: autoatendimento rápido, modelos prontos e exceções com prazo.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que limitar o que cada identidade pode fazer, se ela é confiável?",
            resposta:
              "Porque qualquer identidade pode falhar: a pessoa erra, a credencial é roubada, o serviço tem um bug, alguém age de má-fé. O que a identidade pode fazer define o **raio de impacto** quando isso acontece. Permissão que nunca é usada não traz benefício e só aumenta o risco, inclusive a do administrador que a usa uma vez por ano.",
          },
          {
            pergunta: "Por que isso protege contra malware, ransomware e invasores?",
            resposta:
              "Porque quem toma uma identidade herda o que ela pode. O malware executa com os privilégios de quem o abriu: uma conta sem direitos de administrador não instala drivers nem altera o sistema, e um serviço só de leitura não consegue cifrar ou apagar os dados. Para se mover de um sistema a outro (**movimento lateral**, veja Q138), o invasor precisa de novas credenciais a cada salto, o que o desacelera e gera sinais para a detecção.",
          },
          {
            pergunta: "Se é tão óbvio, por que os acessos crescem sozinhos?",
            resposta:
              "Porque conceder é fácil e imediato, e retirar é arriscado e ninguém é cobrado por isso. É o acúmulo de privilégios: “dá admin para destravar”, a pessoa troca de área e leva os acessos antigos, a conta de serviço nasce larga para funcionar logo, políticas com curinga (`*`) são copiadas. Na nuvem isso é comum: papéis amplos na conta ou na assinatura inteira, chaves de acesso de longa duração e identidades padrão com mais direitos que o necessário. Sem um processo que revise e expire, o padrão é o excesso.",
          },
          {
            pergunta: "Como aplicar sem travar o trabalho?",
            resposta:
              "Faça do caminho mínimo o caminho fácil. **Parta de zero** e acrescente por tarefa; use papéis por função e **acesso temporário**, com aprovação e prazo, para o raro e arriscado (veja Q118); dê a cada serviço **uma identidade própria**, com permissão só nos recursos de que precisa; use **credenciais de curta duração** nos pipelines (veja Q14); e **meça o uso real** (último acesso, registros de auditoria) para cortar o que sobra, primeiro em modo de observação e depois valendo, com reversão rápida. **Limites de permissão** deixam as equipes se servirem sozinhas dentro de um teto (veja Q113).",
          },
          {
            pergunta: "Como saber se está funcionando, e quanto custa?",
            resposta:
              "Acompanhe: permissões concedidas × usadas numa janela que você define, número de administradores permanentes, políticas com curinga, contas e chaves de serviço sem dono ou antigas, parcela do acesso privilegiado que é temporária, tempo para conceder e para revogar e taxa de conclusão das revisões (veja Q119). O custo é operacional: mais pedidos, revisões e algum bloqueio indevido. Reduza-o com automação e começando pelas identidades mais poderosas.",
          },
        ],
        causaRaiz:
          "Toda identidade **vai** falhar algum dia, e as permissões decidem o tamanho do estrago. Como o acesso só cresce se ninguém o contém, o menor privilégio precisa estar **no processo** (conceder pouco, expirar, revisar), e não numa boa intenção.",
      },
      {
        tipo: "tabela",
        titulo: "Aplicando a cada tipo de identidade",
        colunas: ["Alvo", "Como aplicar", "Sinal de excesso", "Como não travar o trabalho"],
        linhas: [
          [
            "Pessoas",
            "Papéis por função, sem somar os acessos das funções anteriores; revisão ao mudar de área e a cada ciclo",
            "Acessos do cargo anterior; muitos administradores permanentes",
            "Pedido de acesso por autoatendimento, com fluxo rápido e papéis prontos por função",
          ],
          [
            "Administradores",
            "Papéis de granularidade fina (gerir usuários, ler registros, administrar a rede) em vez de “super admin”; conta separada para tarefas privilegiadas",
            "Todos os administradores com poder total; conta de administrador usada para e-mail e navegação",
            "Elevação sob demanda, com prazo e registro (veja Q118), e conta de emergência controlada",
          ],
          [
            "Serviços",
            "Identidade própria por carga de trabalho, com permissão só nos recursos e ações que usa; sem chave de longa duração quando houver alternativa (veja Q16)",
            "Uma conta de serviço compartilhada por vários sistemas; ações e recursos com `*`",
            "Gerar a política a partir do uso observado e partir de um modelo mínimo",
          ],
          [
            "Pipelines de CI/CD e cadeia de suprimentos",
            "Credencial de curta duração por federação, por ambiente; papel de construção separado do de implantação; produção exige aprovação; só quem deve publica pacotes e imagens",
            "Segredo de longa duração no repositório; o mesmo token constrói e implanta em produção",
            "Papéis prontos por tipo de pipeline; aprovação só no passo que toca produção",
          ],
        ],
        nota: "No pipeline, o menor privilégio limita o dano de uma dependência ou de um passo comprometido: ele roda com a identidade do pipeline e só alcança o que ela alcança.",
      },
      {
        tipo: "passos",
        titulo: "Revisando o menor privilégio, passo a passo",
        passos: [
          {
            titulo: "1. Inventariar",
            texto:
              "Liste as identidades (pessoas, serviços, pipelines, terceiros) e o que cada uma pode fazer, incluindo grupos aninhados, papéis herdados e chaves de longa duração. Sem inventário não há o que reduzir.",
          },
          {
            titulo: "2. Priorizar por risco",
            texto:
              "Comece pelo que mais machuca: administradores, acesso a produção e a dados sensíveis, contas de serviço, chaves antigas e acessos externos.",
          },
          {
            titulo: "3. Comparar concedido com usado",
            texto:
              "Use o último acesso e os registros de auditoria numa janela que cubra os ciclos do negócio (fechamento do mês, do ano). Permissão sem uso é candidata a sair; a exceção sazonal precisa de dono.",
          },
          {
            titulo: "4. Reduzir em etapas",
            texto:
              "Troque por um papel menor ou retire, depois de rodar em modo de observação ou de aviso e de comunicar os donos, com reversão rápida. Troque o acesso permanente por temporário quando fizer sentido.",
          },
          {
            titulo: "5. Registrar as exceções",
            texto:
              "Toda permissão que continua larga tem dono, justificativa e data de expiração. Exceção sem prazo vira regra.",
          },
          {
            titulo: "6. Repetir e automatizar",
            texto:
              "Agende as revisões, alerte sobre novos curingas e novos administradores e valide as políticas antes de entrar em produção (testes e validadores de política).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Mínimo não é nenhum",
        texto:
          "O alvo é “o suficiente para a tarefa”, não “o mínimo absoluto”: cortar demais gera pedidos sem fim, contas compartilhadas e atalhos piores que o problema. Também não é um projeto que termina, porque o necessário muda com o negócio. E ele depende de outros controles: separação de funções (veja Q110), acesso temporário (veja Q118) e, no zero trust (veja Q120; NIST SP 800-207), o acesso concedido por sessão ou requisição, só com o necessário.",
      },
    ],
    armadilhas: [
      "Tratar como projeto único: o acesso volta a crescer em meses se não houver revisão, expiração e alerta.",
      "Remover permissões “sem uso” sem olhar a sazonalidade (fechamento do ano) nem o dono do processo, e derrubar uma rotina crítica.",
      "Resolver o atrito com contas compartilhadas, administrador para todos ou `*` “só por enquanto”: o atalho vira padrão e a rastreabilidade some.",
      "Aplicar só às pessoas e esquecer serviços, pipelines e terceiros, onde as permissões costumam ser maiores e ninguém as revisa.",
    ],
    autoteste: [
      {
        pergunta: "O que é o princípio do menor privilégio, e que exemplo prático você daria?",
        resposta:
          "Cada identidade recebe só o acesso necessário à sua tarefa, pelo tempo necessário. Exemplo: o pipeline de implantação usa uma credencial de curta duração que só atualiza o serviço de um ambiente, e uma pessoa recebe acesso temporário e aprovado à produção em vez de acesso permanente.",
      },
      {
        pergunta: "Como reduzir permissões em produção sem derrubar nada?",
        resposta:
          "Medindo o uso real numa janela suficiente, avisando os donos, aplicando primeiro em modo de observação, reduzindo por etapas com reversão rápida e registrando as exceções com dono e prazo.",
      },
    ],
  },
  en: {
    titulo: "Principle of least privilege",
    pergunta:
      "Why is the principle of least privilege central to security, and how do you apply it in practice to people, services and pipelines without blocking work?",
    porqueEsteMetodo:
      "Least privilege is often recited as a rule, and the interview asks for the reasoning: why it matters, why access grows on its own and what to do without paralyzing the work. The chain of whys leads from the idea to the method and to how you measure progress.",
    resposta30s:
      "Giving each person, service or pipeline **only the access it needs, for as long as it needs it**, limits the **blast radius** of error, abuse and compromise and makes **lateral movement** harder. In practice: **start from zero and add**, grant per task, use **temporary access** for what is rare and risky, **cut back based on real usage** and **review periodically**. It does not block work when the right path is the easy one: fast self-service, ready-made templates and exceptions with an expiry.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why limit what each identity can do, if it is trusted?",
            resposta:
              "Because any identity can fail: the person makes a mistake, the credential is stolen, the service has a bug, someone acts in bad faith. What the identity can do sets the **blast radius** when that happens. A permission that is never used brings no benefit and only adds risk, including the administrator’s that is used once a year.",
          },
          {
            pergunta: "Why does this protect against malware, ransomware and intruders?",
            resposta:
              "Because whoever takes over an identity inherits what it can do. Malware runs with the privileges of whoever opened it: an account without administrator rights cannot install drivers or change the system, and a read-only service cannot encrypt or delete the data. To move from one system to another (**lateral movement**, see Q138), the intruder needs new credentials at every hop, which slows them down and creates signals for detection.",
          },
          {
            pergunta: "If it is so obvious, why does access grow on its own?",
            resposta:
              "Because granting is easy and immediate, while removing is risky and nobody is held accountable for it. This is privilege accumulation: “give them admin to unblock this”, the person changes teams and keeps the old access, the service account is born broad so it works right away, policies with a wildcard (`*`) get copied. In the cloud this is common: broad roles over a whole account or subscription, long-lived access keys and default identities with more rights than needed. Without a process that reviews and expires, the default is excess.",
          },
          {
            pergunta: "How do you apply it without blocking work?",
            resposta:
              "Make the minimal path the easy path. **Start from zero** and add per task; use roles by job function and **temporary access**, with approval and an expiry, for what is rare and risky (see Q118); give each service **its own identity**, with permission only on the resources it needs; use **short-lived credentials** in pipelines (see Q14); and **measure real usage** (last access, audit logs) to trim what is left over, first in observation mode and then enforced, with fast rollback. **Permission boundaries** let teams serve themselves within a ceiling (see Q113).",
          },
          {
            pergunta: "How do you know it is working, and what does it cost?",
            resposta:
              "Track: permissions granted vs used over a window you define, the number of standing administrators, policies with wildcards, service accounts and keys with no owner or that are old, the share of privileged access that is temporary, time to grant and to revoke, and the completion rate of access reviews (see Q119). The cost is operational: more requests, reviews and the occasional wrongful block. Reduce it with automation and by starting with the most powerful identities.",
          },
        ],
        causaRaiz:
          "Every identity **will** fail someday, and permissions decide the size of the damage. Because access only grows unless something holds it back, least privilege must live **in the process** (grant little, expire, review), not in good intentions.",
      },
      {
        tipo: "tabela",
        titulo: "Applying it to each kind of identity",
        colunas: ["Target", "How to apply it", "Sign of excess", "How to avoid blocking work"],
        linhas: [
          [
            "People",
            "Roles by job function, without adding up the access of previous functions; review on a move and every cycle",
            "Access from a previous position; many standing administrators",
            "Self-service access requests, with a fast flow and ready-made roles per function",
          ],
          [
            "Administrators",
            "Fine-grained roles (manage users, read logs, administer the network) instead of “super admin”; a separate account for privileged tasks",
            "All administrators with full power; the administrator account used for email and browsing",
            "On-demand elevation with an expiry and a record (see Q118), and a controlled emergency account",
          ],
          [
            "Services",
            "Its own identity per workload, with permission only on the resources and actions it uses; no long-lived key when there is an alternative (see Q16)",
            "One service account shared by several systems; actions and resources set to `*`",
            "Generate the policy from observed usage and start from a minimal template",
          ],
          [
            "CI/CD pipelines and the supply chain",
            "Short-lived credentials through federation, per environment; the build role separate from the deploy role; production requires approval; only the right people publish packages and images",
            "A long-lived secret in the repository; the same token builds and deploys to production",
            "Ready-made roles per pipeline type; approval only at the step that touches production",
          ],
        ],
        nota: "In a pipeline, least privilege limits the damage from a compromised dependency or step: it runs with the pipeline’s identity and only reaches what that identity reaches.",
      },
      {
        tipo: "passos",
        titulo: "Reviewing least privilege, step by step",
        passos: [
          {
            titulo: "1. Take inventory",
            texto:
              "List the identities (people, services, pipelines, third parties) and what each can do, including nested groups, inherited roles and long-lived keys. Without an inventory there is nothing to reduce.",
          },
          {
            titulo: "2. Prioritize by risk",
            texto:
              "Start with what hurts most: administrators, access to production and to sensitive data, service accounts, old keys and external access.",
          },
          {
            titulo: "3. Compare granted with used",
            texto:
              "Use last-access data and audit logs over a window that covers the business cycles (month-end, year-end). A permission with no use is a candidate for removal; a seasonal exception needs an owner.",
          },
          {
            titulo: "4. Reduce in stages",
            texto:
              "Swap for a smaller role or remove, after running in observation or warning mode and telling the owners, with fast rollback. Replace standing access with temporary access where it makes sense.",
          },
          {
            titulo: "5. Record the exceptions",
            texto:
              "Every permission that stays broad has an owner, a justification and an expiry date. An exception with no deadline becomes the rule.",
          },
          {
            titulo: "6. Repeat and automate",
            texto:
              "Schedule the reviews, alert on new wildcards and new administrators, and validate policies before they reach production (policy tests and validators).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Least is not none",
        texto:
          "The target is “enough for the task”, not “the absolute minimum”: cutting too much creates endless requests, shared accounts and shortcuts worse than the problem. It is also not a project that ends, because what is needed changes with the business. And it depends on other controls: segregation of duties (see Q110), temporary access (see Q118) and, in zero trust (see Q120; NIST SP 800-207), access granted per session or request, with only what is needed.",
      },
    ],
    armadilhas: [
      "Treating it as a one-off project: access grows back within months without review, expiry and alerts.",
      "Removing “unused” permissions without looking at seasonality (year-end close) or the process owner, and breaking a critical routine.",
      "Solving the friction with shared accounts, administrator for everyone or `*` “just for now”: the shortcut becomes the default and traceability disappears.",
      "Applying it only to people and forgetting services, pipelines and third parties, where permissions tend to be larger and nobody reviews them.",
    ],
    autoteste: [
      {
        pergunta: "What is the principle of least privilege, and what practical example would you give?",
        resposta:
          "Each identity gets only the access its task requires, for as long as it requires it. Example: the deployment pipeline uses a short-lived credential that can only update one environment’s service, and a person gets temporary, approved access to production instead of standing access.",
      },
      {
        pergunta: "How do you reduce permissions in production without breaking anything?",
        resposta:
          "By measuring real usage over a long enough window, warning the owners, applying first in observation mode, reducing in stages with fast rollback and recording the exceptions with an owner and an expiry.",
      },
    ],
  },
};
