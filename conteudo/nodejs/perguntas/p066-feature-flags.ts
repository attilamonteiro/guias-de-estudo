import type { Pergunta } from "../../tipos";

// P66 · Feature flags
export const p066: Pergunta = {
  numero: 766,
  modulo: "pawanmkr-distribuidos",
  metodo: "feynman",
  pt: {
    titulo: "Feature flags",
    pergunta: "O que são feature flags e como elas são usadas no desenvolvimento de backend?",
    porqueEsteMetodo:
      "A ideia é simples, mas costuma sair misturada com configuração e com controle de acesso. A analogia do disjuntor fixa a intuição, e depois vêm o mecanismo real e o ponto em que a imagem para de valer.",
    resposta30s:
      "**Feature flags** (ou toggles) são condições no código cujo valor vem de fora e muda **sem nova implantação**: separam **implantar** de **liberar**. No backend, servem para **rollout gradual** (por percentual, usuário ou tenant), **kill switch** operacional, experimentos e liberação por plano. Em troca, cada flag é dívida técnica: dê dono e data de remoção, tenha um **valor padrão** se o serviço de flags cair e, em microsserviços, **decida na borda e propague** o resultado.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense no quadro de disjuntores de uma casa, com um disjuntor para cada cômodo. A fiação já está instalada em todo lugar; para acender ou apagar a luz da cozinha, você mexe no disjuntor, sem abrir a parede nem chamar o eletricista. Se a cozinha dá problema, desliga só ela e o resto da casa segue funcionando.",
        tecnico:
          'Uma **feature flag** (ou feature toggle) é uma condição no código, como `if (ativa("nome", contexto))`, cujo valor vem de fora do código e pode mudar sem nova implantação. Ela separa **implantar** (o código está em produção) de **liberar** (as pessoas o veem). Isso permite rollout gradual, desligar rápido um problema (kill switch), testar por grupo e integrar cedo no tronco principal com o recurso inacabado escondido. A avaliação usa um **contexto** (usuário, tenant, ambiente) e **regras** (percentual, lista, atributo), que vêm de um SDK ligado a um serviço de flags, de um arquivo de configuração ou de uma variável de ambiente; o SDK guarda as regras em cache local e usa um **valor padrão** se o serviço cair. Entre as ferramentas conhecidas estão o OpenFeature (padrão aberto de SDK), o Unleash, o GrowthBook, o Flagsmith e o LaunchDarkly, sem ordem de preferência: confira a documentação e o modelo de cada uma.',
        limite:
          "O disjuntor só liga ou desliga; a flag também decide **para quem** e **quando**. E o quadro da casa não cria disjuntores novos sozinho: no software, cada flag esquecida é um `if` a mais, um caminho a testar e uma dívida técnica. A flag controla a **visibilidade**, não a **autorização**: esconder um botão não impede que alguém chame a rota.",
      },
      {
        tipo: "tabela",
        titulo: "Os quatro tipos de flag",
        colunas: ["Tipo", "Para que serve", "Quem decide", "Vida útil", "Exemplo"],
        linhas: [
          [
            "Release (liberação)",
            "Esconder um recurso em desenvolvimento e liberá-lo aos poucos",
            "Produto e engenharia",
            "Curta: remova quando chegar a 100% e estiver estável",
            "Novo fluxo de checkout",
          ],
          [
            "Experimento (teste A/B)",
            "Comparar variantes e medir o efeito",
            "Produto e dados",
            "Curta: até haver resultado",
            "Duas ordens de botões na tela de pagamento",
          ],
          [
            "Operacional (kill switch)",
            "Desligar rápido um caminho caro ou uma dependência sob carga ou incidente",
            "Operação e engenharia de plataforma",
            "Pode ser longa: é uma válvula de segurança",
            "Desligar as recomendações quando o serviço delas está lento",
          ],
          [
            "Permissão",
            "Liberar por plano, cliente ou tenant",
            "Produto e comercial",
            "Longa: vira parte do produto",
            "Relatórios avançados só para o plano premium",
          ],
        ],
        nota: "Permissão por plano é regra de negócio permanente: se ela cresce, modele como direitos do plano, e não como uma flag que alguém um dia remove por engano.",
      },
      {
        tipo: "codigo",
        titulo: "Avaliação com rollout estável, kill switch e padrão seguro",
        legenda: "JavaScript",
        codigo: [
          'import { createHash } from "node:crypto";',
          "",
          "// Rollout estável: o mesmo usuário cai sempre no mesmo balde (0 a 99)",
          "function balde(flag, usuarioId) {",
          '  const hash = createHash("sha256").update(`${flag}:${usuarioId}`).digest();',
          "  return hash.readUInt32BE(0) % 100;",
          "}",
          "",
          "function ativa(flag, ctx, config) {",
          "  const regra = config[flag];",
          "  if (!regra || regra.desligada) return false; // padrão seguro e kill switch",
          "  if (regra.tenants?.includes(ctx.tenantId)) return true;",
          "  return balde(flag, ctx.userId) < (regra.percentual ?? 0);",
          "}",
          "",
          "// `config` vem do serviço de flags, com cache local e o último valor bom se ele cair",
          'if (ativa("novo-checkout", { userId: "u42", tenantId: "t7" }, config)) {',
          "  // caminho novo",
          "}",
        ].join("\n"),
        nota: "Aumentar o `percentual` de 10 para 20 só acrescenta usuários: quem já estava dentro continua dentro. Sortear com `Math.random()` a cada chamada faria a mesma pessoa alternar entre versões. Com `ctx.tenantId`, o mesmo desenho libera por cliente.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Em microsserviços: decida uma vez e propague",
        texto:
          "Se cada serviço avalia a flag com o seu cache e as suas regras, a mesma requisição pode ver o checkout novo em um serviço e o antigo em outro. O padrão mais seguro é **avaliar na borda** (gateway, BFF ou primeiro serviço) e **propagar o resultado ou o contexto** nas chamadas seguintes (cabeçalho, claim do token ou o baggage do trace). Quando cada serviço precisa avaliar, use o **mesmo serviço de flags**, o **mesmo contexto** (usuário, tenant) e a **mesma chave de rollout**, para o hash dar o mesmo balde em todos. Dê a cada flag um nome padronizado, um dono e uma data de remoção, e registre quem mudou o quê.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Dívida técnica e testes",
        texto:
          "Cada flag **dobra** os caminhos do código. Teste com a flag ligada e desligada (e a transição, se houver estado), apague a flag e o caminho velho assim que o rollout termina e revise a lista de flags antigas com frequência. Defina o **valor padrão** de cada uma pensando no lado seguro: se o serviço de flags cair, um recurso novo fica desligado, e um kill switch precisa do valor que mantém o sistema funcionando. Não coloque segredos nos valores das flags e cuide dos dados pessoais enviados como contexto a um serviço de terceiros.",
      },
    ],
    armadilhas: [
      "Deixar as flags para sempre: o código vira um labirinto de `if`, e ninguém sabe mais quais combinações são seguras.",
      "Avaliar a mesma flag em cada serviço com regras ou contexto diferentes: a experiência fica inconsistente dentro de uma mesma requisição.",
      "Depender do serviço de flags sem cache nem valor padrão: a queda dele passa a derrubar a aplicação.",
      "Sortear com `Math.random()` a cada requisição em vez de usar um hash estável: o mesmo usuário alterna entre as versões.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre implantar e liberar, e como a feature flag ajuda?",
        resposta:
          "Implantar é colocar o código em produção; liberar é torná-lo visível às pessoas. Com a flag, o código sobe desligado e é ligado depois, aos poucos e sem nova implantação, e desligar também é imediato se algo der errado.",
      },
      {
        pergunta: "Por que o rollout por percentual usa um hash do usuário e não um sorteio por requisição?",
        resposta:
          "Porque o hash é estável: o mesmo usuário cai sempre no mesmo balde, e aumentar o percentual só acrescenta usuários. O sorteio por requisição faria a mesma pessoa ver versões diferentes a cada acesso.",
      },
    ],
  },
  en: {
    titulo: "Feature flags",
    pergunta: "What are feature flags and how are they used in backend development?",
    porqueEsteMetodo:
      "The idea is simple, but it often gets mixed up with configuration and access control. The circuit-breaker analogy fixes the intuition, and then come the real mechanism and the point where the picture stops holding.",
    resposta30s:
      "**Feature flags** (or toggles) are conditions in the code whose value comes from outside and changes **without a new deployment**: they separate **deploying** from **releasing**. In the backend, they serve **gradual rollout** (by percentage, user or tenant), an operational **kill switch**, experiments and per-plan release. In return, every flag is technical debt: give it an owner and a removal date, have a **default value** if the flag service goes down and, in microservices, **decide at the edge and propagate** the result.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a house’s breaker panel, with one breaker per room. The wiring is already installed everywhere; to turn the kitchen light on or off, you flip the breaker, without opening the wall or calling the electrician. If the kitchen has a problem, you switch off only that room and the rest of the house keeps working.",
        tecnico:
          'A **feature flag** (or feature toggle) is a condition in the code, like `if (isEnabled("name", context))`, whose value comes from outside the code and can change without a new deployment. It separates **deploying** (the code is in production) from **releasing** (people see it). That allows gradual rollout, quickly switching off a problem (a kill switch), testing with a group and integrating early into the main trunk with the unfinished feature hidden. Evaluation uses a **context** (user, tenant, environment) and **rules** (percentage, list, attribute), which come from an SDK connected to a flag service, a configuration file or an environment variable; the SDK keeps the rules in a local cache and uses a **default value** if the service goes down. Well-known tools include OpenFeature (an open SDK standard), Unleash, GrowthBook, Flagsmith and LaunchDarkly, in no order of preference: check each one’s documentation and model.',
        limite:
          "A breaker only switches on or off; a flag also decides **for whom** and **when**. And a house’s panel does not create new breakers by itself: in software, every forgotten flag is one more `if`, one more path to test and technical debt. A flag controls **visibility**, not **authorization**: hiding a button does not stop someone from calling the route.",
      },
      {
        tipo: "tabela",
        titulo: "The four kinds of flag",
        colunas: ["Kind", "What it is for", "Who decides", "Lifespan", "Example"],
        linhas: [
          [
            "Release",
            "Hide a feature under development and release it gradually",
            "Product and engineering",
            "Short: remove it once it reaches 100% and is stable",
            "A new checkout flow",
          ],
          [
            "Experiment (A/B test)",
            "Compare variants and measure the effect",
            "Product and data",
            "Short: until there is a result",
            "Two button orders on the payment screen",
          ],
          [
            "Operational (kill switch)",
            "Quickly switch off an expensive path or a dependency under load or during an incident",
            "Operations and platform engineering",
            "May be long: it is a safety valve",
            "Turn off recommendations when their service is slow",
          ],
          [
            "Permission",
            "Release by plan, customer or tenant",
            "Product and sales",
            "Long: it becomes part of the product",
            "Advanced reports only on the premium plan",
          ],
        ],
        nota: "A per-plan permission is a permanent business rule: if it grows, model it as plan entitlements, not as a flag someone will remove by mistake one day.",
      },
      {
        tipo: "codigo",
        titulo: "Evaluation with stable rollout, kill switch and a safe default",
        legenda: "JavaScript",
        codigo: [
          'import { createHash } from "node:crypto";',
          "",
          "// Stable rollout: the same user always lands in the same bucket (0 to 99)",
          "function bucket(flag, userId) {",
          '  const hash = createHash("sha256").update(`${flag}:${userId}`).digest();',
          "  return hash.readUInt32BE(0) % 100;",
          "}",
          "",
          "function isEnabled(flag, ctx, config) {",
          "  const rule = config[flag];",
          "  if (!rule || rule.off) return false; // safe default and kill switch",
          "  if (rule.tenants?.includes(ctx.tenantId)) return true;",
          "  return bucket(flag, ctx.userId) < (rule.percentage ?? 0);",
          "}",
          "",
          "// `config` comes from the flag service, with a local cache and the last good value if it goes down",
          'if (isEnabled("new-checkout", { userId: "u42", tenantId: "t7" }, config)) {',
          "  // new path",
          "}",
        ].join("\n"),
        nota: "Raising `percentage` from 10 to 20 only adds users: those already inside stay inside. Drawing with `Math.random()` on each call would make the same person flip between versions. With `ctx.tenantId`, the same design releases by customer.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "In microservices: decide once and propagate",
        texto:
          "If each service evaluates the flag with its own cache and rules, the same request may see the new checkout in one service and the old one in another. The safest pattern is to **evaluate at the edge** (gateway, BFF or first service) and **propagate the result or the context** in later calls (a header, a token claim or the trace baggage). When each service must evaluate, use the **same flag service**, the **same context** (user, tenant) and the **same rollout key**, so the hash gives the same bucket everywhere. Give every flag a standard name, an owner and a removal date, and record who changed what.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Technical debt and tests",
        texto:
          "Every flag **doubles** the code paths. Test with the flag on and off (and the transition, if there is state), delete the flag and the old path as soon as the rollout ends, and review the list of old flags often. Set each one’s **default value** with the safe side in mind: if the flag service goes down, a new feature stays off, and a kill switch needs the value that keeps the system working. Do not put secrets in flag values and take care with personal data sent as context to a third-party service.",
      },
    ],
    armadilhas: [
      "Leaving flags forever: the code becomes a maze of `if`s, and nobody knows which combinations are safe anymore.",
      "Evaluating the same flag in each service with different rules or context: the experience becomes inconsistent within a single request.",
      "Depending on the flag service with no cache and no default value: its outage starts taking the application down.",
      "Drawing with `Math.random()` on each request instead of using a stable hash: the same user flips between versions.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between deploying and releasing, and how does a feature flag help?",
        resposta:
          "Deploying puts the code in production; releasing makes it visible to people. With a flag, the code goes out switched off and is turned on later, gradually and without a new deployment, and switching it off is just as immediate if something goes wrong.",
      },
      {
        pergunta: "Why does a percentage rollout use a hash of the user and not a draw per request?",
        resposta:
          "Because the hash is stable: the same user always lands in the same bucket, and raising the percentage only adds users. A draw per request would make the same person see different versions on each visit.",
      },
    ],
  },
};
