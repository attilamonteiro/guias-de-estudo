// Junta src/index.html + scripts em um unico arquivo HTML autonomo (abre com duplo clique).
// Uso: node build.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const raiz = dirname(fileURLToPath(import.meta.url));
const src = join(raiz, "src");
let html = readFileSync(join(src, "index.html"), "utf8");

html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, arquivo) => {
  const codigo = readFileSync(join(src, arquivo), "utf8").replace(/<\/script>/gi, "<\\/script>");
  return `<script>\n${codigo}\n</script>`;
});

const saida = `<!doctype html>
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
writeFileSync(join(raiz, "guia-backend.html"), saida);
console.log("OK: guia-backend.html (" + Math.round(saida.length / 1024) + " KB)");
