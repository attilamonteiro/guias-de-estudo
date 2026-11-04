import type { Pergunta } from "../../tipos";

// D57 · PM2
export const d057: Pergunta = {
  numero: 357,
  modulo: "devinterview-seguranca-e-implantacao",
  metodo: "feynman",
  pt: {
    titulo: "PM2",
    pergunta: "O que é o PM2 e como ele é usado no Node.js?",
    porqueEsteMetodo:
      "O PM2 é uma ferramenta de operação, e faz mais sentido pela intuição (alguém que cuida dos seus processos) antes dos comandos. A analogia dá o papel, a tabela dá o vocabulário e o limite mostra quando a ferramenta é dispensável.",
    resposta30s:
      "O **PM2** é um gerenciador de processos para Node.js: mantém a aplicação rodando, **reinicia quando ela cai**, sobe **várias instâncias em modo cluster** (`-i max`), junta os logs e permite **recarregar sem downtime** (`pm2 reload`). Você o configura por comandos ou por um `ecosystem.config.js`, e `pm2 startup` com `pm2 save` o fazem voltar depois de um reboot. Em contêineres e Kubernetes, o orquestrador já cumpre esse papel, e o PM2 costuma ser dispensável.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine o supervisor de plantão de uma central de atendimento. Ele garante que sempre haja atendentes nas mesas: se um passa mal, coloca outro no lugar; se o movimento cresce, abre mais mesas; na troca de turno, substitui os atendentes um a um para o telefone nunca ficar sem resposta. E mantém um caderno com tudo o que aconteceu.",
        tecnico:
          "O **PM2** é um gerenciador de processos feito em Node.js, usado para executar aplicações Node.js (e outros programas) em servidores. Ele supervisiona o processo e o reinicia quando termina com erro, executa várias instâncias com o módulo `cluster` (veja T45) para usar todos os núcleos, coleta `stdout` e `stderr` em arquivos de log, reinicia o processo que passa de um limite de memória (`max_memory_restart`) e mostra CPU e memória por processo. Ele roda como um daemon próprio, e `pm2 startup` gera a integração com o init do sistema (por exemplo, o systemd) para subir no boot.",
        limite:
          "O supervisor repõe o atendente, mas não descobre por que ele passou mal: reiniciar esconde um bug, não o corrige. O atendente novo também não sabe o que o anterior guardava de cabeça: **estado em memória não sobrevive** a um reinício nem é compartilhado entre instâncias. E o supervisor trabalha na mesma central: se a máquina cai, ele cai junto.",
      },
      {
        tipo: "tabela",
        titulo: "Comandos do dia a dia",
        colunas: ["Comando", "O que faz"],
        linhas: [
          ["`pm2 start app.js -i max`", "Inicia a aplicação em modo cluster, com uma instância por núcleo (`max`)"],
          [
            "`pm2 start ecosystem.config.js --env production`",
            "Inicia as aplicações descritas no arquivo de configuração, com as variáveis do ambiente escolhido",
          ],
          ["`pm2 list` e `pm2 monit`", "Lista os processos, com estado, CPU e memória, e mostra um painel ao vivo"],
          ["`pm2 logs`", "Acompanha os logs de todos os processos (ou de um só)"],
          [
            "`pm2 reload nome`",
            "No modo cluster, troca as instâncias uma a uma, esperando a nova ficar pronta antes de retirar a antiga; `restart` para e sobe de uma vez",
          ],
          [
            "`pm2 startup` e `pm2 save`",
            "`startup` instala o serviço que sobe o PM2 no boot; `save` grava a lista atual de processos para ser restaurada",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "ecosystem.config.js",
        legenda: "JavaScript",
        codigo:
          'module.exports = {\n  apps: [\n    {\n      name: "api",\n      script: "./dist/server.js",\n      instances: "max", // uma por núcleo\n      exec_mode: "cluster",\n      max_memory_restart: "300M", // reinicia se passar disso\n      kill_timeout: 10000, // tempo para encerrar com elegância\n      env_production: {\n        NODE_ENV: "production",\n        PORT: 3000,\n      },\n    },\n  ],\n};',
        nota: 'Use a extensão `.cjs` se o seu projeto declara `"type": "module"`. Nomes de opções e padrões mudam entre versões: confira a documentação do PM2.',
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Quando usar e quando dispensar",
        texto:
          "Use o PM2 quando a aplicação roda **direto numa máquina ou VM**, sem orquestrador: você ganha reinício, cluster, logs e reload com pouco esforço. Dispense quando **contêineres, Kubernetes ou um PaaS** já reiniciam, escalam e recarregam o processo: um supervisor dentro de outro só complica (se ainda precisar dele num contêiner, existe o `pm2-runtime`). Alternativas: o `systemd`, o supervisor do próprio Linux, e o `forever`, mais simples (reinicia, mas não tem cluster). Já o `nodemon` é só para desenvolvimento.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cluster não compartilha memória",
        texto:
          "No modo cluster cada instância tem a sua memória: sessão num `Map`, cache num objeto e contador de limite de taxa viram uma cópia por instância. Guarde o estado fora (banco, Redis). Configure também a **rotação de logs** (o módulo `pm2-logrotate` ou o logrotate do sistema), ou os arquivos crescem até encher o disco, e defina limites de reinício (`max_restarts`, `min_uptime`) para não ficar num laço infinito de falha e reinício.",
      },
    ],
    armadilhas: [
      "Usar o PM2 só para “manter no ar” e ignorar a causa: um processo que cai toda hora esconde um erro; olhe os logs e o motivo de cada reinício.",
      "Manter sessões, cache ou contadores em memória e ligar o modo cluster: cada instância passa a ver um estado diferente.",
      "Esquecer `pm2 save` e `pm2 startup`: depois de um reboot do servidor, nada volta sozinho.",
      "Deixar os logs crescerem sem rotação, ou usar `nodemon` em produção: o primeiro enche o disco, e o segundo é ferramenta de desenvolvimento.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre `pm2 restart` e `pm2 reload`?",
        resposta:
          "`restart` para e sobe os processos de uma vez, com uma janela fora do ar. `reload`, no modo cluster, troca as instâncias uma a uma, esperando a nova ficar pronta antes de retirar a antiga. Em modo fork, o reload se comporta como restart, e a aplicação precisa encerrar com elegância para o ganho valer.",
      },
      {
        pergunta: "Você precisa do PM2 numa aplicação que roda em Kubernetes?",
        resposta:
          "Em geral, não. O orquestrador reinicia contêineres que falham, escala por réplicas, faz atualização gradual e coleta os logs do `stdout`. O PM2 ali duplica o papel e ainda esconde falhas do orquestrador, que deixa de ver o contêiner cair.",
      },
    ],
  },
  en: {
    titulo: "PM2",
    pergunta: "What is PM2 and how is it used in Node.js?",
    porqueEsteMetodo:
      "PM2 is an operations tool, and it makes more sense through intuition (someone looking after your processes) before the commands. The analogy gives the role, the table gives the vocabulary and the limit shows when the tool is unnecessary.",
    resposta30s:
      "**PM2** is a process manager for Node.js: it keeps the application running, **restarts it when it crashes**, starts **several instances in cluster mode** (`-i max`), gathers the logs and allows **reloading without downtime** (`pm2 reload`). You configure it with commands or an `ecosystem.config.js`, and `pm2 startup` plus `pm2 save` bring it back after a reboot. In containers and Kubernetes the orchestrator already plays that role, and PM2 is usually unnecessary.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Picture the duty supervisor of a call center. They make sure there are always agents at the desks: if one falls ill, they put another in place; if call volume grows, they open more desks; at shift change, they swap agents one by one so the phone never goes unanswered. And they keep a logbook of everything that happened.",
        tecnico:
          "**PM2** is a process manager written in Node.js, used to run Node.js applications (and other programs) on servers. It supervises the process and restarts it when it exits with an error, runs several instances with the `cluster` module (see T45) to use every core, collects `stdout` and `stderr` into log files, restarts a process that exceeds a memory limit (`max_memory_restart`) and shows CPU and memory per process. It runs as its own daemon, and `pm2 startup` generates the integration with the system’s init (for example, systemd) so it starts at boot.",
        limite:
          "The supervisor replaces the agent but does not find out why they fell ill: restarting hides a bug, it does not fix it. The new agent also doesn’t know what the previous one kept in their head: **in-memory state does not survive** a restart and is not shared between instances. And the supervisor works in the same call center: if the machine goes down, so do they.",
      },
      {
        tipo: "tabela",
        titulo: "Everyday commands",
        colunas: ["Command", "What it does"],
        linhas: [
          ["`pm2 start app.js -i max`", "Starts the application in cluster mode, with one instance per core (`max`)"],
          [
            "`pm2 start ecosystem.config.js --env production`",
            "Starts the applications described in the configuration file, with the variables of the chosen environment",
          ],
          ["`pm2 list` and `pm2 monit`", "Lists the processes with state, CPU and memory, and shows a live dashboard"],
          ["`pm2 logs`", "Follows the logs of all processes (or just one)"],
          [
            "`pm2 reload name`",
            "In cluster mode, swaps instances one by one, waiting for the new one to be ready before retiring the old one; `restart` stops and starts all at once",
          ],
          [
            "`pm2 startup` and `pm2 save`",
            "`startup` installs the service that starts PM2 at boot; `save` records the current list of processes to be restored",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "ecosystem.config.js",
        legenda: "JavaScript",
        codigo:
          'module.exports = {\n  apps: [\n    {\n      name: "api",\n      script: "./dist/server.js",\n      instances: "max", // one per core\n      exec_mode: "cluster",\n      max_memory_restart: "300M", // restart if it goes over\n      kill_timeout: 10000, // time to shut down gracefully\n      env_production: {\n        NODE_ENV: "production",\n        PORT: 3000,\n      },\n    },\n  ],\n};',
        nota: 'Use the `.cjs` extension if your project declares `"type": "module"`. Option names and defaults change between versions: check the PM2 documentation.',
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "When to use it and when to skip it",
        texto:
          "Use PM2 when the application runs **directly on a machine or VM**, with no orchestrator: you get restarts, cluster, logs and reload with little effort. Skip it when **containers, Kubernetes or a PaaS** already restart, scale and reload the process: one supervisor inside another only complicates things (if you still need it in a container, there is `pm2-runtime`). Alternatives: `systemd`, Linux’s own supervisor, and `forever`, which is simpler (it restarts but has no cluster). `nodemon`, on the other hand, is for development only.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cluster does not share memory",
        texto:
          "In cluster mode each instance has its own memory: sessions in a `Map`, a cache in an object and a rate-limit counter become one copy per instance. Keep state outside (database, Redis). Also set up **log rotation** (the `pm2-logrotate` module or the system’s logrotate), or the files grow until the disk fills, and set restart limits (`max_restarts`, `min_uptime`) so you don’t end up in an endless crash-and-restart loop.",
      },
    ],
    armadilhas: [
      "Using PM2 just to “keep it up” and ignoring the cause: a process that crashes all the time is hiding an error; look at the logs and the reason for each restart.",
      "Keeping sessions, cache or counters in memory and turning on cluster mode: each instance now sees a different state.",
      "Forgetting `pm2 save` and `pm2 startup`: after a server reboot, nothing comes back on its own.",
      "Letting logs grow without rotation, or using `nodemon` in production: the first fills the disk, and the second is a development tool.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `pm2 restart` and `pm2 reload`?",
        resposta:
          "`restart` stops and starts the processes all at once, with a window of downtime. `reload`, in cluster mode, swaps the instances one by one, waiting for the new one to be ready before retiring the old one. In fork mode, reload behaves like restart, and the application must shut down gracefully for the gain to hold.",
      },
      {
        pergunta: "Do you need PM2 for an application running on Kubernetes?",
        resposta:
          "Usually not. The orchestrator restarts containers that fail, scales through replicas, does rolling updates and collects the `stdout` logs. PM2 there duplicates the role and even hides failures from the orchestrator, which no longer sees the container crash.",
      },
    ],
  },
};
