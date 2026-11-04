import type { Pergunta } from "../../tipos";

// M36 · Coleta de lixo
export const m36: Pergunta = {
  numero: 236,
  modulo: "mentorcruise",
  metodo: "trace",
  pt: {
    titulo: "Coleta de lixo",
    pergunta: "Você pode explicar como a coleta de lixo funciona no contexto do desenvolvimento backend?",
    porqueEsteMetodo:
      "A coleta de lixo é invisível até dar problema. Seguir a vida de um único objeto, da alocação à liberação e também pelo caminho em que ele nunca é liberado, mostra o mecanismo e onde ele dói num backend.",
    resposta30s:
      "O coletor libera os objetos **inalcançáveis**: partindo das **raízes** (pilhas das threads, variáveis globais), ele **marca** o que consegue alcançar e **varre ou compacta** o resto, apoiado na **hipótese geracional** (a maioria dos objetos morre jovem, então a região nova é coletada com mais frequência). No backend, o custo aparece como **pausas stop-the-world** e CPU extra, que pioram a **latência de cauda**. E linguagens com GC ainda vazam por **referências retidas** (caches, listeners).",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A vida de um objeto numa requisição",
        etapas: [
          "A requisição chega e o código cria um objeto (por exemplo, a lista de itens do pedido): o runtime reserva espaço no heap, normalmente na região de objetos novos",
          "Enquanto existir um caminho de referências saindo das **raízes** (variáveis locais nas pilhas das threads, variáveis estáticas ou globais) até ele, o objeto é **alcançável** e continua vivo",
          "A resposta sai, a pilha é desfeita e nenhum caminho chega mais ao objeto: ele virou lixo, mas a memória ainda não foi devolvida",
          "A região de objetos novos enche e dispara uma coleta: o coletor percorre o grafo de objetos a partir das raízes e **marca** tudo que é alcançável",
          "Na **varredura**, o espaço dos objetos não marcados é reaproveitado; nos coletores que **compactam** ou copiam, os sobreviventes são movidos para ficar juntos, sem buracos",
          "Quem sobrevive a várias coletas é promovido à região de objetos antigos, visitada com menos frequência",
        ],
        nota: "A **hipótese geracional** diz que a maioria dos objetos morre jovem (os de uma requisição somem quando ela termina). Por isso coletar só a região nova é barato e libera muito. Os detalhes (gerações, tamanho das regiões, concorrência) variam por runtime e por versão.",
      },
      {
        tipo: "passos",
        titulo: "Agora o caminho em que algo dá errado",
        passos: [
          {
            titulo: "Uma referência esquecida",
            texto:
              "Um cache num mapa estático sem limite, um listener que nunca é removido, uma lista global à qual só se acrescenta: o objeto da requisição continua alcançável a partir de uma raiz. Para o coletor ele está vivo, mesmo que ninguém vá usá-lo de novo.",
          },
          {
            titulo: "A região antiga cresce",
            texto:
              "Todo objeto retido sobrevive às coletas e é promovido. O heap antigo enche aos poucos, e o conjunto de objetos vivos, que o coletor precisa percorrer, aumenta.",
          },
          {
            titulo: "O coletor trabalha mais",
            texto:
              "Com pouco espaço livre, as coletas ficam mais frequentes e gastam mais CPU. Nas fases **stop-the-world**, todas as threads da aplicação param: é nesses instantes que as requisições em andamento esperam.",
          },
          {
            titulo: "A cauda de latência aparece",
            texto:
              "O p50 quase não muda, mas o p99 sobe nos momentos das pausas. Em casos extremos o processo passa mais tempo coletando do que trabalhando.",
          },
          {
            titulo: "O limite estoura",
            texto:
              "Sem espaço, o runtime lança um erro de falta de memória, ou o sistema operacional ou o orquestrador mata o processo ao passar do limite do contêiner. A correção é achar quem segura a referência (veja Q27), não apenas aumentar o heap.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Contagem de referências x coleta por rastreamento",
        colunas: ["", "Contagem de referências", "Coleta por rastreamento"],
        linhas: [
          [
            "Como decide que é lixo",
            "O contador de referências do objeto chega a zero",
            "Nenhum caminho o liga às raízes",
          ],
          [
            "Quando libera",
            "Na hora em que o contador zera",
            "Durante ciclos de coleta, nos momentos que o runtime escolhe",
          ],
          [
            "Ciclos (A aponta para B e B para A)",
            "Os contadores nunca zeram; é preciso um coletor de ciclos à parte",
            "Sem problema: um grupo isolado de objetos é inalcançável e vira lixo",
          ],
          [
            "Custo principal",
            "Atualizar contadores a cada atribuição",
            "Pausas ou trabalho concorrente, que crescem com a quantidade de objetos vivos",
          ],
          ["Quem usa", "Python (CPython): contagem mais coletor de ciclos", "JVM, .NET, Go e V8 (JavaScript)"],
        ],
        nota: "Rust não tem coletor: cada valor tem um dono e é liberado quando o dono sai de escopo, regra verificada em tempo de compilação. Não há pausas de GC, mas quem programa respeita as regras de posse e empréstimo.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O GC libera o inalcançável, não o inútil",
        texto:
          "O coletor só sabe se um objeto é **alcançável**, não se ele ainda é **necessário**. Cache sem limite, listener esquecido e mapa estático que só cresce mantêm objetos alcançáveis para sempre: o vazamento numa linguagem com GC costuma ser uma referência retida. Resolver é achar e cortar o caminho que sai da raiz.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Pausas e cauda de latência",
        texto:
          "Um coletor **stop-the-world** para as threads da aplicação durante parte do trabalho; um coletor **concorrente** faz boa parte do trabalho enquanto a aplicação roda e deixa pausas curtas, mas gasta CPU e memória extras. Nenhum elimina o custo: ele só muda de forma (pausas, vazão, uso de memória). A pausa aparece no p99, e olhar só a média esconde o problema (veja Q28).",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Ajustes que costumam ajudar",
        texto:
          "**Meça antes**: logs e métricas de GC do runtime mostram a frequência e a duração das pausas. Depois: (1) dimensione o heap com folga para os objetos vivos e **deixe margem para a memória fora do heap** (pilhas de threads, buffers nativos) dentro do limite do contêiner; (2) **reduza alocações** nos caminhos quentes: reutilize buffers, evite criar objetos em laços apertados, processe em fluxo em vez de carregar tudo na memória; (3) limite e expire caches; (4) só então avalie trocar de coletor ou de parâmetros, um de cada vez.",
      },
    ],
    armadilhas: [
      "Achar que o GC elimina vazamentos: ele só libera o inalcançável, e um cache sem limite ou um listener esquecido mantém tudo vivo.",
      "Aumentar o heap para curar um vazamento: só adia o problema.",
      "Olhar apenas a latência média e ignorar as pausas: o GC aparece no p99.",
      "Fixar o heap máximo no limite de memória do contêiner: não sobra espaço para a memória fora do heap e o processo é morto pelo sistema.",
    ],
    autoteste: [
      {
        pergunta: "O que significa um objeto ser “alcançável”?",
        resposta:
          "Existe um caminho de referências que sai de uma raiz (variável local numa pilha, variável estática ou global) e chega até ele. Se não existe, o objeto é lixo.",
      },
      {
        pergunta: "Por que a contagem de referências sozinha não basta?",
        resposta:
          "Objetos que se referenciam em ciclo nunca têm o contador zerado, mesmo inalcançáveis. Por isso o Python (CPython) soma a contagem a um coletor de ciclos.",
      },
      {
        pergunta: "Por que coletar a região nova com mais frequência compensa?",
        resposta:
          "Pela hipótese geracional: a maioria dos objetos morre jovem, então cada coleta da região nova é barata e libera muita memória.",
      },
    ],
  },
  en: {
    titulo: "Garbage collection",
    pergunta: "Can you explain how garbage collection works in the context of backend development?",
    porqueEsteMetodo:
      "Garbage collection is invisible until it causes trouble. Following the life of a single object, from allocation to release and also down the path where it is never released, shows the mechanism and where it hurts in a backend.",
    resposta30s:
      "The collector frees **unreachable** objects: starting from the **roots** (thread stacks, global variables), it **marks** what it can reach and **sweeps or compacts** the rest, relying on the **generational hypothesis** (most objects die young, so the young region is collected more often). In a backend, the cost shows up as **stop-the-world pauses** and extra CPU, which worsen **tail latency**. And garbage-collected languages still leak through **retained references** (caches, listeners).",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "The life of an object in a request",
        etapas: [
          "The request arrives and the code creates an object (say, the order’s item list): the runtime reserves space on the heap, normally in the young-object region",
          "As long as a chain of references leads to it from the **roots** (local variables on thread stacks, static or global variables), the object is **reachable** and stays alive",
          "The response goes out, the stack unwinds and no path reaches the object anymore: it is now garbage, but its memory has not been returned yet",
          "The young region fills up and triggers a collection: the collector walks the object graph from the roots and **marks** everything reachable",
          "In the **sweep**, the space of unmarked objects is reused; in collectors that **compact** or copy, survivors are moved together, leaving no gaps",
          "Objects that survive several collections are promoted to the old region, visited less often",
        ],
        nota: "The **generational hypothesis** says most objects die young (a request’s objects vanish when it ends). That is why collecting only the young region is cheap and frees a lot. The details (generations, region sizes, concurrency) vary by runtime and version.",
      },
      {
        tipo: "passos",
        titulo: "Now the path where something goes wrong",
        passos: [
          {
            titulo: "A forgotten reference",
            texto:
              "An unbounded cache in a static map, a listener that is never removed, a global list that only grows: the request’s object stays reachable from a root. To the collector it is alive, even if nobody will ever use it again.",
          },
          {
            titulo: "The old region grows",
            texto:
              "Every retained object survives collections and gets promoted. The old heap slowly fills up, and the set of live objects, which the collector has to walk, keeps growing.",
          },
          {
            titulo: "The collector works harder",
            texto:
              "With little free space, collections become more frequent and burn more CPU. During **stop-the-world** phases all application threads halt: those are the moments when in-flight requests wait.",
          },
          {
            titulo: "Tail latency shows up",
            texto:
              "The p50 barely moves, but the p99 climbs at the moments of the pauses. In extreme cases the process spends more time collecting than working.",
          },
          {
            titulo: "The limit blows",
            texto:
              "Out of space, the runtime throws an out-of-memory error, or the operating system or orchestrator kills the process when it passes the container limit. The fix is to find who holds the reference (see Q27), not just to grow the heap.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Reference counting vs tracing collection",
        colunas: ["", "Reference counting", "Tracing collection"],
        linhas: [
          [
            "How it decides something is garbage",
            "The object’s reference count reaches zero",
            "No path connects it to the roots",
          ],
          [
            "When it frees",
            "The moment the count hits zero",
            "During collection cycles, at moments the runtime chooses",
          ],
          [
            "Cycles (A points to B and B points to A)",
            "Counts never reach zero; a separate cycle collector is needed",
            "No problem: an isolated group of objects is unreachable and becomes garbage",
          ],
          [
            "Main cost",
            "Updating counts on every assignment",
            "Pauses or concurrent work, which grow with the number of live objects",
          ],
          ["Who uses it", "Python (CPython): counting plus a cycle collector", "JVM, .NET, Go and V8 (JavaScript)"],
        ],
        nota: "Rust has no collector: every value has an owner and is freed when the owner goes out of scope, a rule checked at compile time. There are no GC pauses, but programmers follow the ownership and borrowing rules.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The GC frees the unreachable, not the useless",
        texto:
          "The collector only knows whether an object is **reachable**, not whether it is still **needed**. An unbounded cache, a forgotten listener and a static map that only grows keep objects reachable forever: a leak in a garbage-collected language is usually a retained reference. The fix is to find and cut the path that leads from the root.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Pauses and tail latency",
        texto:
          "A **stop-the-world** collector halts the application threads during part of the work; a **concurrent** collector does much of the work while the application runs and leaves short pauses, but burns extra CPU and memory. Neither removes the cost: it just changes shape (pauses, throughput, memory use). The pause shows up in the p99, and looking only at the average hides the problem (see Q28).",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Adjustments that usually help",
        texto:
          "**Measure first**: the runtime’s GC logs and metrics show how often pauses happen and how long they last. Then: (1) size the heap with headroom for live objects and **leave room for off-heap memory** (thread stacks, native buffers) inside the container limit; (2) **cut allocations** on hot paths: reuse buffers, avoid creating objects in tight loops, stream instead of loading everything into memory; (3) bound and expire caches; (4) only then consider changing collector or parameters, one at a time.",
      },
    ],
    armadilhas: [
      "Thinking the GC eliminates leaks: it only frees the unreachable, and an unbounded cache or a forgotten listener keeps everything alive.",
      "Growing the heap to cure a leak: it only postpones the problem.",
      "Looking only at average latency and ignoring pauses: the GC shows up in the p99.",
      "Setting the maximum heap equal to the container’s memory limit: no room is left for off-heap memory and the system kills the process.",
    ],
    autoteste: [
      {
        pergunta: "What does it mean for an object to be “reachable”?",
        resposta:
          "A chain of references leads to it from a root (a local variable on a stack, a static or global variable). If there is none, the object is garbage.",
      },
      {
        pergunta: "Why is reference counting alone not enough?",
        resposta:
          "Objects that reference each other in a cycle never get their count to zero, even when unreachable. That is why Python (CPython) adds a cycle collector on top of counting.",
      },
      {
        pergunta: "Why does collecting the young region more often pay off?",
        resposta:
          "Because of the generational hypothesis: most objects die young, so each young-region collection is cheap and frees a lot of memory.",
      },
    ],
  },
};
