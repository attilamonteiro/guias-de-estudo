import type { Pergunta } from "../../tipos";

// Q65 · SAML × OpenID Connect
export const q065: Pergunta = {
  numero: 65,
  modulo: "saml",
  metodo: "compare",
  pt: {
    titulo: "SAML × OpenID Connect",
    pergunta:
      "Compare SAML e OpenID Connect para SSO. Como escolher entre os dois em um produto novo e quando é preciso suportar ambos?",
    porqueEsteMetodo:
      "Os dois resolvem o mesmo problema de login único com formatos, transportes e ecossistemas diferentes. Uma matriz separa o que é diferença real do que é aparência, e a regra de decisão responde à pergunta de entrevista: qual escolher e quando os dois.",
    resposta30s:
      "**SAML 2.0** usa **assertions em XML** trocadas pelo navegador e domina o SaaS corporativo e o legado; **OpenID Connect (OIDC)** é uma camada de identidade sobre o OAuth 2.0 que usa **JSON e JWT** e serve bem a SPAs, mobile e APIs. Em um produto novo, escolha **OIDC**; ofereça **SAML** quando o cliente corporativo ou o sistema legado exigir, e nesse caso mantenha **uma só lógica de sessão** por trás dos dois.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "SAML 2.0 e OpenID Connect lado a lado",
        colunas: ["Aspecto", "SAML 2.0", "OpenID Connect"],
        linhas: [
          [
            "Formato",
            "Assertion em XML, assinada com XML Signature",
            "ID token em JSON, no formato JWT (RFC 7519), assinado como JWS",
          ],
          [
            "Transporte",
            "Mensagens pelo navegador (bindings Redirect e POST); o SP recebe a assertion por POST",
            "Authorization code flow: redirect do navegador e troca do código por tokens num canal direto (endpoint de token), com PKCE",
          ],
          [
            "APIs, SPAs e mobile",
            "Pensado para navegador e aplicações web; ruim para apps nativos, SPAs e para chamar APIs",
            "Construído sobre OAuth 2.0: ID token para o login e access token para APIs; apps nativos e SPAs usam authorization code com PKCE",
          ],
          [
            "Descoberta e chaves",
            "Metadata em XML, trocado manualmente ou lido por URL; rotação de certificado é tarefa operacional",
            "Documento de descoberta (`/.well-known/openid-configuration`) e JWKS publicado; as chaves rotacionam com `kid`",
          ],
          [
            "Ecossistema",
            "Muito presente em SaaS corporativo, universidades, federações e sistemas legados; é o contrato de muitos clientes",
            "Padrão das aplicações novas, de provedores de nuvem e de login social; ainda há SaaS corporativo que só oferece SAML",
          ],
          [
            "Complexidade de segurança",
            "XML: canonicalização, signature wrapping, XXE; mais fácil errar à mão (veja Q61 e Q63)",
            "JWT: fixar o algoritmo e validar `iss`, `aud`, `exp` e `nonce`; mais simples, mas ainda exige validação rigorosa",
          ],
          [
            "Atributos e papéis",
            "`AttributeStatement` dentro da assertion",
            "Claims no ID token e no endpoint UserInfo",
          ],
          [
            "Logout",
            "Single Logout, frágil (veja Q66)",
            "Logout iniciado pela aplicação e logout por front-channel ou back-channel, cada um com suas limitações",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "**Produto novo, SPA, mobile ou API: OpenID Connect.** **SAML quando o cliente corporativo ou o sistema legado exige.** A decisão raramente é só técnica: depende do que o IdP do cliente e o fornecedor do SaaS suportam. Se você precisa dos dois, ponha uma **camada de identidade** (o seu IdP, um broker como o Keycloak, ou um serviço gerenciado) na frente: a aplicação fala um protocolo e o broker traduz o outro.",
      },
      {
        tipo: "passos",
        titulo: "Como suportar os dois sem duplicar a lógica",
        passos: [
          {
            titulo: "Normalize a identidade",
            texto:
              "Defina um modelo interno único: emissor, identificador estável (`sub` no OIDC; `NameID` persistent no SAML), e-mail, nome e grupos. Cada protocolo é um adaptador que preenche esse modelo.",
          },
          {
            titulo: "Um só caminho de sessão",
            texto:
              "Depois que o protocolo valida a autenticação, a criação da sessão, o mapeamento de papéis, o logout local e a auditoria são o mesmo código. Duas implementações divergem com o tempo.",
          },
          {
            titulo: "Vincule por emissor e identificador",
            texto:
              "A chave da conta é o par (emissor, identificador estável), nunca o e-mail. A mesma pessoa em dois IdPs são duas identidades, ligadas por um processo explícito.",
          },
          {
            titulo: "Teste cada protocolo e cada falha",
            texto:
              "O que protege cada um muda (`state` e `nonce` no OIDC; `InResponseTo` e `Audience` no SAML), assim como o logout e os erros. Cubra os dois com testes de falha, não só de sucesso.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "JWT não é protocolo, e “OpenID” hoje é OpenID Connect",
        texto:
          "Duas confusões comuns. **JWT × SAML** compara coisas de tipos diferentes: JWT é só um **formato de token** (RFC 7519); SAML é uma família de protocolos e perfis, mais o formato da assertion. O par comparável é a assertion SAML (XML) e o ID token do OpenID Connect (um JWT). Um JWT sozinho não define login nenhum; ele também serve de access token, que existe para chamar APIs e não para dizer quem o usuário é. Já **“OpenID”** hoje quer dizer **OpenID Connect**, a camada de identidade sobre o OAuth 2.0 (RFC 6749), definida na especificação OpenID Connect Core. O OpenID 2.0, anterior, é outro protocolo e está obsoleto.",
      },
    ],
    armadilhas: [
      "Tratar SAML e OIDC como intercambiáveis: logout, nomes de campos, vínculo de conta e proteções contra CSRF (`InResponseTo` e `state`) são diferentes.",
      "Duplicar a lógica de sessão e de papéis em cada protocolo: as regras divergem e o acesso fica inconsistente.",
      "Escolher SAML para uma aplicação nova só porque o público é corporativo: se o cliente aceita OIDC, é o caminho mais simples. Ofereça SAML quando um cliente exigir.",
      "Concluir que SAML está obsoleto: segue sendo o contrato de muitos clientes, e uma integração SAML bem feita (veja Q63) é segura.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre JWT e SAML?",
        resposta:
          "JWT é só um formato de token (JSON assinado). SAML é uma família de especificações (protocolos, bindings, perfis) com assertions em XML. A comparação justa é assertion SAML contra ID token JWT do OpenID Connect.",
      },
      {
        pergunta: "Quando é preciso dar suporte a ambos, e como evitar duplicar a lógica?",
        resposta:
          "Quando clientes corporativos exigem SAML e as aplicações novas usam OIDC. Normalize a identidade num modelo interno e mantenha um caminho único de sessão e papéis, com um adaptador por protocolo ou um broker na frente.",
      },
    ],
  },
  en: {
    titulo: "SAML vs OpenID Connect",
    pergunta:
      "Compare SAML and OpenID Connect for SSO. How do you choose between them in a new product, and when must you support both?",
    porqueEsteMetodo:
      "Both solve the same single sign-on problem with different formats, transports and ecosystems. A matrix separates real differences from appearances, and the decision rule answers the interview question: which to choose and when to have both.",
    resposta30s:
      "**SAML 2.0** uses **XML assertions** exchanged through the browser and dominates enterprise SaaS and legacy; **OpenID Connect (OIDC)** is an identity layer on top of OAuth 2.0 that uses **JSON and JWT** and suits SPAs, mobile and APIs well. In a new product, choose **OIDC**; offer **SAML** when the enterprise customer or the legacy system requires it, and in that case keep **a single session logic** behind both.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "SAML 2.0 and OpenID Connect side by side",
        colunas: ["Aspect", "SAML 2.0", "OpenID Connect"],
        linhas: [
          [
            "Format",
            "XML assertion, signed with XML Signature",
            "ID token in JSON, in the JWT format (RFC 7519), signed as a JWS",
          ],
          [
            "Transport",
            "Messages through the browser (Redirect and POST bindings); the SP receives the assertion by POST",
            "Authorization code flow: browser redirect and exchange of the code for tokens over a direct channel (token endpoint), with PKCE",
          ],
          [
            "APIs, SPAs and mobile",
            "Designed for browsers and web applications; poor for native apps, SPAs and calling APIs",
            "Built on OAuth 2.0: ID token for login and access token for APIs; native apps and SPAs use authorization code with PKCE",
          ],
          [
            "Discovery and keys",
            "XML metadata, exchanged manually or read by URL; certificate rotation is an operational task",
            "Discovery document (`/.well-known/openid-configuration`) and a published JWKS; keys rotate using `kid`",
          ],
          [
            "Ecosystem",
            "Very present in enterprise SaaS, universities, federations and legacy systems; it is many customers’ contract",
            "The default for new applications, cloud providers and social login; some enterprise SaaS still offers only SAML",
          ],
          [
            "Security complexity",
            "XML: canonicalization, signature wrapping, XXE; easier to get wrong by hand (see Q61 and Q63)",
            "JWT: pin the algorithm and validate `iss`, `aud`, `exp` and `nonce`; simpler, but still demands rigorous validation",
          ],
          [
            "Attributes and roles",
            "`AttributeStatement` inside the assertion",
            "Claims in the ID token and in the UserInfo endpoint",
          ],
          [
            "Logout",
            "Single Logout, fragile (see Q66)",
            "Application-initiated logout and front-channel or back-channel logout, each with its own limitations",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "**New product, SPA, mobile or API: OpenID Connect.** **SAML when the enterprise customer or the legacy system requires it.** The decision is rarely only technical: it depends on what the customer’s IdP and the SaaS vendor support. If you need both, put an **identity layer** (your IdP, a broker such as Keycloak, or a managed service) in front: the application speaks one protocol and the broker translates the other.",
      },
      {
        tipo: "passos",
        titulo: "How to support both without duplicating logic",
        passos: [
          {
            titulo: "Normalize the identity",
            texto:
              "Define a single internal model: issuer, stable identifier (`sub` in OIDC; persistent `NameID` in SAML), e-mail, name and groups. Each protocol is an adapter that fills that model.",
          },
          {
            titulo: "One session path",
            texto:
              "Once the protocol validates the authentication, session creation, role mapping, local logout and auditing are the same code. Two implementations drift apart over time.",
          },
          {
            titulo: "Link by issuer and identifier",
            texto:
              "The account key is the pair (issuer, stable identifier), never the e-mail. The same person at two IdPs is two identities, linked through an explicit process.",
          },
          {
            titulo: "Test each protocol and each failure",
            texto:
              "What protects each one differs (`state` and `nonce` in OIDC; `InResponseTo` and `Audience` in SAML), and so do logout and errors. Cover both with failure tests, not only success.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "JWT is not a protocol, and “OpenID” today means OpenID Connect",
        texto:
          "Two common confusions. **JWT vs SAML** compares things of different kinds: JWT is only a **token format** (RFC 7519); SAML is a family of protocols and profiles, plus the assertion format. The comparable pair is the SAML assertion (XML) and the OpenID Connect ID token (a JWT). A JWT alone defines no login at all; it also serves as an access token, which exists to call APIs and not to say who the user is. And **“OpenID”** today means **OpenID Connect**, the identity layer on top of OAuth 2.0 (RFC 6749), defined in the OpenID Connect Core specification. The earlier OpenID 2.0 is a different protocol and is obsolete.",
      },
    ],
    armadilhas: [
      "Treating SAML and OIDC as interchangeable: logout, field names, account linking and CSRF protections (`InResponseTo` and `state`) are different.",
      "Duplicating session and role logic in each protocol: the rules drift apart and access becomes inconsistent.",
      "Choosing SAML for a new application just because the audience is corporate: if the customer accepts OIDC, it is the simplest path. Offer SAML when a customer requires it.",
      "Concluding that SAML is obsolete: it remains many customers’ contract, and a well-done SAML integration (see Q63) is secure.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between JWT and SAML?",
        resposta:
          "JWT is only a token format (signed JSON). SAML is a family of specifications (protocols, bindings, profiles) with XML assertions. The fair comparison is a SAML assertion against an OpenID Connect JWT ID token.",
      },
      {
        pergunta: "When must you support both, and how do you avoid duplicating logic?",
        resposta:
          "When enterprise customers require SAML and new applications use OIDC. Normalize identity into an internal model and keep a single path for sessions and roles, with one adapter per protocol or a broker in front.",
      },
    ],
  },
};
