import type { Pergunta } from "../../tipos";

// L75 · Quando não usar useEffect
export const l075: Pergunta = {
  numero: 75,
  modulo: "linkedin-regras-e-effects",
  metodo: "playbook",
  pt: {
    titulo: "Quando não usar useEffect",
    pergunta: "Quando você NÃO deve usar useEffect()?",
    porqueEsteMetodo:
      "A pergunta é de julgamento. Um roteiro de decisão, com a pergunta certa em cada passo, transforma “efeito demais” em critério reproduzível, em vez de gosto.",
    resposta30s:
      "O `useEffect` serve para **sincronizar com sistemas externos** (rede, DOM imperativo, assinaturas, timers). **Não use** para valores que se calculam no render, para reagir a eventos do usuário (que cabem no handler), para reiniciar state quando uma prop muda (use `key`) nem para buscar dados quando uma biblioteca ou framework já resolve. Efeito desnecessário custa renders extras, bugs de sincronização e cascatas de efeitos.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Roteiro de decisão: preciso mesmo de um efeito?",
        passos: [
          {
            titulo: "Há algo fora do React para sincronizar?",
            texto:
              "Rede, DOM imperativo, widget de terceiros, assinatura, timer. Se a resposta é não, provavelmente você não precisa de um efeito.",
          },
          {
            titulo: "Dá para calcular no render?",
            texto:
              "Se o valor sai de props e state, calcule no corpo (`const total = ...`). Um efeito que faz `setX(f(y))` quando `y` muda cria uma renderização extra e uma segunda fonte da verdade. Use `useMemo` só se o cálculo for caro e você tiver medido.",
          },
          {
            titulo: "É reação a algo que o usuário fez?",
            texto:
              "Enviar, clicar, escolher: vai no **handler de evento**, que sabe exatamente o que aconteceu. Um efeito que observa um state “enviado” para disparar a ação perde essa informação.",
          },
          {
            titulo: "É reiniciar o state quando uma prop muda?",
            texto:
              "Dê uma **`key`** ao componente (`<Perfil key={usuarioId} />`): uma key nova cria uma instância nova, com state zerado. Ou guarde só o id e derive o resto, em vez de copiar a prop para o state.",
          },
          {
            titulo: "É buscar dados?",
            texto:
              "Use uma biblioteca de dados ou os recursos de dados do framework, que cuidam de cache, cancelamento e ordem das respostas (veja L70). Se for escrever à mão, o efeito precisa de limpeza e de tratamento de erro e de carregamento.",
          },
          {
            titulo: "É uma cadeia de efeitos?",
            texto:
              "Um efeito que muda um state que dispara outro efeito que muda outro state é uma cascata: cada elo é uma renderização e a lógica fica espalhada. Concentre a mudança no handler que a originou ou calcule os valores no render.",
          },
          {
            titulo: "O efeito é enorme?",
            texto:
              "Um efeito com várias chamadas de API e atualizações de state quase nunca é um único processo de sincronização, e o ideal é não mantê-lo assim. Separe um efeito por assunto (cada um com suas dependências e sua limpeza), mova o que é ação do usuário para handlers, derive o que for derivado e entregue a busca a uma biblioteca de dados.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Estado derivado dentro de um efeito",
        legenda: "JSX",
        codigo: [
          "// Desnecessário: estado derivado + efeito = render extra e risco de desencontro",
          "function CarrinhoComEfeito({ itens }) {",
          "  const [total, setTotal] = useState(0);",
          "  useEffect(() => {",
          "    setTotal(itens.reduce((soma, i) => soma + i.preco * i.qtd, 0));",
          "  }, [itens]);",
          "  return <p>{total}</p>;",
          "}",
          "",
          "// Melhor: calcule no render",
          "function Carrinho({ itens }) {",
          "  const total = itens.reduce((soma, i) => soma + i.preco * i.qtd, 0);",
          "  return <p>{total}</p>;",
          "}",
        ].join("\n"),
        nota: "No primeiro, a tela mostra `0` por um instante e só depois o total certo, porque o efeito roda depois da pintura.",
      },
      {
        tipo: "codigo",
        titulo: "Handler e `key` no lugar de efeitos",
        legenda: "JSX",
        codigo: [
          "function Formulario({ usuarioId }) {",
          '  const [texto, setTexto] = useState("");',
          "",
          "  // Reação ao envio: handler, não um efeito que observa “enviado”",
          "  async function aoEnviar(evento) {",
          "    evento.preventDefault();",
          "    await enviar(usuarioId, texto);",
          '    avisar("Enviado!");',
          "  }",
          "",
          "  return (",
          "    <form onSubmit={aoEnviar}>",
          "      <input value={texto} onChange={(e) => setTexto(e.target.value)} />",
          "    </form>",
          "  );",
          "}",
          "",
          "// Quem usa: <Formulario key={usuarioId} usuarioId={usuarioId} />",
          "// A key nova remonta o componente e zera o state, sem useEffect para “resetar”.",
        ].join("\n"),
        nota: "`enviar` e `avisar` são funções hipotéticas do aplicativo.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A regra",
        texto:
          "O efeito é uma **saída de emergência** do React para falar com sistemas externos, não uma ferramenta geral para “fazer algo quando algo muda”. Se você consegue explicar o efeito sem citar nada de fora do React, ele provavelmente sobra.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O custo de um efeito desnecessário",
        texto:
          "Cada `setState` num efeito causa uma renderização extra depois do commit, e a tela pode piscar com o valor antigo por um instante. Duas cópias da mesma informação se desencontram, cadeias de efeitos ficam difíceis de seguir e o Strict Mode (que repete o efeito em desenvolvimento) expõe limpezas que faltam. Menos efeitos significam um código mais simples, mais rápido e mais previsível.",
      },
    ],
    armadilhas: [
      "Espelhar props no state com um efeito (`useEffect(() => setX(prop), [prop])`): use a prop diretamente, calcule o valor ou use `key`.",
      "Disparar ações do usuário observando um state “flag” num efeito: a ação pertence ao handler.",
      "Buscar dados num efeito sem limpeza, sem tratamento de erro e de carregamento, repetindo o que uma biblioteca de dados faz melhor.",
      "Concluir que efeito é “proibido”: ele é a ferramenta certa para sincronizar com o mundo externo; o erro é usá-lo no que não é sincronização.",
    ],
    autoteste: [
      {
        pergunta: "Como reiniciar o state de um formulário quando o `usuarioId` muda, sem `useEffect`?",
        resposta:
          "Passe `key={usuarioId}` ao componente. Uma key diferente faz o React descartar a instância antiga e criar outra, com o state inicial.",
      },
      {
        pergunta: "Por que `useEffect(() => setTotal(calcular(itens)), [itens])` é um sinal de alerta?",
        resposta:
          "Porque `total` deriva de `itens`: calculá-lo no render evita a renderização extra e a duplicação da fonte da verdade. Efeito é para sincronizar com algo externo, e aqui não há nada fora do React.",
      },
    ],
  },
  en: {
    titulo: "When not to use useEffect",
    pergunta: "When should you NOT use useEffect()?",
    porqueEsteMetodo:
      "The question is about judgment. A decision path, with the right question at each step, turns “too many effects” into a reproducible criterion instead of a matter of taste.",
    resposta30s:
      "`useEffect` is for **syncing with external systems** (network, imperative DOM, subscriptions, timers). **Do not use it** for values you can compute during render, for reacting to user events (which fit in the handler), for resetting state when a prop changes (use `key`) or for fetching data when a library or framework already handles it. An unnecessary effect costs extra renders, sync bugs and cascades of effects.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Decision path: do I really need an effect?",
        passos: [
          {
            titulo: "Is there something outside React to sync with?",
            texto:
              "Network, imperative DOM, a third-party widget, a subscription, a timer. If the answer is no, you probably do not need an effect.",
          },
          {
            titulo: "Can it be computed during render?",
            texto:
              "If the value comes from props and state, compute it in the body (`const total = ...`). An effect that runs `setX(f(y))` when `y` changes creates an extra render and a second source of truth. Use `useMemo` only if the calculation is expensive and you measured it.",
          },
          {
            titulo: "Is it a reaction to something the user did?",
            texto:
              "Submit, click, choose: it goes in the **event handler**, which knows exactly what happened. An effect that watches a “submitted” state to fire the action loses that information.",
          },
          {
            titulo: "Is it resetting state when a prop changes?",
            texto:
              "Give the component a **`key`** (`<Profile key={userId} />`): a new key creates a new instance with zeroed state. Or store only the id and derive the rest, instead of copying the prop into state.",
          },
          {
            titulo: "Is it fetching data?",
            texto:
              "Use a data library or the framework’s data features, which handle caching, cancellation and response ordering (see L70). If you write it by hand, the effect needs cleanup and handling for error and loading states.",
          },
          {
            titulo: "Is it a chain of effects?",
            texto:
              "An effect that changes state that triggers another effect that changes more state is a cascade: every link is a render and the logic is scattered. Concentrate the change in the handler that started it, or compute the values during render.",
          },
          {
            titulo: "Is the effect huge?",
            texto:
              "An effect with several API calls and state updates is almost never a single synchronization process, and the better move is not to keep it as is. Split it into one effect per concern (each with its own dependencies and cleanup), move user actions to handlers, derive what is derived and hand the fetching to a data library.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Derived state inside an effect",
        legenda: "JSX",
        codigo: [
          "// Unnecessary: derived state + effect = extra render and risk of drifting apart",
          "function CartWithEffect({ items }) {",
          "  const [total, setTotal] = useState(0);",
          "  useEffect(() => {",
          "    setTotal(items.reduce((sum, i) => sum + i.price * i.qty, 0));",
          "  }, [items]);",
          "  return <p>{total}</p>;",
          "}",
          "",
          "// Better: compute it during render",
          "function Cart({ items }) {",
          "  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);",
          "  return <p>{total}</p>;",
          "}",
        ].join("\n"),
        nota: "In the first one, the screen shows `0` for a moment and only then the right total, because the effect runs after paint.",
      },
      {
        tipo: "codigo",
        titulo: "A handler and a `key` instead of effects",
        legenda: "JSX",
        codigo: [
          "function Form({ userId }) {",
          '  const [text, setText] = useState("");',
          "",
          "  // Reacting to submit: a handler, not an effect watching “submitted”",
          "  async function onSubmit(event) {",
          "    event.preventDefault();",
          "    await send(userId, text);",
          '    notify("Sent!");',
          "  }",
          "",
          "  return (",
          "    <form onSubmit={onSubmit}>",
          "      <input value={text} onChange={(e) => setText(e.target.value)} />",
          "    </form>",
          "  );",
          "}",
          "",
          "// Usage: <Form key={userId} userId={userId} />",
          "// The new key remounts the component and zeroes the state, no useEffect to “reset”.",
        ].join("\n"),
        nota: "`send` and `notify` are hypothetical application functions.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The rule",
        texto:
          "An effect is React’s **escape hatch** for talking to external systems, not a general tool for “do something when something changes”. If you can explain the effect without mentioning anything outside React, it is probably unnecessary.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The cost of an unnecessary effect",
        texto:
          "Every `setState` in an effect causes an extra render after the commit, and the screen may flash the old value for a moment. Two copies of the same information drift apart, chains of effects become hard to follow and Strict Mode (which repeats the effect in development) exposes missing cleanups. Fewer effects mean simpler, faster and more predictable code.",
      },
    ],
    armadilhas: [
      "Mirroring props into state with an effect (`useEffect(() => setX(prop), [prop])`): use the prop directly, compute the value or use `key`.",
      "Firing user actions by watching a “flag” state in an effect: the action belongs in the handler.",
      "Fetching data in an effect without cleanup, error handling or loading handling, repeating what a data library does better.",
      "Concluding that effects are “forbidden”: they are the right tool for syncing with the outside world; the mistake is using them for what is not synchronization.",
    ],
    autoteste: [
      {
        pergunta: "How do you reset a form’s state when `userId` changes, without `useEffect`?",
        resposta:
          "Pass `key={userId}` to the component. A different key makes React discard the old instance and create another one with the initial state.",
      },
      {
        pergunta: "Why is `useEffect(() => setTotal(compute(items)), [items])` a warning sign?",
        resposta:
          "Because `total` derives from `items`: computing it during render avoids the extra render and the duplicated source of truth. An effect is for syncing with something external, and here there is nothing outside React.",
      },
    ],
  },
};
