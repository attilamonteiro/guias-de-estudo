import type { Pergunta } from "../../tipos";

// Q10 · Diretórios e IdP em nuvem
export const q010: Pergunta = {
  numero: 10,
  modulo: "fundamentos",
  metodo: "compare",
  pt: {
    titulo: "Diretórios e IdP em nuvem",
    pergunta:
      "Compare diretórios tradicionais (LDAP, Active Directory) com um provedor de identidade em nuvem como o Entra ID. Quando cada um se encaixa e como convivem em um ambiente híbrido?",
    porqueEsteMetodo:
      "Os dois guardam usuários e grupos, mas foram feitos para mundos diferentes. A matriz lado a lado mostra onde cada um brilha, e a regra de decisão diz o que usar para qual aplicação.",
    resposta30s:
      "Um **diretório tradicional** (LDAP, Active Directory) serve à rede interna, com **LDAP e Kerberos**, computadores no domínio e aplicações legadas; um **IdP em nuvem** como o Entra ID serve à internet, com **OIDC, SAML e OAuth** por HTTPS, SaaS, dispositivos remotos e acesso condicional. No ambiente híbrido, um conector **sincroniza** o diretório local com a nuvem, e a senha é validada na nuvem (hash sincronizado), no local (pass-through) ou num IdP federado. A regra: aplicações modernas falam com o IdP em nuvem e as legadas continuam no diretório.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Lado a lado",
        colunas: ["Aspecto", "Diretório tradicional (LDAP, Active Directory)", "IdP em nuvem (por exemplo, Entra ID)"],
        linhas: [
          [
            "Protocolos",
            "LDAP e Kerberos; NTLM em ambientes legados",
            "OpenID Connect, SAML 2.0, OAuth 2.0 por HTTPS; SCIM para provisionamento",
          ],
          [
            "Modelo de objetos",
            "Árvore hierárquica (floresta, domínios, unidades organizacionais), esquema extensível e políticas de grupo",
            "Estrutura plana por tenant: usuários, grupos, aplicações, dispositivos e identidades de serviço, sem a hierarquia de OUs nem as GPOs do AD",
          ],
          ["Alcance", "Rede interna ou VPN", "Internet, de qualquer lugar"],
          [
            "Dispositivos",
            "Computadores ingressados no domínio, gerenciados por política de grupo",
            "Dispositivos registrados ou ingressados na nuvem, gerenciados por MDM e avaliados no acesso condicional",
          ],
          [
            "Aplicações",
            "Legadas e do mundo Windows: compartilhamentos de arquivos, apps que fazem bind LDAP ou usam Kerberos",
            "SaaS e aplicações modernas por OIDC ou SAML; APIs com tokens OAuth",
          ],
          [
            "Autenticação",
            "Senha na rede, Kerberos e NTLM",
            "Senha, MFA, passkeys, acesso condicional e sinais de risco",
          ],
          [
            "Operação",
            "Você mantém servidores, réplicas, atualizações e backups",
            "Serviço gerenciado pelo fornecedor: você configura, não opera os servidores",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Como convivem no ambiente híbrido",
        colunas: ["Método de autenticação", "Onde a senha é validada", "Vantagem", "Atenção"],
        linhas: [
          [
            "Sincronização de hash de senha",
            "Na nuvem, com uma derivação do hash vinda do diretório local, sem a senha em si",
            "Simples, e a nuvem continua autenticando se o ambiente local cair",
            "A nuvem passa a guardar material derivado das senhas locais: confira o modelo de ameaça com o fornecedor",
          ],
          [
            "Pass-through",
            "No diretório local, por um agente que recebe o pedido da nuvem",
            "A senha é validada pelas políticas locais; nada derivado fica na nuvem",
            "Depende da disponibilidade do ambiente local e do agente",
          ],
          [
            "Federação com IdP local",
            "No IdP local, que emite a prova à nuvem",
            "Reaproveita a infraestrutura e as regras existentes",
            "Mais peças para manter e novo ponto único de falha",
          ],
        ],
        nota: "A **sincronização** (um conector do fornecedor) copia usuários, grupos e atributos do diretório local para a nuvem. Defina, atributo por atributo, qual lado é a fonte da verdade e evite escrever nos dois. Confira nomes e detalhes de cada produto na documentação do fornecedor.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Aplicação **moderna** (fala OIDC, SAML ou OAuth), SaaS ou acesso pela internet: **IdP em nuvem**. Aplicação **legada** que só fala LDAP ou Kerberos, servidores de arquivos Windows, computadores que dependem de política de grupo: **diretório local**. O ambiente híbrido é a regra, não a exceção: o diretório local segue como fonte para o legado, a nuvem é o IdP do que é novo, e a migração acontece aplicação por aplicação (modernizando, colocando um proxy na frente ou trocando o produto).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Entra ID não é o “AD na nuvem”",
        texto:
          "O Entra ID é outro produto: não oferece LDAP nem Kerberos como o AD local, não tem OUs nem GPOs no mesmo sentido, e a sincronização aproxima os dois mundos sem torná-los iguais. Um bind LDAP faz a aplicação **receber a senha** do usuário, ao contrário do SSO, em que a aplicação nunca a vê. E a sincronização amplia o raio de ação: um diretório local comprometido pode alcançar a nuvem, então as contas de administração da nuvem devem ser separadas, só na nuvem, e protegidas por MFA forte.",
      },
    ],
    armadilhas: [
      "Dizer que o Entra ID “substitui” o Active Directory sem nuance: ele cobre bem as aplicações modernas, mas não é um domínio Windows tradicional.",
      "Manter a mesma conta administrativa no local e na nuvem: o comprometimento de um lado passa para o outro.",
      "Sincronizar sem definir a fonte da verdade de cada atributo: dois lados editando o mesmo dado geram conflitos e contas órfãs.",
      "Expor LDAP ou Kerberos diretamente à internet em vez de usar proxy de aplicação, VPN ou migração para OIDC.",
    ],
    autoteste: [
      {
        pergunta: "Quando uma aplicação deve falar com o diretório local e quando com o IdP em nuvem?",
        resposta:
          "Com o diretório local quando ela só fala LDAP ou Kerberos e vive na rede interna; com o IdP em nuvem quando fala OpenID Connect, SAML ou OAuth, é SaaS ou é acessada pela internet.",
      },
      {
        pergunta: "Quais são três formas de validar a senha num ambiente híbrido?",
        resposta:
          "Sincronizando uma derivação do hash para a nuvem (validação na nuvem), por pass-through (a nuvem consulta o diretório local) ou por federação com um IdP local, que emite a prova à nuvem.",
      },
    ],
  },
  en: {
    titulo: "Directories vs cloud IdP",
    pergunta:
      "Compare traditional directories (LDAP, Active Directory) with a cloud identity provider such as Entra ID. When does each fit, and how do they coexist in a hybrid environment?",
    porqueEsteMetodo:
      "Both store users and groups, but they were built for different worlds. The side-by-side matrix shows where each one shines, and the decision rule says what to use for which application.",
    resposta30s:
      "A **traditional directory** (LDAP, Active Directory) serves the internal network, with **LDAP and Kerberos**, domain-joined computers and legacy applications; a **cloud IdP** such as Entra ID serves the internet, with **OIDC, SAML and OAuth** over HTTPS, SaaS, remote devices and conditional access. In a hybrid environment, a connector **synchronizes** the on-premises directory to the cloud, and the password is validated in the cloud (password hash sync), on premises (pass-through) or at a federated IdP. The rule: modern applications talk to the cloud IdP and legacy ones stay on the directory.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Side by side",
        colunas: ["Aspect", "Traditional directory (LDAP, Active Directory)", "Cloud IdP (for example, Entra ID)"],
        linhas: [
          [
            "Protocols",
            "LDAP and Kerberos; NTLM in legacy environments",
            "OpenID Connect, SAML 2.0, OAuth 2.0 over HTTPS; SCIM for provisioning",
          ],
          [
            "Object model",
            "Hierarchical tree (forest, domains, organizational units), extensible schema and group policy",
            "Flat structure per tenant: users, groups, applications, devices and service identities, without AD’s OU hierarchy or GPOs",
          ],
          ["Reach", "Internal network or VPN", "The internet, from anywhere"],
          [
            "Devices",
            "Domain-joined computers, managed by group policy",
            "Cloud-registered or cloud-joined devices, managed by MDM and evaluated in conditional access",
          ],
          [
            "Applications",
            "Legacy and Windows-world: file shares, apps that do an LDAP bind or use Kerberos",
            "SaaS and modern applications through OIDC or SAML; APIs with OAuth tokens",
          ],
          [
            "Authentication",
            "Password on the network, Kerberos and NTLM",
            "Password, MFA, passkeys, conditional access and risk signals",
          ],
          [
            "Operation",
            "You maintain servers, replicas, updates and backups",
            "A service managed by the vendor: you configure, you do not run the servers",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "How they coexist in a hybrid environment",
        colunas: ["Authentication method", "Where the password is validated", "Advantage", "Watch out for"],
        linhas: [
          [
            "Password hash synchronization",
            "In the cloud, with a derivative of the hash coming from the on-premises directory, not the password itself",
            "Simple, and the cloud keeps authenticating if the on-premises environment goes down",
            "The cloud now holds material derived from on-premises passwords: review the threat model with the vendor",
          ],
          [
            "Pass-through",
            "On the on-premises directory, through an agent that receives the request from the cloud",
            "The password is validated by on-premises policies; nothing derived is kept in the cloud",
            "Depends on the availability of the on-premises environment and the agent",
          ],
          [
            "Federation with an on-premises IdP",
            "At the on-premises IdP, which issues the proof to the cloud",
            "Reuses existing infrastructure and rules",
            "More pieces to maintain and a new single point of failure",
          ],
        ],
        nota: "**Synchronization** (a vendor connector) copies users, groups and attributes from the on-premises directory to the cloud. Define, attribute by attribute, which side is the source of truth and avoid writing on both. Check product names and details in the vendor documentation.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "A **modern** application (speaks OIDC, SAML or OAuth), a SaaS or access over the internet: **cloud IdP**. A **legacy** application that only speaks LDAP or Kerberos, Windows file servers, computers that depend on group policy: **on-premises directory**. Hybrid is the rule, not the exception: the on-premises directory stays as the source for legacy, the cloud is the IdP for what is new, and migration happens application by application (modernizing, putting a proxy in front or replacing the product).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Entra ID is not “AD in the cloud”",
        texto:
          "Entra ID is a different product: it does not offer LDAP or Kerberos like on-premises AD, has no OUs or GPOs in the same sense, and synchronization brings the two worlds closer without making them equal. An LDAP bind makes the application **receive the user’s password**, unlike SSO, where the application never sees it. And synchronization widens the blast radius: a compromised on-premises directory can reach the cloud, so cloud administration accounts should be separate, cloud-only and protected by strong MFA.",
      },
    ],
    armadilhas: [
      "Saying Entra ID “replaces” Active Directory without nuance: it covers modern applications well, but it is not a traditional Windows domain.",
      "Keeping the same administrative account on premises and in the cloud: a compromise on one side crosses to the other.",
      "Synchronizing without defining the source of truth for each attribute: two sides editing the same data create conflicts and orphaned accounts.",
      "Exposing LDAP or Kerberos directly to the internet instead of using an application proxy, a VPN or migrating to OIDC.",
    ],
    autoteste: [
      {
        pergunta: "When should an application talk to the on-premises directory and when to the cloud IdP?",
        resposta:
          "To the on-premises directory when it only speaks LDAP or Kerberos and lives on the internal network; to the cloud IdP when it speaks OpenID Connect, SAML or OAuth, is a SaaS or is accessed over the internet.",
      },
      {
        pergunta: "What are three ways to validate the password in a hybrid environment?",
        resposta:
          "Synchronizing a derivative of the hash to the cloud (validation in the cloud), pass-through (the cloud queries the on-premises directory) or federation with an on-premises IdP, which issues the proof to the cloud.",
      },
    ],
  },
};
