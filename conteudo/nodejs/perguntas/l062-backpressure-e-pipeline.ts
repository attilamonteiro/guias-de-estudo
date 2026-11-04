import type { Pergunta } from "../../tipos";

// L62 · Backpressure e pipeline
export const l062: Pergunta = {
  numero: 162,
  modulo: "linkedin-streams",
  metodo: "trace",
  pt: {
    titulo: "Backpressure e pipeline",
    pergunta: "O que é backpressure?",
    porqueEsteMetodo:
      "Backpressure só fica claro quando você acompanha um pedaço de dado passando entre um produtor rápido e um consumidor lento, inclusive no caminho em que o freio é ignorado. É esse trajeto que explica o que o `pipeline()` automatiza.",
    resposta30s:
      "**Backpressure** é o freio pelo qual um consumidor lento faz o produtor desacelerar, para que os dados não se acumulem sem limite na memória: `write()` devolve **`false`** quando o buffer interno passa do **`highWaterMark`**, e o produtor espera o evento **`drain`**. O **`pipeline()`** liga os streams aplicando esse freio entre todas as etapas, repassa o primeiro erro e destrói tudo no fim ou na falha (visão geral em T37).",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Um pedaço de dado com consumidor lento",
        etapas: [
          "O Readable lê um pedaço (chunk) da origem, por exemplo um arquivo no disco, e o entrega ao Writable com `write(chunk)`",
          "O destino (digamos, um cliente de rede lento) consome mais devagar do que a origem produz, e o buffer interno do Writable começa a encher",
          "Quando o buffer passa do `highWaterMark`, `write()` devolve `false`: o sinal de “pare de enviar por enquanto”",
          "O produtor pausa: `pipe` e `pipeline` chamam `pause()` na origem sozinhos; à mão, é o seu laço que precisa parar",
          "O destino escoa o buffer e emite `drain`",
          "O produtor retoma, o ciclo recomeça e a memória usada continua estável",
        ],
        nota: "O `highWaterMark` é o quanto cabe no buffer antes do sinal. O padrão é pequeno e varia conforme o tipo de stream (confira a documentação em nodejs.org).",
      },
      {
        tipo: "passos",
        titulo: "O caminho em que o freio é ignorado",
        passos: [
          {
            titulo: "O laço ignora o `false`",
            texto:
              "Um `for` chama `write()` sem olhar o retorno. O Node aceita tudo e guarda o excesso em memória; `false` é um pedido, não uma recusa.",
          },
          {
            titulo: "A memória cresce em silêncio",
            texto:
              "O que o destino ainda não consumiu se acumula no buffer do Writable. Não há erro, só o consumo subindo, mais pausas do coletor de lixo e, no fim, um processo derrubado por falta de memória.",
          },
          {
            titulo: "Com `.pipe()` o freio existe, mas a limpeza não",
            texto:
              "O `pipe` respeita o backpressure entre dois streams, mas, se um deles falha, os outros não são fechados automaticamente: arquivos ficam abertos e o erro não chega a um lugar só.",
          },
          {
            titulo: "O conserto: `pipeline`",
            texto:
              "`pipeline(origem, ...transformações, destino)` aplica o backpressure em toda a cadeia, repassa o primeiro erro, destrói todos os streams e avisa o fim por callback ou, em `node:stream/promises`, por uma promise.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "À mão e com pipeline",
        legenda: "JavaScript",
        codigo: [
          'import { once } from "node:events";',
          'import { createReadStream, createWriteStream } from "node:fs";',
          'import { pipeline } from "node:stream/promises";',
          "",
          "// À mão: respeite o false de write() e espere o drain",
          'const saida = createWriteStream("saida.txt");',
          "for (let i = 0; i < 1_000_000; i++) {",
          '  if (!saida.write(`linha ${i}\\n`)) await once(saida, "drain");',
          "}",
          "saida.end();",
          "",
          "// Com pipeline: freio, erros e limpeza já vêm prontos",
          'await pipeline(createReadStream("grande.log"), createWriteStream("copia.log"));',
        ].join("\n"),
        nota: "Exemplo em módulo ES, com `await` no nível superior. Se `saida` falhar enquanto o laço espera, `once` rejeita com o erro em vez de travar.",
      },
      {
        tipo: "tabela",
        titulo: "pipe() x pipeline()",
        colunas: ["Aspecto", "`pipe()`", "`pipeline()`"],
        linhas: [
          ["Backpressure", "Sim, entre dois streams", "Sim, entre todas as etapas"],
          ["Várias etapas", "Um `.pipe()` encadeado por etapa, à mão", "Uma chamada com a lista inteira de etapas"],
          [
            "Erro",
            "Não propaga: cada stream precisa do seu tratamento de `error`",
            "O primeiro erro chega a um só callback ou promise",
          ],
          ["Limpeza", "Não fecha os outros streams", "Destrói todos os streams (fecha os arquivos)"],
          [
            "Aviso do fim",
            "Evento `finish` do último stream",
            "Callback, ou `await` na versão de `node:stream/promises`",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que levar",
        texto:
          "O ciclo é: `write()` devolve `false` → **pare** → espere `drain` → continue. Em um Readable próprio, o mesmo vale para `push()`: se devolver `false`, pare de ler da fonte até ser chamado de novo. Na prática, use `pipeline` por padrão: além do freio, ele aceita funções geradoras assíncronas como etapas e a opção `signal` para cancelar com um `AbortSignal`. Para entregar um arquivo a um cliente HTTP, veja L68.",
      },
    ],
    armadilhas: [
      "Chamar `write()` em um laço sem olhar o retorno: a memória cresce sem erro algum até o processo cair.",
      "Entender o `false` de `write()` como “dado perdido”: o dado foi aceito, o `false` só pede que você pare de enviar.",
      "Encadear `.pipe()` sem tratar `error` em cada stream: o erro não propaga e os recursos não são liberados.",
      "Esquecer de aguardar (ou tratar a rejeição de) o `pipeline` de `node:stream/promises`: a falha vira uma rejeição não tratada.",
    ],
    autoteste: [
      {
        pergunta: "O que significa `write()` devolver `false` e o que fazer?",
        resposta:
          "Que o buffer interno do Writable passou do `highWaterMark`. O produtor deve parar de escrever e esperar o evento `drain`; `pipe` e `pipeline` fazem isso sozinhos.",
      },
      {
        pergunta: "Por que preferir `pipeline()` a encadear `.pipe()`?",
        resposta:
          "Porque ele aplica o backpressure em toda a cadeia e, se qualquer etapa falhar, destrói todos os streams e entrega um único erro. O `.pipe()` não propaga erros nem fecha os outros streams.",
      },
    ],
  },
  en: {
    titulo: "Backpressure and pipeline",
    pergunta: "What is backpressure?",
    porqueEsteMetodo:
      "Backpressure only becomes clear when you follow a chunk of data moving between a fast producer and a slow consumer, including the path where the brake is ignored. That journey explains what `pipeline()` automates.",
    resposta30s:
      "**Backpressure** is the brake by which a slow consumer makes the producer slow down, so data does not pile up in memory without limit: `write()` returns **`false`** when the internal buffer goes past the **`highWaterMark`**, and the producer waits for the **`drain`** event. **`pipeline()`** connects streams applying that brake between every stage, forwards the first error and destroys everything on completion or failure (overview in T37).",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One chunk with a slow consumer",
        etapas: [
          "The Readable reads a chunk from the source, say a file on disk, and hands it to the Writable with `write(chunk)`",
          "The destination (say, a slow network client) consumes more slowly than the source produces, and the Writable’s internal buffer starts to fill",
          "When the buffer goes past the `highWaterMark`, `write()` returns `false`: the signal for “stop sending for now”",
          "The producer pauses: `pipe` and `pipeline` call `pause()` on the source on their own; by hand, your own loop must stop",
          "The destination drains the buffer and emits `drain`",
          "The producer resumes, the cycle starts again and memory use stays steady",
        ],
        nota: "The `highWaterMark` is how much fits in the buffer before the signal. The default is small and varies by stream type (check the documentation on nodejs.org).",
      },
      {
        tipo: "passos",
        titulo: "The path where the brake is ignored",
        passos: [
          {
            titulo: "The loop ignores the `false`",
            texto:
              "A `for` calls `write()` without looking at the return value. Node accepts everything and keeps the excess in memory; `false` is a request, not a refusal.",
          },
          {
            titulo: "Memory grows silently",
            texto:
              "Whatever the destination has not yet consumed piles up in the Writable’s buffer. There is no error, only rising consumption, more garbage-collection pauses and, in the end, a process killed for lack of memory.",
          },
          {
            titulo: "With `.pipe()` the brake exists, but the cleanup does not",
            texto:
              "`pipe` respects backpressure between two streams, but if one of them fails, the others are not closed automatically: files stay open and the error does not reach a single place.",
          },
          {
            titulo: "The fix: `pipeline`",
            texto:
              "`pipeline(source, ...transforms, destination)` applies backpressure across the whole chain, forwards the first error, destroys every stream and reports completion through a callback or, in `node:stream/promises`, a promise.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "By hand and with pipeline",
        legenda: "JavaScript",
        codigo: [
          'import { once } from "node:events";',
          'import { createReadStream, createWriteStream } from "node:fs";',
          'import { pipeline } from "node:stream/promises";',
          "",
          "// By hand: respect the false from write() and wait for drain",
          'const out = createWriteStream("out.txt");',
          "for (let i = 0; i < 1_000_000; i++) {",
          '  if (!out.write(`line ${i}\\n`)) await once(out, "drain");',
          "}",
          "out.end();",
          "",
          "// With pipeline: the brake, errors and cleanup come built in",
          'await pipeline(createReadStream("big.log"), createWriteStream("copy.log"));',
        ].join("\n"),
        nota: "Example as an ES module, with top-level `await`. If `out` fails while the loop is waiting, `once` rejects with the error instead of hanging.",
      },
      {
        tipo: "tabela",
        titulo: "pipe() vs pipeline()",
        colunas: ["Aspect", "`pipe()`", "`pipeline()`"],
        linhas: [
          ["Backpressure", "Yes, between two streams", "Yes, across every stage"],
          ["Several stages", "One chained `.pipe()` per stage, by hand", "A single call with the whole list of stages"],
          [
            "Error",
            "Does not propagate: each stream needs its own `error` handling",
            "The first error reaches a single callback or promise",
          ],
          ["Cleanup", "Does not close the other streams", "Destroys every stream (files get closed)"],
          [
            "Completion signal",
            "The last stream’s `finish` event",
            "A callback, or `await` in the `node:stream/promises` version",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What to take away",
        texto:
          "The cycle is: `write()` returns `false` → **stop** → wait for `drain` → continue. In your own Readable, the same applies to `push()`: if it returns `false`, stop reading from the source until you are called again. In practice, use `pipeline` by default: besides the brake, it accepts async generator functions as stages and a `signal` option to cancel with an `AbortSignal`. To deliver a file to an HTTP client, see L68.",
      },
    ],
    armadilhas: [
      "Calling `write()` in a loop without checking the return value: memory grows with no error at all until the process dies.",
      "Reading the `false` from `write()` as “data lost”: the data was accepted, the `false` only asks you to stop sending.",
      "Chaining `.pipe()` without handling `error` on each stream: the error does not propagate and resources are not released.",
      "Forgetting to await (or handle the rejection of) the `node:stream/promises` `pipeline`: the failure becomes an unhandled rejection.",
    ],
    autoteste: [
      {
        pergunta: "What does `write()` returning `false` mean and what should you do?",
        resposta:
          "That the Writable’s internal buffer went past the `highWaterMark`. The producer should stop writing and wait for the `drain` event; `pipe` and `pipeline` do this on their own.",
      },
      {
        pergunta: "Why prefer `pipeline()` over chaining `.pipe()`?",
        resposta:
          "Because it applies backpressure across the whole chain and, if any stage fails, destroys every stream and delivers a single error. `.pipe()` neither propagates errors nor closes the other streams.",
      },
    ],
  },
};
