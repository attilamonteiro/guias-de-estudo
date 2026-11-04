import type { Pergunta } from "../../tipos";

// L156 · Como validar formulários
export const l156: Pergunta = {
  numero: 156,
  modulo: "linkedin-formularios-e-dados",
  metodo: "playbook",
  pt: {
    titulo: "Como validar formulários",
    pergunta: "Como você lida com a validação de formulários?",
    porqueEsteMetodo:
      "Validar bem é uma sequência de decisões: onde ficam as regras, quando mostrar o erro, como torná-lo acessível e quem tem a palavra final. Um playbook dá a ordem e o sinal de que cada passo está certo.",
    resposta30s:
      "Valide **no cliente para dar resposta rápida** e **no servidor como fonte de verdade**, nunca só no cliente. Escreva as regras uma vez, num esquema (Zod ou Yup, por exemplo), use a validação nativa do HTML onde bastar e uma biblioteca como o **React Hook Form** para formulários maiores. Mostre o erro **no momento certo** (ao enviar, ao sair do campo), com mensagem **ligada ao campo** para leitores de tela, e trate os erros que o servidor devolver.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: do esquema ao erro que o servidor devolve",
        passos: [
          {
            titulo: "Escreva as regras uma vez",
            texto:
              "Liste o que cada campo exige (obrigatório, formato, tamanho, relação entre campos) num esquema único, por exemplo com Zod ou Yup. Sinal de acerto: a mesma regra vira o tipo TypeScript e serve ao cliente e, se possível, ao servidor.",
          },
          {
            titulo: "Comece pelo HTML nativo",
            texto:
              '`required`, `type="email"`, `minLength`, `min`, `max` e `pattern` já bloqueiam o envio e mostram mensagem, com teclado e leitor de tela funcionando. Use `noValidate` no `<form>` quando quiser mensagens próprias, e a Constraint Validation API (`checkValidity`, `setCustomValidity`) para os casos especiais.',
          },
          {
            titulo: "Escolha o momento do erro",
            texto:
              "Ao enviar sempre; ao sair do campo para formatos; ao digitar só para ajudar (força da senha) ou para sumir com um erro já mostrado. Critério: nunca acuse um campo que a pessoa ainda nem terminou de preencher (veja a tabela).",
          },
          {
            titulo: "Ligue a mensagem ao campo",
            texto:
              '`<label htmlFor>` no campo, `aria-invalid` quando há erro, `aria-describedby` apontando para o texto da mensagem (que pode ter `role="alert"`). Depois de um envio com erro, leve o foco ao primeiro campo inválido. Não dependa só da cor vermelha.',
          },
          {
            titulo: "Use uma biblioteca quando o formulário crescer",
            texto:
              "O React Hook Form registra campos sem estado por tecla e aceita um “resolver” de Zod ou Yup. Ele cuida de erros, de campos tocados e do estado de envio. Em formulários de dois campos, `useState` e HTML nativo costumam bastar.",
          },
          {
            titulo: "Valide de novo no servidor e mostre o que ele devolver",
            texto:
              'O servidor revalida tudo e devolve erros por campo (por exemplo, 422 com `{ email: "E-mail já cadastrado" }`). No cliente, mapeie cada mensagem ao campo certo (no React Hook Form, `setError`) sem apagar o que a pessoa digitou. Sinal de acerto: um erro que só o servidor sabe aparece no mesmo lugar dos outros.',
          },
          {
            titulo: "Teste o caminho inválido",
            texto:
              "Com a Testing Library, envie vazio, confira a mensagem pelo papel (`getByRole('alert')`) e o foco, depois corrija o campo e confirme que o erro some. Veja L196.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Quando mostrar o erro",
        colunas: ["Momento", "Bom para", "Cuidado"],
        linhas: [
          [
            "Ao enviar",
            "Regras gerais; é o padrão mais seguro",
            "Em formulário longo a resposta vem tarde: foque o primeiro campo inválido",
          ],
          [
            "Ao sair do campo (`onBlur`)",
            "Formatos como e-mail, telefone e documento",
            "Não mostre erro em campo que a pessoa nem tocou",
          ],
          [
            "Ao digitar (`onChange`)",
            "Ajuda ao vivo (força da senha, contador) e correção de um erro já exibido",
            "Erro a cada tecla antes de a pessoa terminar irrita e faz o leitor de tela falar demais",
          ],
          [
            "Depois do envio (servidor)",
            "Regras que só o servidor conhece: e-mail já cadastrado, permissão",
            "Mapear a mensagem ao campo certo e preservar o digitado",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "React Hook Form com Zod",
        legenda: "TSX",
        codigo: [
          'import { useForm } from "react-hook-form";',
          'import { zodResolver } from "@hookform/resolvers/zod";',
          'import { z } from "zod";',
          "",
          'const esquema = z.object({ email: z.string().email("E-mail inválido") });',
          "type Dados = z.infer<typeof esquema>;",
          "",
          "export function Cadastro({ enviar }: { enviar: (dados: Dados) => Promise<void> }) {",
          "  const { register, handleSubmit, formState } = useForm<Dados>({",
          "    resolver: zodResolver(esquema),",
          '    mode: "onTouched", // valida ao sair do campo e, depois, a cada mudança',
          "  });",
          "  const erro = formState.errors.email?.message;",
          "  return (",
          "    <form onSubmit={handleSubmit(enviar)} noValidate>",
          '      <label htmlFor="email">E-mail</label>',
          '      <input id="email" type="email" aria-invalid={!!erro} aria-describedby="email-erro" {...register("email")} />',
          '      <p id="email-erro" role="alert">{erro}</p>',
          "      <button disabled={formState.isSubmitting}>Criar conta</button>",
          "    </form>",
          "  );",
          "}",
        ].join("\n"),
        nota: "As APIs do Zod, do React Hook Form e dos resolvers mudam entre versões (inclusive a forma de validar e-mail); confira a documentação. O campo não é controlado: o `register` evita um re-render por tecla.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Cliente é conforto, servidor é verdade",
        texto:
          "A validação do cliente existe para a **experiência**: resposta imediata e menos idas e vindas. Qualquer pessoa contorna o navegador (DevTools, `curl`, um script), então **o servidor valida tudo de novo**, além de autorização e regras de negócio. O ideal é compartilhar o mesmo esquema entre os dois lados, sem que o cliente seja a única defesa.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O custo de re-render em formulários controlados",
        texto:
          "Com um `useState` por campo, cada tecla re-renderiza o formulário inteiro. Em formulários pequenos isso passa despercebido; nos grandes, prefira campos não controlados (o `register` do React Hook Form), assine só o que precisa (`useWatch`) e separe os campos em componentes. Meça antes de otimizar. Sobre controlados e não controlados, veja L155.",
      },
    ],
    armadilhas: [
      "Validar só no cliente: o servidor aceita dado inválido ou malicioso, porque qualquer um chama a API sem passar pela interface.",
      "Validar a cada tecla desde a primeira: o erro aparece antes de a pessoa terminar de digitar e o leitor de tela anuncia sem parar.",
      "Mostrar o erro só em vermelho, em `title` ou no `placeholder`: sem texto associado ao campo (`aria-describedby`), parte das pessoas não percebe.",
      "Usar uma expressão regular rígida demais para e-mail ou telefone: ela rejeita endereços válidos; valide o formato básico e confirme de verdade (por exemplo, com um e-mail de confirmação).",
    ],
    autoteste: [
      {
        pergunta: "Por que a validação no cliente não basta?",
        resposta:
          "Porque o cliente está nas mãos de quem usa: dá para desligar o JavaScript, mexer no DOM ou chamar a API direto. A validação do cliente melhora a experiência; só a do servidor protege os dados.",
      },
      {
        pergunta: "Como ligar a mensagem de erro ao campo para os leitores de tela?",
        resposta:
          'Com um `<label>` associado ao campo, `aria-invalid` quando há erro e `aria-describedby` apontando para o id do elemento da mensagem (que pode ter `role="alert"`). Após um envio com erro, leve o foco ao primeiro campo inválido.',
      },
    ],
  },
  en: {
    titulo: "Validating form input",
    pergunta: "How do you handle form validation?",
    porqueEsteMetodo:
      "Good validation is a sequence of decisions: where the rules live, when to show the error, how to make it accessible and who has the final word. A playbook gives the order and the sign that each step is right.",
    resposta30s:
      "Validate **on the client for fast feedback** and **on the server as the source of truth**, never on the client alone. Write the rules once, in a schema (Zod or Yup, for example), use native HTML validation where it is enough and a library such as **React Hook Form** for larger forms. Show the error **at the right moment** (on submit, on blur), with a message **tied to the field** for screen readers, and handle the errors the server returns.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from the schema to the error the server returns",
        passos: [
          {
            titulo: "Write the rules once",
            texto:
              "List what each field requires (required, format, length, relations between fields) in a single schema, for example with Zod or Yup. Sign you got it right: the same rule becomes the TypeScript type and serves the client and, if possible, the server.",
          },
          {
            titulo: "Start with native HTML",
            texto:
              '`required`, `type="email"`, `minLength`, `min`, `max` and `pattern` already block submission and show a message, with keyboard and screen reader support. Use `noValidate` on the `<form>` when you want your own messages, and the Constraint Validation API (`checkValidity`, `setCustomValidity`) for special cases.',
          },
          {
            titulo: "Pick the moment for the error",
            texto:
              "On submit always; on blur for formats; while typing only to help (password strength) or to clear an error already shown. Criterion: never accuse a field the person has not even finished filling in (see the table).",
          },
          {
            titulo: "Tie the message to the field",
            texto:
              '`<label htmlFor>` on the field, `aria-invalid` when there is an error, `aria-describedby` pointing to the message text (which can have `role="alert"`). After a failed submit, move focus to the first invalid field. Do not rely on the color red alone.',
          },
          {
            titulo: "Use a library once the form grows",
            texto:
              "React Hook Form registers fields without per-keystroke state and accepts a Zod or Yup “resolver”. It handles errors, touched fields and the submitting state. In a two-field form, `useState` and native HTML are usually enough.",
          },
          {
            titulo: "Validate again on the server and show what it returns",
            texto:
              'The server revalidates everything and returns errors per field (for example, 422 with `{ email: "Email already registered" }`). On the client, map each message to the right field (in React Hook Form, `setError`) without wiping what the person typed. Sign you got it right: an error only the server knows appears in the same place as the others.',
          },
          {
            titulo: "Test the invalid path",
            texto:
              "With Testing Library, submit empty, check the message by role (`getByRole('alert')`) and the focus, then fix the field and confirm the error goes away. See L196.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "When to show the error",
        colunas: ["Moment", "Good for", "Watch out"],
        linhas: [
          [
            "On submit",
            "General rules; the safest default",
            "In a long form the feedback comes late: focus the first invalid field",
          ],
          [
            "On blur (`onBlur`)",
            "Formats such as email, phone and ID numbers",
            "Do not show an error on a field the person never touched",
          ],
          [
            "While typing (`onChange`)",
            "Live help (password strength, counters) and fixing an error already shown",
            "An error on every keystroke before the person finishes is irritating and makes screen readers talk too much",
          ],
          [
            "After submit (server)",
            "Rules only the server knows: email already registered, permission",
            "Map the message to the right field and keep what was typed",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "React Hook Form with Zod",
        legenda: "TSX",
        codigo: [
          'import { useForm } from "react-hook-form";',
          'import { zodResolver } from "@hookform/resolvers/zod";',
          'import { z } from "zod";',
          "",
          'const schema = z.object({ email: z.string().email("Invalid email") });',
          "type Data = z.infer<typeof schema>;",
          "",
          "export function SignUp({ submit }: { submit: (data: Data) => Promise<void> }) {",
          "  const { register, handleSubmit, formState } = useForm<Data>({",
          "    resolver: zodResolver(schema),",
          '    mode: "onTouched", // validates on blur and then on every change',
          "  });",
          "  const error = formState.errors.email?.message;",
          "  return (",
          "    <form onSubmit={handleSubmit(submit)} noValidate>",
          '      <label htmlFor="email">Email</label>',
          '      <input id="email" type="email" aria-invalid={!!error} aria-describedby="email-error" {...register("email")} />',
          '      <p id="email-error" role="alert">{error}</p>',
          "      <button disabled={formState.isSubmitting}>Create account</button>",
          "    </form>",
          "  );",
          "}",
        ].join("\n"),
        nota: "The APIs of Zod, React Hook Form and the resolvers change between versions (including how to validate an email); check the documentation. The field is not controlled: `register` avoids a re-render per keystroke.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The client is comfort, the server is truth",
        texto:
          "Client validation exists for the **experience**: instant feedback and fewer round trips. Anyone can bypass the browser (DevTools, `curl`, a script), so **the server validates everything again**, plus authorization and business rules. Ideally the two sides share the same schema, with the client never being the only defense.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The re-render cost of controlled forms",
        texto:
          "With one `useState` per field, every keystroke re-renders the whole form. In small forms it goes unnoticed; in large ones, prefer uncontrolled fields (React Hook Form’s `register`), subscribe only to what you need (`useWatch`) and split fields into components. Measure before optimizing. On controlled versus uncontrolled, see L155.",
      },
    ],
    armadilhas: [
      "Validating only on the client: the server accepts invalid or malicious data, because anyone can call the API without going through the interface.",
      "Validating on every keystroke from the first one: the error shows up before the person finishes typing and the screen reader keeps announcing it.",
      "Showing the error only in red, in `title` or in the `placeholder`: without text tied to the field (`aria-describedby`), part of your users will not notice.",
      "Using an overly strict regular expression for emails or phones: it rejects valid addresses; validate the basic format and confirm for real (for example, with a confirmation email).",
    ],
    autoteste: [
      {
        pergunta: "Why is client-side validation not enough?",
        resposta:
          "Because the client is in the hands of whoever uses it: they can turn off JavaScript, edit the DOM or call the API directly. Client validation improves the experience; only server validation protects the data.",
      },
      {
        pergunta: "How do you tie the error message to the field for screen readers?",
        resposta:
          'With a `<label>` associated with the field, `aria-invalid` when there is an error and `aria-describedby` pointing to the id of the message element (which can have `role="alert"`). After a failed submit, move focus to the first invalid field.',
      },
    ],
  },
};
