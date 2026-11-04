"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { METODOS } from "@/conteudo/metodos";
import type { IdMetodo } from "@/conteudo/tipos";
import { usePreferencias } from "@/lib/preferencias";
import { misturar, paletaDe } from "@/tema/cores";

/** Etiqueta colorida com o nome do método de aprendizado. */
export function ChipDoMetodo({ metodo }: { metodo: IdMetodo }) {
  const { idioma } = usePreferencias();
  return (
    <Chip
      size="small"
      label={METODOS[metodo][idioma].nome}
      icon={<Box component="span" sx={{ width: 9, height: 9, borderRadius: "2px", bgcolor: `metodo.${metodo}` }} />}
      sx={(tema) => {
        const p = paletaDe(tema);
        const cor = p.metodo[metodo];
        return {
          height: "auto",
          py: "3px",
          fontWeight: 600,
          fontSize: "0.8rem",
          whiteSpace: "nowrap",
          borderRadius: "99px",
          border: 1,
          borderColor: misturar(cor, 45, p.divider),
          bgcolor: misturar(cor, 12, p.background.paper),
          "& .MuiChip-icon": { ml: "8px", mr: "-2px" },
          "& .MuiChip-label": { px: "8px" },
        };
      }}
    />
  );
}
