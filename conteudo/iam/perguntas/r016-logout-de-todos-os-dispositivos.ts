import type { Pergunta } from "../../tipos";

// R16 · Logout de todos os dispositivos
export const r016: Pergunta = {
  numero: 516,
  modulo: "prachub-sessions",
  repeteA: 82,
  pt: {
    titulo: "Logout de todos os dispositivos",
    pergunta: 'Como você implementaria o "logout de todos os dispositivos"?',
  },
  en: {
    titulo: "Log out all devices",
    pergunta: 'How would you implement "log out all devices"?',
  },
};
