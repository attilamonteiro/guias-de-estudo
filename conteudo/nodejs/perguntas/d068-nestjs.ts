import type { Pergunta } from "../../tipos";

// D68 · NestJS
export const d068: Pergunta = {
  numero: 368,
  modulo: "devinterview-avancado",
  metodo: "compare",
  pt: {
    titulo: "NestJS",
    pergunta: "O que é o NestJS e quando você o escolheria para o seu projeto Node.js?",
    porqueEsteMetodo:
      "“Quando escolher?” é uma pergunta de comparação: o NestJS só faz sentido contra as alternativas mais simples. A matriz mostra o que ele traz pronto e o que cobra em troca, e a regra de decisão diz quando compensa.",
    resposta30s:
      "O **NestJS** é um framework **opinativo em TypeScript** que organiza a aplicação em **módulos, controladores e provedores**, com **injeção de dependência** e **decorators**, e roda sobre **Express** (o padrão) ou **Fastify**. Traz convenções e integrações prontas (OpenAPI, GraphQL, microsserviços, filas, testes). Vale para **times grandes, sistemas duradouros e domínio rico**; é exagero para scripts e APIs pequenas.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "O NestJS e as alternativas",
        colunas: ["Framework", "Filosofia", "Estrutura pronta", "Escolha quando"],
        linhas: [
          [
            "NestJS",
            "Opinativo: módulos, controladores, provedores, injeção de dependência e decorators; TypeScript em primeiro lugar; roda sobre Express ou Fastify",
            "Muita: organização do projeto, validação, guards, interceptors, testes e integrações",
            "Vários times, aplicação grande e duradoura, domínio rico, necessidade de convenções comuns",
          ],
          [
            "Express",
            "Minimalista: roteamento e middlewares, sem opinião sobre o resto",
            "Pouca: estrutura, validação e tratamento de erros ficam por sua conta",
            "API simples a média, protótipo, time que já o conhece",
          ],
          [
            "Fastify",
            "Enxuto, com plugins e validação por esquema (JSON Schema)",
            "Média: validação, serialização e log embutidos, estrutura livre",
            "API que valoriza contratos validados e baixo custo por requisição",
          ],
          [
            "Koa",
            "Núcleo mínimo, pensado para `async`/`await` (veja D67)",
            "Mínima: o resto vem de pacotes à parte",
            "Quem quer montar a própria pilha, peça por peça",
          ],
        ],
        nota: "O NestJS não concorre com o Express e o Fastify no mesmo plano: ele se apoia em um deles (o adaptador HTTP) e acrescenta a camada de organização por cima.",
      },
      {
        tipo: "codigo",
        titulo: "Módulo, controlador e provedor",
        legenda: "TypeScript",
        codigo: `import { Controller, Get, Injectable, Module, Param } from "@nestjs/common";
@Injectable()
class ClientesService {
  buscar(id: string) {
    return { id, nome: "Ana" };
  }
}

@Controller("clientes")
class ClientesController {
  constructor(private readonly clientes: ClientesService) {} // o Nest injeta
  @Get(":id")
  buscar(@Param("id") id: string) {
    return this.clientes.buscar(id);
  }
}

@Module({ controllers: [ClientesController], providers: [ClientesService] })
export class ClientesModule {}`,
        nota: "O Nest cria o `ClientesService` e o entrega ao construtor do controlador (injeção de dependência); o `@Module` declara o que pertence ao módulo. Os decorators dependem da configuração do TypeScript do projeto, que o gerador do Nest já traz; confira a documentação em docs.nestjs.com.",
      },
      {
        tipo: "fluxo",
        titulo: "O caminho de uma requisição no Nest",
        etapas: [
          "**Middleware**: o mesmo conceito do Express ou do Fastify (log, cabeçalhos)",
          "**Guards**: decidem se a requisição pode seguir (autenticação, papéis)",
          "**Interceptors** (antes): envolvem o handler (medir tempo, cache, log)",
          "**Pipes**: validam e transformam parâmetros e corpo (por exemplo, `ValidationPipe`)",
          "**Handler** do controlador, que chama os provedores com a regra de negócio",
          "**Interceptors** (depois) moldam a resposta; se algo lançar erro em qualquer ponto, um **exception filter** o converte em resposta HTTP",
        ],
        nota: "Cada peça tem um lugar fixo no ciclo, e é isso que deixa os projetos Nest parecidos entre si.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Escolha o NestJS quando **a estrutura é o problema**: vários times, vida longa, domínio rico, necessidade de convenções, testes com injeção de dependência e integrações prontas (OpenAPI, GraphQL, microsserviços, filas, WebSockets). Escolha **Express, Fastify ou Koa** quando o serviço é pequeno, um script, uma API enxuta ou quando o time prefere escolher cada peça. Se você descreve o projeto em um arquivo, o Nest provavelmente é peso a mais.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Os custos do Nest",
        texto:
          "A curva de aprendizado é real (módulos, injeção de dependência, decorators, ciclo de vida), há mais código e mais arquivos para o mesmo endpoint e existe uma camada a mais entre você e o HTTP. Se o time não usa TypeScript ou não aproveita as convenções, o custo supera o ganho.",
      },
    ],
    armadilhas: [
      "Usar o NestJS em um script ou numa API de três rotas: a estrutura custa mais do que ajuda.",
      "Achar que o Nest substitui o Express ou o Fastify: ele roda sobre um deles e herda os limites do adaptador.",
      "Esquecer de registrar o provedor em `providers` (ou de exportá-lo para outros módulos): a injeção falha na partida com “can’t resolve dependencies”.",
      "Pôr regra de negócio no controlador: o lugar dela é o provedor (serviço), onde se testa e se reaproveita.",
    ],
    autoteste: [
      {
        pergunta: "Para que servem guards, pipes e interceptors?",
        resposta:
          "Guards decidem se a requisição pode seguir (autorização). Pipes validam e transformam a entrada. Interceptors envolvem o handler, antes e depois, para log, cache ou moldar a resposta.",
      },
      {
        pergunta: "Quando você não escolheria o NestJS?",
        resposta:
          "Em scripts, APIs muito pequenas, protótipos rápidos ou times sem TypeScript, onde a estrutura e a curva de aprendizado custam mais do que o ganho.",
      },
    ],
  },
  en: {
    titulo: "NestJS",
    pergunta: "What is NestJS and when would you choose it for your Node.js project?",
    porqueEsteMetodo:
      "“When would you choose it?” is a comparison question: NestJS only makes sense next to the simpler alternatives. The matrix shows what it ships ready-made and what it charges in return, and the decision rule says when it pays off.",
    resposta30s:
      "**NestJS** is an **opinionated TypeScript framework** that organizes an application into **modules, controllers and providers**, with **dependency injection** and **decorators**, and runs on top of **Express** (the default) or **Fastify**. It brings conventions and ready-made integrations (OpenAPI, GraphQL, microservices, queues, testing). It pays off for **large teams, long-lived systems and rich domains**; it is overkill for scripts and small APIs.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "NestJS and the alternatives",
        colunas: ["Framework", "Philosophy", "Structure provided", "Choose it when"],
        linhas: [
          [
            "NestJS",
            "Opinionated: modules, controllers, providers, dependency injection and decorators; TypeScript first; runs on Express or Fastify",
            "A lot: project organization, validation, guards, interceptors, testing and integrations",
            "Several teams, a large and long-lived application, a rich domain, a need for shared conventions",
          ],
          [
            "Express",
            "Minimalist: routing and middleware, no opinion on the rest",
            "Little: structure, validation and error handling are up to you",
            "A simple to medium API, a prototype, a team that already knows it",
          ],
          [
            "Fastify",
            "Lean, with plugins and schema validation (JSON Schema)",
            "Medium: validation, serialization and logging built in, free-form structure",
            "An API that values validated contracts and low per-request overhead",
          ],
          [
            "Koa",
            "Minimal core, built for `async`/`await` (see D67)",
            "Minimal: the rest comes from separate packages",
            "Anyone who wants to assemble their own stack, piece by piece",
          ],
        ],
        nota: "NestJS does not compete with Express and Fastify on the same level: it sits on one of them (the HTTP adapter) and adds an organization layer on top.",
      },
      {
        tipo: "codigo",
        titulo: "Module, controller and provider",
        legenda: "TypeScript",
        codigo: `import { Controller, Get, Injectable, Module, Param } from "@nestjs/common";
@Injectable()
class CustomersService {
  find(id: string) {
    return { id, name: "Ana" };
  }
}

@Controller("customers")
class CustomersController {
  constructor(private readonly customers: CustomersService) {} // Nest injects it
  @Get(":id")
  find(@Param("id") id: string) {
    return this.customers.find(id);
  }
}

@Module({ controllers: [CustomersController], providers: [CustomersService] })
export class CustomersModule {}`,
        nota: "Nest creates the `CustomersService` and hands it to the controller’s constructor (dependency injection); `@Module` declares what belongs to the module. The decorators depend on the project’s TypeScript configuration, which the Nest generator already provides; check the documentation at docs.nestjs.com.",
      },
      {
        tipo: "fluxo",
        titulo: "The path of a request in Nest",
        etapas: [
          "**Middleware**: the same concept as in Express or Fastify (logging, headers)",
          "**Guards**: decide whether the request may proceed (authentication, roles)",
          "**Interceptors** (before): wrap the handler (timing, caching, logging)",
          "**Pipes**: validate and transform parameters and body (for example, `ValidationPipe`)",
          "The controller’s **handler**, which calls the providers holding the business rules",
          "**Interceptors** (after) shape the response; if anything throws at any point, an **exception filter** turns it into an HTTP response",
        ],
        nota: "Each piece has a fixed place in the cycle, which is what makes Nest projects look alike.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Choose NestJS when **structure is the problem**: several teams, long life, a rich domain, a need for conventions, testing with dependency injection and ready-made integrations (OpenAPI, GraphQL, microservices, queues, WebSockets). Choose **Express, Fastify or Koa** when the service is small, a script, a lean API or when the team prefers to pick each piece. If you can describe the project in one file, Nest is probably extra weight.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The costs of Nest",
        texto:
          "The learning curve is real (modules, dependency injection, decorators, lifecycle), there is more code and more files for the same endpoint, and there is an extra layer between you and HTTP. If the team does not use TypeScript or does not benefit from the conventions, the cost outweighs the gain.",
      },
    ],
    armadilhas: [
      "Using NestJS for a script or a three-route API: the structure costs more than it helps.",
      "Thinking Nest replaces Express or Fastify: it runs on one of them and inherits the adapter’s limits.",
      "Forgetting to register the provider in `providers` (or to export it to other modules): injection fails at startup with a “can’t resolve dependencies” error.",
      "Putting business rules in the controller: they belong in the provider (service), where they can be tested and reused.",
    ],
    autoteste: [
      {
        pergunta: "What are guards, pipes and interceptors for?",
        resposta:
          "Guards decide whether the request may proceed (authorization). Pipes validate and transform the input. Interceptors wrap the handler, before and after, for logging, caching or shaping the response.",
      },
      {
        pergunta: "When would you not choose NestJS?",
        resposta:
          "For scripts, very small APIs, quick prototypes or teams without TypeScript, where the structure and the learning curve cost more than the gain.",
      },
    ],
  },
};
