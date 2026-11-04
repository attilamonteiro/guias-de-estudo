"use client";

// localStorage como fonte de verdade para o React (useSyncExternalStore).
// Se o navegador bloquear o armazenamento, o valor vive só em memória, durante a visita.
import { useCallback, useSyncExternalStore } from "react";

const memoria = new Map<string, string>();
const ouvintes = new Set<() => void>();

function lerBruto(chave: string): string | null {
  try {
    const valor = window.localStorage.getItem(chave);
    if (valor !== null) return valor;
  } catch {
    /* armazenamento indisponível */
  }
  return memoria.get(chave) ?? null;
}

function gravarBruto(chave: string, valor: string): void {
  memoria.set(chave, valor);
  try {
    window.localStorage.setItem(chave, valor);
  } catch {
    /* fica só em memória */
  }
  ouvintes.forEach((avisar) => avisar());
}

function assinar(avisar: () => void): () => void {
  ouvintes.add(avisar);
  window.addEventListener("storage", avisar);
  return () => {
    ouvintes.delete(avisar);
    window.removeEventListener("storage", avisar);
  };
}

/** Valor bruto de uma chave (null no servidor e antes de existir) e o gravador. */
export function useValorPersistido(chave: string): [string | null, (valor: string) => void] {
  const bruto = useSyncExternalStore(
    assinar,
    () => lerBruto(chave),
    () => null,
  );
  const gravar = useCallback((valor: string) => gravarBruto(chave, valor), [chave]);
  return [bruto, gravar];
}
