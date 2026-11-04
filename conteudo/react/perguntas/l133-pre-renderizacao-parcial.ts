import type { Pergunta } from "../../tipos";

// L133 · Pré-renderização parcial
export const l133: Pergunta = {
  numero: 133,
  modulo: "linkedin-react19",
  metodo: "feynman",
  pt: {
    titulo: "Pré-renderização parcial",
    pergunta: "O que é pré-renderização parcial?",
    porqueEsteMetodo:
      "A pré-renderização parcial é um meio-termo entre página estática e dinâmica, e a imagem de uma casa com as paredes prontas e as portas instaladas na hora explica a divisão sem entrar em API. Depois a analogia dá lugar ao mecanismo e aos requisitos.",
    resposta30s:
      "Na **pré-renderização parcial (PPR)**, a parte estática da página, o **shell**, é gerada de antemão e servida de uma CDN, enquanto as partes dinâmicas, marcadas por **`<Suspense>`**, ficam como buracos preenchidos depois, **por streaming**, quando o servidor tem os dados da requisição. Assim não é preciso escolher entre uma página totalmente estática ou totalmente dinâmica. Depende do framework (e de suporte do React): confira react.dev e a documentação do seu framework.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense numa casa pré-fabricada. As paredes, o telhado e as janelas são feitos na fábrica, antes de o morador chegar, e vão prontos no caminhão: a casa já aparece de pé no terreno. Só as portas, a fechadura com a chave do morador e a mobília são instaladas na hora, porque dependem de quem vai morar ali.",
        tecnico:
          "A PPR faz o mesmo com a página. O **shell estático** (layout, títulos, conteúdo igual para todos) é pré-renderizado e entregue de imediato, de uma CDN ou da borda. Os pedaços que dependem da requisição (usuário, preço personalizado, estoque) ficam em fronteiras `<Suspense>` com um `fallback`, que o navegador mostra de início. O servidor então renderiza esses buracos e os **envia por streaming**, e o React os encaixa. Por isso o primeiro conteúdo aparece rápido sem abrir mão do dado atual.",
        limite:
          "Uma casa não troca de mobília depois de pronta; a página troca. E quem monta o caminhão, a entrega e a obra no terreno não é o React sozinho, e sim o **framework** (build, CDN, roteamento e servidor). Além disso, “estático” aqui significa igual para todos: se algo depende de cookie, cabeçalho ou usuário, **não pode** estar no shell.",
      },
      {
        tipo: "tabela",
        titulo: "Estática, dinâmica e parcial",
        colunas: ["Abordagem", "Quando o HTML é gerado", "Primeira resposta", "Dados por usuário ou por pedido"],
        linhas: [
          ["Página estática", "No build (ou ao revalidar)", "Rápida, vinda da CDN", "Não: é igual para todos"],
          [
            "Página totalmente dinâmica",
            "A cada pedido, no servidor",
            "Espera o servidor e os dados terminarem",
            "Sim, em qualquer ponto",
          ],
          [
            "Pré-renderização parcial",
            "O shell antes; os buracos a cada pedido",
            "Rápida: o shell sai da CDN e os buracos chegam por streaming",
            "Sim, dentro das fronteiras `<Suspense>`",
          ],
        ],
        nota: "Os nomes e as opções (como ativar e como o framework decide o que é estático) variam entre frameworks e mudam com o tempo: confira a documentação do seu.",
      },
      {
        tipo: "codigo",
        titulo: "Shell estático com um buraco dinâmico",
        legenda: "TSX",
        codigo: `import { Suspense } from "react";

export default function Produto() {
  return (
    <main>
      <h1>Bomba hidráulica HX-200</h1> {/* estático: faz parte do shell */}
      <Descricao />

      <Suspense fallback={<p>Calculando o seu preço…</p>}>
        <PrecoDoCliente /> {/* dinâmico: depende de quem pede; entra por streaming */}
      </Suspense>
    </main>
  );
}`,
        nota: "`Descricao` e `PrecoDoCliente` são componentes seus. O `fallback` é o que vai no shell, então deve ocupar um espaço parecido com o do conteúdo final.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Requisitos e ressalvas",
        texto:
          "Para a PPR funcionar, a parte dinâmica precisa estar **dentro de uma fronteira `<Suspense>`** com `fallback`; ler cookies, cabeçalhos ou dados do usuário fora dela tira a página do modo parcial (ou gera erro, conforme o framework). O React oferece as peças (renderizar a parte estática, pausar e retomar a renderização depois); o **framework** as orquestra com build, CDN e servidor com streaming, então um app só de cliente não usa isso. É um recurso recente e dependente de framework: confira react.dev.",
      },
    ],
    armadilhas: [
      "Achar que “estático” é o mesmo que “sem JavaScript”: o shell é HTML pré-renderizado, mas a página continua sendo hidratada e pode ter Client Components.",
      "Colocar dado do usuário (cookie, sessão, preço personalizado) no shell: isso é dinâmico e precisa ficar atrás de um `<Suspense>`.",
      "Usar um `fallback` que ocupa um tamanho diferente do conteúdo final: quando o dado chega, a página dá um salto. Reserve o espaço.",
      "Esperar que o React sozinho faça tudo: o build, a CDN e o servidor com streaming são do framework e da hospedagem.",
    ],
    autoteste: [
      {
        pergunta: "O que são o shell e os buracos na pré-renderização parcial?",
        resposta:
          "O shell é a parte estática da página, pré-renderizada e entregue de imediato, de uma CDN. Os buracos são partes dinâmicas, dentro de `<Suspense>`, renderizadas no servidor a cada pedido e preenchidas por streaming.",
      },
      {
        pergunta: "Qual a vantagem sobre uma página totalmente dinâmica?",
        resposta:
          "A primeira resposta não espera os dados da requisição: o shell sai pronto da CDN e só os buracos esperam. Melhora o tempo até ver conteúdo sem abrir mão de dados atuais ou personalizados.",
      },
    ],
  },
  en: {
    titulo: "Partial pre-rendering",
    pergunta: "What is partial pre-rendering?",
    porqueEsteMetodo:
      "Partial pre-rendering is a middle ground between a static and a dynamic page, and the picture of a house with the walls already built and the doors installed on site explains the split without touching an API. Then the analogy gives way to the mechanism and the requirements.",
    resposta30s:
      "In **partial pre-rendering (PPR)**, the static part of the page, the **shell**, is generated ahead of time and served from a CDN, while the dynamic parts, marked by **`<Suspense>`**, are left as holes filled in later, **by streaming**, once the server has the request’s data. So you don’t have to choose between a fully static or fully dynamic page. It depends on the framework (and on React support): check react.dev and your framework’s documentation.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a prefabricated house. The walls, the roof and the windows are made at the factory, before the owner arrives, and ship ready on the truck: the house already stands on the lot. Only the doors, the lock with the owner’s key and the furniture are installed on the spot, because they depend on who will live there.",
        tecnico:
          "PPR does the same with a page. The **static shell** (layout, headings, content that is the same for everyone) is pre-rendered and delivered at once, from a CDN or the edge. The pieces that depend on the request (user, personalized price, stock) sit in `<Suspense>` boundaries with a `fallback`, which the browser shows at first. The server then renders those holes and **streams them in**, and React slots them into place. That is why the first content appears quickly without giving up current data.",
        limite:
          "A house doesn’t change its furniture once finished; a page does. And whoever loads the truck, delivers it and does the work on the lot is not React alone but the **framework** (build, CDN, routing and server). Also, “static” here means the same for everyone: if something depends on a cookie, a header or the user, it **cannot** be in the shell.",
      },
      {
        tipo: "tabela",
        titulo: "Static, dynamic and partial",
        colunas: ["Approach", "When the HTML is generated", "First response", "Per-user or per-request data"],
        linhas: [
          [
            "Static page",
            "At build time (or on revalidation)",
            "Fast, from the CDN",
            "No: it is the same for everyone",
          ],
          [
            "Fully dynamic page",
            "On every request, on the server",
            "Waits for the server and the data to finish",
            "Yes, anywhere",
          ],
          [
            "Partial pre-rendering",
            "The shell beforehand; the holes on every request",
            "Fast: the shell comes from the CDN and the holes arrive by streaming",
            "Yes, inside the `<Suspense>` boundaries",
          ],
        ],
        nota: "Names and options (how to enable it, how the framework decides what is static) vary between frameworks and change over time: check your framework’s documentation.",
      },
      {
        tipo: "codigo",
        titulo: "A static shell with one dynamic hole",
        legenda: "TSX",
        codigo: `import { Suspense } from "react";

export default function Product() {
  return (
    <main>
      <h1>HX-200 hydraulic pump</h1> {/* static: part of the shell */}
      <Description />

      <Suspense fallback={<p>Calculating your price…</p>}>
        <CustomerPrice /> {/* dynamic: depends on who asks; streamed in */}
      </Suspense>
    </main>
  );
}`,
        nota: "`Description` and `CustomerPrice` are your own components. The `fallback` is what goes in the shell, so it should take up a space similar to the final content.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Requirements and caveats",
        texto:
          "For PPR to work, the dynamic part must sit **inside a `<Suspense>` boundary** with a `fallback`; reading cookies, headers or user data outside it takes the page out of partial mode (or raises an error, depending on the framework). React provides the pieces (rendering the static part, pausing and resuming the render later); the **framework** orchestrates them with build, CDN and a streaming server, so a client-only app doesn’t use this. It is a recent, framework-dependent feature: check react.dev.",
      },
    ],
    armadilhas: [
      "Thinking “static” means “no JavaScript”: the shell is pre-rendered HTML, but the page is still hydrated and may contain Client Components.",
      "Putting user data (cookie, session, personalized price) in the shell: that is dynamic and must sit behind a `<Suspense>`.",
      "Using a `fallback` whose size differs from the final content: when the data arrives, the page jumps. Reserve the space.",
      "Expecting React alone to do everything: the build, the CDN and the streaming server belong to the framework and the hosting.",
    ],
    autoteste: [
      {
        pergunta: "What are the shell and the holes in partial pre-rendering?",
        resposta:
          "The shell is the static part of the page, pre-rendered and delivered at once from a CDN. The holes are dynamic parts, inside `<Suspense>`, rendered on the server on every request and filled in by streaming.",
      },
      {
        pergunta: "What is the advantage over a fully dynamic page?",
        resposta:
          "The first response doesn’t wait for the request’s data: the shell comes ready from the CDN and only the holes wait. It improves the time to see content without giving up current or personalized data.",
      },
    ],
  },
};
