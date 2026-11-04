import type { Pergunta } from "../../tipos";

// R48 · Segurança entre microsserviços
export const r48: Pergunta = {
  numero: 148,
  modulo: "roadmap-avancado",
  metodo: "threat",
  pt: {
    titulo: "Segurança entre microsserviços",
    pergunta: "Como você protegeria a comunicação entre serviços em uma arquitetura de microsserviços?",
    porqueEsteMetodo:
      "Cada medida de segurança entre serviços responde a uma ameaça específica. O formato ameaça → defesa evita a lista decorada e mostra o que cada controle impede.",
    resposta30s:
      "Parta do princípio de que **a rede interna não é confiável** (zero trust): **TLS/mTLS** em todo tráfego interno, **identidade por serviço** (certificados de curta duração, SPIFFE/SPIRE), **autorização serviço a serviço** com privilégio mínimo, **segmentação de rede** com um **API gateway** como única entrada, **segredos em cofre** com rotação e **logs e tracing** para visibilidade.",
    blocos: [
      {
        tipo: "pares",
        rotuloOrigem: "Ameaça",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem: "Interceptação ou adulteração entre serviços (man-in-the-middle)",
            destino:
              "**TLS** em todo tráfego interno e **mTLS**, para os dois lados provarem a identidade (um service mesh como Istio ou Linkerd automatiza isso).",
          },
          {
            origem: "Um serviço falso se passando por outro",
            destino:
              "Identidade de carga de trabalho (certificados de curta duração, SPIFFE/SPIRE) e validação do chamador.",
          },
          {
            origem: "Chamadas não autorizadas (um serviço comprometido alcança tudo)",
            destino:
              "**Autorização** serviço a serviço (políticas), tokens com escopo mínimo (OAuth client credentials, JWT de serviço) e **privilégio mínimo**.",
          },
          {
            origem: "Tráfego público alcançando serviços internos",
            destino:
              "Rede privada, **segmentação** (VPC, sub-redes, NetworkPolicies) e API gateway como única entrada.",
          },
          {
            origem: "Segredos de serviço expostos",
            destino: "Cofre de segredos, rotação, nada em código ou imagens.",
          },
          {
            origem: "Movimentação lateral depois de uma invasão",
            destino:
              "**Zero trust**: não confiar só por estar dentro da rede; limites por serviço; menos portas abertas.",
          },
          {
            origem: "Falta de visibilidade",
            destino: "Logs de acesso, tracing com correlation ID e alertas para padrões anômalos.",
          },
        ],
      },
    ],
    armadilhas: [
      "Achar que a rede interna é confiável.",
      "Token de serviço com acesso total.",
      "TLS sem validar os certificados.",
      "Segredos compartilhados e nunca rotacionados.",
    ],
    autoteste: [
      {
        pergunta: "O que o mTLS acrescenta ao TLS comum?",
        resposta: "Os dois lados apresentam certificados, então servidor e cliente provam sua identidade.",
      },
      {
        pergunta: "O que é zero trust?",
        resposta:
          "Não confiar numa chamada só porque ela vem da rede interna: autenticar e autorizar cada requisição, com privilégio mínimo.",
      },
    ],
  },
  en: {
    titulo: "Securing inter-service communication",
    pergunta: "How would you secure inter-service communication in a microservices architecture?",
    porqueEsteMetodo:
      "Each security measure between services answers a specific threat. The threat → defense format avoids the memorized list and shows what each control prevents.",
    resposta30s:
      "Assume **the internal network is not trustworthy** (zero trust): **TLS/mTLS** on all internal traffic, **per-service identity** (short-lived certificates, SPIFFE/SPIRE), **service-to-service authorization** with least privilege, **network segmentation** with an **API gateway** as the only entry, **secrets in a vault** with rotation and **logs and tracing** for visibility.",
    blocos: [
      {
        tipo: "pares",
        rotuloOrigem: "Threat",
        rotuloDestino: "Defense",
        pares: [
          {
            origem: "Interception or tampering between services (man-in-the-middle)",
            destino:
              "**TLS** on all internal traffic and **mTLS**, so both sides prove identity (a service mesh such as Istio or Linkerd automates this).",
          },
          {
            origem: "A fake service posing as another",
            destino: "Workload identity (short-lived certificates, SPIFFE/SPIRE) and caller validation.",
          },
          {
            origem: "Unauthorized calls (one compromised service reaches everything)",
            destino:
              "Service-to-service **authorization** (policies), minimal-scope tokens (OAuth client credentials, service JWT) and **least privilege**.",
          },
          {
            origem: "Public traffic reaching internal services",
            destino:
              "Private network, **segmentation** (VPC, subnets, NetworkPolicies) and an API gateway as the only entry.",
          },
          {
            origem: "Exposed service secrets",
            destino: "A secrets vault, rotation, nothing in code or images.",
          },
          {
            origem: "Lateral movement after a breach",
            destino:
              "**Zero trust**: do not trust something just for being inside the network; per-service limits; fewer open ports.",
          },
          {
            origem: "Lack of visibility",
            destino: "Access logs, tracing with a correlation ID and alerts for anomalous patterns.",
          },
        ],
      },
    ],
    armadilhas: [
      "Believing the internal network is trustworthy.",
      "A service token with full access.",
      "TLS without validating certificates.",
      "Shared secrets never rotated.",
    ],
    autoteste: [
      {
        pergunta: "What does mTLS add to plain TLS?",
        resposta: "Both sides present certificates, so server and client prove their identity.",
      },
      {
        pergunta: "What is zero trust?",
        resposta:
          "Not trusting a call just because it comes from the internal network: authenticate and authorize every request, with least privilege.",
      },
    ],
  },
};
