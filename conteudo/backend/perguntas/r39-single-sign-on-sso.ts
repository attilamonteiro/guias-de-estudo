import type { Pergunta } from "../../tipos";

// R39 · Single sign-on (SSO)
export const r39: Pergunta = {
  numero: 139,
  modulo: "roadmap-avancado",
  metodo: "trace",
  pt: {
    titulo: "Single sign-on (SSO)",
    pergunta: "Descreva a implementação de uma solução de single sign-on (SSO).",
    porqueEsteMetodo:
      "SSO é um fluxo com três atores (usuário, aplicação e provedor de identidade). Seguir o login no primeiro app e o acesso ao segundo mostra de onde vem o “login único”.",
    resposta30s:
      "Escolha um **provedor de identidade (IdP)** (Keycloak, Auth0, Okta, Entra ID), registre cada aplicação nele e integre pelo padrão **OpenID Connect** (ou SAML) com **Authorization Code + PKCE**. O usuário se autentica **uma vez no IdP**; os outros aplicativos redirecionam para ele, que já tem sessão e devolve um código **sem pedir a senha de novo**. As aplicações validam os tokens e continuam decidindo as permissões locais.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Fluxo com OpenID Connect (Authorization Code + PKCE)",
        etapas: [
          "O usuário abre o app A (sem sessão)",
          "O app A redireciona ao **provedor de identidade** (IdP)",
          "O usuário faz login no IdP",
          "O IdP devolve um `code` ao app A",
          "O app A troca o `code` por `id_token` + `access_token`",
          "O usuário abre o app B, que redireciona ao IdP: a sessão já existe e o `code` volta **sem pedir senha**",
        ],
      },
      {
        tipo: "tabela",
        titulo: "Protocolos",
        colunas: ["Protocolo", "Uso típico"],
        linhas: [
          ["OIDC (OpenID Connect)", "Padrão atual para apps web e mobile; sobre OAuth 2.0, com tokens JWT"],
          ["SAML 2.0", "Corporativo e legado, B2B; baseado em XML"],
          ["Kerberos / Windows integrado", "Dentro de redes corporativas"],
        ],
      },
      {
        tipo: "passos",
        titulo: "Como implementar",
        passos: [
          {
            titulo: "Escolha o IdP",
            texto: "Keycloak, Auth0, Okta, Microsoft Entra ID, Google ou autogerido.",
          },
          {
            titulo: "Registre cada aplicação",
            texto: "`client_id`, `redirect_uri` exatas e escopos.",
          },
          {
            titulo: "Use a biblioteca padrão",
            texto: "Não escreva o protocolo à mão; use PKCE em SPAs e mobile.",
          },
          {
            titulo: "Valide os tokens",
            texto: "Assinatura (JWKS), `iss`, `aud`, `exp` e `nonce`.",
          },
          {
            titulo: "Logout e sessão",
            texto: "Logout único (front ou back-channel), expiração e refresh tokens com rotação.",
          },
          {
            titulo: "A autorização continua local",
            texto:
              "O IdP diz **quem é** o usuário; o que ele pode fazer dentro do app vem de papéis, claims e regras do próprio app.",
          },
        ],
      },
    ],
    armadilhas: [
      "`redirect_uri` frouxo (com curingas).",
      "Não validar `aud`, `iss` e `nonce`.",
      "Implementar o protocolo à mão.",
      "Confundir autenticação (SSO) com autorização.",
    ],
    autoteste: [
      {
        pergunta: "Que problema o SSO resolve?",
        resposta:
          "O usuário se autentica uma vez num provedor de identidade e acessa vários aplicativos sem informar a senha de novo; a gestão de credenciais fica centralizada.",
      },
      {
        pergunta: "O que o `id_token` do OIDC traz que o OAuth puro não traz?",
        resposta: "A identidade do usuário autenticado (quem é), num JWT assinado.",
      },
    ],
  },
  en: {
    titulo: "Single sign-on (SSO)",
    pergunta: "Describe the implementation of a single sign-on (SSO) solution.",
    porqueEsteMetodo:
      "SSO is a flow with three actors (user, application and identity provider). Following the login in the first app and the access to the second shows where the “single login” comes from.",
    resposta30s:
      "Pick an **identity provider (IdP)** (Keycloak, Auth0, Okta, Entra ID), register each application with it and integrate through **OpenID Connect** (or SAML) using **Authorization Code + PKCE**. The user authenticates **once at the IdP**; other apps redirect to it, which already has a session and returns a code **without asking for the password again**. The applications validate the tokens and still decide local permissions.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "OpenID Connect flow (Authorization Code + PKCE)",
        etapas: [
          "The user opens app A (no session)",
          "App A redirects to the **identity provider** (IdP)",
          "The user logs in at the IdP",
          "The IdP returns a `code` to app A",
          "App A exchanges the `code` for an `id_token` + `access_token`",
          "The user opens app B, which redirects to the IdP: the session already exists and the `code` comes back **without asking for a password**",
        ],
      },
      {
        tipo: "tabela",
        titulo: "Protocols",
        colunas: ["Protocol", "Typical use"],
        linhas: [
          ["OIDC (OpenID Connect)", "Current standard for web and mobile apps; on top of OAuth 2.0, with JWT tokens"],
          ["SAML 2.0", "Corporate and legacy, B2B; XML-based"],
          ["Kerberos / Windows integrated", "Inside corporate networks"],
        ],
      },
      {
        tipo: "passos",
        titulo: "How to implement",
        passos: [
          {
            titulo: "Pick the IdP",
            texto: "Keycloak, Auth0, Okta, Microsoft Entra ID, Google or self-hosted.",
          },
          {
            titulo: "Register each application",
            texto: "`client_id`, exact `redirect_uri`s and scopes.",
          },
          {
            titulo: "Use the standard library",
            texto: "Do not hand-write the protocol; use PKCE for SPAs and mobile.",
          },
          {
            titulo: "Validate the tokens",
            texto: "Signature (JWKS), `iss`, `aud`, `exp` and `nonce`.",
          },
          {
            titulo: "Logout and session",
            texto: "Single logout (front or back channel), expiry and refresh tokens with rotation.",
          },
          {
            titulo: "Authorization stays local",
            texto:
              "The IdP says **who** the user is; what they may do inside the app comes from the app’s own roles, claims and rules.",
          },
        ],
      },
    ],
    armadilhas: [
      "A loose `redirect_uri` (with wildcards).",
      "Not validating `aud`, `iss` and `nonce`.",
      "Hand-writing the protocol.",
      "Confusing authentication (SSO) with authorization.",
    ],
    autoteste: [
      {
        pergunta: "What problem does SSO solve?",
        resposta:
          "The user authenticates once with an identity provider and accesses several apps without entering the password again; credential management is centralized.",
      },
      {
        pergunta: "What does the OIDC `id_token` carry that plain OAuth does not?",
        resposta: "The identity of the authenticated user (who they are), in a signed JWT.",
      },
    ],
  },
};
