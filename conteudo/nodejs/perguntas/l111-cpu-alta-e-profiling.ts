import type { Pergunta } from "../../tipos";

// L111 · CPU alta e profiling
export const l111: Pergunta = {
  numero: 211,
  modulo: "linkedin-producao",
  metodo: "playbook",
  pt: {
    titulo: "CPU alta e profiling",
    pergunta: "Como você depura o uso alto de CPU?",
    porqueEsteMetodo:
      "CPU alta pede um procedimento do mais barato ao mais pesado: ver o que está ocupado, correlacionar com tráfego, capturar um perfil e só então mexer no código. O playbook também responde “como perfilar uma aplicação Node.js” e o cenário do servidor a 100%.",
    resposta30s:
      "Confirme que é a **thread do JavaScript** que está saturada (um núcleo cheio, `performance.eventLoopUtilization()` perto de 1) e correlacione com tráfego, rota e deploy. Depois **capture um perfil** (`node --cpu-prof`, `--prof` ou o DevTools via `--inspect`) enquanto o problema acontece e leia o **flame graph**: as barras mais largas são as funções que consomem o tempo. Os suspeitos de sempre são laços, **regex** catastrófica, **JSON** enorme e **`*Sync`**; a saída é otimizar, mover o trabalho para **worker threads** ou fila e perfilar produção com cuidado.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: o servidor está a 100% de CPU",
        passos: [
          {
            titulo: "1. Veja o que está ocupado",
            texto:
              "No `top`/`htop` (com `top -H` para ver por thread) ou no painel do contêiner: um único núcleo cheio em um processo Node quase sempre é a **thread do JavaScript** saturada; vários núcleos sugerem o pool do libuv (crypto, zlib), workers ou vários processos. Complete com `performance.eventLoopUtilization()`: perto de 1 significa laço saturado.",
          },
          {
            titulo: "2. Correlacione com tráfego e mudanças",
            texto:
              "Compare o início da subida com um deploy, um pico de requisições, uma rota ou um robô. CPU alta com **pouco tráfego** aponta para laço infinito, timer agressivo, tempestade de retentativas ou coleta de lixo excessiva. Com **muito tráfego**, aponta para capacidade insuficiente ou uma rota ineficiente. Métricas e logs por rota respondem rápido.",
          },
          {
            titulo: "3. Contenha o incidente",
            texto:
              "Se os usuários já sofrem: tire a instância do balanceamento, some réplicas, aplique limite de taxa ou desligue a rota ou o job suspeito. Capture o perfil (passo 4) antes de reiniciar a instância doente, senão a evidência se perde.",
          },
          {
            titulo: "4. Capture um perfil",
            texto:
              "Reproduza em staging ou isole uma instância e grave **enquanto o problema acontece**, por um período curto: um processo ocioso não mostra nada. As opções estão na tabela abaixo. Sinal: você tem um arquivo de perfil de uma janela em que a CPU estava alta.",
          },
          {
            titulo: "5. Leia o flame graph",
            texto:
              "Cada barra é uma função; a largura é a fração das amostras em que ela esteve na pilha, e as barras empilhadas mostram quem chamou quem (o sentido depende da ferramenta). Procure as barras largas e, na visão de baixo para cima (bottom-up), o tempo próprio (**self time**). Separe seu código, `node_modules`, coleta de lixo e código nativo. Sinal: uma ou duas funções respondem pela maior parte do tempo.",
          },
          {
            titulo: "6. Reconheça os suspeitos comuns",
            texto:
              "Laços e algoritmos quadráticos sobre listas grandes; regex com retrocesso catastrófico (ReDoS); `JSON.parse` e `JSON.stringify` de objetos enormes; versões síncronas (`pbkdf2Sync`, `zlib` síncrono); hash de senha e criptografia no laço; logs que serializam objetos grandes; muita alocação, que aparece como coleta de lixo larga no perfil.",
          },
          {
            titulo: "7. Corrija e verifique",
            texto:
              "Otimize o ponto quente, guarde resultados em cache, troque `*Sync` por versões assíncronas e mova trabalho de CPU para `worker_threads` ou para uma fila (veja L73 e L77). Limite o tamanho das entradas e reescreva a regex. Repita a carga e o perfil: a barra larga deve encolher e a CPU voltar ao normal.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Ferramentas para capturar o perfil",
        colunas: ["Ferramenta", "Como usar", "Quando serve"],
        linhas: [
          [
            "`--cpu-prof`",
            "`node --cpu-prof --cpu-prof-dir=perfis app.js`; o `.cpuprofile` é gravado quando o processo encerra e abre no Chrome DevTools",
            "Caminho padrão: staging ou uma instância isolada",
          ],
          [
            "`--prof`",
            "`node --prof app.js`, depois `node --prof-process isolate-*.log`",
            "Resumo em texto das amostras por função, sem interface gráfica",
          ],
          [
            "DevTools via `--inspect`",
            "`node --inspect app.js`, conectar em `chrome://inspect` e gravar na aba de desempenho/perfil",
            "Processo vivo, em tempo real; exige cuidado com a porta (veja T52)",
          ],
          [
            "`eventLoopUtilization()`",
            "`performance.eventLoopUtilization()` dentro da aplicação, exportada como métrica",
            "Confirma o laço saturado e vira alerta, sem precisar de perfil",
          ],
        ],
        nota: "Ferramentas de terceiros, como Clinic.js e 0x, geram flame graphs prontos. Confira a documentação oficial (nodejs.org) para as flags da sua versão.",
      },
      {
        tipo: "codigo",
        titulo: "Medir quanto o laço fica ocupado",
        legenda: "JavaScript",
        codigo: `import { performance } from "node:perf_hooks";

let anterior = performance.eventLoopUtilization();

setInterval(() => {
  // Diferença desde a última leitura: 0 = ocioso, 1 = sempre ocupado
  const { utilization } = performance.eventLoopUtilization(anterior);
  anterior = performance.eventLoopUtilization();
  console.log("laço ocupado:", (utilization * 100).toFixed(0) + "%");
}, 5000).unref();`,
        nota: "Em produção, envie o valor para o seu sistema de métricas e alerte quando ele ficar alto por tempo sustentado.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Perfilar produção exige cuidado",
        texto:
          "O amostrador consome CPU extra, e `--inspect` abre uma porta de depuração que dá controle total do processo: nunca a exponha à rede (use `127.0.0.1` e um túnel seguro). Prefira uma instância fora do balanceamento ou uma cópia em staging, grave por pouco tempo e remova as flags ao terminar. O perfil traz nomes de funções e caminhos de arquivo, não o conteúdo das variáveis, mas trate-o como material interno.",
      },
    ],
    armadilhas: [
      "Tratar CPU alta como “falta de máquina” e só somar réplicas: o laço infinito ou a regex ruim consome todo núcleo que receber.",
      "Perfilar sem a carga do problema: o perfil de um processo ocioso não mostra o culpado.",
      "Olhar só o código próprio: a barra larga pode ser coleta de lixo (muita alocação) ou uma dependência.",
      "Reiniciar o processo antes de capturar o perfil, ou deixar `--inspect` aberto na rede depois.",
    ],
    autoteste: [
      {
        pergunta: "O que um flame graph mostra e como se lê?",
        resposta:
          "Mostra, por amostragem, em quais funções a CPU passou o tempo: cada barra é uma função, a largura é o tempo (amostras) em que ela esteve na pilha e o empilhamento mostra quem chamou quem. Procure as barras largas e o self time.",
      },
      {
        pergunta: "O servidor está a 100% de CPU com pouco tráfego. Quais são os suspeitos?",
        resposta:
          "Laço infinito ou timer agressivo, tempestade de retentativas, regex catastrófica disparada por uma entrada, coleta de lixo excessiva por alocação desenfreada ou um job em segundo plano. Capture um perfil para confirmar.",
      },
    ],
  },
  en: {
    titulo: "High CPU and profiling",
    pergunta: "How do you debug high CPU usage?",
    porqueEsteMetodo:
      "High CPU calls for a procedure from the cheapest check to the heaviest: see what is busy, correlate with traffic, capture a profile and only then touch the code. The playbook also answers “how do you profile a Node.js application” and the scenario of a server at 100%.",
    resposta30s:
      "Confirm that the **JavaScript thread** is the saturated one (a single full core, `performance.eventLoopUtilization()` close to 1) and correlate with traffic, route and deploys. Then **capture a profile** (`node --cpu-prof`, `--prof` or DevTools via `--inspect`) while the problem is happening and read the **flame graph**: the widest bars are the functions eating the time. The usual suspects are loops, catastrophic **regexes**, huge **JSON** and **`*Sync`** calls; the way out is to optimize, move the work to **worker threads** or a queue, and profile production carefully.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: the server is at 100% CPU",
        passos: [
          {
            titulo: "1. See what is busy",
            texto:
              "In `top`/`htop` (with `top -H` to see threads) or in the container dashboard: a single full core on a Node process is almost always the **JavaScript thread** saturated; several cores suggest the libuv pool (crypto, zlib), workers or multiple processes. Complete it with `performance.eventLoopUtilization()`: close to 1 means a saturated loop.",
          },
          {
            titulo: "2. Correlate with traffic and changes",
            texto:
              "Compare when the climb began with a deploy, a request spike, a route or a bot. High CPU with **little traffic** points to an infinite loop, an aggressive timer, a retry storm or excessive garbage collection. With **heavy traffic**, it points to insufficient capacity or an inefficient route. Per-route metrics and logs answer quickly.",
          },
          {
            titulo: "3. Contain the incident",
            texto:
              "If users are already suffering: take the instance out of the load balancer, add replicas, apply rate limiting or switch off the suspect route or job. Capture the profile (step 4) before restarting the sick instance, or the evidence is lost.",
          },
          {
            titulo: "4. Capture a profile",
            texto:
              "Reproduce in staging or isolate one instance and record **while the problem is happening**, for a short period: an idle process shows nothing. The options are in the table below. Signal: you have a profile file from a window in which CPU was high.",
          },
          {
            titulo: "5. Read the flame graph",
            texto:
              "Each bar is a function; its width is the share of samples in which it was on the stack, and stacked bars show who called whom (the direction depends on the tool). Look for the wide bars and, in the bottom-up view, the **self time**. Separate your code, `node_modules`, garbage collection and native code. Signal: one or two functions account for most of the time.",
          },
          {
            titulo: "6. Recognize the common suspects",
            texto:
              "Loops and quadratic algorithms over large lists; regexes with catastrophic backtracking (ReDoS); `JSON.parse` and `JSON.stringify` of huge objects; synchronous versions (`pbkdf2Sync`, synchronous `zlib`); password hashing and cryptography in a loop; logs that serialize large objects; heavy allocation, which shows up as wide garbage collection in the profile.",
          },
          {
            titulo: "7. Fix and verify",
            texto:
              "Optimize the hot spot, cache results, replace `*Sync` with asynchronous versions and move CPU work to `worker_threads` or a queue (see L73 and L77). Limit input sizes and rewrite the regex. Repeat the load and the profile: the wide bar should shrink and CPU return to normal.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Tools to capture the profile",
        colunas: ["Tool", "How to use it", "When it helps"],
        linhas: [
          [
            "`--cpu-prof`",
            "`node --cpu-prof --cpu-prof-dir=profiles app.js`; the `.cpuprofile` is written when the process exits and opens in Chrome DevTools",
            "Default route: staging or an isolated instance",
          ],
          [
            "`--prof`",
            "`node --prof app.js`, then `node --prof-process isolate-*.log`",
            "Text summary of samples per function, no graphical interface",
          ],
          [
            "DevTools via `--inspect`",
            "`node --inspect app.js`, connect at `chrome://inspect` and record in the performance/profiler tab",
            "Live process, in real time; the port needs care (see T52)",
          ],
          [
            "`eventLoopUtilization()`",
            "`performance.eventLoopUtilization()` inside the application, exported as a metric",
            "Confirms the saturated loop and becomes an alert, no profile needed",
          ],
        ],
        nota: "Third-party tools such as Clinic.js and 0x generate ready-made flame graphs. Check the official documentation (nodejs.org) for the flags in your version.",
      },
      {
        tipo: "codigo",
        titulo: "Measuring how busy the loop is",
        legenda: "JavaScript",
        codigo: `import { performance } from "node:perf_hooks";

let previous = performance.eventLoopUtilization();

setInterval(() => {
  // Difference since the last reading: 0 = idle, 1 = always busy
  const { utilization } = performance.eventLoopUtilization(previous);
  previous = performance.eventLoopUtilization();
  console.log("loop busy:", (utilization * 100).toFixed(0) + "%");
}, 5000).unref();`,
        nota: "In production, send the value to your metrics system and alert when it stays high for a sustained period.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Profiling production takes care",
        texto:
          "The sampler uses extra CPU, and `--inspect` opens a debugging port that gives full control of the process: never expose it to the network (use `127.0.0.1` and a secure tunnel). Prefer an instance out of the load balancer or a staging copy, record for a short time and remove the flags afterwards. The profile carries function names and file paths, not variable contents, but treat it as internal material.",
      },
    ],
    armadilhas: [
      "Treating high CPU as “not enough machines” and just adding replicas: the infinite loop or the bad regex eats every core it gets.",
      "Profiling without the problem’s load: the profile of an idle process does not show the culprit.",
      "Looking only at your own code: the wide bar may be garbage collection (heavy allocation) or a dependency.",
      "Restarting the process before capturing the profile, or leaving `--inspect` open on the network afterwards.",
    ],
    autoteste: [
      {
        pergunta: "What does a flame graph show and how do you read it?",
        resposta:
          "It shows, by sampling, which functions the CPU spent its time in: each bar is a function, the width is the time (samples) it was on the stack and the stacking shows who called whom. Look for the wide bars and the self time.",
      },
      {
        pergunta: "The server is at 100% CPU with little traffic. What are the suspects?",
        resposta:
          "An infinite loop or aggressive timer, a retry storm, a catastrophic regex triggered by an input, excessive garbage collection from runaway allocation, or a background job. Capture a profile to confirm.",
      },
    ],
  },
};
