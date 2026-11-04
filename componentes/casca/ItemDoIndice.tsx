"use client";

import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import Link from "next/link";
import { memo } from "react";
import type { EstadoDeEstudo } from "@/lib/progresso";
import { paletaDe } from "@/tema/cores";
import { FAMILIA_MONO } from "@/tema/familias";

interface Props {
  href: string;
  rotulo: string;
  titulo: string;
  atual: boolean;
  estado: EstadoDeEstudo | undefined;
  aoEscolher?: () => void;
}

/**
 * Uma linha do índice. Só recebe valores simples e é memorizada: o índice tem centenas de linhas e,
 * ao navegar, só a que perdeu e a que ganhou o destaque precisam ser redesenhadas.
 */
export const ItemDoIndice = memo(function ItemDoIndice({ href, rotulo, titulo, atual, estado, aoEscolher }: Props) {
  return (
    <ListItemButton
      component={Link}
      href={href}
      prefetch={false}
      onClick={aoEscolher}
      selected={atual}
      aria-current={atual ? "page" : undefined}
      sx={{
        display: "grid",
        gridTemplateColumns: "40px 1fr 16px",
        alignItems: "center",
        gap: "6px",
        px: 1,
        py: "6px",
        borderRadius: 1,
        fontSize: "0.92rem",
        lineHeight: 1.35,
        "&:hover": { bgcolor: "tons.superficie2" },
        "&.Mui-selected, &.Mui-selected:hover": { bgcolor: "tons.acentoSuave", fontWeight: 600 },
      }}
    >
      <Box component="span" sx={{ fontFamily: FAMILIA_MONO, fontSize: "0.78rem", color: "text.secondary" }}>
        {rotulo}
      </Box>
      <span>{titulo}</span>
      <Box
        component="span"
        aria-hidden
        sx={(tema) => {
          const p = paletaDe(tema);
          return {
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: "1.5px solid",
            borderColor: estado === "feito" ? p.success.main : estado === "revisar" ? p.warning.main : p.divider,
            bgcolor: estado === "feito" ? p.success.main : estado === "revisar" ? p.tons.avisoSuave : "transparent",
          };
        }}
      />
    </ListItemButton>
  );
});
