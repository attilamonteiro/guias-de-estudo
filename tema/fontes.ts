// Fontes do Google carregadas no build (auto-hospedadas pelo next/font). Só app/layout.tsx importa daqui.
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--fonte-display" });
const corpo = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--fonte-corpo",
});
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap", variable: "--fonte-mono" });

export const CLASSES_DAS_FONTES = `${display.variable} ${corpo.variable} ${mono.variable}`;
