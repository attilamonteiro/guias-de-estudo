import type { Pergunta } from "../../tipos";

// G30 · Sessão de usuário que nunca expira
export const g030: Pergunta = {
  numero: 330,
  modulo: "glassdoor-react",
  repeteA: 170,
  pt: {
    titulo: "Sessão de usuário que nunca expira",
    pergunta:
      "Como fazer a sessão de um usuário durar indefinidamente para que ele possa usar a aplicação sem que a sessão expire?",
  },
  en: {
    titulo: "A session that never expires",
    pergunta:
      "How do you make a user session last indefinitely so the user can use the application without the session expiring?",
  },
};
