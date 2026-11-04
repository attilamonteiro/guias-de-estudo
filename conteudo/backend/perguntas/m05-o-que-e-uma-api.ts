import type { Pergunta } from "../../tipos";

// M05 · O que é uma API
export const m05: Pergunta = {
  numero: 205,
  modulo: "mentorcruise",
  metodo: "feynman",
  pt: {
    titulo: "O que é uma API",
    pergunta: "Você pode explicar brevemente o que é uma API e dar um exemplo de aplicação?",
    porqueEsteMetodo:
      "API é um conceito simples que costuma sair embaralhado (confundido com URL, com HTTP, com REST). Uma analogia do cotidiano fixa a ideia de contrato, e o exemplo concreto mostra a ideia funcionando.",
    resposta30s:
      "Uma **API** é um **contrato** que diz como um software pode pedir algo a outro: quais operações existem, que dados entram e saem e que erros podem ocorrer, sem mostrar como isso é feito por dentro. Exemplo: uma loja chama a **API web** de um serviço de pagamento (uma requisição HTTP com JSON) e recebe o `status` da cobrança. Como muitos clientes dependem do contrato, ele precisa de **documentação e versionamento**.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense na lavanderia de bairro. Você não entra na área das máquinas: preenche uma ficha com nome, tipo de serviço e prazo, entrega as peças e recebe um comprovante; quando fica pronto, você retira. A lavanderia pode trocar de máquina, de funcionário ou de sabão sem que você perceba, desde que a ficha, os serviços oferecidos e o que você recebe de volta continuem iguais.",
        tecnico:
          "A ficha e as regras do balcão são a **API**: um contrato que define as operações disponíveis, o formato do que entra e do que sai, os erros possíveis e as regras de uso (quem pode pedir, quantas vezes). Quem chama depende só do contrato, e quem implementa fica livre para mudar o que há por trás dele. Existem duas formas comuns: a **API de biblioteca**, chamada como função dentro do mesmo programa (o `json.loads` do Python, por exemplo), e a **API web**, chamada pela rede, em geral por HTTP com JSON, em que cada operação é um endpoint (veja R01), muitas vezes seguindo o estilo REST (veja R03).",
        limite:
          "O atendente da lavanderia é flexível: entende uma ficha mal preenchida e resolve no balcão. Uma API é literal: campo faltando ou em formato errado vira recusa com um código de erro. Ela também atende milhares de clientes ao mesmo tempo, precisa saber quem é cada um (autenticação) e limitar abusos. E, se a lavanderia trocar a ficha sem avisar, todo cliente que dependia do formato antigo quebra de uma vez.",
      },
      {
        tipo: "fluxo",
        titulo: "Exemplo: cobrar um pedido com a API de um serviço de pagamento",
        etapas: [
          "O backend da loja monta uma requisição `POST` com valor, moeda e um token que representa o cartão, mais a chave de autenticação",
          "A requisição segue por HTTPS até o serviço de pagamento, que confere a credencial e os dados",
          "O serviço conversa com o banco emissor; a loja não vê nem precisa conhecer essa etapa",
          "A resposta volta em JSON com o `status` da cobrança (aprovada ou recusada) e um `id` do pagamento",
          "A loja grava o `id`, atualiza o pedido e, se a rede falhar, repete a chamada com a mesma chave de idempotência (veja Q30)",
        ],
        nota: "Outros exemplos comuns: mapas (pedir a rota entre dois endereços), clima (pedir a previsão de uma cidade) e login social (pedir a identidade de um usuário a outro serviço).",
      },
      {
        tipo: "tabela",
        titulo: "API de biblioteca vs API web",
        colunas: ["", "API de biblioteca", "API web"],
        linhas: [
          ["Onde roda", "No mesmo processo do seu programa", "Em outro servidor, alcançado pela rede"],
          ["Como se chama", "Chamada de função ou método", "Requisição HTTP (endereço, método, cabeçalhos, corpo)"],
          [
            "Falhas típicas",
            "Exceção, erro de tipo ou de argumento",
            "Timeout, rede fora do ar, respostas `4xx` e `5xx`",
          ],
          ["Custo da chamada", "Muito baixo, tudo em memória", "Maior e variável, porque envolve a rede"],
          [
            "O contrato é",
            "Assinaturas, tipos e documentação da biblioteca",
            "Endpoints, formatos de JSON, códigos de status e autenticação",
          ],
          [
            "Como muda",
            "Você escolhe quando atualizar a versão",
            "O servidor muda para todos de uma vez, por isso exige versionamento (veja R08)",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O contrato é o produto",
        texto:
          "Quem consome depende do que a API promete, não de como ela é feita por dentro. Remover um campo, trocar um tipo ou mudar o significado de uma resposta quebra clientes que você talvez nem conheça; por isso esses casos pedem uma versão nova ou um período em que as duas convivem. Acrescentar um campo opcional costuma ser seguro, desde que os clientes ignorem o que não conhecem.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "API, endpoint, HTTP e REST não são sinônimos",
        texto:
          "A API é o contrato inteiro. O endpoint é um ponto de acesso dentro dela (um endereço combinado com um método). HTTP é o protocolo que leva o pedido. REST é um estilo de desenhar APIs web sobre HTTP. Uma API pode existir sem nenhum dos dois, como a de uma biblioteca ou a de um sistema operacional.",
      },
    ],
    armadilhas: [
      "Chamar de “API” só o endereço (a URL) ou só o servidor: a API é o contrato.",
      "Achar que toda API é web, em HTTP e JSON: bibliotecas, sistemas operacionais e dispositivos também têm APIs.",
      "Mudar o contrato sem avisar (renomear um campo, por exemplo): quebra clientes que você nem sabe que existem.",
      "Vazar a implementação pela API, com nomes de tabelas, identificadores internos ou stack trace nas respostas de erro: isso amarra os clientes ao que deveria poder mudar.",
    ],
    autoteste: [
      {
        pergunta: "Em uma frase, o que é uma API?",
        resposta:
          "Um contrato que define como um programa pede serviços a outro (operações, entradas, saídas e erros), escondendo como o serviço é implementado.",
      },
      {
        pergunta: "Qual é a diferença entre uma API de biblioteca e uma API web?",
        resposta:
          "A de biblioteca é chamada como função dentro do mesmo processo. A web é chamada pela rede, em geral por HTTP, e por isso sofre latência, timeouts e mudanças feitas no servidor sem que o cliente atualize nada.",
      },
      {
        pergunta: "Por que versionar uma API?",
        resposta:
          "Para poder mudar o contrato sem quebrar quem já o usa: a versão antiga continua funcionando durante a transição, e cada cliente migra no seu tempo.",
      },
    ],
  },
  en: {
    titulo: "What an API is",
    pergunta: "Can you briefly explain what an API is and provide an example of its application?",
    porqueEsteMetodo:
      "An API is a simple concept that often comes out muddled (confused with a URL, with HTTP, with REST). An everyday analogy pins down the idea of a contract, and a concrete example shows it at work.",
    resposta30s:
      "An **API** is a **contract** that says how one piece of software can ask another for something: which operations exist, what data goes in and out and which errors can occur, without showing how it is done inside. Example: a shop calls the **web API** of a payment service (an HTTP request with JSON) and gets back the charge `status`. Since many clients depend on the contract, it needs **documentation and versioning**.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of the neighborhood dry cleaner. You do not walk into the machine room: you fill in a form with your name, type of service and deadline, hand over the clothes and get a receipt; when it is ready, you pick it up. The dry cleaner can change machines, staff or cleaning products without you noticing, as long as the form, the services offered and what you get back stay the same.",
        tecnico:
          "The form and the counter’s rules are the **API**: a contract that defines the available operations, the format of what goes in and out, the possible errors and the usage rules (who may ask, how often). The caller depends only on the contract, and the implementer is free to change whatever lies behind it. There are two common kinds: the **library API**, called as a function inside the same program (Python’s `json.loads`, for example), and the **web API**, called over the network, usually through HTTP with JSON, where each operation is an endpoint (see R01), often following the REST style (see R03).",
        limite:
          "The dry cleaner’s clerk is flexible: she understands a badly filled form and sorts it out at the counter. An API is literal: a missing or wrongly formatted field becomes a rejection with an error code. It also serves thousands of clients at once, must know who each one is (authentication) and limit abuse. And if the dry cleaner changes the form without notice, every customer who relied on the old format breaks at once.",
      },
      {
        tipo: "fluxo",
        titulo: "Example: charging an order through a payment service’s API",
        etapas: [
          "The shop’s backend builds a `POST` request with amount, currency and a token that stands for the card, plus the authentication key",
          "The request travels over HTTPS to the payment service, which checks the credential and the data",
          "The service talks to the issuing bank; the shop neither sees nor needs to know this step",
          "The response comes back as JSON with the charge `status` (approved or declined) and a payment `id`",
          "The shop stores the `id`, updates the order and, if the network fails, repeats the call with the same idempotency key (see Q30)",
        ],
        nota: "Other common examples: maps (ask for the route between two addresses), weather (ask for a city’s forecast) and social login (ask another service for a user’s identity).",
      },
      {
        tipo: "tabela",
        titulo: "Library API vs web API",
        colunas: ["", "Library API", "Web API"],
        linhas: [
          ["Where it runs", "In the same process as your program", "On another server, reached over the network"],
          ["How it is called", "A function or method call", "An HTTP request (address, method, headers, body)"],
          ["Typical failures", "Exception, type or argument error", "Timeout, network down, `4xx` and `5xx` responses"],
          ["Cost of a call", "Very low, all in memory", "Higher and variable, because the network is involved"],
          [
            "The contract is",
            "The library’s signatures, types and documentation",
            "Endpoints, JSON formats, status codes and authentication",
          ],
          [
            "How it changes",
            "You choose when to upgrade the version",
            "The server changes for everyone at once, so it needs versioning (see R08)",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The contract is the product",
        texto:
          "Consumers depend on what the API promises, not on how it is built inside. Removing a field, changing a type or altering the meaning of a response breaks clients you may not even know about; those cases call for a new version or a period when both coexist. Adding an optional field is usually safe, as long as clients ignore what they do not recognize.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "API, endpoint, HTTP and REST are not synonyms",
        texto:
          "The API is the whole contract. An endpoint is one access point inside it (an address combined with a method). HTTP is the protocol that carries the request. REST is a style for designing web APIs over HTTP. An API can exist with neither, like a library’s or an operating system’s.",
      },
    ],
    armadilhas: [
      "Calling only the address (the URL) or only the server “the API”: the API is the contract.",
      "Thinking every API is a web API, over HTTP and JSON: libraries, operating systems and devices have APIs too.",
      "Changing the contract without notice (renaming a field, for example): it breaks clients you do not even know exist.",
      "Leaking the implementation through the API, with table names, internal identifiers or stack traces in error responses: it ties clients to what should be free to change.",
    ],
    autoteste: [
      {
        pergunta: "In one sentence, what is an API?",
        resposta:
          "A contract that defines how one program asks another for services (operations, inputs, outputs and errors), hiding how the service is implemented.",
      },
      {
        pergunta: "What is the difference between a library API and a web API?",
        resposta:
          "A library API is called as a function inside the same process. A web API is called over the network, usually through HTTP, so it suffers latency, timeouts and server-side changes that the client did not upgrade for.",
      },
      {
        pergunta: "Why version an API?",
        resposta:
          "So the contract can change without breaking those who already use it: the old version keeps working during the transition, and each client migrates at its own pace.",
      },
    ],
  },
};
