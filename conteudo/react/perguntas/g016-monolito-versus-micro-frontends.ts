import type { Pergunta } from "../../tipos";

// G16 · Monolito versus micro-frontends
export const g016: Pergunta = {
  numero: 316,
  modulo: "glassdoor-react",
  metodo: "design",
  pt: {
    titulo: "Monolito versus micro-frontends",
    pergunta: "Arquitetura de frontend: monolito versus micro-frontends / modular?",
    porqueEsteMetodo:
      "É uma pergunta de arquitetura em que a resposta certa depende do contexto. Um roteiro (requisitos, sinais de dor, decisão central, contrato, compartilhado, operação) evita defender uma moda e leva a uma recomendação justificada.",
    resposta30s:
      "Comece pelo **monolito modular**: um app, um deploy, com fronteiras claras por domínio, que dá a maior parte do benefício com o menor custo. **Micro-frontends** (partes da interface desenvolvidas, versionadas e publicadas **de forma independente**, compostas no navegador ou no servidor) só compensam quando o problema é **organizacional**: muitos times travando uns aos outros no deploy. Eles cobram em contrato entre as partes, dependências duplicadas, design system compartilhado, roteamento, autenticação e desempenho.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos e restrições",
            texto:
              "Quantos times existem e se precisam entregar de forma independente; o ritmo de deploy desejado; o tamanho do código e o tempo de build; domínios com limites claros; tecnologias diferentes ou legado a migrar; requisitos de desempenho, SEO, consistência visual e segurança.",
          },
          {
            titulo: "2. Sinais de que o monolito dói",
            texto:
              "Medidas, não impressões: filas de deploy, conflitos de merge constantes, build ou testes lentos demais, times esperando uns pelos outros, mudanças pequenas que exigem coordenar muita gente. Sem esses sinais, não há problema a resolver.",
          },
          {
            titulo: "3. Decisão central: onde fica a fronteira e quem a impõe",
            texto:
              "Primeiro, um **monolito modular**: pastas por funcionalidade, regras de importação verificadas por lint (ninguém importa o interior de outro módulo) e um dono por módulo. Se ainda houver dor, **extraia do build** o módulo mais autônomo. A fronteira certa segue o **domínio de negócio**, não a camada técnica (veja L178).",
          },
          {
            titulo: "4. Contrato entre as partes",
            texto:
              "Defina o que cada parte expõe: como é montada e desmontada, que rotas possui, que props e eventos recebe e emite (eventos do navegador ou uma API pequena e **versionada**) e o que é compartilhado. Sem contrato, o acoplamento volta escondido.",
          },
          {
            titulo: "5. Compartilhado: design system, estado, rotas e autenticação",
            texto:
              "Design system como pacote versionado (veja L180). Estado: cada parte guarda o seu e o compartilhado é o mínimo, por URL, eventos ou sessão. Rotas: o **shell** cuida das rotas de topo e cada parte das suas internas. Autenticação: o shell obtém a sessão e a repassa, sem cada parte reimplementar o login.",
          },
          {
            titulo: "6. Operação",
            texto:
              "Pipeline e versão por parte, plano de reversão, observabilidade por parte (erros e Web Vitals por micro-frontend, veja G29), testes de contrato e de ponta a ponta, um orçamento de bytes de JavaScript e o tratamento da falha de uma parte (fronteira de erro e carregamento tolerante).",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Formas de composição",
        colunas: ["Forma", "Como compõe", "Vantagens", "Custos"],
        linhas: [
          [
            "Monolito modular",
            "Um app e um deploy; módulos por domínio com fronteiras verificadas",
            "Simples de operar, refatorar e testar; desempenho previsível",
            "Deploy único, então os times se coordenam; a disciplina das fronteiras depende de lint e revisão",
          ],
          [
            "Monorepo com pacotes",
            "Vários pacotes (interface, domínios) no mesmo repositório, montados no build",
            "Compartilha código e ferramentas; dá para versionar e testar por pacote",
            "Ainda gera um artefato só (ou builds acoplados); exige ferramentas de monorepo",
          ],
          [
            "Module Federation (em tempo de execução)",
            "O shell carrega, no navegador, JavaScript publicado por outras equipes",
            "Deploy independente de verdade; dependências compartilhadas como singleton",
            "Versões compartilhadas frágeis (React duplicado quebra hooks e contexto), falhas só em tempo de execução, configuração e depuração mais difíceis",
          ],
          [
            "Iframes",
            "Cada parte é uma página embutida",
            "Isolamento forte de estilo, JavaScript e falhas; aceita qualquer tecnologia",
            "Altura, rolagem, foco, acessibilidade e roteamento complicados; comunicação por mensagens",
          ],
          [
            "Web components",
            "Elementos personalizados (`<minha-parte>`) como interface neutra entre frameworks",
            "Fronteira padrão do navegador; funciona entre frameworks",
            "Integrar com estado e roteamento do React pede código de cola; SSR e eventos pedem cuidado",
          ],
          [
            "Apps separados por rota",
            "Cada seção é um app; um gateway ou CDN roteia por caminho e a navegação entre elas recarrega a página",
            "Mais simples que carregar partes em tempo de execução; isolamento total",
            "Recarrega ao trocar de app; experiência e estado compartilhado limitados",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Migração gradual, sem reescrever tudo",
        etapas: [
          "Modularize dentro do monolito: pastas por domínio e uma API pública (`index.ts`) por módulo",
          "Imponha as fronteiras com regras de lint e donos de código, e meça tempo de build, conflitos e fila de deploy",
          "Extraia o primeiro módulo mais autônomo, com um contrato simples, atrás do shell existente e com o design system já em pacote",
          "Padronize o que é compartilhado (dependências, autenticação, observabilidade) e o contrato de montagem e eventos",
          "Repita só onde a dor continuar; onde ela sumiu, o módulo fica no monolito",
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Micro-frontends resolvem **escala de pessoas**, não de código. Escolha o monolito modular por padrão; vá a micro-frontends quando houver vários times com domínios estáveis, necessidade comprovada de **deploys independentes** e capacidade de manter plataforma, contrato e design system. Teste: se a dor some com pastas, lint e um pipeline melhor, você não precisa deles.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cedo demais é caro",
        texto:
          "Micro-frontends trocam problemas de código por problemas de sistema distribuído: versões incompatíveis, JavaScript duplicado, experiência inconsistente, autenticação e estado espalhados e depuração em vários repositórios. Para um time pequeno ou um produto jovem, quase sempre o custo supera o ganho. Adote por necessidade medida e comece por uma fronteira só.",
      },
    ],
    armadilhas: [
      "Adotar micro-frontends por moda ou pelo organograma antes de medir a dor, e acabar com mais coordenação, não menos.",
      "Cortar pela camada técnica (uma parte para botões, outra para dados) em vez de pelo domínio de negócio: toda mudança cruza todas as partes.",
      "Carregar uma cópia do React (ou da biblioteca de interface) por parte: mais bytes, e hooks e contexto quebrando entre cópias.",
      "Compartilhar estado global e design system sem versionar nem definir contrato: as partes voltam a se acoplar.",
    ],
    autoteste: [
      {
        pergunta: "Que sinais justificam sair de um monolito para micro-frontends?",
        resposta:
          "Vários times travando uns aos outros no deploy, filas e conflitos constantes e domínios estáveis com fronteiras claras, tudo medido. Se a dor some com módulos, lint e um pipeline melhor, não é preciso.",
      },
      {
        pergunta: "O que é o contrato entre micro-frontends e por que ele importa?",
        resposta:
          "É o que cada parte expõe e aceita: como é montada, suas rotas, props e eventos versionados e as dependências compartilhadas. Sem contrato, uma mudança numa parte quebra as outras e a independência de deploy desaparece.",
      },
    ],
  },
  en: {
    titulo: "Monolith vs micro-frontends",
    pergunta: "Frontend architecture: monolith vs micro-frontends / modular?",
    porqueEsteMetodo:
      "This is an architecture question where the right answer depends on context. A script (requirements, pain signals, central decision, contract, shared pieces, operations) avoids defending a fashion and leads to a justified recommendation.",
    resposta30s:
      "Start with a **modular monolith**: one app, one deploy, with clear boundaries by domain, which gives most of the benefit at the lowest cost. **Micro-frontends** (parts of the UI developed, versioned and published **independently**, composed in the browser or on the server) only pay off when the problem is **organizational**: many teams blocking each other at deploy time. They charge you in contracts between parts, duplicated dependencies, a shared design system, routing, authentication and performance.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements and constraints",
            texto:
              "How many teams there are and whether they need to ship independently; the desired deploy cadence; code size and build time; domains with clear limits; different technologies or legacy code to migrate; requirements for performance, SEO, visual consistency and security.",
          },
          {
            titulo: "2. Signs the monolith hurts",
            texto:
              "Measurements, not impressions: deploy queues, constant merge conflicts, builds or tests that are too slow, teams waiting on one another, small changes that require coordinating many people. Without these signs, there is no problem to solve.",
          },
          {
            titulo: "3. Central decision: where the boundary is and who enforces it",
            texto:
              "First, a **modular monolith**: folders by feature, import rules checked by lint (nobody imports the internals of another module) and an owner per module. If it still hurts, **extract from the build** the most autonomous module. The right boundary follows the **business domain**, not the technical layer (see L178).",
          },
          {
            titulo: "4. Contract between the parts",
            texto:
              "Define what each part exposes: how it is mounted and unmounted, which routes it owns, which props and events it receives and emits (browser events or a small, **versioned** API) and what is shared. Without a contract, coupling comes back in disguise.",
          },
          {
            titulo: "5. Shared pieces: design system, state, routes and authentication",
            texto:
              "The design system as a versioned package (see L180). State: each part keeps its own and the shared part is the minimum, through the URL, events or the session. Routes: the **shell** owns the top-level routes and each part its inner ones. Authentication: the shell obtains the session and passes it down, so each part does not reimplement login.",
          },
          {
            titulo: "6. Operations",
            texto:
              "A pipeline and version per part, a rollback plan, observability per part (errors and Web Vitals per micro-frontend, see G29), contract and end-to-end tests, a JavaScript byte budget and handling of a failing part (an error boundary and tolerant loading).",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Ways to compose",
        colunas: ["Form", "How it composes", "Advantages", "Costs"],
        linhas: [
          [
            "Modular monolith",
            "One app and one deploy; modules by domain with verified boundaries",
            "Simple to operate, refactor and test; predictable performance",
            "A single deploy, so teams coordinate; boundary discipline depends on lint and review",
          ],
          [
            "Monorepo with packages",
            "Several packages (UI, domains) in the same repository, assembled at build time",
            "Shares code and tooling; each package can be versioned and tested",
            "Still produces a single artifact (or coupled builds); needs monorepo tooling",
          ],
          [
            "Module Federation (runtime)",
            "The shell loads, in the browser, JavaScript published by other teams",
            "Truly independent deploys; dependencies shared as singletons",
            "Fragile shared versions (a duplicated React breaks hooks and context), failures only at runtime, harder setup and debugging",
          ],
          [
            "Iframes",
            "Each part is an embedded page",
            "Strong isolation of styles, JavaScript and failures; accepts any technology",
            "Height, scrolling, focus, accessibility and routing get complicated; communication by messages",
          ],
          [
            "Web components",
            "Custom elements (`<my-part>`) as a framework-neutral interface",
            "A standard browser boundary; works across frameworks",
            "Integrating with React’s state and routing needs glue code; SSR and events need care",
          ],
          [
            "Separate apps by route",
            "Each section is an app; a gateway or CDN routes by path and moving between them reloads the page",
            "Simpler than loading parts at runtime; total isolation",
            "Reloads when switching apps; limited experience and shared state",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Gradual migration, without rewriting everything",
        etapas: [
          "Modularize inside the monolith: folders by domain and a public API (`index.ts`) per module",
          "Enforce the boundaries with lint rules and code owners, and measure build time, conflicts and the deploy queue",
          "Extract the first, most autonomous module with a simple contract, behind the existing shell and with the design system already a package",
          "Standardize what is shared (dependencies, authentication, observability) and the mount-and-events contract",
          "Repeat only where the pain persists; where it is gone, the module stays in the monolith",
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Micro-frontends solve **scale of people**, not scale of code. Choose the modular monolith by default; go to micro-frontends when there are several teams with stable domains, a proven need for **independent deploys** and the capacity to maintain the platform, contract and design system. Test: if the pain goes away with folders, lint and a better pipeline, you do not need them.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Too early is expensive",
        texto:
          "Micro-frontends swap code problems for distributed-system problems: incompatible versions, duplicated JavaScript, an inconsistent experience, authentication and state scattered around, and debugging across several repositories. For a small team or a young product, the cost almost always exceeds the gain. Adopt them out of measured need and start with a single boundary.",
      },
    ],
    armadilhas: [
      "Adopting micro-frontends out of fashion or following the org chart before measuring the pain, and ending up with more coordination, not less.",
      "Cutting by technical layer (one part for buttons, another for data) instead of by business domain: every change crosses every part.",
      "Loading one copy of React (or the UI library) per part: more bytes, and hooks and context breaking between copies.",
      "Sharing global state and the design system without versioning or a contract: the parts become coupled again.",
    ],
    autoteste: [
      {
        pergunta: "What signs justify moving from a monolith to micro-frontends?",
        resposta:
          "Several teams blocking each other at deploy time, constant queues and conflicts, and stable domains with clear boundaries, all measured. If the pain goes away with modules, lint and a better pipeline, you do not need them.",
      },
      {
        pergunta: "What is the contract between micro-frontends and why does it matter?",
        resposta:
          "It is what each part exposes and accepts: how it is mounted, its routes, versioned props and events and the shared dependencies. Without a contract, a change in one part breaks the others and deploy independence disappears.",
      },
    ],
  },
};
