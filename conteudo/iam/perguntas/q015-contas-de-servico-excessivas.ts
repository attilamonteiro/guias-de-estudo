import type { Pergunta } from "../../tipos";

// Q15 · Contas de serviço excessivas
export const q015: Pergunta = {
  numero: 15,
  modulo: "fundamentos",
  metodo: "playbook",
  pt: {
    titulo: "Contas de serviço excessivas",
    pergunta:
      "Você descobre uma conta de serviço com permissão de administrador usada por várias aplicações. Como investiga, reduz o risco e evita que isso volte a acontecer?",
    porqueEsteMetodo:
      "O risco aqui é duplo: deixar o problema como está, ou consertá-lo mal e derrubar produção. Um playbook com sinal de sucesso e caminho de volta em cada passo é o que permite reduzir o poder da conta sem apostar.",
    resposta30s:
      "Primeiro **contenha e meça**: procure sinais de abuso, **inventarie quem usa a conta** e veja nos logs o que cada aplicação realmente faz. Depois **separe uma identidade por aplicação** (de preferência gerenciada, sem segredo), **reduza as permissões ao observado**, migre um consumidor por vez com **plano de reversão** e só então desabilite e **rotacione** a conta antiga. Para não voltar, bloqueie administrador em conta de serviço por política, exija um dono e alerte uso fora do padrão.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: da conta administradora compartilhada ao menor privilégio",
        passos: [
          {
            titulo: "1. Avalie o risco agora e preserve a evidência",
            texto:
              "Antes de mexer, procure uso suspeito: logins de origens novas, ações fora do padrão, criação de credenciais ou de papéis. Garanta que os logs de auditoria estão ligados e retidos. Se houver sinal de abuso, é incidente: contenha e rotacione já. Sinal: estado atual registrado e logs preservados.",
          },
          {
            titulo: "2. Inventarie donos e consumidores",
            texto:
              "Descubra quem usa a conta: procure a credencial em repositórios, pipelines, cofres, variáveis de ambiente e configurações; veja nos logs de autenticação as origens (IP, host, agente) e o que cada uma chama; atribua um dono a cada uso. Sinal: tabela de conta, aplicação, ambiente e dono, sem linhas “desconhecido”.",
          },
          {
            titulo: "3. Meça o uso real",
            texto:
              "Numa janela longa o bastante para cobrir tarefas raras (fechamento mensal, rotinas de recuperação), agrupe por aplicação as ações registradas. As ferramentas de análise de acesso do fornecedor, que mostram o último uso de cada permissão, ajudam. Sinal: lista das permissões efetivamente usadas por aplicação.",
          },
          {
            titulo: "4. Crie uma identidade por aplicação",
            texto:
              "Uma conta nova por aplicação e por ambiente, de preferência uma identidade gerenciada ou federada, sem segredo (veja Q14 e Q16), cada uma com dono e descrição. A conta antiga segue funcionando. Sinal: identidades criadas e testadas com permissão mínima inicial.",
          },
          {
            titulo: "5. Reduza ao que foi observado",
            texto:
              "Conceda a cada identidade nova só as permissões vistas no passo 3, no menor escopo de recurso possível, mais as raras que o dono justificar. Se a plataforma simula políticas ou oferece um modo que só registra, use-o antes. Sinal: simulação sem negações inesperadas.",
          },
          {
            titulo: "6. Migre aos poucos, com reversão",
            texto:
              "Uma aplicação por vez, começando pelas de menor risco: homologação, depois produção em janela combinada. Mantenha a conta antiga habilitada, mas sem uso novo, e acompanhe erros de autorização (403, acesso negado). Reversão: voltar a configuração da aplicação para a credencial antiga. Sinal: nenhum aumento de erros durante o período combinado.",
          },
          {
            titulo: "7. Aposente, rotacione e impeça a volta",
            texto:
              "Quando o log mostrar que a conta antiga não é mais usada, desabilite, espere e só então remova; rotacione qualquer segredo que tenha sido exposto. Para não repetir: proíba papéis de administrador em contas de serviço por política, exija dono e descrição na criação, alerte uso fora do padrão (origem nova, horário, ação privilegiada) e revise as contas de serviço periodicamente. Sinal: alerta testado e política bloqueando um caso de teste.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Sem adivinhar: onde está a evidência",
        colunas: ["Pergunta", "Onde está a evidência", "O que você descobre"],
        linhas: [
          [
            "Como o papel de administrador chegou à conta?",
            "Log de auditoria de atribuição de papéis e histórico do código de infraestrutura",
            "Quem concedeu, quando e em nome de qual pedido; se foi manual ou pelo código",
          ],
          [
            "O papel é direto ou herdado?",
            "Atribuições por escopo (grupo de recursos, assinatura, organização) e participação em grupos",
            "As permissões efetivas e de onde vêm; remover só o papel direto pode não bastar",
          ],
          [
            "Quem usa a conta?",
            "Logs de autenticação: origem, host, agente, aplicação, token",
            "Os consumidores reais, inclusive pessoas que usam a conta de serviço",
          ],
          [
            "O que ela faz de fato?",
            "Logs de auditoria por ação e último uso de cada permissão",
            "O conjunto mínimo necessário, aplicação por aplicação",
          ],
          [
            "Quem consegue obter a credencial?",
            "Onde o segredo está guardado e quem lê o cofre, o repositório e o pipeline",
            "A superfície de exposição e quem pode gerar novas credenciais",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Como reduzir sem derrubar produção",
        texto:
          "**Observe antes de cortar, crie em paralelo antes de substituir, migre um consumidor por vez e desabilite antes de remover.** Cada passo tem um sinal de sucesso e uma volta: se o sinal não aparece, você desfaz aquele passo, não o projeto inteiro.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O log só mostra a janela observada",
        texto:
          "Tarefas anuais, rotinas de recuperação de desastre e caminhos de erro podem não aparecer; logs de acesso a dados às vezes nem estão ligados; a retenção pode ser curta. Por isso a janela é longa, o dono de cada aplicação valida a lista e a reversão fica pronta. E lembre que uma conta administradora pode conceder permissões a si mesma ou criar credenciais: trate-a como possivelmente comprometida até provar o contrário e verifique o que ela criou.",
      },
    ],
    armadilhas: [
      "Revogar o papel de administrador de uma vez, sem medir o uso: uma das aplicações para e o incidente passa a ser seu.",
      "Reduzir permissões pela documentação ou pelo palpite do dono, em vez de usar o que os logs mostram.",
      "Criar contas novas e deixar a antiga ativa, com o segredo ainda conhecido: o risco continua.",
      "Corrigir o caso e não a causa: sem política que impeça administrador em conta de serviço e sem dono obrigatório, a situação volta.",
    ],
    autoteste: [
      {
        pergunta: "Por que separar uma conta por aplicação antes de reduzir permissões?",
        resposta:
          "Enquanto várias aplicações dividem a conta, não dá para saber o que cada uma precisa nem reduzir sem o risco de quebrar outra. Contas separadas permitem medir, restringir e auditar cada uma.",
      },
      {
        pergunta: "Como reduzir permissões sem derrubar produção?",
        resposta:
          "Medindo o uso real nos logs, criando as identidades novas em paralelo com as permissões observadas, migrando uma aplicação por vez com plano de reversão e só desabilitando a conta antiga depois de um período sem uso.",
      },
    ],
  },
  en: {
    titulo: "Over-privileged service accounts",
    pergunta:
      "You discover a service account with admin permissions used by several applications. How do you investigate, reduce the risk and prevent it from happening again?",
    porqueEsteMetodo:
      "The risk here is double: leaving the problem as it is, or fixing it badly and taking production down. A playbook with a success signal and a way back at every step is what lets you reduce the account’s power without gambling.",
    resposta30s:
      "First **contain and measure**: look for signs of abuse, **inventory who uses the account** and see in the logs what each application really does. Then **split out one identity per application** (preferably managed, with no secret), **reduce permissions to what was observed**, migrate one consumer at a time with a **rollback plan**, and only then disable and **rotate** the old account. To keep it from coming back, block admin roles on service accounts by policy, require an owner and alert on out-of-pattern use.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from a shared admin account to least privilege",
        passos: [
          {
            titulo: "1. Assess the risk now and preserve evidence",
            texto:
              "Before touching anything, look for suspicious use: sign-ins from new origins, out-of-pattern actions, creation of credentials or roles. Make sure audit logs are on and retained. If there are signs of abuse, it is an incident: contain and rotate now. Signal: current state recorded and logs preserved.",
          },
          {
            titulo: "2. Inventory owners and consumers",
            texto:
              "Find out who uses the account: search for the credential in repositories, pipelines, vaults, environment variables and configuration; see the origins in the authentication logs (IP, host, agent) and what each one calls; assign an owner to each use. Signal: a table of account, application, environment and owner, with no “unknown” rows.",
          },
          {
            titulo: "3. Measure real use",
            texto:
              "Over a window long enough to cover rare tasks (monthly close, recovery routines), group the recorded actions by application. The vendor’s access analysis tools, which show the last use of each permission, help. Signal: a list of permissions actually used per application.",
          },
          {
            titulo: "4. Create one identity per application",
            texto:
              "A new account per application and per environment, preferably a managed or federated identity with no secret (see Q14 and Q16), each with an owner and a description. The old account keeps working. Signal: identities created and tested with minimal initial permissions.",
          },
          {
            titulo: "5. Reduce to what was observed",
            texto:
              "Grant each new identity only the permissions seen in step 3, on the smallest resource scope possible, plus the rare ones the owner justifies. If the platform simulates policies or offers a log-only mode, use it first. Signal: a simulation with no unexpected denials.",
          },
          {
            titulo: "6. Migrate gradually, with rollback",
            texto:
              "One application at a time, starting with the lowest-risk ones: staging, then production in an agreed window. Keep the old account enabled but with no new use, and watch authorization errors (403, access denied). Rollback: point the application’s configuration back to the old credential. Signal: no rise in errors during the agreed period.",
          },
          {
            titulo: "7. Retire, rotate and prevent a return",
            texto:
              "When the log shows the old account is no longer used, disable it, wait, and only then remove it; rotate any secret that was exposed. To avoid a repeat: forbid admin roles on service accounts by policy, require an owner and description at creation, alert on out-of-pattern use (new origin, time, privileged action) and review service accounts periodically. Signal: an alert tested and a policy blocking a test case.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Without guessing: where the evidence is",
        colunas: ["Question", "Where the evidence is", "What you learn"],
        linhas: [
          [
            "How did the admin role get onto the account?",
            "Audit log of role assignments and the history of the infrastructure code",
            "Who granted it, when and for which request; whether it was manual or through code",
          ],
          [
            "Is the role direct or inherited?",
            "Assignments by scope (resource group, subscription, organization) and group membership",
            "The effective permissions and where they come from; removing only the direct role may not be enough",
          ],
          [
            "Who uses the account?",
            "Authentication logs: origin, host, agent, application, token",
            "The real consumers, including people using the service account",
          ],
          [
            "What does it actually do?",
            "Audit logs by action and the last use of each permission",
            "The minimum set needed, application by application",
          ],
          [
            "Who can obtain the credential?",
            "Where the secret is stored and who can read the vault, the repository and the pipeline",
            "The exposure surface and who can mint new credentials",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "How to reduce without taking production down",
        texto:
          "**Observe before cutting, create in parallel before replacing, migrate one consumer at a time and disable before removing.** Every step has a success signal and a way back: if the signal does not appear, you undo that step, not the whole project.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The log only shows the observed window",
        texto:
          "Yearly tasks, disaster-recovery routines and error paths may not show up; data-access logs are sometimes not even on; retention may be short. That is why the window is long, each application’s owner validates the list and the rollback is ready. And remember that an admin account can grant permissions to itself or create credentials: treat it as possibly compromised until proven otherwise and check what it created.",
      },
    ],
    armadilhas: [
      "Revoking the admin role all at once, without measuring use: one of the applications stops and the incident becomes yours.",
      "Reducing permissions from documentation or the owner’s hunch instead of what the logs show.",
      "Creating new accounts and leaving the old one active with its secret still known: the risk remains.",
      "Fixing the case and not the cause: with no policy against admin on service accounts and no mandatory owner, the situation returns.",
    ],
    autoteste: [
      {
        pergunta: "Why split one account per application before reducing permissions?",
        resposta:
          "While several applications share the account, you cannot know what each one needs, nor reduce without risking breaking another. Separate accounts let you measure, restrict and audit each one.",
      },
      {
        pergunta: "How do you reduce permissions without taking production down?",
        resposta:
          "Measure real use in the logs, create the new identities in parallel with the observed permissions, migrate one application at a time with a rollback plan, and only disable the old account after a period of no use.",
      },
    ],
  },
};
