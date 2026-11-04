"use client";

import Box from "@mui/material/Box";
import CardActionArea from "@mui/material/CardActionArea";
import Link from "next/link";
import { rotuloDaPergunta, type ItemDoIndice } from "@/lib/guia";
import { usePreferencias, useProgresso } from "@/lib/preferencias";
import { rotas } from "@/lib/rotas";
import { misturar, paletaDe } from "@/tema/cores";
import { cartao, fonteDeTitulo } from "@/tema/estilos";
import { FAMILIA_MONO } from "@/tema/familias";
import { ChipDoMetodo } from "../base/ChipDoMetodo";

/** Cartão de uma pergunta nas listas de módulo, com a marca de "entendida". */
export function CartaoDePergunta({ guiaId, item }: { guiaId: string; item: ItemDoIndice }) {
  const { idioma } = usePreferencias();
  const { progresso } = useProgresso(guiaId);
  const feita = progresso[item.chaveDeProgresso] === "feito";
  return (
    <CardActionArea
      component={Link}
      href={rotas.pergunta(guiaId, item.numero)}
      prefetch={false}
      sx={{
        ...cartao,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 1,
        p: "12px 14px",
        minWidth: 0,
        "&:hover": { borderColor: "primary.main" },
        ...(feita && { bgcolor: (tema) => misturar(paletaDe(tema).success.main, 8, paletaDe(tema).background.paper) }),
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
        <Box component="span" sx={{ fontFamily: FAMILIA_MONO, fontSize: "0.8rem", color: "text.secondary" }}>
          {rotuloDaPergunta(item.numero)}
          {item.repeteA !== undefined && ` = ${rotuloDaPergunta(item.repeteA)}`}
          {feita && " ✓"}
        </Box>
        <ChipDoMetodo metodo={item.metodo} />
      </Box>
      <Box component="b" sx={{ ...fonteDeTitulo, fontWeight: 600, lineHeight: 1.25 }}>
        {item.titulo[idioma]}
      </Box>
    </CardActionArea>
  );
}
