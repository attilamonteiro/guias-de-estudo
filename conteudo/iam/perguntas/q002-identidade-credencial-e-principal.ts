import type { Pergunta } from "../../tipos";

// Q02 · Identidade, credencial e principal
export const q002: Pergunta = {
  numero: 2,
  modulo: "fundamentos",
  metodo: "feynman",
  pt: {
    titulo: "Identidade, credencial e principal",
    pergunta:
      "Explique a diferença entre identidade, credencial, conta e principal (sujeito). Por que uma mesma pessoa pode ter várias contas e várias credenciais?",
    porqueEsteMetodo:
      "Cinco palavras parecidas misturam-se na cabeça de quem começa em IAM. Uma imagem simples (a portaria de um prédio) dá a cada uma o seu lugar, e depois a tabela mostra o que muda e o que precisa ficar fixo.",
    resposta30s:
      "**Identidade** é o conjunto de atributos que descreve uma pessoa ou um serviço num contexto; **conta** é o registro dessa identidade em um sistema; **credencial** é o que prova o controle da conta (senha, passkey, certificado); **principal** (ou sujeito) é a representação autenticada, com identificador e atributos, que entra na decisão de acesso. Uma pessoa tem várias contas (uma por sistema, papel ou relação) e várias credenciais por conta (fatores, dispositivos, reserva); por isso a chave de um usuário é um **identificador estável** como o `sub`, nunca o e-mail.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine um prédio comercial. Maria é a pessoa de carne e osso. O RH a conhece como funcionária 4821, do financeiro, com gestor e e-mail: esse conjunto de dados é a identidade dela naquele contexto. A portaria tem um cadastro com o número e a situação do crachá dela: é a conta. O crachá é o que Maria mostra na catraca para provar que controla aquela conta: é a credencial. Quando a catraca decide abrir ou não, ela enxerga só “titular do crachá 4821, financeiro, 3º andar”: é o principal. Maria pode ter ainda o cartão do estacionamento e um crachá de visitante em outra empresa, e trocar o crachá se perdê-lo, sem deixar de ser a mesma pessoa.",
        tecnico:
          "No IAM, a **identidade** é o conjunto de atributos que descreve uma entidade (pessoa, serviço, dispositivo) num contexto. A **conta** é o registro dela em um sistema, com identificador e ciclo de vida (criada, suspensa, removida). A **credencial** é o segredo ou a chave que prova o controle da conta: senha, passkey, certificado, token de API. O **principal**, ou **sujeito** (`subject`), é a representação autenticada que o sistema usa para decidir: um identificador estável mais atributos, grupos e papéis desta requisição. Em OpenID Connect ele chega como as claims do token; em .NET é o `ClaimsPrincipal`; em Java, o `Principal`.",
        limite:
          "A analogia falha em três pontos. Uma credencial digital pode ser copiada sem ninguém notar: ela prova a posse do segredo, não que quem a usa é Maria. Nem toda conta tem uma pessoa atrás: há contas de serviço, identidades de workload e contas compartilhadas. E o principal não é a pessoa, é um retrato montado a cada autenticação, que pode estar desatualizado (o cargo mudou, mas o token ainda diz o antigo).",
      },
      {
        tipo: "tabela",
        titulo: "Cada conceito no seu lugar",
        colunas: ["Conceito", "O que é", "Exemplo", "Muda sem que a pessoa mude?"],
        linhas: [
          [
            "Pessoa (entidade)",
            "Quem existe no mundo real, ou o serviço ou dispositivo",
            "Maria Souza; a rotina de faturamento",
            "Não",
          ],
          [
            "Identidade",
            "Atributos que descrevem a entidade num contexto",
            "Nome, departamento, cargo, gestor",
            "Sim: os atributos mudam o tempo todo",
          ],
          [
            "Conta",
            "Registro da identidade em um sistema, com identificador e ciclo de vida",
            "Um usuário no IdP, outro no ERP, outro num SaaS",
            "Cada sistema tem a sua; podem ser criadas e removidas",
          ],
          [
            "Credencial",
            "O que prova o controle da conta",
            "Senha, passkey, código TOTP, certificado, token de API",
            "Sim: troca de senha, nova passkey",
          ],
          [
            "Principal (sujeito)",
            "A representação autenticada que entra na decisão de acesso",
            "`sub` mais grupos e papéis da requisição",
            "Sim: é montado a cada autenticação",
          ],
          [
            "Identificador estável",
            "Valor único que não muda e não é reaproveitado, usado como chave",
            "`sub` (OIDC), `oid` (Entra ID), SID (Windows)",
            "Não: é o que dá continuidade",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um principal chegando como claims de um ID token",
        legenda: "JSON",
        codigo: `{
  "iss": "https://idp.exemplo.com/",
  "sub": "8f14e45f-ceea-467f-a8d5-51b3a2c0d4e1",
  "aud": "app-folha",
  "name": "Maria Souza",
  "email": "maria.souza@empresa.com",
  "email_verified": true,
  "groups": ["financeiro"]
}`,
        nota: "A chave do usuário no seu banco é o par `iss` + `sub`. O e-mail é só um atributo, e `email_verified` diz se alguém o confirmou.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "E-mail não serve de chave",
        texto:
          "O e-mail muda (casamento, troca de domínio), é reaproveitado (o ex-funcionário e o novo contratado podem receber o mesmo endereço) e nem sempre é verificado. Ligar contas pelo e-mail abre a porta para alguém assumir a conta de outra pessoa, por exemplo registrando o mesmo e-mail num IdP que não o confirma. Use o identificador estável do emissor: o par (`iss`, `sub`) no OpenID Connect, ou o `oid` no Entra ID (confira na documentação do fornecedor qual claim ele recomenda para o seu cenário).",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Por que uma pessoa tem várias contas e várias credenciais",
        texto:
          "**Várias contas:** cada sistema guarda a sua; a mesma pessoa pode ser funcionária, cliente e prestadora; e administradores costumam ter uma conta comum para o dia a dia e outra, separada e mais protegida, para tarefas privilegiadas, para que um phishing na conta comum não entregue o poder total. **Várias credenciais por conta:** senha mais segundo fator, uma passkey por dispositivo, chaves de reserva e códigos de recuperação evitam ficar trancado e permitem trocar um fator sem recriar a identidade. A **vinculação de identidades** (account linking) junta contas e logins sociais da mesma pessoa; faça isso com prova de controle, não por coincidência de e-mail. Contas não humanas (serviços, jobs) têm credenciais próprias e precisam de dono e de prazo de rotação.",
      },
    ],
    armadilhas: [
      "Usar o e-mail ou o nome de usuário como chave primária: eles mudam, são reaproveitados e podem não estar verificados.",
      "Confundir credencial com identidade: trocar a senha não cria outra identidade, e uma credencial válida não prova que a pessoa certa a está usando, porque credenciais podem ser roubadas.",
      "Esquecer as contas não humanas: contas de serviço sem dono nem rotação de credencial ficam fora das revisões de acesso.",
      "Achar que o principal é permanente: ele é um retrato do momento da autenticação, e papéis e grupos podem ter mudado depois.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre conta e identidade?",
        resposta:
          "Identidade são os atributos que descrevem alguém; conta é o registro dessa identidade num sistema, com identificador e ciclo de vida. Uma identidade tem várias contas (uma por sistema), e cada conta pode ter várias credenciais.",
      },
      {
        pergunta: "Por que o `sub` é melhor que o e-mail como chave de usuário?",
        resposta:
          "Porque o emissor garante que ele identifica sempre a mesma entidade e não o reaproveita, enquanto o e-mail muda, é reatribuído e pode não estar verificado. Como o `sub` só é único dentro de um emissor, a chave é o par `iss` + `sub`.",
      },
    ],
  },
  en: {
    titulo: "Identity, credential and principal",
    pergunta:
      "Explain the difference between identity, credential, account and principal (subject). Why can one person have several accounts and credentials?",
    porqueEsteMetodo:
      "Five similar words blur together for anyone starting in IAM. A simple picture (a building’s front desk) gives each one its place, and the table then shows what may change and what has to stay fixed.",
    resposta30s:
      "An **identity** is the set of attributes that describes a person or a service in a context; an **account** is the record of that identity in a system; a **credential** is what proves control of the account (password, passkey, certificate); the **principal** (or subject) is the authenticated representation, with an identifier and attributes, that enters the access decision. One person has several accounts (one per system, role or relationship) and several credentials per account (factors, devices, backups); that is why a user’s key is a **stable identifier** such as `sub`, never the email.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine an office building. Maria is the flesh-and-blood person. HR knows her as employee 4821, in finance, with a manager and an email: that set of data is her identity in that context. The front desk holds a record with her badge number and status: that is the account. The badge is what Maria shows at the turnstile to prove she controls that account: the credential. When the turnstile decides whether to open, it sees only “holder of badge 4821, finance, 3rd floor”: that is the principal. Maria may also have a parking card and a visitor badge at another company, and replace her badge if she loses it, without ceasing to be the same person.",
        tecnico:
          "In IAM, the **identity** is the set of attributes that describes an entity (person, service, device) in a context. The **account** is its record in a system, with an identifier and a lifecycle (created, suspended, removed). The **credential** is the secret or key that proves control of the account: password, passkey, certificate, API token. The **principal**, or **subject**, is the authenticated representation the system uses to decide: a stable identifier plus the attributes, groups and roles of this request. In OpenID Connect it arrives as the token’s claims; in .NET it is the `ClaimsPrincipal`; in Java, the `Principal`.",
        limite:
          "The analogy breaks in three places. A digital credential can be copied without anyone noticing: it proves possession of the secret, not that whoever uses it is Maria. Not every account has a person behind it: there are service accounts, workload identities and shared accounts. And the principal is not the person, it is a snapshot built at each authentication, which may be stale (the job title changed, but the token still says the old one).",
      },
      {
        tipo: "tabela",
        titulo: "Each concept in its place",
        colunas: ["Concept", "What it is", "Example", "Can change without the person changing?"],
        linhas: [
          [
            "Person (entity)",
            "Who exists in the real world, or the service or device",
            "Maria Souza; the billing job",
            "No",
          ],
          [
            "Identity",
            "Attributes that describe the entity in a context",
            "Name, department, job title, manager",
            "Yes: attributes change all the time",
          ],
          [
            "Account",
            "The identity’s record in a system, with an identifier and a lifecycle",
            "One user in the IdP, another in the ERP, another in a SaaS",
            "Each system has its own; they can be created and removed",
          ],
          [
            "Credential",
            "What proves control of the account",
            "Password, passkey, TOTP code, certificate, API token",
            "Yes: a password change, a new passkey",
          ],
          [
            "Principal (subject)",
            "The authenticated representation that enters the access decision",
            "`sub` plus the groups and roles of the request",
            "Yes: it is built at each authentication",
          ],
          [
            "Stable identifier",
            "A unique value that does not change and is not reused, used as the key",
            "`sub` (OIDC), `oid` (Entra ID), SID (Windows)",
            "No: it is what gives continuity",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A principal arriving as claims of an ID token",
        legenda: "JSON",
        codigo: `{
  "iss": "https://idp.example.com/",
  "sub": "8f14e45f-ceea-467f-a8d5-51b3a2c0d4e1",
  "aud": "payroll-app",
  "name": "Maria Souza",
  "email": "maria.souza@company.com",
  "email_verified": true,
  "groups": ["finance"]
}`,
        nota: "The user’s key in your database is the pair `iss` + `sub`. The email is just an attribute, and `email_verified` says whether anyone confirmed it.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Email is not a key",
        texto:
          "Email changes (marriage, a domain change), is reused (a former employee and a new hire may get the same address) and is not always verified. Linking accounts by email opens the door to someone taking over another person’s account, for example by registering the same email at an IdP that does not confirm it. Use the issuer’s stable identifier: the pair (`iss`, `sub`) in OpenID Connect, or the `oid` in Entra ID (check the vendor documentation for which claim it recommends in your scenario).",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Why one person has several accounts and credentials",
        texto:
          "**Several accounts:** each system keeps its own; the same person can be an employee, a customer and a contractor; and administrators usually have an everyday account and a separate, better-protected one for privileged tasks, so that phishing on the everyday account does not hand over full power. **Several credentials per account:** a password plus a second factor, one passkey per device, backup keys and recovery codes prevent lockout and let you swap one factor without recreating the identity. **Account linking** joins a person’s accounts and social logins; do it with proof of control, not by email coincidence. Non-human accounts (services, jobs) have their own credentials and need an owner and a rotation deadline.",
      },
    ],
    armadilhas: [
      "Using the email or username as the primary key: they change, get reused and may not be verified.",
      "Confusing a credential with an identity: changing the password does not create another identity, and a valid credential does not prove the right person is using it, because credentials can be stolen.",
      "Forgetting non-human accounts: service accounts with no owner and no credential rotation fall outside access reviews.",
      "Assuming the principal is permanent: it is a snapshot from the moment of authentication, and roles and groups may have changed since.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between an account and an identity?",
        resposta:
          "An identity is the set of attributes that describes someone; an account is that identity’s record in a system, with an identifier and a lifecycle. One identity has several accounts (one per system), and each account can have several credentials.",
      },
      {
        pergunta: "Why is `sub` better than the email as a user key?",
        resposta:
          "Because the issuer guarantees it always identifies the same entity and does not reuse it, while the email changes, gets reassigned and may be unverified. Since `sub` is only unique within an issuer, the key is the pair `iss` + `sub`.",
      },
    ],
  },
};
