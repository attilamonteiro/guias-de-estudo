import type { Bloco } from "@/conteudo/tipos";
import { Analogia } from "./Analogia";
import { Codigo } from "./Codigo";
import { BlocoDeDestaque } from "./Destaque";
import { Fluxo } from "./Fluxo";
import { Pares } from "./Pares";
import { Passos } from "./Passos";
import { Porques } from "./Porques";
import { Tabela } from "./Tabela";

/** Escolhe o componente de cada tipo de bloco. O `switch` é exaustivo: tipo novo quebra o typecheck aqui. */
export function BlocoDaExplicacao({ bloco }: { bloco: Bloco }) {
  switch (bloco.tipo) {
    case "analogia":
      return <Analogia bloco={bloco} />;
    case "porques":
      return <Porques bloco={bloco} />;
    case "tabela":
      return <Tabela bloco={bloco} />;
    case "passos":
      return <Passos bloco={bloco} />;
    case "fluxo":
      return <Fluxo bloco={bloco} />;
    case "pares":
      return <Pares bloco={bloco} />;
    case "codigo":
      return <Codigo bloco={bloco} />;
    case "destaque":
      return <BlocoDeDestaque bloco={bloco} />;
  }
}
