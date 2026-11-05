import type { Pergunta } from "../../tipos";

// Q58 · Elementos da assertion SAML
export const q058: Pergunta = {
  numero: 58,
  modulo: "saml",
  metodo: "feynman",
  pt: {
    titulo: "Elementos da assertion SAML",
    pergunta:
      "O que é uma assertion SAML? Descreva seus elementos principais (Issuer, Subject, Conditions, AuthnStatement, AttributeStatement) e o que cada um afirma.",
    porqueEsteMetodo:
      "A assertion é um documento com várias partes, e cada parte responde a uma pergunta diferente sobre o usuário. Uma analogia com um papel que você já conhece organiza as partes antes de entrar no XML.",
    resposta30s:
      "Uma **assertion SAML** é uma afirmação **assinada pelo IdP** sobre um usuário. O **`Issuer`** diz quem a emitiu; o **`Subject`** diz de quem ela fala (`NameID`) e como foi entregue (`SubjectConfirmation`); as **`Conditions`** dizem quando e para qual SP ela vale; o **`AuthnStatement`** diz como e quando o usuário se autenticou; e o **`AttributeStatement`** carrega atributos como e-mail e grupos. O SP confia na **assinatura** e decide com base nesses campos.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense numa **carta de apresentação com firma reconhecida em cartório**. O cartório (o IdP) escreve: “eu, o cartório X, afirmo que esta pessoa esteve diante de mim hoje, às 10h, e provou quem é com documento e biometria; ela é gerente do financeiro; e esta carta serve só para ser entregue à empresa Z, até as 10h05”. A empresa Z não precisa conferir a pessoa de novo: olha o carimbo, a data e o destinatário e decide.",
        tecnico:
          "A assertion é um elemento XML `saml:Assertion`, com `ID`, `IssueInstant` e a assinatura do IdP (`ds:Signature`). Dentro dela: **`Issuer`** (o `entityID` do IdP); **`Subject`**, com o `NameID` (de quem se fala) e o `SubjectConfirmation` (como esta assertion é entregue: no método `bearer`, quem a apresentar ao `Recipient` certo, dentro do prazo, é aceito); **`Conditions`** (`NotBefore`, `NotOnOrAfter` e `AudienceRestriction`); **`AuthnStatement`** (`AuthnInstant`, `SessionIndex` e o `AuthnContextClassRef`, que informa o método de autenticação); e **`AttributeStatement`** (pares nome-valor que o IdP decidiu enviar). O SP valida a assinatura com o certificado do metadata e confere cada parte (veja Q62 e Q63).",
        limite:
          "Na carta, o portador ainda pode ser conferido pelo documento dele; numa assertion `bearer`, **quem a apresentar vale como o usuário**. Por isso ela tem validade curta, destinatário, uso único e viaja só por TLS. E a assertion **afirma, não autoriza**: diz quem é o usuário e o que o IdP sabe sobre ele, mas o que ele pode fazer no SP é decisão do SP.",
      },
      {
        tipo: "tabela",
        titulo: "O que cada parte afirma e o que o SP faz com ela",
        colunas: ["Elemento", "O que afirma", "O que o SP faz com ele"],
        linhas: [
          [
            "`Issuer`",
            "Quem emitiu: o `entityID` do IdP",
            "Compara com o IdP configurado (do metadata); emissor desconhecido é rejeitado",
          ],
          [
            "`Signature`",
            "Que o conteúdo é do IdP e não foi alterado",
            "Verifica com o certificado do metadata, sobre a assertion que vai consumir (veja Q61)",
          ],
          [
            "`Subject` e `NameID`",
            "De quem a assertion fala, num formato definido (persistent, e-mail…)",
            "Usa como identificador da conta, de preferência o estável (veja Q60)",
          ],
          [
            "`SubjectConfirmation`",
            "Que esta assertion foi entregue a este destino: método `bearer`, `Recipient`, `InResponseTo`, `NotOnOrAfter`",
            "Confere o `Recipient` com o seu ACS, o `InResponseTo` com o pedido e o prazo",
          ],
          [
            "`Conditions`",
            "Em que condições vale: janela (`NotBefore`, `NotOnOrAfter`) e `Audience`",
            "Rejeita fora da janela (com pequena tolerância de relógio) ou se o `Audience` não for o seu `entityID`",
          ],
          [
            "`AuthnStatement`",
            "Que o usuário se autenticou, quando (`AuthnInstant`), em qual sessão do IdP (`SessionIndex`) e como (`AuthnContextClassRef`)",
            "Confere se o método e a idade da autenticação bastam; guarda o `SessionIndex` para o logout (veja Q66)",
          ],
          [
            "`AttributeStatement`",
            "Atributos que o IdP resolveu enviar (e-mail, nome, grupos)",
            "Mapeia para perfil e papéis (veja Q60), sempre depois de validar a assinatura",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Uma assertion, resumida",
        legenda: "XML",
        codigo: `<saml:Assertion ID="_a75adf55" IssueInstant="2026-11-04T12:00:00Z" Version="2.0">
  <saml:Issuer>https://idp.example.com/metadata</saml:Issuer>
  <ds:Signature>...</ds:Signature>
  <saml:Subject>
    <saml:NameID Format="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent">a8f3c2</saml:NameID>
    <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
      <saml:SubjectConfirmationData Recipient="https://app.example.com/saml/acs"
          InResponseTo="_req123" NotOnOrAfter="2026-11-04T12:05:00Z"/>
    </saml:SubjectConfirmation>
  </saml:Subject>
  <saml:Conditions NotBefore="2026-11-04T11:59:30Z" NotOnOrAfter="2026-11-04T12:05:00Z">
    <saml:AudienceRestriction><saml:Audience>https://app.example.com/metadata</saml:Audience></saml:AudienceRestriction>
  </saml:Conditions>
  <saml:AuthnStatement AuthnInstant="2026-11-04T11:59:58Z" SessionIndex="_s9">
    <saml:AuthnContext>
      <saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef>
    </saml:AuthnContext>
  </saml:AuthnStatement>
  <saml:AttributeStatement>
    <saml:Attribute Name="groups"><saml:AttributeValue>financeiro</saml:AttributeValue></saml:Attribute>
  </saml:AttributeStatement>
</saml:Assertion>`,
        nota: "Valores de exemplo; a `ds:Signature` está abreviada (veja Q61 para a estrutura). Neste exemplo o contexto é senha sobre TLS: um login com segundo fator traria uma classe de contexto que o represente, e o URI varia entre IdPs.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Como a assertion “comprova” a identidade, e onde entra o MFA",
        texto:
          "A assertion **não prova a identidade por si**: quem prova é a **assinatura** de um IdP em que o SP já confia (certificado do metadata, veja Q64), mais o vínculo ao contexto da entrega (`Audience`, `Recipient`, `InResponseTo`, prazo). O SP confia no IdP, não na pessoa. O mesmo vale para o **MFA**: o SAML não executa o segundo fator, quem o faz é o IdP, e o `AuthnContextClassRef` do `AuthnStatement` informa o **método** usado. O SP pode pedir um nível no `AuthnRequest` (`RequestedAuthnContext`) e, de qualquer forma, deve **conferir** o contexto recebido antes de liberar uma ação sensível.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Uma assertion bearer é um documento ao portador",
        texto:
          "Quem tiver a assertion e acesso ao ACS dentro da janela de validade pode tentar usá-la. Por isso: TLS, validade curta, `Audience` e `Recipient` conferidos, uso único do `ID` (veja Q62) e, quando os atributos forem sensíveis, criptografia (veja Q61). E um atributo que não veio na assertion é um atributo que o SP não tem: ausência não é permissão.",
      },
    ],
    armadilhas: [
      "Ler `NameID` e atributos antes de validar a assinatura e as condições: o conteúdo de uma assertion não verificada é só texto de quem o enviou.",
      "Ignorar o `Audience`: uma assertion emitida para outro SP do mesmo IdP seria aceita.",
      "Assumir que a presença de um `AuthnStatement` significa MFA: ele só informa o método usado; o que conta é o `AuthnContextClassRef` e a política do IdP.",
      "Tratar os atributos como autorização final: grupos e papéis vêm do IdP, mas a decisão e o mapeamento são do SP.",
    ],
    autoteste: [
      {
        pergunta: "Quais elementos dizem quem emitiu, de quem se fala, por quanto tempo e para quem vale?",
        resposta:
          "`Issuer` (quem emitiu), `Subject` com `NameID` (de quem se fala), `Conditions` com `NotBefore` e `NotOnOrAfter` (por quanto tempo) e `AudienceRestriction` (para qual SP).",
      },
      {
        pergunta: "O que o `AuthnContextClassRef` informa e como isso se relaciona com MFA?",
        resposta:
          "Informa o método de autenticação usado. O IdP é quem faz o MFA; o `AuthnContextClassRef` comunica ao SP que tipo de autenticação ocorreu, e o SP deve conferi-lo (e pode pedir um nível no `AuthnRequest`).",
      },
    ],
  },
  en: {
    titulo: "SAML assertion elements",
    pergunta:
      "What is a SAML assertion? Describe its main elements (Issuer, Subject, Conditions, AuthnStatement, AttributeStatement) and what each one asserts.",
    porqueEsteMetodo:
      "The assertion is a document with several parts, and each part answers a different question about the user. An analogy with a paper you already know organizes the parts before you dive into the XML.",
    resposta30s:
      "A **SAML assertion** is a statement **signed by the IdP** about a user. The **`Issuer`** says who issued it; the **`Subject`** says whom it is about (`NameID`) and how it was delivered (`SubjectConfirmation`); the **`Conditions`** say when and for which SP it is valid; the **`AuthnStatement`** says how and when the user authenticated; and the **`AttributeStatement`** carries attributes such as e-mail and groups. The SP trusts the **signature** and decides based on these fields.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a **notarized letter of introduction**. The notary (the IdP) writes: “I, notary X, state that this person stood before me today at 10:00 and proved who they are with a document and biometrics; they are a finance manager; and this letter is only to be handed to company Z, until 10:05.” Company Z does not need to check the person again: it looks at the seal, the date and the addressee, and decides.",
        tecnico:
          "The assertion is an XML `saml:Assertion` element, with an `ID`, an `IssueInstant` and the IdP’s signature (`ds:Signature`). Inside it: **`Issuer`** (the IdP’s `entityID`); **`Subject`**, with the `NameID` (whom it is about) and the `SubjectConfirmation` (how this assertion is delivered: with the `bearer` method, whoever presents it to the right `Recipient`, within the deadline, is accepted); **`Conditions`** (`NotBefore`, `NotOnOrAfter` and `AudienceRestriction`); **`AuthnStatement`** (`AuthnInstant`, `SessionIndex` and the `AuthnContextClassRef`, which reports the authentication method); and **`AttributeStatement`** (name-value pairs the IdP chose to send). The SP validates the signature with the certificate from the metadata and checks each part (see Q62 and Q63).",
        limite:
          "With the letter, the bearer can still be checked against their ID; with a `bearer` assertion, **whoever presents it counts as the user**. That is why it has a short validity, an addressee, single use and travels only over TLS. And the assertion **asserts, it does not authorize**: it says who the user is and what the IdP knows about them, but what they may do in the SP is the SP’s decision.",
      },
      {
        tipo: "tabela",
        titulo: "What each part asserts and what the SP does with it",
        colunas: ["Element", "What it asserts", "What the SP does with it"],
        linhas: [
          [
            "`Issuer`",
            "Who issued it: the IdP’s `entityID`",
            "Compares with the configured IdP (from the metadata); an unknown issuer is rejected",
          ],
          [
            "`Signature`",
            "That the content comes from the IdP and was not altered",
            "Verifies with the certificate from the metadata, over the assertion it will consume (see Q61)",
          ],
          [
            "`Subject` and `NameID`",
            "Whom the assertion is about, in a defined format (persistent, e-mail…)",
            "Uses it as the account identifier, preferably the stable one (see Q60)",
          ],
          [
            "`SubjectConfirmation`",
            "That this assertion was delivered to this destination: `bearer` method, `Recipient`, `InResponseTo`, `NotOnOrAfter`",
            "Checks `Recipient` against its ACS, `InResponseTo` against the request and the deadline",
          ],
          [
            "`Conditions`",
            "Under which conditions it is valid: window (`NotBefore`, `NotOnOrAfter`) and `Audience`",
            "Rejects outside the window (with a small clock tolerance) or if `Audience` is not its `entityID`",
          ],
          [
            "`AuthnStatement`",
            "That the user authenticated, when (`AuthnInstant`), in which IdP session (`SessionIndex`) and how (`AuthnContextClassRef`)",
            "Checks whether the method and the age of the authentication are enough; keeps the `SessionIndex` for logout (see Q66)",
          ],
          [
            "`AttributeStatement`",
            "Attributes the IdP chose to send (e-mail, name, groups)",
            "Maps them to a profile and roles (see Q60), always after validating the signature",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "An assertion, abridged",
        legenda: "XML",
        codigo: `<saml:Assertion ID="_a75adf55" IssueInstant="2026-11-04T12:00:00Z" Version="2.0">
  <saml:Issuer>https://idp.example.com/metadata</saml:Issuer>
  <ds:Signature>...</ds:Signature>
  <saml:Subject>
    <saml:NameID Format="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent">a8f3c2</saml:NameID>
    <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
      <saml:SubjectConfirmationData Recipient="https://app.example.com/saml/acs"
          InResponseTo="_req123" NotOnOrAfter="2026-11-04T12:05:00Z"/>
    </saml:SubjectConfirmation>
  </saml:Subject>
  <saml:Conditions NotBefore="2026-11-04T11:59:30Z" NotOnOrAfter="2026-11-04T12:05:00Z">
    <saml:AudienceRestriction><saml:Audience>https://app.example.com/metadata</saml:Audience></saml:AudienceRestriction>
  </saml:Conditions>
  <saml:AuthnStatement AuthnInstant="2026-11-04T11:59:58Z" SessionIndex="_s9">
    <saml:AuthnContext>
      <saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef>
    </saml:AuthnContext>
  </saml:AuthnStatement>
  <saml:AttributeStatement>
    <saml:Attribute Name="groups"><saml:AttributeValue>financeiro</saml:AttributeValue></saml:Attribute>
  </saml:AttributeStatement>
</saml:Assertion>`,
        nota: "Sample values; the `ds:Signature` is abridged (see Q61 for its structure). Here the context is a password over TLS: a login with a second factor would carry a context class that represents it, and the URI varies between IdPs.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "How the assertion “proves” identity, and where MFA comes in",
        texto:
          "The assertion **does not prove identity by itself**: what proves it is the **signature** of an IdP the SP already trusts (certificate from the metadata, see Q64), plus the binding to the delivery context (`Audience`, `Recipient`, `InResponseTo`, deadline). The SP trusts the IdP, not the person. The same goes for **MFA**: SAML does not perform the second factor, the IdP does, and the `AuthnContextClassRef` in the `AuthnStatement` reports the **method** used. The SP can ask for a level in the `AuthnRequest` (`RequestedAuthnContext`) and, either way, should **check** the received context before allowing a sensitive action.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A bearer assertion is a bearer document",
        texto:
          "Whoever holds the assertion and can reach the ACS within the validity window can try to use it. Hence: TLS, short validity, `Audience` and `Recipient` checked, single use of the `ID` (see Q62) and, when attributes are sensitive, encryption (see Q61). And an attribute that did not come in the assertion is an attribute the SP does not have: absence is not permission.",
      },
    ],
    armadilhas: [
      "Reading `NameID` and attributes before validating the signature and conditions: the content of an unverified assertion is just text from whoever sent it.",
      "Ignoring `Audience`: an assertion issued for another SP of the same IdP would be accepted.",
      "Assuming that an `AuthnStatement` means MFA: it only reports the method used; what counts is the `AuthnContextClassRef` and the IdP’s policy.",
      "Treating attributes as the final authorization: groups and roles come from the IdP, but the decision and the mapping belong to the SP.",
    ],
    autoteste: [
      {
        pergunta: "Which elements say who issued it, whom it is about, for how long and for whom it is valid?",
        resposta:
          "`Issuer` (who issued it), `Subject` with `NameID` (whom it is about), `Conditions` with `NotBefore` and `NotOnOrAfter` (for how long) and `AudienceRestriction` (for which SP).",
      },
      {
        pergunta: "What does `AuthnContextClassRef` report and how does it relate to MFA?",
        resposta:
          "It reports the authentication method used. The IdP is the one performing MFA; `AuthnContextClassRef` tells the SP what kind of authentication happened, and the SP should check it (and may ask for a level in the `AuthnRequest`).",
      },
    ],
  },
};
