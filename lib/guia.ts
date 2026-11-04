// Regras de leitura de um guia: números, repetições entre listas e a projeção leve usada pela interface.
import type {
  Fonte,
  Guia,
  IdMetodo,
  Modulo,
  Pergunta,
  PerguntaPropria,
  PerguntaRepetida,
  Traduzido,
} from "@/conteudo/tipos";

export function ehRepetida(pergunta: Pergunta): pergunta is PerguntaRepetida {
  return "repeteA" in pergunta;
}

/** Q01… na lista original, R01… no roadmap.sh (a partir de 101), M01… na MentorCruise (a partir de 201). */
export function rotuloDaPergunta(numero: number): string {
  const dois = (n: number) => String(n).padStart(2, "0");
  if (numero < 100) return `Q${dois(numero)}`;
  return numero < 200 ? `R${dois(numero - 100)}` : `M${dois(numero - 200)}`;
}

export function perguntaPorNumero(guia: Guia, numero: number): Pergunta | undefined {
  return guia.perguntas.find((pergunta) => pergunta.numero === numero);
}

/** A pergunta que carrega a explicação: ela mesma ou, se repetir outra, a outra. */
export function perguntaComExplicacao(guia: Guia, pergunta: Pergunta): PerguntaPropria {
  if (!ehRepetida(pergunta)) return pergunta;
  const alvo = perguntaPorNumero(guia, pergunta.repeteA);
  if (!alvo || ehRepetida(alvo))
    throw new Error(`Pergunta ${pergunta.numero} repete ${pergunta.repeteA}, que não tem explicação própria`);
  return alvo;
}

/** Perguntas repetidas compartilham o progresso da original. */
export function chaveDeProgresso(pergunta: Pergunta): number {
  return ehRepetida(pergunta) ? pergunta.repeteA : pergunta.numero;
}

export function perguntasDistintas(guia: Guia): PerguntaPropria[] {
  return guia.perguntas.filter((pergunta): pergunta is PerguntaPropria => !ehRepetida(pergunta));
}

export function vizinhasDe(guia: Guia, numero: number): { anterior?: Pergunta; proxima?: Pergunta } {
  const i = guia.perguntas.findIndex((pergunta) => pergunta.numero === numero);
  return { anterior: guia.perguntas[i - 1], proxima: guia.perguntas[i + 1] };
}

/* ---------- projeção leve ----------
 * Tudo o que o índice, os cartões e a busca precisam, sem os blocos de explicação.
 * É isto (e não o guia inteiro) que viaja ao navegador em toda página do guia. */

export interface ItemDoIndice {
  numero: number;
  modulo: string;
  metodo: IdMetodo;
  repeteA?: number;
  chaveDeProgresso: number;
  titulo: Traduzido<string>;
  pergunta: Traduzido<string>;
}

/** Módulo com o selo que o identifica nas listas (a letra própria ou a marca da fonte). */
export type ModuloNaVisao = Modulo & { marca: string };

export interface VisaoDoGuia {
  id: string;
  nome: Traduzido<string>;
  fontes: Fonte[];
  modulos: ModuloNaVisao[];
  itens: ItemDoIndice[];
  /** Quantidade de explicações distintas (as perguntas repetidas contam uma vez). */
  totalDistinto: number;
}

export function itensDoIndice(guia: Guia): ItemDoIndice[] {
  return guia.perguntas.map((pergunta) => ({
    numero: pergunta.numero,
    modulo: pergunta.modulo,
    metodo: perguntaComExplicacao(guia, pergunta).metodo,
    repeteA: ehRepetida(pergunta) ? pergunta.repeteA : undefined,
    chaveDeProgresso: chaveDeProgresso(pergunta),
    titulo: { pt: pergunta.pt.titulo, en: pergunta.en.titulo },
    pergunta: { pt: pergunta.pt.pergunta, en: pergunta.en.pergunta },
  }));
}

export function visaoDoGuia(guia: Guia): VisaoDoGuia {
  return {
    id: guia.id,
    nome: { pt: guia.textos.pt.nome, en: guia.textos.en.nome },
    fontes: guia.fontes,
    modulos: guia.modulos.map((modulo) => ({
      ...modulo,
      marca: modulo.letra || guia.fontes.find((fonte) => fonte.id === modulo.origem)?.marca || "",
    })),
    itens: itensDoIndice(guia),
    totalDistinto: perguntasDistintas(guia).length,
  };
}
