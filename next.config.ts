import type { NextConfig } from "next";

// Site estático (GitHub Pages). Em projeto de usuário o endereço é /<repositório>/,
// então o workflow de publicação define BASE_PATH; no dev local fica vazio.
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.BASE_PATH ?? "",
  images: { unoptimized: true },
};

export default config;
