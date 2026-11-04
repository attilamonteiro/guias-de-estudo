/* roadmap.sh · Avançado (R34-R50, ids 134-150). */
window.QS = window.QS || [];

/* R34 */
window.QS.push({
  n: 134, g: "V", alias: 10,
  pt: { s: "Replicação e tolerância a falhas", q: "O que é replicação de banco de dados e como ela pode ser usada para tolerância a falhas?" },
  en: { s: "Replication and fault tolerance", q: "What is database replication, and how can it be used for fault tolerance?" }
});

/* R35 */
window.QS.push({
  n: 135, g: "V", m: "trace",
  pt: {
    s: "Deploy blue-green",
    q: "Descreva o uso da estratégia de deploy blue-green em serviços de backend.",
    why: "Blue-green é uma troca em passos ordenados. Seguir o deploy do ambiente novo até o rollback mostra onde está a vantagem e onde estão os riscos.",
    one: "Mantêm-se **dois ambientes de produção idênticos**: um (azul) atende o tráfego real e o outro (verde) recebe a versão nova. Depois de testada, o **roteamento troca de uma vez** para o verde. O azul fica de pé como plano B, então o **rollback é só reapontar o tráfego**, em segundos. O desafio é o **banco compartilhado**, que precisa ser compatível com as duas versões.",
    b: [
      { t: "fl", ti: "Passo a passo", n: ["A produção atual roda no ambiente **Azul** (recebe todo o tráfego)", "Implanta a versão nova no ambiente **Verde** (idêntico, sem tráfego)", "Roda migrações compatíveis, smoke tests e verificações no Verde", "Troca o roteamento (balanceador ou DNS): 100% do tráfego vai para o Verde", "Observa as métricas; o Azul fica de pé como plano B", "Problema? Volta o roteamento para o Azul em segundos (rollback)"] },
      { t: "tb", ti: "Blue-green, rolling e canary", h: ["Estratégia", "Como", "Rollback", "Custo"], r: [
        ["Blue-green", "Dois ambientes completos; troca de uma vez", "Instantâneo", "Alto (infraestrutura dobrada durante a troca)"],
        ["Rolling", "Atualiza instâncias aos poucos no mesmo ambiente", "Lento (reverte instâncias)", "Baixo"],
        ["Canary", "Poucos % do tráfego vão para a versão nova, aumentando aos poucos", "Rápido (tira o canary)", "Médio; exige mais observabilidade"]
      ] },
      { t: "tp", k: "warn", h: "O banco é o ponto difícil", x: "Os dois ambientes costumam compartilhar o banco. As migrações precisam ser **compatíveis com as duas versões** (expandir, migrar, contrair; veja a R37), senão o rollback quebra." }
    ],
    traps: [
      "Migração de banco incompatível com a versão antiga: sem rollback possível.",
      "Ambientes que divergem (não são idênticos).",
      "Desligar o ambiente antigo cedo demais.",
      "Sessões e caches que se perdem na troca."
    ],
    rc: [
      ["Qual a principal vantagem do blue-green?", "Rollback quase instantâneo, só reapontando o tráfego para o ambiente anterior, e deploy sem indisponibilidade."],
      ["Qual o principal desafio?", "O banco e o esquema compartilhados, que precisam ser compatíveis com as duas versões, além do custo de manter dois ambientes."]
    ]
  },
  en: {
    s: "Blue-green deployment",
    q: "Describe the use of the blue-green deployment strategy in backend services.",
    why: "Blue-green is a switch in ordered steps. Following the deploy from the new environment to the rollback shows where the advantage lies and where the risks are.",
    one: "You keep **two identical production environments**: one (blue) serves real traffic and the other (green) receives the new version. Once tested, the **routing switches all at once** to green. Blue stays up as a fallback, so **rollback is just repointing traffic**, in seconds. The challenge is the **shared database**, which must be compatible with both versions.",
    b: [
      { t: "fl", ti: "Step by step", n: ["Current production runs on the **Blue** environment (all traffic)", "Deploy the new version to the **Green** environment (identical, no traffic)", "Run compatible migrations, smoke tests and checks on Green", "Switch the routing (load balancer or DNS): 100% of traffic goes to Green", "Watch the metrics; Blue stays up as the fallback", "Problem? Point the routing back to Blue in seconds (rollback)"] },
      { t: "tb", ti: "Blue-green, rolling and canary", h: ["Strategy", "How", "Rollback", "Cost"], r: [
        ["Blue-green", "Two full environments; switch at once", "Instant", "High (doubled infrastructure during the switch)"],
        ["Rolling", "Update instances gradually in the same environment", "Slow (revert instances)", "Low"],
        ["Canary", "A small % of traffic goes to the new version, growing gradually", "Fast (remove the canary)", "Medium; needs more observability"]
      ] },
      { t: "tp", k: "warn", h: "The database is the hard part", x: "The two environments usually share the database. Migrations must be **compatible with both versions** (expand, migrate, contract; see R37), or rollback breaks." }
    ],
    traps: [
      "A database migration incompatible with the old version: no rollback possible.",
      "Environments that drift apart (not identical).",
      "Shutting down the old environment too early.",
      "Sessions and caches lost in the switch."
    ],
    rc: [
      ["What is blue-green’s main advantage?", "Near-instant rollback, just repointing traffic to the previous environment, and deploys with no downtime."],
      ["What is the main challenge?", "The shared database and schema, which must be compatible with both versions, plus the cost of running two environments."]
    ]
  }
});

/* R36 */
window.QS.push({
  n: 136, g: "V", alias: 25,
  pt: { s: "Modelos de consistência e CAP", q: "Você pode explicar os modelos de consistência em bancos de dados distribuídos (por exemplo, o teorema CAP)?" },
  en: { s: "Consistency models and CAP", q: "Can you explain the consistency models in distributed databases (e.g., CAP theorem)?" }
});

/* R37 */
window.QS.push({
  n: 137, g: "V", m: "playbook",
  pt: {
    s: "Migrações de esquema em CD",
    q: "Como você gerencia migrações de esquema em um ambiente de entrega contínua?",
    why: "Mudar o esquema sem parar o sistema é um procedimento em fases. O playbook mostra a ordem que permite o deploy e o rollback com o banco compartilhado.",
    one: "Trate as migrações como **código versionado**, aplicadas por uma **ferramenta no pipeline** (Flyway, Liquibase, Prisma Migrate, Alembic), **nunca editadas depois de aplicadas**. Mantenha o esquema **compatível com a versão anterior e a próxima** usando o padrão **expandir → migrar → contrair**, evite bloqueios longos e ensaie contra cópia dos dados.",
    b: [
      { t: "st", ti: "Playbook", i: [
        ["Migrações como código, versionadas", "Arquivos numerados no repositório, revisados em PR junto com o código que dependem delas."],
        ["Automatize no pipeline", "A ferramenta aplica o que falta, em ordem, registra o que foi aplicado (tabela de histórico) e roda igual em todos os ambientes."],
        ["Nunca edite migração já aplicada", "Corrija com uma migração nova (o checksum registrado acusaria a diferença)."],
        ["Expandir, migrar, contrair", "1) **Expandir**: adicione a coluna ou tabela nova (anulável). 2) **Migrar**: o código passa a escrever nos dois e os dados antigos são preenchidos. 3) Troque as leituras. 4) **Contrair**: remova o antigo num deploy posterior."],
        ["Cuidado com bloqueios", "`ALTER TABLE` em tabela grande pode travar: use operações online, `lock_timeout`, índices `CONCURRENTLY` e preenchimento em lotes."],
        ["Teste e ensaie", "Rode contra uma cópia do esquema e dos dados de produção; tenha backup e plano de reversão."],
        ["Separe migrar de deployar", "A migração aditiva vai antes do código novo; a destrutiva só depois que nada mais usa o objeto antigo."]
      ] },
      { t: "cd", ti: "Renomear uma coluna sem derrubar ninguém", l: "sql", c: `-- 1) expandir
ALTER TABLE clientes ADD COLUMN nome_completo text;
-- 2) o codigo novo grava nos dois; preencher o antigo em lotes
UPDATE clientes SET nome_completo = nome
 WHERE id BETWEEN 1 AND 10000 AND nome_completo IS NULL;
-- 3) as leituras passam a usar nome_completo
-- 4) contrair, num deploy posterior
ALTER TABLE clientes DROP COLUMN nome;` }
    ],
    traps: [
      "Renomear ou remover coluna no mesmo deploy do código: a versão antiga quebra.",
      "`ALTER` longo em horário de pico.",
      "Migração manual, fora do versionamento.",
      "Preencher milhões de linhas numa única transação."
    ],
    rc: [
      ["O que é o padrão expandir/contrair?", "Alterar o esquema em fases compatíveis: adicionar o novo, migrar código e dados, e só depois remover o antigo."],
      ["Por que nunca editar uma migração já aplicada?", "Porque os ambientes que já a aplicaram ficam diferentes dos novos, e a ferramenta detecta a divergência pelo checksum."]
    ]
  },
  en: {
    s: "Schema migrations in CD",
    q: "How do you manage schema migrations in a continuous delivery environment?",
    why: "Changing the schema without stopping the system is a phased procedure. The playbook shows the order that allows deploy and rollback with a shared database.",
    one: "Treat migrations as **versioned code**, applied by a **tool in the pipeline** (Flyway, Liquibase, Prisma Migrate, Alembic), **never edited after being applied**. Keep the schema **compatible with the previous and the next version** using the **expand → migrate → contract** pattern, avoid long locks and rehearse against a copy of the data.",
    b: [
      { t: "st", ti: "Playbook", i: [
        ["Migrations as versioned code", "Numbered files in the repository, reviewed in a PR together with the code that depends on them."],
        ["Automate in the pipeline", "The tool applies what is missing, in order, records what was applied (history table) and runs the same in every environment."],
        ["Never edit an applied migration", "Fix it with a new migration (the recorded checksum would flag the difference)."],
        ["Expand, migrate, contract", "1) **Expand**: add the new column or table (nullable). 2) **Migrate**: the code writes to both and old data is backfilled. 3) Switch the reads. 4) **Contract**: remove the old one in a later deploy."],
        ["Watch for locks", "`ALTER TABLE` on a big table can block: use online operations, `lock_timeout`, `CONCURRENTLY` indexes and batched backfills."],
        ["Test and rehearse", "Run against a copy of production schema and data; have a backup and a rollback plan."],
        ["Separate migrating from deploying", "The additive migration goes before the new code; the destructive one only after nothing uses the old object."]
      ] },
      { t: "cd", ti: "Renaming a column without taking anyone down", l: "sql", c: `-- 1) expand
ALTER TABLE customers ADD COLUMN full_name text;
-- 2) new code writes to both; backfill the old one in batches
UPDATE customers SET full_name = name
 WHERE id BETWEEN 1 AND 10000 AND full_name IS NULL;
-- 3) reads switch to full_name
-- 4) contract, in a later deploy
ALTER TABLE customers DROP COLUMN name;` }
    ],
    traps: [
      "Renaming or dropping a column in the same deploy as the code: the old version breaks.",
      "A long `ALTER` at peak time.",
      "A manual migration, outside version control.",
      "Backfilling millions of rows in a single transaction."
    ],
    rc: [
      ["What is the expand/contract pattern?", "Changing the schema in compatible phases: add the new, migrate code and data, and only then remove the old."],
      ["Why never edit an already-applied migration?", "Because environments that applied it become different from new ones, and the tool detects the divergence via the checksum."]
    ]
  }
});

/* R38 */
window.QS.push({
  n: 138, g: "V", alias: 30,
  pt: { s: "Idempotência em APIs REST", q: "Que estratégias existem para tratar idempotência no desenho de APIs REST?" },
  en: { s: "Idempotency in REST APIs", q: "What strategies exist for handling idempotency in REST API design?" }
});

/* R39 */
window.QS.push({
  n: 139, g: "V", m: "trace",
  pt: {
    s: "Single sign-on (SSO)",
    q: "Descreva a implementação de uma solução de single sign-on (SSO).",
    why: "SSO é um fluxo com três atores (usuário, aplicação e provedor de identidade). Seguir o login no primeiro app e o acesso ao segundo mostra de onde vem o “login único”.",
    one: "Escolha um **provedor de identidade (IdP)** (Keycloak, Auth0, Okta, Entra ID), registre cada aplicação nele e integre pelo padrão **OpenID Connect** (ou SAML) com **Authorization Code + PKCE**. O usuário se autentica **uma vez no IdP**; os outros aplicativos redirecionam para ele, que já tem sessão e devolve um código **sem pedir a senha de novo**. As aplicações validam os tokens e continuam decidindo as permissões locais.",
    b: [
      { t: "fl", ti: "Fluxo com OpenID Connect (Authorization Code + PKCE)", n: ["O usuário abre o app A (sem sessão)", "O app A redireciona ao **provedor de identidade** (IdP)", "O usuário faz login no IdP", "O IdP devolve um `code` ao app A", "O app A troca o `code` por `id_token` + `access_token`", "O usuário abre o app B, que redireciona ao IdP: a sessão já existe e o `code` volta **sem pedir senha**"] },
      { t: "tb", ti: "Protocolos", h: ["Protocolo", "Uso típico"], r: [
        ["OIDC (OpenID Connect)", "Padrão atual para apps web e mobile; sobre OAuth 2.0, com tokens JWT"],
        ["SAML 2.0", "Corporativo e legado, B2B; baseado em XML"],
        ["Kerberos / Windows integrado", "Dentro de redes corporativas"]
      ] },
      { t: "st", ti: "Como implementar", i: [
        ["Escolha o IdP", "Keycloak, Auth0, Okta, Microsoft Entra ID, Google ou autogerido."],
        ["Registre cada aplicação", "`client_id`, `redirect_uri` exatas e escopos."],
        ["Use a biblioteca padrão", "Não escreva o protocolo à mão; use PKCE em SPAs e mobile."],
        ["Valide os tokens", "Assinatura (JWKS), `iss`, `aud`, `exp` e `nonce`."],
        ["Logout e sessão", "Logout único (front ou back-channel), expiração e refresh tokens com rotação."],
        ["A autorização continua local", "O IdP diz **quem é** o usuário; o que ele pode fazer dentro do app vem de papéis, claims e regras do próprio app."]
      ] }
    ],
    traps: [
      "`redirect_uri` frouxo (com curingas).",
      "Não validar `aud`, `iss` e `nonce`.",
      "Implementar o protocolo à mão.",
      "Confundir autenticação (SSO) com autorização."
    ],
    rc: [
      ["Que problema o SSO resolve?", "O usuário se autentica uma vez num provedor de identidade e acessa vários aplicativos sem informar a senha de novo; a gestão de credenciais fica centralizada."],
      ["O que o `id_token` do OIDC traz que o OAuth puro não traz?", "A identidade do usuário autenticado (quem é), num JWT assinado."]
    ]
  },
  en: {
    s: "Single sign-on (SSO)",
    q: "Describe the implementation of a single sign-on (SSO) solution.",
    why: "SSO is a flow with three actors (user, application and identity provider). Following the login in the first app and the access to the second shows where the “single login” comes from.",
    one: "Pick an **identity provider (IdP)** (Keycloak, Auth0, Okta, Entra ID), register each application with it and integrate through **OpenID Connect** (or SAML) using **Authorization Code + PKCE**. The user authenticates **once at the IdP**; other apps redirect to it, which already has a session and returns a code **without asking for the password again**. The applications validate the tokens and still decide local permissions.",
    b: [
      { t: "fl", ti: "OpenID Connect flow (Authorization Code + PKCE)", n: ["The user opens app A (no session)", "App A redirects to the **identity provider** (IdP)", "The user logs in at the IdP", "The IdP returns a `code` to app A", "App A exchanges the `code` for an `id_token` + `access_token`", "The user opens app B, which redirects to the IdP: the session already exists and the `code` comes back **without asking for a password**"] },
      { t: "tb", ti: "Protocols", h: ["Protocol", "Typical use"], r: [
        ["OIDC (OpenID Connect)", "Current standard for web and mobile apps; on top of OAuth 2.0, with JWT tokens"],
        ["SAML 2.0", "Corporate and legacy, B2B; XML-based"],
        ["Kerberos / Windows integrated", "Inside corporate networks"]
      ] },
      { t: "st", ti: "How to implement", i: [
        ["Pick the IdP", "Keycloak, Auth0, Okta, Microsoft Entra ID, Google or self-hosted."],
        ["Register each application", "`client_id`, exact `redirect_uri`s and scopes."],
        ["Use the standard library", "Do not hand-write the protocol; use PKCE for SPAs and mobile."],
        ["Validate the tokens", "Signature (JWKS), `iss`, `aud`, `exp` and `nonce`."],
        ["Logout and session", "Single logout (front or back channel), expiry and refresh tokens with rotation."],
        ["Authorization stays local", "The IdP says **who** the user is; what they may do inside the app comes from the app’s own roles, claims and rules."]
      ] }
    ],
    traps: [
      "A loose `redirect_uri` (with wildcards).",
      "Not validating `aud`, `iss` and `nonce`.",
      "Hand-writing the protocol.",
      "Confusing authentication (SSO) with authorization."
    ],
    rc: [
      ["What problem does SSO solve?", "The user authenticates once with an identity provider and accesses several apps without entering the password again; credential management is centralized."],
      ["What does the OIDC `id_token` carry that plain OAuth does not?", "The identity of the authenticated user (who they are), in a signed JWT."]
    ]
  }
});

/* R40 */
window.QS.push({
  n: 140, g: "V", m: "design",
  pt: {
    s: "Fluxos de dados de IoT",
    q: "Explique como você desenvolveria um sistema backend para tratar fluxos de dados de dispositivos IoT.",
    why: "Um sistema de IoT é um produto completo (ingestão, processamento, armazenamento, consulta). O roteiro de system design cobre cada camada na ordem e evita esquecer números e gargalos.",
    one: "A arquitetura típica: dispositivos publicam por **MQTT** num broker/gateway IoT, um **log durável (Kafka/Kinesis)** absorve os picos, um **processador de fluxo (Flink/Spark Streaming)** valida, agrega e detecta anomalias, e os dados vão para um **banco de séries temporais** (consultas recentes) e um **data lake** (histórico barato). Cuide de **autenticação por dispositivo**, mensagens **duplicadas e fora de ordem**, dispositivos **offline** e atualização remota (OTA).",
    b: [
      { t: "fl", ti: "Arquitetura", n: ["Dispositivos", "Broker MQTT / gateway IoT", "Kafka (buffer durável)", "Processamento em fluxo", "Série temporal (quente) + data lake (frio)", "API, dashboards e alertas"] },
      { t: "st", ti: "O roteiro aplicado", i: [
        ["1. Requisitos", "Quantos dispositivos e mensagens por segundo? Tamanho, latência (alertas em tempo real?), retenção, conectividade instável, comandos de volta ao dispositivo?"],
        ["2. Estimativas", "Exemplo: 1 milhão de dispositivos × 1 mensagem a cada 10 s = 100 mil mensagens/s; 200 B cada ≈ 20 MB/s ≈ 1,7 TB/dia. Isso dimensiona ingestão e armazenamento."],
        ["3. Ingestão", "Protocolo leve: **MQTT** (publish/subscribe, níveis de QoS) ou CoAP; broker/gateway IoT (AWS IoT Core, EMQX, Azure IoT Hub); autenticação por dispositivo (certificados)."],
        ["4. Buffer durável", "Um log distribuído (**Kafka**, Kinesis, Pub/Sub) absorve picos e desacopla quem produz de quem processa."],
        ["5. Processamento", "Em fluxo (Flink, Spark Streaming, Kafka Streams): validar, enriquecer, agregar por janela, detectar anomalias e disparar alertas."],
        ["6. Armazenamento", "**Quente**: banco de séries temporais (InfluxDB, TimescaleDB) para consultas recentes. **Frio**: data lake barato (S3/Parquet) para histórico e analytics, com redução de resolução por idade."],
        ["7. Consulta e ação", "API e dashboards; comandos de volta ao dispositivo por tópicos."],
        ["8. Gargalos e robustez", "Reconexões em massa, mensagens duplicadas ou fora de ordem (timestamp do dispositivo + idempotência), dispositivos offline com buffer local, segurança e atualização remota (OTA)."]
      ] }
    ],
    traps: [
      "HTTP pesado em dispositivos com bateria e rede ruins.",
      "Sem buffer entre a ingestão e o processamento: o pico derruba tudo.",
      "Usar o relógio do dispositivo como verdade, sem tratar atraso e desvio.",
      "Guardar tudo em alta resolução para sempre (custo)."
    ],
    rc: [
      ["Por que usar MQTT em vez de HTTP em IoT?", "É leve, mantém a conexão, usa publish/subscribe e tem níveis de QoS, adequado a dispositivos com pouca banda e energia."],
      ["Por que separar armazenamento quente e frio?", "Consultas recentes precisam de um banco rápido (série temporal); o histórico fica em armazenamento barato, com resolução reduzida."]
    ]
  },
  en: {
    s: "IoT data streams",
    q: "Explain how you would develop a backend system for handling IoT device data streams.",
    why: "An IoT system is a whole product (ingestion, processing, storage, querying). The system-design script covers each layer in order and avoids forgetting numbers and bottlenecks.",
    one: "The typical architecture: devices publish over **MQTT** to an IoT broker/gateway, a **durable log (Kafka/Kinesis)** absorbs the spikes, a **stream processor (Flink/Spark Streaming)** validates, aggregates and detects anomalies, and data goes to a **time-series database** (recent queries) and a **data lake** (cheap history). Take care of **per-device authentication**, **duplicate and out-of-order** messages, **offline** devices and remote updates (OTA).",
    b: [
      { t: "fl", ti: "Architecture", n: ["Devices", "MQTT broker / IoT gateway", "Kafka (durable buffer)", "Stream processing", "Time series (hot) + data lake (cold)", "API, dashboards and alerts"] },
      { t: "st", ti: "The script applied", i: [
        ["1. Requirements", "How many devices and messages per second? Size, latency (real-time alerts?), retention, unstable connectivity, commands back to the device?"],
        ["2. Estimates", "Example: 1 million devices × 1 message every 10 s = 100 thousand messages/s; 200 B each ≈ 20 MB/s ≈ 1.7 TB/day. This sizes ingestion and storage."],
        ["3. Ingestion", "A light protocol: **MQTT** (publish/subscribe, QoS levels) or CoAP; an IoT broker/gateway (AWS IoT Core, EMQX, Azure IoT Hub); per-device authentication (certificates)."],
        ["4. Durable buffer", "A distributed log (**Kafka**, Kinesis, Pub/Sub) absorbs spikes and decouples producers from processors."],
        ["5. Processing", "Streaming (Flink, Spark Streaming, Kafka Streams): validate, enrich, aggregate by window, detect anomalies and fire alerts."],
        ["6. Storage", "**Hot**: a time-series database (InfluxDB, TimescaleDB) for recent queries. **Cold**: a cheap data lake (S3/Parquet) for history and analytics, with downsampling by age."],
        ["7. Query and action", "API and dashboards; commands back to the device through topics."],
        ["8. Bottlenecks and robustness", "Mass reconnections, duplicate or out-of-order messages (device timestamp + idempotency), offline devices with local buffering, security and remote updates (OTA)."]
      ] }
    ],
    traps: [
      "Heavy HTTP on battery-powered devices with poor networks.",
      "No buffer between ingestion and processing: the spike takes everything down.",
      "Using the device clock as truth without handling delay and drift.",
      "Keeping everything at high resolution forever (cost)."
    ],
    rc: [
      ["Why use MQTT instead of HTTP in IoT?", "It is light, keeps the connection, uses publish/subscribe and has QoS levels, suited to devices with little bandwidth and power."],
      ["Why separate hot and cold storage?", "Recent queries need a fast database (time series); history sits in cheap storage, at reduced resolution."]
    ]
  }
});

/* R41 */
window.QS.push({
  n: 141, g: "V", m: "firstprinciples",
  pt: {
    s: "Sincronização em tempo real",
    q: "Como você arquitetaria um backend para suportar sincronização de dados em tempo real entre dispositivos?",
    why: "Sincronização em tempo real é uma sequência de problemas encadeados (latência, escala, offline, conflito). Construir do zero mostra qual tecnologia resolve cada um.",
    one: "Troque o **polling** por um canal **bidirecional (WebSocket)** ou de empurrar (SSE), propague as mudanças entre servidores com **pub/sub** (Redis, Kafka, NATS), dê a cada alteração uma **versão** para **ressincronizar** quem reconecta, e resolva os **conflitos de edição simultânea** com **last-write-wins**, **OT** (Operational Transformation) ou **CRDTs**.",
    b: [
      { t: "st", ti: "Construindo, uma restrição por vez", i: [
        ["0. O problema", "Vários dispositivos veem e alteram os mesmos dados, e cada um deve refletir a mudança dos outros quase na hora."],
        ["1. Polling", "Cada cliente pergunta a cada N segundos. Simples, mas atrasa e desperdiça requisições."],
        ["2. Canal bidirecional", "**WebSocket** (ou SSE, só servidor → cliente) mantém uma conexão aberta e o servidor empurra as mudanças."],
        ["3. Distribuir entre servidores", "Com muitos servidores, quem recebe a mudança nem sempre é quem tem o outro cliente conectado: um **pub/sub** (Redis, Kafka, NATS) propaga o evento a todos."],
        ["4. Offline e reconexão", "Cada alteração tem ID e versão; ao reconectar, o cliente pede “o que mudou desde a versão X” (log de mudanças com número de sequência)."],
        ["5. Conflitos", "Dois dispositivos editam o mesmo dado: *last write wins* (simples, mas perde dados), **Operational Transformation** (edição colaborativa de texto), **CRDTs** (estruturas que convergem sem coordenação) ou resolução manual."],
        ["6. Escala e confiabilidade", "Particionar as conexões, heartbeats, backpressure, entrega ao menos uma vez com deduplicação por ID e ordenação por sequência."]
      ] },
      { t: "tb", ti: "Escolha do canal", h: ["Opção", "Direção", "Quando"], r: [
        ["Polling", "Cliente → servidor", "Pouca frequência; simplicidade"],
        ["Long polling", "Cliente → servidor (espera)", "Compatibilidade, sem WebSocket"],
        ["SSE", "Servidor → cliente", "Feeds, notificações, painéis"],
        ["WebSocket", "Bidirecional", "Chat, edição colaborativa, jogos"]
      ] }
    ],
    traps: [
      "Last-write-wins em dados que não podem perder alterações.",
      "Sem reconexão e ressincronização: o cliente fica defasado.",
      "Estado de conexões preso a um servidor, sem pub/sub.",
      "Achar que o WebSocket resolve conflito: ele só transporta."
    ],
    rc: [
      ["Por que um pub/sub é necessário ao escalar WebSockets?", "Porque clientes conectados a servidores diferentes precisam receber as mesmas mudanças; o pub/sub propaga o evento entre os servidores."],
      ["O que é um CRDT?", "Uma estrutura de dados replicada que garante a convergência dos estados em todas as réplicas, sem coordenação central, mesmo com edições concorrentes."]
    ]
  },
  en: {
    s: "Real-time synchronization",
    q: "How would you architect a backend to support real-time data synchronization across devices?",
    why: "Real-time sync is a chain of linked problems (latency, scale, offline, conflict). Building from scratch shows which technology solves each one.",
    one: "Replace **polling** with a **bidirectional (WebSocket)** or push (SSE) channel, propagate changes between servers with **pub/sub** (Redis, Kafka, NATS), give each change a **version** to **resync** whoever reconnects, and resolve **simultaneous-edit conflicts** with **last-write-wins**, **OT** (Operational Transformation) or **CRDTs**.",
    b: [
      { t: "st", ti: "Building up, one constraint at a time", i: [
        ["0. The problem", "Several devices see and change the same data, and each must reflect the others’ changes almost instantly."],
        ["1. Polling", "Each client asks every N seconds. Simple, but delayed and wasteful."],
        ["2. Bidirectional channel", "**WebSocket** (or SSE, server → client only) keeps a connection open and the server pushes the changes."],
        ["3. Distribute across servers", "With many servers, the one receiving the change is not always the one holding the other client’s connection: a **pub/sub** (Redis, Kafka, NATS) propagates the event to all."],
        ["4. Offline and reconnection", "Each change has an ID and version; on reconnect the client asks “what changed since version X” (a change log with a sequence number)."],
        ["5. Conflicts", "Two devices edit the same data: *last write wins* (simple, but loses data), **Operational Transformation** (collaborative text editing), **CRDTs** (structures that converge without coordination) or manual resolution."],
        ["6. Scale and reliability", "Partition connections, heartbeats, backpressure, at-least-once delivery with ID deduplication and ordering by sequence."]
      ] },
      { t: "tb", ti: "Choosing the channel", h: ["Option", "Direction", "When"], r: [
        ["Polling", "Client → server", "Low frequency; simplicity"],
        ["Long polling", "Client → server (waiting)", "Compatibility, no WebSocket"],
        ["SSE", "Server → client", "Feeds, notifications, dashboards"],
        ["WebSocket", "Bidirectional", "Chat, collaborative editing, games"]
      ] }
    ],
    traps: [
      "Last-write-wins on data that cannot lose changes.",
      "No reconnection and resync: the client falls behind.",
      "Connection state tied to one server, with no pub/sub.",
      "Believing WebSocket solves conflicts: it only transports."
    ],
    rc: [
      ["Why is a pub/sub needed when scaling WebSockets?", "Because clients connected to different servers must receive the same changes; the pub/sub propagates the event across servers."],
      ["What is a CRDT?", "A replicated data structure that guarantees states converge on all replicas, without central coordination, even with concurrent edits."]
    ]
  }
});

/* R42 */
window.QS.push({
  n: 142, g: "V", alias: 1,
  pt: { s: "Prós e contras dos microsserviços", q: "Discuta os benefícios e as desvantagens de arquiteturas de microsserviços em sistemas backend." },
  en: { s: "Pros and cons of microservices", q: "Discuss the benefits and drawbacks of microservice architectures in backend systems." }
});

/* R43 */
window.QS.push({
  n: 143, g: "V", m: "playbook",
  pt: {
    s: "Teste de carga de uma API",
    q: "Como você abordaria o teste de carga de uma API de backend?",
    why: "Teste de carga é um procedimento repetível: definir metas, montar o ambiente, rodar, observar, corrigir e repetir. O playbook mostra a ordem e as armadilhas de cada passo.",
    one: "Defina **metas** (RPS, latência p95/p99, taxa de erro), monte um **ambiente parecido com produção** com dados realistas, **modele o tráfego real** com uma ferramenta (k6, JMeter, Locust, Gatling), rode os tipos de teste (**carga, estresse, pico, resistência**), **aumente a carga gradualmente** observando app e infraestrutura, **corrija o gargalo** e **repita**, de preferência automatizado no CI.",
    b: [
      { t: "st", ti: "Playbook", i: [
        ["Defina objetivos e metas", "Que carga (usuários ou RPS), que latência (p95/p99) e que taxa de erro são aceitáveis (SLO)? Quais fluxos importam?"],
        ["Monte um ambiente parecido com produção", "Mesma configuração, dados com volume realista, dependências isoladas ou simuladas. Nunca contra produção sem planejamento."],
        ["Modele o tráfego real", "Mistura de endpoints, dados variados, tempo de “pensamento” do usuário e picos. Ferramentas: k6, JMeter, Locust, Gatling, LoadRunner."],
        ["Rode vários tipos de teste", "**Carga** (a esperada), **estresse** (além do limite, para achar o ponto de quebra), **pico** (subida súbita) e **resistência/soak** (horas, para achar vazamentos)."],
        ["Aumente gradualmente e observe", "Métricas da aplicação (latência, erros, vazão) e do sistema (CPU, memória, I/O, conexões de banco, GC, filas)."],
        ["Ache o gargalo e corrija", "Um fator por vez (índice, cache, pool, código); repita o teste."],
        ["Automatize e registre", "Teste de regressão de desempenho no CI ou antes de releases, guardando os resultados para comparar."]
      ] },
      { t: "cd", l: "javascript (k6)", c: `import http from "k6/http";
import { check } from "k6";

export const options = {
  stages: [
    { duration: "2m", target: 200 },   // sobe ate 200 usuarios virtuais
    { duration: "5m", target: 200 },   // mantem
    { duration: "1m", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],     // menos de 1% de erros
    http_req_duration: ["p(95)<300"],   // p95 abaixo de 300 ms
  },
};

export default function () {
  const r = http.get("https://staging.exemplo.com/api/pedidos");
  check(r, { "status 200": (x) => x.status === 200 });
}` }
    ],
    traps: [
      "Testar com o banco vazio.",
      "Olhar só a média: o p99 mostra a experiência dos piores casos.",
      "Gerador de carga que satura antes do sistema (o cliente é o gargalo).",
      "Testar uma vez só, no fim do projeto."
    ],
    rc: [
      ["Qual a diferença entre teste de carga e teste de estresse?", "Carga valida o comportamento na demanda esperada; estresse vai além do limite para descobrir o ponto de quebra e como o sistema falha."],
      ["Por que olhar percentis (p95/p99) e não só a média?", "A média esconde os casos lentos; os percentis mostram o que os usuários mais afetados sentem."]
    ]
  },
  en: {
    s: "Load testing an API",
    q: "How would you approach load testing a backend API?",
    why: "Load testing is a repeatable procedure: set goals, build the environment, run, observe, fix and repeat. The playbook shows the order and the traps of each step.",
    one: "Define **goals** (RPS, p95/p99 latency, error rate), build a **production-like environment** with realistic data, **model real traffic** with a tool (k6, JMeter, Locust, Gatling), run the test types (**load, stress, spike, soak**), **raise the load gradually** while watching app and infrastructure, **fix the bottleneck** and **repeat**, preferably automated in CI.",
    b: [
      { t: "st", ti: "Playbook", i: [
        ["Set objectives and goals", "What load (users or RPS), what latency (p95/p99) and what error rate are acceptable (SLO)? Which flows matter?"],
        ["Build a production-like environment", "Same configuration, realistic data volume, dependencies isolated or simulated. Never against production without planning."],
        ["Model real traffic", "A mix of endpoints, varied data, user “think time” and spikes. Tools: k6, JMeter, Locust, Gatling, LoadRunner."],
        ["Run several test types", "**Load** (the expected one), **stress** (beyond the limit, to find the breaking point), **spike** (sudden rise) and **soak** (hours, to find leaks)."],
        ["Increase gradually and observe", "Application metrics (latency, errors, throughput) and system metrics (CPU, memory, I/O, database connections, GC, queues)."],
        ["Find the bottleneck and fix it", "One factor at a time (index, cache, pool, code); repeat the test."],
        ["Automate and record", "A performance-regression test in CI or before releases, keeping results to compare."]
      ] },
      { t: "cd", l: "javascript (k6)", c: `import http from "k6/http";
import { check } from "k6";

export const options = {
  stages: [
    { duration: "2m", target: 200 },   // ramp up to 200 virtual users
    { duration: "5m", target: 200 },   // hold
    { duration: "1m", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],     // under 1% errors
    http_req_duration: ["p(95)<300"],   // p95 under 300 ms
  },
};

export default function () {
  const r = http.get("https://staging.example.com/api/orders");
  check(r, { "status 200": (x) => x.status === 200 });
}` }
    ],
    traps: [
      "Testing with an empty database.",
      "Looking only at the average: p99 shows the worst-case experience.",
      "A load generator that saturates before the system (the client is the bottleneck).",
      "Testing once, at the end of the project.",
    ],
    rc: [
      ["What is the difference between a load test and a stress test?", "Load validates behavior at expected demand; stress goes beyond the limit to find the breaking point and how the system fails."],
      ["Why look at percentiles (p95/p99) and not only the average?", "The average hides the slow cases; percentiles show what the most affected users feel."]
    ]
  }
});

/* R44 */
window.QS.push({
  n: 144, g: "V", m: "compare",
  pt: {
    s: "Evicção de cache no servidor",
    q: "Descreva como você implementaria uma estratégia de evicção de cache no servidor.",
    why: "A evicção é uma escolha entre políticas com pontos fortes e fracos. A matriz mostra qual política serve a qual padrão de acesso, e os passos mostram como defini-la.",
    one: "Defina o **teto de memória** que dispara a remoção, escolha uma **política** pelo padrão de acesso (**LRU** como padrão, **LFU** para itens consistentemente populares, **TTL** para validade natural, FIFO ou aleatória em casos simples), combine com **invalidação** (que cuida de dado desatualizado, não de espaço) e **monitore** hit ratio e taxa de evicção.",
    b: [
      { t: "tb", h: ["Política", "Remove", "Bom para", "Ponto fraco"], r: [
        ["LRU", "O menos usado recentemente", "Uso geral, localidade temporal", "Uma varredura grande “polui” o cache"],
        ["LFU", "O menos usado em frequência", "Itens populares estáveis", "Um item antigo popular nunca sai; custo dos contadores"],
        ["FIFO", "O que entrou primeiro", "Simplicidade", "Ignora o uso: pode expulsar o item mais quente"],
        ["Aleatória", "Um item aleatório", "Custo muito baixo", "Sem inteligência"],
        ["TTL", "O que expirou", "Dados com validade natural", "Não limita a memória sozinho"]
      ] },
      { t: "st", ti: "Como definir a estratégia", i: [
        ["Limite de tamanho", "Defina o teto (memória ou número de itens) que dispara a remoção (`maxmemory` no Redis)."],
        ["Escolha a política pelo padrão de acesso", "LRU como padrão; LFU quando há itens muito populares; TTL para validade; combine (`allkeys-lru` + TTL)."],
        ["Invalidação", "A evicção cuida de espaço; a **invalidação** cuida de dado desatualizado (por evento ou TTL)."],
        ["Monitore", "Hit ratio, taxa de evicção, memória e latência; ajuste quando o hit ratio cair."]
      ] },
      { t: "cd", l: "redis.conf", c: `maxmemory 2gb
maxmemory-policy allkeys-lru` }
    ],
    traps: [
      "Confundir evicção (liberar espaço) com invalidação (remover dado velho).",
      "Sem limite de memória: o cache cresce até derrubar o servidor.",
      "LRU com varreduras em lote que expulsam os itens quentes.",
      "Não monitorar a taxa de evicção."
    ],
    rc: [
      ["Qual a diferença entre evicção e invalidação?", "Evicção remove itens por falta de espaço; invalidação remove ou atualiza itens porque o dado de origem mudou."],
      ["Quando LFU é melhor que LRU?", "Quando há itens consistentemente populares que não devem sair só porque ficaram um tempo sem acesso."]
    ]
  },
  en: {
    s: "Server-side cache eviction",
    q: "Describe how you would implement a server-side cache eviction strategy.",
    why: "Eviction is a choice between policies with strengths and weaknesses. The matrix shows which policy fits which access pattern, and the steps show how to define it.",
    one: "Define the **memory ceiling** that triggers removal, choose a **policy** by access pattern (**LRU** as the default, **LFU** for consistently popular items, **TTL** for natural validity, FIFO or random in simple cases), combine it with **invalidation** (which handles stale data, not space) and **monitor** hit ratio and eviction rate.",
    b: [
      { t: "tb", h: ["Policy", "Removes", "Good for", "Weak point"], r: [
        ["LRU", "The least recently used", "General use, temporal locality", "A big scan “pollutes” the cache"],
        ["LFU", "The least frequently used", "Stable popular items", "An old popular item never leaves; counter cost"],
        ["FIFO", "The first one in", "Simplicity", "Ignores usage: may evict the hottest item"],
        ["Random", "A random item", "Very low cost", "No intelligence"],
        ["TTL", "What has expired", "Data with natural validity", "Does not bound memory on its own"]
      ] },
      { t: "st", ti: "How to define the strategy", i: [
        ["Size limit", "Define the ceiling (memory or item count) that triggers removal (`maxmemory` in Redis)."],
        ["Pick the policy by access pattern", "LRU as the default; LFU when there are very popular items; TTL for validity; combine (`allkeys-lru` + TTL)."],
        ["Invalidation", "Eviction handles space; **invalidation** handles stale data (by event or TTL)."],
        ["Monitor", "Hit ratio, eviction rate, memory and latency; adjust when the hit ratio drops."]
      ] },
      { t: "cd", l: "redis.conf", c: `maxmemory 2gb
maxmemory-policy allkeys-lru` }
    ],
    traps: [
      "Confusing eviction (freeing space) with invalidation (removing stale data).",
      "No memory limit: the cache grows until it takes the server down.",
      "LRU with batch scans that evict the hot items.",
      "Not monitoring the eviction rate."
    ],
    rc: [
      ["What is the difference between eviction and invalidation?", "Eviction removes items for lack of space; invalidation removes or updates items because the source data changed."],
      ["When is LFU better than LRU?", "When there are consistently popular items that should not leave just because they went a while without access."]
    ]
  }
});

/* R45 */
window.QS.push({
  n: 145, g: "V", m: "feynman",
  pt: {
    s: "Correlation IDs",
    q: "O que são correlation IDs e como podem ser usados para rastrear requisições entre serviços?",
    why: "O código de rastreio de uma encomenda é a analogia exata. Ela dá a ideia, e o ponto em que quebra (todo mundo precisa repassar a etiqueta) é o que a prática exige.",
    one: "Um **correlation ID** (ou request/trace ID) é um identificador único **gerado na entrada** do sistema e **repassado em todas as chamadas seguintes** (cabeçalho `X-Request-Id` ou o `traceparent` do W3C Trace Context), em mensagens de fila e **em todos os logs**. Procurando o ID nos logs, você reconstrói o caminho completo de uma requisição entre serviços; no tracing, ele liga os spans.",
    b: [
      { t: "an",
        s: "O código de rastreio de uma encomenda: a mesma etiqueta acompanha o pacote pelo centro de distribuição, pela transportadora e pela entrega. Com ela, você reconstrói o caminho todo.",
        k: "Gerado no gateway (ou no primeiro serviço), o ID viaja em cabeçalhos HTTP, atributos de mensagem e no contexto da thread, e entra em **todo log** como campo fixo. Pesquisando o ID no sistema de logs, você vê o que cada serviço fez por aquela requisição; no tracing distribuído (OpenTelemetry), o mesmo ID liga os spans e mostra onde o tempo foi gasto.",
        b: "A etiqueta só ajuda se **todos** a carregarem. Um serviço que não repassa o ID quebra a trilha ali. E o ID da requisição não é o ID do usuário." },
      { t: "cd", l: "http + logs", c: `GET /pedidos/42            X-Request-Id: 9f3c1a      (gerado no gateway)
  -> servico pedidos  log: {"trace_id":"9f3c1a","msg":"buscando pedido"}
  -> servico estoque  log: {"trace_id":"9f3c1a","msg":"consulta saldo"}   (mesmo ID, repassado)` },
      { t: "st", ti: "Como implementar", i: [
        ["Gerar na borda", "Se a requisição já traz um ID válido, reutilize; senão, crie (UUID ou ID de trace)."],
        ["Propagar", "Cabeçalho nas chamadas HTTP, atributo nas mensagens de fila e contexto da thread ou do async local no código."],
        ["Registrar em todos os logs", "Via middleware ou logger de contexto, como campo fixo."],
        ["Devolver ao cliente", "Como cabeçalho de resposta, para o suporte pedir “me passe o ID”."]
      ] }
    ],
    traps: [
      "Gerar um ID diferente em cada serviço: não correlaciona nada.",
      "Esquecer filas e tarefas assíncronas.",
      "Logs sem o campo do ID.",
      "Confiar sem validar no ID enviado por clientes externos."
    ],
    rc: [
      ["Para que serve um correlation ID?", "Para acompanhar uma requisição por todos os serviços e logs, facilitando depurar e achar gargalos."],
      ["Onde ele deve ser gerado e como se propaga?", "Na entrada do sistema (gateway), repassado por cabeçalhos, mensagens e contexto, e gravado em todos os logs."]
    ]
  },
  en: {
    s: "Correlation IDs",
    q: "What are correlation IDs, and how can they be used for tracing requests across services?",
    why: "A parcel tracking code is the exact analogy. It gives the idea, and the point where it breaks (everyone must pass the label along) is what practice demands.",
    one: "A **correlation ID** (or request/trace ID) is a unique identifier **generated at the system’s entry** and **passed on in every following call** (the `X-Request-Id` header or the W3C Trace Context `traceparent`), in queue messages and **in every log**. Searching the ID in the logs, you rebuild a request’s whole path across services; in tracing, it links the spans.",
    b: [
      { t: "an",
        s: "A parcel tracking code: the same label follows the package through the distribution center, the carrier and the delivery. With it, you rebuild the whole path.",
        k: "Generated at the gateway (or the first service), the ID travels in HTTP headers, message attributes and thread context, and goes into **every log** as a fixed field. Searching the ID in the log system, you see what each service did for that request; in distributed tracing (OpenTelemetry), the same ID links the spans and shows where time was spent.",
        b: "The label only helps if **everyone** carries it. A service that does not pass the ID on breaks the trail there. And the request ID is not the user ID." },
      { t: "cd", l: "http + logs", c: `GET /orders/42             X-Request-Id: 9f3c1a      (generated at the gateway)
  -> orders service     log: {"trace_id":"9f3c1a","msg":"fetching order"}
  -> inventory service  log: {"trace_id":"9f3c1a","msg":"checking stock"}   (same ID, passed on)` },
      { t: "st", ti: "How to implement", i: [
        ["Generate at the edge", "If the request already carries a valid ID, reuse it; otherwise create one (UUID or trace ID)."],
        ["Propagate", "A header on HTTP calls, an attribute on queue messages and thread or async-local context in code."],
        ["Record in every log", "Via middleware or a context logger, as a fixed field."],
        ["Return to the client", "As a response header, so support can ask “send me the ID”."]
      ] }
    ],
    traps: [
      "Generating a different ID in each service: nothing correlates.",
      "Forgetting queues and asynchronous tasks.",
      "Logs without the ID field.",
      "Trusting the ID sent by external clients without validating it."
    ],
    rc: [
      ["What is a correlation ID for?", "To follow a request across all services and logs, making it easier to debug and find bottlenecks."],
      ["Where should it be generated and how does it propagate?", "At the system’s entry (gateway), passed along through headers, messages and context, and written to every log."]
    ]
  }
});

/* R46 */
window.QS.push({
  n: 146, g: "V", m: "compare",
  pt: {
    s: "Lock otimista vs pessimista",
    q: "Explique a diferença entre lock otimista e pessimista e quando usar cada um.",
    why: "É uma comparação direta entre duas estratégias de concorrência. A matriz mostra a premissa, o mecanismo e o custo de cada uma, e uma regra diz quando escolher.",
    one: "**Otimista**: assume que conflitos são raros, deixa todos lerem e, ao gravar, **confere se a versão mudou** (se mudou, falha e tenta de novo). **Pessimista**: assume que conflitos são comuns e **trava o registro** (`SELECT … FOR UPDATE`) até o commit. Use otimista quando há **muita leitura e pouca disputa**; pessimista quando há **muita disputa** ou o conflito é caro demais para retentar.",
    b: [
      { t: "tb", h: ["", "Otimista", "Pessimista"], r: [
        ["Premissa", "Conflitos são raros", "Conflitos são comuns"],
        ["Como", "Lê com uma **versão**; ao gravar, verifica se a versão mudou (`WHERE id=? AND versao=?`); se mudou, falha e tenta de novo", "Trava o registro antes de alterar (`SELECT … FOR UPDATE`) e segura até o commit"],
        ["Concorrência", "Alta: ninguém espera", "Baixa: os outros esperam"],
        ["Custo", "Um conflito vira retrabalho ou retentativa", "Esperas, risco de deadlock, locks longos"],
        ["Bom para", "Muita leitura e poucas escritas concorrentes (cadastros, edição de formulário)", "Muita disputa pelo mesmo dado, operações críticas (saldo, estoque, reserva)"]
      ] },
      { t: "cd", l: "sql", c: `-- Otimista: so grava se ninguem mudou antes
UPDATE produtos SET preco = 99, versao = versao + 1
 WHERE id = 7 AND versao = 3;      -- 0 linhas afetadas = conflito: recarregue e tente de novo

-- Pessimista: trava a linha ate o commit
BEGIN;
SELECT saldo FROM contas WHERE id = 1 FOR UPDATE;
UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
COMMIT;` },
      { t: "tp", k: "key", h: "Regra", x: "Comece com o **otimista** (escala melhor) e use o **pessimista** onde a disputa é frequente ou retentar é caro. Um update atômico (`saldo = saldo - 100`) muitas vezes dispensa os dois. Veja também a Q09 sobre deadlocks." }
    ],
    traps: [
      "Otimista sem tratar o conflito: a última escrita sobrescreve a anterior.",
      "Pessimista com transações longas: esperas e deadlocks.",
      "Segurar o lock enquanto espera o usuário.",
      "Lock pessimista sem timeout."
    ],
    rc: [
      ["Como o lock otimista detecta conflito?", "Comparando a versão (ou timestamp) lida com a atual no momento da gravação; se mudou, recusa e o cliente repete."],
      ["Quando preferir o lock pessimista?", "Quando há muita disputa pelo mesmo registro ou quando retentar é caro ou inaceitável (saldos, reservas)."]
    ]
  },
  en: {
    s: "Optimistic vs pessimistic locking",
    q: "Explain the difference between optimistic and pessimistic locking and when to use each.",
    why: "It is a direct comparison of two concurrency strategies. The matrix shows each one’s premise, mechanism and cost, and a rule says when to choose.",
    one: "**Optimistic**: assumes conflicts are rare, lets everyone read and, on write, **checks whether the version changed** (if so, it fails and retries). **Pessimistic**: assumes conflicts are common and **locks the record** (`SELECT … FOR UPDATE`) until commit. Use optimistic for **heavy reads with little contention**; pessimistic when there is **heavy contention** or the conflict is too costly to retry.",
    b: [
      { t: "tb", h: ["", "Optimistic", "Pessimistic"], r: [
        ["Premise", "Conflicts are rare", "Conflicts are common"],
        ["How", "Reads with a **version**; on write, checks whether the version changed (`WHERE id=? AND version=?`); if so, fails and retries", "Locks the record before changing it (`SELECT … FOR UPDATE`) and holds until commit"],
        ["Concurrency", "High: nobody waits", "Low: others wait"],
        ["Cost", "A conflict becomes rework or a retry", "Waits, deadlock risk, long locks"],
        ["Good for", "Heavy reads and few concurrent writes (records, form editing)", "Heavy contention on the same data, critical operations (balance, stock, reservation)"]
      ] },
      { t: "cd", l: "sql", c: `-- Optimistic: only writes if nobody changed it before
UPDATE products SET price = 99, version = version + 1
 WHERE id = 7 AND version = 3;     -- 0 rows affected = conflict: reload and retry

-- Pessimistic: lock the row until commit
BEGIN;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;` },
      { t: "tp", k: "key", h: "Rule", x: "Start with **optimistic** (scales better) and use **pessimistic** where contention is frequent or retrying is expensive. An atomic update (`balance = balance - 100`) often removes the need for either. See also Q09 on deadlocks." }
    ],
    traps: [
      "Optimistic without handling the conflict: the last write overwrites the previous one.",
      "Pessimistic with long transactions: waits and deadlocks.",
      "Holding the lock while waiting for the user.",
      "A pessimistic lock without a timeout."
    ],
    rc: [
      ["How does optimistic locking detect a conflict?", "By comparing the version (or timestamp) read with the current one at write time; if it changed, it refuses and the client retries."],
      ["When prefer pessimistic locking?", "When there is heavy contention on the same record or when retrying is costly or unacceptable (balances, reservations)."]
    ]
  }
});

/* R47 */
window.QS.push({
  n: 147, g: "V", alias: 9,
  pt: { s: "Prevenir deadlocks em transações", q: "Que métodos você usaria para prevenir deadlocks em transações de banco de dados?" },
  en: { s: "Preventing deadlocks in transactions", q: "What methods would you use to prevent deadlocks in database transactions?" }
});

/* R48 */
window.QS.push({
  n: 148, g: "V", m: "threat",
  pt: {
    s: "Segurança entre microsserviços",
    q: "Como você protegeria a comunicação entre serviços em uma arquitetura de microsserviços?",
    why: "Cada medida de segurança entre serviços responde a uma ameaça específica. O formato ameaça → defesa evita a lista decorada e mostra o que cada controle impede.",
    one: "Parta do princípio de que **a rede interna não é confiável** (zero trust): **TLS/mTLS** em todo tráfego interno, **identidade por serviço** (certificados de curta duração, SPIFFE/SPIRE), **autorização serviço a serviço** com privilégio mínimo, **segmentação de rede** com um **API gateway** como única entrada, **segredos em cofre** com rotação e **logs e tracing** para visibilidade.",
    b: [
      { t: "pr", a: "Ameaça", b: "Defesa", r: [
        ["Interceptação ou adulteração entre serviços (man-in-the-middle)", "**TLS** em todo tráfego interno e **mTLS**, para os dois lados provarem a identidade (um service mesh como Istio ou Linkerd automatiza isso)."],
        ["Um serviço falso se passando por outro", "Identidade de carga de trabalho (certificados de curta duração, SPIFFE/SPIRE) e validação do chamador."],
        ["Chamadas não autorizadas (um serviço comprometido alcança tudo)", "**Autorização** serviço a serviço (políticas), tokens com escopo mínimo (OAuth client credentials, JWT de serviço) e **privilégio mínimo**."],
        ["Tráfego público alcançando serviços internos", "Rede privada, **segmentação** (VPC, sub-redes, NetworkPolicies) e API gateway como única entrada."],
        ["Segredos de serviço expostos", "Cofre de segredos, rotação, nada em código ou imagens."],
        ["Movimentação lateral depois de uma invasão", "**Zero trust**: não confiar só por estar dentro da rede; limites por serviço; menos portas abertas."],
        ["Falta de visibilidade", "Logs de acesso, tracing com correlation ID e alertas para padrões anômalos."]
      ] }
    ],
    traps: [
      "Achar que a rede interna é confiável.",
      "Token de serviço com acesso total.",
      "TLS sem validar os certificados.",
      "Segredos compartilhados e nunca rotacionados."
    ],
    rc: [
      ["O que o mTLS acrescenta ao TLS comum?", "Os dois lados apresentam certificados, então servidor e cliente provam sua identidade."],
      ["O que é zero trust?", "Não confiar numa chamada só porque ela vem da rede interna: autenticar e autorizar cada requisição, com privilégio mínimo."]
    ]
  },
  en: {
    s: "Securing inter-service communication",
    q: "How would you secure inter-service communication in a microservices architecture?",
    why: "Each security measure between services answers a specific threat. The threat → defense format avoids the memorized list and shows what each control prevents.",
    one: "Assume **the internal network is not trustworthy** (zero trust): **TLS/mTLS** on all internal traffic, **per-service identity** (short-lived certificates, SPIFFE/SPIRE), **service-to-service authorization** with least privilege, **network segmentation** with an **API gateway** as the only entry, **secrets in a vault** with rotation and **logs and tracing** for visibility.",
    b: [
      { t: "pr", a: "Threat", b: "Defense", r: [
        ["Interception or tampering between services (man-in-the-middle)", "**TLS** on all internal traffic and **mTLS**, so both sides prove identity (a service mesh such as Istio or Linkerd automates this)."],
        ["A fake service posing as another", "Workload identity (short-lived certificates, SPIFFE/SPIRE) and caller validation."],
        ["Unauthorized calls (one compromised service reaches everything)", "Service-to-service **authorization** (policies), minimal-scope tokens (OAuth client credentials, service JWT) and **least privilege**."],
        ["Public traffic reaching internal services", "Private network, **segmentation** (VPC, subnets, NetworkPolicies) and an API gateway as the only entry."],
        ["Exposed service secrets", "A secrets vault, rotation, nothing in code or images."],
        ["Lateral movement after a breach", "**Zero trust**: do not trust something just for being inside the network; per-service limits; fewer open ports."],
        ["Lack of visibility", "Access logs, tracing with a correlation ID and alerts for anomalous patterns."]
      ] }
    ],
    traps: [
      "Believing the internal network is trustworthy.",
      "A service token with full access.",
      "TLS without validating certificates.",
      "Shared secrets never rotated."
    ],
    rc: [
      ["What does mTLS add to plain TLS?", "Both sides present certificates, so server and client prove their identity."],
      ["What is zero trust?", "Not trusting a call just because it comes from the internal network: authenticate and authorize every request, with least privilege."]
    ]
  }
});

/* R49 */
window.QS.push({
  n: 149, g: "V", m: "threat",
  pt: {
    s: "Anomalias de dados em larga escala",
    q: "Discuta técnicas para prevenir e detectar anomalias de dados em sistemas de grande escala.",
    why: "Cada tipo de anomalia tem uma causa e uma defesa. O formato anomalia → prevenção/detecção mostra quais controles atuam antes e quais depois do dado entrar.",
    one: "**Previna** rejeitando o dado ruim na entrada (validação, schemas, constraints no banco) e tornando as escritas **idempotentes**; **detecte** o que escapa com **regras de qualidade de dados**, **reconciliação** entre sistemas, **detecção de anomalias** com alertas e **testes de dados** no pipeline; e **recupere** com versionamento, auditoria e backups com recuperação em ponto no tempo.",
    b: [
      { t: "pr", a: "Anomalia", b: "Prevenção e detecção", r: [
        ["Dado inválido entra no sistema", "**Validação** na borda e **constraints** no banco (tipos, `NOT NULL`, `CHECK`, `UNIQUE`, chaves estrangeiras); esquemas (JSON Schema, protobuf)."],
        ["Duplicatas e escritas repetidas", "Chaves únicas, **idempotência**, upsert e deduplicação por ID."],
        ["Estados inconsistentes entre sistemas", "Transações, outbox e saga, e **reconciliação** periódica comparando as fontes."],
        ["Valores fora do padrão (outliers, picos)", "Regras de qualidade e **detecção de anomalias** (limites, desvio padrão, janelas; ML se preciso) com alertas."],
        ["Mudança de formato ou significado a montante (schema drift)", "Contratos versionados, testes de contrato e monitoramento de esquema, nulos e distribuições."],
        ["Dado corrompido ou apagado por engano", "**Versionamento**, exclusão lógica, auditoria (quem e quando), backups e recuperação em ponto no tempo (PITR)."],
        ["Anomalias que passam despercebidas", "Métricas de qualidade (completude, unicidade, validade, atualidade), dashboards e testes de dados no pipeline (Great Expectations, dbt tests)."]
      ] },
      { t: "tp", k: "key", h: "Prevenir é mais barato", x: "Rejeite o dado ruim **na entrada**: detectar e corrigir depois, em larga escala, custa muito mais. Mas a detecção é a rede de segurança para o que escapa." }
    ],
    traps: [
      "Validar só no front-end.",
      "Apagar anomalias sem auditoria (perde-se o rastro).",
      "Sem reconciliação entre sistemas.",
      "Alertas de anomalia sem dono e sem runbook."
    ],
    rc: [
      ["Cite duas formas de prevenir dados inválidos.", "Validação na entrada e constraints no banco (tipos, NOT NULL, CHECK, UNIQUE, chaves estrangeiras)."],
      ["Para que serve a reconciliação?", "Comparar periodicamente as fontes para detectar e corrigir divergências que escaparam das transações."]
    ]
  },
  en: {
    s: "Data anomalies at scale",
    q: "Discuss techniques for preventing and detecting data anomalies in large-scale systems.",
    why: "Each kind of anomaly has a cause and a defense. The anomaly → prevention/detection format shows which controls act before and which after the data enters.",
    one: "**Prevent** by rejecting bad data at the entry (validation, schemas, database constraints) and making writes **idempotent**; **detect** what slips through with **data-quality rules**, **reconciliation** between systems, **anomaly detection** with alerts and **data tests** in the pipeline; and **recover** with versioning, auditing and backups with point-in-time recovery.",
    b: [
      { t: "pr", a: "Anomaly", b: "Prevention and detection", r: [
        ["Invalid data enters the system", "**Validation** at the edge and database **constraints** (types, `NOT NULL`, `CHECK`, `UNIQUE`, foreign keys); schemas (JSON Schema, protobuf)."],
        ["Duplicates and repeated writes", "Unique keys, **idempotency**, upsert and ID-based deduplication."],
        ["Inconsistent states across systems", "Transactions, outbox and saga, and periodic **reconciliation** comparing the sources."],
        ["Out-of-pattern values (outliers, spikes)", "Quality rules and **anomaly detection** (thresholds, standard deviation, windows; ML if needed) with alerts."],
        ["Upstream format or meaning change (schema drift)", "Versioned contracts, contract tests and monitoring of schema, nulls and distributions."],
        ["Data corrupted or deleted by mistake", "**Versioning**, soft delete, auditing (who and when), backups and point-in-time recovery (PITR)."],
        ["Anomalies that go unnoticed", "Quality metrics (completeness, uniqueness, validity, freshness), dashboards and data tests in the pipeline (Great Expectations, dbt tests)."]
      ] },
      { t: "tp", k: "key", h: "Prevention is cheaper", x: "Reject bad data **at the entry**: detecting and fixing it later, at scale, costs far more. But detection is the safety net for what slips through." }
    ],
    traps: [
      "Validating only in the front end.",
      "Deleting anomalies without auditing (the trail is lost).",
      "No reconciliation between systems.",
      "Anomaly alerts with no owner and no runbook."
    ],
    rc: [
      ["Name two ways to prevent invalid data.", "Validation at the entry and database constraints (types, NOT NULL, CHECK, UNIQUE, foreign keys)."],
      ["What is reconciliation for?", "Periodically comparing sources to detect and fix divergences that slipped past the transactions."]
    ]
  }
});

/* R50 */
window.QS.push({
  n: 150, g: "V", m: "design",
  pt: {
    s: "Armazenamento global e altamente disponível",
    q: "Descreva o processo de criar uma solução de armazenamento de dados global e de alta disponibilidade para uma aplicação multinacional.",
    why: "Um armazenamento global é um desenho completo com muitos trade-offs (consistência, latência, custo, conformidade). O roteiro de system design organiza as decisões em ordem.",
    one: "Use **várias regiões, cada uma com várias zonas de disponibilidade**, **replique os dados** entre elas, **roteie o usuário** para a região saudável mais próxima (DNS geográfico, anycast, balanceador global) e **escolha a consistência por operação** (forte onde o negócio exige, eventual onde tolera). Mantenha dados **perto de quem os usa** (afinidade e conformidade, como residência de dados) e **teste o failover**. Bancos globais prontos (Spanner, CockroachDB, Cosmos DB, DynamoDB Global Tables, Cassandra) ajudam.",
    b: [
      { t: "st", ti: "O roteiro aplicado", i: [
        ["1. Requisitos", "Disponibilidade-alvo (99,99%?), latência por região, consistência (forte ou eventual por operação), RPO e RTO, volume, conformidade (residência de dados: GDPR, LGPD)."],
        ["2. Topologia", "Várias **regiões**, cada uma com várias **zonas**; replicação entre zonas (síncrona, baixa latência) e entre regiões (em geral assíncrona)."],
        ["3. Modelo de replicação", "**Multilíder** (um líder por região), **líder global com réplicas** ou **sem líder (quórum)**; ou bancos globais prontos."],
        ["4. Consistência", "Forte onde o negócio exige (saldos): o consenso (Paxos/Raft) paga a latência entre regiões. Eventual onde tolera (perfil, catálogo), com resolução de conflitos."],
        ["5. Roteamento", "DNS geográfico, anycast e balanceadores globais levam o usuário à região mais próxima e saudável; failover automático com health checks."],
        ["6. Particionamento por localidade", "Os dados de um usuário ficam na sua região de origem (afinidade de dados), para baixa latência e conformidade; sharding por chave."],
        ["7. Falhas e recuperação", "Failover entre zonas e regiões, backups e PITR em outra região, exercícios de caos e de recuperação (game days)."],
        ["8. Governança e custo", "Criptografia, controle de acesso, residência de dados, observabilidade global e o custo da transferência entre regiões."]
      ] },
      { t: "tb", ti: "O trade-off central", h: ["Escolha", "Ganha", "Paga"], r: [
        ["Replicação síncrona entre regiões", "RPO ≈ 0 e consistência forte", "Latência de escrita alta; menos disponível numa partição"],
        ["Replicação assíncrona", "Escrita local rápida e alta disponibilidade", "Pode perder as últimas escritas num failover; conflitos"]
      ] }
    ],
    traps: [
      "Prometer consistência forte global e baixa latência ao mesmo tempo.",
      "Nunca testar o failover.",
      "Esquecer a residência de dados e o custo de transferência.",
      "Uma zona só chamada de “alta disponibilidade”."
    ],
    rc: [
      ["Qual a diferença entre zona de disponibilidade e região?", "Zonas são datacenters isolados dentro de uma região (baixa latência entre si); regiões são áreas geográficas distantes, que protegem contra falhas regionais e aproximam o usuário."],
      ["Por que replicação assíncrona entre regiões?", "Para não pagar a latência da distância em cada escrita, aceitando que um failover possa perder as últimas escritas."]
    ]
  },
  en: {
    s: "Global high-availability storage",
    q: "Describe the process of creating a global, high-availability data storage solution for a multinational application.",
    why: "Global storage is a complete design with many trade-offs (consistency, latency, cost, compliance). The system-design script organizes the decisions in order.",
    one: "Use **several regions, each with several availability zones**, **replicate the data** between them, **route the user** to the nearest healthy region (geo DNS, anycast, global load balancer) and **choose consistency per operation** (strong where the business demands it, eventual where it tolerates). Keep data **close to its users** (affinity and compliance, such as data residency) and **test failover**. Ready-made global databases (Spanner, CockroachDB, Cosmos DB, DynamoDB Global Tables, Cassandra) help.",
    b: [
      { t: "st", ti: "The script applied", i: [
        ["1. Requirements", "Availability target (99.99%?), per-region latency, consistency (strong or eventual per operation), RPO and RTO, volume, compliance (data residency: GDPR, LGPD)."],
        ["2. Topology", "Several **regions**, each with several **zones**; replication between zones (synchronous, low latency) and between regions (usually asynchronous)."],
        ["3. Replication model", "**Multi-leader** (one leader per region), **global leader with replicas** or **leaderless (quorum)**; or ready-made global databases."],
        ["4. Consistency", "Strong where the business demands it (balances): consensus (Paxos/Raft) pays cross-region latency. Eventual where it tolerates (profile, catalog), with conflict resolution."],
        ["5. Routing", "Geo DNS, anycast and global load balancers send the user to the nearest healthy region; automatic failover with health checks."],
        ["6. Locality partitioning", "A user’s data lives in their home region (data affinity), for low latency and compliance; sharding by key."],
        ["7. Failure and recovery", "Failover across zones and regions, backups and PITR in another region, chaos and recovery exercises (game days)."],
        ["8. Governance and cost", "Encryption, access control, data residency, global observability and the cost of cross-region transfer."]
      ] },
      { t: "tb", ti: "The central trade-off", h: ["Choice", "Gains", "Pays"], r: [
        ["Synchronous cross-region replication", "RPO ≈ 0 and strong consistency", "High write latency; less available in a partition"],
        ["Asynchronous replication", "Fast local writes and high availability", "May lose the latest writes on failover; conflicts"]
      ] }
    ],
    traps: [
      "Promising global strong consistency and low latency at the same time.",
      "Never testing failover.",
      "Forgetting data residency and transfer cost.",
      "A single zone called “high availability”."
    ],
    rc: [
      ["What is the difference between an availability zone and a region?", "Zones are isolated datacenters within a region (low latency between them); regions are distant geographic areas, protecting against regional failures and bringing users closer."],
      ["Why asynchronous replication between regions?", "To avoid paying distance latency on every write, accepting that a failover may lose the latest writes."]
    ]
  }
});
