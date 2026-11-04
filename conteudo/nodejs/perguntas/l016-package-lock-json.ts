import type { Pergunta } from "../../tipos";

// L16 · package-lock.json
export const l016: Pergunta = {
  numero: 116,
  modulo: "linkedin-fundamentos",
  metodo: "feynman",
  pt: {
    titulo: "package-lock.json",
    pergunta: "O que é o package-lock.json?",
    porqueEsteMetodo:
      "O lockfile é um arquivo gerado que quase ninguém abre. Uma analogia de lista de compras e nota fiscal dá o mapa mental, e a comparação entre `npm install` e `npm ci` mostra o uso prático.",
    resposta30s:
      "O `package-lock.json` é gerado pelo npm e **trava a árvore exata** de dependências instalada: cada pacote, inclusive os indiretos, com **versão**, **origem** e **hash de integridade**. Assim, todas as máquinas e o CI instalam a mesma coisa (**instalação reproduzível**), enquanto o `package.json` guarda só faixas de versão (veja T22). Faça **commit** dele e use `npm ci` em CI e produção.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "O `package.json` é a lista de compras: “farinha de trigo, de qualquer marca confiável”. O `package-lock.json` é a nota fiscal da compra que de fato foi feita: marca, lote e peso exatos de cada item. Para repetir exatamente o mesmo bolo, você usa a nota, não a lista.",
        tecnico:
          "Ao instalar, o npm resolve cada faixa do `package.json` para uma versão concreta e registra no lockfile a árvore inteira, com as dependências das dependências: `version`, `resolved` (a URL do pacote) e `integrity` (um hash). Nas instalações seguintes, ele segue o lockfile em vez de resolver de novo, e se o hash do pacote baixado não bater, a instalação falha.",
        limite:
          "A nota fiscal não muda depois de impressa; o lockfile muda sempre que você instala, remove ou atualiza um pacote. E ele só vale para o seu projeto: o `npm publish` não inclui o `package-lock.json` (para isso existe o `npm-shrinkwrap.json`), então quem instala a sua biblioteca resolve as próprias versões.",
      },
      {
        tipo: "codigo",
        titulo: "Uma entrada do lockfile",
        legenda: "package-lock.json (trecho)",
        codigo:
          '"node_modules/express": {\n  "version": "4.18.2",\n  "resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz",\n  "integrity": "sha512-<hash>",\n  "dependencies": {\n    "accepts": "~1.3.8"\n  }\n}',
        nota: "Trecho ilustrativo, com versões e hash de exemplo. Existe uma entrada assim para cada pacote da árvore, também para os indiretos.",
      },
      {
        tipo: "tabela",
        titulo: "npm install x npm ci",
        colunas: ["Aspecto", "`npm install`", "`npm ci`"],
        linhas: [
          [
            "Uso do lockfile",
            "Respeita o lockfile e o atualiza quando o `package.json` mudou",
            "Instala exatamente o que o lockfile descreve",
          ],
          ["`package.json` e lockfile divergem", "Ajusta e reescreve o lockfile", "Falha, sem alterar nada"],
          ["Sem lockfile", "Gera um", "Falha"],
          ["`node_modules` existente", "Reaproveita e ajusta", "Apaga e instala do zero"],
          ["Escreve no lockfile", "Pode escrever", "Nunca"],
          ["Uso típico", "No dia a dia: adicionar e atualizar pacotes", "CI, build de imagem e produção"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Commit, `npm ci` e conflitos de merge",
        texto:
          "**Versione o lockfile** e use `npm ci` onde o resultado precisa ser reproduzível. Num conflito de merge, não edite o JSON linha a linha: resolva o `package.json`, volte o lockfile para uma das versões e rode `npm install` para o npm reconciliar a árvore. Evite apagar o lockfile e gerar tudo de novo, porque isso reavalia todas as faixas e pode subir versões sem querer. Atualizar pacotes passa a ser um ato deliberado (`npm update`, veja L19).",
      },
    ],
    armadilhas: [
      "Não versionar o lockfile, ou colocá-lo no `.gitignore`: cada máquina e cada CI resolvem versões diferentes.",
      "Usar `npm install` no CI: ele pode reescrever o lockfile e esconde divergências; prefira `npm ci`.",
      "Resolver um conflito de merge à mão, no meio do JSON, ou apagar o lockfile e regerar: a árvore fica inconsistente ou sobem versões que ninguém pediu.",
      "Manter mais de um lockfile no mesmo projeto (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`): cada gerenciador usa o seu, e eles divergem.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre `npm ci` e `npm install`?",
        resposta:
          "O `npm ci` instala exatamente o que o lockfile descreve, apaga o `node_modules` antes, nunca escreve no lockfile e falha se ele e o `package.json` divergirem. O `npm install` respeita o lockfile, mas o ajusta e reescreve quando necessário.",
      },
      {
        pergunta: "Por que o lockfile guarda um hash de integridade?",
        resposta:
          "Para o npm conferir que o pacote baixado é exatamente o que foi registrado. Se o conteúdo mudou ou foi adulterado, o hash não bate e a instalação falha.",
      },
    ],
  },
  en: {
    titulo: "package-lock.json",
    pergunta: "What is package-lock.json?",
    porqueEsteMetodo:
      "The lockfile is a generated file that almost nobody opens. A shopping-list-and-receipt analogy gives the mental map, and the comparison between `npm install` and `npm ci` shows the practical use.",
    resposta30s:
      "`package-lock.json` is generated by npm and **locks the exact tree** of installed dependencies: every package, indirect ones included, with its **version**, **origin** and **integrity hash**. That way every machine and CI installs the same thing (a **reproducible install**), while `package.json` only holds version ranges (see T22). **Commit** it and use `npm ci` in CI and production.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "`package.json` is the shopping list: “wheat flour, any reliable brand”. `package-lock.json` is the receipt for the purchase that was actually made: the exact brand, batch and weight of every item. To bake exactly the same cake again, you use the receipt, not the list.",
        tecnico:
          "When it installs, npm resolves each range in `package.json` to a concrete version and records the whole tree in the lockfile, dependencies of dependencies included: `version`, `resolved` (the package URL) and `integrity` (a hash). On later installs it follows the lockfile instead of resolving again, and if the downloaded package’s hash does not match, the install fails.",
        limite:
          "A receipt never changes after it is printed; the lockfile changes whenever you install, remove or update a package. And it only applies to your project: `npm publish` does not include `package-lock.json` (that is what `npm-shrinkwrap.json` is for), so whoever installs your library resolves their own versions.",
      },
      {
        tipo: "codigo",
        titulo: "One lockfile entry",
        legenda: "package-lock.json (excerpt)",
        codigo:
          '"node_modules/express": {\n  "version": "4.18.2",\n  "resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz",\n  "integrity": "sha512-<hash>",\n  "dependencies": {\n    "accepts": "~1.3.8"\n  }\n}',
        nota: "Illustrative excerpt, with sample versions and hash. There is an entry like this for every package in the tree, indirect ones too.",
      },
      {
        tipo: "tabela",
        titulo: "npm install vs npm ci",
        colunas: ["Aspect", "`npm install`", "`npm ci`"],
        linhas: [
          [
            "Use of the lockfile",
            "Respects the lockfile and updates it when `package.json` changed",
            "Installs exactly what the lockfile describes",
          ],
          ["`package.json` and lockfile disagree", "Adjusts and rewrites the lockfile", "Fails, changing nothing"],
          ["No lockfile", "Creates one", "Fails"],
          ["Existing `node_modules`", "Reuses and adjusts it", "Deletes it and installs from scratch"],
          ["Writes to the lockfile", "May write", "Never"],
          ["Typical use", "Day to day: adding and updating packages", "CI, image builds and production"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Commit, `npm ci` and merge conflicts",
        texto:
          "**Commit the lockfile** and use `npm ci` wherever the result must be reproducible. On a merge conflict, do not edit the JSON line by line: resolve `package.json`, restore the lockfile to one of the versions and run `npm install` so npm reconciles the tree. Avoid deleting the lockfile and regenerating everything, because that re-evaluates every range and may bump versions by accident. Updating packages becomes a deliberate act (`npm update`, see L19).",
      },
    ],
    armadilhas: [
      "Not committing the lockfile, or listing it in `.gitignore`: every machine and every CI run resolves different versions.",
      "Using `npm install` in CI: it may rewrite the lockfile and hides mismatches; prefer `npm ci`.",
      "Resolving a merge conflict by hand in the middle of the JSON, or deleting the lockfile and regenerating it: the tree ends up inconsistent or versions nobody asked for get bumped.",
      "Keeping more than one lockfile in the same project (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`): each package manager uses its own, and they drift apart.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `npm ci` and `npm install`?",
        resposta:
          "`npm ci` installs exactly what the lockfile describes, deletes `node_modules` first, never writes to the lockfile and fails if it and `package.json` disagree. `npm install` respects the lockfile but adjusts and rewrites it when needed.",
      },
      {
        pergunta: "Why does the lockfile store an integrity hash?",
        resposta:
          "So npm can check that the downloaded package is exactly what was recorded. If the content changed or was tampered with, the hash does not match and the install fails.",
      },
    ],
  },
};
