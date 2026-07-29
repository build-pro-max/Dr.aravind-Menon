# Dr. Aravind Menon — Meridian Health Clinic

A five-page static website. Plain HTML, one stylesheet, one script. No build step,
no Node.js, no dependencies to install. Open `index.html` in a browser and it works.

---

## Structure

```
/
├── index.html                 Home
├── about.html                 About the doctor
├── services.html              Specialities in detail
├── contact.html               Contact + appointment request form
├── blog/
│   └── index.html             Journal (with category filtering)
├── 404.html                   Not-found page
├── favicon.ico
├── robots.txt
├── sitemap.xml
├── README.md
└── assets/
    ├── css/style.css          Every style rule on the site
    ├── js/site.js             Every line of script on the site
    ├── images/                7 optimised JPEGs
    └── icons/                 favicon.svg, apple-touch-icon, PWA icons, webmanifest
```

There is no `assets/fonts/` directory: the three typefaces (Sora, Manrope,
Instrument Serif) are served from Google Fonts, which is the licensed and
cache-efficient way to use them. See “Self-hosting the fonts” below if you would
rather bundle them.

---

## Deploying

Every asset path is relative, so the same files work from a domain root, a
project subfolder, or the local filesystem. No configuration files are needed
for any of these hosts.

### GitHub Pages
1. Create a repository and push the contents of this folder to the repository **root**
   (so `index.html` sits at the top level, not inside a subfolder).
2. **Settings → Pages → Source:** *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. Save. The site is live at `https://<username>.github.io/<repo>/` in a minute or two.

GitHub Pages serves `404.html` automatically for unknown paths.

### Netlify
Drag the folder onto the Netlify dashboard, or connect the repository and leave
the build command empty with the publish directory set to `/`.

### Vercel
Import the repository, framework preset **Other**, no build command,
output directory `/`.

### Cloudflare Pages
Connect the repository, framework preset **None**, build command empty,
build output directory `/`.

---

## Before you go live — two find-and-replace passes

**1. The site URL.** Canonical links, Open Graph tags, `robots.txt` and
`sitemap.xml` all use the placeholder `https://meridianclinic.example`.
Replace that exact string with your real address everywhere, for example
`https://drmenon.github.io/clinic` or `https://meridianclinic.in`.

**2. The clinic's details.** The content is written around a placeholder
identity. Replace these strings across all five HTML files:

| Placeholder | Replace with |
|---|---|
| `Dr. Aravind Menon` | the doctor's name |
| `Meridian Health Clinic` | the practice name |
| `Consultant Physician` | the role shown under the logo |
| `+91 98765 43210` | displayed phone number |
| `+919876543210` | phone number in `tel:` links — no spaces or `+` formatting |
| `care@meridianclinic.in` | email address |
| `4th Floor, Ashwin Towers` | building |
| `12 Lavelle Road, Bengaluru 560001` | street and postcode |
| `KMC 84512` | medical registration number |
| `Lavelle+Road+Bengaluru` | the Google Maps search query |

Also review the biography, timeline, credentials, testimonials, statistics and
article list — all of it is placeholder copy.

Photographs live in `assets/images/`. To swap one, save your own file over the
existing name and update the `width` / `height` attributes on that `<img>` tag
so the browser still reserves the right amount of space.

---

## The appointment form

Static hosting cannot process form submissions, so the form validates in the
browser and then shows a confirmation panel. **Nothing is transmitted or stored.**

To receive real submissions, point the form at any hosted form endpoint —
Formspree, Netlify Forms, Basin, Google Forms — by giving the `<form>` element in
`contact.html` an `action` and `method`, and removing the `submit` handler in
`assets/js/site.js` (the `initForm` function). The field `name` attributes
(`name`, `phone`, `date`, `reason`, `message`) are already set for that.

---

## What the script does

`assets/js/site.js` is ~250 lines of vanilla JavaScript with no dependencies:

- reveals sections as they scroll into view (and immediately if the browser
  restores a scroll position, so nothing can stay invisible)
- opens and closes the mobile menu, locks the page behind it, closes on `Esc`
- cross-fades between pages and smooth-scrolls same-page anchors
- filters journal articles by category
- validates the appointment form and shows the confirmation
- fills in the current year in the footer

The site remains readable and navigable with JavaScript disabled: all reveal
animations are progressive enhancements and every link is a real `<a href>`.

---

## Accessibility & performance notes

- Semantic landmarks throughout (`header`, `nav`, `main`, `section`, `footer`,
  `article`, `figure`, `address`), one `h1` per page, sequential headings.
- Skip-to-content link, visible focus rings, `aria-current` on the active nav
  item, `aria-pressed` on the filters, `aria-invalid` on failed fields,
  `role="status"` on the confirmation.
- Every interactive target is at least 44px tall.
- All seven images are sized to their display dimensions, declare intrinsic
  `width`/`height` (no layout shift) and lazy-load below the fold; the hero
  photograph is preloaded.
- `prefers-reduced-motion` disables every animation and reveal.
- No console errors, no external scripts, no trackers.
- Print stylesheet included.

---

## Colour & type

| Token | Value |
|---|---|
| Primary | `#0eaca1` |
| Gradient | `#2ad3c5 → #0eaca1 → #06817a` |
| Surface | `#ffffff` |
| Body text | `#4a615f` |
| Headings | Sora 600/700 |
| Body | Manrope 400/500/600 |
| Pull quotes | Instrument Serif |

Buttons and accents use gradient fills only — there are no flat-colour fills
anywhere in the design. Buttons, cards and images carry a reflective highlight
that sweeps across them on hover or tap.

---

## Self-hosting the fonts (optional)

If you would rather not call Google Fonts:

1. Download the families from <https://fonts.google.com> (all three are licensed
   under the SIL Open Font License, so self-hosting is permitted).
2. Put the `.woff2` files in `assets/fonts/`.
3. Replace the `<link>` to `fonts.googleapis.com` in each HTML file with a link
   to a small `assets/css/fonts.css` containing `@font-face` rules that use
   `font-display: swap`.

---

© Meridian Health Clinic. Content on the site is general information and not a
substitute for consultation.
