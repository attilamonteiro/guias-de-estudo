import type { Pergunta } from "../../tipos";

// Q86 · Armazenar senhas com segurança
export const q086: Pergunta = {
  numero: 86,
  modulo: "mfa-e-passkeys",
  metodo: "whys",
  pt: {
    titulo: "Armazenar senhas com segurança",
    pergunta:
      "Como armazenar e verificar senhas com segurança? Explique por que usar hash lento com salt (Argon2id, bcrypt, scrypt), o papel do pepper e o que fazer com hashes antigos.",
    porqueEsteMetodo:
      "O esquema correto parece uma receita arbitrária (salt, hash lento, parâmetros, pepper) até você ver cada ingrediente nascer de um ataque. A cadeia de “por quês” parte do vazamento da base, passa por cada decisão e chega à causa raiz.",
    resposta30s:
      "Guarde só o resultado de um **hash lento, com salt único por senha**, feito para isso (**Argon2id**; bcrypt e scrypt também são aceitos), com os parâmetros gravados junto, e verifique recalculando e comparando em **tempo constante**. Um **pepper** (segredo fora da base, no cofre) é um reforço opcional, nunca um substituto do salt. Hashes antigos migram com **rehash transparente no login**, sem forçar um reset geral.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que nunca guardar a senha em texto puro, nem cifrada?",
            resposta:
              "Porque o servidor só precisa **verificar** uma senha, nunca **recuperá-la**. Em texto puro, o vazamento da base (injeção de SQL, backup, acesso indevido) entrega todas as contas, e como muita gente reaproveita senhas, o estrago passa para outros sites. Cifrar também falha: o servidor precisa da chave para decifrar, e quem invade o servidor costuma levar as duas coisas. A saída é uma função de **mão única**.",
          },
          {
            pergunta: "Por que um hash simples (SHA-256, MD5) não basta?",
            resposta:
              "Porque esses hashes foram feitos para ser **rápidos**, e a rapidez é o presente do atacante: com GPUs, ele testa uma quantidade enorme de palpites por segundo, e as senhas humanas são previsíveis (dicionários, variações, vazamentos antigos). Uma base vazada vira, rapidamente, uma lista de senhas descobertas, a começar pelas mais comuns.",
          },
          {
            pergunta: "Por que cada senha precisa de um salt único?",
            resposta:
              "Sem salt, senhas iguais geram hashes iguais: o atacante vê quem repete a senha, ataca todas as contas de uma vez e usa tabelas pré-calculadas (rainbow tables). Com um **salt aleatório e único por senha** (16 bytes ou mais, de um gerador criptográfico), cada conta vira um alvo separado e a tabela pré-calculada perde o valor. O salt **não é segredo** e é guardado ao lado do hash.",
          },
          {
            pergunta: "Por que o hash precisa ser lento e ajustável (Argon2id, scrypt, bcrypt)?",
            resposta:
              "Porque o custo é o que sobra quando o atacante tem a base e todo o tempo do mundo. Essas funções cobram **tempo** e, no Argon2id e no scrypt, **memória** por tentativa: a pessoa legítima paga uma vez por login e nem percebe, e quem testa milhões de palpites paga a cada um, sem poder paralelizar barato em GPU. O custo é um **parâmetro** (memória, iterações e paralelismo no Argon2id; fator de custo no bcrypt; N, r e p no scrypt), que sobe com o tempo para acompanhar o hardware. Calibre pelo tempo de verificação que o servidor aguenta sob carga e limite as tentativas, porque o custo alto também é um vetor de negação de serviço (veja Q135).",
          },
          {
            pergunta: "Por que acrescentar um pepper, e onde ele mora?",
            resposta:
              "Porque o salt fica na base, junto do hash, e o pepper protege justamente o caso em que **só a base vaza**. É um segredo global, guardado **fora** dela (cofre de segredos ou HSM) e aplicado antes do hash, por exemplo como um HMAC da senha. Quem leva a base sem o cofre não consegue nem começar o ataque offline. O custo é operacional: a rotação exige versionar a chave (um `pepper_id` junto do hash), e um invasor que controla o servidor da aplicação também alcança o pepper. É um reforço, nunca um substituto do salt.",
          },
        ],
        causaRaiz:
          "Quem tem a base vazada testa palpites **offline**, sem limite de tentativas. Cada ingrediente (mão única, salt único, hash lento, pepper) existe para encarecer esse teste em massa. O objetivo é tornar a verificação **cara para quem testa em escala** e **barata para quem faz login uma vez**.",
      },
      {
        tipo: "codigo",
        titulo: "Hash com Argon2id, pepper e rehash transparente",
        legenda: "TypeScript",
        codigo: `import argon2 from "argon2";
import { createHmac } from "node:crypto";

// Pepper: segredo do cofre, nunca na mesma base dos hashes
const comPepper = (senha: string) =>
  createHmac("sha256", process.env.PEPPER!).update(senha).digest("base64");

const OPCOES = { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 };

export const criarHash = (senha: string) => argon2.hash(comPepper(senha), OPCOES); // salt aleatório embutido

export async function verificar(senha: string, guardado: string, regravar: (hash: string) => Promise<void>) {
  if (!(await argon2.verify(guardado, comPepper(senha)))) return false; // comparação em tempo constante
  if (argon2.needsRehash(guardado, OPCOES)) await regravar(await criarHash(senha)); // rehash transparente
  return true;
}`,
        nota: "Os valores de memória, iterações e paralelismo são ilustrativos, na linha do que o OWASP recomendava como mínimo; confira a recomendação atual e a API da biblioteca. Para usuário inexistente, calcule um hash falso para igualar o tempo e dê a mesma resposta (veja Q134). Em .NET, o `PasswordHasher` do ASP.NET Core Identity devolve `SuccessRehashNeeded` para o mesmo fim.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de armazenamento e verificação",
        texto:
          "Guarde algoritmo, parâmetros, salt e hash juntos (os formatos modernos já são auto-descritivos), de uma função lenta própria para senhas: **Argon2id** como primeira escolha (veja a RFC 9106), bcrypt e scrypt como alternativas aceitas, PBKDF2 quando houver exigência de conformidade. Verifique recalculando com os parâmetros guardados e comparando em **tempo constante**, e dê a mesma resposta para usuário inexistente e senha errada. Texto puro, cifra reversível e SHA ou MD5 simples estão todos errados. Confira o Password Storage Cheat Sheet do OWASP e a NIST SP 800-63B (veja também Q06 e Q87).",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Migrar hashes antigos sem forçar o reset de todos",
        texto:
          "Grave, junto do hash, o algoritmo e os parâmetros que o geraram. **Rehash transparente no login**: com a senha correta em mãos, verifique pelo hash antigo e, se o algoritmo ou os parâmetros estiverem fracos, grave um hash novo no lugar. Para quem não entra há muito tempo, use um **envelope**: calcule `Argon2id(hash_antigo)` offline para toda a base e marque o formato; no login, aplique o hash antigo à senha digitada e depois o novo, e então regrave o hash limpo. Defina um prazo: contas que não migrarem passam por redefinição de senha com verificação de e-mail. Nunca “decifre” para re-hashear, e reavalie os parâmetros quando o hardware ou a recomendação mudar.",
      },
    ],
    armadilhas: [
      "Usar MD5, SHA-1 ou SHA-256 puro, mesmo com salt, ou “criptografar” a senha: o hash simples é rápido demais e a cifra é reversível.",
      "Ignorar os limites do algoritmo: o bcrypt só considera os primeiros 72 bytes da entrada, e aceitar senhas de tamanho ilimitado abre porta para negação de serviço; defina um tamanho máximo razoável.",
      "Fixar um custo alto sem limitar as tentativas (o login vira vetor de negação de serviço) ou deixar o custo antigo para sempre (o hash envelhece com o hardware).",
      "Guardar o pepper na mesma base ou no repositório, sem versão para rotacionar, ou tratá-lo como substituto do salt.",
    ],
    autoteste: [
      {
        pergunta: "Por que o salt não precisa ser secreto, mas o pepper precisa?",
        resposta:
          "O salt só precisa ser único e imprevisível para derrubar tabelas pré-calculadas e obrigar o ataque a cada senha em separado, e isso vale mesmo que o atacante o conheça. O pepper existe para o caso em que a base vaza e o atacante não tem o cofre: se ele o conhecer, o reforço desaparece.",
      },
      {
        pergunta: "Como migrar de MD5 sem salt para Argon2id sem forçar todos os usuários a redefinir a senha?",
        resposta:
          "Com um envelope: calcule Argon2id sobre o hash MD5 existente para toda a base, marque o formato e, no login, aplique MD5 e depois Argon2id para verificar; na primeira entrada com sucesso, regrave um Argon2id direto da senha. As contas que não entrarem dentro do prazo passam por redefinição.",
      },
    ],
  },
  en: {
    titulo: "Storing passwords securely",
    pergunta:
      "How do you store and verify passwords securely? Explain why you use a slow salted hash (Argon2id, bcrypt, scrypt), the role of a pepper, and what to do with old hashes.",
    porqueEsteMetodo:
      "The right scheme looks like an arbitrary recipe (salt, slow hash, parameters, pepper) until you watch each ingredient appear in response to an attack. The chain of whys starts at the leaked database, passes through each decision and reaches the root cause.",
    resposta30s:
      "Store only the output of a **slow hash with a unique salt per password**, built for the job (**Argon2id**; bcrypt and scrypt are also accepted), with the parameters recorded alongside, and verify by recomputing and comparing in **constant time**. A **pepper** (a secret kept outside the database, in a vault) is an optional reinforcement, never a substitute for the salt. Old hashes migrate through **transparent rehash at login**, without forcing a global reset.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why never store the password in plain text, or even encrypted?",
            resposta:
              "Because the server only needs to **verify** a password, never to **recover** it. In plain text, a leaked database (SQL injection, backup, unauthorized access) hands over every account, and since many people reuse passwords, the damage spreads to other sites. Encrypting fails too: the server needs the key to decrypt, and whoever breaks into the server usually gets both. The way out is a **one-way** function.",
          },
          {
            pergunta: "Why is a plain hash (SHA-256, MD5) not enough?",
            resposta:
              "Because those hashes were built to be **fast**, and speed is the attacker’s gift: with GPUs, they try an enormous number of guesses per second, and human passwords are predictable (dictionaries, variations, old leaks). A leaked database quickly becomes a list of discovered passwords, starting with the most common.",
          },
          {
            pergunta: "Why does every password need a unique salt?",
            resposta:
              "Without a salt, equal passwords produce equal hashes: the attacker sees who repeats a password, attacks every account at once and uses precomputed tables (rainbow tables). With a **random, unique salt per password** (16 bytes or more, from a cryptographic generator), each account becomes a separate target and the precomputed table loses its value. The salt is **not a secret** and is stored next to the hash.",
          },
          {
            pergunta: "Why must the hash be slow and tunable (Argon2id, scrypt, bcrypt)?",
            resposta:
              "Because cost is what remains when the attacker has the database and all the time in the world. These functions charge **time** and, in Argon2id and scrypt, **memory** per attempt: the legitimate person pays once per login and barely notices, and someone testing millions of guesses pays for each one, without being able to parallelize cheaply on a GPU. The cost is a **parameter** (memory, iterations and parallelism in Argon2id; a cost factor in bcrypt; N, r and p in scrypt) that rises over time to keep up with hardware. Calibrate it to the verification time the server can bear under load and limit attempts, because a high cost is also a denial-of-service vector (see Q135).",
          },
          {
            pergunta: "Why add a pepper, and where does it live?",
            resposta:
              "Because the salt sits in the database next to the hash, and the pepper protects precisely the case where **only the database leaks**. It is a global secret, kept **outside** it (a secrets vault or HSM) and applied before the hash, for example as an HMAC of the password. Whoever takes the database without the vault cannot even start the offline attack. The cost is operational: rotation requires versioning the key (a `pepper_id` stored with the hash), and an attacker who controls the application server reaches the pepper too. It is a reinforcement, never a substitute for the salt.",
          },
        ],
        causaRaiz:
          "Whoever holds a leaked database tests guesses **offline**, with no attempt limit. Each ingredient (one-way, unique salt, slow hash, pepper) exists to make that mass testing more expensive. The goal is to make verification **costly for someone testing at scale** and **cheap for someone logging in once**.",
      },
      {
        tipo: "codigo",
        titulo: "Argon2id hashing, a pepper and transparent rehash",
        legenda: "TypeScript",
        codigo: `import argon2 from "argon2";
import { createHmac } from "node:crypto";

// Pepper: a vault secret, never in the same database as the hashes
const withPepper = (password: string) =>
  createHmac("sha256", process.env.PEPPER!).update(password).digest("base64");

const OPTIONS = { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 };

export const createHash = (password: string) => argon2.hash(withPepper(password), OPTIONS); // random salt built in

export async function verify(password: string, stored: string, resave: (hash: string) => Promise<void>) {
  if (!(await argon2.verify(stored, withPepper(password)))) return false; // constant-time comparison
  if (argon2.needsRehash(stored, OPTIONS)) await resave(await createHash(password)); // transparent rehash
  return true;
}`,
        nota: "The memory, iteration and parallelism values are illustrative, along the lines of what OWASP used to recommend as a minimum; check the current recommendation and the library’s API. For an unknown user, compute a dummy hash to equalize timing and give the same answer (see Q134). In .NET, ASP.NET Core Identity’s `PasswordHasher` returns `SuccessRehashNeeded` for the same purpose.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Storage and verification rule",
        texto:
          "Store algorithm, parameters, salt and hash together (modern formats are already self-describing), from a slow function designed for passwords: **Argon2id** as the first choice (see RFC 9106), bcrypt and scrypt as accepted alternatives, PBKDF2 when compliance demands it. Verify by recomputing with the stored parameters and comparing in **constant time**, and give the same answer for an unknown user and a wrong password. Plain text, reversible encryption and bare SHA or MD5 are all wrong. Check OWASP’s Password Storage Cheat Sheet and NIST SP 800-63B (see also Q06 and Q87).",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Migrating old hashes without forcing everyone to reset",
        texto:
          "Store, next to the hash, the algorithm and parameters that produced it. **Transparent rehash at login**: with the correct password in hand, verify against the old hash and, if the algorithm or parameters are weak, write a new hash in its place. For people who have not logged in for a long time, use a **wrapper**: compute `Argon2id(old_hash)` offline for the whole database and mark the format; at login, apply the old hash to the typed password and then the new one, and then resave the clean hash. Set a deadline: accounts that did not migrate go through a password reset with e-mail verification. Never “decrypt” to rehash, and reassess the parameters whenever the hardware or the recommendation changes.",
      },
    ],
    armadilhas: [
      "Using MD5, SHA-1 or bare SHA-256, even with a salt, or “encrypting” the password: a plain hash is far too fast and encryption is reversible.",
      "Ignoring the algorithm’s limits: bcrypt only considers the first 72 bytes of input, and accepting passwords of unlimited length opens the door to denial of service; set a reasonable maximum length.",
      "Setting a high cost with no attempt limit (login becomes a denial-of-service vector) or leaving the old cost forever (the hash ages with the hardware).",
      "Keeping the pepper in the same database or in the repository, with no version to rotate it, or treating it as a substitute for the salt.",
    ],
    autoteste: [
      {
        pergunta: "Why doesn’t the salt need to be secret, while the pepper does?",
        resposta:
          "The salt only needs to be unique and unpredictable to defeat precomputed tables and force an attack on each password separately, and that holds even if the attacker knows it. The pepper exists for the case where the database leaks and the attacker does not have the vault: if the attacker knows it, the reinforcement is gone.",
      },
      {
        pergunta:
          "How do you migrate from unsalted MD5 to Argon2id without forcing every user to reset their password?",
        resposta:
          "With a wrapper: compute Argon2id over the existing MD5 hash for the whole database, mark the format and, at login, apply MD5 and then Argon2id to verify; on the first successful login, resave a plain Argon2id of the password. Accounts that do not log in within the deadline go through a reset.",
      },
    ],
  },
};
