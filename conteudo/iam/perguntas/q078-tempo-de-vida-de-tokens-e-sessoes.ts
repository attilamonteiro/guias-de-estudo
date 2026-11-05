import type { Pergunta } from "../../tipos";

// Q78 · Tempo de vida de tokens e sessões
export const q078: Pergunta = {
  numero: 78,
  modulo: "tokens-e-sessoes",
  metodo: "feynman",
  pt: {
    titulo: "Tempo de vida de tokens e sessões",
    pergunta:
      "Como definir tempos de vida para access tokens, refresh tokens e sessões? Explique expiração ociosa × absoluta, sessões longas e o equilíbrio entre segurança e usabilidade.",
    porqueEsteMetodo:
      "Tempo de vida parece uma questão de configuração até você enxergar o que ele protege. Uma imagem do dia a dia (o ingresso com horário) mostra a lógica, e o mecanismo real explica os valores e os três relógios de uma sessão.",
    resposta30s:
      "O tempo de vida limita a **janela de abuso** de uma credencial roubada ou esquecida: **access tokens curtos** (minutos), **refresh tokens** mais longos, porém rotacionados e com teto, e sessões com **expiração ociosa** (some depois de um tempo sem uso) e **absoluta** (acaba mesmo com atividade). Use sessão deslizante só dentro de um teto absoluto e peça **reautenticação** nas ações sensíveis, em vez de encurtar tudo para todo mundo. O valor certo depende do dano de um roubo e da política da organização: o equilíbrio é entre segurança e interrupção do usuário.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense num ingresso de cinema com horário. Ele só vale para aquela sessão: se alguém o perder ou o roubar, o prejuízo acaba quando o filme termina, e o porteiro nem precisa ligar para a bilheteria para conferir. Quem quer passar a tarde no complexo não compra um ingresso eterno: volta à bilheteria, que confere o comprovante, pode recusar e entrega outro para a sessão seguinte. E, para entrar na sala VIP, o segurança pede o documento de novo, mesmo com o ingresso em dia.",
        tecnico:
          "O **access token** é o ingresso: vida curta (minutos), validado localmente pela API, e limita a janela de uso de um token roubado. O **refresh token** é o comprovante: vida mais longa, sob controle do servidor de autorização, que pode recusá-lo, rotacioná-lo e reavaliar conta, MFA e política a cada renovação (veja Q34). A **sessão** (cookie ou SSO) tem relógios próprios: a **expiração ociosa** encerra depois de um tempo sem uso, a **absoluta** encerra um tempo fixo depois do login, mesmo com atividade, e a **deslizante** estende o prazo a cada uso, sempre dentro do teto absoluto. Ações sensíveis pedem **reautenticação recente** (`max_age` e `auth_time`; veja Q50 e Q99). O tempo aparece em toda a autenticação porque limita a janela de abuso e força a revalidação: código de autorização que vale segundos, TOTP que muda a cada 30 segundos, asserção SAML com validade, `exp`, `nbf` e `iat` nos tokens.",
        limite:
          "O ingresso de papel não percebe quando é copiado; um refresh token percebe, porque o reuso de um token já rotacionado denuncia a cópia. E a analogia não dá número: não existe prazo certo, só o que cabe no dano de um roubo, na política da organização e nos requisitos regulatórios. Prazo curto também não substitui revogação: logout, troca de senha e desligamento precisam encerrar a sessão de fato (veja Q77 e Q82).",
      },
      {
        tipo: "tabela",
        titulo: "Os três relógios de uma sessão",
        colunas: ["Relógio", "Como funciona", "Protege contra", "Custo"],
        linhas: [
          [
            "Ociosa (idle)",
            "Encerra depois de N minutos sem atividade",
            "Dispositivo desbloqueado e abandonado, computador compartilhado, aba esquecida",
            "Quem faz pausas longas precisa entrar de novo",
          ],
          [
            "Absoluta",
            "Encerra X horas depois do login, haja ou não atividade",
            "Sessão roubada e mantida viva por um script, credencial que nunca é reavaliada",
            "O usuário ativo é interrompido no meio do trabalho, a menos que a renovação seja silenciosa",
          ],
          [
            "Deslizante (rolling)",
            "Cada uso empurra a expiração para a frente",
            "Interrupção de quem está em uso (é conveniência, não proteção)",
            "Sozinha nunca expira se o uso for contínuo: precisa do teto absoluto",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Ponto de partida por criticidade (ordens de grandeza, não norma)",
        colunas: ["Tipo de aplicação", "Access token", "Sessão: ociosa e absoluta", "Observações"],
        linhas: [
          [
            "Baixo risco (conteúdo, leitura, sem dados pessoais)",
            "Até cerca de uma hora",
            "Ociosa de dias a semanas; absoluta longa",
            "“Lembrar de mim” aceitável, com credencial própria e menos poder",
          ],
          [
            "Aplicação de negócio comum (SaaS, dados da empresa)",
            "De poucos minutos a cerca de uma hora",
            "Ociosa de dezenas de minutos a poucas horas; absoluta de uma jornada de trabalho",
            "Refresh token com rotação e teto absoluto; reautenticação para ações sensíveis",
          ],
          [
            "Back-office, dados pessoais ou administração",
            "Poucos minutos",
            "Ociosa curta (dezenas de minutos); absoluta de algumas horas",
            "MFA recente para ações de alto impacto; sem “lembrar de mim”",
          ],
          [
            "Financeiro, saúde, administração de identidade",
            "Poucos minutos",
            "Ociosa de poucos minutos a dezenas de minutos; absoluta curta",
            "Reautenticação por operação (step-up); siga o regulamento e o nível de garantia exigido",
          ],
        ],
        nota: "São pontos de partida, não uma norma. Quem manda são a política da organização, o regulamento aplicável e o nível de garantia de autenticação (veja Q102 e a NIST SP 800-63B, que trata de limites de reautenticação por nível; confira a revisão vigente).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Parta do dano de um token ou cookie roubado: quanto maior o dano, mais curtos o access token e a janela ociosa. Dê sempre um **teto absoluto** ao que é deslizante. E, em vez de encurtar tudo para todo mundo, peça **reautenticação** só nas ações sensíveis.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Refresh e “lembrar de mim” reabrem a janela",
        texto:
          "Um refresh token sem rotação, sem prazo ocioso e sem teto absoluto é uma sessão eterna: a credencial roubada dura para sempre e a conta desligada segue entrando. “Lembrar de mim” deve usar uma credencial separada, com menos poder, e não dispensa a reautenticação nas ações sensíveis.",
      },
    ],
    armadilhas: [
      "Sessão deslizante sem teto absoluto: com uso contínuo (ou um script que faz requisições periódicas) ela nunca expira.",
      "Refresh token sem rotação e sem prazos ocioso e absoluto: vira uma credencial eterna, mais valiosa que o access token que ele renova.",
      "Access token de horas ou dias “para não incomodar”: é o prazo curto que limita o roubo; use refresh e renovação silenciosa.",
      "Achar que prazo curto substitui revogação: logout, troca de senha e desligamento precisam encerrar a sessão de verdade (veja Q77 e Q82).",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre expiração ociosa e absoluta, e por que usar as duas?",
        resposta:
          "A ociosa encerra depois de um tempo sem uso; a absoluta encerra um tempo fixo depois do login, mesmo com atividade. A ociosa limita o abandono; a absoluta limita a vida de uma credencial roubada e mantida viva. Só com a ociosa, o uso contínuo estende a sessão para sempre.",
      },
      {
        pergunta:
          "Se o usuário fica logado o dia todo, por que um access token de 15 minutos com refresh é mais seguro do que um de 24 horas?",
        resposta:
          "Um access token roubado serve por 15 minutos no máximo, e cada renovação passa pelo servidor de autorização, que reavalia a conta e a política e detecta o reuso de um refresh token copiado. Com 24 horas, o roubo vale o dia inteiro e ninguém reavalia nada nesse tempo.",
      },
    ],
  },
  en: {
    titulo: "Token and session lifetimes",
    pergunta:
      "How do you set lifetimes for access tokens, refresh tokens and sessions? Explain idle versus absolute expiration, long-lived sessions and the trade-off between security and usability.",
    porqueEsteMetodo:
      "Lifetime looks like a configuration detail until you see what it protects. An everyday picture (a ticket with a showtime) shows the logic, and the real mechanism explains the values and the three clocks of a session.",
    resposta30s:
      "Lifetime limits the **abuse window** of a stolen or forgotten credential: **short access tokens** (minutes), **refresh tokens** that live longer but are rotated and capped, and sessions with **idle expiration** (it ends after a stretch of no use) and **absolute expiration** (it ends even with activity). Use sliding sessions only inside an absolute ceiling and ask for **reauthentication** on sensitive actions instead of shortening everything for everyone. The right value depends on the damage of a theft and on the organization’s policy: the balance is between security and user interruption.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a movie ticket with a showtime. It is only good for that screening: if someone loses or steals it, the damage ends when the film does, and the usher does not need to phone the box office to check. Whoever wants to spend the afternoon at the theater does not buy an eternal ticket: they go back to the box office, which checks the receipt, may refuse, and hands over another ticket for the next screening. And to enter the VIP room, the guard asks for ID again, even with a valid ticket.",
        tecnico:
          "The **access token** is the ticket: short-lived (minutes), validated locally by the API, and it limits the window in which a stolen token can be used. The **refresh token** is the receipt: it lives longer, under the control of the authorization server, which can refuse it, rotate it and re-evaluate the account, MFA and policy at each renewal (see Q34). The **session** (cookie or SSO) has clocks of its own: **idle expiration** ends it after a stretch of no use, **absolute expiration** ends it a fixed time after login even with activity, and **sliding expiration** extends the deadline on every use, always inside the absolute ceiling. Sensitive actions call for **recent reauthentication** (`max_age` and `auth_time`; see Q50 and Q99). Time shows up throughout authentication because it limits the abuse window and forces revalidation: an authorization code that lives for seconds, a TOTP that changes every 30 seconds, a SAML assertion with a validity period, `exp`, `nbf` and `iat` in tokens.",
        limite:
          "A paper ticket cannot tell when it has been copied; a refresh token can, because reuse of an already rotated token betrays the copy. And the analogy gives no numbers: there is no single right lifetime, only what fits the damage of a theft, the organization’s policy and regulatory requirements. A short lifetime does not replace revocation either: logout, password change and offboarding must really end the session (see Q77 and Q82).",
      },
      {
        tipo: "tabela",
        titulo: "The three clocks of a session",
        colunas: ["Clock", "How it works", "Protects against", "Cost"],
        linhas: [
          [
            "Idle",
            "Ends after N minutes without activity",
            "An unlocked device left behind, a shared computer, a forgotten tab",
            "People who take long breaks must sign in again",
          ],
          [
            "Absolute",
            "Ends X hours after login, with or without activity",
            "A stolen session kept alive by a script, a credential that is never re-evaluated",
            "The active user is interrupted mid-work, unless renewal is silent",
          ],
          [
            "Sliding (rolling)",
            "Every use pushes the expiry forward",
            "Interrupting someone who is actively using it (convenience, not protection)",
            "On its own it never expires under continuous use: it needs the absolute ceiling",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "A starting point by criticality (orders of magnitude, not a standard)",
        colunas: ["Kind of application", "Access token", "Session: idle and absolute", "Notes"],
        linhas: [
          [
            "Low risk (content, read-only, no personal data)",
            "Up to about an hour",
            "Idle of days to weeks; long absolute",
            "“Remember me” acceptable, with its own credential and less power",
          ],
          [
            "Ordinary business application (SaaS, company data)",
            "A few minutes to about an hour",
            "Idle of tens of minutes to a few hours; absolute of one working day",
            "Refresh token with rotation and an absolute ceiling; reauthentication for sensitive actions",
          ],
          [
            "Back office, personal data or administration",
            "A few minutes",
            "Short idle (tens of minutes); absolute of a few hours",
            "Recent MFA for high-impact actions; no “remember me”",
          ],
          [
            "Financial, healthcare, identity administration",
            "A few minutes",
            "Idle of a few minutes to tens of minutes; short absolute",
            "Reauthentication per operation (step-up); follow the regulation and the required assurance level",
          ],
        ],
        nota: "These are starting points, not a standard. What rules is the organization’s policy, the applicable regulation and the authentication assurance level (see Q102 and NIST SP 800-63B, which covers reauthentication limits per level; check the current revision).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Start from the damage of a stolen token or cookie: the greater the damage, the shorter the access token and the idle window. Always give anything sliding an **absolute ceiling**. And instead of shortening everything for everyone, ask for **reauthentication** only on sensitive actions.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Refresh and “remember me” reopen the window",
        texto:
          "A refresh token with no rotation, no idle limit and no absolute ceiling is an eternal session: a stolen credential lasts forever and a disabled account keeps getting in. “Remember me” should use a separate credential with less power, and it does not waive reauthentication on sensitive actions.",
      },
    ],
    armadilhas: [
      "A sliding session with no absolute ceiling: with continuous use (or a script that makes periodic requests) it never expires.",
      "A refresh token with no rotation and no idle or absolute limits: it becomes an eternal credential, worth more than the access token it renews.",
      "Access tokens of hours or days “so people aren’t bothered”: the short lifetime is what limits theft; use refresh and silent renewal.",
      "Thinking a short lifetime replaces revocation: logout, password change and offboarding must really end the session (see Q77 and Q82).",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between idle and absolute expiration, and why use both?",
        resposta:
          "Idle ends the session after a stretch of no use; absolute ends it a fixed time after login, even with activity. Idle limits abandonment; absolute limits the life of a stolen credential that is kept alive. With idle alone, continuous use extends the session forever.",
      },
      {
        pergunta:
          "If the user stays signed in all day, why is a 15-minute access token with a refresh token safer than a 24-hour one?",
        resposta:
          "A stolen access token works for 15 minutes at most, and every renewal goes through the authorization server, which re-evaluates the account and the policy and detects reuse of a copied refresh token. With 24 hours, a theft is good all day and nothing is re-evaluated in that time.",
      },
    ],
  },
};
