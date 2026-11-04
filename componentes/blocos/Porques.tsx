"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { BlocoPorques } from "@/conteudo/tipos";
import { usePreferencias } from "@/lib/preferencias";
import { FAMILIA_MONO } from "@/tema/familias";
import { cartao, fonteDeTitulo } from "@/tema/estilos";
import { Formatado } from "../base/Formatado";
import { Rotulo } from "../base/Rotulo";

/** Método dos 5 Porquês: cadeia de "por quê?" ligada por uma linha, terminando na causa-raiz. */
export function Porques({ bloco }: { bloco: BlocoPorques }) {
  const { t } = usePreferencias();
  return (
    <>
      <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0 }}>
        {bloco.cadeia.map((elo, i) => (
          <Box
            key={i}
            component="li"
            sx={{
              position: "relative",
              pb: 2,
              pl: "44px",
              "&:not(:last-child)::before": {
                content: '""',
                position: "absolute",
                left: 14,
                top: 30,
                bottom: 0,
                width: 2,
                bgcolor: "divider",
              },
            }}
          >
            <Box
              aria-hidden
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 30,
                height: 30,
                borderRadius: "50%",
                bgcolor: "metodo.whys",
                color: "background.default",
                fontFamily: FAMILIA_MONO,
                fontWeight: 500,
                fontSize: "0.85rem",
                display: "grid",
                placeItems: "center",
              }}
            >
              {i + 1}
            </Box>
            <Typography sx={{ ...fonteDeTitulo, fontWeight: 600, fontSize: "1.04rem", lineHeight: 1.3, pt: "3px" }}>
              <Formatado texto={elo.pergunta} />
            </Typography>
            <Typography sx={{ mt: "4px", fontSize: "0.97rem", maxWidth: "68ch" }}>
              <Formatado texto={elo.resposta} />
            </Typography>
          </Box>
        ))}
      </Box>
      {bloco.causaRaiz && (
        <Box sx={{ ...cartao, borderColor: "metodo.whys", p: "14px 16px", mt: "4px" }}>
          <Rotulo>{t.causaRaiz}</Rotulo>
          <Formatado texto={bloco.causaRaiz} />
        </Box>
      )}
    </>
  );
}
