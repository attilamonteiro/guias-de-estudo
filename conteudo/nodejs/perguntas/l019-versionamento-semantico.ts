import type { Pergunta } from "../../tipos";

// L19 · Versionamento semântico
export const l019: Pergunta = {
  numero: 119,
  modulo: "linkedin-fundamentos",
  metodo: "feynman",
  pt: {
    titulo: "Versionamento semântico",
    pergunta: "O que é versionamento semântico?",
    porqueEsteMetodo:
      "O versionamento semântico é um contrato curto sobre o significado de três números. Uma analogia concreta fixa o papel de cada um, e a tabela de faixas liga a regra ao `package.json` que você escreve todos os dias.",
    resposta30s:
      "O **versionamento semântico (SemVer)** numera as versões como **MAJOR.MINOR.PATCH**: o PATCH sobe em correções compatíveis, o MINOR em funcionalidades novas compatíveis e o MAJOR em mudanças que **quebram** a compatibilidade. Quem usa o pacote lê o número e avalia o risco de atualizar. No npm, `^1.2.3` aceita MINOR e PATCH novos, e `~1.2.3` aceita só PATCH.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense no padrão das tomadas de uma casa. Consertar uma mola solta dentro da tomada não muda nada para os seus aparelhos (PATCH). Acrescentar uma entrada USB ao lado dos furos mantém todos os plugues antigos funcionando e ainda oferece algo novo (MINOR). Trocar o formato dos furos obriga a trocar ou adaptar cada plugue (MAJOR).",
        tecnico:
          "Na versão `2.5.1`, o MAJOR é 2, o MINOR é 5 e o PATCH é 1. A “tomada” é a API pública do pacote. O PATCH corrige defeitos sem mudar a API; o MINOR acrescenta sem remover nem alterar o que já existia; o MAJOR remove, renomeia ou muda comportamento documentado, e zera os números menores (`3.0.0`). Um sufixo marca o pré-lançamento (`3.0.0-beta.1`), que vem antes da versão final e que o npm só instala se você pedir.",
        limite:
          "A tomada segue um padrão físico que se pode medir; o SemVer é uma **promessa humana**. Nada impede um autor de publicar uma quebra num PATCH, e o que conta como “quebra” depende de qual é a API pública. Além disso, versões `0.x` são de desenvolvimento inicial: qualquer coisa pode mudar a qualquer momento.",
      },
      {
        tipo: "tabela",
        titulo: "Faixas de versão no package.json",
        colunas: ["Faixa", "Versões aceitas", "Observação"],
        linhas: [
          ["`1.2.3`", "Só a `1.2.3`", "Versão exata: previsível, mas sem correções automáticas"],
          ["`~1.2.3`", "De `1.2.3` até antes de `1.3.0`", "Só PATCH"],
          ["`^1.2.3`", "De `1.2.3` até antes de `2.0.0`", "PATCH e MINOR; é o que o `npm install` grava por padrão"],
          ["`^0.2.3`", "De `0.2.3` até antes de `0.3.0`", "Em `0.x`, o `^` trava o MINOR: cada `0.y` pode quebrar"],
          ["`^0.0.3`", "Só a `0.0.3`", "Em `0.0.x`, cada versão pode quebrar"],
          ["`1.2.3-beta.1`", "Só esse pré-lançamento", "Pré-lançamentos só entram quando você os pede"],
          ["`>=1.2.3`", "Qualquer versão maior, inclusive MAJOR novo", "Arriscado: evite"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Os comandos do dia a dia",
        legenda: "Terminal",
        codigo: [
          "npm outdated                      # Current, Wanted (dentro da faixa) e Latest",
          "npm update                        # sobe até onde a faixa permite e regrava o lockfile",
          "npm install express@latest        # atravessa um MAJOR de propósito",
          "npm install --save-exact pacote   # grava a versão sem ^ nem ~",
          "npm version minor                 # sobe a versão do SEU pacote",
        ].join("\n"),
        nota: "Veja a coluna `Wanted` do `npm outdated`: é a maior versão que a faixa do `package.json` permite. A coluna `Latest` pode estar um MAJOR adiante.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A faixa permite, o lockfile fixa",
        texto:
          "A faixa do `package.json` diz o que é **permitido**; o lockfile diz o que foi **instalado** (veja L16). Sem um `npm update`, a versão travada no lockfile não sobe, mesmo que exista um PATCH novo. Por isso, atualize de propósito, em lotes pequenos e com testes, e leia o changelog antes de cruzar um MAJOR.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O que conta como quebra de compatibilidade",
        texto:
          "Remover ou renomear algo que o pacote exporta, mudar a assinatura ou o retorno documentado de uma função e mudar um comportamento documentado são quebras: pedem MAJOR. Subir a versão mínima do Node.js exigida também costuma ser tratado como MAJOR. Mas o SemVer não é garantia: um MINOR pode trazer um defeito, e quem dependia de um detalhe não documentado pode ser afetado até por um PATCH.",
      },
    ],
    armadilhas: [
      "Confiar cegamente no `^`: um MINOR também pode trazer defeito. O SemVer é uma promessa, então mantenha o lockfile e os testes.",
      "Achar que `0.x` segue as mesmas regras: em `0.y.z` a API é instável e o `^` aceita, no máximo, PATCH.",
      "Usar `*`, `latest` ou `>=` no `package.json`: as instalações ficam imprevisíveis e abrem a porta para atualizações indesejadas.",
      "Confundir MAJOR com tamanho da mudança: ele indica quebra de compatibilidade, não a quantidade de código novo.",
    ],
    autoteste: [
      {
        pergunta: "O que `^1.4.2` e `~1.4.2` aceitam?",
        resposta:
          "`^1.4.2` aceita de `1.4.2` até antes de `2.0.0` (MINOR e PATCH). `~1.4.2` aceita de `1.4.2` até antes de `1.5.0` (só PATCH).",
      },
      {
        pergunta: "Ao publicar uma biblioteca, quando você sobe o MAJOR, o MINOR e o PATCH?",
        resposta:
          "MAJOR quando a mudança quebra a compatibilidade da API pública. MINOR quando acrescenta funcionalidade de forma compatível. PATCH quando só corrige defeitos, sem mudar a API.",
      },
    ],
  },
  en: {
    titulo: "Semantic versioning",
    pergunta: "What is semantic versioning?",
    porqueEsteMetodo:
      "Semantic versioning is a short contract about what three numbers mean. A concrete analogy fixes the role of each one, and the table of ranges ties the rule to the `package.json` you write every day.",
    resposta30s:
      "**Semantic versioning (SemVer)** numbers versions as **MAJOR.MINOR.PATCH**: PATCH goes up for compatible bug fixes, MINOR for compatible new features and MAJOR for changes that **break** compatibility. Whoever uses the package reads the number and judges the risk of upgrading. In npm, `^1.2.3` accepts new MINOR and PATCH versions, and `~1.2.3` accepts only PATCH.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of the standard for a house’s power sockets. Fixing a loose spring inside the socket changes nothing for your appliances (PATCH). Adding a USB port next to the holes keeps every old plug working and offers something new (MINOR). Changing the shape of the holes forces you to replace or adapt every plug (MAJOR).",
        tecnico:
          "In version `2.5.1`, MAJOR is 2, MINOR is 5 and PATCH is 1. The “socket” is the package’s public API. PATCH fixes bugs without changing the API; MINOR adds without removing or altering what already existed; MAJOR removes, renames or changes documented behavior, and resets the smaller numbers (`3.0.0`). A suffix marks a pre-release (`3.0.0-beta.1`), which comes before the final version and which npm only installs if you ask for it.",
        limite:
          "The socket follows a physical standard you can measure; SemVer is a **human promise**. Nothing stops an author from publishing a breaking change in a PATCH, and what counts as “breaking” depends on what the public API is. Also, `0.x` versions are initial development: anything may change at any time.",
      },
      {
        tipo: "tabela",
        titulo: "Version ranges in package.json",
        colunas: ["Range", "Versions accepted", "Note"],
        linhas: [
          ["`1.2.3`", "Only `1.2.3`", "Exact version: predictable, but no automatic fixes"],
          ["`~1.2.3`", "From `1.2.3` up to but not including `1.3.0`", "PATCH only"],
          [
            "`^1.2.3`",
            "From `1.2.3` up to but not including `2.0.0`",
            "PATCH and MINOR; what `npm install` saves by default",
          ],
          [
            "`^0.2.3`",
            "From `0.2.3` up to but not including `0.3.0`",
            "In `0.x`, `^` locks the MINOR: every `0.y` may break",
          ],
          ["`^0.0.3`", "Only `0.0.3`", "In `0.0.x`, every version may break"],
          ["`1.2.3-beta.1`", "Only that pre-release", "Pre-releases only get in when you ask for them"],
          ["`>=1.2.3`", "Any higher version, including a new MAJOR", "Risky: avoid it"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The everyday commands",
        legenda: "Terminal",
        codigo: [
          "npm outdated                      # Current, Wanted (within the range) and Latest",
          "npm update                        # goes up as far as the range allows and rewrites the lockfile",
          "npm install express@latest        # crosses a MAJOR on purpose",
          "npm install --save-exact package  # saves the version without ^ or ~",
          "npm version minor                 # bumps YOUR package’s version",
        ].join("\n"),
        nota: "Look at the `Wanted` column of `npm outdated`: it is the highest version the `package.json` range allows. `Latest` may be a MAJOR ahead.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The range permits, the lockfile pins",
        texto:
          "The range in `package.json` says what is **allowed**; the lockfile says what was **installed** (see L16). Without an `npm update`, the version pinned in the lockfile does not move, even if a new PATCH exists. So update on purpose, in small batches and with tests, and read the changelog before crossing a MAJOR.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What counts as a breaking change",
        texto:
          "Removing or renaming something the package exports, changing the signature or documented return value of a function and changing documented behavior are breaking changes: they call for a MAJOR. Raising the minimum required Node.js version is also often treated as a MAJOR. But SemVer is not a guarantee: a MINOR can ship a bug, and anyone who relied on an undocumented detail may be affected even by a PATCH.",
      },
    ],
    armadilhas: [
      "Trusting `^` blindly: a MINOR can also ship a bug. SemVer is a promise, so keep the lockfile and the tests.",
      "Assuming `0.x` follows the same rules: in `0.y.z` the API is unstable and `^` accepts PATCH at most.",
      "Using `*`, `latest` or `>=` in `package.json`: installs become unpredictable and invite unwanted updates.",
      "Confusing MAJOR with the size of the change: it signals broken compatibility, not how much new code there is.",
    ],
    autoteste: [
      {
        pergunta: "What do `^1.4.2` and `~1.4.2` accept?",
        resposta:
          "`^1.4.2` accepts from `1.4.2` up to but not including `2.0.0` (MINOR and PATCH). `~1.4.2` accepts from `1.4.2` up to but not including `1.5.0` (PATCH only).",
      },
      {
        pergunta: "When publishing a library, when do you bump MAJOR, MINOR and PATCH?",
        resposta:
          "MAJOR when the change breaks compatibility of the public API. MINOR when it adds functionality in a compatible way. PATCH when it only fixes bugs, without changing the API.",
      },
    ],
  },
};
