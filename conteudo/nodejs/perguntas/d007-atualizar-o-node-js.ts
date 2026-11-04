import type { Pergunta } from "../../tipos";

// D07 · Atualizar o Node.js
export const d007: Pergunta = {
  numero: 307,
  modulo: "devinterview-fundamentos",
  metodo: "playbook",
  pt: {
    titulo: "Atualizar o Node.js",
    pergunta: "Como você atualiza o Node.js para a versão mais recente?",
    porqueEsteMetodo:
      "Atualizar o Node.js é uma sequência com pontos de verificação: o que está instalado, para onde ir, o que quebra e como provar que deu certo. Um playbook dá a ordem e o sinal de acerto de cada passo, inclusive para manter várias versões na mesma máquina.",
    resposta30s:
      "Veja o que você tem (`node -v`) e escolha o alvo em nodejs.org: em produção, a linha **LTS**. Atualize pelo **instalador oficial**, pelo **gerenciador de pacotes do sistema** ou, no desenvolvimento, por um **gerenciador de versões** (`nvm`, `fnm` ou Volta), que também mantém **várias versões na mesma máquina** e troca por projeto. Teste na versão nova, recompile as dependências nativas e fixe a versão (`.nvmrc`, `engines`, imagem Docker).",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: atualizar sem surpresas",
        passos: [
          {
            titulo: "Veja o que você tem e de onde veio",
            texto:
              "Rode `node -v`, `npm -v` e `command -v node` (no Windows, `where node`). O caminho mostra se o Node.js veio de um instalador, do gerenciador de pacotes do sistema ou de um gerenciador de versões, e o método de atualização depende disso. Sinal de acerto: você sabe qual ferramenta é dona da instalação.",
          },
          {
            titulo: "Escolha o alvo e leia o que muda",
            texto:
              "Para produção, a linha **LTS** (veja T54); a **Current** serve para experimentar. Em nodejs.org, leia as notas de lançamento e as mudanças incompatíveis entre a sua versão e a nova. Saltar várias linhas de uma vez acumula quebras. Sinal: uma lista curta de recursos removidos ou alterados que o seu código realmente usa.",
          },
          {
            titulo: "Atualize pelo método que combina com o caso",
            texto:
              "Instalador oficial: baixe e instale por cima. Gerenciador de pacotes do sistema (apt, dnf, Homebrew, winget…): a versão disponível depende do repositório, que pode estar atrás. Gerenciador de versões (`nvm`, `fnm`, Volta): instala a versão nova ao lado da antiga e você troca; é o melhor para desenvolvimento. `nvm-windows` é outro projeto, com comandos próprios; confira a documentação de cada ferramenta.",
          },
          {
            titulo: "Várias versões e uma versão por projeto",
            texto:
              "Com um gerenciador de versões, cada versão fica isolada e você troca por terminal (`nvm use`). Registre a versão do projeto em `.nvmrc` (o `fnm` também lê `.node-version`; o Volta fixa no próprio `package.json`) e declare o intervalo aceito em `engines`. O npm avisa quando um pacote declara `engines` incompatíveis com o Node.js em uso, e `engine-strict` transforma o aviso em recusa. Sinal: entrar na pasta e rodar `node -v` mostra a versão do projeto.",
          },
          {
            titulo: "Reconstrua o que depende da versão",
            texto:
              "Módulos nativos (compilados, como `bcrypt` e `better-sqlite3`) precisam ser recompilados: `npm rebuild` ou reinstalar com `npm ci`. Sinal de que faltou: o erro dizendo que o módulo foi compilado para outra versão do Node.js. Pacotes **globais** ficam atrelados à versão em gerenciadores de versões; reinstale os que você usa (veja com `npm ls -g`).",
          },
          {
            titulo: "Prove antes de promover",
            texto:
              "Rode a suíte e o build na versão nova, de preferência num CI com **matriz de versões** (a atual e a nova) e `npm ci`. Depois alinhe todos os ambientes: imagem Docker com a versão na tag (`FROM node:<versão>`, sem `latest`), CI, staging e produção. Faça deploy gradual e guarde a imagem anterior para voltar. Sinal: mesma versão em todo lugar e testes verdes nas duas versões.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Atualizar e fixar a versão com o nvm",
        legenda: "Terminal",
        codigo: [
          "node -v && npm -v          # o que está instalado agora",
          "nvm install --lts          # instala a LTS mais recente",
          "nvm use --lts              # troca nesta sessão",
          "nvm alias default 'lts/*'  # padrão dos próximos terminais",
          'echo "<versão>" > .nvmrc   # fixa a versão do projeto',
          "nvm use                    # lê o .nvmrc ao entrar na pasta",
          "npm ci && npm rebuild      # reinstala e recompila os nativos",
        ].join("\n"),
        nota: "O `nvm` é para macOS e Linux; no Windows, `nvm-windows`, `fnm` ou Volta têm comandos próprios. Veja também D86 sobre várias versões.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "**LTS em produção, a mesma versão em todos os ambientes e atualização testada antes.** A versão do Node.js é uma decisão registrada no repositório (`.nvmrc`, `engines`, imagem Docker), não um acidente da máquina. Confira o calendário de suporte em nodejs.org e atualize antes de a sua linha sair do suporte.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não troque o Node.js direto no servidor",
        texto:
          "Atualizar a sua máquina não muda o runtime dos servidores, e trocar a versão em produção sem teste é descobrir incompatibilidade na frente do cliente. Mude o `Dockerfile` ou a definição do ambiente, valide no CI e faça o deploy normal, com plano de volta.",
      },
    ],
    armadilhas: [
      "Atualizar só a sua máquina e esquecer CI, imagem e produção: “funciona aqui” com versões diferentes.",
      "Usar `latest` ou outra tag móvel no Dockerfile: o build de hoje difere do de ontem e a atualização acontece sem ninguém decidir.",
      "Esquecer de recompilar módulos nativos e de reinstalar os pacotes globais depois de trocar a versão.",
      "Confundir ferramentas: `nvm`, `nvm-windows`, `fnm` e Volta têm comandos e arquivos de versão diferentes, e a Current não é para produção.",
    ],
    autoteste: [
      {
        pergunta: "Como manter versões diferentes do Node.js em projetos diferentes na mesma máquina?",
        resposta:
          "Com um gerenciador de versões (`nvm`, `fnm`, Volta): cada versão fica instalada em separado, e a versão de cada projeto é registrada em `.nvmrc` ou `.node-version` (ou no `package.json`, no caso do Volta), para a troca ser automática ou de um comando.",
      },
      {
        pergunta: "O que conferir depois de trocar a versão do Node.js num projeto com módulos nativos?",
        resposta:
          "Recompilar ou reinstalar as dependências (`npm rebuild`, `npm ci`), rodar os testes e o build na versão nova, reinstalar os pacotes globais e alinhar a imagem Docker, o CI e a produção.",
      },
    ],
  },
  en: {
    titulo: "Updating Node.js",
    pergunta: "How do you update Node.js to the latest version?",
    porqueEsteMetodo:
      "Updating Node.js is a sequence with checkpoints: what is installed, where to go, what breaks and how to prove it worked. A playbook gives the order and the success signal of each step, including how to keep several versions on the same machine.",
    resposta30s:
      "Check what you have (`node -v`) and pick the target on nodejs.org: in production, the **LTS** line. Update with the **official installer**, the **system package manager** or, for development, a **version manager** (`nvm`, `fnm` or Volta), which also keeps **several versions on the same machine** and switches per project. Test on the new version, rebuild native dependencies and pin the version (`.nvmrc`, `engines`, Docker image).",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: update without surprises",
        passos: [
          {
            titulo: "See what you have and where it came from",
            texto:
              "Run `node -v`, `npm -v` and `command -v node` (on Windows, `where node`). The path shows whether Node.js came from an installer, the system package manager or a version manager, and the update method depends on that. Success signal: you know which tool owns the installation.",
          },
          {
            titulo: "Pick the target and read what changes",
            texto:
              "For production, the **LTS** line (see T54); **Current** is for experimenting. On nodejs.org, read the release notes and the breaking changes between your version and the new one. Jumping across several lines at once piles up breakage. Signal: a short list of removed or changed features that your code really uses.",
          },
          {
            titulo: "Update with the method that fits the case",
            texto:
              "Official installer: download and install over the old one. System package manager (apt, dnf, Homebrew, winget…): the available version depends on the repository, which may lag behind. Version manager (`nvm`, `fnm`, Volta): installs the new version next to the old one and you switch; best for development. `nvm-windows` is a separate project with its own commands; check each tool’s documentation.",
          },
          {
            titulo: "Several versions and one version per project",
            texto:
              "With a version manager, each version stays isolated and you switch per terminal (`nvm use`). Record the project’s version in `.nvmrc` (`fnm` also reads `.node-version`; Volta pins it in `package.json` itself) and declare the accepted range in `engines`. npm warns when a package declares `engines` incompatible with the Node.js in use, and `engine-strict` turns the warning into a refusal. Signal: entering the folder and running `node -v` shows the project’s version.",
          },
          {
            titulo: "Rebuild what depends on the version",
            texto:
              "Native modules (compiled ones, such as `bcrypt` and `better-sqlite3`) must be rebuilt: `npm rebuild` or reinstall with `npm ci`. Sign that you forgot: the error saying the module was compiled for a different Node.js version. **Global** packages are tied to the version in version managers; reinstall the ones you use (list them with `npm ls -g`).",
          },
          {
            titulo: "Prove it before promoting",
            texto:
              "Run the suite and the build on the new version, preferably in a CI with a **version matrix** (current and new) and `npm ci`. Then align every environment: Docker image with the version in the tag (`FROM node:<version>`, not `latest`), CI, staging and production. Deploy gradually and keep the previous image to roll back. Signal: the same version everywhere and green tests on both versions.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Updating and pinning the version with nvm",
        legenda: "Terminal",
        codigo: [
          "node -v && npm -v          # what is installed right now",
          "nvm install --lts          # installs the latest LTS",
          "nvm use --lts              # switches in this session",
          "nvm alias default 'lts/*'  # default for new terminals",
          'echo "<version>" > .nvmrc  # pins the project version',
          "nvm use                    # reads .nvmrc when you enter the folder",
          "npm ci && npm rebuild      # reinstalls and rebuilds native modules",
        ].join("\n"),
        nota: "`nvm` is for macOS and Linux; on Windows, `nvm-windows`, `fnm` or Volta have their own commands. See also D86 on multiple versions.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "**LTS in production, the same version in every environment and an update tested first.** The Node.js version is a decision recorded in the repository (`.nvmrc`, `engines`, Docker image), not an accident of one machine. Check the support calendar on nodejs.org and update before your line leaves support.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Do not swap Node.js directly on the server",
        texto:
          "Updating your own machine does not change the servers’ runtime, and changing the version in production without testing means discovering incompatibility in front of the customer. Change the `Dockerfile` or the environment definition, validate in CI and deploy the normal way, with a rollback plan.",
      },
    ],
    armadilhas: [
      "Updating only your own machine and forgetting CI, image and production: “works here” with different versions.",
      "Using `latest` or another moving tag in the Dockerfile: today’s build differs from yesterday’s and the update happens without anyone deciding.",
      "Forgetting to rebuild native modules and reinstall global packages after switching versions.",
      "Mixing up tools: `nvm`, `nvm-windows`, `fnm` and Volta have different commands and version files, and Current is not for production.",
    ],
    autoteste: [
      {
        pergunta: "How do you keep different Node.js versions for different projects on the same machine?",
        resposta:
          "With a version manager (`nvm`, `fnm`, Volta): each version is installed separately, and each project’s version is recorded in `.nvmrc` or `.node-version` (or in `package.json`, for Volta), so switching is automatic or a single command.",
      },
      {
        pergunta: "What should you check after switching the Node.js version in a project with native modules?",
        resposta:
          "Rebuild or reinstall the dependencies (`npm rebuild`, `npm ci`), run the tests and the build on the new version, reinstall the global packages and align the Docker image, CI and production.",
      },
    ],
  },
};
