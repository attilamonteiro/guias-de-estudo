import type { Pergunta } from "../../tipos";

// L90 · Prefixo node:
export const l090: Pergunta = {
  numero: 190,
  modulo: "linkedin-moderno",
  metodo: "feynman",
  pt: {
    titulo: "Prefixo node:",
    pergunta: "O que é o prefixo node:?",
    porqueEsteMetodo:
      "É um detalhe de sintaxe que fica claro com uma comparação do cotidiano (o crachá que diz de onde a pessoa é), seguida do que o Node.js faz de fato com o prefixo e do ponto em que a analogia deixa de valer.",
    resposta30s:
      "O prefixo **`node:`** é um esquema de endereço que diz ao Node.js: este módulo é **embutido**, não vem do npm. Escrever `node:fs` em vez de `fs` deixa a origem explícita, falha com erro em vez de cair num pacote de mesmo nome e é a única forma de acessar alguns módulos, como `node:test`; vale em CommonJS e em ES Modules. Já os **módulos embutidos** dispensam instalação, acompanham a versão do Node.js e não aumentam a sua cadeia de dependências.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense em um prédio comercial. Quem trabalha para o próprio prédio usa um crachá com o logotipo da administração; o prestador de fora entra como visitante. Se alguém só diz “sou da equipe de limpeza”, o porteiro precisa conferir se é do prédio ou de outra empresa com o mesmo nome; com o crachá, a dúvida some. O prefixo `node:` é esse crachá no nome do módulo.",
        tecnico:
          "`node:` é um esquema de endereço (como `https:` em uma URL) para os módulos embutidos no próprio Node.js: `node:fs`, `node:http`, `node:path`. Ao ver o prefixo, o carregador vai direto ao módulo do núcleo e nunca consulta `node_modules`. Funciona em `import` e em `require()`. Sem o prefixo, os nomes antigos (`fs`, `path`) continuam funcionando, porque os módulos do núcleo têm prioridade sobre os pacotes do npm.",
        limite:
          "A analogia pode sugerir que o crachá é segurança. O prefixo só deixa claro de onde o módulo vem; ele não torna mais seguro o código do seu projeto nem as suas dependências, e um `fs` sem prefixo continua sendo o módulo embutido.",
      },
      {
        tipo: "tabela",
        titulo: "Com e sem o prefixo",
        colunas: ["Especificador", "O que o Node.js faz", "Quando aparece"],
        linhas: [
          [
            "`fs` (sem prefixo)",
            "Resolve para o módulo embutido: os nomes do núcleo têm prioridade sobre `node_modules`",
            "Código antigo e muito código atual; continua funcionando",
          ],
          [
            "`node:fs`",
            "Vai direto ao módulo embutido e nunca consulta `node_modules`",
            "Recomendado em código novo: deixa a origem explícita",
          ],
          [
            "`node:test`",
            "Só existe com o prefixo; sem ele, o nome seria procurado como pacote do npm",
            "Módulos mais novos podem ser expostos só assim; confira a documentação",
          ],
          [
            "`node:outro-pacote` (nome que não é de módulo embutido)",
            "Lança erro: o prefixo nunca procura no npm",
            "Falha de forma clara em vez de usar sem querer um pacote de mesmo nome",
          ],
        ],
        nota: "O prefixo vale em `import`, em `require()` e no `import()` dinâmico.",
      },
      {
        tipo: "codigo",
        titulo: "Módulos embutidos e pacotes do npm lado a lado",
        legenda: "JavaScript",
        codigo: [
          'import { readFile } from "node:fs/promises";',
          'import { createServer } from "node:http";',
          'import { randomUUID } from "node:crypto";',
          'import { test } from "node:test"; // só existe com o prefixo',
          "",
          "// Pacote do npm: sem prefixo, procurado em node_modules",
          'import express from "express";',
          "",
          "// CommonJS: o mesmo prefixo",
          '// const { readFile } = require("node:fs/promises");',
        ].join("\n"),
        nota: "O `require()` está comentado porque, em um mesmo arquivo, vale um sistema de módulos só (veja L13).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Benefícios dos módulos embutidos",
        texto:
          "Os módulos embutidos (`fs`, `http`, `path`, `crypto`, `node:test`…) acompanham o Node.js: **não há nada para instalar nem atualizar à parte**, o código é mantido e testado pelo projeto Node.js, a documentação marca o grau de estabilidade de cada API e **você não amplia a cadeia de dependências** (menos superfície de ataque e menos pacotes para auditar). Com o prefixo, quem lê o código, as ferramentas de revisão e as de segurança veem de imediato o que é do núcleo e o que é de terceiros, o que reduz a confusão com pacotes do npm de nome igual ou parecido (typosquatting). Antes de instalar um pacote, veja se um módulo embutido já resolve (veja T19).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Embutido não quer dizer estável nem melhor",
        texto:
          "O prefixo não é uma camada de segurança: ele só torna explícito de onde vem o módulo. E “embutido” não significa estável: a documentação em nodejs.org indica o índice de estabilidade de cada módulo (alguns são experimentais, outros foram depreciados, como o `punycode`; veja T60), e a lista de módulos muda entre as versões do Node.js.",
      },
    ],
    armadilhas: [
      "Achar que `fs` sem prefixo é erro ou que o prefixo muda o comportamento: é o mesmo módulo; mudam a clareza da origem e a regra de resolução.",
      "Tentar instalar `fs`, `path` ou `http` pelo npm: esses módulos já vêm com o Node.js, e um pacote de mesmo nome é desnecessário e, no mínimo, suspeito.",
      "Confundir “embutido” com “estável” ou “melhor opção”: confira o índice de estabilidade na documentação (nodejs.org), pois há módulos experimentais e depreciados.",
      "Usar `node:` com um pacote do npm (`node:express`): o prefixo só resolve módulos do núcleo e lança erro para qualquer outro nome.",
    ],
    autoteste: [
      {
        pergunta: "Por que `node:test` só funciona com o prefixo?",
        resposta:
          "O motivo é evitar colisão com pacotes do npm de nome igual: expor o módulo só com o prefixo garante que `node:test` sempre significa o embutido. Sem o prefixo, o nome seria procurado em `node_modules`.",
      },
      {
        pergunta: 'Qual é a diferença prática entre `import fs from "fs"` e `import fs from "node:fs"`?',
        resposta:
          "Os dois entregam o módulo embutido. Com o prefixo, a origem fica explícita para quem lê e para as ferramentas, e o carregador nunca procura em `node_modules`; sem ele, funciona porque os módulos do núcleo têm prioridade.",
      },
    ],
  },
  en: {
    titulo: "The node: prefix",
    pergunta: "What is the node: prefix?",
    porqueEsteMetodo:
      "It is a syntax detail that becomes clear with an everyday comparison (the badge that says where someone works), followed by what Node.js actually does with the prefix and the point where the analogy stops holding.",
    resposta30s:
      "The **`node:`** prefix is an address scheme that tells Node.js: this module is **built in**, it does not come from npm. Writing `node:fs` instead of `fs` makes the origin explicit, fails with an error instead of landing on a package with the same name, and is the only way to reach some modules, such as `node:test`; it works in CommonJS and in ES Modules. And **built-in modules** need no installation, ship with your Node.js version and do not grow your dependency tree.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of an office building. The building’s own staff wear a badge with the management’s logo; outside contractors sign in as visitors. If someone just says “I’m from the cleaning team”, the doorman has to check whether they work for the building or for another company with the same name; with the badge, the doubt disappears. The `node:` prefix is that badge on the module name.",
        tecnico:
          "`node:` is an address scheme (like `https:` in a URL) for the modules built into Node.js itself: `node:fs`, `node:http`, `node:path`. When the loader sees the prefix, it goes straight to the core module and never looks in `node_modules`. It works in `import` and in `require()`. Without the prefix, the old names (`fs`, `path`) still work, because core modules take priority over npm packages.",
        limite:
          "The analogy can make the badge sound like security. The prefix only makes clear where the module comes from; it does not make your project’s code or its dependencies any safer, and a bare `fs` is still the built-in module.",
      },
      {
        tipo: "tabela",
        titulo: "With and without the prefix",
        colunas: ["Specifier", "What Node.js does", "When you see it"],
        linhas: [
          [
            "`fs` (no prefix)",
            "Resolves to the built-in module: core names take priority over `node_modules`",
            "Older code and plenty of current code; it keeps working",
          ],
          [
            "`node:fs`",
            "Goes straight to the built-in module and never consults `node_modules`",
            "Recommended in new code: it makes the origin explicit",
          ],
          [
            "`node:test`",
            "Exists only with the prefix; without it, the name would be looked up as an npm package",
            "Newer modules may be exposed only this way; check the documentation",
          ],
          [
            "`node:other-package` (a name that is not a built-in module)",
            "Throws an error: the prefix never searches npm",
            "Fails clearly instead of silently using a package with the same name",
          ],
        ],
        nota: "The prefix works in `import`, in `require()` and in dynamic `import()`.",
      },
      {
        tipo: "codigo",
        titulo: "Built-in modules and npm packages side by side",
        legenda: "JavaScript",
        codigo: [
          'import { readFile } from "node:fs/promises";',
          'import { createServer } from "node:http";',
          'import { randomUUID } from "node:crypto";',
          'import { test } from "node:test"; // exists only with the prefix',
          "",
          "// npm package: no prefix, looked up in node_modules",
          'import express from "express";',
          "",
          "// CommonJS: the same prefix",
          '// const { readFile } = require("node:fs/promises");',
        ].join("\n"),
        nota: "The `require()` is commented out because, within one file, a single module system applies (see L13).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Benefits of built-in modules",
        texto:
          "Built-in modules (`fs`, `http`, `path`, `crypto`, `node:test`…) ship with Node.js: **there is nothing to install or update separately**, the code is maintained and tested by the Node.js project, the documentation marks each API’s stability, and **you do not grow your dependency tree** (a smaller attack surface and fewer packages to audit). With the prefix, readers, review tools and security tools see at once what is core and what is third-party, which reduces confusion with npm packages that have the same or a similar name (typosquatting). Before installing a package, check whether a built-in module already does the job (see T19).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Built in does not mean stable or best",
        texto:
          "The prefix is not a security layer: it only makes explicit where the module comes from. And “built in” does not mean stable: the documentation at nodejs.org shows each module’s stability index (some are experimental, others have been deprecated, like `punycode`; see T60), and the list of modules changes between Node.js versions.",
      },
    ],
    armadilhas: [
      "Thinking a bare `fs` is wrong or that the prefix changes behavior: it is the same module; what changes is how clear the origin is and the resolution rule.",
      "Trying to install `fs`, `path` or `http` from npm: those modules already ship with Node.js, and a package with the same name is unnecessary and, at the very least, suspicious.",
      "Confusing “built in” with “stable” or “the best option”: check the stability index in the documentation (nodejs.org), because some modules are experimental or deprecated.",
      "Using `node:` with an npm package (`node:express`): the prefix only resolves core modules and throws an error for any other name.",
    ],
    autoteste: [
      {
        pergunta: "Why does `node:test` only work with the prefix?",
        resposta:
          "The reason is to avoid a collision with npm packages of the same name: exposing the module only with the prefix guarantees `node:test` always means the built-in one. Without the prefix, the name would be looked up in `node_modules`.",
      },
      {
        pergunta: 'What is the practical difference between `import fs from "fs"` and `import fs from "node:fs"`?',
        resposta:
          "Both give you the built-in module. With the prefix, the origin is explicit to readers and tools, and the loader never searches `node_modules`; without it, it works because core modules take priority.",
      },
    ],
  },
};
