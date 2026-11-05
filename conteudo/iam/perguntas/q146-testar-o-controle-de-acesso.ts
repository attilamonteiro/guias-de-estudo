import type { Pergunta } from "../../tipos";

// Q146 · Testar o controle de acesso
export const q146: Pergunta = {
  numero: 146,
  modulo: "ataques-e-depuracao",
  metodo: "playbook",
  pt: {
    titulo: "Testar o controle de acesso",
    pergunta:
      "Como testar o controle de acesso de uma aplicação? Descreva testes de matriz de permissões, casos negativos, escalonamento horizontal e vertical e verificação contínua.",
    porqueEsteMetodo:
      "Testar autorização é uma rotina com ordem: primeiro dizer o que é correto, depois provar o permitido e, principalmente, o proibido, e por fim impedir que isso se perca. O playbook dá a sequência e o critério de cada etapa.",
    resposta30s:
      "Escreva a política como uma **matriz papel × recurso × ação** e gere dela testes automatizados que cobrem o permitido e, principalmente, os **casos negativos** (sem token, token expirado, escopo insuficiente, outro tenant). Procure as falhas clássicas: **horizontal** (trocar o ID de um objeto de outra pessoa) e **vertical** (um papel menor chamando a função de um maior), e complemente com ferramentas de teste de segurança. Rode tudo no pipeline e trate regressão como falha de build, inclusive uma rota sem política.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook de teste de autorização",
        passos: [
          {
            titulo: "1. Escreva a política como matriz",
            texto:
              "Liste papel × recurso × ação, com as condições (dono do objeto, mesmo tenant, estado do recurso) e o resultado esperado, **inclusive os “não pode”** e o código de recusa (401, 403 ou 404). É a especificação do que é correto: sem ela não há o que testar. Critério: cada rota e cada função aparece na matriz.",
          },
          {
            titulo: "2. Automatize a matriz, com os negativos",
            texto:
              "Gere os testes da própria matriz (uma fonte só) e chame a API de verdade, com um token de cada papel. Inclua os casos negativos: sem token, token expirado ou revogado, assinatura inválida, escopo insuficiente, token de outro tenant, usuário desabilitado. O caminho feliz quase sempre funciona; os bugs moram nos negativos.",
          },
          {
            titulo: "3. Escalonamento horizontal (mesmo nível)",
            texto:
              "Com duas contas do mesmo papel (e dois tenants), a conta A tenta ler, alterar e apagar objetos da conta B trocando IDs no caminho, na query, no corpo, em cabeçalhos e em operações em lote (veja Q136). Teste também listagens e buscas (vazam dados de outros?), exportações, arquivos, links assinados e notificações.",
          },
          {
            titulo: "4. Escalonamento vertical (nível acima)",
            texto:
              "Um papel menor chama funções de um papel maior: endpoints de administração, métodos HTTP que a interface não usa (`PUT`, `DELETE`), URLs que o menu esconde, campos como `role` ou `isAdmin` no corpo (mass assignment), token com claims alteradas (veja Q132). Sinal de acerto: toda chamada recebe a recusa prevista na matriz.",
          },
          {
            titulo: "5. Contexto, tempo e fluxo",
            texto:
              "Papel removido, mas token antigo ainda aceito; sessão encerrada; recurso num estado que não permite a ação; fluxo de várias etapas com uma pulada (aprovar sem passar pela análise). Aqui aparecem erros de ordem e de estado que uma matriz simples não mostra.",
          },
          {
            titulo: "6. Complemente com ferramentas e revisão",
            texto:
              "Proxy de teste de segurança (por exemplo OWASP ZAP ou Burp Suite, com extensões que repetem requisições com outro token), SAST e DAST no pipeline, revisão de código dos pontos de decisão (veja Q115) e, quando a política é código, testes da própria política (veja Q113 e Q114). Um teste de invasão periódico cobre o que a automação não imagina.",
          },
          {
            titulo: "7. Verifique continuamente",
            texto:
              "Rode a suíte no pipeline e trate regressão como falha de build. Acrescente um teste que enumera as rotas e exige uma declaração de autorização em cada uma (negar por padrão: rota sem política quebra o build). Meça a cobertura da matriz (rotas × papéis testados) e use testes de mutação: se você remove o `if` de autorização, algum teste quebra? Guarde os relatórios como evidência para auditoria e mantenha a revisão periódica de acessos (veja Q119).",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Um recorte da matriz (resultados esperados)",
        colunas: [
          "Ação",
          "Anônimo",
          "Dono do pedido",
          "Outro usuário (mesmo tenant)",
          "Gerente (mesmo tenant)",
          "Gerente (outro tenant)",
        ],
        linhas: [
          ["`GET /pedidos/{id}`", "401", "200", "403", "200", "404"],
          ["`PATCH /pedidos/{id}`", "401", "200", "403", "200", "404"],
          ["`DELETE /pedidos/{id}`", "401", "403", "403", "200", "404"],
          ["`POST /pedidos/{id}/aprovar`", "401", "403", "403", "200", "404"],
        ],
        nota: "Os códigos são um exemplo de política. Decida por escrito se o acesso a um objeto de outro tenant devolve 403 ou 404 (o 404 não revela que o objeto existe) e teste exatamente isso. O dono não aprova o próprio pedido: é a separação de funções virando teste (veja Q110).",
      },
      {
        tipo: "codigo",
        titulo: "A matriz como teste parametrizado",
        legenda: "TypeScript",
        codigo: `import { describe, expect, it } from "vitest";
import { chamar, tokenDe } from "./ajudantes";

// [método, caminho, papel, status esperado]
const matriz = [
  ["GET", "/pedidos/p1", "anonimo", 401],
  ["GET", "/pedidos/p1", "dono", 200],
  ["GET", "/pedidos/p1", "outro_usuario", 403],
  ["GET", "/pedidos/p1", "gerente_outro_tenant", 404],
  ["DELETE", "/pedidos/p1", "dono", 403],
  ["POST", "/pedidos/p1/aprovar", "dono", 403],
] as const;

describe("matriz de permissões", () => {
  it.each(matriz)("%s %s como %s -> %i", async (metodo, caminho, papel, esperado) => {
    const resposta = await chamar(metodo, caminho, await tokenDe(papel));
    expect(resposta.status).toBe(esperado);
  });
});`,
        nota: "`chamar` e `tokenDe` são ajudantes do projeto: o primeiro faz a requisição à API de teste, o segundo obtém um token de cada papel (anônimo, sem token). O que importa é a tabela: nova rota ou novo papel é uma linha nova.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Onde os bugs aparecem: negativos e rotas sem política",
        texto:
          "Uma suíte que só confirma que o papel certo consegue (200) continua verde com a autorização desligada. O valor está nos casos que **devem falhar** e em garantir que **nenhuma rota fique sem decisão** (negar por padrão). Teste na API, não na interface: um botão escondido não é controle de acesso. Esses testes, rodando a cada mudança, são também a evidência de que o controle foi validado, o que serve à auditoria de conformidade.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Teste com autorização e com dados de teste",
        texto:
          "Rode testes de segurança em ambientes de teste, com contas e dados sintéticos, e com autorização por escrito para ferramentas de varredura e testes de invasão. Nunca contra sistemas de terceiros. Os tokens de teste também são credenciais: guarde-os fora do repositório.",
      },
    ],
    armadilhas: [
      "Testar só o caminho feliz (o papel certo recebe 200) e nunca o que deve ser negado.",
      "Testar pela interface: o botão escondido não é controle, e o atacante chama a API direto.",
      "Manter a matriz à mão e desatualizada, sem um teste que descubra a rota nova sem política.",
      "Usar um único usuário (ou só o administrador) nos testes: erros de ID (BOLA) só aparecem com duas contas do mesmo papel e dois tenants.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre escalonamento horizontal e vertical, e como cada um é testado?",
        resposta:
          "Horizontal é acessar dados de outra pessoa do mesmo nível: testa-se com duas contas do mesmo papel, trocando IDs de objetos. Vertical é fazer o que só um papel maior pode: testa-se chamando funções de administração com um papel menor, forçando campos como `role` e métodos que a interface não usa.",
      },
      {
        pergunta: "Como a verificação contínua evita regressões de autorização?",
        resposta:
          "A matriz roda no pipeline a cada mudança, e uma regressão quebra o build. Um teste que enumera as rotas exige uma declaração de autorização em cada uma, de modo que uma rota nova sem política também falha. A cobertura e a mutação mostram se os testes de fato detectam uma checagem removida.",
      },
    ],
  },
  en: {
    titulo: "Testing access control",
    pergunta:
      "How do you test an application's access control? Describe permission matrix tests, negative cases, horizontal and vertical escalation, and continuous verification.",
    porqueEsteMetodo:
      "Testing authorization is a routine with an order: first say what is correct, then prove what is allowed and, above all, what is forbidden, and finally keep that from being lost. The playbook gives the sequence and the criterion of each stage.",
    resposta30s:
      "Write the policy as a **role × resource × action matrix** and generate automated tests from it that cover what is allowed and, above all, the **negative cases** (no token, expired token, insufficient scope, another tenant). Look for the classic failures: **horizontal** (swapping the ID of someone else’s object) and **vertical** (a lower role calling a higher role’s function), and complement with security testing tools. Run everything in the pipeline and treat a regression as a build failure, including a route with no policy.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Authorization testing playbook",
        passos: [
          {
            titulo: "1. Write the policy as a matrix",
            texto:
              "List role × resource × action, with the conditions (object owner, same tenant, resource state) and the expected result, **including the “cannot”** and the refusal code (401, 403 or 404). It is the specification of what is correct: without it there is nothing to test. Criterion: every route and every function appears in the matrix.",
          },
          {
            titulo: "2. Automate the matrix, with the negatives",
            texto:
              "Generate the tests from the matrix itself (a single source) and call the real API with a token for each role. Include the negative cases: no token, expired or revoked token, invalid signature, insufficient scope, a token from another tenant, a disabled user. The happy path almost always works; the bugs live in the negatives.",
          },
          {
            titulo: "3. Horizontal escalation (same level)",
            texto:
              "With two accounts of the same role (and two tenants), account A tries to read, change and delete account B’s objects by swapping IDs in the path, the query, the body, headers and batch operations (see Q136). Also test listings and searches (do they leak other people’s data?), exports, files, signed links and notifications.",
          },
          {
            titulo: "4. Vertical escalation (a level up)",
            texto:
              "A lower role calls the functions of a higher role: admin endpoints, HTTP methods the interface does not use (`PUT`, `DELETE`), URLs the menu hides, fields such as `role` or `isAdmin` in the body (mass assignment), a token with altered claims (see Q132). Sign of success: every call gets the refusal the matrix predicts.",
          },
          {
            titulo: "5. Context, time and flow",
            texto:
              "A removed role with an old token still accepted; an ended session; a resource in a state that does not allow the action; a multi-step flow with a step skipped (approve without going through review). This is where the ordering and state errors that a simple matrix does not show appear.",
          },
          {
            titulo: "6. Complement with tools and review",
            texto:
              "A security testing proxy (for example OWASP ZAP or Burp Suite, with extensions that replay requests with another token), SAST and DAST in the pipeline, code review of the decision points (see Q115) and, when the policy is code, tests of the policy itself (see Q113 and Q114). A periodic penetration test covers what automation does not imagine.",
          },
          {
            titulo: "7. Verify continuously",
            texto:
              "Run the suite in the pipeline and treat a regression as a build failure. Add a test that enumerates the routes and requires an authorization declaration on each one (deny by default: a route with no policy breaks the build). Measure matrix coverage (routes × roles tested) and use mutation testing: if you remove the authorization `if`, does some test break? Keep the reports as audit evidence and keep the periodic access review going (see Q119).",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "A slice of the matrix (expected results)",
        colunas: [
          "Action",
          "Anonymous",
          "Order owner",
          "Other user (same tenant)",
          "Manager (same tenant)",
          "Manager (other tenant)",
        ],
        linhas: [
          ["`GET /orders/{id}`", "401", "200", "403", "200", "404"],
          ["`PATCH /orders/{id}`", "401", "200", "403", "200", "404"],
          ["`DELETE /orders/{id}`", "401", "403", "403", "200", "404"],
          ["`POST /orders/{id}/approve`", "401", "403", "403", "200", "404"],
        ],
        nota: "The codes are an example policy. Decide in writing whether access to another tenant’s object returns 403 or 404 (404 does not reveal that the object exists) and test exactly that. The owner does not approve their own order: separation of duties turned into a test (see Q110).",
      },
      {
        tipo: "codigo",
        titulo: "The matrix as a parameterized test",
        legenda: "TypeScript",
        codigo: `import { describe, expect, it } from "vitest";
import { call, tokenFor } from "./helpers";

// [method, path, role, expected status]
const matrix = [
  ["GET", "/orders/o1", "anonymous", 401],
  ["GET", "/orders/o1", "owner", 200],
  ["GET", "/orders/o1", "other_user", 403],
  ["GET", "/orders/o1", "manager_other_tenant", 404],
  ["DELETE", "/orders/o1", "owner", 403],
  ["POST", "/orders/o1/approve", "owner", 403],
] as const;

describe("permission matrix", () => {
  it.each(matrix)("%s %s as %s -> %i", async (method, path, role, expected) => {
    const response = await call(method, path, await tokenFor(role));
    expect(response.status).toBe(expected);
  });
});`,
        nota: "`call` and `tokenFor` are project helpers: the first makes the request to the test API, the second gets a token for each role (anonymous means no token). What matters is the table: a new route or role is one more row.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Where the bugs show up: negatives and routes without a policy",
        texto:
          "A suite that only confirms the right role succeeds (200) stays green with authorization switched off. The value is in the cases that **must fail** and in making sure **no route is left without a decision** (deny by default). Test at the API, not at the interface: a hidden button is not access control. These tests, running on every change, are also the evidence that the control was validated, which serves compliance audits.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Test with authorization and with test data",
        texto:
          "Run security tests in test environments, with synthetic accounts and data, and with written authorization for scanning tools and penetration tests. Never against third-party systems. Test tokens are credentials too: keep them out of the repository.",
      },
    ],
    armadilhas: [
      "Testing only the happy path (the right role gets 200) and never what must be denied.",
      "Testing through the interface: the hidden button is not a control, and the attacker calls the API directly.",
      "Keeping the matrix by hand and out of date, with no test that discovers a new route without a policy.",
      "Using a single user (or only the administrator) in the tests: ID errors (BOLA) only show up with two accounts of the same role and two tenants.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between horizontal and vertical escalation, and how is each one tested?",
        resposta:
          "Horizontal is accessing another person’s data at the same level: you test with two accounts of the same role, swapping object IDs. Vertical is doing what only a higher role may do: you test by calling admin functions with a lower role, forcing fields such as `role` and methods the interface does not use.",
      },
      {
        pergunta: "How does continuous verification prevent authorization regressions?",
        resposta:
          "The matrix runs in the pipeline on every change, and a regression breaks the build. A test that enumerates the routes requires an authorization declaration on each one, so a new route without a policy fails too. Coverage and mutation show whether the tests really detect a removed check.",
      },
    ],
  },
};
