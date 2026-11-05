import type { Pergunta } from "../../tipos";

// Q141 · Resposta a vazamento de segredo
export const q141: Pergunta = {
  numero: 141,
  modulo: "ataques-e-depuracao",
  metodo: "playbook",
  pt: {
    titulo: "Resposta a vazamento de segredo",
    pergunta:
      "Um segredo de produção (chave de API, senha de banco, client secret) foi exposto. Como responder, em que ordem, e como evitar recorrência?",
    porqueEsteMetodo:
      "Com um segredo exposto, cada hora de atraso é janela de abuso, e a ordem entre rotacionar, investigar e limpar muda o resultado. O playbook fixa a sequência e o critério de verificação de cada passo.",
    resposta30s:
      "Trate o segredo como **comprometido** e **rotacione e revogue primeiro**, sem esperar a investigação: crie o novo, implante, valide e revogue o antigo (ou revogue já, se há abuso). Depois **procure uso indevido nos logs** desde a exposição, limpe histórico e artefatos (isso não substitui a rotação) e comunique. Previna com scanner de segredos no pipeline, cofre, identidades gerenciadas, credenciais efêmeras e permissões mínimas, e verifique tentando usar a credencial antiga: ela precisa ser recusada.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook de segredo exposto",
        passos: [
          {
            titulo: "1. Trate como comprometido e abra o incidente",
            texto:
              "Se o segredo apareceu em repositório, log, ticket, chat, imagem de contêiner, artefato de build ou código do front-end, assuma que alguém o copiou: robôs varrem repositórios públicos continuamente. Registre o que ele é, onde foi exposto, desde quando, quem tinha acesso à fonte e **o que ele permite fazer**. Sinal de etapa concluída: você sabe quem é o dono do segredo e qual sistema ele protege.",
          },
          {
            titulo: "2. Rotacione e revogue primeiro",
            texto:
              "Sem esperar a investigação: crie a credencial nova, implante nos consumidores (por cofre ou variável de ambiente), valide e só então revogue a antiga (veja a tabela). Se há abuso em andamento, revogue já e aceite a indisponibilidade como decisão consciente. Sinal: a credencial antiga é recusada.",
          },
          {
            titulo: "3. Investigue o uso indevido, sem adivinhar",
            texto:
              "Defina a **janela de exposição** (da primeira publicação à revogação) e procure nos logs do serviço que o segredo protege: IPs e redes desconhecidos, horários e volumes fora do padrão, leituras em massa, criação de recursos, de credenciais ou de permissões. Formule uma hipótese e a confirme com um registro, não com palpite. Se os logs não cobrem a janela, assuma o pior caso.",
          },
          {
            titulo: "4. Procure persistência e contenha o alcance",
            texto:
              "Quem usou o segredo pode ter criado credenciais, usuários, tokens ou acesso remoto novos. Revogue sessões e tokens derivados, remova o que foi criado e confira se o segredo dava acesso a dados que exigem comunicação.",
          },
          {
            titulo: "5. Limpe histórico e artefatos",
            texto:
              "Tire o segredo do histórico do Git (reescrita), de imagens, artefatos de CI, logs, tickets e chats, e peça ao provedor do repositório que limpe caches, se for o caso. Isto vem **depois** da rotação e é higiene, não correção: assuma que as cópias já existem.",
          },
          {
            titulo: "6. Comunique",
            texto:
              "Equipe de segurança e dono do serviço, fornecedor do segredo (alguns revogam sozinhos chaves que detectam em repositórios públicos) e, se houve acesso a dados, o jurídico e quem a lei e os contratos exigirem, nos prazos aplicáveis.",
          },
          {
            titulo: "7. Previna a recorrência e verifique",
            texto:
              "**Varredura de segredos** no pré-commit e no pipeline (com bloqueio de push quando o provedor oferecer), **cofre** de segredos, **identidades gerenciadas** e credenciais efêmeras por federação para eliminar o segredo estático (veja Q14 e Q16) e permissões mínimas para o que sobrar (veja Q109). Verifique de verdade: use a credencial antiga e confirme que falha, confirme que a nova funciona e rode a varredura de novo.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Rotação por tipo de segredo",
        colunas: ["Segredo", "Como rotacionar sem derrubar a produção", "Cuidado extra"],
        linhas: [
          [
            "Client secret OAuth",
            "Gere um segundo segredo, publique nos consumidores, confirme o uso e remova o antigo (muitos IdPs aceitam dois segredos ativos ao mesmo tempo; confira a documentação)",
            "Quem teve o segredo pode ter obtido tokens: revogue os emitidos para esse cliente quando houver suspeita (veja Q35)",
          ],
          [
            "Senha de banco de dados",
            "Crie a credencial nova, atualize os consumidores pelo cofre, recicle os pools de conexão e derrube as conexões da senha antiga",
            "Procure nos logs de conexão IPs e consultas incomuns e reveja as permissões da conta (veja Q109)",
          ],
          [
            "Chave de API de terceiro",
            "Gere outra no console do fornecedor, implante, valide e revogue a antiga",
            "Veja o uso por chave, cobranças e limites incomuns, e avise o fornecedor",
          ],
          [
            "Chave de assinatura de tokens ou segredo de webhook",
            "Publique a chave nova (no JWKS ou no consumidor) antes de assinar com ela; retire a antiga quando os tokens assinados por ela expirarem (veja Q73)",
            "Se a chave vazou, tudo o que ela assinou deixa de ser confiável: aceite o corte e force nova autenticação",
          ],
          [
            "Chave privada de TLS",
            "Emita um certificado novo com um par de chaves novo e revogue o anterior",
            "Reemitir com a mesma chave privada não resolve nada",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Verificar que a credencial antiga morreu",
        legenda: "HTTP",
        codigo: `# 1. Credencial antiga (revogada): precisa ser recusada
GET /v1/orders HTTP/1.1
Host: api.example.com
Authorization: Bearer <chave-antiga>

HTTP/1.1 401 Unauthorized

# 2. Credencial nova: precisa funcionar
GET /v1/orders HTTP/1.1
Host: api.example.com
Authorization: Bearer <chave-nova>

HTTP/1.1 200 OK`,
        nota: "Os comentários com # são só anotações. Alguns serviços recusam com 403 em vez de 401; num banco de dados, tente abrir a conexão com a senha antiga. Se a antiga ainda funcionar, a revogação não aconteceu.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rotacione antes de investigar",
        texto:
          "O segredo exposto pode estar sendo usado agora. Rotacione e revogue **sem esperar** a conclusão da investigação, e investigue depois o uso indevido na janela de exposição. Apagar o commit, o arquivo ou a mensagem não conserta nada: cópias, forks, caches e logs de CI já podem existir.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Revogar também pode derrubar",
        texto:
          "A ordem segura é criar o novo, implantar, validar e só então revogar o antigo. Segredos têm cópias escondidas (homologação, scripts, imagens, outros repositórios): faça o inventário dos consumidores para não derrubar a produção às cegas. Se o abuso está em curso, o risco de esperar é maior que o da queda, e a revogação imediata passa a ser a decisão certa.",
      },
    ],
    armadilhas: [
      "Apagar o commit, o arquivo ou reescrever o histórico e dar por resolvido: cópias, forks, caches e logs de CI já existem.",
      "Investigar primeiro e rotacionar depois: cada hora com a chave válida é janela para abuso.",
      "Rotacionar sem inventariar os consumidores (derruba a produção) ou esquecer cópias do segredo em homologação, scripts, imagens e outros repositórios.",
      "Resolver só o segredo exposto e não a causa: continuam existindo segredos estáticos e amplos em variáveis de CI e no código.",
    ],
    autoteste: [
      {
        pergunta: "Por que a ordem é rotacionar e revogar antes de investigar?",
        resposta:
          "Porque o segredo pode estar em uso agora e cada hora de espera amplia o abuso. A investigação continua depois, sobre a janela de exposição, e não depende de a credencial antiga seguir válida.",
      },
      {
        pergunta: "Como confirmar que a rotação funcionou?",
        resposta:
          "Usando a credencial antiga de verdade e vendo a recusa (401, 403 ou falha de login), confirmando que a nova funciona nos consumidores e rodando de novo a varredura de segredos no código e nos artefatos.",
      },
    ],
  },
  en: {
    titulo: "Responding to a leaked secret",
    pergunta:
      "A production secret (API key, database password, client secret) has been exposed. How do you respond, in what order, and how do you prevent recurrence?",
    porqueEsteMetodo:
      "With an exposed secret, every hour of delay is a window for abuse, and the order of rotating, investigating and cleaning changes the outcome. The playbook fixes the sequence and the verification criterion of each step.",
    resposta30s:
      "Treat the secret as **compromised** and **rotate and revoke first**, without waiting for the investigation: create the new one, deploy it, validate it and revoke the old one (or revoke immediately if there is abuse). Then **look for misuse in the logs** since the exposure, clean history and artifacts (that does not replace rotation) and communicate. Prevent recurrence with pipeline secret scanning, a vault, managed identities, ephemeral credentials and least privilege, and verify by trying the old credential: it must be rejected.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Exposed-secret playbook",
        passos: [
          {
            titulo: "1. Treat it as compromised and open the incident",
            texto:
              "If the secret showed up in a repository, log, ticket, chat, container image, build artifact or front-end code, assume someone copied it: bots continuously scan public repositories. Record what it is, where it was exposed, since when, who had access to the source and **what it allows**. Sign the step is done: you know who owns the secret and which system it protects.",
          },
          {
            titulo: "2. Rotate and revoke first",
            texto:
              "Without waiting for the investigation: create the new credential, deploy it to the consumers (through the vault or an environment variable), validate it and only then revoke the old one (see the table). If abuse is under way, revoke immediately and accept the outage as a conscious decision. Sign: the old credential is rejected.",
          },
          {
            titulo: "3. Investigate misuse, without guessing",
            texto:
              "Define the **exposure window** (from the first publication to the revocation) and search the logs of the service the secret protects: unknown IPs and networks, out-of-pattern times and volumes, mass reads, creation of resources, credentials or permissions. Form a hypothesis and confirm it with a record, not a hunch. If the logs do not cover the window, assume the worst case.",
          },
          {
            titulo: "4. Hunt for persistence and contain the reach",
            texto:
              "Whoever used the secret may have created new credentials, users, tokens or remote access. Revoke derived sessions and tokens, remove what was created and check whether the secret gave access to data that requires notification.",
          },
          {
            titulo: "5. Clean history and artifacts",
            texto:
              "Remove the secret from Git history (rewrite), images, CI artifacts, logs, tickets and chats, and ask the repository provider to clear caches if needed. This comes **after** rotation and is hygiene, not a fix: assume the copies already exist.",
          },
          {
            titulo: "6. Communicate",
            texto:
              "The security team and the service owner, the secret’s vendor (some revoke keys they detect in public repositories on their own) and, if data was accessed, legal and whoever the law and contracts require, within the applicable deadlines.",
          },
          {
            titulo: "7. Prevent recurrence and verify",
            texto:
              "**Secret scanning** at pre-commit and in the pipeline (with push blocking when the provider offers it), a secrets **vault**, **managed identities** and ephemeral credentials through federation to eliminate the static secret (see Q14 and Q16), and least privilege for whatever remains (see Q109). Verify for real: use the old credential and confirm it fails, confirm the new one works and run the scan again.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Rotation by secret type",
        colunas: ["Secret", "How to rotate without taking production down", "Extra care"],
        linhas: [
          [
            "OAuth client secret",
            "Generate a second secret, publish it to the consumers, confirm it is used and remove the old one (many IdPs allow two active secrets at once; check the documentation)",
            "Whoever held the secret may have obtained tokens: revoke those issued to that client when in doubt (see Q35)",
          ],
          [
            "Database password",
            "Create the new credential, update the consumers through the vault, recycle the connection pools and drop connections made with the old password",
            "Search the connection logs for unusual IPs and queries and review the account’s permissions (see Q109)",
          ],
          [
            "Third-party API key",
            "Generate another in the vendor’s console, deploy, validate and revoke the old one",
            "Check usage per key, charges and unusual limits, and tell the vendor",
          ],
          [
            "Token signing key or webhook secret",
            "Publish the new key (in the JWKS or at the consumer) before signing with it; retire the old one when the tokens it signed expire (see Q73)",
            "If the key leaked, everything it signed is no longer trustworthy: accept the cut and force re-authentication",
          ],
          [
            "TLS private key",
            "Issue a new certificate with a new key pair and revoke the previous one",
            "Reissuing with the same private key fixes nothing",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Verifying the old credential is dead",
        legenda: "HTTP",
        codigo: `# 1. Old credential (revoked): must be rejected
GET /v1/orders HTTP/1.1
Host: api.example.com
Authorization: Bearer <old-key>

HTTP/1.1 401 Unauthorized

# 2. New credential: must work
GET /v1/orders HTTP/1.1
Host: api.example.com
Authorization: Bearer <new-key>

HTTP/1.1 200 OK`,
        nota: "The # comments are just annotations. Some services reject with 403 instead of 401; for a database, try opening a connection with the old password. If the old one still works, the revocation did not happen.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rotate before investigating",
        texto:
          "The exposed secret may be in use right now. Rotate and revoke **without waiting** for the investigation to finish, then investigate misuse over the exposure window. Deleting the commit, the file or the message fixes nothing: copies, forks, caches and CI logs may already exist.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Revoking can also take things down",
        texto:
          "The safe order is create the new one, deploy, validate and only then revoke the old one. Secrets have hidden copies (staging, scripts, images, other repositories): inventory the consumers so you do not take production down blindly. If abuse is under way, the risk of waiting exceeds the risk of the outage, and immediate revocation becomes the right call.",
      },
    ],
    armadilhas: [
      "Deleting the commit or file, or rewriting history, and calling it done: copies, forks, caches and CI logs already exist.",
      "Investigating first and rotating later: every hour with the key valid is a window for abuse.",
      "Rotating without inventorying the consumers (it takes production down) or forgetting copies of the secret in staging, scripts, images and other repositories.",
      "Fixing only the exposed secret and not the cause: static, broad secrets keep living in CI variables and in code.",
    ],
    autoteste: [
      {
        pergunta: "Why is the order rotate and revoke before investigating?",
        resposta:
          "Because the secret may be in use now and every hour of waiting widens the abuse. The investigation continues afterwards, over the exposure window, and does not depend on the old credential staying valid.",
      },
      {
        pergunta: "How do you confirm the rotation worked?",
        resposta:
          "By using the old credential for real and seeing the rejection (401, 403 or a login failure), confirming the new one works in the consumers and running the secret scan again over the code and the artifacts.",
      },
    ],
  },
};
