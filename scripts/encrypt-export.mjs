// Password-protects the static export for GitHub Pages (which has no server-side auth).
//
//   PROTOTYPE_PASSWORD=… node scripts/encrypt-export.mjs out
//
// Every HTML page is replaced by a small lock page that carries the original document
// AES-256-GCM-encrypted (key from PBKDF2-SHA256 over the password, fixed per-site salt).
// The RSC payload files (*.txt) are encrypted as JSON ({"pcenc":1,…}).
//
// After the password is entered, the lock page stores the derived key in IndexedDB and registers
// public/sw.js: the service worker decrypts pages and payloads before the browser sees them, so the
// site behaves exactly like an unprotected build (scripts, video, client-side navigation).
// Fallback without service workers: the lock page decrypts itself via document.write.
// NOT protected: JS chunks (UI strings of client components), images, fonts – and the
// source code in a public repository.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { webcrypto as crypto } from "node:crypto";

const dir = process.argv[2] ?? "out";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const password = process.env.PROTOTYPE_PASSWORD;
if (!password) {
  console.error("PROTOTYPE_PASSWORD is not set – refusing to publish an unprotected build.");
  process.exit(1);
}

const ITERATIONS = 310_000;
// Fixed per-site salt: the key a viewer stored stays valid across deploys until the password changes.
const salt = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode("padelcity-web-relaunch-prototype"))).slice(0, 16);
const b64 = (u) => Buffer.from(u).toString("base64");

const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" }, base, 256);
const key = await crypto.subtle.importKey("raw", bits, "AES-GCM", false, ["encrypt"]);

function walk(d) {
  return readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const lockPage = (payload) => `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>PadelCity · Prototyp</title>
<style>
:root{color-scheme:dark;--ink:#0b0b0f;--card:#16151d;--line:#2c2a38;--fg:#f2f0f6;--muted:#a9a3b8;--err:#ff8a8a}
*{box-sizing:border-box}html,body{height:100%}
body{margin:0;background:var(--ink);color:var(--fg);font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;display:grid;place-items:center;padding:16px}
form{width:100%;max-width:400px;background:var(--card);border:1px solid var(--line);border-radius:24px;padding:28px 24px;display:grid;gap:14px}
h1{margin:0;font:800 italic 30px/1 "Arial Narrow",Arial,sans-serif;text-transform:uppercase;letter-spacing:.01em}
p{margin:0;color:var(--muted)}label{font-weight:600;font-size:14px}
input{width:100%;font:inherit;padding:12px 16px;border-radius:999px;border:1px solid var(--line);background:var(--ink);color:var(--fg)}
input:focus{outline:2px solid #b4e854;outline-offset:2px}
button{font:800 italic 18px/1 "Arial Narrow",Arial,sans-serif;text-transform:uppercase;letter-spacing:.03em;min-height:48px;border:0;border-radius:999px;color:#fff;background:linear-gradient(313deg,#dc05a1,#8512b5);cursor:pointer}
button:disabled{opacity:.6}.err{color:var(--err);font-size:14px;min-height:1.3em}
[hidden]{display:none!important} /* the form must stay invisible while a stored key decrypts the page */
</style></head><body>
<form id="f" hidden>
  <h1>PadelCity Prototyp</h1>
  <p>Dieser Prototyp ist nur für einen kleinen Personenkreis bestimmt. Bitte gib das Passwort ein, das du separat bekommen hast.</p>
  <label for="pw">Passwort</label>
  <input id="pw" type="password" autocomplete="current-password" required autofocus>
  <button id="go" type="submit">Entsperren</button>
  <div class="err" id="err" role="alert"></div>
</form>
<script type="application/json" id="p">${payload}</script>
<script>
(async () => {
  const P = JSON.parse(document.getElementById("p").textContent);
  const d = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const enc = (u) => btoa(String.fromCharCode(...u));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const swOK = "serviceWorker" in navigator && window.isSecureContext;
  if (swOK) navigator.serviceWorker.register(P.base + "/sw.js", { scope: P.base + "/" }).catch(() => {});

  // Key storage: IndexedDB (read by the service worker) + localStorage (fallback path)
  const idb = () => new Promise((res, rej) => { const r = indexedDB.open("pc-proto", 1); r.onupgradeneeded = () => r.result.createObjectStore("kv"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const idbSet = async (v) => { const db = await idb(); await new Promise((res) => { const tx = db.transaction("kv", "readwrite"); tx.objectStore("kv").put(v, "key"); tx.oncomplete = res; tx.onerror = res; }); };
  const idbGet = async () => { try { const db = await idb(); return await new Promise((res) => { const r = db.transaction("kv").objectStore("kv").get("key"); r.onsuccess = () => res(r.result); r.onerror = () => res(undefined); }); } catch { return undefined; } };
  const lsGet = () => { try { return JSON.parse(localStorage.getItem("pc-proto-key") || "null"); } catch { return null; } };
  const store = async (raw) => { const v = { salt: P.salt, raw: enc(raw) }; try { await idbSet(v); } catch {} try { localStorage.setItem("pc-proto-key", JSON.stringify(v)); } catch {} };

  async function decrypt(raw) {
    const key = await crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["decrypt"]);
    return new TextDecoder().decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: d(P.iv) }, key, d(P.ct)));
  }
  function writeDoc(html) { document.open(); document.write(html); document.close(); }
  // Hand over to the service worker: once it controls the page, a reload returns the decrypted document.
  async function viaWorker() {
    if (!swOK) return false;
    const last = Number(sessionStorage.getItem("pc-sw-reload") || 0);
    if (Date.now() - last < 10000) return false; // reloaded a moment ago and still locked → don't loop
    await Promise.race([navigator.serviceWorker.ready, sleep(4000)]);
    sessionStorage.setItem("pc-sw-reload", String(Date.now()));
    location.reload();
    return true;
  }

  const saved = (await idbGet()) || lsGet();
  if (saved && saved.salt === P.salt) {
    try {
      const html = await decrypt(d(saved.raw));
      if (await viaWorker()) return;
      writeDoc(html);
      return;
    } catch {}
  }
  const f = document.getElementById("f"); f.hidden = false; document.getElementById("pw").focus();
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = document.getElementById("err"), go = document.getElementById("go");
    go.disabled = true; err.textContent = "Prüfe …";
    try {
      const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(document.getElementById("pw").value), "PBKDF2", false, ["deriveBits"]);
      const raw = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", salt: d(P.salt), iterations: P.iter, hash: "SHA-256" }, base, 256));
      const html = await decrypt(raw); // throws on a wrong password
      await store(raw);
      if (await viaWorker()) return;
      writeDoc(html);
    } catch { err.textContent = "Das Passwort stimmt nicht."; go.disabled = false; }
  });
})();
</script></body></html>`;

async function seal(text) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(text)));
  return { salt: b64(salt), iv: b64(iv), ct: b64(ct) };
}

let pages = 0, payloads = 0;
for (const file of walk(dir)) {
  if (file.endsWith(".txt")) {
    writeFileSync(file, JSON.stringify({ pcenc: 1, ...(await seal(readFileSync(file, "utf8"))) }));
    payloads++;
  } else if (file.endsWith(".html")) {
    const payload = JSON.stringify({ v: 2, iter: ITERATIONS, base: basePath, ...(await seal(readFileSync(file, "utf8"))) });
    writeFileSync(file, lockPage(payload));
    pages++;
  }
}
console.log(`encrypted ${pages} HTML pages and ${payloads} RSC payloads`);
