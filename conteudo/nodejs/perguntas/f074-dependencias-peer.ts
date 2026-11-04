import type { Pergunta } from "../../tipos";

// F74 · Dependências peer
export const f074: Pergunta = {
  numero: 474,
  modulo: "founditgulf-avancadas",
  metodo: "compare",
  pt: {
    titulo: "Dependências peer",
    pergunta: "O que são peer dependencies no npm?",
    porqueEsteMetodo:
      "As formas de declarar dependência no `package.json` parecem iguais e se comportam de modo diferente. A matriz mostra quem instala cada uma, e a regra de decisão dá o critério para escolher.",
    resposta30s:
      "`peerDependencies` declaram o que o **pacote hospedeiro deve fornecer** para que haja **uma única instância compartilhada** (um plugin de ESLint, uma biblioteca de componentes que usa o React). Diferem de `dependencies` (instaladas junto, para uso em execução) e de `devDependencies` (só para desenvolver). Versões recentes do npm **instalam as peers automaticamente** e **falham com `ERESOLVE`** se houver conflito.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Os campos de dependência",
        colunas: ["Campo", "O que declara", "Quem instala", "Exemplo"],
        linhas: [
          [
            "`dependencies`",
            "O que o seu código precisa para rodar",
            "O npm instala junto com o pacote, na árvore de quem o consome",
            "`express`, `pg`",
          ],
          [
            "`devDependencies`",
            "O que só serve para desenvolver (testes, lint, build)",
            "Instaladas ao trabalhar no projeto; ignoradas quando outro projeto instala o seu pacote como dependência",
            "`vitest`, `eslint`",
          ],
          [
            "`peerDependencies`",
            "O que o projeto hospedeiro deve fornecer, numa versão compatível",
            "O projeto que usa o seu pacote; versões recentes do npm instalam automaticamente se faltar",
            "`react` numa biblioteca de componentes; `eslint` num plugin de ESLint",
          ],
          [
            "`optionalDependencies`",
            "Algo que melhora o pacote, mas não é indispensável",
            "O npm tenta instalar; se falhar, segue em frente e o seu código precisa lidar com a ausência",
            "`fsevents` (só no macOS)",
          ],
        ],
        nota: "Uma peer pode ser opcional: marque-a em `peerDependenciesMeta` com `optional: true`. Outros gerenciadores de pacotes tratam as peers de modo diferente (alguns só avisam); confira a documentação do que você usa.",
      },
      {
        tipo: "codigo",
        titulo: "Um middleware que se encaixa no Express do projeto",
        legenda: "package.json",
        codigo: `{
  "name": "meu-middleware-express",
  "dependencies": { "debug": "^4.0.0" },
  "peerDependencies": { "express": ">=4", "pino": ">=8" },
  "peerDependenciesMeta": { "pino": { "optional": true } },
  "devDependencies": { "express": "^4.0.0" }
}`,
        nota: "O `express` aparece como peer (o projeto fornece o dele) e também em `devDependencies`, só para você testar o pacote localmente. O `pino` é uma peer opcional: o pacote funciona sem ele.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Pergunte quem deve ser dono da instância. O seu código **usa o pacote por dentro** e ninguém mais precisa vê-lo: `dependencies`. **Só você precisa** dele para desenvolver: `devDependencies`. O seu pacote **se encaixa em outro** (framework, ferramenta hospedeira) e os dois precisam enxergar **a mesma instância**: `peerDependencies`. Se uma segunda cópia quebraria algo (os hooks do React, o ESLint que carrega o plugin), é peer.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "ERESOLVE e os atalhos",
        texto:
          "Quando as peers de pacotes diferentes não cabem na mesma árvore, o npm interrompe a instalação com `ERESOLVE`. `--legacy-peer-deps` e `--force` fazem o npm seguir mesmo assim, mas escondem o conflito e podem deixar uma versão incompatível instalada. O campo `overrides` do `package.json` do projeto raiz força uma versão; use com cuidado e documente o motivo. Em pacotes que você publica, evite intervalos estreitos nas peers (algo como `>=4` costuma bastar): eles geram conflitos desnecessários para quem consome. Veja T22.",
      },
    ],
    armadilhas: [
      "Pôr o framework em `dependencies` de um plugin: quem consome ganha uma segunda cópia e o plugin conversa com a instância errada (por exemplo, os hooks do React quebram).",
      "Declarar uma peer e não instalá-la também em `devDependencies` para testar localmente.",
      "Resolver todo `ERESOLVE` com `--legacy-peer-deps` ou `--force`: o conflito continua lá, só mudou de lugar.",
      "Fixar a peer numa versão exata ou numa faixa estreita: obriga quem consome a atualizar tudo junto.",
    ],
    autoteste: [
      {
        pergunta: "Por que uma biblioteca de componentes React declara o React como peer e não como dependency?",
        resposta:
          "Porque o app e a biblioteca precisam compartilhar a mesma instância do React. Com o React em `dependencies`, poderia haver duas cópias, e recursos como os hooks, que dependem de estado interno da instância, quebrariam.",
      },
      {
        pergunta: "O que fazer quando o npm devolve `ERESOLVE`?",
        resposta:
          "Ler o conflito para ver quais pacotes pedem versões incompatíveis e atualizar ou trocar um deles; só em último caso usar `overrides` (documentado) ou `--legacy-peer-deps`, sabendo que isso esconde o problema.",
      },
    ],
  },
  en: {
    titulo: "Peer dependencies",
    pergunta: "What are peer dependencies in npm?",
    porqueEsteMetodo:
      "The ways of declaring a dependency in `package.json` look alike and behave differently. The matrix shows who installs each one, and the decision rule gives the criterion for choosing.",
    resposta30s:
      "`peerDependencies` declare what the **host package must provide** so that there is **one shared instance** (an ESLint plugin, a component library that uses React). They differ from `dependencies` (installed along with the package, for use at run time) and from `devDependencies` (only for development). Recent npm versions **install peers automatically** and **fail with `ERESOLVE`** when there is a conflict.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The dependency fields",
        colunas: ["Field", "What it declares", "Who installs it", "Example"],
        linhas: [
          [
            "`dependencies`",
            "What your code needs in order to run",
            "npm installs it along with the package, in the consumer’s tree",
            "`express`, `pg`",
          ],
          [
            "`devDependencies`",
            "What is only for development (tests, lint, build)",
            "Installed when working on the project; ignored when another project installs your package as a dependency",
            "`vitest`, `eslint`",
          ],
          [
            "`peerDependencies`",
            "What the host project must provide, in a compatible version",
            "The project that uses your package; recent npm versions install it automatically if it is missing",
            "`react` in a component library; `eslint` in an ESLint plugin",
          ],
          [
            "`optionalDependencies`",
            "Something that improves the package but is not essential",
            "npm tries to install it; if that fails, it carries on and your code has to cope with its absence",
            "`fsevents` (macOS only)",
          ],
        ],
        nota: "A peer can be optional: mark it in `peerDependenciesMeta` with `optional: true`. Other package managers treat peers differently (some only warn); check the documentation of the one you use.",
      },
      {
        tipo: "codigo",
        titulo: "A middleware that plugs into the project’s Express",
        legenda: "package.json",
        codigo: `{
  "name": "my-express-middleware",
  "dependencies": { "debug": "^4.0.0" },
  "peerDependencies": { "express": ">=4", "pino": ">=8" },
  "peerDependenciesMeta": { "pino": { "optional": true } },
  "devDependencies": { "express": "^4.0.0" }
}`,
        nota: "`express` appears as a peer (the project provides its own) and also in `devDependencies`, only so you can test the package locally. `pino` is an optional peer: the package works without it.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Ask who should own the instance. Your code **uses the package internally** and nobody else needs to see it: `dependencies`. **Only you need** it to develop: `devDependencies`. Your package **plugs into another** (a framework, a host tool) and both must see **the same instance**: `peerDependencies`. If a second copy would break something (React hooks, the ESLint that loads the plugin), it is a peer.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "ERESOLVE and the shortcuts",
        texto:
          "When the peers of different packages do not fit in the same tree, npm stops the install with `ERESOLVE`. `--legacy-peer-deps` and `--force` make npm carry on anyway, but they hide the conflict and may leave an incompatible version installed. The `overrides` field in the root project’s `package.json` forces a version; use it with care and document the reason. In packages you publish, avoid narrow ranges on peers (something like `>=4` usually suffices): they cause needless conflicts for consumers. See T22.",
      },
    ],
    armadilhas: [
      "Putting the framework in a plugin’s `dependencies`: the consumer gets a second copy and the plugin talks to the wrong instance (React hooks break, for example).",
      "Declaring a peer and not also installing it in `devDependencies` to test locally.",
      "Fixing every `ERESOLVE` with `--legacy-peer-deps` or `--force`: the conflict is still there, just moved.",
      "Pinning the peer to an exact version or a narrow range: it forces consumers to update everything together.",
    ],
    autoteste: [
      {
        pergunta: "Why does a React component library declare React as a peer and not as a dependency?",
        resposta:
          "Because the app and the library must share the same React instance. With React in `dependencies`, there could be two copies, and features such as hooks, which rely on the instance’s internal state, would break.",
      },
      {
        pergunta: "What do you do when npm returns `ERESOLVE`?",
        resposta:
          "Read the conflict to see which packages ask for incompatible versions and update or replace one of them; only as a last resort use `overrides` (documented) or `--legacy-peer-deps`, knowing that it hides the problem.",
      },
    ],
  },
};
