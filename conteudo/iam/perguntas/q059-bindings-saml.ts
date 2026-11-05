import type { Pergunta } from "../../tipos";

// Q59 · Bindings SAML
export const q059: Pergunta = {
  numero: 59,
  modulo: "saml",
  metodo: "compare",
  pt: {
    titulo: "Bindings SAML",
    pergunta:
      "Compare os bindings SAML HTTP-Redirect, HTTP-POST e Artifact. Quando cada um é usado e que limitações técnicas e de segurança existem?",
    porqueEsteMetodo:
      "Os três bindings carregam as mesmas mensagens e diferem em como elas trafegam, o que muda tamanho, assinatura e exposição. Uma matriz deixa essas diferenças à vista e a regra de decisão diz qual usar para quê.",
    resposta30s:
      "Os **bindings** definem como uma mensagem SAML viaja entre SP e IdP através do navegador. No **HTTP-Redirect**, ela vai comprimida na query string de um `GET` (serve a **requisições** curtas, com a assinatura em parâmetros da URL); no **HTTP-POST**, vai num formulário enviado sozinho, com a assinatura dentro do XML (o padrão para **respostas**). No **HTTP-Artifact**, só uma **referência** passa pelo navegador, e a mensagem é buscada por um canal direto entre servidores.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Os três bindings lado a lado",
        colunas: ["Aspecto", "HTTP-Redirect", "HTTP-POST", "HTTP-Artifact"],
        linhas: [
          [
            "Como a mensagem trafega",
            "`GET` com `SAMLRequest` na URL: XML comprimido (DEFLATE), em base64 e codificado na URL",
            "`POST` de um formulário HTML que se envia sozinho, com `SAMLRequest` ou `SAMLResponse` em base64 (sem compressão)",
            "Só uma referência curta (`SAMLart`) passa pelo navegador, por redirect ou POST; o receptor a resolve por um canal direto (SOAP, `ArtifactResolve`)",
          ],
          [
            "Assinatura",
            "Fora do XML: parâmetros `SigAlg` e `Signature` da URL, calculados sobre a query string",
            "Dentro do XML (`ds:Signature` enveloped, veja Q61)",
            "A mensagem resolvida pode vir assinada; a proteção principal é o canal direto, autenticado e com TLS",
          ],
          [
            "Tamanho",
            "Limitado pelo comprimento máximo de URL de navegadores, servidores e proxies",
            "Sem o limite da URL (vale o limite do corpo aceito pelo servidor)",
            "A referência é pequena; a mensagem grande trafega no canal direto",
          ],
          [
            "Exposição do conteúdo",
            "A URL pode parar em logs de proxy, no histórico e no cabeçalho `Referer`",
            "O conteúdo passa pelo navegador (o usuário e extensões o veem); a assertion pode ser criptografada",
            "A mensagem não passa pelo navegador",
          ],
          [
            "Uso típico",
            "Requisições: `AuthnRequest`, `LogoutRequest`",
            "Respostas com assertion para o ACS; também requisições grandes ou assinadas no XML",
            "Quando a assertion não pode passar pelo navegador ou é grande demais; raro em SaaS",
          ],
          [
            "O que exige",
            "Nada além de HTTP; não precisa de JavaScript",
            "JavaScript para o envio automático (ou um botão de envio)",
            "Endpoint de resolução no emissor, estado para as referências e conectividade direta entre SP e IdP",
          ],
        ],
        nota: "No metadata, cada endpoint declara o binding aceito por um URI, como `urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect` (e os equivalentes para POST e Artifact). Existem ainda o binding SOAP (o canal direto usado pelo Artifact) e o PAOS (clientes que não são navegadores, no perfil ECP).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "**Redirect para requisições, POST para respostas, Artifact quando a mensagem não pode passar pelo navegador.** A resposta com assertion não cabe bem no Redirect (tamanho, logs, histórico); a requisição curta e sem dados sensíveis cabe. Na prática, IdP e SP declaram no metadata o que aceitam e o produto escolhe: confira que o endpoint do ACS declara o POST.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Limites técnicos e de segurança",
        texto:
          "No Redirect, o risco é **tamanho e vazamento em logs**: uma mensagem grande, ou com dados sensíveis, fica em registros que ninguém planejou proteger. Além disso, a assinatura cobre os bytes exatos da query string recebida, então **recodificar** parâmetros (por exemplo, trocar `%2F` por `%2f`) invalida a verificação. No POST, não suponha sigilo: o conteúdo é visível ao navegador, então criptografe a assertion se os atributos forem sensíveis (veja Q61). O POST também é uma requisição entre sites, o que afeta cookies `SameSite` do SP (veja Q56). No Artifact, o custo é operacional: mais um endpoint, estado e conectividade entre os servidores.",
      },
    ],
    armadilhas: [
      "Enviar uma resposta com assertion pelo Redirect: o tamanho estoura e o conteúdo vaza para logs e histórico. Respostas vão por POST (ou Artifact).",
      "Verificar a assinatura do Redirect sobre uma URL recodificada: calcule sobre a query string original, na ordem `SAMLRequest`, `RelayState`, `SigAlg`.",
      "Procurar `ds:Signature` dentro do XML de uma mensagem Redirect: nesse binding a assinatura é um parâmetro de URL.",
      "Esquecer que o POST depende de JavaScript ou de um botão de envio: sem isso o usuário fica parado numa página de formulário.",
    ],
    autoteste: [
      {
        pergunta: "Por que a assinatura no HTTP-Redirect não fica dentro do XML?",
        resposta:
          "Para não inflar a URL, que já tem limite de tamanho: a assinatura é destacada e vai em `SigAlg` e `Signature`, calculada sobre a query string (`SAMLRequest`, `RelayState`, `SigAlg`). No POST, a assinatura XML faz parte da mensagem.",
      },
      {
        pergunta: "Quando o Artifact compensa a complexidade extra?",
        resposta:
          "Quando a assertion não deve passar pelo navegador (política de segurança ou tamanho) e SP e IdP conseguem se falar diretamente. O custo é um endpoint de resolução, estado para as referências e conectividade entre os servidores.",
      },
    ],
  },
  en: {
    titulo: "SAML bindings",
    pergunta:
      "Compare the SAML bindings HTTP-Redirect, HTTP-POST and Artifact. When is each used, and what technical and security limitations exist?",
    porqueEsteMetodo:
      "The three bindings carry the same messages and differ in how they travel, which changes size, signature and exposure. A matrix puts those differences in plain sight and the decision rule says which to use for what.",
    resposta30s:
      "**Bindings** define how a SAML message travels between SP and IdP through the browser. With **HTTP-Redirect**, it goes compressed in the query string of a `GET` (it serves short **requests**, with the signature in URL parameters); with **HTTP-POST**, it goes in a self-submitting form, with the signature inside the XML (the default for **responses**). With **HTTP-Artifact**, only a **reference** passes through the browser, and the message is fetched over a direct server-to-server channel.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The three bindings side by side",
        colunas: ["Aspect", "HTTP-Redirect", "HTTP-POST", "HTTP-Artifact"],
        linhas: [
          [
            "How the message travels",
            "`GET` with `SAMLRequest` in the URL: XML compressed (DEFLATE), base64 and URL-encoded",
            "`POST` of a self-submitting HTML form, with `SAMLRequest` or `SAMLResponse` in base64 (uncompressed)",
            "Only a short reference (`SAMLart`) passes through the browser, by redirect or POST; the receiver resolves it over a direct channel (SOAP, `ArtifactResolve`)",
          ],
          [
            "Signature",
            "Outside the XML: `SigAlg` and `Signature` URL parameters, computed over the query string",
            "Inside the XML (enveloped `ds:Signature`, see Q61)",
            "The resolved message may be signed; the main protection is the direct channel, authenticated and over TLS",
          ],
          [
            "Size",
            "Limited by the maximum URL length of browsers, servers and proxies",
            "Without the URL limit (the server’s accepted body size applies)",
            "The reference is small; the large message travels over the direct channel",
          ],
          [
            "Content exposure",
            "The URL can end up in proxy logs, in history and in the `Referer` header",
            "The content passes through the browser (the user and extensions see it); the assertion can be encrypted",
            "The message does not pass through the browser",
          ],
          [
            "Typical use",
            "Requests: `AuthnRequest`, `LogoutRequest`",
            "Responses with an assertion to the ACS; also large requests or ones signed in the XML",
            "When the assertion cannot pass through the browser or is too large; rare in SaaS",
          ],
          [
            "What it requires",
            "Nothing beyond HTTP; no JavaScript needed",
            "JavaScript for the automatic submit (or a submit button)",
            "A resolution endpoint on the issuer, state for the references and direct connectivity between SP and IdP",
          ],
        ],
        nota: "In the metadata, each endpoint declares the binding it accepts with a URI, such as `urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect` (and the equivalents for POST and Artifact). There are also the SOAP binding (the direct channel used by Artifact) and PAOS (non-browser clients, in the ECP profile).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "**Redirect for requests, POST for responses, Artifact when the message cannot pass through the browser.** A response with an assertion does not fit Redirect well (size, logs, history); a short request with no sensitive data does. In practice, IdP and SP declare in the metadata what they accept and the product chooses: check that the ACS endpoint declares POST.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Technical and security limits",
        texto:
          "With Redirect, the risk is **size and leakage into logs**: a large message, or one with sensitive data, ends up in records nobody planned to protect. Also, the signature covers the exact bytes of the received query string, so **re-encoding** parameters (for example, turning `%2F` into `%2f`) breaks verification. With POST, do not assume secrecy: the content is visible to the browser, so encrypt the assertion if the attributes are sensitive (see Q61). POST is also a cross-site request, which affects the SP’s `SameSite` cookies (see Q56). With Artifact, the cost is operational: one more endpoint, state and connectivity between the servers.",
      },
    ],
    armadilhas: [
      "Sending a response with an assertion through Redirect: the size blows up and the content leaks into logs and history. Responses go by POST (or Artifact).",
      "Verifying the Redirect signature over a re-encoded URL: compute it over the original query string, in the order `SAMLRequest`, `RelayState`, `SigAlg`.",
      "Looking for a `ds:Signature` inside the XML of a Redirect message: in that binding the signature is a URL parameter.",
      "Forgetting that POST depends on JavaScript or a submit button: without it the user is stuck on a form page.",
    ],
    autoteste: [
      {
        pergunta: "Why is the HTTP-Redirect signature not inside the XML?",
        resposta:
          "To avoid inflating the URL, which already has a size limit: the signature is detached and goes in `SigAlg` and `Signature`, computed over the query string (`SAMLRequest`, `RelayState`, `SigAlg`). With POST, the XML signature is part of the message.",
      },
      {
        pergunta: "When does Artifact justify the extra complexity?",
        resposta:
          "When the assertion must not pass through the browser (security policy or size) and SP and IdP can talk to each other directly. The cost is a resolution endpoint, state for the references and connectivity between the servers.",
      },
    ],
  },
};
