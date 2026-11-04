import type { Pergunta } from "../../tipos";

// P82 · Circuit breaker e bulkheads
export const p082: Pergunta = {
  numero: 782,
  modulo: "pawanmkr-resiliencia",
  metodo: "trace",
  pt: {
    titulo: "Circuit breaker e bulkheads",
    pergunta: "O que é o padrão circuit breaker e como ele é implementado no Node.js?",
    porqueEsteMetodo:
      "O padrão só faz sentido quando você segue uma dependência que degrada: o que acontece com as chamadas, com os recursos e com a latência em cada estado. Acompanhar o caminho em que algo dá errado mostra por que existem os estados e o que o bulkhead acrescenta.",
    resposta30s:
      "O **circuit breaker** (disjuntor) envolve a chamada a uma dependência e, quando ela passa a falhar ou ficar lenta, **para de chamá-la**: com o circuito **fechado** as chamadas passam e as falhas são contadas; ao passar de um limiar ele **abre** e rejeita na hora (ou usa um fallback); depois de uma espera fica **meio-aberto** e deixa passar poucas chamadas de teste, **fechando** se derem certo e reabrindo se falharem. No Node.js usa-se uma biblioteca como o `opossum` ou uma pequena máquina de estados. Os **bulkheads** completam o quadro: isolam recursos por dependência para que uma lenta não derrube o resto.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma dependência que degrada, passo a passo",
        etapas: [
          "**Fechado**: as chamadas ao serviço de pagamento passam, e o disjuntor conta falhas e timeouts numa janela de tempo",
          "O serviço degrada: as chamadas passam a falhar ou a demorar até o timeout, e cada uma segura memória, um socket e uma vaga de concorrência enquanto espera",
          "O limiar é ultrapassado (por exemplo, falhas demais na janela) e o circuito **abre**",
          "**Aberto**: as chamadas são rejeitadas na hora, sem tocar na rede, e o código devolve um fallback (cache, valor padrão, “tente mais tarde”); o serviço doente ganha folga para se recuperar",
          "Passa o tempo de espera: o circuito fica **meio-aberto** e deixa passar uma ou poucas chamadas de teste",
          "Teste bem-sucedido: o circuito **fecha** e o tráfego volta. Teste que falha: o circuito **reabre** e a espera recomeça",
        ],
        nota: "O objetivo é duplo: quem chama deixa de acumular chamadas penduradas (falha rápida), e o serviço doente deixa de receber a carga que o impede de se recuperar.",
      },
      {
        tipo: "tabela",
        titulo: "Os parâmetros e o que cada um decide",
        colunas: ["Parâmetro", "O que decide", "Se for mal ajustado"],
        linhas: [
          [
            "Limiar de falhas (contagem ou percentual)",
            "Quando o circuito abre",
            "Muito baixo: abre por ruído. Muito alto: demora a proteger",
          ],
          [
            "Janela de medição e volume mínimo",
            "Qual período e quantas chamadas entram na conta",
            "Janela curta com pouco tráfego dá um percentual instável",
          ],
          [
            "Timeout da chamada",
            "Quanto uma tentativa pode demorar; lentidão conta como falha",
            "Sem timeout, a chamada pendurada nunca vira falha e o disjuntor não a enxerga",
          ],
          [
            "Tempo de espera com o circuito aberto",
            "Quanto tempo rejeita antes de testar de novo",
            "Longo: demora a recuperar. Curto: martela o serviço ainda doente",
          ],
          [
            "Chamadas de teste no meio-aberto",
            "Quantas passam para provar a recuperação",
            "Muitas: sobrecarregam um serviço frágil. Uma só pode ser sorte ou azar",
          ],
          [
            "Fallback",
            "O que devolver no lugar (cache, valor padrão, erro claro, fila)",
            "Um fallback que depende do mesmo serviço não protege nada",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Uma máquina de estados mínima",
        legenda: "JavaScript",
        codigo: `function criarDisjuntor(chamada, { limite = 5, esperaMs = 10_000 } = {}) {
  let estado = "fechado", falhas = 0, abertoEm = 0;
  return async (...args) => {
    if (estado === "aberto") {
      if (Date.now() - abertoEm < esperaMs) throw new Error("circuito aberto");
      estado = "meio-aberto"; // a espera acabou: esta chamada é o teste
    }
    try {
      const resposta = await chamada(...args);
      estado = "fechado"; falhas = 0;
      return resposta;
    } catch (erro) {
      falhas += 1;
      if (estado === "meio-aberto" || falhas >= limite) {
        estado = "aberto"; abertoEm = Date.now();
      }
      throw erro;
    }
  };
}`,
        nota: "Didático: conta falhas seguidas e deixa passar todas as chamadas no meio-aberto. Uma biblioteca madura traz janela deslizante com percentual de erro e volume mínimo, uma única chamada de teste, timeout por chamada, fallback e eventos para métricas. Em produção, use uma como o `opossum` (confira a documentação e a manutenção atuais) e envolva cada chamada externa com ela.",
      },
      {
        tipo: "passos",
        titulo: "Bulkheads: a mesma rota, com a dependência isolada",
        passos: [
          {
            titulo: "1. Sem bulkhead",
            texto:
              "A rota `/pedidos` chama pagamento e estoque pelo mesmo cliente HTTP e sob o mesmo limite de concorrência. O pagamento fica lento, as chamadas penduradas ocupam todos os sockets e vagas, e as chamadas ao estoque, que está saudável, passam a esperar na fila. Uma dependência lenta derrubou a rota inteira.",
          },
          {
            titulo: "2. Um compartimento por dependência",
            texto:
              "Cada dependência ganha recursos próprios: um cliente HTTP com limite de conexões separado (por exemplo, um `http.Agent` com `maxSockets`), um pool de conexões do banco por serviço, um limitador de concorrência (semáforo ou fila com `concurrency`; veja T55) e, para trabalho pesado, workers ou processos separados.",
          },
          {
            titulo: "3. Quando o compartimento enche",
            texto:
              "O pagamento lento esgota apenas o limite dele. As chamadas excedentes são rejeitadas na hora ou esperam numa fila de tamanho limitado (nunca infinita), e quem chamou responde com um fallback ou com um erro rápido.",
          },
          {
            titulo: "4. O resto segue funcionando",
            texto:
              "O estoque mantém os recursos dele e responde normalmente. A falha ficou contida no compartimento, como nos compartimentos estanques de um navio, que dão nome ao padrão. Meça a saturação de cada compartimento (em uso, na fila, rejeitadas) para dimensionar e alertar.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Cada padrão responde a uma pergunta",
        texto:
          "O **timeout** limita quanto cada chamada pode segurar um recurso (veja P85). A **retentativa** com backoff trata a falha passageira (veja P84 e L105). O **circuit breaker** para de insistir quando a falha persiste. O **bulkhead** limita o estrago quando a dependência está lenta, mesmo antes de o limiar do disjuntor ser atingido. Use-os juntos: sem timeout, o disjuntor não enxerga a chamada pendurada.",
      },
    ],
    armadilhas: [
      "Não ter timeout: a chamada pendurada nunca termina, então nunca vira falha, o disjuntor não a conta e ela segura recursos indefinidamente.",
      "Contar toda falha igual: erros 4xx causados pelo cliente (validação, não autorizado) não indicam serviço doente e não devem abrir o circuito. Contam timeouts, falhas de conexão e erros 5xx.",
      "Retentativa que ignora o circuito aberto: o erro “circuito aberto” não deve ser retentado, ou as retentativas voltam a martelar o serviço que o disjuntor quer poupar.",
      "Esperar estado compartilhado: o disjuntor em memória é por processo, então cada instância do Node.js aprende sozinha. É normal e aceitável, mas não conte com uma visão global.",
    ],
    autoteste: [
      {
        pergunta: "Em que estado o disjuntor deixa passar algumas chamadas, e o que acontece depois?",
        resposta:
          "No estado meio-aberto, depois do tempo de espera. Se as chamadas de teste dão certo, o circuito fecha e o tráfego normal volta; se falham, ele reabre e a espera recomeça.",
      },
      {
        pergunta: "O que o bulkhead resolve que o circuit breaker sozinho não resolve?",
        resposta:
          "O disjuntor reage a falhas depois de contá-las; o bulkhead limita desde o início quanto de socket, conexão e concorrência cada dependência pode consumir. Assim, uma dependência apenas lenta, que ainda não ultrapassou o limiar, não esgota os recursos compartilhados.",
      },
    ],
  },
  en: {
    titulo: "Circuit breaker and bulkheads",
    pergunta: "What is a circuit breaker pattern and how is it implemented in Node.js?",
    porqueEsteMetodo:
      "The pattern only makes sense when you follow a dependency that degrades: what happens to the calls, the resources and the latency in each state. Tracing the path where something goes wrong shows why the states exist and what the bulkhead adds.",
    resposta30s:
      "A **circuit breaker** wraps the call to a dependency and, when it starts failing or getting slow, **stops calling it**: with the circuit **closed** calls go through and failures are counted; past a threshold it **opens** and rejects immediately (or uses a fallback); after a wait it goes **half-open** and lets a few test calls through, **closing** if they succeed and reopening if they fail. In Node.js you use a library such as `opossum` or a small state machine. **Bulkheads** complete the picture: they isolate resources per dependency so a slow one does not take down the rest.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A degrading dependency, step by step",
        etapas: [
          "**Closed**: calls to the payment service go through, and the breaker counts failures and timeouts in a time window",
          "The service degrades: calls start failing or taking until the timeout, and each one holds memory, a socket and a concurrency slot while it waits",
          "The threshold is crossed (for example, too many failures in the window) and the circuit **opens**",
          "**Open**: calls are rejected immediately, without touching the network, and the code returns a fallback (cache, default value, “try again later”); the sick service gets room to recover",
          "The wait time passes: the circuit goes **half-open** and lets one or a few test calls through",
          "A successful test: the circuit **closes** and traffic returns. A failed test: the circuit **reopens** and the wait starts over",
        ],
        nota: "The goal is twofold: the caller stops piling up hanging calls (fail fast), and the sick service stops receiving the load that keeps it from recovering.",
      },
      {
        tipo: "tabela",
        titulo: "The parameters and what each one decides",
        colunas: ["Parameter", "What it decides", "If poorly tuned"],
        linhas: [
          [
            "Failure threshold (count or percentage)",
            "When the circuit opens",
            "Too low: it opens on noise. Too high: it is slow to protect",
          ],
          [
            "Measurement window and minimum volume",
            "Which period and how many calls count",
            "A short window with little traffic gives an unstable percentage",
          ],
          [
            "Call timeout",
            "How long an attempt may take; slowness counts as failure",
            "Without a timeout, the hanging call never becomes a failure and the breaker never sees it",
          ],
          [
            "Wait time while open",
            "How long it rejects before testing again",
            "Long: slow to recover. Short: hammers a service that is still sick",
          ],
          [
            "Test calls in half-open",
            "How many pass to prove recovery",
            "Many: overload a fragile service. Just one may be luck or bad luck",
          ],
          [
            "Fallback",
            "What to return instead (cache, default value, clear error, queue)",
            "A fallback that depends on the same service protects nothing",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A minimal state machine",
        legenda: "JavaScript",
        codigo: `function createBreaker(call, { threshold = 5, waitMs = 10_000 } = {}) {
  let state = "closed", failures = 0, openedAt = 0;
  return async (...args) => {
    if (state === "open") {
      if (Date.now() - openedAt < waitMs) throw new Error("circuit open");
      state = "half-open"; // the wait is over: this call is the test
    }
    try {
      const response = await call(...args);
      state = "closed"; failures = 0;
      return response;
    } catch (error) {
      failures += 1;
      if (state === "half-open" || failures >= threshold) {
        state = "open"; openedAt = Date.now();
      }
      throw error;
    }
  };
}`,
        nota: "Teaching version: it counts consecutive failures and lets every call through in half-open. A mature library brings a sliding window with an error percentage and a minimum volume, a single test call, a per-call timeout, a fallback and events for metrics. In production, use one such as `opossum` (check its current documentation and maintenance) and wrap every external call with it.",
      },
      {
        tipo: "passos",
        titulo: "Bulkheads: the same route, with the dependency isolated",
        passos: [
          {
            titulo: "1. Without a bulkhead",
            texto:
              "The `/orders` route calls payment and inventory through the same HTTP client and under the same concurrency limit. Payment gets slow, the hanging calls occupy every socket and slot, and calls to inventory, which is healthy, start waiting in line. One slow dependency took down the whole route.",
          },
          {
            titulo: "2. One compartment per dependency",
            texto:
              "Each dependency gets its own resources: an HTTP client with a separate connection limit (for example, an `http.Agent` with `maxSockets`), a database connection pool per service, a concurrency limiter (a semaphore or a queue with `concurrency`; see T55) and, for heavy work, separate workers or processes.",
          },
          {
            titulo: "3. When the compartment fills up",
            texto:
              "The slow payment exhausts only its own limit. Excess calls are rejected immediately or wait in a queue of limited size (never infinite), and the caller answers with a fallback or a fast error.",
          },
          {
            titulo: "4. The rest keeps working",
            texto:
              "Inventory keeps its resources and answers normally. The failure stayed inside the compartment, like the watertight compartments of a ship that give the pattern its name. Measure the saturation of each compartment (in use, queued, rejected) to size it and to alert.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Each pattern answers one question",
        texto:
          "The **timeout** limits how long each call can hold a resource (see P85). The **retry** with backoff handles the transient failure (see P84 and L105). The **circuit breaker** stops insisting when the failure persists. The **bulkhead** limits the damage when the dependency is slow, even before the breaker’s threshold is reached. Use them together: without a timeout, the breaker cannot see the hanging call.",
      },
    ],
    armadilhas: [
      "Having no timeout: the hanging call never ends, so it never becomes a failure, the breaker does not count it and it holds resources indefinitely.",
      "Counting every failure the same: 4xx errors caused by the client (validation, unauthorized) do not mean a sick service and should not open the circuit. Timeouts, connection failures and 5xx errors count.",
      "A retry that ignores the open circuit: the “circuit open” error should not be retried, or the retries hammer again the service the breaker wants to spare.",
      "Expecting shared state: an in-memory breaker is per process, so each Node.js instance learns on its own. That is normal and acceptable, but do not count on a global view.",
    ],
    autoteste: [
      {
        pergunta: "In which state does the breaker let a few calls through, and what happens next?",
        resposta:
          "In the half-open state, after the wait time. If the test calls succeed, the circuit closes and normal traffic returns; if they fail, it reopens and the wait starts over.",
      },
      {
        pergunta: "What does a bulkhead solve that a circuit breaker alone does not?",
        resposta:
          "The breaker reacts to failures after counting them; the bulkhead limits from the start how many sockets, connections and how much concurrency each dependency may consume. So a dependency that is merely slow, and has not crossed the threshold yet, does not exhaust the shared resources.",
      },
    ],
  },
};
