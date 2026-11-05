import type { Pergunta } from "../../tipos";

// Q88 · TOTP × HOTP
export const q088: Pergunta = {
  numero: 88,
  modulo: "mfa-e-passkeys",
  metodo: "compare",
  pt: {
    titulo: "TOTP × HOTP",
    pergunta:
      "Como funciona o TOTP e em que ele difere do HOTP? Explique o segredo compartilhado, a janela de tempo e os cuidados de implementação no servidor.",
    porqueEsteMetodo:
      "O TOTP é um caso particular do HOTP, então as diferenças cabem numa matriz. Ela deixa claro o que muda (a origem do contador) e o que continua igual (segredo, HMAC e truncamento).",
    resposta30s:
      "No **cadastro**, o servidor e o aplicativo autenticador passam a conhecer o mesmo **segredo compartilhado**, em geral por um QR code. A cada código, os dois calculam um **HMAC** sobre um contador e **truncam** o resultado para 6 dígitos: no **HOTP** (RFC 4226) o contador sobe a cada uso, e no **TOTP** (RFC 6238) ele é o **tempo** dividido em passos de 30 segundos. O servidor aceita uma pequena tolerância de relógio e deve tratar cada código como de **uso único**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "HOTP × TOTP",
        colunas: ["Aspecto", "HOTP", "TOTP"],
        linhas: [
          [
            "O que gera o código",
            "HMAC do segredo sobre um contador de eventos (RFC 4226)",
            "O mesmo cálculo, com o contador derivado do relógio (RFC 6238)",
          ],
          [
            "Cálculo",
            "HMAC (SHA-1 no uso comum), truncamento dinâmico e resto da divisão por 10 elevado ao número de dígitos (6 é o comum)",
            "Idêntico ao HOTP. A RFC 6238 também prevê SHA-256 e SHA-512, mas alguns aplicativos só aceitam o padrão",
          ],
          [
            "Contador",
            "Sobe a cada código gerado ou usado e precisa ser guardado nos dois lados",
            "`floor(tempo Unix / passo)`, com passo de 30 s; ninguém guarda contador, só confia no relógio",
          ],
          [
            "Quanto o código vale",
            "Até ser usado ou até o contador passar dele; pode ficar válido por muito tempo",
            "Só durante o passo atual e uma pequena tolerância",
          ],
          [
            "Dessincronização",
            "O token gera códigos que o servidor não viu; o servidor olha uma janela à frente e ressincroniza o contador",
            "Deriva do relógio do aparelho; o servidor aceita um passo antes e um depois e pode guardar o desvio do usuário",
          ],
          [
            "Onde aparece",
            "Tokens físicos com botão e sistemas antigos",
            "Aplicativos autenticadores: o MFA por código mais comum",
          ],
          [
            "Ponto fraco típico",
            "Códigos antigos continuam válidos e o contador pode divergir",
            "Depende de relógio correto, e o código é repassável durante a janela",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Para MFA de usuários, use **TOTP**: não precisa de contador guardado, funciona com os autenticadores comuns e expira sozinho. **HOTP** só quando o dispositivo não tem relógio confiável (certos tokens físicos). Em projeto novo, trate o TOTP como **alternativa ou reserva** de passkeys (veja Q92 e Q96): ele melhora muito sobre a senha sozinha, mas não resiste a phishing.",
      },
      {
        tipo: "codigo",
        titulo: "HOTP e verificação de TOTP com uso único",
        legenda: "TypeScript",
        codigo: `import { createHmac, timingSafeEqual } from "node:crypto";
// RFC 4226: HMAC do contador (8 bytes) + truncamento dinâmico
function hotp(segredo: Buffer, contador: number, digitos = 6): string {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(contador));
  const h = createHmac("sha1", segredo).update(msg).digest();
  const deslocamento = h[h.length - 1] & 0x0f;
  const bin = h.readUInt32BE(deslocamento) & 0x7fffffff;
  return String(bin % 10 ** digitos).padStart(digitos, "0");
}

// RFC 6238: o contador é o tempo; tolera ±1 passo e recusa passo já usado
export function verificarTotp(segredo: Buffer, codigo: string, ultimoPasso: number): number | null {
  const atual = Math.floor(Date.now() / 1000 / 30);
  const recebido = Buffer.from(codigo);
  for (const passo of [atual - 1, atual, atual + 1]) {
    const esperado = Buffer.from(hotp(segredo, passo));
    const igual = esperado.length === recebido.length && timingSafeEqual(esperado, recebido);
    if (igual && passo > ultimoPasso) return passo; // grave este passo: uso único
  }
  return null;
}`,
        nota: "O `ultimoPasso` vem do banco e deve ser atualizado de forma atômica (por exemplo, `UPDATE ... WHERE ultimo_passo < :passo`), senão duas requisições simultâneas aceitam o mesmo código. O segredo é lido decifrado do armazenamento, nunca escrito no código-fonte.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cuidados de implementação no servidor",
        texto:
          "**Segredo**: o servidor precisa do valor original para recalcular o código, então não dá para guardar só um hash; **cifre-o em repouso** (chave em cofre ou KMS) e nunca o registre em log. **Cadastro**: mostre o QR (URI `otpauth://`) uma única vez, por HTTPS e sem cache, e só **ative** o fator depois que o usuário digitar um código válido. **Uso único**: grave o último passo aceito e recuse repetição. **Tentativas**: limite por conta e por origem, com atraso crescente. **Tolerância**: no máximo um passo para cada lado, com o relógio do servidor sincronizado (NTP). **Recuperação**: ofereça códigos de reserva de uso único, guardados com hash. **Phishing**: um site falso repassa o código em tempo real, e o TOTP não impede isso.",
      },
    ],
    armadilhas: [
      "Guardar o segredo em texto puro no banco, ou deixar o QR e a URI `otpauth://` em logs, e-mails ou páginas em cache: quem os lê passa a gerar códigos para sempre.",
      "Aceitar o mesmo código mais de uma vez na janela, ou aumentar a tolerância para “resolver” relógio errado: amplia a chance de reuso e de adivinhação.",
      "Não limitar tentativas: 6 dígitos são um milhão de combinações, e um robô testa muitas por janela.",
      "Achar que TOTP resiste a phishing: o código vale por cerca de 30 segundos, tempo de sobra para um proxy repassá-lo.",
    ],
    autoteste: [
      {
        pergunta: "O que o TOTP herda do HOTP e o que muda?",
        resposta:
          "Herda o segredo compartilhado, o HMAC e o truncamento para poucos dígitos. Muda o contador: em vez de subir a cada uso, é o tempo dividido em passos de 30 segundos.",
      },
      {
        pergunta: "Por que o servidor aceita um passo antes e um depois, e por que não aceitar muitos?",
        resposta:
          "Para tolerar deriva de relógio e atraso de digitação. Cada passo extra amplia a janela em que um código roubado ou adivinhado ainda vale.",
      },
    ],
  },
  en: {
    titulo: "TOTP vs HOTP",
    pergunta:
      "How does TOTP work, and how does it differ from HOTP? Explain the shared secret, the time window and implementation precautions on the server.",
    porqueEsteMetodo:
      "TOTP is a special case of HOTP, so the differences fit in a matrix. It makes clear what changes (the source of the counter) and what stays the same (secret, HMAC and truncation).",
    resposta30s:
      "At **enrollment**, the server and the authenticator app come to know the same **shared secret**, usually through a QR code. For each code, both compute an **HMAC** over a counter and **truncate** the result to 6 digits: in **HOTP** (RFC 4226) the counter goes up with each use, and in **TOTP** (RFC 6238) it is the **time** divided into 30-second steps. The server accepts a small clock tolerance and must treat each code as **single-use**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "HOTP vs TOTP",
        colunas: ["Aspect", "HOTP", "TOTP"],
        linhas: [
          [
            "What produces the code",
            "An HMAC of the secret over an event counter (RFC 4226)",
            "The same calculation, with the counter derived from the clock (RFC 6238)",
          ],
          [
            "Calculation",
            "HMAC (SHA-1 in common use), dynamic truncation and remainder by 10 to the power of the digit count (6 is common)",
            "Identical to HOTP. RFC 6238 also provides for SHA-256 and SHA-512, but some apps accept only the default",
          ],
          [
            "Counter",
            "Goes up with each code generated or used and must be stored on both sides",
            "`floor(Unix time / step)`, with a 30 s step; nobody stores a counter, they just trust the clock",
          ],
          [
            "How long a code is valid",
            "Until it is used or until the counter moves past it; it can stay valid for a long time",
            "Only during the current step and a small tolerance",
          ],
          [
            "Desynchronization",
            "The token generates codes the server never saw; the server looks ahead in a window and resynchronizes the counter",
            "Device clock drift; the server accepts one step before and one after and may store the user’s offset",
          ],
          [
            "Where it shows up",
            "Physical tokens with a button and older systems",
            "Authenticator apps: the most common code-based MFA",
          ],
          [
            "Typical weak spot",
            "Old codes stay valid and the counter can diverge",
            "Depends on a correct clock, and the code can be relayed during the window",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "For user MFA, use **TOTP**: it needs no stored counter, works with the common authenticators and expires on its own. **HOTP** only when the device has no trustworthy clock (certain physical tokens). In a new project, treat TOTP as an **alternative or fallback** to passkeys (see Q92 and Q96): it is a big improvement over the password alone, but it does not resist phishing.",
      },
      {
        tipo: "codigo",
        titulo: "HOTP and TOTP verification with single use",
        legenda: "TypeScript",
        codigo: `import { createHmac, timingSafeEqual } from "node:crypto";
// RFC 4226: HMAC of the counter (8 bytes) + dynamic truncation
function hotp(secret: Buffer, counter: number, digits = 6): string {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(counter));
  const h = createHmac("sha1", secret).update(msg).digest();
  const offset = h[h.length - 1] & 0x0f;
  const bin = h.readUInt32BE(offset) & 0x7fffffff;
  return String(bin % 10 ** digits).padStart(digits, "0");
}

// RFC 6238: the counter is the time; tolerates ±1 step and refuses a used step
export function verifyTotp(secret: Buffer, code: string, lastStep: number): number | null {
  const current = Math.floor(Date.now() / 1000 / 30);
  const received = Buffer.from(code);
  for (const step of [current - 1, current, current + 1]) {
    const expected = Buffer.from(hotp(secret, step));
    const equal = expected.length === received.length && timingSafeEqual(expected, received);
    if (equal && step > lastStep) return step; // store this step: single use
  }
  return null;
}`,
        nota: "`lastStep` comes from the database and must be updated atomically (for example, `UPDATE ... WHERE last_step < :step`), otherwise two simultaneous requests accept the same code. The secret is read decrypted from storage, never written in source code.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Server-side implementation precautions",
        texto:
          "**Secret**: the server needs the original value to recompute the code, so a hash alone will not do; **encrypt it at rest** (key in a vault or KMS) and never log it. **Enrollment**: show the QR (an `otpauth://` URI) only once, over HTTPS and uncached, and only **activate** the factor after the user types a valid code. **Single use**: store the last accepted step and refuse repeats. **Attempts**: limit per account and per source, with a growing delay. **Tolerance**: at most one step each way, with the server clock synchronized (NTP). **Recovery**: offer single-use backup codes, stored hashed. **Phishing**: a fake site relays the code in real time, and TOTP does not prevent that.",
      },
    ],
    armadilhas: [
      "Storing the secret in plain text in the database, or leaving the QR and the `otpauth://` URI in logs, e-mails or cached pages: whoever reads them can generate codes forever.",
      "Accepting the same code more than once in the window, or widening the tolerance to “fix” a wrong clock: it raises the chance of reuse and guessing.",
      "Not limiting attempts: 6 digits are a million combinations, and a bot tries many per window.",
      "Believing TOTP resists phishing: the code lasts about 30 seconds, plenty of time for a proxy to relay it.",
    ],
    autoteste: [
      {
        pergunta: "What does TOTP inherit from HOTP and what changes?",
        resposta:
          "It inherits the shared secret, the HMAC and the truncation to a few digits. The counter changes: instead of going up with each use, it is the time divided into 30-second steps.",
      },
      {
        pergunta: "Why does the server accept one step before and one after, and why not many?",
        resposta:
          "To tolerate clock drift and typing delay. Each extra step widens the window in which a stolen or guessed code still works.",
      },
    ],
  },
};
