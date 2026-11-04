import type { Pergunta } from "../../tipos";

// G81 · Hidden classes no V8
export const g081: Pergunta = {
  numero: 681,
  modulo: "gist-especialista",
  metodo: "feynman",
  pt: {
    titulo: "Hidden classes no V8",
    pergunta: "Qual é o propósito de usar hidden classes no V8?",
    porqueEsteMetodo:
      "Hidden classes são um mecanismo interno que se entende melhor por uma imagem do cotidiano, um formulário padronizado. Depois vêm o mecanismo real e o ponto em que a imagem para de valer, que é também onde mora a honestidade sobre o que é detalhe do motor.",
    resposta30s:
      "O V8 não guarda as propriedades de cada objeto como um dicionário: ele agrupa objetos com **as mesmas propriedades na mesma ordem** numa **classe escondida** (a “forma”, chamada *Map* no V8), que diz onde cada propriedade está. O propósito é **acesso rápido e memória enxuta**: as **inline caches** leem `obj.x` quase como um campo fixo, e o código otimizado pode assumir a forma. Para preservá-la, inicialize tudo no construtor, na mesma ordem, e evite `delete`; mas é detalhe interno do motor, então meça antes de otimizar.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine uma clínica com milhares de fichas de pacientes. Se cada ficha fosse um texto livre, achar a idade de alguém exigiria ler a ficha inteira atrás da palavra “idade”. A clínica adota então um formulário padrão: linha 1 nome, linha 2 idade, linha 3 telefone, sempre nessa ordem. Agora basta conferir que a ficha segue o formulário e ir direto à linha 2, para qualquer paciente. Uma ficha preenchida em outra ordem, ou sem um dos campos, é um formulário diferente, e a atendente volta a conferir ficha por ficha.",
        tecnico:
          "Objetos JavaScript são dinâmicos: dá para acrescentar e remover propriedades a qualquer momento. Guardá-los como dicionários (tabelas de hash) tornaria cada `obj.x` uma busca pelo nome. O V8 agrupa os objetos com **as mesmas propriedades, acrescentadas na mesma ordem**, numa **classe escondida** (*hidden class*, chamada **Map** no V8; outros motores usam *shape* ou *structure*), que descreve o layout: quais propriedades existem e em que posição fica cada valor. Cada objeto guarda só os valores e uma referência à sua classe, e os nomes ficam uma vez só na classe. Acrescentar uma propriedade faz o objeto **transitar** para outra classe, compartilhada por todos que seguirem o mesmo caminho. As **inline caches** anotam, em cada ponto do código que lê `obj.x`, a classe vista e a posição de `x`: da vez seguinte basta conferir a classe e ler a posição. O compilador otimizador usa a mesma informação para gerar código que assume aquela forma e volta ao caminho lento se a suposição falhar.",
        limite:
          "A clínica tem um formulário por tipo de paciente; o V8 cria e descarta formas por conta própria, e isso é detalhe interno: nome, critérios e limites mudam entre versões e não fazem parte da linguagem. Um ponto do código que vê uma só forma é *monomórfico* (o caso mais rápido), poucas formas, *polimórfico*, e muitas, *megamórfico*, quando o ganho some. E objetos que sofrem muitas mudanças, como com `delete`, podem cair em *modo dicionário*, que é a busca por nome que as classes escondidas queriam evitar.",
      },
      {
        tipo: "tabela",
        titulo: "O que mantém ou quebra a forma",
        colunas: ["Prática", "O que acontece com a forma", "O que fazer"],
        linhas: [
          [
            "Inicializar todas as propriedades no construtor, sempre na mesma ordem",
            "Todos os objetos seguem o mesmo caminho de transições e compartilham a forma",
            "É o padrão a seguir: um construtor ou uma fábrica por tipo de objeto",
          ],
          [
            "Literais com as mesmas chaves em ordens diferentes (`{ x, y }` e `{ y, x }`)",
            "São duas formas diferentes, embora o conteúdo seja o mesmo",
            "Escolher uma ordem e mantê-la",
          ],
          [
            "Acrescentar propriedades depois, só em alguns casos (`if (...) obj.extra = 1`)",
            "Cada caminho cria uma transição diferente, e surgem várias formas para o “mesmo” tipo",
            "Declarar tudo na criação, com `null` ou `undefined` quando não houver valor",
          ],
          [
            "`delete obj.x`",
            "Tira o objeto da forma compartilhada e pode levá-lo ao modo dicionário",
            "Atribuir `undefined` ou `null`, criar um objeto novo sem a propriedade, ou usar `Map`",
          ],
          [
            "Mudar o tipo do valor de um campo (inteiro, fração, texto)",
            "Pode exigir outra representação do campo, gerar outra forma e invalidar código já otimizado",
            "Manter o mesmo tipo em cada campo",
          ],
          [
            "Usar um objeto como dicionário de chaves dinâmicas (`cache[id] = ...`)",
            "O motor tende a tratá-lo como dicionário, sem formas estáveis",
            "Usar `Map` para chaves dinâmicas e objetos para registros de formato fixo",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Mesma forma, formas diferentes",
        legenda: "JavaScript",
        codigo: `class Ponto {
  constructor(x, y) {
    this.x = x; // a ordem importa: x primeiro, depois y
    this.y = y;
  }
}

const a = new Ponto(1, 2);
const b = new Ponto(3, 4); // mesma forma que a: o acesso a .x é previsível

const c = { x: 1, y: 2 };
const d = { y: 2, x: 1 }; // mesmas propriedades, outra ordem: outra forma

delete a.y; // a deixa a forma compartilhada com b`,
        nota: "Para conferir de verdade existe a sintaxe nativa do V8 (`node --allow-natives-syntax` com `%HaveSameMap(a, b)`), só para experimentos: ela é interna e pode mudar ou sumir.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "É detalhe do motor: meça antes de otimizar",
        texto:
          "Hidden classes não fazem parte da linguagem: são uma técnica interna do V8, com outros nomes em outros motores, e os critérios mudam entre versões. Escrever objetos com forma estável é uma prática barata e deixa o código mais claro, mas reestruturar código por causa disso só vale em caminhos quentes comprovados por um profiler (veja L111). Antes, o gargalo costuma estar em outro lugar: E/S, algoritmo ou alocação.",
      },
    ],
    armadilhas: [
      "Tratar hidden classes como contrato da linguagem: são detalhe do V8, e nome, critérios e limites mudam entre versões.",
      "Otimizar sem medir: reescrever código que não é quente por causa de “formas” só acrescenta complexidade, sem ganho.",
      "Usar `delete` em objetos de caminhos quentes: ele pode tirar o objeto da forma compartilhada; prefira atribuir `undefined` ou `null`, ou usar `Map`.",
      "Criar objetos do “mesmo tipo” com propriedades condicionais ou em ordens diferentes: cada variação multiplica as formas.",
    ],
    autoteste: [
      {
        pergunta:
          "Por que dois objetos com as mesmas propriedades em ordens diferentes podem ter classes escondidas diferentes?",
        resposta:
          "Porque a forma é construída pelas transições, na ordem em que as propriedades foram acrescentadas. Caminhos diferentes levam a classes diferentes, e um ponto do código que vê as duas deixa de ser monomórfico.",
      },
      {
        pergunta: "Para que servem as inline caches e o que acontece quando um ponto do código vê muitas formas?",
        resposta:
          "Elas guardam, em cada leitura de propriedade, a classe vista e a posição do valor, evitando a busca por nome. Com poucas formas ainda ajudam (polimórfico); com muitas (megamórfico), o ganho some e o acesso volta a um caminho mais genérico e lento.",
      },
    ],
  },
  en: {
    titulo: "Hidden classes in V8",
    pergunta: "What is the purpose of using hidden classes in V8?",
    porqueEsteMetodo:
      "Hidden classes are an internal mechanism that is easier to grasp through an everyday picture, a standardized form. Then come the real mechanism and the point where the picture stops holding, which is also where we are honest about what is an engine detail.",
    resposta30s:
      "V8 does not store each object’s properties as a dictionary: it groups objects that have **the same properties in the same order** into a **hidden class** (the “shape”, called a *Map* in V8) that says where each property is. The purpose is **fast access and lean memory**: **inline caches** read `obj.x` almost like a fixed field, and optimized code can assume the shape. To preserve it, initialize everything in the constructor, in the same order, and avoid `delete`; but it is an internal engine detail, so measure before optimizing.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Picture a clinic with thousands of patient files. If each file were free text, finding someone’s age would mean reading the whole file looking for the word “age”. So the clinic adopts a standard form: line 1 name, line 2 age, line 3 phone, always in that order. Now you only need to check that the file follows the form and go straight to line 2, for any patient. A file filled in a different order, or missing a field, is a different form, and the clerk goes back to checking file by file.",
        tecnico:
          "JavaScript objects are dynamic: you can add and remove properties at any time. Storing them as dictionaries (hash tables) would turn every `obj.x` into a lookup by name. V8 groups objects that have **the same properties, added in the same order**, into a **hidden class** (called a **Map** in V8; other engines say *shape* or *structure*) that describes the layout: which properties exist and where each value sits. Each object stores only the values and a reference to its class, and the names are kept once in the class. Adding a property makes the object **transition** to another class, shared by everything that follows the same path. **Inline caches** record, at each place in the code that reads `obj.x`, the class seen and the position of `x`: next time it only has to check the class and read the position. The optimizing compiler uses the same information to generate code that assumes that shape and falls back to the slow path if the assumption fails.",
        limite:
          "The clinic has one form per kind of patient; V8 creates and discards shapes on its own, and that is an internal detail: the name, criteria and limits change between versions and are not part of the language. A place in the code that sees one shape is *monomorphic* (the fastest case), a few shapes, *polymorphic*, and many, *megamorphic*, when the gain disappears. And objects that undergo many changes, such as with `delete`, may fall into *dictionary mode*, which is the lookup by name that hidden classes were meant to avoid.",
      },
      {
        tipo: "tabela",
        titulo: "What keeps or breaks the shape",
        colunas: ["Practice", "What happens to the shape", "What to do"],
        linhas: [
          [
            "Initializing all properties in the constructor, always in the same order",
            "All objects follow the same path of transitions and share the shape",
            "The pattern to follow: one constructor or factory per kind of object",
          ],
          [
            "Literals with the same keys in different orders (`{ x, y }` and `{ y, x }`)",
            "They are two different shapes, even though the content is the same",
            "Pick one order and keep it",
          ],
          [
            "Adding properties later, only in some cases (`if (...) obj.extra = 1`)",
            "Each path creates a different transition, and several shapes appear for the “same” kind",
            "Declare everything at creation, with `null` or `undefined` when there is no value",
          ],
          [
            "`delete obj.x`",
            "Takes the object out of the shared shape and may push it into dictionary mode",
            "Assign `undefined` or `null`, build a new object without the property, or use `Map`",
          ],
          [
            "Changing the type of a field’s value (integer, fraction, text)",
            "May require another representation of the field, create another shape and invalidate already optimized code",
            "Keep the same type in each field",
          ],
          [
            "Using an object as a dictionary of dynamic keys (`cache[id] = ...`)",
            "The engine tends to treat it as a dictionary, with no stable shapes",
            "Use `Map` for dynamic keys and objects for fixed-shape records",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Same shape, different shapes",
        legenda: "JavaScript",
        codigo: `class Point {
  constructor(x, y) {
    this.x = x; // order matters: x first, then y
    this.y = y;
  }
}

const a = new Point(1, 2);
const b = new Point(3, 4); // same shape as a: access to .x is predictable

const c = { x: 1, y: 2 };
const d = { y: 2, x: 1 }; // same properties, other order: a different shape

delete a.y; // a leaves the shape it shared with b`,
        nota: "To check for real there is V8’s native syntax (`node --allow-natives-syntax` with `%HaveSameMap(a, b)`), for experiments only: it is internal and may change or disappear.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "It is an engine detail: measure before optimizing",
        texto:
          "Hidden classes are not part of the language: they are an internal V8 technique, with other names in other engines, and the criteria change between versions. Writing objects with a stable shape is a cheap practice and makes code clearer, but restructuring code because of it only pays off on hot paths proven by a profiler (see L111). Before that, the bottleneck is usually elsewhere: I/O, algorithm or allocation.",
      },
    ],
    armadilhas: [
      "Treating hidden classes as a language contract: they are a V8 detail, and the name, criteria and limits change between versions.",
      "Optimizing without measuring: rewriting code that is not hot because of “shapes” only adds complexity, with no gain.",
      "Using `delete` on hot-path objects: it may take the object out of the shared shape; prefer assigning `undefined` or `null`, or using `Map`.",
      "Creating objects of the “same kind” with conditional properties or in different orders: every variation multiplies the shapes.",
    ],
    autoteste: [
      {
        pergunta: "Why can two objects with the same properties in different orders have different hidden classes?",
        resposta:
          "Because the shape is built by transitions, in the order the properties were added. Different paths lead to different classes, and a place in the code that sees both stops being monomorphic.",
      },
      {
        pergunta: "What are inline caches for, and what happens when a place in the code sees many shapes?",
        resposta:
          "At each property read they store the class seen and the position of the value, avoiding the lookup by name. With a few shapes they still help (polymorphic); with many (megamorphic) the gain disappears and the access falls back to a more generic, slower path.",
      },
    ],
  },
};
