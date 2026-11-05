import { describe, expect, it } from "vitest";
import { backend } from "@/conteudo/backend/guia";
import { iam } from "@/conteudo/iam/guia";
import { nodejs } from "@/conteudo/nodejs/guia";
import { react } from "@/conteudo/react/guia";
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
    expect(rotuloDaPergunta(nodejs, 601)).toBe("G01");
    expect(rotuloDaPergunta(nodejs, 691)).toBe("G91");
    expect(rotuloDaPergunta(nodejs, 701)).toBe("P01");
    expect(rotuloDaPergunta(nodejs, 800)).toBe("P100");
  });

  it("react: L (LinkedIn), G (Glassdoor), P (pedrincandido), C (Coddy), S (Simplilearn) e M (Medium)", () => {
    expect(rotuloDaPergunta(react, 1)).toBe("L01");
    expect(rotuloDaPergunta(react, 221)).toBe("L221");
    expect(rotuloDaPergunta(react, 301)).toBe("G01");
    expect(rotuloDaPergunta(react, 344)).toBe("G44");
    expect(rotuloDaPergunta(react, 401)).toBe("P01");
    expect(rotuloDaPergunta(react, 418)).toBe("P18");
    expect(rotuloDaPergunta(react, 501)).toBe("C01");
    expect(rotuloDaPergunta(react, 533)).toBe("C33");
    expect(rotuloDaPergunta(react, 601)).toBe("S01");
    expect(rotuloDaPergunta(react, 697)).toBe("S97");
    expect(rotuloDaPergunta(react, 701)).toBe("M01");
    expect(rotuloDaPergunta(react, 748)).toBe("M48");
  });

  it("iam: Q (lista do guia) e P, H, T, R, C, S, D, V, G, I, W (fontes)", () => {
    expect(rotuloDaPergunta(iam, 1)).toBe("Q01");
    expect(rotuloDaPergunta(iam, 146)).toBe("Q146");
    expect(rotuloDaPergunta(iam, 201)).toBe("P01");
    expect(rotuloDaPergunta(iam, 238)).toBe("P38");
    expect(rotuloDaPergunta(iam, 301)).toBe("H01");
    expect(rotuloDaPergunta(iam, 401)).toBe("T01");
    expect(rotuloDaPergunta(iam, 501)).toBe("R01");
    expect(rotuloDaPergunta(iam, 601)).toBe("C01");
    expect(rotuloDaPergunta(iam, 701)).toBe("S01");
    expect(rotuloDaPergunta(iam, 759)).toBe("S59");
    expect(rotuloDaPergunta(iam, 801)).toBe("D01");
    expect(rotuloDaPergunta(iam, 855)).toBe("D55");
    expect(rotuloDaPergunta(iam, 901)).toBe("V01");
    expect(rotuloDaPergunta(iam, 1001)).toBe("G01");
    expect(rotuloDaPergunta(iam, 1101)).toBe("I01");
    expect(rotuloDaPergunta(iam, 1201)).toBe("W01");
    expect(rotuloDaPergunta(iam, 1300)).toBe("W100");
  });

  it("os rótulos são únicos dentro de cada guia", () => {
    for (const guia of [backend, nodejs, react, iam]) {
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

  it("tem 619 perguntas de sete fontes, 417 repetidas e 202 explicações distintas", () => {
    const porModulo = (id: string) => nodejs.perguntas.filter((p) => p.modulo === id);
    expect(porModulo("turing-basicas")).toHaveLength(22);
    expect(porModulo("turing-intermediarias")).toHaveLength(18);
    expect(porModulo("turing-avancadas")).toHaveLength(21);
    expect(doGuia("linkedin-").map((p) => p.numero)).toEqual(faixa(101, 138));
    expect(doGuia("devinterview-").map((p) => p.numero)).toEqual(faixa(301, 100));
    expect(doGuia("founditgulf-").map((p) => p.numero)).toEqual(faixa(401, 100));
    expect(doGuia("coderpad-").map((p) => p.numero)).toEqual(faixa(501, 29));
    expect(doGuia("gist-").map((p) => p.numero)).toEqual(faixa(601, 91));
    expect(doGuia("pawanmkr-").map((p) => p.numero)).toEqual(faixa(701, 100));
    expect(nodejs.perguntas).toHaveLength(619);
    expect(nodejs.perguntas.filter(ehRepetida)).toHaveLength(417);
    expect(perguntasDistintas(nodejs)).toHaveLength(202);
    expect(visaoDoGuia(nodejs).totalDistinto).toBe(202);
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
    expect(tamanhos("gist")).toEqual([20, 20, 28, 20, 3]);
    expect(tamanhos("pawanmkr")).toEqual([12, 9, 9, 7, 6, 7, 5, 11, 6, 6, 11, 11]);
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

describe("guia de IAM", () => {
  const doGuia = (origem: string) => iam.perguntas.filter((p) => p.modulo.startsWith(origem + "-"));
  const faixa = (de: number, quantas: number) => Array.from({ length: quantas }, (_, i) => i + de);
  const tamanhos = (origem: string) =>
    iam.modulos.filter((m) => m.origem === origem).map((m) => iam.perguntas.filter((p) => p.modulo === m.id).length);

  it("tem 542 perguntas: 146 da lista do guia e 396 de onze fontes, todas apontando para uma explicação da lista", () => {
    expect(iam.perguntas.filter((p) => p.numero <= 146)).toHaveLength(146);
    expect(doGuia("pomerium").map((p) => p.numero)).toEqual(faixa(201, 38));
    expect(doGuia("hyring").map((p) => p.numero)).toEqual(faixa(301, 28));
    expect(doGuia("techtarget").map((p) => p.numero)).toEqual(faixa(401, 15));
    expect(doGuia("prachub").map((p) => p.numero)).toEqual(faixa(501, 19));
    expect(doGuia("climbtheladder").map((p) => p.numero)).toEqual(faixa(601, 45));
    expect(doGuia("securityscientist").map((p) => p.numero)).toEqual(faixa(701, 59));
    expect(doGuia("secondtalent").map((p) => p.numero)).toEqual(faixa(801, 55));
    expect(doGuia("javainuse").map((p) => p.numero)).toEqual(faixa(901, 5));
    expect(doGuia("javaguides").map((p) => p.numero)).toEqual(faixa(1001, 9));
    expect(doGuia("interviewprep").map((p) => p.numero)).toEqual(faixa(1101, 23));
    expect(doGuia("wecreateproblems").map((p) => p.numero)).toEqual(faixa(1201, 100));
    expect(iam.perguntas).toHaveLength(542);
    expect(iam.perguntas.filter(ehRepetida)).toHaveLength(396);
    expect(perguntasDistintas(iam)).toHaveLength(146);
    expect(visaoDoGuia(iam).totalDistinto).toBe(146);
    for (const pergunta of iam.perguntas.filter(ehRepetida)) {
      expect(pergunta.repeteA, `pergunta ${pergunta.numero}`).toBeGreaterThanOrEqual(1);
      expect(pergunta.repeteA, `pergunta ${pergunta.numero}`).toBeLessThanOrEqual(146);
    }
  });

  it("a lista do guia tem os oito módulos A a H, com 21, 21, 12, 14, 16, 18, 22 e 22 perguntas", () => {
    expect(iam.modulos.filter((m) => m.origem === "lista").map((m) => m.letra)).toEqual([..."ABCDEFGH"]);
    expect(tamanhos("lista")).toEqual([21, 21, 12, 14, 16, 18, 22, 22]);
  });

  it("os módulos aparecem na ordem em que o guia os declara", () => {
    const ordem = iam.modulos.map((m) => m.id);
    const posicoes = iam.perguntas.map((p) => ordem.indexOf(p.modulo));
    expect(posicoes).toEqual([...posicoes].sort((a, b) => a - b));
  });

  it("as seções de cada fonte seguem a ordem das listas originais", () => {
    expect(tamanhos("pomerium")).toEqual([11, 8, 7, 12]);
    expect(tamanhos("hyring")).toEqual([15, 6, 7]);
    expect(tamanhos("techtarget")).toEqual([8, 7]);
    expect(tamanhos("prachub")).toEqual([3, 5, 4, 4, 3]);
    expect(tamanhos("climbtheladder")).toEqual([15, 10, 10, 10]);
    expect(tamanhos("securityscientist")).toEqual([12, 12, 12, 11, 12]);
    expect(tamanhos("secondtalent")).toEqual([6, 6, 6, 5, 3, 4, 6, 5, 5, 4, 5]);
    expect(tamanhos("wecreateproblems")).toEqual([37, 35, 28]);
  });
});

describe("guia de React", () => {
  const doGuia = (origem: string) => react.perguntas.filter((p) => p.modulo.startsWith(origem + "-"));
  const faixa = (de: number, quantas: number) => Array.from({ length: quantas }, (_, i) => i + de);
  const tamanhos = (origem: string) =>
    react.modulos
      .filter((m) => m.origem === origem)
      .map((m) => react.perguntas.filter((p) => p.modulo === m.id).length);

  it("tem 461 perguntas de seis fontes, 297 repetidas e 164 explicações distintas", () => {
    expect(doGuia("linkedin").map((p) => p.numero)).toEqual(faixa(1, 221));
    expect(doGuia("glassdoor").map((p) => p.numero)).toEqual(faixa(301, 44));
    expect(doGuia("pedrincandido").map((p) => p.numero)).toEqual(faixa(401, 18));
    expect(doGuia("coddy").map((p) => p.numero)).toEqual(faixa(501, 33));
    expect(doGuia("simplilearn").map((p) => p.numero)).toEqual(faixa(601, 97));
    expect(doGuia("medium").map((p) => p.numero)).toEqual(faixa(701, 48));
    expect(react.perguntas).toHaveLength(461);
    expect(react.perguntas.filter(ehRepetida)).toHaveLength(297);
    expect(perguntasDistintas(react)).toHaveLength(164);
    expect(visaoDoGuia(react).totalDistinto).toBe(164);
  });

  it("os módulos aparecem na ordem em que o guia os declara", () => {
    const ordem = react.modulos.map((m) => m.id);
    const posicoes = react.perguntas.map((p) => ordem.indexOf(p.modulo));
    expect(posicoes).toEqual([...posicoes].sort((a, b) => a - b));
  });

  it("as seções de cada fonte seguem a ordem das listas originais", () => {
    expect(tamanhos("linkedin")).toEqual([20, 20, 20, 15, 20, 20, 10, 15, 14, 16, 15, 14, 15, 7]);
    expect(tamanhos("glassdoor")).toEqual([30, 7, 7]);
    expect(tamanhos("pedrincandido")).toEqual([18]);
    expect(tamanhos("coddy")).toEqual([10, 12, 11]);
    expect(tamanhos("simplilearn")).toEqual([6, 9, 9, 4, 8, 9, 3, 6, 15, 7, 6, 8, 7]);
    expect(tamanhos("medium")).toEqual([24, 24]);
  });
});
