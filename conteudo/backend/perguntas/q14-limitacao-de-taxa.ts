import type { Pergunta } from "../../tipos";

// Q14 · Limitação de taxa
export const q14: Pergunta = {
  numero: 14,
  modulo: "cache-e-desempenho",
  metodo: "feynman",
  pt: {
    titulo: "Limitação de taxa",
    pergunta: "Explique o conceito de limitação de taxa e como isso ajuda na segurança da API.",
    porqueEsteMetodo:
      "A ideia cabe numa analogia (o porteiro da balada). Depois dela vêm os algoritmos reais e os limites da analogia, como IP compartilhado e atacante distribuído.",
    resposta30s:
      "**Rate limiting** limita quantas requisições uma identidade (IP, chave de API, usuário, tenant) pode fazer numa janela de tempo; o excesso recebe `429 Too Many Requests`. Protege contra **força bruta** (login, OTP), **credential stuffing**, **scraping**, **DoS de aplicação**, abuso de endpoints caros e “vizinho barulhento” em sistemas multiusuário. Os algoritmos usuais são janela fixa, janela deslizante, **token bucket** e leaky bucket.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "O porteiro da balada deixa entrar 30 pessoas por minuto. Quem passa disso espera na fila ou é barrado. Não importa se quem está na porta é um cliente legítimo ou um encrenqueiro: a casa se protege dos dois.",
        tecnico:
          "O servidor (ou o gateway) conta as requisições por identidade e janela. Passou do limite: responde `429` com `Retry-After` (e cabeçalhos como `RateLimit-*` ou `X-RateLimit-*`) dizendo quando tentar de novo. O contador fica geralmente no Redis (`INCR` + `EXPIRE`, ou um script Lua atômico) para valer em todos os servidores. Limites diferentes por rota: login 5 por minuto, leitura 1.000.",
        limite:
          "Atrás de um NAT corporativo centenas de pessoas dividem um IP e o limite por IP pune inocentes. Um atacante com milhares de IPs (botnet) passa por limites por IP. Por isso combine identidades (IP + conta + dispositivo) e use outras defesas junto (WAF, CAPTCHA, detecção de anomalia).",
      },
      {
        tipo: "tabela",
        titulo: "Algoritmos",
        colunas: ["Algoritmo", "Como funciona", "Prós e contras"],
        linhas: [
          [
            "Janela fixa",
            "Contador zerado a cada minuto",
            "Simples; permite o dobro do limite na virada da janela (rajada)",
          ],
          [
            "Janela deslizante",
            "Conta as requisições dos últimos N segundos (log ou contadores ponderados)",
            "Mais preciso; o log custa memória, a versão com contadores é aproximada",
          ],
          [
            "Token bucket",
            "Um balde com capacidade B recebe r fichas por segundo; cada requisição gasta uma",
            "Aceita rajadas controladas e limita a média; o mais usado",
          ],
          [
            "Leaky bucket",
            "Requisições entram numa fila que escoa a taxa constante",
            "Suaviza a saída; rajadas viram espera ou descarte",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Token bucket em pseudocódigo",
        legenda: "pseudocódigo",
        codigo:
          "fichas = min(capacidade, fichas + (agora - ultimo) * taxa)   # reabastece\nultimo = agora\nif fichas >= 1:\n    fichas -= 1\n    permitir()\nelse:\n    responder(429, retry_after=(1 - fichas) / taxa)",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Decisão de projeto",
        texto:
          "Se o armazenamento do contador cair, o limitador **falha aberto** (deixa passar, preserva disponibilidade) ou **fechado** (bloqueia, preserva proteção)? Para login e pagamentos costuma-se preferir fechado; para leitura pública, aberto.",
      },
    ],
    armadilhas: [
      "Limitar só por IP: pune redes compartilhadas e é contornado por botnets.",
      "Janela fixa sem perceber a rajada do dobro na virada.",
      "Limite no código de cada instância (em memória) em vez de um contador compartilhado: cada servidor deixa passar seu pedaço.",
      "Achar que rate limiting substitui autenticação, autorização, WAF ou proteção de DDoS em camada de rede.",
    ],
    autoteste: [
      {
        pergunta: "Que resposta HTTP indica que o limite foi excedido e que cabeçalho orienta o cliente?",
        resposta: "`429 Too Many Requests`, com `Retry-After` indicando em quantos segundos tentar de novo.",
      },
      {
        pergunta: "Qual a vantagem do token bucket sobre a janela fixa?",
        resposta: "Permite rajadas curtas controladas, limita a taxa média e não tem o pico duplo na virada da janela.",
      },
    ],
  },
  en: {
    titulo: "Rate limiting",
    pergunta: "Explain the concept of rate limiting and how it helps API security.",
    porqueEsteMetodo:
      "The idea fits in an analogy (the club bouncer). After it come the real algorithms and the analogy’s limits, like shared IPs and distributed attackers.",
    resposta30s:
      "**Rate limiting** caps how many requests an identity (IP, API key, user, tenant) can make in a time window; the excess gets `429 Too Many Requests`. It protects against **brute force** (login, OTP), **credential stuffing**, **scraping**, **application-layer DoS**, abuse of expensive endpoints and “noisy neighbors” in multi-tenant systems. The usual algorithms are fixed window, sliding window, **token bucket** and leaky bucket.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "The club bouncer lets in 30 people a minute. Anyone beyond that waits in line or is turned away. It does not matter whether the person at the door is a legitimate customer or a troublemaker: the house protects itself from both.",
        tecnico:
          "The server (or gateway) counts requests per identity and window. Over the limit: it answers `429` with `Retry-After` (and headers like `RateLimit-*` or `X-RateLimit-*`) saying when to retry. The counter usually lives in Redis (`INCR` + `EXPIRE`, or an atomic Lua script) so it holds across all servers. Different limits per route: login 5 per minute, reads 1,000.",
        limite:
          "Behind a corporate NAT hundreds of people share one IP and a per-IP limit punishes the innocent. An attacker with thousands of IPs (botnet) slips past per-IP limits. So combine identities (IP + account + device) and use other defenses alongside (WAF, CAPTCHA, anomaly detection).",
      },
      {
        tipo: "tabela",
        titulo: "Algorithms",
        colunas: ["Algorithm", "How it works", "Pros and cons"],
        linhas: [
          [
            "Fixed window",
            "Counter reset every minute",
            "Simple; allows double the limit around the window boundary (burst)",
          ],
          [
            "Sliding window",
            "Counts requests in the last N seconds (log or weighted counters)",
            "More precise; the log costs memory, the counter version is approximate",
          ],
          [
            "Token bucket",
            "A bucket of capacity B gains r tokens per second; each request spends one",
            "Allows controlled bursts and bounds the average; the most used",
          ],
          [
            "Leaky bucket",
            "Requests enter a queue that drains at a constant rate",
            "Smooths output; bursts become waiting or dropping",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Token bucket in pseudocode",
        legenda: "pseudocode",
        codigo:
          "tokens = min(capacity, tokens + (now - last) * rate)   # refill\nlast = now\nif tokens >= 1:\n    tokens -= 1\n    allow()\nelse:\n    respond(429, retry_after=(1 - tokens) / rate)",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Design decision",
        texto:
          "If the counter store goes down, does the limiter **fail open** (let traffic pass, preserve availability) or **closed** (block, preserve protection)? For login and payments closed is usually preferred; for public reads, open.",
      },
    ],
    armadilhas: [
      "Limiting only by IP: punishes shared networks and is bypassed by botnets.",
      "Fixed window without noticing the double burst at the boundary.",
      "A limit in each instance’s own memory instead of a shared counter: each server lets its share through.",
      "Believing rate limiting replaces authentication, authorization, a WAF or network-layer DDoS protection.",
    ],
    autoteste: [
      {
        pergunta: "Which HTTP response signals the limit was exceeded and which header guides the client?",
        resposta: "`429 Too Many Requests`, with `Retry-After` saying in how many seconds to retry.",
      },
      {
        pergunta: "What is the token bucket’s advantage over a fixed window?",
        resposta:
          "It allows short controlled bursts, bounds the average rate and has no double peak at the window boundary.",
      },
    ],
  },
};
