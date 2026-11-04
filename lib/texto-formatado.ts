// Marcação inline dos textos do conteúdo: `código` e **negrito** (o negrito pode conter `código`).

export interface Trecho {
  tipo: "texto" | "codigo" | "negrito";
  valor: string;
}

// O negrito vem primeiro: assim `**`x`**` é um negrito com código dentro, e não código com asteriscos.
// Dentro do negrito cabem trechos de código (que podem ter `*`, como `*Sync`) e texto sem `**`.
const MARCACOES = /(\*\*(?:`[^`]+`|[^*`]|\*(?!\*))+\*\*|`[^`]+`)/g;

export function tokenizarTexto(texto: string): Trecho[] {
  return texto
    .split(MARCACOES)
    .filter((trecho) => trecho !== "")
    .map((trecho): Trecho => {
      if (trecho.length > 4 && trecho.startsWith("**") && trecho.endsWith("**")) {
        return { tipo: "negrito", valor: trecho.slice(2, -2) };
      }
      if (trecho.length > 2 && trecho.startsWith("`") && trecho.endsWith("`")) {
        return { tipo: "codigo", valor: trecho.slice(1, -1) };
      }
      return { tipo: "texto", valor: trecho };
    });
}
