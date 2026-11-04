import type { Guia } from "./tipos";
import { backend } from "./backend/guia";

/** Guias publicados, na ordem da página inicial. Guia novo: crie conteudo/<id>/guia.ts e registre aqui. */
export const GUIAS: Guia[] = [backend];

export function guiaPorId(id: string): Guia | undefined {
  return GUIAS.find((guia) => guia.id === id);
}
