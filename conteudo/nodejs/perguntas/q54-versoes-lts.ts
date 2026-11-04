import type { Pergunta } from "../../tipos";

// Q54 · Versões LTS
export const q54: Pergunta = {
  numero: 54,
  modulo: "turing-avancadas",
  metodo: "compare",
  pt: {
    titulo: "Versões LTS",
    pergunta: "O que são os lançamentos LTS do Node.js?",
    porqueEsteMetodo:
      "LTS só faz sentido ao lado das outras fases de uma versão. A matriz põe Current, Active LTS e Maintenance LTS lado a lado, e a regra de decisão responde o que a entrevista quer saber: qual usar e quando.",
    resposta30s:
      "**LTS** (Long-Term Support) são as versões do Node.js escolhidas para receber **correções de bugs e de segurança por um longo período**, sem mudanças que quebrem a compatibilidade dentro da mesma versão principal. É a linha recomendada para **produção**. Cada versão passa por **Current** (novidades), **Active LTS** (a recomendada) e **Maintenance LTS** (só correções críticas e de segurança) até o fim da vida (EOL). Historicamente só as versões de número par viram LTS; confira o calendário oficial em nodejs.org.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "As fases de uma versão",
        colunas: ["Aspecto", "Current", "Active LTS", "Maintenance LTS"],
        linhas: [
          [
            "O que é",
            "A linha mais nova, que recebe os recursos novos",
            "Versão com suporte de longo prazo, recomendada para produção",
            "LTS na fase final, só com correções críticas e de segurança",
          ],
          [
            "O que recebe",
            "Recursos novos, correções e atualizações de segurança",
            "Correções de bugs, segurança e melhorias que não quebram a compatibilidade",
            "Apenas correções críticas e de segurança",
          ],
          [
            "Estabilidade",
            "Menor: mais exposta a mudanças de comportamento e a bugs novos",
            "Alta: o foco é não quebrar quem já usa",
            "Alta, mas já quase sem novidades",
          ],
          [
            "Duração",
            "Curta: dura até virar LTS ou ser encerrada",
            "Longa (confira o calendário oficial)",
            "Fase final, até o fim da vida (EOL)",
          ],
          [
            "Quem deve usar",
            "Quem quer testar novidades e antecipar a compatibilidade (CI, projetos sem pressa)",
            "Produção, na maioria dos times",
            "Produção que ainda não migrou, só enquanto planeja a atualização",
          ],
          [
            "Risco principal",
            "Instabilidade e atualizações frequentes",
            "Deixar de atualizar e cair na Maintenance",
            "Chegar ao EOL sem correção de segurança",
          ],
        ],
        nota: "Os nomes das fases e as datas vêm do calendário oficial de lançamentos, em nodejs.org. Confira lá antes de decidir.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Em produção, use a **Active LTS**; se ainda estiver na **Maintenance**, trate isso como prazo para migrar. Use a **Current** só para experimentar ou testar compatibilidade com antecedência (por exemplo, um job extra de CI). Nunca rode uma versão em **fim de vida**: ela não recebe mais correções de segurança. Fixe a versão no projeto para que desenvolvimento, CI e produção usem a mesma.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "LTS não é “para sempre”",
        texto:
          "LTS é suporte longo, mas com data de fim. Quem “instala e esquece” acaba numa versão sem correções de segurança. Planeje a atualização antes de a versão entrar na Maintenance e confira as datas no calendário oficial (nodejs.org), porque a política de lançamentos pode ser ajustada com o tempo. Historicamente, apenas as versões de número par viram LTS; as de número ímpar nunca chegam lá.",
      },
      {
        tipo: "codigo",
        titulo: "Fixando a versão no projeto",
        legenda: "package.json",
        codigo: `{
  "name": "minha-api",
  "private": true,
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "start": "node src/index.js"
  }
}`,
        nota: "O número é só um exemplo: use a versão LTS que sua equipe adotou. O `engines` é apenas um aviso, a menos que você ligue `engine-strict=true` no `.npmrc`. Um arquivo `.nvmrc` com `lts/*` faz o `nvm` apontar para a LTS mais recente.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Como atualizar sem susto",
        texto:
          "Rode a suíte de testes na próxima LTS em paralelo, no CI, antes de migrar. Leia as notas de lançamento e os avisos de depreciação (`node --trace-deprecation`). Atualize as dependências, em especial as que têm módulos nativos, que precisam ser recompiladas ao trocar de versão principal. E troque a versão também na imagem do contêiner e no ambiente de CI.",
      },
    ],
    armadilhas: [
      "Achar que a Current é a melhor por ser a mais nova: ela é a menos estável e dura pouco tempo.",
      "Achar que LTS nunca expira: depois do fim da vida não há mais correção de segurança.",
      "Não fixar a versão: o computador do desenvolvedor, o CI e o contêiner rodam versões diferentes, e o bug “só acontece em produção”.",
      "Migrar só quando a versão já chegou ao fim: sobra pouco tempo para testar as dependências e os módulos nativos.",
    ],
    autoteste: [
      {
        pergunta: "Qual versão do Node.js usar em produção?",
        resposta:
          "Uma LTS na fase Active (ou, no limite, Maintenance, enquanto se planeja a migração), confirmando as datas no calendário oficial.",
      },
      {
        pergunta: "O que acontece quando uma versão chega ao fim da vida?",
        resposta:
          "Ela deixa de receber correções, inclusive de segurança; continuar nela deixa vulnerabilidades conhecidas sem conserto.",
      },
      {
        pergunta: "Como garantir que todos usem a mesma versão do Node?",
        resposta:
          "Fixando-a no projeto: `.nvmrc` para ferramentas como o `nvm`, `engines` no `package.json` (com `engine-strict` se quiser que vire erro) e a mesma versão na imagem do contêiner e no CI.",
      },
    ],
  },
  en: {
    titulo: "LTS releases",
    pergunta: "What are Node.js LTS releases?",
    porqueEsteMetodo:
      "LTS only makes sense next to the other phases of a release. The matrix puts Current, Active LTS and Maintenance LTS side by side, and the decision rule answers what the interview wants to know: which one to use and when.",
    resposta30s:
      "**LTS** (Long-Term Support) releases are the Node.js versions chosen to receive **bug and security fixes for a long period**, with no compatibility-breaking changes inside the same major version. It is the recommended line for **production**. Each version goes through **Current** (new features), **Active LTS** (the recommended one) and **Maintenance LTS** (only critical and security fixes) until its end of life (EOL). Historically only even-numbered versions become LTS; check the official schedule at nodejs.org.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The phases of a release",
        colunas: ["Aspect", "Current", "Active LTS", "Maintenance LTS"],
        linhas: [
          [
            "What it is",
            "The newest line, which receives the new features",
            "A version with long-term support, recommended for production",
            "LTS in its final phase, with only critical and security fixes",
          ],
          [
            "What it receives",
            "New features, fixes and security updates",
            "Bug fixes, security and improvements that do not break compatibility",
            "Only critical and security fixes",
          ],
          [
            "Stability",
            "Lower: more exposed to behavior changes and new bugs",
            "High: the focus is not breaking existing users",
            "High, but with almost no new features",
          ],
          [
            "Duration",
            "Short: lasts until it becomes LTS or is retired",
            "Long (check the official schedule)",
            "Final phase, until end of life (EOL)",
          ],
          [
            "Who should use it",
            "Those who want to try new features and check compatibility early (CI, no-rush projects)",
            "Production, for most teams",
            "Production that has not migrated yet, only while planning the upgrade",
          ],
          [
            "Main risk",
            "Instability and frequent upgrades",
            "Not upgrading and sliding into Maintenance",
            "Reaching EOL with no security fixes",
          ],
        ],
        nota: "The phase names and dates come from the official release schedule at nodejs.org. Check it before you decide.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "In production, use the **Active LTS**; if you are still on **Maintenance**, treat that as a deadline to migrate. Use **Current** only to experiment or to test compatibility ahead of time (for example, an extra CI job). Never run a version at **end of life**: it no longer gets security fixes. Pin the version in the project so development, CI and production use the same one.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "LTS is not “forever”",
        texto:
          "LTS is long support, but with an end date. Whoever “installs and forgets” ends up on a version with no security fixes. Plan the upgrade before the version enters Maintenance and check the dates on the official schedule (nodejs.org), because the release policy can be adjusted over time. Historically, only even-numbered versions become LTS; odd-numbered ones never get there.",
      },
      {
        tipo: "codigo",
        titulo: "Pinning the version in the project",
        legenda: "package.json",
        codigo: `{
  "name": "my-api",
  "private": true,
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "start": "node src/index.js"
  }
}`,
        nota: "The number is only an example: use the LTS version your team adopted. `engines` is just a warning unless you turn on `engine-strict=true` in `.npmrc`. An `.nvmrc` file with `lts/*` makes `nvm` point to the latest LTS.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "How to upgrade without surprises",
        texto:
          "Run your test suite on the next LTS in parallel, in CI, before migrating. Read the release notes and the deprecation warnings (`node --trace-deprecation`). Update dependencies, especially those with native modules, which must be rebuilt when you change major versions. And switch the version in the container image and the CI environment too.",
      },
    ],
    armadilhas: [
      "Thinking Current is the best because it is the newest: it is the least stable and lasts a short time.",
      "Thinking LTS never expires: after end of life there are no more security fixes.",
      "Not pinning the version: the developer’s machine, CI and the container run different versions, and the bug “only happens in production”.",
      "Migrating only when the version has already reached its end: little time is left to test dependencies and native modules.",
    ],
    autoteste: [
      {
        pergunta: "Which Node.js version should you use in production?",
        resposta:
          "An LTS in the Active phase (or, at a stretch, Maintenance while you plan the migration), confirming the dates on the official schedule.",
      },
      {
        pergunta: "What happens when a version reaches end of life?",
        resposta:
          "It stops receiving fixes, including security fixes; staying on it leaves known vulnerabilities unpatched.",
      },
      {
        pergunta: "How do you make sure everyone uses the same Node version?",
        resposta:
          "Pin it in the project: `.nvmrc` for tools like `nvm`, `engines` in `package.json` (with `engine-strict` if you want it to be an error) and the same version in the container image and CI.",
      },
    ],
  },
};
