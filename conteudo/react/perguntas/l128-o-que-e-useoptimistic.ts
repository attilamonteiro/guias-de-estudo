import type { Pergunta } from "../../tipos";

// L128 · O que é useOptimistic
export const l128: Pergunta = {
  numero: 128,
  modulo: "linkedin-react19",
  metodo: "design",
  pt: {
    titulo: "O que é useOptimistic",
    pergunta: "O que é useOptimistic()?",
    porqueEsteMetodo:
      "Interface otimista é uma decisão de projeto: o que o usuário vê agora, de onde vem a verdade e o que acontece quando as duas divergem. Um roteiro que vai dos requisitos à operação evita ficar só na sintaxe do hook.",
    resposta30s:
      "**`useOptimistic(estadoReal, atualizador)`** devolve um estado **temporário derivado do estado real** e uma função para aplicar atualizações otimistas: durante uma Action, a tela mostra o resultado esperado na hora. Quando a Action termina, o React volta a mostrar o **estado real**: se a operação deu certo e você o atualizou, o valor verdadeiro substitui o otimista; se falhou, a interface **volta ao anterior** sozinha, e você mostra o erro. É um recurso recente; confira react.dev.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Do requisito ao desenho",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "O usuário deve ver o efeito da ação na hora (curtir, comentar, marcar uma tarefa), mas a verdade está no servidor e pode divergir. Isso exige reação imediata, reconciliação com a resposta real e um desfazer visível em caso de falha. Uma operação que quase sempre dá certo e é barata de reverter é candidata.",
          },
          {
            titulo: "2. Dois estados, um derivado",
            texto:
              "Mantenha o **estado real** (de `useState`, de uma biblioteca de dados ou do servidor) e derive dele o **estado otimista** com `useOptimistic(real, (atual, valor) => novo)`. A interface desenha o otimista; o atualizador é uma função pura que diz como o valor provisório entra no estado.",
          },
          {
            titulo: "3. Dispare dentro de uma Action",
            texto:
              "Chame a função de atualização otimista **dentro de uma Action** (`<form action>` ou `startTransition`), antes do `await`. O valor otimista só dura enquanto a Action está pendente.",
          },
          {
            titulo: "4. Sucesso",
            texto:
              "A Action atualiza o **estado real** com o que o servidor devolveu (depois do `await`, faça isso dentro de `startTransition`, para a troca acontecer junto). Ao terminar, o React descarta o otimista e passa a mostrar o real; use o id devolvido pelo servidor para não duplicar o item.",
          },
          {
            titulo: "5. Falha",
            texto:
              "Se a operação falhar, o estado real não mudou, e o React volta a mostrar o anterior sozinho: o item provisório desaparece. Cabe a você explicar o que houve (mensagem, botão para tentar de novo) e, se couber, devolver o texto digitado.",
          },
          {
            titulo: "6. Várias operações e feedback",
            texto:
              "Cada atualização otimista vale enquanto a sua Action está pendente, e várias se empilham sobre o estado real. Dê ids provisórios, marque os itens como “enviando” (opacidade, texto) e deixe o servidor idempotente para suportar reenvios. Evite o otimismo em operações caras de desfazer (pagamentos, exclusões definitivas) ou cujo resultado o cliente não consegue prever (valores calculados no servidor).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Uma conversa que mostra a mensagem antes da resposta",
        legenda: "JSX",
        codigo: `import { startTransition, useOptimistic, useState } from "react";
export function Conversa({ inicial }) {
  const [mensagens, setMensagens] = useState(inicial); // estado real
  const [erro, setErro] = useState("");
  const [exibidas, adicionar] = useOptimistic(mensagens, (atuais, nova) => [...atuais, nova]);
  async function enviar(dados) {
    const texto = dados.get("texto");
    adicionar({ id: crypto.randomUUID(), texto, enviando: true }); // aparece na hora
    const salva = await salvar(texto).catch(() => null); // a verdade vem do servidor
    startTransition(() => {
      if (salva) setMensagens((atuais) => [...atuais, salva]); // o real substitui o otimista
      else setErro("Não foi possível enviar."); // o real não mudou: o otimista some
    });
  }
  return (
    <form action={enviar}>
      <Lista itens={exibidas} />
      <input name="texto" /> <button>Enviar</button>
      {erro && <p role="alert">{erro}</p>}
    </form>
  );
}`,
        nota: "Depois do `await`, a atualização de estado vai em `startTransition` para fazer parte da mesma transição. O atualizador do `useOptimistic` é puro; o id provisório nasce fora dele. `Lista` e `salvar` são ilustrativos.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Quando usar (e quando evitar)",
        texto:
          "Use quando a operação **quase sempre dá certo**, a falha é **barata de desfazer** e o atraso incomodaria o usuário: curtir, favoritar, marcar tarefa, enviar mensagem, reordenar. Evite quando a falha é comum, a consequência é grave (pagamento, exclusão definitiva) ou o resultado depende de algo que só o servidor sabe. O custo (o trade-off) é complexidade: dois estados, tratamento de erro, ids provisórios e possíveis saltos visuais quando o real difere do otimista.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O estado real precisa ser atualizado",
        texto:
          "O erro mais comum é mostrar o otimista e **esquecer de atualizar o estado real** quando a operação dá certo: ao fim da Action o React volta ao real, e o item “some” mesmo tendo sido salvo. Lembre também que o hook só vale para a Action em andamento: ele não guarda nada, não persiste e não substitui o servidor. É um recurso recente; confira react.dev.",
      },
    ],
    armadilhas: [
      "Chamar a atualização otimista fora de uma Action (por exemplo, num manipulador comum, sem transição): ela não fica atrelada à operação e o React avisa.",
      "Não atualizar o estado real no sucesso: ao fim da Action a interface volta ao valor antigo e o item some.",
      "Não tratar a falha: o item provisório desaparece sem explicação e o usuário acha que perdeu o que digitou.",
      "Gerar ids provisórios que colidem com os reais, ou deixar o servidor sem idempotência: reenvios geram duplicatas.",
    ],
    autoteste: [
      {
        pergunta: "O que acontece com o estado otimista quando a Action termina com sucesso? E com falha?",
        resposta:
          "O React descarta o estado otimista e volta a mostrar o estado real. No sucesso, o real já traz o valor confirmado (se você o atualizou); na falha, o real não mudou, então a interface volta ao anterior e você mostra o erro.",
      },
      {
        pergunta: "Quando você não usaria `useOptimistic`?",
        resposta:
          "Quando a falha é comum ou cara de desfazer (pagamentos, exclusões definitivas), ou quando o resultado depende de um cálculo do servidor que o cliente não consegue prever. Nesses casos, prefira um estado pendente claro e espere a confirmação.",
      },
    ],
  },
  en: {
    titulo: "What useOptimistic is",
    pergunta: "What is useOptimistic()?",
    porqueEsteMetodo:
      "An optimistic interface is a design decision: what the user sees now, where the truth comes from and what happens when the two diverge. A walkthrough from requirements to operation keeps you from stopping at the hook’s syntax.",
    resposta30s:
      "**`useOptimistic(realState, updater)`** returns a **temporary state derived from the real state** and a function to apply optimistic updates: during an Action, the screen shows the expected result right away. When the Action ends, React goes back to showing the **real state**: if the operation succeeded and you updated it, the true value replaces the optimistic one; if it failed, the interface **goes back to the previous value** by itself, and you show the error. It is a recent feature; check react.dev.",
    blocos: [
      {
        tipo: "passos",
        titulo: "From requirement to design",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "The user must see the effect of the action right away (liking, commenting, ticking a task), but the truth lives on the server and may differ. That calls for an immediate reaction, reconciliation with the real response and a visible undo on failure. An operation that almost always succeeds and is cheap to reverse is a candidate.",
          },
          {
            titulo: "2. Two states, one derived",
            texto:
              "Keep the **real state** (from `useState`, a data library or the server) and derive the **optimistic state** from it with `useOptimistic(real, (current, value) => next)`. The interface draws the optimistic one; the updater is a pure function that says how the provisional value enters the state.",
          },
          {
            titulo: "3. Fire it inside an Action",
            texto:
              "Call the optimistic update function **inside an Action** (`<form action>` or `startTransition`), before the `await`. The optimistic value lasts only while the Action is pending.",
          },
          {
            titulo: "4. Success",
            texto:
              "The Action updates the **real state** with what the server returned (after the `await`, do it inside `startTransition` so the swap happens together). When it ends, React drops the optimistic value and shows the real one; use the id returned by the server to avoid duplicating the item.",
          },
          {
            titulo: "5. Failure",
            texto:
              "If the operation fails, the real state did not change, and React goes back to showing the previous one by itself: the provisional item disappears. It is up to you to explain what happened (a message, a retry button) and, if it makes sense, give back the typed text.",
          },
          {
            titulo: "6. Several operations and feedback",
            texto:
              "Each optimistic update lasts while its Action is pending, and several stack on top of the real state. Give items provisional ids, mark them as “sending” (opacity, text) and keep the server idempotent so resends are safe. Avoid optimism for operations that are costly to undo (payments, permanent deletions) or whose result the client cannot predict (values computed on the server).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A conversation that shows the message before the response",
        legenda: "JSX",
        codigo: `import { startTransition, useOptimistic, useState } from "react";
export function Conversation({ initial }) {
  const [messages, setMessages] = useState(initial); // real state
  const [error, setError] = useState("");
  const [shown, add] = useOptimistic(messages, (current, next) => [...current, next]);
  async function send(data) {
    const text = data.get("text");
    add({ id: crypto.randomUUID(), text, sending: true }); // shows up at once
    const saved = await save(text).catch(() => null); // the truth comes from the server
    startTransition(() => {
      if (saved) setMessages((current) => [...current, saved]); // the real one replaces the optimistic one
      else setError("Could not send."); // the real state did not change: the optimistic one vanishes
    });
  }
  return (
    <form action={send}>
      <List items={shown} />
      <input name="text" /> <button>Send</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}`,
        nota: "After the `await`, the state update goes inside `startTransition` so it is part of the same transition. The `useOptimistic` updater is pure; the provisional id is created outside it. `List` and `save` are illustrative.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "When to use it (and when to avoid it)",
        texto:
          "Use it when the operation **almost always succeeds**, a failure is **cheap to undo** and the delay would bother the user: liking, favoriting, ticking a task, sending a message, reordering. Avoid it when failure is common, the consequence is serious (payment, permanent deletion) or the result depends on something only the server knows. The cost (the trade-off) is complexity: two states, error handling, provisional ids and possible visual jumps when the real result differs from the optimistic one.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The real state must be updated",
        texto:
          "The most common mistake is showing the optimistic state and **forgetting to update the real state** when the operation succeeds: when the Action ends React goes back to the real one, and the item “vanishes” even though it was saved. Remember too that the hook only applies to the Action in progress: it stores nothing, does not persist and does not replace the server. It is a recent feature; check react.dev.",
      },
    ],
    armadilhas: [
      "Calling the optimistic update outside an Action (for example in a plain handler, with no transition): it is not tied to the operation and React warns you.",
      "Not updating the real state on success: when the Action ends the interface returns to the old value and the item vanishes.",
      "Not handling failure: the provisional item disappears with no explanation and the user thinks they lost what they typed.",
      "Generating provisional ids that collide with real ones, or leaving the server without idempotency: resends create duplicates.",
    ],
    autoteste: [
      {
        pergunta: "What happens to the optimistic state when the Action ends successfully? And on failure?",
        resposta:
          "React discards the optimistic state and goes back to showing the real state. On success, the real state already carries the confirmed value (if you updated it); on failure, the real state did not change, so the interface returns to the previous value and you show the error.",
      },
      {
        pergunta: "When would you not use `useOptimistic`?",
        resposta:
          "When failure is common or costly to undo (payments, permanent deletions), or when the result depends on a server-side calculation the client cannot predict. In those cases, prefer a clear pending state and wait for confirmation.",
      },
    ],
  },
};
