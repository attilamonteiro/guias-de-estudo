import type { Pergunta } from "../../tipos";

// Q60 · NameID e atributos
export const q060: Pergunta = {
  numero: 60,
  modulo: "saml",
  metodo: "feynman",
  pt: {
    titulo: "NameID e atributos",
    pergunta:
      "Como o SAML identifica o usuário (NameID e seus formatos) e transmite atributos? Como mapear isso para contas e papéis na aplicação?",
    porqueEsteMetodo:
      "A armadilha desta pergunta é intuitiva: identificar alguém pelo que muda (o e-mail) em vez do que não muda. Uma analogia com matrícula e endereço deixa isso claro antes dos formatos e do mapeamento.",
    resposta30s:
      "O **`NameID`** é o identificador do usuário na assertion, num **formato** (`persistent` é opaco e estável por SP, `transient` muda a cada sessão, `emailAddress` é um e-mail, `unspecified` fica a critério do IdP); os **atributos** (e-mail, nome, grupos) vêm no `AttributeStatement`. Para mapear para contas e papéis, vincule a conta ao **identificador estável** (emissor mais `NameID`), nunca ao e-mail, e converta **grupos em papéis** por uma tabela do SP, recalculada a cada login.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense na **matrícula** de um aluno e no **endereço** onde ele mora. A matrícula identifica a pessoa e não muda; o endereço muda quando ela se muda, e outra pessoa pode passar a morar lá. Se a escola guardasse as notas pelo endereço, ao se mudar o aluno perderia o histórico, e quem ocupasse o endereço antigo poderia receber o boletim dele. Os atributos são o resto do cadastro: nome, turma, curso.",
        tecnico:
          "O `NameID` fica no `Subject` e tem um `Format`. **`persistent`** é um identificador opaco e estável, em geral diferente para cada SP (privacidade). **`transient`** é um valor aleatório que vale só naquela sessão, bom para acesso sem conta, ruim para vincular. **`emailAddress`** e **`unspecified`** vêm do SAML 1.1 (`urn:oasis:names:tc:SAML:1.1:nameid-format:...`): o primeiro é um e-mail; o segundo deixa o IdP escolher o que mandar. O SP pede o formato no `NameIDPolicy` do `AuthnRequest` e declara os que aceita no metadata. Os **atributos** vão no `AttributeStatement`, cada um com um `Name` (às vezes com `NameFormat` e `FriendlyName`) e um ou mais `AttributeValue`. O SP declara os que precisa no `AttributeConsumingService` do metadata, e o IdP é configurado para enviá-los.",
        limite:
          "A matrícula é a mesma em qualquer lugar; um `NameID` `persistent` costuma ser **diferente para cada SP** (um pseudônimo por par IdP-SP) e muda se você trocar de IdP ou de `entityID`. Por isso o vínculo guarda emissor e `NameID` juntos, e uma migração de IdP exige um plano de re-vínculo.",
      },
      {
        tipo: "tabela",
        titulo: "Formatos de NameID",
        colunas: ["Formato", "O que é", "Estável?", "Quando usar"],
        linhas: [
          [
            "`persistent`",
            "Identificador opaco, em geral diferente para cada SP",
            "Sim, enquanto o par IdP-SP não mudar",
            "Padrão para vincular contas",
          ],
          [
            "`transient`",
            "Valor aleatório que vale por uma sessão",
            "Não",
            "Acesso anônimo ou sem conta; nunca para vincular conta",
          ],
          [
            "`emailAddress`",
            "O e-mail do usuário",
            "Não: o e-mail pode mudar e ser reatribuído",
            "Quando o SP só sabe usar e-mail; vincule com cuidado (veja o aviso adiante)",
          ],
          [
            "`unspecified`",
            "O IdP decide o que mandar (login, matrícula, e-mail…)",
            "Depende do IdP",
            "Só quando combinado e documentado com o IdP",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "AttributeConsumingService",
        texto:
          "No metadata do SP, o `AttributeConsumingService` lista o `ServiceName` e os `RequestedAttribute` (nome, formato e se é obrigatório). Serve para o administrador do IdP saber o que configurar e, em alguns IdPs, para liberar os atributos automaticamente; o `AuthnRequest` pode escolher qual descrição usar (`AttributeConsumingServiceIndex`). Mas é um **pedido**: o IdP não é obrigado a atender, e muitos produtos exigem configurar as regras de atributos manualmente. Valide na integração que cada atributo obrigatório de fato chega.",
      },
      {
        tipo: "codigo",
        titulo: "Vincular a conta pelo identificador certo e mapear grupos",
        legenda: "TypeScript",
        codigo: `interface PerfilSaml { issuer: string; nameId: string; email?: string; grupos: string[] }
interface Conta { chave: string; email: string; papeis: string[] }

const PAPEL_DO_GRUPO = new Map([["grp-financeiro", "financeiro"], ["grp-admin", "admin"]]);

export function contaDaAssertion(contas: Map<string, Conta>, p: PerfilSaml): Conta {
  // chave estável: quem emitiu + NameID persistent. O e-mail NÃO é a chave.
  const chave = p.issuer + "|" + p.nameId;
  const conta = contas.get(chave) ?? { chave, email: "", papeis: [] }; // JIT na 1ª vez
  conta.email = p.email ?? conta.email; // atributo mutável, atualizado a cada login
  // recalculado a cada login; grupo sem mapeamento não vira papel
  conta.papeis = p.grupos.flatMap((g) => PAPEL_DO_GRUPO.get(g) ?? []);
  contas.set(chave, conta);
  return conta;
}`,
        nota: "Os papéis são recalculados a cada login: remover alguém do grupo no IdP tira o papel no próximo acesso. O perfil já vem de uma assertion validada (veja Q63).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Atributos mal configurados e vínculo de conta",
        texto:
          "Falhas comuns: o IdP manda `unspecified` ou e-mail e o SP esperava `persistent`; o nome do atributo não bate (`email`, `mail` ou uma URI de claim); o atributo vem ausente ou vazio; grupos chegam como identificadores em vez de nomes; ou o IdP limita quantos grupos envia. Trate atributo obrigatório ausente como erro de configuração (recuse o login com mensagem útil) e **nunca conceda papel por omissão**. No **JIT provisioning** (criar a conta no primeiro login a partir da assertion), crie com o papel mínimo; o JIT não remove contas, então o desligamento de pessoas pede outro mecanismo (por exemplo, SCIM) ou sessões curtas. E não vincule uma assertion nova a uma conta existente só porque o e-mail é igual: se o IdP não confirma e-mails, isso permite sequestrar a conta.",
      },
    ],
    armadilhas: [
      "Usar o e-mail como chave da conta: ele muda, é reatribuído e, em IdPs que não o verificam, pode ser definido pelo atacante. A chave é emissor mais `NameID` persistente.",
      "Usar `transient` para vincular conta: cada login gera um valor novo e o usuário vira uma conta nova a cada acesso.",
      "Aceitar `unspecified` sem saber o que o IdP manda: o valor pode mudar de significado quando alguém reconfigura o IdP.",
      "Mapear grupos para papéis só na criação da conta: os papéis ficam desatualizados quando alguém sai do grupo. Recalcule a cada login.",
    ],
    autoteste: [
      {
        pergunta: "Por que `persistent` é melhor que `emailAddress` para identificar o usuário?",
        resposta:
          "O `persistent` é estável e opaco: não muda quando o e-mail muda e não pode ser reatribuído a outra pessoa. O e-mail pode mudar ou ser reutilizado, o que quebra o vínculo ou liga a conta à pessoa errada.",
      },
      {
        pergunta: "Para que serve o `AttributeConsumingService`?",
        resposta:
          "O SP declara no metadata os atributos de que precisa (`RequestedAttribute`, com `isRequired`). Orienta a configuração do IdP, mas é um pedido: o IdP envia o que estiver configurado para enviar.",
      },
    ],
  },
  en: {
    titulo: "NameID and attributes",
    pergunta:
      "How does SAML identify the user (NameID and its formats) and convey attributes? How do you map that to accounts and roles in the application?",
    porqueEsteMetodo:
      "The trap in this question is an intuitive one: identifying someone by what changes (the e-mail) instead of what does not. An analogy with a student ID and a home address makes that clear before the formats and the mapping.",
    resposta30s:
      "The **`NameID`** is the user’s identifier in the assertion, in a **format** (`persistent` is opaque and stable per SP, `transient` changes every session, `emailAddress` is an e-mail, `unspecified` is up to the IdP); the **attributes** (e-mail, name, groups) come in the `AttributeStatement`. To map to accounts and roles, link the account to the **stable identifier** (issuer plus `NameID`), never to the e-mail, and turn **groups into roles** with a table owned by the SP, recomputed on every login.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a student’s **ID number** and the **address** where they live. The ID identifies the person and does not change; the address changes when they move, and someone else may move in. If the school filed grades by address, the student would lose their history after moving, and whoever took over the old address might receive their report card. Attributes are the rest of the record: name, class, course.",
        tecnico:
          "The `NameID` sits in the `Subject` and has a `Format`. **`persistent`** is an opaque, stable identifier, usually different for each SP (privacy). **`transient`** is a random value valid only for that session: fine for access without an account, bad for linking. **`emailAddress`** and **`unspecified`** come from SAML 1.1 (`urn:oasis:names:tc:SAML:1.1:nameid-format:...`): the first is an e-mail; the second lets the IdP choose what to send. The SP requests the format in the `AuthnRequest`’s `NameIDPolicy` and declares the ones it accepts in the metadata. **Attributes** go in the `AttributeStatement`, each with a `Name` (sometimes with `NameFormat` and `FriendlyName`) and one or more `AttributeValue`s. The SP declares the ones it needs in the metadata’s `AttributeConsumingService`, and the IdP is configured to send them.",
        limite:
          "An ID number is the same everywhere; a `persistent` `NameID` is usually **different for each SP** (a pseudonym per IdP-SP pair) and changes if you switch IdP or `entityID`. That is why the link stores issuer and `NameID` together, and an IdP migration requires a re-linking plan.",
      },
      {
        tipo: "tabela",
        titulo: "NameID formats",
        colunas: ["Format", "What it is", "Stable?", "When to use"],
        linhas: [
          [
            "`persistent`",
            "Opaque identifier, usually different for each SP",
            "Yes, as long as the IdP-SP pair does not change",
            "The default for linking accounts",
          ],
          [
            "`transient`",
            "Random value valid for one session",
            "No",
            "Anonymous access or access without an account; never for linking an account",
          ],
          [
            "`emailAddress`",
            "The user’s e-mail",
            "No: an e-mail can change and be reassigned",
            "When the SP only knows how to use e-mail; link with care (see the warning below)",
          ],
          [
            "`unspecified`",
            "The IdP decides what to send (login, employee number, e-mail…)",
            "Depends on the IdP",
            "Only when agreed and documented with the IdP",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "AttributeConsumingService",
        texto:
          "In the SP metadata, the `AttributeConsumingService` lists the `ServiceName` and the `RequestedAttribute`s (name, format and whether it is required). It tells the IdP administrator what to configure and, on some IdPs, releases the attributes automatically; the `AuthnRequest` can choose which description to use (`AttributeConsumingServiceIndex`). But it is a **request**: the IdP is not obliged to honor it, and many products require configuring attribute rules by hand. Verify during integration that every required attribute actually arrives.",
      },
      {
        tipo: "codigo",
        titulo: "Linking the account by the right identifier and mapping groups",
        legenda: "TypeScript",
        codigo: `interface SamlProfile { issuer: string; nameId: string; email?: string; groups: string[] }
interface Account { key: string; email: string; roles: string[] }

const ROLE_OF_GROUP = new Map([["grp-finance", "finance"], ["grp-admin", "admin"]]);

export function accountFromAssertion(accounts: Map<string, Account>, p: SamlProfile): Account {
  // stable key: issuer + persistent NameID. The e-mail is NOT the key.
  const key = p.issuer + "|" + p.nameId;
  const account = accounts.get(key) ?? { key, email: "", roles: [] }; // JIT on first login
  account.email = p.email ?? account.email; // mutable attribute, refreshed on every login
  // recomputed on every login; an unmapped group does not become a role
  account.roles = p.groups.flatMap((g) => ROLE_OF_GROUP.get(g) ?? []);
  accounts.set(key, account);
  return account;
}`,
        nota: "Roles are recomputed on every login: removing someone from the group at the IdP takes the role away on the next access. The profile already comes from a validated assertion (see Q63).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Misconfigured attributes and account linking",
        texto:
          "Common failures: the IdP sends `unspecified` or e-mail and the SP expected `persistent`; the attribute name does not match (`email`, `mail` or a claim URI); the attribute arrives missing or empty; groups arrive as identifiers instead of names; or the IdP limits how many groups it sends. Treat a missing required attribute as a configuration error (refuse the login with a useful message) and **never grant a role by omission**. With **JIT provisioning** (creating the account on first login from the assertion), create it with the minimum role; JIT does not remove accounts, so offboarding people calls for another mechanism (for example, SCIM) or short sessions. And do not link a new assertion to an existing account just because the e-mail is equal: if the IdP does not verify e-mails, that allows account takeover.",
      },
    ],
    armadilhas: [
      "Using the e-mail as the account key: it changes, gets reassigned and, on IdPs that do not verify it, can be set by the attacker. The key is issuer plus persistent `NameID`.",
      "Using `transient` to link an account: every login produces a new value and the user becomes a new account on each access.",
      "Accepting `unspecified` without knowing what the IdP sends: the value can change meaning when someone reconfigures the IdP.",
      "Mapping groups to roles only when the account is created: roles go stale when someone leaves the group. Recompute on every login.",
    ],
    autoteste: [
      {
        pergunta: "Why is `persistent` better than `emailAddress` for identifying the user?",
        resposta:
          "`persistent` is stable and opaque: it does not change when the e-mail changes and cannot be reassigned to another person. An e-mail can change or be reused, which breaks the link or ties the account to the wrong person.",
      },
      {
        pergunta: "What is the `AttributeConsumingService` for?",
        resposta:
          "The SP declares in the metadata the attributes it needs (`RequestedAttribute`, with `isRequired`). It guides the IdP configuration, but it is a request: the IdP sends what it is configured to send.",
      },
    ],
  },
};
