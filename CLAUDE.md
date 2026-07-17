# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static multi-page marketing site for **DUMETAL** (container sales, rental, fit-out — French). No build step, no framework, no package manager: hand-written HTML + `style.css` + two vanilla JS files, with **Tailwind loaded from CDN**. Deploys as-is to GitHub Pages / Vercel / Netlify.

## Run locally

```powershell
python -m http.server 8080
```
Then open http://localhost:8080. There is no build, lint, or test step — edit a file and refresh.

## Architecture

**Shared page chrome lives in [main.js](main.js), not in the HTML.** Each page ships only its unique `<body>` content plus two empty mount points, `<div id="site-header">` and `<div id="site-footer">`. On load, the IIFE in [main.js](main.js) replaces them with the real header/footer and also injects: the floating WhatsApp/phone buttons (`.fab`), the LocalBusiness JSON-LD, and the before/after image slider behaviour (`.ba`). It highlights the active nav link by matching `NAV[].key` against `document.body.dataset.page` — so **every page must set `<body data-page="...">`** to the right key.

To change the menu, footer, logo, or contact details, edit the `NAV`, `SERVICES`, `CONTACT`, and `LOGO` constants at the top of [main.js](main.js) — never the individual pages.

**The quote form** ([devis.html](devis.html)) is driven by [form.js](form.js): a 6-step wizard (step 7 is the confirmation screen) with per-step validation, then POSTs the collected lead as JSON to `WEBHOOK_URL`. If the webhook is unset it falls back to a prefilled `mailto:`. On success it pushes a `generate_lead_container` event to `dataLayer` for GA4 conversion tracking.

## Config values that are duplicated — keep them in sync

There is no config file; these live inline and must be changed in **every** listed place:

- **`WEBHOOK_URL` + `FALLBACK_EMAIL`** — in [form.js](form.js) **and** in the inline `<script>` of [contact.html](contact.html) (the two forms are independent).
- **GA4 measurement ID `G-XXXXXXXXXX`** — hard-coded in the `<head>` of every `*.html` page.
- **SEO meta** — canonical / Open Graph / Twitter tags are per-page in each `<head>`; the base URL is the GitHub Pages path `https://williamcesaremedia-hub.github.io/Dumetal/`. New pages must also be added to [sitemap.xml](sitemap.xml).
- **Design tokens** — the palette and fonts exist twice: as CSS custom properties in `:root` of [style.css](style.css) and as `tailwind.config` in each page's `<head>`. Brand: green `#507817`, serif `Merriweather` (headings), sans `Lato` (body).

## Styling conventions

Utility classes are Tailwind (CDN); anything stateful or reusable (header, buttons `.btn`/`.btn-primary`, cards, `.fab`, `.ba` slider, `.form-step`, animations) is in [style.css](style.css), keyed off the `--green` / `--ink` / `--muted` / `--line` CSS variables. Prefer those variables over raw hex so both themes stay consistent.

## Adding a page

1. Copy an existing page's `<head>` (fonts, GA4, Tailwind config, `style.css` link) and update the SEO/canonical/OG tags.
2. Set `<body data-page="...">` and add a matching entry to `NAV` (or `SERVICES`) in [main.js](main.js) if it belongs in the menu.
3. Include the `#site-header` / `#site-footer` mount divs and load `main.js` (+ `form.js` only if the page has the quote form).
4. Add the URL to [sitemap.xml](sitemap.xml).

> Note: [README.md](README.md) predates several pages (transformation, amenagements, conception, faq, realisations) and still lists a 4-step form — trust the code over the README where they disagree.
