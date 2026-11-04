import { Fragment } from "react";
import { tokenizarTexto } from "@/lib/texto-formatado";

/** Texto com `código` e **negrito** (que pode conter código), sem HTML bruto: o React escapa o resto. */
export function Formatado({ texto }: { texto: string }) {
  return (
    <>
      {tokenizarTexto(texto).map((trecho, i) => {
        if (trecho.tipo === "codigo") return <code key={i}>{trecho.valor}</code>;
        if (trecho.tipo === "negrito") {
          return (
            <strong key={i}>
              <Formatado texto={trecho.valor} />
            </strong>
          );
        }
        return <Fragment key={i}>{trecho.valor}</Fragment>;
      })}
    </>
  );
}
