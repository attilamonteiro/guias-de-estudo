import type { Pergunta } from "../../tipos";

// L88 · Permission Model
export const l088: Pergunta = {
  numero: 188,
  modulo: "linkedin-moderno",
  metodo: "threat",
  pt: {
    titulo: "Permission Model",
    pergunta: "O que é o Permission Model do Node.js?",
    porqueEsteMetodo:
      "O modelo de permissões existe para limitar o estrago de um ataque (dependência comprometida, entrada maliciosa), então só faz sentido ao lado das ameaças que mira. O método de ameaças mostra cada risco com o seu controle e deixa explícito o que o recurso não cobre.",
    resposta30s:
      "É um mecanismo do próprio Node.js que **nega por padrão** o acesso a recursos sensíveis quando você inicia o processo com **`--permission`**, e libera só o necessário: **`--allow-fs-read`** e **`--allow-fs-write`** (pastas), **`--allow-child-process`** e **`--allow-worker`**. O que for negado falha com **`ERR_ACCESS_DENIED`**. É uma camada extra contra bugs e dependências comprometidas, **não um sandbox** para código hostil: não substitui contêiner, usuário sem privilégios nem firewall (que também cobrem a rede).",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ameaça → controle",
        rotuloOrigem: "Ameaça",
        rotuloDestino: "Controle",
        pares: [
          {
            origem: "Dependência comprometida lê arquivos sensíveis (`.env`, chaves SSH, credenciais de nuvem)",
            destino:
              "**`--allow-fs-read` só nas pastas necessárias** (código e dados). O resto dá `ERR_ACCESS_DENIED`. Reduza também os segredos que o processo enxerga (veja L126): variáveis de ambiente não são protegidas por este modelo.",
          },
          {
            origem: "Escrita maliciosa ou acidental (alterar o código da aplicação, plantar arquivos, encher o disco)",
            destino:
              "**Sem `--allow-fs-write`**, o processo não escreve em lugar nenhum; conceda só uma pasta de trabalho (por exemplo `tmp` ou uploads), nunca a raiz.",
          },
          {
            origem: "Execução de comandos do sistema (`child_process`) por injeção de comando ou por dependência",
            destino:
              "**Não conceder `--allow-child-process`**: `spawn`, `exec` e `fork` são negados. Se for indispensável, saiba que um programa externo (um shell, por exemplo) não obedece ao modelo, então a concessão abre uma brecha grande.",
          },
          {
            origem: "Código inesperado executando em threads paralelas (workers)",
            destino:
              "**Sem `--allow-worker`**, criar um `Worker` é negado. Libere só se a aplicação usa `worker_threads` de verdade (veja L73).",
          },
          {
            origem: "Código nativo (addons `.node`) e WASI executando fora das regras do JavaScript",
            destino:
              "Em versões recentes ficam bloqueados sob `--permission`, com flags próprias para liberar (confira a documentação). Deixe de fora: código nativo pode escapar do modelo.",
          },
          {
            origem: "Path traversal: a entrada do usuário monta um caminho como `../../etc/passwd`",
            destino:
              "Mesmo que a validação falhe, o processo só alcança as pastas liberadas. É defesa em profundidade: continue validando e normalizando caminhos (veja T17).",
          },
          {
            origem: "Exfiltração de dados pela rede e chamadas a destinos não previstos",
            destino:
              "Tradicionalmente o modelo não cobre rede (versões recentes podem ter controles; confira a documentação). Use as camadas de fora: regras de saída no firewall ou no contêiner, proxy de saída com lista de destinos e políticas de rede no orquestrador.",
          },
          {
            origem: "Código realmente hostil, ou uma falha que escape do modelo",
            destino:
              "O isolamento de verdade vem de fora do Node.js: contêiner com usuário sem privilégios, sistema de arquivos somente leitura, limites de CPU e memória, sandbox ou VM (veja o aviso abaixo).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Ligando o modelo e vendo a negação",
        legenda: "terminal e JavaScript",
        codigo: [
          "# nega tudo por padrão e libera só o necessário",
          "node --permission --allow-fs-read=/app --allow-fs-write=/app/tmp app.js",
          "",
          "// dentro do app.js",
          'import { readFile } from "node:fs/promises";',
          "",
          "try {",
          '  await readFile("/etc/passwd"); // fora das pastas liberadas',
          "} catch (erro) {",
          "  console.log(erro.code); // ERR_ACCESS_DENIED",
          "}",
          "",
          "// com o modelo ligado, process.permission existe",
          'console.log(process.permission?.has("fs.write", "/app/tmp")); // true',
        ].join("\n"),
        nota: "O nome da flag mudou entre versões (em algumas aparecia como `--experimental-permission`) e a lista de permissões cresceu. Repita a flag para liberar várias pastas e confira nodejs.org para a sua versão.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não é um sandbox",
        texto:
          "A documentação do Node.js ressalva que o modelo protege contra acessos indevidos de código em que você confia em geral e não oferece garantias diante de código malicioso decidido a escapar. Limites conhecidos incluem seguir links simbólicos para fora das pastas liberadas, programas externos iniciados com `--allow-child-process` que não obedecem ao modelo e recursos que ele não restringe (variáveis de ambiente, consumo de CPU e memória e, em várias versões, a rede). Trate-o como uma camada a mais **dentro** do contêiner, não no lugar dele.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Como adotar sem derrubar produção",
        texto:
          "Rode primeiro em teste com `--permission` e vá liberando o que falhar com `ERR_ACCESS_DENIED` (a mensagem do erro indica o recurso negado). Libere pastas específicas, nunca `*` nem a raiz. Registre as negações nos logs e alerte: uma negação inesperada pode ser tentativa de abuso. Combine com contêiner sem privilégios e firewall de saída.",
      },
    ],
    armadilhas: [
      "Tratar o modelo como sandbox e rodar código não confiável com ele: o recurso ressalva que não protege contra código malicioso decidido a escapar.",
      "Liberar `--allow-fs-read=*` ou a raiz para “fazer funcionar”: o modelo deixa de proteger o que importava. Libere pastas específicas.",
      "Conceder `--allow-child-process` sem refletir: o programa externo executado não obedece às regras do Node.js.",
      "Presumir que ele limita a rede, as variáveis de ambiente ou o consumo de recursos, ou que flags e estado do recurso são iguais em todas as versões: confira a documentação da sua.",
    ],
    autoteste: [
      {
        pergunta: "Como fazer uma aplicação Node.js só ler a pasta `/app` e só escrever em `/app/tmp`?",
        resposta:
          "`node --permission --allow-fs-read=/app --allow-fs-write=/app/tmp app.js`; qualquer outro acesso a arquivos falha com `ERR_ACCESS_DENIED`.",
      },
      {
        pergunta: "Por que o Permission Model não substitui um contêiner?",
        resposta:
          "Porque é uma camada dentro do próprio processo Node.js, com limites conhecidos (links simbólicos, programas externos, recursos que ele não cobre), e não isolamento de verdade. Quem isola é o sistema operacional: contêiner, usuário sem privilégios, firewall.",
      },
    ],
  },
  en: {
    titulo: "Permission Model",
    pergunta: "What is the Node.js Permission Model?",
    porqueEsteMetodo:
      "The permission model exists to limit the damage of an attack (a compromised dependency, malicious input), so it only makes sense next to the threats it targets. The threat method shows each risk with its control and makes explicit what the feature does not cover.",
    resposta30s:
      "It is a Node.js mechanism that **denies by default** access to sensitive resources when you start the process with **`--permission`**, and allows only what is needed: **`--allow-fs-read`** and **`--allow-fs-write`** (folders), **`--allow-child-process`** and **`--allow-worker`**. Anything denied fails with **`ERR_ACCESS_DENIED`**. It is an extra layer against bugs and compromised dependencies, **not a sandbox** for hostile code: it does not replace a container, an unprivileged user or a firewall (which also cover the network).",
    blocos: [
      {
        tipo: "pares",
        titulo: "Threat → control",
        rotuloOrigem: "Threat",
        rotuloDestino: "Control",
        pares: [
          {
            origem: "A compromised dependency reads sensitive files (`.env`, SSH keys, cloud credentials)",
            destino:
              "**`--allow-fs-read` only on the necessary folders** (code and data). Everything else gets `ERR_ACCESS_DENIED`. Also reduce the secrets the process can see (see L126): environment variables are not protected by this model.",
          },
          {
            origem:
              "Malicious or accidental writes (altering the application’s code, planting files, filling the disk)",
            destino:
              "**No `--allow-fs-write`**, and the process writes nowhere; grant only a working folder (for example `tmp` or uploads), never the root.",
          },
          {
            origem: "Running system commands (`child_process`) through command injection or a dependency",
            destino:
              "**Do not grant `--allow-child-process`**: `spawn`, `exec` and `fork` are denied. If it is indispensable, know that an external program (a shell, for example) does not obey the model, so the grant opens a big hole.",
          },
          {
            origem: "Unexpected code running on parallel threads (workers)",
            destino:
              "**Without `--allow-worker`**, creating a `Worker` is denied. Allow it only if the application really uses `worker_threads` (see L73).",
          },
          {
            origem: "Native code (`.node` addons) and WASI running outside the JavaScript rules",
            destino:
              "In recent versions they are blocked under `--permission`, with their own flags to allow them (check the documentation). Leave them out: native code can escape the model.",
          },
          {
            origem: "Path traversal: user input builds a path like `../../etc/passwd`",
            destino:
              "Even if validation fails, the process only reaches the allowed folders. It is defense in depth: keep validating and normalizing paths (see T17).",
          },
          {
            origem: "Data exfiltration over the network and calls to unexpected destinations",
            destino:
              "Traditionally the model does not cover the network (recent versions may have controls; check the documentation). Use the outer layers: egress rules in the firewall or container, an outbound proxy with an allowlist of destinations, and network policies in the orchestrator.",
          },
          {
            origem: "Truly hostile code, or a flaw that escapes the model",
            destino:
              "Real isolation comes from outside Node.js: a container with an unprivileged user, a read-only filesystem, CPU and memory limits, a sandbox or a VM (see the warning below).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Turning the model on and seeing the denial",
        legenda: "terminal and JavaScript",
        codigo: [
          "# deny everything by default and allow only what is needed",
          "node --permission --allow-fs-read=/app --allow-fs-write=/app/tmp app.js",
          "",
          "// inside app.js",
          'import { readFile } from "node:fs/promises";',
          "",
          "try {",
          '  await readFile("/etc/passwd"); // outside the allowed folders',
          "} catch (error) {",
          "  console.log(error.code); // ERR_ACCESS_DENIED",
          "}",
          "",
          "// with the model on, process.permission exists",
          'console.log(process.permission?.has("fs.write", "/app/tmp")); // true',
        ].join("\n"),
        nota: "The flag name changed between versions (in some it appeared as `--experimental-permission`) and the list of permissions has grown. Repeat the flag to allow several folders and check nodejs.org for your version.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "It is not a sandbox",
        texto:
          "The Node.js documentation cautions that the model protects against improper access by code you generally trust and offers no guarantees against malicious code determined to escape. Known limits include following symbolic links out of the allowed folders, external programs started with `--allow-child-process` that do not obey the model, and resources it does not restrict (environment variables, CPU and memory use and, in many versions, the network). Treat it as one more layer **inside** the container, not in place of it.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "How to adopt it without breaking production",
        texto:
          "Run in a test environment with `--permission` first and allow whatever fails with `ERR_ACCESS_DENIED` (the error message names the denied resource). Allow specific folders, never `*` or the root. Log the denials and alert: an unexpected denial may be an abuse attempt. Combine it with an unprivileged container and an outbound firewall.",
      },
    ],
    armadilhas: [
      "Treating the model as a sandbox and running untrusted code with it: the feature cautions that it does not protect against malicious code determined to escape.",
      "Allowing `--allow-fs-read=*` or the root to “make it work”: the model stops protecting what mattered. Allow specific folders.",
      "Granting `--allow-child-process` without thinking: the external program that runs does not obey the Node.js rules.",
      "Assuming it limits the network, environment variables or resource use, or that flags and feature status are the same in every version: check the documentation for yours.",
    ],
    autoteste: [
      {
        pergunta: "How do you make a Node.js application read only the `/app` folder and write only to `/app/tmp`?",
        resposta:
          "`node --permission --allow-fs-read=/app --allow-fs-write=/app/tmp app.js`; any other file access fails with `ERR_ACCESS_DENIED`.",
      },
      {
        pergunta: "Why does the Permission Model not replace a container?",
        resposta:
          "Because it is a layer inside the Node.js process itself, with known limits (symbolic links, external programs, resources it does not cover), and not real isolation. The operating system does the isolating: container, unprivileged user, firewall.",
      },
    ],
  },
};
