import type { Pergunta } from "../../tipos";

// F68 · O módulo dns
export const f068: Pergunta = {
  numero: 468,
  modulo: "founditgulf-avancadas",
  metodo: "compare",
  pt: {
    titulo: "O módulo dns",
    pergunta: "O que é o módulo DNS no Node.js?",
    porqueEsteMetodo:
      "O módulo `dns` tem duas famílias de funções que parecem a mesma coisa e se comportam de modo bem diferente (quem resolve, o que respeita, onde executa). A matriz mostra a diferença e a regra de decisão diz qual usar.",
    resposta30s:
      "O **`node:dns`** resolve nomes de domínio em endereços e outros registros. Há duas famílias: **`dns.lookup`**, que usa o **resolvedor do sistema operacional** (respeita o arquivo `hosts`) e roda no **pool de threads do libuv**, e **`dns.resolve*`**, que faz **consultas DNS pela rede**, sem passar pelo `hosts`, e devolve vários tipos de registro (A, AAAA, MX, TXT, SRV). O Node.js não faz cache de DNS, e há também `dns.promises` para usar com `await`.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "`dns.lookup` e `dns.resolve*`",
        colunas: ["Aspecto", "`dns.lookup`", "`dns.resolve*` (`resolve4`, `resolveMx`…)"],
        linhas: [
          [
            "Como resolve",
            "Chama o resolvedor do sistema operacional, o mesmo que o `ping`, o `curl` e o navegador usam",
            "Faz consultas DNS pela rede, diretamente aos servidores DNS configurados, com uma biblioteca de DNS própria (c-ares)",
          ],
          [
            "Arquivo `hosts` e configuração do sistema",
            "Respeita (entradas de `hosts`, ordem de resolução do sistema)",
            "Ignora: só enxerga o que os servidores DNS respondem",
          ],
          [
            "Onde executa",
            "Numa thread do pool do libuv, porque a chamada do sistema é bloqueante",
            "Assíncrono de verdade, sem ocupar o pool de threads",
          ],
          ["Tipos de registro", "Só endereços (A e AAAA)", "Vários: A, AAAA, MX, TXT, SRV, NS, CNAME, entre outros"],
          [
            "O que devolve",
            "Um endereço e a família (4 ou 6); todos, com `{ all: true }`",
            "A lista completa de registros; o TTL, quando pedido",
          ],
          [
            "Quem usa por padrão",
            "`net.connect`, `http.request`, `fetch`: tudo o que conecta a um nome de host",
            "Uso explícito: descoberta de serviço (SRV), validação de e-mail (MX, TXT), ferramentas de diagnóstico",
          ],
        ],
        nota: "Os dois têm a versão com promises em `node:dns/promises` (ou `dns.promises`). `dns.setServers` e a classe `dns.Resolver` mudam os servidores só das funções `resolve*`, não do `lookup`.",
      },
      {
        tipo: "codigo",
        titulo: "Lookup, resolve e erros",
        legenda: "JavaScript",
        codigo: [
          'import dns from "node:dns/promises";',
          "",
          'const { address, family } = await dns.lookup("example.com"); // resolvedor do sistema',
          "console.log(address, family); // um endereço e a família: 4 ou 6",
          "",
          'const ips = await dns.resolve4("example.com"); // consulta DNS pela rede',
          'const mx = await dns.resolveMx("example.com"); // [{ exchange, priority }, ...]',
          'const txt = await dns.resolveTxt("example.com"); // [["v=spf1 ..."], ...]',
          "",
          "try {",
          '  await dns.lookup("dominio-que-nao-existe.invalid");',
          "} catch (erro) {",
          '  console.log(erro.code); // "ENOTFOUND" ou "EAI_AGAIN"',
          "}",
        ].join("\n"),
        nota: "`ENOTFOUND` indica que o nome não existe; `EAI_AGAIN` é uma falha temporária do DNS, e vale tentar de novo com espera crescente.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Para **conectar a um host**, deixe o Node.js usar o `lookup` (é o que `net`, `http` e `fetch` já fazem): você obtém o mesmo resultado que o resto do sistema, com `hosts`, DNS corporativo e VPN. Use o **`resolve*`** quando precisa de **outros registros além do endereço** (MX, TXT, SRV), quer consultar DNS **sem passar pelo sistema** ou quer escolher os servidores de DNS (`setServers`, `Resolver`). Se o `resolve` não encontra um nome que o `ping` encontra, a causa quase sempre é o `hosts` ou uma configuração local.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cache, pool de threads e IPv4 x IPv6",
        texto:
          "O Node.js **não faz cache de DNS**: cada conexão nova pode gerar uma consulta (o sistema operacional ou um resolvedor local podem ter cache próprio). Em alto volume, isso custa latência; reaproveite conexões (keep-alive) ou use um cache com TTL. Como o `lookup` roda no **pool de threads do libuv** (quatro por padrão, compartilhado com `fs`, `crypto` e `zlib`), muitos `lookup` lentos ao mesmo tempo atrasam também a leitura de arquivos. E a ordem em que o Node.js tenta IPv4 e IPv6 mudou ao longo das versões (`dns.setDefaultResultOrder`, `--dns-result-order`): o clássico é `localhost` resolver para `::1` e o servidor escutar só em IPv4. Confira a documentação.",
      },
    ],
    armadilhas: [
      "Achar que `dns.resolve` enxerga o arquivo `hosts`, a VPN ou o DNS interno do sistema: quem respeita a configuração do sistema é o `lookup`.",
      "Disparar milhares de `lookup` ao mesmo tempo: eles ocupam as threads do pool e atrasam arquivos e criptografia.",
      "Supor que o Node.js guarda o DNS em cache (ou nunca o renova): a resolução se repete a cada conexão nova, e o endereço pode mudar atrás de um balanceador. Se cachear, respeite o TTL.",
      "Tratar `ENOTFOUND` e `EAI_AGAIN` do mesmo jeito: o primeiro é um nome que não existe (repetir não adianta); o segundo é falha temporária, que pede nova tentativa com espera.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre `dns.lookup` e `dns.resolve`?",
        resposta:
          "O `lookup` usa o resolvedor do sistema operacional (respeita o `hosts`), roda no pool de threads do libuv e devolve só endereços. O `resolve*` faz consultas DNS pela rede, ignora o `hosts`, não usa o pool e devolve vários tipos de registro.",
      },
      {
        pergunta: "Por que muitos `dns.lookup` podem atrasar a leitura de arquivos?",
        resposta:
          "Porque o `lookup` e várias operações de `fs` dividem o mesmo pool de threads do libuv, de tamanho limitado. Se muitas consultas lentas ocupam as threads, as demais operações esperam na fila.",
      },
    ],
  },
  en: {
    titulo: "The dns module",
    pergunta: "What is DNS module in Node.js?",
    porqueEsteMetodo:
      "The `dns` module has two families of functions that look like the same thing and behave very differently (who resolves, what they respect, where they run). The matrix shows the difference and the decision rule says which to use.",
    resposta30s:
      "**`node:dns`** resolves domain names into addresses and other records. There are two families: **`dns.lookup`**, which uses the **operating system’s resolver** (it respects the `hosts` file) and runs on the **libuv thread pool**, and **`dns.resolve*`**, which makes **DNS queries over the network**, bypassing `hosts`, and returns several record types (A, AAAA, MX, TXT, SRV). Node.js does not cache DNS results, and there is also `dns.promises` for use with `await`.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "`dns.lookup` and `dns.resolve*`",
        colunas: ["Aspect", "`dns.lookup`", "`dns.resolve*` (`resolve4`, `resolveMx`…)"],
        linhas: [
          [
            "How it resolves",
            "Calls the operating system’s resolver, the same one `ping`, `curl` and the browser use",
            "Makes DNS queries over the network, straight to the configured DNS servers, using a DNS library of its own (c-ares)",
          ],
          [
            "`hosts` file and system configuration",
            "Respects them (`hosts` entries, the system’s resolution order)",
            "Ignores them: it only sees what the DNS servers answer",
          ],
          [
            "Where it runs",
            "On a libuv pool thread, because the system call is blocking",
            "Truly asynchronous, without occupying the thread pool",
          ],
          ["Record types", "Addresses only (A and AAAA)", "Many: A, AAAA, MX, TXT, SRV, NS, CNAME, among others"],
          [
            "What it returns",
            "One address and the family (4 or 6); all of them, with `{ all: true }`",
            "The full list of records; the TTL, when requested",
          ],
          [
            "Who uses it by default",
            "`net.connect`, `http.request`, `fetch`: everything that connects to a host name",
            "Explicit use: service discovery (SRV), email validation (MX, TXT), diagnostic tools",
          ],
        ],
        nota: "Both have a promise version in `node:dns/promises` (or `dns.promises`). `dns.setServers` and the `dns.Resolver` class change the servers of the `resolve*` functions only, not of `lookup`.",
      },
      {
        tipo: "codigo",
        titulo: "Lookup, resolve and errors",
        legenda: "JavaScript",
        codigo: [
          'import dns from "node:dns/promises";',
          "",
          'const { address, family } = await dns.lookup("example.com"); // system resolver',
          "console.log(address, family); // one address and the family: 4 or 6",
          "",
          'const ips = await dns.resolve4("example.com"); // DNS query over the network',
          'const mx = await dns.resolveMx("example.com"); // [{ exchange, priority }, ...]',
          'const txt = await dns.resolveTxt("example.com"); // [["v=spf1 ..."], ...]',
          "",
          "try {",
          '  await dns.lookup("domain-that-does-not-exist.invalid");',
          "} catch (error) {",
          '  console.log(error.code); // "ENOTFOUND" or "EAI_AGAIN"',
          "}",
        ].join("\n"),
        nota: "`ENOTFOUND` means the name does not exist; `EAI_AGAIN` is a temporary DNS failure, and trying again with a growing wait is worthwhile.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "To **connect to a host**, let Node.js use `lookup` (it is what `net`, `http` and `fetch` already do): you get the same result as the rest of the system, with `hosts`, corporate DNS and VPN. Use **`resolve*`** when you need **records other than the address** (MX, TXT, SRV), want to query DNS **without going through the system** or want to choose the DNS servers (`setServers`, `Resolver`). If `resolve` does not find a name that `ping` finds, the cause is almost always `hosts` or a local configuration.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Caching, the thread pool and IPv4 vs IPv6",
        texto:
          "Node.js **does not cache DNS**: each new connection may trigger a query (the operating system or a local resolver may have a cache of its own). At high volume, that costs latency; reuse connections (keep-alive) or use a cache that honors the TTL. Because `lookup` runs on the **libuv thread pool** (four threads by default, shared with `fs`, `crypto` and `zlib`), many slow `lookup` calls at once also delay file reads. And the order in which Node.js tries IPv4 and IPv6 has changed across versions (`dns.setDefaultResultOrder`, `--dns-result-order`): the classic case is `localhost` resolving to `::1` while the server listens only on IPv4. Check the documentation.",
      },
    ],
    armadilhas: [
      "Thinking `dns.resolve` sees the `hosts` file, the VPN or the system’s internal DNS: the one that respects the system configuration is `lookup`.",
      "Firing thousands of `lookup` calls at once: they occupy the pool threads and delay files and cryptography.",
      "Assuming Node.js caches DNS (or never refreshes it): resolution repeats on every new connection, and the address can change behind a load balancer. If you cache, honor the TTL.",
      "Treating `ENOTFOUND` and `EAI_AGAIN` the same: the first is a name that does not exist (retrying is pointless); the second is a temporary failure that calls for a retry with backoff.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `dns.lookup` and `dns.resolve`?",
        resposta:
          "`lookup` uses the operating system’s resolver (it respects `hosts`), runs on the libuv thread pool and returns only addresses. `resolve*` makes DNS queries over the network, ignores `hosts`, does not use the pool and returns several record types.",
      },
      {
        pergunta: "Why can many `dns.lookup` calls delay file reads?",
        resposta:
          "Because `lookup` and several `fs` operations share the same libuv thread pool, which has a limited size. If many slow queries occupy the threads, the other operations wait in the queue.",
      },
    ],
  },
};
