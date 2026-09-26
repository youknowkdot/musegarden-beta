/* Headless QA harness for the MuseGarden Beta Slice.
 * Loads the EXACT shipped <script> from the build under test with a fake DOM +
 * fake clock, then drives it like a player: clicks, slider scrubs, time warps.
 * State is read back from the DOM the same way a user would see it.
 * Usage: node harness.js   (prints PASS/FAIL lines + JSON summary)
 */
"use strict";
const fs = require("fs");

const path = require("path");
const BUILD_UNDER_TEST = process.argv[2] || path.join(__dirname, "..", "..", "musegarden-beta-slice.html");
const html = fs.readFileSync(BUILD_UNDER_TEST, "utf8");
// Clock format changed 2026-09-25 (UX nit 2): "Day N, HH:MM" (absolute-anchored, wrapped at midnight) -> honest elapsed "Day N + HH:MM elapsed" anchored at demo start; plus " \u00b7 END OF TIMELINE" at day 45 (UX nit 1).
const script = html.split("<script>")[1].split("</script>")[0];
if (!script || script.length < 1000) { console.error("script extract failed"); process.exit(2); }

// ---------------- fake clock ----------------
let now = 1_700_000_000_000;
Date.now = () => now;

// ---------------- fake DOM ----------------
function makeClassList() {
  const s = new Set();
  return {
    add(...c) { c.forEach((x) => s.add(x)); },
    remove(...c) { c.forEach((x) => s.delete(x)); },
    toggle(c, f) {
      if (f === undefined) { if (s.has(c)) s.delete(c); else s.add(c); }
      else { if (f) s.add(c); else s.delete(c); }
      return s.has(c);
    },
    contains(c) { return s.has(c); },
    toString() { return [...s].join(" "); },
  };
}
class El {
  constructor(id) {
    this.id = id; this.innerHTML = ""; this.textContent = "";
    this.className = ""; this.classList = makeClassList();
    this.style = { setProperty: (k, v) => { this.style[k] = v; } };
    this.disabled = false; this.value = ""; this.dataset = {};
    this.listeners = {}; this.scrollHeight = 1000; this.scrollTop = 0;
    this.clientHeight = 100; this.attrs = {};
  }
  addEventListener(t, f) { (this.listeners[t] = this.listeners[t] || []).push(f); }
  setAttribute(k, v) { this.attrs[k] = v; }
  getAttribute(k) { return this.attrs[k]; }
  closest() { return null; }
}
const els = {};
const getEl = (id) => els[id] || (els[id] = new El(id));
const speedBtns = [0, 1, 60, 240, 1440].map((s) => {
  const e = new El("speed" + s); e.dataset.speed = String(s); return e;
});
global.document = {
  getElementById: (id) => getEl(id),
  querySelector: (sel) => (sel === ".speed-control" ? getEl("speedControl") : new El("q-" + sel)),
  querySelectorAll: (sel) => (sel === ".speed-btn" ? speedBtns : []),
};
let tickFn = null;
let timers = [];
global.window = global;
global.setInterval = (fn) => { tickFn = fn; return 1; };
global.setTimeout = (fn, ms) => { const id = timers.length + 1; timers.push({ id, fn, at: now + ms }); return id; };
global.clearTimeout = (id) => { timers = timers.filter((t) => t.id !== id); };
function runTimers() {
  const due = timers.filter((t) => t.at <= now);
  timers = timers.filter((t) => t.at > now);
  due.forEach((t) => t.fn());
}

eval(script);

// ---------------- driver ----------------
const DAY = 86400000;
function fire(el, type, evt) {
  (el.listeners[type] || []).forEach((f) => f(evt || { stopPropagation() {}, target: el }));
}
const clickSeedCard = () => fire(getEl("seedCard"), "click");
const clickTree = () => fire(getEl("treeButton"), "click");
const clickReset = () => fire(getEl("resetBtn"), "click");
function clickQuest(id, disabled = false) {
  const b = new El("qb"); b.dataset.quest = id; b.disabled = disabled;
  fire(getEl("questList"), "click", { stopPropagation() {}, target: { closest: (s) => (s === ".quest" ? b : null) } });
}
function clickBounty(id, disabled = false) {
  const b = new El("bb"); b.dataset.bounty = id; b.disabled = disabled;
  fire(getEl("bountyList"), "click", { stopPropagation() {}, target: { closest: (s) => (s === ".bounty" ? b : null) } });
}
function clickStage(i, disabled = false) {
  const b = new El("sb"); b.dataset.stage = String(i); b.disabled = disabled;
  fire(getEl("treeMeta"), "click", { stopPropagation() {}, target: { closest: (s) => (s === ".stage-jump-btn" ? b : null) } });
}
function setSpeed(s) {
  const b = speedBtns.find((x) => x.dataset.speed === String(s));
  fire(getEl("speedControl"), "click", { stopPropagation() {}, target: { closest: (sel) => (sel === ".speed-btn" ? b : null) } });
}
function scrub(days) { const sl = getEl("timelineSlider"); sl.value = String(days); fire(sl, "input"); }
function tick(seconds) { for (let i = 0; i < seconds; i++) { now += 1000; tickFn(); } runTimers(); }
function toastText() { return getEl("toast").textContent; }

// ---------------- state reader (what the user sees) ----------------
function S() {
  const g = (id) => getEl(id);
  const events = [...g("eventLog").innerHTML.matchAll(
    /<span class="event-time">([^<]*)<\/span><span class="event-text">([^<]*)<\/span>/g
  )].map((m) => ({ t: m[1], x: m[2].replace(/&amp;/g, "&").replace(/&#39;/g, "'") }));
  const meta = g("treeMeta").innerHTML;
  const m = (re) => { const mm = meta.match(re); return mm ? mm[1] : null; };
  return {
    clock: g("demoClock").textContent,
    sliderDays: parseFloat(g("timelineSlider").value),
    reservoir: parseFloat(g("reservoirValue").textContent),
    stage: g("stageReadout").textContent,
    acctXp: g("xpCount").textContent,
    waterStatus: m(/water-status">([^<]*)</),
    nextWater: m(/next-water">([^<]*)</),
    progLabel: m(/progress-label"><span>([^<]*)<\/span><span>([^<]*)<\/span>/),
    progAmount: (meta.match(/progress-label"><span>([^<]*)<\/span><span>([^<]*)<\/span>/) || [])[2] || null,
    stagePill: m(/stage-pill">([^<]*)</),
    events,
    questsDone: (g("questList").innerHTML.match(/DONE/g) || []).length,
    bountyStates: [...g("bountyList").innerHTML.matchAll(/bounty-state">([A-Z]+)</g)].map((x) => x[1]),
    toast: toastText(),
    treeDisabled: g("treeButton").disabled,
  };
}
const evTexts = (s) => s.events.map((e) => e.x);
const hasEv = (s, sub) => evTexts(s).some((x) => x.includes(sub));

// ---------------- assertions ----------------
let pass = 0, fail = 0;
const results = [];
function check(name, cond, detail) {
  if (cond) { pass++; results.push({ name, status: "PASS" }); }
  else { fail++; results.push({ name, status: "FAIL", detail }); console.log("FAIL:", name, "\n   ", detail); }
}
function approx(a, b, eps, label) { return Math.abs(a - b) <= eps; }

// ============================================================ A. PLANTING
clickReset();
let s = S();
check("A0 initial: reservoir 60.0", s.reservoir === 60, s.reservoir);
check("A0 initial: UNPLANTED", s.stage === "UNPLANTED", s.stage);
check("A0 initial: tree button disabled w/o orb selected", s.treeDisabled === true, s.treeDisabled);

clickTree(); // no orb selected
s = S();
check("A1 plant w/o orb: blocked, toast", s.toast.includes("Select the Kindred Tree orb"), s.toast);
check("A1 plant w/o orb: still unplanted", s.stage === "UNPLANTED", s.stage);

clickSeedCard(); clickTree();
s = S();
check("A2 plant: stage Seed", s.stage === "SEED", s.stage);
check("A2 plant: event logged", hasEv(s, "Kindred Tree planted"), evTexts(s).join(" | "));
check("A2 plant: First Planting bounty unlocked", s.bountyStates[0] === "CLAIM", s.bountyStates.join(","));
check("A2 plant: reservoir unchanged (planting free)", s.reservoir === 60, s.reservoir);
check("A2 plant: orb card PLANTED/disabled", getEl("seedCard").disabled === true, "");

// plant twice: second click on tree button now goes down the water path
clickTree();
s = S();
check("A3 double-click plants+water: germination started", hasEv(s, "germination started"), evTexts(s).slice(-2).join(" | "));
check("A3 reservoir -1.5", approx(s.reservoir, 58.5, 0.01), s.reservoir);
check("A3 progress shows GERMINATING countdown (xp hidden during germination)", s.progLabel === "GERMINATING" && s.progAmount === "48H 0M", s.progLabel + "/" + s.progAmount);
check("A3b plant xp is 10 internally (verified post-germination in G5)", hasEv(s, "+10 plant XP"), "");

// ============================================================ B. WATERING
// right after plant+water the tree is GERMINATING (watering blocked there),
// so complete germination first, then exercise hydrated/thirsty transitions
setSpeed(0); scrub(2.04);
s = S();
check("B0 at 48.96h: germination done, tree withering after 48h dry", s.waterStatus === "Withering", s.waterStatus);
clickTree();
s = S();
check("B0b water stops withering -> hydrated", s.waterStatus === "Hydrated", s.waterStatus);
check("B0b 'stopped withering' event", hasEv(s, "stopped withering"), "");
check("B0b xp 26 (16+10)", s.progAmount === "26 XP", s.progAmount);
const rHyd = s.reservoir;
clickTree(); // immediately again -> hydrated, blocked
s = S();
check("B1 water while hydrated: blocked", s.toast.includes("hydrated"), s.toast);
check("B1 reservoir unchanged", approx(s.reservoir, rHyd, 1e-9), rHyd + " -> " + s.reservoir);
check("B1 no extra water event", evTexts(s).filter((x) => x.includes("watered for")).length === 2, "");
// thirst timing relative to the successful water at 2.04d
scrub(2.04 + 0.9);
s = S();
check("B2 21.6h after water: still hydrated", s.waterStatus === "Hydrated", s.waterStatus);
scrub(2.04 + 1 + 1 / 1440);
s = S();
check("B3 just past 24h after water: thirsty", s.waterStatus === "Thirsty", s.waterStatus);
check("B3 thirst event logged", hasEv(s, "became thirsty"), "");
const rBefore = s.reservoir;
clickTree();
s = S();
check("B4 thirsty water: -1.5 reservoir", approx(s.reservoir, rBefore - 1.5, 0.02), rBefore + " -> " + s.reservoir);
check("B4 plant XP now 36", s.progAmount === "36 XP", s.progAmount);
check("B4 thirst reset (hydrated)", s.waterStatus === "Hydrated", s.waterStatus);
// exact-boundary water: thirst event and water share the timestamp (cosmetic)
clickReset(); clickSeedCard(); clickTree(); clickTree(); setSpeed(0);
scrub(2); clickTree(); // germ done; water #2 at exactly 2d (thirsty)
scrub(3); // exactly 24h later
s = S();
check("B4b at exactly 24h: thirsty", s.waterStatus === "Thirsty", s.waterStatus);
clickTree();
s = S();
const thirstAt = s.events.filter((e) => e.x.includes("became thirsty")).map((e) => e.t);
const waterAt = s.events.filter((e) => e.x.includes("watered for")).map((e) => e.t);
check("B4b boundary: thirst+water share timestamp D3 08:00", thirstAt.includes("D3 08:00") && waterAt.includes("D3 08:00"), thirstAt.join(",") + " / " + waterAt.join(","));
check("B4b boundary: water still applied (xp 36)", s.progAmount === "36 XP", s.progAmount);

// drain reservoir below 1.5 via daily watering, no quests/bounties
clickReset(); clickSeedCard(); clickTree(); clickTree(); // plant + germ water
setSpeed(0);
let days = 0;
for (let d = 1; d <= 44; d++) {
  scrub(d); // each scrub = 1 day; water whenever thirsty
  const st = S();
  if (st.waterStatus === "Thirsty" || st.waterStatus === "Withering") { clickTree(); days++; }
  const st2 = S();
  if (st2.reservoir < 1.5) break;
}
s = S();
check("B5 reservoir drained below 1.5 reachable in-bounds", s.reservoir < 1.5, "res=" + s.reservoir + " clock=" + s.clock);
// force thirsty at low reservoir: scrub forward 2 days to guarantee thirst
scrub(parseFloat(getEl("timelineSlider").value) + 2);
s = S();
const rLow = s.reservoir, xpLow = s.progAmount, evN = s.events.length;
clickTree();
s = S();
check("B6 water at reservoir<1.5: blocked, toast", s.toast.includes("Reservoir low"), s.toast);
check("B6 reservoir unchanged", approx(s.reservoir, rLow, 1e-9), s.reservoir);
check("B6 no water event added", s.events.length === evN, evN + " -> " + s.events.length);
check("B6 plant XP unchanged", s.progAmount === xpLow, xpLow + " -> " + s.progAmount);

// wither: ~48h dry -> withering, -5 XP/day, stage never drops
clickReset(); clickSeedCard(); clickTree(); clickTree(); // plant+water (xp 10, germinating)
scrub(2); // germination done at 48h; tree thirsty at exactly 48h
s = S();
check("B7 at 48h: germinated->Sprout", s.stage === "SPROUT", s.stage);
check("B7 xp floored to 16 at germination", s.progAmount === "16 XP", s.progAmount);
scrub(2.01); // just past 48h dry
s = S();
check("B8 just past 48h dry: withering", s.waterStatus === "Withering", s.waterStatus);
check("B8 wither event", hasEv(s, "started withering"), "");
scrub(6); // 4 more days withering: 16 - 5*4 = -4 -> floored at 16
s = S();
check("B9 wither 4 days: xp floored at stage floor 16", s.progAmount === "16 XP", s.progAmount);
check("B9 stage never drops", s.stage === "SPROUT", s.stage);
// wither from ABOVE the stage floor: demo Sprout (16) + water -> 26, wither 1.2d -> ~20
clickReset(); clickSeedCard(); clickTree(); clickStage(1); setSpeed(0);
scrub(1.02); clickTree(); // thirsty -> water, xp 26
s = S();
check("B10 water after demo Sprout: xp 26", s.progAmount === "26 XP", s.progAmount);
scrub(1.02 + 3.2); // 1.2d of wither past witherAt
s = S();
check("B11 wither 1.2d from 26: xp ~20", approx(parseFloat(s.progAmount), 26 - 5 * 1.2, 0.7), s.progAmount);
check("B11 stage stays Sprout", s.stage === "SPROUT", s.stage);
// wither while sitting exactly on a stage floor: no visible loss (stages never drop)
clickReset(); clickSeedCard(); clickTree(); clickStage(2); setSpeed(0); scrub(10);
s = S();
check("B11b wither at stage floor: xp pinned at 128", s.progAmount === "128 XP", s.progAmount);
check("B11b stage stays Bloom", s.stage === "BLOOM", s.stage);

// ============================================================ C. RESERVOIR
clickReset(); clickSeedCard(); clickTree(); clickTree();
setSpeed(0); scrub(10);
s = S();
const expected = 58.5 * Math.pow(0.95, 10);
check("C1 10d evaporation = 58.5*0.95^10", approx(s.reservoir, expected, 0.06), s.reservoir + " vs " + expected.toFixed(3));

// greedy 45-day run: quest daily, water when thirsty, claim bounties; reservoir must never exceed 100
clickReset(); clickSeedCard(); clickTree(); clickTree();
setSpeed(0);
let maxRes = 0, minRes = 999;
clickBounty("first-planting");
for (let d = 0; d <= 45; d += 0.5) {
  scrub(d);
  let st = S();
  maxRes = Math.max(maxRes, st.reservoir); minRes = Math.min(minRes, st.reservoir);
  clickQuest("tend"); clickQuest("journal");
  st = S();
  if (st.waterStatus === "Thirsty" || st.waterStatus === "Withering") clickTree();
  st = S();
  if (st.bountyStates[1] === "CLAIM") clickBounty("three-waterings");
  if (st.bountyStates[2] === "CLAIM") clickBounty("sprout-emerges");
  maxRes = Math.max(maxRes, S().reservoir);
}
s = S();
check("C2 reservoir never exceeds cap 100", maxRes <= 100.0001, "max=" + maxRes);
check("C2b reservoir never negative", minRes >= -1e-9, "min=" + minRes);
check("C2c reached day 45", s.clock.startsWith("Day 45"), s.clock);

// ============================================================ D. QUESTS
clickReset(); setSpeed(0);
clickQuest("tend"); clickQuest("journal");
s = S();
check("D1 two quests: +2 account XP", s.acctXp === "2 XP", s.acctXp);
check("D1 reservoir +2", approx(s.reservoir, 62, 0.01), s.reservoir);
check("D1 both DONE", s.questsDone === 2, s.questsDone);
const xpBefore = s.acctXp, evBefore = s.events.length;
clickQuest("tend", true); // disabled click -> no-op
clickQuest("tend", false); // enabled-but-completed -> guard must block
s = S();
check("D2 double-claim blocked: XP unchanged", s.acctXp === xpBefore, s.acctXp);
check("D2 double-claim blocked: no new event", s.events.length === evBefore, s.events.length);
scrub(1);
s = S();
check("D3 day boundary: quests reset", s.questsDone === 0, s.questsDone);
clickQuest("tend");
s = S();
check("D4 next day quest works", s.acctXp === "3 XP", s.acctXp);

// ============================================================ E. BOUNTIES
clickReset(); clickSeedCard(); clickTree();
s = S();
check("E1 first-planting unlocked at plant", s.bountyStates[0] === "CLAIM", s.bountyStates.join(","));
const xp0 = parseFloat(s.acctXp), r0 = s.reservoir;
clickBounty("first-planting");
s = S();
check("E2 claim: +8 XP", s.acctXp === (xp0 + 8) + " XP", s.acctXp);
check("E2 claim: +8 reservoir (spec deviation note)", approx(s.reservoir, Math.min(100, r0 + 8), 0.01), s.reservoir);
check("E2 state CLAIMED", s.bountyStates[0] === "CLAIMED", s.bountyStates.join(","));
clickBounty("first-planting", false);
s = S();
check("E3 re-claim blocked", s.acctXp === (xp0 + 8) + " XP", s.acctXp);
// locked bounty claim attempt (three-waterings, 0 waterings)
clickBounty("three-waterings", false);
s = S();
check("E4 locked bounty claim blocked", s.bountyStates[1] === "LOCKED", s.bountyStates.join(","));
// three waterings
clickTree(); // water #1 (germination)
setSpeed(0); scrub(1.02); clickTree(); // water #2
scrub(2.04); // germination done; tree withering (48h+ dry) -> waterable
s = S();
check("E5 sprout-emerges unlocked at Sprout", s.bountyStates[2] === "CLAIM", s.bountyStates.join(","));
clickTree(); // water #2
scrub(3.06); // 24h+ later, thirsty again
clickTree(); // water #3
s = S();
check("E6 three-waterings unlocked at 3rd water", s.bountyStates[1] === "CLAIM", s.bountyStates.join(","));
check("E6 waterings counted the germination water too", evTexts(s).filter((x) => x.includes("watered for")).length === 3, "");
clickBounty("three-waterings"); clickBounty("sprout-emerges");
s = S();
check("E7 both claimed once", s.bountyStates[1] === "CLAIMED" && s.bountyStates[2] === "CLAIMED", s.bountyStates.join(","));
check("E7 account XP = 8+15+25", s.acctXp === "48 XP", s.acctXp);

// ============================================================ F. DEMO BUTTONS
clickReset(); clickSeedCard(); clickTree();
const expStage = [[0, "SEED", "Seed", "0 XP"], [1, "SPROUT", "Sprout", "16 XP"], [2, "BLOOM", "Bloom", "128 XP"], [3, "CANOPY", "Canopy", "400 XP"]];
for (const [i, name, proper, xp] of expStage) {
  clickStage(i); s = S();
  check("F1 demo->" + name + ": stage+xp exact", s.stage === name && s.progAmount === xp, s.stage + "/" + s.progAmount);
  check("F1 demo->" + name + ": event logged", hasEv(s, "Demo growth set to " + proper), "");
}
// demo-reset to Seed, then re-germinate naturally
clickReset(); clickSeedCard(); clickTree(); clickStage(3); clickStage(0);
s = S();
check("F4 demo->Seed: xp 0, stage Seed", s.progAmount === "0 XP" && s.stage === "SEED", s.stage + "/" + s.progAmount);
setSpeed(0); scrub(1.02); // wait out demo-set hydration
clickTree(); // water -> germination restarts
s = S();
check("F4b re-germination starts after demo reset", hasEv(s, "germination started"), "");
scrub(3.02);
s = S();
check("F4c re-germination completes -> Sprout 16", s.stage === "SPROUT" && s.progAmount === "16 XP", s.stage + "/" + s.progAmount);
// natural play after demo Sprout: water to 128 -> Bloom with event
clickReset(); clickSeedCard(); clickTree(); clickStage(1);
setSpeed(0);
for (let d = 1; d <= 30; d++) { scrub(d); const st = S(); if (st.waterStatus === "Thirsty") clickTree(); if (S().stage === "BLOOM") break; }
s = S();
check("F2 natural growth after demo Sprout reaches Bloom", s.stage === "BLOOM", s.stage + "/" + s.progAmount);
check("F2 'reached Bloom' event", hasEv(s, "reached Bloom"), "");
// demo Canopy then wither: floor = 400
clickReset(); clickSeedCard(); clickTree(); clickStage(3); setSpeed(0); scrub(20);
s = S();
check("F3 Canopy withers 20d: xp stays 400", s.progAmount === "400 XP", s.progAmount);
check("F3 stage stays Canopy", s.stage === "CANOPY", s.stage);

// ============================================================ G. GERMINATION
clickReset(); clickSeedCard(); clickTree(); clickTree(); setSpeed(0);
s = S();
check("G1 germinating status", s.waterStatus === "Germinating", s.waterStatus);
check("G1 progress shows GERMINATING", s.progLabel === "GERMINATING", s.progLabel);
clickTree();
s = S();
check("G2 water during germination blocked", s.toast.includes("Germination is underway"), s.toast);
scrub(1.99);
s = S();
check("G3 at 47.8h: still germinating", s.waterStatus === "Germinating", s.waterStatus);
check("G3 readout shows GERMINATING (stage hidden until sprout)", s.stage === "GERMINATING", s.stage);
scrub(2.0);
s = S();
check("G4 at 48h: germinated", s.waterStatus !== "Germinating", s.waterStatus);
check("G4 stage Sprout, xp 16", s.stage === "SPROUT" && s.progAmount === "16 XP", s.stage + "/" + s.progAmount);
check("G4 germination event", hasEv(s, "Germination complete"), "");
const evN2 = s.events.length;
scrub(3); clickTree(); // water post-germination
s = S();
check("G5 no re-trigger: exactly one germination event", evTexts(s).filter((x) => x.includes("Germination complete")).length === 1, "");
check("G5 xp 26 after post-germ water", s.progAmount === "26 XP", s.progAmount);

// ============================================================ H. TIME
clickReset(); setSpeed(0);
const t0 = 0; // currentTime internal; use clock text instead
setSpeed(1); tick(5);
s = S();
check("H1 1x: 5s -> 5 demo-sec", s.clock === "Day 0 + 00:00 elapsed", s.clock); // 5s negligible at 1x
setSpeed(60); tick(60); // 60s * 60 = 3600s = 1h
s = S();
check("H2 60x: 60s -> +1h", s.clock === "Day 0 + 01:00 elapsed", s.clock);
setSpeed(240); tick(30); // 30*240=7200s=2h
s = S();
check("H3 240x: 30s -> +2h", s.clock === "Day 0 + 03:00 elapsed", s.clock);
setSpeed(1440); tick(10); // 10*1440=14400s=4h
s = S();
check("H4 1440x: 10s -> +4h", s.clock === "Day 0 + 07:00 elapsed", s.clock);
setSpeed(0); tick(30);
s = S();
check("H5 pause: frozen", s.clock === "Day 0 + 07:00 elapsed", s.clock);
const rPause = s.reservoir; tick(30);
s = S();
check("H5b pause: no evaporation", approx(s.reservoir, rPause, 1e-12), s.reservoir);
// run to day 45
setSpeed(1440);
for (let i = 0; i < 3000; i++) { tick(1); if (S().clock.startsWith("Day 45")) break; }
s = S();
check("H6 halts at Day 45", s.clock === "Day 45 + 00:00 elapsed \u00b7 END OF TIMELINE", s.clock);
check("H6 speed auto-zeroed (paused)", speedBtns[0].classList.contains("active"), "");
check("H6 slider capped at 45", s.sliderDays === 45, s.sliderDays);
tick(10);
s = S();
check("H7 no advance past 45", s.clock === "Day 45 + 00:00 elapsed \u00b7 END OF TIMELINE", s.clock);

// ============================================================ I. BACKWARD TIME
clickReset(); clickSeedCard(); clickTree(); clickTree(); setSpeed(0);
clickQuest("tend"); clickBounty("first-planting");
for (let d = 1; d <= 10; d++) { scrub(d); const st = S(); if (st.waterStatus === "Thirsty" || st.waterStatus === "Withering") clickTree(); }
const snap10 = JSON.stringify(S());
scrub(2);
const snap2 = S();
check("I1 scrub back: fewer events", snap2.events.length < JSON.parse(snap10).events.length, snap2.events.length);
scrub(10);
const snap10b = JSON.stringify(S());
check("I2 10->2->10 replay identical", snap10b === snap10, "diff");
// full 45->0->45 (journal untouched between the three scrubs)
scrub(45);
const snap45 = JSON.stringify(S());
scrub(0);
const s0 = S();
scrub(45);
check("I4 45->0->45 replay identical", JSON.stringify(S()) === snap45, "diff");
// I3: scrub(0) must equal a fresh replay of the same t=START opening
// (plant + germination water + quest tend + first-planting bounty)
clickReset(); clickSeedCard(); clickTree(); clickTree(); setSpeed(0);
clickQuest("tend"); clickBounty("first-planting");
const ref0 = S();
const canon = (x) => JSON.stringify({ clock: x.clock, res: x.reservoir, stage: x.stage, xp: x.acctXp, ev: x.events, q: x.questsDone, b: x.bountyStates });
check("I3 scrub to 0 replays journal to START (matches fresh opening)", canon(s0) === canon(ref0), canon(s0).slice(0, 200));
// scrub back then new action truncates future journal entries
const snap10len = JSON.parse(snap10).events.length;
scrub(5);
clickQuest("journal"); // new action at day 5; old day 6-10 waterings dropped
scrub(10);
s = S();
check("I5 new action after scrub-back truncates future journal", s.events.length < snap10len, s.events.length + " vs " + snap10len);
const wAfter = evTexts(s).filter((x) => x.includes("watered for")).length;
const wBefore = JSON.parse(snap10).events.filter((e) => e.x.includes("watered for")).length;
check("I5b future waterings truncated (fewer than full replay)", wAfter < wBefore, wAfter + " vs " + wBefore);

// event ordering non-decreasing
clickReset(); clickSeedCard(); clickTree(); clickTree(); setSpeed(0);
for (let d = 1; d <= 20; d++) { scrub(d); const st = S(); if (st.waterStatus === "Thirsty" || st.waterStatus === "Withering") clickTree(); if (d % 3 === 0) { clickQuest("tend"); } }
s = S();
const times = s.events.map((e) => e.t);
const parseT = (t) => { const m = t.match(/D(\d+) (\d+):(\d+)/); return (+m[1]) * 1440 + (+m[2]) * 60 + (+m[3]); };
const ordered = times.every((t, i) => i === 0 || parseT(t) >= parseT(times[i - 1]));
check("J1 event log timestamps non-decreasing", ordered, times.slice(0, 8).join(","));
check("J2 every action logged (plant+water+germ+thirst+quests present)",
  ["planted", "germination started", "became thirsty", "completed"].every((k) => hasEv(s, k)), "");

// ============================================================ L. ABUSE
clickReset();
// spam demo buttons rapidly (plant first)
clickSeedCard(); clickTree();
clickStage(1); clickStage(2); clickStage(3); clickStage(0); clickStage(3);
s = S();
check("L1 demo spam: final Canopy/400", s.stage === "CANOPY" && s.progAmount === "400 XP", s.stage + "/" + s.progAmount);
check("L1 demo spam: 5 demo events", evTexts(s).filter((x) => x.includes("Demo growth set to")).length === 5, "");
// slider thrash
clickReset(); clickSeedCard(); clickTree(); clickTree(); setSpeed(0);
let ok = true;
try {
  for (let i = 0; i < 60; i++) { scrub(Math.random() * 45); S(); }
} catch (e) { ok = false; }
s = S();
check("L2 slider thrash: no crash, consistent state", ok && s.events.length >= 1, "");
// speed spam
try { for (const sp of [1, 60, 240, 1440, 0, 60, 0]) setSpeed(sp); tick(3); } catch (e) { ok = false; }
check("L3 speed spam: no crash", ok, "");
// rapid water clicks (10x) while thirsty -> exactly one water
clickReset(); clickSeedCard(); clickTree(); clickTree(); setSpeed(0); scrub(2.04); // germ done, withering=waterable
s = S();
check("L4 setup: withering (waterable)", s.waterStatus === "Withering", s.waterStatus);
const rT = s.reservoir;
for (let i = 0; i < 10; i++) clickTree();
s = S();
check("L4 rapid 10x water clicks: exactly one water applied", approx(s.reservoir, rT - 1.5, 0.02), rT + " -> " + s.reservoir);
check("L4 rest blocked as hydrated", s.toast.includes("hydrated"), s.toast);

// ============================================================ M. STATIC ART CHECKS (source-level)
// placeholder notice + no brown circle; rendering itself needs a real browser
check("M1 placeholder notice in source", html.includes("PLACEHOLDER ART"), "");
const plantedHTML = getEl("treeButton").innerHTML; // planted from L4 run
check("M2 no tree-mound element in planted art", !plantedHTML.includes("tree-mound"), "");
check("M3 no brown soil fills in planted art", !/#765236|#473426/.test(plantedHTML), "");
check("M4 no localStorage/sessionStorage (reload = full reset)", !/localStorage|sessionStorage/.test(html), "");

// ---------------- summary ----------------
console.log("\n==== SUMMARY: " + pass + " PASS, " + fail + " FAIL ====");
fs.writeFileSync(path.join(__dirname, "qa-results.json"), JSON.stringify({ pass, fail, results }, null, 1));
process.exit(fail ? 1 : 0);
