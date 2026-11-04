import type { Pergunta } from "../../tipos";

// D89 · CI/CD para Node.js
export const d089: Pergunta = {
  numero: 389,
  modulo: "devinterview-escala",
  metodo: "playbook",
  pt: {
    titulo: "CI/CD para Node.js",
    pergunta: "O que é integração/entrega contínua e como ela é implementada em aplicações Node.js?",
    porqueEsteMetodo:
      "Um pipeline é uma sequência de estágios em que cada um existe para pegar uma classe de erro o mais cedo possível. Um playbook em ordem mostra o que roda em cada estágio e o sinal que decide seguir ou parar.",
    resposta30s:
      "**CI** (integração contínua) é integrar mudanças com frequência e validá-las automaticamente: instalar com `npm ci`, lint, tipos, testes e build. A **entrega contínua** deixa todo build aprovado pronto para produção, com a liberação decidida por uma pessoa; na **implantação contínua** ela é automática. Em Node.js o pipeline típico é: gatilho → `npm ci` → lint, tipos e testes → `npm audit` → build do artefato (muitas vezes uma imagem) → staging → testes de fumaça → produção gradual com **rollback**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "CI, entrega e implantação contínuas",
        colunas: ["Prática", "O que é", "O que continua humano"],
        linhas: [
          [
            "Integração contínua (CI)",
            "A cada mudança enviada, um servidor faz build e testes automaticamente, e as mudanças se integram à branch principal com frequência",
            "Revisar o código e corrigir o que quebrou",
          ],
          [
            "Entrega contínua",
            "Todo build aprovado gera um artefato pronto para produção, já implantado em staging",
            "A decisão de liberar para produção (um clique ou uma aprovação)",
          ],
          [
            "Implantação contínua",
            "O artefato aprovado segue para produção sozinho, sem aprovação manual",
            "Quase nada: exige testes, monitoramento e rollback muito confiáveis",
          ],
        ],
      },
      {
        tipo: "passos",
        titulo: "O pipeline, em ordem",
        passos: [
          {
            titulo: "1. Gatilho e checkout",
            texto:
              "Disparado por push, pull request, tag ou agenda. Em pull requests o pipeline é um portão: a branch só integra se estiver verde. Sinal de acerto: o status aparece no próprio PR.",
          },
          {
            titulo: "2. Ambiente e dependências",
            texto:
              "Escolha a versão do Node.js (a mesma do `.nvmrc` ou de `engines`; use uma **matriz** de versões se for uma biblioteca), restaure o cache do npm e rode `npm ci`, que instala exatamente o lockfile. Critério: o resultado não depende da máquina do CI.",
          },
          {
            titulo: "3. Verificações rápidas",
            texto:
              "Lint, checagem de tipos (`tsc --noEmit`) e testes unitários. Falhe cedo: o que é barato vem primeiro, e um erro de formatação não deve esperar vinte minutos de testes de integração.",
          },
          {
            titulo: "4. Integração e segurança",
            texto:
              "Testes contra serviços reais em contêineres (banco, fila), `npm audit` com uma política de severidade (veja L131), varredura de segredos e de licenças. Sinal: nenhuma vulnerabilidade crítica conhecida entra por esse caminho.",
          },
          {
            titulo: "5. Build e artefato",
            texto:
              "`npm run build` e, em geral, uma **imagem de contêiner** (veja D58) publicada no registro com tag imutável, como o hash do commit. Regra: construa **uma vez**; é esse artefato que será promovido.",
          },
          {
            titulo: "6. Staging e testes de fumaça",
            texto:
              "Implante num ambiente parecido com a produção e rode testes de fumaça: a rota de saúde responde e o fluxo principal funciona. Critério: só promove se passar.",
          },
          {
            titulo: "7. Promoção, observação e rollback",
            texto:
              "Libere em produção (com aprovação manual na entrega contínua, ou automaticamente na implantação contínua) por atualização gradual ou blue-green, observe erros e latência e mantenha o rollback pronto: reimplantar a tag anterior. Migrações de banco devem ser compatíveis com as duas versões.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Um artefato, e segredos fora do código",
        texto:
          "O **mesmo artefato** percorre staging e produção; só a configuração (variáveis de ambiente) muda. Se você reconstrói para produção, está implantando algo que nunca foi testado. Os segredos ficam no cofre do provedor de CI e entram como variáveis mascaradas (ou por identidade federada, sem chave de longa duração), nunca no repositório nem nos logs, e pull requests de forks não devem recebê-los.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Ferramentas e cuidados com o pipeline",
        texto:
          "GitHub Actions, GitLab CI, Azure Pipelines e Jenkins fazem o mesmo trabalho com sintaxes diferentes; o desenho acima não depende da escolha. Um pipeline é código com acesso à produção: proteja a branch principal, revise mudanças no próprio pipeline e dê ao job só as permissões de que ele precisa. Testes instáveis fazem as pessoas ignorarem o vermelho, e pipelines lentos fazem as pessoas contornarem o processo.",
      },
    ],
    armadilhas: [
      "Rodar `npm install` no CI em vez de `npm ci`: as versões podem divergir do lockfile e o build deixa de ser reprodutível.",
      "Reconstruir o artefato para cada ambiente: o que foi para produção não é o que foi testado.",
      "Expor segredos em logs ou entregá-los a pull requests de forks.",
      "Automatizar o deploy sem rollback, testes de fumaça e monitoramento: a velocidade amplia o estrago.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre entrega contínua e implantação contínua?",
        resposta:
          "Nas duas, todo commit aprovado vira um artefato pronto para produção. Na entrega contínua, a ida para produção depende de uma decisão humana; na implantação contínua, ela acontece sozinha quando todas as verificações passam.",
      },
      {
        pergunta: "Por que usar `npm ci` no pipeline?",
        resposta:
          "Ele parte de um `node_modules` limpo, instala exatamente o que o lockfile descreve e falha se o lockfile e o `package.json` divergirem. O resultado é o mesmo no CI, no servidor e na máquina de quem rodar depois.",
      },
    ],
  },
  en: {
    titulo: "CI/CD for Node.js",
    pergunta: "What is continuous integration/deployment and how is it implemented for Node.js apps?",
    porqueEsteMetodo:
      "A pipeline is a sequence of stages, each one existing to catch a class of error as early as possible. A playbook in order shows what runs at each stage and the signal that decides whether to go on or stop.",
    resposta30s:
      "**CI** (continuous integration) means merging changes often and validating them automatically: install with `npm ci`, lint, types, tests and build. **Continuous delivery** keeps every approved build ready for production, with the release decided by a person; with **continuous deployment** it is automatic. In Node.js the typical pipeline is: trigger → `npm ci` → lint, types and tests → `npm audit` → build the artifact (often an image) → staging → smoke tests → gradual production with **rollback**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Continuous integration, delivery and deployment",
        colunas: ["Practice", "What it is", "What stays human"],
        linhas: [
          [
            "Continuous integration (CI)",
            "On every pushed change, a server builds and tests automatically, and changes are merged into the main branch often",
            "Reviewing the code and fixing what broke",
          ],
          [
            "Continuous delivery",
            "Every approved build produces an artifact ready for production, already deployed to staging",
            "The decision to release to production (a click or an approval)",
          ],
          [
            "Continuous deployment",
            "The approved artifact goes to production on its own, with no manual approval",
            "Almost nothing: it demands very reliable tests, monitoring and rollback",
          ],
        ],
      },
      {
        tipo: "passos",
        titulo: "The pipeline, in order",
        passos: [
          {
            titulo: "1. Trigger and checkout",
            texto:
              "Triggered by a push, pull request, tag or schedule. On pull requests the pipeline is a gate: the branch only merges if it is green. Sign of success: the status appears on the PR itself.",
          },
          {
            titulo: "2. Environment and dependencies",
            texto:
              "Pick the Node.js version (the same as `.nvmrc` or `engines`; use a version **matrix** if it is a library), restore the npm cache and run `npm ci`, which installs exactly the lockfile. Criterion: the result doesn’t depend on the CI machine.",
          },
          {
            titulo: "3. Fast checks",
            texto:
              "Lint, type checking (`tsc --noEmit`) and unit tests. Fail early: cheap things come first, and a formatting error shouldn’t wait twenty minutes of integration tests.",
          },
          {
            titulo: "4. Integration and security",
            texto:
              "Tests against real services in containers (database, queue), `npm audit` with a severity policy (see L131), secret and license scanning. Sign: no known critical vulnerability gets in this way.",
          },
          {
            titulo: "5. Build and artifact",
            texto:
              "`npm run build` and, usually, a **container image** (see D58) published to the registry with an immutable tag, such as the commit hash. Rule: build **once**; that artifact is the one that gets promoted.",
          },
          {
            titulo: "6. Staging and smoke tests",
            texto:
              "Deploy to an environment that resembles production and run smoke tests: the health route answers and the main flow works. Criterion: it is only promoted if it passes.",
          },
          {
            titulo: "7. Promotion, observation and rollback",
            texto:
              "Release to production (with manual approval in continuous delivery, or automatically in continuous deployment) through a gradual or blue-green rollout, watch errors and latency and keep the rollback ready: redeploy the previous tag. Database migrations must be compatible with both versions.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "One artifact, and secrets outside the code",
        texto:
          "The **same artifact** goes through staging and production; only the configuration (environment variables) changes. If you rebuild for production, you are deploying something that was never tested. Secrets live in the CI provider’s vault and come in as masked variables (or through federated identity, with no long-lived key), never in the repository or in the logs, and pull requests from forks should not receive them.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Tools and pipeline cautions",
        texto:
          "GitHub Actions, GitLab CI, Azure Pipelines and Jenkins do the same job with different syntaxes; the design above doesn’t depend on the choice. A pipeline is code with access to production: protect the main branch, review changes to the pipeline itself and give the job only the permissions it needs. Flaky tests make people ignore red, and slow pipelines make people work around the process.",
      },
    ],
    armadilhas: [
      "Running `npm install` in CI instead of `npm ci`: versions may drift from the lockfile and the build stops being reproducible.",
      "Rebuilding the artifact for each environment: what went to production is not what was tested.",
      "Exposing secrets in logs or handing them to pull requests from forks.",
      "Automating the deploy without rollback, smoke tests and monitoring: speed amplifies the damage.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between continuous delivery and continuous deployment?",
        resposta:
          "In both, every approved commit becomes an artifact ready for production. In continuous delivery, going to production depends on a human decision; in continuous deployment it happens on its own when all the checks pass.",
      },
      {
        pergunta: "Why use `npm ci` in the pipeline?",
        resposta:
          "It starts from a clean `node_modules`, installs exactly what the lockfile describes and fails if the lockfile and `package.json` disagree. The result is the same in CI, on the server and on the machine of whoever runs it later.",
      },
    ],
  },
};
