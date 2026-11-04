import type { Pergunta } from "../../tipos";

// R29 · Decompor um monólito
export const r29: Pergunta = {
  numero: 129,
  modulo: "roadmap-intermediario",
  metodo: "playbook",
  pt: {
    titulo: "Decompor um monólito",
    pergunta: "O que são microsserviços e como você decomporia um monólito em microsserviços?",
    porqueEsteMetodo:
      "Decompor um monólito é um procedimento incremental, não um desenho do zero. O playbook segue a ordem em que se extrai um serviço com segurança.",
    resposta30s:
      "Microsserviços são **serviços pequenos e autônomos, organizados em torno de capacidades de negócio**, cada um com seu deploy e seus dados. Para decompor um monólito, faça-o de forma **incremental** (padrão **strangler fig**): identifique fronteiras de domínio, modularize por dentro, extraia um serviço de cada vez atrás de uma fachada, separe os dados e só então desligue o código antigo. Nunca reescreva tudo de uma vez.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Decompondo, passo a passo",
        passos: [
          {
            titulo: "Entenda o monólito",
            texto:
              "Mapeie módulos, dependências e dados. Prefira fronteiras de **domínio** (contextos delimitados do DDD) a camadas técnicas.",
          },
          {
            titulo: "Modularize por dentro primeiro",
            texto:
              "Transforme-o num **monólito modular**: fronteiras claras, sem acesso direto às tabelas de outro módulo.",
          },
          {
            titulo: "Escolha o primeiro candidato",
            texto:
              "Uma parte com fronteira clara, pouca dependência e valor (escala diferente, mudanças frequentes). Evite começar pelo núcleo mais entrelaçado.",
          },
          {
            titulo: "Coloque uma fachada na frente",
            texto:
              "Um API gateway ou proxy: o tráfego passa por ele e você redireciona rota a rota para o novo serviço (**strangler fig**).",
          },
          {
            titulo: "Separe os dados",
            texto:
              "Cada serviço é dono dos seus dados; elimine joins entre eles e use APIs ou eventos. A migração de dados usa sincronização temporária.",
          },
          {
            titulo: "Extraia, migre o tráfego e remova",
            texto:
              "Mova a lógica, direcione o tráfego aos poucos (canary), compare resultados e remova o código antigo do monólito.",
          },
          {
            titulo: "Resolva o que a rede traz",
            texto:
              "Timeouts, retentativas, circuit breaker, observabilidade distribuída, contratos versionados e pipelines independentes.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Comparação",
        texto: "Para a matriz monólito vs microsserviços e a regra de quando migrar, veja a Q01.",
      },
    ],
    armadilhas: [
      "Dividir por camada técnica em vez de por domínio.",
      "Reescrever tudo do zero (big bang).",
      "Serviços compartilhando o mesmo banco.",
      "Extrair sem observabilidade nem automação de deploy.",
    ],
    autoteste: [
      {
        pergunta: "O que é o padrão strangler fig?",
        resposta:
          "Colocar uma fachada na frente do monólito e substituir funcionalidades por novos serviços aos poucos, rota a rota, até o monólito não ser mais necessário.",
      },
      {
        pergunta: "Por que começar com um monólito modular?",
        resposta: "Porque fronteiras claras dentro do monólito tornam a extração posterior barata e segura.",
      },
    ],
  },
  en: {
    titulo: "Decomposing a monolith",
    pergunta: "What are microservices and how would you decompose a monolith into microservices?",
    porqueEsteMetodo:
      "Decomposing a monolith is an incremental procedure, not a design from scratch. The playbook follows the order in which a service is safely extracted.",
    resposta30s:
      "Microservices are **small, autonomous services organized around business capabilities**, each with its own deploy and data. To decompose a monolith, do it **incrementally** (the **strangler fig** pattern): identify domain boundaries, modularize inside, extract one service at a time behind a facade, separate the data and only then switch off the old code. Never rewrite everything at once.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Decomposing, step by step",
        passos: [
          {
            titulo: "Understand the monolith",
            texto:
              "Map modules, dependencies and data. Prefer **domain** boundaries (DDD bounded contexts) over technical layers.",
          },
          {
            titulo: "Modularize inside first",
            texto:
              "Turn it into a **modular monolith**: clear boundaries, no direct access to another module’s tables.",
          },
          {
            titulo: "Pick the first candidate",
            texto:
              "A part with a clear boundary, few dependencies and value (different scaling, frequent changes). Avoid starting with the most entangled core.",
          },
          {
            titulo: "Put a facade in front",
            texto:
              "An API gateway or proxy: traffic goes through it and you redirect route by route to the new service (**strangler fig**).",
          },
          {
            titulo: "Separate the data",
            texto:
              "Each service owns its data; remove joins between them and use APIs or events. Data migration uses temporary synchronization.",
          },
          {
            titulo: "Extract, move traffic and remove",
            texto:
              "Move the logic, shift traffic gradually (canary), compare results and remove the old code from the monolith.",
          },
          {
            titulo: "Solve what the network brings",
            texto:
              "Timeouts, retries, circuit breaker, distributed observability, versioned contracts and independent pipelines.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Comparison",
        texto: "For the monolith vs microservices matrix and the rule on when to migrate, see Q01.",
      },
    ],
    armadilhas: [
      "Splitting by technical layer instead of by domain.",
      "Rewriting everything from scratch (big bang).",
      "Services sharing the same database.",
      "Extracting without observability or deploy automation.",
    ],
    autoteste: [
      {
        pergunta: "What is the strangler fig pattern?",
        resposta:
          "Putting a facade in front of the monolith and replacing features with new services bit by bit, route by route, until the monolith is no longer needed.",
      },
      {
        pergunta: "Why start with a modular monolith?",
        resposta: "Because clear boundaries inside the monolith make later extraction cheap and safe.",
      },
    ],
  },
};
