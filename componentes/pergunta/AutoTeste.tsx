"use client";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { cartao } from "@/tema/estilos";
import { FAMILIA_MONO } from "@/tema/familias";
import { Formatado } from "../base/Formatado";

interface Props {
  itens: { pergunta: string; resposta: string }[];
  /** Já abertas (modo treino). */
  abertas?: boolean;
}

/** Perguntas de revisão que se abrem para mostrar a resposta. */
export function AutoTeste({ itens, abertas = false }: Props) {
  return (
    <>
      {itens.map((item) => (
        <Accordion
          key={item.pergunta}
          defaultExpanded={abertas}
          disableGutters
          elevation={0}
          sx={{
            ...cartao,
            mb: 1,
            backgroundImage: "none",
            "&::before": { display: "none" },
            "&.Mui-expanded": { mb: 1 },
          }}
        >
          <AccordionSummary
            sx={{
              px: "14px",
              minHeight: 0,
              "& .MuiAccordionSummary-content": { m: "11px 0", gap: "10px", display: "flex" },
              "&.Mui-expanded": { minHeight: 0, borderBottom: 1, borderColor: "divider" },
            }}
          >
            <Box component="span" aria-hidden sx={{ fontFamily: FAMILIA_MONO, color: "primary.main", fontWeight: 500 }}>
              ?
            </Box>
            <Typography component="span" sx={{ fontWeight: 500 }}>
              <Formatado texto={item.pergunta} />
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: "11px 14px 12px 38px" }}>
            <Typography sx={{ fontSize: "0.95rem", maxWidth: "72ch" }}>
              <Formatado texto={item.resposta} />
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
