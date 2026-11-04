import { describe, expect, it } from "vitest";
import { backend } from "@/conteudo/backend/guia";
import { nodejs } from "@/conteudo/nodejs/guia";
import {
  chaveDeProgresso,
  ehRepetida,
  itensDoIndice,
  perguntaComExplicacao,
  perguntaPorNumero,
  perguntasDistintas,
  rotuloDaPergunta,
  vizinhasDe,
  visaoDoGuia,
} from "@/lib/guia";

describe("rotuloDaPergunta", () => {
  it("backend: Q para a lista original, R para o roadmap.sh e M para a MentorCruise", () => {
    expect(rotuloDaPergunta(backend, 1)).toBe("Q01");
    expect(rotuloDaPergunta(backend, 30)).toBe("Q30");
    expect(rotuloDaPergunta(backend, 101)).toBe("R01");
    expect(rotuloDaPergunta(backend, 150)).toBe("R50");
    expect(rotuloDaPergunta(backend, 201)).toBe("M01");
    expect(rotuloDaPergunta(backend, 240)).toBe("M40");
  });

  it("nodejs: T (Turing), L (LinkedIn), D (devinterview.io), F (Found It) e C (CoderPad)", () => {
    expect(rotuloDaPergunta(nodejs, 1)).toBe("T01");
    expect(rotuloDaPergunta(nodejs, 61)).toBe("T61");
    expect(rotuloDaPergunta(nodejs, 101)).toBe("L01");
    expect(rotuloDaPergunta(nodejs, 238)).toBe("L138");
    expect(rotuloDaPergunta(nodejs, 301)).toBe("D01");
    expect(rotuloDaPergunta(nodejs, 400)).toBe("D100");
    expect(rotuloDaPergunta(nodejs, 401)).toBe("F01");
    expect(rotuloDaPergunta(nodejs, 500)).toBe("F100");
    expect(rotuloDaPergunta(nodejs, 501)).toBe("C01");
    expect(rotuloDaPergunta(nodejs, 529)).toBe("C29");
  });

  it("os rótulos são únicos dentro de cada guia", () => {
    for (const guia of [backend, nodejs]) {
      const rotulos = guia.perguntas.map((p) => rotuloDaPergunta(guia, p.numero));
      expect(new Set(rotulos).size, guia.id).toBe(rotulos.length);
    }
  });
});

describe("guia de backend", () => {
  it("tem 120 perguntas (30 + 50 + 40), 26 repetidas e 94 explicações distintas", () => {
    const porFonte = (de: number, ate: number) => backend.perguntas.filter((p) => p.numero >= de && p.numero <= ate);
    expect(porFonte(1, 99)).toHaveLength(30);
    expect(porFonte(101, 199)).toHaveLength(50);
    expect(porFonte(201, 299)).toHaveLength(40);
    expect(backend.perguntas).toHaveLength(120);
    expect(backend.perguntas.filter(ehRepetida)).toHaveLength(26);
    expect(perguntasDistintas(backend)).toHaveLength(94);
    expect(visaoDoGuia(backend).totalDistinto).toBe(94);
  });

  it("pergunta repetida mostra a explicação da original e divide o progresso", () => {
    const repetida = backend.perguntas.find(ehRepetida);
    expect(repetida).toBeDefined();
    if (!repetida) return;
    const explicacao = perguntaComExplicacao(backend, repetida);
    expect(explicacao.numero).toBe(repetida.repeteA);
    expect(chaveDeProgresso(repetida)).toBe(repetida.repeteA);
    expect(chaveDeProgresso(explicacao)).toBe(explicacao.numero);
  });

  it("a projeção do índice herda o método da original", () => {
    for (const item of itensDoIndice(backend)) {
      const pergunta = perguntaPorNumero(backend, item.numero);
      expect(pergunta).toBeDefined();
      if (pergunta) expect(item.metodo).toBe(perguntaComExplicacao(backend, pergunta).metodo);
    }
  });

  it("vizinhas: primeira não tem anterior e última não tem próxima", () => {
    const numeros = backend.perguntas.map((p) => p.numero);
    expect(vizinhasDe(backend, numeros[0]).anterior).toBeUndefined();
    expect(vizinhasDe(backend, numeros[0]).proxima?.numero).toBe(numeros[1]);
    expect(vizinhasDe(backend, numeros[numeros.length - 1]).proxima).toBeUndefined();
  });
});

describe("guia de Node.js", () => {
  const doGuia = (prefixo: string) => nodejs.perguntas.filter((p) => p.modulo.startsWith(prefixo));
  const faixa = (de: number, quantas: number) => Array.from({ length: quantas }, (_, i) => i + de);
  const tamanhos = (origem: string) =>
    nodejs.modulos
      .filter((m) => m.origem === origem)
      .map((m) => nodejs.perguntas.filter((p) => p.modulo === m.id).length);

  it("tem 428 perguntas de cinco fontes, 271 repetidas e 157 explicações distintas", () => {
    const porModulo = (id: string) => nodejs.perguntas.filter((p) => p.modulo === id);
    expect(porModulo("turing-basicas")).toHaveLength(22);
    expect(porModulo("turing-intermediarias")).toHaveLength(18);
    expect(porModulo("turing-avancadas")).toHaveLength(21);
    expect(doGuia("linkedin-").map((p) => p.numero)).toEqual(faixa(101, 138));
    expect(doGuia("devinterview-").map((p) => p.numero)).toEqual(faixa(301, 100));
    expect(doGuia("founditgulf-").map((p) => p.numero)).toEqual(faixa(401, 100));
    expect(doGuia("coderpad-").map((p) => p.numero)).toEqual(faixa(501, 29));
    expect(nodejs.perguntas).toHaveLength(428);
    expect(nodejs.perguntas.filter(ehRepetida)).toHaveLength(271);
    expect(perguntasDistintas(nodejs)).toHaveLength(157);
    expect(visaoDoGuia(nodejs).totalDistinto).toBe(157);
  });

  it("os módulos aparecem na ordem em que o guia os declara", () => {
    const ordem = nodejs.modulos.map((m) => m.id);
    const posicoes = nodejs.perguntas.map((p) => ordem.indexOf(p.modulo));
    expect(posicoes).toEqual([...posicoes].sort((a, b) => a - b));
  });

  it("a seção do LinkedIn tem as dez seções do artigo, com 20, 15, 20, 13, 12, 12, 16, 14, 10 e 6 perguntas", () => {
    expect(tamanhos("linkedin")).toEqual([20, 15, 20, 13, 12, 12, 16, 14, 10, 6]);
  });

  it("as seções das fontes novas seguem a ordem das listas originais", () => {
    expect(tamanhos("devinterview")).toEqual([10, 9, 5, 10, 7, 9, 10, 9, 8, 13, 10]);
    expect(tamanhos("founditgulf")).toEqual([25, 25, 25, 10, 5, 10]);
    expect(tamanhos("coderpad")).toEqual([10, 9, 10]);
  });

  it("o CoderPad responde sem bloco de código: a explicação própria dele (C25) não tem nenhum", () => {
    const util = nodejs.perguntas.find((p) => p.numero === 525);
    expect(util).toBeDefined();
    if (!util || ehRepetida(util)) return;
    for (const lingua of [util.pt, util.en]) {
      expect(lingua.blocos.filter((b) => b.tipo === "codigo")).toHaveLength(0);
    }
  });
});
