# MCG Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the global CSS to the new Oswald + Manrope design system and build out four inner pages (Services, About, Contact, Markets) in English, with Markets stub pages added for Georgian and Russian.

**Architecture:** Full CSS rewrite in-place (single `style.css`); per-page Nunjucks templates extending existing `base.njk`; all copy in per-language JSON data files; shared service-detail partial to avoid template duplication across 5 sub-pages.

**Tech Stack:** Eleventy 11ty, Nunjucks, plain CSS, Leaflet.js (map), Google Fonts (Oswald + Manrope). Build: `npm run build`. Dev: `npm run start`.

---

## File Map

| Action | File |
|---|---|
| **Rewrite** | `src/assets/css/style.css` |
| **Modify** | `src/_includes/base.njk` |
| **Modify** | `src/en/en.11tydata.js` |
| **Modify** | `src/ka/ka.11tydata.js` |
| **Modify** | `src/ru/ru.11tydata.js` |
| **Modify** | `src/_data/en.json` (add services_hub, services_detail, about_page, contact_page, markets_page, Lithuania) |
| **Modify** | `src/_data/ka.json` (add markets_page, Lithuania) |
| **Modify** | `src/_data/ru.json` (add markets_page, Lithuania) |
| **Rewrite** | `src/en/services.njk` |
| **Create** | `src/_includes/service-detail-body.njk` |
| **Rewrite** | `src/en/services/new-partner-acquisition.njk` |
| **Rewrite** | `src/en/services/existing-partner-management.njk` |
| **Rewrite** | `src/en/services/marketing-services.njk` |
| **Rewrite** | `src/en/services/foreign-companies.njk` |
| **Rewrite** | `src/en/services/additional-services.njk` |
| **Rewrite** | `src/en/about.njk` |
| **Rewrite** | `src/en/contact.njk` |
| **Create** | `src/en/markets.njk` |
| **Create** | `src/ka/markets.njk` |
| **Create** | `src/ru/markets.njk` |
| **Unchanged** | `src/en/index.njk`, `src/en/book.njk`, all `src/ka/*.njk` except markets, all `src/ru/*.njk` except markets |

---

## Task 1: CSS Rewrite

**Files:**
- Rewrite: `src/assets/css/style.css`

- [ ] **Step 1: Replace `style.css` with new design system**

Replace the entire contents of `src/assets/css/style.css` with:

```css
/* ============================================================
   MCG — Global Stylesheet
   Oswald (headings, uppercase) + Manrope (body)
   Dark: #101820 | Brand: #009ACE | Sections: white / #F5F7FA
============================================================ */

:root {
  --dark:          #101820;
  --dark-mid:      #1A2535;
  --brand:         #009ACE;
  --brand-dim:     rgba(0,154,206,.14);
  --light:         #F5F7FA;
  --white:         #FFFFFF;
  --text:          #1A2535;
  --text-muted:    #5A7184;
  --text-inv:      #EAF2FB;
  --text-inv-muted:rgba(234,242,251,.62);
  --border:        #DDE3EA;
  --radius:        6px;
  --max:           1120px;
}

*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }

body {
  font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif;
  background: var(--white);
  color: var(--text);
  line-height: 1.6;
}

a { color: inherit; text-decoration: none; }
.container { max-width: var(--max); margin: 0 auto; padding: 0 24px; }

/* ============================================================
   Typography — Oswald for all headings
============================================================ */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Oswald', ui-sans-serif, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  line-height: 1.1;
  margin: 0;
}

/* ============================================================
   Navigation
============================================================ */
.nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--dark);
  border-bottom: 1px solid rgba(0,154,206,.12);
  transition: box-shadow .22s ease;
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  gap: 16px;
  transition: padding .22s ease;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 180px;
}

.brand img {
  height: 88px;
  width: auto;
  display: block;
  transition: height .22s ease;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
}

.nav-links a {
  font-family: 'Oswald', sans-serif;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-inv-muted);
  padding: 8px 12px;
  border-radius: 3px;
  transition: color .18s ease, background .18s ease;
}

.nav-links a:hover {
  color: var(--text-inv);
  background: rgba(255,255,255,.06);
}

.nav-links a.active { color: var(--brand); }

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav.is-scrolled .nav-inner { padding: 7px 0; }
.nav.is-scrolled .brand img { height: 62px; }
.nav.is-scrolled {
  box-shadow: 0 4px 24px rgba(0,0,0,.45);
  border-bottom-color: rgba(0,154,206,.20);
}

/* Hamburger */
.nav-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  padding: 6px;
  border: 1px solid rgba(0,154,206,.22);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
}

.nav-toggle span {
  display: block;
  height: 1.5px;
  background: var(--text-inv);
  border-radius: 99px;
  transition: transform .2s ease, opacity .2s ease;
}

.nav.nav-open .nav-toggle span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.nav.nav-open .nav-toggle span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.nav.nav-open .nav-toggle span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

/* ============================================================
   Buttons
============================================================ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 22px;
  border-radius: 4px;
  border: 1px solid rgba(0,154,206,.38);
  background: transparent;
  font-family: 'Oswald', sans-serif;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand);
  transition: background .18s ease, border-color .18s ease;
  cursor: pointer;
}

.btn:hover {
  background: var(--brand-dim);
  border-color: var(--brand);
}

.btn-primary {
  background: var(--brand);
  border-color: var(--brand);
  color: #fff;
}

.btn-primary:hover {
  background: #007faa;
  border-color: #007faa;
}

/* ============================================================
   Language switcher
============================================================ */
.lang {
  display: flex;
  gap: 6px;
  align-items: center;
}

.lang a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 24px;
  border-radius: 3px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.04);
  padding: 2px;
  transition: border-color .18s ease;
}

.lang a:hover { border-color: rgba(0,154,206,.45); }
.lang a.active { border-color: var(--brand); }

.lang img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px;
  display: block;
}

/* ============================================================
   Hero — shared base (dark background)
============================================================ */
.hero {
  background: var(--dark);
  padding: 90px 0 70px;
  position: relative;
  color: var(--text-inv);
}

/* Homepage hero: full-height, bg photo */
body.home-page .hero {
  min-height: calc(100vh - 90px);
  display: flex;
  align-items: center;
  padding: 100px 0 80px;
  background-image: url("../img/home-bg.png");
  background-repeat: no-repeat;
  background-size: 75% auto;
  background-position: 85% 55%;
}

body.home-page .hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(16,24,32,.92) 0%,
    rgba(16,24,32,.72) 38%,
    rgba(16,24,32,.25) 66%,
    rgba(16,24,32,.06) 100%
  );
  pointer-events: none;
  z-index: 0;
}

body.home-page .hero > .container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: var(--max);
  padding-left: 48px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  max-width: 680px;
}

.h1 {
  font-family: 'Oswald', sans-serif;
  font-size: 72px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  line-height: 1.0;
  color: var(--text-inv);
  margin: 0 0 20px;
  white-space: pre-line;
}

.kicker {
  display: block;
  font-family: 'Oswald', sans-serif;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--brand);
  margin-bottom: 12px;
}

.lead {
  font-family: 'Manrope', sans-serif;
  font-size: 16px;
  color: var(--text-inv-muted);
  line-height: 1.7;
  max-width: 56ch;
  margin: 0 0 28px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* ============================================================
   Inner page hero (.page-hero) and legacy (.page-title)
   Both render the same way — dark, ~280px, no bg photo
============================================================ */
.page-hero,
.page-title {
  background: var(--dark);
  padding: 56px 0 48px;
  border-bottom: 1px solid rgba(0,154,206,.10);
}

.page-hero h1,
.page-title h1 {
  font-family: 'Oswald', sans-serif;
  font-size: 44px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--text-inv);
  margin: 0 0 10px;
}

.page-hero p,
.page-title p {
  font-family: 'Manrope', sans-serif;
  font-size: 15px;
  color: var(--text-inv-muted);
  margin: 0;
  max-width: 60ch;
  line-height: 1.6;
}

/* ============================================================
   Section layouts
============================================================ */
.section        { padding: 72px 0; background: var(--white); }
.section--light { padding: 72px 0; background: var(--light); }
.section--dark  { padding: 72px 0; background: var(--dark-mid); }

.section-label {
  display: block;
  font-family: 'Oswald', sans-serif;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--brand);
  margin-bottom: 10px;
}

.section-heading {
  font-family: 'Oswald', sans-serif;
  font-size: 36px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--text);
  margin: 0 0 6px;
}

.section-heading--inv { color: var(--text-inv); }

.section-rule {
  width: 40px;
  height: 3px;
  background: var(--brand);
  margin: 12px 0 24px;
}

.section-sub {
  font-family: 'Manrope', sans-serif;
  font-size: 15px;
  color: var(--text-muted);
  margin: 0 0 40px;
  max-width: 58ch;
  line-height: 1.7;
}

.section-sub--inv { color: var(--text-inv-muted); }

/* ============================================================
   Stats band (dark-mid)
============================================================ */
.stats-band {
  background: var(--dark-mid);
  padding: 52px 0;
  border-top: 1px solid rgba(255,255,255,.05);
  border-bottom: 1px solid rgba(255,255,255,.05);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  text-align: center;
}

.stat-item {
  padding: 16px;
  position: relative;
}

.stat-item + .stat-item {
  border-left: 1px solid rgba(255,255,255,.08);
}

.stat-value {
  font-family: 'Oswald', sans-serif;
  font-size: 52px;
  font-weight: 500;
  color: var(--brand);
  line-height: 1;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.stat-label {
  font-family: 'Manrope', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-inv-muted);
  text-transform: uppercase;
  letter-spacing: 0.10em;
}

/* ============================================================
   Service card grids
============================================================ */
.svc-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  background: var(--border);
}

.svc-grid--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.svc-grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }

.svc-card {
  background: var(--white);
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  transition: background .18s ease;
}

.svc-card h3 {
  font-family: 'Oswald', sans-serif;
  font-size: 15px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text);
  margin: 0;
}

.svc-card p {
  font-family: 'Manrope', sans-serif;
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.65;
}

/* Text variant: homepage service cards */
.svc-card--text {
  border-top: 3px solid var(--brand);
  min-height: 160px;
  justify-content: flex-start;
}

/* Link variant: services hub cards */
.svc-card--link {
  border-top: 3px solid var(--border);
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.svc-card--link:hover {
  background: var(--light);
  border-top-color: var(--brand);
}

.card-arrow {
  font-size: 18px;
  color: var(--brand);
  margin-top: auto;
  line-height: 1;
  transition: transform .18s ease;
}

.svc-card--link:hover .card-arrow {
  transform: translateX(4px);
}

/* ============================================================
   Service detail pages
============================================================ */
.service-detail {
  max-width: 760px;
}

.service-detail p {
  font-family: 'Manrope', sans-serif;
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.8;
  margin: 0 0 18px;
}

.included-list {
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
}

.included-list li {
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  color: var(--text);
  padding: 13px 0 13px 22px;
  border-bottom: 1px solid var(--border);
  position: relative;
}

.included-list li:first-child { border-top: 1px solid var(--border); }

.included-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 2px;
  background: var(--brand);
}

/* ============================================================
   About teaser (homepage card)
============================================================ */
.about-teaser h2 {
  font-family: 'Oswald', sans-serif;
  font-size: 34px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--text);
  margin: 0 0 14px;
}

.about-teaser p {
  font-family: 'Manrope', sans-serif;
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.8;
  margin: 0 0 24px;
  max-width: 68ch;
}

/* ============================================================
   About page
============================================================ */
.about-intro p {
  font-family: 'Manrope', sans-serif;
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.85;
  margin: 0 0 18px;
  max-width: 760px;
}

.credentials-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--border);
}

.credential-item {
  background: var(--light);
  padding: 36px 20px;
  text-align: center;
}

.credential-value {
  font-family: 'Oswald', sans-serif;
  font-size: 48px;
  font-weight: 500;
  color: var(--brand);
  line-height: 1;
  margin-bottom: 8px;
}

.credential-label {
  font-family: 'Manrope', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.10em;
}

.what-we-bring-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border);
}

.bring-card {
  background: var(--white);
  padding: 32px 28px;
  border-top: 3px solid var(--border);
}

.bring-card:first-child { border-top-color: var(--brand); }

.bring-card h3 {
  font-family: 'Oswald', sans-serif;
  font-size: 15px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text);
  margin: 0 0 12px;
}

.bring-card p {
  font-family: 'Manrope', sans-serif;
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.75;
  margin: 0;
}

/* ============================================================
   Process grid (homepage)
============================================================ */
.process-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--border);
}

.phase-card {
  background: var(--white);
  padding: 32px 28px;
  border-top: 3px solid var(--border);
}

.phase-card:first-child { border-top-color: var(--brand); }

.phase-number {
  font-family: 'Oswald', sans-serif;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--brand);
  margin-bottom: 14px;
}

.phase-title {
  font-family: 'Oswald', sans-serif;
  font-size: 15px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text);
  margin: 0 0 10px;
}

.phase-desc {
  font-family: 'Manrope', sans-serif;
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0;
}

/* ============================================================
   Markets section (dark band — homepage)
============================================================ */
.markets-section {
  background: var(--dark-mid);
  padding: 72px 0;
}

.markets-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.country-tag {
  font-family: 'Manrope', sans-serif;
  font-size: 13px;
  color: var(--text-inv-muted);
  padding: 6px 14px;
  border-radius: 2px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.04);
  transition: border-color .15s ease, color .15s ease;
}

.country-tag:hover {
  border-color: rgba(0,154,206,.40);
  color: var(--text-inv);
}

/* Light-background variant — used on the Markets page (white section) */
.country-tag--light {
  color: var(--text-muted);
  border-color: var(--border);
  background: var(--white);
}

.country-tag--light:hover {
  border-color: var(--brand);
  color: var(--text);
  background: var(--light);
}

/* ============================================================
   CTA band (brand blue)
============================================================ */
.cta-band {
  background: var(--brand);
  padding: 80px 0;
  text-align: center;
}

.cta-band h2 {
  font-family: 'Oswald', sans-serif;
  font-size: 44px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #fff;
  margin: 0 0 14px;
}

.cta-band p {
  font-family: 'Manrope', sans-serif;
  font-size: 16px;
  color: rgba(255,255,255,.85);
  margin: 0 0 32px;
  line-height: 1.65;
}

.cta-band .btn-primary {
  background: var(--dark);
  border-color: var(--dark);
  color: #fff;
  font-size: 14px;
  padding: 12px 28px;
}

.cta-band .btn-primary:hover {
  background: #0d1520;
  border-color: #0d1520;
}

/* ============================================================
   Contact page
============================================================ */
.contact-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-family: 'Oswald', sans-serif;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text);
}

.form-group input,
.form-group textarea,
.form-group select {
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  color: var(--text);
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 10px 14px;
  outline: none;
  transition: border-color .18s ease;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: var(--brand);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.contact-details-block { display: flex; flex-direction: column; }

.contact-detail-item {
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}

.contact-detail-item:first-child { border-top: 1px solid var(--border); }

.detail-label {
  display: block;
  font-family: 'Oswald', sans-serif;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--brand);
  margin-bottom: 4px;
}

.contact-detail-item a {
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  color: var(--text);
  transition: color .15s ease;
}

.contact-detail-item a:hover { color: var(--brand); }

/* ============================================================
   Markets page map
============================================================ */
#mcg-map {
  height: 480px;
  border-radius: 4px;
  border: 1px solid var(--border);
  z-index: 0;
  margin-bottom: 32px;
}

.mcg-marker { background: transparent; border: none; }

.mcg-marker-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--brand);
  border: 2px solid #fff;
  box-shadow: 0 0 8px rgba(0,154,206,.8);
}

.leaflet-popup-content-wrapper {
  background: var(--dark-mid) !important;
  border: 1px solid rgba(0,154,206,.40) !important;
  border-radius: 4px !important;
  box-shadow: 0 4px 20px rgba(0,0,0,.4) !important;
  color: var(--text-inv) !important;
}

.leaflet-popup-content strong {
  color: var(--brand);
  font-family: 'Oswald', sans-serif;
  font-size: 14px;
  font-weight: 500;
}

.leaflet-popup-content span { font-size: 12px; opacity: .75; }
.leaflet-popup-tip { background: var(--dark-mid) !important; }
.leaflet-popup-close-button { color: rgba(0,154,206,.7) !important; }

/* ============================================================
   Footer
============================================================ */
.footer {
  background: var(--dark);
  padding: 32px 0 40px;
  border-top: 3px solid var(--brand);
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.footer,
.footer a {
  font-family: 'Manrope', sans-serif;
  font-size: 13px;
  color: var(--text-inv-muted);
}

.footer a:hover { color: var(--brand); }

/* ============================================================
   Generic card (legacy — used by KA/RU inner pages)
============================================================ */
.card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px;
}

.list ul { margin: 0; padding-left: 20px; color: var(--text-muted); }
.list li { margin: 10px 0; font-size: 14px; font-family: 'Manrope', sans-serif; }

/* contact-grid used by KA/RU contact pages */
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.contact-item small {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .8px;
  text-transform: uppercase;
  color: var(--brand);
  margin-bottom: 4px;
  font-family: 'Oswald', sans-serif;
}
.contact-item a { text-decoration: underline; text-decoration-color: rgba(0,154,206,.40); }

/* iframe (book page) */
.iframe-wrap { overflow: hidden; }
.iframe-wrap iframe {
  width: 100%;
  height: 780px;
  border: 0;
  border-radius: 8px;
  background: #fff;
}

/* ============================================================
   Responsive
============================================================ */
@media (max-width: 980px) {
  .svc-grid           { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .svc-grid--3        { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .what-we-bring-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
}

@media (max-width: 920px) {
  .nav-links  { display: none; }
  .nav-toggle { display: flex; }
  .brand      { min-width: auto; }
  .brand img  { height: 72px; }
  .nav.is-scrolled .brand img { height: 54px; }

  .nav.nav-open .nav-links {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    gap: 2px;
    padding: 10px 16px 14px;
    background: var(--dark);
    border-bottom: 1px solid rgba(0,154,206,.12);
    box-shadow: 0 12px 30px rgba(0,0,0,.5);
    z-index: 999;
  }

  .nav.nav-open .nav-links a { padding: 10px 12px; font-size: 14px; }

  .h1 { font-size: 46px; }

  body.home-page .hero {
    min-height: auto;
    padding: 70px 0 50px;
    background-position: 60% 50%;
    background-size: 90% auto;
  }

  body.home-page .hero > .container { padding-left: 24px; }

  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .stat-item + .stat-item { border-left: none; }

  .process-grid     { grid-template-columns: repeat(2, 1fr); }
  .credentials-grid { grid-template-columns: repeat(2, 1fr); }
  .contact-layout   { grid-template-columns: 1fr; gap: 40px; }
  .contact-grid     { grid-template-columns: 1fr; }

  .section,
  .section--light,
  .section--dark { padding: 52px 0; }
  .cta-band      { padding: 56px 0; }
  .stats-band    { padding: 40px 0; }
  .markets-section { padding: 52px 0; }
}

@media (max-width: 640px) {
  .svc-grid           { grid-template-columns: 1fr; }
  .svc-grid--3        { grid-template-columns: 1fr; }
  .process-grid       { grid-template-columns: 1fr; }
  .what-we-bring-grid { grid-template-columns: 1fr; }
  .credentials-grid   { grid-template-columns: repeat(2, 1fr); }
  .stat-value         { font-size: 42px; }
  .h1                 { font-size: 36px; }
  .cta-band h2        { font-size: 34px; }
  .page-hero h1,
  .page-title h1      { font-size: 32px; }
  .section-heading    { font-size: 28px; }
}

@media (max-width: 480px) {
  .svc-grid--2      { grid-template-columns: 1fr; }
  .credentials-grid { grid-template-columns: 1fr; }
}

/* ============================================================
   Reduced motion
============================================================ */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition: none !important; animation: none !important; }
}
```

- [ ] **Step 2: Run build and verify no Eleventy errors**

```
npm run build
```

Expected: Build completes, `_site/` generated. No errors in output. If you see CSS parse errors, check for unclosed blocks.

- [ ] **Step 3: Commit**

```
git add src/assets/css/style.css
git commit -m "style: rewrite CSS — Oswald/Manrope design system, white/F5F7FA sections"
```

---

## Task 2: Navigation — Add Markets Link

**Files:**
- Modify: `src/_includes/base.njk`
- Modify: `src/en/en.11tydata.js`
- Modify: `src/ka/ka.11tydata.js`
- Modify: `src/ru/ru.11tydata.js`

- [ ] **Step 1: Add `navMarkets` to all three 11tydata.js files**

`src/en/en.11tydata.js` — add one line:
```js
module.exports = {
  layout: "base.njk",
  lang: "en",
  navHome: "Home",
  navServices: "Services",
  navMarkets: "Markets",
  navAbout: "About",
  navContact: "Contact",
  bookBtn: "Book now",
  eleventyComputed: {
    permalink: (data) => data.pageRelPath ? `${data.lang}/${data.pageRelPath}` : undefined,
  },
};
```

`src/ka/ka.11tydata.js`:
```js
module.exports = {
  layout: "base.njk",
  lang: "ka",
  navHome: "მთავარი",
  navServices: "სერვისები",
  navMarkets: "ბაზრები",
  navAbout: "ჩვენს შესახებ",
  navContact: "კონტაქტი",
  bookBtn: "დაჯავშნა",
  eleventyComputed: {
    permalink: (data) => data.pageRelPath ? `${data.lang}/${data.pageRelPath}` : undefined,
  },
};
```

`src/ru/ru.11tydata.js`:
```js
module.exports = {
  layout: "base.njk",
  lang: "ru",
  navHome: "Главная",
  navServices: "Услуги",
  navMarkets: "Рынки",
  navAbout: "О нас",
  navContact: "Контакты",
  bookBtn: "Запись",
  eleventyComputed: {
    permalink: (data) => data.pageRelPath ? `${data.lang}/${data.pageRelPath}` : undefined,
  },
};
```

- [ ] **Step 2: Add Markets link to nav in base.njk**

In `src/_includes/base.njk`, find the `nav-links` block and add Markets between Services and About. Also replace the Google Fonts `<link>` with Oswald + Manrope.

Replace the entire `<head>` font link block (lines 11-13 in the current file):
```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&family=Oswald:wght@400;500;600&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet">
```

with:
```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet">
```

Then replace the nav-links block:
```html
    <nav class="nav-links">
      <a href="{{ base }}index.html">{{ navHome }}</a>
      <a href="{{ base }}services.html">{{ navServices }}</a>
      <a href="{{ base }}about.html">{{ navAbout }}</a>
      <a href="{{ base }}contact.html">{{ navContact }}</a>
    </nav>
```

with:
```html
    <nav class="nav-links">
      <a href="{{ base }}index.html">{{ navHome }}</a>
      <a href="{{ base }}services.html">{{ navServices }}</a>
      <a href="{{ base }}markets.html">{{ navMarkets }}</a>
      <a href="{{ base }}about.html">{{ navAbout }}</a>
      <a href="{{ base }}contact.html">{{ navContact }}</a>
    </nav>
```

Also add the hamburger toggle button inside `.nav-inner` (after `.nav-right`, before closing `</div>`). The existing `main.js` already toggles `.nav-open` on click — the button just needs to exist in the DOM. Check current `base.njk` — if `nav-toggle` is already present, skip this. If not, add before `</div><!-- /nav-inner -->`:
```html
    <button class="nav-toggle" aria-label="Toggle navigation">
      <span></span><span></span><span></span>
    </button>
```

- [ ] **Step 3: Verify hamburger JS in main.js**

Read `src/assets/js/main.js`. Confirm it contains logic that adds `.nav-open` to `.nav` on `.nav-toggle` click, and `.is-scrolled` on scroll. If the scroll shrink logic uses `.is-scrolled`, it matches the new CSS. If not, update it to match.

Expected content in `main.js` (already exists — just verify):
```js
// scroll shrink
window.addEventListener('scroll', () => {
  document.querySelector('.nav').classList.toggle('is-scrolled', window.scrollY > 30);
});

// hamburger
document.querySelector('.nav-toggle')?.addEventListener('click', () => {
  document.querySelector('.nav').classList.toggle('nav-open');
});
```

- [ ] **Step 4: Build and verify nav**

```
npm run build
```

Open `_site/en/index.html` in a browser. Confirm: Markets link appears between Services and About. Fonts are Oswald (nav links) and Manrope (body). Hamburger appears on mobile viewport.

- [ ] **Step 5: Commit**

```
git add src/_includes/base.njk src/en/en.11tydata.js src/ka/ka.11tydata.js src/ru/ru.11tydata.js
git commit -m "feat: add Markets nav link — all 3 languages, swap to Oswald/Manrope fonts"
```

---

## Task 3: JSON Data — Add All New Content Keys

**Files:**
- Modify: `src/_data/en.json`
- Modify: `src/_data/ka.json`
- Modify: `src/_data/ru.json`

- [ ] **Step 1: Add Lithuania to `markets.countries` in all 3 JSON files**

In `en.json`, append to the `markets.countries` array:
```json
{"name":"Lithuania","lat":55.17,"lng":23.88,"note":""}
```

In `ka.json`, append to the `markets.countries` array:
```json
{"name":"ლიტვა","lat":55.17,"lng":23.88,"note":""}
```

In `ru.json`, append to the `markets.countries` array:
```json
{"name":"Литва","lat":55.17,"lng":23.88,"note":""}
```

- [ ] **Step 2: Add `services_hub` and `services_detail` to `en.json`**

Add after the existing `"services"` object in `en.json`:

```json
"services_hub": {
  "heading": "Our Services",
  "subheading": "End-to-end trade, marketing, and advisory support for Georgian wine and spirits producers.",
  "cards": [
    {
      "slug": "new-partner-acquisition",
      "title": "New Partner Acquisition",
      "teaser": "Identify, approach, and contract distribution partners in new export markets."
    },
    {
      "slug": "existing-partner-management",
      "title": "Existing Partner Management",
      "teaser": "Active management of your current distributor and buyer relationships."
    },
    {
      "slug": "marketing-services",
      "title": "Marketing",
      "teaser": "Brand positioning, trade event representation, and social media management."
    },
    {
      "slug": "foreign-companies",
      "title": "Services for Foreign Companies",
      "teaser": "Market entry support for international brands entering Georgia."
    },
    {
      "slug": "additional-services",
      "title": "Additional Services",
      "teaser": "Specialist support including training and ISO certification guidance."
    }
  ]
},
"services_detail": {
  "included_heading": "What's Included",
  "cta_heading": "Ready to Get Started?",
  "cta_body": "Tell us about your business and what you're trying to achieve. We'll come back with a clear proposal.",
  "new_partner_acquisition": {
    "page_title": "New Partner Acquisition",
    "page_subtitle": "Market selection and partner sourcing, outreach, negotiation, and contracting support.",
    "headline": "Enter New Markets with Confidence",
    "body": [
      "Finding the right distribution partner in a new market is one of the hardest parts of international trade. It requires deep local knowledge, existing relationships, and the ability to negotiate from a position of credibility. MCG's founding team has spent years building exactly that network across more than 15 countries.",
      "We manage the full acquisition cycle — from identifying which markets represent the best opportunity for your product, to mapping the distribution landscape, approaching the right decision-makers, and supporting you through commercial negotiations and contracting.",
      "Every market engagement is tailored to your product category, price point, and capacity. We don't send blind cold outreach — we leverage personal relationships with buyers and distributors built over years of active export work."
    ],
    "included": [
      "Market selection and opportunity analysis",
      "Competitive landscape mapping",
      "Target partner identification and ranking",
      "Decision-maker research and initial outreach",
      "Commercial offer preparation and presentation",
      "Trade fair identification, organisation, and representation",
      "Product sample coordination and dispatch",
      "Commercial and legal term negotiation",
      "Contract drafting and finalisation support"
    ]
  },
  "existing_partner_management": {
    "page_title": "Existing Partner Management",
    "page_subtitle": "Active management of your current distributor and buyer relationships.",
    "headline": "Protect and Grow What You've Built",
    "body": [
      "Winning a distribution partner is the beginning, not the end. Markets evolve, terms need updating, and relationships require active management to stay productive. Without consistent attention, even strong partnerships underperform.",
      "MCG acts as your permanent point of contact in-market — handling day-to-day partner communication, performance monitoring, and commercial updates so your team can focus elsewhere.",
      "We identify when a partnership is underperforming and why, and take corrective action before problems escalate. We also look for organic opportunities to grow existing accounts through range extensions, promotional activity, and volume commitments."
    ],
    "included": [
      "Ongoing partner communication and relationship management",
      "Sales performance tracking and reporting",
      "Pricing and terms review and negotiation",
      "Order and documentation coordination",
      "Issue resolution and dispute management",
      "Promotional activity coordination",
      "Range extension and upsell identification",
      "Annual account review preparation"
    ]
  },
  "marketing_services": {
    "page_title": "Marketing",
    "page_subtitle": "Brand positioning, trade event representation, and social media management.",
    "headline": "Position Your Brand for International Success",
    "body": [
      "Georgian wine and spirits carry an exceptional story — ancient traditions, unique grape varieties, a winemaking culture unlike anywhere else in the world. MCG helps producers translate that story into positioning that resonates with international buyers, distributors, and end consumers.",
      "Our marketing work spans brand strategy through to execution — from defining how your brand sits in a crowded international market to representing it at trade events and managing its presence on digital channels.",
      "Social media management is part of this service. We manage content creation, posting schedules, and community engagement across platforms relevant to your target markets, ensuring your digital presence supports your commercial objectives."
    ],
    "included": [
      "International brand positioning and messaging",
      "Brand identity review and development support",
      "Trade event identification, registration, and representation",
      "Sales material and presentation preparation",
      "Digital channel strategy and management",
      "Social media content creation and scheduling",
      "Platform management (Instagram, LinkedIn, market-specific channels)",
      "Campaign performance reporting"
    ]
  },
  "foreign_companies": {
    "page_title": "Services for Foreign Companies",
    "page_subtitle": "Market entry support for international brands entering Georgia.",
    "headline": "Enter the Georgian Market with Expert Guidance",
    "body": [
      "Georgia is an increasingly attractive market for international wine, spirits, and beverage brands — a growing middle class, a sophisticated food and drink culture, and a strategic location between Europe and Asia. Navigating it requires local knowledge.",
      "MCG helps foreign producers and brands understand the Georgian market, identify the right distribution partners, and manage the regulatory and commercial steps required to establish a presence.",
      "Whether you are exploring initial market entry or ready to activate a distribution agreement, MCG provides the local expertise and commercial support to make it work."
    ],
    "included": [
      "Georgian market overview and opportunity assessment",
      "Regulatory and import compliance guidance",
      "Distributor and importer identification and introduction",
      "Commercial negotiation support",
      "Brand positioning for the Georgian consumer",
      "Ongoing local market representation"
    ]
  },
  "additional_services": {
    "page_title": "Additional Services",
    "page_subtitle": "Specialist support including training and ISO certification guidance.",
    "headline": "Specialist Support for Your Business",
    "body": [
      "Beyond export, import, and marketing, MCG offers specialist support services designed to strengthen the operational and compliance foundations of wine and spirits businesses.",
      "These services are available as standalone engagements or as part of a broader advisory relationship. Full service details are in development — contact us to discuss your specific requirements."
    ],
    "included": [
      "Industry and trade training programmes",
      "ISO certification preparation and support",
      "Additional specialist services — contact MCG to discuss your requirements"
    ]
  }
},
```

- [ ] **Step 3: Add `about_page` to `en.json`**

```json
"about_page": {
  "heading": "About MCG",
  "subtitle": "Built on Real Export Experience",
  "intro": [
    "Millennium Consulting Georgia was founded by a senior export and marketing professional with over a decade of direct experience at some of Georgia's best-known wineries. That background — building distribution networks, managing international buyer relationships, and executing market entry strategies across more than 15 countries — forms the operational core of what MCG delivers.",
    "We work as an extension of your commercial team. Rather than advising from the outside, we take direct ownership of export operations, partner relationships, and brand positioning in target markets. Our clients work with a firm that has already done what they are trying to do — and built the network to make it happen again.",
    "MCG focuses exclusively on wine, spirits, and high-quality beverage products. That narrow focus means our market knowledge, buyer relationships, and regulatory understanding are current, relevant, and deep."
  ],
  "what_we_bring_heading": "What We Bring",
  "cards": [
    {
      "title": "Export Networks",
      "body": "Direct relationships with importers, distributors, and buyers across 15 countries, built over years of active export work from Georgian wineries."
    },
    {
      "title": "Regulatory Know-How",
      "body": "Hands-on experience navigating export documentation, customs compliance, and market-specific import requirements across European, Asian, and North American markets."
    },
    {
      "title": "Brand Positioning",
      "body": "A track record of positioning Georgian wine and spirits for international audiences — from trade event representation to digital presence and in-market promotional activity."
    }
  ],
  "cta_heading": "Let's Talk About Your Market",
  "cta_body": "Tell us where you want to go and what you produce. We'll tell you how to get there.",
  "cta_button": "Get in Touch"
},
```

- [ ] **Step 4: Add `contact_page` to `en.json`**

```json
"contact_page": {
  "heading": "Get in Touch",
  "subtitle": "We reply within 24 business hours.",
  "form": {
    "name_label": "Name",
    "name_placeholder": "Your name",
    "company_label": "Company",
    "company_placeholder": "Your company",
    "email_label": "Email",
    "email_placeholder": "your@email.com",
    "message_label": "Message",
    "message_placeholder": "Tell us about your business and what you're looking for.",
    "service_label": "Service interest",
    "service_options": [
      "New Partner Acquisition",
      "Existing Partner Management",
      "Marketing",
      "Services for Foreign Companies",
      "Additional Services"
    ],
    "submit_label": "Send Message"
  },
  "details_heading": "Contact Details",
  "details": [
    {
      "label": "Email",
      "value": "levan.kurdadze@mcgpartner.com",
      "href": "mailto:levan.kurdadze@mcgpartner.com"
    },
    {
      "label": "Phone",
      "value": "+995 555 91 66 44",
      "href": "tel:+995555916644"
    },
    {
      "label": "LinkedIn",
      "value": "Millennium Consulting Georgia",
      "href": "https://www.linkedin.com/company/millennium-consulting-georgia/"
    },
    {
      "label": "Book a Call",
      "value": "Open calendar →",
      "href": "book.html"
    }
  ]
},
```

- [ ] **Step 5: Add `markets_page` to `en.json`**

```json
"markets_page": {
  "heading": "Our Markets",
  "subtitle": "An established network spanning Europe, Asia, and North America.",
  "map_heading": "Partner Network",
  "countries_heading": "Countries We Operate In",
  "countries_flat": [
    "Germany", "Poland", "Netherlands", "United Kingdom", "France",
    "Czech Republic", "Latvia", "Estonia", "Lithuania", "Ukraine",
    "China", "Japan", "South Korea", "Kazakhstan",
    "United States", "Canada"
  ]
},
```

- [ ] **Step 6: Add `markets_page` to `ka.json`**

```json
"markets_page": {
  "heading": "ჩვენი ბაზრები",
  "subtitle": "დამყარებული ქსელი ევროპაში, აზიასა და ჩრდილოეთ ამერიკაში.",
  "map_heading": "პარტნიორების ქსელი",
  "countries_heading": "ქვეყნები სადაც ვმუშაობთ",
  "countries_flat": [
    "გერმანია", "პოლონეთი", "ნიდერლანდები", "გაერთიანებული სამეფო", "საფრანგეთი",
    "ჩეხეთი", "ლატვია", "ესტონეთი", "ლიტვა", "უკრაინა",
    "ჩინეთი", "იაპონია", "სამხრეთ კორეა", "ყაზახეთი",
    "შეერთებული შტატები", "კანადა"
  ]
},
```

- [ ] **Step 7: Add `markets_page` to `ru.json`**

```json
"markets_page": {
  "heading": "Наши рынки",
  "subtitle": "Устоявшаяся сеть охватывает Европу, Азию и Северную Америку.",
  "map_heading": "Партнёрская сеть",
  "countries_heading": "Страны присутствия",
  "countries_flat": [
    "Германия", "Польша", "Нидерланды", "Великобритания", "Франция",
    "Чехия", "Латвия", "Эстония", "Литва", "Украина",
    "Китай", "Япония", "Южная Корея", "Казахстан",
    "США", "Канада"
  ]
},
```

- [ ] **Step 8: Build and verify JSON is valid**

```
npm run build
```

If Eleventy throws a JSON parse error, use a JSON validator (e.g. `node -e "require('./src/_data/en.json')"`) to find the issue. Common mistake: missing comma after the last added object before the closing `}`.

- [ ] **Step 9: Commit**

```
git add src/_data/en.json src/_data/ka.json src/_data/ru.json
git commit -m "feat: add services, about, contact, markets content to JSON data files"
```

---

## Task 4: Services Hub Page

**Files:**
- Rewrite: `src/en/services.njk`

- [ ] **Step 1: Replace `src/en/services.njk`**

```njk
---
title: Services — Millennium Consulting Georgia
pageRelPath: services.html
---
<div class="page-hero">
  <div class="container">
    <h1>{{ en.services_hub.heading }}</h1>
    <p>{{ en.services_hub.subheading }}</p>
  </div>
</div>

<section class="section">
  <div class="container">
    <div class="svc-grid svc-grid--3">
      {% for card in en.services_hub.cards %}
      <a class="svc-card svc-card--link" href="services/{{ card.slug }}.html">
        <h3>{{ card.title }}</h3>
        <p>{{ card.teaser }}</p>
        <span class="card-arrow">→</span>
      </a>
      {% endfor %}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Build and check**

```
npm run build
```

Open `_site/en/services.html`. Confirm: 5 cards in a 3-column grid, each linking to the correct sub-page path.

- [ ] **Step 3: Commit**

```
git add src/en/services.njk
git commit -m "feat: redesign services hub — 5-card grid with links to sub-pages"
```

---

## Task 5: Service Detail Shared Include

**Files:**
- Create: `src/_includes/service-detail-body.njk`

This include renders the body of any service sub-page. The calling template sets `svc` before including it.

- [ ] **Step 1: Create `src/_includes/service-detail-body.njk`**

```njk
<div class="page-hero">
  <div class="container">
    <h1>{{ svc.page_title }}</h1>
    <p>{{ svc.page_subtitle }}</p>
  </div>
</div>

<section class="section">
  <div class="container">
    <div class="service-detail">
      <div class="section-rule"></div>
      <h2 class="section-heading">{{ svc.headline }}</h2>
      {% for para in svc.body %}
      <p>{{ para }}</p>
      {% endfor %}
    </div>
  </div>
</section>

<section class="section--light">
  <div class="container">
    <h2 class="section-heading">{{ en.services_detail.included_heading }}</h2>
    <div class="section-rule"></div>
    <ul class="included-list">
      {% for item in svc.included %}
      <li>{{ item }}</li>
      {% endfor %}
    </ul>
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <a class="btn" href="../services.html">← All Services</a>
      <a class="btn btn-primary" href="../contact.html">{{ en.nav_cta }}</a>
    </div>
  </div>
</section>
```

Note: this include hardcodes `en.services_detail.included_heading` and `en.nav_cta`. KA/RU sub-pages will need their own include or inline templates if/when those languages are built out — they are not in scope for this plan.

- [ ] **Step 2: No build step needed** — include only renders when called by sub-pages (Task 6).

---

## Task 6: Service Sub-Pages (EN)

**Files:**
- Rewrite: `src/en/services/new-partner-acquisition.njk`
- Rewrite: `src/en/services/existing-partner-management.njk`
- Rewrite: `src/en/services/marketing-services.njk`
- Rewrite: `src/en/services/foreign-companies.njk`
- Rewrite: `src/en/services/additional-services.njk`

Each file sets `svc` to the correct JSON key and includes the shared body template.

- [ ] **Step 1: Rewrite `new-partner-acquisition.njk`**

```njk
---
title: New Partner Acquisition — Millennium Consulting Georgia
pageRelPath: services/new-partner-acquisition.html
---
{% set svc = en.services_detail.new_partner_acquisition %}
{% include "service-detail-body.njk" %}
```

- [ ] **Step 2: Rewrite `existing-partner-management.njk`**

```njk
---
title: Existing Partner Management — Millennium Consulting Georgia
pageRelPath: services/existing-partner-management.html
---
{% set svc = en.services_detail.existing_partner_management %}
{% include "service-detail-body.njk" %}
```

- [ ] **Step 3: Rewrite `marketing-services.njk`**

```njk
---
title: Marketing — Millennium Consulting Georgia
pageRelPath: services/marketing-services.html
---
{% set svc = en.services_detail.marketing_services %}
{% include "service-detail-body.njk" %}
```

- [ ] **Step 4: Rewrite `foreign-companies.njk`**

```njk
---
title: Services for Foreign Companies — Millennium Consulting Georgia
pageRelPath: services/foreign-companies.html
---
{% set svc = en.services_detail.foreign_companies %}
{% include "service-detail-body.njk" %}
```

- [ ] **Step 5: Rewrite `additional-services.njk`**

```njk
---
title: Additional Services — Millennium Consulting Georgia
pageRelPath: services/additional-services.html
---
{% set svc = en.services_detail.additional_services %}
{% include "service-detail-body.njk" %}
```

- [ ] **Step 6: Build and verify all 5 sub-pages**

```
npm run build
```

Open each in a browser:
- `_site/en/services/new-partner-acquisition.html`
- `_site/en/services/existing-partner-management.html`
- `_site/en/services/marketing-services.html`
- `_site/en/services/foreign-companies.html`
- `_site/en/services/additional-services.html`

Each should show: dark inner hero → service description paragraphs → "What's Included" bullet list → back + contact CTAs.

- [ ] **Step 7: Commit**

```
git add src/_includes/service-detail-body.njk src/en/services/new-partner-acquisition.njk src/en/services/existing-partner-management.njk src/en/services/marketing-services.njk src/en/services/foreign-companies.njk src/en/services/additional-services.njk
git commit -m "feat: build out 5 EN service detail pages with shared include template"
```

---

## Task 7: About Page (EN)

**Files:**
- Rewrite: `src/en/about.njk`

- [ ] **Step 1: Replace `src/en/about.njk`**

```njk
---
title: About — Millennium Consulting Georgia
pageRelPath: about.html
---
<div class="page-hero">
  <div class="container">
    <h1>{{ en.about_page.heading }}</h1>
    <p>{{ en.about_page.subtitle }}</p>
  </div>
</div>

<section class="section">
  <div class="container">
    <div class="section-rule"></div>
    <div class="about-intro">
      {% for para in en.about_page.intro %}
      <p>{{ para }}</p>
      {% endfor %}
    </div>
  </div>
</section>

<section class="section--light">
  <div class="container">
    <div class="credentials-grid">
      {% for stat in en.stats %}
      <div class="credential-item">
        <div class="credential-value">{{ stat.value }}</div>
        <div class="credential-label">{{ stat.label }}</div>
      </div>
      {% endfor %}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="section-heading">{{ en.about_page.what_we_bring_heading }}</h2>
    <div class="section-rule"></div>
    <div class="what-we-bring-grid">
      {% for card in en.about_page.cards %}
      <div class="bring-card">
        <h3>{{ card.title }}</h3>
        <p>{{ card.body }}</p>
      </div>
      {% endfor %}
    </div>
  </div>
</section>

<section class="section--light">
  <div class="container">
    <div class="card" style="max-width:600px">
      <h2 style="font-size:24px;margin-bottom:12px;">{{ en.about_page.cta_heading }}</h2>
      <p style="font-family:'Manrope',sans-serif;font-size:15px;color:var(--text-muted);margin:0 0 20px;line-height:1.7;">{{ en.about_page.cta_body }}</p>
      <a class="btn btn-primary" href="contact.html">{{ en.about_page.cta_button }}</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Build and verify**

```
npm run build
```

Open `_site/en/about.html`. Confirm: dark inner hero → intro paragraphs → 4 credential stats grid on light bg → "What We Bring" 3 cards → CTA card.

- [ ] **Step 3: Commit**

```
git add src/en/about.njk
git commit -m "feat: build About page — firm credentials, what we bring, CTA"
```

---

## Task 8: Contact Page (EN)

**Files:**
- Rewrite: `src/en/contact.njk`

- [ ] **Step 1: Replace `src/en/contact.njk`**

```njk
---
title: Contact — Millennium Consulting Georgia
pageRelPath: contact.html
---
<div class="page-hero">
  <div class="container">
    <h1>{{ en.contact_page.heading }}</h1>
    <p>{{ en.contact_page.subtitle }}</p>
  </div>
</div>

<section class="section">
  <div class="container">
    <div class="contact-layout">

      <form class="contact-form" method="POST" action="">
        {# Wire action to Formspree/Netlify Forms when ready #}
        <div class="form-group">
          <label for="cf-name">{{ en.contact_page.form.name_label }} *</label>
          <input id="cf-name" type="text" name="name" placeholder="{{ en.contact_page.form.name_placeholder }}" required>
        </div>
        <div class="form-group">
          <label for="cf-company">{{ en.contact_page.form.company_label }}</label>
          <input id="cf-company" type="text" name="company" placeholder="{{ en.contact_page.form.company_placeholder }}">
        </div>
        <div class="form-group">
          <label for="cf-email">{{ en.contact_page.form.email_label }} *</label>
          <input id="cf-email" type="email" name="email" placeholder="{{ en.contact_page.form.email_placeholder }}" required>
        </div>
        <div class="form-group">
          <label for="cf-service">{{ en.contact_page.form.service_label }}</label>
          <select id="cf-service" name="service">
            <option value="" disabled selected>— Select a service —</option>
            {% for opt in en.contact_page.form.service_options %}
            <option value="{{ opt }}">{{ opt }}</option>
            {% endfor %}
          </select>
        </div>
        <div class="form-group">
          <label for="cf-message">{{ en.contact_page.form.message_label }} *</label>
          <textarea id="cf-message" name="message" placeholder="{{ en.contact_page.form.message_placeholder }}" required></textarea>
        </div>
        <div>
          <button type="submit" class="btn btn-primary">{{ en.contact_page.form.submit_label }}</button>
        </div>
      </form>

      <div>
        <h2 class="section-heading" style="margin-bottom:0;">{{ en.contact_page.details_heading }}</h2>
        <div class="section-rule"></div>
        <div class="contact-details-block">
          {% for item in en.contact_page.details %}
          <div class="contact-detail-item">
            <span class="detail-label">{{ item.label }}</span>
            <a href="{{ item.href }}"{% if "http" in item.href %} target="_blank" rel="noopener"{% endif %}>{{ item.value }}</a>
          </div>
          {% endfor %}
        </div>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Build and verify**

```
npm run build
```

Open `_site/en/contact.html`. Confirm: dark inner hero → 2-column layout (form left, contact details right) → form has 5 fields + dropdown + submit → details block has 4 items with brand-colour labels.

On mobile (narrow viewport): columns should stack to single column.

- [ ] **Step 3: Commit**

```
git add src/en/contact.njk
git commit -m "feat: build Contact page — form with service dropdown, contact details"
```

---

## Task 9: Markets Page (EN)

**Files:**
- Create: `src/en/markets.njk`

- [ ] **Step 1: Create `src/en/markets.njk`**

```njk
---
title: Markets — Millennium Consulting Georgia
pageRelPath: markets.html
---
<div class="page-hero">
  <div class="container">
    <h1>{{ en.markets_page.heading }}</h1>
    <p>{{ en.markets_page.subtitle }}</p>
  </div>
</div>

<section class="section">
  <div class="container">
    <h2 class="section-heading">{{ en.markets_page.map_heading }}</h2>
    <div class="section-rule"></div>
    <div id="mcg-map"></div>
    <script>
    (function(){
      var countries = {{ en.markets.countries | dump | safe }};
      var map = L.map('mcg-map', { scrollWheelZoom: false, zoomControl: true }).setView([40, 30], 2);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19
      }).addTo(map);
      var dotIcon = L.divIcon({
        className: 'mcg-marker',
        html: '<div class="mcg-marker-dot"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -12]
      });
      countries.forEach(function(c){
        var popup = '<strong>' + c.name + '</strong>' + (c.note ? '<br><span>' + c.note + '</span>' : '');
        L.marker([c.lat, c.lng], { icon: dotIcon }).addTo(map).bindPopup(popup);
      });
    })();
    </script>

    <h2 class="section-heading" style="margin-top:40px;">{{ en.markets_page.countries_heading }}</h2>
    <div class="section-rule"></div>
    <div class="markets-grid">
      {% for country in en.markets_page.countries_flat %}
      <span class="country-tag country-tag--light">{{ country }}</span>
      {% endfor %}
    </div>
  </div>
</section>
```

Note: the map `#mcg-map` height is set in CSS (480px). The Leaflet JS and CSS are already loaded via `base.njk` on every page.

- [ ] **Step 2: Build and verify**

```
npm run build
```

Open `_site/en/markets.html`. Confirm: dark inner hero → map renders with 16 markers → country tags flex-wrap below map. Check Lithuania marker appears near the Baltics.

- [ ] **Step 3: Commit**

```
git add src/en/markets.njk
git commit -m "feat: add EN Markets page — Leaflet map + 16-country tag list"
```

---

## Task 10: Markets Stub Pages (KA + RU)

**Files:**
- Create: `src/ka/markets.njk`
- Create: `src/ru/markets.njk`

- [ ] **Step 1: Create `src/ka/markets.njk`**

```njk
---
title: ბაზრები — Millennium Consulting Georgia
pageRelPath: markets.html
---
<div class="page-hero">
  <div class="container">
    <h1>{{ ka.markets_page.heading }}</h1>
    <p>{{ ka.markets_page.subtitle }}</p>
  </div>
</div>

<section class="section">
  <div class="container">
    <h2 class="section-heading">{{ ka.markets_page.map_heading }}</h2>
    <div class="section-rule"></div>
    <div id="mcg-map"></div>
    <script>
    (function(){
      var countries = {{ ka.markets.countries | dump | safe }};
      var map = L.map('mcg-map', { scrollWheelZoom: false, zoomControl: true }).setView([40, 30], 2);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19
      }).addTo(map);
      var dotIcon = L.divIcon({
        className: 'mcg-marker',
        html: '<div class="mcg-marker-dot"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -12]
      });
      countries.forEach(function(c){
        var popup = '<strong>' + c.name + '</strong>' + (c.note ? '<br><span>' + c.note + '</span>' : '');
        L.marker([c.lat, c.lng], { icon: dotIcon }).addTo(map).bindPopup(popup);
      });
    })();
    </script>

    <h2 class="section-heading" style="margin-top:40px;">{{ ka.markets_page.countries_heading }}</h2>
    <div class="section-rule"></div>
    <div class="markets-grid">
      {% for country in ka.markets_page.countries_flat %}
      <span class="country-tag country-tag--light">{{ country }}</span>
      {% endfor %}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Create `src/ru/markets.njk`**

```njk
---
title: Рынки — Millennium Consulting Georgia
pageRelPath: markets.html
---
<div class="page-hero">
  <div class="container">
    <h1>{{ ru.markets_page.heading }}</h1>
    <p>{{ ru.markets_page.subtitle }}</p>
  </div>
</div>

<section class="section">
  <div class="container">
    <h2 class="section-heading">{{ ru.markets_page.map_heading }}</h2>
    <div class="section-rule"></div>
    <div id="mcg-map"></div>
    <script>
    (function(){
      var countries = {{ ru.markets.countries | dump | safe }};
      var map = L.map('mcg-map', { scrollWheelZoom: false, zoomControl: true }).setView([40, 30], 2);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19
      }).addTo(map);
      var dotIcon = L.divIcon({
        className: 'mcg-marker',
        html: '<div class="mcg-marker-dot"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -12]
      });
      countries.forEach(function(c){
        var popup = '<strong>' + c.name + '</strong>' + (c.note ? '<br><span>' + c.note + '</span>' : '');
        L.marker([c.lat, c.lng], { icon: dotIcon }).addTo(map).bindPopup(popup);
      });
    })();
    </script>

    <h2 class="section-heading" style="margin-top:40px;">{{ ru.markets_page.countries_heading }}</h2>
    <div class="section-rule"></div>
    <div class="markets-grid">
      {% for country in ru.markets_page.countries_flat %}
      <span class="country-tag country-tag--light">{{ country }}</span>
      {% endfor %}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Build and verify**

```
npm run build
```

Open `_site/ka/markets.html` and `_site/ru/markets.html`. Confirm: Georgian/Russian headings appear, map renders, country tags use the translated names. Language switcher on the EN markets page should link correctly to `/ka/markets.html` and `/ru/markets.html`.

- [ ] **Step 4: Commit**

```
git add src/ka/markets.njk src/ru/markets.njk
git commit -m "feat: add KA and RU Markets pages — map + translated country list"
```

---

## Task 11: Final Verification

- [ ] **Step 1: Full build**

```
npm run build
```

Expected: zero errors. Note the count of output files — should be 37+ (previous 34 + 3 new markets pages).

- [ ] **Step 2: Check all EN inner pages**

Open each in `_site/en/`:
- `index.html` — homepage: dark hero with bg photo, stats band, services grid, process grid, map, CTA band. All Oswald headings.
- `services.html` — 5 cards in 3-col grid, each linking to sub-pages
- `services/new-partner-acquisition.html` — full detail layout
- `services/existing-partner-management.html` — full detail layout
- `services/marketing-services.html` — full detail layout
- `services/foreign-companies.html` — full detail layout
- `services/additional-services.html` — full detail layout
- `about.html` — intro, credentials, what we bring, CTA
- `contact.html` — form + details 2-col
- `markets.html` — map + country tags

- [ ] **Step 3: Check KA and RU pages are unbroken**

Open `_site/ka/index.html` and `_site/ru/index.html`. Confirm: Georgian/Russian text intact, UTF-8 encoding correct, no garbled characters. Nav has Markets link in the correct language.

Open `_site/ka/markets.html` and `_site/ru/markets.html`. Confirm both render.

- [ ] **Step 4: Mobile check**

Resize browser to 375px width on the following pages:
- Homepage: hero text readable, nav collapses to hamburger
- Services hub: cards go to 1 column
- Any service sub-page: body text readable, buttons stack
- Contact: form and details stack vertically
- Markets: map fills width, country tags wrap

- [ ] **Step 5: Language switcher check**

On `en/markets.html`, click the Georgian flag — should load `ka/markets.html`. Click Russian — should load `ru/markets.html`. Repeat from each language.

- [ ] **Step 6: Push to deploy**

```
git push origin main
```

Wait 1-2 minutes. Check https://luka9815.github.io/MCG/ — confirm the live site reflects all changes.

---

## Appendix: JSON Edit Reference

When editing JSON files, the safest approach is to use `node` to validate after each edit:

```
node -e "JSON.parse(require('fs').readFileSync('./src/_data/en.json','utf8')); console.log('valid')"
node -e "JSON.parse(require('fs').readFileSync('./src/_data/ka.json','utf8')); console.log('valid')"
node -e "JSON.parse(require('fs').readFileSync('./src/_data/ru.json','utf8')); console.log('valid')"
```

Common JSON mistake: trailing comma on the last item in an array or object. Every object key-value pair needs a comma after it **except the last one**.
