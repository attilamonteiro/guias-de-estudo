import { afterEach, describe, expect, it, vi } from "vitest";
import { encerrarNavegacao, estadoDaNavegacao, iniciarNavegacao } from "@/lib/navegacao";

afterEach(() => {
  encerrarNavegacao();
  vi.useRealTimers();
});

describe("estado da navegação", () => {
  it("liga com o destino e desliga ao encerrar", () => {
    expect(estadoDaNavegacao()).toEqual({ navegando: false, destino: "" });
    iniciarNavegacao("/nodejs/pergunta/41/");
    expect(estadoDaNavegacao()).toEqual({ navegando: true, destino: "/nodejs/pergunta/41/" });
    encerrarNavegacao();
    expect(estadoDaNavegacao()).toEqual({ navegando: false, destino: "" });
  });

  it("encerrar sem ter iniciado não troca o estado", () => {
    const antes = estadoDaNavegacao();
    encerrarNavegacao();
    expect(estadoDaNavegacao()).toBe(antes);
  });

  it("apaga sozinho quando o endereço nunca muda", () => {
    vi.useFakeTimers();
    iniciarNavegacao("/nodejs/resumo/");
    vi.advanceTimersByTime(9_999);
    expect(estadoDaNavegacao().navegando).toBe(true);
    vi.advanceTimersByTime(1);
    expect(estadoDaNavegacao().navegando).toBe(false);
  });

  it("uma navegação nova troca o destino e reinicia o limite", () => {
    vi.useFakeTimers();
    iniciarNavegacao("/nodejs/pergunta/1/");
    vi.advanceTimersByTime(6_000);
    iniciarNavegacao("/nodejs/pergunta/2/");
    vi.advanceTimersByTime(6_000);
    expect(estadoDaNavegacao()).toEqual({ navegando: true, destino: "/nodejs/pergunta/2/" });
    vi.advanceTimersByTime(4_000);
    expect(estadoDaNavegacao().navegando).toBe(false);
  });
});
