# CLAUDE.md

## Project overview
MCG is a multilingual static website for an export/import and marketing agency specializing in alcoholic beverages (wine, spirits) and general import/export. Tone is B2B premium. The site runs in three languages: Georgian (`/ka/`), English (`/en/`), Russian (`/ru/`).

## Stack
- Eleventy (11ty) static site generator
- Nunjucks templating (`.njk`)
- Per-language JSON data files (`ka.json`, `en.json`, `ru.json`) drive all page content
- Plain CSS, no framework
- Hosted on GitHub Pages, built and deployed via GitHub Actions on push to `main`

## Repo and live URL
- Repo: https://github.com/Luka9815/MCG
- Live: https://luka9815.github.io/MCG/

## Key commands
```bash
npm install              # install dependencies
npm run start            # local dev server with live reload
npm run build            # build static output to _site/
git push origin main     # deploys automatically via GitHub Actions
```

## File structure
```
MCG/
├── src/
│   ├── _includes/
│   │   └── base.njk           # shared layout: head, nav, footer, scripts
│   ├── _data/
│   │   ├── ka.json            # Georgian content
│   │   ├── en.json            # English content
│   │   └── ru.json            # Russian content
│   ├── ka/                    # Georgian pages: index, services, about, contact, book
│   ├── en/                    # English pages
│   ├── ru/                    # Russian pages
│   ├── assets/
│   │   ├── css/
│   │   ├── img/               # includes home-bg.png
│   │   └── js/
│   └── index.html             # root redirect / default landing
├── .github/workflows/         # GitHub Actions deploy workflow
├── .eleventy.js               # Eleventy config
├── package.json
└── _site/                     # build output, gitignored
```

## Design conventions
- Background: `#101820` (dark theme)
- Brand blue: `#009ACE`
- Glassmorphism cards: semi-transparent surface, backdrop blur
- Sticky navigation with blurred backdrop and scroll-shrink behavior
- Hero uses `home-bg.png` background with left-anchored text
- 3-column services grid on desktop, stacks on mobile
- Mobile hamburger menu already implemented; do not duplicate

## CSS class conventions
- Reuse existing section and utility classes before adding new ones
- Section blocks follow `.section`, `.section--hero`, `.section--services` pattern
- Cards: `.card`, `.card--glass`
- Pull spacing and colour values from CSS variables in the main stylesheet, not raw hex
- Avoid per-page CSS files; route shared rules through the global stylesheet

## Do not touch
- URL structure (`/ka/`, `/en/`, `/ru/`) must be preserved exactly. Internal links and the language switcher depend on it.
- Georgian typography and UTF-8 encoding. Do not normalize, transliterate, or "fix" Georgian text.
- Asset filenames referenced across all three language versions. If you must rename, update all three.
- `.github/workflows/` deploy file unless explicitly fixing deployment.
- GitHub Pages source setting must remain "GitHub Actions", not a branch. Changing this breaks deploys.

## Workflow

### Branching
- Work directly on `main` for content edits, small fixes, and design polish.
- Use a feature branch only for risky structural changes (build config, language scaffolding, layout rewrites).
- Commit messages: short imperative subject, context in the body if useful.

### Deployment
- Push to `main` triggers the GitHub Actions workflow, which builds Eleventy and deploys to GitHub Pages.
- Live site updates within 1-2 minutes of a green workflow run.
- If a deploy fails, check the Actions tab first; do not retry by force-pushing.

### Editing rules
- Read the codebase before making any change. Map what you're about to touch.
- Route structural changes through `base.njk` and shared CSS, not per-page edits.
- Content goes in `_data/*.json`, not hard-coded into templates.
- Any structural change (new section, new component, new field) must update `ka.json`, `en.json`, and `ru.json` in the same commit so the three languages stay in sync.
- Test mobile and desktop after every visual change.
- Verify the language switcher and nav links still work after any layout change.

### Design vs implementation split
- Visual design iteration happens in Claude.ai chat as rendered artifacts. Faster, more token-efficient.
- Claude Code implements approved designs into the Eleventy templates, runs builds, and handles QA and deploys.
- Do not freelance major design decisions in Claude Code; bring them back to chat first.

---

# [CLAUDE.md](http://CLAUDE.md)

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
