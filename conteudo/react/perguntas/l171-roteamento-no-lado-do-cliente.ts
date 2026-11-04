import type { Pergunta } from "../../tipos";

// L171 · Roteamento no lado do cliente
export const l171: Pergunta = {
  numero: 171,
  modulo: "linkedin-rotas-e-arquitetura",
  metodo: "firstprinciples",
  pt: {
    titulo: "Roteamento no lado do cliente",
    pergunta: "O que é roteamento no lado do cliente?",
    porqueEsteMetodo:
      "O roteador parece mágica até você vê-lo nascer de problemas concretos: trocar de tela sem recarregar, refletir a tela na URL, fazer o botão voltar funcionar. Partir de links comuns e consertar uma falha por vez mostra o que cada peça faz e por que ela existe.",
    resposta30s:
      "No **roteamento no lado do cliente**, o navegador **não pede uma página nova** ao servidor a cada navegação: o JavaScript troca a URL pela **History API** (`pushState`), lê o caminho, escolhe **qual componente mostrar** e reage ao botão voltar (`popstate`). O **React Router** acrescenta tabela de rotas, `Link`, parâmetros, rotas aninhadas e redirecionamentos. O custo é o primeiro carregamento e o SEO, que **frameworks com renderização no servidor** melhoram.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma falha por vez",
        passos: [
          {
            titulo: "0. O que se quer",
            texto:
              "Um app com várias “telas” (início, lista, detalhe) em que a troca seja instantânea, a URL reflita a tela, o link possa ser compartilhado e o botão voltar funcione.",
          },
          {
            titulo: "1. A versão mais simples: links comuns",
            texto:
              'Cada `<a href="/pedidos">` pede um HTML novo ao servidor e recarrega a página inteira. → Quebra: a página pisca, o JavaScript reinicia e o estado em memória (formulários, listas, abas) se perde.',
          },
          {
            titulo: "2. Trocar a tela por estado",
            texto:
              "Um `useState` guarda a tela atual e um `switch` escolhe o componente. → Resolve: a troca é instantânea e nada recarrega. → Quebra: a URL não muda, recarregar volta ao início, o link não leva à tela e o botão voltar sai do app.",
          },
          {
            titulo: "3. Ligar a URL: a History API",
            texto:
              "`history.pushState` troca a URL sem recarregar, e o app lê `location.pathname` para escolher o componente. Os cliques em links precisam ser interceptados (`preventDefault`) para chamar `pushState` em vez de navegar. → Quebra: o botão voltar muda a URL, mas o app não percebe.",
          },
          {
            titulo: "4. Ouvir o voltar e o avançar",
            texto:
              "Ao voltar ou avançar, o navegador dispara `popstate` (o `pushState` em si não dispara). Ouça o evento e releia o caminho. → Resolve: voltar, avançar e recarregar funcionam. → Ainda falta: casar `/pedidos/42` com um padrão e extrair o parâmetro, aninhar layouts e respeitar Ctrl+clique.",
          },
          {
            titulo: "5. O que um roteador acrescenta",
            texto:
              "Uma tabela de rotas (padrão → componente), um `Link` que respeita Ctrl+clique e “abrir em nova aba”, parâmetros (`/pedidos/:id`), query string, rotas aninhadas, navegação por código, redirecionamentos, rota de “não encontrado” e, conforme a versão e o modo de uso, carregamento de dados e divisão de código por rota. É o que o React Router faz.",
          },
          {
            titulo: "6. Os limites",
            texto:
              "Sem renderização no servidor, o HTML inicial é quase vazio até o JavaScript carregar: o primeiro carregamento é mais lento e rastreadores e pré-visualizações de link enxergam menos. O servidor precisa devolver o mesmo `index.html` para qualquer caminho, ou recarregar `/pedidos/42` dá 404. A navegação também não avisa leitores de tela da mudança de página: gerencie foco e título. Frameworks com renderização no servidor alteram esse quadro.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um roteador de brinquedo",
        legenda: "TSX",
        codigo: [
          'import { useEffect, useState } from "react";',
          "function irPara(destino: string) {",
          '  history.pushState(null, "", destino); // troca a URL sem recarregar',
          '  dispatchEvent(new PopStateEvent("popstate")); // avisa o app',
          "}",
          "export function App() {",
          "  const [caminho, setCaminho] = useState(location.pathname);",
          "  useEffect(() => {",
          "    const ler = () => setCaminho(location.pathname); // também roda no voltar e no avançar",
          '    addEventListener("popstate", ler);',
          '    return () => removeEventListener("popstate", ler);',
          "  }, []);",
          "  const link = (d: string, texto: string) => (",
          "    <a href={d} onClick={(e) => { e.preventDefault(); irPara(d); }}>{texto}</a>",
          "  );",
          "  return (",
          "    <>",
          '      <nav>{link("/", "Início")} {link("/pedidos", "Pedidos")}</nav>',
          '      <h1>{caminho === "/pedidos" ? "Pedidos" : "Início"}</h1>',
          "    </>",
          "  );",
          "}",
        ].join("\n"),
        nota: "Faltam parâmetros, rotas aninhadas, Ctrl+clique, rolagem e foco: é por isso que se usa um roteador pronto. Um evento `popstate` emitido à mão é só um atalho didático.",
      },
      {
        tipo: "codigo",
        titulo: "O mesmo, com React Router e uma rota aninhada",
        legenda: "TSX",
        codigo: [
          'import { createBrowserRouter, RouterProvider, Link, Outlet, useParams } from "react-router-dom";',
          "",
          "const Layout = () => (",
          "  <>",
          '    <nav><Link to="/pedidos">Pedidos</Link></nav>',
          "    <Outlet /> {/* aqui entra a rota filha que casou */}",
          "  </>",
          ");",
          'const Pedido = () => <h1>Pedido {useParams().id}</h1>; // em /pedidos/42, id é "42"',
          "",
          "const roteador = createBrowserRouter([",
          "  {",
          '    path: "/",',
          "    element: <Layout />,",
          "    children: [",
          '      { path: "pedidos", element: <h1>Lista</h1> },',
          '      { path: "pedidos/:id", element: <Pedido /> },',
          "    ],",
          "  },",
          "]);",
          "export const App = () => <RouterProvider router={roteador} />;",
        ].join("\n"),
        nota: "A API do roteador muda entre versões (o nome do pacote, os modos de uso, loaders e actions): confira a documentação dele.",
      },
      {
        tipo: "tabela",
        titulo: "As peças do React Router",
        colunas: ["Peça", "Para que serve"],
        linhas: [
          [
            "`createBrowserRouter` e `RouterProvider` (ou `BrowserRouter`)",
            "Criam o roteador sobre a History API e o disponibilizam ao app; `HashRouter` usa o `#` na URL e `MemoryRouter` serve a testes",
          ],
          [
            "`Routes` e `Route` (ou a lista de objetos de rota)",
            "A tabela caminho → elemento; vence a rota mais específica que casa",
          ],
          ["`Link` e `NavLink`", "Navegam sem recarregar; o `NavLink` sabe se o link está ativo"],
          ["`Outlet`", "O lugar, no componente pai, onde a rota filha aparece (layouts e rotas aninhadas)"],
          ["`Navigate` e `useNavigate`", "Redirecionar e navegar por código"],
          [
            "`useParams`, `useSearchParams` e `useLocation`",
            "Ler os parâmetros do caminho, a query string e a localização atual",
          ],
          [
            "Loaders e actions (modo de dados)",
            "Carregar dados e tratar envios por rota; dependem da versão e do modo de uso",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rotas aninhadas",
        texto:
          "Um caminho como `/pedidos/42` casa com uma **cadeia** de rotas: a pai (`/`, o layout), a de `pedidos` e a filha com o parâmetro `:id`. Cada pai desenha o seu pedaço e marca com `<Outlet />` onde a filha entra. Vantagens: o layout (menu, cabeçalho) **continua montado**, com o seu estado, enquanto só a parte de baixo muda, e cada nível pode ter o seu carregamento, o seu erro e o seu código separado.",
      },
    ],
    armadilhas: [
      "Usar `<a href>` comum na navegação interna: o app recarrega inteiro e perde o estado; use o `Link` do roteador.",
      "Esquecer o fallback no servidor: abrir ou recarregar `/pedidos/42` direto dá 404, porque só existe o `index.html` na raiz.",
      "Achar que o roteador protege rotas: ele só decide o que renderizar no navegador; a segurança está na API.",
      "Ignorar a acessibilidade da navegação: sem mover o foco e atualizar o `document.title`, o leitor de tela não percebe a mudança de página.",
    ],
    autoteste: [
      {
        pergunta: "Por que o `pushState` sozinho não basta para fazer um roteador?",
        resposta:
          "Porque ele troca a URL sem avisar o app e não dispara `popstate`. É preciso atualizar o estado depois dele e ouvir `popstate` para reagir ao voltar e ao avançar.",
      },
      {
        pergunta: "O que são rotas aninhadas e o que as torna possíveis?",
        resposta:
          "São rotas filhas dentro de uma rota pai: o caminho casa com uma cadeia, o pai desenha o seu layout e o `Outlet` marca onde a filha aparece. O layout do pai continua montado enquanto a filha muda.",
      },
    ],
  },
  en: {
    titulo: "Client-side routing",
    pergunta: "What is client-side routing?",
    porqueEsteMetodo:
      "A router looks like magic until you watch it grow out of concrete problems: switching screens without reloading, reflecting the screen in the URL, making the back button work. Starting from plain links and fixing one flaw at a time shows what each piece does and why it exists.",
    resposta30s:
      "With **client-side routing**, the browser **does not request a new page** from the server on every navigation: JavaScript changes the URL through the **History API** (`pushState`), reads the path, chooses **which component to show** and reacts to the back button (`popstate`). **React Router** adds a route table, `Link`, params, nested routes and redirects. The cost is the first load and SEO, which **frameworks with server rendering** improve.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one flaw at a time",
        passos: [
          {
            titulo: "0. What we want",
            texto:
              "An app with several “screens” (home, list, detail) where switching is instant, the URL reflects the screen, the link can be shared and the back button works.",
          },
          {
            titulo: "1. The simplest version: plain links",
            texto:
              'Each `<a href="/orders">` requests new HTML from the server and reloads the whole page. → Breaks: the page flashes, JavaScript restarts and in-memory state (forms, lists, tabs) is lost.',
          },
          {
            titulo: "2. Switching screens with state",
            texto:
              "A `useState` holds the current screen and a `switch` picks the component. → Fixes: switching is instant and nothing reloads. → Breaks: the URL does not change, reloading goes back to the start, the link does not lead to the screen and the back button leaves the app.",
          },
          {
            titulo: "3. Wiring up the URL: the History API",
            texto:
              "`history.pushState` changes the URL without reloading, and the app reads `location.pathname` to choose the component. Link clicks must be intercepted (`preventDefault`) to call `pushState` instead of navigating. → Breaks: the back button changes the URL, but the app does not notice.",
          },
          {
            titulo: "4. Listening for back and forward",
            texto:
              "On back or forward, the browser fires `popstate` (`pushState` itself does not). Listen for the event and re-read the path. → Fixes: back, forward and reload work. → Still missing: matching `/orders/42` against a pattern and extracting the parameter, nesting layouts and respecting Ctrl+click.",
          },
          {
            titulo: "5. What a router adds",
            texto:
              "A route table (pattern → component), a `Link` that respects Ctrl+click and “open in new tab”, parameters (`/orders/:id`), query strings, nested routes, programmatic navigation, redirects, a “not found” route and, depending on the version and the mode, data loading and code splitting per route. That is what React Router does.",
          },
          {
            titulo: "6. The limits",
            texto:
              "Without server rendering, the initial HTML is nearly empty until JavaScript loads: the first load is slower and crawlers and link previews see less. The server must return the same `index.html` for any path, or reloading `/orders/42` gives a 404. Navigation also does not tell screen readers the page changed: manage focus and title. Frameworks with server rendering change this picture.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A toy router",
        legenda: "TSX",
        codigo: [
          'import { useEffect, useState } from "react";',
          "function goTo(destination: string) {",
          '  history.pushState(null, "", destination); // changes the URL without reloading',
          '  dispatchEvent(new PopStateEvent("popstate")); // tells the app',
          "}",
          "export function App() {",
          "  const [path, setPath] = useState(location.pathname);",
          "  useEffect(() => {",
          "    const read = () => setPath(location.pathname); // also runs on back and forward",
          '    addEventListener("popstate", read);',
          '    return () => removeEventListener("popstate", read);',
          "  }, []);",
          "  const link = (to: string, text: string) => (",
          "    <a href={to} onClick={(e) => { e.preventDefault(); goTo(to); }}>{text}</a>",
          "  );",
          "  return (",
          "    <>",
          '      <nav>{link("/", "Home")} {link("/orders", "Orders")}</nav>',
          '      <h1>{path === "/orders" ? "Orders" : "Home"}</h1>',
          "    </>",
          "  );",
          "}",
        ].join("\n"),
        nota: "Parameters, nested routes, Ctrl+click, scrolling and focus are missing: that is why a ready-made router is used. A hand-fired `popstate` event is only a teaching shortcut.",
      },
      {
        tipo: "codigo",
        titulo: "The same with React Router and a nested route",
        legenda: "TSX",
        codigo: [
          'import { createBrowserRouter, RouterProvider, Link, Outlet, useParams } from "react-router-dom";',
          "",
          "const Layout = () => (",
          "  <>",
          '    <nav><Link to="/orders">Orders</Link></nav>',
          "    <Outlet /> {/* the matching child route renders here */}",
          "  </>",
          ");",
          'const Order = () => <h1>Order {useParams().id}</h1>; // at /orders/42, id is "42"',
          "",
          "const router = createBrowserRouter([",
          "  {",
          '    path: "/",',
          "    element: <Layout />,",
          "    children: [",
          '      { path: "orders", element: <h1>List</h1> },',
          '      { path: "orders/:id", element: <Order /> },',
          "    ],",
          "  },",
          "]);",
          "export const App = () => <RouterProvider router={router} />;",
        ].join("\n"),
        nota: "The router’s API changes between versions (the package name, the usage modes, loaders and actions): check its documentation.",
      },
      {
        tipo: "tabela",
        titulo: "The pieces of React Router",
        colunas: ["Piece", "What it is for"],
        linhas: [
          [
            "`createBrowserRouter` and `RouterProvider` (or `BrowserRouter`)",
            "Create the router on top of the History API and make it available to the app; `HashRouter` uses the `#` in the URL and `MemoryRouter` is for tests",
          ],
          [
            "`Routes` and `Route` (or the list of route objects)",
            "The path → element table; the most specific matching route wins",
          ],
          ["`Link` and `NavLink`", "Navigate without reloading; `NavLink` knows whether the link is active"],
          ["`Outlet`", "The place, in the parent component, where the child route appears (layouts and nested routes)"],
          ["`Navigate` and `useNavigate`", "Redirect and navigate from code"],
          [
            "`useParams`, `useSearchParams` and `useLocation`",
            "Read the path parameters, the query string and the current location",
          ],
          [
            "Loaders and actions (data mode)",
            "Load data and handle submissions per route; they depend on the version and the usage mode",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Nested routes",
        texto:
          "A path like `/orders/42` matches a **chain** of routes: the parent (`/`, the layout), the `orders` route and the child with the `:id` parameter. Each parent draws its own piece and marks with `<Outlet />` where the child goes. Advantages: the layout (menu, header) **stays mounted**, with its state, while only the lower part changes, and each level can have its own loading, its own error and its own code split.",
      },
    ],
    armadilhas: [
      "Using a plain `<a href>` for internal navigation: the app reloads entirely and loses its state; use the router’s `Link`.",
      "Forgetting the server fallback: opening or reloading `/orders/42` directly gives a 404, because only `index.html` exists at the root.",
      "Thinking the router protects routes: it only decides what to render in the browser; security lives in the API.",
      "Ignoring navigation accessibility: without moving focus and updating `document.title`, a screen reader does not notice the page change.",
    ],
    autoteste: [
      {
        pergunta: "Why is `pushState` alone not enough to build a router?",
        resposta:
          "Because it changes the URL without telling the app and does not fire `popstate`. You have to update the state after it and listen for `popstate` to react to back and forward.",
      },
      {
        pergunta: "What are nested routes and what makes them possible?",
        resposta:
          "They are child routes inside a parent route: the path matches a chain, the parent draws its layout and the `Outlet` marks where the child appears. The parent’s layout stays mounted while the child changes.",
      },
    ],
  },
};
