import type { Pergunta } from "../../tipos";

// R08 · Versionamento de API
export const r08: Pergunta = {
  numero: 108,
  modulo: "roadmap-iniciante",
  metodo: "compare",
  pt: {
    titulo: "Versionamento de API",
    pergunta: "Como você aborda o versionamento de API em seus projetos?",
    porqueEsteMetodo:
      "Versionar é escolher entre estratégias com prós e contras diferentes. Uma matriz mais uma regra de decisão responde melhor do que uma lista.",
    resposta30s:
      "As formas comuns são a **versão no caminho** (`/v1/pedidos`), na **query** (`?v=1`), num **cabeçalho próprio** (`API-Version: 2`) ou na **negociação de conteúdo** (`Accept: application/vnd.x.v2+json`). A mais usada e mais clara é a do caminho. O essencial: **só crie versão nova para mudanças que quebram compatibilidade**, avise a depreciação com data e meça o uso antes de desligar a antiga.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Estratégia", "Exemplo", "Prós", "Contras"],
        linhas: [
          ["No caminho", "`/v1/pedidos`", "Visível, simples, fácil de rotear e de cachear", "A URL muda entre versões"],
          ["Na query", "`/pedidos?v=1`", "Fácil de testar", "Mistura versão com filtros; pior para cache e roteamento"],
          ["Cabeçalho próprio", "`API-Version: 2`", "URL estável", "Menos visível; difícil testar no navegador"],
          [
            "Negociação de conteúdo",
            "`Accept: application/vnd.x.v2+json`",
            "Fiel ao HTTP",
            "Mais complexo para os clientes",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Na maioria dos casos, **versão no caminho** pela clareza. Mudança **aditiva** (campo novo opcional) não exige versão; mudança que **quebra** (remover ou renomear campo, mudar tipo ou semântica, tornar obrigatório algo opcional) exige.",
      },
      {
        tipo: "passos",
        titulo: "Ciclo de vida de uma versão",
        passos: [
          {
            titulo: "Lançar",
            texto: "Documente o que mudou e como migrar.",
          },
          {
            titulo: "Depreciar",
            texto: "Avise com data (cabeçalhos `Deprecation` e `Sunset`), comunique os clientes.",
          },
          {
            titulo: "Medir",
            texto: "Acompanhe quem ainda usa cada versão.",
          },
          {
            titulo: "Desligar",
            texto: "Só depois do prazo e com o uso próximo de zero.",
          },
        ],
      },
    ],
    armadilhas: [
      "Criar versão nova a cada mudança, multiplicando o que precisa ser mantido.",
      "Desligar a versão antiga sem aviso nem métrica de uso.",
      "Versionar o código interno em vez do contrato público.",
    ],
    autoteste: [
      {
        pergunta: "O que é uma mudança que quebra compatibilidade?",
        resposta:
          "Remover ou renomear um campo, mudar tipo, formato ou significado, ou tornar obrigatório um parâmetro opcional.",
      },
      {
        pergunta: "Como retirar uma versão antiga com segurança?",
        resposta: "Anunciar a depreciação com data, medir quem ainda usa, avisar esses clientes e só então desligar.",
      },
    ],
  },
  en: {
    titulo: "API versioning",
    pergunta: "How do you approach API versioning in your projects?",
    porqueEsteMetodo:
      "Versioning means choosing between strategies with different pros and cons. A matrix plus a decision rule answers better than a list.",
    resposta30s:
      "Common forms are **version in the path** (`/v1/orders`), in the **query** (`?v=1`), in a **custom header** (`API-Version: 2`) or via **content negotiation** (`Accept: application/vnd.x.v2+json`). The most used and clearest is the path. The essentials: **only create a new version for breaking changes**, announce deprecation with a date and measure usage before switching the old one off.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Strategy", "Example", "Pros", "Cons"],
        linhas: [
          [
            "In the path",
            "`/v1/orders`",
            "Visible, simple, easy to route and cache",
            "The URL changes between versions",
          ],
          [
            "In the query",
            "`/orders?v=1`",
            "Easy to test",
            "Mixes version with filters; worse for caching and routing",
          ],
          ["Custom header", "`API-Version: 2`", "Stable URL", "Less visible; hard to test in a browser"],
          [
            "Content negotiation",
            "`Accept: application/vnd.x.v2+json`",
            "Faithful to HTTP",
            "More complex for clients",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "In most cases, **version in the path** for clarity. An **additive** change (new optional field) needs no version; a **breaking** change (removing or renaming a field, changing type or semantics, making something optional required) does.",
      },
      {
        tipo: "passos",
        titulo: "Life cycle of a version",
        passos: [
          {
            titulo: "Release",
            texto: "Document what changed and how to migrate.",
          },
          {
            titulo: "Deprecate",
            texto: "Announce with a date (`Deprecation` and `Sunset` headers), notify clients.",
          },
          {
            titulo: "Measure",
            texto: "Track who still uses each version.",
          },
          {
            titulo: "Switch off",
            texto: "Only after the deadline and with usage near zero.",
          },
        ],
      },
    ],
    armadilhas: [
      "Creating a new version for every change, multiplying what must be maintained.",
      "Switching off the old version with no notice or usage metric.",
      "Versioning internal code instead of the public contract.",
    ],
    autoteste: [
      {
        pergunta: "What is a breaking change?",
        resposta:
          "Removing or renaming a field, changing type, format or meaning, or making an optional parameter required.",
      },
      {
        pergunta: "How do you retire an old version safely?",
        resposta:
          "Announce deprecation with a date, measure who still uses it, notify those clients and only then switch it off.",
      },
    ],
  },
};
