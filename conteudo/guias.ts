import type { Guia } from "./tipos";
import { backend } from "./backend/guia";
import { iam } from "./iam/guia";
import { nodejs } from "./nodejs/guia";
import { react } from "./react/guia";

/** Guias publicados, na ordem da página inicial. Guia novo: crie conteudo/<id>/guia.ts e registre aqui. */
export const GUIAS: Guia[] = [backend, nodejs, react, iam];

export function guiaPorId(id: string): Guia | undefined {
  return GUIAS.find((guia) => guia.id === id);
}
