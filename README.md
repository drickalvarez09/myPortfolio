# Portfolio

Personal portfolio website for Heidrick Alvarez, a full stack web developer. The site presents an introduction, technical skills, selected projects, work experience, and contact information.

**Live site:** https://drickalvarez09.github.io/myPortfolio/

## Tech Stack

- HTML5
- CSS3 (custom styles with Tailwind CSS utilities)
- Vanilla JavaScript
- Google Fonts
- GitHub Pages for hosting

No frameworks or build step are required to view the site. Tailwind is used only to compile the stylesheet.

## Project Structure

```
portfolio/
├── index.html              # Main page markup
├── css/
│   ├── style.css           # Custom design system and components
│   └── tailwind.css        # Compiled Tailwind output
├── js/
│   └── script.js           # Navigation, animations, interactions
├── images/
│   ├── og-card.jpg         # Social sharing preview image
│   └── projects/           # Project screenshots (WebP)
├── src/
│   └── tailwind-input.css  # Tailwind source file
├── tailwind.config.js      # Tailwind configuration
└── package.json            # Build scripts and dependencies
```

## Running Locally

Clone the repository and open `index.html` in a browser. Alternatively, serve the directory with a simple local server:

```bash
npx serve .
```

## Editing Styles

Custom styles live in `css/style.css` and are written directly. Tailwind utility classes are compiled from `src/tailwind-input.css` into `css/tailwind.css`.

After changing Tailwind classes or configuration, rebuild the stylesheet:

```bash
npm install
npm run build:css
```

For development, use watch mode:

```bash
npm run watch:css
```

## Deployment

The site is deployed with GitHub Pages from the `main` branch. To publish changes:

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

The live site updates automatically after the push.

## Content Updates

- **Text and sections:** edit `index.html`.
- **Project cards:** edit the project section in `index.html` and place images in `images/projects/`.
- **Résumé:** replace `Heidrick_Alvarez_Resume.pdf` in the project root.
- **Social preview:** update `images/og-card.jpg` (1200 × 630 px recommended).

## Contact

- GitHub: [drickalvarez09](https://github.com/drickalvarez09)
- Live site: [drickalvarez09.github.io/myPortfolio](https://drickalvarez09.github.io/myPortfolio/)
