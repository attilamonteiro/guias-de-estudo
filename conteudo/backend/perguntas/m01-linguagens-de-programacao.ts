import type { Pergunta } from "../../tipos";

// M01 · Linguagens de backend
export const m01: Pergunta = {
  numero: 201,
  modulo: "mentorcruise",
  metodo: "playbook",
  pt: {
    titulo: "Linguagens de backend",
    pergunta: "Com quais linguagens de programação você se sente mais à vontade para desenvolvimento backend?",
    porqueEsteMetodo:
      "É uma pergunta de experiência, e a resposta ruim é uma lista de nomes. Um playbook dá a estrutura: poucas linguagens com profundidade, critérios técnicos para justificar e honestidade sobre os limites.",
    resposta30s:
      "Escolha **uma ou duas linguagens** que você realmente domina e **uma de apoio**, e justifique com critérios: **ecossistema, modelo de concorrência, tipagem, desempenho e mercado**. Diga onde cada uma brilha e onde não seria a melhor escolha. Evite alegar todas: profundidade honesta convence mais que uma lista longa.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Como montar a resposta",
        passos: [
          {
            titulo: "Escolha o foco",
            texto:
              "Diga 1 ou 2 linguagens que você realmente domina: aquelas em que escreveu, testou, depurou e publicou código. Profundidade vale mais que quantidade.",
          },
          {
            titulo: "Acrescente uma de apoio",
            texto:
              "Uma terceira que você lê e ajusta sem sofrer (para scripts, ou para entender o código de outra equipe). Deixe claro o nível: de apoio, não de especialista.",
          },
          {
            titulo: "Justifique com critérios",
            texto:
              "**Ecossistema** (bibliotecas, frameworks, ferramentas), **modelo de concorrência** (threads, event loop, corrotinas), **tipagem** (o que o compilador pega antes da produção), **desempenho** (CPU, memória, tempo de inicialização, e se isso importa no seu caso) e **mercado** (equipe, contratação, manutenção).",
          },
          {
            titulo: "Mostre um critério de escolha",
            texto:
              "Diga quando usaria cada uma: “para uma API com muito I/O e equipe pequena, X, porque…; para processamento pesado de CPU, Y, porque…”. Isso mostra julgamento, não só vocabulário.",
          },
          {
            titulo: "Mostre profundidade",
            texto:
              "Cite o que só quem usa sabe: como a linguagem trata erros, gerencia dependências, roda testes, lida com concorrência e onde costuma pegar o desavisado (valores nulos, conversões de tipo, thread bloqueada).",
          },
          {
            titulo: "Seja honesto sobre os limites",
            texto:
              "Diga o que você não conhece e como aprenderia. Se a vaga usa outra linguagem, aproxime pelo que se transfere: modelo de concorrência, tipagem, ferramentas de teste e de deploy.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Linguagens comuns de backend, em visão neutra",
        colunas: ["Linguagem", "Pontos fortes típicos", "Costuma pesar contra"],
        linhas: [
          [
            "Python",
            "Sintaxe legível, ecossistema enorme (web, dados, automação, aprendizado de máquina), ótima para prototipar",
            "Tipagem dinâmica por padrão (as anotações de tipo são opcionais); desempenho bruto menor; paralelismo de CPU com threads limitado na implementação padrão",
          ],
          [
            "JavaScript / TypeScript (Node)",
            "Mesma linguagem no front e no back; event loop com I/O não bloqueante, bom para muitas conexões; npm gigante; TypeScript acrescenta tipagem estática",
            "Trabalho pesado de CPU trava o event loop (exige workers ou outro processo); qualidade desigual dos pacotes; os tipos do TypeScript somem na execução",
          ],
          [
            "Java / Kotlin",
            "Plataforma madura (JVM), tipagem estática, ferramentas e bibliotecas corporativas robustas, bom desempenho em regime estável; Kotlin é mais conciso e usa corrotinas",
            "Java tende à verbosidade; inicialização e consumo de memória costumam ser maiores que os de binários nativos",
          ],
          [
            "C#",
            "Tipagem estática, `async/await` bem integrado, ótimas ferramentas, muito usada em ambiente corporativo",
            "Ecossistema concentrado na plataforma .NET",
          ],
          [
            "Go",
            "Binário único, compilação rápida, goroutines e canais para concorrência simples, biblioteca padrão forte para redes",
            "Sistema de tipos enxuto, tratamento de erro explícito e repetitivo, menos recursos de abstração",
          ],
          [
            "Ruby",
            "Alta produtividade, convenções fortes (Rails), muito boa para lançar um produto web depressa",
            "Desempenho bruto menor; tipagem dinâmica",
          ],
          [
            "PHP",
            "Hospedagem ampla e barata, frameworks maduros (Laravel, Symfony), enorme base de sistemas existentes",
            "Inconsistências históricas na linguagem; o modelo tradicional recomeça o estado a cada requisição",
          ],
          [
            "Rust",
            "Desempenho alto e previsível, segurança de memória sem coletor de lixo, concorrência verificada na compilação",
            "Curva de aprendizado íngreme, compilação mais lenta, ecossistema web mais jovem",
          ],
        ],
        nota: "Não é ranking: o encaixe depende do problema, da equipe e da maturidade das ferramentas. Qualquer uma delas pode ser a melhor escolha em algum contexto.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Modelo para preencher com a sua realidade",
        texto:
          "“Trabalho mais com X e Y, e leio Z. Escolho X quando [critério], porque [razão técnica]; Y quando [outro cenário]. Não usaria Z sozinho em produção. Se a equipe usa W, a diferença que mais pesa é [concorrência ou tipagem], e eu aprenderia assim: [estratégia].” Troque cada item pelo que é verdade para você.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não alegue todas",
        texto:
          "Marcar oito linguagens como “confortável” convida o entrevistador a sondar a mais fraca. Uma pergunta sobre o modelo de concorrência ou sobre como os erros chegam à produção já separa quem usou a linguagem de quem leu sobre ela.",
      },
    ],
    armadilhas: [
      "Listar dez linguagens para parecer versátil: o entrevistador vai sondar justamente a que você menos conhece.",
      "Responder só com o nome, sem critério nem exemplo de uso.",
      "Desqualificar outras linguagens (“X é lenta”) em vez de comparar por critério, ou repetir benchmark de ouvir dizer.",
      "Chamar de “confortável” uma linguagem que só passou por tutorial: confortável é depurar, testar e publicar nela.",
    ],
    autoteste: [
      {
        pergunta: "Por que citar critérios, e não só o nome da linguagem?",
        resposta:
          "O nome só diz o que você usa. Os critérios (ecossistema, concorrência, tipagem, desempenho, mercado) mostram que você entende por que uma linguagem serve a um problema e quando não serve.",
      },
      {
        pergunta: "O que fazer se a vaga usa uma linguagem que você não domina?",
        resposta:
          "Dizer com honestidade o que domina, apontar o que se transfere (concorrência, tipagem, testes, deploy) e explicar como você aprenderia o resto. Alegar domínio que não existe é o caminho mais curto para ser desmentido.",
      },
      {
        pergunta:
          "Por que uma tarefa pesada de CPU é problema num runtime de event loop com uma thread só, como o Node?",
        resposta:
          "Porque ela ocupa a única thread e atrasa todas as outras requisições. A saída é levar o trabalho para workers, outro processo ou uma fila.",
      },
    ],
  },
  en: {
    titulo: "Backend languages",
    pergunta: "What programming languages are you most comfortable with for backend development?",
    porqueEsteMetodo:
      "This is an experience question, and the weak answer is a list of names. A playbook gives the structure: a few languages in depth, technical criteria to justify them and honesty about limits.",
    resposta30s:
      "Pick **one or two languages** you truly know and **one supporting language**, and justify them with criteria: **ecosystem, concurrency model, typing, performance and job market**. Say where each one shines and where it would not be the best choice. Avoid claiming them all: honest depth convinces more than a long list.",
    blocos: [
      {
        tipo: "passos",
        titulo: "How to build the answer",
        passos: [
          {
            titulo: "Choose a focus",
            texto:
              "Name 1 or 2 languages you truly know: the ones you have written, tested, debugged and shipped code in. Depth beats breadth.",
          },
          {
            titulo: "Add a supporting one",
            texto:
              "A third that you can read and tweak comfortably (for scripts, or to understand another team’s code). Be clear about the level: supporting, not expert.",
          },
          {
            titulo: "Justify with criteria",
            texto:
              "**Ecosystem** (libraries, frameworks, tooling), **concurrency model** (threads, event loop, coroutines), **typing** (what the compiler catches before production), **performance** (CPU, memory, startup time, and whether it matters in your case) and **job market** (team, hiring, maintenance).",
          },
          {
            titulo: "Show a way to choose",
            texto:
              "Say when you would use each: “for an I/O-heavy API with a small team, X, because…; for CPU-heavy processing, Y, because…”. That shows judgment, not just vocabulary.",
          },
          {
            titulo: "Show depth",
            texto:
              "Mention what only real users know: how the language handles errors, manages dependencies, runs tests, deals with concurrency and where it tends to catch the unwary (null values, type coercion, a blocked thread).",
          },
          {
            titulo: "Be honest about limits",
            texto:
              "Say what you do not know and how you would learn it. If the job uses another language, bridge through what transfers: concurrency model, typing, testing and deployment tools.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Common backend languages, neutral view",
        colunas: ["Language", "Typical strengths", "Usually weighs against"],
        linhas: [
          [
            "Python",
            "Readable syntax, huge ecosystem (web, data, automation, machine learning), great for prototyping",
            "Dynamic typing by default (type hints are optional); lower raw performance; CPU parallelism with threads is limited in the default implementation",
          ],
          [
            "JavaScript / TypeScript (Node)",
            "Same language on front end and back end; event loop with non-blocking I/O, good for many connections; a gigantic npm; TypeScript adds static typing",
            "CPU-heavy work blocks the event loop (needs workers or another process); uneven package quality; TypeScript types disappear at runtime",
          ],
          [
            "Java / Kotlin",
            "Mature platform (JVM), static typing, robust enterprise tooling and libraries, good steady-state performance; Kotlin is more concise and uses coroutines",
            "Java tends to be verbose; startup time and memory use are often higher than those of native binaries",
          ],
          [
            "C#",
            "Static typing, well-integrated `async/await`, excellent tooling, widely used in enterprises",
            "Ecosystem concentrated around the .NET platform",
          ],
          [
            "Go",
            "Single binary, fast compilation, goroutines and channels for simple concurrency, strong standard library for networking",
            "Lean type system, explicit and repetitive error handling, fewer abstraction features",
          ],
          [
            "Ruby",
            "High productivity, strong conventions (Rails), very good for shipping a web product quickly",
            "Lower raw performance; dynamic typing",
          ],
          [
            "PHP",
            "Wide, cheap hosting, mature frameworks (Laravel, Symfony), a huge base of existing systems",
            "Historical inconsistencies in the language; the traditional model restarts state on every request",
          ],
          [
            "Rust",
            "High, predictable performance, memory safety without a garbage collector, concurrency checked at compile time",
            "Steep learning curve, slower compilation, younger web ecosystem",
          ],
        ],
        nota: "This is not a ranking: the fit depends on the problem, the team and the maturity of the tooling. Any of them can be the best choice in some context.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "A template to fill with your own reality",
        texto:
          "“I work mostly with X and Y, and I can read Z. I pick X when [criterion], because [technical reason]; Y when [other scenario]. I would not run Z alone in production. If the team uses W, the difference that matters most is [concurrency or typing], and I would learn it like this: [strategy].” Replace every item with what is true for you.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Do not claim them all",
        texto:
          "Marking eight languages as “comfortable” invites the interviewer to probe the weakest one. A single question about the concurrency model, or about how errors reach production, already separates people who used the language from people who read about it.",
      },
    ],
    armadilhas: [
      "Listing ten languages to look versatile: the interviewer will probe exactly the one you know least.",
      "Answering with just a name, without criteria or a usage example.",
      "Dismissing other languages (“X is slow”) instead of comparing by criteria, or repeating a benchmark you only heard about.",
      "Calling a language “comfortable” when you only went through a tutorial: comfortable means debugging, testing and shipping in it.",
    ],
    autoteste: [
      {
        pergunta: "Why cite criteria instead of just the language name?",
        resposta:
          "The name only says what you use. The criteria (ecosystem, concurrency, typing, performance, job market) show that you understand why a language fits a problem and when it does not.",
      },
      {
        pergunta: "What should you do if the job uses a language you do not know well?",
        resposta:
          "Say honestly what you know, point to what transfers (concurrency, typing, testing, deployment) and explain how you would learn the rest. Claiming knowledge you lack is the shortest path to being caught out.",
      },
      {
        pergunta: "Why is a CPU-heavy task a problem in a single-threaded event-loop runtime such as Node?",
        resposta:
          "Because it occupies the only thread and delays every other request. The way out is to move the work to workers, another process or a queue.",
      },
    ],
  },
};
