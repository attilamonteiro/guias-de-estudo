"use client";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import type { Idioma } from "@/conteudo/tipos";
import { usePreferencias } from "@/lib/preferencias";
import { FAMILIA_MONO } from "@/tema/familias";

const IDIOMAS: Idioma[] = ["pt", "en"];

export function SeletorDeIdioma() {
  const { idioma, definirIdioma, t } = usePreferencias();
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={idioma}
      aria-label={t.idioma}
      onChange={(_, novo: Idioma | null) => novo && definirIdioma(novo)}
      sx={{
        "& .MuiToggleButton-root": {
          fontFamily: FAMILIA_MONO,
          fontSize: "0.8rem",
          px: "11px",
          py: "5px",
          color: "text.secondary",
          borderColor: "divider",
          "&.Mui-selected, &.Mui-selected:hover": { bgcolor: "primary.main", color: "primary.contrastText" },
        },
      }}
    >
      {IDIOMAS.map((codigo) => (
        <ToggleButton key={codigo} value={codigo}>
          {codigo.toUpperCase()}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
