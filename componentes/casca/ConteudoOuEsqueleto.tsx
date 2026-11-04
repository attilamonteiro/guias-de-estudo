"use client";

import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { useNavegacaoVisivel } from "@/lib/navegacao";
import { EsqueletoDaPagina, EsqueletoDaPergunta } from "../base/Esqueleto";

/** Atraso antes de trocar o conteúdo pelo esqueleto: navegação rápida não pisca. */
const ATRASO_PARA_APARECER_MS = 150;

const CAMINHO_DE_PERGUNTA = /\/pergunta\/\d+\/?$/;

/**
 * Mostra o conteúdo; enquanto a próxima página chega, esconde-o e mostra o esqueleto dela.
 * O conteúdo continua montado (só oculto), então nada se perde se a navegação não acontecer.
 */
export function ConteudoOuEsqueleto({ children }: { children: ReactNode }) {
  const { visivel, destino } = useNavegacaoVisivel(ATRASO_PARA_APARECER_MS);
  return (
    <>
      <Box sx={{ display: visivel ? "none" : "block" }}>{children}</Box>
      {visivel && (CAMINHO_DE_PERGUNTA.test(destino) ? <EsqueletoDaPergunta /> : <EsqueletoDaPagina />)}
    </>
  );
}
