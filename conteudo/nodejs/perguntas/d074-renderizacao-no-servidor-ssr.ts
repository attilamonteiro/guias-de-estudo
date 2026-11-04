import type { Pergunta } from "../../tipos";

// D74 · Renderização no servidor (SSR)
export const d074: Pergunta = {
  numero: 374,
  modulo: "devinterview-integracoes",
  metodo: "trace",
  pt: {
    titulo: "Renderização no servidor (SSR)",
    pergunta: "O que é renderização no servidor (SSR) e como ela pode ser feita com o Node.js?",
    porqueEsteMetodo:
      "SSR é um caminho: o pedido entra, o servidor busca dados, gera o HTML, o navegador o mostra e só depois a página fica interativa. Seguir uma requisição de `/produto/42` mostra onde estão os ganhos, os custos e os erros típicos.",
    resposta30s:
      "Na **renderização no servidor (SSR)**, o servidor Node busca os dados, gera o **HTML** da página e o envia pronto; o navegador o mostra de imediato e, quando o JavaScript chega, a **hidratação** liga os eventos e torna a página interativa. Dá para fazer com React (`renderToString` ou streaming), com frameworks como Next.js e Nuxt ou com template engines. O ganho é o primeiro conteúdo e o SEO; o custo é CPU no servidor, TTFB, cache e o cuidado de não compartilhar estado entre requisições.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma requisição a /produto/42, com cache",
        etapas: [
          "O navegador pede `GET /produto/42`. Antes do servidor Node, um CDN ou proxy pode responder direto se tiver uma cópia válida, e o caminho termina aí",
          "O servidor Node consulta o cache de páginas pela chave (a URL e o que muda a página, como o idioma). Acerto: devolve o HTML guardado. Falha: o caminho segue",
          "Busca os dados da página no banco ou em APIs (`await`), em paralelo quando possível. É aqui que se decide a latência até o primeiro byte (TTFB)",
          "Renderiza a interface com esses dados em HTML: `renderToString` do React, ou em fluxo com `renderToPipeableStream`; Next.js, Nuxt e template engines como EJS ou Pug fazem o equivalente",
          "Se o HTML for igual para todos (sem dados do usuário), guarda no cache com validade. Envia a resposta com o HTML, os dados serializados e as tags dos scripts",
          "O navegador pinta o HTML já pronto (primeiro conteúdo, bom para SEO e para conexões lentas) antes de baixar o JavaScript. Ainda não há interatividade",
          "O JavaScript chega e a **hidratação** (`hydrateRoot`) reconstrói a árvore de componentes no cliente, confere com o HTML existente e anexa os eventos. A partir daí é uma aplicação normal; nos frameworks completos, as navegações seguintes costumam ser feitas no cliente",
        ],
        nota: "Se a hidratação encontrar um HTML diferente do que o cliente renderiza (por exemplo, `Date.now()` ou `Math.random()` no render), o React avisa da divergência e pode refazer parte do trabalho.",
      },
      {
        tipo: "tabela",
        titulo: "CSR, SSR e SSG",
        colunas: ["Aspecto", "CSR (no cliente)", "SSR (no servidor)", "SSG (no build)"],
        linhas: [
          [
            "Onde o HTML é montado",
            "No navegador, depois de baixar e executar o JavaScript; o servidor entrega um HTML quase vazio",
            "No servidor, a cada requisição (ou a cada expiração do cache)",
            "No servidor, uma vez, no build ou ao republicar; servido como arquivo",
          ],
          [
            "Primeiro conteúdo e SEO",
            "Mais lento: tela vazia até o JavaScript rodar; a indexação depende de o buscador executá-lo",
            "HTML pronto na primeira resposta",
            "HTML pronto, direto de um CDN, o mais rápido",
          ],
          [
            "Custo no servidor",
            "Baixo: só serve arquivos e APIs",
            "CPU e memória a cada renderização; exige servidor Node de pé",
            "Quase nenhum em tempo de execução; o custo está no build",
          ],
          [
            "Frescor dos dados",
            "Sempre atual, buscado pelo cliente",
            "Atual no momento da renderização (ou do cache)",
            "Do momento do build, até republicar ou revalidar",
          ],
          [
            "Bom para",
            "Áreas logadas, painéis, aplicações muito interativas",
            "Páginas públicas com dados que mudam e personalização",
            "Conteúdo estável: blog, documentação, páginas de marketing",
          ],
        ],
        nota: "Frameworks como o Next.js deixam escolher por página e combinar com revalidação; confira a documentação do que você usa.",
      },
      {
        tipo: "codigo",
        titulo: "SSR mínimo com Express, React e cache",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          'import { createElement } from "react";',
          'import { renderToString } from "react-dom/server";',
          'import { PaginaProduto } from "./PaginaProduto.js";',
          "",
          "const app = express();",
          "const cache = new Map(); // só para páginas iguais para todos, com validade curta",
          "",
          'app.get("/produto/:id", async (req, res) => {',
          "  const guardado = cache.get(req.originalUrl);",
          '  if (guardado && guardado.expiraEm > Date.now()) return res.type("html").send(guardado.html);',
          "",
          "  const produto = await buscarProduto(req.params.id); // os dados vêm antes do HTML",
          "  const corpo = renderToString(createElement(PaginaProduto, { produto }));",
          '  const html = `<!doctype html><div id="raiz">${corpo}</div><script type="module" src="/cliente.js"></script>`;',
          "",
          "  cache.set(req.originalUrl, { html, expiraEm: Date.now() + 60_000 });",
          '  res.type("html").send(html);',
          "});",
        ].join("\n"),
        nota: "Em produção, o HTML leva também os dados serializados (com escape de `<`) para a hidratação, e o cliente roda `hydrateRoot` no elemento `raiz`. O `Map` em memória é só ilustração: use CDN, `Cache-Control` ou Redis.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O erro que mais dói: estado compartilhado entre requisições",
        texto:
          "No servidor, uma variável de módulo (um “usuário atual”, um store global, um cache sem chave por usuário) é a **mesma para todas as requisições simultâneas**. Como há `await` no meio, uma requisição lê o que outra gravou, e o usuário A pode ver a página do B. Mantenha o estado **por requisição** (criado dentro do handler ou do contexto) e só coloque em cache o HTML **igual para todos**. Página personalizada leva `Cache-Control: private` ou `no-store`, e o cache deve respeitar `Vary` (por exemplo, o idioma).",
      },
    ],
    armadilhas: [
      "Usar variável de módulo ou singleton (usuário atual, store global) no render do servidor: o estado é compartilhado entre requisições e vaza dados de um usuário para outro.",
      "Colocar HTML personalizado em um cache compartilhado (CDN ou proxy): a pessoa seguinte recebe a página de outra.",
      "Usar `window`, `localStorage`, `Date.now()` ou `Math.random()` durante o render: quebra no servidor ou diverge na hidratação.",
      "Aplicar SSR em tudo sem medir: CPU no servidor e TTFB alto quando a página espera APIs lentas; considere SSG, cache ou streaming.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre renderizar no servidor e hidratar?",
        resposta:
          "Renderizar no servidor produz o HTML da página. A hidratação roda no navegador, reaproveita esse HTML e anexa eventos e estado para a página ficar interativa. Sem hidratação, a página é só conteúdo estático.",
      },
      {
        pergunta: "Que ganhos e custos o SSR traz em relação ao CSR?",
        resposta:
          "Ganhos: primeiro conteúdo mais rápido e HTML pronto para buscadores e pré-visualização de links. Custos: CPU a cada renderização, TTFB que depende dos dados, necessidade de cache e cuidado com estado compartilhado.",
      },
    ],
  },
  en: {
    titulo: "Server-side rendering",
    pergunta: "What is server-side rendering and how can it be achieved with Node.js?",
    porqueEsteMetodo:
      "SSR is a path: the request comes in, the server fetches data, builds the HTML, the browser shows it and only then does the page become interactive. Following a request for `/product/42` shows where the gains, the costs and the typical mistakes are.",
    resposta30s:
      "In **server-side rendering (SSR)**, the Node server fetches the data, builds the page’s **HTML** and sends it ready; the browser shows it at once and, when the JavaScript arrives, **hydration** wires up the events and makes the page interactive. You can do it with React (`renderToString` or streaming), with frameworks such as Next.js and Nuxt, or with template engines. The gain is first content and SEO; the cost is server CPU, TTFB, caching and care not to share state between requests.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One request to /product/42, with a cache",
        etapas: [
          "The browser asks for `GET /product/42`. Before the Node server, a CDN or proxy may answer directly if it has a valid copy, and the path ends there",
          "The Node server checks the page cache by key (the URL and whatever changes the page, such as the language). Hit: it returns the stored HTML. Miss: the path continues",
          "It fetches the page’s data from the database or APIs (`await`), in parallel when possible. This is where latency to the first byte (TTFB) is decided",
          "It renders the interface with that data into HTML: React’s `renderToString`, or streaming with `renderToPipeableStream`; Next.js, Nuxt and template engines such as EJS or Pug do the equivalent",
          "If the HTML is the same for everyone (no user data), it stores it in the cache with an expiry. It sends the response with the HTML, the serialized data and the script tags",
          "The browser paints the ready-made HTML (first content, good for SEO and slow connections) before downloading the JavaScript. There is no interactivity yet",
          "The JavaScript arrives and **hydration** (`hydrateRoot`) rebuilds the component tree on the client, checks it against the existing HTML and attaches the events. From then on it is a normal application; in full frameworks, later navigations are usually done on the client",
        ],
        nota: "If hydration finds HTML different from what the client renders (for example, `Date.now()` or `Math.random()` in the render), React warns about the mismatch and may redo part of the work.",
      },
      {
        tipo: "tabela",
        titulo: "CSR, SSR and SSG",
        colunas: ["Aspect", "CSR (on the client)", "SSR (on the server)", "SSG (at build time)"],
        linhas: [
          [
            "Where the HTML is built",
            "In the browser, after downloading and running the JavaScript; the server delivers nearly empty HTML",
            "On the server, on every request (or whenever the cache expires)",
            "On the server, once, at build time or on republish; served as a file",
          ],
          [
            "First content and SEO",
            "Slower: a blank screen until the JavaScript runs; indexing depends on the crawler running it",
            "Ready HTML in the first response",
            "Ready HTML, straight from a CDN, the fastest",
          ],
          [
            "Server cost",
            "Low: it only serves files and APIs",
            "CPU and memory on every render; needs a running Node server",
            "Almost none at run time; the cost is in the build",
          ],
          [
            "Data freshness",
            "Always current, fetched by the client",
            "Current at render time (or as of the cache)",
            "As of the build, until republished or revalidated",
          ],
          [
            "Good for",
            "Logged-in areas, dashboards, highly interactive applications",
            "Public pages with changing data and personalization",
            "Stable content: blog, documentation, marketing pages",
          ],
        ],
        nota: "Frameworks such as Next.js let you choose per page and combine with revalidation; check the documentation of the one you use.",
      },
      {
        tipo: "codigo",
        titulo: "Minimal SSR with Express, React and a cache",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          'import { createElement } from "react";',
          'import { renderToString } from "react-dom/server";',
          'import { ProductPage } from "./ProductPage.js";',
          "",
          "const app = express();",
          "const cache = new Map(); // only for pages that are the same for everyone, short expiry",
          "",
          'app.get("/product/:id", async (req, res) => {',
          "  const stored = cache.get(req.originalUrl);",
          '  if (stored && stored.expiresAt > Date.now()) return res.type("html").send(stored.html);',
          "",
          "  const product = await fetchProduct(req.params.id); // the data comes before the HTML",
          "  const body = renderToString(createElement(ProductPage, { product }));",
          '  const html = `<!doctype html><div id="root">${body}</div><script type="module" src="/client.js"></script>`;',
          "",
          "  cache.set(req.originalUrl, { html, expiresAt: Date.now() + 60_000 });",
          '  res.type("html").send(html);',
          "});",
        ].join("\n"),
        nota: "In production, the HTML also carries the serialized data (with `<` escaped) for hydration, and the client runs `hydrateRoot` on the `root` element. The in-memory `Map` is only an illustration: use a CDN, `Cache-Control` or Redis.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The mistake that hurts most: state shared between requests",
        texto:
          "On the server, a module-level variable (a “current user”, a global store, a cache not keyed by user) is the **same for all simultaneous requests**. Because there is an `await` in the middle, one request reads what another wrote, and user A may see user B’s page. Keep state **per request** (created inside the handler or the context) and only cache HTML that is **the same for everyone**. A personalized page gets `Cache-Control: private` or `no-store`, and the cache must respect `Vary` (for example, the language).",
      },
    ],
    armadilhas: [
      "Using a module-level variable or singleton (current user, global store) in the server render: the state is shared across requests and leaks data from one user to another.",
      "Putting personalized HTML in a shared cache (CDN or proxy): the next person receives someone else’s page.",
      "Using `window`, `localStorage`, `Date.now()` or `Math.random()` during render: it breaks on the server or diverges on hydration.",
      "Applying SSR to everything without measuring: server CPU and high TTFB when the page waits on slow APIs; consider SSG, caching or streaming.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between rendering on the server and hydrating?",
        resposta:
          "Rendering on the server produces the page’s HTML. Hydration runs in the browser, reuses that HTML and attaches events and state so the page becomes interactive. Without hydration, the page is only static content.",
      },
      {
        pergunta: "What gains and costs does SSR bring compared with CSR?",
        resposta:
          "Gains: faster first content and HTML ready for crawlers and link previews. Costs: CPU on every render, a TTFB that depends on the data, the need for caching and care with shared state.",
      },
    ],
  },
};
