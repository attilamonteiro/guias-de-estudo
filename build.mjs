// Gera cada guia (pasta/src -> pasta/index.html, um arquivo autonomo) e a pagina inicial (index.html).
// Os guias saem de guias.json. Uso: node build.mjs
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const raiz = dirname(fileURLToPath(import.meta.url));
const guias = JSON.parse(readFileSync(join(raiz, "guias.json"), "utf8"));

const escapar = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function montarGuia(pasta) {
  const src = join(pasta, "src");
  let html = readFileSync(join(src, "index.html"), "utf8");
  html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, arquivo) => {
    const codigo = readFileSync(join(src, arquivo), "utf8").replace(/<\/script>/gi, "<\\/script>");
    return `<script>\n${codigo}\n</script>`;
  });
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>:root{color-scheme:light}body{margin:0}[hidden]{display:none!important}</style>
</head>
<body>
${html}
</body>
</html>
`;
}

const cartoes = [];
for (const g of guias) {
  const pasta = join(raiz, g.pasta);
  if (!existsSync(join(pasta, "src", "index.html"))) throw new Error(`Guia "${g.pasta}": falta ${g.pasta}/src/index.html`);
  const saida = montarGuia(pasta);
  writeFileSync(join(pasta, "index.html"), saida);
  console.log(`OK: ${g.pasta}/index.html (${Math.round(saida.length / 1024)} KB)`);
  // href termina em index.html para funcionar tambem com duplo clique (file://).
  cartoes.push(`    <li><a class="card" href="${escapar(g.pasta)}/index.html"><span class="tag">${escapar(g.detalhe)}</span><h2>${escapar(g.titulo)}</h2><p>${escapar(g.descricao)}</p><span class="go">Abrir guia →</span></a></li>`);
}

const hub = readFileSync(join(raiz, "hub", "modelo.html"), "utf8").replace("<!--CARDS-->", cartoes.join("\n"));
writeFileSync(join(raiz, "index.html"), hub);
console.log(`OK: index.html (${guias.length} guia${guias.length === 1 ? "" : "s"})`);
