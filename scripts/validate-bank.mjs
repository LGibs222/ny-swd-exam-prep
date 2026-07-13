// Validation for the CST SWD (060) question bank.
// Run: node scripts/validate-bank.mjs
import { PRETEST, POSTTEST, MODULES, CR_PROMPTS, MOCK_BANK } from '../src/data/questions.js';

const all = [...PRETEST, ...POSTTEST];
Object.entries(MODULES).forEach(([d, mod]) => (mod.practice || []).forEach(p => all.push({ ...p, d: p.d || d })));
MOCK_BANK.forEach(q => all.push(q));

let fail = 0;
const err = (m) => { fail++; console.log('  FAIL:', m); };

// structural checks
all.forEach((q, i) => {
  if (!q.s || !/^C[1-6]$/.test(q.s)) err(`item ${i} bad subtest ${q.s}`);
  if (!Array.isArray(q.a) || q.a.length !== 4) err(`item ${i} needs 4 options`);
  if (typeof q.c !== 'number' || q.c < 0 || q.c > 3) err(`item ${i} bad key ${q.c}`);
  if (!q.r || q.r.length < 40) err(`item ${i} rationale missing/short`);
});

// per-competency counts
const byComp = {};
all.forEach(q => { byComp[q.s] = (byComp[q.s] || 0) + 1; });

// key-position balance
const keyDist = [0, 0, 0, 0];
all.forEach(q => keyDist[q.c]++);

// longest-option-correct (ties don't count as longest-correct)
let longest = 0, tied = 0;
all.forEach(q => {
  const lens = q.a.map(o => o.length);
  const max = Math.max(...lens);
  const maxCount = lens.filter(l => l === max).length;
  if (lens[q.c] === max) { if (maxCount > 1) tied++; else longest++; }
});

// duplicate stems (normalized 8-word shingle overlap)
const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const shingles = s => { const w = norm(s).split(' '); const out = new Set(); for (let i = 0; i + 8 <= w.length; i++) out.add(w.slice(i, i + 8).join(' ')); return out; };
const sh = all.map(q => shingles(q.q));
const dupPairs = [];
for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
  let hit = 0; sh[i].forEach(x => { if (sh[j].has(x)) hit++; });
  const denom = Math.min(sh[i].size, sh[j].size) || 1;
  if (hit / denom > 0.5 && hit >= 3) dupPairs.push([all[i].id || `#${i}`, all[j].id || `#${j}`, norm(all[i].q).slice(0, 60)]);
}

// mock feasibility: blueprint 90 = C1 11, C2 11, C3 23, C4 11, C5 23, C6 11
const BLUEPRINT = { C1: 11, C2: 11, C3: 23, C4: 11, C5: 23, C6: 11 };
const feasible = Object.entries(BLUEPRINT).every(([k, n]) => (byComp[k] || 0) >= n);

const total = all.length;
console.log('Total SR items:', total);
console.log('Per-competency:', Object.keys(byComp).sort().map(k => `${k}=${byComp[k]}`).join(' '));
console.log('Key positions (A/B/C/D):', keyDist.join('/'));
console.log(`Longest-option-correct: ${longest}/${total} = ${(100 * longest / total).toFixed(1)}% (plus ${tied} length-ties)`);
console.log('Near-duplicate stem pairs:', dupPairs.length);
dupPairs.forEach(p => console.log('   dup:', p.join(' | ')));
console.log('CR prompts:', CR_PROMPTS.length, '· MOCK_BANK items:', MOCK_BANK.length);
console.log('90-item blueprint draw feasible (11/11/23/11/23/11):', feasible);
if (100 * longest / total >= 30) { fail++; console.log('  FAIL: longest-correct >= 30%'); }
const spread = Math.max(...keyDist) - Math.min(...keyDist);
if (spread > 2) { fail++; console.log('  FAIL: key balance spread >', spread); }
console.log(fail ? `\n${fail} FAILURES` : '\nALL CHECKS PASS');
process.exit(fail ? 1 : 0);
