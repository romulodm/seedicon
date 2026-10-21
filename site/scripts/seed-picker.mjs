#!/usr/bin/env node
/**
 * Builds a standalone page for choosing the home gallery seeds, per style.
 *
 *   node site/scripts/seed-picker.mjs [candidates-per-style]
 *
 * The page embeds dist/index.js, so it renders exactly what the site
 * renders: run `npm run build` at the repo root first if src changed. It
 * reads the current picks from site/app/lib/gallerySeeds.ts and the
 * taglines from site/app/lib/styles.ts (Node 22.18+ strips the types).
 *
 * Open the written file in a browser, click the avatars you like, and paste
 * the generated block over GALLERY_SEEDS. Candidates are random UUIDs, new
 * on every visit; your picks are kept in the browser between visits.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Importing the site's .ts files from outside a "type": "module" package
// makes Node warn that it reparsed them as ESM. Harmless here, so muted.
const emitWarning = process.emitWarning;
process.emitWarning = (warning, ...rest) =>
  String(warning).includes("Module type") ? undefined : emitWarning.call(process, warning, ...rest);

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const out = resolve(root, "seed-picker.html");
const perStyle = Number(process.argv[2]) || 40;

const lib = readFileSync(resolve(root, "dist/index.js"), "utf8");
const exportAt = lib.lastIndexOf("export {");
if (exportAt < 0) throw new Error("dist/index.js has no export block; rebuild it.");
const libBody = lib.slice(0, exportAt).replace(/\/\/# sourceMappingURL=.*$/m, "");

const load = (p) => import(pathToFileURL(resolve(root, p)).href);
const { STYLE_DOCS } = await load("site/app/lib/styles.ts");
const { DEFAULT_SEEDS, GALLERY_SEEDS } = await load("site/app/lib/gallerySeeds.ts");

const data = {
  perStyle,
  defaults: DEFAULT_SEEDS,
  fromFile: GALLERY_SEEDS,
  taglines: Object.fromEntries(STYLE_DOCS.map((d) => [d.name, d.tagline])),
};
const json = JSON.stringify(data).replace(/</g, "\\u003c");

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Seed picker</title>
<style>
  :root { --bg:#0a0a0b; --raised:#131316; --border:#25252b; --fg:#ececef; --faint:#8a8a94; --primary:#8fa8ff; --ok:#5fd68a; --warn:#f0b35a; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--fg); font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; }
  .mono { font-family:ui-monospace,"Cascadia Code",Consolas,monospace; }
  header { position:sticky; top:0; z-index:5; background:rgba(10,10,11,.94); backdrop-filter:blur(8px); border-bottom:1px solid var(--border); padding:12px 24px; }
  .bar { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
  .bar h1 { font-size:15px; margin:0 12px 0 0; }
  .chips { display:flex; gap:6px; flex-wrap:wrap; margin-top:10px; }
  .chip { font-size:12px; padding:2px 8px; border-radius:999px; border:1px solid var(--border); color:var(--faint); text-decoration:none; }
  .chip.done { color:var(--ok); border-color:color-mix(in srgb,var(--ok) 40%,transparent); }
  .chip.off { color:var(--warn); border-color:color-mix(in srgb,var(--warn) 40%,transparent); }
  button, select, input { font:inherit; font-size:13px; color:var(--fg); background:var(--raised); border:1px solid var(--border); border-radius:8px; padding:5px 10px; }
  button { cursor:pointer; }
  button:hover { border-color:var(--faint); }
  button.primary { background:var(--primary); color:#0a0a0b; border-color:var(--primary); font-weight:600; }
  main { padding:8px 24px 80px; max-width:1200px; margin:0 auto; }
  section { border-bottom:1px solid var(--border); padding:28px 0; scroll-margin-top:130px; }
  .head { display:flex; gap:10px; align-items:baseline; flex-wrap:wrap; margin-bottom:4px; }
  .head h2 { font-size:15px; margin:0; }
  .count { font-size:12px; color:var(--faint); }
  .count.done { color:var(--ok); } .count.off { color:var(--warn); }
  .tagline { color:var(--faint); font-size:12px; margin:0 0 14px; }
  .label { font-size:11px; text-transform:uppercase; letter-spacing:.06em; color:var(--faint); margin:0 0 8px; }
  .picked { display:flex; flex-wrap:wrap; gap:8px; min-height:60px; padding:10px; border:1px dashed var(--border); border-radius:12px; margin-bottom:16px; max-width:max-content; min-width:220px; }
  .picked .empty { color:var(--faint); font-size:12px; align-self:center; }
  .grid { display:flex; flex-wrap:wrap; gap:8px; }
  .av { position:relative; padding:0; border:0; background:none; border-radius:12px; line-height:0; outline-offset:3px; }
  .av svg { display:block; }
  .grid .av { opacity:.92; }
  .grid .av:hover { opacity:1; transform:translateY(-1px); }
  .grid .av[aria-pressed="true"] { outline:2px solid var(--primary); opacity:1; }
  .badge { position:absolute; top:-6px; right:-6px; min-width:18px; height:18px; padding:0 5px; border-radius:9px; background:var(--primary); color:#0a0a0b; font:600 11px/18px system-ui,sans-serif; text-align:center; }
  .picked .av:hover::after { content:"×"; position:absolute; inset:0; display:grid; place-items:center; background:rgba(0,0,0,.55); color:#fff; font:600 20px/1 system-ui; border-radius:inherit; }
  .tools { display:flex; gap:6px; flex-wrap:wrap; margin-top:14px; }
  .tools input { width:220px; }
  #code { width:100%; min-height:260px; background:var(--raised); color:var(--fg); border:1px solid var(--border); border-radius:12px; padding:14px; font:12px/1.5 ui-monospace,Consolas,monospace; }
  .hint { color:var(--faint); font-size:12px; }
</style>
</head>
<body>
<header>
  <div class="bar">
    <h1 class="mono">seed picker</h1>
    <label class="hint">Tamanho <select id="size"><option value="52">52 px (galeria)</option><option value="80">80 px</option><option value="120">120 px</option></select></label>
    <label class="hint">Meta por estilo <input id="target" type="number" min="1" max="20" value="5" style="width:60px"></label>
    <span style="flex:1"></span>
    <button id="toCode">Ver código</button>
    <button id="copy" class="primary">Copiar código</button>
  </div>
  <nav class="chips" id="chips"></nav>
</header>
<main>
  <p class="hint" style="margin:18px 0 0">Clique numa candidata para escolher; a ordem do clique é a ordem na galeria. Clique numa escolhida para tirar. Estilos que ficarem iguais às seeds padrão (ou vazios) não entram no código e continuam usando <span class="mono">DEFAULT_SEEDS</span>.</p>
  <div id="styles"></div>
  <section id="code-section">
    <div class="head"><h2 class="mono">Código para site/app/lib/gallerySeeds.ts</h2></div>
    <p class="tagline">Substitua o bloco <span class="mono">GALLERY_SEEDS</span> inteiro por este.</p>
    <textarea id="code" class="mono" readonly spellcheck="false"></textarea>
  </section>
</main>
<script>
const seedicon = (() => {
${libBody}
  return { generateAvatar, SEEDICON_STYLES };
})();
const DATA = ${json};
</script>
<script>
(() => {
  const { generateAvatar, SEEDICON_STYLES } = seedicon;
  const STORE = "seedicon-seed-picker:v1";
  const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
  const fileSeeds = (s) => DATA.fromFile[s] ?? DATA.defaults;

  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORE) || "{}"); } catch {}
  const picks = {};
  for (const s of SEEDICON_STYLES) picks[s] = Array.isArray(saved[s]) ? saved[s] : [...fileSeeds(s)];
  const persist = () => { try { localStorage.setItem(STORE, JSON.stringify(picks)); } catch {} };

  function uuid() {
    const b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
    return h.slice(0, 8) + "-" + h.slice(8, 12) + "-" + h.slice(12, 16) + "-" + h.slice(16, 20) + "-" + h.slice(20);
  }
  const fresh = (n) => Array.from({ length: n }, uuid);

  const cands = {};
  for (const s of SEEDICON_STYLES) cands[s] = [...new Set([...picks[s], ...fileSeeds(s), ...fresh(DATA.perStyle)])];

  const sizeEl = document.getElementById("size");
  const targetEl = document.getElementById("target");
  const cache = new Map();
  function svg(style, seed) {
    const size = Number(sizeEl.value);
    const k = style + "|" + size + "|" + seed;
    if (!cache.has(k)) cache.set(k, generateAvatar({ seed, style, size, shape: "rounded" }));
    return cache.get(k);
  }

  function avatar(style, seed, pressed, badge) {
    const b = document.createElement("button");
    b.className = "av"; b.type = "button"; b.title = seed; b.dataset.seed = seed;
    if (pressed !== null) b.setAttribute("aria-pressed", String(pressed));
    b.innerHTML = svg(style, seed);
    if (badge) { const n = document.createElement("span"); n.className = "badge"; n.textContent = badge; b.append(n); }
    return b;
  }

  const root = document.getElementById("styles");
  const sections = {};
  for (const style of SEEDICON_STYLES) {
    const sec = document.createElement("section");
    sec.id = style;
    sec.innerHTML =
      '<div class="head"><h2 class="mono"></h2><span class="count"></span></div>' +
      '<p class="tagline"></p>' +
      '<p class="label">Escolhidas</p><div class="picked"></div>' +
      '<p class="label">Candidatas</p><div class="grid"></div>' +
      '<div class="tools">' +
        '<button data-act="reroll">Trocar candidatas</button>' +
        '<button data-act="more">+ ' + DATA.perStyle + ' candidatas</button>' +
        '<button data-act="clear">Limpar escolhidas</button>' +
        '<button data-act="file">Voltar às do arquivo</button>' +
        '<form style="display:contents"><input placeholder="Testar uma seed específica" class="mono"><button>Adicionar</button></form>' +
      '</div>';
    sec.querySelector("h2").textContent = style;
    sec.querySelector(".tagline").textContent = DATA.taglines[style] || "";
    root.append(sec);
    sections[style] = sec;

    sec.querySelector(".grid").addEventListener("click", (e) => {
      const b = e.target.closest(".av"); if (!b) return;
      const seed = b.dataset.seed, list = picks[style], i = list.indexOf(seed);
      if (i >= 0) list.splice(i, 1); else list.push(seed);
      changed(style);
    });
    sec.querySelector(".picked").addEventListener("click", (e) => {
      const b = e.target.closest(".av"); if (!b) return;
      picks[style] = picks[style].filter((x) => x !== b.dataset.seed);
      changed(style);
    });
    sec.querySelector(".tools").addEventListener("click", (e) => {
      const act = e.target.dataset && e.target.dataset.act; if (!act) return;
      if (act === "reroll") cands[style] = [...new Set([...picks[style], ...fresh(DATA.perStyle)])];
      if (act === "more") cands[style] = [...cands[style], ...fresh(DATA.perStyle)];
      if (act === "clear") picks[style] = [];
      if (act === "file") { picks[style] = [...fileSeeds(style)]; cands[style] = [...new Set([...picks[style], ...cands[style]])]; }
      changed(style, act === "reroll" || act === "more" || act === "file");
    });
    sec.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      const input = e.target.querySelector("input"), seed = input.value.trim();
      if (!seed) return;
      if (!cands[style].includes(seed)) cands[style] = [seed, ...cands[style]];
      if (!picks[style].includes(seed)) picks[style].push(seed);
      input.value = "";
      changed(style, true);
    });
  }

  function renderPicked(style) {
    const box = sections[style].querySelector(".picked");
    box.replaceChildren(...picks[style].map((seed, i) => avatar(style, seed, null, String(i + 1))));
    if (!picks[style].length) box.innerHTML = '<span class="empty">Nenhuma; a galeria usa DEFAULT_SEEDS.</span>';
  }
  function renderGrid(style) {
    sections[style].querySelector(".grid").replaceChildren(...cands[style].map((seed) => {
      const i = picks[style].indexOf(seed);
      return avatar(style, seed, i >= 0, i >= 0 ? String(i + 1) : "");
    }));
  }
  function syncGrid(style) {
    for (const b of sections[style].querySelectorAll(".grid .av")) {
      const i = picks[style].indexOf(b.dataset.seed);
      b.setAttribute("aria-pressed", String(i >= 0));
      let badge = b.querySelector(".badge");
      if (i >= 0) { if (!badge) { badge = document.createElement("span"); badge.className = "badge"; b.append(badge); } badge.textContent = String(i + 1); }
      else if (badge) badge.remove();
    }
  }
  function status(style) {
    const n = picks[style].length, t = Number(targetEl.value) || 5;
    return n === t ? "done" : n ? "off" : "";
  }
  function renderChips() {
    document.getElementById("chips").replaceChildren(...SEEDICON_STYLES.map((s) => {
      const a = document.createElement("a");
      a.href = "#" + s; a.className = "chip mono " + status(s); a.textContent = s + " " + picks[s].length;
      return a;
    }));
  }
  function renderCount(style) {
    const el = sections[style].querySelector(".count");
    el.className = "count " + status(style);
    el.textContent = picks[style].length + " de " + (Number(targetEl.value) || 5);
  }

  function code() {
    const lines = ["export const GALLERY_SEEDS: Partial<Record<SeediconStyle, readonly string[]>> = {"];
    for (const s of SEEDICON_STYLES) {
      if (!picks[s].length || same(picks[s], DATA.defaults)) continue;
      lines.push("  " + s + ": [");
      for (const seed of picks[s]) lines.push("    " + JSON.stringify(seed) + ",");
      lines.push("  ],");
    }
    lines.push("};");
    return lines.join("\\n");
  }
  const codeEl = document.getElementById("code");

  function changed(style, regrid) {
    persist();
    renderPicked(style);
    regrid ? renderGrid(style) : syncGrid(style);
    renderCount(style);
    renderChips();
    codeEl.value = code();
  }

  function renderAll() {
    for (const s of SEEDICON_STYLES) { renderPicked(s); renderGrid(s); renderCount(s); }
    renderChips();
    codeEl.value = code();
  }
  sizeEl.addEventListener("change", renderAll);
  targetEl.addEventListener("input", () => { for (const s of SEEDICON_STYLES) renderCount(s); renderChips(); });

  document.getElementById("toCode").addEventListener("click", () => document.getElementById("code-section").scrollIntoView({ behavior: "smooth" }));
  const copyBtn = document.getElementById("copy");
  copyBtn.addEventListener("click", async () => {
    const text = code();
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch {}
    if (!ok) { codeEl.focus(); codeEl.select(); try { ok = document.execCommand("copy"); } catch {} }
    copyBtn.textContent = ok ? "Copiado" : "Selecione o código abaixo";
    setTimeout(() => (copyBtn.textContent = "Copiar código"), 1600);
  });

  renderAll();
})();
</script>
</body>
</html>
`;

writeFileSync(out, html);
console.log("Seed picker written to " + out);
