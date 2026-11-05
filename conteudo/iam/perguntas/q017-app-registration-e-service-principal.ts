import type { Pergunta } from "../../tipos";

// Q17 · App registration e service principal
export const q017: Pergunta = {
  numero: 17,
  modulo: "fundamentos",
  metodo: "compare",
  pt: {
    titulo: "App registration e service principal",
    pergunta:
      "No Microsoft Entra ID, qual é a diferença entre app registration, enterprise application, service principal e managed identity? Como isso aparece em apps multi-tenant?",
    porqueEsteMetodo:
      "Os quatro nomes confundem porque parecem sinônimos, mas descrevem objetos diferentes: definição, instância, visão do portal e credencial gerenciada. A matriz separa o que cada um é, onde vive e quando importa.",
    resposta30s:
      "A **app registration** é a **definição global** do aplicativo (client ID, credenciais, permissões pedidas), criada uma vez no tenant dono. O **service principal** é a **instância local** dessa definição em cada tenant onde o app é usado, e **enterprise application** é como o portal mostra esse service principal. A **managed identity** é um service principal cujas credenciais a plataforma gerencia (de sistema, presa a um recurso, ou atribuída pelo usuário, reutilizável). Em apps multi-tenant, o consentimento do administrador do cliente cria o service principal no tenant dele.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Quatro nomes, objetos diferentes",
        colunas: ["Conceito", "O que é", "Onde vive", "Quando importa"],
        linhas: [
          [
            "App registration",
            "A definição global do aplicativo: client ID, URIs de redirecionamento, credenciais (segredos, certificados, credenciais federadas), permissões que ele pede e quem pode entrar (um tenant ou vários)",
            "No tenant dono do aplicativo (o home tenant); uma só, mesmo com muitos clientes",
            "É o que o desenvolvedor cria e mantém: o molde",
          ],
          [
            "Service principal",
            "A instância do aplicativo dentro de um tenant. Tem o mesmo client ID da app registration e um object ID próprio, e é o objeto que recebe papéis, consentimentos e políticas e que aparece como identidade nos tokens",
            "Um em cada tenant onde o aplicativo é usado (o do dono e um por tenant cliente)",
            "É o que a autorização realmente enxerga: o acesso é concedido a ele",
          ],
          [
            "Enterprise application",
            "O nome que o portal dá ao service principal: a visão de administração dele (quem pode usar, consentimentos concedidos, SSO, atribuições)",
            "No portal de cada tenant; é o mesmo objeto que o service principal",
            "É onde o administrador do cliente vê e controla o uso do aplicativo no tenant dele",
          ],
          [
            "Managed identity de sistema",
            "Um service principal cujas credenciais a plataforma cria, guarda e rotaciona; ligado a um único recurso do Azure e apagado junto com ele",
            "No tenant do recurso; não há app registration para você gerenciar",
            "Um recurso acessando outros recursos sem segredo, com ciclo de vida preso ao recurso",
          ],
          [
            "Managed identity atribuída pelo usuário",
            "O mesmo mecanismo, mas como recurso independente, que pode ser ligado a vários recursos",
            "No tenant do recurso; ciclo de vida próprio",
            "Várias aplicações com o mesmo conjunto de permissões, ou identidade criada antes do recurso",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Como isso aparece em um app multi-tenant",
        texto:
          "Há **uma** app registration, no tenant do dono, configurada para aceitar contas de qualquer organização. Quando o administrador de um cliente concede o consentimento (ou cria o service principal diretamente), o Entra ID cria um **service principal desse aplicativo no tenant do cliente**. Tudo que é do cliente (papéis atribuídos, consentimentos, acesso condicional, quem pode usar) fica nesse service principal; a definição e as credenciais continuam na app registration do dono. Os tokens saem do tenant do cliente: o `tid` muda, e o `iss` também. Por isso uma API multi-tenant não deve aceitar qualquer `tid`: valide o emissor contra os tenants que você reconhece. Nomes de campos e telas mudam com o tempo; confira a documentação da Microsoft.",
      },
      {
        tipo: "codigo",
        titulo: "Token delegado e token só do aplicativo",
        legenda: "JWT",
        codigo: `// Delegado (há um usuário): as permissões vêm em "scp"
{
  "iss": "https://login.microsoftonline.com/<tenant-do-cliente>/v2.0",
  "tid": "<tenant-do-cliente>",
  "aud": "<client-id-da-api>",
  "azp": "<client-id-do-app>",
  "oid": "<id-do-usuario>",
  "scp": "Pedidos.Ler"
}

// Só do aplicativo (sem usuário): as permissões vêm em "roles"
{
  "iss": "https://login.microsoftonline.com/<tenant-do-cliente>/v2.0",
  "tid": "<tenant-do-cliente>",
  "aud": "<client-id-da-api>",
  "azp": "<client-id-do-app>",
  "oid": "<id-do-service-principal>",
  "roles": ["Pedidos.Ler.Tudo"]
}`,
        nota: "Os nomes dos claims e a versão do token variam; confira a documentação da Microsoft. Assinatura válida não basta: confira também `aud`, `iss`, `tid` e as permissões.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Delegada × de aplicação, e o consentimento",
        texto:
          "**Permissão delegada**: o aplicativo age em nome de um usuário conectado, e o acesso efetivo é a interseção do que o app pediu com o que o usuário já pode. **Permissão de aplicação**: o aplicativo age sozinho, sem usuário, com tudo o que lhe foi concedido (aparece em `roles`), e exige **consentimento de administrador**. Algumas permissões delegadas também exigem administrador. O consentimento é dado por tenant: o do cliente A não vale no cliente B. E não confunda: a managed identity não tem app registration nem segredo e só existe para recursos do Azure; um aplicativo multi-tenant que roda fora do Azure usa app registration.",
      },
    ],
    armadilhas: [
      "Achar que app registration e enterprise application são o mesmo objeto: uma é a definição no tenant dono, a outra é a instância em cada tenant.",
      "Procurar o consentimento ou os papéis do cliente na app registration do dono: eles vivem no service principal do tenant do cliente.",
      "Aceitar tokens de qualquer tenant em uma API multi-tenant sem validar `iss` e `tid` contra uma lista conhecida.",
      "Conceder permissão de aplicação quando uma delegada bastaria: o app passa a ver tudo o que a permissão cobre, não só o que o usuário pode ver.",
    ],
    autoteste: [
      {
        pergunta: "Qual objeto recebe a atribuição de papel e o consentimento em um tenant cliente?",
        resposta:
          "O service principal (a enterprise application) daquele tenant, não a app registration do tenant dono.",
      },
      {
        pergunta: "Qual a diferença entre managed identity de sistema e atribuída pelo usuário?",
        resposta:
          "A de sistema nasce e morre com o recurso e serve só a ele; a atribuída pelo usuário é um recurso à parte, com ciclo de vida próprio, que pode ser ligado a vários recursos.",
      },
    ],
  },
  en: {
    titulo: "App registration and service principal",
    pergunta:
      "In Microsoft Entra ID, what is the difference between an app registration, an enterprise application, a service principal and a managed identity? How does this appear in multi-tenant apps?",
    porqueEsteMetodo:
      "The four names confuse because they sound like synonyms, but they describe different objects: a definition, an instance, a portal view and a managed credential. The matrix separates what each one is, where it lives and when it matters.",
    resposta30s:
      "The **app registration** is the application’s **global definition** (client ID, credentials, requested permissions), created once in the owning tenant. The **service principal** is the **local instance** of that definition in each tenant where the app is used, and **enterprise application** is how the portal shows that service principal. A **managed identity** is a service principal whose credentials the platform manages (system-assigned, tied to one resource, or user-assigned, reusable). In multi-tenant apps, the customer administrator’s consent creates the service principal in their tenant.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Four names, different objects",
        colunas: ["Concept", "What it is", "Where it lives", "When it matters"],
        linhas: [
          [
            "App registration",
            "The application’s global definition: client ID, redirect URIs, credentials (secrets, certificates, federated credentials), the permissions it requests and who may sign in (one tenant or several)",
            "In the application’s owning tenant (the home tenant); just one, even with many customers",
            "It is what the developer creates and maintains: the template",
          ],
          [
            "Service principal",
            "The application’s instance inside a tenant. It has the same client ID as the app registration and its own object ID, and it is the object that receives roles, consents and policies and appears as the identity in tokens",
            "One in each tenant where the application is used (the owner’s plus one per customer tenant)",
            "It is what authorization actually sees: access is granted to it",
          ],
          [
            "Enterprise application",
            "The name the portal gives the service principal: its administration view (who can use it, consents granted, SSO, assignments)",
            "In each tenant’s portal; it is the same object as the service principal",
            "It is where the customer’s administrator sees and controls use of the application in their tenant",
          ],
          [
            "System-assigned managed identity",
            "A service principal whose credentials the platform creates, stores and rotates; tied to a single Azure resource and deleted along with it",
            "In the resource’s tenant; there is no app registration for you to manage",
            "A resource reaching other resources with no secret, with a lifecycle tied to the resource",
          ],
          [
            "User-assigned managed identity",
            "The same mechanism, but as an independent resource that can be attached to several resources",
            "In the resource’s tenant; its own lifecycle",
            "Several applications with the same set of permissions, or an identity created before the resource",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "How this appears in a multi-tenant app",
        texto:
          "There is **one** app registration, in the owner’s tenant, set to accept accounts from any organization. When a customer’s administrator grants consent (or creates the service principal directly), Entra ID creates a **service principal for that application in the customer’s tenant**. Everything that belongs to the customer (assigned roles, consents, conditional access, who may use it) sits on that service principal; the definition and credentials stay in the owner’s app registration. Tokens come from the customer’s tenant: the `tid` changes, and so does the `iss`. That is why a multi-tenant API must not accept just any `tid`: validate the issuer against the tenants you recognize. Field names and screens change over time; check Microsoft’s documentation.",
      },
      {
        tipo: "codigo",
        titulo: "A delegated token and an app-only token",
        legenda: "JWT",
        codigo: `// Delegated (a user is present): permissions come in "scp"
{
  "iss": "https://login.microsoftonline.com/<customer-tenant>/v2.0",
  "tid": "<customer-tenant>",
  "aud": "<api-client-id>",
  "azp": "<app-client-id>",
  "oid": "<user-id>",
  "scp": "Orders.Read"
}

// App-only (no user): permissions come in "roles"
{
  "iss": "https://login.microsoftonline.com/<customer-tenant>/v2.0",
  "tid": "<customer-tenant>",
  "aud": "<api-client-id>",
  "azp": "<app-client-id>",
  "oid": "<service-principal-id>",
  "roles": ["Orders.Read.All"]
}`,
        nota: "Claim names and the token version vary; check Microsoft’s documentation. A valid signature is not enough: also check `aud`, `iss`, `tid` and the permissions.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Delegated vs application permissions, and consent",
        texto:
          "**Delegated permission**: the application acts on behalf of a signed-in user, and effective access is the intersection of what the app requested and what the user can already do. **Application permission**: the application acts alone, with no user, with everything it was granted (it appears in `roles`), and requires **administrator consent**. Some delegated permissions also require an administrator. Consent is given per tenant: customer A’s does not apply at customer B. And do not mix them up: a managed identity has no app registration and no secret and exists only for Azure resources; a multi-tenant application running outside Azure uses an app registration.",
      },
    ],
    armadilhas: [
      "Thinking app registration and enterprise application are the same object: one is the definition in the owner tenant, the other is the instance in each tenant.",
      "Looking for the customer’s consent or roles in the owner’s app registration: they live on the service principal in the customer’s tenant.",
      "Accepting tokens from any tenant in a multi-tenant API without validating `iss` and `tid` against a known list.",
      "Granting an application permission when a delegated one would do: the app then sees everything the permission covers, not just what the user can see.",
    ],
    autoteste: [
      {
        pergunta: "Which object receives role assignments and consent in a customer tenant?",
        resposta:
          "The service principal (the enterprise application) in that tenant, not the app registration in the owner tenant.",
      },
      {
        pergunta: "What is the difference between a system-assigned and a user-assigned managed identity?",
        resposta:
          "The system-assigned one is born and dies with the resource and serves only it; the user-assigned one is a separate resource with its own lifecycle that can be attached to several resources.",
      },
    ],
  },
};
