import type { Pergunta } from "../../tipos";

// Q13 · Desligamento e revogação de acesso
export const q013: Pergunta = {
  numero: 13,
  modulo: "fundamentos",
  metodo: "playbook",
  pt: {
    titulo: "Desligamento e revogação de acesso",
    pergunta:
      "Um funcionário foi desligado hoje. Que passos você executa, em que ordem, para encerrar todos os acessos dele, e como verifica que nada ficou ativo?",
    porqueEsteMetodo:
      "Um desligamento é uma operação com ordem e prazo: o que se corta primeiro importa, e o que ficou para trás só aparece por verificação. O playbook dá a sequência e o critério de “pronto” de cada passo.",
    resposta30s:
      "Corte primeiro a porta, depois limpe, depois prove: **desabilite a conta no IdP** (sem excluir), **revogue sessões e refresh tokens**, remova **autenticadores e dispositivos**, revogue **chaves de API, tokens pessoais e segredos** que a pessoa conhecia, **transfira a propriedade** dos recursos e trate contas locais e compartilhadas. Para verificar, procure no log **qualquer atividade depois da hora do desligamento** e compare o IdP com a lista de usuários de cada aplicação, lembrando que access tokens já emitidos valem até expirar.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook de desligamento",
        passos: [
          {
            titulo: "1. Fixe a hora zero",
            texto:
              "Registre a hora exata do desligamento (T0), vinda do RH, e abra um chamado. Em desligamento conflituoso ou de pessoa com privilégios, o acesso cai antes de ela ser avisada. Sinal: T0 e responsável registrados; T0 é a referência de todos os logs.",
          },
          {
            titulo: "2. Desabilite a conta no IdP",
            texto:
              "Bloqueie o login em vez de excluir a conta: excluir apaga a trilha e a propriedade dos recursos. Confira que o bloqueio chegou às aplicações sincronizadas. Sinal: a tentativa de login falha e o status mostra conta desabilitada.",
          },
          {
            titulo: "3. Revogue sessões e refresh tokens",
            texto:
              "Desabilitar não encerra o que já está aberto. Revogue as sessões de SSO, os refresh tokens e os consentimentos que a pessoa concedeu a aplicações. Access tokens já emitidos valem até expirar, a menos que a API consulte a revogação. Sinal: nenhuma renovação de token depois de T0.",
          },
          {
            titulo: "4. Remova autenticadores e dispositivos",
            texto:
              "Retire os métodos de MFA (app, passkeys, chaves FIDO), os dispositivos registrados e os certificados de VPN; faça a limpeza remota dos dados corporativos no celular e no notebook e recolha o equipamento. Sinal: listas de métodos e de dispositivos vazias.",
          },
          {
            titulo: "5. Revogue chaves e segredos pessoais",
            texto:
              "Chaves de API, tokens de acesso pessoal (repositórios, nuvem), chaves SSH, credenciais de aplicações que a pessoa registrou e segredos compartilhados que ela conhecia (esses, rotacione). Sinal: relatório de credenciais por dono sem itens da pessoa.",
          },
          {
            titulo: "6. Transfira a propriedade e trate o que está fora do SSO",
            texto:
              "Dê novo dono à caixa de e-mail, aos arquivos, aos repositórios, aos jobs agendados, aos dashboards e às aplicações registradas. Troque a senha das contas compartilhadas e desative as contas locais de sistemas fora do SSO (bancos de dados, painéis administrativos, equipamentos de rede). Sinal: nenhum recurso com dono desabilitado.",
          },
          {
            titulo: "7. Verifique e registre",
            texto:
              "Procure no log de autenticação e de uso: houve login, renovação de token ou chamada de API depois de T0? Compare a lista de usuários de cada aplicação e do IdP com o RH. Repita a checagem depois de um dia e de uma semana e guarde o resultado no chamado. Sinal: nenhum evento bem-sucedido depois de T0 e nenhuma conta ativa no relatório.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Onde o acesso se esconde e como verificar",
        colunas: ["Onde sobra acesso", "Por que sobra", "Como verificar"],
        linhas: [
          [
            "Access tokens já emitidos",
            "A API valida só a assinatura e o `exp`, então o token segue válido até expirar mesmo com a conta desabilitada",
            "Vida curta dos tokens; revogação ou introspecção nas APIs críticas; chamadas à API com o `sub` da pessoa depois de T0",
          ],
          [
            "Sessões e refresh tokens",
            "Desabilitar a conta nem sempre derruba as sessões abertas nas aplicações",
            "Revogar as sessões no IdP e conferir que não há renovação depois de T0",
          ],
          [
            "Contas locais fora do SSO",
            "A aplicação tem usuários próprios que o IdP não conhece",
            "Inventário de aplicações e relatório de usuários de cada uma, cruzado com o RH",
          ],
          [
            "Chaves de API, tokens pessoais e chaves SSH",
            "A credencial pertence à pessoa, não à conta do IdP",
            "Listar as credenciais por dono em cada plataforma e revogar",
          ],
          [
            "Contas compartilhadas e de serviço",
            "A pessoa conhece a senha ou criou o segredo",
            "Rotacionar o segredo e trocar o dono da conta",
          ],
          [
            "Regras de encaminhamento, delegações e apps autorizados",
            "Acesso persistente criado pela própria pessoa",
            "Auditar regras de e-mail, delegados, webhooks e consentimentos OAuth da conta",
          ],
          [
            "Dispositivos",
            "Sessão aberta em celular ou notebook",
            "Limpeza remota confirmada e dispositivo fora da lista de confiáveis",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Ordem: porta, limpeza, prova",
        texto:
          "Em minutos, **corte a entrada** (desabilitar a conta e revogar sessões e tokens). Em horas, **limpe** (autenticadores, chaves, segredos, propriedade). Em dias, **prove** (logs, relatório de contas ativas, nova checagem). Excluir a conta é a última etapa, depois da retenção e da transferência de propriedade.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Desligado ainda ativo: o que olhar primeiro",
        texto:
          "Confirme o fato antes de corrigir: no log, **o que a pessoa fez depois de T0 e com qual credencial?** Se a conta no IdP está habilitada, o gatilho do RH falhou: descubra por quê. Se está desabilitada e ainda há atividade, procure sessão ou token válido. Se a atividade não passa pelo IdP, procure conta local, chave de API, conta compartilhada ou de serviço. Só então corrija o acesso e o ponto do processo que falhou.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não apague a conta no calor do momento",
        texto:
          "Excluir a conta apaga a trilha de auditoria, quebra a propriedade de arquivos e mensagens e pode liberar o nome de usuário para reutilização. Desabilite, transfira, retenha pelo prazo definido (inclusive para obrigações legais e investigações) e só então exclua. E combine com o jurídico e o RH antes de abrir a caixa de e-mail ou os arquivos da pessoa: o acesso ao conteúdo tem regras próprias.",
      },
    ],
    armadilhas: [
      "Achar que desabilitar a conta encerra tudo: sessões abertas, refresh tokens e access tokens já emitidos podem continuar válidos.",
      "Esquecer o que fica fora do IdP: contas locais, chaves de API, tokens pessoais, chaves SSH e contas compartilhadas.",
      "Fazer o desligamento por lista de tarefas manual, sem hora zero e sem verificação: ninguém prova depois que nada ficou ativo.",
      "Excluir a conta de imediato e perder a trilha de auditoria e a propriedade dos recursos.",
    ],
    autoteste: [
      {
        pergunta: "Por que desabilitar a conta no IdP não basta?",
        resposta:
          "Porque a conta desabilitada não derruba sessões abertas nem tokens já emitidos, e porque há acessos fora do IdP: contas locais, chaves de API, tokens pessoais e contas compartilhadas. É preciso revogar sessões e tokens e varrer cada um desses lugares.",
      },
      {
        pergunta: "Como você verifica que nada ficou ativo?",
        resposta:
          "Fixa a hora do desligamento e procura no log qualquer login, renovação de token ou chamada de API depois dela; cruza o IdP e a lista de usuários de cada aplicação com o RH; repete a checagem depois de um dia e de uma semana e guarda o resultado no chamado.",
      },
    ],
  },
  en: {
    titulo: "Offboarding and access revocation",
    pergunta:
      "An employee was terminated today. What steps do you run, in what order, to end all of their access, and how do you verify that nothing stayed active?",
    porqueEsteMetodo:
      "An offboarding is an operation with an order and a deadline: what you cut first matters, and what was left behind only shows up through verification. The playbook gives the sequence and the “done” criterion for each step.",
    resposta30s:
      "Cut the door first, then clean up, then prove it: **disable the account in the IdP** (do not delete), **revoke sessions and refresh tokens**, remove **authenticators and devices**, revoke the **API keys, personal tokens and secrets** the person knew, **transfer ownership** of resources and deal with local and shared accounts. To verify, search the logs for **any activity after the termination time** and compare the IdP with each application’s user list, remembering that access tokens already issued stay valid until they expire.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Offboarding playbook",
        passos: [
          {
            titulo: "1. Fix time zero",
            texto:
              "Record the exact termination time (T0), taken from HR, and open a ticket. For a contentious termination or a person with privileges, access drops before they are told. Signal: T0 and an owner recorded; T0 is the reference for every log.",
          },
          {
            titulo: "2. Disable the account in the IdP",
            texto:
              "Block sign-in instead of deleting the account: deleting erases the trail and resource ownership. Check that the block reached the synced applications. Signal: a sign-in attempt fails and the status shows a disabled account.",
          },
          {
            titulo: "3. Revoke sessions and refresh tokens",
            texto:
              "Disabling does not end what is already open. Revoke SSO sessions, refresh tokens and the consents the person granted to applications. Access tokens already issued stay valid until they expire, unless the API checks revocation. Signal: no token renewal after T0.",
          },
          {
            titulo: "4. Remove authenticators and devices",
            texto:
              "Remove the MFA methods (app, passkeys, FIDO keys), registered devices and VPN certificates; remotely wipe corporate data on the phone and laptop and collect the hardware. Signal: empty lists of methods and devices.",
          },
          {
            titulo: "5. Revoke personal keys and secrets",
            texto:
              "API keys, personal access tokens (repositories, cloud), SSH keys, credentials of applications the person registered, and shared secrets they knew (those you rotate). Signal: a credentials-by-owner report with no items for the person.",
          },
          {
            titulo: "6. Transfer ownership and deal with what is outside SSO",
            texto:
              "Give the mailbox, files, repositories, scheduled jobs, dashboards and registered applications a new owner. Change the password of shared accounts and disable local accounts in systems outside SSO (databases, admin consoles, network equipment). Signal: no resource owned by a disabled account.",
          },
          {
            titulo: "7. Verify and record",
            texto:
              "Search the authentication and usage logs: was there a sign-in, token renewal or API call after T0? Compare each application’s user list and the IdP with HR. Repeat the check after a day and after a week and keep the result in the ticket. Signal: no successful event after T0 and no active account in the report.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Where access hides and how to verify",
        colunas: ["Where access remains", "Why it remains", "How to verify"],
        linhas: [
          [
            "Access tokens already issued",
            "The API only checks the signature and `exp`, so the token stays valid until it expires even with the account disabled",
            "Short token lifetimes; revocation or introspection on critical APIs; API calls carrying the person’s `sub` after T0",
          ],
          [
            "Sessions and refresh tokens",
            "Disabling the account does not always kill sessions already open in applications",
            "Revoke sessions in the IdP and check that there is no renewal after T0",
          ],
          [
            "Local accounts outside SSO",
            "The application has its own users that the IdP does not know about",
            "An application inventory and each one’s user report, matched against HR",
          ],
          [
            "API keys, personal tokens and SSH keys",
            "The credential belongs to the person, not to the IdP account",
            "List credentials by owner on each platform and revoke them",
          ],
          [
            "Shared and service accounts",
            "The person knows the password or created the secret",
            "Rotate the secret and change the account owner",
          ],
          [
            "Forwarding rules, delegations and authorized apps",
            "Persistent access created by the person",
            "Audit the account’s mail rules, delegates, webhooks and OAuth consents",
          ],
          [
            "Devices",
            "An open session on a phone or laptop",
            "Remote wipe confirmed and the device off the trusted list",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Order: door, cleanup, proof",
        texto:
          "In minutes, **cut the entry** (disable the account and revoke sessions and tokens). In hours, **clean up** (authenticators, keys, secrets, ownership). In days, **prove it** (logs, active-accounts report, a second check). Deleting the account is the last step, after retention and the transfer of ownership.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "A terminated user is still active: what to look at first",
        texto:
          "Confirm the fact before fixing anything: in the logs, **what did the person do after T0, and with which credential?** If the account in the IdP is enabled, the HR trigger failed: find out why. If it is disabled and there is still activity, look for a valid session or token. If the activity does not go through the IdP, look for a local account, an API key, or a shared or service account. Only then fix the access and the part of the process that failed.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Do not delete the account in the heat of the moment",
        texto:
          "Deleting the account erases the audit trail, breaks ownership of files and messages and may free the username for reuse. Disable, transfer, retain for the defined period (including for legal obligations and investigations) and only then delete. And agree with legal and HR before opening the person’s mailbox or files: access to content has its own rules.",
      },
    ],
    armadilhas: [
      "Believing that disabling the account ends everything: open sessions, refresh tokens and access tokens already issued may remain valid.",
      "Forgetting what lives outside the IdP: local accounts, API keys, personal tokens, SSH keys and shared accounts.",
      "Running offboarding from a manual task list with no time zero and no verification: nobody can prove afterwards that nothing stayed active.",
      "Deleting the account immediately and losing the audit trail and resource ownership.",
    ],
    autoteste: [
      {
        pergunta: "Why is disabling the account in the IdP not enough?",
        resposta:
          "Because a disabled account does not kill open sessions or tokens already issued, and because there is access outside the IdP: local accounts, API keys, personal tokens and shared accounts. You must revoke sessions and tokens and sweep each of those places.",
      },
      {
        pergunta: "How do you verify that nothing stayed active?",
        resposta:
          "Fix the termination time and search the logs for any sign-in, token renewal or API call after it; match the IdP and each application’s user list against HR; repeat the check after a day and a week and keep the result in the ticket.",
      },
    ],
  },
};
