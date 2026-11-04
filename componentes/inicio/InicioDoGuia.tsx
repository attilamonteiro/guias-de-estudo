"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import type { TextosDoGuia, Traduzido } from "@/conteudo/tipos";
import type { VisaoDoGuia } from "@/lib/guia";
import { usePreferencias } from "@/lib/preferencias";
import { rotas } from "@/lib/rotas";
import { textoDeRotulo } from "@/tema/estilos";
import { ComoEstudar } from "./ComoEstudar";
import { GradeDeMetodos } from "./GradeDeMetodos";
import { ListaDeModulos } from "./ListaDeModulos";

interface Props {
  visao: VisaoDoGuia;
  textos: Traduzido<TextosDoGuia>;
}

const secao = { mt: "46px" } as const;
const tituloDeSecao = { mb: "14px" } as const;

/** Abertura do guia: apresentação, como estudar, métodos e as perguntas de cada fonte, por módulo. */
export function InicioDoGuia({ visao, textos }: Props) {
  const { idioma, t } = usePreferencias();
  const guia = textos[idioma];
  const primeira = visao.itens[0];
  return (
    <>
      <Box component="section">
        <Typography sx={textoDeRotulo}>{t.chamadaDaAbertura.replace("{n}", String(visao.itens.length))}</Typography>
        <Typography
          component="h1"
          variant="h1"
          sx={{ fontSize: "clamp(2rem, 5vw, 3.1rem)", fontWeight: 700, m: "10px 0 14px", letterSpacing: "-0.02em" }}
        >
          {guia.titulo}
        </Typography>
        <Typography sx={{ fontSize: "1.1rem", maxWidth: "62ch", color: "text.secondary" }}>
          {guia.introducao}
        </Typography>
        <Typography sx={{ fontSize: "0.88rem", color: "text.secondary", mt: 1 }}>
          {visao.totalDistinto} {t.explicacoesDistintas}
        </Typography>
        <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap", mt: "22px" }}>
          {primeira && (
            <Button variant="contained" component={Link} href={rotas.pergunta(visao.id, primeira.numero)}>
              {t.comecarPelaPrimeira}
            </Button>
          )}
          <Button variant="outlined" component={Link} href={rotas.treino(visao.id)}>
            {t.irParaOTreino}
          </Button>
        </Box>
      </Box>

      <Box component="section" sx={secao}>
        <Typography component="h2" variant="h2" sx={tituloDeSecao}>
          {t.comoEstudar}
        </Typography>
        <ComoEstudar />
      </Box>

      <Box component="section" sx={secao}>
        <Typography component="h2" variant="h2" sx={tituloDeSecao}>
          {t.osMetodos}
        </Typography>
        <GradeDeMetodos visao={visao} />
      </Box>

      {visao.fontes.map((fonte) => (
        <Box key={fonte.id} component="section" sx={secao}>
          <Typography component="h2" variant="h2" sx={tituloDeSecao}>
            {fonte.titulo[idioma]}
          </Typography>
          {(fonte.descricao || fonte.url) && (
            <Typography sx={{ fontSize: "1rem", maxWidth: "62ch", color: "text.secondary" }}>
              {fonte.descricao?.[idioma]}{" "}
              {fonte.url && (
                <a href={fonte.url} target="_blank" rel="noopener noreferrer">
                  {t.abrirFonte} ↗
                </a>
              )}
            </Typography>
          )}
          <ListaDeModulos visao={visao} origem={fonte.id} />
        </Box>
      ))}
    </>
  );
}
