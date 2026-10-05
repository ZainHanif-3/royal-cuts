/* ============================================================
   Royal Cuts — zero-dependency Node server
   Static hosting + JSON API so owner edits persist for everyone
   Run:  npm start        →  http://localhost:3000
   ============================================================ */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const CONFIG_FILE = path.join(ROOT, "config.json");

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8", ".woff2": "font/woff2", ".txt": "text/plain"
};

const readBody = (req) => new Promise((res, rej) => {
  let b = ""; let size = 0;
  req.on("data", (c) => {
    size += c.length;
    if (size > 8 * 1024 * 1024) { rej(new Error("payload too large")); req.destroy(); return; }
    b += c;
  });
  req.on("end", () => res(b));
  req.on("error", rej);
});

const send = (res, code, data, type) => {
  res.writeHead(code, { "Content-Type": type || "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(data);
};

function safeJoin(base, target) {
  const p = path.normalize(path.join(base, target));
  return p.startsWith(base) ? p : null;
}

const server = http.createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);

  /* ---------- API ---------- */
  if (url === "/api/config" && req.method === "GET") {
    try { return send(res, 200, fs.readFileSync(CONFIG_FILE, "utf8")); }
    catch (e) { return send(res, 404, JSON.stringify({ error: "config.json not found" })); }
  }

  if (url === "/api/config" && req.method === "POST") {
    try {
      const raw = await readBody(req);
      const body = JSON.parse(raw);
      let current = {};
      try { current = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8")); } catch (e) { current = {}; }
      const pw = (current.admin && current.admin.password) || "royalcuts2026";
      if (body.password !== pw) return send(res, 401, JSON.stringify({ error: "invalid password" }));
      if (!body.config || !body.config.brand || !body.config.services)
        return send(res, 400, JSON.stringify({ error: "invalid config shape" }));

      if (!fs.existsSync(CONFIG_FILE + ".bak")) fs.writeFileSync(CONFIG_FILE + ".bak", JSON.stringify(current, null, 2));
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(body.config, null, 2));
      console.log("[api] config updated by owner at " + new Date().toISOString());
      return send(res, 200, JSON.stringify({ ok: true, savedAt: Date.now() }));
    } catch (e) {
      return send(res, 500, JSON.stringify({ error: e.message }));
    }
  }

  if (url.startsWith("/api/")) return send(res, 404, JSON.stringify({ error: "not found" }));

  /* ---------- STATIC ---------- */
  let target = url === "/" ? "/index.html" : url;
  let file = safeJoin(ROOT, target);
  if (!file) return send(res, 403, "Forbidden", "text/plain");

  fs.stat(file, (err, st) => {
    if (err || st.isDirectory()) {
      const idx = path.join(file, "index.html");
      if (!err && st.isDirectory() && fs.existsSync(idx)) file = idx;
      else if (target === "/admin") { res.writeHead(301, { Location: "/admin.html" }); return res.end(); }
      else return send(res, 404, "404 Not Found", "text/plain");
    }
    const ext = path.extname(file).toLowerCase();
    fs.readFile(file, (e, data) => {
      if (e) return send(res, 404, "404 Not Found", "text/plain");
      const type = MIME[ext] || "application/octet-stream";
      const cache = /\.(jpg|jpeg|png|webp|svg|woff2)$/i.test(ext) ? "public, max-age=604800" : "no-cache";
      res.writeHead(200, { "Content-Type": type, "Cache-Control": cache });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log("\n  ✂  ROYAL CUTS server running");
  console.log("  → Site:  http://localhost:" + PORT + "/");
  console.log("  → Admin: http://localhost:" + PORT + "/admin.html\n");
});
