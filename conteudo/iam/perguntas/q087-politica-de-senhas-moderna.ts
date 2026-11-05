import type { Pergunta } from "../../tipos";

// Q87 · Política de senhas moderna
export const q087: Pergunta = {
  numero: 87,
  modulo: "mfa-e-passkeys",
  metodo: "compare",
  pt: {
    titulo: "Política de senhas moderna",
    pergunta:
      "Compare as regras clássicas de senha (complexidade e troca periódica) com as recomendações do NIST SP 800-63B. O que mudou e por quê?",
    porqueEsteMetodo:
      "A pergunta pede duas políticas lado a lado e a razão da mudança. Uma matriz por aspecto mostra o que cada lado exigia, e a regra de decisão diz o que adotar hoje.",
    resposta30s:
      "As regras clássicas (maiúscula, número e símbolo, mais troca a cada 60 ou 90 dias) produziram senhas **previsíveis** e fáceis de adivinhar. O NIST SP 800-63B passou a recomendar **comprimento em vez de complexidade**, **bloquear senhas vazadas e comuns**, **trocar só com evidência de comprometimento**, aceitar colar e gerenciadores de senha, **limitar tentativas** e combinar a senha com **MFA**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Regra clássica × recomendação atual",
        colunas: ["Aspecto", "Regra clássica", "Recomendação do NIST SP 800-63B", "Por que mudou"],
        linhas: [
          [
            "Composição",
            "Exigir maiúscula, minúscula, número e símbolo",
            "Não impor regras de composição",
            "As pessoas cumprem a regra de jeito previsível (`Senha@2026`, o `a` virando `@`). O resultado é difícil de lembrar e continua fácil de adivinhar.",
          ],
          [
            "Comprimento",
            "Mínimo curto (8) e, às vezes, máximo baixo (12 ou 16)",
            "Um piso de comprimento, aceitar senhas longas (ao menos 64 caracteres) e frases-senha, com espaços e Unicode",
            "Cada caractere a mais multiplica o trabalho de quem adivinha. O mínimo exato mudou entre as revisões do documento: confira a vigente.",
          ],
          [
            "Troca periódica",
            "Trocar a cada 60 ou 90 dias",
            "Não forçar troca periódica; forçar a troca quando houver evidência de comprometimento",
            "A troca obrigatória gera incrementos previsíveis (`Verao1!` → `Outono1!`), reuso e senha anotada. Só ajuda quando há motivo para achar que a senha vazou.",
          ],
          [
            "Senhas vazadas e comuns",
            "Raramente verificadas",
            "Comparar com uma lista de bloqueio na criação e na troca: senhas vazadas, comuns, sequenciais, repetidas e derivadas do nome do usuário ou do serviço",
            "O invasor testa primeiro o que já vazou e o que todo mundo usa (credential stuffing e dicionários). Recusar esse conjunto fecha o caminho mais barato.",
          ],
          [
            "Colar e gerenciadores de senha",
            "Bloquear o colar no campo",
            "Permitir colar e o uso de gerenciadores; deixar mostrar o que foi digitado",
            "Gerenciadores tornam viáveis senhas longas, únicas e aleatórias. Bloquear o colar empurra a pessoa para senhas curtas e repetidas.",
          ],
          [
            "Dicas e perguntas secretas",
            "“Nome do seu primeiro animal”",
            "Não usar dicas de senha nem perguntas de conhecimento",
            "As respostas são públicas ou adivinháveis por redes sociais e registros.",
          ],
          [
            "Adivinhação online",
            "Conta bloqueada por tempo indeterminado, ou nenhum limite",
            "Limitar tentativas falhas (atraso crescente, limites por conta e por origem) e exigir MFA",
            "Sem limite, uma senha fraca cai por força bruta. O bloqueio permanente vira ataque de negação de serviço contra a vítima.",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Troque a pergunta “a senha é complexa?” por “ela é longa, única e fora das listas de vazadas?”. Aceite qualquer caractere e frases longas, verifique senhas vazadas e comuns na criação e na troca, só force troca com evidência de comprometimento, limite tentativas, permita colar e exija um segundo fator, de preferência resistente a phishing (veja Q96). Guarde as senhas com hash lento e sal (Argon2id, scrypt, bcrypt ou PBKDF2).",
      },
      {
        tipo: "codigo",
        titulo: "Recusar senha vazada sem enviar a senha",
        legenda: "TypeScript",
        codigo: `import { createHash } from "node:crypto";

// k-anonimato: só os 5 primeiros caracteres do SHA-1 saem do servidor
export async function senhaVazada(senha: string): Promise<boolean> {
  const sha1 = createHash("sha1").update(senha, "utf8").digest("hex").toUpperCase();
  const prefixo = sha1.slice(0, 5);
  const sufixo = sha1.slice(5);
  const resposta = await fetch("https://api.pwnedpasswords.com/range/" + prefixo);
  if (!resposta.ok) throw new Error("verificação de senhas vazadas indisponível");
  const linhas = (await resposta.text()).split("\\n");
  return linhas.some((linha) => linha.split(":")[0].trim() === sufixo);
}`,
        nota: "O serviço devolve todos os sufixos de hash que começam com aquele prefixo, e a comparação final acontece no seu servidor. O SHA-1 aqui só serve para a consulta, não para guardar a senha. Decida o que fazer se o serviço cair (liberar com aviso ou recusar) e considere uma lista local para não depender de terceiro; confira os termos do serviço.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O legado e a norma que se aplica a você",
        texto:
          "Normas setoriais e auditorias ainda podem exigir complexidade e troca periódica: confira o requisito que vale para o seu caso antes de mudar a política e registre a justificativa. O NIST SP 800-63B é uma referência técnica, não uma lei brasileira. E nada disso substitui o MFA: uma senha excelente continua roubável por phishing.",
      },
    ],
    armadilhas: [
      "Manter complexidade e troca obrigatória “por segurança”: o efeito é senha previsível, reaproveitada e anotada.",
      "Limitar o tamanho máximo (16 caracteres, por exemplo) ou truncar a senha em silêncio: o bcrypt, por exemplo, só lê os primeiros 72 bytes, então trate isso ou use Argon2id.",
      "Checar a lista de vazadas só no cadastro: a lista cresce, então verifique também na troca (e, quando possível, no login) e force a troca se a senha aparecer.",
      "Bloquear a conta de forma permanente após N erros: o invasor trava contas de propósito. Use atraso crescente, limite por origem e MFA.",
    ],
    autoteste: [
      {
        pergunta: "Por que o NIST deixou de recomendar a troca periódica de senha?",
        resposta:
          "Porque a troca forçada produz variações previsíveis da senha anterior e senhas anotadas ou reaproveitadas, sem barrar quem já a tem. A troca passa a ser exigida quando há evidência de comprometimento, não por calendário.",
      },
      {
        pergunta: "Como recusar senhas vazadas sem enviar a senha a um terceiro?",
        resposta:
          "Com k-anonimato: calcula-se o hash localmente, envia-se só um prefixo curto e compara-se o restante da lista devolvida no seu servidor. Também dá para manter uma lista local de senhas vazadas e comuns.",
      },
    ],
  },
  en: {
    titulo: "Modern password policy",
    pergunta:
      "Compare classic password rules (complexity and periodic rotation) with NIST SP 800-63B recommendations. What changed and why?",
    porqueEsteMetodo:
      "The question asks for two policies side by side and the reason for the change. A matrix by aspect shows what each side demanded, and the decision rule says what to adopt today.",
    resposta30s:
      "Classic rules (upper case, digits and symbols, plus a change every 60 or 90 days) produced **predictable** passwords that are easy to guess. NIST SP 800-63B moved to **length over complexity**, **blocking breached and common passwords**, **changing only on evidence of compromise**, allowing paste and password managers, **limiting attempts** and pairing the password with **MFA**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Classic rule vs current recommendation",
        colunas: ["Aspect", "Classic rule", "NIST SP 800-63B recommendation", "Why it changed"],
        linhas: [
          [
            "Composition",
            "Require upper case, lower case, a digit and a symbol",
            "Do not impose composition rules",
            "People satisfy the rule in predictable ways (`Password@2026`, the `a` becoming `@`). The result is hard to remember and still easy to guess.",
          ],
          [
            "Length",
            "A short minimum (8) and sometimes a low maximum (12 or 16)",
            "A length floor, accept long passwords (at least 64 characters) and passphrases, including spaces and Unicode",
            "Each extra character multiplies the guesser’s work. The exact minimum changed between revisions of the document: check the current one.",
          ],
          [
            "Periodic rotation",
            "Change every 60 or 90 days",
            "Do not force periodic changes; force a change when there is evidence of compromise",
            "Forced rotation produces predictable increments (`Summer1!` → `Autumn1!`), reuse and written-down passwords. It only helps when there is a reason to think the password leaked.",
          ],
          [
            "Breached and common passwords",
            "Rarely checked",
            "Compare against a blocklist at creation and at change: breached, common, sequential, repeated and derived from the username or service name",
            "Attackers try what already leaked and what everyone uses first (credential stuffing and dictionaries). Refusing that set closes the cheapest path.",
          ],
          [
            "Paste and password managers",
            "Block pasting into the field",
            "Allow pasting and password managers; let users reveal what they typed",
            "Managers make long, unique, random passwords practical. Blocking paste pushes people toward short, reused ones.",
          ],
          [
            "Hints and secret questions",
            "“Name of your first pet”",
            "No password hints and no knowledge-based questions",
            "The answers are public or guessable from social networks and records.",
          ],
          [
            "Online guessing",
            "Account locked indefinitely, or no limit at all",
            "Limit failed attempts (growing delay, limits per account and per source) and require MFA",
            "Without a limit, a weak password falls to brute force. A permanent lockout becomes a denial-of-service attack on the victim.",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Replace the question “is the password complex?” with “is it long, unique and absent from breach lists?”. Accept any character and long passphrases, check for breached and common passwords at creation and at change, force a change only on evidence of compromise, limit attempts, allow paste and require a second factor, preferably phishing-resistant (see Q96). Store passwords with a slow, salted hash (Argon2id, scrypt, bcrypt or PBKDF2).",
      },
      {
        tipo: "codigo",
        titulo: "Rejecting a breached password without sending the password",
        legenda: "TypeScript",
        codigo: `import { createHash } from "node:crypto";

// k-anonymity: only the first 5 characters of the SHA-1 leave the server
export async function isBreached(password: string): Promise<boolean> {
  const sha1 = createHash("sha1").update(password, "utf8").digest("hex").toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);
  const response = await fetch("https://api.pwnedpasswords.com/range/" + prefix);
  if (!response.ok) throw new Error("breached-password check unavailable");
  const lines = (await response.text()).split("\\n");
  return lines.some((line) => line.split(":")[0].trim() === suffix);
}`,
        nota: "The service returns every hash suffix that starts with that prefix, and the final comparison happens on your server. The SHA-1 here is only for the lookup, not for storing the password. Decide what to do if the service is down (allow with a warning or refuse) and consider a local list so you do not depend on a third party; check the service terms.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Legacy requirements and the standard that applies to you",
        texto:
          "Sector standards and audits may still demand complexity and periodic rotation: check the requirement that applies to your case before changing the policy and record the justification. NIST SP 800-63B is a technical reference, not Brazilian law. And none of this replaces MFA: an excellent password can still be stolen by phishing.",
      },
    ],
    armadilhas: [
      "Keeping complexity and mandatory rotation “for security”: the effect is predictable, reused and written-down passwords.",
      "Capping the maximum length (16 characters, say) or silently truncating the password: bcrypt, for example, reads only the first 72 bytes, so handle that or use Argon2id.",
      "Checking the breach list only at sign-up: the list grows, so check at change too (and at login when possible) and force a change if the password shows up.",
      "Locking an account permanently after N failures: attackers lock accounts on purpose. Use a growing delay, per-source limits and MFA.",
    ],
    autoteste: [
      {
        pergunta: "Why did NIST stop recommending periodic password changes?",
        resposta:
          "Because forced rotation yields predictable variations of the previous password and written-down or reused ones, without stopping whoever already has it. A change is required when there is evidence of compromise, not on a schedule.",
      },
      {
        pergunta: "How do you reject breached passwords without sending the password to a third party?",
        resposta:
          "With k-anonymity: hash locally, send only a short prefix and compare the rest of the returned list on your own server. You can also keep a local list of breached and common passwords.",
      },
    ],
  },
};
