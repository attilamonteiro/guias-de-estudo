import type { Pergunta } from "../../tipos";

// Q111 · Criptografia e chaves como controle de acesso
export const q111: Pergunta = {
  numero: 111,
  modulo: "autorizacao",
  metodo: "feynman",
  pt: {
    titulo: "Criptografia e chaves como controle de acesso",
    pergunta:
      "Como a criptografia (em trânsito, em repouso e por envelope) funciona como controle de acesso a dados sensíveis, e como o acesso às chaves (KMS) é governado pelo IAM?",
    porqueEsteMetodo:
      "A criptografia por envelope parece um emaranhado de chaves até você enxergar a imagem de um cofre dentro de outro. A analogia mostra por que a pergunta de acesso muda de lugar (do dado para a chave), e depois vêm o mecanismo e o ponto em que a imagem para de valer.",
    resposta30s:
      "Cifrar transforma “quem alcança o armazenamento” em “quem tem a chave”: **em trânsito** (TLS) protege a rede, **em repouso** protege disco, backup e banco, e a **criptografia por envelope** cifra cada dado com uma **chave de dados**, cifrada por uma **chave mestra** que fica num **KMS**. O IAM decide **quem pode usar e quem pode administrar** a chave, e cada uso fica registrado. Mas cifrar **não substitui autorização**: quem pode decifrar lê o dado em claro.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine um cofre dentro de outro. O armazém (o cofre grande) guarda milhares de caixas lacradas; cada caixa tem a sua chave pequena, e essas chaves pequenas ficam, também lacradas, num segundo cofre, o cofre de chaves, que só abre para quem tem autorização e anota quem o abriu. Quem entra no armazém mas não no cofre de chaves carrega caixas que não consegue abrir.",
        tecnico:
          "A criptografia vira controle de acesso quando **ler o dado exige uma chave**, e o acesso à chave é governado à parte do acesso ao armazenamento. Em **trânsito**, o TLS protege o dado entre cliente e servidor, e entre serviços, contra escuta e adulteração. **Em repouso**, o disco, o banco ou o bucket guardam o dado cifrado, contra o roubo de mídia, de backups e de snapshots. Na criptografia por **envelope**, cada dado é cifrado por uma **chave de dados** (DEK), e a DEK é cifrada por uma **chave mestra** (KEK) que fica num **KMS** ou HSM e não sai dele; a DEK cifrada é guardada junto do dado. Para ler, a aplicação pede ao KMS que decifre a DEK, e o KMS só atende se as políticas de IAM e da própria chave permitirem.",
        limite:
          "Cifrar não decide **quem deveria** ler. Se a aplicação alcança o armazenamento **e** tem permissão de decifrar, uma falha de autorização nela expõe o dado em claro. A cifragem transparente em repouso protege contra o roubo da mídia, não contra a consulta legítima do usuário errado: ela complementa a autorização (veja Q115), não a substitui.",
      },
      {
        tipo: "tabela",
        titulo: "Camadas de criptografia e o que cada uma controla",
        colunas: ["Camada", "Protege contra", "Quem ainda lê em claro", "Controle de acesso associado"],
        linhas: [
          [
            "Em trânsito (TLS, mTLS entre serviços)",
            "Escuta, adulteração e personificação do servidor na rede",
            "As duas pontas autenticadas",
            "Certificados e identidade das pontas; no mTLS, o certificado do cliente também autentica",
          ],
          [
            "Em repouso, transparente (disco, volume, banco, bucket)",
            "Roubo de disco, de backup e de snapshot; leitura do armazenamento fora do serviço",
            "Qualquer pessoa ou serviço autorizado a ler o armazenamento, porque a decifragem é automática",
            "Permissões do armazenamento e da chave que o serviço usa",
          ],
          [
            "Em repouso, na aplicação ou por campo",
            "Operadores do banco e vazamento da base; o dado sensível só aparece para quem decifra",
            "Só quem a aplicação deixa decifrar o campo",
            "Permissão de uso da chave, separada do acesso à base",
          ],
          [
            "Por envelope, com KMS",
            "As anteriores, com chaves por conjunto de dados e rotação sem recifrar tudo",
            "Quem tem permissão de decifrar a DEK no KMS",
            "Política da chave + IAM + contexto de criptografia, com trilha de auditoria de cada uso",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Cifrar e decifrar por envelope",
        etapas: [
          "A aplicação pede ao KMS uma chave de dados nova, indicando a chave mestra e um **contexto** (por exemplo, o id do paciente); o KMS confere se a identidade da aplicação pode usar essa chave para gerar chaves de dados",
          "O KMS devolve a chave de dados em claro e a mesma chave cifrada pela chave mestra",
          "A aplicação cifra o dado com a chave em claro (cifra autenticada, como AES-GCM), descarta a chave em claro da memória e grava o dado cifrado junto da chave de dados cifrada",
          "Para ler, a aplicação lê os dois e pede ao KMS que decifre a chave de dados, enviando o mesmo contexto",
          "O KMS confere a política da chave e as políticas de IAM de quem pede; sem permissão (ou com contexto diferente), ele recusa, e o dado fica ilegível mesmo que o armazenamento tenha sido lido",
          "Cada chamada ao KMS, permitida ou negada, entra na trilha de auditoria: quem tentou ler o quê, e quando",
        ],
        nota: "A rotação da chave mestra não exige recifrar todos os dados: as chaves de dados novas passam a usar a versão nova, e as existentes podem ser reenvelopadas. Nomes de operações e de políticas variam por fornecedor; confira a documentação do seu KMS.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Como o IAM governa as chaves",
        texto:
          "(1) **Separe quem administra de quem usa** a chave: quem altera a política ou agenda a exclusão não decifra, e quem decifra não altera a política (veja Q110). (2) **Menor privilégio de uso**: cada serviço usa só a chave do seu conjunto de dados e só as operações de que precisa (cifrar, decifrar), com condições como o contexto de criptografia (veja Q109). (3) **Ciclo de vida**: rotação periódica, versões antigas só para decifrar e exclusão com período de espera, porque apagar a chave destrói os dados (útil para descartá-los, desastroso por engano). (4) **Auditoria**: alerte sobre uso anômalo (decifragens em massa, uso fora do horário, negações repetidas) e sobre mudanças na política da chave.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A chave também é um alvo",
        texto:
          "Uma chave mestra exportável, ou uma cópia dela num repositório, numa variável de ambiente ou num ticket, anula o controle. Prefira KMS ou HSM em que a chave não sai, permissões estreitas em `Decrypt` (sem curinga, sem “toda a conta”) e identidades de carga de trabalho em vez de segredos (veja Q16). Lembre também que criptografia não substitui autorização, minimização de dados nem mascaramento: depois de decifrado, o dado é lido por quem o decifrou.",
      },
    ],
    armadilhas: [
      "Achar que “o banco é criptografado” resolve: com cifragem transparente, quem tem acesso ao banco lê tudo em claro. Ela protege contra o roubo de mídia, não contra autorização frouxa.",
      "Dar `Decrypt` (ou acesso total à chave) a toda a conta ou a todos os serviços: a chave deixa de ser um segundo controle.",
      "Guardar a chave junto do dado, no código ou no mesmo repositório: quem leva um leva os dois.",
      "Excluir ou desativar uma chave sem checar o que ela cifra: os dados ficam ilegíveis, e a exclusão costuma ser irreversível depois do período de espera.",
    ],
    autoteste: [
      {
        pergunta: "O que é criptografia por envelope e por que usá-la?",
        resposta:
          "Cada dado é cifrado com uma chave de dados, e essa chave é cifrada por uma chave mestra mantida no KMS. A mestra não sai do KMS, a rotação não exige recifrar todos os dados, e o acesso a cada dado passa por uma decisão de IAM auditável.",
      },
      {
        pergunta: "Se o armazenamento é cifrado em repouso, ainda preciso de autorização?",
        resposta:
          "Sim. A cifragem transparente decifra automaticamente para quem está autorizado a ler o armazenamento. Sem autorização por usuário e por registro, qualquer identidade com acesso lê o dado em claro; a criptografia protege a mídia e o vazamento de arquivos, não a lógica de quem pode ver o quê.",
      },
    ],
  },
  en: {
    titulo: "Encryption and keys as access control",
    pergunta:
      "How does encryption (in transit, at rest and envelope) work as an access control for sensitive data, and how is access to the keys (KMS) governed by IAM?",
    porqueEsteMetodo:
      "Envelope encryption looks like a tangle of keys until you picture one vault inside another. The analogy shows why the access question moves (from the data to the key); then come the mechanism and the point where the picture stops holding.",
    resposta30s:
      "Encrypting turns “who can reach the storage” into “who holds the key”: **in transit** (TLS) protects the network, **at rest** protects disks, backups and databases, and **envelope encryption** encrypts each piece of data with a **data key**, which is encrypted by a **master key** that lives in a **KMS**. IAM decides **who can use and who can administer** the key, and every use is logged. But encrypting **does not replace authorization**: whoever can decrypt reads the data in the clear.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Picture one vault inside another. The warehouse (the big vault) holds thousands of sealed boxes; each box has its own small key, and those small keys are kept, also sealed, in a second vault, the key vault, which only opens for authorized people and records who opened it. Someone who gets into the warehouse but not into the key vault carries boxes they cannot open.",
        tecnico:
          "Encryption becomes access control when **reading the data requires a key**, and access to the key is governed separately from access to the storage. **In transit**, TLS protects data between client and server, and between services, against eavesdropping and tampering. **At rest**, the disk, database or bucket holds the data encrypted, against theft of media, backups and snapshots. In **envelope** encryption, each piece of data is encrypted by a **data key** (DEK), and the DEK is encrypted by a **master key** (KEK) that lives in a **KMS** or HSM and does not leave it; the encrypted DEK is stored next to the data. To read, the application asks the KMS to decrypt the DEK, and the KMS only complies if the IAM policies and the key’s own policy allow it.",
        limite:
          "Encrypting does not decide **who should** read. If the application reaches the storage **and** has permission to decrypt, an authorization flaw in it exposes the data in the clear. Transparent encryption at rest protects against stolen media, not against a legitimate query by the wrong user: it complements authorization (see Q115), it does not replace it.",
      },
      {
        tipo: "tabela",
        titulo: "Encryption layers and what each one controls",
        colunas: ["Layer", "Protects against", "Who still reads it in the clear", "Associated access control"],
        linhas: [
          [
            "In transit (TLS, mTLS between services)",
            "Eavesdropping, tampering and impersonation of the server on the network",
            "The two authenticated endpoints",
            "Certificates and endpoint identity; with mTLS, the client certificate also authenticates",
          ],
          [
            "At rest, transparent (disk, volume, database, bucket)",
            "Theft of disks, backups and snapshots; reading the storage outside the service",
            "Anyone or any service authorized to read the storage, because decryption is automatic",
            "Permissions on the storage and on the key the service uses",
          ],
          [
            "At rest, in the application or per field",
            "Database operators and database leaks; sensitive data only appears to whoever decrypts",
            "Only whoever the application lets decrypt the field",
            "Permission to use the key, separate from access to the database",
          ],
          [
            "Envelope, with a KMS",
            "The above, with keys per data set and rotation without re-encrypting everything",
            "Whoever has permission to decrypt the DEK in the KMS",
            "Key policy + IAM + encryption context, with an audit trail of every use",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Encrypting and decrypting with an envelope",
        etapas: [
          "The application asks the KMS for a new data key, naming the master key and a **context** (for example, the patient id); the KMS checks that the application’s identity may use that key to generate data keys",
          "The KMS returns the data key in the clear and the same key encrypted by the master key",
          "The application encrypts the data with the clear key (an authenticated cipher such as AES-GCM), discards the clear key from memory and stores the encrypted data next to the encrypted data key",
          "To read, the application loads both and asks the KMS to decrypt the data key, sending the same context",
          "The KMS checks the key policy and the requester’s IAM policies; without permission (or with a different context) it refuses, and the data stays unreadable even if the storage was read",
          "Every KMS call, allowed or denied, goes into the audit trail: who tried to read what, and when",
        ],
        nota: "Rotating the master key does not require re-encrypting all the data: new data keys use the new version, and existing ones can be re-wrapped. Operation and policy names vary by vendor; check your KMS documentation.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "How IAM governs the keys",
        texto:
          "(1) **Separate who administers from who uses** the key: whoever changes the policy or schedules deletion does not decrypt, and whoever decrypts does not change the policy (see Q110). (2) **Least privilege on use**: each service uses only the key for its own data set and only the operations it needs (encrypt, decrypt), with conditions such as the encryption context (see Q109). (3) **Lifecycle**: periodic rotation, old versions only for decrypting and deletion with a waiting period, because deleting the key destroys the data (useful for disposing of it, disastrous by mistake). (4) **Auditing**: alert on anomalous use (mass decryption, off-hours use, repeated denials) and on changes to the key policy.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The key is a target too",
        texto:
          "An exportable master key, or a copy of it in a repository, an environment variable or a ticket, defeats the control. Prefer a KMS or HSM where the key does not leave, narrow permissions on `Decrypt` (no wildcard, no “the whole account”) and workload identities instead of secrets (see Q16). Remember too that encryption does not replace authorization, data minimization or masking: once decrypted, the data is read by whoever decrypted it.",
      },
    ],
    armadilhas: [
      "Thinking “the database is encrypted” settles it: with transparent encryption, anyone with database access reads everything in the clear. It protects against stolen media, not against loose authorization.",
      "Giving `Decrypt` (or full access to the key) to the whole account or to every service: the key stops being a second control.",
      "Storing the key next to the data, in the code or in the same repository: whoever takes one takes both.",
      "Deleting or disabling a key without checking what it encrypts: the data becomes unreadable, and deletion is usually irreversible after the waiting period.",
    ],
    autoteste: [
      {
        pergunta: "What is envelope encryption and why use it?",
        resposta:
          "Each piece of data is encrypted with a data key, and that key is encrypted by a master key kept in the KMS. The master key does not leave the KMS, rotation does not require re-encrypting all the data, and access to each piece of data goes through an auditable IAM decision.",
      },
      {
        pergunta: "If the storage is encrypted at rest, do I still need authorization?",
        resposta:
          "Yes. Transparent encryption decrypts automatically for whoever is authorized to read the storage. Without authorization per user and per record, any identity with access reads the data in the clear; encryption protects the media and file leaks, not the logic of who may see what.",
      },
    ],
  },
};
