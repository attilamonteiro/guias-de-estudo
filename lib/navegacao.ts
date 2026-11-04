"use client";

// "Está navegando": liga no clique de um link interno (ou numa tecla de seta) e desliga quando o endereço muda.
// O React só troca de página quando a nova está pronta; este estado dá retorno imediato enquanto ela chega.
import { useEffect, useState, useSyncExternalStore } from "react";

/** Se o endereço nunca mudar (clique que não navegou), o aviso apaga sozinho. */
const LIMITE_DE_SEGURANCA_MS = 10_000;

export interface EstadoDaNavegacao {
  navegando: boolean;
  /** Caminho da página que está chegando (vazio quando parado). */
  destino: string;
}

const PARADO: EstadoDaNavegacao = { navegando: false, destino: "" };

let estado = PARADO;
let relogio: ReturnType<typeof setTimeout> | undefined;
const ouvintes = new Set<() => void>();

function definir(proximo: EstadoDaNavegacao): void {
  if (estado === proximo) return;
  estado = proximo;
  ouvintes.forEach((avisar) => avisar());
}

export function estadoDaNavegacao(): EstadoDaNavegacao {
  return estado;
}

export function iniciarNavegacao(destino: string): void {
  definir({ navegando: true, destino });
  clearTimeout(relogio);
  relogio = setTimeout(() => definir(PARADO), LIMITE_DE_SEGURANCA_MS);
}

export function encerrarNavegacao(): void {
  clearTimeout(relogio);
  definir(PARADO);
}

function assinar(avisar: () => void): () => void {
  ouvintes.add(avisar);
  return () => {
    ouvintes.delete(avisar);
  };
}

export function useNavegacao(): EstadoDaNavegacao {
  return useSyncExternalStore(
    assinar,
    () => estado,
    () => PARADO,
  );
}

/** Como `useNavegacao`, mais `visivel`: só vira verdadeiro depois de `atrasoMs` navegando, para a navegação rápida não piscar. */
export function useNavegacaoVisivel(atrasoMs: number): EstadoDaNavegacao & { visivel: boolean } {
  const atual = useNavegacao();
  const [passouOAtraso, setPassouOAtraso] = useState(false);

  useEffect(() => {
    if (!atual.navegando) return;
    const espera = setTimeout(() => setPassouOAtraso(true), atrasoMs);
    return () => {
      clearTimeout(espera);
      setPassouOAtraso(false);
    };
  }, [atual.navegando, atual.destino, atrasoMs]);

  return { ...atual, visivel: atual.navegando && passouOAtraso };
}
