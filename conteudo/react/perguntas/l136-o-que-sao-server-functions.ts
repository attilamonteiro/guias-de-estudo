import type { Pergunta } from "../../tipos";

// L136 · O que são Server Functions
export const l136: Pergunta = {
  numero: 136,
  modulo: "linkedin-react19",
  metodo: "trace",
  pt: {
    titulo: "O que são Server Functions",
    pergunta: "O que são Server Functions?",
    porqueEsteMetodo:
      "Uma Server Function parece uma função comum, e a mágica some quando você segue uma chamada do clique até o servidor e de volta. Seguir o pedido, inclusive o caminho em que a entrada é maliciosa ou falta permissão, mostra por que cada função é, na prática, um endpoint público.",
    resposta30s:
      "**Server Functions** são funções assíncronas que rodam **no servidor** e que o cliente chama **como se fossem locais**: o React as transforma em uma **requisição ao servidor** e devolve o resultado serializado. Ficam em arquivos ou funções marcados com `'use server'` e combinam com `<form action>`; antes eram chamadas de Server Actions. Como cada uma é um **endpoint público**, é preciso **validar a entrada, autenticar e autorizar**, sem confiar nos argumentos.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma chamada, do clique à resposta",
        etapas: [
          "Você escreve a função em um arquivo com `'use server'` no topo e a usa em um formulário: `<form action={renomearProjeto}>`",
          "No build, o bundler troca a função, no bundle do cliente, por uma **referência** (um identificador): o código e os segredos ficam só no servidor",
          "O usuário envia o formulário; o React chama a referência dentro de uma transição (uma **Action**), serializa os argumentos (aqui, o `FormData`) e faz uma requisição `POST` ao servidor",
          "O framework localiza a função pelo identificador e a executa no servidor, com acesso a banco, segredos e cookies; o valor retornado é serializado",
          "A resposta volta ao cliente: o estado pendente termina, o resultado fica disponível (por exemplo, por `useActionState`; veja L127) e o framework pode atualizar a interface com dados novos",
        ],
      },
      {
        tipo: "passos",
        titulo: "O caminho em que algo dá errado",
        passos: [
          {
            titulo: "Entrada hostil",
            texto:
              "O argumento vem do cliente, e qualquer pessoa pode chamar o endpoint sem passar pelo seu formulário. Valide tipo, tamanho e formato no servidor; não confie em campos ocultos, ids nem preços enviados.",
          },
          {
            titulo: "Sem sessão ou sem permissão",
            texto:
              "Esconder o botão não é autorização. Dentro da função, confira quem está chamando e se essa pessoa pode agir **sobre aquele recurso**, e não apenas se está logada.",
          },
          {
            titulo: "Erro durante a execução",
            texto:
              "A chamada rejeita. Para erros esperados (validação), devolva um objeto de resultado e mostre-o na tela; para os inesperados, deixe subir a um limite de erro, sem expor detalhes internos.",
          },
          {
            titulo: "Algo que não atravessa",
            texto:
              "Argumentos e retornos precisam ser serializáveis: funções comuns e instâncias de classe não passam pela rede.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Uma Server Function com os três cuidados",
        legenda: "TypeScript",
        codigo: `"use server";

import { db } from "./db";
import { obterSessao } from "./sessao";

export async function renomearProjeto(formData: FormData) {
  const sessao = await obterSessao();
  if (!sessao) throw new Error("Não autenticado"); // 1. quem chama

  const id = String(formData.get("id"));
  const nome = String(formData.get("nome") ?? "").trim();
  if (nome.length < 3 || nome.length > 80) return { erro: "Nome inválido" }; // 2. entrada

  const projeto = await db.projeto.findUnique({ where: { id } });
  if (!projeto || projeto.donoId !== sessao.usuarioId) throw new Error("Sem permissão"); // 3. recurso

  await db.projeto.update({ where: { id }, data: { nome } });
  return { erro: null };
}`,
        nota: "`db` e `obterSessao` são módulos seus. Para mostrar o objeto retornado na tela, ligue a função a `useActionState` (veja L127).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que a diretiva faz (e o que não faz)",
        texto:
          "`'use server'` marca funções que o **cliente pode chamar**: no topo de um arquivo, todas as exportações viram Server Functions; dentro do corpo de uma função, só ela. Não é o oposto de `'use client'`: Server Components são o padrão e não precisam de diretiva. `'use client'` marca onde começa o código do navegador; `'use server'` marca os pontos de entrada que o navegador pode chamar no servidor.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cada Server Function é um endpoint público",
        texto:
          "Qualquer função exportada de um arquivo `'use server'` pode ser chamada diretamente por quem descobrir o endpoint, mesmo que nenhuma tela a use. Trate-a como uma rota de API: valide a entrada, autentique, **autorize sobre o recurso**, limite abusos e não devolva dados que o chamador não poderia ver. Frameworks acrescentam proteções (como contra CSRF), mas confirme o que o seu faz e não dependa só delas. O termo “Server Actions” era o nome anterior e ainda aparece quando a função é usada como Action de um formulário; confira react.dev.",
      },
    ],
    armadilhas: [
      "Achar que `'use server'` marca Server Components: eles são o padrão e não precisam de diretiva; a diretiva marca funções que o cliente chama.",
      "Confiar nos argumentos e só esconder o botão: qualquer pessoa pode chamar o endpoint com qualquer valor. Valide, autentique e autorize dentro da função.",
      "Exportar funções auxiliares internas de um arquivo `'use server'`: toda exportação vira um endpoint público. Deixe os auxiliares fora desse arquivo.",
      "Devolver dados demais ou mensagens de erro internas: o retorno vai ao navegador.",
    ],
    autoteste: [
      {
        pergunta: "O que acontece quando o cliente chama uma Server Function?",
        resposta:
          "O bundler já trocou a função por uma referência no cliente. O React serializa os argumentos e faz uma requisição `POST` ao servidor; o framework executa a função lá e devolve o resultado serializado.",
      },
      {
        pergunta: "Por que uma Server Function exige validação e autorização?",
        resposta:
          "Porque é um endpoint público: o argumento vem do cliente e pode ser forjado por qualquer pessoa que chame a rota, com ou sem a sua interface. Autorizar dentro da função é a única barreira confiável.",
      },
    ],
  },
  en: {
    titulo: "What Server Functions are",
    pergunta: "What are Server Functions?",
    porqueEsteMetodo:
      "A Server Function looks like an ordinary function, and the magic fades when you follow one call from the click to the server and back. Tracing the request, including the path where the input is malicious or permission is missing, shows why each function is, in practice, a public endpoint.",
    resposta30s:
      "**Server Functions** are asynchronous functions that run **on the server** and that the client calls **as if they were local**: React turns the call into a **request to the server** and returns the serialized result. They live in files or functions marked with `'use server'` and pair with `<form action>`; they used to be called Server Actions. Since each one is a **public endpoint**, you must **validate the input, authenticate and authorize**, without trusting the arguments.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One call, from the click to the response",
        etapas: [
          "You write the function in a file with `'use server'` at the top and use it in a form: `<form action={renameProject}>`",
          "At build time, the bundler swaps the function, in the client bundle, for a **reference** (an identifier): the code and the secrets stay on the server only",
          "The user submits the form; React calls the reference inside a transition (an **Action**), serializes the arguments (here, the `FormData`) and makes a `POST` request to the server",
          "The framework finds the function by its identifier and runs it on the server, with access to the database, secrets and cookies; the returned value is serialized",
          "The response returns to the client: the pending state ends, the result becomes available (for example through `useActionState`; see L127) and the framework can refresh the interface with new data",
        ],
      },
      {
        tipo: "passos",
        titulo: "The path where something goes wrong",
        passos: [
          {
            titulo: "Hostile input",
            texto:
              "The argument comes from the client, and anyone can call the endpoint without going through your form. Validate type, size and format on the server; don’t trust hidden fields, ids or prices that were sent.",
          },
          {
            titulo: "No session or no permission",
            texto:
              "Hiding the button is not authorization. Inside the function, check who is calling and whether that person may act **on that resource**, not just whether they are logged in.",
          },
          {
            titulo: "An error during execution",
            texto:
              "The call rejects. For expected errors (validation), return a result object and show it on screen; for unexpected ones, let it bubble up to an error boundary, without exposing internal details.",
          },
          {
            titulo: "Something that doesn’t cross",
            texto:
              "Arguments and return values must be serializable: plain functions and class instances don’t travel over the network.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A Server Function with the three safeguards",
        legenda: "TypeScript",
        codigo: `"use server";

import { db } from "./db";
import { getSession } from "./session";

export async function renameProject(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated"); // 1. who is calling

  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 3 || name.length > 80) return { error: "Invalid name" }; // 2. input

  const project = await db.project.findUnique({ where: { id } });
  if (!project || project.ownerId !== session.userId) throw new Error("Forbidden"); // 3. resource

  await db.project.update({ where: { id }, data: { name } });
  return { error: null };
}`,
        nota: "`db` and `getSession` are your own modules. To display the returned object on screen, connect the function to `useActionState` (see L127).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What the directive does (and doesn’t)",
        texto:
          "`'use server'` marks functions the **client can call**: at the top of a file, every export becomes a Server Function; inside a function body, only that function. It is not the opposite of `'use client'`: Server Components are the default and need no directive. `'use client'` marks where browser code begins; `'use server'` marks the entry points the browser can call on the server.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Every Server Function is a public endpoint",
        texto:
          "Any function exported from a `'use server'` file can be called directly by whoever discovers the endpoint, even if no screen uses it. Treat it like an API route: validate the input, authenticate, **authorize on the resource**, limit abuse and don’t return data the caller couldn’t see. Frameworks add protections (such as against CSRF), but confirm what yours does and don’t rely on them alone. “Server Actions” was the earlier name and still appears when the function is used as a form’s Action; check react.dev.",
      },
    ],
    armadilhas: [
      "Thinking `'use server'` marks Server Components: they are the default and need no directive; the directive marks functions the client calls.",
      "Trusting the arguments and only hiding the button: anyone can call the endpoint with any value. Validate, authenticate and authorize inside the function.",
      "Exporting internal helper functions from a `'use server'` file: every export becomes a public endpoint. Keep helpers out of that file.",
      "Returning too much data or internal error messages: the return value goes to the browser.",
    ],
    autoteste: [
      {
        pergunta: "What happens when the client calls a Server Function?",
        resposta:
          "The bundler has already swapped the function for a reference on the client. React serializes the arguments and makes a `POST` request to the server; the framework runs the function there and returns the serialized result.",
      },
      {
        pergunta: "Why does a Server Function need validation and authorization?",
        resposta:
          "Because it is a public endpoint: the argument comes from the client and can be forged by anyone who calls the route, with or without your interface. Authorizing inside the function is the only reliable barrier.",
      },
    ],
  },
};
