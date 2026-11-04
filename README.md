# Guias de Estudo

Guias de estudo em português e inglês. Cada pergunta é explicada com o método de aprendizado que mais combina com ela (Feynman, 5 Porquês, Comparar, Passo a passo, Playbook, Ameaça→defesa, Primeiros princípios, System design), com resposta de 30 segundos, armadilhas e autoteste. Progresso e idioma ficam no `localStorage` do navegador.

Site: https://attilamonteiro.github.io/guias-de-estudo/

## Guias

| Guia                                | Conteúdo                                                                                                                                                                            |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Backend](conteudo/backend/guia.ts) | 80 perguntas de entrevista (30 originais + 50 de [roadmap.sh](https://roadmap.sh/questions/backend); 11 se repetem e reaproveitam a explicação, então são 69 explicações distintas) |

As explicações são originais; do roadmap.sh vêm apenas os enunciados.

## Desenvolver

Next.js (App Router, exportação estática) + TypeScript + Material UI.

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # integridade do conteúdo (PT/EN, repetições, marcação) e regras de progresso
npm run build      # gera out/ (valida os tipos também)
```

## Estrutura

| Pasta          | O quê                                                                                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `conteudo/`    | Dados puros, sem React. `tipos.ts` define o esquema; `metodos.ts` os 8 métodos; `guias.ts` registra os guias; `<guia>/guia.ts` descreve um guia e `<guia>/perguntas/` tem **um arquivo por pergunta** (`q01-…`, `r02-…`) |
| `lib/`         | Regras sem tela: `guia.ts` (números, repetições, projeção leve), `progresso.ts` (funções puras), `armazenamento.ts` e `preferencias.tsx` (idioma e progresso no navegador), `textos-da-interface.ts`                     |
| `tema/`        | Tema MUI com as cores, fontes e pontos de quebra do site (claro e escuro pelo sistema)                                                                                                                                   |
| `componentes/` | Um assunto por pasta: `blocos/` (um componente por tipo de bloco), `casca/` (cabeçalho, índice, moldura), `pergunta/`, `inicio/`, `resumo/`, `treino/`, `hub/`, `base/`                                                  |
| `app/`         | Só as rotas: `/`, `/<guia>/`, `/<guia>/pergunta/<n>/`, `/<guia>/resumo/`, `/<guia>/treino/`                                                                                                                              |
| `testes/`      | Vitest                                                                                                                                                                                                                   |

## Adicionar uma pergunta

Crie `conteudo/<guia>/perguntas/<id>-<slug>.ts` exportando uma `Pergunta` (copie uma existente) e acrescente-a em `perguntas/index.ts`. Os testes reprovam número repetido, módulo inexistente, diferença de estrutura entre PT e EN e marcação `` ` `` / `**` aberta.

## Adicionar um guia

1. Crie `conteudo/<id>/guia.ts` (textos nos dois idiomas, módulos e perguntas).
2. Registre-o em `conteudo/guias.ts`. A página inicial, as rotas e os testes passam a incluí-lo.

## Publicação

O workflow `.github/workflows/publicar.yml` testa, gera o site estático e publica no GitHub Pages a cada push na `main` (Settings → Pages → Source: GitHub Actions). O `BASE_PATH` é o nome do repositório.
