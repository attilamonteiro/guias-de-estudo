import type { Pergunta } from "../../tipos";

// L170 · Estado de autenticação
export const l170: Pergunta = {
  numero: 170,
  modulo: "linkedin-formularios-e-dados",
  metodo: "design",
  pt: {
    titulo: "Estado de autenticação",
    pergunta: "Como você lida com o estado de autenticação?",
    porqueEsteMetodo:
      "Autenticação no front-end mistura segurança, estado e experiência de uso. Um roteiro de projeto (requisitos, onde fica a credencial, onde mora o estado, ciclos de vida e limites) evita as respostas soltas que só falam de “guardar o token”.",
    resposta30s:
      "O ponto de partida é a pergunta de segurança: **onde fica a credencial**, de preferência num **cookie `HttpOnly`** que o JavaScript não lê (ou num token de vida curta em memória). Na interface, o usuário atual mora num **Context ou store** com três estados, **carregando, autenticado e anônimo**, verificados ao abrir o app (`GET /eu`). Login, logout e renovação atualizam esse estado, e o logout limpa também o cache. A interface só **esconde telas**; quem autoriza de verdade é o **servidor**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "A interface precisa saber quem é a pessoa e o que ela pode ver, tratar login, logout e expiração, sobreviver a um recarregamento da página, funcionar com várias abas e nunca ser a única barreira de segurança.",
          },
          {
            titulo: "2. Decisão central: onde fica a credencial",
            texto:
              "Cookie `HttpOnly`, token em memória ou `localStorage`: a escolha define o que um ataque de XSS consegue levar e o que o recarregamento apaga (veja a tabela).",
          },
          {
            titulo: "3. Onde o estado mora",
            texto:
              "O usuário atual é, no fundo, **estado de servidor**: busque-o (`GET /eu`) com uma biblioteca de consulta ou num Provider com Context e exponha um `useAuth()`. Forma mínima: `{ status: 'carregando' | 'autenticado' | 'anonimo', usuario }`. Um store (como Zustand) ajuda se código fora da árvore, como o cliente de API, também precisa ler.",
          },
          {
            titulo: "4. O estado de carregando",
            texto:
              "Ao abrir o app a interface ainda não sabe se há sessão. Fique em `carregando` até a resposta chegar e só então escolha entre a área logada e o login; sem isso, quem já está logado vê a tela de login piscar (veja L174).",
          },
          {
            titulo: "5. Login, logout e renovação",
            texto:
              "Login: envie as credenciais e atualize o usuário. Logout: encerre a sessão no servidor, limpe o estado **e o cache de consultas**, para não mostrar dados da pessoa anterior. Renovação: ao receber 401, tente renovar uma vez (um único pedido compartilhado entre chamadas simultâneas), repita a chamada e, se falhar, trate como logout.",
          },
          {
            titulo: "6. Recarregar, várias abas e expiração",
            texto:
              "Recarregar: com cookie, a sessão volta pelo `GET /eu`; com token só em memória, o app renova pelo cookie de renovação ao iniciar. Várias abas: propague o logout com `BroadcastChannel` (ou o evento `storage`) e revalide quando a janela volta ao foco. Expiração: o servidor decide e a interface reage ao 401.",
          },
          {
            titulo: "7. Autorização",
            texto: "A interface só mostra e esconde. Quem autoriza é o servidor, a cada requisição (veja L174).",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Onde guardar a credencial",
        colunas: ["Opção", "O JavaScript lê?", "Principal risco", "Quando serve"],
        linhas: [
          [
            "Cookie `HttpOnly` (sessão ou token)",
            "Não",
            "CSRF; mitigue com `SameSite`, token anti-CSRF e checagem de origem",
            "Base forte para apps web do mesmo site: o JavaScript nem toca na credencial",
          ],
          [
            "Token de acesso em memória, com renovação por cookie `HttpOnly`",
            "Sim, enquanto a aba vive",
            "Some ao recarregar (refaz pela renovação); um XSS ainda pode usá-lo com a página aberta",
            "APIs em outro domínio; token de acesso de vida curta",
          ],
          [
            "`localStorage` ou `sessionStorage`",
            "Sim, por qualquer script da página",
            "Um XSS lê o token e o leva embora; persiste no navegador",
            "Evite para credenciais; serve para preferências",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Provider com os três estados",
        legenda: "TSX",
        codigo: [
          'import { createContext, useEffect, useState, type ReactNode } from "react";',
          "",
          'type Estado = { status: "carregando" | "autenticado" | "anonimo"; usuario: { nome: string } | null };',
          "const AuthContext = createContext<(Estado & { sair: () => Promise<void> }) | null>(null);",
          "",
          "export function AuthProvider({ children }: { children: ReactNode }) {",
          '  const [estado, setEstado] = useState<Estado>({ status: "carregando", usuario: null });',
          "",
          "  useEffect(() => {",
          '    fetch("/api/eu") // o cookie HttpOnly vai junto',
          "      .then((r) => (r.ok ? r.json() : null))",
          "      .catch(() => null) // rede fora: trate como sem sessão (ou mostre um erro)",
          '      .then((usuario) => setEstado({ status: usuario ? "autenticado" : "anonimo", usuario }));',
          "  }, []);",
          "",
          "  async function sair() {",
          '    await fetch("/api/sair", { method: "POST" });',
          '    setEstado({ status: "anonimo", usuario: null });',
          "  }",
          "  return <AuthContext.Provider value={{ ...estado, sair }}>{children}</AuthContext.Provider>;",
          "}",
        ].join("\n"),
        nota: "Falta um hook `useAuth()` que leia o contexto e falhe fora do Provider. Em código real, cancele a busca com `AbortController` e, no logout, limpe também o cache de consultas (por exemplo, `queryClient.clear()`).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Sessão que dura “para sempre”",
        texto:
          "Uma sessão literalmente indefinida é má ideia: um token roubado valeria para sempre. O que se faz é dar a **sensação** de continuidade: sessão deslizante (a validade se renova enquanto há atividade), token de renovação de longa duração e **rotativo** (cada uso emite um novo e invalida o anterior), “lembrar de mim” opcional, um limite absoluto para reautenticar e revogação no servidor (sair de todos os dispositivos). No cliente, renove em segundo plano, ao receber 401 ou pouco antes de expirar. Os prazos são decisão de segurança do produto.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A interface não é a barreira",
        texto:
          "Esconder um botão ou uma rota é experiência de uso. Qualquer pessoa chama a API sem a interface, então o servidor autentica e autoriza **cada requisição**. Não decida acesso pelo conteúdo de um JWT lido no cliente: o cliente pode ler, mas não pode confiar nele.",
      },
    ],
    armadilhas: [
      "Guardar o token de acesso ou de renovação em `localStorage`: qualquer script injetado (XSS) o lê e o leva embora.",
      "Decidir a tela inicial antes de a sessão ser verificada: sem o estado `carregando`, quem está logado vê o login piscar ou é redirecionado por engano.",
      "Não limpar o cache de consultas no logout: a próxima pessoa no mesmo navegador pode ver dados da anterior por um instante.",
      "Confiar nas permissões lidas no cliente para proteger dados: o servidor precisa verificar em cada requisição.",
    ],
    autoteste: [
      {
        pergunta: "O que a interface deve mostrar enquanto a sessão está sendo verificada, e por quê?",
        resposta:
          "Um estado de carregando (esqueleto ou indicador), nem o login nem a área logada. Decidir antes de saber faz a tela piscar ou redireciona quem já está autenticado.",
      },
      {
        pergunta: "Por que o cookie `HttpOnly` costuma ser preferido ao `localStorage` para a credencial?",
        resposta:
          "Porque o JavaScript da página não lê o cookie `HttpOnly`, então um XSS não leva a credencial; em troca é preciso se defender de CSRF (`SameSite`, token anti-CSRF). O `localStorage` é legível por qualquer script da página.",
      },
    ],
  },
  en: {
    titulo: "Managing authentication state",
    pergunta: "How do you handle authentication state?",
    porqueEsteMetodo:
      "Front-end authentication mixes security, state and user experience. A design script (requirements, where the credential lives, where the state lives, lifecycles and limits) avoids loose answers that only say “store the token”.",
    resposta30s:
      "Start from the security question: **where the credential lives**, preferably in an **`HttpOnly` cookie** that JavaScript cannot read (or a short-lived token in memory). In the interface, the current user lives in a **Context or store** with three states, **loading, authenticated and anonymous**, checked when the app opens (`GET /me`). Login, logout and renewal update that state, and logout also clears the cache. The interface only **hides screens**; the **server** is what really authorizes.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "The interface must know who the person is and what they may see, handle login, logout and expiry, survive a page reload, work across several tabs and never be the only security barrier.",
          },
          {
            titulo: "2. Central decision: where the credential lives",
            texto:
              "An `HttpOnly` cookie, an in-memory token or `localStorage`: the choice defines what an XSS attack can take and what a reload wipes out (see the table).",
          },
          {
            titulo: "3. Where the state lives",
            texto:
              "The current user is, at heart, **server state**: fetch it (`GET /me`) with a query library or in a Provider with Context and expose a `useAuth()`. Minimal shape: `{ status: 'loading' | 'authenticated' | 'anonymous', user }`. A store (such as Zustand) helps if code outside the tree, like the API client, also needs to read it.",
          },
          {
            titulo: "4. The loading state",
            texto:
              "When the app opens, the interface does not yet know whether there is a session. Stay in `loading` until the response arrives and only then choose between the signed-in area and the login; without it, anyone already signed in sees the login screen flash (see L174).",
          },
          {
            titulo: "5. Login, logout and renewal",
            texto:
              "Login: send the credentials and update the user. Logout: end the session on the server, clear the state **and the query cache**, so the previous person’s data is not shown. Renewal: on a 401, try to renew once (a single request shared among simultaneous calls), repeat the call and, if it fails, treat it as logout.",
          },
          {
            titulo: "6. Reload, several tabs and expiry",
            texto:
              "Reload: with a cookie, the session comes back through `GET /me`; with an in-memory token, the app renews through the refresh cookie on startup. Several tabs: propagate logout with `BroadcastChannel` (or the `storage` event) and revalidate when the window regains focus. Expiry: the server decides and the interface reacts to the 401.",
          },
          {
            titulo: "7. Authorization",
            texto: "The interface only shows and hides. The server authorizes, on every request (see L174).",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Where to keep the credential",
        colunas: ["Option", "Can JavaScript read it?", "Main risk", "When it fits"],
        linhas: [
          [
            "`HttpOnly` cookie (session or token)",
            "No",
            "CSRF; mitigate with `SameSite`, an anti-CSRF token and origin checks",
            "A strong base for same-site web apps: JavaScript never touches the credential",
          ],
          [
            "In-memory access token, with renewal through an `HttpOnly` cookie",
            "Yes, while the tab lives",
            "Gone on reload (rebuilt through renewal); an XSS can still use it while the page is open",
            "APIs on another domain; short-lived access token",
          ],
          [
            "`localStorage` or `sessionStorage`",
            "Yes, by any script on the page",
            "An XSS reads the token and takes it away; it persists in the browser",
            "Avoid for credentials; fine for preferences",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A Provider with the three states",
        legenda: "TSX",
        codigo: [
          'import { createContext, useEffect, useState, type ReactNode } from "react";',
          "",
          'type State = { status: "loading" | "authenticated" | "anonymous"; user: { name: string } | null };',
          "const AuthContext = createContext<(State & { signOut: () => Promise<void> }) | null>(null);",
          "",
          "export function AuthProvider({ children }: { children: ReactNode }) {",
          '  const [state, setState] = useState<State>({ status: "loading", user: null });',
          "",
          "  useEffect(() => {",
          '    fetch("/api/me") // the HttpOnly cookie goes along',
          "      .then((r) => (r.ok ? r.json() : null))",
          "      .catch(() => null) // network down: treat as no session (or show an error)",
          '      .then((user) => setState({ status: user ? "authenticated" : "anonymous", user }));',
          "  }, []);",
          "",
          "  async function signOut() {",
          '    await fetch("/api/sign-out", { method: "POST" });',
          '    setState({ status: "anonymous", user: null });',
          "  }",
          "  return <AuthContext.Provider value={{ ...state, signOut }}>{children}</AuthContext.Provider>;",
          "}",
        ].join("\n"),
        nota: "A `useAuth()` hook that reads the context and fails outside the Provider is missing. In real code, cancel the fetch with an `AbortController` and, on logout, also clear the query cache (for example, `queryClient.clear()`).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A session that lasts “forever”",
        texto:
          "A literally indefinite session is a bad idea: a stolen token would be valid forever. What you do is give the **feeling** of continuity: a sliding session (validity renews while there is activity), a long-lived and **rotating** refresh token (each use issues a new one and invalidates the previous), an optional “remember me”, an absolute limit to reauthenticate and server-side revocation (sign out of all devices). On the client, renew in the background, on a 401 or shortly before expiry. The durations are a product security decision.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The interface is not the barrier",
        texto:
          "Hiding a button or a route is user experience. Anyone can call the API without the interface, so the server authenticates and authorizes **every request**. Do not decide access from the contents of a JWT read on the client: the client can read it, but cannot trust it.",
      },
    ],
    armadilhas: [
      "Storing the access or refresh token in `localStorage`: any injected script (XSS) reads it and takes it away.",
      "Deciding the initial screen before the session is checked: without the `loading` state, someone signed in sees the login flash or is redirected by mistake.",
      "Not clearing the query cache on logout: the next person in the same browser may briefly see the previous person’s data.",
      "Trusting permissions read on the client to protect data: the server has to verify on every request.",
    ],
    autoteste: [
      {
        pergunta: "What should the interface show while the session is being checked, and why?",
        resposta:
          "A loading state (skeleton or indicator), neither the login nor the signed-in area. Deciding before knowing makes the screen flash or redirects someone already authenticated.",
      },
      {
        pergunta: "Why is an `HttpOnly` cookie usually preferred over `localStorage` for the credential?",
        resposta:
          "Because page JavaScript cannot read an `HttpOnly` cookie, so an XSS does not take the credential; in exchange you must defend against CSRF (`SameSite`, anti-CSRF token). `localStorage` is readable by any script on the page.",
      },
    ],
  },
};
