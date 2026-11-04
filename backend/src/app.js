/* Guia de Backend — interface. Perguntas: q-a/b/c.js (lista original, ids 1-30) e r-a/b/c.js (roadmap.sh, ids 101-150) em window.QS. */
(function () {
  "use strict";
  var QS = (window.QS || []).slice().sort(function (a, b) { return a.n - b.n; });
  /* "alias" = pergunta do roadmap.sh que reaproveita a explicação de outra: herda o método e conta o progresso uma vez só */
  QS.forEach(function (q) {
    if (q.alias) { for (var i = 0; i < QS.length; i++) if (QS[i].n === q.alias) q.m = QS[i].m; }
  });
  var UNIQUE = QS.filter(function (q) { return !q.alias; });
  var TOTAL = UNIQUE.length;
  var lang = "pt", view = "home", query = "";
  var prog = {};
  var drill = { n: null, open: false };
  var mem = {};

  function sget(k) { try { var v = window.localStorage.getItem("bk30:" + k); if (v !== null) return v; } catch (e) {} return mem[k] || null; }
  function sset(k, v) { mem[k] = v; try { window.localStorage.setItem("bk30:" + k, v); } catch (e) {} }
  try { prog = JSON.parse(sget("prog") || "{}") || {}; } catch (e) { prog = {}; }
  lang = sget("lang") === "en" ? "en" : "pt";

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function fmt(s) { return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>"); }
  function p2(n) { return n < 10 ? "0" + n : "" + n; }
  function byN(n) { for (var i = 0; i < QS.length; i++) if (QS[i].n === n) return QS[i]; return null; }
  function lbl(n) { return n < 100 ? "Q" + p2(n) : "R" + p2(n - 100); }
  function canon(q) { return q.alias || q.n; }
  function isOrig(g) { return "ABCDEF".indexOf(g) > -1; }
  function doneCount() { var c = 0; UNIQUE.forEach(function (q) { if (prog[q.n] === "done") c++; }); return c; }
  function saveProg() { sset("prog", JSON.stringify(prog)); }

  /* ---------- textos da interface ---------- */
  var T = {
    pt: {
      brand: "Guia de Backend", index: "Índice", search: "Buscar pergunta…", home: "Início", cheat: "Resumo", drill: "Treino",
      done: "entendidas", oneLine: "Resposta em 30 segundos", whyM: "Por que este método", traps: "Armadilhas", recall: "Teste-se: tente responder antes de abrir",
      teach: "Ensine de volta", teachP: "Feche esta tela e explique em voz alta, em 60 segundos, para alguém que nunca viu o assunto. O ponto em que você travar é o que ainda não entendeu: volte àquele bloco.",
      markDone: "Marcar como entendido", isDone: "Entendido ✓", prev: "Anterior", next: "Próxima",
      anSimple: "Em palavras simples", anTech: "Como funciona de verdade", anBreak: "Onde a analogia quebra",
      why: "Por quê?", root: "Causa-raiz", module: "Módulo",
      heroEy: "{n} perguntas · 8 métodos · PT/EN", heroT: "Entenda de verdade, uma vez só.",
      heroP: "A sua lista de 30 perguntas mais as 50 do roadmap.sh, cada uma explicada com o método que mais combina com ela. Onde as listas coincidem, a explicação é a mesma e o progresso conta uma vez só. Marque o que já domina e treine só o resto.",
      start: "Começar pela pergunta 1", drillCta: "Ir para o treino",
      rm: "roadmap.sh · 50 perguntas", rmP: "Perguntas de roadmap.sh/questions/backend, respondidas aqui com explicações próprias. As que repetem a lista original reaproveitam a mesma explicação (etiqueta “= Q”).", src: "Abrir a página de origem",
      sameAs: "Mesma matéria da", sameAsP: "Esta pergunta do roadmap.sh pede o mesmo conteúdo da pergunta {q}. A explicação completa está abaixo, e marcar como entendida vale para as duas.", uniq: "explicações distintas (as perguntas repetidas contam uma vez)",
      how: "Como estudar", h1: "Tente primeiro", h1p: "Antes de abrir uma resposta, diga a sua em voz alta. O esforço de lembrar é o que fixa.",
      h2: "Leia pelo método", h2p: "Cada pergunta usa a estrutura que melhor revela a ideia. Não pule o bloco que o método destaca.",
      h3: "Ensine de volta", h3p: "Explique em 60 segundos, sem olhar. Onde travar, volte ao bloco.", h4: "Revise espaçado", h4p: "Use o Treino depois de 1, 3 e 7 dias. Marque “entendido” só quando conseguir ensinar.",
      methods: "Os 8 métodos e quando cada um entra", bestFor: "Melhor para", all: "Lista original · 30 perguntas",
      cheatT: "Resumo de 30 segundos", cheatP: "Uma frase por pergunta. Use para revisar rápido ou antes de uma entrevista.",
      drillT: "Modo treino", drillP: "Leia a pergunta, responda em voz alta e só então revele.", reveal: "Revelar resposta", knew: "Eu sabia", rev: "Preciso rever", openFull: "Abrir explicação completa",
      empty: "Você marcou todas as perguntas como entendidas. Zere o progresso para treinar de novo.", reset: "Zerar progresso", left: "restantes no treino"
    },
    en: {
      brand: "Backend Guide", index: "Index", search: "Search a question…", home: "Home", cheat: "Cheat sheet", drill: "Drill",
      done: "understood", oneLine: "30-second answer", whyM: "Why this method", traps: "Pitfalls", recall: "Test yourself: try answering before you open",
      teach: "Teach it back", teachP: "Close this screen and explain it out loud in 60 seconds to someone who has never seen the topic. Wherever you get stuck is what you have not understood yet: go back to that block.",
      markDone: "Mark as understood", isDone: "Understood ✓", prev: "Previous", next: "Next",
      anSimple: "In plain words", anTech: "How it really works", anBreak: "Where the analogy breaks",
      why: "Why?", root: "Root cause", module: "Module",
      heroEy: "{n} questions · 8 methods · PT/EN", heroT: "Understand it properly, once.",
      heroP: "Your list of 30 questions plus the 50 from roadmap.sh, each explained with the method that fits it best. Where the lists overlap, the explanation is the same and progress counts once. Mark what you already own and drill only the rest.",
      start: "Start at question 1", drillCta: "Go to drill",
      rm: "roadmap.sh · 50 questions", rmP: "Questions from roadmap.sh/questions/backend, answered here with original explanations. The ones that repeat the original list reuse the same explanation (tag “= Q”).", src: "Open the source page",
      sameAs: "Same subject as", sameAsP: "This roadmap.sh question asks for the same content as question {q}. The full explanation is below, and marking it understood counts for both.", uniq: "distinct explanations (repeated questions count once)",
      how: "How to study", h1: "Try first", h1p: "Before opening an answer, say yours out loud. The effort of recalling is what makes it stick.",
      h2: "Read by the method", h2p: "Each question uses the structure that best reveals the idea. Do not skip the block the method highlights.",
      h3: "Teach it back", h3p: "Explain it in 60 seconds without looking. Where you stall, go back to that block.", h4: "Review spaced out", h4p: "Use the Drill after 1, 3 and 7 days. Mark “understood” only when you can teach it.",
      methods: "The 8 methods and when each one applies", bestFor: "Best for", all: "Original list · 30 questions",
      cheatT: "30-second cheat sheet", cheatP: "One sentence per question. Use it for quick review or right before an interview.",
      drillT: "Drill mode", drillP: "Read the question, answer out loud, and only then reveal.", reveal: "Reveal answer", knew: "I knew it", rev: "Need to review", openFull: "Open full explanation",
      empty: "You marked every question as understood. Reset your progress to drill again.", reset: "Reset progress", left: "left in the drill"
    }
  };

  var MODS = {
    A: { pt: "Arquitetura e fundamentos", en: "Architecture & fundamentals" },
    B: { pt: "Bancos de dados", en: "Databases" },
    C: { pt: "Cache e desempenho", en: "Caching & performance" },
    D: { pt: "Segurança e autenticação", en: "Security & authentication" },
    E: { pt: "Design de sistemas", en: "System design" },
    F: { pt: "Confiabilidade e operação", en: "Reliability & operations" },
    I: { pt: "roadmap.sh · Iniciante", en: "roadmap.sh · Beginner" },
    M: { pt: "roadmap.sh · Intermediário", en: "roadmap.sh · Intermediate" },
    V: { pt: "roadmap.sh · Avançado", en: "roadmap.sh · Advanced" }
  };
  var MOD_KEYS = ["A", "B", "C", "D", "E", "F"];
  var RM_KEYS = ["I", "M", "V"];
  var ALL_KEYS = MOD_KEYS.concat(RM_KEYS);

  var METHODS = {
    feynman: {
      pt: { name: "Feynman", tag: "Explique para um iniciante usando uma analogia e depois procure onde a analogia falha. Se não consegue simplificar, ainda não entendeu.", flow: "analogia → mecanismo real → onde quebra", use: "Conceitos abstratos que precisam virar intuição." },
      en: { name: "Feynman", tag: "Explain it to a beginner with an analogy, then look for where the analogy fails. If you cannot simplify it, you have not understood it yet.", flow: "analogy → real mechanism → where it breaks", use: "Abstract concepts that must become intuition." }
    },
    whys: {
      pt: { name: "5 Porquês", tag: "Pergunte “por quê?” em cadeia até a causa-raiz. O conceito deixa de ser decoreba e passa a ser consequência.", flow: "por quê? → porque… → por quê? → causa-raiz", use: "Perguntas “por que importa” ou “por que acontece”." },
      en: { name: "5 Whys", tag: "Ask “why?” in a chain until you hit the root cause. The concept stops being memorized and becomes a consequence.", flow: "why? → because… → why? → root cause", use: "“Why does it matter” or “why does it happen” questions." }
    },
    compare: {
      pt: { name: "Comparar e decidir", tag: "Matriz lado a lado mais uma regra de decisão: quando escolher cada lado e quais armadilhas aparecem.", flow: "matriz → regra de decisão → armadilhas", use: "Perguntas “X vs Y”." },
      en: { name: "Compare & decide", tag: "A side-by-side matrix plus a decision rule: when to choose each side and which traps show up.", flow: "matrix → decision rule → traps", use: "“X vs Y” questions." }
    },
    trace: {
      pt: { name: "Rastreio passo a passo", tag: "Siga um único pedido, evento ou transação pelo sistema, incluindo o caminho em que algo dá errado.", flow: "entrada → passo 1 → passo 2 → … → falha", use: "Fluxos com vários atores (eventos, CORS, sagas)." },
      en: { name: "Step-by-step trace", tag: "Follow one request, event or transaction through the system, including the path where something goes wrong.", flow: "input → step 1 → step 2 → … → failure", use: "Flows with several actors (events, CORS, sagas)." }
    },
    playbook: {
      pt: { name: "Playbook", tag: "Sequência acionável de passos, na ordem em que você executaria no trabalho, com o sinal de cada etapa.", flow: "medir → isolar → corrigir → verificar", use: "Perguntas “como você faz / depura / lida com…”." },
      en: { name: "Playbook", tag: "An actionable sequence of steps, in the order you would run them on the job, with the signal for each stage.", flow: "measure → isolate → fix → verify", use: "“How do you do / debug / handle…” questions." }
    },
    threat: {
      pt: { name: "Ameaça → defesa", tag: "Entenda primeiro o ataque (como a falha acontece) e então a contramedida que quebra a causa.", flow: "ataque → causa → defesa", use: "Segurança." },
      en: { name: "Threat → defense", tag: "Understand the attack first (how the flaw happens), then the countermeasure that breaks its cause.", flow: "attack → cause → defense", use: "Security." }
    },
    firstprinciples: {
      pt: { name: "Construir do zero", tag: "Comece pela versão mais simples, acrescente uma restrição por vez e veja o que quebra. Cada conserto vira um componente.", flow: "simples → restrição → quebra → componente", use: "“Como você projetaria / escalaria…”." },
      en: { name: "Build from scratch", tag: "Start from the simplest version, add one constraint at a time and see what breaks. Each fix becomes a component.", flow: "simple → constraint → breakage → component", use: "“How would you design / scale…” questions." }
    },
    design: {
      pt: { name: "Framework de design", tag: "Roteiro fixo de system design: requisitos, estimativas, API, dados, arquitetura e gargalos.", flow: "requisitos → números → API → dados → arquitetura → gargalos", use: "Desenhar um produto completo." },
      en: { name: "Design framework", tag: "A fixed system-design script: requirements, estimates, API, data, architecture and bottlenecks.", flow: "requirements → numbers → API → data → architecture → bottlenecks", use: "Designing a whole product." }
    }
  };
  var METHOD_ORDER = ["feynman", "whys", "compare", "trace", "playbook", "threat", "firstprinciples", "design"];

  function chip(m) { return '<span class="chip mk-' + m + '"><i></i>' + esc(METHODS[m][lang].name) + "</span>"; }

  /* ---------- blocos ---------- */
  function ttl(h) { return h ? "<h4>" + fmt(h) + "</h4>" : ""; }
  var R = {
    an: function (b, t) {
      return '<div class="an"><div class="simple"><span class="lbl">' + t.anSimple + "</span>" + fmt(b.s) + '</div><div><span class="lbl">' + t.anTech + "</span>" + fmt(b.k) + '</div><div class="break"><span class="lbl">' + t.anBreak + "</span>" + fmt(b.b) + "</div></div>";
    },
    why: function (b, t) {
      var h = '<ol class="whys">';
      b.rows.forEach(function (r, i) { h += '<li><span class="w-n">' + (i + 1) + '</span><div class="w-q">' + fmt(r[0]) + '</div><div class="w-a">' + fmt(r[1]) + "</div></li>"; });
      h += "</ol>";
      if (b.root) h += '<div class="root"><span class="lbl">' + t.root + "</span>" + fmt(b.root) + "</div>";
      return h;
    },
    tb: function (b) {
      var h = ttl(b.ti) + '<div class="tbw"><table><thead><tr>';
      b.h.forEach(function (c) { h += "<th>" + fmt(c) + "</th>"; });
      h += "</tr></thead><tbody>";
      b.r.forEach(function (r) {
        h += "<tr>";
        r.forEach(function (c, i) { h += (i === 0 ? '<th scope="row">' : "<td>") + fmt(c) + (i === 0 ? "</th>" : "</td>"); });
        h += "</tr>";
      });
      h += "</tbody></table></div>";
      if (b.n) h += '<p class="note">' + fmt(b.n) + "</p>";
      return h;
    },
    st: function (b) {
      var h = ttl(b.ti) + '<ol class="steps">';
      b.i.forEach(function (s, i) { h += '<li><span class="s-n">' + (i + 1) + "</span><div><strong>" + fmt(s[0]) + "</strong><p>" + fmt(s[1]) + "</p></div></li>"; });
      return h + "</ol>";
    },
    fl: function (b) {
      var h = ttl(b.ti) + '<div class="flow">';
      b.n.forEach(function (n, i) { h += (i ? '<span class="arr" aria-hidden="true">→</span>' : "") + '<div class="node">' + fmt(n) + "</div>"; });
      h += "</div>";
      if (b.c) h += '<p class="note">' + fmt(b.c) + "</p>";
      return h;
    },
    pr: function (b) {
      var h = ttl(b.ti) + '<div class="pairs"><div class="pr-h"><span>' + fmt(b.a) + "</span><span></span><span>" + fmt(b.b) + "</span></div>";
      b.r.forEach(function (r) { h += '<div class="pr"><div class="pr-a">' + fmt(r[0]) + '</div><span class="arr" aria-hidden="true">→</span><div class="pr-b">' + fmt(r[1]) + "</div></div>"; });
      return h + "</div>";
    },
    cd: function (b) {
      return ttl(b.ti) + '<figure class="code" style="margin-left:0;margin-right:0"><figcaption>' + esc(b.l || "code") + "</figcaption><pre><code>" + esc(b.c) + "</code></pre>" + (b.n ? '<p class="note">' + fmt(b.n) + "</p>" : "") + "</figure>";
    },
    tp: function (b) {
      return '<aside class="tp tp-' + (b.k || "tip") + '">' + (b.h ? "<strong>" + fmt(b.h) + "</strong>" : "") + "<p>" + fmt(b.x) + "</p></aside>";
    }
  };

  /* ---------- views ---------- */
  function viewQ(q) {
    var t = T[lang], src = q.alias ? byN(q.alias) : q, d = src[lang], idx = QS.indexOf(q), prev = QS[idx - 1], next = QS[idx + 1], ck = canon(q);
    var eb = lbl(q.n) + " · " + (isOrig(q.g) ? t.module + " " + q.g + " — " : "") + MODS[q.g][lang];
    var h = '<article class="q"><header class="q-head"><p class="eyebrow">' + esc(eb) + "</p><h1>" + esc(q[lang].q) + "</h1>";
    h += '<div class="mrow">' + chip(q.m) + '<p><strong>' + t.whyM + ".</strong> " + fmt(d.why) + "</p></div>";
    if (q.alias) h += '<aside class="tp tp-key" style="margin-top:14px"><strong>' + t.sameAs + " " + lbl(q.alias) + "</strong><p>" + esc(t.sameAsP.replace("{q}", lbl(q.alias) + " (" + src[lang].s + ")")) + "</p></aside>";
    h += "</header>";
    h += '<section class="one" aria-label="' + t.oneLine + '"><span class="lbl">' + t.oneLine + "</span><p>" + fmt(d.one) + "</p></section>";
    h += '<section class="qs">';
    d.b.forEach(function (b) { h += '<div class="blk">' + R[b.t](b, t) + "</div>"; });
    h += "</section>";
    if (d.traps && d.traps.length) {
      h += '<section class="qs"><h2>' + t.traps + '</h2><ul class="traps">';
      d.traps.forEach(function (x) { h += "<li>" + fmt(x) + "</li>"; });
      h += "</ul></section>";
    }
    if (d.rc && d.rc.length) {
      h += '<section class="qs"><h2>' + t.recall + "</h2>";
      d.rc.forEach(function (r) { h += '<details class="rc"><summary>' + fmt(r[0]) + "</summary><p>" + fmt(r[1]) + "</p></details>"; });
      h += "</section>";
    }
    h += '<section class="qs"><div class="teach"><h2 style="font-size:1.1rem;margin-bottom:6px">' + t.teach + "</h2><p>" + t.teachP + "</p></div></section>";
    h += '<nav class="pn">' + (prev ? '<a class="btn" href="#q' + prev.n + '" data-go="q' + prev.n + '">← ' + t.prev + " · " + lbl(prev.n) + "</a>" : "<span></span>");
    h += '<button class="btn' + (prog[ck] === "done" ? " good" : "") + '" id="mark" data-mark="' + ck + '">' + (prog[ck] === "done" ? t.isDone : t.markDone) + "</button>";
    h += next ? '<a class="btn primary" href="#q' + next.n + '" data-go="q' + next.n + '">' + t.next + " · " + lbl(next.n) + " →</a>" : "<span></span>";
    return h + "</nav></article>";
  }

  function viewHome() {
    var t = T[lang];
    var h = '<section class="hero"><p class="eyebrow">' + t.heroEy.replace("{n}", QS.length) + "</p><h1>" + t.heroT + '</h1><p class="lead">' + t.heroP + '</p><p class="note">' + TOTAL + " " + t.uniq + "</p>";
    h += '<div class="cta"><a class="btn primary" href="#q1" data-go="q1">' + t.start + '</a><a class="btn" href="#drill" data-go="drill">' + t.drillCta + "</a></div></section>";
    h += '<section class="sec"><h2>' + t.how + '</h2><ol class="how">';
    [[t.h1, t.h1p], [t.h2, t.h2p], [t.h3, t.h3p], [t.h4, t.h4p]].forEach(function (s) { h += "<li><strong>" + s[0] + "</strong><span>" + s[1] + "</span></li>"; });
    h += "</ol></section>";
    h += '<section class="sec"><h2>' + t.methods + '</h2><div class="mgrid">';
    METHOD_ORDER.forEach(function (m) {
      var M = METHODS[m][lang];
      h += '<div class="mcard mk-' + m + '"><h3>' + chip(m) + "</h3><p>" + esc(M.tag) + '</p><div class="flow-s">' + esc(M.flow) + "</div><p><strong>" + t.bestFor + ":</strong> " + esc(M.use) + '</p><div class="qn">';
      UNIQUE.forEach(function (q) { if (q.m === m) h += '<a href="#q' + q.n + '" data-go="q' + q.n + '" title="' + esc(q[lang].s) + '">' + lbl(q.n) + "</a>"; });
      h += "</div></div>";
    });
    h += "</div></section>";
    function grupo(keys) {
      var o = "";
      keys.forEach(function (g) {
        o += '<div class="mod"><h3><span>' + (isOrig(g) ? g : "R") + "</span>" + esc(MODS[g][lang]) + '</h3><div class="qgrid">';
        QS.forEach(function (q) {
          if (q.g !== g) return;
          var ck = canon(q), dn = prog[ck] === "done";
          o += '<a class="qc' + (dn ? " done" : "") + '" href="#q' + q.n + '" data-go="q' + q.n + '"><div class="top2"><span class="num">' + lbl(q.n) + (q.alias ? " = " + lbl(q.alias) : "") + (dn ? " ✓" : "") + "</span>" + chip(q.m) + "</div><b>" + esc(q[lang].s) + "</b></a>";
        });
        o += "</div></div>";
      });
      return o;
    }
    h += '<section class="sec"><h2>' + t.all + "</h2>" + grupo(MOD_KEYS) + "</section>";
    h += '<section class="sec"><h2>' + t.rm + '</h2><p class="lead" style="font-size:1rem">' + esc(t.rmP) + ' <a href="https://roadmap.sh/questions/backend" target="_blank" rel="noopener noreferrer">' + t.src + " ↗</a></p>" + grupo(RM_KEYS) + "</section>";
    return h;
  }

  function viewCheat() {
    var t = T[lang];
    var h = '<div class="q"><p class="eyebrow">' + t.cheat + '</p><h1 style="font-size:clamp(1.55rem,3.4vw,2.2rem);margin:8px 0 8px">' + t.cheatT + '</h1><p class="lead" style="margin-bottom:8px">' + t.cheatP + "</p>";
    ALL_KEYS.forEach(function (g) {
      h += '<div class="mod"><h3><span>' + (isOrig(g) ? g : "R") + "</span>" + esc(MODS[g][lang]) + '</h3><div class="cs">';
      QS.forEach(function (q) {
        if (q.g !== g) return;
        var src = q.alias ? byN(q.alias) : q;
        h += '<div class="cs-i"><span class="num">' + lbl(q.n) + '</span><div class="hd"><a href="#q' + q.n + '" data-go="q' + q.n + '">' + esc(q[lang].s) + "</a>" + (q.alias ? '<span class="note" style="margin:0">= ' + lbl(q.alias) + "</span>" : "") + chip(q.m) + "</div><p>" + fmt(src[lang].one) + "</p></div>";
      });
      h += "</div></div>";
    });
    return h + "</div>";
  }

  function pickDrill() {
    var pool = UNIQUE.filter(function (q) { return prog[q.n] !== "done" && q.n !== drill.n; });
    if (!pool.length) pool = UNIQUE.filter(function (q) { return prog[q.n] !== "done"; });
    if (!pool.length) { drill.n = null; return; }
    var rev = pool.filter(function (q) { return prog[q.n] === "review"; });
    var src = rev.length && Math.random() < 0.6 ? rev : pool;
    drill.n = src[Math.floor(Math.random() * src.length)].n;
    drill.open = false;
  }

  function viewDrill() {
    var t = T[lang];
    if (drill.n === null || !byN(drill.n) || prog[drill.n] === "done") pickDrill();
    var h = '<div class="drill"><p class="eyebrow">' + t.drill + '</p><h1 style="font-size:clamp(1.55rem,3.4vw,2.2rem);margin:8px 0 8px">' + t.drillT + '</h1><p class="lead">' + t.drillP + "</p>";
    if (drill.n === null) {
      h += '<div class="empty card" style="margin-top:16px"><p>' + t.empty + '</p><div class="acts"><button class="btn" data-act="reset">' + t.reset + "</button></div></div>";
      return h + "</div>";
    }
    var q = byN(drill.n), d = q[lang], left = TOTAL - doneCount();
    h += '<div class="card"><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><span class="eyebrow">' + lbl(q.n) + " · " + left + " " + t.left + "</span>" + chip(q.m) + "</div><h2>" + esc(d.q) + "</h2>";
    if (!drill.open) {
      h += '<div class="acts"><button class="btn primary" data-act="reveal">' + t.reveal + "</button></div>";
    } else {
      h += '<div class="ans"><div class="one" style="margin-top:0"><span class="lbl">' + t.oneLine + "</span><p>" + fmt(d.one) + "</p></div>";
      (d.rc || []).forEach(function (r) { h += '<details class="rc" open><summary>' + fmt(r[0]) + "</summary><p>" + fmt(r[1]) + "</p></details>"; });
      h += '</div><div class="acts"><button class="btn good" data-act="knew">' + t.knew + '</button><button class="btn" data-act="rev">' + t.rev + '</button><a class="btn" href="#q' + q.n + '" data-go="q' + q.n + '">' + t.openFull + "</a></div>";
    }
    return h + "</div></div>";
  }

  /* ---------- chrome ---------- */
  function renderTop() {
    var t = T[lang], dn = doneCount(), pct = TOTAL ? Math.round((dn / TOTAL) * 100) : 0;
    function tab(v, label) { return '<a href="#' + v + '" data-go="' + v + '"' + (view === v ? ' aria-current="page"' : "") + ">" + label + "</a>"; }
    var h = '<div class="top-in"><button class="btn only-m" id="idx" aria-expanded="false" aria-controls="side">☰ ' + t.index + "</button>";
    h += '<a class="brand" href="#home" data-go="home"><span class="brand-mark" aria-hidden="true">/' + QS.length + '</span><span>' + esc(t.brand) + "</span></a>";
    h += '<nav class="tabs" aria-label="Navigation">' + tab("home", t.home) + tab("cheat", t.cheat) + tab("drill", t.drill) + "</nav>";
    h += '<div class="seg" role="group" aria-label="Language"><button data-lang="pt" aria-pressed="' + (lang === "pt") + '">PT</button><button data-lang="en" aria-pressed="' + (lang === "en") + '">EN</button></div>';
    h += '<div class="prog" title="' + dn + "/" + TOTAL + " " + t.uniq + '"><span>' + dn + "/" + TOTAL + '</span><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + TOTAL + '" aria-valuenow="' + dn + '"><i style="width:' + pct + '%"></i></div></div></div>';
    $("top").innerHTML = h;
    syncHeader();
  }

  function syncHeader() {
    var hh = Math.round($("top").getBoundingClientRect().height);
    if (hh && hh < 200) document.documentElement.style.setProperty("--hh", hh + "px");
  }

  function renderSide() {
    var t = T[lang];
    $("search").placeholder = t.search;
    $("searchL").textContent = t.search;
    var h = "", cur = view.charAt(0) === "q" ? view : "";
    ALL_KEYS.forEach(function (g) {
      var items = QS.filter(function (q) {
        if (q.g !== g) return false;
        if (!query) return true;
        return (lbl(q.n) + " " + q[lang].s + " " + q[lang].q).toLowerCase().indexOf(query) > -1;
      });
      if (!items.length) return;
      h += '<p class="grp">' + (isOrig(g) ? g + " · " : "") + esc(MODS[g][lang]) + "</p>";
      items.forEach(function (q) {
        h += '<a class="ni ' + (prog[canon(q)] || "") + '" href="#q' + q.n + '" data-go="q' + q.n + '"' + (cur === "q" + q.n ? ' aria-current="page"' : "") + '><span class="num">' + (q.n < 100 ? p2(q.n) : lbl(q.n)) + "</span><span>" + esc(q[lang].s) + '</span><span class="ck" aria-hidden="true"></span></a>';
      });
    });
    $("navlist").innerHTML = h;
  }

  function renderMain() {
    var h;
    if (view === "cheat") h = viewCheat();
    else if (view === "drill") h = viewDrill();
    else if (view.charAt(0) === "q" && byN(parseInt(view.slice(1), 10))) h = viewQ(byN(parseInt(view.slice(1), 10)));
    else { view = "home"; h = viewHome(); }
    $("main").innerHTML = h;
  }

  function renderAll() { renderTop(); renderSide(); renderMain(); document.documentElement.lang = lang === "pt" ? "pt-BR" : "en"; }

  function closeSide() { $("side").classList.remove("open"); var b = $("idx"); if (b) b.setAttribute("aria-expanded", "false"); }

  function go(v, noScroll) {
    view = v;
    if (v === "drill") { drill.open = false; if (drill.n === null || prog[drill.n] === "done") drill.n = null; }
    renderAll();
    closeSide();
    if (!noScroll) { window.scrollTo(0, 0); }
    try { window.history.replaceState(null, "", "#" + v); } catch (e) {}
  }

  /* ---------- eventos ---------- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest ? e.target.closest("[data-go],[data-lang],[data-mark],[data-act],#idx") : null;
    if (!el) return;
    if (el.hasAttribute("data-go")) { e.preventDefault(); go(el.getAttribute("data-go")); return; }
    if (el.hasAttribute("data-lang")) {
      lang = el.getAttribute("data-lang"); sset("lang", lang);
      var y = window.pageYOffset; renderAll(); window.scrollTo(0, y); return;
    }
    if (el.hasAttribute("data-mark")) {
      var n = parseInt(el.getAttribute("data-mark"), 10);
      if (prog[n] === "done") delete prog[n]; else prog[n] = "done";
      saveProg(); renderTop(); renderSide();
      var t = T[lang], on = prog[n] === "done";
      el.textContent = on ? t.isDone : t.markDone; el.classList.toggle("good", on);
      return;
    }
    if (el.id === "idx") {
      var side = $("side"), open = !side.classList.contains("open");
      side.classList.toggle("open", open); el.setAttribute("aria-expanded", String(open)); return;
    }
    var act = el.getAttribute("data-act");
    if (act === "reveal") { drill.open = true; renderMain(); }
    else if (act === "knew") { prog[drill.n] = "done"; saveProg(); pickDrill(); renderTop(); renderSide(); renderMain(); }
    else if (act === "rev") { prog[drill.n] = "review"; saveProg(); pickDrill(); renderTop(); renderSide(); renderMain(); }
    else if (act === "reset") { prog = {}; saveProg(); drill.n = null; renderTop(); renderSide(); renderMain(); }
  });

  $("search").addEventListener("input", function () { query = this.value.trim().toLowerCase(); renderSide(); });

  document.addEventListener("keydown", function (e) {
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.altKey || e.ctrlKey || e.metaKey || view.charAt(0) !== "q") return;
    var cur = byN(parseInt(view.slice(1), 10));
    if (!cur) return;
    var i = QS.indexOf(cur);
    if (e.key === "ArrowRight" && QS[i + 1]) go("q" + QS[i + 1].n);
    else if (e.key === "ArrowLeft" && QS[i - 1]) go("q" + QS[i - 1].n);
  });

  window.addEventListener("resize", syncHeader);
  window.addEventListener("hashchange", function () {
    var v = (location.hash || "").replace("#", "");
    if (v && v !== view) go(v);
  });

  var start = (location.hash || "").replace("#", "");
  view = start || "home";
  renderAll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncHeader);
})();
