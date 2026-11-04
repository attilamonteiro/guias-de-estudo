import type { Pergunta } from "../../tipos";

// L174 · O que são rotas protegidas
export const l174: Pergunta = {
  numero: 174,
  modulo: "linkedin-rotas-e-arquitetura",
  metodo: "playbook",
  pt: {
    titulo: "O que são rotas protegidas",
    pergunta: "O que são rotas protegidas?",
    porqueEsteMetodo:
      "O padrão é simples de descrever e fácil de errar nos detalhes: o estado de carregando, a volta ao destino original e o limite da proteção no cliente. Um playbook dá a ordem dos passos e o sinal de que cada um está certo.",
    resposta30s:
      "**Rotas protegidas** são rotas cujo conteúdo só aparece depois de um **guarda** conferir a sessão (e, se for o caso, o papel ou a permissão): sem sessão, o guarda **redireciona para o login** e, depois de entrar, **volta ao destino original**. É preciso um estado de **carregando**, para não piscar a tela de login. Mas isso é só **experiência de uso**: a segurança de verdade está na **API**, que autentica e autoriza cada requisição.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: do mapa de rotas ao teste",
        passos: [
          {
            titulo: "Defina o que protege cada rota",
            texto:
              "Liste as rotas públicas (login, páginas institucionais), as que exigem sessão e as que exigem papel ou permissão (admin, financeiro). Sinal de acerto: cada rota privada tem uma regra de acesso escrita, e não um `if` espalhado pelas telas.",
          },
          {
            titulo: "Tenha o estado de sessão com três valores",
            texto:
              "`carregando`, `autenticado` e `anonimo` (veja L170). O papel ou as permissões chegam do servidor junto com o usuário.",
          },
          {
            titulo: "Crie o guarda",
            texto:
              "Um componente lê a sessão e decide: `carregando` mostra um indicador (nunca o login); `anonimo` redireciona ao login com `<Navigate replace>` guardando o destino; `autenticado` sem o papel exigido mostra “sem permissão” (o 403 da interface); nos demais casos renderiza `<Outlet />` ou `children`.",
          },
          {
            titulo: "Use o guarda como rota de layout",
            texto:
              "Agrupe todas as rotas privadas sob um único elemento guarda, em vez de repetir a verificação em cada página. Rotas que exigem um papel ganham um guarda interno com o papel. Sinal de acerto: uma rota privada nova nasce protegida só por estar no grupo.",
          },
          {
            titulo: "Volte ao destino original",
            texto:
              "Ao redirecionar, leve o local de origem (`state={{ de: location }}` ou um parâmetro `?proximo=`); depois do login, navegue até ele com `replace`. Valide que o destino é um caminho interno (começa com `/`, mas não com `//`), senão o parâmetro vira um redirecionamento aberto.",
          },
          {
            titulo: "Considere os loaders do roteador",
            texto:
              "Nos roteadores com loaders, uma função roda antes de a rota renderizar e pode redirecionar (`redirect`), sem renderizar a tela e só depois mandar embora. O mesmo loader carrega os dados da rota. Depende da versão e do modo de uso: confira a documentação do roteador.",
          },
          {
            titulo: "Trate o 401 e o 403 da API, e teste",
            texto:
              "A API é a barreira real: um 401 vira “sessão expirada” (volta ao login) e um 403 vira “sem permissão”. Teste os quatro caminhos: anônimo é redirecionado, papel errado vê o 403, papel certo entra e o login devolve ao destino.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O guarda como rota de layout",
        legenda: "TSX",
        codigo: [
          'import { Navigate, Outlet, useLocation } from "react-router-dom";',
          "",
          "export function RotaProtegida({ papel }: { papel?: string }) {",
          "  const { status, usuario } = useAuth(); // carregando | autenticado | anonimo",
          "  const local = useLocation();",
          "",
          '  if (status === "carregando") return <p role="status">Verificando sessão…</p>;',
          '  if (status === "anonimo") return <Navigate to="/login" state={{ de: local }} replace />;',
          "  if (papel && !usuario?.papeis.includes(papel)) {",
          '    return <p role="alert">Você não tem acesso a esta página.</p>; // o 403 da interface',
          "  }",
          "  return <Outlet />;",
          "}",
          "",
          "// no roteador: <Route element={<RotaProtegida />}> ...rotas privadas... </Route>",
          '// só para admin: <Route element={<RotaProtegida papel="admin" />}> ... </Route>',
        ].join("\n"),
        nota: "O `useAuth` é o hook do estado de sessão (veja L170). O papel vem do servidor; aqui ele só decide o que mostrar.",
      },
      {
        tipo: "codigo",
        titulo: "A mesma ideia com um loader",
        legenda: "TypeScript",
        codigo: [
          'import { redirect } from "react-router-dom";',
          "",
          "export async function exigirSessao({ request }: { request: Request }) {",
          "  const sessao = await buscarSessao(); // pergunta ao servidor quem é a pessoa",
          "  if (!sessao) {",
          "    const { pathname, search } = new URL(request.url);",
          "    throw redirect(`/login?proximo=${encodeURIComponent(pathname + search)}`);",
          "  }",
          "  return sessao;",
          "}",
          "",
          '// na rota: { path: "/painel", loader: exigirSessao, element: <Painel /> }',
          '// no login: use o destino só se for interno (começa com "/" e não com "//")',
        ].join("\n"),
        nota: "Os loaders existem em certos modos de uso do roteador e mudam entre versões; confira a documentação. A ideia é a mesma: decidir e redirecionar antes de renderizar.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Cliente é experiência, API é segurança",
        texto:
          "A proteção no cliente evita mostrar uma tela que a pessoa não poderia usar, mas **não impede ninguém** de chamar o endpoint. A segurança real está na **API**, que autentica e autoriza cada requisição (401 e 403) e só devolve os dados de quem tem permissão. Papéis e permissões vêm do servidor e são conferidos de novo por ele. O mesmo vale para autorização no front em geral: botões, menus e campos escondidos refletem o que o servidor aceita, não o decidem.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O código da tela privada continua público",
        texto:
          "O bundle e os pedaços carregados sob demanda podem ser baixados por qualquer pessoa, mesmo que a rota esteja protegida: não coloque segredos, regras sensíveis nem dados privados no código da tela. Dados privados só devem chegar depois da autorização, pela API. Não renderize o conteúdo privado antes da verificação, nem confie num valor de `localStorage` para afirmar que alguém está logado.",
      },
    ],
    armadilhas: [
      "Redirecionar ao login enquanto a sessão ainda está sendo verificada: quem está logado é expulso ou vê a tela piscar.",
      "Ler o papel de um valor editável pelo usuário (como `localStorage`) ou do conteúdo de um JWT sem verificação: o cliente pode alterá-lo; o servidor decide.",
      "Usar o destino do redirecionamento sem validar (`?proximo=https://site-mau`): vira redirecionamento aberto; aceite só caminhos internos.",
      "Achar que a rota protegida no front protege os dados: sem verificação na API, basta chamar o endpoint direto.",
    ],
    autoteste: [
      {
        pergunta: "Por que o guarda de rota precisa de um estado de carregando?",
        resposta:
          "Porque ao abrir o app a sessão ainda não foi verificada. Sem esse estado, a pessoa autenticada seria redirecionada ao login ou veria a tela piscar antes de entrar.",
      },
      {
        pergunta: "A rota protegida no cliente garante segurança? O que a garante?",
        resposta:
          "Não: é só experiência de uso, porque quem usa controla o navegador. A segurança vem da API, que autentica e autoriza cada requisição e só devolve os dados a quem tem permissão.",
      },
    ],
  },
  en: {
    titulo: "What are protected routes",
    pergunta: "What are protected routes?",
    porqueEsteMetodo:
      "The pattern is simple to describe and easy to get wrong in the details: the loading state, the return to the original destination and the limit of client-side protection. A playbook gives the order of the steps and the sign that each one is right.",
    resposta30s:
      "**Protected routes** are routes whose content only appears after a **guard** checks the session (and, if needed, the role or permission): without a session, the guard **redirects to the login** and, after signing in, **returns to the original destination**. It needs a **loading** state so the login screen does not flash. But this is only **user experience**: real security lives in the **API**, which authenticates and authorizes every request.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from the route map to the test",
        passos: [
          {
            titulo: "Define what protects each route",
            texto:
              "List the public routes (login, marketing pages), the ones that require a session and the ones that require a role or permission (admin, finance). Sign you got it right: every private route has a written access rule, not an `if` scattered across screens.",
          },
          {
            titulo: "Have a session state with three values",
            texto:
              "`loading`, `authenticated` and `anonymous` (see L170). The role or permissions arrive from the server along with the user.",
          },
          {
            titulo: "Create the guard",
            texto:
              "A component reads the session and decides: `loading` shows an indicator (never the login); `anonymous` redirects to the login with `<Navigate replace>`, remembering the destination; `authenticated` without the required role shows “no permission” (the interface’s 403); otherwise it renders `<Outlet />` or `children`.",
          },
          {
            titulo: "Use the guard as a layout route",
            texto:
              "Group all private routes under a single guard element instead of repeating the check on every page. Routes that need a role get an inner guard with the role. Sign you got it right: a new private route is born protected just by being in the group.",
          },
          {
            titulo: "Return to the original destination",
            texto:
              "When redirecting, carry the origin (`state={{ from: location }}` or a `?next=` parameter); after login, navigate to it with `replace`. Validate that the destination is an internal path (starts with `/` but not with `//`), or the parameter becomes an open redirect.",
          },
          {
            titulo: "Consider the router’s loaders",
            texto:
              "In routers with loaders, a function runs before the route renders and can redirect (`redirect`), without rendering the screen and only then sending the person away. The same loader fetches the route’s data. It depends on the version and the usage mode: check the router’s documentation.",
          },
          {
            titulo: "Handle the API’s 401 and 403, and test",
            texto:
              "The API is the real barrier: a 401 becomes “session expired” (back to the login) and a 403 becomes “no permission”. Test the four paths: anonymous is redirected, the wrong role sees the 403, the right role gets in and login returns to the destination.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The guard as a layout route",
        legenda: "TSX",
        codigo: [
          'import { Navigate, Outlet, useLocation } from "react-router-dom";',
          "",
          "export function ProtectedRoute({ role }: { role?: string }) {",
          "  const { status, user } = useAuth(); // loading | authenticated | anonymous",
          "  const location = useLocation();",
          "",
          '  if (status === "loading") return <p role="status">Checking session…</p>;',
          '  if (status === "anonymous") return <Navigate to="/login" state={{ from: location }} replace />;',
          "  if (role && !user?.roles.includes(role)) {",
          '    return <p role="alert">You do not have access to this page.</p>; // the interface’s 403',
          "  }",
          "  return <Outlet />;",
          "}",
          "",
          "// in the router: <Route element={<ProtectedRoute />}> ...private routes... </Route>",
          '// admin only: <Route element={<ProtectedRoute role="admin" />}> ... </Route>',
        ].join("\n"),
        nota: "`useAuth` is the session-state hook (see L170). The role comes from the server; here it only decides what to show.",
      },
      {
        tipo: "codigo",
        titulo: "The same idea with a loader",
        legenda: "TypeScript",
        codigo: [
          'import { redirect } from "react-router-dom";',
          "",
          "export async function requireSession({ request }: { request: Request }) {",
          "  const session = await fetchSession(); // asks the server who the person is",
          "  if (!session) {",
          "    const { pathname, search } = new URL(request.url);",
          "    throw redirect(`/login?next=${encodeURIComponent(pathname + search)}`);",
          "  }",
          "  return session;",
          "}",
          "",
          '// on the route: { path: "/dashboard", loader: requireSession, element: <Dashboard /> }',
          '// at login: use the destination only if internal (starts with "/" but not "//")',
        ].join("\n"),
        nota: "Loaders exist in certain router usage modes and change between versions; check the documentation. The idea is the same: decide and redirect before rendering.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The client is experience, the API is security",
        texto:
          "Client-side protection avoids showing a screen the person could not use, but it **does not stop anyone** from calling the endpoint. Real security lives in the **API**, which authenticates and authorizes every request (401 and 403) and returns data only to those with permission. Roles and permissions come from the server and are checked again by it. The same goes for front-end authorization in general: hidden buttons, menus and fields reflect what the server accepts; they do not decide it.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The private screen’s code is still public",
        texto:
          "The bundle and the lazily loaded chunks can be downloaded by anyone, even if the route is protected: do not put secrets, sensitive rules or private data in the screen’s code. Private data should only arrive after authorization, through the API. Do not render private content before the check, and do not trust a `localStorage` value to claim someone is signed in.",
      },
    ],
    armadilhas: [
      "Redirecting to the login while the session is still being checked: someone signed in is thrown out or sees the screen flash.",
      "Reading the role from a user-editable value (such as `localStorage`) or from the contents of an unverified JWT: the client can change it; the server decides.",
      "Using the redirect destination without validating it (`?next=https://evil-site`): it becomes an open redirect; accept internal paths only.",
      "Thinking a front-end protected route protects the data: without a check in the API, calling the endpoint directly is enough.",
    ],
    autoteste: [
      {
        pergunta: "Why does the route guard need a loading state?",
        resposta:
          "Because when the app opens the session has not been checked yet. Without that state, an authenticated person would be redirected to the login or would see the screen flash before getting in.",
      },
      {
        pergunta: "Does a client-side protected route guarantee security? What does?",
        resposta:
          "No: it is only user experience, because the user controls the browser. Security comes from the API, which authenticates and authorizes every request and returns data only to those with permission.",
      },
    ],
  },
};
