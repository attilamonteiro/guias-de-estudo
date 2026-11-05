import type { Pergunta } from "../../tipos";

// Q135 · Limitar tentativas de login
export const q135: Pergunta = {
  numero: 135,
  modulo: "ataques-e-depuracao",
  metodo: "firstprinciples",
  pt: {
    titulo: "Limitar tentativas de login",
    pergunta:
      "Como você projetaria limitação de tentativas e bloqueio de contas para um endpoint de login, evitando que o próprio bloqueio vire um ataque de negação de serviço?",
    porqueEsteMetodo:
      "Os componentes de um limitador parecem números arbitrários até cada um nascer de uma falha. Partir de “sem limite” e consertar uma falha por vez mostra por que o desenho final tem várias dimensões e prefere desafio a bloqueio.",
    resposta30s:
      "Comece contando falhas e evolua em camadas: contadores por **conta, IP e par**, **atraso progressivo** e **desafio adicional** (CAPTCHA, MFA, dispositivo conhecido) no lugar do bloqueio duro, tudo num armazenamento compartilhado como o **Redis**, com janela e TTL. O bloqueio duro por conta vira **negação de serviço** (quem sabe o e-mail tranca o dono), então o limite deve recair sobre quem erra em volume e deixar um caminho para o dono legítimo. Complete com alertas, respostas uniformes e exceções para origens confiáveis.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma falha por vez",
        passos: [
          {
            titulo: "1. Sem limite",
            texto:
              "Qualquer um testa milhares de senhas por minuto, contra uma conta (força bruta) ou contra muitas (stuffing e spraying). → Quebra: o hash lento só limita a velocidade por servidor, e quem tem muitas máquinas não é freado.",
          },
          {
            titulo: "2. Bloqueio duro por conta (N falhas e a conta trava)",
            texto:
              "Freia a força bruta contra uma conta. → Quebra: **o bloqueio vira arma**. Quem sabe o e-mail dispara N falhas e impede o dono de entrar (negação de serviço de conta), e o aviso “conta bloqueada” ainda confirma que a conta existe (veja Q134).",
          },
          {
            titulo: "3. Atraso progressivo, bloqueio curto e desafio",
            texto:
              "Em vez de travar, cada falha aumenta a espera (segundos, depois minutos) e, passadas poucas falhas, pede-se um desafio: CAPTCHA, código por e-mail, MFA, ou um dispositivo já conhecido (cookie assinado). O dono sempre tem um caminho, o robô paga caro. → Quebra: o atacante troca de conta a cada tentativa e escapa de um contador só por conta.",
          },
          {
            titulo: "4. Contador por IP (e por faixa)",
            texto:
              "Barra um host que varre muitas contas. → Quebra: botnets usam milhares de IPs com uma ou duas tentativas cada, um escritório inteiro atrás de um NAT aparece como um IP só (falso positivo) e o IPv6 dá endereços de sobra (conte por prefixo, como um /64). Só confie em `X-Forwarded-For` quando vier do seu proxy confiável, ou o atacante forja o IP e foge do limite.",
          },
          {
            titulo: "5. Contador por par (conta, IP) e sinal global",
            texto:
              "A falha de um IP novo pesa mais do que a de um IP ou dispositivo que a pessoa sempre usa: o par permite desafiar o suspeito sem trancar o dono. Um contador global de falhas liga um modo defensivo (desafio para todo dispositivo novo). → Quebra: com várias instâncias, o contador na memória de cada uma deixa de valer.",
          },
          {
            titulo: "6. Estado compartilhado, com janela",
            texto:
              "Contadores num armazenamento rápido e compartilhado (Redis), com incremento atômico e TTL, em janela deslizante ou token bucket para não permitir rajadas na virada da janela. → Quebra: o armazenamento cai. Decida de antemão se o login falha aberto (com limites locais mais baixos) ou fechado, e monitore.",
          },
          {
            titulo: "7. Operação",
            texto:
              "Isenções pequenas e auditadas para IPs ou VPNs confiáveis; resposta uniforme (sem revelar qual contador estourou); alertas de pico de falhas; aviso ao dono da conta sobre tentativas; contador do par zerado só após um sucesso verificado; e, melhor de tudo, reduzir o valor do palpite com MFA ou passkeys (veja Q92).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Contagem atômica por dimensão, com desafio no lugar de bloqueio",
        legenda: "TypeScript",
        codigo: `import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);
// INCR e EXPIRE juntos: a chave nunca fica sem TTL
const CONTAR =
  "local n = redis.call('INCR', KEYS[1]) " +
  "if n == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end return n";
const contar = (chave: string, janelaSeg: number) =>
  redis.eval(CONTAR, 1, chave, janelaSeg) as Promise<number>;

export async function exigeDesafio(conta: string, ip: string) {
  const id = conta.trim().toLowerCase();
  const [porConta, porIp, porPar] = await Promise.all([
    contar("login:conta:" + id, 900),
    contar("login:ip:" + ip, 900),
    contar("login:par:" + id + ":" + ip, 900),
  ]);
  // Limiares de exemplo: ajuste com dados reais
  return porPar > 5 || porIp > 50 || porConta > 20;
}`,
        nota: "É janela fixa por simplicidade: ela permite até o dobro do limite na virada da janela, o que a janela deslizante (conjunto ordenado) ou o token bucket corrigem. O resultado dispara um desafio, não um bloqueio permanente.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Limite o atacante, não a conta",
        texto:
          "O custo deve recair sobre quem erra **em volume e de forma suspeita**, e o dono legítimo deve manter um caminho (desafio, dispositivo conhecido, recuperação). Prefira **atraso e desafio** a bloqueio duro, use **mais de uma dimensão** (conta, IP, par, global) porque cada uma cobre a falha da outra, e trave o mínimo, por pouco tempo.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O limite também vaza informação",
        texto:
          "Limitar tentativas combate o palpite **online**; não protege contra a senha correta vazada (isso pede MFA e bloqueio de senhas vazadas, veja Q134). E a resposta importa: um `429` por IP é aceitável, mas “conta bloqueada” confirma que a conta existe. Toda resposta de limite deve ser igual para contas reais e inexistentes.",
      },
    ],
    armadilhas: [
      "Bloqueio duro por conta, com contador permanente e sem saída: qualquer um que saiba o e-mail tranca a conta alheia.",
      "Contar só por IP: quem está atrás de um NAT é punido junto, e uma botnet com milhares de IPs passa; ou confiar em `X-Forwarded-For` sem validar o proxy.",
      "Guardar o contador na memória de cada instância: com N instâncias, o limite efetivo vira N vezes maior e some a cada reinício.",
      "Zerar o contador em qualquer login bem-sucedido: o invasor entra na conta dele entre as tentativas e reinicia o limite.",
    ],
    autoteste: [
      {
        pergunta: "Por que bloquear a conta após N falhas pode virar negação de serviço, e o que usar no lugar?",
        resposta:
          "Porque o atacante só precisa do identificador para disparar as N falhas e impedir o dono de entrar. Use atraso progressivo e bloqueio curto, um desafio adicional (CAPTCHA, MFA, dispositivo conhecido) e contadores em mais de uma dimensão.",
      },
      {
        pergunta: "Por que usar mais de uma dimensão (conta, IP e par) no contador?",
        resposta:
          "Cada uma cobre a falha da outra: o IP pega um host que varre contas, a conta pega vários IPs contra um alvo, e o par permite desafiar o IP suspeito sem trancar o dono num IP ou dispositivo que ele já usa.",
      },
    ],
  },
  en: {
    titulo: "Login rate limiting and lockout",
    pergunta:
      "How would you design rate limiting and account lockout for a login endpoint while preventing the lockout itself from becoming a denial-of-service attack?",
    porqueEsteMetodo:
      "The components of a limiter look like arbitrary numbers until each one is born from a flaw. Starting from “no limit” and fixing one flaw at a time shows why the final design has several dimensions and prefers a challenge to a lockout.",
    resposta30s:
      "Start by counting failures and evolve in layers: counters per **account, IP and pair**, **progressive delay** and an **extra challenge** (CAPTCHA, MFA, known device) in place of a hard lockout, all in a shared store such as **Redis**, with a window and TTL. A hard per-account lockout becomes **denial of service** (anyone who knows the email locks the owner out), so the limit should fall on whoever fails in volume and leave a path for the legitimate owner. Finish with alerts, uniform responses and exceptions for trusted origins.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one flaw at a time",
        passos: [
          {
            titulo: "1. No limit",
            texto:
              "Anyone tests thousands of passwords a minute, against one account (brute force) or many (stuffing and spraying). → Breaks: the slow hash only limits speed per server, and whoever has many machines is not slowed.",
          },
          {
            titulo: "2. Hard lockout per account (N failures and the account locks)",
            texto:
              "It slows brute force against one account. → Breaks: **the lockout becomes a weapon**. Whoever knows the email triggers N failures and keeps the owner out (account denial of service), and the “account locked” notice still confirms that the account exists (see Q134).",
          },
          {
            titulo: "3. Progressive delay, short lockout and a challenge",
            texto:
              "Instead of locking, each failure increases the wait (seconds, then minutes) and, after a few failures, a challenge is requested: CAPTCHA, an email code, MFA, or an already-known device (signed cookie). The owner always has a path, the bot pays dearly. → Breaks: the attacker switches accounts on every attempt and escapes a per-account counter.",
          },
          {
            titulo: "4. A counter per IP (and per range)",
            texto:
              "It stops a host that sweeps many accounts. → Breaks: botnets use thousands of IPs with one or two attempts each, an entire office behind a NAT shows up as one IP (false positive) and IPv6 gives plenty of addresses (count by prefix, such as a /64). Only trust `X-Forwarded-For` when it comes from your trusted proxy, or the attacker forges the IP and escapes the limit.",
          },
          {
            titulo: "5. A counter per pair (account, IP) and a global signal",
            texto:
              "A failure from a new IP weighs more than one from an IP or device the person always uses: the pair lets you challenge the suspect without locking out the owner. A global failure counter switches on a defensive mode (a challenge for every new device). → Breaks: with several instances, each one’s in-memory counter stops being valid.",
          },
          {
            titulo: "6. Shared state, with a window",
            texto:
              "Counters in a fast shared store (Redis), with an atomic increment and a TTL, in a sliding window or token bucket so bursts are not allowed at the window boundary. → Breaks: the store goes down. Decide in advance whether login fails open (with lower local limits) or closed, and monitor it.",
          },
          {
            titulo: "7. Operation",
            texto:
              "Small, audited exemptions for trusted IPs or VPNs; a uniform response (without revealing which counter tripped); alerts on failure spikes; a notice to the account owner about attempts; the pair counter reset only after a verified success; and, best of all, reducing the value of a guess with MFA or passkeys (see Q92).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Atomic counting per dimension, with a challenge instead of a lockout",
        legenda: "TypeScript",
        codigo: `import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);
// INCR and EXPIRE together: the key never ends up without a TTL
const COUNT =
  "local n = redis.call('INCR', KEYS[1]) " +
  "if n == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end return n";
const count = (key: string, windowSec: number) =>
  redis.eval(COUNT, 1, key, windowSec) as Promise<number>;

export async function needsChallenge(account: string, ip: string) {
  const id = account.trim().toLowerCase();
  const [perAccount, perIp, perPair] = await Promise.all([
    count("login:account:" + id, 900),
    count("login:ip:" + ip, 900),
    count("login:pair:" + id + ":" + ip, 900),
  ]);
  // Example thresholds: adjust with real data
  return perPair > 5 || perIp > 50 || perAccount > 20;
}`,
        nota: "It is a fixed window for simplicity: it allows up to double the limit at the window boundary, which a sliding window (sorted set) or a token bucket fixes. The result triggers a challenge, not a permanent lockout.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Limit the attacker, not the account",
        texto:
          "The cost should fall on whoever fails **in volume and suspiciously**, and the legitimate owner should keep a path (a challenge, a known device, recovery). Prefer **delay and challenge** to a hard lockout, use **more than one dimension** (account, IP, pair, global) because each covers the other’s flaw, and lock as little as possible, for a short time.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The limit leaks information too",
        texto:
          "Attempt limiting fights **online** guessing; it does not protect against a leaked correct password (that calls for MFA and blocking leaked passwords, see Q134). And the response matters: a `429` per IP is acceptable, but “account locked” confirms that the account exists. Every limit response must be identical for real and nonexistent accounts.",
      },
    ],
    armadilhas: [
      "A hard per-account lockout with a permanent counter and no way out: anyone who knows the email locks somebody else’s account.",
      "Counting only per IP: people behind a NAT are punished together, and a botnet with thousands of IPs gets through; or trusting `X-Forwarded-For` without validating the proxy.",
      "Keeping the counter in each instance’s memory: with N instances the effective limit becomes N times larger and vanishes on every restart.",
      "Resetting the counter on any successful login: the attacker signs in to their own account between attempts and restarts the limit.",
    ],
    autoteste: [
      {
        pergunta:
          "Why can locking the account after N failures turn into denial of service, and what do you use instead?",
        resposta:
          "Because the attacker only needs the identifier to trigger the N failures and keep the owner out. Use progressive delay and a short lockout, an extra challenge (CAPTCHA, MFA, known device) and counters on more than one dimension.",
      },
      {
        pergunta: "Why use more than one dimension (account, IP and pair) in the counter?",
        resposta:
          "Each covers the other’s flaw: the IP catches a host sweeping accounts, the account catches many IPs against one target, and the pair lets you challenge the suspect IP without locking the owner out of an IP or device they already use.",
      },
    ],
  },
};
