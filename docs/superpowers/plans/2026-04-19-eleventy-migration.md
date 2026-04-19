# Eleventy Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the MCG static site from 33 hand-duplicated HTML files to an Eleventy SSG that outputs the same flat `ka/` / `en/` / `ru/` file structure, so nav/footer changes require editing one file.

**Architecture:** Source lives in `src/`. A single `_includes/base.njk` layout holds the shared head, nav, and footer. Three directory data files inject language-specific strings (nav labels, book button). Content templates contain only their `<main>` block plus front matter. Eleventy outputs to `_site/`, which a GitHub Actions workflow deploys via the Pages API. The old HTML files at the repo root are left in place until the user confirms production is working.

**Tech Stack:** Eleventy 3.x, Nunjucks templates, Node 20, GitHub Actions (actions/deploy-pages@v4)

---

## File Map

**Create:**
- `package.json`
- `.eleventy.js`
- `src/_includes/base.njk` — single shared layout (head + nav + footer)
- `src/en/en.json` — EN directory data (lang + nav strings)
- `src/ka/ka.json` — KA directory data
- `src/ru/ru.json` — RU directory data
- `src/index.html` — root redirect (passthrough copy)
- `src/en/index.njk`, `services.njk`, `about.njk`, `contact.njk`, `book.njk`
- `src/en/services/new-partner-acquisition.njk`, `existing-partner-management.njk`, `marketing-services.njk`, `foreign-companies.njk`, `social-media-marketing.njk`, `additional-services.njk`
- `src/ka/` — same 11 files
- `src/ru/` — same 11 files
- `.github/workflows/deploy.yml`

**Move:**
- `assets/` → `src/assets/` (CSS, JS, images)

**Leave untouched (for now):**
- `en/`, `ka/`, `ru/` at repo root (old HTML — delete only after confirming `_site/` is live)

---

## Task 1: Init npm + Eleventy config

**Files:**
- Create: `package.json`
- Create: `.eleventy.js`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "mcg-site",
  "version": "1.0.0",
  "scripts": {
    "build": "eleventy",
    "dev": "eleventy --serve"
  },
  "devDependencies": {
    "@11ty/eleventy": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create `.eleventy.js`**

```js
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};
```

- [ ] **Step 3: Install dependencies**

Run from repo root:
```bash
npm install
```
Expected: `node_modules/` created, `package-lock.json` written.

- [ ] **Step 4: Verify config is valid**

```bash
npm run build
```
Expected: `[11ty] Wrote 0 files` (no source yet — that's fine). No errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .eleventy.js
git commit -m "chore: add Eleventy 3 and config"
```

---

## Task 2: Move assets into src/

**Files:**
- Move: `assets/` → `src/assets/`

- [ ] **Step 1: Move the assets folder**

```bash
mkdir -p src
mv assets src/assets
```

- [ ] **Step 2: Verify build still passes (no asset-related errors)**

```bash
npm run build
```
Expected: No errors. `_site/assets/` created with `css/style.css`, `js/main.js`, `img/logo.png`, `img/home-bg.png`.

- [ ] **Step 3: Commit**

```bash
git add src/assets .eleventy.js
git commit -m "chore: move assets into src/ for Eleventy passthrough"
```

---

## Task 3: Shared layout

**Files:**
- Create: `src/_includes/base.njk`

This is the single file that replaces nav and footer across all 33 pages. It uses four front-matter variables set per page (`pageRelPath`, `title`, `bodyClass`) plus four set by the language data file (`lang`, `navHome`, `navServices`, `navAbout`, `navContact`, `bookBtn`).

- [ ] **Step 1: Create `src/_includes/base.njk`**

```njk
{% set isNested = "/" in pageRelPath %}
{% set assets = "../../assets" if isNested else "../assets" %}
{% set base = "../" if isNested else "./" %}
{% set langBase = "../../" if isNested else "../" %}
<!doctype html>
<html lang="{{ lang }}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>{{ title }}</title>
  <link rel="stylesheet" href="{{ assets }}/css/style.css" />
</head>
<body{% if bodyClass %} class="{{ bodyClass }}"{% endif %}>

<header class="nav">
  <div class="container nav-inner">
    <a class="brand" href="{{ base }}">
      <img src="{{ assets }}/img/logo.png" alt="Millennium Consulting Georgia logo">
    </a>

    <nav class="nav-links">
      <a href="{{ base }}index.html">{{ navHome }}</a>
      <a href="{{ base }}services.html">{{ navServices }}</a>
      <a href="{{ base }}about.html">{{ navAbout }}</a>
      <a href="{{ base }}contact.html">{{ navContact }}</a>
    </nav>

    <div class="nav-right">
      <div class="lang" aria-label="Language switcher">
        <a{% if lang == "ka" %} class="active"{% endif %} href="{{ langBase }}ka/{{ pageRelPath }}" title="Georgian"><img src="https://cdn-icons-png.flaticon.com/512/197/197380.png" alt="Georgian"></a>
        <a{% if lang == "en" %} class="active"{% endif %} href="{{ langBase }}en/{{ pageRelPath }}" title="English"><img src="https://cdn-icons-png.flaticon.com/512/197/197374.png" alt="English"></a>
        <a{% if lang == "ru" %} class="active"{% endif %} href="{{ langBase }}ru/{{ pageRelPath }}" title="Russian"><img src="https://cdn-icons-png.flaticon.com/512/197/197408.png" alt="Russian"></a>
      </div>
      <a class="btn btn-primary" href="{{ base }}book.html">{{ bookBtn }}</a>
    </div>
  </div>
</header>

<main>
{{ content | safe }}
</main>

<footer class="footer">
  <div class="container footer-inner">
    <div>
      © <span id="y"></span> Millennium Consulting Georgia
      <div style="font-size:12px;opacity:.6;margin-top:8px;">
        Flags by
        <a href="https://www.flaticon.com/free-icons/georgia" target="_blank" rel="noopener">iconset.co</a>,
        <a href="https://www.flaticon.com/free-icons/uk-flag" target="_blank" rel="noopener">Freepik</a>,
        <a href="https://www.flaticon.com/free-icons/russia" target="_blank" rel="noopener">Freepik</a>
        via Flaticon
      </div>
    </div>
    <div>
      <a href="mailto:levan.kurdadze@mcgpartner.com">levan.kurdadze@mcgpartner.com</a> •
      <a href="tel:+995555916644">+995 555 91 66 44</a> •
      <a href="https://www.linkedin.com/company/millennium-consulting-georgia/" target="_blank" rel="noopener">LinkedIn</a>
    </div>
  </div>
</footer>

<script>document.getElementById('y').textContent=new Date().getFullYear();</script>
<script src="{{ assets }}/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/_includes/base.njk
git commit -m "feat: add shared Eleventy layout (base.njk)"
```

---

## Task 4: Language data files

**Files:**
- Create: `src/en/en.json`
- Create: `src/ka/ka.json`
- Create: `src/ru/ru.json`

These are Eleventy directory data files. Each cascades to all templates in the directory and its `services/` subdirectory.

Note: RU originally had two different book button labels — "Запись" on top-level pages and "Бронирование" on service pages. This migration normalises to "Запись" throughout RU, which is an improvement.

- [ ] **Step 1: Create `src/en/en.json`**

```json
{
  "layout": "base.njk",
  "lang": "en",
  "navHome": "Home",
  "navServices": "Services",
  "navAbout": "About",
  "navContact": "Contact",
  "bookBtn": "Book now"
}
```

- [ ] **Step 2: Create `src/ka/ka.json`**

```json
{
  "layout": "base.njk",
  "lang": "ka",
  "navHome": "მთავარი",
  "navServices": "სერვისები",
  "navAbout": "ჩვენს შესახებ",
  "navContact": "კონტაქტი",
  "bookBtn": "დაჯავშნა"
}
```

- [ ] **Step 3: Create `src/ru/ru.json`**

```json
{
  "layout": "base.njk",
  "lang": "ru",
  "navHome": "Главная",
  "navServices": "Услуги",
  "navAbout": "О нас",
  "navContact": "Контакты",
  "bookBtn": "Запись"
}
```

- [ ] **Step 4: Commit**

```bash
git add src/en/en.json src/ka/ka.json src/ru/ru.json
git commit -m "feat: add Eleventy directory data files for EN/KA/RU"
```

---

## Task 5: EN top-level pages

**Files:**
- Create: `src/en/index.njk`
- Create: `src/en/services.njk`
- Create: `src/en/about.njk`
- Create: `src/en/contact.njk`
- Create: `src/en/book.njk`

- [ ] **Step 1: Create `src/en/index.njk`**

```njk
---
title: Millennium Consulting Georgia
pageRelPath: index.html
bodyClass: home-page
---
<section class="hero">
  <div class="container hero-grid">
    <div>
      <h1 class="h1">10+ years in international trade<br>31 contracted partners<br>16 countries</h1>
      <p class="lead">Full-cycle export and marketing services.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="book.html">Book a consultation</a>
        <a class="btn" href="services.html">View services</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Create `src/en/services.njk`**

```njk
---
title: Services - Millennium Consulting Georgia
pageRelPath: services.html
---
<div class="page-title"><div class="container">
  <h1>Services</h1>
  <p>Select a service to view details.</p>
</div></div>

<section class="section"><div class="container">
  <div class="svc-grid">
    <a class="svc-card" href="services/new-partner-acquisition.html">
      <h3>New Partner Acquisition</h3>
    </a>
    <a class="svc-card" href="services/existing-partner-management.html">
      <h3>Existing Partner Management</h3>
    </a>
    <a class="svc-card" href="services/marketing-services.html">
      <h3>Marketing Services</h3>
    </a>
    <a class="svc-card" href="services/foreign-companies.html">
      <h3>Services for Foreign Companies</h3>
    </a>
    <a class="svc-card" href="services/social-media-marketing.html">
      <h3>Social Media Marketing</h3>
    </a>
    <a class="svc-card" href="services/additional-services.html">
      <h3>Additional Services</h3>
    </a>
  </div>
</div></section>
```

- [ ] **Step 3: Create `src/en/about.njk`**

```njk
---
title: About — Millennium Consulting Georgia
pageRelPath: about.html
---
<div class="page-title"><div class="container">
  <h1>About</h1>
  <p>Specialized consulting for wine &amp; spirits export.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card">
    <p style="margin:0;color:rgba(245,247,250,.84)">
      Millennium Consulting Georgia helps producers sell internationally and helps global partners source high-quality Georgian products with confidence.
      We combine compliance guidance, commercial support, and practical execution across the export process.
    </p>
  </div>
</div></section>
```

- [ ] **Step 4: Create `src/en/contact.njk`**

```njk
---
title: Contact — Millennium Consulting Georgia
pageRelPath: contact.html
---
<div class="page-title"><div class="container">
  <h1>Contact</h1>
  <p>Reach out — we reply within 24 business hours.</p>
</div></div>

<section class="section"><div class="container">
  <div class="contact-grid">
    <div class="card contact-item"><small>Email</small><br><a href="mailto:levan.kurdadze@mcgpartner.com">levan.kurdadze@mcgpartner.com</a></div>
    <div class="card contact-item"><small>Phone</small><br><a href="tel:+995555916644">+995 555 91 66 44</a></div>
    <div class="card contact-item"><small>LinkedIn</small><br><a target="_blank" rel="noopener" href="https://www.linkedin.com/company/millennium-consulting-georgia/">Millennium Consulting Georgia</a></div>
    <div class="card contact-item"><small>Booking</small><br><a href="book.html">Open calendar →</a></div>
  </div>
</div></section>
```

- [ ] **Step 5: Create `src/en/book.njk`**

```njk
---
title: Book now — Millennium Consulting Georgia
pageRelPath: book.html
---
<div class="page-title"><div class="container">
  <h1>Book a consultation</h1>
  <p>Choose a date and time to discuss export plans or sourcing needs. You'll receive a confirmation email after booking.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card iframe-wrap">
    <iframe src="https://calendar.app.google/57fWmYwRU34c41ndA" loading="lazy" referrerpolicy="no-referrer-when-downgrade" scrolling="no"></iframe>
  </div>
</div></section>
```

- [ ] **Step 6: Build and verify EN top-level**

```bash
npm run build
```

Expected output includes:
```
_site/en/index.html
_site/en/services.html
_site/en/about.html
_site/en/contact.html
_site/en/book.html
```

Spot-check the nav in the output:
```bash
grep 'nav-links' _site/en/index.html
grep 'Home' _site/en/index.html
grep 'assets/css/style.css' _site/en/index.html
```
All three should return results.

- [ ] **Step 7: Commit**

```bash
git add src/en/
git commit -m "feat: add EN top-level Eleventy templates"
```

---

## Task 6: EN service detail pages

**Files:**
- Create: `src/en/services/new-partner-acquisition.njk`
- Create: `src/en/services/existing-partner-management.njk`
- Create: `src/en/services/marketing-services.njk`
- Create: `src/en/services/foreign-companies.njk`
- Create: `src/en/services/social-media-marketing.njk`
- Create: `src/en/services/additional-services.njk`

- [ ] **Step 1: Create `src/en/services/new-partner-acquisition.njk`**

```njk
---
title: New Partner Acquisition - Millennium Consulting Georgia
pageRelPath: services/new-partner-acquisition.html
---
<div class="page-title"><div class="container">
  <h1>New Partner Acquisition</h1>
  <p>Market selection and partner sourcing, outreach, negotiation, and contracting support.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card list">
    <ul>
      <li>Identify and analyse potential export markets</li>
      <li>Identify potential partner companies</li>
      <li>Identify decision-makers in target companies</li>
      <li>Prepare commercial offers and initiate negotiations</li>
      <li>Identify relevant trade fairs, organise and participate</li>
      <li>Send product samples</li>
      <li>Agree commercial and legal terms, contracting</li>
    </ul>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <a class="btn" href="../services.html">Back to services</a>
      <a class="btn btn-primary" href="../contact.html">Contact us</a>
    </div>
  </div>
</div></section>
```

- [ ] **Step 2: Create `src/en/services/existing-partner-management.njk`**

```njk
---
title: Existing Partner Management - Millennium Consulting Georgia
pageRelPath: services/existing-partner-management.html
---
<div class="page-title"><div class="container">
  <h1>Existing Partner Management</h1>
  <p>Sales planning, day-to-day coordination, and operational support for export activities.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card list">
    <ul>
      <li>Cost and export price analysis</li>
      <li>Competitor analysis in local and international markets</li>
      <li>Review existing partners and identify issues</li>
      <li>Sales planning and forecasting</li>
      <li>Execute the sales plan and manage operational tasks</li>
      <li>Prepare export documentation</li>
      <li>Plan trade marketing activities with partners</li>
      <li>Develop annual sales and marketing budget</li>
      <li>Plan marketing activities to increase brand awareness</li>
    </ul>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <a class="btn" href="../services.html">Back to services</a>
      <a class="btn btn-primary" href="../contact.html">Contact us</a>
    </div>
  </div>
</div></section>
```

- [ ] **Step 3: Create `src/en/services/marketing-services.njk`**

```njk
---
title: Marketing Services - Millennium Consulting Georgia
pageRelPath: services/marketing-services.html
---
<div class="page-title"><div class="container">
  <h1>Marketing Services</h1>
  <p>Brand identity, strategy, and communication support.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card list">
    <ul>
      <li>Branding and company identity</li>
      <li>Brand Identity (visual identity): brand book, logo, colour palette, typography, visual guidelines, illustrations and iconography, usage rules and examples</li>
      <li>Brand Strategy: positioning, competitor analysis, values and mission, target audience identification</li>
      <li>Brand Emotion: emotional architecture, brand personality, brand story, communication style</li>
      <li>New trademark creation</li>
      <li>Sourcing supporting materials and analysing alternatives</li>
      <li>New product development support</li>
      <li>Social media marketing: Instagram, Facebook, LinkedIn, TikTok</li>
    </ul>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <a class="btn" href="../services.html">Back to services</a>
      <a class="btn btn-primary" href="../contact.html">Contact us</a>
    </div>
  </div>
</div></section>
```

- [ ] **Step 4: Create `src/en/services/foreign-companies.njk`**

```njk
---
title: Services for Foreign Companies - Millennium Consulting Georgia
pageRelPath: services/foreign-companies.html
---
<div class="page-title"><div class="container">
  <h1>Services for Foreign Companies</h1>
  <p>Market research and partner search across Georgia, Armenia, and Azerbaijan.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card list">
    <ul>
      <li>Market research (Georgia, Armenia, Azerbaijan)</li>
      <li>Identification of potential partner companies (Georgia, Armenia, Azerbaijan)</li>
      <li>Identification of decision-makers (Georgia, Armenia, Azerbaijan)</li>
      <li>Commercial offer preparation and negotiation initiation (Georgia, Armenia, Azerbaijan)</li>
      <li>Trade fair identification, organisation, and participation (Georgia, Armenia, Azerbaijan)</li>
      <li>Sample delivery and warehousing (Georgia, Armenia, Azerbaijan)</li>
      <li>Agreement of commercial and legal terms, contracting (Georgia, Armenia, Azerbaijan)</li>
      <li>Representation services / acting as local representative (Georgia, Armenia, Azerbaijan)</li>
    </ul>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <a class="btn" href="../services.html">Back to services</a>
      <a class="btn btn-primary" href="../contact.html">Contact us</a>
    </div>
  </div>
</div></section>
```

- [ ] **Step 5: Create `src/en/services/social-media-marketing.njk`**

```njk
---
title: Social Media Marketing - Millennium Consulting Georgia
pageRelPath: services/social-media-marketing.html
---
<div class="page-title"><div class="container">
  <h1>Social Media Marketing</h1>
  <p>Content creation, design, video, copywriting, and basic targeting setup.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card list">

    <h3 style="margin-top:0;">Service</h3>
    <ul>
      <li>Page creation and setup</li>
      <li>Profile header and visual style</li>
      <li>Highlights creation and design</li>
      <li>Posting stories and posts</li>
      <li>Video and reels filming and editing, including ideas and script</li>
      <li>On-location shoots</li>
      <li>Copywriting</li>
      <li>Basic targeting setup</li>
      <li>Post design, creating visuals in Canva</li>
    </ul>

    <h3>As a mobile content creator / reels maker</h3>
    <ul>
      <li>Video filming</li>
      <li>Editing of any complexity</li>
      <li>Ideas and script</li>
      <li>Cover creation</li>
    </ul>

    <h3>Design</h3>
    <ul>
      <li>Design of images, posters, business cards, and more</li>
    </ul>

    <h3>Content for brands and businesses</h3>
    <ul>
      <li>Review and promotional videos featuring the creator</li>
      <li>UGC content creation</li>
      <li>Can act as a model or company representative for social media, presenting information in Russian, Kazakh, Turkish, and Georgian</li>
    </ul>

    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <a class="btn" href="../services.html">Back to services</a>
      <a class="btn btn-primary" href="../contact.html">Contact us</a>
    </div>

  </div>
</div></section>
```

- [ ] **Step 6: Create `src/en/services/additional-services.njk`**

```njk
---
title: Additional Services - Millennium Consulting Georgia
pageRelPath: services/additional-services.html
---
<div class="page-title"><div class="container">
  <h1>Additional Services</h1>
  <p>Additional support based on your scope and format.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card list">
    <ul>
      <li>Outsourced designer support</li>
    </ul>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <a class="btn" href="../services.html">Back to services</a>
      <a class="btn btn-primary" href="../contact.html">Contact us</a>
    </div>
  </div>
</div></section>
```

- [ ] **Step 7: Build and verify EN service pages**

```bash
npm run build
```

Check all six files exist:
```bash
ls _site/en/services/
```
Expected: `additional-services.html  existing-partner-management.html  foreign-companies.html  marketing-services.html  new-partner-acquisition.html  social-media-marketing.html`

Spot-check asset paths and lang switcher in a nested page:
```bash
grep 'assets' _site/en/services/new-partner-acquisition.html | head -3
grep 'ka/services/new-partner-acquisition' _site/en/services/new-partner-acquisition.html
```
Both should return results.

- [ ] **Step 8: Commit**

```bash
git add src/en/services/
git commit -m "feat: add EN service detail Eleventy templates"
```

---

## Task 7: KA top-level pages

**Files:**
- Create: `src/ka/index.njk`
- Create: `src/ka/services.njk`
- Create: `src/ka/about.njk`
- Create: `src/ka/contact.njk`
- Create: `src/ka/book.njk`

- [ ] **Step 1: Create `src/ka/index.njk`**

```njk
---
title: Millennium Consulting Georgia
pageRelPath: index.html
bodyClass: home-page
---
<section class="hero">
  <div class="container hero-grid">
    <div>
      <h1 class="h1">10+ წელი საერთაშორისო ვაჭრობაში<br>31 დაკონტრაქტებული პარტნიორი<br>16 ქვეყანა</h1>
      <p class="lead">ექსპორტის და მარკეტინგის სერვისების სრული ციკლი.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="book.html">დაჯავშნე კონსულტაცია</a>
        <a class="btn" href="services.html">სერვისები</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Create `src/ka/services.njk`**

```njk
---
title: სერვისები - Millennium Consulting Georgia
pageRelPath: services.html
---
<div class="page-title"><div class="container">
  <h1>სერვისები</h1>
  <p>აირჩიეთ სერვისი და ნახეთ დეტალები.</p>
</div></div>

<section class="section"><div class="container">
  <div class="svc-grid">
    <a class="svc-card" href="services/new-partner-acquisition.html">
      <h3>ახალი პარტნიორების მოზიდვა</h3>
    </a>
    <a class="svc-card" href="services/existing-partner-management.html">
      <h3>არსებული პარტნიორების მართვა</h3>
    </a>
    <a class="svc-card" href="services/marketing-services.html">
      <h3>მარკეტინგული სერვისები</h3>
    </a>
    <a class="svc-card" href="services/foreign-companies.html">
      <h3>სერვისები უცხოური კომპანიებისთვის</h3>
    </a>
    <a class="svc-card" href="services/social-media-marketing.html">
      <h3>სოციალური მედიის მარკეტინგი</h3>
    </a>
    <a class="svc-card" href="services/additional-services.html">
      <h3>დამატებითი სერვისები</h3>
    </a>
  </div>
</div></section>
```

- [ ] **Step 3: Create `src/ka/about.njk`**

```njk
---
title: ჩვენს შესახებ — Millennium Consulting Georgia
pageRelPath: about.html
---
<div class="page-title"><div class="container">
  <h1>ჩვენს შესახებ</h1>
  <p>ღვინისა და ალკოჰოლური სასმელების ექსპორტზე ორიენტირებული კონსულტაცია.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card">
    <p style="margin:0;color:rgba(245,247,250,.84)">
      Millennium Consulting Georgia სპეციალიზდება ღვინისა და ალკოჰოლური სასმელების ექსპორტში.
      ჩვენ ვმუშაობთ რეგულაციების, კომერციისა და ლოგისტიკის გადაკვეთაზე — რათა თქვენი საერთაშორისო გაყიდვები იყოს მარტივი, უსაფრთხო და შედეგიანი.
    </p>
  </div>
</div></section>
```

- [ ] **Step 4: Create `src/ka/contact.njk`**

```njk
---
title: კონტაქტი — Millennium Consulting Georgia
pageRelPath: contact.html
---
<div class="page-title"><div class="container">
  <h1>კონტაქტი</h1>
  <p>მოგვწერეთ ან დაგვირეკეთ — გიპასუხებთ მაქსიმუმ 24 საათში სამუშაო დღეებში.</p>
</div></div>

<section class="section"><div class="container">
  <div class="contact-grid">
    <div class="card contact-item"><small>ელფოსტა</small><br><a href="mailto:levan.kurdadze@mcgpartner.com">levan.kurdadze@mcgpartner.com</a></div>
    <div class="card contact-item"><small>ტელეფონი</small><br><a href="tel:+995555916644">+995 555 91 66 44</a></div>
    <div class="card contact-item"><small>LinkedIn</small><br><a target="_blank" rel="noopener" href="https://www.linkedin.com/company/millennium-consulting-georgia/">Millennium Consulting Georgia</a></div>
    <div class="card contact-item"><small>დაჯავშნა</small><br><a href="book.html">გადადით კალენდარზე →</a></div>
  </div>
</div></section>
```

- [ ] **Step 5: Create `src/ka/book.njk`**

```njk
---
title: დაჯავშნა — Millennium Consulting Georgia
pageRelPath: book.html
---
<div class="page-title"><div class="container">
  <h1>დაჯავშნე კონსულტაცია</h1>
  <p>აირჩიეთ თარიღი და დრო კალენდარში. დაჯავშნის შემდეგ მიიღებთ დადასტურებას ელფოსტაზე.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card iframe-wrap">
    <iframe src="https://calendar.app.google/57fWmYwRU34c41ndA" loading="lazy" referrerpolicy="no-referrer-when-downgrade" scrolling="no"></iframe>
  </div>
</div></section>
```

- [ ] **Step 6: Build and verify**

```bash
npm run build
ls _site/ka/
grep 'lang="ka"' _site/ka/index.html
grep 'class="active"' _site/ka/about.html | grep 'ka/'
```
All return results.

- [ ] **Step 7: Commit**

```bash
git add src/ka/
git commit -m "feat: add KA top-level Eleventy templates"
```

---

## Task 8: KA service detail pages

**Files:**
- Create: `src/ka/services/new-partner-acquisition.njk`
- Create: `src/ka/services/existing-partner-management.njk`
- Create: `src/ka/services/marketing-services.njk`
- Create: `src/ka/services/foreign-companies.njk`
- Create: `src/ka/services/social-media-marketing.njk`
- Create: `src/ka/services/additional-services.njk`

- [ ] **Step 1: Create `src/ka/services/new-partner-acquisition.njk`**

```njk
---
title: ახალი პარტნიორების მოზიდვა - Millennium Consulting Georgia
pageRelPath: services/new-partner-acquisition.html
---
<div class="page-title"><div class="container">
  <h1>ახალი პარტნიორების მოზიდვა</h1>
  <p>პოტენციური ბაზრებისა და პარტნიორების მოძიება, შეთავაზება და შეთანხმებამდე მიყვანა.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card list">
    <ul>
      <li>პოტენციური საექსპორტო ბაზრების იდენტიფიცირება და ბაზრების ანალიზი</li>
      <li>პოტენციური პარტნიორი კომპანიების იდენტიფიცირება</li>
      <li>პოტენციური პარტნიორი კომპანიების გადაწყვეტილების მიმღები პირების იდენტიფიცირება</li>
      <li>კომერციული წინადადებების ფორმირება და მოლაპარაკებების ინიცირება</li>
      <li>პროფილური გამოფენების იდენტიფიცირება, ორგანიზება და მონაწილეობის მიღება</li>
      <li>ნიმუშების გაგზავნა</li>
      <li>კომერციული, იურიდიული პირობების შეთანხმება და დაკონტრაქტება</li>
    </ul>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <a class="btn" href="../services.html">უკან სერვისებზე</a>
      <a class="btn btn-primary" href="../contact.html">დაგვიკავშირდით</a>
    </div>
  </div>
</div></section>
```

- [ ] **Step 2: Create `src/ka/services/existing-partner-management.njk`**

```njk
---
title: არსებული პარტნიორების მართვა - Millennium Consulting Georgia
pageRelPath: services/existing-partner-management.html
---
<div class="page-title"><div class="container">
  <h1>არსებული პარტნიორების მართვა</h1>
  <p>გაყიდვების დაგეგმვა, ოპერაციული მხარდაჭერა და პარტნიორებთან მიმდინარე პროცესების მართვა.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card list">
    <ul>
      <li>თვითღირებულებების და საექსპორტო ფასების ანალიზი</li>
      <li>კონკურენტების ანალიზი როგორც საერთაშორისო, ასევე ადგილობრივ ბაზარზე</li>
      <li>არსებული პარტნიორების ანალიზი და პრობლემების იდენტიფიცირება</li>
      <li>გაყიდვების დაგეგმვა და პროგნოზირება</li>
      <li>გაყიდვების გეგმის შესრულება და საოპერაციო საკითხების მართვა</li>
      <li>საექსპორტო საბუთების მომზადება</li>
      <li>Trade marketing აქტივობების დაგეგმვა პარტნიორთან</li>
      <li>წლის გაყიდვების მარკეტინგული ბიუჯეტის შემუშავება</li>
      <li>ბრენდის ცნობადობის ზრდისთვის მარკეტინგული აქტივობების დაგეგმვა</li>
    </ul>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <a class="btn" href="../services.html">უკან სერვისებზე</a>
      <a class="btn btn-primary" href="../contact.html">დაგვიკავშირდით</a>
    </div>
  </div>
</div></section>
```

- [ ] **Step 3: Create `src/ka/services/marketing-services.njk`**

```njk
---
title: მარკეტინგული სერვისები - Millennium Consulting Georgia
pageRelPath: services/marketing-services.html
---
<div class="page-title"><div class="container">
  <h1>მარკეტინგული სერვისები</h1>
  <p>ბრენდის იდენტობა, სტრატეგია და კომუნიკაცია, პრაქტიკული შედეგით.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card list">
    <ul>
      <li>ბრენდინგი და კომპანიის იდენტობა</li>
      <li>Brand Identity (ვიზუალური იდენტობა), სრული ბრენდბუქის შექმნა, ლოგოს დიზაინი, ფერთა პალიტრა, ტიპოგრაფია და შრიფტები, ვიზუალური სტილის გაიდები, ილუსტრაციები და იკონოგრაფია, გამოყენების წესები და მაგალითები</li>
      <li>Brand Strategy (ბრენდის სტრატეგია), პოზიციონირების განსაზღვრა, კონკურენტების ანალიზი, ღირებულებების და მისიის ჩამოყალიბება, სამიზნე აუდიტორიის იდენტიფიკაცია</li>
      <li>Brand Emotion, ბრენდის ემოციური არქიტექტურის აგება, ბრენდის პერსონალურობის შექმნა, ბრენდის ისტორიის ჩამოყალიბება და კომუნიკაციის სტილის განსაზღვრა</li>
      <li>ახალი სავაჭრო ნიშნის შექმნა</li>
      <li>დამხმარე მაკომპლექტებელი მასალების მოძიება და ალტერნატივების ანალიზი</li>
      <li>ახალი პროდუქტების შექმნა</li>
      <li>Social Media Marketing, Instagram, Facebook, Linkedin, TikTok</li>
    </ul>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <a class="btn" href="../services.html">უკან სერვისებზე</a>
      <a class="btn btn-primary" href="../contact.html">დაგვიკავშირდით</a>
    </div>
  </div>
</div></section>
```

- [ ] **Step 4: Create `src/ka/services/foreign-companies.njk`**

```njk
---
title: სერვისები უცხოური კომპანიებისთვის - Millennium Consulting Georgia
pageRelPath: services/foreign-companies.html
---
<div class="page-title"><div class="container">
  <h1>სერვისები უცხოური კომპანიებისთვის</h1>
  <p>ბაზრის კვლევა და პარტნიორების მოძიება საქართველოში, სომხეთსა და აზერბაიჯანში.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card list">
    <ul>
      <li>ბაზრის კვლევა (საქართველო, სომხეთი, აზერბაიჯანი)</li>
      <li>პოტენციური პარტნიორი კომპანიების იდენტიფიცირება (საქართველო, სომხეთი, აზერბაიჯანი)</li>
      <li>გადაწყვეტილების მიმღები პირების იდენტიფიცირება (საქართველო, სომხეთი, აზერბაიჯანი)</li>
      <li>კომერციული წინადადებების ფორმირება და მოლაპარაკებების ინიცირება (საქართველო, სომხეთი, აზერბაიჯანი)</li>
      <li>პროფილური გამოფენების იდენტიფიცირება, ორგანიზება და მონაწილეობის მიღება (საქართველო, სომხეთი, აზერბაიჯანი)</li>
      <li>ნიმუშების მიწოდება და დასაწყობება (საქართველო, სომხეთი, აზერბაიჯანი)</li>
      <li>კომერციული და იურიდიული პირობების შეთანხმება და დაკონტრაქტება (საქართველო, სომხეთი, აზერბაიჯანი)</li>
      <li>წარმომადგენლობითი მოვალეობების შეთავსება (საქართველო, სომხეთი, აზერბაიჯანი)</li>
    </ul>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <a class="btn" href="../services.html">უკან სერვისებზე</a>
      <a class="btn btn-primary" href="../contact.html">დაგვიკავშირდით</a>
    </div>
  </div>
</div></section>
```

- [ ] **Step 5: Create `src/ka/services/social-media-marketing.njk`**

```njk
---
title: სოციალური მედიის მარკეტინგი - Millennium Consulting Georgia
pageRelPath: services/social-media-marketing.html
---
<div class="page-title"><div class="container">
  <h1>სოციალური მედიის მარკეტინგი</h1>
  <p>კონტენტის შექმნა, დიზაინი, ვიდეო, კოპირაითინგი და საბაზისო ტარგეტირება.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card list">

    <h3 style="margin-top:0;">სერვისი</h3>
    <ul>
      <li>გვერდის შექმნა და გაფორმება</li>
      <li>პროფილის შაპკა და ვიზუალური სტილი</li>
      <li>აქტუალური სტორის შექმნა და გაფორმება</li>
      <li>პოსტებისა და სტორის გამოქვეყნება</li>
      <li>ვიდეოების/რილსების გადაღება და მონტაჟი, იდეა და სცენარი</li>
      <li>გასვლითი გადაღებები</li>
      <li>კოპირაითინგი</li>
      <li>საბაზისო ტარგეტის დაყენება</li>
      <li>პოსტების დიზაინი, Canva-ში ვიზუალების შექმნა</li>
    </ul>

    <h3>მობილოგრაფი / რილსმეიქერი</h3>
    <ul>
      <li>ვიდეოს გადაღება</li>
      <li>ნებისმიერი სირთულის მონტაჟი</li>
      <li>იდეა და სცენარი</li>
      <li>ქავერის შექმნა</li>
    </ul>

    <h3>დიზაინი</h3>
    <ul>
      <li>სურათების, პოსტერების, ვიზიტკების და სხვა დიზაინის შექმნა</li>
    </ul>

    <h3>კონტენტი ბრენდებისთვის</h3>
    <ul>
      <li>მიმოხილვითი და სარეკლამო ვიდეოების გადაღება ბიზნესებისთვის, საკუთარი მონაწილეობით</li>
      <li>UGC კონტენტის შექმნა</li>
      <li>მოდელის ან კომპანიის წარმომადგენლის როლი სოციალური მედიისთვის, ინფორმაციის წარდგენა რუსულ, ყაზახურ, თურქულ და ქართულ ენებზე</li>
    </ul>

    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <a class="btn" href="../services.html">უკან სერვისებზე</a>
      <a class="btn btn-primary" href="../contact.html">დაგვიკავშირდით</a>
    </div>

  </div>
</div></section>
```

- [ ] **Step 6: Create `src/ka/services/additional-services.njk`**

```njk
---
title: დამატებითი სერვისები - Millennium Consulting Georgia
pageRelPath: services/additional-services.html
---
<div class="page-title"><div class="container">
  <h1>დამატებითი სერვისები</h1>
  <p>დამატებითი მხარდაჭერა თქვენი ამოცანებისა და ფორმატის მიხედვით.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card list">
    <ul>
      <li>დიზაინერი აუთსორსზე</li>
    </ul>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <a class="btn" href="../services.html">უკან სერვისებზე</a>
      <a class="btn btn-primary" href="../contact.html">დაგვიკავშირდით</a>
    </div>
  </div>
</div></section>
```

- [ ] **Step 7: Build and verify**

```bash
npm run build
ls _site/ka/services/
grep 'lang="ka"' _site/ka/services/new-partner-acquisition.html
grep '../../assets' _site/ka/services/new-partner-acquisition.html
```
All return results.

- [ ] **Step 8: Commit**

```bash
git add src/ka/services/
git commit -m "feat: add KA service detail Eleventy templates"
```

---

## Task 9: RU top-level pages

**Files:**
- Create: `src/ru/index.njk`
- Create: `src/ru/services.njk`
- Create: `src/ru/about.njk`
- Create: `src/ru/contact.njk`
- Create: `src/ru/book.njk`

- [ ] **Step 1: Create `src/ru/index.njk`**

```njk
---
title: Millennium Consulting Georgia
pageRelPath: index.html
bodyClass: home-page
---
<section class="hero">
  <div class="container hero-grid">
    <div>
      <h1 class="h1">10+ лет в международной торговле<br>31 контрактный партнёр<br>16 стран</h1>
      <p class="lead">Полный цикл экспортных и маркетинговых услуг.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="book.html">Записаться</a>
        <a class="btn" href="services.html">Услуги</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Create `src/ru/services.njk`**

```njk
---
title: Услуги - Millennium Consulting Georgia
pageRelPath: services.html
---
<div class="page-title"><div class="container">
  <h1>Услуги</h1>
  <p>Выберите услугу, чтобы посмотреть детали.</p>
</div></div>

<section class="section"><div class="container">
  <div class="svc-grid">
    <a class="svc-card" href="services/new-partner-acquisition.html">
      <h3>Привлечение новых партнёров</h3>
    </a>
    <a class="svc-card" href="services/existing-partner-management.html">
      <h3>Управление текущими партнёрами</h3>
    </a>
    <a class="svc-card" href="services/marketing-services.html">
      <h3>Маркетинговые услуги</h3>
    </a>
    <a class="svc-card" href="services/foreign-companies.html">
      <h3>Услуги для иностранных компаний</h3>
    </a>
    <a class="svc-card" href="services/social-media-marketing.html">
      <h3>Маркетинг в социальных сетях</h3>
    </a>
    <a class="svc-card" href="services/additional-services.html">
      <h3>Дополнительные услуги</h3>
    </a>
  </div>
</div></section>
```

- [ ] **Step 3: Create `src/ru/about.njk`**

```njk
---
title: О нас — Millennium Consulting Georgia
pageRelPath: about.html
---
<div class="page-title"><div class="container">
  <h1>О нас</h1>
  <p>Специализация: экспорт вина и алкогольной продукции.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card">
    <p style="margin:0;color:rgba(245,247,250,.84)">
      Millennium Consulting Georgia соединяет грузинское качество с международным спросом.
      Мы совмещаем регуляторные требования, коммерцию и логистику — чтобы экспорт был понятным, безопасным и результативным.
    </p>
  </div>
</div></section>
```

- [ ] **Step 4: Create `src/ru/contact.njk`**

```njk
---
title: Контакты — Millennium Consulting Georgia
pageRelPath: contact.html
---
<div class="page-title"><div class="container">
  <h1>Контакты</h1>
  <p>Свяжитесь с нами — ответим в течение 24 рабочих часов.</p>
</div></div>

<section class="section"><div class="container">
  <div class="contact-grid">
    <div class="card contact-item"><small>Email</small><br><a href="mailto:levan.kurdadze@mcgpartner.com">levan.kurdadze@mcgpartner.com</a></div>
    <div class="card contact-item"><small>Телефон</small><br><a href="tel:+995555916644">+995 555 91 66 44</a></div>
    <div class="card contact-item"><small>LinkedIn</small><br><a target="_blank" rel="noopener" href="https://www.linkedin.com/company/millennium-consulting-georgia/">Millennium Consulting Georgia</a></div>
    <div class="card contact-item"><small>Запись</small><br><a href="book.html">Открыть календарь →</a></div>
  </div>
</div></section>
```

- [ ] **Step 5: Create `src/ru/book.njk`**

```njk
---
title: Запись — Millennium Consulting Georgia
pageRelPath: book.html
---
<div class="page-title"><div class="container">
  <h1>Запись на консультацию</h1>
  <p>Выберите дату и время. После бронирования придёт подтверждение на email.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card iframe-wrap">
    <iframe src="https://calendar.app.google/57fWmYwRU34c41ndA" loading="lazy" referrerpolicy="no-referrer-when-downgrade" scrolling="no"></iframe>
  </div>
</div></section>
```

- [ ] **Step 6: Build and verify**

```bash
npm run build
ls _site/ru/
grep 'lang="ru"' _site/ru/index.html
grep 'Главная' _site/ru/index.html
```

- [ ] **Step 7: Commit**

```bash
git add src/ru/
git commit -m "feat: add RU top-level Eleventy templates"
```

---

## Task 10: RU service detail pages

**Files:**
- Create: `src/ru/services/new-partner-acquisition.njk`
- Create: `src/ru/services/existing-partner-management.njk`
- Create: `src/ru/services/marketing-services.njk`
- Create: `src/ru/services/foreign-companies.njk`
- Create: `src/ru/services/social-media-marketing.njk`
- Create: `src/ru/services/additional-services.njk`

- [ ] **Step 1: Create `src/ru/services/new-partner-acquisition.njk`**

```njk
---
title: Привлечение новых партнёров - Millennium Consulting Georgia
pageRelPath: services/new-partner-acquisition.html
---
<div class="page-title"><div class="container">
  <h1>Привлечение новых партнёров</h1>
  <p>Поиск рынков и партнёров, коммерческие предложения, переговоры и контрактование.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card list">
    <ul>
      <li>Идентификация потенциальных экспортных рынков и анализ рынков</li>
      <li>Идентификация потенциальных компаний-партнёров</li>
      <li>Идентификация лиц, принимающих решения, в компаниях-партнёрах</li>
      <li>Формирование коммерческих предложений и инициирование переговоров</li>
      <li>Поиск профильных выставок, организация и участие</li>
      <li>Отправка образцов</li>
      <li>Согласование коммерческих и юридических условий, заключение договоров</li>
    </ul>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <a class="btn" href="../services.html">Назад к услугам</a>
      <a class="btn btn-primary" href="../contact.html">Связаться с нами</a>
    </div>
  </div>
</div></section>
```

- [ ] **Step 2: Create `src/ru/services/existing-partner-management.njk`**

```njk
---
title: Управление текущими партнёрами - Millennium Consulting Georgia
pageRelPath: services/existing-partner-management.html
---
<div class="page-title"><div class="container">
  <h1>Управление текущими партнёрами</h1>
  <p>Планирование продаж, операционные вопросы и сопровождение экспортных процессов.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card list">
    <ul>
      <li>Анализ себестоимости и экспортных цен</li>
      <li>Анализ конкурентов на международном и локальном рынке</li>
      <li>Анализ текущих партнёров и выявление проблем</li>
      <li>Планирование и прогнозирование продаж</li>
      <li>Выполнение плана продаж и управление операционными вопросами</li>
      <li>Подготовка экспортных документов</li>
      <li>Планирование trade marketing активностей совместно с партнёром</li>
      <li>Разработка годового бюджета продаж и маркетинга</li>
      <li>Планирование активностей для повышения узнаваемости бренда</li>
    </ul>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <a class="btn" href="../services.html">Назад к услугам</a>
      <a class="btn btn-primary" href="../contact.html">Связаться с нами</a>
    </div>
  </div>
</div></section>
```

- [ ] **Step 3: Create `src/ru/services/marketing-services.njk`**

```njk
---
title: Маркетинговые услуги - Millennium Consulting Georgia
pageRelPath: services/marketing-services.html
---
<div class="page-title"><div class="container">
  <h1>Маркетинговые услуги</h1>
  <p>Брендинг, визуальная идентичность, стратегия и коммуникации.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card list">
    <ul>
      <li>Брендинг и идентичность компании</li>
      <li>Brand Identity (визуальная идентичность): брендбук, логотип, цветовая палитра, типографика, визуальные гайды, иллюстрации и иконография, правила использования</li>
      <li>Brand Strategy: позиционирование, анализ конкурентов, ценности и миссия, целевая аудитория</li>
      <li>Brand Emotion: эмоциональная архитектура, личность бренда, история бренда и стиль коммуникации</li>
      <li>Создание нового товарного знака</li>
      <li>Поиск вспомогательных материалов и анализ альтернатив</li>
      <li>Поддержка создания новых продуктов</li>
      <li>Social Media Marketing: Instagram, Facebook, LinkedIn, TikTok</li>
    </ul>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <a class="btn" href="../services.html">Назад к услугам</a>
      <a class="btn btn-primary" href="../contact.html">Связаться с нами</a>
    </div>
  </div>
</div></section>
```

- [ ] **Step 4: Create `src/ru/services/foreign-companies.njk`**

```njk
---
title: Услуги для иностранных компаний - Millennium Consulting Georgia
pageRelPath: services/foreign-companies.html
---
<div class="page-title"><div class="container">
  <h1>Услуги для иностранных компаний</h1>
  <p>Исследование рынка и поиск партнёров в Грузии, Армении и Азербайджане.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card list">
    <ul>
      <li>Исследование рынка (Грузия, Армения, Азербайджан)</li>
      <li>Поиск потенциальных компаний-партнёров (Грузия, Армения, Азербайджан)</li>
      <li>Определение лиц, принимающих решения (Грузия, Армения, Азербайджан)</li>
      <li>Подготовка коммерческих предложений и инициирование переговоров (Грузия, Армения, Азербайджан)</li>
      <li>Поиск профильных выставок, организация и участие (Грузия, Армения, Азербайджан)</li>
      <li>Поставка и хранение образцов (Грузия, Армения, Азербайджан)</li>
      <li>Согласование коммерческих и юридических условий, заключение договоров (Грузия, Армения, Азербайджан)</li>
      <li>Представительские функции (Грузия, Армения, Азербайджан)</li>
    </ul>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <a class="btn" href="../services.html">Назад к услугам</a>
      <a class="btn btn-primary" href="../contact.html">Связаться с нами</a>
    </div>
  </div>
</div></section>
```

- [ ] **Step 5: Create `src/ru/services/social-media-marketing.njk`**

```njk
---
title: Social Media Marketing - Millennium Consulting Georgia
pageRelPath: services/social-media-marketing.html
---
<div class="page-title"><div class="container">
  <h1>Social Media Marketing</h1>
  <p>Оформление страниц, контент, видео, дизайн и базовый таргет.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card list">

    <h3 style="margin-top:0;">Услуги</h3>
    <ul>
      <li>создание и оформление страницы</li>
      <li>шапка профиля и визуал</li>
      <li>создание и оформление актуальных сторис</li>
      <li>выкладывать посты и сторис</li>
      <li>сьемка и монтаж видеороликов/рилсов (идей/сценарий)</li>
      <li>выездные сьемки</li>
      <li>копирайтинг</li>
      <li>настройка базового таргета</li>
      <li>дизайн постов (создание картинок через canva)</li>
    </ul>

    <h3>В качестве мобилографа/рилсмейкера</h3>
    <ul>
      <li>сьемка видео</li>
      <li>монтаж любой сложности</li>
      <li>идей и сценарий</li>
      <li>создание обложки</li>
    </ul>

    <h3>Дизайн</h3>
    <ul>
      <li>создание дизайна картинок/постеров/визиток и тд</li>
    </ul>

    <h3>Контент для брендов</h3>
    <ul>
      <li>снимать обзоры/рекламные видеоролики для брендов и бизнесов с участием себя</li>
      <li>в качестве UGC тоже работаю</li>
      <li>могу сниматься в качестве модели/представителя компании для их соцсетей, на русском/казахском/турецком и грузинском языках</li>
    </ul>

    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <a class="btn" href="../services.html">Назад к услугам</a>
      <a class="btn btn-primary" href="../contact.html">Связаться с нами</a>
    </div>

  </div>
</div></section>
```

- [ ] **Step 6: Create `src/ru/services/additional-services.njk`**

```njk
---
title: Дополнительные услуги - Millennium Consulting Georgia
pageRelPath: services/additional-services.html
---
<div class="page-title"><div class="container">
  <h1>Дополнительные услуги</h1>
  <p>Дополнительная поддержка под ваши задачи и формат.</p>
</div></div>

<section class="section"><div class="container">
  <div class="card list">
    <ul>
      <li>Дизайнер на аутсорсе</li>
    </ul>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <a class="btn" href="../services.html">Назад к услугам</a>
      <a class="btn btn-primary" href="../contact.html">Связаться с нами</a>
    </div>
  </div>
</div></section>
```

- [ ] **Step 7: Build and do a full count check**

```bash
npm run build
find _site -name '*.html' | wc -l
```
Expected: `34` (33 content pages + 1 root redirect, once added in Task 11).
At this point it should show `33`.

- [ ] **Step 8: Commit**

```bash
git add src/ru/services/
git commit -m "feat: add RU service detail Eleventy templates"
```

---

## Task 11: Root redirect + final verification

**Files:**
- Create: `src/index.html`

- [ ] **Step 1: Copy the root redirect into src/**

```bash
cp index.html src/index.html
```

- [ ] **Step 2: Build and count all output files**

```bash
npm run build
find _site -name '*.html' | sort
```

Expected 34 files:
```
_site/en/about.html
_site/en/book.html
_site/en/contact.html
_site/en/index.html
_site/en/services.html
_site/en/services/additional-services.html
_site/en/services/existing-partner-management.html
_site/en/services/foreign-companies.html
_site/en/services/marketing-services.html
_site/en/services/new-partner-acquisition.html
_site/en/services/social-media-marketing.html
_site/index.html
_site/ka/about.html
... (same pattern for ka and ru)
```

- [ ] **Step 3: Spot-check a service page for correct nested paths**

```bash
grep 'stylesheet' _site/en/services/new-partner-acquisition.html
grep 'main.js' _site/en/services/new-partner-acquisition.html
grep 'ka/services/new-partner-acquisition' _site/en/services/new-partner-acquisition.html
grep 'class="active"' _site/en/services/new-partner-acquisition.html
```

Expected results:
- `href="../../assets/css/style.css"`
- `src="../../assets/js/main.js"`
- `href="../../ka/services/new-partner-acquisition.html"`
- `class="active"` on the EN flag link

- [ ] **Step 4: Spot-check a top-level page**

```bash
grep 'stylesheet' _site/ka/index.html
grep 'class="active"' _site/ka/index.html | grep 'ka/'
grep 'home-page' _site/ka/index.html
```

Expected: `../assets/css/style.css`, KA flag has active class, body has `class="home-page"`.

- [ ] **Step 5: Commit**

```bash
git add src/index.html
git commit -m "feat: complete Eleventy migration — all 34 pages building from src/"
```

---

## Task 12: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

This replaces the manual "upload files to GitHub Pages" approach. On every push to `main`, it builds with Eleventy and deploys `_site/` via the Pages API. You must also update your GitHub Pages settings to use GitHub Actions as the source (Settings → Pages → Source → GitHub Actions).

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: _site

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Add `_site` to .gitignore**

```bash
echo "_site" >> .gitignore
echo "node_modules" >> .gitignore
git add .gitignore
```

- [ ] **Step 3: Commit and push**

```bash
git add .github/workflows/deploy.yml .gitignore
git commit -m "ci: add GitHub Actions workflow for Eleventy build + Pages deploy"
git push origin main
```

- [ ] **Step 4: Update GitHub Pages source**

In your repo on GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions**. Save. The workflow will trigger on the push from Step 3 and the site will deploy from `_site/`.

- [ ] **Step 5: Verify the deployment**

After the Actions workflow completes (1–2 min), open the live URL and check:
- `https://USERNAME.github.io/REPO/ka/` — Georgian home page loads
- `https://USERNAME.github.io/REPO/en/services/new-partner-acquisition.html` — nav, active flag, and content correct
- Hamburger menu works on mobile viewport

---

## Self-Review

**Spec coverage:**
- ✅ Single `base.njk` for all nav/footer (one-file changes)
- ✅ All 33 content pages migrated with exact translated content
- ✅ Language switcher hrefs derived from `pageRelPath` — no hardcoding per-file
- ✅ Asset paths (`../assets` vs `../../assets`) derived from depth — no hardcoding
- ✅ `bodyClass: home-page` only on index pages
- ✅ GitHub Actions workflow replaces manual deploy
- ✅ Old HTML files preserved at root until user confirms live site is good
- ✅ RU book-button inconsistency ("Запись" vs "Бронирование") normalised to "Запись"

**Placeholder scan:** No TBDs, no "implement later", all code blocks complete.

**Type consistency:** `pageRelPath` used consistently across all templates and `base.njk`. `navHome` / `navServices` / `navAbout` / `navContact` / `bookBtn` / `lang` used consistently between data files and layout.
