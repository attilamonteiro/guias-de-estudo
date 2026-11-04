import type { Pergunta } from "../../tipos";

// M26 · Git no dia a dia
export const m26: Pergunta = {
  numero: 226,
  modulo: "mentorcruise",
  metodo: "playbook",
  pt: {
    titulo: "Git no dia a dia",
    pergunta:
      "Você pode descrever o seu processo de desenvolvimento usando sistemas de controle de versão, como o Git?",
    porqueEsteMetodo:
      "Descrever um processo é percorrer uma sequência: o entrevistador quer ouvir o ciclo real do trabalho, da branch ao deploy, com o cuidado de cada etapa. Um playbook dá a ordem, os comandos e o critério de cada passo.",
    resposta30s:
      "O entrevistador procura **disciplina e colaboração**, não decoreba de comandos. Um fluxo sólido: criar uma **branch curta** a partir da principal, fazer **commits pequenos com mensagens descritivas**, abrir um **pull request** revisado e com **CI verde**, integrar (merge, squash ou rebase, conforme o time) e apagar a branch. A `main` é **protegida** e sempre implantável, releases saem de **tags** e **segredos nunca entram** no repositório. Descreva o fluxo que você realmente usa e, se a experiência for limitada, diga isso com franqueza.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Um dia de trabalho, em ordem",
        passos: [
          {
            titulo: "Atualize e ramifique",
            texto:
              "`git switch main && git pull --ff-only`, depois `git switch -c feat/cancelar-pedido`. A branch é curta (de horas a poucos dias) e o nome diz o propósito. Critério: você parte sempre do estado mais recente da principal.",
          },
          {
            titulo: "Commits pequenos e coesos",
            texto:
              "`git add -p` para escolher o que entra e `git commit` com uma mensagem que explica o **porquê** (`fix(pedidos): impede cancelar pedido já enviado`). Uma ideia por commit. O formato “conventional commits” (`feat:`, `fix:`, `chore:`) é opcional, mas ajuda quando o time gera changelog e versão automaticamente.",
          },
          {
            titulo: "Mantenha a branch em dia",
            texto:
              "`git fetch` e depois `git rebase origin/main` (histórico linear) ou `git merge origin/main` (preserva o que aconteceu). Regra: reescreva só o histórico que ainda é apenas seu; se precisar empurrar depois de um rebase, use `git push --force-with-lease` na **sua** branch, nunca `--force` puro.",
          },
          {
            titulo: "Abra o pull request",
            texto:
              "Descreva o quê, o porquê e como testar; mantenha o PR pequeno o bastante para ser revisado em minutos. O CI roda testes, lint, build e varredura de segredos. Critério: ao menos uma aprovação e todas as verificações verdes.",
          },
          {
            titulo: "Revise e resolva conflitos",
            texto:
              "Responda aos comentários com novos commits. Em um conflito: `git status`, abra os arquivos com os marcadores `<<<<<<<`, entenda **os dois lados**, escolha o resultado correto, rode os testes e conclua com `git add` e `git rebase --continue` (ou o commit do merge).",
          },
          {
            titulo: "Integre na principal protegida",
            texto:
              "Sem push direto na `main`: a política do repositório exige PR, revisão e CI verde. Escolha como integrar: **squash** (um commit por PR, histórico limpo), **merge commit** (preserva o histórico da branch) ou **rebase** (linear, cada commit preservado). Depois, apague a branch.",
          },
          {
            titulo: "Marque e entregue",
            texto:
              "`git tag -a v1.4.0` (versão semântica) marca o commit que foi para produção, e o pipeline publica a partir dele. Hotfix: branch a partir da tag em produção, correção mínima, PR acelerado e merge também de volta na linha principal.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Estratégia de branches: trunk-based ou GitFlow",
        colunas: ["Aspecto", "Trunk-based", "GitFlow"],
        linhas: [
          [
            "Branches",
            "Uma principal; branches de vida curta (horas ou 1 a 2 dias) ou commits diretos nela",
            "`main`, `develop` e também `feature/*`, `release/*` e `hotfix/*`, algumas de vida longa",
          ],
          [
            "Integração",
            "Frequente e em pequenos passos; trabalho incompleto fica escondido atrás de feature flags",
            "A feature só entra em `develop` quando está pronta; integração mais espaçada e conflitos maiores",
          ],
          [
            "Releases",
            "Direto da principal (ou de um corte curto), combinando com deploy contínuo",
            "Uma branch de release estabiliza a versão; a tag fecha o ciclo",
          ],
          [
            "Combina com",
            "Web e SaaS com deploy frequente, CI forte e bons testes",
            "Produto versionado, mantido em várias versões em paralelo (por exemplo, software instalado pelo cliente)",
          ],
          [
            "Cuidado",
            "Exige CI confiável e disciplina com as flags",
            "Mais cerimônia; branches longas atrasam o feedback e aumentam os conflitos",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Desfazer sem estragar o histórico",
        colunas: ["Situação", "Comando", "Cuidado"],
        linhas: [
          [
            "Commit local com erro, ainda não enviado",
            "`git commit --amend` ou `git reset --soft HEAD~1`",
            "Só é seguro enquanto ninguém mais tem esse commit",
          ],
          [
            "Commit ruim já na branch compartilhada",
            "`git revert abc1234`",
            "Cria um commit novo que desfaz o anterior e não reescreve o histórico",
          ],
          [
            "Alterações não commitadas que você quer descartar",
            "`git restore arquivo.ts`",
            "Destrutivo: o que não foi commitado não volta",
          ],
          [
            "Perdeu um commit ou uma branch",
            "`git reflog` e depois `git switch -c recuperada abc1234`",
            "O reflog é local e guarda as referências por tempo limitado",
          ],
          [
            "Um segredo foi commitado",
            "Revogue a credencial e gere outra; depois, se preciso, limpe o histórico (por exemplo, com `git filter-repo`)",
            "Apagar no commit seguinte não basta: o segredo continua no histórico e em clones",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Como estruturar a resposta",
        texto:
          "Quatro movimentos: (1) o **contexto** (tamanho do time, tipo de projeto); (2) o **fluxo**, da branch ao deploy; (3) os **cuidados** que protegem a equipe (PRs pequenos, `main` protegida, CI, segredos); (4) uma **lição**, como o conflito enorme que uma branch de semanas provoca. Se a sua experiência é pequena (projetos pessoais, estudo, estágio), diga isso: descreva o fluxo que você segue, mostre que entende o porquê de cada regra e explique como aprenderia a convenção do time. Não invente tamanho de equipe nem processo que você não praticou, porque o entrevistador costuma aprofundar com “e quando deu conflito?” ou “como você desfez aquilo?”.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Segredos e .gitignore",
        texto:
          "Nunca versione senhas, chaves de API, tokens, certificados nem arquivos `.env`. O `.gitignore` só vale para arquivos ainda **não rastreados**: se o arquivo já foi commitado, é preciso `git rm --cached`, e se ele continha um segredo, trate-o como **vazado** (revogar e rotacionar). Complementos úteis: varredura de segredos no CI e em um hook de pré-commit.",
      },
    ],
    armadilhas: [
      "Commits “ajustes” e “wip” e PRs gigantes: o histórico não conta nada e a revisão vira só um “ok”.",
      "`git push --force` em branch compartilhada: sobrescreve o trabalho dos outros. Use `--force-with-lease` e só na sua branch.",
      "Achar que apagar o segredo no commit seguinte resolve: ele continua no histórico. Revogue a credencial primeiro.",
      "Recitar o GitFlow “do livro” sem dizer o que o time realmente faz: o entrevistador percebe, e a conversa vira teste de memória.",
    ],
    autoteste: [
      {
        pergunta: "Quando usar merge e quando usar rebase?",
        resposta:
          "Rebase para atualizar a sua branch local e manter o histórico linear, desde que ninguém mais tenha esses commits. Merge para integrar histórico compartilhado, preservando o que aconteceu. A regra: nunca reescreva histórico que outras pessoas já baixaram.",
      },
      {
        pergunta: "Um commit com bug já está na `main`. `revert` ou `reset`?",
        resposta:
          "`git revert`: cria um commit novo que desfaz o anterior sem reescrever a história. Um `reset` seguido de force push mudaria um histórico que outros já têm.",
      },
      {
        pergunta: "Você commitou uma chave de API e já fez push. Qual é o primeiro passo?",
        resposta:
          "Revogar e rotacionar a chave: ela deve ser considerada comprometida. Só depois, se necessário, limpar o histórico.",
      },
    ],
  },
  en: {
    titulo: "Everyday Git workflow",
    pergunta: "Can you describe your development process using version control systems, like Git?",
    porqueEsteMetodo:
      "Describing a process means walking through a sequence: the interviewer wants to hear the real working cycle, from branch to deploy, with the care taken at each stage. A playbook gives the order, the commands and the criterion for each step.",
    resposta30s:
      "The interviewer is looking for **discipline and collaboration**, not memorized commands. A solid flow: create a **short-lived branch** from the main line, make **small commits with descriptive messages**, open a reviewed **pull request** with **green CI**, integrate (merge, squash or rebase, depending on the team) and delete the branch. `main` is **protected** and always deployable, releases come from **tags**, and **secrets never enter** the repository. Describe the flow you really use and, if your experience is limited, say so plainly.",
    blocos: [
      {
        tipo: "passos",
        titulo: "A working day, in order",
        passos: [
          {
            titulo: "Update and branch",
            texto:
              "`git switch main && git pull --ff-only`, then `git switch -c feat/cancel-order`. The branch is short-lived (hours to a few days) and its name states the purpose. Criterion: you always start from the latest state of the main line.",
          },
          {
            titulo: "Small, cohesive commits",
            texto:
              "`git add -p` to choose what goes in and `git commit` with a message that explains the **why** (`fix(orders): prevent cancelling an order already shipped`). One idea per commit. The “conventional commits” format (`feat:`, `fix:`, `chore:`) is optional, but it helps when the team generates the changelog and version automatically.",
          },
          {
            titulo: "Keep the branch current",
            texto:
              "`git fetch`, then `git rebase origin/main` (linear history) or `git merge origin/main` (keeps what happened). Rule: rewrite only history that is still yours alone; if you must push after a rebase, use `git push --force-with-lease` on **your own** branch, never a bare `--force`.",
          },
          {
            titulo: "Open the pull request",
            texto:
              "Describe what, why and how to test; keep the PR small enough to be reviewed in minutes. CI runs tests, lint, build and secret scanning. Criterion: at least one approval and every check green.",
          },
          {
            titulo: "Review and resolve conflicts",
            texto:
              "Answer comments with new commits. On a conflict: `git status`, open the files with `<<<<<<<` markers, understand **both sides**, pick the correct result, run the tests and finish with `git add` and `git rebase --continue` (or the merge commit).",
          },
          {
            titulo: "Integrate into the protected main line",
            texto:
              "No direct push to `main`: the repository policy requires a PR, review and green CI. Choose how to integrate: **squash** (one commit per PR, clean history), **merge commit** (keeps the branch history) or **rebase** (linear, every commit kept). Then delete the branch.",
          },
          {
            titulo: "Tag and ship",
            texto:
              "`git tag -a v1.4.0` (semantic version) marks the commit that went to production, and the pipeline publishes from it. Hotfix: branch from the production tag, minimal fix, fast-tracked PR, and merge back into the main line as well.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Branching strategy: trunk-based or GitFlow",
        colunas: ["Aspect", "Trunk-based", "GitFlow"],
        linhas: [
          [
            "Branches",
            "One main line; short-lived branches (hours or 1 to 2 days) or direct commits to it",
            "`main`, `develop` plus `feature/*`, `release/*` and `hotfix/*`, some long-lived",
          ],
          [
            "Integration",
            "Frequent and in small steps; unfinished work stays hidden behind feature flags",
            "A feature enters `develop` only when finished; integration is more spread out and conflicts are bigger",
          ],
          [
            "Releases",
            "Straight from the main line (or a short cut), matching continuous deployment",
            "A release branch stabilizes the version; the tag closes the cycle",
          ],
          [
            "Fits",
            "Web and SaaS with frequent deploys, strong CI and good tests",
            "A versioned product maintained in several versions in parallel (for example, software installed by the customer)",
          ],
          [
            "Watch out",
            "Needs reliable CI and discipline with flags",
            "More ceremony; long branches delay feedback and increase conflicts",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Undoing without wrecking history",
        colunas: ["Situation", "Command", "Caution"],
        linhas: [
          [
            "Local commit with a mistake, not pushed yet",
            "`git commit --amend` or `git reset --soft HEAD~1`",
            "Only safe while nobody else has that commit",
          ],
          [
            "Bad commit already on the shared branch",
            "`git revert abc1234`",
            "Creates a new commit that undoes the earlier one and does not rewrite history",
          ],
          [
            "Uncommitted changes you want to discard",
            "`git restore file.ts`",
            "Destructive: what was not committed does not come back",
          ],
          [
            "Lost a commit or a branch",
            "`git reflog`, then `git switch -c recovered abc1234`",
            "The reflog is local and keeps references for a limited time",
          ],
          [
            "A secret was committed",
            "Revoke the credential and issue a new one; then, if needed, clean the history (for example, with `git filter-repo`)",
            "Deleting it in the next commit is not enough: the secret stays in history and in clones",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "How to structure the answer",
        texto:
          "Four moves: (1) the **context** (team size, kind of project); (2) the **flow**, from branch to deploy; (3) the **safeguards** that protect the team (small PRs, protected `main`, CI, secrets); (4) a **lesson**, such as the huge conflict a weeks-old branch causes. If your experience is small (personal projects, study, an internship), say so: describe the flow you follow, show you understand the reason behind each rule and explain how you would learn the team’s convention. Do not invent a team size or a process you never practiced, because interviewers often dig in with “and when you hit a conflict?” or “how did you undo that?”.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Secrets and .gitignore",
        texto:
          "Never version passwords, API keys, tokens, certificates or `.env` files. `.gitignore` only applies to files that are not yet **tracked**: if the file was already committed you need `git rm --cached`, and if it held a secret, treat it as **leaked** (revoke and rotate). Useful complements: secret scanning in CI and in a pre-commit hook.",
      },
    ],
    armadilhas: [
      "“Fixes” and “wip” commits and giant PRs: the history tells nothing and the review becomes a rubber stamp.",
      "`git push --force` on a shared branch: it overwrites other people’s work. Use `--force-with-lease`, and only on your own branch.",
      "Thinking that deleting the secret in the next commit fixes it: it stays in history. Revoke the credential first.",
      "Reciting “textbook” GitFlow without saying what the team actually does: the interviewer notices, and the talk turns into a memory test.",
    ],
    autoteste: [
      {
        pergunta: "When do you use merge and when rebase?",
        resposta:
          "Rebase to update your local branch and keep history linear, as long as nobody else has those commits. Merge to integrate shared history, keeping what happened. The rule: never rewrite history that others have already pulled.",
      },
      {
        pergunta: "A buggy commit is already on `main`. `revert` or `reset`?",
        resposta:
          "`git revert`: it creates a new commit that undoes the earlier one without rewriting history. A `reset` followed by a force push would change a history others already have.",
      },
      {
        pergunta: "You committed an API key and already pushed. What is the first step?",
        resposta: "Revoke and rotate the key: treat it as compromised. Only then, if needed, clean the history.",
      },
    ],
  },
};
