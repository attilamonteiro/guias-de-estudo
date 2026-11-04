"use client";

// Idioma (compartilhado por todos os guias) e progresso (um por guia), guardados no navegador.
import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import type { Idioma } from "@/conteudo/tipos";
import { useValorPersistido } from "./armazenamento";
import {
  alternarFeito,
  lerProgresso,
  marcar,
  serializarProgresso,
  type EstadoDeEstudo,
  type Progresso,
} from "./progresso";
import { TEXTOS, type TextosDaInterface } from "./textos-da-interface";

const CHAVE_DO_IDIOMA = "guias:idioma";

interface Preferencias {
  idioma: Idioma;
  definirIdioma: (idioma: Idioma) => void;
  t: TextosDaInterface;
}

const Contexto = createContext<Preferencias | null>(null);

export function PreferenciasProvider({ children }: { children: ReactNode }) {
  const [bruto, gravar] = useValorPersistido(CHAVE_DO_IDIOMA);
  const idioma: Idioma = bruto === "en" ? "en" : "pt";

  useEffect(() => {
    document.documentElement.lang = idioma === "en" ? "en" : "pt-BR";
  }, [idioma]);

  const valor = useMemo<Preferencias>(() => ({ idioma, definirIdioma: gravar, t: TEXTOS[idioma] }), [idioma, gravar]);
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function usePreferencias(): Preferencias {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("usePreferencias fora de PreferenciasProvider");
  return valor;
}

export function useProgresso(guiaId: string) {
  const [bruto, gravar] = useValorPersistido(`guias:${guiaId}:progresso`);
  const progresso = useMemo<Progresso>(() => lerProgresso(bruto), [bruto]);
  return {
    progresso,
    alternarFeito: (chave: number) => gravar(serializarProgresso(alternarFeito(progresso, chave))),
    marcar: (chave: number, estado: EstadoDeEstudo) => gravar(serializarProgresso(marcar(progresso, chave, estado))),
    zerar: () => gravar(serializarProgresso({})),
  };
}
