import type { Pergunta } from "../../tipos";

// R11 · Containerização
export const r11: Pergunta = {
  numero: 111,
  modulo: "roadmap-iniciante",
  metodo: "feynman",
  pt: {
    titulo: "Containerização",
    pergunta: "O que é containerização e como ela beneficia o desenvolvimento de backend?",
    porqueEsteMetodo:
      "O contêiner de navio é a analogia que todo mundo já usa para este conceito. Ela dá a intuição, e o ponto em que quebra (compartilha o kernel) é o que separa contêiner de máquina virtual.",
    resposta30s:
      "Containerização **empacota a aplicação com suas dependências** numa imagem que roda como um **processo isolado** do sistema (usando recursos do kernel como namespaces e cgroups). É muito mais leve que uma VM e garante o **mesmo ambiente** do desenvolvimento à produção. Benefícios: consistência, isolamento de dependências, deploy e rollback por troca de imagem, escala com orquestradores (Kubernetes) e CI/CD reprodutível.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "O contêiner de navio: a carga vai numa caixa de tamanho padrão, e o porto, o navio e o caminhão não precisam saber o que há dentro. Funciona igual em qualquer lugar.",
        tecnico:
          "Uma **imagem** é o pacote imutável (runtime, bibliotecas, código, configuração padrão); um **contêiner** é uma instância em execução dela. Como compartilha o kernel do host, é um processo isolado, sem sistema operacional próprio, então sobe em segundos e ocupa dezenas de MB. A mesma imagem que passou nos testes é a que vai para produção.",
        limite:
          "O contêiner **compartilha o kernel** do host, então isola menos que uma VM (segurança, outro sistema operacional). E “funciona na minha máquina” vira “funciona no contêiner”, mas dados, rede e segredos ainda exigem cuidado.",
      },
      {
        tipo: "tabela",
        titulo: "Contêiner vs máquina virtual",
        colunas: ["", "Contêiner", "VM"],
        linhas: [
          ["Isolamento", "Processo (kernel compartilhado)", "Sistema operacional completo"],
          ["Tamanho", "Dezenas a centenas de MB", "Gigabytes"],
          ["Inicialização", "Segundos ou menos", "Minutos"],
          ["Densidade", "Muitos por servidor", "Poucos"],
        ],
      },
    ],
    armadilhas: [
      "Guardar dados importantes dentro do contêiner: ele é descartável (use volumes ou serviços externos).",
      "Imagem enorme, com ferramentas de build e segredos dentro.",
      "Rodar como root dentro do contêiner.",
      "Achar que o contêiner é uma fronteira de segurança tão forte quanto uma VM.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre imagem e contêiner?",
        resposta: "A imagem é o pacote imutável (o modelo); o contêiner é uma instância em execução dessa imagem.",
      },
      {
        pergunta: "Por que contêineres são mais leves que VMs?",
        resposta: "Compartilham o kernel do host em vez de trazer um sistema operacional completo por instância.",
      },
    ],
  },
  en: {
    titulo: "Containerization",
    pergunta: "What is containerization and how does it benefit backend development?",
    porqueEsteMetodo:
      "The shipping container is the analogy everyone already uses for this concept. It gives the intuition, and the point where it breaks (shared kernel) is what separates a container from a virtual machine.",
    resposta30s:
      "Containerization **packages the application with its dependencies** into an image that runs as a **process isolated** from the system (using kernel features like namespaces and cgroups). It is far lighter than a VM and guarantees the **same environment** from development to production. Benefits: consistency, dependency isolation, deploy and rollback by swapping images, scaling with orchestrators (Kubernetes) and reproducible CI/CD.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "The shipping container: the cargo goes in a standard-sized box, and the port, the ship and the truck do not need to know what is inside. It works the same anywhere.",
        tecnico:
          "An **image** is the immutable package (runtime, libraries, code, default configuration); a **container** is a running instance of it. Since it shares the host kernel, it is an isolated process with no operating system of its own, so it starts in seconds and takes tens of MB. The same image that passed the tests is the one that goes to production.",
        limite:
          "The container **shares the host kernel**, so it isolates less than a VM (security, a different operating system). And “works on my machine” becomes “works in the container”, but data, network and secrets still need care.",
      },
      {
        tipo: "tabela",
        titulo: "Container vs virtual machine",
        colunas: ["", "Container", "VM"],
        linhas: [
          ["Isolation", "Process (shared kernel)", "Full operating system"],
          ["Size", "Tens to hundreds of MB", "Gigabytes"],
          ["Startup", "Seconds or less", "Minutes"],
          ["Density", "Many per server", "Few"],
        ],
      },
    ],
    armadilhas: [
      "Storing important data inside the container: it is disposable (use volumes or external services).",
      "A huge image with build tools and secrets inside.",
      "Running as root inside the container.",
      "Believing the container is as strong a security boundary as a VM.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between an image and a container?",
        resposta:
          "The image is the immutable package (the template); the container is a running instance of that image.",
      },
      {
        pergunta: "Why are containers lighter than VMs?",
        resposta: "They share the host kernel instead of bringing a full operating system per instance.",
      },
    ],
  },
};
