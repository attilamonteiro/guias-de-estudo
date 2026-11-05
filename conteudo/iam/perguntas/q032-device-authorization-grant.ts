import type { Pergunta } from "../../tipos";

// Q32 · Device Authorization Grant
export const q032: Pergunta = {
  numero: 32,
  modulo: "oauth",
  metodo: "trace",
  pt: {
    titulo: "Device Authorization Grant",
    pergunta:
      "Como funciona o Device Authorization Grant? Descreva o fluxo para uma TV ou CLI sem navegador e os riscos desse modelo.",
    porqueEsteMetodo:
      "O fluxo envolve dois aparelhos que não se falam diretamente e um laço de espera. Seguir uma TV (ou CLI) do código na tela até o token mostra cada resposta do servidor e onde o modelo é atacado.",
    resposta30s:
      "No **Device Authorization Grant** (RFC 8628), o dispositivo pede um `device_code` e um `user_code`, mostra uma URL e o código curto, e a pessoa confirma **em outro aparelho** que tenha navegador, enquanto o dispositivo faz **polling** no `/token`, respeitando o `interval`, até receber os tokens. O principal risco é o **phishing do código**: enganar alguém para aprovar o código de **outro** dispositivo, que então recebe os tokens da vítima.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma TV (ou CLI) entrando na conta",
        etapas: [
          "**Pedido.** O dispositivo chama o endpoint de autorização de dispositivo com `client_id` e `scope`. Não há redirecionamento nem navegador nesta etapa",
          "**Resposta.** O AS devolve `device_code` (longo, secreto, só do dispositivo), `user_code` (curto e legível, para digitar), `verification_uri` (e talvez `verification_uri_complete`), `expires_in` e `interval`",
          "**Instrução ao usuário.** O dispositivo mostra a URL e o código (ou um QR com a URL completa) e começa a esperar",
          "**Aprovação em outro aparelho.** A pessoa abre a URL no celular ou no computador, entra (senha, MFA, SSO), digita o `user_code`, vê **qual aplicativo** pede acesso e com quais escopos, e aprova ou nega",
          "**Polling.** Enquanto isso, o dispositivo chama o `/token` com `grant_type=urn:ietf:params:oauth:grant-type:device_code` e o `device_code`, no máximo uma vez a cada `interval` segundos",
          "**Resultado.** `authorization_pending`: ainda não decidiu, continue. `slow_down`: aumente o intervalo em 5 segundos. `access_denied`: a pessoa negou. `expired_token`: o código expirou, recomece. Aprovado: `200` com os tokens",
        ],
      },
      {
        tipo: "codigo",
        titulo: "O pedido ao endpoint de dispositivo e a resposta",
        legenda: "HTTP",
        codigo: [
          "POST /oauth2/device_authorization HTTP/1.1",
          "Host: auth.exemplo.com",
          "Content-Type: application/x-www-form-urlencoded",
          "",
          "client_id=meucli&scope=faturas.read",
          "",
          "HTTP/1.1 200 OK",
          "Content-Type: application/json",
          "",
          "{",
          '  "device_code": "GmRhmhcxhwAzkoEqiMEg_DnyEysNkuNhszIySk9eS",',
          '  "user_code": "WDJB-MJHT",',
          '  "verification_uri": "https://auth.exemplo.com/device",',
          '  "verification_uri_complete": "https://auth.exemplo.com/device?user_code=WDJB-MJHT",',
          '  "expires_in": 900,',
          '  "interval": 5',
          "}",
        ].join("\n"),
        nota: "O `device_code` nunca aparece na tela: só o `user_code` e a URL. O `user_code` é curto de propósito, para ser digitado, e por isso o servidor limita as tentativas. O caminho do endpoint varia conforme o provedor.",
      },
      {
        tipo: "codigo",
        titulo: "O laço de polling que respeita o intervalo",
        legenda: "TypeScript",
        codigo: [
          "export async function esperarAprovacao(d: { device_code: string; expires_in: number; interval?: number }) {",
          "  let intervaloMs = (d.interval ?? 5) * 1000; // padrão da RFC 8628 quando ausente",
          "  const limite = Date.now() + d.expires_in * 1000;",
          "  while (Date.now() < limite) {",
          "    await new Promise((r) => setTimeout(r, intervaloMs));",
          '    const resp = await fetch("https://auth.exemplo.com/oauth2/token", {',
          '      method: "POST",',
          "      body: new URLSearchParams({",
          '        grant_type: "urn:ietf:params:oauth:grant-type:device_code",',
          "        device_code: d.device_code,",
          '        client_id: "meucli",',
          "      }),",
          "    });",
          "    const corpo = await resp.json();",
          "    if (resp.ok) return corpo; // access_token e, talvez, refresh_token",
          '    if (corpo.error === "authorization_pending") continue; // ainda não decidiu',
          '    if (corpo.error === "slow_down") intervaloMs += 5000; // +5 s para este e os próximos',
          "    else throw new Error(corpo.error); // access_denied, expired_token...",
          "  }",
          '  throw new Error("expired_token");',
          "}",
        ].join("\n"),
        nota: "Polling mais rápido que o `interval` é recusado com `slow_down`, e um laço sem prazo final nunca termina se a pessoa abandonar o fluxo.",
      },
      {
        tipo: "passos",
        titulo: "Onde o modelo é atacado",
        passos: [
          {
            titulo: "Phishing do código de usuário",
            texto:
              "O atacante inicia o fluxo no dispositivo dele, obtém um `user_code` legítimo e convence a vítima (mensagem, ligação, falso “suporte”) a abrir a URL verdadeira, entrar e digitar esse código. O dispositivo do atacante, que espera no `/token`, recebe os tokens da vítima. A tela de login é a verdadeira; o engano está em **quem pediu o código**.",
          },
          {
            titulo: "A defesa do usuário e do administrador",
            texto:
              "Só digite um código que **você acabou de pedir** no seu aparelho e confira o nome do aplicativo e os escopos. Administradores podem desabilitar ou restringir o device flow onde ele não é necessário (por exemplo, por políticas de acesso condicional do provedor) e exigir clients registrados e conhecidos.",
          },
          {
            titulo: "Força bruta do `user_code`",
            texto:
              "Como o código é curto, o atacante tenta adivinhar o de outra pessoa. Defesa: entropia suficiente, alfabeto sem caracteres ambíguos, expiração curta e limite de tentativas por usuário e por origem.",
          },
          {
            titulo: "Polling abusivo e `device_code` vazado",
            texto:
              "Um client que insiste sem esperar sobrecarrega o servidor, e um `device_code` visto por terceiros permite que eles coletem o token. Defesa: `slow_down` e limites de taxa, `device_code` longo, secreto e de vida curta, nunca exibido nem registrado em log.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Quando usar, e o que dizer de fluxos cross-device",
        texto:
          "O device flow troca “este aparelho tem navegador” por “a pessoa tem outro aparelho”. O dispositivo não sabe **quem** aprova e a pessoa não sabe **qual** dispositivo pediu: tudo depende de a pessoa comparar. Por isso, onde o aparelho consegue abrir um navegador (inclusive uma CLI no seu notebook, que pode usar authorization code com PKCE e redirecionamento de loopback), prefira esse fluxo; para TVs e CLIs em servidores remotos, o device flow é a escolha certa, com as defesas acima. Existe orientação do IETF específica para fluxos entre dispositivos (cross-device): se a pergunta citar a RFC 10027, confirme o número e o texto no site do RFC Editor. Em termos gerais, os temas são a verificação de que o pedido é legítimo, o contexto mostrado na hora de aprovar, a proximidade entre os aparelhos e os limites de tempo e de tentativas.",
      },
    ],
    armadilhas: [
      "Aprovar um código que alguém lhe enviou ou ditou, em vez de um que você acabou de pedir no seu aparelho: é exatamente o phishing do device flow.",
      "Ignorar o `interval` e o `slow_down`, ou não limitar o tempo total: o servidor recusa e o laço pode nunca terminar.",
      "Mostrar ou registrar o `device_code`: só o `user_code` e a URL são para a pessoa; o `device_code` é o segredo do dispositivo.",
      "Usar o device flow onde há navegador (app desktop, CLI local) por conveniência: aumenta a exposição a phishing sem necessidade.",
    ],
    autoteste: [
      {
        pergunta: "Que códigos o AS devolve no Device Authorization Grant e para que serve cada um?",
        resposta:
          "O `device_code` é secreto e usado só pelo dispositivo no polling do `/token`. O `user_code` é curto e digitado pela pessoa em outro aparelho para ligar a aprovação ao dispositivo. Também vêm a URL de verificação, o prazo e o intervalo.",
      },
      {
        pergunta: "Como funciona o ataque de phishing do device flow e como o usuário se protege?",
        resposta:
          "O atacante inicia o fluxo, obtém um `user_code` e leva a vítima a aprová-lo; o dispositivo dele recebe os tokens dela. O usuário se protege digitando só códigos que ele mesmo pediu e conferindo o aplicativo e os escopos na tela de aprovação.",
      },
    ],
  },
  en: {
    titulo: "Device Authorization Grant",
    pergunta:
      "How does the Device Authorization Grant work? Describe the flow for a TV or CLI without a browser, and the risks of this model.",
    porqueEsteMetodo:
      "The flow involves two devices that do not talk to each other and a waiting loop. Following a TV (or CLI) from the code on screen to the token shows every server response and where the model gets attacked.",
    resposta30s:
      "In the **Device Authorization Grant** (RFC 8628), the device asks for a `device_code` and a `user_code`, shows a URL and the short code, and the person confirms **on another device** that has a browser, while the device **polls** `/token`, respecting the `interval`, until it receives the tokens. The main risk is **code phishing**: tricking someone into approving the code of **another** device, which then receives the victim’s tokens.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A TV (or CLI) signing in to the account",
        etapas: [
          "**Request.** The device calls the device authorization endpoint with `client_id` and `scope`. There is no redirect and no browser in this step",
          "**Response.** The AS returns `device_code` (long, secret, only for the device), `user_code` (short and readable, to be typed), `verification_uri` (and maybe `verification_uri_complete`), `expires_in` and `interval`",
          "**Instruction to the user.** The device shows the URL and the code (or a QR code with the full URL) and starts waiting",
          "**Approval on another device.** The person opens the URL on a phone or computer, signs in (password, MFA, SSO), types the `user_code`, sees **which application** is asking for access and with which scopes, and approves or denies",
          "**Polling.** Meanwhile, the device calls `/token` with `grant_type=urn:ietf:params:oauth:grant-type:device_code` and the `device_code`, at most once every `interval` seconds",
          "**Result.** `authorization_pending`: not decided yet, keep going. `slow_down`: increase the interval by 5 seconds. `access_denied`: the person refused. `expired_token`: the code expired, start over. Approved: `200` with the tokens",
        ],
      },
      {
        tipo: "codigo",
        titulo: "The request to the device endpoint and the response",
        legenda: "HTTP",
        codigo: [
          "POST /oauth2/device_authorization HTTP/1.1",
          "Host: auth.exemplo.com",
          "Content-Type: application/x-www-form-urlencoded",
          "",
          "client_id=meucli&scope=faturas.read",
          "",
          "HTTP/1.1 200 OK",
          "Content-Type: application/json",
          "",
          "{",
          '  "device_code": "GmRhmhcxhwAzkoEqiMEg_DnyEysNkuNhszIySk9eS",',
          '  "user_code": "WDJB-MJHT",',
          '  "verification_uri": "https://auth.exemplo.com/device",',
          '  "verification_uri_complete": "https://auth.exemplo.com/device?user_code=WDJB-MJHT",',
          '  "expires_in": 900,',
          '  "interval": 5',
          "}",
        ].join("\n"),
        nota: "The `device_code` never appears on screen: only the `user_code` and the URL do. The `user_code` is short on purpose, so it can be typed, which is why the server limits attempts. The endpoint path varies by provider.",
      },
      {
        tipo: "codigo",
        titulo: "The polling loop that respects the interval",
        legenda: "TypeScript",
        codigo: [
          "export async function waitForApproval(d: { device_code: string; expires_in: number; interval?: number }) {",
          "  let intervalMs = (d.interval ?? 5) * 1000; // RFC 8628 default when absent",
          "  const deadline = Date.now() + d.expires_in * 1000;",
          "  while (Date.now() < deadline) {",
          "    await new Promise((r) => setTimeout(r, intervalMs));",
          '    const resp = await fetch("https://auth.exemplo.com/oauth2/token", {',
          '      method: "POST",',
          "      body: new URLSearchParams({",
          '        grant_type: "urn:ietf:params:oauth:grant-type:device_code",',
          "        device_code: d.device_code,",
          '        client_id: "meucli",',
          "      }),",
          "    });",
          "    const body = await resp.json();",
          "    if (resp.ok) return body; // access_token and, maybe, refresh_token",
          '    if (body.error === "authorization_pending") continue; // not decided yet',
          '    if (body.error === "slow_down") intervalMs += 5000; // +5 s for this and later requests',
          "    else throw new Error(body.error); // access_denied, expired_token...",
          "  }",
          '  throw new Error("expired_token");',
          "}",
        ].join("\n"),
        nota: "Polling faster than `interval` is rejected with `slow_down`, and a loop with no final deadline never ends if the person abandons the flow.",
      },
      {
        tipo: "passos",
        titulo: "Where the model gets attacked",
        passos: [
          {
            titulo: "User-code phishing",
            texto:
              "The attacker starts the flow on their own device, gets a legitimate `user_code` and persuades the victim (a message, a call, a fake “support” agent) to open the real URL, sign in and type that code. The attacker’s device, waiting at `/token`, receives the victim’s tokens. The sign-in page is the real one; the deception is in **who requested the code**.",
          },
          {
            titulo: "The user’s and the administrator’s defense",
            texto:
              "Only type a code that **you just requested** on your own device, and check the application name and scopes. Administrators can disable or restrict the device flow where it is not needed (for example, through the provider’s conditional-access policies) and require registered, known clients.",
          },
          {
            titulo: "Brute force on the `user_code`",
            texto:
              "Because the code is short, the attacker tries to guess someone else’s. Defense: enough entropy, an alphabet without ambiguous characters, short expiry and a limit on attempts per user and per origin.",
          },
          {
            titulo: "Abusive polling and a leaked `device_code`",
            texto:
              "A client that insists without waiting overloads the server, and a `device_code` seen by third parties lets them collect the token. Defense: `slow_down` and rate limits, a long, secret, short-lived `device_code`, never displayed or logged.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "When to use it, and what to say about cross-device flows",
        texto:
          "The device flow swaps “this device has a browser” for “the person has another device”. The device does not know **who** approves and the person does not know **which** device asked: everything depends on the person comparing. So where the device can open a browser (including a CLI on your laptop, which can use authorization code with PKCE and a loopback redirect), prefer that flow; for TVs and CLIs on remote servers, the device flow is the right choice, with the defenses above. The IETF has guidance specific to cross-device flows: if the question cites RFC 10027, confirm the number and the text on the RFC Editor site. In general terms, the themes are verifying that the request is legitimate, the context shown at approval time, the proximity between the devices and the limits on time and attempts.",
      },
    ],
    armadilhas: [
      "Approving a code someone sent or dictated to you, instead of one you just requested on your own device: that is exactly the device-flow phishing.",
      "Ignoring `interval` and `slow_down`, or not bounding the total time: the server rejects you and the loop may never end.",
      "Displaying or logging the `device_code`: only the `user_code` and the URL are for the person; the `device_code` is the device’s secret.",
      "Using the device flow where a browser exists (a desktop app, a local CLI) out of convenience: it increases phishing exposure for no reason.",
    ],
    autoteste: [
      {
        pergunta: "Which codes does the AS return in the Device Authorization Grant and what is each one for?",
        resposta:
          "The `device_code` is secret and used only by the device when polling `/token`. The `user_code` is short and typed by the person on another device to link the approval to the device. The verification URL, the expiry and the interval also come back.",
      },
      {
        pergunta: "How does the device-flow phishing attack work, and how does the user protect themselves?",
        resposta:
          "The attacker starts the flow, gets a `user_code` and leads the victim to approve it; the attacker’s device receives the victim’s tokens. The user protects themselves by typing only codes they requested themselves and checking the application and scopes on the approval screen.",
      },
    ],
  },
};
