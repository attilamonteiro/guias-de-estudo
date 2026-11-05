import type { Pergunta } from "../../tipos";
import { q001 } from "./q001-autenticacao-autorizacao";
import { q002 } from "./q002-identidade-credencial-e-principal";
import { q003 } from "./q003-por-que-o-iam-importa";
import { q004 } from "./q004-componentes-de-uma-plataforma-de-iam";
import { q005 } from "./q005-cia-risco-e-defesa-em-profundidade";
import { q006 } from "./q006-login-por-senha-do-zero";
import { q007 } from "./q007-idp-sp-e-rp";
import { q008 } from "./q008-como-funciona-o-sso";
import { q009 } from "./q009-identidade-federada";
import { q010 } from "./q010-diretorios-e-idp-em-nuvem";
import { q011 } from "./q011-scim-e-provisionamento";
import { q012 } from "./q012-ciclo-de-vida-joiner-mover-leaver";
import { q013 } from "./q013-desligamento-e-revogacao-de-acesso";
import { q014 } from "./q014-workload-identity";
import { q015 } from "./q015-contas-de-servico-excessivas";
import { q016 } from "./q016-segredos-identidade-gerenciada";
import { q017 } from "./q017-app-registration-e-service-principal";
import { q018 } from "./q018-identidade-em-saas-multi-tenant";
import { q019 } from "./q019-iam-e-conformidade";
import { q020 } from "./q020-adocao-de-sso-e-mfa";
import { q021 } from "./q021-responder-perguntas-de-experiencia";
import { q022 } from "./q022-delegacao-de-acesso-do-zero";
import { q023 } from "./q023-papeis-do-oauth-2-0";
import { q024 } from "./q024-oauth-openid-connect";
import { q025 } from "./q025-clientes-publicos-confidenciais";
import { q026 } from "./q026-escolher-o-grant-certo";
import { q027 } from "./q027-fluxo-authorization-code";
import { q028 } from "./q028-pkce-e-sua-motivacao";
import { q029 } from "./q029-redirect-uri-e-state";
import { q030 } from "./q030-escopos-e-consentimento";
import { q031 } from "./q031-client-credentials-grant";
import { q032 } from "./q032-device-authorization-grant";
import { q033 } from "./q033-implicit-e-password-legados";
import { q034 } from "./q034-refresh-token-e-rotacao";
import { q035 } from "./q035-introspeccao-e-revogacao";
import { q036 } from "./q036-token-exchange-e-on-behalf-of";
import { q037 } from "./q037-tokens-vinculados-ao-remetente";
import { q038 } from "./q038-par-jar-e-fapi-2-0";
import { q039 } from "./q039-rfc-9700-e-oauth-2-1";
import { q040 } from "./q040-proteger-uma-api-com-tokens";
import { q041 } from "./q041-spa-com-bff";
import { q042 } from "./q042-oauth-para-agentes-de-ia-e-mcp";
import { q043 } from "./q043-id-token-access-token-e-userinfo";
import { q044 } from "./q044-fluxos-do-openid-connect";
import { q045 } from "./q045-discovery-e-jwks";
import { q046 } from "./q046-claims-e-escopos-padrao";
import { q047 } from "./q047-nonce-no-openid-connect";
import { q048 } from "./q048-validar-o-id-token";
import { q049 } from "./q049-logout-no-openid-connect";
import { q050 } from "./q050-acr-values-max-age-e-prompt";
import { q051 } from "./q051-dynamic-client-registration";
import { q052 } from "./q052-vincular-conta-por-sub-nao-e-mail";
import { q053 } from "./q053-emissor-em-apps-multi-tenant";
import { q054 } from "./q054-integrar-oidc-no-backend";
import { q055 } from "./q055-o-que-e-saml";
import { q056 } from "./q056-fluxo-saml-iniciado-pelo-sp";
import { q057 } from "./q057-sp-initiated-idp-initiated";
import { q058 } from "./q058-elementos-da-assertion-saml";
import { q059 } from "./q059-bindings-saml";
import { q060 } from "./q060-nameid-e-atributos";
import { q061 } from "./q061-assinatura-e-criptografia-saml";
import { q062 } from "./q062-audience-validade-e-inresponseto";
import { q063 } from "./q063-validar-uma-resposta-saml";
import { q064 } from "./q064-metadata-e-rotacao-de-certificados";
import { q065 } from "./q065-saml-openid-connect";
import { q066 } from "./q066-single-logout-do-saml";
import { q067 } from "./q067-ataques-tipicos-ao-saml";
import { q068 } from "./q068-sso-corporativo-em-saas";
import { q069 } from "./q069-estrutura-e-claims-do-jwt";
import { q070 } from "./q070-jws-jwe-e-sd-jwt";
import { q071 } from "./q071-hs256-rs256-e-es256";
import { q072 } from "./q072-validar-um-jwt";
import { q073 } from "./q073-jwks-e-rotacao-de-chaves";
import { q074 } from "./q074-token-opaco-jwt";
import { q075 } from "./q075-jwt-sessao-com-cookie";
import { q076 } from "./q076-papeis-dentro-do-jwt";
import { q077 } from "./q077-revogar-tokens-stateless";
import { q078 } from "./q078-tempo-de-vida-de-tokens-e-sessoes";
import { q079 } from "./q079-atributos-de-cookies-seguros";
import { q080 } from "./q080-onde-guardar-tokens-no-navegador";
import { q081 } from "./q081-sessao-segura-do-zero";
import { q082 } from "./q082-logout-e-sair-de-todos-os-dispositivos";
import { q083 } from "./q083-fixacao-de-sessao";
import { q084 } from "./q084-propagar-identidade-entre-servicos";
import { q085 } from "./q085-fatores-de-autenticacao";
import { q086 } from "./q086-armazenar-senhas-com-seguranca";
import { q087 } from "./q087-politica-de-senhas-moderna";
import { q088 } from "./q088-totp-hotp";
import { q089 } from "./q089-riscos-de-sms-como-fator";
import { q090 } from "./q090-fadiga-de-mfa-e-number-matching";
import { q091 } from "./q091-biometria-como-fator";
import { q092 } from "./q092-fido2-webauthn-e-ctap";
import { q093 } from "./q093-cerimonia-de-registro-webauthn";
import { q094 } from "./q094-cerimonia-de-autenticacao-webauthn";
import { q095 } from "./q095-passkeys-sincronizadas-ligadas-ao";
import { q096 } from "./q096-por-que-passkeys-resistem-a-phishing";
import { q097 } from "./q097-bypass-de-mfa-por-aitm";
import { q098 } from "./q098-opcoes-de-passwordless";
import { q099 } from "./q099-step-up-e-mfa-adaptativa";
import { q100 } from "./q100-recuperacao-de-conta";
import { q101 } from "./q101-implementar-mfa-numa-aplicacao";
import { q102 } from "./q102-niveis-de-garantia-aal";
import { q103 } from "./q103-dac-mac-e-modelos-de-acesso";
import { q104 } from "./q104-rbac";
import { q105 } from "./q105-abac";
import { q106 } from "./q106-rebac-e-zanzibar";
import { q107 } from "./q107-escolher-rbac-abac-ou-rebac";
import { q108 } from "./q108-escopos-permissoes-papeis";
import { q109 } from "./q109-principio-do-menor-privilegio";
import { q110 } from "./q110-separacao-de-funcoes";
import { q111 } from "./q111-criptografia-e-chaves-como-controle-de";
import { q112 } from "./q112-sistema-de-permissoes-do-zero";
import { q113 } from "./q113-avaliacao-de-politicas-de-acesso";
import { q114 } from "./q114-motores-de-politica-pdp-e-pep";
import { q115 } from "./q115-onde-aplicar-a-autorizacao";
import { q116 } from "./q116-autorizacao-em-apis-net-e-node";
import { q117 } from "./q117-autorizacao-multi-tenant";
import { q118 } from "./q118-acesso-privilegiado-pam-e-jit";
import { q119 } from "./q119-revisao-de-acessos";
import { q120 } from "./q120-principios-do-zero-trust";
import { q121 } from "./q121-arquitetura-zero-trust";
import { q122 } from "./q122-vpn-ztna-proxy-de-identidade";
import { q123 } from "./q123-acesso-condicional-e-avaliacao-continua";
import { q124 } from "./q124-roteiro-de-adocao-do-zero-trust";
import { q125 } from "./q125-ataques-a-redirect-uri-e-open-redirect";
import { q126 } from "./q126-csrf-e-login-csrf";
import { q127 } from "./q127-xss-csrf-em-sessoes";
import { q128 } from "./q128-clickjacking-em-login-e-consentimento";
import { q129 } from "./q129-injecao-de-code-e-mix-up-attack";
import { q130 } from "./q130-roubo-e-replay-de-token";
import { q131 } from "./q131-phishing-de-consentimento";
import { q132 } from "./q132-jwt-alg-none-e-confusao-de-chave";
import { q133 } from "./q133-jwt-kid-jku-e-x5u";
import { q134 } from "./q134-credential-stuffing-e-enumeracao";
import { q135 } from "./q135-limitar-tentativas-de-login";
import { q136 } from "./q136-idor-e-bola";
import { q137 } from "./q137-ameaca-interna-e-abuso-de-acesso";
import { q138 } from "./q138-movimento-lateral-com-credenciais";
import { q139 } from "./q139-auditoria-de-eventos-de-identidade";
import { q140 } from "./q140-resposta-a-conta-comprometida";
import { q141 } from "./q141-resposta-a-vazamento-de-segredo";
import { q142 } from "./q142-depurar-erros-de-oauth-e-oidc";
import { q143 } from "./q143-depurar-token-rejeitado-pela-api";
import { q144 } from "./q144-depurar-loop-de-redirecionamento-e-cookies";
import { q145 } from "./q145-depurar-falhas-de-sso-saml";
import { q146 } from "./q146-testar-o-controle-de-acesso";
import { p001 } from "./p001-por-que-o-iam-e-essencial";
import { p002 } from "./p002-exemplo-de-authn-vs-authz";
import { p003 } from "./p003-tecnicas-de-autenticacao";
import { p004 } from "./p004-provedores-de-identity-aware-proxy";
import { p005 } from "./p005-restricoes-de-tempo-na-autenticacao";
import { p006 } from "./p006-principio-do-menor-privilegio";
import { p007 } from "./p007-tipos-de-controle-de-acesso";
import { p008 } from "./p008-etapas-de-encerramento-de-acesso";
import { p009 } from "./p009-avaliacao-de-politicas-de-iam";
import { p010 } from "./p010-tecnicas-modernas-de-mfa";
import { p011 } from "./p011-desvantagens-do-passwordless";
import { p012 } from "./p012-pilares-do-zero-trust";
import { p013 } from "./p013-autenticacao-context-aware";
import { p014 } from "./p014-verificacao-continua-no-ztna";
import { p015 } from "./p015-vpns-e-iam";
import { p016 } from "./p016-seguranca-da-vpn-no-acesso-remoto";
import { p017 } from "./p017-alternativas-as-vpns";
import { p018 } from "./p018-reverse-proxy";
import { p019 } from "./p019-o-problema-do-perimetro";
import { p020 } from "./p020-ciclo-de-vida-do-iam";
import { p021 } from "./p021-iam-e-conformidade-legal";
import { p022 } from "./p022-segregacao-de-funcoes";
import { p023 } from "./p023-spyware-e-iam";
import { p024 } from "./p024-explicando-o-dac-com-simplicidade";
import { p025 } from "./p025-acesso-descentralizado-vs-centralizado";
import { p026 } from "./p026-trafego-north-south-vs-east-west";
import { p027 } from "./p027-implementacao-de-rbac";
import { p028 } from "./p028-problemas-de-latencia-no-iam";
import { p029 } from "./p029-conselhos-para-adotar-sso";
import { p030 } from "./p030-ferramentas-de-iam-ja-usadas";
import { p031 } from "./p031-elaboracao-de-politicas-de-iam";
import { p032 } from "./p032-recertificacao-de-acesso";
import { p033 } from "./p033-monitoramento-de-atividade-de-usuarios";
import { p034 } from "./p034-trabalho-com-auditores-e-juridico";
import { p035 } from "./p035-mitigacao-de-insider-threats";
import { p036 } from "./p036-desafios-de-administrar-iam";
import { p037 } from "./p037-documento-de-politica-de-iam";
import { p038 } from "./p038-escolha-de-sistema-biometrico";
import { h001 } from "./h001-autenticacao-explicada";
import { h002 } from "./h002-autorizacao-na-pratica";
import { h003 } from "./h003-erro-comum-com-mfa";
import { h004 } from "./h004-sso-vs-conceito-vizinho";
import { h005 } from "./h005-o-que-o-rbac-comprova";
import { h006 } from "./h006-triade-cia-explicada";
import { h007 } from "./h007-risco-no-trabalho-de-iam";
import { h008 } from "./h008-erro-comum-com-threat";
import { h009 } from "./h009-vulnerability-vs-conceito-vizinho";
import { h010 } from "./h010-o-que-um-control-comprova";
import { h011 } from "./h011-inventario-de-ativos";
import { h012 } from "./h012-least-privilege-na-pratica";
import { h013 } from "./h013-erro-com-defense-in-depth";
import { h014 } from "./h014-logging-vs-conceito-vizinho";
import { h015 } from "./h015-o-que-o-monitoramento-comprova";
import { h016 } from "./h016-revisao-de-least-privilege";
import { h017 } from "./h017-confirmar-revisao-de-logs";
import { h018 } from "./h018-verificacao-de-acessos";
import { h019 } from "./h019-validacao-de-controles";
import { h020 } from "./h020-evidencias-na-revisao-de-alertas";
import { h021 } from "./h021-confirmar-documentacao-de-evidencias";
import { h022 } from "./h022-usuario-desligado-ainda-ativo";
import { h023 } from "./h023-service-account-com-papel-admin";
import { h024 } from "./h024-padrao-de-login-suspeito";
import { h025 } from "./h025-logs-de-auditoria-ausentes";
import { h026 } from "./h026-revisao-de-acessos-fraca";
import { h027 } from "./h027-exposicao-de-secret-em-producao";
import { h028 } from "./h028-alertas-falsos-positivos";
import { t001 } from "./t001-protocolos-de-authn-vs-authz";
import { t002 } from "./t002-casos-de-uso-de-authn-e-authz";
import { t003 } from "./t003-principio-do-menor-privilegio";
import { t004 } from "./t004-rbac-vs-abac";
import { t005 } from "./t005-federacao-de-identidade";
import { t006 } from "./t006-ferramentas-de-gestao-de-identidade";
import { t007 } from "./t007-experiencia-com-iam-em-nuvem";
import { t008 } from "./t008-etapas-de-incidente-de-iam";
import { t009 } from "./t009-iam-versus-necessidades-do-negocio";
import { t010 } from "./t010-boas-praticas-de-iam-em-nuvem";
import { t011 } from "./t011-governanca-de-acesso-em-nuvem";
import { t012 } from "./t012-conformidade-de-protecao-de-dados";
import { t013 } from "./t013-analytics-no-controle-de-acesso";
import { t014 } from "./t014-arquitetura-zero-trust";
import { t015 } from "./t015-gestao-de-acesso-privilegiado";
import { r001 } from "./r001-autenticacao-vs-autorizacao";
import { r002 } from "./r002-onde-impor-a-autorizacao";
import { r003 } from "./r003-rbac-ou-abac";
import { r004 } from "./r004-oauth-e-autenticacao";
import { r005 } from "./r005-authorization-code-com-pkce";
import { r006 } from "./r006-state-nonce-e-pkce";
import { r007 } from "./r007-id-token-vs-access-token";
import { r008 } from "./r008-autenticacao-servico-a-servico";
import { r009 } from "./r009-checklist-de-validacao-de-jwt";
import { r010 } from "./r010-decodificar-vs-verificar-jwt";
import { r011 } from "./r011-revogacao-de-jwt";
import { r012 } from "./r012-jwt-vs-sessoes-no-servidor";
import { r013 } from "./r013-sessao-segura-no-navegador";
import { r014 } from "./r014-session-fixation";
import { r015 } from "./r015-csrf-vs-xss-em-sessoes";
import { r016 } from "./r016-logout-de-todos-os-dispositivos";
import { r017 } from "./r017-access-token-e-sempre-jwt";
import { r018 } from "./r018-jwt-no-localstorage";
import { r019 } from "./r019-roles-dentro-de-um-jwt-valido";
import { c001 } from "./c001-fluxo-de-autenticacao-saml";
import { c002 } from "./c002-o-que-e-uma-saml-assertion";
import { c003 } from "./c003-http-redirect-vs-http-post";
import { c004 } from "./c004-validacao-da-saml-response";
import { c005 } from "./c005-configuracao-do-service-provider";
import { c006 } from "./c006-seguranca-na-implementacao-saml";
import { c007 } from "./c007-audience-restriction";
import { c008 } from "./c008-notbefore-e-notonorafter";
import { c009 } from "./c009-depuracao-de-erros-saml";
import { c010 } from "./c010-criptografia-de-saml-assertions";
import { c011 } from "./c011-expiracao-e-renovacao-de-token-saml";
import { c012 } from "./c012-attribute-consuming-service";
import { c013 } from "./c013-bindings-saml-e-casos-de-uso";
import { c014 } from "./c014-validacao-da-saml-assertion";
import { c015 } from "./c015-parametro-relaystate";
import { c016 } from "./c016-authorization-code-grant";
import { c017 } from "./c017-expiracao-de-token-e-refresh";
import { c018 } from "./c018-riscos-do-implicit-grant";
import { c019 } from "./c019-gerenciamento-de-scopes";
import { c020 } from "./c020-seguranca-entre-as-e-rs";
import { c021 } from "./c021-pkce-e-seus-beneficios";
import { c022 } from "./c022-token-introspection";
import { c023 } from "./c023-oidc-e-oauth-2-0";
import { c024 } from "./c024-boas-praticas-de-seguranca-oauth";
import { c025 } from "./c025-consentimento-do-usuario";
import { c026 } from "./c026-oidc-vs-oauth-2-0";
import { c027 } from "./c027-papel-do-id-token";
import { c028 } from "./c028-fluxos-do-oidc";
import { c029 } from "./c029-userinfo-endpoint";
import { c030 } from "./c030-verificar-assinatura-do-id-token";
import { c031 } from "./c031-claims-e-claims-customizadas";
import { c032 } from "./c032-vulnerabilidades-do-oidc";
import { c033 } from "./c033-pkce-no-authorization-code-flow";
import { c034 } from "./c034-back-channel-logout";
import { c035 } from "./c035-dynamic-client-registration";
import { c036 } from "./c036-o-que-e-mfa-e-por-que";
import { c037 } from "./c037-como-o-totp-funciona";
import { c038 } from "./c038-adicionar-mfa-a-app-existente";
import { c039 } from "./c039-fido2-e-seguranca-do-mfa";
import { c040 } from "./c040-mfa-por-push-notification";
import { c041 } from "./c041-proteger-o-canal-do-mfa";
import { c042 } from "./c042-mfa-seguranca-vs-usabilidade";
import { c043 } from "./c043-backup-e-recuperacao-de-mfa";
import { c044 } from "./c044-desafios-de-adocao-do-mfa";
import { c045 } from "./c045-tendencias-futuras-de-mfa";
import { s001 } from "./s001-protocolo-saml";
import { s002 } from "./s002-objetivo-do-saml";
import { s003 } from "./s003-saml-e-seguranca";
import { s004 } from "./s004-atores-do-saml";
import { s005 } from "./s005-fluxo-do-saml";
import { s006 } from "./s006-o-que-e-a-assertion";
import { s007 } from "./s007-confianca-entre-as-partes";
import { s008 } from "./s008-bindings-do-saml";
import { s009 } from "./s009-falhas-comuns-do-saml";
import { s010 } from "./s010-saml-em-saas";
import { s011 } from "./s011-saml-e-mfa";
import { s012 } from "./s012-cenario-atual-de-ameacas";
import { s013 } from "./s013-definicao-de-assertion";
import { s014 } from "./s014-partes-da-troca-saml";
import { s015 } from "./s015-prova-de-identidade";
import { s016 } from "./s016-saml-na-seguranca-moderna";
import { s017 } from "./s017-identidade-federada";
import { s018 } from "./s018-papel-do-identity-provider";
import { s019 } from "./s019-assertions-e-sso";
import { s020 } from "./s020-principais-riscos";
import { s021 } from "./s021-vulnerabilidades-de-xml";
import { s022 } from "./s022-replay-de-token";
import { s023 } from "./s023-protecao-das-assertions";
import { s024 } from "./s024-usos-comuns-do-saml";
import { s025 } from "./s025-o-que-e-uma-passkey";
import { s026 } from "./s026-como-passkeys-funcionam";
import { s027 } from "./s027-papel-do-fido2";
import { s028 } from "./s028-finalidade-do-webauthn";
import { s029 } from "./s029-protocolo-ctap";
import { s030 } from "./s030-resistencia-a-phishing";
import { s031 } from "./s031-fadiga-de-mfa";
import { s032 } from "./s032-beneficios-para-empresas";
import { s033 } from "./s033-armazenamento-da-chave";
import { s034 } from "./s034-riscos-das-passkeys";
import { s035 } from "./s035-passkey-sincronizada";
import { s036 } from "./s036-adocao-corporativa";
import { s037 } from "./s037-o-que-e-rbac";
import { s038 } from "./s038-mecanica-do-rbac";
import { s039 } from "./s039-menor-privilegio";
import { s040 } from "./s040-rbac-e-zero-trust";
import { s041 } from "./s041-rbac-vs-abac";
import { s042 } from "./s042-granularidade-do-abac";
import { s043 } from "./s043-rbac-em-conteineres";
import { s044 } from "./s044-rbac-e-cadeia-de-suprimentos";
import { s045 } from "./s045-riscos-do-oauth-2-0";
import { s046 } from "./s046-rbac-abac-hibrido";
import { s047 } from "./s047-roles-granulares";
import { s048 } from "./s048-arquitetura-de-menor-privilegio";
import { s049 } from "./s049-por-que-o-polp-importa";
import { s050 } from "./s050-polp-e-zero-trust";
import { s051 } from "./s051-mitigacao-de-ameacas";
import { s052 } from "./s052-riscos-na-nuvem";
import { s053 } from "./s053-vulnerabilidades-de-ia";
import { s054 } from "./s054-modelo-rbac";
import { s055 } from "./s055-modelo-abac";
import { s056 } from "./s056-permission-boundaries";
import { s057 } from "./s057-contencao-de-malware";
import { s058 } from "./s058-implementacao-do-polp";
import { s059 } from "./s059-impacto-no-movimento-lateral";
import { d001 } from "./d001-os-quatro-papeis-do-oauth-2-0";
import { d002 } from "./d002-autenticacao-vs-autorizacao";
import { d003 } from "./d003-oauth-2-0-vs-openid-connect";
import { d004 } from "./d004-finalidade-do-parametro-scope";
import { d005 } from "./d005-comparacao-exata-do-redirect-uri";
import { d006 } from "./d006-client-confidencial-vs-publico";
import { d007 } from "./d007-authorization-code-flow-com-pkce";
import { d008 } from "./d008-por-que-evitar-o-implicit-grant";
import { d009 } from "./d009-quando-usar-client-credentials";
import { d010 } from "./d010-proibicao-do-password-grant";
import { d011 } from "./d011-device-authorization-grant";
import { d012 } from "./d012-token-exchange";
import { d013 } from "./d013-access-token-vs-refresh-token";
import { d014 } from "./d014-id-token-vs-access-token";
import { d015 } from "./d015-access-tokens-opacos-vs-jwt";
import { d016 } from "./d016-revogacao-de-acesso-no-oauth";
import { d017 } from "./d017-replay-de-token-entre-apis";
import { d018 } from "./d018-armazenar-tokens-no-navegador";
import { d019 } from "./d019-parametro-state-com-pkce";
import { d020 } from "./d020-mix-up-attack-e-parametro-iss";
import { d021 } from "./d021-sender-constrained-tokens";
import { d022 } from "./d022-refresh-tokens-na-rfc-9700";
import { d023 } from "./d023-authorization-code-injection";
import { d024 } from "./d024-nonce-no-openid-connect";
import { d025 } from "./d025-acr-amr-e-step-up-auth";
import { d026 } from "./d026-pushed-authorization-requests";
import { d027 } from "./d027-situacao-e-mudancas-do-oauth-2-1";
import { d028 } from "./d028-fluxos-cross-device-rfc-10027";
import { d029 } from "./d029-fapi-2-0-em-bancos";
import { d030 } from "./d030-mcp-e-oauth";
import { d031 } from "./d031-as-tres-partes-de-um-jwt";
import { d032 } from "./d032-payload-do-jwt-e-criptografado";
import { d033 } from "./d033-jws-vs-jwe";
import { d034 } from "./d034-registered-claims-do-jwt";
import { d035 } from "./d035-hs256-vs-rs256-vs-es256";
import { d036 } from "./d036-jwt-vs-token-opaco";
import { d037 } from "./d037-validacao-de-jwt-na-api";
import { d038 } from "./d038-algoritmo-none-no-jwt";
import { d039 } from "./d039-confusao-de-algoritmo-rs256-hs256";
import { d040 } from "./d040-validacao-do-claim-aud";
import { d041 } from "./d041-abuso-dos-headers-kid-jku-x5u";
import { d042 } from "./d042-jwks-e-rotacao-de-chaves";
import { d043 } from "./d043-revogacao-de-jwt-stateless";
import { d044 } from "./d044-rotacao-de-refresh-token";
import { d045 } from "./d045-id-token-vs-access-token";
import { d046 } from "./d046-dpop-contra-token-roubado";
import { d047 } from "./d047-jwt-no-localstorage";
import { d048 } from "./d048-cookie-httponly-vs-header";
import { d049 } from "./d049-padrao-backend-for-frontend";
import { d050 } from "./d050-tratar-access-token-expirado";
import { d051 } from "./d051-atualizacao-das-jwt-best-practices";
import { d052 } from "./d052-nome-eddsa-obsoleto-rfc-9864";
import { d053 } from "./d053-rfc-9700-e-emissao-de-jwt";
import { d054 } from "./d054-rfc-10017-para-single-page-apps";
import { d055 } from "./d055-sd-jwt-e-divulgacao-seletiva";
import { v001 } from "./v001-definicao-de-saml";
import { v002 } from "./v002-saml-assertion";
import { v003 } from "./v003-openid-vs-saml";
import { v004 } from "./v004-jwt-vs-saml";
import { v005 } from "./v005-componentes-do-saml";
import { g001 } from "./g001-definicao-de-oauth-2-0";
import { g002 } from "./g002-papeis-do-oauth-2-0";
import { g003 } from "./g003-grant-types-do-oauth-2-0";
import { g004 } from "./g004-fluxo-authorization-code-grant";
import { g005 } from "./g005-refresh-token-e-seu-uso";
import { g006 } from "./g006-fluxo-implicit-grant";
import { g007 } from "./g007-seguranca-no-oauth-2-0";
import { g008 } from "./g008-pkce-e-sua-importancia";
import { g009 } from "./g009-client-credentials-grant";
import { i001 } from "./i001-dac-vs-mac";
import { i002 } from "./i002-rbac-vs-modelos-tradicionais";
import { i003 } from "./i003-abac-em-ambientes-dinamicos";
import { i004 } from "./i004-controle-de-acesso-em-zero-trust";
import { i005 } from "./i005-privilegio-minimo";
import { i006 } from "./i006-controle-de-acesso-na-nuvem";
import { i007 } from "./i007-bell-lapadula-e-biba";
import { i008 } from "./i008-criptografia-como-controle-de-acesso";
import { i009 } from "./i009-credenciais-compartilhadas-e-sso";
import { i010 } from "./i010-vulnerabilidades-de-controle-de-acesso";
import { i011 } from "./i011-controle-de-acesso-na-aplicacao";
import { i012 } from "./i012-controle-de-acesso-biometrico";
import { i013 } from "./i013-delegacao-baseada-em-papeis";
import { i014 } from "./i014-oauth-e-oidc-em-apis";
import { i015 } from "./i015-security-token-service-sts";
import { i016 } from "./i016-separacao-de-funcoes";
import { i017 } from "./i017-implementacao-de-mfa";
import { i018 } from "./i018-testes-de-controle-de-acesso";
import { i019 } from "./i019-governanca-de-politicas-em-escala";
import { i020 } from "./i020-gdpr-e-controle-de-acesso";
import { i021 } from "./i021-iam-e-controle-de-acesso";
import { i022 } from "./i022-logs-de-auditoria";
import { i023 } from "./i023-controle-de-acesso-em-mobile-e-iot";
import { w001 } from "./w001-o-que-e-zta";
import { w002 } from "./w002-por-que-o-zero-trust-surgiu";
import { w003 } from "./w003-nunca-confie-sempre-verifique";
import { w004 } from "./w004-componentes-centrais-do-zta";
import { w005 } from "./w005-zero-trust-vs-perimetro";
import { w006 } from "./w006-identidade-no-zta";
import { w007 } from "./w007-mfa-no-zero-trust";
import { w008 } from "./w008-privilegio-minimo-no-zta";
import { w009 } from "./w009-ameacas-internas";
import { w010 } from "./w010-autenticacao-vs-autorizacao";
import { w011 } from "./w011-acesso-a-recursos-na-nuvem";
import { w012 } from "./w012-monitoramento-continuo";
import { w013 } from "./w013-seguranca-do-trabalho-remoto";
import { w014 } from "./w014-confianca-em-usuario-vs-dispositivo";
import { w015 } from "./w015-ativos-a-proteger";
import { w016 } from "./w016-politica-zero-trust";
import { w017 } from "./w017-verificar-explicitamente";
import { w018 } from "./w018-zero-trust-e-triade-cia";
import { w019 } from "./w019-seguranca-de-endpoint";
import { w020 } from "./w020-reducao-da-superficie-de-ataque";
import { w021 } from "./w021-logging-e-auditoria";
import { w022 } from "./w022-zero-trust-e-vpns";
import { w023 } from "./w023-acesso-condicional";
import { w024 } from "./w024-redes-nao-confiaveis";
import { w025 } from "./w025-identity-providers-idp";
import { w026 } from "./w026-aplicacoes-cloud-native";
import { w027 } from "./w027-fronteira-de-confianca";
import { w028 } from "./w028-organizacoes-pequenas-vs-grandes";
import { w029 } from "./w029-limites-dos-firewalls";
import { w030 } from "./w030-assumir-violacao";
import { w031 } from "./w031-conformidade-regulatoria";
import { w032 } from "./w032-politicas-de-controle-de-acesso";
import { w033 } from "./w033-ciclo-de-vida-de-identidades";
import { w034 } from "./w034-policy-decision-point-pdp";
import { w035 } from "./w035-policy-enforcement-point-pep";
import { w036 } from "./w036-aplicacoes-saas";
import { w037 } from "./w037-equivoco-comum";
import { w038 } from "./w038-arquitetura-de-referencia-do-nist";
import { w039 } from "./w039-autenticacao-continua";
import { w040 } from "./w040-avaliacao-de-saude-do-dispositivo";
import { w041 } from "./w041-software-defined-perimeters";
import { w042 } from "./w042-controle-de-acesso-baseado-em-risco";
import { w043 } from "./w043-analise-comportamental";
import { w044 } from "./w044-prevencao-de-movimento-lateral";
import { w045 } from "./w045-aplicacoes-legadas";
import { w046 } from "./w046-politicas-estaticas-vs-dinamicas";
import { w047 } from "./w047-saml-oauth-e-oidc-no-zta";
import { w048 } from "./w048-seguranca-de-apis";
import { w049 } from "./w049-politica-para-app-em-nuvem";
import { w050 } from "./w050-ambientes-multi-cloud";
import { w051 } from "./w051-avaliacao-de-postura-do-endpoint";
import { w052 } from "./w052-resposta-a-anomalias";
import { w053 } from "./w053-roteiro-de-implementacao";
import { w054 } from "./w054-integracao-com-siem";
import { w055 } from "./w055-telemetria-e-observabilidade";
import { w056 } from "./w056-usuarios-internos-vs-externos";
import { w057 } from "./w057-acesso-just-in-time";
import { w058 } from "./w058-ml-em-decisoes-de-seguranca";
import { w059 } from "./w059-mitigacao-de-phishing";
import { w060 } from "./w060-avaliacao-de-maturidade";
import { w061 } from "./w061-centrada-em-rede-vs-identidade";
import { w062 } from "./w062-peps-em-ambientes-cloud-native";
import { w063 } from "./w063-segredos-e-credenciais";
import { w064 } from "./w064-logging-para-conformidade";
import { w065 } from "./w065-seguranca-vs-usabilidade";
import { w066 } from "./w066-pontuacao-de-risco";
import { w067 } from "./w067-deny-explicito-vs-implicito";
import { w068 } from "./w068-aplicacoes-em-conteineres";
import { w069 } from "./w069-confianca-adaptativa";
import { w070 } from "./w070-contas-compartilhadas";
import { w071 } from "./w071-metricas-de-eficacia";
import { w072 } from "./w072-implantacao-com-alta-disponibilidade";
import { w073 } from "./w073-design-multinacional";
import { w074 } from "./w074-integracao-com-devsecops";
import { w075 } from "./w075-zero-trust-em-erp-legado";
import { w076 } from "./w076-ambientes-de-alto-throughput";
import { w077 } from "./w077-arquitetura-serverless";
import { w078 } from "./w078-aplicacoes-api-first";
import { w079 } from "./w079-politicas-dinamicas-com-ia";
import { w080 } from "./w080-validacao-continua-de-confianca";
import { w081 } from "./w081-deteccao-de-anomalias-com-ml";
import { w082 } from "./w082-deteccao-de-ameaca-interna";
import { w083 } from "./w083-defesa-em-profundidade";
import { w084 } from "./w084-conformidade-gdpr-hipaa-ccpa";
import { w085 } from "./w085-gestao-de-risco-e-auditoria";
import { w086 } from "./w086-conformidade-continua";
import { w087 } from "./w087-eventos-e-microsservicos";
import { w088 } from "./w088-politicas-multi-provedor";
import { w089 } from "./w089-ztna-e-seus-desafios";
import { w090 } from "./w090-deteccao-de-movimento-lateral";
import { w091 } from "./w091-integracao-com-siem-e-soar";
import { w092 } from "./w092-confianca-adaptativa-em-tempo-real";
import { w093 } from "./w093-kpis-de-eficacia";
import { w094 } from "./w094-escala-global";
import { w095 } from "./w095-gestao-de-acesso-privilegiado";
import { w096 } from "./w096-federacao-de-identidade-segura";
import { w097 } from "./w097-redes-de-alta-latencia";
import { w098 } from "./w098-saas-multi-tenant";
import { w099 } from "./w099-ambientes-byod";
import { w100 } from "./w100-validacao-da-arquitetura";

/** Todas as perguntas do guia, na ordem de estudo. Gerado por scripts/gerar-indice-de-perguntas.mts. */
export const perguntas: Pergunta[] = [
  q001,
  q002,
  q003,
  q004,
  q005,
  q006,
  q007,
  q008,
  q009,
  q010,
  q011,
  q012,
  q013,
  q014,
  q015,
  q016,
  q017,
  q018,
  q019,
  q020,
  q021,
  q022,
  q023,
  q024,
  q025,
  q026,
  q027,
  q028,
  q029,
  q030,
  q031,
  q032,
  q033,
  q034,
  q035,
  q036,
  q037,
  q038,
  q039,
  q040,
  q041,
  q042,
  q043,
  q044,
  q045,
  q046,
  q047,
  q048,
  q049,
  q050,
  q051,
  q052,
  q053,
  q054,
  q055,
  q056,
  q057,
  q058,
  q059,
  q060,
  q061,
  q062,
  q063,
  q064,
  q065,
  q066,
  q067,
  q068,
  q069,
  q070,
  q071,
  q072,
  q073,
  q074,
  q075,
  q076,
  q077,
  q078,
  q079,
  q080,
  q081,
  q082,
  q083,
  q084,
  q085,
  q086,
  q087,
  q088,
  q089,
  q090,
  q091,
  q092,
  q093,
  q094,
  q095,
  q096,
  q097,
  q098,
  q099,
  q100,
  q101,
  q102,
  q103,
  q104,
  q105,
  q106,
  q107,
  q108,
  q109,
  q110,
  q111,
  q112,
  q113,
  q114,
  q115,
  q116,
  q117,
  q118,
  q119,
  q120,
  q121,
  q122,
  q123,
  q124,
  q125,
  q126,
  q127,
  q128,
  q129,
  q130,
  q131,
  q132,
  q133,
  q134,
  q135,
  q136,
  q137,
  q138,
  q139,
  q140,
  q141,
  q142,
  q143,
  q144,
  q145,
  q146,
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
  p019,
  p020,
  p021,
  p022,
  p023,
  p024,
  p025,
  p026,
  p027,
  p028,
  p029,
  p030,
  p031,
  p032,
  p033,
  p034,
  p035,
  p036,
  p037,
  p038,
  h001,
  h002,
  h003,
  h004,
  h005,
  h006,
  h007,
  h008,
  h009,
  h010,
  h011,
  h012,
  h013,
  h014,
  h015,
  h016,
  h017,
  h018,
  h019,
  h020,
  h021,
  h022,
  h023,
  h024,
  h025,
  h026,
  h027,
  h028,
  t001,
  t002,
  t003,
  t004,
  t005,
  t006,
  t007,
  t008,
  t009,
  t010,
  t011,
  t012,
  t013,
  t014,
  t015,
  r001,
  r002,
  r003,
  r004,
  r005,
  r006,
  r007,
  r008,
  r009,
  r010,
  r011,
  r012,
  r013,
  r014,
  r015,
  r016,
  r017,
  r018,
  r019,
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
  c034,
  c035,
  c036,
  c037,
  c038,
  c039,
  c040,
  c041,
  c042,
  c043,
  c044,
  c045,
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
  v001,
  v002,
  v003,
  v004,
  v005,
  g001,
  g002,
  g003,
  g004,
  g005,
  g006,
  g007,
  g008,
  g009,
  i001,
  i002,
  i003,
  i004,
  i005,
  i006,
  i007,
  i008,
  i009,
  i010,
  i011,
  i012,
  i013,
  i014,
  i015,
  i016,
  i017,
  i018,
  i019,
  i020,
  i021,
  i022,
  i023,
  w001,
  w002,
  w003,
  w004,
  w005,
  w006,
  w007,
  w008,
  w009,
  w010,
  w011,
  w012,
  w013,
  w014,
  w015,
  w016,
  w017,
  w018,
  w019,
  w020,
  w021,
  w022,
  w023,
  w024,
  w025,
  w026,
  w027,
  w028,
  w029,
  w030,
  w031,
  w032,
  w033,
  w034,
  w035,
  w036,
  w037,
  w038,
  w039,
  w040,
  w041,
  w042,
  w043,
  w044,
  w045,
  w046,
  w047,
  w048,
  w049,
  w050,
  w051,
  w052,
  w053,
  w054,
  w055,
  w056,
  w057,
  w058,
  w059,
  w060,
  w061,
  w062,
  w063,
  w064,
  w065,
  w066,
  w067,
  w068,
  w069,
  w070,
  w071,
  w072,
  w073,
  w074,
  w075,
  w076,
  w077,
  w078,
  w079,
  w080,
  w081,
  w082,
  w083,
  w084,
  w085,
  w086,
  w087,
  w088,
  w089,
  w090,
  w091,
  w092,
  w093,
  w094,
  w095,
  w096,
  w097,
  w098,
  w099,
  w100,
];
