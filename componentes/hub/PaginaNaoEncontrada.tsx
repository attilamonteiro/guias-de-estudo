"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePreferencias } from "@/lib/preferencias";
import { rotas } from "@/lib/rotas";
import { margemLateral } from "@/tema/estilos";

export function PaginaNaoEncontrada() {
  const { t } = usePreferencias();
  return (
    <Box component="main" sx={{ ...margemLateral, maxWidth: 640, mx: "auto", pt: 10, textAlign: "center" }}>
      <Typography component="h1" variant="h1">
        {t.paginaNaoEncontrada}
      </Typography>
      <Button variant="contained" component={Link} href={rotas.inicio()} sx={{ mt: 3 }}>
        {t.voltarAoInicio}
      </Button>
    </Box>
  );
}
