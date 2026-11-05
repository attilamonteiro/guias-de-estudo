import type { Pergunta } from "../../tipos";

// Q64 · Metadata e rotação de certificados
export const q064: Pergunta = {
  numero: 64,
  modulo: "saml",
  metodo: "playbook",
  pt: {
    titulo: "Metadata e rotação de certificados",
    pergunta:
      "Como se configura um SP SAML e se estabelece a confiança com o IdP? Como trocar metadados e fazer a rotação de certificados sem derrubar o login?",
    porqueEsteMetodo:
      "Configurar e rotacionar são procedimentos com ordem e critério de sucesso, e é na ordem (publicar antes de usar, remover depois) que o login cai ou não cai. Um playbook deixa cada passo e cada sinal de acerto explícitos.",
    resposta30s:
      "A confiança no SAML nasce da **troca de metadados**: o SP entrega `entityID`, ACS, certificados e formato de `NameID`; o IdP entrega `entityID`, URL de SSO e certificado de assinatura. Cada lado só aceita o que o metadata do outro declara. Na **rotação**, quem assina **publica o certificado novo ao lado do antigo**, os SPs passam a confiar nos dois, só então se troca o certificado de assinatura e, depois de monitorar, remove-se o antigo.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: configurar a integração e rotacionar sem derrubar o login",
        passos: [
          {
            titulo: "Defina o que cada lado publica",
            texto:
              "SP: `entityID`, ACS (URL e binding), certificados de assinatura e de criptografia, formato do `NameID`, atributos necessários. IdP: `entityID`, URL de SSO, certificado(s) de assinatura, formatos de `NameID`. **Critério:** ambos geram um documento de metadata (`EntityDescriptor`); prefira exportá-lo do produto a escrevê-lo à mão.",
          },
          {
            titulo: "Troque os metadados",
            texto:
              "O SP entrega o metadata ao administrador do IdP (arquivo ou URL) e importa o do IdP. Confirme a **origem** por outro canal (impressão digital do certificado, ou metadata assinado): essa troca é a âncora de confiança. **Sinal de acerto:** `entityID` e impressão digital batem com o que o outro lado informa.",
          },
          {
            titulo: "Configure o IdP",
            texto:
              "Cadastre o SP com o ACS exato e o `entityID` (será o `Audience`), o formato do `NameID`, as regras de atributos e grupos, a assinatura da assertion e, se for usar, o certificado de criptografia. **Critério:** os nomes de atributo são os que o SP espera (veja Q60).",
          },
          {
            titulo: "Configure o SP",
            texto:
              "Informe o `entityID` e a URL de SSO do IdP, o certificado de assinatura (vindo do metadata), exija assertion assinada, fixe a lista de algoritmos e a tolerância de relógio, e publique o ACS. **Critério:** as opções de segurança da biblioteca estão ligadas (veja Q63).",
          },
          {
            titulo: "Teste com um usuário piloto",
            texto:
              "Faça o login pelo SP e, se estiver habilitado, pelo portal do IdP. Capture a troca com uma extensão de depuração SAML no navegador e confira `Issuer`, `Audience`, `Destination`, `NameID` e atributos. Faça também testes negativos: assertion expirada, `Audience` errado e XML adulterado devem **falhar**.",
          },
          {
            titulo: "Rotacione com sobreposição",
            texto:
              "**Quem assina publica o certificado novo antes de usá-lo**: o IdP coloca o novo ao lado do antigo no metadata (dois `KeyDescriptor` de assinatura) e cada SP passa a confiar nos dois, importando ambos ou lendo o metadata por URL. Só quando todos confiam no novo o IdP passa a assinar com ele. Mantenha a sobreposição por uma janela, acompanhe falhas de verificação de assinatura nos SPs e só então remova o antigo. O mesmo vale para o certificado de criptografia do SP: publique o novo, espere o IdP adotá-lo e só depois aposente a chave privada antiga.",
          },
          {
            titulo: "Monitore a validade",
            texto:
              "Mantenha um inventário dos certificados por aplicação (dono, data de vencimento) e alerte com semanas de antecedência; use `validUntil` e `cacheDuration` no metadata. Em alguns produtos, um certificado vencido derruba o login de todos os usuários da integração ao mesmo tempo.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Metadata por URL ou por arquivo",
        colunas: ["Critério", "Metadata por URL", "Metadata por arquivo"],
        linhas: [
          [
            "Rotação de certificado",
            "Automática: o SP relê a URL e recebe os certificados novos",
            "Manual: alguém precisa reimportar, e o esquecimento é a causa clássica de queda",
          ],
          [
            "Confiança",
            "Depende de HTTPS e de quem controla a URL: se ela for comprometida, a âncora muda. Prefira metadata assinado ou fixe uma impressão digital",
            "Fixa e revisada na importação; mais difícil de adulterar depois",
          ],
          [
            "Disponibilidade",
            "Precisa alcançar a URL; use cache (`cacheDuration`) e tolere falhas",
            "Sem dependência de rede",
          ],
          [
            "Quando usar",
            "Federações e IdPs com URL estável de metadata",
            "Integrações pequenas, ambientes isolados ou onde toda mudança deve ser revisada",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Metadata do IdP durante a sobreposição",
        legenda: "XML",
        codigo: `<md:IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
  <!-- sobreposição: o certificado novo é publicado antes de passar a assinar -->
  <md:KeyDescriptor use="signing">
    <ds:KeyInfo><ds:X509Data><ds:X509Certificate>MIIC...antigo</ds:X509Certificate></ds:X509Data></ds:KeyInfo>
  </md:KeyDescriptor>
  <md:KeyDescriptor use="signing">
    <ds:KeyInfo><ds:X509Data><ds:X509Certificate>MIID...novo</ds:X509Certificate></ds:X509Data></ds:KeyInfo>
  </md:KeyDescriptor>
  <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
      Location="https://idp.example.com/saml/sso"/>
</md:IDPSSODescriptor>`,
        nota: "Enquanto os dois certificados estiverem no metadata, o SP aceita assinaturas de qualquer um. Terminada a rotação, o antigo sai do documento.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A confiança no SAML é o metadata",
        texto:
          "Não há autoridade central: **a confiança nasce da troca de metadados** entre SP e IdP. O SP só aceita assinaturas feitas com o certificado do IdP que ele importou, e o IdP só envia respostas ao ACS que o SP registrou. Por isso a origem do metadata importa tanto quanto o conteúdo. Em federações grandes, um metadata assinado por uma entidade confiável faz esse papel.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Publique antes de usar, remova depois de ninguém usar",
        texto:
          "Trocar o certificado do IdP de uma vez, sem sobreposição, derruba todos os SPs que ainda confiam só no antigo. Com metadata por arquivo, a sobreposição depende de cada SP importar a tempo: planeje a ordem e avise os donos de cada aplicação. Vale o mesmo para uma chave de criptografia do SP: se o IdP ainda cifra com a chave antiga, a chave privada antiga precisa continuar disponível.",
      },
    ],
    armadilhas: [
      "Importar o metadata por arquivo e esquecer a data de vencimento do certificado: o login cai no dia do vencimento, para todos. Tenha inventário e alertas.",
      "Trocar o certificado de assinatura do IdP sem sobreposição: os SPs que só conhecem o antigo passam a rejeitar todas as assertions.",
      "Cadastrar o ACS ou o `entityID` com diferença de uma barra final, `http` no lugar de `https` ou maiúsculas: a comparação é exata, e o erro aparece como `Audience` ou `Destination` inválidos.",
      "Confiar num metadata baixado por URL sem proteção: quem controla a URL controla a confiança.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a ordem segura para rotacionar o certificado de assinatura do IdP?",
        resposta:
          "Publicar o novo junto do antigo no metadata, esperar os SPs passarem a confiar nos dois, passar a assinar com o novo, observar falhas de assinatura e só então remover o antigo.",
      },
      {
        pergunta: "O que é trocado entre SP e IdP e por que isso é a base da confiança?",
        resposta:
          "O metadata: `entityID`, ACS e URL de SSO, bindings, certificados e formato de `NameID`. O SP aceita apenas assinaturas do certificado que importou, e o IdP só responde ao ACS cadastrado: sem autoridade central, a troca é a âncora.",
      },
    ],
  },
  en: {
    titulo: "Metadata and certificate rotation",
    pergunta:
      "How do you configure a SAML SP and establish trust with the IdP? How do you exchange metadata and rotate certificates without breaking login?",
    porqueEsteMetodo:
      "Configuring and rotating are procedures with an order and a success criterion, and it is the order (publish before use, remove after) that decides whether login breaks. A playbook makes every step and every sign of success explicit.",
    resposta30s:
      "Trust in SAML comes from the **metadata exchange**: the SP hands over `entityID`, ACS, certificates and `NameID` format; the IdP hands over `entityID`, SSO URL and signing certificate. Each side only accepts what the other’s metadata declares. For **rotation**, whoever signs **publishes the new certificate next to the old one**, the SPs come to trust both, only then is the signing certificate switched and, after monitoring, the old one is removed.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: set up the integration and rotate without breaking login",
        passos: [
          {
            titulo: "Define what each side publishes",
            texto:
              "SP: `entityID`, ACS (URL and binding), signing and encryption certificates, `NameID` format, required attributes. IdP: `entityID`, SSO URL, signing certificate(s), `NameID` formats. **Criterion:** both generate a metadata document (`EntityDescriptor`); prefer exporting it from the product to writing it by hand.",
          },
          {
            titulo: "Exchange the metadata",
            texto:
              "The SP gives its metadata to the IdP administrator (file or URL) and imports the IdP’s. Confirm the **origin** through another channel (certificate fingerprint, or signed metadata): that exchange is the trust anchor. **Sign of success:** `entityID` and fingerprint match what the other side reports.",
          },
          {
            titulo: "Configure the IdP",
            texto:
              "Register the SP with the exact ACS and the `entityID` (it becomes the `Audience`), the `NameID` format, the attribute and group rules, assertion signing and, if used, the encryption certificate. **Criterion:** attribute names are the ones the SP expects (see Q60).",
          },
          {
            titulo: "Configure the SP",
            texto:
              "Set the IdP’s `entityID` and SSO URL, the signing certificate (from the metadata), require a signed assertion, fix the algorithm list and the clock tolerance, and publish the ACS. **Criterion:** the library’s security options are on (see Q63).",
          },
          {
            titulo: "Test with a pilot user",
            texto:
              "Log in through the SP and, if enabled, through the IdP portal. Capture the exchange with a SAML debugging extension in the browser and check `Issuer`, `Audience`, `Destination`, `NameID` and attributes. Also run negative tests: an expired assertion, a wrong `Audience` and tampered XML must **fail**.",
          },
          {
            titulo: "Rotate with an overlap",
            texto:
              "**Whoever signs publishes the new certificate before using it**: the IdP puts the new one next to the old one in the metadata (two signing `KeyDescriptor`s) and each SP comes to trust both, by importing both or reading the metadata by URL. Only when everyone trusts the new one does the IdP start signing with it. Keep the overlap for a window, watch for signature verification failures at the SPs and only then remove the old one. The same applies to the SP’s encryption certificate: publish the new one, wait for the IdP to adopt it and only then retire the old private key.",
          },
          {
            titulo: "Monitor expiry",
            texto:
              "Keep an inventory of certificates per application (owner, expiry date) and alert weeks in advance; use `validUntil` and `cacheDuration` in the metadata. In some products, an expired certificate breaks login for every user of the integration at once.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Metadata by URL or by file",
        colunas: ["Criterion", "Metadata by URL", "Metadata by file"],
        linhas: [
          [
            "Certificate rotation",
            "Automatic: the SP rereads the URL and receives the new certificates",
            "Manual: someone must reimport, and forgetting is the classic cause of outages",
          ],
          [
            "Trust",
            "Depends on HTTPS and on whoever controls the URL: if it is compromised, the anchor changes. Prefer signed metadata or pin a fingerprint",
            "Fixed and reviewed at import time; harder to tamper with afterwards",
          ],
          [
            "Availability",
            "Needs to reach the URL; use caching (`cacheDuration`) and tolerate failures",
            "No network dependency",
          ],
          [
            "When to use",
            "Federations and IdPs with a stable metadata URL",
            "Small integrations, isolated environments or where every change must be reviewed",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "IdP metadata during the overlap",
        legenda: "XML",
        codigo: `<md:IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
  <!-- overlap: the new certificate is published before it starts signing -->
  <md:KeyDescriptor use="signing">
    <ds:KeyInfo><ds:X509Data><ds:X509Certificate>MIIC...old</ds:X509Certificate></ds:X509Data></ds:KeyInfo>
  </md:KeyDescriptor>
  <md:KeyDescriptor use="signing">
    <ds:KeyInfo><ds:X509Data><ds:X509Certificate>MIID...new</ds:X509Certificate></ds:X509Data></ds:KeyInfo>
  </md:KeyDescriptor>
  <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
      Location="https://idp.example.com/saml/sso"/>
</md:IDPSSODescriptor>`,
        nota: "While both certificates are in the metadata, the SP accepts signatures from either one. Once the rotation is finished, the old one leaves the document.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Trust in SAML is the metadata",
        texto:
          "There is no central authority: **trust comes from the metadata exchange** between SP and IdP. The SP only accepts signatures made with the IdP certificate it imported, and the IdP only sends responses to the ACS the SP registered. That is why the origin of the metadata matters as much as its content. In large federations, metadata signed by a trusted entity plays that role.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Publish before use, remove after nobody uses it",
        texto:
          "Swapping the IdP certificate all at once, with no overlap, breaks every SP that still trusts only the old one. With metadata by file, the overlap depends on each SP importing in time: plan the order and warn the owners of each application. The same goes for an SP encryption key: if the IdP still encrypts with the old key, the old private key must stay available.",
      },
    ],
    armadilhas: [
      "Importing metadata by file and forgetting the certificate’s expiry date: login goes down on the expiry day, for everyone. Keep an inventory and alerts.",
      "Swapping the IdP signing certificate with no overlap: SPs that only know the old one start rejecting every assertion.",
      "Registering the ACS or the `entityID` with a trailing slash difference, `http` instead of `https`, or different capitalization: the comparison is exact, and the error shows up as an invalid `Audience` or `Destination`.",
      "Trusting metadata downloaded from an unprotected URL: whoever controls the URL controls the trust.",
    ],
    autoteste: [
      {
        pergunta: "What is the safe order for rotating the IdP’s signing certificate?",
        resposta:
          "Publish the new one next to the old one in the metadata, wait for the SPs to trust both, start signing with the new one, watch for signature failures and only then remove the old one.",
      },
      {
        pergunta: "What is exchanged between SP and IdP, and why is that the basis of trust?",
        resposta:
          "The metadata: `entityID`, ACS and SSO URL, bindings, certificates and `NameID` format. The SP only accepts signatures from the certificate it imported, and the IdP only answers the registered ACS: with no central authority, the exchange is the anchor.",
      },
    ],
  },
};
