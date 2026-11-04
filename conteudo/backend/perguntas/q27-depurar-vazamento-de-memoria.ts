import type { Pergunta } from "../../tipos";

// Q27 · Depurar vazamento de memória
export const q27: Pergunta = {
  numero: 27,
  modulo: "confiabilidade",
  metodo: "playbook",
  pt: {
    titulo: "Depurar vazamento de memória",
    pergunta: "Como depurar um vazamento de memória em um aplicativo backend?",
    porqueEsteMetodo:
      "Depurar é um procedimento investigativo: confirmar o sintoma, isolar, coletar evidência, achar quem segura a referência, corrigir e verificar. A ordem evita o erro clássico de mexer no código antes de provar a causa.",
    resposta30s:
      "Confirme que a memória **sobe continuamente e não volta depois do GC**; isole o endpoint ou a versão responsável; tire **heap snapshots em momentos diferentes e compare**; siga o **caminho de retenção** até quem segura a referência (coleção estática, listener, timer, closure, recurso não fechado); corrija, e confirme com um **teste de longa duração (soak)** em que a curva estabiliza. Reiniciar o processo é paliativo, não correção.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Confirme que é um vazamento",
            texto:
              "Memória (RSS/heap) que sobe de forma contínua e **não volta depois do GC**, nem com a carga baixa: um dente de serra com o piso subindo. Descarte crescimento legítimo (cache, aquecimento), fragmentação e heap grande por configuração.",
          },
          {
            titulo: "Reproduza e isole",
            texto:
              "Teste de carga em ambiente controlado. Faça bissecção: qual endpoint, qual versão do deploy, qual funcionalidade faz a curva subir?",
          },
          {
            titulo: "Capture evidência no tempo",
            texto:
              "Tire **heap snapshots** em momentos diferentes (T0, T1, T2), com a mesma carga no meio, e compare: o que cresceu?",
          },
          {
            titulo: "Descubra quem segura a referência",
            texto:
              "Veja o tipo de objeto que cresce e o caminho de retenção (retainers / dominator tree) até uma raiz: um mapa estático, um listener, um timer…",
          },
          {
            titulo: "Corrija a causa",
            texto:
              "Limite coleções (LRU, TTL, `WeakMap`/`WeakRef`), remova listeners e timers, feche streams e conexões em `finally`, use pools.",
          },
          {
            titulo: "Verifique",
            texto: "Repita o teste de longa duração (soak): a curva deve estabilizar.",
          },
          {
            titulo: "Previna",
            texto:
              "Alertas de memória e de reinícios por OOM, limites de memória no contêiner, soak test antes de releases importantes. Reiniciar periodicamente é paliativo.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Causas mais comuns",
        colunas: ["Causa", "Exemplo"],
        linhas: [
          ["Coleção global sem limite", "Cache em `Map` sem TTL; lista de “últimos pedidos” que só cresce"],
          ["Listeners e assinaturas não removidos", "`emitter.on(...)` a cada requisição, sem `off`"],
          ["Timers e intervals esquecidos", "`setInterval` que referencia objetos grandes"],
          ["Closures que capturam demais", "Callback que segura a resposta HTTP inteira"],
          ["Recursos não fechados", "Conexões, streams, arquivos, cursores"],
          ["Memória fora do heap", "Buffers nativos, bibliotecas em C"],
          ["Sessões e filas sem expiração", "Acumulam por usuário"],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Ferramentas por plataforma",
        colunas: ["Plataforma", "Como capturar e analisar"],
        linhas: [
          ["Node.js", "`node --inspect` + Chrome DevTools (aba Memory), `v8.writeHeapSnapshot()`, clinic.js"],
          ["Java / JVM", "`jcmd <pid> GC.heap_dump`, Eclipse MAT, VisualVM, JFR"],
          ["Python", "`tracemalloc`, `objgraph`, memray"],
          ["Go", "`pprof` (`/debug/pprof/heap`)"],
          [".NET", "`dotnet-gcdump`, `dotnet-dump`, dotMemory"],
          ["Memória nativa", "valgrind, heaptrack, perfil do jemalloc"],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cuidado em produção",
        texto:
          "Um heap dump pausa o processo e pode dobrar o uso de memória. Faça numa instância retirada do balanceador, nunca na que serve tráfego sem preparo.",
      },
    ],
    armadilhas: [
      "Reiniciar o serviço e dar o assunto por encerrado.",
      "Confundir uso alto com vazamento: o GC é preguiçoso e o heap cresce até o limite configurado.",
      "Um snapshot único não prova nada: compare ao menos dois.",
      "Procurar só no heap do runtime e ignorar a memória nativa.",
      "Deixar o OOMKill do contêiner mascarar o vazamento com reinícios.",
    ],
    autoteste: [
      {
        pergunta: "Qual sinal diferencia um vazamento de uso alto normal?",
        resposta:
          "A memória continua subindo depois dos ciclos de GC e não volta quando a carga cai, formando um dente de serra com o piso crescente.",
      },
      {
        pergunta: "Por que comparar dois heap snapshots em vez de olhar um só?",
        resposta: "Um snapshot mostra o que existe; a diferença entre dois mostra o que cresceu, que é o suspeito.",
      },
    ],
  },
  en: {
    titulo: "Debugging a memory leak",
    pergunta: "How do you debug a memory leak in a backend application?",
    porqueEsteMetodo:
      "Debugging is an investigative procedure: confirm the symptom, isolate, gather evidence, find who holds the reference, fix and verify. The order avoids the classic mistake of changing code before proving the cause.",
    resposta30s:
      "Confirm memory **keeps rising and does not come back after GC**; isolate the endpoint or version responsible; take **heap snapshots at different times and diff them**; follow the **retention path** to whoever holds the reference (static collection, listener, timer, closure, unclosed resource); fix it, and confirm with a **long-running (soak) test** where the curve flattens. Restarting the process is a stopgap, not a fix.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Confirm it is a leak",
            texto:
              "Memory (RSS/heap) that rises continuously and **does not return after GC**, even with low load: a sawtooth whose floor keeps rising. Rule out legitimate growth (cache, warm-up), fragmentation and a large heap by configuration.",
          },
          {
            titulo: "Reproduce and isolate",
            texto:
              "Load test in a controlled environment. Bisect: which endpoint, which deploy version, which feature makes the curve climb?",
          },
          {
            titulo: "Capture evidence over time",
            texto:
              "Take **heap snapshots** at different moments (T0, T1, T2), with the same load in between, and diff them: what grew?",
          },
          {
            titulo: "Find who holds the reference",
            texto:
              "Look at the growing object type and the retention path (retainers / dominator tree) to a root: a static map, a listener, a timer…",
          },
          {
            titulo: "Fix the cause",
            texto:
              "Bound collections (LRU, TTL, `WeakMap`/`WeakRef`), remove listeners and timers, close streams and connections in `finally`, use pools.",
          },
          {
            titulo: "Verify",
            texto: "Repeat the long-running (soak) test: the curve should flatten.",
          },
          {
            titulo: "Prevent",
            texto:
              "Memory and OOM-restart alerts, container memory limits, a soak test before major releases. Periodic restarts are a stopgap.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Most common causes",
        colunas: ["Cause", "Example"],
        linhas: [
          ["Unbounded global collection", "Cache in a `Map` without TTL; a “recent orders” list that only grows"],
          ["Listeners and subscriptions not removed", "`emitter.on(...)` on every request, with no `off`"],
          ["Forgotten timers and intervals", "A `setInterval` referencing large objects"],
          ["Closures capturing too much", "A callback holding the entire HTTP response"],
          ["Unclosed resources", "Connections, streams, files, cursors"],
          ["Off-heap memory", "Native buffers, C libraries"],
          ["Sessions and queues without expiry", "They accumulate per user"],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Tools by platform",
        colunas: ["Platform", "How to capture and analyze"],
        linhas: [
          ["Node.js", "`node --inspect` + Chrome DevTools (Memory tab), `v8.writeHeapSnapshot()`, clinic.js"],
          ["Java / JVM", "`jcmd <pid> GC.heap_dump`, Eclipse MAT, VisualVM, JFR"],
          ["Python", "`tracemalloc`, `objgraph`, memray"],
          ["Go", "`pprof` (`/debug/pprof/heap`)"],
          [".NET", "`dotnet-gcdump`, `dotnet-dump`, dotMemory"],
          ["Native memory", "valgrind, heaptrack, jemalloc profiling"],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Careful in production",
        texto:
          "A heap dump pauses the process and can double memory use. Do it on an instance removed from the load balancer, never on one serving traffic without preparation.",
      },
    ],
    armadilhas: [
      "Restarting the service and calling it solved.",
      "Confusing high usage with a leak: GC is lazy and the heap grows up to the configured limit.",
      "A single snapshot proves nothing: compare at least two.",
      "Looking only at the runtime heap and ignoring native memory.",
      "Letting the container’s OOMKill mask the leak with restarts.",
    ],
    autoteste: [
      {
        pergunta: "Which signal separates a leak from normal high usage?",
        resposta:
          "Memory keeps rising after GC cycles and does not return when load drops, forming a sawtooth with a rising floor.",
      },
      {
        pergunta: "Why compare two heap snapshots instead of looking at just one?",
        resposta: "One snapshot shows what exists; the difference between two shows what grew, which is the suspect.",
      },
    ],
  },
};
