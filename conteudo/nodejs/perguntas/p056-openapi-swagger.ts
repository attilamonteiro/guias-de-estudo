import type { Pergunta } from "../../tipos";

// P56 · OpenAPI (Swagger)
export const p056: Pergunta = {
  numero: 756,
  modulo: "pawanmkr-distribuidos",
  metodo: "playbook",
  pt: {
    titulo: "OpenAPI (Swagger)",
    pergunta: "Como você pode projetar e documentar APIs usando OpenAPI (Swagger)?",
    porqueEsteMetodo:
      "“Como projetar e documentar” pede uma sequência de trabalho, não uma definição. Um playbook mostra a ordem: escolher o ponto de partida, descrever o contrato, validá-lo, gerar o que dele sai e manter a especificação honesta.",
    resposta30s:
      "**OpenAPI** é a **especificação** (um arquivo YAML ou JSON) que descreve uma API HTTP: caminhos, parâmetros, esquemas e respostas, inclusive as de erro; **Swagger** foi o nome original e hoje designa as **ferramentas** (Swagger UI, Swagger Editor). Você pode escrever o contrato antes (**design-first**) ou gerá-lo a partir do código (**code-first**), e o mesmo arquivo alimenta documentação, clientes, mocks, validação em tempo de execução e testes de contrato. O que mantém tudo isso útil é verificar a especificação automaticamente contra a API real.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Quem é quem",
        colunas: ["Nome", "O que é", "Exemplos"],
        linhas: [
          [
            "OpenAPI",
            "A especificação: um arquivo YAML ou JSON que descreve a API (caminhos, parâmetros, esquemas, respostas, segurança)",
            "`openapi.yaml`",
          ],
          [
            "Swagger",
            "O nome original da especificação; hoje designa um conjunto de ferramentas",
            "Swagger UI, Swagger Editor",
          ],
          ["Documentação", "Ferramentas que leem o arquivo e geram uma página navegável", "Swagger UI, Redoc"],
          [
            "Lint e geração",
            "Verificam estilo e consistência, e geram clientes, stubs e tipos",
            "Spectral, OpenAPI Generator, `openapi-typescript`",
          ],
        ],
        nota: "Em resumo: OpenAPI é o contrato; as ferramentas, chamem-se Swagger ou não, são o que se faz com ele.",
      },
      {
        tipo: "passos",
        titulo: "Playbook: do contrato à documentação viva",
        passos: [
          {
            titulo: "Escolha o ponto de partida",
            texto:
              "**Design-first** quando o contrato precisa ser combinado antes do código (front-end, parceiros, outro time): o arquivo é a fonte e o código o segue. **Code-first** quando a API já existe ou é interna de um só time: a especificação sai de anotações ou dos esquemas das rotas (por exemplo `@nestjs/swagger`, `@fastify/swagger` e `swagger-jsdoc`; confira a documentação de cada um). Critério: quem consome a API precisa do contrato antes de o código existir?",
          },
          {
            titulo: "Descreva caminhos, operações e esquemas",
            texto:
              "Em `paths`, cada operação com `operationId`, parâmetros, `requestBody` e respostas. Em `components`, esquemas reutilizáveis, respostas de erro padrão (400, 401, 404, 429, 500) no formato único da API (veja L54) e `securitySchemes` (veja P29). Sinal de acerto: nada repetido, tudo reaproveitado por `$ref`.",
          },
          {
            titulo: "Valide a especificação",
            texto:
              "Rode um linter, como o Spectral, e um validador do formato no CI: eles acusam referência quebrada, `operationId` duplicado, descrição faltando e regras de estilo da sua equipe. Critério: especificação inválida ou fora do padrão quebra o build.",
          },
          {
            titulo: "Gere a documentação",
            texto:
              "Swagger UI e Redoc leem o arquivo e montam uma página navegável; o Swagger UI permite até testar chamadas ali mesmo. Publique em um endereço estável. Sinal: quem consome chega ao contrato sem pedir a ninguém.",
          },
          {
            titulo: "Gere clientes, tipos e mocks",
            texto:
              "Geradores como o OpenAPI Generator e o `openapi-typescript` produzem SDKs, stubs de servidor e tipos TypeScript; um servidor de mock levantado a partir do arquivo deixa o front trabalhar antes de a API existir. Critério: o código gerado nunca é editado à mão; muda-se a especificação e gera-se de novo.",
          },
          {
            titulo: "Valide requisições e respostas contra o esquema",
            texto:
              "Em tempo de execução, um validador (Ajv, `express-openapi-validator` ou os esquemas de rota do Fastify) recusa corpo, parâmetros e cabeçalhos fora do contrato com `400` (veja L50); nos testes, confere que as respostas reais cumprem o esquema. Sinal: o contrato deixa de ser texto e vira regra executada.",
          },
          {
            titulo: "Teste o contrato e versione a especificação",
            texto:
              "Testes de contrato (ferramentas que geram requisições a partir da especificação e comparam as respostas) mostram quando a API diverge do arquivo, e ferramentas de comparação de especificações acusam mudança incompatível entre duas versões. Guarde o arquivo no repositório, revise-o em PR e só abra uma versão nova da API para mudança incompatível (veja L52).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Uma operação e seu esquema",
        legenda: "YAML",
        codigo: [
          "paths:",
          "  /pedidos/{id}:",
          "    get:",
          "      operationId: buscarPedido",
          "      parameters:",
          "        - { name: id, in: path, required: true, schema: { type: integer } }",
          "      responses:",
          '        "200":',
          "          description: O pedido",
          "          content:",
          '            application/json: { schema: { $ref: "#/components/schemas/Pedido" } }',
          "components:",
          "  schemas:",
          "    Pedido:",
          "      type: object",
          "      required: [id, status]",
          "      properties:",
          "        id: { type: integer }",
          "        status: { type: string, enum: [pendente, pago, cancelado] }",
        ].join("\n"),
        nota: "Trecho: no arquivo completo, ele vem depois dos campos `openapi` (a versão da especificação) e `info`. O erro 404 seria uma `$ref` para `components/responses`, reaproveitada em todas as operações.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Design-first ou code-first",
        texto:
          "**Design-first**: o contrato é revisado antes do código, front e back trabalham em paralelo contra mocks, e a especificação é a fonte da verdade. **Code-first**: começa mais rápido e duplica menos, mas o contrato fica a reboque do código e pode sair sem revisão. Nos dois casos, o que importa é a especificação ser **verificada** contra a API real no CI.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A especificação que mente é pior do que nenhuma",
        texto:
          "Se ela diverge da API, quem consome decide errado com toda a confiança. Esquemas frouxos (`type: object` sem `properties`, `additionalProperties` livre) viram `any` nos clientes gerados, e a validação não pega nada. E a página de documentação aberta de uma API interna entrega o mapa de toda a superfície dela: proteja-a ou publique só o necessário.",
      },
    ],
    armadilhas: [
      "Deixar a especificação divergir da API: documentação desatualizada engana mais do que a ausência dela; valide no CI.",
      "Esquemas frouxos (objeto sem propriedades, campos livres): viram `any` nos clientes gerados e a validação em tempo de execução não pega nada.",
      "Documentar só o caminho feliz: sem as respostas de erro (400, 401, 404, 429, 500), o cliente gerado não sabe lidar com elas.",
      "Editar à mão o código gerado de clientes e stubs: a próxima geração apaga a mudança; ajuste a especificação ou o gerador.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre OpenAPI e Swagger?",
        resposta:
          "OpenAPI é a especificação do contrato da API (o arquivo). Swagger é o nome antigo dessa especificação e hoje designa ferramentas, como o Swagger UI, que a leem.",
      },
      {
        pergunta: "Quando preferir design-first?",
        resposta:
          "Quando o contrato precisa ser combinado antes do código, com outros times ou clientes: a especificação é revisada primeiro, e dela saem mocks, stubs e testes, o que permite trabalho em paralelo.",
      },
    ],
  },
  en: {
    titulo: "OpenAPI (Swagger)",
    pergunta: "How can you design and document APIs using OpenAPI (Swagger)?",
    porqueEsteMetodo:
      "“How to design and document” asks for a working sequence, not a definition. A playbook gives the order: pick the starting point, describe the contract, validate it, generate what comes out of it and keep the specification honest.",
    resposta30s:
      "**OpenAPI** is the **specification** (a YAML or JSON file) that describes an HTTP API: paths, parameters, schemas and responses, error ones included; **Swagger** was the original name and today refers to the **tools** (Swagger UI, Swagger Editor). You can write the contract first (**design-first**) or generate it from the code (**code-first**), and the same file feeds documentation, clients, mocks, runtime validation and contract tests. What keeps all of this useful is checking the specification automatically against the real API.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Who is who",
        colunas: ["Name", "What it is", "Examples"],
        linhas: [
          [
            "OpenAPI",
            "The specification: a YAML or JSON file that describes the API (paths, parameters, schemas, responses, security)",
            "`openapi.yaml`",
          ],
          [
            "Swagger",
            "The original name of the specification; today it refers to a set of tools",
            "Swagger UI, Swagger Editor",
          ],
          ["Documentation", "Tools that read the file and generate a browsable page", "Swagger UI, Redoc"],
          [
            "Lint and generation",
            "Check style and consistency, and generate clients, stubs and types",
            "Spectral, OpenAPI Generator, `openapi-typescript`",
          ],
        ],
        nota: "In short: OpenAPI is the contract; the tools, whether called Swagger or not, are what you do with it.",
      },
      {
        tipo: "passos",
        titulo: "Playbook: from contract to living documentation",
        passos: [
          {
            titulo: "Pick the starting point",
            texto:
              "**Design-first** when the contract must be agreed before the code (front end, partners, another team): the file is the source and the code follows it. **Code-first** when the API already exists or is internal to a single team: the specification comes from annotations or route schemas (for example `@nestjs/swagger`, `@fastify/swagger` and `swagger-jsdoc`; check each one’s documentation). Criterion: do the API’s consumers need the contract before the code exists?",
          },
          {
            titulo: "Describe paths, operations and schemas",
            texto:
              "Under `paths`, each operation with `operationId`, parameters, `requestBody` and responses. Under `components`, reusable schemas, standard error responses (400, 401, 404, 429, 500) in the API’s single format (see L54) and `securitySchemes` (see P29). A sign you got it right: nothing repeated, everything reused through `$ref`.",
          },
          {
            titulo: "Validate the specification",
            texto:
              "Run a linter, such as Spectral, and a format validator in CI: they flag broken references, duplicate `operationId`s, missing descriptions and your team’s style rules. Criterion: an invalid or non-conforming specification breaks the build.",
          },
          {
            titulo: "Generate the documentation",
            texto:
              "Swagger UI and Redoc read the file and build a browsable page; Swagger UI even lets you try calls right there. Publish it at a stable address. A sign of success: consumers reach the contract without asking anyone.",
          },
          {
            titulo: "Generate clients, types and mocks",
            texto:
              "Generators such as OpenAPI Generator and `openapi-typescript` produce SDKs, server stubs and TypeScript types; a mock server started from the file lets the front end work before the API exists. Criterion: generated code is never edited by hand; you change the specification and generate again.",
          },
          {
            titulo: "Validate requests and responses against the schema",
            texto:
              "At runtime, a validator (Ajv, `express-openapi-validator` or Fastify’s route schemas) rejects bodies, parameters and headers outside the contract with `400` (see L50); in tests, it checks that real responses meet the schema. A sign of success: the contract stops being text and becomes an enforced rule.",
          },
          {
            titulo: "Test the contract and version the specification",
            texto:
              "Contract tests (tools that generate requests from the specification and compare the responses) show when the API diverges from the file, and specification-diff tools flag an incompatible change between two versions. Keep the file in the repository, review it in PRs and open a new API version only for an incompatible change (see L52).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "One operation and its schema",
        legenda: "YAML",
        codigo: [
          "paths:",
          "  /orders/{id}:",
          "    get:",
          "      operationId: getOrder",
          "      parameters:",
          "        - { name: id, in: path, required: true, schema: { type: integer } }",
          "      responses:",
          '        "200":',
          "          description: The order",
          "          content:",
          '            application/json: { schema: { $ref: "#/components/schemas/Order" } }',
          "components:",
          "  schemas:",
          "    Order:",
          "      type: object",
          "      required: [id, status]",
          "      properties:",
          "        id: { type: integer }",
          "        status: { type: string, enum: [pending, paid, cancelled] }",
        ].join("\n"),
        nota: "An excerpt: in the full file it comes after the `openapi` (the specification version) and `info` fields. The 404 error would be a `$ref` to `components/responses`, reused by every operation.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Design-first or code-first",
        texto:
          "**Design-first**: the contract is reviewed before the code, front end and back end work in parallel against mocks, and the specification is the source of truth. **Code-first**: it starts faster and duplicates less, but the contract trails the code and can ship without review. In both cases, what matters is that the specification is **checked** against the real API in CI.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A specification that lies is worse than none",
        texto:
          "If it diverges from the API, consumers decide wrongly with full confidence. Loose schemas (`type: object` with no `properties`, open `additionalProperties`) become `any` in generated clients, and validation catches nothing. And an open documentation page for an internal API hands out the map of its whole surface: protect it or publish only what is necessary.",
      },
    ],
    armadilhas: [
      "Letting the specification drift from the API: outdated documentation misleads more than having none; validate it in CI.",
      "Loose schemas (objects with no properties, free-form fields): they become `any` in generated clients and runtime validation catches nothing.",
      "Documenting only the happy path: without the error responses (400, 401, 404, 429, 500), the generated client does not know how to handle them.",
      "Editing generated client and stub code by hand: the next generation erases the change; adjust the specification or the generator.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between OpenAPI and Swagger?",
        resposta:
          "OpenAPI is the specification of the API contract (the file). Swagger is the old name of that specification and today refers to tools, such as Swagger UI, that read it.",
      },
      {
        pergunta: "When should you prefer design-first?",
        resposta:
          "When the contract must be agreed before the code, with other teams or clients: the specification is reviewed first, and mocks, stubs and tests come out of it, which allows parallel work.",
      },
    ],
  },
};
