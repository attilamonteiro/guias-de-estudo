import type { Pergunta } from "../../tipos";

// Q82 · Logout e sair de todos os dispositivos
export const q082: Pergunta = {
  numero: 82,
  modulo: "tokens-e-sessoes",
  metodo: "trace",
  pt: {
    titulo: "Logout e sair de todos os dispositivos",
    pergunta:
      "Como implementar um logout de verdade e a função “sair de todos os dispositivos”? Descreva o que precisa ser invalidado no cliente, no servidor e no IdP.",
    porqueEsteMetodo:
      "“Sair” envolve vários participantes, e o logout falha justamente na passagem entre eles. Seguir um clique em “Sair” do navegador até o IdP, e depois os caminhos em que algo fica de pé, mostra o que cada camada precisa apagar.",
    resposta30s:
      "Um logout de verdade invalida três camadas: no **cliente**, apaga o cookie e o estado local; no **servidor**, destrói a sessão e **revoga os refresh tokens**; no **IdP**, encerra a sessão de SSO (RP-Initiated Logout) e avisa as outras aplicações, de preferência por back-channel. Para **sair de todos**, mantenha um registro de sessões por usuário ou uma **versão de sessão** que invalida tudo de uma vez, e acione-a também na troca de senha. Os access tokens JWT já emitidos seguem válidos até o `exp`, a menos que haja checagem de estado.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Um logout de verdade, do clique ao IdP",
        etapas: [
          "O usuário clica em “Sair”: a aplicação envia um `POST /logout` (nunca um `GET`, que um site de terceiros poderia disparar), com a proteção anti-CSRF de sempre",
          "O servidor destrói a sessão que ele guarda (o registro, e não só o cookie) e revoga no servidor de autorização os refresh tokens ligados a ela (RFC 7009)",
          "A resposta expira o cookie, com o mesmo nome, `Path` e `Domain` com que ele foi criado, e pode enviar `Clear-Site-Data` onde houver suporte",
          "O cliente apaga o estado local: tokens em memória, caches com dados do usuário, `localStorage`, `IndexedDB` e o cache do service worker, e para os temporizadores de renovação",
          "A aplicação redireciona o navegador ao `end_session_endpoint` do IdP (RP-Initiated Logout), que encerra a sessão de SSO e o devolve ao `post_logout_redirect_uri` registrado",
          "O IdP avisa as outras aplicações da mesma sessão de SSO: por back-channel (chamada de servidor a servidor com um `logout_token`) ou por front-channel (iframes); no SAML, pelo Single Logout (veja Q49 e Q66)",
          "Os access tokens já emitidos continuam válidos até o `exp`; as APIs que exigem corte imediato precisam de revogação ou de checagem de estado (veja Q77)",
        ],
        nota: "Cada camada guarda um pedaço do login: o navegador, o servidor da aplicação e o IdP. Apagar só uma deixa as outras de pé.",
      },
      {
        tipo: "codigo",
        titulo: "Revogar o refresh token e encerrar a sessão no IdP",
        legenda: "HTTP",
        codigo: `POST /revoke HTTP/1.1
Host: idp.exemplo.com
Authorization: Basic czZCaGRSa3F0Mzpn...
Content-Type: application/x-www-form-urlencoded

token=8xLOxBtZp8&token_type_hint=refresh_token

HTTP/1.1 302 Found
Set-Cookie: __Host-sid=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax
Location: https://idp.exemplo.com/connect/logout?id_token_hint=eyJhbGci...&post_logout_redirect_uri=https%3A%2F%2Fapp.exemplo.com%2Fadeus&state=r7Kq2`,
        nota: "O `POST /revoke` é a chamada do servidor da aplicação ao IdP (RFC 7009, com autenticação do cliente). A resposta 302 é a que o navegador recebe: ela expira o cookie e o leva ao encerramento de sessão do IdP. O `post_logout_redirect_uri` precisa estar registrado no IdP, para não virar um redirecionamento aberto (veja Q125).",
      },
      {
        tipo: "passos",
        titulo: "Onde o logout costuma falhar",
        passos: [
          {
            titulo: "Só o cliente saiu",
            texto:
              "Apagar cookie e tokens do navegador não toca no servidor: a sessão e o refresh token seguem válidos, e uma cópia roubada continua funcionando.",
          },
          {
            titulo: "O IdP continua logado",
            texto:
              "A aplicação encerra a própria sessão, mas a sessão de SSO no IdP segue de pé: o próximo “Entrar” volta sem pedir senha, e quem usa um computador compartilhado acha que saiu.",
          },
          {
            titulo: "O aviso às outras aplicações se perde",
            texto:
              "O front-channel depende do navegador (iframes e cookies de terceiros bloqueados o quebram), e o SAML Single Logout falha se um participante estiver fora do ar. O back-channel é mais confiável, mas cada aplicação precisa implementar o recebimento. A expiração ociosa é a última rede de segurança.",
          },
          {
            titulo: "O access token ainda funciona",
            texto:
              "Um JWT autocontido continua aceito pelas APIs até o `exp`. Reduza o prazo, use checagem de estado ou introspecção nas operações sensíveis (veja Q77 e Q78) e aceite que o corte é em minutos, e não em segundos, a menos que você pague pelo estado.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Sair de todos os dispositivos: duas formas",
        colunas: ["Abordagem", "Como funciona", "Vantagens", "Limites"],
        linhas: [
          [
            "Registro de sessões por usuário",
            "Um índice usuário → sessões (id, dispositivo, IP, última atividade). “Sair de todos” apaga cada sessão listada e revoga todos os refresh tokens do usuário",
            "A pessoa vê e encerra sessões individuais, e dá para sair de todas menos a atual; bom para auditoria",
            "Exige manter o índice consistente com as expirações; mais armazenamento",
          ],
          [
            "Versão de sessão do usuário",
            "Um número (`session_version`) por usuário, copiado para sessões e tokens. “Sair de todos” incrementa o número, e tudo com versão antiga é recusado",
            "Uma escrita derruba tudo, sem listar nada; combina bem com JWTs",
            "Não há lista para o usuário; exige uma leitura (cacheada) por requisição e derruba também a sessão atual, se ela não for reemitida",
          ],
        ],
        nota: "Acione o “sair de todos” automaticamente na troca de senha, na troca ou remoção de um fator de MFA, na suspeita de comprometimento e no desligamento (veja Q13 e Q140). No IdP, procure a operação equivalente de revogar as sessões do usuário (confira a documentação do fornecedor).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que invalidar, e onde",
        texto:
          "Logout de verdade são três camadas: **cliente** (cookie e estado local), **servidor** (sessão e refresh tokens) e **IdP** (sessão de SSO e aplicações irmãs). O que sobra é o access token autocontido, válido até o `exp`; o prazo curto e a checagem de estado são o que o cortam. Para “sair de todos”, o servidor precisa saber **quais** sessões existem (registro) ou ter um **número** que as invalide em bloco (versão).",
      },
    ],
    armadilhas: [
      "Logout só no cliente (apagar cookie ou token): a sessão no servidor e o refresh token continuam válidos.",
      "Esquecer o IdP: o próximo acesso entra sem senha porque o SSO segue ativo, e quem está num computador compartilhado acha que saiu.",
      "Logout por `GET` simples (disparável por imagem, pré-busca ou outro site) e `post_logout_redirect_uri` livre, o que abre um redirecionamento aberto.",
      "Um “sair de todos” que não revoga os refresh tokens nem a sessão no IdP, ou que não é acionado na troca de senha.",
    ],
    autoteste: [
      {
        pergunta:
          "Depois do logout, um access token JWT de 10 minutos ainda funciona. Por quê, e como reduzir o risco?",
        resposta:
          "Porque a API o valida só pela assinatura e pelo `exp`, sem consultar o servidor. Reduz-se o risco com prazo curto, checagem de estado (versão da sessão ou lista de `jti`) e introspecção nas operações sensíveis, cada uma trocando estado por controle (veja Q77).",
      },
      {
        pergunta: "Qual a diferença entre apagar o cookie e destruir a sessão?",
        resposta:
          "Apagar o cookie só remove a cópia do navegador. Destruir a sessão apaga o registro no servidor, e então o id copiado por um invasor deixa de valer. Um logout de verdade faz as duas coisas.",
      },
    ],
  },
  en: {
    titulo: "Logout and signing out everywhere",
    pergunta:
      "How do you implement a real logout and a “sign out of all devices” feature? Describe what must be invalidated on the client, the server and the IdP.",
    porqueEsteMetodo:
      "“Signing out” involves several participants, and logout fails precisely at the handoff between them. Following a click on “Sign out” from the browser to the IdP, and then the paths where something stays standing, shows what each layer must erase.",
    resposta30s:
      "A real logout invalidates three layers: on the **client**, it clears the cookie and local state; on the **server**, it destroys the session and **revokes the refresh tokens**; at the **IdP**, it ends the SSO session (RP-Initiated Logout) and notifies the other applications, preferably by back-channel. For **sign out everywhere**, keep a per-user session registry or a **session version** that invalidates everything at once, and trigger it on password change too. JWT access tokens already issued stay valid until `exp`, unless there is a state check.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A real logout, from the click to the IdP",
        etapas: [
          "The user clicks “Sign out”: the application sends a `POST /logout` (never a `GET`, which a third-party site could trigger), with the usual anti-CSRF protection",
          "The server destroys the session it keeps (the record, not just the cookie) and revokes, at the authorization server, the refresh tokens tied to it (RFC 7009)",
          "The response expires the cookie, with the same name, `Path` and `Domain` it was created with, and may send `Clear-Site-Data` where supported",
          "The client erases local state: tokens in memory, caches holding user data, `localStorage`, `IndexedDB` and the service worker cache, and stops renewal timers",
          "The application redirects the browser to the IdP’s `end_session_endpoint` (RP-Initiated Logout), which ends the SSO session and sends it back to the registered `post_logout_redirect_uri`",
          "The IdP notifies the other applications in the same SSO session: by back-channel (a server-to-server call carrying a `logout_token`) or front-channel (iframes); in SAML, through Single Logout (see Q49 and Q66)",
          "Access tokens already issued stay valid until `exp`; APIs that need an immediate cutoff require revocation or a state check (see Q77)",
        ],
        nota: "Each layer holds a piece of the login: the browser, the application server and the IdP. Clearing only one leaves the others standing.",
      },
      {
        tipo: "codigo",
        titulo: "Revoking the refresh token and ending the session at the IdP",
        legenda: "HTTP",
        codigo: `POST /revoke HTTP/1.1
Host: idp.example.com
Authorization: Basic czZCaGRSa3F0Mzpn...
Content-Type: application/x-www-form-urlencoded

token=8xLOxBtZp8&token_type_hint=refresh_token

HTTP/1.1 302 Found
Set-Cookie: __Host-sid=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax
Location: https://idp.example.com/connect/logout?id_token_hint=eyJhbGci...&post_logout_redirect_uri=https%3A%2F%2Fapp.example.com%2Fgoodbye&state=r7Kq2`,
        nota: "The `POST /revoke` is the application server’s call to the IdP (RFC 7009, with client authentication). The 302 response is what the browser receives: it expires the cookie and sends the browser to the IdP’s session end. The `post_logout_redirect_uri` must be registered at the IdP so it does not become an open redirect (see Q125).",
      },
      {
        tipo: "passos",
        titulo: "Where logout usually fails",
        passos: [
          {
            titulo: "Only the client signed out",
            texto:
              "Clearing the cookie and tokens in the browser does not touch the server: the session and the refresh token stay valid, and a stolen copy keeps working.",
          },
          {
            titulo: "The IdP is still signed in",
            texto:
              "The application ends its own session, but the SSO session at the IdP stays up: the next “Sign in” returns without asking for a password, and someone on a shared computer thinks they signed out.",
          },
          {
            titulo: "The notice to other applications gets lost",
            texto:
              "Front-channel depends on the browser (iframes and blocked third-party cookies break it), and SAML Single Logout fails if a participant is down. Back-channel is more reliable, but each application has to implement receiving it. Idle expiry is the last safety net.",
          },
          {
            titulo: "The access token still works",
            texto:
              "A self-contained JWT keeps being accepted by APIs until `exp`. Shorten the lifetime, use a state check or introspection on sensitive operations (see Q77 and Q78) and accept that the cutoff is in minutes, not seconds, unless you pay for the state.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Signing out everywhere: two approaches",
        colunas: ["Approach", "How it works", "Advantages", "Limits"],
        linhas: [
          [
            "Per-user session registry",
            "A user → sessions index (id, device, IP, last activity). “Sign out everywhere” deletes every listed session and revokes all the user’s refresh tokens",
            "The person sees and ends individual sessions, and can sign out of all but the current one; good for auditing",
            "The index must stay consistent with expirations; more storage",
          ],
          [
            "User session version",
            "A number (`session_version`) per user, copied into sessions and tokens. “Sign out everywhere” increments the number, and anything with an old version is refused",
            "One write brings everything down with nothing to list; fits JWTs well",
            "No list for the user; needs one (cached) read per request and also drops the current session unless it is reissued",
          ],
        ],
        nota: "Trigger “sign out everywhere” automatically on a password change, on changing or removing an MFA factor, on suspected compromise and on offboarding (see Q13 and Q140). At the IdP, look for the equivalent operation that revokes the user’s sessions (check the vendor’s documentation).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What to invalidate, and where",
        texto:
          "A real logout is three layers: **client** (cookie and local state), **server** (session and refresh tokens) and **IdP** (SSO session and sibling applications). What remains is the self-contained access token, valid until `exp`; a short lifetime and a state check are what cut it off. For “sign out everywhere”, the server must know **which** sessions exist (a registry) or hold a **number** that invalidates them in bulk (a version).",
      },
    ],
    armadilhas: [
      "Client-only logout (deleting the cookie or token): the server-side session and the refresh token stay valid.",
      "Forgetting the IdP: the next visit gets in without a password because SSO is still active, and someone on a shared computer thinks they signed out.",
      "Logout through a plain `GET` (triggerable by an image, a prefetch or another site) and a free-form `post_logout_redirect_uri`, which opens an open redirect.",
      "A “sign out everywhere” that does not revoke refresh tokens or the IdP session, or that is not triggered on password change.",
    ],
    autoteste: [
      {
        pergunta: "After logout, a 10-minute JWT access token still works. Why, and how do you reduce the risk?",
        resposta:
          "Because the API validates it only by signature and `exp`, without asking the server. You reduce the risk with a short lifetime, a state check (session version or a `jti` list) and introspection on sensitive operations, each trading state for control (see Q77).",
      },
      {
        pergunta: "What is the difference between deleting the cookie and destroying the session?",
        resposta:
          "Deleting the cookie only removes the browser’s copy. Destroying the session erases the server-side record, so an id copied by an attacker stops working. A real logout does both.",
      },
    ],
  },
};
