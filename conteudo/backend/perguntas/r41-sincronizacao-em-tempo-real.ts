import type { Pergunta } from "../../tipos";

// R41 · Sincronização em tempo real
export const r41: Pergunta = {
  numero: 141,
  modulo: "roadmap-avancado",
  metodo: "firstprinciples",
  pt: {
    titulo: "Sincronização em tempo real",
    pergunta:
      "Como você arquitetaria um backend para suportar sincronização de dados em tempo real entre dispositivos?",
    porqueEsteMetodo:
      "Sincronização em tempo real é uma sequência de problemas encadeados (latência, escala, offline, conflito). Construir do zero mostra qual tecnologia resolve cada um.",
    resposta30s:
      "Troque o **polling** por um canal **bidirecional (WebSocket)** ou de empurrar (SSE), propague as mudanças entre servidores com **pub/sub** (Redis, Kafka, NATS), dê a cada alteração uma **versão** para **ressincronizar** quem reconecta, e resolva os **conflitos de edição simultânea** com **last-write-wins**, **OT** (Operational Transformation) ou **CRDTs**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma restrição por vez",
        passos: [
          {
            titulo: "0. O problema",
            texto:
              "Vários dispositivos veem e alteram os mesmos dados, e cada um deve refletir a mudança dos outros quase na hora.",
          },
          {
            titulo: "1. Polling",
            texto: "Cada cliente pergunta a cada N segundos. Simples, mas atrasa e desperdiça requisições.",
          },
          {
            titulo: "2. Canal bidirecional",
            texto:
              "**WebSocket** (ou SSE, só servidor → cliente) mantém uma conexão aberta e o servidor empurra as mudanças.",
          },
          {
            titulo: "3. Distribuir entre servidores",
            texto:
              "Com muitos servidores, quem recebe a mudança nem sempre é quem tem o outro cliente conectado: um **pub/sub** (Redis, Kafka, NATS) propaga o evento a todos.",
          },
          {
            titulo: "4. Offline e reconexão",
            texto:
              "Cada alteração tem ID e versão; ao reconectar, o cliente pede “o que mudou desde a versão X” (log de mudanças com número de sequência).",
          },
          {
            titulo: "5. Conflitos",
            texto:
              "Dois dispositivos editam o mesmo dado: *last write wins* (simples, mas perde dados), **Operational Transformation** (edição colaborativa de texto), **CRDTs** (estruturas que convergem sem coordenação) ou resolução manual.",
          },
          {
            titulo: "6. Escala e confiabilidade",
            texto:
              "Particionar as conexões, heartbeats, backpressure, entrega ao menos uma vez com deduplicação por ID e ordenação por sequência.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Escolha do canal",
        colunas: ["Opção", "Direção", "Quando"],
        linhas: [
          ["Polling", "Cliente → servidor", "Pouca frequência; simplicidade"],
          ["Long polling", "Cliente → servidor (espera)", "Compatibilidade, sem WebSocket"],
          ["SSE", "Servidor → cliente", "Feeds, notificações, painéis"],
          ["WebSocket", "Bidirecional", "Chat, edição colaborativa, jogos"],
        ],
      },
    ],
    armadilhas: [
      "Last-write-wins em dados que não podem perder alterações.",
      "Sem reconexão e ressincronização: o cliente fica defasado.",
      "Estado de conexões preso a um servidor, sem pub/sub.",
      "Achar que o WebSocket resolve conflito: ele só transporta.",
    ],
    autoteste: [
      {
        pergunta: "Por que um pub/sub é necessário ao escalar WebSockets?",
        resposta:
          "Porque clientes conectados a servidores diferentes precisam receber as mesmas mudanças; o pub/sub propaga o evento entre os servidores.",
      },
      {
        pergunta: "O que é um CRDT?",
        resposta:
          "Uma estrutura de dados replicada que garante a convergência dos estados em todas as réplicas, sem coordenação central, mesmo com edições concorrentes.",
      },
    ],
  },
  en: {
    titulo: "Real-time synchronization",
    pergunta: "How would you architect a backend to support real-time data synchronization across devices?",
    porqueEsteMetodo:
      "Real-time sync is a chain of linked problems (latency, scale, offline, conflict). Building from scratch shows which technology solves each one.",
    resposta30s:
      "Replace **polling** with a **bidirectional (WebSocket)** or push (SSE) channel, propagate changes between servers with **pub/sub** (Redis, Kafka, NATS), give each change a **version** to **resync** whoever reconnects, and resolve **simultaneous-edit conflicts** with **last-write-wins**, **OT** (Operational Transformation) or **CRDTs**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building up, one constraint at a time",
        passos: [
          {
            titulo: "0. The problem",
            texto:
              "Several devices see and change the same data, and each must reflect the others’ changes almost instantly.",
          },
          {
            titulo: "1. Polling",
            texto: "Each client asks every N seconds. Simple, but delayed and wasteful.",
          },
          {
            titulo: "2. Bidirectional channel",
            texto:
              "**WebSocket** (or SSE, server → client only) keeps a connection open and the server pushes the changes.",
          },
          {
            titulo: "3. Distribute across servers",
            texto:
              "With many servers, the one receiving the change is not always the one holding the other client’s connection: a **pub/sub** (Redis, Kafka, NATS) propagates the event to all.",
          },
          {
            titulo: "4. Offline and reconnection",
            texto:
              "Each change has an ID and version; on reconnect the client asks “what changed since version X” (a change log with a sequence number).",
          },
          {
            titulo: "5. Conflicts",
            texto:
              "Two devices edit the same data: *last write wins* (simple, but loses data), **Operational Transformation** (collaborative text editing), **CRDTs** (structures that converge without coordination) or manual resolution.",
          },
          {
            titulo: "6. Scale and reliability",
            texto:
              "Partition connections, heartbeats, backpressure, at-least-once delivery with ID deduplication and ordering by sequence.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Choosing the channel",
        colunas: ["Option", "Direction", "When"],
        linhas: [
          ["Polling", "Client → server", "Low frequency; simplicity"],
          ["Long polling", "Client → server (waiting)", "Compatibility, no WebSocket"],
          ["SSE", "Server → client", "Feeds, notifications, dashboards"],
          ["WebSocket", "Bidirectional", "Chat, collaborative editing, games"],
        ],
      },
    ],
    armadilhas: [
      "Last-write-wins on data that cannot lose changes.",
      "No reconnection and resync: the client falls behind.",
      "Connection state tied to one server, with no pub/sub.",
      "Believing WebSocket solves conflicts: it only transports.",
    ],
    autoteste: [
      {
        pergunta: "Why is a pub/sub needed when scaling WebSockets?",
        resposta:
          "Because clients connected to different servers must receive the same changes; the pub/sub propagates the event across servers.",
      },
      {
        pergunta: "What is a CRDT?",
        resposta:
          "A replicated data structure that guarantees states converge on all replicas, without central coordination, even with concurrent edits.",
      },
    ],
  },
};
