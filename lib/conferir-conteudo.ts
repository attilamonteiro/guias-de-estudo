// Regras de qualidade de uma pergunta, em funções puras. Usadas pelos testes e por scripts/conferir-perguntas.ts.
// Só importa tipos (apagados na execução), para o Node rodar este arquivo direto, sem build.
import type { Bloco, ExplicacaoNoIdioma, Pergunta } from "../conteudo/tipos";

const IDIOMAS = ["pt", "en"] as const;

/** Forma de um bloco: o tipo mais a quantidade de itens de cada lista. Deve ser igual em PT e EN. */
export function formaDoBloco(bloco: Bloco): string {
  switch (bloco.tipo) {
    case "analogia":
    case "codigo":
    case "destaque":
      return bloco.tipo;
    case "porques":
      return `porques:${bloco.cadeia.length}:${bloco.causaRaiz ? "raiz" : "-"}`;
    case "tabela":
      return `tabela:${bloco.colunas.length}x${bloco.linhas.length}`;
    case "passos":
      return `passos:${bloco.passos.length}`;
    case "fluxo":
      return `fluxo:${bloco.etapas.length}`;
    case "pares":
      return `pares:${bloco.pares.length}`;
  }
}

/** Todo texto livre de uma explicação (onde `código` e **negrito** são interpretados). */
export function textosFormatados(explicacao: ExplicacaoNoIdioma): string[] {
  const textos = [explicacao.porqueEsteMetodo, explicacao.resposta30s, ...explicacao.armadilhas];
  for (const item of explicacao.autoteste) textos.push(item.pergunta, item.resposta);
  for (const bloco of explicacao.blocos) {
    switch (bloco.tipo) {
      case "analogia":
        textos.push(bloco.simples, bloco.tecnico, bloco.limite);
        break;
      case "porques":
        bloco.cadeia.forEach((elo) => textos.push(elo.pergunta, elo.resposta));
        if (bloco.causaRaiz) textos.push(bloco.causaRaiz);
        break;
      case "tabela":
        textos.push(...bloco.colunas, ...bloco.linhas.flat());
        if (bloco.nota) textos.push(bloco.nota);
        break;
      case "passos":
        bloco.passos.forEach((p) => textos.push(p.titulo, p.texto));
        break;
      case "fluxo":
        textos.push(...bloco.etapas);
        if (bloco.nota) textos.push(bloco.nota);
        break;
      case "pares":
        textos.push(bloco.rotuloOrigem, bloco.rotuloDestino);
        bloco.pares.forEach((p) => textos.push(p.origem, p.destino));
        break;
      case "destaque":
        textos.push(bloco.texto);
        if (bloco.titulo) textos.push(bloco.titulo);
        break;
      case "codigo":
        if (bloco.nota) textos.push(bloco.nota);
        break;
    }
  }
  return textos;
}

/** Problemas de uma pergunta; lista vazia = pode entrar no guia. */
export function problemasDaPergunta(pergunta: Pergunta): string[] {
  const problemas: string[] = [];
  const r = `pergunta ${pergunta.numero}`;

  for (const idioma of IDIOMAS) {
    if (!pergunta[idioma].titulo.trim()) problemas.push(`${r}: título vazio em ${idioma}`);
    if (!pergunta[idioma].pergunta.trim()) problemas.push(`${r}: enunciado vazio em ${idioma}`);
  }
  if ("repeteA" in pergunta) return problemas;

  for (const idioma of IDIOMAS) {
    const e = pergunta[idioma];
    if (!e.porqueEsteMetodo.trim()) problemas.push(`${r}: porqueEsteMetodo vazio em ${idioma}`);
    if (!e.resposta30s.trim()) problemas.push(`${r}: resposta30s vazia em ${idioma}`);
    if (e.blocos.length === 0) problemas.push(`${r}: sem blocos em ${idioma}`);
    if (e.armadilhas.length < 2) problemas.push(`${r}: menos de 2 armadilhas em ${idioma}`);
    if (e.autoteste.length < 2) problemas.push(`${r}: menos de 2 itens de autoteste em ${idioma}`);

    for (const bloco of e.blocos) {
      if (bloco.tipo === "tabela") {
        bloco.linhas.forEach((linha, i) => {
          if (linha.length !== bloco.colunas.length) {
            problemas.push(
              `${r}: tabela em ${idioma}, linha ${i + 1} tem ${linha.length} células e o cabeçalho ${bloco.colunas.length}`,
            );
          }
        });
      }
    }
    for (const texto of textosFormatados(e)) {
      const trecho = texto.slice(0, 50);
      if (/undefined|\[object/.test(texto)) problemas.push(`${r}: texto com "undefined" em ${idioma}: ${trecho}`);
      if ((texto.match(/`/g) ?? []).length % 2 !== 0) problemas.push(`${r}: crase aberta em ${idioma}: ${trecho}`);
      if ((texto.match(/\*\*/g) ?? []).length % 2 !== 0) problemas.push(`${r}: negrito aberto em ${idioma}: ${trecho}`);
    }
  }

  const formaPt = pergunta.pt.blocos.map(formaDoBloco);
  const formaEn = pergunta.en.blocos.map(formaDoBloco);
  if (formaPt.join("|") !== formaEn.join("|")) {
    problemas.push(`${r}: blocos diferentes entre PT e EN\n   PT ${formaPt.join(" | ")}\n   EN ${formaEn.join(" | ")}`);
  }
  if (pergunta.pt.armadilhas.length !== pergunta.en.armadilhas.length)
    problemas.push(`${r}: armadilhas PT/EN em quantidades diferentes`);
  if (pergunta.pt.autoteste.length !== pergunta.en.autoteste.length)
    problemas.push(`${r}: autoteste PT/EN em quantidades diferentes`);
  return problemas;
}
