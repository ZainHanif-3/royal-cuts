/* ROYAL CUTS — Owner admin dashboard */
(function () {
  "use strict";
  const KEY = "rc_config", PWKEY = "rc_admin_session";
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const rs = (n) => "Rs " + Number(n).toLocaleString("en-PK");

  /* ---------- deep helpers ---------- */
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const getPath = (o, p) => p.split(".").reduce((a, k) => (a ? a[k] : undefined), o);
  const setPath = (o, p, v) => {
    const ks = p.split("."), last = ks.pop();
    const t = ks.reduce((a, k) => (a[k] = a[k] || {}), o);
    t[last] = v;
  };

  let DEFAULTS = clone(window.DEFAULT_CONFIG);
  let cfg = load();
  let dirty = false;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return clone(window.DEFAULT_CONFIG);
      const saved = JSON.parse(raw);
      const out = clone(window.DEFAULT_CONFIG);
      const deep = (t, s) => {
        for (const k of Object.keys(s)) {
          if (s[k] && typeof s[k] === "object" && !Array.isArray(s[k]) && t[k] && typeof t[k] === "object" && !Array.isArray(t[k])) deep(t[k], s[k]);
          else t[k] = s[k];
        }
      };
      deep(out, saved);
      return out;
    } catch (e) { return clone(window.DEFAULT_CONFIG); }
  }

  const markDirty = () => {
    dirty = true;
    const p = $("#saveState"); p.textContent = "Unsaved changes"; p.classList.add("dirty");
  };
  const toast = (m) => {
    const t = $("#toast"); t.textContent = m; t.classList.add("show");
    clearTimeout(t._x); t._x = setTimeout(() => t.classList.remove("show"), 2400);
  };

  /* ============================================================
     LOGIN
     ============================================================ */
  const loginView = $("#loginView"), dashView = $("#dashView");
  function showDash(on) {
    loginView.style.display = on ? "none" : "grid";
    dashView.hidden = !on;
    if (on) renderAll();
  }
  if (sessionStorage.getItem(PWKEY) === "1") showDash(true);

  $("#loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#pw").value;
    if (v === cfg.admin.password) { sessionStorage.setItem(PWKEY, "1"); sessionStorage.setItem("rc_pw", v); $("#pw").value = ""; showDash(true); }
    else { const m = $("#loginMsg"); m.style.display = "block"; m.textContent = "Incorrect password."; }
  });
  $("#logoutBtn").addEventListener("click", () => { sessionStorage.removeItem(PWKEY); sessionStorage.removeItem("rc_pw"); showDash(false); });

  /* ============================================================
     TABS
     ============================================================ */
  const titles = { overview: "Overview", general: "Design & Brand", services: "Services & Prices", hairstyles: "Hairstyles", gallery: "Gallery", team: "Barbers", contact: "Contact & Hours", backup: "Backup / Publish" };
  function goTab(id) {
    $$(".tab").forEach((t) => t.classList.toggle("active", t.id === "tab-" + id));
    $$("#sideNav button").forEach((b) => b.classList.toggle("active", b.dataset.tab === id));
    $("#tabTitle").textContent = titles[id] || id;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  $("#sideNav").addEventListener("click", (e) => { const b = e.target.closest("button[data-tab]"); if (b) goTab(b.dataset.tab); });
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-go]"); if (b) goTab(b.dataset.go); });

  /* ============================================================
     GENERIC BINDINGS  (data-c="path")
     ============================================================ */
  function bindFields() {
    $$("[data-c]").forEach((inp) => {
      const path = inp.dataset.c;
      const val = getPath(cfg, path);
      if (inp.type === "color") inp.value = val || "#000000";
      else inp.value = val == null ? "" : val;
      inp.oninput = () => {
        setPath(cfg, path, inp.type === "color" ? inp.value : inp.value);
        markDirty();
        if (path === "hero.image") $("#heroPrev").src = inp.value;
        if (path.startsWith("theme.")) applyTheme();
      };
    });
    const hi = getPath(cfg, "hero.image");
    $("#heroPrev").src = hi;
    applyTheme();
  }

  function applyTheme() {
    const r = document.documentElement.style;
    r.setProperty("--accent", cfg.theme.accent);
    r.setProperty("--accent2", cfg.theme.accent2);
    r.setProperty("--dark", cfg.theme.dark);
    r.setProperty("--surface", cfg.theme.surface);
  }

  /* swatch presets */
  $("#presetSwatches").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-accent]"); if (!b) return;
    cfg.theme.accent = b.dataset.accent; cfg.theme.accent2 = b.dataset.accent2;
    $$("[data-c^='theme.']").forEach((i) => (i.value = getPath(cfg, i.dataset.c)));
    applyTheme(); markDirty(); toast("Theme colours updated — press Save");
  });

  /* image upload (file → local path under assets/ or data URL) */
  document.addEventListener("change", (e) => {
    const inp = e.target.closest("input[type=file][data-target]");
    if (!inp || !inp.files || !inp.files[0]) return;
    const file = inp.files[0];
    const r = new FileReader();
    r.onload = () => {
      setPath(cfg, inp.dataset.target, r.result);
      $$("[data-c='" + inp.dataset.target + "']").forEach((i) => (i.value = r.result));
      if (inp.dataset.target === "hero.image") $("#heroPrev").src = r.result;
      markDirty();
      toast(file.size > 900 * 1024
        ? "Large picture attached (stored inside config) — press Save"
        : "Picture attached — press Save");
    };
    r.readAsDataURL(file);
    inp.value = "";
  });

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-reset]"); if (!b) return;
    const path = b.dataset.reset;
    setPath(cfg, path, getPath(DEFAULTS, path));
    $$("[data-c='" + path + "']").forEach((i) => (i.value = getPath(cfg, path)));
    if (path === "hero.image") $("#heroPrev").src = getPath(cfg, path);
    markDirty(); toast("Reset to default");
  });

  /* ============================================================
     LISTS
     ============================================================ */
  function imgThumb(src, arr, idx) {
    return '<div class="thumb">' + (src ? '<img src="' + src + '" alt="">' : "") +
      '<label class="swap">change picture<input type="file" accept="image/*" hidden class="inline-file" data-arr="' + arr + '" data-idx="' + idx + '"></label></div>';
  }

  function renderServices() {
    const box = $("#serviceList"); box.innerHTML = "";
    cfg.services.forEach((s, i) => {
      const d = document.createElement("div"); d.className = "item";
      d.innerHTML = imgThumb(s.img, "services", i) +
        '<div class="fields">' +
        '<input data-arr="services" data-i="' + i + '" data-k="name" value="' + esc(s.name) + '" placeholder="Service name">' +
        '<textarea rows="2" data-arr="services" data-i="' + i + '" data-k="desc" placeholder="Short description">' + esc(s.desc) + "</textarea>" +
        '<input class="price-in" type="number" min="0" data-arr="services" data-i="' + i + '" data-k="price" value="' + s.price + '">' +
        '<input class="full" data-arr="services" data-i="' + i + '" data-k="img" value="' + esc(s.img) + '" placeholder="Image path or URL">' +
        "</div>" +
        '<div class="tools">' +
        '<button class="icon-btn" data-act="pop" data-arr="services" data-i="' + i + '" title="Mark popular">★</button>' +
        '<button class="icon-btn" data-act="up" data-arr="services" data-i="' + i + '">↑</button>' +
        '<button class="icon-btn del" data-act="del" data-arr="services" data-i="' + i + '">✕</button>' +
        "</div>";
      if (s.popular) d.querySelector('[data-act="pop"]').style.color = "var(--accent)";
      box.appendChild(d);
    });
  }

  function renderStyles() {
    const box = $("#styleList"); box.innerHTML = "";
    cfg.hairstyles.forEach((s, i) => {
      const d = document.createElement("div"); d.className = "item";
      d.innerHTML = imgThumb(s.img, "hairstyles", i) +
        '<div class="fields">' +
        '<input data-arr="hairstyles" data-i="' + i + '" data-k="name" value="' + esc(s.name) + '" placeholder="Style name">' +
        '<input data-arr="hairstyles" data-i="' + i + '" data-k="tag" value="' + esc(s.tag) + '" placeholder="Tag e.g. Trendy">' +
        '<input class="price-in" type="number" min="0" data-arr="hairstyles" data-i="' + i + '" data-k="price" value="' + s.price + '">' +
        '<input class="full" data-arr="hairstyles" data-i="' + i + '" data-k="img" value="' + esc(s.img) + '" placeholder="Image path or URL">' +
        "</div>" +
        '<div class="tools">' +
        '<button class="icon-btn" data-act="up" data-arr="hairstyles" data-i="' + i + '">↑</button>' +
        '<button class="icon-btn del" data-act="del" data-arr="hairstyles" data-i="' + i + '">✕</button>' +
        "</div>";
      box.appendChild(d);
    });
  }

  function renderTeam() {
    const box = $("#teamList"); box.innerHTML = "";
    cfg.barbers.forEach((b, i) => {
      const d = document.createElement("div"); d.className = "item";
      d.innerHTML = imgThumb(b.img, "barbers", i) +
        '<div class="fields">' +
        '<input data-arr="barbers" data-i="' + i + '" data-k="name" value="' + esc(b.name) + '">' +
        '<input data-arr="barbers" data-i="' + i + '" data-k="role" value="' + esc(b.role) + '">' +
        '<input data-arr="barbers" data-i="' + i + '" data-k="exp" value="' + esc(b.exp) + '">' +
        '<input class="full" data-arr="barbers" data-i="' + i + '" data-k="img" value="' + esc(b.img) + '">' +
        "</div>" +
        '<div class="tools"><button class="icon-btn del" data-act="del" data-arr="barbers" data-i="' + i + '">✕</button></div>';
      box.appendChild(d);
    });
  }

  function renderGallery() {
    const box = $("#galList"); box.innerHTML = "";
    cfg.gallery.forEach((g, i) => {
      const d = document.createElement("div"); d.className = "gal-item";
      d.innerHTML = '<img src="' + g + '" alt=""><button class="x" data-act="delgal" data-i="' + i + '">✕</button>';
      box.appendChild(d);
    });
    const add = document.createElement("button");
    add.className = "gal-item add"; add.id = "galAdd"; add.textContent = "＋";
    box.appendChild(add);
  }

  function esc(s) { return String(s == null ? "" : s).replace(/"/g, "&quot;"); }

  /* list field editing */
  document.addEventListener("input", (e) => {
    const inp = e.target.closest("[data-arr][data-i][data-k]");
    if (!inp) return;
    const arr = inp.dataset.arr, i = +inp.dataset.i, k = inp.dataset.k;
    cfg[arr][i][k] = k === "price" ? Math.max(0, Number(inp.value) || 0) : inp.value;
    markDirty();
  });

  /* list buttons */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const act = b.dataset.act, arr = b.dataset.arr, i = +b.dataset.i;
    if (act === "del") {
      if (!confirm("Delete this item?")) return;
      cfg[arr].splice(i, 1);
    } else if (act === "up") {
      if (i === 0) return;
      const t = cfg[arr][i - 1]; cfg[arr][i - 1] = cfg[arr][i]; cfg[arr][i] = t;
    } else if (act === "pop") {
      cfg[arr][i].popular = !cfg[arr][i].popular;
    } else if (act === "delgal") {
      cfg.gallery.splice(+b.dataset.i, 1);
    }
    markDirty(); rerenderLists();
  });

  document.addEventListener("change", (e) => {
    const inp = e.target.closest(".inline-file"); if (!inp || !inp.files[0]) return;
    const arr = inp.dataset.arr, i = +inp.dataset.idx;
    const r = new FileReader();
    r.onload = () => { cfg[arr][i].img = r.result; markDirty(); rerenderLists(); toast("Picture updated — press Save"); };
    r.readAsDataURL(inp.files[0]);
  });

  function rerenderLists() { renderServices(); renderStyles(); renderTeam(); renderGallery(); }

  /* add buttons */
  $("#addService").addEventListener("click", () => {
    cfg.services.push({ id: "s" + Date.now(), name: "New Service", desc: "Describe this service.", price: 300, img: "assets/img/clipper.jpg", popular: false });
    markDirty(); renderServices();
  });
  $("#addStyle").addEventListener("click", () => {
    cfg.hairstyles.push({ id: "h" + Date.now(), name: "New Hairstyle", price: 500, img: "assets/img/style-1.jpg", tag: "New" });
    markDirty(); renderStyles();
  });
  $("#addBarber").addEventListener("click", () => {
    cfg.barbers.push({ name: "New Barber", role: "Stylist", exp: "3 yrs", img: "assets/img/chair.jpg" });
    markDirty(); renderTeam();
  });
  $("#addGal").addEventListener("click", () => {
    cfg.gallery.push("assets/img/gal-1.jpg"); markDirty(); renderGallery();
  });

  /* ============================================================
     SAVE / IMPORT / EXPORT
     ============================================================ */
  $("#saveBtn").addEventListener("click", async () => {
    const p = $("#saveState");
    localStorage.setItem(KEY, JSON.stringify(cfg));
    dirty = false;
    p.textContent = "All changes saved locally"; p.classList.remove("dirty");
    toast("✅ Saved — your site now shows the updates");
    renderOverview();

    /* Best-effort: also persist server-side so every visitor sees it */
    try {
      const pw = sessionStorage.getItem("rc_pw") || "";
      const r = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw, config: cfg })
      });
      if (r.ok) { p.textContent = "Saved to server + browser"; toast("✅ Saved on the server — live for everyone"); }
      else if (r.status === 401) { p.textContent = "Saved locally · server rejected password"; }
      else { p.textContent = "Saved locally (server not available)"; }
    } catch (e) { /* static hosting — localStorage only */ }
  });

  $("#dlConfig").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "config.json"; a.click();
    URL.revokeObjectURL(a.href);
    toast("config.json downloaded");
  });

  $("#importFile").addEventListener("change", (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const j = JSON.parse(r.result);
        if (!j.brand || !j.services) throw new Error("bad file");
        const merged = clone(DEFAULTS);
        const deep = (t, s) => { for (const k of Object.keys(s)) { if (s[k] && typeof s[k] === "object" && !Array.isArray(s[k]) && t[k] && typeof t[k] === "object" && !Array.isArray(t[k])) deep(t[k], s[k]); else t[k] = s[k]; } };
        deep(merged, j); cfg = merged;
        markDirty(); renderAll(); toast("Config imported — press Save");
      } catch (err) { toast("Invalid config file"); }
    };
    r.readAsText(f); e.target.value = "";
  });

  $("#resetAll").addEventListener("click", () => {
    if (!confirm("Reset everything to the original design?")) return;
    cfg = clone(DEFAULTS);
    localStorage.removeItem(KEY);
    markDirty(); renderAll(); toast("Reset to defaults — press Save to keep");
  });

  $("#savePw").addEventListener("click", () => {
    const v = $("#newPw").value.trim();
    if (!v) { toast("Enter a new password first"); return; }
    cfg.admin.password = v; $("#newPw").value = "";
    markDirty(); toast("Password will change when you press Save Changes");
  });

  /* ============================================================
     RENDER
     ============================================================ */
  function renderOverview() {
    const avgSvc = Math.round(cfg.services.reduce((a, s) => a + Number(s.price || 0), 0) / (cfg.services.length || 1));
    const prices = cfg.hairstyles.concat(cfg.services).map((x) => Number(x.price || 0));
    const k = [
      { l: "Services", v: cfg.services.length, s: "listed on the site" },
      { l: "Hairstyles", v: cfg.hairstyles.length, s: "cards with photos" },
      { l: "Avg service price", v: rs(avgSvc), s: "across all services" },
      { l: "Price range", v: rs(Math.min.apply(null, prices)) + "–" + rs(Math.max.apply(null, prices)), s: "Pakistani Rupees" }
    ];
    $("#kpiRow").innerHTML = k.map((x) => '<div class="kpi"><div class="k-l">' + x.l + '</div><div class="k-v">' + x.v + '</div><div class="k-s">' + x.s + "</div></div>").join("");
    $("#rawCfg").textContent = JSON.stringify(cfg, null, 2);
  }

  function renderAll() { bindFields(); rerenderLists(); renderOverview(); }

  /* autosave safety net */
  window.addEventListener("beforeunload", (e) => {
    if (dirty) { e.preventDefault(); e.returnValue = ""; }
  });
})();
