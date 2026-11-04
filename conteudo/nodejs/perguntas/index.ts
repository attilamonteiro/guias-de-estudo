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
];
