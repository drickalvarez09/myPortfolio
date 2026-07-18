/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/**/*.js"],
  theme: {
    // Aligned to the breakpoints already used in css/style.css so the two
    // systems don't fight each other (900px = tablet/mobile switch, 560px = small phones).
    screens: {
      sm: '560px',
      md: '900px',
      lg: '1200px',
    },
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-alt': 'var(--bg-alt)',
        'bg-deep': 'var(--bg-deep)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        border: 'var(--border)',
        'border-soft': 'var(--border-soft)',
        blue: 'var(--blue)',
        'blue-bright': 'var(--blue-bright)',
        'blue-deep': 'var(--blue-deep)',
        text: 'var(--text)',
        'text-dim': 'var(--text-dim)',
        'text-faint': 'var(--text-faint)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'var(--radius-sm)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
      },
      maxWidth: {
        site: 'var(--max-w)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    // The site's own reset already zeroes out margins/etc; avoid Tailwind's
    // preflight fighting with the hand-written base styles in style.css.
    preflight: false,
  },
}

