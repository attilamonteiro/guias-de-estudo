import type { Theme } from "@mui/material/styles";
import type { SystemStyleObject } from "@mui/system";
import { FAMILIA_DISPLAY, FAMILIA_MONO } from "./familias";

type Estilo = SystemStyleObject<Theme>;

/** Superfície com borda fina, a base de quase todo bloco do site. */
export const cartao: Estilo = {
  bgcolor: "background.paper",
  border: 1,
  borderColor: "divider",
  borderRadius: 1,
};

/** Texto pequeno em caixa-alta e fonte monoespaçada (rótulos e legendas). */
export const textoDeRotulo: Estilo = {
  fontFamily: FAMILIA_MONO,
  fontSize: "0.72rem",
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "text.secondary",
};

export const fonteDeTitulo: Estilo = { fontFamily: FAMILIA_DISPLAY };

/** Margem lateral mínima de 16px, respeitando as áreas seguras de celular. */
export const margemLateral: Estilo = {
  pl: "max(16px, env(safe-area-inset-left, 0px))",
  pr: "max(16px, env(safe-area-inset-right, 0px))",
};

export const LARGURA_MAXIMA = 1280;
export const ALTURA_DO_CABECALHO = 57;
