import type { Pergunta } from "../../tipos";

// Q144 · Depurar loop de redirecionamento e cookies
export const q144: Pergunta = {
  numero: 144,
  modulo: "ataques-e-depuracao",
  metodo: "playbook",
  pt: {
    titulo: "Depurar loop de redirecionamento e cookies",
    pergunta:
      "O login entra em loop de redirecionamento ou a sessão não persiste. Como investigar cookies bloqueados ou rejeitados (SameSite, Secure, domínio), proxy reverso e esquema HTTPS?",
    porqueEsteMetodo:
      "Loop de login é um sintoma de várias camadas (navegador, proxy, aplicação, IdP). O playbook percorre o caminho de fora para dentro e isola a camada com evidência em cada salto, em vez de culpar o IdP por palpite.",
    resposta30s:
      "Abra as ferramentas do navegador com o log preservado e siga cada redirecionamento: o loop quase sempre significa que o `Set-Cookie` do callback foi **rejeitado** ou **não volta** na requisição seguinte, então a aplicação acha que você não está logado e manda ao IdP de novo. Confira os atributos do cookie (`Secure`, `SameSite`, `Domain`, tamanho), o **esquema HTTPS atrás do proxy** (`X-Forwarded-Proto`), o estado compartilhado entre réplicas e o relógio, e reproduza com curl para isolar a camada.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook do loop de login",
        passos: [
          {
            titulo: "1. Siga cada salto no navegador",
            texto:
              "DevTools, aba Rede, com “Preservar log” e cache desligado. Para cada resposta 302/303/307 anote `Location`, `Set-Cookie` e, na requisição seguinte, o cabeçalho `Cookie`. Ache o salto em que o ciclo recomeça: normalmente o callback responde com sucesso e `Set-Cookie`, e a requisição seguinte chega **sem** esse cookie, então a aplicação redireciona de novo ao IdP, que ainda tem sessão e devolve o usuário na hora.",
          },
          {
            titulo: "2. Veja se o cookie foi aceito e enviado de volta",
            texto:
              "As ferramentas do navegador marcam o `Set-Cookie` rejeitado e dizem o motivo. Causas: `Secure` em página HTTP; `SameSite=None` sem `Secure`; `Domain` ou `Path` que não cobre a URL seguinte (cookie “host-only” de um subdomínio lido em outro); prefixo `__Host-` sem `Path=/` ou com `Domain`; cookie grande demais (cada cookie tem um limite de cerca de 4 KB na maioria dos navegadores, e tokens e muitas claims o estouram); bloqueio de cookies de terceiros em fluxos com iframe. Atenção: um cookie `SameSite=Lax` **não acompanha** um POST vindo de outro site, o caso do `response_mode=form_post` do OIDC e do binding POST do SAML (veja Q79 e, para o binding POST do SAML, Q59).",
          },
          {
            titulo: "3. Confira o proxy reverso e o esquema HTTPS",
            texto:
              "Se o TLS termina no proxy ou no balanceador, a aplicação enxerga HTTP: monta o `redirect_uri` com `http://`, não envia cookie `Secure`, ou redireciona de HTTP para HTTPS num ciclo sem fim. Verifique se o proxy envia `X-Forwarded-Proto` e `X-Forwarded-Host` (ou `Forwarded`), se o framework confia **só no proxy conhecido** para lê-los e se a URL pública da aplicação está configurada em vez de deduzida.",
          },
          {
            titulo: "4. Confira estado e chaves entre réplicas",
            texto:
              "Sessão, `state`, verificador PKCE e chaves de criptografia do cookie que ficam na memória de cada instância fazem o callback cair numa réplica que não conhece o pedido. Sinal: o problema é intermitente. Solução: armazenamento compartilhado (Redis ou banco) e as mesmas chaves em todas as instâncias; afinidade de sessão é só um paliativo para confirmar a hipótese.",
          },
          {
            titulo: "5. Descarte relógio, ambiente e a lógica de autorização",
            texto:
              "Com o relógio errado, um cookie com `Expires` já nasce vencido e um ID token com `iat` ou `nbf` no futuro é recusado, e a sessão não se forma (veja Q143); prefira `Max-Age`. Compare ambientes: `localhost` versus nome real, HTTP versus HTTPS, extensões, modo anônimo, Safari e Firefox (bloqueios mais rígidos). Um cookie vale para o host, sem separar portas. Por fim, veja a lógica: quem está autenticado mas **sem permissão** deve receber 403, e não ser mandado de volta ao login (esse “desafio” em vez de “proibido” é um clássico gerador de loops); e a própria página de login ou o callback não podem exigir sessão.",
          },
          {
            titulo: "6. Reproduza com curl e isole a camada",
            texto:
              "Siga os redirecionamentos guardando os cookies (`curl -v -L --max-redirs 10 -c jar.txt -b jar.txt`) e compare o que o curl recebe com o que o navegador mostra. Chame a aplicação direto, sem o proxy, acrescentando `X-Forwarded-Proto: https`: se funciona, o problema é do proxy ou da configuração de confiança. Teste o IdP sozinho: ele devolve o code? Assim você sabe se a camada culpada é o navegador, o proxy, a aplicação ou o IdP.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Sintoma → causa provável",
        colunas: ["Sintoma", "Causa provável", "Como confirmar"],
        linhas: [
          [
            "`ERR_TOO_MANY_REDIRECTS` entre `http` e `https`",
            "A aplicação não enxerga HTTPS atrás do proxy e força o redirecionamento",
            "Veja se `X-Forwarded-Proto` chega à aplicação e se ela confia nele",
          ],
          [
            "O callback devolve 302, mas a requisição seguinte não leva `Cookie`",
            "Cookie rejeitado: `Secure` em HTTP, `SameSite=None` sem `Secure`, `Domain`, tamanho",
            "Aviso no `Set-Cookie` (aba Rede) e na aba Aplicativo > Cookies",
          ],
          [
            "Erro de correlação ou de `state` inválido na volta do IdP",
            "O cookie de correlação não foi enviado num POST de outro site (`SameSite=Lax` com `form_post` ou SAML POST), ou outra réplica atendeu",
            "Veja o método do callback, o `SameSite` do cookie e qual instância respondeu",
          ],
          [
            "Funciona numa aba e falha dentro de um iframe ou de outro domínio",
            "Cookies de terceiros bloqueados",
            "Teste fora do iframe e com o IdP e a aplicação sob o mesmo site",
          ],
          [
            "Funciona às vezes",
            "Várias réplicas sem estado compartilhado, ou chaves de cookie diferentes",
            "Fixe o tráfego numa réplica só para comparar",
          ],
          [
            "Usuário autenticado sem permissão cai no loop",
            "A aplicação desafia (manda ao login) em vez de recusar com 403",
            "Veja a resposta da aplicação para um usuário logado sem o papel exigido",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Sessão atrás de proxy, com estado compartilhado",
        legenda: "TypeScript",
        codigo: `import express from "express";
import session from "express-session";

const app = express();
// Atrás de um proxy que termina o TLS: confie só no proxy conhecido (1 salto).
// Sem isto, req.secure é false e o cookie Secure nunca é enviado.
app.set("trust proxy", 1);

app.use(
  session({
    name: "__Host-sid",
    secret: process.env.SESSION_SECRET!,
    store: redisStore, // estado compartilhado entre réplicas
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
  }),
);`,
        nota: "O número de `trust proxy` deve ser a quantidade de proxies na frente da aplicação; `true` confiaria em qualquer cliente que mande o cabeçalho. Se o fluxo usa `form_post` ou SAML POST, o cookie de correlação precisa de `SameSite=None; Secure`, ou o fluxo deve voltar por GET (veja Q79).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não conserte relaxando a segurança",
        texto:
          "Tirar o `Secure`, usar `SameSite=None` sem necessidade, confiar em `X-Forwarded-*` vindo de qualquer origem ou gravar a sessão sem `HttpOnly` faz o loop sumir e abre a aplicação a cookies em HTTP, a CSRF e a cabeçalhos forjados. Faça a menor mudança que corrige a causa que você provou.",
      },
    ],
    armadilhas: [
      "Culpar o IdP quando o problema é o cookie da própria aplicação: o IdP já respondeu com sucesso.",
      "Confiar em `X-Forwarded-*` de qualquer origem (`trust proxy` aberto) em vez de só do proxy conhecido.",
      "Resolver com `SameSite=None` ou removendo `Secure` sem entender o motivo, abrindo CSRF e cookies em HTTP.",
      "Testar só no seu navegador, em `localhost`: extensões, bloqueio de terceiros, Safari e Firefox e a produção atrás de proxy se comportam de outro jeito.",
    ],
    autoteste: [
      {
        pergunta: "Por que o loop começa quando o `Set-Cookie` do callback é rejeitado?",
        resposta:
          "Porque a requisição seguinte chega sem cookie de sessão, a aplicação conclui que o usuário não está autenticado e o manda ao IdP, que ainda tem a sessão dele e o devolve na hora. O ciclo repete até o navegador desistir.",
      },
      {
        pergunta: "Por que um cookie `SameSite=Lax` pode não acompanhar o retorno do IdP com `form_post`?",
        resposta:
          "Porque o retorno é um POST iniciado por outro site, e o `Lax` só envia o cookie em navegações de topo que usam métodos seguros, como GET. A saída é `SameSite=None; Secure` no cookie de correlação, ou voltar por GET.",
      },
    ],
  },
  en: {
    titulo: "Debugging redirect loops and cookies",
    pergunta:
      "Login enters a redirect loop or the session does not persist. How do you investigate blocked or rejected cookies (SameSite, Secure, domain), reverse proxies and the HTTPS scheme?",
    porqueEsteMetodo:
      "A login loop is a symptom that can come from several layers (browser, proxy, application, IdP). The playbook walks the path from the outside in and isolates the layer with evidence at each hop, instead of blaming the IdP by hunch.",
    resposta30s:
      "Open the browser tools with the log preserved and follow every redirect: the loop almost always means the callback’s `Set-Cookie` was **rejected** or **does not come back** on the next request, so the application thinks you are not logged in and sends you to the IdP again. Check the cookie attributes (`Secure`, `SameSite`, `Domain`, size), the **HTTPS scheme behind the proxy** (`X-Forwarded-Proto`), the state shared across replicas and the clock, and reproduce with curl to isolate the layer.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Login loop playbook",
        passos: [
          {
            titulo: "1. Follow every hop in the browser",
            texto:
              "DevTools, Network tab, with “Preserve log” on and the cache disabled. For each 302/303/307 response note `Location`, `Set-Cookie` and, on the next request, the `Cookie` header. Find the hop where the cycle restarts: usually the callback answers successfully with a `Set-Cookie`, and the next request arrives **without** that cookie, so the application redirects to the IdP again, which still has a session and sends the user straight back.",
          },
          {
            titulo: "2. See whether the cookie was accepted and sent back",
            texto:
              "The browser tools flag a rejected `Set-Cookie` and give the reason. Causes: `Secure` on an HTTP page; `SameSite=None` without `Secure`; a `Domain` or `Path` that does not cover the next URL (a host-only cookie from one subdomain read on another); a `__Host-` prefix without `Path=/` or with a `Domain`; a cookie that is too big (each cookie is limited to about 4 KB in most browsers, and tokens and many claims blow past it); third-party cookie blocking in iframe flows. Careful: a `SameSite=Lax` cookie is **not sent** on a POST coming from another site, which is the case with OIDC `response_mode=form_post` and the SAML POST binding (see Q79 and, for the SAML POST binding, Q59).",
          },
          {
            titulo: "3. Check the reverse proxy and the HTTPS scheme",
            texto:
              "If TLS terminates at the proxy or load balancer, the application sees HTTP: it builds the `redirect_uri` with `http://`, does not send a `Secure` cookie, or redirects from HTTP to HTTPS in an endless cycle. Check that the proxy sends `X-Forwarded-Proto` and `X-Forwarded-Host` (or `Forwarded`), that the framework trusts **only the known proxy** to read them and that the application’s public URL is configured rather than inferred.",
          },
          {
            titulo: "4. Check state and keys across replicas",
            texto:
              "Session, `state`, PKCE verifier and cookie encryption keys kept in each instance’s memory make the callback land on a replica that does not know the request. Sign: the problem is intermittent. Fix: shared storage (Redis or a database) and the same keys on every instance; session affinity is only a stopgap to confirm the hypothesis.",
          },
          {
            titulo: "5. Rule out clock, environment and authorization logic",
            texto:
              "With a wrong clock, a cookie with `Expires` is born already expired and an ID token with `iat` or `nbf` in the future is rejected, so the session never forms (see Q143); prefer `Max-Age`. Compare environments: `localhost` versus a real name, HTTP versus HTTPS, extensions, incognito mode, Safari and Firefox (stricter blocking). A cookie applies to the host, without separating ports. Finally, look at the logic: someone authenticated but **without permission** should get a 403, not be sent back to login (that “challenge” instead of “forbid” is a classic loop generator); and the login page and the callback themselves must not require a session.",
          },
          {
            titulo: "6. Reproduce with curl and isolate the layer",
            texto:
              "Follow the redirects keeping the cookies (`curl -v -L --max-redirs 10 -c jar.txt -b jar.txt`) and compare what curl receives with what the browser shows. Call the application directly, bypassing the proxy and adding `X-Forwarded-Proto: https`: if it works, the problem is the proxy or the trust configuration. Test the IdP on its own: does it return the code? That tells you whether the culprit layer is the browser, the proxy, the application or the IdP.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Symptom → likely cause",
        colunas: ["Symptom", "Likely cause", "How to confirm"],
        linhas: [
          [
            "`ERR_TOO_MANY_REDIRECTS` between `http` and `https`",
            "The application does not see HTTPS behind the proxy and forces the redirect",
            "Check whether `X-Forwarded-Proto` reaches the application and whether it trusts it",
          ],
          [
            "The callback returns 302, but the next request carries no `Cookie`",
            "Rejected cookie: `Secure` over HTTP, `SameSite=None` without `Secure`, `Domain`, size",
            "The warning on the `Set-Cookie` (Network tab) and in the Application > Cookies tab",
          ],
          [
            "Correlation error or invalid `state` on the return from the IdP",
            "The correlation cookie was not sent on a cross-site POST (`SameSite=Lax` with `form_post` or SAML POST), or another replica answered",
            "Check the callback method, the cookie’s `SameSite` and which instance responded",
          ],
          [
            "Works in a tab and fails inside an iframe or on another domain",
            "Third-party cookies blocked",
            "Test outside the iframe and with the IdP and the application under the same site",
          ],
          [
            "Works sometimes",
            "Several replicas without shared state, or different cookie keys",
            "Pin the traffic to one replica to compare",
          ],
          [
            "An authenticated user without permission falls into the loop",
            "The application challenges (sends to login) instead of refusing with 403",
            "Look at the application’s response for a logged-in user without the required role",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A session behind a proxy, with shared state",
        legenda: "TypeScript",
        codigo: `import express from "express";
import session from "express-session";

const app = express();
// Behind a proxy that terminates TLS: trust only the known proxy (1 hop).
// Without this, req.secure is false and the Secure cookie is never sent.
app.set("trust proxy", 1);

app.use(
  session({
    name: "__Host-sid",
    secret: process.env.SESSION_SECRET!,
    store: redisStore, // state shared across replicas
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
  }),
);`,
        nota: "The `trust proxy` number must be the count of proxies in front of the application; `true` would trust any client that sends the header. If the flow uses `form_post` or SAML POST, the correlation cookie needs `SameSite=None; Secure`, or the flow must come back by GET (see Q79).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Do not fix it by relaxing security",
        texto:
          "Dropping `Secure`, using `SameSite=None` without need, trusting `X-Forwarded-*` from any origin or writing the session without `HttpOnly` makes the loop disappear and opens the application to cookies over HTTP, to CSRF and to forged headers. Make the smallest change that fixes the cause you proved.",
      },
    ],
    armadilhas: [
      "Blaming the IdP when the problem is the application’s own cookie: the IdP already answered successfully.",
      "Trusting `X-Forwarded-*` from any origin (an open `trust proxy`) instead of only from the known proxy.",
      "Fixing it with `SameSite=None` or by removing `Secure` without understanding why, opening CSRF and cookies over HTTP.",
      "Testing only in your own browser on `localhost`: extensions, third-party blocking, Safari and Firefox and production behind a proxy all behave differently.",
    ],
    autoteste: [
      {
        pergunta: "Why does the loop start when the callback’s `Set-Cookie` is rejected?",
        resposta:
          "Because the next request arrives without the session cookie, the application concludes the user is not authenticated and sends them to the IdP, which still has their session and sends them back right away. The cycle repeats until the browser gives up.",
      },
      {
        pergunta: "Why might a `SameSite=Lax` cookie not accompany the return from the IdP with `form_post`?",
        resposta:
          "Because the return is a POST initiated by another site, and `Lax` only sends the cookie on top-level navigations that use safe methods such as GET. The way out is `SameSite=None; Secure` on the correlation cookie, or coming back by GET.",
      },
    ],
  },
};
