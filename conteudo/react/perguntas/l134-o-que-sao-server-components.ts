import type { Pergunta } from "../../tipos";

// L134 · O que são Server Components
export const l134: Pergunta = {
  numero: 134,
  modulo: "linkedin-react19",
  metodo: "firstprinciples",
  pt: {
    titulo: "O que são Server Components",
    pergunta: "O que são React Server Components?",
    porqueEsteMetodo:
      "Os Server Components parecem uma regra arbitrária (“roda só no servidor, sem hooks”) até você ver cada restrição nascer de uma pergunta: por que mandar ao navegador um código que só transforma dados em tela? Construir uma restrição por vez explica o desenho.",
    resposta30s:
      "**React Server Components** são componentes que rodam **só no servidor**: acessam banco e arquivos diretamente, **não entram no bundle do cliente** e enviam ao navegador um resultado **serializado**, não o código. Por isso não têm estado, efeitos nem eventos: a interatividade fica nos **Client Components** (`'use client'`), que convivem com eles na mesma árvore. Dependem de framework e bundler com suporte: confira react.dev.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma restrição por vez",
        passos: [
          {
            titulo: "0. O que se quer",
            texto:
              "Telas ricas em dados que o navegador consiga mostrar logo, baixando e executando o mínimo de JavaScript.",
          },
          {
            titulo: "1. A versão mais simples: tudo no cliente",
            texto:
              "O navegador baixa o bundle inteiro, monta a árvore e cada componente busca seus dados por uma API, em um efeito. → Quebra: o bundle cresce com bibliotecas usadas só para preparar conteúdo (um conversor de Markdown, uma formatação de datas) e os dados chegam em cascata, só depois de o JavaScript carregar.",
          },
          {
            titulo: "2. Renderizar o HTML no servidor (SSR)",
            texto:
              "O servidor entrega HTML pronto na primeira carga. → Melhora o que o usuário vê primeiro, mas o código de todos os componentes ainda vai ao navegador para ser hidratado, e a busca de dados continua exigindo uma camada de API.",
          },
          {
            titulo: "3. A pergunta que muda tudo",
            texto:
              "Se um componente só transforma dados em interface e nunca reage a um clique, por que enviar o código dele? Ele pode rodar **apenas no servidor**, ler o banco direto (com `await`) e mandar ao navegador só o **resultado**: uma descrição serializada da interface, sem o código nem as dependências dele.",
          },
          {
            titulo: "4. A restrição que nasce",
            texto:
              "Sem código no navegador, nada ali pode reagir: nada de `useState`, efeitos, `onClick` nem APIs do navegador. A interatividade vai para **Client Components** (`'use client'`), pequenos, dentro da árvore do servidor, que recebem dados por props serializáveis.",
          },
          {
            titulo: "5. Como as duas metades convivem",
            texto:
              "O bundler separa os dois mundos: o código dos Server Components fica no servidor e o dos Client Components vai ao navegador. Na primeira carga, o framework costuma combinar com SSR (os Client Components também são pré-renderizados e hidratados). Nas navegações seguintes, o servidor envia uma nova árvore e o React a aplica, em geral preservando o estado do cliente.",
          },
          {
            titulo: "6. O que isso custa",
            texto:
              "Exige um framework ou bundler que implemente o formato e tenha um servidor (não é só uma biblioteca no navegador), e o que cruza para o cliente precisa ser serializável. O que vai em props é público: não envie o que não puder ser visto.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um Server Component que lê o banco direto",
        legenda: "TSX",
        codigo: `import { db } from "./db";

// Sem a diretiva 'use client': é um Server Component
export default async function Pedidos() {
  const pedidos = await db.pedido.findMany({ take: 20 }); // roda só no servidor

  return (
    <ul>
      {pedidos.map((p) => (
        <li key={p.id}>
          {p.cliente}: {p.total}
        </li>
      ))}
    </ul>
  );
}`,
        nota: "`db` é um cliente de banco qualquer, só de exemplo. O navegador recebe o resultado da renderização (a lista pronta), nunca o código desta função nem a conexão com o banco.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Resumo",
        texto:
          "Server Component é um componente que roda no servidor e cujo **código não vai ao navegador**. Ganhos: bundle menor, acesso direto a dados e segredos, menos cascata de requisições (veja L151). Perdas: nada de estado, efeitos, eventos ou APIs do navegador. Regra prática: comece pelo servidor e use Client Components só onde há interatividade (veja L135).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não confunda com SSR",
        texto:
          "SSR gera HTML no servidor, mas o código de todos os componentes ainda vai ao navegador e é hidratado. Server Components definem **qual código existe no cliente** e costumam se combinar com o SSR, não substituí-lo (veja L142). Também não são componentes que re-renderizam no servidor a cada clique: eles renderizam por pedido ou navegação. O recurso depende de framework e de versão: confira react.dev.",
      },
    ],
    armadilhas: [
      "Achar que Server Component é o mesmo que SSR: o SSR hidrata todos os componentes; o Server Component nunca é hidratado nem enviado.",
      "Usar `useState`, `useEffect` ou `onClick` em um Server Component: o código nem roda no navegador, então a interatividade tem de ir para um Client Component.",
      "Passar ao cliente, por props, objetos inteiros com campos sensíveis: tudo que cruza a fronteira fica visível no navegador.",
      "Marcar a página inteira com `'use client'` por conveniência: o ganho de bundle desaparece. Empurre a diretiva para as folhas da árvore.",
    ],
    autoteste: [
      {
        pergunta: "Por que um Server Component não pode usar `useState`?",
        resposta:
          "Porque ele roda no servidor e entrega um resultado serializado; o código não está no navegador, então não existe re-renderização local em que o estado possa mudar. A interatividade fica nos Client Components.",
      },
      {
        pergunta: "Qual a vantagem de o código do componente não ir ao navegador?",
        resposta:
          "O bundle é menor (as bibliotecas usadas só no servidor não são baixadas), os dados são lidos direto no servidor e os segredos nunca saem dele.",
      },
    ],
  },
  en: {
    titulo: "What Server Components are",
    pergunta: "What are React Server Components?",
    porqueEsteMetodo:
      "Server Components look like an arbitrary rule (“runs only on the server, no hooks”) until you watch each restriction come out of a question: why send the browser code that only turns data into a screen? Building one restriction at a time explains the design.",
    resposta30s:
      "**React Server Components** are components that run **only on the server**: they access the database and files directly, **don’t enter the client bundle** and send the browser a **serialized** result, not the code. That is why they have no state, effects or events: interactivity lives in **Client Components** (`'use client'`), which coexist with them in the same tree. They depend on a framework and bundler with support: check react.dev.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one restriction at a time",
        passos: [
          {
            titulo: "0. What you want",
            texto:
              "Data-rich screens that the browser can show quickly, downloading and executing as little JavaScript as possible.",
          },
          {
            titulo: "1. The simplest version: everything on the client",
            texto:
              "The browser downloads the whole bundle, builds the tree and each component fetches its data through an API, in an effect. → Breaks: the bundle grows with libraries used only to prepare content (a Markdown converter, date formatting) and data arrives in a waterfall, only after the JavaScript loads.",
          },
          {
            titulo: "2. Render the HTML on the server (SSR)",
            texto:
              "The server delivers ready HTML on the first load. → It improves what the user sees first, but the code of every component still goes to the browser to be hydrated, and fetching data still requires an API layer.",
          },
          {
            titulo: "3. The question that changes everything",
            texto:
              "If a component only turns data into interface and never reacts to a click, why send its code? It can run **only on the server**, read the database directly (with `await`) and send the browser only the **result**: a serialized description of the interface, without its code or dependencies.",
          },
          {
            titulo: "4. The restriction that follows",
            texto:
              "With no code in the browser, nothing there can react: no `useState`, effects, `onClick` or browser APIs. Interactivity moves to small **Client Components** (`'use client'`) inside the server’s tree, which receive data through serializable props.",
          },
          {
            titulo: "5. How the two halves coexist",
            texto:
              "The bundler separates the two worlds: Server Component code stays on the server and Client Component code goes to the browser. On the first load, the framework usually combines this with SSR (Client Components are also pre-rendered and hydrated). On later navigations, the server sends a new tree and React applies it, generally preserving client state.",
          },
          {
            titulo: "6. What it costs",
            texto:
              "It requires a framework or bundler that implements the format and has a server (it isn’t just a browser library), and whatever crosses to the client must be serializable. What goes in props is public: don’t send anything that must not be seen.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A Server Component that reads the database directly",
        legenda: "TSX",
        codigo: `import { db } from "./db";

// No 'use client' directive: this is a Server Component
export default async function Orders() {
  const orders = await db.order.findMany({ take: 20 }); // runs only on the server

  return (
    <ul>
      {orders.map((o) => (
        <li key={o.id}>
          {o.customer}: {o.total}
        </li>
      ))}
    </ul>
  );
}`,
        nota: "`db` is any database client, just for illustration. The browser receives the render result (the finished list), never this function’s code or the database connection.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Summary",
        texto:
          "A Server Component runs on the server and its **code doesn’t go to the browser**. Gains: a smaller bundle, direct access to data and secrets, fewer request waterfalls (see L151). Losses: no state, effects, events or browser APIs. Practical rule: start on the server and use Client Components only where there is interactivity (see L135).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Don’t confuse it with SSR",
        texto:
          "SSR generates HTML on the server, but the code of every component still goes to the browser and is hydrated. Server Components define **which code exists on the client** and are usually combined with SSR, not a replacement for it (see L142). Nor are they components that re-render on the server on every click: they render per request or navigation. The feature depends on the framework and the version: check react.dev.",
      },
    ],
    armadilhas: [
      "Thinking a Server Component is the same as SSR: SSR hydrates every component; a Server Component is never hydrated or shipped.",
      "Using `useState`, `useEffect` or `onClick` in a Server Component: the code doesn’t even run in the browser, so interactivity has to move to a Client Component.",
      "Passing whole objects with sensitive fields to the client through props: everything that crosses the boundary is visible in the browser.",
      "Marking the whole page with `'use client'` for convenience: the bundle gain disappears. Push the directive down to the leaves of the tree.",
    ],
    autoteste: [
      {
        pergunta: "Why can’t a Server Component use `useState`?",
        resposta:
          "Because it runs on the server and delivers a serialized result; its code isn’t in the browser, so there is no local re-render in which state could change. Interactivity lives in Client Components.",
      },
      {
        pergunta: "What is the advantage of the component’s code not going to the browser?",
        resposta:
          "The bundle is smaller (libraries used only on the server are never downloaded), data is read directly on the server and secrets never leave it.",
      },
    ],
  },
};
