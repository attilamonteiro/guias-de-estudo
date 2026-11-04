import type { Pergunta } from "../../tipos";

// R35 · Deploy blue-green
export const r35: Pergunta = {
  numero: 135,
  modulo: "roadmap-avancado",
  metodo: "trace",
  pt: {
    titulo: "Deploy blue-green",
    pergunta: "Descreva o uso da estratégia de deploy blue-green em serviços de backend.",
    porqueEsteMetodo:
      "Blue-green é uma troca em passos ordenados. Seguir o deploy do ambiente novo até o rollback mostra onde está a vantagem e onde estão os riscos.",
    resposta30s:
      "Mantêm-se **dois ambientes de produção idênticos**: um (azul) atende o tráfego real e o outro (verde) recebe a versão nova. Depois de testada, o **roteamento troca de uma vez** para o verde. O azul fica de pé como plano B, então o **rollback é só reapontar o tráfego**, em segundos. O desafio é o **banco compartilhado**, que precisa ser compatível com as duas versões.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Passo a passo",
        etapas: [
          "A produção atual roda no ambiente **Azul** (recebe todo o tráfego)",
          "Implanta a versão nova no ambiente **Verde** (idêntico, sem tráfego)",
          "Roda migrações compatíveis, smoke tests e verificações no Verde",
          "Troca o roteamento (balanceador ou DNS): 100% do tráfego vai para o Verde",
          "Observa as métricas; o Azul fica de pé como plano B",
          "Problema? Volta o roteamento para o Azul em segundos (rollback)",
        ],
      },
      {
        tipo: "tabela",
        titulo: "Blue-green, rolling e canary",
        colunas: ["Estratégia", "Como", "Rollback", "Custo"],
        linhas: [
          [
            "Blue-green",
            "Dois ambientes completos; troca de uma vez",
            "Instantâneo",
            "Alto (infraestrutura dobrada durante a troca)",
          ],
          ["Rolling", "Atualiza instâncias aos poucos no mesmo ambiente", "Lento (reverte instâncias)", "Baixo"],
          [
            "Canary",
            "Poucos % do tráfego vão para a versão nova, aumentando aos poucos",
            "Rápido (tira o canary)",
            "Médio; exige mais observabilidade",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O banco é o ponto difícil",
        texto:
          "Os dois ambientes costumam compartilhar o banco. As migrações precisam ser **compatíveis com as duas versões** (expandir, migrar, contrair; veja a R37), senão o rollback quebra.",
      },
    ],
    armadilhas: [
      "Migração de banco incompatível com a versão antiga: sem rollback possível.",
      "Ambientes que divergem (não são idênticos).",
      "Desligar o ambiente antigo cedo demais.",
      "Sessões e caches que se perdem na troca.",
    ],
    autoteste: [
      {
        pergunta: "Qual a principal vantagem do blue-green?",
        resposta:
          "Rollback quase instantâneo, só reapontando o tráfego para o ambiente anterior, e deploy sem indisponibilidade.",
      },
      {
        pergunta: "Qual o principal desafio?",
        resposta:
          "O banco e o esquema compartilhados, que precisam ser compatíveis com as duas versões, além do custo de manter dois ambientes.",
      },
    ],
  },
  en: {
    titulo: "Blue-green deployment",
    pergunta: "Describe the use of the blue-green deployment strategy in backend services.",
    porqueEsteMetodo:
      "Blue-green is a switch in ordered steps. Following the deploy from the new environment to the rollback shows where the advantage lies and where the risks are.",
    resposta30s:
      "You keep **two identical production environments**: one (blue) serves real traffic and the other (green) receives the new version. Once tested, the **routing switches all at once** to green. Blue stays up as a fallback, so **rollback is just repointing traffic**, in seconds. The challenge is the **shared database**, which must be compatible with both versions.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Step by step",
        etapas: [
          "Current production runs on the **Blue** environment (all traffic)",
          "Deploy the new version to the **Green** environment (identical, no traffic)",
          "Run compatible migrations, smoke tests and checks on Green",
          "Switch the routing (load balancer or DNS): 100% of traffic goes to Green",
          "Watch the metrics; Blue stays up as the fallback",
          "Problem? Point the routing back to Blue in seconds (rollback)",
        ],
      },
      {
        tipo: "tabela",
        titulo: "Blue-green, rolling and canary",
        colunas: ["Strategy", "How", "Rollback", "Cost"],
        linhas: [
          [
            "Blue-green",
            "Two full environments; switch at once",
            "Instant",
            "High (doubled infrastructure during the switch)",
          ],
          ["Rolling", "Update instances gradually in the same environment", "Slow (revert instances)", "Low"],
          [
            "Canary",
            "A small % of traffic goes to the new version, growing gradually",
            "Fast (remove the canary)",
            "Medium; needs more observability",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The database is the hard part",
        texto:
          "The two environments usually share the database. Migrations must be **compatible with both versions** (expand, migrate, contract; see R37), or rollback breaks.",
      },
    ],
    armadilhas: [
      "A database migration incompatible with the old version: no rollback possible.",
      "Environments that drift apart (not identical).",
      "Shutting down the old environment too early.",
      "Sessions and caches lost in the switch.",
    ],
    autoteste: [
      {
        pergunta: "What is blue-green’s main advantage?",
        resposta:
          "Near-instant rollback, just repointing traffic to the previous environment, and deploys with no downtime.",
      },
      {
        pergunta: "What is the main challenge?",
        resposta:
          "The shared database and schema, which must be compatible with both versions, plus the cost of running two environments.",
      },
    ],
  },
};
