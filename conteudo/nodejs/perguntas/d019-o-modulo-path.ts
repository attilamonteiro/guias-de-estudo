import type { Pergunta } from "../../tipos";

// D19 · O módulo path
export const d019: Pergunta = {
  numero: 319,
  modulo: "devinterview-nativos",
  metodo: "feynman",
  pt: {
    titulo: "O módulo path",
    pergunta: "Como você gerencia operações de caminho no Node.js?",
    porqueEsteMetodo:
      "Caminho de arquivo parece só texto, e é por isso que tanta gente o monta na mão e erra. Uma imagem simples mostra o que o módulo `path` faz de verdade (e o que ele não faz) antes de entrar nas funções e nos riscos.",
    resposta30s:
      "Use o módulo **`node:path`** em vez de concatenar strings: `join`, `resolve`, `normalize`, `basename`, `dirname`, `extname`, `parse` e `relative` montam e desmontam caminhos com o **separador certo** do sistema (`path.sep`), e `path.posix` e `path.win32` fixam um dos estilos. Ele só manipula **texto**, não consulta o disco. Para validar entrada do usuário, resolva o caminho e confira o **prefixo** da pasta permitida, para barrar `..` (path traversal).",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine um escrivão que domina o formato de endereço de cada cidade: numa se separa com `/`, noutra com `\\`. Você diz “vá até a pasta de cima, depois à `fotos`”, e ele escreve o endereço completo no formato certo, sem você contar barras. Ele também sabe desmontar um endereço: qual é a rua, qual é o número, qual é a extensão do arquivo.",
        tecnico:
          "O `node:path` trabalha só com **strings**: junta segmentos (`join`), calcula o caminho absoluto a partir do diretório de trabalho (`resolve`), limpa `.`, `..` e barras repetidas (`normalize`), extrai partes (`basename`, `dirname`, `extname`, `parse`) e calcula o caminho de A até B (`relative`). Por padrão ele segue o sistema onde roda; `path.posix` e `path.win32` fixam um estilo, útil para chaves de object storage e URLs, que usam sempre `/`. No CommonJS existem `__dirname` e `__filename`; no ESM se usa `fileURLToPath(import.meta.url)` (versões recentes também oferecem `import.meta.dirname`: confira nodejs.org; veja L13 e L81).",
        limite:
          'O escrivão não vai ao cartório: o `path` **não sabe se a pasta existe**, não segue links simbólicos e não protege nada sozinho. `join("uploads", "../../segredo")` devolve um caminho que sai de `uploads` sem reclamar.',
      },
      {
        tipo: "tabela",
        titulo: "As funções que mais aparecem (resultados em POSIX)",
        colunas: ["Função", "Chamada", "Resultado"],
        linhas: [
          ["`join`", '`path.join("a", "b", "../c")`', "`a/c`"],
          ["`resolve`", '`path.resolve("a", "b")`', "Absoluto: `<diretório atual>/a/b`"],
          [
            "`resolve` com segmento absoluto",
            '`path.resolve("/x", "/y", "z")`',
            "`/y/z` (o absoluto recomeça a conta)",
          ],
          ["`normalize`", '`path.normalize("a//b/../c")`', "`a/c`"],
          ["`basename`", '`path.basename("/p/arq.txt", ".txt")`', "`arq`"],
          ["`dirname`", '`path.dirname("/p/arq.txt")`', "`/p`"],
          ["`extname`", '`path.extname("arq.tar.gz")`', "`.gz` (só a última extensão)"],
          [
            "`parse`",
            '`path.parse("/p/arq.txt")`',
            '`{ root: "/", dir: "/p", base: "arq.txt", ext: ".txt", name: "arq" }`',
          ],
          ["`relative`", '`path.relative("/a/b", "/a/c/d")`', "`../c/d`"],
        ],
        nota: "`path.sep` é `/` em POSIX e `\\` no Windows; `path.delimiter` separa entradas de `PATH`. Para o estilo do Windows em qualquer sistema, use `path.win32`.",
      },
      {
        tipo: "codigo",
        titulo: "Barrando path traversal",
        legenda: "JavaScript",
        codigo: [
          'import { resolve, sep } from "node:path";',
          "",
          'const RAIZ = resolve("uploads"); // pasta permitida, em caminho absoluto',
          "",
          "function caminhoSeguro(nomeInformado) {",
          "  const alvo = resolve(RAIZ, nomeInformado); // aplica os .. e normaliza",
          "  if (!alvo.startsWith(RAIZ + sep)) {",
          '    throw new Error("fora da pasta permitida");',
          "  }",
          "  return alvo;",
          "}",
          "",
          'caminhoSeguro("foto.png"); // .../uploads/foto.png',
          'caminhoSeguro("../../etc/passwd"); // lança o erro',
          'caminhoSeguro("/etc/passwd"); // lança o erro: o absoluto recomeça a conta',
        ].join("\n"),
        nota: "O `+ sep` impede que `uploads-extra` passe pelo teste do prefixo. Links simbólicos dentro da pasta ainda podem apontar para fora: se isso importa, confira também o resultado de `fs.realpath`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Nunca concatene caminhos, e nunca confie no `..`",
        texto:
          '`pasta + "/" + nome` erra no Windows, duplica ou esquece barras e deixa o nome do usuário mandar no caminho. `join` só junta e normaliza: **não impede** que `..` saia da pasta. O padrão seguro é `resolve` mais a checagem de prefixo; melhor ainda é nem usar o nome enviado: gere o seu próprio nome de arquivo e guarde o original como metadado.',
      },
    ],
    armadilhas: [
      "Montar caminhos com `+` ou template string e uma barra fixa: quebra no Windows e deixa buracos de path traversal.",
      'Achar que `path.join` valida: `join(RAIZ, "../../x")` sai da pasta; valide com `resolve` e a checagem de prefixo (com o separador).',
      "Confundir `resolve` com `join`: `resolve` parte do diretório de trabalho do processo (`process.cwd()`), que muda conforme de onde o programa foi iniciado; para arquivos do projeto, ancore em `__dirname` ou `import.meta.url`.",
      "Usar `path` para algo que não é caminho de sistema de arquivos (URLs, chaves de bucket): prefira `path.posix` ou a API `URL`, para não ganhar barras invertidas no Windows.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre `path.join` e `path.resolve`?",
        resposta:
          "O `join` só junta os segmentos e normaliza o resultado, que pode continuar relativo. O `resolve` processa da direita para a esquerda até formar um caminho absoluto, usando o diretório de trabalho se for preciso; um segmento absoluto recomeça a conta.",
      },
      {
        pergunta: "Como impedir que um nome de arquivo informado pelo usuário leia fora da pasta permitida?",
        resposta:
          "Resolver o caminho com `path.resolve(RAIZ, nome)` e recusar se o resultado não começar por `RAIZ + path.sep`. Para links simbólicos, conferir também com `fs.realpath`. Melhor ainda: gerar o nome do arquivo no servidor.",
      },
    ],
  },
  en: {
    titulo: "The path module",
    pergunta: "How do you manage path operations in Node.js?",
    porqueEsteMetodo:
      "A file path looks like plain text, which is why so many people build it by hand and get it wrong. A simple image shows what the `path` module really does (and what it does not) before getting into the functions and the risks.",
    resposta30s:
      "Use the **`node:path`** module instead of concatenating strings: `join`, `resolve`, `normalize`, `basename`, `dirname`, `extname`, `parse` and `relative` build and take apart paths with the **right separator** for the system (`path.sep`), and `path.posix` and `path.win32` pin one of the styles. It only manipulates **text**; it does not touch the disk. To validate user input, resolve the path and check the **prefix** of the allowed folder to block `..` (path traversal).",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Picture a clerk who knows the address format of every city: in one you separate with `/`, in another with `\\`. You say “go to the folder above, then to `photos`”, and the clerk writes the full address in the right format, without you counting slashes. The clerk can also take an address apart: which street, which number, which file extension.",
        tecnico:
          "`node:path` works only with **strings**: it joins segments (`join`), computes the absolute path from the working directory (`resolve`), cleans `.`, `..` and repeated slashes (`normalize`), extracts parts (`basename`, `dirname`, `extname`, `parse`) and computes the path from A to B (`relative`). By default it follows the system it runs on; `path.posix` and `path.win32` pin a style, which is useful for object-storage keys and URLs, which always use `/`. CommonJS has `__dirname` and `__filename`; in ESM you use `fileURLToPath(import.meta.url)` (recent versions also offer `import.meta.dirname`: check nodejs.org; see L13 and L81).",
        limite:
          'The clerk never visits the registry: `path` **does not know whether the folder exists**, does not follow symbolic links and protects nothing on its own. `join("uploads", "../../secret")` returns a path that leaves `uploads` without complaint.',
      },
      {
        tipo: "tabela",
        titulo: "The functions that come up most (POSIX results)",
        colunas: ["Function", "Call", "Result"],
        linhas: [
          ["`join`", '`path.join("a", "b", "../c")`', "`a/c`"],
          ["`resolve`", '`path.resolve("a", "b")`', "Absolute: `<current directory>/a/b`"],
          [
            "`resolve` with an absolute segment",
            '`path.resolve("/x", "/y", "z")`',
            "`/y/z` (the absolute segment restarts the count)",
          ],
          ["`normalize`", '`path.normalize("a//b/../c")`', "`a/c`"],
          ["`basename`", '`path.basename("/p/file.txt", ".txt")`', "`file`"],
          ["`dirname`", '`path.dirname("/p/file.txt")`', "`/p`"],
          ["`extname`", '`path.extname("file.tar.gz")`', "`.gz` (only the last extension)"],
          [
            "`parse`",
            '`path.parse("/p/file.txt")`',
            '`{ root: "/", dir: "/p", base: "file.txt", ext: ".txt", name: "file" }`',
          ],
          ["`relative`", '`path.relative("/a/b", "/a/c/d")`', "`../c/d`"],
        ],
        nota: "`path.sep` is `/` on POSIX and `\\` on Windows; `path.delimiter` separates `PATH` entries. For Windows style on any system, use `path.win32`.",
      },
      {
        tipo: "codigo",
        titulo: "Blocking path traversal",
        legenda: "JavaScript",
        codigo: [
          'import { resolve, sep } from "node:path";',
          "",
          'const ROOT = resolve("uploads"); // allowed folder, as an absolute path',
          "",
          "function safePath(givenName) {",
          "  const target = resolve(ROOT, givenName); // applies the .. and normalizes",
          "  if (!target.startsWith(ROOT + sep)) {",
          '    throw new Error("outside the allowed folder");',
          "  }",
          "  return target;",
          "}",
          "",
          'safePath("photo.png"); // .../uploads/photo.png',
          'safePath("../../etc/passwd"); // throws',
          'safePath("/etc/passwd"); // throws: an absolute segment restarts the count',
        ].join("\n"),
        nota: "The `+ sep` stops `uploads-extra` from passing the prefix test. Symbolic links inside the folder can still point outside: if that matters, also check the result of `fs.realpath`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Never concatenate paths, and never trust `..`",
        texto:
          '`folder + "/" + name` fails on Windows, duplicates or drops slashes and lets the user’s name steer the path. `join` only joins and normalizes: it **does not stop** `..` from leaving the folder. The safe pattern is `resolve` plus the prefix check; even better is to not use the submitted name at all: generate your own file name and keep the original as metadata.',
      },
    ],
    armadilhas: [
      "Building paths with `+` or a template string and a hard-coded slash: it breaks on Windows and leaves path traversal holes.",
      'Thinking `path.join` validates: `join(ROOT, "../../x")` leaves the folder; validate with `resolve` and the prefix check (with the separator).',
      "Confusing `resolve` with `join`: `resolve` starts from the process working directory (`process.cwd()`), which changes depending on where the program was started; for project files, anchor on `__dirname` or `import.meta.url`.",
      "Using `path` for something that is not a file system path (URLs, bucket keys): prefer `path.posix` or the `URL` API, so you do not get backslashes on Windows.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `path.join` and `path.resolve`?",
        resposta:
          "`join` only joins the segments and normalizes the result, which can stay relative. `resolve` processes from right to left until it forms an absolute path, using the working directory if needed; an absolute segment restarts the count.",
      },
      {
        pergunta: "How do you stop a user-supplied file name from reading outside the allowed folder?",
        resposta:
          "Resolve the path with `path.resolve(ROOT, name)` and reject it if the result does not start with `ROOT + path.sep`. For symbolic links, also check with `fs.realpath`. Even better: generate the file name on the server.",
      },
    ],
  },
};
