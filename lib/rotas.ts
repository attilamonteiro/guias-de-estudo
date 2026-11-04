// Endereços do site. next/link acrescenta o basePath (GitHub Pages) sozinho.
export const rotas = {
  inicio: () => "/",
  guia: (id: string) => `/${id}/`,
  pergunta: (id: string, numero: number) => `/${id}/pergunta/${numero}/`,
  resumo: (id: string) => `/${id}/resumo/`,
  treino: (id: string) => `/${id}/treino/`,
};
