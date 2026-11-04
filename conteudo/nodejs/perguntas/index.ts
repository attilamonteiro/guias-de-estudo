import type { Pergunta } from "../../tipos";
import { q01 } from "./q01-o-que-e-nodejs";
import { q02 } from "./q02-vantagens-e-desvantagens";
import { q03 } from "./q03-instalacao-global";
import { q04 } from "./q04-modularizacao";
import { q05 } from "./q05-repl";
import { q06 } from "./q06-o-que-e-o-nodejs";
import { q07 } from "./q07-nodejs-e-multiplataforma";
import { q08 } from "./q08-o-que-torna-o-nodejs-diferente";
import { q09 } from "./q09-nodejs-e-codigo-aberto";
import { q10 } from "./q10-o-que-construir-com-nodejs";
import { q11 } from "./q11-nodejs-usa-javascript";
import { q12 } from "./q12-npm-install";
import { q13 } from "./q13-frameworks-populares";
import { q14 } from "./q14-express";
import { q15 } from "./q15-npm";
import { q16 } from "./q16-nodejs-e-multithread";
import { q17 } from "./q17-seguranca-no-nodejs";
import { q18 } from "./q18-node-vs-javascript";
import { q19 } from "./q19-apis-nativas";
import { q20 } from "./q20-v8-no-nodejs";
import { q21 } from "./q21-tarefas-assincronas-no-event-loop";
import { q22 } from "./q22-package-json";
import { q23 } from "./q23-exit-code";
import { q24 } from "./q24-latencia-e-escalabilidade";
import { q25 } from "./q25-javascript-para-cpp";
import { q26 } from "./q26-programacao-orientada-a-eventos";
import { q27 } from "./q27-ajax-vs-nodejs";
import { q28 } from "./q28-event-loop-e-nao-bloqueante";
import { q29 } from "./q29-onde-ficam-as-dependencias";
import { q30 } from "./q30-funcao-control";
import { q31 } from "./q31-quando-modularizar";
import { q32 } from "./q32-callbacks";
import { q33 } from "./q33-instalar-uma-biblioteca";
import { q34 } from "./q34-front-end-com-nodejs";
import { q35 } from "./q35-threads-filhas";
import { q36 } from "./q36-gerenciar-threads-filhas";
import { q37 } from "./q37-streams";
import { q38 } from "./q38-callback-hell";
import { q39 } from "./q39-o-que-e-um-evento";
import { q40 } from "./q40-nodejs-vs-angular";
import { q41 } from "./q41-controle-de-fluxo";
import { q42 } from "./q42-module-exports";
import { q43 } from "./q43-libuv";
import { q44 } from "./q44-o-que-e-o-express";
import { q45 } from "./q45-modulo-cluster";
import { q46 } from "./q46-criptografia-no-nodejs";
import { q47 } from "./q47-registro-do-npm";
import { q48 } from "./q48-servidor-http";
import { q49 } from "./q49-npm-g";
import { q50 } from "./q50-escalar-uma-aplicacao-nodejs";
import { q51 } from "./q51-escopo-no-nodejs";
import { q52 } from "./q52-debug-no-nodejs";
import { q53 } from "./q53-jobs-em-segundo-plano";
import { q54 } from "./q54-versoes-lts";
import { q55 } from "./q55-async-queue";
import { q56 } from "./q56-createreadstream-vs-readfile";
import { q57 } from "./q57-reactor-pattern";
import { q58 } from "./q58-child-process";
import { q59 } from "./q59-worker-thread-vs-processo-filho";
import { q60 } from "./q60-punycode";
import { q61 } from "./q61-eventemitter";
import { l001 } from "./l001-o-que-e-o-node-js";
import { l002 } from "./l002-node-js-x-javascript";
import { l003 } from "./l003-ambiente-de-execucao";
import { l004 } from "./l004-single-thread";
import { l005 } from "./l005-concorrencia-no-node-js";
import { l006 } from "./l006-o-motor-v8";
import { l007 } from "./l007-o-event-loop";
import { l008 } from "./l008-fases-do-event-loop";
import { l009 } from "./l009-e-s-nao-bloqueante";
import { l010 } from "./l010-arquitetura-orientada-a-eventos";
import { l011 } from "./l011-repl";
import { l012 } from "./l012-modulos-do-node-js";
import { l013 } from "./l013-commonjs-vs-es-modules";
import { l014 } from "./l014-require-vs-import";
import { l015 } from "./l015-package-json";
import { l016 } from "./l016-package-lock-json";
import { l017 } from "./l017-npm";
import { l018 } from "./l018-dependencies-vs-devdependencies";
import { l019 } from "./l019-versionamento-semantico";
import { l020 } from "./l020-variaveis-de-ambiente";
import { l021 } from "./l021-callback";
import { l022 } from "./l022-callback-hell";
import { l023 } from "./l023-evitar-callback-hell";
import { l024 } from "./l024-promises-e-async-await";
import { l025 } from "./l025-async-await";
import { l026 } from "./l026-promise-all-allsettled-race-any";
import { l027 } from "./l027-nexttick-setimmediate-microtasks";
import { l028 } from "./l028-settimeout-vs-setimmediate";
import { l029 } from "./l029-bloquear-o-event-loop";
import { l030 } from "./l030-identificar-bloqueio-do-event-loop";
import { l031 } from "./l031-microtasks-e-macrotasks";
import { l032 } from "./l032-erros-em-codigo-assincrono";
import { l033 } from "./l033-abortcontroller";
import { l034 } from "./l034-cancelar-uma-operacao-assincrona";
import { l035 } from "./l035-cpu-intensiva-e-um-problema";
import { l036 } from "./l036-o-que-e-o-express-js";
import { l037 } from "./l037-middleware";
import { l038 } from "./l038-tipos-de-middleware";
import { l039 } from "./l039-execucao-do-middleware";
import { l040 } from "./l040-middleware-de-aplicacao-x-de-roteador";
import { l041 } from "./l041-erros-no-express";
import { l042 } from "./l042-cors";
import { l043 } from "./l043-body-parsing";
import { l044 } from "./l044-body-parser-ainda-e-necessario";
import { l045 } from "./l045-autenticacao-e-autorizacao";
import { l046 } from "./l046-autorizacao";
import { l047 } from "./l047-jwt-vs-sessao";
import { l048 } from "./l048-proteger-apis-rest";
import { l049 } from "./l049-rate-limiting";
import { l050 } from "./l050-validacao-de-entrada";
import { l051 } from "./l051-upload-de-arquivos";
import { l052 } from "./l052-versionamento-de-api";
import { l053 } from "./l053-respostas-de-api-consistentes";
import { l054 } from "./l054-erros-de-api-e-respostas";
import { l055 } from "./l055-codigos-de-status-http";
import { l056 } from "./l056-buffer";
import { l057 } from "./l057-o-que-sao-streams";
import { l058 } from "./l058-os-quatro-tipos-de-stream";
import { l059 } from "./l059-readable-vs-writable";
import { l060 } from "./l060-stream-transform";
import { l061 } from "./l061-stream-duplex";
import { l062 } from "./l062-backpressure-e-pipeline";
import { l063 } from "./l063-processar-um-arquivo-grande";
import { l064 } from "./l064-pipeline";
import { l065 } from "./l065-modulo-fs";
import { l066 } from "./l066-arquivos-sincrono-x-assincrono";
import { l067 } from "./l067-servico-de-upload-grande";
import { l068 } from "./l068-transmitir-video-ou-arquivo";
import { l069 } from "./l069-processos-filhos";
import { l070 } from "./l070-spawn-exec-execfile-e-fork";
import { l071 } from "./l071-modulo-cluster";
import { l072 } from "./l072-cluster-vs-worker-threads";
import { l073 } from "./l073-worker-threads";
import { l074 } from "./l074-quando-usar-worker-threads";
import { l075 } from "./l075-comunicacao-com-a-thread-principal";
import { l076 } from "./l076-memoria-compartilhada";
import { l077 } from "./l077-tarefas-intensivas-de-cpu";
import { l078 } from "./l078-escalar-entre-nucleos-de-cpu";
import { l079 } from "./l079-processo-filho-em-vez-de-worker";
import { l080 } from "./l080-isolar-cargas-de-cpu";
import { l081 } from "./l081-es-modules-no-nodejs";
import { l082 } from "./l082-fetch-nativo";
import { l083 } from "./l083-cancelar-uma-requisicao-http";
import { l084 } from "./l084-asynclocalstorage";
import { l085 } from "./l085-asynclocalstorage-em-producao";
import { l086 } from "./l086-test-runner-nativo";
import { l087 } from "./l087-escrever-testes-com-o-test-runner";
import { l088 } from "./l088-permission-model";
import { l089 } from "./l089-restringir-acessos";
import { l090 } from "./l090-prefixo-node";
import { l091 } from "./l091-beneficios-dos-modulos-nativos";
import { l092 } from "./l092-esm-e-commonjs-juntos";
import { l093 } from "./l093-conexoes-de-banco";
import { l094 } from "./l094-pool-de-conexoes";
import { l095 } from "./l095-transacoes-de-banco";
import { l096 } from "./l096-evitar-vazamento-de-conexoes";
import { l097 } from "./l097-estrutura-de-projeto";
import { l098 } from "./l098-monolito-vs-microsservicos-no-node";
import { l099 } from "./l099-comunicacao-entre-servicos";
import { l100 } from "./l100-cache-e-redis";
import { l101 } from "./l101-onde-usar-o-redis";
import { l102 } from "./l102-jobs-em-segundo-plano";
import { l103 } from "./l103-kafka-ou-fila";
import { l104 } from "./l104-api-idempotente";
import { l105 } from "./l105-retentativas-e-apis-instaveis";
import { l106 } from "./l106-evitar-processamento-duplicado";
import { l107 } from "./l107-processamento-distribuido-de-jobs";
import { l108 } from "./l108-falhas-de-banco";
import { l109 } from "./l109-desempenho-de-api";
import { l110 } from "./l110-vazamento-de-memoria";
import { l111 } from "./l111-cpu-alta-e-profiling";
import { l112 } from "./l112-latencia-do-event-loop";
import { l113 } from "./l113-profiling";
import { l114 } from "./l114-picos-de-trafego";
import { l115 } from "./l115-graceful-shutdown";
import { l116 } from "./l116-excecoes-nao-tratadas";
import { l117 } from "./l117-logs-estruturados";
import { l118 } from "./l118-monitorar-em-producao";
import { l119 } from "./l119-melhorar-o-tempo-de-resposta";
import { l120 } from "./l120-otimizar-consultas-ao-banco";
import { l121 } from "./l121-evitar-bloqueios-em-producao";
import { l122 } from "./l122-servico-de-alta-disponibilidade";
import { l123 } from "./l123-injecao-sql-e-nosql";
import { l124 } from "./l124-xss-e-csrf";
import { l125 } from "./l125-armazenar-senhas";
import { l126 } from "./l126-segredos-e-chaves";
import { l127 } from "./l127-proteger-autenticacao-com-jwt";
import { l128 } from "./l128-vulnerabilidades-comuns";
import { l129 } from "./l129-proteger-contra-forca-bruta";
import { l130 } from "./l130-uploads-de-usuarios-com-seguranca";
import { l131 } from "./l131-auditar-dependencias-npm";
import { l132 } from "./l132-proteger-em-producao";
import { l133 } from "./l133-latencia-subiu-de-200ms-para-5s";
import { l134 } from "./l134-cenario-2-cpu-em-100";
import { l135 } from "./l135-cenario-3-memoria-sempre-subindo";
import { l136 } from "./l136-cenario-4-um-endpoint-bloqueia-os-outros";
import { l137 } from "./l137-cenario-5-100-mil-requisicoes-por-minuto";
import { l138 } from "./l138-cenario-6-api-de-pagamento-instavel";
import { d001 } from "./d001-o-que-e-o-node-js";
import { d002 } from "./d002-threads-filhas";
import { d003 } from "./d003-programacao-orientada-a-eventos";
import { d004 } from "./d004-o-event-loop";
import { d005 } from "./d005-node-js-x-servidores-tradicionais";
import { d006 } from "./d006-e-s-nao-bloqueante";
import { d007 } from "./d007-atualizar-o-node-js";
import { d008 } from "./d008-npm";
import { d009 } from "./d009-gerenciar-pacotes";
import { d010 } from "./d010-package-json";
import { d011 } from "./d011-modulos-nativos";
import { d012 } from "./d012-servidor-com-http";
import { d013 } from "./d013-finalidade-do-fs";
import { d014 } from "./d014-classe-buffer";
import { d015 } from "./d015-tipos-de-streams";
import { d016 } from "./d016-ler-e-escrever-arquivos";
import { d017 } from "./d017-usar-o-eventemitter";
import { d018 } from "./d018-querystring-e-urlsearchparams";
import { d019 } from "./d019-o-modulo-path";
import { d020 } from "./d020-callbacks";
import { d021 } from "./d021-callback-hell";
import { d022 } from "./d022-promises";
import { d023 } from "./d023-async-await";
import { d024 } from "./d024-fs-sincrono-x-assincrono";
import { d025 } from "./d025-requisicoes-e-respostas-http";
import { d026 } from "./d026-o-que-e-o-express";
import { d027 } from "./d027-criar-uma-api-rest";
import { d028 } from "./d028-middleware";
import { d029 } from "./d029-cabecalhos-de-seguranca-e-helmet";
import { d030 } from "./d030-tratar-erros";
import { d031 } from "./d031-padrao-error-first";
import { d032 } from "./d032-tecnicas-de-depuracao";
import { d033 } from "./d033-process-nexttick";
import { d034 } from "./d034-o-objeto-global";
import { d035 } from "./d035-frameworks-de-teste";
import { d036 } from "./d036-mocks-stubs-e-spies";
import { d037 } from "./d037-benchmark-e-teste-de-carga";
import { d038 } from "./d038-testar-um-servidor-http";
import { d039 } from "./d039-conectar-ao-mysql";
import { d040 } from "./d040-mongodb-e-bancos-nosql";
import { d041 } from "./d041-o-papel-do-orm";
import { d042 } from "./d042-monitorar-o-desempenho";
import { d043 } from "./d043-clustering";
import { d044 } from "./d044-evitar-vazamentos-de-memoria";
import { d045 } from "./d045-a-flag-inspect";
import { d046 } from "./d046-concorrencia";
import { d047 } from "./d047-process-x-child-process";
import { d048 } from "./d048-worker-threads";
import { d049 } from "./d049-node-js-em-microsservicos";
import { d050 } from "./d050-comunicacao-entre-servicos";
import { d051 } from "./d051-boas-praticas-de-seguranca";
import { d052 } from "./d052-proteger-contra-xss";
import { d053 } from "./d053-variaveis-de-ambiente";
import { d054 } from "./d054-websockets";
import { d055 } from "./d055-montar-um-servidor-websocket";
import { d056 } from "./d056-implantar-em-producao";
import { d057 } from "./d057-pm2";
import { d058 } from "./d058-docker-com-node-js";
import { d059 } from "./d059-versionar-a-api";
import { d060 } from "./d060-versionamento-semantico";
import { d061 } from "./d061-exports-x-module-exports";
import { d062 } from "./d062-servidor-tcp-com-net";
import { d063 } from "./d063-repl";
import { d064 } from "./d064-proxy-reverso";
import { d065 } from "./d065-streams-e-desempenho";
import { d066 } from "./d066-frameworks-populares";
import { d067 } from "./d067-koa-x-express";
import { d068 } from "./d068-nestjs";
import { d069 } from "./d069-typescript-com-node-js";
import { d070 } from "./d070-integrar-com-api-de-terceiros";
import { d071 } from "./d071-socket-io";
import { d072 } from "./d072-graphql-com-node-js";
import { d073 } from "./d073-node-js-e-front-end";
import { d074 } from "./d074-renderizacao-no-servidor-ssr";
import { d075 } from "./d075-convencoes-e-boas-praticas";
import { d076 } from "./d076-twelve-factor-app";
import { d077 } from "./d077-lint-de-codigo";
import { d078 } from "./d078-estrategias-de-escala";
import { d079 } from "./d079-sessoes-em-aplicacao-escalada";
import { d080 } from "./d080-microsservicos-e-escala";
import { d081 } from "./d081-filas-de-mensagens";
import { d082 } from "./d082-rabbitmq-no-node-js";
import { d083 } from "./d083-zeromq";
import { d084 } from "./d084-nuvem-e-node-js";
import { d085 } from "./d085-serverless-e-node-js";
import { d086 } from "./d086-varias-versoes-do-node-js";
import { d087 } from "./d087-arquivos-env";
import { d088 } from "./d088-modulo-config";
import { d089 } from "./d089-ci-cd-para-node-js";
import { d090 } from "./d090-montar-um-pipeline-de-ci-cd";
import { d091 } from "./d091-aplicacao-lenta";
import { d092 } from "./d092-upload-de-arquivos";
import { d093 } from "./d093-computacao-pesada";
import { d094 } from "./d094-node-js-e-devops";
import { d095 } from "./d095-conteinerizacao";
import { d096 } from "./d096-node-js-em-iot";
import { d097 } from "./d097-consideracoes-para-iot";
import { d098 } from "./d098-machine-learning-com-node-js";
import { d099 } from "./d099-bibliotecas-de-ml-para-node-js";
import { d100 } from "./d100-boas-praticas-de-apis-rest";
import { f001 } from "./f001-o-que-e-o-node-js";
import { f002 } from "./f002-por-que-single-thread";
import { f003 } from "./f003-funcao-do-event-loop";
import { f004 } from "./f004-principais-vantagens";
import { f005 } from "./f005-npm";
import { f006 } from "./f006-node-js-x-javascript";
import { f007 } from "./f007-e-s-nao-bloqueante";
import { f008 } from "./f008-o-que-sao-streams";
import { f009 } from "./f009-nexttick-x-setimmediate";
import { f010 } from "./f010-processos-filhos";
import { f011 } from "./f011-repl";
import { f012 } from "./f012-objetos-globais";
import { f013 } from "./f013-funcao-de-callback";
import { f014 } from "./f014-promises";
import { f015 } from "./f015-evitar-callback-hell";
import { f016 } from "./f016-classe-eventemitter";
import { f017 } from "./f017-servidor-simples";
import { f018 } from "./f018-streams-ou-buffers";
import { f019 } from "./f019-finalidade-dos-buffers";
import { f020 } from "./f020-process-env";
import { f021 } from "./f021-middleware-no-express";
import { f022 } from "./f022-tratar-excecoes";
import { f023 } from "./f023-melhorar-o-desempenho";
import { f024 } from "./f024-template-engines";
import { f025 } from "./f025-papel-do-package-json";
import { f026 } from "./f026-modulos-commonjs";
import { f027 } from "./f027-exports-x-module-exports";
import { f028 } from "./f028-fases-do-event-loop";
import { f029 } from "./f029-o-this-nos-modulos";
import { f030 } from "./f030-encadeamento-de-middleware";
import { f031 } from "./f031-node-env";
import { f032 } from "./f032-compartilhar-dados-entre-modulos";
import { f033 } from "./f033-spawn-x-fork";
import { f034 } from "./f034-clustering";
import { f035 } from "./f035-proteger-a-aplicacao";
import { f036 } from "./f036-process-exit-x-process-kill";
import { f037 } from "./f037-vantagens-dos-streams";
import { f038 } from "./f038-cache-de-modulos";
import { f039 } from "./f039-rate-limiting-de-api";
import { f040 } from "./f040-para-que-serve-async-await";
import { f041 } from "./f041-uploads-de-arquivos";
import { f042 } from "./f042-cors";
import { f043 } from "./f043-put-x-patch";
import { f044 } from "./f044-sessoes-no-node-js";
import { f045 } from "./f045-monitorar-em-producao";
import { f046 } from "./f046-o-que-e-o-helmet";
import { f047 } from "./f047-xss-e-prevencao";
import { f048 } from "./f048-erros-assincronos-no-express";
import { f049 } from "./f049-redis-com-node-js";
import { f050 } from "./f050-implantar-o-node-js";
import { f051 } from "./f051-sincrono-x-assincrono";
import { f052 } from "./f052-uso-do-process-nexttick";
import { f053 } from "./f053-worker-threads";
import { f054 } from "./f054-balanceamento-de-carga";
import { f055 } from "./f055-instalacao-global-x-local";
import { f056 } from "./f056-o-modulo-http-2";
import { f057 } from "./f057-erros-em-middleware";
import { f058 } from "./f058-criar-um-eventemitter";
import { f059 } from "./f059-readfile-x-createreadstream";
import { f060 } from "./f060-o-papel-do-libuv";
import { f061 } from "./f061-o-evento-exit-do-processo";
import { f062 } from "./f062-sinais-no-node-js";
import { f063 } from "./f063-processo-zumbi";
import { f064 } from "./f064-server-push-no-http-2";
import { f065 } from "./f065-tls-ssl-e-https";
import { f066 } from "./f066-coleta-de-lixo-gc";
import { f067 } from "./f067-async-hooks";
import { f068 } from "./f068-o-modulo-dns";
import { f069 } from "./f069-o-modulo-cluster";
import { f070 } from "./f070-fork-x-spawn";
import { f071 } from "./f071-sticky-sessions";
import { f072 } from "./f072-depurar-no-node-js";
import { f073 } from "./f073-npm-audit";
import { f074 } from "./f074-dependencias-peer";
import { f075 } from "./f075-dependencias-circulares";
import { f076 } from "./f076-picos-de-trafego";
import { f077 } from "./f077-logs";
import { f078 } from "./f078-proteger-chaves-de-api";
import { f079 } from "./f079-projetar-uma-api-rest";
import { f080 } from "./f080-uploads-seguros";
import { f081 } from "./f081-tarefas-em-segundo-plano";
import { f082 } from "./f082-comunicacao-por-websocket";
import { f083 } from "./f083-projetar-um-servidor-de-chat";
import { f084 } from "./f084-versionamento-de-api";
import { f085 } from "./f085-otimizar-o-desempenho";
import { f086 } from "./f086-principais-recursos";
import { f087 } from "./f087-package-lock-json";
import { f088 } from "./f088-o-modulo-http";
import { f089 } from "./f089-o-modulo-util";
import { f090 } from "./f090-como-o-require-funciona";
import { f091 } from "./f091-rate-limiting";
import { f092 } from "./f092-variaveis-de-ambiente-seguras";
import { f093 } from "./f093-redis-em-um-projeto";
import { f094 } from "./f094-forca-bruta";
import { f095 } from "./f095-tratamento-global-de-erros";
import { f096 } from "./f096-autenticacao-com-jwt";
import { f097 } from "./f097-teste-de-carga";
import { f098 } from "./f098-condicoes-de-corrida";
import { f099 } from "./f099-starvation-do-event-loop";
import { f100 } from "./f100-otimizar-o-uso-de-memoria";
import { c001 } from "./c001-node-js-como-runtime";
import { c002 } from "./c002-papel-do-npm";
import { c003 } from "./c003-modulos-e-reutilizacao";
import { c004 } from "./c004-callbacks-e-assincronia";
import { c005 } from "./c005-a-funcao-require";
import { c006 } from "./c006-event-loop-e-e-s";
import { c007 } from "./c007-o-modulo-fs";
import { c008 } from "./c008-o-modulo-http";
import { c009 } from "./c009-a-ferramenta-npm";
import { c010 } from "./c010-middleware-no-express";
import { c011 } from "./c011-callbacks-na-pratica";
import { c012 } from "./c012-npm-e-seu-significado";
import { c013 } from "./c013-middleware-em-aplicacoes-web";
import { c014 } from "./c014-o-papel-do-event-loop";
import { c015 } from "./c015-promises-e-assincronia";
import { c016 } from "./c016-streams-e-dados-grandes";
import { c017 } from "./c017-finalidade-do-express";
import { c018 } from "./c018-autenticacao-e-autorizacao";
import { c019 } from "./c019-sessoes-e-cookies";
import { c020 } from "./c020-assincronia-e-escalabilidade";
import { c021 } from "./c021-evitar-bloquear-o-event-loop";
import { c022 } from "./c022-o-objeto-module-exports";
import { c023 } from "./c023-middleware-uso-e-exemplo";
import { c024 } from "./c024-streams-leitura-e-escrita";
import { c025 } from "./c025-o-modulo-util-e-promisify";
import { c026 } from "./c026-websocket-com-ws";
import { c027 } from "./c027-try-catch-e-erros-assincronos";
import { c028 } from "./c028-cluster-e-nucleos-de-cpu";
import { c029 } from "./c029-npm-e-dependencias";

/** Todas as perguntas do guia, na ordem de estudo. Gerado por scripts/gerar-indice-de-perguntas.mts. */
export const perguntas: Pergunta[] = [
  q01,
  q02,
  q03,
  q04,
  q05,
  q06,
  q07,
  q08,
  q09,
  q10,
  q11,
  q12,
  q13,
  q14,
  q15,
  q16,
  q17,
  q18,
  q19,
  q20,
  q21,
  q22,
  q23,
  q24,
  q25,
  q26,
  q27,
  q28,
  q29,
  q30,
  q31,
  q32,
  q33,
  q34,
  q35,
  q36,
  q37,
  q38,
  q39,
  q40,
  q41,
  q42,
  q43,
  q44,
  q45,
  q46,
  q47,
  q48,
  q49,
  q50,
  q51,
  q52,
  q53,
  q54,
  q55,
  q56,
  q57,
  q58,
  q59,
  q60,
  q61,
  l001,
  l002,
  l003,
  l004,
  l005,
  l006,
  l007,
  l008,
  l009,
  l010,
  l011,
  l012,
  l013,
  l014,
  l015,
  l016,
  l017,
  l018,
  l019,
  l020,
  l021,
  l022,
  l023,
  l024,
  l025,
  l026,
  l027,
  l028,
  l029,
  l030,
  l031,
  l032,
  l033,
  l034,
  l035,
  l036,
  l037,
  l038,
  l039,
  l040,
  l041,
  l042,
  l043,
  l044,
  l045,
  l046,
  l047,
  l048,
  l049,
  l050,
  l051,
  l052,
  l053,
  l054,
  l055,
  l056,
  l057,
  l058,
  l059,
  l060,
  l061,
  l062,
  l063,
  l064,
  l065,
  l066,
  l067,
  l068,
  l069,
  l070,
  l071,
  l072,
  l073,
  l074,
  l075,
  l076,
  l077,
  l078,
  l079,
  l080,
  l081,
  l082,
  l083,
  l084,
  l085,
  l086,
  l087,
  l088,
  l089,
  l090,
  l091,
  l092,
  l093,
  l094,
  l095,
  l096,
  l097,
  l098,
  l099,
  l100,
  l101,
  l102,
  l103,
  l104,
  l105,
  l106,
  l107,
  l108,
  l109,
  l110,
  l111,
  l112,
  l113,
  l114,
  l115,
  l116,
  l117,
  l118,
  l119,
  l120,
  l121,
  l122,
  l123,
  l124,
  l125,
  l126,
  l127,
  l128,
  l129,
  l130,
  l131,
  l132,
  l133,
  l134,
  l135,
  l136,
  l137,
  l138,
  d001,
  d002,
  d003,
  d004,
  d005,
  d006,
  d007,
  d008,
  d009,
  d010,
  d011,
  d012,
  d013,
  d014,
  d015,
  d016,
  d017,
  d018,
  d019,
  d020,
  d021,
  d022,
  d023,
  d024,
  d025,
  d026,
  d027,
  d028,
  d029,
  d030,
  d031,
  d032,
  d033,
  d034,
  d035,
  d036,
  d037,
  d038,
  d039,
  d040,
  d041,
  d042,
  d043,
  d044,
  d045,
  d046,
  d047,
  d048,
  d049,
  d050,
  d051,
  d052,
  d053,
  d054,
  d055,
  d056,
  d057,
  d058,
  d059,
  d060,
  d061,
  d062,
  d063,
  d064,
  d065,
  d066,
  d067,
  d068,
  d069,
  d070,
  d071,
  d072,
  d073,
  d074,
  d075,
  d076,
  d077,
  d078,
  d079,
  d080,
  d081,
  d082,
  d083,
  d084,
  d085,
  d086,
  d087,
  d088,
  d089,
  d090,
  d091,
  d092,
  d093,
  d094,
  d095,
  d096,
  d097,
  d098,
  d099,
  d100,
  f001,
  f002,
  f003,
  f004,
  f005,
  f006,
  f007,
  f008,
  f009,
  f010,
  f011,
  f012,
  f013,
  f014,
  f015,
  f016,
  f017,
  f018,
  f019,
  f020,
  f021,
  f022,
  f023,
  f024,
  f025,
  f026,
  f027,
  f028,
  f029,
  f030,
  f031,
  f032,
  f033,
  f034,
  f035,
  f036,
  f037,
  f038,
  f039,
  f040,
  f041,
  f042,
  f043,
  f044,
  f045,
  f046,
  f047,
  f048,
  f049,
  f050,
  f051,
  f052,
  f053,
  f054,
  f055,
  f056,
  f057,
  f058,
  f059,
  f060,
  f061,
  f062,
  f063,
  f064,
  f065,
  f066,
  f067,
  f068,
  f069,
  f070,
  f071,
  f072,
  f073,
  f074,
  f075,
  f076,
  f077,
  f078,
  f079,
  f080,
  f081,
  f082,
  f083,
  f084,
  f085,
  f086,
  f087,
  f088,
  f089,
  f090,
  f091,
  f092,
  f093,
  f094,
  f095,
  f096,
  f097,
  f098,
  f099,
  f100,
  c001,
  c002,
  c003,
  c004,
  c005,
  c006,
  c007,
  c008,
  c009,
  c010,
  c011,
  c012,
  c013,
  c014,
  c015,
  c016,
  c017,
  c018,
  c019,
  c020,
  c021,
  c022,
  c023,
  c024,
  c025,
  c026,
  c027,
  c028,
  c029,
];
