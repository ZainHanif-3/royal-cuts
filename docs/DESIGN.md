# Design Document
## Royal Cuts — Barber & Grooming Studio

**Version:** 1.0 · **Date:** 2026-10-04 · **Design by:** ZN DEVELOPER (Zain Hanif)

---

## 1. Design Vision

A **dark-luxury barbershop** aesthetic: near-black surfaces, brushed-gold accents, cinematic photography and continuous 3D motion that makes the page feel like a physical, premium space — not a flat brochure. The barber pole is reinterpreted as a real 3D object rather than a static icon.

**Tone:** confident, masculine, premium but approachable. Prices are always visible — transparency is part of the brand.

---

## 2. Information Architecture

```
┌ NAV (sticky, glass on scroll) ────────────────────────────────┐
│ Brand · Home · Services · Hairstyles · Price List · Gallery   │
│ Team · Book · [Book Now]                        ☰ (mobile)   │
└───────────────────────────────────────────────────────────────┘
 1  HERO          full-screen, 3D barber pole + floating tools
 2  STATS         4 animated counters
 3  SERVICES      12 cards · images · PKR prices · "Popular" flag
 4  HAIRSTYLES    10 tall cards · tag · PKR price · tap-to-book
 5  PRICE LIST    2 columns — "Hair & Shave" / "Beard, Skin & Care"
 6  GALLERY       masonry, 8 images, hover reveal
 7  TEAM          3 barber cards
 8  TESTIMONIALS  3 review cards with stars
 9  BOOKING       form (left) + contact tiles & map (right)
10  FOOTER        4 columns · links · contact · credits
    FAB           floating WhatsApp button (always visible)
```

Single-page architecture with hash anchors — every CTA lands on `#booking`.

---

## 3. Colour System

| Token | Default | Role |
|---|---|---|
| `--accent` | `#e8b923` | Gold — prices, highlights, active states |
| `--accent2` | `#ff7a18` | Ember — gradient partner |
| `--dark` | `#0b0b0f` | Page background |
| `--surface` | `#14141b` | Cards / panels |
| `--surface2` | `#1c1c26` | Elevated tiles |
| `--line` | `rgba(255,255,255,.08)` | Hairline borders |
| `--text` | `#f4f4f6` | Primary text |
| `--muted` | `#9a9aa8` | Secondary text |

**Primary gradient:** `linear-gradient(135deg, #e8b923, #ff7a18)` — used on CTAs, price tags, barber avatars.

**Owner-editable:** all four core colours are exposed in the admin panel with six one-click presets (Classic Gold, Neon Ice, Crimson, Emerald, Amber, Magenta).

---

## 4. Typography & Scale

| Use | Spec |
|---|---|
| Font stack | `"Segoe UI", system-ui, -apple-system, Roboto, sans-serif` |
| Hero headline | `clamp(40px, 6.4vw, 82px)` / weight 900 / `-0.03em` |
| Section title | `clamp(30px, 4.4vw, 50px)` / weight 900 |
| Section kicker | 12.5px / 800 / `0.22em` uppercase / accent colour |
| Card title | 19px / 700 |
| Body | 15–17px / 1.6 line-height |
| Price numerals | 21–22px / 900 / accent |

Prices render as **`Rs 1,234`** via `Intl.NumberFormat` locale `en-PK`.

---

## 5. Layout System

- Container: `width: min(1200px, 92vw)`.
- Grids: 4-col (services, stats), 3-col (team, testimonials), 2-col (price list, booking), auto-fill (gallery).
- Section rhythm: `96px` vertical padding (68px on mobile).
- Breakpoints: **1080px** (4→2 col, gallery 4→3), **900px** (hero stacks, nav→drawer, 3→2 col), **640px** (single column everywhere).

---

## 6. Motion System ("3D")

### 6.1 Depth model
`.tilt` elements declare `transform-style: preserve-3d` inside a `perspective: 1400px` context. Children use `translateZ()` to pop layers (image 30–40px, content 28–50px, price badges 48px).

### 6.2 Interactive tilt
On `mousemove` over any card:
```
rotateY = (px - 0.5) × 22deg
rotateX = (0.5 - py) × 22deg
translateZ 14px · scale 1.03
```
A radial highlight follows the cursor via `--mx/--my` custom properties (`::before` overlay). On `mouseleave` the transform resets with a 0.5 s eased transition. Bound via `MutationObserver` so dynamically rendered cards are auto-wired.

### 6.3 Signature elements

| Element | Technique |
|---|---|
| **3D barber pole** | Cylindrical card; inner stripe uses `repeating-linear-gradient(-45deg)` with `background-size: 100% 147px` animated to `0 147px` = infinite spiral. Floats + `rotateY(-16°→16°)` over 7 s. |
| **Gold caps** | Elliptical gradients on top/bottom of the pole. |
| **Floating tools** | 4 glassmorphic tiles (`backdrop-filter: blur`) with staggered `floaty` keyframes (translateY ±24px, rotate ±8°). |
| **Hero parallax** | Mouse position drives hero-visual `rotateY/rotateX` and background counter-translate. |
| **Headline shine** | Gradient text with `background-size: 220%` animated for a moving-metal effect. |
| **Logo mark** | `markSpin` — rotates 180° on Y every 6 s. |
| **Reveal on scroll** | `IntersectionObserver` adds `.in`: `translateY(46px) rotateX(-8deg)` → identity, staggered 70 ms per item. |
| **Counters** | `requestAnimationFrame` ease-out cubic over 1.5 s. |
| **Stat tiles** | Underline sweeps `scaleX(0→1)` on hover. |
| **Nav** | Transparent → blurred glass after 40 px scroll. |

`prefers-reduced-motion: reduce` collapses all animation/transition durations to ~0.

---

## 7. Component Specifications

### 7.1 Service card
```
┌────────────────────────────┐
│  [Popular ribbon]   Rs 500 │  ← image, 178px, zooms 1.11 + translateZ(30)
│  (gradient veil)           │
├────────────────────────────┤
│ Fade Haircut               │  ← content layer, translateZ(28)
│ Skin, taper or low fade…   │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│ Rs 500 / service   Book →  │  ← dashed divider
└────────────────────────────┘
```
Price badge: gold pill, `translateZ(48px)` so it floats above the image.

### 7.2 Hairstyle card
`aspect-ratio: 3/4`, image fills, bottom veil gradient, top-left tag chip, bottom row = name + `style-price` + circular `+` button that rotates 90° and scales on hover. **Whole card is clickable** → pre-selects that style in the booking form and smooth-scrolls to it.

### 7.3 Price row
`name · flexible dotted leader · price` — classic menu pattern with `border-bottom: 2px dotted` and flex spacer.

### 7.4 Booking form
Fields: name, phone, service (grouped `<optgroup>` = Services / Hairstyles with inline prices), date, time, notes. Validation → builds a URL-encoded WhatsApp message → `window.open`. Success banner includes a manual fallback link.

### 7.5 Admin components
- **Login card** — centred, gold radial glow, noindex.
- **Sidebar** — 268px sticky, 8 tabs, active state = gold gradient border.
- **KPI row** — 4 tiles: services, hairstyles, average price, price range.
- **List item** — `96px thumb | 3-col field grid | tool buttons` with inline file input for instant picture swap; hover reveals "change picture".
- **Toast** — bottom-centre gold pill, 2.4 s auto-dismiss.

---

## 8. Imagery

| Group | Count | Source |
|---|---|---|
| Hero / studio / services | 8 | Unsplash (Unsplash License — free commercial use) |
| Hairstyle cards | 10 | Unsplash |
| Gallery | 8 (reuses studio set) | Unsplash |

All downloaded at `w=900&q=75` JPEG for web. Every image path is config-driven — the owner can swap any of them from the dashboard, including uploading their own photos (large files stored as data URLs inside `config.json`).

**Treatment:** hero uses `brightness(.42) saturate(.85)` + dual radial/linear overlay so text stays legible; cards use bottom-up veils; gallery uses saturation boost on hover.

---

## 9. Responsive Behaviour

| Width | Adjustments |
|---|---|
| ≤1080 | Services 4→2, gallery 4→3, footer 4→2 |
| ≤900 | Hero single column (visual first), nav → right drawer + burger, price list/booking single column |
| ≤640 | All grids single column, gallery 2-up, footer stacked, section padding 68px |

Touch devices: tilt is naturally inert (no mousemove), cards still scale/zoom on `:hover` equivalents; hairstyle cards remain tap-to-book.

---

## 10. Accessibility

- Landmarks: `header`, `nav`, `section`, `form`, `footer`.
- All inputs wrapped in `<label>`; icon-only buttons carry `aria-label`.
- Focus rings: `3px` accent glow on inputs.
- Colour contrast: body text `#f4f4f6` on `#0b0b0f` ≈ 17:1; muted `#9a9aa8` ≈ 7.4:1.
- `prefers-reduced-motion` respected globally.
- Images carry meaningful `alt` text.

---

## 11. Performance Budget

| Asset | Budget |
|---|---|
| HTML | ~14 KB |
| CSS (site + admin) | ~32 KB |
| JS (config + main + admin) | ~40 KB |
| Images (20 × ~140 KB avg) | ~2.8 MB, lazy-loaded below fold |
| Frameworks | **none** |
| Third-party requests | Google Maps iframe (lazy) only |

---

## 12. Design → Requirement Traceability

| Design element | Requirement |
|---|---|
| Service + hairstyle card grids | FR-1.2, FR-1.3 |
| Two-column price menu | FR-1.4 |
| Booking form → WhatsApp | FR-1.10 |
| Colour pickers + presets | FR-2.4 |
| Inline image swap on cards | FR-2.10 |
| Config export/import | FR-2.12, FR-2.13 |
| Reduced-motion block | NFR-3 |
| Lazy images + no framework | NFR-1, NFR-2 |

**End of Design Document v1.0**
