import type { Pergunta } from "../../tipos";

// Q66 · Single Logout do SAML
export const q066: Pergunta = {
  numero: 66,
  modulo: "saml",
  metodo: "whys",
  pt: {
    titulo: "Single Logout do SAML",
    pergunta:
      "Por que o Single Logout do SAML é frágil? Como ele funciona e que alternativas práticas existem para encerrar sessões em várias aplicações?",
    porqueEsteMetodo:
      "A fragilidade do SLO não é um defeito de implementação: vem de como o problema é montado. Uma cadeia de “por quês” explica de onde ela vem e por que a resposta prática é desenhar em volta dela, em vez de torcer para ela funcionar.",
    resposta30s:
      "O SSO cria **uma sessão no IdP e uma em cada SP**; o **Single Logout** tenta encerrar todas com `LogoutRequest` e `LogoutResponse`, em cadeia, pelo navegador ou por um canal direto. Ele é frágil porque **depende de todos os SPs responderem**, mantém estado por sessão e pode falhar no meio, deixando sessões vivas. Na prática, use **sessões curtas, logout local sempre, revogação no IdP e reautenticação para ações sensíveis**, e trate o SLO como melhor esforço.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o SSO cria um problema de logout?",
            resposta:
              "Porque o login único é, na verdade, **várias sessões**: uma no IdP e uma em cada SP, independentes, em sistemas diferentes. Sair de uma aplicação encerra só a sessão dela; as outras e a do IdP continuam vivas. Quem sai de uma aba num computador compartilhado acredita ter saído de tudo.",
          },
          {
            pergunta: "Como o Single Logout tenta resolver isso?",
            resposta:
              "Com `LogoutRequest` e `LogoutResponse` (veja o fluxo abaixo). O IdP lembra quais SPs participam de cada sessão (pelo `SessionIndex` do login), e um logout em qualquer ponto vira uma cadeia de pedidos de encerramento a todos os participantes, até o IdP encerrar a sua sessão e responder ao SP que começou.",
          },
          {
            pergunta: "Por que a cadeia depende de todos responderem?",
            resposta:
              "Porque é uma sequência. No canal pelo navegador (**front-channel**), o IdP redireciona o navegador de SP em SP, em série; se um SP está fora do ar, lento, não implementa SLO, ou o navegador bloqueia cookies de terceiros e o SP não reconhece a sessão, a cadeia quebra no meio. No canal direto (**back-channel**, SOAP), o SP precisa ser alcançável pelo IdP e achar a sessão pelo `NameID` e pelo `SessionIndex`, já que não há cookie.",
          },
          {
            pergunta: "Por que uma falha no meio é pior que não ter SLO?",
            resposta:
              "Porque deixa um **estado parcial** que ninguém enxerga direito: algumas sessões encerradas, outras vivas, o IdP sem saber se terminou. O usuário vê “saiu com sucesso” ou um erro vago, e uma sessão com dados sensíveis segue aberta. O SLO exige estado em todos os lados (o IdP guarda os participantes; cada SP liga `SessionIndex` à sessão local), e não há transação atômica entre eles.",
          },
          {
            pergunta: "O que fazer na prática, então?",
            resposta:
              "Desenhar para o encerramento ser **eventual e seguro**, não instantâneo e universal: sessões curtas nos SPs, com renovação pelo IdP; **logout local sempre**, mesmo que o SLO falhe; revogação no IdP; e reautenticação antes de ações sensíveis. O SLO continua como melhor esforço, mostrando ao usuário, com honestidade, se terminou ou foi parcial.",
          },
        ],
        causaRaiz:
          "Não existe transação entre sessões independentes: o SLO é uma **cadeia de melhor esforço** que depende da disponibilidade e da cooperação de todos. Por isso, não o trate como garantia: combine sessões curtas, revogação e reautenticação, e faça o logout local sempre funcionar.",
      },
      {
        tipo: "fluxo",
        titulo: "Single Logout iniciado por um SP",
        etapas: [
          "O usuário clica em sair no SP A. O SP A encerra a **sessão local** e envia um `LogoutRequest` (com `NameID` e `SessionIndex`) ao endpoint de logout do IdP, por Redirect ou POST",
          "O IdP valida o pedido (a assinatura importa: sem ela, qualquer página forçaria o logout de alguém) e localiza os outros SPs que têm sessão para aquele `SessionIndex`",
          "**Front-channel:** o IdP redireciona o navegador ao SP B com um `LogoutRequest`; o SP B encerra a sessão local e devolve um `LogoutResponse` ao IdP, também pelo navegador, e assim por diante. **Back-channel:** o IdP chama cada SP diretamente, por SOAP",
          "Cada SP responde com um `LogoutResponse`, com `Status` de sucesso ou de falha",
          "O IdP encerra a própria sessão e envia um `LogoutResponse` ao SP A, também pelo navegador. Se algum participante falhou, o status pode vir como `PartialLogout`",
          "O SP A mostra o resultado. Se foi parcial, o usuário precisa saber, e fechar o navegador passa a ser a medida de segurança",
        ],
        nota: "Cada etapa extra é mais um ponto de falha: o tempo total soma o de todos os SPs, e o usuário vê uma série de redirecionamentos.",
      },
      {
        tipo: "codigo",
        titulo: "Um LogoutRequest",
        legenda: "XML",
        codigo: `<samlp:LogoutRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    ID="_lo123" Version="2.0" IssueInstant="2026-11-04T12:30:00Z"
    Destination="https://idp.example.com/saml/slo" NotOnOrAfter="2026-11-04T12:35:00Z">
  <saml:Issuer>https://app.example.com/metadata</saml:Issuer>
  <saml:NameID Format="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent">a8f3c2</saml:NameID>
  <samlp:SessionIndex>_s9</samlp:SessionIndex>
</samlp:LogoutRequest>`,
        nota: "O `SessionIndex` liga o pedido à sessão do IdP que o `AuthnStatement` anunciou no login (veja Q58). Guarde-o e o `NameID` no login e assine o pedido.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Alternativas práticas para encerrar sessões em várias aplicações",
        texto:
          "Combine: (1) **sessões curtas** no SP, com renovação silenciosa pelo IdP (um `AuthnRequest` com `IsPassive`), de modo que, ao sair do IdP, o SP perca o acesso em minutos; (2) **logout local sempre**, mais um SLO de melhor esforço que mostre se terminou ou foi parcial; (3) **revogação** da sessão e dos tokens no IdP, e conferência no SP quando houver mecanismo para isso (existem especificações mais novas para propagar eventos de sessão e segurança entre sistemas, como o Shared Signals Framework da OpenID Foundation: confira se o seu IdP as suporta); (4) **reautenticação** (`ForceAuthn`) ou checagem da idade do `AuthnInstant` antes de ações sensíveis, mesmo com a sessão ativa.",
      },
    ],
    armadilhas: [
      "Considerar o SLO uma garantia: ele é melhor esforço. Sem sessões curtas e revogação, sessões podem sobrar abertas.",
      "Aceitar `LogoutRequest` sem verificar assinatura e origem: permite forçar o logout de usuários (negação de serviço de sessão).",
      "Fazer o botão de sair depender do SLO: se o IdP está lento ou fora do ar, o usuário não consegue sair nem localmente. Encerre a sessão local primeiro.",
      "Não guardar o `SessionIndex` e o `NameID` no login: sem eles o SP não acha a sessão a encerrar quando o pedido vem do IdP, principalmente no back-channel.",
    ],
    autoteste: [
      {
        pergunta: "Por que o Single Logout do SAML pode deixar sessões vivas?",
        resposta:
          "Porque depende de uma cadeia de pedidos a todos os SPs, pelo navegador ou por canal direto. Se um SP não responde, não implementa SLO ou perde a sessão, a cadeia quebra no meio e o IdP termina com sucesso parcial.",
      },
      {
        pergunta: "Que alternativas práticas existem para encerrar sessões em várias aplicações?",
        resposta:
          "Sessões curtas com renovação pelo IdP, logout local sempre, revogação no IdP e reautenticação para ações sensíveis; o SLO fica como melhor esforço.",
      },
    ],
  },
  en: {
    titulo: "SAML Single Logout",
    pergunta:
      "Why is SAML Single Logout fragile? How does it work, and what practical alternatives exist for ending sessions across several applications?",
    porqueEsteMetodo:
      "SLO’s fragility is not an implementation defect: it comes from how the problem is built. A chain of whys explains where it comes from and why the practical answer is to design around it instead of hoping it works.",
    resposta30s:
      "SSO creates **one session at the IdP and one at each SP**; **Single Logout** tries to end them all with `LogoutRequest` and `LogoutResponse`, in a chain, through the browser or a direct channel. It is fragile because it **depends on every SP responding**, keeps per-session state and can fail midway, leaving sessions alive. In practice, use **short sessions, always a local logout, revocation at the IdP and re-authentication for sensitive actions**, and treat SLO as best effort.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does SSO create a logout problem?",
            resposta:
              "Because single sign-on is really **several sessions**: one at the IdP and one at each SP, independent, in different systems. Leaving one application ends only its own session; the others and the IdP’s stay alive. Someone who closes one tab on a shared computer believes they have left everything.",
          },
          {
            pergunta: "How does Single Logout try to solve it?",
            resposta:
              "With `LogoutRequest` and `LogoutResponse` (see the flow below). The IdP remembers which SPs take part in each session (through the login’s `SessionIndex`), and a logout at any point becomes a chain of end-session requests to all participants, until the IdP ends its own session and answers the SP that started it.",
          },
          {
            pergunta: "Why does the chain depend on everyone responding?",
            resposta:
              "Because it is a sequence. On the browser channel (**front-channel**), the IdP redirects the browser from SP to SP, in series; if an SP is down, slow, does not implement SLO, or the browser blocks third-party cookies and the SP does not recognize the session, the chain breaks midway. On the direct channel (**back-channel**, SOAP), the SP must be reachable by the IdP and find the session by `NameID` and `SessionIndex`, since there is no cookie.",
          },
          {
            pergunta: "Why is a failure midway worse than having no SLO?",
            resposta:
              "Because it leaves a **partial state** nobody can see clearly: some sessions ended, others alive, the IdP not knowing whether it finished. The user sees “logged out successfully” or a vague error, and a session with sensitive data stays open. SLO needs state on every side (the IdP stores the participants; each SP ties `SessionIndex` to the local session), and there is no atomic transaction between them.",
          },
          {
            pergunta: "So what should you do in practice?",
            resposta:
              "Design for ending sessions to be **eventual and safe**, not instant and universal: short sessions at the SPs, renewed through the IdP; **a local logout always**, even if SLO fails; revocation at the IdP; and re-authentication before sensitive actions. SLO stays as best effort, honestly telling the user whether it finished or was partial.",
          },
        ],
        causaRaiz:
          "There is no transaction across independent sessions: SLO is a **best-effort chain** that depends on the availability and cooperation of everyone. So do not treat it as a guarantee: combine short sessions, revocation and re-authentication, and make the local logout always work.",
      },
      {
        tipo: "fluxo",
        titulo: "Single Logout started by an SP",
        etapas: [
          "The user clicks sign out at SP A. SP A ends its **local session** and sends a `LogoutRequest` (with `NameID` and `SessionIndex`) to the IdP’s logout endpoint, by Redirect or POST",
          "The IdP validates the request (the signature matters: without it, any page could force someone’s logout) and finds the other SPs that have a session for that `SessionIndex`",
          "**Front-channel:** the IdP redirects the browser to SP B with a `LogoutRequest`; SP B ends its local session and returns a `LogoutResponse` to the IdP, also through the browser, and so on. **Back-channel:** the IdP calls each SP directly, over SOAP",
          "Each SP answers with a `LogoutResponse`, with a success or failure `Status`",
          "The IdP ends its own session and sends a `LogoutResponse` to SP A, also through the browser. If a participant failed, the status may come back as `PartialLogout`",
          "SP A shows the result. If it was partial, the user needs to know, and closing the browser becomes the safety measure",
        ],
        nota: "Each extra step is one more point of failure: the total time adds up that of every SP, and the user sees a series of redirects.",
      },
      {
        tipo: "codigo",
        titulo: "A LogoutRequest",
        legenda: "XML",
        codigo: `<samlp:LogoutRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    ID="_lo123" Version="2.0" IssueInstant="2026-11-04T12:30:00Z"
    Destination="https://idp.example.com/saml/slo" NotOnOrAfter="2026-11-04T12:35:00Z">
  <saml:Issuer>https://app.example.com/metadata</saml:Issuer>
  <saml:NameID Format="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent">a8f3c2</saml:NameID>
  <samlp:SessionIndex>_s9</samlp:SessionIndex>
</samlp:LogoutRequest>`,
        nota: "The `SessionIndex` ties the request to the IdP session that the `AuthnStatement` announced at login (see Q58). Store it and the `NameID` at login, and sign the request.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Practical alternatives for ending sessions across applications",
        texto:
          "Combine: (1) **short sessions** at the SP, with silent renewal through the IdP (an `AuthnRequest` with `IsPassive`), so that after signing out of the IdP the SP loses access within minutes; (2) **a local logout always**, plus a best-effort SLO that shows whether it finished or was partial; (3) **revocation** of the session and tokens at the IdP, and a check at the SP where a mechanism exists (newer specifications exist for propagating session and security events between systems, such as the OpenID Foundation’s Shared Signals Framework: check whether your IdP supports them); (4) **re-authentication** (`ForceAuthn`) or a check of the age of `AuthnInstant` before sensitive actions, even with an active session.",
      },
    ],
    armadilhas: [
      "Treating SLO as a guarantee: it is best effort. Without short sessions and revocation, sessions can be left open.",
      "Accepting a `LogoutRequest` without verifying signature and origin: it allows forcing users to be logged out (a session denial of service).",
      "Making the sign-out button depend on SLO: if the IdP is slow or down, the user cannot sign out even locally. End the local session first.",
      "Not storing the `SessionIndex` and `NameID` at login: without them the SP cannot find the session to end when the request comes from the IdP, especially on the back-channel.",
    ],
    autoteste: [
      {
        pergunta: "Why can SAML Single Logout leave sessions alive?",
        resposta:
          "Because it depends on a chain of requests to every SP, through the browser or a direct channel. If an SP does not answer, does not implement SLO or loses the session, the chain breaks midway and the IdP ends with a partial success.",
      },
      {
        pergunta: "What practical alternatives exist for ending sessions across several applications?",
        resposta:
          "Short sessions renewed through the IdP, a local logout always, revocation at the IdP and re-authentication for sensitive actions; SLO stays as best effort.",
      },
    ],
  },
};
