import type { Pergunta } from "../../tipos";

// L70 · Evitar race conditions em efeitos
export const l070: Pergunta = {
  numero: 70,
  modulo: "linkedin-regras-e-effects",
  metodo: "playbook",
  pt: {
    titulo: "Evitar race conditions em efeitos",
    pergunta: "Como evitar race conditions no useEffect()?",
    porqueEsteMetodo:
      "Race condition é um problema de ordem e de tempo, e a prevenção segue um procedimento: reconhecer o cenário, escolher entre ignorar e cancelar, tratar o abort e não esquecer carregamento e erro.",
    resposta30s:
      "Há race condition quando **duas requisições estão em voo e a resposta antiga chega depois da nova**, sobrescrevendo-a: a ordem de chegada não é a ordem de envio. A prevenção está na **limpeza do efeito**: uma flag **`ignorar`** descarta o resultado antigo e um **`AbortController`** cancela a requisição de fato, de modo que cada execução só vale para a sua própria dependência. Para dados de servidor, prefira bibliotecas ou frameworks que já resolvem isso.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: uma resposta antiga não pode vencer",
        passos: [
          {
            titulo: "Reconheça o cenário",
            texto:
              "O efeito depende de um valor que muda rápido (texto de busca, id da rota, página) e faz uma chamada assíncrona. Digite “ab” e depois “abc”: a requisição de “ab” pode terminar por último, e a lista passa a mostrar o resultado errado.",
          },
          {
            titulo: "Use a limpeza como fronteira",
            texto:
              "Cada execução do efeito tem a sua própria limpeza, que roda quando as dependências mudam ou o componente desmonta. É nela que você invalida a execução anterior.",
          },
          {
            titulo: "Escolha entre ignorar e cancelar",
            texto:
              "A flag `ignorar` é a mais simples: a requisição continua, mas o resultado é descartado. O `AbortController` cancela a requisição (`fetch(url, { signal })` e `controle.abort()` na limpeza), poupando rede e processamento.",
          },
          {
            titulo: "Trate o abort como esperado",
            texto:
              "A promise do `fetch` rejeita com um erro de nome `AbortError`. Reconheça-o e saia sem marcar erro na tela: cancelar de propósito não é falha.",
          },
          {
            titulo: "Cuide de carregamento e erro",
            texto:
              "Ao iniciar uma nova busca, marque que está carregando e limpe o erro anterior. Atualize resultados, erro e carregamento só para a execução vigente, ou a tela pode mostrar “carregando” para uma busca já cancelada.",
          },
          {
            titulo: "Reduza o volume e prefira ferramentas prontas",
            texto:
              "Para digitação, um debounce evita uma requisição por tecla (veja L113). Para dados de servidor, bibliotecas de dados e frameworks (cache, cancelamento, ordem das respostas) tratam a corrida por você; escrever o efeito à mão fica para casos simples.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A flag `ignorar` na limpeza",
        legenda: "JSX",
        codigo: [
          "useEffect(() => {",
          "  let ignorar = false;",
          "",
          "  buscar(termo).then((dados) => {",
          "    if (!ignorar) setResultados(dados); // resposta de um termo antigo é descartada",
          "  });",
          "",
          "  return () => {",
          "    ignorar = true; // roda quando `termo` muda ou o componente sai",
          "  };",
          "}, [termo]);",
        ].join("\n"),
        nota: "A requisição do termo antigo continua até o fim; só o resultado é descartado. Funciona com qualquer API assíncrona, não só com `fetch`.",
      },
      {
        tipo: "codigo",
        titulo: "Cancelando de verdade com `AbortController`",
        legenda: "JSX",
        codigo: [
          "useEffect(() => {",
          "  const controle = new AbortController();",
          '  setStatus("carregando");',
          "",
          "  fetch(`/api/busca?q=${encodeURIComponent(termo)}`, { signal: controle.signal })",
          "    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))",
          "    .then((dados) => {",
          "      setResultados(dados);",
          '      setStatus("pronto");',
          "    })",
          "    .catch((e) => {",
          '      if (e.name !== "AbortError") setStatus("erro"); // abort é esperado, não é falha',
          "    });",
          "",
          "  return () => controle.abort(); // nova busca ou desmontagem cancela a anterior",
          "}, [termo]);",
        ].join("\n"),
        nota: "Os estados `resultados` e `status` vêm de `useState` no componente. Crie um `AbortController` novo a cada execução: depois de abortado, ele não volta a ser usado.",
      },
      {
        tipo: "tabela",
        titulo: "Ignorar, cancelar ou delegar",
        colunas: ["Abordagem", "O que acontece com a requisição", "Quando usar"],
        linhas: [
          [
            "Flag `ignorar`",
            "Continua até o fim; só o resultado é descartado",
            "Qualquer chamada assíncrona, inclusive as que não aceitam cancelamento",
          ],
          [
            "`AbortController`",
            "É cancelada de verdade: a transferência é interrompida e a promise rejeita com `AbortError`",
            "`fetch` e clientes que aceitam `signal`; quando poupar rede e processamento importa",
          ],
          [
            "Biblioteca ou framework de dados",
            "A ferramenta cuida da ordem, do cache e do cancelamento",
            "Dados de servidor em geral: a primeira opção quando o projeto já tem uma",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cancelar no cliente não desfaz nada no servidor",
        texto:
          "Abortar uma requisição só interrompe o lado do cliente. Se ela já chegou ao servidor, a operação pode ter sido executada: um `POST` cancelado não garante que nada foi gravado. Por isso este padrão serve para **leituras** disparadas por efeito. Ações do usuário (enviar, salvar) vão em handlers e precisam ser idempotentes ou tratadas no servidor.",
      },
    ],
    armadilhas: [
      "Corrigir só com a flag e achar que a requisição foi cancelada: ela segue consumindo rede e servidor.",
      "Mostrar o `AbortError` ao usuário como se fosse falha: ele é esperado quando a busca muda ou o componente desmonta.",
      "Esquecer carregamento e erro: a tela fica com o indicador de uma busca cancelada ou com o erro da anterior.",
      "Reutilizar um único `AbortController` entre execuções: depois de abortado ele não volta; crie um novo dentro de cada execução do efeito.",
    ],
    autoteste: [
      {
        pergunta: "Por que a resposta de uma requisição antiga pode sobrescrever a nova?",
        resposta:
          "Porque a ordem de chegada das respostas não é a ordem de envio: rede e servidor variam. Sem uma fronteira de validade, a última resposta a chegar vence, mesmo que seja de uma busca já substituída.",
      },
      {
        pergunta: "Qual a diferença entre ignorar o resultado e cancelar a requisição?",
        resposta:
          "Ignorar descarta a resposta, mas deixa a requisição terminar. Cancelar (`AbortController`) interrompe a requisição e faz a promise rejeitar com `AbortError`, que deve ser tratado como esperado.",
      },
    ],
  },
  en: {
    titulo: "Preventing effect race conditions",
    pergunta: "How do you prevent race conditions in useEffect()?",
    porqueEsteMetodo:
      "A race condition is a problem of order and timing, and preventing it follows a procedure: recognize the scenario, choose between ignoring and cancelling, handle the abort and don’t forget loading and error states.",
    resposta30s:
      "A race condition happens when **two requests are in flight and the old response arrives after the new one**, overwriting it: arrival order is not send order. Prevention lives in the **effect cleanup**: an **`ignore`** flag discards the old result and an **`AbortController`** actually cancels the request, so each run only counts for its own dependency. For server data, prefer libraries or frameworks that already solve this.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: an old response must not win",
        passos: [
          {
            titulo: "Recognize the scenario",
            texto:
              "The effect depends on a value that changes quickly (search text, route id, page) and makes an async call. Type “ab” and then “abc”: the “ab” request may finish last, and the list ends up showing the wrong result.",
          },
          {
            titulo: "Use the cleanup as a boundary",
            texto:
              "Each run of the effect has its own cleanup, which runs when the dependencies change or the component unmounts. That is where you invalidate the previous run.",
          },
          {
            titulo: "Choose between ignoring and cancelling",
            texto:
              "The `ignore` flag is the simplest: the request keeps going, but its result is discarded. `AbortController` cancels the request (`fetch(url, { signal })` and `controller.abort()` in the cleanup), saving network and processing.",
          },
          {
            titulo: "Treat the abort as expected",
            texto:
              "The `fetch` promise rejects with an error named `AbortError`. Recognize it and bail out without showing an error on screen: cancelling on purpose is not a failure.",
          },
          {
            titulo: "Handle loading and error",
            texto:
              "When a new search starts, mark it as loading and clear the previous error. Update results, error and loading only for the current run, or the screen may show “loading” for a search that was already cancelled.",
          },
          {
            titulo: "Reduce volume and prefer ready-made tools",
            texto:
              "For typing, a debounce avoids one request per keystroke (see L113). For server data, data libraries and frameworks (caching, cancellation, response ordering) handle the race for you; writing the effect by hand is for simple cases.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The `ignore` flag in the cleanup",
        legenda: "JSX",
        codigo: [
          "useEffect(() => {",
          "  let ignore = false;",
          "",
          "  search(term).then((data) => {",
          "    if (!ignore) setResults(data); // a response for an old term is discarded",
          "  });",
          "",
          "  return () => {",
          "    ignore = true; // runs when `term` changes or the component leaves",
          "  };",
          "}, [term]);",
        ].join("\n"),
        nota: "The old term’s request keeps going until it ends; only its result is discarded. It works with any async API, not just `fetch`.",
      },
      {
        tipo: "codigo",
        titulo: "Really cancelling with `AbortController`",
        legenda: "JSX",
        codigo: [
          "useEffect(() => {",
          "  const controller = new AbortController();",
          '  setStatus("loading");',
          "",
          "  fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: controller.signal })",
          "    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))",
          "    .then((data) => {",
          "      setResults(data);",
          '      setStatus("ready");',
          "    })",
          "    .catch((e) => {",
          '      if (e.name !== "AbortError") setStatus("error"); // abort is expected, not a failure',
          "    });",
          "",
          "  return () => controller.abort(); // a new search or unmount cancels the previous one",
          "}, [term]);",
        ].join("\n"),
        nota: "The `results` and `status` states come from `useState` in the component. Create a new `AbortController` on every run: once aborted, it cannot be reused.",
      },
      {
        tipo: "tabela",
        titulo: "Ignore, cancel or delegate",
        colunas: ["Approach", "What happens to the request", "When to use it"],
        linhas: [
          [
            "`ignore` flag",
            "Keeps going until the end; only the result is discarded",
            "Any async call, including those that do not support cancellation",
          ],
          [
            "`AbortController`",
            "Really cancelled: the transfer is interrupted and the promise rejects with `AbortError`",
            "`fetch` and clients that accept `signal`; when saving network and processing matters",
          ],
          [
            "Data library or framework",
            "The tool handles ordering, caching and cancellation",
            "Server data in general: the first choice when the project already has one",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cancelling on the client undoes nothing on the server",
        texto:
          "Aborting a request only stops the client side. If it already reached the server, the operation may have run: a cancelled `POST` does not guarantee that nothing was written. That is why this pattern is for **reads** triggered by an effect. User actions (submit, save) belong in handlers and must be idempotent or handled on the server.",
      },
    ],
    armadilhas: [
      "Fixing it with the flag only and assuming the request was cancelled: it keeps using network and server resources.",
      "Showing the `AbortError` to the user as if it were a failure: it is expected when the search changes or the component unmounts.",
      "Forgetting loading and error: the screen keeps the indicator of a cancelled search or the error from the previous one.",
      "Reusing a single `AbortController` across runs: once aborted it cannot come back; create a new one inside each run of the effect.",
    ],
    autoteste: [
      {
        pergunta: "Why can the response of an old request overwrite the new one?",
        resposta:
          "Because the order in which responses arrive is not the order in which requests were sent: network and server vary. Without a validity boundary, the last response to arrive wins, even if it belongs to a search that was already replaced.",
      },
      {
        pergunta: "What is the difference between ignoring the result and cancelling the request?",
        resposta:
          "Ignoring discards the response but lets the request finish. Cancelling (`AbortController`) interrupts the request and makes the promise reject with `AbortError`, which should be treated as expected.",
      },
    ],
  },
};
