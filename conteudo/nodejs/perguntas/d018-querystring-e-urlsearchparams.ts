import type { Pergunta } from "../../tipos";

// D18 · querystring e URLSearchParams
export const d018: Pergunta = {
  numero: 318,
  modulo: "devinterview-nativos",
  metodo: "feynman",
  pt: {
    titulo: "querystring e URLSearchParams",
    pergunta: "O que é o módulo QueryString?",
    porqueEsteMetodo:
      "A query string parece só “texto depois do ponto de interrogação”, e é justamente aí que moram as confusões: codificação, valores repetidos e tipos. Uma imagem simples firma a ideia; depois vêm o módulo `querystring`, a forma moderna e os pontos em que ela falha.",
    resposta30s:
      "O **`node:querystring`** converte entre a parte de busca de uma URL (`a=1&b=2`) e um objeto: `parse`, `stringify`, `escape` e `unescape`. Hoje ele é um módulo **legado** (confira a documentação em nodejs.org); em código novo use **`URLSearchParams`** e **`URL`**, o padrão da web. Em qualquer um, os valores chegam como **string**, e um parâmetro repetido pode virar **array**.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense na etiqueta de uma encomenda: uma linha curta com campos preenchidos, `campo=valor`, separados por `&`. A etiqueta só aceita um alfabeto limitado, então espaços e acentos precisam ser escritos em um código (`%20`, `%C3%A1`). `querystring` e `URLSearchParams` são quem lê a etiqueta e devolve os campos organizados, ou quem escreve uma etiqueta nova a partir de campos.",
        tecnico:
          "No `node:querystring`, `parse` transforma `a=1&b=2` num objeto (sem protótipo comum, com um limite de chaves, `maxKeys`), `stringify` faz o caminho inverso e `escape`/`unescape` aplicam a codificação percentual. Valores repetidos viram array. O módulo se mantém por compatibilidade. `URLSearchParams` é a classe padrão da web, igual no navegador e no Node.js: tem `get`, `getAll`, `append`, `set`, `has`, `delete` e é iterável. Ela vem dentro de `URL` (`url.searchParams`). No servidor, `req.url` traz só caminho e busca (`/busca?tag=a`), então se monta `new URL(req.url, base)` com uma base qualquer fixa. No Express, `req.query` já vem pronto, e o analisador usado muda entre versões: confira a documentação da sua.",
        limite:
          "A etiqueta não tem tipos nem garantias: tudo é texto, o mesmo campo pode aparecer duas vezes e quem a escreveu pode ser um atacante. Ler a etiqueta não é validá-la.",
      },
      {
        tipo: "tabela",
        titulo: "querystring x URLSearchParams",
        colunas: ["Aspecto", "`node:querystring`", "`URLSearchParams` / `URL`"],
        linhas: [
          [
            "Situação",
            "Legado: só do Node.js, mantido por compatibilidade",
            "Padrão da web (WHATWG), igual no navegador e no Node.js",
          ],
          [
            "Resultado da leitura",
            'Objeto simples, sem protótipo comum: `{ a: "1" }`',
            "Objeto com métodos (`get`, `getAll`, `has`), iterável",
          ],
          [
            "Parâmetro repetido (`?a=1&a=2`)",
            'Vira array: `{ a: ["1", "2"] }`',
            '`get("a")` devolve só `"1"`; `getAll("a")` devolve os dois',
          ],
          ["Espaço ao escrever", "`%20`", "`+` (formato de formulário); na leitura os dois entendem `+` como espaço"],
          ["Tipos dos valores", "Sempre string", "Sempre string"],
          [
            "Limite de parâmetros",
            "`maxKeys` na leitura (confira o padrão)",
            "Sem limite próprio: valem os limites do servidor HTTP (por exemplo, o tamanho dos cabeçalhos)",
          ],
        ],
        nota: "Com o Express, `req.query` pode ser objeto aninhado com arrays (`a[b]=1`), conforme o analisador configurado.",
      },
      {
        tipo: "codigo",
        titulo: "Lendo e validando a query no servidor",
        legenda: "JavaScript",
        codigo: [
          'import { createServer } from "node:http";',
          "",
          "createServer((req, res) => {",
          "  // req.url traz só o caminho e a busca; a base serve apenas para o URL parsear",
          '  const url = new URL(req.url, "http://localhost");',
          '  const q = url.searchParams.get("q") ?? "";',
          '  const tags = url.searchParams.getAll("tag"); // sempre array, mesmo repetido',
          '  const limite = Number(url.searchParams.get("limite") ?? 10); // tudo é string',
          "  if (!Number.isInteger(limite) || limite < 1 || limite > 100) {",
          "    res.statusCode = 400;",
          '    return res.end("limite inválido");',
          "  }",
          "  res.end(JSON.stringify({ q, tags, limite }));",
          "}).listen(3000);",
        ].join("\n"),
        nota: '`?tag=a&tag=b&limite=5` produz `tags` igual a `["a", "b"]` e `limite` igual a `5`; `?limite=abc` recebe 400.',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A query é entrada do usuário",
        texto:
          "Um parâmetro repetido vira array (no `querystring` e, em geral, no `req.query` do Express), e `req.query.tag.toLowerCase()` quebra com `TypeError`. Valide o **tipo** e o **formato** de cada parâmetro (com `getAll`, `Array.isArray` ou um esquema, como Zod ou Joi) e converta números de forma explícita. Nomes como `__proto__` e `constructor` podem chegar como chave: não faça mesclagem recursiva da query em objetos, e prefira uma lista de parâmetros permitidos. Evite segredos na query: URLs vão para logs e histórico.",
      },
    ],
    armadilhas: [
      "Assumir que o valor é string: `?tag=a&tag=b` entrega um array, e métodos de string lançam erro.",
      'Somar valores da query sem converter: `"10" + 1` é `"101"`; converta com `Number` e valide.',
      "Usar `Object.fromEntries(url.searchParams)` e perder parâmetros repetidos: só o último de cada chave sobrevive.",
      'Montar a query concatenando strings (`"?q=" + termo`): caracteres como `&` e `#` quebram a URL; use `URLSearchParams` ou `encodeURIComponent`.',
    ],
    autoteste: [
      {
        pergunta: "Por que `req.query.tag.toLowerCase()` pode derrubar um handler, e como evitar?",
        resposta:
          "Porque `?tag=a&tag=b` faz `tag` virar um array, e array não tem `toLowerCase`. Valide o tipo (`Array.isArray`, `getAll` ou um esquema) e trate o caso de vários valores ou recuse a requisição.",
      },
      {
        pergunta: "Qual usar num projeto novo, `querystring` ou `URLSearchParams`, e por quê?",
        resposta:
          "`URLSearchParams` (dentro de `URL`): é o padrão da web, igual no navegador e no Node.js, e o `querystring` é considerado legado na documentação. Em ambos, tudo chega como string e precisa de validação.",
      },
    ],
  },
  en: {
    titulo: "querystring and URLSearchParams",
    pergunta: "What is the QueryString module?",
    porqueEsteMetodo:
      "A query string looks like “just text after the question mark”, and that is exactly where the confusion lives: encoding, repeated values and types. A simple image anchors the idea; then come the `querystring` module, the modern way and the points where it fails.",
    resposta30s:
      "**`node:querystring`** converts between the search part of a URL (`a=1&b=2`) and an object: `parse`, `stringify`, `escape` and `unescape`. Today it is a **legacy** module (check the documentation on nodejs.org); in new code use **`URLSearchParams`** and **`URL`**, the web standard. In either one, values arrive as **strings**, and a repeated parameter can become an **array**.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a parcel label: a short line of filled-in fields, `field=value`, separated by `&`. The label accepts only a limited alphabet, so spaces and accents must be written in a code (`%20`, `%C3%A1`). `querystring` and `URLSearchParams` are what reads the label and hands back the organized fields, or writes a new label from fields.",
        tecnico:
          "In `node:querystring`, `parse` turns `a=1&b=2` into an object (without an ordinary prototype, with a key limit, `maxKeys`), `stringify` does the reverse and `escape`/`unescape` apply percent-encoding. Repeated values become an array. The module is kept for compatibility. `URLSearchParams` is the web-standard class, the same in the browser and in Node.js: it has `get`, `getAll`, `append`, `set`, `has`, `delete` and is iterable. It comes inside `URL` (`url.searchParams`). On a server, `req.url` carries only the path and search (`/search?tag=a`), so you build `new URL(req.url, base)` with any fixed base. In Express, `req.query` is already parsed, and the parser it uses changes between versions: check the documentation for yours.",
        limite:
          "The label has no types and no guarantees: everything is text, the same field can appear twice and whoever wrote it may be an attacker. Reading the label is not validating it.",
      },
      {
        tipo: "tabela",
        titulo: "querystring vs URLSearchParams",
        colunas: ["Aspect", "`node:querystring`", "`URLSearchParams` / `URL`"],
        linhas: [
          [
            "Status",
            "Legacy: Node.js only, kept for compatibility",
            "Web standard (WHATWG), the same in the browser and in Node.js",
          ],
          [
            "Result of parsing",
            'Plain object without an ordinary prototype: `{ a: "1" }`',
            "Object with methods (`get`, `getAll`, `has`), iterable",
          ],
          [
            "Repeated parameter (`?a=1&a=2`)",
            'Becomes an array: `{ a: ["1", "2"] }`',
            '`get("a")` returns only `"1"`; `getAll("a")` returns both',
          ],
          ["Space when writing", "`%20`", "`+` (form format); when parsing, both read `+` as a space"],
          ["Value types", "Always string", "Always string"],
          [
            "Parameter limit",
            "`maxKeys` when parsing (check the default)",
            "No limit of its own: the HTTP server’s limits apply (for example, header size)",
          ],
        ],
        nota: "With Express, `req.query` can be a nested object with arrays (`a[b]=1`), depending on the configured parser.",
      },
      {
        tipo: "codigo",
        titulo: "Reading and validating the query on a server",
        legenda: "JavaScript",
        codigo: [
          'import { createServer } from "node:http";',
          "",
          "createServer((req, res) => {",
          "  // req.url carries only the path and search; the base is just so URL can parse it",
          '  const url = new URL(req.url, "http://localhost");',
          '  const q = url.searchParams.get("q") ?? "";',
          '  const tags = url.searchParams.getAll("tag"); // always an array, even if repeated',
          '  const limit = Number(url.searchParams.get("limit") ?? 10); // everything is a string',
          "  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {",
          "    res.statusCode = 400;",
          '    return res.end("invalid limit");',
          "  }",
          "  res.end(JSON.stringify({ q, tags, limit }));",
          "}).listen(3000);",
        ].join("\n"),
        nota: '`?tag=a&tag=b&limit=5` yields `tags` equal to `["a", "b"]` and `limit` equal to `5`; `?limit=abc` gets a 400.',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The query is user input",
        texto:
          "A repeated parameter becomes an array (in `querystring` and, generally, in Express’s `req.query`), and `req.query.tag.toLowerCase()` fails with a `TypeError`. Validate the **type** and **format** of each parameter (with `getAll`, `Array.isArray` or a schema such as Zod or Joi) and convert numbers explicitly. Names such as `__proto__` and `constructor` can arrive as keys: do not deep-merge the query into objects, and prefer an allow-list of parameters. Avoid secrets in the query: URLs end up in logs and history.",
      },
    ],
    armadilhas: [
      "Assuming the value is a string: `?tag=a&tag=b` delivers an array, and string methods throw.",
      'Adding query values without converting: `"10" + 1` is `"101"`; convert with `Number` and validate.',
      "Using `Object.fromEntries(url.searchParams)` and losing repeated parameters: only the last one of each key survives.",
      'Building the query by concatenating strings (`"?q=" + term`): characters such as `&` and `#` break the URL; use `URLSearchParams` or `encodeURIComponent`.',
    ],
    autoteste: [
      {
        pergunta: "Why can `req.query.tag.toLowerCase()` take a handler down, and how do you avoid it?",
        resposta:
          "Because `?tag=a&tag=b` makes `tag` an array, and an array has no `toLowerCase`. Validate the type (`Array.isArray`, `getAll` or a schema) and handle multiple values or reject the request.",
      },
      {
        pergunta: "Which should you use in a new project, `querystring` or `URLSearchParams`, and why?",
        resposta:
          "`URLSearchParams` (inside `URL`): it is the web standard, the same in the browser and in Node.js, and the documentation treats `querystring` as legacy. In both, everything arrives as a string and needs validation.",
      },
    ],
  },
};
