import type { Pergunta } from "../../tipos";

// L144 · Server Component com useState
export const l144: Pergunta = {
  numero: 144,
  modulo: "linkedin-rsc",
  metodo: "whys",
  pt: {
    titulo: "Server Component com useState",
    pergunta: "Um Server Component pode usar useState()?",
    porqueEsteMetodo:
      "A resposta curta (“não”) é fácil de decorar e fácil de esquecer. A cadeia de “por quês” liga a proibição ao modelo de execução: quando e onde o Server Component roda, o que chega ao navegador e o que sobra para os Client Components.",
    resposta30s:
      "**Não.** Um Server Component renderiza **uma vez, no servidor**, e entrega um resultado; o código dele **não é reexecutado no navegador**, então não há estado que mude, nem efeitos ou eventos, e os hooks de estado, de efeito e de contexto exigem um **Client Component** (`'use client'`). O que ele pode fazer é `async`/`await` e acesso direto a dados; a interatividade vem de compô-lo com Client Components pequenos.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que um Server Component não pode ter estado?",
            resposta:
              "Porque o estado só faz sentido se o componente renderiza de novo depois da primeira vez, quando a interface muda. Um Server Component roda **uma vez por pedido ou navegação**, no servidor, e termina. Não existe uma segunda renderização local em que o valor de um `useState` possa mudar.",
          },
          {
            pergunta: "Por que o código não roda de novo no navegador?",
            resposta:
              "Porque ele nem chega lá. O navegador recebe o **resultado serializado** da renderização, não o código do componente. Sem código no cliente, nada ali pode escutar um clique, atualizar um valor ou disparar um efeito.",
          },
          {
            pergunta: "Por que o mesmo vale para efeitos, eventos e APIs do navegador?",
            resposta:
              "Porque todos supõem um navegador: `useEffect` roda depois que a interface aparece, `onClick` precisa de um nó de DOM vivo, e `window`, `document` e `localStorage` simplesmente não existem no servidor. O Server Component nunca conhece o navegador. Hooks de estado e de contexto de cliente seguem a mesma lógica.",
          },
          {
            pergunta: "Por que a ferramenta reclama em vez de simplesmente não funcionar?",
            resposta:
              "Porque o bundler e o React sabem em que mundo cada módulo está. Usar `useState` em código de servidor costuma produzir um erro de compilação ou de execução que pede a diretiva `'use client'`. É melhor falhar cedo do que entregar uma tela que não reage.",
          },
          {
            pergunta: "Então como obter interatividade?",
            resposta:
              "**Compondo.** O Server Component busca os dados e monta a estrutura; as partes que reagem ao usuário viram **Client Components** pequenos, importados por ele e alimentados por props serializáveis. O servidor continua com `async`/`await`, banco e arquivos; o cliente guarda o `useState`.",
          },
        ],
        causaRaiz:
          "Um Server Component é uma função que roda **uma vez, no servidor, e termina**. Estado, efeitos e eventos pertencem a quem permanece vivo no navegador, e é para isso que existem os **Client Components**.",
      },
      {
        tipo: "tabela",
        titulo: "O que cada tipo pode usar",
        colunas: ["Quero usar…", "Server Component?", "Onde fazer"],
        linhas: [
          ["`useState`, `useReducer`", "Não", "Em um Client Component"],
          ["`useEffect`, `useLayoutEffect`", "Não", "Em um Client Component"],
          ["Eventos (`onClick`, `onChange`)", "Não", "Em um Client Component"],
          [
            "APIs do navegador (`window`, `document`, `localStorage`)",
            "Não: não existem no servidor",
            "Em um Client Component, dentro de um efeito ou de um handler",
          ],
          ["`async`/`await`, banco, arquivos, segredos", "Sim", "No próprio Server Component"],
          ["Renderizar Client Components e passar props", "Sim", "No próprio Server Component"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Estado fora do Server Component",
        legenda: "TSX",
        codigo: `// Perfil.tsx: Server Component
import { BotaoMenu } from "./BotaoMenu";

export default async function Perfil({ id }: { id: string }) {
  // const [aberto, setAberto] = useState(false); // erro aqui: hook de estado
  const usuario = await buscarUsuario(id); // async/await é permitido
  return (
    <section>
      <h1>{usuario.nome}</h1>
      <BotaoMenu /> {/* a interatividade mora no Client Component */}
    </section>
  );
}

// BotaoMenu.tsx: Client Component
"use client";
import { useState } from "react";

export function BotaoMenu() {
  const [aberto, setAberto] = useState(false);
  return <button onClick={() => setAberto(!aberto)}>{aberto ? "Fechar" : "Menu"}</button>;
}`,
        nota: "`buscarUsuario` é uma função sua. Os dois trechos são arquivos separados.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "E as APIs do navegador?",
        texto:
          "Um Server Component não pode lê-las. Leve o trecho para um Client Component e use-as dentro de um **efeito ou de um handler**, nunca no corpo da renderização: o Client Component também é pré-renderizado no servidor, e lá `window` não existe. Para o que vem da requisição (cookies, cabeçalhos), use as APIs do framework no servidor. Confira react.dev e a documentação do seu framework.",
      },
    ],
    armadilhas: [
      "Tentar “consertar” o erro marcando a página inteira com `'use client'`: o erro some, mas a página perde as vantagens do servidor. Extraia só a parte interativa.",
      "Colocar um `onClick` ou outro handler direto em um elemento de um Server Component: handlers de evento não são permitidos ali. Mova o elemento para um Client Component.",
      "Ler `window` ou `localStorage` no corpo de um Client Component: ele é pré-renderizado no servidor, onde isso não existe. Use um efeito ou um handler.",
      "Achar que componente `async` funciona em qualquer lugar: o componente assíncrono é um recurso de Server Component.",
    ],
    autoteste: [
      {
        pergunta: "Um Server Component pode usar `useState()`? Por quê?",
        resposta:
          "Não. Ele renderiza uma vez no servidor e não é reexecutado no navegador, então não há estado que mude. Para estado, use um Client Component.",
      },
      {
        pergunta: "Um Server Component pode usar APIs do navegador?",
        resposta:
          "Não: `window`, `document` e `localStorage` não existem no servidor, e o componente nem roda no navegador. Use um Client Component, dentro de um efeito ou de um handler.",
      },
    ],
  },
  en: {
    titulo: "Server Component with useState",
    pergunta: "Can a Server Component use useState()?",
    porqueEsteMetodo:
      "The short answer (“no”) is easy to memorize and easy to forget. The chain of whys ties the ban to the execution model: when and where a Server Component runs, what reaches the browser and what is left for Client Components.",
    resposta30s:
      "**No.** A Server Component renders **once, on the server**, and delivers a result; its code **is not re-executed in the browser**, so there is no state that changes, nor effects or events, and the state, effect and context hooks require a **Client Component** (`'use client'`). What it can do is `async`/`await` and direct data access; interactivity comes from composing it with small Client Components.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why can’t a Server Component have state?",
            resposta:
              "Because state only makes sense if the component renders again after the first time, when the interface changes. A Server Component runs **once per request or navigation**, on the server, and finishes. There is no second local render in which the value of a `useState` could change.",
          },
          {
            pergunta: "Why doesn’t the code run again in the browser?",
            resposta:
              "Because it never gets there. The browser receives the **serialized result** of the render, not the component’s code. With no code on the client, nothing there can listen to a click, update a value or fire an effect.",
          },
          {
            pergunta: "Why does the same apply to effects, events and browser APIs?",
            resposta:
              "Because all of them assume a browser: `useEffect` runs after the interface appears, `onClick` needs a live DOM node, and `window`, `document` and `localStorage` simply don’t exist on the server. A Server Component never meets the browser. Client state and context hooks follow the same logic.",
          },
          {
            pergunta: "Why does the tooling complain instead of just not working?",
            resposta:
              "Because the bundler and React know which world each module lives in. Using `useState` in server code usually produces a build or runtime error asking for the `'use client'` directive. It is better to fail early than to deliver a screen that doesn’t react.",
          },
          {
            pergunta: "So how do you get interactivity?",
            resposta:
              "**By composing.** The Server Component fetches the data and builds the structure; the parts that react to the user become small **Client Components**, imported by it and fed by serializable props. The server keeps `async`/`await`, the database and files; the client holds the `useState`.",
          },
        ],
        causaRaiz:
          "A Server Component is a function that runs **once, on the server, and finishes**. State, effects and events belong to whatever stays alive in the browser, and that is what **Client Components** are for.",
      },
      {
        tipo: "tabela",
        titulo: "What each kind can use",
        colunas: ["I want to use…", "Server Component?", "Where to do it"],
        linhas: [
          ["`useState`, `useReducer`", "No", "In a Client Component"],
          ["`useEffect`, `useLayoutEffect`", "No", "In a Client Component"],
          ["Events (`onClick`, `onChange`)", "No", "In a Client Component"],
          [
            "Browser APIs (`window`, `document`, `localStorage`)",
            "No: they don’t exist on the server",
            "In a Client Component, inside an effect or a handler",
          ],
          ["`async`/`await`, database, files, secrets", "Yes", "In the Server Component itself"],
          ["Rendering Client Components and passing props", "Yes", "In the Server Component itself"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "State outside the Server Component",
        legenda: "TSX",
        codigo: `// Profile.tsx: Server Component
import { MenuButton } from "./MenuButton";

export default async function Profile({ id }: { id: string }) {
  // const [open, setOpen] = useState(false); // error here: a state hook
  const user = await fetchUser(id); // async/await is allowed
  return (
    <section>
      <h1>{user.name}</h1>
      <MenuButton /> {/* the interactivity lives in the Client Component */}
    </section>
  );
}

// MenuButton.tsx: Client Component
"use client";
import { useState } from "react";

export function MenuButton() {
  const [open, setOpen] = useState(false);
  return <button onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>;
}`,
        nota: "`fetchUser` is your own function. The two snippets are separate files.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What about browser APIs?",
        texto:
          "A Server Component can’t read them. Move that piece to a Client Component and use them inside an **effect or a handler**, never in the render body: a Client Component is also pre-rendered on the server, and `window` doesn’t exist there. For what comes from the request (cookies, headers), use the framework’s APIs on the server. Check react.dev and your framework’s documentation.",
      },
    ],
    armadilhas: [
      "Trying to “fix” the error by marking the whole page `'use client'`: the error goes away, but the page loses the server’s advantages. Extract only the interactive part.",
      "Putting an `onClick` or other handler directly on an element of a Server Component: event handlers aren’t allowed there. Move the element to a Client Component.",
      "Reading `window` or `localStorage` in the body of a Client Component: it is pre-rendered on the server, where that doesn’t exist. Use an effect or a handler.",
      "Thinking an `async` component works anywhere: the asynchronous component is a Server Component feature.",
    ],
    autoteste: [
      {
        pergunta: "Can a Server Component use `useState()`? Why?",
        resposta:
          "No. It renders once on the server and is not re-executed in the browser, so there is no state that changes. For state, use a Client Component.",
      },
      {
        pergunta: "Can a Server Component use browser APIs?",
        resposta:
          "No: `window`, `document` and `localStorage` don’t exist on the server, and the component doesn’t even run in the browser. Use a Client Component, inside an effect or a handler.",
      },
    ],
  },
};
