import { describe, expect, it } from "vitest";
import { tokenizarTexto } from "@/lib/texto-formatado";

describe("tokenizarTexto", () => {
  it("separa texto, código e negrito", () => {
    expect(tokenizarTexto("Use `fs` e **cuidado** sempre")).toEqual([
      { tipo: "texto", valor: "Use " },
      { tipo: "codigo", valor: "fs" },
      { tipo: "texto", valor: " e " },
      { tipo: "negrito", valor: "cuidado" },
      { tipo: "texto", valor: " sempre" },
    ]);
  });

  it("aceita código dentro do negrito", () => {
    expect(tokenizarTexto("o **`node_modules`** local")).toEqual([
      { tipo: "texto", valor: "o " },
      { tipo: "negrito", valor: "`node_modules`" },
      { tipo: "texto", valor: " local" },
    ]);
  });

  it("aceita asterisco dentro do código que está dentro do negrito", () => {
    expect(tokenizarTexto("versões **`*Sync`** e streams")).toEqual([
      { tipo: "texto", valor: "versões " },
      { tipo: "negrito", valor: "`*Sync`" },
      { tipo: "texto", valor: " e streams" },
    ]);
  });

  it("não interpreta asteriscos dentro de código", () => {
    expect(tokenizarTexto("a `**b**` c")).toEqual([
      { tipo: "texto", valor: "a " },
      { tipo: "codigo", valor: "**b**" },
      { tipo: "texto", valor: " c" },
    ]);
  });

  it("devolve só texto quando não há marcação", () => {
    expect(tokenizarTexto("sem marcação")).toEqual([{ tipo: "texto", valor: "sem marcação" }]);
    expect(tokenizarTexto("")).toEqual([]);
  });
});
