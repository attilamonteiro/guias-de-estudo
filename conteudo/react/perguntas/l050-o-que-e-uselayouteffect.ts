import type { Pergunta } from "../../tipos";

// L50 · O que é useLayoutEffect
export const l050: Pergunta = {
  numero: 50,
  modulo: "linkedin-hooks",
  metodo: "compare",
  pt: {
    titulo: "O que é useLayoutEffect",
    pergunta: "O que é useLayoutEffect()?",
    porqueEsteMetodo:
      "`useLayoutEffect` só faz sentido ao lado do `useEffect`: a forma é idêntica e a diferença é o momento. Uma matriz lado a lado mostra o que muda, e a regra de decisão diz qual usar.",
    resposta30s:
      "`useLayoutEffect` tem a mesma forma de `useEffect`, mas roda de forma **síncrona depois de o React atualizar o DOM e antes de o navegador pintar**. Por isso serve para **medir elementos e ajustar o layout** (posicionar tooltips, evitar cintilação) sem que o usuário veja o quadro intermediário. O preço é que ele **bloqueia a pintura**, então comece por `useEffect` e só troque quando houver o sintoma.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "`useEffect` × `useLayoutEffect`",
        colunas: ["Aspecto", "`useEffect`", "`useLayoutEffect`"],
        linhas: [
          ["Assinatura", "`(setup, dependências)`, com limpeza opcional", "Idêntica"],
          [
            "Quando roda",
            "Depois do commit; normalmente depois de o navegador pintar a tela",
            "De forma síncrona, depois de o React atualizar o DOM e antes de o navegador pintar",
          ],
          ["Bloqueia a pintura?", "Não", "Sim: o navegador espera o efeito terminar"],
          [
            "Atualizar state dentro dele",
            "Pode gerar uma segunda pintura visível, com o quadro intermediário",
            "É processado antes da pintura: o usuário só vê o resultado final",
          ],
          [
            "Uso típico",
            "Rede, assinaturas, timers, sincronizar com sistemas externos",
            "Medir elementos, posicionar tooltips e popovers, evitar cintilação",
          ],
          ["Custo", "Baixo: não atrasa a tela", "Um efeito lento congela a pintura; use só quando necessário"],
          ["Renderização no servidor", "Não roda no servidor", "Também não roda; o HTML do servidor sai sem o ajuste"],
        ],
        nota: "Em versões anteriores do React, usar `useLayoutEffect` na renderização no servidor gerava um aviso; confira react.dev para a situação atual. Em bibliotecas que rodam nos dois ambientes, é comum escolher o Hook conforme o ambiente.",
      },
      {
        tipo: "codigo",
        titulo: "Posicionar uma dica antes da pintura",
        legenda: "TSX",
        codigo: `import { useLayoutEffect, useRef, useState } from "react";

export function Dica({ texto }: { texto: string }) {
  const caixa = useRef<HTMLDivElement>(null);
  const [topo, setTopo] = useState(0);

  useLayoutEffect(() => {
    if (!caixa.current) return;
    const altura = caixa.current.getBoundingClientRect().height;
    setTopo(-altura - 8); // posiciona acima do alvo ANTES da pintura
  }, [texto]);

  return (
    <div ref={caixa} style={{ position: "absolute", top: topo }}>
      {texto}
    </div>
  );
}`,
        nota: "Com `useEffect`, o navegador poderia pintar a dica na posição 0 por um instante e só depois movê-la: o usuário veria o pulo. Com `useLayoutEffect`, a medição e o novo `setTopo` são processados antes da pintura.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Comece por `useEffect`. Troque para `useLayoutEffect` só quando o efeito **lê o layout e muda algo visual em função dele** e você percebe cintilação ou um quadro intermediário errado. Sem esse sintoma, não há motivo para bloquear a pintura.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Roda depois do DOM, não antes da renderização",
        texto:
          "O `useLayoutEffect` não roda antes da renderização: ele roda **depois** de o React atualizar o DOM (o commit), por isso os nós e os refs já existem. A ordem é renderização, commit, `useLayoutEffect`, pintura e, em geral, `useEffect`. Trabalho pesado ali congela a tela, e requisições e assinaturas continuam sendo assunto do `useEffect`.",
      },
    ],
    armadilhas: [
      "Usar `useLayoutEffect` por padrão, “por segurança”: ele bloqueia a pintura, deixa a interface mais lenta e perde a vantagem do `useEffect`.",
      "Fazer trabalho pesado ou assíncrono dentro dele (laços grandes, requisições): a tela congela até terminar. Rede e assinaturas vão em `useEffect`.",
      "Usá-lo em componente renderizado no servidor sem pensar: o efeito não roda lá, o HTML inicial sai sem o ajuste e pode piscar até a hidratação.",
      "Achar que ele roda antes da renderização: ele roda depois do commit e antes da pintura; durante a renderização o nó ainda não está no DOM.",
    ],
    autoteste: [
      {
        pergunta: "Em que ordem acontecem renderização, `useLayoutEffect`, pintura e `useEffect`?",
        resposta:
          "O React renderiza (calcula o JSX), confirma as mudanças no DOM (commit), roda os `useLayoutEffect` de forma síncrona, o navegador pinta e, em geral, só então rodam os `useEffect`.",
      },
      {
        pergunta: "Quando vale trocar `useEffect` por `useLayoutEffect`?",
        resposta:
          "Quando o efeito mede o layout e altera o visual em função da medida, e você vê um quadro intermediário errado (cintilação). Sem esse sintoma, fique com `useEffect`.",
      },
    ],
  },
  en: {
    titulo: "What useLayoutEffect is",
    pergunta: "What is useLayoutEffect()?",
    porqueEsteMetodo:
      "`useLayoutEffect` only makes sense next to `useEffect`: the shape is identical and the difference is the timing. A side-by-side matrix shows what changes, and the decision rule says which to use.",
    resposta30s:
      "`useLayoutEffect` has the same shape as `useEffect`, but runs **synchronously after React updates the DOM and before the browser paints**. That makes it suited to **measuring elements and adjusting layout** (positioning tooltips, avoiding flicker) without the user seeing the intermediate frame. The price is that it **blocks painting**, so start with `useEffect` and only switch when you see the symptom.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "`useEffect` vs `useLayoutEffect`",
        colunas: ["Aspect", "`useEffect`", "`useLayoutEffect`"],
        linhas: [
          ["Signature", "`(setup, dependencies)`, with optional cleanup", "Identical"],
          [
            "When it runs",
            "After the commit; normally after the browser has painted the screen",
            "Synchronously, after React updates the DOM and before the browser paints",
          ],
          ["Blocks painting?", "No", "Yes: the browser waits for the effect to finish"],
          [
            "Updating state inside it",
            "Can cause a second visible paint, showing the intermediate frame",
            "Processed before painting: the user only sees the final result",
          ],
          [
            "Typical use",
            "Network, subscriptions, timers, syncing with external systems",
            "Measuring elements, positioning tooltips and popovers, avoiding flicker",
          ],
          ["Cost", "Low: does not delay the screen", "A slow effect freezes painting; use only when needed"],
          [
            "Server rendering",
            "Does not run on the server",
            "Does not run either; the server’s HTML comes out without the adjustment",
          ],
        ],
        nota: "In earlier versions of React, using `useLayoutEffect` in server rendering produced a warning; check react.dev for the current situation. In libraries that run in both environments, it is common to pick the Hook according to the environment.",
      },
      {
        tipo: "codigo",
        titulo: "Positioning a tooltip before painting",
        legenda: "TSX",
        codigo: `import { useLayoutEffect, useRef, useState } from "react";

export function Tooltip({ text }: { text: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);

  useLayoutEffect(() => {
    if (!box.current) return;
    const height = box.current.getBoundingClientRect().height;
    setTop(-height - 8); // places it above the target BEFORE painting
  }, [text]);

  return (
    <div ref={box} style={{ position: "absolute", top }}>
      {text}
    </div>
  );
}`,
        nota: "With `useEffect`, the browser could paint the tooltip at position 0 for a moment and only then move it: the user would see the jump. With `useLayoutEffect`, the measurement and the new `setTop` are processed before painting.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Start with `useEffect`. Switch to `useLayoutEffect` only when the effect **reads layout and changes something visual because of it** and you notice flicker or a wrong intermediate frame. Without that symptom, there is no reason to block painting.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "It runs after the DOM, not before rendering",
        texto:
          "`useLayoutEffect` does not run before rendering: it runs **after** React updates the DOM (the commit), which is why nodes and refs already exist. The order is render, commit, `useLayoutEffect`, paint and, usually, `useEffect`. Heavy work there freezes the screen, and requests and subscriptions remain `useEffect`’s job.",
      },
    ],
    armadilhas: [
      "Using `useLayoutEffect` by default, “to be safe”: it blocks painting, makes the UI slower and throws away the advantage of `useEffect`.",
      "Doing heavy or asynchronous work inside it (big loops, requests): the screen freezes until it finishes. Network and subscriptions belong in `useEffect`.",
      "Using it in a component rendered on the server without thinking: the effect does not run there, the initial HTML comes out without the adjustment and may flash until hydration.",
      "Thinking it runs before rendering: it runs after the commit and before painting; during rendering the node is not in the DOM yet.",
    ],
    autoteste: [
      {
        pergunta: "In what order do rendering, `useLayoutEffect`, painting and `useEffect` happen?",
        resposta:
          "React renders (computes the JSX), commits the changes to the DOM, runs the `useLayoutEffect`s synchronously, the browser paints and, usually, only then do the `useEffect`s run.",
      },
      {
        pergunta: "When is it worth swapping `useEffect` for `useLayoutEffect`?",
        resposta:
          "When the effect measures layout and changes the visuals based on the measurement, and you see a wrong intermediate frame (flicker). Without that symptom, stay with `useEffect`.",
      },
    ],
  },
};
