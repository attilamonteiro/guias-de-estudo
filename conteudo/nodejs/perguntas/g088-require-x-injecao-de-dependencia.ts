import type { Pergunta } from "../../tipos";

// G88 · require x injeção de dependência
export const g088: Pergunta = {
  numero: 688,
  modulo: "gist-especialista",
  metodo: "compare",
  pt: {
    titulo: "require x injeção de dependência",
    pergunta: "Por que os desenvolvedores Node.js tendem a preferir o require de módulos à injeção de dependência?",
    porqueEsteMetodo:
      "As duas abordagens resolvem o mesmo problema, dar ao código acesso ao que ele usa, com custos diferentes. A matriz compara critério a critério e a regra de decisão diz quando cada uma compensa, que é o que a pergunta realmente quer saber.",
    resposta30s:
      "A preferência é **cultural e prática**, não uma regra: `require`/`import` é simples, o cache faz de cada módulo um **singleton** e o JavaScript, sendo dinâmico e com funções de primeira classe, dispensa boa parte da cerimônia que outras linguagens exigem. O custo é **acoplamento**, **estado compartilhado** e testes mais difíceis de isolar. A **injeção de dependência** (por construtor, fábrica ou contêiner como Nest, awilix e tsyringe) troca essa simplicidade por flexibilidade, e compensa em **bases grandes** e com **vários adaptadores**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "`require`/`import` direto x injeção de dependência",
        colunas: ["Critério", "`require`/`import` direto", "Injeção de dependência explícita"],
        linhas: [
          [
            "Como funciona",
            "O módulo importa o que usa pelo caminho; o cache de módulos faz de cada um um singleton (veja F90)",
            "Quem usa recebe as dependências por construtor, parâmetro ou fábrica; uma raiz de composição monta tudo",
          ],
          [
            "Simplicidade",
            "Uma linha por dependência, sem montagem; encaixa na cultura de funções e módulos pequenos",
            "Mais código de montagem e uma camada de indireção: “quem cria o quê?”",
          ],
          [
            "Acoplamento",
            "Forte ao módulo concreto, escolhido pelo caminho do arquivo",
            "Depende de uma forma (um objeto com certos métodos); trocar a implementação não edita o consumidor",
          ],
          [
            "Testes",
            "Substituir o módulo exige ferramentas: no CommonJS, mexer no cache de `require`; no ESM, recursos do test runner ou de loaders (confira a documentação)",
            "Passa-se um duplo de teste no construtor ou na fábrica, sem mágica",
          ],
          [
            "Estado e ciclo de vida",
            "O singleton compartilha estado (conexão, configuração) entre todos os consumidores e testes",
            "Você controla o ciclo de vida: uma instância por aplicação, por requisição ou por teste",
          ],
          [
            "Onde compensa",
            "Scripts, serviços pequenos, bibliotecas, funções puras",
            "Bases grandes, vários adaptadores (banco real e falso, provedores) e muitas pessoas no mesmo código",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A mesma dependência, importada e injetada",
        legenda: "JavaScript",
        codigo: [
          "// usuarios.direto.js: o módulo escolhe a dependência sozinho",
          'import { db } from "./db.js";',
          'export const buscar = (id) => db.query("select * from usuarios where id = $1", [id]);',
          "",
          "// usuarios.injetado.js: quem monta decide qual db entra",
          "export const criarUsuarios = ({ db }) => ({",
          '  buscar: (id) => db.query("select * from usuarios where id = $1", [id]),',
          "});",
          "",
          "// app.js: raiz de composição, o único lugar que conhece os módulos concretos",
          'import { db } from "./db.js";',
          'import { criarUsuarios } from "./usuarios.injetado.js";',
          "const usuarios = criarUsuarios({ db });",
          "",
          "// teste: um duplo simples, sem mexer no cache de módulos",
          "const falso = criarUsuarios({ db: { query: async () => [{ id: 1 }] } });",
        ].join("\n"),
        nota: "Trechos ilustrativos de vários arquivos. Note que a injeção também usa `import`, só que concentrado na raiz de composição.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Comece com `import` direto e introduza injeção quando houver um **motivo concreto**: mais de uma implementação real da mesma dependência (adaptadores), necessidade de trocá-la nos testes sem hacks, ciclos de vida diferentes (por requisição) ou uma base e um time grandes que precisam de regras de dependência (veja D68 e L97). Antes de um contêiner, tente a injeção simples: passar a dependência por parâmetro ou fábrica e montar tudo numa raiz de composição. Contêiner (Nest, awilix, tsyringe) só quando montar à mão virar o problema.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Singleton por cache não é garantia absoluta",
        texto:
          "O cache de módulos é indexado pelo caminho resolvido do arquivo. Se o mesmo pacote existir em dois lugares de `node_modules` (versões diferentes), ou for carregado por CommonJS e por ESM, que têm caches separados, você pode ter duas instâncias do “singleton”. E a pergunta descreve uma tendência, não uma lei: o Nest, por exemplo, é um framework Node construído em torno de injeção de dependência.",
      },
    ],
    armadilhas: [
      "Achar que o cache de módulos garante uma única instância em qualquer cenário: pacotes duplicados e a mistura de CommonJS com ESM quebram essa garantia.",
      "Mockar importações com truques de CommonJS (mexer no cache de `require`) e esperar que funcionem em ESM, que tem outros mecanismos.",
      "Adotar um contêiner de DI cedo, por hábito de outras linguagens: a cerimônia e a mágica (decorators, metadados) custam mais do que o problema que resolvem.",
      "Passar o contêiner inteiro para dentro das classes e pedir tudo de lá (service locator): o acoplamento volta, escondido.",
    ],
    autoteste: [
      {
        pergunta: "Por que substituir uma dependência importada diretamente é mais trabalhoso nos testes?",
        resposta:
          "Porque o módulo escolhe a dependência sozinho, pelo caminho do arquivo. Para trocá-la, é preciso interceptar o carregamento (cache do `require`, loaders ou o mock do test runner). Com injeção, basta passar outro objeto.",
      },
      {
        pergunta: "Qual é uma alternativa leve à injeção com contêiner?",
        resposta:
          "Fábricas ou construtores que recebem as dependências por parâmetro, com uma raiz de composição que monta o grafo à mão. Dá o desacoplamento e a facilidade de teste sem a cerimônia de um contêiner.",
      },
    ],
  },
  en: {
    titulo: "require vs dependency injection",
    pergunta: "Why Node.js devs tend to lean towards the Module Requiring vs Dependency Injection?",
    porqueEsteMetodo:
      "The two approaches solve the same problem, giving code access to what it uses, at different costs. The matrix compares them criterion by criterion and the decision rule says when each one pays off, which is what the question really asks.",
    resposta30s:
      "The preference is **cultural and practical**, not a rule: `require`/`import` is simple, the cache turns each module into a **singleton**, and JavaScript, being dynamic with first-class functions, skips much of the ceremony other languages demand. The cost is **coupling**, **shared state** and tests that are harder to isolate. **Dependency injection** (through a constructor, a factory or a container such as Nest, awilix and tsyringe) trades that simplicity for flexibility, and it pays off in **large codebases** and with **several adapters**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Direct `require`/`import` vs dependency injection",
        colunas: ["Criterion", "Direct `require`/`import`", "Explicit dependency injection"],
        linhas: [
          [
            "How it works",
            "The module imports what it uses by path; the module cache makes each one a singleton (see F90)",
            "Whoever uses it receives the dependencies through a constructor, a parameter or a factory; a composition root wires everything",
          ],
          [
            "Simplicity",
            "One line per dependency, no wiring; fits the culture of small functions and modules",
            "More wiring code and a layer of indirection: “who creates what?”",
          ],
          [
            "Coupling",
            "Strong to the concrete module, chosen by file path",
            "Depends on a shape (an object with certain methods); swapping the implementation does not edit the consumer",
          ],
          [
            "Testing",
            "Replacing the module takes tooling: in CommonJS, touching the `require` cache; in ESM, test-runner or loader features (check the documentation)",
            "You pass a test double to the constructor or factory, no magic",
          ],
          [
            "State and lifecycle",
            "The singleton shares state (connection, configuration) across all consumers and tests",
            "You control the lifecycle: one instance per application, per request or per test",
          ],
          [
            "Where it pays off",
            "Scripts, small services, libraries, pure functions",
            "Large codebases, several adapters (real and fake database, providers) and many people on the same code",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The same dependency, imported and injected",
        legenda: "JavaScript",
        codigo: [
          "// users.direct.js: the module picks the dependency by itself",
          'import { db } from "./db.js";',
          'export const find = (id) => db.query("select * from users where id = $1", [id]);',
          "",
          "// users.injected.js: whoever wires it decides which db goes in",
          "export const createUsers = ({ db }) => ({",
          '  find: (id) => db.query("select * from users where id = $1", [id]),',
          "});",
          "",
          "// app.js: composition root, the only place that knows the concrete modules",
          'import { db } from "./db.js";',
          'import { createUsers } from "./users.injected.js";',
          "const users = createUsers({ db });",
          "",
          "// test: a simple double, no tampering with the module cache",
          "const fake = createUsers({ db: { query: async () => [{ id: 1 }] } });",
        ].join("\n"),
        nota: "Illustrative snippets from several files. Note that injection also uses `import`, just concentrated in the composition root.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Start with direct `import` and introduce injection when there is a **concrete reason**: more than one real implementation of the same dependency (adapters), a need to swap it in tests without hacks, different lifecycles (per request) or a large codebase and team that need dependency rules (see D68 and L97). Before a container, try plain injection: pass the dependency as a parameter or through a factory and wire everything in a composition root. A container (Nest, awilix, tsyringe) only when wiring by hand becomes the problem.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A singleton by cache is not an absolute guarantee",
        texto:
          "The module cache is keyed by the file's resolved path. If the same package exists in two places in `node_modules` (different versions), or is loaded by both CommonJS and ESM, which have separate caches, you can end up with two instances of the “singleton”. And the question describes a tendency, not a law: Nest, for example, is a Node framework built around dependency injection.",
      },
    ],
    armadilhas: [
      "Assuming the module cache guarantees a single instance in every scenario: duplicated packages and mixing CommonJS with ESM break that guarantee.",
      "Mocking imports with CommonJS tricks (touching the `require` cache) and expecting them to work in ESM, which has other mechanisms.",
      "Adopting a DI container early, out of habit from other languages: the ceremony and the magic (decorators, metadata) cost more than the problem they solve.",
      "Passing the whole container into classes and asking it for everything (service locator): the coupling comes back, hidden.",
    ],
    autoteste: [
      {
        pergunta: "Why is replacing a directly imported dependency more work in tests?",
        resposta:
          "Because the module picks the dependency by itself, through the file path. To swap it, you have to intercept loading (the `require` cache, loaders or the test runner's mock). With injection, you just pass another object.",
      },
      {
        pergunta: "What is a lightweight alternative to injection with a container?",
        resposta:
          "Factories or constructors that receive their dependencies as parameters, with a composition root that wires the graph by hand. It gives decoupling and easy testing without the ceremony of a container.",
      },
    ],
  },
};
