import type { Pergunta } from "../../tipos";

// Q12 · npm install
export const q12: Pergunta = {
  numero: 12,
  modulo: "turing-basicas",
  metodo: "trace",
  pt: {
    titulo: "npm install",
    pergunta: "O que faz o comando npm install?",
    porqueEsteMetodo:
      "O `npm install` é uma sequência de etapas que costuma acontecer fora da sua vista. Seguir uma única execução, da leitura do `package.json` até a gravação em disco, e depois o caminho em que ela falha, mostra o que o comando faz e como diagnosticá-lo.",
    resposta30s:
      "O `npm install` **instala as dependências do projeto**: lê o `package.json` e o **lockfile** (`package-lock.json`), resolve as versões compatíveis, **baixa** os pacotes do registro do npm (ou do cache), grava tudo em `node_modules`, roda os **scripts de instalação** e atualiza o lockfile. Com um nome (`npm install express`), instala aquele pacote e o registra em `dependencies`: é assim que se instala uma biblioteca. Em CI, prefira `npm ci`, que instala exatamente o que o lockfile manda.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma execução de `npm install express`",
        etapas: [
          "Você roda `npm install express` na pasta do projeto, onde está o `package.json`",
          "O npm lê o `package.json` (faixas de versão como `^1.2.3`) e o `package-lock.json` (versões exatas já resolvidas)",
          "Monta a árvore de dependências: escolhe, para o `express` e para as dependências dele, versões que respeitam as faixas (semver)",
          "Consulta o registro (por padrão, o registro público do npm), baixa o que não está no cache local e confere a integridade (hash) de cada pacote",
          "Extrai tudo em `node_modules` e cria os atalhos dos executáveis em `node_modules/.bin`",
          "Executa os scripts de ciclo de vida que existirem (`install` e `postinstall` dos pacotes, `prepare` do projeto)",
          "Grava `express` em `dependencies` no `package.json` e atualiza o `package-lock.json`",
        ],
        nota: "Rodar só `npm install`, sem nome, faz as etapas 2 a 6 para tudo o que já está declarado: é o que se faz depois de clonar um repositório.",
      },
      {
        tipo: "passos",
        titulo: "Agora o caminho em que algo dá errado",
        passos: [
          {
            titulo: "Rede ou registro fora do ar",
            texto:
              "Erros como `ETIMEDOUT`, `ENOTFOUND` ou `ECONNRESET`. Confira a conexão, o proxy e o registro configurado (`npm config get registry`) e tente de novo.",
          },
          {
            titulo: "Conflito de versões",
            texto:
              "`ERESOLVE unable to resolve dependency tree`: dois pacotes pedem versões incompatíveis, muitas vezes por uma “peer dependency”. Alinhe as versões. `--legacy-peer-deps` e `--force` contornam, mas escondem o problema.",
          },
          {
            titulo: "Permissão negada",
            texto: "`EACCES` costuma aparecer em instalação global. Não use `sudo` (veja Q3).",
          },
          {
            titulo: "Script de instalação falha",
            texto:
              "Pacotes com código nativo precisam compilar (`node-gyp` e ferramentas de compilação). Leia o log inteiro; uma versão do Node.js fora do que o pacote declara em `engines` (aviso `EBADENGINE`) também causa isso.",
          },
          {
            titulo: "`node_modules` estragado",
            texto:
              "Comportamento estranho depois de trocar de ramo ou de versão do Node.js: apague `node_modules` e rode `npm ci`.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "`npm install` e suas variações",
        colunas: ["Comando", "O que faz", "Quando usar"],
        linhas: [
          [
            "`npm install`",
            "Instala tudo o que o `package.json` declara, respeitando o lockfile; só o atualiza se o `package.json` pedir algo que ele não satisfaz",
            "Depois de clonar o projeto e no dia a dia",
          ],
          [
            "`npm install pacote`",
            "Instala o pacote e o registra em `dependencies`",
            "Nova biblioteca usada pelo programa em execução",
          ],
          [
            "`npm install --save-dev pacote` (ou `-D`)",
            "Instala e registra em `devDependencies`",
            "Ferramentas só de desenvolvimento: testes, linter, build",
          ],
          [
            "`npm install pacote@versão`",
            "Instala uma versão ou etiqueta específica (`pacote@1.2.3`, `pacote@latest`)",
            "Fixar ou testar uma versão",
          ],
          [
            "`npm install -g pacote`",
            "Instala globalmente, fora do projeto (veja Q3)",
            "Ferramentas de linha de comando de uso geral",
          ],
          [
            "`npm ci`",
            "Apaga `node_modules` e instala exatamente o lockfile; falha se ele e o `package.json` divergem; não altera o lockfile",
            "CI, builds e deploys reprodutíveis",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Instalar uma biblioteca, do zero",
        legenda: "Terminal",
        codigo: `npm init -y                      # cria o package.json (uma vez por projeto)
npm install express              # biblioteca de produção -> dependencies
npm install --save-dev vitest    # ferramenta de desenvolvimento -> devDependencies
npm ci                           # instalação limpa e exata, a partir do lockfile`,
        nota: 'Depois, use a biblioteca no código: `import express from "express"` (ES Modules) ou `const express = require("express")` (CommonJS).',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Instalar executa código de terceiros",
        texto:
          "Pacotes podem declarar scripts que rodam durante a instalação. Instale só o que você conhece, mantenha o lockfile no repositório, rode `npm audit` e, em ambientes sensíveis, considere `--ignore-scripts` (alguns pacotes legítimos dependem desses scripts e deixam de funcionar por completo sem eles).",
      },
    ],
    armadilhas: [
      "Usar `npm install` no CI: o resultado pode mudar entre execuções; use `npm ci` com o lockfile versionado.",
      "Não versionar (ou apagar) o `package-lock.json`: cada pessoa passa a instalar versões diferentes.",
      "Resolver todo `ERESOLVE` com `--force` ou `--legacy-peer-deps`: o conflito continua lá, só escondido.",
      "Versionar a pasta `node_modules`: ela é gerada pelo comando e pertence ao `.gitignore`.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre `npm install` e `npm ci`?",
        resposta:
          "O `npm install` respeita o lockfile mas pode atualizá-lo e reaproveita o que já está em `node_modules`. O `npm ci` apaga `node_modules`, instala exatamente o lockfile, falha se ele divergir do `package.json` e não o altera: é o certo para CI e deploy.",
      },
      {
        pergunta: "Onde o `npm install --save-dev` registra o pacote e por quê?",
        resposta:
          "Em `devDependencies`: ferramentas necessárias só para desenvolver, testar e construir, que ficam de fora de uma instalação de produção (`npm install --omit=dev`).",
      },
      {
        pergunta: "O que significa `^1.2.3` no `package.json`?",
        resposta:
          "Qualquer versão compatível a partir da 1.2.3 e abaixo da 2.0.0 (mesma versão maior). `~1.2.3` aceita só correções (1.2.x). O lockfile é o que fixa a versão realmente instalada.",
      },
    ],
  },
  en: {
    titulo: "npm install",
    pergunta: "What does the npm install command do?",
    porqueEsteMetodo:
      "`npm install` is a sequence of steps that usually happens out of sight. Following a single run, from reading `package.json` to writing to disk, and then the path where it fails, shows what the command does and how to diagnose it.",
    resposta30s:
      "`npm install` **installs the project’s dependencies**: it reads `package.json` and the **lockfile** (`package-lock.json`), resolves compatible versions, **downloads** packages from the npm registry (or the cache), writes everything to `node_modules`, runs the **install scripts** and updates the lockfile. With a name (`npm install express`), it installs that package and records it under `dependencies`: that is how you install a library. In CI, prefer `npm ci`, which installs exactly what the lockfile says.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One run of `npm install express`",
        etapas: [
          "You run `npm install express` in the project folder, where `package.json` lives",
          "npm reads `package.json` (version ranges such as `^1.2.3`) and `package-lock.json` (exact versions already resolved)",
          "It builds the dependency tree: for `express` and its dependencies, it picks versions that respect the ranges (semver)",
          "It queries the registry (by default, the public npm registry), downloads what is not in the local cache and checks each package’s integrity (hash)",
          "It extracts everything into `node_modules` and creates the executable shortcuts in `node_modules/.bin`",
          "It runs any lifecycle scripts that exist (`install` and `postinstall` of packages, `prepare` of the project)",
          "It writes `express` under `dependencies` in `package.json` and updates `package-lock.json`",
        ],
        nota: "Running plain `npm install`, with no name, performs steps 2 to 6 for everything already declared: it is what you do after cloning a repository.",
      },
      {
        tipo: "passos",
        titulo: "Now the path where something goes wrong",
        passos: [
          {
            titulo: "Network or registry down",
            texto:
              "Errors such as `ETIMEDOUT`, `ENOTFOUND` or `ECONNRESET`. Check the connection, the proxy and the configured registry (`npm config get registry`) and try again.",
          },
          {
            titulo: "Version conflict",
            texto:
              "`ERESOLVE unable to resolve dependency tree`: two packages ask for incompatible versions, often through a “peer dependency”. Align the versions. `--legacy-peer-deps` and `--force` work around it, but hide the problem.",
          },
          {
            titulo: "Permission denied",
            texto: "`EACCES` usually shows up on global installs. Do not use `sudo` (see Q3).",
          },
          {
            titulo: "Install script fails",
            texto:
              "Packages with native code must compile (`node-gyp` and build tools). Read the whole log; a Node.js version outside what the package declares in `engines` (the `EBADENGINE` warning) can also cause it.",
          },
          {
            titulo: "Broken `node_modules`",
            texto: "Odd behavior after switching branches or Node.js versions: delete `node_modules` and run `npm ci`.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "`npm install` and its variations",
        colunas: ["Command", "What it does", "When to use"],
        linhas: [
          [
            "`npm install`",
            "Installs everything `package.json` declares, respecting the lockfile; it only updates the lockfile if `package.json` asks for something it does not satisfy",
            "After cloning the project and day to day",
          ],
          [
            "`npm install package`",
            "Installs the package and records it under `dependencies`",
            "A new library used by the running program",
          ],
          [
            "`npm install --save-dev package` (or `-D`)",
            "Installs and records under `devDependencies`",
            "Development-only tools: tests, linter, build",
          ],
          [
            "`npm install package@version`",
            "Installs a specific version or tag (`package@1.2.3`, `package@latest`)",
            "Pinning or trying a version",
          ],
          [
            "`npm install -g package`",
            "Installs globally, outside the project (see Q3)",
            "General-purpose command-line tools",
          ],
          [
            "`npm ci`",
            "Deletes `node_modules` and installs exactly the lockfile; fails if it and `package.json` disagree; does not change the lockfile",
            "CI, reproducible builds and deploys",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Installing a library, from scratch",
        legenda: "Terminal",
        codigo: `npm init -y                      # creates package.json (once per project)
npm install express              # production library -> dependencies
npm install --save-dev vitest    # development tool -> devDependencies
npm ci                           # clean, exact install from the lockfile`,
        nota: 'Then use the library in code: `import express from "express"` (ES Modules) or `const express = require("express")` (CommonJS).',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Installing runs third-party code",
        texto:
          "Packages can declare scripts that run during installation. Install only what you know, keep the lockfile in the repository, run `npm audit` and, in sensitive environments, consider `--ignore-scripts` (some legitimate packages depend on those scripts and will not fully work without them).",
      },
    ],
    armadilhas: [
      "Using `npm install` in CI: the result can change between runs; use `npm ci` with a committed lockfile.",
      "Not committing (or deleting) `package-lock.json`: each person ends up installing different versions.",
      "Fixing every `ERESOLVE` with `--force` or `--legacy-peer-deps`: the conflict is still there, just hidden.",
      "Committing the `node_modules` folder: the command generates it, and it belongs in `.gitignore`.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `npm install` and `npm ci`?",
        resposta:
          "`npm install` respects the lockfile but may update it and reuses what is already in `node_modules`. `npm ci` deletes `node_modules`, installs exactly the lockfile, fails if it disagrees with `package.json` and does not change it: it is the right choice for CI and deploys.",
      },
      {
        pergunta: "Where does `npm install --save-dev` record the package, and why?",
        resposta:
          "Under `devDependencies`: tools needed only to develop, test and build, which are left out of a production install (`npm install --omit=dev`).",
      },
      {
        pergunta: "What does `^1.2.3` mean in `package.json`?",
        resposta:
          "Any compatible version from 1.2.3 up to, but not including, 2.0.0 (same major version). `~1.2.3` accepts only fixes (1.2.x). The lockfile is what pins the version actually installed.",
      },
    ],
  },
};
