import type { Pergunta } from "../../tipos";

// Q84 · Propagar identidade entre serviços
export const q084: Pergunta = {
  numero: 84,
  modulo: "tokens-e-sessoes",
  metodo: "design",
  pt: {
    titulo: "Propagar identidade entre serviços",
    pergunta:
      "Como você projetaria a propagação de identidade e a validação de tokens entre microsserviços: na borda, em cada serviço ou em ambos? Como evitar o confused deputy?",
    porqueEsteMetodo:
      "É uma pergunta de projeto, e um roteiro fixo evita tanto o esquecimento quanto o mergulho em detalhes: requisitos e tráfego, a decisão central (onde validar), a troca de token, a identidade dos serviços, as audiences e a operação, nessa ordem.",
    resposta30s:
      "Valide o token **na borda e em cada serviço**: a borda barra o que é inválido cedo, e cada serviço valida de novo porque a rede interna não é prova de identidade (zero trust). Em vez de repassar o token do usuário, **troque-o (token exchange) por um token interno de curta duração**, com a **audience** do serviço de destino e o usuário original identificado, e proteja o tráfego leste-oeste com **mTLS**. Isso evita o **confused deputy**: o serviço intermediário não usa a própria autoridade, nem um token que não era seu, para dar ao chamador o que ele não poderia obter sozinho.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos e o mapa do tráfego",
            texto:
              "Zero trust interno (a rede interna não prova identidade; veja Q120 e a NIST SP 800-207), latência baixa (nada de chamar o IdP a cada salto), auditoria (quem iniciou e quem executou) e raio de dano pequeno quando um serviço for comprometido. Há dois tipos de tráfego: o **norte-sul**, em que o cliente externo entra pela borda (gateway, WAF, balanceador), e o **leste-oeste**, em que os serviços falam entre si dentro da plataforma. O norte-sul costuma ter autenticação; é no leste-oeste que a confiança implícita faz estrago.",
          },
          {
            titulo: "2. Decisão central: onde validar",
            texto:
              "Na borda, o gateway valida o token do usuário (assinatura, `iss`, `aud`, `exp`, escopos gerais), aplica limite de taxa e barra o lixo cedo. Em cada serviço, a validação se repete, porque ele não deve supor que só o gateway chega até ele. A resposta é **ambos** (veja a tabela).",
          },
          {
            titulo: "3. Token de borda trocado por token interno",
            texto:
              "O token que o cliente apresenta tem a `aud` do gateway ou da API pública e escopos amplos. Em vez de repassá-lo, o gateway (ou um serviço de tokens) faz um **token exchange** (RFC 8693) e emite um token interno de poucos minutos, com a `aud` do serviço de destino, claims reduzidos, o usuário original em `sub` e quem agiu em nome dele em `act` (veja Q36).",
          },
          {
            titulo: "4. Identidade dos serviços",
            texto:
              "Cada serviço prova quem é: **mTLS** com certificados de curta duração emitidos pela malha ou pela plataforma (identidades de carga de trabalho; veja Q14), ou tokens de serviço pelo client credentials (veja Q31). Assim o serviço chamado sabe **quem chama** (o serviço) e **em nome de quem** (o usuário), que são duas respostas diferentes.",
          },
          {
            titulo: "5. Propagar o contexto do usuário",
            texto:
              "Nunca confie em cabeçalhos como `X-User-Id` sem assinatura: qualquer serviço comprometido vira qualquer usuário. Propague o token interno assinado (ou um contexto assinado pelo gateway) e deixe cada serviço autorizar com o `sub`, os escopos e a regra local do seu domínio (veja Q115 e Q116).",
          },
          {
            titulo: "6. Audiences por serviço e o confused deputy",
            texto:
              "O token interno só serve ao serviço indicado em `aud`. Quando o serviço A precisa chamar o B, troca o token (on-behalf-of) por outro com a `aud` do B e escopo mínimo, em vez de usar o recebido ou uma credencial própria poderosa. Assim, A não é induzido a usar a sua autoridade em favor de um chamador que não tem esse direito (veja o aviso abaixo).",
          },
          {
            titulo: "7. Auditoria e gargalos",
            texto:
              "Registre em cada salto o identificador de correlação, o `sub`, o serviço chamador e a decisão. Os gargalos previsíveis: a busca da JWKS a cada requisição (use cache; veja Q73), a troca de token em toda chamada (cache por usuário e destino, respeitando o prazo), tokens grandes demais para os limites de cabeçalho (carregue o mínimo e consulte a autorização perto do dado) e o serviço de tokens como ponto único de falha (replicação e prazos que sobrevivam a uma queda curta).",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Onde validar o token",
        colunas: ["Opção", "Como funciona", "Vantagens", "Riscos"],
        linhas: [
          [
            "Só na borda (gateway)",
            "O gateway valida o token e os serviços internos confiam em cabeçalhos ou na rede",
            "Simples e rápido; um só lugar a manter",
            "Tudo o que chega por outro caminho (outro serviço, um job, um vazamento de rede) passa sem checagem; o gateway é ponto único de falha",
          ],
          [
            "Só em cada serviço",
            "Cada serviço valida o token por conta própria",
            "Sem confiança implícita; cada serviço se protege",
            "Validação repetida e inconsistente se cada equipe implementar a sua; o tráfego inválido chega mais fundo",
          ],
          [
            "Ambos (recomendado)",
            "A borda barra o inválido e aplica limites; cada serviço revalida o token interno, com uma biblioteca compartilhada",
            "Defesa em profundidade e raio de dano pequeno",
            "Custo de validar mais de uma vez (a assinatura é barata se a JWKS estiver em cache)",
          ],
          [
            "Borda, mTLS e token interno (malha de serviços)",
            "A borda valida e troca o token; o tráfego interno usa mTLS com identidade de serviço mais o token interno",
            "Identidade forte do serviço e do usuário em cada salto; políticas por serviço",
            "Mais peças (malha, emissor de certificados, serviço de tokens) para operar",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Uma requisição atravessando os serviços",
        etapas: [
          "O navegador chama `GET /pedidos/42` no gateway, com o access token do usuário (tráfego norte-sul)",
          "O gateway valida assinatura, `iss`, `aud`, `exp` e escopos, aplica limite de taxa e troca o token (RFC 8693) por um token interno de poucos minutos, com `aud=pedidos`, o `sub` do usuário e o gateway em `act`",
          "O serviço de pedidos aceita a conexão por mTLS, valida o token interno com a JWKS em cache e autoriza: o pedido 42 pertence a este usuário?",
          "Pedidos precisa consultar o estoque: em vez de repassar o token recebido, troca-o por outro com `aud=estoque` e escopo mínimo (tráfego leste-oeste, on-behalf-of)",
          "O estoque valida `aud`, `iss`, `exp` e a cadeia de `act`, aplica a sua política e recusa qualquer token cuja `aud` não seja a sua",
          "Cada salto registra o identificador de correlação, o `sub`, o serviço chamador e a decisão; se uma validação falha, a resposta é 401 ou 403 e a cadeia para, sem recorrer a “confiar na rede interna”",
        ],
        nota: "Cada troca reduz o poder: o token que sai do gateway vale para um serviço e por poucos minutos, e não para a plataforma inteira.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Valide **na borda e em cada serviço**, e **nunca repasse** o token recebido: troque-o por um token interno curto, com a `aud` do destino e o usuário original identificado, e proteja o leste-oeste com mTLS. Em cada salto, a pergunta é: quem está chamando, em nome de quem, para qual serviço e com que permissão?",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Confused deputy e eventos",
        texto:
          "O **confused deputy** ocorre quando um serviço intermediário, com mais poder que o chamador, age em nome dele usando a **própria** autoridade (ou aceita um token que não era para ele): o chamador consegue, por meio dele, o que não poderia fazer sozinho. Evita-se com audience por serviço, troca on-behalf-of com escopo reduzido, checagem da autorização do chamador original e nenhum “token passthrough”. As **arquiteturas orientadas a eventos** têm o mesmo problema com outra forma: produtores e consumidores se autenticam no broker (mTLS ou tokens de serviço) com ACLs por tópico, o evento leva o `sub` para auditoria mas **não** o token do usuário (ele expira antes do consumo) e o consumidor autoriza como serviço, validando o esquema e a origem da mensagem.",
      },
    ],
    armadilhas: [
      "Confiar na rede interna e aceitar `X-User-Id` ou `X-Roles` sem assinatura: qualquer serviço comprometido passa a ser qualquer usuário.",
      "Repassar o mesmo token por toda a malha (“token passthrough”): a `aud` fica errada, o escopo fica amplo e qualquer serviço pode reutilizá-lo para chamar os outros.",
      "Chamar o endpoint de introspecção a cada salto ou buscar a JWKS a cada requisição: o IdP vira gargalo e ponto único de falha; use cache.",
      "Pôr papéis e permissões demais nos claims: tokens enormes estouram os limites de cabeçalho; carregue o mínimo e consulte a autorização perto do dado.",
    ],
    autoteste: [
      {
        pergunta: "O que é o confused deputy num cenário de microsserviços, e como evitá-lo?",
        resposta:
          "É um serviço intermediário que usa a sua própria autoridade, ou um token que não era para ele, para atender um chamador que não teria direito ao recurso. Evita-se com audience por serviço, troca de token com escopo reduzido (on-behalf-of) e checagem da autorização do chamador original, sem repassar tokens.",
      },
      {
        pergunta: "Por que validar no gateway não dispensa validar em cada serviço?",
        resposta:
          "Porque um serviço não tem como saber que só o gateway chega até ele: outro serviço comprometido, um job ou um vazamento de rede podem chamá-lo direto. A validação em cada serviço é a defesa em profundidade do zero trust.",
      },
    ],
  },
  en: {
    titulo: "Propagating identity across services",
    pergunta:
      "How would you design identity propagation and token validation across microservices: at the edge, in each service, or both? How do you avoid the confused deputy problem?",
    porqueEsteMetodo:
      "This is a design question, and a fixed script avoids both forgetting things and drowning in detail: requirements and traffic, the central decision (where to validate), token exchange, service identity, audiences and operations, in that order.",
    resposta30s:
      "Validate the token **at the edge and in each service**: the edge turns away what is invalid early, and each service validates again because the internal network is not proof of identity (zero trust). Instead of forwarding the user’s token, **exchange it (token exchange) for a short-lived internal token**, with the destination service’s **audience** and the original user identified, and protect east-west traffic with **mTLS**. That avoids the **confused deputy**: the intermediate service does not use its own authority, or a token that was not meant for it, to give the caller what the caller could not get alone.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements and the traffic map",
            texto:
              "Internal zero trust (the internal network does not prove identity; see Q120 and NIST SP 800-207), low latency (no calling the IdP at every hop), auditing (who started it and who executed it) and a small blast radius when a service is compromised. There are two kinds of traffic: **north-south**, where the external client enters through the edge (gateway, WAF, load balancer), and **east-west**, where services talk to each other inside the platform. North-south usually has authentication; east-west is where implicit trust does the damage.",
          },
          {
            titulo: "2. Central decision: where to validate",
            texto:
              "At the edge, the gateway validates the user’s token (signature, `iss`, `aud`, `exp`, coarse scopes), applies rate limits and turns junk away early. In each service, validation is repeated, because it must not assume that only the gateway reaches it. The answer is **both** (see the table).",
          },
          {
            titulo: "3. Edge token exchanged for an internal token",
            texto:
              "The token the client presents carries the gateway’s or the public API’s `aud` and broad scopes. Instead of forwarding it, the gateway (or a token service) performs a **token exchange** (RFC 8693) and issues an internal token of a few minutes, with the destination service’s `aud`, reduced claims, the original user in `sub` and whoever acted on their behalf in `act` (see Q36).",
          },
          {
            titulo: "4. Service identity",
            texto:
              "Each service proves who it is: **mTLS** with short-lived certificates issued by the mesh or the platform (workload identities; see Q14), or service tokens through client credentials (see Q31). That way the called service knows **who is calling** (the service) and **on whose behalf** (the user), which are two different answers.",
          },
          {
            titulo: "5. Propagating the user context",
            texto:
              "Never trust headers like `X-User-Id` without a signature: any compromised service becomes any user. Propagate the signed internal token (or a context signed by the gateway) and let each service authorize with the `sub`, the scopes and the local rule of its own domain (see Q115 and Q116).",
          },
          {
            titulo: "6. Per-service audiences and the confused deputy",
            texto:
              "The internal token is only good for the service named in `aud`. When service A has to call B, it exchanges the token (on-behalf-of) for another with B’s `aud` and minimal scope, instead of using the one it received or a powerful credential of its own. That way A is not tricked into using its authority for a caller who has no such right (see the warning below).",
          },
          {
            titulo: "7. Auditing and bottlenecks",
            texto:
              "Record at every hop the correlation id, the `sub`, the calling service and the decision. The predictable bottlenecks: fetching the JWKS on every request (cache it; see Q73), exchanging a token on every call (cache per user and destination, respecting the lifetime), tokens too large for header limits (carry the minimum and look up authorization close to the data) and the token service as a single point of failure (replication and lifetimes that survive a short outage).",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Where to validate the token",
        colunas: ["Option", "How it works", "Advantages", "Risks"],
        linhas: [
          [
            "Edge only (gateway)",
            "The gateway validates the token and internal services trust headers or the network",
            "Simple and fast; one place to maintain",
            "Anything arriving by another path (another service, a job, a network leak) passes unchecked; the gateway is a single point of failure",
          ],
          [
            "Each service only",
            "Each service validates the token on its own",
            "No implicit trust; every service protects itself",
            "Repeated and inconsistent validation if each team writes its own; invalid traffic travels deeper",
          ],
          [
            "Both (recommended)",
            "The edge turns away the invalid and enforces limits; each service revalidates the internal token, with a shared library",
            "Defense in depth and a small blast radius",
            "The cost of validating more than once (a signature check is cheap if the JWKS is cached)",
          ],
          [
            "Edge, mTLS and internal token (service mesh)",
            "The edge validates and exchanges the token; internal traffic uses mTLS with service identity plus the internal token",
            "Strong service and user identity at every hop; per-service policies",
            "More pieces (mesh, certificate issuer, token service) to operate",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "One request crossing the services",
        etapas: [
          "The browser calls `GET /orders/42` at the gateway, with the user’s access token (north-south traffic)",
          "The gateway validates signature, `iss`, `aud`, `exp` and scopes, applies rate limits and exchanges the token (RFC 8693) for an internal token of a few minutes, with `aud=orders`, the user’s `sub` and the gateway in `act`",
          "The orders service accepts the connection over mTLS, validates the internal token with the cached JWKS and authorizes: does order 42 belong to this user?",
          "Orders needs to query inventory: instead of forwarding the token it received, it exchanges it for another with `aud=inventory` and minimal scope (east-west traffic, on-behalf-of)",
          "Inventory validates `aud`, `iss`, `exp` and the `act` chain, applies its own policy and refuses any token whose `aud` is not its own",
          "Each hop records the correlation id, the `sub`, the calling service and the decision; if a validation fails, the answer is 401 or 403 and the chain stops, without falling back to “trust the internal network”",
        ],
        nota: "Each exchange reduces power: the token leaving the gateway is good for one service and for a few minutes, not for the whole platform.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Validate **at the edge and in each service**, and **never forward** the token you received: exchange it for a short internal token, with the destination’s `aud` and the original user identified, and protect east-west with mTLS. At every hop the question is: who is calling, on whose behalf, for which service and with what permission?",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Confused deputy and events",
        texto:
          "The **confused deputy** happens when an intermediate service, with more power than the caller, acts on the caller’s behalf using its **own** authority (or accepts a token that was not meant for it): the caller gets through it what it could not do alone. You avoid it with per-service audiences, on-behalf-of exchange with reduced scope, a check of the original caller’s authorization and no “token passthrough”. **Event-driven architectures** have the same problem in another form: producers and consumers authenticate to the broker (mTLS or service tokens) with per-topic ACLs, the event carries the `sub` for auditing but **not** the user’s token (it expires before consumption), and the consumer authorizes as a service, validating the schema and the message’s origin.",
      },
    ],
    armadilhas: [
      "Trusting the internal network and accepting `X-User-Id` or `X-Roles` without a signature: any compromised service becomes any user.",
      "Forwarding the same token across the whole mesh (“token passthrough”): the `aud` is wrong, the scope is broad and any service can reuse it to call the others.",
      "Calling the introspection endpoint at every hop or fetching the JWKS on every request: the IdP becomes a bottleneck and a single point of failure; use caching.",
      "Putting too many roles and permissions in the claims: huge tokens blow past header limits; carry the minimum and look up authorization close to the data.",
    ],
    autoteste: [
      {
        pergunta: "What is the confused deputy in a microservices scenario, and how do you avoid it?",
        resposta:
          "It is an intermediate service that uses its own authority, or a token that was not meant for it, to serve a caller who would have no right to the resource. You avoid it with per-service audiences, token exchange with reduced scope (on-behalf-of) and a check of the original caller’s authorization, without forwarding tokens.",
      },
      {
        pergunta: "Why does validating at the gateway not remove the need to validate in each service?",
        resposta:
          "Because a service cannot know that only the gateway reaches it: another compromised service, a job or a network leak can call it directly. Validation in each service is the defense in depth of zero trust.",
      },
    ],
  },
};
