import type { Pergunta } from "../../tipos";

// R20 · Pipeline de CI/CD
export const r20: Pergunta = {
  numero: 120,
  modulo: "roadmap-intermediario",
  metodo: "playbook",
  pt: {
    titulo: "Pipeline de CI/CD",
    pergunta: "Como você configuraria um pipeline de integração e entrega contínuas (CI/CD) para serviços de backend?",
    porqueEsteMetodo:
      "Um pipeline é uma sequência de estágios em que cada um filtra um tipo de erro. O playbook segue a ordem em que você os montaria.",
    resposta30s:
      "O **commit** dispara o pipeline: **build** reproduzível que gera um **artefato versionado uma única vez**, **testes automatizados** (lint, unitários, integração, varredura de dependências e segredos), **publicação** do artefato num registro, **deploy automático em staging** com smoke tests, **promoção para produção** com estratégia segura (rolling, blue-green, canary) e **rollback** fácil. Se algo falha, o pipeline para.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Os estágios",
        passos: [
          {
            titulo: "Gatilho no controle de versão",
            texto: "Push ou pull request num branch dispara o pipeline (o Git é a fonte da verdade).",
          },
          {
            titulo: "Build reprodutível",
            texto:
              "Instala as dependências pelo lockfile, compila e gera um **artefato versionado** (imagem Docker, pacote), uma única vez.",
          },
          {
            titulo: "Testes automatizados",
            texto:
              "Lint, análise estática, testes unitários e de integração; falhou, o pipeline para. Varredura de dependências e de segredos.",
          },
          {
            titulo: "Publicar o artefato",
            texto:
              "Guarde num registro (Docker registry, Artifactory, Nexus): o **mesmo** artefato segue para todos os ambientes.",
          },
          {
            titulo: "Deploy em staging",
            texto: "Sobe, roda as migrações, smoke tests e testes de ponta a ponta.",
          },
          {
            titulo: "Promoção para produção",
            texto: "Com aprovação ou automática, usando rolling, blue-green ou canary.",
          },
          {
            titulo: "Rollback e observabilidade",
            texto: "Voltar à versão anterior com um comando; métricas e alertas logo após o deploy.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "CI, entrega e implantação contínuas",
        colunas: ["Termo", "O que é"],
        linhas: [
          [
            "Integração contínua (CI)",
            "Integrar e validar o código várias vezes ao dia, com build e testes automáticos",
          ],
          ["Entrega contínua", "Todo commit validado fica pronto para produção; o deploy é uma decisão (um clique)"],
          ["Implantação contínua", "Todo commit validado vai para produção sozinho"],
        ],
        nota: "Plataformas comuns: GitHub Actions, GitLab CI/CD, Azure Pipelines, CircleCI e Jenkins.",
      },
    ],
    armadilhas: [
      "Reconstruir o artefato em cada ambiente: o que foi testado não é o que vai ao ar.",
      "Pipeline lento demais: ninguém espera e acaba contornando.",
      "Segredos no repositório ou nos logs.",
      "Não ter plano de rollback.",
    ],
    autoteste: [
      {
        pergunta: "Por que construir o artefato uma única vez?",
        resposta: "Para garantir que o que foi testado é exatamente o que vai para produção.",
      },
      {
        pergunta: "Qual a diferença entre entrega contínua e implantação contínua?",
        resposta:
          "Na entrega contínua o deploy em produção depende de uma decisão; na implantação contínua ele é automático depois dos testes.",
      },
    ],
  },
  en: {
    titulo: "CI/CD pipeline",
    pergunta:
      "How would you set up a continuous integration/continuous deployment (CI/CD) pipeline for backend services?",
    porqueEsteMetodo:
      "A pipeline is a sequence of stages where each filters one kind of error. The playbook follows the order in which you would build them.",
    resposta30s:
      "A **commit** triggers the pipeline: a reproducible **build** producing a **versioned artifact once**, **automated tests** (lint, unit, integration, dependency and secret scanning), **publishing** the artifact to a registry, **automatic deploy to staging** with smoke tests, **promotion to production** with a safe strategy (rolling, blue-green, canary) and easy **rollback**. If anything fails, the pipeline stops.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The stages",
        passos: [
          {
            titulo: "Trigger on version control",
            texto: "A push or pull request on a branch triggers the pipeline (Git is the source of truth).",
          },
          {
            titulo: "Reproducible build",
            texto:
              "Install dependencies from the lockfile, compile and produce a **versioned artifact** (Docker image, package), once.",
          },
          {
            titulo: "Automated tests",
            texto:
              "Lint, static analysis, unit and integration tests; if it fails, the pipeline stops. Dependency and secret scanning.",
          },
          {
            titulo: "Publish the artifact",
            texto:
              "Store it in a registry (Docker registry, Artifactory, Nexus): the **same** artifact goes to every environment.",
          },
          {
            titulo: "Deploy to staging",
            texto: "Bring it up, run migrations, smoke tests and end-to-end tests.",
          },
          {
            titulo: "Promotion to production",
            texto: "With approval or automatic, using rolling, blue-green or canary.",
          },
          {
            titulo: "Rollback and observability",
            texto: "Return to the previous version with one command; metrics and alerts right after deploy.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Continuous integration, delivery and deployment",
        colunas: ["Term", "What it is"],
        linhas: [
          [
            "Continuous integration (CI)",
            "Integrate and validate code several times a day, with automatic build and tests",
          ],
          [
            "Continuous delivery",
            "Every validated commit is ready for production; deploying is a decision (one click)",
          ],
          ["Continuous deployment", "Every validated commit goes to production on its own"],
        ],
        nota: "Common platforms: GitHub Actions, GitLab CI/CD, Azure Pipelines, CircleCI and Jenkins.",
      },
    ],
    armadilhas: [
      "Rebuilding the artifact for each environment: what was tested is not what ships.",
      "A pipeline too slow: nobody waits and people work around it.",
      "Secrets in the repository or in logs.",
      "Having no rollback plan.",
    ],
    autoteste: [
      {
        pergunta: "Why build the artifact only once?",
        resposta: "To guarantee that what was tested is exactly what goes to production.",
      },
      {
        pergunta: "What is the difference between continuous delivery and continuous deployment?",
        resposta:
          "In continuous delivery, deploying to production depends on a decision; in continuous deployment it is automatic after the tests.",
      },
    ],
  },
};
