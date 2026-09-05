# Copilot Instructions for "Cozy Twilight" Birthday Page

## Project Overview

**Cozy Twilight** is an interactive, animated birthday celebration webpage. It's a single-page application built with vanilla HTML, CSS, and JavaScript—no build tools or frameworks. The experience is deeply personal, featuring a cozy twilight aesthetic with warm pastel colors and delightful interactive elements.

**Tech Stack:**
- HTML5 (semantic structure with ARIA labels for accessibility)
- CSS3 (CSS custom properties, CSS Grid, animations, gradients)
- Vanilla JavaScript (ES6+)
- Web Audio API (for the "Happy Birthday" melody)
- HTML5 Canvas (for confetti particle system)

## Running the Project

### Local Development Server

Start a local server on port 4599:

```bash
python3 -m http.server 4599
```

Then visit `http://localhost:4599` in your browser. The page is fully functional with no build step required.

**From launch.json:** The project is configured for debugging via Python's HTTP server on port 4599.

## Architecture & Code Organization

### File Structure

- **index.html** — Semantic structure with six main sections (hero, cake, gift, gallery, letter, footer)
- **script.js** — All interactivity; organized by feature with clear section headers
- **styles.css** — Visual design with CSS custom properties, animations, and responsive layout

### Script Organization (script.js)

The script is divided into logical sections, each marked with comment headers:

1. **CONFIG** — Customization point at the top (name, signature)
2. **Ambient Effects** — Stars, string lights (visual atmosphere)
3. **Hero Section** — Title letter-by-letter reveal, name glow, copy fade-in
4. **Confetti Particle System** — Canvas-based particle animation (burst & rain)
5. **Floating Hearts** — Click-to-emit heart/sparkle effects
6. **Balloons** — Interactive popping balloons with respawn logic
7. **Cake & Candles** — Flame flickering, blow-out interaction, wish sequence
8. **Gift** — Unwrap animation with confetti
9. **Gallery** — Polaroid-style photo grid with focus states
10. **Letter** — Word-by-word reveal animation
11. **Scroll-Triggered Reveals** — IntersectionObserver for section animations
12. **Music Box** — Web Audio melody (Happy Birthday)
13. **Initialization** — Wires everything together

### CSS Organization (styles.css)

- **CSS Variables** (`--root`) — Complete color palette, fonts, shadows, and animation easings
- **Ambient Layers** — Sky gradient, stars, string lights, vignette
- **Interactive Elements** — Buttons, balloons, cake, gift, gallery, letter card
- **Animations** — Keyframes for twinkling, glowing, bouncing, revealing, and transitions
- **Responsive Design** — Mobile-first approach with media queries for different screen sizes

### Palette & Typography

**Colors (defined in CSS):**
- Deep plum night (`--night: #2a2140`) and dusk (`--dusk: #3d2e4d`)
- Warm accents: honey (`#FFC97A`), peach (`#FFB4A2`), rose (`#F7A9C4`), mint (`#A8E0D0`)
- Warm cream text (`#FFF4E9`) on dark backgrounds

**Fonts (Google Fonts):**
- Fredoka (rounded display font for headings)
- Caveat (handwritten accent for the name)
- Nunito (body text, readable and warm)

## Key Conventions

### Customization Entry Point

**Always start here** when personalizing the page:

```javascript
const CONFIG = {
  name: "Sunshine",                       // Birthday person's name
  sign: "with all my love, always 🤍",    // How you sign the note
};
```

Then edit the **data-letter** attribute in the `<p id="letterBody">` HTML element to customize the main message.

### Accessibility & Motion Preferences

The codebase **respects `prefers-reduced-motion`**:

```javascript
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

Use the `reduced` flag to:
- Reduce particle counts in confetti
- Skip floating heart animations
- Adjust animation timing for text reveals

**Always maintain this practice** when adding new animations.

### ARIA & Semantic HTML

- All interactive elements have `aria-label` or proper semantic tags (`<button>`, `<main>`, `<section>`, `<footer>`)
- Decorative elements use `aria-hidden="true"`
- Gallery images are `<figure>` + `<figcaption>`

### Canvas-Based Particle System

The confetti system uses a **single canvas element** with a frame loop:

```javascript
function makeParticle(x, y, opts = {}) {
  return {
    x, y, vx, vy, size, color, rot, vrot, shape, gravity
  };
}
```

Particles are created by:
- `confettiBurst(x, y, count)` — Upward burst (used for buttons, balloons, cake)
- `confettiRain(count)` — Falling confetti (used for the finale)

**Key patterns:**
- Device pixel ratio (`dpr`) is applied for sharp rendering on high-DPI screens
- Particles are filtered out when they leave the viewport
- The loop (`requestAnimationFrame`) only runs when particles exist

### Web Audio Music Box

The melody is defined as an array of `[frequency, beats]` tuples. The "Happy Birthday" melody is hardcoded:

```javascript
const MELODY = [
  [N.G4, 0.75], [N.G4, 0.25], [N.A4, 1], [N.G4, 1], ...
];
```

**To replace the melody:** Edit the `MELODY` array and reference the notes from the `N` object (C4–G5 defined).

### Scroll-Triggered Animations

The `.reveal-up` class triggers when elements enter the viewport:

```javascript
const io = new IntersectionObserver(...);
document.querySelectorAll(".reveal-up").forEach((el) => io.observe(el));
```

This is used for section headings and cards. **Add this class to any element** that should animate in as the user scrolls.

### Photo Gallery Customization

The gallery uses placeholder emoji. **To add real photos:**

```html
<!-- Replace with actual background images -->
<div class="polaroid" style="--photo: url('photos/beach.jpg')">
  <figcaption>that sunny afternoon</figcaption>
</div>
```

The CSS variable `--photo` is applied as a background image.

## Testing with Playwright

### Running Tests

The project includes comprehensive Playwright tests for all interactive elements and animations:

```bash
# Run all tests
npm test

# Run tests in UI mode (recommended for debugging)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Debug mode (step through tests)
npm run test:debug

# Run specific test suites
npm run test:buttons    # Test dock buttons and controls
npm run test:cake       # Test cake & candle interactions
npm run test:gift       # Test gift & gallery
npm run test:letter     # Test letter & text animations
npm run test:effects    # Test balloons & special effects
npm run test:a11y       # Test accessibility & responsive design
```

### Test Organization

Tests are organized by feature in the `/tests` directory:

- **buttons-and-controls.spec.js** — Music button, confetti button, celebrate button, finale button, dock accessibility
- **cake-candles.spec.js** — Candle lighting/extinguishing, blow interaction, wish sequence, relight functionality
- **gift-gallery.spec.js** — Gift unwrapping, confetti on unwrap, gallery polaroid focus states, keyboard accessibility
- **letter-animations.spec.js** — Letter reveal sequence, hero title animation, name display, scroll-triggered reveals
- **balloons-effects.spec.js** — Balloon spawning, popping, respawning, confetti bursts, ambient animations (stars, lights)
- **accessibility-responsive.spec.js** — ARIA labels, keyboard navigation, reduced motion support, responsive breakpoints, dark mode

### What the Tests Verify

**Buttons & Controls:**
- Buttons are clickable and have proper states
- Music toggle works (aria-pressed attribute)
- Confetti triggers on button clicks
- All buttons have accessibility labels

**Animations:**
- Candles animate correctly (flicker, extinguish, relight)
- Confetti burst and rain animations render
- Letter words reveal progressively
- Title letters pop in sequence
- Balloons spawn, pop, and respawn

**Interactions:**
- Gift unwraps/rewraps with state toggle
- Gallery polaroids focus/unfocus on click
- Wish sequence displays multiple messages
- Scroll-triggered reveals activate when in viewport

**Accessibility:**
- ARIA labels present on interactive elements
- Keyboard navigation works (Tab, Enter, Space)
- Reduced motion preferences honored
- Semantic HTML structure (main, section, figure)
- Focus indicators visible

**Responsive Design:**
- Layout works on mobile (393px), tablet (768px), desktop (1920px)
- No horizontal scroll overflow
- Touch-friendly button sizes (44x44 minimum)
- Content reflows properly on orientation change
- Dark mode support

### CI/CD Integration

Tests are configured to run in CI with:
- Automatic server startup (`python3 -m http.server 4599`)
- Cross-browser testing (Chromium, Firefox, WebKit)
- Mobile viewport testing (Pixel 5 emulation)
- HTML report generation
- Screenshots on failure

## Common Tasks

### Add a New Interactive Section

1. Add HTML structure to `index.html` (ideally as a `<section>` with `.reveal-up` elements)
2. Create a setup function in `script.js` and call it from `init()`
3. Use the same color palette (`PALETTE`) for consistency
4. Respect `prefers-reduced-motion` in any animations
5. Add ARIA labels for accessibility

### Modify Animations

- **Timing:** Change values in CSS `@keyframes` or JavaScript `setTimeout` delays
- **Colors:** Edit the `PALETTE` array or CSS custom properties
- **Easing:** Use the predefined `--ease-back` or define new ones in `:root`

### Test Across Devices

Since there's no build step, just open the page in different browsers and use:
- Firefox DevTools responsive design mode
- Chrome DevTools device emulation
- Safari responsive design mode

### Reduce Motion Testing

Toggle reduced motion in DevTools:
- Chrome/Edge: DevTools → Rendering → Emulate CSS media feature prefers-reduced-motion
- Firefox: about:config → ui.prefersReducedMotion = 1
- Safari: System Preferences → Accessibility → Display → Reduce motion

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Uses ES6 (arrow functions, `const`, `let`)
- Canvas and Web Audio API required
- CSS Grid and custom properties required

## Performance Notes

- **Canvas rendering** is optimized for device pixel ratio
- **Particle filtering** removes off-screen confetti each frame
- **IntersectionObserver** for scroll-triggered reveals (efficient)
- **requestAnimationFrame** used instead of `setInterval` for animations
- No external dependencies or build tools = minimal footprint

## File Size & Assets

- **No images** — everything is HTML, CSS, and JavaScript
- **No external libraries** — Web Audio API, Canvas API, CSS Animations only
- **Google Fonts** loaded via CDN (Fredoka, Caveat, Nunito)
- Total: ~50 KB for all three files + font overhead

## What NOT to Do

- ❌ Don't add a build tool (webpack, Vite, etc.)—it's intentionally vanilla
- ❌ Don't use external animation libraries (Animate.css, Three.js, etc.)
- ❌ Don't break the CONFIG object structure at the top of script.js
- ❌ Don't remove ARIA labels or accessibility features
- ❌ Don't ignore `prefers-reduced-motion` in new animations
