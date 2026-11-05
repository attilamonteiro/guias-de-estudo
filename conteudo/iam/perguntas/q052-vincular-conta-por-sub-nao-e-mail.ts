import type { Pergunta } from "../../tipos";

// Q52 · Vincular conta por sub, não e-mail
export const q052: Pergunta = {
  numero: 52,
  modulo: "oidc",
  metodo: "whys",
  pt: {
    titulo: "Vincular conta por sub, não e-mail",
    pergunta:
      "Ao aceitar login por IdPs externos (Google, Entra, corporativo), por que a conta local deve ser vinculada por iss + sub e não por e-mail? Que ataque isso evita?",
    porqueEsteMetodo:
      "A regra “vincule por `iss` + `sub`” parece um detalhe até alguém perder uma conta por causa dela. A cadeia de porquês vai do que há de errado com o e-mail até o desenho do vínculo e da união de contas.",
    resposta30s:
      "O **e-mail é um atributo**: muda, pode ser **reatribuído** e nem sempre é **verificado**, e cada IdP declara o que quiser; vincular a conta por ele permite **tomada de conta** (um IdP malicioso declarando o e-mail da vítima, ou o pre-hijacking). O **`sub` é o identificador estável do usuário dentro de um emissor**, nunca reatribuído, e como só é único por emissor a chave é o par **`iss` + `sub`**. Vínculos adicionais e união de contas devem ser **explícitos**, com prova de controle.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o e-mail parece um bom identificador, e por que não é?",
            resposta:
              "Parece bom porque é legível, único à primeira vista e igual em todos os IdPs. Mas é um **atributo**, não uma identidade: muda (casamento, troca de empresa), é **reatribuído** (o endereço de quem saiu volta ao pool, ou o domínio expira e outra pessoa o compra) e nem sempre é **verificado** (`email_verified` pode ser falso ou ausente). Pior: cada IdP declara o e-mail que quiser para as contas que controla.",
          },
          {
            pergunta: "Por que `iss` + `sub` resolve?",
            resposta:
              "O `sub` é o identificador do usuário **dentro de um emissor**: a especificação o define como estável e nunca reatribuído. Mas só é único por emissor, e dois IdPs podem emitir o mesmo `sub` para pessoas diferentes; por isso a chave é o par **`iss` + `sub`**. Em alguns IdPs o `sub` é diferente para cada aplicação (pairwise); isso não atrapalha, desde que você use sempre o valor que o seu app recebe (veja Q53 para o caso do Entra ID).",
          },
          {
            pergunta: "Que ataque o vínculo por e-mail permite?",
            resposta:
              "A **tomada de conta**, por três caminhos. Um IdP mal configurado, malicioso ou aberto declara o e-mail da vítima e a sua aplicação entra na conta dela (o caso público conhecido como nOAuth envolveu aplicações que usavam a claim `email` do Entra ID como chave). O **pre-hijacking**: o atacante cria antes uma conta local com o e-mail da vítima e, quando a vítima entra por um IdP, a junção automática entrega a conta que ele já controla. E a **reatribuição** de e-mail ou de domínio: quem passa a ter o endereço herda dados e acesso da pessoa anterior.",
          },
          {
            pergunta: "Por que `email_verified` não basta?",
            resposta:
              "Porque “verificado” é uma afirmação do IdP, e vale o que vale o IdP. Um provedor pessoal verifica que a pessoa lê aquela caixa postal hoje; um IdP de um tenant corporativo pode declarar usuários com e-mails de um domínio que não é dele. Só confie na afirmação de e-mail quando o IdP for **autoritativo para aquele domínio**, e mesmo assim para **sugerir** um vínculo, com confirmação, não como chave.",
          },
          {
            pergunta: "Como vincular e unir contas do jeito seguro?",
            resposta:
              "Guarde cada identidade externa como uma linha (`iss`, `sub`, `usuario_id`) com unicidade sobre o par. No primeiro acesso por um IdP novo, nunca junte por e-mail em silêncio: crie uma conta nova ou, se o e-mail já existe, exija **prova de controle** (entrar na conta antiga e então vincular, ou confirmar por um link enviado ao endereço). Vínculos adicionais são feitos com o usuário já autenticado, que reautentica ao confirmar. Em domínios corporativos, o domínio do e-mail serve só para **escolher o IdP** da empresa; a identidade continua sendo `iss` + `sub`.",
          },
        ],
        causaRaiz:
          "O e-mail é um **atributo declarado e mutável**; `iss` + `sub` é uma **identidade atribuída e estável** pelo emissor. Quem usa o e-mail como chave entrega a decisão de “quem é esta pessoa” a qualquer IdP que consiga declará-lo.",
      },
      {
        tipo: "tabela",
        titulo: "O que usar como chave de vínculo",
        colunas: ["Dado", "Estável?", "Confiável?", "Serve como chave?"],
        linhas: [
          ["`iss` + `sub`", "Sim, definido pelo emissor", "Sim, vem assinado no token", "Sim: é a chave de vínculo"],
          ["`sub` sozinho", "Sim, mas só dentro do emissor", "Sim", "Não: dois emissores podem repetir o valor"],
          [
            "`email`",
            "Não: muda e é reatribuído",
            "Só com `email_verified` e um IdP autoritativo para o domínio",
            "Não: no máximo, uma dica para propor um vínculo explícito",
          ],
          ["`preferred_username` e `name`", "Não", "Não", "Não: servem para exibir"],
          [
            "`tid` + `oid` (Entra ID)",
            "Sim, dentro do tenant",
            "Sim, vêm assinados",
            "Sim, no lugar de `iss` + `sub`; confira a documentação do fornecedor (veja Q53)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Entrar sem juntar contas por e-mail",
        legenda: "TypeScript",
        codigo:
          "type Claims = { iss: string; sub: string; email?: string; email_verified?: boolean };\n\nexport async function entrar(claims: Claims) {\n  // 1) A chave de verdade é o par (iss, sub)\n  const vinculo = await db.identidadeExterna.buscar({ iss: claims.iss, sub: claims.sub });\n  if (vinculo) return db.usuario.obter(vinculo.usuarioId);\n\n  // 2) Primeiro acesso por este IdP: nunca juntar por e-mail em silêncio\n  const existente = claims.email ? await db.usuario.buscarPorEmail(claims.email) : null;\n  if (existente) return pedirProvaDeControle(existente, claims); // entrar na conta antiga e confirmar\n\n  // 3) Conta nova, já vinculada\n  const novo = await db.usuario.criar({ email: claims.email, emailVerificado: claims.email_verified === true });\n  await db.identidadeExterna.criar({ iss: claims.iss, sub: claims.sub, usuarioId: novo.id });\n  return novo;\n}",
        nota: "`db` e `pedirProvaDeControle` são pseudocódigo. No banco, garanta uma restrição de unicidade sobre o par (`iss`, `sub`).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "A chave de vínculo é **`iss` + `sub`** (ou o equivalente documentado do seu IdP). O e-mail é dado de contato e, no máximo, uma **dica** para propor um vínculo, que só vale com prova de controle. A união de contas é uma ação explícita, com reautenticação, auditoria e possibilidade de desfazer. Para domínios corporativos, escolha o IdP pelo domínio do e-mail, mas identifique a pessoa pela identidade que ele emite.",
      },
    ],
    armadilhas: [
      "Fazer `SELECT ... WHERE email = ?` no callback do login e entrar na conta que vier: é o caminho clássico para a tomada de conta.",
      "Guardar só o `sub`, sem o `iss`: dois emissores diferentes podem repetir o mesmo valor e misturar pessoas.",
      "Confiar em `email_verified: true` de qualquer IdP, ou de um tenant que não é dono do domínio, como prova de que o e-mail é da pessoa.",
      "Unir contas automaticamente ou deixar um IdP novo criar contas com um e-mail que já existe: é exatamente o cenário do pre-hijacking.",
    ],
    autoteste: [
      {
        pergunta: "Por que o `sub` sozinho não basta como chave?",
        resposta:
          "Porque ele só é único dentro de um emissor. Dois IdPs diferentes podem emitir o mesmo `sub` para pessoas diferentes; guardando também o `iss`, o par identifica uma pessoa em um emissor.",
      },
      {
        pergunta: "Como permitir que a mesma pessoa entre pelo Google e pelo Entra na mesma conta?",
        resposta:
          "Com um vínculo explícito: logada em uma identidade, a pessoa adiciona a outra e reautentica ao confirmar. Cada identidade vira uma linha (`iss`, `sub`) apontando para o mesmo `usuario_id`, sem juntar nada por e-mail.",
      },
    ],
  },
  en: {
    titulo: "Linking accounts by sub, not email",
    pergunta:
      "When accepting login from external IdPs (Google, Entra, corporate), why should the local account be linked by iss + sub rather than by email? Which attack does this prevent?",
    porqueEsteMetodo:
      "The rule “link by `iss` + `sub`” looks like a detail until someone loses an account because of it. The chain of whys goes from what is wrong with email to the design of the link and of account merging.",
    resposta30s:
      "**Email is an attribute**: it changes, can be **reassigned** and is not always **verified**, and each IdP declares whatever it wants; linking the account by it allows **account takeover** (a malicious IdP declaring the victim’s email, or pre-hijacking). **`sub` is the user’s stable identifier within an issuer**, never reassigned, and since it is only unique per issuer the key is the pair **`iss` + `sub`**. Additional links and account merges must be **explicit**, with proof of control.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does email look like a good identifier, and why is it not?",
            resposta:
              "It looks good because it is readable, seemingly unique and the same across IdPs. But it is an **attribute**, not an identity: it changes (marriage, a new employer), it is **reassigned** (the address of someone who left goes back to the pool, or the domain expires and someone else buys it) and it is not always **verified** (`email_verified` may be false or missing). Worse: each IdP declares whatever email it wants for the accounts it controls.",
          },
          {
            pergunta: "Why does `iss` + `sub` solve it?",
            resposta:
              "`sub` is the user’s identifier **within an issuer**: the specification defines it as stable and never reassigned. But it is only unique per issuer, and two IdPs can issue the same `sub` to different people; hence the key is the pair **`iss` + `sub`**. In some IdPs `sub` differs per application (pairwise); that is no problem, as long as you always use the value your app receives (see Q53 for the Entra ID case).",
          },
          {
            pergunta: "Which attack does linking by email allow?",
            resposta:
              "**Account takeover**, through three paths. A misconfigured, malicious or open IdP declares the victim’s email and your application logs into their account (the public case known as nOAuth involved applications that used the Entra ID `email` claim as a key). **Pre-hijacking**: the attacker creates a local account with the victim’s email beforehand and, when the victim signs in through an IdP, the automatic merge hands over the account the attacker already controls. And **reassignment** of an email or domain: whoever gets the address inherits the previous person’s data and access.",
          },
          {
            pergunta: "Why is `email_verified` not enough?",
            resposta:
              "Because “verified” is the IdP’s statement, and it is worth what the IdP is worth. A personal provider verifies that the person reads that mailbox today; a corporate tenant’s IdP can declare users with emails from a domain it does not own. Trust an email statement only when the IdP is **authoritative for that domain**, and even then to **suggest** a link, with confirmation, not as a key.",
          },
          {
            pergunta: "How do you link and merge accounts safely?",
            resposta:
              "Store each external identity as a row (`iss`, `sub`, `user_id`) with uniqueness on the pair. On the first sign-in through a new IdP, never merge by email silently: create a new account or, if the email already exists, require **proof of control** (sign in to the old account and then link, or confirm through a link sent to the address). Additional links are made with the user already authenticated, who reauthenticates when confirming. In corporate domains, the email domain serves only to **pick the company’s IdP**; the identity is still `iss` + `sub`.",
          },
        ],
        causaRaiz:
          "Email is a **declared, mutable attribute**; `iss` + `sub` is an **identity assigned and kept stable** by the issuer. Whoever uses email as the key hands the decision of “who is this person” to any IdP able to declare it.",
      },
      {
        tipo: "tabela",
        titulo: "What to use as the linking key",
        colunas: ["Data", "Stable?", "Trustworthy?", "Works as a key?"],
        linhas: [
          [
            "`iss` + `sub`",
            "Yes, defined by the issuer",
            "Yes, it comes signed in the token",
            "Yes: it is the linking key",
          ],
          ["`sub` alone", "Yes, but only within the issuer", "Yes", "No: two issuers can repeat the value"],
          [
            "`email`",
            "No: it changes and is reassigned",
            "Only with `email_verified` and an IdP authoritative for the domain",
            "No: at most, a hint to propose an explicit link",
          ],
          ["`preferred_username` and `name`", "No", "No", "No: they are for display"],
          [
            "`tid` + `oid` (Entra ID)",
            "Yes, within the tenant",
            "Yes, they come signed",
            "Yes, in place of `iss` + `sub`; check the vendor’s documentation (see Q53)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Signing in without merging accounts by email",
        legenda: "TypeScript",
        codigo:
          "type Claims = { iss: string; sub: string; email?: string; email_verified?: boolean };\n\nexport async function signIn(claims: Claims) {\n  // 1) The real key is the pair (iss, sub)\n  const link = await db.externalIdentity.find({ iss: claims.iss, sub: claims.sub });\n  if (link) return db.user.get(link.userId);\n\n  // 2) First sign-in through this IdP: never merge by email silently\n  const existing = claims.email ? await db.user.findByEmail(claims.email) : null;\n  if (existing) return requireProofOfControl(existing, claims); // sign in to the old account and confirm\n\n  // 3) New account, already linked\n  const created = await db.user.create({ email: claims.email, emailVerified: claims.email_verified === true });\n  await db.externalIdentity.create({ iss: claims.iss, sub: claims.sub, userId: created.id });\n  return created;\n}",
        nota: "`db` and `requireProofOfControl` are pseudocode. In the database, enforce a uniqueness constraint on the pair (`iss`, `sub`).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "The linking key is **`iss` + `sub`** (or your IdP’s documented equivalent). Email is contact data and, at most, a **hint** for proposing a link, which only counts with proof of control. Merging accounts is an explicit action, with reauthentication, auditing and a way to undo it. For corporate domains, choose the IdP by the email domain, but identify the person by the identity it issues.",
      },
    ],
    armadilhas: [
      "Running `SELECT ... WHERE email = ?` in the login callback and signing in to whichever account comes back: it is the classic path to account takeover.",
      "Storing only `sub`, without `iss`: two different issuers can repeat the same value and mix up people.",
      "Trusting `email_verified: true` from any IdP, or from a tenant that does not own the domain, as proof that the email belongs to the person.",
      "Merging accounts automatically, or letting a new IdP create accounts with an email that already exists: that is exactly the pre-hijacking scenario.",
    ],
    autoteste: [
      {
        pergunta: "Why is `sub` alone not enough as a key?",
        resposta:
          "Because it is only unique within an issuer. Two different IdPs can issue the same `sub` to different people; by also storing `iss`, the pair identifies a person at one issuer.",
      },
      {
        pergunta: "How do you let the same person sign in through Google and through Entra to the same account?",
        resposta:
          "With an explicit link: signed in with one identity, the person adds the other and reauthenticates when confirming. Each identity becomes a row (`iss`, `sub`) pointing to the same `user_id`, with nothing merged by email.",
      },
    ],
  },
};
