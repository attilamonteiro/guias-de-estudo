import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { textoDeRotulo } from "@/tema/estilos";

/** Legenda pequena em caixa-alta que antecede um texto. */
export function Rotulo({ children }: { children: ReactNode }) {
  return (
    <Box component="span" sx={{ ...textoDeRotulo, display: "block", mb: 0.75 }}>
      {children}
    </Box>
  );
}
