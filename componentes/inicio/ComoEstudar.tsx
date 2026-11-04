"use client";

import Box from "@mui/material/Box";
import { usePreferencias } from "@/lib/preferencias";
import { cartao, fonteDeTitulo } from "@/tema/estilos";
import { FAMILIA_MONO } from "@/tema/familias";

/** Os quatro passos do método de estudo, em cartões numerados. */
export function ComoEstudar() {
  const { t } = usePreferencias();
  return (
    <Box
      component="ol"
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
        gap: "12px",
        listStyle: "none",
        m: 0,
        p: 0,
      }}
    >
      {t.passosDeEstudo.map((passo, i) => (
        <Box key={passo.titulo} component="li" sx={{ ...cartao, p: "14px 16px" }}>
          <Box
            component="span"
            aria-hidden
            sx={{ fontFamily: FAMILIA_MONO, fontSize: "0.8rem", color: "primary.main", fontWeight: 500 }}
          >
            {i + 1}
          </Box>
          <Box component="strong" sx={{ ...fonteDeTitulo, display: "block", m: "2px 0 4px" }}>
            {passo.titulo}
          </Box>
          <Box component="span" sx={{ display: "block", fontSize: "0.92rem", color: "text.secondary" }}>
            {passo.texto}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
