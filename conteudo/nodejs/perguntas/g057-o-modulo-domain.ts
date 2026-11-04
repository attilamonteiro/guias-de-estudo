import type { Pergunta } from "../../tipos";

// G57 · O módulo domain
export const g057: Pergunta = {
  numero: 657,
  modulo: "gist-avancado",
  metodo: "whys",
  pt: {
    titulo: "O módulo domain",
    pergunta: "Explique o conceito de Domain no Node.js.",
    porqueEsteMetodo:
      "Descrever o que o `domain` fazia é a parte fácil; o que a entrevista testa é saber por que ele caiu em desuso. A cadeia de “por quês” mostra o problema de cada ideia até chegar aos substitutos.",
    resposta30s:
      "O módulo **`domain`** agrupava operações assíncronas (callbacks, timers, emissores de eventos) num “domínio” para que qualquer erro dentro dele chegasse a **um único ponto**, o evento `error` do domínio. Foi **desaconselhado** porque a captura **implícita** é pouco confiável e convida a **seguir em frente num estado desconhecido**; confira o estado atual na documentação do Node. Hoje se usa **tratamento explícito** (promises e `async`/`await`), `AsyncLocalStorage` para o contexto e **supervisor com reinício**; em código novo, não use `domain`.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o `domain` foi criado?",
            resposta:
              "Porque um `try/catch` comum **não alcança** o que acontece depois que uma operação assíncrona volta: o erro lançado dentro de um callback já está fora da pilha em que você tratou. O `domain` oferecia um ponto só: dentro de `domain.run()`, os timers, callbacks e emissores criados ficavam ligados ao domínio, e erros não capturados ou eventos `error` desses recursos viravam um evento `error` do próprio domínio.",
          },
          {
            pergunta: "Por que a captura implícita virou problema?",
            resposta:
              "Porque o vínculo vinha de **onde o recurso foi criado**, não de uma intenção explícita. Um emissor criado numa requisição e reaproveitado em outra, uma conexão compartilhada de um pool ou código de terceiros podiam carregar o domínio errado, ou nenhum, e o erro caía no tratador errado ou escapava. Não dava para olhar o código e saber quem trataria a falha.",
          },
          {
            pergunta: "Por que “capturar o erro e seguir em frente” é perigoso?",
            resposta:
              "Porque o `throw` interrompeu o código no meio: escrita pela metade, recurso aberto, lock não liberado, estado em memória inconsistente. O `domain` tornava tentador registrar e continuar, e a documentação do Node avisa que quase nunca existe jeito seguro de retomar de onde parou (veja L116). Você troca uma queda visível por um bug silencioso.",
          },
          {
            pergunta: "Por que foi desaconselhado em vez de consertado?",
            resposta:
              "Porque, na prática, o mecanismo dependia de acompanhar cada caminho assíncrono do Node e das bibliotecas, o que dá comportamento sutil e difícil de manter. Surgiram APIs com propósito mais claro: promises e `async`/`await` levam o erro por onde o código já flui, e `AsyncLocalStorage` (veja L84) carrega contexto. A documentação o marca como depreciado ou em vias de ser; confira o estado em nodejs.org.",
          },
          {
            pergunta: "Por que os substitutos são melhores?",
            resposta:
              "Porque cada um faz uma coisa de forma **explícita**: o erro é tratado onde nasce (`try/catch` com `await`, `.catch()`, ouvinte de `error`), o contexto da requisição vai por `AsyncLocalStorage`, e a falha fatal fica para um **supervisor que reinicia** o processo (PM2, Kubernetes, systemd; veja L116). O `domain` misturava as três coisas num truque implícito.",
          },
        ],
        causaRaiz:
          "O `domain` tentava tratar erros **de longe** e por **magia implícita**. Erro tratado longe da origem deixa o programa em estado desconhecido, e vínculo implícito é imprevisível. Os substitutos separam tratamento explícito, contexto explícito e reinício limpo.",
      },
      {
        tipo: "codigo",
        titulo: "Como era, só para reconhecer em código antigo",
        legenda: "JavaScript",
        codigo: `import domain from "node:domain"; // legado: não use em código novo

const d = domain.create();

d.on("error", (erro) => {
  // o certo aqui era registrar e encerrar, não "seguir em frente"
  console.error("capturado pelo domain:", erro.message);
});

d.run(() => {
  setTimeout(() => {
    throw new Error("falha dentro de um callback assíncrono");
  }, 10);
});`,
        nota: "O `throw` acontece num timer, fora da pilha do `d.run()`, e mesmo assim cai no ouvinte do domínio. Era essa a promessa, e também o risco.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não use em código novo, mas saiba reconhecer",
        texto:
          "Você ainda pode encontrar o `domain` em código antigo ou em dependências velhas. Na entrevista, mostre que sabe o que ele fazia, por que não é recomendado e o que o substitui. “Domain” aqui é um **domínio de erros** do Node, sem relação com o domínio do DDD nem com o domínio de DNS.",
      },
    ],
    armadilhas: [
      "Usar o `domain` em código novo, ou achar que ele “captura tudo” e dispensa `try/catch` e tratamento na origem.",
      "Usar o ouvinte de `error` do domínio para manter o processo no ar: o estado é desconhecido depois do erro.",
      "Confundir o `domain` do Node com o domínio do DDD ou com um domínio de DNS.",
      "Trocar o `domain` por `AsyncLocalStorage` esperando captura de erros: ele propaga contexto, não trata falhas.",
    ],
    autoteste: [
      {
        pergunta: "O que o `domain.run()` fazia e por que o `try/catch` comum não bastava?",
        resposta:
          "Ele ligava timers, callbacks e emissores criados dentro dele a um domínio, e os erros desses recursos chegavam ao evento `error` do domínio. O `try/catch` comum só vê erros lançados enquanto a pilha dele ainda está ativa, e um callback assíncrono roda depois, em outra pilha.",
      },
      {
        pergunta: "O que se usa hoje no lugar do `domain`?",
        resposta:
          "Tratamento explícito na origem (`try/catch` com `await`, `.catch()`, ouvinte de `error`), `AsyncLocalStorage` para o contexto da requisição e um supervisor que reinicia o processo depois de uma falha fatal.",
      },
    ],
  },
  en: {
    titulo: "The domain module",
    pergunta: "Explain the concept of Domain in Node.js",
    porqueEsteMetodo:
      "Describing what `domain` did is the easy part; what the interview tests is knowing why it fell out of use. The chain of whys shows the problem with each idea until it reaches the replacements.",
    resposta30s:
      "The **`domain`** module grouped asynchronous operations (callbacks, timers, event emitters) into a “domain” so any error inside it reached **a single place**, the domain’s `error` event. It was **discouraged** because **implicit** capture is unreliable and invites **carrying on in an unknown state**; check its current status in the Node documentation. Today you use **explicit handling** (promises and `async`/`await`), `AsyncLocalStorage` for context and a **supervisor with restart**; in new code, do not use `domain`.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why was `domain` created?",
            resposta:
              "Because a plain `try/catch` **cannot reach** what happens after an asynchronous operation returns: an error thrown inside a callback is already outside the stack where you handled it. `domain` offered a single place: inside `domain.run()`, the timers, callbacks and emitters created were tied to the domain, and uncaught errors or `error` events from those resources became an `error` event on the domain itself.",
          },
          {
            pergunta: "Why did implicit capture become a problem?",
            resposta:
              "Because the link came from **where the resource was created**, not from an explicit intent. An emitter created in one request and reused in another, a shared pool connection or third-party code could carry the wrong domain, or none, and the error landed in the wrong handler or escaped. You could not look at the code and know who would handle the failure.",
          },
          {
            pergunta: "Why is “catch the error and carry on” dangerous?",
            resposta:
              "Because the `throw` interrupted the code midway: a half-finished write, an open resource, a lock never released, inconsistent in-memory state. `domain` made it tempting to log and continue, and the Node documentation warns that there is almost never a safe way to pick up where it left off (see L116). You trade a visible crash for a silent bug.",
          },
          {
            pergunta: "Why was it discouraged instead of fixed?",
            resposta:
              "Because, in practice, the mechanism depended on tracking every asynchronous path in Node and the libraries, which gives subtle behavior that is hard to maintain. APIs with a clearer purpose appeared: promises and `async`/`await` carry the error along the path the code already follows, and `AsyncLocalStorage` (see L84) carries context. The documentation marks it as deprecated or heading that way; check the status on nodejs.org.",
          },
          {
            pergunta: "Why are the replacements better?",
            resposta:
              "Because each does one thing **explicitly**: the error is handled where it is born (`try/catch` with `await`, `.catch()`, an `error` listener), request context travels through `AsyncLocalStorage`, and a fatal failure is left to a **supervisor that restarts** the process (PM2, Kubernetes, systemd; see L116). `domain` mixed all three into one implicit trick.",
          },
        ],
        causaRaiz:
          "`domain` tried to handle errors **from afar** and through **implicit magic**. An error handled far from its origin leaves the program in an unknown state, and an implicit link is unpredictable. The replacements separate explicit handling, explicit context and a clean restart.",
      },
      {
        tipo: "codigo",
        titulo: "How it looked, only so you recognize it in old code",
        legenda: "JavaScript",
        codigo: `import domain from "node:domain"; // legacy: do not use in new code

const d = domain.create();

d.on("error", (error) => {
  // the right move here was to log and exit, not to "carry on"
  console.error("caught by the domain:", error.message);
});

d.run(() => {
  setTimeout(() => {
    throw new Error("failure inside an asynchronous callback");
  }, 10);
});`,
        nota: "The `throw` happens in a timer, outside the `d.run()` stack, and still lands in the domain’s listener. That was the promise, and also the risk.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Do not use it in new code, but know how to recognize it",
        texto:
          "You may still find `domain` in old code or in outdated dependencies. In an interview, show that you know what it did, why it is not recommended and what replaces it. “Domain” here is a Node **error domain**, unrelated to the DDD domain or to a DNS domain.",
      },
    ],
    armadilhas: [
      "Using `domain` in new code, or thinking it “catches everything” and removes the need for `try/catch` and handling at the source.",
      "Using the domain’s `error` listener to keep the process running: the state is unknown after the error.",
      "Confusing Node’s `domain` with the DDD domain or a DNS domain.",
      "Swapping `domain` for `AsyncLocalStorage` expecting it to catch errors: it propagates context, it does not handle failures.",
    ],
    autoteste: [
      {
        pergunta: "What did `domain.run()` do, and why was a plain `try/catch` not enough?",
        resposta:
          "It tied timers, callbacks and emitters created inside it to a domain, and errors from those resources reached the domain’s `error` event. A plain `try/catch` only sees errors thrown while its stack is still active, and an asynchronous callback runs later, on another stack.",
      },
      {
        pergunta: "What do you use today instead of `domain`?",
        resposta:
          "Explicit handling at the source (`try/catch` with `await`, `.catch()`, an `error` listener), `AsyncLocalStorage` for request context and a supervisor that restarts the process after a fatal failure.",
      },
    ],
  },
};
