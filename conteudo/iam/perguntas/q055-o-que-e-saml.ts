import type { Pergunta } from "../../tipos";

// Q55 · O que é SAML
export const q055: Pergunta = {
  numero: 55,
  modulo: "saml",
  metodo: "feynman",
  pt: {
    titulo: "O que é SAML",
    pergunta:
      "O que é SAML, que problema resolve e quais são seus atores (usuário, IdP e SP)? Por que ele ainda é tão usado em ambientes corporativos?",
    porqueEsteMetodo:
      "SAML se entende melhor por uma imagem familiar: um documento emitido por uma autoridade e aceito por outra. A analogia dá a ideia, o fluxo mostra o mecanismo e o ponto em que a imagem falha explica por que o SP precisa validar tudo o que recebe.",
    resposta30s:
      "O **SAML 2.0** é um padrão de **SSO federado** baseado em XML: o **IdP** autentica o **usuário** e entrega ao **SP** uma **asserção assinada** (quem é, quando e como se autenticou, atributos) pelo navegador, sem que o SP veja a senha. Ele resolve o problema de cada aplicação manter contas e senhas próprias, deixando acesso, MFA e desligamento num ponto central. Continua forte no meio corporativo porque nasceu para SSO web entre organizações, está em quase todo IdP e aplicação empresarial, e clientes enterprise o exigem dos fornecedores SaaS.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense num passaporte. Um país (o IdP) verifica quem você é, com documentos e uma entrevista, e emite um passaporte assinado e com prazo de validade. Outro país (o SP) não conhece você e não refaz a verificação: confia no país emissor, por um acordo prévio, confere o selo e a validade e deixa você entrar. Você nunca entrega ao segundo país os documentos originais que mostrou ao primeiro.",
        tecnico:
          "O **SAML 2.0** (padrão da OASIS) é um protocolo de **SSO federado** baseado em XML. O **usuário** quer acessar o **SP** (Service Provider), a aplicação; o **IdP** (Identity Provider) autentica a pessoa e emite uma **asserção** assinada: quem é (`Subject` e `NameID`), para qual SP vale (`Audience`), por quanto tempo (`NotBefore` e `NotOnOrAfter`), como e quando se autenticou e os atributos (e-mail, grupos). A asserção viaja dentro de uma `Response` pelo **navegador**, num formulário `POST` enviado automaticamente ao endereço do SP (o ACS, Assertion Consumer Service). A confiança vem dos **metadados** XML trocados antes: identificadores (`entityID`), endpoints e certificados de cada lado. O SP valida a assinatura com o certificado dos metadados e cria a sessão local.",
        limite:
          "Aqui o passaporte falha em dois pontos. O **navegador é o carteiro**: a asserção passa pelas mãos do usuário (e de qualquer malware que esteja nele), e SP e IdP muitas vezes nem se falam diretamente, então o SP precisa validar tudo o que chega: assinatura, destinatário, validade e a que pedido a resposta se refere. E a asserção não é um documento de longa duração: é emitida **a cada login**, endereçada a **um SP** e vale por **minutos**.",
      },
      {
        tipo: "tabela",
        titulo: "As peças do SAML",
        colunas: ["Peça", "O que é", "Exemplo"],
        linhas: [
          ["Usuário (principal)", "A pessoa que quer acessar a aplicação", "Uma funcionária abrindo o sistema de RH"],
          [
            "IdP (Identity Provider)",
            "Quem autentica a pessoa e emite a asserção",
            "O provedor de identidade corporativo, com SSO e MFA",
          ],
          ["SP (Service Provider)", "A aplicação que consome a asserção e cria a sessão", "Um SaaS de RH ou de CRM"],
          [
            "Asserção",
            "O documento XML assinado: quem é a pessoa, para quem vale, por quanto tempo e quais atributos",
            "Uma `Assertion` com `Subject`, `Conditions` e `AttributeStatement`",
          ],
          [
            "Protocolo",
            "As mensagens de pedido e resposta",
            "`AuthnRequest` (do SP ao IdP) e `Response` (do IdP ao SP)",
          ],
          [
            "Binding",
            "Como a mensagem é transportada em HTTP",
            "HTTP Redirect (pedido na URL) e HTTP POST (resposta num formulário)",
          ],
          ["Perfil", "A combinação de asserções, protocolo e bindings para um caso de uso", "Web Browser SSO"],
          [
            "Metadados",
            "O XML que descreve cada lado e estabelece a confiança",
            "`entityID`, endereços de SSO e de ACS, certificado de assinatura",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Login iniciado pelo SP (SP-initiated)",
        etapas: [
          "A pessoa abre o SP e escolhe entrar com a conta da empresa",
          "O SP cria um `AuthnRequest` (com um ID único e o endereço de retorno) e redireciona o navegador ao endereço de SSO do IdP",
          "O IdP verifica se já há sessão; se não há, autentica a pessoa (senha, MFA, certificado…)",
          "O IdP monta a `Response` com a asserção (quem, para qual SP, validade, atributos) e a assina",
          "O navegador entrega a `Response` ao ACS do SP, por um formulário `POST` enviado automaticamente",
          "O SP valida a assinatura com o certificado dos metadados, o `Issuer`, a `Audience`, o `Recipient`, a validade, o `InResponseTo` e se a asserção já foi usada; só então cria a sessão",
          "Se qualquer verificação falha, o SP recusa o login e não cria sessão",
        ],
        nota: "No login iniciado pelo IdP (IdP-initiated) a pessoa já começa no portal da empresa e a `Response` chega sem um `AuthnRequest` anterior. É prático, mas deixa o SP sem o `InResponseTo` para conferir, e por isso muitos SPs o limitam ou o desativam.",
      },
      {
        tipo: "codigo",
        titulo: "Uma asserção SAML (simplificada)",
        legenda: "XML",
        codigo:
          '<saml:Assertion ID="_a75adf55" IssueInstant="2026-11-04T12:00:00Z" Version="2.0">\n  <saml:Issuer>https://idp.example.com/metadata</saml:Issuer>\n  <ds:Signature>...</ds:Signature>\n  <saml:Subject>\n    <saml:NameID Format="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent">8f3c1a2b</saml:NameID>\n    <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">\n      <saml:SubjectConfirmationData Recipient="https://app.example.com/saml/acs"\n          InResponseTo="_req123" NotOnOrAfter="2026-11-04T12:05:00Z"/>\n    </saml:SubjectConfirmation>\n  </saml:Subject>\n  <saml:Conditions NotBefore="2026-11-04T11:59:30Z" NotOnOrAfter="2026-11-04T12:05:00Z">\n    <saml:AudienceRestriction>\n      <saml:Audience>https://app.example.com/saml</saml:Audience>\n    </saml:AudienceRestriction>\n  </saml:Conditions>\n  <saml:AuthnStatement AuthnInstant="2026-11-04T11:59:58Z"/>\n  <saml:AttributeStatement>\n    <saml:Attribute Name="email"><saml:AttributeValue>maria@example.com</saml:AttributeValue></saml:Attribute>\n  </saml:AttributeStatement>\n</saml:Assertion>',
        nota: "Trecho simplificado: namespaces, a assinatura e o `AuthnContext` foram omitidos. O SP confere `Recipient`, `InResponseTo`, a janela de validade e a `Audience`, além da assinatura.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Por que o SAML ainda domina o SSO corporativo, e o que ele protege",
        texto:
          "Quatro razões: **nasceu para isso** (SSO web entre organizações, adotado cedo por empresas, governo e educação); **base instalada** (milhares de aplicações já integradas, e trocar o protocolo custa caro sem ganho de negócio); **exigência do cliente** (empresas compradoras pedem SSO por SAML aos fornecedores de SaaS); e **maturidade** (asserções ricas em atributos, assinatura e cifra da asserção, metadados e anos de suporte). Para a segurança, o ganho é o **controle central**: política de senha e MFA, bloqueio e desligamento de pessoas num só lugar, o SaaS sem guardar senhas e um registro de acessos no IdP. O reverso é que o IdP vira ponto crítico e um SP que valida mal a asserção abre uma porta. Em projetos novos o OIDC costuma ser a escolha, mas um produto B2B ainda precisa falar os dois.",
      },
    ],
    armadilhas: [
      "Confundir SAML com OAuth ou OIDC: o SAML autentica e entrega atributos a aplicações web; não foi feito para autorizar chamadas de API nem emite access tokens.",
      "Achar que “usa SAML” significa “é seguro”: a segurança depende de o SP validar a assinatura (com o certificado dos metadados), a `Audience`, o `Recipient`, a validade, o `InResponseTo` e o reuso da asserção. XML mal tratado é fonte clássica de falhas.",
      "Tratar os metadados como configuração de uma vez só: o certificado de assinatura do IdP vence e é rotacionado, e sem plano de atualização o SSO inteiro quebra.",
      "Imaginar que a senha viaja para o SP: ela fica no IdP; o SP só recebe a asserção.",
    ],
    autoteste: [
      {
        pergunta: "Quem são os três atores do SAML e o que cada um faz?",
        resposta:
          "O usuário (principal) quer acessar a aplicação. O IdP autentica o usuário e emite a asserção assinada. O SP é a aplicação, que valida a asserção e cria a sessão local.",
      },
      {
        pergunta: "Por que o SP precisa validar a asserção, se ela vem “do IdP”?",
        resposta:
          "Porque ela chega pelo navegador, que o atacante pode controlar. Só a assinatura (com o certificado dos metadados), a `Audience`, o `Recipient`, a validade e o `InResponseTo` provam que a asserção é legítima, destinada a este SP, recente e resposta a um pedido seu.",
      },
    ],
  },
  en: {
    titulo: "What SAML is",
    pergunta:
      "What is SAML, what problem does it solve, and who are its actors (user, IdP and SP)? Why is it still so widely used in enterprise environments?",
    porqueEsteMetodo:
      "SAML is easier to grasp through a familiar image: a document issued by one authority and accepted by another. The analogy gives the idea, the flow shows the mechanism and the point where the image breaks explains why the SP must validate everything it receives.",
    resposta30s:
      "**SAML 2.0** is an XML-based **federated SSO** standard: the **IdP** authenticates the **user** and hands the **SP** a **signed assertion** (who they are, when and how they authenticated, attributes) through the browser, without the SP ever seeing the password. It solves the problem of every application keeping its own accounts and passwords, leaving access, MFA and offboarding in one central place. It stays strong in the enterprise because it was born for web SSO between organizations, is in nearly every IdP and enterprise application, and enterprise customers demand it from SaaS vendors.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a passport. One country (the IdP) verifies who you are, with documents and an interview, and issues a signed passport with an expiry date. Another country (the SP) does not know you and does not redo the verification: it trusts the issuing country, through a prior agreement, checks the seal and the validity and lets you in. You never hand the second country the original documents you showed the first.",
        tecnico:
          "**SAML 2.0** (an OASIS standard) is an XML-based **federated SSO** protocol. The **user** wants to reach the **SP** (Service Provider), the application; the **IdP** (Identity Provider) authenticates the person and issues a signed **assertion**: who they are (`Subject` and `NameID`), which SP it is valid for (`Audience`), for how long (`NotBefore` and `NotOnOrAfter`), how and when they authenticated and the attributes (email, groups). The assertion travels inside a `Response` through the **browser**, in an automatically submitted `POST` form to the SP’s address (the ACS, Assertion Consumer Service). Trust comes from the XML **metadata** exchanged beforehand: identifiers (`entityID`), endpoints and each side’s certificates. The SP validates the signature with the certificate from the metadata and creates the local session.",
        limite:
          "Here the passport breaks down in two places. The **browser is the mail carrier**: the assertion passes through the user’s hands (and any malware on their machine), and SP and IdP often never talk to each other directly, so the SP must validate everything that arrives: signature, recipient, validity and which request the response refers to. And the assertion is not a long-lived document: it is issued **at every login**, addressed to **one SP**, and valid for **minutes**.",
      },
      {
        tipo: "tabela",
        titulo: "The pieces of SAML",
        colunas: ["Piece", "What it is", "Example"],
        linhas: [
          ["User (principal)", "The person who wants to reach the application", "An employee opening the HR system"],
          [
            "IdP (Identity Provider)",
            "Who authenticates the person and issues the assertion",
            "The corporate identity provider, with SSO and MFA",
          ],
          [
            "SP (Service Provider)",
            "The application that consumes the assertion and creates the session",
            "An HR or CRM SaaS",
          ],
          [
            "Assertion",
            "The signed XML document: who the person is, who it is valid for, for how long and which attributes",
            "An `Assertion` with `Subject`, `Conditions` and `AttributeStatement`",
          ],
          ["Protocol", "The request and response messages", "`AuthnRequest` (SP to IdP) and `Response` (IdP to SP)"],
          [
            "Binding",
            "How the message is carried over HTTP",
            "HTTP Redirect (request in the URL) and HTTP POST (response in a form)",
          ],
          ["Profile", "The combination of assertions, protocol and bindings for a use case", "Web Browser SSO"],
          [
            "Metadata",
            "The XML that describes each side and establishes trust",
            "`entityID`, SSO and ACS addresses, signing certificate",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "SP-initiated login",
        etapas: [
          "The person opens the SP and chooses to sign in with the company account",
          "The SP creates an `AuthnRequest` (with a unique ID and the return address) and redirects the browser to the IdP’s SSO address",
          "The IdP checks whether there is already a session; if not, it authenticates the person (password, MFA, certificate…)",
          "The IdP builds the `Response` with the assertion (who, for which SP, validity, attributes) and signs it",
          "The browser delivers the `Response` to the SP’s ACS, through an automatically submitted `POST` form",
          "The SP validates the signature with the certificate from the metadata, the `Issuer`, the `Audience`, the `Recipient`, the validity, the `InResponseTo` and whether the assertion was already used; only then does it create the session",
          "If any check fails, the SP rejects the login and creates no session",
        ],
        nota: "In IdP-initiated login the person starts at the company portal and the `Response` arrives without a prior `AuthnRequest`. It is convenient, but it leaves the SP with no `InResponseTo` to check, which is why many SPs restrict or disable it.",
      },
      {
        tipo: "codigo",
        titulo: "A SAML assertion (simplified)",
        legenda: "XML",
        codigo:
          '<saml:Assertion ID="_a75adf55" IssueInstant="2026-11-04T12:00:00Z" Version="2.0">\n  <saml:Issuer>https://idp.example.com/metadata</saml:Issuer>\n  <ds:Signature>...</ds:Signature>\n  <saml:Subject>\n    <saml:NameID Format="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent">8f3c1a2b</saml:NameID>\n    <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">\n      <saml:SubjectConfirmationData Recipient="https://app.example.com/saml/acs"\n          InResponseTo="_req123" NotOnOrAfter="2026-11-04T12:05:00Z"/>\n    </saml:SubjectConfirmation>\n  </saml:Subject>\n  <saml:Conditions NotBefore="2026-11-04T11:59:30Z" NotOnOrAfter="2026-11-04T12:05:00Z">\n    <saml:AudienceRestriction>\n      <saml:Audience>https://app.example.com/saml</saml:Audience>\n    </saml:AudienceRestriction>\n  </saml:Conditions>\n  <saml:AuthnStatement AuthnInstant="2026-11-04T11:59:58Z"/>\n  <saml:AttributeStatement>\n    <saml:Attribute Name="email"><saml:AttributeValue>maria@example.com</saml:AttributeValue></saml:Attribute>\n  </saml:AttributeStatement>\n</saml:Assertion>',
        nota: "Simplified excerpt: namespaces, the signature and the `AuthnContext` were left out. The SP checks `Recipient`, `InResponseTo`, the validity window and the `Audience`, besides the signature.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Why SAML still dominates enterprise SSO, and what it protects",
        texto:
          "Four reasons: **it was born for this** (web SSO between organizations, adopted early by companies, government and education); **installed base** (thousands of applications already integrated, and changing the protocol is expensive with no business gain); **customer demand** (buying companies ask SaaS vendors for SAML SSO); and **maturity** (assertions rich in attributes, assertion signing and encryption, metadata and years of product support). For security, the gain is **central control**: password and MFA policy, blocking and offboarding people in one place, the SaaS holding no passwords and an access record at the IdP. The flip side is that the IdP becomes a critical point and an SP that validates the assertion badly opens a door. In new projects OIDC is usually the choice, but a B2B product still has to speak both.",
      },
    ],
    armadilhas: [
      "Confusing SAML with OAuth or OIDC: SAML authenticates and delivers attributes to web applications; it was not built to authorize API calls and it issues no access tokens.",
      "Thinking “it uses SAML” means “it is secure”: security depends on the SP validating the signature (with the certificate from the metadata), the `Audience`, the `Recipient`, the validity, the `InResponseTo` and reuse of the assertion. Badly handled XML is a classic source of flaws.",
      "Treating the metadata as one-time configuration: the IdP’s signing certificate expires and is rotated, and without an update plan the whole SSO breaks.",
      "Imagining that the password travels to the SP: it stays at the IdP; the SP only receives the assertion.",
    ],
    autoteste: [
      {
        pergunta: "Who are the three SAML actors and what does each one do?",
        resposta:
          "The user (principal) wants to reach the application. The IdP authenticates the user and issues the signed assertion. The SP is the application, which validates the assertion and creates the local session.",
      },
      {
        pergunta: "Why must the SP validate the assertion if it comes “from the IdP”?",
        resposta:
          "Because it arrives through the browser, which an attacker may control. Only the signature (with the certificate from the metadata), the `Audience`, the `Recipient`, the validity and the `InResponseTo` prove the assertion is legitimate, meant for this SP, recent and an answer to a request of yours.",
      },
    ],
  },
};
