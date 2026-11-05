import type { Pergunta } from "../../tipos";

// Q38 · PAR, JAR e FAPI 2.0
export const q038: Pergunta = {
  numero: 38,
  modulo: "oauth",
  metodo: "feynman",
  pt: {
    titulo: "PAR, JAR e FAPI 2.0",
    pergunta:
      "O que são Pushed Authorization Requests (PAR), JAR e o perfil FAPI 2.0, e por que setores como bancos e saúde os adotam?",
    porqueEsteMetodo:
      "PAR, JAR e FAPI 2.0 parecem siglas soltas até você ver o problema que cada uma resolve. Uma imagem simples mostra a lógica, e depois vêm os mecanismos reais e o custo de adotá-los.",
    resposta30s:
      "Na requisição `/authorize` comum, os parâmetros viajam pela URL do navegador: ficam **expostos** (histórico, logs, extensões) e podem ser **adulterados**. O **PAR** (RFC 9126) envia os parâmetros direto ao servidor, por um canal autenticado, e devolve um `request_uri` curto e de uso único; o **JAR** (RFC 9101) assina a requisição num JWT; o **FAPI 2.0** é um perfil que combina PAR, PKCE, tokens vinculados ao remetente e validação rígida. Bancos e saúde os adotam porque lidam com dinheiro e dados sensíveis, em que um erro é caro e a conformidade precisa ser verificável.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense em mandar uma ordem de pagamento ao banco por um mensageiro. No jeito comum, você escreve a ordem num cartão-postal aberto: o mensageiro (e qualquer um no caminho) lê, e pode riscar o valor ou trocar o destino. No PAR, você entrega a ordem ao banco por um canal direto e seguro, e o banco devolve uma senha de retirada; o mensageiro leva só a senha. No JAR, a ordem vai com o seu carimbo, e o banco sabe que ninguém a alterou. O FAPI 2.0 é o regulamento do banco: senha de retirada, carimbo, cofre com chave e checagem de identidade em tudo.",
        tecnico:
          "Na requisição `/authorize` comum, os parâmetros (`scope`, `redirect_uri`, `state`, `code_challenge`) vão na URL, pelo navegador (front channel): ficam no histórico, em logs e em extensões, podem ser editados pelo usuário ou por um malware, têm limite de tamanho, e o client só é autenticado depois. O **PAR** (*Pushed Authorization Requests*, RFC 9126) manda os mesmos parâmetros num `POST` direto ao servidor (back channel), com autenticação do client; o servidor valida e responde com um `request_uri` de curta duração, e o navegador leva só `client_id` e `request_uri`. O **JAR** (*JWT-Secured Authorization Request*, RFC 9101) coloca os parâmetros num JWT assinado (e, se preciso, cifrado), enviado em `request` ou por referência, e o servidor confirma origem e integridade. O **FAPI 2.0**, da OpenID Foundation, é um perfil de segurança que reúne exigências como PAR, PKCE, tokens vinculados ao remetente (veja Q37), autenticação forte do client e redirect URI exato; um perfil complementar de assinatura de mensagens acrescenta requisições e respostas assinadas. Confira a especificação vigente.",
        limite:
          "O `request_uri` é de **uso único**, expira em segundos e só serve ao client que o pediu. E nenhum desses mecanismos protege o usuário que é enganado e autoriza o que não devia (phishing): eles protegem a **requisição**, não o consentimento.",
      },
      {
        tipo: "fluxo",
        titulo: "O PAR, passo a passo",
        etapas: [
          "O client faz um `POST` ao endpoint de PAR com os parâmetros da autorização e se autentica (por exemplo, com `private_key_jwt`)",
          "O authorization server valida tudo já (client, `redirect_uri`, escopos, PKCE) e rejeita cedo o que estiver errado",
          "Ele responde `201` com um `request_uri` e um `expires_in`, em segundos",
          "O client redireciona o navegador para `/authorize?client_id=...&request_uri=...`, sem nada sensível na URL",
          "O servidor recupera os parâmetros guardados, autentica o usuário, colhe o consentimento e devolve o `code` ao `redirect_uri`; a troca por tokens segue como de costume",
        ],
        nota: "Daqui em diante é o fluxo de sempre (authorization code com PKCE, veja Q39); só a ida mudou.",
      },
      {
        tipo: "tabela",
        titulo: "O que cada peça resolve e o que custa",
        colunas: ["Peça", "Problema que resolve", "Como", "Custo"],
        linhas: [
          [
            "PAR (RFC 9126)",
            "Parâmetros expostos, adulteráveis e limitados pelo tamanho da URL; client autenticado só tarde",
            "`POST` direto e `request_uri` de uso único",
            "Uma chamada a mais, suporte no servidor e uma credencial para o client",
          ],
          [
            "JAR (RFC 9101)",
            "Provar origem e integridade da requisição (inclusive para não repúdio) e, se cifrada, sigilo",
            "JWT assinado (e cifrado) em `request` ou `request_uri`",
            "Gestão de chaves de assinatura, bibliotecas e algoritmos combinados",
          ],
          ["Tokens vinculados (Q37)", "Token roubado reutilizável", "mTLS ou DPoP", "PKI ou prova por requisição"],
          [
            "FAPI 2.0",
            "Dar um conjunto fechado e testável de exigências para casos de alto risco",
            "Perfil que combina PAR, PKCE, vínculo do token, autenticação forte do client e validação rígida",
            "Muitas exigências, só clients confidenciais, testes de conformidade e um IdP que suporte o perfil",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "O PAR em HTTP",
        legenda: "HTTP",
        codigo: `POST /par HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded

client_id=app1&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
&client_assertion=eyJ...&response_type=code&scope=payments
&redirect_uri=https%3A%2F%2Fapp.example.com%2Fcb
&code_challenge=E9Melhoa...&code_challenge_method=S256&state=xyz

HTTP/1.1 201 Created
Content-Type: application/json

{ "request_uri": "urn:ietf:params:oauth:request_uri:6esc29fK", "expires_in": 60 }

GET /authorize?client_id=app1&request_uri=urn%3Aietf%3Aparams%3Aoauth%3Arequest_uri%3A6esc29fK`,
        nota: "O client se autentica com uma asserção JWT. Na última linha, a URL do navegador carrega só uma referência, sem `scope`, `state` ou desafio PKCE à vista.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Por que bancos e saúde, e quando é exagero",
        texto:
          "Esses setores lidam com dinheiro e dados sensíveis, entregam acesso a terceiros por consentimento (como no open banking ou em integrações com prontuários) e precisam provar o que foi autorizado: adulterar uma requisição ou roubar um token custa caro, e reguladores e contratos tendem a pedir um perfil auditável. Para um app interno ou um SaaS de baixo risco, **authorization code com PKCE**, redirect exato e tokens curtos (veja Q39) já cobrem a maior parte do risco, e o FAPI 2.0 inteiro seria exagero. Adote o PAR quando o servidor o suporta e os parâmetros são sensíveis ou numerosos; JAR e FAPI, quando contrato ou regulação pedem.",
      },
    ],
    armadilhas: [
      "Achar que o PAR substitui o PKCE ou o `state`: ele protege a requisição, e o PKCE protege o `code`. No FAPI 2.0 os dois convivem.",
      "Aceitar um `request_uri` reutilizável ou de longa duração: ele deve ser de uso único e curto.",
      "Assinar a requisição com JAR e aceitar `alg: none` ou um algoritmo escolhido pelo client: fixe os algoritmos permitidos no servidor.",
      "Dizer “somos FAPI” só por usar PAR: o perfil é um conjunto de exigências, e a conformidade é testada (a OpenID Foundation mantém uma suíte de testes).",
    ],
    autoteste: [
      {
        pergunta: "Que problema da requisição `/authorize` o PAR resolve?",
        resposta:
          "Os parâmetros deixam de passar pela URL do navegador: vão direto ao servidor, por um canal em que o client se autentica, e o servidor devolve só um `request_uri` de uso único. Isso evita exposição e adulteração e permite rejeitar cedo uma requisição inválida.",
      },
      {
        pergunta: "Qual a diferença entre PAR e JAR?",
        resposta:
          "O PAR muda o caminho: os parâmetros vão direto ao servidor, num canal autenticado, e a URL leva só uma referência. O JAR muda o formato: os parâmetros viram um JWT assinado. Os dois se combinam: o JWT assinado pode ser enviado pelo PAR.",
      },
    ],
  },
  en: {
    titulo: "PAR, JAR and FAPI 2.0",
    pergunta:
      "What are Pushed Authorization Requests (PAR), JAR and the FAPI 2.0 profile, and why do sectors such as banking and healthcare adopt them?",
    porqueEsteMetodo:
      "PAR, JAR and FAPI 2.0 look like loose acronyms until you see the problem each one solves. A simple image shows the logic, and then come the real mechanisms and the cost of adopting them.",
    resposta30s:
      "In an ordinary `/authorize` request, the parameters travel through the browser’s URL: they are **exposed** (history, logs, extensions) and can be **tampered with**. **PAR** (RFC 9126) sends the parameters straight to the server over an authenticated channel and returns a short, single-use `request_uri`; **JAR** (RFC 9101) signs the request in a JWT; **FAPI 2.0** is a profile that combines PAR, PKCE, sender-constrained tokens and strict validation. Banks and healthcare adopt them because they handle money and sensitive data, where a mistake is costly and compliance has to be verifiable.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of sending a payment order to the bank by courier. The usual way, you write the order on an open postcard: the courier (and anyone along the way) reads it, and can cross out the amount or change the destination. With PAR, you hand the order to the bank over a direct, secure channel, and the bank gives back a pickup code; the courier carries only the code. With JAR, the order carries your seal, and the bank knows nobody altered it. FAPI 2.0 is the bank’s rulebook: pickup code, seal, a vault with a key and an identity check at every step.",
        tecnico:
          "In an ordinary `/authorize` request, the parameters (`scope`, `redirect_uri`, `state`, `code_challenge`) go in the URL, through the browser (the front channel): they land in history, logs and extensions, can be edited by the user or by malware, have a size limit, and the client is only authenticated later. **PAR** (*Pushed Authorization Requests*, RFC 9126) sends the same parameters in a `POST` straight to the server (the back channel), with client authentication; the server validates and replies with a short-lived `request_uri`, and the browser carries only `client_id` and `request_uri`. **JAR** (*JWT-Secured Authorization Request*, RFC 9101) puts the parameters in a signed (and, if needed, encrypted) JWT, sent in `request` or by reference, and the server confirms origin and integrity. **FAPI 2.0**, from the OpenID Foundation, is a security profile that gathers requirements such as PAR, PKCE, sender-constrained tokens (see Q37), strong client authentication and an exact redirect URI; a complementary message-signing profile adds signed requests and responses. Check the current specification.",
        limite:
          "The `request_uri` is **single-use**, expires in seconds and only works for the client that requested it. And none of these mechanisms protects a user who is tricked into authorizing something they should not (phishing): they protect the **request**, not the consent.",
      },
      {
        tipo: "fluxo",
        titulo: "PAR, step by step",
        etapas: [
          "The client makes a `POST` to the PAR endpoint with the authorization parameters and authenticates (for example, with `private_key_jwt`)",
          "The authorization server validates everything right away (client, `redirect_uri`, scopes, PKCE) and rejects errors early",
          "It answers `201` with a `request_uri` and an `expires_in`, in seconds",
          "The client redirects the browser to `/authorize?client_id=...&request_uri=...`, with nothing sensitive in the URL",
          "The server retrieves the stored parameters, authenticates the user, collects consent and returns the `code` to the `redirect_uri`; the exchange for tokens goes on as usual",
        ],
        nota: "From here on it is the usual flow (authorization code with PKCE, see Q39); only the outbound leg changed.",
      },
      {
        tipo: "tabela",
        titulo: "What each piece solves and what it costs",
        colunas: ["Piece", "Problem it solves", "How", "Cost"],
        linhas: [
          [
            "PAR (RFC 9126)",
            "Parameters that are exposed, tamperable and limited by URL size; the client is authenticated only late",
            "A direct `POST` and a single-use `request_uri`",
            "One extra call, server support and a credential for the client",
          ],
          [
            "JAR (RFC 9101)",
            "Proving the request’s origin and integrity (including non-repudiation) and, if encrypted, confidentiality",
            "A signed (and encrypted) JWT in `request` or `request_uri`",
            "Managing signing keys, libraries and agreed algorithms",
          ],
          [
            "Sender-constrained tokens (Q37)",
            "A stolen token that can be reused",
            "mTLS or DPoP",
            "A PKI or a proof per request",
          ],
          [
            "FAPI 2.0",
            "Providing a closed, testable set of requirements for high-risk cases",
            "A profile combining PAR, PKCE, token binding, strong client authentication and strict validation",
            "Many requirements, confidential clients only, conformance testing and an IdP that supports the profile",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "PAR over HTTP",
        legenda: "HTTP",
        codigo: `POST /par HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded

client_id=app1&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
&client_assertion=eyJ...&response_type=code&scope=payments
&redirect_uri=https%3A%2F%2Fapp.example.com%2Fcb
&code_challenge=E9Melhoa...&code_challenge_method=S256&state=xyz

HTTP/1.1 201 Created
Content-Type: application/json

{ "request_uri": "urn:ietf:params:oauth:request_uri:6esc29fK", "expires_in": 60 }

GET /authorize?client_id=app1&request_uri=urn%3Aietf%3Aparams%3Aoauth%3Arequest_uri%3A6esc29fK`,
        nota: "The client authenticates with a JWT assertion. On the last line, the browser’s URL carries only a reference, with no `scope`, `state` or PKCE challenge in sight.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Why banks and healthcare, and when it is overkill",
        texto:
          "These sectors handle money and sensitive data, grant third parties access through consent (as in open banking or integrations with health records) and need to prove what was authorized: tampering with a request or stealing a token is expensive, and regulators and contracts tend to ask for an auditable profile. For an internal app or a low-risk SaaS, **authorization code with PKCE**, an exact redirect and short tokens (see Q39) already cover most of the risk, and the whole of FAPI 2.0 would be overkill. Adopt PAR when the server supports it and the parameters are sensitive or numerous; JAR and FAPI when a contract or regulation asks for them.",
      },
    ],
    armadilhas: [
      "Thinking PAR replaces PKCE or `state`: it protects the request, and PKCE protects the `code`. In FAPI 2.0 the two coexist.",
      "Accepting a reusable or long-lived `request_uri`: it should be single-use and short.",
      "Signing the request with JAR but accepting `alg: none` or an algorithm chosen by the client: fix the allowed algorithms on the server.",
      "Saying “we are FAPI” just because you use PAR: the profile is a set of requirements, and conformance is tested (the OpenID Foundation maintains a test suite).",
    ],
    autoteste: [
      {
        pergunta: "Which problem of the `/authorize` request does PAR solve?",
        resposta:
          "The parameters stop passing through the browser’s URL: they go straight to the server, over a channel where the client authenticates, and the server returns only a single-use `request_uri`. That avoids exposure and tampering and lets the server reject an invalid request early.",
      },
      {
        pergunta: "What is the difference between PAR and JAR?",
        resposta:
          "PAR changes the path: the parameters go straight to the server over an authenticated channel and the URL carries only a reference. JAR changes the format: the parameters become a signed JWT. The two combine: the signed JWT can be sent through PAR.",
      },
    ],
  },
};
