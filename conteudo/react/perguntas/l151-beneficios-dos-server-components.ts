import type { Pergunta } from "../../tipos";

// L151 · Benefícios dos Server Components
export const l151: Pergunta = {
  numero: 151,
  modulo: "linkedin-rsc",
  metodo: "whys",
  pt: {
    titulo: "Benefícios dos Server Components",
    pergunta: "Quais são os benefícios dos Server Components?",
    porqueEsteMetodo:
      "Todo benefício dos Server Components decorre de um único fato: o componente roda no servidor e só o resultado viaja ao navegador. Encadear os “por quês” mostra de onde vem cada ganho, onde ele acaba e por que ele não é de graça.",
    resposta30s:
      "**Server Components** rodam só no servidor (na requisição ou no build) e enviam ao navegador **apenas o resultado**, não o código. Daí vêm os ganhos: **menos JavaScript** para baixar e executar, **acesso direto a banco, arquivos e segredos** sem uma camada de API só para isso, primeira tela mais rápida e melhor uso de **cache e streaming**. O preço é que esses componentes não têm estado, efeitos, eventos nem APIs do navegador: o que é interativo continua sendo Client Component.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que menos JavaScript vai para o navegador?",
            resposta:
              "Porque o código de um Server Component nunca é enviado: o React o executa no servidor e manda uma descrição serializada do que ele renderizou (o “payload”). O componente e as bibliotecas que só ele usa (formatar Markdown, tratar datas, ler dados) ficam fora do bundle e não precisam ser hidratados. Só entram no bundle os Client Components e tudo o que eles importam.",
          },
          {
            pergunta: "Por que dá para acessar dados e segredos sem uma camada de API?",
            resposta:
              "Porque o componente roda num ambiente confiável, perto dos dados: ele pode ser `async` e usar `await` numa consulta ao banco, ler um arquivo ou chamar um serviço interno com uma chave secreta, sem criar um endpoint só para o navegador consumir. A chave não vai para o bundle. Atenção: tudo o que você passa como prop a um Client Component é serializado e enviado ao navegador, então passa a ser público.",
          },
          {
            pergunta: "Por que o carregamento inicial tende a ser mais rápido?",
            resposta:
              "Porque há menos código para baixar, interpretar e hidratar, e os dados são buscados onde a distância até o banco é curta, com várias buscas correndo juntas, em vez de uma cascata de pedidos feita pelo navegador (renderiza, descobre que precisa de dados, busca, renderiza de novo). É uma tendência, não uma garantia: o servidor passa a gastar tempo renderizando, e o ganho depende do app e do framework.",
          },
          {
            pergunta: "Por que cache e streaming melhoram?",
            resposta:
              "Porque o resultado de um componente pode ser guardado no servidor e reaproveitado entre usuários quando não é personalizado, e o React oferece `cache` para não repetir a mesma busca dentro de uma requisição. Com `Suspense`, o servidor envia a página por partes: o que já está pronto aparece logo e a parte lenta chega depois, sem travar o resto. Quanto e como se guarda entre requisições é decisão do framework; confira a documentação dele.",
          },
          {
            pergunta: "Por que existem limites?",
            resposta:
              "Porque o componente roda uma vez, no servidor, e não fica vivo no navegador. Ele não pode ter estado (`useState`), efeitos (`useEffect`), manipuladores de evento (`onClick`) nem contexto, e não enxerga `window` ou `localStorage`. Toda interação precisa de um Client Component, marcado com `'use client'`. Para decidir de que lado cada peça fica, veja L154.",
          },
        ],
        causaRaiz:
          "Os ganhos nascem de uma separação: o que só **lê e mostra** pode ficar no servidor sem enviar código, e o que **reage ao usuário** precisa estar no navegador. Reduzir o JavaScript do cliente é empurrar a fronteira `'use client'` para o mais baixo possível na árvore, perto das folhas.",
      },
      {
        tipo: "codigo",
        titulo: "Página no servidor, só o botão no cliente",
        legenda: "TSX (dois arquivos)",
        codigo: [
          '// ProdutoPagina.tsx (Server Component: sem "use client")',
          'import { buscarProduto } from "./banco"; // só roda no servidor',
          'import BotaoCarrinho from "./BotaoCarrinho";',
          "",
          "export default async function ProdutoPagina({ id }: { id: string }) {",
          "  const produto = await buscarProduto(id); // acesso direto, sem endpoint",
          "  return (",
          "    <article>",
          "      <h1>{produto.nome}</h1>",
          "      <BotaoCarrinho />",
          "    </article>",
          "  );",
          "}",
          "",
          "// BotaoCarrinho.tsx (Client Component: só ele vai para o bundle)",
          '"use client";',
          'import { useState } from "react";',
          "",
          "export default function BotaoCarrinho() {",
          "  const [feito, setFeito] = useState(false);",
          '  return <button onClick={() => setFeito(true)}>{feito ? "No carrinho" : "Comprar"}</button>;',
          "}",
        ].join("\n"),
        nota: "São dois arquivos: a diretiva `'use client'` precisa ser a primeira linha do arquivo do Client Component. O banco e a consulta nunca saem do servidor; o bundle recebe apenas o botão.",
      },
      {
        tipo: "tabela",
        titulo: "O que cada tipo de componente pode fazer",
        colunas: ["Recurso", "Server Component", "Client Component"],
        linhas: [
          [
            "Onde roda",
            "No servidor, na requisição ou no build",
            "No navegador (e também no servidor, para gerar o HTML inicial)",
          ],
          ["O código vai para o bundle", "Não", "Sim"],
          ["Banco, arquivos e segredos", "Sim, direto no componente", "Não: tudo o que chega ao navegador é público"],
          ["`async` e `await` no componente", "Sim", "Não: use hooks ou uma biblioteca de dados"],
          ["Estado, efeitos e contexto (`useState`, `useEffect`, `useContext`)", "Não", "Sim"],
          ["Eventos e APIs do navegador (`onClick`, `window`)", "Não", "Sim"],
        ],
        nota: "Um Server Component pode renderizar Client Components e passar a eles outros Server Components como `children`. O contrário não vale: um Client Component não importa um Server Component, só o recebe pronto.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Sem exagerar os ganhos",
        texto:
          "O ganho depende do app: uma tela quase toda interativa muda pouco, e um app que já é pequeno quase não percebe. Há custos: o servidor passa a renderizar, a latência da primeira resposta pesa mais, o modelo mental cresce (duas fronteiras, props serializáveis) e é preciso um framework ou bundler que suporte o recurso. Na prática, para reduzir o JavaScript do cliente: mantenha `'use client'` em componentes pequenos, passe conteúdo do servidor a eles como `children`, deixe as bibliotecas pesadas só nos Server Components e meça o bundle antes e depois. O suporte e os detalhes variam com a versão e o framework: confira react.dev.",
      },
    ],
    armadilhas: [
      "Colocar `'use client'` no arquivo raiz ou no layout: tudo o que ele importa vira JavaScript do navegador e o ganho desaparece.",
      "Passar um objeto inteiro (com campos secretos ou sensíveis) como prop a um Client Component: as props são serializadas e chegam ao navegador.",
      "Confundir Server Components com renderização no servidor (SSR): o SSR gera o HTML de componentes que também são enviados e hidratados; o Server Component não é enviado.",
      "Usar `useState`, `useEffect` ou `onClick` num Server Component: dá erro; extraia a parte interativa para um componente de cliente pequeno.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre Server Components e SSR?",
        resposta:
          "O SSR gera o HTML inicial de componentes que depois são enviados e hidratados no navegador. Os Server Components nunca são enviados nem hidratados: só o resultado chega. Os dois se combinam, e a maioria dos frameworks faz isso.",
      },
      {
        pergunta: "Como reduzir o JavaScript do cliente com Server Components sem perder interatividade?",
        resposta:
          "Deixando a página e os dados em Server Components e extraindo só as partes interativas (botões, campos dinâmicos) para Client Components pequenos, perto das folhas, que recebem o conteúdo do servidor por props ou `children`.",
      },
    ],
  },
  en: {
    titulo: "Server Components benefits",
    pergunta: "What are the benefits of Server Components?",
    porqueEsteMetodo:
      "Every benefit of Server Components follows from one fact: the component runs on the server and only the result travels to the browser. Chaining the whys shows where each gain comes from, where it stops and why it is not free.",
    resposta30s:
      "**Server Components** run only on the server (per request or at build time) and send the browser **just the result**, not the code. The gains follow: **less JavaScript** to download and run, **direct access to databases, files and secrets** without an API layer just for that, a faster first screen and better use of **caching and streaming**. The price is that these components have no state, effects, events or browser APIs: anything interactive remains a Client Component.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does less JavaScript reach the browser?",
            resposta:
              "Because a Server Component’s code is never sent: React runs it on the server and ships a serialized description of what it rendered (the “payload”). The component and the libraries only it uses (formatting Markdown, handling dates, reading data) stay out of the bundle and do not need hydration. Only Client Components and everything they import end up in the bundle.",
          },
          {
            pergunta: "Why can you reach data and secrets without an API layer?",
            resposta:
              "Because the component runs in a trusted environment, close to the data: it can be `async` and `await` a database query, read a file or call an internal service with a secret key, without creating an endpoint just for the browser to consume. The key never reaches the bundle. Careful: everything you pass as a prop to a Client Component is serialized and sent to the browser, so it becomes public.",
          },
          {
            pergunta: "Why does the initial load tend to be faster?",
            resposta:
              "Because there is less code to download, parse and hydrate, and data is fetched where the distance to the database is short, with several fetches running together, instead of a waterfall of browser requests (render, discover it needs data, fetch, render again). It is a tendency, not a guarantee: the server now spends time rendering, and the gain depends on the app and the framework.",
          },
          {
            pergunta: "Why do caching and streaming improve?",
            resposta:
              "Because a component’s result can be stored on the server and reused across users when it is not personalized, and React offers `cache` so the same fetch is not repeated within a request. With `Suspense`, the server sends the page in pieces: what is ready shows up at once and the slow part arrives later, without blocking the rest. How much is kept across requests is the framework’s call; check its documentation.",
          },
          {
            pergunta: "Why are there limits?",
            resposta:
              "Because the component runs once, on the server, and does not stay alive in the browser. It cannot have state (`useState`), effects (`useEffect`), event handlers (`onClick`) or context, and it cannot see `window` or `localStorage`. Any interaction needs a Client Component, marked with `'use client'`. To decide which side each piece belongs on, see L154.",
          },
        ],
        causaRaiz:
          "The gains come from a separation: what only **reads and shows** can stay on the server without shipping code, and what **reacts to the user** has to be in the browser. Reducing client JavaScript means pushing the `'use client'` boundary as low as possible in the tree, near the leaves.",
      },
      {
        tipo: "codigo",
        titulo: "Page on the server, only the button on the client",
        legenda: "TSX (two files)",
        codigo: [
          '// ProductPage.tsx (Server Component: no "use client")',
          'import { getProduct } from "./db"; // only runs on the server',
          'import CartButton from "./CartButton";',
          "",
          "export default async function ProductPage({ id }: { id: string }) {",
          "  const product = await getProduct(id); // direct access, no endpoint",
          "  return (",
          "    <article>",
          "      <h1>{product.name}</h1>",
          "      <CartButton />",
          "    </article>",
          "  );",
          "}",
          "",
          "// CartButton.tsx (Client Component: only it goes into the bundle)",
          '"use client";',
          'import { useState } from "react";',
          "",
          "export default function CartButton() {",
          "  const [done, setDone] = useState(false);",
          '  return <button onClick={() => setDone(true)}>{done ? "In the cart" : "Buy"}</button>;',
          "}",
        ].join("\n"),
        nota: "These are two files: the `'use client'` directive must be the first line of the Client Component’s file. The database and the query never leave the server; the bundle receives only the button.",
      },
      {
        tipo: "tabela",
        titulo: "What each kind of component can do",
        colunas: ["Capability", "Server Component", "Client Component"],
        linhas: [
          [
            "Where it runs",
            "On the server, per request or at build time",
            "In the browser (and on the server too, to generate the initial HTML)",
          ],
          ["Its code goes into the bundle", "No", "Yes"],
          [
            "Databases, files and secrets",
            "Yes, right in the component",
            "No: everything that reaches the browser is public",
          ],
          ["`async` and `await` in the component", "Yes", "No: use hooks or a data library"],
          ["State, effects and context (`useState`, `useEffect`, `useContext`)", "No", "Yes"],
          ["Events and browser APIs (`onClick`, `window`)", "No", "Yes"],
        ],
        nota: "A Server Component can render Client Components and pass them other Server Components as `children`. The reverse does not hold: a Client Component does not import a Server Component, it only receives it already rendered.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Do not overstate the gains",
        texto:
          "The gain depends on the app: an almost fully interactive screen changes little, and an app that is already small barely notices. There are costs: the server now renders, first-response latency matters more, the mental model grows (two boundaries, serializable props) and you need a framework or bundler that supports the feature. In practice, to reduce client JavaScript: keep `'use client'` on small components, pass server content to them as `children`, leave heavy libraries only in Server Components and measure the bundle before and after. Support and details vary with the version and the framework: check react.dev.",
      },
    ],
    armadilhas: [
      "Putting `'use client'` on the root file or the layout: everything it imports becomes browser JavaScript and the gain disappears.",
      "Passing a whole object (with secret or sensitive fields) as a prop to a Client Component: props are serialized and reach the browser.",
      "Confusing Server Components with server-side rendering (SSR): SSR generates the HTML of components that are also sent and hydrated; a Server Component is not sent.",
      "Using `useState`, `useEffect` or `onClick` in a Server Component: it errors out; extract the interactive part into a small client component.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between Server Components and SSR?",
        resposta:
          "SSR generates the initial HTML of components that are later sent and hydrated in the browser. Server Components are never sent or hydrated: only the result arrives. The two combine, and most frameworks do just that.",
      },
      {
        pergunta: "How do you reduce client JavaScript with Server Components without losing interactivity?",
        resposta:
          "Keep the page and the data in Server Components and extract only the interactive parts (buttons, dynamic fields) into small Client Components near the leaves, which receive the server content through props or `children`.",
      },
    ],
  },
};
