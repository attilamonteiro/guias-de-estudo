"use client";

import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useProgresso, usePreferencias } from "@/lib/preferencias";
import { contarFeitas } from "@/lib/progresso";
import { FAMILIA_MONO } from "@/tema/familias";

/** "12/69" e uma barra: quantas explicações distintas já foram marcadas como entendidas. */
export function MedidorDeProgresso({ guiaId, chaves }: { guiaId: string; chaves: number[] }) {
  const { t } = usePreferencias();
  const { progresso } = useProgresso(guiaId);
  const feitas = contarFeitas(progresso, chaves);
  const total = chaves.length;
  return (
    <Box
      title={`${feitas}/${total} ${t.explicacoesDistintas}`}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        fontFamily: FAMILIA_MONO,
        fontSize: "0.78rem",
        color: "text.secondary",
      }}
    >
      <span>
        {feitas}/{total}
      </span>
      <LinearProgress
        variant="determinate"
        value={total ? (feitas / total) * 100 : 0}
        aria-label={`${feitas}/${total} ${t.entendidas}`}
        sx={{
          width: { xs: 48, sm: 74 },
          height: 6,
          borderRadius: "3px",
          bgcolor: "tons.superficie2",
          "& .MuiLinearProgress-bar": { bgcolor: "success.main" },
        }}
      />
    </Box>
  );
}
