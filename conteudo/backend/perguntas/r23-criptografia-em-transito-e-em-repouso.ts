import type { Pergunta } from "../../tipos";

// R23 · Criptografia em trânsito e em repouso
export const r23: Pergunta = {
  numero: 123,
  modulo: "roadmap-intermediario",
  metodo: "compare",
  pt: {
    titulo: "Criptografia em trânsito e em repouso",
    pergunta: "Como você trata criptografia e descriptografia de dados numa aplicação focada em privacidade?",
    porqueEsteMetodo:
      "Os dados correm riscos diferentes em lugares diferentes. Uma matriz de “em trânsito, em repouso e em uso” mostra qual proteção serve para qual risco.",
    resposta30s:
      "Separe **dados em trânsito** (protegidos por **TLS/HTTPS**, mTLS entre serviços) de **dados em repouso** (disco, banco, backups, protegidos por **AES-256** ou equivalente). O ponto crítico é a **gestão das chaves**: em **KMS/HSM**, fora do código e dos dados, com rotação e auditoria, e usando **criptografia em envelope**. Use algoritmos e bibliotecas padrão e nunca invente criptografia.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["", "Em trânsito", "Em repouso", "Em uso"],
        linhas: [
          [
            "Onde",
            "Entre cliente, serviços e banco",
            "Disco, banco, backups, storage",
            "Memória durante o processamento",
          ],
          [
            "Como",
            "TLS 1.2/1.3 (HTTPS), mTLS entre serviços",
            "AES-256 (disco, coluna ou arquivo) e criptografia do storage na nuvem",
            "Computação confidencial (enclaves), tokenização",
          ],
          [
            "Ameaça",
            "Interceptação e adulteração na rede",
            "Roubo de disco, backup ou dump",
            "Atacante com acesso ao host",
          ],
          [
            "Chaves",
            "Certificados e rotação",
            "**KMS/HSM**, chaves separadas dos dados, rotação",
            "Geridas pelo hardware ou enclave",
          ],
        ],
      },
      {
        tipo: "passos",
        titulo: "Boas práticas",
        passos: [
          {
            titulo: "Não invente criptografia",
            texto:
              "Use bibliotecas e algoritmos padronizados (AES-GCM, ChaCha20-Poly1305; RSA ou ECC para troca de chaves e assinaturas).",
          },
          {
            titulo: "Gerencie as chaves",
            texto: "Fora do código e do banco, em KMS, Key Vault ou HSM, com controle de acesso, rotação e auditoria.",
          },
          {
            titulo: "Criptografia em envelope",
            texto: "Uma chave de dados cifra os dados; uma chave mestra no KMS cifra a chave de dados.",
          },
          {
            titulo: "Hash não é criptografia",
            texto: "Senhas se guardam com hash lento (Argon2id), e não criptografadas (veja a Q20).",
          },
          {
            titulo: "Minimize",
            texto: "O dado que você não guarda não vaza: colete e retenha o mínimo.",
          },
        ],
      },
    ],
    armadilhas: [
      "Guardar a chave ao lado dos dados cifrados.",
      "Desligar o TLS entre serviços “internos”.",
      "Criptografar sem autenticação (usar modos autenticados como GCM) ou com ECB.",
      "Confundir criptografia (reversível) com hash (mão única).",
    ],
    autoteste: [
      {
        pergunta: "O que é criptografia em envelope?",
        resposta: "Uma chave de dados cifra os dados e é, por sua vez, cifrada por uma chave mestra guardada no KMS.",
      },
      {
        pergunta: "Qual a diferença entre dados em trânsito e em repouso?",
        resposta:
          "Em trânsito: dados que se movem pela rede (protegidos por TLS). Em repouso: dados armazenados (protegidos por criptografia de disco, coluna ou arquivo).",
      },
    ],
  },
  en: {
    titulo: "Encryption in transit and at rest",
    pergunta: "How do you handle data encryption and decryption in a privacy-focused application?",
    porqueEsteMetodo:
      "Data faces different risks in different places. An “in transit, at rest and in use” matrix shows which protection serves which risk.",
    resposta30s:
      "Separate **data in transit** (protected by **TLS/HTTPS**, mTLS between services) from **data at rest** (disk, database, backups, protected by **AES-256** or equivalent). The critical point is **key management**: in a **KMS/HSM**, outside the code and the data, with rotation and auditing, using **envelope encryption**. Use standard algorithms and libraries and never invent cryptography.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["", "In transit", "At rest", "In use"],
        linhas: [
          [
            "Where",
            "Between client, services and database",
            "Disk, database, backups, storage",
            "Memory during processing",
          ],
          [
            "How",
            "TLS 1.2/1.3 (HTTPS), mTLS between services",
            "AES-256 (disk, column or file) and cloud storage encryption",
            "Confidential computing (enclaves), tokenization",
          ],
          [
            "Threat",
            "Interception and tampering on the network",
            "Theft of a disk, backup or dump",
            "An attacker with access to the host",
          ],
          [
            "Keys",
            "Certificates and rotation",
            "**KMS/HSM**, keys separate from data, rotation",
            "Managed by hardware or the enclave",
          ],
        ],
      },
      {
        tipo: "passos",
        titulo: "Best practices",
        passos: [
          {
            titulo: "Do not invent cryptography",
            texto:
              "Use standardized libraries and algorithms (AES-GCM, ChaCha20-Poly1305; RSA or ECC for key exchange and signatures).",
          },
          {
            titulo: "Manage the keys",
            texto:
              "Outside the code and the database, in a KMS, Key Vault or HSM, with access control, rotation and auditing.",
          },
          {
            titulo: "Envelope encryption",
            texto: "A data key encrypts the data; a master key in the KMS encrypts the data key.",
          },
          {
            titulo: "A hash is not encryption",
            texto: "Passwords are stored with a slow hash (Argon2id), not encrypted (see Q20).",
          },
          {
            titulo: "Minimize",
            texto: "Data you do not keep cannot leak: collect and retain the minimum.",
          },
        ],
      },
    ],
    armadilhas: [
      "Storing the key next to the encrypted data.",
      "Turning TLS off between “internal” services.",
      "Encrypting without authentication (use authenticated modes such as GCM) or with ECB.",
      "Confusing encryption (reversible) with hashing (one-way).",
    ],
    autoteste: [
      {
        pergunta: "What is envelope encryption?",
        resposta: "A data key encrypts the data and is itself encrypted by a master key kept in the KMS.",
      },
      {
        pergunta: "What is the difference between data in transit and at rest?",
        resposta:
          "In transit: data moving across the network (protected by TLS). At rest: stored data (protected by disk, column or file encryption).",
      },
    ],
  },
};
