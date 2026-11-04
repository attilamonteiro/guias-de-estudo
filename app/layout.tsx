import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { BarraDeNavegacao } from "@/componentes/casca/BarraDeNavegacao";
import { PreferenciasProvider } from "@/lib/preferencias";
import { CLASSES_DAS_FONTES } from "@/tema/fontes";
import { RegistroDoTema } from "@/tema/RegistroDoTema";

export const metadata: Metadata = {
  title: { default: "Guias de Estudo", template: "%s · Guias de Estudo" },
  description: "Guias de estudo com o método de explicação mais adequado a cada pergunta, em português e inglês.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#131e27" },
  ],
};

export default function LayoutRaiz({ children }: { children: ReactNode }) {
  return (
    // O idioma (lang) é ajustado no navegador conforme a preferência da pessoa.
    <html lang="pt-BR" className={CLASSES_DAS_FONTES} suppressHydrationWarning>
      <body>
        <RegistroDoTema>
          <PreferenciasProvider>
            <BarraDeNavegacao />
            {children}
          </PreferenciasProvider>
        </RegistroDoTema>
      </body>
    </html>
  );
}
