/* ROYAL CUTS — site configuration (owner-editable) */
window.DEFAULT_CONFIG = {
  brand: {
    name: "ROYAL CUTS",
    tagline: "Barber & Grooming Studio",
    tagline2: "Where Style Meets Steel.",
    logoMark: "RC"
  },
  hero: {
    headline: "Sharp Cuts. Bold Style.",
    sub: "Pakistan's premium barber experience — fades, beards, shaves and grooming, handcrafted by master barbers.",
    image: "assets/img/hero.jpg",
    ctaPrimary: "Book Appointment",
    ctaSecondary: "View Styles",
    badge: "Open Today · 10:00 AM – 11:00 PM"
  },
  theme: {
    accent: "#e8b923",
    accent2: "#ff7a18",
    dark: "#0b0b0f",
    surface: "#14141b"
  },
  contact: {
    phone: "+92 300 1234567",
    phoneLink: "+923001234567",
    email: "hello@royalcuts.pk",
    address: "Main Boulevard, Gulberg III, Lahore, Pakistan",
    hours: "Mon – Sun · 10:00 AM – 11:00 PM",
    whatsapp: "923001234567",
    mapEmbed: "https://www.google.com/maps?q=Gulberg+III+Lahore&output=embed"
  },
  services: [
    { id: "s1", name: "Regular Haircut", desc: "Clean, classic cut with clipper & scissors, finished with styling.", price: 200, img: "assets/img/clipper.jpg", popular: false },
    { id: "s2", name: "Kids Haircut", desc: "Patient, gentle cuts for boys under 12.", price: 300, img: "assets/img/style-8.jpg", popular: false },
    { id: "s3", name: "Fade Haircut", desc: "Skin, taper or low fade blended to perfection.", price: 500, img: "assets/img/style-2.jpg", popular: true },
    { id: "s4", name: "Beard Trim & Shape", desc: "Line-up, trim and hot-towel finish.", price: 250, img: "assets/img/beard.jpg", popular: false },
    { id: "s5", name: "Royal Shave", desc: "Straight-razor shave with hot towel & aftercare.", price: 300, img: "assets/img/shave.jpg", popular: true },
    { id: "s6", name: "Head Massage", desc: "20-minute relaxing scalp & shoulder massage.", price: 350, img: "assets/img/gal-3.jpg", popular: false },
    { id: "s7", name: "Hair Colour", desc: "Full or grey-cover colour, ammonia-free options.", price: 800, img: "assets/img/gal-2.jpg", popular: false },
    { id: "s8", name: "Facial & Cleanup", desc: "Deep clean, scrub, mask and toner.", price: 600, img: "assets/img/gal-4.jpg", popular: false },
    { id: "s9", name: "Threading (Eyebrow)", desc: "Precise eyebrow shaping.", price: 100, img: "assets/img/style-9.jpg", popular: false },
    { id: "s10", name: "Hair Wash & Blow Dry", desc: "Shampoo, conditioner and styling blow-dry.", price: 200, img: "assets/img/about.jpg", popular: false },
    { id: "s11", name: "Hot Towel Treatment", desc: "Steam, exfoliate and refresh.", price: 450, img: "assets/img/gal-1.jpg", popular: false },
    { id: "s12", name: "Full Grooming Package", desc: "Haircut + beard + shave + facial + massage.", price: 1000, img: "assets/img/chair.jpg", popular: true }
  ],
  hairstyles: [
    { id: "h1", name: "Buzz Cut", price: 200, img: "assets/img/style-8.jpg", tag: "Low Maintenance" },
    { id: "h2", name: "Crew Cut", price: 300, img: "assets/img/style-1.jpg", tag: "Classic" },
    { id: "h3", name: "Side Part", price: 450, img: "assets/img/style-3.jpg", tag: "Business" },
    { id: "h4", name: "Taper Fade", price: 500, img: "assets/img/style-2.jpg", tag: "Most Popular" },
    { id: "h5", name: "Textured Crop", price: 550, img: "assets/img/style-5.jpg", tag: "Trendy" },
    { id: "h6", name: "Pompadour", price: 600, img: "assets/img/style-6.jpg", tag: "Signature" },
    { id: "h7", name: "Quiff Style", price: 700, img: "assets/img/style-4.jpg", tag: "Volume" },
    { id: "h8", name: "Mohawk Undercut", price: 800, img: "assets/img/style-7.jpg", tag: "Bold" },
    { id: "h9", name: "Undercut", price: 750, img: "assets/img/style-10.jpg", tag: "Sharp" },
    { id: "h10", name: "King Package (Hair + Beard)", price: 1000, img: "assets/img/style-9.jpg", tag: "Premium" }
  ],
  barbers: [
    { name: "Zain Ali", role: "Master Barber / Owner", exp: "12 yrs", img: "assets/img/chair.jpg" },
    { name: "Bilal Khan", role: "Fade Specialist", exp: "8 yrs", img: "assets/img/gal-2.jpg" },
    { name: "Hamza Yousaf", role: "Beard & Shave Artist", exp: "6 yrs", img: "assets/img/beard.jpg" }
  ],
  testimonials: [
    { name: "Usman R.", text: "Best fade in Lahore. Zain actually listens and the hot towel shave is unreal.", stars: 5 },
    { name: "Daniyal A.", text: "Been coming for 2 years. Consistent every single visit, never a bad cut.", stars: 5 },
    { name: "Farhan S.", text: "Took my son for his first haircut — so gentle. Great vibe, fair prices.", stars: 4 }
  ],
  stats: [
    { value: 15000, suffix: "+", label: "Happy Clients" },
    { value: 12, suffix: " yrs", label: "Experience" },
    { value: 4.9, suffix: "★", label: "Google Rating" },
    { value: 25, suffix: "+", label: "Styles Menu" }
  ],
  gallery: [
    "assets/img/gal-1.jpg", "assets/img/gal-2.jpg", "assets/img/gal-3.jpg",
    "assets/img/gal-4.jpg", "assets/img/about.jpg", "assets/img/chair.jpg",
    "assets/img/shave.jpg", "assets/img/beard.jpg"
  ],
  admin: {
    password: "royalcuts2026"
  }
};

/* Merge owner overrides saved from the admin dashboard */
window.get_config = function () {
  try {
    const raw = localStorage.getItem("rc_config");
    if (!raw) return window.DEFAULT_CONFIG;
    const saved = JSON.parse(raw);
    const out = JSON.parse(JSON.stringify(window.DEFAULT_CONFIG));
    const deep = (t, s) => {
      for (const k of Object.keys(s)) {
        if (s[k] && typeof s[k] === "object" && !Array.isArray(s[k]) && t[k] && typeof t[k] === "object" && !Array.isArray(t[k])) deep(t[k], s[k]);
        else t[k] = s[k];
      }
    };
    deep(out, saved);
    return out;
  } catch (e) {
    return window.DEFAULT_CONFIG;
  }
};
