import type { Pergunta } from "../../tipos";

// Q101 · Implementar MFA numa aplicação
export const q101: Pergunta = {
  numero: 101,
  modulo: "mfa-e-passkeys",
  metodo: "firstprinciples",
  pt: {
    titulo: "Implementar MFA numa aplicação",
    pergunta:
      "Como você acrescentaria MFA a uma aplicação existente, começando pela versão mais simples e incorporando cada requisito (cadastro, recuperação, dispositivo confiável, step-up) conforme surgem?",
    porqueEsteMetodo:
      "O desenho final de um MFA completo parece uma lista de recursos soltos. Partir da versão mais simples e deixar cada falha pedir o seu componente mostra por que cada peça existe e em que ordem entregá-las.",
    resposta30s:
      "Comece pelo mais simples, **TOTP opcional**, e deixe cada falha pedir um componente: **cadastro verificado** (só ativa depois de um código válido), **códigos de backup** e recuperação, **limite de tentativas** e proteção contra reuso, **MFA obrigatória por papel**, **dispositivo confiável** com cuidado, **passkeys** e **step-up** em ações sensíveis, tudo com **telemetria de adoção**. Antes de construir, avalie se a aplicação pode delegar o MFA a um IdP por OpenID Connect e apenas exigir o nível pelo `acr`.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma falha por vez",
        passos: [
          {
            titulo: "0. O que se quer",
            texto:
              "Provar, a cada login, que quem entra é o titular **mesmo que a senha tenha vazado**, sem quebrar a aplicação que já existe. Duas decisões iniciais: construir ou delegar (veja o destaque) e quais fatores oferecer.",
          },
          {
            titulo: "1. A versão mais simples: TOTP opcional",
            texto:
              "Gere um segredo aleatório por usuário, mostre-o como QR code (URI `otpauth://`) e peça, depois da senha, o código de 6 dígitos que o aplicativo autenticador calcula (RFC 6238). → Quebra: se o usuário escaneou errado ou digitou mal, **tranca-se fora da própria conta**.",
          },
          {
            titulo: "2. Cadastro com verificação",
            texto:
              "Só ative o MFA depois de o usuário digitar **um código válido** do segredo recém-gerado. Guarde o segredo **cifrado** (não como hash: o servidor precisa do valor para recalcular o código), com a chave num cofre, e nunca o registre em log. → Quebra: quem perde o celular perde a conta.",
          },
          {
            titulo: "3. Códigos de backup e recuperação",
            texto:
              "Gere alguns códigos de uso único no cadastro, mostre-os uma vez e guarde só o hash. Defina o caminho de recuperação sem enfraquecer o MFA (veja Q100). → Quebra: o código de 6 dígitos tem um milhão de combinações, e um código observado pode ser usado de novo.",
          },
          {
            titulo: "4. Limite de tentativas e proteção contra reuso",
            texto:
              "Limite por conta e por origem, com atraso crescente e bloqueio temporário; aceite uma janela curta de tolerância (um passo para cada lado), **recuse um código já usado** (guarde o último passo aceito) e compare em tempo constante. → Quebra: o MFA ainda é opcional, então quem mais importa (administradores) pode nem tê-lo ativado.",
          },
          {
            titulo: "5. Obrigatório por papel e migração",
            texto:
              "Torne o MFA obrigatório para administradores e papéis privilegiados e, depois, para os demais, com prazo de carência, avisos no login e a opção de adiar algumas vezes. Faça a migração em ondas, para o suporte aguentar. → Quebra: o código a cada login vira atrito diário.",
          },
          {
            titulo: "6. Dispositivo confiável, com cuidado",
            texto:
              "Lembre o dispositivo com um cookie aleatório e assinado, de validade curta, revogável pelo usuário e invalidado ao trocar a senha ou o MFA. Ele **não** vale para ações sensíveis. → Quebra: um cookie roubado vira atalho permanente, e o TOTP continua repassável por phishing (veja Q97).",
          },
          {
            titulo: "7. Passkeys, step-up e telemetria",
            texto:
              "Ofereça **passkeys** como método preferido (resistentes a phishing) e mantenha o TOTP na transição. Peça **step-up** nas ações sensíveis (veja Q99). Meça a adoção: inscritos por papel, falhas de verificação, chamados de recuperação e abandono. Cada número aponta o que consertar.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O núcleo da verificação de TOTP",
        legenda: "TypeScript",
        codigo: `import { createHmac, timingSafeEqual } from "node:crypto";

// RFC 4226/6238: HMAC do contador (tempo / 30 s) e truncamento dinâmico
function totp(segredo: Buffer, passo: number, digitos = 6): string {
  const contador = Buffer.alloc(8);
  contador.writeBigUInt64BE(BigInt(passo));
  const h = createHmac("sha1", segredo).update(contador).digest();
  const deslocamento = h[h.length - 1] & 0x0f;
  const numero = h.readUInt32BE(deslocamento) & 0x7fffffff;
  return String(numero % 10 ** digitos).padStart(digitos, "0");
}

// Aceita um passo para cada lado e recusa passos já usados (anti-reuso)
export function verificar(segredo: Buffer, codigo: string, ultimoPasso: number): number | null {
  const atual = Math.floor(Date.now() / 30_000);
  for (const passo of [atual - 1, atual, atual + 1]) {
    if (passo <= ultimoPasso) continue;
    const esperado = Buffer.from(totp(segredo, passo));
    const recebido = Buffer.from(codigo);
    if (recebido.length === esperado.length && timingSafeEqual(recebido, esperado)) return passo;
  }
  return null; // grave o passo devolvido como ultimoPasso do usuário
}`,
        nota: "Implementação mínima, só para mostrar o mecanismo: o HMAC-SHA1 é o algoritmo padrão das RFC 4226 e 6238 e o que os aplicativos autenticadores esperam. Em produção, use uma biblioteca madura de TOTP e WebAuthn (ou o seu IdP), guarde `ultimoPasso` por usuário e combine com limite de tentativas.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Construir ou delegar?",
        texto:
          "Se a aplicação já fala (ou pode falar) OpenID Connect com um IdP, o caminho mais curto e mais seguro costuma ser **delegar o MFA a ele**: a política de MFA vive no IdP, a aplicação pede o nível (`acr_values`) e confere `acr`, `amr` e `auth_time` no token (veja Q99 e Q102). Você ganha recuperação, passkeys e telemetria prontas. Construir por conta própria só compensa com requisitos que o IdP não atende, e então use bibliotecas maduras e nunca invente criptografia. O benefício do MFA é cortar a tomada de conta por senha vazada, reaproveitada ou adivinhada; contra phishing em tempo real, só os métodos resistentes a phishing ajudam (veja Q97).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "SMS e e-mail não são o plano B",
        texto:
          "É tentador oferecer SMS ou e-mail como fator ou como recuperação por serem fáceis. Eles são os elos mais fracos (troca de chip, caixa comprometida) e anulam o ganho do resto. Se precisar deles, limite-os a contas de baixo risco, com atraso e notificação (veja Q98 e Q100).",
      },
    ],
    armadilhas: [
      "Ativar o MFA no momento de gerar o segredo, sem exigir um código válido: quem escaneou errado se tranca fora da própria conta.",
      "Guardar o segredo do TOTP como hash: o servidor precisa do valor original para calcular o código. Guarde-o cifrado, com a chave em um cofre, e nunca em log.",
      "Aceitar tentativas ilimitadas ou o mesmo código duas vezes: um milhão de combinações cai por força bruta, e um código visto uma vez serve de novo no reuso.",
      "Lembrar o dispositivo com um cookie previsível, eterno ou que sobrevive à troca de senha: vira um bypass permanente.",
    ],
    autoteste: [
      {
        pergunta: "Por que o TOTP exige guardar um segredo recuperável e uma senha não?",
        resposta:
          "Verificar o TOTP é recalcular o código com o mesmo segredo, então o servidor precisa do valor original (cifrado em repouso). A senha só precisa ser comparada com um hash de mão única, nunca recuperada.",
      },
      {
        pergunta: "Em que ordem você implantaria MFA numa base de usuários que já existe?",
        resposta:
          "Primeiro opcional, com cadastro verificado e códigos de backup; depois obrigatório para administradores e papéis privilegiados; depois, para os demais, com prazo de carência. Tudo acompanhado de telemetria (adesão, falhas, chamados) e com as passkeys como método preferido.",
      },
    ],
  },
  en: {
    titulo: "Implementing MFA in an application",
    pergunta:
      "How would you add MFA to an existing application, starting from the simplest version and incorporating each requirement (enrollment, recovery, trusted device, step-up) as it arises?",
    porqueEsteMetodo:
      "The final design of a complete MFA looks like a list of loose features. Starting from the simplest version and letting each failure demand its component shows why every piece exists and in what order to deliver them.",
    resposta30s:
      "Start with the simplest thing, **optional TOTP**, and let each failure demand a component: **verified enrollment** (it activates only after a valid code), **backup codes** and recovery, **attempt limits** and reuse protection, **mandatory MFA by role**, a carefully designed **trusted device**, **passkeys** and **step-up** on sensitive actions, all with **adoption telemetry**. Before building, check whether the application can delegate MFA to an IdP through OpenID Connect and simply require the level through `acr`.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one failure at a time",
        passos: [
          {
            titulo: "0. What you want",
            texto:
              "To prove, at every login, that the person signing in is the owner **even if the password leaked**, without breaking the application that already exists. Two early decisions: build or delegate (see the callout) and which factors to offer.",
          },
          {
            titulo: "1. The simplest version: optional TOTP",
            texto:
              "Generate a random secret per user, show it as a QR code (an `otpauth://` URI) and, after the password, ask for the 6-digit code that the authenticator app computes (RFC 6238). → Breaks: if the user scanned wrongly or mistyped, they **lock themselves out of their own account**.",
          },
          {
            titulo: "2. Enrollment with verification",
            texto:
              "Activate MFA only after the user types **a valid code** from the newly generated secret. Store the secret **encrypted** (not as a hash: the server needs the value to recompute the code), with the key in a vault, and never log it. → Breaks: whoever loses the phone loses the account.",
          },
          {
            titulo: "3. Backup codes and recovery",
            texto:
              "Generate a few single-use codes at enrollment, show them once and store only the hash. Define the recovery path without weakening MFA (see Q100). → Breaks: a 6-digit code has a million combinations, and an observed code can be used again.",
          },
          {
            titulo: "4. Attempt limits and reuse protection",
            texto:
              "Limit by account and by origin, with growing delay and temporary lockout; accept a short tolerance window (one step either side), **reject a code that was already used** (store the last accepted step) and compare in constant time. → Breaks: MFA is still optional, so those who matter most (administrators) may not even have turned it on.",
          },
          {
            titulo: "5. Mandatory by role, and migration",
            texto:
              "Make MFA mandatory for administrators and privileged roles and, later, for everyone else, with a grace period, prompts at login and the option to postpone a few times. Migrate in waves so support can cope. → Breaks: a code at every login becomes daily friction.",
          },
          {
            titulo: "6. A trusted device, with care",
            texto:
              "Remember the device with a random, signed cookie that is short-lived, revocable by the user and invalidated when the password or MFA changes. It does **not** apply to sensitive actions. → Breaks: a stolen cookie becomes a permanent shortcut, and TOTP can still be relayed by phishing (see Q97).",
          },
          {
            titulo: "7. Passkeys, step-up and telemetry",
            texto:
              "Offer **passkeys** as the preferred method (phishing-resistant) and keep TOTP during the transition. Ask for **step-up** on sensitive actions (see Q99). Measure adoption: enrolled users by role, verification failures, recovery tickets and drop-off. Each number points to what to fix.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The core of TOTP verification",
        legenda: "TypeScript",
        codigo: `import { createHmac, timingSafeEqual } from "node:crypto";

// RFC 4226/6238: HMAC of the counter (time / 30 s) and dynamic truncation
function totp(secret: Buffer, step: number, digits = 6): string {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const h = createHmac("sha1", secret).update(counter).digest();
  const offset = h[h.length - 1] & 0x0f;
  const value = h.readUInt32BE(offset) & 0x7fffffff;
  return String(value % 10 ** digits).padStart(digits, "0");
}

// Accepts one step either side and rejects steps already used (anti-reuse)
export function verify(secret: Buffer, code: string, lastStep: number): number | null {
  const current = Math.floor(Date.now() / 30_000);
  for (const step of [current - 1, current, current + 1]) {
    if (step <= lastStep) continue;
    const expected = Buffer.from(totp(secret, step));
    const received = Buffer.from(code);
    if (received.length === expected.length && timingSafeEqual(received, expected)) return step;
  }
  return null; // store the returned step as the user's lastStep
}`,
        nota: "A minimal implementation, only to show the mechanism: HMAC-SHA1 is the default algorithm in RFC 4226 and 6238 and what authenticator apps expect. In production, use a mature TOTP and WebAuthn library (or your IdP), store `lastStep` per user and combine it with attempt limits.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Build or delegate?",
        texto:
          "If the application already speaks (or can speak) OpenID Connect with an IdP, the shortest and safest path is usually to **delegate MFA to it**: the MFA policy lives in the IdP, the application requests the level (`acr_values`) and checks `acr`, `amr` and `auth_time` in the token (see Q99 and Q102). You get recovery, passkeys and telemetry ready-made. Building it yourself only pays off when you have requirements the IdP does not meet, and then use mature libraries and never invent cryptography. The benefit of MFA is cutting account takeover from leaked, reused or guessed passwords; against real-time phishing, only phishing-resistant methods help (see Q97).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "SMS and email are not plan B",
        texto:
          "It is tempting to offer SMS or email as a factor or for recovery because they are easy. They are the weakest links (SIM swap, a compromised mailbox) and cancel the gain of everything else. If you must have them, limit them to low-risk accounts, with delay and notification (see Q98 and Q100).",
      },
    ],
    armadilhas: [
      "Turning MFA on at the moment the secret is generated, without requiring a valid code: whoever scanned it wrongly is locked out of their own account.",
      "Storing the TOTP secret as a hash: the server needs the original value to compute the code. Store it encrypted, with the key in a vault, and never in a log.",
      "Accepting unlimited attempts or the same code twice: a million combinations fall to brute force, and a code seen once can be used again in a reuse attack.",
      "Remembering the device with a predictable or eternal cookie, or one that survives a password change: it becomes a permanent bypass.",
    ],
    autoteste: [
      {
        pergunta: "Why does TOTP require storing a recoverable secret while a password does not?",
        resposta:
          "Verifying TOTP means recomputing the code with the same secret, so the server needs the original value (encrypted at rest). A password only needs to be compared against a one-way hash and never recovered.",
      },
      {
        pergunta: "In what order would you roll out MFA to an existing user base?",
        resposta:
          "First optional, with verified enrollment and backup codes; then mandatory for administrators and privileged roles; then for everyone else, with a grace period. All of it tracked by telemetry (adoption, failures, tickets) and with passkeys as the preferred method.",
      },
    ],
  },
};
