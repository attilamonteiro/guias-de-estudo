import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PerguntaView, type DadosDaPergunta } from "@/componentes/pergunta/PerguntaView";
import { GUIAS, guiaPorId } from "@/conteudo/guias";
import {
  chaveDeProgresso,
  ehRepetida,
  perguntaComExplicacao,
  perguntaPorNumero,
  rotuloDaPergunta,
  vizinhasDe,
} from "@/lib/guia";

export const dynamicParams = false;

type Parametros = { guia: string; numero: string };

export function generateStaticParams() {
  return GUIAS.flatMap((guia) =>
    guia.perguntas.map((pergunta) => ({ guia: guia.id, numero: String(pergunta.numero) })),
  );
}

export async function generateMetadata({ params }: { params: Promise<Parametros> }): Promise<Metadata> {
  const { guia: id, numero } = await params;
  const guia = guiaPorId(id);
  const pergunta = guia && perguntaPorNumero(guia, Number(numero));
  return pergunta
    ? { title: `${rotuloDaPergunta(pergunta.numero)} · ${pergunta.pt.titulo}`, description: pergunta.pt.pergunta }
    : {};
}

export default async function PaginaDaPergunta({ params }: { params: Promise<Parametros> }) {
  const { guia: id, numero } = await params;
  const guia = guiaPorId(id);
  const pergunta = guia && perguntaPorNumero(guia, Number(numero));
  if (!guia || !pergunta) notFound();
  const modulo = guia.modulos.find((m) => m.id === pergunta.modulo);
  if (!modulo) throw new Error(`Módulo "${pergunta.modulo}" da pergunta ${pergunta.numero} não existe em ${guia.id}`);

  const original = ehRepetida(pergunta) ? perguntaPorNumero(guia, pergunta.repeteA) : undefined;
  const { anterior, proxima } = vizinhasDe(guia, pergunta.numero);
  const dados: DadosDaPergunta = {
    guiaId: guia.id,
    numero: pergunta.numero,
    chaveDeProgresso: chaveDeProgresso(pergunta),
    modulo,
    textos: {
      pt: { titulo: pergunta.pt.titulo, pergunta: pergunta.pt.pergunta },
      en: { titulo: pergunta.en.titulo, pergunta: pergunta.en.pergunta },
    },
    repeteA: original && { numero: original.numero, titulo: { pt: original.pt.titulo, en: original.en.titulo } },
    explicacao: perguntaComExplicacao(guia, pergunta),
    anterior: anterior?.numero,
    proxima: proxima?.numero,
  };
  return <PerguntaView dados={dados} />;
}
