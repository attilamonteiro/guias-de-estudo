// Regenera conteudo/<guia>/perguntas/index.ts a partir dos arquivos da pasta, em ordem de número.
// Uso: node scripts/gerar-indice-de-perguntas.mts backend nodejs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const guias = process.argv.slice(2);
if (guias.length === 0) {
  console.error("Uso: node scripts/gerar-indice-de-perguntas.mts <guia>...");
  process.exit(2);
}

for (const guia of guias) {
  const pasta = join("conteudo", guia, "perguntas");
  const perguntas = readdirSync(pasta)
    .filter((nome) => nome.endsWith(".ts") && nome !== "index.ts")
    .map((nome) => {
      const fonte = readFileSync(join(pasta, nome), "utf8");
      const exportada = /export const (\w+): Pergunta/.exec(fonte)?.[1];
      const numero = /^\s*numero: (\d+),/m.exec(fonte)?.[1];
      if (!exportada || !numero) throw new Error(`${nome}: sem "export const x: Pergunta" ou sem "numero"`);
      return { arquivo: nome.replace(/\.ts$/, ""), exportada, numero: Number(numero) };
    })
    .sort((a, b) => a.numero - b.numero);

  const repetidos = perguntas.filter((p, i) => perguntas.findIndex((q) => q.numero === p.numero) !== i);
  if (repetidos.length > 0) {
    throw new Error(`${guia}: números repetidos: ${repetidos.map((p) => `${p.numero} (${p.arquivo})`).join(", ")}`);
  }

  const importacoes = perguntas.map((p) => `import { ${p.exportada} } from "./${p.arquivo}";`).join("\n");
  const lista = perguntas.map((p) => p.exportada).join(", ");
  writeFileSync(
    join(pasta, "index.ts"),
    `import type { Pergunta } from "../../tipos";\n${importacoes}\n\n/** Todas as perguntas do guia, na ordem de estudo. Gerado por scripts/gerar-indice-de-perguntas.mts. */\nexport const perguntas: Pergunta[] = [${lista}];\n`,
  );
  console.log(`${pasta}/index.ts: ${perguntas.length} perguntas`);
}
