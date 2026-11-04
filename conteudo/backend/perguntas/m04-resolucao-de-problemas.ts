import type { Pergunta } from "../../tipos";

// M04 · Resolução de problemas
export const m04: Pergunta = {
  numero: 204,
  modulo: "mentorcruise",
  metodo: "playbook",
  pt: {
    titulo: "Resolução de problemas",
    pergunta: "Como você aborda a resolução de problemas em cenários de programação complexos?",
    porqueEsteMetodo:
      "O entrevistador quer ver um processo repetível, não um golpe de intuição. Um playbook mostra a ordem dos passos, o sinal de que cada um terminou e o que dizer em voz alta.",
    resposta30s:
      "Primeiro **reproduzir** o problema e **reduzi-lo ao menor caso** que ainda falha. Depois levantar **hipóteses**, ordená-las, **bissecionar** para estreitar a busca e **instrumentar** (logs, depurador, métricas) para observar em vez de adivinhar. Corrigir o **menor possível**, provar com um **teste** que falha antes e passa depois, e **documentar** a causa. Se travar, pedir ajuda depois de um limite de tempo, levando o que já foi descartado.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Entenda e reproduza",
            texto:
              "Descreva o esperado e o observado. Reproduza de forma confiável: se for intermitente, procure o que muda entre as execuções (dados, horário, concorrência, ambiente). Sinal: você consegue provocar o erro quando quiser. Sem reprodução, qualquer correção é um palpite.",
          },
          {
            titulo: "Reduza ao mínimo",
            texto:
              "Corte entrada, configuração e código até sobrar o menor caso que ainda falha. Menos código é menos suspeitos, e o caso mínimo vira o teste de regressão e o exemplo que você mostra a quem for ajudar.",
          },
          {
            titulo: "Levante hipóteses e ordene",
            texto:
              "Liste as causas possíveis e ordene por probabilidade e por custo de testar: comece pelo que é provável e barato. Escreva o que você espera ver se cada hipótese for verdadeira.",
          },
          {
            titulo: "Bissecione",
            texto:
              "Divida o espaço de busca ao meio, repetidamente: commits (`git bisect`), trechos do código, etapas de um pipeline, entradas. Em cada divisão você descobre de que lado está o problema, e o número de passos cresce devagar (logaritmo) com o tamanho da busca.",
          },
          {
            titulo: "Instrumente e mude uma coisa por vez",
            texto:
              "Use depurador, logs com identificador da requisição, métricas e traces para ver o que acontece de verdade. Altere uma variável por experimento; se mudar três coisas e o erro sumir, você não sabe por quê (e ele pode voltar).",
          },
          {
            titulo: "Corrija o menor possível e prove",
            texto:
              "Ataque a causa, não o sintoma (um `try/catch` que engole o erro ou um `sleep` não são correções). Escreva um teste que falha antes da correção e passa depois, e rode a suíte inteira para ver se nada mais quebrou.",
          },
          {
            titulo: "Documente e previna",
            texto:
              "Registre a causa raiz, o sintoma e a correção no commit ou no relatório do incidente. Pergunte o que teria pego isso antes: um teste, um alerta, uma restrição no banco, uma revisão de código.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Exemplo genérico (ilustrativo): pedidos duplicados",
        etapas: [
          "Sintoma: de vez em quando um pedido aparece duplicado, quase sempre em horário de pico",
          "Reproduzir: um teste dispara duas requisições idênticas ao mesmo tempo, e o pedido duplica",
          "Hipóteses: a checagem “já existe?” e a inserção não são atômicas (condição de corrida); ou o cliente repete a requisição por timeout",
          "Instrumentar: registrar o identificador da requisição e o instante da checagem e da inserção; as duas requisições passam pela checagem antes de qualquer inserção",
          "Corrigir o mínimo: `UNIQUE` sobre uma chave de idempotência e tratamento do conflito, sem reescrever o fluxo",
          "Provar e registrar: o teste de concorrência falha antes e passa depois, e entra na suíte; a causa vai para o commit",
        ],
        nota: "Exemplo construído para ilustrar o método, não relato de um caso real.",
      },
      {
        tipo: "tabela",
        titulo: "Na entrevista: narre o raciocínio",
        colunas: ["Momento", "O que fazer", "Frase de exemplo"],
        linhas: [
          [
            "Esclarecer",
            "Repetir o problema com as suas palavras e perguntar sobre limites, entradas inválidas e tamanho dos dados",
            "“Posso confirmar o que acontece com entrada vazia e qual o tamanho máximo esperado?”",
          ],
          [
            "Propor o simples",
            "Dizer uma solução direta primeiro, mesmo que lenta, e a sua complexidade",
            "“A versão mais simples compara todos os pares; funciona, mas cresce com o quadrado.”",
          ],
          [
            "Melhorar",
            "Apontar o gargalo e trocar uma peça (estrutura de dados, índice, cache), dizendo o que se perde",
            "“Um mapa troca memória por tempo; vale se os dados cabem na memória.”",
          ],
          [
            "Verificar",
            "Percorrer um exemplo e os casos de borda antes de declarar pronto",
            "“Vou testar com lista vazia, um elemento e valores repetidos.”",
          ],
          [
            "Quando travar",
            "Dizer onde está preso e o que já descartou, em vez de ficar em silêncio",
            "“Descartei X porque…; estou entre Y e Z. Posso pensar em voz alta?”",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Peça ajuda com limite de tempo",
        texto:
          "Combine um limite antes de começar (por exemplo, meia hora sem avanço) e, ao chegar nele, peça ajuda levando o essencial: o que você esperava, o que aconteceu, o que já descartou e o caso mínimo. Explicar o problema em voz alta, até para um colega que nem responde, costuma revelar a resposta. Pedir cedo demais desperdiça o tempo de outra pessoa, e pedir tarde demais desperdiça o seu.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Sem experiência para citar?",
        texto:
          "Não invente um caso. Descreva o processo que você seguiria e use um exemplo hipotético assumido como tal. Se tiver um caso real, conte-o na ordem do playbook: sintoma, reprodução, hipóteses, causa, correção, prevenção.",
      },
    ],
    armadilhas: [
      "Mudar várias coisas ao mesmo tempo: se o erro some, você não sabe qual mudança o resolveu.",
      "Corrigir o sintoma e não a causa (engolir a exceção, repetir em laço, adicionar uma pausa).",
      "Ficar em silêncio na entrevista: o entrevistador avalia o raciocínio, e ele não vê o que não é dito.",
      "Pular a reprodução: sem ela você não prova que corrigiu, e o erro volta em produção.",
    ],
    autoteste: [
      {
        pergunta: "Por que reduzir o problema ao mínimo antes de investigar?",
        resposta:
          "Porque menos código significa menos suspeitos. O caso mínimo isola a causa, vira o teste de regressão e é o que você mostra a quem for ajudar.",
      },
      {
        pergunta: "O que é bissecção ao depurar?",
        resposta:
          "Dividir o espaço de busca ao meio, repetidamente (commits com `git bisect`, trechos de código, etapas de um pipeline), até achar onde o comportamento muda. O número de passos cresce com o logaritmo do tamanho da busca.",
      },
      {
        pergunta: "Quando e como pedir ajuda?",
        resposta:
          "Quando passar o limite de tempo combinado sem progresso, levando o esperado, o observado, o que já foi descartado e o caso mínimo.",
      },
    ],
  },
  en: {
    titulo: "Problem-solving approach",
    pergunta: "How do you approach problem-solving in complex coding scenarios?",
    porqueEsteMetodo:
      "The interviewer wants to see a repeatable process, not a flash of intuition. A playbook shows the order of the steps, the sign that each one is done and what to say out loud.",
    resposta30s:
      "First **reproduce** the problem and **reduce it to the smallest case** that still fails. Then form **hypotheses**, rank them, **bisect** to narrow the search and **instrument** (logs, debugger, metrics) to observe instead of guessing. Make the **smallest fix**, prove it with a **test** that fails before and passes after, and **document** the cause. If stuck, ask for help after a time limit, bringing what you have already ruled out.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Understand and reproduce",
            texto:
              "Describe the expected and the observed behavior. Reproduce it reliably: if it is intermittent, look for what changes between runs (data, time, concurrency, environment). Sign: you can trigger the error whenever you want. Without a reproduction, any fix is a guess.",
          },
          {
            titulo: "Reduce to the minimum",
            texto:
              "Cut input, configuration and code until you have the smallest case that still fails. Less code means fewer suspects, and the minimal case becomes the regression test and the example you show whoever helps.",
          },
          {
            titulo: "Form hypotheses and rank them",
            texto:
              "List the possible causes and rank them by likelihood and by cost to test: start with what is probable and cheap. Write down what you expect to see if each hypothesis is true.",
          },
          {
            titulo: "Bisect",
            texto:
              "Split the search space in half, repeatedly: commits (`git bisect`), pieces of code, pipeline stages, inputs. Each split tells you which side holds the problem, and the number of steps grows slowly (logarithmically) with the size of the search.",
          },
          {
            titulo: "Instrument and change one thing at a time",
            texto:
              "Use the debugger, logs with a request identifier, metrics and traces to see what really happens. Change one variable per experiment; if you change three things and the error disappears, you do not know why (and it may come back).",
          },
          {
            titulo: "Make the smallest fix and prove it",
            texto:
              "Attack the cause, not the symptom (a `try/catch` that swallows the error or a `sleep` is not a fix). Write a test that fails before the fix and passes after, and run the whole suite to see that nothing else broke.",
          },
          {
            titulo: "Document and prevent",
            texto:
              "Record the root cause, the symptom and the fix in the commit or the incident report. Ask what would have caught it earlier: a test, an alert, a database constraint, a code review.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Generic (illustrative) example: duplicated orders",
        etapas: [
          "Symptom: now and then an order shows up duplicated, almost always at peak hours",
          "Reproduce: a test fires two identical requests at the same time, and the order is duplicated",
          "Hypotheses: the “already exists?” check and the insert are not atomic (race condition); or the client retries the request after a timeout",
          "Instrument: log the request identifier and the instant of the check and of the insert; both requests pass the check before either insert",
          "Smallest fix: `UNIQUE` on an idempotency key and handling of the conflict, without rewriting the flow",
          "Prove and record: the concurrency test fails before and passes after, and joins the suite; the cause goes into the commit",
        ],
        nota: "An example built to illustrate the method, not an account of a real case.",
      },
      {
        tipo: "tabela",
        titulo: "In the interview: narrate your reasoning",
        colunas: ["Moment", "What to do", "Example phrase"],
        linhas: [
          [
            "Clarify",
            "Restate the problem in your own words and ask about limits, invalid inputs and data size",
            "“Can I confirm what happens with empty input and the maximum expected size?”",
          ],
          [
            "Propose the simple one",
            "State a direct solution first, even a slow one, and its complexity",
            "“The simplest version compares all pairs; it works, but it grows with the square.”",
          ],
          [
            "Improve",
            "Point at the bottleneck and swap one piece (data structure, index, cache), saying what you give up",
            "“A map trades memory for time; it is worth it if the data fits in memory.”",
          ],
          [
            "Verify",
            "Walk through an example and the edge cases before calling it done",
            "“I will test with an empty list, one element and repeated values.”",
          ],
          [
            "When stuck",
            "Say where you are stuck and what you have ruled out, instead of going silent",
            "“I ruled out X because…; I am between Y and Z. May I think out loud?”",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Ask for help with a time limit",
        texto:
          "Agree on a limit before you start (for example, half an hour without progress) and, when you reach it, ask for help bringing the essentials: what you expected, what happened, what you have ruled out and the minimal case. Explaining the problem out loud, even to a colleague who does not answer, often reveals the solution. Asking too early wastes someone else’s time, and asking too late wastes yours.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "No experience to cite?",
        texto:
          "Do not invent a case. Describe the process you would follow and use a hypothetical example, labeled as such. If you do have a real case, tell it in the playbook’s order: symptom, reproduction, hypotheses, cause, fix, prevention.",
      },
    ],
    armadilhas: [
      "Changing several things at once: if the error disappears, you do not know which change solved it.",
      "Fixing the symptom instead of the cause (swallowing the exception, retrying in a loop, adding a pause).",
      "Staying silent in the interview: the interviewer evaluates the reasoning, and cannot see what is not said.",
      "Skipping the reproduction: without it you cannot prove you fixed it, and the error returns in production.",
    ],
    autoteste: [
      {
        pergunta: "Why reduce the problem to a minimum before investigating?",
        resposta:
          "Because less code means fewer suspects. The minimal case isolates the cause, becomes the regression test and is what you show whoever helps.",
      },
      {
        pergunta: "What is bisection when debugging?",
        resposta:
          "Splitting the search space in half, repeatedly (commits with `git bisect`, pieces of code, pipeline stages), until you find where the behavior changes. The number of steps grows with the logarithm of the search size.",
      },
      {
        pergunta: "When and how do you ask for help?",
        resposta:
          "When the agreed time limit passes without progress, bringing the expected result, the observed one, what has been ruled out and the minimal case.",
      },
    ],
  },
};
