# Guias de Estudo

Guias de estudo em português e inglês. Cada pergunta é explicada com o método de aprendizado que mais combina com ela (Feynman, 5 Porquês, Comparar, Passo a passo, Playbook, Ameaça→defesa, Primeiros princípios, System design), com resposta de 30 segundos, armadilhas e autoteste. Progresso e idioma ficam no `localStorage` do navegador.

Site: https://attilamonteiro.github.io/guias-de-estudo/

## Guias

| Guia                                | Conteúdo                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Backend](conteudo/backend/guia.ts) | 120 perguntas de entrevista (30 originais + 50 de [roadmap.sh](https://roadmap.sh/questions/backend) + 40 da [MentorCruise](https://mentorcruise.com/questions/backend/)); 26 se repetem e reaproveitam a explicação de outra, então são 94 explicações distintas (progresso conta uma vez)                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| [Node.js](conteudo/nodejs/guia.ts)  | 519 perguntas de entrevista de seis fontes: 61 da [Turing](https://www.turing.com/pt/interview-questions/node-js), 138 de um [artigo no LinkedIn](https://www.linkedin.com/pulse/nodejs-interview-guide-2026-130-questions-every-backend-ashish-misal-l3stc/), 100 do [devinterview.io](https://devinterview.io/questions/web-and-mobile-development/node-interview-questions/), 100 do [Found It](https://www.founditgulf.com/career-advice/nodejs-interview-questions-answers/), 29 do [CoderPad](https://coderpad.io/interview-questions/nodejs-interview-questions/) e 91 de um [gist](https://gist.github.com/paulfranco/9f88a2879b7b7d88de5d1921aef2093b); 349 se repetem e reaproveitam a explicação de outra, então são 170 explicações distintas |

As explicações são originais; do roadmap.sh, da MentorCruise, da Turing, do artigo do LinkedIn, do devinterview.io, do Found It, do CoderPad e do gist vêm apenas os enunciados das perguntas (alguns corrigidos quando a fonte tem erro de tradução ou de digitação).

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

Crie `conteudo/<guia>/perguntas/<id>-<slug>.ts` exportando uma `Pergunta` (copie uma existente). Confira o arquivo com `npm run conferir -- conteudo/backend/perguntas/<arquivo>.ts` e registre-o com `npm run indice` (regenera `perguntas/index.ts` em ordem de número). Os testes reprovam número repetido, módulo inexistente, diferença de estrutura entre PT e EN e marcação `` ` `` / `**` aberta.

Se a pergunta pede o mesmo conteúdo de outra, escreva só o enunciado com `repeteA: <número da outra>` (veja os arquivos `m06-…`): ela mostra a explicação da outra e o progresso conta uma vez. O número segue a fonte, e o rótulo (Q01, R01, M01, T01, L01…) sai do selo (`Fonte.marca`) e da posição na fonte (`número − Fonte.base`): no backend, 1–99 lista original, 101–199 roadmap.sh e 201–299 MentorCruise; no Node.js, 1–61 Turing, 101–238 LinkedIn, 301–400 devinterview.io, 401–500 Found It, 501–529 CoderPad e 601–691 gist (o guia define as faixas em `conteudo/<guia>/guia.ts`).

## Adicionar um guia

1. Crie `conteudo/<id>/guia.ts` (textos nos dois idiomas, módulos e perguntas).
2. Registre-o em `conteudo/guias.ts`. A página inicial, as rotas e os testes passam a incluí-lo.

## Publicação

O workflow `.github/workflows/publicar.yml` testa, gera o site estático e publica no GitHub Pages a cada push na `main` (Settings → Pages → Source: GitHub Actions). O `BASE_PATH` é o nome do repositório.
