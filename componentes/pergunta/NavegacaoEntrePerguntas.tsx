"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { iniciarNavegacao } from "@/lib/navegacao";
import { usePreferencias, useProgresso } from "@/lib/preferencias";
import { rotas } from "@/lib/rotas";

interface Props {
  guiaId: string;
  chaveDeProgresso: number;
  anterior?: VizinhaDaPergunta;
  proxima?: VizinhaDaPergunta;
}

export interface VizinhaDaPergunta {
  numero: number;
  rotulo: string;
}

const TECLAS_DE_CAMPO = /^(INPUT|TEXTAREA|SELECT)$/;

/** Anterior, "marcar como entendido" e próxima; as setas do teclado também navegam. */
export function NavegacaoEntrePerguntas({ guiaId, chaveDeProgresso, anterior, proxima }: Props) {
  const { t } = usePreferencias();
  const { progresso, alternarFeito } = useProgresso(guiaId);
  const router = useRouter();
  const feita = progresso[chaveDeProgresso] === "feito";

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      const alvo = evento.target as HTMLElement | null;
      if (alvo && TECLAS_DE_CAMPO.test(alvo.tagName)) return;
      if (evento.altKey || evento.ctrlKey || evento.metaKey) return;
      const destino = evento.key === "ArrowRight" ? proxima : evento.key === "ArrowLeft" ? anterior : undefined;
      if (!destino) return;
      const caminho = rotas.pergunta(guiaId, destino.numero);
      iniciarNavegacao(caminho);
      router.push(caminho);
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [router, guiaId, anterior, proxima]);

  return (
    <Box
      component="nav"
      sx={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        mt: "36px",
        pt: "20px",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      {anterior ? (
        <Button variant="outlined" component={Link} href={rotas.pergunta(guiaId, anterior.numero)}>
          ← {t.anterior} · {anterior.rotulo}
        </Button>
      ) : (
        <span />
      )}
      <Button
        variant="outlined"
        onClick={() => alternarFeito(chaveDeProgresso)}
        aria-pressed={feita}
        sx={
          feita
            ? {
                bgcolor: "tons.sucessoSuave",
                borderColor: "success.main",
                "&:hover": { bgcolor: "tons.sucessoSuave", borderColor: "success.main" },
              }
            : undefined
        }
      >
        {feita ? t.entendido : t.marcarEntendido}
      </Button>
      {proxima ? (
        <Button variant="contained" component={Link} href={rotas.pergunta(guiaId, proxima.numero)}>
          {t.proxima} · {proxima.rotulo} →
        </Button>
      ) : (
        <span />
      )}
    </Box>
  );
}
