import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { BlocoDestaque } from "@/conteudo/tipos";
import { misturar, paletaDe } from "@/tema/cores";
import { cartao, fonteDeTitulo } from "@/tema/estilos";
import { Formatado } from "../base/Formatado";

type Variante = NonNullable<BlocoDestaque["variante"]>;

/** Caixa de ênfase: dica (neutra), aviso (âmbar) e chave (regra central, na cor de destaque). */
export function Destaque({
  variante = "dica",
  titulo,
  texto,
}: {
  variante?: Variante;
  titulo?: string;
  texto: string;
}) {
  return (
    <Box
      component="aside"
      sx={{
        ...cartao,
        mt: "14px",
        px: "15px",
        py: "12px",
        ...(variante === "aviso" && {
          bgcolor: "tons.avisoSuave",
          borderColor: (tema) => misturar(paletaDe(tema).warning.main, 45, paletaDe(tema).divider),
        }),
        ...(variante === "chave" && {
          bgcolor: "tons.acentoSuave",
          borderColor: (tema) => misturar(paletaDe(tema).primary.main, 40, paletaDe(tema).divider),
        }),
      }}
    >
      {titulo && (
        <Typography component="strong" sx={{ ...fonteDeTitulo, display: "block", fontWeight: 600 }}>
          <Formatado texto={titulo} />
        </Typography>
      )}
      <Typography sx={{ fontSize: "0.94rem", maxWidth: "72ch" }}>
        <Formatado texto={texto} />
      </Typography>
    </Box>
  );
}

/** Versão para o bloco de conteúdo (usa os campos do tipo). */
export function BlocoDeDestaque({ bloco }: { bloco: BlocoDestaque }) {
  return <Destaque variante={bloco.variante} titulo={bloco.titulo} texto={bloco.texto} />;
}
