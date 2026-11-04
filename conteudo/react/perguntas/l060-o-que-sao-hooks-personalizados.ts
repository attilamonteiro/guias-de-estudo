import type { Pergunta } from "../../tipos";

// L60 · O que são Hooks personalizados
export const l060: Pergunta = {
  numero: 60,
  modulo: "linkedin-hooks",
  metodo: "design",
  pt: {
    titulo: "O que são Hooks personalizados",
    pergunta: "O que são Hooks personalizados (custom Hooks)?",
    porqueEsteMetodo:
      "Um bom custom Hook nasce de decisões de projeto: o que ele recebe, o que devolve, o que isola e quando nem vale extraí-lo. Seguir um roteiro, do requisito à organização, evita tanto o Hook “faz-tudo” quanto a abstração prematura.",
    resposta30s:
      "Um **Hook personalizado** é uma função com nome `use…` que chama outros Hooks para **reaproveitar lógica com estado ou efeitos** entre componentes (`useFetch`, `useDebounce`, `useLocalStorage`). Ele compartilha a lógica, **não os dados**: cada chamada tem o **próprio estado isolado**. Extraia quando a lógica se repete ou atrapalha a leitura, e siga as regras dos Hooks (veja L61); sem estado, uma função comum basta.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado: um `useFetch`",
        passos: [
          {
            titulo: "1. Parta do requisito",
            texto:
              "“Buscar dados de uma URL e mostrá-los em uma lista.” A lógica que se repete em vários componentes é a mesma: três estados (carregando, erro, dados), um efeito que busca e a limpeza ao trocar a URL ou sair da tela. É essa parte, com estado e efeito, que vira Hook.",
          },
          {
            titulo: "2. Defina entradas e retorno",
            texto:
              "Entrada: a `url` (e opções, se precisar). Retorno: o que o componente precisa para desenhar, `{ dados, erro, carregando }`, ou uma tupla quando são poucos valores, como no `useState`. Tipos genéricos (`useFetch<T>`) deixam o chamador dizer o formato dos dados.",
          },
          {
            titulo: "3. Nomeie e siga as regras",
            texto:
              "O nome começa com `use`, o que permite ao lint conferir as regras dos Hooks (veja L61). O Hook é uma função comum que chama outros Hooks no nível superior, e só pode ser chamado em componentes ou em outros Hooks.",
          },
          {
            titulo: "4. Isole o estado",
            texto:
              "Cada chamada de `useFetch` cria o **seu** estado: dois componentes que o chamam não compartilham dados, nem as requisições. Para compartilhar, use contexto, uma store ou uma biblioteca de cache de dados.",
          },
          {
            titulo: "5. Cuide do efeito",
            texto:
              "Dependências corretas (`[url]`), limpeza com `AbortController` e descarte da resposta velha quando a URL muda, para uma requisição lenta antiga não sobrescrever a nova.",
          },
          {
            titulo: "6. Organize e teste",
            texto:
              "Um Hook por arquivo, nomeado pelo que faz (`useDebounce`, `useLocalStorage`), na pasta da feature que o usa; suba para uma pasta `hooks/` compartilhada só quando houver uso real em mais de um lugar. Teste isolado com `renderHook`, da React Testing Library, sem montar uma tela.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O Hook: busca com carregamento, erro e cancelamento",
        legenda: "TSX",
        codigo: `import { useEffect, useState } from "react";

export function useFetch<T>(url: string) {
  const [dados, setDados] = useState<T | null>(null);
  const [erro, setErro] = useState<Error | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const controle = new AbortController();
    setCarregando(true);
    setErro(null);
    fetch(url, { signal: controle.signal })
      .then((r) => (r.ok ? (r.json() as Promise<T>) : Promise.reject(new Error("HTTP " + r.status))))
      .then(setDados)
      .catch((e: Error) => e.name !== "AbortError" && setErro(e))
      .finally(() => !controle.signal.aborted && setCarregando(false));
    return () => controle.abort(); // cancela se a url mudar ou o componente sair
  }, [url]);

  return { dados, erro, carregando };
}`,
        nota: "Em projetos reais, uma biblioteca de dados ou o carregamento do framework já traz cache, retentativas e deduplicação. Escrever o Hook à mão é bom para entender o padrão.",
      },
      {
        tipo: "codigo",
        titulo: "O componente que o usa e desenha a lista",
        legenda: "TSX",
        codigo: `type Usuario = { id: number; name: string };

export function ListaDeUsuarios() {
  const { dados, erro, carregando } = useFetch<Usuario[]>("https://api.exemplo.com/usuarios");

  if (carregando) return <p>Carregando…</p>;
  if (erro) return <p role="alert">Falhou: {erro.message}</p>;

  return (
    <ul>
      {dados?.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}`,
      },
      {
        tipo: "tabela",
        titulo: "Função comum, Hook, HOC ou render prop?",
        colunas: ["Ferramenta", "Use quando", "Limite"],
        linhas: [
          [
            "Função comum",
            "A lógica não tem estado nem efeitos (formatar, validar, converter)",
            "Não pode chamar Hooks",
          ],
          [
            "Custom Hook",
            "A lógica **com estado ou efeitos** se repete entre componentes (busca, debounce, `localStorage`)",
            "Só roda em componentes ou outros Hooks; o estado é isolado por chamada",
          ],
          [
            "HOC (componente de ordem superior)",
            "Envolver um componente para injetar props ou comportamento; aparece em código legado e em algumas bibliotecas",
            "Aninhamento de wrappers, colisão de nomes de props e tipagem difícil",
          ],
          [
            "Render prop",
            "Quem usa decide o que desenhar, e o componente cuida da lógica",
            "Mais JSX aninhado e funções como filhos",
          ],
        ],
        nota: "Hooks são hoje a forma padrão de compartilhar lógica com estado, mas HOCs e render props continuam existindo em bases de código antigas.",
      },
    ],
    armadilhas: [
      "Achar que dois componentes que chamam o mesmo Hook compartilham o estado: cada chamada tem o seu. Para compartilhar, use contexto, store ou cache de dados.",
      "Nome sem `use`, ou chamada condicional do Hook dentro de outro: o lint deixa de conferir e as regras dos Hooks são quebradas.",
      "Extrair cedo demais ou criar um Hook “faz-tudo” com dez parâmetros: extraia pela repetição real, com entrada e retorno pequenos.",
      "Esquecer a limpeza e as dependências: sem `AbortController`, uma resposta lenta e velha sobrescreve a nova; sem `[url]`, o efeito não reage à troca.",
    ],
    autoteste: [
      {
        pergunta: 'Dois componentes chamam `useFetch("/api")`. Eles compartilham o estado?',
        resposta:
          "Não. Cada chamada cria o seu estado e a sua requisição. Para compartilhar, use contexto, uma store ou uma biblioteca de cache que deduplique requisições.",
      },
      {
        pergunta: "Quando uma função comum basta no lugar de um Hook?",
        resposta:
          "Quando a lógica não usa estado, efeitos nem outros Hooks (formatar uma data, validar um CPF). Chame a função de onde precisar, sem o prefixo `use`.",
      },
    ],
  },
  en: {
    titulo: "What custom Hooks are",
    pergunta: "What are custom Hooks?",
    porqueEsteMetodo:
      "A good custom Hook comes from design decisions: what it takes, what it returns, what it isolates and when it is not worth extracting. Following a script, from requirement to organization, avoids both the do-everything Hook and premature abstraction.",
    resposta30s:
      "A **custom Hook** is a function named `use…` that calls other Hooks to **reuse logic with state or effects** across components (`useFetch`, `useDebounce`, `useLocalStorage`). It shares the logic, **not the data**: every call has its **own isolated state**. Extract one when the logic repeats or hurts readability, and follow the rules of Hooks (see L61); without state, an ordinary function is enough.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied: a `useFetch`",
        passos: [
          {
            titulo: "1. Start from the requirement",
            texto:
              "“Fetch data from a URL and show it in a list.” The logic that repeats across components is the same: three states (loading, error, data), an effect that fetches and the cleanup when the URL changes or the component leaves the screen. That part, with state and an effect, becomes the Hook.",
          },
          {
            titulo: "2. Define inputs and return value",
            texto:
              "Input: the `url` (and options, if needed). Return: what the component needs to draw, `{ data, error, loading }`, or a tuple when there are only a few values, as with `useState`. Generics (`useFetch<T>`) let the caller state the shape of the data.",
          },
          {
            titulo: "3. Name it and follow the rules",
            texto:
              "The name starts with `use`, which lets the lint check the rules of Hooks (see L61). The Hook is an ordinary function that calls other Hooks at the top level, and it can only be called in components or in other Hooks.",
          },
          {
            titulo: "4. Isolate the state",
            texto:
              "Every call to `useFetch` creates **its own** state: two components calling it do not share data, or requests. To share, use context, a store or a data-cache library.",
          },
          {
            titulo: "5. Handle the effect",
            texto:
              "Correct dependencies (`[url]`), cleanup with `AbortController` and discarding the stale response when the URL changes, so a slow old request does not overwrite the new one.",
          },
          {
            titulo: "6. Organize and test",
            texto:
              "One Hook per file, named for what it does (`useDebounce`, `useLocalStorage`), in the folder of the feature that uses it; move it to a shared `hooks/` folder only when more than one place really uses it. Test it in isolation with `renderHook`, from React Testing Library, without mounting a screen.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The Hook: fetching with loading, error and cancellation",
        legenda: "TSX",
        codigo: `import { useEffect, useState } from "react";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetch(url, { signal: controller.signal })
      .then((r) => (r.ok ? (r.json() as Promise<T>) : Promise.reject(new Error("HTTP " + r.status))))
      .then(setData)
      .catch((e: Error) => e.name !== "AbortError" && setError(e))
      .finally(() => !controller.signal.aborted && setLoading(false));
    return () => controller.abort(); // cancels if the url changes or the component leaves
  }, [url]);

  return { data, error, loading };
}`,
        nota: "In real projects, a data library or the framework’s data loading already brings caching, retries and deduplication. Writing the Hook by hand is good for understanding the pattern.",
      },
      {
        tipo: "codigo",
        titulo: "The component that uses it and draws the list",
        legenda: "TSX",
        codigo: `type User = { id: number; name: string };

export function UserList() {
  const { data, error, loading } = useFetch<User[]>("https://api.example.com/users");

  if (loading) return <p>Loading…</p>;
  if (error) return <p role="alert">Failed: {error.message}</p>;

  return (
    <ul>
      {data?.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}`,
      },
      {
        tipo: "tabela",
        titulo: "Ordinary function, Hook, HOC or render prop?",
        colunas: ["Tool", "Use when", "Limit"],
        linhas: [
          [
            "Ordinary function",
            "The logic has no state or effects (formatting, validating, converting)",
            "Cannot call Hooks",
          ],
          [
            "Custom Hook",
            "Logic **with state or effects** repeats across components (fetching, debounce, `localStorage`)",
            "Only runs in components or other Hooks; state is isolated per call",
          ],
          [
            "HOC (higher-order component)",
            "Wrapping a component to inject props or behavior; shows up in legacy code and in some libraries",
            "Wrapper nesting, prop-name collisions and hard typing",
          ],
          [
            "Render prop",
            "The consumer decides what to draw, and the component handles the logic",
            "More nested JSX and functions as children",
          ],
        ],
        nota: "Hooks are today’s standard way to share logic with state, but HOCs and render props still exist in older codebases.",
      },
    ],
    armadilhas: [
      "Thinking two components calling the same Hook share state: each call has its own. To share, use context, a store or a data cache.",
      "A name without `use`, or calling the Hook conditionally inside another: the lint stops checking and the rules of Hooks are broken.",
      "Extracting too early or building a do-everything Hook with ten parameters: extract from real repetition, with small inputs and returns.",
      "Forgetting cleanup and dependencies: without `AbortController`, a slow stale response overwrites the new one; without `[url]`, the effect does not react to the change.",
    ],
    autoteste: [
      {
        pergunta: 'Two components call `useFetch("/api")`. Do they share state?',
        resposta:
          "No. Each call creates its own state and its own request. To share, use context, a store or a cache library that deduplicates requests.",
      },
      {
        pergunta: "When is an ordinary function enough instead of a Hook?",
        resposta:
          "When the logic uses no state, effects or other Hooks (formatting a date, validating a tax id). Call the function from wherever you need it, without the `use` prefix.",
      },
    ],
  },
};
