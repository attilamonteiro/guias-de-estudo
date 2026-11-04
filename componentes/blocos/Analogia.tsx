"use client";

import Box from "@mui/material/Box";
import type { Theme } from "@mui/material/styles";
import type { BlocoAnalogia } from "@/conteudo/tipos";
import { usePreferencias } from "@/lib/preferencias";
import { misturar, paletaDe } from "@/tema/cores";
import { cartao } from "@/tema/estilos";
import { Formatado } from "../base/Formatado";
import { Rotulo } from "../base/Rotulo";

/** Método Feynman: o mesmo assunto em três leituras — simples, técnica e o ponto em que a analogia falha. */
export function Analogia({ bloco }: { bloco: BlocoAnalogia }) {
  const { t } = usePreferencias();
  const colunas: { rotulo: string; texto: string; fundo?: (tema: Theme) => string }[] = [
    {
      rotulo: t.analogiaSimples,
      texto: bloco.simples,
      fundo: (tema) => misturar(paletaDe(tema).metodo.feynman, 9, paletaDe(tema).background.paper),
    },
    { rotulo: t.analogiaTecnica, texto: bloco.tecnico },
    { rotulo: t.analogiaLimite, texto: bloco.limite, fundo: (tema) => paletaDe(tema).tons.avisoSuave },
  ];
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(3, minmax(0, 1fr))" }, gap: "10px" }}>
      {colunas.map((coluna) => (
        <Box
          key={coluna.rotulo}
          sx={{ ...cartao, p: "14px 15px", fontSize: "0.96rem", bgcolor: coluna.fundo ?? "background.paper" }}
        >
          <Rotulo>{coluna.rotulo}</Rotulo>
          <Formatado texto={coluna.texto} />
        </Box>
      ))}
    </Box>
  );
}
