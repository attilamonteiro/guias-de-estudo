"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import type { Traduzido } from "@/conteudo/tipos";
import { rotuloDaPergunta, type VisaoDoGuia } from "@/lib/guia";
import { usePreferencias } from "@/lib/preferencias";
import { rotas } from "@/lib/rotas";
import { cartao, fonteDeTitulo, textoDeRotulo } from "@/tema/estilos";
import { FAMILIA_MONO } from "@/tema/familias";
import { ChipDoMetodo } from "../base/ChipDoMetodo";
import { Formatado } from "../base/Formatado";

interface Props {
  visao: VisaoDoGuia;
  /** Resposta de 30 segundos de cada pergunta (a das repetidas é a da original). */
  respostas: Record<number, Traduzido<string>>;
}

/** Uma frase por pergunta, agrupada por módulo: revisão rápida. */
export function ResumoView({ visao, respostas }: Props) {
  const { idioma, t } = usePreferencias();
  return (
    <Box sx={{ maxWidth: 860 }}>
      <Typography sx={{ ...textoDeRotulo, fontSize: "0.76rem" }}>{t.resumo}</Typography>
      <Typography component="h1" variant="h1" sx={{ m: "8px 0" }}>
        {t.resumoTitulo}
      </Typography>
      <Typography sx={{ fontSize: "1.1rem", maxWidth: "62ch", color: "text.secondary", mb: 1 }}>
        {t.resumoExplicacao}
      </Typography>
      {visao.modulos.map((modulo) => (
        <Box key={modulo.id} sx={{ mt: "22px" }}>
          <Typography component="h3" variant="h3" sx={{ mb: "10px" }}>
            <Box
              component="span"
              sx={{ fontFamily: FAMILIA_MONO, fontSize: "0.76rem", color: "text.secondary", fontWeight: 500, mr: 1 }}
            >
              {modulo.marca}
            </Box>
            {modulo.nome[idioma]}
          </Typography>
          <Box sx={{ display: "grid", gap: "10px" }}>
            {visao.itens
              .filter((item) => item.modulo === modulo.id)
              .map((item) => (
                <Box
                  key={item.numero}
                  sx={{
                    ...cartao,
                    display: "grid",
                    gridTemplateColumns: "44px minmax(0, 1fr)",
                    gap: "4px 12px",
                    p: "12px 14px",
                  }}
                >
                  <Box
                    component="span"
                    sx={{ fontFamily: FAMILIA_MONO, color: "text.secondary", fontSize: "0.84rem", pt: "2px" }}
                  >
                    {rotuloDaPergunta(item.numero)}
                  </Box>
                  <Box sx={{ display: "flex", gap: "8px 12px", flexWrap: "wrap", alignItems: "center" }}>
                    <Box
                      component={Link}
                      href={rotas.pergunta(visao.id, item.numero)}
                      prefetch={false}
                      sx={{
                        ...fonteDeTitulo,
                        fontWeight: 600,
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {item.titulo[idioma]}
                    </Box>
                    {item.repeteA !== undefined && (
                      <Typography component="span" sx={{ fontSize: "0.88rem", color: "text.secondary" }}>
                        = {rotuloDaPergunta(item.repeteA)}
                      </Typography>
                    )}
                    <ChipDoMetodo metodo={item.metodo} />
                  </Box>
                  <Typography sx={{ gridColumn: 2, fontSize: "0.94rem", maxWidth: "74ch" }}>
                    <Formatado texto={respostas[item.numero][idioma]} />
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
