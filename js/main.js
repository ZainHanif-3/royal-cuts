/* ROYAL CUTS — front-end renderer + 3D motion */
(async function () {
  "use strict";

  /* Priority: config.json (published owner edits) > config.js defaults > browser overrides */
  try {
    const r = await fetch("config.json", { cache: "no-store" });
    if (r.ok) {
      const j = await r.json();
      if (j && j.brand && j.services) window.DEFAULT_CONFIG = j;
    }
  } catch (e) { /* file:// or no config.json — use built-in defaults */ }

  const C = window.get_config();
  const $ = (s) => document.querySelector(s);
  const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
  const rs = (n) => "Rs " + Number(n).toLocaleString("en-PK");

  /* ---------- Brand + hero ---------- */
  document.title = C.brand.name + " — " + C.brand.tagline + " | Lahore, Pakistan";
  $("#brandMark").textContent = C.brand.logoMark;
  $("#brandName").innerHTML = C.brand.name.replace(/\s(\S+)$/, " <span>$1</span>");
  $("#heroBg").style.backgroundImage = "url('" + C.hero.image + "')";
  $("#heroBadge").textContent = C.hero.badge;
  $("#heroH1").innerHTML = C.hero.headline.replace(/(\S+)\s*$/, '<span class="line3d">$1</span>');
  $("#heroSub").textContent = C.hero.sub;
  $("#ctaPrimary").textContent = C.hero.ctaPrimary;
  $("#ctaSecondary").textContent = C.hero.ctaSecondary;
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Hero mini stats ---------- */
  const hs = $("#heroStats");
  C.stats.slice(0, 3).forEach((s) => {
    hs.appendChild(el("div", "", '<div class="s-val">' + s.value + s.suffix + '</div><div class="s-lab">' + s.label + "</div>"));
  });

  /* ---------- Stats counters ---------- */
  const sg = $("#statsGrid");
  C.stats.forEach((s) => {
    const t = el("div", "stat-tile tilt reveal", '<div class="v" data-to="' + s.value + '" data-suf="' + s.suffix + '">0</div><div class="l">' + s.label + "</div>");
    sg.appendChild(t);
  });

  /* ---------- Services ---------- */
  const grid = $("#serviceGrid");
  C.services.forEach((s) => {
    const card = el("div", "card tilt reveal");
    card.innerHTML =
      '<div class="card-img">' + (s.popular ? '<div class="popular-ribbon">Popular</div>' : "") +
      '<div class="price-tag">' + rs(s.price) + "</div>" +
      '<img src="' + s.img + '" alt="' + s.name + '" loading="lazy"></div>' +
      '<div class="card-body"><h3>' + s.name + "</h3><p>" + s.desc + "</p>" +
      '<div class="card-foot"><span class="p">' + rs(s.price) + ' <small>/ service</small></span>' +
      '<a class="book-link" href="#booking" data-service="' + s.name + '">Book →</a></div></div>';
    grid.appendChild(card);
  });

  /* ---------- Hairstyle cards ---------- */
  const sg2 = $("#styleGrid");
  C.hairstyles.forEach((h) => {
    const c = el("div", "style-card tilt reveal");
    c.innerHTML =
      '<img src="' + h.img + '" alt="' + h.name + '" loading="lazy">' +
      '<div class="veil"></div><div class="style-tag">' + h.tag + "</div>" +
      '<div class="style-info"><h4>' + h.name + "</h4>" +
      '<div class="row"><span class="style-price">' + rs(h.price) + ' <small>only</small></span>' +
      '<span class="style-book" data-service="' + h.name + '">+</span></div></div>';
    c.addEventListener("click", () => pickService(h.name));
    sg2.appendChild(c);
  });

  /* ---------- Price list (all saloon things) ---------- */
  const A = [], B = [];
  C.services.forEach((s, i) => (i % 2 === 0 ? A : B).push(s));
  C.hairstyles.forEach((h) => B.push({ name: h.name, price: h.price }));
  const row = (o) => '<div class="p-row"><span class="nm">' + o.name + '</span><span class="dots"></span><span class="pr">' + rs(o.price) + "</span></div>";
  $("#priceListA").innerHTML = A.map(row).join("");
  $("#priceListB").innerHTML = B.map(row).join("");

  /* ---------- Booking select ---------- */
  const sel = $("#bkService");
  const optgroup = (label, arr) => {
    const g = document.createElement("optgroup"); g.label = label;
    arr.forEach((o) => { const op = document.createElement("option"); op.value = o.name; op.textContent = o.name + " — " + rs(o.price); g.appendChild(op); });
    sel.appendChild(g);
  };
  optgroup("Services", C.services);
  optgroup("Hairstyles", C.hairstyles);

  function pickService(name) {
    sel.value = name;
    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
    sel.style.borderColor = "var(--accent)";
    setTimeout(() => (sel.style.borderColor = ""), 1600);
  }
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-service]");
    if (t) { e.preventDefault(); pickService(t.getAttribute("data-service")); }
  });

  /* ---------- Gallery ---------- */
  const gg = $("#galleryGrid");
  C.gallery.forEach((src, i) => {
    const g = el("div", "g-item reveal");
    g.innerHTML = '<img src="' + src + '" alt="Royal Cuts work ' + (i + 1) + '" loading="lazy">';
    gg.appendChild(g);
  });

  /* ---------- Team ---------- */
  const tg = $("#teamGrid");
  C.barbers.forEach((b) => {
    const c = el("div", "barber tilt reveal");
    c.innerHTML = '<div class="ph"><img src="' + b.img + '" alt="' + b.name + '" loading="lazy"></div>' +
      '<div class="info"><h4>' + b.name + '</h4><div class="role">' + b.role + '</div><div class="exp">' + b.exp + " experience</div></div>";
    tg.appendChild(c);
  });

  /* ---------- Testimonials ---------- */
  const teg = $("#testiGrid");
  C.testimonials.forEach((t) => {
    const c = el("div", "t-card tilt reveal");
    c.innerHTML = '<div class="t-stars">' + "★".repeat(t.stars) + "☆".repeat(5 - t.stars) + "</div>" +
      "<p>“" + t.text + "”</p>" +
      '<div class="t-who"><div class="av">' + t.name.charAt(0) + '</div><div><div class="nm">' + t.name + '</div><div class="sub">Verified Client</div></div></div>';
    teg.appendChild(c);
  });

  /* ---------- Contact binding ---------- */
  $("#cPhone").textContent = C.contact.phone;
  $("#cAddr").textContent = C.contact.address;
  $("#cHours").textContent = C.contact.hours;
  $("#cMail").textContent = C.contact.email;
  $("#fAddr").textContent = C.contact.address;
  $("#fPhone").textContent = C.contact.phone;
  $("#fPhone").href = "tel:" + C.contact.phoneLink;
  $("#fMail").textContent = C.contact.email;
  $("#fMail").href = "mailto:" + C.contact.email;
  $("#fHours").textContent = C.contact.hours;
  $("#mapFrame").src = C.contact.mapEmbed;
  $("#waFab").href = "https://wa.me/" + C.contact.whatsapp;

  /* ---------- Theme ---------- */
  const r = document.documentElement.style;
  r.setProperty("--accent", C.theme.accent);
  r.setProperty("--accent2", C.theme.accent2);
  r.setProperty("--dark", C.theme.dark);
  r.setProperty("--surface", C.theme.surface);

  /* ============================================================
     MOTION
     ============================================================ */

  /* Nav scroll state */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* Mobile menu */
  const burger = $("#burger"), links = $("#navLinks");
  burger.addEventListener("click", () => { burger.classList.toggle("open"); links.classList.toggle("open"); });
  links.addEventListener("click", (e) => { if (e.target.tagName === "A") { burger.classList.remove("open"); links.classList.remove("open"); } });

  /* Reveal on scroll */
  const io = new IntersectionObserver((ents) => {
    ents.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add("in"), i * 70); io.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll(".reveal").forEach((n) => io.observe(n));

  /* Counters */
  const cio = new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      if (!e.isIntersecting) return;
      const node = e.target, to = parseFloat(node.dataset.to), suf = node.dataset.suf || "";
      const dec = to % 1 !== 0, dur = 1500, t0 = performance.now();
      const step = (t) => {
        const p = Math.min((t - t0) / dur, 1), v = to * (1 - Math.pow(1 - p, 3));
        node.textContent = (dec ? v.toFixed(1) : Math.round(v).toLocaleString("en-PK")) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step); cio.unobserve(node);
    });
  }, { threshold: .5 });
  document.querySelectorAll("[data-to]").forEach((n) => cio.observe(n));

  /* 3D mouse tilt */
  const bindTilt = (node) => {
    if (node.dataset.tiltBound) return; node.dataset.tiltBound = "1";
    const max = 11;
    node.addEventListener("mousemove", (e) => {
      const b = node.getBoundingClientRect();
      const px = (e.clientX - b.left) / b.width, py = (e.clientY - b.top) / b.height;
      node.style.setProperty("--mx", px * 100 + "%");
      node.style.setProperty("--my", py * 100 + "%");
      node.style.transform = "perspective(1100px) rotateY(" + ((px - .5) * max * 2).toFixed(2) + "deg) rotateX(" + ((.5 - py) * max * 2).toFixed(2) + "deg) translateZ(14px) scale(1.03)";
    });
    node.addEventListener("mouseleave", () => { node.style.transform = ""; });
  };
  const bindAllTilt = () => document.querySelectorAll(".tilt").forEach(bindTilt);
  bindAllTilt();
  new MutationObserver(bindAllTilt).observe(document.body, { childList: true, subtree: true });

  /* Hero parallax */
  const heroVisual = document.querySelector(".hero-visual");
  document.querySelector(".hero").addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - .5), y = (e.clientY / window.innerHeight - .5);
    if (heroVisual) heroVisual.style.transform = "rotateY(" + x * 14 + "deg) rotateX(" + -y * 10 + "deg)";
    $("#heroBg").style.transform = "scale(1.12) translate3d(" + x * -18 + "px," + y * -18 + "px,0)";
  });

  /* Booking form → WhatsApp */
  const form = $("#bookForm"), msg = $("#bookMsg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const n = $("#bkName").value.trim(), p = $("#bkPhone").value.trim(), s = $("#bkService").value;
    const d = $("#bkDate").value, tm = $("#bkTime").value, note = $("#bkNote").value.trim();
    if (!n || !p || !d || !tm) { msg.className = "form-msg err"; msg.style.display = "block"; msg.textContent = "Please fill name, phone, date and time."; return; }
    const text = encodeURIComponent(
      "Royal Cuts Booking%0A%0AName: " + n + "%0APhone: " + p + "%0AService: " + s + "%0ADate: " + d + "%0ATime: " + tm + (note ? "%0ANotes: " + note : "")
    );
    msg.className = "form-msg"; msg.style.display = "block";
    msg.innerHTML = "✅ Booking ready — opening WhatsApp to confirm… <br><a href='https://wa.me/" + C.contact.whatsapp + "?text=" + text + "' target='_blank' style='color:var(--accent);font-weight:700'>Click here if it doesn't open</a>";
    window.open("https://wa.me/" + C.contact.whatsapp + "?text=" + text, "_blank");
    form.reset();
  });
})();
