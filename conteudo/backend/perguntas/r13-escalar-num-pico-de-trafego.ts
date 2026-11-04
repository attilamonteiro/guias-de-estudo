import type { Pergunta } from "../../tipos";

// R13 · Escalar num pico de tráfego
export const r13: Pergunta = {
  numero: 113,
  modulo: "roadmap-iniciante",
  metodo: "playbook",
  pt: {
    titulo: "Escalar num pico de tráfego",
    pergunta: "Como você escalaria uma aplicação backend durante um pico de tráfego?",
    porqueEsteMetodo:
      "Um pico tem antes, durante e depois. Um playbook por fase mostra o que preparar para que a escala funcione no momento em que for preciso.",
    resposta30s:
      "A resposta direta é **escala horizontal**: várias instâncias **stateless** atrás de um **balanceador de carga**, com **autoscaling**. Prepare antes (stateless, cache, fila, réplicas de leitura), adicione instâncias durante o pico, **proteja o essencial** (rate limit, load shedding, degradação graciosa) e aprenda depois. Lembre que o banco costuma ser o próximo gargalo. Para a conta completa, veja a Q15.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Antes: aplicação stateless",
            texto: "Sessão fora do processo e nada de arquivos locais: qualquer instância atende qualquer requisição.",
          },
          {
            titulo: "Antes: autoscaling",
            texto:
              "Várias instâncias atrás de um balanceador, com regra de escala por CPU, requisições por instância ou latência, e um mínimo de instâncias aquecidas.",
          },
          {
            titulo: "Antes: alivie o que é caro",
            texto:
              "Cache e CDN para leituras repetidas, fila para o que pode esperar, réplicas de leitura e pool de conexões.",
          },
          {
            titulo: "Durante: escala horizontal",
            texto: "Mais cópias atrás do balanceador. Atenção ao tempo de subida e ao próximo gargalo, o banco.",
          },
          {
            titulo: "Durante: proteja o essencial",
            texto:
              "Rate limit, load shedding (descartar o menos importante), degradação graciosa (desligar recursos opcionais) e backpressure.",
          },
          {
            titulo: "Depois: aprenda",
            texto: "Teste de carga com o pico observado, revise limites e alertas, ajuste a capacidade mínima.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Vertical vs horizontal",
        texto:
          "Escala **vertical** (máquina maior) é rápida, mas tem teto e costuma exigir reinício. **Horizontal** (mais instâncias) é a resposta para picos, e só funciona bem com aplicação stateless.",
      },
    ],
    armadilhas: [
      "Escalar a aplicação e esquecer o banco, que satura primeiro.",
      "Autoscaling lento: a instância nova chega depois do pico.",
      "Estado em memória que impede escalar horizontalmente.",
      "Escalar sem proteção: o custo dispara e um ataque também passa a ser atendido.",
    ],
    autoteste: [
      {
        pergunta: "Por que a aplicação precisa ser stateless para escalar horizontalmente?",
        resposta:
          "Porque qualquer instância tem de poder atender qualquer requisição; estado local prende o usuário a uma máquina.",
      },
      {
        pergunta: "O que fazer quando o pico passa da capacidade mesmo escalando?",
        resposta: "Proteger o essencial: rate limit, load shedding e degradação graciosa.",
      },
    ],
  },
  en: {
    titulo: "Scaling during a traffic surge",
    pergunta: "How would you scale a backend application during a traffic surge?",
    porqueEsteMetodo:
      "A surge has a before, a during and an after. A playbook by phase shows what to prepare so scaling works at the moment it is needed.",
    resposta30s:
      "The direct answer is **horizontal scaling**: several **stateless** instances behind a **load balancer**, with **autoscaling**. Prepare ahead (stateless, cache, queue, read replicas), add instances during the surge, **protect the essentials** (rate limiting, load shedding, graceful degradation) and learn afterwards. Remember the database is often the next bottleneck. For the full math, see Q15.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Before: stateless application",
            texto: "Session outside the process and no local files: any instance serves any request.",
          },
          {
            titulo: "Before: autoscaling",
            texto:
              "Several instances behind a load balancer, with a scaling rule on CPU, requests per instance or latency, and a minimum of warm instances.",
          },
          {
            titulo: "Before: relieve what is expensive",
            texto: "Cache and CDN for repeated reads, a queue for what can wait, read replicas and connection pooling.",
          },
          {
            titulo: "During: horizontal scaling",
            texto: "More copies behind the load balancer. Mind startup time and the next bottleneck, the database.",
          },
          {
            titulo: "During: protect the essentials",
            texto:
              "Rate limiting, load shedding (drop the least important), graceful degradation (turn off optional features) and backpressure.",
          },
          {
            titulo: "After: learn",
            texto: "Load test with the observed peak, review limits and alerts, adjust minimum capacity.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Vertical vs horizontal",
        texto:
          "**Vertical** scaling (a bigger machine) is quick but has a ceiling and usually needs a restart. **Horizontal** (more instances) is the answer to surges, and works well only with a stateless application.",
      },
    ],
    armadilhas: [
      "Scaling the application and forgetting the database, which saturates first.",
      "Slow autoscaling: the new instance arrives after the surge.",
      "In-memory state that blocks horizontal scaling.",
      "Scaling without protection: costs spike and an attack also gets served.",
    ],
    autoteste: [
      {
        pergunta: "Why must the application be stateless to scale horizontally?",
        resposta: "Because any instance must be able to serve any request; local state ties the user to one machine.",
      },
      {
        pergunta: "What do you do when the surge exceeds capacity even after scaling?",
        resposta: "Protect the essentials: rate limiting, load shedding and graceful degradation.",
      },
    ],
  },
};
