import type { Pergunta } from "../../tipos";

// C23 · Ordem de render e efeitos
export const c023: Pergunta = {
  numero: 523,
  modulo: "coddy-avancado",
  repeteA: 515,
  pt: {
    titulo: "Ordem de render e efeitos",
    pergunta:
      "O que isto registra? (render, layout effect, effect) Um componente registra uma mensagem ao renderizar e declara um useEffect e um useLayoutEffect (o useEffect escrito primeiro), cada um registrando a própria mensagem. Em que ordem aparecem as três mensagens?",
  },
  en: {
    titulo: "Render and effects order",
    pergunta:
      "What does this log? (render, layout effect, effect) A component logs a message while rendering and declares a useEffect and a useLayoutEffect (the useEffect written first), each logging its own message. In what order do the three messages appear?",
  },
};
