import type { Pergunta } from "../../tipos";

// F24 · Template engines
export const f024: Pergunta = {
  numero: 424,
  modulo: "founditgulf-basicas-1",
  metodo: "compare",
  pt: {
    titulo: "Template engines",
    pergunta: "O que são template engines no Node.js?",
    porqueEsteMetodo:
      "Vários motores fazem o mesmo trabalho com sintaxes e filosofias diferentes. A matriz os compara pelos critérios que importam, e a regra de decisão diz quando um motor de template é a ferramenta certa.",
    resposta30s:
      '**Template engines** geram **HTML no servidor** a partir de um modelo com marcadores e dos dados da requisição. Os mais usados no Node.js são **EJS**, **Pug**, **Handlebars** (e Mustache) e **Nunjucks**; no Express, você escolhe o motor com `app.set("view engine", ...)` e responde com `res.render`. Use sempre o **escape automático** (`<%= %>`, `{{ }}`) para evitar XSS.',
    blocos: [
      {
        tipo: "tabela",
        titulo: "Motores de template comuns",
        colunas: ["Motor", "Sintaxe", "Lógica no template", "Layouts e partials", "Escape automático"],
        linhas: [
          [
            "EJS",
            "HTML com tags `<% %>`, `<%= %>` e `<%- %>`",
            "JavaScript completo dentro do template",
            "`include()` de partials; layouts por inclusão de cabeçalho e rodapé (ou pacotes de layout)",
            "`<%= %>` escapa; `<%- %>` imprime sem escapar",
          ],
          [
            "Pug",
            "Indentação, sem tags de fechamento",
            "Linhas de JavaScript, com condicionais e laços próprios",
            "Herança com `extends` e `block`, `include` e mixins",
            "`#{ }` escapa; `!{ }` imprime sem escapar",
          ],
          [
            "Handlebars / Mustache",
            "Chaves duplas `{{ }}` sobre o HTML",
            "Pouca ou nenhuma: condicionais e laços por helpers (`#if`, `#each`); no Mustache, quase nenhuma",
            "Partials `{{> parcial }}`; layouts com pacotes como o `express-handlebars`",
            "`{{ }}` escapa; `{{{ }}}` imprime sem escapar",
          ],
          [
            "Nunjucks",
            "`{{ }}` e `{% %}`, inspirado no Jinja2",
            "Condicionais, laços, filtros e macros",
            "Herança com `extends` e `block`, `include` e `import`",
            "Ligado por padrão (opção `autoescape`); confira a documentação",
          ],
        ],
        nota: "A sintaxe muda, mas a ideia é a mesma: um modelo com lacunas, preenchido com dados, que vira HTML.",
      },
      {
        tipo: "codigo",
        titulo: "Um motor no Express, do registro ao res.render",
        legenda: "JavaScript",
        codigo: `import express from "express";

const app = express();
app.set("view engine", "ejs"); // qual motor; exige o pacote ejs instalado
app.set("views", "./views"); // pasta dos modelos (este já é o padrão)

app.get("/pedidos/:id", (req, res) => {
  // procura views/pedido.ejs, mistura com os dados e envia o HTML
  res.render("pedido", { id: req.params.id, itens: ["parafuso", "porca"] });
});

app.listen(3000);
// views/pedido.ejs:
//   <h1>Pedido <%= id %></h1>
//   <ul><% itens.forEach((i) => { %><li><%= i %></li><% }) %></ul>`,
        nota: "Por padrão, o Express liga o cache de views em produção (`NODE_ENV=production`), de modo que o modelo não é recompilado a cada requisição; em desenvolvimento, as alterações no modelo aparecem sem reiniciar. Confira a documentação do Express.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Quando usar um template engine",
        texto:
          "Use quando o **servidor devolve páginas HTML prontas** (sites com pouca interatividade, e-mails, relatórios, páginas administrativas) e você quer algo simples, sem build de front-end. Se a interface é rica, prefira **SSR com um framework de componentes** (React com JSX, por exemplo; veja D74), que renderiza no servidor e depois assume no navegador, ou uma **SPA + API**, em que o servidor só devolve JSON e o navegador monta a tela.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O escape é a defesa contra XSS",
        texto:
          "Imprimir dados do usuário **sem escapar** (`<%- %>`, `!{ }`, `{{{ }}}`) permite injetar `<script>` na página: é o XSS (veja L124). Use a forma que escapa por padrão e reserve a crua para HTML que você mesmo gerou e em que confia. Mantenha também o cache de views ligado em produção.",
      },
    ],
    armadilhas: [
      "Imprimir entrada do usuário com a forma sem escape (`<%- %>`, `{{{ }}}`): é a porta do XSS.",
      "Pôr regra de negócio e consultas ao banco dentro do template: o modelo deve apenas apresentar dados já prontos.",
      "Esquecer de instalar o pacote do motor ou de definir `view engine`: o `res.render` falha por não achar o motor ou o arquivo.",
      "Usar template engine para uma interface rica no cliente: nesse caso o caminho é SSR com componentes ou SPA + API.",
    ],
    autoteste: [
      {
        pergunta: "O que o `res.render` faz no Express?",
        resposta:
          "Procura o modelo na pasta de views usando o `view engine` configurado, mistura-o com os dados passados e envia o HTML resultante como resposta.",
      },
      {
        pergunta: "Qual é a diferença entre `<%= %>` e `<%- %>` no EJS?",
        resposta:
          "`<%= %>` escapa o valor antes de imprimir; `<%- %>` imprime o HTML cru, sem escapar. Dados do usuário devem usar a primeira forma.",
      },
    ],
  },
  en: {
    titulo: "Template engines",
    pergunta: "What are template engines in Node.js?",
    porqueEsteMetodo:
      "Several engines do the same job with different syntaxes and philosophies. The matrix compares them on the criteria that matter, and the decision rule says when a template engine is the right tool.",
    resposta30s:
      '**Template engines** generate **HTML on the server** from a template with placeholders and the request’s data. The most used in Node.js are **EJS**, **Pug**, **Handlebars** (and Mustache) and **Nunjucks**; in Express you pick the engine with `app.set("view engine", ...)` and reply with `res.render`. Always use **automatic escaping** (`<%= %>`, `{{ }}`) to prevent XSS.',
    blocos: [
      {
        tipo: "tabela",
        titulo: "Common template engines",
        colunas: ["Engine", "Syntax", "Logic in the template", "Layouts and partials", "Automatic escaping"],
        linhas: [
          [
            "EJS",
            "HTML with `<% %>`, `<%= %>` and `<%- %>` tags",
            "Full JavaScript inside the template",
            "`include()` for partials; layouts by including a header and a footer (or layout packages)",
            "`<%= %>` escapes; `<%- %>` prints unescaped",
          ],
          [
            "Pug",
            "Indentation, no closing tags",
            "JavaScript lines, with its own conditionals and loops",
            "Inheritance with `extends` and `block`, `include` and mixins",
            "`#{ }` escapes; `!{ }` prints unescaped",
          ],
          [
            "Handlebars / Mustache",
            "Double curly braces `{{ }}` over the HTML",
            "Little or none: conditionals and loops through helpers (`#if`, `#each`); almost none in Mustache",
            "Partials `{{> partial }}`; layouts with packages such as `express-handlebars`",
            "`{{ }}` escapes; `{{{ }}}` prints unescaped",
          ],
          [
            "Nunjucks",
            "`{{ }}` and `{% %}`, inspired by Jinja2",
            "Conditionals, loops, filters and macros",
            "Inheritance with `extends` and `block`, `include` and `import`",
            "On by default (the `autoescape` option); check the documentation",
          ],
        ],
        nota: "The syntax changes, but the idea is the same: a template with blanks, filled in with data, that becomes HTML.",
      },
      {
        tipo: "codigo",
        titulo: "An engine in Express, from registration to res.render",
        legenda: "JavaScript",
        codigo: `import express from "express";

const app = express();
app.set("view engine", "ejs"); // which engine; needs the ejs package installed
app.set("views", "./views"); // folder with the templates (this is already the default)

app.get("/orders/:id", (req, res) => {
  // looks up views/order.ejs, merges it with the data and sends the HTML
  res.render("order", { id: req.params.id, items: ["screw", "nut"] });
});

app.listen(3000);
// views/order.ejs:
//   <h1>Order <%= id %></h1>
//   <ul><% items.forEach((i) => { %><li><%= i %></li><% }) %></ul>`,
        nota: "By default, Express turns the view cache on in production (`NODE_ENV=production`), so the template is not recompiled on every request; in development, changes to the template show up without a restart. Check the Express documentation.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "When to use a template engine",
        texto:
          "Use one when the **server returns ready-made HTML pages** (low-interactivity sites, emails, reports, admin pages) and you want something simple, without a front-end build. If the interface is rich, prefer **SSR with a component framework** (React with JSX, for example; see D74), which renders on the server and then takes over in the browser, or an **SPA + API**, where the server only returns JSON and the browser builds the screen.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Escaping is the defense against XSS",
        texto:
          "Printing user data **without escaping** (`<%- %>`, `!{ }`, `{{{ }}}`) lets someone inject `<script>` into the page: that is XSS (see L124). Use the form that escapes by default and keep the raw one for HTML you generated yourself and trust. Also keep the view cache on in production.",
      },
    ],
    armadilhas: [
      "Printing user input with the unescaped form (`<%- %>`, `{{{ }}}`): it is the door to XSS.",
      "Putting business rules and database queries inside the template: the template should only present data that is already prepared.",
      "Forgetting to install the engine package or to set `view engine`: `res.render` fails because it cannot find the engine or the file.",
      "Using a template engine for a rich client-side interface: in that case the path is SSR with components or an SPA + API.",
    ],
    autoteste: [
      {
        pergunta: "What does `res.render` do in Express?",
        resposta:
          "It looks up the template in the views folder using the configured `view engine`, merges it with the data passed in and sends the resulting HTML as the response.",
      },
      {
        pergunta: "What is the difference between `<%= %>` and `<%- %>` in EJS?",
        resposta:
          "`<%= %>` escapes the value before printing; `<%- %>` prints raw HTML, unescaped. User data should use the first form.",
      },
    ],
  },
};
