import type { Pergunta } from "../../tipos";

// L52 · Versionamento de API
export const l052: Pergunta = {
  numero: 152,
  modulo: "linkedin-express",
  metodo: "compare",
  pt: {
    titulo: "Versionamento de API",
    pergunta: "Como você versiona APIs REST?",
    porqueEsteMetodo:
      "Há várias estratégias de versionamento, cada uma com custos próprios. A matriz mostra o que cada uma ganha e perde, e a regra de decisão diz qual escolher e, antes disso, quando nem criar uma versão nova.",
    resposta30s:
      "Antes de versionar, **evolua sem quebrar**: acrescentar campos e endpoints é compatível; **remover, renomear ou mudar o significado** de algo exige uma nova versão. A forma mais comum e simples é pela **URL** (`/v1/...`); cabeçalho, `Accept` personalizado e query também funcionam, cada um com seus custos. Depois, comunique a **depreciação** com prazo (cabeçalho `Sunset`) e mantenha poucas versões vivas.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Estratégias de versionamento",
        colunas: ["Estratégia", "Exemplo", "Vantagens", "Desvantagens"],
        linhas: [
          [
            "Na URL",
            "`GET /v2/pedidos`",
            "Visível, simples de testar, de rotear e de documentar; o cache funciona sem truque",
            "A versão passa a fazer parte do endereço do recurso; os clientes precisam trocar as URLs para migrar",
          ],
          [
            "Cabeçalho próprio",
            "`Api-Version: 2`",
            "A URL do recurso fica estável",
            "Menos visível (difícil de testar no navegador); o cache precisa de `Vary`",
          ],
          [
            "Negociação de conteúdo",
            "`Accept: application/vnd.exemplo.v2+json`",
            "Versiona a representação, não o recurso, e se alinha ao modelo do HTTP",
            "Mais complexa de implementar e de documentar; ferramentas simples têm dificuldade",
          ],
          [
            "Query string",
            "`GET /pedidos?versao=2`",
            "Fácil de acrescentar e de experimentar",
            "Fácil de esquecer; mistura contrato com filtro; roteamento menos limpo",
          ],
          [
            "Sem versão explícita (evolução compatível)",
            "Só acrescentar campos e endpoints",
            "Nenhum cliente precisa migrar",
            "Exige disciplina e não resolve uma quebra de verdade",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "O que quebra os clientes e pede nova versão",
        colunas: ["Mudança", "Quebra?", "Observação"],
        linhas: [
          [
            "Adicionar campo à resposta",
            "Em geral, não",
            "Desde que os clientes ignorem campos desconhecidos: combine isso desde o início",
          ],
          ["Adicionar endpoint ou parâmetro opcional", "Não", "É compatível e não pede versão nova"],
          ["Remover ou renomear um campo", "Sim", "Pede versão nova, ou um período em que os dois nomes convivem"],
          [
            "Mudar tipo, formato ou significado de um campo",
            "Sim",
            "É a quebra mais traiçoeira: o contrato parece o mesmo e o cliente falha em silêncio",
          ],
          ["Tornar obrigatório um campo da requisição", "Sim", "Quem não o envia passa a receber erro"],
          [
            "Mudar códigos de status ou o formato de erro",
            "Sim",
            "Os clientes decidem o que fazer com base nisso (veja L55)",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Primeiro, **evolua sem quebrar**: acrescente, não remova, e reserve versão nova para quebras reais. Quando precisar, comece pela opção mais simples para os clientes, normalmente a **versão na URL** (só a versão principal, como `/v1`); cabeçalho ou `Accept` fazem sentido quando a URL precisa ficar estável ou você versiona a representação. Mantenha poucas versões vivas e anuncie a **depreciação** com prazo: o cabeçalho `Sunset` (RFC 8594) informa a data de desligamento e o `Deprecation` sinaliza que o recurso está obsoleto. Confira os RFCs vigentes.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Versão sem comunicação não funciona",
        texto:
          "Sem contrato claro, métrica de uso por versão e aviso aos clientes (changelog, e-mail, cabeçalhos), a v1 nunca morre e cada correção precisa ser feita duas vezes. Versionar a API inteira por causa de uma mudança num único recurso também multiplica o custo de manutenção: avalie esse preço antes de abrir uma nova versão.",
      },
    ],
    armadilhas: [
      "Criar a `v2` a cada mudança pequena: adições compatíveis não precisam de versão nova.",
      "Mudar o significado de um campo mantendo o nome e a versão: a quebra é silenciosa e só aparece em produção.",
      "Versionar sem plano de desligamento nem métrica de uso por versão: a versão antiga vive para sempre.",
      "Versionar por cabeçalho sem `Vary`: caches e CDNs entregam a resposta de uma versão a clientes de outra.",
    ],
    autoteste: [
      {
        pergunta: "Adicionar um campo opcional à resposta exige uma nova versão da API?",
        resposta:
          "Em geral não, desde que os clientes ignorem campos desconhecidos. Versão nova é para quebras: remover, renomear ou mudar o tipo ou o significado de algo.",
      },
      {
        pergunta: "Qual é o principal ponto a favor e o principal ponto contra da versão na URL?",
        resposta:
          "A favor: é visível e fácil de testar, rotear, documentar e cachear. Contra: a versão vira parte do endereço do recurso, e os clientes precisam trocar as URLs para migrar.",
      },
    ],
  },
  en: {
    titulo: "API versioning",
    pergunta: "How do you version REST APIs?",
    porqueEsteMetodo:
      "There are several versioning strategies, each with its own costs. The matrix shows what each one gains and loses, and the decision rule says which to pick and, before that, when not to create a new version at all.",
    resposta30s:
      "Before versioning, **evolve without breaking**: adding fields and endpoints is compatible; **removing, renaming or changing the meaning** of something calls for a new version. The most common and simplest way is the **URL** (`/v1/...`); a header, a custom `Accept` or a query parameter also work, each with its own costs. Then announce **deprecation** with a deadline (the `Sunset` header) and keep few versions alive.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Versioning strategies",
        colunas: ["Strategy", "Example", "Advantages", "Drawbacks"],
        linhas: [
          [
            "In the URL",
            "`GET /v2/orders`",
            "Visible, easy to test, route and document; caching works without tricks",
            "The version becomes part of the resource address; clients must change URLs to migrate",
          ],
          [
            "Custom header",
            "`Api-Version: 2`",
            "The resource URL stays stable",
            "Less visible (hard to test in a browser); caching needs `Vary`",
          ],
          [
            "Content negotiation",
            "`Accept: application/vnd.example.v2+json`",
            "Versions the representation, not the resource, and fits the HTTP model",
            "Harder to implement and to document; simple tools struggle with it",
          ],
          [
            "Query string",
            "`GET /orders?version=2`",
            "Easy to add and to experiment with",
            "Easy to forget; mixes the contract with filters; routing is less clean",
          ],
          [
            "No explicit version (compatible evolution)",
            "Only add fields and endpoints",
            "No client has to migrate",
            "Requires discipline and does not solve a real breaking change",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "What breaks clients and calls for a new version",
        colunas: ["Change", "Breaks?", "Note"],
        linhas: [
          [
            "Adding a field to the response",
            "Usually not",
            "As long as clients ignore unknown fields: agree on this from the start",
          ],
          ["Adding an endpoint or an optional parameter", "No", "It is compatible and needs no new version"],
          ["Removing or renaming a field", "Yes", "Needs a new version, or a period in which both names coexist"],
          [
            "Changing the type, format or meaning of a field",
            "Yes",
            "The trickiest break: the contract looks the same and the client fails silently",
          ],
          ["Making a request field required", "Yes", "Anyone who does not send it now gets an error"],
          ["Changing status codes or the error format", "Yes", "Clients decide what to do based on them (see L55)"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "First, **evolve without breaking**: add, do not remove, and keep new versions for real breaking changes. When you need one, start with the simplest option for clients, usually the **version in the URL** (major version only, such as `/v1`); a header or `Accept` make sense when the URL must stay stable or you are versioning the representation. Keep few versions alive and announce **deprecation** with a deadline: the `Sunset` header (RFC 8594) gives the shutdown date and `Deprecation` signals that the resource is obsolete. Check the current RFCs.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Versions without communication do not work",
        texto:
          "Without a clear contract, per-version usage metrics and notice to clients (changelog, email, headers), v1 never dies and every fix has to be made twice. Versioning the whole API because of a change to a single resource also multiplies the maintenance cost: weigh that price before opening a new version.",
      },
    ],
    armadilhas: [
      "Creating `v2` for every small change: compatible additions do not need a new version.",
      "Changing the meaning of a field while keeping its name and the version: the break is silent and only shows up in production.",
      "Versioning with no shutdown plan and no per-version usage metric: the old version lives forever.",
      "Versioning by header without `Vary`: caches and CDNs serve one version’s response to clients of another.",
    ],
    autoteste: [
      {
        pergunta: "Does adding an optional field to the response require a new API version?",
        resposta:
          "Usually not, as long as clients ignore unknown fields. A new version is for breaking changes: removing, renaming, or changing the type or meaning of something.",
      },
      {
        pergunta: "What is the main point in favor of and the main point against versioning in the URL?",
        resposta:
          "For: it is visible and easy to test, route, document and cache. Against: the version becomes part of the resource address, and clients must change their URLs to migrate.",
      },
    ],
  },
};
