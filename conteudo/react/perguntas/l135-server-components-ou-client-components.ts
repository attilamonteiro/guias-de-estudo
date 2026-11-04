import type { Pergunta } from "../../tipos";

// L135 · Server Components ou Client Components
export const l135: Pergunta = {
  numero: 135,
  modulo: "linkedin-react19",
  metodo: "compare",
  pt: {
    titulo: "Server Components ou Client Components",
    pergunta: "Server Components versus Client Components?",
    porqueEsteMetodo:
      "A escolha entre os dois tipos aparece em todo componente novo, e a decisão certa depende de cinco ou seis diferenças práticas. A matriz as coloca lado a lado e a regra de decisão diz por onde começar e quando mudar.",
    resposta30s:
      "**Server Components** rodam só no servidor, acessam recursos diretamente e **não enviam o código ao cliente**; **Client Components**, marcados com `'use client'`, carregam no navegador, usam estado, efeitos e eventos, e também são **pré-renderizados no servidor**. A regra é **começar no servidor** e levar ao cliente só o que é interativo, perto das folhas da árvore. A diretiva marca a fronteira: o arquivo e tudo que ele importa entram no bundle do navegador.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Servidor e cliente, lado a lado",
        colunas: ["Critério", "Server Component", "Client Component"],
        linhas: [
          [
            "Onde roda",
            "Só no servidor (por pedido ou no build)",
            "No navegador; na primeira carga também é pré-renderizado no servidor para gerar o HTML",
          ],
          [
            "Como se declara",
            "É o padrão nos frameworks com suporte: sem diretiva",
            "`'use client'` no topo do arquivo",
          ],
          [
            "Pode usar",
            "`async`/`await`, banco, arquivos e segredos direto no componente",
            "`useState`, `useEffect`, contexto, eventos (`onClick`) e APIs do navegador",
          ],
          [
            "Não pode usar",
            "Estado, efeitos, eventos e APIs do navegador",
            "Recursos privados do servidor direto (só por Server Function ou API); componente `async`",
          ],
          ["Código no bundle do cliente", "Não vai", "Vai: o arquivo e tudo que ele importa"],
          [
            "Como a interface se atualiza",
            "O servidor devolve uma nova árvore a cada pedido ou navegação",
            "O React re-renderiza no navegador quando o estado ou as props mudam",
          ],
        ],
        nota: "Os detalhes variam com o framework e a versão do React: confira react.dev e a documentação do seu framework.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Comece **no servidor**: todo componente é Server Component até precisar de **estado, efeito, evento, API do navegador** ou de uma biblioteca que dependa deles. Aí só **essa parte** vira Client Component, o mais perto possível das **folhas** da árvore (um `<BotaoCurtir>`, não a página inteira). Pergunta de bolso: “isto reage ao usuário?” Se sim, cliente. Se só mostra dados, servidor.",
      },
      {
        tipo: "codigo",
        titulo: "Um Client Component pequeno dentro de uma página de servidor",
        legenda: "TSX",
        codigo: `// Curtir.tsx: Client Component (a interatividade)
"use client";
import { useState } from "react";

export function Curtir({ inicial }: { inicial: number }) {
  const [total, setTotal] = useState(inicial);
  return <button onClick={() => setTotal(total + 1)}>Curtir ({total})</button>;
}

// Artigo.tsx: Server Component (padrão, sem diretiva)
import { Curtir } from "./Curtir";

export default async function Artigo({ id }: { id: string }) {
  const artigo = await buscarArtigo(id); // direto no servidor
  return (
    <article>
      <h1>{artigo.titulo}</h1>
      <Curtir inicial={artigo.curtidas} /> {/* só esta parte vai ao navegador */}
    </article>
  );
}`,
        nota: "`buscarArtigo` é uma função sua. Os dois trechos são arquivos separados.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O que `'use client'` realmente faz",
        texto:
          "A diretiva marca uma **fronteira entre os dois mundos**: o arquivo e tudo que ele importa entram no bundle do navegador, então os componentes importados por ele passam a ser de cliente também. Não significa “renderiza só no cliente”: Client Components são pré-renderizados no servidor para o HTML inicial e depois hidratados. Marque o arquivo de **entrada** da parte interativa, não a página inteira, e coloque a diretiva no topo, antes dos imports.",
      },
    ],
    armadilhas: [
      "Marcar `'use client'` na raiz da página “por garantia”: tudo que ela importa vai para o bundle do navegador e o ganho do servidor desaparece.",
      "Achar que `'use client'` significa “só renderiza no navegador”: o componente também é pré-renderizado no servidor, por isso `window` não pode ser lido durante a renderização dele.",
      "Importar um Server Component dentro de um Client Component: ele passa a ser tratado como de cliente e quebra se usar recursos de servidor. Passe-o como `children` (veja L146).",
      "Passar do servidor ao cliente funções comuns ou objetos não serializáveis por props: só valores serializáveis atravessam a fronteira.",
    ],
    autoteste: [
      {
        pergunta: "Como decidir se um componente pertence ao servidor ou ao cliente?",
        resposta:
          "Comece no servidor. Se ele precisa de estado, efeitos, eventos ou APIs do navegador, extraia só essa parte para um Client Component, o mais perto possível das folhas da árvore.",
      },
      {
        pergunta: "O que a diretiva `'use client'` carrega para o bundle?",
        resposta:
          "O próprio arquivo e tudo que ele importa. Ela marca a entrada da parte do cliente; não é preciso repeti-la nos módulos importados por esse arquivo.",
      },
    ],
  },
  en: {
    titulo: "Server versus Client Components",
    pergunta: "Server Components vs Client Components?",
    porqueEsteMetodo:
      "The choice between the two kinds comes up with every new component, and the right call depends on five or six practical differences. The matrix puts them side by side and the decision rule says where to start and when to switch.",
    resposta30s:
      "**Server Components** run only on the server, access resources directly and **don’t send their code to the client**; **Client Components**, marked with `'use client'`, load in the browser, use state, effects and events, and are also **pre-rendered on the server**. The rule is to **start on the server** and take only what is interactive to the client, near the leaves of the tree. The directive marks the boundary: the file and everything it imports enter the browser bundle.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Server and client, side by side",
        colunas: ["Criterion", "Server Component", "Client Component"],
        linhas: [
          [
            "Where it runs",
            "Only on the server (per request or at build time)",
            "In the browser; on the first load it is also pre-rendered on the server to produce the HTML",
          ],
          [
            "How it is declared",
            "It is the default in frameworks with support: no directive",
            "`'use client'` at the top of the file",
          ],
          [
            "Can use",
            "`async`/`await`, database, files and secrets directly in the component",
            "`useState`, `useEffect`, context, events (`onClick`) and browser APIs",
          ],
          [
            "Cannot use",
            "State, effects, events and browser APIs",
            "Private server resources directly (only via a Server Function or an API); an `async` component",
          ],
          ["Code in the client bundle", "Doesn’t go", "Goes: the file and everything it imports"],
          [
            "How the UI updates",
            "The server returns a new tree on every request or navigation",
            "React re-renders in the browser when state or props change",
          ],
        ],
        nota: "Details vary with the framework and the React version: check react.dev and your framework’s documentation.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Start **on the server**: every component is a Server Component until it needs **state, an effect, an event, a browser API** or a library that depends on them. Then only **that part** becomes a Client Component, as close to the **leaves** of the tree as possible (a `<LikeButton>`, not the whole page). Pocket question: “does this react to the user?” If yes, client. If it just shows data, server.",
      },
      {
        tipo: "codigo",
        titulo: "A small Client Component inside a server page",
        legenda: "TSX",
        codigo: `// Like.tsx: Client Component (the interactivity)
"use client";
import { useState } from "react";

export function Like({ initial }: { initial: number }) {
  const [total, setTotal] = useState(initial);
  return <button onClick={() => setTotal(total + 1)}>Like ({total})</button>;
}

// Article.tsx: Server Component (default, no directive)
import { Like } from "./Like";

export default async function Article({ id }: { id: string }) {
  const article = await fetchArticle(id); // directly on the server
  return (
    <article>
      <h1>{article.title}</h1>
      <Like initial={article.likes} /> {/* only this part goes to the browser */}
    </article>
  );
}`,
        nota: "`fetchArticle` is your own function. The two snippets are separate files.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What `'use client'` really does",
        texto:
          "The directive marks a **boundary between the two worlds**: the file and everything it imports enter the browser bundle, so the components it imports become client components too. It doesn’t mean “renders only on the client”: Client Components are pre-rendered on the server for the initial HTML and then hydrated. Mark the **entry** file of the interactive part, not the whole page, and put the directive at the top, before the imports.",
      },
    ],
    armadilhas: [
      "Marking `'use client'` at the root of the page “just in case”: everything it imports goes into the browser bundle and the server’s gain disappears.",
      "Thinking `'use client'` means “renders only in the browser”: the component is also pre-rendered on the server, which is why `window` can’t be read during its render.",
      "Importing a Server Component inside a Client Component: it gets treated as a client component and breaks if it uses server resources. Pass it as `children` (see L146).",
      "Passing plain functions or non-serializable objects from server to client through props: only serializable values cross the boundary.",
    ],
    autoteste: [
      {
        pergunta: "How would you decide whether a component belongs on the server or the client?",
        resposta:
          "Start on the server. If it needs state, effects, events or browser APIs, extract just that part into a Client Component, as close to the leaves of the tree as possible.",
      },
      {
        pergunta: "What does the `'use client'` directive pull into the bundle?",
        resposta:
          "The file itself and everything it imports. It marks the entry of the client part; you don’t need to repeat it in the modules that file imports.",
      },
    ],
  },
};
