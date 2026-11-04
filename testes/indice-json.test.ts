import { describe, expect, it } from "vitest";
import { GET, generateStaticParams } from "@/app/[guia]/indice.json/route";
import { GUIAS } from "@/conteudo/guias";
import { perguntasDistintas, resumoDoGuia, visaoDoGuia } from "@/lib/guia";

describe("índice do guia em arquivo próprio", () => {
  it("gera um indice.json por guia", () => {
    expect(generateStaticParams().map((p) => p.guia)).toEqual(GUIAS.map((guia) => guia.id));
  });

  it("o arquivo traz a visão completa do guia", async () => {
    for (const guia of GUIAS) {
      const resposta = await GET(new Request("http://localhost/"), { params: Promise.resolve({ guia: guia.id }) });
      expect(resposta.status, guia.id).toBe(200);
      const visao = await resposta.json();
      expect(visao.itens, guia.id).toHaveLength(guia.perguntas.length);
      expect(visao).toEqual(JSON.parse(JSON.stringify(visaoDoGuia(guia))));
    }
  });

  it("guia que não existe é 404", async () => {
    const resposta = await GET(new Request("http://localhost/"), { params: Promise.resolve({ guia: "nao-existe" }) });
    expect(resposta.status).toBe(404);
  });
});

describe("resumo que viaja em toda página do guia", () => {
  it("tem o total, o nome e as explicações distintas", () => {
    for (const guia of GUIAS) {
      const resumo = resumoDoGuia(guia);
      expect(resumo.id).toBe(guia.id);
      expect(resumo.total).toBe(guia.perguntas.length);
      expect(resumo.chaves).toEqual(perguntasDistintas(guia).map((p) => p.numero));
    }
  });

  it("continua pequeno: o índice inteiro não pode voltar para dentro de cada página", () => {
    for (const guia of GUIAS) {
      expect(JSON.stringify(resumoDoGuia(guia)).length, guia.id).toBeLessThan(4_000);
    }
  });
});
