# Millennium Consulting Georgia – Website

Official multilingual website for **Millennium Consulting Georgia**, a consulting agency specializing in **wine and alcohol export**.

The website is built as a **static site** and is optimized for **GitHub Pages** hosting.  
It supports **three languages** (Georgian, English, Russian) and includes an integrated **Google Appointment Schedule** for booking consultations.

---

## 🌍 Live Structure

- **Default language:** Georgian (`/ka`)
- **Additional languages:** English (`/en`), Russian (`/ru`)
- **Automatic redirect:** `/` → `/ka/`

---

## 📁 Repository Structure

```
/
├── index.html              # Redirects to /ka/
├── assets/
│   ├── css/
│   │   └── style.css       # Global styles (branding, layout, animations)
│   ├── js/
│   │   └── main.js         # Navigation logic + scroll effects
│   └── img/
│       └── logo.png        # Company logo (PNG)
├── ka/                     # Georgian pages
│   ├── index.html
│   ├── services.html
│   ├── about.html
│   ├── contact.html
│   └── book.html
├── en/                     # English pages
│   └── (same structure)
└── ru/                     # Russian pages
    └── (same structure)
```

---

## 🧭 Navigation & UX Features

- Sticky header with **premium scroll behavior**
  - Logo shrinks on scroll
  - Header background becomes more solid
  - Subtle shadow for depth
- Language switcher using **flag icons (Flaticon CDN)**
- Mobile-responsive layout
- Clean, sales-focused copy

---

## 📅 Booking System

The **Book now** page embeds a **Google Appointment Schedule**.

Features:
- Real-time availability
- Automatic blocking of booked slots
- Holiday & non-working hour support
- Email confirmation to visitors
- Notifications sent to company email

No backend or database required.

---

## 🌐 Hosting (GitHub Pages)

This site is designed to be hosted **for free** on GitHub Pages.

### Deployment steps:
1. Upload all files to a **public GitHub repository**
2. Go to **Settings → Pages**
3. Select:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
4. Save and wait 1–2 minutes

Your site will be available at:
```
https://USERNAME.github.io/REPOSITORY_NAME/
```

---

## 🎨 Branding Notes

- Logo is PNG-based (`assets/img/logo.png`)
- Company name is embedded in the logo (no text in header)
- Brand colors are defined in CSS variables for easy changes

---

## 🏳️ Flag Icons & Attribution

Flag icons are loaded via **Flaticon CDN** (no local images required).

Attribution (as required by license) is included in the website footer.

Sources:
- Georgia flag – Flaticon
- UK flag – Freepik / Flaticon
- Russia flag – Freepik / Flaticon

---

## 🔧 Customization

You can easily:
- Update text content per language
- Replace the logo (keep filename `logo.png`)
- Adjust brand colors in `style.css`
- Change booking calendar link in `book.html`

---

## 📞 Contact

**Millennium Consulting Georgia**  
📧 levan.kurdadze@mcgpartner.com  
📞 +995 555 91 66 44  
🔗 https://www.linkedin.com/company/millennium-consulting-georgia/

---

© Millennium Consulting Georgia
