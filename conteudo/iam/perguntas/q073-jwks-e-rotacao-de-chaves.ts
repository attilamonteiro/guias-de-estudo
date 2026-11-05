import type { Pergunta } from "../../tipos";

// Q73 · JWKS e rotação de chaves
export const q073: Pergunta = {
  numero: 73,
  modulo: "tokens-e-sessoes",
  metodo: "trace",
  pt: {
    titulo: "JWKS e rotação de chaves",
    pergunta:
      "Como funciona a rotação de chaves de assinatura com JWKS? Descreva o que acontece com os tokens em circulação e com o cache das APIs durante a troca.",
    porqueEsteMetodo:
      "A rotação de chaves é um problema de tempo: o que cada parte (emissor, tokens em circulação, caches das APIs) sabe em cada instante. Seguir a linha do tempo, inclusive os caminhos em que algo dá errado, mostra por que a ordem das etapas importa.",
    resposta30s:
      "O **JWKS** é um JSON publicado pelo emissor (o `jwks_uri`) com as **chaves públicas** de assinatura, cada uma com um `kid`. Na rotação, **publique a chave nova antes de assinar com ela**, passe a assinar com a nova, **mantenha a antiga até os tokens que ela assinou expirarem** e só então a remova. As APIs guardam o JWKS em cache e, diante de um `kid` desconhecido, recarregam **uma vez, com limite**; na rotação de emergência, a chave comprometida sai na hora.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A rotação normal, sem queda",
        etapas: [
          "Estado inicial: o JWKS tem só a chave `k1`, os tokens carregam `kid: k1` e as APIs têm `k1` em cache",
          "Publicar: o emissor gera a `k2` e a acrescenta ao JWKS, **sem usá-la ainda**; o JWKS passa a ter `k1` e `k2`",
          "Esperar a propagação: passa o tempo de cache das APIs, e todas conhecem a `k2` antes de qualquer token usá-la",
          "Trocar: o emissor passa a assinar com a `k2`; os tokens novos carregam `kid: k2`, e os antigos (`k1`) continuam válidos e verificáveis",
          "Esperar a expiração: passa o tempo de vida do maior token assinado com a `k1` (access token, mais ID tokens e a tolerância de relógio)",
          "Remover: a `k1` sai do JWKS e as APIs a esquecem quando o cache renovar; a chave privada da `k1` é arquivada ou destruída conforme a política",
        ],
        nota: "Duas esperas, dois motivos: a primeira protege contra o **cache velho** (API que ainda não conhece a chave nova); a segunda, contra o **token em circulação** (que ainda precisa da chave antiga). Se o emissor é gerenciado, ele costuma rotacionar sozinho: a sua API deve ler o JWKS dinamicamente, nunca copiar a chave para o código ou para a configuração.",
      },
      {
        tipo: "passos",
        titulo: "Uma requisição durante a troca",
        passos: [
          {
            titulo: "Caminho feliz",
            texto:
              "Chega um token com `kid: k2`. A API procura no cache do JWKS, encontra, verifica a assinatura e segue (veja Q72). Chega outro com `kid: k1`: ele também está no JWKS enquanto a chave antiga não foi removida.",
          },
          {
            titulo: "`kid` desconhecido",
            texto:
              "Chega um token com um `kid` que não está no cache, porque a rotação aconteceu depois do último download. A API recarrega o JWKS uma única vez, sem repetir a busca para cada requisição simultânea, e tenta de novo. Se achou a chave, segue; se não achou, responde 401.",
          },
          {
            titulo: "Limite contra abuso",
            texto:
              "Um atacante pode mandar tokens com `kid` aleatório para forçar uma recarga a cada requisição. Por isso há um intervalo mínimo entre recargas (cooldown) e uma memória curta dos `kid` já recusados. Bibliotecas como a `jose` (`createRemoteJWKSet`) e o middleware do ASP.NET Core já cuidam disso; confira as opções da sua versão.",
          },
          {
            titulo: "Falha: cache velho",
            texto:
              "A API ficou com o JWKS antigo (TTL longo demais, recarga bloqueada, emissor fora do ar). Tokens com a `k2` são recusados com 401 até o cache renovar. É o sintoma de “depois da rotação, falha para parte dos usuários”. Conserto: TTL moderado, respeitar o `Cache-Control` do JWKS dentro de limites e alertar sobre a taxa de 401 por `kid` desconhecido.",
          },
          {
            titulo: "Falha: remoção cedo demais",
            texto:
              "Se a `k1` sai do JWKS antes de os tokens assinados por ela expirarem, tokens ainda válidos passam a ser recusados: usuários deslogados e erros em lote. Conserto: respeitar a segunda espera e conferir o tempo de vida máximo dos tokens.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O JWKS durante a sobreposição",
        legenda: "JSON",
        codigo: `{
  "keys": [
    {
      "kty": "EC", "crv": "P-256", "kid": "2026-09", "use": "sig", "alg": "ES256",
      "x": "<coordenada x da chave antiga>", "y": "<coordenada y>"
    },
    {
      "kty": "EC", "crv": "P-256", "kid": "2026-11", "use": "sig", "alg": "ES256",
      "x": "<coordenada x da chave nova>", "y": "<coordenada y>"
    }
  ]
}`,
        nota: "Só parâmetros públicos, nunca o `d` da chave privada. O token carrega o `kid` no header, e a API escolhe a chave por ele.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra da ordem",
        texto:
          "**Publique antes de usar; remova depois de expirar.** Chave nova no JWKS antes da primeira assinatura (espera maior ou igual ao tempo de cache das APIs); chave antiga no JWKS até o último token que ela assinou expirar (espera maior ou igual à vida máxima do token, mais a tolerância de relógio). Automatize a rotação e ensaie-a, para que ela seja rotina, e não um evento.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Rotação de emergência: a prioridade se inverte",
        texto:
          "Se a chave privada vazou, a sobreposição é o problema: enquanto a pública estiver no JWKS, o atacante emite tokens aceitos. Remova a chave comprometida **imediatamente**, passe a assinar com uma nova, aceite que os tokens ainda válidos assinados por ela serão recusados (as pessoas terão de refazer o login), invalide sessões e refresh tokens se for preciso e force a renovação do cache das APIs (um TTL curto ajuda). Depois, investigue o alcance (veja Q141 e Q140). A rotação normal preserva a disponibilidade; a de emergência sacrifica disponibilidade em nome da segurança.",
      },
    ],
    armadilhas: [
      "Assinar com a chave nova antes de ela estar no JWKS e propagada: as APIs com cache velho recusam tokens legítimos.",
      "Remover a chave antiga no mesmo instante em que a nova começa a assinar: os tokens em circulação passam a falhar.",
      "Copiar a chave pública ou o certificado para o código ou a configuração da API: a primeira rotação do emissor vira uma queda. Leia o JWKS do `jwks_uri`.",
      "Recarregar o JWKS a cada `kid` desconhecido sem limite, ou confiar numa URL de chave vinda do token: abre espaço para abuso e para chaves do atacante (veja Q133).",
    ],
    autoteste: [
      {
        pergunta: "Por que a chave nova precisa estar no JWKS antes de ser usada para assinar?",
        resposta:
          "Porque as APIs guardam o JWKS em cache. Se o emissor começar a assinar antes de o cache renovar, as APIs recebem tokens com um `kid` que não conhecem e recusam tokens legítimos. A espera dá tempo de todas aprenderem a chave.",
      },
      {
        pergunta: "O que muda na rotação por comprometimento em relação à rotação normal?",
        resposta:
          "A chave comprometida é removida do JWKS imediatamente, sem sobreposição, aceitando recusar tokens ainda válidos. Prioriza-se impedir que o atacante emita tokens, e não a continuidade do serviço.",
      },
    ],
  },
  en: {
    titulo: "JWKS and key rotation",
    pergunta:
      "How does signing key rotation work with JWKS? Describe what happens to tokens in circulation and to API caches during the switch.",
    porqueEsteMetodo:
      "Key rotation is a timing problem: what each party (issuer, tokens in circulation, API caches) knows at each instant. Following the timeline, including the paths where something goes wrong, shows why the order of the steps matters.",
    resposta30s:
      "The **JWKS** is a JSON document published by the issuer (the `jwks_uri`) with the signing **public keys**, each with a `kid`. In a rotation, **publish the new key before signing with it**, start signing with the new one, **keep the old one until the tokens it signed have expired** and only then remove it. APIs cache the JWKS and, faced with an unknown `kid`, reload **once, with a limit**; in an emergency rotation, the compromised key goes out immediately.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "The normal rotation, with no downtime",
        etapas: [
          "Initial state: the JWKS has only key `k1`, tokens carry `kid: k1` and the APIs have `k1` cached",
          "Publish: the issuer generates `k2` and adds it to the JWKS, **without using it yet**; the JWKS now has `k1` and `k2`",
          "Wait for propagation: the APIs’ cache time passes, and all of them know `k2` before any token uses it",
          "Switch: the issuer starts signing with `k2`; new tokens carry `kid: k2`, and the old ones (`k1`) stay valid and verifiable",
          "Wait for expiry: the lifetime of the longest token signed with `k1` passes (access tokens, plus ID tokens and the clock tolerance)",
          "Remove: `k1` leaves the JWKS and the APIs forget it when their cache refreshes; the private key of `k1` is archived or destroyed according to policy",
        ],
        nota: "Two waits, two reasons: the first protects against the **stale cache** (an API that does not yet know the new key); the second, against the **token in circulation** (which still needs the old key). If the issuer is managed, it usually rotates on its own: your API must read the JWKS dynamically, never copy the key into code or configuration.",
      },
      {
        tipo: "passos",
        titulo: "One request during the switch",
        passos: [
          {
            titulo: "Happy path",
            texto:
              "A token arrives with `kid: k2`. The API looks in the JWKS cache, finds it, verifies the signature and carries on (see Q72). Another arrives with `kid: k1`: it is also in the JWKS as long as the old key has not been removed.",
          },
          {
            titulo: "Unknown `kid`",
            texto:
              "A token arrives with a `kid` that is not in the cache, because the rotation happened after the last download. The API reloads the JWKS exactly once, without repeating the fetch for every simultaneous request, and tries again. If it finds the key, it carries on; if not, it answers 401.",
          },
          {
            titulo: "Limit against abuse",
            texto:
              "An attacker can send tokens with random `kid` values to force a reload on every request. That is why there is a minimum interval between reloads (cooldown) and a short memory of `kid` values already rejected. Libraries such as `jose` (`createRemoteJWKSet`) and the ASP.NET Core middleware already handle this; check the options for your version.",
          },
          {
            titulo: "Failure: stale cache",
            texto:
              "The API kept the old JWKS (TTL too long, reload blocked, issuer down). Tokens with `k2` are rejected with 401 until the cache refreshes. It is the symptom of “after the rotation, it fails for part of the users”. Fix: a moderate TTL, respect the JWKS `Cache-Control` within limits and alert on the rate of 401s for unknown `kid`.",
          },
          {
            titulo: "Failure: removal too early",
            texto:
              "If `k1` leaves the JWKS before the tokens it signed have expired, tokens that are still valid start being rejected: users logged out and errors in bulk. Fix: respect the second wait and check the maximum token lifetime.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The JWKS during the overlap",
        legenda: "JSON",
        codigo: `{
  "keys": [
    {
      "kty": "EC", "crv": "P-256", "kid": "2026-09", "use": "sig", "alg": "ES256",
      "x": "<x coordinate of the old key>", "y": "<y coordinate>"
    },
    {
      "kty": "EC", "crv": "P-256", "kid": "2026-11", "use": "sig", "alg": "ES256",
      "x": "<x coordinate of the new key>", "y": "<y coordinate>"
    }
  ]
}`,
        nota: "Public parameters only, never the private key’s `d`. The token carries the `kid` in its header, and the API picks the key by it.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The order rule",
        texto:
          "**Publish before using; remove after expiry.** New key in the JWKS before the first signature (wait at least the APIs’ cache time); old key in the JWKS until the last token it signed has expired (wait at least the maximum token lifetime, plus the clock tolerance). Automate the rotation and rehearse it, so it is routine, not an event.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Emergency rotation: the priority flips",
        texto:
          "If the private key leaked, the overlap is the problem: as long as the public key is in the JWKS, the attacker issues tokens that are accepted. Remove the compromised key **immediately**, start signing with a new one, accept that still-valid tokens signed by it will be rejected (people will have to log in again), invalidate sessions and refresh tokens if needed and force the APIs’ cache to refresh (a short TTL helps). Then investigate the scope (see Q141 and Q140). Normal rotation preserves availability; emergency rotation sacrifices availability for security.",
      },
    ],
    armadilhas: [
      "Signing with the new key before it is in the JWKS and propagated: APIs with a stale cache reject legitimate tokens.",
      "Removing the old key at the very moment the new one starts signing: tokens in circulation start failing.",
      "Copying the public key or certificate into the API’s code or configuration: the issuer’s first rotation becomes an outage. Read the JWKS from the `jwks_uri`.",
      "Reloading the JWKS on every unknown `kid` with no limit, or trusting a key URL that comes from the token: it opens the door to abuse and to attacker keys (see Q133).",
    ],
    autoteste: [
      {
        pergunta: "Why must the new key be in the JWKS before it is used to sign?",
        resposta:
          "Because APIs cache the JWKS. If the issuer starts signing before the cache refreshes, the APIs receive tokens with a `kid` they do not know and reject legitimate tokens. The wait gives all of them time to learn the key.",
      },
      {
        pergunta: "What changes in a compromise rotation compared with a normal rotation?",
        resposta:
          "The compromised key is removed from the JWKS immediately, with no overlap, accepting the rejection of still-valid tokens. The priority is stopping the attacker from issuing tokens, not keeping the service running.",
      },
    ],
  },
};
