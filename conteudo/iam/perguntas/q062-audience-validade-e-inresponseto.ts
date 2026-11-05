import type { Pergunta } from "../../tipos";

// Q62 · Audience, validade e InResponseTo
export const q062: Pergunta = {
  numero: 62,
  modulo: "saml",
  metodo: "whys",
  pt: {
    titulo: "Audience, validade e InResponseTo",
    pergunta:
      "Por que uma assertion SAML traz Audience, NotBefore, NotOnOrAfter, Destination e InResponseTo? Que ataque cada campo impede?",
    porqueEsteMetodo:
      "Cada um desses campos existe por causa de um ataque concreto, e a lista parece burocracia até você perguntar o que aconteceria sem ele. Uma cadeia de “por quês” parte de um problema e chega ao seguinte, até o desenho completo.",
    resposta30s:
      "Uma assertion `bearer` é um documento ao portador assinado pelo IdP, e cada campo prende um eixo dele: o **`Audience`** diz para qual SP vale, o **`Destination`** (e o `Recipient`) para qual endpoint, o **`NotBefore`/`NotOnOrAfter`** por quanto tempo, o **`InResponseTo`** em resposta a qual pedido, e o **`ID`** garante uso único. Sem eles, a assertion de um SP serviria a outro, viraria credencial eterna ou poderia ser injetada e repetida.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que a assertion precisa nomear o `Audience`?",
            resposta:
              "Porque o mesmo IdP atende dezenas de SPs, e a assinatura prova só que **o IdP emitiu**, não para quem. Sem o `Audience`, um SP (ou quem interceptou a assertion num SP) poderia apresentá-la a outro SP, que veria uma assinatura válida do IdP certo e aceitaria o usuário. A restrição diz “vale só para o SP X”, e o SP confere se o próprio `entityID` está na lista.",
          },
          {
            pergunta: "Por que `NotBefore` e `NotOnOrAfter`?",
            resposta:
              "Porque o `bearer` não tem outra trava: quem copiar a assertion usa. Uma **janela curta** (minutos) limita por quanto tempo um vazamento serve. A assertion vale quando o instante atual está dentro da janela: `NotBefore` é incluído e `NotOnOrAfter` já é inválido. Relógios nunca estão perfeitos, então o SP aplica uma **tolerância pequena** (de segundos até um ou dois minutos) e mantém o relógio sincronizado por NTP; o erro típico é “ainda não vale” quando o relógio do SP está atrasado. Use sempre UTC.",
          },
          {
            pergunta: "Por que `Destination` e `Recipient`?",
            resposta:
              "Porque a resposta passa pelo navegador, e quem controla o navegador (ou um SP malicioso que recebeu a resposta) pode entregá-la a outro lugar. O `Destination`, na `Response`, e o `Recipient`, no `SubjectConfirmationData`, dizem a URL do ACS a que a resposta se destina, e o SP compara com a URL em que ela chegou. A especificação exige o `Destination` em mensagens assinadas e manda o receptor conferi-lo.",
          },
          {
            pergunta: "Por que `InResponseTo`?",
            resposta:
              "Porque, sem ele, qualquer assertion válida do IdP pode ser empurrada ao navegador da vítima (**login CSRF**) ou enviada ao SP sem pedido. O `InResponseTo` liga a resposta a um `AuthnRequest` que **este SP** fez e guardou, e o SP o consome uma vez. No fluxo iniciado pelo IdP ele não existe, e é por isso que esse fluxo é mais arriscado (veja Q57).",
          },
          {
            pergunta: "Por que ainda é preciso uso único por `ID`?",
            resposta:
              "Porque, mesmo com tudo isso, uma assertion capturada (num log, num proxy) pode ser **repetida** para o mesmo SP, mesmo ACS e mesmo `Audience`, dentro da janela de validade. O SP guarda o `ID` de cada assertion aceita até `NotOnOrAfter` mais a tolerância e rejeita repetições. O armazenamento precisa ser **compartilhado** entre as instâncias do SP; uma cache por instância deixa a repetição passar em outro servidor.",
          },
        ],
        causaRaiz:
          "Uma assertion `bearer` vale para quem a apresentar, então cada campo restringe um eixo do portador: **para quem** (`Audience`), **para onde** (`Destination`/`Recipient`), **até quando** (`NotBefore`/`NotOnOrAfter`), **em resposta a quê** (`InResponseTo`) e **quantas vezes** (`ID`). Tirar um deles abre o ataque correspondente.",
      },
      {
        tipo: "tabela",
        titulo: "Campo, ataque que impede e conferência no SP",
        colunas: ["Campo", "Ataque que impede", "O que o SP confere"],
        linhas: [
          [
            "`Audience` (em `Conditions`)",
            "Reuso entre SPs: assertion de um SP apresentada a outro",
            "O próprio `entityID` está na `AudienceRestriction` (comparação exata)",
          ],
          [
            "`NotBefore` e `NotOnOrAfter`",
            "Assertion vazada ou antiga servindo para sempre",
            "O instante atual está na janela, com tolerância pequena de relógio",
          ],
          [
            "`Destination` (na `Response`) e `Recipient` (em `SubjectConfirmationData`)",
            "Resposta destinada a um endpoint entregue a outro",
            "São iguais à URL do ACS em que a mensagem chegou",
          ],
          [
            "`InResponseTo`",
            "Resposta injetada, não solicitada ou de outro navegador (login CSRF)",
            "Corresponde a um `AuthnRequest` pendente deste SP, que é consumido",
          ],
          [
            "`ID` da assertion",
            "Replay da mesma assertion dentro da janela de validade",
            "Nunca foi visto antes; registra o `ID` até a expiração, em armazenamento compartilhado",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A validade da assertion não é a da sessão, e o SAML não tem refresh token",
        texto:
          "A assertion só precisa durar até chegar ao ACS, por isso minutos bastam. Depois de validada, o SP cria a **sessão própria**, com prazo de inatividade e prazo máximo que ele escolhe. Assertion expirada **não derruba** uma sessão já criada, e não existe renovação da assertion: **renovar é mandar o usuário de novo ao IdP** com um novo `AuthnRequest`. Se o IdP ainda tem sessão, a volta é silenciosa (`IsPassive` evita qualquer tela e falha com `NoPassive` se não houver sessão); `ForceAuthn` obriga a reautenticar, útil antes de ações sensíveis. O `SessionNotOnOrAfter`, no `AuthnStatement`, sugere até quando vale a sessão no IdP, e o SP pode limitar a dele por esse valor.",
      },
    ],
    armadilhas: [
      "Aumentar a tolerância de relógio para “o erro parar”: ela alarga a janela de replay. Corrija o relógio (NTP) e mantenha a tolerância pequena.",
      "Cache de replay local a cada instância: com várias instâncias, a mesma assertion é aceita de novo em outra. Use armazenamento compartilhado, com expiração em `NotOnOrAfter` mais a tolerância.",
      "Comparar o `Audience` por prefixo, ou aceitar assertion sem `AudienceRestriction`: a comparação é exata com o `entityID` do SP, e a falta de restrição deve ser rejeitada.",
      "Confundir o fim da assertion com o fim da sessão: o SP deve ter prazos próprios e, para ações sensíveis, exigir reautenticação.",
    ],
    autoteste: [
      {
        pergunta: "Qual ataque o `Audience` impede e qual o `InResponseTo` impede?",
        resposta:
          "O `Audience` impede usar em um SP uma assertion emitida para outro SP. O `InResponseTo` impede injetar ou repetir uma resposta que o SP não pediu (inclusive login CSRF).",
      },
      {
        pergunta: "Por que a validade da assertion pode ser de minutos e a sessão do SP durar horas?",
        resposta:
          "A assertion só precisa existir até chegar ao ACS e ser trocada por uma sessão. A sessão é do SP, com prazos próprios; renovar significa novo ciclo de autenticação com o IdP, não estender a assertion.",
      },
    ],
  },
  en: {
    titulo: "Audience, validity and InResponseTo",
    pergunta:
      "Why does a SAML assertion carry Audience, NotBefore, NotOnOrAfter, Destination and InResponseTo? Which attack does each field prevent?",
    porqueEsteMetodo:
      "Each of these fields exists because of a concrete attack, and the list looks like bureaucracy until you ask what would happen without it. A chain of whys starts from one problem and arrives at the next, until the full design appears.",
    resposta30s:
      "A `bearer` assertion is a bearer document signed by the IdP, and each field pins down one axis of it: **`Audience`** says which SP it is valid for, **`Destination`** (and `Recipient`) which endpoint, **`NotBefore`/`NotOnOrAfter`** for how long, **`InResponseTo`** in response to which request, and the **`ID`** guarantees single use. Without them, one SP’s assertion could serve another, turn into an eternal credential, or be injected and replayed.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why must the assertion name the `Audience`?",
            resposta:
              "Because the same IdP serves dozens of SPs, and the signature proves only that **the IdP issued it**, not for whom. Without `Audience`, an SP (or whoever intercepted the assertion at one SP) could present it to another SP, which would see a valid signature from the right IdP and accept the user. The restriction says “valid only for SP X”, and the SP checks that its own `entityID` is in the list.",
          },
          {
            pergunta: "Why `NotBefore` and `NotOnOrAfter`?",
            resposta:
              "Because `bearer` has no other lock: whoever copies the assertion uses it. A **short window** (minutes) limits how long a leak is useful. The assertion is valid when `now` is inside the window: `NotBefore` is included and `NotOnOrAfter` is already invalid. Clocks are never perfect, so the SP applies a **small tolerance** (from seconds up to a minute or two) and keeps its clock synchronized with NTP; the typical error is “not yet valid” when the SP’s clock is behind. Always use UTC.",
          },
          {
            pergunta: "Why `Destination` and `Recipient`?",
            resposta:
              "Because the response passes through the browser, and whoever controls the browser (or a malicious SP that received the response) can deliver it somewhere else. `Destination`, on the `Response`, and `Recipient`, in `SubjectConfirmationData`, state the ACS URL the response is meant for, and the SP compares it with the URL where it arrived. The core specification requires `Destination` on signed messages and tells the receiver to check it.",
          },
          {
            pergunta: "Why `InResponseTo`?",
            resposta:
              "Because, without it, any valid assertion from the IdP can be pushed into the victim’s browser (**login CSRF**) or sent to the SP with no request. `InResponseTo` ties the response to an `AuthnRequest` that **this SP** made and stored, and the SP consumes it once. In the IdP-initiated flow it does not exist, which is why that flow is riskier (see Q57).",
          },
          {
            pergunta: "Why is single use by `ID` still needed?",
            resposta:
              "Because, even with all of that, a captured assertion (in a log, a proxy) can be **replayed** to the same SP, same ACS and same `Audience`, within the validity window. The SP stores the `ID` of every accepted assertion until `NotOnOrAfter` plus the tolerance and rejects repeats. The store must be **shared** across the SP’s instances; a per-instance cache lets the replay through on another server.",
          },
        ],
        causaRaiz:
          "A `bearer` assertion is valid for whoever presents it, so each field restricts one axis of the bearer: **for whom** (`Audience`), **to where** (`Destination`/`Recipient`), **until when** (`NotBefore`/`NotOnOrAfter`), **in response to what** (`InResponseTo`) and **how many times** (`ID`). Remove one and the matching attack opens up.",
      },
      {
        tipo: "tabela",
        titulo: "Field, attack it prevents and check at the SP",
        colunas: ["Field", "Attack it prevents", "What the SP checks"],
        linhas: [
          [
            "`Audience` (in `Conditions`)",
            "Reuse across SPs: one SP’s assertion presented to another",
            "Its own `entityID` is in the `AudienceRestriction` (exact comparison)",
          ],
          [
            "`NotBefore` and `NotOnOrAfter`",
            "A leaked or old assertion working forever",
            "The current instant is in the window, with a small clock tolerance",
          ],
          [
            "`Destination` (on the `Response`) and `Recipient` (in `SubjectConfirmationData`)",
            "A response meant for one endpoint delivered to another",
            "They equal the ACS URL where the message arrived",
          ],
          [
            "`InResponseTo`",
            "An injected, unsolicited or other-browser response (login CSRF)",
            "It matches a pending `AuthnRequest` of this SP, which is consumed",
          ],
          [
            "Assertion `ID`",
            "Replay of the same assertion within the validity window",
            "It was never seen before; records the `ID` until expiry, in shared storage",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Assertion validity is not session validity, and SAML has no refresh token",
        texto:
          "The assertion only needs to last until it reaches the ACS, so minutes are enough. After validating it, the SP creates **its own session**, with an idle timeout and a maximum lifetime it chooses. An expired assertion **does not kill** a session already created, and there is no renewal of the assertion: **renewing means sending the user back to the IdP** with a new `AuthnRequest`. If the IdP still has a session, the return is silent (`IsPassive` avoids any screen and fails with `NoPassive` if there is no session); `ForceAuthn` forces re-authentication, useful before sensitive actions. `SessionNotOnOrAfter`, in the `AuthnStatement`, suggests how long the IdP session lasts, and the SP may cap its own by that value.",
      },
    ],
    armadilhas: [
      "Raising the clock tolerance to “make the error stop”: it widens the replay window. Fix the clock (NTP) and keep the tolerance small.",
      "A replay cache local to each instance: with several instances, the same assertion is accepted again on another one. Use shared storage, expiring at `NotOnOrAfter` plus the tolerance.",
      "Comparing `Audience` by prefix, or accepting an assertion with no `AudienceRestriction`: the comparison is exact against the SP’s `entityID`, and a missing restriction should be rejected.",
      "Confusing the end of the assertion with the end of the session: the SP should have its own lifetimes and, for sensitive actions, require re-authentication.",
    ],
    autoteste: [
      {
        pergunta: "Which attack does `Audience` prevent and which does `InResponseTo` prevent?",
        resposta:
          "`Audience` prevents using at one SP an assertion issued for another SP. `InResponseTo` prevents injecting or repeating a response the SP did not ask for (including login CSRF).",
      },
      {
        pergunta: "Why can the assertion’s validity be minutes while the SP session lasts hours?",
        resposta:
          "The assertion only needs to exist until it reaches the ACS and is exchanged for a session. The session belongs to the SP, with its own lifetimes; renewing means a new authentication cycle with the IdP, not extending the assertion.",
      },
    ],
  },
};
