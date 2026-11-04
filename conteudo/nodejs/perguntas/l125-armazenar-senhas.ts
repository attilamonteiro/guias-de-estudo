import type { Pergunta } from "../../tipos";

// L125 · Armazenar senhas
export const l125: Pergunta = {
  numero: 225,
  modulo: "linkedin-seguranca",
  metodo: "firstprinciples",
  pt: {
    titulo: "Armazenar senhas",
    pergunta: "Como armazenar senhas com segurança?",
    porqueEsteMetodo:
      "O esquema correto parece uma receita arbitrária (sal, hash lento, parâmetros) até você ver cada ingrediente nascer de um ataque. Partir do texto puro e consertar uma falha por vez mostra por que ele é assim.",
    resposta30s:
      "Nunca guarde a senha em texto puro nem cifrada de forma reversível: guarde só o resultado de um **hash lento, com sal único por senha**, usando **argon2id, scrypt ou bcrypt**, junto dos parâmetros usados. No login, recalcule o hash e compare em **tempo constante**, e faça **rehash** quando os parâmetros ficarem fracos. No Node.js, `crypto.scrypt` já vem embutido; no mais, prefira bibliotecas mantidas a esquemas feitos em casa.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma falha por vez",
        passos: [
          {
            titulo: "0. O que se quer",
            texto:
              "O servidor só precisa **verificar** uma senha, nunca **recuperá-la**. O cenário a vencer é o vazamento da tabela de usuários (backup, injeção de SQL, acesso indevido): quem a levar não deve conseguir as senhas.",
          },
          {
            titulo: "1. A versão mais simples: texto puro",
            texto:
              "Guardar a senha como veio. → Quebra: um vazamento entrega todas as contas, e como muita gente reutiliza senhas, o estrago passa para outros sites. Quem tem acesso à base também as lê.",
          },
          {
            titulo: "2. Cifrar a senha",
            texto:
              "Cifrar com uma chave parece resolver. → Quebra: o servidor precisa da chave para decifrar, então quem invade o servidor costuma levar as duas coisas, e a reversibilidade nunca foi necessária. Conserto: uma função de **mão única**.",
          },
          {
            titulo: "3. Hash simples (SHA-256, por exemplo)",
            texto:
              "Guardar `hash(senha)` e repetir o cálculo no login. → Quebra: senhas iguais geram hashes iguais (dá para ver quem repete e atacar todas de uma vez), existem tabelas pré-calculadas de senhas comuns, e esses hashes são **rápidos de propósito**: o atacante testa uma quantidade enorme de palpites por segundo.",
          },
          {
            titulo: "4. Sal único por senha",
            texto:
              "Gerar um valor aleatório por senha (`randomBytes`), misturá-lo antes do hash e guardá-lo ao lado do resultado. O sal não é segredo. → Resolve: senhas iguais viram hashes diferentes e as tabelas pré-calculadas perdem o valor. → Ainda quebra: cada palpite continua barato.",
          },
          {
            titulo: "5. Hash lento e ajustável",
            texto:
              "Usar uma função feita para senhas (**argon2id, scrypt, bcrypt**), cujo custo em tempo (e, nas duas primeiras, em memória) é um parâmetro. Quem faz login paga uma vez e nem percebe; quem testa milhões de palpites paga a cada um. → Quebra: o hardware melhora com os anos, e um custo alto demais vira porta para negação de serviço (veja L49).",
          },
          {
            titulo: "6. Verificar, migrar e não bloquear",
            texto:
              "Grave algoritmo, parâmetros e sal junto do hash. No login, recalcule com os mesmos parâmetros, compare com `timingSafeEqual` e dê a mesma resposta para usuário inexistente e senha errada. Se os parâmetros ficaram fracos, faça **rehash** quando a senha correta chegar. No Node.js use a versão assíncrona, que roda no pool de threads (veja T43), e não a `scryptSync`.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Hash e verificação com scrypt",
        legenda: "JavaScript",
        codigo:
          'import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";\nimport { promisify } from "node:util";\n\nconst derivar = promisify(scrypt);\n\nexport async function criarHash(senha) {\n  const sal = randomBytes(16); // único por senha\n  const chave = await derivar(senha, sal, 64);\n  return [sal, chave].map((b) => b.toString("base64")).join(":");\n}\n\nexport async function conferir(senha, guardado) {\n  const [sal, esperado] = guardado.split(":").map((s) => Buffer.from(s, "base64"));\n  const obtido = await derivar(senha, sal, esperado.length);\n  return timingSafeEqual(obtido, esperado); // tempo constante\n}',
        nota: "Os parâmetros de custo ficam nos padrões do Node.js só para simplificar. Em produção, grave algoritmo e parâmetros junto do hash (para poder fazer rehash) e confira a recomendação atual do OWASP. Veja também T46.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra",
        texto:
          "Guarde só **algoritmo + parâmetros + sal + hash** de uma função lenta própria para senhas. Texto puro, cifra reversível e SHA ou MD5 simples estão todos errados. **Argon2id** costuma ser a primeira escolha; scrypt e bcrypt continuam aceitos. Confira a recomendação atual do OWASP e a documentação de `node:crypto` (nodejs.org) para saber o que a sua versão do Node.js já oferece.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O hash protege a base, não a conta",
        texto:
          "Hash lento dificulta quebrar uma **base vazada**; não impede alguém de adivinhar senhas online nem o phishing. Complemente com limite de tentativas (veja L49), MFA, tamanho mínimo razoável e checagem contra senhas já vazadas. Nunca invente o seu esquema: base64 é codificação, não proteção, e um segredo extra no servidor (pepper) é reforço opcional, nunca substituto do sal.",
      },
    ],
    armadilhas: [
      "Chamar de “criptografar a senha” o que deveria ser hash: a cifra é reversível e a chave costuma vazar junto com a base.",
      "Usar MD5, SHA-1 ou SHA-256 puro, mesmo com sal: são rápidos demais contra força bruta.",
      "Reaproveitar um sal fixo para todas as contas, ou comparar hashes com `===` em vez de `timingSafeEqual`.",
      "Usar `scryptSync` (ou outra versão `Sync`) no login e bloquear o laço de eventos, ou fixar um custo alto sem limitar as tentativas e abrir porta para negação de serviço.",
    ],
    autoteste: [
      {
        pergunta: "Se o hash já é de mão única, para que serve o sal?",
        resposta:
          "Para que o mesmo texto não gere o mesmo hash em contas diferentes e para tornar inúteis as tabelas pré-calculadas: o atacante precisa atacar cada senha separadamente. O sal não é segredo e é guardado junto do hash.",
      },
      {
        pergunta: "Por que lentidão é uma qualidade aqui, se para um checksum de arquivo queremos rapidez?",
        resposta:
          "Na senha, quem mais se prejudica com o custo é o atacante, que precisa de milhões de tentativas; a pessoa legítima faz uma por login. Num checksum não há adversário testando palpites, então a velocidade só traz vantagem.",
      },
    ],
  },
  en: {
    titulo: "Storing passwords",
    pergunta: "How do you securely store passwords?",
    porqueEsteMetodo:
      "The right scheme looks like an arbitrary recipe (salt, slow hash, parameters) until you watch each ingredient appear in response to an attack. Starting from plain text and fixing one flaw at a time shows why it ends up this way.",
    resposta30s:
      "Never store a password in plain text or encrypted in a reversible way: store only the output of a **slow hash with a unique salt per password**, using **argon2id, scrypt or bcrypt**, together with the parameters used. At login, recompute the hash and compare in **constant time**, and **rehash** when the parameters grow weak. Node.js ships `crypto.scrypt`; beyond that, prefer maintained libraries over home-grown schemes.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one flaw at a time",
        passos: [
          {
            titulo: "0. What you want",
            texto:
              "The server only needs to **verify** a password, never to **recover** it. The scenario to survive is a leaked user table (backup, SQL injection, unauthorized access): whoever takes it must not get the passwords.",
          },
          {
            titulo: "1. The simplest version: plain text",
            texto:
              "Store the password as typed. → Breaks: one leak hands over every account, and since many people reuse passwords, the damage spreads to other sites. Anyone with database access can read them too.",
          },
          {
            titulo: "2. Encrypt the password",
            texto:
              "Encrypting with a key seems to fix it. → Breaks: the server needs the key to decrypt, so whoever breaks into the server usually gets both, and reversibility was never needed. The fix: a **one-way** function.",
          },
          {
            titulo: "3. A plain hash (SHA-256, for example)",
            texto:
              "Store `hash(password)` and repeat the computation at login. → Breaks: equal passwords give equal hashes (you can see who repeats and attack them all at once), precomputed tables of common passwords exist, and these hashes are **fast by design**: an attacker tries an enormous number of guesses per second.",
          },
          {
            titulo: "4. A unique salt per password",
            texto:
              "Generate a random value per password (`randomBytes`), mix it in before hashing and store it next to the result. The salt is not a secret. → Fixes: equal passwords produce different hashes and precomputed tables lose their value. → Still breaks: every guess is still cheap.",
          },
          {
            titulo: "5. A slow, tunable hash",
            texto:
              "Use a function built for passwords (**argon2id, scrypt, bcrypt**), whose cost in time (and, for the first two, memory) is a parameter. A person logging in pays once and barely notices; someone testing millions of guesses pays for each one. → Breaks: hardware improves over the years, and a cost set too high becomes a door to denial of service (see L49).",
          },
          {
            titulo: "6. Verify, migrate and don’t block",
            texto:
              "Store the algorithm, parameters and salt with the hash. At login, recompute with the same parameters, compare with `timingSafeEqual` and give the same answer for an unknown user and a wrong password. If the parameters have grown weak, **rehash** when the correct password arrives. In Node.js use the asynchronous version, which runs on the thread pool (see T43), not `scryptSync`.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Hashing and verifying with scrypt",
        legenda: "JavaScript",
        codigo:
          'import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";\nimport { promisify } from "node:util";\n\nconst derive = promisify(scrypt);\n\nexport async function createHash(password) {\n  const salt = randomBytes(16); // unique per password\n  const key = await derive(password, salt, 64);\n  return [salt, key].map((b) => b.toString("base64")).join(":");\n}\n\nexport async function verify(password, stored) {\n  const [salt, expected] = stored.split(":").map((s) => Buffer.from(s, "base64"));\n  const actual = await derive(password, salt, expected.length);\n  return timingSafeEqual(actual, expected); // constant time\n}',
        nota: "The cost parameters are left at Node.js defaults just to keep the example short. In production, store the algorithm and parameters with the hash (so you can rehash later) and check the current OWASP recommendation. See also T46.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule",
        texto:
          "Store only **algorithm + parameters + salt + hash** from a slow function designed for passwords. Plain text, reversible encryption and bare SHA or MD5 are all wrong. **Argon2id** is usually the first choice; scrypt and bcrypt are still accepted. Check the current OWASP recommendation and the `node:crypto` documentation (nodejs.org) to see what your Node.js version already offers.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The hash protects the database, not the account",
        texto:
          "A slow hash makes a **leaked database** hard to crack; it does not stop someone guessing passwords online, nor phishing. Add attempt limits (see L49), MFA, a reasonable minimum length and a check against already-leaked passwords. Never invent your own scheme: base64 is an encoding, not protection, and an extra server-side secret (a pepper) is an optional reinforcement, never a substitute for the salt.",
      },
    ],
    armadilhas: [
      "Calling “encrypting the password” what should be hashing: encryption is reversible and the key tends to leak along with the database.",
      "Using MD5, SHA-1 or bare SHA-256, even with a salt: they are far too fast against brute force.",
      "Reusing one fixed salt for every account, or comparing hashes with `===` instead of `timingSafeEqual`.",
      "Using `scryptSync` (or any `Sync` variant) at login and blocking the event loop, or setting a high cost with no attempt limit and opening a door to denial of service.",
    ],
    autoteste: [
      {
        pergunta: "If a hash is already one-way, what is the salt for?",
        resposta:
          "So the same text does not produce the same hash across accounts, and to make precomputed tables useless: the attacker has to attack each password separately. The salt is not a secret and is stored next to the hash.",
      },
      {
        pergunta: "Why is slowness a feature here, when for a file checksum we want speed?",
        resposta:
          "With passwords, the cost hurts the attacker most, who needs millions of attempts; the legitimate user makes one per login. A checksum has no adversary testing guesses, so speed is pure benefit.",
      },
    ],
  },
};
