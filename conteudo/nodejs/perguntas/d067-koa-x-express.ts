import type { Pergunta } from "../../tipos";

// D67 · Koa x Express
export const d067: Pergunta = {
  numero: 367,
  modulo: "devinterview-avancado",
  metodo: "compare",
  pt: {
    titulo: "Koa x Express",
    pergunta: "Como o Koa é diferente do Express.js?",
    porqueEsteMetodo:
      "As duas bibliotecas fazem quase a mesma coisa, então a diferença está nos detalhes de desenho. Uma matriz as põe lado a lado e a regra de decisão mostra quando cada uma vale a pena.",
    resposta30s:
      "O **Koa** é um núcleo mínimo: não traz roteador nem leitura de corpo, junta requisição e resposta em um único objeto **`ctx`** e foi desenhado para `async`/`await`, com middlewares em camadas (modelo “cebola”) que usam **`await next()`**. O **Express** é mais antigo, traz roteamento e utilitários embutidos e tem um ecossistema muito maior. A escolha é entre **núcleo enxuto e controle** (Koa) e **ecossistema e familiaridade** (Express).",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Koa e Express lado a lado",
        colunas: ["Aspecto", "Express", "Koa"],
        linhas: [
          [
            "Escopo do núcleo",
            "Roteador, `express.json()`, `express.urlencoded()` e `express.static` embutidos",
            "Só a cadeia de middlewares e o `ctx`; roteador, leitura do corpo e arquivos estáticos vêm de pacotes à parte",
          ],
          [
            "Requisição e resposta",
            "`req` e `res` do Node, estendidos; você responde com `res.send()` ou `res.json()`",
            "Um único `ctx` (com `ctx.request` e `ctx.response`); você define `ctx.body` e `ctx.status`, e a resposta sai quando a cadeia termina",
          ],
          [
            "Middleware",
            "`(req, res, next)`; `next()` passa a vez, mas não devolve uma promise que avise quando o resto terminou",
            "`async (ctx, next)`; `await next()` devolve uma promise que resolve quando o resto da cadeia terminou (modelo “cebola”)",
          ],
          [
            "Código assíncrono",
            "Nasceu com callbacks; versões recentes lidam melhor com handlers `async` e encaminham a rejeição ao tratador de erros (confira a documentação da sua versão)",
            "`async`/`await` desde o desenho: um erro lançado num middleware sobe pela cadeia",
          ],
          [
            "Erros",
            "Middleware de erro com quatro argumentos `(err, req, res, next)`, acionado por `next(err)`",
            '`try/catch` num middleware no topo, `ctx.throw(status, mensagem)` e `app.on("error")` para registrar',
          ],
          [
            "Ecossistema",
            "Enorme: quase toda biblioteca para Node documenta integração com o Express",
            "Menor; muitos pacotes feitos para `req`/`res` não funcionam direto no Koa",
          ],
          [
            "Material e maturidade",
            "Mais antigo e difundido, com muito material de estudo e exemplos",
            "Menos exemplos; combina com quem quer montar a própria pilha",
          ],
        ],
        nota: "Uma terceira opção é o **Fastify**: também enxuto, mas com plugins, validação por esquema e log integrados (veja T13).",
      },
      {
        tipo: "codigo",
        titulo: "A cebola do Koa: erro no topo, medição no meio, resposta no miolo",
        legenda: "JavaScript",
        codigo: `import Koa from "koa";
const app = new Koa();
app.use(async (ctx, next) => { // camada externa: captura erros
  try {
    await next(); // desce pela cadeia
  } catch (erro) {
    ctx.status = erro.status ?? 500; // o erro sobe até aqui
    ctx.body = { erro: erro.expose ? erro.message : "Erro interno" };
  }
});
app.use(async (ctx, next) => { // camada do meio: mede o tempo
  const inicio = Date.now();
  await next(); // o miolo roda aqui dentro
  ctx.set("X-Tempo-Ms", String(Date.now() - inicio)); // na volta
});
app.use((ctx) => { // miolo
  if (!ctx.query.nome) ctx.throw(400, "informe ?nome=");
  ctx.body = { ola: ctx.query.nome }; // definir o body ainda não envia
});
app.listen(3000);`,
        nota: "Os erros lançados no miolo sobem pelas camadas até o `try/catch` do topo. A resposta só sai depois que a volta termina, por isso o cabeçalho ainda pode ser definido depois do `await next()`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Precisa do ecossistema, de exemplos e de gente que já conhece? **Express**. Quer um núcleo mínimo, um fluxo `async`/`await` limpo e escolher cada peça (roteador, leitura de corpo, validação)? **Koa**. Quer validação por esquema, log integrado e plugins, também enxuto? Olhe o **Fastify**. Em time misto, o que o time já domina pesa mais do que a elegância do modelo.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Duas armadilhas ao trocar de um para o outro",
        texto:
          "No Koa, esquecer o **`await`** (ou o `return`) antes de `next()` quebra a cebola: a camada externa termina antes das internas e os erros escapam do `try/catch` do topo. E pacotes de middleware feitos para o Express não funcionam direto no Koa (nem o contrário), porque cada um espera objetos diferentes: é preciso um adaptador ou um pacote equivalente.",
      },
    ],
    armadilhas: [
      "Esquecer o `await` antes de `next()` no Koa: o código “depois do next” roda cedo demais e os erros não chegam ao `try/catch` do topo.",
      "Esperar que o Koa traga roteador e leitura de corpo prontos, como o Express: eles vêm de pacotes à parte.",
      "Reaproveitar um middleware feito para o Express no Koa (ou o contrário): os objetos são diferentes e a integração não é automática.",
      "Dar o Express por “ultrapassado” por causa do `async`: versões recentes lidam melhor com handlers assíncronos (confira a documentação) e o ecossistema ainda pesa muito.",
    ],
    autoteste: [
      {
        pergunta: "O que é o modelo “cebola” do Koa?",
        resposta:
          "Cada middleware `async` chama `await next()`: o código antes dele roda na descida, o resto da cadeia roda lá dentro e o código depois do `await` roda na subida, quando o resto terminou. Isso permite medir tempo, liberar recursos e capturar erros em um só lugar.",
      },
      {
        pergunta: "Como se tratam erros no Koa e no Express?",
        resposta:
          "No Koa, um middleware no topo envolve `await next()` em `try/catch` e usa `ctx.throw` para lançar erros HTTP. No Express, um middleware de erro com quatro argumentos recebe o que chegar por `next(err)`.",
      },
    ],
  },
  en: {
    titulo: "Koa vs Express",
    pergunta: "How is Koa different from Express.js?",
    porqueEsteMetodo:
      "The two libraries do almost the same job, so the difference lies in design details. A matrix puts them side by side and the decision rule shows when each one is worth it.",
    resposta30s:
      "**Koa** is a minimal core: it ships no router and no body parsing, merges request and response into a single **`ctx`** object and was designed for `async`/`await`, with layered middleware (the “onion” model) built on **`await next()`**. **Express** is older, ships routing and utilities, and has a far larger ecosystem. The choice is between **a lean core and control** (Koa) and **ecosystem and familiarity** (Express).",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Koa and Express side by side",
        colunas: ["Aspect", "Express", "Koa"],
        linhas: [
          [
            "Core scope",
            "Router, `express.json()`, `express.urlencoded()` and `express.static` built in",
            "Only the middleware chain and `ctx`; the router, body parsing and static files come from separate packages",
          ],
          [
            "Request and response",
            "Node’s `req` and `res`, extended; you reply with `res.send()` or `res.json()`",
            "A single `ctx` (with `ctx.request` and `ctx.response`); you set `ctx.body` and `ctx.status`, and the response goes out when the chain ends",
          ],
          [
            "Middleware",
            "`(req, res, next)`; `next()` hands over control but returns no promise telling you when the rest finished",
            "`async (ctx, next)`; `await next()` returns a promise that resolves when the rest of the chain has finished (the “onion” model)",
          ],
          [
            "Async code",
            "Born with callbacks; recent versions handle `async` handlers better and forward a rejection to the error handler (check the documentation for your version)",
            "`async`/`await` by design: an error thrown in a middleware bubbles up the chain",
          ],
          [
            "Errors",
            "An error middleware with four arguments `(err, req, res, next)`, triggered by `next(err)`",
            '`try/catch` in a middleware at the top, `ctx.throw(status, message)` and `app.on("error")` for logging',
          ],
          [
            "Ecosystem",
            "Huge: almost every Node library documents Express integration",
            "Smaller; many packages built for `req`/`res` do not work directly with Koa",
          ],
          [
            "Material and maturity",
            "Older and widespread, with plenty of tutorials and examples",
            "Fewer examples; suits people who want to assemble their own stack",
          ],
        ],
        nota: "A third option is **Fastify**: also lean, but with plugins, schema validation and logging built in (see T13).",
      },
      {
        tipo: "codigo",
        titulo: "Koa’s onion: error at the top, timing in the middle, response at the core",
        legenda: "JavaScript",
        codigo: `import Koa from "koa";
const app = new Koa();
app.use(async (ctx, next) => { // outer layer: catches errors
  try {
    await next(); // goes down the chain
  } catch (error) {
    ctx.status = error.status ?? 500; // the error bubbles up to here
    ctx.body = { error: error.expose ? error.message : "Internal error" };
  }
});
app.use(async (ctx, next) => { // middle layer: measures time
  const start = Date.now();
  await next(); // the core runs in here
  ctx.set("X-Time-Ms", String(Date.now() - start)); // on the way back
});
app.use((ctx) => { // core
  if (!ctx.query.name) ctx.throw(400, "pass ?name=");
  ctx.body = { hello: ctx.query.name }; // setting the body does not send yet
});
app.listen(3000);`,
        nota: "Errors thrown in the core bubble up through the layers to the `try/catch` at the top. The response only goes out after the way back finishes, which is why the header can still be set after `await next()`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Need the ecosystem, the examples and people who already know it? **Express**. Want a minimal core, a clean `async`/`await` flow and the freedom to pick every piece (router, body parsing, validation)? **Koa**. Want schema validation, built-in logging and plugins, also lean? Look at **Fastify**. On a mixed team, what the team already masters weighs more than the elegance of the model.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Two traps when moving from one to the other",
        texto:
          "In Koa, forgetting the **`await`** (or the `return`) before `next()` breaks the onion: the outer layer finishes before the inner ones and errors escape the `try/catch` at the top. And middleware packages built for Express do not work directly in Koa (nor the other way around), because each expects different objects: you need an adapter or an equivalent package.",
      },
    ],
    armadilhas: [
      "Forgetting the `await` before `next()` in Koa: the code “after next” runs too early and errors never reach the `try/catch` at the top.",
      "Expecting Koa to ship a router and body parsing, like Express: they come from separate packages.",
      "Reusing an Express middleware in Koa (or the reverse): the objects differ and the integration is not automatic.",
      "Writing Express off as “outdated” because of `async`: recent versions handle async handlers better (check the documentation) and the ecosystem still counts for a lot.",
    ],
    autoteste: [
      {
        pergunta: "What is Koa’s “onion” model?",
        resposta:
          "Each `async` middleware calls `await next()`: the code before it runs on the way down, the rest of the chain runs inside it, and the code after the `await` runs on the way back up, once the rest has finished. That makes it possible to measure time, release resources and catch errors in one place.",
      },
      {
        pergunta: "How are errors handled in Koa and in Express?",
        resposta:
          "In Koa, a middleware at the top wraps `await next()` in `try/catch` and uses `ctx.throw` to raise HTTP errors. In Express, an error middleware with four arguments receives whatever arrives through `next(err)`.",
      },
    ],
  },
};
