# Guias de Estudo

Coleção de guias de estudo em HTML, sem dependências: cada guia é uma página única que funciona offline, com progresso salvo no `localStorage` do navegador.

Página publicada: https://attilamonteiro.github.io/guias-de-estudo/

## Guias

| Guia | Conteúdo | Código |
| --- | --- | --- |
| [Backend](backend/index.html) | 80 perguntas de entrevista, método de explicação por pergunta, respostas PT/EN, treino e resumo | [`backend/`](backend/README.md) |

## Usar

Abra `index.html` (lista dos guias) ou o `index.html` de um guia direto no navegador (duplo clique).

## Gerar

Os arquivos `index.html` são gerados e versionados (o GitHub Pages serve a pasta como está). Depois de editar qualquer `src/` ou `guias.json`:

```bash
node build.mjs
```

## Adicionar um guia

1. Crie `<pasta>/src/index.html` (estilos e estrutura; os `<script src="...">` locais são embutidos pelo build) e os scripts do guia.
2. Registre em `guias.json`: `pasta`, `titulo`, `detalhe` (uma linha curta, ex.: "40 perguntas · PT") e `descricao`.
3. Rode `node build.mjs` e envie o commit.

O build recusa um guia sem `<pasta>/src/index.html`. A página inicial é gerada de `hub/modelo.html` e `guias.json`.
