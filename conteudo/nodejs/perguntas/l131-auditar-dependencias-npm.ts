import type { Pergunta } from "../../tipos";

// L131 · Auditar dependências npm
export const l131: Pergunta = {
  numero: 231,
  modulo: "linkedin-seguranca",
  metodo: "playbook",
  pt: {
    titulo: "Auditar dependências npm",
    pergunta: "Como auditar as dependências do npm?",
    porqueEsteMetodo:
      "Auditar dependências é uma rotina repetível, não um comando isolado. Um playbook ordena o que fazer: enxergar a árvore, procurar vulnerabilidades, decidir, automatizar e reduzir a superfície.",
    resposta30s:
      "Auditar é saber o que você realmente instala (a árvore inteira, com as dependências transitivas, travada pelo **lockfile**) e checá-la contra vulnerabilidades conhecidas com **`npm audit`**, no CI e de forma contínua (**Dependabot** ou **Renovate**). Some a isso instalar com **`npm ci`**, desconfiar de **scripts de instalação** e de nomes parecidos (**typosquatting**), ter menos dependências e gerar um **SBOM**. O relatório é ponto de partida: ainda é preciso avaliar se a falha é alcançável no seu uso.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: da árvore à rotina",
        passos: [
          {
            titulo: "Enxergue a árvore e trave-a",
            texto:
              "`npm ls --all` mostra tudo o que entra, inclusive as dependências transitivas (a maior parte do total), e `npm explain <pacote>` diz por que um pacote está lá. Commite o lockfile (veja L16): ele fixa versões e hashes de integridade. Critério: o que você audita é exatamente o que vai para produção.",
          },
          {
            titulo: "Rode a auditoria",
            texto:
              "`npm audit` consulta a base de avisos de segurança do registro. Use `--omit=dev` para focar no que vai para produção e `--audit-level=high` para o CI falhar a partir de uma gravidade. Leia o caminho da dependência, a gravidade e se existe versão corrigida.",
          },
          {
            titulo: "Faça a triagem",
            texto:
              "Pergunte: o código vulnerável é alcançável no meu uso? É só de desenvolvimento? Há correção? Opções: atualizar, trocar o pacote, forçar uma versão corrigida de uma transitiva com `overrides` no `package.json` ou aceitar o risco com registro e prazo. `npm audit fix` aplica atualizações compatíveis com o semver (veja L19); `--force` pode trazer quebras, então revise e teste.",
          },
          {
            titulo: "Automatize",
            texto:
              "`npm ci` no CI (falha se o lockfile e o `package.json` divergem) e `npm audit` em cada PR e também em horário agendado, porque novos avisos surgem depois do deploy. Dependabot ou Renovate abrem PRs de atualização para o atraso não se acumular.",
          },
          {
            titulo: "Proteja a cadeia de suprimentos",
            texto:
              "Scripts de instalação (`preinstall`, `postinstall`) executam código na máquina e no CI: considere `--ignore-scripts` e libere só os necessários. Confira o nome exato de pacotes novos (typosquatting) e use escopos ou registro privado para pacotes internos. Desconfie de mantenedor recém-chegado ou projeto abandonado. `npm audit signatures` verifica assinaturas e proveniência quando o pacote as publica.",
          },
          {
            titulo: "Reduza e documente",
            texto:
              "Cada dependência é código de terceiros no seu sistema: remova as que não usa e prefira módulos embutidos (`node:`; veja L90). Gere um **SBOM** (lista de componentes) para saber depressa se um aviso novo atinge você; o npm tem um comando para isso em versões recentes, confira a documentação em nodejs.org e npmjs.com.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "O que cada controle pega e o que não pega",
        colunas: ["Controle", "Pega", "Não pega"],
        linhas: [
          [
            "`npm audit`",
            "Vulnerabilidades já publicadas, nos pacotes diretos e nos transitivos",
            "Pacote malicioso novo, mantenedor comprometido, falhas do seu próprio código",
          ],
          [
            "Lockfile + `npm ci`",
            "Desvio silencioso de versões e hashes em relação ao que foi revisado",
            "Uma versão que já era vulnerável ou maliciosa",
          ],
          [
            "Dependabot / Renovate",
            "Atraso: abrem PRs quando há versão nova ou correção",
            "Revisão e testes, que continuam com você",
          ],
          [
            "`--ignore-scripts`",
            "Código executado durante a instalação",
            "Código malicioso que roda quando o pacote é importado",
          ],
          [
            "`npm audit signatures`",
            "Adulteração e origem do pacote, quando há assinatura e proveniência",
            "Garantia de que o código é benigno",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Processo, não comando",
        texto:
          "Auditoria é um **processo contínuo**: saber o que entra (lockfile, SBOM), ser avisado quando algo muda (CI agendado, Dependabot ou Renovate) e ter critério para decidir e atualizar. Rodar `npm audit` uma vez é só uma fotografia.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Zero avisos não significa seguro",
        texto:
          "`npm audit` só conhece o que já foi publicado, então não pega pacote malicioso novo, e pode apontar falhas em código que você nunca chama. Priorize por alcance e gravidade em vez de perseguir um placar zerado, e não rode `npm audit fix --force` às cegas.",
      },
    ],
    armadilhas: [
      "Rodar `npm audit fix --force` sem revisar: as atualizações de versão maior costumam quebrar a aplicação.",
      "Olhar só as dependências diretas, quando a maior parte do risco está nas transitivas, ou ignorar as de desenvolvimento, que rodam no CI com acesso a segredos.",
      "Usar `npm install` no CI ou não commitar o lockfile: o que foi auditado deixa de ser o que vai para produção.",
      "Instalar um pacote pelo nome digitado de memória (typosquatting) ou aceitar um `postinstall` sem olhar o que ele executa.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre `npm install` e `npm ci` do ponto de vista da segurança?",
        resposta:
          "O `npm ci` apaga o `node_modules` e instala exatamente o que o lockfile descreve, falhando se ele e o `package.json` divergem. Assim, a árvore auditada é a que roda. O `npm install` pode resolver versões novas e alterar o lockfile.",
      },
      {
        pergunta: "O `npm audit` retornou zero vulnerabilidades. Posso considerar as dependências seguras?",
        resposta:
          "Não. Ele só conhece avisos já publicados. Não detecta pacote malicioso recém-lançado, typosquatting nem mantenedor comprometido, e novos avisos aparecem com o tempo. Mantenha o CI agendado, o lockfile e as atualizações contínuas.",
      },
    ],
  },
  en: {
    titulo: "Auditing npm dependencies",
    pergunta: "How do you audit npm dependencies?",
    porqueEsteMetodo:
      "Auditing dependencies is a repeatable routine, not a single command. A playbook puts the work in order: see the tree, look for vulnerabilities, decide, automate and shrink the surface.",
    resposta30s:
      "Auditing means knowing what you really install (the whole tree, transitive dependencies included, pinned by the **lockfile**) and checking it against known vulnerabilities with **`npm audit`**, in CI and continuously (**Dependabot** or **Renovate**). Add **`npm ci`** installs, suspicion toward **install scripts** and look-alike names (**typosquatting**), fewer dependencies and an **SBOM**. The report is a starting point: you still have to judge whether the flaw is reachable in your use.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from the tree to a routine",
        passos: [
          {
            titulo: "See the tree and pin it",
            texto:
              "`npm ls --all` shows everything that comes in, transitive dependencies included (most of the total), and `npm explain <package>` tells you why a package is there. Commit the lockfile (see L16): it pins versions and integrity hashes. Criterion: what you audit is exactly what goes to production.",
          },
          {
            titulo: "Run the audit",
            texto:
              "`npm audit` queries the registry’s security advisory database. Use `--omit=dev` to focus on what ships to production and `--audit-level=high` to make CI fail from a given severity up. Read the dependency path, the severity and whether a fixed version exists.",
          },
          {
            titulo: "Triage",
            texto:
              "Ask: is the vulnerable code reachable in my use? Is it development-only? Is there a fix? Options: upgrade, replace the package, force a fixed version of a transitive dependency with `overrides` in `package.json`, or accept the risk with a record and a deadline. `npm audit fix` applies semver-compatible updates (see L19); `--force` can bring breaking changes, so review and test.",
          },
          {
            titulo: "Automate",
            texto:
              "`npm ci` in CI (it fails if the lockfile and `package.json` disagree) and `npm audit` on every PR and on a schedule too, because new advisories appear after you deploy. Dependabot or Renovate open update PRs so the lag does not pile up.",
          },
          {
            titulo: "Protect the supply chain",
            texto:
              "Install scripts (`preinstall`, `postinstall`) run code on the machine and in CI: consider `--ignore-scripts` and allow only the ones you need. Check the exact name of new packages (typosquatting) and use scopes or a private registry for internal packages. Be wary of a brand-new maintainer or an abandoned project. `npm audit signatures` verifies signatures and provenance when a package publishes them.",
          },
          {
            titulo: "Shrink and document",
            texto:
              "Every dependency is third-party code in your system: remove the ones you do not use and prefer built-in modules (`node:`; see L90). Generate an **SBOM** (a list of components) to learn quickly whether a new advisory hits you; npm has a command for it in recent versions, so check the documentation at nodejs.org and npmjs.com.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "What each control catches and what it misses",
        colunas: ["Control", "Catches", "Misses"],
        linhas: [
          [
            "`npm audit`",
            "Already-published vulnerabilities, in direct and transitive packages",
            "A new malicious package, a compromised maintainer, flaws in your own code",
          ],
          [
            "Lockfile + `npm ci`",
            "Silent drift of versions and hashes from what was reviewed",
            "A version that was already vulnerable or malicious",
          ],
          [
            "Dependabot / Renovate",
            "Lag: they open PRs when a new version or fix exists",
            "Review and testing, which remain yours",
          ],
          [
            "`--ignore-scripts`",
            "Code that runs during installation",
            "Malicious code that runs when the package is imported",
          ],
          [
            "`npm audit signatures`",
            "Tampering and package origin, when signatures and provenance exist",
            "Any guarantee that the code is benign",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A process, not a command",
        texto:
          "Auditing is an **ongoing process**: know what comes in (lockfile, SBOM), get told when something changes (scheduled CI, Dependabot or Renovate) and have a criterion to decide and update. Running `npm audit` once is just a snapshot.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Zero advisories does not mean safe",
        texto:
          "`npm audit` only knows what has been published, so it misses a new malicious package, and it can flag flaws in code you never call. Prioritize by reachability and severity instead of chasing a zero score, and do not run `npm audit fix --force` blindly.",
      },
    ],
    armadilhas: [
      "Running `npm audit fix --force` without review: major-version updates often break the application.",
      "Looking only at direct dependencies, when most of the risk sits in the transitive ones, or ignoring development ones, which run in CI with access to secrets.",
      "Using `npm install` in CI or not committing the lockfile: what was audited stops being what goes to production.",
      "Installing a package by a name typed from memory (typosquatting) or accepting a `postinstall` without looking at what it runs.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `npm install` and `npm ci` from a security standpoint?",
        resposta:
          "`npm ci` deletes `node_modules` and installs exactly what the lockfile describes, failing if it and `package.json` disagree. So the audited tree is the one that runs. `npm install` may resolve newer versions and change the lockfile.",
      },
      {
        pergunta: "`npm audit` reported zero vulnerabilities. Can I consider the dependencies safe?",
        resposta:
          "No. It only knows published advisories. It does not detect a freshly released malicious package, typosquatting or a compromised maintainer, and new advisories appear over time. Keep scheduled CI, the lockfile and continuous updates.",
      },
    ],
  },
};
