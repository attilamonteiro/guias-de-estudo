import type { Pergunta } from "../../tipos";

// Q114 · Motores de política: PDP e PEP
export const q114: Pergunta = {
  numero: 114,
  modulo: "autorizacao",
  metodo: "feynman",
  pt: {
    titulo: "Motores de política: PDP e PEP",
    pergunta:
      "O que são PDP, PEP, PAP e PIP, e como um motor de políticas (OPA/Rego, Cedar, XACML) separa a decisão de autorização do código da aplicação?",
    porqueEsteMetodo:
      "As quatro siglas se embaralham até você ter uma imagem para cada uma. A do juiz e do porteiro mostra quem decide e quem obedece, e depois vêm o mecanismo real, o custo dessa separação e o ponto em que a imagem para de valer.",
    resposta30s:
      "O **PEP** (ponto de aplicação) intercepta a requisição e **aplica** a resposta; o **PDP** (ponto de decisão) **avalia as políticas** e responde permitir ou negar; o **PAP** (administração) é onde as políticas são **escritas e publicadas**; o **PIP** (informação) **fornece os dados** de que o PDP precisa. Um motor de políticas (**OPA/Rego, Cedar, XACML**) tira a decisão do código: a aplicação só **pergunta e obedece**, e a regra vira **política como código**, testável e versionada.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense numa casa de espetáculos. O porteiro (PEP) fica na porta e deixa entrar ou barra, mas não decide por conta própria: ele consulta o juiz (PDP), que tem o regulamento e dá o veredito de cada caso. O regulamento é redigido e atualizado por outra equipe (PAP) e, para julgar, o juiz às vezes pede informações a um cartório (PIP), como confirmar se aquele ingresso foi emitido para aquela pessoa.",
        tecnico:
          "Esse é o modelo da arquitetura de referência do XACML, também adotado em zero trust (como no NIST SP 800-207). As **políticas** são as regras de acesso escritas de forma explícita, auditável e separada do código. O **PEP** fica no ponto de acesso (middleware da API, gateway, sidecar, controlador de admissão), monta a consulta (sujeito, ação, recurso, contexto) e aplica a resposta. O **PDP** avalia as políticas e devolve permitir ou negar, às vezes com obrigações (registrar, mascarar um campo). **OPA (linguagem Rego)**, **Cedar** e **XACML** são motores e linguagens de política que cumprem o papel de PDP. Numa organização, o IAM abastece o PIP (identidades, grupos, atributos) e o ciclo de vida do acesso, e os PEPs espalhados aplicam a mesma política.",
        limite:
          "A imagem esconde o preço: o porteiro depende do juiz a cada entrada, então latência, disponibilidade e consistência passam a importar. Se o PEP esquecer de perguntar, ou deixar passar quando o juiz não responde, o regulamento não vale nada. E separar a decisão do código não elimina a necessidade de o código mandar os dados certos ao PDP.",
      },
      {
        tipo: "tabela",
        titulo: "As quatro peças",
        colunas: ["Peça", "Papel", "Exemplos de implementação", "O que faz na prática"],
        linhas: [
          [
            "PEP (Policy Enforcement Point)",
            "Intercepta e aplica a decisão: permite, nega, filtra ou registra",
            "Middleware da API, API gateway, sidecar ou proxy (como o filtro de autorização externa do Envoy), controlador de admissão do Kubernetes",
            "Pergunta ao PDP e cumpre a resposta; por padrão, nega se não houver resposta",
          ],
          [
            "PDP (Policy Decision Point)",
            "Avalia as políticas contra a consulta e decide",
            "OPA (Rego), Cedar (por exemplo, no Amazon Verified Permissions), servidor XACML, serviço de relações como o OpenFGA",
            "Recebe sujeito, ação, recurso e contexto; devolve permitir ou negar, com o motivo",
          ],
          [
            "PAP (Policy Administration Point)",
            "Cria, versiona, testa e publica as políticas",
            "Repositório Git de políticas com revisão e pipeline de publicação, ou console administrativo do motor",
            "Controla quem pode mudar as regras e deixa histórico do que mudou",
          ],
          [
            "PIP (Policy Information Point)",
            "Fornece os atributos que a requisição não traz",
            "Diretório ou sistema de RH, banco do recurso, serviço de risco do dispositivo, o IdP (grupos e atributos), dados carregados no próprio PDP",
            "Responde “qual é o valor deste atributo agora?”",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Uma decisão, de ponta a ponta",
        etapas: [
          "O cliente chama `POST /pedidos/42/aprovar` com o token; o **PEP** (gateway ou middleware) valida o token e extrai o sujeito",
          "O PEP monta a consulta ao PDP: sujeito, ação (`aprovar`), recurso (`pedido 42`) e contexto (IP, hora)",
          "O **PDP** avalia as políticas carregadas; se faltarem dados, pede ao **PIP** (o valor e o tenant do pedido, o nível do aprovador) ou usa os dados já carregados localmente",
          "O PDP devolve a decisão com o motivo (e obrigações, se houver) e a registra com a versão da política",
          "O PEP **aplica**: deixa a chamada passar, nega com `403` ou filtra a resposta; **se o PDP não responder, o padrão seguro é negar**",
          "Em paralelo, o **PAP** publica novas versões das políticas, que chegam ao PDP (por exemplo, como pacote versionado) sem mudar o código da aplicação",
        ],
      },
      {
        tipo: "codigo",
        titulo: "Uma política em Rego (OPA)",
        legenda: "Rego",
        codigo: `package pedidos.authz
import rego.v1

default allow := false   # nega por padrão

allow if {
    input.acao == "aprovar"
    "gerente" in input.usuario.papeis
    input.recurso.tenant == input.usuario.tenant
    input.recurso.valor <= data.limites[input.usuario.nivel]   # data vem de dados carregados (PIP)
}`,
        nota: "O PEP envia ao OPA um documento `input` com usuário, ação e recurso; os limites (`data.limites`) vêm de dados carregados no OPA, que fazem o papel de PIP. A política fica em Git, com testes de casos que devem ser permitidos e de casos que devem ser negados.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O preço de separar a decisão",
        texto:
          "**Latência**: uma chamada remota por requisição soma tempo e vira ponto de falha; reduza com PDP local (sidecar ou biblioteca embutida), políticas e dados empurrados ao PDP e **cache de decisões** com validade curta, em chave que inclua sujeito, ação, recurso e versão da política. **Inconsistência**: PEPs com versões diferentes da política decidem diferente, então versione, publique de forma controlada e registre a versão em cada decisão. **Falha segura**: se o PDP está fora, negue (fail-closed) ou use um fallback conservador e explícito. **Política como código**: Git, revisão, testes (permitir, negar e os casos de borda) e publicação por pipeline. **Cobertura**: todo caminho que acessa o recurso precisa de um PEP (veja Q115). Em ambientes de alto volume, como o zero trust com decisão por requisição (veja Q120 e Q123), combine PDP local, atributos pré-carregados e revalidação periódica em vez de consultar fontes lentas a cada chamada.",
      },
    ],
    armadilhas: [
      "Achar que PEP e PDP precisam ser serviços separados: podem ser módulos do mesmo processo. O que importa é a separação de responsabilidades.",
      "Deixar caminhos sem PEP (jobs, filas, chamadas internas, acesso direto ao banco): a política não vale onde ninguém pergunta.",
      "Usar um PEP que libera quando o PDP não responde (fail-open), ou um cache sem validade: a revogação não chega.",
      "Tratar a política como configuração, sem teste nem versão: uma edição errada vale para toda a frota de uma vez.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre PDP e PEP?",
        resposta:
          "O PDP decide: avalia as políticas e responde permitir ou negar. O PEP aplica: intercepta a requisição, consulta o PDP e cumpre a resposta. O PEP é o ponto de aplicação; o PDP, o ponto de decisão.",
      },
      {
        pergunta: "Quais são os riscos de uma política inconsistente entre vários PEPs?",
        resposta:
          "O mesmo pedido é permitido num serviço e negado em outro quando as versões da política divergem, e uma revogação pode demorar a valer em alguns deles. Mitiga-se com versionamento, publicação controlada, a versão da política registrada em cada decisão e testes.",
      },
    ],
  },
  en: {
    titulo: "Policy engines: PDP and PEP",
    pergunta:
      "What are PDP, PEP, PAP and PIP, and how does a policy engine (OPA/Rego, Cedar, XACML) separate the authorization decision from application code?",
    porqueEsteMetodo:
      "The four acronyms blur together until each has a picture. The judge and the doorman show who decides and who obeys; then come the real mechanism, the cost of this separation and the point where the picture stops holding.",
    resposta30s:
      "The **PEP** (enforcement point) intercepts the request and **enforces** the answer; the **PDP** (decision point) **evaluates the policies** and answers allow or deny; the **PAP** (administration) is where policies are **written and published**; the **PIP** (information) **supplies the data** the PDP needs. A policy engine (**OPA/Rego, Cedar, XACML**) takes the decision out of the code: the application only **asks and obeys**, and the rule becomes **policy as code**, testable and versioned.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a theater. The doorman (PEP) stands at the entrance and lets people in or turns them away, but does not decide alone: he consults the judge (PDP), who has the rulebook and gives a verdict for each case. The rulebook is written and updated by another team (PAP) and, to judge, the judge sometimes asks a registry office for information (PIP), such as confirming that the ticket was issued to that person.",
        tecnico:
          "This is the model of the XACML reference architecture, also adopted in zero trust (as in NIST SP 800-207). **Policies** are the access rules, written explicitly, auditable and separate from the code. The **PEP** sits at the access point (API middleware, gateway, sidecar, admission controller), builds the query (subject, action, resource, context) and enforces the answer. The **PDP** evaluates the policies and returns allow or deny, sometimes with obligations (log it, mask a field). **OPA (the Rego language)**, **Cedar** and **XACML** are policy engines and languages that play the PDP role. In an organization, IAM feeds the PIP (identities, groups, attributes) and the access lifecycle, and the PEPs spread around enforce the same policy.",
        limite:
          "The picture hides the price: the doorman depends on the judge for every entry, so latency, availability and consistency start to matter. If the PEP forgets to ask, or lets people through when the judge does not answer, the rulebook is worthless. And separating the decision from the code does not remove the need for the code to send the right data to the PDP.",
      },
      {
        tipo: "tabela",
        titulo: "The four pieces",
        colunas: ["Piece", "Role", "Example implementations", "What it does in practice"],
        linhas: [
          [
            "PEP (Policy Enforcement Point)",
            "Intercepts and enforces the decision: allow, deny, filter or log",
            "API middleware, API gateway, sidecar or proxy (such as Envoy’s external authorization filter), Kubernetes admission controller",
            "Asks the PDP and carries out the answer; by default, denies if there is no answer",
          ],
          [
            "PDP (Policy Decision Point)",
            "Evaluates the policies against the query and decides",
            "OPA (Rego), Cedar (for example, in Amazon Verified Permissions), an XACML server, a relationship service such as OpenFGA",
            "Receives subject, action, resource and context; returns allow or deny, with the reason",
          ],
          [
            "PAP (Policy Administration Point)",
            "Creates, versions, tests and publishes the policies",
            "A Git repository of policies with review and a publishing pipeline, or the engine’s administrative console",
            "Controls who can change the rules and keeps a history of what changed",
          ],
          [
            "PIP (Policy Information Point)",
            "Supplies the attributes the request does not carry",
            "A directory or HR system, the resource’s database, a device risk service, the IdP (groups and attributes), data loaded into the PDP itself",
            "Answers “what is the value of this attribute right now?”",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "One decision, end to end",
        etapas: [
          "The client calls `POST /orders/42/approve` with the token; the **PEP** (gateway or middleware) validates the token and extracts the subject",
          "The PEP builds the query to the PDP: subject, action (`approve`), resource (`order 42`) and context (IP, time)",
          "The **PDP** evaluates the loaded policies; if data is missing, it asks the **PIP** (the order’s amount and tenant, the approver’s level) or uses data already loaded locally",
          "The PDP returns the decision with the reason (and obligations, if any) and logs it with the policy version",
          "The PEP **enforces**: lets the call through, denies with `403` or filters the response; **if the PDP does not answer, the safe default is to deny**",
          "In parallel, the **PAP** publishes new policy versions, which reach the PDP (for example, as a versioned bundle) without changing the application code",
        ],
      },
      {
        tipo: "codigo",
        titulo: "A policy in Rego (OPA)",
        legenda: "Rego",
        codigo: `package orders.authz
import rego.v1

default allow := false   # deny by default

allow if {
    input.action == "approve"
    "manager" in input.user.roles
    input.resource.tenant == input.user.tenant
    input.resource.amount <= data.limits[input.user.level]   # data comes from loaded data (PIP)
}`,
        nota: "The PEP sends OPA an `input` document with user, action and resource; the limits (`data.limits`) come from data loaded into OPA, which plays the PIP role. The policy lives in Git, with tests for cases that must be allowed and cases that must be denied.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The price of separating the decision",
        texto:
          "**Latency**: a remote call per request adds time and becomes a point of failure; reduce it with a local PDP (a sidecar or embedded library), policies and data pushed to the PDP and a **decision cache** with a short lifetime, keyed by subject, action, resource and policy version. **Inconsistency**: PEPs on different policy versions decide differently, so version, publish in a controlled way and record the version in every decision. **Safe failure**: if the PDP is down, deny (fail-closed) or use a conservative, explicit fallback. **Policy as code**: Git, review, tests (allow, deny and edge cases) and publishing through a pipeline. **Coverage**: every path that reaches the resource needs a PEP (see Q115). In high-volume environments, such as zero trust with a decision per request (see Q120 and Q123), combine a local PDP, preloaded attributes and periodic revalidation instead of querying slow sources on every call.",
      },
    ],
    armadilhas: [
      "Thinking the PEP and the PDP must be separate services: they can be modules of the same process. What matters is the separation of responsibilities.",
      "Leaving paths without a PEP (jobs, queues, internal calls, direct database access): the policy does not apply where nobody asks.",
      "Using a PEP that lets requests through when the PDP does not answer (fail-open), or a cache with no lifetime: revocation never arrives.",
      "Treating policy as configuration, with no tests or versions: one wrong edit takes effect across the whole fleet at once.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between a PDP and a PEP?",
        resposta:
          "The PDP decides: it evaluates the policies and answers allow or deny. The PEP enforces: it intercepts the request, queries the PDP and carries out the answer. The PEP is the enforcement point; the PDP is the decision point.",
      },
      {
        pergunta: "What are the risks of an inconsistent policy across several PEPs?",
        resposta:
          "The same request is allowed in one service and denied in another when policy versions diverge, and a revocation may take longer to apply in some of them. You mitigate it with versioning, controlled publishing, the policy version recorded in every decision and tests.",
      },
    ],
  },
};
