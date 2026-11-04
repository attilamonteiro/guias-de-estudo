// Confere arquivos de pergunta sem registrá-los no guia (útil enquanto se escreve).
// Uso: node scripts/conferir-perguntas.ts conteudo/backend/perguntas/m01-*.ts
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { problemasDaPergunta } from "../lib/conferir-conteudo.ts";

const arquivos = process.argv.slice(2);
if (arquivos.length === 0) {
  console.error("Uso: node scripts/conferir-perguntas.ts <arquivo.ts>...");
  process.exit(2);
}

let total = 0;
let comProblema = 0;
for (const arquivo of arquivos) {
  const modulo: Record<string, unknown> = await import(pathToFileURL(resolve(arquivo)).href);
  for (const [nome, valor] of Object.entries(modulo)) {
    total += 1;
    const problemas = problemasDaPergunta(valor as Parameters<typeof problemasDaPergunta>[0]);
    if (problemas.length === 0) {
      console.log(`OK    ${arquivo} (${nome})`);
    } else {
      comProblema += 1;
      console.log(`FALHA ${arquivo} (${nome})`);
      problemas.forEach((problema) => console.log(`  - ${problema}`));
    }
  }
}
console.log(`${total - comProblema}/${total} perguntas sem problemas`);
process.exit(comProblema === 0 ? 0 : 1);
