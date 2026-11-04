import type { Pergunta } from "../../tipos";

// L108 · Otimizar imagens no React
export const l108: Pergunta = {
  numero: 108,
  modulo: "linkedin-desempenho",
  metodo: "playbook",
  pt: {
    titulo: "Otimizar imagens no React",
    pergunta: "Como você otimiza imagens em uma aplicação React?",
    porqueEsteMetodo:
      "Imagens costumam ser o maior peso de uma página, e a otimização é uma lista de ações que se aplicam em ordem e se conferem uma a uma. O playbook mostra cada passo com o sinal de que funcionou, ligado às métricas LCP e CLS.",
    resposta30s:
      'Envie **menos bytes e só quando necessário**: formatos modernos (**AVIF ou WebP**, com JPEG ou PNG de reserva), o **tamanho certo** para cada tela (`srcset` e `sizes`), compressão e `loading="lazy"` para o que está fora da tela. Cuide do que o usuário vê primeiro: a **imagem do topo não leva lazy** e ganha prioridade (**LCP**), e `width` e `height` reservam o espaço para o layout não pular (**CLS**). Sirva por **CDN com cache**, use o componente de imagem do framework quando existir e meça antes e depois.',
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: da medição à entrega",
        passos: [
          {
            titulo: "Meça antes",
            texto:
              "No Lighthouse e na aba Network, anote o LCP, o CLS e quantos KB de imagem a página baixa. Veja qual elemento é o LCP: quase sempre é uma imagem. Sinal: você sabe quais imagens pesam mais e qual é a principal.",
          },
          {
            titulo: "Escolha o formato",
            texto:
              "Para fotos, **AVIF** e **WebP** costumam ser mais leves que JPEG com qualidade comparável; para ícones e logotipos, **SVG**; evite PNG para foto. Como nem todo navegador entende os formatos novos, ofereça reserva com `<picture>` e `<source type>`, deixando JPEG ou PNG no `<img>` final.",
          },
          {
            titulo: "Sirva o tamanho certo",
            texto:
              "Não envie uma foto de 3000 px para uma caixa de 400 px. Gere várias larguras e descreva-as com `srcset` (a lista de arquivos com a largura de cada um) e `sizes` (quanto espaço a imagem ocupa no layout), para o navegador escolher conforme a tela e a densidade de pixels.",
          },
          {
            titulo: "Comprima",
            texto:
              "Ajuste a qualidade (um nível um pouco menor costuma passar despercebido), remova metadados e automatize na build ou num serviço de imagens. Sinal: os KB transferidos caem sem diferença visível.",
          },
          {
            titulo: "Adie o que está fora da tela e priorize o que está no topo",
            texto:
              'Use `loading="lazy"` (e `decoding="async"`) nas imagens abaixo da primeira tela. A imagem do LCP **não** recebe lazy: dê a ela `fetchPriority="high"` (em JSX, com essa grafia) e, se preciso, um `preload`. Sinal: o LCP cai e as imagens de baixo só são pedidas na rolagem.',
          },
          {
            titulo: "Reserve o espaço",
            texto:
              "Informe `width` e `height` (ou `aspect-ratio` no CSS) para o navegador reservar a caixa antes de baixar o arquivo. Sinal: o CLS fica baixo e o texto não pula quando a imagem aparece.",
          },
          {
            titulo: "Entregue bem e meça de novo",
            texto:
              "Hospede em uma **CDN** (perto do usuário e, se oferecer, com redimensionamento e escolha de formato sob demanda), use nomes com hash e `Cache-Control` longo para o navegador reaproveitar. Os componentes de imagem dos frameworks (como `next/image`, no Next.js) fazem boa parte disso. Meça de novo, nas mesmas condições.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Uma imagem de destaque bem entregue",
        legenda: "TSX",
        codigo: `export function Capa({ alt }: { alt: string }) {
  const tamanhos = "(min-width: 960px) 800px, 100vw";
  // Imagem do topo (LCP): sem lazy e com prioridade alta
  return (
    <picture>
      <source type="image/avif" srcSet="/capa-800.avif 800w, /capa-1600.avif 1600w" sizes={tamanhos} />
      <source type="image/webp" srcSet="/capa-800.webp 800w, /capa-1600.webp 1600w" sizes={tamanhos} />
      <img
        src="/capa-800.jpg"
        srcSet="/capa-800.jpg 800w, /capa-1600.jpg 1600w"
        sizes={tamanhos}
        width={800}
        height={450}
        fetchPriority="high"
        alt={alt}
      />
    </picture>
  );
}`,
        nota: 'Para uma imagem abaixo da primeira tela, troque `fetchPriority` por `loading="lazy"`. As versões em várias larguras e formatos saem da build ou de um serviço de imagens.',
      },
      {
        tipo: "tabela",
        titulo: "Cada técnica ataca um problema",
        colunas: ["Técnica", "O que resolve", "Métrica ou sinal"],
        linhas: [
          ["AVIF ou WebP e compressão", "Menos bytes por imagem", "KB transferidos; LCP"],
          [
            "`srcset` e `sizes`",
            "Arquivo do tamanho da tela, sem desperdício no celular",
            "KB transferidos; LCP em rede lenta",
          ],
          ['`loading="lazy"`', "Não baixa o que está fora da tela", "Peso da carga inicial"],
          ["`fetchPriority` e `preload` na imagem do topo", "A imagem principal começa a baixar cedo", "LCP"],
          ["`width` e `height` (ou `aspect-ratio`)", "Espaço reservado antes de o arquivo chegar", "CLS"],
          [
            "CDN e `Cache-Control`",
            "Entrega próxima e reaproveitada nas visitas seguintes",
            "Latência; LCP em visitas repetidas",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não use lazy na imagem do LCP",
        texto:
          'O erro mais comum é aplicar `loading="lazy"` em todas as imagens, inclusive a do topo: o navegador a descobre e baixa tarde, e o LCP piora. Lazy é para o que está fora da primeira tela. E não abra mão do `alt`: otimizar bytes não substitui acessibilidade, e imagens puramente decorativas levam `alt` vazio.',
      },
    ],
    armadilhas: [
      "Aplicar lazy em todas as imagens, inclusive a do LCP: ela é pedida tarde e o LCP piora.",
      "Omitir `width` e `height`: o layout é empurrado quando a imagem chega e o CLS sobe.",
      "Usar `srcset` sem `sizes` correto: o navegador assume que a imagem ocupa a largura da janela e pode baixar um arquivo maior que o necessário.",
      "Comprimir ou trocar de formato sem comparar o resultado: sai qualidade ruim, ou um ganho que não aparece nas métricas.",
    ],
    autoteste: [
      {
        pergunta: 'Por que a imagem principal da página não deve ter `loading="lazy"`?',
        resposta:
          "Porque ela costuma ser o elemento do LCP. Com lazy, o navegador só a pede depois de calcular o layout e ela chega tarde. O certo é carregá-la logo e até dar prioridade alta.",
      },
      {
        pergunta: "O que `srcset` e `sizes` fazem juntos?",
        resposta:
          "`srcset` lista as versões do arquivo e suas larguras; `sizes` diz quanto espaço a imagem ocupa no layout. Com os dois, o navegador escolhe a versão mais adequada à largura e à densidade de pixels da tela.",
      },
    ],
  },
  en: {
    titulo: "Optimizing images in React",
    pergunta: "How do you optimize images in a React application?",
    porqueEsteMetodo:
      "Images are often the heaviest part of a page, and optimizing them is a list of actions applied in order and checked one by one. The playbook shows each step with the sign that it worked, tied to the LCP and CLS metrics.",
    resposta30s:
      'Send **fewer bytes, and only when needed**: modern formats (**AVIF or WebP**, with JPEG or PNG as a fallback), the **right size** for each screen (`srcset` and `sizes`), compression and `loading="lazy"` for whatever is off screen. Take care of what the user sees first: the **top image does not get lazy** and gets priority (**LCP**), and `width` and `height` reserve space so the layout does not jump (**CLS**). Serve through a **CDN with caching**, use the framework’s image component when there is one, and measure before and after.',
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from measuring to delivery",
        passos: [
          {
            titulo: "Measure first",
            texto:
              "In Lighthouse and the Network tab, note the LCP, the CLS and how many KB of images the page downloads. See which element is the LCP: it is almost always an image. Sign: you know which images weigh the most and which one is the main one.",
          },
          {
            titulo: "Pick the format",
            texto:
              "For photos, **AVIF** and **WebP** tend to be lighter than JPEG at comparable quality; for icons and logos, **SVG**; avoid PNG for photos. Since not every browser understands the newer formats, offer a fallback with `<picture>` and `<source type>`, leaving JPEG or PNG in the final `<img>`.",
          },
          {
            titulo: "Serve the right size",
            texto:
              "Do not send a 3000 px photo to a 400 px box. Generate several widths and describe them with `srcset` (the list of files with each one’s width) and `sizes` (how much space the image takes in the layout), so the browser picks according to the screen and its pixel density.",
          },
          {
            titulo: "Compress",
            texto:
              "Tune the quality (a slightly lower level usually goes unnoticed), strip metadata and automate it in the build or in an image service. Sign: transferred KB drop with no visible difference.",
          },
          {
            titulo: "Defer what is off screen and prioritize what is at the top",
            texto:
              'Use `loading="lazy"` (and `decoding="async"`) on images below the first screen. The LCP image does **not** get lazy: give it `fetchPriority="high"` (in JSX, spelled that way) and, if needed, a `preload`. Sign: the LCP drops and the images below are only requested on scroll.',
          },
          {
            titulo: "Reserve the space",
            texto:
              "Set `width` and `height` (or `aspect-ratio` in CSS) so the browser reserves the box before downloading the file. Sign: the CLS stays low and the text does not jump when the image shows up.",
          },
          {
            titulo: "Deliver well and measure again",
            texto:
              "Host on a **CDN** (close to the user and, if it offers it, with on-demand resizing and format selection), use hashed file names and a long `Cache-Control` so the browser can reuse them. Framework image components (such as `next/image` in Next.js) do a good part of this. Measure again, under the same conditions.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A well-delivered hero image",
        legenda: "TSX",
        codigo: `export function Cover({ alt }: { alt: string }) {
  const sizes = "(min-width: 960px) 800px, 100vw";
  // Top image (LCP): no lazy, high priority
  return (
    <picture>
      <source type="image/avif" srcSet="/cover-800.avif 800w, /cover-1600.avif 1600w" sizes={sizes} />
      <source type="image/webp" srcSet="/cover-800.webp 800w, /cover-1600.webp 1600w" sizes={sizes} />
      <img
        src="/cover-800.jpg"
        srcSet="/cover-800.jpg 800w, /cover-1600.jpg 1600w"
        sizes={sizes}
        width={800}
        height={450}
        fetchPriority="high"
        alt={alt}
      />
    </picture>
  );
}`,
        nota: 'For an image below the first screen, replace `fetchPriority` with `loading="lazy"`. The versions in several widths and formats come from the build or an image service.',
      },
      {
        tipo: "tabela",
        titulo: "Each technique attacks one problem",
        colunas: ["Technique", "What it solves", "Metric or sign"],
        linhas: [
          ["AVIF or WebP and compression", "Fewer bytes per image", "Transferred KB; LCP"],
          [
            "`srcset` and `sizes`",
            "A file sized for the screen, no waste on phones",
            "Transferred KB; LCP on slow networks",
          ],
          ['`loading="lazy"`', "Does not download what is off screen", "Weight of the initial load"],
          ["`fetchPriority` and `preload` on the top image", "The main image starts downloading early", "LCP"],
          ["`width` and `height` (or `aspect-ratio`)", "Space reserved before the file arrives", "CLS"],
          ["CDN and `Cache-Control`", "Delivery from nearby, reused on later visits", "Latency; LCP on repeat visits"],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Do not lazy-load the LCP image",
        texto:
          'The most common mistake is applying `loading="lazy"` to every image, including the one at the top: the browser discovers and downloads it late, and the LCP gets worse. Lazy is for what is outside the first screen. And do not skip `alt`: optimizing bytes does not replace accessibility, and purely decorative images get an empty `alt`.',
      },
    ],
    armadilhas: [
      "Applying lazy to every image, including the LCP one: it is requested late and the LCP gets worse.",
      "Omitting `width` and `height`: the layout is pushed when the image arrives and the CLS goes up.",
      "Using `srcset` without a correct `sizes`: the browser assumes the image fills the window width and may download a larger file than needed.",
      "Compressing or switching formats without comparing the result: you get poor quality, or a gain that does not show up in the metrics.",
    ],
    autoteste: [
      {
        pergunta: 'Why should the page’s main image not have `loading="lazy"`?',
        resposta:
          "Because it is usually the LCP element. With lazy, the browser only requests it after computing the layout and it arrives late. The right move is to load it right away and even give it high priority.",
      },
      {
        pergunta: "What do `srcset` and `sizes` do together?",
        resposta:
          "`srcset` lists the versions of the file and their widths; `sizes` says how much space the image takes in the layout. With both, the browser picks the version best suited to the screen’s width and pixel density.",
      },
    ],
  },
};
