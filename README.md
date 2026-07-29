# Dr. Aravind Menon — Meridian Health Clinic

The finalised four-page website, exactly as previewed. No build step, no Node.js,
nothing to install.

```
/
├── index.html        Home
├── about.html        About the doctor
├── blog.html         Journal
├── contact.html      Contact + appointment form
├── 404.html          Not-found page
├── support.js        Page runtime — REQUIRED, must be committed
├── favicon.ico
├── robots.txt
├── sitemap.xml
├── README.md
└── assets/
    ├── dr-portrait.jpg, care-child.jpg, team-*.jpg   (7 photographs)
    └── icons/        favicon.svg, apple-touch-icon, PWA icons, webmanifest
```

## Publishing on GitHub Pages

1. Push **every file in this folder** to the repository root — `index.html` and
   `support.js` must sit at the top level, not inside a subfolder.
2. **Settings → Pages → Source:** *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. Save. The site is live at `https://<username>.github.io/<repo>/` within a minute or two.

All paths are relative, so the same files work from a domain root, a project
subfolder, or a custom domain. Netlify, Vercel and Cloudflare Pages need no
configuration either — no build command, publish directory `/`.

> **Requires an internet connection.** The pages load React from unpkg.com and the
> three typefaces from Google Fonts. Opening `index.html` straight off your disk
> works too, as long as you are online.

## Editing the details

Search and replace across the four HTML files:

| Placeholder | Replace with |
|---|---|
| `Dr. Aravind Menon` | the doctor's name |
| `Meridian Health Clinic` | the practice name |
| `Consultant Physician` | the role shown under the logo |
| `+91 98765 43210` | displayed phone number |
| `+919876543210` | the number inside `tel:` links — no spaces |
| `care@meridianclinic.in` | email address |
| `4th Floor, Ashwin Towers` | building |
| `12 Lavelle Road, Bengaluru 560001` | street and postcode |
| `KMC 84512` | medical registration number |
| `Lavelle+Road+Bengaluru` | the Google Maps search query |

Also review the biography, timeline, credentials, testimonials, statistics and
article list — all of it is placeholder copy.

`robots.txt` and `sitemap.xml` use the placeholder host
`https://meridianclinic.example`; replace it with your real address.

Photographs live in `assets/`. To swap one, save your own file over the existing
name and update the `width` / `height` attributes on that `<img>` tag so the
browser still reserves the right amount of space.

## The appointment form

Static hosting cannot process form submissions, so the form validates in the
browser and then shows a confirmation panel. **Nothing is transmitted or stored.**
Name, phone, preferred date and reason are required; the message is optional.

To receive real submissions, point it at a hosted form endpoint (Formspree,
Netlify Forms, Basin) and remove the `send()` handler in `contact.html`.

## Design notes

- Palette `#0eaca1` on `#ffffff`. Every button and accent uses a gradient fill —
  there are no flat-colour fills in the design.
- Type: Sora (headings), Manrope (body), Instrument Serif (pull quotes).
- A reflective highlight sweeps across buttons, cards and images on hover or tap;
  cards lift; sections reveal on scroll; pages cross-fade when navigating.
- Mobile first — single column with a full-screen menu below 920px, fluid
  `clamp()` type, 44px+ tap targets, and `prefers-reduced-motion` honoured.
- Photographs are sized to their display dimensions, declare intrinsic
  width/height (no layout shift) and lazy-load below the fold.

---

© Meridian Health Clinic. Content on the site is general information and not a
substitute for consultation.
