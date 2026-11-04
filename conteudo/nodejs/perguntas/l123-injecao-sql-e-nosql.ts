import type { Pergunta } from "../../tipos";

// L123 · Injeção SQL e NoSQL
export const l123: Pergunta = {
  numero: 223,
  modulo: "linkedin-seguranca",
  metodo: "threat",
  pt: {
    titulo: "Injeção SQL e NoSQL",
    pergunta: "Como você previne injeção de SQL/NoSQL?",
    porqueEsteMetodo:
      "A defesa só faz sentido quando se entende o ataque. Cada par ataque → defesa mostra o que o invasor controla e qual regra tira esse controle, em SQL e em NoSQL.",
    resposta30s:
      "A causa é sempre a mesma: **a entrada do usuário altera a estrutura da consulta**. Em SQL, a defesa é a **consulta parametrizada** (valores separados do texto), com lista permitida para identificadores. Em NoSQL como o MongoDB, a entrada pode virar **operador** (`{ $ne: null }`), então **valide o tipo** antes de consultar. Em ambos, use **privilégio mínimo** na conta do banco.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ataque → defesa",
        rotuloOrigem: "Ataque",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem: "Entrada concatenada ou interpolada no texto SQL: `' OR '1'='1`",
            destino:
              "**Consulta parametrizada** (`$1` no `pg`, `?` no `mysql2`). O valor vai separado e nunca é interpretado como SQL.",
          },
          {
            origem: "Tabela, coluna ou `ORDER BY` vindos da entrada (não se parametrizam)",
            destino: "**Lista permitida**: mapear a opção recebida para identificadores fixos escritos por você.",
          },
          {
            origem: "ORM ou query builder usado com SQL cru (`raw`, métodos `unsafe`)",
            destino: "Usar a API parametrizada da biblioteca e revisar todo `raw`/`unsafe`. Usar ORM não é imunidade.",
          },
          {
            origem:
              "Operadores do MongoDB vindos da entrada (`{ $ne: null }`, `$gt`, `$regex`) ou JavaScript no servidor (`$where`)",
            destino:
              "**Validar o tipo** (texto é texto, não objeto), extrair campos explícitos em vez de passar `req.body` como filtro e evitar `$where`. O Mongoose tem a opção `sanitizeFilter`; confira a documentação.",
          },
          {
            origem: "Conta do banco com poder demais",
            destino:
              "**Privilégio mínimo**: uma conta por serviço, sem permissão de DDL, somente leitura quando possível. Limita o estrago se algo escapar.",
          },
          {
            origem: "Entrada fora do formato esperado e erro do banco devolvido ao cliente",
            destino:
              "Validar tipo, formato e tamanho na borda (veja L50) e responder com erro genérico; o detalhe fica no log interno.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Valor separado do texto e tipo validado",
        legenda: "JavaScript",
        codigo:
          'import { z } from "zod";\n\n// SQL: o texto da consulta e os valores seguem separados\nawait pool.query("SELECT id FROM usuarios WHERE email = $1", [email]);\n\n// NoSQL: o corpo { "token": { "$ne": null } } vira um OPERADOR do MongoDB\nawait usuarios.findOne({ resetToken: req.body.token }); // vulnerável\n\n// Correção: validar o tipo antes de consultar\nconst { token } = z.object({ token: z.string() }).parse(req.body);\nawait usuarios.findOne({ resetToken: token }); // sempre uma string',
        nota: "No exemplo vulnerável, `{ $ne: null }` casa com qualquer usuário que tenha um token de redefinição: a consulta devolve outra pessoa.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A regra que vale para qualquer banco",
        texto:
          "A entrada fornece **valores**, do tipo esperado, e nunca a **estrutura** da consulta. Em SQL a estrutura é o texto; no MongoDB é o objeto JSON. Se a entrada pode virar um objeto, ela pode virar um operador. Parametrizar e validar o tipo são duas formas de aplicar a mesma regra.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O parser entrega objetos",
        texto:
          'O `express.json()` já devolve objetos aninhados, e `express.urlencoded({ extended: true })` transforma `campo[$ne]=x` em `{ campo: { $ne: "x" } }`. Por isso o tipo precisa ser validado depois do parsing e antes de a consulta ser montada (veja L43 e L50).',
      },
    ],
    armadilhas: [
      "“Sanitizar” à mão, escapando aspas ou removendo palavras como `DROP`: é frágil e quase sempre contornável. Parametrize.",
      "Parametrizar parte da consulta e concatenar o resto (ordenação, filtros dinâmicos).",
      "Achar que NoSQL ou ORM tornam a aplicação imune: o MongoDB aceita operadores que chegam como objetos, e todo ORM oferece SQL cru.",
      "Passar `req.body` ou `req.query` direto como filtro ou como atualização: a pessoa escolhe campos e operadores que você não previu.",
    ],
    autoteste: [
      {
        pergunta: "Por que a consulta parametrizada impede a injeção de SQL?",
        resposta:
          "Porque o texto do SQL e os valores seguem por caminhos separados: o banco trata o valor sempre como dado, nunca como parte do comando, qualquer que seja o conteúdo.",
      },
      {
        pergunta: "Como `{ $ne: null }` no lugar de um token pode comprometer uma consulta do MongoDB, e como evitar?",
        resposta:
          "O objeto vira um operador (“diferente de nulo”), que casa com praticamente qualquer documento que tenha o campo. Evita-se validando que o campo é uma string e montando o filtro só com campos explícitos.",
      },
    ],
  },
  en: {
    titulo: "SQL and NoSQL injection",
    pergunta: "How do you prevent SQL/NoSQL injection?",
    porqueEsteMetodo:
      "A defense only makes sense once you understand the attack. Each attack → defense pair shows what the attacker controls and which rule takes that control away, in SQL and in NoSQL.",
    resposta30s:
      "The cause is always the same: **user input changes the structure of the query**. In SQL, the defense is the **parameterized query** (values kept apart from the text), with an allowlist for identifiers. In NoSQL such as MongoDB, input can become an **operator** (`{ $ne: null }`), so **validate the type** before querying. In both, use **least privilege** on the database account.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Attack → defense",
        rotuloOrigem: "Attack",
        rotuloDestino: "Defense",
        pares: [
          {
            origem: "Input concatenated or interpolated into the SQL text: `' OR '1'='1`",
            destino:
              "**Parameterized query** (`$1` in `pg`, `?` in `mysql2`). The value travels separately and is never interpreted as SQL.",
          },
          {
            origem: "Table, column or `ORDER BY` coming from input (they cannot be parameterized)",
            destino: "**Allowlist**: map the received option to fixed identifiers that you wrote.",
          },
          {
            origem: "ORM or query builder used with raw SQL (`raw`, `unsafe` methods)",
            destino:
              "Use the library’s parameterized API and review every `raw`/`unsafe`. Using an ORM is not immunity.",
          },
          {
            origem:
              "MongoDB operators coming from input (`{ $ne: null }`, `$gt`, `$regex`) or server-side JavaScript (`$where`)",
            destino:
              "**Validate the type** (text is text, not an object), pick explicit fields instead of passing `req.body` as the filter, and avoid `$where`. Mongoose has a `sanitizeFilter` option; check the documentation.",
          },
          {
            origem: "Database account with too much power",
            destino:
              "**Least privilege**: one account per service, no DDL permission, read-only when possible. It limits the damage if something slips through.",
          },
          {
            origem: "Input outside the expected format and a database error returned to the client",
            destino:
              "Validate type, format and size at the edge (see L50) and answer with a generic error; the detail stays in the internal log.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Value kept apart from the text, and type validated",
        legenda: "JavaScript",
        codigo:
          'import { z } from "zod";\n\n// SQL: the query text and the values travel separately\nawait pool.query("SELECT id FROM users WHERE email = $1", [email]);\n\n// NoSQL: the body { "token": { "$ne": null } } becomes a MongoDB OPERATOR\nawait users.findOne({ resetToken: req.body.token }); // vulnerable\n\n// Fix: validate the type before querying\nconst { token } = z.object({ token: z.string() }).parse(req.body);\nawait users.findOne({ resetToken: token }); // always a string',
        nota: "In the vulnerable example, `{ $ne: null }` matches any user who has a reset token: the query returns somebody else.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The rule that holds for any database",
        texto:
          "Input supplies **values**, of the expected type, and never the **structure** of the query. In SQL the structure is the text; in MongoDB it is the JSON object. If input can become an object, it can become an operator. Parameterizing and validating the type are two ways of applying the same rule.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The parser hands you objects",
        texto:
          '`express.json()` already returns nested objects, and `express.urlencoded({ extended: true })` turns `field[$ne]=x` into `{ field: { $ne: "x" } }`. So the type must be validated after parsing and before the query is built (see L43 and L50).',
      },
    ],
    armadilhas: [
      "“Sanitizing” by hand, escaping quotes or stripping words like `DROP`: it is fragile and almost always bypassable. Parameterize.",
      "Parameterizing part of the query and concatenating the rest (sorting, dynamic filters).",
      "Believing NoSQL or an ORM makes the application immune: MongoDB accepts operators that arrive as objects, and every ORM offers raw SQL.",
      "Passing `req.body` or `req.query` straight in as a filter or an update: the caller picks fields and operators you did not plan for.",
    ],
    autoteste: [
      {
        pergunta: "Why does a parameterized query prevent SQL injection?",
        resposta:
          "Because the SQL text and the values travel on separate paths: the database always treats the value as data, never as part of the command, whatever its content.",
      },
      {
        pergunta: "How can `{ $ne: null }` in place of a token compromise a MongoDB query, and how do you avoid it?",
        resposta:
          "The object becomes an operator (“not equal to null”) that matches almost any document with the field. You avoid it by validating that the field is a string and building the filter only from explicit fields.",
      },
    ],
  },
};
