import type { Pergunta } from "../../tipos";

// Q61 · Assinatura e criptografia SAML
export const q061: Pergunta = {
  numero: 61,
  modulo: "saml",
  metodo: "compare",
  pt: {
    titulo: "Assinatura e criptografia SAML",
    pergunta:
      "Como funcionam a assinatura e a criptografia em SAML? Compare assinar a Response, assinar a Assertion e criptografar, e diga o que o SP deve exigir.",
    porqueEsteMetodo:
      "Assinar e criptografar parecem a mesma coisa, mas protegem propriedades diferentes, e assinar a Response não é o mesmo que assinar a Assertion. Uma matriz separa o que cada opção protege, e a regra de decisão diz o que o SP deve exigir.",
    resposta30s:
      "A **assinatura** (XML Signature) dá **autenticidade e integridade**: o IdP assina com a chave privada e o SP verifica com o certificado do metadata, na `Response`, na `Assertion` ou em ambas. A **criptografia** (XML Encryption, `EncryptedAssertion`) dá **confidencialidade**: só o SP, com a chave privada dele, lê a assertion. O SP deve **exigir assinatura válida sobre a assertion que consome**, usar TLS sempre e pedir criptografia quando os dados forem sensíveis.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "O que cada opção protege",
        colunas: ["Opção", "O que protege", "Limite ou risco"],
        linhas: [
          [
            "Assinar a `Response`",
            "A mensagem inteira: `Status`, `Destination`, `InResponseTo` e as assertions dentro dela",
            "A assertion não se sustenta sozinha: se o SP ler uma assertion que a assinatura não cobre, a verificação não vale (risco de signature wrapping)",
          ],
          [
            "Assinar a `Assertion`",
            "O conteúdo da assertion: `Subject`, `Conditions` e os statements. Ela é autocontida e continua verificável mesmo fora da `Response`",
            "O envelope da `Response` (`Status`, `Destination`) fica sem assinatura; o SP deve confiar nos campos da própria assertion (`Recipient`, `InResponseTo`, `Audience`)",
          ],
          [
            "Assinar as duas",
            "Defesa em profundidade: cobre a mensagem e a assertion",
            "Custa pouco, mas o SP precisa verificar e consumir o elemento certo; verificar uma e ler a outra anula o benefício",
          ],
          [
            "Criptografar a assertion (`EncryptedAssertion`)",
            "Confidencialidade: `NameID` e atributos não ficam legíveis no navegador, em logs e em proxies, além do TLS",
            "Não dá autenticidade: a chave pública do SP é pública, então qualquer um pode produzir uma assertion cifrada para ele. Só a assinatura prova a origem",
          ],
          [
            "TLS",
            "O trajeto entre o navegador e cada endpoint",
            "Não protege a mensagem dentro do navegador, nem de ponta a ponta entre IdP e SP, já que o navegador está no meio",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Assinatura enveloped, com a referência por ID",
        legenda: "XML",
        codigo: `<saml:Assertion ID="_a75adf55" ...>
  <ds:Signature>
    <ds:SignedInfo>
      <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
      <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
      <ds:Reference URI="#_a75adf55">
        <ds:Transforms>
          <ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
          <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
        </ds:Transforms>
        <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
        <ds:DigestValue>...</ds:DigestValue>
      </ds:Reference>
    </ds:SignedInfo>
    <ds:SignatureValue>...</ds:SignatureValue>
  </ds:Signature>
  ...
</saml:Assertion>`,
        nota: "A `Reference` aponta para o `ID` do elemento assinado; a canonicalização evita que espaços e declarações de namespace quebrem o resumo. O SP verifica o resumo (`DigestValue`) e a assinatura sobre o `SignedInfo`, e deve consumir exatamente o elemento que a referência cobre.",
      },
      {
        tipo: "passos",
        titulo: "Como a assertion é criptografada",
        passos: [
          {
            titulo: "O SP publica a chave",
            texto:
              'O certificado de criptografia do SP vai no metadata (`KeyDescriptor use="encryption"`). O IdP só criptografa para uma chave que recebeu por esse caminho.',
          },
          {
            titulo: "O IdP cifra a assertion",
            texto:
              "Gera uma chave simétrica aleatória e cifra a assertion com ela (`EncryptedData`). Prefira AES-GCM quando os dois lados suportarem.",
          },
          {
            titulo: "O IdP embrulha a chave",
            texto:
              "Cifra essa chave simétrica com a chave pública do SP (`EncryptedKey`), de preferência com RSA-OAEP, e envia a `EncryptedAssertion` dentro da `Response`.",
          },
          {
            titulo: "O SP decifra e só então valida",
            texto:
              "Usa a chave privada para recuperar a chave simétrica e a assertion, e então verifica a assinatura **de dentro** e as condições (veja Q63). Falha ao decifrar é falha de login.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que o SP deve exigir",
        texto:
          "**Assinatura válida sobre a assertion que será consumida** (assinada diretamente, ou coberta pela assinatura da `Response` com a certeza de que a referência aponta para ela), verificada com o certificado do **metadata** e com algoritmos de uma lista permitida. **TLS sempre.** **Criptografia** quando a assertion carregar dados sensíveis ou quando não se quiser atributos visíveis no navegador e nos logs. Se o IdP assinar as duas, melhor; o SP consome só o que verificou. Algoritmos antigos de XML Encryption (modo CBC, transporte de chave RSA 1.5) têm fraquezas conhecidas: prefira AES-GCM e RSA-OAEP, e confira o que o seu IdP oferece.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Assinatura válida sobre o elemento errado",
        texto:
          "A verificação confere o elemento que a `Reference` aponta pelo `ID`, mas o código que lê `NameID` e atributos pode estar lendo **outro** elemento: uma segunda assertion injetada, ou uma cópia deslocada, que nunca foi assinada (**XML Signature Wrapping**). O resultado é assinatura válida e identidade forjada. Defesas: biblioteca madura e atualizada; **consumir só o elemento verificado** (de preferência, o que a biblioteca devolve depois de verificar); rejeitar respostas com mais assertions do que o esperado; e nunca aceitar o `KeyInfo` embutido na mensagem, porque quem forja a mensagem escolhe a chave. A chave vem do metadata. Rejeite também algoritmos fracos, como SHA-1.",
      },
    ],
    armadilhas: [
      "Verificar a assinatura da `Response` e ler a assertion de outro ponto do documento: é o ataque de signature wrapping.",
      "Aceitar a chave do `KeyInfo` da própria mensagem: qualquer um assina com a chave que embute. Use o certificado do metadata.",
      "Achar que criptografar dispensa assinar: a chave pública do SP é pública, então qualquer um produz uma assertion cifrada para ele. Só a assinatura prova a origem.",
      "Achar que o TLS basta: ele protege o trajeto, não a mensagem que passa pelo navegador. Assinatura e criptografia protegem a mensagem em si.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre assinar e criptografar uma assertion?",
        resposta:
          "Assinar dá autenticidade e integridade (quem emitiu e que não foi alterada), com a chave privada do IdP. Criptografar dá confidencialidade, com a chave pública do SP, de modo que só o SP lê. Um não substitui o outro.",
      },
      {
        pergunta: "O que é uma assinatura válida sobre o elemento errado?",
        resposta:
          "É quando a assinatura confere para o elemento apontado pela `Reference`, mas o código lê a identidade de outro elemento, que não foi assinado (signature wrapping). A defesa é consumir apenas o que foi verificado.",
      },
    ],
  },
  en: {
    titulo: "SAML signing and encryption",
    pergunta:
      "How do signing and encryption work in SAML? Compare signing the Response, signing the Assertion and encrypting, and say what the SP should require.",
    porqueEsteMetodo:
      "Signing and encrypting look like the same thing, but they protect different properties, and signing the Response is not the same as signing the Assertion. A matrix separates what each option protects, and the decision rule says what the SP should require.",
    resposta30s:
      "**Signing** (XML Signature) gives **authenticity and integrity**: the IdP signs with its private key and the SP verifies with the certificate from the metadata, on the `Response`, the `Assertion` or both. **Encryption** (XML Encryption, `EncryptedAssertion`) gives **confidentiality**: only the SP, with its private key, can read the assertion. The SP should **require a valid signature over the assertion it consumes**, use TLS always and ask for encryption when the data is sensitive.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "What each option protects",
        colunas: ["Option", "What it protects", "Limit or risk"],
        linhas: [
          [
            "Sign the `Response`",
            "The whole message: `Status`, `Destination`, `InResponseTo` and the assertions inside it",
            "The assertion cannot stand alone: if the SP reads an assertion the signature does not cover, the verification means nothing (signature wrapping risk)",
          ],
          [
            "Sign the `Assertion`",
            "The assertion content: `Subject`, `Conditions` and the statements. It is self-contained and stays verifiable even outside the `Response`",
            "The `Response` envelope (`Status`, `Destination`) is unsigned; the SP should rely on the assertion’s own fields (`Recipient`, `InResponseTo`, `Audience`)",
          ],
          [
            "Sign both",
            "Defense in depth: covers the message and the assertion",
            "Cheap, but the SP must verify and consume the right element; verifying one and reading the other cancels the benefit",
          ],
          [
            "Encrypt the assertion (`EncryptedAssertion`)",
            "Confidentiality: `NameID` and attributes are not readable in the browser, in logs and in proxies, on top of TLS",
            "No authenticity: the SP’s public key is public, so anyone can produce an assertion encrypted for it. Only the signature proves the origin",
          ],
          [
            "TLS",
            "The path between the browser and each endpoint",
            "Does not protect the message inside the browser, nor end to end between IdP and SP, since the browser sits in the middle",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "An enveloped signature, with the reference by ID",
        legenda: "XML",
        codigo: `<saml:Assertion ID="_a75adf55" ...>
  <ds:Signature>
    <ds:SignedInfo>
      <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
      <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
      <ds:Reference URI="#_a75adf55">
        <ds:Transforms>
          <ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
          <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
        </ds:Transforms>
        <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
        <ds:DigestValue>...</ds:DigestValue>
      </ds:Reference>
    </ds:SignedInfo>
    <ds:SignatureValue>...</ds:SignatureValue>
  </ds:Signature>
  ...
</saml:Assertion>`,
        nota: "The `Reference` points to the `ID` of the signed element; canonicalization keeps whitespace and namespace declarations from breaking the digest. The SP verifies the digest (`DigestValue`) and the signature over `SignedInfo`, and must consume exactly the element the reference covers.",
      },
      {
        tipo: "passos",
        titulo: "How the assertion is encrypted",
        passos: [
          {
            titulo: "The SP publishes the key",
            texto:
              'The SP’s encryption certificate goes in the metadata (`KeyDescriptor use="encryption"`). The IdP only encrypts for a key it received through that path.',
          },
          {
            titulo: "The IdP encrypts the assertion",
            texto:
              "It generates a random symmetric key and encrypts the assertion with it (`EncryptedData`). Prefer AES-GCM when both sides support it.",
          },
          {
            titulo: "The IdP wraps the key",
            texto:
              "It encrypts that symmetric key with the SP’s public key (`EncryptedKey`), preferably with RSA-OAEP, and sends the `EncryptedAssertion` inside the `Response`.",
          },
          {
            titulo: "The SP decrypts and only then validates",
            texto:
              "It uses the private key to recover the symmetric key and the assertion, then verifies the **inner** signature and the conditions (see Q63). A decryption failure is a login failure.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What the SP should require",
        texto:
          "A **valid signature over the assertion that will be consumed** (signed directly, or covered by the `Response` signature with certainty that the reference points to it), verified with the certificate from the **metadata** and with algorithms from an allowlist. **TLS always.** **Encryption** when the assertion carries sensitive data or when you do not want attributes visible in the browser and in logs. If the IdP signs both, better; the SP consumes only what it verified. Older XML Encryption algorithms (CBC mode, RSA 1.5 key transport) have known weaknesses: prefer AES-GCM and RSA-OAEP, and check what your IdP offers.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A valid signature over the wrong element",
        texto:
          "Verification checks the element the `Reference` points to by `ID`, but the code that reads `NameID` and attributes may be reading a **different** element: an injected second assertion, or a relocated copy, that was never signed (**XML Signature Wrapping**). The result is a valid signature and a forged identity. Defenses: a mature, up-to-date library; **consume only the verified element** (preferably what the library returns after verifying); reject responses with more assertions than expected; and never accept the `KeyInfo` embedded in the message, because whoever forges the message picks the key. The key comes from the metadata. Also reject weak algorithms, such as SHA-1.",
      },
    ],
    armadilhas: [
      "Verifying the `Response` signature and reading the assertion from another spot in the document: that is the signature wrapping attack.",
      "Accepting the key in the message’s own `KeyInfo`: anyone signs with the key they embed. Use the certificate from the metadata.",
      "Thinking encryption makes signing unnecessary: the SP’s public key is public, so anyone can produce an assertion encrypted for it. Only the signature proves the origin.",
      "Thinking TLS is enough: it protects the path, not the message that passes through the browser. Signing and encryption protect the message itself.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between signing and encrypting an assertion?",
        resposta:
          "Signing gives authenticity and integrity (who issued it and that it was not altered), with the IdP’s private key. Encrypting gives confidentiality, with the SP’s public key, so only the SP can read it. One does not replace the other.",
      },
      {
        pergunta: "What is a valid signature over the wrong element?",
        resposta:
          "It is when the signature checks out for the element the `Reference` points to, but the code reads the identity from another element, which was not signed (signature wrapping). The defense is to consume only what was verified.",
      },
    ],
  },
};
