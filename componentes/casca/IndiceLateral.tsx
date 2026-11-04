"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useIndiceDoGuia } from "@/lib/indice-do-guia";
import type { VisaoDoGuia } from "@/lib/guia";
import { usePreferencias, useProgresso } from "@/lib/preferencias";
import { rotas } from "@/lib/rotas";
import { textoDeRotulo } from "@/tema/estilos";
import { mesmoCaminho } from "./caminhos";
import { ItemDoIndice } from "./ItemDoIndice";

interface Props {
  guiaId: string;
  /** Chamado ao escolher uma pergunta (fecha a gaveta no celular). */
  aoEscolher?: () => void;
}

/** Lista de todas as perguntas, agrupadas por módulo, com busca e a marca de progresso. */
export function IndiceLateral({ guiaId, aoEscolher }: Props) {
  const { t } = usePreferencias();
  const estado = useIndiceDoGuia(guiaId);
  const [busca, setBusca] = useState("");

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
        {estado.situacao === "pronto" && (
          <ListaDoIndice visao={estado.visao} termo={busca.trim().toLowerCase()} aoEscolher={aoEscolher} />
        )}
        {estado.situacao === "carregando" && <EsqueletoDoIndice />}
        {estado.situacao === "erro" && (
          <Box role="alert" sx={{ mt: 2, display: "grid", gap: 1, justifyItems: "start" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {t.indiceIndisponivel}
            </Typography>
            <Button variant="outlined" onClick={estado.tentarDeNovo}>
              {t.tentarDeNovo}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function ListaDoIndice({ visao, termo, aoEscolher }: { visao: VisaoDoGuia; termo: string; aoEscolher?: () => void }) {
  const { idioma } = usePreferencias();
  const { progresso } = useProgresso(visao.id);
  const caminho = usePathname();

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
    <>
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
    </>
  );
}

/** Linhas de mentira no lugar do índice enquanto o JSON chega. */
function EsqueletoDoIndice() {
  return (
    <Box aria-hidden sx={{ mt: 2, display: "grid", gap: "10px" }}>
      <Skeleton variant="text" width="55%" sx={{ fontSize: "0.72rem" }} />
      {Array.from({ length: 11 }, (_, i) => (
        <Skeleton key={i} variant="rounded" height={22} width={i % 3 === 0 ? "82%" : "100%"} />
      ))}
    </Box>
  );
}
