// Integridade do conteúdo de todos os guias: esquema, paridade PT/EN, repetições e marcação de texto.
// As regras de cada pergunta ficam em lib/conferir-conteudo.ts (as mesmas de scripts/conferir-perguntas.mts).
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { GUIAS } from "@/conteudo/guias";
import { METODOS, ORDEM_DOS_METODOS } from "@/conteudo/metodos";
import type { Guia } from "@/conteudo/tipos";
import { problemasDaPergunta } from "@/lib/conferir-conteudo";
import { ehRepetida } from "@/lib/guia";

function testarGuia(guia: Guia) {
  describe(`guia ${guia.id}`, () => {
    const numeros = guia.perguntas.map((p) => p.numero);
    const idsDeModulo = new Set(guia.modulos.map((m) => m.id));
    const idsDeFonte = new Set(guia.fontes.map((f) => f.id));

    it("tem números únicos e em ordem crescente", () => {
      expect(new Set(numeros).size).toBe(numeros.length);
      expect(numeros).toEqual([...numeros].sort((a, b) => a - b));
    });

    it("todo módulo pertence a uma fonte declarada e todo módulo tem perguntas", () => {
      for (const modulo of guia.modulos) {
        expect(idsDeFonte, `módulo ${modulo.id}`).toContain(modulo.origem);
        expect(
          guia.perguntas.some((p) => p.modulo === modulo.id),
          `módulo ${modulo.id} sem perguntas`,
        ).toBe(true);
      }
    });

    it("só usa módulos declarados", () => {
      for (const pergunta of guia.perguntas)
        expect(idsDeModulo, `pergunta ${pergunta.numero}`).toContain(pergunta.modulo);
    });

    it("repetições apontam para uma pergunta com explicação própria", () => {
      for (const pergunta of guia.perguntas.filter(ehRepetida)) {
        const alvo = guia.perguntas.find((p) => p.numero === pergunta.repeteA);
        expect(alvo, `pergunta ${pergunta.numero}`).toBeDefined();
        expect(alvo && ehRepetida(alvo), `pergunta ${pergunta.numero} repete uma repetição`).toBe(false);
      }
    });

    it("usa só métodos conhecidos", () => {
      for (const pergunta of guia.perguntas) {
        if (!ehRepetida(pergunta)) expect(ORDEM_DOS_METODOS, `pergunta ${pergunta.numero}`).toContain(pergunta.metodo);
      }
    });

    for (const pergunta of guia.perguntas) {
      it(`pergunta ${pergunta.numero}: sem problemas de conteúdo`, () => {
        expect(problemasDaPergunta(pergunta)).toEqual([]);
      });
    }
  });
}

describe("arquivos de perguntas", () => {
  it("todo arquivo da pasta está registrado em perguntas/index.ts", () => {
    const pasta = join(process.cwd(), "conteudo", "backend", "perguntas");
    const indice = readFileSync(join(pasta, "index.ts"), "utf8");
    const arquivos = readdirSync(pasta).filter((nome) => nome.endsWith(".ts") && nome !== "index.ts");
    const fora = arquivos.filter((nome) => !indice.includes(`"./${nome.replace(/\.ts$/, "")}"`));
    expect(fora).toEqual([]);
  });
});

describe("métodos", () => {
  it("todo método tem texto nos dois idiomas", () => {
    for (const id of ORDEM_DOS_METODOS) {
      for (const idioma of ["pt", "en"] as const) {
        const metodo = METODOS[id][idioma];
        expect(metodo.nome && metodo.resumo && metodo.fluxo && metodo.quandoUsar).toBeTruthy();
      }
    }
  });
});

GUIAS.forEach(testarGuia);
