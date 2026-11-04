import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TreinoView, type CartaDoTreino } from "@/componentes/treino/TreinoView";
import { GUIAS, guiaPorId } from "@/conteudo/guias";
import { perguntasDistintas, rotuloDaPergunta } from "@/lib/guia";
import { TEXTOS } from "@/lib/textos-da-interface";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIAS.map((guia) => ({ guia: guia.id }));
}

export const metadata: Metadata = { title: TEXTOS.pt.treinoTitulo };

export default async function PaginaDoTreino({ params }: { params: Promise<{ guia: string }> }) {
  const guia = guiaPorId((await params).guia);
  if (!guia) notFound();
  const cartas: CartaDoTreino[] = perguntasDistintas(guia).map((pergunta) => ({
    numero: pergunta.numero,
    rotulo: rotuloDaPergunta(guia, pergunta.numero),
    metodo: pergunta.metodo,
    pergunta: { pt: pergunta.pt.pergunta, en: pergunta.en.pergunta },
    resposta30s: { pt: pergunta.pt.resposta30s, en: pergunta.en.resposta30s },
    autoteste: { pt: pergunta.pt.autoteste, en: pergunta.en.autoteste },
  }));
  return <TreinoView guiaId={guia.id} cartas={cartas} />;
}
