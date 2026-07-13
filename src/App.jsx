import { useState, useEffect, useMemo } from "react";
import { QuickCheck, CategorizeGame, AnimatedVisual, MasteryMap } from "./Engagement.jsx";
import { TTSButton } from "./TTS.jsx";
import { MODULE_ENHANCEMENTS } from "./data/moduleEnhancements.js";
import { track, getUser } from "./tracking.js";
import { PRETEST, POSTTEST, MODULES, CR_PROMPTS, MOCK_BANK } from "./data/questions.js";

// ─── DESIGN SYSTEM (BCBA "Sunrise" card system · OneLove warm palette) ──
// Theme-switching tokens resolve to CSS variables (defined in GlobalStyles);
// fixed warm accents stay concrete. Dark mode flips the vars via [data-theme].
const T = {
  paper:'var(--bg)', paper2:'var(--surface-2)', paper3:'var(--surface)',
  ink:'var(--text)', ink2:'var(--muted)',
  orange:'var(--accent)', orange2:'var(--accent-2)',
  rule:'var(--border)', muted:'var(--muted)',
  green:'var(--green)', greenBg:'var(--green-bg)',
  red:'var(--red)', redBg:'var(--red-bg)',
  hairline:'var(--border)',
  glass:'var(--surface)', solid:'var(--surface-solid)', shadow:'var(--shadow)',
  serif:`Georgia,'Times New Roman',serif`,
  sans:`'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif`,
};

const baseStyles = {
  html: { background: 'var(--bg)', color: 'var(--text)', fontFamily: T.sans, WebkitFontSmoothing: 'antialiased' },
  cap: { fontFamily: T.sans, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 700 },
  capSm: { fontFamily: T.sans, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 700, color: T.muted },
  ital: { fontStyle: 'italic', fontWeight: 400 },
};

// ═══════════════════════════════════════════════════════════════
// EXAM CONTENT · Edit this block to fork a new exam app.
// Everything below the ENGINE divider is generic and can be copied
// verbatim across exam apps. Only the constants in this block differ.
// ═══════════════════════════════════════════════════════════════

const SUBTESTS = {
  C1: { label:"Foundations of Special Education", roman:"I" },
  C2: { label:"Knowledge of Students with Disabilities", roman:"II" },
  C3: { label:"Assessment & Individual Program Planning", roman:"III" },
  C4: { label:"Learning Environment & Behavioral Interventions", roman:"IV" },
  C5: { label:"Instructional Planning & Delivery", roman:"V" },
  C6: { label:"Communication, Social & Functional Living Skills", roman:"VI" },
};

const WELCOME = {
  "imprint": "New York State · NYSTCE CST Students with Disabilities (060)",
  "triBand": [
    "A Course in Four Phases",
    "Students with Disabilities · CST 060"
  ],
  "title": {
    "pre": "Students with",
    "italic": "Disabilities",
    "post": ""
  },
  "subtitle": "A complete preparation course for the NYSTCE Content Specialty Test: Students with Disabilities (060) — seven competencies, ninety selected-response items, and one written assignment.",
  "alignment": [
    "NYSTCE 060 Framework",
    "IDEA & NY Part 200",
    "7 Competencies"
  ],
  "steps": [
    [
      "Take the Pretest",
      "Thirty-two questions across the six selected-response competencies establish your baseline."
    ],
    [
      "Review Your Results",
      "A competency-by-competency analysis shows precisely where to focus."
    ],
    [
      "Study the Modules",
      "Fifteen modules with concept summaries and exam-style practice. Flagged areas come first."
    ],
    [
      "Take the Post-Test",
      "Thirty-two fresh questions measure your growth — then drill the written assignment."
    ]
  ],
  "subareasHeading": "The Six SR Competencies",
  "subareaWord": "Competency",
  "posttestIntro": "fresh questions across the six competencies. Demonstrate the growth of your study.",
  "crSubtitle": "Competency 0007 · Analysis, Synthesis & Application — 20% of your score",
  "colophon": "Set in Plus Jakarta Sans and Georgia. Composed for the New York State teaching candidate, in the manner of a Penguin Classic. Aligned to the NYSTCE CST Students with Disabilities (060) framework, IDEA, and Part 200 of the Regulations of the Commissioner of Education.",
  "testFacts": {
    "heading": "CST 060 at a Glance",
    "tables": [
      {
        "title": "Test Design",
        "rows": [
          [
            "Selected-response items",
            "90 items · 80% of score"
          ],
          [
            "Written assignment",
            "1 constructed-response · 20% of score"
          ],
          [
            "Total time",
            "3 hours 15 minutes"
          ],
          [
            "Passing score",
            "520"
          ]
        ]
      },
      {
        "title": "Competency Weights",
        "rows": [
          [
            "0001 Foundations of Special Education",
            "10%"
          ],
          [
            "0002 Knowledge of Students with Disabilities",
            "10%"
          ],
          [
            "0003 Assessment & Individual Program Planning",
            "20%"
          ],
          [
            "0004 Learning Environment & Behavioral Interventions",
            "10%"
          ],
          [
            "0005 Instructional Planning & Delivery",
            "20%"
          ],
          [
            "0006 Communication, Social & Functional Living",
            "10%"
          ],
          [
            "0007 Analysis, Synthesis & Application (written)",
            "20%"
          ]
        ]
      }
    ],
    "note": "Specifications from the official NYSTCE 060 test design (nystce.nesinc.com). Confirm current details in your registration materials."
  }
};


// ═══════════════════════════════════════════════════════════════
// ENGINE · Generic. Below this divider should be portable verbatim
// across exam apps. References SUBTESTS / WELCOME / PRETEST / POSTTEST /
// MODULES / CR_PROMPTS from the EXAM CONTENT block above.
// ═══════════════════════════════════════════════════════════════

const calcScores = (questions, answers) => {
  const domainData = {};
  questions.forEach((q, i) => {
    if (!domainData[q.d]) domainData[q.d] = { subtest:q.s, correct:0, total:0 };
    domainData[q.d].total++;
    if (answers[i] === q.c) domainData[q.d].correct++;
  });
  const subtestData = {};
  Object.entries(domainData).forEach(([d, data]) => {
    if (!subtestData[data.subtest]) subtestData[data.subtest] = { correct:0, total:0 };
    subtestData[data.subtest].correct += data.correct;
    subtestData[data.subtest].total += data.total;
  });
  return { domains: domainData, subtests: subtestData };
};

const pct = (c, t) => t === 0 ? 0 : Math.round((c / t) * 100);

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildQuizPool = () => {
  const pool = {};
  PRETEST.forEach(q => { (pool[q.d] = pool[q.d] || []).push(q); });
  POSTTEST.forEach(q => { (pool[q.d] = pool[q.d] || []).push(q); });
  Object.entries(MODULES).forEach(([d, mod]) => {
    const subtest = (PRETEST.find(q => q.d === d) || POSTTEST.find(q => q.d === d) || {}).s || Object.keys(SUBTESTS)[0];
    (mod.practice || []).forEach(p => { (pool[d] = pool[d] || []).push({ ...p, s: subtest, d }); });
  });
  return pool;
};

// ─── PASS-RATE + ERROR-ANALYSIS ENGINE ─────────────────────
// NYSTCE reporting scale runs 400–600 with a passing score of 520 (matches
// WELCOME.testFacts "Passing score: 520").
const SCALE_MIN = 400, SCALE_MAX = 600, PASS_SCALED = 520;
// Percent → scaled anchor: linear through (0%, 400) and (70%, 520), capped at
// 600. i.e. ~70% correct ≈ the 520 passing bar. Documented per shared spec.
const PASS_PCT = 70;
const pctToScaled = (p) => Math.min(SCALE_MAX, Math.round(SCALE_MIN + p * (PASS_SCALED - SCALE_MIN) / PASS_PCT));

// Stable question ids so the My Misses bank survives reloads. Module practice
// items get deterministic ids from their domain + index.
const ALL_QUESTIONS = (() => {
  PRETEST.forEach((q, i) => { if (!q.id) q.id = `pre-${i}`; });
  POSTTEST.forEach((q, i) => { if (!q.id) q.id = `post-${i}`; });
  const list = [...PRETEST, ...POSTTEST];
  Object.entries(MODULES).forEach(([d, mod]) => {
    const subtest = (PRETEST.find(q => q.d === d) || POSTTEST.find(q => q.d === d) || {}).s || Object.keys(SUBTESTS)[0];
    (mod.practice || []).forEach((p, i) => { if (!p.id) p.id = `mp-${d}-${i}`; if (!p.d) Object.assign(p, { s: subtest, d }); list.push(p); });
  });
  // Net-new mock-bank items already carry explicit content ids (mk-*) + s/d.
  (MOCK_BANK || []).forEach(q => list.push(q));
  return list;
})();
const QUESTION_BY_ID = Object.fromEntries(ALL_QUESTIONS.map(q => [q.id, q]));

// ─── FULL-LENGTH TIMED MOCK ────────────────────────────────
// Blueprint-proportioned 90-item selected-response form (matches the official
// CST 060 weights: 0001 10%, 0002 10%, 0003 20%, 0004 10%, 0005 20%, 0006 10%),
// drawn from the ENTIRE item pool (pre/post/module practice + net-new mock bank)
// without repeats, plus one constructed-response prompt. SR time 135 min, CR 60.
const MOCK_BLUEPRINT = { C1: 11, C2: 11, C3: 23, C4: 11, C5: 23, C6: 11 };
const MOCK_SR_SECONDS = 135 * 60;
const MOCK_CR_SECONDS = 60 * 60;
const buildMockForm = () => {
  const byComp = {};
  ALL_QUESTIONS.forEach(q => { (byComp[q.s] = byComp[q.s] || []).push(q); });
  const form = [];
  Object.entries(MOCK_BLUEPRINT).forEach(([comp, n]) => {
    form.push(...shuffle(byComp[comp] || []).slice(0, n));
  });
  return shuffle(form); // interleave competencies like the real form
};
const fmtClock = (sec) => {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  const mm = String(h ? m : m).padStart(2, '0'), rr = String(r).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${rr}` : `${mm}:${rr}`;
};

// 4-point holistic performance scale for the constructed response — mirrors the
// NYSTCE CST written-assignment scoring (holistic 1–4 across the three
// performance characteristics: Purpose/Completeness, Application/Accuracy,
// Support). Replaces the old 3-level self-rubric.
const CR_HOLISTIC_SCALE = [
  { score: 4, label: 'Thorough', color: 'green',
    desc: 'Fully accomplishes the purpose of the assignment; shows an accurate, effective application of professional knowledge; and is well supported with specific, relevant evidence from the exhibits.' },
  { score: 3, label: 'Adequate', color: 'sage',
    desc: 'Accomplishes the purpose of the assignment; shows a generally accurate, reasonably effective application of knowledge; and is adequately supported with some specific evidence from the exhibits.' },
  { score: 2, label: 'Limited', color: 'amber',
    desc: 'Partially accomplishes the purpose; shows a limited or uneven application of knowledge, with some inaccuracy; and is supported with only general or minimal evidence.' },
  { score: 1, label: 'Weak', color: 'red',
    desc: 'Fails to accomplish the purpose; shows a poor or inaccurate application of knowledge; and provides little or no supporting evidence from the exhibits.' },
];

// Telemetry helper: per-domain percent map from a calcScores() result.
const byDomainPct = (s) => Object.fromEntries(Object.entries(s.domains).map(([d, v]) => [d, pct(v.correct, v.total)]));

// Readiness projection = weighted mean of the last 5 scored attempts
// (pretest, posttest, quick quizzes), linear weights 1..5 with the most
// recent attempt heaviest. Requires >= 2 scored attempts.
const projectReadiness = (attemptLog) => {
  const scored = (attemptLog || []).filter(a => typeof a.pct === 'number');
  if (scored.length < 2) return null;
  const last = scored.slice(-5);
  let wsum = 0, sum = 0;
  last.forEach((a, i) => { const w = i + 1; wsum += w; sum += a.pct * w; });
  const projectedPct = Math.round(sum / wsum);
  const projected = pctToScaled(projectedPct);
  // Verdict margins are ±5 percentage points around the 70% pass-equivalent.
  const verdict = projectedPct >= PASS_PCT + 5 ? 'Ready' : projectedPct >= PASS_PCT - 5 ? 'Borderline' : 'Keep building';
  return { projected, projectedPct, bar: PASS_SCALED, verdict, attempts: scored };
};

const activeMisses = (bank) => Object.values(bank || {}).filter(m => !m.retired);
const retiredMisses = (bank) => Object.values(bank || {}).filter(m => m.retired);

// Record outcomes of a scored run (pretest/posttest/quiz): append to the
// per-domain answer log + attempt log, and add misses to the bank. A correct
// answer OUTSIDE Review Misses does not advance the retirement streak — the
// spec retires items only after two consecutive corrects in review mode.
const recordOutcomes = (prev, questions, answers, type, pctScore) => {
  const ts = new Date().toISOString();
  const bank = { ...(prev.missBank || {}) };
  const log = [...(prev.domainLog || [])];
  questions.forEach((q, i) => {
    const ok = answers[i] === q.c;
    log.push({ d: q.d, ok, ts });
    if (!ok && q.id) {
      const cur = bank[q.id];
      bank[q.id] = { id: q.id, domain: q.d, missCount: (cur?.missCount || 0) + 1, correctStreak: 0, lastMissed: ts, retired: false };
    }
  });
  return {
    missBank: bank,
    domainLog: log.slice(-800),
    attemptLog: [...(prev.attemptLog || []), { type, pct: pctScore, len: questions.length, ts }].slice(-50),
  };
};

// Review Misses scoring: correct advances the streak (retire at 2 consecutive);
// wrong resets the streak and re-counts the miss.
const applyReviewOutcomes = (prev, questions, answers) => {
  const ts = new Date().toISOString();
  const bank = { ...(prev.missBank || {}) };
  const log = [...(prev.domainLog || [])];
  questions.forEach((q, i) => {
    const ok = answers[i] === q.c;
    log.push({ d: q.d, ok, ts });
    const cur = bank[q.id] || { id: q.id, domain: q.d, missCount: 1, correctStreak: 0, lastMissed: ts, retired: false };
    bank[q.id] = ok
      ? { ...cur, correctStreak: cur.correctStreak + 1, retired: cur.correctStreak + 1 >= 2 }
      : { ...cur, missCount: cur.missCount + 1, correctStreak: 0, lastMissed: ts, retired: false };
  });
  return { missBank: bank, domainLog: log.slice(-800) };
};

// One-time backfill after this update: seed the bank + logs from answers the
// app already persisted (pretest/posttest answers, quiz history percentages).
// Anything not recoverable is NOT fabricated — quizzes contribute attempt
// percentages only, since their item-level answers were never stored.
const backfillFromSaved = (restored) => {
  if ('missBank' in restored) return {}; // already seeded
  const seed = { missBank: {}, domainLog: [], attemptLog: [] };
  const runs = [];
  if (restored.pretestScores && restored.pretestAnswers) runs.push({ qs: PRETEST, ans: restored.pretestAnswers, type: 'pretest' });
  if (restored.postScores && restored.posttestAnswers) runs.push({ qs: POSTTEST, ans: restored.posttestAnswers, type: 'posttest' });
  let acc = seed;
  runs.forEach(({ qs, ans, type }) => {
    const correct = qs.filter((q, i) => ans[i] === q.c).length;
    acc = { ...acc, ...recordOutcomes(acc, qs, ans, type, pct(correct, qs.length)) };
  });
  (restored.quizHistory || []).forEach(h => {
    acc.attemptLog.push({ type: 'quiz', pct: h.pct, len: h.len, ts: h.ts });
  });
  acc.attemptLog.sort((a, b) => new Date(a.ts || 0) - new Date(b.ts || 0));
  return acc;
};

const INITIAL_STATE = {
  phase:'welcome', qIndex:0, answers:{}, pretestScores:null, theme:'light',
  missBank:{}, domainLog:[], attemptLog:[], missQs:null, missIdx:0, missAnswers:{},
  completedModules:[], activeModule:null, modPhase:'content', modPQIndex:0, modPAnswers:{},
  conceptProgress:{}, moduleScores:{}, quizHistory:[], crScored:{},
  postAnswers:{}, postScores:null,
  fcDomain:null, fcOrder:[], fcPos:0, fcFlipped:false, fcKnown:[],
  quizDomain:null, quizLen:10, quizQs:null, quizIdx:0, quizAnswers:{},
  crPromptId: (typeof CR_PROMPTS !== 'undefined' && CR_PROMPTS.length > 0) ? CR_PROMPTS[0].id : null, crView:'prompt', crSelfScore:{},
};


// ─── PRIMITIVES ────────────────────────────────────────────
const Cap = ({ children, color = T.muted, mb = 0 }) => (
  <div style={{ ...baseStyles.capSm, color, marginBottom: mb }}>{children}</div>
);
const Pill = ({ children, color = T.orange2, bg }) => (
  <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, color, background: bg || 'var(--accent-bg)', padding: '3px 11px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '.06em', display: 'inline-block', whiteSpace: 'nowrap' }}>{children}</span>
);
const Rule = ({ thick = 1, color = T.hairline, my = 0 }) => (
  <div style={{ height: thick, background: color, marginTop: my, marginBottom: my }} />
);
const Card = ({ children, style = {}, className = '' }) => (
  <div className={className} style={{ background: T.glass, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: `1px solid ${T.hairline}`, borderRadius: 18, padding: 24, boxShadow: T.shadow, ...style }}>{children}</div>
);
const ProgressRow = ({ value, label, color = T.orange }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontFamily: T.sans, fontSize: 13 }}>
      <span style={{ color: T.muted }}>{label}</span>
      <span style={{ color, fontWeight: 700, fontFeatureSettings: "'tnum' 1" }}>{value}%</span>
    </div>
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={typeof label === 'string' ? label : undefined}
      style={{ background: 'var(--border)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
      <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
    </div>
  </div>
);
const Btn = ({ children, onClick, variant = 'primary', disabled = false, style = {} }) => {
  const base = { padding: '13px 26px', fontFamily: T.sans, fontSize: 14, fontWeight: 700, letterSpacing: 0, textTransform: 'none', border: 'none', borderRadius: 99, cursor: disabled ? 'default' : 'pointer', transition: 'transform .2s, box-shadow .2s, filter .2s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' };
  const variants = {
    primary: { background: disabled ? T.muted : 'var(--text)', color: 'var(--bg)', boxShadow: disabled ? 'none' : '0 4px 18px rgba(36,26,16,.18)' },
    ghost: { background: 'transparent', color: T.ink, border: `1.5px solid ${T.hairline}` },
    accent: { background: disabled ? T.muted : 'var(--accent)', color: '#fff', boxShadow: disabled ? 'none' : '0 4px 18px rgba(194,83,31,.28)' },
  };
  return <button onClick={disabled ? undefined : onClick} disabled={disabled} className={disabled ? '' : 'btn-cta'} style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
};
const Page = ({ children, narrow = false }) => (
  <div style={{ maxWidth: narrow ? 880 : 1120, margin: '0 auto', padding: '32px clamp(16px, 5vw, 40px) 96px', position: 'relative', zIndex: 1 }}>{children}</div>
);

// Concept-type accents — BCBA's 4-type card system, recolored to the CST warm
// palette. Cycled across a module's concepts via (conceptIdx % length).
const CST_CONCEPT_TYPES = [
  { label:'Core Concept',         icon:'📖', color:'#a14a1f', bg:'#fdf8e9', border:'#e3c9a8' },
  { label:'Key Principles',       icon:'⚙️',  color:'#3d6b3d', bg:'#dde9d8', border:'#b6cdb0' },
  { label:'Critical Distinction', icon:'⚠️', color:'#8a5a1f', bg:'#f6ecd2', border:'#dcc290' },
  { label:'Exam Strategy',        icon:'💡', color:'#6f3047', bg:'#f0e0e6', border:'#d3aebb' },
];

// Tap-to-flip key-term card (ported from BCBA, recolored to the warm palette).
function KeyTermCard({ term, def, color, bg, border }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="kt-card" onClick={() => setFlipped(f => !f)}
      style={{ cursor:'pointer', minHeight:74, perspective:800, userSelect:'none' }}>
      <div style={{ position:'relative', width:'100%', minHeight:74, transformStyle:'preserve-3d',
        transition:'transform .45s cubic-bezier(.4,0,.2,1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden',
          background:bg, border:`1.5px solid ${border}`, borderRadius:10,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'8px 12px', minHeight:74 }}>
          <span style={{ ...baseStyles.cap, fontSize:8, color, letterSpacing:'.12em', marginBottom:5, opacity:.65 }}>tap to define</span>
          <span style={{ fontFamily:T.serif, fontSize:14, fontWeight:700, color, textAlign:'center', lineHeight:1.3 }}>{term}</span>
        </div>
        <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden',
          transform:'rotateY(180deg)', background:'var(--surface-solid)', border:`1.5px solid ${border}`, borderRadius:10,
          display:'flex', alignItems:'center', justifyContent:'center', padding:'8px 12px', minHeight:74 }}>
          <span style={{ fontFamily:T.serif, fontSize:12.5, color:T.ink, textAlign:'center', lineHeight:1.5 }}>{def}</span>
        </div>
      </div>
    </div>
  );
}

// Arrow-key focus movement for role="radiogroup" option lists (roving tabindex).
const radioGroupKeys = (e) => {
  if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) return;
  const radios = Array.from(e.currentTarget.querySelectorAll('[role="radio"]:not(:disabled)'));
  if (radios.length === 0) return;
  const idx = radios.indexOf(document.activeElement);
  const delta = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : -1;
  radios[(Math.max(idx, 0) + delta + radios.length) % radios.length].focus();
  e.preventDefault();
};

// Media queries can't live in inline styles — the few responsive layout
// rules go in this one global stylesheet instead.
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    :root {
      --bg-base:#f4ecd9; --bg:var(--bg-base);
      --surface:rgba(255,251,242,0.82); --surface-2:rgba(255,251,242,0.55); --surface-solid:#fffdf6;
      --text:#241a10; --muted:#6e6353; --border:#e6d8bf;
      --accent:#c2531f; --accent-2:#a14a1f; --accent-bg:#f6e2cf;
      --green:#5a7a52; --green-bg:#e6eddd; --green-border:rgba(90,122,82,.4);
      --red:#a8453a; --red-bg:#f4ddd6; --red-border:rgba(168,69,58,.4);
      --gold:#b18432; --berry:#6f3047; --sage:#5a7a52;
      --amber:#8a5a1f; --amber-bg:#f6ecd2; --amber-border:rgba(138,90,31,.4);
      --shadow:0 4px 24px rgba(36,26,16,0.08);
    }
    :root[data-theme="dark"] {
      --bg-base:#1c150e;
      --surface:rgba(255,246,232,0.06); --surface-2:rgba(255,246,232,0.04); --surface-solid:#2a2017;
      --text:#f3ece0; --muted:#c7b69a; --border:rgba(255,246,232,0.12);
      --accent:#e07a3f; --accent-2:#e0a071; --accent-bg:rgba(224,122,63,.16);
      --green:#a8c8a0; --green-bg:rgba(168,200,160,.14); --green-border:rgba(168,200,160,.4);
      --red:#e0928a; --red-bg:rgba(224,146,138,.14); --red-border:rgba(224,146,138,.4);
      --gold:#d8a754; --berry:#b07088; --sage:#a8c8a0;
      --amber:#d8a754; --amber-bg:rgba(216,167,84,.14); --amber-border:rgba(216,167,84,.4);
      --shadow:0 6px 28px rgba(0,0,0,0.5);
    }
    html, body {
      margin:0; color:var(--text);
      font-family:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif;
      -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
      background:
        radial-gradient(ellipse 80% 50% at 50% 0%, rgba(194,83,31,.12), transparent 70%),
        radial-gradient(ellipse 60% 50% at 100% 30%, rgba(177,132,50,.12), transparent 70%),
        radial-gradient(ellipse 60% 50% at 0% 100%, rgba(111,48,71,.10), transparent 70%),
        var(--bg-base);
      background-attachment:fixed;
      transition:background .3s ease, color .3s ease;
    }
    :root[data-theme="dark"] html, :root[data-theme="dark"] body {
      background:
        radial-gradient(ellipse 80% 50% at 50% 0%, rgba(224,122,63,.10), transparent 70%),
        radial-gradient(ellipse 60% 50% at 100% 30%, rgba(216,167,84,.08), transparent 70%),
        radial-gradient(ellipse 60% 50% at 0% 100%, rgba(176,112,136,.08), transparent 70%),
        var(--bg-base);
    }
    .ol-split { display: grid; grid-template-columns: 1fr 1px 1fr; }
    .ol-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
    @media (max-width: 760px) {
      .ol-split { grid-template-columns: 1fr; }
      .ol-split .ol-vrule { display: none; }
      .ol-grid2 { grid-template-columns: 1fr; }
    }
    @keyframes conceptIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .concept-in { animation: conceptIn .32s ease forwards; }
    .kt-card:hover { filter: brightness(.97); }
    @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
    .fade-up { animation: fadeUp .5s cubic-bezier(.2,.7,.2,1) both; }
    .fade-up-1{animation-delay:.05s}.fade-up-2{animation-delay:.13s}.fade-up-3{animation-delay:.21s}
    .fade-up-4{animation-delay:.29s}.fade-up-5{animation-delay:.37s}.fade-up-6{animation-delay:.45s}
    .lift { transition: transform .25s cubic-bezier(.2,.7,.2,1), box-shadow .25s, border-color .25s; }
    .lift:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(36,26,16,.13); }
    .btn-cta { } .btn-cta:hover { transform: translateY(-1px); filter: brightness(1.03); }
    .cta-arrow { display:inline-block; transition: transform .25s cubic-bezier(.2,.7,.2,1); }
    .btn-cta:hover .cta-arrow { transform: translateX(4px); }
    @keyframes orbDrift { 0%,100%{transform:translate(0,0);} 50%{transform:translate(8px,-12px);} }
    .welcome-orb { position:absolute; border-radius:50%; filter:blur(60px); pointer-events:none; z-index:0; animation:orbDrift 15s ease-in-out infinite; }
    @keyframes shimmer { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }
    .greeting-accent { background:linear-gradient(90deg,var(--accent) 0%,var(--berry) 50%,var(--gold) 100%); background-size:200% 100%; -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; animation:shimmer 8s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
      .fade-up,.welcome-orb,.greeting-accent,.concept-in { animation:none !important; }
      .fade-up { opacity:1 !important; transform:none !important; }
      .lift,.btn-cta,.cta-arrow { transition:none !important; }
    }
  `}</style>
);

// ─── ONE LOVE BRAND ────────────────────────────────────────
const OneLoveLogo = ({ height = 26, dark = true }) => {
  const inkColor = dark ? '#f6efe0' : 'var(--text)';
  const heartColor = dark ? '#e07a3f' : '#c2531f';
  return (
    <svg height={height} viewBox="0 0 380 80" xmlns="http://www.w3.org/2000/svg" aria-label="One Love" style={{ display: 'block' }}>
      <text x="170" y="60" textAnchor="end" fontFamily={T.serif} fontWeight="900" fontSize="54" letterSpacing="-1.2" fill={inkColor}>One</text>
      <g transform="translate(190, 35)">
        <path d="M 10 4 C 10 -2, 4 -6, 0 -2 C -4 -6, -10 -2, -10 4 C -10 11, 0 17, 0 17 C 0 17, 10 11, 10 4 Z" fill={heartColor}/>
      </g>
      <text x="208" y="60" fontFamily={T.serif} fontWeight="900" fontStyle="italic" fontSize="54" letterSpacing="-1.2" fill={inkColor}>Love</text>
    </svg>
  );
};

const OneLoveFooter = () => (
  <footer style={{ borderTop: `1px solid ${T.hairline}`, background: 'var(--surface-2)', padding: '22px 24px 30px', marginTop: 40 }}>
    <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
      <OneLoveLogo height={22} dark={false}/>
      <div style={{ ...baseStyles.cap, fontSize: 9, color: T.muted }}>Behavior Analysts, PLLC</div>
      <p style={{ fontFamily: T.sans, fontSize: 11, lineHeight: 1.55, color: T.muted, margin: 0, maxWidth: 640 }}>
        OneLove Behavior Analysts, PLLC is not affiliated with, endorsed by, or sponsored by the New York State Education Department or the Evaluation Systems group of Pearson. NYSTCE® and CST® are registered marks of their respective owners. This practice tool is provided for educational purposes only and does not guarantee passage of any New York State teacher certification examination.
      </p>
    </div>
  </footer>
);

// Page chrome. Lives at module scope — defining this inside App() made it a
// new component type every render, remounting the whole subtree on each
// state change (scroll/focus loss).
const Shell = ({ nav, children }) => (
  <div style={{ minHeight: '100vh', color: 'var(--text)', display: 'flex', flexDirection: 'column' }}>
    <GlobalStyles />
    {nav}
    <div style={{ flex: 1 }}>{children}</div>
    <OneLoveFooter/>
  </div>
);

// ─── NAVBAR ────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'welcome',    label: 'Home',     always: true },
  { id: 'flashcards', label: 'Cards',    always: true },
  { id: 'quiz',       label: 'Quiz',     always: true },
  { id: 'mock',       label: 'Mock Exam', always: true },
  { id: 'misses',     label: 'Misses',   always: true },
  { id: 'pretest',    label: 'Pretest',  always: true },
  { id: 'cresponse',  label: 'Constructed Response', always: true },
  { id: 'progress',   label: 'My Progress', always: true },
  { id: 'results',    label: 'Results',  needs: 'pretestScores' },
  { id: 'modules',    label: 'Study',    needs: 'pretestScores' },
  { id: 'posttest',   label: 'Post-Test',needs: 'pretestScores' },
  { id: 'comparison', label: 'Report',   needs: 'postScores' },
];
const NavBar = ({ st, onNav, onReset, onConfirmReset, onCancelReset, onToggleTheme }) => {
  const active = st.phase === 'module' ? 'modules'
    : (st.phase === 'quizPicker' || st.phase === 'quizRun' || st.phase === 'quizDone') ? 'quiz'
    : (st.phase === 'missHub' || st.phase === 'missRun' || st.phase === 'missDone') ? 'misses'
    : st.phase;
  return (
    <div style={{ background: '#241a10', position: 'sticky', top: 0, zIndex: 200, boxShadow: '0 2px 14px rgba(36,26,16,0.22)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '9px clamp(12px, 4vw, 40px) 7px', borderBottom: '1px solid rgba(246,239,224,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={() => onNav('welcome')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} aria-label="Home">
          <OneLoveLogo height={22} dark={true}/>
        </button>
      </div>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '7px clamp(12px, 4vw, 40px) 9px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const avail = item.always || !!st[item.needs];
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => avail && onNav(item.id)} disabled={!avail}
                style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, color: isActive ? '#241a10' : (avail ? '#f0e7d6' : 'rgba(240,231,214,0.4)'), padding: '5px 11px', borderRadius: 99, background: isActive ? '#f6efe0' : 'transparent', border: 'none', cursor: avail ? 'pointer' : 'default', whiteSpace: 'nowrap', transition: 'all .2s' }}>
                {item.label}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button onClick={onToggleTheme} title={st.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={st.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{ padding: '4px 9px', borderRadius: 99, border: '1px solid rgba(246,239,224,0.2)', background: 'transparent', color: '#f0e7d6', cursor: 'pointer', fontSize: 13, lineHeight: 1 }}>
            {st.theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {!st.confirmReset
            ? <button onClick={onReset} style={{ fontFamily: T.sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#e0928a', background: 'none', border: 'none', cursor: 'pointer' }}>Reset</button>
            : <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: T.sans, fontSize: 9, color: '#c7b69a' }}>Start over?</span>
                <button onClick={onConfirmReset} style={{ fontFamily: T.sans, fontSize: 9, fontWeight: 700, color: '#fff', background: '#a8453a', padding: '3px 8px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Yes</button>
                <button onClick={onCancelReset} style={{ fontFamily: T.sans, fontSize: 9, color: '#c7b69a', background: 'none', padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(246,239,224,0.25)', cursor: 'pointer' }}>No</button>
              </div>}
        </div>
      </div>
    </div>
  );
};

// ─── WELCOME ───────────────────────────────────────────────
const Welcome = ({ onStart }) => (
  <Page>
    <div className="welcome-orb" style={{ top: -70, right: -50, width: 300, height: 300, background: 'radial-gradient(circle, rgba(194,83,31,.18) 0%, transparent 70%)' }} />
    <div className="welcome-orb" style={{ top: '40%', left: -110, width: 320, height: 320, background: 'radial-gradient(circle, rgba(177,132,50,.16) 0%, transparent 70%)', animationDelay: '-5s' }} />

    {/* Hero */}
    <header className="fade-up fade-up-1" style={{ textAlign: 'center', padding: '20px 0 34px' }}>
      <div style={{ ...baseStyles.cap, fontSize: 11, color: T.muted, marginBottom: 16 }}>{WELCOME.imprint}</div>
      <h1 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', lineHeight: 1.04, color: T.ink, letterSpacing: '-.03em', margin: '0 0 18px' }}>
        {WELCOME.title.pre} <span className="greeting-accent">{WELCOME.title.italic}</span> {WELCOME.title.post}
      </h1>
      <p style={{ fontFamily: T.sans, fontSize: '1.06rem', color: T.muted, maxWidth: 620, margin: '0 auto 22px', lineHeight: 1.6 }}>{WELCOME.subtitle}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {WELCOME.alignment.map(item => <Pill key={item} color={T.orange2}>{item}</Pill>)}
      </div>
    </header>

    {/* Know the Test */}
    {WELCOME.testFacts && (
      <section className="fade-up fade-up-2" style={{ marginTop: 18 }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Cap color={T.orange2} mb={6}>Know the Test</Cap>
          <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '1.5rem', color: T.ink, letterSpacing: '-.02em', margin: 0 }}>{WELCOME.testFacts.heading}</h2>
        </div>
        <div className="ol-grid2" style={{ gap: 16 }}>
          {WELCOME.testFacts.tables.map((tbl, ti) => (
            <Card key={ti} className="lift" style={{ padding: '18px 20px' }}>
              {tbl.title && <Cap color={T.muted} mb={10}>{tbl.title}</Cap>}
              {tbl.rows.map((row, ri) => (
                <div key={ri} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '9px 0', borderBottom: ri < tbl.rows.length - 1 ? `1px solid ${T.hairline}` : 'none', fontFamily: T.sans, fontSize: 14, lineHeight: 1.4 }}>
                  <span style={{ color: T.muted }}>{row[0]}</span>
                  <span style={{ color: T.ink, fontWeight: 700, textAlign: 'right', fontFeatureSettings: "'tnum' 1" }}>{row[1]}</span>
                </div>
              ))}
            </Card>
          ))}
        </div>
        {WELCOME.testFacts.note && <p style={{ fontFamily: T.sans, fontSize: 12.5, color: T.muted, lineHeight: 1.6, marginTop: 12, textAlign: 'center' }}>{WELCOME.testFacts.note}</p>}
      </section>
    )}

    {/* Method + Contents */}
    <section className="ol-split fade-up fade-up-3" style={{ padding: '40px 0 0' }}>
      <div style={{ padding: '0 28px' }}>
        <Cap color={T.orange2} mb={6}>The Method</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '1.5rem', color: T.ink, letterSpacing: '-.02em', margin: '0 0 18px' }}>How This Works</h2>
        {WELCOME.steps.map(([title, desc], i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 14, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-bg)', color: T.orange2, fontFamily: T.sans, fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
            <div>
              <h3 style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 16, margin: '4px 0 3px', color: T.ink }}>{title}</h3>
              <p style={{ fontFamily: T.sans, fontSize: 14, color: T.muted, lineHeight: 1.55, margin: 0 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="ol-vrule" style={{ background: T.hairline, width: 1 }} />
      <div style={{ padding: '0 28px' }}>
        <Cap color={T.orange2} mb={6}>{WELCOME.subareasHeading}</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '1.5rem', color: T.ink, letterSpacing: '-.02em', margin: '0 0 18px' }}>Contents</h2>
        {Object.entries(SUBTESTS).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', marginBottom: 8, borderRadius: 12, background: 'var(--surface)', border: `1px solid ${T.hairline}` }}>
            <span style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 13, color: T.orange2, minWidth: 30 }}>{v.roman}</span>
            <span style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 600, color: T.ink, lineHeight: 1.25 }}>{v.label}</span>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <div className="fade-up fade-up-4" style={{ textAlign: 'center', marginTop: 48 }}>
      <p style={{ fontFamily: T.sans, fontSize: '1.02rem', color: T.muted, marginBottom: 20, lineHeight: 1.5, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
        Begin with the diagnostic pretest. The course is sequential.
      </p>
      <Btn onClick={onStart} variant="accent" style={{ padding: '16px 44px', fontSize: 16 }}>Begin the Pretest <span className="cta-arrow">→</span></Btn>
    </div>

    {/* Colophon */}
    <div className="fade-up fade-up-5" style={{ marginTop: 48, paddingTop: 22, borderTop: `1px solid ${T.hairline}`, textAlign: 'center', fontFamily: T.sans, fontSize: 12.5, color: T.muted, lineHeight: 1.6, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
      <div style={{ ...baseStyles.cap, fontSize: 10, color: T.ink, marginBottom: 6 }}>Colophon</div>
      {WELCOME.colophon}
    </div>
  </Page>
);

// ─── QUESTION SCREEN ───────────────────────────────────────
const QuestionScreen = ({ questions, answers, qIndex, onAnswer, onNav, onSubmit, phase }) => {
  const q = questions[qIndex];
  const selected = answers[qIndex];
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const subtest = SUBTESTS[q.s];
  return (
    <Page narrow>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
        <Pill color={T.orange2}>{WELCOME.subareaWord} {subtest.roman} · {subtest.label}</Pill>
        <span style={{ fontFamily: T.sans, fontSize: 13, color: T.muted, fontWeight: 600 }}>Question {qIndex + 1} of {total}</span>
      </div>
      <div style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, marginBottom: 14 }}>{q.d}</div>
      <div style={{ height: 6, background: 'var(--border)', borderRadius: 99, marginBottom: 26, overflow: 'hidden' }}>
        <div style={{ width: `${((qIndex + 1) / total) * 100}%`, height: '100%', background: T.orange, borderRadius: 99, transition: 'width .3s' }} />
      </div>
      <Card style={{ marginBottom: 18, padding: '22px 24px' }}>
        <p id={`q-${qIndex}-stem`} style={{ fontFamily: T.serif, fontSize: 20, lineHeight: 1.55, color: T.ink, margin: 0, fontWeight: 500 }}>{q.q}</p>
      </Card>
      <div role="radiogroup" aria-labelledby={`q-${qIndex}-stem`} onKeyDown={radioGroupKeys} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {q.a.map((opt, i) => {
          const isSelected = selected === i;
          return (
            <button key={i} role="radio" aria-checked={isSelected} onClick={() => onAnswer(qIndex, i)}
              tabIndex={isSelected || (selected === undefined && i === 0) ? 0 : -1}
              style={{ textAlign: 'left', padding: '13px 16px', borderRadius: 14, border: `2px solid ${isSelected ? T.orange : T.hairline}`, background: isSelected ? 'var(--accent-bg)' : T.glass, cursor: 'pointer', fontFamily: T.sans, fontSize: 15.5, color: T.ink, transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 13 }}>
              <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, border: `2px solid ${isSelected ? T.orange : T.hairline}`, background: isSelected ? T.orange : 'transparent', color: isSelected ? '#fff' : T.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{['A', 'B', 'C', 'D'][i]}</span>
              <span style={{ lineHeight: 1.5 }}>{opt}</span>
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <Btn onClick={() => onNav(-1)} variant="ghost" disabled={qIndex === 0} style={{ padding: '11px 22px' }}>← Back</Btn>
        <span style={{ fontFamily: T.sans, fontSize: 12, color: T.muted, fontWeight: 600 }}>{answeredCount} of {total} answered</span>
        {qIndex < total - 1
          ? <Btn onClick={() => onNav(1)} variant="primary" style={{ padding: '11px 24px' }}>Next →</Btn>
          : <Btn onClick={onSubmit} variant="accent" disabled={answeredCount < total} style={{ padding: '11px 24px' }}>{answeredCount < total ? `${total - answeredCount} unanswered` : `Submit ${phase}`}</Btn>}
      </div>
    </Page>
  );
};

// ─── REVIEW INCORRECT ──────────────────────────────────────
const ReviewIncorrect = ({ items, onBack }) => {
  const [idx, setIdx] = useState(0);
  const cur = items[idx];
  const q = cur.q;
  return (
    <Page narrow>
      <button onClick={onBack} style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 18 }}>← Back to results</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 12 }}>
        <Pill color={T.red} bg={T.redBg}>Missed · {WELCOME.subareaWord} {SUBTESTS[q.s]?.roman}</Pill>
        <span style={{ fontFamily: T.sans, fontSize: 12, color: T.muted }}>Item {idx + 1} of {items.length}</span>
      </div>
      <div style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, marginBottom: 14 }}>{q.d}</div>
      <Card style={{ marginBottom: 16, padding: '20px 22px' }}>
        <p style={{ fontFamily: T.serif, fontSize: 19, lineHeight: 1.5, color: T.ink, margin: 0, fontWeight: 500 }}>{q.q}</p>
      </Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {q.a.map((opt, i) => {
          const isCorrect = i === q.c;
          const isUser = i === cur.user;
          let bg = T.glass, border = T.hairline, ring = T.hairline, rbg = 'transparent', rfg = T.muted, marker = null;
          if (isCorrect) { bg = 'var(--green-bg)'; border = 'var(--green-border)'; ring = T.green; rbg = T.green; rfg = '#fff'; marker = <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, color: T.green, marginLeft: 'auto', whiteSpace: 'nowrap' }}>✓ Correct</span>; }
          else if (isUser) { bg = 'var(--red-bg)'; border = 'var(--red-border)'; ring = T.red; rbg = T.red; rfg = '#fff'; marker = <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, color: T.red, marginLeft: 'auto', whiteSpace: 'nowrap' }}>✗ Your answer</span>; }
          return (
            <div key={i} style={{ padding: '12px 16px', borderRadius: 14, border: `2px solid ${border}`, background: bg, fontFamily: T.sans, fontSize: 15, color: T.ink, display: 'flex', alignItems: 'center', gap: 13 }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, border: `2px solid ${ring}`, background: rbg, color: rfg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{['A', 'B', 'C', 'D'][i]}</span>
              <span style={{ flex: 1, lineHeight: 1.5 }}>{opt}</span>
              {marker}
            </div>
          );
        })}
      </div>
      <Card style={{ marginBottom: 24, background: 'var(--accent-bg)' }}>
        <div style={{ ...baseStyles.cap, fontSize: 10, color: T.orange2, marginBottom: 8 }}>Annotation</div>
        <p style={{ fontFamily: T.sans, fontSize: 15, lineHeight: 1.6, color: T.ink, margin: 0 }}>{q.r}</p>
      </Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14 }}>
        <Btn onClick={() => setIdx(Math.max(0, idx - 1))} variant="ghost" disabled={idx === 0} style={{ padding: '11px 22px' }}>← Previous</Btn>
        <Btn onClick={() => idx < items.length - 1 ? setIdx(idx + 1) : onBack()} variant="primary" style={{ padding: '11px 22px' }}>{idx < items.length - 1 ? 'Next →' : 'Done'}</Btn>
      </div>
    </Page>
  );
};

// ─── RESULTS ───────────────────────────────────────────────
const Results = ({ scores, weakDomains, onContinue, isPost, pretestScores, sourceQuestions, sourceAnswers }) => {
  const [reviewing, setReviewing] = useState(false);
  const overall = Object.values(scores.subtests).reduce((a, b) => ({ correct: a.correct + b.correct, total: a.total + b.total }), { correct: 0, total: 0 });
  const overallPct = pct(overall.correct, overall.total);
  const missed = sourceQuestions ? sourceQuestions.map((q, i) => ({ q, i, user: sourceAnswers?.[i] })).filter(x => x.user !== x.q.c) : [];
  if (reviewing && missed.length > 0) return <ReviewIncorrect items={missed} onBack={() => setReviewing(false)} />;
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 26 }}>
        <div style={{ fontSize: 46, marginBottom: 6 }}>{overallPct >= 70 ? '📈' : '📊'}</div>
        <Cap color={T.orange2} mb={8}>{isPost ? 'Post-Test · Final Examination' : 'Pretest · Diagnostic'}</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '2rem', color: T.ink, letterSpacing: '-.02em', margin: '0 0 8px' }}>{isPost ? 'Final Results' : 'Diagnostic Results'}</h2>
        <div style={{ fontFamily: T.sans, fontSize: 16, color: T.muted }}>Overall score: <span style={{ color: T.orange2, fontWeight: 800 }}>{overallPct}%</span> ({overall.correct} of {overall.total})</div>
      </header>
      <Card style={{ marginBottom: 18 }}>
        <Cap color={T.orange2} mb={14}>By {WELCOME.subareaWord}</Cap>
        {Object.entries(scores.subtests).map(([k, v]) => (
          <ProgressRow key={k} value={pct(v.correct, v.total)} label={`${WELCOME.subareaWord} ${SUBTESTS[k]?.roman} · ${SUBTESTS[k]?.label} (${v.correct}/${v.total})`} color={pct(v.correct, v.total) >= 70 ? T.green : T.red} />
        ))}
      </Card>
      <Card style={{ marginBottom: 18 }}>
        <Cap color={T.orange2} mb={14}>By Domain</Cap>
        {Object.entries(scores.domains).map(([d, v]) => {
          const p = pct(v.correct, v.total);
          const needsWork = p < 70;
          return (
            <div key={d} style={{ marginBottom: 12, padding: '12px 14px', borderRadius: 12, background: needsWork ? 'var(--red-bg)' : 'transparent', border: `1px solid ${needsWork ? 'var(--red-border)' : T.hairline}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, gap: 10 }}>
                <span style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 700, color: T.ink }}>{d}</span>
                {needsWork && <Pill color={T.red} bg={T.redBg}>Review</Pill>}
              </div>
              <ProgressRow value={p} label={`${v.correct} of ${v.total} correct`} color={needsWork ? T.red : T.green} />
            </div>
          );
        })}
      </Card>
      {isPost && pretestScores && (
        <Card style={{ marginBottom: 18 }}>
          <Cap color={T.orange2} mb={14}>Growth Across the Course</Cap>
          {Object.entries(scores.domains).map(([d, v]) => {
            const pre = pretestScores.domains[d]; if (!pre) return null;
            const preP = pct(pre.correct, pre.total); const postP = pct(v.correct, v.total); const diff = postP - preP;
            return (
              <div key={d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, padding: '8px 0', borderBottom: `1px solid ${T.hairline}`, fontFamily: T.sans, fontSize: 14 }}>
                <span style={{ color: T.muted }}>{d}</span>
                <span style={{ color: diff > 0 ? T.green : diff < 0 ? T.red : T.muted, fontWeight: 700, whiteSpace: 'nowrap' }}>{preP}% → {postP}% ({diff > 0 ? '+' : ''}{diff}%)</span>
              </div>
            );
          })}
        </Card>
      )}
      {!isPost && weakDomains.length > 0 && (
        <Card style={{ marginBottom: 18, background: 'var(--accent-bg)' }}>
          <Cap color={T.orange2} mb={10}>Recommended Study</Cap>
          <p style={{ fontFamily: T.sans, fontSize: 14, color: T.ink, marginBottom: 12, lineHeight: 1.5 }}>{weakDomains.length} {weakDomains.length === 1 ? 'domain' : 'domains'} below 70%. The course advises study before the post-test.</p>
          {weakDomains.map(d => (
            <div key={d} style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 600, color: T.ink, padding: '3px 0' }}>→ {d}</div>
          ))}
        </Card>
      )}
      {missed.length > 0 && (
        <Btn onClick={() => setReviewing(true)} variant="ghost" style={{ width: '100%', padding: '14px', marginBottom: 12 }}>Review the {missed.length} Missed Question{missed.length > 1 ? 's' : ''}</Btn>
      )}
      {isPost ? (
        <Btn onClick={onContinue} variant="ghost" style={{ width: '100%', padding: '14px' }}>Start a New Course → (clears all progress)</Btn>
      ) : (
        <Btn onClick={onContinue} variant="accent" style={{ width: '100%', padding: '16px' }}>{weakDomains.length > 0 ? `Begin Study Modules (${weakDomains.length})` : 'Proceed to the Post-Test'}</Btn>
      )}
    </Page>
  );
};

// ─── MODULE HUB + LEARNING MODULE ──────────────────────────
const ModuleHub = ({ domains, weakDomains, completedModules, onSelect, onSkip }) => {
  const weakDone = weakDomains.every(d => completedModules.includes(d));
  return (
  <Page narrow>
    <header style={{ textAlign: 'center', marginBottom: 26 }}>
      <Cap color={T.orange2} mb={8}>The Course of Study</Cap>
      <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '2rem', color: T.ink, letterSpacing: '-.02em', margin: 0 }}>Your Study Plan</h2>
      <p style={{ fontFamily: T.sans, fontSize: 15, color: T.muted, marginTop: 10, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
        {weakDomains.length > 0 ? 'Modules flagged from your pretest are listed first — start there. Every module is open to study.' : 'No domains fell below 70% on your pretest. Study any module, or proceed to the post-test.'}
      </p>
    </header>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {domains.map((d, i) => {
        const mod = MODULES[d];
        const done = completedModules.includes(d);
        const flagged = weakDomains.includes(d);
        return (
          <Card key={d} className="lift" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '16px 20px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, flexWrap: 'wrap' }}>
                <Cap color={T.muted}>Module {String(i + 1).padStart(2, '0')}</Cap>
                {done && <Pill color={T.green} bg={T.greenBg}>✓ Completed</Pill>}
                {flagged && !done && <Pill color={T.red} bg={T.redBg}>Review</Pill>}
              </div>
              <h3 style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 17, color: T.ink, margin: '0 0 3px', letterSpacing: '-.01em' }}>{d}</h3>
              <p style={{ fontFamily: T.sans, fontSize: 13, color: T.muted, margin: 0 }}>{mod?.concepts?.length || 0} concepts · {mod?.practice?.length || 0} practice questions</p>
            </div>
            <Btn onClick={() => onSelect(d)} variant={done ? 'ghost' : (flagged ? 'accent' : 'primary')} style={{ padding: '10px 22px' }}>{done ? 'Revisit' : 'Begin →'}</Btn>
          </Card>
        );
      })}
    </div>
    <div style={{ marginTop: 28, textAlign: 'center' }}>
      <p style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 14 }}>{completedModules.length} of {domains.length} modules completed{weakDomains.length > 0 ? ` · ${weakDomains.filter(d => completedModules.includes(d)).length} of ${weakDomains.length} flagged` : ''}</p>
      <Btn onClick={onSkip} variant={weakDone ? 'accent' : 'ghost'} style={{ padding: '14px 36px' }}>{weakDone ? 'Begin Post-Test →' : 'Skip to Post-Test →'}</Btn>
    </div>
  </Page>
  );
};

// Interactive concept-study walkthrough — one concept at a time with the BCBA
// engagement layer (progress dots, Mastery Map, key terms, Quick Check,
// Categorize), recolored to the CST warm palette. Replaces the old static
// read-through of the module's concepts.
const ConceptStudy = ({ domain, conceptProgress, onConceptView, onConceptRate, onBack, onStartPractice }) => {
  const mod = MODULES[domain];
  const [conceptIdx, setConceptIdx] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const domainProgress = conceptProgress?.[domain] || {};
  useEffect(() => { onConceptView?.(conceptIdx); }, [conceptIdx, domain]);

  const enh = MODULE_ENHANCEMENTS[domain]?.[conceptIdx] || {};
  const concept = { ...mod.concepts[conceptIdx], ...enh };
  const ctype = CST_CONCEPT_TYPES[conceptIdx % CST_CONCEPT_TYPES.length];
  const isLast = conceptIdx === mod.concepts.length - 1;
  const go = (d) => setConceptIdx(i => Math.max(0, Math.min(mod.concepts.length - 1, i + d)));

  return (
    <Page narrow>
      <button onClick={onBack} style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 24 }}>← Back to study plan</button>
      <Cap color={T.orange2} mb={12}>— Module · Concepts</Cap>
      <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 38, color: T.ink, letterSpacing: '-.01em', lineHeight: 1.08, marginBottom: 20 }}>{domain}</h2>

      {/* Progress dots + Mastery Map toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        {mod.concepts.map((_, i) => (
          <button key={i} onClick={() => setConceptIdx(i)} aria-label={`Go to concept ${i + 1}`}
            style={{ height: 8, borderRadius: 99, cursor: 'pointer', flexShrink: 0, border: 'none', padding: 0,
              width: i === conceptIdx ? 28 : 8,
              background: i <= conceptIdx ? ctype.color : T.hairline,
              transition: 'all .3s ease' }} />
        ))}
        <span style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, marginLeft: 6, flex: 1 }}>{conceptIdx + 1} / {mod.concepts.length}</span>
        <button onClick={() => setShowMap(s => !s)}
          style={{ ...baseStyles.cap, fontSize: 10, padding: '6px 12px', borderRadius: 99, border: `1px solid ${ctype.color}`,
            background: showMap ? ctype.color : 'transparent', color: showMap ? T.paper : ctype.color, cursor: 'pointer' }}>
          🗺 Map
        </button>
      </div>
      {showMap && (
        <div style={{ marginBottom: 20 }}>
          <MasteryMap domain={domain} concepts={mod.concepts} progress={domainProgress}
            onJumpTo={(i) => { setConceptIdx(i); setShowMap(false); }} color={ctype.color} />
        </div>
      )}

      {/* Concept card */}
      <div key={`${domain}-${conceptIdx}`} className="concept-in"
        style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${ctype.border}`, boxShadow: '0 4px 18px rgba(22,20,16,0.06)', marginBottom: 22 }}>
        <div style={{ background: ctype.bg, padding: '11px 20px', borderBottom: `1px solid ${ctype.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }} aria-hidden="true">{ctype.icon}</span>
            <span style={{ ...baseStyles.cap, fontSize: 10, color: ctype.color }}>{ctype.label}</span>
          </div>
          <Pill color={ctype.color}>§ {String(conceptIdx + 1).padStart(2, '0')}</Pill>
        </div>

        <div style={{ background: T.paper3, padding: '24px 26px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
            <h3 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 24, color: T.ink, margin: 0, lineHeight: 1.25, letterSpacing: '-.005em', flex: 1 }}>{concept.title}</h3>
            <TTSButton token={`mod:${domain}:${conceptIdx}`} text={`${concept.title}. ${concept.body}${concept.example ? '. Applied example: ' + concept.example : ''}`} label="Read" size="xs" />
          </div>
          <p style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.7, color: T.ink, margin: 0 }}>{concept.body}</p>

          {concept.example && (
            <div style={{ marginTop: 20, background: 'var(--accent-bg)', borderLeft: `4px solid ${T.orange}`, borderRadius: '0 10px 10px 0', padding: '14px 16px' }}>
              <div style={{ ...baseStyles.cap, fontSize: 10, color: T.orange2, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}><span aria-hidden="true">📋</span> Applied Example</div>
              <p style={{ fontFamily: T.serif, fontSize: 15, lineHeight: 1.65, color: T.ink, margin: 0, fontStyle: 'italic' }}>{concept.example}</p>
            </div>
          )}

          {concept.animatedVisual && (
            <div style={{ /* fixed light surface — visuals use light-scheme ink, keep readable in dark mode */ marginTop: 20, background: '#fffdf6', borderRadius: 10, padding: '12px 14px', border: `1px solid ${T.hairline}` }}>
              <AnimatedVisual kind={concept.animatedVisual} color={ctype.color} />
            </div>
          )}

          {concept.keyTerms && concept.keyTerms.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <div style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}><span aria-hidden="true">🔑</span> Key Terms · tap to reveal</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 8 }}>
                {concept.keyTerms.map((kt, ki) => (
                  <KeyTermCard key={ki} term={kt.term} def={kt.def} color={ctype.color} bg={ctype.bg} border={ctype.border} />
                ))}
              </div>
            </div>
          )}

          {concept.quickCheck && (
            <QuickCheck quickCheck={concept.quickCheck} color={ctype.color} onRate={(rating) => onConceptRate?.(conceptIdx, rating)} />
          )}

          {concept.categorize && (
            <CategorizeGame categorize={concept.categorize} color={ctype.color} onComplete={(r) => onConceptRate?.(conceptIdx, r.correct === r.total ? 'got-it' : 'almost')} />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <Btn onClick={() => go(-1)} variant="ghost" disabled={conceptIdx === 0} style={{ padding: '13px 24px' }}>← Previous</Btn>
        {isLast
          ? <Btn onClick={onStartPractice} variant="accent" style={{ padding: '13px 28px' }}>Begin Practice Questions →</Btn>
          : <Btn onClick={() => go(1)} variant="primary" style={{ padding: '13px 28px' }}>Next Concept →</Btn>}
      </div>
    </Page>
  );
};

const LearningModule = ({ domain, phase, pqIndex, pAnswers, onPAnswer, onBack, onStartPractice, onFinish, conceptProgress, onConceptView, onConceptRate }) => {
  const mod = MODULES[domain];
  const pq = mod.practice[pqIndex];
  const pSelected = pAnswers[pqIndex];
  if (phase === 'content') return (
    <ConceptStudy domain={domain} conceptProgress={conceptProgress} onConceptView={onConceptView} onConceptRate={onConceptRate} onBack={onBack} onStartPractice={onStartPractice} />
  );
  return (
    <Page narrow>
      <Cap color={T.orange2} mb={8}>{domain} · Practice</Cap>
      <div style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, marginBottom: 18 }}>Question {pqIndex + 1} of {mod.practice.length}</div>
      <Card style={{ marginBottom: 16, padding: '20px 22px' }}>
        <p id={`pq-${pqIndex}-stem`} style={{ fontFamily: T.serif, fontSize: 19, lineHeight: 1.5, color: T.ink, margin: 0, fontWeight: 500 }}>{pq.q}</p>
      </Card>
      <div role="radiogroup" aria-labelledby={`pq-${pqIndex}-stem`} onKeyDown={radioGroupKeys} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {pq.a.map((opt, i) => {
          const isSelected = pSelected === i;
          const showFeedback = pSelected !== undefined;
          const isCorrect = i === pq.c;
          let bg = T.glass, border = T.hairline, ring = T.hairline, rbg = 'transparent', rfg = T.muted;
          if (showFeedback && isCorrect) { bg = 'var(--green-bg)'; border = 'var(--green-border)'; ring = T.green; rbg = T.green; rfg = '#fff'; }
          else if (showFeedback && isSelected && !isCorrect) { bg = 'var(--red-bg)'; border = 'var(--red-border)'; ring = T.red; rbg = T.red; rfg = '#fff'; }
          else if (isSelected) { bg = 'var(--accent-bg)'; border = T.orange; ring = T.orange; rbg = T.orange; rfg = '#fff'; }
          return (
            <button key={i} role="radio" aria-checked={isSelected} onClick={() => !showFeedback && onPAnswer(pqIndex, i)} disabled={showFeedback}
              tabIndex={isSelected || (pSelected === undefined && i === 0) ? 0 : -1}
              style={{ textAlign: 'left', padding: '12px 16px', borderRadius: 14, border: `2px solid ${border}`, background: bg, cursor: showFeedback ? 'default' : 'pointer', fontFamily: T.sans, fontSize: 15, color: T.ink, display: 'flex', gap: 13, alignItems: 'center' }}>
              <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, border: `2px solid ${ring}`, background: rbg, color: rfg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{['A', 'B', 'C', 'D'][i]}</span>
              <span style={{ flex: 1, lineHeight: 1.5 }}>{opt}</span>
              {showFeedback && isCorrect && <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, color: T.green, marginLeft: 'auto' }}>✓</span>}
              {showFeedback && isSelected && !isCorrect && <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, color: T.red, marginLeft: 'auto' }}>✗</span>}
            </button>
          );
        })}
      </div>
      {pSelected !== undefined && (
        <Card style={{ marginBottom: 18, background: 'var(--accent-bg)' }}>
          <Cap color={T.orange2} mb={8}>Annotation</Cap>
          <p style={{ fontFamily: T.sans, fontSize: 15, lineHeight: 1.6, color: T.ink, margin: 0 }}>{pq.r}</p>
        </Card>
      )}
      {pSelected !== undefined && (
        pqIndex < mod.practice.length - 1
          ? <Btn onClick={() => onPAnswer('next')} variant="primary" style={{ width: '100%', padding: '14px' }}>Next Question →</Btn>
          : <Btn onClick={onFinish} variant="accent" style={{ width: '100%', padding: '14px' }}>✓ Complete Module</Btn>
      )}
    </Page>
  );
};

// ─── DOMAIN GRID (used by Flashcards + Quiz pickers) ───────
const DomainGrid = ({ onSelect, getCounts }) => {
  // dynamic — one bucket per SUBTESTS key, no hardcoded coupling
  const groups = Object.fromEntries(Object.keys(SUBTESTS).map(k => [k, []]));
  Object.keys(MODULES).forEach(d => {
    const subtest = (PRETEST.find(q => q.d === d) || POSTTEST.find(q => q.d === d) || {}).s || Object.keys(SUBTESTS)[0];
    groups[subtest].push(d);
  });
  return (
    <div>
      {Object.entries(groups).map(([k, domains]) => domains.length === 0 ? null : (
        <div key={k} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
            <Cap color={T.orange2}>{WELCOME.subareaWord} {SUBTESTS[k]?.roman}</Cap>
            <span style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 600, color: T.ink }}>{SUBTESTS[k]?.label}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 10 }}>
            {domains.map((d) => {
              const meta = getCounts ? getCounts(d) : null;
              return (
                <button key={d} onClick={() => onSelect(d)} className="lift"
                  style={{ textAlign: 'left', padding: '14px 16px', borderRadius: 14, border: `1px solid ${T.hairline}`, background: T.glass, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', boxShadow: T.shadow, cursor: 'pointer' }}>
                  <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 15, color: T.ink, lineHeight: 1.3, marginBottom: 4 }}>{d}</div>
                  {meta && <div style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: T.muted }}>{meta}</div>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── FLASHCARDS ────────────────────────────────────────────
const Flashcards = ({ st, up }) => {
  if (!st.fcDomain) return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 26 }}>
        <Cap color={T.orange2} mb={8}>The Reading Cards</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '2rem', color: T.ink, letterSpacing: '-.02em', margin: 0 }}>Flashcards</h2>
        <p style={{ fontFamily: T.sans, fontSize: 15, color: T.muted, marginTop: 10 }}>Choose a domain to study its key concepts.</p>
      </header>
      <DomainGrid getCounts={d => `${MODULES[d].concepts.length} concepts`} onSelect={d => {
        const order = shuffle(MODULES[d].concepts.map((_, i) => i));
        up({ fcDomain: d, fcOrder: order, fcPos: 0, fcFlipped: false, fcKnown: [] });
      }} />
    </Page>
  );
  const mod = MODULES[st.fcDomain];
  const order = st.fcOrder.length ? st.fcOrder : mod.concepts.map((_, i) => i);
  const remaining = order.filter(idx => !st.fcKnown.includes(idx));
  const allKnown = remaining.length === 0;
  const safePos = Math.min(st.fcPos, Math.max(0, remaining.length - 1));
  const conceptIdx = remaining[safePos] ?? order[0];
  const concept = mod.concepts[conceptIdx];
  const isKnown = st.fcKnown.includes(conceptIdx);
  const advance = (delta) => {
    if (remaining.length === 0) return;
    const next = (safePos + delta + remaining.length) % remaining.length;
    up({ fcPos: next, fcFlipped: false });
  };
  return (
    <Page narrow>
      <button onClick={() => up({ fcDomain: null, fcOrder: [], fcPos: 0, fcFlipped: false, fcKnown: [] })} style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 18 }}>← Choose another domain</button>
      <Cap color={T.orange2} mb={6}>{st.fcDomain}</Cap>
      <p style={{ fontFamily: T.sans, fontSize: 13, color: T.muted, marginBottom: 18, fontWeight: 600 }}>
        {allKnown ? `All ${order.length} cards marked known.` : `Card ${safePos + 1} of ${remaining.length} · ${st.fcKnown.length} marked known`}
      </p>
      {!allKnown && (
        <div role="button" tabIndex={0} aria-pressed={st.fcFlipped} aria-label={`Flashcard ${safePos + 1} of ${remaining.length}. Press Space or Enter to flip.`}
          onClick={() => up({ fcFlipped: !st.fcFlipped })}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); up({ fcFlipped: !st.fcFlipped }); } }}
          style={{ minHeight: 280, padding: 36, marginBottom: 18, background: T.glass, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: `1px solid ${T.hairline}`, borderTop: `3px solid ${T.orange}`, borderRadius: 18, boxShadow: T.shadow, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', outline: 'none' }}>
          <Cap color={T.orange2} mb={16}>{st.fcFlipped ? 'Detail · tap or press Space to flip' : 'Concept · tap or press Space to flip'}</Cap>
          {!st.fcFlipped
            ? <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 30, color: T.ink, lineHeight: 1.2, letterSpacing: '-.02em' }}>{concept.title}</div>
            : <div style={{ fontFamily: T.serif, fontSize: 17, color: T.ink, lineHeight: 1.7 }}>{concept.body}</div>}
        </div>
      )}
      {allKnown && (
        <Card style={{ textAlign: 'center', marginBottom: 18 }}>
          <Cap color={T.green} mb={8}>Completed</Cap>
          <p style={{ fontFamily: T.sans, fontSize: 16, color: T.ink, marginTop: 8 }}>You have marked every card known. Reset the deck or choose a new domain.</p>
        </Card>
      )}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <Btn onClick={() => advance(-1)} variant="ghost" disabled={allKnown} style={{ flex: 1, padding: '12px' }}>← Prev</Btn>
        <Btn onClick={() => up({ fcFlipped: !st.fcFlipped })} variant="primary" disabled={allKnown} style={{ flex: 1, padding: '12px' }}>Flip</Btn>
        <Btn onClick={() => advance(1)} variant="ghost" disabled={allKnown} style={{ flex: 1, padding: '12px' }}>Next →</Btn>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => {
          if (allKnown) return;
          const nextKnown = isKnown ? st.fcKnown.filter(i => i !== conceptIdx) : [...st.fcKnown, conceptIdx];
          const nextRemaining = order.filter(idx => !nextKnown.includes(idx));
          up({ fcKnown: nextKnown, fcFlipped: false, fcPos: Math.min(safePos, Math.max(0, nextRemaining.length - 1)) });
        }} disabled={allKnown}
          style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 700, flex: 2, padding: '12px', borderRadius: 99, border: `1.5px solid ${isKnown ? T.green : T.hairline}`, background: isKnown ? 'var(--green-bg)' : 'transparent', color: isKnown ? T.green : T.ink, cursor: allKnown ? 'default' : 'pointer' }}>
          {isKnown ? '✓ Marked known · tap to unmark' : 'Mark known'}
        </button>
        <Btn onClick={() => up({ fcOrder: shuffle(order), fcPos: 0, fcFlipped: false })} variant="ghost" style={{ flex: 1, padding: '12px', fontSize: 12 }}>Shuffle</Btn>
        <Btn onClick={() => up({ fcKnown: [], fcPos: 0, fcFlipped: false })} variant="ghost" style={{ flex: 1, padding: '12px', fontSize: 12 }}>Reset</Btn>
      </div>
    </Page>
  );
};

// ─── QUIZ PICKER + RESULTS ─────────────────────────────────
const QuizPicker = ({ pool, onStart }) => {
  const [len, setLen] = useState(10);
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 26 }}>
        <Cap color={T.orange2} mb={8}>The Brief Examination</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '2rem', color: T.ink, letterSpacing: '-.02em', margin: 0 }}>Quick Quiz</h2>
        <p style={{ fontFamily: T.sans, fontSize: 15, color: T.muted, marginTop: 10 }}>Choose a domain and quiz length.</p>
      </header>
      <div style={{ display: 'flex', gap: 10, marginBottom: 26, justifyContent: 'center' }}>
        {[5, 10].map(n => (
          <button key={n} onClick={() => setLen(n)}
            style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 700, padding: '10px 26px', borderRadius: 99, border: `2px solid ${len === n ? T.orange : T.hairline}`, background: len === n ? 'var(--accent-bg)' : 'transparent', color: len === n ? T.orange2 : T.muted, cursor: 'pointer' }}>
            {n} questions
          </button>
        ))}
      </div>
      <DomainGrid getCounts={d => `${pool[d]?.length || 0} questions in pool`} onSelect={d => {
        const available = pool[d] || [];
        if (available.length === 0) return;
        const take = Math.min(len, available.length);
        onStart(d, len, shuffle(available).slice(0, take));
      }} />
    </Page>
  );
};

const QuizResults = ({ domain, qs, answers, onRetry, onPick }) => {
  const [reviewing, setReviewing] = useState(false);
  const correct = qs.filter((q, i) => answers[i] === q.c).length;
  const p = pct(correct, qs.length);
  const missed = qs.map((q, i) => ({ q, i, user: answers[i] })).filter(x => x.user !== x.q.c);
  if (reviewing && missed.length > 0) return <ReviewIncorrect items={missed} onBack={() => setReviewing(false)} />;
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 28 }}>
        <Cap color={T.orange2} mb={10}>{domain} · Quick Quiz</Cap>
        <div style={{ fontFamily: T.sans, fontSize: 64, fontWeight: 800, color: p >= 70 ? T.green : T.red, lineHeight: 1, marginBottom: 10, letterSpacing: '-.02em' }}>{p}%</div>
        <p style={{ fontFamily: T.sans, fontSize: 16, color: T.muted }}>{correct} of {qs.length} correct</p>
      </header>
      {missed.length > 0 && (
        <Btn onClick={() => setReviewing(true)} variant="ghost" style={{ width: '100%', padding: '14px', marginBottom: 12 }}>Review the {missed.length} Missed</Btn>
      )}
      <Btn onClick={onRetry} variant="primary" style={{ width: '100%', padding: '14px', marginBottom: 12 }}>Retry this quiz</Btn>
      <Btn onClick={onPick} variant="ghost" style={{ width: '100%', padding: '14px' }}>← Choose another domain</Btn>
    </Page>
  );
};

// ─── CONSTRUCTED RESPONSE ──────────────────────────────────
const ConstructedResponse = ({ st, up }) => {
  const prompt = CR_PROMPTS.find(p => p.id === st.crPromptId) || CR_PROMPTS[0];
  const draftKey = `${STORAGE_KEY}-cr-draft-${prompt.id}`;
  const [draft, setDraft] = useState('');
  useEffect(() => { try { setDraft(localStorage.getItem(draftKey) || ''); } catch { setDraft(''); } }, [draftKey]);
  const saveDraft = (val) => { setDraft(val); try { localStorage.setItem(draftKey, val); } catch {} };
  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  // Holistic 4-point self-score (matches the NYSTCE CST written-assignment scale).
  const setHolistic = (score) => { const next = { holistic: score }; up({ crSelfScore: next, crScored: { ...(st.crScored || {}), [prompt.id]: next } }); track('cr_selfscored', { promptId: prompt.id, holistic: score }); };
  const holisticSel = st.crSelfScore?.holistic;
  const tab = (id, label) => {
    const active = st.crView === id;
    return (
      <button onClick={() => up({ crView: id })}
        style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 700, flex: 1, padding: '11px', borderRadius: 99, border: `1.5px solid ${active ? T.orange : T.hairline}`, background: active ? 'var(--accent-bg)' : 'transparent', color: active ? T.orange2 : T.muted, cursor: 'pointer' }}>{label}</button>
    );
  };
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 24 }}>
        <Cap color={T.orange2} mb={8}>The Written Assignment</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '2rem', color: T.ink, letterSpacing: '-.02em', margin: 0 }}>Constructed Response</h2>
        <p style={{ fontFamily: T.sans, fontSize: 15, color: T.muted, marginTop: 10 }}>{WELCOME.crSubtitle || 'Case-study analysis · constructed-response practice'}</p>
      </header>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {CR_PROMPTS.map((p, i) => {
          const active = p.id === st.crPromptId;
          return (
            <button key={p.id} onClick={() => up({ crPromptId: p.id, crView: 'prompt', crSelfScore: {} })} className="lift"
              style={{ flex: 1, minWidth: 240, padding: '14px 18px', borderRadius: 14, border: `2px solid ${active ? T.orange : T.hairline}`, background: active ? 'var(--accent-bg)' : T.glass, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', boxShadow: T.shadow, cursor: 'pointer', textAlign: 'left' }}>
              <Cap color={T.orange2} mb={4}>Case Study {String(i + 1).padStart(2, '0')}</Cap>
              <div style={{ fontFamily: T.sans, fontSize: 15, color: T.ink, fontWeight: 700, lineHeight: 1.3 }}>{p.title}</div>
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>{tab('prompt', 'Prompt + Draft')}{tab('rubric', 'Rubric')}{tab('exemplar', 'Exemplar')}</div>

      {st.crView === 'prompt' && (
        <>
          <Card style={{ marginBottom: 16 }}>
            <Cap color={T.orange2} mb={10}>Scenario</Cap>
            <p style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.65, color: T.ink, margin: 0, whiteSpace: 'pre-wrap' }}>{prompt.scenario}</p>
          </Card>
          <Card style={{ marginBottom: 18, background: 'var(--accent-bg)' }}>
            <Cap color={T.orange2} mb={10}>Your Task</Cap>
            <p style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.65, color: T.ink, margin: 0, whiteSpace: 'pre-wrap' }}>{prompt.task}</p>
          </Card>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <Cap color={T.orange2}>Your Draft</Cap>
              <span style={{ fontFamily: T.sans, fontSize: 12, color: T.muted }}>{wordCount} words · saved locally</span>
            </div>
            <textarea value={draft} onChange={(e) => saveDraft(e.target.value)} placeholder="Compose your response here. Address each numbered part of the task. Your draft is saved automatically."
              aria-label="Draft response"
              onFocus={(e) => { e.target.style.boxShadow = '0 0 0 3px var(--accent-bg)'; e.target.style.borderColor = T.orange; }}
              onBlur={(e) => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = 'var(--border)'; }}
              style={{ width: '100%', minHeight: 320, padding: '18px 20px', borderRadius: 14, border: `1.5px solid ${T.hairline}`, background: 'var(--surface-solid)', color: T.ink, fontSize: 16, lineHeight: 1.65, fontFamily: T.serif, resize: 'vertical', outline: 'none', transition: 'box-shadow .15s, border-color .15s', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
              <Btn onClick={() => up({ crView: 'rubric' })} variant="accent" style={{ flex: 1, minWidth: 160, padding: '14px' }}>Score with Rubric →</Btn>
              <Btn onClick={() => up({ crView: 'exemplar' })} variant="ghost" style={{ flex: 1, minWidth: 160, padding: '14px' }}>Compare to Exemplar →</Btn>
              <Btn onClick={() => saveDraft('')} variant="ghost" style={{ padding: '14px 20px' }}>Clear</Btn>
            </div>
          </div>
        </>
      )}

      {st.crView === 'rubric' && (
        <>
          <Card style={{ marginBottom: 18 }}>
            <Cap color={T.orange2} mb={8}>How the Written Assignment Is Scored</Cap>
            <p style={{ fontFamily: T.sans, fontSize: 14, color: T.ink, lineHeight: 1.6, margin: 0 }}>The NYSTCE written assignment is scored <strong>holistically on a 4-point scale</strong>, not criterion-by-criterion. Two scorers each assign a 1–4; the performance characteristics below describe what a response must do. Read the descriptors, then assign your draft one honest holistic score.</p>
          </Card>
          {prompt.rubric.map((r, i) => (
            <Card key={i} style={{ marginBottom: 12 }}>
              <Cap color={T.orange2} mb={6}>Performance Characteristic {String(i + 1).padStart(2, '0')}</Cap>
              <h3 style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 17, color: T.ink, marginBottom: 12, letterSpacing: '-.01em' }}>{r.criterion}</h3>
              <div style={{ fontFamily: T.sans, fontSize: 13.5, color: T.ink, lineHeight: 1.55, marginBottom: 5 }}><span style={{ ...baseStyles.cap, fontSize: 9, color: T.green, marginRight: 8 }}>Strong</span>{r.high}</div>
              <div style={{ fontFamily: T.sans, fontSize: 13.5, color: T.ink, lineHeight: 1.55, marginBottom: 5 }}><span style={{ ...baseStyles.cap, fontSize: 9, color: T.orange2, marginRight: 8 }}>Adequate</span>{r.mid}</div>
              <div style={{ fontFamily: T.sans, fontSize: 13.5, color: T.ink, lineHeight: 1.55, margin: 0 }}><span style={{ ...baseStyles.cap, fontSize: 9, color: T.red, marginRight: 8 }}>Limited</span>{r.low}</div>
            </Card>
          ))}
          <Card style={{ marginBottom: 14 }}>
            <Cap color={T.orange2} mb={10}>Assign a Holistic Score (1–4)</Cap>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {CR_HOLISTIC_SCALE.map(lvl => {
                const on = holisticSel === lvl.score;
                return (
                  <button key={lvl.score} onClick={() => setHolistic(lvl.score)}
                    style={{ textAlign: 'left', padding: '12px 14px', borderRadius: 12, cursor: 'pointer', border: `2px solid ${on ? `var(--${lvl.color})` : T.hairline}`, background: on ? `var(--${lvl.color}-bg)` : 'transparent', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', background: `var(--${lvl.color})`, color: '#fff', fontFamily: T.sans, fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{lvl.score}</span>
                    <span style={{ flex: 1 }}>
                      <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 14, color: T.ink, display: 'block', marginBottom: 2 }}>{lvl.label}</span>
                      <span style={{ fontFamily: T.sans, fontSize: 12.5, color: T.muted, lineHeight: 1.5 }}>{lvl.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
          {holisticSel && (
            <Card style={{ background: 'var(--accent-bg)' }}>
              <Cap color={T.orange2} mb={8}>Your Self-Assessment</Cap>
              <p style={{ fontFamily: T.sans, fontSize: 15, color: T.ink, marginBottom: 6 }}>
                Holistic score: <strong>{holisticSel} of 4 — {CR_HOLISTIC_SCALE.find(l => l.score === holisticSel)?.label}</strong>
              </p>
              <p style={{ fontFamily: T.sans, fontSize: 13, color: T.muted, lineHeight: 1.5, margin: 0 }}>{holisticSel >= 3 ? 'A 3 or 4 is passing-range work. Compare to the exemplar to push toward a 4.' : 'Scores of 1–2 signal major revision. Reread the performance characteristics, then compare to the exemplar response.'}</p>
            </Card>
          )}
        </>
      )}

      {st.crView === 'exemplar' && (
        <>
          <Card style={{ marginBottom: 16, background: 'var(--green-bg)', border: '1px solid var(--green-border)' }}>
            <Cap color={T.green} mb={6}>Exemplar Response</Cap>
            <p style={{ fontFamily: T.sans, fontSize: 14, color: T.ink, lineHeight: 1.55, margin: 0 }}>This is one strong response — not the only correct answer. Compare structure, evidence use, and how each task element is addressed.</p>
          </Card>
          <Card>
            <p style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.7, color: T.ink, margin: 0, whiteSpace: 'pre-wrap' }}>{prompt.exemplar}</p>
          </Card>
          <Btn onClick={() => up({ crView: 'prompt' })} variant="primary" style={{ width: '100%', marginTop: 18, padding: '14px' }}>← Back to Draft</Btn>
        </>
      )}
    </Page>
  );
};

// ─── MY PROGRESS (per-user performance report) ─────────────
// Reads the same persisted state the rest of the app writes — works entirely
// from this device's data, with or without the telemetry backend.
// ─── MY MISSES (review bank) ───────────────────────────────
const MissHub = ({ st, onStart, onNav }) => {
  const active = activeMisses(st.missBank);
  const retired = retiredMisses(st.missBank);
  const total = active.length + retired.length;
  const byDom = active.reduce((a, m) => { a[m.domain] = (a[m.domain] || 0) + 1; return a; }, {});
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 26 }}>
        <div style={{ fontSize: 44, marginBottom: 6 }}>🎯</div>
        <Cap color={T.orange2} mb={8}>Error Analysis</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '2rem', color: T.ink, letterSpacing: '-.02em', margin: 0 }}>My Misses</h2>
        <p style={{ fontFamily: T.sans, fontSize: 15, color: T.muted, marginTop: 10, lineHeight: 1.55 }}>Every question you miss lands here. Answer it correctly twice in a row in review and it retires from the bank.</p>
      </header>
      {total === 0 ? (
        <Card style={{ textAlign: 'center', padding: '34px 24px' }}>
          <p style={{ fontFamily: T.sans, fontSize: 16, color: T.ink, margin: '0 0 6px', fontWeight: 700 }}>No misses banked yet</p>
          <p style={{ fontFamily: T.sans, fontSize: 14, color: T.muted, margin: '0 0 20px', lineHeight: 1.55 }}>Take the pretest or a quick quiz — anything you miss is collected here for targeted review.</p>
          <Btn onClick={() => onNav('quiz')} variant="accent" style={{ padding: '13px 30px' }}>Take a Quick Quiz →</Btn>
        </Card>
      ) : (
        <>
          <Card style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
              <Cap color={T.orange2}>Bank Status</Cap>
              <Pill color={retired.length === total ? T.green : T.orange2} bg={retired.length === total ? 'var(--green-bg)' : undefined}>You've cleared {retired.length} of {total} misses</Pill>
            </div>
            <ProgressRow value={pct(retired.length, total)} label={`${active.length} still active · ${retired.length} retired`} color={T.green} />
            {Object.entries(byDom).sort((a, b) => b[1] - a[1]).map(([d, n]) => (
              <div key={d} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '6px 0', borderBottom: `1px solid ${T.hairline}`, fontFamily: T.sans, fontSize: 13.5 }}>
                <span style={{ color: T.ink, fontWeight: 600 }}>{d}</span>
                <span style={{ color: T.muted, whiteSpace: 'nowrap' }}>{n} active {n === 1 ? 'miss' : 'misses'}</span>
              </div>
            ))}
          </Card>
          {active.length > 0
            ? <Btn onClick={onStart} variant="accent" style={{ width: '100%', padding: '16px' }}>Review My Misses ({Math.min(active.length, 20)} question{Math.min(active.length, 20) > 1 ? 's' : ''}) →</Btn>
            : <Card style={{ textAlign: 'center', background: 'var(--green-bg)' }}><p style={{ fontFamily: T.sans, fontSize: 15, color: T.green, fontWeight: 700, margin: 0 }}>✓ All misses cleared — new misses will reopen the bank.</p></Card>}
        </>
      )}
    </Page>
  );
};

const MissResults = ({ st, onAgain, onHub }) => {
  const qs = st.missQs; const answers = st.missAnswers;
  const [reviewing, setReviewing] = useState(false);
  const correct = qs.filter((q, i) => answers[i] === q.c).length;
  const missed = qs.map((q, i) => ({ q, i, user: answers[i] })).filter(x => x.user !== x.q.c);
  const retiredNow = qs.filter(q => st.missBank?.[q.id]?.retired).length;
  const stillActive = activeMisses(st.missBank).length;
  const cleared = retiredMisses(st.missBank).length;
  if (reviewing && missed.length > 0) return <ReviewIncorrect items={missed} onBack={() => setReviewing(false)} />;
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 28 }}>
        <Cap color={T.orange2} mb={10}>My Misses · Review Round</Cap>
        <div style={{ fontFamily: T.sans, fontSize: 64, fontWeight: 800, color: correct === qs.length ? T.green : T.orange2, lineHeight: 1, marginBottom: 10, letterSpacing: '-.02em' }}>{correct}/{qs.length}</div>
        <p style={{ fontFamily: T.sans, fontSize: 16, color: T.muted }}>{retiredNow > 0 ? `${retiredNow} question${retiredNow > 1 ? 's' : ''} retired this round · ` : ''}You've cleared {cleared} of {cleared + stillActive} misses</p>
      </header>
      {missed.length > 0 && <Btn onClick={() => setReviewing(true)} variant="ghost" style={{ width: '100%', padding: '14px', marginBottom: 12 }}>Review the {missed.length} Missed</Btn>}
      {stillActive > 0 && <Btn onClick={onAgain} variant="primary" style={{ width: '100%', padding: '14px', marginBottom: 12 }}>Another round ({Math.min(stillActive, 20)} active) →</Btn>}
      <Btn onClick={onHub} variant="ghost" style={{ width: '100%', padding: '14px' }}>← Back to My Misses</Btn>
    </Page>
  );
};

// ─── READINESS PROJECTION + DOMAIN HEAT MAP (My Progress) ──
const ReadinessCard = ({ attemptLog }) => {
  const proj = projectReadiness(attemptLog);
  useEffect(() => { if (proj) track('readiness', { projected: proj.projected, bar: proj.bar, verdict: proj.verdict }); }, [proj?.projected, proj?.verdict]);
  const verdictStyle = proj && (proj.verdict === 'Ready' ? { c: T.green, bg: 'var(--green-bg)' } : proj.verdict === 'Borderline' ? { c: 'var(--amber)', bg: 'var(--amber-bg)' } : { c: T.red, bg: T.redBg });
  const recent = proj ? proj.attempts.slice(-12) : [];
  return (
    <Card style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <Cap color={T.orange2}>Readiness Projection · NYSTCE scale 400–600, pass = 520</Cap>
        {proj && <Pill color={verdictStyle.c} bg={verdictStyle.bg}>{proj.verdict}</Pill>}
      </div>
      {!proj ? (
        <p style={{ fontFamily: T.sans, fontSize: 14, color: T.muted, margin: 0, lineHeight: 1.55 }}>Complete more scored practice to unlock your readiness projection — at least two scored attempts (pretest, post-test, or quick quizzes) are needed.</p>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
            <span style={{ fontFamily: T.sans, fontSize: 46, fontWeight: 800, color: verdictStyle.c, lineHeight: 1, letterSpacing: '-.02em' }}>{proj.projected}</span>
            <span style={{ fontFamily: T.sans, fontSize: 14, color: T.muted }}>projected scaled score ({proj.projectedPct}% recent-weighted accuracy vs. the ~{PASS_PCT}% ≈ 520 bar)</span>
          </div>
          {/* trajectory bars with the pass bar drawn as a line */}
          <div role="img" aria-label={`Trajectory of your last ${recent.length} scored attempts against the 70 percent pass-equivalent line`}
            style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 5, height: 84, padding: '4px 2px 0', marginBottom: 8 }}>
            <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: `${PASS_PCT}%`, borderTop: `2px dashed ${T.orange}`, zIndex: 1 }} />
            {recent.map((a, i) => (
              <div key={i} title={`${a.type} · ${a.pct}%`} style={{ flex: 1, maxWidth: 34, height: `${Math.max(a.pct, 3)}%`, borderRadius: '4px 4px 0 0', background: a.pct >= PASS_PCT ? T.green : 'var(--amber)', opacity: .55 + .45 * ((i + 1) / recent.length) }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: T.sans, fontSize: 11, color: T.muted, marginBottom: 12 }}>
            <span>older attempts</span><span style={{ color: T.orange2, fontWeight: 700 }}>— — pass bar (≈520)</span><span>most recent</span>
          </div>
          <p style={{ fontFamily: T.sans, fontSize: 12, color: T.muted, margin: 0, lineHeight: 1.5 }}>Projection based on your practice, not a guarantee. Weighted toward your five most recent scored attempts.</p>
        </>
      )}
    </Card>
  );
};

const HeatMapCard = ({ domainLog, onStudy }) => {
  const domains = Object.keys(MODULES);
  const stats = useMemo(() => {
    const byDom = {};
    (domainLog || []).forEach(e => { (byDom[e.d] = byDom[e.d] || []).push(e.ok); });
    return domains.map(d => {
      const arr = byDom[d] || [];
      if (!arr.length) return { d, p: null, trend: null, n: 0 };
      const p = pct(arr.filter(Boolean).length, arr.length);
      let trend = null;
      if (arr.length >= 4) {
        const half = Math.floor(arr.length / 2);
        const early = pct(arr.slice(0, half).filter(Boolean).length, half);
        const late = pct(arr.slice(half).filter(Boolean).length, arr.length - half);
        trend = late - early >= 5 ? 'up' : early - late >= 5 ? 'down' : 'flat';
      }
      return { d, p, trend, n: arr.length };
    });
  }, [domainLog]);
  const cellStyle = (p) => p == null
    ? { color: T.muted, bg: 'var(--surface-2)', border: T.hairline }
    : p >= 80 ? { color: T.green, bg: 'var(--green-bg)', border: 'var(--green-border)' }
    : p >= 60 ? { color: 'var(--amber)', bg: 'var(--amber-bg)', border: 'var(--amber-border)' }
    : { color: T.red, bg: T.redBg, border: 'var(--red-border)' };
  const weakest = stats.filter(s => s.p != null).sort((a, b) => a.p - b.p).slice(0, 3);
  if (!stats.some(s => s.p != null)) return null;
  return (
    <Card style={{ marginBottom: 18 }}>
      <Cap color={T.orange2} mb={4}>Domain Heat Map</Cap>
      <p style={{ fontFamily: T.sans, fontSize: 12.5, color: T.muted, margin: '0 0 14px', lineHeight: 1.5 }}>Accuracy across everything you've answered — pretest, post-test, quizzes, and miss reviews. ▲ improving · ▼ slipping · – steady.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8, marginBottom: weakest.length ? 18 : 0 }}>
        {stats.map(({ d, p, trend, n }) => {
          const c = cellStyle(p);
          return (
            <div key={d} style={{ padding: '10px 12px', borderRadius: 12, background: c.bg, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontFamily: T.sans, fontSize: 12.5, fontWeight: 600, color: T.ink, lineHeight: 1.3, flex: 1 }}>{d}</span>
              <span style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 800, color: c.color, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                {p == null ? '—' : `${p}%`}{trend && <span aria-label={trend === 'up' ? 'improving' : trend === 'down' ? 'declining' : 'steady'} style={{ fontSize: 11, marginLeft: 4 }}>{trend === 'up' ? '▲' : trend === 'down' ? '▼' : '–'}</span>}
              </span>
            </div>
          );
        })}
      </div>
      {weakest.length > 0 && (
        <>
          <Cap color={T.orange2} mb={8}>Your 3 Weakest Domains</Cap>
          {weakest.map(({ d, p }) => (
            <div key={d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: `1px solid ${T.hairline}`, fontFamily: T.sans, fontSize: 13.5 }}>
              <span style={{ color: T.ink, fontWeight: 600, flex: 1 }}>{d} <strong style={{ color: p >= 60 ? 'var(--amber)' : T.red }}>({p}%)</strong></span>
              <button onClick={() => onStudy(d)} aria-label={`Study the ${d} module`}
                style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 700, color: T.orange2, background: 'var(--accent-bg)', border: 'none', padding: '5px 13px', borderRadius: 99, cursor: 'pointer' }}>Study →</button>
            </div>
          ))}
        </>
      )}
    </Card>
  );
};

const scoreSummary = (s) => {
  const o = Object.values(s.subtests).reduce((a, b) => ({ correct: a.correct + b.correct, total: a.total + b.total }), { correct: 0, total: 0 });
  return { overallPct: pct(o.correct, o.total), subtests: Object.fromEntries(Object.entries(s.subtests).map(([k, v]) => [k, pct(v.correct, v.total)])) };
};
const MyProgress = ({ st, onNav, onStudy }) => {
  const user = getUser();
  const domains = Object.keys(MODULES);
  const pre = st.pretestScores ? scoreSummary(st.pretestScores) : null;
  const post = st.postScores ? scoreSummary(st.postScores) : null;
  const latest = post || pre;
  const crDone = Object.keys(st.crScored || {}).length;
  const quizzes = st.quizHistory || [];
  const masteredIn = (d) => Object.values(st.conceptProgress?.[d] || {}).filter(p => p?.rating === 'got-it').length;
  const started = !!(pre || st.completedModules.length || quizzes.length || crDone);
  const readiness = latest ? Object.keys(SUBTESTS).map(k => ({ k, label: SUBTESTS[k].label, roman: SUBTESTS[k].roman, pct: latest.subtests[k] ?? 0, ready: (latest.subtests[k] ?? 0) >= 70 })) : [];
  const readyCount = readiness.filter(r => r.ready).length;
  const allReady = latest && readyCount === readiness.length && crDone >= CR_PROMPTS.length;

  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 26 }}>
        <div style={{ fontSize: 44, marginBottom: 6 }}>📊</div>
        <Cap color={T.orange2} mb={8}>Your Study Report</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '2rem', color: T.ink, letterSpacing: '-.02em', margin: 0 }}>My Progress</h2>
        {user && <p style={{ fontFamily: T.sans, fontSize: 15, color: T.muted, marginTop: 8 }}>Signed in as <strong style={{ color: T.ink }}>{user}</strong></p>}
      </header>

      {!started && (
        <Card style={{ textAlign: 'center', padding: '34px 24px' }}>
          <p style={{ fontFamily: T.sans, fontSize: 16, color: T.ink, margin: '0 0 6px', fontWeight: 700 }}>No study data yet</p>
          <p style={{ fontFamily: T.sans, fontSize: 14, color: T.muted, margin: '0 0 20px', lineHeight: 1.55 }}>Take the diagnostic pretest and this page becomes your personal report — readiness by competency, module mastery, and quiz history.</p>
          <Btn onClick={() => onNav('pretest')} variant="accent" style={{ padding: '13px 30px' }}>Begin the Pretest →</Btn>
        </Card>
      )}

      {started && <ReadinessCard attemptLog={st.attemptLog} />}
      {started && <HeatMapCard domainLog={st.domainLog} onStudy={onStudy} />}

      {latest && (
        <Card style={{ marginBottom: 18, background: allReady ? 'var(--green-bg)' : undefined }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <Cap color={allReady ? T.green : T.orange2}>Exam Readiness {post ? '· from your post-test' : '· from your pretest'}</Cap>
            <Pill color={allReady ? T.green : T.orange2} bg={allReady ? 'var(--green-bg)' : undefined}>{allReady ? '✓ Ready' : `${readyCount} of ${readiness.length} competencies ready`}</Pill>
          </div>
          {readiness.map(r => (
            <ProgressRow key={r.k} value={r.pct} color={r.ready ? T.green : T.red}
              label={`${WELCOME.subareaWord} ${r.roman} · ${r.label}${pre && post ? ` (${pre.subtests[r.k] ?? 0}% → ${post.subtests[r.k] ?? 0}%)` : ''}`} />
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.hairline}`, fontFamily: T.sans, fontSize: 14, flexWrap: 'wrap' }}>
            <span style={{ color: T.muted }}>Written assignments self-scored</span>
            <strong style={{ color: crDone >= CR_PROMPTS.length ? T.green : T.ink }}>{crDone} of {CR_PROMPTS.length}{crDone < CR_PROMPTS.length ? ' — keep drilling' : ' ✓'}</strong>
          </div>
          {pre && post && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 8, fontFamily: T.sans, fontSize: 14 }}>
              <span style={{ color: T.muted }}>Overall growth</span>
              <strong style={{ color: post.overallPct - pre.overallPct >= 0 ? T.green : T.red }}>{pre.overallPct}% → {post.overallPct}% ({post.overallPct - pre.overallPct > 0 ? '+' : ''}{post.overallPct - pre.overallPct}%)</strong>
            </div>
          )}
        </Card>
      )}

      {started && (
        <Card style={{ marginBottom: 18 }}>
          <Cap color={T.orange2} mb={12}>Study Modules</Cap>
          <ProgressRow value={pct(st.completedModules.length, domains.length)} label={`${st.completedModules.length} of ${domains.length} modules completed`} color={T.orange} />
          <div style={{ marginTop: 6 }}>
            {domains.map(d => {
              const done = st.completedModules.includes(d);
              const score = st.moduleScores?.[d];
              const mastered = masteredIn(d);
              const total = MODULES[d]?.concepts?.length || 0;
              return (
                <div key={d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: `1px solid ${T.hairline}`, fontFamily: T.sans, fontSize: 13.5 }}>
                  <span style={{ color: T.ink, fontWeight: 600, flex: 1 }}>{MODULES[d]?.icon} {d}</span>
                  <span style={{ color: T.muted, whiteSpace: 'nowrap' }}>{mastered}/{total} mastered</span>
                  {done
                    ? <Pill color={T.green} bg={'var(--green-bg)'}>✓ {score != null ? `${score}%` : 'done'}</Pill>
                    : <Pill color={T.muted} bg={'var(--surface-2)'}>{mastered > 0 ? 'in progress' : 'not started'}</Pill>}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {started && (activeMisses(st.missBank).length + retiredMisses(st.missBank).length) > 0 && (
        <Card style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <Cap color={T.orange2}>My Misses</Cap>
            <Pill color={activeMisses(st.missBank).length === 0 ? T.green : T.orange2} bg={activeMisses(st.missBank).length === 0 ? 'var(--green-bg)' : undefined}>
              You've cleared {retiredMisses(st.missBank).length} of {activeMisses(st.missBank).length + retiredMisses(st.missBank).length} misses
            </Pill>
          </div>
          <p style={{ fontFamily: T.sans, fontSize: 13.5, color: T.muted, margin: '0 0 12px', lineHeight: 1.5 }}>Answer a banked miss correctly twice in a row in review to retire it.</p>
          {activeMisses(st.missBank).length > 0 && <Btn onClick={() => onNav('misses')} variant="ghost" style={{ width: '100%', padding: '12px' }}>Review My Misses ({activeMisses(st.missBank).length} active) →</Btn>}
        </Card>
      )}

      {quizzes.length > 0 && (
        <Card style={{ marginBottom: 18 }}>
          <Cap color={T.orange2} mb={12}>Quick-Quiz History</Cap>
          {quizzes.slice(-8).reverse().map((q, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: `1px solid ${T.hairline}`, fontFamily: T.sans, fontSize: 13.5 }}>
              <span style={{ color: T.ink, fontWeight: 600, flex: 1 }}>{q.domain}</span>
              <span style={{ color: T.muted, whiteSpace: 'nowrap' }}>{q.ts ? new Date(q.ts).toLocaleDateString() : ''} · {q.len} Q</span>
              <strong style={{ color: q.pct >= 70 ? T.green : T.red, fontVariantNumeric: 'tabular-nums' }}>{q.pct}%</strong>
            </div>
          ))}
        </Card>
      )}

      {started && (
        <p style={{ fontFamily: T.sans, fontSize: 12, color: T.muted, textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
          Progress is saved on this device and browser. Study milestones may also be shared with your instructor to support your preparation.
        </p>
      )}
    </Page>
  );
};

// ─── FULL-LENGTH TIMED MOCK EXAM ───────────────────────────
// Self-contained: builds a 90-item blueprint form on mount, runs a countdown
// timer + flag-for-review palette for the SR section, then a 60-minute
// constructed-response section, and reports the SR result up to the app so it
// feeds the readiness engine (attemptLog + miss bank).
const MockExam = ({ crPrompt, onRecordSR, onExit, theme }) => {
  const [form] = useState(() => buildMockForm());
  const [stage, setStage] = useState('intro'); // intro → sr → srdone → cr → done
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});
  const [showPalette, setShowPalette] = useState(false);
  const [srLeft, setSrLeft] = useState(MOCK_SR_SECONDS);
  const [crLeft, setCrLeft] = useState(MOCK_CR_SECONDS);
  const [reviewing, setReviewing] = useState(false);
  const [draft, setDraft] = useState('');
  const [holistic, setHolistic] = useState(null);
  const [srPct, setSrPct] = useState(null);
  const [srScores, setSrScores] = useState(null);

  const submitSR = () => {
    const s = calcScores(form, answers);
    const correct = form.filter((q, i) => answers[i] === q.c).length;
    const p = pct(correct, form.length);
    setSrPct(p); setSrScores(s);
    onRecordSR?.(form, answers, p);
    setStage('srdone');
  };
  // SR countdown — auto-submits at zero.
  useEffect(() => {
    if (stage !== 'sr') return;
    if (srLeft <= 0) { submitSR(); return; }
    const t = setTimeout(() => setSrLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [stage, srLeft]);
  // CR countdown.
  useEffect(() => {
    if (stage !== 'cr') return;
    if (crLeft <= 0) { setStage('done'); return; }
    const t = setTimeout(() => setCrLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [stage, crLeft]);

  const answeredCount = Object.keys(answers).length;
  const flagCount = Object.values(flags).filter(Boolean).length;
  const timeLow = srLeft <= 300;

  if (stage === 'intro') return (
    <Page narrow>
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ fontSize: 46, marginBottom: 10 }}>⏱️</div>
        <Cap color={T.orange2} mb={10}>Full-Length Timed Simulation</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 'clamp(2rem,5vw,2.8rem)', color: T.ink, letterSpacing: '-.025em', margin: '0 0 16px' }}>The Mock Exam</h2>
        <p style={{ fontFamily: T.sans, fontSize: 16, color: T.muted, lineHeight: 1.6, maxWidth: 560, margin: '0 auto 20px' }}>
          {form.length} selected-response items drawn across all six competencies in the official 060 proportions, then one written assignment. Two timed sections: <strong>135 minutes</strong> for the {form.length} SR items and <strong>60 minutes</strong> for the constructed response. A flag-for-review palette lets you mark items and jump back. The timer auto-submits at zero.
        </p>
        <Card style={{ textAlign: 'left', maxWidth: 460, margin: '0 auto 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${T.hairline}`, fontFamily: T.sans, fontSize: 14 }}><span style={{ color: T.muted }}>Selected-response items</span><strong style={{ color: T.ink }}>{form.length} · 135 min</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${T.hairline}`, fontFamily: T.sans, fontSize: 14 }}><span style={{ color: T.muted }}>Written assignment</span><strong style={{ color: T.ink }}>1 · 60 min</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontFamily: T.sans, fontSize: 14 }}><span style={{ color: T.muted }}>Passing score</span><strong style={{ color: T.ink }}>520 (≈70% here)</strong></div>
        </Card>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Btn onClick={() => setStage('sr')} variant="accent" style={{ padding: '15px 40px', fontSize: 16 }}>Begin the Mock Exam <span className="cta-arrow">→</span></Btn>
          <Btn onClick={onExit} variant="ghost" style={{ padding: '15px 28px' }}>Not now</Btn>
        </div>
      </div>
    </Page>
  );

  if (stage === 'sr') {
    const q = form[idx];
    const sel = answers[idx];
    return (
      <Page narrow>
        {/* Sticky timer + status bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span aria-live="off" style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 20, color: timeLow ? T.red : T.ink, fontVariantNumeric: 'tabular-nums', background: timeLow ? 'var(--red-bg)' : 'var(--surface)', padding: '6px 14px', borderRadius: 10, border: `1px solid ${timeLow ? 'var(--red-border)' : T.hairline}` }}>⏱ {fmtClock(srLeft)}</span>
            <span style={{ fontFamily: T.sans, fontSize: 12.5, color: T.muted, fontWeight: 600 }}>{answeredCount}/{form.length} answered · {flagCount} flagged</span>
          </div>
          <button onClick={() => setShowPalette(s => !s)} style={{ ...baseStyles.cap, fontSize: 10, padding: '7px 14px', borderRadius: 99, border: `1px solid ${T.orange}`, background: showPalette ? T.orange : 'transparent', color: showPalette ? '#fff' : T.orange2, cursor: 'pointer' }}>▦ Question Palette</button>
        </div>
        {showPalette && (
          <Card style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 14, marginBottom: 12, flexWrap: 'wrap', fontFamily: T.sans, fontSize: 11.5, color: T.muted }}>
              <span><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, background: 'var(--accent-bg)', border: `1px solid ${T.orange}`, verticalAlign: 'middle', marginRight: 5 }} />answered</span>
              <span><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, background: 'var(--amber-bg)', border: `1px solid var(--amber-border)`, verticalAlign: 'middle', marginRight: 5 }} />flagged</span>
              <span><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, background: 'var(--surface-2)', border: `1px solid ${T.hairline}`, verticalAlign: 'middle', marginRight: 5 }} />unanswered</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(38px, 1fr))', gap: 6 }}>
              {form.map((_, i) => {
                const ans = answers[i] !== undefined;
                const fl = flags[i];
                const cur = i === idx;
                const bg = fl ? 'var(--amber-bg)' : ans ? 'var(--accent-bg)' : 'var(--surface-2)';
                const bd = cur ? T.ink : fl ? 'var(--amber-border)' : ans ? T.orange : T.hairline;
                return (
                  <button key={i} onClick={() => { setIdx(i); setShowPalette(false); }}
                    style={{ padding: '8px 0', borderRadius: 8, border: `2px solid ${bd}`, background: bg, color: T.ink, fontFamily: T.sans, fontSize: 12, fontWeight: 700, cursor: 'pointer', position: 'relative' }}>
                    {i + 1}{fl && <span style={{ position: 'absolute', top: -3, right: -3, fontSize: 9 }}>🚩</span>}
                  </button>
                );
              })}
            </div>
          </Card>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12, flexWrap: 'wrap' }}>
          <Pill color={T.orange2}>{WELCOME.subareaWord} {SUBTESTS[q.s]?.roman} · {SUBTESTS[q.s]?.label}</Pill>
          <span style={{ fontFamily: T.sans, fontSize: 13, color: T.muted, fontWeight: 600 }}>Question {idx + 1} of {form.length}</span>
        </div>
        <div style={{ height: 6, background: 'var(--border)', borderRadius: 99, marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ width: `${((idx + 1) / form.length) * 100}%`, height: '100%', background: T.orange, borderRadius: 99 }} />
        </div>
        <Card style={{ marginBottom: 16, padding: '22px 24px' }}>
          <p id={`mock-${idx}-stem`} style={{ fontFamily: T.serif, fontSize: 20, lineHeight: 1.55, color: T.ink, margin: 0, fontWeight: 500 }}>{q.q}</p>
        </Card>
        <div role="radiogroup" aria-labelledby={`mock-${idx}-stem`} onKeyDown={radioGroupKeys} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          {q.a.map((opt, i) => {
            const on = sel === i;
            return (
              <button key={i} role="radio" aria-checked={on} onClick={() => setAnswers(a => ({ ...a, [idx]: i }))}
                tabIndex={on || (sel === undefined && i === 0) ? 0 : -1}
                style={{ textAlign: 'left', padding: '13px 16px', borderRadius: 14, border: `2px solid ${on ? T.orange : T.hairline}`, background: on ? 'var(--accent-bg)' : T.glass, cursor: 'pointer', fontFamily: T.sans, fontSize: 15.5, color: T.ink, display: 'flex', alignItems: 'center', gap: 13 }}>
                <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, border: `2px solid ${on ? T.orange : T.hairline}`, background: on ? T.orange : 'transparent', color: on ? '#fff' : T.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{['A', 'B', 'C', 'D'][i]}</span>
                <span style={{ lineHeight: 1.5 }}>{opt}</span>
              </button>
            );
          })}
        </div>
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setFlags(f => ({ ...f, [idx]: !f[idx] }))}
            style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 700, padding: '9px 18px', borderRadius: 99, cursor: 'pointer', border: `1.5px solid ${flags[idx] ? 'var(--amber)' : T.hairline}`, background: flags[idx] ? 'var(--amber-bg)' : 'transparent', color: flags[idx] ? 'var(--amber)' : T.muted }}>
            {flags[idx] ? '🚩 Flagged for review — click to unflag' : '⚐ Flag for review'}
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <Btn onClick={() => setIdx(Math.max(0, idx - 1))} variant="ghost" disabled={idx === 0} style={{ padding: '11px 22px' }}>← Back</Btn>
          {idx < form.length - 1
            ? <Btn onClick={() => setIdx(idx + 1)} variant="primary" style={{ padding: '11px 24px' }}>Next →</Btn>
            : <Btn onClick={submitSR} variant="accent" style={{ padding: '11px 24px' }}>Submit Section →</Btn>}
        </div>
        {idx === form.length - 1 && answeredCount < form.length && (
          <p style={{ fontFamily: T.sans, fontSize: 12.5, color: T.muted, textAlign: 'center', marginTop: 12 }}>{form.length - answeredCount} unanswered — use the palette to find them, or submit to score what you have.</p>
        )}
      </Page>
    );
  }

  if (stage === 'srdone') {
    const missed = form.map((q, i) => ({ q, i, user: answers[i] })).filter(x => x.user !== x.q.c);
    if (reviewing && missed.length > 0) return <ReviewIncorrect items={missed} onBack={() => setReviewing(false)} />;
    return (
      <Page narrow>
        <header style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 44, marginBottom: 6 }}>{srPct >= 70 ? '📈' : '📊'}</div>
          <Cap color={T.orange2} mb={8}>Mock Exam · Selected-Response Section</Cap>
          <div style={{ fontFamily: T.sans, fontSize: 60, fontWeight: 800, color: srPct >= 70 ? T.green : T.red, lineHeight: 1, letterSpacing: '-.02em', marginBottom: 8 }}>{srPct}%</div>
          <p style={{ fontFamily: T.sans, fontSize: 15, color: T.muted }}>{form.filter((q, i) => answers[i] === q.c).length} of {form.length} correct · projected scaled ≈ {pctToScaled(srPct)} (pass 520)</p>
        </header>
        <Card style={{ marginBottom: 18 }}>
          <Cap color={T.orange2} mb={14}>By Competency</Cap>
          {Object.entries(srScores.subtests).map(([k, v]) => (
            <ProgressRow key={k} value={pct(v.correct, v.total)} label={`${WELCOME.subareaWord} ${SUBTESTS[k]?.roman} · ${SUBTESTS[k]?.label} (${v.correct}/${v.total})`} color={pct(v.correct, v.total) >= 70 ? T.green : T.red} />
          ))}
        </Card>
        {missed.length > 0 && <Btn onClick={() => setReviewing(true)} variant="ghost" style={{ width: '100%', padding: '14px', marginBottom: 12 }}>Review the {missed.length} Missed (added to My Misses)</Btn>}
        <Btn onClick={() => setStage('cr')} variant="accent" style={{ width: '100%', padding: '15px' }}>Continue to the Written Assignment (60 min) →</Btn>
        <Btn onClick={onExit} variant="ghost" style={{ width: '100%', padding: '13px', marginTop: 10 }}>End here — return to menu</Btn>
      </Page>
    );
  }

  if (stage === 'cr') {
    const crTimeLow = crLeft <= 300;
    const words = draft.trim() ? draft.trim().split(/\s+/).length : 0;
    return (
      <Page narrow>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <Cap color={T.orange2}>Mock Exam · Written Assignment</Cap>
          <span style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 18, color: crTimeLow ? T.red : T.ink, fontVariantNumeric: 'tabular-nums', background: crTimeLow ? 'var(--red-bg)' : 'var(--surface)', padding: '6px 14px', borderRadius: 10, border: `1px solid ${crTimeLow ? 'var(--red-border)' : T.hairline}` }}>⏱ {fmtClock(crLeft)}</span>
        </div>
        <Card style={{ marginBottom: 14 }}>
          <Cap color={T.orange2} mb={8}>{crPrompt.title}</Cap>
          <p style={{ fontFamily: T.serif, fontSize: 15, lineHeight: 1.6, color: T.ink, margin: 0, whiteSpace: 'pre-wrap' }}>{crPrompt.scenario}</p>
        </Card>
        <Card style={{ marginBottom: 14, background: 'var(--accent-bg)' }}>
          <Cap color={T.orange2} mb={8}>Your Task</Cap>
          <p style={{ fontFamily: T.serif, fontSize: 15, lineHeight: 1.6, color: T.ink, margin: 0, whiteSpace: 'pre-wrap' }}>{crPrompt.task}</p>
        </Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <Cap color={T.orange2}>Your Response</Cap>
          <span style={{ fontFamily: T.sans, fontSize: 12, color: T.muted }}>{words} words</span>
        </div>
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Compose your response here under the 60-minute timer. Address each numbered task element."
          aria-label="Mock constructed response" style={{ width: '100%', minHeight: 300, padding: '18px 20px', borderRadius: 14, border: `1.5px solid ${T.hairline}`, background: 'var(--surface-solid)', color: T.ink, fontSize: 16, lineHeight: 1.65, fontFamily: T.serif, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
        <Btn onClick={() => setStage('done')} variant="accent" style={{ width: '100%', padding: '15px', marginTop: 14 }}>Finish & Self-Score →</Btn>
      </Page>
    );
  }

  // stage === 'done' — CR self-score on the 4-point holistic scale + wrap-up
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 22 }}>
        <div style={{ fontSize: 44, marginBottom: 6 }}>🏁</div>
        <Cap color={T.orange2} mb={8}>Mock Exam Complete</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '1.9rem', color: T.ink, margin: 0, letterSpacing: '-.02em' }}>Score Your Written Response</h2>
        <p style={{ fontFamily: T.sans, fontSize: 15, color: T.muted, marginTop: 8 }}>SR section: <strong style={{ color: srPct >= 70 ? T.green : T.red }}>{srPct}%</strong> · scaled ≈ {pctToScaled(srPct)}</p>
      </header>
      <Card style={{ marginBottom: 14 }}>
        <Cap color={T.orange2} mb={10}>Holistic Score (1–4) — compare your response to the exemplar</Cap>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CR_HOLISTIC_SCALE.map(lvl => {
            const on = holistic === lvl.score;
            return (
              <button key={lvl.score} onClick={() => setHolistic(lvl.score)}
                style={{ textAlign: 'left', padding: '12px 14px', borderRadius: 12, cursor: 'pointer', border: `2px solid ${on ? `var(--${lvl.color})` : T.hairline}`, background: on ? `var(--${lvl.color}-bg)` : 'transparent', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', background: `var(--${lvl.color})`, color: '#fff', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.sans }}>{lvl.score}</span>
                <span style={{ flex: 1 }}>
                  <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 14, color: T.ink, display: 'block', marginBottom: 2 }}>{lvl.label}</span>
                  <span style={{ fontFamily: T.sans, fontSize: 12.5, color: T.muted, lineHeight: 1.5 }}>{lvl.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Card>
      <Card style={{ marginBottom: 14, background: 'var(--green-bg)', border: '1px solid var(--green-border)' }}>
        <Cap color={T.green} mb={6}>Exemplar Response</Cap>
        <p style={{ fontFamily: T.serif, fontSize: 15, lineHeight: 1.7, color: T.ink, margin: 0, whiteSpace: 'pre-wrap' }}>{crPrompt.exemplar}</p>
      </Card>
      <Btn onClick={onExit} variant="primary" style={{ width: '100%', padding: '15px' }}>Return to Menu →</Btn>
    </Page>
  );
};

// ─── APP ROOT ──────────────────────────────────────────────
const STORAGE_KEY = 'swd-cst-060-state-v2';
const OLD_STORAGE_KEYS = ["swd-cst-060-state-v1"];
// fields that survive page reload (skip transient quiz session + reset confirmation)
const PERSIST_FIELDS = ['phase', 'qIndex', 'answers', 'pretestScores', 'pretestAnswers', 'posttestAnswers', 'postScores', 'posttestStarted', 'completedModules', 'conceptProgress', 'moduleScores', 'quizHistory', 'crScored', 'crPromptId', 'theme', 'missBank', 'domainLog', 'attemptLog'];
// transient phases can't resume after a reload (their session state isn't
// persisted) — send the user to the nearest hub instead of a crash/blank page
const PHASE_FALLBACK = { module: 'modules', quizRun: 'quizPicker', quizDone: 'quizPicker', missRun: 'missHub', missDone: 'missHub' };

export default function App() {
  const QUIZ_POOL = useMemo(() => buildQuizPool(), []);
  const [st, setSt] = useState(() => {
    const base = { ...INITIAL_STATE, posttestStarted: false, confirmReset: false, pretestAnswers: {}, posttestAnswers: {} };
    try { OLD_STORAGE_KEYS.forEach(k => localStorage.removeItem(k)); } catch {}
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        // only restore the persisted fields; ignore stale transient state
        const restored = {};
        for (const k of PERSIST_FIELDS) if (k in saved) restored[k] = saved[k];
        if (PHASE_FALLBACK[restored.phase]) restored.phase = PHASE_FALLBACK[restored.phase];
        if (['results', 'modules', 'posttest'].includes(restored.phase) && !restored.pretestScores) restored.phase = 'welcome';
        if (restored.phase === 'comparison' && !restored.postScores) restored.phase = restored.pretestScores ? 'results' : 'welcome';
        // one-time backfill: seed the miss bank + logs from recoverable answers
        return { ...base, ...restored, ...backfillFromSaved(restored) };
      }
    } catch {}
    return base;
  });
  const up = (patch) => setSt(p => ({ ...p, ...patch }));
  // persist milestone state on every change
  useEffect(() => {
    try {
      const persist = {};
      for (const k of PERSIST_FIELDS) if (k in st) persist[k] = st[k];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
    } catch {}
  }, [st]);
  // reflect light/dark theme onto <html data-theme> so the CSS variables flip
  useEffect(() => { document.documentElement.dataset.theme = st.theme || 'light'; }, [st.theme]);
  const weak = st.pretestScores ? Object.entries(st.pretestScores.domains).filter(([, v]) => pct(v.correct, v.total) < 70).map(([d]) => d) : [];
  const handleNav = (id) => {
    const m = {
      welcome:    () => up({ phase: 'welcome',    confirmReset: false }),
      flashcards: () => up({ phase: 'flashcards', confirmReset: false }),
      quiz:       () => up({ phase: 'quizPicker', confirmReset: false, quizDomain: null, quizQs: null, quizIdx: 0, quizAnswers: {} }),
      mock:       () => up({ phase: 'mock', confirmReset: false, mockPromptId: (CR_PROMPTS[Math.floor(Math.random() * CR_PROMPTS.length)] || {}).id }),
      misses:     () => up({ phase: 'missHub',    confirmReset: false, missQs: null, missIdx: 0, missAnswers: {} }),
      // restore the saved pretest/posttest answers so re-entering doesn't show the OTHER exam's selections
      pretest:    () => up({ phase: 'pretest',    confirmReset: false, answers: { ...(st.pretestAnswers || {}) }, qIndex: 0 }),
      cresponse:  () => up({ phase: 'cresponse',  confirmReset: false }),
      progress:   () => up({ phase: 'progress',   confirmReset: false }),
      results:    () => st.pretestScores && up({ phase: 'results',    confirmReset: false }),
      modules:    () => st.pretestScores && up({ phase: 'modules',    confirmReset: false }),
      posttest:   () => st.pretestScores && up({ phase: 'posttest',   confirmReset: false, answers: { ...(st.posttestAnswers || {}) }, qIndex: 0, posttestStarted: !!st.posttestStarted || !!st.postScores }),
      comparison: () => st.postScores    && up({ phase: 'comparison', confirmReset: false }),
    };
    m[id]?.();
  };
  const nav = <NavBar st={st} onNav={handleNav}
    onReset={() => up({ confirmReset: true })}
    onConfirmReset={() => {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      setSt({ ...INITIAL_STATE, posttestStarted: false, confirmReset: false, pretestAnswers: {}, posttestAnswers: {} });
    }}
    onCancelReset={() => up({ confirmReset: false })}
    onToggleTheme={() => up({ theme: st.theme === 'dark' ? 'light' : 'dark' })} />;

  if (st.phase === 'welcome')    return <Shell nav={nav}><Welcome onStart={() => up({ phase: 'pretest', qIndex: 0, answers: {}, pretestAnswers: {} })} /></Shell>;
  if (st.phase === 'flashcards') return <Shell nav={nav}><Flashcards st={st} up={up} /></Shell>;
  if (st.phase === 'cresponse')  return <Shell nav={nav}><ConstructedResponse st={st} up={up} /></Shell>;
  if (st.phase === 'progress')   return <Shell nav={nav}><MyProgress st={st} onNav={handleNav} onStudy={(d) => up({ phase: 'module', activeModule: d, modPhase: 'content', modPQIndex: 0, modPAnswers: {} })} /></Shell>;
  if (st.phase === 'missHub')    return <Shell nav={nav}><MissHub st={st} onNav={handleNav} onStart={() => { const qs = shuffle(activeMisses(st.missBank).map(m => QUESTION_BY_ID[m.id]).filter(Boolean)).slice(0, 20); if (qs.length) up({ phase: 'missRun', missQs: qs, missIdx: 0, missAnswers: {} }); }} /></Shell>;
  if (st.phase === 'missRun' && st.missQs) return <Shell nav={nav}><QuestionScreen questions={st.missQs} answers={st.missAnswers} qIndex={st.missIdx} onAnswer={(i, a) => up({ missAnswers: { ...st.missAnswers, [i]: a } })} onNav={(d) => up({ missIdx: Math.max(0, Math.min(st.missQs.length - 1, st.missIdx + d)) })} onSubmit={() => { const correct = st.missQs.filter((q, i) => st.missAnswers[i] === q.c).length; const patch = applyReviewOutcomes(st, st.missQs, st.missAnswers); track('misses_reviewed', { len: st.missQs.length, pct: pct(correct, st.missQs.length), retiredTotal: retiredMisses(patch.missBank).length, activeTotal: activeMisses(patch.missBank).length }); up({ phase: 'missDone', ...patch }); }} phase="Review Misses" /></Shell>;
  if (st.phase === 'missDone' && st.missQs) return <Shell nav={nav}><MissResults st={st} onAgain={() => { const qs = shuffle(activeMisses(st.missBank).map(m => QUESTION_BY_ID[m.id]).filter(Boolean)).slice(0, 20); if (qs.length) up({ phase: 'missRun', missQs: qs, missIdx: 0, missAnswers: {} }); }} onHub={() => up({ phase: 'missHub', missQs: null, missIdx: 0, missAnswers: {} })} /></Shell>;
  if (st.phase === 'mock')       return <Shell nav={nav}><MockExam theme={st.theme}
    crPrompt={CR_PROMPTS.find(p => p.id === st.mockPromptId) || CR_PROMPTS[0]}
    onRecordSR={(form, answers, p) => { const s = calcScores(form, answers); track('mock_sr_completed', { pct: p, len: form.length, byDomain: byDomainPct(s) }); up({ ...recordOutcomes(st, form, answers, 'mock', p) }); }}
    onExit={() => up({ phase: 'progress', confirmReset: false })} /></Shell>;
  if (st.phase === 'quizPicker') return <Shell nav={nav}><QuizPicker pool={QUIZ_POOL} onStart={(domain, len, qs) => up({ phase: 'quizRun', quizDomain: domain, quizLen: len, quizQs: qs, quizIdx: 0, quizAnswers: {} })} /></Shell>;
  if (st.phase === 'quizRun' && st.quizQs) return <Shell nav={nav}><QuestionScreen questions={st.quizQs} answers={st.quizAnswers} qIndex={st.quizIdx} onAnswer={(i, a) => up({ quizAnswers: { ...st.quizAnswers, [i]: a } })} onNav={(d) => up({ quizIdx: Math.max(0, Math.min(st.quizQs.length - 1, st.quizIdx + d)) })} onSubmit={() => { const correct = st.quizQs.filter((q, i) => st.quizAnswers[i] === q.c).length; const p = pct(correct, st.quizQs.length); const s = calcScores(st.quizQs, st.quizAnswers); const missedCount = st.quizQs.length - correct; track('quiz_completed', { domain: st.quizDomain, len: st.quizQs.length, pct: p, byDomain: byDomainPct(s), missedCount }); up({ phase: 'quizDone', quizHistory: [...(st.quizHistory || []), { domain: st.quizDomain, len: st.quizQs.length, pct: p, ts: new Date().toISOString() }].slice(-30), ...recordOutcomes(st, st.quizQs, st.quizAnswers, 'quiz', p) }); }} phase={`${st.quizDomain} Quiz`} /></Shell>;
  if (st.phase === 'quizDone' && st.quizQs) return <Shell nav={nav}><QuizResults domain={st.quizDomain} qs={st.quizQs} answers={st.quizAnswers} onRetry={() => up({ phase: 'quizRun', quizQs: shuffle(st.quizQs), quizIdx: 0, quizAnswers: {} })} onPick={() => up({ phase: 'quizPicker', quizDomain: null, quizQs: null, quizIdx: 0, quizAnswers: {} })} /></Shell>;
  if (st.phase === 'pretest')    return <Shell nav={nav}><QuestionScreen questions={PRETEST} answers={st.answers} qIndex={st.qIndex} onAnswer={(i, a) => { const next = { ...st.answers, [i]: a }; up({ answers: next, pretestAnswers: next }); }} onNav={(d) => up({ qIndex: Math.max(0, Math.min(PRETEST.length - 1, st.qIndex + d)) })} onSubmit={() => { const s = calcScores(PRETEST, st.answers); const sum = scoreSummary(s); up({ phase: 'results', pretestScores: s, pretestAnswers: { ...st.answers }, ...recordOutcomes(st, PRETEST, st.answers, 'pretest', sum.overallPct) }); track('pretest_completed', { ...sum, byDomain: byDomainPct(s), weak: Object.entries(s.domains).filter(([, v]) => pct(v.correct, v.total) < 70).map(([d]) => d) }); }} phase="Pretest" /></Shell>;
  if (st.phase === 'results')    return <Shell nav={nav}><Results scores={st.pretestScores} weakDomains={weak} sourceQuestions={PRETEST} sourceAnswers={st.pretestAnswers} onContinue={() => up({ phase: 'modules' })} /></Shell>;
  if (st.phase === 'modules')    return <Shell nav={nav}><ModuleHub domains={[...weak, ...Object.keys(MODULES).filter(d => !weak.includes(d))]} weakDomains={weak} completedModules={st.completedModules} onSelect={(d) => up({ phase: 'module', activeModule: d, modPhase: 'content', modPQIndex: 0, modPAnswers: {} })} onSkip={() => up({ phase: 'posttest', posttestStarted: false })} /></Shell>;
  if (st.phase === 'module')     return <Shell nav={nav}><LearningModule domain={st.activeModule} phase={st.modPhase} pqIndex={st.modPQIndex} pAnswers={st.modPAnswers} conceptProgress={st.conceptProgress} onConceptView={(idx) => setSt(p => { const dom = p.activeModule; const cur = p.conceptProgress?.[dom] || {}; if (cur[idx]?.viewed) return p; return { ...p, conceptProgress: { ...p.conceptProgress, [dom]: { ...cur, [idx]: { ...(cur[idx] || {}), viewed: true } } } }; })} onConceptRate={(idx, rating) => setSt(p => { const dom = p.activeModule; const cur = p.conceptProgress?.[dom] || {};
      // Feed the interactive layer (Quick Check + Categorize outcomes) into the
      // readiness engine: log a per-domain accuracy point the FIRST time a
      // concept is rated ('got-it' counts as correct, 'almost'/'review' as not),
      // so the 578 interactions inform the Domain Heat Map + scaled projection.
      const firstRating = !cur[idx]?.rating;
      const domainLog = firstRating ? [...(p.domainLog || []), { d: dom, ok: rating === 'got-it', ts: new Date().toISOString(), kind: 'interactive' }].slice(-800) : p.domainLog;
      return { ...p, domainLog, conceptProgress: { ...p.conceptProgress, [dom]: { ...cur, [idx]: { ...(cur[idx] || {}), viewed: true, rating } } } }; })} onBack={() => up({ phase: 'modules' })} onStartPractice={() => up({ modPhase: 'practice' })} onPAnswer={(i, a) => { if (i === 'next') { up({ modPQIndex: st.modPQIndex + 1 }); return; } up({ modPAnswers: { ...st.modPAnswers, [i]: a } }); }} onFinish={() => { const dom = st.activeModule; const practice = MODULES[dom]?.practice || []; const score = practice.length ? pct(practice.filter((q, i) => st.modPAnswers[i] === q.c).length, practice.length) : 0; const prog = st.conceptProgress?.[dom] || {}; track('module_completed', { domain: dom, practicePct: score, mastered: Object.values(prog).filter(p => p?.rating === 'got-it').length, concepts: (MODULES[dom]?.concepts || []).length }); up({ phase: 'modules', completedModules: [...new Set([...st.completedModules, dom])], moduleScores: { ...st.moduleScores, [dom]: score } }); }} /></Shell>;
  if (st.phase === 'posttest')   return <Shell nav={nav}>{!st.posttestStarted ? (
    <Page narrow>
      <div className="fade-up fade-up-1" style={{ textAlign: 'center', padding: '56px 0' }}>
        <div style={{ fontSize: 46, marginBottom: 10 }}>🏁</div>
        <Cap color={T.orange2} mb={10}>The Final Examination</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 'clamp(2.2rem, 5vw, 3rem)', color: T.ink, letterSpacing: '-.025em', margin: '0 0 16px' }}>The Post-Test</h2>
        <p style={{ fontFamily: T.sans, fontSize: 17, color: T.muted, lineHeight: 1.55, maxWidth: 540, margin: '0 auto 32px' }}>{POSTTEST.length} {WELCOME.posttestIntro}</p>
        <Btn onClick={() => up({ posttestStarted: true, answers: {}, posttestAnswers: {}, qIndex: 0 })} variant="accent" style={{ padding: '16px 44px', fontSize: 16 }}>Begin the Post-Test <span className="cta-arrow">→</span></Btn>
      </div>
    </Page>
  ) : (
    <QuestionScreen questions={POSTTEST} answers={st.answers} qIndex={st.qIndex} onAnswer={(i, a) => { const next = { ...st.answers, [i]: a }; up({ answers: next, posttestAnswers: next }); }} onNav={(d) => up({ qIndex: Math.max(0, Math.min(POSTTEST.length - 1, st.qIndex + d)) })} onSubmit={() => { const s = calcScores(POSTTEST, st.answers); const sum = scoreSummary(s); up({ phase: 'comparison', postScores: s, posttestAnswers: { ...st.answers }, ...recordOutcomes(st, POSTTEST, st.answers, 'posttest', sum.overallPct) }); const pre = st.pretestScores ? scoreSummary(st.pretestScores).overallPct : null; track('posttest_completed', { ...sum, byDomain: byDomainPct(s), prePct: pre, growth: pre == null ? null : sum.overallPct - pre }); }} phase="Post-Test" />
  )}</Shell>;
  if (st.phase === 'comparison') return <Shell nav={nav}><Results scores={st.postScores} weakDomains={[]} pretestScores={st.pretestScores} isPost={true} sourceQuestions={POSTTEST} sourceAnswers={st.posttestAnswers} onContinue={() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setSt({ ...INITIAL_STATE, posttestStarted: false, confirmReset: false, pretestAnswers: {}, posttestAnswers: {} });
  }} /></Shell>;
  // unknown phase (e.g. stale persisted value) — land on home, never a blank page
  return <Shell nav={nav}><Welcome onStart={() => up({ phase: 'pretest', qIndex: 0, answers: {}, pretestAnswers: {} })} /></Shell>;
}
