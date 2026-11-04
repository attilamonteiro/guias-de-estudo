// Textos fixos da interface dos guias, nos dois idiomas. Texto de um guia específico fica em conteudo/<guia>/guia.ts.
import type { Traduzido } from "@/conteudo/tipos";

export interface TextosDaInterface {
  indice: string;
  buscar: string;
  inicio: string;
  resumo: string;
  treino: string;
  navegacao: string;
  idioma: string;
  entendidas: string;
  explicacoesDistintas: string;
  resposta30s: string;
  porqueEsteMetodo: string;
  armadilhas: string;
  testeSe: string;
  ensineDeVolta: string;
  ensineDeVoltaExplicacao: string;
  marcarEntendido: string;
  entendido: string;
  anterior: string;
  proxima: string;
  analogiaSimples: string;
  analogiaTecnica: string;
  analogiaLimite: string;
  causaRaiz: string;
  modulo: string;
  /** Aceita {n} (perguntas) e {m} (métodos usados). */
  chamadaDaAbertura: string;
  comecarPelaPrimeira: string;
  irParaOTreino: string;
  abrirFonte: string;
  mesmaMateriaDa: string;
  /** Aceita {q}. */
  mesmaMateriaExplicacao: string;
  comoEstudar: string;
  passosDeEstudo: { titulo: string; texto: string }[];
  osMetodos: string;
  melhorPara: string;
  resumoTitulo: string;
  resumoExplicacao: string;
  treinoTitulo: string;
  treinoExplicacao: string;
  revelar: string;
  euSabia: string;
  precisoRever: string;
  abrirExplicacaoCompleta: string;
  treinoVazio: string;
  zerarProgresso: string;
  restantesNoTreino: string;
  carregando: string;
  indiceIndisponivel: string;
  tentarDeNovo: string;
  paginaNaoEncontrada: string;
  voltarAoInicio: string;
  siteNome: string;
  siteIntroducao: string;
  abrirGuia: string;
}

export const TEXTOS: Traduzido<TextosDaInterface> = {
  pt: {
    indice: "Índice",
    buscar: "Buscar pergunta…",
    inicio: "Início",
    resumo: "Resumo",
    treino: "Treino",
    navegacao: "Navegação",
    idioma: "Idioma",
    entendidas: "entendidas",
    explicacoesDistintas: "explicações distintas (as perguntas repetidas contam uma vez)",
    resposta30s: "Resposta em 30 segundos",
    porqueEsteMetodo: "Por que este método",
    armadilhas: "Armadilhas",
    testeSe: "Teste-se: tente responder antes de abrir",
    ensineDeVolta: "Ensine de volta",
    ensineDeVoltaExplicacao:
      "Feche esta tela e explique em voz alta, em 60 segundos, para alguém que nunca viu o assunto. O ponto em que você travar é o que ainda não entendeu: volte àquele bloco.",
    marcarEntendido: "Marcar como entendido",
    entendido: "Entendido ✓",
    anterior: "Anterior",
    proxima: "Próxima",
    analogiaSimples: "Em palavras simples",
    analogiaTecnica: "Como funciona de verdade",
    analogiaLimite: "Onde a analogia quebra",
    causaRaiz: "Causa-raiz",
    modulo: "Módulo",
    chamadaDaAbertura: "{n} perguntas · {m} métodos · PT/EN",
    comecarPelaPrimeira: "Começar pela pergunta 1",
    irParaOTreino: "Ir para o treino",
    abrirFonte: "Abrir a página de origem",
    mesmaMateriaDa: "Mesma matéria da",
    mesmaMateriaExplicacao:
      "Esta pergunta pede o mesmo conteúdo da pergunta {q}. A explicação completa está abaixo, e marcar como entendida vale para as duas.",
    comoEstudar: "Como estudar",
    passosDeEstudo: [
      {
        titulo: "Tente primeiro",
        texto: "Antes de abrir uma resposta, diga a sua em voz alta. O esforço de lembrar é o que fixa.",
      },
      {
        titulo: "Leia pelo método",
        texto: "Cada pergunta usa a estrutura que melhor revela a ideia. Não pule o bloco que o método destaca.",
      },
      { titulo: "Ensine de volta", texto: "Explique em 60 segundos, sem olhar. Onde travar, volte ao bloco." },
      {
        titulo: "Revise espaçado",
        texto: "Use o Treino depois de 1, 3 e 7 dias. Marque “entendido” só quando conseguir ensinar.",
      },
    ],
    osMetodos: "Os métodos deste guia e quando cada um entra",
    melhorPara: "Melhor para",
    resumoTitulo: "Resumo de 30 segundos",
    resumoExplicacao: "Uma frase por pergunta. Use para revisar rápido ou antes de uma entrevista.",
    treinoTitulo: "Modo treino",
    treinoExplicacao: "Leia a pergunta, responda em voz alta e só então revele.",
    revelar: "Revelar resposta",
    euSabia: "Eu sabia",
    precisoRever: "Preciso rever",
    abrirExplicacaoCompleta: "Abrir explicação completa",
    treinoVazio: "Você marcou todas as perguntas como entendidas. Zere o progresso para treinar de novo.",
    zerarProgresso: "Zerar progresso",
    restantesNoTreino: "restantes no treino",
    carregando: "Carregando…",
    indiceIndisponivel: "Não foi possível carregar o índice.",
    tentarDeNovo: "Tentar de novo",
    paginaNaoEncontrada: "Página não encontrada",
    voltarAoInicio: "Voltar ao início",
    siteNome: "Guias de Estudo",
    siteIntroducao:
      "Cada guia ensina com o método de explicação mais adequado a cada pergunta, em português e inglês. Escolha um, estude e acompanhe o progresso no próprio navegador.",
    abrirGuia: "Abrir guia →",
  },
  en: {
    indice: "Index",
    buscar: "Search a question…",
    inicio: "Home",
    resumo: "Cheat sheet",
    treino: "Drill",
    navegacao: "Navigation",
    idioma: "Language",
    entendidas: "understood",
    explicacoesDistintas: "distinct explanations (repeated questions count once)",
    resposta30s: "30-second answer",
    porqueEsteMetodo: "Why this method",
    armadilhas: "Pitfalls",
    testeSe: "Test yourself: try answering before you open",
    ensineDeVolta: "Teach it back",
    ensineDeVoltaExplicacao:
      "Close this screen and explain it out loud in 60 seconds to someone who has never seen the topic. Wherever you get stuck is what you have not understood yet: go back to that block.",
    marcarEntendido: "Mark as understood",
    entendido: "Understood ✓",
    anterior: "Previous",
    proxima: "Next",
    analogiaSimples: "In plain words",
    analogiaTecnica: "How it really works",
    analogiaLimite: "Where the analogy breaks",
    causaRaiz: "Root cause",
    modulo: "Module",
    chamadaDaAbertura: "{n} questions · {m} methods · PT/EN",
    comecarPelaPrimeira: "Start at question 1",
    irParaOTreino: "Go to drill",
    abrirFonte: "Open the source page",
    mesmaMateriaDa: "Same subject as",
    mesmaMateriaExplicacao:
      "This question asks for the same content as question {q}. The full explanation is below, and marking it understood counts for both.",
    comoEstudar: "How to study",
    passosDeEstudo: [
      {
        titulo: "Try first",
        texto: "Before opening an answer, say yours out loud. The effort of recalling is what makes it stick.",
      },
      {
        titulo: "Read by the method",
        texto:
          "Each question uses the structure that best reveals the idea. Do not skip the block the method highlights.",
      },
      {
        titulo: "Teach it back",
        texto: "Explain it in 60 seconds without looking. Where you stall, go back to that block.",
      },
      {
        titulo: "Review spaced out",
        texto: "Use the Drill after 1, 3 and 7 days. Mark “understood” only when you can teach it.",
      },
    ],
    osMetodos: "The methods in this guide and when each one applies",
    melhorPara: "Best for",
    resumoTitulo: "30-second cheat sheet",
    resumoExplicacao: "One sentence per question. Use it for quick review or right before an interview.",
    treinoTitulo: "Drill mode",
    treinoExplicacao: "Read the question, answer out loud, and only then reveal.",
    revelar: "Reveal answer",
    euSabia: "I knew it",
    precisoRever: "Need to review",
    abrirExplicacaoCompleta: "Open full explanation",
    treinoVazio: "You marked every question as understood. Reset your progress to drill again.",
    zerarProgresso: "Reset progress",
    restantesNoTreino: "left in the drill",
    carregando: "Loading…",
    indiceIndisponivel: "The index could not be loaded.",
    tentarDeNovo: "Try again",
    paginaNaoEncontrada: "Page not found",
    voltarAoInicio: "Back to home",
    siteNome: "Study Guides",
    siteIntroducao:
      "Each guide teaches with the explanation method that best fits each question, in Portuguese and English. Pick one, study, and track your progress in your own browser.",
    abrirGuia: "Open guide →",
  },
};
