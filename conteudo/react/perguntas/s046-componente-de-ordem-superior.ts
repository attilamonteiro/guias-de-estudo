import type { Pergunta } from "../../tipos";

// S46 · Componente de ordem superior
export const s046: Pergunta = {
  numero: 646,
  modulo: "simplilearn-padroes",
  metodo: "firstprinciples",
  pt: {
    titulo: "Componente de ordem superior",
    pergunta: "O que é um componente de ordem superior no React?",
    porqueEsteMetodo:
      "Um HOC parece um truque com nome estranho até você ver cada peça nascer de um problema: repetição, props perdidas, nome sumido, estado que reinicia. Partir da cópia e consertar uma falha por vez mostra por que ele é como é.",
    resposta30s:
      "Um **componente de ordem superior (HOC)** é uma **função que recebe um componente e devolve outro** com comportamento extra, sem alterar o original: `const PerfilProtegido = comUsuario(Perfil)`. O wrapper executa a lógica comum (autenticação, log, dados, estilo), **repassa as props restantes** e injeta as novas, e é um padrão de composição, não um recurso do React. Hoje os **hooks personalizados** cobrem a maior parte dos casos com menos camadas.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo um HOC, uma falha por vez",
        passos: [
          {
            titulo: "0. O que se quer",
            texto:
              "Compartilhar um comportamento entre vários componentes (exigir login, registrar métricas, injetar dados, aplicar tema) sem copiá-lo em cada um e sem mexer no código de cada um.",
          },
          {
            titulo: "1. A versão mais simples: copiar e colar",
            texto:
              "Cada tela repete a verificação de login. → Quebra: a regra se espalha por dezenas de arquivos, e uma mudança (um novo redirecionamento) vira dezenas de edições, com esquecimentos.",
          },
          {
            titulo: "2. Uma função que recebe um componente e devolve outro",
            texto:
              "`comUsuario(Perfil)` devolve um componente novo que faz a verificação e, estando tudo certo, renderiza o `Perfil`. Isso é um HOC: **componente → componente**, do mesmo jeito que uma função de ordem superior recebe ou devolve funções. O original não é alterado; o novo o envolve (composição). → Quebra: se o wrapper não repassar as props, o `Perfil` perde tudo o que o chamador passou.",
          },
          {
            titulo: "3. Repassar as props e injetar as novas",
            texto:
              "O wrapper recebe `props`, espalha-as no original (`{...props}`) e acrescenta o que injeta (`usuario`). → Quebra: se o chamador já passa uma prop com o mesmo nome, uma delas é sobrescrita em silêncio. Conserto: nomes específicos para o que o HOC injeta, e a ordem do spread escolhida de propósito (veja S28).",
          },
          {
            titulo: "4. Nome, estáticos e refs",
            texto:
              "No DevTools o wrapper aparece sem nome útil: defina `displayName` como `comUsuario(Perfil)`. As propriedades estáticas do original (como `Perfil.opcoes`) não passam sozinhas: copie-as (a biblioteca `hoist-non-react-statics` existe para isso). Com `ref`, versões antigas exigiam `forwardRef` no wrapper; nas recentes, `ref` é prop comum em componentes de função e passa pelo `{...props}`. Confira react.dev.",
          },
          {
            titulo: "5. Crie o HOC uma vez, nunca dentro do render",
            texto:
              "Chamar `comUsuario(Perfil)` dentro de um componente cria um tipo de componente novo a cada renderização. O React vê um tipo diferente, desmonta a subárvore e monta outra, e o state interno se perde. → Conserto: crie o componente envolvido uma vez, no escopo do módulo.",
          },
          {
            titulo: "6. O preço e o sucessor",
            texto:
              "Camadas empilhadas (o chamado wrapper hell no DevTools), props que aparecem “do nada” (de onde vem `usuario`?), colisões de nomes e tipos complicados no TypeScript. Os **hooks personalizados** resolvem a maior parte: compartilham lógica sem acrescentar camada, e o componente declara o que usa. O HOC continua útil para envolver a renderização (um provedor, um error boundary, uma rota protegida), com classes (que não usam hooks) e em bibliotecas mais antigas.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um HOC completo, com o erro mais comum",
        legenda: "JSX",
        codigo: `export function comUsuario(Alvo) {
  function ComUsuario(props) {
    const usuario = useUsuarioAtual(); // lógica extra, vinda de um hook
    if (!usuario) return <p>Entre para continuar.</p>;
    return <Alvo {...props} usuario={usuario} />; // repassa o resto e injeta a nova prop
  }
  ComUsuario.displayName = "comUsuario(" + (Alvo.displayName || Alvo.name) + ")";
  return ComUsuario;
}

// Certo: crie o componente envolvido uma vez, no escopo do módulo
const PerfilProtegido = comUsuario(Perfil);

// Errado: dentro do render cria um tipo novo a cada renderização e remonta tudo
function Pagina() {
  const Protegido = comUsuario(Perfil);
  return <Protegido />;
}`,
        nota: "Como `usuario` vem depois do `{...props}`, a prop injetada vence uma prop de mesmo nome vinda do chamador.",
      },
      {
        tipo: "tabela",
        titulo: "Usos clássicos de um HOC e o que usar hoje",
        colunas: ["Uso", "O que o wrapper faz", "Exemplo", "Alternativa hoje"],
        linhas: [
          [
            "Autenticação e autorização",
            "Decide se renderiza o componente ou um aviso ou redirecionamento",
            "`comUsuario(Perfil)`",
            "Hook `useUsuario` e um componente de rota protegida",
          ],
          [
            "Injeção de dados",
            "Busca ou assina os dados e os passa como props",
            "`connect` do Redux e `withRouter` (React Router antigo)",
            "Hooks como `useSelector`, `useNavigate` e os de consulta de dados",
          ],
          [
            "Log e métricas",
            "Registra montagem, props ou erros do componente",
            "`comLog(Tela)`",
            "Um hook com `useEffect`",
          ],
          [
            "Estilo e tema",
            "Injeta classes, estilos ou o tema",
            "`withStyles` em bibliotecas de estilo mais antigas",
            "Context com hook, CSS Modules ou as bibliotecas de estilo atuais",
          ],
          [
            "Carregamento e erro",
            "Mostra um indicador ou captura falhas ao redor do componente",
            "`comCarregamento(Lista)`",
            "`<Suspense>` e error boundaries",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A mesma lógica com um hook personalizado",
        legenda: "JSX",
        codigo: `function Perfil() {
  const usuario = useUsuarioAtual(); // a dependência fica explícita no componente
  if (!usuario) return <p>Entre para continuar.</p>;
  return <h1>{usuario.nome}</h1>;
}`,
        nota: "Sem camada extra e sem prop injetada: quem lê o componente vê de onde vem o `usuario` (veja C21).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "HOC ou hook?",
        texto:
          "Prefira **hooks personalizados** para compartilhar lógica e estado: não acrescentam camadas à árvore e deixam a dependência explícita. Use um **HOC** quando precisa envolver a renderização do componente (um provedor, um error boundary, uma rota protegida), quando o código usa classes ou quando a biblioteca já o oferece. Se escrever um: não altere o original, repasse as props com `{...props}`, defina o `displayName` e crie-o uma vez, fora do render.",
      },
    ],
    armadilhas: [
      "Criar o HOC dentro do render: o tipo do componente muda a cada renderização, o React remonta a subárvore e o state se perde.",
      "Esquecer o `{...props}` no wrapper: o componente envolvido perde as props do chamador.",
      "Alterar o componente original (por exemplo, trocando métodos do seu `prototype`) em vez de envolvê-lo: quebra a composição e esconde o comportamento.",
      "Injetar props com nomes genéricos (`data`, `user`): elas colidem com as do chamador ou com as de outro HOC empilhado. Use nomes específicos.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre um HOC e um componente comum?",
        resposta:
          "Um componente comum recebe props e devolve elementos (a interface). Um HOC é uma função que recebe um componente e devolve outro componente, com comportamento acrescentado. Ele não é renderizado: ele produz o componente que será renderizado.",
      },
      {
        pergunta: "Por que os hooks substituíram boa parte dos HOCs?",
        resposta:
          "Porque compartilham lógica e estado sem acrescentar camadas à árvore, sem props injetadas e sem colisão de nomes, e deixam a dependência explícita no componente. O HOC ainda tem lugar para envolver a renderização, com classes e em bibliotecas antigas.",
      },
    ],
  },
  en: {
    titulo: "Higher-order component",
    pergunta: "What is a higher-order component in React?",
    porqueEsteMetodo:
      "A HOC looks like a trick with an odd name until you watch each piece come from a problem: repetition, lost props, a missing name, state that resets. Starting from copy and paste and fixing one failure at a time shows why it is the way it is.",
    resposta30s:
      "A **higher-order component (HOC)** is a **function that takes a component and returns another** with extra behavior, without changing the original: `const ProtectedProfile = withUser(Profile)`. The wrapper runs the shared logic (authentication, logging, data, styling), **passes the remaining props through** and injects the new ones, and it is a composition pattern, not a React feature. Today **custom hooks** cover most cases with fewer layers.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building a HOC, one failure at a time",
        passos: [
          {
            titulo: "0. What we want",
            texto:
              "Share a behavior across several components (require login, record metrics, inject data, apply a theme) without copying it into each one and without touching the code of each one.",
          },
          {
            titulo: "1. The simplest version: copy and paste",
            texto:
              "Every screen repeats the login check. → Breaks: the rule spreads across dozens of files, and a change (a new redirect) becomes dozens of edits, with some forgotten.",
          },
          {
            titulo: "2. A function that takes a component and returns another",
            texto:
              "`withUser(Profile)` returns a new component that does the check and, if all is well, renders `Profile`. That is a HOC: **component → component**, the same way a higher-order function takes or returns functions. The original is not changed; the new one wraps it (composition). → Breaks: if the wrapper does not pass the props through, `Profile` loses everything the caller passed.",
          },
          {
            titulo: "3. Pass the props through and inject the new ones",
            texto:
              "The wrapper receives `props`, spreads them onto the original (`{...props}`) and adds what it injects (`user`). → Breaks: if the caller already passes a prop with the same name, one of them is silently overwritten. Fix: specific names for what the HOC injects, and the order of the spread chosen on purpose (see S28).",
          },
          {
            titulo: "4. Name, statics and refs",
            texto:
              "In DevTools the wrapper shows up with no useful name: set `displayName` to `withUser(Profile)`. The original’s static properties (such as `Profile.options`) do not carry over on their own: copy them (the `hoist-non-react-statics` library exists for that). With `ref`, older versions required `forwardRef` on the wrapper; in recent ones, `ref` is a plain prop in function components and goes through `{...props}`. Check react.dev.",
          },
          {
            titulo: "5. Create the HOC once, never inside render",
            texto:
              "Calling `withUser(Profile)` inside a component creates a new component type on every render. React sees a different type, unmounts the subtree and mounts another, and the inner state is lost. → Fix: create the wrapped component once, at module scope.",
          },
          {
            titulo: "6. The price and the successor",
            texto:
              "Stacked layers (so-called wrapper hell in DevTools), props that appear “out of nowhere” (where does `user` come from?), name collisions and complicated types in TypeScript. **Custom hooks** solve most of it: they share logic without adding a layer, and the component declares what it uses. A HOC remains useful for wrapping rendering (a provider, an error boundary, a protected route), with classes (which cannot use hooks) and in older libraries.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A complete HOC, with the most common mistake",
        legenda: "JSX",
        codigo: `export function withUser(Target) {
  function WithUser(props) {
    const user = useCurrentUser(); // extra logic, coming from a hook
    if (!user) return <p>Sign in to continue.</p>;
    return <Target {...props} user={user} />; // passes the rest through and injects the new prop
  }
  WithUser.displayName = "withUser(" + (Target.displayName || Target.name) + ")";
  return WithUser;
}

// Right: create the wrapped component once, at module scope
const ProtectedProfile = withUser(Profile);

// Wrong: inside render it creates a new type on every render and remounts everything
function Page() {
  const Protected = withUser(Profile);
  return <Protected />;
}`,
        nota: "Since `user` comes after `{...props}`, the injected prop wins over a prop of the same name coming from the caller.",
      },
      {
        tipo: "tabela",
        titulo: "Classic uses of a HOC and what to use today",
        colunas: ["Use", "What the wrapper does", "Example", "Alternative today"],
        linhas: [
          [
            "Authentication and authorization",
            "Decides whether to render the component or a notice or redirect",
            "`withUser(Profile)`",
            "A `useUser` hook and a protected-route component",
          ],
          [
            "Data injection",
            "Fetches or subscribes to the data and passes it as props",
            "Redux’s `connect` and `withRouter` (older React Router)",
            "Hooks such as `useSelector`, `useNavigate` and data-fetching hooks",
          ],
          [
            "Logging and metrics",
            "Records the component’s mount, props or errors",
            "`withLogging(Screen)`",
            "A hook with `useEffect`",
          ],
          [
            "Style and theme",
            "Injects classes, styles or the theme",
            "`withStyles` in older styling libraries",
            "Context with a hook, CSS Modules or current styling libraries",
          ],
          [
            "Loading and errors",
            "Shows an indicator or catches failures around the component",
            "`withLoading(List)`",
            "`<Suspense>` and error boundaries",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The same logic with a custom hook",
        legenda: "JSX",
        codigo: `function Profile() {
  const user = useCurrentUser(); // the dependency is explicit in the component
  if (!user) return <p>Sign in to continue.</p>;
  return <h1>{user.name}</h1>;
}`,
        nota: "No extra layer and no injected prop: whoever reads the component sees where `user` comes from (see C21).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "HOC or hook?",
        texto:
          "Prefer **custom hooks** to share logic and state: they add no layers to the tree and make the dependency explicit. Use a **HOC** when you need to wrap the component’s rendering (a provider, an error boundary, a protected route), when the code uses classes or when the library already offers it. If you write one: do not change the original, pass the props through with `{...props}`, set the `displayName` and create it once, outside render.",
      },
    ],
    armadilhas: [
      "Creating the HOC inside render: the component type changes on every render, React remounts the subtree and the state is lost.",
      "Forgetting `{...props}` in the wrapper: the wrapped component loses the caller’s props.",
      "Changing the original component (for example, swapping methods on its `prototype`) instead of wrapping it: it breaks composition and hides the behavior.",
      "Injecting props with generic names (`data`, `user`): they collide with the caller’s or with those of another stacked HOC. Use specific names.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between a HOC and an ordinary component?",
        resposta:
          "An ordinary component takes props and returns elements (the interface). A HOC is a function that takes a component and returns another component, with added behavior. It is not rendered itself: it produces the component that will be rendered.",
      },
      {
        pergunta: "Why did hooks replace a good part of HOCs?",
        resposta:
          "Because they share logic and state without adding layers to the tree, without injected props and without name collisions, and they make the dependency explicit in the component. A HOC still has a place for wrapping rendering, with classes and in older libraries.",
      },
    ],
  },
};
