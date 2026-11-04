import type { Pergunta } from "../../tipos";

// G44 · Escutar na porta 80
export const g044: Pergunta = {
  numero: 644,
  modulo: "gist-avancado",
  metodo: "playbook",
  pt: {
    titulo: "Escutar na porta 80",
    pergunta: "Como você pode escutar na porta 80 com o Node?",
    porqueEsteMetodo:
      "“Como fazer” pede uma sequência de decisões com critério de acerto: confirmar o erro, escolher a saída menos arriscada e conferir o resultado. Um playbook mostra a ordem certa e deixa claro o que evitar.",
    resposta30s:
      "Em sistemas Unix, portas abaixo de 1024 são **privilegiadas**: um processo comum que chama `listen(80)` recebe **`EACCES`**. A saída recomendada é deixar o Node numa **porta alta** (lida de `PORT`) atrás de um **proxy reverso** que escuta em 80/443. Alternativas: **redirecionar** a porta (iptables/nftables, mapeamento do contêiner, balanceador ou PaaS) ou dar só a capacidade `CAP_NET_BIND_SERVICE` ao serviço (systemd) ou ao binário (`setcap`). **Nunca rode a aplicação inteira como root.**",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: do `EACCES` à porta 80",
        passos: [
          {
            titulo: "Confirme que é permissão",
            texto:
              "Sinal: ao subir, o Node falha com `listen EACCES: permission denied` na porta 80, e o mesmo código funciona numa porta alta, como 3000. Em sistemas Unix, portas abaixo de 1024 são privilegiadas. Se o erro for `EADDRINUSE`, o problema é outro (passo 6). Em Windows e macOS a regra pode ser diferente: confira.",
          },
          {
            titulo: "Prefira um proxy reverso (recomendado)",
            texto:
              "Coloque Nginx, Caddy, HAProxy ou similar em 80/443 e deixe o Node numa porta alta, escutando só em `127.0.0.1`. O proxy também cuida de HTTPS, compressão, limites e arquivos estáticos (veja D64). Critério de acerto: `curl -i http://seu-servidor/` chega ao Node, e a porta do Node não é acessível de fora da máquina.",
          },
          {
            titulo: "Ou redirecione a porta",
            texto:
              "Deixe quem já tem privilégio receber a 80: uma regra como `iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000` (ou o equivalente em nftables; vale para tráfego vindo de fora), o mapeamento de porta do contêiner (`docker run -p 80:3000 …`), um balanceador ou uma plataforma que entrega o tráfego à porta indicada em `PORT`. O Node continua sem privilégio. Em contêiner, ele precisa escutar em `0.0.0.0`, senão o mapeamento não o alcança.",
          },
          {
            titulo: "Ou conceda só a permissão de portas baixas",
            texto:
              "No Linux, a capacidade `CAP_NET_BIND_SERVICE` deixa um processo comum abrir portas abaixo de 1024. Melhor forma: na unidade systemd, `User=` comum e `AmbientCapabilities=CAP_NET_BIND_SERVICE`, que vale só para aquele serviço. Outra: socket activation, em que o systemd abre a 80 e entrega o socket já aberto ao processo. Último recurso: `setcap 'cap_net_bind_service=+ep'` no binário do `node`, que vale para qualquer script que esse binário rode e se perde quando o binário é trocado ou atualizado.",
          },
          {
            titulo: "Não resolva com root",
            texto:
              "Rodar a aplicação inteira como root elimina o `EACCES` e entrega a máquina a qualquer falha do seu código ou das suas dependências. Se for inevitável iniciar como root, abra a porta e troque para um usuário comum logo depois (`process.setgid()` e `process.setuid()`, só em sistemas Unix). Critério de acerto: `ps -o user= -p <pid>` não mostra `root`.",
          },
          {
            titulo: "Confira o endereço e a porta",
            texto:
              "`EADDRINUSE` significa que outro processo já usa a 80 (muitas vezes o Nginx ou o Apache padrão); `ss -ltnp` mostra quem. Se o servidor responde em `localhost` mas não de fora, ele escuta só no endereço local: omita o `host` no `listen` ou use `0.0.0.0`. Para HTTPS na 443, vale a mesma restrição de porta privilegiada, e o proxy costuma terminar o TLS.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Porta lida do ambiente e erros de `listen` tratados",
        legenda: "JavaScript",
        codigo: [
          'import { createServer } from "node:http";',
          "",
          "const porta = Number(process.env.PORT ?? 3000); // porta alta, sem privilégio",
          'const servidor = createServer((req, res) => res.end("ok"));',
          "",
          'servidor.on("error", (erro) => {',
          '  if (erro.code === "EACCES") console.error(`sem permissão para abrir a porta ${porta}`);',
          '  else if (erro.code === "EADDRINUSE") console.error(`a porta ${porta} já está em uso`);',
          "  else console.error(erro);",
          "  process.exit(1);",
          "});",
          "",
          '// 127.0.0.1: só o proxy da mesma máquina alcança; em contêiner, use "0.0.0.0"',
          'servidor.listen(porta, "127.0.0.1", () => console.log(`escutando em ${porta}`));',
        ].join("\n"),
        nota: "Os erros de `listen` chegam pelo evento `error` do servidor. Com `PORT=80`, sem privilégio, o programa avisa e sai em vez de falhar sem explicação.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Ordem de preferência",
        texto:
          "O Node fica numa **porta alta e sem privilégio**; quem já tem privilégio (proxy, systemd, contêiner, balanceador) cuida da porta 80. Na prática: 1) proxy reverso ou plataforma que expõe 80/443; 2) redirecionamento de porta; 3) capacidade só para o serviço, pelo systemd; 4) `setcap` no binário; e nunca root. Leia a porta de `PORT`, para o mesmo código rodar atrás do proxy, no contêiner e em plataformas que escolhem a porta por você.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Atalhos que parecem inofensivos",
        texto:
          "`sudo node app.js` funciona e é um risco permanente. `setcap` no `node` libera a porta 80 para todo script que usar aquele binário. Baixar o limite de portas privilegiadas do sistema (`net.ipv4.ip_unprivileged_port_start`, no Linux) vale para a máquina inteira, não só para o seu serviço. Se escolher um deles, faça de forma consciente e confira a documentação do seu sistema e do Node.",
      },
    ],
    armadilhas: [
      "Rodar com `sudo` ou como root “só para funcionar”: qualquer falha de segurança do código ou das dependências passa a valer para a máquina inteira.",
      "Aplicar `setcap` no `node` e esquecer que ele vale para qualquer script e some quando o binário é trocado (por exemplo, ao mudar de versão com um gerenciador).",
      "Fixar a porta 80 no código: leia `PORT`, para o mesmo programa rodar atrás de um proxy, num contêiner e em plataformas que escolhem a porta.",
      "Escutar só em `127.0.0.1` num contêiner ou numa máquina que deveria ser acessível de fora (ou o contrário: expor sem proxy uma porta que deveria ser interna).",
    ],
    autoteste: [
      {
        pergunta: "Por que `listen(80)` dá `EACCES` e `listen(3000)` não?",
        resposta:
          "Porque em sistemas Unix as portas abaixo de 1024 são privilegiadas: só root, ou um processo com a capacidade `CAP_NET_BIND_SERVICE`, pode abri-las. A 3000 é uma porta alta, aberta por qualquer usuário.",
      },
      {
        pergunta: "Qual é a forma recomendada de atender na porta 80 e por quê?",
        resposta:
          "Um proxy reverso em 80/443 com o Node numa porta alta atrás dele. O Node não precisa de privilégio, e o proxy ainda cuida de HTTPS, compressão, limites e arquivos estáticos.",
      },
    ],
  },
  en: {
    titulo: "Listening on port 80",
    pergunta: "How can you listen on port 80 with Node?",
    porqueEsteMetodo:
      "“How do you do it” calls for a sequence of decisions with a success criterion: confirm the error, pick the least risky way out and check the result. A playbook shows the right order and makes clear what to avoid.",
    resposta30s:
      "On Unix systems, ports below 1024 are **privileged**: an ordinary process calling `listen(80)` gets **`EACCES`**. The recommended way out is to keep Node on a **high port** (read from `PORT`) behind a **reverse proxy** listening on 80/443. Alternatives: **redirect** the port (iptables/nftables, container port mapping, a load balancer or a PaaS) or grant only the `CAP_NET_BIND_SERVICE` capability to the service (systemd) or to the binary (`setcap`). **Never run the whole application as root.**",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from `EACCES` to port 80",
        passos: [
          {
            titulo: "Confirm it is a permission problem",
            texto:
              "Signal: on startup, Node fails with `listen EACCES: permission denied` on port 80, and the same code works on a high port such as 3000. On Unix systems, ports below 1024 are privileged. If the error is `EADDRINUSE`, the problem is something else (step 6). On Windows and macOS the rule may differ: check.",
          },
          {
            titulo: "Prefer a reverse proxy (recommended)",
            texto:
              "Put Nginx, Caddy, HAProxy or similar on 80/443 and leave Node on a high port, listening only on `127.0.0.1`. The proxy also handles HTTPS, compression, limits and static files (see D64). Success criterion: `curl -i http://your-server/` reaches Node, and Node's port is not reachable from outside the machine.",
          },
          {
            titulo: "Or redirect the port",
            texto:
              "Let something that already has privilege receive port 80: a rule such as `iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000` (or the nftables equivalent; it applies to traffic coming from outside), the container port mapping (`docker run -p 80:3000 …`), a load balancer or a platform that hands traffic to the port given in `PORT`. Node stays unprivileged. In a container, it must listen on `0.0.0.0`, otherwise the mapping cannot reach it.",
          },
          {
            titulo: "Or grant only the low-port permission",
            texto:
              "On Linux, the `CAP_NET_BIND_SERVICE` capability lets an ordinary process open ports below 1024. Best form: in the systemd unit, an ordinary `User=` plus `AmbientCapabilities=CAP_NET_BIND_SERVICE`, which applies only to that service. Another: socket activation, where systemd opens port 80 and hands the already-open socket to the process. Last resort: `setcap 'cap_net_bind_service=+ep'` on the `node` binary, which applies to any script that binary runs and is lost when the binary is replaced or updated.",
          },
          {
            titulo: "Do not fix it with root",
            texto:
              "Running the whole application as root removes the `EACCES` and hands the machine to any flaw in your code or dependencies. If starting as root is unavoidable, open the port and switch to an ordinary user right afterwards (`process.setgid()` and `process.setuid()`, Unix only). Success criterion: `ps -o user= -p <pid>` does not show `root`.",
          },
          {
            titulo: "Check the address and the port",
            texto:
              "`EADDRINUSE` means another process already uses port 80 (often the default Nginx or Apache); `ss -ltnp` shows which. If the server answers on `localhost` but not from outside, it listens only on the local address: omit the `host` in `listen` or use `0.0.0.0`. For HTTPS on 443, the same privileged-port restriction applies, and the proxy usually terminates TLS.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Port read from the environment and `listen` errors handled",
        legenda: "JavaScript",
        codigo: [
          'import { createServer } from "node:http";',
          "",
          "const port = Number(process.env.PORT ?? 3000); // high port, no privilege",
          'const server = createServer((req, res) => res.end("ok"));',
          "",
          'server.on("error", (error) => {',
          '  if (error.code === "EACCES") console.error(`no permission to open port ${port}`);',
          '  else if (error.code === "EADDRINUSE") console.error(`port ${port} is already in use`);',
          "  else console.error(error);",
          "  process.exit(1);",
          "});",
          "",
          '// 127.0.0.1: only the proxy on the same machine can reach it; in a container, use "0.0.0.0"',
          'server.listen(port, "127.0.0.1", () => console.log(`listening on ${port}`));',
        ].join("\n"),
        nota: "`listen` errors arrive through the server's `error` event. With `PORT=80` and no privilege, the program says so and exits instead of failing without an explanation.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Order of preference",
        texto:
          "Node stays on a **high, unprivileged port**; whatever already has privilege (proxy, systemd, container, load balancer) takes care of port 80. In practice: 1) a reverse proxy or a platform that exposes 80/443; 2) port redirection; 3) a capability for the service only, through systemd; 4) `setcap` on the binary; and never root. Read the port from `PORT`, so the same code runs behind the proxy, in a container and on platforms that pick the port for you.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Shortcuts that look harmless",
        texto:
          "`sudo node app.js` works and is a permanent risk. `setcap` on `node` frees port 80 for every script that uses that binary. Lowering the system's privileged-port limit (`net.ipv4.ip_unprivileged_port_start`, on Linux) applies to the whole machine, not just your service. If you choose one of them, do it knowingly and check the documentation of your system and of Node.",
      },
    ],
    armadilhas: [
      "Running with `sudo` or as root “just to make it work”: any security flaw in the code or the dependencies now applies to the whole machine.",
      "Applying `setcap` to `node` and forgetting it covers any script and disappears when the binary is replaced (for example, when switching versions with a version manager).",
      "Hard-coding port 80: read `PORT`, so the same program runs behind a proxy, in a container and on platforms that choose the port.",
      "Listening only on `127.0.0.1` in a container or on a machine that should be reachable from outside (or the opposite: exposing without a proxy a port that should be internal).",
    ],
    autoteste: [
      {
        pergunta: "Why does `listen(80)` give `EACCES` while `listen(3000)` does not?",
        resposta:
          "Because on Unix systems ports below 1024 are privileged: only root, or a process with the `CAP_NET_BIND_SERVICE` capability, can open them. Port 3000 is a high port that any user can open.",
      },
      {
        pergunta: "What is the recommended way to serve on port 80, and why?",
        resposta:
          "A reverse proxy on 80/443 with Node on a high port behind it. Node needs no privilege, and the proxy also handles HTTPS, compression, limits and static files.",
      },
    ],
  },
};
