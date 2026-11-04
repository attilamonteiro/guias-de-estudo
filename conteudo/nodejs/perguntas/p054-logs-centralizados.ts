import type { Pergunta } from "../../tipos";

// P54 · Logs centralizados
export const p054: Pergunta = {
  numero: 754,
  modulo: "pawanmkr-observabilidade",
  metodo: "trace",
  pt: {
    titulo: "Logs centralizados",
    pergunta: "Como funcionam os logs centralizados e quais ferramentas os suportam no Node.js?",
    porqueEsteMetodo:
      "Log centralizado é um encanamento: só se entende acompanhando uma linha da aplicação até a tela de busca. O que importa de verdade é o que acontece quando um trecho do caminho falha.",
    resposta30s:
      "A aplicação escreve **uma linha JSON por evento no stdout**; um **agente coletor** (Fluent Bit, Vector, Filebeat ou o agente da plataforma) lê essa saída, enriquece e envia em lotes a um **armazenamento com índice** (Elasticsearch ou OpenSearch, Loki, serviços de nuvem), que você consulta e põe em alerta pelo Kibana ou pelo Grafana. No Node, **pino** ou **winston** produzem o JSON, e um **`requestId` ou trace id** em toda linha permite seguir um pedido por vários serviços. Planeje o que acontece quando o coletor cai ou o destino fica lento, a retenção, o custo e a redação de dados sensíveis.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "O caminho de uma linha de log, do código à tela",
        etapas: [
          'A aplicação registra o evento, por exemplo `req.log.error({ motivo }, "pagamento recusado")`. O pino (ou o winston) monta uma linha JSON com nível, hora, mensagem, `requestId` e demais campos e a escreve no **stdout**; a aplicação não sabe para onde ela vai',
          "A plataforma captura o stdout: Docker, systemd ou Kubernetes guardam a saída do contêiner em arquivo ou em um driver de log. Um **agente coletor** (Fluent Bit, Vector, Filebeat ou o agente da própria nuvem) lê esses arquivos em tempo real e anota a posição lida",
          "O coletor interpreta o JSON, acrescenta metadados (serviço, versão, ambiente, pod, nó), filtra ruído, redige campos sensíveis e agrupa as linhas em lotes, que ficam num buffer",
          "O **transporte** envia os lotes ao destino, comprimidos e protegidos por TLS, com retentativas; às vezes passa por um broker, como o Kafka, que amortece picos",
          "O **armazenamento e o índice** guardam a linha: Elasticsearch e OpenSearch indexam os campos para busca rápida (e custam mais), o Loki indexa só os rótulos e guarda o conteúdo comprimido (mais barato, busca por filtro), e as nuvens oferecem serviços próprios",
          "**Busca, painéis e alertas**: no Kibana (ou OpenSearch Dashboards) ou no Grafana, você filtra por `requestId` e vê todas as linhas daquele pedido, de todos os serviços, em ordem de tempo; regras de alerta disparam quando a taxa de erros sobe",
        ],
        nota: "Em outra plataforma, muda só o agente e o destino; o contrato da aplicação continua sendo JSON em stdout.",
      },
      {
        tipo: "passos",
        titulo: "Agora o caminho em que dá errado",
        passos: [
          {
            titulo: "O coletor cai",
            texto:
              "Enquanto ele está fora, o Docker ou o Kubernetes seguem guardando o stdout em arquivo, com rotação. Quando o coletor volta, retoma da última posição gravada (confira a configuração do seu agente). O risco é o arquivo ser rotacionado ou o contêiner removido antes da recuperação: essas linhas se perdem.",
          },
          {
            titulo: "O destino fica lento ou cai",
            texto:
              "O coletor segura os lotes em um buffer em memória e, se configurado, em disco, e tenta de novo com espera crescente. A aplicação segue escrevendo, porque só conversa com o stdout, a não ser que o log passe por um driver do contêiner em modo bloqueante: nesse caso a escrita pode travar a própria aplicação.",
          },
          {
            titulo: "O buffer enche",
            texto:
              "Chega a hora da política: **descartar** linhas (as mais antigas ou as novas), ou **parar de ler** e deixar o arquivo crescer. Para a maioria dos serviços, descartar e contar o que foi descartado é melhor que travar o serviço. Para trilhas de auditoria, use um caminho com garantia (fila durável, gravação própria).",
          },
          {
            titulo: "O destino volta",
            texto:
              "O coletor reenvia o que guardou. Podem aparecer duplicatas e linhas atrasadas, por isso a busca ordena pelo horário do **evento** (o campo de hora da própria linha), não pelo da chegada. E monitore o próprio coletor (linhas lidas, enviadas, descartadas, atraso): se o pipeline falha em silêncio, você só descobre quando precisa do log.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "pino com requestId e redação de segredos",
        legenda: "JavaScript",
        codigo: [
          'import pino from "pino";',
          'import { randomUUID } from "node:crypto";',
          "",
          "export const logger = pino({",
          '  level: process.env.LOG_LEVEL ?? "info",',
          '  base: { servico: "pagamentos" },',
          '  redact: ["req.headers.authorization", "*.senha", "*.cartao"], // nunca registre segredos',
          "});",
          "",
          "app.use((req, res, next) => {",
          '  const requestId = req.headers["x-request-id"] ?? randomUUID();',
          "  req.log = logger.child({ requestId }); // todo log desta requisição leva o id",
          '  res.setHeader("x-request-id", requestId);',
          "  next();",
          "});",
          "",
          'app.post("/pagar", (req, res) => {',
          '  req.log.error({ motivo: "saldo insuficiente" }, "pagamento recusado");',
          "  res.status(402).end();",
          "});",
        ].join("\n"),
        nota: "O cabeçalho `x-request-id` vem de fora: valide formato e tamanho antes de aceitá-lo. Em serviços reais, guarde o logger no `AsyncLocalStorage` (veja L84) em vez de pendurá-lo na requisição.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Correlação: o que torna o log útil",
        texto:
          "Uma linha sozinha diz pouco; o valor está em **seguir um pedido** por vários serviços. Gere o `requestId` (ou aceite o do balanceador) na borda, repasse-o nas chamadas entre serviços (cabeçalho `x-request-id` ou o `traceparent` do padrão W3C Trace Context) e grave-o em toda linha. Com OpenTelemetry, há instrumentações que inserem o trace id nas linhas do pino e do winston, e o painel salta do log para o trace (veja L117 e L118).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Retenção, custo e dados sensíveis",
        texto:
          "Log custa por volume, e indexar tudo é caro. Use `info` em produção e `debug` só sob demanda, amostre eventos repetitivos, defina retenção em camadas (quente por alguns dias, mais barata depois, apagada no prazo que a lei e o negócio exigem) e indexe só os campos que você de fato filtra. Dado sensível (senha, token, cartão, dados pessoais) não deve entrar: redija na aplicação (`redact` do pino) e, como segunda barreira, no coletor. Depois de indexado e replicado, apagar é difícil.",
      },
    ],
    armadilhas: [
      "Gravar logs em arquivo dentro do contêiner (ou rotacionar pela própria aplicação) em vez de escrever no stdout: o sistema de arquivos do contêiner some com ele.",
      "Logar texto livre sem estrutura nem `requestId`: dá para ler, mas não para filtrar nem correlacionar.",
      "Deixar segredos e dados pessoais entrarem nos logs: ficam indexados, replicados e retidos por meses.",
      "Não monitorar o pipeline: com o coletor parado ou descartando linhas, o painel só mostra uma calma enganosa.",
    ],
    autoteste: [
      {
        pergunta: "Por que a aplicação escreve no stdout em vez de enviar os logs direto ao Elasticsearch?",
        resposta:
          "Escrever no stdout deixa a aplicação simples e independente do destino: rede lenta ou armazenamento fora do ar não passam pelo código dela, e trocar o armazenamento é só configurar o coletor. A captura, o buffer e as retentativas ficam com a plataforma e o agente.",
      },
      {
        pergunta: "O que acontece com os logs se o destino ficar lento ou fora do ar?",
        resposta:
          "O coletor guarda lotes em buffer e tenta de novo. Se o buffer enche, a política decide: descartar, ou parar de ler e deixar o arquivo crescer. Depois podem chegar duplicatas e linhas atrasadas, então a busca usa o horário do evento. Para auditoria, use um caminho com garantia.",
      },
    ],
  },
  en: {
    titulo: "Centralized logging",
    pergunta: "How does centralized logging work and what tools support it in Node.js?",
    porqueEsteMetodo:
      "Centralized logging is plumbing: you only understand it by following a line from the application to the search screen. What really matters is what happens when a stretch of the path fails.",
    resposta30s:
      "The application writes **one JSON line per event to stdout**; a **collector agent** (Fluent Bit, Vector, Filebeat or the platform’s agent) reads that output, enriches it and ships it in batches to **storage with an index** (Elasticsearch or OpenSearch, Loki, cloud services), which you query and alert on through Kibana or Grafana. In Node, **pino** or **winston** produce the JSON, and a **`requestId` or trace id** on every line lets you follow one request across services. Plan for what happens when the collector dies or the destination slows down, plus retention, cost and redaction of sensitive data.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "The path of a log line, from code to screen",
        etapas: [
          'The application records the event, for example `req.log.error({ reason }, "payment declined")`. pino (or winston) builds a JSON line with level, time, message, `requestId` and other fields and writes it to **stdout**; the application does not know where it goes',
          "The platform captures stdout: Docker, systemd or Kubernetes keep the container’s output in a file or a log driver. A **collector agent** (Fluent Bit, Vector, Filebeat or the cloud’s own agent) reads those files in real time and records the position it has read",
          "The collector parses the JSON, adds metadata (service, version, environment, pod, node), filters noise, redacts sensitive fields and groups lines into batches, which sit in a buffer",
          "The **transport** sends the batches to the destination, compressed and protected by TLS, with retries; sometimes it passes through a broker, such as Kafka, that absorbs spikes",
          "The **storage and index** hold the line: Elasticsearch and OpenSearch index the fields for fast search (and cost more), Loki indexes only labels and stores the compressed content (cheaper, search by filter), and the clouds offer services of their own",
          "**Search, dashboards and alerts**: in Kibana (or OpenSearch Dashboards) or Grafana, you filter by `requestId` and see every line of that request, from every service, in time order; alert rules fire when the error rate rises",
        ],
        nota: "On another platform only the agent and the destination change; the application’s contract is still JSON on stdout.",
      },
      {
        tipo: "passos",
        titulo: "Now the path where it goes wrong",
        passos: [
          {
            titulo: "The collector dies",
            texto:
              "While it is down, Docker or Kubernetes keep storing stdout in a file, with rotation. When the collector returns, it resumes from the last recorded position (check your agent’s configuration). The risk is the file being rotated or the container removed before recovery: those lines are lost.",
          },
          {
            titulo: "The destination slows down or fails",
            texto:
              "The collector holds batches in a memory buffer and, if configured, on disk, and retries with growing waits. The application keeps writing, because it only talks to stdout, unless the log goes through a container driver in blocking mode: then the write can stall the application itself.",
          },
          {
            titulo: "The buffer fills up",
            texto:
              "Time for policy: **drop** lines (the oldest or the newest), or **stop reading** and let the file grow. For most services, dropping and counting what was dropped beats stalling the service. For audit trails, use a path with a guarantee (a durable queue, your own storage).",
          },
          {
            titulo: "The destination returns",
            texto:
              "The collector resends what it kept. Duplicates and late lines may appear, which is why search orders by the **event** time (the line’s own time field), not the arrival time. And monitor the collector itself (lines read, sent, dropped, lag): if the pipeline fails silently, you only find out when you need the log.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "pino with requestId and secret redaction",
        legenda: "JavaScript",
        codigo: [
          'import pino from "pino";',
          'import { randomUUID } from "node:crypto";',
          "",
          "export const logger = pino({",
          '  level: process.env.LOG_LEVEL ?? "info",',
          '  base: { service: "payments" },',
          '  redact: ["req.headers.authorization", "*.password", "*.card"], // never log secrets',
          "});",
          "",
          "app.use((req, res, next) => {",
          '  const requestId = req.headers["x-request-id"] ?? randomUUID();',
          "  req.log = logger.child({ requestId }); // every log of this request carries the id",
          '  res.setHeader("x-request-id", requestId);',
          "  next();",
          "});",
          "",
          'app.post("/pay", (req, res) => {',
          '  req.log.error({ reason: "insufficient funds" }, "payment declined");',
          "  res.status(402).end();",
          "});",
        ].join("\n"),
        nota: "The `x-request-id` header comes from outside: validate its format and length before accepting it. In real services, keep the logger in `AsyncLocalStorage` (see L84) instead of hanging it on the request.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Correlation: what makes a log useful",
        texto:
          "A single line says little; the value lies in **following one request** across services. Generate the `requestId` (or accept the load balancer’s) at the edge, pass it along in calls between services (the `x-request-id` header or the `traceparent` of the W3C Trace Context standard) and write it on every line. With OpenTelemetry, some instrumentations insert the trace id into pino and winston lines, and the dashboard jumps from the log to the trace (see L117 and L118).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Retention, cost and sensitive data",
        texto:
          "Logs cost by volume, and indexing everything is expensive. Use `info` in production and `debug` only on demand, sample repetitive events, set tiered retention (hot for a few days, cheaper afterwards, deleted by the deadline that law and business require) and index only the fields you actually filter on. Sensitive data (passwords, tokens, cards, personal data) should not get in: redact in the application (pino’s `redact`) and, as a second barrier, in the collector. Once indexed and replicated, deleting is hard.",
      },
    ],
    armadilhas: [
      "Writing logs to a file inside the container (or rotating them from the application) instead of writing to stdout: the container’s filesystem disappears with it.",
      "Logging free text with no structure and no `requestId`: it can be read, but not filtered or correlated.",
      "Letting secrets and personal data into the logs: they end up indexed, replicated and retained for months.",
      "Not monitoring the pipeline: with the collector stopped or dropping lines, the dashboard only shows a misleading calm.",
    ],
    autoteste: [
      {
        pergunta: "Why does the application write to stdout instead of sending logs straight to Elasticsearch?",
        resposta:
          "Writing to stdout keeps the application simple and independent of the destination: a slow network or a storage outage does not run through its code, and changing the storage is just collector configuration. Capture, buffering and retries are left to the platform and the agent.",
      },
      {
        pergunta: "What happens to the logs if the destination slows down or goes down?",
        resposta:
          "The collector keeps batches in a buffer and retries. If the buffer fills, policy decides: drop, or stop reading and let the file grow. Duplicates and late lines may arrive afterwards, so search uses the event time. For auditing, use a path with a guarantee.",
      },
    ],
  },
};
