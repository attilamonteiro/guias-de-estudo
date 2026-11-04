import type { Pergunta } from "../../tipos";

// G44 · Debounce na caixa de busca
export const g044: Pergunta = {
  numero: 344,
  modulo: "glassdoor-exercicios",
  metodo: "trace",
  pt: {
    titulo: "Debounce na caixa de busca",
    pergunta:
      "Como você implementa debouncing em uma caixa de busca (mostrando resultados enquanto o usuário digita uma palavra-chave)?",
    porqueEsteMetodo:
      "Debounce é um comportamento no tempo: o que importa é a ordem dos eventos. Seguir o que acontece a cada tecla, do estado do campo ao timer, à requisição e à resposta, inclusive quando a rede chega fora de ordem, mostra por que cada peça do código existe.",
    resposta30s:
      "A cada tecla o estado do campo muda **na hora**, e um efeito **reinicia um timer** (`setTimeout`) de algumas centenas de milissegundos; a requisição só sai quando o usuário **faz uma pausa**. A **função de limpeza** do efeito cancela o timer anterior e **aborta a requisição em andamento** (`AbortController`), o que evita respostas fora de ordem. Debounce espera a pausa, throttle limita a frequência, e `useDeferredValue` adia só a renderização, não a rede.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "O que acontece a cada tecla, no caminho feliz",
        etapas: [
          "Você digita `r`: o `onChange` chama `setTermo('r')` e o campo, controlado, mostra a letra **na hora**; o estado do input nunca espera o debounce",
          "O React renderiza com `termo = 'r'` e, depois do commit, executa o efeito que depende de `[termo]`: ele agenda um `setTimeout` de 300 ms",
          "Você digita `e` antes de os 300 ms passarem: novo `setTermo('re')` e novo render; antes de executar o efeito novo, o React roda a **limpeza** do anterior, que cancela o timer de `'r'` (a contagem recomeça)",
          "O efeito novo agenda outro timer de 300 ms para `'re'`",
          "Você para de digitar: o timer vence e o `fetch` de `'re'` sai, com um `AbortController`; duas teclas geraram uma única requisição",
          "A resposta chega e `setResultados` atualiza a lista; se você tivesse digitado de novo antes disso, a limpeza **abortaria** a requisição em andamento e a resposta velha seria descartada",
        ],
        nota: "O atraso é percebido só na busca, nunca na digitação; um atraso de algumas centenas de milissegundos é comum, e vale ajustá-lo pela experiência desejada.",
      },
      {
        tipo: "passos",
        titulo: "Agora os caminhos em que dá errado",
        passos: [
          {
            titulo: "Sem debounce",
            texto:
              "Cada tecla dispara uma requisição: digitar `react` envia cinco, sobrecarrega a API e faz a lista piscar.",
          },
          {
            titulo: "Respostas fora de ordem",
            texto:
              "A rede não garante a ordem: a resposta de `'rea'` pode chegar **depois** da de `'react'` e sobrescrever a lista certa. O debounce reduz o problema, mas não o elimina, porque duas requisições ainda podem ficar em andamento ao mesmo tempo.",
          },
          {
            titulo: "Sem limpeza",
            texto:
              "Um timer ou uma requisição que sobrevive à desmontagem chama `setState` depois que a tela saiu, e timers acumulados (um por tecla) disparam todos. É a função de limpeza que cancela o anterior a cada mudança e ao desmontar.",
          },
          {
            titulo: "O conserto",
            texto:
              "Cancele o timer e aborte a requisição na limpeza (como no código); trate `AbortError` como cancelamento, e não como falha; ignore termos vazios ou curtos demais. No lugar do `AbortController` também serve uma flag local `ignorar = true` na limpeza, que descarta a resposta velha mas não cancela a requisição.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Busca com debounce e cancelamento num único efeito",
        legenda: "TSX",
        codigo: [
          "export function Busca() {",
          "  const [termo, setTermo] = useState('');",
          "  const [resultados, setResultados] = useState<string[]>([]);",
          "  useEffect(() => {",
          "    const consulta = termo.trim();",
          "    if (!consulta) { setResultados([]); return; }",
          "    const controle = new AbortController();",
          "    const id = setTimeout(() => {",
          "      fetch(`/api/busca?q=${encodeURIComponent(consulta)}`, { signal: controle.signal })",
          "        .then((r) => r.json()).then(setResultados)",
          '        .catch((e) => { if (e.name !== "AbortError") console.error(e); });',
          "    }, 300);",
          "    return () => { clearTimeout(id); controle.abort(); }; // cada tecla cancela o pendente",
          "  }, [termo]);",
          "",
          "  return (",
          "    <>",
          "      <input value={termo} onChange={(e) => setTermo(e.target.value)} />",
          "      <ul>{resultados.map((r) => <li key={r}>{r}</li>)}</ul>",
          "    </>",
          "  );",
          "}",
        ].join("\n"),
        nota: "Imports de `react` omitidos. Falta tratar `r.ok`, o carregamento e o erro na interface. Para reutilizar, extraia um `useDebounce(valor, atraso)`: um estado `atrasado` e um efeito com `setTimeout` e `clearTimeout` na limpeza, e faça a busca depender do valor atrasado.",
      },
      {
        tipo: "tabela",
        titulo: "Debounce, throttle e `useDeferredValue`",
        colunas: ["Técnica", "O que faz", "Quando usar", "Cuidado"],
        linhas: [
          [
            "Debounce",
            "Espera uma pausa; só a última chamada de uma rajada vale",
            "Busca ao digitar, validar depois que a pessoa parou, ajustar ao redimensionar",
            "O resultado só aparece depois do atraso; escolha um atraso curto o bastante para parecer instantâneo",
          ],
          [
            "Throttle",
            "Deixa passar no máximo uma chamada por intervalo, durante a rajada",
            "Scroll, arrastar, movimento do mouse, progresso contínuo",
            "Dá resultados parciais; a última chamada pode se perder se não houver execução final",
          ],
          [
            "`useDeferredValue`",
            "Deixa o React adiar a renderização pesada de um valor, mantendo o campo responsivo",
            "Filtrar ou desenhar uma lista grande já em memória",
            "Não reduz requisições de rede por si só; para a rede ainda é preciso debounce ou cancelamento (confira react.dev)",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra: atrase o uso do valor, não o campo",
        texto:
          "O estado do campo atualiza **sempre**; o que se atrasa é o **uso** dele (a busca). A mesma limpeza que reinicia o timer é o lugar de abortar a requisição. Debounce serve para **rajadas que terminam em pausa** (digitar); throttle, para **fluxos contínuos** (rolagem, arrastar). Bibliotecas de dados (como TanStack Query ou SWR) ajudam com cache, deduplicação e descarte de respostas antigas, mas o debounce do termo continua sendo seu.",
      },
    ],
    armadilhas: [
      "Aplicar o debounce ao `value` do input: o campo precisa refletir a digitação na hora, e só o valor usado na busca é atrasado.",
      "Esquecer a limpeza (`clearTimeout` e `abort`): chamadas depois da desmontagem, timers acumulados e respostas antigas sobrescrevendo as novas.",
      "Criar a função com debounce no corpo do componente (por exemplo, `debounce(buscar, 300)` do lodash a cada render): cada render cria um timer novo e nada é agrupado; memorize a função com `useMemo` ou `useRef` e cancele-a ao desmontar.",
      "Tratar `AbortError` como erro, ou ignorar os estados de termo vazio, carregamento e falha: a interface pisca mensagens falsas ou não diz o que está acontecendo.",
    ],
    autoteste: [
      {
        pergunta: "Por que uma resposta antiga pode aparecer depois de uma nova, mesmo com debounce, e como evitar?",
        resposta:
          "O debounce reduz as requisições, mas duas ainda podem ficar em andamento, e a rede não garante a ordem de chegada. Evite abortando a requisição anterior na limpeza do efeito (`AbortController`) ou ignorando a resposta com uma flag local.",
      },
      {
        pergunta: "Qual a diferença entre debounce e throttle, e qual serve para uma caixa de busca?",
        resposta:
          "Debounce espera uma pausa e executa só a última chamada; throttle executa no máximo uma vez por intervalo durante a rajada. Para a busca, o debounce: só interessa o termo final depois que a pessoa parou de digitar.",
      },
    ],
  },
  en: {
    titulo: "Debouncing a search box",
    pergunta: "How do you implement debouncing for a search box (showing results as the user types a keyword)?",
    porqueEsteMetodo:
      "Debouncing is behavior over time: what matters is the order of events. Following what happens on each keystroke, from the field’s state to the timer, the request and the response, including when the network answers out of order, shows why each piece of the code exists.",
    resposta30s:
      "On each keystroke the field’s state changes **immediately**, and an effect **restarts a timer** (`setTimeout`) of a few hundred milliseconds; the request only goes out when the user **pauses**. The effect’s **cleanup function** cancels the previous timer and **aborts the in-flight request** (`AbortController`), which prevents out-of-order responses. Debounce waits for the pause, throttle limits the frequency, and `useDeferredValue` only defers rendering, not the network.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "What happens on each keystroke, on the happy path",
        etapas: [
          "You type `r`: `onChange` calls `setTerm('r')` and the controlled field shows the letter **at once**; the input’s state never waits for the debounce",
          "React renders with `term = 'r'` and, after the commit, runs the effect that depends on `[term]`: it schedules a 300 ms `setTimeout`",
          "You type `e` before the 300 ms elapse: a new `setTerm('re')` and a new render; before running the new effect, React runs the previous one’s **cleanup**, which cancels the `'r'` timer (the countdown restarts)",
          "The new effect schedules another 300 ms timer for `'re'`",
          "You stop typing: the timer expires and the `fetch` for `'re'` goes out, with an `AbortController`; two keystrokes produced a single request",
          "The response arrives and `setResults` updates the list; had you typed again before that, the cleanup would **abort** the in-flight request and the old response would be discarded",
        ],
        nota: "The delay is felt only in the search, never in typing; a delay of a few hundred milliseconds is common, and worth tuning to the experience you want.",
      },
      {
        tipo: "passos",
        titulo: "Now the paths where it goes wrong",
        passos: [
          {
            titulo: "No debounce",
            texto:
              "Every keystroke fires a request: typing `react` sends five, overloads the API and makes the list flicker.",
          },
          {
            titulo: "Out-of-order responses",
            texto:
              "The network does not guarantee order: the response for `'rea'` may arrive **after** the one for `'react'` and overwrite the correct list. Debouncing reduces the problem but does not eliminate it, because two requests can still be in flight at once.",
          },
          {
            titulo: "No cleanup",
            texto:
              "A timer or a request that outlives the unmount calls `setState` after the screen is gone, and accumulated timers (one per keystroke) all fire. The cleanup function is what cancels the previous one on every change and on unmount.",
          },
          {
            titulo: "The fix",
            texto:
              "Cancel the timer and abort the request in the cleanup (as in the code); treat `AbortError` as a cancellation, not a failure; ignore empty or too-short terms. Instead of the `AbortController`, a local `ignore = true` flag in the cleanup also works: it discards the old response but does not cancel the request.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Search with debounce and cancellation in a single effect",
        legenda: "TSX",
        codigo: [
          "export function Search() {",
          "  const [term, setTerm] = useState('');",
          "  const [results, setResults] = useState<string[]>([]);",
          "  useEffect(() => {",
          "    const query = term.trim();",
          "    if (!query) { setResults([]); return; }",
          "    const controller = new AbortController();",
          "    const id = setTimeout(() => {",
          "      fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })",
          "        .then((r) => r.json()).then(setResults)",
          '        .catch((e) => { if (e.name !== "AbortError") console.error(e); });',
          "    }, 300);",
          "    return () => { clearTimeout(id); controller.abort(); }; // each keystroke cancels the pending one",
          "  }, [term]);",
          "",
          "  return (",
          "    <>",
          "      <input value={term} onChange={(e) => setTerm(e.target.value)} />",
          "      <ul>{results.map((r) => <li key={r}>{r}</li>)}</ul>",
          "    </>",
          "  );",
          "}",
        ].join("\n"),
        nota: "`react` imports omitted. Handling `r.ok`, loading and errors in the UI is missing. To reuse it, extract a `useDebounce(value, delay)`: a `delayed` state and an effect with `setTimeout` and `clearTimeout` in its cleanup, and make the search depend on the delayed value.",
      },
      {
        tipo: "tabela",
        titulo: "Debounce, throttle and `useDeferredValue`",
        colunas: ["Technique", "What it does", "When to use it", "Caveat"],
        linhas: [
          [
            "Debounce",
            "Waits for a pause; only the last call of a burst counts",
            "Search as you type, validating after the person stops, adjusting on resize",
            "The result only appears after the delay; pick a delay short enough to feel instant",
          ],
          [
            "Throttle",
            "Lets through at most one call per interval, during the burst",
            "Scroll, dragging, mouse movement, continuous progress",
            "Gives partial results; the last call may be lost without a trailing execution",
          ],
          [
            "`useDeferredValue`",
            "Lets React defer the heavy rendering of a value, keeping the field responsive",
            "Filtering or drawing a large list already in memory",
            "Does not reduce network requests by itself; the network still needs debouncing or cancellation (check react.dev)",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule: delay the use of the value, not the field",
        texto:
          "The field’s state updates **always**; what gets delayed is its **use** (the search). The same cleanup that restarts the timer is the place to abort the request. Debouncing suits **bursts that end in a pause** (typing); throttling suits **continuous streams** (scrolling, dragging). Data libraries (such as TanStack Query or SWR) help with caching, deduplication and discarding stale responses, but debouncing the term is still on you.",
      },
    ],
    armadilhas: [
      "Debouncing the input’s `value`: the field must reflect typing at once, and only the value used for the search is delayed.",
      "Forgetting the cleanup (`clearTimeout` and `abort`): calls after unmount, accumulated timers and old responses overwriting new ones.",
      "Creating the debounced function in the component body (for example, lodash’s `debounce(search, 300)` on every render): each render creates a new timer and nothing is grouped; memoize the function with `useMemo` or `useRef` and cancel it on unmount.",
      "Treating `AbortError` as an error, or ignoring the empty-term, loading and failure states: the UI flashes false messages or does not say what is happening.",
    ],
    autoteste: [
      {
        pergunta: "Why can an old response appear after a new one even with debouncing, and how do you prevent it?",
        resposta:
          "Debouncing reduces requests, but two can still be in flight, and the network does not guarantee arrival order. Prevent it by aborting the previous request in the effect’s cleanup (`AbortController`) or by ignoring the response with a local flag.",
      },
      {
        pergunta: "What is the difference between debounce and throttle, and which fits a search box?",
        resposta:
          "Debounce waits for a pause and runs only the last call; throttle runs at most once per interval during the burst. For search, debounce: only the final term matters once the person stops typing.",
      },
    ],
  },
};
