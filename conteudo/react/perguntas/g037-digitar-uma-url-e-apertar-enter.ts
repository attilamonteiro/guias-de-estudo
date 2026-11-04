import type { Pergunta } from "../../tipos";

// G37 · Digitar uma URL e apertar Enter
export const g037: Pergunta = {
  numero: 337,
  modulo: "glassdoor-javascript",
  metodo: "trace",
  pt: {
    titulo: "Digitar uma URL e apertar Enter",
    pergunta: "O que acontece quando você digita uma URL no navegador e pressiona Enter?",
    porqueEsteMetodo:
      "A pergunta pede uma sequência com ordem e causa: cada etapa só faz sentido depois da anterior. Seguir uma única requisição do Enter até a tela, incluindo o ponto em que o cache ou o React mudam o caminho, é a melhor forma de responder.",
    resposta30s:
      "O navegador interpreta a URL, procura a resposta em cache, resolve o nome por **DNS**, abre uma conexão **TCP** e **TLS** com o servidor (ou a **CDN**) e envia um `GET` **HTTP**, recebendo o HTML. Em seguida transforma o HTML em **DOM** e o CSS em **CSSOM**, baixa e executa os scripts, calcula o **layout** e **pinta** a página. Numa aplicação React com renderização no cliente, o HTML quase vazio carrega o bundle de JavaScript, que monta a interface; com renderização no servidor, o HTML já vem com conteúdo e o React o **hidrata**.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Do Enter ao primeiro byte",
        etapas: [
          "**URL e cache**: o navegador separa esquema, host e caminho (ou trata o texto como uma busca) e confere se já tem a resposta guardada; se ela ainda é fresca, nem sai para a rede. Um site conhecido por exigir HTTPS (HSTS) é acessado direto por HTTPS",
          "**DNS**: o nome (`exemplo.com`) vira um endereço IP, consultando caches (navegador, sistema operacional, provedor) e, se preciso, os servidores DNS",
          "**TCP**: o navegador abre a conexão com o servidor, ou com a CDN mais próxima; o HTTP/3 usa outro transporte (QUIC, sobre UDP) com o mesmo objetivo",
          "**TLS**: no HTTPS, as duas pontas negociam a criptografia e o navegador valida o certificado do site",
          "**Requisição HTTP**: `GET /caminho` com cabeçalhos (host, cookies, formatos aceitos, validadores de cache)",
          "**Resposta**: status (200; 304 se o cache ainda vale; 301 ou 302 para redirecionar, o que recomeça o processo), cabeçalhos como `Cache-Control` e `Content-Type`, e o corpo, quase sempre HTML",
          "O navegador começa a processar o HTML **enquanto ele ainda está chegando** (passos a seguir)",
        ],
        nota: "Conexões já abertas são reaproveitadas, e o HTTP/2 e o HTTP/3 enviam várias requisições na mesma conexão; por isso, nas visitas seguintes, boa parte dessas etapas é pulada.",
      },
      {
        tipo: "passos",
        titulo: "Da resposta à tela",
        passos: [
          {
            titulo: "HTML vira DOM",
            texto:
              "O parser lê o HTML aos poucos e monta a árvore do **DOM**. Ao achar um `<link>` de CSS, um `<script>` ou uma imagem, dispara o download sem esperar o fim do arquivo.",
          },
          {
            titulo: "CSS vira CSSOM",
            texto:
              "As folhas de estilo formam o **CSSOM**. O CSS **bloqueia a renderização** (o navegador não pinta sem conhecer os estilos), e um `<script>` comum, sem `defer` ou `async`, **bloqueia o parser** enquanto é baixado e executado.",
          },
          {
            titulo: "JavaScript",
            texto:
              "Os scripts são baixados, compilados e executados; eles podem ler e alterar o DOM e o CSSOM e disparar novas requisições (`fetch`, imports).",
          },
          {
            titulo: "Layout, pintura e composição",
            texto:
              "Com DOM e estilos, o navegador monta a árvore de renderização, calcula tamanho e posição de cada caixa (**layout**), desenha os pixels (**pintura**) e junta as camadas na tela (**composição**). Mudanças posteriores repetem só o necessário.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "O caminho de uma aplicação React",
        colunas: ["Modelo", "O que chega primeiro", "O que o JavaScript faz", "O que o usuário vê"],
        linhas: [
          [
            "Renderização no cliente (SPA)",
            "HTML quase vazio, com um `<div id=root>` e a tag do script",
            "Baixa o bundle, executa, e o React monta a interface no DOM (`createRoot(...).render(...)`); depois busca os dados",
            "Página em branco ou esqueleto até chegarem o JavaScript e os dados",
          ],
          [
            "Renderização no servidor ou geração estática (com um framework)",
            "HTML já com o conteúdo",
            "A **hidratação** (`hydrateRoot`) anexa eventos e estado ao HTML existente, sem recriá-lo",
            "O conteúdo aparece cedo; a interatividade chega depois da hidratação",
          ],
          [
            "Server Components (em frameworks que os suportam)",
            "HTML mais uma descrição serializada dos componentes de servidor",
            "Só os componentes de cliente são hidratados; o resto não vira JavaScript no navegador",
            "Menos JavaScript baixado e executado",
          ],
        ],
        nota: "Os detalhes variam por framework e por versão; confira a documentação (react.dev e a do seu framework).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que acelera cada etapa",
        texto:
          "O **cache** evita a viagem inteira; a **CDN** aproxima o conteúdo do usuário (menos latência) e também guarda respostas; **HTTP/2 e HTTP/3** multiplexam várias requisições numa conexão e comprimem cabeçalhos; a **compressão** (gzip, Brotli) e **bundles menores** (code splitting, `lazy`) reduzem os bytes; `defer`, `async` e `preload` tiram scripts e recursos do caminho crítico; **SSR/SSG** antecipam o conteúdo. A pergunta não pede protocolo em minúcias: diga a ordem e em que ponto cada ganho entra.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não é uma fila rígida",
        texto:
          "As etapas se sobrepõem e podem ser puladas: o parser baixa recursos enquanto lê, o cache e as conexões reaproveitadas eliminam DNS, TCP e TLS, e um redirecionamento recomeça tudo com outra URL. Responda na ordem lógica, mas diga que o navegador trabalha em paralelo sempre que pode.",
      },
    ],
    armadilhas: [
      "Contar o fluxo como uma fila estrita: DNS, conexão e HTTP podem ser pulados por cache ou por conexão reaproveitada, e o parser baixa recursos enquanto ainda lê o HTML.",
      "Esquecer que CSS e `<script>` sem `defer` ou `async` bloqueiam: eles atrasam a primeira pintura.",
      "Misturar os modelos de renderização: numa SPA padrão, quem monta a interface é o JavaScript no navegador; com SSR o HTML já vem pronto e o React só hidrata.",
      "Achar que o DNS devolve a página: ele só traduz nome em endereço; quem entrega o conteúdo é o servidor (ou a CDN) por HTTP.",
    ],
    autoteste: [
      {
        pergunta: "O que é hidratação e por que ela existe?",
        resposta:
          "É o React anexando eventos e estado a um HTML que já veio pronto do servidor, em vez de recriar o DOM. Existe para o usuário ver o conteúdo cedo e ainda ter uma interface interativa; o HTML do servidor e a primeira renderização no cliente precisam coincidir.",
      },
      {
        pergunta: "Por que um `<script>` sem `defer` no `<head>` atrasa a página?",
        resposta:
          "O parser para de construir o DOM enquanto o script é baixado e executado, e a primeira pintura é adiada. O `defer` baixa em paralelo e executa depois do parsing; o `async` executa assim que termina de baixar. Scripts de módulo (`type=module`) se comportam como `defer`.",
      },
    ],
  },
  en: {
    titulo: "Typing a URL and pressing Enter",
    pergunta: "What happens when you type a URL in the browser and press Enter?",
    porqueEsteMetodo:
      "The question asks for a sequence with order and cause: each step only makes sense after the previous one. Following a single request from Enter to the screen, including the points where the cache or React change the path, is the best way to answer.",
    resposta30s:
      "The browser parses the URL, looks for the response in its cache, resolves the name through **DNS**, opens a **TCP** and **TLS** connection to the server (or the **CDN**) and sends an **HTTP** `GET`, receiving the HTML. It then turns the HTML into the **DOM** and the CSS into the **CSSOM**, downloads and runs the scripts, computes the **layout** and **paints** the page. In a client-rendered React app, the near-empty HTML loads the JavaScript bundle, which builds the interface; with server rendering, the HTML already contains content and React **hydrates** it.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "From Enter to the first byte",
        etapas: [
          "**URL and cache**: the browser splits scheme, host and path (or treats the text as a search) and checks whether it already has the response stored; if it is still fresh, it does not even go to the network. A site known to require HTTPS (HSTS) is reached directly over HTTPS",
          "**DNS**: the name (`example.com`) becomes an IP address, consulting caches (browser, operating system, provider) and, if needed, the DNS servers",
          "**TCP**: the browser opens the connection to the server, or to the nearest CDN; HTTP/3 uses a different transport (QUIC, over UDP) for the same purpose",
          "**TLS**: with HTTPS, both ends negotiate encryption and the browser validates the site’s certificate",
          "**HTTP request**: `GET /path` with headers (host, cookies, accepted formats, cache validators)",
          "**Response**: status (200; 304 if the cache is still valid; 301 or 302 to redirect, which restarts the process), headers such as `Cache-Control` and `Content-Type`, and the body, almost always HTML",
          "The browser starts processing the HTML **while it is still arriving** (steps below)",
        ],
        nota: "Open connections are reused, and HTTP/2 and HTTP/3 send several requests over the same connection; that is why, on later visits, many of these steps are skipped.",
      },
      {
        tipo: "passos",
        titulo: "From response to screen",
        passos: [
          {
            titulo: "HTML becomes the DOM",
            texto:
              "The parser reads the HTML bit by bit and builds the **DOM** tree. When it finds a CSS `<link>`, a `<script>` or an image, it starts the download without waiting for the end of the file.",
          },
          {
            titulo: "CSS becomes the CSSOM",
            texto:
              "Stylesheets form the **CSSOM**. CSS is **render-blocking** (the browser does not paint without knowing the styles), and a plain `<script>`, without `defer` or `async`, **blocks the parser** while it is downloaded and run.",
          },
          {
            titulo: "JavaScript",
            texto:
              "Scripts are downloaded, compiled and run; they can read and change the DOM and the CSSOM and trigger new requests (`fetch`, imports).",
          },
          {
            titulo: "Layout, paint and compositing",
            texto:
              "With the DOM and styles, the browser builds the render tree, computes the size and position of every box (**layout**), draws the pixels (**paint**) and merges the layers on screen (**compositing**). Later changes repeat only what is needed.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "The path of a React application",
        colunas: ["Model", "What arrives first", "What JavaScript does", "What the user sees"],
        linhas: [
          [
            "Client-side rendering (SPA)",
            "Near-empty HTML, with a `<div id=root>` and the script tag",
            "Downloads the bundle, runs it, and React builds the interface in the DOM (`createRoot(...).render(...)`); then it fetches data",
            "A blank page or skeleton until the JavaScript and the data arrive",
          ],
          [
            "Server rendering or static generation (with a framework)",
            "HTML that already has the content",
            "**Hydration** (`hydrateRoot`) attaches events and state to the existing HTML, without recreating it",
            "Content appears early; interactivity arrives after hydration",
          ],
          [
            "Server Components (in frameworks that support them)",
            "HTML plus a serialized description of the server components",
            "Only client components are hydrated; the rest never becomes JavaScript in the browser",
            "Less JavaScript downloaded and run",
          ],
        ],
        nota: "Details vary by framework and by version; check the documentation (react.dev and your framework’s).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What speeds up each step",
        texto:
          "The **cache** avoids the whole trip; the **CDN** brings content closer to the user (less latency) and also stores responses; **HTTP/2 and HTTP/3** multiplex several requests over one connection and compress headers; **compression** (gzip, Brotli) and **smaller bundles** (code splitting, `lazy`) cut bytes; `defer`, `async` and `preload` take scripts and resources off the critical path; **SSR/SSG** bring the content forward. The question does not ask for protocol minutiae: give the order and the point where each gain comes in.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "It is not a rigid queue",
        texto:
          "The steps overlap and can be skipped: the parser downloads resources while it reads, caching and reused connections eliminate DNS, TCP and TLS, and a redirect restarts everything with another URL. Answer in logical order, but say that the browser works in parallel whenever it can.",
      },
    ],
    armadilhas: [
      "Describing the flow as a strict queue: DNS, connection and HTTP can be skipped by cache or by a reused connection, and the parser downloads resources while it is still reading the HTML.",
      "Forgetting that CSS and a `<script>` without `defer` or `async` block: they delay the first paint.",
      "Mixing up the rendering models: in a standard SPA, JavaScript in the browser builds the interface; with SSR the HTML arrives ready and React only hydrates.",
      "Thinking DNS returns the page: it only translates a name into an address; the server (or the CDN) delivers the content over HTTP.",
    ],
    autoteste: [
      {
        pergunta: "What is hydration and why does it exist?",
        resposta:
          "It is React attaching events and state to HTML that already arrived ready from the server, instead of recreating the DOM. It exists so the user sees content early and still gets an interactive interface; the server’s HTML and the first client render must match.",
      },
      {
        pergunta: "Why does a `<script>` without `defer` in the `<head>` slow the page down?",
        resposta:
          "The parser stops building the DOM while the script is downloaded and run, and the first paint is postponed. `defer` downloads in parallel and runs after parsing; `async` runs as soon as the download finishes. Module scripts (`type=module`) behave like `defer`.",
      },
    ],
  },
};
