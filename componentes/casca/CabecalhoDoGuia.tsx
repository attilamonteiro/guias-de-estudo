"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePreferencias } from "@/lib/preferencias";
import { rotas } from "@/lib/rotas";
import type { VisaoDoGuia } from "@/lib/guia";
import { LARGURA_MAXIMA, margemLateral } from "@/tema/estilos";
import { FAMILIA_DISPLAY, FAMILIA_MONO } from "@/tema/familias";
import { MedidorDeProgresso } from "./MedidorDeProgresso";
import { SeletorDeIdioma } from "./SeletorDeIdioma";
import { mesmoCaminho } from "./caminhos";

interface Props {
  visao: VisaoDoGuia;
  aoAbrirIndice: () => void;
}

export function CabecalhoDoGuia({ visao, aoAbrirIndice }: Props) {
  const { idioma, t } = usePreferencias();
  const caminho = usePathname();
  const abas = [
    { rotulo: t.inicio, href: rotas.guia(visao.id) },
    { rotulo: t.resumo, href: rotas.resumo(visao.id) },
    { rotulo: t.treino, href: rotas.treino(visao.id) },
  ];
  const chaves = visao.itens.filter((item) => item.repeteA === undefined).map((item) => item.numero);

  return (
    <AppBar
      position="sticky"
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
      <Toolbar
        disableGutters
        sx={{
          ...margemLateral,
          maxWidth: LARGURA_MAXIMA,
          width: "100%",
          mx: "auto",
          py: 1,
          minHeight: "56px !important",
          gap: { xs: "6px 10px", sm: "8px 14px" },
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="outlined"
          onClick={aoAbrirIndice}
          aria-haspopup="dialog"
          sx={{ display: { xs: "inline-flex", md: "none" }, py: "6px", px: "10px" }}
        >
          ☰ {t.indice}
        </Button>
        <Box
          component={Link}
          href={rotas.guia(visao.id)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: "10px" },
            textDecoration: "none",
            fontFamily: FAMILIA_DISPLAY,
            fontWeight: 700,
            fontSize: { xs: "0.95rem", sm: "1.12rem" },
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            mr: { md: "auto" },
            flex: { xs: "1 1 auto", md: "0 1 auto" },
            minWidth: 0,
          }}
        >
          <Box
            component="span"
            aria-hidden
            sx={{
              fontFamily: FAMILIA_MONO,
              fontWeight: 500,
              fontSize: "0.78rem",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              px: "7px",
              py: "3px",
              borderRadius: 1,
            }}
          >
            /{visao.itens.length}
          </Box>
          <span>{visao.nome[idioma]}</span>
        </Box>
        <Box
          component="nav"
          aria-label={t.navegacao}
          sx={{
            display: "flex",
            gap: "2px",
            order: { xs: 9, sm: 0 },
            width: { xs: "100%", sm: "auto" },
            ml: { md: "auto" },
          }}
        >
          {abas.map((aba) => {
            const ativa = mesmoCaminho(caminho, aba.href);
            return (
              <Button
                key={aba.href}
                component={Link}
                href={aba.href}
                aria-current={ativa ? "page" : undefined}
                sx={{
                  flex: { xs: 1, sm: "0 0 auto" },
                  px: "11px",
                  py: "7px",
                  fontSize: "0.9rem",
                  color: ativa ? "text.primary" : "text.secondary",
                  bgcolor: ativa ? "tons.acentoSuave" : "transparent",
                  "&:hover": { bgcolor: ativa ? "tons.acentoSuave" : "tons.superficie2", color: "text.primary" },
                }}
              >
                {aba.rotulo}
              </Button>
            );
          })}
        </Box>
        <SeletorDeIdioma />
        <MedidorDeProgresso guiaId={visao.id} chaves={chaves} />
      </Toolbar>
    </AppBar>
  );
}
