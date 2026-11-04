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
| `work-*.jpg` | Selected Work stills, exported from the reel with ffmpeg |

## Customize before going live
- Set real pricing (and the editing-speed assumptions) at the top of `script.js`
- Booking delivery: paste a Formspree endpoint into `FORM_ENDPOINT` in `script.js`. Until then the form opens the visitor's email app addressed to `erwinurbano@urbanlifevisuals.com`; it never shows a "sent" confirmation it can't back up
- Add a short bio, home base / service area, and real client testimonials
- For each portfolio piece, add your role and the deliverables (e.g. "Shot & edited — 3-min highlight film + 400 photos")
- ~~Update **contact** info~~ — done: `erwinurbano@urbanlifevisuals.com`, `(707) 704-9567`
- ~~Placeholder stats~~ — removed until there are verified numbers

## Reference
Design language inspired by 47industries.com — dark, bold, technical.
