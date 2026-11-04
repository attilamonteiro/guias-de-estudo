import type { IdMetodo, Metodo, Traduzido } from "./tipos";

/** Ordem em que os métodos aparecem nos guias. */
export const ORDEM_DOS_METODOS: IdMetodo[] = [
  "feynman",
  "whys",
  "compare",
  "trace",
  "playbook",
  "threat",
  "firstprinciples",
  "design",
];

export const METODOS: Record<IdMetodo, Traduzido<Metodo>> = {
  feynman: {
    pt: {
      nome: "Feynman",
      resumo:
        "Explique para um iniciante usando uma analogia e depois procure onde a analogia falha. Se não consegue simplificar, ainda não entendeu.",
      fluxo: "analogia → mecanismo real → onde quebra",
      quandoUsar: "Conceitos abstratos que precisam virar intuição.",
    },
    en: {
      nome: "Feynman",
      resumo:
        "Explain it to a beginner with an analogy, then look for where the analogy fails. If you cannot simplify it, you have not understood it yet.",
      fluxo: "analogy → real mechanism → where it breaks",
      quandoUsar: "Abstract concepts that must become intuition.",
    },
  },
  whys: {
    pt: {
      nome: "5 Porquês",
      resumo:
        "Pergunte “por quê?” em cadeia até a causa-raiz. O conceito deixa de ser decoreba e passa a ser consequência.",
      fluxo: "por quê? → porque… → por quê? → causa-raiz",
      quandoUsar: "Perguntas “por que importa” ou “por que acontece”.",
    },
    en: {
      nome: "5 Whys",
      resumo:
        "Ask “why?” in a chain until you hit the root cause. The concept stops being memorized and becomes a consequence.",
      fluxo: "why? → because… → why? → root cause",
      quandoUsar: "“Why does it matter” or “why does it happen” questions.",
    },
  },
  compare: {
    pt: {
      nome: "Comparar e decidir",
      resumo: "Matriz lado a lado mais uma regra de decisão: quando escolher cada lado e quais armadilhas aparecem.",
      fluxo: "matriz → regra de decisão → armadilhas",
      quandoUsar: "Perguntas “X vs Y”.",
    },
    en: {
      nome: "Compare & decide",
      resumo: "A side-by-side matrix plus a decision rule: when to choose each side and which traps show up.",
      fluxo: "matrix → decision rule → traps",
      quandoUsar: "“X vs Y” questions.",
    },
  },
  trace: {
    pt: {
      nome: "Rastreio passo a passo",
      resumo: "Siga um único pedido, evento ou transação pelo sistema, incluindo o caminho em que algo dá errado.",
      fluxo: "entrada → passo 1 → passo 2 → … → falha",
      quandoUsar: "Fluxos com vários atores (eventos, CORS, sagas).",
    },
    en: {
      nome: "Step-by-step trace",
      resumo:
        "Follow one request, event or transaction through the system, including the path where something goes wrong.",
      fluxo: "input → step 1 → step 2 → … → failure",
      quandoUsar: "Flows with several actors (events, CORS, sagas).",
    },
  },
  playbook: {
    pt: {
      nome: "Playbook",
      resumo: "Sequência acionável de passos, na ordem em que você executaria no trabalho, com o sinal de cada etapa.",
      fluxo: "medir → isolar → corrigir → verificar",
      quandoUsar: "Perguntas “como você faz / depura / lida com…”.",
    },
    en: {
      nome: "Playbook",
      resumo:
        "An actionable sequence of steps, in the order you would run them on the job, with the signal for each stage.",
      fluxo: "measure → isolate → fix → verify",
      quandoUsar: "“How do you do / debug / handle…” questions.",
    },
  },
  threat: {
    pt: {
      nome: "Ameaça → defesa",
      resumo: "Entenda primeiro o ataque (como a falha acontece) e então a contramedida que quebra a causa.",
      fluxo: "ataque → causa → defesa",
      quandoUsar: "Segurança.",
    },
    en: {
      nome: "Threat → defense",
      resumo: "Understand the attack first (how the flaw happens), then the countermeasure that breaks its cause.",
      fluxo: "attack → cause → defense",
      quandoUsar: "Security.",
    },
  },
  firstprinciples: {
    pt: {
      nome: "Construir do zero",
      resumo:
        "Comece pela versão mais simples, acrescente uma restrição por vez e veja o que quebra. Cada conserto vira um componente.",
      fluxo: "simples → restrição → quebra → componente",
      quandoUsar: "“Como você projetaria / escalaria…”.",
    },
    en: {
      nome: "Build from scratch",
      resumo:
        "Start from the simplest version, add one constraint at a time and see what breaks. Each fix becomes a component.",
      fluxo: "simple → constraint → breakage → component",
      quandoUsar: "“How would you design / scale…” questions.",
    },
  },
  design: {
    pt: {
      nome: "Framework de design",
      resumo: "Roteiro fixo de system design: requisitos, estimativas, API, dados, arquitetura e gargalos.",
      fluxo: "requisitos → números → API → dados → arquitetura → gargalos",
      quandoUsar: "Desenhar um produto completo.",
    },
    en: {
      nome: "Design framework",
      resumo: "A fixed system-design script: requirements, estimates, API, data, architecture and bottlenecks.",
      fluxo: "requirements → numbers → API → data → architecture → bottlenecks",
      quandoUsar: "Designing a whole product.",
    },
  },
};
