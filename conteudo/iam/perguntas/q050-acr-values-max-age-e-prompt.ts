import type { Pergunta } from "../../tipos";

// Q50 · acr_values, max_age e prompt
export const q050: Pergunta = {
  numero: 50,
  modulo: "oidc",
  metodo: "feynman",
  pt: {
    titulo: "acr_values, max_age e prompt",
    pergunta:
      "Como acr_values, max_age, prompt e as claims acr e amr permitem pedir reautenticação ou um nível maior de garantia ao IdP? Dê um exemplo de step-up.",
    porqueEsteMetodo:
      "Step-up é fácil de entender como cena do dia a dia e difícil de lembrar como lista de parâmetros. A analogia do segurança dá a lógica, e depois a tabela e o exemplo mostram o pedido, a resposta e a conferência.",
    resposta30s:
      "O app **pede** reautenticação ou mais garantia ao IdP com `prompt=login`, `max_age` (idade máxima da autenticação) e `acr_values` (nível desejado); o IdP **responde** no ID token com `auth_time`, `acr` e `amr` (os métodos usados), e a aplicação **confere** esses valores antes de liberar a operação. No **step-up**, uma ação sensível, como uma transferência alta, faz o app mandar a pessoa de volta ao IdP pedindo MFA recente. Pedir não é obter: nunca confie sem verificar o `acr` e o `auth_time` devolvidos, e use `prompt=none` só para renovação silenciosa, tratando os erros de interação exigida.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine o prédio de uma empresa: você entrou pela portaria mostrando o crachá. Para a sala-cofre, o segurança pergunta duas coisas: quando você passou o crachá pela última vez e se foi só o crachá ou também a biometria. Se faz muito tempo, ou se foi só o crachá, ele manda você voltar à portaria e refazer o controle. Na volta, ele não aceita a sua palavra: confere o registro que a portaria escreveu.",
        tecnico:
          "O cliente **pede** com parâmetros do pedido de autorização: `prompt` (`login` força reautenticar mesmo com sessão ativa; `none` não mostra tela alguma; `consent` e `select_account` reabrem o consentimento e a escolha de conta), `max_age` (idade máxima, em segundos, da última autenticação ativa) e `acr_values` (níveis de garantia desejados, em ordem de preferência). O IdP **responde** no ID token com `auth_time` (quando a pessoa se autenticou, presente sempre que houve `max_age`), `acr` (a classe de contexto de autenticação realmente satisfeita, com valores definidos por cada IdP) e `amr` (a lista dos métodos usados, como `pwd` e `otp`; a RFC 8176 define valores comuns). A aplicação **confere** esses valores, assinados, antes de liberar a operação sensível.",
        limite:
          "Os guardas não são todos iguais: o IdP trata `acr_values` como um **pedido voluntário** e pode devolver um `acr` menor do que o pedido (ou recusar com erro, se você marcar o `acr` como essencial no parâmetro `claims`, veja Q46). A imagem esconde isso: o segurança sabe o que é biometria, mas o `acr` é só um **rótulo** cujo significado vem da política do IdP, e a ordem entre os valores não é necessariamente numérica.",
      },
      {
        tipo: "tabela",
        titulo: "Os parâmetros do pedido e as claims da resposta",
        colunas: ["Item", "Direção", "O que faz"],
        linhas: [
          ["`prompt=login`", "Pedido do cliente", "Força uma nova autenticação, mesmo com sessão de SSO ativa"],
          [
            "`prompt=none`",
            "Pedido do cliente",
            "Renovação silenciosa, sem tela alguma (por exemplo num iframe oculto, que cookies de terceiros bloqueados podem impedir). Se não for possível, o IdP devolve um erro (`login_required`, `consent_required`, `interaction_required`) e o app decide o que fazer",
          ],
          [
            "`max_age`",
            "Pedido do cliente",
            "Aceita a sessão só se a última autenticação for mais recente que N segundos; senão reautentica. Faz o IdP incluir o `auth_time`",
          ],
          [
            "`acr_values`",
            "Pedido do cliente",
            "Pede um nível de garantia (por exemplo, MFA), em ordem de preferência",
          ],
          ["`auth_time` e `acr`", "Resposta do IdP, no ID token", "Quando e com que nível a pessoa se autenticou"],
          [
            "`amr`",
            "Resposta do IdP, no ID token",
            "Quais métodos foram usados (senha, código de uso único, chave de segurança…)",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Exemplo de step-up: uma transferência de alto valor",
        etapas: [
          "A pessoa entra com senha e o ID token traz `acr` = `urn:example:acr:pwd` e um `auth_time` de agora",
          "Horas depois ela pede uma transferência de alto valor; a API vê que o `acr` do token é insuficiente ou que o `auth_time` está velho e responde 401 com `insufficient_user_authentication`, indicando o `acr_values` e o `max_age` que quer (RFC 9470)",
          "O app redireciona ao IdP com `acr_values=urn:example:acr:mfa` e `max_age=300` (ou `prompt=login`, para forçar sempre), mais o `state`, o `nonce` e o PKCE de sempre",
          "O IdP pede o segundo fator e emite novos tokens com `auth_time` atual, `acr` mais alto e `amr` com os métodos usados",
          "O app valida o ID token (veja Q48) e confere o `auth_time` dentro do `max_age`, o `acr` entre os aceitos e, se a política exigir, o `amr`; o que ele pediu ao IdP não prova nada",
          "Com o novo access token, repete a chamada; a API confere `acr` e `auth_time` e libera a operação. A elevação vale por pouco tempo: passado o `max_age`, o nível normal volta a valer",
        ],
        nota: "Os valores de `acr` são ilustrativos: cada IdP define os seus (procure `acr_values_supported` no documento de descoberta, veja Q45).",
      },
      {
        tipo: "codigo",
        titulo: "O desafio da API e o novo pedido ao IdP",
        legenda: "HTTP",
        codigo:
          'HTTP/1.1 401 Unauthorized\nWWW-Authenticate: Bearer error="insufficient_user_authentication",\n  error_description="Autenticação mais forte e recente necessária",\n  acr_values="urn:example:acr:mfa", max_age="300"\n\nGET /authorize?response_type=code&client_id=meu-cliente\n  &redirect_uri=https%3A%2F%2Fapp.example.com%2Fcallback&scope=openid\n  &acr_values=urn%3Aexample%3Aacr%3Amfa&max_age=300\n  &state=<aleatório>&nonce=<aleatório>&code_challenge=<S256>&code_challenge_method=S256 HTTP/1.1\nHost: id.example.com',
        nota: "A primeira mensagem é o desafio da API; a segunda é o novo pedido de autorização que o app envia. A linha de requisição está quebrada só para leitura, e os valores entre `<>` são ilustrativos.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Pedir não é obter",
        texto:
          "O `acr_values` é um pedido; o que vale é o `acr` que **volta assinado** no token. Se o IdP não consegue satisfazê-lo, pode devolver um `acr` menor, e a aplicação ou a API deve **conferir** `acr`, `auth_time` e, se for o caso, `amr` antes de liberar a operação. Do mesmo modo, um `max_age` pedido sem `auth_time` na resposta deve ser recusado. A decisão fica no servidor, lendo o token validado: esconder o botão na interface não é step-up. E com `prompt=none`, trate `login_required`, `consent_required` e `interaction_required` levando a pessoa a um fluxo interativo, nunca em laço.",
      },
    ],
    armadilhas: [
      "Aceitar o token sem conferir `acr`, `auth_time` e `amr`: o IdP pode devolver um nível inferior ao pedido.",
      "Decidir pelo `amr` como se fosse política (ele só descreve os métodos usados) ou presumir que um `acr` “maior” é melhor numericamente: use a lista de valores que o seu IdP documenta.",
      "Usar `prompt=none` sem tratar `login_required`, `consent_required` e `interaction_required`, ou num iframe com cookies de terceiros bloqueados: a renovação silenciosa falha e o app entra em laço de redirecionamentos.",
      "Fazer o step-up só na interface: a API precisa exigir o nível e a recência no token, porque o cliente é manipulável.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre `prompt=login` e `max_age`?",
        resposta:
          "O `prompt=login` sempre força uma nova autenticação. O `max_age=N` só reautentica se a última autenticação for mais velha que N segundos, e obriga o IdP a devolver o `auth_time`, que a aplicação deve conferir.",
      },
      {
        pergunta: "Como uma API sabe que a pessoa fez MFA há pouco?",
        resposta:
          "Valida o token e lê `acr`, `amr` e `auth_time` (o IdP os inclui no access token ou na introspecção). Se forem insuficientes, responde 401 com `insufficient_user_authentication` e o `acr_values` e o `max_age` desejados (RFC 9470), e o cliente refaz a autenticação.",
      },
    ],
  },
  en: {
    titulo: "acr_values, max_age and prompt",
    pergunta:
      "How do acr_values, max_age, prompt and the acr and amr claims let you request reauthentication or a higher assurance level from the IdP? Give a step-up example.",
    porqueEsteMetodo:
      "Step-up is easy to grasp as an everyday scene and hard to remember as a list of parameters. The security-guard analogy gives the logic, and then the table and the example show the request, the response and the check.",
    resposta30s:
      "The app **asks** the IdP for reauthentication or more assurance with `prompt=login`, `max_age` (the maximum age of the authentication) and `acr_values` (the desired level); the IdP **answers** in the ID token with `auth_time`, `acr` and `amr` (the methods used), and the application **checks** those values before allowing the operation. In **step-up**, a sensitive action, such as a large transfer, makes the app send the person back to the IdP asking for recent MFA. Asking is not getting: never trust without verifying the returned `acr` and `auth_time`, and use `prompt=none` only for silent renewal, handling the interaction-required errors.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Picture a company building: you came in through the lobby showing your badge. For the vault room, the guard asks two things: when you last swiped the badge and whether it was just the badge or also biometrics. If it was long ago, or only the badge, he sends you back to the lobby to redo the check. When you return, he does not take your word: he checks the record the lobby wrote.",
        tecnico:
          "The client **asks** with authorization request parameters: `prompt` (`login` forces reauthentication even with an active session; `none` shows no screen at all; `consent` and `select_account` reopen consent and account choice), `max_age` (the maximum age, in seconds, of the last active authentication) and `acr_values` (the desired assurance levels, in order of preference). The IdP **answers** in the ID token with `auth_time` (when the person authenticated, always present when `max_age` was used), `acr` (the authentication context class actually satisfied, with values defined by each IdP) and `amr` (the list of methods used, such as `pwd` and `otp`; RFC 8176 defines common values). The application **checks** those signed values before allowing the sensitive operation.",
        limite:
          "The guards are not all alike: the IdP treats `acr_values` as a **voluntary request** and may return a lower `acr` than asked (or refuse with an error, if you mark `acr` as essential in the `claims` parameter, see Q46). The image hides this: the guard knows what biometrics is, but `acr` is just a **label** whose meaning comes from the IdP’s policy, and the order among values is not necessarily numeric.",
      },
      {
        tipo: "tabela",
        titulo: "The request parameters and the response claims",
        colunas: ["Item", "Direction", "What it does"],
        linhas: [
          ["`prompt=login`", "Client request", "Forces a new authentication, even with an active SSO session"],
          [
            "`prompt=none`",
            "Client request",
            "Silent renewal, with no screen at all (for example in a hidden iframe, which blocked third-party cookies may prevent). If it is not possible, the IdP returns an error (`login_required`, `consent_required`, `interaction_required`) and the app decides what to do",
          ],
          [
            "`max_age`",
            "Client request",
            "Accepts the session only if the last authentication is more recent than N seconds; otherwise it reauthenticates. Makes the IdP include `auth_time`",
          ],
          ["`acr_values`", "Client request", "Asks for an assurance level (for example, MFA), in order of preference"],
          ["`auth_time` and `acr`", "IdP response, in the ID token", "When and at what level the person authenticated"],
          [
            "`amr`",
            "IdP response, in the ID token",
            "Which methods were used (password, one-time code, security key…)",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Step-up example: a high-value transfer",
        etapas: [
          "The person signs in with a password and the ID token carries `acr` = `urn:example:acr:pwd` and an `auth_time` of right now",
          "Hours later they request a high-value transfer; the API sees that the token’s `acr` is insufficient or that `auth_time` is old and answers 401 with `insufficient_user_authentication`, stating the `acr_values` and `max_age` it wants (RFC 9470)",
          "The app redirects to the IdP with `acr_values=urn:example:acr:mfa` and `max_age=300` (or `prompt=login`, to always force it), plus the usual `state`, `nonce` and PKCE",
          "The IdP asks for the second factor and issues new tokens with a current `auth_time`, a higher `acr` and an `amr` with the methods used",
          "The app validates the ID token (see Q48) and checks `auth_time` within `max_age`, `acr` among those accepted and, if the policy requires it, `amr`; what it asked the IdP for proves nothing",
          "With the new access token it repeats the call; the API checks `acr` and `auth_time` and allows the operation. The elevation lasts a short time: once `max_age` passes, the normal level applies again",
        ],
        nota: "The `acr` values are illustrative: each IdP defines its own (look for `acr_values_supported` in the discovery document, see Q45).",
      },
      {
        tipo: "codigo",
        titulo: "The API’s challenge and the new request to the IdP",
        legenda: "HTTP",
        codigo:
          'HTTP/1.1 401 Unauthorized\nWWW-Authenticate: Bearer error="insufficient_user_authentication",\n  error_description="A stronger, more recent authentication is required",\n  acr_values="urn:example:acr:mfa", max_age="300"\n\nGET /authorize?response_type=code&client_id=my-client\n  &redirect_uri=https%3A%2F%2Fapp.example.com%2Fcallback&scope=openid\n  &acr_values=urn%3Aexample%3Aacr%3Amfa&max_age=300\n  &state=<random>&nonce=<random>&code_challenge=<S256>&code_challenge_method=S256 HTTP/1.1\nHost: id.example.com',
        nota: "The first message is the API’s challenge; the second is the new authorization request the app sends. The request line is broken across lines only for readability, and the values in `<>` are illustrative.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Asking is not getting",
        texto:
          "`acr_values` is a request; what counts is the `acr` that **comes back signed** in the token. If the IdP cannot satisfy it, it may return a lower `acr`, and the application or API must **check** `acr`, `auth_time` and, where relevant, `amr` before allowing the operation. Likewise, a requested `max_age` with no `auth_time` in the response must be rejected. The decision stays on the server, reading the validated token: hiding the button in the interface is not step-up. And with `prompt=none`, handle `login_required`, `consent_required` and `interaction_required` by taking the person to an interactive flow, never in a loop.",
      },
    ],
    armadilhas: [
      "Accepting the token without checking `acr`, `auth_time` and `amr`: the IdP may return a level lower than the one requested.",
      "Deciding by `amr` as if it were policy (it only describes the methods used) or assuming a “higher” `acr` is numerically better: use the list of values your IdP documents.",
      "Using `prompt=none` without handling `login_required`, `consent_required` and `interaction_required`, or in an iframe with third-party cookies blocked: silent renewal fails and the app falls into a redirect loop.",
      "Doing step-up only in the interface: the API must require the level and recency in the token, because the client can be manipulated.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `prompt=login` and `max_age`?",
        resposta:
          "`prompt=login` always forces a new authentication. `max_age=N` reauthenticates only if the last authentication is older than N seconds, and obliges the IdP to return `auth_time`, which the application must check.",
      },
      {
        pergunta: "How does an API know the person did MFA recently?",
        resposta:
          "It validates the token and reads `acr`, `amr` and `auth_time` (the IdP includes them in the access token or in introspection). If they are insufficient, it answers 401 with `insufficient_user_authentication` and the desired `acr_values` and `max_age` (RFC 9470), and the client authenticates again.",
      },
    ],
  },
};
