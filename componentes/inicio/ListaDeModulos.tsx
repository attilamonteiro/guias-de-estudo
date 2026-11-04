"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { VisaoDoGuia } from "@/lib/guia";
import { usePreferencias } from "@/lib/preferencias";
import { FAMILIA_MONO } from "@/tema/familias";
import { CartaoDePergunta } from "./CartaoDePergunta";

/** Módulos de uma fonte (`Modulo.origem`) e as perguntas de cada um. */
export function ListaDeModulos({ visao, origem }: { visao: VisaoDoGuia; origem: string }) {
  const { idioma } = usePreferencias();
  return (
    <>
      {visao.modulos
        .filter((modulo) => modulo.origem === origem)
        .map((modulo) => (
          <Box key={modulo.id} sx={{ mt: "22px" }}>
            <Typography component="h3" variant="h3" sx={{ mb: "10px" }}>
              <Box
                component="span"
                sx={{ fontFamily: FAMILIA_MONO, fontSize: "0.76rem", color: "text.secondary", fontWeight: 500, mr: 1 }}
              >
                {modulo.marca}
              </Box>
              {modulo.nome[idioma]}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
                gap: "10px",
              }}
            >
              {visao.itens
                .filter((item) => item.modulo === modulo.id)
                .map((item) => (
                  <CartaoDePergunta key={item.numero} guiaId={visao.id} item={item} />
                ))}
            </Box>
          </Box>
        ))}
    </>
  );
}
