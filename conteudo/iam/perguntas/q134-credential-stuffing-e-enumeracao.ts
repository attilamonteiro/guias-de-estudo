import type { Pergunta } from "../../tipos";

// Q134 · Credential stuffing e enumeração
export const q134: Pergunta = {
  numero: 134,
  modulo: "ataques-e-depuracao",
  metodo: "threat",
  pt: {
    titulo: "Credential stuffing e enumeração",
    pergunta:
      "Como funcionam credential stuffing, força bruta e enumeração de usuários contra um login? Que respostas, atrasos e sinais ajudam a detectá-los e reduzi-los?",
    porqueEsteMetodo:
      "Credential stuffing e enumeração se alimentam: o primeiro precisa saber de quem é cada conta e a segunda revela isso. Os pares tratam cada técnica e a resposta, o atraso ou o sinal que a desarma.",
    resposta30s:
      "**Credential stuffing** testa em escala pares e-mail/senha vazados em outros serviços, apostando na reutilização de senhas; a **força bruta** tenta muitos palpites numa conta; a **enumeração** descobre quais contas existem por mensagens, códigos e **tempos de resposta** diferentes. As defesas se somam: **respostas e tempos uniformes**, limitação por conta, IP e par, desafio adaptativo, **MFA**, bloqueio de **senhas vazadas** e detecção de volume por sinais agregados.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ataque → defesa",
        rotuloOrigem: "Ataque",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "**Credential stuffing**: listas de e-mail e senha vazadas em outros serviços são testadas em escala, por botnets, com poucas tentativas por IP e por conta. Funciona porque as pessoas reutilizam senhas, e a senha “certa” passa em qualquer hash.",
            destino:
              "Tornar a senha vazada inútil: **MFA ou passkeys** (veja Q92 e Q96) e **bloqueio de senhas conhecidas como vazadas ou comuns** ao criar e alterar a senha, como o NIST SP 800-63B recomenda (veja Q87).",
          },
          {
            origem: "**Força bruta**: muitos palpites contra uma conta (ou um dicionário contra um alvo importante).",
            destino:
              "Limitação por conta com **atraso progressivo** e desafio, sem trancar a conta de forma permanente (veja Q135). O hash lento (Q86) protege a base vazada; não detém o palpite online.",
          },
          {
            origem:
              "**Password spraying**: poucas senhas comuns contra muitas contas, uma tentativa por conta, para fugir do bloqueio por conta.",
            destino:
              "Limite e detecção por **IP, faixa e dispositivo**, e sinal de “muitas contas distintas com a mesma senha”. Bloquear senhas comuns na criação reduz o que o spraying acerta.",
          },
          {
            origem:
              "**Enumeração por mensagem**: “usuário não encontrado” ≠ “senha incorreta”; o cadastro diz “e-mail já usado”; a recuperação diz “e-mail não cadastrado”.",
            destino:
              "Mesma mensagem e mesmo código para conta inexistente e senha errada. No cadastro e na recuperação, uma resposta neutra (“se o e-mail existir, enviaremos instruções”), com o resultado real indo por e-mail.",
          },
          {
            origem:
              "**Enumeração por tempo**: o usuário existente roda o hash lento e o inexistente responde na hora; a diferença é mensurável pela rede, mesmo com a mesma mensagem.",
            destino:
              "Fazer o mesmo trabalho nos dois casos: verificar contra um **hash fantasma** quando a conta não existe e comparar em tempo constante. Evitar atrasos fixos “de enfeite”, que o ruído desmascara.",
          },
          {
            origem:
              "**Outros sinais**: status diferentes (401, 404, 423), tamanho do corpo, redirecionamentos, MFA pedido só para contas reais, “conta bloqueada” aparecendo para uma conta existente.",
            destino:
              "**Uniformizar** status, corpo, cabeçalhos e fluxo (MFA e desafio seguem o mesmo roteiro para contas reais e inexistentes), e testar comparando as respostas com diferença automática.",
          },
          {
            origem: "O tráfego automatizado e distribuído parece, requisição a requisição, normal.",
            destino:
              "**Sinais agregados**: taxa de falhas global, por IP, faixa e cliente; proporção de contas distintas por origem; falha seguida de sucesso; user agents e proxies suspeitos. Responder com desafio adaptativo (CAPTCHA como um sinal entre vários), bloqueio de faixas, aviso de login suspeito ao dono da conta e alerta à equipe (Q139).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Mesma resposta e mesmo custo, a conta existindo ou não",
        legenda: "TypeScript",
        codigo: `// Calculado uma vez, com o mesmo custo dos hashes reais
const HASH_FANTASMA = await gerarHash("senha-que-ninguem-usa");

export async function login(email: string, senha: string) {
  const usuario = await repositorio.buscarPorEmail(email.toLowerCase());

  // Sempre paga o custo do hash lento, exista o usuário ou não
  const confere = await verificarHash(senha, usuario?.hashDaSenha ?? HASH_FANTASMA);

  if (!usuario || !confere) {
    // Mesmo status e mesmo corpo para "não existe" e "senha errada"
    return { status: 401, corpo: { erro: "credenciais_invalidas" } };
  }
  return iniciarSessao(usuario);
}`,
        nota: "Falta ainda a limitação por conta, IP e par (veja Q135). O mesmo cuidado vale para cadastro, recuperação de senha e qualquer endpoint que aceite um e-mail.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Dois problemas, uma superfície",
        texto:
          "O **stuffing** é autenticação em escala: o invasor já tem as senhas e só precisa saber de quem são. A **enumeração** é vazamento de informação: ela entrega a lista de contas reais, que alimenta o stuffing e o phishing. Por isso a defesa tem três frentes: tornar a senha vazada inútil (MFA, bloqueio de senhas vazadas), impedir que o servidor distinga os casos (respostas e tempos uniformes) e limitar e detectar por mais de uma dimensão.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Uniformidade total é difícil",
        texto:
          "Cadastro, recuperação de senha e tempo de resposta vazam com facilidade, e produtos que precisam dizer “esse e-mail já tem conta” trocam privacidade por usabilidade. Compense com limitação e desafio nesses endpoints e aceite o risco de forma consciente. E cuide do outro lado: o bloqueio por conta é uma arma de negação de serviço nas mãos do atacante (veja Q135).",
      },
    ],
    armadilhas: [
      "Uniformizar o login e deixar mensagens diferentes no cadastro, na recuperação de senha ou no “conta bloqueada”.",
      "Limitar só por IP (botnets distribuídas passam) ou só por conta (o spraying passa e o bloqueio vira negação de serviço).",
      "Achar que hash lento ou política de senhas complexas resolve: o invasor usa a senha correta de outro site, e só MFA e bloqueio de senhas vazadas atacam isso.",
      "Pôr um CAPTCHA fixo para todos: atrapalha as pessoas, há serviços que o resolvem e ele funciona melhor como um sinal adaptativo.",
    ],
    autoteste: [
      {
        pergunta: "Por que a enumeração de usuários é um problema se o login em si é seguro?",
        resposta:
          "Porque entrega ao atacante a lista de contas reais, que torna o stuffing, o spraying e o phishing mais eficientes, e expõe quem usa o serviço, o que é uma violação de privacidade.",
      },
      {
        pergunta: "Como o tempo de resposta revela se um e-mail existe, e como corrigir?",
        resposta:
          "Se o hash lento só roda quando o usuário existe, a diferença de tempo é mensurável. Corrige-se fazendo trabalho equivalente nos dois casos (hash fantasma) e uniformizando todo o caminho da resposta.",
      },
    ],
  },
  en: {
    titulo: "Credential stuffing and enumeration",
    pergunta:
      "How do credential stuffing, brute force and user enumeration work against a login? Which responses, delays and signals help detect and reduce them?",
    porqueEsteMetodo:
      "Credential stuffing and enumeration feed each other: the first needs to know whose each account is and the second reveals it. The pairs cover each technique and the response, delay or signal that defuses it.",
    resposta30s:
      "**Credential stuffing** tests email/password pairs leaked from other services at scale, betting on password reuse; **brute force** tries many guesses on one account; **enumeration** discovers which accounts exist through different messages, codes and **response times**. The defenses add up: **uniform responses and timing**, limits per account, IP and pair, adaptive challenges, **MFA**, blocking **leaked passwords** and volume detection from aggregate signals.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Attack → defense",
        rotuloOrigem: "Attack",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "**Credential stuffing**: lists of emails and passwords leaked from other services are tested at scale, by botnets, with few attempts per IP and per account. It works because people reuse passwords, and the “right” password passes any hash.",
            destino:
              "Make the leaked password useless: **MFA or passkeys** (see Q92 and Q96) and **blocking passwords known to be leaked or common** when creating and changing the password, as NIST SP 800-63B recommends (see Q87).",
          },
          {
            origem: "**Brute force**: many guesses against one account (or a dictionary against an important target).",
            destino:
              "Per-account limiting with **progressive delay** and a challenge, without locking the account permanently (see Q135). The slow hash (Q86) protects a leaked database; it does not stop an online guess.",
          },
          {
            origem:
              "**Password spraying**: a few common passwords against many accounts, one attempt per account, to dodge per-account lockout.",
            destino:
              "Limits and detection per **IP, range and device**, and a “many distinct accounts with the same password” signal. Blocking common passwords at creation reduces what spraying hits.",
          },
          {
            origem:
              "**Enumeration by message**: “user not found” ≠ “wrong password”; signup says “email already used”; recovery says “email not registered”.",
            destino:
              "The same message and the same code for a nonexistent account and a wrong password. For signup and recovery, a neutral answer (“if the email exists, we will send instructions”), with the real result going by email.",
          },
          {
            origem:
              "**Enumeration by timing**: an existing user runs the slow hash and a nonexistent one answers instantly; the difference is measurable over the network, even with the same message.",
            destino:
              "Do the same work in both cases: verify against a **dummy hash** when the account does not exist and compare in constant time. Avoid fixed “decorative” delays, which noise unmasks.",
          },
          {
            origem:
              "**Other signals**: different statuses (401, 404, 423), body size, redirects, MFA asked only for real accounts, “account locked” appearing for an existing account.",
            destino:
              "**Make uniform** the status, body, headers and flow (MFA and challenge follow the same script for real and nonexistent accounts), and test by diffing the responses automatically.",
          },
          {
            origem: "Automated, distributed traffic looks normal, request by request.",
            destino:
              "**Aggregate signals**: failure rate globally, per IP, range and client; ratio of distinct accounts per source; failure followed by success; suspicious user agents and proxies. Respond with an adaptive challenge (CAPTCHA as one signal among several), range blocking, a suspicious-login notice to the account owner and an alert to the team (Q139).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Same response and same cost, whether or not the account exists",
        legenda: "TypeScript",
        codigo: `// Computed once, with the same cost as real hashes
const DUMMY_HASH = await createHash("password-nobody-uses");

export async function login(email: string, password: string) {
  const user = await repository.findByEmail(email.toLowerCase());

  // Always pays the cost of the slow hash, whether or not the user exists
  const matches = await verifyHash(password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !matches) {
    // Same status and same body for "does not exist" and "wrong password"
    return { status: 401, body: { error: "invalid_credentials" } };
  }
  return startSession(user);
}`,
        nota: "Rate limiting per account, IP and pair is still missing (see Q135). The same care applies to signup, password recovery and any endpoint that accepts an email.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Two problems, one surface",
        texto:
          "**Stuffing** is authentication at scale: the attacker already has the passwords and only needs to know whose they are. **Enumeration** is an information leak: it hands over the list of real accounts, which feeds stuffing and phishing. So the defense has three fronts: make the leaked password useless (MFA, blocking leaked passwords), keep the server from telling the cases apart (uniform responses and timing) and limit and detect along more than one dimension.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Total uniformity is hard",
        texto:
          "Signup, password recovery and response time leak easily, and products that must say “this email already has an account” trade privacy for usability. Compensate with limits and challenges on those endpoints and accept the risk consciously. And watch the other side: per-account lockout is a denial-of-service weapon in the attacker’s hands (see Q135).",
      },
    ],
    armadilhas: [
      "Making login uniform and leaving different messages in signup, password recovery or the “account locked” notice.",
      "Limiting only per IP (distributed botnets get through) or only per account (spraying gets through and the lockout becomes denial of service).",
      "Thinking a slow hash or a complex-password policy solves it: the attacker uses the correct password from another site, and only MFA and blocking leaked passwords address that.",
      "Putting a fixed CAPTCHA in front of everyone: it hinders people, services exist that solve it, and it works better as an adaptive signal.",
    ],
    autoteste: [
      {
        pergunta: "Why is user enumeration a problem if the login itself is secure?",
        resposta:
          "Because it gives the attacker the list of real accounts, which makes stuffing, spraying and phishing more efficient, and it exposes who uses the service, which is a privacy violation.",
      },
      {
        pergunta: "How does response time reveal whether an email exists, and how do you fix it?",
        resposta:
          "If the slow hash only runs when the user exists, the time difference is measurable. You fix it by doing equivalent work in both cases (a dummy hash) and making the whole response path uniform.",
      },
    ],
  },
};
