import type { Pergunta } from "../../tipos";

// L131 · O que é useEffectEvent
export const l131: Pergunta = {
  numero: 131,
  modulo: "linkedin-react19",
  metodo: "firstprinciples",
  pt: {
    titulo: "O que é useEffectEvent",
    pergunta: "O que é useEffectEvent()?",
    porqueEsteMetodo:
      "A regra “o efeito deve declarar tudo o que lê” é clara, e o problema que o `useEffectEvent` resolve só aparece quando ela esbarra em outra necessidade. Partindo da versão ingênua e consertando uma falha por vez, o hook surge como a saída natural.",
    resposta30s:
      "`useEffectEvent` extrai de um efeito a parte que **só precisa ler o valor mais recente** de uma prop ou estado, sem reagir a ele: a função devolvida **enxerga sempre os valores atuais** e **não entra nas dependências**. Assim o efeito reinicia só quando muda o que de fato define a sincronização, sem dependências demais e sem closure obsoleta. Use-o para a parte do efeito que é uma reação (notificar ao conectar, registrar uma mensagem) e só a chame de dentro de efeitos.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma falha por vez",
        passos: [
          {
            titulo: "0. O cenário",
            texto:
              "Um efeito conecta a uma sala de chat e deve reconectar quando `idDaSala` muda. Quando a conexão abre, ele mostra um aviso no `tema` atual. A conexão depende da sala; o aviso só precisa **ler** o tema, não reagir a ele.",
          },
          {
            titulo: "1. A versão ingênua: ler sem declarar",
            texto:
              "Usar `tema` dentro do efeito e deixar as dependências só com `[idDaSala]`. → Quebra: o efeito captura o `tema` da renderização em que nasceu (**closure obsoleta**), então depois de uma troca de tema o aviso usa o valor antigo, e a regra `exhaustive-deps` do lint reclama com razão.",
          },
          {
            titulo: "2. Silenciar o lint",
            texto:
              "Desligar a regra naquela linha. → Quebra: o bug continua, só que agora ninguém avisa. Uma dependência não declarada é uma mentira sobre o que o efeito lê.",
          },
          {
            titulo: "3. Declarar tudo",
            texto:
              "Colocar `tema` nas dependências. → Resolve a closure, mas cada troca de tema **desfaz e refaz a conexão**: reconexões desnecessárias, mensagens perdidas e custo de rede, por causa de um valor que a conexão nem usa.",
          },
          {
            titulo: "4. O remendo antigo: uma ref",
            texto:
              "Guardar o `tema` numa ref atualizada por outro efeito e ler `ref.current`. → Funciona, mas é um remendo manual: esconde a intenção e exige cuidado com o momento em que a ref é atualizada.",
          },
          {
            titulo: "5. O conserto: separar sincronização de reação",
            texto:
              "`useEffectEvent` declara que aquele trecho é uma **reação** (“avisar que conectou”) e não parte da **sincronização** (“manter a conexão com esta sala”). A função devolvida lê sempre o `tema` mais recente e fica fora das dependências; o efeito volta a depender só de `idDaSala`.",
          },
          {
            titulo: "6. Os limites",
            texto:
              "Chame o Effect Event só de dentro de um efeito (ou de outro Effect Event), nunca durante a renderização, e não o passe adiante como prop nem o coloque nas dependências. Declare-o no mesmo componente ou hook do efeito. E não o use para esconder uma dependência que deveria reiniciar o efeito.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Reconectar só quando a sala muda",
        legenda: "TSX",
        codigo: `import { useEffect, useEffectEvent } from "react";

function SalaDeChat({ idDaSala, tema }: { idDaSala: string; tema: "claro" | "escuro" }) {
  const aoConectar = useEffectEvent(() => {
    mostrarAviso("Conectado!", tema); // sempre lê o tema mais recente
  });

  useEffect(() => {
    const conexao = criarConexao(idDaSala);
    conexao.on("conectado", () => aoConectar());
    conexao.conectar();
    return () => conexao.desconectar();
  }, [idDaSala]); // sem \`tema\` e sem \`aoConectar\`

  return null;
}`,
        nota: "`criarConexao` e `mostrarAviso` são funções suas. O lint do React reconhece os Effect Events e não pede o `aoConectar` nas dependências; use a versão atual do plugin e confira react.dev.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A pergunta de decisão",
        texto:
          "Pergunte: **se este valor mudar, o efeito deve rodar de novo?** Se sim, é dependência normal. Se não, e você só quer ler o valor atual no momento em que algo acontece dentro do efeito (uma mensagem chega, a conexão abre, um timer dispara), é caso de `useEffectEvent`. Ele não é um atalho para calar o lint: se você o usa para ocultar uma dependência que muda o resultado do efeito, o bug só muda de lugar.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Limites e ressalvas",
        texto:
          "É um recurso recente: confira em react.dev o estado atual e o suporte do lint. A identidade da função muda a cada renderização de propósito, por isso ela não deve ser passada a filhos nem colocada em dependências, e ele também não é necessário em handlers comuns (`onClick` já lê o estado da renderização atual). Chamá-lo na renderização, em outro componente ou de dentro de uma função enviada para fora do efeito é erro.",
      },
    ],
    armadilhas: [
      "Usar `useEffectEvent` para calar o lint de uma dependência que, na verdade, deveria reiniciar o efeito: o bug só muda de lugar.",
      "Chamar o Effect Event na renderização, em um handler comum ou passá-lo a um componente filho: ele só pode ser chamado de dentro de efeitos.",
      "Colocá-lo no array de dependências: não é necessário, e a identidade dele muda a cada renderização de propósito.",
      "Tirar um valor das dependências com `// eslint-disable` em vez de extraí-lo: o efeito passa a usar um valor obsoleto sem avisar.",
    ],
    autoteste: [
      {
        pergunta: "Quando usar `useEffectEvent` em vez de colocar a lógica direto no `useEffect`?",
        resposta:
          "Quando uma parte do efeito precisa ler o valor mais recente de uma prop ou estado no momento de uma reação (mensagem recebida, conexão aberta), mas esse valor não deve reiniciar o efeito. Se o valor deve reiniciar o efeito, ele é uma dependência normal.",
      },
      {
        pergunta: "O que causa a closure obsoleta em um efeito?",
        resposta:
          "O efeito captura os valores da renderização em que foi criado. Se você lê um valor sem declará-lo nas dependências, o efeito continua com o valor antigo quando ele muda.",
      },
    ],
  },
  en: {
    titulo: "What useEffectEvent is",
    pergunta: "What is useEffectEvent()?",
    porqueEsteMetodo:
      "The rule “an effect must declare everything it reads” is clear, and the problem `useEffectEvent` solves only shows up when it collides with another need. Starting from the naive version and fixing one flaw at a time, the hook emerges as the natural way out.",
    resposta30s:
      "`useEffectEvent` extracts from an effect the part that **only needs to read the latest value** of a prop or state without reacting to it: the returned function **always sees the current values** and **stays out of the dependencies**. That way the effect restarts only when what really defines the synchronization changes, with no excess dependencies and no stale closure. Use it for the part of the effect that is a reaction (notify on connect, log a message), and call it only from inside effects.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one flaw at a time",
        passos: [
          {
            titulo: "0. The scenario",
            texto:
              "An effect connects to a chat room and must reconnect when `roomId` changes. When the connection opens, it shows a notice in the current `theme`. The connection depends on the room; the notice only needs to **read** the theme, not react to it.",
          },
          {
            titulo: "1. The naive version: read without declaring",
            texto:
              "Use `theme` inside the effect and leave the dependencies as just `[roomId]`. → Breaks: the effect captures the `theme` from the render it was born in (a **stale closure**), so after a theme change the notice uses the old value, and the lint’s `exhaustive-deps` rule rightly complains.",
          },
          {
            titulo: "2. Silence the lint",
            texto:
              "Turn the rule off on that line. → Breaks: the bug remains, only now nobody warns you. An undeclared dependency is a lie about what the effect reads.",
          },
          {
            titulo: "3. Declare everything",
            texto:
              "Put `theme` in the dependencies. → Fixes the closure, but every theme change **tears down and rebuilds the connection**: needless reconnections, lost messages and network cost, because of a value the connection doesn’t even use.",
          },
          {
            titulo: "4. The old patch: a ref",
            texto:
              "Keep `theme` in a ref updated by another effect and read `ref.current`. → It works, but it is a manual patch: it hides the intent and needs care about when the ref gets updated.",
          },
          {
            titulo: "5. The fix: separate synchronization from reaction",
            texto:
              "`useEffectEvent` declares that this piece is a **reaction** (“announce that we connected”) and not part of the **synchronization** (“keep the connection to this room”). The returned function always reads the latest `theme` and stays out of the dependencies; the effect goes back to depending only on `roomId`.",
          },
          {
            titulo: "6. The limits",
            texto:
              "Call the Effect Event only from inside an effect (or another Effect Event), never during render, and don’t pass it along as a prop or put it in dependencies. Declare it in the same component or hook as the effect. And don’t use it to hide a dependency that should restart the effect.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Reconnect only when the room changes",
        legenda: "TSX",
        codigo: `import { useEffect, useEffectEvent } from "react";

function ChatRoom({ roomId, theme }: { roomId: string; theme: "light" | "dark" }) {
  const onConnected = useEffectEvent(() => {
    showNotice("Connected!", theme); // always reads the latest theme
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on("connected", () => onConnected());
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // no \`theme\` and no \`onConnected\`

  return null;
}`,
        nota: "`createConnection` and `showNotice` are your own functions. React’s lint recognizes Effect Events and doesn’t ask for `onConnected` in the dependencies; use the current version of the plugin and check react.dev.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The deciding question",
        texto:
          "Ask: **if this value changes, should the effect run again?** If yes, it is a normal dependency. If not, and you only want to read the current value at the moment something happens inside the effect (a message arrives, the connection opens, a timer fires), it is a case for `useEffectEvent`. It is not a shortcut to silence the lint: if you use it to hide a dependency that changes the effect’s result, the bug just moves elsewhere.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Limits and caveats",
        texto:
          "It is a recent feature: check react.dev for the current status and lint support. The function’s identity changes on every render on purpose, so it should not be passed to children or put in dependencies, and it isn’t needed in ordinary handlers either (`onClick` already reads the state of the current render). Calling it during render, in another component or from inside a function sent out of the effect is an error.",
      },
    ],
    armadilhas: [
      "Using `useEffectEvent` to silence the lint on a dependency that should actually restart the effect: the bug just moves elsewhere.",
      "Calling the Effect Event during render, in an ordinary handler, or passing it to a child component: it can only be called from inside effects.",
      "Putting it in the dependency array: it isn’t needed, and its identity changes on every render on purpose.",
      "Removing a value from the dependencies with `// eslint-disable` instead of extracting it: the effect starts using a stale value without warning.",
    ],
    autoteste: [
      {
        pergunta: "When should you use `useEffectEvent` instead of putting the logic directly inside `useEffect`?",
        resposta:
          "When part of the effect needs to read the latest value of a prop or state at the moment of a reaction (a message received, a connection opened), but that value should not restart the effect. If the value should restart the effect, it is a normal dependency.",
      },
      {
        pergunta: "What causes a stale closure in an effect?",
        resposta:
          "The effect captures the values from the render it was created in. If you read a value without declaring it in the dependencies, the effect keeps the old value when it changes.",
      },
    ],
  },
};
