import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CascaDoGuia } from "@/componentes/casca/CascaDoGuia";
import { GUIAS, guiaPorId } from "@/conteudo/guias";
import { visaoDoGuia } from "@/lib/guia";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIAS.map((guia) => ({ guia: guia.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ guia: string }> }): Promise<Metadata> {
  const guia = guiaPorId((await params).guia);
  return guia ? { title: guia.textos.pt.nome, description: guia.textos.pt.chamada } : {};
}

export default async function LayoutDoGuia({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ guia: string }>;
}) {
  const guia = guiaPorId((await params).guia);
  if (!guia) notFound();
  return <CascaDoGuia visao={visaoDoGuia(guia)}>{children}</CascaDoGuia>;
}
