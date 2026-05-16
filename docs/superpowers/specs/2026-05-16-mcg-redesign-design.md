# MCG Site Redesign — Design Spec
**Date:** 2026-05-16  
**Scope:** Design system overhaul + four inner pages (Services, About, Contact, Markets) for English. KA/RU get CSS and nav updates automatically; Markets stub pages added for KA/RU.

---

## 1. Design System

### Colors
| Variable | Value | Usage |
|---|---|---|
| `--dark` | `#101820` | Nav, hero, footer background |
| `--dark-mid` | `#1A2535` | Stats band, markets band |
| `--brand` | `#009ACE` | Buttons, accents, rule lines, highlights |
| `--light` | `#F5F7FA` | Alternating section backgrounds |
| `--white` | `#FFFFFF` | Primary section backgrounds |
| `--text` | `#1A2535` | Body text on light backgrounds |
| `--text-muted` | `#5A7184` | Secondary text on light backgrounds |
| `--text-inv` | `#EAF2FB` | Text on dark backgrounds |
| `--text-inv-muted` | `rgba(234,242,251,.65)` | Secondary text on dark |
| `--border` | `#DDE3EA` | Card borders, dividers |
| `--radius` | `6px` | Card border radius |

### Typography
- **Headings:** Oswald (300, 400, 500, 600) — always uppercase, tight letter-spacing
- **Body:** Manrope (400, 500, 600)
- Both loaded from Google Fonts, replacing current Cormorant Garamond + Jost

### Recurring Detail Patterns
- 3px left `--brand` border on accent cards and active/first items
- Ghost oversized Oswald numbers for stats (large, low opacity)
- Card containers on `--border` 1px gap background
- Thin `--brand` horizontal rule lines under section headings

### Section Color Sequence (homepage)
1. Nav — `--dark`
2. Hero — `--dark` (background photo)
3. Stats bar — `--dark-mid`
4. Services — `--white`
5. About teaser — `--light`
6. Process — `--white`
7. Partner map — `--white`
8. Markets band — `--dark-mid`
9. CTA band — `--brand`
10. Footer — `--dark`

### Inner Page Hero
- Dark background (`--dark`), ~280px tall
- Oswald uppercase page title
- Manrope muted subtitle
- No background photo

---

## 2. CSS Strategy

**Full rewrite of `src/assets/css/style.css`.** The existing file has two conflicting layers (original dark theme + appended homepage overrides) and is internally inconsistent. The rewrite keeps all existing class names where possible so templates need minimal changes.

File structure:
1. `:root` tokens
2. Reset + base
3. Typography
4. Navigation (sticky, dark, scroll-shrink, hamburger)
5. Buttons + language switcher
6. Hero (homepage variant with bg photo, inner page variant)
7. Stats band
8. Sections (`.section`, `.section--light`)
9. Cards (`.card`, `.svc-card`, `.service-card`)
10. Services grid
11. About (homepage teaser + About page)
12. Process grid
13. Markets band + Leaflet map overrides
14. CTA band
15. Footer
16. Responsive breakpoints (980 / 920 / 640 / 480)
17. Reduced motion

---

## 3. Navigation & Footer (`base.njk`)

### Changes
- Replace Google Fonts import: drop Cormorant Garamond + Jost, load Oswald + Manrope
- Add Markets nav link between About and Contact:
  ```html
  <a href="{{ base }}markets.html">{{ navMarkets }}</a>
  ```
- Nav order: Home · Services · Markets · About · Contact
- Footer: restyled via CSS only — no template structural changes

### New JSON key (all 3 language files)
```json
"nav_markets": "Markets"    // en.json
"nav_markets": "ბაზრები"    // ka.json
"nav_markets": "Рынки"      // ru.json
```

---

## 4. Services Pages

### Hub page (`src/en/services.njk`)
- Inner page hero: "Our Services" / subtitle
- 5 cards in a grid (3-col desktop, 2-col tablet, 1-col mobile)
- Each card: 3px left `--brand` border, service title in Oswald, one-line teaser, arrow link to sub-page
- Content driven from `en.json` under `services_hub`

### 5 Sub-pages
Each follows: inner hero → description section (white) → "What's Included" section (F5F7FA) → CTA card.

Content driven from `en.json` under `services_detail[service_key]`.

| Sub-page | Key "What's Included" bullets |
|---|---|
| `new-partner-acquisition` | Market selection, partner research, decision-maker ID, commercial offers, trade fair attendance, sample dispatch, contracting |
| `existing-partner-management` | Relationship management, performance monitoring, pricing updates, issue resolution, upsell/cross-sell support |
| `marketing-services` | Market positioning, brand development, trade event representation, promotional strategy, social media content, platform management, campaign reporting |
| `foreign-companies` | Market entry analysis, regulatory guidance, distributor ID, commercial negotiation |
| `additional-services` | Trainings, ISO certification support — **placeholder content, full list TBD** |

### `social-media-marketing.njk`
Files kept in place (EN/KA/RU) to avoid 404s. No longer linked from the services hub. Content absorbed into `marketing-services`.

### KA/RU services pages
No structural changes. CSS update applies automatically. Content in `ka.json`/`ru.json` under same keys.

---

## 5. About Page (`src/en/about.njk`)

**Framing:** Founder's background presented as firm experience. No named individuals, no team section. MCG voice throughout.

### Layout
1. Inner hero: "About MCG" / "Built on Real Export Experience"
2. Intro section (white): 3–4 paragraphs establishing MCG's origin, winery background, client value proposition
3. Credentials band (F5F7FA): 4 stat blocks in a row — ghost Oswald numbers, Manrope labels. Pulls from `en.stats` already in JSON
4. "What We Bring" section (white): 3 cards with `--brand` rule, Oswald heading, 2–3 sentence body
   - Export Networks
   - Regulatory Know-How
   - Brand Positioning
5. CTA card: "Let's talk about your market" → contact.html

### Data
Flat prose fields under `about_page` key in JSON (no team array). Easy to add team section later.

---

## 6. Contact Page (`src/en/contact.njk`)

### Layout
- Inner hero: "Get in Touch" / "We reply within 24 business hours"
- 2-column grid (white background):
  - **Left — form:** Name, Company, Email, Message (textarea), Service dropdown, Submit
  - **Right — details:** Email, Phone, LinkedIn, Booking link — each with Oswald label + Manrope value, separated by `--border` lines

### Form Fields
```
Name *
Company
Email *
Message *
Service interest (dropdown):
  New Partner Acquisition
  Existing Partner Management
  Marketing
  Services for Foreign Companies
  Additional Services
```

### Form Behaviour
`method="POST"`, `action=""` placeholder. Comment in template indicates where to wire Formspree/Netlify Forms. No fake submission logic.

### Data
Form labels, placeholder text, and details block stored in `contact_page` key in all 3 JSON files.

---

## 7. Markets Page (`src/en/markets.njk` — new)

### Layout
1. Inner hero: "Our Markets" / "An established network spanning Europe, Asia, and North America"
2. Full-width Leaflet map (white bg) — same dark tile layer, `--brand` dot markers, popup style as homepage
3. Flat country tag list (flex-wrap, pill style) below map — all 16 countries

### Countries (16 total)
Europe: Germany, Poland, Netherlands, United Kingdom, France, Czech Republic, Latvia, Estonia, Lithuania, Ukraine  
Asia-Pacific: China, Japan, South Korea, Kazakhstan  
North America: United States, Canada

Lithuania added to JSON with coordinates `lat: 55.17, lng: 23.88`.

### KA/RU Markets Pages
Stub pages created at `src/ka/markets.njk` and `src/ru/markets.njk`. Same template structure, content from respective JSON files. Region/country names already translated in `ka.json`/`ru.json`.

### Data
- Map markers remain in `markets.countries` array (add Lithuania)
- Flat country name list for the tag display stored under `markets_page.countries_flat` in JSON

---

## 8. JSON Data Changes Summary

All changes applied to `en.json`, `ka.json`, and `ru.json` unless noted EN-only.

| Key | Change |
|---|---|
| `nav_markets` | New — nav link label for Markets |
| `services_hub` | New — hub page headline, subtitle, 5 card teasers |
| `services_detail` | New — per-service headline, body paragraphs, bullet lists |
| `about_page` | New — intro paragraphs, "what we bring" card content |
| `contact_page` | New — form labels, placeholder text, details block |
| `markets_page` | New — hero subtitle, flat country list |
| `markets.countries` | Add Lithuania `{lat: 55.17, lng: 23.88}` |

---

## 9. File Changes Summary

### Modified
- `src/assets/css/style.css` — full rewrite
- `src/_includes/base.njk` — font imports, Markets nav link
- `src/_data/en.json` — new keys per section 8
- `src/_data/ka.json` — new keys per section 8
- `src/_data/ru.json` — new keys per section 8
- `src/en/services.njk` — hub page redesign
- `src/en/services/new-partner-acquisition.njk` — expanded layout
- `src/en/services/existing-partner-management.njk` — expanded layout
- `src/en/services/marketing-services.njk` — expanded layout (absorbs social media)
- `src/en/services/foreign-companies.njk` — expanded layout
- `src/en/services/additional-services.njk` — expanded layout (placeholder)
- `src/en/about.njk` — full redesign
- `src/en/contact.njk` — full redesign with form

### Created
- `src/en/markets.njk` — new page
- `src/ka/markets.njk` — new stub
- `src/ru/markets.njk` — new stub
- `docs/superpowers/specs/2026-05-16-mcg-redesign-design.md` — this file

### Unchanged (templates)
- `src/en/index.njk` — template unchanged; visual appearance will update via CSS rewrite (expected)
- `src/en/book.njk` — not in scope
- `src/ka/*.njk` (except markets stub) — templates unchanged; CSS rewrite applies automatically
- `src/ru/*.njk` (except markets stub) — templates unchanged; CSS rewrite applies automatically
- `src/en/services/social-media-marketing.njk` — kept, no longer linked from hub
- `src/ka/services/social-media-marketing.njk` — kept, no longer linked from hub
- `src/ru/services/social-media-marketing.njk` — kept, no longer linked from hub
- `.github/workflows/` — not in scope
- `.eleventy.js` — not in scope

---

## 10. Mobile Responsiveness

Breakpoints carried over from existing CSS:
- **980px:** service card grid drops to 2-col
- **920px:** nav collapses to hamburger, hero text shrinks, stat grids go 2-col
- **640px:** all grids go 1-col
- **480px:** service cards go 1-col if still 2-col at 640

Every new page section tested against these breakpoints before marking done.
