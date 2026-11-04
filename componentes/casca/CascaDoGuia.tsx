"use client";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { useState, type ReactNode } from "react";
import type { VisaoDoGuia } from "@/lib/guia";
import { ALTURA_DO_CABECALHO, LARGURA_MAXIMA, margemLateral } from "@/tema/estilos";
import { CabecalhoDoGuia } from "./CabecalhoDoGuia";
import { IndiceLateral } from "./IndiceLateral";

/**
 * Moldura de toda página de um guia: cabeçalho fixo, índice (lateral no desktop, gaveta no celular)
 * e a área de conteúdo. O conteúdo da página chega como `children`.
 */
export function CascaDoGuia({ visao, children }: { visao: VisaoDoGuia; children: ReactNode }) {
  const [gavetaAberta, setGavetaAberta] = useState(false);
  return (
    <>
      <CabecalhoDoGuia visao={visao} aoAbrirIndice={() => setGavetaAberta(true)} />
      <Box
        sx={{
          ...margemLateral,
          maxWidth: LARGURA_MAXIMA,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(250px, 310px) minmax(0, 1fr)" },
          alignItems: "start",
        }}
      >
        <Box
          component="aside"
          sx={{
            display: { xs: "none", md: "block" },
            position: "sticky",
            top: ALTURA_DO_CABECALHO,
            maxHeight: `calc(100dvh - ${ALTURA_DO_CABECALHO}px)`,
            overflow: "auto",
            pt: "18px",
            pr: "18px",
            pb: "40px",
            borderRight: 1,
            borderColor: "divider",
          }}
        >
          <IndiceLateral visao={visao} />
        </Box>
        <Box
          component="main"
          id="conteudo"
          sx={{ minWidth: 0, pt: { xs: "22px", md: "28px" }, pb: { xs: "70px", md: "90px" }, pl: { md: "34px" } }}
        >
          {children}
        </Box>
      </Box>
      <Drawer
        open={gavetaAberta}
        onClose={() => setGavetaAberta(false)}
        sx={{ display: { md: "none" } }}
        slotProps={{
          paper: {
            sx: {
              width: "min(350px, 90vw)",
              p: "18px 16px 40px",
              bgcolor: "background.paper",
              backgroundImage: "none",
            },
          },
        }}
      >
        <IndiceLateral visao={visao} aoEscolher={() => setGavetaAberta(false)} />
      </Drawer>
    </>
  );
}
