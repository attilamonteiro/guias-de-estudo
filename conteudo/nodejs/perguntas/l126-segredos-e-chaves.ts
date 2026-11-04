import type { Pergunta } from "../../tipos";

// L126 · Segredos e chaves de API
export const l126: Pergunta = {
  numero: 226,
  modulo: "linkedin-seguranca",
  metodo: "playbook",
  pt: {
    titulo: "Segredos e chaves de API",
    pergunta: "Como gerenciar segredos e chaves de API?",
    porqueEsteMetodo:
      "Gerenciar segredos é um procedimento com ordem e critério de pronto, e o pior momento para improvisar é o do vazamento. Um playbook cobre o ciclo inteiro: inventariar, guardar, injetar, limitar, rotacionar, detectar e reagir.",
    resposta30s:
      "Segredo é qualquer valor que dá acesso (senha de banco, chave de API, token, chave privada). Mantenha-os **fora do repositório e do código**, entregues ao processo na execução por **variáveis de ambiente ou um secret manager**, com **escopo mínimo** e **rotação** planejada, e use um **scanner de segredos** para barrar commits perigosos. Se algum vazar, **revogue e troque primeiro**: apagar o commit não desfaz o vazamento.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: do inventário ao vazamento",
        passos: [
          {
            titulo: "Inventarie os segredos",
            texto:
              "Liste senhas de banco, chaves de API, tokens, segredos de JWT e de sessão, chaves privadas e segredos de webhook: quem usa cada um, onde vive e o que acontece se vazar. Critério: nenhum segredo sem dono e sem plano de troca.",
          },
          {
            titulo: "Tire do código e do Git",
            texto:
              "`.env` no `.gitignore`, um `.env.example` só com os nomes e nada de segredo no Dockerfile (`ENV` e `ARG` ficam nas camadas da imagem), nos testes ou no front-end: tudo o que vai para o bundle do navegador é público. Sinal de acerto: o repositório inteiro poderia ser aberto ao público sem consequência.",
          },
          {
            titulo: "Injete na execução, não na construção",
            texto:
              "A plataforma entrega o valor ao processo (variável de ambiente, arquivo montado ou consulta a um secret manager na partida). Em nuvem, prefira a identidade atribuída ao serviço (por exemplo, um papel de IAM) a mais uma chave de longa duração. Valide a presença na partida e falhe rápido (veja L20).",
          },
          {
            titulo: "Dê o mínimo de escopo",
            texto:
              "Uma chave por serviço e por ambiente, só com as permissões necessárias (somente leitura quando basta; restrita por IP, domínio ou recurso, se o provedor permitir). Critério: vazar a chave de desenvolvimento nunca dá acesso à produção.",
          },
          {
            titulo: "Planeje a rotação",
            texto:
              "Defina prazos, automatize quando possível e prefira credenciais de vida curta. Aceite duas chaves válidas ao mesmo tempo durante a troca, para não derrubar o serviço. Sinal de acerto: trocar uma chave é rotina, não um evento.",
          },
          {
            titulo: "Detecte vazamentos",
            texto:
              "Scanner de segredos no pre-commit e no CI (por exemplo gitleaks ou TruffleHog, ou a proteção de push do provedor do Git). Nos logs, nunca imprima `process.env` inteiro, o cabeçalho `Authorization` nem URLs com token; redija esses campos no logger.",
          },
          {
            titulo: "Tenha o plano de vazamento",
            texto:
              "**Revogue e troque primeiro**, só depois investigue: veja os logs de uso da chave no provedor para saber o que foi acessado e então limpe o histórico do Git (por exemplo com `git filter-repo`) e avise quem precisar. Clones, forks, caches de CI e logs já podem ter o segredo.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Onde guardar e entregar",
        colunas: ["Opção", "Serve para", "Cuidado"],
        linhas: [
          [
            "Variável de ambiente injetada pela plataforma",
            "Configuração e segredos de risco baixo ou médio",
            "Processos filhos a herdam e ela aparece em inspeção do contêiner e em dumps de erro",
          ],
          [
            "Arquivo `.env` local, fora do Git",
            "Desenvolvimento na sua máquina",
            "Nunca em produção nem no repositório; valores de teste, não os reais",
          ],
          [
            "Secret manager (Vault ou serviços de nuvem)",
            "Produção: acesso por identidade, auditoria, versões e rotação",
            "Mais uma dependência: trate falha de leitura na partida e o cache do valor",
          ],
          [
            "Segredo montado como arquivo pelo orquestrador",
            "Contêineres sem expor o valor em variável de ambiente",
            "Permissões do arquivo e recarga quando houver rotação",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de ouro",
        texto:
          "Trate todo segredo como **temporário e substituível**: fora do código, injetado na execução, com escopo mínimo, rotacionável sem parada e com um plano de revogação já ensaiado. Segredo exposto é segredo comprometido, mesmo que ninguém o tenha usado ainda.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Variável de ambiente não é um cofre",
        texto:
          "Ela é um meio de entrega: é herdada por `child_process`, aparece em `docker inspect` e em relatórios de falha, e ferramentas de diagnóstico a mostram. Para o que for mais crítico, prefira um secret manager ou um arquivo montado com permissão restrita. E `NEXT_PUBLIC_`, `VITE_` e prefixos parecidos exportam o valor para o navegador de propósito: nunca coloque um segredo ali.",
      },
    ],
    armadilhas: [
      "Colocar o segredo no código “só por enquanto”, no Dockerfile ou na imagem: ele fica no histórico do Git ou nas camadas e ninguém lembra de tirar.",
      "Usar uma chave única, com poder total, para todos os serviços e ambientes, e nunca trocá-la.",
      "Achar que apagar o commit resolve: o histórico, os clones e os logs de CI continuam com o valor; o que resolve é revogar.",
      "Registrar segredos sem querer: `console.log(process.env)`, cabeçalho `Authorization`, token em query string e mensagens de erro que ecoam a configuração.",
    ],
    autoteste: [
      {
        pergunta: "Commitei uma chave por engano e já a apaguei no commit seguinte. Está resolvido?",
        resposta:
          "Não. O histórico, os clones, os forks e os caches de CI ainda a têm. Revogue e troque a chave primeiro, confira nos logs do provedor se ela foi usada e só então limpe o histórico.",
      },
      {
        pergunta: "Por que um secret manager costuma ser melhor que um `.env` em produção?",
        resposta:
          "Ele dá acesso por identidade e permissão, auditoria de quem leu, versionamento e rotação, e evita um arquivo de segredos copiado de máquina em máquina. O `.env` fica restrito ao desenvolvimento local.",
      },
    ],
  },
  en: {
    titulo: "Secrets and API keys",
    pergunta: "How do you manage secrets and API keys?",
    porqueEsteMetodo:
      "Managing secrets is a procedure with an order and a definition of done, and the worst moment to improvise is during a leak. A playbook covers the whole lifecycle: inventory, store, inject, limit, rotate, detect and respond.",
    resposta30s:
      "A secret is any value that grants access (a database password, an API key, a token, a private key). Keep them **out of the repository and the code**, handed to the process at runtime through **environment variables or a secret manager**, with **least-privilege scope** and planned **rotation**, and use a **secret scanner** to block risky commits. If one leaks, **revoke and replace it first**: deleting the commit does not undo the leak.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from inventory to leak",
        passos: [
          {
            titulo: "Inventory the secrets",
            texto:
              "List database passwords, API keys, tokens, JWT and session secrets, private keys and webhook secrets: who uses each, where it lives and what happens if it leaks. Criterion: no secret without an owner and a replacement plan.",
          },
          {
            titulo: "Get them out of code and Git",
            texto:
              "`.env` in `.gitignore`, a `.env.example` with names only, and no secret in the Dockerfile (`ENV` and `ARG` stay in the image layers), in tests or in the front end: everything that ships in the browser bundle is public. A sign of success: the whole repository could be made public with no consequence.",
          },
          {
            titulo: "Inject at runtime, not at build time",
            texto:
              "The platform hands the value to the process (an environment variable, a mounted file or a secret-manager lookup at startup). In the cloud, prefer the identity assigned to the service (for example an IAM role) over yet another long-lived key. Validate presence at startup and fail fast (see L20).",
          },
          {
            titulo: "Give it the least scope",
            texto:
              "One key per service and per environment, with only the permissions needed (read-only when that is enough; restricted by IP, domain or resource if the provider allows). Criterion: leaking the development key never grants access to production.",
          },
          {
            titulo: "Plan the rotation",
            texto:
              "Set deadlines, automate where possible and prefer short-lived credentials. Accept two valid keys at once during the swap so the service does not go down. A sign of success: replacing a key is routine, not an event.",
          },
          {
            titulo: "Detect leaks",
            texto:
              "A secret scanner in pre-commit and in CI (for example gitleaks or TruffleHog, or your Git host’s push protection). In logs, never print the whole `process.env`, the `Authorization` header or URLs carrying a token; redact those fields in the logger.",
          },
          {
            titulo: "Have the leak plan ready",
            texto:
              "**Revoke and replace first**, investigate after: check the key’s usage logs at the provider to see what was accessed, then clean the Git history (for example with `git filter-repo`) and notify whoever needs to know. Clones, forks, CI caches and logs may already hold the secret.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Where to store and deliver",
        colunas: ["Option", "Good for", "Watch out for"],
        linhas: [
          [
            "Environment variable injected by the platform",
            "Configuration and low- or medium-risk secrets",
            "Child processes inherit it, and it shows up in container inspection and crash dumps",
          ],
          [
            "Local `.env` file, kept out of Git",
            "Development on your own machine",
            "Never in production or in the repository; test values, not real ones",
          ],
          [
            "Secret manager (Vault or cloud services)",
            "Production: identity-based access, auditing, versions and rotation",
            "One more dependency: handle read failures at startup and how the value is cached",
          ],
          [
            "Secret mounted as a file by the orchestrator",
            "Containers, without exposing the value as an environment variable",
            "File permissions and reloading when the secret rotates",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Golden rule",
        texto:
          "Treat every secret as **temporary and replaceable**: out of the code, injected at runtime, least-privilege, rotatable without downtime and backed by a revocation plan you have already rehearsed. An exposed secret is a compromised secret, even if nobody has used it yet.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "An environment variable is not a vault",
        texto:
          "It is a delivery mechanism: `child_process` inherits it, it appears in `docker inspect` and in crash reports, and diagnostic tools can show it. For the most critical values, prefer a secret manager or a mounted file with restricted permissions. And `NEXT_PUBLIC_`, `VITE_` and similar prefixes export the value to the browser on purpose: never put a secret there.",
      },
    ],
    armadilhas: [
      "Putting the secret in the code “just for now”, in the Dockerfile or in the image: it stays in Git history or in the layers and nobody remembers to remove it.",
      "Using one all-powerful key for every service and environment, and never changing it.",
      "Believing that deleting the commit fixes it: the history, the clones and the CI logs still hold the value; what fixes it is revoking.",
      "Logging secrets by accident: `console.log(process.env)`, the `Authorization` header, tokens in query strings and error messages that echo the configuration.",
    ],
    autoteste: [
      {
        pergunta: "I committed a key by mistake and deleted it in the next commit. Is it solved?",
        resposta:
          "No. The history, clones, forks and CI caches still have it. Revoke and replace the key first, check the provider’s logs to see whether it was used, and only then clean the history.",
      },
      {
        pergunta: "Why is a secret manager usually better than a `.env` file in production?",
        resposta:
          "It offers identity-based access and permissions, an audit trail of who read what, versioning and rotation, and it avoids a secrets file copied from machine to machine. The `.env` stays limited to local development.",
      },
    ],
  },
};
