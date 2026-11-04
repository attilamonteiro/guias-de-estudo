import type { Pergunta } from "../../tipos";

// D96 · Node.js em IoT
export const d096: Pergunta = {
  numero: 396,
  modulo: "devinterview-cenarios",
  metodo: "design",
  pt: {
    titulo: "Node.js em IoT",
    pergunta: "Como o Node.js é usado em IoT (Internet das Coisas)?",
    porqueEsteMetodo:
      "A resposta mais útil para “como se usa em IoT?” é o desenho do sistema inteiro, que mostra onde o Node.js cabe e onde não cabe. O roteiro de design evita listar protocolos sem ligar um ao outro.",
    resposta30s:
      "Em IoT o Node.js costuma ficar **no gateway ou na borda** (um Raspberry Pi ou similar que conversa com sensores por BLE, serial ou MQTT), **no backend de ingestão** (assina um **broker MQTT**, valida e enfileira mensagens de muitos dispositivos) e **nos painéis em tempo real**; ele não roda em microcontroladores. O desenho típico é **dispositivos → broker MQTT → serviço de ingestão → fila ou stream → banco de séries temporais → API e painel**. As considerações centrais são recursos limitados, **conectividade intermitente** (reconexão, buffer offline, QoS), segurança (TLS, certificado por dispositivo, atualização OTA) e volume.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Funcionais: receber telemetria, enviar comandos aos dispositivos, alertar, mostrar painéis e histórico. Não funcionais: muitos dispositivos ao mesmo tempo, conexões que caem, segurança, latência dos comandos, retenção dos dados e custo de banda e de energia.",
          },
          {
            titulo: "2. Estimativas",
            texto:
              "Dispositivos × frequência × tamanho da mensagem. Exemplo hipotético: 100 mil dispositivos enviando uma leitura por minuto são cerca de 1,7 mil mensagens por segundo, com picos maiores quando todos se reconectam juntos depois de uma queda. A conta orienta o dimensionamento do broker e da fila, e mostra por que a gravação no banco deve ser em lotes.",
          },
          {
            titulo: "3. Decisão central: protocolo e papéis",
            texto:
              "**MQTT**: publica e assina, é leve e oferece níveis de QoS, sessões persistentes e mensagem de última vontade. Um broker recebe dos dispositivos; o Node.js aparece no gateway (traduzindo BLE, serial ou Modbus) e na ingestão (cliente MQTT que assina os tópicos). HTTP e WebSocket servem a quem tem banda e energia; CoAP, a dispositivos muito restritos.",
          },
          {
            titulo: "4. Contrato",
            texto:
              "Tópicos hierárquicos (`dispositivos/{id}/telemetria`, `dispositivos/{id}/comandos`), formato compacto (JSON enxuto ou binário, como CBOR e Protobuf), versão do esquema e, em cada mensagem, um id e o horário da medição no dispositivo.",
          },
          {
            titulo: "5. Dados",
            texto:
              "Série temporal para o histórico (retenção e agregações) e um registro do **estado atual** de cada dispositivo (última leitura, última vez visto, firmware). Entre o broker e o armazenamento, uma fila ou stream absorve os picos sem perder mensagens.",
          },
          {
            titulo: "6. Operação e segurança",
            texto:
              "Identidade por dispositivo (certificado, TLS mútuo), credenciais revogáveis, atualização **OTA** assinada, monitoramento da frota (quem está offline), reconexão com backoff e jitter e deduplicação na ingestão, porque o QoS 1 entrega pelo menos uma vez.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Onde o Node.js cabe",
        colunas: ["Papel", "O que faz", "Por que o Node.js", "Cuidado"],
        linhas: [
          [
            "Gateway ou borda",
            "Lê sensores por BLE, serial ou Modbus, agrega, filtra e envia à nuvem",
            "E/S assíncrona e muitos pacotes npm de protocolos (como `mqtt` e `serialport`)",
            "Roda em placas com sistema operacional (em geral Linux), como o Raspberry Pi; CPU, memória e energia são limitadas",
          ],
          [
            "Backend de ingestão",
            "Assina o broker, valida, deduplica e enfileira as mensagens",
            "Muitas conexões e mensagens concorrentes, em trabalho dominado por E/S",
            "Não faça processamento pesado no handler (use workers; veja L73)",
          ],
          [
            "API e painel em tempo real",
            "Expõe dados e comandos e envia atualizações por WebSocket ou SSE",
            "A mesma linguagem no servidor e no painel; bom para tempo real",
            "Conexões longas pedem balanceamento adequado (veja D64)",
          ],
          [
            "Protótipo e bancada",
            "Prova de conceito e simulador de dispositivos",
            "Rápido de montar",
            "Protótipo não é produto: segurança e atualização contam desde o começo",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Uma leitura, do sensor ao painel (com queda de conexão)",
        etapas: [
          "O sensor mede e o dispositivo (ou o gateway) grava a leitura, com id e horário, num buffer local",
          "Com rede, publica no tópico MQTT com QoS 1; sem rede, o buffer cresce até um limite e descarta primeiro o que menos importa",
          "Ao reconectar (com backoff e jitter, para todos não derrubarem o broker de uma vez), reenvia o buffer em ordem",
          "O broker entrega ao serviço Node.js de ingestão, que valida o esquema e descarta duplicatas pelo id",
          "A leitura vai para uma fila ou stream e, de lá, em lotes, para o banco de séries temporais; o estado atual do dispositivo é atualizado",
          "A API e o painel leem o banco e recebem eventos novos por WebSocket; os comandos fazem o caminho inverso, no tópico de comandos",
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Onde o Node.js entra",
        texto:
          "**Node.js no gateway e na nuvem, não no sensor.** Microcontroladores minúsculos usam firmware em C ou C++ (ou runtimes próprios); o Node.js pede um sistema operacional e uma memória que só aparecem em placas maiores. A força dele aqui é a E/S assíncrona: muitos dispositivos, muitas conexões e pouco processamento por mensagem.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Segurança e confiança",
        texto:
          "Dispositivos ficam em campo, expostos fisicamente e por muito tempo. Nada de senha padrão nem de segredo igual em todos: use identidade própria por dispositivo, TLS, privilégio mínimo nos tópicos (cada um só publica no seu) e atualização OTA assinada, com possibilidade de voltar atrás. Trate toda mensagem como entrada não confiável (valide esquema e limites) e não confie no relógio do dispositivo: guarde também o horário de chegada.",
      },
    ],
    armadilhas: [
      "Querer rodar o Node.js em microcontroladores com poucos recursos: ele pede um sistema operacional completo e mais memória.",
      "Supor rede estável: sem buffer offline, reconexão com backoff e QoS adequado, as leituras se perdem (ou todos reconectam juntos e derrubam o broker).",
      "Usar QoS “pelo menos uma vez” sem deduplicar: a mesma leitura entra duas vezes.",
      "Deixar a segurança para depois: credencial compartilhada, sem TLS e sem atualização remota é a receita para uma frota comprometida.",
    ],
    autoteste: [
      {
        pergunta: "Por que MQTT em vez de HTTP para a telemetria de muitos dispositivos?",
        resposta:
          "O MQTT é leve, mantém uma conexão aberta, usa publica e assina (o dispositivo publica sem saber quem consome) e oferece níveis de QoS e mensagem de última vontade. O HTTP funciona, mas cada requisição repete cabeçalhos e custa mais em rede e energia, e o servidor não envia comandos ao dispositivo sem polling ou uma conexão longa.",
      },
      {
        pergunta: "O que muda entre QoS 0, 1 e 2, e qual obriga a deduplicar?",
        resposta:
          "No 0, a entrega é no máximo uma vez (pode perder). No 1, pelo menos uma vez (pode duplicar, então deduplique pelo id). No 2, exatamente uma vez no protocolo, ao custo de mais trocas de mensagens. Na prática, QoS 1 com ingestão idempotente costuma ser o equilíbrio.",
      },
    ],
  },
  en: {
    titulo: "Node.js for IoT",
    pergunta: "How is Node.js used in IoT (Internet of Things)?",
    porqueEsteMetodo:
      "The most useful answer to “how is it used in IoT?” is a design of the whole system, which shows where Node.js fits and where it doesn’t. The design script avoids listing protocols without connecting them.",
    resposta30s:
      "In IoT, Node.js usually sits **at the gateway or edge** (a Raspberry Pi or similar that talks to sensors over BLE, serial or MQTT), **in the ingestion backend** (subscribes to an **MQTT broker**, validates and queues messages from many devices) and **in real-time dashboards**; it does not run on microcontrollers. The typical design is **devices → MQTT broker → ingestion service → queue or stream → time-series database → API and dashboard**. The central considerations are limited resources, **intermittent connectivity** (reconnection, offline buffer, QoS), security (TLS, per-device certificate, OTA updates) and volume.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "Functional: receive telemetry, send commands to devices, alert, show dashboards and history. Non-functional: many devices at once, connections that drop, security, command latency, data retention and bandwidth and energy cost.",
          },
          {
            titulo: "2. Estimates",
            texto:
              "Devices × frequency × message size. Hypothetical example: 100 thousand devices sending one reading per minute are about 1.7 thousand messages per second, with larger spikes when they all reconnect together after an outage. The math guides sizing of the broker and the queue, and shows why database writes should be batched.",
          },
          {
            titulo: "3. Central decision: protocol and roles",
            texto:
              "**MQTT**: publish and subscribe, lightweight, with QoS levels, persistent sessions and a last-will message. A broker receives from the devices; Node.js appears in the gateway (translating BLE, serial or Modbus) and in ingestion (an MQTT client subscribing to topics). HTTP and WebSocket suit those with bandwidth and energy; CoAP suits very constrained devices.",
          },
          {
            titulo: "4. Contract",
            texto:
              "Hierarchical topics (`devices/{id}/telemetry`, `devices/{id}/commands`), a compact format (lean JSON or binary, such as CBOR and Protobuf), a schema version and, in every message, an id and the time of measurement on the device.",
          },
          {
            titulo: "5. Data",
            texto:
              "A time series for history (retention and aggregations) and a record of each device’s **current state** (last reading, last seen, firmware). Between the broker and storage, a queue or stream absorbs spikes without losing messages.",
          },
          {
            titulo: "6. Operations and security",
            texto:
              "A per-device identity (certificate, mutual TLS), revocable credentials, signed **OTA** updates, fleet monitoring (who is offline), reconnection with backoff and jitter and deduplication at ingestion, because QoS 1 delivers at least once.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Where Node.js fits",
        colunas: ["Role", "What it does", "Why Node.js", "Watch out for"],
        linhas: [
          [
            "Gateway or edge",
            "Reads sensors over BLE, serial or Modbus, aggregates, filters and sends to the cloud",
            "Asynchronous I/O and many npm packages for protocols (such as `mqtt` and `serialport`)",
            "Runs on boards with an operating system (usually Linux), like the Raspberry Pi; CPU, memory and energy are limited",
          ],
          [
            "Ingestion backend",
            "Subscribes to the broker, validates, deduplicates and queues messages",
            "Many concurrent connections and messages, in I/O-dominated work",
            "Don’t do heavy processing in the handler (use workers; see L73)",
          ],
          [
            "Real-time API and dashboard",
            "Exposes data and commands and pushes updates over WebSocket or SSE",
            "The same language on server and dashboard; good for real time",
            "Long-lived connections need proper load balancing (see D64)",
          ],
          [
            "Prototype and workbench",
            "Proof of concept and device simulator",
            "Quick to put together",
            "A prototype is not a product: security and updates count from the start",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "One reading, from sensor to dashboard (with a dropped connection)",
        etapas: [
          "The sensor measures and the device (or gateway) records the reading, with id and time, in a local buffer",
          "With a network, it publishes to the MQTT topic with QoS 1; without one, the buffer grows to a limit and drops the least important first",
          "On reconnecting (with backoff and jitter, so they don’t all knock the broker down at once), it resends the buffer in order",
          "The broker delivers to the Node.js ingestion service, which validates the schema and discards duplicates by id",
          "The reading goes to a queue or stream and from there, in batches, to the time-series database; the device’s current state is updated",
          "The API and dashboard read the database and receive new events over WebSocket; commands take the reverse path, on the commands topic",
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Where Node.js comes in",
        texto:
          "**Node.js at the gateway and in the cloud, not on the sensor.** Tiny microcontrollers use firmware in C or C++ (or their own runtimes); Node.js needs an operating system and a memory size that only appear on larger boards. Its strength here is asynchronous I/O: many devices, many connections and little processing per message.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Security and trust",
        texto:
          "Devices sit in the field, physically exposed and for a long time. No default passwords or identical secrets on all of them: use a per-device identity, TLS, least privilege on topics (each one publishes only to its own) and signed OTA updates, with the ability to go back. Treat every message as untrusted input (validate schema and limits) and don’t trust the device’s clock: store the arrival time too.",
      },
    ],
    armadilhas: [
      "Trying to run Node.js on resource-poor microcontrollers: it needs a full operating system and more memory.",
      "Assuming a stable network: without an offline buffer, reconnection with backoff and a suitable QoS, readings are lost (or everyone reconnects together and knocks the broker down).",
      "Using “at least once” QoS without deduplicating: the same reading goes in twice.",
      "Leaving security for later: shared credentials, no TLS and no remote updates are the recipe for a compromised fleet.",
    ],
    autoteste: [
      {
        pergunta: "Why MQTT instead of HTTP for telemetry from many devices?",
        resposta:
          "MQTT is lightweight, keeps a connection open, uses publish and subscribe (the device publishes without knowing who consumes) and offers QoS levels and a last-will message. HTTP works, but each request repeats headers and costs more in network and energy, and the server cannot send commands to the device without polling or a long-lived connection.",
      },
      {
        pergunta: "What changes between QoS 0, 1 and 2, and which one forces you to deduplicate?",
        resposta:
          "At 0, delivery is at most once (it can be lost). At 1, at least once (it can duplicate, so deduplicate by id). At 2, exactly once within the protocol, at the cost of more message exchanges. In practice, QoS 1 with idempotent ingestion is usually the balance.",
      },
    ],
  },
};
