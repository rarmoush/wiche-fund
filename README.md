# WICHE Oncology Endowed Fund

A single static page for the **WICHE Oncology Endowed Fund**, a named endowment for cancer patient care at the American University of Beirut Medical Center (AUBMC / AUH Beirut). Gifts go to AUB’s US-registered 501(c)(3). This is not the Cancer Support Fund.

No framework. One HTML page with the CSS inlined in the head, and a small deferred script. The page is a short read: October banner, hero, four numbers, one bar chart, four steps, Give, and Share. Sources, other ways to give, and the October note to a friend sit in collapsed details. System fonts only (Georgia / system sans). No AUB logo or maroon wordmark (text only until Advancement clears branding).

No photographs of patients, faces, hospital beds, or stock “sick people.” Empty case slots stay off the page until written consent and AUBMC sign-off; the consent template is an HTML comment. The only ribbon is one `<symbol id="ribbon-mark">` in `index.html`, reused with `<use>` in the October banner. The same path is the October favicon and the October card. This page is not AUBMC’s Cancer Support Fund and not the Lebanese Breast Cancer Foundation.

## Open locally

Any static server works. From this directory:

```bash
python3 -m http.server 43147 --bind 127.0.0.1
```

Then open [http://127.0.0.1:43147/](http://127.0.0.1:43147/).

Or open `index.html` directly. Share buttons need an `http` origin to build a real URL; `file://` will still copy whatever the browser reports.

Regenerate the Open Graph images (1200×630, no faces, no logo). Both cards use cream and plum. The October card draws the same `ribbon-mark` path as the page, in rose (`#c2185b`), and writes `favicon-october.svg` from that path:

```bash
python3 generate-og.py
```

Requires Pillow and CairoSVG (`pip install pillow cairosvg`). Uses Liberation fonts on this machine. CairoSVG rasterizes the page’s ribbon path; it does not draw a second shape.

The script writes two cards:

- `og-image.png` — standing card.
- `og-image-october.png` — October card. Headline: “Breast cancer is the most common cancer in Lebanon.”

During October 2026, `index.html` points `og:image` and `twitter:image` at `og-image-october.png`. After 31 October 2026, switch both back to `og-image.png`.

## October 2026

`CAMPAIGN_OCTOBER` in `app.js` is the one switch. While it is `true`, and the date is on or before 2026-10-31, the script shows the October banner and the collapsed “Ask a friend” note, uses October share text, and sets `utm_campaign=wiche_october`. The favicon is `favicon-october.svg` (the same ribbon path). After 2026-10-31 those items go even if the flag is still `true`, and the favicon returns to `favicon.svg`. The page stays cream (`#fffaf1`) and plum (`#2d1829` / `#441f41`). Set the flag to `false` to turn the campaign off sooner. A few lines in the document head hide the banner before paint when it was dismissed or the date has passed. The script is loaded with `defer`.

No match line is on the page. Add one only after a named donor confirms the amount and the deadline in writing. The banner carries an HTML comment and nothing else about a match.

Crawlers do not run the script, so the October Open Graph image stays until you change the meta tags.

## Give button

Every Give control points to [https://giving.aub.edu.lb/](https://giving.aub.edu.lb/) and opens in a new tab. Visible helper text: **Designation: WICHE Oncology Endowed Fund**. Amount chips are UI-only; they do not pre-fill AUB’s form and do not take payment on this page.

## What is still pending

- **Matching donor** — do not publish a match until a named donor confirms the amount and the deadline in writing.
- **Dedicated AUB giving URL** — swap `https://giving.aub.edu.lb/` for a fund-specific AUB Advancement link when it exists.
- **Written consent before naming any patient** — the case-card template is an HTML comment, not a visible empty grid. Fill only after the patient and AUBMC have signed consent. Do not invent names, quotes, costs, or status. Do not add photos or silhouettes.
- **Founder note** — the page shows only “A note from the founder, Randa Armoush, is coming soon.” Replace that line when she supplies her own words. Do not draft them.
- **After 31 October 2026** — remove the October banner and point `og:image` and `twitter:image` back to `og-image.png`. Set `CAMPAIGN_OCTOBER` to `false` in `app.js`. The script already hides the banner, the ask-a-friend block, and the October share text after that date. The cream and plum layout stays.
- **Dollar figures** — fund disbursement amounts, ceilings, and treatment-cost dollar ranges are deliberately excluded from the page at the principal’s instruction. Do not add them. Giving-form amount chips and the check-mailing copy stay as UI for AUB’s portal only.
- **Diagnosis breakdown** — three July 2026 breast-cancer cases are the only diagnoses supplied. Categories for the other nine patients are pending from AUBMC. Do not infer. Recorded in an HTML comment on the Lebanon section.
- **EIN 13-5596846** — shown in Transparency with a note that Advancement should confirm it for receipts.
- **Branding** — no AUB logo or maroon wordmark until Advancement clears it.
- **Open Graph absolute URL** — during October 2026, `og:image` and `twitter:image` are `og-image-october.png`. After 31 October, switch them back to `og-image.png`. When this page has a public host, replace whichever file is current with a full `https://` URL so WhatsApp and LinkedIn unfurl correctly.
- **Arabic / French** — not in v1 (`lang=en` only).
- **Employer match lookup** — mentioned under “Other ways to give” and marked not available yet.

## Editorial rules (do not relax)

- Legal name, exactly: WICHE Oncology Endowed Fund.
- Do not fabricate patients, quotes, statistics, survival rates, hospital figures, or donor testimonials.
- No patient photos, full names, medical records, or prognosis.
- Do not publish bank account numbers, routing numbers, or invented payment flows.
- Do not use charity clichés. Do not claim what a dollar buys. Do not claim a percentage reaching patients. Do not invent a corpus.
- Do not publish this fund’s disbursed dollars, a per-patient ceiling, or AUBMC treatment-cost dollar ranges. The principal asked that money stay off the page.
- The $3 million / $120,000 figure is AUB’s spending-policy illustration, not this fund’s size.
- Non-US donors: no deductibility claim.

## Tax line (required wording)

AUB is a 501(c)(3) organization registered in the US. Gifts are tax-deductible to the extent permitted by US law. This is not tax advice; consult your own advisor.
