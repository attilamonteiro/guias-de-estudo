import type { Pergunta } from "../../tipos";

// Q16 · Segredos × identidade gerenciada
export const q016: Pergunta = {
  numero: 16,
  modulo: "fundamentos",
  metodo: "compare",
  pt: {
    titulo: "Segredos × identidade gerenciada",
    pergunta:
      "Compare segredos estáticos, cofre de segredos, managed identity e credenciais federadas para autenticar um serviço. Quando você escolhe cada um?",
    porqueEsteMetodo:
      "As quatro opções resolvem o mesmo problema (um serviço precisa provar quem é) com riscos muito diferentes. Uma matriz por critério (vazamento, rotação, auditoria, portabilidade) coloca-as lado a lado, e a regra de decisão mostra qual escolher em cada ambiente.",
    resposta30s:
      "**Segredo estático** é o mais frágil: vale para sempre e vaza em repositórios, logs e imagens. O **cofre** o protege e audita, mas o segredo continua existindo. A **managed identity** elimina o segredo dentro da nuvem, e a **credencial federada** (OIDC do CI/CD, por exemplo) faz o mesmo fora dela. A regra: se o destino aceita identidade, use **identidade**; se só aceita segredo, use **cofre com rotação**; segredo solto, só em desenvolvimento local.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Quatro formas de um serviço se autenticar",
        colunas: ["Opção", "Risco de vazamento", "Rotação", "Auditoria", "Portabilidade", "Escolha quando"],
        linhas: [
          [
            "Segredo estático (senha ou chave em repositório ou variável de ambiente)",
            "Alto: vai parar em git, logs, imagens, dumps e telas de depuração, e vale até alguém trocar",
            "Manual e rara; trocar exige redeploy e coordenar todas as cópias",
            "Fraca: quem tem a cópia é indistinguível do serviço",
            "Alta, pois é só texto, e por isso fácil de copiar para onde não devia",
            "Só em desenvolvimento local, com valores descartáveis, ou em sistema legado sem alternativa, com prazo para sair",
          ],
          [
            "Cofre de segredos",
            "Médio: o segredo continua existindo e vaza se o acesso ao cofre ou a aplicação vazarem, mas o acesso é controlado",
            "Possível e automatizável, com segredos dinâmicos de curta duração quando o cofre os gera",
            "Boa: cada leitura é registrada, com quem leu",
            "Média: depende do cofre; a aplicação lê dele em vez de conter o valor",
            "O destino só aceita segredo (senha de banco, API de terceiros, chave de assinatura) e a identidade ainda não o substitui",
          ],
          [
            "Managed identity",
            "Baixo: não há segredo a copiar; a plataforma entrega tokens curtos só ao recurso",
            "Automática, feita pela plataforma",
            "Boa: a identidade é do recurso e aparece nos logs",
            "Baixa: vale só dentro daquela nuvem e para serviços que aceitam essa identidade",
            "Serviço na nuvem acessando recursos da mesma nuvem (banco, armazenamento, cofre) que aceitam identidade",
          ],
          [
            "Credencial federada (OIDC do CI/CD, workload identity federation)",
            "Baixo: o token do emissor vale minutos e nada fica guardado",
            "Automática: cada execução recebe um token novo",
            "Boa: claims como repositório, branch e ambiente vão ao log",
            "Média a alta: padrão aberto (OIDC), com configuração em cada provedor",
            "Fora da nuvem de destino: CI/CD, outra nuvem, cluster ou servidores locais",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Pergunte nesta ordem. **(1)** O destino aceita identidade (token)? Dentro da mesma nuvem, **managed identity**; fora dela, **credencial federada**. **(2)** Só aceita segredo? **Cofre**, com rotação, acesso ao cofre por identidade (nunca por outro segredo) e leitura registrada. **(3)** Segredo no repositório ou em variável de ambiente fica restrito ao desenvolvimento local, com valor descartável. A meta é ter **menos segredos**, não lugares melhores para guardá-los.",
      },
      {
        tipo: "codigo",
        titulo: "A identidade abre o cofre; o cofre guarda só o que o destino ainda exige",
        legenda: "C#",
        codigo: `// A plataforma entrega a identidade: nenhum segredo no código nem na configuração
var credencial = new ManagedIdentityCredential();
var cofre = new SecretClient(new Uri("https://meu-cofre.vault.azure.net/"), credencial);

// Só o que o banco ainda exige como senha fica guardado no cofre
var senhaDoBanco = (await cofre.GetSecretAsync("senha-do-banco")).Value.Value;`,
        nota: "Os tipos vêm dos pacotes `Azure.Identity` e `Azure.Security.KeyVault.Secrets`; confira a documentação do SDK da sua versão. O mesmo desenho existe nos outros provedores.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O cofre não elimina o segredo, só o protege melhor",
        texto:
          "O cofre muda onde o segredo mora, mas o valor precisa ser lido para ser usado e passa a existir na memória e, muitas vezes, em variável de ambiente ou arquivo, de onde vaza por dump, log de erro ou inspeção do processo. E há o problema do primeiro segredo: se o acesso ao cofre usa outra senha, você só empurrou o problema. Por isso a identidade abre o cofre. Rotacionar também exige que a aplicação aceite o valor novo sem depender de reinício manual.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "No pipeline e no Zero Trust",
        texto:
          "No Zero Trust, credencial não ganha confiança por estar na rede interna: cada serviço tem identidade própria, de curta duração e verificada a cada uso. Num pipeline de DevSecOps isso significa federar o CI com a nuvem por OIDC em vez de guardar chaves como segredos do pipeline; uma identidade por ambiente, com produção só para a branch protegida e com aprovação; varredura de segredos a cada commit; nenhum segredo em log de build nem em camada de imagem; e registro de quem leu o quê. Um segredo que já passou pelo histórico do git deve ser considerado exposto e **rotacionado**, não apenas apagado.",
      },
    ],
    armadilhas: [
      "Tratar variável de ambiente como cofre: ela fica legível em dumps, logs de erro e para quem inspeciona o processo.",
      "Guardar no cofre a senha que abre o cofre: o primeiro segredo segue sem proteção; use identidade.",
      "Apagar do repositório um segredo que já foi commitado e achar que resolveu: ele continua no histórico e nos clones; rotacione.",
      "Usar managed identity com papel amplo demais (por exemplo, colaborador da assinatura inteira): o segredo some, mas o excesso de poder fica.",
    ],
    autoteste: [
      {
        pergunta: "Por que uma managed identity é melhor que um segredo no cofre quando ambos funcionam?",
        resposta:
          "Porque não existe segredo para vazar nem para rotacionar: a plataforma emite tokens curtos ao recurso. O cofre ainda guarda um valor que alguém pode ler e copiar.",
      },
      {
        pergunta: "Como um pipeline de CI acessa a nuvem sem uma chave guardada?",
        resposta:
          "Por federação: o CI emite um token OIDC por execução, com claims de repositório e branch; a nuvem é configurada para confiar nesse emissor e nessas condições e troca o token por credenciais temporárias.",
      },
    ],
  },
  en: {
    titulo: "Secrets vs managed identity",
    pergunta:
      "Compare static secrets, a secrets vault, managed identity and federated credentials for authenticating a service. When do you choose each?",
    porqueEsteMetodo:
      "The four options solve the same problem (a service must prove who it is) with very different risks. A matrix by criterion (leakage, rotation, auditing, portability) puts them side by side, and the decision rule shows which to pick in each environment.",
    resposta30s:
      "A **static secret** is the most fragile: it never expires and leaks into repositories, logs and images. A **vault** protects and audits it, but the secret still exists. **Managed identity** removes the secret inside the cloud, and a **federated credential** (CI/CD OIDC, for example) does the same outside it. The rule: if the target accepts identity, use **identity**; if it only accepts a secret, use a **vault with rotation**; a loose secret only in local development.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Four ways for a service to authenticate",
        colunas: ["Option", "Leakage risk", "Rotation", "Auditing", "Portability", "Choose when"],
        linhas: [
          [
            "Static secret (password or key in a repository or environment variable)",
            "High: it ends up in git, logs, images, dumps and debug screens, and stays valid until someone changes it",
            "Manual and rare; changing it needs a redeploy and coordinating every copy",
            "Weak: whoever holds a copy is indistinguishable from the service",
            "High, since it is just text, and therefore easy to copy where it should not go",
            "Only in local development, with throwaway values, or in a legacy system with no alternative, with an exit date",
          ],
          [
            "Secrets vault",
            "Medium: the secret still exists and leaks if vault access or the application leaks, but access is controlled",
            "Possible and automatable, with short-lived dynamic secrets when the vault generates them",
            "Good: every read is recorded, with who read it",
            "Medium: depends on the vault; the application reads from it instead of holding the value",
            "The target only accepts a secret (database password, third-party API, signing key) and identity cannot replace it yet",
          ],
          [
            "Managed identity",
            "Low: there is no secret to copy; the platform hands short tokens only to the resource",
            "Automatic, done by the platform",
            "Good: the identity belongs to the resource and shows up in the logs",
            "Low: it works only inside that cloud and for services that accept that identity",
            "A service in the cloud reaching resources in the same cloud (database, storage, vault) that accept identity",
          ],
          [
            "Federated credential (CI/CD OIDC, workload identity federation)",
            "Low: the issuer’s token lasts minutes and nothing is stored",
            "Automatic: each run gets a new token",
            "Good: claims such as repository, branch and environment go to the log",
            "Medium to high: an open standard (OIDC), configured on each provider",
            "Outside the target cloud: CI/CD, another cloud, a cluster or on-premises servers",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Ask in this order. **(1)** Does the target accept identity (a token)? Inside the same cloud, **managed identity**; outside it, a **federated credential**. **(2)** Does it only accept a secret? A **vault**, with rotation, vault access through identity (never through another secret) and reads recorded. **(3)** A secret in the repository or an environment variable is limited to local development, with a throwaway value. The goal is to have **fewer secrets**, not better places to keep them.",
      },
      {
        tipo: "codigo",
        titulo: "Identity opens the vault; the vault holds only what the target still requires",
        legenda: "C#",
        codigo: `// The platform hands over the identity: no secret in the code or the configuration
var credential = new ManagedIdentityCredential();
var vault = new SecretClient(new Uri("https://my-vault.vault.azure.net/"), credential);

// Only what the database still requires as a password stays in the vault
var databasePassword = (await vault.GetSecretAsync("database-password")).Value.Value;`,
        nota: "The types come from the `Azure.Identity` and `Azure.Security.KeyVault.Secrets` packages; check the SDK documentation for your version. The same design exists on the other providers.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A vault does not remove the secret, it only protects it better",
        texto:
          "The vault changes where the secret lives, but the value has to be read to be used and then exists in memory and, often, in an environment variable or file, from which it leaks through dumps, error logs or process inspection. And there is the first-secret problem: if vault access uses another password, you only pushed the problem along. That is why identity opens the vault. Rotation also requires the application to accept the new value without a manual restart.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "In the pipeline and in Zero Trust",
        texto:
          "In Zero Trust, a credential does not earn trust by sitting on the internal network: each service has its own identity, short-lived and verified on every use. In a DevSecOps pipeline this means federating CI with the cloud through OIDC instead of keeping keys as pipeline secrets; one identity per environment, with production only for the protected branch and with approval; secret scanning on every commit; no secret in build logs or image layers; and a record of who read what. A secret that has ever been in git history must be considered exposed and **rotated**, not merely deleted.",
      },
    ],
    armadilhas: [
      "Treating an environment variable as a vault: it stays readable in dumps, error logs and to anyone inspecting the process.",
      "Keeping the password that opens the vault inside the vault: the first secret stays unprotected; use identity.",
      "Deleting from the repository a secret that was already committed and thinking it is solved: it is still in the history and in clones; rotate it.",
      "Using managed identity with a role that is too broad (for example, contributor on the whole subscription): the secret is gone, but the excess power stays.",
    ],
    autoteste: [
      {
        pergunta: "Why is a managed identity better than a secret in a vault when both work?",
        resposta:
          "Because there is no secret to leak or rotate: the platform issues short tokens to the resource. The vault still holds a value that someone can read and copy.",
      },
      {
        pergunta: "How does a CI pipeline reach the cloud without a stored key?",
        resposta:
          "Through federation: CI issues an OIDC token per run, with repository and branch claims; the cloud is configured to trust that issuer and those conditions and exchanges the token for temporary credentials.",
      },
    ],
  },
};
