import type { Pergunta } from "../../tipos";

// Q67 · Ataques típicos ao SAML
export const q067: Pergunta = {
  numero: 67,
  modulo: "saml",
  metodo: "threat",
  pt: {
    titulo: "Ataques típicos ao SAML",
    pergunta:
      "Quais são os ataques típicos contra implementações SAML (XML Signature Wrapping, replay, XXE, confusão de assinatura) e como cada defesa quebra a causa?",
    porqueEsteMetodo:
      "Cada ataque ao SAML explora uma suposição errada do código que processa a resposta. Os pares ataque → defesa mostram a suposição e a regra que a corrige, que é o que a pergunta pede com “quebra a causa”.",
    resposta30s:
      "Quase todo ataque ao SAML nasce de **confiar em algo antes de provar que foi assinado, ou de ler algo diferente do que foi assinado**: **XML Signature Wrapping** (a assinatura cobre um elemento e o código lê outro), assinatura ausente ou verificada com a chave que veio na própria mensagem, **comentário no NameID**, **replay** de uma assertion capturada e **XXE** no parser. As defesas atacam a causa: usar **somente os dados do elemento que a assinatura cobre**, **exigir** a assinatura com o certificado do metadata, **desabilitar DTD**, aceitar cada assertion **uma vez** e só para você (`Audience`, `Recipient`, validade) e usar uma biblioteca mantida, testada com respostas adulteradas.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ataque e causa → defesa que quebra a causa",
        rotuloOrigem: "Ataque (e por que funciona)",
        rotuloDestino: "Defesa (e a causa que ela quebra)",
        pares: [
          {
            origem:
              "**XML Signature Wrapping (XSW)**: a `Reference` da assinatura aponta para um `ID` e é válida para aquele elemento, mas o atacante acrescenta ou move elementos, e o código lê a assertion de outro lugar (por exemplo, a primeira que encontra por XPath). Funciona porque **quem verifica a assinatura e quem lê os dados não olham o mesmo nó**.",
            destino:
              "**Ler os dados somente do elemento que a assinatura comprovadamente cobre** (o nó devolvido pela validação, nunca uma nova busca no documento), exigir `ID` único, **recusar mais de uma assertion** quando só se espera uma e validar o XML contra o esquema. Quebra a causa: verificação e leitura passam a tratar do mesmo nó.",
          },
          {
            origem:
              "**Remoção da assinatura**: o atacante apaga o elemento `Signature` e altera a assertion. Funciona quando o código só valida a assinatura **se ela existir**.",
            destino:
              "**Exigir a assinatura** (na assertion, ou na resposta sabendo exatamente que dados você lê dela) e falhar fechado quando ela faltar. Declare isso no metadata do SP (`WantAssertionsSigned`) e teste uma resposta sem assinatura. Quebra a causa: a ausência deixa de ser um caminho válido.",
          },
          {
            origem:
              "**Confusão de assinatura**: a mensagem traz o próprio certificado em `KeyInfo` e o código verifica com ele; ou aceita algoritmos fracos ou transformações perigosas; ou aceita uma assinatura válida de quem não é o IdP configurado. O atacante assina com a própria chave e a verificação passa.",
            destino:
              "**Confiar só no certificado do metadata do IdP**, obtido por canal confiável, e ignorar chaves embutidas na mensagem. Conferir o `Issuer`, permitir só algoritmos e transformações de uma lista (assinatura “enveloped” e canonicalização exclusiva) e recusar `XSLT` nas transformações. Quebra a causa: a confiança vem de fora da mensagem.",
          },
          {
            origem:
              "**Comentário no NameID**: uma conta legítima do atacante, com identificador `admin@empresa.com<!---->.atacante.com`, recebe uma assertion corretamente assinada, mas alguns parsers devolvem só o primeiro nó de texto (`admin@empresa.com`) e o atacante entra como outra pessoa. Funciona porque **o texto assinado e o texto lido são diferentes**.",
            destino:
              "**Ler o conteúdo textual completo** (todos os nós de texto) ou recusar `NameID` com comentários ou elementos filhos, **atualizar a biblioteca** e não usar o e-mail como chave de conta: amarre a conta ao par `Issuer` e `NameID` persistente (veja Q60 e Q52). Quebra a causa: a divergência de leitura some, e a chave deixa de ser um texto manipulável.",
          },
          {
            origem:
              "**Replay de assertion**: o atacante captura uma resposta válida (log, proxy, histórico do navegador, máquina comprometida) e a reenvia ao SP, ou apresenta a um SP uma assertion emitida para outro. É o mesmo conceito de “replay de token”: reutilizar um token válido que foi capturado. Funciona porque a assinatura continua válida; ela prova a origem, não que **esta apresentação** é a primeira e é destinada a **este** SP.",
            destino:
              "**Uso único e escopo**: guardar o `ID` da assertion até o `NotOnOrAfter` e recusar repetição, conferir a validade com pouca folga de relógio, `InResponseTo` igual ao `AuthnRequest` que você emitiu, `Audience` igual ao seu entity ID e `Recipient`/`Destination` iguais ao seu ACS, tudo sobre HTTPS (veja Q62). Quebra a causa: a assertion passa a valer uma vez, para um destinatário, por pouco tempo.",
          },
          {
            origem:
              "**XXE e ataques ao parser**: a resposta é XML vindo de fora, e o parser lê a `DOCTYPE` antes de qualquer assinatura ser verificada. Entidades externas leem arquivos locais ou fazem o servidor requisitar URLs internas (SSRF), e entidades aninhadas esgotam a memória. Funciona porque **o parsing vem antes da autenticidade**: a assinatura não protege o parser.",
            destino:
              "**Desabilitar DTD e entidades externas de forma incondicional** (no .NET, `DtdProcessing.Prohibit` e sem resolvedor de entidades), limitar tamanho e profundidade do documento e **só então** validar a assinatura. Quebra a causa: o parser nunca resolve nada vindo de fora, nem de uma mensagem ainda não autenticada.",
          },
          {
            origem:
              "**Roubo da chave de assinatura do IdP** (“Golden SAML”): quem obtém a chave privada forja assertions de qualquer usuário para qualquer SP que confie nesse IdP, sem passar pelo IdP. Funciona porque o SP só consegue verificar a chave, e não que a pessoa se autenticou de fato.",
            destino:
              "**Proteger e monitorar a chave** (HSM ou cofre, acesso restrito aos servidores do IdP), cruzar os logins do SP com os registros de autenticação do IdP (login sem autenticação correspondente é alarme) e **trocar o certificado** diante de suspeita (veja Q64). Reduz o dano; o SP não tem defesa contra uma chave legítima roubada.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "XSW em miniatura: a assinatura vale, a leitura é outra",
        legenda: "XML",
        codigo: `<samlp:Response>
  <saml:Assertion ID="_forjada">          <!-- sem assinatura; o código ingênuo lê esta -->
    <saml:Subject>
      <saml:NameID>admin@empresa.com</saml:NameID>
    </saml:Subject>
  </saml:Assertion>
  <saml:Assertion ID="_original">         <!-- a assinatura válida cobre só esta -->
    <ds:Signature>
      <ds:SignedInfo>
        <ds:Reference URI="#_original"/>
      </ds:SignedInfo>
    </ds:Signature>
    <saml:Subject>
      <saml:NameID>ana@empresa.com</saml:NameID>
    </saml:Subject>
  </saml:Assertion>
</samlp:Response>`,
        nota: "Versão simplificada (namespaces e elementos obrigatórios omitidos). A defesa é usar o nó que a validação confirmou, e não procurar `Assertion` de novo no documento.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A regra que quebra quase todas as causas",
        texto:
          "**Só use o que foi provado, e use exatamente o que foi provado.** Prove a origem com o certificado do metadata, use os dados do nó que essa assinatura cobre e prove que a apresentação é nova e destinada a você (`InResponseTo`, `Audience`, `Recipient`, validade, uso único). O risco real está na implementação (XML, assinatura, configuração) e na chave do IdP, mais do que na matemática do protocolo. Depois do SSO, o que mais pesa é o roubo da sessão (veja Q130 e Q97).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não escreva isso à mão",
        texto:
          "Validar XML Signature (canonicalização, referências, transformações) por conta própria é a receita das falhas acima. Use biblioteca ou produto mantidos e **mantenha-os atualizados**: as correções de XSW, de comentário no `NameID` e de XXE vieram em bibliotecas populares. Quando a escolha é sua e o parceiro suporta, o OpenID Connect evita esta classe de problemas de XML, mas tem os seus próprios (veja Q65 e Q132).",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Teste como o atacante",
        texto:
          "Monte uma bateria de respostas adulteradas e exija que **todas** sejam recusadas: sem assinatura, assinada por outra chave, `NameID` alterado depois de assinar, duas assertions, assertion expirada, assertion reenviada, `Audience` ou `Recipient` de outro SP, documento com `DOCTYPE` e `NameID` com comentário. Rode a bateria a cada atualização da biblioteca. Para o roteiro de validação de uma resposta, veja Q63; para depurar falhas, Q145.",
      },
    ],
    armadilhas: [
      "Validar a assinatura e depois buscar a assertion com outra consulta XPath: a verificação passa e os dados vêm de um nó não assinado.",
      "Aceitar resposta sem assinatura “porque o IdP de desenvolvimento não assina”, ou verificar com o certificado que vem dentro da própria mensagem.",
      "Usar o e-mail do `NameID` como chave única de conta: é um texto controlável e reutilizável; use o identificador persistente do IdP.",
      "Habilitar DTD “por compatibilidade”, ou tratar o replay só com a validade da assertion, sem guardar os `ID` já usados.",
    ],
    autoteste: [
      {
        pergunta: "Por que o XML Signature Wrapping funciona mesmo com a assinatura válida, e qual é a defesa?",
        resposta:
          "Porque a assinatura prova a integridade do elemento que ela referencia, e o código lê os dados de outro lugar do documento. A defesa é ler somente o nó que a validação confirmou, exigir `ID` único e recusar assertions extras.",
      },
      {
        pergunta: "Por que a assinatura não protege contra XXE?",
        resposta:
          "Porque o parser lê o documento antes de a assinatura ser verificada, então uma mensagem ainda não autenticada já pode disparar a resolução de entidades. A defesa é desabilitar DTD e entidades externas no parser, de forma incondicional.",
      },
    ],
  },
  en: {
    titulo: "Typical SAML attacks",
    pergunta:
      "What are the typical attacks against SAML implementations (XML Signature Wrapping, replay, XXE, signature confusion), and how does each defense break the cause?",
    porqueEsteMetodo:
      "Each attack on SAML exploits a wrong assumption in the code that processes the response. The attack → defense pairs show the assumption and the rule that fixes it, which is what “break the cause” asks for.",
    resposta30s:
      "Almost every SAML attack comes from **trusting something before proving it was signed, or reading something other than what was signed**: **XML Signature Wrapping** (the signature covers one element and the code reads another), a missing signature or one verified with the key that came inside the message, a **comment in the NameID**, **replay** of a captured assertion and **XXE** in the parser. The defenses attack the cause: use **only the data of the element the signature covers**, **require** the signature with the certificate from the metadata, **disable DTD**, accept each assertion **once** and only for you (`Audience`, `Recipient`, validity) and use a maintained library, tested with tampered responses.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Attack and cause → defense that breaks the cause",
        rotuloOrigem: "Attack (and why it works)",
        rotuloDestino: "Defense (and the cause it breaks)",
        pares: [
          {
            origem:
              "**XML Signature Wrapping (XSW)**: the signature’s `Reference` points to an `ID` and is valid for that element, but the attacker adds or moves elements and the code reads the assertion from somewhere else (for example, the first one it finds by XPath). It works because **whoever verifies the signature and whoever reads the data are not looking at the same node**.",
            destino:
              "**Read data only from the element the signature provably covers** (the node returned by the validation, never a fresh search in the document), require a unique `ID`, **reject more than one assertion** when only one is expected and validate the XML against the schema. It breaks the cause: verification and reading now deal with the same node.",
          },
          {
            origem:
              "**Signature removal**: the attacker deletes the `Signature` element and changes the assertion. It works when the code only validates the signature **if it exists**.",
            destino:
              "**Require the signature** (on the assertion, or on the response while knowing exactly which data you read from it) and fail closed when it is missing. Declare this in the SP metadata (`WantAssertionsSigned`) and test a response with no signature. It breaks the cause: absence is no longer a valid path.",
          },
          {
            origem:
              "**Signature confusion**: the message carries its own certificate in `KeyInfo` and the code verifies with it; or it accepts weak algorithms or dangerous transforms; or it accepts a valid signature from someone who is not the configured IdP. The attacker signs with their own key and verification passes.",
            destino:
              "**Trust only the certificate from the IdP metadata**, obtained through a trusted channel, and ignore keys embedded in the message. Check the `Issuer`, allow only algorithms and transforms from a list (“enveloped” signature and exclusive canonicalization) and reject `XSLT` in transforms. It breaks the cause: trust comes from outside the message.",
          },
          {
            origem:
              "**Comment in the NameID**: a legitimate account of the attacker, with the identifier `admin@company.com<!---->.attacker.com`, receives a correctly signed assertion, but some parsers return only the first text node (`admin@company.com`) and the attacker logs in as someone else. It works because **the signed text and the text that was read are different**.",
            destino:
              "**Read the full text content** (all text nodes) or reject a `NameID` with comments or child elements, **update the library** and do not use the e-mail as the account key: tie the account to the pair `Issuer` and persistent `NameID` (see Q60 and Q52). It breaks the cause: the reading mismatch disappears, and the key is no longer manipulable text.",
          },
          {
            origem:
              "**Assertion replay**: the attacker captures a valid response (log, proxy, browser history, compromised machine) and resends it to the SP, or presents to one SP an assertion issued for another. It is the same idea as a “token replay attack”: reusing a valid token that was captured. It works because the signature stays valid; it proves the origin, not that **this presentation** is the first one and is meant for **this** SP.",
            destino:
              "**Single use and scope**: store the assertion `ID` until `NotOnOrAfter` and reject repeats, check validity with little clock leeway, `InResponseTo` equal to the `AuthnRequest` you issued, `Audience` equal to your entity ID and `Recipient`/`Destination` equal to your ACS, all over HTTPS (see Q62). It breaks the cause: the assertion is valid once, for one recipient, for a short time.",
          },
          {
            origem:
              "**XXE and attacks on the parser**: the response is XML from outside, and the parser reads the `DOCTYPE` before any signature is verified. External entities read local files or make the server request internal URLs (SSRF), and nested entities exhaust memory. It works because **parsing comes before authenticity**: the signature does not protect the parser.",
            destino:
              "**Disable DTD and external entities unconditionally** (in .NET, `DtdProcessing.Prohibit` and no entity resolver), limit document size and depth and **only then** validate the signature. It breaks the cause: the parser never resolves anything from outside, not even from a message that is not yet authenticated.",
          },
          {
            origem:
              "**Theft of the IdP signing key** (“Golden SAML”): whoever obtains the private key forges assertions for any user toward any SP that trusts that IdP, without going through the IdP. It works because the SP can only verify the key, not that the person actually authenticated.",
            destino:
              "**Protect and monitor the key** (HSM or vault, restricted access to the IdP servers), cross-check SP logins against the IdP’s authentication records (a login with no matching authentication is an alarm) and **replace the certificate** on suspicion (see Q64). It reduces the damage; the SP has no defense against a legitimate key that was stolen.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "XSW in miniature: the signature is valid, the reading is not",
        legenda: "XML",
        codigo: `<samlp:Response>
  <saml:Assertion ID="_forged">           <!-- unsigned; naive code reads this one -->
    <saml:Subject>
      <saml:NameID>admin@company.com</saml:NameID>
    </saml:Subject>
  </saml:Assertion>
  <saml:Assertion ID="_original">         <!-- the valid signature covers only this one -->
    <ds:Signature>
      <ds:SignedInfo>
        <ds:Reference URI="#_original"/>
      </ds:SignedInfo>
    </ds:Signature>
    <saml:Subject>
      <saml:NameID>ana@company.com</saml:NameID>
    </saml:Subject>
  </saml:Assertion>
</samlp:Response>`,
        nota: "Simplified version (namespaces and mandatory elements omitted). The defense is to use the node the validation confirmed, instead of searching the document for `Assertion` again.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The rule that breaks almost every cause",
        texto:
          "**Use only what was proven, and use exactly what was proven.** Prove the origin with the certificate from the metadata, use the data from the node that signature covers, and prove the presentation is new and meant for you (`InResponseTo`, `Audience`, `Recipient`, validity, single use). The real risk lies in the implementation (XML, signatures, configuration) and in the IdP key, more than in the protocol’s mathematics. After SSO, what weighs most is session theft (see Q130 and Q97).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Do not write this by hand",
        texto:
          "Validating XML Signature (canonicalization, references, transforms) on your own is the recipe for the flaws above. Use a maintained library or product and **keep it updated**: the fixes for XSW, for comments in the `NameID` and for XXE came in popular libraries. When the choice is yours and the partner supports it, OpenID Connect avoids this class of XML problems, but it has its own (see Q65 and Q132).",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Test like the attacker",
        texto:
          "Build a battery of tampered responses and require that **all** are rejected: no signature, signed by another key, `NameID` changed after signing, two assertions, expired assertion, replayed assertion, `Audience` or `Recipient` of another SP, a document with a `DOCTYPE` and a `NameID` with a comment. Run the battery on every library update. For the checklist to validate a response, see Q63; to debug failures, Q145.",
      },
    ],
    armadilhas: [
      "Validating the signature and then fetching the assertion with another XPath query: verification passes and the data comes from an unsigned node.",
      "Accepting a response without a signature “because the development IdP does not sign”, or verifying with the certificate that comes inside the message itself.",
      "Using the `NameID` e-mail as the unique account key: it is controllable, reusable text; use the IdP’s persistent identifier.",
      "Enabling DTD “for compatibility”, or handling replay only through the assertion’s validity, without storing the `ID`s already used.",
    ],
    autoteste: [
      {
        pergunta: "Why does XML Signature Wrapping work even with a valid signature, and what is the defense?",
        resposta:
          "Because the signature proves the integrity of the element it references, and the code reads the data from another place in the document. The defense is to read only the node the validation confirmed, require a unique `ID` and reject extra assertions.",
      },
      {
        pergunta: "Why does the signature not protect against XXE?",
        resposta:
          "Because the parser reads the document before the signature is verified, so a message that is not yet authenticated can already trigger entity resolution. The defense is to disable DTD and external entities in the parser, unconditionally.",
      },
    ],
  },
};
