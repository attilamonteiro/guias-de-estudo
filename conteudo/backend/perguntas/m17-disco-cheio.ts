import type { Pergunta } from "../../tipos";

// M17 · Disco cheio
export const m17: Pergunta = {
  numero: 217,
  modulo: "mentorcruise",
  metodo: "playbook",
  pt: {
    titulo: "Disco cheio",
    pergunta: "Como você lidaria com uma situação em que o servidor da sua aplicação está ficando sem espaço em disco?",
    porqueEsteMetodo:
      "Disco cheio é um incidente com ordem de operações: confirmar, achar o que ocupa, liberar o mínimo com segurança e só depois tornar a correção durável. O playbook evita o erro mais caro, que é apagar às pressas o que não devia.",
    resposta30s:
      "Primeiro **confirme** qual sistema de arquivos está cheio (`df -h`) e se o problema é espaço ou **inodes** (`df -i`). Depois **ache o que ocupa** (`du`, `ncdu`), sem esquecer arquivos apagados mas ainda abertos (`lsof +L1`). **Estabilize com o mínimo seguro**: comprimir ou rotacionar logs, truncar em vez de apagar um log aberto, limpar imagens de contêiner e temporários, e nunca apagar arquivos do banco à mão. Por fim, torne a correção **durável**: rotação e retenção de logs, alertas de limiar e de taxa de crescimento, volumes separados, mais disco e uma revisão do incidente.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Confirme: espaço ou inodes?",
            texto:
              "`df -h` mostra qual sistema de arquivos está cheio (dados, raiz, `/var`?). `df -i` mostra os inodes: se o erro é “No space left on device” mas há espaço livre, acabaram os inodes, em geral por milhões de arquivos pequenos. Repita o `df` depois de alguns minutos para medir a velocidade: se enche em minutos, a urgência é máxima.",
          },
          {
            titulo: "Ache o que ocupa",
            texto:
              "`du -xh --max-depth=1 /var | sort -h` ou `ncdu -x /var`, descendo um nível por vez. O `-x` evita atravessar outros pontos de montagem. Para inodes, conte arquivos por diretório em vez de somar tamanhos.",
          },
          {
            titulo: "Procure o espaço fantasma",
            texto:
              "Se o `df` diz que está cheio e a soma do `du` é bem menor, algum processo ainda segura um arquivo já apagado. `lsof +L1` lista os arquivos abertos que não têm mais nome. O espaço volta quando o processo fecha o arquivo: peça que reabra os logs (sinal ou reload) ou reinicie só aquele processo, de forma controlada.",
          },
          {
            titulo: "Estabilize com o mínimo seguro",
            texto:
              "Libere só o necessário para a aplicação voltar a respirar: comprima ou mova logs antigos, trunque (não apague) o log aberto, limpe cache de build e imagens sem uso, apague temporários antigos. Prefira ações reversíveis (comprimir, mover) às irreversíveis, e anote o que foi feito.",
          },
          {
            titulo: "Trate a causa",
            texto:
              "Por que cresceu? Um log em nível de depuração esquecido, um laço de erro gerando mensagens sem parar, upload sem limite, réplica parada segurando WAL ou binlogs, job de limpeza que falhou. Sem a causa, o disco volta a encher.",
          },
          {
            titulo: "Torne durável",
            texto:
              "`logrotate` (ou equivalente) com retenção definida; limites de tamanho nos logs de contêineres; volumes separados para logs, dados e temporários, de modo que um não afogue o outro; alertas de limiar (por exemplo 80% e 90%) **e de taxa de crescimento** (“enche em X horas”); aumentar o disco quando a capacidade realmente faltar.",
          },
          {
            titulo: "Revise o incidente",
            texto:
              "Linha do tempo, causa, o que detectou o problema (alerta ou usuário?), o que faltava para detectar antes e quais ações de prevenção ficam com dono e prazo. Sem culpados: o foco é o processo.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Os suspeitos de sempre",
        colunas: ["Suspeito", "Como verificar", "Ação segura"],
        linhas: [
          [
            "Logs do sistema e da aplicação",
            "`du -xh /var/log`; `journalctl --disk-usage` em sistemas com systemd",
            "Comprimir e rotacionar; `journalctl --vacuum-size=…` ou `--vacuum-time=…`; truncar o log aberto em vez de apagá-lo",
          ],
          [
            "Imagens, contêineres e volumes",
            "`docker system df`",
            "`docker image prune` e `docker builder prune` removem só o que não é usado; nunca execute prune de volumes sem conferir o que guardam, porque podem conter dados",
          ],
          [
            "Temporários e uploads incompletos",
            "`du -xh /tmp /var/tmp` e a pasta de uploads",
            "Apagar o que é antigo e que nenhum processo usa",
          ],
          [
            "Core dumps",
            "Pasta de core dumps; `coredumpctl list` em sistemas com systemd",
            "Remover os antigos e limitar tamanho e retenção",
          ],
          [
            "WAL e binlogs do banco",
            "Tamanho do diretório de logs de transação; réplica atrasada, slot de replicação parado ou arquivamento falhando",
            "Consertar a causa e deixar o próprio banco reciclar (no MySQL, `PURGE BINARY LOGS` depois de conferir que as réplicas já leram). Nunca apagar arquivos do banco à mão",
          ],
          [
            "Backups e dumps locais esquecidos",
            "`ls -lh` na pasta de backups",
            "Mover para armazenamento externo depois de conferir que a cópia chegou; nunca apagar o único backup",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Antes de qualquer comando destrutivo em produção",
        texto:
          "Confira **onde você está** (`hostname`, o ponto de montagem e o caminho exato) e liste o que o comando vai atingir (`ls`, `du`) antes de executá-lo. Evite `rm -rf` com variável ou curinga, que expande para o que não devia quando a variável está vazia. Prefira comprimir ou mover a apagar. Em arquivos de banco, não mexa à mão: use os comandos do próprio banco. Na dúvida entre apagar e esperar, espere e pergunte.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Truncar, não apagar, o log aberto",
        texto:
          "Apagar com `rm` o log de um processo em execução não devolve o espaço: o arquivo continua aberto, e o processo segue escrevendo num arquivo que ninguém mais vê. Truncar (`: > arquivo.log` ou `truncate -s 0 arquivo.log`) esvazia o mesmo arquivo e libera o espaço na hora, mas descarta o conteúdo: copie ou comprima antes se o log for útil para investigar. O melhor é rotacionar de modo que o processo reabra o arquivo. Depois de qualquer um dos dois, confirme com `df` que o espaço realmente voltou.",
      },
    ],
    armadilhas: [
      "Apagar com `rm` o log de um processo ativo: o espaço só volta quando o processo fecha o arquivo.",
      "Olhar só o `df -h`: o disco pode estar “cheio” por inodes (`df -i`), e liberar gigabytes não resolve.",
      "Apagar WAL, binlogs ou arquivos de dados do banco à mão: pode corromper a base e quebrar a replicação e a recuperação.",
      "Dar o incidente por encerrado quando o alarme silencia: sem rotação, retenção e alerta de taxa de crescimento, o disco enche de novo.",
    ],
    autoteste: [
      {
        pergunta: "O `df` mostra 100% de uso, mas a soma do `du` é bem menor. O que provavelmente acontece?",
        resposta:
          "Há arquivos apagados que algum processo ainda mantém abertos. `lsof +L1` os lista, e o espaço volta quando o processo fecha o arquivo (reabrindo o log ou sendo reiniciado).",
      },
      {
        pergunta: "Aparece “No space left on device”, mas o `df -h` mostra espaço livre. Por quê?",
        resposta:
          "Os inodes acabaram (`df -i`), em geral por milhões de arquivos pequenos. A solução é remover ou consolidar esses arquivos, não liberar gigabytes.",
      },
      {
        pergunta: "Por que alertar apenas em 90% de uso pode não bastar?",
        resposta:
          "Um disco que cresce rápido vai de 90% a 100% em minutos. É preciso alertar também pela taxa de crescimento (em quanto tempo vai encher).",
      },
    ],
  },
  en: {
    titulo: "Full disk",
    pergunta: "How would you handle a situation where your application's server is running out of disk space?",
    porqueEsteMetodo:
      "A full disk is an incident with an order of operations: confirm, find what is using the space, free the minimum safely and only then make the fix durable. The playbook prevents the costliest mistake, deleting the wrong thing in a hurry.",
    resposta30s:
      "First **confirm** which file system is full (`df -h`) and whether the problem is space or **inodes** (`df -i`). Then **find what is using it** (`du`, `ncdu`), without forgetting files that were deleted but are still open (`lsof +L1`). **Stabilize with the safest minimum**: compress or rotate logs, truncate instead of deleting an open log, clear container images and temp files, and never delete database files by hand. Finally make the fix **durable**: log rotation and retention, threshold and growth-rate alerts, separate volumes, more disk and an incident review.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Confirm: space or inodes?",
            texto:
              "`df -h` shows which file system is full (data, root, `/var`?). `df -i` shows inodes: if the error is “No space left on device” but there is free space, inodes ran out, usually because of millions of small files. Run `df` again a few minutes later to measure the speed: if it fills in minutes, urgency is maximal.",
          },
          {
            titulo: "Find what uses it",
            texto:
              "`du -xh --max-depth=1 /var | sort -h` or `ncdu -x /var`, going down one level at a time. `-x` avoids crossing into other mount points. For inodes, count files per directory instead of summing sizes.",
          },
          {
            titulo: "Look for phantom space",
            texto:
              "If `df` says full while the `du` total is much smaller, some process is still holding a deleted file. `lsof +L1` lists open files that no longer have a name. The space returns when the process closes the file: ask it to reopen its logs (signal or reload) or restart just that process in a controlled way.",
          },
          {
            titulo: "Stabilize with the safe minimum",
            texto:
              "Free only what lets the application breathe again: compress or move old logs, truncate (do not delete) the open log, clear build cache and unused images, delete old temp files. Prefer reversible actions (compress, move) to irreversible ones, and write down what you did.",
          },
          {
            titulo: "Fix the cause",
            texto:
              "Why did it grow? A debug log level left on, an error loop emitting messages nonstop, an unbounded upload, a stalled replica holding WAL or binlogs, a cleanup job that failed. Without the cause, the disk fills up again.",
          },
          {
            titulo: "Make it durable",
            texto:
              "`logrotate` (or equivalent) with defined retention; size limits on container logs; separate volumes for logs, data and temp files so one cannot drown the others; threshold alerts (for example 80% and 90%) **and growth-rate alerts** (“fills in X hours”); more disk when capacity is truly lacking.",
          },
          {
            titulo: "Review the incident",
            texto:
              "Timeline, cause, what detected the problem (an alert or a user?), what was missing to detect it earlier, and which preventive actions get an owner and a deadline. Blameless: the focus is the process.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "The usual suspects",
        colunas: ["Suspect", "How to check", "Safe action"],
        linhas: [
          [
            "System and application logs",
            "`du -xh /var/log`; `journalctl --disk-usage` on systemd systems",
            "Compress and rotate; `journalctl --vacuum-size=…` or `--vacuum-time=…`; truncate the open log instead of deleting it",
          ],
          [
            "Images, containers and volumes",
            "`docker system df`",
            "`docker image prune` and `docker builder prune` remove only what is unused; never prune volumes without checking what they hold, because they may contain data",
          ],
          [
            "Temp files and incomplete uploads",
            "`du -xh /tmp /var/tmp` and the uploads folder",
            "Delete what is old and not used by any process",
          ],
          [
            "Core dumps",
            "The core dump folder; `coredumpctl list` on systemd systems",
            "Remove old ones and limit size and retention",
          ],
          [
            "Database WAL and binlogs",
            "Size of the transaction-log directory; lagging replica, stalled replication slot or failing archiving",
            "Fix the cause and let the database recycle them itself (in MySQL, `PURGE BINARY LOGS` after checking that replicas have read them). Never delete database files by hand",
          ],
          [
            "Forgotten local backups and dumps",
            "`ls -lh` on the backup folder",
            "Move to external storage after confirming the copy arrived; never delete the only backup",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Before any destructive command in production",
        texto:
          "Check **where you are** (`hostname`, the mount point and the exact path) and list what the command will hit (`ls`, `du`) before running it. Avoid `rm -rf` with a variable or wildcard, which expands to something unintended when the variable is empty. Prefer compressing or moving to deleting. For database files, do not touch them by hand: use the database’s own commands. When in doubt between deleting and waiting, wait and ask.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Truncate, do not delete, the open log",
        texto:
          "Deleting with `rm` the log of a running process does not return the space: the file stays open, and the process keeps writing to a file nobody can see. Truncating (`: > file.log` or `truncate -s 0 file.log`) empties the same file and frees the space at once, but discards the content: copy or compress first if the log helps the investigation. Best of all is rotation in which the process reopens the file. After either one, confirm with `df` that the space really came back.",
      },
    ],
    armadilhas: [
      "Deleting with `rm` the log of an active process: the space only returns when the process closes the file.",
      "Looking only at `df -h`: the disk may be “full” because of inodes (`df -i`), and freeing gigabytes does not help.",
      "Deleting WAL, binlogs or data files of the database by hand: it can corrupt the database and break replication and recovery.",
      "Closing the incident when the alarm goes quiet: without rotation, retention and a growth-rate alert, the disk fills up again.",
    ],
    autoteste: [
      {
        pergunta: "`df` shows 100% usage, but the `du` total is much smaller. What is probably happening?",
        resposta:
          "There are deleted files that some process still holds open. `lsof +L1` lists them, and the space returns when the process closes the file (by reopening its log or being restarted).",
      },
      {
        pergunta: "You get “No space left on device”, yet `df -h` shows free space. Why?",
        resposta:
          "Inodes ran out (`df -i`), usually because of millions of small files. The fix is to remove or consolidate those files, not to free gigabytes.",
      },
      {
        pergunta: "Why may alerting only at 90% usage not be enough?",
        resposta:
          "A fast-growing disk goes from 90% to 100% in minutes. You also need to alert on the growth rate (how long until it fills).",
      },
    ],
  },
};
