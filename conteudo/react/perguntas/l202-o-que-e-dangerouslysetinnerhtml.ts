import type { Pergunta } from "../../tipos";

// L202 · O que é dangerouslySetInnerHTML
export const l202: Pergunta = {
  numero: 202,
  modulo: "linkedin-seguranca-e-a11y",
  metodo: "whys",
  pt: {
    titulo: "O que é dangerouslySetInnerHTML",
    pergunta: "O que é dangerouslySetInnerHTML?",
    porqueEsteMetodo:
      "O nome já é uma resposta pela metade: ele grita um aviso. A cadeia de “por quês” explica por que a propriedade existe, por que o nome é feio de propósito, como o conteúdo vira ataque e o que fazer com HTML que vem de uma API.",
    resposta30s:
      "`dangerouslySetInnerHTML` é a propriedade do React que **insere HTML bruto** num elemento, **sem o escape** que o JSX faz por padrão. O nome é um aviso: se o HTML trouxer algo como `<img onerror=...>`, o navegador executa o código, o que abre espaço para **XSS**. Evite; quando for inevitável, **sanitize** com uma biblioteca (como a DOMPurify) logo antes de renderizar, prefira texto ou Markdown e reforce com **CSP**.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que a propriedade existe, se o React já escapa tudo?",
            resposta:
              "Porque às vezes o conteúdo **já é HTML**: texto de um CMS, saída de um renderizador de Markdown, um SVG inline. O JSX trataria isso como texto e mostraria as tags na tela. Para esses casos, o React oferece uma saída que escreve o `innerHTML` do elemento, sem escape.",
          },
          {
            pergunta: "Por que o nome é tão comprido e feio?",
            resposta:
              "De propósito: ele obriga quem escreve a digitar “perigosamente” e a pensar. E o valor precisa ser um objeto `{ __html: ... }`, o que dificulta o uso por distração. O nome chama atenção em revisão de código, vira um termo fácil de buscar no repositório e de vigiar com uma regra de lint.",
          },
          {
            pergunta: "Por que isso abre a porta para XSS?",
            resposta:
              'Porque o HTML bruto passa pelo interpretador do navegador, e ele executa código sem precisar de `<script>`: `<img src=x onerror="...">` basta. O código roda com os privilégios da página, no contexto do usuário logado: pode ler dados na tela, chamar a API como ele e, se o token estiver acessível ao JavaScript, roubá-lo.',
          },
          {
            pergunta: "Por que “vem da minha API” não é motivo para confiar?",
            resposta:
              "Porque a API só repassa o que alguém gravou: outro usuário, um editor, um painel de administração, uma integração comprometida. A cadeia é origem → banco → API → componente → DOM, e **um elo sem tratamento basta**. Confiança tem de ser verificada no ponto em que o conteúdo vira DOM, não presumida na origem.",
          },
          {
            pergunta: "Por que sanitizar com uma biblioteca, e não à mão?",
            resposta:
              "Porque filtros caseiros (remover `<script>`, regex) falham diante das variações: atributos `on*`, `javascript:` em URLs, SVG, HTML que muda ao ser interpretado. Uma biblioteca como a DOMPurify usa **lista permitida**, é mantida contra truques novos e deixa você restringir as tags e os atributos aceitos. Mesmo assim, prefira **não precisar de HTML**: texto, Markdown sem HTML cru ou componentes resolvem a maior parte dos casos, e uma CSP limita o estrago do que escapar.",
          },
        ],
        causaRaiz:
          "O perigo não é a propriedade, e sim **entregar ao interpretador de HTML um conteúdo que alguém de fora pode controlar**. A segurança está em não deixar conteúdo não confiável virar HTML ou, quando precisa, **sanitizá-lo logo antes** do ponto em que vira DOM.",
      },
      {
        tipo: "tabela",
        titulo: "Quando usar, quando evitar e o que fazer",
        colunas: ["Situação", "O que fazer", "Por quê"],
        linhas: [
          [
            "Texto digitado por usuários (comentário, nome, bio)",
            "Renderize como texto no JSX; para formatação, use Markdown ou componentes",
            "Não precisa de HTML bruto, e o escape do JSX cuida do resto",
          ],
          [
            "Conteúdo rico vindo de CMS ou API (artigo, descrição formatada)",
            "Sanitize com DOMPurify (lista permitida) ou converta Markdown ou uma estrutura em componentes",
            "Quem escreve o conteúdo pode ser um editor, um usuário ou uma conta comprometida",
          ],
          [
            "HTML fixo e seu (um SVG inline, um trecho estático do próprio código)",
            "Uso aceitável, mas prefira JSX quando der",
            "Sem entrada externa não há vetor; só cuide para o valor não passar a ser alimentado de fora",
          ],
          [
            "HTML completo de terceiros ou do usuário (editor de e-mail, página montada pelo usuário)",
            "Isole num `<iframe>` com o atributo `sandbox`, de preferência em outra origem, e use CSP",
            "O script não alcança os cookies nem o DOM da página principal",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Sem sanitizar e sanitizando",
        legenda: "TSX",
        codigo: `import DOMPurify from "dompurify";
import { useMemo } from "react";

// Perigoso: o HTML da API vai direto para o DOM
function ArtigoPerigoso({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// Mais seguro: sanitiza com lista permitida, logo antes de renderizar
function Artigo({ html }: { html: string }) {
  const limpo = useMemo(
    () =>
      DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ["p", "b", "i", "a", "ul", "li"],
        ALLOWED_ATTR: ["href"],
      }),
    [html],
  );
  return <div dangerouslySetInnerHTML={{ __html: limpo }} />;
}`,
        nota: "Na renderização no servidor, a DOMPurify precisa de um DOM: use uma variante isomórfica ou sanitize no cliente. Confira a documentação da biblioteca.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A regra",
        texto:
          "Conteúdo que alguém de fora controla **nunca chega ao interpretador de HTML sem sanitização com lista permitida**, e quando puder ser texto ou Markdown, nem chega. Sanitize no ponto de uso, não na entrada, e não altere nem junte o resultado com outros trechos depois. Veja L200 para o quadro geral de XSS e L209 para a CSP.",
      },
    ],
    armadilhas: [
      "Achar que o nome é exagero: a propriedade é a principal porta de entrada de XSS em código React.",
      "Sanitizar com regex ou removendo `<script>`: use uma biblioteca mantida, com lista permitida.",
      "Confiar em HTML porque “vem da nossa API”: conteúdo de editor, de usuário ou de integração também é entrada.",
      "Sanitizar e depois concatenar ou alterar o HTML antes de renderizar: a alteração pode reabrir a brecha.",
    ],
    autoteste: [
      {
        pergunta: "Por que o nome da propriedade é `dangerouslySetInnerHTML`?",
        resposta:
          "Porque ela insere HTML bruto, sem o escape do JSX, e isso permite XSS se o conteúdo for malicioso. O nome comprido e o objeto `{ __html }` obrigam a pessoa a pensar e deixam o uso fácil de achar em revisão.",
      },
      {
        pergunta: "Como renderizar com segurança um HTML que vem de uma API?",
        resposta:
          "Preferindo texto, Markdown sem HTML cru ou componentes. Se precisar do HTML, sanitize com uma biblioteca como a DOMPurify, com lista permitida, logo antes de renderizar, e reforce com CSP.",
      },
    ],
  },
  en: {
    titulo: "What is dangerouslySetInnerHTML",
    pergunta: "What is dangerouslySetInnerHTML?",
    porqueEsteMetodo:
      "The name is already half an answer: it shouts a warning. The chain of whys explains why the property exists, why the name is ugly on purpose, how content turns into an attack and what to do with HTML that comes from an API.",
    resposta30s:
      "`dangerouslySetInnerHTML` is the React property that **inserts raw HTML** into an element, **without the escaping** JSX does by default. The name is a warning: if the HTML carries something like `<img onerror=...>`, the browser runs the code, which opens the door to **XSS**. Avoid it; when it is unavoidable, **sanitize** with a library (such as DOMPurify) right before rendering, prefer text or Markdown and back it up with **CSP**.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does the property exist if React already escapes everything?",
            resposta:
              "Because sometimes the content **is already HTML**: text from a CMS, the output of a Markdown renderer, an inline SVG. JSX would treat it as text and show the tags on screen. For those cases, React offers an escape hatch that writes the element’s `innerHTML`, unescaped.",
          },
          {
            pergunta: "Why is the name so long and ugly?",
            resposta:
              "On purpose: it forces the author to type “dangerously” and to think. And the value must be an object `{ __html: ... }`, which makes careless use harder. The name stands out in code review, is easy to search for in the repository and easy to watch with a lint rule.",
          },
          {
            pergunta: "Why does that open the door to XSS?",
            resposta:
              'Because raw HTML goes through the browser’s parser, and it runs code without needing `<script>`: `<img src=x onerror="...">` is enough. The code runs with the page’s privileges, in the logged-in user’s context: it can read data on screen, call the API as them and, if the token is reachable by JavaScript, steal it.',
          },
          {
            pergunta: "Why is “it comes from my API” not a reason to trust it?",
            resposta:
              "Because the API only passes along what somebody saved: another user, an editor, an admin panel, a compromised integration. The chain is origin → database → API → component → DOM, and **one unsanitized link is enough**. Trust must be verified at the point where the content becomes DOM, not assumed at the source.",
          },
          {
            pergunta: "Why sanitize with a library rather than by hand?",
            resposta:
              "Because homemade filters (stripping `<script>`, regexes) fail against the variations: `on*` attributes, `javascript:` in URLs, SVG, HTML that mutates when parsed. A library such as DOMPurify uses an **allowlist**, is maintained against new tricks and lets you restrict the accepted tags and attributes. Even so, prefer **not needing HTML**: text, Markdown without raw HTML or components solve most cases, and a CSP limits the damage of whatever slips through.",
          },
        ],
        causaRaiz:
          "The danger is not the property, it is **handing the HTML parser content that an outsider can control**. Safety lies in not letting untrusted content become HTML or, when it must, **sanitizing it right before** the point where it becomes DOM.",
      },
      {
        tipo: "tabela",
        titulo: "When to use it, when to avoid it and what to do",
        colunas: ["Situation", "What to do", "Why"],
        linhas: [
          [
            "Text typed by users (comment, name, bio)",
            "Render it as text in JSX; for formatting, use Markdown or components",
            "No raw HTML needed, and JSX escaping handles the rest",
          ],
          [
            "Rich content from a CMS or an API (article, formatted description)",
            "Sanitize with DOMPurify (allowlist) or turn Markdown or a structure into components",
            "Whoever writes the content may be an editor, a user or a compromised account",
          ],
          [
            "Fixed HTML of your own (an inline SVG, a static snippet in your code)",
            "Acceptable use, but prefer JSX when possible",
            "With no outside input there is no vector; just make sure the value is not later fed from outside",
          ],
          [
            "Full HTML from third parties or the user (email editor, a page built by the user)",
            "Isolate it in an `<iframe>` with the `sandbox` attribute, preferably on another origin, and use CSP",
            "The script cannot reach the main page’s cookies or DOM",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Unsanitized and sanitized",
        legenda: "TSX",
        codigo: `import DOMPurify from "dompurify";
import { useMemo } from "react";

// Dangerous: the API’s HTML goes straight into the DOM
function UnsafeArticle({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// Safer: sanitize with an allowlist, right before rendering
function Article({ html }: { html: string }) {
  const clean = useMemo(
    () =>
      DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ["p", "b", "i", "a", "ul", "li"],
        ALLOWED_ATTR: ["href"],
      }),
    [html],
  );
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}`,
        nota: "With server rendering, DOMPurify needs a DOM: use an isomorphic variant or sanitize on the client. Check the library’s documentation.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The rule",
        texto:
          "Content that an outsider controls **never reaches the HTML parser without sanitization with an allowlist**, and when it can be text or Markdown, it should not reach it at all. Sanitize at the point of use, not at input, and do not modify the result or join it with other fragments afterwards. See L200 for the general XSS picture and L209 for CSP.",
      },
    ],
    armadilhas: [
      "Thinking the name is exaggerated: the property is the main entry point for XSS in React code.",
      "Sanitizing with a regex or by stripping `<script>`: use a maintained library with an allowlist.",
      "Trusting HTML because “it comes from our API”: content from editors, users or integrations is input too.",
      "Sanitizing and then concatenating or altering the HTML before rendering: the change can reopen the hole.",
    ],
    autoteste: [
      {
        pergunta: "Why is the property called `dangerouslySetInnerHTML`?",
        resposta:
          "Because it inserts raw HTML, without JSX escaping, and that allows XSS if the content is malicious. The long name and the `{ __html }` object force you to think and make the usage easy to find in review.",
      },
      {
        pergunta: "How do you safely render HTML that comes from an API?",
        resposta:
          "By preferring text, Markdown without raw HTML or components. If you need the HTML, sanitize it with a library such as DOMPurify, using an allowlist, right before rendering, and back it up with CSP.",
      },
    ],
  },
};
