import type { Pergunta } from "../../tipos";

// Q60 · Punycode
export const q60: Pergunta = {
  numero: 60,
  modulo: "turing-avancadas",
  metodo: "feynman",
  pt: {
    titulo: "Punycode",
    pergunta: "O que é Punycode no Node.js?",
    porqueEsteMetodo:
      "Punycode é uma ideia pequena que parece esquisita até você ver o problema que resolve. Uma analogia curta, o mecanismo real e o estado atual no Node (módulo depreciado) formam uma resposta completa.",
    resposta30s:
      "**Punycode** é uma codificação que representa texto Unicode usando só caracteres ASCII, criada para os **nomes de domínio internacionalizados** (IDN): `münchen.de` trafega no DNS como `xn--mnchen-3ya.de`, onde `xn--` marca um rótulo codificado. O módulo `punycode` embutido no Node está **depreciado**; para domínios, use `url.domainToASCII()`, `url.domainToUnicode()` ou a API `URL`, e confira a documentação da sua versão.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine um telégrafo que só transmite letras sem acento, dígitos e hífen. Para enviar “münchen”, o operador escreve primeiro as letras comuns (“mnchen”), depois um hífen e um código curto que diz qual caractere especial entra e em que posição. Um carimbo `xn--` no começo avisa ao destinatário: “esta palavra está codificada, decodifique antes de ler”.",
        tecnico:
          "O DNS só aceita rótulos em ASCII (letras, dígitos e hífen). O Punycode (RFC 3492) converte qualquer texto Unicode em ASCII de forma reversível: copia os caracteres ASCII na ordem, acrescenta um `-` e depois os demais, codificados como inserções (posição e valor). Dentro do padrão IDNA, cada rótulo do domínio que tem caracteres não ASCII ganha o prefixo `xn--`; rótulos só com ASCII ficam como estão. Por isso `www.münchen.de` vira `www.xn--mnchen-3ya.de`.",
        limite:
          "A analogia não cobre três coisas. Punycode **não é criptografia nem compressão**: qualquer um decodifica, e o resultado pode até ficar maior. Vale só para o **nome de domínio**, não para o caminho nem a query de uma URL, que usam percent-encoding (`%C3%BC`). E, como letras parecidas de alfabetos diferentes geram domínios diferentes, o Punycode também aparece em ataques de homógrafos, por isso navegadores às vezes exibem o `xn--` em vez do nome bonito.",
      },
      {
        tipo: "fluxo",
        titulo: "O caminho de um domínio com acento",
        etapas: [
          "A pessoa digita `münchen.de` na barra do navegador",
          "O navegador normaliza o texto (IDNA) e separa o domínio em rótulos",
          "Cada rótulo não ASCII vira `xn--` mais o Punycode: `xn--mnchen-3ya`",
          "O DNS resolve `xn--mnchen-3ya.de`, que é só ASCII",
          "Na tela, o navegador mostra de volta `münchen.de`",
        ],
      },
      {
        tipo: "codigo",
        titulo: "Convertendo domínios no Node de hoje",
        legenda: "JavaScript",
        codigo: `import { domainToASCII, domainToUnicode } from "node:url";

domainToASCII("münchen.de"); // "xn--mnchen-3ya.de"
domainToUnicode("xn--mnchen-3ya.de"); // "münchen.de"
domainToASCII("xn--iñvalid.com"); // "" (string vazia quando o domínio é inválido)

// A API URL também normaliza o host para ASCII:
new URL("https://bücher.example/").hostname; // "xn--bcher-kva.example"`,
      },
      {
        tipo: "tabela",
        titulo: "O que usar no Node",
        colunas: ["Opção", "Situação", "Quando usar"],
        linhas: [
          [
            "`punycode` embutido (`node:punycode`)",
            "Depreciado; conforme a versão, o uso gera um aviso",
            "Evite em código novo; aparece em código antigo e em dependências",
          ],
          [
            "`url.domainToASCII()` e `url.domainToUnicode()`",
            "API atual do núcleo",
            "Converter nomes de domínio, o caso mais comum",
          ],
          ["`new URL(texto).hostname`", "API atual do núcleo", "Quando você já está interpretando uma URL"],
          [
            "Pacote `punycode` do npm (importado como `punycode/`)",
            "Biblioteca de terceiros, sem aviso",
            "Quando precisar codificar ou decodificar strings arbitrárias, não só domínios",
          ],
        ],
        nota: "A barra final em `punycode/` faz o Node buscar o pacote instalado, em vez do módulo embutido de mesmo nome. Confira a documentação oficial (nodejs.org) da sua versão sobre a depreciação.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Módulo depreciado",
        texto:
          "Se você ver `require('punycode')` ou um aviso de depreciação do `punycode` ao rodar um programa, quase sempre ele vem de uma dependência antiga. Atualize a dependência ou troque o uso por `node:url`, em vez de silenciar o aviso.",
      },
    ],
    armadilhas: [
      "Usar o módulo `punycode` embutido em código novo: ele está depreciado e pode ser removido; prefira a API `URL` ou `url.domainToASCII()`.",
      "Achar que Punycode é criptografia ou compressão: é uma codificação reversível, sem segredo.",
      "Aplicar a conversão na URL inteira: ela vale só para o nome de domínio; caminho e query usam percent-encoding.",
      "Ignorar ataques de homógrafos: domínios com letras parecidas de outros alfabetos. Em contextos sensíveis, valide e mostre também a forma ASCII (`xn--`).",
    ],
    autoteste: [
      {
        pergunta: "O que significa o prefixo `xn--` num domínio?",
        resposta:
          "Que aquele rótulo é a codificação Punycode de um nome com caracteres não ASCII, usada para que o DNS, que só entende ASCII, resolva domínios internacionalizados.",
      },
      {
        pergunta: "O que usar no lugar do módulo `punycode` embutido para converter domínios?",
        resposta:
          "`url.domainToASCII()` e `url.domainToUnicode()` (de `node:url`) ou a propriedade `hostname` de um `URL`. Para outros textos, o pacote `punycode` do npm.",
      },
    ],
  },
  en: {
    titulo: "Punycode",
    pergunta: "What is Punycode in Node.js?",
    porqueEsteMetodo:
      "Punycode is a small idea that looks odd until you see the problem it solves. A short analogy, the real mechanism and its current status in Node (a deprecated module) make a complete answer.",
    resposta30s:
      "**Punycode** is an encoding that represents Unicode text using only ASCII characters, created for **internationalized domain names** (IDN): `münchen.de` travels through DNS as `xn--mnchen-3ya.de`, where `xn--` marks an encoded label. The built-in `punycode` module in Node is **deprecated**; for domains, use `url.domainToASCII()`, `url.domainToUnicode()` or the `URL` API, and check the documentation of your version.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine a telegraph that only transmits unaccented letters, digits and the hyphen. To send “münchen”, the operator first writes the plain letters (“mnchen”), then a hyphen and a short code saying which special character goes in and at what position. An `xn--` stamp at the front tells the recipient: “this word is encoded, decode it before reading”.",
        tecnico:
          "DNS only accepts ASCII labels (letters, digits and hyphen). Punycode (RFC 3492) converts any Unicode text into ASCII reversibly: it copies the ASCII characters in order, adds a `-` and then the rest, encoded as insertions (position and value). Under the IDNA standard, each domain label with non-ASCII characters gets the `xn--` prefix; ASCII-only labels stay as they are. That is why `www.münchen.de` becomes `www.xn--mnchen-3ya.de`.",
        limite:
          "The analogy misses three things. Punycode is **neither encryption nor compression**: anyone can decode it, and the result can even get longer. It applies only to the **domain name**, not to a URL’s path or query, which use percent-encoding (`%C3%BC`). And since look-alike letters from different alphabets make different domains, Punycode also shows up in homograph attacks, which is why browsers sometimes display the `xn--` form instead of the pretty name.",
      },
      {
        tipo: "fluxo",
        titulo: "The path of an accented domain",
        etapas: [
          "The person types `münchen.de` in the browser bar",
          "The browser normalizes the text (IDNA) and splits the domain into labels",
          "Each non-ASCII label becomes `xn--` plus the Punycode: `xn--mnchen-3ya`",
          "DNS resolves `xn--mnchen-3ya.de`, which is plain ASCII",
          "On screen, the browser shows `münchen.de` again",
        ],
      },
      {
        tipo: "codigo",
        titulo: "Converting domains in today’s Node",
        legenda: "JavaScript",
        codigo: `import { domainToASCII, domainToUnicode } from "node:url";

domainToASCII("münchen.de"); // "xn--mnchen-3ya.de"
domainToUnicode("xn--mnchen-3ya.de"); // "münchen.de"
domainToASCII("xn--iñvalid.com"); // "" (empty string when the domain is invalid)

// The URL API also normalizes the host to ASCII:
new URL("https://bücher.example/").hostname; // "xn--bcher-kva.example"`,
      },
      {
        tipo: "tabela",
        titulo: "What to use in Node",
        colunas: ["Option", "Status", "When to use"],
        linhas: [
          [
            "Built-in `punycode` (`node:punycode`)",
            "Deprecated; depending on the version, using it prints a warning",
            "Avoid in new code; it shows up in old code and in dependencies",
          ],
          [
            "`url.domainToASCII()` and `url.domainToUnicode()`",
            "Current core API",
            "Converting domain names, the most common case",
          ],
          ["`new URL(text).hostname`", "Current core API", "When you are already parsing a URL"],
          [
            "The `punycode` package from npm (imported as `punycode/`)",
            "Third-party library, no warning",
            "When you must encode or decode arbitrary strings, not just domains",
          ],
        ],
        nota: "The trailing slash in `punycode/` makes Node load the installed package instead of the built-in module of the same name. Check the official documentation (nodejs.org) for your version about the deprecation.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Deprecated module",
        texto:
          "If you see `require('punycode')` or a `punycode` deprecation warning when running a program, it almost always comes from an old dependency. Update the dependency or switch the usage to `node:url`, rather than silencing the warning.",
      },
    ],
    armadilhas: [
      "Using the built-in `punycode` module in new code: it is deprecated and may be removed; prefer the `URL` API or `url.domainToASCII()`.",
      "Thinking Punycode is encryption or compression: it is a reversible encoding with no secret.",
      "Applying the conversion to a whole URL: it applies only to the domain name; path and query use percent-encoding.",
      "Ignoring homograph attacks: domains with look-alike letters from other alphabets. In sensitive contexts, validate and also show the ASCII form (`xn--`).",
    ],
    autoteste: [
      {
        pergunta: "What does the `xn--` prefix in a domain mean?",
        resposta:
          "That the label is the Punycode encoding of a name with non-ASCII characters, used so that DNS, which only understands ASCII, can resolve internationalized domains.",
      },
      {
        pergunta: "What should you use instead of the built-in `punycode` module to convert domains?",
        resposta:
          "`url.domainToASCII()` and `url.domainToUnicode()` (from `node:url`) or the `hostname` property of a `URL`. For other text, the `punycode` package from npm.",
      },
    ],
  },
};
