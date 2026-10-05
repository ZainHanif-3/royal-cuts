# Software Requirements Specification (SRS)
## Royal Cuts — Barber & Grooming Studio Website

| Field | Value |
|---|---|
| Project | Royal Cuts Website + Owner Dashboard |
| Client / Owner | Zain Hanif |
| Vendor | ZN DEVELOPER |
| Version | 1.0 |
| Date | 2026-10-04 |
| Status | Approved for build |
| Repository | https://github.com/ZainHanif-3 |

---

## 1. Introduction

### 1.1 Purpose
This document defines the complete functional and non-functional requirements for the Royal Cuts website: a public-facing marketing and booking site for a barber shop in Lahore, Pakistan, plus a private owner dashboard that lets the owner edit pictures, prices, text and design without touching code.

### 1.2 Product Scope
- **Public site:** single-page responsive website showcasing services, hairstyle gallery, full price list, portfolio gallery, team, testimonials, contact and booking.
- **Owner dashboard:** password-protected panel where the owner changes images, prices, wording, contact details, theme colours and layout content.
- **Publishing:** changes are stored in the browser and exportable as `config.json`, which overrides the built-in defaults for all visitors.

### 1.3 Definitions
- **PKR / Rs** — Pakistani Rupee, the currency for all prices.
- **Config** — a single JSON object (`config.json`) holding all editable content.
- **Owner override** — an edit saved by the owner in the admin panel.

---

## 2. Overall Description

### 2.1 Product Perspective
Static, framework-free web application (HTML5, CSS3, vanilla JavaScript). No build step required. Hostable on any static host (GitHub Pages, Netlify, cPanel). Content is data-driven: the DOM is rendered from a configuration object rather than hard-coded markup.

### 2.2 User Classes

| Role | Access | Goals |
|---|---|---|
| Visitor (potential client) | Public pages | Discover services/prices, view styles, book an appointment |
| Shop Owner | `admin.html` + password | Change pictures, prices, text, colours; keep site current |
| Search Engine | Public pages | Index the site, surface it in local search |
| Developer (ZN DEVELOPER) | Repository | Maintain features, deploy updates |

### 2.3 Operating Environment
- Browsers: Chrome, Edge, Firefox, Safari — latest 2 versions (ES2020+, CSS custom properties, IntersectionObserver).
- Viewports: 360 px → 2560 px, responsive at 640 / 900 / 1080 px breakpoints.
- Server: any static file server; optional Node.js ≥ 18 for the bundled API server.
- Internet required only for Google Maps embed, WhatsApp deep-link and remote images.

---

## 3. Functional Requirements

### FR-1 Public Website

| ID | Requirement | Priority |
|---|---|---|
| FR-1.1 | Display a full-viewport hero with headline, sub-text, badge, background image and two call-to-action buttons. | High |
| FR-1.2 | Render **all** services as cards showing image, name, description and price in PKR. | High |
| FR-1.3 | Render **all** hairstyles as image cards with name, tag and price in PKR. | High |
| FR-1.4 | Display a complete two-column saloon price list covering every service and hairstyle. | High |
| FR-1.5 | Display a masonry gallery of studio/work images with hover effect. | Medium |
| FR-1.6 | Display barber team cards (name, role, experience, photo). | Medium |
| FR-1.7 | Display client testimonials with star ratings. | Medium |
| FR-1.8 | Display animated business statistics counters. | Medium |
| FR-1.9 | Show contact details: phone, WhatsApp, email, address, hours, embedded map. | High |
| FR-1.10 | Accept a booking form (name, phone, service, date, time, notes) and hand it off to WhatsApp with a pre-filled message. | High |
| FR-1.11 | Provide a floating WhatsApp action button on every screen. | Medium |
| FR-1.12 | Be fully responsive with a mobile slide-in navigation menu. | High |

**Price validation:** all prices are integers ≥ 0, displayed as `Rs 1,234` using Pakistani locale grouping.

### FR-2 Owner Dashboard (`admin.html`)

| ID | Requirement | Priority |
|---|---|---|
| FR-2.1 | Require a password before any content is shown or edited. | High |
| FR-2.2 | Owner can change brand name, logo letters and taglines. | High |
| FR-2.3 | Owner can change hero headline, sub-text, badge, buttons and **hero picture** (URL or file upload). | High |
| FR-2.4 | Owner can change **theme colours** (4 colour pickers + 6 one-click presets). | High |
| FR-2.5 | Owner can add, edit, delete, reorder and mark-as-popular any **service** (name, description, price, image). | High |
| FR-2.6 | Owner can add, edit, delete, reorder any **hairstyle** card (name, tag, price, image). | High |
| FR-2.7 | Owner can add/remove **gallery** pictures. | Medium |
| FR-2.8 | Owner can add/edit/delete **barbers**. | Medium |
| FR-2.9 | Owner can edit phone, WhatsApp, email, address, hours and map embed. | High |
| FR-2.10 | Owner can replace any card image by uploading a file (large files stored as data URL inside config). | High |
| FR-2.11 | Owner can **save** changes (persisted to browser storage and applied to the live site instantly). | High |
| FR-2.12 | Owner can **download** the full configuration as `config.json` for permanent versioned publishing. | High |
| FR-2.13 | Owner can **import** a previously exported `config.json`. | Medium |
| FR-2.14 | Owner can **reset** everything to the delivered defaults. | Medium |
| FR-2.15 | Owner can change the admin password. | High |
| FR-2.16 | Dashboard shows KPIs: service count, hairstyle count, average price, price range. | Low |
| FR-2.17 | Unsaved changes trigger a browser warning on exit. | Low |

### FR-3 Content Resolution
Priority order (highest wins):
1. Owner's browser override (`localStorage.rc_config`)
2. Published `config.json` in the site root
3. Built-in defaults in `js/config.js`

### FR-4 Documentation
| ID | Requirement | Priority |
|---|---|---|
| FR-4.1 | Deliver this SRS. | High |
| FR-4.2 | Deliver a Design Document (visual system, motion, IA). | High |

---

## 4. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | Performance | Hero image lazy-safe; all content images use `loading="lazy"`; first contentful render < 1.5 s on 4G. |
| NFR-2 | Performance | No external JS framework; total JS < 60 KB uncompressed. |
| NFR-3 | Accessibility | Semantic HTML, labelled form inputs, `aria-label` on icon controls, `prefers-reduced-motion` disables animation. |
| NFR-4 | Compatibility | Works on current Chrome/Edge/Firefox/Safari; graceful degradation without JS is not required for booking, but core content lives in JS-rendered DOM. |
| NFR-5 | Security | Admin password stored in config; sessions in `sessionStorage`; admin page carries `noindex,nofollow`; no secrets committed. |
| NFR-6 | Security | No external tracking, no third-party analytics scripts. |
| NFR-7 | Usability | Owner completes a price change in ≤ 3 clicks from login. |
| NFR-8 | Maintainability | Single source of truth (`config.json`); no duplicated content between pages. |
| NFR-9 | Localisation | Prices in PKR; content language English (Urdu-ready structure). |
| NFR-10 | Reliability | Invalid/corrupt override in browser falls back to defaults without breaking the page. |

---

## 5. External Interfaces

| Interface | Direction | Detail |
|---|---|---|
| WhatsApp deep link | Outbound | `https://wa.me/<number>?text=<encoded booking>` |
| Google Maps embed | Outbound | iframe, grayscale/inverted styling |
| File upload | Inbound | `FileReader` → data URL (images > 900 KB) |
| Config export/import | Inbound/Outbound | JSON, `application/json` |
| localStorage | Browser | keys `rc_config`, `rc_admin_session` |

---

## 6. Data Model

```
config
├── brand        { name, tagline, tagline2, logoMark }
├── hero         { headline, sub, image, ctaPrimary, ctaSecondary, badge }
├── theme        { accent, accent2, dark, surface }
├── contact      { phone, phoneLink, email, address, hours, whatsapp, mapEmbed }
├── services[]   { id, name, desc, price, img, popular }
├── hairstyles[] { id, name, price, img, tag }
├── barbers[]    { name, role, exp, img }
├── testimonials[]{ name, text, stars }
├── stats[]      { value, suffix, label }
├── gallery[]    string
└── admin        { password }
```

---

## 7. Constraints & Assumptions
1. Owner has basic computer literacy and access to the browser used to make edits.
2. Permanent multi-device syncing of owner edits requires the optional Node API or committing `config.json` to the repository — the browser-only path is per-device.
3. Booking is handled through WhatsApp; no payment gateway or database is in scope for v1.0.
4. Photographs are royalty-free stock (Unsplash License) with an option for the owner to upload the shop's own photos.
5. Social links in the footer are placeholders until the owner supplies real profile URLs.

---

## 8. Acceptance Criteria

| # | Criterion | Verification |
|---|---|---|
| AC-1 | Site loads with no console errors | Browser console clean on home/admin |
| AC-2 | Every service and hairstyle card shows a PKR price | Visual + config inspection |
| AC-3 | Prices span Rs 100 – Rs 1000 as ordered | Config inspection |
| AC-4 | Admin rejects wrong password, accepts correct one | Login test |
| AC-5 | Editing a price + Save updates the public site | Edit → save → reload public |
| AC-6 | Image upload replaces a card picture | Upload → save → reload |
| AC-7 | Theme colour change restyles the site instantly | Colour picker test |
| AC-8 | Booking form opens WhatsApp with pre-filled details | Submit test |
| AC-9 | Site is usable at 360 px width | Mobile emulation |
| AC-10 | `config.json` export downloads and re-imports cleanly | Round-trip test |
| AC-11 | Supervisor QA returns PASS | Independent review |

---

## 9. Deliverables
1. `index.html`, `admin.html`, `css/`, `js/`, `assets/img/` — runnable website
2. `config.json` — published content configuration
3. `docs/SRS.md` — this document
4. `docs/DESIGN.md` — design document
5. `README.md` — run/own instructions
6. `screenshots/` — desktop + mobile captures
7. Public GitHub repository

**End of SRS v1.0**
