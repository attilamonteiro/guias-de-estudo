import Box from "@mui/material/Box";
import type { BlocoPares } from "@/conteudo/tipos";
import { misturar, paletaDe } from "@/tema/cores";
import { cartao, textoDeRotulo } from "@/tema/estilos";
import { FAMILIA_MONO } from "@/tema/familias";
import { Formatado } from "../base/Formatado";
import { TituloDoBloco } from "./TituloDoBloco";

const colunas = { xs: "minmax(0, 1fr)", sm: "minmax(0, 1fr) 24px minmax(0, 1.25fr)" };
const caixa = { ...cartao, p: "10px 12px", fontSize: "0.92rem" } as const;

/** Duas colunas ligadas por seta (ataque → defesa, problema → solução). */
export function Pares({ bloco }: { bloco: BlocoPares }) {
  return (
    <>
      <TituloDoBloco texto={bloco.titulo} />
      <Box sx={{ display: "grid", gap: 1 }}>
        <Box sx={{ display: { xs: "none", sm: "grid" }, gridTemplateColumns: colunas, gap: 1, ...textoDeRotulo }}>
          <span>
            <Formatado texto={bloco.rotuloOrigem} />
          </span>
          <span />
          <span>
            <Formatado texto={bloco.rotuloDestino} />
          </span>
        </Box>
        {bloco.pares.map((par, i) => (
          <Box key={i} sx={{ display: "grid", gridTemplateColumns: colunas, gap: 1, alignItems: "stretch" }}>
            <Box
              sx={{
                ...caixa,
                bgcolor: (tema) => misturar(paletaDe(tema).metodo.threat, 7, paletaDe(tema).background.paper),
              }}
            >
              <Formatado texto={par.origem} />
            </Box>
            <Box
              aria-hidden
              sx={{
                alignSelf: "center",
                textAlign: "center",
                color: "primary.main",
                fontFamily: FAMILIA_MONO,
                fontSize: "1.1rem",
                fontWeight: 500,
                transform: { xs: "rotate(90deg)", sm: "none" },
              }}
            >
              →
            </Box>
            <Box
              sx={{
                ...caixa,
                bgcolor: (tema) => misturar(paletaDe(tema).success.main, 8, paletaDe(tema).background.paper),
              }}
            >
              <Formatado texto={par.destino} />
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
}
