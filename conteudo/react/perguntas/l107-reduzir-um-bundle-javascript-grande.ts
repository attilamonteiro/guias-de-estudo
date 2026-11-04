import type { Pergunta } from "../../tipos";

// L107 · Reduzir um bundle JavaScript grande
export const l107: Pergunta = {
  numero: 107,
  modulo: "linkedin-desempenho",
  metodo: "playbook",
  pt: {
    titulo: "Reduzir um bundle JavaScript grande",
    pergunta: "Como você otimiza um bundle JavaScript grande?",
    porqueEsteMetodo:
      "Reduzir um bundle é um ciclo de diagnóstico, não um truque: sem medir, você corta o que não pesa. O playbook dá a ordem certa, do mapa do bundle até o orçamento que impede o problema de voltar.",
    resposta30s:
      "Primeiro **meça**: um visualizador do bundle (bundle analyzer, source map explorer) mostra o que ocupa espaço. Depois **envie menos**: importe só o necessário de dependências pesadas, deixe o **tree shaking** agir, **divida por rota e sob demanda** (`lazy` com `import()`), adie código de terceiros, remova polyfills e código morto e **comprima** (gzip ou brotli). Repita o ciclo medir, mudar e medir de novo, e fixe um **orçamento de tamanho** na integração contínua.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: do mapa ao orçamento",
        passos: [
          {
            titulo: "Meça o ponto de partida",
            texto:
              "Gere o build de produção e abra um mapa do bundle (`webpack-bundle-analyzer`, `source-map-explorer` ou o visualizador do seu bundler). Anote o tamanho minificado e o comprimido, e o que carrega na rota inicial. Sinal: você consegue apontar os maiores blocos e de onde vêm.",
          },
          {
            titulo: "Ache o que pesa e o que se repete",
            texto:
              "No mapa, procure dependências grandes, a mesma biblioteca em versões diferentes (`npm ls <pacote>` mostra as cópias e `npm dedupe` ajuda) e dados embutidos no JavaScript (JSON, imagens, fontes). Critério: cada bloco grande precisa de uma justificativa de uso na rota inicial.",
          },
          {
            titulo: "Troque ou importe só o necessário",
            texto:
              "Importe só a função que usa (`lodash/debounce` em vez de `lodash` inteira), use a versão em módulos ES (`lodash-es`) ou troque por uma alternativa menor (datas, ícones, gráficos). Sinal: o bloco encolhe no mapa depois da mudança.",
          },
          {
            titulo: "Deixe o tree shaking agir",
            texto:
              "Tree shaking remove exportações que ninguém usa, mas depende de módulos ES (`import` e `export`) e de código sem efeitos colaterais na importação. Em modo de produção os bundlers já o aplicam; declare `sideEffects: false` no `package.json` do seu código quando for verdade e desconfie de arquivos de reexportação (barrel) que arrastam o que você não usa. Sinal: um import que você não usa some do mapa.",
          },
          {
            titulo: "Divida por rota e sob demanda",
            texto:
              "Carregue cada tela, modal pesado, editor e gráfico só quando forem necessários, com `React.lazy` e `import()` dentro de `<Suspense>` (veja L102 e L106). Frameworks costumam dividir por rota sozinhos. Critério: a rota inicial baixa apenas o que usa.",
          },
          {
            titulo: "Adie o que é de terceiros",
            texto:
              "Analytics, chat, vídeos embutidos e tags de marketing não precisam bloquear a primeira exibição: carregue com `async` ou `defer`, depois da interação ou quando o navegador estiver ocioso. Sinal: a tarefa longa de terceiros some do início da linha do tempo.",
          },
          {
            titulo: "Limpe, comprima e meça de novo",
            texto:
              "Remova polyfills que seus navegadores-alvo não exigem (`browserslist`), código morto, `console` de depuração e bibliotecas sem uso; ative minificação e compressão **gzip ou brotli** no servidor ou na CDN. Meça de novo, nas mesmas condições, e fixe um **orçamento de tamanho** no CI para o bundle não voltar a crescer.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Divisão por tela e biblioteca pesada sob demanda",
        legenda: "TSX",
        codigo: `import { lazy, Suspense } from "react";

// Cada tela vira um pedaço separado, baixado só quando é usada
const Relatorios = lazy(() => import("./paginas/Relatorios"));
const Configuracoes = lazy(() => import("./paginas/Configuracoes"));

export function Tela({ nome }: { nome: "relatorios" | "configuracoes" }) {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      {nome === "relatorios" ? <Relatorios /> : <Configuracoes />}
    </Suspense>
  );
}

// Biblioteca pesada só quando o usuário pede
export async function exportarPdf(dados: unknown) {
  const { gerarPdf } = await import("./exportar/pdf");
  return gerarPdf(dados);
}`,
        nota: "Numa aplicação real o roteador escolhe a tela, e cada `import()` vira um pedaço separado no build. O módulo carregado com `lazy` precisa ter exportação padrão (`export default`).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O ciclo que vale a pena",
        texto:
          "Medir, mudar uma coisa e medir de novo. Comece pelos maiores blocos da **rota inicial**: o ganho está no que o usuário baixa para a primeira tela, não no tamanho total do projeto. Um orçamento de tamanho no CI transforma a otimização em regra, e não em mutirão.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cenário dos 5 MB: confira antes de otimizar",
        texto:
          "Veja primeiro se o número vem de um build de produção minificado, sem modo de desenvolvimento nem source maps, e compare o tamanho bruto com o transferido (comprimido). Um valor tão alto costuma vir de poucas causas: uma biblioteca inteira importada por causa de um recurso, a mesma dependência duplicada, ativos (imagens, fontes, JSON) embutidos no JavaScript ou ausência de divisão por rota. O analisador mostra qual delas é.",
      },
    ],
    armadilhas: [
      "Otimizar sem medir: cortar o que parece pesado e descobrir depois que o maior bloco era outro.",
      "Olhar o tamanho do build de desenvolvimento ou só o bruto: o que importa é o build de produção, comprimido e o que carrega na rota inicial.",
      "Dividir demais: dezenas de pedaços minúsculos criam cascatas de requisições; agrupe o que é usado junto.",
      "Importar tudo com `import *` ou por arquivos de reexportação e esperar que o tree shaking resolva: nem sempre ele consegue provar que o código é inútil.",
    ],
    autoteste: [
      {
        pergunta: "Qual é o primeiro passo para reduzir um bundle, e por quê?",
        resposta:
          "Medir com um analisador de bundle em build de produção. Sem o mapa você não sabe o que pesa; com ele, ataca primeiro as dependências e os blocos maiores da rota inicial.",
      },
      {
        pergunta: "Qual é a diferença entre tree shaking e code splitting?",
        resposta:
          "Tree shaking remove do bundle o código exportado que ninguém usa. Code splitting divide o código restante em pedaços carregados sob demanda (por rota ou por recurso). Um reduz o que existe; o outro adia o que não é necessário agora.",
      },
    ],
  },
  en: {
    titulo: "Shrinking a large bundle",
    pergunta: "How do you optimize a large JavaScript bundle?",
    porqueEsteMetodo:
      "Shrinking a bundle is a diagnostic cycle, not a trick: without measuring, you cut what does not weigh anything. The playbook gives the right order, from the bundle map to the budget that keeps the problem from coming back.",
    resposta30s:
      "First **measure**: a bundle visualizer (bundle analyzer, source map explorer) shows what takes up space. Then **ship less**: import only what you need from heavy dependencies, let **tree shaking** work, **split by route and on demand** (`lazy` with `import()`), defer third-party code, remove polyfills and dead code, and **compress** (gzip or brotli). Repeat the cycle measure, change, measure again, and set a **size budget** in continuous integration.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from the map to the budget",
        passos: [
          {
            titulo: "Measure the starting point",
            texto:
              "Produce the production build and open a bundle map (`webpack-bundle-analyzer`, `source-map-explorer` or your bundler’s visualizer). Note the minified and compressed sizes, and what loads on the initial route. Sign: you can point at the largest blocks and where they come from.",
          },
          {
            titulo: "Find what weighs a lot and what repeats",
            texto:
              "In the map, look for large dependencies, the same library in different versions (`npm ls <package>` shows the copies and `npm dedupe` helps) and data embedded in the JavaScript (JSON, images, fonts). Criterion: every large block needs a reason to be on the initial route.",
          },
          {
            titulo: "Swap, or import only what you need",
            texto:
              "Import only the function you use (`lodash/debounce` instead of all of `lodash`), use the ES-module build (`lodash-es`) or switch to a smaller alternative (dates, icons, charts). Sign: the block shrinks in the map after the change.",
          },
          {
            titulo: "Let tree shaking work",
            texto:
              "Tree shaking removes exports nobody uses, but it depends on ES modules (`import` and `export`) and on code with no side effects on import. Bundlers already apply it in production mode; declare `sideEffects: false` in your code’s `package.json` when it is true, and be wary of re-export (barrel) files that drag in what you do not use. Sign: an import you do not use disappears from the map.",
          },
          {
            titulo: "Split by route and on demand",
            texto:
              "Load each screen, heavy modal, editor and chart only when needed, with `React.lazy` and `import()` inside `<Suspense>` (see L102 and L106). Frameworks often split by route on their own. Criterion: the initial route downloads only what it uses.",
          },
          {
            titulo: "Defer third-party code",
            texto:
              "Analytics, chat, embedded videos and marketing tags do not need to block the first paint: load them with `async` or `defer`, after an interaction or when the browser is idle. Sign: the third-party long task disappears from the start of the timeline.",
          },
          {
            titulo: "Clean up, compress and measure again",
            texto:
              "Remove polyfills your target browsers do not need (`browserslist`), dead code, debugging `console` calls and unused libraries; turn on minification and **gzip or brotli** compression on the server or CDN. Measure again, under the same conditions, and set a **size budget** in CI so the bundle does not grow back.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Splitting by screen and loading a heavy library on demand",
        legenda: "TSX",
        codigo: `import { lazy, Suspense } from "react";

// Each screen becomes a separate chunk, downloaded only when it is used
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));

export function Screen({ name }: { name: "reports" | "settings" }) {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      {name === "reports" ? <Reports /> : <Settings />}
    </Suspense>
  );
}

// Heavy library only when the user asks for it
export async function exportPdf(data: unknown) {
  const { buildPdf } = await import("./export/pdf");
  return buildPdf(data);
}`,
        nota: "In a real application the router picks the screen, and each `import()` becomes a separate chunk in the build. A module loaded with `lazy` must have a default export (`export default`).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The cycle that pays off",
        texto:
          "Measure, change one thing and measure again. Start with the largest blocks of the **initial route**: the gain is in what the user downloads for the first screen, not in the total size of the project. A size budget in CI turns optimization into a rule instead of a one-off effort.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The 5 MB scenario: check before optimizing",
        texto:
          "First see whether the number comes from a minified production build, without development mode or source maps, and compare the raw size with the transferred (compressed) size. A value that high usually comes from a few causes: a whole library imported for one feature, the same dependency duplicated, assets (images, fonts, JSON) embedded in the JavaScript, or no splitting by route. The analyzer shows which one it is.",
      },
    ],
    armadilhas: [
      "Optimizing without measuring: cutting what looks heavy and finding out later that the biggest block was another one.",
      "Looking at the size of the development build or only the raw size: what matters is the production build, compressed, and what loads on the initial route.",
      "Splitting too much: dozens of tiny chunks create request waterfalls; group what is used together.",
      "Importing everything with `import *` or through re-export files and expecting tree shaking to fix it: it cannot always prove the code is unused.",
    ],
    autoteste: [
      {
        pergunta: "What is the first step to reduce a bundle, and why?",
        resposta:
          "Measuring with a bundle analyzer on a production build. Without the map you do not know what weighs a lot; with it, you tackle the largest dependencies and blocks of the initial route first.",
      },
      {
        pergunta: "What is the difference between tree shaking and code splitting?",
        resposta:
          "Tree shaking removes exported code nobody uses from the bundle. Code splitting divides the remaining code into chunks loaded on demand (per route or per feature). One reduces what exists; the other defers what is not needed right now.",
      },
    ],
  },
};
