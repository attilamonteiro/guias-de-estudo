"use client";

// Esqueletos de carregamento: a forma do que está chegando, mostrada na hora enquanto a página real não chega.
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { cartao } from "@/tema/estilos";

function Linhas({ larguras }: { larguras: string[] }) {
  return (
    <>
      {larguras.map((largura, i) => (
        <Skeleton key={i} variant="text" width={largura} sx={{ fontSize: "1rem" }} />
      ))}
    </>
  );
}

/** Mesma estrutura de PerguntaView: rótulo, enunciado, método, resposta de 30 s e blocos. */
export function EsqueletoDaPergunta() {
  return (
    <Box aria-hidden sx={{ maxWidth: 860 }}>
      <Skeleton variant="text" width={200} sx={{ fontSize: "0.76rem" }} />
      <Skeleton variant="text" width="92%" sx={{ fontSize: "2rem", mt: 1 }} />
      <Skeleton variant="text" width="64%" sx={{ fontSize: "2rem", mb: 2 }} />
      <Box sx={{ ...cartao, display: "flex", gap: "14px", alignItems: "flex-start", p: "12px 14px" }}>
        <Skeleton variant="rounded" width={96} height={26} sx={{ flex: "0 0 auto" }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Linhas larguras={["100%", "70%"]} />
        </Box>
      </Box>
      <Box
        sx={{
          mt: "18px",
          p: "16px 18px",
          borderRadius: 1,
          border: 1,
          borderColor: "divider",
          bgcolor: "tons.acentoSuave",
        }}
      >
        <Skeleton variant="text" width={150} sx={{ fontSize: "0.72rem" }} />
        <Linhas larguras={["100%", "96%", "58%"]} />
      </Box>
      <Box sx={{ mt: "34px", display: "grid", gap: "20px" }}>
        <Skeleton variant="rounded" height={150} />
        <Skeleton variant="rounded" height={110} />
      </Box>
    </Box>
  );
}

/** Título, texto e uma grade de cartões: serve ao Resumo, ao Treino e ao início de um guia. */
export function EsqueletoDaPagina() {
  return (
    <Box aria-hidden>
      <Skeleton variant="text" width={160} sx={{ fontSize: "0.76rem" }} />
      <Skeleton variant="text" width="70%" sx={{ fontSize: "2.4rem", mt: 1 }} />
      <Box sx={{ maxWidth: 760, mb: 3 }}>
        <Linhas larguras={["100%", "90%", "40%"]} />
      </Box>
      <Box
        sx={{
          display: "grid",
          gap: "14px",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
        }}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} variant="rounded" height={92} />
        ))}
      </Box>
    </Box>
  );
}
