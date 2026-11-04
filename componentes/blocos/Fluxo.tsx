import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Fragment } from "react";
import type { BlocoFluxo } from "@/conteudo/tipos";
import { cartao } from "@/tema/estilos";
import { FAMILIA_MONO } from "@/tema/familias";
import { Formatado } from "../base/Formatado";
import { TituloDoBloco } from "./TituloDoBloco";

/** Etapas encadeadas por setas; em celular empilha na vertical. */
export function Fluxo({ bloco }: { bloco: BlocoFluxo }) {
  return (
    <>
      <TituloDoBloco texto={bloco.titulo} />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          flexWrap: "wrap",
          alignItems: "stretch",
          gap: 1,
        }}
      >
        {bloco.etapas.map((etapa, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <Box
                aria-hidden
                sx={{
                  alignSelf: { xs: "flex-start", sm: "center" },
                  ml: { xs: "14px", sm: 0 },
                  transform: { xs: "rotate(90deg)", sm: "none" },
                  color: "primary.main",
                  fontFamily: FAMILIA_MONO,
                  fontSize: "1.1rem",
                  fontWeight: 500,
                }}
              >
                →
              </Box>
            )}
            <Box
              sx={{
                ...cartao,
                p: "10px 12px",
                fontSize: "0.9rem",
                flex: { xs: "0 1 auto", sm: "1 1 200px" },
                maxWidth: "100%",
                minWidth: 0,
              }}
            >
              <Formatado texto={etapa} />
            </Box>
          </Fragment>
        ))}
      </Box>
      {bloco.nota && (
        <Typography sx={{ fontSize: "0.88rem", color: "text.secondary", mt: 1, maxWidth: "72ch" }}>
          <Formatado texto={bloco.nota} />
        </Typography>
      )}
    </>
  );
}
