import { PaginaInicialDoSite } from "@/componentes/hub/PaginaInicialDoSite";
import { GUIAS } from "@/conteudo/guias";

export default function PaginaInicial() {
  const guias = GUIAS.map((guia) => ({
    id: guia.id,
    detalhe: guia.detalhe,
    textos: {
      pt: { nome: guia.textos.pt.nome, chamada: guia.textos.pt.chamada },
      en: { nome: guia.textos.en.nome, chamada: guia.textos.en.chamada },
    },
  }));
  return <PaginaInicialDoSite guias={guias} />;
}
