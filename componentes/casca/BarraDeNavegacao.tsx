"use client";

import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { encerrarNavegacao, iniciarNavegacao, useNavegacaoVisivel } from "@/lib/navegacao";
import { usePreferencias } from "@/lib/preferencias";

/** Atraso antes de aparecer: navegação instantânea não pisca a barra. */
const ATRASO_PARA_APARECER_MS = 120;

/** Caminho da página para onde o clique leva, ou null se não é navegação (Ctrl/Cmd, nova aba, download, outro site, mesma página). */
function destinoDoClique(evento: MouseEvent): string | null {
  if (evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return null;
  const ancora = (evento.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!ancora || ancora.hasAttribute("download") || (ancora.target && ancora.target !== "_self")) return null;
  const destino = new URL(ancora.href, window.location.href);
  if (destino.origin !== window.location.origin) return null;
  const mesmaPagina = destino.pathname === window.location.pathname && destino.search === window.location.search;
  return mesmaPagina ? null : destino.pathname;
}

/** Barra fina no topo, mais um aviso para leitores de tela, enquanto a próxima página carrega. */
export function BarraDeNavegacao() {
  const { navegando, visivel } = useNavegacaoVisivel(ATRASO_PARA_APARECER_MS);
  const caminho = usePathname();
  const { t } = usePreferencias();

  // O endereço mudou: a página chegou.
  useEffect(() => {
    encerrarNavegacao();
  }, [caminho]);

  // Fase de captura: roda antes do Link do Next, que cancela o clique padrão.
  useEffect(() => {
    function aoClicar(evento: MouseEvent) {
      const destino = destinoDoClique(evento);
      if (destino) iniciarNavegacao(destino);
    }
    document.addEventListener("click", aoClicar, { capture: true });
    return () => document.removeEventListener("click", aoClicar, { capture: true });
  }, []);

  return (
    <>
      <LinearProgress
        aria-hidden
        sx={{
          position: "fixed",
          inset: "0 0 auto 0",
          zIndex: 2000,
          height: 3,
          bgcolor: "transparent",
          pointerEvents: "none",
          opacity: visivel ? 1 : 0,
          "@media (prefers-reduced-motion: reduce)": {
            "& .MuiLinearProgress-bar1": { animation: "none", left: 0, right: 0, width: "100%" },
            "& .MuiLinearProgress-bar2": { display: "none" },
          },
        }}
      />
      <Box role="status" sx={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        {navegando ? t.carregando : ""}
      </Box>
    </>
  );
}
