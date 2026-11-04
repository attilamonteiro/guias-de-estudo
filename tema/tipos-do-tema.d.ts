// Cores próprias do site, acrescentadas à paleta do MUI (acessíveis em sx como "tons.superficie2", "metodo.feynman"…).
import type { IdMetodo } from "@/conteudo/tipos";

interface Tons {
  superficie2: string;
  acentoSuave: string;
  avisoSuave: string;
  sucessoSuave: string;
}

interface CoresDoCodigo {
  fundo: string;
  texto: string;
  mudo: string;
}

declare module "@mui/material/styles" {
  interface Palette {
    tons: Tons;
    codigo: CoresDoCodigo;
    metodo: Record<IdMetodo, string>;
  }
  interface PaletteOptions {
    tons?: Tons;
    codigo?: CoresDoCodigo;
    metodo?: Record<IdMetodo, string>;
  }
}
