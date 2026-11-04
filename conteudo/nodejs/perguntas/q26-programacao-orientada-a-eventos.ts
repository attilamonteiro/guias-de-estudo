import type { Pergunta } from "../../tipos";

// Q26 · Programação orientada a eventos
export const q26: Pergunta = {
  numero: 26,
  modulo: "turing-intermediarias",
  metodo: "feynman",
  pt: {
    titulo: "Programação orientada a eventos",
    pergunta: "O que é programação de eventos?",
    porqueEsteMetodo:
      "É um modelo mental, e modelos se aprendem por analogia: a pergunta “o que é um evento?” fica óbvia quando você imagina um porteiro com instruções. Depois vem o mecanismo real do Node.js e o ponto em que a imagem deixa de valer.",
    resposta30s:
      "A pergunta provavelmente quer dizer **programação orientada a eventos**: o fluxo do programa é decidido por **eventos**, isto é, fatos que acontecem (chegou uma requisição, um timer venceu, um arquivo terminou de ser lido). Você **registra ouvintes** (“quando isto acontecer, execute aquilo”) e o runtime os chama quando o evento ocorre. No Node.js isso vive no **laço de eventos** e no `EventEmitter`, e permite atender muita E/S com uma thread só.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Um porteiro de prédio recebe instruções por escrito: “se tocar o apartamento 3, avise o morador; se chegar encomenda, ligue para o 5”. Ele não fica olhando por todas as portas a cada segundo; descansa até que algo aconteça e, quando acontece, executa a instrução cadastrada para aquele fato.",
        tecnico:
          "Um **evento** é um fato com nome e, às vezes, dados: um clique, uma requisição HTTP, um pedaço de arquivo lido, um timer vencido, um pedido criado. Na programação orientada a eventos você não chama diretamente o código que vai reagir: **registra um ouvinte** (`on`) e quem emite o evento (`emit`) nem sabe quem está ouvindo. Essa é a inversão de controle: o runtime chama o seu código, e não o contrário. No Node.js, o sistema operacional avisa o laço de eventos de que algo aconteceu, e o laço executa os ouvintes quando a thread de JavaScript está livre.",
        limite:
          "O porteiro conseguiria chamar um colega; o Node.js tem uma thread só para o seu JavaScript e executa um ouvinte por vez: se um ouvinte demora, todos os eventos seguintes esperam. Além disso, o porteiro dá um jeito se a instrução chegar atrasada, mas no código um ouvinte registrado depois de o evento passar nunca é chamado, e um ouvinte esquecido continua na lista (e na memória) para sempre.",
      },
      {
        tipo: "fluxo",
        titulo: "O caminho de um evento no Node.js",
        etapas: [
          "Você registra um ouvinte: `servidor.on('request', tratar)`",
          "O programa segue em frente; o Node.js fica à espera, sem gastar CPU",
          "Algo acontece: chega um pacote de rede, o timer vence, o disco responde",
          "O sistema operacional avisa o laço de eventos, que enfileira o evento",
          "Com a thread de JavaScript livre, o laço chama o seu ouvinte",
        ],
        nota: "Veja Q28 para o funcionamento do laço de eventos em detalhe.",
      },
      {
        tipo: "codigo",
        titulo: "Um evento, dois ouvintes",
        legenda: "JavaScript",
        codigo:
          "import { EventEmitter } from 'node:events';\n\nconst loja = new EventEmitter();\n\n// 1. Registrar ouvintes: \"quando isto acontecer, faça aquilo\"\nloja.on('pedido:criado', (pedido) => console.log('Enviar e-mail para', pedido.cliente));\nloja.on('pedido:criado', (pedido) => console.log('Baixar estoque de', pedido.itens));\n\n// 2. Emitir o evento: os ouvintes rodam, na ordem em que foram registrados\nloja.emit('pedido:criado', { cliente: 'Ana', itens: ['filtro', 'correia'] });",
        nota: "Quem emite não precisa conhecer o e-mail nem o estoque: acrescentar um terceiro ouvinte não mexe no código que emite.",
      },
      {
        tipo: "tabela",
        titulo: "Eventos que você encontra no Node.js",
        colunas: ["Quem emite", "Evento", "Quando acontece"],
        linhas: [
          ["Servidor HTTP (`http.Server`)", "`request`", "Chegou uma requisição"],
          ["Stream de leitura", "`data`, `end`, `error`", "Chegou um pedaço de dados, acabou, ou algo falhou"],
          ["`process`", "`SIGINT`, `exit`", "O usuário apertou Ctrl+C; o processo vai encerrar"],
          ["Observador de arquivos (`fs.watch`)", "`change`", "Um arquivo ou pasta foi modificado"],
          ["Seu `EventEmitter`", "Nomes que você inventa (`pedido:criado`)", "Quando você chama `emit`"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Evento ou chamada de função?",
        texto:
          "Na **chamada de função**, quem chama conhece o destino e espera o retorno. No **evento**, quem emite não conhece quem ouve, não espera e pode ter zero, um ou vários ouvintes. Isso desacopla as partes e combina com E/S, em que não se sabe quando a resposta chega; o preço é que o fluxo do programa fica menos linear de ler e depurar.",
      },
    ],
    armadilhas: [
      "Registrar o ouvinte tarde demais: o evento já passou e ninguém ouviu (por exemplo, anexar `data` a um stream depois de os dados terem sido consumidos).",
      "Não ouvir o evento `error`: em um `EventEmitter`, `error` sem ouvinte lança a exceção e derruba o processo (veja Q61).",
      "Acumular ouvintes sem removê-los (`off`): vazamento de memória e `MaxListenersExceededWarning`.",
      "Achar que eventos são paralelos: os ouvintes rodam um de cada vez, na mesma thread, e um ouvinte lento atrasa tudo.",
    ],
    autoteste: [
      {
        pergunta: "O que é um evento?",
        resposta:
          "Um fato identificado por um nome (e às vezes com dados) que o programa pode observar: uma requisição que chega, um timer que vence, um dado lido. Quem tem interesse registra um ouvinte, que é chamado quando o evento ocorre.",
      },
      {
        pergunta: "Qual a diferença entre chamar uma função e emitir um evento?",
        resposta:
          "Ao chamar uma função você sabe exatamente qual código roda e espera o retorno. Ao emitir um evento você não sabe quem ouve, não espera e pode ter vários ouvintes, o que desacopla quem avisa de quem reage.",
      },
      {
        pergunta: "Programação orientada a eventos significa que o código roda em paralelo?",
        resposta:
          "Não. No Node.js os ouvintes rodam um de cada vez na thread de JavaScript. O ganho está em não ficar esperando E/S, não em executar JavaScript ao mesmo tempo.",
      },
    ],
  },
  en: {
    titulo: "Event-driven programming",
    pergunta: "What is event programming?",
    porqueEsteMetodo:
      "It is a mental model, and models are learned by analogy: “what is an event?” becomes obvious once you picture a doorman with instructions. Then comes the real Node.js mechanism and the point where the picture stops holding.",
    resposta30s:
      "The question most likely means **event-driven programming**: the program’s flow is decided by **events**, that is, things that happen (a request arrived, a timer expired, a file finished being read). You **register listeners** (“when this happens, run that”) and the runtime calls them when the event occurs. In Node.js this lives in the **event loop** and in `EventEmitter`, and it lets one thread serve a lot of I/O.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "A building’s doorman gets written instructions: “if apartment 3 rings, tell the resident; if a parcel arrives, call number 5”. He does not stare at every door each second; he rests until something happens and, when it does, carries out the instruction registered for that fact.",
        tecnico:
          "An **event** is a named fact, sometimes with data: a click, an HTTP request, a chunk of a file read, an expired timer, an order created. In event-driven programming you do not call the code that will react directly: you **register a listener** (`on`) and whoever emits the event (`emit`) does not even know who is listening. That is inversion of control: the runtime calls your code, not the other way around. In Node.js, the operating system tells the event loop that something happened, and the loop runs the listeners when the JavaScript thread is free.",
        limite:
          "The doorman could call a colleague; Node.js has a single thread for your JavaScript and runs one listener at a time: if a listener is slow, every following event waits. Also, the doorman copes if an instruction arrives late, but in code a listener registered after the event has passed is never called, and a forgotten listener stays in the list (and in memory) forever.",
      },
      {
        tipo: "fluxo",
        titulo: "The path of an event in Node.js",
        etapas: [
          "You register a listener: `server.on('request', handle)`",
          "The program moves on; Node.js waits, using no CPU",
          "Something happens: a network packet arrives, the timer expires, the disk answers",
          "The operating system tells the event loop, which queues the event",
          "With the JavaScript thread free, the loop calls your listener",
        ],
        nota: "See Q28 for how the event loop works in detail.",
      },
      {
        tipo: "codigo",
        titulo: "One event, two listeners",
        legenda: "JavaScript",
        codigo:
          "import { EventEmitter } from 'node:events';\n\nconst shop = new EventEmitter();\n\n// 1. Register listeners: \"when this happens, do that\"\nshop.on('order:created', (order) => console.log('Send email to', order.customer));\nshop.on('order:created', (order) => console.log('Update stock for', order.items));\n\n// 2. Emit the event: the listeners run, in the order they were registered\nshop.emit('order:created', { customer: 'Ana', items: ['filter', 'belt'] });",
        nota: "Whoever emits does not need to know about email or stock: adding a third listener does not touch the code that emits.",
      },
      {
        tipo: "tabela",
        titulo: "Events you meet in Node.js",
        colunas: ["Who emits", "Event", "When it happens"],
        linhas: [
          ["HTTP server (`http.Server`)", "`request`", "A request arrived"],
          ["Readable stream", "`data`, `end`, `error`", "A chunk of data arrived, it finished, or something failed"],
          ["`process`", "`SIGINT`, `exit`", "The user pressed Ctrl+C; the process is about to end"],
          ["File watcher (`fs.watch`)", "`change`", "A file or folder was modified"],
          ["Your `EventEmitter`", "Names you make up (`order:created`)", "When you call `emit`"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Event or function call?",
        texto:
          "In a **function call**, the caller knows the target and waits for the return. With an **event**, the emitter does not know who listens, does not wait, and may have zero, one or many listeners. That decouples the parts and suits I/O, where you do not know when the answer arrives; the price is that the program flow becomes less linear to read and debug.",
      },
    ],
    armadilhas: [
      "Registering the listener too late: the event has already passed and nobody heard it (for example, attaching `data` to a stream after the data was consumed).",
      "Not listening for the `error` event: on an `EventEmitter`, `error` with no listener throws the exception and brings the process down (see Q61).",
      "Piling up listeners without removing them (`off`): memory leak and `MaxListenersExceededWarning`.",
      "Thinking events are parallel: listeners run one at a time, on the same thread, and a slow listener delays everything.",
    ],
    autoteste: [
      {
        pergunta: "What is an event?",
        resposta:
          "A named fact (sometimes with data) that the program can observe: a request arriving, a timer expiring, data being read. Whoever is interested registers a listener, which is called when the event occurs.",
      },
      {
        pergunta: "What is the difference between calling a function and emitting an event?",
        resposta:
          "When you call a function you know exactly which code runs and you wait for the return. When you emit an event you do not know who listens, you do not wait and there can be several listeners, which decouples whoever announces from whoever reacts.",
      },
      {
        pergunta: "Does event-driven programming mean the code runs in parallel?",
        resposta:
          "No. In Node.js listeners run one at a time on the JavaScript thread. The gain is in not sitting idle waiting for I/O, not in running JavaScript at the same time.",
      },
    ],
  },
};
