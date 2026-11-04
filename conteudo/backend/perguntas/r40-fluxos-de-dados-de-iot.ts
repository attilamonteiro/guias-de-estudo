import type { Pergunta } from "../../tipos";

// R40 · Fluxos de dados de IoT
export const r40: Pergunta = {
  numero: 140,
  modulo: "roadmap-avancado",
  metodo: "design",
  pt: {
    titulo: "Fluxos de dados de IoT",
    pergunta: "Explique como você desenvolveria um sistema backend para tratar fluxos de dados de dispositivos IoT.",
    porqueEsteMetodo:
      "Um sistema de IoT é um produto completo (ingestão, processamento, armazenamento, consulta). O roteiro de system design cobre cada camada na ordem e evita esquecer números e gargalos.",
    resposta30s:
      "A arquitetura típica: dispositivos publicam por **MQTT** num broker/gateway IoT, um **log durável (Kafka/Kinesis)** absorve os picos, um **processador de fluxo (Flink/Spark Streaming)** valida, agrega e detecta anomalias, e os dados vão para um **banco de séries temporais** (consultas recentes) e um **data lake** (histórico barato). Cuide de **autenticação por dispositivo**, mensagens **duplicadas e fora de ordem**, dispositivos **offline** e atualização remota (OTA).",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Arquitetura",
        etapas: [
          "Dispositivos",
          "Broker MQTT / gateway IoT",
          "Kafka (buffer durável)",
          "Processamento em fluxo",
          "Série temporal (quente) + data lake (frio)",
          "API, dashboards e alertas",
        ],
      },
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Quantos dispositivos e mensagens por segundo? Tamanho, latência (alertas em tempo real?), retenção, conectividade instável, comandos de volta ao dispositivo?",
          },
          {
            titulo: "2. Estimativas",
            texto:
              "Exemplo: 1 milhão de dispositivos × 1 mensagem a cada 10 s = 100 mil mensagens/s; 200 B cada ≈ 20 MB/s ≈ 1,7 TB/dia. Isso dimensiona ingestão e armazenamento.",
          },
          {
            titulo: "3. Ingestão",
            texto:
              "Protocolo leve: **MQTT** (publish/subscribe, níveis de QoS) ou CoAP; broker/gateway IoT (AWS IoT Core, EMQX, Azure IoT Hub); autenticação por dispositivo (certificados).",
          },
          {
            titulo: "4. Buffer durável",
            texto:
              "Um log distribuído (**Kafka**, Kinesis, Pub/Sub) absorve picos e desacopla quem produz de quem processa.",
          },
          {
            titulo: "5. Processamento",
            texto:
              "Em fluxo (Flink, Spark Streaming, Kafka Streams): validar, enriquecer, agregar por janela, detectar anomalias e disparar alertas.",
          },
          {
            titulo: "6. Armazenamento",
            texto:
              "**Quente**: banco de séries temporais (InfluxDB, TimescaleDB) para consultas recentes. **Frio**: data lake barato (S3/Parquet) para histórico e analytics, com redução de resolução por idade.",
          },
          {
            titulo: "7. Consulta e ação",
            texto: "API e dashboards; comandos de volta ao dispositivo por tópicos.",
          },
          {
            titulo: "8. Gargalos e robustez",
            texto:
              "Reconexões em massa, mensagens duplicadas ou fora de ordem (timestamp do dispositivo + idempotência), dispositivos offline com buffer local, segurança e atualização remota (OTA).",
          },
        ],
      },
    ],
    armadilhas: [
      "HTTP pesado em dispositivos com bateria e rede ruins.",
      "Sem buffer entre a ingestão e o processamento: o pico derruba tudo.",
      "Usar o relógio do dispositivo como verdade, sem tratar atraso e desvio.",
      "Guardar tudo em alta resolução para sempre (custo).",
    ],
    autoteste: [
      {
        pergunta: "Por que usar MQTT em vez de HTTP em IoT?",
        resposta:
          "É leve, mantém a conexão, usa publish/subscribe e tem níveis de QoS, adequado a dispositivos com pouca banda e energia.",
      },
      {
        pergunta: "Por que separar armazenamento quente e frio?",
        resposta:
          "Consultas recentes precisam de um banco rápido (série temporal); o histórico fica em armazenamento barato, com resolução reduzida.",
      },
    ],
  },
  en: {
    titulo: "IoT data streams",
    pergunta: "Explain how you would develop a backend system for handling IoT device data streams.",
    porqueEsteMetodo:
      "An IoT system is a whole product (ingestion, processing, storage, querying). The system-design script covers each layer in order and avoids forgetting numbers and bottlenecks.",
    resposta30s:
      "The typical architecture: devices publish over **MQTT** to an IoT broker/gateway, a **durable log (Kafka/Kinesis)** absorbs the spikes, a **stream processor (Flink/Spark Streaming)** validates, aggregates and detects anomalies, and data goes to a **time-series database** (recent queries) and a **data lake** (cheap history). Take care of **per-device authentication**, **duplicate and out-of-order** messages, **offline** devices and remote updates (OTA).",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Architecture",
        etapas: [
          "Devices",
          "MQTT broker / IoT gateway",
          "Kafka (durable buffer)",
          "Stream processing",
          "Time series (hot) + data lake (cold)",
          "API, dashboards and alerts",
        ],
      },
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "How many devices and messages per second? Size, latency (real-time alerts?), retention, unstable connectivity, commands back to the device?",
          },
          {
            titulo: "2. Estimates",
            texto:
              "Example: 1 million devices × 1 message every 10 s = 100 thousand messages/s; 200 B each ≈ 20 MB/s ≈ 1.7 TB/day. This sizes ingestion and storage.",
          },
          {
            titulo: "3. Ingestion",
            texto:
              "A light protocol: **MQTT** (publish/subscribe, QoS levels) or CoAP; an IoT broker/gateway (AWS IoT Core, EMQX, Azure IoT Hub); per-device authentication (certificates).",
          },
          {
            titulo: "4. Durable buffer",
            texto:
              "A distributed log (**Kafka**, Kinesis, Pub/Sub) absorbs spikes and decouples producers from processors.",
          },
          {
            titulo: "5. Processing",
            texto:
              "Streaming (Flink, Spark Streaming, Kafka Streams): validate, enrich, aggregate by window, detect anomalies and fire alerts.",
          },
          {
            titulo: "6. Storage",
            texto:
              "**Hot**: a time-series database (InfluxDB, TimescaleDB) for recent queries. **Cold**: a cheap data lake (S3/Parquet) for history and analytics, with downsampling by age.",
          },
          {
            titulo: "7. Query and action",
            texto: "API and dashboards; commands back to the device through topics.",
          },
          {
            titulo: "8. Bottlenecks and robustness",
            texto:
              "Mass reconnections, duplicate or out-of-order messages (device timestamp + idempotency), offline devices with local buffering, security and remote updates (OTA).",
          },
        ],
      },
    ],
    armadilhas: [
      "Heavy HTTP on battery-powered devices with poor networks.",
      "No buffer between ingestion and processing: the spike takes everything down.",
      "Using the device clock as truth without handling delay and drift.",
      "Keeping everything at high resolution forever (cost).",
    ],
    autoteste: [
      {
        pergunta: "Why use MQTT instead of HTTP in IoT?",
        resposta:
          "It is light, keeps the connection, uses publish/subscribe and has QoS levels, suited to devices with little bandwidth and power.",
      },
      {
        pergunta: "Why separate hot and cold storage?",
        resposta:
          "Recent queries need a fast database (time series); history sits in cheap storage, at reduced resolution.",
      },
    ],
  },
};
