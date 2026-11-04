import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { BlocoCodigo } from "@/conteudo/tipos";
import { FAMILIA_MONO } from "@/tema/familias";
import { Formatado } from "../base/Formatado";
import { TituloDoBloco } from "./TituloDoBloco";

/** Trecho de código com legenda; o texto é literal (sem `código` nem **negrito**). */
export function Codigo({ bloco }: { bloco: BlocoCodigo }) {
  return (
    <>
      <TituloDoBloco texto={bloco.titulo} />
      <Box component="figure" sx={{ m: "12px 0 0", bgcolor: "codigo.fundo", borderRadius: 1, overflow: "hidden" }}>
        <Box
          component="figcaption"
          sx={{
            fontFamily: FAMILIA_MONO,
            fontSize: "0.72rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "codigo.mudo",
            px: "14px",
            py: "7px",
            borderBottom: "1px solid #ffffff1a",
          }}
        >
          {bloco.legenda ?? "code"}
        </Box>
        <Box
          component="pre"
          sx={{
            m: 0,
            p: "12px 14px",
            overflowX: "auto",
            fontFamily: FAMILIA_MONO,
            fontSize: "0.84rem",
            lineHeight: 1.6,
            color: "codigo.texto",
            "& code": { background: "none", p: 0, fontSize: "inherit", overflowWrap: "normal" },
          }}
        >
          <code>{bloco.codigo}</code>
        </Box>
        {bloco.nota && (
          <Typography sx={{ px: "14px", pb: "12px", fontSize: "0.88rem", color: "codigo.mudo" }}>
            <Formatado texto={bloco.nota} />
          </Typography>
        )}
      </Box>
    </>
  );
}
