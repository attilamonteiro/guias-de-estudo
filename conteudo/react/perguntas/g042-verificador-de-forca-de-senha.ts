import type { Pergunta } from "../../tipos";

// G42 · Verificador de força de senha
export const g042: Pergunta = {
  numero: 342,
  modulo: "glassdoor-exercicios",
  metodo: "playbook",
  pt: {
    titulo: "Verificador de força de senha",
    pergunta: "Construa um formulário de verificação da força de senha em React.",
    porqueEsteMetodo:
      "É um exercício com ordem natural de construção e com um fim que vale mais que o código: saber os limites do que se construiu. Um playbook leva do contrato ao campo, à função que pontua, ao indicador acessível e à segurança, cada etapa com seu critério de pronto.",
    resposta30s:
      "Use um **input controlado** e uma **função pura** `avaliarSenha(senha)` que pontua tamanho, variedade e padrões comuns e devolve um nível; o nível é **derivado** na renderização, sem estado extra. Mostre o resultado com **texto além da cor**, numa região acessível, e um botão para **mostrar a senha**. Lembre que regras ingênuas são só uma estimativa (bibliotecas como `zxcvbn` avaliam melhor), que a senha **não deve ser registrada em log nem enviada sem necessidade**, e que a validação final é do **servidor**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: do contrato ao servidor",
        passos: [
          {
            titulo: "1. Defina o contrato",
            texto:
              "Decida o que o componente promete: um **indicador orientativo** (níveis como fraca, razoável, boa e forte) com dicas, e não uma garantia. Quem decide se a senha é aceita é o servidor. Critério: a interface diz “força estimada”, nunca “senha segura”.",
          },
          {
            titulo: "2. Campo controlado e botão de mostrar",
            texto:
              'Um `useState(\'\')` para a senha e outro para `mostrar`; o `type` alterna entre `password` e `text`. O botão tem `type="button"` (para não enviar o formulário), `aria-pressed` e nome claro. Use `<label>`, `autoComplete="new-password"` no cadastro e **não bloqueie colar**: gerenciadores de senha dependem disso. Critério: um gerenciador de senhas preenche o campo e o botão alterna sem enviar o formulário.',
          },
          {
            titulo: "3. Função pura que pontua",
            texto:
              "Fora do componente, `avaliarSenha(senha)` devolve o nível: pontua o **tamanho** (peso maior), a **variedade** de caracteres (minúsculas, maiúsculas, dígitos, símbolos) e zera os **padrões comuns** (`123456`, `password`, `qwerty`, repetições como `aaaa`, sequências, senha igual ao nome ou ao e-mail). Mesma entrada, mesma saída, sem React. Critério: uma tabela de casos testa a função isolada.",
          },
          {
            titulo: "4. Derive, não armazene",
            texto:
              "O nível sai da senha a cada renderização (`avaliarSenha(senha)`). Não crie um estado `forca` sincronizado por `useEffect`: seriam dois estados para manter coerentes e um render com o valor atrasado. Se a avaliação ficar cara (uma biblioteca grande), carregue-a com `import()` sob demanda e avalie com debounce (veja G44). Critério: não existe `useState` para o nível.",
          },
          {
            titulo: "5. Indicador acessível",
            texto:
              'Mostre uma barra com segmentos **e o nível em texto** (“Força estimada: boa”), mais as dicas do que falta. Ligue o texto ao campo com `aria-describedby` e anuncie por uma região `role="status"`: como o texto só muda quando o nível muda, o leitor de tela não fala a cada tecla. A cor ajuda, mas nunca é o único sinal, e o contraste vale nos dois temas. Critério: dá para usar sem enxergar cores.',
          },
          {
            titulo: "6. Segurança e validação final",
            texto:
              "A senha é dado sensível: sem `console.log`, sem enviá-la a analytics ou a ferramentas de gravação de sessão (mascare o campo), sem `localStorage`, e avalie no navegador em vez de mandá-la ao servidor a cada tecla. No envio, use HTTPS e deixe o servidor validar de verdade (tamanho mínimo, senha já vazada, limite de tentativas) e guardar só um **hash lento com sal** (assunto de backend). Critério: a senha só sai do navegador no envio do formulário.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A função pura que pontua",
        legenda: "TSX",
        codigo: [
          'const COMUNS = new Set(["123456", "password", "qwerty", "senha123", "abc123"]);',
          'const NIVEIS = ["fraca", "razoável", "boa", "forte"] as const;',
          "",
          "export function avaliarSenha(senha: string) {",
          "  const classes = [/[a-z]/, /[A-Z]/, /\\d/, /[^A-Za-z0-9]/].filter((r) => r.test(senha)).length;",
          "  let pontos = (senha.length >= 8 ? 1 : 0) + (senha.length >= 12 ? 1 : 0);",
          "  if (senha.length >= 16) pontos += 1;",
          "  if (classes >= 3) pontos += 1;",
          "  if (COMUNS.has(senha.toLowerCase()) || /^(.)\\1*$/.test(senha)) pontos = 0; // comuns e repetições",
          "  return { nivel: NIVEIS[Math.min(pontos, 3)], pontos };",
          "}",
        ].join("\n"),
        nota: "Pontuação de exemplo, para mostrar a forma da função; os pesos são arbitrários e a lista de senhas comuns é só uma amostra.",
      },
      {
        tipo: "codigo",
        titulo: "O campo, derivando o nível",
        legenda: "TSX",
        codigo: [
          "export function CampoDeSenha() {",
          '  const [senha, setSenha] = useState("");',
          "  const [mostrar, setMostrar] = useState(false);",
          "  const { nivel } = avaliarSenha(senha); // derivado: sem estado extra",
          "",
          "  return (",
          "    <div>",
          '      <label htmlFor="senha">Senha</label>',
          '      <input id="senha" type={mostrar ? "text" : "password"} value={senha}',
          '        autoComplete="new-password" aria-describedby="forca"',
          "        onChange={(e) => setSenha(e.target.value)} />",
          '      <button type="button" aria-pressed={mostrar} onClick={() => setMostrar((m) => !m)}>',
          "        Mostrar senha",
          "      </button>",
          '      <p id="forca" role="status">{senha && `Força estimada: ${nivel}`}</p>',
          "    </div>",
          "  );",
          "}",
        ].join("\n"),
        nota: "Imports de `react` omitidos. A barra de segmentos é decorativa (`aria-hidden`): o texto do nível carrega a informação.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra: o cliente orienta, o servidor decide",
        texto:
          "O indicador existe para ajudar quem digita; ele roda no navegador, que o usuário controla, então nunca é uma barreira. A decisão final (tamanho mínimo, checagem contra senhas vazadas, limite de tentativas, hash lento) é do servidor. Regras de composição (“uma maiúscula, um símbolo”) dão falsa segurança: `Senha@123` as cumpre e é fraca, enquanto uma frase longa é boa. Diretrizes atuais de autenticação, como as do NIST, valorizam mais o comprimento e a checagem contra senhas vazadas do que a composição obrigatória.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Regras ingênuas têm limite",
        texto:
          "A função acima conta tamanho e variedade e conhece poucas senhas comuns: `abcdefghijkl1` sairia como “boa” sem ser. Bibliotecas como `zxcvbn` estimam a força com dicionários, padrões de teclado, datas e substituições (`a` por `@`) e dão dicas melhores, ao custo de um pacote grande: carregue-as sob demanda. Mesmo assim é uma estimativa, não uma prova.",
      },
    ],
    armadilhas: [
      "Tratar o indicador como segurança: o cliente é contornável, e a validação final é do servidor.",
      "Mostrar a força só por cor, sem texto, ou anunciar a cada tecla para leitores de tela.",
      "Guardar `forca` num estado extra atualizado por `useEffect`: derive do valor da senha na renderização.",
      "Registrar, enviar ou persistir a senha sem necessidade (`console.log`, analytics, `localStorage`, requisição a cada tecla), ou impedir colar e o `autoComplete`.",
    ],
    autoteste: [
      {
        pergunta: "Por que `Senha@123` passa nas regras de composição e ainda assim é fraca?",
        resposta:
          "Porque as regras só contam tipos de caracteres (maiúscula, dígito, símbolo), e a senha segue um padrão previsível que está em qualquer dicionário de senhas comuns. Bibliotecas como `zxcvbn` reconhecem palavras, sequências e substituições; o comprimento e a imprevisibilidade importam mais.",
      },
      {
        pergunta: "Por que o nível não precisa de `useState` nem de `useEffect`?",
        resposta:
          "Porque é uma função pura da senha, que já está em estado: calculado na renderização, o nível nunca fica fora de sincronia. Um estado extra duplicaria a informação e causaria um render com o valor atrasado.",
      },
    ],
  },
  en: {
    titulo: "Password strength checker",
    pergunta: "Build a password strength checking form in React.",
    porqueEsteMetodo:
      "This is an exercise with a natural build order and an ending that matters more than the code: knowing the limits of what you built. A playbook goes from the contract to the field, the scoring function, the accessible indicator and security, each step with its own done criterion.",
    resposta30s:
      "Use a **controlled input** and a **pure function** `evaluatePassword(password)` that scores length, variety and common patterns and returns a level; the level is **derived** at render time, with no extra state. Show the result with **text in addition to color**, in an accessible region, plus a **show password** button. Remember that naive rules are only an estimate (libraries such as `zxcvbn` do better), that the password **must not be logged or sent unless necessary**, and that final validation belongs to the **server**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from contract to server",
        passos: [
          {
            titulo: "1. Define the contract",
            texto:
              "Decide what the component promises: an **advisory indicator** (levels such as weak, fair, good and strong) with tips, not a guarantee. The server decides whether a password is accepted. Criterion: the interface says “estimated strength”, never “secure password”.",
          },
          {
            titulo: "2. Controlled field and show button",
            texto:
              'One `useState(\'\')` for the password and another for `show`; the `type` toggles between `password` and `text`. The button has `type="button"` (so it does not submit the form), `aria-pressed` and a clear name. Use a `<label>`, `autoComplete="new-password"` on sign-up and **do not block pasting**: password managers depend on it. Criterion: a password manager fills the field and the button toggles without submitting the form.',
          },
          {
            titulo: "3. A pure scoring function",
            texto:
              "Outside the component, `evaluatePassword(password)` returns the level: it scores **length** (heavier weight), **variety** of characters (lowercase, uppercase, digits, symbols) and zeroes out **common patterns** (`123456`, `password`, `qwerty`, repeats such as `aaaa`, sequences, a password equal to the name or e-mail). Same input, same output, no React. Criterion: a table of cases tests the function in isolation.",
          },
          {
            titulo: "4. Derive, do not store",
            texto:
              "The level comes from the password on every render (`evaluatePassword(password)`). Do not create a `strength` state synced by `useEffect`: that would be two states to keep consistent and a render with a lagging value. If the evaluation gets expensive (a large library), load it on demand with `import()` and evaluate with a debounce (see G44). Criterion: there is no `useState` for the level.",
          },
          {
            titulo: "5. Accessible indicator",
            texto:
              'Show a segmented bar **and the level as text** (“Estimated strength: good”), plus tips about what is missing. Tie the text to the field with `aria-describedby` and announce it through a `role="status"` region: since the text only changes when the level changes, a screen reader does not speak on every keystroke. Color helps but is never the only signal, and contrast holds in both themes. Criterion: it is usable without seeing colors.',
          },
          {
            titulo: "6. Security and final validation",
            texto:
              "The password is sensitive data: no `console.log`, no sending it to analytics or session-recording tools (mask the field), no `localStorage`, and evaluate in the browser instead of sending it to the server on every keystroke. On submit, use HTTPS and let the server really validate (minimum length, already-leaked passwords, attempt limits) and store only a **slow, salted hash** (a backend subject). Criterion: the password only leaves the browser when the form is submitted.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The pure scoring function",
        legenda: "TSX",
        codigo: [
          'const COMMON = new Set(["123456", "password", "qwerty", "letmein1", "abc123"]);',
          'const LEVELS = ["weak", "fair", "good", "strong"] as const;',
          "",
          "export function evaluatePassword(password: string) {",
          "  const classes = [/[a-z]/, /[A-Z]/, /\\d/, /[^A-Za-z0-9]/].filter((r) => r.test(password)).length;",
          "  let points = (password.length >= 8 ? 1 : 0) + (password.length >= 12 ? 1 : 0);",
          "  if (password.length >= 16) points += 1;",
          "  if (classes >= 3) points += 1;",
          "  if (COMMON.has(password.toLowerCase()) || /^(.)\\1*$/.test(password)) points = 0; // common and repeats",
          "  return { level: LEVELS[Math.min(points, 3)], points };",
          "}",
        ].join("\n"),
        nota: "Example scoring, to show the shape of the function; the weights are arbitrary and the common-password list is only a sample.",
      },
      {
        tipo: "codigo",
        titulo: "The field, deriving the level",
        legenda: "TSX",
        codigo: [
          "export function PasswordField() {",
          '  const [password, setPassword] = useState("");',
          "  const [show, setShow] = useState(false);",
          "  const { level } = evaluatePassword(password); // derived: no extra state",
          "",
          "  return (",
          "    <div>",
          '      <label htmlFor="password">Password</label>',
          '      <input id="password" type={show ? "text" : "password"} value={password}',
          '        autoComplete="new-password" aria-describedby="strength"',
          "        onChange={(e) => setPassword(e.target.value)} />",
          '      <button type="button" aria-pressed={show} onClick={() => setShow((s) => !s)}>',
          "        Show password",
          "      </button>",
          '      <p id="strength" role="status">{password && `Estimated strength: ${level}`}</p>',
          "    </div>",
          "  );",
          "}",
        ].join("\n"),
        nota: "`react` imports omitted. The segmented bar is decorative (`aria-hidden`): the level text carries the information.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule: the client guides, the server decides",
        texto:
          "The indicator exists to help whoever is typing; it runs in the browser, which the user controls, so it is never a barrier. The final decision (minimum length, check against leaked passwords, attempt limits, slow hashing) belongs to the server. Composition rules (“one uppercase letter, one symbol”) give false security: `Password@123` meets them and is weak, while a long phrase is good. Current authentication guidelines, such as NIST’s, put more weight on length and on checking against leaked passwords than on mandatory composition.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Naive rules have limits",
        texto:
          "The function above counts length and variety and knows only a few common passwords: `abcdefghijkl1` would come out as “good” without being so. Libraries such as `zxcvbn` estimate strength with dictionaries, keyboard patterns, dates and substitutions (`a` for `@`) and give better tips, at the cost of a large package: load them on demand. Even so, it is an estimate, not a proof.",
      },
    ],
    armadilhas: [
      "Treating the indicator as security: the client can be bypassed, and final validation belongs to the server.",
      "Showing strength by color alone, with no text, or announcing every keystroke to screen readers.",
      "Keeping `strength` in extra state updated by `useEffect`: derive it from the password during render.",
      "Logging, sending or persisting the password unnecessarily (`console.log`, analytics, `localStorage`, a request on every keystroke), or blocking paste and `autoComplete`.",
    ],
    autoteste: [
      {
        pergunta: "Why does `Password@123` pass composition rules and still count as weak?",
        resposta:
          "Because the rules only count character types (uppercase, digit, symbol), and the password follows a predictable pattern found in any common-password dictionary. Libraries such as `zxcvbn` recognize words, sequences and substitutions; length and unpredictability matter more.",
      },
      {
        pergunta: "Why does the level need neither `useState` nor `useEffect`?",
        resposta:
          "Because it is a pure function of the password, which already lives in state: computed during render, the level can never get out of sync. Extra state would duplicate the information and cause a render with a lagging value.",
      },
    ],
  },
};
