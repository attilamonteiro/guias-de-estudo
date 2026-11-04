import type { Pergunta } from "../../tipos";

// L116 · Exceções não tratadas
export const l116: Pergunta = {
  numero: 216,
  modulo: "linkedin-producao",
  metodo: "whys",
  pt: {
    titulo: "Exceções não tratadas",
    pergunta: "Como você lida com exceções não capturadas e rejeições de promises não tratadas?",
    porqueEsteMetodo:
      "A resposta que soa estranha (“derrube o processo”) só convence quando você entende cada porquê: o que o Node faz por padrão, por que continuar é perigoso, quem reinicia e onde o conserto de verdade mora. A cadeia de “por quês” leva a essa conclusão.",
    resposta30s:
      "`uncaughtException` e `unhandledRejection` são o **último recurso**: quando disparam, o programa está em **estado desconhecido**, e o seguro é **registrar o erro, encerrar com prazo curto e deixar um supervisor** (PM2, Kubernetes, systemd) **reiniciar**. O conserto de verdade é tratar o erro **na origem** (`try/catch` com `await`, `.catch()`, ouvinte de `error`), para que ele nunca chegue ao topo.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o Node derruba o processo por padrão quando ninguém trata um erro?",
            resposta:
              "Porque um erro que subiu até o topo da pilha sem dono é um **bug que o programa não previu**. Uma exceção não capturada imprime a stack e encerra com código diferente de zero. Uma rejeição sem tratamento, nas versões atuais, é promovida a exceção não capturada (versões antigas só avisavam). Falhar alto é preferível a seguir cego; confira `--unhandled-rejections` em nodejs.org para a sua versão.",
          },
          {
            pergunta: "Por que não basta registrar o erro no `uncaughtException` e seguir adiante?",
            resposta:
              "Porque o `throw` interrompeu o código no meio: escrita pela metade, lock que nunca foi liberado, transação aberta, contador ou cache em memória inconsistente, ouvinte que não foi removido. Você não sabe o que ficou torto, e o estrago pode aparecer depois, em outra requisição, como dado errado e **sem barulho**. A documentação do Node diz que não é seguro retomar a operação normal depois desse evento.",
          },
          {
            pergunta: "Por que reiniciar resolve?",
            resposta:
              "Porque devolve a aplicação a um **estado conhecido** em segundos, e o custo é pequeno quando há várias instâncias atrás de um balanceador. Quem reinicia é um **supervisor** (PM2, systemd, política de reinício do Docker, Kubernetes), com espera crescente entre tentativas para não entrar em laço de quedas. Alerte sobre a contagem de reinícios: ela é o sinal de que existe um bug.",
          },
          {
            pergunta: "Então por que existem os handlers globais?",
            resposta:
              "Para **morrer bem**: registrar o erro com stack e contexto, enviá-lo ao rastreador de erros, tentar um encerramento gracioso com **prazo curto** (veja L115) e sair com código `1`. Para só observar sem mudar o comportamento, existe `uncaughtExceptionMonitor`. O que não se deve fazer é usar o handler para “manter no ar”.",
          },
          {
            pergunta: "Por que o conserto de verdade está na origem?",
            resposta:
              "Porque quase todo erro que chega ao topo é um tratamento que faltou: promise sem `await` nem `.catch()`, `async` dentro de `forEach`, stream ou `EventEmitter` sem ouvinte de `error`, callback assíncrono fora do `try/catch`. Erros **esperados** (entrada inválida, timeout, recurso inexistente) viram resposta ou retentativa; só os **bugs** devem derrubar o processo. Regras de lint contra promises soltas e um middleware de erros central (veja L41) fecham o ciclo.",
          },
        ],
        causaRaiz:
          "Um erro que ninguém tratou deixa o programa em **estado desconhecido**. Por isso a conduta é **morrer com informação e reiniciar limpo**, e o trabalho verdadeiro é **tratar o erro onde ele nasce**, para o handler global ser raro.",
      },
      {
        tipo: "codigo",
        titulo: "O handler global como último recurso",
        legenda: "JavaScript",
        codigo: `let saindo = false;

function falhaFatal(erro, origem) {
  if (saindo) return;
  saindo = true;
  console.error(JSON.stringify({ nivel: "fatal", origem, mensagem: erro.message, stack: erro.stack }));
  setTimeout(() => process.exit(1), 3000).unref(); // prazo curto: o estado não é confiável
  server.close(() => process.exit(1)); // para de aceitar e sai quando as requisições terminarem
}

process.on("uncaughtException", (erro, origem) => falhaFatal(erro, origem));
process.on("unhandledRejection", (motivo) =>
  falhaFatal(motivo instanceof Error ? motivo : new Error(String(motivo)), "unhandledRejection"),
);`,
        nota: "O motivo de uma rejeição pode ser qualquer valor, não só um `Error`; por isso a conversão. O servidor (`server`) vem de outro lugar do código.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não use o handler para “manter no ar”",
        texto:
          "Capturar o erro e continuar esconde o bug e mantém um estado possivelmente corrompido, o que é pior que uma queda: a falha passa a ser silenciosa. Também não confie em trabalho assíncrono longo dentro do handler, porque o estado pode impedi-lo de terminar. Distinga **erros operacionais** (previstos, tratados e respondidos) de **erros de programação** (bugs, que derrubam o processo).",
      },
    ],
    armadilhas: [
      "Registrar o erro em `uncaughtException` e seguir em frente: o bug fica escondido e o estado, inconsistente.",
      "Promise solta (esquecer `await` ou `.catch()`) e `async` dentro de `forEach`: a rejeição escapa do `try/catch` e vira não tratada.",
      "`EventEmitter` ou stream sem ouvinte de `error`: o evento `error` sem ouvinte vira exceção não capturada (veja T61).",
      "Sair sem garantir que o log foi escrito, ou reiniciar sem supervisor: o erro some ou a aplicação fica fora do ar.",
    ],
    autoteste: [
      {
        pergunta: "Por que é recomendado reiniciar o processo depois de uma `uncaughtException`?",
        resposta:
          "Porque o código foi interrompido no meio e o estado (memória, locks, transações) é desconhecido. Continuar pode produzir resultados errados em silêncio; reiniciar devolve um estado conhecido.",
      },
      {
        pergunta: "Qual a diferença entre erro operacional e erro de programação, e como cada um é tratado?",
        resposta:
          "Operacional é esperado (entrada inválida, timeout, serviço fora do ar) e é tratado na origem, com resposta, retentativa ou fallback. De programação é bug: não há como se recuperar com segurança, então registra-se e reinicia-se.",
      },
    ],
  },
  en: {
    titulo: "Uncaught exceptions",
    pergunta: "How do you handle uncaught exceptions and unhandled rejections?",
    porqueEsteMetodo:
      "The answer that sounds odd (“bring the process down”) only convinces once you understand each why: what Node does by default, why carrying on is dangerous, who restarts and where the real fix lives. The chain of whys leads to that conclusion.",
    resposta30s:
      "`uncaughtException` and `unhandledRejection` are the **last resort**: when they fire, the program is in an **unknown state**, so the safe move is to **log the error, shut down with a short deadline and let a supervisor** (PM2, Kubernetes, systemd) **restart it**. The real fix is to handle the error **at its source** (`try/catch` with `await`, `.catch()`, an `error` listener) so it never reaches the top.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does Node bring the process down by default when nobody handles an error?",
            resposta:
              "Because an error that reached the top of the stack with no owner is a **bug the program did not foresee**. An uncaught exception prints the stack and exits with a non-zero code. An unhandled rejection, in current versions, is promoted to an uncaught exception (older versions only warned). Failing loudly beats carrying on blind; check `--unhandled-rejections` on nodejs.org for your version.",
          },
          {
            pergunta: "Why is logging the error in `uncaughtException` and moving on not enough?",
            resposta:
              "Because the `throw` interrupted the code midway: a half-finished write, a lock that was never released, an open transaction, a counter or in-memory cache left inconsistent, a listener that was not removed. You do not know what was left crooked, and the damage may show up later, in another request, as wrong data **with no noise**. The Node documentation says it is not safe to resume normal operation after this event.",
          },
          {
            pergunta: "Why does restarting fix it?",
            resposta:
              "Because it returns the application to a **known state** within seconds, and the cost is small when several instances sit behind a load balancer. The one who restarts is a **supervisor** (PM2, systemd, Docker’s restart policy, Kubernetes), with growing waits between attempts so it does not fall into a crash loop. Alert on the restart count: it is the sign that a bug exists.",
          },
          {
            pergunta: "Then why do global handlers exist?",
            resposta:
              "To **die well**: log the error with stack and context, send it to the error tracker, attempt a graceful shutdown with a **short deadline** (see L115) and exit with code `1`. To only observe without changing the behavior, there is `uncaughtExceptionMonitor`. What you must not do is use the handler to “keep it running”.",
          },
          {
            pergunta: "Why does the real fix live at the source?",
            resposta:
              "Because almost every error that reaches the top is a handler that was missing: a promise with no `await` or `.catch()`, `async` inside `forEach`, a stream or `EventEmitter` with no `error` listener, an asynchronous callback outside the `try/catch`. **Expected** errors (invalid input, timeout, missing resource) become a response or a retry; only **bugs** should bring the process down. Lint rules against floating promises and a central error middleware (see L41) close the loop.",
          },
        ],
        causaRaiz:
          "An error nobody handled leaves the program in an **unknown state**. So the conduct is to **die with information and restart clean**, and the real work is to **handle the error where it is born**, so the global handler is rare.",
      },
      {
        tipo: "codigo",
        titulo: "The global handler as a last resort",
        legenda: "JavaScript",
        codigo: `let exiting = false;

function fatalFailure(error, origin) {
  if (exiting) return;
  exiting = true;
  console.error(JSON.stringify({ level: "fatal", origin, message: error.message, stack: error.stack }));
  setTimeout(() => process.exit(1), 3000).unref(); // short deadline: the state is not trustworthy
  server.close(() => process.exit(1)); // stop accepting and exit when requests finish
}

process.on("uncaughtException", (error, origin) => fatalFailure(error, origin));
process.on("unhandledRejection", (reason) =>
  fatalFailure(reason instanceof Error ? reason : new Error(String(reason)), "unhandledRejection"),
);`,
        nota: "A rejection reason can be any value, not just an `Error`; hence the conversion. The `server` comes from elsewhere in the code.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Do not use the handler to “keep it running”",
        texto:
          "Catching the error and carrying on hides the bug and keeps a possibly corrupted state, which is worse than a crash: the failure becomes silent. Do not rely on long asynchronous work inside the handler either, because the state may keep it from finishing. Tell **operational errors** (expected, handled and answered) apart from **programmer errors** (bugs, which bring the process down).",
      },
    ],
    armadilhas: [
      "Logging the error in `uncaughtException` and moving on: the bug stays hidden and the state inconsistent.",
      "A floating promise (forgetting `await` or `.catch()`) and `async` inside `forEach`: the rejection escapes the `try/catch` and becomes unhandled.",
      "An `EventEmitter` or stream with no `error` listener: an `error` event with no listener becomes an uncaught exception (see T61).",
      "Exiting without making sure the log was written, or restarting without a supervisor: the error vanishes or the application stays down.",
    ],
    autoteste: [
      {
        pergunta: "Why is restarting the process recommended after an `uncaughtException`?",
        resposta:
          "Because the code was interrupted midway and the state (memory, locks, transactions) is unknown. Carrying on may silently produce wrong results; restarting returns a known state.",
      },
      {
        pergunta:
          "What is the difference between an operational error and a programmer error, and how is each handled?",
        resposta:
          "An operational error is expected (invalid input, timeout, a service being down) and is handled at the source, with a response, a retry or a fallback. A programmer error is a bug: there is no safe way to recover, so you log it and restart.",
      },
    ],
  },
};
