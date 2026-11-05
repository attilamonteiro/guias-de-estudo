import type { Pergunta } from "../../tipos";

// Q103 · DAC, MAC e modelos de acesso
export const q103: Pergunta = {
  numero: 103,
  modulo: "autorizacao",
  metodo: "compare",
  pt: {
    titulo: "DAC, MAC e modelos de acesso",
    pergunta:
      "Compare DAC, MAC, RBAC e ABAC como modelos de controle de acesso. O que são os modelos Bell-LaPadula e Biba e onde aparecem na prática?",
    porqueEsteMetodo:
      "DAC, MAC, RBAC e ABAC parecem sinônimos de “controle de acesso” até serem postos lado a lado: o que muda é quem decide a permissão e quanto isso custa. A matriz mostra a diferença e a regra de decisão diz quando escolher cada um.",
    resposta30s:
      "No **DAC** o **dono do recurso** decide quem acessa (permissões de arquivo, compartilhamento de documentos); no **MAC** uma **política central** com rótulos manda, e nem o dono a altera (SELinux, classificações militares); no **RBAC** as permissões vêm de **papéis** atribuídos por uma administração; no **ABAC** a decisão sai de **atributos** do usuário, do recurso, da ação e do ambiente. **Bell-LaPadula** protege a confidencialidade (sem ler para cima, sem escrever para baixo) e **Biba**, a integridade (o espelho). Na prática os modelos se misturam: RBAC como base, ABAC para o contexto, e DAC e MAC no sistema operacional por baixo.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Quatro respostas para “quem decide?”",
        colunas: ["Modelo", "Quem decide a permissão", "Flexibilidade e custo", "Auditoria", "Onde aparece"],
        linhas: [
          [
            "DAC (discricionário)",
            "O **dono** do recurso concede e revoga (descentralizado)",
            "Máxima flexibilidade e custo central baixo; escala mal numa organização, porque cada dono decide à sua maneira",
            "Difícil: permissões espalhadas e acumuladas; um programa malicioso rodando como o dono herda tudo o que ele pode",
            "Permissões de arquivo de Unix e ACLs, compartilhamento em drives de documentos, ACLs de buckets",
          ],
          [
            "MAC (obrigatório)",
            "Uma **política central** com rótulos de sensibilidade e de habilitação; nem o dono altera (centralizado)",
            "Rígido; custo alto de classificar objetos e habilitar sujeitos",
            "Forte: regras globais e verificáveis",
            "SELinux e AppArmor (confinamento de processos), sistemas governamentais e militares com níveis de classificação",
          ],
          [
            "RBAC",
            "A **administração** liga usuários a papéis e papéis a permissões (centralizado)",
            "Boa para estruturas estáveis; sofre com a explosão de papéis; custo moderado",
            "Boa: “quem tem o papel X” e “o que X pode fazer” são consultas diretas",
            "Aplicações corporativas, grupos do IdP, papéis de nuvem, Kubernetes (veja Q104)",
          ],
          [
            "ABAC",
            "Uma **política** avaliada sobre atributos de sujeito, recurso, ação e ambiente",
            "Muito flexível e granular; exige atributos de qualidade e um motor de política",
            "Difícil responder “quem pode o quê” sem simular a política",
            "Condições em políticas de nuvem, OPA, Cedar, XACML (veja Q105)",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Bell-LaPadula e Biba: dois modelos de fluxo de informação",
        colunas: ["Modelo", "Protege", "Regras", "Onde aparece", "Limite"],
        linhas: [
          [
            "Bell-LaPadula",
            "**Confidencialidade**",
            "“Sem leitura para cima” (não se lê um nível acima do seu) e “sem escrita para baixo” (não se grava informação em nível inferior, para ela não vazar)",
            "Ambientes militares e governamentais com classificações (público, confidencial, secreto); inspirou os controles de nível múltiplo (MLS), como a política MLS do SELinux",
            "Não trata integridade; é rígido e exige exceções confiáveis para rebaixar a classificação de um documento",
          ],
          [
            "Biba",
            "**Integridade**",
            "“Sem leitura para baixo” (não se confia em dado menos confiável) e “sem escrita para cima” (um nível baixo não corrompe um alto)",
            "Onde corromper é pior que vazar: controle industrial, firmware, cadeia de suprimento de software; os níveis de integridade do Windows são inspirados nessa ideia",
            "Não trata confidencialidade; é o espelho do Bell-LaPadula e os dois não se aplicam juntos sem conflito",
          ],
        ],
        nota: "Os dois são modelos teóricos de fluxo de informação com rótulos, típicos de ambientes MAC. Na maioria das aplicações aparecem como inspiração: classificação de dados, proibição de copiar dado sensível para um canal público e níveis de confiança entre componentes.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Pergunte **quem deve ter a última palavra**. O dono do dado, em colaboração de baixo risco: DAC. A organização ou a lei, independente do dono: MAC. Muitas pessoas com funções estáveis: RBAC. Decisões que dependem de contexto, valor ou propriedade do recurso: ABAC (ou relações, veja Q106). Na prática eles se misturam: RBAC como base, ABAC para as restrições de contexto, DAC no compartilhamento do dia a dia e MAC contendo processos por baixo.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Para explicar a quem não é técnico",
        texto:
          "O controle discricionário (DAC) é como uma casa em que **cada morador decide a quem dar a chave** dos seus cômodos: é simples e flexível, mas a segurança da casa depende do bom senso de cada um. No controle obrigatório (MAC), é o condomínio que decide quem entra em cada andar, e nenhum morador pode mudar a regra. A diferença entre controle **descentralizado** e **centralizado** é a mesma: no primeiro, cada dono ou departamento define as regras (ágil, mas inconsistente); no segundo, uma autoridade única as define (consistente, mas pode virar gargalo).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "DAC não é “inseguro” e MAC não é “melhor”",
        texto:
          "O DAC é adequado para colaboração, e o seu defeito é ser a única barreira para dados que a organização precisa proteger independentemente do dono: basta um programa malicioso rodando com as permissões do usuário para repassar tudo. O MAC resolve isso ao custo de rigidez e de esforço de classificação, e por isso aparece onde o risco justifica. E os quatro nomes respondem a perguntas diferentes: DAC e MAC dizem **quem manda na política**; RBAC e ABAC dizem **como a política é expressa**. Por isso podem coexistir.",
      },
    ],
    armadilhas: [
      "Tratar os quatro modelos como alternativas de mesma natureza: DAC e MAC respondem a quem manda na política, RBAC e ABAC a como ela é expressa, e um mesmo sistema combina vários.",
      "Concluir que o DAC é inseguro por definição: ele serve à colaboração; o problema é usá-lo sozinho para dados que a organização precisa proteger independente do dono.",
      "Chamar de MAC qualquer política administrada pela TI: MAC exige rótulos e regras que nem o dono do dado nem o administrador da aplicação alteram sozinhos.",
      "Citar o Bell-LaPadula como se resolvesse a segurança de uma aplicação web comum: é um modelo de fluxo de informação com rótulos, e a inspiração aparece como classificação de dados e controle de saída.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre DAC e MAC? Dê um exemplo de cada.",
        resposta:
          "No DAC o dono do recurso decide quem acessa (por exemplo, as permissões de um arquivo Unix ou o compartilhamento de um documento). No MAC uma política central, com rótulos de sensibilidade, decide e o dono não pode alterá-la (por exemplo, o SELinux ou as classificações militares).",
      },
      {
        pergunta:
          "O que protegem as regras “sem leitura para cima” e “sem escrita para baixo”, e qual modelo é o espelho para integridade?",
        resposta:
          "Protegem a confidencialidade, no modelo Bell-LaPadula: ninguém lê o que está acima do seu nível, e ninguém grava em nível inferior o que poderia vazar. O espelho para integridade é o Biba: sem leitura para baixo e sem escrita para cima.",
      },
    ],
  },
  en: {
    titulo: "DAC, MAC and access models",
    pergunta:
      "Compare DAC, MAC, RBAC and ABAC as access control models. What are the Bell-LaPadula and Biba models, and where do they show up in practice?",
    porqueEsteMetodo:
      "DAC, MAC, RBAC and ABAC sound like synonyms for “access control” until they are placed side by side: what changes is who decides the permission and what that costs. The matrix shows the difference and the decision rule says when to pick each.",
    resposta30s:
      "In **DAC** the **resource owner** decides who gets access (file permissions, document sharing); in **MAC** a **central policy** with labels rules, and not even the owner can change it (SELinux, military classifications); in **RBAC** permissions come from **roles** assigned by an administration; in **ABAC** the decision comes from **attributes** of the user, the resource, the action and the environment. **Bell-LaPadula** protects confidentiality (no read up, no write down) and **Biba** protects integrity (its mirror). In practice the models blend: RBAC as the base, ABAC for context, and DAC and MAC in the operating system underneath.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Four answers to “who decides?”",
        colunas: ["Model", "Who decides the permission", "Flexibility and cost", "Auditing", "Where it shows up"],
        linhas: [
          [
            "DAC (discretionary)",
            "The resource **owner** grants and revokes (decentralized)",
            "Maximum flexibility and low central cost; scales poorly in an organization, because each owner decides in their own way",
            "Hard: permissions scattered and accumulated; a malicious program running as the owner inherits everything the owner can do",
            "Unix file permissions and ACLs, sharing in document drives, bucket ACLs",
          ],
          [
            "MAC (mandatory)",
            "A **central policy** with sensitivity and clearance labels; not even the owner changes it (centralized)",
            "Rigid; high cost to classify objects and clear subjects",
            "Strong: global, verifiable rules",
            "SELinux and AppArmor (process confinement), government and military systems with classification levels",
          ],
          [
            "RBAC",
            "The **administration** links users to roles and roles to permissions (centralized)",
            "Good for stable structures; suffers from role explosion; moderate cost",
            "Good: “who has role X” and “what can X do” are direct queries",
            "Corporate applications, IdP groups, cloud roles, Kubernetes (see Q104)",
          ],
          [
            "ABAC",
            "A **policy** evaluated over attributes of subject, resource, action and environment",
            "Very flexible and granular; needs good-quality attributes and a policy engine",
            "Hard to answer “who can do what” without simulating the policy",
            "Conditions in cloud policies, OPA, Cedar, XACML (see Q105)",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Bell-LaPadula and Biba: two information-flow models",
        colunas: ["Model", "Protects", "Rules", "Where it shows up", "Limit"],
        linhas: [
          [
            "Bell-LaPadula",
            "**Confidentiality**",
            "“No read up” (you do not read a level above your own) and “no write down” (you do not write information to a lower level, so it cannot leak)",
            "Military and government environments with classifications (public, confidential, secret); it inspired multilevel security (MLS) controls, such as the SELinux MLS policy",
            "Does not address integrity; it is rigid and needs trusted exceptions to downgrade a document’s classification",
          ],
          [
            "Biba",
            "**Integrity**",
            "“No read down” (you do not trust less trustworthy data) and “no write up” (a low level cannot corrupt a high one)",
            "Where corrupting is worse than leaking: industrial control, firmware, software supply chains; Windows integrity levels are inspired by this idea",
            "Does not address confidentiality; it is the mirror of Bell-LaPadula, and the two cannot be applied together without conflict",
          ],
        ],
        nota: "Both are theoretical information-flow models with labels, typical of MAC environments. In most applications they show up as inspiration: data classification, a ban on copying sensitive data to a public channel, and trust levels between components.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Ask **who should have the last word**. The data owner, in low-risk collaboration: DAC. The organization or the law, regardless of the owner: MAC. Many people with stable duties: RBAC. Decisions that depend on context, value or ownership of the resource: ABAC (or relationships, see Q106). In practice they blend: RBAC as the base, ABAC for context restrictions, DAC for everyday sharing and MAC containing processes underneath.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Explaining it to a non-technical person",
        texto:
          "Discretionary control (DAC) is like a house where **each resident decides who gets a key** to their own rooms: simple and flexible, but the safety of the house depends on each person’s judgment. In mandatory control (MAC), the building management decides who enters each floor, and no resident can change the rule. The difference between **decentralized** and **centralized** control is the same: in the first, each owner or department sets the rules (agile, but inconsistent); in the second, a single authority sets them (consistent, but it can become a bottleneck).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "DAC is not “insecure” and MAC is not “better”",
        texto:
          "DAC suits collaboration, and its flaw is being the only barrier for data the organization must protect regardless of the owner: one malicious program running with the user’s permissions is enough to pass everything along. MAC solves that at the cost of rigidity and classification effort, which is why it appears where the risk justifies it. And the four names answer different questions: DAC and MAC say **who controls the policy**; RBAC and ABAC say **how the policy is expressed**. That is why they can coexist.",
      },
    ],
    armadilhas: [
      "Treating the four models as alternatives of the same kind: DAC and MAC answer who controls the policy, RBAC and ABAC how it is expressed, and one system combines several.",
      "Concluding that DAC is insecure by definition: it serves collaboration; the problem is using it alone for data the organization must protect regardless of the owner.",
      "Calling any IT-administered policy MAC: MAC requires labels and rules that neither the data owner nor the application administrator can change alone.",
      "Citing Bell-LaPadula as if it solved the security of an ordinary web application: it is an information-flow model with labels, and the inspiration shows up as data classification and egress control.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between DAC and MAC? Give an example of each.",
        resposta:
          "In DAC the resource owner decides who gets access (for example, the permissions on a Unix file or the sharing of a document). In MAC a central policy with sensitivity labels decides and the owner cannot change it (for example, SELinux or military classifications).",
      },
      {
        pergunta:
          "What do the rules “no read up” and “no write down” protect, and which model is the mirror for integrity?",
        resposta:
          "They protect confidentiality, in the Bell-LaPadula model: nobody reads what sits above their level, and nobody writes to a lower level what could leak. The mirror for integrity is Biba: no read down and no write up.",
      },
    ],
  },
};
