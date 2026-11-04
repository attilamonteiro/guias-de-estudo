import type { Pergunta } from "../../tipos";

// R49 · Anomalias de dados em larga escala
export const r49: Pergunta = {
  numero: 149,
  modulo: "roadmap-avancado",
  metodo: "threat",
  pt: {
    titulo: "Anomalias de dados em larga escala",
    pergunta: "Discuta técnicas para prevenir e detectar anomalias de dados em sistemas de grande escala.",
    porqueEsteMetodo:
      "Cada tipo de anomalia tem uma causa e uma defesa. O formato anomalia → prevenção/detecção mostra quais controles atuam antes e quais depois do dado entrar.",
    resposta30s:
      "**Previna** rejeitando o dado ruim na entrada (validação, schemas, constraints no banco) e tornando as escritas **idempotentes**; **detecte** o que escapa com **regras de qualidade de dados**, **reconciliação** entre sistemas, **detecção de anomalias** com alertas e **testes de dados** no pipeline; e **recupere** com versionamento, auditoria e backups com recuperação em ponto no tempo.",
    blocos: [
      {
        tipo: "pares",
        rotuloOrigem: "Anomalia",
        rotuloDestino: "Prevenção e detecção",
        pares: [
          {
            origem: "Dado inválido entra no sistema",
            destino:
              "**Validação** na borda e **constraints** no banco (tipos, `NOT NULL`, `CHECK`, `UNIQUE`, chaves estrangeiras); esquemas (JSON Schema, protobuf).",
          },
          {
            origem: "Duplicatas e escritas repetidas",
            destino: "Chaves únicas, **idempotência**, upsert e deduplicação por ID.",
          },
          {
            origem: "Estados inconsistentes entre sistemas",
            destino: "Transações, outbox e saga, e **reconciliação** periódica comparando as fontes.",
          },
          {
            origem: "Valores fora do padrão (outliers, picos)",
            destino:
              "Regras de qualidade e **detecção de anomalias** (limites, desvio padrão, janelas; ML se preciso) com alertas.",
          },
          {
            origem: "Mudança de formato ou significado a montante (schema drift)",
            destino: "Contratos versionados, testes de contrato e monitoramento de esquema, nulos e distribuições.",
          },
          {
            origem: "Dado corrompido ou apagado por engano",
            destino:
              "**Versionamento**, exclusão lógica, auditoria (quem e quando), backups e recuperação em ponto no tempo (PITR).",
          },
          {
            origem: "Anomalias que passam despercebidas",
            destino:
              "Métricas de qualidade (completude, unicidade, validade, atualidade), dashboards e testes de dados no pipeline (Great Expectations, dbt tests).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Prevenir é mais barato",
        texto:
          "Rejeite o dado ruim **na entrada**: detectar e corrigir depois, em larga escala, custa muito mais. Mas a detecção é a rede de segurança para o que escapa.",
      },
    ],
    armadilhas: [
      "Validar só no front-end.",
      "Apagar anomalias sem auditoria (perde-se o rastro).",
      "Sem reconciliação entre sistemas.",
      "Alertas de anomalia sem dono e sem runbook.",
    ],
    autoteste: [
      {
        pergunta: "Cite duas formas de prevenir dados inválidos.",
        resposta: "Validação na entrada e constraints no banco (tipos, NOT NULL, CHECK, UNIQUE, chaves estrangeiras).",
      },
      {
        pergunta: "Para que serve a reconciliação?",
        resposta:
          "Comparar periodicamente as fontes para detectar e corrigir divergências que escaparam das transações.",
      },
    ],
  },
  en: {
    titulo: "Data anomalies at scale",
    pergunta: "Discuss techniques for preventing and detecting data anomalies in large-scale systems.",
    porqueEsteMetodo:
      "Each kind of anomaly has a cause and a defense. The anomaly → prevention/detection format shows which controls act before and which after the data enters.",
    resposta30s:
      "**Prevent** by rejecting bad data at the entry (validation, schemas, database constraints) and making writes **idempotent**; **detect** what slips through with **data-quality rules**, **reconciliation** between systems, **anomaly detection** with alerts and **data tests** in the pipeline; and **recover** with versioning, auditing and backups with point-in-time recovery.",
    blocos: [
      {
        tipo: "pares",
        rotuloOrigem: "Anomaly",
        rotuloDestino: "Prevention and detection",
        pares: [
          {
            origem: "Invalid data enters the system",
            destino:
              "**Validation** at the edge and database **constraints** (types, `NOT NULL`, `CHECK`, `UNIQUE`, foreign keys); schemas (JSON Schema, protobuf).",
          },
          {
            origem: "Duplicates and repeated writes",
            destino: "Unique keys, **idempotency**, upsert and ID-based deduplication.",
          },
          {
            origem: "Inconsistent states across systems",
            destino: "Transactions, outbox and saga, and periodic **reconciliation** comparing the sources.",
          },
          {
            origem: "Out-of-pattern values (outliers, spikes)",
            destino:
              "Quality rules and **anomaly detection** (thresholds, standard deviation, windows; ML if needed) with alerts.",
          },
          {
            origem: "Upstream format or meaning change (schema drift)",
            destino: "Versioned contracts, contract tests and monitoring of schema, nulls and distributions.",
          },
          {
            origem: "Data corrupted or deleted by mistake",
            destino: "**Versioning**, soft delete, auditing (who and when), backups and point-in-time recovery (PITR).",
          },
          {
            origem: "Anomalies that go unnoticed",
            destino:
              "Quality metrics (completeness, uniqueness, validity, freshness), dashboards and data tests in the pipeline (Great Expectations, dbt tests).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Prevention is cheaper",
        texto:
          "Reject bad data **at the entry**: detecting and fixing it later, at scale, costs far more. But detection is the safety net for what slips through.",
      },
    ],
    armadilhas: [
      "Validating only in the front end.",
      "Deleting anomalies without auditing (the trail is lost).",
      "No reconciliation between systems.",
      "Anomaly alerts with no owner and no runbook.",
    ],
    autoteste: [
      {
        pergunta: "Name two ways to prevent invalid data.",
        resposta: "Validation at the entry and database constraints (types, NOT NULL, CHECK, UNIQUE, foreign keys).",
      },
      {
        pergunta: "What is reconciliation for?",
        resposta: "Periodically comparing sources to detect and fix divergences that slipped past the transactions.",
      },
    ],
  },
};
