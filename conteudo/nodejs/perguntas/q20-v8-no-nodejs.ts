import type { Pergunta } from "../../tipos";

// Q20 · V8 no Node.js
export const q20: Pergunta = {
  numero: 20,
  modulo: "turing-basicas",
  metodo: "whys",
  pt: {
    titulo: "V8 no Node.js",
    pergunta: "Por que o Google utiliza a engine V8 para Node.js?",
    porqueEsteMetodo:
      "A escolha do V8 é uma decisão de projeto, e decisões se entendem encadeando “por quês”: do que um runtime precisa, passando pelo que o motor entrega, até o que ele não faz. No caminho dá para corrigir a premissa do enunciado.",
    resposta30s:
      "Uma correção primeiro: o **Node.js não é do Google**. É um projeto de código aberto que **incorpora o V8**, o motor de JavaScript do Chrome, desenvolvido sobretudo pelo Google. O Node.js usa o V8 porque ele é **rápido, maduro e de código aberto**: reaproveitar um motor assim é mais barato do que escrever um. E o V8 **não converte JavaScript em C++**: ele o compila para **código de máquina** em tempo de execução (JIT). O resto (arquivos, rede, eventos) é do **libuv** e das APIs do Node.js.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o Node.js precisa de um motor de JavaScript?",
            resposta:
              "Porque o Node.js é um **runtime**: um programa em C++ que embute um motor para executar JavaScript e acrescenta o que a linguagem sozinha não tem (arquivos, rede, processos). Sem o motor, um arquivo `.js` seria só texto.",
          },
          {
            pergunta: "Por que esse motor é o V8 e não um feito do zero?",
            resposta:
              "Porque escrever um motor rápido e correto leva anos. O V8 já existia, é de código aberto com licença permissiva, é muito testado dentro do Chrome e evolui o tempo todo. Reaproveitá-lo deixa a equipe do Node.js livre para cuidar de E/S, módulos e ferramentas.",
          },
          {
            pergunta: "Por que o V8 é rápido se JavaScript é uma linguagem dinâmica?",
            resposta:
              "Porque ele não só interpreta: gera bytecode, observa quais funções ficam “quentes” e as compila, em tempo de execução, para **código de máquina** otimizado (compilação JIT, com componentes como Ignition e TurboFan). Não há tradução para C++ no meio do caminho.",
          },
          {
            pergunta: "Por que o V8 sozinho não basta para um servidor?",
            resposta:
              "Porque ele executa a linguagem, mas não abre sockets, não lê arquivos e não espera eventos. Isso é do **libuv** (laço de eventos, E/S assíncrona, pool de threads) e das APIs do Node.js (`fs`, `http`…), escritas em C++ e JavaScript, que ligam o código do usuário ao sistema operacional.",
          },
          {
            pergunta: "Por que essa escolha é duradoura?",
            resposta:
              "Porque a linguagem evolui junto com o motor: ao atualizar o V8, o Node.js ganha desempenho e recursos novos do ECMAScript sem reescrever nada, e o mesmo JavaScript roda no navegador e no servidor. A versão embutida aparece em `process.versions.v8`.",
          },
        ],
        causaRaiz:
          "O Node.js usa o V8 porque **reaproveitar o melhor motor de JavaScript disponível** é mais barato e mais seguro do que construir um. O V8 executa o JavaScript (compilando para código de máquina); o libuv e as APIs do Node.js cuidam de tudo que o motor não faz.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Duas correções ao enunciado",
        texto:
          "(1) O Google não “usa” o V8 para o Node.js, e o Node.js não é um produto do Google: o V8 é o motor de código aberto do Chrome (projeto Chromium) e o Node.js o incorpora, sob a governança da OpenJS Foundation. (2) Não existe conversão de JavaScript em C++: a pergunta “como o Node.js converte JavaScript em C++?” mistura duas coisas. O V8 compila JavaScript direto para código de máquina, em tempo de execução; o C++ está no próprio V8, no libuv e nos addons nativos que alguém escreva.",
      },
      {
        tipo: "codigo",
        titulo: "Ver o que vem embutido no seu Node.js",
        legenda: "JavaScript",
        codigo:
          "console.log(process.version); // versão do Node.js\nconsole.log(process.versions.v8); // versão do motor V8\nconsole.log(process.versions.uv); // versão do libuv\n\n// Rode: node --v8-options  (lista as opções do motor)",
        nota: "As versões mudam a cada release do Node.js; confira a documentação oficial (nodejs.org) para saber o que cada uma traz.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Outros runtimes, outros motores",
        texto:
          "O Deno também usa o V8; o Bun usa o JavaScriptCore, o motor do Safari. O que define um runtime é a combinação **motor + APIs + gestão de E/S**, não o motor sozinho.",
      },
    ],
    armadilhas: [
      "Afirmar que o Node.js “traduz JavaScript para C++”: o V8 gera código de máquina, e o C++ é a linguagem em que o V8 e o libuv são escritos.",
      "Dizer que o Node.js é do Google ou do V8: o V8 é só o motor; o Node.js é o runtime (V8 + libuv + APIs + npm).",
      "Achar que o V8 cuida de E/S assíncrona: quem faz o laço de eventos e a E/S é o libuv.",
      "Tratar JavaScript como “lento por ser interpretado”: com JIT, código quente roda como código de máquina.",
    ],
    autoteste: [
      {
        pergunta: "O que o V8 faz e o que ele não faz no Node.js?",
        resposta:
          "Faz: analisa, compila (JIT) e executa o JavaScript, e gerencia a memória (coletor de lixo). Não faz: arquivos, rede, timers e laço de eventos, que são do libuv e das APIs do Node.js.",
      },
      {
        pergunta: "O Node.js converte JavaScript em C++?",
        resposta:
          "Não. O V8 compila o JavaScript para código de máquina em tempo de execução (JIT). O C++ aparece no V8, no libuv e nos addons nativos.",
      },
    ],
  },
  en: {
    titulo: "V8 in Node.js",
    pergunta: "Why does Node.js use Google's V8 engine?",
    porqueEsteMetodo:
      "Choosing V8 is a design decision, and decisions are understood by chaining “whys”: from what a runtime needs, through what the engine delivers, to what it does not do. Along the way the question’s premise can be corrected.",
    resposta30s:
      "A correction first: **Node.js is not Google’s**. It is an open-source project that **embeds V8**, the JavaScript engine of Chrome, developed mostly by Google. Node.js uses V8 because it is **fast, mature and open source**: reusing an engine like that is cheaper than writing one. And V8 **does not convert JavaScript into C++**: it compiles it to **machine code** at run time (JIT). The rest (files, networking, events) belongs to **libuv** and the Node.js APIs.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does Node.js need a JavaScript engine?",
            resposta:
              "Because Node.js is a **runtime**: a C++ program that embeds an engine to execute JavaScript and adds what the language alone lacks (files, networking, processes). Without the engine, a `.js` file would be just text.",
          },
          {
            pergunta: "Why is that engine V8 and not one built from scratch?",
            resposta:
              "Because writing a fast, correct engine takes years. V8 already existed, is open source under a permissive license, is heavily tested inside Chrome and keeps evolving. Reusing it frees the Node.js team to work on I/O, modules and tooling.",
          },
          {
            pergunta: "Why is V8 fast if JavaScript is a dynamic language?",
            resposta:
              "Because it does not merely interpret: it generates bytecode, watches which functions become “hot” and compiles them, at run time, into optimized **machine code** (JIT compilation, with components such as Ignition and TurboFan). There is no translation into C++ along the way.",
          },
          {
            pergunta: "Why is V8 alone not enough for a server?",
            resposta:
              "Because it runs the language, but it does not open sockets, read files or wait for events. That belongs to **libuv** (event loop, asynchronous I/O, thread pool) and to the Node.js APIs (`fs`, `http`…), written in C++ and JavaScript, which connect user code to the operating system.",
          },
          {
            pergunta: "Why is this choice long-lasting?",
            resposta:
              "Because the language evolves together with the engine: when V8 is updated, Node.js gains performance and new ECMAScript features without rewriting anything, and the same JavaScript runs in the browser and on the server. The embedded version shows up in `process.versions.v8`.",
          },
        ],
        causaRaiz:
          "Node.js uses V8 because **reusing the best JavaScript engine available** is cheaper and safer than building one. V8 runs the JavaScript (compiling it to machine code); libuv and the Node.js APIs handle everything the engine does not.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Two corrections to the question",
        texto:
          "(1) Google does not “use” V8 for Node.js, and Node.js is not a Google product: V8 is the open-source engine of Chrome (the Chromium project) and Node.js embeds it, under the governance of the OpenJS Foundation. (2) There is no conversion of JavaScript into C++: the question “how does Node.js convert JavaScript into C++?” mixes up two things. V8 compiles JavaScript straight to machine code at run time; the C++ lives in V8 itself, in libuv and in any native addons someone writes.",
      },
      {
        tipo: "codigo",
        titulo: "See what is embedded in your Node.js",
        legenda: "JavaScript",
        codigo:
          "console.log(process.version); // Node.js version\nconsole.log(process.versions.v8); // V8 engine version\nconsole.log(process.versions.uv); // libuv version\n\n// Run: node --v8-options  (lists the engine options)",
        nota: "Versions change with every Node.js release; check the official documentation (nodejs.org) to see what each one brings.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Other runtimes, other engines",
        texto:
          "Deno also uses V8; Bun uses JavaScriptCore, the engine of Safari. What defines a runtime is the combination of **engine + APIs + I/O management**, not the engine alone.",
      },
    ],
    armadilhas: [
      "Saying Node.js “translates JavaScript into C++”: V8 generates machine code, and C++ is the language V8 and libuv are written in.",
      "Saying Node.js belongs to Google or to V8: V8 is only the engine; Node.js is the runtime (V8 + libuv + APIs + npm).",
      "Thinking V8 handles asynchronous I/O: the event loop and I/O belong to libuv.",
      "Treating JavaScript as “slow because it is interpreted”: with JIT, hot code runs as machine code.",
    ],
    autoteste: [
      {
        pergunta: "What does V8 do and not do in Node.js?",
        resposta:
          "It does: parse, compile (JIT) and run the JavaScript, and manage memory (garbage collector). It does not do: files, networking, timers and the event loop, which belong to libuv and the Node.js APIs.",
      },
      {
        pergunta: "Does Node.js convert JavaScript into C++?",
        resposta:
          "No. V8 compiles JavaScript to machine code at run time (JIT). C++ shows up in V8, in libuv and in native addons.",
      },
    ],
  },
};
