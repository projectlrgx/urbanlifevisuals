# Urbanlifevisuals — Film, Photography & Multimedia

A dark, interactive website for a filmmaking, photography, and multimedia studio. Plain HTML/CSS/JS — no build step, no dependencies.

## Preview
Open `index.html`, or run a local server:
```bash
cd Urbanlifevisuals-Agency
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Sections
- **Hero** with the Urbanlifevisuals reel as a looping background video
- **Animated count-up stats**
- **Infinite services marquee**
- **Services** — Weddings, Corporate & Commercial, Events, Portraits & Headshots, Music Videos & Creative, Drone/Real Estate/Content
- **Selected Work** with click-to-enlarge lightbox
- **Process** (Consult → Plan → Shoot → Edit & Deliver)
- **Quote builder** — sliders estimate a starting package price
- **CTA band + booking form + footer**

## Media (in `assets/`)
| File | Used for |
|---|---|
| `hero-reel.mp4` | Hero background (60s cut of the reel, letterbox cropped, ~7 MB) |
| `hero-reel-poster.jpg` | Hero video poster |
| `work-*.jpg` | Selected Work cards (replace with portfolio shots) |

## Customize before going live
- Replace placeholder **stats** in `index.html` with real numbers
- Set real **pricing** at the top of the quote builder in `script.js`
- ~~Update **contact** info~~ — done: `erwinurbano@urbanlifevisuals.com`, `(707) 704-9567`
- Wire the **booking form** to a service (Formspree/Netlify) — currently front-end only
- Swap **Selected Work** images for real portfolio shots

## Reference
Design language inspired by 47industries.com — dark, bold, technical.
