import { describe, expect, it } from "vitest";
import {
  alternarFeito,
  contarFeitas,
  desmarcar,
  escolherParaOTreino,
  lerProgresso,
  marcar,
  serializarProgresso,
} from "@/lib/progresso";

describe("lerProgresso", () => {
  it("lê o formato gravado e ignora estados inválidos", () => {
    expect(lerProgresso('{"1":"feito","2":"revisar","3":"lixo"}')).toEqual({ 1: "feito", 2: "revisar" });
  });

  it("devolve vazio para nulo, texto inválido ou tipo errado", () => {
    expect(lerProgresso(null)).toEqual({});
    expect(lerProgresso("{quebrado")).toEqual({});
    expect(lerProgresso("[1,2]")).toEqual({});
    expect(lerProgresso("123")).toEqual({});
  });

  it("ida e volta pela serialização", () => {
    const progresso = marcar(marcar({}, 5, "feito"), 7, "revisar");
    expect(lerProgresso(serializarProgresso(progresso))).toEqual(progresso);
  });
});

describe("marcar e alternar", () => {
  it("alternarFeito marca e desmarca sem alterar o mapa original", () => {
    const vazio = {};
    const marcado = alternarFeito(vazio, 4);
    expect(marcado).toEqual({ 4: "feito" });
    expect(vazio).toEqual({});
    expect(alternarFeito(marcado, 4)).toEqual({});
  });

  it("alternarFeito sobre 'revisar' vira 'feito'", () => {
    expect(alternarFeito({ 4: "revisar" }, 4)).toEqual({ 4: "feito" });
  });

  it("desmarcar remove só a chave pedida", () => {
    expect(desmarcar({ 1: "feito", 2: "feito" }, 1)).toEqual({ 2: "feito" });
  });

  it("contarFeitas conta só as chaves informadas", () => {
    expect(contarFeitas({ 1: "feito", 2: "revisar", 3: "feito", 99: "feito" }, [1, 2, 3])).toBe(2);
  });
});

describe("escolherParaOTreino", () => {
  const chaves = [1, 2, 3, 4];

  it("devolve null quando tudo está feito", () => {
    expect(escolherParaOTreino(chaves, { 1: "feito", 2: "feito", 3: "feito", 4: "feito" }, null, () => 0)).toBeNull();
  });

  it("não repete a pergunta atual quando há outra pendente", () => {
    for (const sorteio of [0, 0.5, 0.99]) {
      expect(escolherParaOTreino(chaves, {}, 2, () => sorteio)).not.toBe(2);
    }
  });

  it("repete a atual se ela é a única pendente", () => {
    expect(escolherParaOTreino(chaves, { 1: "feito", 2: "feito", 4: "feito" }, 3, () => 0)).toBe(3);
  });

  it("prefere as marcadas para revisar quando o sorteio cai nos 60%", () => {
    const progresso = { 3: "revisar" } as const;
    expect(escolherParaOTreino(chaves, progresso, null, () => 0.1)).toBe(3);
  });

  it("ignora as marcadas para revisar quando o sorteio passa de 60%", () => {
    const progresso = { 3: "revisar" } as const;
    const sorteios = [0.7, 0]; // 1º decide revisar x pool; 2º escolhe o índice
    expect(escolherParaOTreino(chaves, progresso, null, () => sorteios.shift() ?? 0)).toBe(1);
  });
});
