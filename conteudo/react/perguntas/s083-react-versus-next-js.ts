import type { Pergunta } from "../../tipos";

// S83 · React versus Next.js
export const s083: Pergunta = {
  numero: 683,
  modulo: "simplilearn-next-testes-ts",
  metodo: "design",
  pt: {
    titulo: "React versus Next.js",
    pergunta: "Qual é a principal diferença entre React e Next.js?",
    porqueEsteMetodo:
      "Isto é uma escolha de arquitetura, não uma definição de dicionário. Partir dos requisitos de uma aplicação completa e ver quem resolve cada um deixa a diferença concreta e dá um critério para decidir.",
    resposta30s:
      "O **React** é uma **biblioteca de interface**: componentes, estado e renderização, sem opinião sobre rotas, servidor ou build. O **Next.js** é um **framework construído sobre o React** que acrescenta o que uma aplicação completa precisa: **roteamento por pastas, renderização no servidor ou estática, busca de dados, otimização de imagens e fontes, metadados para SEO** e um caminho de deploy. Com o React puro você escolhe e integra cada peça; com o Next.js você aceita convenções em troca de menos configuração.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Uma aplicação completa precisa navegar entre páginas (**roteamento**), decidir onde renderizar (navegador, servidor ou no build), **buscar dados**, ser encontrada e ter boa prévia de links (**SEO**), carregar rápido (**imagens, fontes**, divisão de código), às vezes expor uma API e ser **publicada**.",
          },
          {
            titulo: "2. O que o React resolve sozinho",
            texto:
              "A camada de interface: componentes, estado, efeitos, composição. Ele não traz roteador, não define como montar o projeto e não diz como buscar dados. Numa aplicação de página única só com React, o navegador baixa o JavaScript e monta a tela no cliente.",
          },
          {
            titulo: "3. O que exige peças à parte",
            texto:
              "Um bundler com servidor de desenvolvimento (por exemplo o Vite), um roteador (por exemplo o React Router), uma biblioteca de dados, renderização no servidor se for preciso, otimização de imagens, gestão de metadados e a hospedagem. A vantagem é o controle total; o custo é integrar e manter tudo.",
          },
          {
            titulo: "4. O que o Next.js decide por você",
            texto:
              "Rotas a partir das pastas (`app/`), layouts aninhados, renderização escolhida por rota (estática, no servidor, com streaming), busca de dados no servidor, componentes para imagens e fontes, API de metadados, endpoints no mesmo projeto (Route Handlers) e Server Actions.",
          },
          {
            titulo: "5. Server Components",
            texto:
              'No App Router do Next.js, os componentes são Server Components por padrão: rodam no servidor, não enviam o próprio JavaScript ao navegador e podem usar `async`/`await` para buscar dados. A diretiva `"use client"` marca o limite do que precisa de estado, efeitos e eventos (veja C28 e L141). O modelo vem do React; o Next.js o integra às rotas e ao build.',
          },
          {
            titulo: "6. O custo do acoplamento",
            texto:
              "Você adota as convenções do framework: estrutura de pastas, modelo de renderização e de cache, o ritmo de suas atualizações. Parte dos recursos depende de onde a aplicação roda, e código escrito com as APIs do framework (como a navegação e as imagens dele) é menos portátil que React puro.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Quem resolve cada requisito",
        colunas: ["Necessidade", "Só React", "Com Next.js"],
        linhas: [
          ["Roteamento", "Biblioteca à parte, como o React Router", "Rotas pelas pastas, com layouts aninhados"],
          [
            "Onde renderizar",
            "Normalmente no navegador; renderizar no servidor exige montagem própria",
            "Escolhido por rota: no build, no servidor, com streaming, e no cliente quando preciso",
          ],
          [
            "Busca de dados",
            "Você escolhe: efeito, biblioteca de dados, cache e revalidação",
            "`async`/`await` em Server Components, Route Handlers e Server Actions",
          ],
          [
            "SEO e prévia de links",
            "O HTML inicial vem quase vazio; metadados e conteúdo dependem do JavaScript rodar",
            "HTML já renderizado e API de metadados por página",
          ],
          [
            "Imagens e fontes",
            "Você otimiza (formatos, tamanhos, carregamento)",
            "Componente de imagem e carregamento de fontes embutidos",
          ],
          [
            "API e back-end",
            "Serviço separado",
            "Endpoints e Server Actions no mesmo projeto (um back-end separado continua possível)",
          ],
          [
            "Build e deploy",
            "Você escolhe o bundler e a hospedagem",
            "Build integrado; roda num servidor Node, numa plataforma, ou como páginas estáticas quando o caso permite",
          ],
        ],
        nota: "Recursos mudam entre versões: confira react.dev e a documentação do Next.js.",
      },
      {
        tipo: "codigo",
        titulo: "Uma página que busca dados no servidor",
        legenda: "app/produtos/page.tsx",
        codigo: [
          "// o arquivo vira a rota /produtos; é um Server Component por padrão",
          "type Produto = { id: number; nome: string };",
          "",
          "export default async function Produtos() {",
          '  const resposta = await fetch("https://api.exemplo.com/produtos");',
          "  const produtos: Produto[] = await resposta.json();",
          "",
          "  return (",
          "    <ul>",
          "      {produtos.map((p) => (",
          "        <li key={p.id}>{p.nome}</li>",
          "      ))}",
          "    </ul>",
          "  );",
          "}",
        ].join("\n"),
        nota: "O componente roda no servidor, espera os dados com `await` e a página sai com o conteúdo já montado. Em React puro, o mesmo pede roteador, um efeito ou biblioteca de dados e um estado de carregamento.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Use o **Next.js** quando a aplicação tem várias páginas com endereço próprio, precisa de **SEO** e prévia de links, de boa primeira carga, de dados lidos no servidor, ou quando a equipe quer um caminho completo e padronizado. Prefira **React com montagem própria** (por exemplo com Vite) para sistemas internos atrás de login, onde buscadores não importam, para widgets embutidos em outra página, protótipos e casos em que você precisa de controle total sobre o build e a hospedagem. A documentação do React hoje recomenda começar aplicações novas por um framework; confira react.dev.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não é React contra Next.js",
        texto:
          "O Next.js usa o React: tudo o que você aprendeu de componentes, estado e Hooks continua valendo, e aprender React vem antes. A pergunta de verdade é “React com um framework ou com montagem própria?”. Não confunda também o Next.js (um framework de interface e rotas) com o Node.js (o ambiente de execução em que ele costuma rodar).",
      },
    ],
    armadilhas: [
      "Tratar os dois como concorrentes: o Next.js é React com mais coisas em volta.",
      "Achar que o Next.js obriga a renderizar tudo no servidor: a forma de renderizar é escolhida por rota, e dá para gerar páginas estáticas no build.",
      'Usar estado, efeitos ou eventos em um Server Component: isso exige `"use client"` no arquivo, ou um componente de cliente separado.',
      "Escolher o framework por moda: sem SEO, sem dados no servidor e sem equipe que domine as convenções, o acoplamento é custo sem retorno.",
    ],
    autoteste: [
      {
        pergunta: "Por que se diz que o React é uma biblioteca e o Next.js, um framework?",
        resposta:
          "O React cuida só da interface e você monta o resto (rotas, build, dados). O Next.js usa o React e já traz roteamento, renderização no servidor ou estática, busca de dados, otimizações e convenções de projeto.",
      },
      {
        pergunta: "Cite dois requisitos que justificam o Next.js em vez de uma aplicação só com React.",
        resposta:
          "Por exemplo: SEO e prévia de links, com HTML já renderizado; boa primeira carga; páginas que leem dados no servidor; várias rotas com layouts compartilhados e um caminho de deploy padronizado.",
      },
    ],
  },
  en: {
    titulo: "React versus Next.js",
    pergunta: "What is the main difference between React and Next.js?",
    porqueEsteMetodo:
      "This is an architecture choice, not a dictionary definition. Starting from the requirements of a complete application and seeing who solves each one makes the difference concrete and gives you a criterion for deciding.",
    resposta30s:
      "**React** is a **UI library**: components, state and rendering, with no opinion on routing, servers or builds. **Next.js** is a **framework built on top of React** that adds what a complete application needs: **folder-based routing, server or static rendering, data fetching, image and font optimization, metadata for SEO** and a path to deployment. With plain React you choose and wire up every piece; with Next.js you accept conventions in exchange for less configuration.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The method applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "A complete application has to move between pages (**routing**), decide where to render (browser, server or at build time), **fetch data**, be found and show good link previews (**SEO**), load fast (**images, fonts**, code splitting), sometimes expose an API, and be **deployed**.",
          },
          {
            titulo: "2. What React solves on its own",
            texto:
              "The interface layer: components, state, effects, composition. It brings no router, does not define how to assemble the project and does not say how to fetch data. In a single-page application with only React, the browser downloads the JavaScript and builds the screen on the client.",
          },
          {
            titulo: "3. What needs separate pieces",
            texto:
              "A bundler with a dev server (for example Vite), a router (for example React Router), a data library, server rendering if you need it, image optimization, metadata handling and hosting. The upside is full control; the cost is wiring and maintaining all of it.",
          },
          {
            titulo: "4. What Next.js decides for you",
            texto:
              "Routes from the folders (`app/`), nested layouts, rendering chosen per route (static, on the server, streaming), server-side data fetching, components for images and fonts, a metadata API, endpoints in the same project (Route Handlers) and Server Actions.",
          },
          {
            titulo: "5. Server Components",
            texto:
              'In the Next.js App Router, components are Server Components by default: they run on the server, do not ship their own JavaScript to the browser and can use `async`/`await` to fetch data. The `"use client"` directive marks the boundary for what needs state, effects and events (see C28 and L141). The model comes from React; Next.js wires it into routes and the build.',
          },
          {
            titulo: "6. The cost of coupling",
            texto:
              "You adopt the framework’s conventions: folder structure, rendering and caching model, the pace of its updates. Some features depend on where the application runs, and code written with the framework’s APIs (such as its navigation and images) is less portable than plain React.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Who solves each requirement",
        colunas: ["Need", "React alone", "With Next.js"],
        linhas: [
          ["Routing", "A separate library, such as React Router", "Routes from folders, with nested layouts"],
          [
            "Where to render",
            "Usually in the browser; server rendering needs your own setup",
            "Chosen per route: at build time, on the server, streaming, and on the client when needed",
          ],
          [
            "Data fetching",
            "Your choice: effects, a data library, caching and revalidation",
            "`async`/`await` in Server Components, Route Handlers and Server Actions",
          ],
          [
            "SEO and link previews",
            "The initial HTML is nearly empty; metadata and content depend on JavaScript running",
            "HTML already rendered, plus a metadata API per page",
          ],
          [
            "Images and fonts",
            "You optimize them (formats, sizes, loading)",
            "Image component and font loading built in",
          ],
          [
            "API and back end",
            "A separate service",
            "Endpoints and Server Actions in the same project (a separate back end is still possible)",
          ],
          [
            "Build and deploy",
            "You choose the bundler and the hosting",
            "Integrated build; runs on a Node server, on a platform, or as static pages when the case allows",
          ],
        ],
        nota: "Features change between versions: check react.dev and the Next.js documentation.",
      },
      {
        tipo: "codigo",
        titulo: "A page that fetches data on the server",
        legenda: "app/products/page.tsx",
        codigo: [
          "// the file becomes the /products route; it is a Server Component by default",
          "type Product = { id: number; name: string };",
          "",
          "export default async function Products() {",
          '  const response = await fetch("https://api.example.com/products");',
          "  const products: Product[] = await response.json();",
          "",
          "  return (",
          "    <ul>",
          "      {products.map((p) => (",
          "        <li key={p.id}>{p.name}</li>",
          "      ))}",
          "    </ul>",
          "  );",
          "}",
        ].join("\n"),
        nota: "The component runs on the server, waits for the data with `await` and the page goes out with its content already built. In plain React, the same thing needs a router, an effect or a data library, and a loading state.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Use **Next.js** when the application has several pages with their own addresses, needs **SEO** and link previews, a good first load, data read on the server, or when the team wants a complete, standardized path. Prefer **React with your own setup** (for example with Vite) for internal systems behind a login where search engines do not matter, for widgets embedded in another page, for prototypes, and when you need full control over the build and hosting. The React documentation today recommends starting new applications with a framework; check react.dev.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "It is not React against Next.js",
        texto:
          "Next.js uses React: everything you learned about components, state and Hooks still applies, and learning React comes first. The real question is “React with a framework or with your own setup?”. Do not mix up Next.js (a framework for UI and routing) with Node.js (the runtime where it usually runs) either.",
      },
    ],
    armadilhas: [
      "Treating them as competitors: Next.js is React with more around it.",
      "Thinking Next.js forces everything to render on the server: the way to render is chosen per route, and pages can be generated statically at build time.",
      'Using state, effects or events in a Server Component: that requires `"use client"` in the file, or a separate client component.',
      "Picking the framework because it is trendy: without SEO needs, server-side data or a team that knows the conventions, the coupling is cost with no return.",
    ],
    autoteste: [
      {
        pergunta: "Why is React called a library and Next.js a framework?",
        resposta:
          "React handles only the interface and you assemble the rest (routes, build, data). Next.js uses React and already brings routing, server or static rendering, data fetching, optimizations and project conventions.",
      },
      {
        pergunta: "Name two requirements that justify Next.js over an application with only React.",
        resposta:
          "For example: SEO and link previews, with HTML already rendered; a good first load; pages that read data on the server; several routes with shared layouts and a standardized deployment path.",
      },
    ],
  },
};
