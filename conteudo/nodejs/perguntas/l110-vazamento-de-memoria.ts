import type { Pergunta } from "../../tipos";

// L110 · Vazamento de memória
export const l110: Pergunta = {
  numero: 210,
  modulo: "linkedin-producao",
  metodo: "playbook",
  pt: {
    titulo: "Vazamento de memória",
    pergunta: "Como você encontra um vazamento de memória?",
    porqueEsteMetodo:
      "Achar um vazamento é uma investigação em etapas: confirmar que é vazamento, descobrir qual memória cresce, comparar fotos do heap e seguir quem segura o objeto. Um playbook dá a ordem e o sinal de que cada passo funcionou, inclusive para o cenário “o uso de memória só aumenta”.",
    resposta30s:
      "Vazamento é memória que **continua alcançável** e, por isso, o coletor de lixo não libera. Confirme a tendência (o **piso do `heapUsed`** sobe a cada coleta, sob carga estável), tire **dois heap snapshots** no Chrome DevTools (`--inspect`) e compare-os: o que cresceu entre eles, junto com os **retentores**, mostra quem segura o objeto (cache sem limite, ouvinte, timer ou closure). Corrija a referência e repita o teste; `--max-old-space-size` só adia o fim.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: a memória só sobe",
        passos: [
          {
            titulo: "1. Confirme que é vazamento",
            texto:
              "Acompanhe `process.memoryUsage()` (`rss`, `heapUsed`, `external`, `arrayBuffers`) ou a métrica do painel por horas, sob carga parecida. Vazamento é o **piso** que sobe depois de cada coleta de lixo; o serrote em si é normal, e um cache esquentando também sobe e depois estabiliza. Sinal: a curva não volta ao nível anterior e termina em erro de falta de memória do heap ou no processo morto pelo orquestrador.",
          },
          {
            titulo: "2. Descubra qual memória cresce",
            texto:
              "Se `heapUsed` sobe, são objetos JavaScript retidos. Se só `rss`, `external` ou `arrayBuffers` sobe, o suspeito são `Buffer`s, streams que ninguém consome, módulos nativos ou conexões abertas, e olhar o heap não ajuda.",
          },
          {
            titulo: "3. Reproduza com carga controlada",
            texto:
              "Suba o processo com `node --inspect` (em desenvolvimento ou staging) e repita muitas vezes a requisição suspeita. Quanto menor o cenário, mais fácil achar o objeto que se acumula.",
          },
          {
            titulo: "4. Tire e compare snapshots",
            texto:
              "No Chrome DevTools (`chrome://inspect`), aba Memory, tire um snapshot, aplique a carga e tire outro. Na visão **Comparison**, ordene pelo que foi adicionado e não liberado. Sem depurador, `v8.writeHeapSnapshot()` ou a flag `--heapsnapshot-signal` gravam o arquivo para abrir depois. Sinal: um tipo de objeto (ou de string) aparece com milhares de instâncias a mais.",
          },
          {
            titulo: "5. Siga os retentores",
            texto:
              "Selecione o objeto que cresce e leia o painel **Retainers**: o caminho de referências até uma raiz (variável global, `Map`, ouvinte, timer, closure) mostra o que o impede de ser coletado. A flag `--heap-prof` complementa, mostrando de onde saem as alocações. Sinal: você aponta a linha que guarda a referência.",
          },
          {
            titulo: "6. Corrija a causa e prove",
            texto:
              "Dê limite ao cache (tamanho máximo e TTL, por exemplo LRU), remova ouvintes e timers (`off`, `clearInterval`, `AbortSignal`), use `WeakMap` para dados presos a objetos que podem sumir e feche streams e conexões. Repita a mesma carga: o piso tem de parar de subir.",
          },
          {
            titulo: "7. Contenha em produção",
            texto:
              "Enquanto o conserto não sai: limite de memória com reinício automático pelo supervisor, alerta sobre a **tendência** da memória e, se necessário, `--max-old-space-size` para fixar o teto do heap abaixo do limite do contêiner. Isso adia a queda; não elimina o vazamento.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Observar a tendência e um suspeito clássico",
        legenda: "JavaScript",
        codigo: `import { writeHeapSnapshot } from "node:v8";

// 1) Tendência: o que importa é o piso do heapUsed ao longo das horas
setInterval(() => {
  const { rss, heapUsed, external } = process.memoryUsage();
  console.log({ rss, heapUsed, external });
}, 60_000).unref();

// 2) Snapshot sob demanda (Linux/macOS): kill -USR2 <pid>
process.on("SIGUSR2", () => console.log("snapshot:", writeHeapSnapshot()));

// 3) Suspeito clássico: cache sem limite
const cache = new Map();
export function buscar(id) {
  if (!cache.has(id)) cache.set(id, carregar(id)); // nunca remove nada
  return cache.get(id);
}`,
        nota: "O `Map` só cresce: toda chave nova fica alcançável pela variável do módulo para sempre. Limite o tamanho (LRU) ou dê TTL.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Procure quem segura, não quem alocou",
        texto:
          "O coletor de lixo libera tudo que ninguém alcança. Se a memória cresce, algo ainda está **alcançável** a partir de uma raiz: global, `Map`, ouvinte, timer ou closure. Por isso o painel de retentores vale mais que a lista de alocações. Um `MaxListenersExceededWarning` é uma pista frequente (veja T61).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Snapshot custa caro e contém dados",
        texto:
          "Gerar um heap snapshot pausa o processo e usa memória extra proporcional ao heap; num processo perto do limite, pode derrubá-lo. Tire de uma instância fora do balanceamento. O arquivo guarda o conteúdo de strings e objetos (tokens, dados de usuários): trate-o como material sensível e não o envie para fora da empresa.",
      },
    ],
    armadilhas: [
      "Aumentar `--max-old-space-size` e dar o caso por encerrado: o processo apenas leva mais tempo para cair.",
      "Concluir “vazamento” a partir de um único pico: observe o piso após as coletas, por horas, sob carga estável.",
      "Olhar só o heap do JavaScript quando o `rss` cresce com o heap estável: o vazamento está em `Buffer`s, streams ou código nativo.",
      "Analisar um único snapshot: tudo parece grande. A diferença entre dois mostra o que de fato se acumulou.",
    ],
    autoteste: [
      {
        pergunta: "Como distinguir um vazamento de um uso de memória simplesmente alto?",
        resposta:
          "Pelo comportamento do piso: sob carga estável, se a memória depois de cada coleta de lixo continua subindo e nunca estabiliza, é vazamento. Uso alto mas estável (cache que encheu) não é.",
      },
      {
        pergunta: "Por que comparar dois snapshots em vez de olhar um só?",
        resposta:
          "Um snapshot mostra tudo o que existe, inclusive o normal. A comparação isola o que foi adicionado entre os dois momentos e não foi liberado, que é onde o vazamento está.",
      },
    ],
  },
  en: {
    titulo: "Memory leaks",
    pergunta: "How do you find a memory leak?",
    porqueEsteMetodo:
      "Finding a leak is an investigation in stages: confirm that it is a leak, find which memory is growing, compare heap snapshots and follow whatever holds the object. A playbook gives the order and the signal that each step worked, including for the scenario “memory usage keeps increasing”.",
    resposta30s:
      "A leak is memory that **stays reachable**, so the garbage collector cannot free it. Confirm the trend (the **`heapUsed` floor** rises after every collection under steady load), take **two heap snapshots** in Chrome DevTools (`--inspect`) and compare them: what grew between them, together with the **retainers**, shows who holds the object (an unbounded cache, a listener, a timer or a closure). Fix the reference and repeat the test; `--max-old-space-size` only delays the end.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: memory only goes up",
        passos: [
          {
            titulo: "1. Confirm it is a leak",
            texto:
              "Watch `process.memoryUsage()` (`rss`, `heapUsed`, `external`, `arrayBuffers`) or the dashboard metric for hours, under similar load. A leak is the **floor** that rises after each garbage collection; the sawtooth itself is normal, and a warming cache also rises and then settles. Signal: the curve never returns to its earlier level and ends in an out-of-memory heap error or a process killed by the orchestrator.",
          },
          {
            titulo: "2. Find which memory grows",
            texto:
              "If `heapUsed` rises, JavaScript objects are being retained. If only `rss`, `external` or `arrayBuffers` rises, suspect `Buffer`s, streams nobody consumes, native modules or open connections, and looking at the heap does not help.",
          },
          {
            titulo: "3. Reproduce with controlled load",
            texto:
              "Start the process with `node --inspect` (in development or staging) and repeat the suspect request many times. The smaller the scenario, the easier it is to find the object that piles up.",
          },
          {
            titulo: "4. Take and compare snapshots",
            texto:
              "In Chrome DevTools (`chrome://inspect`), Memory tab, take a snapshot, apply the load and take another. In the **Comparison** view, sort by what was added and not freed. Without a debugger, `v8.writeHeapSnapshot()` or the `--heapsnapshot-signal` flag write the file for you to open later. Signal: one type of object (or string) shows up with thousands more instances.",
          },
          {
            titulo: "5. Follow the retainers",
            texto:
              "Select the growing object and read the **Retainers** panel: the chain of references up to a root (global variable, `Map`, listener, timer, closure) shows what keeps it from being collected. The `--heap-prof` flag complements it by showing where allocations come from. Signal: you can point to the line that holds the reference.",
          },
          {
            titulo: "6. Fix the cause and prove it",
            texto:
              "Bound the cache (maximum size and TTL, for example LRU), remove listeners and timers (`off`, `clearInterval`, `AbortSignal`), use `WeakMap` for data attached to objects that may disappear and close streams and connections. Repeat the same load: the floor must stop rising.",
          },
          {
            titulo: "7. Contain it in production",
            texto:
              "Until the fix ships: a memory limit with automatic restart by the supervisor, an alert on the memory **trend** and, if needed, `--max-old-space-size` to fix the heap ceiling below the container limit. This postpones the crash; it does not remove the leak.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Watching the trend and a classic suspect",
        legenda: "JavaScript",
        codigo: `import { writeHeapSnapshot } from "node:v8";

// 1) Trend: what matters is the heapUsed floor over the hours
setInterval(() => {
  const { rss, heapUsed, external } = process.memoryUsage();
  console.log({ rss, heapUsed, external });
}, 60_000).unref();

// 2) Snapshot on demand (Linux/macOS): kill -USR2 <pid>
process.on("SIGUSR2", () => console.log("snapshot:", writeHeapSnapshot()));

// 3) Classic suspect: an unbounded cache
const cache = new Map();
export function lookup(id) {
  if (!cache.has(id)) cache.set(id, load(id)); // never removes anything
  return cache.get(id);
}`,
        nota: "The `Map` only grows: every new key stays reachable through the module variable forever. Bound its size (LRU) or give it a TTL.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Look for who holds it, not who allocated it",
        texto:
          "The garbage collector frees everything nobody can reach. If memory grows, something is still **reachable** from a root: a global, a `Map`, a listener, a timer or a closure. That is why the retainers panel is worth more than the list of allocations. A `MaxListenersExceededWarning` is a frequent clue (see T61).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Snapshots are expensive and contain data",
        texto:
          "Taking a heap snapshot pauses the process and uses extra memory proportional to the heap; on a process near its limit it can bring it down. Take it from an instance that is out of the load balancer. The file holds the contents of strings and objects (tokens, user data): treat it as sensitive material and do not send it outside the company.",
      },
    ],
    armadilhas: [
      "Raising `--max-old-space-size` and calling it done: the process just takes longer to crash.",
      "Concluding “leak” from a single spike: watch the floor after collections, for hours, under steady load.",
      "Looking only at the JavaScript heap when `rss` grows with a stable heap: the leak is in `Buffer`s, streams or native code.",
      "Analyzing a single snapshot: everything looks big. The difference between two shows what really piled up.",
    ],
    autoteste: [
      {
        pergunta: "How do you tell a leak from simply high memory usage?",
        resposta:
          "By the behavior of the floor: under steady load, if memory after each garbage collection keeps rising and never settles, it is a leak. High but stable usage (a cache that filled up) is not.",
      },
      {
        pergunta: "Why compare two snapshots instead of looking at just one?",
        resposta:
          "One snapshot shows everything that exists, normal things included. The comparison isolates what was added between the two moments and not freed, which is where the leak is.",
      },
    ],
  },
};
