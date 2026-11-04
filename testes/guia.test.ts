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

  it("nodejs: T para a Turing e L para o artigo do LinkedIn", () => {
    expect(rotuloDaPergunta(nodejs, 1)).toBe("T01");
    expect(rotuloDaPergunta(nodejs, 61)).toBe("T61");
    expect(rotuloDaPergunta(nodejs, 101)).toBe("L01");
    expect(rotuloDaPergunta(nodejs, 238)).toBe("L138");
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
  it("tem 199 perguntas (61 da Turing + 138 do LinkedIn), 95 repetidas e 104 explicações distintas", () => {
    const porModulo = (id: string) => nodejs.perguntas.filter((p) => p.modulo === id);
    expect(porModulo("turing-basicas")).toHaveLength(22);
    expect(porModulo("turing-intermediarias")).toHaveLength(18);
    expect(porModulo("turing-avancadas")).toHaveLength(21);
    const doLinkedin = nodejs.perguntas.filter((p) => p.modulo.startsWith("linkedin-"));
    expect(doLinkedin.map((p) => p.numero)).toEqual(Array.from({ length: 138 }, (_, i) => i + 101));
    expect(nodejs.perguntas).toHaveLength(199);
    expect(nodejs.perguntas.filter(ehRepetida)).toHaveLength(95);
    expect(perguntasDistintas(nodejs)).toHaveLength(104);
    expect(visaoDoGuia(nodejs).totalDistinto).toBe(104);
  });

  it("os módulos aparecem na ordem em que o guia os declara", () => {
    const ordem = nodejs.modulos.map((m) => m.id);
    const posicoes = nodejs.perguntas.map((p) => ordem.indexOf(p.modulo));
    expect(posicoes).toEqual([...posicoes].sort((a, b) => a - b));
  });

  it("a seção do LinkedIn tem as dez seções do artigo, com 20, 15, 20, 13, 12, 12, 16, 14, 10 e 6 perguntas", () => {
    const ids = nodejs.modulos.filter((m) => m.origem === "linkedin").map((m) => m.id);
    expect(ids).toHaveLength(10);
    expect(ids.map((id) => nodejs.perguntas.filter((p) => p.modulo === id).length)).toEqual([
      20, 15, 20, 13, 12, 12, 16, 14, 10, 6,
    ]);
  });
});
