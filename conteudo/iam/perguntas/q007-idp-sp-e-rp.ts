import type { Pergunta } from "../../tipos";

// Q07 · IdP, SP e RP
export const q007: Pergunta = {
  numero: 7,
  modulo: "fundamentos",
  metodo: "feynman",
  pt: {
    titulo: "IdP, SP e RP",
    pergunta:
      "Explique os papéis IdP, SP e RP. Como cada um aparece em SAML, OAuth e OpenID Connect, e quem confia em quem?",
    porqueEsteMetodo:
      "Cada protocolo batiza os mesmos papéis com nomes diferentes, e é aí que a confusão nasce. Uma analogia comum (a portaria que aceita o crachá de outra empresa) ajuda a fixar a ideia antes de mapear os nomes reais.",
    resposta30s:
      "O **IdP** (provedor de identidade) autentica a pessoa e emite uma prova assinada; o aplicativo que consome essa prova é o **SP** (service provider) no SAML e o **RP** (relying party) no OpenID Connect, em que o IdP também se chama OP. No **OAuth 2.0** os papéis são servidor de autorização (emite o access token), cliente (pede) e servidor de recursos (a API que o valida). A confiança vem de **metadados e chaves públicas** trocados de antemão, e o aplicativo nunca vê a senha.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Uma empresa B recebe um visitante da empresa A. A portaria de B não tem a ficha de RH dele e não precisa ter: ela reconhece o crachá de A porque, por um acordo prévio, conhece o selo que A usa para assinar os crachás. Lê o que está escrito (nome, função, validade), confere se o selo é autêntico e libera a entrada. A empresa A, que emitiu o crachá, é o IdP; a portaria de B é o SP (ou o RP).",
        tecnico:
          "O **IdP** é quem autentica e emite a identidade. O **SP** (no SAML) e o **RP** (no OpenID Connect) são os aplicativos que **confiam** no IdP e consomem a prova que ele emite: uma **assertion** SAML em XML assinado, ou um **ID token** JWT assinado. No OAuth 2.0 não existe o par IdP e SP: há o **servidor de autorização** (autentica o dono do recurso, obtém o consentimento e emite o access token), o **cliente** (o aplicativo que pede acesso) e o **servidor de recursos** (a API que valida o token). Na prática, o mesmo produto costuma ser IdP, OP e servidor de autorização ao mesmo tempo.",
        limite:
          "A analogia falha em dois pontos. O visitante entrega o crachá na portaria, mas no digital a prova chega ao aplicativo por redirecionamento do navegador, e pode ser roubada ou reaproveitada se não estiver amarrada ao destino (`aud`), ao momento (`exp`) e a um valor de uso único (`nonce`, `state`, PKCE). E a portaria de B ainda vê o rosto da pessoa, enquanto o SP **nunca vê a senha**: ela só passa entre a pessoa e o IdP.",
      },
      {
        tipo: "tabela",
        titulo: "Os mesmos papéis, com nomes de cada protocolo",
        colunas: ["Papel", "SAML 2.0", "OpenID Connect", "OAuth 2.0"],
        linhas: [
          [
            "Quem autentica e emite",
            "IdP",
            "OP (OpenID Provider), na prática o IdP",
            "Servidor de autorização (emite o access token)",
          ],
          [
            "Quem consome",
            "SP (service provider)",
            "RP (relying party), que é o cliente OIDC",
            "Cliente (pede) e servidor de recursos (a API que valida o token)",
          ],
          [
            "O que é emitido",
            "Assertion assinada (XML)",
            "ID token (JWT) e, em geral, também um access token",
            "Access token (opaco ou JWT)",
          ],
          [
            "Como a confiança é configurada",
            "Troca de metadados: `entityID`, endpoints e certificados de assinatura",
            "Descoberta em `/.well-known/openid-configuration`, chaves em `jwks_uri` e registro do cliente",
            "Registro do cliente; o servidor de recursos valida o token pelas chaves do servidor de autorização (JWKS) ou por introspecção",
          ],
          [
            "Quem confia em quem",
            "O SP confia nas assinaturas do IdP; o IdP só envia ao endpoint (ACS) registrado",
            "O RP confia nas chaves do OP; o OP só redireciona aos `redirect_uri` registrados",
            "O servidor de recursos confia no servidor de autorização; este só emite tokens a clientes registrados",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "A mesma sequência, em qualquer protocolo de login no navegador",
        etapas: [
          "A pessoa abre o aplicativo (SP ou RP) e não tem sessão",
          "O aplicativo a redireciona ao IdP, dizendo quem ele é e para onde voltar",
          "No IdP, a pessoa digita senha e passa pelo MFA: é a única vez em que a senha aparece",
          "O IdP devolve o navegador ao aplicativo com a prova assinada (assertion ou código que vira ID token)",
          "O aplicativo valida a assinatura, o emissor (`iss`), o destinatário (`aud`) e a validade, e cria a sessão dele",
        ],
        nota: "Veja Q08 para o que muda quando um segundo aplicativo entra na história (SSO).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Quem confia em quem",
        texto:
          "A confiança é **combinada de antemão** e verificada por **assinatura**, não por consulta a cada login. O SP ou RP guarda as chaves públicas do IdP (por metadados SAML, ou por descoberta e JWKS no OIDC) e aceita só provas assinadas por elas. O IdP, por sua vez, só entrega a prova a destinos que o aplicativo registrou (ACS ou `redirect_uri`) e só a emite para o público certo (`aud`). Por isso a rotação de chaves e a conferência exata do endereço de retorno são as duas peças de que tudo depende. RP e SP são o mesmo papel com nomes de ecossistemas diferentes; **OAuth sozinho não diz quem é a pessoa**, é o OpenID Connect que acrescenta o ID token.",
      },
    ],
    armadilhas: [
      "Achar que SP e RP são coisas diferentes: são o mesmo papel (o aplicativo que confia no IdP), com o nome de cada ecossistema.",
      "Tratar o OAuth 2.0 como protocolo de login: o OAuth emite access tokens para APIs, e quem entrega a identidade é o OpenID Connect.",
      "Dizer que o aplicativo “consulta o IdP a cada requisição”: ele valida a assinatura localmente e só volta ao IdP para renovar ou revogar.",
      "Aceitar qualquer destino ou emissor: sem conferir `iss`, `aud` e o endereço de retorno registrado, uma prova emitida para outro aplicativo vale como sua.",
    ],
    autoteste: [
      {
        pergunta: "Em SAML, quem é o IdP e quem é o SP? E em OpenID Connect?",
        resposta:
          "No SAML, o IdP autentica e emite a assertion, e o SP é o aplicativo que a consome. No OpenID Connect, o OP (o IdP) emite o ID token, e o RP é o aplicativo cliente que o consome.",
      },
      {
        pergunta: "Como o SP sabe que a assertion veio mesmo do IdP, sem nunca ver a senha?",
        resposta:
          "Porque a assertion é assinada com a chave privada do IdP e o SP tem a chave pública (ou o certificado) trocada de antemão, nos metadados. Ele valida a assinatura, o emissor, o destinatário e a validade; a senha só passou entre a pessoa e o IdP.",
      },
    ],
  },
  en: {
    titulo: "IdP, SP and RP",
    pergunta:
      "Explain the roles IdP, SP and RP. How does each appear in SAML, OAuth and OpenID Connect, and who trusts whom?",
    porqueEsteMetodo:
      "Each protocol gives the same roles different names, and that is where the confusion starts. A common analogy (a front desk that accepts another company’s badge) fixes the idea before the real names are mapped.",
    resposta30s:
      "The **IdP** (identity provider) authenticates the person and issues a signed proof; the application that consumes that proof is the **SP** (service provider) in SAML and the **RP** (relying party) in OpenID Connect, where the IdP is also called the OP. In **OAuth 2.0** the roles are the authorization server (issues the access token), the client (asks) and the resource server (the API that validates it). Trust comes from **metadata and public keys** exchanged beforehand, and the application never sees the password.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Company B receives a visitor from company A. B’s front desk has no HR file on the visitor and does not need one: it recognizes A’s badge because, by a prior agreement, it knows the seal A uses to sign its badges. It reads what is written (name, role, expiry), checks that the seal is authentic and lets the visitor in. Company A, which issued the badge, is the IdP; B’s front desk is the SP (or the RP).",
        tecnico:
          "The **IdP** is who authenticates and issues the identity. The **SP** (in SAML) and the **RP** (in OpenID Connect) are the applications that **trust** the IdP and consume the proof it issues: a SAML **assertion** in signed XML, or a signed JWT **ID token**. OAuth 2.0 has no IdP and SP pair: it has the **authorization server** (authenticates the resource owner, obtains consent and issues the access token), the **client** (the application asking for access) and the **resource server** (the API that validates the token). In practice, the same product is usually the IdP, the OP and the authorization server at once.",
        limite:
          "The analogy breaks in two places. The visitor hands over the badge at the desk, but in the digital world the proof reaches the application through a browser redirect, and it can be stolen or replayed unless it is bound to its destination (`aud`), its moment (`exp`) and a single-use value (`nonce`, `state`, PKCE). And B’s front desk still sees the person’s face, whereas the SP **never sees the password**: it only passes between the person and the IdP.",
      },
      {
        tipo: "tabela",
        titulo: "The same roles, with each protocol’s names",
        colunas: ["Role", "SAML 2.0", "OpenID Connect", "OAuth 2.0"],
        linhas: [
          [
            "Who authenticates and issues",
            "IdP",
            "OP (OpenID Provider), in practice the IdP",
            "Authorization server (issues the access token)",
          ],
          [
            "Who consumes",
            "SP (service provider)",
            "RP (relying party), which is the OIDC client",
            "Client (asks) and resource server (the API that validates the token)",
          ],
          [
            "What is issued",
            "A signed assertion (XML)",
            "An ID token (JWT) and, usually, an access token as well",
            "An access token (opaque or JWT)",
          ],
          [
            "How trust is configured",
            "Metadata exchange: `entityID`, endpoints and signing certificates",
            "Discovery at `/.well-known/openid-configuration`, keys at `jwks_uri` and client registration",
            "Client registration; the resource server validates the token with the authorization server’s keys (JWKS) or by introspection",
          ],
          [
            "Who trusts whom",
            "The SP trusts the IdP’s signatures; the IdP only sends to the registered endpoint (ACS)",
            "The RP trusts the OP’s keys; the OP only redirects to registered `redirect_uri` values",
            "The resource server trusts the authorization server; the latter only issues tokens to registered clients",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "The same sequence, in any browser login protocol",
        etapas: [
          "The person opens the application (SP or RP) and has no session",
          "The application redirects them to the IdP, saying who it is and where to return",
          "At the IdP, the person types the password and goes through MFA: the only place the password appears",
          "The IdP sends the browser back to the application with the signed proof (an assertion, or a code that becomes an ID token)",
          "The application validates the signature, the issuer (`iss`), the audience (`aud`) and the validity, and creates its own session",
        ],
        nota: "See Q08 for what changes when a second application enters the story (SSO).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Who trusts whom",
        texto:
          "Trust is **agreed beforehand** and checked by **signature**, not by a lookup at every login. The SP or RP holds the IdP’s public keys (through SAML metadata, or discovery and JWKS in OIDC) and accepts only proofs signed by them. The IdP, in turn, only delivers the proof to destinations the application registered (ACS or `redirect_uri`) and only issues it for the right audience (`aud`). That is why key rotation and exact matching of the return address are the two pieces everything depends on. RP and SP are the same role under different ecosystems’ names; **OAuth alone does not say who the person is**, it is OpenID Connect that adds the ID token.",
      },
    ],
    armadilhas: [
      "Thinking SP and RP are different things: they are the same role (the application that trusts the IdP), under each ecosystem’s name.",
      "Treating OAuth 2.0 as a login protocol: OAuth issues access tokens for APIs, and it is OpenID Connect that delivers identity.",
      "Saying the application “asks the IdP on every request”: it validates the signature locally and only goes back to the IdP to renew or revoke.",
      "Accepting any destination or issuer: without checking `iss`, `aud` and the registered return address, a proof issued for another application counts as yours.",
    ],
    autoteste: [
      {
        pergunta: "In SAML, who is the IdP and who is the SP? And in OpenID Connect?",
        resposta:
          "In SAML, the IdP authenticates and issues the assertion, and the SP is the application that consumes it. In OpenID Connect, the OP (the IdP) issues the ID token, and the RP is the client application that consumes it.",
      },
      {
        pergunta: "How does the SP know the assertion really came from the IdP, without ever seeing the password?",
        resposta:
          "Because the assertion is signed with the IdP’s private key and the SP holds the public key (or certificate) exchanged beforehand, in the metadata. It validates the signature, the issuer, the audience and the validity; the password only passed between the person and the IdP.",
      },
    ],
  },
};
