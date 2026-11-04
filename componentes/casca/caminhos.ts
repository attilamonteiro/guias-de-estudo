const semBarraFinal = (caminho: string) => caminho.replace(/\/+$/, "");

/** Compara endereços ignorando a barra final (o site exporta com trailingSlash). */
export function mesmoCaminho(a: string | null, b: string): boolean {
  return a !== null && semBarraFinal(a) === semBarraFinal(b);
}
