import { notFound } from "next/navigation";
import { InicioDoGuia } from "@/componentes/inicio/InicioDoGuia";
import { GUIAS, guiaPorId } from "@/conteudo/guias";
import { visaoDoGuia } from "@/lib/guia";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIAS.map((guia) => ({ guia: guia.id }));
}

export default async function PaginaDoGuia({ params }: { params: Promise<{ guia: string }> }) {
  const guia = guiaPorId((await params).guia);
  if (!guia) notFound();
  return <InicioDoGuia visao={visaoDoGuia(guia)} textos={guia.textos} urlDaFonte={guia.fonteExterna?.url} />;
}
