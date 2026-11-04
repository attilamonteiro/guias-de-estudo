import type { Pergunta } from "../../tipos";

// L26 · Combinadores de Promise
export const l026: Pergunta = {
  numero: 126,
  modulo: "linkedin-assincrono",
  metodo: "compare",
  pt: {
    titulo: "Combinadores de Promise",
    pergunta: "Qual é a diferença entre Promise.all(), Promise.allSettled(), Promise.race() e Promise.any()?",
    porqueEsteMetodo:
      "Os quatro combinadores têm a mesma assinatura e se confundem com facilidade; o que muda é quando resolvem, quando rejeitam e o que devolvem. Uma matriz lado a lado mostra as diferenças de uma vez, e a regra de decisão diz qual escolher.",
    resposta30s:
      "Todos recebem uma lista de promises e devolvem uma só, mas decidem de formas diferentes: **`all`** resolve com todos os valores e rejeita na primeira falha; **`allSettled`** espera todas terminarem e devolve o resultado de cada uma, sem nunca rejeitar; **`race`** adota o resultado da primeira que terminar, seja sucesso ou erro; **`any`** adota a primeira que der certo e só rejeita, com `AggregateError`, se todas falharem. Nenhum deles cancela as promises que ficaram para trás.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Os quatro lado a lado",
        colunas: ["Combinador", "Resolve quando", "Rejeita quando", "Valor devolvido", "Uso típico"],
        linhas: [
          [
            "`Promise.all`",
            "Todas cumprem",
            "A primeira rejeita (com o motivo dela)",
            "Array dos valores, na ordem de entrada",
            "Tarefas independentes que só servem juntas: tudo ou nada",
          ],
          [
            "`Promise.allSettled`",
            "Todas terminam, cumpridas ou rejeitadas",
            "Nunca",
            "Array de `{ status, value }` ou `{ status, reason }`",
            "Relatório parcial: enviar vários e-mails e saber quais falharam",
          ],
          [
            "`Promise.race`",
            "A primeira a terminar cumpre",
            "A primeira a terminar rejeita",
            "O valor ou o motivo dessa primeira",
            "Timeout: o que acontecer primeiro, resposta ou prazo",
          ],
          [
            "`Promise.any`",
            "A primeira a cumprir",
            "Todas rejeitam (`AggregateError`)",
            "O valor da primeira que cumpriu",
            "Réplicas ou espelhos: a primeira resposta boa vale",
          ],
        ],
        nota: "Lista vazia: `all` e `allSettled` resolvem com `[]`; `race` fica pendente para sempre; `any` rejeita. Valores que não são promises contam como já cumpridos.",
      },
      {
        tipo: "codigo",
        titulo: "Timeout com `race`",
        legenda: "JavaScript",
        codigo: [
          "function comPrazo(promessa, ms) {",
          "  let timer;",
          "  const estouro = new Promise((_, rejeitar) => {",
          "    timer = setTimeout(() => rejeitar(new Error(`estourou ${ms} ms`)), ms);",
          "  });",
          "  // quem terminar primeiro decide; o timer é limpo em qualquer caso",
          "  return Promise.race([promessa, estouro]).finally(() => clearTimeout(timer));",
          "}",
          "",
          'const dados = await comPrazo(fetch("https://api.exemplo.com/dados"), 3000);',
        ].join("\n"),
        nota: "O `race` só desiste de esperar: o `fetch` continua em andamento. Para cancelá-lo de verdade, passe um `AbortSignal` (veja L33).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Pergunte o que você precisa do conjunto. **Todos, ou nada**: `all`. **O resultado de cada um**, mesmo com falhas: `allSettled`. **O primeiro a terminar**, sucesso ou erro (um timeout, por exemplo): `race`. **O primeiro que der certo**, ignorando as falhas: `any`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Nenhum deles cancela nada",
        texto:
          "Os quatro apenas **observam** as promises. As que “perderam” continuam rodando até o fim, com todos os efeitos colaterais (uma requisição já enviada, uma gravação em andamento). Para interromper de verdade, use `AbortController` (veja L33). Com muitos itens, também não dispare tudo de uma vez: limite a concorrência (veja T41).",
      },
    ],
    armadilhas: [
      "Achar que `race` ou `all` cancelam as promises que ficaram para trás: elas continuam executando e produzindo efeitos.",
      "Usar `all` quando falha parcial é aceitável: uma única rejeição descarta os resultados que deram certo; nesse caso use `allSettled`.",
      "Usar `allSettled` e não olhar o `status` de cada item: como ele nunca rejeita, os erros passam em silêncio.",
      "Confundir `race` com `any`: se a primeira a terminar rejeita, o `race` rejeita junto, enquanto o `any` ignora a falha e espera por um sucesso.",
    ],
    autoteste: [
      {
        pergunta: "Quando usar `allSettled` em vez de `all`?",
        resposta:
          "Quando você precisa do resultado de cada tarefa e aceita falhas parciais: o `all` rejeita na primeira falha e perde o resto, já o `allSettled` espera todas e informa `fulfilled` ou `rejected` para cada uma.",
      },
      {
        pergunta: "Se a primeira promise a terminar rejeita, o que fazem `race` e `any`?",
        resposta:
          "O `race` rejeita com esse motivo, porque adota o primeiro resultado, qualquer que seja. O `any` ignora a rejeição e espera uma promise cumprir; só se todas rejeitarem ele rejeita, com `AggregateError`.",
      },
    ],
  },
  en: {
    titulo: "Promise combinators",
    pergunta: "What is the difference between Promise.all(), Promise.allSettled(), Promise.race(), and Promise.any()?",
    porqueEsteMetodo:
      "The four combinators share the same signature and are easy to mix up; what changes is when they resolve, when they reject and what they return. A side-by-side matrix shows the differences at once, and the decision rule says which one to pick.",
    resposta30s:
      "They all take a list of promises and return a single one, but they decide differently: **`all`** resolves with every value and rejects on the first failure; **`allSettled`** waits for all of them to finish and returns each outcome, never rejecting; **`race`** adopts the outcome of the first to finish, success or error; **`any`** adopts the first to succeed and only rejects, with an `AggregateError`, if all of them fail. None of them cancels the promises left behind.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The four side by side",
        colunas: ["Combinator", "Resolves when", "Rejects when", "Value returned", "Typical use"],
        linhas: [
          [
            "`Promise.all`",
            "All fulfill",
            "The first one rejects (with its reason)",
            "Array of the values, in input order",
            "Independent tasks that are only useful together: all or nothing",
          ],
          [
            "`Promise.allSettled`",
            "All finish, fulfilled or rejected",
            "Never",
            "Array of `{ status, value }` or `{ status, reason }`",
            "Partial report: send several emails and learn which failed",
          ],
          [
            "`Promise.race`",
            "The first to finish fulfills",
            "The first to finish rejects",
            "The value or reason of that first one",
            "Timeout: whichever happens first, the answer or the deadline",
          ],
          [
            "`Promise.any`",
            "The first to fulfill",
            "All reject (`AggregateError`)",
            "The value of the first one that fulfilled",
            "Replicas or mirrors: the first good answer wins",
          ],
        ],
        nota: "Empty list: `all` and `allSettled` resolve with `[]`; `race` stays pending forever; `any` rejects. Values that are not promises count as already fulfilled.",
      },
      {
        tipo: "codigo",
        titulo: "Timeout with `race`",
        legenda: "JavaScript",
        codigo: [
          "function withDeadline(promise, ms) {",
          "  let timer;",
          "  const timeout = new Promise((_, reject) => {",
          "    timer = setTimeout(() => reject(new Error(`timed out after ${ms} ms`)), ms);",
          "  });",
          "  // whichever finishes first decides; the timer is cleared either way",
          "  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));",
          "}",
          "",
          'const data = await withDeadline(fetch("https://api.example.com/data"), 3000);',
        ].join("\n"),
        nota: "`race` only stops waiting: the `fetch` keeps running. To really cancel it, pass an `AbortSignal` (see L33).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Ask what you need from the group. **Everything, or nothing**: `all`. **The outcome of each one**, even with failures: `allSettled`. **The first to finish**, success or error (a timeout, for example): `race`. **The first to succeed**, ignoring failures: `any`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "None of them cancels anything",
        texto:
          "The four only **observe** the promises. The ones that “lost” keep running to the end, with every side effect (a request already sent, a write in progress). To really stop them, use `AbortController` (see L33). With many items, do not fire everything at once either: limit the concurrency (see T41).",
      },
    ],
    armadilhas: [
      "Thinking `race` or `all` cancel the promises left behind: they keep running and producing effects.",
      "Using `all` when partial failure is acceptable: a single rejection throws away the results that succeeded; use `allSettled` instead.",
      "Using `allSettled` without checking each item’s `status`: since it never rejects, errors pass silently.",
      "Mixing up `race` and `any`: if the first to finish rejects, `race` rejects too, while `any` ignores the failure and waits for a success.",
    ],
    autoteste: [
      {
        pergunta: "When should you use `allSettled` instead of `all`?",
        resposta:
          "When you need the outcome of every task and accept partial failures: `all` rejects on the first failure and loses the rest, while `allSettled` waits for all and reports `fulfilled` or `rejected` for each one.",
      },
      {
        pergunta: "If the first promise to finish rejects, what do `race` and `any` do?",
        resposta:
          "`race` rejects with that reason, because it adopts the first outcome, whatever it is. `any` ignores the rejection and waits for a promise to fulfill; only if all of them reject does it reject, with an `AggregateError`.",
      },
    ],
  },
};
