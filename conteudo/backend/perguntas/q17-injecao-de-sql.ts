import type { Pergunta } from "../../tipos";

// Q17 · Injeção de SQL
export const q17: Pergunta = {
  numero: 17,
  modulo: "seguranca",
  metodo: "threat",
  pt: {
    titulo: "Injeção de SQL",
    pergunta: "Como você previne ataques de injeção SQL?",
    porqueEsteMetodo:
      "Em segurança, defender sem entender o ataque vira ritual. Primeiro mostra-se como a falha acontece e qual é a causa; depois cada defesa mira numa parte dessa causa.",
    resposta30s:
      "A injeção acontece quando **dado do usuário é interpretado como código SQL**, porque a consulta foi montada por concatenação de strings. A defesa principal é **consulta parametrizada (prepared statement)**, que separa código e dados no protocolo do banco. Some a isso: allowlist para o que não se parametriza (nomes de coluna, `ORDER BY`), **privilégio mínimo** na conta do banco, validação de entrada, erros genéricos e testes/WAF como rede de segurança.",
    blocos: [
      {
        tipo: "codigo",
        titulo: "Como o ataque acontece",
        legenda: "ataque",
        codigo:
          "consulta = \"SELECT * FROM users WHERE email = '\" + email + \"'\"\n\n# entrada do atacante:  ' OR '1'='1' --\n# consulta final:       SELECT * FROM users WHERE email = '' OR '1'='1' --'\n# -> condição sempre verdadeira: devolve todos os usuários (ou faz login sem senha)\n\n# outras variações: UNION SELECT (extrair outras tabelas),\n# '; DROP TABLE users; --  (empilhar comandos), blind/time-based (inferir bit a bit)",
        nota: "Causa-raiz: dado e código viajam pelo mesmo canal (a string). O banco não tem como saber onde termina a intenção do programador e começa a entrada do usuário.",
      },
      {
        tipo: "codigo",
        titulo: "A correção principal",
        legenda: "javascript (node-postgres)",
        codigo:
          '// vulneravel\ndb.query("SELECT * FROM users WHERE email = \'" + email + "\'")\n\n// parametrizada: o banco recebe o SQL e o valor separadamente\ndb.query("SELECT * FROM users WHERE email = $1", [email])',
      },
      {
        tipo: "pares",
        titulo: "Ameaça → defesa",
        rotuloOrigem: "Falha",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem: "Concatenar entrada na string SQL",
            destino:
              "**Queries parametrizadas / prepared statements.** Defesa principal; o valor nunca é interpretado como SQL.",
          },
          {
            origem: "ORM usado com SQL cru (raw query)",
            destino: "Usar a API parametrizada do ORM; revisar todo `raw`/`unsafe`. Usar ORM não é imunidade.",
          },
          {
            origem: "Nome de tabela, coluna ou `ORDER BY` vindo da entrada (não se parametriza)",
            destino: "**Allowlist**: mapear o valor para uma lista fixa de identificadores aceitos.",
          },
          {
            origem: "Conta do banco com poder demais",
            destino:
              "**Privilégio mínimo**: sem `DROP`/DDL, contas separadas, somente leitura quando possível. Limita o estrago se algo falhar.",
          },
          {
            origem: "Entrada inesperada",
            destino: "Validação de tipo, formato e tamanho (defesa em profundidade; nunca a defesa única).",
          },
          {
            origem: "Mensagem de erro do banco devolvida ao cliente",
            destino: "Erro genérico ao cliente, detalhe só no log interno. O erro detalhado revela o esquema.",
          },
          {
            origem: "Stored procedure com SQL dinâmico concatenado",
            destino: "Parametrizar também dentro da procedure (`EXECUTE ... USING`).",
          },
          {
            origem: "Falha que escapou",
            destino:
              "SAST/DAST (por exemplo `sqlmap` em ambiente de teste), revisão de código, WAF como camada extra, alertas para padrões suspeitos.",
          },
        ],
      },
    ],
    armadilhas: [
      "“Sanitizar” trocando aspas por escape manual: é frágil e quase sempre contornável.",
      "Parametrizar só parte da consulta e concatenar o resto.",
      "Validar apenas no front-end: o atacante chama a API direto.",
      "Achar que o ORM torna a aplicação imune: o ponto fraco é o SQL cru e o `ORDER BY` dinâmico.",
      "Nome de coluna ou direção de ordenação vindos da URL sem allowlist.",
    ],
    autoteste: [
      {
        pergunta: "Por que a consulta parametrizada impede a injeção?",
        resposta:
          "Porque o texto do SQL e os valores seguem por caminhos separados; o banco compila a consulta antes de receber o valor, que nunca é interpretado como código.",
      },
      {
        pergunta: "O que fazer quando o nome da coluna de ordenação vem do usuário?",
        resposta:
          "Não dá para parametrizar identificadores; use uma allowlist que mapeia opções válidas para identificadores fixos.",
      },
    ],
  },
  en: {
    titulo: "SQL injection",
    pergunta: "How do you prevent SQL injection attacks?",
    porqueEsteMetodo:
      "In security, defending without understanding the attack becomes ritual. First show how the flaw happens and what its cause is; then each defense targets part of that cause.",
    resposta30s:
      "Injection happens when **user data is interpreted as SQL code**, because the query was built by string concatenation. The primary defense is the **parameterized query (prepared statement)**, which separates code and data at the database protocol level. Add: an allowlist for what cannot be parameterized (column names, `ORDER BY`), **least privilege** on the database account, input validation, generic errors, and tests/WAF as a safety net.",
    blocos: [
      {
        tipo: "codigo",
        titulo: "How the attack happens",
        legenda: "attack",
        codigo:
          "query = \"SELECT * FROM users WHERE email = '\" + email + \"'\"\n\n# attacker input:  ' OR '1'='1' --\n# final query:     SELECT * FROM users WHERE email = '' OR '1'='1' --'\n# -> always-true condition: returns every user (or logs in without a password)\n\n# other variations: UNION SELECT (extract other tables),\n# '; DROP TABLE users; --  (stacked commands), blind/time-based (infer bit by bit)",
        nota: "Root cause: data and code travel through the same channel (the string). The database cannot know where the programmer’s intent ends and the user’s input begins.",
      },
      {
        tipo: "codigo",
        titulo: "The main fix",
        legenda: "javascript (node-postgres)",
        codigo:
          '// vulnerable\ndb.query("SELECT * FROM users WHERE email = \'" + email + "\'")\n\n// parameterized: the database receives the SQL and the value separately\ndb.query("SELECT * FROM users WHERE email = $1", [email])',
      },
      {
        tipo: "pares",
        titulo: "Threat → defense",
        rotuloOrigem: "Flaw",
        rotuloDestino: "Defense",
        pares: [
          {
            origem: "Concatenating input into the SQL string",
            destino:
              "**Parameterized queries / prepared statements.** The main defense; the value is never interpreted as SQL.",
          },
          {
            origem: "ORM used with raw SQL",
            destino: "Use the ORM’s parameterized API; review every `raw`/`unsafe`. Using an ORM is not immunity.",
          },
          {
            origem: "Table, column or `ORDER BY` coming from input (cannot be parameterized)",
            destino: "**Allowlist**: map the value to a fixed list of accepted identifiers.",
          },
          {
            origem: "Database account with too much power",
            destino:
              "**Least privilege**: no `DROP`/DDL, separate accounts, read-only when possible. Limits damage if something fails.",
          },
          {
            origem: "Unexpected input",
            destino: "Validate type, format and size (defense in depth; never the only defense).",
          },
          {
            origem: "Database error message returned to the client",
            destino:
              "Generic error to the client, detail only in the internal log. A detailed error reveals the schema.",
          },
          {
            origem: "Stored procedure with concatenated dynamic SQL",
            destino: "Parameterize inside the procedure too (`EXECUTE ... USING`).",
          },
          {
            origem: "A flaw that slipped through",
            destino:
              "SAST/DAST (for example `sqlmap` in a test environment), code review, a WAF as an extra layer, alerts for suspicious patterns.",
          },
        ],
      },
    ],
    armadilhas: [
      "“Sanitizing” by manually escaping quotes: fragile and almost always bypassable.",
      "Parameterizing only part of the query and concatenating the rest.",
      "Validating only in the front end: the attacker calls the API directly.",
      "Believing the ORM makes the app immune: the weak spot is raw SQL and dynamic `ORDER BY`.",
      "Column name or sort direction from the URL without an allowlist.",
    ],
    autoteste: [
      {
        pergunta: "Why does a parameterized query prevent injection?",
        resposta:
          "Because the SQL text and the values travel separately; the database compiles the query before receiving the value, which is never interpreted as code.",
      },
      {
        pergunta: "What do you do when the sort column name comes from the user?",
        resposta: "Identifiers cannot be parameterized; use an allowlist that maps valid options to fixed identifiers.",
      },
    ],
  },
};
