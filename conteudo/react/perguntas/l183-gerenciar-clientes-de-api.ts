import type { Pergunta } from "../../tipos";

// L183 · Gerenciar clientes de API
export const l183: Pergunta = {
  numero: 183,
  modulo: "linkedin-rotas-e-arquitetura",
  metodo: "design",
  pt: {
    titulo: "Gerenciar clientes de API",
    pergunta: "Como você gerencia clientes de API?",
    porqueEsteMetodo:
      "É uma pergunta de arquitetura: o importante não é escolher entre `fetch` e axios, e sim onde ficam URL, autenticação, erros e tipos, e quem pode conhecê-los. Um roteiro de projeto leva da camada única até os testes.",
    resposta30s:
      "Crie **uma camada única** (`api/`) que concentra a **URL base, os cabeçalhos, a autenticação, a renovação de token e o tratamento de erros**, e exponha **funções por recurso, tipadas** (`listarPedidos`); os componentes só chamam essas funções e **não conhecem o transporte**. Deixe cache e estado de carregamento para uma **biblioteca de consulta** (TanStack Query) e teste a camada com a rede simulada (por exemplo, MSW). `fetch`, axios ou um cliente gerado da especificação são o detalhe de dentro dessa camada.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Um único jeito de falar com a API: URL base por ambiente, cabeçalhos, autenticação, tratamento de erro e de renovação de sessão, tipos das respostas, cancelamento e testes. Vários serviços, próprios e de terceiros, podem pedir mais de um cliente.",
          },
          {
            titulo: "2. Decisão central: uma camada fina que os componentes não conhecem",
            texto:
              "Todo acesso à API passa por um módulo (`api/`): funções por recurso (`listarPedidos`, `criarPedido`) que devolvem dados tipados e lançam erros tipados. Componentes e hooks chamam essas funções e nunca montam URL, cabeçalho ou `fetch` na mão.",
          },
          {
            titulo: "3. O cliente base",
            texto:
              "Uma função (ou instância) que junta URL base, `Content-Type`, credenciais, tempo limite e leitura do corpo, e que **transforma a resposta de erro em exceção**, porque o `fetch` não rejeita em 4xx e 5xx.",
          },
          {
            titulo: "4. Autenticação e renovação",
            texto:
              "Anexe o token ou use o cookie. Ao receber 401, renove uma vez (compartilhando uma única renovação entre as chamadas simultâneas), repita a requisição e, se falhar, encaminhe para o logout. Com axios isso mora num interceptador; com `fetch`, no próprio wrapper.",
          },
          {
            titulo: "5. Tipos",
            texto:
              "Tipos escritos à mão e, nas fronteiras de risco, validação em tempo de execução com um esquema (como o Zod); ou clientes e tipos gerados de uma especificação OpenAPI, que mantêm cliente e servidor sincronizados.",
          },
          {
            titulo: "6. Estado do servidor fica à parte",
            texto:
              "O cliente HTTP só transporta. Cache, revalidação, tentativas e os estados de carregando e erro ficam numa biblioteca de consulta (como o TanStack Query), que chama as funções da camada e repassa o `signal` para cancelar (veja L165).",
          },
          {
            titulo: "7. Testes",
            texto:
              "Teste a camada com um servidor de mentira na rede (como o MSW), em vez de simular `fetch` em cada teste (veja L194). Sinal de acerto: trocar `fetch` por axios, ou por um cliente gerado, não quebra nenhum componente.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O cliente base",
        legenda: "TypeScript",
        codigo: [
          "export class ErroDeApi extends Error {",
          "  constructor(public status: number, mensagem: string, public detalhes?: unknown) {",
          "    super(mensagem);",
          "  }",
          "}",
          "",
          "const BASE = import.meta.env.VITE_API_URL;",
          "",
          "export async function http<T>(caminho: string, init: RequestInit = {}): Promise<T> {",
          "  const resposta = await fetch(`${BASE}${caminho}`, {",
          "    ...init,",
          '    credentials: "include",',
          '    headers: { "Content-Type": "application/json", ...init.headers },',
          "    signal: init.signal ?? AbortSignal.timeout(10_000), // tempo limite padrão",
          "  });",
          "  if (!resposta.ok) {",
          "    throw new ErroDeApi(resposta.status, resposta.statusText, await resposta.json().catch(() => null));",
          "  }",
          "  return resposta.status === 204 ? (undefined as T) : resposta.json();",
          "}",
        ].join("\n"),
        nota: "Faltam a renovação de token e as tentativas, que também moram aqui. O corpo de erro do servidor pode conter detalhes que não devem ir à tela: traduza antes de mostrar.",
      },
      {
        tipo: "codigo",
        titulo: "Funções por recurso e uso nos componentes",
        legenda: "TypeScript",
        codigo: [
          "// api/pedidos.ts: o único lugar que conhece URLs e formatos",
          "export type Pedido = { id: string; total: number };",
          "",
          'export const listarPedidos = (signal?: AbortSignal) => http<Pedido[]>("/pedidos", { signal });',
          "export const criarPedido = (corpo: { itens: string[] }) =>",
          '  http<Pedido>("/pedidos", { method: "POST", body: JSON.stringify(corpo) });',
          "",
          "// no componente: nenhum detalhe de transporte",
          'const { data } = useQuery({ queryKey: ["pedidos"], queryFn: ({ signal }) => listarPedidos(signal) });',
        ].join("\n"),
        nota: "A troca de `fetch` por axios, ou por um cliente gerado, acontece dentro de `http` ou deste módulo, sem tocar nos componentes.",
      },
      {
        tipo: "tabela",
        titulo: "fetch, axios e cliente gerado",
        colunas: ["Opção", "Vantagens", "Limites"],
        linhas: [
          [
            "`fetch` com um wrapper próprio",
            "Nativo, sem dependência, com streaming e cancelamento por `AbortSignal`",
            "Não rejeita em 4xx e 5xx e não tem interceptadores nem JSON automático: o wrapper é seu",
          ],
          [
            "axios (ou cliente semelhante)",
            "Instância com padrões, interceptadores, rejeição por status de erro e transformação de dados",
            "Dependência a mais, que costuma repetir o que o `fetch` já faz; interceptadores demais escondem comportamento",
          ],
          [
            "Cliente gerado de uma especificação (OpenAPI)",
            "Tipos e funções sincronizados com o contrato; menos erro manual",
            "Exige uma especificação mantida e um passo de geração; o código gerado é extenso e ainda precisa de autenticação e de erros",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Um único ponto de troca",
        texto:
          "Os componentes dependem de **funções com nomes do domínio**, não de URLs nem de `fetch` ou axios. Trocar o transporte, mudar o cabeçalho de autenticação ou gerar o cliente a partir da especificação acontece num lugar só. Regra de divisão: **transporte, autenticação e erros na camada de API; cache e estado de carregamento na biblioteca de consulta; apresentação nos componentes**.",
      },
    ],
    armadilhas: [
      "Chamar `fetch` e montar URLs dentro dos componentes: espalha detalhes de transporte, e qualquer mudança vira uma caça em dezenas de arquivos.",
      "Esquecer `resposta.ok` com `fetch`: respostas 4xx e 5xx passam por sucesso e o erro aparece longe da causa.",
      "Renovar o token sem compartilhar a renovação: cinco chamadas simultâneas com 401 disparam cinco renovações, e uma pode invalidar as outras.",
      "Repetir automaticamente requisições que não são idempotentes (como um `POST` de pagamento): a repetição duplica o efeito; só tente de novo o que for seguro repetir.",
    ],
    autoteste: [
      {
        pergunta: "Por que isolar as chamadas de API numa camada em vez de usar `fetch` nos componentes?",
        resposta:
          "Para que URL, cabeçalhos, autenticação, tratamento de erro e tipos existam num lugar só. Os componentes ficam simples, trocar o transporte não os afeta e os testes simulam a rede num ponto.",
      },
      {
        pergunta: "Qual é a diferença entre o cliente de API e uma biblioteca de consulta como o TanStack Query?",
        resposta:
          "O cliente transporta: monta a requisição e trata autenticação e erros. A biblioteca de consulta gerencia o estado do servidor: cache, revalidação, tentativas, carregando e erro. Ela chama as funções do cliente; uma não substitui a outra.",
      },
    ],
  },
  en: {
    titulo: "Managing API clients",
    pergunta: "How do you manage API clients?",
    porqueEsteMetodo:
      "This is an architecture question: what matters is not choosing between `fetch` and axios, but where the URL, authentication, errors and types live, and who may know about them. A design script leads from the single layer through to testing.",
    resposta30s:
      "Create **a single layer** (`api/`) that concentrates the **base URL, headers, authentication, token renewal and error handling**, and expose **typed functions per resource** (`listOrders`); components only call those functions and **know nothing about transport**. Leave caching and loading state to a **query library** (TanStack Query) and test the layer with a simulated network (for example, MSW). `fetch`, axios or a client generated from the specification are an internal detail of that layer.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "A single way to talk to the API: base URL per environment, headers, authentication, error and session-renewal handling, response types, cancellation and tests. Several services, your own and third-party, may call for more than one client.",
          },
          {
            titulo: "2. Central decision: a thin layer that components do not know",
            texto:
              "All API access goes through one module (`api/`): per-resource functions (`listOrders`, `createOrder`) that return typed data and throw typed errors. Components and hooks call those functions and never build a URL, a header or a `fetch` by hand.",
          },
          {
            titulo: "3. The base client",
            texto:
              "A function (or instance) that combines the base URL, `Content-Type`, credentials, a timeout and body parsing, and that **turns an error response into an exception**, because `fetch` does not reject on 4xx and 5xx.",
          },
          {
            titulo: "4. Authentication and renewal",
            texto:
              "Attach the token or use the cookie. On a 401, renew once (sharing a single renewal among simultaneous calls), repeat the request and, if that fails, route to logout. In axios this lives in an interceptor; with `fetch`, in the wrapper itself.",
          },
          {
            titulo: "5. Types",
            texto:
              "Hand-written types and, at risky boundaries, runtime validation with a schema (such as Zod); or clients and types generated from an OpenAPI specification, which keep client and server in sync.",
          },
          {
            titulo: "6. Server state stays separate",
            texto:
              "The HTTP client only transports. Caching, revalidation, retries and the loading and error states live in a query library (such as TanStack Query), which calls the layer’s functions and forwards the `signal` for cancellation (see L165).",
          },
          {
            titulo: "7. Tests",
            texto:
              "Test the layer with a fake server on the network (such as MSW) instead of mocking `fetch` in every test (see L194). Sign you got it right: swapping `fetch` for axios, or for a generated client, breaks no component.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The base client",
        legenda: "TypeScript",
        codigo: [
          "export class ApiError extends Error {",
          "  constructor(public status: number, message: string, public details?: unknown) {",
          "    super(message);",
          "  }",
          "}",
          "",
          "const BASE = import.meta.env.VITE_API_URL;",
          "",
          "export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {",
          "  const response = await fetch(`${BASE}${path}`, {",
          "    ...init,",
          '    credentials: "include",',
          '    headers: { "Content-Type": "application/json", ...init.headers },',
          "    signal: init.signal ?? AbortSignal.timeout(10_000), // default timeout",
          "  });",
          "  if (!response.ok) {",
          "    throw new ApiError(response.status, response.statusText, await response.json().catch(() => null));",
          "  }",
          "  return response.status === 204 ? (undefined as T) : response.json();",
          "}",
        ].join("\n"),
        nota: "Token renewal and retries are missing, and they also live here. The server’s error body may contain details that should not reach the screen: translate it before showing it.",
      },
      {
        tipo: "codigo",
        titulo: "Per-resource functions and use in components",
        legenda: "TypeScript",
        codigo: [
          "// api/orders.ts: the only place that knows URLs and formats",
          "export type Order = { id: string; total: number };",
          "",
          'export const listOrders = (signal?: AbortSignal) => http<Order[]>("/orders", { signal });',
          "export const createOrder = (body: { items: string[] }) =>",
          '  http<Order>("/orders", { method: "POST", body: JSON.stringify(body) });',
          "",
          "// in the component: no transport detail",
          'const { data } = useQuery({ queryKey: ["orders"], queryFn: ({ signal }) => listOrders(signal) });',
        ].join("\n"),
        nota: "Swapping `fetch` for axios, or for a generated client, happens inside `http` or this module, without touching the components.",
      },
      {
        tipo: "tabela",
        titulo: "fetch, axios and a generated client",
        colunas: ["Option", "Advantages", "Limits"],
        linhas: [
          [
            "`fetch` with your own wrapper",
            "Native, no dependency, with streaming and cancellation through `AbortSignal`",
            "Does not reject on 4xx and 5xx and has no interceptors or automatic JSON: the wrapper is yours",
          ],
          [
            "axios (or a similar client)",
            "Instance with defaults, interceptors, rejection on error statuses and data transformation",
            "An extra dependency that often repeats what `fetch` already does; too many interceptors hide behavior",
          ],
          [
            "A client generated from a specification (OpenAPI)",
            "Types and functions in sync with the contract; fewer manual mistakes",
            "Needs a maintained specification and a generation step; generated code is extensive and still needs authentication and errors",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A single swap point",
        texto:
          "Components depend on **functions named after the domain**, not on URLs or on `fetch` or axios. Changing the transport, the authentication header or generating the client from the specification happens in one place. Division rule: **transport, authentication and errors in the API layer; caching and loading state in the query library; presentation in the components**.",
      },
    ],
    armadilhas: [
      "Calling `fetch` and building URLs inside components: it scatters transport details, and any change becomes a hunt across dozens of files.",
      "Forgetting `response.ok` with `fetch`: 4xx and 5xx responses pass as success and the error shows up far from its cause.",
      "Renewing the token without sharing the renewal: five simultaneous calls with a 401 fire five renewals, and one may invalidate the others.",
      "Automatically retrying requests that are not idempotent (such as a payment `POST`): the retry duplicates the effect; only retry what is safe to repeat.",
    ],
    autoteste: [
      {
        pergunta: "Why isolate API calls in a layer instead of using `fetch` in components?",
        resposta:
          "So the URL, headers, authentication, error handling and types live in one place. Components stay simple, swapping the transport does not affect them and tests simulate the network at one point.",
      },
      {
        pergunta: "What is the difference between the API client and a query library such as TanStack Query?",
        resposta:
          "The client transports: it builds the request and handles authentication and errors. The query library manages server state: caching, revalidation, retries, loading and error. It calls the client’s functions; one does not replace the other.",
      },
    ],
  },
};
