import type { Pergunta } from "../../tipos";

// L97 · Estrutura de projeto
export const l097: Pergunta = {
  numero: 197,
  modulo: "linkedin-arquitetura",
  metodo: "compare",
  pt: {
    titulo: "Estrutura de projeto",
    pergunta: "Como você estruturaria um projeto Node.js grande?",
    porqueEsteMetodo:
      "A resposta costuma ser uma escolha entre dois jeitos de organizar o código. A matriz mostra o que cada um custa à medida que o projeto cresce, e a regra de decisão fecha a resposta com as regras de dependência que sustentam a estrutura.",
    resposta30s:
      "Em um projeto grande, **organize por funcionalidade** (módulos como `pedidos/` e `clientes/`, cada um com rotas, serviço e repositório dentro) e não apenas por tipo técnico. O que mantém a estrutura de pé são as **regras de dependência**: os módulos só conversam pela interface pública, a regra de negócio não conhece HTTP nem o banco e as dependências entram por parâmetro (injeção). A configuração fica num lugar só, validada na partida; monorepo apenas quando vários pacotes compartilham código.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Por camada ou por funcionalidade",
        colunas: ["Aspecto", "Por camada", "Por funcionalidade (módulos)"],
        linhas: [
          [
            "Pastas",
            "`controllers/`, `services/`, `models/` na raiz, com todos os assuntos misturados",
            "Uma pasta por assunto (`pedidos/`, `clientes/`), cada uma com suas camadas dentro",
          ],
          ["Uma mudança típica", "Espalha-se por várias pastas", "Fica quase toda dentro de uma pasta"],
          [
            "Acoplamento",
            "Qualquer arquivo importa qualquer outro; vira um emaranhado",
            "Fronteira clara: o módulo expõe uma interface (`index.js`) e esconde o resto",
          ],
          ["Times", "Muita gente mexendo nas mesmas pastas", "Cada time é dono de módulos"],
          [
            "Extrair um serviço depois",
            "Difícil: o assunto está espalhado",
            "Mais fácil: o módulo já é quase um serviço",
          ],
          ["Melhor para", "Projetos pequenos e protótipos", "Projetos grandes ou que vão crescer"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Estrutura por funcionalidade",
        legenda: "Árvore de pastas",
        codigo: [
          "src/",
          "  config/             # lê e valida as variáveis de ambiente, uma vez",
          "  shared/             # logger, erros, utilidades sem regra de negócio",
          "  modules/",
          "    pedidos/",
          "      index.js          # a única porta de entrada do módulo",
          "      pedidos.routes.js     # HTTP: rotas e validação da entrada",
          "      pedidos.service.js    # regra de negócio",
          "      pedidos.repository.js # acesso ao banco",
          "      pedidos.test.js",
          "    clientes/",
          "      ...",
          "  app.js              # monta o framework e registra os módulos",
          "  server.js           # sobe o servidor e trata o encerramento",
        ].join("\n"),
        nota: "Os nomes são só uma convenção; o essencial é a regra: de fora de `pedidos/`, só se importa `pedidos/index.js`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Em projeto pequeno, qualquer um dos dois serve; em um grande, **organize por funcionalidade** e use camadas **dentro** de cada módulo. Imponha uma regra de dependência de mão única: rotas → serviço → repositório. Os módulos só falam entre si pela interface pública, e a regra de negócio não importa o Express nem o driver do banco. Entregue as dependências de fora (banco, filas, relógio) por parâmetro ou por uma fábrica, uma forma simples de injeção de dependência que facilita os testes; um contêiner de DI (NestJS, awilix) é opcional. Leia o `process.env` em um só lugar e valide na partida (veja L20). Use monorepo (workspaces de gerenciadores como npm e pnpm) só quando vários pacotes ou aplicações compartilham código.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Pasta não cria fronteira; regra de dependência cria",
        texto:
          "Uma árvore bonita com importações cruzadas e uma pasta `utils` que vira depósito continua sendo uma grande bola de lama. Faça a regra valer por ferramenta (regras de lint para importações, `dependency-cruiser`) e não só por convenção, e não comece fatiando em muitos pacotes ou serviços antes de a dor existir (veja L98).",
      },
    ],
    armadilhas: [
      "Organizar só por tipo técnico (`controllers/`, `models/`) num projeto grande: toda mudança de funcionalidade atravessa várias pastas.",
      "Deixar os módulos importarem os arquivos internos uns dos outros: quando um muda, vários quebram. Exponha só uma interface pública.",
      "Deixar `utils` ou `helpers` virar depósito: o que tem regra de negócio vai para o módulo dono dela.",
      "Importar `process.env`, o Express ou o driver do banco em qualquer arquivo: a regra de negócio fica presa à infraestrutura e só se testa subindo o servidor.",
    ],
    autoteste: [
      {
        pergunta: "Por que “por funcionalidade” costuma escalar melhor que “por camada”?",
        resposta:
          "Porque cada mudança fica concentrada num módulo, as fronteiras são claras, os times trabalham em módulos diferentes e um módulo bem isolado é mais fácil de extrair depois.",
      },
      {
        pergunta: "Qual é a regra de dependência básica entre as camadas?",
        resposta:
          "Do lado de fora para dentro: as rotas dependem do serviço, e o serviço, do repositório (ou de uma interface dele). A regra de negócio não conhece HTTP nem o driver do banco, e nunca o contrário.",
      },
    ],
  },
  en: {
    titulo: "Project structure",
    pergunta: "How would you structure a large Node.js project?",
    porqueEsteMetodo:
      "The answer is usually a choice between two ways of organizing code. The matrix shows what each one costs as the project grows, and the decision rule closes the answer with the dependency rules that hold the structure up.",
    resposta30s:
      "In a large project, **organize by feature** (modules such as `orders/` and `customers/`, each with routes, service and repository inside) rather than only by technical type. What keeps the structure standing are the **dependency rules**: modules talk only through their public interface, business rules know neither HTTP nor the database, and dependencies are passed in (injection). Configuration lives in one place and is validated at startup; use a monorepo only when several packages share code.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "By layer or by feature",
        colunas: ["Aspect", "By layer", "By feature (modules)"],
        linhas: [
          [
            "Folders",
            "`controllers/`, `services/`, `models/` at the root, with every subject mixed together",
            "One folder per subject (`orders/`, `customers/`), each with its own layers inside",
          ],
          ["A typical change", "Spreads across several folders", "Stays almost entirely inside one folder"],
          [
            "Coupling",
            "Any file imports any other; it grows into a tangle",
            "Clear boundary: the module exposes an interface (`index.js`) and hides the rest",
          ],
          ["Teams", "Many people editing the same folders", "Each team owns modules"],
          [
            "Extracting a service later",
            "Hard: the subject is scattered",
            "Easier: the module is already close to a service",
          ],
          ["Best for", "Small projects and prototypes", "Large projects, or ones that will grow"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A structure by feature",
        legenda: "Folder tree",
        codigo: [
          "src/",
          "  config/             # reads and validates environment variables, once",
          "  shared/             # logger, errors, utilities with no business rules",
          "  modules/",
          "    orders/",
          "      index.js          # the module's only entry point",
          "      orders.routes.js     # HTTP: routes and input validation",
          "      orders.service.js    # business rules",
          "      orders.repository.js # database access",
          "      orders.test.js",
          "    customers/",
          "      ...",
          "  app.js              # builds the framework and registers the modules",
          "  server.js           # starts the server and handles shutdown",
        ].join("\n"),
        nota: "The names are only a convention; the essential part is the rule: from outside `orders/`, you only import `orders/index.js`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "In a small project, either layout works; in a large one, **organize by feature** and use layers **inside** each module. Enforce a one-way dependency rule: routes → service → repository. Modules talk to each other only through their public interface, and business rules import neither Express nor the database driver. Hand outside dependencies (database, queues, clock) in as parameters or through a factory, a simple form of dependency injection that makes tests easier; a DI container (NestJS, awilix) is optional. Read `process.env` in one place and validate it at startup (see L20). Use a monorepo (workspaces in package managers such as npm and pnpm) only when several packages or applications share code.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Folders do not create boundaries; dependency rules do",
        texto:
          "A tidy tree with cross-imports and a `utils` folder that becomes a dumping ground is still a big ball of mud. Make the rule hold through tooling (import lint rules, `dependency-cruiser`), not just convention, and do not start by slicing into many packages or services before the pain exists (see L98).",
      },
    ],
    armadilhas: [
      "Organizing only by technical type (`controllers/`, `models/`) in a large project: every feature change cuts across several folders.",
      "Letting modules import each other’s internal files: when one changes, several break. Expose only a public interface.",
      "Letting `utils` or `helpers` become a dumping ground: anything with business rules belongs in the module that owns it.",
      "Importing `process.env`, Express or the database driver in any file: business rules get tied to infrastructure and can only be tested by starting the server.",
    ],
    autoteste: [
      {
        pergunta: "Why does “by feature” usually scale better than “by layer”?",
        resposta:
          "Because each change stays concentrated in one module, the boundaries are clear, teams work on different modules, and a well-isolated module is easier to extract later.",
      },
      {
        pergunta: "What is the basic dependency rule between layers?",
        resposta:
          "From the outside in: routes depend on the service, and the service on the repository (or an interface to it). Business rules know neither HTTP nor the database driver, and never the other way around.",
      },
    ],
  },
};
