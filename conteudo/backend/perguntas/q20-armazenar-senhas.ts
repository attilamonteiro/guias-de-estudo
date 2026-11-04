import type { Pergunta } from "../../tipos";

// Q20 · Armazenar senhas
export const q20: Pergunta = {
  numero: 20,
  modulo: "seguranca",
  metodo: "whys",
  pt: {
    titulo: "Armazenar senhas",
    pergunta: "Como você armazenaria as senhas dos usuários de forma segura em um banco de dados?",
    porqueEsteMetodo:
      "Cada exigência da receita (hash, salt, algoritmo lento) é a resposta a uma falha da opção anterior. A cadeia de porquês reconstrói a receita em vez de pedir para decorá-la.",
    resposta30s:
      "Nunca guarde a senha, guarde um **hash lento e salgado**: use **Argon2id** (ou bcrypt/scrypt/PBKDF2) com **salt aleatório único por usuário**, parâmetros de custo ajustados para ~100 a 500 ms por verificação, comparação em tempo constante e **rehash** quando o custo subir. Parta do princípio de que o banco **vai vazar** e faça com que isso custe caro ao atacante. Complemente com MFA, rate limit no login e checagem de senhas vazadas.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que não guardar a senha em texto puro?",
            resposta:
              "Porque um vazamento do banco (SQL injection, backup, funcionário) expõe todas as senhas de uma vez. E como as pessoas reutilizam senhas, o dano passa para outros sites.",
          },
          {
            pergunta: "Por que não criptografar (reversível)?",
            resposta:
              "Porque quem rouba o banco costuma roubar a chave também, e você nunca precisa ler a senha, só verificar se está certa. Então use uma função de mão única: hash.",
          },
          {
            pergunta: "Por que não um hash comum (MD5, SHA-256)?",
            resposta:
              "Porque eles são rápidos por projeto: uma GPU testa bilhões de palpites por segundo, e tabelas pré-computadas (rainbow tables) quebram senhas fracas em minutos.",
          },
          {
            pergunta: "Por que acrescentar um salt?",
            resposta:
              "Sem salt, senhas iguais geram hashes iguais e uma tabela pré-computada serve para todos. Um salt aleatório e único por usuário força o atacante a quebrar uma conta por vez. O salt não é segredo; vai junto do hash.",
          },
          {
            pergunta: "Por que usar um algoritmo deliberadamente lento (Argon2id, bcrypt, scrypt)?",
            resposta:
              "Porque o custo é ajustável: cada verificação leva ~100 a 500 ms, imperceptível para um login legítimo, mas torna a força bruta em escala proibitiva. Argon2 e scrypt exigem muita memória, o que limita GPUs e ASICs.",
          },
        ],
        causaRaiz: "O objetivo não é impedir o vazamento, é **tornar o dano caro e lento** quando ele acontecer.",
      },
      {
        tipo: "tabela",
        titulo: "Receita e parâmetros de referência (OWASP)",
        colunas: ["Algoritmo", "Configuração mínima sugerida"],
        linhas: [
          ["**Argon2id** (preferido)", "Memória ≥ 19 MiB, 2 iterações, 1 de paralelismo (ou 46 MiB e 1 iteração)"],
          ["scrypt", "N = 2¹⁷, r = 8, p = 1"],
          ["bcrypt", "Custo (work factor) ≥ 10; limite de 72 bytes na senha"],
          ["PBKDF2-HMAC-SHA256 (se exigido por norma, como FIPS)", "≥ 600.000 iterações"],
        ],
        nota: "Valores mudam com o hardware: ajuste para que a verificação leve algumas centenas de milissegundos no seu servidor e revise todo ano.",
      },
      {
        tipo: "codigo",
        legenda: "javascript (argon2)",
        codigo:
          'import argon2 from "argon2";\n\n// cadastro: o salt aleatorio e os parametros ficam dentro da string resultante\nconst hash = await argon2.hash(senha, { type: argon2.argon2id });\n// $argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash>\n\n// login: compara em tempo constante e le os parametros da propria string\nconst ok = await argon2.verify(hash, senhaDigitada);\nif (ok && argon2.needsRehash(hash)) { /* gravar um hash novo */ }',
      },
      {
        tipo: "passos",
        titulo: "Além do hash",
        passos: [
          {
            titulo: "Pepper (opcional)",
            texto:
              "Um segredo global, guardado fora do banco (cofre/HSM), misturado antes do hash. Se só o banco vazar, o atacante não consegue testar palpites.",
          },
          {
            titulo: "Política de senha moderna",
            texto:
              "Mínimo de comprimento (12+ ou frase longa) vale mais que regras de símbolos; verifique contra senhas vazadas (HIBP, com k-anonymity).",
          },
          {
            titulo: "MFA e rate limit",
            texto: "Um segundo fator e limite de tentativas anulam grande parte dos ataques mesmo com senha fraca.",
          },
          {
            titulo: "Fluxos auxiliares",
            texto:
              "Reset por token de uso único e vida curta; mensagens de erro genéricas (“usuário ou senha inválidos”); nunca registrar senha em log.",
          },
        ],
      },
    ],
    armadilhas: [
      "`SHA256(senha + salt)` ainda é rápido demais: o salt resolve as tabelas pré-computadas, não a força bruta.",
      "Inventar o próprio esquema (“hash de hash”): use bibliotecas padrão e aprovadas.",
      "Comparar hashes com `==` (vazamento por tempo); use a função de verificação da biblioteca.",
      "Esquecer que o bcrypt trunca em 72 bytes e que senhas muito longas precisam de tratamento.",
      "Nunca atualizar os parâmetros: faça rehash no login quando o custo recomendado subir.",
    ],
    autoteste: [
      {
        pergunta: "Qual a função do salt e ele é secreto?",
        resposta:
          "Torna cada hash único e inutiliza tabelas pré-computadas, forçando o ataque conta a conta. Não é secreto: fica junto do hash.",
      },
      {
        pergunta: "Por que um hash de senha deve ser lento enquanto um hash de arquivo deve ser rápido?",
        resposta:
          "Para verificar integridade, velocidade é uma qualidade. Para senhas, a velocidade ajuda o atacante: cada palpite deve custar caro.",
      },
    ],
  },
  en: {
    titulo: "Storing passwords",
    pergunta: "How would you securely store users’ passwords in a database?",
    porqueEsteMetodo:
      "Each requirement of the recipe (hash, salt, slow algorithm) answers a failure of the previous option. A chain of whys rebuilds the recipe instead of asking you to memorize it.",
    resposta30s:
      "Never store the password, store a **slow, salted hash**: use **Argon2id** (or bcrypt/scrypt/PBKDF2) with a **unique random salt per user**, cost parameters tuned to ~100 to 500 ms per verification, constant-time comparison and **rehash** when the cost goes up. Assume the database **will leak** and make that expensive for the attacker. Complement with MFA, login rate limiting and breached-password checks.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why not store the password in plain text?",
            resposta:
              "Because a database leak (SQL injection, backup, insider) exposes every password at once. And since people reuse passwords, the damage spreads to other sites.",
          },
          {
            pergunta: "Why not encrypt it (reversible)?",
            resposta:
              "Because whoever steals the database usually steals the key too, and you never need to read the password, only check that it is right. So use a one-way function: a hash.",
          },
          {
            pergunta: "Why not an ordinary hash (MD5, SHA-256)?",
            resposta:
              "Because they are fast by design: a GPU tests billions of guesses per second, and precomputed tables (rainbow tables) crack weak passwords in minutes.",
          },
          {
            pergunta: "Why add a salt?",
            resposta:
              "Without a salt, equal passwords give equal hashes and one precomputed table serves everyone. A random, per-user salt forces the attacker to crack one account at a time. The salt is not secret; it travels with the hash.",
          },
          {
            pergunta: "Why use a deliberately slow algorithm (Argon2id, bcrypt, scrypt)?",
            resposta:
              "Because the cost is tunable: each verification takes ~100 to 500 ms, imperceptible for a legitimate login but prohibitive for brute force at scale. Argon2 and scrypt need lots of memory, which limits GPUs and ASICs.",
          },
        ],
        causaRaiz:
          "The goal is not to prevent the leak, it is to **make the damage expensive and slow** when it happens.",
      },
      {
        tipo: "tabela",
        titulo: "Recipe and reference parameters (OWASP)",
        colunas: ["Algorithm", "Suggested minimum configuration"],
        linhas: [
          ["**Argon2id** (preferred)", "Memory ≥ 19 MiB, 2 iterations, parallelism 1 (or 46 MiB and 1 iteration)"],
          ["scrypt", "N = 2¹⁷, r = 8, p = 1"],
          ["bcrypt", "Cost (work factor) ≥ 10; 72-byte password limit"],
          ["PBKDF2-HMAC-SHA256 (if required by a standard such as FIPS)", "≥ 600,000 iterations"],
        ],
        nota: "Values change with hardware: tune so verification takes a few hundred milliseconds on your server and review yearly.",
      },
      {
        tipo: "codigo",
        legenda: "javascript (argon2)",
        codigo:
          'import argon2 from "argon2";\n\n// signup: the random salt and the parameters live inside the resulting string\nconst hash = await argon2.hash(password, { type: argon2.argon2id });\n// $argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash>\n\n// login: constant-time comparison; reads parameters from the string itself\nconst ok = await argon2.verify(hash, typedPassword);\nif (ok && argon2.needsRehash(hash)) { /* store a fresh hash */ }',
      },
      {
        tipo: "passos",
        titulo: "Beyond the hash",
        passos: [
          {
            titulo: "Pepper (optional)",
            texto:
              "A global secret kept outside the database (vault/HSM), mixed in before hashing. If only the database leaks, the attacker cannot test guesses.",
          },
          {
            titulo: "Modern password policy",
            texto:
              "A minimum length (12+ or a long passphrase) beats symbol rules; check against breached passwords (HIBP, using k-anonymity).",
          },
          {
            titulo: "MFA and rate limiting",
            texto: "A second factor and attempt limits neutralize most attacks even with a weak password.",
          },
          {
            titulo: "Supporting flows",
            texto:
              "Reset via a single-use, short-lived token; generic error messages (“invalid username or password”); never log passwords.",
          },
        ],
      },
    ],
    armadilhas: [
      "`SHA256(password + salt)` is still too fast: the salt solves precomputed tables, not brute force.",
      "Inventing your own scheme (“hash of a hash”): use standard, vetted libraries.",
      "Comparing hashes with `==` (timing leak); use the library’s verify function.",
      "Forgetting bcrypt truncates at 72 bytes and very long passwords need handling.",
      "Never updating the parameters: rehash on login when the recommended cost rises.",
    ],
    autoteste: [
      {
        pergunta: "What does the salt do and is it secret?",
        resposta:
          "It makes each hash unique and defeats precomputed tables, forcing account-by-account attacks. It is not secret: it is stored with the hash.",
      },
      {
        pergunta: "Why must a password hash be slow while a file hash should be fast?",
        resposta:
          "For integrity checks, speed is a virtue. For passwords, speed helps the attacker: every guess must be expensive.",
      },
    ],
  },
};
