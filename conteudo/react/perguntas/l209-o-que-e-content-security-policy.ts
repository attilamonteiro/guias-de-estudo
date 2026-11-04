import type { Pergunta } from "../../tipos";

// L209 · O que é Content Security Policy
export const l209: Pergunta = {
  numero: 209,
  modulo: "linkedin-seguranca-e-a11y",
  metodo: "feynman",
  pt: {
    titulo: "O que é Content Security Policy",
    pergunta: "O que é Content Security Policy (CSP)?",
    porqueEsteMetodo:
      "A CSP é uma regra de “quem pode entrar”, e uma lista de convidados explica isso de imediato. Depois vêm o mecanismo real (cabeçalho, diretivas, nonces) e o ponto em que a imagem para de valer.",
    resposta30s:
      "A **Content Security Policy** é uma política enviada pelo servidor num **cabeçalho HTTP** que diz ao navegador **de quais origens** scripts, estilos, imagens e conexões são permitidos. Ela limita o dano de um **XSS**: mesmo que um script seja injetado, o navegador pode se recusar a executá-lo ou a falar com o servidor do atacante. É **defesa em profundidade**: não substitui sanitizar nem escapar.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine a lista de convidados na portaria de uma festa. O dono da casa (o seu servidor) entrega ao segurança (o navegador) uma lista dizendo quem pode entrar: scripts só de certos endereços, imagens só de outros, conexões só para determinados destinos. O segurança confere cada um que chega, e quem não está na lista fica de fora, mesmo que consiga chegar até a porta.",
        tecnico:
          "A política viaja no cabeçalho HTTP `Content-Security-Policy`, e o navegador a aplica a cada recurso da página. Cada **diretiva** cobre um tipo de recurso: `script-src` (scripts), `style-src`, `img-src`, `connect-src` (`fetch` e WebSocket), `frame-ancestors`, entre outras, e `default-src` serve de padrão para as que faltam. Os valores são origens (`'self'`, `https://cdn.exemplo.com`), **nonces** (um valor aleatório novo a cada resposta, repetido no atributo `nonce` das tags permitidas) e **hashes** do conteúdo de um script. Com uma política rígida, o navegador bloqueia script inline e `eval`, justamente o que um XSS costuma usar: mesmo que o atacante injete um `<script>`, ele não executa, e uma conexão para o servidor dele pode ser recusada por `connect-src`.",
        limite:
          "A lista de convidados não confere o que um convidado faz lá dentro: se uma origem permitida (um CDN) for comprometida, o script dela entra, e `'unsafe-inline'` equivale a deixar a porta aberta. A CSP **limita o dano** do XSS, mas não o impede: o HTML injetado ainda pode deformar a página. Por isso ela não substitui sanitizar (veja L200 e L202).",
      },
      {
        tipo: "tabela",
        titulo: "Diretivas mais usadas",
        colunas: ["Diretiva", "O que controla", "Exemplo de uso"],
        linhas: [
          ["`default-src`", "O valor padrão para os tipos sem diretiva própria", "`default-src 'self'`"],
          [
            "`script-src`",
            "De onde os scripts podem ser carregados e se scripts inline rodam",
            "`script-src 'self' 'nonce-...'`",
          ],
          ["`style-src`", "Folhas de estilo e estilos inline", "`style-src 'self' 'nonce-...'`"],
          ["`img-src`", "De onde as imagens vêm", "`img-src 'self' data: https://cdn.exemplo.com`"],
          ["`connect-src`", "Destinos de `fetch`, XHR e WebSocket", "`connect-src 'self' https://api.exemplo.com`"],
          [
            "`frame-ancestors`",
            "Quem pode embutir a sua página num `iframe` (contra clickjacking)",
            "`frame-ancestors 'none'`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Uma política enviada pelo servidor",
        legenda: "Cabeçalho HTTP",
        codigo: `Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-VALOR_ALEATORIO_POR_RESPOSTA';
  style-src 'self' 'nonce-VALOR_ALEATORIO_POR_RESPOSTA';
  img-src 'self' data: https://cdn.exemplo.com;
  connect-src 'self' https://api.exemplo.com;
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none'`,
        nota: 'O nonce precisa ser aleatório e novo a cada resposta, e o mesmo valor vai nas tags permitidas: `<script nonce="VALOR_ALEATORIO_POR_RESPOSTA" src="/app.js"></script>`.',
      },
      {
        tipo: "fluxo",
        titulo: "Como adotar sem quebrar o app",
        etapas: [
          "Comece em **modo somente relatório** (`Content-Security-Policy-Report-Only`): o navegador não bloqueia nada, só relata o que a política barraria",
          "Colete os relatórios por alguns dias e liste o que realmente carrega: scripts próprios, estilos, serviços de terceiros",
          "Troque o código inline por arquivos ou por **nonces e hashes** e remova o uso de `eval`",
          "Ative a política em modo de bloqueio (`Content-Security-Policy`), mantendo os relatórios ligados",
          "Monitore as violações e ajuste a cada nova biblioteca ou serviço de terceiros",
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Defesa em profundidade, e os atritos",
        texto:
          "A CSP é a **segunda barreira**, que limita o que um XSS consegue fazer, e não substitui sanitizar nem escapar. Os atritos mais comuns num app React: bundlers e servidores que injetam scripts e estilos inline (precisam de nonce ou de configuração específica), bibliotecas de CSS-in-JS que criam `<style>` em tempo de execução, o modo de desenvolvimento (que usa `eval` e WebSocket para recarregar e pede uma política mais frouxa) e scripts de terceiros (analytics, chat, anúncios) que carregam outros scripts. Evite `'unsafe-inline'` e `'unsafe-eval'`, que liberam justamente o que o XSS usa. Cada framework tem seu caminho para nonces; confira a documentação do seu.",
      },
    ],
    armadilhas: [
      "Habilitar `'unsafe-inline'` ou `'unsafe-eval'` para o app voltar a funcionar: a política deixa de proteger contra XSS.",
      "Ligar direto em modo de bloqueio, sem passar pelo modo somente relatório: páginas e integrações param de funcionar sem aviso.",
      "Reutilizar o mesmo nonce entre respostas ou deixá-lo fixo no código: um nonce previsível não protege.",
      "Achar que a CSP substitui sanitizar e escapar: ela limita o dano, não impede a injeção.",
    ],
    autoteste: [
      {
        pergunta: "O que é a CSP e como ela limita o dano de um XSS?",
        resposta:
          "É uma política enviada por cabeçalho HTTP que diz ao navegador de quais origens scripts, estilos, imagens e conexões são permitidos. Com ela, um script injetado pode ser bloqueado (inline sem nonce) e uma conexão para o servidor do atacante pode ser recusada.",
      },
      {
        pergunta: "Para que servem nonces e hashes, e por que existe o modo somente relatório?",
        resposta:
          "Nonces e hashes autorizam scripts inline específicos sem liberar todos (`'unsafe-inline'`): o nonce é um valor aleatório por resposta e o hash identifica o conteúdo. O modo somente relatório permite adotar a política vendo as violações antes de bloquear qualquer coisa.",
      },
    ],
  },
  en: {
    titulo: "What is Content Security Policy",
    pergunta: "What is Content Security Policy?",
    porqueEsteMetodo:
      "CSP is a rule about “who may come in”, and a guest list explains that at once. Then come the real mechanism (header, directives, nonces) and the point where the picture stops holding.",
    resposta30s:
      "**Content Security Policy** is a policy the server sends in an **HTTP header** telling the browser **which origins** scripts, styles, images and connections are allowed from. It limits the damage of an **XSS**: even if a script is injected, the browser may refuse to run it or to talk to the attacker’s server. It is **defense in depth**: it does not replace sanitizing or escaping.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Picture the guest list at the door of a party. The host (your server) hands the doorman (the browser) a list saying who may enter: scripts only from certain addresses, images only from others, connections only to certain destinations. The doorman checks everyone who arrives, and whoever is not on the list stays out, even if they make it to the door.",
        tecnico:
          "The policy travels in the `Content-Security-Policy` HTTP header, and the browser applies it to every resource on the page. Each **directive** covers a kind of resource: `script-src` (scripts), `style-src`, `img-src`, `connect-src` (`fetch` and WebSocket), `frame-ancestors`, among others, and `default-src` is the fallback for those that are missing. Values are origins (`'self'`, `https://cdn.example.com`), **nonces** (a random value, new on every response, repeated in the `nonce` attribute of the allowed tags) and **hashes** of a script’s content. With a strict policy, the browser blocks inline scripts and `eval`, which is exactly what an XSS usually relies on: even if the attacker injects a `<script>`, it does not run, and a connection to their server can be refused by `connect-src`.",
        limite:
          "The guest list does not check what a guest does inside: if an allowed origin (a CDN) is compromised, its script gets in, and `'unsafe-inline'` is like leaving the door open. CSP **limits the damage** of XSS but does not prevent it: injected HTML can still deface the page. That is why it does not replace sanitizing (see L200 and L202).",
      },
      {
        tipo: "tabela",
        titulo: "The most-used directives",
        colunas: ["Directive", "What it controls", "Example"],
        linhas: [
          ["`default-src`", "The fallback for types without their own directive", "`default-src 'self'`"],
          [
            "`script-src`",
            "Where scripts can be loaded from and whether inline scripts run",
            "`script-src 'self' 'nonce-...'`",
          ],
          ["`style-src`", "Stylesheets and inline styles", "`style-src 'self' 'nonce-...'`"],
          ["`img-src`", "Where images come from", "`img-src 'self' data: https://cdn.example.com`"],
          [
            "`connect-src`",
            "Destinations of `fetch`, XHR and WebSocket",
            "`connect-src 'self' https://api.example.com`",
          ],
          [
            "`frame-ancestors`",
            "Who may embed your page in an `iframe` (against clickjacking)",
            "`frame-ancestors 'none'`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A policy sent by the server",
        legenda: "HTTP header",
        codigo: `Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-RANDOM_VALUE_PER_RESPONSE';
  style-src 'self' 'nonce-RANDOM_VALUE_PER_RESPONSE';
  img-src 'self' data: https://cdn.example.com;
  connect-src 'self' https://api.example.com;
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none'`,
        nota: 'The nonce must be random and new on every response, and the same value goes on the allowed tags: `<script nonce="RANDOM_VALUE_PER_RESPONSE" src="/app.js"></script>`.',
      },
      {
        tipo: "fluxo",
        titulo: "How to adopt it without breaking the app",
        etapas: [
          "Start in **report-only mode** (`Content-Security-Policy-Report-Only`): the browser blocks nothing, it only reports what the policy would have stopped",
          "Collect the reports for a few days and list what really loads: your own scripts, styles, third-party services",
          "Replace inline code with files or with **nonces and hashes** and remove the use of `eval`",
          "Turn the policy on in blocking mode (`Content-Security-Policy`), keeping the reports on",
          "Monitor violations and adjust with every new library or third-party service",
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Defense in depth, and the friction",
        texto:
          "CSP is the **second barrier**, limiting what an XSS can do, and it does not replace sanitizing or escaping. The most common friction in a React app: bundlers and servers that inject inline scripts and styles (they need a nonce or specific configuration), CSS-in-JS libraries that create `<style>` at runtime, development mode (which uses `eval` and a WebSocket to reload and calls for a looser policy) and third-party scripts (analytics, chat, ads) that load other scripts. Avoid `'unsafe-inline'` and `'unsafe-eval'`, which allow exactly what XSS uses. Each framework has its own path to nonces; check the documentation for yours.",
      },
    ],
    armadilhas: [
      "Enabling `'unsafe-inline'` or `'unsafe-eval'` to make the app work again: the policy stops protecting against XSS.",
      "Going straight to blocking mode, skipping report-only: pages and integrations stop working without warning.",
      "Reusing the same nonce across responses or hard-coding it: a predictable nonce protects nothing.",
      "Thinking CSP replaces sanitizing and escaping: it limits the damage, it does not prevent the injection.",
    ],
    autoteste: [
      {
        pergunta: "What is CSP and how does it limit the damage of an XSS?",
        resposta:
          "It is a policy sent in an HTTP header that tells the browser which origins scripts, styles, images and connections are allowed from. With it, an injected script can be blocked (inline without a nonce) and a connection to the attacker’s server can be refused.",
      },
      {
        pergunta: "What are nonces and hashes for, and why does report-only mode exist?",
        resposta:
          "Nonces and hashes authorize specific inline scripts without allowing all of them (`'unsafe-inline'`): the nonce is a random value per response and the hash identifies the content. Report-only mode lets you adopt the policy by seeing violations before blocking anything.",
      },
    ],
  },
};
