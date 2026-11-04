import type { Pergunta } from "../../tipos";

// D64 · Proxy reverso
export const d064: Pergunta = {
  numero: 364,
  modulo: "devinterview-avancado",
  metodo: "feynman",
  pt: {
    titulo: "Proxy reverso",
    pergunta: "Explique o papel de um proxy reverso com aplicações Node.js.",
    porqueEsteMetodo:
      "O proxy reverso é um intermediário fácil de visualizar como a recepção de um prédio e fácil de confundir com outros tipos de proxy. A analogia dá o papel, a tabela lista o que ele faz por você e o limite mostra onde ele vira problema.",
    resposta30s:
      "Um **proxy reverso** (Nginx, HAProxy, Caddy, o balanceador da nuvem) fica **na frente** da aplicação Node.js: recebe as requisições, **termina o TLS**, serve arquivos estáticos, comprime, aplica limites e **distribui o tráfego entre várias instâncias** (round-robin, menos conexões), tirando da rotação as que falham no health check. Como a aplicação só enxerga o proxy, ele repassa o IP e o protocolo do cliente em `X-Forwarded-*`, e o Express precisa de `trust proxy` para lê-los.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense na recepção de um prédio comercial. Os visitantes nunca andam sozinhos pelos andares: a recepção confere quem chegou, entrega panfletos que já estão no balcão (sem incomodar ninguém lá em cima), recusa quem aparece com pacotes demais e encaminha cada pessoa ao escritório certo. Se um escritório está fechado, manda a visita para outro que atende o mesmo assunto.",
        tecnico:
          "Um **proxy reverso** recebe as requisições dos clientes e as repassa a um ou mais servidores de aplicação (as instâncias do Node.js), devolvendo as respostas como se fossem suas. É o oposto do proxy “comum” (forward proxy), que fica do lado do cliente. Nginx, HAProxy, Caddy e os balanceadores das nuvens fazem esse papel. Com ele na frente, o Node.js se concentra na regra de negócio, e as tarefas de rede ficam com uma peça feita para isso.",
        limite:
          "A recepção é um ponto único de falha: se ela cai, o prédio inteiro fica inacessível (use mais de um proxy ou um serviço gerenciado). Ela também não torna rápido um escritório lento, e quem entra pela porta dos fundos (a porta do Node.js exposta na rede) passa sem nenhuma checagem.",
      },
      {
        tipo: "fluxo",
        titulo: "O caminho de uma requisição",
        etapas: [
          "O navegador abre `https://api.exemplo.com`; o proxy responde na porta 443 e termina o TLS (dentro da rede privada o tráfego segue como HTTP simples)",
          "O proxy aplica as regras: limite de tamanho do corpo, limite de taxa, compressão e, se for um arquivo estático, responde ele mesmo",
          "Para o resto, escolhe uma instância saudável (round-robin, menos conexões ou outra regra) e encaminha a requisição, acrescentando `X-Forwarded-For`, `X-Forwarded-Proto` e `Host`",
          "A instância do Node.js processa e responde; o proxy devolve a resposta ao cliente (e pode guardá-la em cache)",
          "Se uma instância deixa de responder ao health check, o proxy a tira da rotação até ela voltar",
        ],
        nota: "Com várias instâncias, sessões guardadas em memória quebram: use um armazenamento compartilhado ou afinidade de sessão no balanceador (veja D79).",
      },
      {
        tipo: "tabela",
        titulo: "O que o proxy faz por você",
        colunas: ["Função", "O que o proxy faz", "Cuidado"],
        linhas: [
          [
            "Terminação de TLS",
            "Guarda o certificado, negocia o HTTPS e fala HTTP simples com o Node.js",
            "O trecho entre proxy e aplicação precisa estar numa rede confiável (ou usar TLS também ali)",
          ],
          [
            "Balanceamento",
            "Distribui entre instâncias: round-robin, menos conexões ou hash do IP",
            "Estado em memória e sessões exigem armazenamento compartilhado ou afinidade",
          ],
          [
            "Health checks",
            "Tira da rotação a instância que não responde e a devolve quando ela se recupera",
            "A rota de saúde deve refletir a prontidão real, não só “o processo existe”",
          ],
          [
            "Estáticos, compressão e cache",
            "Serve arquivos e comprime respostas sem passar pelo laço de eventos do Node.js",
            "Cache de resposta personalizada pode entregar dados de uma pessoa a outra",
          ],
          [
            "Limites e proteção",
            "Tamanho de corpo, limite de taxa, timeouts e bloqueio de requisições malformadas",
            "Os limites do proxy e da aplicação precisam combinar",
          ],
          [
            "Cabeçalhos e WebSocket",
            "Repassa o cliente em `X-Forwarded-*` e encaminha `Upgrade` e `Connection` para o WebSocket",
            "Sem `trust proxy`, o Express vê o IP do proxy; sem `Upgrade`, o WebSocket falha",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Confiar no proxy, e só nele",
        legenda: "JavaScript",
        codigo:
          'import express from "express";\n\nconst app = express();\n\n// Atrás de UM proxy confiável: usa os X-Forwarded-* desse salto\napp.set("trust proxy", 1);\n\napp.get("/quem-sou-eu", (req, res) => {\n  res.json({\n    ip: req.ip, // o IP do cliente, não o do proxy\n    protocolo: req.protocol, // "https" se o proxy enviou X-Forwarded-Proto\n    seguro: req.secure,\n  });\n});\n\napp.listen(3000, "127.0.0.1"); // só o proxy alcança a aplicação',
        nota: "`trust proxy` aceita o número de saltos confiáveis, endereços ou sub-redes. Evite `true` se a aplicação também recebe conexões diretas da internet: o cliente poderia forjar o `X-Forwarded-For`. Confira a documentação do Express.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Três falhas clássicas",
        texto:
          "(1) **IP errado:** sem `trust proxy`, todo cliente parece ter o IP do proxy, e um limite de taxa por IP bloqueia todo mundo junto. (2) **Buffering:** o proxy pode acumular a resposta antes de enviá-la, o que quebra SSE e respostas em streaming; desligue o buffering nessas rotas. (3) **Timeouts desalinhados:** se o Node.js fecha uma conexão ociosa que o proxy ainda considera aberta, aparecem erros 502 ou 504 esporádicos; o `keepAliveTimeout` do servidor Node.js deve ser maior que o tempo ocioso do proxy, e os timeouts de requisição devem combinar.",
      },
    ],
    armadilhas: [
      "Esquecer `trust proxy`: `req.ip` e `req.protocol` vêm errados, cookies `secure` não são emitidos e o limite de taxa por IP pune todos os clientes de uma vez.",
      "Usar `trust proxy` como `true` com a aplicação exposta: qualquer cliente forja `X-Forwarded-For` e burla limites e logs.",
      "Deixar a porta do Node.js acessível na internet, contornando o proxy e as regras dele: escute só na rede privada ou em `127.0.0.1`.",
      "Esquecer o buffering e os timeouts em SSE, streaming e WebSocket: a resposta fica presa no proxy ou a conexão cai a intervalos regulares.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre um proxy reverso e um proxy comum?",
        resposta:
          "O proxy comum (forward) fica do lado do cliente e fala em nome dele, escondendo quem navega. O reverso fica do lado do servidor e fala em nome da aplicação, escondendo e protegendo os servidores atrás dele. O cliente nem sabe quantos servidores existem.",
      },
      {
        pergunta: "Por que `req.ip` mostra sempre o mesmo endereço atrás de um proxy, e como corrigir?",
        resposta:
          "Porque a conexão TCP vem do proxy. O proxy repassa o IP verdadeiro em `X-Forwarded-For`, e o Express só o usa se `trust proxy` indicar quais saltos são confiáveis.",
      },
    ],
  },
  en: {
    titulo: "Reverse proxy",
    pergunta: "Explain the role of a reverse proxy with Node.js applications.",
    porqueEsteMetodo:
      "A reverse proxy is an intermediary that is easy to picture as a building’s front desk and easy to confuse with other kinds of proxy. The analogy gives the role, the table lists what it does for you and the limit shows where it becomes a problem.",
    resposta30s:
      "A **reverse proxy** (Nginx, HAProxy, Caddy, the cloud load balancer) sits **in front of** the Node.js application: it receives the requests, **terminates TLS**, serves static files, compresses, applies limits and **spreads traffic across several instances** (round-robin, least connections), dropping from the rotation those that fail the health check. Since the application only sees the proxy, it forwards the client’s IP and protocol in `X-Forwarded-*`, and Express needs `trust proxy` to read them.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of the front desk of an office building. Visitors never wander the floors alone: the desk checks who arrived, hands out leaflets that are already at the counter (without bothering anyone upstairs), turns away anyone showing up with too many packages and sends each person to the right office. If an office is closed, it sends the visitor to another that handles the same matter.",
        tecnico:
          "A **reverse proxy** receives clients’ requests and forwards them to one or more application servers (the Node.js instances), returning the responses as if they were its own. It is the opposite of the “ordinary” (forward) proxy, which sits on the client’s side. Nginx, HAProxy, Caddy and cloud load balancers play this role. With it in front, Node.js focuses on business logic, and network chores go to a component built for them.",
        limite:
          "The front desk is a single point of failure: if it goes down, the whole building is unreachable (use more than one proxy or a managed service). It also doesn’t make a slow office fast, and anyone entering through the back door (the Node.js port exposed to the network) gets in with no checks at all.",
      },
      {
        tipo: "fluxo",
        titulo: "The path of a request",
        etapas: [
          "The browser opens `https://api.example.com`; the proxy answers on port 443 and terminates TLS (inside the private network the traffic continues as plain HTTP)",
          "The proxy applies its rules: body size limit, rate limit, compression and, for a static file, it answers by itself",
          "For everything else it picks a healthy instance (round-robin, least connections or another rule) and forwards the request, adding `X-Forwarded-For`, `X-Forwarded-Proto` and `Host`",
          "The Node.js instance processes and responds; the proxy returns the response to the client (and may cache it)",
          "If an instance stops answering the health check, the proxy takes it out of the rotation until it recovers",
        ],
        nota: "With several instances, sessions kept in memory break: use shared storage or session affinity on the load balancer (see D79).",
      },
      {
        tipo: "tabela",
        titulo: "What the proxy does for you",
        colunas: ["Function", "What the proxy does", "Watch out for"],
        linhas: [
          [
            "TLS termination",
            "Holds the certificate, negotiates HTTPS and speaks plain HTTP to Node.js",
            "The stretch between proxy and application must be on a trusted network (or use TLS there too)",
          ],
          [
            "Load balancing",
            "Spreads requests across instances: round-robin, least connections or IP hash",
            "In-memory state and sessions need shared storage or affinity",
          ],
          [
            "Health checks",
            "Removes an instance that stops answering from the rotation and returns it when it recovers",
            "The health route should reflect real readiness, not just “the process exists”",
          ],
          [
            "Static files, compression and cache",
            "Serves files and compresses responses without going through Node.js’s event loop",
            "Caching a personalized response can hand one person’s data to another",
          ],
          [
            "Limits and protection",
            "Body size, rate limits, timeouts and blocking of malformed requests",
            "The proxy’s and the application’s limits must agree",
          ],
          [
            "Headers and WebSocket",
            "Forwards the client in `X-Forwarded-*` and passes `Upgrade` and `Connection` for WebSocket",
            "Without `trust proxy`, Express sees the proxy’s IP; without `Upgrade`, WebSocket fails",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Trust the proxy, and only it",
        legenda: "JavaScript",
        codigo:
          'import express from "express";\n\nconst app = express();\n\n// Behind ONE trusted proxy: use that hop\'s X-Forwarded-* headers\napp.set("trust proxy", 1);\n\napp.get("/who-am-i", (req, res) => {\n  res.json({\n    ip: req.ip, // the client\'s IP, not the proxy\'s\n    protocol: req.protocol, // "https" if the proxy sent X-Forwarded-Proto\n    secure: req.secure,\n  });\n});\n\napp.listen(3000, "127.0.0.1"); // only the proxy can reach the application',
        nota: "`trust proxy` accepts the number of trusted hops, addresses or subnets. Avoid `true` if the application also receives direct connections from the internet: a client could forge `X-Forwarded-For`. Check the Express documentation.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Three classic failures",
        texto:
          "(1) **Wrong IP:** without `trust proxy`, every client appears to have the proxy’s IP, and a per-IP rate limit blocks everyone together. (2) **Buffering:** the proxy may accumulate the response before sending it, which breaks SSE and streaming responses; turn buffering off on those routes. (3) **Misaligned timeouts:** if Node.js closes an idle connection that the proxy still considers open, sporadic 502 or 504 errors appear; the Node.js server’s `keepAliveTimeout` should be greater than the proxy’s idle time, and request timeouts should match.",
      },
    ],
    armadilhas: [
      "Forgetting `trust proxy`: `req.ip` and `req.protocol` come out wrong, `secure` cookies are not issued and a per-IP rate limit punishes all clients at once.",
      "Setting `trust proxy` to `true` with the application exposed: any client forges `X-Forwarded-For` and bypasses limits and logs.",
      "Leaving the Node.js port reachable from the internet, bypassing the proxy and its rules: listen only on the private network or `127.0.0.1`.",
      "Forgetting buffering and timeouts with SSE, streaming and WebSocket: the response gets stuck in the proxy or the connection drops at regular intervals.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between a reverse proxy and an ordinary proxy?",
        resposta:
          "The ordinary (forward) proxy sits on the client’s side and speaks on its behalf, hiding who is browsing. The reverse proxy sits on the server’s side and speaks on behalf of the application, hiding and protecting the servers behind it. The client doesn’t even know how many servers there are.",
      },
      {
        pergunta: "Why does `req.ip` always show the same address behind a proxy, and how do you fix it?",
        resposta:
          "Because the TCP connection comes from the proxy. The proxy forwards the real IP in `X-Forwarded-For`, and Express only uses it if `trust proxy` says which hops are trusted.",
      },
    ],
  },
};
