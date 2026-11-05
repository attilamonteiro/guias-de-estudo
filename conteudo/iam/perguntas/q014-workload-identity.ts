import type { Pergunta } from "../../tipos";

// Q14 · Workload identity
export const q014: Pergunta = {
  numero: 14,
  modulo: "fundamentos",
  metodo: "feynman",
  pt: {
    titulo: "Workload identity",
    pergunta:
      "O que é identidade de carga de trabalho (workload identity) e por que serviços não devem usar credenciais humanas ou segredos fixos? Como um serviço prova quem é?",
    porqueEsteMetodo:
      "Identidade de serviço é abstrata até virar uma cena comum: a empresa prestadora na portaria de um prédio. Com a imagem na mão, o mecanismo real (identidade atribuída pela plataforma, prova efêmera, troca por token) fica fácil de enxergar, e dá para marcar onde a imagem deixa de valer.",
    resposta30s:
      "**Workload identity** é uma identidade própria do software (aplicação, contêiner, função, job de CI/CD), atribuída pela plataforma onde ele roda e separada de qualquer pessoa. O serviço prova quem é com uma **credencial efêmera e verificável** (um token OIDC assinado pela plataforma, um certificado de curta duração) que o provedor de identidade **troca por um access token** limitado. Assim não há **senha humana** nem **segredo fixo** para vazar, e o acesso segue o **menor privilégio** com rotação automática.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense na portaria de um prédio comercial. Uma empresa de manutenção chega para consertar o ar-condicionado. Ela não usa o crachá de um funcionário e ninguém lhe entrega a chave mestra. A recepção confere quem a chamou e emite um crachá de prestador com o nome do serviço, válido só por hoje e só para o andar do equipamento. No dia seguinte o crachá expira sozinho e, se o serviço voltar, ganha outro.",
        tecnico:
          "**Workload identity** é uma identidade do software (aplicação, contêiner, função, job de CI/CD, VM), separada de qualquer pessoa. A plataforma onde o código roda (nuvem, Kubernetes, o ambiente de CI) já sabe o que está executando e atribui essa identidade ao workload. Para provar quem é, o serviço apresenta uma **credencial efêmera e verificável**: um token assinado pela plataforma (OIDC), um certificado de curta duração (por exemplo, um SVID do SPIFFE) ou um token que a plataforma entrega só àquele recurso. O provedor de identidade valida a prova e a **troca por um access token** de curta duração, com o escopo mínimo. Não há senha para guardar, copiar ou lembrar de rotacionar.",
        limite:
          "O prestador é uma pessoa que se apresenta; o workload é código, e código se copia. Várias réplicas compartilham a mesma identidade (o crachá não diz qual réplica é), e quem consegue executar código com aquela identidade, por exemplo um pod com aquela service account, herda tudo o que ela pode. Em CI/CD, a condição que liga a identidade ao pipeline (repositório, branch, ambiente) precisa ser estrita: se for frouxa, qualquer repositório da organização consegue o mesmo acesso. A identidade prova **onde** o código roda, não que o código é bom.",
      },
      {
        tipo: "fluxo",
        titulo: "Como o serviço prova quem é",
        etapas: [
          "A plataforma inicia o workload (pod, função, job) e o associa a uma identidade: uma service account, uma managed identity, um papel de execução",
          "A plataforma entrega ao workload uma prova de curta duração: um token assinado (JWT/OIDC) montado no contêiner ou um endpoint local que só aquele recurso alcança; nada fica na imagem nem no repositório",
          "O workload apresenta a prova ao provedor de identidade, que a valida: assinatura (pelas chaves públicas publicadas do emissor), emissor (`iss`), público (`aud`) e assunto (`sub`)",
          "O provedor troca a prova por um access token de curta duração, limitado ao que essa identidade pode fazer",
          "O workload chama a API com o access token; a API confere `aud`, escopo e quem chamou. Quando o token expira, o ciclo recomeça sozinho",
        ],
      },
      {
        tipo: "tabela",
        titulo: "A prova muda conforme o ambiente",
        colunas: ["Ambiente", "Identidade do workload", "Prova de quem é", "Cuidado"],
        linhas: [
          [
            "Serviço a serviço",
            "Identidade de serviço (SPIFFE ID, service account)",
            "mTLS com certificado de curta duração, ou token OAuth obtido por client credentials",
            "Autorize também no destino: estar na rede interna não é identidade; valide quem chamou e o que ele pode fazer",
          ],
          [
            "Contêineres e Kubernetes",
            "Uma service account por aplicação (não a padrão); um pod, uma identidade",
            "Token projetado, de curta duração e com público definido, assinado pelo cluster; OIDC para federar com a nuvem",
            "Segredos fora da imagem; nenhuma conta compartilhada entre aplicações; controle quem pode criar pods com aquela conta",
          ],
          [
            "Serverless",
            "Papel de execução ou managed identity por função",
            "Credenciais temporárias entregues pela plataforma ao ambiente da função",
            "Permissões por função, não um papel único para todas; sem chaves de longa duração em variáveis de ambiente; autorize também quem pode invocar a função",
          ],
          [
            "CI/CD e outras nuvens",
            "Identidade do job (repositório, branch, ambiente)",
            "Token OIDC do pipeline, trocado por credencial temporária no destino (federação)",
            "Restrinja o `sub` e as condições ao repositório e ao ambiente exatos",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A prova da plataforma e a troca por um access token",
        legenda: "HTTP",
        codigo: `# 1. Claims do token que a plataforma entrega ao workload
{
  "iss": "https://oidc.cluster.exemplo.com",
  "sub": "system:serviceaccount:pagamentos:api-pagamentos",
  "aud": "troca-de-tokens",
  "exp": 1790000600
}

# 2. O workload troca esse token por um access token
POST /token HTTP/1.1
Host: idp.exemplo.com
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&scope=pagamentos.ler
&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
&client_assertion=<token acima, assinado pela plataforma>`,
        nota: "O corpo do POST é uma única linha, quebrada aqui só para leitura. O provedor é configurado para confiar naquele emissor e naquele `sub`; ninguém copia segredo para dentro do serviço.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Por que não credencial humana nem segredo fixo",
        texto:
          "**Credencial humana**: pertence a uma pessoa, que muda de função e sai (o serviço quebra ou, pior, segue rodando com uma conta que ninguém revisa); carrega os privilégios amplos da pessoa; depende de interação (MFA, navegador) que código não tem; e mistura nos logs o que a pessoa e o código fizeram. **Segredo fixo**: vale até alguém notar, é copiado para repositórios, imagens, logs e máquinas de desenvolvimento, quase nunca é rotacionado, e quem o copia é indistinguível do serviço. A identidade de carga de trabalho resolve os dois: é **do serviço**, **de curta duração**, **verificável** e **entregue pela plataforma**, o que dá **menor privilégio**, **rotação automática** e **auditoria por serviço** (veja Q15 e Q16).",
      },
    ],
    armadilhas: [
      "Reutilizar a conta de uma pessoa (ou um usuário de nuvem com chave de acesso) para o serviço: some a auditoria por serviço e o serviço quebra quando a pessoa sai.",
      "Usar a mesma identidade, ou a service account padrão, para várias aplicações: todas herdam o mesmo poder e ninguém sabe quem fez o quê.",
      "Federar CI/CD ou clusters com condições frouxas (qualquer repositório, qualquer namespace): a identidade deixa de significar algo.",
      "Achar que identidade gerenciada dispensa autorização: ela prova quem é, mas as permissões continuam precisando de menor privilégio e de revisão.",
    ],
    autoteste: [
      {
        pergunta: "O que é workload identity e como o serviço prova quem é?",
        resposta:
          "É uma identidade própria do software, atribuída pela plataforma. O serviço prova quem é com uma credencial efêmera e verificável (token OIDC, certificado de curta duração), trocada por um access token limitado; não há segredo fixo guardado.",
      },
      {
        pergunta: "Por que um token de curta duração é melhor que uma chave de API fixa?",
        resposta:
          "Se vazar, o dano acaba quando o token expira; a chave fixa vale até alguém notar e rotacionar. Além disso, o token é emitido por serviço, o que permite auditar e restringir cada um.",
      },
    ],
  },
  en: {
    titulo: "Workload identity",
    pergunta:
      "What is workload identity, and why should services not use human credentials or static secrets? How does a service prove who it is?",
    porqueEsteMetodo:
      "Service identity is abstract until it becomes an everyday scene: a contractor at a building’s front desk. With the picture in hand, the real mechanism (platform-assigned identity, ephemeral proof, exchange for a token) is easy to see, and you can mark where the picture stops holding.",
    resposta30s:
      "**Workload identity** is an identity of the software itself (application, container, function, CI/CD job), assigned by the platform it runs on and separate from any person. The service proves who it is with an **ephemeral, verifiable credential** (an OIDC token signed by the platform, a short-lived certificate) that the identity provider **exchanges for a limited access token**. So there is no **human password** and no **static secret** to leak, and access follows **least privilege** with automatic rotation.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of the front desk of an office building. A maintenance company arrives to fix the air conditioning. It does not use an employee’s badge and nobody hands it a master key. Reception checks who called them and issues a contractor badge with the name of the job, valid only today and only for the floor with the equipment. The next day the badge expires on its own and, if the job comes back, it gets a new one.",
        tecnico:
          "**Workload identity** is an identity of the software (application, container, function, CI/CD job, VM), separate from any person. The platform where the code runs (cloud, Kubernetes, the CI environment) already knows what is running and assigns that identity to the workload. To prove who it is, the service presents an **ephemeral, verifiable credential**: a token signed by the platform (OIDC), a short-lived certificate (for example, a SPIFFE SVID) or a token the platform hands only to that resource. The identity provider validates the proof and **exchanges it for a short-lived access token** with minimal scope. There is no password to store, copy or remember to rotate.",
        limite:
          "The contractor is a person presenting themselves; the workload is code, and code can be copied. Several replicas share the same identity (the badge does not say which replica it is), and anyone who can run code under that identity, for example a pod with that service account, inherits everything it can do. In CI/CD, the condition that ties the identity to the pipeline (repository, branch, environment) must be strict: if it is loose, any repository in the organization gets the same access. The identity proves **where** the code runs, not that the code is good.",
      },
      {
        tipo: "fluxo",
        titulo: "How the service proves who it is",
        etapas: [
          "The platform starts the workload (pod, function, job) and ties it to an identity: a service account, a managed identity, an execution role",
          "The platform hands the workload a short-lived proof: a signed token (JWT/OIDC) mounted in the container or a local endpoint only that resource can reach; nothing sits in the image or the repository",
          "The workload presents the proof to the identity provider, which validates it: signature (with the issuer’s published public keys), issuer (`iss`), audience (`aud`) and subject (`sub`)",
          "The provider exchanges the proof for a short-lived access token, limited to what that identity may do",
          "The workload calls the API with the access token; the API checks `aud`, scope and who called. When the token expires, the cycle restarts on its own",
        ],
      },
      {
        tipo: "tabela",
        titulo: "The proof changes with the environment",
        colunas: ["Environment", "Workload identity", "Proof of who it is", "Watch out for"],
        linhas: [
          [
            "Service to service",
            "Service identity (SPIFFE ID, service account)",
            "mTLS with a short-lived certificate, or an OAuth token obtained by client credentials",
            "Authorize at the destination too: being on the internal network is not identity; check who called and what they may do",
          ],
          [
            "Containers and Kubernetes",
            "One service account per application (not the default one); one pod, one identity",
            "A projected token, short-lived and with a defined audience, signed by the cluster; OIDC to federate with the cloud",
            "Secrets out of the image; no account shared between applications; control who can create pods with that account",
          ],
          [
            "Serverless",
            "Execution role or managed identity per function",
            "Temporary credentials delivered by the platform to the function’s environment",
            "Permissions per function, not one role for all; no long-lived keys in environment variables; authorize who may invoke the function too",
          ],
          [
            "CI/CD and other clouds",
            "The job’s identity (repository, branch, environment)",
            "The pipeline’s OIDC token, exchanged for a temporary credential at the destination (federation)",
            "Restrict the `sub` and conditions to the exact repository and environment",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The platform’s proof and the exchange for an access token",
        legenda: "HTTP",
        codigo: `# 1. Claims of the token the platform hands to the workload
{
  "iss": "https://oidc.cluster.example.com",
  "sub": "system:serviceaccount:payments:payments-api",
  "aud": "token-exchange",
  "exp": 1790000600
}

# 2. The workload exchanges that token for an access token
POST /token HTTP/1.1
Host: idp.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&scope=payments.read
&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
&client_assertion=<token above, signed by the platform>`,
        nota: "The POST body is a single line, wrapped here only for reading. The provider is configured to trust that issuer and that `sub`; nobody copies a secret into the service.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Why not human credentials or static secrets",
        texto:
          "**Human credential**: it belongs to a person, who changes roles and leaves (the service breaks or, worse, keeps running under an account nobody reviews); it carries the person’s broad privileges; it depends on interaction (MFA, a browser) that code does not have; and it mixes what the person and the code did in the logs. **Static secret**: it stays valid until someone notices, gets copied into repositories, images, logs and developer machines, is almost never rotated, and whoever copies it is indistinguishable from the service. Workload identity solves both: it is **the service’s own**, **short-lived**, **verifiable** and **delivered by the platform**, which gives **least privilege**, **automatic rotation** and **per-service auditing** (see Q15 and Q16).",
      },
    ],
    armadilhas: [
      "Reusing a person’s account (or a cloud user with an access key) for the service: per-service auditing disappears and the service breaks when the person leaves.",
      "Using the same identity, or the default service account, for several applications: all inherit the same power and nobody knows who did what.",
      "Federating CI/CD or clusters with loose conditions (any repository, any namespace): the identity stops meaning anything.",
      "Assuming managed identity makes authorization unnecessary: it proves who the caller is, but permissions still need least privilege and review.",
    ],
    autoteste: [
      {
        pergunta: "What is workload identity and how does a service prove who it is?",
        resposta:
          "It is an identity of the software itself, assigned by the platform. The service proves who it is with an ephemeral, verifiable credential (an OIDC token, a short-lived certificate), exchanged for a limited access token; no static secret is stored.",
      },
      {
        pergunta: "Why is a short-lived token better than a static API key?",
        resposta:
          "If it leaks, the damage ends when the token expires; the static key stays valid until someone notices and rotates it. Also, the token is issued per service, which makes it possible to audit and restrict each one.",
      },
    ],
  },
};
