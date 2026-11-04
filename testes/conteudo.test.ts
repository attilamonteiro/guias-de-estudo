// Integridade do conteúdo de todos os guias: esquema, paridade PT/EN, repetições e marcação de texto.
import { describe, expect, it } from "vitest";
import { GUIAS } from "@/conteudo/guias";
import { METODOS, ORDEM_DOS_METODOS } from "@/conteudo/metodos";
import type { Bloco, ExplicacaoNoIdioma, Guia } from "@/conteudo/tipos";
import { ehRepetida } from "@/lib/guia";

/** Forma de um bloco: o tipo mais a quantidade de itens de cada lista. Deve ser igual em PT e EN. */
function formaDoBloco(bloco: Bloco): string {
  switch (bloco.tipo) {
    case "analogia":
    case "codigo":
    case "destaque":
      return bloco.tipo;
    case "porques":
      return `porques:${bloco.cadeia.length}:${bloco.causaRaiz ? "raiz" : "-"}`;
    case "tabela":
      return `tabela:${bloco.colunas.length}x${bloco.linhas.length}`;
    case "passos":
      return `passos:${bloco.passos.length}`;
    case "fluxo":
      return `fluxo:${bloco.etapas.length}`;
    case "pares":
      return `pares:${bloco.pares.length}`;
  }
}

/** Todo texto livre de uma explicação (onde `código` e **negrito** são interpretados). */
function textosFormatados(explicacao: ExplicacaoNoIdioma): string[] {
  const textos = [explicacao.porqueEsteMetodo, explicacao.resposta30s, ...explicacao.armadilhas];
  for (const item of explicacao.autoteste) textos.push(item.pergunta, item.resposta);
  for (const bloco of explicacao.blocos) {
    switch (bloco.tipo) {
      case "analogia":
        textos.push(bloco.simples, bloco.tecnico, bloco.limite);
        break;
      case "porques":
        bloco.cadeia.forEach((elo) => textos.push(elo.pergunta, elo.resposta));
        if (bloco.causaRaiz) textos.push(bloco.causaRaiz);
        break;
      case "tabela":
        textos.push(...bloco.colunas, ...bloco.linhas.flat());
        if (bloco.nota) textos.push(bloco.nota);
        break;
      case "passos":
        bloco.passos.forEach((p) => textos.push(p.titulo, p.texto));
        break;
      case "fluxo":
        textos.push(...bloco.etapas);
        if (bloco.nota) textos.push(bloco.nota);
        break;
      case "pares":
        textos.push(bloco.rotuloOrigem, bloco.rotuloDestino);
        bloco.pares.forEach((p) => textos.push(p.origem, p.destino));
        break;
      case "destaque":
        textos.push(bloco.texto);
        if (bloco.titulo) textos.push(bloco.titulo);
        break;
      case "codigo":
        if (bloco.nota) textos.push(bloco.nota);
        break;
    }
  }
  return textos;
}

function testarGuia(guia: Guia) {
  describe(`guia ${guia.id}`, () => {
    const numeros = guia.perguntas.map((p) => p.numero);
    const idsDeModulo = new Set(guia.modulos.map((m) => m.id));

    it("tem números únicos e em ordem crescente", () => {
      expect(new Set(numeros).size).toBe(numeros.length);
      expect(numeros).toEqual([...numeros].sort((a, b) => a - b));
    });

    it("só usa módulos declarados", () => {
      for (const pergunta of guia.perguntas)
        expect(idsDeModulo, `pergunta ${pergunta.numero}`).toContain(pergunta.modulo);
    });

    it("repetições apontam para uma pergunta própria da lista original", () => {
      for (const pergunta of guia.perguntas.filter(ehRepetida)) {
        const alvo = guia.perguntas.find((p) => p.numero === pergunta.repeteA);
        expect(alvo, `pergunta ${pergunta.numero}`).toBeDefined();
        expect(alvo && ehRepetida(alvo), `pergunta ${pergunta.numero} repete uma repetição`).toBe(false);
        expect(pergunta.repeteA).toBeLessThan(100);
      }
    });

    for (const pergunta of guia.perguntas) {
      it(`pergunta ${pergunta.numero}: títulos e enunciados nos dois idiomas`, () => {
        for (const idioma of ["pt", "en"] as const) {
          expect(pergunta[idioma].titulo.trim()).not.toBe("");
          expect(pergunta[idioma].pergunta.trim()).not.toBe("");
        }
      });

      if (ehRepetida(pergunta)) continue;

      it(`pergunta ${pergunta.numero}: explicação completa e igual em PT e EN`, () => {
        expect(ORDEM_DOS_METODOS).toContain(pergunta.metodo);
        const { pt, en } = pergunta;
        for (const explicacao of [pt, en]) {
          expect(explicacao.porqueEsteMetodo.trim()).not.toBe("");
          expect(explicacao.resposta30s.trim()).not.toBe("");
          expect(explicacao.blocos.length).toBeGreaterThan(0);
          expect(explicacao.armadilhas.length).toBeGreaterThanOrEqual(2);
          expect(explicacao.autoteste.length).toBeGreaterThanOrEqual(2);
        }
        expect(en.blocos.map(formaDoBloco)).toEqual(pt.blocos.map(formaDoBloco));
        expect(en.armadilhas).toHaveLength(pt.armadilhas.length);
        expect(en.autoteste).toHaveLength(pt.autoteste.length);
      });

      it(`pergunta ${pergunta.numero}: tabelas retangulares e marcação balanceada`, () => {
        for (const explicacao of [pergunta.pt, pergunta.en]) {
          for (const bloco of explicacao.blocos) {
            if (bloco.tipo === "tabela")
              for (const linha of bloco.linhas) expect(linha).toHaveLength(bloco.colunas.length);
          }
          for (const texto of textosFormatados(explicacao)) {
            expect(texto).not.toMatch(/undefined|\[object/);
            expect((texto.match(/`/g) ?? []).length % 2, `crases em: ${texto.slice(0, 60)}`).toBe(0);
            expect((texto.match(/\*\*/g) ?? []).length % 2, `negrito em: ${texto.slice(0, 60)}`).toBe(0);
          }
        }
      });
    }
  });
}

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
