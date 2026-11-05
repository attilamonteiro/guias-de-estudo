import type { Pergunta } from "../../tipos";

// Q57 · SP-initiated × IdP-initiated
export const q057: Pergunta = {
  numero: 57,
  modulo: "saml",
  metodo: "compare",
  pt: {
    titulo: "SP-initiated × IdP-initiated",
    pergunta:
      "Compare o SSO SAML iniciado pelo SP com o iniciado pelo IdP. Quando cada um é usado e por que o IdP-initiated é mais arriscado?",
    porqueEsteMetodo:
      "A diferença entre os dois fluxos está em poucos detalhes (quem começa, se existe pedido, o que o SP consegue conferir), e cada detalhe muda o risco. Uma matriz lado a lado mostra isso e leva direto à regra de decisão.",
    resposta30s:
      "No SSO **iniciado pelo SP**, o usuário chega à aplicação, que gera um `AuthnRequest` e o envia ao IdP; no **iniciado pelo IdP**, o usuário começa num portal do IdP e a `Response` chega ao SP **sem nenhum pedido anterior**. O SP-initiated é o padrão, porque o `InResponseTo` amarra a resposta a um pedido que o SP fez e guardou. O IdP-initiated é **mais arriscado** justamente por não ter essa amarra (facilita login CSRF e replay), então só deve servir a portais de aplicações, com mitigações.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Os dois fluxos lado a lado",
        colunas: ["Aspecto", "Iniciado pelo SP", "Iniciado pelo IdP"],
        linhas: [
          [
            "Quem começa",
            "O usuário abre a aplicação (link, favorito, URL profunda) e o SP o redireciona ao IdP",
            "O usuário abre o portal do IdP e clica no ícone da aplicação",
          ],
          [
            "`AuthnRequest`",
            "Existe: o SP o gera, com `ID`, e pode assiná-lo",
            "Não existe: o IdP envia uma resposta não solicitada (unsolicited response)",
          ],
          [
            "`InResponseTo`",
            "Presente: o SP confere com o `ID` que guardou e o consome",
            "Ausente: não há pedido para casar",
          ],
          [
            "`RelayState`",
            "Criado pelo SP e aponta para um destino que ele guardou",
            "Definido pelo IdP ou pela configuração do aplicativo, sem estado do SP que o valide: entrada não confiável",
          ],
          [
            "Volta ao destino original",
            "Natural: o SP lembra a URL que foi pedida",
            "Precisa de `RelayState` configurado no portal; costuma cair na página inicial",
          ],
          [
            "Uso típico",
            "Acesso direto à aplicação, links em e-mails, tudo o que o usuário abre fora do portal",
            "Portal corporativo ou lançador de aplicações; legado que não sabe iniciar o próprio login",
          ],
          [
            "Defesa contra login CSRF e replay",
            "Boa: a resposta só vale para um pedido pendente, ligado a este navegador",
            "Fraca: só `Audience`, destino, validade e a lista de `ID` já usados protegem",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Prefira **SP-initiated**. Habilite o IdP-initiated só quando um portal de aplicações realmente precisa dele e, mesmo assim, apenas para os IdPs e tenants que o exigem. Se o portal só precisa de um ícone, faça-o apontar para a **URL de início de login do SP**: o clique vira um fluxo iniciado pelo SP, sem resposta não solicitada, e como o IdP já tem a sessão o usuário nem vê um segundo login.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Por que o IdP-initiated é mais arriscado, e como mitigar",
        texto:
          "Sem `AuthnRequest`, o SP aceita uma resposta que não pediu. Um atacante que consiga uma assertion válida (por exemplo, fazendo login com a própria conta e interceptando a resposta) pode fazer o navegador da vítima enviá-la ao ACS: a vítima passa a estar logada **como o atacante** (**login CSRF**) e pode colocar dados na conta dele. Sem `ID` de pedido para consumir, repetir uma assertion capturada dentro da janela de validade também fica mais fácil. Mitigações: validar assinatura, `Audience`, `Destination`, `Recipient` e validade (veja Q63); **uso único** do `ID` da assertion; validade curta; aceitar respostas não solicitadas só de IdPs e tenants configurados para isso, vinculando a conta ao tenant do IdP que a emitiu; ignorar `RelayState` fora de uma lista de destinos permitidos; manter o recurso desligado por padrão.",
      },
    ],
    armadilhas: [
      "Deixar respostas não solicitadas habilitadas por padrão na biblioteca ou no produto sem precisar delas: abre a porta do login CSRF para todos os usuários.",
      "Concluir que o IdP-initiated é inseguro por definição: com validação completa, uso único, restrição por tenant e destinos permitidos ele é aceitável para portais. O erro é omitir essas defesas.",
      "Confiar no `RelayState` do fluxo iniciado pelo IdP como se tivesse vindo do SP: nenhum estado do SP o valida.",
      "Tratar o portal como substituto do início de login do SP: quem abre o favorito da aplicação precisa do SP-initiated funcionando.",
    ],
    autoteste: [
      {
        pergunta: "O que o `InResponseTo` dá ao SP-initiated que o IdP-initiated não tem?",
        resposta:
          "Uma amarra a um pedido que o próprio SP fez e guardou. O SP rejeita respostas que não casam com um pedido pendente, o que bloqueia respostas injetadas e repetidas. Sem `AuthnRequest` não há `InResponseTo`.",
      },
      {
        pergunta: "Como o ícone de um portal pode iniciar o login sem usar uma resposta não solicitada?",
        resposta:
          "Apontando o ícone para a URL de início de login do SP. O SP gera o `AuthnRequest` e o fluxo passa a ser iniciado pelo SP; como o IdP já tem a sessão, o usuário nem vê um segundo login.",
      },
    ],
  },
  en: {
    titulo: "SP-initiated vs IdP-initiated",
    pergunta: "Compare SP-initiated and IdP-initiated SAML SSO. When is each used, and why is IdP-initiated riskier?",
    porqueEsteMetodo:
      "The difference between the two flows lies in a few details (who starts, whether a request exists, what the SP can check), and each detail changes the risk. A side-by-side matrix shows that and leads straight to the decision rule.",
    resposta30s:
      "In **SP-initiated** SSO, the user arrives at the application, which builds an `AuthnRequest` and sends it to the IdP; in **IdP-initiated** SSO, the user starts at an IdP portal and the `Response` reaches the SP **with no earlier request**. SP-initiated is the default, because `InResponseTo` ties the response to a request the SP made and stored. IdP-initiated is **riskier** precisely because it lacks that tie (it makes login CSRF and replay easier), so it should only serve application portals, with mitigations.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The two flows side by side",
        colunas: ["Aspect", "SP-initiated", "IdP-initiated"],
        linhas: [
          [
            "Who starts",
            "The user opens the application (link, bookmark, deep URL) and the SP redirects them to the IdP",
            "The user opens the IdP portal and clicks the application’s icon",
          ],
          [
            "`AuthnRequest`",
            "Exists: the SP builds it, with an `ID`, and may sign it",
            "Does not exist: the IdP sends an unsolicited response",
          ],
          [
            "`InResponseTo`",
            "Present: the SP checks it against the `ID` it stored and consumes it",
            "Absent: there is no request to match",
          ],
          [
            "`RelayState`",
            "Created by the SP and points to a destination it stored",
            "Set by the IdP or by the app configuration, with no SP state to validate it: untrusted input",
          ],
          [
            "Return to the original destination",
            "Natural: the SP remembers the URL that was requested",
            "Needs `RelayState` configured in the portal; usually lands on the home page",
          ],
          [
            "Typical use",
            "Direct access to the application, links in e-mails, anything the user opens outside the portal",
            "Corporate portal or application launcher; legacy apps that cannot start their own login",
          ],
          [
            "Defense against login CSRF and replay",
            "Good: the response is only valid for a pending request, tied to this browser",
            "Weak: only `Audience`, destination, validity and the list of already-used `ID`s protect",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Prefer **SP-initiated**. Enable IdP-initiated only when an application portal really needs it and, even then, only for the IdPs and tenants that require it. If the portal only needs an icon, make it point to the SP’s **login start URL**: the click becomes an SP-initiated flow, with no unsolicited response, and since the IdP already has the session the user does not even see a second login.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Why IdP-initiated is riskier, and how to mitigate it",
        texto:
          "Without an `AuthnRequest`, the SP accepts a response it never asked for. An attacker who gets a valid assertion (for example, by logging in with their own account and intercepting the response) can make the victim’s browser submit it to the ACS: the victim ends up logged in **as the attacker** (**login CSRF**) and may put data into the attacker’s account. With no request `ID` to consume, replaying a captured assertion inside its validity window is also easier. Mitigations: validate signature, `Audience`, `Destination`, `Recipient` and validity (see Q63); **single use** of the assertion `ID`; short validity; accept unsolicited responses only from IdPs and tenants configured for it, binding the account to the tenant of the IdP that issued it; ignore any `RelayState` outside an allowlist of destinations; keep the feature off by default.",
      },
    ],
    armadilhas: [
      "Leaving unsolicited responses enabled by default in the library or product without needing them: it opens the door to login CSRF for every user.",
      "Concluding that IdP-initiated is insecure by definition: with full validation, single use, per-tenant restriction and allowed destinations it is acceptable for portals. The mistake is omitting those defenses.",
      "Trusting the `RelayState` of the IdP-initiated flow as if it came from the SP: no SP state validates it.",
      "Treating the portal as a substitute for the SP’s own login start: whoever opens the application’s bookmark needs SP-initiated to work.",
    ],
    autoteste: [
      {
        pergunta: "What does `InResponseTo` give SP-initiated that IdP-initiated lacks?",
        resposta:
          "A tie to a request the SP itself made and stored. The SP rejects responses that do not match a pending request, which blocks injected and repeated responses. With no `AuthnRequest` there is no `InResponseTo`.",
      },
      {
        pergunta: "How can a portal icon start the login without using an unsolicited response?",
        resposta:
          "By pointing the icon to the SP’s login start URL. The SP builds the `AuthnRequest` and the flow becomes SP-initiated; since the IdP already has the session, the user does not even see a second login.",
      },
    ],
  },
};
