import type { Pergunta } from "../../tipos";

// Q11 · SCIM e provisionamento
export const q011: Pergunta = {
  numero: 11,
  modulo: "fundamentos",
  metodo: "trace",
  pt: {
    titulo: "SCIM e provisionamento",
    pergunta:
      "O que é SCIM e como ele automatiza o provisionamento de usuários e grupos entre um IdP e uma aplicação? Descreva o fluxo de criação, atualização e desativação.",
    porqueEsteMetodo:
      "SCIM é um protocolo de chamadas HTTP bem definidas, e o jeito de entendê-lo é seguir uma pessoa de verdade: da contratação à saída, com o que o IdP envia em cada momento e o que dá errado no caminho.",
    resposta30s:
      "**SCIM** (System for Cross-domain Identity Management) é um padrão REST em JSON para o IdP gerenciar contas e grupos em outra aplicação: `POST /Users` cria, `PATCH` atualiza e `active=false` desativa, com `GET` e filtros para consultar e reconciliar. Assim o ciclo de vida do usuário (entrada, mudança, saída) segue o RH sem trabalho manual em cada SaaS. Ao desativar, a aplicação precisa também **encerrar sessões e revogar tokens**, porque o SCIM por si só não faz isso.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma pessoa, do RH ao SaaS",
        etapas: [
          "O RH registra a contratação da Maria, e o IdP cria o usuário e o coloca nos grupos certos por regra",
          'Como a Maria foi atribuída ao SaaS, o IdP chama a API SCIM do aplicativo e primeiro consulta se ela já existe: `GET /Users?filter=userName eq "maria@empresa.com"`',
          "Não existe: o IdP faz `POST /Users` com o esquema padrão, e o SaaS devolve `201 Created` com o `id` dele, que o IdP guarda para os próximos pedidos",
          "Os grupos seguem o mesmo caminho: `POST /Groups`, ou `PATCH /Groups/{id}` para incluir a Maria como membro. O SaaS mapeia cada grupo para um papel",
          "A Maria muda de área: o IdP envia `PATCH /Users/{id}` com `replace` nos atributos que mudaram e ajusta os grupos, e o papel no SaaS acompanha",
          "A Maria sai da empresa: o RH atualiza o registro e o IdP envia `PATCH` com `active=false` (desativar, não apagar, preserva histórico e auditoria)",
          "O SaaS, ao ver `active=false`, deve encerrar as sessões dela e revogar refresh tokens e chaves de API; os access tokens já emitidos valem até expirar",
        ],
        nota: "O IdP também pode usar `DELETE /Users/{id}` conforme a política; desativar primeiro e apagar depois de um prazo é o mais comum.",
      },
      {
        tipo: "passos",
        titulo: "Quando algo dá errado no caminho",
        passos: [
          {
            titulo: "O usuário já existe (409)",
            texto:
              "Ele foi criado antes por JIT, por convite ou à mão. O `POST` volta `409 Conflict` com `scimType: uniqueness`. O IdP deve correlacionar por `userName` ou `externalId`, guardar o `id` existente e passar a atualizar com `PATCH`, em vez de repetir o `POST`.",
          },
          {
            titulo: "Limite de taxa e falhas transitórias (429, 5xx)",
            texto:
              "O IdP tenta de novo com espera crescente. O `POST` não é idempotente: por isso a consulta prévia e o `externalId` evitam contas duplicadas se a resposta se perder e o pedido for repetido. `PUT` e `PATCH` de substituição são seguros de repetir.",
          },
          {
            titulo: "Dados inválidos (400)",
            texto:
              "Um atributo obrigatório faltando ou fora do formato volta `400 Bad Request` com `scimType` (por exemplo, `invalidValue`). O IdP deve registrar o erro na fila de falhas e alertar quem administra, sem travar os demais usuários.",
          },
          {
            titulo: "Reconciliação de grandes listas",
            texto:
              "Para comparar o que o IdP acha que existe com o que o SaaS tem, use `GET /Users` com paginação (`startIndex`, que começa em 1, e `count`) e leia `totalResults`. Sem reconciliação periódica, uma alteração feita à mão no SaaS nunca é corrigida.",
          },
          {
            titulo: "Usuário apagado no destino (404)",
            texto:
              "Um `PATCH` em `id` que não existe mais devolve `404`. O IdP deve tratar como “precisa recriar” ou “nada a fazer”, conforme o evento, e não repetir para sempre.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Criar e desativar, no protocolo",
        legenda: "HTTP",
        codigo: `# 1. Criar (a resposta 201 traz o "id" do SaaS)
POST /scim/v2/Users HTTP/1.1
Content-Type: application/scim+json

{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "externalId": "rh-4821",
  "userName": "maria.souza@empresa.com",
  "name": { "givenName": "Maria", "familyName": "Souza" },
  "active": true
}

# 2. Desativar (a conta e o histórico ficam; o acesso não)
PATCH /scim/v2/Users/2819c223 HTTP/1.1
Content-Type: application/scim+json

{
  "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
  "Operations": [{ "op": "replace", "path": "active", "value": false }]
}`,
        nota: "O `Host` e o `Authorization: Bearer ...` do conector foram omitidos. As linhas com # são anotações do exemplo. O padrão está na RFC 7644 (protocolo) e na RFC 7643 (esquema).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "SCIM × JIT, e grupos para papéis",
        texto:
          "O **JIT provisioning** cria (e às vezes atualiza) a conta no **primeiro login**, a partir da assertion ou do token: é simples, mas não cria a conta antes, não atualiza quem não entra e **não desativa** quem saiu. O **SCIM** cobre o ciclo inteiro, antes e depois do login. Use o SCIM para o ciclo de vida e o JIT como rede de segurança. Mapeie **grupos a papéis** com cuidado: um grupo do IdP que vira administrador no SaaS é uma escalada de privilégio por uma porta lateral, então revise esse mapeamento e prefira o menor papel.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Desativar a conta não encerra o acesso sozinho",
        texto:
          "`active=false` impede novos logins, mas **sessões abertas, refresh tokens, chaves de API e access tokens já emitidos** continuam valendo até alguém revogá-los ou eles expirarem. O SaaS deve invalidar sessões e tokens ao ver a desativação; o lado do IdP deve revogar sessões e usar tokens de vida curta; e o desligamento deve ser testado de ponta a ponta, medindo o tempo entre a saída no RH e o último acesso possível.",
      },
    ],
    armadilhas: [
      "Achar que desativar no IdP encerra tudo: sessões, refresh tokens e chaves de API no SaaS continuam até serem revogados.",
      "Repetir `POST /Users` ao primeiro erro de rede, sem consultar antes nem usar `externalId`: o resultado são contas duplicadas.",
      "Mapear grupos a papéis sem revisão: um grupo errado no IdP vira privilégio de administrador no aplicativo.",
      "Não reconciliar: alterações feitas direto no SaaS, ou falhas silenciosas de sincronização, deixam contas e permissões divergentes do IdP.",
    ],
    autoteste: [
      {
        pergunta: "Como o SCIM desativa um usuário e por que isso costuma ser melhor que apagar?",
        resposta:
          "O IdP envia um `PATCH` colocando `active` em `false`. Desativar bloqueia o acesso e preserva o histórico e a auditoria; apagar, quando necessário, pode vir depois de um prazo, conforme a política de retenção.",
      },
      {
        pergunta: "Qual a diferença entre SCIM e JIT provisioning?",
        resposta:
          "O JIT cria ou atualiza a conta no primeiro login e não desativa quem saiu. O SCIM é o protocolo do ciclo de vida completo: o IdP cria a conta antes do login, atualiza atributos e grupos e desativa a conta na saída.",
      },
    ],
  },
  en: {
    titulo: "SCIM and provisioning",
    pergunta:
      "What is SCIM and how does it automate provisioning users and groups between an IdP and an application? Walk through creation, update and deactivation.",
    porqueEsteMetodo:
      "SCIM is a set of well-defined HTTP calls, and the way to understand it is to follow a real person: from hire to departure, with what the IdP sends at each moment and what goes wrong along the way.",
    resposta30s:
      "**SCIM** (System for Cross-domain Identity Management) is a REST standard in JSON for an IdP to manage accounts and groups in another application: `POST /Users` creates, `PATCH` updates and `active=false` deactivates, with `GET` and filters to query and reconcile. That way the user lifecycle (joiner, mover, leaver) follows HR without manual work in each SaaS. On deactivation the application must also **end sessions and revoke tokens**, because SCIM alone does not do that.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One person, from HR to the SaaS",
        etapas: [
          "HR records Maria’s hire, and the IdP creates the user and puts her in the right groups by rule",
          'Because Maria was assigned to the SaaS, the IdP calls the application’s SCIM API and first asks whether she already exists: `GET /Users?filter=userName eq "maria@company.com"`',
          "She does not: the IdP sends `POST /Users` with the standard schema, and the SaaS returns `201 Created` with its own `id`, which the IdP stores for later requests",
          "Groups follow the same path: `POST /Groups`, or `PATCH /Groups/{id}` to add Maria as a member. The SaaS maps each group to a role",
          "Maria changes teams: the IdP sends `PATCH /Users/{id}` with `replace` on the attributes that changed and adjusts her groups, and her role in the SaaS follows",
          "Maria leaves the company: HR updates the record and the IdP sends `PATCH` with `active=false` (deactivating rather than deleting keeps history and audit)",
          "On seeing `active=false`, the SaaS must end her sessions and revoke refresh tokens and API keys; access tokens already issued remain valid until they expire",
        ],
        nota: "The IdP may also use `DELETE /Users/{id}` depending on policy; deactivating first and deleting after a retention period is the most common.",
      },
      {
        tipo: "passos",
        titulo: "When something goes wrong on the way",
        passos: [
          {
            titulo: "The user already exists (409)",
            texto:
              "It was created earlier by JIT, an invitation or by hand. The `POST` returns `409 Conflict` with `scimType: uniqueness`. The IdP should correlate by `userName` or `externalId`, store the existing `id` and switch to updating with `PATCH`, instead of repeating the `POST`.",
          },
          {
            titulo: "Rate limit and transient failures (429, 5xx)",
            texto:
              "The IdP retries with growing waits. `POST` is not idempotent: that is why the prior lookup and the `externalId` prevent duplicate accounts if the response is lost and the request is repeated. `PUT` and replacing `PATCH` are safe to repeat.",
          },
          {
            titulo: "Invalid data (400)",
            texto:
              "A missing required attribute or one in the wrong format returns `400 Bad Request` with a `scimType` (for example, `invalidValue`). The IdP should log the error in a failure queue and alert whoever administers it, without blocking the other users.",
          },
          {
            titulo: "Reconciling large lists",
            texto:
              "To compare what the IdP believes exists with what the SaaS holds, use `GET /Users` with pagination (`startIndex`, which starts at 1, and `count`) and read `totalResults`. Without periodic reconciliation, a change made by hand in the SaaS is never corrected.",
          },
          {
            titulo: "User deleted at the destination (404)",
            texto:
              "A `PATCH` on an `id` that no longer exists returns `404`. The IdP should treat it as “needs recreating” or “nothing to do”, depending on the event, and not retry forever.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Create and deactivate, on the wire",
        legenda: "HTTP",
        codigo: `# 1. Create (the 201 response carries the SaaS "id")
POST /scim/v2/Users HTTP/1.1
Content-Type: application/scim+json

{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "externalId": "hr-4821",
  "userName": "maria.souza@company.com",
  "name": { "givenName": "Maria", "familyName": "Souza" },
  "active": true
}

# 2. Deactivate (the account and history stay; the access does not)
PATCH /scim/v2/Users/2819c223 HTTP/1.1
Content-Type: application/scim+json

{
  "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
  "Operations": [{ "op": "replace", "path": "active", "value": false }]
}`,
        nota: "The `Host` and the connector’s `Authorization: Bearer ...` were omitted. The lines starting with # are annotations for the example. The standard is in RFC 7644 (protocol) and RFC 7643 (schema).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "SCIM vs JIT, and groups to roles",
        texto:
          "**JIT provisioning** creates (and sometimes updates) the account at **first login**, from the assertion or token: it is simple, but it does not create the account beforehand, does not update people who never sign in and **does not deactivate** leavers. **SCIM** covers the whole lifecycle, before and after login. Use SCIM for the lifecycle and JIT as a safety net. Map **groups to roles** carefully: an IdP group that becomes administrator in the SaaS is privilege escalation through a side door, so review that mapping and prefer the smallest role.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Deactivating the account does not end access by itself",
        texto:
          "`active=false` blocks new logins, but **open sessions, refresh tokens, API keys and access tokens already issued** stay valid until someone revokes them or they expire. The SaaS should invalidate sessions and tokens on seeing the deactivation; the IdP side should revoke sessions and use short-lived tokens; and offboarding should be tested end to end, measuring the time between the departure in HR and the last possible access.",
      },
    ],
    armadilhas: [
      "Thinking that deactivating at the IdP ends everything: sessions, refresh tokens and API keys in the SaaS continue until they are revoked.",
      "Repeating `POST /Users` at the first network error, without querying first or using `externalId`: the result is duplicate accounts.",
      "Mapping groups to roles without review: a wrong group at the IdP becomes administrator privilege in the application.",
      "Not reconciling: changes made directly in the SaaS, or silent sync failures, leave accounts and permissions diverging from the IdP.",
    ],
    autoteste: [
      {
        pergunta: "How does SCIM deactivate a user and why is that usually better than deleting?",
        resposta:
          "The IdP sends a `PATCH` setting `active` to `false`. Deactivating blocks access and preserves history and audit; deletion, when needed, can come later after a period, according to the retention policy.",
      },
      {
        pergunta: "What is the difference between SCIM and JIT provisioning?",
        resposta:
          "JIT creates or updates the account at first login and does not deactivate leavers. SCIM is the full-lifecycle protocol: the IdP creates the account before login, updates attributes and groups and deactivates the account on departure.",
      },
    ],
  },
};
