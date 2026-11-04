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
  it("usa Q para a lista original, R para o roadmap.sh e M para a MentorCruise", () => {
    expect(rotuloDaPergunta(1)).toBe("Q01");
    expect(rotuloDaPergunta(30)).toBe("Q30");
    expect(rotuloDaPergunta(101)).toBe("R01");
    expect(rotuloDaPergunta(150)).toBe("R50");
    expect(rotuloDaPergunta(201)).toBe("M01");
    expect(rotuloDaPergunta(240)).toBe("M40");
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
  it("tem 61 perguntas (22 + 18 + 21), 19 repetidas e 42 explicações distintas", () => {
    const porModulo = (id: string) => nodejs.perguntas.filter((p) => p.modulo === id);
    expect(porModulo("turing-basicas")).toHaveLength(22);
    expect(porModulo("turing-intermediarias")).toHaveLength(18);
    expect(porModulo("turing-avancadas")).toHaveLength(21);
    expect(nodejs.perguntas.map((p) => p.numero)).toEqual(Array.from({ length: 61 }, (_, i) => i + 1));
    expect(nodejs.perguntas.filter(ehRepetida)).toHaveLength(19);
    expect(perguntasDistintas(nodejs)).toHaveLength(42);
    expect(visaoDoGuia(nodejs).totalDistinto).toBe(42);
  });

  it("níveis em ordem: básicas antes das intermediárias antes das avançadas", () => {
    const nivel = { "turing-basicas": 0, "turing-intermediarias": 1, "turing-avancadas": 2 } as Record<string, number>;
    const niveis = nodejs.perguntas.map((p) => nivel[p.modulo]);
    expect(niveis).toEqual([...niveis].sort((a, b) => a - b));
  });
});
