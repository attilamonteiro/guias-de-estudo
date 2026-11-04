"use client";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { VisaoDoGuia } from "@/lib/guia";
import { usePreferencias, useProgresso } from "@/lib/preferencias";
import { rotas } from "@/lib/rotas";
import { textoDeRotulo } from "@/tema/estilos";
import { mesmoCaminho } from "./caminhos";
import { ItemDoIndice } from "./ItemDoIndice";

interface Props {
  visao: VisaoDoGuia;
  /** Chamado ao escolher uma pergunta (fecha a gaveta no celular). */
  aoEscolher?: () => void;
}

/** Lista de todas as perguntas, agrupadas por módulo, com busca e a marca de progresso. */
export function IndiceLateral({ visao, aoEscolher }: Props) {
  const { idioma, t } = usePreferencias();
  const { progresso } = useProgresso(visao.id);
  const caminho = usePathname();
  const [busca, setBusca] = useState("");
  const termo = busca.trim().toLowerCase();

  const grupos = visao.modulos
    .map((modulo) => ({
      modulo,
      itens: visao.itens.filter(
        (item) =>
          item.modulo === modulo.id &&
          (!termo || `${item.rotulo} ${item.titulo[idioma]} ${item.pergunta[idioma]}`.toLowerCase().includes(termo)),
      ),
    }))
    .filter((grupo) => grupo.itens.length > 0);

  return (
    <Box>
      <TextField
        type="search"
        size="small"
        fullWidth
        placeholder={t.buscar}
        value={busca}
        onChange={(evento) => setBusca(evento.target.value)}
        slotProps={{ htmlInput: { "aria-label": t.buscar, autoComplete: "off" } }}
        sx={{ mb: 1.5, "& .MuiInputBase-root": { bgcolor: "background.paper", fontSize: "0.92rem" } }}
      />
      <Box component="nav" aria-label={t.indice}>
        {grupos.map(({ modulo, itens }) => (
          <Box key={modulo.id}>
            <Typography sx={{ ...textoDeRotulo, letterSpacing: "0.07em", m: "16px 0 6px" }}>
              {modulo.letra ? `${modulo.letra} · ` : ""}
              {modulo.nome[idioma]}
            </Typography>
            {itens.map((item) => {
              const href = rotas.pergunta(visao.id, item.numero);
              return (
                <ItemDoIndice
                  key={item.numero}
                  href={href}
                  rotulo={item.rotulo}
                  titulo={item.titulo[idioma]}
                  atual={mesmoCaminho(caminho, href)}
                  estado={progresso[item.chaveDeProgresso]}
                  aoEscolher={aoEscolher}
                />
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
