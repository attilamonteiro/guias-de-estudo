import type { Pergunta } from "../../tipos";

// Q113 · Avaliação de políticas de acesso
export const q113: Pergunta = {
  numero: 113,
  modulo: "autorizacao",
  metodo: "trace",
  pt: {
    titulo: "Avaliação de políticas de acesso",
    pergunta:
      "Como uma plataforma avalia políticas de acesso quando há várias regras (allow, deny explícito, deny implícito, limites de permissão)? Siga uma requisição até a decisão.",
    porqueEsteMetodo:
      "Regras de allow, deny e limites só fazem sentido quando você segue uma requisição até a decisão, na ordem em que a plataforma avalia. O rastreio mostra por que um deny explícito vence, de onde vem o deny implícito e como depurar quando o resultado surpreende.",
    resposta30s:
      "A plataforma reúne todas as políticas **aplicáveis** à requisição (identidade, recurso, limites de permissão, organização, sessão) e decide assim: **nega por padrão (deny implícito)**; qualquer **deny explícito vence** tudo; sem deny, é preciso haver ao menos um **allow explícito**; e os **limites** só **restringem** (interseção), nunca concedem. Para depurar, use o simulador de políticas do provedor e os registros de auditoria.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma requisição até a decisão",
        etapas: [
          "A requisição chega ao ponto de aplicação com o contexto: **quem** (o principal autenticado, com grupos e papéis), **o quê** (a ação), **onde** (o recurso) e as **condições** (IP, hora, MFA, etiquetas)",
          "A plataforma coleta as políticas aplicáveis: as anexadas à identidade, a política do próprio recurso, os limites de permissão, as regras da organização e as da sessão",
          "Procura um **deny explícito** em qualquer uma delas, com as condições satisfeitas; se achar, **nega e para**, e nenhum allow o revoga",
          "Confere os **tetos**: a ação precisa estar dentro de cada limite aplicável (limite de permissão, regra da organização, política de sessão); fora de qualquer um deles, é negada (deny implícito)",
          "Procura um **allow explícito** que cubra ação, recurso e condições, vindo da identidade ou, conforme o caso, do recurso",
          "Achou: **permite**. Não achou: vale o padrão, o **deny implícito**",
          "Registra a decisão na trilha de auditoria (quem, ação, recurso, resultado), o que permite explicá-la depois",
        ],
        nota: "A ordem exata e os detalhes (por exemplo, quando uma política de recurso concede sozinha, ou o acesso entre contas) variam por provedor; o princípio é o mesmo. Confira a documentação de avaliação de políticas do seu.",
      },
      {
        tipo: "tabela",
        titulo: "Allow, deny implícito, deny explícito e limites",
        colunas: ["Resultado", "Quando acontece", "O que o supera", "Como corrigir"],
        linhas: [
          [
            "Allow explícito",
            "Uma política aplicável concede a ação no recurso, e nada nega nem fica fora do teto",
            "Um deny explícito ou a falta de cobertura em algum limite",
            "Nada a corrigir; revise se a permissão não está larga demais",
          ],
          [
            "Deny implícito",
            "Nenhuma política concede a ação; é o padrão",
            "Um allow explícito (dentro dos tetos)",
            "Acrescentar a permissão mínima, na política certa",
          ],
          [
            "Deny explícito",
            "Uma política nega a ação de propósito, e as condições batem",
            "Nada: nenhum allow o supera",
            "Entender por que a regra existe e ajustá-la ou a sua condição, com aprovação",
          ],
          [
            "Limite (permission boundary, regra da organização, política de sessão)",
            "Define o teto do que a identidade pode receber; não concede nada",
            "Só a alteração do próprio limite",
            "Ampliar o limite com aprovação, ou usar uma ação que ele já cubra",
          ],
        ],
        nota: "Uso típico do limite de permissão: delegar. Uma equipe cria e atribui os próprios papéis sozinha, mas nunca além do teto definido pela plataforma, e o administrador central deixa de ser um gargalo.",
      },
      {
        tipo: "codigo",
        titulo: "Um documento de política: allow estreito e deny explícito",
        legenda: "JSON",
        codigo: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "LerEGravarRelatorios",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::relatorios-prod/exportacoes/*"
    },
    {
      "Sid": "NuncaApagarRelatorios",
      "Effect": "Deny",
      "Action": "s3:DeleteObject",
      "Resource": "arn:aws:s3:::relatorios-prod/*"
    }
  ]
}`,
        nota: "O `Deny` vence qualquer `Allow` de outra política da mesma identidade. O formato é o da AWS; Azure e Google Cloud têm formatos e regras próprios (no Azure RBAC, por exemplo, as atribuições de papel somam permissões), então confira a documentação do seu provedor.",
      },
      {
        tipo: "passos",
        titulo: "Acesso negado: como depurar",
        passos: [
          {
            titulo: "1. Leia a mensagem e o registro",
            texto:
              "Muitos provedores dizem qual tipo de negação ocorreu (explícita ou implícita, e em que tipo de política). Isso já separa “falta um allow” de “existe um deny”.",
          },
          {
            titulo: "2. Reproduza no simulador",
            texto:
              "Use o simulador do provedor (por exemplo, o IAM Policy Simulator da AWS, o “Check access” do Azure ou o Policy Troubleshooter do Google Cloud) com a mesma identidade, a mesma ação, o mesmo recurso e as condições reais.",
          },
          {
            titulo: "3. Procure o deny e o teto",
            texto:
              "Havendo deny, ache a política e a condição que o dispara. Não havendo, veja os limites de permissão, as regras da organização e as políticas de sessão: um allow na identidade não vale fora do teto.",
          },
          {
            titulo: "4. Corrija o mínimo e valide",
            texto:
              "Acrescente a permissão estreita (ação e recurso exatos) na política certa, revalide no simulador e com um teste real, e rode o validador de políticas do provedor. Evite resolver com `*` em `Action` e `Resource`.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Se perguntarem “você já escreveu uma política de IAM?”",
        texto:
          "Responda só com o que você fez de verdade. Uma boa resposta tem quatro partes: o **contexto** (qual recurso, quem precisava de acesso), a **política** (ações e recursos exatos, condições, se havia deny), a **validação** (simulador, validadores, revisão por outra pessoa, teste com a identidade real) e o **ciclo de vida** (versionamento como código, revisão periódica, redução pelo uso real). Se ainda não escreveu, descreva como faria e mostre que entende a estrutura (`Effect`, `Action`, `Resource`, `Condition`) e a regra de avaliação.",
      },
    ],
    armadilhas: [
      "Achar que um `Allow` mais específico “ganha” de um `Deny` genérico: o deny explícito vence sempre, e a ordem das políticas não importa.",
      "Esperar que um limite de permissão ou uma regra de organização conceda acesso: eles só definem o teto, e sem um allow continua negado.",
      "Confundir deny implícito (faltou conceder) com deny explícito (alguém negou de propósito): a correção é diferente, e achar o motivo certo evita abrir demais.",
      "Corrigir um acesso negado com `*` em ação e recurso: abre muito mais que o necessário e esconde o problema original.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre deny implícito e deny explícito?",
        resposta:
          "O implícito é o padrão quando nenhuma política concede a ação, e um allow explícito o supera. O explícito é uma regra que nega de propósito, e nenhum allow o supera. Na depuração, o primeiro pede uma permissão; o segundo pede rever a regra de deny.",
      },
      {
        pergunta:
          "Uma identidade tem um allow para `s3:PutObject`, mas o limite de permissão dela não lista essa ação. O que acontece?",
        resposta:
          "É negado (deny implícito): o limite é um teto, e o acesso efetivo é a interseção entre a política da identidade e o limite. Para liberar, é preciso ampliar o limite, não só a política.",
      },
    ],
  },
  en: {
    titulo: "Access policy evaluation",
    pergunta:
      "How does a platform evaluate access policies when there are several rules (allow, explicit deny, implicit deny, permission boundaries)? Follow a request to the decision.",
    porqueEsteMetodo:
      "Allow, deny and boundary rules only make sense once you follow a request to the decision, in the order the platform evaluates. The trace shows why an explicit deny wins, where the implicit deny comes from and how to debug when the result is a surprise.",
    resposta30s:
      "The platform gathers every **applicable** policy for the request (identity, resource, permission boundaries, organization, session) and decides like this: **deny by default (implicit deny)**; any **explicit deny wins** over everything; with no deny, there must be at least one **explicit allow**; and **boundaries** only **restrict** (intersection), they never grant. To debug, use the provider’s policy simulator and the audit logs.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One request to the decision",
        etapas: [
          "The request reaches the enforcement point with its context: **who** (the authenticated principal, with groups and roles), **what** (the action), **where** (the resource) and the **conditions** (IP, time, MFA, tags)",
          "The platform collects the applicable policies: the ones attached to the identity, the resource’s own policy, the permission boundaries, the organization’s rules and the session’s",
          "It looks for an **explicit deny** in any of them, with its conditions met; if it finds one, it **denies and stops**, and no allow overrides it",
          "It checks the **ceilings**: the action must fall within every applicable boundary (permission boundary, organization rule, session policy); outside any of them, it is denied (implicit deny)",
          "It looks for an **explicit allow** that covers the action, resource and conditions, coming from the identity or, depending on the case, from the resource",
          "Found one: **allow**. Found none: the default applies, the **implicit deny**",
          "It records the decision in the audit trail (who, action, resource, result), which allows explaining it later",
        ],
        nota: "The exact order and the details (for example, when a resource policy grants on its own, or access across accounts) vary by provider; the principle is the same. Check the policy evaluation documentation of yours.",
      },
      {
        tipo: "tabela",
        titulo: "Allow, implicit deny, explicit deny and boundaries",
        colunas: ["Outcome", "When it happens", "What overrides it", "How to fix it"],
        linhas: [
          [
            "Explicit allow",
            "An applicable policy grants the action on the resource, and nothing denies it or leaves it outside the ceiling",
            "An explicit deny, or missing coverage in some boundary",
            "Nothing to fix; check whether the permission is too broad",
          ],
          [
            "Implicit deny",
            "No policy grants the action; it is the default",
            "An explicit allow (within the ceilings)",
            "Add the minimal permission, in the right policy",
          ],
          [
            "Explicit deny",
            "A policy denies the action on purpose, and its conditions match",
            "Nothing: no allow overrides it",
            "Understand why the rule exists and adjust it or its condition, with approval",
          ],
          [
            "Boundary (permission boundary, organization rule, session policy)",
            "Sets the ceiling of what the identity can receive; it grants nothing",
            "Only a change to the boundary itself",
            "Widen the boundary with approval, or use an action it already covers",
          ],
        ],
        nota: "The typical use of a permission boundary is delegation. A team creates and assigns its own roles, but never beyond the ceiling the platform defines, and the central administrator stops being a bottleneck.",
      },
      {
        tipo: "codigo",
        titulo: "A policy document: a narrow allow and an explicit deny",
        legenda: "JSON",
        codigo: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadAndWriteReports",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::reports-prod/exports/*"
    },
    {
      "Sid": "NeverDeleteReports",
      "Effect": "Deny",
      "Action": "s3:DeleteObject",
      "Resource": "arn:aws:s3:::reports-prod/*"
    }
  ]
}`,
        nota: "The `Deny` beats any `Allow` from another policy of the same identity. The format is AWS’s; Azure and Google Cloud have their own formats and rules (in Azure RBAC, for example, role assignments add up permissions), so check your provider’s documentation.",
      },
      {
        tipo: "passos",
        titulo: "Access denied: how to debug",
        passos: [
          {
            titulo: "1. Read the message and the log",
            texto:
              "Many providers say which kind of denial happened (explicit or implicit, and in what kind of policy). That already separates “an allow is missing” from “a deny exists”.",
          },
          {
            titulo: "2. Reproduce it in the simulator",
            texto:
              "Use the provider’s simulator (for example, AWS’s IAM Policy Simulator, Azure’s “Check access” or Google Cloud’s Policy Troubleshooter) with the same identity, action and resource, and the real conditions.",
          },
          {
            titulo: "3. Look for the deny and the ceiling",
            texto:
              "If there is a deny, find the policy and the condition that triggers it. If there is none, look at permission boundaries, organization rules and session policies: an allow on the identity does not count outside the ceiling.",
          },
          {
            titulo: "4. Fix the minimum and validate",
            texto:
              "Add the narrow permission (exact action and resource) to the right policy, revalidate in the simulator and with a real test, and run the provider’s policy validator. Avoid fixing it with `*` in `Action` and `Resource`.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "If they ask “have you ever written an IAM policy?”",
        texto:
          "Answer only with what you actually did. A good answer has four parts: the **context** (which resource, who needed access), the **policy** (exact actions and resources, conditions, whether there was a deny), the **validation** (simulator, validators, review by another person, a test with the real identity) and the **lifecycle** (versioned as code, periodic review, trimming by real usage). If you have not written one yet, describe how you would and show that you understand the structure (`Effect`, `Action`, `Resource`, `Condition`) and the evaluation rule.",
      },
    ],
    armadilhas: [
      "Thinking a more specific `Allow` “beats” a generic `Deny`: an explicit deny always wins, and the order of the policies does not matter.",
      "Expecting a permission boundary or an organization rule to grant access: they only set the ceiling, and without an allow it stays denied.",
      "Confusing implicit deny (nothing granted it) with explicit deny (someone denied it on purpose): the fix differs, and finding the right reason avoids opening too much.",
      "Fixing a denied access with `*` in action and resource: it opens far more than needed and hides the original problem.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between an implicit deny and an explicit deny?",
        resposta:
          "Implicit is the default when no policy grants the action, and an explicit allow overrides it. Explicit is a rule that denies on purpose, and no allow overrides it. When debugging, the first calls for a permission; the second calls for reviewing the deny rule.",
      },
      {
        pergunta:
          "An identity has an allow for `s3:PutObject`, but its permission boundary does not list that action. What happens?",
        resposta:
          "It is denied (implicit deny): the boundary is a ceiling, and effective access is the intersection of the identity’s policy and the boundary. To allow it, you have to widen the boundary, not just the policy.",
      },
    ],
  },
};
