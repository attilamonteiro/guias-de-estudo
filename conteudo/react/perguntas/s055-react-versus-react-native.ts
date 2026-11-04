import type { Pergunta } from "../../tipos";

// S55 · React versus React Native
export const s055: Pergunta = {
  numero: 655,
  modulo: "simplilearn-avancado",
  metodo: "compare",
  pt: {
    titulo: "React versus React Native",
    pergunta: "Como o React é diferente do React Native?",
    porqueEsteMetodo:
      "Os dois compartilham o modelo e mudam o destino, e a confusão está nos detalhes: primitivos, estilos, navegação. Uma matriz lado a lado mostra o que muda, e a regra de decisão diz o que dá para reaproveitar.",
    resposta30s:
      "O **React** é a biblioteca que descreve a interface em componentes e decide o que mudar; com o `react-dom`, ele desenha **elementos do DOM** no navegador. O **React Native** usa o mesmo modelo (componentes, props, estado, hooks), mas desenha **views nativas** de iOS e Android, com primitivos como `View` e `Text`, estilos em objetos JavaScript e navegação própria. Escolha pelo destino (site ou aplicativo móvel) e reaproveite **lógica e hooks**, não a camada de interface.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "O mesmo modelo, destinos diferentes",
        colunas: ["Aspecto", "React (web)", "React Native"],
        linhas: [
          [
            "O que é",
            "Biblioteca de componentes e de lógica de renderização; com o `react-dom`, desenha na web",
            "Plataforma que usa o React para montar a interface de aplicativos móveis: o React é o motor, e o React Native fornece os componentes e a ligação com o sistema",
          ],
          [
            "Alvo de renderização",
            "Elementos do DOM do navegador (HTML)",
            "Views nativas de iOS e Android; não há DOM",
          ],
          [
            "Primitivos",
            "`div`, `span`, `p`, `img`, `button`, `input`",
            "`View`, `Text`, `Image`, `Pressable`, `TextInput`, `FlatList`. Todo texto precisa estar dentro de `Text`",
          ],
          [
            "Estilos",
            "CSS (arquivos, classes, media queries, CSS-in-JS)",
            "Objetos de estilo em JavaScript (`StyleSheet.create`), com propriedades em camelCase, flexbox como layout e sem a cascata do CSS",
          ],
          ["Eventos", "`onClick`, `onChange`, mouse e teclado", "`onPress`, gestos de toque, `onChangeText`"],
          [
            "Navegação",
            "URLs e histórico do navegador; React Router ou o roteador de um framework",
            "Pilhas, abas e telas (React Navigation ou Expo Router); não há barra de endereços, e os links profundos são configurados",
          ],
          [
            "Recursos do aparelho",
            "APIs do navegador, com permissões limitadas",
            "Câmera, GPS, sensores, notificações e armazenamento, por módulos nativos e bibliotecas (como as do Expo)",
          ],
          [
            "Distribuição",
            "Publica-se o site, e a atualização chega ao recarregar",
            "Gera-se um binário para as lojas de aplicativos, com revisão; parte das atualizações pode chegar por JavaScript, conforme as regras das lojas",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "O mesmo componente na web",
        legenda: "JSX (React)",
        codigo: `// React (web): elementos do DOM e CSS
function Aviso({ texto, aoFechar }) {
  return (
    <div className="aviso">
      <p>{texto}</p>
      <button onClick={aoFechar}>Fechar</button>
    </div>
  );
}`,
      },
      {
        tipo: "codigo",
        titulo: "E no aplicativo móvel",
        legenda: "JSX (React Native)",
        codigo: `// React Native: componentes nativos e estilos em objetos
import { View, Text, Pressable, StyleSheet } from "react-native";

function Aviso({ texto, aoFechar }) {
  return (
    <View style={estilos.aviso}>
      <Text>{texto}</Text>
      <Pressable onPress={aoFechar}>
        <Text>Fechar</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  aviso: { padding: 12, backgroundColor: "#eee" },
});`,
        nota: "A lógica (props, estado, hooks) é a mesma nos dois; muda a camada de interface.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Escolha pelo destino e compartilhe a lógica",
        texto:
          "Site ou aplicação web: React, em geral com um framework. Aplicativo instalável, com câmera, GPS ou notificações: React Native. O que se **reaproveita** entre os dois: o modelo mental (componentes, props, estado, efeitos), os **hooks personalizados**, a lógica de negócio, as validações, os tipos e os clientes de API. O que **não se reaproveita**: a camada de interface (`div` e CSS contra `View` e estilos) e a navegação. Há ferramentas que tentam unificar a interface, como o React Native Web, mas avalie caso a caso.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "React Native não é um site dentro de um aplicativo",
        texto:
          "Um aplicativo que só abre uma página web numa WebView é outra coisa. No React Native, o JavaScript roda no aparelho e comanda componentes nativos, sem HTML e sem o CSS do navegador. “Escreva uma vez, rode em todo lugar” tem limites: telas, gestos, permissões e convenções de cada plataforma diferem, e partes do código precisam ser específicas. Confira react.dev e a documentação do React Native (reactnative.dev), porque os dois evoluem.",
      },
    ],
    armadilhas: [
      "Achar que o React Native é um site empacotado numa WebView, ou que usa HTML e CSS: ele desenha componentes nativos.",
      "Esperar copiar componentes da web (`div`, `className`, CSS) para o aplicativo: a camada de interface precisa ser reescrita.",
      "Deixar texto solto fora de `<Text>` no React Native: o texto sempre vai dentro de um `Text`.",
      "Tratar os dois como concorrentes: o React Native é construído sobre o React, e o mesmo conhecimento de componentes, estado e hooks vale nos dois.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a relação entre o React e o React Native?",
        resposta:
          "O núcleo é o mesmo: componentes, props, estado, hooks e reconciliação. O que muda é o destino da renderização: o React desenha elementos do DOM no navegador, e o React Native desenha views nativas de iOS e Android.",
      },
      {
        pergunta: "O que dá para compartilhar entre o site e o aplicativo?",
        resposta:
          "A lógica de negócio, os hooks personalizados, as validações, os tipos e os clientes de API. A interface (primitivos, estilos) e a navegação costumam ser separadas.",
      },
    ],
  },
  en: {
    titulo: "React versus React Native",
    pergunta: "How is React different from React Native?",
    porqueEsteMetodo:
      "The two share the model and change the destination, and the confusion lives in the details: primitives, styles, navigation. A side-by-side matrix shows what changes, and the decision rule says what you can reuse.",
    resposta30s:
      "**React** is the library that describes the interface in components and decides what to change; with `react-dom`, it draws **DOM elements** in the browser. **React Native** uses the same model (components, props, state, hooks) but draws **native views** on iOS and Android, with primitives such as `View` and `Text`, styles as JavaScript objects and its own navigation. Choose by destination (a website or a mobile app) and reuse **logic and hooks**, not the interface layer.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The same model, different destinations",
        colunas: ["Aspect", "React (web)", "React Native"],
        linhas: [
          [
            "What it is",
            "A library of components and rendering logic; with `react-dom`, it draws on the web",
            "A platform that uses React to build the interface of mobile apps: React is the engine, and React Native supplies the components and the link to the system",
          ],
          ["Rendering target", "The browser’s DOM elements (HTML)", "Native views on iOS and Android; there is no DOM"],
          [
            "Primitives",
            "`div`, `span`, `p`, `img`, `button`, `input`",
            "`View`, `Text`, `Image`, `Pressable`, `TextInput`, `FlatList`. All text must be inside `Text`",
          ],
          [
            "Styles",
            "CSS (files, classes, media queries, CSS-in-JS)",
            "JavaScript style objects (`StyleSheet.create`), with camelCase properties, flexbox for layout and no CSS cascade",
          ],
          ["Events", "`onClick`, `onChange`, mouse and keyboard", "`onPress`, touch gestures, `onChangeText`"],
          [
            "Navigation",
            "URLs and browser history; React Router or a framework’s router",
            "Stacks, tabs and screens (React Navigation or Expo Router); there is no address bar, and deep links are configured",
          ],
          [
            "Device features",
            "Browser APIs, with limited permissions",
            "Camera, GPS, sensors, notifications and storage, through native modules and libraries (such as Expo’s)",
          ],
          [
            "Distribution",
            "You publish the site, and the update arrives on reload",
            "You build a binary for the app stores, with review; part of the updates can arrive through JavaScript, depending on store rules",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The same component on the web",
        legenda: "JSX (React)",
        codigo: `// React (web): DOM elements and CSS
function Notice({ text, onClose }) {
  return (
    <div className="notice">
      <p>{text}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}`,
      },
      {
        tipo: "codigo",
        titulo: "And in the mobile app",
        legenda: "JSX (React Native)",
        codigo: `// React Native: native components and styles as objects
import { View, Text, Pressable, StyleSheet } from "react-native";

function Notice({ text, onClose }) {
  return (
    <View style={styles.notice}>
      <Text>{text}</Text>
      <Pressable onPress={onClose}>
        <Text>Close</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: { padding: 12, backgroundColor: "#eee" },
});`,
        nota: "The logic (props, state, hooks) is the same in both; the interface layer changes.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Choose by destination and share the logic",
        texto:
          "Website or web application: React, usually with a framework. Installable app with camera, GPS or notifications: React Native. What you **reuse** between the two: the mental model (components, props, state, effects), **custom hooks**, business logic, validations, types and API clients. What you **do not reuse**: the interface layer (`div` and CSS versus `View` and styles) and navigation. There are tools that try to unify the interface, such as React Native Web, but weigh them case by case.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "React Native is not a website inside an app",
        texto:
          "An app that just opens a web page in a WebView is something else. In React Native, the JavaScript runs on the device and drives native components, with no HTML and no browser CSS. “Write once, run anywhere” has limits: the screens, gestures, permissions and conventions of each platform differ, and parts of the code must be specific. Check react.dev and the React Native documentation (reactnative.dev), because both evolve.",
      },
    ],
    armadilhas: [
      "Thinking React Native is a website packaged in a WebView, or that it uses HTML and CSS: it draws native components.",
      "Expecting to copy web components (`div`, `className`, CSS) into the app: the interface layer has to be rewritten.",
      "Leaving loose text outside `<Text>` in React Native: text always goes inside a `Text`.",
      "Treating the two as competitors: React Native is built on React, and the same knowledge of components, state and hooks applies to both.",
    ],
    autoteste: [
      {
        pergunta: "What is the relationship between React and React Native?",
        resposta:
          "The core is the same: components, props, state, hooks and reconciliation. What changes is the rendering destination: React draws DOM elements in the browser, and React Native draws native views on iOS and Android.",
      },
      {
        pergunta: "What can be shared between the website and the app?",
        resposta:
          "Business logic, custom hooks, validations, types and API clients. The interface (primitives, styles) and navigation are usually separate.",
      },
    ],
  },
};
