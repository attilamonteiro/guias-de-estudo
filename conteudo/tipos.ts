// Esquema do conteúdo dos guias. Os dados puros ficam em conteudo/<guia>/; nada aqui conhece React.

export type Idioma = "pt" | "en";

/** Um mesmo texto nos dois idiomas. */
export type Traduzido<T> = Record<Idioma, T>;

export type IdMetodo = "feynman" | "whys" | "compare" | "trace" | "playbook" | "threat" | "firstprinciples" | "design";

export interface Metodo {
  nome: string;
  /** Em que consiste o método. */
  resumo: string;
  /** Sequência de passos, em uma linha. */
  fluxo: string;
  /** Tipo de pergunta em que ele entra. */
  quandoUsar: string;
}

/* ---------- blocos de uma explicação ----------
 * Texto livre aceita `código` e **negrito** (ver lib/texto-formatado). */

export interface BlocoAnalogia {
  tipo: "analogia";
  simples: string;
  tecnico: string;
  limite: string;
}

export interface BlocoPorques {
  tipo: "porques";
  cadeia: { pergunta: string; resposta: string }[];
  causaRaiz?: string;
}

export interface BlocoTabela {
  tipo: "tabela";
  titulo?: string;
  colunas: string[];
  /** A primeira célula de cada linha é o cabeçalho da linha. */
  linhas: string[][];
  nota?: string;
}

export interface BlocoPassos {
  tipo: "passos";
  titulo?: string;
  passos: { titulo: string; texto: string }[];
}

export interface BlocoFluxo {
  tipo: "fluxo";
  titulo?: string;
  etapas: string[];
  nota?: string;
}

export interface BlocoPares {
  tipo: "pares";
  titulo?: string;
  rotuloOrigem: string;
  rotuloDestino: string;
  pares: { origem: string; destino: string }[];
}

export interface BlocoCodigo {
  tipo: "codigo";
  titulo?: string;
  /** Rótulo no topo do bloco (linguagem ou nome do arquivo). */
  legenda?: string;
  codigo: string;
  nota?: string;
}

export interface BlocoDestaque {
  tipo: "destaque";
  /** dica (padrão), aviso ou chave (regra central). */
  variante?: "dica" | "aviso" | "chave";
  titulo?: string;
  texto: string;
}

export type Bloco =
  BlocoAnalogia | BlocoPorques | BlocoTabela | BlocoPassos | BlocoFluxo | BlocoPares | BlocoCodigo | BlocoDestaque;

/* ---------- perguntas ---------- */

export interface ExplicacaoNoIdioma {
  /** Rótulo curto, usado no índice e nos cartões. */
  titulo: string;
  /** A pergunta como numa entrevista. */
  pergunta: string;
  porqueEsteMetodo: string;
  /** Resposta que cabe em 30 segundos. */
  resposta30s: string;
  blocos: Bloco[];
  armadilhas: string[];
  autoteste: { pergunta: string; resposta: string }[];
}

/** Pergunta com explicação própria. */
export interface PerguntaPropria {
  /** Número estável, usado no endereço e no progresso. Cada fonte tem a sua faixa: `Fonte.base + posição na fonte`. */
  numero: number;
  modulo: string;
  metodo: IdMetodo;
  pt: ExplicacaoNoIdioma;
  en: ExplicacaoNoIdioma;
}

/** Pergunta que pede o mesmo conteúdo de outra: mostra a explicação da outra e conta o progresso uma vez. */
export interface PerguntaRepetida {
  numero: number;
  modulo: string;
  repeteA: number;
  pt: Pick<ExplicacaoNoIdioma, "titulo" | "pergunta">;
  en: Pick<ExplicacaoNoIdioma, "titulo" | "pergunta">;
}

export type Pergunta = PerguntaPropria | PerguntaRepetida;

/* ---------- guia ---------- */

/** De onde vem um conjunto de perguntas. Cada fonte vira uma seção da página de abertura do guia. */
export interface Fonte {
  id: string;
  /** Letra do selo dos rótulos (Q01, R01, T01…) e dos módulos desta fonte que não têm letra própria. */
  marca: string;
  /** Número anterior ao da primeira pergunta da fonte: o rótulo é `marca` + (número − base), com 2 dígitos. */
  base: number;
  titulo: Traduzido<string>;
  descricao?: Traduzido<string>;
  /** Página de origem, quando as perguntas vêm de um site. */
  url?: string;
}

export interface Modulo {
  id: string;
  /** Letra exibida no índice e no cabeçalho da pergunta (A–F); vazia nos módulos de fontes externas. */
  letra: string;
  nome: Traduzido<string>;
  /** Id da `Fonte` à qual o módulo pertence. */
  origem: string;
}

export interface TextosDoGuia {
  nome: string;
  /** Descrição no cartão da página inicial do site. */
  chamada: string;
  /** Título grande da página de abertura do guia. */
  titulo: string;
  introducao: string;
}

export interface Guia {
  /** Pasta do endereço (/<id>/) e parte da chave do progresso no localStorage. */
  id: string;
  textos: Traduzido<TextosDoGuia>;
  /** Linha curta no cartão da página inicial. */
  detalhe: string;
  fontes: Fonte[];
  modulos: Modulo[];
  perguntas: Pergunta[];
}
