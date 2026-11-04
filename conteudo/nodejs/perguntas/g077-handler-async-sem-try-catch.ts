import type { Pergunta } from "../../tipos";

// G77 · Handler async sem try/catch
export const g077: Pergunta = {
  numero: 677,
  modulo: "gist-especialista",
  repeteA: 141,
  pt: {
    titulo: "Handler async sem try/catch",
    pergunta:
      "Reescreva o exemplo de código sem o bloco try/catch (um handler async do Express que aguarda duas funções dentro do try, envia “result” e, no catch, envia error.stack).",
  },
  en: {
    titulo: "Async handler without try/catch",
    pergunta:
      'Rewrite the code sample without try/catch block (an async Express handler that awaits two functions inside the try, sends "result" and, in the catch, sends error.stack).',
  },
};
