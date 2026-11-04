import type { Pergunta } from "../../tipos";

// Q17 · Segurança no Node.js
export const q17: Pergunta = {
  numero: 17,
  modulo: "turing-basicas",
  metodo: "threat",
  pt: {
    titulo: "Segurança no Node.js",
    pergunta: "Quais são as principais implementações de segurança no Node JS?",
    porqueEsteMetodo:
      "Decorar uma lista de defesas vira ritual. Mostrar a falha e a causa e só depois ligar cada ameaça à defesa que a neutraliza mantém o raciocínio, e aqui o foco são as ameaças típicas do ecossistema Node (npm, prototype pollution, laço de eventos).",
    resposta30s:
      "Segurança em Node.js é **defesa em camadas**: validar e parametrizar toda entrada (contra injeção), escapar a saída e usar CSP (contra XSS), manter as **dependências sob controle** (`npm audit`, lockfile, atualizações), guardar **segredos fora do código**, limitar corpo, taxa e tempo (contra negação de serviço), usar **HTTPS e `helmet`** e nunca executar entrada como código (`eval`, `exec` com string montada). O Node.js não é seguro nem inseguro por padrão: as falhas costumam estar na aplicação e nos pacotes.",
    blocos: [
      {
        tipo: "codigo",
        titulo: "Uma falha típica de Node: prototype pollution",
        legenda: "JavaScript (vulnerável)",
        codigo: `// mescla recursivamente a entrada do usuário no destino
function mesclar(destino, origem) {
  for (const chave in origem) {
    if (typeof origem[chave] === "object") {
      destino[chave] = mesclar(destino[chave] ?? {}, origem[chave]);
    } else {
      destino[chave] = origem[chave];
    }
  }
  return destino;
}

mesclar({}, JSON.parse('{"__proto__": {"admin": true}}'));
console.log({}.admin); // true: todo objeto novo "herdou" admin`,
        nota: "Causa-raiz: dados externos decidiram o nome de uma propriedade, e `__proto__` aponta para o protótipo compartilhado por todos os objetos. Uma única requisição altera o comportamento de todo o processo.",
      },
      {
        tipo: "pares",
        titulo: "Ameaça → defesa",
        rotuloOrigem: "Ameaça",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "Injeção: entrada concatenada em SQL, ou objeto de operadores (`{ $ne: null }`) aceito como filtro de consulta NoSQL",
            destino:
              "**Consultas parametrizadas** e validação do tipo e do formato da entrada com um esquema (por exemplo zod ou Ajv) antes de tocar no banco.",
          },
          {
            origem: "XSS: entrada do usuário inserida no HTML sem escape",
            destino:
              "Escape automático na saída (template engines que escapam por padrão), **CSP** por cabeçalho e cookies de sessão `HttpOnly`. Nunca montar HTML por concatenação.",
          },
          {
            origem:
              "Dependências vulneráveis ou maliciosas (falha conhecida, nome parecido, script de instalação) e runtime desatualizado",
            destino:
              "`npm audit` e atualizações regulares, **lockfile versionado e `npm ci`** nas builds, poucas dependências, revisão de pacotes novos, `--ignore-scripts` onde couber e o Node.js numa versão com correções de segurança (LTS).",
          },
          {
            origem: "Segredos no código ou no repositório (chaves, senhas, tokens)",
            destino:
              "Variáveis de ambiente ou cofre de segredos, `.env` fora do Git, nada de segredo em log e rotação imediata do que vazou.",
          },
          {
            origem:
              "Negação de serviço: corpo gigante, excesso de requisições, regex com backtracking catastrófico que bloqueia o laço de eventos",
            destino:
              "Limite o tamanho do corpo, defina timeouts, aplique **rate limit**, revise regex (sem repetições aninhadas) e limite o tamanho do texto que elas recebem.",
          },
          {
            origem: "Prototype pollution: `__proto__` ou `constructor` em JSON mesclado em objetos",
            destino:
              "Validar por esquema, não mesclar recursivamente entrada não confiável, usar `Map` ou `Object.create(null)` para dicionários com chaves vindas do usuário e manter atualizadas as bibliotecas de mesclagem.",
          },
          {
            origem: "Tráfego sem criptografia e cabeçalhos fracos",
            destino:
              "HTTPS (TLS no proxy ou balanceador), **`helmet`** para os cabeçalhos de segurança, cookies `Secure`, `HttpOnly` e `SameSite`, e CORS restrito às origens conhecidas.",
          },
          {
            origem: "Entrada executada como código: `eval`, `new Function`, `child_process.exec` com string montada",
            destino:
              "Nunca use `eval`. Use `execFile` ou `spawn` com **argumentos em array** (sem shell). O módulo `vm` não é um sandbox de segurança.",
          },
          {
            origem: "Path traversal: nome de arquivo vindo da requisição (`../../etc/passwd`)",
            destino:
              "Resolva o caminho com `path.resolve` e confira que ele continua dentro da pasta permitida; de preferência, use identificadores em vez de nomes de arquivo.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Camadas básicas num servidor Express",
        legenda: "JavaScript (Express)",
        codigo: `import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
app.use(helmet()); // cabeçalhos de segurança
app.use(rateLimit({ windowMs: 60_000, limit: 100 })); // 100 requisições por minuto por cliente
app.use(express.json({ limit: "100kb" })); // corpo máximo

app.get("/usuarios", async (req, res) => {
  const email = String(req.query.email ?? ""); // garante que é texto
  // parametrizada: o valor nunca vira SQL
  const { rows } = await db.query("SELECT id, nome FROM usuarios WHERE email = $1", [email]);
  res.json(rows);
});`,
        nota: "Os nomes das opções do `express-rate-limit` mudaram entre versões; confira a documentação da versão que você instalou.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Defesa em camadas",
        texto:
          "Nenhuma defesa isolada basta. Valide na entrada, escape na saída, dê o menor privilégio ao processo e à conta do banco, mantenha tudo atualizado e registre o suficiente para investigar. O guia de backend trata injeção e autenticação em linguagem geral; o que é próprio do Node é a superfície do npm e o laço de eventos único, que um único pedido caro pode bloquear. Senhas pedem hash lento (veja Q46).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cada pacote é código seu",
        texto:
          "Tudo o que você instala roda com as mesmas permissões do seu processo, e as dependências das dependências também. `helmet` e afins ajudam, mas não corrigem código vulnerável. Menos dependências, versões fixadas pelo lockfile e atualização constante reduzem a superfície de ataque.",
      },
    ],
    armadilhas: [
      "Achar que o Node.js, ou um middleware como o `helmet`, “já cuida” da segurança sozinho.",
      "Concatenar entrada em SQL, em comandos de shell ou em caminhos de arquivo.",
      "Deixar o `.env` ou uma chave no repositório, mesmo que “só por enquanto”.",
      "Ignorar o `npm audit` e os avisos de atualização, ou instalar um pacote só pelo nome sem checar mantenedor e origem.",
    ],
    autoteste: [
      {
        pergunta: "Como funciona a prototype pollution e como evitá-la?",
        resposta:
          "Uma chave como `__proto__` vinda da entrada altera o protótipo compartilhado por todos os objetos. Evite mesclar recursivamente entrada não confiável, valide por esquema e use `Map` ou `Object.create(null)` para chaves vindas do usuário.",
      },
      {
        pergunta: "Por que preferir `execFile` ou `spawn` a `exec` com entrada do usuário?",
        resposta:
          "O `exec` passa uma string por um shell, e metacaracteres da entrada viram comandos. Com argumentos em array e sem shell, a entrada é só dado.",
      },
      {
        pergunta: "Que práticas reduzem o risco das dependências?",
        resposta:
          "`npm audit`, lockfile versionado com `npm ci`, poucas dependências, revisão de pacotes novos, `--ignore-scripts` onde couber e atualizações regulares do Node.js e dos pacotes.",
      },
    ],
  },
  en: {
    titulo: "Node.js security",
    pergunta: "What are the main security implementations in Node.js?",
    porqueEsteMetodo:
      "Memorizing a list of defenses becomes ritual. Showing the flaw and its cause first, and only then tying each threat to the defense that neutralizes it, keeps the reasoning alive; here the focus is on threats typical of the Node ecosystem (npm, prototype pollution, the event loop).",
    resposta30s:
      "Node.js security is **defense in depth**: validate and parameterize all input (against injection), escape output and use CSP (against XSS), keep **dependencies under control** (`npm audit`, lockfile, updates), keep **secrets out of the code**, limit body, rate and time (against denial of service), use **HTTPS and `helmet`** and never run input as code (`eval`, `exec` with a built string). Node.js is neither secure nor insecure by default: the flaws usually live in the application and its packages.",
    blocos: [
      {
        tipo: "codigo",
        titulo: "A typical Node flaw: prototype pollution",
        legenda: "JavaScript (vulnerable)",
        codigo: `// recursively merges user input into the target
function merge(target, source) {
  for (const key in source) {
    if (typeof source[key] === "object") {
      target[key] = merge(target[key] ?? {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

merge({}, JSON.parse('{"__proto__": {"admin": true}}'));
console.log({}.admin); // true: every new object "inherited" admin`,
        nota: "Root cause: external data decided the name of a property, and `__proto__` points to the prototype shared by all objects. A single request changes the behavior of the whole process.",
      },
      {
        tipo: "pares",
        titulo: "Threat → defense",
        rotuloOrigem: "Threat",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "Injection: input concatenated into SQL, or an operator object (`{ $ne: null }`) accepted as a NoSQL query filter",
            destino:
              "**Parameterized queries** and validation of the input’s type and format with a schema (for example zod or Ajv) before touching the database.",
          },
          {
            origem: "XSS: user input inserted into HTML without escaping",
            destino:
              "Automatic output escaping (template engines that escape by default), a **CSP** header and `HttpOnly` session cookies. Never build HTML by concatenation.",
          },
          {
            origem:
              "Vulnerable or malicious dependencies (known flaw, look-alike name, install script) and an outdated runtime",
            destino:
              "`npm audit` and regular updates, a **committed lockfile and `npm ci`** in builds, few dependencies, review of new packages, `--ignore-scripts` where it fits and Node.js on a version that receives security fixes (LTS).",
          },
          {
            origem: "Secrets in the code or the repository (keys, passwords, tokens)",
            destino:
              "Environment variables or a secrets vault, `.env` kept out of Git, no secrets in logs and immediate rotation of anything that leaked.",
          },
          {
            origem:
              "Denial of service: giant bodies, too many requests, a regex with catastrophic backtracking that blocks the event loop",
            destino:
              "Limit the body size, set timeouts, apply **rate limiting**, review regexes (no nested repetitions) and cap the length of the text they receive.",
          },
          {
            origem: "Prototype pollution: `__proto__` or `constructor` in JSON merged into objects",
            destino:
              "Validate by schema, do not recursively merge untrusted input, use `Map` or `Object.create(null)` for dictionaries with user-supplied keys and keep merge libraries up to date.",
          },
          {
            origem: "Unencrypted traffic and weak headers",
            destino:
              "HTTPS (TLS at the proxy or load balancer), **`helmet`** for security headers, `Secure`, `HttpOnly` and `SameSite` cookies, and CORS restricted to known origins.",
          },
          {
            origem: "Input executed as code: `eval`, `new Function`, `child_process.exec` with a built string",
            destino:
              "Never use `eval`. Use `execFile` or `spawn` with **arguments in an array** (no shell). The `vm` module is not a security sandbox.",
          },
          {
            origem: "Path traversal: a file name coming from the request (`../../etc/passwd`)",
            destino:
              "Resolve the path with `path.resolve` and check that it stays inside the allowed folder; better still, use identifiers instead of file names.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Basic layers in an Express server",
        legenda: "JavaScript (Express)",
        codigo: `import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
app.use(helmet()); // security headers
app.use(rateLimit({ windowMs: 60_000, limit: 100 })); // 100 requests per minute per client
app.use(express.json({ limit: "100kb" })); // maximum body size

app.get("/users", async (req, res) => {
  const email = String(req.query.email ?? ""); // make sure it is text
  // parameterized: the value never becomes SQL
  const { rows } = await db.query("SELECT id, name FROM users WHERE email = $1", [email]);
  res.json(rows);
});`,
        nota: "The option names of `express-rate-limit` have changed across versions; check the documentation for the version you installed.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Defense in depth",
        texto:
          "No single defense is enough. Validate on the way in, escape on the way out, give the process and the database account the least privilege, keep everything updated and log enough to investigate. The backend guide covers injection and authentication in general terms; what is specific to Node is the npm attack surface and the single event loop, which one expensive request can block. Passwords need slow hashing (see Q46).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Every package is your code",
        texto:
          "Everything you install runs with the same permissions as your process, and so do the dependencies of dependencies. `helmet` and friends help, but they do not fix vulnerable code. Fewer dependencies, versions pinned by the lockfile and constant updating shrink the attack surface.",
      },
    ],
    armadilhas: [
      "Believing Node.js, or a middleware like `helmet`, “already takes care” of security on its own.",
      "Concatenating input into SQL, shell commands or file paths.",
      "Leaving `.env` or a key in the repository, even “just for now”.",
      "Ignoring `npm audit` and update warnings, or installing a package by name alone without checking its maintainer and origin.",
    ],
    autoteste: [
      {
        pergunta: "How does prototype pollution work and how do you avoid it?",
        resposta:
          "A key such as `__proto__` coming from input changes the prototype shared by all objects. Avoid recursively merging untrusted input, validate by schema and use `Map` or `Object.create(null)` for user-supplied keys.",
      },
      {
        pergunta: "Why prefer `execFile` or `spawn` over `exec` with user input?",
        resposta:
          "`exec` passes a string through a shell, so metacharacters in the input become commands. With arguments in an array and no shell, the input is just data.",
      },
      {
        pergunta: "Which practices reduce dependency risk?",
        resposta:
          "`npm audit`, a committed lockfile with `npm ci`, few dependencies, review of new packages, `--ignore-scripts` where it fits and regular updates of Node.js and packages.",
      },
    ],
  },
};
