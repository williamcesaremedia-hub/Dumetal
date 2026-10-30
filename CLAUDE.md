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

**Shared page chrome lives in [main.js](main.js), not in the HTML.** Each page ships only its unique `<body>` content plus two empty mount points, `<div id="site-header">` and `<div id="site-footer">`. On load, the IIFE in [main.js](main.js) replaces them with the real header/footer and also injects: the floating phone button (`.fab`), the LocalBusiness JSON-LD, and the before/after image slider behaviour (`.ba`). It highlights the active nav link by matching `NAV[].key` against `document.body.dataset.page` — so **every page must set `<body data-page="...">`** to the right key.

To change the menu, footer, logo, or contact details, edit the `NAV`, `SERVICES`, `CONTACT`, and `LOGO` constants at the top of [main.js](main.js) — never the individual pages.

**The quote form** ([devis.html](devis.html)) is driven by [form.js](form.js): a 5-step wizard (step 6 is the confirmation screen) with per-step validation, then POSTs the collected lead as JSON to `WEBHOOK_URL` — the webhook of the Make scenario **DUMETAL — Formulaires du site vers la boîte mail** (id 10061993, team 2267566), which emails it to the DUMETAL mailbox. The payload's `form` field (`devis` or `contact`) selects the route inside that scenario, so renaming it breaks delivery silently. If Make is unreachable or over quota, both handlers fall back to a prefilled `mailto:` rather than showing an error — a lead is never lost on a transport failure. On success it pushes a `generate_lead_container` event to `dataLayer`, which is the Google Ads / GA4 conversion trigger in GTM.

## Config values that are duplicated — keep them in sync

There is no config file; these live inline and must be changed in **every** listed place:

- **`WEBHOOK_URL` + `FALLBACK_EMAIL`** — in [form.js](form.js) **and** in the inline `<script>` of [contact.html](contact.html) (the two forms are independent, each posts to the same Make webhook with its own `form` value).
- **Google Tag Manager container `GTM-TNJSLC3C`** — inlined in the `<head>` of **all 15 pages**, plus the `<noscript>` iframe after each `<body>`. Immediately above it, an inline Consent Mode v2 block denies all four signals by default, with `wait_for_update: 500`, `url_passthrough` and `ads_data_redaction`.
- **The consent UI is Axeptio, loaded inside GTM — there is no banner in this codebase.** Axeptio sends the `consent update`. The hardcoded default above is kept on purpose and must not be removed as "redundant": Axeptio loads *inside* the container, therefore after GTM itself, so without that default a tag could fire before any consent state is known. Both defaults are `denied`, so they cannot conflict.
- **GA4 and Google Ads tags are configured inside GTM, never in the code.** [main.js](main.js) does not load `gtag.js` and holds no consent logic at all. Adding a GA4 snippet back to the pages would double-count every hit.
- **Conversion trigger** — both forms push `event: 'generate_lead_container'` to `dataLayer` ([form.js](form.js) and the inline script of [contact.html](contact.html)). That is the event to trigger the Google Ads conversion on in GTM.
- **SEO meta** — canonical / Open Graph / Twitter tags are per-page in each `<head>`; the base URL is the custom domain `https://conteneurdumetal.fr/` (declared by the root `CNAME` file). New pages must also be added to [sitemap.xml](sitemap.xml).
- **Design tokens** — the palette and fonts exist twice: as CSS custom properties in `:root` of [style.css](style.css) and as `tailwind.config` in each page's `<head>`. Brand: green `#507817`, serif `Merriweather` (headings), sans `Lato` (body).

## Styling conventions

Utility classes are Tailwind (CDN); anything stateful or reusable (header, buttons `.btn`/`.btn-primary`, cards, `.fab`, `.ba` slider, `.form-step`, animations) is in [style.css](style.css), keyed off the `--green` / `--ink` / `--muted` / `--line` CSS variables. Prefer those variables over raw hex so both themes stay consistent.

## Adding a page

1. Copy an existing page's `<head>` (fonts, Tailwind config, favicons, `style.css` link) and update the SEO/canonical/OG tags. Keep the Consent Mode block and the GTM snippet, in that order, and the `<noscript>` iframe after `<body>`. Do **not** add a GA4 snippet — GA4 lives in GTM.
2. Set `<body data-page="...">` and add a matching entry to `NAV` (or `SERVICES`) in [main.js](main.js) if it belongs in the menu.
3. Include the `#site-header` / `#site-footer` mount divs and load `main.js` (+ `form.js` only if the page has the quote form).
4. Add the URL to [sitemap.xml](sitemap.xml).

> Note: [README.md](README.md) predates several pages (transformation, amenagements, conception, faq, realisations) and still lists a 4-step form — trust the code over the README where they disagree.
