import type { Pergunta } from "../../tipos";

// L182 · Configuração por ambiente
export const l182: Pergunta = {
  numero: 182,
  modulo: "linkedin-rotas-e-arquitetura",
  metodo: "playbook",
  pt: {
    titulo: "Configuração por ambiente",
    pergunta: "Como você lida com configuração específica de cada ambiente?",
    porqueEsteMetodo:
      "Configurar um front-end parece trivial até alguém colocar um segredo no bundle ou descobrir que trocar a variável não mudou nada. Um playbook organiza a ordem certa: classificar, entender quando o valor entra, escolher entre rebuild e execução, validar.",
    resposta30s:
      "No front-end, as variáveis de ambiente são **resolvidas no build** e gravadas no JavaScript; a ferramenta só expõe as que têm um **prefixo** (como `VITE_` ou `NEXT_PUBLIC_`), e **tudo o que vai ao navegador é público**: segredos ficam no servidor, nunca no frontend. Use arquivos por ambiente, escolha entre **rebuild por ambiente** e **o mesmo artefato com configuração em tempo de execução**, valide a configuração ao iniciar e trate feature flags como visíveis ao usuário.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: do que configurar até a validação",
        passos: [
          {
            titulo: "Classifique o que será configurado",
            texto:
              "Separe a configuração **pública** (URL da API, nome do ambiente, chave pública de analytics, feature flags) dos **segredos** (chave privada, senha, token de serviço). O que vai ao navegador é público; segredos ficam num servidor seu, ou numa camada intermediária que os usa por você.",
          },
          {
            titulo: "Entenda quando o valor entra",
            texto:
              "As ferramentas de build trocam as variáveis por texto literal **na hora do build**: o valor fica gravado no JavaScript gerado. Mudar o valor exige um novo build, a não ser que a configuração seja lida em tempo de execução.",
          },
          {
            titulo: "Respeite os prefixos",
            texto:
              "Para não vazar tudo, as ferramentas só expõem as variáveis com um prefixo (por exemplo, `VITE_` no Vite, `NEXT_PUBLIC_` no Next.js). O prefixo é um aviso: quem o tem se torna público. Em frameworks com servidor, as variáveis sem prefixo ficam restritas ao servidor.",
          },
          {
            titulo: "Use arquivos por ambiente",
            texto:
              "`.env`, `.env.development`, `.env.production` e arquivos locais fora do Git (como `.env.local`); a ordem de precedência depende da ferramenta. Versione só um `.env.example` com nomes e valores de exemplo, e nunca segredos.",
          },
          {
            titulo: "Decida: rebuild ou o mesmo artefato",
            texto:
              "**Rebuild por ambiente** é simples, mas o que foi testado em homologação não é exatamente o que vai para produção. **O mesmo artefato promovido** é buildado uma vez e recebe a configuração em tempo de execução. Escolha pelo risco que o time aceita (veja a tabela).",
          },
          {
            titulo: "Carregue a configuração em tempo de execução, se for o caso",
            texto:
              "Um `/config.json` buscado antes de montar o app, ou um `<script>` com `window.__CONFIG__` gerado quando o contêiner ou servidor inicia. Valide antes de renderizar. Sinal de acerto: trocar a URL da API não exige novo build.",
          },
          {
            titulo: "Valide, tipe e trate as flags com cuidado",
            texto:
              "Valide a configuração ao iniciar com um esquema (falhe cedo, com mensagem clara) e tipe o acesso num único módulo. Feature flags por ambiente ou por usuário podem vir de um serviço de flags; no cliente elas são visíveis, então não escondem nada sensível. Remova as flags velhas. Sinal de acerto: procurando no `dist` não há segredo.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Quando a configuração é fixada",
        colunas: ["Abordagem", "Quando o valor é fixado", "Vantagem", "Limite"],
        linhas: [
          [
            "Variáveis no build (`import.meta.env`, variáveis com prefixo)",
            "No build",
            "Simples; o compilador pode até remover código morto por ambiente",
            "Trocar um valor exige novo build, e o artefato é específico de um ambiente",
          ],
          [
            "Mesmo artefato com `config.json`",
            "Ao carregar a página",
            "Promove exatamente o que foi testado; mudar a configuração não exige build",
            "Uma requisição a mais antes de montar; é preciso servir o arquivo certo em cada ambiente e validá-lo",
          ],
          [
            "Script injetado no `index.html` (`window.__CONFIG__`)",
            "Quando o servidor ou contêiner inicia",
            "Sem requisição extra; também usa o mesmo artefato",
            "Exige um passo de geração na inicialização e cuidado com o cache do HTML",
          ],
          [
            "Framework com servidor",
            "Em tempo de execução, no servidor",
            "Variáveis sem prefixo ficam só no servidor e servem a segredos usados em código de servidor",
            "Depende do framework; o que cruza para o navegador volta a ser público",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Configuração do build, validada num único módulo",
        legenda: "TypeScript",
        codigo: [
          "// config.ts",
          'import { z } from "zod";',
          "",
          "const esquema = z.object({",
          "  VITE_API_URL: z.string().url(),",
          '  VITE_AMBIENTE: z.enum(["desenvolvimento", "homologacao", "producao"]),',
          "});",
          "",
          "// import.meta.env é resolvido no build: tudo isto acaba no JavaScript do navegador",
          "export const config = esquema.parse(import.meta.env); // falha cedo se faltar algo",
        ].join("\n"),
        nota: "Exemplo para o Vite, cujo prefixo é `VITE_`; em outras ferramentas, o objeto e o prefixo mudam. Confira a documentação da sua. Os componentes importam `config`, em vez de ler `import.meta.env` espalhado pelo código.",
      },
      {
        tipo: "codigo",
        titulo: "Configuração em tempo de execução, antes de montar o app",
        legenda: "TSX",
        codigo: [
          "// main.tsx: carrega a configuração de execução antes de montar o app",
          'import { createRoot } from "react-dom/client";',
          'import { App } from "./App";',
          "",
          'const resposta = await fetch("/config.json", { cache: "no-store" });',
          'if (!resposta.ok) throw new Error("Configuração indisponível");',
          'const config = await resposta.json(); // { "apiUrl": "https://api.homolog.exemplo.com" }',
          "",
          'createRoot(document.getElementById("root")!).render(<App config={config} />);',
        ].join("\n"),
        nota: "O `await` no topo do módulo depende da configuração do build. O `config.json` é servido por quem hospeda o app (um arquivo diferente em cada ambiente) e continua público: só valores públicos entram nele.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Tudo o que vai ao navegador é público",
        texto:
          "O bundle é baixado por qualquer pessoa, e as variáveis de build viram texto dentro dele. Prefixo, ofuscação ou “esconder” num `.env` não protegem nada. Chave privada, senha e token de serviço ficam num servidor (uma API sua ou uma camada intermediária) que os usa por você. Chaves **públicas** (de mapas ou analytics, restritas ao seu domínio no provedor) são aceitáveis. Prefixos, precedência dos arquivos e a diferença entre variáveis de build e de execução mudam entre ferramentas e versões: confira a documentação da sua.",
      },
    ],
    armadilhas: [
      "Colocar chave privada ou senha numa variável com prefixo público (`VITE_`, `NEXT_PUBLIC_`): ela é gravada no bundle e qualquer um a lê.",
      "Esperar que trocar a variável na hospedagem mude um app já buildado: o valor foi gravado no build; é preciso rebuild ou configuração em tempo de execução.",
      "Commitar um `.env` com valores reais, ou usar o mesmo arquivo para todos os ambientes: vaza segredos e aponta o ambiente errado.",
      "Espalhar `import.meta.env.X` pelos componentes sem validar: a variável que falta só aparece em produção como `undefined`; centralize e valide num módulo.",
    ],
    autoteste: [
      {
        pergunta: "Por que não se coloca um segredo numa variável de ambiente do front-end?",
        resposta:
          "Porque o valor é resolvido no build e gravado no JavaScript enviado ao navegador, e qualquer pessoa o lê no bundle ou nas ferramentas de desenvolvedor. O prefixo decide o que o build expõe; ele não protege nada.",
      },
      {
        pergunta: "Como promover o mesmo artefato da homologação para a produção?",
        resposta:
          "Fazendo o build uma vez, sem valores de ambiente dentro, e carregando a configuração em tempo de execução (um `config.json` ou um script gerado quando o servidor ou contêiner inicia), de modo que o que foi testado é exatamente o que vai ao ar.",
      },
    ],
  },
  en: {
    titulo: "Environment-specific configuration",
    pergunta: "How do you handle environment-specific configuration?",
    porqueEsteMetodo:
      "Configuring a front end looks trivial until someone puts a secret in the bundle or discovers that changing the variable changed nothing. A playbook sets the right order: classify, understand when the value gets in, choose between rebuild and runtime, validate.",
    resposta30s:
      "In the front end, environment variables are **resolved at build time** and written into the JavaScript; the tool only exposes those with a **prefix** (such as `VITE_` or `NEXT_PUBLIC_`), and **everything that goes to the browser is public**: secrets stay on the server, never in the frontend. Use per-environment files, choose between **a rebuild per environment** and **the same artifact with runtime configuration**, validate the configuration at startup and treat feature flags as visible to the user.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from what to configure to validation",
        passos: [
          {
            titulo: "Classify what will be configured",
            texto:
              "Separate **public** configuration (API URL, environment name, a public analytics key, feature flags) from **secrets** (private key, password, service token). What goes to the browser is public; secrets stay on a server of yours, or on an intermediate layer that uses them for you.",
          },
          {
            titulo: "Understand when the value gets in",
            texto:
              "Build tools replace variables with literal text **at build time**: the value is written into the generated JavaScript. Changing the value requires a new build, unless the configuration is read at runtime.",
          },
          {
            titulo: "Respect the prefixes",
            texto:
              "To avoid leaking everything, tools only expose variables with a prefix (for example, `VITE_` in Vite, `NEXT_PUBLIC_` in Next.js). The prefix is a warning: whatever carries it becomes public. In frameworks with a server, variables without the prefix stay restricted to the server.",
          },
          {
            titulo: "Use per-environment files",
            texto:
              "`.env`, `.env.development`, `.env.production` and local files kept out of Git (such as `.env.local`); the precedence order depends on the tool. Commit only a `.env.example` with names and sample values, and never secrets.",
          },
          {
            titulo: "Decide: rebuild or the same artifact",
            texto:
              "**A rebuild per environment** is simple, but what was tested in staging is not exactly what goes to production. **The same promoted artifact** is built once and receives its configuration at runtime. Choose by the risk the team accepts (see the table).",
          },
          {
            titulo: "Load runtime configuration, if that is the case",
            texto:
              "A `/config.json` fetched before mounting the app, or a `<script>` with `window.__CONFIG__` generated when the container or server starts. Validate before rendering. Sign you got it right: changing the API URL does not require a new build.",
          },
          {
            titulo: "Validate, type and treat flags with care",
            texto:
              "Validate the configuration at startup with a schema (fail early, with a clear message) and type the access in a single module. Feature flags per environment or per user can come from a flag service; on the client they are visible, so they hide nothing sensitive. Remove old flags. Sign you got it right: searching `dist` finds no secret.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "When the configuration is fixed",
        colunas: ["Approach", "When the value is fixed", "Advantage", "Limit"],
        linhas: [
          [
            "Build variables (`import.meta.env`, prefixed variables)",
            "At build time",
            "Simple; the compiler can even remove dead code per environment",
            "Changing a value requires a new build, and the artifact is specific to one environment",
          ],
          [
            "Same artifact with `config.json`",
            "When the page loads",
            "Promotes exactly what was tested; changing configuration needs no build",
            "One more request before mounting; the right file must be served in each environment and validated",
          ],
          [
            "Script injected into `index.html` (`window.__CONFIG__`)",
            "When the server or container starts",
            "No extra request; also uses the same artifact",
            "Needs a generation step at startup and care with HTML caching",
          ],
          [
            "Framework with a server",
            "At runtime, on the server",
            "Variables without the prefix stay on the server and serve secrets used in server code",
            "Depends on the framework; whatever crosses to the browser becomes public again",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Build configuration, validated in a single module",
        legenda: "TypeScript",
        codigo: [
          "// config.ts",
          'import { z } from "zod";',
          "",
          "const schema = z.object({",
          "  VITE_API_URL: z.string().url(),",
          '  VITE_ENVIRONMENT: z.enum(["development", "staging", "production"]),',
          "});",
          "",
          "// import.meta.env is resolved at build time: all of this ends up in the browser JavaScript",
          "export const config = schema.parse(import.meta.env); // fails early if something is missing",
        ].join("\n"),
        nota: "An example for Vite, whose prefix is `VITE_`; in other tools the object and the prefix change. Check the documentation of yours. Components import `config` instead of reading `import.meta.env` scattered through the code.",
      },
      {
        tipo: "codigo",
        titulo: "Runtime configuration, before mounting the app",
        legenda: "TSX",
        codigo: [
          "// main.tsx: loads the runtime configuration before mounting the app",
          'import { createRoot } from "react-dom/client";',
          'import { App } from "./App";',
          "",
          'const response = await fetch("/config.json", { cache: "no-store" });',
          'if (!response.ok) throw new Error("Configuration unavailable");',
          'const config = await response.json(); // { "apiUrl": "https://api.staging.example.com" }',
          "",
          'createRoot(document.getElementById("root")!).render(<App config={config} />);',
        ].join("\n"),
        nota: "A top-level `await` depends on the build configuration. The `config.json` is served by whoever hosts the app (a different file in each environment) and remains public: only public values go in it.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Everything that goes to the browser is public",
        texto:
          "The bundle is downloaded by anyone, and build variables become text inside it. A prefix, obfuscation or “hiding” in a `.env` protect nothing. A private key, password or service token stays on a server (an API of yours or an intermediate layer) that uses it for you. **Public** keys (for maps or analytics, restricted to your domain at the provider) are acceptable. Prefixes, file precedence and the difference between build and runtime variables change across tools and versions: check the documentation of yours.",
      },
    ],
    armadilhas: [
      "Putting a private key or password in a variable with a public prefix (`VITE_`, `NEXT_PUBLIC_`): it is written into the bundle and anyone can read it.",
      "Expecting a change to the variable on the hosting to alter an already built app: the value was written at build time; you need a rebuild or runtime configuration.",
      "Committing a `.env` with real values, or using the same file for every environment: it leaks secrets and points at the wrong environment.",
      "Scattering `import.meta.env.X` through components without validating: a missing variable only shows up in production as `undefined`; centralize and validate in one module.",
    ],
    autoteste: [
      {
        pergunta: "Why don’t you put a secret in a front-end environment variable?",
        resposta:
          "Because the value is resolved at build time and written into the JavaScript sent to the browser, and anyone can read it in the bundle or in developer tools. The prefix decides what the build exposes; it protects nothing.",
      },
      {
        pergunta: "How do you promote the same artifact from staging to production?",
        resposta:
          "Build once, with no environment values inside, and load the configuration at runtime (a `config.json` or a script generated when the server or container starts), so what was tested is exactly what goes live.",
      },
    ],
  },
};
