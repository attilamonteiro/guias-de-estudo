import type { Pergunta } from "../../tipos";

// M15 · Arquitetura MVC
export const m15: Pergunta = {
  numero: 215,
  modulo: "mentorcruise",
  metodo: "trace",
  pt: {
    titulo: "Arquitetura MVC",
    pergunta: "Você pode descrever como funciona a arquitetura MVC?",
    porqueEsteMetodo:
      "MVC é uma divisão de responsabilidades, e ela só fica clara quando se segue um pedido por dentro dela. Acompanhar um único pedido HTTP, do roteador até a resposta, mostra o que cada peça faz, o que não deve fazer e o que acontece quando algo falha.",
    resposta30s:
      "MVC separa a aplicação em três papéis: **Model** (dados e regras de negócio), **View** (como o resultado é apresentado) e **Controller** (recebe o pedido, coordena e escolhe a resposta). O roteador entrega o pedido ao controller, que valida a entrada e chama o model ou um serviço, que fala com o banco; o resultado segue para a view, que gera o HTML ou, numa API, o JSON. Ganha-se separação de responsabilidades e testabilidade; o erro clássico é o **controller gordo** (ou o model gordo).",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Um pedido do começo ao fim: `POST /pedidos`",
        etapas: [
          "**Roteador**: casa método e caminho com uma ação do controller (antes rodam middlewares: autenticação, leitura do corpo)",
          "**Controller**: lê os parâmetros e valida a entrada (campos, tipos, limites), sem regra de negócio",
          "**Model ou serviço**: aplica as regras (estoque, preço, limites) e pede a gravação numa transação",
          "**Banco**: executa os `INSERT` e `UPDATE` e confirma ou desfaz a transação",
          "**Controller** recebe o resultado ou o erro de domínio e escolhe o status (`201`, `409`, `422`)",
          "**View**: um template gera o HTML, ou um serializador monta o JSON, só com dados já prontos",
          "O servidor devolve a resposta HTTP ao cliente",
        ],
        nota: "As dependências apontam num só sentido: o controller conhece o model e a view; o model não conhece o controller, a view nem o HTTP. É isso que permite testar as regras sem subir um servidor e reaproveitá-las num job, numa fila ou num comando de terminal.",
      },
      {
        tipo: "tabela",
        titulo: "Quem faz o quê",
        colunas: ["Peça", "Faz", "Não deveria"],
        linhas: [
          ["Roteador", "Mapeia método e caminho para um controller e uma ação", "Decidir regras ou transformar dados"],
          [
            "Controller",
            "Traduz HTTP em chamada de domínio: lê parâmetros, valida a entrada, chama o model ou serviço, escolhe o status e a view",
            "Conter regra de negócio, SQL ou montagem de HTML",
          ],
          [
            "Model",
            "Guarda o estado e as regras do domínio; a persistência fica nele (Active Record) ou num repositório à parte (Data Mapper)",
            "Conhecer request, response, sessão ou status HTTP",
          ],
          [
            "View",
            "Apresenta o resultado: template HTML ou serializador JSON",
            "Consultar o banco, decidir regras ou gravar algo",
          ],
        ],
      },
      {
        tipo: "passos",
        titulo: "Agora os caminhos em que algo dá errado",
        passos: [
          {
            titulo: "Entrada inválida",
            texto:
              "O controller (ou a camada de validação) recusa com `400` ou `422` e uma mensagem por campo. O model nem chega a ser chamado.",
          },
          {
            titulo: "Regra de negócio violada",
            texto:
              "O model ou serviço sinaliza um erro de domínio (por exemplo, estoque insuficiente), sem saber de HTTP. O controller o traduz para `409` ou `422`, e a view de erro monta o corpo da resposta.",
          },
          {
            titulo: "O banco falha",
            texto:
              "A transação sofre rollback e o erro técnico sobe até um tratador central, que responde `500` genérico. O detalhe fica no log, não na resposta.",
          },
          {
            titulo: "A view quebra ao renderizar",
            texto:
              "O dado já foi gravado, mas o usuário vê um erro. Por isso a view só formata dados prontos e nunca consulta nem grava.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "MVC com páginas no servidor × MVC numa API",
        colunas: ["Aspecto", "Páginas renderizadas no servidor", "API (JSON)"],
        linhas: [
          ["View", "Template com dados (por exemplo ERB, Jinja ou Thymeleaf)", "Serializador ou DTO que monta o JSON"],
          [
            "Quem consome",
            "O navegador, que segue links e envia formulários",
            "Outro programa, um front-end ou um app móvel",
          ],
          [
            "Próximo passo",
            "O servidor decide a próxima página (redirecionamento depois do POST)",
            "O cliente decide; o servidor devolve só dados e status",
          ],
          ["Erros", "Formulário renderizado de novo com as mensagens", "Status HTTP e um corpo de erro estruturado"],
        ],
        nota: "Na API a View não desaparece: ela vira a representação do recurso. A “tela” passa a ser outra aplicação, que muitas vezes tem a própria organização em componentes.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Controller gordo e model gordo",
        texto:
          "**Controller gordo**: regras, SQL e chamadas externas dentro da ação; só dá para testar subindo o HTTP, e a mesma regra se repete em cada ação. **Model gordo**: uma classe que valida, persiste, envia e-mail e formata, até virar um “deus” que ninguém altera sem medo. O remédio costuma ser o controller fino, as regras no domínio e um serviço ou caso de uso para orquestrar o que cruza vários models.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "MVC e arquitetura em camadas",
        texto:
          "MVC organiza sobretudo a fronteira de entrada e saída (receber, coordenar, apresentar). A arquitetura em camadas organiza o sistema inteiro: apresentação, serviço ou aplicação, domínio e acesso a dados. Num backend real os dois se combinam: o “Model” se desdobra em serviço, domínio e repositório. **MVP** e **MVVM** são variantes mais comuns em interfaces de cliente: no MVP um Presenter intermedia uma view passiva; no MVVM a view se liga (binding) ao estado exposto por um ViewModel.",
      },
    ],
    armadilhas: [
      "Controller gordo: regras, SQL e chamadas externas dentro da ação, impossíveis de testar sem HTTP.",
      "Model que conhece o HTTP (lê o `request`, devolve status): não dá para reutilizá-lo em job, fila ou terminal.",
      "Serializar o objeto do ORM direto na resposta: vaza campos internos (como o hash da senha) e prende o contrato da API ao esquema do banco.",
      "Template ou serializador que dispara consultas (carregamento preguiçoso): o N+1 só aparece na hora de renderizar.",
    ],
    autoteste: [
      {
        pergunta: "O que o controller faz e o que ele não deve fazer?",
        resposta:
          "Traduz HTTP em chamada ao domínio: lê e valida a entrada, chama o model ou serviço e escolhe status e view. Não deve conter regra de negócio, SQL nem montagem de HTML.",
      },
      {
        pergunta: "Numa API REST, onde fica a view do MVC?",
        resposta:
          "No serializador ou DTO que transforma o resultado em JSON (ou outro formato); a “tela” fica no cliente.",
      },
      {
        pergunta: "Qual a relação entre MVC e arquitetura em camadas?",
        resposta:
          "MVC trata da fronteira de entrada e saída; as camadas organizam o sistema todo. Em um backend, o Model se desdobra em serviço, domínio e acesso a dados.",
      },
    ],
  },
  en: {
    titulo: "MVC architecture",
    pergunta: "Can you describe how the MVC architecture works?",
    porqueEsteMetodo:
      "MVC is a division of responsibilities, and it only becomes clear when you follow a request through it. Tracing a single HTTP request from the router to the response shows what each piece does, what it must not do and what happens when something fails.",
    resposta30s:
      "MVC splits an application into three roles: the **Model** (data and business rules), the **View** (how the result is presented) and the **Controller** (receives the request, coordinates and picks the response). The router hands the request to the controller, which validates the input and calls the model or a service, which talks to the database; the result then goes to the view, which produces HTML or, in an API, JSON. You gain separation of concerns and testability; the classic mistake is the **fat controller** (or the fat model).",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One request from start to finish: `POST /orders`",
        etapas: [
          "**Router**: matches method and path to a controller action (middlewares run first: authentication, body parsing)",
          "**Controller**: reads the parameters and validates the input (fields, types, limits), with no business rules",
          "**Model or service**: applies the rules (stock, price, limits) and asks for the write inside a transaction",
          "**Database**: runs the `INSERT` and `UPDATE` statements and commits or rolls back the transaction",
          "**Controller** receives the result or the domain error and picks the status (`201`, `409`, `422`)",
          "**View**: a template renders the HTML, or a serializer builds the JSON, using only ready-made data",
          "The server sends the HTTP response back to the client",
        ],
        nota: "Dependencies point one way: the controller knows the model and the view; the model knows nothing about the controller, the view or HTTP. That is what lets you test the rules without starting a server and reuse them in a job, a queue consumer or a command-line tool.",
      },
      {
        tipo: "tabela",
        titulo: "Who does what",
        colunas: ["Piece", "Does", "Should not"],
        linhas: [
          ["Router", "Maps method and path to a controller and an action", "Decide rules or transform data"],
          [
            "Controller",
            "Translates HTTP into a domain call: reads parameters, validates input, calls the model or service, picks the status and the view",
            "Hold business rules, SQL or HTML assembly",
          ],
          [
            "Model",
            "Holds the domain state and rules; persistence lives in it (Active Record) or in a separate repository (Data Mapper)",
            "Know about the request, the response, the session or HTTP status",
          ],
          [
            "View",
            "Presents the result: an HTML template or a JSON serializer",
            "Query the database, decide rules or write anything",
          ],
        ],
      },
      {
        tipo: "passos",
        titulo: "Now the paths where something goes wrong",
        passos: [
          {
            titulo: "Invalid input",
            texto:
              "The controller (or a validation layer) rejects it with `400` or `422` and one message per field. The model is never even called.",
          },
          {
            titulo: "A business rule is violated",
            texto:
              "The model or service signals a domain error (for example, insufficient stock) without knowing about HTTP. The controller translates it to `409` or `422`, and the error view builds the response body.",
          },
          {
            titulo: "The database fails",
            texto:
              "The transaction rolls back and the technical error bubbles up to a central handler, which answers with a generic `500`. The detail goes to the log, not to the response.",
          },
          {
            titulo: "The view breaks while rendering",
            texto:
              "The data was already written, but the user sees an error. That is why the view only formats ready data and never queries or writes.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "MVC with server-rendered pages × MVC in an API",
        colunas: ["Aspect", "Server-rendered pages", "API (JSON)"],
        linhas: [
          [
            "View",
            "A template filled with data (for example ERB, Jinja or Thymeleaf)",
            "A serializer or DTO that builds the JSON",
          ],
          [
            "Who consumes it",
            "The browser, which follows links and submits forms",
            "Another program, a front end or a mobile app",
          ],
          [
            "Next step",
            "The server decides the next page (redirect after the POST)",
            "The client decides; the server only returns data and status",
          ],
          ["Errors", "The form is rendered again with the messages", "An HTTP status and a structured error body"],
        ],
        nota: "In an API the View does not disappear: it becomes the representation of the resource. The “screen” becomes another application, which often has its own component structure.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Fat controller and fat model",
        texto:
          "**Fat controller**: rules, SQL and external calls inside the action; it can only be tested by going through HTTP, and the same rule gets repeated in every action. **Fat model**: one class that validates, persists, sends e-mail and formats, until it becomes a “god object” nobody changes without fear. The usual remedy is a thin controller, rules in the domain and a service or use case to orchestrate whatever spans several models.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "MVC and layered architecture",
        texto:
          "MVC mainly organizes the input and output boundary (receive, coordinate, present). Layered architecture organizes the whole system: presentation, service or application, domain and data access. In a real backend the two combine: the “Model” unfolds into service, domain and repository. **MVP** and **MVVM** are variants more common in client interfaces: in MVP a Presenter mediates a passive view; in MVVM the view binds to state exposed by a ViewModel.",
      },
    ],
    armadilhas: [
      "A fat controller: rules, SQL and external calls inside the action, impossible to test without HTTP.",
      "A model that knows about HTTP (reads the `request`, returns status codes): it cannot be reused in a job, a queue or a terminal.",
      "Serializing the ORM object straight into the response: it leaks internal fields (such as the password hash) and ties the API contract to the database schema.",
      "A template or serializer that fires queries (lazy loading): the N+1 only shows up at render time.",
    ],
    autoteste: [
      {
        pergunta: "What does the controller do, and what must it not do?",
        resposta:
          "It translates HTTP into a domain call: reads and validates input, calls the model or service and picks the status and view. It must not hold business rules, SQL or HTML assembly.",
      },
      {
        pergunta: "In a REST API, where is the MVC view?",
        resposta:
          "In the serializer or DTO that turns the result into JSON (or another format); the “screen” lives in the client.",
      },
      {
        pergunta: "How does MVC relate to layered architecture?",
        resposta:
          "MVC deals with the input and output boundary; layers organize the whole system. In a backend the Model unfolds into service, domain and data access.",
      },
    ],
  },
};
