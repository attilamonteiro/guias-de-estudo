import { createTheme, type Theme } from "@mui/material/styles";
import { paletaDe } from "./cores";
import { FAMILIA_CORPO, FAMILIA_DISPLAY } from "./familias";
import { PALETA_CLARA, PALETA_ESCURA, type Paleta } from "./paleta";

function esquemaDe(p: Paleta) {
  return {
    palette: {
      primary: { main: p.acento, contrastText: p.textoSobreAcento },
      warning: { main: p.aviso },
      success: { main: p.sucesso },
      background: { default: p.fundo, paper: p.superficie },
      text: { primary: p.texto, secondary: p.textoSuave },
      divider: p.linha,
      tons: {
        superficie2: p.superficie2,
        acentoSuave: p.acentoSuave,
        avisoSuave: p.avisoSuave,
        sucessoSuave: p.sucessoSuave,
      },
      codigo: { fundo: p.codigoFundo, texto: p.codigoTexto, mudo: p.codigoMudo },
      metodo: p.metodos,
    },
  };
}

const titulo = { fontFamily: FAMILIA_DISPLAY, fontWeight: 700, lineHeight: 1.18, textWrap: "balance" } as const;

export const tema = createTheme({
  // O navegador escolhe claro/escuro pelo esquema do sistema, sem script nem piscada.
  cssVariables: { colorSchemeSelector: "media" },
  colorSchemes: { light: esquemaDe(PALETA_CLARA), dark: esquemaDe(PALETA_ESCURA) },
  // Mesmos pontos de quebra do desenho original: 620 (celular), 900 (sem índice lateral), 1080 (analogia em 3 colunas).
  breakpoints: { values: { xs: 0, sm: 620, md: 900, lg: 1080, xl: 1536 } },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: FAMILIA_CORPO,
    h1: { ...titulo, fontSize: "clamp(1.55rem, 3.4vw, 2.2rem)", letterSpacing: "-0.015em" },
    h2: { ...titulo, fontSize: "1.5rem", letterSpacing: "-0.01em" },
    h3: { ...titulo, fontSize: "1.1rem" },
    h4: { ...titulo, fontSize: "1rem" },
    h5: { ...titulo, fontSize: "1rem" },
    h6: { ...titulo, fontSize: "1rem" },
    body1: { fontSize: "1rem", lineHeight: 1.65 },
    body2: { fontSize: "0.92rem", lineHeight: 1.6 },
    button: { textTransform: "none", fontWeight: 500 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (t: Theme) => {
        const p = paletaDe(t);
        return {
          body: { WebkitTextSizeAdjust: "100%" },
          a: { color: "inherit" },
          code: {
            fontFamily: "var(--fonte-mono), ui-monospace, Consolas, monospace",
            fontSize: "0.88em",
            backgroundColor: p.tons.superficie2,
            padding: "0.08em 0.35em",
            borderRadius: 4,
            // Nomes longos (AmbientCapabilities=CAP_NET_BIND_SERVICE) quebram em vez de abrir rolagem lateral no celular.
            overflowWrap: "anywhere",
          },
          strong: { fontWeight: 600 },
          ":focus-visible": { outline: `2px solid ${p.primary.main}`, outlineOffset: 2 },
          "@media (prefers-reduced-motion: reduce)": {
            "*": { transition: "none !important", animation: "none !important", scrollBehavior: "auto !important" },
          },
        };
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { lineHeight: 1.3, padding: "8px 14px" },
        outlined: ({ theme }) => {
          const p = paletaDe(theme);
          return {
            color: p.text.primary,
            borderColor: p.divider,
            backgroundColor: p.background.paper,
            "&:hover": { borderColor: p.primary.main, backgroundColor: p.background.paper },
          };
        },
      },
    },
  },
});
