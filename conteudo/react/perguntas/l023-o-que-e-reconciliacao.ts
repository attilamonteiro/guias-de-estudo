import type { Pergunta } from "../../tipos";

// L23 · O que é reconciliação
export const l023: Pergunta = {
  numero: 23,
  modulo: "linkedin-renderizacao",
  metodo: "trace",
  pt: {
    titulo: "O que é reconciliação",
    pergunta: "O que é reconciliação?",
    porqueEsteMetodo:
      "Reconciliação parece mágica até você seguir uma atualização de verdade: o que o React compara, em que ordem e o que acontece quando o tipo, a posição ou a key mudam. Acompanhar o percurso, inclusive o desvio em que o estado se perde, mostra as regras.",
    resposta30s:
      "**Reconciliação** é o algoritmo com que o React compara a árvore de elementos da renderização anterior com a nova e descobre o **mínimo de mudanças** que precisam chegar ao DOM; essa comparação é o **diffing**. Para ficar barata, ele usa heurísticas de custo linear: elementos de **tipos diferentes** geram árvores diferentes (a subárvore é descartada e o state, perdido), elementos do **mesmo tipo** são atualizados no lugar, e em listas as **keys** dizem quem é quem. A identidade de um componente é, portanto, **tipo + posição (+ key)**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Seguindo uma atualização",
        passos: [
          {
            titulo: "1. Algo muda",
            texto:
              "Um `setState`, um contexto novo ou o pai renderizando faz o React chamar de novo a função do componente. Ela devolve uma **nova árvore de elementos** (o JSX já avaliado): objetos leves que descrevem a interface, sem tocar o DOM.",
          },
          {
            titulo: "2. Compara com a árvore anterior",
            texto:
              "O React percorre as duas árvores juntas, de cima para baixo, comparando **cada nó com o nó que estava na mesma posição**. Ele não procura o mesmo elemento em outro lugar da árvore: um componente movido para outro pai é, para ele, um componente novo.",
          },
          {
            titulo: "3. Decide pelo tipo",
            texto:
              "Tipo diferente (`<div>` virou `<section>`, `<Perfil />` virou `<Conta />`): o React **desmonta** a subárvore antiga (efeitos limpos, state perdido) e **monta** a nova do zero. Mesmo tipo: **mantém a instância** e o state, atualiza só o que mudou (atributos e estilos de um elemento do DOM, props de um componente) e desce para os filhos.",
          },
          {
            titulo: "4. Nas listas, usa as keys",
            texto:
              "Para os filhos de um mesmo pai, o React casa itens antigos e novos pela **key** (veja L33). Sem key, usa a posição, e uma inserção no começo da lista faz parecer que todos os itens mudaram.",
          },
          {
            titulo: "5. Aplica só a diferença",
            texto:
              "O resultado do diff é uma lista de mudanças. Na fase de commit (veja L28) o React as aplica ao DOM de uma vez; o que não mudou não é tocado. O DOM só é atualizado onde a saída do render difere da anterior.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "As heurísticas, caso a caso",
        colunas: ["Situação", "O que o React faz", "Efeito no state e no DOM"],
        linhas: [
          [
            "Tipo diferente na mesma posição (`<div>` → `<span>`, `<A />` → `<B />`)",
            "Descarta a subárvore antiga e cria a nova",
            "State dos componentes lá dentro é perdido; nós do DOM recriados; efeitos limpos e executados de novo",
          ],
          [
            "Mesmo elemento do DOM, atributos diferentes",
            "Mantém o nó e altera só os atributos ou estilos que mudaram",
            "O DOM é mexido apenas no que mudou (por exemplo, uma classe)",
          ],
          [
            "Mesmo componente, props diferentes",
            "Mantém a instância, chama o componente com as props novas e reconcilia o que ele devolve",
            "State preservado; os filhos são comparados em seguida",
          ],
          [
            "Filhos de uma lista, com `key`",
            "Casa itens antigos e novos pela key, mesmo em outra posição",
            "Itens movidos em vez de recriados; o state acompanha o item",
          ],
          [
            "Filhos de uma lista, sem `key`",
            "Casa por posição (e avisa no console)",
            "Inserir ou reordenar desalinha state e DOM",
          ],
        ],
        nota: "Se o mesmo componente aparece na mesma posição nos dois ramos de um condicional, o React o trata como o mesmo: o state é mantido. Para forçar um começo limpo, mude o tipo ou a `key`.",
      },
      {
        tipo: "codigo",
        titulo: "Mesmo tipo e posição preservam o state; tipo diferente o reinicia",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function Campo({ rotulo }) {
  const [texto, setTexto] = useState("");
  return (
    <label>
      {rotulo} <input value={texto} onChange={(e) => setTexto(e.target.value)} />
    </label>
  );
}

export function Painel({ admin }) {
  // Mesmo tipo (Campo) na mesma posição: o texto digitado sobrevive à troca do rótulo.
  return admin ? <Campo rotulo="Admin" /> : <Campo rotulo="Usuário" />;
}

export function Caixa({ destaque }) {
  // Tipo diferente (section x div): a subárvore é descartada e o texto digitado, perdido.
  return destaque ? <section><Campo rotulo="Nome" /></section> : <div><Campo rotulo="Nome" /></div>;
}`,
        nota: "Para reiniciar o state de um componente de propósito, dê a ele uma `key` que mude, por exemplo `<Campo key={usuarioId} />`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Identidade = tipo + posição (+ key)",
        texto:
          "O React não olha o conteúdo de um componente para decidir se ele é “o mesmo”: decide por **tipo, posição e key**. É essa regra simples que mantém o diff linear, em vez de um algoritmo genérico de comparação de árvores, que seria caro demais para rodar a cada atualização.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Reconciliar não é atualizar o DOM",
        texto:
          "A reconciliação é a **decisão** (o que mudou). Quem aplica as mudanças é o renderizador (`react-dom`, no navegador), na fase de commit. Também não é o mesmo que “renderizar”: o componente roda inteiro mesmo quando nada muda; o diff só garante que o DOM receba apenas a diferença. “Virtual DOM” é o nome popular da árvore de elementos em memória que entra nessa comparação (veja L22).",
      },
    ],
    armadilhas: [
      "Achar que o React compara o DOM real: ele compara as duas árvores de elementos (a anterior e a nova) e só depois mexe no DOM.",
      "Definir um componente dentro de outro componente: a cada render nasce uma função nova, o React vê um tipo diferente, desmonta tudo e perde o state.",
      "Usar o índice do array como key em listas que reordenam ou recebem inserções: o React casa itens errados e o state fica no lugar errado (veja L33).",
      "Confundir “o componente renderizou” com “o DOM mudou”: renderizar é chamar a função; o DOM só muda onde o resultado difere do anterior.",
    ],
    autoteste: [
      {
        pergunta:
          "Por que trocar um `<div>` por um `<section>` ao redor de um formulário apaga o que a pessoa digitou?",
        resposta:
          "Porque o tipo do elemento mudou na mesma posição: o React descarta a subárvore antiga e monta uma nova, e o state dos componentes dentro dela é perdido.",
      },
      {
        pergunta: "Como o React mantém o diff barato?",
        resposta:
          "Com duas suposições: elementos de tipos diferentes geram árvores diferentes, e as keys indicam quais filhos de uma lista são estáveis. Assim ele compara só nós na mesma posição, num percurso linear, sem procurar equivalentes pela árvore inteira.",
      },
    ],
  },
  en: {
    titulo: "What reconciliation is",
    pergunta: "What is reconciliation?",
    porqueEsteMetodo:
      "Reconciliation feels like magic until you follow a real update: what React compares, in what order, and what happens when the type, the position or the key changes. Tracing the path, including the detour where state gets lost, reveals the rules.",
    resposta30s:
      "**Reconciliation** is the algorithm React uses to compare the element tree from the previous render with the new one and work out the **minimum set of changes** that must reach the DOM; that comparison is called **diffing**. To keep it cheap, React relies on linear-cost heuristics: elements of **different types** produce different trees (the subtree is thrown away and its state lost), elements of the **same type** are updated in place, and in lists **keys** say who is who. A component’s identity is therefore **type + position (+ key)**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Following an update",
        passos: [
          {
            titulo: "1. Something changes",
            texto:
              "A `setState`, a new context value or the parent rendering makes React call the component function again. It returns a **new element tree** (the evaluated JSX): lightweight objects describing the UI, without touching the DOM.",
          },
          {
            titulo: "2. Compare with the previous tree",
            texto:
              "React walks both trees together, top down, comparing **each node with the node that was in the same position**. It does not look for the same element elsewhere in the tree: a component moved to another parent is, to React, a new component.",
          },
          {
            titulo: "3. Decide by type",
            texto:
              "Different type (`<div>` became `<section>`, `<Profile />` became `<Account />`): React **unmounts** the old subtree (effects cleaned up, state lost) and **mounts** the new one from scratch. Same type: it **keeps the instance** and its state, updates only what changed (attributes and styles of a DOM element, props of a component) and moves on to the children.",
          },
          {
            titulo: "4. In lists, use the keys",
            texto:
              "For the children of one parent, React matches old and new items by **key** (see L33). Without a key it falls back to position, and an insertion at the start of the list makes every item look changed.",
          },
          {
            titulo: "5. Apply only the difference",
            texto:
              "The diff produces a list of changes. In the commit phase (see L28) React applies them to the DOM in one go; whatever did not change is not touched. The DOM is updated only where the render output differs from the previous one.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "The heuristics, case by case",
        colunas: ["Situation", "What React does", "Effect on state and DOM"],
        linhas: [
          [
            "Different type in the same position (`<div>` → `<span>`, `<A />` → `<B />`)",
            "Discards the old subtree and creates the new one",
            "State of the components inside is lost; DOM nodes recreated; effects cleaned up and run again",
          ],
          [
            "Same DOM element, different attributes",
            "Keeps the node and changes only the attributes or styles that differ",
            "The DOM is touched only where something changed (a class, for example)",
          ],
          [
            "Same component, different props",
            "Keeps the instance, calls the component with the new props and reconciles what it returns",
            "State preserved; the children are compared next",
          ],
          [
            "List children, with a `key`",
            "Matches old and new items by key, even in another position",
            "Items are moved instead of recreated; state follows the item",
          ],
          [
            "List children, without a `key`",
            "Matches by position (and warns in the console)",
            "Inserting or reordering misaligns state and DOM",
          ],
        ],
        nota: "If the same component appears in the same position in both branches of a conditional, React treats it as the same one: its state is kept. To force a clean start, change the type or the `key`.",
      },
      {
        tipo: "codigo",
        titulo: "Same type and position keep state; a different type resets it",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function Field({ label }) {
  const [text, setText] = useState("");
  return (
    <label>
      {label} <input value={text} onChange={(e) => setText(e.target.value)} />
    </label>
  );
}

export function Panel({ admin }) {
  // Same type (Field) in the same position: the typed text survives the label change.
  return admin ? <Field label="Admin" /> : <Field label="User" />;
}

export function Box({ highlight }) {
  // Different type (section vs div): the subtree is discarded and the typed text is lost.
  return highlight ? <section><Field label="Name" /></section> : <div><Field label="Name" /></div>;
}`,
        nota: "To reset a component’s state on purpose, give it a `key` that changes, for example `<Field key={userId} />`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Identity = type + position (+ key)",
        texto:
          "React does not inspect a component’s content to decide whether it is “the same one”: it decides by **type, position and key**. That simple rule is what keeps the diff linear, instead of a general tree-comparison algorithm, which would be far too expensive to run on every update.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Reconciling is not updating the DOM",
        texto:
          "Reconciliation is the **decision** (what changed). The renderer (`react-dom`, in the browser) applies the changes, in the commit phase. It is also not the same as “rendering”: the component runs in full even when nothing changes; the diff only makes sure the DOM receives just the difference. “Virtual DOM” is the popular name for the in-memory element tree that goes into this comparison (see L22).",
      },
    ],
    armadilhas: [
      "Thinking React compares the real DOM: it compares the two element trees (previous and new) and only then touches the DOM.",
      "Defining a component inside another component: each render creates a new function, React sees a different type, unmounts everything and loses the state.",
      "Using the array index as a key in lists that reorder or get insertions: React matches the wrong items and state ends up in the wrong place (see L33).",
      "Mixing up “the component rendered” with “the DOM changed”: rendering is calling the function; the DOM changes only where the result differs from the previous one.",
    ],
    autoteste: [
      {
        pergunta: "Why does swapping a `<div>` for a `<section>` around a form wipe what the user typed?",
        resposta:
          "Because the element type changed in the same position: React discards the old subtree and mounts a new one, and the state of the components inside it is lost.",
      },
      {
        pergunta: "How does React keep the diff cheap?",
        resposta:
          "With two assumptions: elements of different types produce different trees, and keys tell which children of a list are stable. So it compares only nodes in the same position, in a linear walk, without searching the whole tree for equivalents.",
      },
    ],
  },
};
