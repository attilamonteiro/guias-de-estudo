// Progresso de estudo: funções puras sobre um mapa chave-de-progresso → estado.
// A chave é a pergunta que carrega a explicação (ver chaveDeProgresso em lib/guia.ts).

export type EstadoDeEstudo = "feito" | "revisar";
export type Progresso = Record<number, EstadoDeEstudo>;

/** Lê o valor guardado; qualquer coisa fora do formato vira progresso vazio. */
export function lerProgresso(bruto: string | null): Progresso {
  if (!bruto) return {};
  try {
    const dados: unknown = JSON.parse(bruto);
    if (typeof dados !== "object" || dados === null) return {};
    const progresso: Progresso = {};
    for (const [chave, estado] of Object.entries(dados)) {
      if (estado === "feito" || estado === "revisar") progresso[Number(chave)] = estado;
    }
    return progresso;
  } catch {
    return {};
  }
}

export function serializarProgresso(progresso: Progresso): string {
  return JSON.stringify(progresso);
}

export function marcar(progresso: Progresso, chave: number, estado: EstadoDeEstudo): Progresso {
  return { ...progresso, [chave]: estado };
}

export function desmarcar(progresso: Progresso, chave: number): Progresso {
  const { [chave]: _removida, ...resto } = progresso;
  return resto;
}

export function alternarFeito(progresso: Progresso, chave: number): Progresso {
  return progresso[chave] === "feito" ? desmarcar(progresso, chave) : marcar(progresso, chave, "feito");
}

export function contarFeitas(progresso: Progresso, chaves: number[]): number {
  return chaves.filter((chave) => progresso[chave] === "feito").length;
}

const CHANCE_DE_REVISAR = 0.6;

/**
 * Sorteia a próxima pergunta do treino entre as que ainda não foram marcadas como feitas,
 * evitando repetir a atual e preferindo as marcadas "revisar" (60% das vezes).
 * Devolve null quando tudo está feito. `sorteio` devolve um número em [0, 1).
 */
export function escolherParaOTreino(
  chaves: number[],
  progresso: Progresso,
  atual: number | null,
  sorteio: () => number = Math.random,
): number | null {
  const pendentes = chaves.filter((chave) => progresso[chave] !== "feito");
  const semAtual = pendentes.filter((chave) => chave !== atual);
  const pool = semAtual.length ? semAtual : pendentes;
  if (!pool.length) return null;
  const revisar = pool.filter((chave) => progresso[chave] === "revisar");
  const fonte = revisar.length && sorteio() < CHANCE_DE_REVISAR ? revisar : pool;
  return fonte[Math.floor(sorteio() * fonte.length)];
}
