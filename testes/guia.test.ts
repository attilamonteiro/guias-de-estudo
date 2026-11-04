import { describe, expect, it } from "vitest";
import { backend } from "@/conteudo/backend/guia";
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
  it("usa Q para a lista original e R para o roadmap.sh", () => {
    expect(rotuloDaPergunta(1)).toBe("Q01");
    expect(rotuloDaPergunta(30)).toBe("Q30");
    expect(rotuloDaPergunta(101)).toBe("R01");
    expect(rotuloDaPergunta(150)).toBe("R50");
  });
});

describe("guia de backend", () => {
  it("tem 80 perguntas, 11 repetidas e 69 explicações distintas", () => {
    expect(backend.perguntas).toHaveLength(80);
    expect(backend.perguntas.filter(ehRepetida)).toHaveLength(11);
    expect(perguntasDistintas(backend)).toHaveLength(69);
    expect(visaoDoGuia(backend).totalDistinto).toBe(69);
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
