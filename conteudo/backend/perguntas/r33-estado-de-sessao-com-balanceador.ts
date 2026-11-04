import type { Pergunta } from "../../tipos";

// R33 · Estado de sessão com balanceador
export const r33: Pergunta = {
  numero: 133,
  modulo: "roadmap-intermediario",
  metodo: "compare",
  pt: {
    titulo: "Estado de sessão com balanceador",
    pergunta: "Como você trataria o estado de sessão em um ambiente de aplicação com balanceamento de carga?",
    porqueEsteMetodo:
      "Há três estratégias com trade-offs diferentes. Uma matriz lado a lado e uma regra de decisão respondem melhor do que descrevê-las em prosa.",
    resposta30s:
      "O problema: se a sessão está na memória de um servidor, a próxima requisição pode cair em outro, que não a tem. Há três saídas: **sticky sessions** (o balanceador manda sempre o mesmo cliente ao mesmo servidor), **armazenamento centralizado** (Redis ou banco compartilhado) e **estado no cliente** (token assinado). O padrão recomendado é a **sessão centralizada** (ou tokens de vida curta), para a aplicação ser **stateless**.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Estratégia", "Como funciona", "Prós", "Contras"],
        linhas: [
          [
            "Sticky sessions (afinidade)",
            "O balanceador envia o mesmo cliente sempre ao mesmo servidor (cookie ou hash de IP)",
            "Simples; sessão na memória local",
            "Carga desigual; perde a sessão se o servidor cai ou é substituído; atrapalha o autoscaling",
          ],
          [
            "Armazenamento centralizado",
            "Sessão em Redis ou banco compartilhado por todos os servidores",
            "Qualquer servidor atende; sobrevive a reinícios; revogável",
            "Dependência extra e latência; precisa ser altamente disponível",
          ],
          [
            "Estado no cliente (token assinado)",
            "JWT ou cookie assinado com os dados da sessão",
            "Nenhum armazenamento; escala fácil",
            "Difícil revogar; limite de tamanho; dado exposto se não for cifrado",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Na maioria dos sistemas: **sessão centralizada no Redis** (ou tokens de vida curta). Sticky sessions só como solução temporária. O objetivo é uma aplicação **stateless**, que escala e se recupera sem prender usuários. Veja também a R10 e a Q16.",
      },
    ],
    armadilhas: [
      "Sessão em memória com várias instâncias e sem afinidade: usuários “deslogam” aleatoriamente.",
      "Sticky session como solução definitiva.",
      "Redis de sessão sem replicação: a queda dele derruba todos os logins.",
    ],
    autoteste: [
      {
        pergunta: "Por que sessão em memória local quebra com um balanceador?",
        resposta: "Porque a próxima requisição pode cair em outro servidor, que não tem a sessão.",
      },
      {
        pergunta: "Qual a vantagem do armazenamento de sessão centralizado?",
        resposta:
          "Qualquer servidor atende qualquer requisição e as instâncias podem ser substituídas sem perder sessões.",
      },
    ],
  },
  en: {
    titulo: "Session state behind a load balancer",
    pergunta: "How would you handle session state in a load-balanced application environment?",
    porqueEsteMetodo:
      "There are three strategies with different trade-offs. A side-by-side matrix and a decision rule answer better than describing them in prose.",
    resposta30s:
      "The problem: if the session lives in one server’s memory, the next request may land on another that does not have it. Three ways out: **sticky sessions** (the balancer always sends the same client to the same server), **centralized storage** (Redis or a shared database) and **client-side state** (a signed token). The recommended default is **centralized session** (or short-lived tokens), so the application stays **stateless**.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Strategy", "How it works", "Pros", "Cons"],
        linhas: [
          [
            "Sticky sessions (affinity)",
            "The balancer always sends the same client to the same server (cookie or IP hash)",
            "Simple; session in local memory",
            "Uneven load; session lost if the server dies or is replaced; hurts autoscaling",
          ],
          [
            "Centralized storage",
            "Session in Redis or a database shared by all servers",
            "Any server serves; survives restarts; revocable",
            "Extra dependency and latency; must be highly available",
          ],
          [
            "Client-side state (signed token)",
            "A JWT or signed cookie carrying the session data",
            "No storage; scales easily",
            "Hard to revoke; size limit; data exposed if not encrypted",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "In most systems: **centralized session in Redis** (or short-lived tokens). Sticky sessions only as a temporary fix. The goal is a **stateless** application, which scales and recovers without pinning users. See also R10 and Q16.",
      },
    ],
    armadilhas: [
      "In-memory session with several instances and no affinity: users get “logged out” at random.",
      "Sticky sessions as the permanent solution.",
      "Session Redis without replication: its failure logs everyone out.",
    ],
    autoteste: [
      {
        pergunta: "Why does local in-memory session break with a load balancer?",
        resposta: "Because the next request may land on another server that does not have the session.",
      },
      {
        pergunta: "What is the advantage of centralized session storage?",
        resposta: "Any server serves any request and instances can be replaced without losing sessions.",
      },
    ],
  },
};
