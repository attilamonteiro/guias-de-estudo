import type { Pergunta } from "../../tipos";

// F43 · PUT x PATCH
export const f043: Pergunta = {
  numero: 443,
  modulo: "founditgulf-basicas-2",
  metodo: "compare",
  pt: {
    titulo: "PUT x PATCH",
    pergunta: "Quais são as diferenças entre os métodos PUT e PATCH em APIs REST?",
    porqueEsteMetodo:
      "PUT e PATCH parecem intercambiáveis até você comparar corpo, idempotência, campos ausentes e criação. Uma matriz lado a lado deixa as diferenças explícitas e leva à regra de decisão que a entrevista espera.",
    resposta30s:
      "O **PUT** **substitui o recurso inteiro** pela representação enviada e é **idempotente**: repetir a chamada deixa o mesmo estado. O **PATCH** envia só as **mudanças** (por exemplo, em JSON Merge Patch ou JSON Patch) e não é necessariamente idempotente, porque depende da operação descrita. Use PUT para trocar o recurso todo e PATCH para alterar um ou poucos campos, e proteja ambos contra atualizações concorrentes com `ETag` e `If-Match`.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "PUT e PATCH lado a lado",
        colunas: ["Aspecto", "PUT", "PATCH"],
        linhas: [
          [
            "Significado",
            "Substitui o recurso inteiro pela representação enviada",
            "Aplica uma alteração parcial ao recurso existente",
          ],
          [
            "Corpo da requisição",
            "O recurso completo",
            "Só as mudanças, num formato definido (JSON Merge Patch ou JSON Patch)",
          ],
          [
            "Idempotência",
            "Sim, por definição: repetir deixa o mesmo estado final",
            "Depende da operação: “definir o e-mail como X” é idempotente; “somar 1 ao saldo” ou “acrescentar ao fim da lista” não é",
          ],
          [
            "Campos ausentes no corpo",
            "Entendidos como removidos ou voltando ao padrão (ou a requisição é recusada, se forem obrigatórios)",
            "Permanecem como estão",
          ],
          [
            "Criar o recurso",
            "Pode criar, quando o cliente conhece a URL (`PUT /arquivos/relatorio.pdf`); responde `201` se criou",
            "Em geral não cria; recurso inexistente responde `404`",
          ],
          [
            "Códigos mais comuns",
            "`200` ou `204` ao substituir, `201` ao criar, `400`/`422` na validação, `409` em conflito, `412` se o `If-Match` falhar",
            "`200` ou `204`, `404`, `400`/`422`, `409`, `412`, e `415` se o formato do patch não for aceito",
          ],
          [
            "Custo e risco",
            "Envia tudo; quem lê, altera e reenvia pode apagar um campo que outro cliente acabou de mudar",
            "Envia menos; pisa menos em campos alheios, mas dois clientes alterando o mesmo campo ainda conflitam",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um corpo de cada",
        legenda: "JavaScript",
        codigo: [
          "// PUT: o corpo é o recurso COMPLETO; o que faltar some ou volta ao padrão",
          'await fetch("/usuarios/42", {',
          '  method: "PUT",',
          '  headers: { "Content-Type": "application/json" },',
          '  body: JSON.stringify({ nome: "Ana", email: "ana@exemplo.com", telefone: null }),',
          "});",
          "",
          "// PATCH (JSON Merge Patch): só o que muda; null apaga o campo",
          'await fetch("/usuarios/42", {',
          '  method: "PATCH",',
          '  headers: { "Content-Type": "application/merge-patch+json", "If-Match": etag },',
          '  body: JSON.stringify({ email: "ana@novo.com" }),',
          "});",
        ].join("\n"),
        nota: 'No JSON Patch, o corpo é uma lista de operações, como `[{ "op": "replace", "path": "/email", "value": "ana@novo.com" }]`, com tipo `application/json-patch+json`.',
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "**Trocar o recurso todo**, ou criá-lo numa URL que o cliente escolhe: `PUT`. **Mudar um ou poucos campos** de um recurso grande: `PATCH`. **Criar com a URL decidida pelo servidor** (o id nasce no banco): `POST` na coleção, devolvendo `201` e o `Location`. Em qualquer caso, valide o resultado final inteiro e aceite só os campos que o cliente pode alterar.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O formato do PATCH e as atualizações concorrentes",
        texto:
          "PATCH é um método, não um formato: combine qual usar. O **JSON Merge Patch** é simples, mas `null` significa “remover o campo” e uma lista é substituída por inteiro, então não serve para tudo. O **JSON Patch** descreve operações (`add`, `remove`, `replace`, `move`, `copy`, `test`) e é mais expressivo. Para impedir que uma atualização apague a de outro cliente, devolva um `ETag` no `GET` e exija `If-Match` na escrita: se o recurso mudou, o servidor responde `412 Precondition Failed`.",
      },
    ],
    armadilhas: [
      "Mandar um PUT com corpo parcial: o servidor trata os campos ausentes como removidos e apaga dados que você só queria manter.",
      "Dizer que PATCH “nunca” (ou “sempre”) é idempotente: depende da operação descrita no corpo.",
      'Aceitar o PATCH sem lista de campos permitidos ou sem validar o resultado final: `{ "role": "admin" }` vira escalada de privilégio (mass assignment).',
      "Ignorar a concorrência: dois clientes leem, alteram e enviam, e o último a escrever apaga a mudança do outro. Use `ETag` com `If-Match`.",
    ],
    autoteste: [
      {
        pergunta: "Por que o PUT é idempotente e o PATCH nem sempre?",
        resposta:
          "O PUT define o estado final completo: repetir a chamada produz o mesmo resultado. O PATCH descreve uma mudança, e algumas mudanças dependem do estado atual: “definir o e-mail” é idempotente, “somar 1 ao saldo” não é.",
      },
      {
        pergunta: "Como impedir que uma atualização sobrescreva a de outro cliente?",
        resposta:
          "Com concorrência otimista: o `GET` devolve um `ETag`, o cliente o envia em `If-Match` ao escrever, e o servidor recusa com `412` se o recurso mudou desde então. O cliente relê, reaplica a mudança e tenta de novo.",
      },
    ],
  },
  en: {
    titulo: "PUT vs PATCH",
    pergunta: "What are the differences between PUT and PATCH methods in REST APIs?",
    porqueEsteMetodo:
      "PUT and PATCH look interchangeable until you compare body, idempotency, missing fields and creation. A side-by-side matrix makes the differences explicit and leads to the decision rule an interview expects.",
    resposta30s:
      "**PUT** **replaces the whole resource** with the representation sent and is **idempotent**: repeating the call leaves the same state. **PATCH** sends only the **changes** (for example, as JSON Merge Patch or JSON Patch) and is not necessarily idempotent, because it depends on the operation described. Use PUT to swap the whole resource and PATCH to change one or a few fields, and protect both against concurrent updates with `ETag` and `If-Match`.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "PUT and PATCH side by side",
        colunas: ["Aspect", "PUT", "PATCH"],
        linhas: [
          [
            "Meaning",
            "Replaces the whole resource with the representation sent",
            "Applies a partial change to the existing resource",
          ],
          [
            "Request body",
            "The complete resource",
            "Only the changes, in a defined format (JSON Merge Patch or JSON Patch)",
          ],
          [
            "Idempotency",
            "Yes, by definition: repeating leaves the same final state",
            "Depends on the operation: “set the email to X” is idempotent; “add 1 to the balance” or “append to the list” is not",
          ],
          [
            "Fields missing from the body",
            "Understood as removed or reset to the default (or the request is rejected, if they are required)",
            "Stay as they are",
          ],
          [
            "Creating the resource",
            "Can create, when the client knows the URL (`PUT /files/report.pdf`); answers `201` if it created",
            "Usually does not create; a missing resource answers `404`",
          ],
          [
            "Most common codes",
            "`200` or `204` on replace, `201` on create, `400`/`422` on validation, `409` on conflict, `412` if `If-Match` fails",
            "`200` or `204`, `404`, `400`/`422`, `409`, `412`, and `415` if the patch format is not accepted",
          ],
          [
            "Cost and risk",
            "Sends everything; whoever reads, changes and resends can wipe a field another client just changed",
            "Sends less; steps on others’ fields less, but two clients changing the same field still conflict",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "One body of each",
        legenda: "JavaScript",
        codigo: [
          "// PUT: the body is the COMPLETE resource; whatever is missing disappears or resets",
          'await fetch("/users/42", {',
          '  method: "PUT",',
          '  headers: { "Content-Type": "application/json" },',
          '  body: JSON.stringify({ name: "Ana", email: "ana@example.com", phone: null }),',
          "});",
          "",
          "// PATCH (JSON Merge Patch): only what changes; null deletes the field",
          'await fetch("/users/42", {',
          '  method: "PATCH",',
          '  headers: { "Content-Type": "application/merge-patch+json", "If-Match": etag },',
          '  body: JSON.stringify({ email: "ana@new.com" }),',
          "});",
        ].join("\n"),
        nota: 'In JSON Patch, the body is a list of operations, such as `[{ "op": "replace", "path": "/email", "value": "ana@new.com" }]`, with the type `application/json-patch+json`.',
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "**Swapping the whole resource**, or creating it at a URL the client chooses: `PUT`. **Changing one or a few fields** of a large resource: `PATCH`. **Creating with a URL the server decides** (the id is born in the database): `POST` to the collection, returning `201` and the `Location`. In any case, validate the entire final result and accept only the fields the client may change.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The PATCH format and concurrent updates",
        texto:
          "PATCH is a method, not a format: agree on which one to use. **JSON Merge Patch** is simple, but `null` means “remove the field” and a list is replaced as a whole, so it does not fit everything. **JSON Patch** describes operations (`add`, `remove`, `replace`, `move`, `copy`, `test`) and is more expressive. To stop one update from wiping another client’s, return an `ETag` on `GET` and require `If-Match` on write: if the resource changed, the server answers `412 Precondition Failed`.",
      },
    ],
    armadilhas: [
      "Sending a PUT with a partial body: the server treats missing fields as removed and wipes data you only meant to keep.",
      "Saying PATCH is “never” (or “always”) idempotent: it depends on the operation described in the body.",
      'Accepting PATCH with no allowlist of fields or without validating the final result: `{ "role": "admin" }` becomes privilege escalation (mass assignment).',
      "Ignoring concurrency: two clients read, change and send, and the last to write erases the other’s change. Use `ETag` with `If-Match`.",
    ],
    autoteste: [
      {
        pergunta: "Why is PUT idempotent and PATCH not always?",
        resposta:
          "PUT defines the complete final state: repeating the call produces the same result. PATCH describes a change, and some changes depend on the current state: “set the email” is idempotent, “add 1 to the balance” is not.",
      },
      {
        pergunta: "How do you stop an update from overwriting another client’s?",
        resposta:
          "With optimistic concurrency: `GET` returns an `ETag`, the client sends it in `If-Match` when writing, and the server refuses with `412` if the resource changed since. The client rereads, reapplies the change and tries again.",
      },
    ],
  },
};
