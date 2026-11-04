import { GUIAS, guiaPorId } from "@/conteudo/guias";
import { visaoDoGuia } from "@/lib/guia";

// O índice do guia vira UM arquivo estático (/<guia>/indice.json), baixado uma vez e guardado pelo navegador.
// Dentro de cada página ele se repetia centenas de vezes e o site passava de 1 GB (o limite do GitHub Pages).
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return GUIAS.map((guia) => ({ guia: guia.id }));
}

export async function GET(_pedido: Request, { params }: { params: Promise<{ guia: string }> }) {
  const guia = guiaPorId((await params).guia);
  if (!guia) return new Response("Guia não encontrado", { status: 404 });
  return Response.json(visaoDoGuia(guia));
}
