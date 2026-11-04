import type { Pergunta } from "../../tipos";

// P17 · HATEOAS
export const p017: Pergunta = {
  numero: 717,
  modulo: "pawanmkr-apis",
  metodo: "feynman",
  pt: {
    titulo: "HATEOAS",
    pergunta: "O que são os princípios HATEOAS e como eles se aplicam ao design de APIs REST?",
    porqueEsteMetodo:
      "HATEOAS soa abstrato até você notar que já o usa toda vez que navega num site. A analogia traz a ideia para o chão; depois vêm o mecanismo real e o ponto em que a comparação deixa de valer.",
    resposta30s:
      "**HATEOAS** (hipermídia como motor do estado da aplicação) é a restrição do REST em que cada resposta traz os **links e as ações possíveis naquele momento**, e o cliente **segue esses links** em vez de montar URLs a partir de uma documentação. O servidor passa a ditar as transições de estado (um pedido já pago não oferece o link de pagar), o que desacopla o cliente do formato das URLs; é o **nível 3** do modelo de maturidade de Richardson. Na prática poucas APIs chegam lá: respostas maiores e clientes que ainda precisam entender cada `rel` pesam contra.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense num site de compras. Você entra pela página inicial sem ter decorado endereço nenhum: clica em “Meus pedidos”, depois em um pedido, e a página mostra só os botões que fazem sentido agora (“Pagar”, se ainda está aberto; “Rastrear”, se já foi enviado). Se a loja reorganizar os endereços internos, você nem percebe, porque sempre segue os links que a própria página oferece.",
        tecnico:
          "**HATEOAS** (Hypermedia As The Engine Of Application State) é uma das restrições do estilo REST: o cliente entra por uma única URL e descobre o resto pelos **links** que vêm nas respostas. Cada link diz **para onde ir** (`href`), **o que significa** (`rel`, como `self`, `next` ou `cancelar`) e, em alguns formatos, **qual verbo** usar. Como o servidor monta os links a partir do estado do recurso, é ele que decide quais ações aparecem. No modelo de maturidade de Richardson é o **nível 3**, depois de recursos com URL própria (nível 1) e do uso correto de verbos e códigos de status HTTP (nível 2); o nível 0 é um único endpoint que recebe tudo por `POST`.",
        limite:
          "A analogia esconde o preço. Uma pessoa entende o texto “Pagar”; um programa não: ele precisa conhecer de antemão o significado de cada `rel` e saber que dados enviar. HATEOAS elimina a dependência do **formato das URLs**, não a do **vocabulário** da API, e por isso ainda existem documentação e contrato (veja P56).",
      },
      {
        tipo: "codigo",
        titulo: "Um pedido pendente, no estilo HAL",
        legenda: "JSON",
        codigo: [
          "{",
          '  "id": 42,',
          '  "status": "pendente",',
          '  "total": 150,',
          '  "_links": {',
          '    "self": { "href": "/pedidos/42" },',
          '    "itens": { "href": "/pedidos/42/itens" },',
          '    "pagar": { "href": "/pedidos/42/pagamento", "method": "POST" },',
          '    "cancelar": { "href": "/pedidos/42", "method": "DELETE" }',
          "  }",
          "}",
        ].join("\n"),
        nota: "O campo `method` está aqui só para ilustrar: o HAL puro não o define (o verbo vem da documentação da relação), enquanto o Siren descreve ações com `method`. Depois do pagamento, o servidor devolveria o mesmo pedido sem `pagar` nem `cancelar` e com um link para a nota fiscal: o **estado** manda nos links.",
      },
      {
        tipo: "tabela",
        titulo: "Formatos de hipermídia para JSON",
        colunas: ["Formato", "Onde ficam os links", "O que acrescenta"],
        linhas: [
          [
            "HAL",
            "`_links` (e `_embedded` para recursos aninhados)",
            "Enxuto e simples: descreve links, não ações; tipo de mídia `application/hal+json`",
          ],
          [
            "JSON:API",
            "`links` no documento e nos recursos, mais `relationships`",
            "Convenção completa de documento: estrutura de recursos, relacionamentos, inclusão de relacionados, paginação e erros; `application/vnd.api+json`",
          ],
          [
            "Siren",
            "`links` e `actions`",
            "As `actions` trazem `name`, `method`, `href` e `fields`: dizem o que fazer e com quais campos, quase um formulário",
          ],
          [
            "Cabeçalho `Link`",
            "Cabeçalho HTTP, fora do corpo",
            "Padrão da web (RFC 8288), muito usado para paginação (`rel` igual a `next`) em qualquer formato",
          ],
        ],
        nota: "Todos seguem o mesmo princípio. A escolha depende do que o cliente precisa: só navegar, um contrato de documento completo ou descobrir ações. Confira a especificação de cada um.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que se ganha",
        texto:
          "**Cliente menos acoplado**: ele guarda só o ponto de entrada e segue links, então o servidor pode mover ou renomear URLs sem quebrá-lo. **O estado define as ações**: a regra “este pedido ainda pode ser cancelado?” fica só no servidor, e o cliente mostra o botão se o link existir. **Navegação pronta**: paginação (`next`, `prev`) e recursos relacionados já vêm indicados.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O custo, e por que quase ninguém vai até o fim",
        texto:
          "As respostas ficam maiores, o cliente ainda precisa conhecer o vocabulário de `rel`, e boa parte das ferramentas (SDKs, clientes gerados a partir de especificação, front-ends que montam URLs) supõe endereços conhecidos. Por isso a maioria das APIs chamadas de REST para no nível 2. Um meio-termo comum: `self`, links de paginação e links de ação só onde o estado muda as opções. Para versionamento, veja L52; para os princípios de REST em geral, D27.",
      },
    ],
    armadilhas: [
      "Achar que um campo `url` em cada objeto já é HATEOAS: o ponto é o servidor indicar as próximas ações possíveis conforme o estado, e o cliente segui-las.",
      "Montar a URL no cliente (`/pedidos/${id}/pagamento`) mesmo havendo o link na resposta: o acoplamento volta e os links viram enfeite.",
      "Tratar o link como autorização: esconder um botão porque o link não veio é conforto de interface, e o servidor precisa validar a ação em toda requisição.",
      "Esperar que HATEOAS dispense a documentação: o cliente ainda precisa saber o que cada `rel` significa e quais dados cada ação pede.",
    ],
    autoteste: [
      {
        pergunta: "O que é HATEOAS em uma frase?",
        resposta:
          "É a restrição do REST em que o servidor devolve, em cada resposta, os links das próximas ações possíveis, e o cliente os segue em vez de construir URLs por conta própria.",
      },
      {
        pergunta: "Por que um pedido já pago não deveria trazer o link de pagar?",
        resposta:
          "Porque o conjunto de links reflete o estado atual do recurso: a ação deixou de ser possível, e essa regra fica no servidor, sem o cliente reimplementá-la. Se alguém tentar pagar mesmo assim, o servidor continua recusando.",
      },
    ],
  },
  en: {
    titulo: "HATEOAS",
    pergunta: "What are HATEOAS principles and how do they apply to REST API design?",
    porqueEsteMetodo:
      "HATEOAS sounds abstract until you notice you already use it every time you browse a website. The analogy brings the idea down to earth; then come the real mechanism and the point where the comparison stops holding.",
    resposta30s:
      "**HATEOAS** (hypermedia as the engine of application state) is the REST constraint in which every response carries the **links and actions available at that moment**, and the client **follows those links** instead of building URLs from documentation. The server dictates the state transitions (an order that is already paid offers no pay link), which decouples the client from the URL layout; it is **level 3** of the Richardson maturity model. In practice few APIs get there: bigger responses and clients that still need to understand each `rel` weigh against it.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a shopping site. You enter through the home page without having memorized a single address: you click “My orders”, then an order, and the page shows only the buttons that make sense right now (“Pay” if it is still open, “Track” if it has shipped). If the shop reorganizes its internal addresses you never notice, because you always follow the links the page itself offers.",
        tecnico:
          "**HATEOAS** (Hypermedia As The Engine Of Application State) is one of the constraints of the REST style: the client enters through a single URL and discovers the rest through the **links** in the responses. Each link says **where to go** (`href`), **what it means** (`rel`, such as `self`, `next` or `cancel`) and, in some formats, **which verb** to use. Because the server builds the links from the state of the resource, it decides which actions appear. In the Richardson maturity model it is **level 3**, after resources with their own URLs (level 1) and the correct use of HTTP verbs and status codes (level 2); level 0 is a single endpoint that receives everything through `POST`.",
        limite:
          "The analogy hides the price. A person understands the text “Pay”; a program does not: it must know the meaning of each `rel` beforehand and what data to send. HATEOAS removes the dependency on the **URL layout**, not on the API’s **vocabulary**, which is why documentation and a contract still exist (see P56).",
      },
      {
        tipo: "codigo",
        titulo: "A pending order, in the HAL style",
        legenda: "JSON",
        codigo: [
          "{",
          '  "id": 42,',
          '  "status": "pending",',
          '  "total": 150,',
          '  "_links": {',
          '    "self": { "href": "/orders/42" },',
          '    "items": { "href": "/orders/42/items" },',
          '    "pay": { "href": "/orders/42/payment", "method": "POST" },',
          '    "cancel": { "href": "/orders/42", "method": "DELETE" }',
          "  }",
          "}",
        ].join("\n"),
        nota: "The `method` field is here only for illustration: plain HAL does not define it (the verb comes from the documentation of the relation), while Siren describes actions with `method`. After payment, the server would return the same order without `pay` and `cancel` and with a link to the invoice: the **state** drives the links.",
      },
      {
        tipo: "tabela",
        titulo: "Hypermedia formats for JSON",
        colunas: ["Format", "Where the links live", "What it adds"],
        linhas: [
          [
            "HAL",
            "`_links` (and `_embedded` for nested resources)",
            "Lean and simple: describes links, not actions; media type `application/hal+json`",
          ],
          [
            "JSON:API",
            "`links` on the document and on resources, plus `relationships`",
            "A complete document convention: resource structure, relationships, including related resources, pagination and errors; `application/vnd.api+json`",
          ],
          [
            "Siren",
            "`links` and `actions`",
            "`actions` carry `name`, `method`, `href` and `fields`: they say what to do and with which fields, almost a form",
          ],
          [
            "`Link` header",
            "An HTTP header, outside the body",
            "A web standard (RFC 8288), widely used for pagination (`rel` equal to `next`) in any format",
          ],
        ],
        nota: "They all follow the same principle. The choice depends on what the client needs: just navigating, a complete document contract or discovering actions. Check each specification.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What you gain",
        texto:
          "**A less coupled client**: it keeps only the entry point and follows links, so the server can move or rename URLs without breaking it. **State defines the actions**: the rule “can this order still be cancelled?” lives only on the server, and the client shows the button if the link exists. **Ready-made navigation**: pagination (`next`, `prev`) and related resources are already pointed out.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The cost, and why almost nobody goes all the way",
        texto:
          "Responses grow, the client still needs to know the `rel` vocabulary, and much of the tooling (SDKs, clients generated from a specification, front ends that build URLs) assumes known addresses. That is why most APIs called REST stop at level 2. A common middle ground: `self`, pagination links and action links only where state changes the options. For versioning, see L52; for REST principles in general, D27.",
      },
    ],
    armadilhas: [
      "Thinking a `url` field on every object is already HATEOAS: the point is for the server to indicate the next possible actions according to state, and for the client to follow them.",
      "Building the URL on the client (`/orders/${id}/payment`) even though the response has the link: the coupling comes back and the links become decoration.",
      "Treating the link as authorization: hiding a button because the link did not arrive is interface comfort, and the server must validate the action on every request.",
      "Expecting HATEOAS to remove the need for documentation: the client still has to know what each `rel` means and what data each action asks for.",
    ],
    autoteste: [
      {
        pergunta: "What is HATEOAS in one sentence?",
        resposta:
          "It is the REST constraint in which the server returns, in every response, the links to the next possible actions, and the client follows them instead of building URLs on its own.",
      },
      {
        pergunta: "Why should an order that is already paid not carry a pay link?",
        resposta:
          "Because the set of links reflects the current state of the resource: the action is no longer possible, and that rule stays on the server, without the client reimplementing it. If someone tries to pay anyway, the server still refuses.",
      },
    ],
  },
};
