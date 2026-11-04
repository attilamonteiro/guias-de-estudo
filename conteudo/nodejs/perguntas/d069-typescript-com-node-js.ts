import type { Pergunta } from "../../tipos";

// D69 · TypeScript com Node.js
export const d069: Pergunta = {
  numero: 369,
  modulo: "devinterview-avancado",
  metodo: "whys",
  pt: {
    titulo: "TypeScript com Node.js",
    pergunta: "Quais são os benefícios de usar TypeScript com o Node.js?",
    porqueEsteMetodo:
      "Os benefícios do TypeScript são consequências encadeadas, não uma lista solta. Seguir a cadeia de “por quês” mostra de onde vem cada ganho e, pelo mesmo caminho, onde estão os custos e os limites.",
    resposta30s:
      "O TypeScript acrescenta **tipos estáticos** ao JavaScript: o compilador acha antes da execução erros que, em JavaScript puro, só apareceriam em produção. Isso dá **contratos explícitos** entre módulos e serviços, **refatoração segura**, **autocompletar** e documentação que não desatualiza. O preço é uma **etapa de build** e um limite importante: **os tipos não validam dados em tempo de execução**.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o JavaScript puro cobra caro no Node.js?",
            resposta:
              "Porque ele é dinâmico: um nome de propriedade errado, um argumento na ordem trocada ou um `undefined` inesperado só estouram quando aquela linha roda. Num servidor, isso costuma acontecer num caminho raro e já em produção, como um `Cannot read properties of undefined`.",
          },
          {
            pergunta: "Por que tipos estáticos resolvem isso?",
            resposta:
              "Porque o compilador (e o editor, enquanto você digita) confere cada uso contra a declaração: propriedade inexistente, tipo errado, valor que pode ser `null`. O erro deixa de ser uma exceção em produção e vira um sublinhado no editor ou uma falha de build.",
          },
          {
            pergunta: "Por que isso pesa ainda mais no back-end?",
            resposta:
              "Porque um servidor é feito de contratos: funções de domínio, objetos de entrada e saída, respostas de APIs, eventos e mensagens de fila. Quando um lado muda, o outro quebra em silêncio. Os tipos tornam o contrato explícito e verificável, e podem ser compartilhados entre os pacotes de um mesmo repositório.",
          },
          {
            pergunta: "Por que a refatoração e o dia a dia melhoram?",
            resposta:
              "Porque, ao renomear um campo ou mudar uma assinatura, o compilador lista cada ponto que precisa mudar. Os tipos viram documentação viva (o editor mostra parâmetros e retornos) e o autocompletar acelera quem entra no projeto.",
          },
          {
            pergunta: "Por que, então, o TypeScript não resolve tudo?",
            resposta:
              "Porque os tipos **desaparecem na execução**: o que chega de fora (corpo de requisição, variáveis de ambiente, resposta de outra API, linha do banco) é só `unknown` para o Node, e um `as Pedido` apenas cala o compilador. Para essas fronteiras, valide com um esquema (Zod, Ajv) e derive o tipo dele. Há também custos: uma etapa de build ou um executor, tipos de bibliotecas (`@types/*`) que nem sempre existem e o `any`, que desliga a checagem onde aparece.",
          },
        ],
        causaRaiz:
          "O Node.js é dinâmico e quase tudo que ele recebe vem de fora. Os tipos movem a detecção de erros do **tempo de execução para o tempo de escrita**, mas só valem **dentro das fronteiras do seu código**: na entrada de dados, a garantia vem de **validar em execução**.",
      },
      {
        tipo: "tabela",
        titulo: "Como executar TypeScript no Node.js",
        colunas: ["Opção", "O que faz", "Quando usar"],
        linhas: [
          [
            "`tsc`",
            "Checa os tipos e compila para JavaScript; você roda o resultado com `node`",
            "Build de produção e bibliotecas; é a referência para a checagem de tipos",
          ],
          [
            "`tsx`, `ts-node`",
            "Executam o `.ts` direto, sem passo manual de build; confira se o executor checa tipos (o `tsx`, por exemplo, apenas os remove)",
            "Desenvolvimento, scripts e testes, com `tsc --noEmit` à parte",
          ],
          [
            "Execução nativa de TypeScript no Node",
            "Versões recentes conseguem rodar arquivos `.ts` removendo os tipos, sem checá-los e com limites na sintaxe aceita",
            "Scripts simples e experimentos; confira o estado e as restrições em nodejs.org",
          ],
          [
            "Bundlers e transpiladores (esbuild, SWC)",
            "Convertem TypeScript em JavaScript muito rápido, sem checar tipos",
            "Pipelines de build e de testes, combinados com `tsc --noEmit`",
          ],
        ],
        nota: "Seja qual for o executor, mantenha `strict` ligado no `tsconfig.json`, instale `@types/node` para tipar a API do Node e alinhe `module` e `moduleResolution` ao jeito que o projeto carrega módulos (CommonJS ou ESM). Para conviver com JavaScript existente, `allowJs` e `checkJs` permitem migrar arquivo por arquivo.",
      },
      {
        tipo: "codigo",
        titulo: "O tipo nasce do esquema que valida",
        legenda: "TypeScript",
        codigo: `import { z } from "zod";

const Pedido = z.object({
  produto: z.string().min(1),
  quantidade: z.number().int().positive(),
});
type Pedido = z.infer<typeof Pedido>; // o tipo é derivado do esquema

export function criarPedido(corpoDaRequisicao: unknown): Pedido {
  return Pedido.parse(corpoDaRequisicao); // valida em execução; lança se estiver errado
}`,
        nota: "O `unknown` obriga a validar antes de usar. Sem a validação, o tipo `Pedido` seria só uma promessa que o compilador não tem como cumprir.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Os dois se completam",
        texto:
          "O TypeScript previne erros de contrato **dentro** do código: chamadas, refatorações, estruturas. A validação em execução protege a **fronteira**: tudo que vem de fora. Use `unknown` em vez de `any` na entrada e valide antes de confiar; assim o ganho dos tipos não vira falsa segurança.",
      },
    ],
    armadilhas: [
      "Achar que os tipos validam dados em execução: o JSON do corpo, as variáveis de ambiente e as respostas de APIs continuam sem garantia até serem validados.",
      "Usar `any` e `as` para “fazer compilar”: o compilador para de ajudar exatamente onde havia dúvida.",
      "Confundir rodar com checar: `tsx` e a execução nativa removem os tipos sem verificá-los; rode `tsc --noEmit` no CI.",
      "Esquecer `@types/node` e a configuração de módulos (CommonJS ou ESM): os erros de import e de API do Node viram ruído.",
    ],
    autoteste: [
      {
        pergunta: "Por que o TypeScript não elimina a necessidade de validar a entrada?",
        resposta:
          "Porque os tipos existem só na compilação e somem em execução. Dados externos chegam sem garantia, então é preciso validá-los com um esquema (Zod, Ajv) e, se quiser, derivar o tipo dele.",
      },
      {
        pergunta: "Qual é a diferença entre executar TypeScript e checá-lo?",
        resposta:
          "Executar apenas remove ou compila os tipos para rodar o JavaScript; checar é o trabalho do compilador (`tsc --noEmit`) e do editor. Muitos executores rodam sem checar, por isso a checagem entra no CI.",
      },
    ],
  },
  en: {
    titulo: "TypeScript with Node.js",
    pergunta: "What are the benefits of using TypeScript with Node.js?",
    porqueEsteMetodo:
      "TypeScript’s benefits are chained consequences, not a loose list. Following the chain of whys shows where each gain comes from and, along the same path, where the costs and limits are.",
    resposta30s:
      "TypeScript adds **static types** to JavaScript: the compiler finds, before running, errors that plain JavaScript would only reveal in production. That gives **explicit contracts** between modules and services, **safe refactoring**, **autocompletion** and documentation that does not go stale. The price is a **build step** and one important limit: **types do not validate data at run time**.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does plain JavaScript get expensive in Node.js?",
            resposta:
              "Because it is dynamic: a misspelled property name, arguments in the wrong order or an unexpected `undefined` only blow up when that line runs. On a server that usually happens on a rare path and already in production, as a `Cannot read properties of undefined`.",
          },
          {
            pergunta: "Why do static types solve that?",
            resposta:
              "Because the compiler (and the editor, as you type) checks every use against its declaration: a missing property, a wrong type, a value that may be `null`. The error stops being a production exception and becomes an underline in the editor or a failed build.",
          },
          {
            pergunta: "Why does this weigh even more on the back end?",
            resposta:
              "Because a server is made of contracts: domain functions, input and output objects, API responses, events and queue messages. When one side changes, the other breaks silently. Types make the contract explicit and checkable, and they can be shared across the packages of one repository.",
          },
          {
            pergunta: "Why do refactoring and day-to-day work get better?",
            resposta:
              "Because when you rename a field or change a signature, the compiler lists every place that must change. Types become living documentation (the editor shows parameters and return values) and autocompletion speeds up whoever joins the project.",
          },
          {
            pergunta: "So why does TypeScript not solve everything?",
            resposta:
              "Because types **disappear at run time**: whatever comes from outside (a request body, environment variables, another API’s response, a database row) is just `unknown` to Node, and an `as Order` only silences the compiler. For those boundaries, validate with a schema (Zod, Ajv) and derive the type from it. There are costs too: a build step or an executor, library types (`@types/*`) that do not always exist, and `any`, which switches checking off wherever it appears.",
          },
        ],
        causaRaiz:
          "Node.js is dynamic and almost everything it receives comes from outside. Types move error detection from **run time to writing time**, but they only hold **inside the boundaries of your code**: for incoming data, the guarantee comes from **validating at run time**.",
      },
      {
        tipo: "tabela",
        titulo: "How to run TypeScript in Node.js",
        colunas: ["Option", "What it does", "When to use"],
        linhas: [
          [
            "`tsc`",
            "Checks types and compiles to JavaScript; you run the output with `node`",
            "Production builds and libraries; the reference for type checking",
          ],
          [
            "`tsx`, `ts-node`",
            "Run the `.ts` file directly, with no manual build step; check whether the runner type-checks (`tsx`, for example, only strips the types)",
            "Development, scripts and tests, with `tsc --noEmit` on the side",
          ],
          [
            "Native TypeScript execution in Node",
            "Recent versions can run `.ts` files by stripping the types, without checking them and with limits on the accepted syntax",
            "Simple scripts and experiments; check the status and restrictions at nodejs.org",
          ],
          [
            "Bundlers and transpilers (esbuild, SWC)",
            "Convert TypeScript to JavaScript very quickly, without type checking",
            "Build and test pipelines, combined with `tsc --noEmit`",
          ],
        ],
        nota: "Whichever runner you use, keep `strict` on in `tsconfig.json`, install `@types/node` to type the Node API and align `module` and `moduleResolution` with how the project loads modules (CommonJS or ESM). To live alongside existing JavaScript, `allowJs` and `checkJs` let you migrate file by file.",
      },
      {
        tipo: "codigo",
        titulo: "The type is born from the schema that validates",
        legenda: "TypeScript",
        codigo: `import { z } from "zod";

const Order = z.object({
  product: z.string().min(1),
  quantity: z.number().int().positive(),
});
type Order = z.infer<typeof Order>; // the type is derived from the schema

export function createOrder(requestBody: unknown): Order {
  return Order.parse(requestBody); // validates at run time; throws if it is wrong
}`,
        nota: "`unknown` forces you to validate before using the value. Without validation, the `Order` type would be just a promise the compiler has no way to keep.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The two complete each other",
        texto:
          "TypeScript prevents contract errors **inside** the code: calls, refactors, data structures. Run-time validation protects the **boundary**: everything that comes from outside. Use `unknown` instead of `any` on input and validate before trusting it; that way the gain from types does not turn into false security.",
      },
    ],
    armadilhas: [
      "Thinking types validate data at run time: the request JSON, environment variables and API responses stay unguaranteed until they are validated.",
      "Using `any` and `as` to “make it compile”: the compiler stops helping exactly where there was doubt.",
      "Confusing running with checking: `tsx` and native execution strip types without verifying them; run `tsc --noEmit` in CI.",
      "Forgetting `@types/node` and the module configuration (CommonJS or ESM): import and Node API errors turn into noise.",
    ],
    autoteste: [
      {
        pergunta: "Why does TypeScript not remove the need to validate input?",
        resposta:
          "Because types exist only at compile time and vanish at run time. External data arrives with no guarantee, so it has to be validated with a schema (Zod, Ajv) and, if you like, the type derived from that schema.",
      },
      {
        pergunta: "What is the difference between running TypeScript and checking it?",
        resposta:
          "Running only strips or compiles the types so the JavaScript can execute; checking is the job of the compiler (`tsc --noEmit`) and the editor. Many runners execute without checking, which is why the check goes into CI.",
      },
    ],
  },
};
