import type { Pergunta } from "../../tipos";

// L195 · Testar Hooks customizados
export const l195: Pergunta = {
  numero: 195,
  modulo: "linkedin-testes",
  metodo: "trace",
  pt: {
    titulo: "Testar Hooks customizados",
    pergunta: "Como você testa Hooks customizados?",
    porqueEsteMetodo:
      "Um Hook só funciona dentro de um componente, então testá-lo é perguntar “quem o executa?”. Seguir uma chamada de `renderHook`, da montagem à mudança de estado, mostra o papel de `result.current`, de `act` e da espera assíncrona.",
    resposta30s:
      "Um Hook não pode ser chamado fora de um componente, então se usa o **`renderHook`** (da React Testing Library), que monta um componente de teste invisível e devolve `result.current` com o valor mais recente do Hook. Mudanças de estado são disparadas dentro de **`act`**, e o assíncrono se espera com `waitFor`. Se o Hook usa Context, passe um **`wrapper`** com os provedores; se só existe para uma tela, **teste pelo componente**.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Um teste de Hook, do início ao fim",
        etapas: [
          "`renderHook(() => useContador(5))` monta um componente de teste invisível que chama o Hook e devolve `result`, `rerender` e `unmount`",
          "`result.current` guarda o **valor mais recente** devolvido pelo Hook; leia sempre `result.current` depois de uma mudança, nunca uma cópia guardada antes",
          "Para mudar o estado, chame a função do Hook dentro de `act(() => { ... })`, que garante que o React processe o estado e os efeitos antes de o teste seguir",
          "Afirme o valor observável: `expect(result.current.valor).toBe(6)`",
          "Para testar novos argumentos, use `rerender` (com `initialProps`) e afirme de novo",
          "Para testar a limpeza do efeito (timer, listener), chame `unmount()` e confira que nada ficou ligado",
        ],
        nota: "O teste vê o Hook como o componente o veria: pelos valores e funções que ele devolve, e pelos efeitos que causa.",
      },
      {
        tipo: "codigo",
        titulo: "Estado de um Hook: result.current e act",
        legenda: "JSX",
        codigo: `import { act, renderHook } from "@testing-library/react";
import { useContador } from "./useContador";

test("incrementa e reinicia", () => {
  const { result } = renderHook(() => useContador(5));
  expect(result.current.valor).toBe(5);

  act(() => {
    result.current.incrementar();
  });
  expect(result.current.valor).toBe(6);

  act(() => {
    result.current.reiniciar();
  });
  expect(result.current.valor).toBe(5);
});`,
        nota: "O `renderHook` vem da própria React Testing Library; o pacote separado que existia antes para Hooks foi substituído por esse recurso. Confira a documentação.",
      },
      {
        tipo: "passos",
        titulo: "Quando o Hook precisa do resto do mundo",
        passos: [
          {
            titulo: "Ele usa Context ou outro provedor",
            texto:
              "Passe um `wrapper`: `renderHook(() => useTema(), { wrapper: ProvedorDeTema })`. Sem ele, o Hook lê o valor padrão do Context ou lança erro, e o teste não representa o uso real.",
          },
          {
            titulo: "Ele muda de forma assíncrona",
            texto:
              "Espere a atualização com `await waitFor(() => expect(result.current.dados).toEqual(...))`, ou use `await act(async () => { ... })` quando você mesmo dispara a ação assíncrona. Evite pausas fixas.",
          },
          {
            titulo: "Ele depende do tempo",
            texto:
              "Use o relógio falso (`vi.useFakeTimers()` no Vitest, `jest.useFakeTimers()` no Jest) e avance o tempo dentro de `act`. Restaure o relógio real ao final de cada teste.",
          },
          {
            titulo: "Ele chama a rede",
            texto:
              "Intercepte a requisição como num teste de componente (MSW ou um `fetch` simulado, veja L193) e espere o resultado em `result.current`. Se o Hook usa uma biblioteca de dados, envolva-o no provedor dela com um cliente novo por teste.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Hook que depende do tempo (debounce)",
        legenda: "JSX",
        codigo: `test("useDebounce só muda depois do atraso", () => {
  vi.useFakeTimers(); // no Jest: jest.useFakeTimers()
  const { result, rerender } = renderHook(({ texto }) => useDebounce(texto, 300), {
    initialProps: { texto: "a" },
  });

  rerender({ texto: "ab" });
  expect(result.current).toBe("a"); // o atraso ainda não passou

  act(() => {
    vi.advanceTimersByTime(300);
  });
  expect(result.current).toBe("ab");

  vi.useRealTimers();
});`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Hook em si ou pelo componente?",
        texto:
          "Use o **`renderHook`** para Hooks **genéricos e reutilizáveis** (`useDebounce`, `useLocalStorage`), cujo contrato são os valores devolvidos. Para um Hook **feito para uma tela**, ou cujo comportamento depende de eventos e do DOM, **teste pelo componente que o usa** (veja L191): é o que o usuário percebe, e o Hook pode ser reescrito sem quebrar o teste. Em ambos os casos, observe o comportamento (valores e efeitos), não as variáveis internas.",
      },
    ],
    armadilhas: [
      "Guardar `result.current` numa variável antes de uma mudança e afirmar sobre ela depois: é a versão antiga, e o teste falha de forma confusa.",
      "Mudar o estado fora de `act`: o React avisa e o valor lido pode ainda não ter sido atualizado.",
      "Chamar o Hook direto, sem `renderHook` (ou dentro de um teste comum): o React acusa uma chamada inválida de Hook.",
      "Deixar o relógio falso ligado ou esquecer de desmontar: timers e efeitos vazam para o teste seguinte.",
    ],
    autoteste: [
      {
        pergunta: "Por que um Hook não pode ser testado chamando-o diretamente, e o que o `renderHook` faz?",
        resposta:
          "Hooks só funcionam dentro da renderização de um componente. O `renderHook` monta um componente de teste que chama o Hook e expõe o último valor em `result.current`, além de `rerender` e `unmount`.",
      },
      {
        pergunta: "Quando é melhor testar o Hook pelo componente que o usa?",
        resposta:
          "Quando ele foi escrito para uma tela só ou depende de DOM e eventos. O teste do componente cobre o que o usuário percebe e continua valendo se o Hook for reescrito. Para Hooks genéricos e reutilizáveis, o `renderHook` é o caminho natural.",
      },
    ],
  },
  en: {
    titulo: "Testing custom Hooks",
    pergunta: "How do you test custom Hooks?",
    porqueEsteMetodo:
      "A Hook only works inside a component, so testing it means asking “who runs it?”. Following one `renderHook` call, from mounting to a state change, shows the role of `result.current`, `act` and the async wait.",
    resposta30s:
      "A Hook cannot be called outside a component, so you use **`renderHook`** (from React Testing Library), which mounts an invisible test component and returns `result.current` with the Hook’s latest value. State changes are triggered inside **`act`**, and async work is awaited with `waitFor`. If the Hook uses Context, pass a **`wrapper`** with the providers; if it only exists for one screen, **test it through the component**.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One Hook test, start to finish",
        etapas: [
          "`renderHook(() => useCounter(5))` mounts an invisible test component that calls the Hook and returns `result`, `rerender` and `unmount`",
          "`result.current` holds the **latest value** the Hook returned; always read `result.current` after a change, never a copy saved earlier",
          "To change state, call the Hook’s function inside `act(() => { ... })`, which makes sure React processes state and effects before the test moves on",
          "Assert the observable value: `expect(result.current.value).toBe(6)`",
          "To test new arguments, use `rerender` (with `initialProps`) and assert again",
          "To test effect cleanup (timer, listener), call `unmount()` and check that nothing stayed on",
        ],
        nota: "The test sees the Hook the way the component would: through the values and functions it returns, and the effects it causes.",
      },
      {
        tipo: "codigo",
        titulo: "A Hook’s state: result.current and act",
        legenda: "JSX",
        codigo: `import { act, renderHook } from "@testing-library/react";
import { useCounter } from "./useCounter";

test("increments and resets", () => {
  const { result } = renderHook(() => useCounter(5));
  expect(result.current.value).toBe(5);

  act(() => {
    result.current.increment();
  });
  expect(result.current.value).toBe(6);

  act(() => {
    result.current.reset();
  });
  expect(result.current.value).toBe(5);
});`,
        nota: "`renderHook` comes from React Testing Library itself; the separate package that used to exist for Hooks was superseded by this feature. Check the documentation.",
      },
      {
        tipo: "passos",
        titulo: "When the Hook needs the rest of the world",
        passos: [
          {
            titulo: "It uses Context or another provider",
            texto:
              "Pass a `wrapper`: `renderHook(() => useTheme(), { wrapper: ThemeProvider })`. Without it, the Hook reads the Context default or throws, and the test does not represent real use.",
          },
          {
            titulo: "It changes asynchronously",
            texto:
              "Wait for the update with `await waitFor(() => expect(result.current.data).toEqual(...))`, or use `await act(async () => { ... })` when you trigger the async action yourself. Avoid fixed pauses.",
          },
          {
            titulo: "It depends on time",
            texto:
              "Use the fake clock (`vi.useFakeTimers()` in Vitest, `jest.useFakeTimers()` in Jest) and advance time inside `act`. Restore the real clock at the end of each test.",
          },
          {
            titulo: "It calls the network",
            texto:
              "Intercept the request as in a component test (MSW or a faked `fetch`, see L193) and wait for the result in `result.current`. If the Hook uses a data library, wrap it in that library’s provider with a fresh client per test.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A Hook that depends on time (debounce)",
        legenda: "JSX",
        codigo: `test("useDebounce only changes after the delay", () => {
  vi.useFakeTimers(); // in Jest: jest.useFakeTimers()
  const { result, rerender } = renderHook(({ text }) => useDebounce(text, 300), {
    initialProps: { text: "a" },
  });

  rerender({ text: "ab" });
  expect(result.current).toBe("a"); // the delay has not passed yet

  act(() => {
    vi.advanceTimersByTime(300);
  });
  expect(result.current).toBe("ab");

  vi.useRealTimers();
});`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The Hook itself, or through the component?",
        texto:
          "Use **`renderHook`** for **generic, reusable Hooks** (`useDebounce`, `useLocalStorage`), whose contract is the values they return. For a Hook **made for one screen**, or whose behavior depends on events and the DOM, **test through the component that uses it** (see L191): that is what the user perceives, and the Hook can be rewritten without breaking the test. In both cases, observe behavior (values and effects), not internal variables.",
      },
    ],
    armadilhas: [
      "Saving `result.current` in a variable before a change and asserting on it afterwards: it is the old version, and the test fails in a confusing way.",
      "Changing state outside `act`: React warns and the value you read may not have been updated yet.",
      "Calling the Hook directly, without `renderHook` (or inside a plain test): React reports an invalid Hook call.",
      "Leaving the fake clock on or forgetting to unmount: timers and effects leak into the next test.",
    ],
    autoteste: [
      {
        pergunta: "Why can’t a Hook be tested by calling it directly, and what does `renderHook` do?",
        resposta:
          "Hooks only work during a component’s render. `renderHook` mounts a test component that calls the Hook and exposes its latest value in `result.current`, plus `rerender` and `unmount`.",
      },
      {
        pergunta: "When is it better to test the Hook through the component that uses it?",
        resposta:
          "When it was written for a single screen or depends on the DOM and events. The component test covers what the user perceives and keeps working if the Hook is rewritten. For generic, reusable Hooks, `renderHook` is the natural way.",
      },
    ],
  },
};
