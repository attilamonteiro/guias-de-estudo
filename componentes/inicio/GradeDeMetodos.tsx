"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { METODOS, ORDEM_DOS_METODOS } from "@/conteudo/metodos";
import { rotuloDaPergunta, type VisaoDoGuia } from "@/lib/guia";
import { usePreferencias } from "@/lib/preferencias";
import { rotas } from "@/lib/rotas";
import { cartao } from "@/tema/estilos";
import { FAMILIA_MONO } from "@/tema/familias";
import { ChipDoMetodo } from "../base/ChipDoMetodo";

/** Os 8 métodos de aprendizado, cada um com as perguntas do guia que o usam. */
export function GradeDeMetodos({ visao }: { visao: VisaoDoGuia }) {
  const { idioma, t } = usePreferencias();
  const distintas = visao.itens.filter((item) => item.repeteA === undefined);
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))", gap: "12px" }}>
      {ORDEM_DOS_METODOS.map((id) => {
        const metodo = METODOS[id][idioma];
        return (
          <Box key={id} sx={{ ...cartao, p: 2, display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
            <Typography component="h3" variant="h3">
              <ChipDoMetodo metodo={id} />
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {metodo.resumo}
            </Typography>
            <Box sx={{ fontFamily: FAMILIA_MONO, fontSize: "0.76rem", lineHeight: 1.7 }}>{metodo.fluxo}</Box>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              <strong>{t.melhorPara}:</strong> {metodo.quandoUsar}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "5px", mt: "auto" }}>
              {distintas
                .filter((item) => item.metodo === id)
                .map((item) => (
                  <Box
                    key={item.numero}
                    component={Link}
                    href={rotas.pergunta(visao.id, item.numero)}
                    prefetch={false}
                    title={item.titulo[idioma]}
                    sx={{
                      fontFamily: FAMILIA_MONO,
                      fontSize: "0.76rem",
                      textDecoration: "none",
                      border: 1,
                      borderColor: "divider",
                      borderRadius: "4px",
                      px: "7px",
                      py: "2px",
                      bgcolor: "tons.superficie2",
                      "&:hover": { borderColor: "primary.main" },
                    }}
                  >
                    {rotuloDaPergunta(item.numero)}
                  </Box>
                ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
