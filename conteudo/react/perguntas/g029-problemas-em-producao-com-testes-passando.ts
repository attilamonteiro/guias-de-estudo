import type { Pergunta } from "../../tipos";

// G29 · Problemas em produção com testes passando
export const g029: Pergunta = {
  numero: 329,
  modulo: "glassdoor-react",
  metodo: "design",
  pt: {
    titulo: "Problemas em produção com testes passando",
    pergunta: "Como você descobre que usuários em produção estão tendo problemas quando seus testes estão passando?",
    porqueEsteMetodo:
      "É um problema de projeto: o que observar, onde coletar, como alertar sem ruído e o que proteger. O roteiro (requisitos, sinais, coleta, alertas, entrega segura, privacidade) cobre o que os testes não cobrem.",
    resposta30s:
      "Testes mostram o que você previu; para o resto você precisa de **observabilidade do frontend**: **rastreamento de erros** com source maps e versão da release, **error boundaries** que reportam, **monitoramento de usuários reais** (Core Web Vitals), métricas e logs das chamadas de API e eventos de negócio (funil). Complemente com **feature flags e deploys graduais** para limitar o estrago, **alertas por taxa de erro** (não por contagem) e canais de suporte, sempre com **amostragem** e **cuidado com a privacidade** (LGPD).",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "O que significa “usuário com problema”: erro de JavaScript, tela branca, requisição que falha, página lenta, fluxo que não conclui (pagamento, cadastro). Quem precisa saber e em quanto tempo (minutos para o que impede vendas; dias para tendências). Quem atende o alerta.",
          },
          {
            titulo: "2. Sinais a coletar",
            texto:
              "Erros (não capturados, rejeições de promises, falhas de render), **falhas e latência das chamadas de API** vistas do cliente, **Core Web Vitals** de usuários reais, eventos do funil (etapas e abandono), versão da release, rota, navegador e dispositivo (veja a tabela).",
          },
          {
            titulo: "3. Coleta no cliente",
            texto:
              "Um SDK de erros (ou código próprio) com `window.onerror`, `unhandledrejection` e **error boundaries** que reportam (veja C24); as opções de erro da raiz do React ajudam a centralizar (confira react.dev). Envie em lote, com `sendBeacon` ou `fetch` com `keepalive`, para não perder dados ao sair da página, e inclua a **versão da release**, a rota e um id de sessão anônimo.",
          },
          {
            titulo: "4. Source maps e releases",
            texto:
              "Gere source maps no build e envie-os ao serviço de erros **junto da release**, sem servi-los publicamente se o código for sensível. Sem eles, a pilha de produção é ilegível; sem a versão, você não sabe qual deploy causou o problema.",
          },
          {
            titulo: "5. Alertas sem ruído",
            texto:
              "Alerte por **taxa de erro por release** e por sessões afetadas, não por contagem bruta. Agrupe erros iguais, ignore o ruído conhecido (extensões do navegador, scripts de terceiros) e defina gravidade e responsável. Um alerta que dispara toda hora passa a ser ignorado.",
          },
          {
            titulo: "6. Entrega segura e suporte",
            texto:
              "**Feature flags** e **deploys graduais** (canário) limitam quem é afetado e permitem reverter pela flag; a taxa de erro da nova versão decide continuar ou voltar. Some testes sintéticos dos fluxos críticos em produção, canais de suporte e um feedback no próprio app com o id da sessão, para ligar a queixa ao erro.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Sinais, o que revelam e cuidados",
        colunas: ["Sinal", "O que revela", "Cuidado"],
        linhas: [
          [
            "Erros de JavaScript e de renderização",
            "Falhas que os testes não cobriram, por release, rota e navegador",
            "Agrupar, filtrar ruído de extensões e mapear com source maps",
          ],
          [
            "Falhas e latência de API vistas do cliente",
            "Backend lento ou instável, quebra de contrato e falhas só em certas redes",
            "Não registrar o corpo da resposta nem cabeçalhos de autenticação",
          ],
          [
            "Core Web Vitals de usuários reais",
            "Lentidão e instabilidade visual que o laboratório não mostra, por dispositivo e rede",
            "Olhar percentis e segmentos; amostrar para limitar o volume",
          ],
          [
            "Eventos de funil",
            "Onde as pessoas abandonam ou travam (uma tela que “funciona” mas não converte)",
            "Eventos sem dados pessoais; atenção ao consentimento",
          ],
          [
            "Replay de sessão",
            "O que a pessoa viu e fez antes do erro",
            "Máscara de campos, exclusão de dados sensíveis, base legal e retenção curta (LGPD)",
          ],
          [
            "Feedback e suporte",
            "Problemas que nenhuma métrica detecta",
            "Anexar versão, rota e id da sessão automaticamente",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Error boundary que reporta",
        legenda: "JSX",
        codigo: `import { Component } from "react";

class FronteiraDeErro extends Component {
  state = { falhou: false };

  static getDerivedStateFromError() {
    return { falhou: true };
  }

  componentDidCatch(erro, info) {
    // release e rota ajudam a achar o deploy e a tela responsáveis
    reportarErro({ mensagem: erro.message, pilha: erro.stack, componentes: info.componentStack, release: VERSAO });
  }

  render() {
    return this.state.falhou ? <p role="alert">Algo deu errado. Tente recarregar a página.</p> : this.props.children;
  }
}`,
        nota: "`reportarErro` (por exemplo, com `sendBeacon`) e `VERSAO` (injetada no build) são seus. Error boundaries continuam sendo componentes de classe e não pegam erros em handlers de evento, em código assíncrono nem no próprio componente: para esses, use `window.onerror`, `unhandledrejection` e `try/catch` que reportem.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra",
        texto:
          "Observe o que o **usuário** vive, não só o que o servidor registra: erros agrupados por release, lentidão real por dispositivo e o funil de negócio. **Alerte por taxa e por release, entregue em etapas e limite o estrago com flags.** Colete o mínimo, sem dados pessoais.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Privacidade e LGPD",
        texto:
          "Logs e replays podem capturar CPF, e-mails, dados de cartão, tokens e o que a pessoa digita. Mascare por padrão, nunca registre o corpo de requisições sensíveis, defina retenção curta, controle quem acessa e verifique base legal, consentimento e contratos com o fornecedor (inclusive transferência internacional de dados). Isto não é aconselhamento jurídico: alinhe com o jurídico ou o encarregado de dados (DPO).",
      },
    ],
    armadilhas: [
      "Registrar sem a versão da release e sem source maps: o erro chega, mas ninguém sabe onde nem quando começou.",
      "Alertar por contagem absoluta ou por todo erro: o ruído (extensões, bots, scripts de terceiros) faz a equipe ignorar os alertas.",
      "Gravar replay ou logs com dados pessoais, senhas ou tokens, criando um problema de privacidade maior que o bug.",
      "Achar que a error boundary pega tudo: ela não cobre handlers de evento, código assíncrono nem erros dentro dela mesma.",
    ],
    autoteste: [
      {
        pergunta: "Por que testes verdes não bastam para saber que os usuários estão bem?",
        resposta:
          "Testes cobrem o que foi previsto, em ambientes controlados. Produção traz dispositivos, redes, dados, extensões e fluxos que ninguém previu; só a observação de usuários reais mostra isso.",
      },
      {
        pergunta: "Como evitar que alertas virem ruído?",
        resposta:
          "Alertar por taxa de erro por release e por sessões afetadas, agrupar erros iguais, filtrar ruído conhecido, definir gravidade e responsável e revisar os alertas que ninguém atende.",
      },
    ],
  },
  en: {
    titulo: "Production issues despite passing tests",
    pergunta: "How do you find out that production users are having trouble when your tests are passing?",
    porqueEsteMetodo:
      "This is a design problem: what to observe, where to collect it, how to alert without noise and what to protect. The script (requirements, signals, collection, alerts, safe delivery, privacy) covers what tests do not.",
    resposta30s:
      "Tests show what you foresaw; for the rest you need **frontend observability**: **error tracking** with source maps and the release version, **error boundaries** that report, **real-user monitoring** (Core Web Vitals), metrics and logs of API calls and business events (the funnel). Add **feature flags and gradual rollouts** to limit the damage, **alerts on error rate** (not on counts) and support channels, always with **sampling** and **care for privacy** (GDPR/LGPD).",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "What “a user in trouble” means: a JavaScript error, a blank screen, a failing request, a slow page, a flow that does not complete (payment, sign-up). Who needs to know and how fast (minutes for what stops sales; days for trends). Who answers the alert.",
          },
          {
            titulo: "2. Signals to collect",
            texto:
              "Errors (uncaught, promise rejections, render failures), **API failures and latency** seen from the client, real-user **Core Web Vitals**, funnel events (steps and drop-off), release version, route, browser and device (see the table).",
          },
          {
            titulo: "3. Collection on the client",
            texto:
              "An error SDK (or your own code) with `window.onerror`, `unhandledrejection` and **error boundaries** that report (see C24); React’s root error options help centralize this (check react.dev). Send in batches, with `sendBeacon` or `fetch` with `keepalive`, so no data is lost when the page closes, and include the **release version**, the route and an anonymous session id.",
          },
          {
            titulo: "4. Source maps and releases",
            texto:
              "Generate source maps at build time and upload them to the error service **together with the release**, without serving them publicly if the code is sensitive. Without them, the production stack is unreadable; without the version, you do not know which deploy caused the problem.",
          },
          {
            titulo: "5. Alerts without noise",
            texto:
              "Alert on **error rate per release** and on affected sessions, not on raw counts. Group identical errors, ignore known noise (browser extensions, third-party scripts) and define severity and an owner. An alert that fires all the time gets ignored.",
          },
          {
            titulo: "6. Safe delivery and support",
            texto:
              "**Feature flags** and **gradual rollouts** (canary) limit who is affected and allow rolling back through the flag; the new version’s error rate decides whether to continue or go back. Add synthetic tests of critical flows in production, support channels and in-app feedback with the session id, to link a complaint to the error.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Signals, what they reveal and cautions",
        colunas: ["Signal", "What it reveals", "Caution"],
        linhas: [
          [
            "JavaScript and render errors",
            "Failures the tests did not cover, by release, route and browser",
            "Group them, filter extension noise and map with source maps",
          ],
          [
            "API failures and latency seen from the client",
            "A slow or unstable backend, contract breaks and failures only on certain networks",
            "Do not log the response body or authentication headers",
          ],
          [
            "Real-user Core Web Vitals",
            "Slowness and visual instability the lab does not show, by device and network",
            "Look at percentiles and segments; sample to limit volume",
          ],
          [
            "Funnel events",
            "Where people drop off or get stuck (a screen that “works” but does not convert)",
            "Events without personal data; mind consent",
          ],
          [
            "Session replay",
            "What the person saw and did before the error",
            "Field masking, excluding sensitive data, a legal basis and short retention (GDPR/LGPD)",
          ],
          ["Feedback and support", "Problems no metric detects", "Attach version, route and session id automatically"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "An error boundary that reports",
        legenda: "JSX",
        codigo: `import { Component } from "react";

class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    // release and route help find the responsible deploy and screen
    sendErrorReport({ message: error.message, stack: error.stack, components: info.componentStack, release: VERSION });
  }

  render() {
    return this.state.failed ? <p role="alert">Something went wrong. Try reloading the page.</p> : this.props.children;
  }
}`,
        nota: "`sendErrorReport` (for example, using `sendBeacon`) and `VERSION` (injected at build time) are yours. Error boundaries are still class components and do not catch errors in event handlers, in asynchronous code or in the boundary itself: for those, use `window.onerror`, `unhandledrejection` and a `try/catch` that reports.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule",
        texto:
          "Observe what the **user** experiences, not only what the server logs: errors grouped by release, real slowness by device and the business funnel. **Alert on rate and per release, deliver in stages and limit the damage with flags.** Collect the minimum, with no personal data.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Privacy and data-protection law",
        texto:
          "Logs and replays can capture national IDs, emails, card data, tokens and whatever the person types. Mask by default, never log the body of sensitive requests, set short retention, control who has access and check the legal basis, consent and contracts with the vendor (including international data transfer). This is not legal advice: align with your legal team or data protection officer (DPO).",
      },
    ],
    armadilhas: [
      "Reporting without the release version and without source maps: the error arrives, but nobody knows where or when it started.",
      "Alerting on absolute counts or on every error: the noise (extensions, bots, third-party scripts) makes the team ignore alerts.",
      "Recording replays or logs with personal data, passwords or tokens, creating a privacy problem bigger than the bug.",
      "Thinking the error boundary catches everything: it does not cover event handlers, asynchronous code or errors inside itself.",
    ],
    autoteste: [
      {
        pergunta: "Why are green tests not enough to know users are fine?",
        resposta:
          "Tests cover what was foreseen, in controlled environments. Production brings devices, networks, data, extensions and flows nobody predicted; only observing real users shows them.",
      },
      {
        pergunta: "How do you keep alerts from turning into noise?",
        resposta:
          "Alert on error rate per release and on affected sessions, group identical errors, filter known noise, define severity and an owner, and review the alerts nobody acts on.",
      },
    ],
  },
};
