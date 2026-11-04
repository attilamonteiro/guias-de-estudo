import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { BlocoPassos } from "@/conteudo/tipos";
import { cartao, fonteDeTitulo } from "@/tema/estilos";
import { FAMILIA_MONO } from "@/tema/familias";
import { Formatado } from "../base/Formatado";
import { TituloDoBloco } from "./TituloDoBloco";

/** Sequência numerada de passos, cada um com título e explicação. */
export function Passos({ bloco }: { bloco: BlocoPassos }) {
  return (
    <>
      <TituloDoBloco texto={bloco.titulo} />
      <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: "10px" }}>
        {bloco.passos.map((passo, i) => (
          <Box
            key={i}
            component="li"
            sx={{ ...cartao, display: "grid", gridTemplateColumns: "30px minmax(0, 1fr)", gap: "12px", p: "12px 14px" }}
          >
            <Box
              aria-hidden
              sx={{
                width: 28,
                height: 28,
                borderRadius: 1,
                bgcolor: "tons.superficie2",
                color: "primary.main",
                fontFamily: FAMILIA_MONO,
                fontSize: "0.82rem",
                fontWeight: 500,
                display: "grid",
                placeItems: "center",
              }}
            >
              {i + 1}
            </Box>
            <Box>
              <Typography
                component="strong"
                sx={{ ...fonteDeTitulo, display: "block", fontSize: "1rem", fontWeight: 600 }}
              >
                <Formatado texto={passo.titulo} />
              </Typography>
              <Typography sx={{ fontSize: "0.94rem", mt: "3px", maxWidth: "68ch" }}>
                <Formatado texto={passo.texto} />
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
}
