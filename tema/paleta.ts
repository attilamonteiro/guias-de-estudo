import type { IdMetodo } from "@/conteudo/tipos";

// Cores do site nos dois esquemas. O MUI gera as variáveis CSS e o navegador escolhe pelo esquema do sistema.
export interface Paleta {
  fundo: string;
  superficie: string;
  superficie2: string;
  texto: string;
  textoSuave: string;
  linha: string;
  acento: string;
  textoSobreAcento: string;
  acentoSuave: string;
  aviso: string;
  avisoSuave: string;
  sucesso: string;
  sucessoSuave: string;
  codigoFundo: string;
  codigoTexto: string;
  codigoMudo: string;
  metodos: Record<IdMetodo, string>;
}

export const PALETA_CLARA: Paleta = {
  fundo: "#f3f5f7",
  superficie: "#ffffff",
  superficie2: "#e9edf1",
  texto: "#14202b",
  textoSuave: "#566570",
  linha: "#d3dae1",
  acento: "#0b6b6b",
  textoSobreAcento: "#ffffff",
  acentoSuave: "#d6ecec",
  aviso: "#8f4705",
  avisoSuave: "#fbeed6",
  sucesso: "#17753a",
  sucessoSuave: "#dcf1e3",
  codigoFundo: "#0e1a23",
  codigoTexto: "#d5e3ee",
  codigoMudo: "#7f95a6",
  metodos: {
    feynman: "#2563eb",
    whys: "#c2410c",
    compare: "#0f766e",
    trace: "#7c3aed",
    playbook: "#4d7c0f",
    threat: "#c81e1e",
    firstprinciples: "#a16207",
    design: "#be185d",
  },
};

export const PALETA_ESCURA: Paleta = {
  fundo: "#0c141b",
  superficie: "#131e27",
  superficie2: "#1b2935",
  texto: "#e4edf3",
  textoSuave: "#9bb0bf",
  linha: "#263643",
  acento: "#4fd1c5",
  textoSobreAcento: "#06201f",
  acentoSuave: "#12302f",
  aviso: "#f5b45c",
  avisoSuave: "#2c2112",
  sucesso: "#6fd68f",
  sucessoSuave: "#12291a",
  codigoFundo: "#080f14",
  codigoTexto: "#d5e3ee",
  codigoMudo: "#7f95a6",
  metodos: {
    feynman: "#7fb0ff",
    whys: "#fb9a5a",
    compare: "#3dd6c4",
    trace: "#b79cff",
    playbook: "#a6e04f",
    threat: "#ff8484",
    firstprinciples: "#f0c24a",
    design: "#f58ab9",
  },
};
