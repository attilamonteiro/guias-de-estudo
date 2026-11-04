"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { IdMetodo, Traduzido } from "@/conteudo/tipos";
import { usePreferencias, useProgresso } from "@/lib/preferencias";
import { contarFeitas, escolherParaOTreino, marcar as marcarNoMapa } from "@/lib/progresso";
import { rotas } from "@/lib/rotas";
import { misturar, paletaDe } from "@/tema/cores";
import { cartao, textoDeRotulo } from "@/tema/estilos";
import { ChipDoMetodo } from "../base/ChipDoMetodo";
import { Formatado } from "../base/Formatado";
import { Rotulo } from "../base/Rotulo";
import { AutoTeste } from "../pergunta/AutoTeste";

/** Uma pergunta (com explicação própria) disponível para o treino. */
export interface CartaDoTreino {
  numero: number;
  rotulo: string;
  metodo: IdMetodo;
  pergunta: Traduzido<string>;
  resposta30s: Traduzido<string>;
  autoteste: Traduzido<{ pergunta: string; resposta: string }[]>;
}

const estiloBotaoBom = {
  bgcolor: "tons.sucessoSuave",
  borderColor: "success.main",
  "&:hover": { bgcolor: "tons.sucessoSuave", borderColor: "success.main" },
} as const;

/** Treino: sorteia uma pergunta ainda não entendida, o aluno responde em voz alta e então revela. */
export function TreinoView({ guiaId, cartas }: { guiaId: string; cartas: CartaDoTreino[] }) {
  const { idioma, t } = usePreferencias();
  const { progresso, marcar, zerar } = useProgresso(guiaId);
  const chaves = useMemo(() => cartas.map((carta) => carta.numero), [cartas]);
  // undefined = ainda não sorteou (o sorteio só roda no navegador); null = nada pendente.
  const [atual, setAtual] = useState<number | null | undefined>(undefined);
  const [revelada, setRevelada] = useState(false);

  const haPendentes = chaves.some((chave) => progresso[chave] !== "feito");
  const precisaSortear =
    atual === undefined || (atual !== null && progresso[atual] === "feito") || (atual === null && haPendentes);

  useEffect(() => {
    if (!precisaSortear) return;
    setAtual(escolherParaOTreino(chaves, progresso, atual ?? null));
    setRevelada(false);
  }, [precisaSortear, chaves, progresso, atual]);

  const carta = atual === null || atual === undefined ? undefined : cartas.find((c) => c.numero === atual);
  const restantes = chaves.length - contarFeitas(progresso, chaves);

  function responder(estado: "feito" | "revisar") {
    if (atual === null || atual === undefined) return;
    marcar(atual, estado);
    setAtual(escolherParaOTreino(chaves, marcarNoMapa(progresso, atual, estado), atual));
    setRevelada(false);
  }

  return (
    <Box sx={{ maxWidth: 760 }}>
      <Typography sx={{ ...textoDeRotulo, fontSize: "0.76rem" }}>{t.treino}</Typography>
      <Typography component="h1" variant="h1" sx={{ m: "8px 0" }}>
        {t.treinoTitulo}
      </Typography>
      <Typography sx={{ fontSize: "1.1rem", maxWidth: "62ch", color: "text.secondary" }}>
        {t.treinoExplicacao}
      </Typography>

      {atual === null && !haPendentes && (
        <Box
          sx={{
            mt: 2,
            p: "18px",
            borderRadius: 1,
            border: 1,
            borderColor: "success.main",
            bgcolor: "tons.sucessoSuave",
          }}
        >
          <Typography>{t.treinoVazio}</Typography>
          <Button variant="outlined" onClick={zerar} sx={{ mt: 2 }}>
            {t.zerarProgresso}
          </Button>
        </Box>
      )}

      {carta && (
        <Box sx={{ ...cartao, p: "22px", mt: 2 }}>
          <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <Typography component="span" sx={{ ...textoDeRotulo, fontSize: "0.76rem" }}>
              {carta.rotulo} · {restantes} {t.restantesNoTreino}
            </Typography>
            <ChipDoMetodo metodo={carta.metodo} />
          </Box>
          <Typography component="h2" variant="h2" sx={{ m: "10px 0 14px" }}>
            {carta.pergunta[idioma]}
          </Typography>

          {!revelada ? (
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={() => setRevelada(true)}>
                {t.revelar}
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{ mt: 2, display: "grid", gap: 1.5 }}>
                <Box
                  sx={{
                    p: "16px 18px",
                    borderRadius: 1,
                    border: 1,
                    bgcolor: "tons.acentoSuave",
                    borderColor: (tema) => misturar(paletaDe(tema).primary.main, 40, paletaDe(tema).divider),
                  }}
                >
                  <Rotulo>{t.resposta30s}</Rotulo>
                  <Typography sx={{ fontSize: "1.04rem", maxWidth: "72ch" }}>
                    <Formatado texto={carta.resposta30s[idioma]} />
                  </Typography>
                </Box>
                <AutoTeste itens={carta.autoteste[idioma]} abertas />
              </Box>
              <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap", mt: 2 }}>
                <Button variant="outlined" onClick={() => responder("feito")} sx={estiloBotaoBom}>
                  {t.euSabia}
                </Button>
                <Button variant="outlined" onClick={() => responder("revisar")}>
                  {t.precisoRever}
                </Button>
                <Button variant="outlined" component={Link} href={rotas.pergunta(guiaId, carta.numero)}>
                  {t.abrirExplicacaoCompleta}
                </Button>
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}
