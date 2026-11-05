import type { Pergunta } from "../../tipos";

// Q104 · RBAC
export const q104: Pergunta = {
  numero: 104,
  modulo: "autorizacao",
  metodo: "feynman",
  pt: {
    titulo: "RBAC",
    pergunta:
      "O que é RBAC e como ele funciona (usuários, papéis, permissões, hierarquias, sessões)? Quais são os problemas típicos, como a explosão de papéis?",
    porqueEsteMetodo:
      "O RBAC é um conceito de gestão antes de ser de código, e a analogia dos cargos de uma empresa o torna intuitivo. Depois vêm o mecanismo e o ponto em que a imagem para de valer: o cargo não diz nada sobre contexto.",
    resposta30s:
      "O **RBAC** concede permissões a **papéis** e papéis a **usuários**: em vez de dar acesso pessoa a pessoa, você diz “gerente de vendas pode aprovar pedidos” e atribui o papel. Ele facilita **menor privilégio, auditoria, admissão e desligamento**, e aceita hierarquias de papéis e restrições de separação de funções. Seus problemas típicos são a **explosão de papéis**, papéis amplos demais e a falta de revisão, e ele não expressa contexto (de quem é o pedido, até qual valor, de onde).",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense nos cargos de uma empresa. Ninguém decide, pessoa a pessoa, quem pode assinar contratos: o cargo de diretor pode, o de estagiário não. Quem é contratado recebe um cargo e, com ele, tudo o que o cargo pode. Ao mudar de área, troca de cargo; ao sair, perde todos. A empresa só precisa manter bem definidos os cargos e quem ocupa cada um.",
        tecnico:
          "No **RBAC**, o desenho é usuários → papéis → permissões. Uma **permissão** é uma ação sobre um tipo de recurso (`pedido:aprovar`); um **papel** agrupa permissões em torno de uma função de negócio; o **usuário** recebe papéis, não permissões. Há extensões: **hierarquias** (o gerente herda o que o analista pode), **sessões** (o usuário ativa só os papéis de que precisa naquele momento) e **restrições de separação de funções** (quem solicita não aprova). Em aplicações modernas, os papéis chegam como `roles` ou `groups` no token, ou vêm de grupos do IdP, e o servidor traduz papel em permissão. No Kubernetes, o mesmo desenho aparece como `Role` e `RoleBinding`: quem pode fazer o quê no cluster, com contas de serviço de menor privilégio.",
        limite:
          "O cargo não sabe de contexto. “Gerente” não diz de qual região, até qual valor, nem se o pedido é dele: para isso a empresa cria cargos cada vez mais específicos (a **explosão de papéis**) ou passa a olhar atributos e relações (veja Q105 e Q106). E o papel prova a atribuição, não a necessidade: quem muda de área sem perder o papel antigo acumula poder.",
      },
      {
        tipo: "tabela",
        titulo: "As peças do RBAC",
        colunas: ["Peça", "O que é", "Exemplo"],
        linhas: [
          ["Usuário", "Quem (pessoa ou serviço) pede acesso", "Ana, do financeiro"],
          ["Papel", "Conjunto de permissões ligado a uma função de negócio", "`analista`, `gerente`"],
          ["Permissão", "Ação permitida sobre um tipo de recurso", "`pedido:ler`, `pedido:aprovar`"],
          ["Hierarquia", "Um papel herda as permissões de outro", "O gerente herda o analista"],
          [
            "Sessão",
            "Os papéis que o usuário ativou naquele momento (menor privilégio)",
            "Ana ativa `gerente` só para aprovar",
          ],
          [
            "Separação de funções",
            "Restrição para que papéis conflitantes não se acumulem",
            "Quem cria o pagamento não o aprova",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Papéis, hierarquia e checagem por permissão",
        legenda: "TypeScript",
        codigo: `type Permissao = "pedido:ler" | "pedido:aprovar" | "usuario:gerenciar";

const permissoesDoPapel: Record<string, Permissao[]> = {
  analista: ["pedido:ler"],
  gerente: ["pedido:aprovar"],
  admin: ["usuario:gerenciar"],
};
const herda: Record<string, string[]> = { gerente: ["analista"] }; // hierarquia

function permissoesDe(papel: string, vistos = new Set<string>()): Set<Permissao> {
  if (vistos.has(papel)) return new Set(); // evita ciclo
  vistos.add(papel);
  const todas = new Set(permissoesDoPapel[papel] ?? []);
  for (const pai of herda[papel] ?? []) permissoesDe(pai, vistos).forEach((p) => todas.add(p));
  return todas;
}

// O código checa a PERMISSÃO, nunca o nome do papel
export const pode = (papeis: string[], permissao: Permissao) =>
  papeis.some((papel) => permissoesDe(papel).has(permissao));`,
        nota: "O mapeamento papel → permissão fica em dados e pode mudar sem alterar a lógica da aplicação. Os papéis do usuário vêm de uma fonte confiável (token assinado ou diretório), e a hierarquia tem proteção contra ciclos.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que o RBAC prova, e o que não prova",
        texto:
          "O RBAC prova que **uma pessoa tem um papel atribuído por um processo** e que o **papel dá certas permissões**. Isso responde “quem tem o papel X?” e “o que o papel Y pode?”, base das revisões de acesso e da auditoria, e dá à organização controle central: admitir, mudar de área e desligar viram troca de papel, o que o DAC deixa nas mãos de cada dono. Ele **não prova** que a pessoa deveria acessar **este** recurso **agora**: papel não é contexto. No Zero Trust, o RBAC entra como parte da resposta (menor privilégio, verificado a cada requisição), mas precisa de sinais de dispositivo e de risco, e de atributos ou relações para o resto (veja Q99, Q105 e Q106).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Problemas típicos e como contê-los",
        texto:
          "**Explosão de papéis**: um papel para cada exceção (“gerente-sul-até-10-mil”); contenha com papéis de negócio estáveis e leve o contexto para atributos ou relações. **Papéis amplos demais** (`admin` para tudo) viram privilégio permanente; prefira papéis estreitos e acesso temporário. **Acúmulo de privilégios** quando a pessoa muda de função; faça **revisão periódica** (recertificação) e remoção automática no desligamento. Para implementar com o IdP, mapeie grupos do diretório para papéis da aplicação, dê um dono a cada grupo e cuide dos tokens que carregam muitos grupos (alguns provedores trocam a lista por uma referência; confira a documentação). Na **delegação**, deixe os gerentes atribuírem papéis só dentro do seu escopo e nunca mais do que eles mesmos têm.",
      },
    ],
    armadilhas: [
      'Checar o nome do papel no código (`if (usuario.papel === "gerente")`): cada papel novo exige mudar o código. Verifique a permissão e deixe o mapeamento papel → permissão em dados.',
      "Dar papéis amplos demais (“admin”, “superusuário”) por conveniência: viram privilégio permanente. Combine papéis estreitos com acesso temporário e revisão.",
      "Criar um papel por exceção: a explosão de papéis torna o modelo inauditável. Quando a variação depende de contexto (região, valor, propriedade), use atributos ou relações.",
      "Nunca revisar: o RBAC prova a atribuição, mas as pessoas mudam de função e acumulam papéis. Sem revisão periódica e remoção ao sair, o modelo apodrece.",
    ],
    autoteste: [
      {
        pergunta: "O que o RBAC prova, e o que ele não prova?",
        resposta:
          "Prova que a pessoa tem um papel atribuído por um processo e quais permissões o papel concede, o que sustenta auditoria e revisão de acessos. Não prova que ela deveria acessar um recurso específico agora: papel não carrega contexto, como propriedade do recurso, valor ou localização.",
      },
      {
        pergunta: "Numa entrevista, perguntam “você já implementou RBAC?”. Como responder bem?",
        resposta:
          "Responda só com o que você viveu, nunca invente. Estruture: o contexto, o modelo de papéis e permissões, onde a checagem roda (servidor, por permissão), como lidou com a explosão de papéis e as revisões, o que mediu e o que mudaria. Se não implementou, diga e explique como faria.",
      },
    ],
  },
  en: {
    titulo: "RBAC",
    pergunta:
      "What is RBAC and how does it work (users, roles, permissions, hierarchies, sessions)? What are its typical problems, such as role explosion?",
    porqueEsteMetodo:
      "RBAC is a management concept before it is a code concept, and the analogy of a company’s job titles makes it intuitive. Then come the mechanism and the point where the picture stops holding: a job title says nothing about context.",
    resposta30s:
      "**RBAC** grants permissions to **roles** and roles to **users**: instead of giving access person by person, you say “sales manager can approve orders” and assign the role. It makes **least privilege, auditing, onboarding and offboarding** easier, and supports role hierarchies and separation-of-duties constraints. Its typical problems are **role explosion**, overly broad roles and lack of review, and it cannot express context (whose order it is, up to what amount, from where).",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of the job titles in a company. Nobody decides, person by person, who can sign contracts: the director title can, the intern title cannot. Whoever is hired receives a title and, with it, everything the title may do. Changing departments means changing titles; leaving means losing them all. The company only has to keep the titles well defined, and who holds each one.",
        tecnico:
          "In **RBAC**, the design is users → roles → permissions. A **permission** is an action on a type of resource (`order:approve`); a **role** groups permissions around a business function; the **user** receives roles, not permissions. There are extensions: **hierarchies** (the manager inherits what the analyst can do), **sessions** (the user activates only the roles needed at that moment) and **separation-of-duties constraints** (whoever requests does not approve). In modern applications, roles arrive as `roles` or `groups` in the token, or come from IdP groups, and the server translates role into permission. In Kubernetes the same design appears as `Role` and `RoleBinding`: who can do what in the cluster, with least-privilege service accounts.",
        limite:
          "A job title does not know context. “Manager” does not say which region, up to what amount, or whether the order is theirs: for that the company creates ever more specific titles (**role explosion**) or starts looking at attributes and relationships (see Q105 and Q106). And a role proves the assignment, not the need: someone who changes departments without losing the old role accumulates power.",
      },
      {
        tipo: "tabela",
        titulo: "The pieces of RBAC",
        colunas: ["Piece", "What it is", "Example"],
        linhas: [
          ["User", "Who (a person or a service) asks for access", "Ana, from finance"],
          ["Role", "A set of permissions tied to a business function", "`analyst`, `manager`"],
          ["Permission", "An allowed action on a type of resource", "`order:read`, `order:approve`"],
          ["Hierarchy", "One role inherits the permissions of another", "The manager inherits the analyst"],
          [
            "Session",
            "The roles the user has activated at that moment (least privilege)",
            "Ana activates `manager` only to approve",
          ],
          [
            "Separation of duties",
            "A constraint so conflicting roles do not accumulate",
            "Whoever creates the payment does not approve it",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Roles, hierarchy and a permission check",
        legenda: "TypeScript",
        codigo: `type Permission = "order:read" | "order:approve" | "user:manage";

const permissionsOfRole: Record<string, Permission[]> = {
  analyst: ["order:read"],
  manager: ["order:approve"],
  admin: ["user:manage"],
};
const inherits: Record<string, string[]> = { manager: ["analyst"] }; // hierarchy

function permissionsOf(role: string, seen = new Set<string>()): Set<Permission> {
  if (seen.has(role)) return new Set(); // avoids cycles
  seen.add(role);
  const all = new Set(permissionsOfRole[role] ?? []);
  for (const parent of inherits[role] ?? []) permissionsOf(parent, seen).forEach((p) => all.add(p));
  return all;
}

// The code checks the PERMISSION, never the role name
export const can = (roles: string[], permission: Permission) =>
  roles.some((role) => permissionsOf(role).has(permission));`,
        nota: "The role → permission mapping lives in data and can change without altering the application logic. The user’s roles come from a trusted source (a signed token or the directory), and the hierarchy is protected against cycles.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What RBAC proves, and what it does not",
        texto:
          "RBAC proves that **a person holds a role assigned by a process** and that the **role grants certain permissions**. That answers “who has role X?” and “what can role Y do?”, the basis of access reviews and auditing, and gives the organization central control: onboarding, moving departments and offboarding become a role swap, which DAC leaves in each owner’s hands. It does **not prove** that the person should access **this** resource **right now**: a role is not context. In Zero Trust, RBAC is part of the answer (least privilege, verified on every request), but it needs device and risk signals, and attributes or relationships for the rest (see Q99, Q105 and Q106).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Typical problems and how to contain them",
        texto:
          "**Role explosion**: one role per exception (“manager-south-up-to-10k”); contain it with stable business roles and move context to attributes or relationships. **Overly broad roles** (`admin` for everything) become permanent privilege; prefer narrow roles and temporary access. **Privilege creep** when a person changes duties; run **periodic reviews** (recertification) and automatic removal at offboarding. To implement with the IdP, map directory groups to application roles, give every group an owner and watch for tokens that carry many groups (some providers swap the list for a reference; check the documentation). For **delegation**, let managers assign roles only within their own scope and never more than they hold themselves.",
      },
    ],
    armadilhas: [
      'Checking the role name in code (`if (user.role === "manager")`): every new role means changing the code. Check the permission and keep the role → permission mapping in data.',
      "Handing out overly broad roles (“admin”, “superuser”) for convenience: they become permanent privilege. Combine narrow roles with temporary access and review.",
      "Creating a role per exception: role explosion makes the model unauditable. When the variation depends on context (region, amount, ownership), use attributes or relationships.",
      "Never reviewing: RBAC proves the assignment, but people change duties and accumulate roles. Without periodic review and removal on exit, the model rots.",
    ],
    autoteste: [
      {
        pergunta: "What does RBAC prove, and what does it not prove?",
        resposta:
          "It proves that the person holds a role assigned by a process and which permissions the role grants, which supports auditing and access reviews. It does not prove that they should access a specific resource right now: a role carries no context, such as ownership of the resource, amount or location.",
      },
      {
        pergunta: "In an interview you are asked “have you implemented RBAC?”. How do you answer well?",
        resposta:
          "Answer only with what you have lived; never invent. Structure it: the context, the model of roles and permissions, where the check runs (server, by permission), how you handled role explosion and reviews, what you measured and what you would change. If you have not implemented it, say so and explain how you would.",
      },
    ],
  },
};
