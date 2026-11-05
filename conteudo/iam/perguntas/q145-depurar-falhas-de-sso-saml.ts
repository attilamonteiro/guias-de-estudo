import type { Pergunta } from "../../tipos";

// Q145 · Depurar falhas de SSO SAML
export const q145: Pergunta = {
  numero: 145,
  modulo: "ataques-e-depuracao",
  metodo: "playbook",
  pt: {
    titulo: "Depurar falhas de SSO SAML",
    pergunta:
      "Um SSO SAML falha em produção. Como você depura problemas de assinatura, Destination, InResponseTo, Audience e NotOnOrAfter?",
    porqueEsteMetodo:
      "Uma resposta SAML é um documento com vários campos que o SP confere um a um. O playbook percorre essa conferência na mesma ordem, e cada passo tem um critério claro de “igual ao configurado”.",
    resposta30s:
      "Capture a `SAMLResponse` (rastreador SAML ou HAR), decodifique o XML e leia primeiro o `StatusCode`. Depois compare cada campo com a configuração do SP e com os metadados do IdP: assinatura e certificado vigentes, `Destination` e `Recipient` com a URL do ACS, `Issuer` com o entityID do IdP, `Audience` com o entityID do SP, `InResponseTo` com o pedido guardado, `NotBefore` e `NotOnOrAfter` com o relógio e o formato do `NameID`. **Corrija a configuração, nunca afrouxando a validação.**",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook de falha de SAML",
        passos: [
          {
            titulo: "1. Capture a resposta",
            texto:
              "Use um rastreador SAML no navegador ou um HAR (DevTools, Rede, com o log preservado) e localize o POST ao ACS com o campo `SAMLResponse`. Pegue também os logs do SP e do IdP do mesmo horário. Sinal: você tem a resposta que o SP realmente recebeu, não a que se imagina que ele recebeu.",
          },
          {
            titulo: "2. Decodifique e leia o status",
            texto:
              "No binding POST, o valor é o XML em base64 (sem compressão); no Redirect, o pedido vai comprimido com DEFLATE, em base64 e codificado na URL. Decodifique **localmente**. Se a assertion for criptografada (`EncryptedAssertion`), decifre com a chave privada do SP. Leia primeiro o `StatusCode`: se não for `Success` (por exemplo, `Responder`, `AuthnFailed`, `RequestDenied`, `InvalidNameIDPolicy`), o problema está no IdP ou no pedido, e o `StatusMessage` costuma explicar.",
          },
          {
            titulo: "3. Verifique assinatura e certificado",
            texto:
              "Veja o que foi assinado (a `Response`, a `Assertion` ou as duas) e se o SP exige exatamente isso. Compare o certificado do `KeyInfo` com o dos **metadados vigentes** do IdP: o IdP que rotaciona o certificado sem o SP atualizar os metadados é a causa mais clássica (veja Q64). Confira o algoritmo aceito e se algum proxy ou reserialização alterou o XML depois de assinado. Se a assinatura é válida, ela só vale se o SP confiar na chave certa.",
          },
          {
            titulo: "4. Compare `Destination`, `Recipient`, `Issuer` e `Audience`",
            texto:
              "`Destination` (na `Response`) e `Recipient` (em `SubjectConfirmationData`) devem ser a URL do ACS onde a resposta chegou; `Issuer` deve ser o entityID do IdP nos metadados; `Audience` deve ser o entityID do **SP**, que não é a URL do ACS. Compare caractere a caractere: barra final, `http` ou `https` (atrás de proxy, o SP pode reconstruir a URL com o esquema errado; veja Q144), maiúsculas, ambiente (homologação ou produção).",
          },
          {
            titulo: "5. Compare `InResponseTo` com o pedido guardado",
            texto:
              "Deve ser o `ID` do `AuthnRequest` que o SP emitiu e guardou. Falha quando o estado se perdeu (réplicas diferentes, cookie de sessão não enviado no POST vindo de outro site, veja Q144), quando o usuário demorou, quando a resposta foi reenviada (voltar e atualizar) ou quando o login começou no IdP: no fluxo iniciado pelo IdP não existe `InResponseTo`, e o SP precisa estar configurado para aceitar isso, com os riscos descritos em Q57.",
          },
          {
            titulo: "6. Confira a janela de validade e o relógio",
            texto:
              "Compare `NotBefore` e `NotOnOrAfter` (em `Conditions` e em `SubjectConfirmationData`) e o `IssueInstant` com a hora do SP, sempre em UTC. A janela é curta de propósito: relógio desalinhado de alguns segundos para mais ou para menos, ou um usuário que demorou na tela do IdP, derruba o login. Sincronize por NTP e use uma tolerância pequena.",
          },
          {
            titulo: "7. Confira `NameID` e atributos, e corrija sem afrouxar",
            texto:
              "O formato do `NameID` (e-mail, persistente, transitório) precisa ser o que o SP espera, e os atributos têm de chegar com os nomes que ele procura. Muitas vezes a assinatura passa e o usuário não é encontrado ou provisionado. Corrija a causa (metadados, URLs, relógio, mapeamento) e repita o fluxo completo. Não desligue assinatura, `Audience` ou `InResponseTo` para fazer passar.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "O que comparar com o quê",
        colunas: ["Campo", "Compare com", "Erro típico"],
        linhas: [
          [
            "Assinatura (`Response` ou `Assertion`)",
            "Certificado dos metadados vigentes do IdP",
            "Certificado rotacionado sem atualizar os metadados; elemento errado assinado; XML alterado em trânsito",
          ],
          [
            "`Destination` (na `Response`)",
            "URL do ACS em que a resposta chegou",
            "Esquema `http` atrás do proxy, barra final, ACS de outro ambiente",
          ],
          ["`Recipient` (em `SubjectConfirmationData`)", "URL do ACS", "Os mesmos erros do `Destination`"],
          ["`Issuer`", "entityID do IdP nos metadados", "IdP ou tenant errado; entityID com barra final"],
          [
            "`Audience`",
            "entityID do SP (não a URL do ACS)",
            "Confundir entityID com URL; vários ambientes com o mesmo entityID",
          ],
          [
            "`InResponseTo`",
            "`ID` do `AuthnRequest` guardado",
            "Estado perdido (réplicas, cookie), resposta reenviada, fluxo iniciado pelo IdP",
          ],
          [
            "`NotBefore` e `NotOnOrAfter`",
            "Hora (UTC) do SP",
            "Relógio desalinhado, usuário que demorou, tolerância inexistente",
          ],
          [
            "`NameID` e atributos",
            "O formato e os nomes que o SP espera",
            "Formato diferente, atributo renomeado, usuário não provisionado",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Uma resposta SAML anotada",
        legenda: "XML",
        codigo: `<samlp:Response ID="_r1" InResponseTo="_req42" Version="2.0"
    Destination="https://app.example.com/saml/acs" IssueInstant="2026-11-04T14:00:05Z">
  <saml:Issuer>https://idp.example.com/entity</saml:Issuer>
  <samlp:Status><samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/></samlp:Status>
  <saml:Assertion ID="_a1" Version="2.0" IssueInstant="2026-11-04T14:00:05Z">
    <saml:Issuer>https://idp.example.com/entity</saml:Issuer>
    <ds:Signature>...</ds:Signature>
    <saml:Subject>
      <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">ana@example.com</saml:NameID>
      <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
        <saml:SubjectConfirmationData InResponseTo="_req42" Recipient="https://app.example.com/saml/acs"
            NotOnOrAfter="2026-11-04T14:05:05Z"/>
      </saml:SubjectConfirmation>
    </saml:Subject>
    <saml:Conditions NotBefore="2026-11-04T13:59:35Z" NotOnOrAfter="2026-11-04T14:05:05Z">
      <saml:AudienceRestriction><saml:Audience>https://app.example.com/sp</saml:Audience></saml:AudienceRestriction>
    </saml:Conditions>
  </saml:Assertion>
</samlp:Response>`,
        nota: "Namespaces omitidos para caber. Cada atributo em destaque tem um par na configuração: `Destination` e `Recipient` com o ACS, `Issuer` com os metadados do IdP, `Audience` com o entityID do SP, `InResponseTo` com o pedido guardado e as datas com o relógio.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Corrija a configuração, não a validação",
        texto:
          "Cada verificação existe contra um ataque: a assinatura contra falsificação, `Destination`, `Recipient` e `Audience` contra uma assertion feita para outro SP, `InResponseTo` contra resposta não solicitada ou repetida, e `NotOnOrAfter` contra reuso tardio (veja Q62, Q63 e Q67). Se uma delas falha, o conserto está nos metadados, nas URLs, no relógio ou no mapeamento, e não no desligamento da verificação.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A resposta é um dado sensível",
        texto:
          "Uma `SAMLResponse` ou um HAR contém dados da pessoa e, se ainda não expirou, uma assertion que pode abrir uma sessão. Não cole em decodificadores online: use uma ferramenta local ou de confiança e retire as partes sensíveis antes de compartilhar com o fornecedor.",
      },
    ],
    armadilhas: [
      "Desligar a verificação de assinatura, de `Audience` ou de `InResponseTo` “só para testar” e deixá-la desligada.",
      "Confundir o entityID do SP com a URL do ACS (e o `Audience` com o `Destination`), ou comparar sem notar barra final, `http` atrás do proxy e maiúsculas.",
      "Trocar o certificado no IdP sem atualizar os metadados no SP (ou o inverso), sem uma janela com dois certificados válidos.",
      "Aumentar a tolerância de relógio em vez de sincronizar os servidores, e colar uma `SAMLResponse` real em sites de terceiros.",
    ],
    autoteste: [
      {
        pergunta: "O que o `InResponseTo` protege, e quando ele pode estar legitimamente ausente?",
        resposta:
          "Ele liga a resposta ao pedido que o SP emitiu, impedindo respostas não solicitadas e repetidas. Pode faltar no fluxo iniciado pelo IdP, que não tem pedido; o SP só deve aceitar isso se estiver configurado de propósito, conhecendo o risco.",
      },
      {
        pergunta: "Qual a diferença entre `Destination` e `Audience`?",
        resposta:
          "`Destination` é a URL do endpoint do SP (o ACS) a que a resposta se destina; `Audience` é quem pode usar a assertion, normalmente o entityID do SP. Um valor é uma URL de entrega, o outro é uma identidade, e o SP confere os dois.",
      },
    ],
  },
  en: {
    titulo: "Debugging SAML SSO failures",
    pergunta:
      "A SAML SSO fails in production. How do you debug signature, Destination, InResponseTo, Audience and NotOnOrAfter problems?",
    porqueEsteMetodo:
      "A SAML response is a document with several fields that the SP checks one by one. The playbook walks that check in the same order, and each step has a clear criterion of “equal to what is configured”.",
    resposta30s:
      "Capture the `SAMLResponse` (SAML tracer or HAR), decode the XML and read the `StatusCode` first. Then compare each field with the SP’s configuration and the IdP’s metadata: current signature and certificate, `Destination` and `Recipient` with the ACS URL, `Issuer` with the IdP’s entityID, `Audience` with the SP’s entityID, `InResponseTo` with the stored request, `NotBefore` and `NotOnOrAfter` with the clock, and the `NameID` format. **Fix the configuration, never by loosening the validation.**",
    blocos: [
      {
        tipo: "passos",
        titulo: "SAML failure playbook",
        passos: [
          {
            titulo: "1. Capture the response",
            texto:
              "Use a SAML tracer in the browser or a HAR (DevTools, Network, log preserved) and find the POST to the ACS with the `SAMLResponse` field. Also pull the SP and IdP logs from the same time. Sign: you have the response the SP actually received, not the one you imagine it received.",
          },
          {
            titulo: "2. Decode and read the status",
            texto:
              "With the POST binding, the value is the XML in base64 (no compression); with Redirect, the request travels compressed with DEFLATE, in base64 and URL-encoded. Decode **locally**. If the assertion is encrypted (`EncryptedAssertion`), decrypt it with the SP’s private key. Read the `StatusCode` first: if it is not `Success` (for example `Responder`, `AuthnFailed`, `RequestDenied`, `InvalidNameIDPolicy`), the problem is at the IdP or in the request, and the `StatusMessage` often explains.",
          },
          {
            titulo: "3. Check signature and certificate",
            texto:
              "See what was signed (the `Response`, the `Assertion` or both) and whether the SP requires exactly that. Compare the certificate in `KeyInfo` with the one in the IdP’s **current metadata**: an IdP that rotates its certificate without the SP updating the metadata is the classic cause (see Q64). Check the accepted algorithm and whether a proxy or re-serialization altered the XML after it was signed. A valid signature only counts if the SP trusts the right key.",
          },
          {
            titulo: "4. Compare `Destination`, `Recipient`, `Issuer` and `Audience`",
            texto:
              "`Destination` (on the `Response`) and `Recipient` (in `SubjectConfirmationData`) must be the ACS URL where the response arrived; `Issuer` must be the IdP’s entityID in the metadata; `Audience` must be the **SP’s** entityID, which is not the ACS URL. Compare character by character: trailing slash, `http` or `https` (behind a proxy the SP may rebuild the URL with the wrong scheme; see Q144), letter case, environment (staging or production).",
          },
          {
            titulo: "5. Compare `InResponseTo` with the stored request",
            texto:
              "It must be the `ID` of the `AuthnRequest` that the SP issued and stored. It fails when state was lost (different replicas, a session cookie not sent on the cross-site POST, see Q144), when the user took too long, when the response was replayed (back and refresh) or when login started at the IdP: in the IdP-initiated flow there is no `InResponseTo`, and the SP must be configured to accept that, with the risks described in Q57.",
          },
          {
            titulo: "6. Check the validity window and the clock",
            texto:
              "Compare `NotBefore` and `NotOnOrAfter` (in `Conditions` and in `SubjectConfirmationData`) and the `IssueInstant` with the SP’s time, always in UTC. The window is short on purpose: a clock off by a few seconds either way, or a user who lingered on the IdP page, breaks the login. Synchronize through NTP and use a small tolerance.",
          },
          {
            titulo: "7. Check `NameID` and attributes, and fix without loosening",
            texto:
              "The `NameID` format (email, persistent, transient) must be what the SP expects, and the attributes must arrive with the names it looks for. Often the signature passes and the user is not found or provisioned. Fix the cause (metadata, URLs, clock, mapping) and repeat the whole flow. Do not turn off signature, `Audience` or `InResponseTo` to make it pass.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "What to compare with what",
        colunas: ["Field", "Compare with", "Typical error"],
        linhas: [
          [
            "Signature (`Response` or `Assertion`)",
            "Certificate in the IdP’s current metadata",
            "Certificate rotated without updating the metadata; wrong element signed; XML altered in transit",
          ],
          [
            "`Destination` (on the `Response`)",
            "ACS URL where the response arrived",
            "`http` scheme behind the proxy, trailing slash, ACS of another environment",
          ],
          ["`Recipient` (in `SubjectConfirmationData`)", "ACS URL", "The same as for `Destination`"],
          ["`Issuer`", "The IdP’s entityID in the metadata", "Wrong IdP or tenant; entityID with a trailing slash"],
          [
            "`Audience`",
            "The SP’s entityID (not the ACS URL)",
            "Confusing entityID with URL; several environments sharing one entityID",
          ],
          [
            "`InResponseTo`",
            "`ID` of the stored `AuthnRequest`",
            "Lost state (replicas, cookie), replayed response, IdP-initiated flow",
          ],
          [
            "`NotBefore` and `NotOnOrAfter`",
            "The SP’s time (UTC)",
            "Misaligned clock, a user who lingered, no tolerance at all",
          ],
          [
            "`NameID` and attributes",
            "The format and names the SP expects",
            "Different format, renamed attribute, user not provisioned",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "An annotated SAML response",
        legenda: "XML",
        codigo: `<samlp:Response ID="_r1" InResponseTo="_req42" Version="2.0"
    Destination="https://app.example.com/saml/acs" IssueInstant="2026-11-04T14:00:05Z">
  <saml:Issuer>https://idp.example.com/entity</saml:Issuer>
  <samlp:Status><samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/></samlp:Status>
  <saml:Assertion ID="_a1" Version="2.0" IssueInstant="2026-11-04T14:00:05Z">
    <saml:Issuer>https://idp.example.com/entity</saml:Issuer>
    <ds:Signature>...</ds:Signature>
    <saml:Subject>
      <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">ana@example.com</saml:NameID>
      <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
        <saml:SubjectConfirmationData InResponseTo="_req42" Recipient="https://app.example.com/saml/acs"
            NotOnOrAfter="2026-11-04T14:05:05Z"/>
      </saml:SubjectConfirmation>
    </saml:Subject>
    <saml:Conditions NotBefore="2026-11-04T13:59:35Z" NotOnOrAfter="2026-11-04T14:05:05Z">
      <saml:AudienceRestriction><saml:Audience>https://app.example.com/sp</saml:Audience></saml:AudienceRestriction>
    </saml:Conditions>
  </saml:Assertion>
</samlp:Response>`,
        nota: "Namespaces omitted to fit. Each attribute that matters has a counterpart in the configuration: `Destination` and `Recipient` with the ACS, `Issuer` with the IdP metadata, `Audience` with the SP’s entityID, `InResponseTo` with the stored request and the dates with the clock.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Fix the configuration, not the validation",
        texto:
          "Each check exists against an attack: the signature against forgery, `Destination`, `Recipient` and `Audience` against an assertion made for another SP, `InResponseTo` against an unsolicited or replayed response, and `NotOnOrAfter` against late reuse (see Q62, Q63 and Q67). If one of them fails, the fix is in the metadata, the URLs, the clock or the mapping, not in switching the check off.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The response is sensitive data",
        texto:
          "A `SAMLResponse` or a HAR contains the person’s data and, if it has not yet expired, an assertion that could open a session. Do not paste it into online decoders: use a local or trusted tool and strip the sensitive parts before sharing with the vendor.",
      },
    ],
    armadilhas: [
      "Turning off signature, `Audience` or `InResponseTo` verification “just to test” and leaving it off.",
      "Confusing the SP’s entityID with the ACS URL (and `Audience` with `Destination`), or comparing without noticing a trailing slash, `http` behind the proxy or letter case.",
      "Swapping the certificate at the IdP without updating the metadata at the SP (or the reverse), with no window where two certificates are valid.",
      "Raising the clock tolerance instead of synchronizing the servers, and pasting a real `SAMLResponse` into third-party sites.",
    ],
    autoteste: [
      {
        pergunta: "What does `InResponseTo` protect, and when can it be legitimately absent?",
        resposta:
          "It ties the response to the request the SP issued, blocking unsolicited and replayed responses. It can be missing in the IdP-initiated flow, which has no request; the SP should accept that only if it is deliberately configured to, knowing the risk.",
      },
      {
        pergunta: "What is the difference between `Destination` and `Audience`?",
        resposta:
          "`Destination` is the URL of the SP endpoint (the ACS) the response is addressed to; `Audience` is who may use the assertion, normally the SP’s entityID. One is a delivery URL, the other is an identity, and the SP checks both.",
      },
    ],
  },
};
