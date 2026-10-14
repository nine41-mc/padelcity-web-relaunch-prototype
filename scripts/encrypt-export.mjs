// Password-protects the static export for GitHub Pages (which has no server-side auth).
//
//   PROTOTYPE_PASSWORD=… node scripts/encrypt-export.mjs out
//
// Every HTML page is replaced by a small lock page that carries the original document
// AES-256-GCM-encrypted (key from PBKDF2-SHA256 over the password, one salt per build).
// After the password is entered, the page decrypts in the browser and replaces itself
// with the original document; the derived key is kept in localStorage so further pages
// open without asking again.
//
// The RSC payload files (*.txt) contain the page data in plain text and are deleted.
// Client-side navigation then falls back to full page loads, which decrypt the same way.
// NOT protected: JS chunks (UI strings of client components), images, fonts – and the
// source code in a public repository.
import { readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { webcrypto as crypto } from "node:crypto";

const dir = process.argv[2] ?? "out";
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
  const STORE = "pc-proto-key";
  const read = () => { try { return localStorage.getItem(STORE); } catch { return null; } };
  const write = (v) => { try { v ? localStorage.setItem(STORE, v) : localStorage.removeItem(STORE); } catch {} };
  async function open(raw) {
    const key = await crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["decrypt"]);
    const html = new TextDecoder().decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: d(P.iv) }, key, d(P.ct)));
    document.open(); document.write(html); document.close();
  }
  const saved = read();
  if (saved && saved.startsWith(P.salt + ":")) {
    try { await open(d(saved.slice(P.salt.length + 1))); return; } catch { write(null); }
  }
  const f = document.getElementById("f"); f.hidden = false; document.getElementById("pw").focus();
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = document.getElementById("err"), go = document.getElementById("go");
    go.disabled = true; err.textContent = "Prüfe …";
    try {
      const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(document.getElementById("pw").value), "PBKDF2", false, ["deriveBits"]);
      const raw = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", salt: d(P.salt), iterations: P.iter, hash: "SHA-256" }, base, 256));
      await open(raw);
      write(P.salt + ":" + btoa(String.fromCharCode(...raw)));
    } catch { err.textContent = "Das Passwort stimmt nicht."; go.disabled = false; }
  });
})();
</script></body></html>`;

let pages = 0, removed = 0;
for (const file of walk(dir)) {
  if (file.endsWith(".txt")) {
    unlinkSync(file);
    removed++;
  } else if (file.endsWith(".html")) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(readFileSync(file, "utf8"))));
    const payload = JSON.stringify({ v: 1, iter: ITERATIONS, salt: b64(salt), iv: b64(iv), ct: b64(ct) });
    writeFileSync(file, lockPage(payload));
    pages++;
  }
}
console.log(`encrypted ${pages} HTML pages, removed ${removed} RSC payload files`);
