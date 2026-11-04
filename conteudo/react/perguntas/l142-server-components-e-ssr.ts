import type { Pergunta } from "../../tipos";

// L142 · Server Components e SSR
export const l142: Pergunta = {
  numero: 142,
  modulo: "linkedin-rsc",
  metodo: "compare",
  pt: {
    titulo: "Server Components e SSR",
    pergunta: "Como os Server Components diferem do SSR?",
    porqueEsteMetodo:
      "CSR, SSR e Server Components costumam ser confundidos porque todos mexem em “onde renderiza”, mas respondem a perguntas diferentes. Colocar os três na mesma matriz mostra o que cada um muda: onde o HTML nasce, o que é hidratado e o que vai ao cliente.",
    resposta30s:
      "No **CSR** o navegador baixa o JavaScript e renderiza tudo. No **SSR** o servidor gera o HTML da primeira carga, mas o código de **todos os componentes** ainda é enviado e **hidratado**. Os **Server Components** rodam só no servidor, **nunca hidratam** e o código deles não vai ao cliente; os dois últimos se combinam, porque o SSR responde “quando o HTML nasce” e os Server Components respondem “qual código existe no navegador”.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "CSR, SSR e Server Components lado a lado",
        colunas: ["Critério", "CSR", "SSR", "Server Components"],
        linhas: [
          [
            "Onde renderiza",
            "Só no navegador",
            "No servidor, para o HTML da primeira carga, e de novo no navegador (hidratação)",
            "Só no servidor; nunca roda no navegador",
          ],
          [
            "HTML da primeira carga",
            "Quase vazio até o JavaScript rodar",
            "Completo, pronto para exibir",
            "Não é HTML por si só: gera uma descrição da interface; o HTML vem do SSR do framework",
          ],
          [
            "Hidratação",
            "Não há: o cliente monta tudo do zero",
            "Todos os componentes são hidratados",
            "Eles não hidratam; só os Client Components",
          ],
          [
            "JavaScript enviado",
            "O app inteiro",
            "O app inteiro (para hidratar)",
            "Só o dos Client Components, mais o runtime",
          ],
          [
            "Acesso a dados",
            "Pelo navegador, por APIs",
            "Por funções do framework no servidor na carga; depois, por APIs no navegador",
            "Direto no componente (`async`/`await`), no servidor",
          ],
          [
            "Interatividade",
            "Total, depois que o JavaScript carrega",
            "Só depois da hidratação",
            "Nenhuma própria: vem dos Client Components",
          ],
        ],
        nota: "Os frameworks combinam os três. Os detalhes (streaming, cache, o que entra no HTML) variam: confira react.dev e a documentação do seu framework.",
      },
      {
        tipo: "fluxo",
        titulo: "Uma primeira visita com Server Components e SSR juntos",
        etapas: [
          "O navegador pede a página ao servidor",
          "O servidor renderiza os Server Components (lê os dados) e produz uma árvore serializada, com lugares reservados para os Client Components",
          "O SSR transforma essa árvore em HTML (incluindo os Client Components pré-renderizados) e o envia: a pessoa já vê o conteúdo",
          "O navegador baixa só o JavaScript dos Client Components e recebe a árvore serializada junto do HTML",
          "O React hidrata os Client Components; os Server Components ficam como vieram. Nas navegações seguintes, só a nova árvore é pedida ao servidor",
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de escolha",
        texto:
          "**CSR** para telas privadas e muito interativas (painéis, editores), em que SEO e a primeira pintura pesam pouco. **SSR** quando o conteúdo é público e a primeira pintura rápida e o SEO importam. **Server Components** para reduzir o JavaScript do cliente e ler dados direto no servidor, combinados com SSR e com Client Components. Na prática, um framework moderno pode fazer as três coisas na mesma aplicação.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não são alternativas do mesmo tipo",
        texto:
          "SSR e Server Components não competem: o SSR decide **quando e onde o HTML inicial é gerado**; os Server Components decidem **qual código existe no navegador**. SSR sem Server Components é o modelo clássico, em que o app inteiro hidrata; Server Components podem ser usados com ou sem a etapa de HTML do servidor, embora o comum nos frameworks seja combiná-los. SSR não reduz o JavaScript, e Server Components não substituem o SSR. Confira react.dev.",
      },
    ],
    armadilhas: [
      "Tratar Server Components como “SSR melhor”: são coisas diferentes e complementares.",
      "Achar que o SSR reduz o JavaScript: o app inteiro continua indo ao navegador para hidratar; quem reduz é a divisão em Server Components.",
      "Achar que um Client Component só roda no navegador: ele também é pré-renderizado no servidor (SSR) e depois hidratado.",
      "Escolher SSR para um painel privado sem SEO só por moda: custa servidor e complexidade sem ganho claro, e o CSR pode bastar.",
    ],
    autoteste: [
      {
        pergunta: "O que diferencia o SSR dos Server Components?",
        resposta:
          "O SSR gera o HTML inicial no servidor, mas depois envia e hidrata o código de todos os componentes. Os Server Components rodam só no servidor, não são hidratados e o código deles não vai ao cliente.",
      },
      {
        pergunta: "É possível usar SSR e Server Components juntos?",
        resposta:
          "Sim, e é o comum nos frameworks. Os Server Components produzem a árvore; o SSR a transforma em HTML (incluindo Client Components pré-renderizados); o navegador hidrata só os Client Components.",
      },
    ],
  },
  en: {
    titulo: "Server Components versus SSR",
    pergunta: "How are Server Components different from SSR?",
    porqueEsteMetodo:
      "CSR, SSR and Server Components get confused because all of them touch “where it renders”, but they answer different questions. Putting the three in one matrix shows what each changes: where the HTML is born, what gets hydrated and what goes to the client.",
    resposta30s:
      "With **CSR** the browser downloads the JavaScript and renders everything. With **SSR** the server generates the HTML for the first load, but the code of **every component** is still sent and **hydrated**. **Server Components** run only on the server, **never hydrate** and their code doesn’t go to the client; the last two combine, because SSR answers “when the HTML is born” and Server Components answer “which code exists in the browser”.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "CSR, SSR and Server Components side by side",
        colunas: ["Criterion", "CSR", "SSR", "Server Components"],
        linhas: [
          [
            "Where it renders",
            "Only in the browser",
            "On the server, for the first-load HTML, and again in the browser (hydration)",
            "Only on the server; never runs in the browser",
          ],
          [
            "First-load HTML",
            "Nearly empty until the JavaScript runs",
            "Complete, ready to display",
            "Not HTML by itself: it produces a description of the interface; the HTML comes from the framework’s SSR",
          ],
          [
            "Hydration",
            "None: the client builds everything from scratch",
            "Every component is hydrated",
            "They don’t hydrate; only Client Components do",
          ],
          [
            "JavaScript sent",
            "The whole app",
            "The whole app (to hydrate)",
            "Only that of the Client Components, plus the runtime",
          ],
          [
            "Data access",
            "From the browser, through APIs",
            "Through framework functions on the server at load; later, through APIs in the browser",
            "Directly in the component (`async`/`await`), on the server",
          ],
          [
            "Interactivity",
            "Full, once the JavaScript loads",
            "Only after hydration",
            "None of its own: it comes from Client Components",
          ],
        ],
        nota: "Frameworks combine all three. The details (streaming, caching, what goes into the HTML) vary: check react.dev and your framework’s documentation.",
      },
      {
        tipo: "fluxo",
        titulo: "A first visit with Server Components and SSR together",
        etapas: [
          "The browser asks the server for the page",
          "The server renders the Server Components (reads the data) and produces a serialized tree, with placeholders for the Client Components",
          "SSR turns that tree into HTML (including the pre-rendered Client Components) and sends it: the person already sees the content",
          "The browser downloads only the Client Components’ JavaScript and receives the serialized tree along with the HTML",
          "React hydrates the Client Components; the Server Components stay as they arrived. On later navigations, only the new tree is requested from the server",
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Choosing rule",
        texto:
          "**CSR** for private, highly interactive screens (dashboards, editors), where SEO and first paint matter little. **SSR** when the content is public and a fast first paint and SEO matter. **Server Components** to reduce client JavaScript and read data directly on the server, combined with SSR and Client Components. In practice, a modern framework can do all three in the same application.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "They are not alternatives of the same kind",
        texto:
          "SSR and Server Components don’t compete: SSR decides **when and where the initial HTML is generated**; Server Components decide **which code exists in the browser**. SSR without Server Components is the classic model, in which the whole app hydrates; Server Components can be used with or without the server’s HTML step, although in frameworks it is common to combine them. SSR doesn’t reduce JavaScript, and Server Components don’t replace SSR. Check react.dev.",
      },
    ],
    armadilhas: [
      "Treating Server Components as “better SSR”: they are different and complementary things.",
      "Thinking SSR reduces JavaScript: the whole app still goes to the browser to hydrate; what reduces it is splitting into Server Components.",
      "Thinking a Client Component only runs in the browser: it is also pre-rendered on the server (SSR) and then hydrated.",
      "Choosing SSR for a private dashboard with no SEO just because it’s trendy: it costs servers and complexity with no clear gain, and CSR may be enough.",
    ],
    autoteste: [
      {
        pergunta: "What sets SSR apart from Server Components?",
        resposta:
          "SSR generates the initial HTML on the server, but then sends and hydrates the code of every component. Server Components run only on the server, are not hydrated and their code doesn’t go to the client.",
      },
      {
        pergunta: "Can SSR and Server Components be used together?",
        resposta:
          "Yes, and it is the common setup in frameworks. Server Components produce the tree; SSR turns it into HTML (including pre-rendered Client Components); the browser hydrates only the Client Components.",
      },
    ],
  },
};
