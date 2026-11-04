import type { Pergunta } from "../../tipos";

// G19 · Reuso versus complexidade
export const g019: Pergunta = {
  numero: 319,
  modulo: "glassdoor-react",
  metodo: "whys",
  pt: {
    titulo: "Reuso versus complexidade",
    pergunta: "Reusabilidade versus complexidade: como você equilibra os dois em componentes React?",
    porqueEsteMetodo:
      "Não existe receita única: o equilíbrio só se decide entendendo por que o reuso ajuda, por que passa a custar e o que muda quando você troca flags por composição. A cadeia de porquês leva a critérios práticos em vez de regras de bolso.",
    resposta30s:
      "Reutilizar vale quando as partes **mudam pelos mesmos motivos**; fora disso você troca duplicação por **acoplamento**. Um componente com muitas props booleanas e condicionais é sinal de abstração que cresceu demais. Prefira **composição** (`children`, slots, componentes compostos) e **hooks** para a lógica, espere o **terceiro uso** antes de abstrair e aceite duplicar quando os casos podem divergir.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que reutilizar componentes ajuda?",
            resposta:
              "Porque o comportamento fica em **um lugar**: você corrige uma vez, evolui uma vez e testa uma vez, e a interface fica consistente (o mesmo botão, a mesma validação, o mesmo foco). Menos código também é menos para ler. É o que justifica um design system (veja L180).",
          },
          {
            pergunta: "Por que o reuso passa a prejudicar?",
            resposta:
              "Porque um componente que serve a muitos usos acumula **props e condicionais**: `compacto`, `semBorda`, `mostrarIcone`, `variante`. Cada uso exercita só um pedaço, as combinações viram um espaço enorme (e parte delas é impossível), ler e tipar fica difícil e **mudar para um uso arrisca quebrar outro**. O custo de cada flag é pago por todos os usos.",
          },
          {
            pergunta: "Por que isso acontece tantas vezes?",
            resposta:
              "Porque duas coisas **parecem iguais hoje** (o mesmo JSX) e se assume que mudam juntas. Parecer igual não é ter o **mesmo motivo para mudar**: uma tela segue uma regra de negócio, a outra segue a marca. Ao unificar cedo você as acopla e, quando divergem, entram flags para desfazer a união. Por isso a regra de três: com dois exemplos você adivinha a abstração; com três, vê o que é comum de fato.",
          },
          {
            pergunta: "Por que composição e hooks equilibram melhor?",
            resposta:
              "Porque deixam o componente com **um trabalho só** e passam as variações para quem usa: `children` e props que recebem elementos (slots) em vez de flags, componentes compostos para partes relacionadas e hooks para a lógica sem interface (`useFiltro`, `usePaginacao`). A API fica pequena, e cada uso monta o que precisa sem que a abstração tenha de prever.",
          },
          {
            pergunta: "Por que, e quando, separar lógica de apresentação?",
            resposta:
              "Quando a lógica é reaproveitada, testada à parte ou bem mais complexa que o visual: extraia para um hook e deixe o componente só desenhar. Não crie a camada por reflexo: um componente pequeno que mistura os dois, usado num lugar só, é mais fácil de ler do que três arquivos que apenas repassam props (veja L60 e G03).",
          },
        ],
        causaRaiz:
          "Reutilizar é uma **aposta** de que duas coisas vão mudar juntas. Se a aposta está certa, você economiza; se está errada, você pagou **acoplamento**. Decida pelo **motivo de mudar**, não pela aparência do código, e prefira a abstração que você já viu três vezes.",
      },
      {
        tipo: "codigo",
        titulo: "De flags para composição",
        legenda: "JSX",
        codigo: `// Reuso que inchou: cada uso novo vira mais uma prop
<Cartao titulo="Pedido" compacto semBorda mostrarAcoes acoesNaEsquerda icone="caixa" />

// Composição: o Cartao cuida só do que é comum; quem usa monta o resto
function Cartao({ cabecalho, rodape, children }) {
  return (
    <section className="cartao">
      {cabecalho && <header>{cabecalho}</header>}
      <div>{children}</div>
      {rodape && <footer>{rodape}</footer>}
    </section>
  );
}

<Cartao cabecalho={<h2>Pedido</h2>} rodape={<button>Pagar</button>}>
  <ListaDeItens />
</Cartao>`,
        nota: "O `Cartao` não sabe o que vai dentro: novos usos não pedem nova prop, e cada uso muda sem afetar os outros.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Critérios práticos, não receita",
        texto:
          "Antes de abstrair, pergunte: (1) isso já apareceu **três vezes**? (2) as cópias mudam **pelo mesmo motivo**? (3) a API do componente fica **menor** que o código duplicado? (4) alguém novo entende o uso em segundos? Sinais de excesso (heurística, não lei): duas ou três props booleanas que se combinam, props que só um uso passa, condicionais que testam o “modo”. Nesse caso, quebre em componentes menores ou troque flags por composição. Componentes de **design system** pedem mais rigor de API do que os de **funcionalidade**, que podem ficar perto de quem os usa.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Duplicar de propósito também é uma decisão",
        texto:
          "Duplicar pouco, e perto, custa menos do que uma abstração errada, porque é fácil de desfazer. Faça-o de forma consciente: no mesmo módulo, com um comentário, e reveja ao chegar ao terceiro uso. O contrário também vale: copiar um trecho com **bug ou regra de negócio** para vários lugares gera correções em dobro. Duplique o que muda por motivos diferentes; centralize a regra que deve ser única.",
      },
    ],
    armadilhas: [
      "Criar o componente genérico no primeiro uso “porque vai servir depois”: você adivinha a abstração errada.",
      "Resolver cada novo caso com mais uma prop booleana ou uma `variant` com condicionais aninhadas dentro do componente.",
      "Extrair todo trecho repetido, mesmo que só pareça igual, acoplando partes que evoluem por razões diferentes.",
      "Criar camadas (container, hook, componente, tipo) para um componente usado em um lugar só.",
    ],
    autoteste: [
      {
        pergunta: "O que é a regra de três e por que ela ajuda?",
        resposta:
          "Esperar o terceiro uso para abstrair. Com dois casos você adivinha o que é comum; com três você vê o padrão real e o que varia, e erra menos.",
      },
      {
        pergunta: "Um componente tem seis props booleanas. O que você faz?",
        resposta:
          "Verifico se são usos diferentes dentro de um só componente. Divido em componentes menores ou troco as flags por composição (`children`, slots, componentes compostos), e movo a lógica compartilhada para um hook.",
      },
    ],
  },
  en: {
    titulo: "Reusability vs complexity",
    pergunta: "Reusability vs complexity: how do you balance them in React components?",
    porqueEsteMetodo:
      "There is no single recipe: the balance is decided by understanding why reuse helps, why it starts to cost and what changes when you swap flags for composition. The chain of whys leads to practical criteria instead of rules of thumb.",
    resposta30s:
      "Reuse pays off when the pieces **change for the same reasons**; otherwise you trade duplication for **coupling**. A component with many boolean props and conditionals is a sign of an abstraction that grew too big. Prefer **composition** (`children`, slots, compound components) and **hooks** for logic, wait for the **third use** before abstracting and accept duplication when the cases may diverge.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does reusing components help?",
            resposta:
              "Because the behavior lives in **one place**: you fix it once, evolve it once and test it once, and the interface stays consistent (the same button, the same validation, the same focus). Less code is also less to read. This is what justifies a design system (see L180).",
          },
          {
            pergunta: "Why does reuse start to hurt?",
            resposta:
              "Because a component that serves many uses accumulates **props and conditionals**: `compact`, `borderless`, `showIcon`, `variant`. Each use exercises only a slice, the combinations become a huge space (and some of them are impossible), reading and typing get hard and **changing it for one use risks breaking another**. The cost of every flag is paid by all the uses.",
          },
          {
            pergunta: "Why does this happen so often?",
            resposta:
              "Because two things **look the same today** (the same JSX) and we assume they change together. Looking the same is not having the **same reason to change**: one screen follows a business rule, the other follows the brand. By unifying early you couple them and, when they diverge, flags enter to undo the union. Hence the rule of three: with two examples you guess the abstraction; with three, you see what is truly common.",
          },
          {
            pergunta: "Why do composition and hooks balance it better?",
            resposta:
              "Because they leave the component with **one job** and push the variations to the caller: `children` and props that take elements (slots) instead of flags, compound components for related parts and hooks for logic without UI (`useFilter`, `usePagination`). The API stays small, and each use assembles what it needs without the abstraction having to foresee it.",
          },
          {
            pergunta: "Why, and when, separate logic from presentation?",
            resposta:
              "When the logic is reused, tested on its own or far more complex than the visuals: extract it into a hook and let the component only draw. Do not create the layer by reflex: a small component that mixes both, used in one place, is easier to read than three files that merely pass props along (see L60 and G03).",
          },
        ],
        causaRaiz:
          "Reuse is a **bet** that two things will change together. If the bet is right, you save; if it is wrong, you paid **coupling**. Decide by the **reason to change**, not by how the code looks, and prefer the abstraction you have already seen three times.",
      },
      {
        tipo: "codigo",
        titulo: "From flags to composition",
        legenda: "JSX",
        codigo: `// Reuse that bloated: every new use becomes one more prop
<Card title="Order" compact borderless showActions actionsOnLeft icon="box" />

// Composition: Card handles only what is common; the caller assembles the rest
function Card({ header, footer, children }) {
  return (
    <section className="card">
      {header && <header>{header}</header>}
      <div>{children}</div>
      {footer && <footer>{footer}</footer>}
    </section>
  );
}

<Card header={<h2>Order</h2>} footer={<button>Pay</button>}>
  <ItemList />
</Card>`,
        nota: "`Card` does not know what goes inside: new uses do not need a new prop, and each use can change without affecting the others.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Practical criteria, not a recipe",
        texto:
          "Before abstracting, ask: (1) has this appeared **three times**? (2) do the copies change **for the same reason**? (3) will the component’s API be **smaller** than the duplicated code? (4) can a newcomer understand the usage in seconds? Signs of excess (a heuristic, not a law): two or three boolean props that combine, props that only one use passes, conditionals that test the “mode”. In that case, break it into smaller components or swap flags for composition. **Design system** components deserve more API rigor than **feature** components, which can stay close to the code that uses them.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Duplicating on purpose is also a decision",
        texto:
          "Duplicating a little, and nearby, costs less than a wrong abstraction because it is easy to undo. Do it consciously: in the same module, with a comment, and revisit it at the third use. The reverse also holds: copying a snippet with a **bug or a business rule** to several places yields double fixes. Duplicate what changes for different reasons; centralize the rule that must be unique.",
      },
    ],
    armadilhas: [
      "Creating the generic component at the first use “because it will be useful later”: you guess the wrong abstraction.",
      "Solving each new case with one more boolean prop or a `variant` with nested conditionals inside the component.",
      "Extracting every repeated snippet, even if it merely looks the same, coupling parts that evolve for different reasons.",
      "Creating layers (container, hook, component, type) for a component used in only one place.",
    ],
    autoteste: [
      {
        pergunta: "What is the rule of three and why does it help?",
        resposta:
          "Wait for the third use before abstracting. With two cases you guess what is common; with three you see the real pattern and what varies, and you get it wrong less often.",
      },
      {
        pergunta: "A component has six boolean props. What do you do?",
        resposta:
          "I check whether they are different uses squeezed into one component. I split it into smaller components or swap the flags for composition (`children`, slots, compound components), and move the shared logic into a hook.",
      },
    ],
  },
};
