import type { Pergunta } from "../../tipos";

// L56 · O que é useInsertionEffect
export const l056: Pergunta = {
  numero: 56,
  modulo: "linkedin-hooks",
  metodo: "design",
  pt: {
    titulo: "O que é useInsertionEffect",
    pergunta: "O que é useInsertionEffect()?",
    porqueEsteMetodo:
      "Este Hook só se explica pelo problema que o criou: uma biblioteca de CSS-in-JS que precisa de estilo no lugar antes de qualquer leitura de layout. Desenhar essa biblioteca, do requisito às restrições, mostra por que o Hook existe e por que quase ninguém o usa.",
    resposta30s:
      "`useInsertionEffect` é um Hook para **autores de bibliotecas CSS-in-JS**: roda **antes dos layout effects**, para injetar regras `<style>` antes de qualquer leitura de layout, sem recalcular estilos várias vezes nem causar flash. A ordem é `useInsertionEffect`, `useLayoutEffect` e `useEffect`. Ele não atualiza state, não tem refs anexadas e **não roda no servidor**, e aplicações comuns quase nunca o usam.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado: a biblioteca de CSS-in-JS",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Componentes declaram estilos em JavaScript, com valores dinâmicos vindos de props. A biblioteca gera uma classe e injeta a regra num `<style>`. A regra precisa existir **antes** da primeira leitura de layout e da pintura (sem flash de conteúdo sem estilo), sem recalcular estilos repetidamente e sem duplicar a mesma regra.",
          },
          {
            titulo: "2. Onde injetar? Descartando as opções",
            texto:
              "Durante a renderização: errado, a renderização deve ser pura e pode ser descartada ou repetida, o que vaza regras. Em `useEffect`: tarde demais, roda depois da pintura e o usuário vê o conteúdo sem estilo. Em `useLayoutEffect`: antes da pintura, mas os layout effects de outros componentes podem ler o layout antes de a regra existir, e injetar depois obriga o navegador a recalcular os estilos de novo.",
          },
          {
            titulo: "3. A solução: um efeito que roda antes dos outros",
            texto:
              "`useInsertionEffect` roda **antes de qualquer layout effect**. Quando os componentes medem o layout, a regra já está no documento, e o navegador calcula os estilos uma vez. A ordem é fixa: inserção, depois layout, depois efeitos comuns.",
          },
          {
            titulo: "4. As restrições",
            texto:
              "Não dá para atualizar state dentro dele. As refs ainda não estão anexadas, e o DOM pode ou não ter sido atualizado quando ele roda, então não dependa disso. O efeito só roda no cliente, nunca na renderização do servidor.",
          },
          {
            titulo: "5. O que sobra para a biblioteca",
            texto:
              "Evitar duplicatas (um conjunto das regras já injetadas, indexado pela classe), remover regras sem uso, e cuidar do servidor por outro caminho: coletar as regras durante a renderização e escrevê-las no HTML. O Hook não faz isso por você.",
          },
          {
            titulo: "6. Operação: quem deve usar",
            texto:
              "Quem escreve a biblioteca. Numa aplicação comum, estilo dinâmico se resolve com CSS, CSS Modules, variáveis CSS ou o atributo `style`, e efeito comum com `useEffect` ou `useLayoutEffect`. Se você não está construindo uma biblioteca de estilo, quase nunca precisa dele.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "A ordem dos efeitos no commit",
        colunas: ["Hook", "Quando roda", "O que faz sentido ali"],
        linhas: [
          [
            "`useInsertionEffect`",
            "Primeiro, antes dos layout effects; refs ainda não anexadas",
            "Injetar `<style>`; não atualiza state",
          ],
          [
            "`useLayoutEffect`",
            "Depois, com o DOM atualizado e as refs anexadas, antes da pintura",
            "Ler o layout e ajustar o visual",
          ],
          [
            "`useEffect`",
            "Por último, normalmente depois da pintura",
            "Rede, assinaturas, sincronizar com sistemas externos",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "O coração da biblioteca: injetar uma regra uma vez",
        legenda: "TSX",
        codigo: `import { useInsertionEffect } from "react";

const injetadas = new Set<string>();

export function useRegraDeEstilo(classe: string, css: string) {
  useInsertionEffect(() => {
    if (injetadas.has(classe)) return; // não repete a mesma regra
    injetadas.add(classe);
    const tag = document.createElement("style");
    tag.dataset.regra = classe;
    tag.textContent = "." + classe + " { " + css + " }";
    document.head.appendChild(tag);
  }, [classe, css]);
}`,
        nota: "Um exemplo mínimo. Uma biblioteca real também conta referências, remove regras sem uso e trata o servidor, onde o Hook não roda.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "`useInsertionEffect` é para **autores de biblioteca** que precisam inserir estilo antes de qualquer leitura de layout. Numa aplicação, use CSS comum, CSS Modules, variáveis CSS ou `style`; se precisar de um efeito, `useEffect` ou `useLayoutEffect`. Confira em react.dev, que descreve o Hook como destinado a CSS-in-JS.",
      },
    ],
    armadilhas: [
      "Usar `useInsertionEffect` em código de aplicação: quase sempre o certo é `useEffect`, `useLayoutEffect` ou nenhum efeito.",
      "Chamar `setState` ou depender de refs dentro dele: não é permitido, e as refs ainda não estão anexadas.",
      "Injetar o estilo durante a renderização (impuro, vaza em renderizações descartadas) ou em `useEffect` (chega depois da pintura, com flash sem estilo).",
      "Esquecer o servidor: o Hook não roda no SSR, então o HTML sai sem as regras, a menos que a biblioteca as colete durante a renderização.",
    ],
    autoteste: [
      {
        pergunta: "Em que ordem rodam `useInsertionEffect`, `useLayoutEffect` e `useEffect`?",
        resposta:
          "Primeiro `useInsertionEffect`, depois `useLayoutEffect` (antes da pintura) e por fim `useEffect`, normalmente depois da pintura.",
      },
      {
        pergunta: "Por que não injetar o `<style>` em `useLayoutEffect`?",
        resposta:
          "Porque layout effects de outros componentes podem ler o layout antes de a regra existir, e injetá-la depois obriga o navegador a recalcular os estilos. O insertion effect garante que a regra já esteja lá quando os layout effects rodam.",
      },
    ],
  },
  en: {
    titulo: "What useInsertionEffect is",
    pergunta: "What is useInsertionEffect()?",
    porqueEsteMetodo:
      "This Hook can only be explained by the problem that created it: a CSS-in-JS library that needs styles in place before any layout read. Designing that library, from requirement to constraints, shows why the Hook exists and why almost nobody uses it.",
    resposta30s:
      "`useInsertionEffect` is a Hook for **CSS-in-JS library authors**: it runs **before layout effects**, to inject `<style>` rules before any layout read, without recalculating styles repeatedly or causing a flash. The order is `useInsertionEffect`, `useLayoutEffect`, then `useEffect`. It cannot update state, has no refs attached and **does not run on the server**, and ordinary applications almost never use it.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied: the CSS-in-JS library",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "Components declare styles in JavaScript, with dynamic values coming from props. The library generates a class and injects the rule into a `<style>`. The rule must exist **before** the first layout read and the paint (no flash of unstyled content), without recalculating styles repeatedly and without duplicating the same rule.",
          },
          {
            titulo: "2. Where to inject? Ruling out the options",
            texto:
              "During rendering: wrong, rendering must be pure and can be discarded or repeated, which leaks rules. In `useEffect`: too late, it runs after painting and the user sees unstyled content. In `useLayoutEffect`: before painting, but other components’ layout effects may read the layout before the rule exists, and injecting afterwards forces the browser to recalculate styles again.",
          },
          {
            titulo: "3. The solution: an effect that runs before the others",
            texto:
              "`useInsertionEffect` runs **before any layout effect**. By the time components measure the layout, the rule is already in the document, and the browser computes styles once. The order is fixed: insertion, then layout, then ordinary effects.",
          },
          {
            titulo: "4. The constraints",
            texto:
              "You cannot update state inside it. Refs are not attached yet, and the DOM may or may not have been updated when it runs, so do not depend on that. The effect only runs on the client, never during server rendering.",
          },
          {
            titulo: "5. What is left for the library",
            texto:
              "Avoiding duplicates (a set of already-injected rules, keyed by class), removing unused rules, and handling the server another way: collecting the rules during rendering and writing them into the HTML. The Hook does not do this for you.",
          },
          {
            titulo: "6. Operations: who should use it",
            texto:
              "Whoever writes the library. In an ordinary application, dynamic styling is solved with CSS, CSS Modules, CSS variables or the `style` attribute, and an ordinary effect with `useEffect` or `useLayoutEffect`. If you are not building a styling library, you almost never need it.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Effect order at commit",
        colunas: ["Hook", "When it runs", "What makes sense there"],
        linhas: [
          [
            "`useInsertionEffect`",
            "First, before layout effects; refs not attached yet",
            "Injecting `<style>`; does not update state",
          ],
          [
            "`useLayoutEffect`",
            "Next, with the DOM updated and refs attached, before painting",
            "Reading layout and adjusting visuals",
          ],
          ["`useEffect`", "Last, normally after painting", "Network, subscriptions, syncing with external systems"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The heart of the library: injecting a rule once",
        legenda: "TSX",
        codigo: `import { useInsertionEffect } from "react";

const injected = new Set<string>();

export function useStyleRule(className: string, css: string) {
  useInsertionEffect(() => {
    if (injected.has(className)) return; // do not repeat the same rule
    injected.add(className);
    const tag = document.createElement("style");
    tag.dataset.rule = className;
    tag.textContent = "." + className + " { " + css + " }";
    document.head.appendChild(tag);
  }, [className, css]);
}`,
        nota: "A minimal example. A real library also counts references, removes unused rules and handles the server, where the Hook does not run.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "`useInsertionEffect` is for **library authors** who need to insert styles before any layout read. In an application, use plain CSS, CSS Modules, CSS variables or `style`; if you need an effect, `useEffect` or `useLayoutEffect`. Check react.dev, which describes the Hook as intended for CSS-in-JS.",
      },
    ],
    armadilhas: [
      "Using `useInsertionEffect` in application code: the right choice is almost always `useEffect`, `useLayoutEffect` or no effect at all.",
      "Calling `setState` or depending on refs inside it: not allowed, and refs are not attached yet.",
      "Injecting the style during rendering (impure, leaks in discarded renders) or in `useEffect` (arrives after painting, with an unstyled flash).",
      "Forgetting the server: the Hook does not run in SSR, so the HTML goes out without the rules unless the library collects them during rendering.",
    ],
    autoteste: [
      {
        pergunta: "In what order do `useInsertionEffect`, `useLayoutEffect` and `useEffect` run?",
        resposta:
          "First `useInsertionEffect`, then `useLayoutEffect` (before painting) and finally `useEffect`, normally after painting.",
      },
      {
        pergunta: "Why not inject the `<style>` in `useLayoutEffect`?",
        resposta:
          "Because other components’ layout effects may read the layout before the rule exists, and injecting it afterwards forces the browser to recalculate styles. The insertion effect guarantees the rule is already there when the layout effects run.",
      },
    ],
  },
};
