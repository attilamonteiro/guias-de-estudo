import { Fragment } from "react";

const MARCACOES = /(`[^`]+`|\*\*[^*]+\*\*)/g;

/** Texto com `código` e **negrito**, sem HTML bruto (o React escapa o resto). */
export function Formatado({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(MARCACOES).map((trecho, i) => {
        if (trecho.length > 2 && trecho.startsWith("`") && trecho.endsWith("`")) {
          return <code key={i}>{trecho.slice(1, -1)}</code>;
        }
        if (trecho.length > 4 && trecho.startsWith("**") && trecho.endsWith("**")) {
          return <strong key={i}>{trecho.slice(2, -2)}</strong>;
        }
        return <Fragment key={i}>{trecho}</Fragment>;
      })}
    </>
  );
}
