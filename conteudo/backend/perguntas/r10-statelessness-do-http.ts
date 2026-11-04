import type { Pergunta } from "../../tipos";

// R10 · Statelessness do HTTP
export const r10: Pergunta = {
  numero: 110,
  modulo: "roadmap-iniciante",
  metodo: "feynman",
  pt: {
    titulo: "Statelessness do HTTP",
    pergunta: "Explique o conceito de statelessness no HTTP e como ele impacta os serviços de backend.",
    porqueEsteMetodo:
      "Stateless parece abstrato, mas uma analogia (um atendente sem memória) deixa o conceito óbvio, e o ponto em que ela falha (o estado só muda de lugar) traz o impacto real.",
    resposta30s:
      "HTTP é **stateless**: cada requisição é independente e o servidor não guarda nada da anterior. Se a aplicação precisa de continuidade (login, carrinho), o estado vai **com a requisição** (token, ID de sessão) ou fica **fora do processo** (Redis, banco). O impacto é positivo para a escala (qualquer instância atende qualquer requisição) e exige que o estado seja gerenciado de propósito.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Um atendente com amnésia: a cada visita ele não lembra de você, então você mostra o crachá e o pedido completo toda vez.",
        tecnico:
          "O servidor trata cada requisição como nova. Para continuidade, o estado viaja **na requisição** (cookie com ID de sessão, token) ou fica **num armazenamento compartilhado**. Consequência: qualquer instância pode atender qualquer requisição, o que permite escalar horizontalmente, reiniciar e substituir servidores sem perder usuários.",
        limite:
          "O estado não desapareceu, só mudou de lugar. Alguém precisa guardá-lo (cliente, cache ou banco), e isso tem custo e riscos (token roubado, cache fora do ar).",
      },
      {
        tipo: "tabela",
        titulo: "Onde o estado pode ficar",
        colunas: ["Onde", "Exemplo", "Consequência"],
        linhas: [
          ["No cliente", "JWT, cookie com dados", "Servidor leve; token difícil de revogar e dado exposto"],
          [
            "Em armazenamento compartilhado",
            "Sessão no Redis, carrinho no banco",
            "Revogável e confiável; dependência extra",
          ],
          ["Na memória do servidor", "Sessão em RAM", "Exige sticky session e perde o estado ao reiniciar"],
        ],
      },
    ],
    armadilhas: [
      "Guardar estado na memória do processo e escalar horizontalmente.",
      "Entender stateless como “sem estado em lugar nenhum”.",
      "Confundir HTTP stateless com uma conexão TCP persistente.",
    ],
    autoteste: [
      {
        pergunta: "Por que stateless facilita escalar?",
        resposta: "Porque qualquer instância responde qualquer requisição; basta adicionar mais atrás do balanceador.",
      },
      {
        pergunta: "Como manter o usuário logado num protocolo stateless?",
        resposta:
          "Enviando a cada requisição um token ou ID de sessão, cujo estado fica no próprio token ou num armazenamento compartilhado.",
      },
    ],
  },
  en: {
    titulo: "HTTP statelessness",
    pergunta: "Explain the concept of statelessness in HTTP and how it impacts backend services.",
    porqueEsteMetodo:
      "Stateless sounds abstract, but an analogy (an attendant with no memory) makes it obvious, and the point where it fails (state just moves elsewhere) brings the real impact.",
    resposta30s:
      "HTTP is **stateless**: each request is independent and the server keeps nothing from the previous one. If the application needs continuity (login, cart), the state goes **with the request** (token, session ID) or lives **outside the process** (Redis, database). The impact is positive for scale (any instance serves any request) and requires state to be managed on purpose.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "An attendant with amnesia: on every visit they do not remember you, so you show your badge and the full request each time.",
        tecnico:
          "The server treats each request as new. For continuity, state travels **in the request** (cookie with a session ID, token) or lives **in a shared store**. Consequence: any instance can serve any request, which allows horizontal scaling, restarting and replacing servers without losing users.",
        limite:
          "State did not disappear, it just moved. Someone must store it (client, cache or database), and that has cost and risks (stolen token, cache down).",
      },
      {
        tipo: "tabela",
        titulo: "Where state can live",
        colunas: ["Where", "Example", "Consequence"],
        linhas: [
          ["On the client", "JWT, cookie with data", "Light server; token hard to revoke and data exposed"],
          ["In shared storage", "Session in Redis, cart in the database", "Revocable and reliable; extra dependency"],
          ["In server memory", "Session in RAM", "Needs sticky sessions and loses state on restart"],
        ],
      },
    ],
    armadilhas: [
      "Keeping state in process memory and scaling horizontally.",
      "Reading stateless as “no state anywhere”.",
      "Confusing stateless HTTP with a persistent TCP connection.",
    ],
    autoteste: [
      {
        pergunta: "Why does stateless make scaling easier?",
        resposta: "Because any instance answers any request; you just add more behind the load balancer.",
      },
      {
        pergunta: "How do you keep a user logged in over a stateless protocol?",
        resposta:
          "By sending a token or session ID on each request, whose state lives in the token itself or in a shared store.",
      },
    ],
  },
};
