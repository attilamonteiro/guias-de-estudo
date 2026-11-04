import type { Theme } from "@mui/material/styles";

/** Paleta com as cores como variáveis CSS (var(--mui-palette-…)), própria para compor com color-mix. */
export function paletaDe(tema: Theme) {
  return (tema.vars ?? tema).palette;
}

/** `porcento`% de `cor` sobre `base`. */
export function misturar(cor: string, porcento: number, base: string): string {
  return `color-mix(in srgb, ${cor} ${porcento}%, ${base})`;
}
