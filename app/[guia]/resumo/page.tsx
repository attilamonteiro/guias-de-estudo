import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResumoView } from "@/componentes/resumo/ResumoView";
import { GUIAS, guiaPorId } from "@/conteudo/guias";
import type { Traduzido } from "@/conteudo/tipos";
import { perguntaComExplicacao, visaoDoGuia } from "@/lib/guia";
import { TEXTOS } from "@/lib/textos-da-interface";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIAS.map((guia) => ({ guia: guia.id }));
}

export const metadata: Metadata = { title: TEXTOS.pt.resumoTitulo };

export default async function PaginaDoResumo({ params }: { params: Promise<{ guia: string }> }) {
  const guia = guiaPorId((await params).guia);
  if (!guia) notFound();
  const respostas: Record<number, Traduzido<string>> = {};
  for (const pergunta of guia.perguntas) {
    const explicacao = perguntaComExplicacao(guia, pergunta);
    respostas[pergunta.numero] = { pt: explicacao.pt.resposta30s, en: explicacao.en.resposta30s };
  }
  return <ResumoView visao={visaoDoGuia(guia)} respostas={respostas} />;
}
