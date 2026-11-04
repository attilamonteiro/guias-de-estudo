"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CardActionArea from "@mui/material/CardActionArea";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import type { Traduzido } from "@/conteudo/tipos";
import { usePreferencias } from "@/lib/preferencias";
import { rotas } from "@/lib/rotas";
import { cartao, fonteDeTitulo, margemLateral } from "@/tema/estilos";
import { FAMILIA_DISPLAY, FAMILIA_MONO } from "@/tema/familias";
import { SeletorDeIdioma } from "../casca/SeletorDeIdioma";

export interface GuiaNoHub {
  id: string;
  detalhe: string;
  textos: Traduzido<{ nome: string; chamada: string }>;
}

/** Página inicial do site: lista os guias disponíveis. */
export function PaginaInicialDoSite({ guias }: { guias: GuiaNoHub[] }) {
  const { idioma, t } = usePreferencias();
  return (
    <>
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          backgroundImage: "none",
          color: "text.primary",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar disableGutters sx={{ ...margemLateral, maxWidth: 960, width: "100%", mx: "auto", gap: "10px" }}>
          <Box
            component="span"
            aria-hidden
            sx={{
              fontFamily: FAMILIA_MONO,
              fontSize: "0.78rem",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              px: "7px",
              py: "3px",
              borderRadius: 1,
            }}
          >
            /guias
          </Box>
          <Typography
            component="span"
            sx={{ fontFamily: FAMILIA_DISPLAY, fontWeight: 700, fontSize: "1.12rem", mr: "auto" }}
          >
            {t.siteNome}
          </Typography>
          <SeletorDeIdioma />
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ ...margemLateral, maxWidth: 960, mx: "auto", pt: 6, pb: 8 }}>
        <Typography
          component="h1"
          variant="h1"
          sx={{ fontSize: "clamp(1.9rem, 5vw, 2.8rem)", letterSpacing: "-0.02em" }}
        >
          {t.siteNome}
        </Typography>
        <Typography sx={{ mt: "14px", color: "text.secondary", maxWidth: "60ch" }}>{t.siteIntroducao}</Typography>
        <Box
          component="ul"
          sx={{
            listStyle: "none",
            m: "36px 0 0",
            p: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
            gap: 2,
          }}
        >
          {guias.map((guia) => (
            <li key={guia.id}>
              <CardActionArea
                component={Link}
                href={rotas.guia(guia.id)}
                sx={{
                  ...cartao,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: "10px",
                  height: "100%",
                  p: "20px",
                  "&:hover": { borderColor: "primary.main" },
                }}
              >
                <Typography
                  component="span"
                  sx={{ fontFamily: FAMILIA_MONO, fontSize: "0.78rem", color: "text.secondary" }}
                >
                  {guia.detalhe}
                </Typography>
                <Typography component="h2" variant="h2" sx={{ ...fonteDeTitulo, fontSize: "1.5rem" }}>
                  {guia.textos[idioma].nome}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {guia.textos[idioma].chamada}
                </Typography>
                <Typography component="span" sx={{ mt: "auto", pt: "6px", fontWeight: 600, color: "primary.main" }}>
                  {t.abrirGuia}
                </Typography>
              </CardActionArea>
            </li>
          ))}
        </Box>
      </Box>
    </>
  );
}
