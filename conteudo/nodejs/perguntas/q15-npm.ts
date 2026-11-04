import type { Pergunta } from "../../tipos";

// Q15 · NPM
export const q15: Pergunta = {
  numero: 15,
  modulo: "turing-basicas",
  metodo: "feynman",
  pt: {
    titulo: "NPM",
    pergunta: "O que é NPM?",
    porqueEsteMetodo:
      "“npm” tem três sentidos (o registro online, o programa de linha de comando e a empresa que o criou) e nasce de uma ideia simples. Uma analogia do cotidiano organiza os três e mostra onde ela deixa de valer, que é onde mora o risco.",
    resposta30s:
      "**npm** é o gerenciador de pacotes do Node.js. Ele é, ao mesmo tempo, um **programa de linha de comando** (`npm install`, `npm run`, `npm publish`) e o **registro** público online onde ficam os pacotes de JavaScript. Vem junto com a instalação do Node.js, baixa pacotes e suas dependências para `node_modules`, registra tudo no `package.json` e no lockfile e executa os scripts do projeto.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense numa grande loja de peças com catálogo e entrega. O **registro** é o estoque com o catálogo: cada peça tem nome, versão e uma ficha dizendo de quais outras peças depende. O **`npm` na linha de comando** é o atendente: você pede “quero a peça X, numa versão compatível com a 4”, ele consulta a ficha, busca também as peças de que X depende, entrega tudo na sua bancada (`node_modules`) e anota o pedido numa nota (`package.json` e lockfile). Para vender uma peça sua, você a publica no catálogo.",
        tecnico:
          "O registro é um servidor HTTP que guarda, para cada pacote, os metadados (versões, dependências, tags) e os arquivos empacotados (tarballs `.tgz`). A CLI lê o `package.json`, escolhe versões que satisfazem os intervalos de semver, baixa os tarballs, confere a integridade, extrai em `node_modules` e grava o resultado no `package-lock.json`. Além de instalar, executa scripts (`npm run`), publica pacotes, audita vulnerabilidades e roda binários de pacotes (`npx` / `npm exec`). O nome costuma ser lido como “Node Package Manager”, e a empresa npm, Inc. hoje faz parte do GitHub.",
        limite:
          "Na loja física você confia na peça que recebe. No npm qualquer pessoa pode publicar, e um pacote traz dependências de dependências que você nunca viu. A analogia não mostra o risco da cadeia de suprimentos: pacotes maliciosos, abandonados ou com nome parecido com o que você queria, e scripts de instalação que executam código na sua máquina.",
      },
      {
        tipo: "fluxo",
        titulo: "Do autor ao seu projeto",
        etapas: [
          "Quem mantém o pacote roda `npm publish`",
          "O registro guarda o tarball e os metadados da nova versão",
          "Você roda `npm install pacote` e a CLI consulta o registro",
          "Ela resolve a versão e as dependências, baixa e confere a integridade",
          "O resultado vai para `node_modules`, `package.json` e `package-lock.json`",
        ],
      },
      {
        tipo: "tabela",
        titulo: "Características importantes do registro",
        colunas: ["Característica", "O que significa", "Por que importa"],
        linhas: [
          [
            "Aberto à publicação",
            "Qualquer pessoa com conta publica um pacote",
            "Ecossistema enorme, mas você precisa avaliar a qualidade e a origem do que instala",
          ],
          [
            "Versionamento semântico (semver)",
            "Versões `MAJOR.MINOR.PATCH` e intervalos como `^4.18.0`",
            "Permite atualizar sem quebrar, se os autores respeitarem a convenção",
          ],
          [
            "Versões publicadas são imutáveis",
            "O conteúdo de uma versão publicada não pode ser reescrito; a correção sai como versão nova. A remoção de pacotes é limitada pela política do registro",
            "Instalações reproduzíveis: a mesma versão é sempre o mesmo código",
          ],
          [
            "Metadados e dist-tags",
            "Cada pacote lista versões, dependências, licença e tags como `latest` e `next`",
            "`npm install pacote` escolhe a `latest`; as tags permitem versões de teste",
          ],
          [
            "Escopos (`@organizacao/pacote`)",
            "Nomes agrupados sob um usuário ou uma organização",
            "Evita colisão de nomes e permite pacotes privados da empresa",
          ],
          [
            "Integridade e proveniência",
            "Cada tarball tem um hash de integridade registrado no lockfile; a publicação pode trazer uma declaração de proveniência (confira a documentação)",
            "Detecta arquivo adulterado e ajuda a rastrear de onde o pacote veio",
          ],
          [
            "Ferramentas de segurança",
            "`npm audit` consulta avisos conhecidos; contas podem usar autenticação em dois fatores",
            "Ajuda a achar dependências vulneráveis, mas não substitui revisão",
          ],
          [
            "Registros alternativos",
            "É possível apontar para um registro privado ou espelho (`.npmrc`)",
            "Empresas usam para pacotes internos e controle de acesso",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Comandos do dia a dia",
        legenda: "terminal",
        codigo: `npm init -y                    # cria o package.json
npm install express            # instala e registra em "dependencies"
npm install --save-dev vitest  # registra em "devDependencies"
npm run build                  # executa o script "build" do package.json
npx prettier --check .         # roda o binário de um pacote (local ou baixado na hora)
npm audit                      # avisa sobre vulnerabilidades conhecidas
npm publish                    # publica o seu pacote no registro`,
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "npm não é o Node.js",
        texto:
          "O npm é distribuído junto com o Node.js, mas são produtos distintos. O Yarn e o pnpm são outras ferramentas de linha de comando que leem o mesmo `package.json` e, por padrão, usam o mesmo registro. E o npm também serve ao front-end: muitos projetos de navegador instalam suas bibliotecas por ele.",
      },
    ],
    armadilhas: [
      "Confundir o npm com o Node.js, ou achar que ele só serve para código de servidor.",
      "Instalar pacotes sem avaliar: nome parecido com o desejado (typosquatting), mantenedor ausente, scripts de instalação.",
      "Ignorar ou editar à mão o lockfile: as instalações deixam de ser reproduzíveis.",
      "Usar `npm install -g` como jeito normal de adicionar bibliotecas: a biblioteca do projeto vai local (veja Q3).",
    ],
    autoteste: [
      {
        pergunta: "Quais são os três sentidos de “npm”?",
        resposta:
          "O registro público online de pacotes, o programa de linha de comando que instala e publica pacotes e roda scripts, e a empresa npm, Inc. (hoje parte do GitHub).",
      },
      {
        pergunta: "O que significa uma versão publicada ser imutável?",
        resposta:
          "Não é possível reescrever o conteúdo de uma versão já publicada; qualquer correção sai como uma versão nova. Por isso a mesma versão é sempre o mesmo código.",
      },
      {
        pergunta: "Para que serve o `npm audit`?",
        resposta:
          "Consulta avisos de vulnerabilidades conhecidas nas dependências do projeto. Ele aponta riscos, mas não substitui a revisão do que você instala.",
      },
    ],
  },
  en: {
    titulo: "NPM",
    pergunta: "What is NPM?",
    porqueEsteMetodo:
      "“npm” has three meanings (the online registry, the command-line program and the company that created it) and comes from a simple idea. An everyday analogy organizes all three and shows where it stops holding, which is where the risk lives.",
    resposta30s:
      "**npm** is the package manager of Node.js. It is both a **command-line program** (`npm install`, `npm run`, `npm publish`) and the public online **registry** where JavaScript packages live. It ships with the Node.js installation, downloads packages and their dependencies into `node_modules`, records everything in `package.json` and the lockfile, and runs the project’s scripts.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a big parts store with a catalog and delivery. The **registry** is the stock room with the catalog: every part has a name, a version and a sheet saying which other parts it depends on. The **`npm` command line** is the clerk: you ask for “part X, in a version compatible with 4”, it checks the sheet, fetches the parts X depends on too, delivers everything to your workbench (`node_modules`) and writes the order on a receipt (`package.json` and lockfile). To sell a part of your own, you publish it to the catalog.",
        tecnico:
          "The registry is an HTTP server that stores, for each package, the metadata (versions, dependencies, tags) and the packaged files (`.tgz` tarballs). The CLI reads `package.json`, picks versions that satisfy the semver ranges, downloads the tarballs, checks integrity, extracts them into `node_modules` and records the result in `package-lock.json`. Besides installing, it runs scripts (`npm run`), publishes packages, audits vulnerabilities and runs package binaries (`npx` / `npm exec`). The name is usually read as “Node Package Manager”, and the company npm, Inc. is now part of GitHub.",
        limite:
          "In a physical store you trust the part you receive. On npm anyone can publish, and a package brings dependencies of dependencies you have never seen. The analogy does not show the supply-chain risk: malicious or abandoned packages, names that look like the one you wanted, and install scripts that run code on your machine.",
      },
      {
        tipo: "fluxo",
        titulo: "From author to your project",
        etapas: [
          "The package maintainer runs `npm publish`",
          "The registry stores the tarball and the new version’s metadata",
          "You run `npm install package` and the CLI queries the registry",
          "It resolves the version and dependencies, downloads and checks integrity",
          "The result goes to `node_modules`, `package.json` and `package-lock.json`",
        ],
      },
      {
        tipo: "tabela",
        titulo: "Important characteristics of the registry",
        colunas: ["Characteristic", "What it means", "Why it matters"],
        linhas: [
          [
            "Open to publishing",
            "Anyone with an account can publish a package",
            "A huge ecosystem, but you must judge the quality and origin of what you install",
          ],
          [
            "Semantic versioning (semver)",
            "Versions as `MAJOR.MINOR.PATCH` and ranges such as `^4.18.0`",
            "Lets you update without breaking things, if authors follow the convention",
          ],
          [
            "Published versions are immutable",
            "The content of a published version cannot be rewritten; the fix ships as a new version. Removing packages is limited by registry policy",
            "Reproducible installs: the same version is always the same code",
          ],
          [
            "Metadata and dist-tags",
            "Each package lists versions, dependencies, license and tags such as `latest` and `next`",
            "`npm install package` picks `latest`; tags allow pre-release versions",
          ],
          [
            "Scopes (`@organization/package`)",
            "Names grouped under a user or an organization",
            "Avoids name collisions and allows private company packages",
          ],
          [
            "Integrity and provenance",
            "Each tarball has an integrity hash recorded in the lockfile; publishing can carry a provenance statement (check the docs)",
            "Detects tampered files and helps trace where a package came from",
          ],
          [
            "Security tooling",
            "`npm audit` checks known advisories; accounts can use two-factor authentication",
            "Helps spot vulnerable dependencies, but does not replace review",
          ],
          [
            "Alternative registries",
            "You can point to a private registry or mirror (`.npmrc`)",
            "Companies use them for internal packages and access control",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Everyday commands",
        legenda: "terminal",
        codigo: `npm init -y                    # creates package.json
npm install express            # installs and records in "dependencies"
npm install --save-dev vitest  # records in "devDependencies"
npm run build                  # runs the "build" script from package.json
npx prettier --check .         # runs a package binary (local or fetched on the fly)
npm audit                      # warns about known vulnerabilities
npm publish                    # publishes your package to the registry`,
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "npm is not Node.js",
        texto:
          "npm is distributed together with Node.js, but they are separate products. Yarn and pnpm are other command-line tools that read the same `package.json` and, by default, use the same registry. And npm also serves the front end: many browser projects install their libraries through it.",
      },
    ],
    armadilhas: [
      "Confusing npm with Node.js, or thinking it only serves server-side code.",
      "Installing packages without vetting them: names that look like the intended one (typosquatting), absent maintainers, install scripts.",
      "Ignoring or hand-editing the lockfile: installs stop being reproducible.",
      "Using `npm install -g` as the normal way to add libraries: a project’s library goes local (see Q3).",
    ],
    autoteste: [
      {
        pergunta: "What are the three meanings of “npm”?",
        resposta:
          "The public online package registry, the command-line program that installs and publishes packages and runs scripts, and the company npm, Inc. (now part of GitHub).",
      },
      {
        pergunta: "What does it mean for a published version to be immutable?",
        resposta:
          "The content of an already published version cannot be rewritten; any fix ships as a new version. That is why the same version is always the same code.",
      },
      {
        pergunta: "What is `npm audit` for?",
        resposta:
          "It checks the project’s dependencies against known vulnerability advisories. It points out risks but does not replace reviewing what you install.",
      },
    ],
  },
};
