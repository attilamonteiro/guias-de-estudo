import type { Pergunta } from "../../tipos";

// Q22 · package.json
export const q22: Pergunta = {
  numero: 22,
  modulo: "turing-basicas",
  metodo: "feynman",
  pt: {
    titulo: "package.json",
    pergunta: "O que é o package.json?",
    porqueEsteMetodo:
      "O `package.json` é um arquivo concreto, cheio de campos. Uma analogia do dia a dia dá o mapa mental (a ficha do projeto); o exemplo e a tabela mostram onde cada coisa realmente fica.",
    resposta30s:
      "O `package.json` é o **manifesto** de um projeto Node.js, na raiz: um JSON com **nome e versão**, **scripts** (`npm run …`), ponto de entrada e **dependências**. As de execução ficam em `dependencies`, as só de desenvolvimento em `devDependencies`; o código baixado vai para a pasta `node_modules` e as versões exatas, para o `package-lock.json`. Nasce com `npm init` e é lido pelo npm e por outras ferramentas.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense na ficha técnica que acompanha um móvel desmontado: ela diz o nome do produto e a versão, lista as peças e os parafusos de que você precisa e traz o manual com os passos de montagem. Quem recebe a caixa não precisa adivinhar nada: com a ficha, qualquer pessoa monta o mesmo móvel.",
        tecnico:
          "O `package.json` faz esse papel para o projeto: identifica (`name`, `version`), diz como rodar (`scripts`, `main` ou `exports`, `type`), declara do que depende (`dependencies`, `devDependencies`) e em que ambiente funciona (`engines`). O `npm install` lê essas faixas de versão, resolve e baixa os pacotes em `node_modules` e registra as versões escolhidas no `package-lock.json`. Em bibliotecas publicadas, ele também define o que o consumidor enxerga (`exports`, `bin`, `files`).",
        limite:
          "A ficha do móvel é impressa e não muda; o `package.json` muda com o projeto e é alterado por comandos (`npm install pacote` o edita). Ele também não lista as peças exatas, e sim faixas aceitáveis (`^4.18.2`): duas pessoas sem lockfile podem baixar versões diferentes. E é JSON estrito: não aceita comentários nem vírgula sobrando no fim.",
      },
      {
        tipo: "codigo",
        titulo: "Um package.json típico de uma API",
        legenda: "package.json",
        codigo:
          '{\n  "name": "minha-api",\n  "version": "1.0.0",\n  "private": true,\n  "type": "module",\n  "main": "src/index.js",\n  "scripts": {\n    "start": "node src/index.js",\n    "test": "node --test",\n    "lint": "eslint ."\n  },\n  "dependencies": {\n    "express": "^4.18.2"\n  },\n  "devDependencies": {\n    "eslint": "^8.57.0"\n  },\n  "engines": {\n    "node": ">=20"\n  }\n}',
        nota: '`"type": "module"` faz os arquivos `.js` serem ES Modules; `"private": true` impede publicar o projeto no registro por engano. As versões do exemplo são ilustrativas.',
      },
      {
        tipo: "tabela",
        titulo: "Onde ficam as dependências",
        colunas: ["Onde", "O que guarda", "Observação"],
        linhas: [
          ["`dependencies`", "Pacotes de que o programa precisa para rodar", "Instalados também em produção"],
          [
            "`devDependencies`",
            "Ferramentas só de desenvolvimento: testes, lint, build",
            "Podem ser omitidas na instalação de produção (`npm ci --omit=dev`)",
          ],
          [
            "`peerDependencies`",
            "Pacotes que quem usa a biblioteca deve fornecer",
            "Comum em plugins e bibliotecas de interface",
          ],
          [
            "`optionalDependencies`",
            "Pacotes opcionais: se a instalação falhar, o npm segue em frente",
            "Útil para recursos específicos de uma plataforma",
          ],
          [
            "`node_modules`",
            "A pasta com o código dos pacotes instalados",
            "Gerada pela instalação; não se edita e não vai para o git (`.gitignore`)",
          ],
          [
            "`package-lock.json`",
            "A árvore exata resolvida: versões, origem e hashes de integridade",
            "Vai para o git; é o que torna a instalação reproduzível",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Faixa de versão no package.json, versão exata no lockfile",
        texto:
          "`^1.2.3` aceita qualquer versão de 1.2.3 até antes de 2.0.0 (atualizações compatíveis pelo versionamento semântico); `~1.2.3` aceita só correções, até antes de 1.3.0. O `package.json` guarda a **intenção** (faixa), o lockfile guarda o **resultado** (versão exata). Faça commit dos dois e, em CI e produção, use `npm ci`, que instala exatamente o que o lockfile descreve (veja Q12).",
      },
    ],
    armadilhas: [
      "Versionar a pasta `node_modules` ou esquecer de versionar o `package-lock.json`: o primeiro incha o repositório, o segundo permite builds diferentes em cada máquina.",
      "Colocar ferramenta de teste ou build em `dependencies` (infla a produção) ou pacote de runtime em `devDependencies` (o código quebra em produção quando elas são omitidas).",
      "Editar o JSON à mão e deixar comentário ou vírgula sobrando: o arquivo fica inválido e o npm recusa.",
      'Esquecer `"private": true` em uma aplicação e correr o risco de publicá-la no registro público.',
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre `dependencies` e `devDependencies`?",
        resposta:
          "`dependencies` são necessárias para o programa rodar; `devDependencies` só para desenvolver (testes, lint, build) e podem ser omitidas em produção com `--omit=dev`.",
      },
      {
        pergunta: "Por que existe o `package-lock.json` se o `package.json` já lista as dependências?",
        resposta:
          "O `package.json` guarda faixas de versão; o lockfile guarda a árvore exata que foi instalada, inclusive as dependências indiretas, para que todas as máquinas e o CI instalem a mesma coisa.",
      },
      {
        pergunta: "O que significa `^1.2.3`?",
        resposta:
          "Qualquer versão a partir de 1.2.3 e abaixo de 2.0.0, ou seja, atualizações compatíveis segundo o versionamento semântico.",
      },
    ],
  },
  en: {
    titulo: "package.json",
    pergunta: "What is package.json?",
    porqueEsteMetodo:
      "`package.json` is a concrete file full of fields. An everyday analogy gives the mental map (the project’s spec sheet); the example and the table show where each thing really lives.",
    resposta30s:
      "`package.json` is the **manifest** of a Node.js project, at its root: a JSON file with **name and version**, **scripts** (`npm run …`), entry point and **dependencies**. Runtime ones go in `dependencies`, development-only ones in `devDependencies`; the downloaded code goes in the `node_modules` folder and the exact versions in `package-lock.json`. It is born with `npm init` and read by npm and other tools.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of the spec sheet that comes with a flat-pack piece of furniture: it gives the product name and version, lists the parts and screws you need, and carries the manual with the assembly steps. Whoever gets the box does not have to guess anything: with the sheet, anyone builds the same piece.",
        tecnico:
          "`package.json` plays that role for the project: it identifies it (`name`, `version`), says how to run it (`scripts`, `main` or `exports`, `type`), declares what it depends on (`dependencies`, `devDependencies`) and where it works (`engines`). `npm install` reads those version ranges, resolves and downloads the packages into `node_modules` and records the chosen versions in `package-lock.json`. In published libraries it also defines what the consumer sees (`exports`, `bin`, `files`).",
        limite:
          "The furniture sheet is printed and never changes; `package.json` changes with the project and is edited by commands (`npm install package` modifies it). It also does not list exact parts, only acceptable ranges (`^4.18.2`): two people without a lockfile may download different versions. And it is strict JSON: no comments and no trailing comma.",
      },
      {
        tipo: "codigo",
        titulo: "A typical package.json for an API",
        legenda: "package.json",
        codigo:
          '{\n  "name": "my-api",\n  "version": "1.0.0",\n  "private": true,\n  "type": "module",\n  "main": "src/index.js",\n  "scripts": {\n    "start": "node src/index.js",\n    "test": "node --test",\n    "lint": "eslint ."\n  },\n  "dependencies": {\n    "express": "^4.18.2"\n  },\n  "devDependencies": {\n    "eslint": "^8.57.0"\n  },\n  "engines": {\n    "node": ">=20"\n  }\n}',
        nota: '`"type": "module"` makes `.js` files ES Modules; `"private": true` prevents accidentally publishing the project to the registry. The versions in the example are illustrative.',
      },
      {
        tipo: "tabela",
        titulo: "Where dependencies live",
        colunas: ["Where", "What it holds", "Note"],
        linhas: [
          ["`dependencies`", "Packages the program needs to run", "Also installed in production"],
          [
            "`devDependencies`",
            "Development-only tools: tests, lint, build",
            "Can be omitted in a production install (`npm ci --omit=dev`)",
          ],
          [
            "`peerDependencies`",
            "Packages that whoever uses the library must provide",
            "Common in plugins and UI libraries",
          ],
          [
            "`optionalDependencies`",
            "Optional packages: if installing one fails, npm carries on",
            "Useful for platform-specific features",
          ],
          [
            "`node_modules`",
            "The folder with the code of the installed packages",
            "Generated by the install; never edited and kept out of git (`.gitignore`)",
          ],
          [
            "`package-lock.json`",
            "The exact resolved tree: versions, origin and integrity hashes",
            "Goes into git; it makes installs reproducible",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A range in package.json, an exact version in the lockfile",
        texto:
          "`^1.2.3` accepts any version from 1.2.3 up to, but not including, 2.0.0 (compatible updates under semantic versioning); `~1.2.3` accepts only fixes, up to but not including 1.3.0. `package.json` stores the **intent** (a range), the lockfile stores the **result** (an exact version). Commit both and, in CI and production, use `npm ci`, which installs exactly what the lockfile describes (see Q12).",
      },
    ],
    armadilhas: [
      "Committing the `node_modules` folder or forgetting to commit `package-lock.json`: the first bloats the repository, the second allows different builds on each machine.",
      "Putting a test or build tool in `dependencies` (bloats production) or a runtime package in `devDependencies` (the code breaks in production when they are omitted).",
      "Editing the JSON by hand and leaving a comment or a trailing comma: the file becomes invalid and npm refuses it.",
      'Forgetting `"private": true` in an application and risking publishing it to the public registry.',
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `dependencies` and `devDependencies`?",
        resposta:
          "`dependencies` are needed for the program to run; `devDependencies` only for development (tests, lint, build) and can be omitted in production with `--omit=dev`.",
      },
      {
        pergunta: "Why does `package-lock.json` exist if `package.json` already lists the dependencies?",
        resposta:
          "`package.json` stores version ranges; the lockfile stores the exact tree that was installed, including indirect dependencies, so every machine and CI installs the same thing.",
      },
      {
        pergunta: "What does `^1.2.3` mean?",
        resposta:
          "Any version from 1.2.3 up to, but not including, 2.0.0, that is, compatible updates under semantic versioning.",
      },
    ],
  },
};
