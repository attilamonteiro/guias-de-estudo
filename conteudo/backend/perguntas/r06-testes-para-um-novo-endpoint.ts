import type { Pergunta } from "../../tipos";

// R06 · Testes para um novo endpoint
export const r06: Pergunta = {
  numero: 106,
  modulo: "roadmap-iniciante",
  metodo: "playbook",
  pt: {
    titulo: "Testes para um novo endpoint",
    pergunta: "Que tipos de testes você escreveria para um novo endpoint de API?",
    porqueEsteMetodo:
      "Testar um endpoint é percorrer uma lista de cenários. Um playbook por categoria garante que você cubra além do caminho feliz.",
    resposta30s:
      "Cubra o endpoint por camadas: **unitários** para a regra de negócio, **integração** pelo endpoint real com banco de teste, e **carga** antes de ir para produção. Dentro dos de integração, teste o **caminho feliz**, a **validação**, a **autenticação e autorização**, os **erros e casos de borda**, as **falhas de dependências** e o **contrato** da resposta.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O que cobrir",
        passos: [
          {
            titulo: "Caminho feliz",
            texto: "Entrada válida → status e corpo esperados, e o efeito no banco confirmado.",
          },
          {
            titulo: "Validação",
            texto:
              "Campos obrigatórios ausentes, tipos errados, limites (texto muito longo, número negativo) → `400` ou `422` com mensagem útil.",
          },
          {
            titulo: "Autenticação e autorização",
            texto: "Sem token → `401`. Usuário sem permissão, ou recurso de outro usuário → `403` ou `404`.",
          },
          {
            titulo: "Erros e casos de borda",
            texto:
              "Recurso inexistente (`404`), conflito (`409`), duplicidade, lista vazia, paginação, repetição da mesma requisição (idempotência).",
          },
          {
            titulo: "Falhas de dependências",
            texto: "Banco ou API externa fora do ar → erro tratado (`5xx` controlado), timeout, retry.",
          },
          {
            titulo: "Contrato",
            texto: "Formato da resposta (esquema/OpenAPI), cabeçalhos e códigos estáveis para os consumidores.",
          },
          {
            titulo: "Níveis",
            texto:
              "Unitários para a regra; integração pelo endpoint real; carga/desempenho como etapa final antes de produção.",
          },
        ],
      },
      {
        tipo: "codigo",
        legenda: "javascript (jest + supertest)",
        codigo:
          'test("POST /pedidos sem token devolve 401", async () => {\n  const r = await request(app).post("/pedidos").send({ itens: [] })\n  expect(r.status).toBe(401)\n})\ntest("usuario A nao le o pedido do usuario B", async () => {\n  const r = await request(app).get("/pedidos/" + pedidoDoB.id).set(authComo(usuarioA))\n  expect([403, 404]).toContain(r.status)\n})',
      },
    ],
    armadilhas: [
      "Testar só o caminho feliz.",
      "Mockar tanto que o teste não toca o banco nem a serialização reais.",
      "Testes que dependem da ordem de execução ou de dados do ambiente.",
    ],
    autoteste: [
      {
        pergunta: "Que teste cobre o acesso ao recurso de outro usuário?",
        resposta:
          "Autorização: autenticar como o usuário A e pedir o recurso do usuário B deve falhar (`403` ou `404`).",
      },
      {
        pergunta: "Por que testar o contrato da resposta?",
        resposta:
          "Porque os consumidores dependem de campos e códigos estáveis; mudar sem perceber quebra os clientes.",
      },
    ],
  },
  en: {
    titulo: "Tests for a new endpoint",
    pergunta: "What kinds of tests would you write for a new API endpoint?",
    porqueEsteMetodo:
      "Testing an endpoint means walking through a list of scenarios. A playbook by category ensures you cover more than the happy path.",
    resposta30s:
      "Cover the endpoint in layers: **unit** tests for the business rule, **integration** tests through the real endpoint with a test database, and **load** tests before going to production. Within integration, test the **happy path**, **validation**, **authentication and authorization**, **errors and edge cases**, **dependency failures** and the response **contract**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "What to cover",
        passos: [
          {
            titulo: "Happy path",
            texto: "Valid input → expected status and body, with the effect on the database confirmed.",
          },
          {
            titulo: "Validation",
            texto:
              "Missing required fields, wrong types, limits (very long text, negative number) → `400` or `422` with a useful message.",
          },
          {
            titulo: "Authentication and authorization",
            texto: "No token → `401`. User without permission, or another user’s resource → `403` or `404`.",
          },
          {
            titulo: "Errors and edge cases",
            texto:
              "Nonexistent resource (`404`), conflict (`409`), duplicates, empty list, pagination, repeating the same request (idempotency).",
          },
          {
            titulo: "Dependency failures",
            texto: "Database or external API down → handled error (controlled `5xx`), timeout, retry.",
          },
          {
            titulo: "Contract",
            texto: "Response format (schema/OpenAPI), headers and status codes stable for consumers.",
          },
          {
            titulo: "Levels",
            texto:
              "Unit for the rule; integration through the real endpoint; load/performance as the final step before production.",
          },
        ],
      },
      {
        tipo: "codigo",
        legenda: "javascript (jest + supertest)",
        codigo:
          'test("POST /orders without a token returns 401", async () => {\n  const r = await request(app).post("/orders").send({ items: [] })\n  expect(r.status).toBe(401)\n})\ntest("user A cannot read user B\'s order", async () => {\n  const r = await request(app).get("/orders/" + orderOfB.id).set(authAs(userA))\n  expect([403, 404]).toContain(r.status)\n})',
      },
    ],
    armadilhas: [
      "Testing only the happy path.",
      "Mocking so much that the test never touches the real database or serialization.",
      "Tests that depend on execution order or environment data.",
    ],
    autoteste: [
      {
        pergunta: "Which test covers access to another user’s resource?",
        resposta:
          "Authorization: authenticate as user A and request user B’s resource; it should fail (`403` or `404`).",
      },
      {
        pergunta: "Why test the response contract?",
        resposta: "Because consumers depend on stable fields and codes; changing them unnoticed breaks clients.",
      },
    ],
  },
};
