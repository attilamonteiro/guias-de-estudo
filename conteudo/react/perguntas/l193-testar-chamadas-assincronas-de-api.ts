import type { Pergunta } from "../../tipos";

// L193 · Testar chamadas assíncronas de API
export const l193: Pergunta = {
  numero: 193,
  modulo: "linkedin-testes",
  metodo: "trace",
  pt: {
    titulo: "Testar chamadas assíncronas de API",
    pergunta: "Como você testa chamadas assíncronas de API?",
    porqueEsteMetodo:
      "O difícil de um teste assíncrono é o tempo: o que a tela mostra antes, durante e depois da resposta. Seguir um teste do começo ao fim, inclusive o caminho em que a API falha, mostra onde esperar e o que simular.",
    resposta30s:
      "O teste **intercepta a requisição** com um mock (o **MSW** na camada de rede, ou um `fetch` simulado), renderiza o componente, confere o estado de **carregando**, **espera** a resposta com `findBy` ou `waitFor` (nunca com pausas fixas) e afirma a tela final. Para **erro** e **lentidão**, troque a resposta só naquele teste; **limpe os mocks** entre os testes e espere a interface assentar para evitar os avisos de `act`.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Um teste, do início ao fim",
        etapas: [
          "O teste prepara a rede falsa: o MSW intercepta `GET /usuarios` e responde com um JSON de exemplo",
          "`render(<ListaDeUsuarios />)` monta o componente; o efeito ou a biblioteca de dados dispara o `fetch` e, na hora, a tela mostra “Carregando...”",
          "O teste afirma o estado de carregando já, com `getByText` ou `getByRole('status')`, antes de qualquer resposta",
          "A requisição chega ao handler do mock, que devolve a resposta; a promise resolve e o componente atualiza o estado",
          "O teste espera com `await screen.findByText('Ana')`, que repete a consulta até o elemento aparecer ou o tempo limite estourar",
          "Afirma o resultado final: a lista está na tela e o “Carregando...” sumiu (`queryByText` devolve `null`)",
        ],
        nota: "Nenhuma pausa fixa: o teste espera exatamente o necessário, e falha com uma mensagem clara se a resposta nunca chegar.",
      },
      {
        tipo: "passos",
        titulo: "Os caminhos em que algo dá errado",
        passos: [
          {
            titulo: "A API devolve erro",
            texto:
              "Troque o handler só naquele teste (`server.use(...)`) para responder com status 500 ou `HttpResponse.error()` (falha de rede) e afirme a mensagem de erro com `findByRole('alert')`. Teste também o botão “Tentar de novo”, se existir.",
          },
          {
            titulo: "A resposta demora",
            texto:
              "Para observar o carregando, afirme-o antes de a resposta chegar, ou use um atraso no handler (`delay()` do MSW) ou uma promise que você resolve na mão. Para simular um tempo limite, use o relógio falso do Jest ou do Vitest e avance o tempo dentro de `act`.",
          },
          {
            titulo: "O teste contamina o seguinte",
            texto:
              "Restaure os handlers (`server.resetHandlers()` em `afterEach`), limpe os mocks (`vi.restoreAllMocks()` ou `jest.restoreAllMocks()`) e crie um cliente de dados novo por teste: o cache de bibliotecas como TanStack Query ou SWR faria o teste B ler a resposta do teste A.",
          },
          {
            titulo: "Surge o aviso de act",
            texto:
              "Ele aparece quando o estado muda depois de o teste já ter seguido em frente. Não silencie: espere a mudança com `findBy` ou `waitFor` até a interface assentar. A Testing Library já envolve essas esperas em `act`, então não é preciso embrulhar tudo à mão.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "MSW: sucesso e erro",
        legenda: "JSX",
        codigo: `import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const url = "https://api.exemplo.com/usuarios";
const server = setupServer(http.get(url, () => HttpResponse.json([{ id: 1, nome: "Ana" }])));
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("carrega e mostra os usuários", async () => {
  render(<ListaDeUsuarios />);
  expect(screen.getByText("Carregando...")).toBeInTheDocument();
  expect(await screen.findByText("Ana")).toBeInTheDocument();
});

test("mostra erro quando a API falha", async () => {
  server.use(http.get(url, () => new HttpResponse(null, { status: 500 })));
  render(<ListaDeUsuarios />);
  expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível carregar");
});`,
        nota: "A sintaxe para declarar handlers mudou entre versões do MSW; confira a documentação oficial da versão que você usa.",
      },
      {
        tipo: "tabela",
        titulo: "Onde interceptar a chamada",
        colunas: ["Opção", "Como funciona", "Vantagem", "Cuidado"],
        linhas: [
          [
            "MSW (camada de rede)",
            "Intercepta a requisição de verdade; o componente roda sem saber que há um mock",
            "Testa a requisição inteira (URL, método, corpo) e a mesma definição serve a testes e ao desenvolvimento",
            "Exige configuração do servidor de teste e a limpeza dos handlers",
          ],
          [
            "`fetch` simulado (`vi.fn()` ou `jest.fn()`)",
            "Substitui o `fetch` global por uma função falsa que devolve a resposta",
            "Simples e rápido para poucos casos",
            "Acopla o teste à chamada exata e vira trabalho com muitos cenários",
          ],
          [
            "Mock do módulo da API (`vi.mock('./api')`)",
            "Troca a função que chama a API por uma falsa",
            "Isola o componente da camada de requisição",
            "Não testa a camada de requisição e pode divergir do contrato real",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Pausas fixas e awaits esquecidos",
        texto:
          "`setTimeout` fixo deixa o teste lento (espera demais) e intermitente (espera de menos em máquina lenta). O contrário também engana: afirmar logo depois do `render`, sem esperar, testa a tela antes da resposta. Use `findBy*` para o que aparece depois e `waitFor` para uma condição qualquer, e lembre-se do `await`: sem ele o teste termina antes de a interface mudar. Veja L191 para o passo a passo geral.",
      },
    ],
    armadilhas: [
      "Afirmar o conteúdo final logo depois do `render`, sem esperar: o teste vê o estado de carregando e falha ou passa por acaso.",
      "Usar `setTimeout` ou `sleep` no teste: fica lento e intermitente. Espere com `findBy` ou `waitFor`.",
      "Não restaurar os handlers, os mocks e o cache de dados entre os testes: a resposta de um teste vaza para o seguinte.",
      "Simular a resposta com um formato que a API real nunca devolveria: o teste passa e a aplicação quebra em produção.",
    ],
    autoteste: [
      {
        pergunta: "Por que usar `findBy` ou `waitFor` em vez de uma pausa fixa em um teste assíncrono?",
        resposta:
          "Porque eles repetem a verificação até a condição ser verdadeira ou o tempo limite acabar: o teste espera só o necessário e falha com uma mensagem clara. Uma pausa fixa é lenta quando sobra e intermitente quando falta.",
      },
      {
        pergunta: "Como você testa o estado de erro e o de carregamento de um componente que chama uma API?",
        resposta:
          "Para o carregando, afirma o texto ou o papel de status logo após o `render`, antes de a resposta chegar. Para o erro, troca o handler só naquele teste (status 500 ou falha de rede) e espera a mensagem com `findByRole('alert')`.",
      },
    ],
  },
  en: {
    titulo: "Testing async API calls",
    pergunta: "How do you test asynchronous API calls?",
    porqueEsteMetodo:
      "The hard part of an async test is time: what the screen shows before, during and after the response. Following one test from start to finish, including the path where the API fails, shows where to wait and what to fake.",
    resposta30s:
      "The test **intercepts the request** with a mock (**MSW** at the network layer, or a faked `fetch`), renders the component, checks the **loading** state, **waits** for the response with `findBy` or `waitFor` (never fixed pauses) and asserts the final screen. For **errors** and **slowness**, swap the response for that one test; **clear the mocks** between tests and let the interface settle to avoid `act` warnings.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One test, start to finish",
        etapas: [
          "The test sets up the fake network: MSW intercepts `GET /users` and answers with a sample JSON",
          "`render(<UserList />)` mounts the component; the effect or the data library fires the `fetch` and, right away, the screen shows “Loading...”",
          "The test asserts the loading state at once, with `getByText` or `getByRole('status')`, before any response",
          "The request reaches the mock handler, which returns the response; the promise resolves and the component updates its state",
          "The test waits with `await screen.findByText('Ana')`, which repeats the query until the element appears or the timeout expires",
          "It asserts the final result: the list is on screen and “Loading...” is gone (`queryByText` returns `null`)",
        ],
        nota: "No fixed pause: the test waits exactly as long as needed, and fails with a clear message if the response never arrives.",
      },
      {
        tipo: "passos",
        titulo: "The paths where something goes wrong",
        passos: [
          {
            titulo: "The API returns an error",
            texto:
              "Swap the handler for that test only (`server.use(...)`) to answer with status 500 or `HttpResponse.error()` (a network failure) and assert the error message with `findByRole('alert')`. Also test the “Try again” button, if there is one.",
          },
          {
            titulo: "The response is slow",
            texto:
              "To observe the loading state, assert it before the response arrives, or add a delay in the handler (MSW’s `delay()`) or use a promise you resolve by hand. For a real timeout, use Jest’s or Vitest’s fake clock, advancing time inside `act`.",
          },
          {
            titulo: "One test contaminates the next",
            texto:
              "Reset the handlers (`server.resetHandlers()` in `afterEach`), clear the mocks (`vi.restoreAllMocks()` or `jest.restoreAllMocks()`) and create a fresh data client per test: the cache of libraries such as TanStack Query or SWR would make test B read test A’s response.",
          },
          {
            titulo: "An act warning appears",
            texto:
              "It shows up when state changes after the test has already moved on. Do not silence it: wait for the change with `findBy` or `waitFor` until the interface settles. Testing Library already wraps those waits in `act`, so you do not need to wrap everything by hand.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "MSW: success and error",
        legenda: "JSX",
        codigo: `import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const url = "https://api.example.com/users";
const server = setupServer(http.get(url, () => HttpResponse.json([{ id: 1, name: "Ana" }])));
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("loads and shows the users", async () => {
  render(<UserList />);
  expect(screen.getByText("Loading...")).toBeInTheDocument();
  expect(await screen.findByText("Ana")).toBeInTheDocument();
});

test("shows an error when the API fails", async () => {
  server.use(http.get(url, () => new HttpResponse(null, { status: 500 })));
  render(<UserList />);
  expect(await screen.findByRole("alert")).toHaveTextContent("Could not load");
});`,
        nota: "The syntax for declaring handlers changed between MSW versions; check the official documentation for the version you use.",
      },
      {
        tipo: "tabela",
        titulo: "Where to intercept the call",
        colunas: ["Option", "How it works", "Advantage", "Caution"],
        linhas: [
          [
            "MSW (network layer)",
            "Intercepts the real request; the component runs without knowing there is a mock",
            "Tests the whole request (URL, method, body) and the same definition serves tests and development",
            "Needs a test server setup and handler cleanup",
          ],
          [
            "Faked `fetch` (`vi.fn()` or `jest.fn()`)",
            "Replaces the global `fetch` with a fake function that returns the response",
            "Simple and fast for a few cases",
            "Couples the test to the exact call and becomes laborious with many scenarios",
          ],
          [
            "Mock of the API module (`vi.mock('./api')`)",
            "Swaps the function that calls the API for a fake one",
            "Isolates the component from the request layer",
            "Does not test the request layer and may drift from the real contract",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Fixed pauses and forgotten awaits",
        texto:
          "A fixed `setTimeout` makes the test slow (it waits too long) and intermittent (it waits too little on a slow machine). The opposite misleads too: asserting right after `render`, without waiting, tests the screen before the response. Use `findBy*` for what appears later and `waitFor` for any condition, and remember the `await`: without it the test ends before the interface changes. See L191 for the general step-by-step.",
      },
    ],
    armadilhas: [
      "Asserting the final content right after `render`, without waiting: the test sees the loading state and fails or passes by chance.",
      "Using `setTimeout` or `sleep` in the test: it becomes slow and intermittent. Wait with `findBy` or `waitFor`.",
      "Not restoring handlers, mocks and the data cache between tests: one test’s response leaks into the next.",
      "Faking a response shape the real API would never return: the test passes and the application breaks in production.",
    ],
    autoteste: [
      {
        pergunta: "Why use `findBy` or `waitFor` instead of a fixed pause in an async test?",
        resposta:
          "Because they repeat the check until the condition is true or the timeout ends: the test waits only as long as needed and fails with a clear message. A fixed pause is slow when it is too long and intermittent when it is too short.",
      },
      {
        pergunta: "How do you test the error and loading states of a component that calls an API?",
        resposta:
          "For loading, assert the text or the status role right after `render`, before the response arrives. For the error, swap the handler for that one test (status 500 or a network failure) and wait for the message with `findByRole('alert')`.",
      },
    ],
  },
};
