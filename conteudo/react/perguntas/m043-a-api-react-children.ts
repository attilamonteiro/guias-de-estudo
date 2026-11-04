import type { Pergunta } from "../../tipos";

// M43 · A API React.Children
export const m043: Pergunta = {
  numero: 743,
  modulo: "medium-avancado",
  metodo: "playbook",
  pt: {
    titulo: "A API React.Children",
    pergunta: "O que é a API React.Children?",
    porqueEsteMetodo:
      "Mexer em `children` com segurança é um procedimento: descobrir o que ele pode ser, escolher a função certa de `Children`, cuidar das keys e conhecer os limites. Um roteiro em passos evita os erros clássicos com `children.map`.",
    resposta30s:
      "`React.Children` é um conjunto de utilitários (`map`, `forEach`, `count`, `toArray` e `only`) para **inspecionar e transformar `props.children`** com segurança. O `children` pode ser um elemento único, texto, número, `null`, `false` ou uma lista, então `children.map` quebra com um filho só; `Children.map` e `Children.toArray` tratam todos os casos e **atribuem keys**. A documentação **desencoraja** essa API: prefira composição explícita (props, slots, contexto).",
    blocos: [
      {
        tipo: "passos",
        titulo: "O procedimento",
        passos: [
          {
            titulo: "1. Descubra o que `children` pode ser",
            texto:
              "Um elemento (`<A />`), texto, número, `null`, `undefined`, booleano, um array ou uma mistura disso. Um filho único **não é array**, e sem filhos o valor é `undefined`. Por isso `children.map(...)` falha com “`map` is not a function”. **Sinal:** o erro só aparece em alguns usos do componente.",
          },
          {
            titulo: "2. Escolha a função certa",
            texto:
              "`Children.map` para transformar, `forEach` para percorrer, `count` para contar, `toArray` para obter um array plano e `only` para exigir exatamente um elemento (veja a tabela). **Critério:** precisa de uma lista que você possa filtrar ou reordenar? `toArray`. Só vai transformar durante a renderização? `map`.",
          },
          {
            titulo: "3. Cuide das keys",
            texto:
              "`Children.map` e `Children.toArray` atribuem keys derivadas da posição (ou da key original), então você não precisa repeti-las nos elementos devolvidos. **Sinal:** o aviso de “each child in a list should have a unique key” não aparece.",
          },
          {
            titulo: "4. Injete props com `cloneElement`",
            texto:
              "Confira `isValidElement(filho)` antes, porque o filho pode ser texto, e chame `cloneElement(filho, { compacto: true })`, que copia o elemento com as props novas por cima das existentes. **Critério:** só elementos são clonados; texto e `null` passam direto.",
          },
          {
            titulo: "5. Conheça os limites",
            texto:
              "Os filhos são **elementos**, não o que eles renderizam: você vê `<Botao />`, não o `<button>` dentro dele. **Fragments não são abertos**: `<>…</>` conta como um filho só. `Children.count` conta `null` e `false` como nós, enquanto `toArray` os descarta; por isso `toArray(children).length` costuma ser o número que você espera. **Sinal de problema:** o componente funciona até alguém embrulhar os filhos em outro componente.",
          },
          {
            titulo: "6. Considere a alternativa",
            texto:
              "Composição explícita: props nomeadas (`cabecalho`, `rodape`), `children` renderizado sem mexer, contexto para compartilhar dados com descendentes (o padrão de componentes compostos), render props ou um array `itens` em vez de filhos. A documentação trata `Children` e `cloneElement` como APIs pouco recomendadas, porque tornam o código frágil: confira react.dev.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "As funções de `Children`",
        colunas: ["Função", "O que faz", "Observação"],
        linhas: [
          [
            "`Children.map(children, fn)`",
            "Transforma cada filho e devolve um array plano",
            "Atribui keys; se `children` for `null` ou `undefined`, devolve o mesmo valor",
          ],
          [
            "`Children.forEach(children, fn)`",
            "Percorre cada filho, sem devolver nada",
            "Útil para validar ou coletar",
          ],
          ["`Children.count(children)`", "Conta os nós", "`null` e `false` contam; um fragment conta como um só"],
          [
            "`Children.toArray(children)`",
            "Devolve um array plano, com keys, sem nós vazios",
            "Boa base para filtrar, ordenar e reordenar",
          ],
          [
            "`Children.only(children)`",
            "Devolve o único elemento; lança erro se for texto, lista ou vazio",
            "Para componentes que exigem exatamente um filho",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Contar e injetar uma prop nos filhos",
        legenda: "TSX",
        codigo: [
          'import { Children, cloneElement, isValidElement, type ReactNode } from "react";',
          "",
          "export function Barra({ children }: { children: ReactNode }) {",
          "  const total = Children.toArray(children).length; // ignora null e false",
          "  return (",
          '    <div role="group" aria-label={`${total} ações`}>',
          "      {Children.map(children, (filho) =>",
          "        isValidElement<{ compacto?: boolean }>(filho) ? cloneElement(filho, { compacto: true }) : filho,",
          "      )}",
          "    </div>",
          "  );",
          "}",
          "",
          "// uso: com podeExcluir = false, total = 1 (o `false` é descartado)",
          "<Barra>",
          "  <Botao>Salvar</Botao>",
          "  {podeExcluir && <Botao>Excluir</Botao>}",
          "</Barra>;",
        ].join("\n"),
        nota: "Um `<>…</>` entre os filhos contaria como um filho só e não passaria `compacto` aos botões de dentro dele.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Prefira composição explícita",
        texto:
          "`Children` e `cloneElement` acoplam o componente à estrutura exata dos filhos e escondem de onde as props vêm. Quando der, receba o que precisa por props (um `itens` em array, `cabecalho` e `rodape` como slots), compartilhe estado por contexto ou use uma render prop (veja M48). Reserve `Children` para casos em que você realmente precisa percorrer ou contar os filhos. A API segue disponível; confira o status atual em react.dev.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "cloneElement falha em silêncio",
        texto:
          "As props novas vencem as existentes. Se o filho é um componente que não repassa a prop nova ao seu nó interno, nada acontece e nenhum erro avisa. Clonar um fragment também não leva a prop para dentro dele.",
      },
    ],
    armadilhas: [
      "Usar `children.map(...)` ou `children.length`: com um filho só, `children` não é array; sem filhos, é `undefined`.",
      "Esperar que `Children.count` devolva o número de itens visíveis: `null` e `false` contam como nós. Use `Children.toArray(children).length`.",
      "Contar com os fragments: `<>…</>` é um filho só, e `Children` não olha dentro dele.",
      "Chamar `cloneElement` em qualquer filho, inclusive texto, sem `isValidElement`.",
    ],
    autoteste: [
      {
        pergunta: "Por que `children.map` pode quebrar, e o que usar no lugar?",
        resposta:
          "Porque `children` pode ser um elemento único, texto, `null` ou uma lista, e só a lista tem `map`. Use `Children.map`, `Children.forEach` ou `Children.toArray`, que aceitam todos os casos e atribuem keys.",
      },
      {
        pergunta: "Por que a documentação desencoraja `Children` com `cloneElement`?",
        resposta:
          "Porque acopla o componente à estrutura exata dos filhos (fragments e wrappers quebram a lógica) e esconde de onde as props vêm. Props explícitas, contexto ou render props deixam o contrato claro.",
      },
    ],
  },
  en: {
    titulo: "The React.Children API",
    pergunta: "What is the React.Children API?",
    porqueEsteMetodo:
      "Handling `children` safely is a procedure: find out what it can be, pick the right `Children` function, take care of keys and know the limits. A step-by-step playbook avoids the classic mistakes with `children.map`.",
    resposta30s:
      "`React.Children` is a set of utilities (`map`, `forEach`, `count`, `toArray` and `only`) to **inspect and transform `props.children`** safely. `children` can be a single element, text, a number, `null`, `false` or a list, so `children.map` breaks with a single child; `Children.map` and `Children.toArray` handle every case and **assign keys**. The documentation **discourages** this API: prefer explicit composition (props, slots, context).",
    blocos: [
      {
        tipo: "passos",
        titulo: "The procedure",
        passos: [
          {
            titulo: "1. Find out what `children` can be",
            texto:
              "An element (`<A />`), text, a number, `null`, `undefined`, a boolean, an array or a mix of those. A single child **is not an array**, and with no children the value is `undefined`. That is why `children.map(...)` fails with “`map` is not a function”. **Sign:** the error shows up only in some uses of the component.",
          },
          {
            titulo: "2. Pick the right function",
            texto:
              "`Children.map` to transform, `forEach` to walk, `count` to count, `toArray` to get a flat array and `only` to require exactly one element (see the table). **Criterion:** do you need a list you can filter or reorder? `toArray`. Only transforming during render? `map`.",
          },
          {
            titulo: "3. Take care of keys",
            texto:
              "`Children.map` and `Children.toArray` assign keys derived from the position (or the original key), so you do not need to repeat them on the elements you return. **Sign:** the “each child in a list should have a unique key” warning does not appear.",
          },
          {
            titulo: "4. Inject props with `cloneElement`",
            texto:
              "Check `isValidElement(child)` first, because the child may be text, and call `cloneElement(child, { compact: true })`, which copies the element with the new props on top of the existing ones. **Criterion:** only elements are cloned; text and `null` pass through.",
          },
          {
            titulo: "5. Know the limits",
            texto:
              "Children are **elements**, not what they render: you see `<Button />`, not the `<button>` inside it. **Fragments are not opened**: `<>…</>` counts as a single child. `Children.count` counts `null` and `false` as nodes, while `toArray` drops them; that is why `toArray(children).length` is usually the number you expect. **Problem sign:** the component works until someone wraps the children in another component.",
          },
          {
            titulo: "6. Consider the alternative",
            texto:
              "Explicit composition: named props (`header`, `footer`), `children` rendered untouched, context to share data with descendants (the compound components pattern), render props, or an `items` array instead of children. The documentation treats `Children` and `cloneElement` as rarely recommended APIs, because they make code fragile: check react.dev.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "The `Children` functions",
        colunas: ["Function", "What it does", "Note"],
        linhas: [
          [
            "`Children.map(children, fn)`",
            "Transforms each child and returns a flat array",
            "Assigns keys; if `children` is `null` or `undefined`, it returns the same value",
          ],
          ["`Children.forEach(children, fn)`", "Walks each child, returning nothing", "Useful to validate or collect"],
          ["`Children.count(children)`", "Counts the nodes", "`null` and `false` count; a fragment counts as one"],
          [
            "`Children.toArray(children)`",
            "Returns a flat array, with keys, without empty nodes",
            "A good base for filtering, sorting and reordering",
          ],
          [
            "`Children.only(children)`",
            "Returns the only element; throws if it is text, a list or empty",
            "For components that require exactly one child",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Counting and injecting a prop into the children",
        legenda: "TSX",
        codigo: [
          'import { Children, cloneElement, isValidElement, type ReactNode } from "react";',
          "",
          "export function Toolbar({ children }: { children: ReactNode }) {",
          "  const total = Children.toArray(children).length; // ignores null and false",
          "  return (",
          '    <div role="group" aria-label={`${total} actions`}>',
          "      {Children.map(children, (child) =>",
          "        isValidElement<{ compact?: boolean }>(child) ? cloneElement(child, { compact: true }) : child,",
          "      )}",
          "    </div>",
          "  );",
          "}",
          "",
          "// usage: with canDelete = false, total = 1 (the `false` is dropped)",
          "<Toolbar>",
          "  <Button>Save</Button>",
          "  {canDelete && <Button>Delete</Button>}",
          "</Toolbar>;",
        ].join("\n"),
        nota: "A `<>…</>` among the children would count as a single child and would not pass `compact` to the buttons inside it.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Prefer explicit composition",
        texto:
          "`Children` and `cloneElement` couple the component to the exact structure of its children and hide where props come from. Whenever you can, receive what you need through props (an `items` array, `header` and `footer` as slots), share state through context or use a render prop (see M48). Keep `Children` for cases where you really need to walk or count the children. The API is still available; check its current status on react.dev.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "cloneElement fails silently",
        texto:
          "The new props win over the existing ones. If the child is a component that does not pass the new prop on to its inner node, nothing happens and no error warns you. Cloning a fragment does not carry the prop inside it either.",
      },
    ],
    armadilhas: [
      "Using `children.map(...)` or `children.length`: with a single child, `children` is not an array; with none, it is `undefined`.",
      "Expecting `Children.count` to return the number of visible items: `null` and `false` count as nodes. Use `Children.toArray(children).length`.",
      "Counting with fragments: `<>…</>` is a single child, and `Children` does not look inside it.",
      "Calling `cloneElement` on any child, including text, without `isValidElement`.",
    ],
    autoteste: [
      {
        pergunta: "Why can `children.map` break, and what should you use instead?",
        resposta:
          "Because `children` can be a single element, text, `null` or a list, and only a list has `map`. Use `Children.map`, `Children.forEach` or `Children.toArray`, which accept every case and assign keys.",
      },
      {
        pergunta: "Why does the documentation discourage `Children` with `cloneElement`?",
        resposta:
          "Because it couples the component to the exact structure of its children (fragments and wrappers break the logic) and hides where props come from. Explicit props, context or render props make the contract clear.",
      },
    ],
  },
};
