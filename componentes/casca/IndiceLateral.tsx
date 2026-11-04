"use client";

import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { rotuloDaPergunta, type VisaoDoGuia } from "@/lib/guia";
import { usePreferencias, useProgresso } from "@/lib/preferencias";
import { rotas } from "@/lib/rotas";
import { paletaDe } from "@/tema/cores";
import { textoDeRotulo } from "@/tema/estilos";
import { FAMILIA_MONO } from "@/tema/familias";
import { mesmoCaminho } from "./caminhos";

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
          (!termo ||
            `${rotuloDaPergunta(item.numero)} ${item.titulo[idioma]} ${item.pergunta[idioma]}`
              .toLowerCase()
              .includes(termo)),
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
              const atual = mesmoCaminho(caminho, rotas.pergunta(visao.id, item.numero));
              const estado = progresso[item.chaveDeProgresso];
              return (
                <ListItemButton
                  key={item.numero}
                  component={Link}
                  href={rotas.pergunta(visao.id, item.numero)}
                  prefetch={false}
                  onClick={aoEscolher}
                  selected={atual}
                  aria-current={atual ? "page" : undefined}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "30px 1fr 16px",
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
                    {item.numero < 100 ? String(item.numero).padStart(2, "0") : rotuloDaPergunta(item.numero)}
                  </Box>
                  <span>{item.titulo[idioma]}</span>
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
                        borderColor:
                          estado === "feito" ? p.success.main : estado === "revisar" ? p.warning.main : p.divider,
                        bgcolor:
                          estado === "feito"
                            ? p.success.main
                            : estado === "revisar"
                              ? p.tons.avisoSuave
                              : "transparent",
                      };
                    }}
                  />
                </ListItemButton>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
