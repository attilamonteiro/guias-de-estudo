import type { Pergunta } from "../../tipos";

// Q09 · Identidade federada
export const q009: Pergunta = {
  numero: 9,
  modulo: "fundamentos",
  metodo: "feynman",
  pt: {
    titulo: "Identidade federada",
    pergunta:
      "O que é identidade federada? Como duas organizações confiam uma na outra sem compartilhar senhas e o que muda no ciclo de vida do usuário?",
    porqueEsteMetodo:
      "Federação é um acordo entre organizações, e acordos se entendem melhor por comparação com algo do dia a dia: a carteira de habilitação aceita em outro estado. Depois entram os detalhes técnicos e o que acontece com o ciclo de vida.",
    resposta30s:
      "**Identidade federada** é um acordo de confiança entre domínios: a organização de origem (o IdP) **autentica** a pessoa e a de destino **consome uma afirmação assinada** (assertion SAML ou ID token), sem nunca receber a senha. A confiança vem de **metadados e chaves públicas** trocados antes, e atributos como e-mail e grupos são mapeados para papéis locais. O que muda no ciclo de vida: o destino passa a depender da origem para saber quem a pessoa é, e uma saída ou uma conta comprometida na origem precisa chegar ao destino.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Uma carteira de habilitação emitida num estado é aceita em outro. A locadora de carros do outro estado não liga para o órgão de trânsito a cada aluguel nem pede a sua certidão de nascimento: confere os elementos de autenticidade da carteira, lê a categoria e a validade e libera o carro. Entre os dois estados existe um acordo prévio, e a categoria B de lá equivale à categoria B daqui.",
        tecnico:
          "Na **federação**, o domínio de origem (o IdP) autentica a pessoa e emite uma afirmação assinada; o domínio de destino (o SP ou RP) confia nas chaves do IdP e consome a afirmação. Os dois trocam antes **metadados** (identificador do emissor, endereços, certificados ou JWKS) e combinam o **mapeamento de atributos** (a claim `groups` da origem vira o papel local). Um **STS** (security token service) é o componente que emite esses tokens e que também pode trocar um token de um domínio por outro. O destino costuma criar a conta local no primeiro acesso, o **JIT provisioning**, usando como chave o identificador estável do emissor.",
        limite:
          "A carteira de habilitação vale por anos; as afirmações digitais valem por minutos e para um destinatário específico (`aud`). Além disso, o destino confia **cegamente** no que a origem afirma: se a conta de origem é comprometida, o destino não tem como perceber. E, ao contrário de um documento físico, a federação não avisa sozinha o destino quando a pessoa é desligada da origem.",
      },
      {
        tipo: "fluxo",
        titulo: "Duas organizações, sem trocar senhas",
        etapas: [
          "Uma vez só: as duas trocam metadados (emissor, endpoints, chaves de assinatura), o destino registra seus endereços de retorno na origem e ambas combinam quais atributos viajam e como viram papéis",
          "No uso: a pessoa abre o aplicativo do destino, que descobre a origem dela (pelo domínio do e-mail ou por uma escolha) e a redireciona para lá",
          "A origem a autentica com as regras dela (senha, MFA) e emite uma afirmação assinada, com o mínimo de atributos necessários",
          "O destino valida assinatura, emissor, destinatário e validade, mapeia os atributos para papéis locais e cria ou atualiza a conta local (JIT), com permissões mínimas",
          "No ciclo de vida: se a pessoa sai da origem, o destino só percebe no próximo login ou por um desprovisionamento explícito (SCIM, sessões curtas, revisões)",
          "Se a conta de origem for comprometida, o destino aceita o atacante até alguém revogar sessões na origem ou cortar a federação",
        ],
        nota: "A conta local de destino é um registro à parte: ela não desaparece quando a de origem some, a menos que algo a remova.",
      },
      {
        tipo: "tabela",
        titulo: "Os modelos de federação",
        colunas: ["Modelo", "De onde vem a identidade", "Quem decide o acesso", "Atenção"],
        linhas: [
          [
            "B2B (parceiros, clientes corporativos)",
            "O IdP corporativo da outra organização",
            "O destino, sobre o que o parceiro pode ver",
            "A origem controla o ciclo de vida; exija MFA nas claims e limite o acesso no tempo",
          ],
          [
            "B2C (consumidores)",
            "Um cadastro próprio de clientes, ou um IdP de clientes",
            "A própria aplicação",
            "Escala, privacidade, recuperação de conta e antifraude pesam mais",
          ],
          [
            "Login social",
            "Um IdP de terceiros (conta de um grande provedor)",
            "A própria aplicação",
            "O e-mail vem do terceiro: confira se é verificado e vincule contas com prova de controle",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O risco de a conta de origem ser comprometida, e como protegê-la",
        texto:
          "A federação **transfere a confiança**: quem controla a origem controla o acesso ao destino. Reduza o estrago exigindo prova de MFA na assertion (as claims `acr` e `amr`, ou o contexto equivalente do SAML), com acesso condicional, sessões e tokens de vida curta, privilégios mínimos para usuários externos e revisão periódica. Valide sempre assinatura, `iss`, `aud` e validade, e proteja e rotacione as chaves de assinatura: quem as roubar consegue forjar afirmações para qualquer usuário. Use o identificador estável como chave da conta (veja Q02), nunca o e-mail.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Federação, STS e Zero Trust; usuário interno e externo",
        texto:
          "O **STS** é o serviço da origem que emite os tokens da federação (muitos IdPs têm um embutido). Os protocolos SAML, OAuth e OpenID Connect apoiam o **Zero Trust** porque centralizam a verificação de identidade e de MFA em cada acesso, em vez de confiar na rede (veja NIST SP 800-207). As **políticas diferem**: o usuário interno costuma ter dispositivo gerenciado, ciclo de vida ligado ao RH e acesso mais amplo; o externo recebe o menor conjunto possível, com MFA obrigatório, validade curta e revisões mais frequentes.",
      },
    ],
    armadilhas: [
      "Achar que federar é compartilhar senhas ou bases de usuários: o destino só recebe uma afirmação assinada, e a senha fica na origem.",
      "Ligar a conta local pelo e-mail vindo da origem: ele pode mudar, ser reaproveitado ou não ser verificado; use `iss` + `sub`.",
      "Esquecer o desligamento: sem SCIM, sessões curtas ou revisão, a conta do destino sobrevive a quem saiu da origem.",
      "Aceitar atributos demais ou papéis automáticos sem limite: uma claim errada na origem vira privilégio no destino.",
    ],
    autoteste: [
      {
        pergunta: "Como duas organizações confiam uma na outra sem compartilhar senhas?",
        resposta:
          "Trocando metadados e chaves públicas de antemão: a origem autentica a pessoa e assina uma afirmação, e o destino confia nessa assinatura. A senha nunca sai da origem.",
      },
      {
        pergunta: "O que muda no ciclo de vida do usuário numa federação B2B?",
        resposta:
          "A origem passa a mandar na identidade, o destino cria a conta local no primeiro acesso (JIT) e precisa de um mecanismo para saber quando a pessoa sai ou muda de função, como SCIM, sessões curtas e revisões. Sem isso, a conta do destino fica órfã.",
      },
    ],
  },
  en: {
    titulo: "Federated identity",
    pergunta:
      "What is federated identity? How do two organizations trust each other without sharing passwords, and what changes in the user lifecycle?",
    porqueEsteMetodo:
      "Federation is an agreement between organizations, and agreements are easier to grasp by comparison with something everyday: a driver’s license accepted in another state. The technical details and what happens to the lifecycle come after.",
    resposta30s:
      "**Federated identity** is a trust agreement between domains: the home organization (the IdP) **authenticates** the person and the destination **consumes a signed statement** (a SAML assertion or ID token), never receiving the password. Trust comes from **metadata and public keys** exchanged beforehand, and attributes such as email and groups are mapped to local roles. What changes in the lifecycle: the destination now depends on the origin to know who the person is, and a departure or a compromised account at the origin has to reach the destination.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "A driver’s license issued in one state is accepted in another. The car rental in the other state does not call the licensing authority on every rental or ask for your birth certificate: it checks the license’s authenticity features, reads the category and the expiry and hands over the car. Between the two states there is a prior agreement, and category B there is equivalent to category B here.",
        tecnico:
          "In **federation**, the home domain (the IdP) authenticates the person and issues a signed statement; the destination domain (the SP or RP) trusts the IdP’s keys and consumes the statement. The two exchange **metadata** beforehand (issuer identifier, endpoints, certificates or JWKS) and agree on an **attribute mapping** (the origin’s `groups` claim becomes the local role). A **STS** (security token service) is the component that issues these tokens and may also exchange a token from one domain for another. The destination usually creates the local account at first access, **JIT provisioning**, using the issuer’s stable identifier as the key.",
        limite:
          "A driver’s license is valid for years; digital statements are valid for minutes and for a specific audience (`aud`). Also, the destination trusts **blindly** what the origin states: if the origin account is compromised, the destination cannot tell. And unlike a physical document, federation does not by itself tell the destination when the person is removed at the origin.",
      },
      {
        tipo: "fluxo",
        titulo: "Two organizations, no passwords exchanged",
        etapas: [
          "Once: the two exchange metadata (issuer, endpoints, signing keys), the destination registers its return addresses at the origin and both agree which attributes travel and how they become roles",
          "In use: the person opens the destination application, which finds their origin (from the email domain or a choice) and redirects them there",
          "The origin authenticates them with its own rules (password, MFA) and issues a signed statement, with the minimum attributes needed",
          "The destination validates signature, issuer, audience and validity, maps the attributes to local roles and creates or updates the local account (JIT), with minimal permissions",
          "In the lifecycle: if the person leaves the origin, the destination only notices at the next login or through explicit deprovisioning (SCIM, short sessions, reviews)",
          "If the origin account is compromised, the destination accepts the attacker until someone revokes sessions at the origin or cuts the federation",
        ],
        nota: "The destination’s local account is a separate record: it does not vanish when the origin account disappears, unless something removes it.",
      },
      {
        tipo: "tabela",
        titulo: "The federation models",
        colunas: ["Model", "Where the identity comes from", "Who decides access", "Watch out for"],
        linhas: [
          [
            "B2B (partners, corporate customers)",
            "The other organization’s corporate IdP",
            "The destination, over what the partner may see",
            "The origin controls the lifecycle; require MFA in the claims and limit access in time",
          ],
          [
            "B2C (consumers)",
            "Your own customer directory, or a customer IdP",
            "The application itself",
            "Scale, privacy, account recovery and anti-fraud weigh more",
          ],
          [
            "Social login",
            "A third-party IdP (an account at a large provider)",
            "The application itself",
            "The email comes from a third party: check that it is verified and link accounts with proof of control",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The risk of a compromised origin account, and how to protect against it",
        texto:
          "Federation **transfers trust**: whoever controls the origin controls access to the destination. Reduce the damage by requiring proof of MFA in the assertion (the `acr` and `amr` claims, or the SAML equivalent), with conditional access, short-lived sessions and tokens, minimal privileges for external users and periodic review. Always validate signature, `iss`, `aud` and validity, and protect and rotate the signing keys: whoever steals them can forge statements for any user. Use the stable identifier as the account key (see Q02), never the email.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Federation, STS and Zero Trust; internal and external users",
        texto:
          "The **STS** is the origin’s service that issues the federation tokens (many IdPs have one built in). SAML, OAuth and OpenID Connect support **Zero Trust** because they centralize identity and MFA verification at each access instead of trusting the network (see NIST SP 800-207). **Policies differ**: the internal user usually has a managed device, a lifecycle tied to HR and broader access; the external user gets the smallest possible set, with mandatory MFA, short validity and more frequent reviews.",
      },
    ],
    armadilhas: [
      "Thinking federation means sharing passwords or user databases: the destination only receives a signed statement, and the password stays at the origin.",
      "Linking the local account by the email from the origin: it can change, be reused or be unverified; use `iss` + `sub`.",
      "Forgetting deprovisioning: without SCIM, short sessions or review, the destination account outlives the person who left the origin.",
      "Accepting too many attributes or automatic roles without limits: a wrong claim at the origin becomes privilege at the destination.",
    ],
    autoteste: [
      {
        pergunta: "How do two organizations trust each other without sharing passwords?",
        resposta:
          "By exchanging metadata and public keys beforehand: the origin authenticates the person and signs a statement, and the destination trusts that signature. The password never leaves the origin.",
      },
      {
        pergunta: "What changes in the user lifecycle in a B2B federation?",
        resposta:
          "The origin now rules the identity, the destination creates the local account at first access (JIT) and needs a mechanism to learn when the person leaves or changes role, such as SCIM, short sessions and reviews. Without it, the destination account is orphaned.",
      },
    ],
  },
};
