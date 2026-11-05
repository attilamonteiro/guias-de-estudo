import type { Pergunta } from "../../tipos";

// Q91 · Biometria como fator
export const q091: Pergunta = {
  numero: 91,
  modulo: "mfa-e-passkeys",
  metodo: "feynman",
  pt: {
    titulo: "Biometria como fator",
    pergunta:
      "Como funciona a autenticação biométrica e como escolher um sistema (FAR, FRR, EER, detecção de vivacidade)? Onde o template biométrico deve ficar armazenado?",
    porqueEsteMetodo:
      "A biometria parece mágica até você ver que é uma comparação com margem de erro. Uma analogia simples explica o limiar e o trade-off, e o mecanismo real traz as métricas e o lugar de guardar o dado.",
    resposta30s:
      "A biometria **mede uma característica do corpo**, a transforma num **template** (números, não a foto) e a **compara** com o cadastrado; se a similaridade passa de um **limiar**, aceita. Como nunca é idêntica, o limiar troca **FAR** (aceitar impostor) por **FRR** (recusar a pessoa certa), e o **EER** é o ponto em que os dois se igualam. Escolha olhando FAR e FRR no seu uso real e a **detecção de vivacidade**, e guarde o template **no dispositivo**, em hardware seguro, não num banco central.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense na sua assinatura. Você nunca a faz exatamente igual duas vezes, e quem confere no balcão decide se ela se parece o bastante com a ficha. Um conferente rígido barra falsificações, mas também recusa assinaturas verdadeiras num dia ruim. Um conferente permissivo não incomoda ninguém, mas deixa passar uma falsificação razoável.",
        tecnico:
          "O sistema biométrico faz o mesmo com números. Um sensor captura a característica (digital, rosto, íris, voz); um algoritmo extrai pontos característicos e os resume num **template**, que não é a imagem original, mas continua sendo dado sensível. Na verificação, uma nova captura gera outro template, e uma **pontuação de similaridade** é comparada a um **limiar**. A decisão é estatística: o mesmo dedo gera capturas ligeiramente diferentes a cada toque. Um módulo de **detecção de vivacidade** (detecção de ataque de apresentação) tenta distinguir um corpo real de foto, vídeo, máscara ou dedo falso.",
        limite:
          "A analogia falha na hora do vazamento: uma assinatura ou uma senha se trocam, mas rosto e digital **não são revogáveis** e também **não são segredo**, pois ficam em fotos, copos e câmeras. Por isso a biometria vale como forma de **destravar** uma credencial guardada no dispositivo (algo que você tem), e não como uma senha enviada a um servidor.",
      },
      {
        tipo: "fluxo",
        titulo: "Do cadastro à decisão",
        etapas: [
          "Cadastro: o sensor captura várias amostras da pessoa, de preferência sob supervisão",
          "Extração: o algoritmo transforma cada amostra em características e gera o template (números), descartando a imagem sempre que possível",
          "Armazenamento: o template fica protegido, de preferência no dispositivo, em hardware seguro",
          "Verificação: nova captura, com checagem de vivacidade para barrar foto, vídeo, máscara ou dedo falso",
          "Comparação: o sistema calcula uma pontuação de similaridade entre os dois templates",
          "Decisão: pontuação acima do limiar aceita; abaixo, recusa e oferece alternativa (PIN ou outro fator)",
          "Autenticação moderna: o resultado local só libera uma chave do dispositivo, que assina o desafio; o servidor recebe a assinatura, nunca a biometria",
        ],
        nota: "Verificação (1:1, “sou quem digo ser”) é diferente de identificação (1:N, “quem é esta pessoa?”). A autenticação usa a primeira; a segunda erra mais e traz mais risco de privacidade.",
      },
      {
        tipo: "tabela",
        titulo: "O que medir ao escolher um sistema",
        colunas: ["Métrica", "O que mede", "Como usar na escolha"],
        linhas: [
          [
            "FAR (taxa de falsa aceitação)",
            "Quantos impostores o sistema aceita",
            "Quanto menor, mais seguro. Priorize onde o custo de um invasor é alto (áreas críticas, contas privilegiadas)",
          ],
          [
            "FRR (taxa de falsa rejeição)",
            "Quantas pessoas legítimas ele recusa",
            "Quanto menor, menos bloqueios e chamados. Priorize onde o volume é alto e o risco, menor",
          ],
          [
            "EER (ponto de igualdade)",
            "A taxa em que FAR e FRR se igualam ao mover o limiar",
            "Bom resumo para comparar sistemas (menor é melhor), mas peça o FAR e o FRR no limiar que você vai usar, não só o EER",
          ],
          [
            "Detecção de vivacidade",
            "Resistência a ataques de apresentação: foto, vídeo, máscara, dedo falso e deepfake (veja a série ISO/IEC 30107)",
            "Exija testes de laboratório independente, também contra injeção de vídeo no caso do rosto",
          ],
          [
            "Falha de cadastro e de captura (FTE e FTA)",
            "Quem não consegue registrar ou ser lido (dedo gasto, luvas, pouca luz)",
            "Mede a exclusão: planeje uma alternativa para esses casos",
          ],
          [
            "Equidade e acessibilidade",
            "Desempenho por faixa etária, tom de pele, gênero e pessoas com deficiência",
            "Peça resultados por grupo: sistemas com viés bloqueiam alguns grupos mais que outros",
          ],
          [
            "Arquitetura e privacidade",
            "Onde o template fica, se a comparação é no dispositivo, como é cifrado e quem acessa",
            "Prefira comparação no dispositivo e templates protegidos; verifique a base legal (LGPD)",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Onde guardar o template",
        texto:
          "Prefira **o dispositivo do usuário, em hardware seguro** (Secure Enclave, TPM, enclave de confiança do Android), com **comparação no próprio dispositivo**: Face ID, Touch ID e Windows Hello comparam localmente e, se aceitam, liberam uma chave que assina o desafio do servidor (veja Q92 e Q94). O servidor nunca vê a biometria, o que o protege de um vazamento em massa e reduz a obrigação legal. Só guarde template num servidor quando o caso exigir (controle de acesso físico corporativo, identificação governamental) e então use banco isolado, cifrado, chaves em HSM, retenção mínima e acesso auditado. Nunca a imagem crua, nunca em log.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Desafios numa grande empresa e a LGPD",
        texto:
          "Numa grande empresa, use a biometria para destravar uma credencial local (Windows Hello for Business, passkeys) em vez de montar um banco central, e mantenha PIN ou chave de segurança para quem não consegue usá-la. A **LGPD** classifica o dado biométrico como dado pessoal sensível: exige base legal, finalidade, minimização e transparência, e, para empregados, o consentimento nem sempre é livre, então alinhe com o jurídico. Os demais desafios são o cadastro em escala, a exclusão e a acessibilidade, os ataques de apresentação, o vazamento irreversível, o custo de hardware e manutenção, o ambiente (luvas, luz, higiene) e o descarte do template quando a pessoa sai.",
      },
    ],
    armadilhas: [
      "Achar que a biometria é segredo ou senha: é um identificador exposto no mundo, que não se troca.",
      "Escolher pelo EER sozinho ou pelo número do folheto: o desempenho muda com sensor, ambiente e população, então teste no seu uso real.",
      "Guardar templates (ou imagens) num banco central junto com os demais dados de usuário: o vazamento é permanente.",
      "Não ter alternativa: sem PIN ou outro fator, os falsos rejeitados ficam bloqueados e o sistema vira um problema de acessibilidade.",
    ],
    autoteste: [
      {
        pergunta: "O que acontece com FAR e FRR quando você aumenta o rigor (o limiar) do sistema?",
        resposta:
          "O FAR cai (menos impostores passam) e o FRR sobe (mais pessoas legítimas são recusadas). O EER é o ponto em que os dois se igualam.",
      },
      {
        pergunta: "Por que a comparação no dispositivo é preferível a um banco central de templates?",
        resposta:
          "Porque o template e a comparação nunca saem do hardware seguro do aparelho: o servidor recebe só uma assinatura criptográfica. Um vazamento do servidor não expõe biometria, que não se pode revogar.",
      },
    ],
  },
  en: {
    titulo: "Biometrics as a factor",
    pergunta:
      "How does biometric authentication work, and how do you choose a system (FAR, FRR, EER, liveness detection)? Where should the biometric template be stored?",
    porqueEsteMetodo:
      "Biometrics seems like magic until you see it is a comparison with a margin of error. A simple analogy explains the threshold and the trade-off, and the real mechanism brings the metrics and the place to store the data.",
    resposta30s:
      "Biometrics **measures a trait of the body**, turns it into a **template** (numbers, not the photo) and **compares** it with the enrolled one; if the similarity passes a **threshold**, it accepts. Since it is never identical, the threshold trades **FAR** (accepting an impostor) against **FRR** (rejecting the right person), and the **EER** is the point where they are equal. Choose by looking at FAR and FRR in your real use and at **liveness detection**, and store the template **on the device**, in secure hardware, not in a central database.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of your signature. You never make it exactly the same twice, and whoever checks at the counter decides whether it looks enough like the card on file. A strict checker blocks forgeries but also rejects genuine signatures on a bad day. A lenient checker bothers no one but lets a decent forgery through.",
        tecnico:
          "A biometric system does the same with numbers. A sensor captures the trait (fingerprint, face, iris, voice); an algorithm extracts characteristic points and condenses them into a **template**, which is not the original image but is still sensitive data. At verification, a new capture produces another template, and a **similarity score** is compared with a **threshold**. The decision is statistical: the same finger yields slightly different captures on each touch. A **liveness detection** module (presentation attack detection) tries to tell a real body from a photo, video, mask or fake finger.",
        limite:
          "The analogy fails at the moment of a leak: a signature or a password can be replaced, but a face and a fingerprint are **not revocable** and are also **not secret**, since they show up in photos, glasses and cameras. That is why biometrics works as a way to **unlock** a credential kept on the device (something you have), not as a password sent to a server.",
      },
      {
        tipo: "fluxo",
        titulo: "From enrollment to decision",
        etapas: [
          "Enrollment: the sensor captures several samples of the person, preferably supervised",
          "Extraction: the algorithm turns each sample into features and produces the template (numbers), discarding the image whenever possible",
          "Storage: the template is protected, preferably on the device, in secure hardware",
          "Verification: a new capture, with a liveness check to stop a photo, video, mask or fake finger",
          "Comparison: the system computes a similarity score between the two templates",
          "Decision: a score above the threshold accepts; below it, the system rejects and offers an alternative (PIN or another factor)",
          "Modern authentication: the local result only unlocks a key on the device, which signs the challenge; the server receives the signature, never the biometric",
        ],
        nota: "Verification (1:1, “I am who I claim to be”) is different from identification (1:N, “who is this person?”). Authentication uses the first; the second makes more errors and carries more privacy risk.",
      },
      {
        tipo: "tabela",
        titulo: "What to measure when choosing a system",
        colunas: ["Metric", "What it measures", "How to use it in the choice"],
        linhas: [
          [
            "FAR (false acceptance rate)",
            "How many impostors the system accepts",
            "The lower, the safer. Prioritize where an intruder’s cost is high (critical areas, privileged accounts)",
          ],
          [
            "FRR (false rejection rate)",
            "How many legitimate people it rejects",
            "The lower, the fewer lockouts and tickets. Prioritize where volume is high and risk is lower",
          ],
          [
            "EER (equal error rate)",
            "The rate at which FAR and FRR are equal as the threshold moves",
            "A good summary for comparing systems (lower is better), but ask for FAR and FRR at the threshold you will use, not only the EER",
          ],
          [
            "Liveness detection",
            "Resistance to presentation attacks: photo, video, mask, fake finger and deepfake (see the ISO/IEC 30107 series)",
            "Demand independent laboratory tests, also against video injection in the case of faces",
          ],
          [
            "Failure to enroll and to acquire (FTE and FTA)",
            "Who cannot register or be read (worn fingers, gloves, low light)",
            "It measures exclusion: plan an alternative for those cases",
          ],
          [
            "Fairness and accessibility",
            "Performance by age group, skin tone, gender and people with disabilities",
            "Ask for results per group: biased systems lock out some groups more than others",
          ],
          [
            "Architecture and privacy",
            "Where the template lives, whether matching is on the device, how it is encrypted and who has access",
            "Prefer on-device matching and protected templates; check the legal basis (LGPD)",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Where to store the template",
        texto:
          "Prefer **the user’s device, in secure hardware** (Secure Enclave, TPM, Android’s trusted environment), with **matching on the device itself**: Face ID, Touch ID and Windows Hello compare locally and, if they accept, unlock a key that signs the server’s challenge (see Q92 and Q94). The server never sees the biometric, which protects it from a mass leak and reduces legal obligations. Only store a template on a server when the case demands it (corporate physical access control, government identification), and then use an isolated database, encryption, keys in an HSM, minimal retention and audited access. Never the raw image, never in logs.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Challenges in a large enterprise, and the LGPD",
        texto:
          "In a large enterprise, use biometrics to unlock a local credential (Windows Hello for Business, passkeys) instead of building a central database, and keep a PIN or security key for people who cannot use it. Brazil’s **LGPD** classifies biometric data as sensitive personal data: it requires a legal basis, purpose, minimization and transparency, and for employees consent is not always freely given, so align with legal counsel. The other challenges are enrollment at scale, exclusion and accessibility, presentation attacks, an irreversible leak, hardware and maintenance cost, the environment (gloves, light, hygiene) and deleting the template when the person leaves.",
      },
    ],
    armadilhas: [
      "Treating biometrics as a secret or a password: it is an identifier exposed to the world and cannot be changed.",
      "Choosing by EER alone or by the brochure number: performance changes with sensor, environment and population, so test in your real use.",
      "Storing templates (or images) in a central database next to the rest of the user data: the leak is permanent.",
      "Having no alternative: without a PIN or another factor, falsely rejected people stay locked out and the system becomes an accessibility problem.",
    ],
    autoteste: [
      {
        pergunta: "What happens to FAR and FRR when you make the system stricter (raise the threshold)?",
        resposta:
          "FAR falls (fewer impostors get in) and FRR rises (more legitimate people are rejected). The EER is the point where the two are equal.",
      },
      {
        pergunta: "Why is on-device matching better than a central template database?",
        resposta:
          "Because the template and the comparison never leave the device’s secure hardware: the server receives only a cryptographic signature. A server leak does not expose biometrics, which cannot be revoked.",
      },
    ],
  },
};
