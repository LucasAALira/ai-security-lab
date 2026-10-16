/* Progresso local: XP calculado a partir das conquistas, sem incremento repetido.
   Medalhas e níveis de trilha são derivados do estado salvo; o que é gravado a mais é só
   o registro da data de cada medalha, os erros por questão e a sequência de dias de estudo. */
const StudyProgress = (() => {
  const count = 8, key = 'ai-security-study-v2', total = 63;
  const dayPattern = /^\d{4}-\d{2}-\d{2}$/, idPattern = /^[a-z0-9-]{1,40}$/;
  const tierXp = {bronze: 10, prata: 20, ouro: 40, dragao: 100};
  const emptyContext = {tracks: [], prereqs: [], sizes: []};
  const small = n => Number.isInteger(n) && n > 0 ? Math.min(n, 9999) : 0;
  const pad = n => String(n).padStart(2, '0');
  const slug = text => String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  function clean(raw) {
    const s = {version: 2, modules: {}, lab: raw?.lab === true, migrated: raw?.migrated === true, cases: [0, 1, 2, 3, 4, 5].map(i => raw?.cases?.[i] === true), badges: {}, streak: {last: '', current: 0, best: 0}};
    for (let i = 0; i < count; i++) {
      const m = raw?.modules?.[i] || {};
      const solved = [0, 1].map(j => m.solved?.[j] === true);
      s.modules[i] = {
        reads: [0, 1, 2].map(j => m.reads?.[j] === true), research: m.research === true, practice: m.practice === true, solved,
        notes: typeof m.notes === 'string' ? m.notes : '', researchNote: typeof m.researchNote === 'string' ? m.researchNote : '',
        misses: [0, 1].map(j => Math.min(99, small(m.misses?.[j]))), firstTry: [0, 1].map(j => solved[j] && m.firstTry?.[j] === true)
      };
    }
    if (raw?.badges && typeof raw.badges === 'object') {
      Object.entries(raw.badges).slice(0, 64).forEach(([id, day]) => { if (idPattern.test(id) && typeof day === 'string' && dayPattern.test(day)) s.badges[id] = day; });
    }
    const k = raw?.streak;
    if (k && typeof k === 'object') {
      s.streak = {last: typeof k.last === 'string' && dayPattern.test(k.last) ? k.last : '', current: small(k.current), best: small(k.best)};
      s.streak.best = Math.max(s.streak.best, s.streak.current);
    }
    return s;
  }
  function load(storage) {
    try { const current = storage.getItem(key); if (current) return clean(JSON.parse(current)); } catch {}
    let s = clean({});
    try { const legacy = JSON.parse(storage.getItem('ai-security-study-v1') || '{}'); for (let i = 0; i < count; i++) { if (legacy?.[i]?.done) { s.modules[i].reads = [true, true, true]; s.migrated = true; } if (typeof legacy?.[i]?.notes === 'string') s.modules[i].notes = legacy[i].notes; } } catch {}
    return s;
  }

  /* Tarefas e XP por módulo */
  function steps(m) { return m.reads.filter(Boolean).length + Number(m.research) + Number(m.practice) + m.solved.filter(Boolean).length; }
  function xp(m) { return m.reads.filter(Boolean).length * 10 + Number(m.research) * 20 + Number(m.practice) * 20 + m.solved.filter(Boolean).length * 15; }
  function complete(m) { return steps(m) === 7; }
  function remaining(m) { return {reads: 3 - m.reads.filter(Boolean).length, research: !m.research, practice: !m.practice, questions: 2 - m.solved.filter(Boolean).length}; }
  function base(s) {
    const values = Object.values(s.modules);
    return {xp: values.reduce((n, m) => n + xp(m), 0) + (s.lab ? 30 : 0) + s.cases.filter(Boolean).length * 40, complete: values.filter(complete).length, steps: values.reduce((n, m) => n + steps(m), 0) + (s.lab ? 1 : 0) + s.cases.filter(Boolean).length, total};
  }

  /* Medalha de módulo ou trilha: bronze a partir de 40%, prata a partir de 70%, ouro ao concluir. */
  function tier(done, max) { const r = max ? done / max : 0; return r >= 1 ? 'ouro' : r >= 0.7 ? 'prata' : r >= 0.4 ? 'bronze' : null; }
  function nextTier(done, max) {
    const current = tier(done, max); if (current === 'ouro' || !max) return null;
    const target = current === 'prata' ? 'ouro' : current === 'bronze' ? 'prata' : 'bronze';
    for (let n = done + 1; n <= max; n++) if (tier(n, max) === target) return {tier: target, remaining: n - done};
    return null;
  }

  /* Catálogo de medalhas. goal devolve [valor atual, meta]; meta 0 nunca libera a medalha. */
  function stats(s, ctx) {
    const ms = Object.values(s.modules), sum = f => ms.reduce((n, m) => n + f(m), 0), sizes = ctx.sizes || [];
    return {
      reads: sum(m => m.reads.filter(Boolean).length), researches: sum(m => Number(m.research)), practices: sum(m => Number(m.practice)),
      answers: sum(m => m.solved.filter(Boolean).length), firstTry: sum(m => m.firstTry.filter(Boolean).length), retried: sum(m => m.solved.filter((v, j) => v && m.misses[j] > 0).length),
      modules: ms.filter(complete).length, cases: s.cases.filter(Boolean).length, solvedSizes: new Set(sizes.filter((z, i) => s.cases[i])).size, sizeCount: new Set(sizes).size,
      lab: Number(s.lab), streak: s.streak.best, steps: base(s).steps
    };
  }
  function definitions(ctx) {
    const list = [
      ['first-read', 'Primeira leitura', 'bronze', '★', 'Registre a leitura de uma seção de matéria.', st => [st.reads, 1]],
      ['reader-12', 'Leitor dedicado', 'prata', '★', 'Registre 12 leituras de seção.', st => [st.reads, 12]],
      ['reader-24', 'Biblioteca completa', 'ouro', '★', 'Registre as 24 leituras de seção, nos oito módulos.', st => [st.reads, 24]],
      ['first-research', 'Primeira pesquisa', 'bronze', '✦', 'Conclua a pesquisa orientada de um módulo.', st => [st.researches, 1]],
      ['researcher-4', 'Pesquisador', 'prata', '✦', 'Conclua a pesquisa orientada de 4 módulos.', st => [st.researches, 4]],
      ['first-practice', 'Mão na massa', 'bronze', '✚', 'Conclua a atividade prática de um módulo.', st => [st.practices, 1]],
      ['practitioner-4', 'Prática constante', 'prata', '✚', 'Conclua a atividade prática de 4 módulos.', st => [st.practices, 4]],
      ['first-answer', 'Primeiro acerto', 'bronze', '◆', 'Acerte uma questão de múltipla escolha.', st => [st.answers, 1]],
      ['retry', 'Aprendeu com o erro', 'bronze', '↻', 'Acerte uma questão depois de errar e revisar o conteúdo.', st => [st.retried, 1]],
      ['sharp-5', 'Mira afiada', 'prata', '◎', 'Acerte 5 questões de primeira, sem erros anteriores.', st => [st.firstTry, 5]],
      ['sharp-12', 'Precisão de elite', 'ouro', '◎', 'Acerte 12 das 16 questões de primeira.', st => [st.firstTry, 12]],
      ['first-module', 'Primeiro módulo', 'bronze', '●', 'Conclua as 7 tarefas de um módulo.', st => [st.modules, 1]],
      ['half-modules', 'Meio caminho', 'prata', '●', 'Conclua 4 dos 8 módulos.', st => [st.modules, 4]],
      ['all-modules', 'Módulos dominados', 'ouro', '●', 'Conclua os 8 módulos de estudo.', st => [st.modules, 8]]
    ];
    (ctx.tracks || []).forEach(t => list.push(['track-' + slug(t.name), 'Trilha ' + t.name, 'prata', '▲', `Conclua todos os módulos da trilha ${t.name}.`, (st, s) => [t.modules.filter(i => s.modules[i] && complete(s.modules[i])).length, t.modules.length]]));
    list.push(
      ['lab-done', 'Laboratório concluído', 'bronze', '⌬', 'Analise o cenário do laboratório de injeção de prompt.', st => [st.lab, 1]],
      ['first-fix', 'Primeira correção', 'bronze', '✔', 'Resolva um cenário de correção.', st => [st.cases, 1]],
      ['fixer-3', 'Corretor', 'prata', '✔', 'Resolva 3 cenários de correção.', st => [st.cases, 3]],
      ['all-sizes', 'Todos os portes', 'prata', '⬡', 'Resolva ao menos um cenário de cada porte de empresa.', st => [st.solvedSizes, st.sizeCount]],
      ['all-fixes', 'Correções aplicadas', 'ouro', '✔', 'Resolva os 6 cenários de correção.', st => [st.cases, 6]],
      ['streak-3', 'Constância', 'bronze', '☀', 'Estude em 3 dias seguidos.', st => [st.streak, 3]],
      ['streak-7', 'Semana de estudo', 'prata', '☀', 'Estude em 7 dias seguidos.', st => [st.streak, 7]],
      ['full-track', 'Trilha completa', 'dragao', '✪', 'Conclua todas as 63 tarefas: módulos, laboratório e cenários.', st => [st.steps, total]]
    );
    return list.map(([id, name, tierName, glyph, desc, goal]) => ({id, name, tier: tierName, glyph, desc, goal}));
  }
  function medals(s, ctx = emptyContext) {
    const st = stats(s, ctx);
    return definitions(ctx).map(d => {
      const [value, target] = d.goal(st, s), unlocked = target > 0 && value >= target;
      return {id: d.id, name: d.name, desc: d.desc, tier: d.tier, glyph: d.glyph, xp: tierXp[d.tier], value: Math.min(value, target), target, unlocked, date: unlocked ? s.badges[d.id] || null : null};
    });
  }
  function summary(s, ctx = emptyContext) {
    const b = base(s), got = medals(s, ctx).filter(m => m.unlocked), medalXp = got.reduce((n, m) => n + m.xp, 0);
    return {...b, taskXp: b.xp, medalXp, xp: b.xp + medalXp, medals: got.length, medalTotal: definitions(ctx).length};
  }
  function maxXp(ctx = emptyContext) { return {tasks: 8 * 100 + 30 + 6 * 40, medals: definitions(ctx).reduce((n, d) => n + tierXp[d.tier], 0)}; }

  /* Dias de estudo seguidos */
  function today(now) { const d = now instanceof Date ? now : new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
  function touch(s, now) {
    const t = today(now), k = s.streak; if (k.last === t) return;
    const y = new Date(now instanceof Date ? now : Date.now()); y.setDate(y.getDate() - 1);
    k.current = k.last === today(y) ? k.current + 1 : 1; k.best = Math.max(k.best, k.current); k.last = t;
  }
  /* Sequência em andamento: só vale se o último estudo foi hoje ou ontem. */
  function activeStreak(s, now) {
    const y = new Date(now instanceof Date ? now : Date.now()); y.setDate(y.getDate() - 1);
    return s.streak.last === today(now) || s.streak.last === today(y) ? s.streak.current : 0;
  }
  /* Registra a data das medalhas recém-liberadas e devolve a lista delas. */
  function sync(s, ctx, now) {
    const day = today(now), fresh = [];
    medals(s, ctx).forEach(m => { if (m.unlocked && !s.badges[m.id]) { s.badges[m.id] = day; fresh.push(m); } });
    return fresh;
  }

  /* Evolução por trilha e pontos de melhoria */
  function trackProgress(s, ctx = emptyContext) {
    return (ctx.tracks || []).map(t => {
      const ms = t.modules.map(i => s.modules[i]).filter(Boolean), done = ms.reduce((n, m) => n + steps(m), 0), max = ms.length * 7;
      return {name: t.name, modules: t.modules, count: ms.length, complete: ms.filter(complete).length, steps: done, maxSteps: max, xp: ms.reduce((n, m) => n + xp(m), 0), maxXp: ms.length * 100, tier: tier(done, max), next: nextTier(done, max)};
    });
  }
  function improvements(s, ctx = emptyContext, limit = 4) {
    const out = [], prereqs = ctx.prereqs || [];
    for (let i = 0; i < count; i++) {
      const m = s.modules[i];
      [0, 1].forEach(j => { if (!m.solved[j] && m.misses[j] > 0) out.push({kind: 'retry', module: i, question: j, misses: m.misses[j], xp: 15, priority: 1}); });
      if (!complete(m) && steps(m) >= 3) out.push({kind: 'finish', module: i, left: remaining(m), xp: 100 - xp(m), priority: 2 + (7 - steps(m)) / 10});
    }
    const start = [...Array(count).keys()].find(i => steps(s.modules[i]) === 0 && (prereqs[i] || []).every(p => s.modules[p] && complete(s.modules[p])));
    if (start !== undefined) out.push({kind: 'start', module: start, xp: 100, priority: 3});
    if (!s.lab) out.push({kind: 'lab', xp: 30, priority: 4});
    const pending = s.cases.filter(c => !c).length;
    if (pending) out.push({kind: 'cases', left: pending, xp: 40, priority: 4});
    return out.sort((a, b) => a.priority - b.priority).slice(0, limit);
  }

  function context(modules, learning, cases) {
    const names = [...new Set(modules.map(m => m[1]))];
    return {tracks: names.map(name => ({name, modules: modules.map((m, i) => m[1] === name ? i : -1).filter(i => i >= 0)})), prereqs: learning.map(l => l.prereqs || []), sizes: cases.map(c => c.size)};
  }
  function level(xp) {
    const levels = [{at: 0, name: 'Iniciante'}, {at: 100, name: 'Explorador'}, {at: 300, name: 'Praticante'}, {at: 500, name: 'Analista'}, {at: 800, name: 'Trilha avançada'}, {at: 1000, name: 'Defensor de IA'}, {at: 1250, name: 'Guardião de IA'}, {at: 1500, name: 'Mestre Dragão'}];
    const n = levels.findLastIndex(l => xp >= l.at);
    return {number: n + 1, name: levels[n].name, next: levels[n + 1]?.at ?? null, start: levels[n].at};
  }

  function award(s, i, type, index, now) {
    const m = s.modules[i]; if (!m) return false;
    let changed = false; const set = (list, j) => { if (!list[j]) { list[j] = true; changed = true; } };
    if (type === 'read' && Number.isInteger(index) && index >= 0 && index < 3) set(m.reads, index);
    if (type === 'research' && !m.research) { m.research = true; changed = true; }
    if (type === 'practice' && !m.practice) { m.practice = true; changed = true; }
    if (type === 'question' && Number.isInteger(index) && index >= 0 && index < 2 && !m.solved[index]) { m.firstTry[index] = m.misses[index] === 0; m.solved[index] = true; changed = true; }
    if (changed) touch(s, now);
    return changed;
  }
  function miss(s, i, index, now) {
    const m = s.modules[i]; if (!m || !Number.isInteger(index) || index < 0 || index > 1 || m.solved[index]) return;
    m.misses[index] = Math.min(99, m.misses[index] + 1); touch(s, now);
  }
  function solveCase(s, index, now) { if (Number.isInteger(index) && index >= 0 && index < 6 && !s.cases[index]) { s.cases[index] = true; touch(s, now); return true; } return false; }
  function completeLab(s, now) { if (s.lab) return false; s.lab = true; touch(s, now); return true; }
  return {key, clean, load, steps, xp, complete, remaining, summary, level, maxXp, tier, nextTier, medals, sync, touch, activeStreak, trackProgress, improvements, context, award, miss, solveCase, completeLab, tierXp};
})();
if (typeof module !== 'undefined' && module.exports) module.exports = StudyProgress;
