import type { Pergunta } from "../../tipos";

// L220 · useEffect gigante com várias chamadas
export const l220: Pergunta = {
  numero: 220,
  modulo: "linkedin-cenarios",
  repeteA: 75,
  pt: {
    titulo: "useEffect gigante com várias chamadas",
    pergunta:
      "Cenário 6: um componente tem um useEffect() enorme com várias chamadas de API e atualizações de estado. Você o manteria?",
  },
  en: {
    titulo: "Splitting a huge useEffect",
    pergunta:
      "Scenario 6: A component has a huge useEffect() containing multiple API calls and state updates. Would you keep it?",
  },
};
