import type { Pergunta } from "../../tipos";

// Q30 · Idempotência em APIs
export const q30: Pergunta = {
  numero: 30,
  modulo: "confiabilidade",
  metodo: "feynman",
  pt: {
    titulo: "Idempotência em APIs",
    pergunta: "Explique o conceito de idempotência em APIs.",
    porqueEsteMetodo:
      "Idempotência é uma propriedade simples de enunciar e fácil de errar. Uma analogia cotidiana (o botão do elevador) dá a intuição; o mecanismo real e o ponto onde a analogia falha (identificar a tentativa) trazem a engenharia.",
    resposta30s:
      "Uma operação é **idempotente** quando executá-la N vezes tem o **mesmo efeito no estado** que executá-la uma vez (a resposta pode variar). Importa porque redes falham de forma ambígua: o cliente dá timeout e não sabe se o servidor processou, então repete, e sem idempotência isso vira cobrança dupla. Garante-se com verbos naturalmente idempotentes (`PUT`, `DELETE`) ou com uma **chave de idempotência** enviada pelo cliente e guardada no servidor.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "O botão do elevador para o andar 5: apertar uma vez ou dez dá o mesmo resultado, o elevador vai ao 5. Já o botão “mais um café” num pedido muda o resultado a cada clique. O primeiro é idempotente; o segundo, não.",
        tecnico:
          "Formalmente, f(f(x)) = f(x). Em APIs: depois de uma ou de várias chamadas iguais, o estado do servidor é o mesmo. O problema real vem do **timeout ambíguo**: o cliente não sabe se o servidor recebeu e processou. Clientes, gateways e filas então **repetem** (entrega ao menos uma vez), e a repetição precisa ser segura. Uma resposta pode mudar (200 na primeira chamada, 409 ou 404 depois) sem quebrar a idempotência, que fala do **efeito**, não da resposta.",
        limite:
          "No elevador, “andar 5” é a própria identidade do pedido. Em sistemas, o servidor não distingue uma repetição de uma intenção nova (comprar dois cafés iguais) a menos que o cliente envie uma **chave de idempotência** que identifique aquela tentativa.",
      },
      {
        tipo: "tabela",
        titulo: "Idempotência dos verbos HTTP",
        colunas: ["Verbo", "Idempotente?", "Por quê"],
        linhas: [
          ["GET / HEAD / OPTIONS", "Sim (e seguros)", "Só leem"],
          ["PUT", "Sim", "Substitui o recurso pelo valor enviado; repetir deixa igual"],
          ["DELETE", "Sim", "Depois de apagar, apagar de novo mantém o estado (a resposta pode mudar de 204 para 404)"],
          ["POST", "Não", "Cada chamada pode criar um novo recurso"],
          ["PATCH", "Depende", '`{"status":"pago"}` é idempotente; `{"saldo":"+10"}` não é'],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Padrão da chave de idempotência (estilo Stripe)",
        legenda: "http + sql",
        codigo:
          "POST /pagamentos\nIdempotency-Key: 7d3f9c2e-...        (UUID gerado pelo CLIENTE, um por intencao)\n\n-- no servidor, na mesma transacao do pagamento:\nINSERT INTO idempotencia (usuario_id, chave, hash_corpo, status)\nVALUES ($1, $2, $3, 'em_andamento')\nON CONFLICT (usuario_id, chave) DO NOTHING;\n\n-- 1 linha inserida  -> primeira vez: processe, grave a resposta, COMMIT\n-- 0 linhas inseridas -> repeticao: devolva a resposta ja guardada\n--                       (corpo diferente com a mesma chave: 422; ainda em andamento: 409)",
      },
      {
        tipo: "passos",
        titulo: "Outras formas de tornar algo idempotente",
        passos: [
          {
            titulo: "Operações naturalmente idempotentes",
            texto: "`SET status = 'pago'` em vez de `saldo = saldo + 10`; `PUT` em vez de `POST`.",
          },
          {
            titulo: "Restrições de unicidade",
            texto: "`UNIQUE (pedido_id, tipo)` faz a segunda inserção falhar com segurança.",
          },
          {
            titulo: "Upsert",
            texto: "`INSERT ... ON CONFLICT DO UPDATE` converte “criar” em “garantir que existe”.",
          },
          {
            titulo: "Deduplicação no consumidor",
            texto: "Guarde os `message_id` já processados e ignore os repetidos.",
          },
          {
            titulo: "Versão / lock otimista",
            texto: "Aplique a alteração só se a versão esperada bater.",
          },
        ],
      },
    ],
    armadilhas: [
      "Gerar a chave no servidor: ela não identifica a repetição, precisa vir do cliente.",
      "Chave sem escopo de usuário ou sem comparar o corpo: a mesma chave com outro pedido deveria falhar.",
      "Não guardar a resposta original e devolver outra na repetição.",
      "Janela de retenção curta demais: a repetição chega depois que a chave expirou.",
      "Condição de corrida entre “consultar” e “inserir”: use `UNIQUE` e `ON CONFLICT`, não um `SELECT` antes.",
    ],
    autoteste: [
      {
        pergunta: "Por que DELETE é idempotente se a segunda chamada devolve 404?",
        resposta:
          "Idempotência é sobre o efeito no estado, não sobre a resposta: depois de uma ou de várias chamadas o recurso está igualmente apagado.",
      },
      {
        pergunta: "Quem deve gerar a chave de idempotência e por quê?",
        resposta:
          "O cliente, um valor único por intenção. Só ele sabe se duas requisições são a mesma tentativa repetida ou duas intenções diferentes.",
      },
    ],
  },
  en: {
    titulo: "Idempotency in APIs",
    pergunta: "Explain the concept of idempotency in APIs.",
    porqueEsteMetodo:
      "Idempotency is easy to state and easy to get wrong. An everyday analogy (the elevator button) gives the intuition; the real mechanism and the point where the analogy fails (identifying the attempt) bring in the engineering.",
    resposta30s:
      "An operation is **idempotent** when running it N times has the **same effect on state** as running it once (the response may vary). It matters because networks fail ambiguously: the client times out without knowing whether the server processed it, so it retries, and without idempotency that becomes a double charge. It is ensured with naturally idempotent verbs (`PUT`, `DELETE`) or an **idempotency key** sent by the client and stored by the server.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "The elevator button for floor 5: pressing it once or ten times gives the same result, the elevator goes to 5. The “one more coffee” button on an order changes the result with every click. The first is idempotent; the second is not.",
        tecnico:
          "Formally, f(f(x)) = f(x). In APIs: after one or several identical calls, the server state is the same. The real problem comes from the **ambiguous timeout**: the client does not know whether the server received and processed it. Clients, gateways and queues then **retry** (at-least-once delivery), and the retry must be safe. A response may change (200 on the first call, 409 or 404 afterwards) without breaking idempotency, which is about the **effect**, not the response.",
        limite:
          "In the elevator, “floor 5” is the request’s own identity. In systems, the server cannot tell a retry from a new intent (buying two identical coffees) unless the client sends an **idempotency key** that identifies that attempt.",
      },
      {
        tipo: "tabela",
        titulo: "Idempotency of HTTP verbs",
        colunas: ["Verb", "Idempotent?", "Why"],
        linhas: [
          ["GET / HEAD / OPTIONS", "Yes (and safe)", "They only read"],
          ["PUT", "Yes", "Replaces the resource with the sent value; repeating leaves it the same"],
          ["DELETE", "Yes", "After deleting, deleting again keeps the state (the response may change from 204 to 404)"],
          ["POST", "No", "Each call may create a new resource"],
          ["PATCH", "Depends", '`{"status":"paid"}` is idempotent; `{"balance":"+10"}` is not'],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The idempotency-key pattern (Stripe style)",
        legenda: "http + sql",
        codigo:
          "POST /payments\nIdempotency-Key: 7d3f9c2e-...        (UUID generated by the CLIENT, one per intent)\n\n-- on the server, in the same transaction as the payment:\nINSERT INTO idempotency (user_id, key, body_hash, status)\nVALUES ($1, $2, $3, 'in_progress')\nON CONFLICT (user_id, key) DO NOTHING;\n\n-- 1 row inserted  -> first time: process, store the response, COMMIT\n-- 0 rows inserted -> a repeat: return the stored response\n--                    (different body with the same key: 422; still in progress: 409)",
      },
      {
        tipo: "passos",
        titulo: "Other ways to make something idempotent",
        passos: [
          {
            titulo: "Naturally idempotent operations",
            texto: "`SET status = 'paid'` instead of `balance = balance + 10`; `PUT` instead of `POST`.",
          },
          {
            titulo: "Uniqueness constraints",
            texto: "`UNIQUE (order_id, type)` makes the second insert fail safely.",
          },
          {
            titulo: "Upsert",
            texto: "`INSERT ... ON CONFLICT DO UPDATE` turns “create” into “ensure it exists”.",
          },
          {
            titulo: "Consumer deduplication",
            texto: "Store already-processed `message_id`s and ignore repeats.",
          },
          {
            titulo: "Version / optimistic lock",
            texto: "Apply the change only if the expected version matches.",
          },
        ],
      },
    ],
    armadilhas: [
      "Generating the key on the server: it does not identify the retry, it must come from the client.",
      "A key with no user scope or no body comparison: the same key with a different request should fail.",
      "Not storing the original response and returning a different one on the retry.",
      "A retention window that is too short: the retry arrives after the key expired.",
      "A race between “check” and “insert”: use `UNIQUE` and `ON CONFLICT`, not a prior `SELECT`.",
    ],
    autoteste: [
      {
        pergunta: "Why is DELETE idempotent if the second call returns 404?",
        resposta:
          "Idempotency is about the effect on state, not the response: after one or several calls the resource is equally deleted.",
      },
      {
        pergunta: "Who should generate the idempotency key and why?",
        resposta:
          "The client, a unique value per intent. Only the client knows whether two requests are the same attempt repeated or two different intents.",
      },
    ],
  },
};
