import type { NextConfig } from "next";

// Site estático (GitHub Pages). Em projeto de usuário o endereço é /<repositório>/,
// então o workflow de publicação define BASE_PATH; no dev local fica vazio.
const basePath = process.env.BASE_PATH ?? "";

const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  // O fetch do índice (lib/indice-do-guia.ts) não passa pelo Link: precisa do prefixo na mão.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
};

export default config;
