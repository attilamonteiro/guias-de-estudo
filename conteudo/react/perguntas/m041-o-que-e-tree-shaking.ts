import type { Pergunta } from "../../tipos";

// M41 · O que é tree shaking
export const m041: Pergunta = {
  numero: 741,
  modulo: "medium-avancado",
  metodo: "feynman",
  pt: {
    titulo: "O que é tree shaking",
    pergunta: "O que é tree shaking no React?",
    porqueEsteMetodo:
      "Tree shaking é uma ideia simples com um nome estranho. Uma analogia do dia a dia ancora o conceito; depois o termo técnico e os limites da analogia mostram o que o bundler realmente faz.",
    resposta30s:
      "**Tree shaking** é a remoção, do bundle final, do código exportado que **ninguém importa**: como sacudir uma árvore para as folhas mortas caírem. Quem faz isso é o **bundler** em build de produção, não o React, e depende de **módulos ES** (`import` e `export` estáticos), de código sem **efeitos colaterais** na importação e, em pacotes, da marcação `sideEffects` no `package.json`. O resultado é um bundle menor e uma primeira carga mais rápida.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine uma árvore com folhas verdes e folhas secas. Você a sacode: as secas caem e só ficam as vivas. Um programa é parecido: você instala bibliotecas com dezenas de funções, mas usa duas. As outras são folhas secas, ocupando espaço sem servir a ninguém.",
        tecnico:
          "O bundler (Rollup, esbuild, webpack e semelhantes) lê o grafo de `import` e `export`, descobre quais exportações são usadas e marca as demais. Na etapa de minificação, o código marcado como não usado é descartado. Isso só funciona bem com **módulos ES**, porque seus `import` e `export` são estáticos: dá para saber, sem executar nada, quem usa o quê.",
        limite:
          "A árvore não decide nada, e o bundler também não adivinha: ele só remove o que consegue **provar** que não é usado e que não tem efeito colateral. CommonJS (`require`), acessos dinâmicos e módulos com efeito na importação ficam, por segurança. E o tree shaking não é do React: é uma otimização do bundler, que vale para qualquer JavaScript.",
      },
      {
        tipo: "tabela",
        titulo: "O que ajuda e o que atrapalha",
        colunas: ["Situação", "Efeito no bundle", "Por quê"],
        linhas: [
          [
            '`import { debounce } from "lodash-es"` (módulo ES, importação nomeada)',
            "Só o que é usado entra",
            "As exportações são estáticas, então o bundler sabe o que descartar",
          ],
          [
            '`import _ from "lodash"` (CommonJS)',
            "A biblioteca inteira tende a entrar",
            "`require` e `module.exports` são dinâmicos, e o bundler não consegue provar o que fica sem uso",
          ],
          [
            "`import * as util` com acesso estático (`util.soma`)",
            "Em geral funciona, mas prefira a importação nomeada",
            "Depende de o bundler enxergar o acesso; um acesso dinâmico (`util[nome]`) impede a remoção",
          ],
          [
            "Arquivo `index` que reexporta tudo (barrel)",
            "Pode trazer mais do que o necessário",
            "Se algum módulo reexportado tem efeito colateral, o bundler precisa mantê-lo; importar direto do arquivo evita o risco",
          ],
          [
            "Módulo que faz algo ao ser importado (altera `window`, registra evento, importa CSS)",
            "É mantido, mesmo que ninguém use as exportações",
            "Importar já é um efeito colateral; `sideEffects` no `package.json` diz o que é seguro remover",
          ],
          [
            "Build de desenvolvimento",
            "Em geral não remove",
            "A remoção acontece no build de produção, com minificação",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A mesma função, dois jeitos de importar",
        legenda: "JavaScript",
        codigo: [
          "// pior: o pacote CommonJS inteiro tende a entrar no bundle",
          'import _ from "lodash";',
          "_.debounce(salvar, 300);",
          "",
          "// melhor: versão em módulos ES com importação nomeada",
          'import { debounce } from "lodash-es";',
          "debounce(salvar, 300);",
        ].join("\n"),
        nota: "O ganho depende do bundler e da biblioteca; meça o resultado com um analisador de bundle em vez de supor.",
      },
      {
        tipo: "codigo",
        titulo: "Declarando os efeitos colaterais de um pacote",
        legenda: "package.json",
        codigo: [
          "{",
          '  "name": "minha-biblioteca",',
          '  "type": "module",',
          '  "sideEffects": ["*.css", "./src/polyfills.js"]',
          "}",
        ].join("\n"),
        nota: 'Com `"sideEffects": false`, você promete que nenhum arquivo do pacote faz algo ao ser importado. CSS e polyfills precisam ser listados, ou o bundler os apaga.',
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "É do bundler, e não é code splitting",
        texto:
          "O tree shaking **tira** do bundle o que ninguém usa. O code splitting (veja L106 e M23) **divide** o que sobra em partes carregadas sob demanda, com `React.lazy` e `import()`. São técnicas complementares. Em projetos criados com ferramentas como Vite ou Next.js, o build de produção já aplica o tree shaking; ao publicar uma biblioteca de componentes, entregue módulos ES e declare `sideEffects` corretamente, ou quem a usa não consegue sacudir a árvore.",
      },
    ],
    armadilhas: [
      "Achar que o tree shaking é um recurso do React ou que acontece em qualquer build: ele é do bundler e depende do build de produção.",
      'Importar a biblioteca inteira (`import _ from "lodash"`) ou acessá-la de forma dinâmica: o bundle carrega tudo.',
      "Marcar `sideEffects: false` em um pacote que importa CSS ou polyfills: o bundler apaga o que precisava ficar.",
      "Converter os módulos ES para CommonJS antes de o bundler os receber (por exemplo, uma configuração do Babel que transpila `import`): ele perde a visão estática dos imports.",
    ],
    autoteste: [
      {
        pergunta: "O que o tree shaking remove, e por que ele pede módulos ES?",
        resposta:
          "Remove do bundle as exportações que ninguém importa. Pede módulos ES porque `import` e `export` são estáticos: o bundler sabe, sem executar o código, quem usa o quê. Em CommonJS isso é dinâmico.",
      },
      {
        pergunta:
          'Por que `import { debounce } from "lodash-es"` tende a gerar um bundle menor que `import _ from "lodash"`?',
        resposta:
          "O `lodash-es` é distribuído como módulos ES e a importação é nomeada, então o bundler descarta o resto. O `lodash` é CommonJS e tende a entrar inteiro.",
      },
    ],
  },
  en: {
    titulo: "What tree shaking is",
    pergunta: "What is tree shaking in React?",
    porqueEsteMetodo:
      "Tree shaking is a simple idea with an odd name. An everyday analogy anchors the concept; then the technical term and the limits of the analogy show what the bundler really does.",
    resposta30s:
      "**Tree shaking** is the removal, from the final bundle, of exported code that **nobody imports**: like shaking a tree so the dead leaves fall. The one doing it is the **bundler** in a production build, not React, and it depends on **ES modules** (static `import` and `export`), on code with no **side effects** on import and, for packages, on the `sideEffects` marking in `package.json`. The result is a smaller bundle and a faster first load.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Picture a tree with green leaves and dry leaves. You shake it: the dry ones fall and only the living ones stay. A program is similar: you install libraries with dozens of functions but use two. The rest are dry leaves, taking up space and serving nobody.",
        tecnico:
          "The bundler (Rollup, esbuild, webpack and similar) reads the graph of `import` and `export`, finds out which exports are used and marks the rest. In the minification step, code marked as unused is discarded. This only works well with **ES modules**, because their `import` and `export` are static: you can tell, without running anything, who uses what.",
        limite:
          "The tree decides nothing, and the bundler does not guess either: it only removes what it can **prove** is unused and free of side effects. CommonJS (`require`), dynamic access and modules that do something on import stay, to be safe. And tree shaking is not a React feature: it is a bundler optimization that applies to any JavaScript.",
      },
      {
        tipo: "tabela",
        titulo: "What helps and what gets in the way",
        colunas: ["Situation", "Effect on the bundle", "Why"],
        linhas: [
          [
            '`import { debounce } from "lodash-es"` (ES module, named import)',
            "Only what is used goes in",
            "The exports are static, so the bundler knows what to discard",
          ],
          [
            '`import _ from "lodash"` (CommonJS)',
            "The whole library tends to go in",
            "`require` and `module.exports` are dynamic, and the bundler cannot prove what is unused",
          ],
          [
            "`import * as util` with static access (`util.sum`)",
            "Usually works, but prefer the named import",
            "It depends on the bundler seeing the access; dynamic access (`util[name]`) blocks removal",
          ],
          [
            "An `index` file that re-exports everything (barrel)",
            "May bring in more than needed",
            "If a re-exported module has a side effect, the bundler must keep it; importing straight from the file avoids the risk",
          ],
          [
            "A module that does something when imported (changes `window`, registers an event, imports CSS)",
            "It is kept, even if nobody uses its exports",
            "Importing is already a side effect; `sideEffects` in `package.json` says what is safe to remove",
          ],
          [
            "Development build",
            "Usually does not remove",
            "Removal happens in the production build, with minification",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The same function, two ways to import",
        legenda: "JavaScript",
        codigo: [
          "// worse: the whole CommonJS package tends to enter the bundle",
          'import _ from "lodash";',
          "_.debounce(save, 300);",
          "",
          "// better: the ES-modules version with a named import",
          'import { debounce } from "lodash-es";',
          "debounce(save, 300);",
        ].join("\n"),
        nota: "The gain depends on the bundler and the library; measure the result with a bundle analyzer instead of assuming.",
      },
      {
        tipo: "codigo",
        titulo: "Declaring a package’s side effects",
        legenda: "package.json",
        codigo: [
          "{",
          '  "name": "my-library",',
          '  "type": "module",',
          '  "sideEffects": ["*.css", "./src/polyfills.js"]',
          "}",
        ].join("\n"),
        nota: 'With `"sideEffects": false`, you promise that no file in the package does anything when imported. CSS and polyfills must be listed, or the bundler deletes them.',
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "It belongs to the bundler, and it is not code splitting",
        texto:
          "Tree shaking **removes** from the bundle what nobody uses. Code splitting (see L106 and M23) **divides** what is left into parts loaded on demand, with `React.lazy` and `import()`. The two techniques complement each other. In projects created with tools such as Vite or Next.js, the production build already applies tree shaking; when you publish a component library, ship ES modules and declare `sideEffects` correctly, or its users cannot shake the tree.",
      },
    ],
    armadilhas: [
      "Thinking tree shaking is a React feature or that it happens in any build: it belongs to the bundler and depends on the production build.",
      'Importing the whole library (`import _ from "lodash"`) or accessing it dynamically: the bundle carries everything.',
      "Marking `sideEffects: false` on a package that imports CSS or polyfills: the bundler deletes what had to stay.",
      "Converting ES modules to CommonJS before the bundler sees them (for example, a Babel setting that transpiles `import`): it loses the static view of the imports.",
    ],
    autoteste: [
      {
        pergunta: "What does tree shaking remove, and why does it require ES modules?",
        resposta:
          "It removes from the bundle the exports nobody imports. It requires ES modules because `import` and `export` are static: the bundler knows, without running the code, who uses what. In CommonJS that is dynamic.",
      },
      {
        pergunta:
          'Why does `import { debounce } from "lodash-es"` tend to produce a smaller bundle than `import _ from "lodash"`?',
        resposta:
          "`lodash-es` ships as ES modules and the import is named, so the bundler discards the rest. `lodash` is CommonJS and tends to go in whole.",
      },
    ],
  },
};
