import type { Pergunta } from "../../tipos";

// L122 · Ativar o React Compiler
export const l122: Pergunta = {
  numero: 122,
  modulo: "linkedin-compiler",
  metodo: "playbook",
  pt: {
    titulo: "Ativar o React Compiler",
    pergunta: "Como você habilita o React Compiler?",
    porqueEsteMetodo:
      "Habilitar o compilador não é só instalar um plugin: é uma adoção gradual com verificação a cada etapa. O playbook mostra a ordem (compatibilidade, lint, plugin, escopo pequeno, medição, ampliação) e o sinal de que cada passo deu certo.",
    resposta30s:
      "Verifique a **compatibilidade** com a sua versão do React e do bundler, ligue as **regras de ESLint do compilador** e instale o **plugin** (Babel ou a opção do seu framework). Adote **aos poucos**: comece por diretórios ou componentes específicos (**opt-in**), meça com o Profiler, corrija as violações e amplie. Componentes problemáticos podem sair com a diretiva `use no memo`; os detalhes mudam, então confira react.dev.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: da compatibilidade à adoção total",
        passos: [
          {
            titulo: "Verifique a compatibilidade",
            texto:
              "Confira em react.dev quais versões do React e do bundler o compilador aceita (versões mais antigas do React podem exigir um pacote de apoio e uma opção de alvo). A ferramenta `react-compiler-healthcheck` estima quantos componentes da base ele consegue compilar. Sinal: você sabe se há algum bloqueio antes de mexer na configuração.",
          },
          {
            titulo: "Ligue o lint primeiro",
            texto:
              "As regras de ESLint do compilador (nas versões recentes vêm com o plugin oficial dos Hooks; confira react.dev) apontam violações das regras do React: mutação de props, leitura de ref na renderização, efeito colateral na renderização. Corrija as que fizerem sentido: elas são bugs em potencial, com ou sem compilador.",
          },
          {
            titulo: "Instale e configure o plugin",
            texto:
              "Adicione o plugin do compilador à cadeia do Babel (ele precisa rodar antes dos demais plugins) ou ative a opção do seu framework (Next.js e outros têm uma). A configuração muda de ferramenta para ferramenta; siga a página de instalação em react.dev.",
          },
          {
            titulo: "Adote por partes (opt-in)",
            texto:
              "Comece no modo de anotação (`compilationMode` com o valor `annotation`), em que só as funções marcadas com a diretiva `use memo` são compiladas, ou limite o compilador a diretórios específicos (opção `sources`). Escolha primeiro componentes simples, bem testados e que renderizam muito.",
          },
          {
            titulo: "Meça e valide",
            texto:
              "Rode os testes, use a aplicação e compare o Profiler antes e depois. O React DevTools marca com um selo os componentes compilados. Sinal: menos renderizações onde havia desperdício e nenhum comportamento alterado.",
          },
          {
            titulo: "Corrija e amplie",
            texto:
              "Para cada componente pulado ou problemático, corrija a violação (torne o código puro) e só então inclua mais diretórios. Quando a maior parte da base estiver pronta, passe ao modo normal, que compila o que consegue e deixa de lado o que não consegue. Se um componente quebrar, a diretiva `use no memo` o exclui como medida temporária, com um comentário e uma tarefa para consertá-lo.",
          },
          {
            titulo: "Mantenha",
            texto:
              "Deixe o lint do compilador no CI, para o código novo seguir as regras, e acompanhe as notas de versão: a ferramenta evolui.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Plugin em modo de anotação",
        legenda: "babel.config.js",
        codigo: `// O compilador deve ser o primeiro plugin da cadeia
module.exports = {
  plugins: [
    [
      "babel-plugin-react-compiler",
      { compilationMode: "annotation" }, // só compila quem tiver a diretiva
    ],
    // ...demais plugins depois
  ],
};`,
        nota: "Exemplo para Babel. Em Vite, Next.js e outros a configuração muda; os nomes das opções e dos pacotes podem evoluir, então siga react.dev.",
      },
      {
        tipo: "codigo",
        titulo: "Entrar e sair do compilador por função",
        legenda: "JSX",
        codigo: `// Com compilationMode "annotation", só entra quem pedir
function CartaoDoProduto({ produto }) {
  "use memo";
  const preco = formatarPreco(produto.preco);
  return <article>{produto.nome}: {preco}</article>;
}

// No modo normal, quem der problema sai com a diretiva contrária
function PainelAntigo({ dados }) {
  "use no memo";
  dados.lido = true; // muta as props: o compilador não consegue garantir
  return <Painel dados={dados} />;
}`,
        nota: "`formatarPreco` e `Painel` são ilustrativos. A diretiva `use no memo` é uma saída temporária: o certo é remover a mutação e voltar a compilar o componente.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Adoção incremental",
        texto:
          "Habilite no menor escopo útil, prove que funciona e amplie. O progresso se mede em componentes compilados sem violações e sem mudança de comportamento, não pela configuração ligada. Se algo der errado em produção, o caminho de volta é desligar o plugin ou a diretiva, sem tocar na lógica.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Limitações que valem saber",
        texto:
          "O compilador trabalha com componentes de função e Hooks (não com componentes de classe), pula o que viola as regras do React (mutação, leitura de refs na renderização, efeitos colaterais na renderização) e pode não se dar bem com bibliotecas que dependem de mutação ou de identidades instáveis. Por padrão ele pula **em silêncio**: use o lint e o selo do DevTools para saber o que foi compilado. Os detalhes mudam entre versões; confira react.dev.",
      },
    ],
    armadilhas: [
      "Ligar para a base inteira de uma vez: se algo mudar de comportamento, ninguém sabe onde procurar.",
      "Ignorar o lint: o compilador pula em silêncio o que viola as regras, e você acha que está otimizado sem estar.",
      "Colocar o plugin do compilador depois de outros plugins do Babel: ele precisa receber o código original.",
      "Concluir que funcionou sem medir: confirme com o Profiler e com os testes.",
    ],
    autoteste: [
      {
        pergunta: "Como adotar o React Compiler numa aplicação existente sem risco?",
        resposta:
          "Em etapas: verificar a compatibilidade, ligar o lint, instalar o plugin em modo de anotação ou limitado a diretórios, validar com testes e Profiler, corrigir violações e ampliar. A diretiva `use no memo` serve de saída temporária para componentes problemáticos.",
      },
      {
        pergunta: "Por que o compilador pode não otimizar um componente?",
        resposta:
          "Porque o componente viola as regras do React (mutação, leitura de ref na renderização, efeitos colaterais) ou usa algo que a ferramenta não consegue analisar; por padrão ele o pula, sem quebrar a build. O lint e o DevTools mostram isso.",
      },
    ],
  },
  en: {
    titulo: "Enabling React Compiler",
    pergunta: "How do you enable React Compiler?",
    porqueEsteMetodo:
      "Enabling the compiler is not just installing a plugin: it is a gradual adoption with verification at each stage. The playbook shows the order (compatibility, lint, plugin, small scope, measurement, expansion) and the sign that each step worked.",
    resposta30s:
      "Check **compatibility** with your React version and bundler, turn on the **compiler’s ESLint rules** and install the **plugin** (Babel or your framework’s option). Adopt **gradually**: start with specific directories or components (**opt-in**), measure with the Profiler, fix the violations and expand. Problem components can opt out with the `use no memo` directive; the details change, so check react.dev.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from compatibility to full adoption",
        passos: [
          {
            titulo: "Check compatibility",
            texto:
              "Check on react.dev which React and bundler versions the compiler supports (older React versions may need a support package and a target option). The `react-compiler-healthcheck` tool estimates how many components in the codebase it can compile. Sign: you know whether anything blocks you before touching configuration.",
          },
          {
            titulo: "Turn on the lint first",
            texto:
              "The compiler’s ESLint rules (in recent versions they ship with the official Hooks plugin; check react.dev) flag violations of the rules of React: mutating props, reading a ref during render, side effects during render. Fix the ones that make sense: they are potential bugs, with or without the compiler.",
          },
          {
            titulo: "Install and configure the plugin",
            texto:
              "Add the compiler plugin to the Babel pipeline (it must run before the other plugins) or enable your framework’s option (Next.js and others have one). The configuration differs from tool to tool; follow the installation page on react.dev.",
          },
          {
            titulo: "Adopt in parts (opt-in)",
            texto:
              "Start in annotation mode (`compilationMode` set to `annotation`), where only functions marked with the `use memo` directive are compiled, or restrict the compiler to specific directories (the `sources` option). Pick simple, well-tested components that render a lot first.",
          },
          {
            titulo: "Measure and validate",
            texto:
              "Run the tests, use the application and compare the Profiler before and after. React DevTools marks compiled components with a badge. Sign: fewer renders where there was waste and no behaviour changed.",
          },
          {
            titulo: "Fix and expand",
            texto:
              "For each skipped or problematic component, fix the violation (make the code pure) and only then include more directories. When most of the codebase is ready, switch to the normal mode, which compiles what it can and leaves out what it cannot. If a component breaks, the `use no memo` directive excludes it as a temporary measure, with a comment and a task to fix it.",
          },
          {
            titulo: "Keep it healthy",
            texto:
              "Leave the compiler’s lint in CI so new code follows the rules, and follow the release notes: the tool evolves.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Plugin in annotation mode",
        legenda: "babel.config.js",
        codigo: `// The compiler must be the first plugin in the pipeline
module.exports = {
  plugins: [
    [
      "babel-plugin-react-compiler",
      { compilationMode: "annotation" }, // only compiles what has the directive
    ],
    // ...other plugins afterwards
  ],
};`,
        nota: "A Babel example. In Vite, Next.js and others the configuration differs; option and package names may evolve, so follow react.dev.",
      },
      {
        tipo: "codigo",
        titulo: "Opting in and out of the compiler per function",
        legenda: "JSX",
        codigo: `// With compilationMode "annotation", only what asks gets in
function ProductCard({ product }) {
  "use memo";
  const price = formatPrice(product.price);
  return <article>{product.name}: {price}</article>;
}

// In normal mode, whatever causes trouble opts out with the opposite directive
function LegacyPanel({ data }) {
  "use no memo";
  data.seen = true; // mutates props: the compiler cannot guarantee it
  return <Panel data={data} />;
}`,
        nota: "`formatPrice` and `Panel` are illustrative. The `use no memo` directive is a temporary way out: the real fix is to remove the mutation and compile the component again.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Incremental adoption",
        texto:
          "Enable it in the smallest useful scope, prove it works and expand. Progress is measured in components compiled with no violations and no change in behaviour, not by the configuration being on. If something goes wrong in production, the way back is to turn off the plugin or the directive, without touching the logic.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Limitations worth knowing",
        texto:
          "The compiler works with function components and Hooks (not class components), skips what breaks the rules of React (mutation, reading refs during render, side effects during render) and may not get along with libraries that rely on mutation or unstable identities. By default it skips **silently**: use the lint and the DevTools badge to see what was compiled. Details change between versions; check react.dev.",
      },
    ],
    armadilhas: [
      "Turning it on for the whole codebase at once: if behaviour changes, nobody knows where to look.",
      "Ignoring the lint: the compiler silently skips what breaks the rules, and you think you are optimized when you are not.",
      "Placing the compiler plugin after other Babel plugins: it needs to receive the original code.",
      "Concluding it worked without measuring: confirm with the Profiler and the tests.",
    ],
    autoteste: [
      {
        pergunta: "How do you adopt React Compiler in an existing application without risk?",
        resposta:
          "In stages: check compatibility, turn on the lint, install the plugin in annotation mode or restricted to directories, validate with tests and the Profiler, fix violations and expand. The `use no memo` directive is a temporary way out for problem components.",
      },
      {
        pergunta: "Why might the compiler not optimize a component?",
        resposta:
          "Because the component breaks the rules of React (mutation, reading a ref during render, side effects) or uses something the tool cannot analyze; by default it skips it without breaking the build. The lint and DevTools show this.",
      },
    ],
  },
};
