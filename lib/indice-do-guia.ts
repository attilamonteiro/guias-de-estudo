"use client";

// O índice de um guia (todas as perguntas, com título e enunciado) vem de /<guia>/indice.json, baixado uma vez
// e compartilhado por quem pedir (a barra lateral e a gaveta do celular). Fica fora de cada página para o site
// exportado não repetir centenas de itens em milhares de arquivos.
import { useCallback, useEffect, useState } from "react";
import type { VisaoDoGuia } from "./guia";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const pedidos = new Map<string, Promise<VisaoDoGuia>>();

function enderecoDoIndice(guiaId: string): string {
  return `${BASE}/${guiaId}/indice.json`;
}

export function carregarIndice(guiaId: string): Promise<VisaoDoGuia> {
  let pedido = pedidos.get(guiaId);
  if (!pedido) {
    pedido = fetch(enderecoDoIndice(guiaId)).then((resposta) => {
      if (!resposta.ok) throw new Error(`Índice de ${guiaId}: HTTP ${resposta.status}`);
      return resposta.json() as Promise<VisaoDoGuia>;
    });
    // Falha não fica guardada: tentar de novo refaz o pedido.
    pedido.catch(() => pedidos.delete(guiaId));
    pedidos.set(guiaId, pedido);
  }
  return pedido;
}

export type EstadoDoIndice =
  | { situacao: "carregando" }
  | { situacao: "pronto"; visao: VisaoDoGuia }
  | { situacao: "erro"; tentarDeNovo: () => void };

export function useIndiceDoGuia(guiaId: string): EstadoDoIndice {
  const [resultado, setResultado] = useState<{ guiaId: string; visao?: VisaoDoGuia; erro?: boolean }>({ guiaId });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let vivo = true;
    carregarIndice(guiaId).then(
      (visao) => vivo && setResultado({ guiaId, visao }),
      () => vivo && setResultado({ guiaId, erro: true }),
    );
    return () => {
      vivo = false;
    };
  }, [guiaId, tentativa]);

  const tentarDeNovo = useCallback(() => {
    setResultado({ guiaId });
    setTentativa((n) => n + 1);
  }, [guiaId]);

  if (resultado.guiaId !== guiaId) return { situacao: "carregando" };
  if (resultado.visao) return { situacao: "pronto", visao: resultado.visao };
  if (resultado.erro) return { situacao: "erro", tentarDeNovo };
  return { situacao: "carregando" };
}
