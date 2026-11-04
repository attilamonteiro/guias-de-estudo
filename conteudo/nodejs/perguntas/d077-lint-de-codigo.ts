import type { Pergunta } from "../../tipos";

// D77 · Lint de código
export const d077: Pergunta = {
  numero: 377,
  modulo: "devinterview-integracoes",
  metodo: "feynman",
  pt: {
    titulo: "Lint de código",
    pergunta: "O que é linting de código e como ele é aplicado no Node.js?",
    porqueEsteMetodo:
      "Lint parece jargão até você pensar no corretor ortográfico do seu editor. A analogia mostra o que ele faz, e depois vêm o mecanismo real (regras sobre a árvore do código) e o ponto em que a imagem deixa de valer.",
    resposta30s:
      "**Linting** é a **análise estática** do código: uma ferramenta lê os arquivos, **sem executá-los**, e aponta bugs prováveis, más práticas e inconsistências de estilo. No Node.js o padrão é o **ESLint** (regras, plugins e configuração em `eslint.config.js`), muitas vezes com o **Prettier** cuidando do formato. Roda no editor, no pre-commit e no CI, mas **não substitui os testes**.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense no corretor ortográfico do editor de texto: enquanto você escreve, ele sublinha palavras erradas e frases suspeitas, sem esperar que o leitor tropece nelas depois. Você corrige na hora, antes de enviar o texto. O lint faz isso com o seu código.",
        tecnico:
          "O ESLint lê cada arquivo, monta uma **árvore sintática** (AST) e aplica **regras**, cada uma procurando um padrão: variável usada sem declarar (`no-undef`), import ou variável sem uso (`no-unused-vars`), comparação frouxa (`eqeqeq`), promise solta. As regras vêm do núcleo e de plugins (`eslint-plugin-n` para o Node, `@typescript-eslint` para TypeScript) e na configuração cada uma é ligada como erro, como aviso ou desligada. Tudo acontece sem executar o programa, por isso é rápido e pega o problema antes de qualquer teste.",
        limite:
          "O corretor não sabe se a história faz sentido, e o lint não sabe se o programa faz o que deveria: **ele pega padrões suspeitos, não prova correção**. Regras demais viram ruído (o time passa a ignorar os avisos), e alguns bugs reais só aparecem com informação de tipos ou em execução.",
      },
      {
        tipo: "tabela",
        titulo: "Quem faz o quê",
        colunas: ["Ferramenta", "O que verifica", "Exemplo"],
        linhas: [
          [
            "Linter (ESLint)",
            "Padrões suspeitos e más práticas no código, sem executá-lo",
            "Variável não definida, import não usado, `==` no lugar de `===`",
          ],
          [
            "Formatador (Prettier)",
            "Só o formato: espaços, quebras de linha, aspas; não analisa lógica",
            "Reescrever o arquivo sempre no mesmo estilo, sem discussão",
          ],
          [
            "Verificador de tipos (`tsc`)",
            "Compatibilidade de tipos entre usos e declarações",
            "Passar `string` onde se espera `number`",
          ],
          ["Testes", "O comportamento, executando o código", "A função devolve o valor esperado para a entrada dada"],
        ],
        nota: "O Prettier não substitui o lint, nem o contrário. Quando os dois convivem, um pacote como o `eslint-config-prettier` desliga as regras de estilo do ESLint que conflitariam com o formatador.",
      },
      {
        tipo: "fluxo",
        titulo: "Onde o lint roda",
        etapas: [
          "**No editor**: a extensão do ESLint sublinha o problema enquanto você digita",
          "**Antes do commit**: o `lint-staged`, acionado por um gancho do git (por exemplo, via `husky`), roda o lint só nos arquivos alterados",
          "**No CI**: `npm run lint` falha o build se houver erro, e é isso que o torna um portão de verdade",
          "**Na revisão**: sobra para as pessoas o que a máquina não vê, como design e regra de negócio",
        ],
      },
      {
        tipo: "codigo",
        titulo: "Uma configuração mínima para Node.js",
        legenda: "JavaScript",
        codigo: `// eslint.config.js: formato "flat" do ESLint (confira a documentação da sua versão)
import js from "@eslint/js";
import globals from "globals";
import n from "eslint-plugin-n";

export default [
  js.configs.recommended, // inclui no-undef e no-unused-vars, que pegam bugs reais
  { languageOptions: { globals: globals.node } }, // reconhece process, Buffer, etc.
  {
    plugins: { n },
    rules: { "n/no-sync": "warn", eqeqeq: "error" }, // *Sync no servidor e == viram aviso e erro
  },
];`,
        nota: "Para pegar promises soltas (um `await` esquecido), use a regra `@typescript-eslint/no-floating-promises`, que exige TypeScript com informação de tipos. Para ciclos de importação, existe `import/no-cycle` (veja F75).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Como o lint dá errado",
        texto:
          "Regras demais (ou muito opinativas) geram ruído, e o time passa a ignorar o relatório. Desabilitar em massa (`/* eslint-disable */` no topo do arquivo) esconde justamente os bugs que a regra existe para achar; desligue uma regra por linha, com o motivo. E lint limpo não quer dizer código correto: ele complementa testes e revisão, não os substitui.",
      },
    ],
    armadilhas: [
      "Achar que o Prettier substitui o ESLint: um formata, o outro procura bugs e más práticas.",
      "Ligar regras demais de uma vez: o relatório fica cheio de avisos e ninguém mais lê. Comece pelo conjunto recomendado.",
      "Silenciar regras em massa ou deixar os avisos se acumularem: o lint vira enfeite. Faça o CI falhar em erro.",
      "Rodar o lint só na máquina de cada pessoa: sem o CI, cada um tem uma configuração e nada garante a regra.",
    ],
    autoteste: [
      {
        pergunta: "Por que o lint não substitui os testes?",
        resposta:
          "Porque ele não executa o código: acha padrões suspeitos, mas não sabe se o comportamento está certo. Os testes verificam o comportamento; o lint pega erros comuns mais cedo e mais barato.",
      },
      {
        pergunta: "Que regras pegam bugs reais no Node.js?",
        resposta:
          "Variável não definida (`no-undef`), import ou variável sem uso (`no-unused-vars`), promise solta (`@typescript-eslint/no-floating-promises`), `*Sync` no servidor (`n/no-sync`) e ciclos de importação (`import/no-cycle`).",
      },
    ],
  },
  en: {
    titulo: "Code linting",
    pergunta: "What is code linting and how is it applied in Node.js?",
    porqueEsteMetodo:
      "Linting sounds like jargon until you think of your editor’s spell checker. The analogy shows what it does, then comes the real mechanism (rules over the code’s syntax tree) and the point where the picture stops holding.",
    resposta30s:
      "**Linting** is **static analysis** of code: a tool reads the files **without running them** and flags likely bugs, bad practices and style inconsistencies. In Node.js the standard is **ESLint** (rules, plugins and configuration in `eslint.config.js`), often with **Prettier** handling the formatting. It runs in the editor, at pre-commit and in CI, but it **does not replace tests**.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of the spell checker in a text editor: as you write, it underlines misspelled words and suspicious sentences, without waiting for the reader to stumble on them later. You fix them on the spot, before sending the text. Linting does that for your code.",
        tecnico:
          "ESLint reads each file, builds a **syntax tree** (AST) and applies **rules**, each one looking for a pattern: a variable used without being declared (`no-undef`), an unused import or variable (`no-unused-vars`), a loose comparison (`eqeqeq`), a floating promise. Rules come from the core and from plugins (`eslint-plugin-n` for Node, `@typescript-eslint` for TypeScript), and in the configuration each one is switched on as an error, as a warning, or off. It all happens without running the program, which is why it is fast and catches the problem before any test.",
        limite:
          "The spell checker does not know whether the story makes sense, and a linter does not know whether the program does what it should: **it catches suspicious patterns, it does not prove correctness**. Too many rules turn into noise (the team starts ignoring the warnings), and some real bugs only show up with type information or at run time.",
      },
      {
        tipo: "tabela",
        titulo: "Who does what",
        colunas: ["Tool", "What it checks", "Example"],
        linhas: [
          [
            "Linter (ESLint)",
            "Suspicious patterns and bad practices in the code, without running it",
            "An undefined variable, an unused import, `==` instead of `===`",
          ],
          [
            "Formatter (Prettier)",
            "Only the format: spaces, line breaks, quotes; it does not analyze logic",
            "Rewriting the file in the same style every time, with no debate",
          ],
          [
            "Type checker (`tsc`)",
            "Type compatibility between uses and declarations",
            "Passing a `string` where a `number` is expected",
          ],
          ["Tests", "The behavior, by running the code", "The function returns the expected value for the given input"],
        ],
        nota: "Prettier does not replace the linter, nor the other way around. When the two coexist, a package such as `eslint-config-prettier` switches off the ESLint style rules that would clash with the formatter.",
      },
      {
        tipo: "fluxo",
        titulo: "Where linting runs",
        etapas: [
          "**In the editor**: the ESLint extension underlines the problem as you type",
          "**Before the commit**: `lint-staged`, triggered by a git hook (for example, through `husky`), lints only the changed files",
          "**In CI**: `npm run lint` fails the build on errors, which is what makes it a real gate",
          "**In review**: people are left with what the machine cannot see, such as design and business rules",
        ],
      },
      {
        tipo: "codigo",
        titulo: "A minimal configuration for Node.js",
        legenda: "JavaScript",
        codigo: `// eslint.config.js: ESLint "flat" format (check the documentation for your version)
import js from "@eslint/js";
import globals from "globals";
import n from "eslint-plugin-n";

export default [
  js.configs.recommended, // includes no-undef and no-unused-vars, which catch real bugs
  { languageOptions: { globals: globals.node } }, // knows process, Buffer, etc.
  {
    plugins: { n },
    rules: { "n/no-sync": "warn", eqeqeq: "error" }, // *Sync on a server and == become a warning and an error
  },
];`,
        nota: "To catch floating promises (a forgotten `await`), use the `@typescript-eslint/no-floating-promises` rule, which requires TypeScript with type information. For import cycles, there is `import/no-cycle` (see F75).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "How linting goes wrong",
        texto:
          "Too many rules (or very opinionated ones) generate noise, and the team starts ignoring the report. Disabling in bulk (`/* eslint-disable */` at the top of a file) hides exactly the bugs the rule exists to find; switch a rule off per line, with the reason. And a clean lint run does not mean correct code: it complements tests and review, it does not replace them.",
      },
    ],
    armadilhas: [
      "Thinking Prettier replaces ESLint: one formats, the other hunts for bugs and bad practices.",
      "Switching on too many rules at once: the report fills with warnings and nobody reads it any more. Start from the recommended set.",
      "Silencing rules in bulk or letting warnings pile up: linting becomes decoration. Make CI fail on errors.",
      "Running lint only on each person’s machine: without CI, everyone has their own configuration and nothing guarantees the rules.",
    ],
    autoteste: [
      {
        pergunta: "Why does linting not replace tests?",
        resposta:
          "Because it does not run the code: it finds suspicious patterns but cannot tell whether the behavior is right. Tests verify behavior; linting catches common mistakes earlier and more cheaply.",
      },
      {
        pergunta: "Which rules catch real bugs in Node.js?",
        resposta:
          "Undefined variables (`no-undef`), unused imports or variables (`no-unused-vars`), floating promises (`@typescript-eslint/no-floating-promises`), `*Sync` on a server (`n/no-sync`) and import cycles (`import/no-cycle`).",
      },
    ],
  },
};
