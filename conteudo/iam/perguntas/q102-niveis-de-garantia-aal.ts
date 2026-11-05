import type { Pergunta } from "../../tipos";

// Q102 · Níveis de garantia AAL
export const q102: Pergunta = {
  numero: 102,
  modulo: "mfa-e-passkeys",
  metodo: "whys",
  pt: {
    titulo: "Níveis de garantia AAL",
    pergunta:
      "O que são os níveis de garantia de autenticação (AAL1 a AAL3, NIST SP 800-63) e por que ajudam a decidir qual método exigir para cada tipo de operação?",
    porqueEsteMetodo:
      "Os níveis AAL parecem burocracia até a cadeia de porquês mostrar de onde vêm: o risco é desigual, falta um vocabulário comum, o método precisa ligar-se à resistência a ataques, e a decisão acontece por operação.",
    resposta30s:
      "Os **níveis de garantia de autenticação** (AAL1 a AAL3, NIST SP 800-63B) medem o quanto se pode confiar que quem autentica é o titular: o AAL1 aceita um fator único, o **AAL2** exige dois fatores e o **AAL3** exige uma chave criptográfica em hardware resistente a phishing. Ajudam porque **nem toda operação exige a mesma prova** (exigir demais gera atrito, exigir de menos expõe o que importa) e dão um vocabulário comum para ligar **método, risco e regulamento**. No OpenID Connect, o IdP informa o nível alcançado no `acr`, e a aplicação decide por operação.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que nem todo acesso exige a mesma prova de autenticação?",
            resposta:
              "Porque o risco muda. Consultar o horário de atendimento não tem a mesma consequência que ler um prontuário ou autorizar um pagamento. Exigir sempre a prova máxima gera atrito, custo e abandono (e as pessoas inventam atalhos); exigir sempre a mínima expõe justamente o que importa.",
          },
          {
            pergunta: "Por que é preciso um vocabulário comum de níveis?",
            resposta:
              "Porque “MFA” sozinho é vago: SMS e chave de segurança são ambos “MFA”, mas resistem a ataques de modos muito diferentes. A SP 800-63B nomeia três níveis de confiança de que quem autentica é o titular, e assim times, auditores e fornecedores falam da mesma coisa e traduzem risco em requisito verificável.",
          },
          {
            pergunta: "Por que os níveis amarram o método à resistência a ataques?",
            resposta:
              "Porque cada degrau sobe a barra contra uma classe de ataque. O AAL1 aceita um fator só (a senha) e não resiste a uma senha vazada. O AAL2 pede dois fatores distintos com criptografia aprovada e derruba o reaproveitamento de senha. O AAL3 pede uma chave criptográfica em hardware com resistência à falsificação do verificador, o que torna o phishing e o roubo remoto do segredo inúteis.",
          },
          {
            pergunta: "Por que o AAL sozinho não basta, e onde entram o IAL e o FAL?",
            resposta:
              "Porque o AAL diz que a mesma pessoa autenticou **agora**, mas não que a pessoa é quem diz ser nem que a resposta chegou intacta ao aplicativo. O **IAL** mede a força da verificação de identidade no cadastro; o **FAL** mede a robustez da asserção que o IdP entrega à aplicação (assinada, protegida contra injeção e interceptação, ligada à posse de uma chave). Um AAL3 sobre uma conta aberta com identidade falsa é um cofre forte para a pessoa errada.",
          },
          {
            pergunta: "Por que o nível vira `acr` e é decidido por operação?",
            resposta:
              "Porque a aplicação não conhece o método, só o resultado. O IdP registra o nível alcançado no `acr` (os métodos usados vão no `amr` e o momento no `auth_time`), e a aplicação o compara com o que a operação exige; se faltar, faz um step-up (veja Q99). Assim a política mora num catálogo de operações, e não espalhada em cada tela.",
          },
        ],
        causaRaiz:
          "Autenticar é uma decisão de risco, não de tecnologia: o nível exigido deve ser proporcional ao dano de errar. Os AAL dão nome a esses degraus para ligar método, risco e regulamento.",
      },
      {
        tipo: "tabela",
        titulo: "Os três níveis, em linhas gerais",
        colunas: ["Nível", "Confiança", "Método típico", "Contra o que protege"],
        linhas: [
          [
            "AAL1",
            "Alguma confiança de que quem autentica controla o autenticador",
            "Um fator, como a senha sozinha",
            "Tentativas ingênuas; não protege contra senha vazada nem phishing",
          ],
          [
            "AAL2",
            "Alta confiança",
            "Dois fatores distintos com criptografia aprovada: senha mais aplicativo ou OTP, ou uma passkey com verificação do usuário",
            "Senha vazada e reaproveitada; contra phishing, só se o método for resistente a phishing",
          ],
          [
            "AAL3",
            "Confiança muito alta",
            "Chave criptográfica em hardware, resistente à falsificação do verificador (phishing), com verificação do usuário",
            "Phishing e roubo remoto do segredo; exige a posse física do dispositivo",
          ],
        ],
        nota: "A norma também prevê limites de duração e de inatividade da sessão por nível. As exigências exatas mudam entre as revisões da SP 800-63; confira a vigente. Passkeys sincronizadas e passkeys presas a um dispositivo físico podem cair em níveis diferentes, conforme a implementação.",
      },
      {
        tipo: "tabela",
        titulo: "Exemplo de mapeamento por operação (sistema de saúde)",
        colunas: ["Operação", "Nível sugerido", "Método típico e controles"],
        linhas: [
          ["Consultar horários e serviços", "Sem autenticação", "Nenhum"],
          [
            "Paciente vê o próprio histórico e os resultados de exames (dado de saúde, sensível)",
            "AAL2",
            "Senha e segundo fator, ou passkey",
          ],
          [
            "Profissional consulta o prontuário de um paciente",
            "AAL2, de preferência resistente a phishing",
            "Passkey ou chave de segurança, sessão curta e registro de cada acesso",
          ],
          [
            "Prescrever medicamento controlado ou assinar documento clínico",
            "AAL3 ou o que a norma setorial exigir",
            "Chave de hardware ou certificado, com verificação do usuário",
          ],
          [
            "Administrador altera permissões ou exporta a base inteira",
            "AAL3, com step-up recente",
            "Chave de hardware, `max_age` curto e aprovação adicional",
          ],
          [
            "Alterar o MFA ou o e-mail de recuperação",
            "AAL2 ou mais, com autenticação recente",
            "Step-up com fator forte e notificação ao titular",
          ],
        ],
        nota: "O mapeamento é ilustrativo. A decisão real vem da análise de risco e das normas que se aplicam: leis como a LGPD exigem medidas de segurança proporcionais ao risco sem prescrever um AAL, e são contratos, normas setoriais e programas de conformidade que costumam citar o nível.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Comece pela operação, não pelo método",
        texto:
          "Classifique as operações pelo dano de um erro, mapeie cada classe a um nível, exija o nível no servidor (`acr` e `auth_time` no token) e deixe o resto da sessão no nível mais baixo que o risco permite. A política vive num catálogo de operações; quando a regulação ou o apetite de risco mudar, você muda o catálogo.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Um nível é uma moldura, não um selo",
        texto:
          "Cumprir um AAL depende de detalhes além do método: gestão de sessão, resistência a reuso, canais fora de banda e, principalmente, a **recuperação de conta**, que pode rebaixar o nível efetivo (veja Q100). O `acr` é um texto combinado entre o IdP e a aplicação; não presuma que o `acr` de um fornecedor significa AAL2 sem conferir a documentação dele. E `acr_values` na requisição é apenas um pedido: confira o `acr` que voltou.",
      },
    ],
    armadilhas: [
      "Tratar “MFA” como um nível único: SMS e chave de segurança são MFA, mas resistem a ataques de modos muito diferentes.",
      "Confundir AAL, IAL e FAL: o AAL3 não prova a identidade civil de ninguém (isso é IAL) nem protege a asserção entre o IdP e a aplicação (isso é FAL).",
      "Exigir o nível máximo para tudo: o atrito gera abandono, contornos e senha anotada. Escalone por operação.",
      "Confiar que `acr_values` na requisição garante o nível: é um pedido. Confira `acr` e `auth_time` no token e valide emissor e audiência.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre AAL, IAL e FAL?",
        resposta:
          "O IAL é a força da verificação de identidade no cadastro (quem é a pessoa); o AAL é a força da autenticação a cada acesso (é a mesma pessoa agora); o FAL é a robustez da asserção que o IdP entrega à aplicação na federação.",
      },
      {
        pergunta: "Como a aplicação sabe que o usuário atingiu o nível exigido para uma operação?",
        resposta:
          "O IdP registra no token o `acr` (nível), o `amr` (métodos) e o `auth_time` (quando); a API compara com o que a operação exige e, se faltar nível ou se a autenticação for antiga, devolve um desafio de step-up. Ela não confia em nada que venha do cliente.",
      },
    ],
  },
  en: {
    titulo: "Authentication assurance levels",
    pergunta:
      "What are authentication assurance levels (AAL1 to AAL3, NIST SP 800-63), and why do they help decide which method to require for each type of operation?",
    porqueEsteMetodo:
      "AALs look like bureaucracy until the chain of whys shows where they come from: risk is uneven, a shared vocabulary is missing, the method has to be tied to resistance against attacks, and the decision happens per operation.",
    resposta30s:
      "The **authentication assurance levels** (AAL1 to AAL3, NIST SP 800-63B) measure how far you can trust that the person authenticating is the owner: AAL1 accepts a single factor, **AAL2** requires two factors and **AAL3** requires a phishing-resistant cryptographic key in hardware. They help because **not every operation needs the same proof** (asking too much creates friction, asking too little exposes what matters) and they give a shared vocabulary to connect **method, risk and regulation**. In OpenID Connect, the IdP reports the level reached in `acr`, and the application decides per operation.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does not every access need the same authentication proof?",
            resposta:
              "Because risk changes. Checking opening hours does not have the same consequence as reading a medical record or authorizing a payment. Always demanding the maximum proof creates friction, cost and drop-off (and people invent shortcuts); always demanding the minimum exposes precisely what matters.",
          },
          {
            pergunta: "Why do you need a shared vocabulary of levels?",
            resposta:
              "Because “MFA” alone is vague: SMS and a security key are both “MFA”, yet they resist attacks in very different ways. SP 800-63B names three levels of confidence that the person authenticating is the owner, so teams, auditors and vendors talk about the same thing and turn risk into a verifiable requirement.",
          },
          {
            pergunta: "Why do the levels tie the method to resistance against attacks?",
            resposta:
              "Because each step raises the bar against a class of attack. AAL1 accepts a single factor (the password) and does not resist a leaked password. AAL2 asks for two distinct factors with approved cryptography and defeats password reuse. AAL3 asks for a cryptographic key in hardware with verifier impersonation resistance, which makes phishing and remote theft of the secret useless.",
          },
          {
            pergunta: "Why is AAL alone not enough, and where do IAL and FAL come in?",
            resposta:
              "Because AAL says the same person authenticated **now**, but not that the person is who they claim to be nor that the response reached the application intact. **IAL** measures the strength of identity proofing at enrollment; **FAL** measures the robustness of the assertion the IdP delivers to the application (signed, protected against injection and interception, bound to possession of a key). An AAL3 on an account opened with a false identity is a strong safe for the wrong person.",
          },
          {
            pergunta: "Why does the level become `acr` and get decided per operation?",
            resposta:
              "Because the application does not know the method, only the outcome. The IdP records the level reached in `acr` (the methods used go in `amr` and the moment in `auth_time`), and the application compares it with what the operation requires; if it falls short, it does a step-up (see Q99). So the policy lives in a catalog of operations, not scattered across every screen.",
          },
        ],
        causaRaiz:
          "Authenticating is a risk decision, not a technology decision: the level required should be proportional to the harm of getting it wrong. AALs name those steps to tie method, risk and regulation together.",
      },
      {
        tipo: "tabela",
        titulo: "The three levels, in broad terms",
        colunas: ["Level", "Confidence", "Typical method", "What it protects against"],
        linhas: [
          [
            "AAL1",
            "Some confidence that the person authenticating controls the authenticator",
            "One factor, such as the password alone",
            "Naive attempts; does not protect against a leaked password or phishing",
          ],
          [
            "AAL2",
            "High confidence",
            "Two distinct factors with approved cryptography: password plus an app or OTP, or a passkey with user verification",
            "Leaked and reused passwords; against phishing only if the method is phishing-resistant",
          ],
          [
            "AAL3",
            "Very high confidence",
            "A cryptographic key in hardware, resistant to verifier impersonation (phishing), with user verification",
            "Phishing and remote theft of the secret; requires physical possession of the device",
          ],
        ],
        nota: "The standard also sets session duration and inactivity limits per level. The exact requirements change between revisions of SP 800-63; check the current one. Synced passkeys and passkeys bound to a physical device may fall into different levels, depending on the implementation.",
      },
      {
        tipo: "tabela",
        titulo: "Example mapping by operation (healthcare system)",
        colunas: ["Operation", "Suggested level", "Typical method and controls"],
        linhas: [
          ["Checking hours and services", "No authentication", "None"],
          [
            "A patient views their own history and test results (sensitive health data)",
            "AAL2",
            "Password and a second factor, or a passkey",
          ],
          [
            "A professional opens a patient’s record",
            "AAL2, preferably phishing-resistant",
            "Passkey or security key, short session and a log of every access",
          ],
          [
            "Prescribing a controlled medication or signing a clinical document",
            "AAL3 or whatever the sector rule requires",
            "Hardware key or certificate, with user verification",
          ],
          [
            "An administrator changes permissions or exports the whole database",
            "AAL3, with a recent step-up",
            "Hardware key, a short `max_age` and an additional approval",
          ],
          [
            "Changing the MFA or the recovery email",
            "AAL2 or higher, with recent authentication",
            "Step-up with a strong factor and notification to the owner",
          ],
        ],
        nota: "The mapping is illustrative. The real decision comes from risk analysis and the rules that apply: laws such as Brazil’s LGPD require security measures proportional to the risk without prescribing an AAL, and it is contracts, sector standards and compliance programs that tend to cite the level.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Start from the operation, not the method",
        texto:
          "Classify operations by the harm of a mistake, map each class to a level, require the level on the server (`acr` and `auth_time` in the token) and leave the rest of the session at the lowest level the risk allows. The policy lives in a catalog of operations; when regulation or risk appetite changes, you change the catalog.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A level is a framework, not a stamp",
        texto:
          "Meeting an AAL depends on details beyond the method: session management, resistance to replay, out-of-band channels and, above all, **account recovery**, which can lower the effective level (see Q100). `acr` is a string agreed between the IdP and the application; do not assume one vendor’s `acr` means AAL2 without checking its documentation. And `acr_values` in the request is only a request: check the `acr` that came back.",
      },
    ],
    armadilhas: [
      "Treating “MFA” as a single level: SMS and a security key are both MFA, but they resist attacks in very different ways.",
      "Mixing up AAL, IAL and FAL: AAL3 does not prove anyone’s real-world identity (that is IAL) nor protect the assertion between the IdP and the application (that is FAL).",
      "Requiring the top level for everything: friction breeds drop-off, workarounds and written-down passwords. Scale by operation.",
      "Trusting that `acr_values` in the request guarantees the level: it is a request. Check `acr` and `auth_time` in the token and validate issuer and audience.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between AAL, IAL and FAL?",
        resposta:
          "IAL is the strength of identity proofing at enrollment (who the person is); AAL is the strength of authentication on each access (it is the same person now); FAL is the robustness of the assertion the IdP delivers to the application in federation.",
      },
      {
        pergunta: "How does the application know the user reached the level an operation requires?",
        resposta:
          "The IdP records `acr` (level), `amr` (methods) and `auth_time` (when) in the token; the API compares them with what the operation requires and, if the level is missing or the authentication is old, returns a step-up challenge. It trusts nothing that comes from the client.",
      },
    ],
  },
};
