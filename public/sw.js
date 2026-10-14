/*
 * Password protection for the static GitHub Pages export (see scripts/encrypt-export.mjs).
 * Every HTML page and RSC payload (*.txt) is published AES-256-GCM-encrypted. Once the visitor has entered the
 * password, the lock page stores the derived key in IndexedDB; this service worker then decrypts pages and
 * payloads before the browser sees them – so the site loads exactly like an unprotected build (scripts, video,
 * client-side navigation). Without a stored key the encrypted response (= lock page) passes through unchanged.
 */
const DB = "pc-proto";
const STORE = "kv";
let cached = null; // { salt, key: CryptoKey }

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

function idb() {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
async function idbGet(k) {
  const db = await idb();
  return new Promise((resolve) => {
    const r = db.transaction(STORE).objectStore(STORE).get(k);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => resolve(undefined);
  });
}
async function idbDelete(k) {
  const db = await idb();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(k);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}
const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function getKey(salt) {
  if (cached && cached.salt === salt) return cached.key;
  const stored = await idbGet("key"); // { salt, raw: base64 }
  if (!stored || stored.salt !== salt) return null;
  const key = await crypto.subtle.importKey("raw", b64(stored.raw), "AES-GCM", false, ["decrypt"]);
  cached = { salt, key };
  return key;
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  const isTxt = url.pathname.endsWith(".txt");
  const isDoc = req.mode === "navigate" || req.destination === "document" || url.pathname.endsWith(".html");
  if (!isTxt && !isDoc) return;
  event.respondWith(decryptResponse(req, isTxt));
});

async function decryptResponse(req, isTxt) {
  const res = await fetch(req);
  const body = await res.clone().text();
  let payload;
  try {
    if (isTxt) {
      if (!body.startsWith('{"pcenc"')) return res;
      payload = JSON.parse(body);
    } else {
      const m = body.match(/<script type="application\/json" id="p">([\s\S]*?)<\/script>/);
      if (!m) return res;
      payload = JSON.parse(m[1]);
    }
  } catch {
    return res;
  }
  const key = await getKey(payload.salt);
  if (!key) return res; // not unlocked yet → lock page
  try {
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64(payload.iv) }, key, b64(payload.ct));
    return new Response(plain, {
      status: res.status,
      statusText: res.statusText,
      headers: { "content-type": isTxt ? "text/plain; charset=utf-8" : "text/html; charset=utf-8", "cache-control": "no-cache" },
    });
  } catch {
    // Password changed since the key was stored → forget it and show the lock page again
    cached = null;
    await idbDelete("key");
    return res;
  }
}
