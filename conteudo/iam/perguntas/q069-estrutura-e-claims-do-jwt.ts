import type { Pergunta } from "../../tipos";

// Q69 · Estrutura e claims do JWT
export const q069: Pergunta = {
  numero: 69,
  modulo: "tokens-e-sessoes",
  metodo: "feynman",
  pt: {
    titulo: "Estrutura e claims do JWT",
    pergunta:
      "Como é a estrutura de um JWT (header, payload, assinatura)? O payload é criptografado? Quais são as claims registradas e para que serve cada uma?",
    porqueEsteMetodo:
      "O JWT parece mágico até você ver que é só texto em três pedaços. Uma analogia simples (envelope com janela e lacre) fixa a ideia central, “legível, mas inviolável”, e o mecanismo real mostra o que a assinatura garante e o que ela não garante.",
    resposta30s:
      "Um JWT assinado tem **três partes** separadas por pontos: **header** (algoritmo e `kid`), **payload** (as claims) e **assinatura**, cada uma em **base64url**. O payload **não é criptografado**: quem tiver o token o lê, e a assinatura só garante que ele **não foi alterado** e **quem o emitiu**. As claims registradas são `iss` (emissor), `sub` (sujeito), `aud` (destinatário), `exp` (expira), `nbf` (não vale antes), `iat` (emitido em) e `jti` (identificador único).",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine uma carta num envelope com janela de plástico transparente e um lacre de cera com o selo do emissor. Qualquer pessoa que segure o envelope lê a carta pela janela, mas, para mudar uma palavra, é preciso romper o lacre, e ninguém refaz o selo sem a chancela do emissor. Quem recebe confere o selo contra o desenho que conhece e só então confia no que leu.",
        tecnico:
          "O JWT assinado (um JWS em formato compacto, RFC 7515; o JWT em si é a RFC 7519) é `base64url(header).base64url(payload).base64url(assinatura)`. Header e payload são JSON codificados em base64url, um alfabeto seguro para URLs (`-` e `_`, sem `=`). A assinatura é calculada sobre os dois primeiros segmentos, com o algoritmo do header e a chave do emissor; mudar um caractere de qualquer um deles muda a entrada, e a verificação falha. Quem valida precisa da chave de verificação do emissor (veja Q71 e Q73).",
        limite:
          "A janela é aberta: **base64url é codificação, não criptografia**, então nada ali é secreto. O lacre prova origem e integridade, mas não prova que o conteúdo continua verdadeiro (o papel de alguém pode ter mudado, veja Q76) nem impede que outra pessoa que roube o envelope o apresente, porque o JWT é um token ao portador. Se o conteúdo precisa ser confidencial, o formato é outro, o JWE (veja Q70).",
      },
      {
        tipo: "codigo",
        titulo: "As três partes de um token, decodificadas",
        legenda: "JWT",
        codigo: `// 1. header
{ "alg": "ES256", "typ": "JWT", "kid": "2026-10" }

// 2. payload (claims registradas e uma claim própria)
{
  "iss": "https://id.exemplo.com",
  "sub": "usr_8f3a1c",
  "aud": "api://pedidos",
  "iat": 1793000000,
  "nbf": 1793000000,
  "exp": 1793000900,
  "jti": "b7d1f0aa-4c1e-4a39-9d52-3f0e8c2a11aa",
  "scope": "pedidos:ler"
}

// 3. assinatura: bytes calculados sobre "base64url(header).base64url(payload)"`,
        nota: "Os três segmentos viajam como texto base64url separado por pontos. `exp`, `nbf` e `iat` são segundos desde 1970 (NumericDate), e não milissegundos.",
      },
      {
        tipo: "tabela",
        titulo: "Claims registradas (RFC 7519)",
        colunas: ["Claim", "Para que serve", "Quem confere e como", "Cuidado"],
        linhas: [
          [
            "`iss` (issuer)",
            "Quem emitiu o token (normalmente uma URL do emissor)",
            "A API compara com o emissor que ela configurou, texto exato",
            "Aceitar “qualquer emissor” permite tokens bem assinados pelo próprio atacante",
          ],
          [
            "`sub` (subject)",
            "A quem o token se refere (usuário ou aplicação), estável dentro do emissor",
            "A aplicação o usa como identificador, junto com o `iss`",
            "Não use e-mail ou nome como chave: podem mudar e se repetir",
          ],
          [
            "`aud` (audience)",
            "Para quem o token foi emitido (uma API); pode ser texto ou lista",
            "A API confere que o seu próprio identificador está em `aud`",
            "Sem isso, um token feito para outra API serve nesta (veja Q72)",
          ],
          [
            "`exp` (expiration)",
            "O instante a partir do qual o token deixa de valer",
            "A API recusa token expirado, com pequena tolerância de relógio",
            "É em segundos; token sem `exp` não deve passar",
          ],
          [
            "`nbf` (not before)",
            "O instante antes do qual o token ainda não vale",
            "A API recusa token usado cedo demais, com a mesma tolerância",
            "Relógios fora de sincronia causam recusas “intermitentes”",
          ],
          [
            "`iat` (issued at)",
            "Quando o token foi emitido",
            "Serve para idade máxima, auditoria e para invalidar tokens emitidos antes de um evento",
            "Sozinho não decide validade",
          ],
          [
            "`jti` (JWT ID)",
            "Identificador único do token",
            "Detecta repetição, entra em listas de revogação e em logs",
            "Só protege se o servidor guardar e consultar os já vistos",
          ],
        ],
        nota: "Além das registradas, há claims definidas por outras especificações (como `scope`, `email` ou `nonce`) e claims privadas da sua aplicação; o significado de cada uma vem da especificação ou do contrato que a define. O header traz `alg`, `kid` e `typ`.",
      },
      {
        tipo: "codigo",
        titulo: "Decodificar não é verificar",
        legenda: "TypeScript",
        codigo: `// Qualquer pessoa, sem chave nenhuma, lê o payload:
const [, payloadB64] = token.split(".");
const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
console.log(payload.sub, payload.exp);

// Isto é DECODIFICAR: não prova nada, e qualquer pessoa também monta um token assim.
// Para confiar, é preciso VERIFICAR a assinatura e as claims (veja Q72).`,
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Nada sensível no payload",
        texto:
          "Todo mundo que tocar no token lê o payload: o navegador, o cliente, proxies, ferramentas de depuração e os **logs**. Não ponha CPF, senha, dados de saúde ou segredos de negócio; ponha identificadores e o mínimo necessário para autorizar. O JWT também é um token ao portador, então trate-o como credencial: HTTPS, tempo de vida curto e cuidado ao guardá-lo (veja Q80). Se for inevitável carregar dado confidencial, use JWE (veja Q70) ou um token opaco (veja Q74).",
      },
    ],
    armadilhas: [
      "Achar que o payload é secreto porque “parece embaralhado”: base64url é só codificação, e qualquer um decodifica.",
      "Usar uma função de decodificar (`decodeJwt`, `jwt.decode`, `atob`) e confiar no resultado sem verificar assinatura, emissor e destinatário.",
      "Tratar `exp`, `nbf` e `iat` como milissegundos (como em `Date.now()`) em vez de segundos desde 1970, o que faz tokens parecerem válidos por séculos ou já expirados.",
      "Supor que `aud` é sempre um texto: pode ser uma lista, e a conferência precisa tratar os dois casos.",
    ],
    autoteste: [
      {
        pergunta: "O payload de um JWT é criptografado?",
        resposta:
          "Não. É JSON em base64url, legível por qualquer pessoa que tenha o token. A assinatura garante integridade e origem, não sigilo; para sigilo existe o JWE.",
      },
      {
        pergunta: "O que acontece se alguém altera o payload de um JWT assinado?",
        resposta:
          "A assinatura foi calculada sobre o payload original, então a verificação falha, a menos que o atacante tenha a chave do emissor. Por isso a API precisa verificar a assinatura, e não só decodificar.",
      },
    ],
  },
  en: {
    titulo: "JWT structure and claims",
    pergunta:
      "What is the structure of a JWT (header, payload, signature)? Is the payload encrypted? What are the registered claims, and what is each one for?",
    porqueEsteMetodo:
      "A JWT feels like magic until you see it is just text in three pieces. A simple analogy (an envelope with a window and a seal) fixes the central idea, “readable but tamper-evident”, and the real mechanism shows what the signature guarantees and what it does not.",
    resposta30s:
      "A signed JWT has **three parts** separated by dots: the **header** (algorithm and `kid`), the **payload** (the claims) and the **signature**, each in **base64url**. The payload is **not encrypted**: anyone who has the token reads it, and the signature only guarantees it **was not altered** and **who issued it**. The registered claims are `iss` (issuer), `sub` (subject), `aud` (audience), `exp` (expiration), `nbf` (not before), `iat` (issued at) and `jti` (unique identifier).",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Picture a letter in an envelope with a clear plastic window and a wax seal bearing the issuer’s stamp. Anyone holding the envelope reads the letter through the window, but changing a single word means breaking the seal, and nobody can remake the stamp without the issuer’s seal. The recipient checks the seal against the design they know and only then trusts what they read.",
        tecnico:
          "A signed JWT (a JWS in compact form, RFC 7515; the JWT itself is RFC 7519) is `base64url(header).base64url(payload).base64url(signature)`. Header and payload are JSON encoded in base64url, an alphabet that is safe in URLs (`-` and `_`, no `=`). The signature is computed over the first two segments, with the header’s algorithm and the issuer’s key; changing one character in either of them changes the input, and verification fails. Whoever validates needs the issuer’s verification key (see Q71 and Q73).",
        limite:
          "The window is open: **base64url is encoding, not encryption**, so nothing in there is secret. The seal proves origin and integrity, but not that the content is still true (someone’s role may have changed, see Q76), and it does not stop another person who steals the envelope from presenting it, because a JWT is a bearer token. If the content must be confidential, the format is different: JWE (see Q70).",
      },
      {
        tipo: "codigo",
        titulo: "The three parts of a token, decoded",
        legenda: "JWT",
        codigo: `// 1. header
{ "alg": "ES256", "typ": "JWT", "kid": "2026-10" }

// 2. payload (registered claims and one custom claim)
{
  "iss": "https://id.example.com",
  "sub": "usr_8f3a1c",
  "aud": "api://orders",
  "iat": 1793000000,
  "nbf": 1793000000,
  "exp": 1793000900,
  "jti": "b7d1f0aa-4c1e-4a39-9d52-3f0e8c2a11aa",
  "scope": "orders:read"
}

// 3. signature: bytes computed over "base64url(header).base64url(payload)"`,
        nota: "The three segments travel as base64url text separated by dots. `exp`, `nbf` and `iat` are seconds since 1970 (NumericDate), not milliseconds.",
      },
      {
        tipo: "tabela",
        titulo: "Registered claims (RFC 7519)",
        colunas: ["Claim", "What it is for", "Who checks it and how", "Watch out"],
        linhas: [
          [
            "`iss` (issuer)",
            "Who issued the token (usually an issuer URL)",
            "The API compares it with the issuer it configured, exact text",
            "Accepting “any issuer” lets in tokens well signed by the attacker themselves",
          ],
          [
            "`sub` (subject)",
            "Who the token is about (a user or an application), stable within the issuer",
            "The application uses it as the identifier, together with `iss`",
            "Do not use e-mail or name as a key: they can change and repeat",
          ],
          [
            "`aud` (audience)",
            "Who the token was issued for (an API); can be a string or a list",
            "The API checks that its own identifier is in `aud`",
            "Without it, a token made for another API works on this one (see Q72)",
          ],
          [
            "`exp` (expiration)",
            "The instant from which the token stops being valid",
            "The API rejects an expired token, with a small clock tolerance",
            "It is in seconds; a token without `exp` should not pass",
          ],
          [
            "`nbf` (not before)",
            "The instant before which the token is not yet valid",
            "The API rejects a token used too early, with the same tolerance",
            "Clocks out of sync cause “intermittent” rejections",
          ],
          [
            "`iat` (issued at)",
            "When the token was issued",
            "Used for maximum age, auditing and invalidating tokens issued before an event",
            "On its own it does not decide validity",
          ],
          [
            "`jti` (JWT ID)",
            "A unique identifier for the token",
            "Detects repetition, feeds revocation lists and logs",
            "It only protects if the server stores and checks the ones already seen",
          ],
        ],
        nota: "Besides the registered ones, there are claims defined by other specifications (such as `scope`, `email` or `nonce`) and private claims of your application; the meaning of each comes from the specification or contract that defines it. The header carries `alg`, `kid` and `typ`.",
      },
      {
        tipo: "codigo",
        titulo: "Decoding is not verifying",
        legenda: "TypeScript",
        codigo: `// Anyone, with no key at all, reads the payload:
const [, payloadB64] = token.split(".");
const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
console.log(payload.sub, payload.exp);

// This is DECODING: it proves nothing, and anyone can also build a token like this.
// To trust it, you must VERIFY the signature and the claims (see Q72).`,
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Nothing sensitive in the payload",
        texto:
          "Everyone who touches the token reads the payload: the browser, the client, proxies, debugging tools and the **logs**. Do not put national IDs, passwords, health data or business secrets in it; put identifiers and the minimum needed to authorize. A JWT is also a bearer token, so treat it as a credential: HTTPS, short lifetime and care where you store it (see Q80). If confidential data must be carried, use JWE (see Q70) or an opaque token (see Q74).",
      },
    ],
    armadilhas: [
      "Believing the payload is secret because it “looks scrambled”: base64url is just encoding, and anyone can decode it.",
      "Using a decode function (`decodeJwt`, `jwt.decode`, `atob`) and trusting the result without verifying signature, issuer and audience.",
      "Treating `exp`, `nbf` and `iat` as milliseconds (as in `Date.now()`) instead of seconds since 1970, which makes tokens look valid for centuries or already expired.",
      "Assuming `aud` is always a string: it can be a list, and the check must handle both cases.",
    ],
    autoteste: [
      {
        pergunta: "Is the payload of a JWT encrypted?",
        resposta:
          "No. It is JSON in base64url, readable by anyone who has the token. The signature guarantees integrity and origin, not secrecy; for secrecy there is JWE.",
      },
      {
        pergunta: "What happens if someone changes the payload of a signed JWT?",
        resposta:
          "The signature was computed over the original payload, so verification fails, unless the attacker has the issuer’s key. That is why the API must verify the signature, not just decode.",
      },
    ],
  },
};
