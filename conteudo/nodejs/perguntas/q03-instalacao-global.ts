import type { Pergunta } from "../../tipos";

// Q03 · Instalação global
export const q03: Pergunta = {
  numero: 3,
  modulo: "turing-basicas",
  metodo: "compare",
  pt: {
    titulo: "Instalação global",
    pergunta: "Como funciona a instalação global de dependências no Node.js?",
    porqueEsteMetodo:
      "A pergunta é uma comparação disfarçada: instalar no projeto ou na máquina. Uma matriz mostra onde cada pacote fica, quem o enxerga e qual o risco, e a regra de decisão responde “quando usar qual”.",
    resposta30s:
      "Com `npm install -g pacote`, o npm instala o pacote numa pasta **global da máquina** (o prefixo global), e não no `node_modules` do projeto. Os **executáveis** do pacote ficam disponíveis no terminal, em qualquer pasta, mas o pacote **não** pode ser importado (`import`/`require`) pelos projetos e a versão não é registrada em `package.json`. Regra: **bibliotecas e ferramentas do projeto são locais**; só ferramentas de linha de comando de uso geral são globais. Para rodar uma ferramenta sem instalá-la, use `npx`.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspecto", "Local (padrão)", "Global (`-g`)"],
        linhas: [
          ["Comando", "`npm install pacote`", "`npm install -g pacote`"],
          [
            "Onde fica",
            "`node_modules` da pasta do projeto",
            "Pasta global do npm, fora dos projetos (veja `npm root -g`)",
          ],
          [
            "Quem usa",
            "O código do projeto, por `import` ou `require`, e os scripts do `package.json`",
            "Você, no terminal: só os executáveis ficam à mão; os projetos não conseguem importar o pacote",
          ],
          [
            "Versão",
            "Registrada em `package.json` e `package-lock.json`; cada projeto tem a sua",
            "Uma única versão por instalação do Node.js na máquina, fora do controle de versão",
          ],
          [
            "Reprodutibilidade",
            "Alta: outro computador ou o CI instalam as mesmas versões",
            "Baixa: “na minha máquina funciona”, com versões diferentes entre pessoas e servidores",
          ],
          [
            "Quando usar",
            "Bibliotecas do app (`express`) e ferramentas do projeto (`typescript`, `eslint`, testes)",
            "CLIs de uso geral, fora de qualquer projeto (por exemplo `npm-check-updates`, `http-server`, `pm2`)",
          ],
          [
            "Risco",
            "Ocupa disco em cada projeto, mas é isolado",
            "Versões divergentes, erro de permissão (`EACCES`) e ferramentas esquecidas e desatualizadas",
          ],
          [
            "Rodar sem instalar",
            "`npx ferramenta` e os scripts do `package.json` usam a cópia local do projeto",
            "Sem cópia local, `npx` baixa a ferramenta para um cache e a executa, sem instalá-la globalmente",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Comandos do dia a dia",
        legenda: "Terminal",
        codigo: `npm install -g typescript     # instala o comando tsc na máquina
npm ls -g --depth=0           # lista os pacotes globais
npm root -g                   # pasta onde os pacotes globais ficam
npm prefix -g                 # prefixo global do npm
npx tsc --version             # usa o tsc do projeto ou baixa um temporário
npm uninstall -g typescript   # remove o pacote global`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Se o código do projeto precisa do pacote para funcionar (`import`, `require`, build, testes), ele é dependência **local** e vai para o `package.json` (`dependencies` ou `devDependencies`). Só instale **globalmente** o que é um comando que você mesmo digita no terminal, em qualquer pasta. Na dúvida, instale local e rode com `npx` ou com um script do `package.json`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A pergunta provavelmente quer dizer `npm install -g`",
        texto:
          "O “nmp -Ig” do enunciado parece um erro de digitação de `npm install -g`. O `-g` (`--global`) é uma opção, e não um comando: ele acompanha `install`, `uninstall`, `update` ou `ls`. Instalar para a máquina toda é `npm install -g pacote`, e `npm uninstall -g pacote` remove.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Erro de permissão (`EACCES`)",
        texto:
          "Não resolva com `sudo npm install -g`: isso cria arquivos de administrador na sua pasta e amplia o risco de segurança. Prefira um gerenciador de versões do Node (como nvm ou fnm), que instala tudo na sua pasta de usuário, ou configure um prefixo global dentro do seu diretório. Confira o guia oficial do npm sobre permissões.",
      },
    ],
    armadilhas: [
      "Instalar globalmente uma biblioteca que o projeto importa: o `import`/`require` não a encontra, e o projeto não funciona em outra máquina.",
      "Depender de uma ferramenta global sem registrar a versão: o CI e os colegas usam versões diferentes e os resultados divergem.",
      "Usar `sudo npm install -g` para “resolver” erro de permissão.",
      "Esquecer que os globais existem: ferramentas antigas ficam desatualizadas sem ninguém notar (`npm ls -g` e `npm outdated -g` mostram).",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença prática entre `npm install express` e `npm install -g express`?",
        resposta:
          "A primeira grava em `node_modules` e no `package.json` do projeto, e o código pode importar o pacote. A segunda instala no prefixo global e só expõe executáveis: um `import` no projeto não o encontra. Para uma biblioteca como o Express, global é o erro.",
      },
      {
        pergunta: "Como usar uma ferramenta de linha de comando sem instalá-la globalmente?",
        resposta:
          "Com `npx ferramenta` (ou `npm exec`): usa a cópia local do projeto ou baixa uma temporária. O melhor é declará-la como `devDependency` e chamá-la por um script do `package.json`.",
      },
      {
        pergunta: "Como descobrir onde ficam os pacotes globais?",
        resposta:
          "`npm root -g` mostra a pasta dos pacotes, `npm prefix -g` o prefixo global e `npm ls -g --depth=0` lista o que está instalado.",
      },
    ],
  },
  en: {
    titulo: "Global installation",
    pergunta: "How does global installation of dependencies work in Node.js?",
    porqueEsteMetodo:
      "The question is a comparison in disguise: install in the project or on the machine. A matrix shows where each package lives, who can see it and what the risk is, and the decision rule answers “when to use which”.",
    resposta30s:
      "With `npm install -g package`, npm installs the package into a **machine-wide** folder (the global prefix) instead of the project’s `node_modules`. The package’s **executables** become available in the terminal from any folder, but projects **cannot** import it (`import`/`require`) and its version is not recorded in `package.json`. Rule: **a project’s libraries and tools are local**; only general-purpose command-line tools are global. To run a tool without installing it, use `npx`.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspect", "Local (default)", "Global (`-g`)"],
        linhas: [
          ["Command", "`npm install package`", "`npm install -g package`"],
          [
            "Where it lives",
            "`node_modules` in the project folder",
            "npm’s global folder, outside any project (see `npm root -g`)",
          ],
          [
            "Who uses it",
            "The project’s code, via `import` or `require`, and the `package.json` scripts",
            "You, in the terminal: only the executables are at hand; projects cannot import the package",
          ],
          [
            "Version",
            "Recorded in `package.json` and `package-lock.json`; each project has its own",
            "A single version per Node.js installation on the machine, outside version control",
          ],
          [
            "Reproducibility",
            "High: another computer or CI installs the same versions",
            "Low: “works on my machine”, with different versions across people and servers",
          ],
          [
            "When to use",
            "App libraries (`express`) and project tools (`typescript`, `eslint`, tests)",
            "General-purpose CLIs used outside any project (for example `npm-check-updates`, `http-server`, `pm2`)",
          ],
          [
            "Risk",
            "Uses disk space in every project, but stays isolated",
            "Diverging versions, permission errors (`EACCES`) and forgotten, outdated tools",
          ],
          [
            "Run without installing",
            "`npx tool` and the `package.json` scripts use the project’s local copy",
            "With no local copy, `npx` downloads the tool to a cache and runs it, without installing it globally",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Everyday commands",
        legenda: "Terminal",
        codigo: `npm install -g typescript     # installs the tsc command on the machine
npm ls -g --depth=0           # lists the global packages
npm root -g                   # folder where global packages live
npm prefix -g                 # npm's global prefix
npx tsc --version             # uses the project's tsc or downloads a temporary one
npm uninstall -g typescript   # removes the global package`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "If the project’s code needs the package to work (`import`, `require`, build, tests), it is a **local** dependency and goes into `package.json` (`dependencies` or `devDependencies`). Install **globally** only what is a command you type yourself in the terminal, from any folder. When in doubt, install locally and run it with `npx` or a `package.json` script.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The question probably means `npm install -g`",
        texto:
          "The “nmp -Ig” in the prompt looks like a typo for `npm install -g`. `-g` (`--global`) is an option, not a command: it goes along with `install`, `uninstall`, `update` or `ls`. Installing for the whole machine is `npm install -g package`, and `npm uninstall -g package` removes it.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Permission error (`EACCES`)",
        texto:
          "Do not fix it with `sudo npm install -g`: it creates administrator-owned files in your folder and widens the security risk. Prefer a Node version manager (such as nvm or fnm), which installs everything under your user folder, or configure a global prefix inside your own directory. Check npm’s official guide on permissions.",
      },
    ],
    armadilhas: [
      "Globally installing a library the project imports: `import`/`require` cannot find it, and the project fails on another machine.",
      "Depending on a global tool without recording its version: CI and teammates use different versions and results diverge.",
      "Using `sudo npm install -g` to “fix” a permission error.",
      "Forgetting that globals exist: old tools quietly go stale (`npm ls -g` and `npm outdated -g` show them).",
    ],
    autoteste: [
      {
        pergunta: "What is the practical difference between `npm install express` and `npm install -g express`?",
        resposta:
          "The first writes to the project’s `node_modules` and `package.json`, and the code can import the package. The second installs into the global prefix and only exposes executables: an `import` in the project will not find it. For a library like Express, global is the mistake.",
      },
      {
        pergunta: "How do you use a command-line tool without installing it globally?",
        resposta:
          "With `npx tool` (or `npm exec`): it uses the project’s local copy or downloads a temporary one. Better still, declare it as a `devDependency` and call it from a `package.json` script.",
      },
      {
        pergunta: "How do you find where global packages live?",
        resposta:
          "`npm root -g` shows the packages folder, `npm prefix -g` the global prefix and `npm ls -g --depth=0` lists what is installed.",
      },
    ],
  },
};
