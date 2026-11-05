import type { Pergunta } from "../../tipos";

// Q63 · Validar uma resposta SAML
export const q063: Pergunta = {
  numero: 63,
  modulo: "saml",
  metodo: "playbook",
  pt: {
    titulo: "Validar uma resposta SAML",
    pergunta:
      "Que passos um SP deve seguir para validar uma resposta SAML antes de criar a sessão? Descreva a ordem e o que cada checagem garante.",
    porqueEsteMetodo:
      "Validar uma resposta SAML é uma lista de verificações em que a ordem importa e cada uma garante uma coisa diferente. Um playbook com o critério de cada passo evita tanto o esquecimento quanto o erro de ler dados antes de provar a origem.",
    resposta30s:
      "Receba a resposta só no **ACS**, por POST e HTTPS, com um parser XML seguro; valide o **esquema**; **verifique a assinatura** com o certificado do IdP vindo do metadata; confira `Status`, `Issuer`, `Destination` e `InResponseTo`; depois, na assertion, `Audience`, a janela de validade e o `SubjectConfirmationData`. Bloqueie **replay** pelo `ID` e **só então** consuma `NameID` e atributos e crie a sessão. Use uma biblioteca madura em vez de escrever o parser.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: da resposta recebida à sessão",
        passos: [
          {
            titulo: "Receba com segurança",
            texto:
              "Aceite a resposta só no ACS, por `POST` sobre HTTPS, com limite de tamanho. Decodifique o base64 e use um parser XML com DTD e entidades externas desligados (evita XXE e bombas de expansão). **Garante:** que o documento pode ser tratado sem atacar o próprio parser.",
          },
          {
            titulo: "Valide o esquema",
            texto:
              "Confira a estrutura contra o esquema SAML (XSD). **Garante:** que o documento tem a forma esperada (elementos obrigatórios, tipos), o que reduz o espaço para construções estranhas.",
          },
          {
            titulo: "Verifique a assinatura",
            texto:
              "Use o certificado do IdP **do metadata** (nunca o `KeyInfo` da mensagem), algoritmos de uma lista permitida e o elemento que você vai consumir (veja Q61). **Garante:** autenticidade e integridade. A partir daqui, e só daqui, o conteúdo assinado merece confiança.",
          },
          {
            titulo: "Confira `Status`, `Issuer`, `Destination` e `InResponseTo`",
            texto:
              "`Status` de sucesso; `Issuer` igual ao `entityID` do IdP configurado; `Destination` igual ao seu ACS; `InResponseTo` igual a um pedido pendente, que é consumido na hora. **Garante:** que a resposta é desse IdP, para este endpoint e para um pedido que você fez. No fluxo iniciado pelo IdP, a ausência de `InResponseTo` só passa se você habilitou esse fluxo (veja Q57).",
          },
          {
            titulo: "Confira a assertion",
            texto:
              "`Audience` igual ao seu `entityID`; `NotBefore` e `NotOnOrAfter` com tolerância de relógio pequena; `SubjectConfirmation` `bearer` com `Recipient` igual ao ACS, `NotOnOrAfter` e `InResponseTo` (veja Q62). **Garante:** que a assertion foi feita para você, agora, e entregue ao lugar certo.",
          },
          {
            titulo: "Bloqueie replay",
            texto:
              "Registre o `ID` da assertion até expirar (mais a tolerância), em armazenamento compartilhado entre as instâncias, e rejeite repetições. **Garante:** uso único dentro da janela de validade.",
          },
          {
            titulo: "Só então consuma",
            texto:
              "Leia `NameID` e atributos, mapeie para conta e papéis (veja Q60), confira o `AuthnContextClassRef` e a idade da autenticação, crie a sessão **com identificador novo** e resolva o `RelayState` de forma segura. **Garante:** que nada da assertion influenciou o sistema antes de ser provado.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Conferências semânticas, depois da assinatura verificada",
        legenda: "TypeScript",
        codigo: `interface Assertion {
  id: string; issuer: string; audiences: string[]; recipient: string;
  notBefore?: number; notOnOrAfter: number; inResponseTo?: string; // ms, assinatura já verificada
}
interface Config {
  idp: string; sp: string; acs: string; skewMs: number;
  pedidos: Set<string>; // IDs de AuthnRequest pendentes
  replay: { primeiraVez(id: string, ateMs: number): boolean };
}

export function conferir(a: Assertion, c: Config, agora = Date.now()): void {
  if (a.issuer !== c.idp) throw new Error("issuer inesperado");
  if (!a.audiences.includes(c.sp)) throw new Error("audience não é este SP");
  if (a.recipient !== c.acs) throw new Error("recipient não é o ACS");
  if (a.notBefore && agora + c.skewMs < a.notBefore) throw new Error("ainda não vale");
  if (agora - c.skewMs >= a.notOnOrAfter) throw new Error("expirada");
  if (!a.inResponseTo || !c.pedidos.delete(a.inResponseTo)) throw new Error("InResponseTo desconhecido");
  if (!c.replay.primeiraVez(a.id, a.notOnOrAfter + c.skewMs)) throw new Error("assertion repetida");
}`,
        nota: "A biblioteca já cuidou do XML, do esquema e da assinatura; `Status` e `Destination` foram conferidos na `Response`. A função mostra as conferências que continuam sendo do SP. Muitas bibliotecas as oferecem como opções: confirme que cada uma está ligada.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Use uma biblioteca madura, não um parser caseiro",
        texto:
          "Validar SAML envolve canonicalização de XML, referências por `ID`, namespaces e assinatura sobre o elemento certo, e um deslize vira signature wrapping ou XXE. Use uma biblioteca mantida (por exemplo, `@node-saml/node-saml` ou `samlify` no Node.js; Sustainsys.Saml2 ou ITfoxtec.Identity.Saml2 no .NET; OpenSAML no Java) ou um IdP/broker que fale SAML por você, e **mantenha-a atualizada**: bibliotecas conhecidas já tiveram falhas de validação de assinatura. Confira, na documentação, que as opções de segurança estão **ligadas** (exigir assertion assinada, `Audience`, tolerância de relógio, validação de `InResponseTo` e cache de replay), porque os padrões variam entre produtos.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A ordem importa, e a falha nega o acesso",
        texto:
          "Valide antes de usar: uma biblioteca que mapeia atributos antes de verificar a assinatura, ou que devolve o objeto mesmo quando a verificação falha, é uma falha de segurança. Diante de qualquer erro, **negue o acesso**, registre o motivo (sem gravar a assertion inteira, que contém dados pessoais e ainda pode estar válida) e mostre ao usuário uma mensagem genérica.",
      },
    ],
    armadilhas: [
      "Ler o `NameID` ou aplicar atributos antes de verificar a assinatura e as condições.",
      "Validar a assinatura mas não conferir `Audience`, `Recipient` e `InResponseTo`: a assinatura só prova que o IdP emitiu, não que a assertion foi feita para este SP.",
      "Cache de replay em memória de cada instância, ou sem expiração: o replay passa em outra instância, ou a memória cresce sem limite.",
      "Registrar a `Response` inteira quando há erro: atributos pessoais e a própria assertion acabam nos logs.",
    ],
    autoteste: [
      {
        pergunta: "Por que a verificação da assinatura vem antes de ler os atributos?",
        resposta:
          "Porque, sem ela, o conteúdo é só texto enviado por quem quer que seja. Só depois de provar a origem e a integridade o SP pode confiar em `NameID` e atributos.",
      },
      {
        pergunta: "Que conferências a assinatura não faz?",
        resposta:
          "Não confere que a assertion é para este SP (`Audience`), este endpoint (`Destination` e `Recipient`), este pedido (`InResponseTo`), este momento (janela de validade) e que não é repetida (replay por `ID`). Essas conferências são do SP.",
      },
    ],
  },
  en: {
    titulo: "Validating a SAML response",
    pergunta:
      "What steps must an SP follow to validate a SAML response before creating a session? Describe the order and what each check guarantees.",
    porqueEsteMetodo:
      "Validating a SAML response is a list of checks where order matters and each one guarantees something different. A playbook with the criterion of each step avoids both forgetting a check and the mistake of reading data before proving where it came from.",
    resposta30s:
      "Receive the response only at the **ACS**, by POST over HTTPS, with a safe XML parser; validate the **schema**; **verify the signature** with the IdP certificate from the metadata; check `Status`, `Issuer`, `Destination` and `InResponseTo`; then, on the assertion, `Audience`, the validity window and `SubjectConfirmationData`. Block **replay** by `ID` and **only then** consume `NameID` and attributes and create the session. Use a mature library instead of writing the parser.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from the received response to the session",
        passos: [
          {
            titulo: "Receive it safely",
            texto:
              "Accept the response only at the ACS, by `POST` over HTTPS, with a size limit. Decode the base64 and use an XML parser with DTDs and external entities disabled (prevents XXE and expansion bombs). **Guarantees:** that the document can be handled without attacking the parser itself.",
          },
          {
            titulo: "Validate the schema",
            texto:
              "Check the structure against the SAML schema (XSD). **Guarantees:** that the document has the expected shape (required elements, types), which narrows the room for odd constructions.",
          },
          {
            titulo: "Verify the signature",
            texto:
              "Use the IdP certificate **from the metadata** (never the message’s `KeyInfo`), algorithms from an allowlist and the element you will consume (see Q61). **Guarantees:** authenticity and integrity. From here on, and only from here on, the signed content deserves trust.",
          },
          {
            titulo: "Check `Status`, `Issuer`, `Destination` and `InResponseTo`",
            texto:
              "A success `Status`; an `Issuer` equal to the configured IdP’s `entityID`; a `Destination` equal to your ACS; an `InResponseTo` equal to a pending request, which is consumed on the spot. **Guarantees:** that the response is from that IdP, for this endpoint and for a request you made. In the IdP-initiated flow, a missing `InResponseTo` is only accepted if you enabled that flow (see Q57).",
          },
          {
            titulo: "Check the assertion",
            texto:
              "`Audience` equal to your `entityID`; `NotBefore` and `NotOnOrAfter` with a small clock tolerance; a `bearer` `SubjectConfirmation` with `Recipient` equal to the ACS, `NotOnOrAfter` and `InResponseTo` (see Q62). **Guarantees:** that the assertion was made for you, now, and delivered to the right place.",
          },
          {
            titulo: "Block replay",
            texto:
              "Record the assertion `ID` until it expires (plus the tolerance), in storage shared across instances, and reject repeats. **Guarantees:** single use within the validity window.",
          },
          {
            titulo: "Only then consume",
            texto:
              "Read `NameID` and attributes, map them to an account and roles (see Q60), check the `AuthnContextClassRef` and the age of the authentication, create the session **with a new identifier** and resolve the `RelayState` safely. **Guarantees:** that nothing from the assertion influenced the system before being proven.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Semantic checks, after the signature is verified",
        legenda: "TypeScript",
        codigo: `interface Assertion {
  id: string; issuer: string; audiences: string[]; recipient: string;
  notBefore?: number; notOnOrAfter: number; inResponseTo?: string; // ms, signature already verified
}
interface Config {
  idp: string; sp: string; acs: string; skewMs: number;
  pending: Set<string>; // pending AuthnRequest IDs
  replay: { firstTime(id: string, untilMs: number): boolean };
}

export function check(a: Assertion, c: Config, now = Date.now()): void {
  if (a.issuer !== c.idp) throw new Error("unexpected issuer");
  if (!a.audiences.includes(c.sp)) throw new Error("audience is not this SP");
  if (a.recipient !== c.acs) throw new Error("recipient is not the ACS");
  if (a.notBefore && now + c.skewMs < a.notBefore) throw new Error("not valid yet");
  if (now - c.skewMs >= a.notOnOrAfter) throw new Error("expired");
  if (!a.inResponseTo || !c.pending.delete(a.inResponseTo)) throw new Error("unknown InResponseTo");
  if (!c.replay.firstTime(a.id, a.notOnOrAfter + c.skewMs)) throw new Error("repeated assertion");
}`,
        nota: "The library already took care of the XML, the schema and the signature; `Status` and `Destination` were checked on the `Response`. The function shows the checks that remain the SP’s job. Many libraries offer them as options: confirm that each one is on.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Use a mature library, not a home-grown parser",
        texto:
          "Validating SAML involves XML canonicalization, references by `ID`, namespaces and a signature over the right element, and one slip becomes signature wrapping or XXE. Use a maintained library (for example, `@node-saml/node-saml` or `samlify` on Node.js; Sustainsys.Saml2 or ITfoxtec.Identity.Saml2 on .NET; OpenSAML on Java) or an IdP/broker that speaks SAML for you, and **keep it up to date**: well-known libraries have had signature validation flaws. Check in the documentation that the security options are **on** (require a signed assertion, `Audience`, clock tolerance, `InResponseTo` validation and a replay cache), because defaults vary between products.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Order matters, and failure denies access",
        texto:
          "Validate before using: a library that maps attributes before verifying the signature, or that returns the object even when verification fails, is a security flaw. On any error, **deny access**, log the reason (without writing the whole assertion, which holds personal data and may still be valid) and show the user a generic message.",
      },
    ],
    armadilhas: [
      "Reading the `NameID` or applying attributes before verifying the signature and conditions.",
      "Validating the signature but not checking `Audience`, `Recipient` and `InResponseTo`: the signature only proves the IdP issued it, not that the assertion was made for this SP.",
      "A replay cache in each instance’s memory, or with no expiry: replay passes on another instance, or memory grows without bound.",
      "Logging the whole `Response` on error: personal attributes and the assertion itself end up in the logs.",
    ],
    autoteste: [
      {
        pergunta: "Why does signature verification come before reading the attributes?",
        resposta:
          "Because, without it, the content is just text sent by whoever. Only after proving origin and integrity can the SP trust `NameID` and attributes.",
      },
      {
        pergunta: "Which checks does the signature not perform?",
        resposta:
          "It does not check that the assertion is for this SP (`Audience`), this endpoint (`Destination` and `Recipient`), this request (`InResponseTo`), this moment (validity window) and that it is not repeated (replay by `ID`). Those checks are the SP’s.",
      },
    ],
  },
};
