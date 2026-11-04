import type { Pergunta } from "../../tipos";

// R46 · Lock otimista vs pessimista
export const r46: Pergunta = {
  numero: 146,
  modulo: "roadmap-avancado",
  metodo: "compare",
  pt: {
    titulo: "Lock otimista vs pessimista",
    pergunta: "Explique a diferença entre lock otimista e pessimista e quando usar cada um.",
    porqueEsteMetodo:
      "É uma comparação direta entre duas estratégias de concorrência. A matriz mostra a premissa, o mecanismo e o custo de cada uma, e uma regra diz quando escolher.",
    resposta30s:
      "**Otimista**: assume que conflitos são raros, deixa todos lerem e, ao gravar, **confere se a versão mudou** (se mudou, falha e tenta de novo). **Pessimista**: assume que conflitos são comuns e **trava o registro** (`SELECT … FOR UPDATE`) até o commit. Use otimista quando há **muita leitura e pouca disputa**; pessimista quando há **muita disputa** ou o conflito é caro demais para retentar.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["", "Otimista", "Pessimista"],
        linhas: [
          ["Premissa", "Conflitos são raros", "Conflitos são comuns"],
          [
            "Como",
            "Lê com uma **versão**; ao gravar, verifica se a versão mudou (`WHERE id=? AND versao=?`); se mudou, falha e tenta de novo",
            "Trava o registro antes de alterar (`SELECT … FOR UPDATE`) e segura até o commit",
          ],
          ["Concorrência", "Alta: ninguém espera", "Baixa: os outros esperam"],
          ["Custo", "Um conflito vira retrabalho ou retentativa", "Esperas, risco de deadlock, locks longos"],
          [
            "Bom para",
            "Muita leitura e poucas escritas concorrentes (cadastros, edição de formulário)",
            "Muita disputa pelo mesmo dado, operações críticas (saldo, estoque, reserva)",
          ],
        ],
      },
      {
        tipo: "codigo",
        legenda: "sql",
        codigo:
          "-- Otimista: so grava se ninguem mudou antes\nUPDATE produtos SET preco = 99, versao = versao + 1\n WHERE id = 7 AND versao = 3;      -- 0 linhas afetadas = conflito: recarregue e tente de novo\n\n-- Pessimista: trava a linha ate o commit\nBEGIN;\nSELECT saldo FROM contas WHERE id = 1 FOR UPDATE;\nUPDATE contas SET saldo = saldo - 100 WHERE id = 1;\nCOMMIT;",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra",
        texto:
          "Comece com o **otimista** (escala melhor) e use o **pessimista** onde a disputa é frequente ou retentar é caro. Um update atômico (`saldo = saldo - 100`) muitas vezes dispensa os dois. Veja também a Q09 sobre deadlocks.",
      },
    ],
    armadilhas: [
      "Otimista sem tratar o conflito: a última escrita sobrescreve a anterior.",
      "Pessimista com transações longas: esperas e deadlocks.",
      "Segurar o lock enquanto espera o usuário.",
      "Lock pessimista sem timeout.",
    ],
    autoteste: [
      {
        pergunta: "Como o lock otimista detecta conflito?",
        resposta:
          "Comparando a versão (ou timestamp) lida com a atual no momento da gravação; se mudou, recusa e o cliente repete.",
      },
      {
        pergunta: "Quando preferir o lock pessimista?",
        resposta:
          "Quando há muita disputa pelo mesmo registro ou quando retentar é caro ou inaceitável (saldos, reservas).",
      },
    ],
  },
  en: {
    titulo: "Optimistic vs pessimistic locking",
    pergunta: "Explain the difference between optimistic and pessimistic locking and when to use each.",
    porqueEsteMetodo:
      "It is a direct comparison of two concurrency strategies. The matrix shows each one’s premise, mechanism and cost, and a rule says when to choose.",
    resposta30s:
      "**Optimistic**: assumes conflicts are rare, lets everyone read and, on write, **checks whether the version changed** (if so, it fails and retries). **Pessimistic**: assumes conflicts are common and **locks the record** (`SELECT … FOR UPDATE`) until commit. Use optimistic for **heavy reads with little contention**; pessimistic when there is **heavy contention** or the conflict is too costly to retry.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["", "Optimistic", "Pessimistic"],
        linhas: [
          ["Premise", "Conflicts are rare", "Conflicts are common"],
          [
            "How",
            "Reads with a **version**; on write, checks whether the version changed (`WHERE id=? AND version=?`); if so, fails and retries",
            "Locks the record before changing it (`SELECT … FOR UPDATE`) and holds until commit",
          ],
          ["Concurrency", "High: nobody waits", "Low: others wait"],
          ["Cost", "A conflict becomes rework or a retry", "Waits, deadlock risk, long locks"],
          [
            "Good for",
            "Heavy reads and few concurrent writes (records, form editing)",
            "Heavy contention on the same data, critical operations (balance, stock, reservation)",
          ],
        ],
      },
      {
        tipo: "codigo",
        legenda: "sql",
        codigo:
          "-- Optimistic: only writes if nobody changed it before\nUPDATE products SET price = 99, version = version + 1\n WHERE id = 7 AND version = 3;     -- 0 rows affected = conflict: reload and retry\n\n-- Pessimistic: lock the row until commit\nBEGIN;\nSELECT balance FROM accounts WHERE id = 1 FOR UPDATE;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nCOMMIT;",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule",
        texto:
          "Start with **optimistic** (scales better) and use **pessimistic** where contention is frequent or retrying is expensive. An atomic update (`balance = balance - 100`) often removes the need for either. See also Q09 on deadlocks.",
      },
    ],
    armadilhas: [
      "Optimistic without handling the conflict: the last write overwrites the previous one.",
      "Pessimistic with long transactions: waits and deadlocks.",
      "Holding the lock while waiting for the user.",
      "A pessimistic lock without a timeout.",
    ],
    autoteste: [
      {
        pergunta: "How does optimistic locking detect a conflict?",
        resposta:
          "By comparing the version (or timestamp) read with the current one at write time; if it changed, it refuses and the client retries.",
      },
      {
        pergunta: "When prefer pessimistic locking?",
        resposta:
          "When there is heavy contention on the same record or when retrying is costly or unacceptable (balances, reservations).",
      },
    ],
  },
};
