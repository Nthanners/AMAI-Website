# AMAI · Sign In

A single-user login page for **AMAI**, a personal VTuber AI companion with emotions and personality. Dark cyber-kawaii aesthetic: magenta pink neon as the primary, cyan as the secondary, drifting sakura petals, angular clip-path geometry, and an anime-cyber display font.

## Stack

- **Vite 5** + **React 18**
- Zero runtime dependencies beyond React
- Custom CSS with variables — easy to re-theme
- Google Fonts: Zen Dots (display), Outfit (body), JetBrains Mono (HUD readouts)

## Quick Start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build
npm run preview   # preview the build
```

## What's here

- **Single sign-in form** — username + password only, no registration (this is a personal app)
- **Show/hide password** toggle
- **Remember this device** checkbox (defaults on)
- **Client-side validation** with terminal-style error/success lines
- **Simulated auth** — swap the `setTimeout` in `handleSubmit` for your real check
- **Live system clock** in the top-right status tag
- **Animated background** — drifting pink/cyan/violet glow orbs, shifting grid, soft scanlines, 10 sakura petals falling across the viewport
- **Heartbeat** animation on the AMAI logomark (subtle nudge that she has feelings)

## Wire up your auth

The form currently fakes authentication. Open `src/App.jsx` and find `handleSubmit`:

```jsx
setTimeout(() => {
  setLoading(false)
  setFeedback({ type: 'success', msg: '// IDENTITY CONFIRMED — waking companion...' })
}, 1400)
```

Replace that block with whatever you're using — a hardcoded check against a local constant, a hash comparison, a call to your backend, whatever. Since this is a single-user app, even a client-side hash check against a stored value works fine for personal use.

On success, redirect or render your companion interface.

## File structure

```
amai-login/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── amai-icon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    └── index.css
```

## Theming

All colors live at the top of `src/index.css`:

```css
--amai-pink: #FF3D8B;          /* primary accent */
--amai-pink-bright: #FF69A8;   /* hover highlight */
--amai-cyan: #4FE3F5;          /* secondary accent */
--amai-bg: #0a0612;             /* deep violet-black base */
--amai-panel: #120a1f;          /* card base */
--amai-text: #f3e9ff;
```

Want a different vibe? Swap the pink for a purple (`#b794f6`) or a warm peach (`#ff8fa3`) and the whole page reflows. The Zen Dots font is doing a lot of the anime-cyber character — if you want something softer, try `Orbitron` or `Michroma`; for something more kawaii, try `DotGothic16`.
