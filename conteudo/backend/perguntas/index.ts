import type { Pergunta } from "../../tipos";
import { q01 } from "./q01-monolito-vs-microservicos";
import { q02 } from "./q02-sincrono-vs-assincrono";
import { q03 } from "./q03-rest-vs-graphql";
import { q04 } from "./q04-orientada-a-eventos";
import { q05 } from "./q05-trabalhos-em-segundo-plano";
import { q06 } from "./q06-sql-vs-nosql";
import { q07 } from "./q07-indexacao-e-desempenho";
import { q08 } from "./q08-propriedades-acid";
import { q09 } from "./q09-evitar-deadlocks";
import { q10 } from "./q10-replicacao-de-banco";
import { q11 } from "./q11-como-funciona-o-cache";
import { q12 } from "./q12-redis-vs-memcached";
import { q13 } from "./q13-otimizar-consultas";
import { q14 } from "./q14-limitacao-de-taxa";
import { q15 } from "./q15-milhoes-de-requisicoes-por-segundo";
import { q16 } from "./q16-oauth-jwt-e-sessoes";
import { q17 } from "./q17-injecao-de-sql";
import { q18 } from "./q18-cors";
import { q19 } from "./q19-vulnerabilidades-comuns";
import { q20 } from "./q20-armazenar-senhas";
import { q21 } from "./q21-encurtador-de-urls";
import { q22 } from "./q22-sistema-de-fila-de-mensagens";
import { q23 } from "./q23-balanceamento-de-carga";
import { q24 } from "./q24-armazenamento-distribuido-de-arquivos";
import { q25 } from "./q25-consistencia-eventual-vs-forte";
import { q26 } from "./q26-unitario-integracao-e-e2e";
import { q27 } from "./q27-depurar-vazamento-de-memoria";
import { q28 } from "./q28-logging-e-monitoramento";
import { q29 } from "./q29-transacoes-falhas-em-sistemas-distribuidos";
import { q30 } from "./q30-idempotencia-em-apis";
import { r01 } from "./r01-o-que-e-um-endpoint-de-api";
import { r02 } from "./r02-diferenca-entre-sql-e-nosql";
import { r03 } from "./r03-api-restful-e-seus-principios";
import { r04 } from "./r04-ciclo-requisicao-resposta-http";
import { r05 } from "./r05-upload-de-arquivos";
import { r06 } from "./r06-testes-para-um-novo-endpoint";
import { r07 } from "./r07-gerenciamento-de-sessao";
import { r08 } from "./r08-versionamento-de-api";
import { r09 } from "./r09-proteger-contra-injecao-sql";
import { r10 } from "./r10-statelessness-do-http";
import { r11 } from "./r11-containerizacao";
import { r12 } from "./r12-proteger-uma-api-nova";
import { r13 } from "./r13-escalar-num-pico-de-trafego";
import { r14 } from "./r14-depurar-um-backend";
import { r15 } from "./r15-codigo-manutenivel";
import { r16 } from "./r16-busca-full-text";
import { r17 } from "./r17-processamento-em-lote";
import { r18 } from "./r18-beneficios-da-fila-de-mensagens";
import { r19 } from "./r19-conexoes-de-banco-sob-alta-carga";
import { r20 } from "./r20-pipeline-de-ci-cd";
import { r21 } from "./r21-cache-distribuido";
import { r22 } from "./r22-tarefas-em-segundo-plano";
import { r23 } from "./r23-criptografia-em-transito-e-em-repouso";
import { r24 } from "./r24-webhooks";
import { r25 } from "./r25-gdpr-no-backend";
import { r26 } from "./r26-processos-longos-em-requisicoes-web";
import { r27 } from "./r27-rate-limiting-para-proteger-apis";
import { r28 } from "./r28-instrumentar-e-monitorar-desempenho";
import { r29 } from "./r29-decompor-um-monolito";
import { r30 } from "./r30-dependencias-de-api";
import { r31 } from "./r31-consistencia-eventual-e-suas-implicacoes";
import { r32 } from "./r32-reverse-proxy";
import { r33 } from "./r33-estado-de-sessao-com-balanceador";
import { r34 } from "./r34-replicacao-e-tolerancia-a-falhas";
import { r35 } from "./r35-deploy-blue-green";
import { r36 } from "./r36-modelos-de-consistencia-e-cap";
import { r37 } from "./r37-migracoes-de-esquema-em-cd";
import { r38 } from "./r38-idempotencia-em-apis-rest";
import { r39 } from "./r39-single-sign-on-sso";
import { r40 } from "./r40-fluxos-de-dados-de-iot";
import { r41 } from "./r41-sincronizacao-em-tempo-real";
import { r42 } from "./r42-pros-e-contras-dos-microsservicos";
import { r43 } from "./r43-teste-de-carga-de-uma-api";
import { r44 } from "./r44-eviccao-de-cache-no-servidor";
import { r45 } from "./r45-correlation-ids";
import { r46 } from "./r46-lock-otimista-vs-pessimista";
import { r47 } from "./r47-prevenir-deadlocks-em-transacoes";
import { r48 } from "./r48-seguranca-entre-microsservicos";
import { r49 } from "./r49-anomalias-de-dados-em-larga-escala";
import { r50 } from "./r50-armazenamento-global-e-altamente-disponivel";
import { m01 } from "./m01-linguagens-de-programacao";
import { m02 } from "./m02-banco-relacional";
import { m03 } from "./m03-integridade-de-dados";
import { m04 } from "./m04-resolucao-de-problemas";
import { m05 } from "./m05-o-que-e-uma-api";
import { m06 } from "./m06-principios-do-rest";
import { m07 } from "./m07-programacao-orientada-a-objetos";
import { m08 } from "./m08-o-que-voce-gosta-no-backend";
import { m09 } from "./m09-consulta-cara-vs-barata";
import { m10 } from "./m10-normalizacao-e-desnormalizacao";
import { m11 } from "./m11-ja-implementou-cache";
import { m12 } from "./m12-multithreading";
import { m13 } from "./m13-proteger-dados-em-transito";
import { m14 } from "./m14-sql-vs-nosql";
import { m15 } from "./m15-arquitetura-mvc";
import { m16 } from "./m16-vazamento-de-memoria";
import { m17 } from "./m17-disco-cheio";
import { m18 } from "./m18-tratamento-de-erros";
import { m19 } from "./m19-indexacao-de-banco";
import { m20 } from "./m20-condicao-de-corrida";
import { m21 } from "./m21-propriedades-acid";
import { m22 } from "./m22-teste-de-carga";
import { m23 } from "./m23-monolito-vs-microsservicos";
import { m24 } from "./m24-plataformas-de-nuvem";
import { m25 } from "./m25-experiencia-com-docker";
import { m26 } from "./m26-git-no-dia-a-dia";
import { m27 } from "./m27-serverless";
import { m28 } from "./m28-requisicoes-de-rede-que-falham";
import { m29 } from "./m29-escalar-uma-aplicacao";
import { m30 } from "./m30-codigo-limpo-e-manutenivel";
import { m31 } from "./m31-alta-vazao-de-transacoes";
import { m32 } from "./m32-padroes-de-projeto";
import { m33 } from "./m33-diagnosticar-desempenho";
import { m34 } from "./m34-backend-em-tempo-real";
import { m35 } from "./m35-criptografia-de-dados";
import { m36 } from "./m36-coleta-de-lixo";
import { m37 } from "./m37-autenticacao-segura";
import { m38 } from "./m38-tabela-hash-distribuida";
import { m39 } from "./m39-graphql-e-containers";
import { m40 } from "./m40-monitorar-em-producao";

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
  r01,
  r02,
  r03,
  r04,
  r05,
  r06,
  r07,
  r08,
  r09,
  r10,
  r11,
  r12,
  r13,
  r14,
  r15,
  r16,
  r17,
  r18,
  r19,
  r20,
  r21,
  r22,
  r23,
  r24,
  r25,
  r26,
  r27,
  r28,
  r29,
  r30,
  r31,
  r32,
  r33,
  r34,
  r35,
  r36,
  r37,
  r38,
  r39,
  r40,
  r41,
  r42,
  r43,
  r44,
  r45,
  r46,
  r47,
  r48,
  r49,
  r50,
  m01,
  m02,
  m03,
  m04,
  m05,
  m06,
  m07,
  m08,
  m09,
  m10,
  m11,
  m12,
  m13,
  m14,
  m15,
  m16,
  m17,
  m18,
  m19,
  m20,
  m21,
  m22,
  m23,
  m24,
  m25,
  m26,
  m27,
  m28,
  m29,
  m30,
  m31,
  m32,
  m33,
  m34,
  m35,
  m36,
  m37,
  m38,
  m39,
  m40,
];
