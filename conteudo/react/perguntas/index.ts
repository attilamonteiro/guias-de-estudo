import type { Pergunta } from "../../tipos";
import { l001 } from "./l001-o-que-e-o-react";
import { l002 } from "./l002-por-que-usar-o-react";
import { l003 } from "./l003-react-biblioteca-ou-framework";
import { l004 } from "./l004-principais-caracteristicas-do-react";
import { l005 } from "./l005-o-que-e-um-componente";
import { l006 } from "./l006-o-que-e-jsx";
import { l007 } from "./l007-por-que-usar-jsx";
import { l008 } from "./l008-como-o-jsx-vira-javascript";
import { l009 } from "./l009-diferencas-entre-jsx-e-html";
import { l010 } from "./l010-o-que-sao-componentes-funcionais";
import { l011 } from "./l011-o-que-sao-componentes-de-classe";
import { l012 } from "./l012-funcional-ou-de-classe";
import { l013 } from "./l013-o-que-sao-props";
import { l014 } from "./l014-o-que-e-state";
import { l015 } from "./l015-props-versus-state";
import { l016 } from "./l016-props-sao-mutaveis";
import { l017 } from "./l017-por-que-nao-mutar-o-state";
import { l018 } from "./l018-fluxo-de-dados-unidirecional";
import { l019 } from "./l019-composicao-de-componentes";
import { l020 } from "./l020-controlado-ou-nao-controlado";
import { l021 } from "./l021-o-que-e-o-virtual-dom";
import { l022 } from "./l022-como-funciona-o-virtual-dom";
import { l023 } from "./l023-o-que-e-reconciliacao";
import { l024 } from "./l024-o-que-e-o-fiber";
import { l025 } from "./l025-o-que-causa-um-re-render";
import { l026 } from "./l026-props-sempre-causam-re-render";
import { l027 } from "./l027-state-sempre-causa-re-render";
import { l028 } from "./l028-o-que-acontece-ao-renderizar";
import { l029 } from "./l029-a-fase-de-commit";
import { l030 } from "./l030-fase-de-render-e-fase-de-commit";
import { l031 } from "./l031-o-que-e-diffing";
import { l032 } from "./l032-como-o-react-decide-atualizar";
import { l033 } from "./l033-por-que-as-keys-importam";
import { l034 } from "./l034-por-que-evitar-indice-como-key";
import { l035 } from "./l035-efeito-de-keys-instaveis";
import { l036 } from "./l036-o-que-e-batching";
import { l037 } from "./l037-o-que-e-batching-automatico";
import { l038 } from "./l038-o-que-mudou-no-batching";
import { l039 } from "./l039-o-que-e-renderizacao-concorrente";
import { l040 } from "./l040-renderizacao-interrompivel";
import { l041 } from "./l041-o-que-sao-hooks";
import { l042 } from "./l042-por-que-surgiram-os-hooks";
import { l043 } from "./l043-o-que-e-usestate";
import { l044 } from "./l044-o-que-e-useeffect";
import { l045 } from "./l045-o-que-e-usecontext";
import { l046 } from "./l046-o-que-e-usereducer";
import { l047 } from "./l047-o-que-e-usememo";
import { l048 } from "./l048-o-que-e-usecallback";
import { l049 } from "./l049-o-que-e-useref";
import { l050 } from "./l050-o-que-e-uselayouteffect";
import { l051 } from "./l051-o-que-e-useimperativehandle";
import { l052 } from "./l052-o-que-e-useid";
import { l053 } from "./l053-o-que-e-usetransition";
import { l054 } from "./l054-o-que-e-usedeferredvalue";
import { l055 } from "./l055-o-que-e-usesyncexternalstore";
import { l056 } from "./l056-o-que-e-useinsertioneffect";
import { l057 } from "./l057-quando-usar-usememo";
import { l058 } from "./l058-quando-usar-usecallback";
import { l059 } from "./l059-quando-evitar-usememo-e-usecallback";
import { l060 } from "./l060-o-que-sao-hooks-personalizados";
import { l061 } from "./l061-as-regras-dos-hooks";
import { l062 } from "./l062-hooks-dentro-de-condicoes";
import { l063 } from "./l063-hooks-dentro-de-lacos";
import { l064 } from "./l064-hooks-em-funcoes-comuns";
import { l065 } from "./l065-efeitos-colaterais-na-renderizacao";
import { l066 } from "./l066-o-array-de-dependencias";
import { l067 } from "./l067-array-de-dependencias-vazio";
import { l068 } from "./l068-sem-array-de-dependencias";
import { l069 } from "./l069-como-funciona-a-limpeza-do-efeito";
import { l070 } from "./l070-evitar-race-conditions-em-efeitos";
import { l071 } from "./l071-cancelar-requisicao-dentro-do-efeito";
import { l072 } from "./l072-o-que-e-um-stale-closure";
import { l073 } from "./l073-como-surgem-os-stale-closures";
import { l074 } from "./l074-como-resolver-stale-closures";
import { l075 } from "./l075-quando-nao-usar-useeffect";
import { l076 } from "./l076-estado-local-ou-global";
import { l077 } from "./l077-quando-o-estado-e-local";
import { l078 } from "./l078-quando-o-estado-e-global";
import { l079 } from "./l079-o-que-e-prop-drilling";
import { l080 } from "./l080-evitar-o-prop-drilling";
import { l081 } from "./l081-o-que-e-context-api";
import { l082 } from "./l082-limites-da-context-api";
import { l083 } from "./l083-context-api-ou-redux";
import { l084 } from "./l084-redux-ou-zustand";
import { l085 } from "./l085-quando-usar-redux";
import { l086 } from "./l086-o-que-e-redux-toolkit";
import { l087 } from "./l087-o-que-e-um-reducer";
import { l088 } from "./l088-o-que-e-uma-action";
import { l089 } from "./l089-middleware-no-redux";
import { l090 } from "./l090-o-que-e-estado-normalizado";
import { l091 } from "./l091-gerenciar-o-estado-do-servidor";
import { l092 } from "./l092-estado-de-cliente-ou-servidor";
import { l093 } from "./l093-o-que-e-tanstack-query";
import { l094 } from "./l094-cache-de-dados-de-api";
import { l095 } from "./l095-evitar-estado-global-desnecessario";
import { l096 } from "./l096-otimizar-uma-aplicacao-react";
import { l097 } from "./l097-achar-re-renders-desnecessarios";
import { l098 } from "./l098-o-que-e-react-memo";
import { l099 } from "./l099-quando-usar-react-memo";
import { l100 } from "./l100-como-funciona-a-memoizacao";
import { l101 } from "./l101-o-que-e-code-splitting";
import { l102 } from "./l102-o-que-e-lazy-loading";
import { l103 } from "./l103-como-o-react-lazy-funciona";
import { l104 } from "./l104-o-que-e-suspense";
import { l105 } from "./l105-como-o-suspense-funciona";
import { l106 } from "./l106-dividir-o-bundle-em-partes";
import { l107 } from "./l107-reduzir-um-bundle-javascript-grande";
import { l108 } from "./l108-otimizar-imagens-no-react";
import { l109 } from "./l109-otimizar-listas-grandes";
import { l110 } from "./l110-o-que-e-virtualizacao";
import { l111 } from "./l111-renderizar-100-mil-linhas";
import { l112 } from "./l112-otimizar-calculos-caros";
import { l113 } from "./l113-reduzir-requisicoes-desnecessarias-a-api";
import { l114 } from "./l114-perfilar-uma-aplicacao-react";
import { l115 } from "./l115-depurar-uma-pagina-react-lenta";
import { l116 } from "./l116-o-que-e-react-compiler";
import { l117 } from "./l117-como-o-compiler-otimiza";
import { l118 } from "./l118-o-que-e-memoizacao-automatica";
import { l119 } from "./l119-compiler-substitui-o-usememo";
import { l120 } from "./l120-compiler-substitui-o-usecallback";
import { l121 } from "./l121-compiler-substitui-o-react-memo";
import { l122 } from "./l122-ativar-o-react-compiler";
import { l123 } from "./l123-beneficios-do-react-compiler";
import { l124 } from "./l124-limitacoes-do-react-compiler";
import { l125 } from "./l125-adotar-o-compiler-aos-poucos";
import { l126 } from "./l126-o-que-sao-as-actions";
import { l127 } from "./l127-o-que-e-useactionstate";
import { l128 } from "./l128-o-que-e-useoptimistic";
import { l129 } from "./l129-o-que-e-useformstatus";
import { l130 } from "./l130-o-componente-activity";
import { l131 } from "./l131-o-que-e-useeffectevent";
import { l132 } from "./l132-o-que-e-cachesignal";
import { l133 } from "./l133-pre-renderizacao-parcial";
import { l134 } from "./l134-o-que-sao-server-components";
import { l135 } from "./l135-server-components-ou-client-components";
import { l136 } from "./l136-o-que-sao-server-functions";
import { l137 } from "./l137-o-que-use-server-faz";
import { l138 } from "./l138-o-que-use-client-faz";
import { l139 } from "./l139-progressive-enhancement-em-formularios";
import { l140 } from "./l140-acoes-assincronas-em-formularios";
import { l141 } from "./l141-entendendo-os-server-components";
import { l142 } from "./l142-server-components-e-ssr";
import { l143 } from "./l143-servidor-e-cliente-as-diferencas";
import { l144 } from "./l144-server-component-com-usestate";
import { l145 } from "./l145-apis-do-navegador-no-servidor";
import { l146 } from "./l146-client-falando-com-server-components";
import { l147 } from "./l147-para-que-serve-use-client";
import { l148 } from "./l148-para-que-serve-use-server";
import { l149 } from "./l149-o-que-sao-server-functions";
import { l150 } from "./l150-dados-entre-servidor-e-cliente";
import { l151 } from "./l151-beneficios-dos-server-components";
import { l152 } from "./l152-limitacoes-dos-server-components";
import { l153 } from "./l153-menos-javascript-no-cliente";
import { l154 } from "./l154-servidor-ou-cliente-como-decidir";
import { l155 } from "./l155-formularios-controlados-ou-nao";
import { l156 } from "./l156-como-validar-formularios";
import { l157 } from "./l157-envio-assincrono-de-formularios";
import { l158 } from "./l158-estados-de-carregamento";
import { l159 } from "./l159-tratar-erros-de-formulario";
import { l160 } from "./l160-o-que-sao-react-actions";
import { l161 } from "./l161-o-que-e-useactionstate";
import { l162 } from "./l162-o-que-e-useformstatus";
import { l163 } from "./l163-implementar-ui-otimista";
import { l164 } from "./l164-o-que-e-useoptimistic";
import { l165 } from "./l165-cancelar-requisicoes-de-api";
import { l166 } from "./l166-condicoes-de-corrida-em-apis";
import { l167 } from "./l167-cache-de-respostas-de-api";
import { l168 } from "./l168-como-lidar-com-paginacao";
import { l169 } from "./l169-implementar-scroll-infinito";
import { l170 } from "./l170-estado-de-autenticacao";
import { l171 } from "./l171-roteamento-no-lado-do-cliente";
import { l172 } from "./l172-como-o-react-router-funciona";
import { l173 } from "./l173-o-que-sao-rotas-aninhadas";
import { l174 } from "./l174-o-que-sao-rotas-protegidas";
import { l175 } from "./l175-autorizacao-baseada-em-rotas";
import { l176 } from "./l176-rotas-carregadas-sob-demanda";
import { l177 } from "./l177-divisao-de-codigo-por-rota";
import { l178 } from "./l178-estruturar-um-app-react-grande";
import { l179 } from "./l179-pastas-por-funcionalidade-ou-camada";
import { l180 } from "./l180-compartilhar-componentes-reutilizaveis";
import { l181 } from "./l181-projetar-uma-biblioteca-de-componentes";
import { l182 } from "./l182-configuracao-por-ambiente";
import { l183 } from "./l183-gerenciar-clientes-de-api";
import { l184 } from "./l184-organizar-hooks-reutilizaveis";
import { l185 } from "./l185-evitar-componentes-muito-acoplados";
import { l186 } from "./l186-o-que-e-teste-unitario";
import { l187 } from "./l187-o-que-e-teste-de-integracao";
import { l188 } from "./l188-teste-de-ponta-a-ponta";
import { l189 } from "./l189-react-testing-library-explicada";
import { l190 } from "./l190-testing-library-ou-enzyme";
import { l191 } from "./l191-como-testar-um-componente";
import { l192 } from "./l192-testar-interacoes-do-usuario";
import { l193 } from "./l193-testar-chamadas-assincronas-de-api";
import { l194 } from "./l194-simular-requisicoes-de-api";
import { l195 } from "./l195-testar-hooks-customizados";
import { l196 } from "./l196-testar-formularios";
import { l197 } from "./l197-testar-estados-de-erro";
import { l198 } from "./l198-testar-estados-de-carregamento";
import { l199 } from "./l199-o-que-evitar-testar";
import { l200 } from "./l200-prevenir-xss-no-react";
import { l201 } from "./l201-o-react-protege-contra-xss";
import { l202 } from "./l202-o-que-e-dangerouslysetinnerhtml";
import { l203 } from "./l203-evitar-dangerouslysetinnerhtml";
import { l204 } from "./l204-html-da-api-com-seguranca";
import { l205 } from "./l205-proteger-tokens-de-autenticacao";
import { l206 } from "./l206-autorizacao-no-frontend";
import { l207 } from "./l207-o-que-e-csrf";
import { l208 } from "./l208-protecao-contra-csrf";
import { l209 } from "./l209-o-que-e-content-security-policy";
import { l210 } from "./l210-aplicacoes-react-acessiveis";
import { l211 } from "./l211-o-que-e-html-semantico";
import { l212 } from "./l212-o-que-e-aria";
import { l213 } from "./l213-componentes-acessiveis-por-teclado";
import { l214 } from "./l214-testar-acessibilidade";
import { l215 } from "./l215-app-react-extremamente-lento";
import { l216 } from "./l216-componente-renderiza-50-vezes";
import { l217 } from "./l217-tabela-com-100-mil-linhas";
import { l218 } from "./l218-bundle-de-5-mb";
import { l219 } from "./l219-api-devolve-dados-desatualizados";
import { l220 } from "./l220-useeffect-gigante-com-varias-chamadas";
import { l221 } from "./l221-200-componentes-no-mesmo-context";
import { g001 } from "./g001-vantagens-do-react-sobre-js-puro";
import { g002 } from "./g002-funcao-ou-classe-quando-usar";
import { g003 } from "./g003-padrao-de-engenharia-especifico-do-react";
import { g004 } from "./g004-react-versus-angular-e-vue";
import { g005 } from "./g005-eventos-sinteticos-do-react";
import { g006 } from "./g006-o-que-e-o-virtual-dom";
import { g007 } from "./g007-componentes-de-ordem-superior-hocs";
import { g008 } from "./g008-diferenca-entre-classe-e-funcao";
import { g009 } from "./g009-o-que-falta-nos-componentes-de-funcao";
import { g010 } from "./g010-gerenciamento-de-estado-no-react";
import { g011 } from "./g011-acessibilidade-em-aplicacoes-react";
import { g012 } from "./g012-props-state-e-componentes-com-estado";
import { g013 } from "./g013-prop-drilling-em-componentes-aninhados";
import { g014 } from "./g014-explicar-cada-hook";
import { g015 } from "./g015-criar-e-usar-um-hook-customizado";
import { g016 } from "./g016-monolito-versus-micro-frontends";
import { g017 } from "./g017-desafios-com-redux";
import { g018 } from "./g018-aplicacao-react-facil-de-manter";
import { g019 } from "./g019-reuso-versus-complexidade";
import { g020 } from "./g020-usestate-ou-usereducer";
import { g021 } from "./g021-o-que-sao-keys";
import { g022 } from "./g022-usememo-e-usecallback";
import { g023 } from "./g023-ferramentas-para-depurar-react";
import { g024 } from "./g024-melhorar-a-performance-do-app-react";
import { g025 } from "./g025-react-versus-next-js";
import { g026 } from "./g026-ciclo-de-vida-do-react";
import { g027 } from "./g027-por-que-surgiram-componentes-de-funcao";
import { g028 } from "./g028-lidar-com-varios-re-renders";
import { g029 } from "./g029-problemas-em-producao-com-testes-passando";
import { g030 } from "./g030-sessao-de-usuario-que-nunca-expira";
import { g031 } from "./g031-diferenca-entre-e";
import { g032 } from "./g032-call-stack-e-event-loop";
import { g033 } from "./g033-o-que-sao-closures";
import { g034 } from "./g034-armadilhas-da-palavra-chave-this";
import { g035 } from "./g035-o-que-e-hoisting";
import { g036 } from "./g036-promises-versus-callbacks";
import { g037 } from "./g037-digitar-uma-url-e-apertar-enter";
import { g038 } from "./g038-contador-regressivo-animado";
import { g039 } from "./g039-temporizador-com-pausar-e-retomar";
import { g040 } from "./g040-semaforo-em-react";
import { g041 } from "./g041-lista-de-tarefas-em-react";
import { g042 } from "./g042-verificador-de-forca-de-senha";
import { g043 } from "./g043-hook-que-busca-dados-de-api";
import { g044 } from "./g044-debounce-na-caixa-de-busca";
import { p001 } from "./p001-definicao-do-react";
import { p002 } from "./p002-principais-recursos-do-react";
import { p003 } from "./p003-o-que-e-jsx";
import { p004 } from "./p004-elemento-versus-componente";
import { p005 } from "./p005-criar-um-componente-em-react";
import { p006 } from "./p006-escolher-entre-classe-e-funcao";
import { p007 } from "./p007-o-que-sao-componentes-puros";
import { p008 } from "./p008-component-versus-purecomponent";
import { p009 } from "./p009-quando-usar-purecomponent";
import { p010 } from "./p010-o-que-e-estado-em-react";
import { p011 } from "./p011-o-que-sao-props";
import { p012 } from "./p012-diferenca-entre-estado-e-props";
import { p013 } from "./p013-por-que-nao-atualizar-o-estado-diretamente";
import { p014 } from "./p014-callback-do-setstate";
import { p015 } from "./p015-eventos-em-html-versus-react";
import { p016 } from "./p016-vincular-event-handlers-em-jsx";
import { p017 } from "./p017-passar-parametro-a-um-handler";
import { p018 } from "./p018-definicao-de-evento-sintetico";
import { c001 } from "./c001-definicao-do-react";
import { c002 } from "./c002-o-que-e-jsx";
import { c003 } from "./c003-componente-ou-elemento";
import { c004 } from "./c004-props-versus-estado";
import { c005 } from "./c005-dois-setcount-no-mesmo-clique";
import { c006 } from "./c006-keys-em-listas-e-indice";
import { c007 } from "./c007-input-controlado";
import { c008 } from "./c008-elevar-o-estado";
import { c009 } from "./c009-regras-dos-hooks";
import { c010 } from "./c010-o-que-e-um-fragment";
import { c011 } from "./c011-funcionamento-das-dependencias";
import { c012 } from "./c012-quando-a-limpeza-executa";
import { c013 } from "./c013-estado-desatualizado-no-setinterval";
import { c014 } from "./c014-o-que-e-batching";
import { c015 } from "./c015-efeitos-em-pai-e-filho";
import { c016 } from "./c016-usememo-ou-usecallback";
import { c017 } from "./c017-react-memo-e-usecallback";
import { c018 } from "./c018-context-e-seu-custo";
import { c019 } from "./c019-refs-versus-estado";
import { c020 } from "./c020-virtual-dom-e-reconciliacao";
import { c021 } from "./c021-hook-personalizado";
import { c022 } from "./c022-o-que-o-strictmode-faz";
import { c023 } from "./c023-ordem-de-render-e-efeitos";
import { c024 } from "./c024-o-que-e-error-boundary";
import { c025 } from "./c025-o-que-e-um-portal";
import { c026 } from "./c026-suspense-e-lazy";
import { c027 } from "./c027-o-que-o-usetransition-faz";
import { c028 } from "./c028-o-que-sao-server-components";
import { c029 } from "./c029-novidades-do-react-19";
import { c030 } from "./c030-testando-componentes-react";
import { c031 } from "./c031-achar-e-corrigir-lentidao";
import { c032 } from "./c032-pureza-de-componentes";
import { c033 } from "./c033-quando-evitar-um-efeito";
import { s001 } from "./s001-o-que-e-o-reactjs";
import { s002 } from "./s002-por-que-usar-o-reactjs";
import { s003 } from "./s003-como-o-reactjs-funciona";
import { s004 } from "./s004-recursos-do-reactjs";
import { s005 } from "./s005-o-que-e-jsx";
import { s006 } from "./s006-vantagens-do-reactjs";
import { s007 } from "./s007-criando-componentes-no-reactjs";
import { s008 } from "./s008-listas-no-react";
import { s009 } from "./s009-por-que-listas-precisam-de-keys";
import { s010 } from "./s010-comentarios-no-react";
import { s011 } from "./s011-o-que-sao-componentes";
import { s012 } from "./s012-uso-do-render";
import { s013 } from "./s013-juntar-dois-ou-mais-componentes";
import { s014 } from "./s014-classe-versus-funcional";
import { s015 } from "./s015-fragments-do-react";
import { s016 } from "./s016-formularios-no-reactjs";
import { s017 } from "./s017-criando-formularios-no-react";
import { s018 } from "./s018-o-que-e-state";
import { s019 } from "./s019-implementando-state";
import { s020 } from "./s020-atualizando-o-state";
import { s021 } from "./s021-o-que-sao-props";
import { s022 } from "./s022-passando-props-entre-componentes";
import { s023 } from "./s023-state-versus-props";
import { s024 } from "./s024-elevacao-de-state";
import { s025 } from "./s025-eventos-sinteticos";
import { s026 } from "./s026-arrow-functions-no-react";
import { s027 } from "./s027-evitando-o-bind";
import { s028 } from "./s028-significado-dos-tres-pontos";
import { s029 } from "./s029-dom-real-versus-virtual";
import { s030 } from "./s030-trade-offs-de-usar-o-react";
import { s031 } from "./s031-controlado-versus-nao-controlado";
import { s032 } from "./s032-efeitos-colaterais-do-componente";
import { s033 } from "./s033-etapas-do-ciclo-de-vida";
import { s034 } from "./s034-o-que-sao-error-boundaries";
import { s035 } from "./s035-metodos-da-fase-de-atualizacao";
import { s036 } from "./s036-o-que-e-o-strict-mode";
import { s037 } from "./s037-definindo-custom-hooks";
import { s038 } from "./s038-o-que-sao-hooks";
import { s039 } from "./s039-regras-dos-hooks";
import { s040 } from "./s040-como-o-usestate-funciona";
import { s041 } from "./s041-o-que-e-useeffect";
import { s042 } from "./s042-memoizacao-no-react";
import { s043 } from "./s043-evitando-o-prop-drilling";
import { s044 } from "./s044-quando-usar-usememo";
import { s045 } from "./s045-tipos-de-hooks";
import { s046 } from "./s046-componente-de-ordem-superior";
import { s047 } from "./s047-funcoes-dos-hocs";
import { s048 } from "./s048-o-que-e-um-dispatcher";
import { s049 } from "./s049-componentes-do-react-router";
import { s050 } from "./s050-o-que-e-redux";
import { s051 } from "./s051-componentes-do-redux";
import { s052 } from "./s052-o-que-e-flux";
import { s053 } from "./s053-redux-versus-flux";
import { s054 } from "./s054-context-api-versus-redux";
import { s055 } from "./s055-react-versus-react-native";
import { s056 } from "./s056-react-versus-angular";
import { s057 } from "./s057-entendendo-o-react-fiber";
import { s058 } from "./s058-estruturar-um-app-react-grande";
import { s059 } from "./s059-ssr-csr-e-rsc";
import { s060 } from "./s060-implementar-lazy-loading";
import { s061 } from "./s061-gargalos-de-desempenho-comuns";
import { s062 } from "./s062-atualizacoes-otimistas-de-ui";
import { s063 } from "./s063-server-e-client-components";
import { s064 } from "./s064-renderizacao-concorrente";
import { s065 } from "./s065-usos-do-usedeferredvalue";
import { s066 } from "./s066-como-o-suspense-funciona";
import { s067 } from "./s067-usememo-versus-usecallback";
import { s068 } from "./s068-batching-automatico-e-desempenho";
import { s069 } from "./s069-para-que-servem-os-portals";
import { s070 } from "./s070-mudancas-do-react-19";
import { s071 } from "./s071-actions-do-react-19";
import { s072 } from "./s072-quando-usar-useoptimistic";
import { s073 } from "./s073-api-use-versus-usecontext";
import { s074 } from "./s074-compiler-e-memoizacao-manual";
import { s075 } from "./s075-o-componente-activity";
import { s076 } from "./s076-useeffectevent-ou-useeffect";
import { s077 } from "./s077-o-que-e-zustand";
import { s078 } from "./s078-zustand-versus-context-e-redux";
import { s079 } from "./s079-quando-escolher-o-zustand";
import { s080 } from "./s080-o-que-e-renderizacao";
import { s081 } from "./s081-o-que-e-reconciliacao";
import { s082 } from "./s082-importancia-das-keys";
import { s083 } from "./s083-react-versus-next-js";
import { s084 } from "./s084-quando-usar-o-next-js";
import { s085 } from "./s085-jest-em-testes-de-react";
import { s086 } from "./s086-por-que-usar-a-testing-library";
import { s087 } from "./s087-testes-e-qualidade-do-app";
import { s088 } from "./s088-typescript-com-react";
import { s089 } from "./s089-typescript-nos-componentes";
import { s090 } from "./s090-typescript-com-hooks";
import { s091 } from "./s091-protecao-contra-xss";
import { s092 } from "./s092-o-risco-do-dangerouslysetinnerhtml";
import { s093 } from "./s093-boas-praticas-de-seguranca";
import { s094 } from "./s094-projetar-um-front-end-grande";
import { s095 } from "./s095-desempenho-em-app-grande";
import { s096 } from "./s096-escolher-gerenciamento-de-estado";
import { s097 } from "./s097-por-que-o-react-segue-popular";
import { m001 } from "./m001-react-e-seu-proposito";
import { m002 } from "./m002-componentes-no-react";
import { m003 } from "./m003-sintaxe-jsx";
import { m004 } from "./m004-o-que-e-o-virtual-dom";
import { m005 } from "./m005-estado-e-props-comparados";
import { m006 } from "./m006-funcao-versus-classe";
import { m007 } from "./m007-o-que-e-um-hoc";
import { m008 } from "./m008-o-hook-usestate";
import { m009 } from "./m009-o-hook-useeffect";
import { m010 } from "./m010-papel-do-array-de-dependencias";
import { m011 } from "./m011-componentes-controlados";
import { m012 } from "./m012-componentes-nao-controlados";
import { m013 } from "./m013-o-hook-usecontext";
import { m014 } from "./m014-context-no-react";
import { m015 } from "./m015-o-hook-useref";
import { m016 } from "./m016-reconciliacao-no-react";
import { m017 } from "./m017-portais-do-react";
import { m018 } from "./m018-fragments-do-react";
import { m019 } from "./m019-usecallback-e-usememo-comparados";
import { m020 } from "./m020-explicando-o-suspense";
import { m021 } from "./m021-funcionamento-de-error-boundaries";
import { m022 } from "./m022-componentes-lazy";
import { m023 } from "./m023-como-funciona-code-splitting";
import { m024 } from "./m024-para-que-serve-o-memo";
import { m025 } from "./m025-o-hook-usereducer";
import { m026 } from "./m026-prop-drilling-e-como-evitar";
import { m027 } from "./m027-o-que-e-purecomponent";
import { m028 } from "./m028-o-que-sao-hooks";
import { m029 } from "./m029-eventos-sinteticos";
import { m030 } from "./m030-modo-concorrente-do-react";
import { m031 } from "./m031-para-que-serve-getderivedstatefromprops";
import { m032 } from "./m032-otimizar-performance-no-react";
import { m033 } from "./m033-importancia-das-keys";
import { m034 } from "./m034-o-hook-useimperativehandle";
import { m035 } from "./m035-o-metodo-shouldcomponentupdate";
import { m036 } from "./m036-o-que-e-redux";
import { m037 } from "./m037-uselayouteffect-ou-useeffect";
import { m038 } from "./m038-como-o-usememo-funciona";
import { m039 } from "./m039-didmount-versus-didupdate";
import { m040 } from "./m040-tratando-efeitos-colaterais";
import { m041 } from "./m041-o-que-e-tree-shaking";
import { m042 } from "./m042-regras-dos-hooks-no-react";
import { m043 } from "./m043-a-api-react-children";
import { m044 } from "./m044-formularios-no-react";
import { m045 } from "./m045-o-que-sao-proptypes";
import { m046 } from "./m046-renderizacao-cliente-versus-servidor";
import { m047 } from "./m047-para-que-serve-forwardref";
import { m048 } from "./m048-o-que-sao-render-props";

/** Todas as perguntas do guia, na ordem de estudo. Gerado por scripts/gerar-indice-de-perguntas.mts. */
export const perguntas: Pergunta[] = [
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
  l139,
  l140,
  l141,
  l142,
  l143,
  l144,
  l145,
  l146,
  l147,
  l148,
  l149,
  l150,
  l151,
  l152,
  l153,
  l154,
  l155,
  l156,
  l157,
  l158,
  l159,
  l160,
  l161,
  l162,
  l163,
  l164,
  l165,
  l166,
  l167,
  l168,
  l169,
  l170,
  l171,
  l172,
  l173,
  l174,
  l175,
  l176,
  l177,
  l178,
  l179,
  l180,
  l181,
  l182,
  l183,
  l184,
  l185,
  l186,
  l187,
  l188,
  l189,
  l190,
  l191,
  l192,
  l193,
  l194,
  l195,
  l196,
  l197,
  l198,
  l199,
  l200,
  l201,
  l202,
  l203,
  l204,
  l205,
  l206,
  l207,
  l208,
  l209,
  l210,
  l211,
  l212,
  l213,
  l214,
  l215,
  l216,
  l217,
  l218,
  l219,
  l220,
  l221,
  g001,
  g002,
  g003,
  g004,
  g005,
  g006,
  g007,
  g008,
  g009,
  g010,
  g011,
  g012,
  g013,
  g014,
  g015,
  g016,
  g017,
  g018,
  g019,
  g020,
  g021,
  g022,
  g023,
  g024,
  g025,
  g026,
  g027,
  g028,
  g029,
  g030,
  g031,
  g032,
  g033,
  g034,
  g035,
  g036,
  g037,
  g038,
  g039,
  g040,
  g041,
  g042,
  g043,
  g044,
  p001,
  p002,
  p003,
  p004,
  p005,
  p006,
  p007,
  p008,
  p009,
  p010,
  p011,
  p012,
  p013,
  p014,
  p015,
  p016,
  p017,
  p018,
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
  c030,
  c031,
  c032,
  c033,
  s001,
  s002,
  s003,
  s004,
  s005,
  s006,
  s007,
  s008,
  s009,
  s010,
  s011,
  s012,
  s013,
  s014,
  s015,
  s016,
  s017,
  s018,
  s019,
  s020,
  s021,
  s022,
  s023,
  s024,
  s025,
  s026,
  s027,
  s028,
  s029,
  s030,
  s031,
  s032,
  s033,
  s034,
  s035,
  s036,
  s037,
  s038,
  s039,
  s040,
  s041,
  s042,
  s043,
  s044,
  s045,
  s046,
  s047,
  s048,
  s049,
  s050,
  s051,
  s052,
  s053,
  s054,
  s055,
  s056,
  s057,
  s058,
  s059,
  s060,
  s061,
  s062,
  s063,
  s064,
  s065,
  s066,
  s067,
  s068,
  s069,
  s070,
  s071,
  s072,
  s073,
  s074,
  s075,
  s076,
  s077,
  s078,
  s079,
  s080,
  s081,
  s082,
  s083,
  s084,
  s085,
  s086,
  s087,
  s088,
  s089,
  s090,
  s091,
  s092,
  s093,
  s094,
  s095,
  s096,
  s097,
  m001,
  m002,
  m003,
  m004,
  m005,
  m006,
  m007,
  m008,
  m009,
  m010,
  m011,
  m012,
  m013,
  m014,
  m015,
  m016,
  m017,
  m018,
  m019,
  m020,
  m021,
  m022,
  m023,
  m024,
  m025,
  m026,
  m027,
  m028,
  m029,
  m030,
  m031,
  m032,
  m033,
  m034,
  m035,
  m036,
  m037,
  m038,
  m039,
  m040,
  m041,
  m042,
  m043,
  m044,
  m045,
  m046,
  m047,
  m048,
];
