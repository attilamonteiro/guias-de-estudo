import type { Pergunta } from "../../tipos";

// L146 · Client falando com Server Components
export const l146: Pergunta = {
  numero: 146,
  modulo: "linkedin-rsc",
  metodo: "design",
  pt: {
    titulo: "Client falando com Server Components",
    pergunta: "Como os Client Components se comunicam com os Server Components?",
    porqueEsteMetodo:
      "Como Client e Server Components conversam é uma pergunta de desenho de fronteira: o que fica de cada lado, por onde cada informação passa e o que nunca deve cruzar. Um roteiro fixo (requisitos, direção, caminhos permitidos, segurança) evita esquecer o lado do servidor ou o vazamento de dados.",
    resposta30s:
      "O servidor guarda **dados e lógica**; o cliente, a **interatividade**. O servidor fala com o cliente por **props serializáveis** e por **JSX passado como `children`** (slots); o cliente fala com o servidor por **Server Functions**, uma API ou uma nova consulta, e **nunca importa** um Server Component diretamente. Funções comuns e instâncias de classe não atravessam, e tudo que vai em props fica **visível no navegador**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "O servidor guarda dados, segredos e lógica pesada; o cliente guarda estado de interface, eventos e APIs do navegador. A fronteira deve ser fina, e nada sensível pode cruzá-la.",
          },
          {
            titulo: "2. A direção importa",
            texto:
              "A árvore é montada de cima para baixo: o Server Component renderiza o Client Component e lhe entrega props. O caminho contrário não é um `import`: o cliente só alcança o servidor por **requisição**.",
          },
          {
            titulo: "3. Servidor para cliente: props",
            texto:
              "Valem os valores serializáveis: textos, números, booleanos, listas, objetos simples, datas, JSX e promises (confira a lista atual em react.dev). Funções comuns e instâncias de classe não atravessam.",
          },
          {
            titulo: "4. Servidor para cliente: `children` e slots",
            texto:
              "Um Client Component pode receber Server Components já prontos como `children` ou em outras props de JSX. O servidor os renderiza e o cliente apenas decide onde posicioná-los. Assim a casca interativa (abas, gaveta, modal) envolve conteúdo que continua no servidor.",
          },
          {
            titulo: "5. Cliente para servidor",
            texto:
              "Por **Server Functions** (chamadas como funções assíncronas, com argumentos serializáveis, inclusive via `<form action>`; veja L136), por uma API HTTP ou por uma nova consulta ou navegação que pede ao servidor uma árvore atualizada. Importar um Server Component em um arquivo de cliente não funciona: o módulo passa a ser código de cliente.",
          },
          {
            titulo: "6. Segurança e custo",
            texto:
              "Filtre no servidor antes de passar: envie só os campos que a tela usa, nunca um registro inteiro com campos sensíveis. Se o seu framework suporta, marque módulos que só podem rodar no servidor com um guarda (como o pacote `server-only`). E lembre que Server Functions são endpoints públicos.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Quem pode passar o quê",
        colunas: ["Caminho", "Direção", "O que atravessa", "Limites"],
        linhas: [
          [
            "Props",
            "Servidor → cliente",
            "Valores serializáveis: textos, números, listas, objetos simples, datas",
            "Funções comuns e instâncias de classe não passam; tudo fica visível no navegador",
          ],
          [
            "`children` e props de JSX (slots)",
            "Servidor → cliente",
            "Elementos de Server Components já renderizados no servidor",
            "O cliente só os posiciona; não os executa nem os re-renderiza",
          ],
          [
            "Server Function",
            "Cliente → servidor",
            "Argumentos e retorno serializáveis",
            "É um endpoint público: validar, autenticar e autorizar",
          ],
          [
            "API HTTP, nova consulta ou navegação",
            "Cliente → servidor",
            "Uma requisição comum; o framework pode devolver uma árvore atualizada",
            "Há latência, e o contrato é seu",
          ],
          [
            "`import` de um Server Component no cliente",
            "Cliente → servidor (tentativa)",
            "Nada: o módulo é tratado como código de cliente",
            "Quebra se usar recursos de servidor; use `children`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Uma casca de cliente com conteúdo do servidor",
        legenda: "TSX",
        codigo: `// Gaveta.tsx: Client Component
"use client";
import { useState, type ReactNode } from "react";

export function Gaveta({ titulo, children }: { titulo: string; children: ReactNode }) {
  const [aberta, setAberta] = useState(false);
  return (
    <section>
      <button onClick={() => setAberta(!aberta)}>{titulo}</button>
      {aberta && children}
    </section>
  );
}

// Pagina.tsx: Server Component
import { Gaveta } from "./Gaveta";

export default async function Pagina() {
  const itens = await listarItens(); // só no servidor
  return <Gaveta titulo="Itens">{itens.map((i) => <p key={i.id}>{i.nome}</p>)}</Gaveta>;
}`,
        nota: "`listarItens` é uma função sua. O cliente cuida só do abrir e fechar; a lista foi renderizada no servidor e chega como `children`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O que vaza e o que custa",
        texto:
          "Tudo que vai em props de um Client Component é enviado ao navegador e pode ser lido na rede: um objeto `usuario` completo leva junto os campos sensíveis (como um hash de senha). Mapeie para um objeto com só o que a tela usa. E o conteúdo passado como `children` é renderizado no servidor **mesmo que o cliente o mantenha fechado**, como na gaveta do exemplo, então não esconda trabalho caro ali. Confira os tipos aceitos em react.dev e no seu framework.",
      },
    ],
    armadilhas: [
      "Passar o registro inteiro do banco como prop: campos sensíveis vazam para o navegador. Envie só o necessário.",
      "Importar um Server Component dentro de um Client Component: ele vira código de cliente. Passe-o como `children` ou como prop de JSX.",
      "Passar uma função comum (um callback) do servidor ao cliente: ela não é serializável. Use uma Server Function, que atravessa como referência.",
      "Esquecer que a Server Function é pública: validar e autorizar dentro dela é obrigatório (veja L136).",
    ],
    autoteste: [
      {
        pergunta: "Como um Client Component exibe conteúdo renderizado por um Server Component?",
        resposta:
          "Recebendo-o como `children` (ou outra prop de JSX) de um Server Component pai. O servidor renderiza o conteúdo; o cliente só decide onde e quando mostrá-lo. Importar o Server Component dentro do cliente não funciona.",
      },
      {
        pergunta: "Que dados podem ser passados como props do servidor ao cliente?",
        resposta:
          "Valores serializáveis: textos, números, booleanos, listas, objetos simples, datas, JSX e promises. Funções comuns e instâncias de classe não, e tudo que vai fica visível no navegador.",
      },
    ],
  },
  en: {
    titulo: "Client talking to Server Components",
    pergunta: "How do Client Components communicate with Server Components?",
    porqueEsteMetodo:
      "How Client and Server Components talk is a boundary-design question: what stays on each side, where each piece of information passes and what must never cross. A fixed script (requirements, direction, allowed paths, security) avoids forgetting the server side or a data leak.",
    resposta30s:
      "The server holds **data and logic**; the client holds **interactivity**. The server talks to the client through **serializable props** and **JSX passed as `children`** (slots); the client talks to the server through **Server Functions**, an API or a fresh query, and **never imports** a Server Component directly. Plain functions and class instances don’t cross, and everything in props becomes **visible in the browser**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "The server holds data, secrets and heavy logic; the client holds interface state, events and browser APIs. The boundary should be thin, and nothing sensitive may cross it.",
          },
          {
            titulo: "2. Direction matters",
            texto:
              "The tree is built top-down: the Server Component renders the Client Component and hands it props. The opposite path is not an `import`: the client only reaches the server through a **request**.",
          },
          {
            titulo: "3. Server to client: props",
            texto:
              "Serializable values work: strings, numbers, booleans, lists, plain objects, dates, JSX and promises (check the current list on react.dev). Plain functions and class instances don’t cross.",
          },
          {
            titulo: "4. Server to client: `children` and slots",
            texto:
              "A Client Component can receive ready-made Server Components as `children` or in other JSX props. The server renders them and the client only decides where to place them. That way the interactive shell (tabs, drawer, modal) wraps content that stays on the server.",
          },
          {
            titulo: "5. Client to server",
            texto:
              "Through **Server Functions** (called as async functions, with serializable arguments, including via `<form action>`; see L136), through an HTTP API, or through a fresh query or navigation that asks the server for an updated tree. Importing a Server Component into a client file doesn’t work: the module becomes client code.",
          },
          {
            titulo: "6. Security and cost",
            texto:
              "Filter on the server before passing anything: send only the fields the screen uses, never a whole record with sensitive fields. If your framework supports it, mark modules that may only run on the server with a guard (such as the `server-only` package). And remember that Server Functions are public endpoints.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Who can pass what",
        colunas: ["Path", "Direction", "What crosses", "Limits"],
        linhas: [
          [
            "Props",
            "Server → client",
            "Serializable values: strings, numbers, lists, plain objects, dates",
            "Plain functions and class instances don’t pass; everything is visible in the browser",
          ],
          [
            "`children` and JSX props (slots)",
            "Server → client",
            "Elements of Server Components already rendered on the server",
            "The client only places them; it neither executes nor re-renders them",
          ],
          [
            "Server Function",
            "Client → server",
            "Serializable arguments and return value",
            "It is a public endpoint: validate, authenticate and authorize",
          ],
          [
            "HTTP API, fresh query or navigation",
            "Client → server",
            "An ordinary request; the framework may return an updated tree",
            "There is latency, and the contract is yours",
          ],
          [
            "`import` of a Server Component on the client",
            "Client → server (attempted)",
            "Nothing: the module is treated as client code",
            "Breaks if it uses server resources; use `children`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A client shell with server content",
        legenda: "TSX",
        codigo: `// Drawer.tsx: Client Component
"use client";
import { useState, type ReactNode } from "react";

export function Drawer({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <section>
      <button onClick={() => setOpen(!open)}>{title}</button>
      {open && children}
    </section>
  );
}

// Page.tsx: Server Component
import { Drawer } from "./Drawer";

export default async function Page() {
  const items = await listItems(); // only on the server
  return <Drawer title="Items">{items.map((i) => <p key={i.id}>{i.name}</p>)}</Drawer>;
}`,
        nota: "`listItems` is your own function. The client only handles opening and closing; the list was rendered on the server and arrives as `children`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What leaks and what it costs",
        texto:
          "Everything passed in props to a Client Component is sent to the browser and can be read on the network: a whole `user` object carries its sensitive fields along (such as a password hash). Map it to an object with only what the screen uses. And content passed as `children` is rendered on the server **even if the client keeps it closed**, as in the drawer example, so don’t hide expensive work there. Check the accepted types on react.dev and in your framework.",
      },
    ],
    armadilhas: [
      "Passing the whole database record as a prop: sensitive fields leak to the browser. Send only what is needed.",
      "Importing a Server Component inside a Client Component: it becomes client code. Pass it as `children` or as a JSX prop.",
      "Passing a plain function (a callback) from server to client: it isn’t serializable. Use a Server Function, which crosses as a reference.",
      "Forgetting that a Server Function is public: validating and authorizing inside it is mandatory (see L136).",
    ],
    autoteste: [
      {
        pergunta: "How does a Client Component display content rendered by a Server Component?",
        resposta:
          "By receiving it as `children` (or another JSX prop) from a parent Server Component. The server renders the content; the client only decides where and when to show it. Importing the Server Component inside the client doesn’t work.",
      },
      {
        pergunta: "What data can be passed as props from server to client?",
        resposta:
          "Serializable values: strings, numbers, booleans, lists, plain objects, dates, JSX and promises. Plain functions and class instances can’t, and everything passed is visible in the browser.",
      },
    ],
  },
};
