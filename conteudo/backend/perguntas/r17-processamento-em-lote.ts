import type { Pergunta } from "../../tipos";

// R17 · Processamento em lote
export const r17: Pergunta = {
  numero: 117,
  modulo: "roadmap-intermediario",
  metodo: "playbook",
  pt: {
    titulo: "Processamento em lote",
    pergunta: "Como você abordaria o processamento em lote (batch) numa aplicação que lida com muitos dados?",
    porqueEsteMetodo:
      "Batch é uma sequência de decisões de projeto (dividir, paralelizar, retomar, tratar erros). O playbook mostra o que decidir em cada etapa.",
    resposta30s:
      "Divida o trabalho em **pedaços (chunks)**, **paralelize** por chave ou intervalo (para volumes muito grandes, **Spark** ou **Hadoop**), torne cada pedaço **idempotente e reiniciável** com checkpoints, trate **erros por registro** sem derrubar o lote, **proteja os sistemas ao redor** (taxa, réplicas, horário) e **monitore** progresso e duração.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Defina o que é lote e quando roda",
            texto:
              "Volume grande sem resposta imediata (fechamentos, relatórios, ETL, reprocessamentos), numa janela agendada ou sob demanda.",
          },
          {
            titulo: "Divida em chunks",
            texto:
              "Leia e processe por blocos (por exemplo, 1.000 registros) para limitar a memória e permitir paralelismo.",
          },
          {
            titulo: "Paralelize",
            texto:
              "Particione por chave ou intervalo e use vários workers. Para volumes enormes, processamento distribuído (Spark, Hadoop) ou serviços gerenciados (AWS Batch, Dataflow).",
          },
          {
            titulo: "Idempotente e reiniciável",
            texto:
              "Checkpoint do último bloco concluído; reprocessar o mesmo bloco não duplica efeito (upsert, chaves únicas).",
          },
          {
            titulo: "Erros por registro",
            texto: "O registro ruim vai para uma fila ou tabela de erros sem derrubar o lote; relatório ao final.",
          },
          {
            titulo: "Proteja os vizinhos",
            texto: "Limite a taxa de leitura e escrita, prefira réplica de leitura, rode fora do horário de pico.",
          },
          {
            titulo: "Monitore",
            texto: "Progresso, duração e taxa de erro, com alerta se não terminar a tempo.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Batch vs stream",
        texto:
          "**Batch** processa dados acumulados em intervalos (alta vazão, latência de minutos a horas). **Stream** processa cada evento ao chegar (baixa latência). Escolha pela latência que o negócio exige.",
      },
    ],
    armadilhas: [
      "Carregar o conjunto inteiro na memória.",
      "Lote que falha no meio e recomeça do zero (sem checkpoint).",
      "Rodar contra o banco principal em horário de pico.",
      "Lote não idempotente: reexecutar duplica dados.",
    ],
    autoteste: [
      {
        pergunta: "Por que processar em chunks?",
        resposta: "Limita o uso de memória, permite paralelizar e retomar do último chunk concluído.",
      },
      {
        pergunta: "Quando usar Spark em vez de um script simples?",
        resposta:
          "Quando o volume excede o que uma máquina processa em tempo aceitável e é preciso distribuir o trabalho.",
      },
    ],
  },
  en: {
    titulo: "Batch processing",
    pergunta: "How would you approach batch processing in a data-heavy application?",
    porqueEsteMetodo:
      "Batch is a sequence of design decisions (split, parallelize, resume, handle errors). The playbook shows what to decide at each stage.",
    resposta30s:
      "Split the work into **chunks**, **parallelize** by key or range (for very large volumes, **Spark** or **Hadoop**), make each chunk **idempotent and restartable** with checkpoints, handle **per-record errors** without killing the batch, **protect surrounding systems** (rate, replicas, schedule) and **monitor** progress and duration.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Define what a batch is and when it runs",
            texto:
              "Large volume with no immediate answer (closings, reports, ETL, reprocessing), in a scheduled window or on demand.",
          },
          {
            titulo: "Split into chunks",
            texto: "Read and process in blocks (for example 1,000 records) to bound memory and allow parallelism.",
          },
          {
            titulo: "Parallelize",
            texto:
              "Partition by key or range and use several workers. For huge volumes, distributed processing (Spark, Hadoop) or managed services (AWS Batch, Dataflow).",
          },
          {
            titulo: "Idempotent and restartable",
            texto:
              "Checkpoint the last completed block; reprocessing the same block does not duplicate effects (upsert, unique keys).",
          },
          {
            titulo: "Per-record errors",
            texto: "The bad record goes to an error queue or table without killing the batch; a report at the end.",
          },
          {
            titulo: "Protect the neighbors",
            texto: "Limit read and write rate, prefer a read replica, run outside peak hours.",
          },
          {
            titulo: "Monitor",
            texto: "Progress, duration and error rate, with an alert if it does not finish in time.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Batch vs stream",
        texto:
          "**Batch** processes accumulated data at intervals (high throughput, minutes-to-hours latency). **Stream** processes each event as it arrives (low latency). Choose by the latency the business needs.",
      },
    ],
    armadilhas: [
      "Loading the whole dataset into memory.",
      "A batch that fails midway and restarts from zero (no checkpoint).",
      "Running against the main database at peak time.",
      "A non-idempotent batch: rerunning duplicates data.",
    ],
    autoteste: [
      {
        pergunta: "Why process in chunks?",
        resposta: "It bounds memory use, allows parallelism and lets you resume from the last completed chunk.",
      },
      {
        pergunta: "When use Spark instead of a simple script?",
        resposta:
          "When the volume exceeds what one machine can process in acceptable time and the work must be distributed.",
      },
    ],
  },
};
