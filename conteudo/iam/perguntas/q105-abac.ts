import type { Pergunta } from "../../tipos";

// Q105 · ABAC
export const q105: Pergunta = {
  numero: 105,
  modulo: "autorizacao",
  metodo: "feynman",
  pt: {
    titulo: "ABAC",
    pergunta:
      "O que é ABAC e como ele decide com atributos do usuário, do recurso, da ação e do ambiente? Em que cenários dinâmicos ele supera o RBAC?",
    porqueEsteMetodo:
      "O ABAC é mais fácil de entender como um segurança que lê regras, e não uma lista de nomes. A analogia leva ao mecanismo (a política e o motor que a avalia) e ao ponto em que a imagem para de valer: regras poderosas dependem de dados de boa qualidade.",
    resposta30s:
      "No **ABAC**, a decisão não vem de um papel, mas de uma **política** avaliada sobre **atributos**: do **usuário** (setor, plantão), do **recurso** (tipo, sensibilidade), da **ação** (ler, editar) e do **ambiente** (rede, horário, risco). Um **PDP** (ponto de decisão) avalia a política e um **PEP** (ponto de aplicação) a impõe. Ele supera o RBAC quando a regra depende de contexto e muda a todo momento, ao custo de depender de bons atributos e de ser mais difícil de auditar e testar.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine um segurança que não conhece ninguém pelo nome, mas segue regras: “entra quem for médico do plantão, na rede do hospital, para ver prontuários do próprio setor”. Ele olha o crachá, o horário, a porta e o documento pedido, e decide na hora. Se a escala do plantão muda, ele muda de resposta sem que ninguém reescreva uma lista de nomes.",
        tecnico:
          "O **ABAC** decide avaliando uma política sobre quatro conjuntos de atributos: do **sujeito** (função, setor, habilitação, plantão), do **recurso** (tipo, dono, classificação, setor), da **ação** (ler, editar, aprovar) e do **ambiente** (horário, rede, dispositivo, nível de risco). Um **PEP** intercepta o pedido; o **PDP** avalia as políticas com os atributos (buscados em fontes como o diretório e o banco do recurso) e devolve permitir ou negar. A granularidade vem de combinar atributos, e não de multiplicar papéis.",
        limite:
          "O segurança só decide bem se o crachá, a escala e a classificação do documento estiverem **certos**: o ABAC é tão bom quanto a qualidade e a origem dos atributos. E um segurança com mil regras é difícil de auditar: responder “quem pode ler isto?” exige simular a política, e não ler uma lista.",
      },
      {
        tipo: "fluxo",
        titulo: "Como uma decisão ABAC acontece",
        etapas: [
          "Uma pessoa ou um serviço tenta uma ação sobre um recurso (por exemplo, ler um prontuário)",
          "O **PEP** (ponto de aplicação: gateway ou middleware) intercepta e monta um pedido de decisão com o que já sabe sobre sujeito, ação, recurso e ambiente",
          "O **PDP** (ponto de decisão) precisa de mais atributos e os busca nos **PIPs** (pontos de informação: diretório, banco do recurso, contexto de risco)",
          "O PDP avalia as políticas, mantidas no **PAP** (ponto de administração), e devolve permitir ou negar, às vezes com obrigações (registrar, mascarar campos)",
          "O PEP aplica a decisão, nega por padrão se o PDP não responde e registra tudo para auditoria",
        ],
        nota: "Os nomes PEP, PDP, PIP e PAP vêm do XACML e do guia de ABAC do NIST (SP 800-162). É a mesma arquitetura que aparece no Zero Trust (NIST SP 800-207).",
      },
      {
        tipo: "tabela",
        titulo: "Onde o ABAC supera o RBAC",
        colunas: ["Cenário", "Com RBAC", "Com ABAC"],
        linhas: [
          [
            "Médico só vê prontuários do próprio setor",
            "Um papel por setor, multiplicando os papéis",
            "Uma regra: `sujeito.setor == recurso.setor`",
          ],
          [
            "Acesso só em horário comercial, de rede corporativa e com dispositivo em conformidade",
            "O papel não expressa contexto",
            "Atributos do ambiente na própria política",
          ],
          [
            "Aprovar pedidos até a alçada de cada pessoa",
            "Um papel por faixa de valor",
            "`recurso.valor <= sujeito.alcada`",
          ],
          [
            "Dados classificados (público, interno, confidencial) e habilitação da pessoa",
            "Papéis para cada combinação",
            "Comparar os rótulos do recurso e do sujeito",
          ],
          [
            "Multi-tenant: cada cliente só vê os próprios dados",
            "Papéis por cliente, ou checagem espalhada pelo código",
            "Uma regra `sujeito.tenant == recurso.tenant` aplicada em todo lugar",
          ],
        ],
        nota: "Regra prática: use RBAC para o que é estável e coletivo (quem é da equipe de vendas) e ABAC para o que depende de contexto e muda (de qual região, até qual valor, em que condição). Os dois convivem na mesma política.",
      },
      {
        tipo: "codigo",
        titulo: "Uma política ABAC como código",
        legenda: "TypeScript",
        codigo: `interface Pedido {
  sujeito: { papel: string; setor: string; plantao: boolean };
  acao: "ler" | "editar";
  recurso: { tipo: string; setor: string };
  ambiente: { redeDoHospital: boolean };
}

// "Só médico do plantão, na rede do hospital, no próprio setor"
export function decidir({ sujeito, acao, recurso, ambiente }: Pedido): "permitir" | "negar" {
  const regraDoProntuario =
    recurso.tipo === "prontuario" &&
    acao === "ler" &&
    sujeito.papel === "medico" &&
    sujeito.setor === recurso.setor &&
    sujeito.plantao &&
    ambiente.redeDoHospital;

  return regraDoProntuario ? "permitir" : "negar"; // o padrão é negar
}`,
        nota: "Em sistemas reais a política fica fora do código da aplicação, numa linguagem de políticas (como o Rego do OPA, o Cedar ou o XACML), para ser versionada, testada e alterada sem reimplantar. Os atributos devem vir de fontes confiáveis, nunca do cliente, e o padrão é negar.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O custo do ABAC",
        texto:
          "A granularidade tem preço. **Atributos**: precisam de dono, fonte autoritativa e atualização (um cargo antigo no diretório ou um rótulo de sensibilidade ausente deixa a política certa e a decisão errada). **Auditoria**: “quem pode o quê?” vira simulação. **Desempenho**: o PDP busca atributos a cada decisão; use cache de validade curta e tempos limite, negando por padrão quando falhar. **Testes**: trate a política como código, com casos de permitir e de negar, versionada e com simulação antes de publicar.",
      },
    ],
    armadilhas: [
      "Atributos sem dono ou desatualizados (cargo antigo no diretório, rótulo de sensibilidade ausente): a política está certa e a decisão errada. Defina a fonte autoritativa e o ciclo de vida de cada atributo.",
      "Usar como atributo algo que o usuário controla (cabeçalho, claim não assinada): quem pode alterar o atributo escolhe a própria decisão. Use fontes confiáveis.",
      "Acumular dezenas de regras com exceções e sobreposição, sem testes: “quem pode ler isto?” vira adivinhação. Teste a política como código, com casos de permitir e de negar.",
      "Esquecer o negar por padrão, ou deixar o PDP síncrono sem tempo limite nem cache: uma falha do serviço derruba o acesso, ou o acesso abre por falta de resposta.",
    ],
    autoteste: [
      {
        pergunta: "Por que o ABAC atende melhor a regra “só quem está no plantão e na rede do hospital”?",
        resposta:
          "Porque plantão e rede não são papéis estáveis: mudam a cada hora. Com RBAC seria preciso um papel por combinação ou uma checagem espalhada no código; com ABAC, uma regra lê os atributos do momento (plantão, rede, setor) e decide.",
      },
      {
        pergunta: "Por que é mais difícil auditar “quem pode acessar o quê” no ABAC do que no RBAC?",
        resposta:
          "No RBAC, a resposta é uma lista de papéis e de membros. No ABAC, depende dos valores dos atributos no momento da consulta, então é preciso avaliar ou simular a política contra os sujeitos e recursos reais, com ferramentas de análise e testes.",
      },
    ],
  },
  en: {
    titulo: "ABAC",
    pergunta:
      "What is ABAC and how does it decide using attributes of the user, the resource, the action and the environment? In which dynamic scenarios does it outperform RBAC?",
    porqueEsteMetodo:
      "ABAC is easiest to grasp as a guard who reads rules instead of a list of names. The analogy leads to the mechanism (the policy and the engine that evaluates it) and to the point where the picture stops holding: powerful rules depend on good data.",
    resposta30s:
      "In **ABAC**, the decision comes not from a role but from a **policy** evaluated over **attributes**: of the **user** (department, on-call), of the **resource** (type, sensitivity), of the **action** (read, edit) and of the **environment** (network, time, risk). A **PDP** (decision point) evaluates the policy and a **PEP** (enforcement point) applies it. It outperforms RBAC when the rule depends on context and changes constantly, at the cost of relying on good attributes and being harder to audit and test.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine a guard who does not know anyone by name but follows rules: “anyone who is a doctor on call, on the hospital network, may see records from their own department”. The guard looks at the badge, the time, the door and the document requested, and decides on the spot. If the on-call schedule changes, the answer changes without anyone rewriting a list of names.",
        tecnico:
          "**ABAC** decides by evaluating a policy over four sets of attributes: of the **subject** (role, department, clearance, on-call status), of the **resource** (type, owner, classification, department), of the **action** (read, edit, approve) and of the **environment** (time, network, device, risk level). A **PEP** intercepts the request; the **PDP** evaluates the policies with the attributes (fetched from sources such as the directory and the resource’s database) and returns permit or deny. Granularity comes from combining attributes, not from multiplying roles.",
        limite:
          "The guard only decides well if the badge, the schedule and the document’s classification are **right**: ABAC is only as good as the quality and origin of its attributes. And a guard with a thousand rules is hard to audit: answering “who can read this?” means simulating the policy, not reading a list.",
      },
      {
        tipo: "fluxo",
        titulo: "How an ABAC decision happens",
        etapas: [
          "A person or a service attempts an action on a resource (for example, reading a medical record)",
          "The **PEP** (enforcement point: gateway or middleware) intercepts it and builds a decision request with what it already knows about subject, action, resource and environment",
          "The **PDP** (decision point) needs more attributes and fetches them from the **PIPs** (information points: directory, the resource’s database, risk context)",
          "The PDP evaluates the policies, kept in the **PAP** (administration point), and returns permit or deny, sometimes with obligations (log, mask fields)",
          "The PEP applies the decision, denies by default if the PDP does not answer and logs everything for audit",
        ],
        nota: "The names PEP, PDP, PIP and PAP come from XACML and from NIST’s ABAC guide (SP 800-162). It is the same architecture that appears in Zero Trust (NIST SP 800-207).",
      },
      {
        tipo: "tabela",
        titulo: "Where ABAC outperforms RBAC",
        colunas: ["Scenario", "With RBAC", "With ABAC"],
        linhas: [
          [
            "A doctor sees only records from their own department",
            "One role per department, multiplying roles",
            "One rule: `subject.department == resource.department`",
          ],
          [
            "Access only during business hours, from the corporate network and with a compliant device",
            "A role cannot express context",
            "Environment attributes in the policy itself",
          ],
          [
            "Approving orders up to each person’s limit",
            "One role per value band",
            "`resource.amount <= subject.limit`",
          ],
          [
            "Classified data (public, internal, confidential) and a person’s clearance",
            "Roles for every combination",
            "Compare the labels of resource and subject",
          ],
          [
            "Multi-tenant: each customer sees only their own data",
            "Roles per customer, or checks scattered through the code",
            "One rule, `subject.tenant == resource.tenant`, applied everywhere",
          ],
        ],
        nota: "Rule of thumb: use RBAC for what is stable and collective (who is on the sales team) and ABAC for what depends on context and changes (which region, up to what amount, under what condition). The two live together in the same policy.",
      },
      {
        tipo: "codigo",
        titulo: "An ABAC policy as code",
        legenda: "TypeScript",
        codigo: `interface Request {
  subject: { role: string; department: string; onCall: boolean };
  action: "read" | "edit";
  resource: { type: string; department: string };
  environment: { onHospitalNetwork: boolean };
}

// "Only on-call doctors, on the hospital network, in their own department"
export function decide({ subject, action, resource, environment }: Request): "permit" | "deny" {
  const medicalRecordRule =
    resource.type === "medical-record" &&
    action === "read" &&
    subject.role === "doctor" &&
    subject.department === resource.department &&
    subject.onCall &&
    environment.onHospitalNetwork;

  return medicalRecordRule ? "permit" : "deny"; // the default is deny
}`,
        nota: "In real systems the policy lives outside the application code, in a policy language (such as OPA’s Rego, Cedar or XACML), so it can be versioned, tested and changed without redeploying. Attributes must come from trusted sources, never from the client, and the default is deny.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The cost of ABAC",
        texto:
          "Granularity has a price. **Attributes**: they need an owner, an authoritative source and upkeep (an old job title in the directory or a missing sensitivity label leaves the policy right and the decision wrong). **Auditing**: “who can do what?” becomes a simulation. **Performance**: the PDP fetches attributes on every decision; use short-lived caches and timeouts, denying by default on failure. **Testing**: treat the policy as code, with permit and deny cases, versioned and simulated before publishing.",
      },
    ],
    armadilhas: [
      "Attributes with no owner or out of date (an old job title in the directory, a missing sensitivity label): the policy is right and the decision wrong. Define the authoritative source and lifecycle of every attribute.",
      "Using something the user controls as an attribute (a header, an unsigned claim): whoever can change the attribute picks their own decision. Use trusted sources.",
      "Piling up dozens of rules with exceptions and overlaps, without tests: “who can read this?” becomes guesswork. Test the policy as code, with permit and deny cases.",
      "Forgetting deny-by-default, or leaving the PDP synchronous with no timeout or cache: a service failure takes access down, or access opens for lack of an answer.",
    ],
    autoteste: [
      {
        pergunta: "Why does ABAC fit the rule “only whoever is on call and on the hospital network” better?",
        resposta:
          "Because on-call status and network are not stable roles: they change by the hour. With RBAC you would need a role per combination or a check scattered through the code; with ABAC, a rule reads the attributes of the moment (on-call status, network, department) and decides.",
      },
      {
        pergunta: "Why is it harder to audit “who can access what” in ABAC than in RBAC?",
        resposta:
          "In RBAC, the answer is a list of roles and members. In ABAC, it depends on the attribute values at the time of the query, so you have to evaluate or simulate the policy against the real subjects and resources, with analysis tools and tests.",
      },
    ],
  },
};
