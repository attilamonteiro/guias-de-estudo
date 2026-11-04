"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Modulo, PerguntaPropria, Traduzido } from "@/conteudo/tipos";
import { rotuloDaPergunta } from "@/lib/guia";
import { usePreferencias } from "@/lib/preferencias";
import { cartao, fonteDeTitulo, textoDeRotulo } from "@/tema/estilos";
import { FAMILIA_MONO } from "@/tema/familias";
import { misturar, paletaDe } from "@/tema/cores";
import { ChipDoMetodo } from "../base/ChipDoMetodo";
import { Formatado } from "../base/Formatado";
import { Rotulo } from "../base/Rotulo";
import { BlocoDaExplicacao } from "../blocos/BlocoDaExplicacao";
import { Destaque } from "../blocos/Destaque";
import { AutoTeste } from "./AutoTeste";
import { NavegacaoEntrePerguntas } from "./NavegacaoEntrePerguntas";

export interface DadosDaPergunta {
  guiaId: string;
  numero: number;
  chaveDeProgresso: number;
  modulo: Modulo;
  /** Título e enunciado da pergunta pedida (que pode ser uma repetição de outra). */
  textos: Traduzido<{ titulo: string; pergunta: string }>;
  repeteA?: { numero: number; titulo: Traduzido<string> };
  /** A pergunta que carrega a explicação (a própria ou a que ela repete). */
  explicacao: PerguntaPropria;
  anterior?: number;
  proxima?: number;
}

const secao = { mt: "34px" } as const;
const tituloDeSecao = { ...fonteDeTitulo, fontSize: "1.18rem", mb: "12px" } as const;

/** Página de uma pergunta: cabeçalho, resposta de 30 s, blocos do método, armadilhas, autoteste e navegação. */
export function PerguntaView({ dados }: { dados: DadosDaPergunta }) {
  const { idioma, t } = usePreferencias();
  const { guiaId, numero, modulo, explicacao, repeteA } = dados;
  const conteudo = explicacao[idioma];
  const rotulo = rotuloDaPergunta(numero);
  const origem = modulo.letra ? `${t.modulo} ${modulo.letra} — ` : "";

  return (
    <Box component="article" sx={{ maxWidth: 860 }}>
      <header>
        <Typography sx={{ ...textoDeRotulo, fontSize: "0.76rem" }}>
          {rotulo} · {origem}
          {modulo.nome[idioma]}
        </Typography>
        <Typography component="h1" variant="h1" sx={{ m: "8px 0 16px" }}>
          {dados.textos[idioma].pergunta}
        </Typography>
        <Box
          sx={{
            ...cartao,
            display: "flex",
            gap: "10px 14px",
            alignItems: "flex-start",
            flexWrap: "wrap",
            p: "12px 14px",
          }}
        >
          <ChipDoMetodo metodo={explicacao.metodo} />
          <Typography variant="body2" sx={{ flex: "1 1 320px", minWidth: 0, color: "text.secondary" }}>
            <strong>{t.porqueEsteMetodo}.</strong> <Formatado texto={conteudo.porqueEsteMetodo} />
          </Typography>
        </Box>
        {repeteA && (
          <Destaque
            variante="chave"
            titulo={`${t.mesmaMateriaDa} ${rotuloDaPergunta(repeteA.numero)}`}
            texto={t.mesmaMateriaExplicacao.replace(
              "{q}",
              `${rotuloDaPergunta(repeteA.numero)} (${repeteA.titulo[idioma]})`,
            )}
          />
        )}
      </header>

      <Box
        component="section"
        aria-label={t.resposta30s}
        sx={{
          mt: "18px",
          p: "16px 18px",
          borderRadius: 1,
          border: 1,
          bgcolor: "tons.acentoSuave",
          borderColor: (tema) => misturar(paletaDe(tema).primary.main, 40, paletaDe(tema).divider),
        }}
      >
        <Rotulo>{t.resposta30s}</Rotulo>
        <Typography sx={{ fontSize: "1.04rem", maxWidth: "72ch" }}>
          <Formatado texto={conteudo.resposta30s} />
        </Typography>
      </Box>

      <Box component="section" sx={{ ...secao, display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "20px" }}>
        {conteudo.blocos.map((bloco, i) => (
          <div key={i}>
            <BlocoDaExplicacao bloco={bloco} />
          </div>
        ))}
      </Box>

      {conteudo.armadilhas.length > 0 && (
        <Box component="section" sx={secao}>
          <Typography component="h2" variant="h2" sx={tituloDeSecao}>
            {t.armadilhas}
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1 }}>
            {conteudo.armadilhas.map((armadilha) => (
              <Box
                key={armadilha}
                component="li"
                sx={{
                  ...cartao,
                  position: "relative",
                  p: "10px 14px 10px 40px",
                  fontSize: "0.94rem",
                  maxWidth: "76ch",
                  bgcolor: "tons.avisoSuave",
                  borderColor: (tema) => misturar(paletaDe(tema).warning.main, 35, paletaDe(tema).divider),
                  "&::before": {
                    content: '"!"',
                    position: "absolute",
                    left: 12,
                    top: 9,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    bgcolor: "warning.main",
                    color: "background.default",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: FAMILIA_MONO,
                  },
                }}
              >
                <Formatado texto={armadilha} />
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {conteudo.autoteste.length > 0 && (
        <Box component="section" sx={secao}>
          <Typography component="h2" variant="h2" sx={tituloDeSecao}>
            {t.testeSe}
          </Typography>
          <AutoTeste itens={conteudo.autoteste} />
        </Box>
      )}

      <Box component="section" sx={secao}>
        <Box sx={{ ...cartao, border: "1px dashed", borderColor: "primary.main", p: "15px 18px" }}>
          <Typography component="h2" variant="h2" sx={{ ...fonteDeTitulo, fontSize: "1.1rem", mb: "6px" }}>
            {t.ensineDeVolta}
          </Typography>
          <Typography sx={{ maxWidth: "70ch", fontSize: "0.97rem" }}>{t.ensineDeVoltaExplicacao}</Typography>
        </Box>
      </Box>

      <NavegacaoEntrePerguntas
        guiaId={guiaId}
        chaveDeProgresso={dados.chaveDeProgresso}
        anterior={dados.anterior}
        proxima={dados.proxima}
      />
    </Box>
  );
}
