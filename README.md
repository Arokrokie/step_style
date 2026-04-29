# ICT Coursework — Step Style → Pullman Theme

This repository contains a small static website (Step Style) restyled using
elements and layout inspired by the Pullman template while preserving the
brand colors (navy `#1a2a6c` and gold `#f4c542`). The site is plain HTML/CSS/JS
and organized for easy editing and local preview.

## Contents

- `pages/` — main site HTML pages (home, shop categories, cart, login, community, etc.)
- `static/css/` — primary stylesheet `pullman-style.css` (theme, layout, components)
- `static/js/` — site scripts (auth, order, UI helpers)
- `images/` — media used across pages

## Features

- Unified Pullman-inspired theme adapted to Step Style brand colors
- Componentized header/footer and consistent container widths (`container-lg`)
- Polished cards, buttons, product tiles, and reduced vertical spacing for density
- Mobile-responsive layout using Bootstrap utilities and custom CSS variables

## Local preview

The site is static — open the pages directly in your browser. From the
project root you can open `pages/index.html` in a browser to preview the home page.

Recommended quick preview (Windows):

1. Open File Explorer and navigate to the repository folder.
2. Double-click `pages/index.html` to open it in your default browser.

If you have `Live Server` or another static HTTP server installed, run it at
the project root to serve pages over `http://localhost` for full relative-path
consistency.

## Deployment

- The project can be hosted using GitHub Pages by pushing this repository to
	a GitHub repo and enabling Pages (from the `main` branch, `/pages` or root).
- Note: a push from this environment previously failed due to DNS/network
	resolution. Run `git push -u origin main` from a network-enabled machine or
	your local PC to publish changes.

## Contributing

- Edit HTML files in `pages/` and centralize style changes in
	`static/css/pullman-style.css`.
- Try to avoid inline styles; prefer theme variables in the stylesheet.

## Credits

- Pullman template (visual inspiration) — adapted styling only.

## Next steps

- Finalize remaining inline-style cleanup (optional).
- Run cross-browser visual QA and accessibility checks.

If you want, I can update this README with deployment commands or a more
detailed file map; tell me what you prefer and I will add it.
