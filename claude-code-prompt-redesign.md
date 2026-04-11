# Claude Code prompt — Redesign the AuSuivant questionnaire UI

## Context

You are working on the AuSuivant questionnaire at `questionnaire/` in this repo.
AuSuivant is a SaaS product for managing walk-in patient queues in French medical clinics.
This questionnaire is a Phase 1 discovery tool — it collects responses from doctors,
secrétaires médicales, and patients to inform product design decisions.

The questionnaire is a **self-contained static web app** (no framework, no build step):
- `index.html` — all screens and markup
- `styles.css` — full design system (currently Material Design 3)
- `app.js` — state machine, persona filtering, batch rendering, submission
- `questions.js` — question data (do not touch)

**Read every file before changing anything.** Understand the screen flow, the `.hidden`
toggle pattern, the `show()` function, and the icon card animation before editing.

---

## Current design — complete audit

### Design system

The current system is **Material Design 3 (M3)**, light mode only, implemented from
scratch in vanilla CSS using custom properties defined in `:root`.

### Colour tokens (`:root`)

```
Primary:              #1A3C8F  (AuSuivant navy)
On-primary:           #FFFFFF
Primary container:    #DCE1FF  (soft lavender — used for selected states)
On-primary-container: #001947

Secondary:            #575E71
Secondary container:  #DCE2F9
On-secondary-container: #141B2C

Error:                #BA1A1A
Error container:      #FFDAD6
On-error-container:   #410002

Background:           #FAF8FF  (near-white with blue undertone)
Surface:              #FAF8FF
On-surface:           #1A1B21
On-surface-variant:   #45464F

Surface containers (low → high):
  Lowest:  #FFFFFF
  Low:     #F4F2FA
  Default: #EEEDF4
  High:    #E8E7EE
  Highest: #E2E2E9

Outline:              #75767F
Outline-variant:      #C5C6D0
```

### Typography

Font family: `'Roboto'` (loaded from Google Fonts), fallback to system-ui.
No custom variable fonts in use.

Type scale classes used in markup:

| Class            | Size          | Weight | Usage                          |
|------------------|---------------|--------|--------------------------------|
| `.display-small` | clamp(28–36px)| 500    | Screen titles (intro, thanks)  |
| `.headline-medium`| clamp(24–28px)| 500    | Batch title                    |
| `.title-large`   | 22px          | 500    | Card headings, screener labels |
| `.title-medium`  | 16px          | 500    | Loading state                  |
| `.body-large`    | 16px / 1.5    | 400    | Continue screen body           |
| `.body-medium`   | 14px / 1.43   | 400    | Card body text                 |
| `.body-small`    | 12px / 1.33   | 400    | Helper text, footer            |
| `.label-large`   | 14px          | 500    | Form field labels              |
| `.label-medium`  | 12px          | 500    | Progress text, footer          |
| `.lead`          | 16px / 1.55   | 400    | Subtitle under screen title    |

### Spacing scale (8dp grid)

`--space-1: 4px` through `--space-16: 64px`.
Content max width: `760px`, centred with auto margins.

### Shape tokens

```
Extra-small: 4px
Small:       8px
Medium:      12px
Large:       16px   ← cards, questions, icon cards use this
Extra-large: 28px
Full:        9999px ← buttons, progress bar, number badges
```

### Elevation

Two soft shadow sets: `--md-elevation-soft-1` and `--md-elevation-soft-2`.
Used only on filled buttons (hover lift). Cards use border + background, no shadow.

---

## Current screen inventory

### 1. Intro screen (`#screen-intro`)

- Large `display-small` heading: *"La file d'attente, vue par vous"*
- `.lead` paragraph explaining the product
- Two `info-card` components side by side in flow:
  - **"Comment ça marche"** card — bullet list with M3 dot markers
  - **"Confidentialité"** card — subtle background variant
- One CTA button (filled, large): *"C'est parti"* with trailing arrow icon

### 2. Screener screen (`#screen-screener`)

- `display-small` heading + `.lead` subtitle
- **Step 1** — `info-card` containing:
  - `screener-step-label` (e.g. "1 / 2") — small muted text
  - `title-large` question
  - `icon-card-grid` — 3 tappable `icon-card` buttons side by side:
    - 🩺 Médecin / 📞 Secrétaire / 🫀 Patient
    - Each card: emoji icon (1.75rem) + label text (0.8125rem, 500 weight)
    - 2px border, `--card-radius: 1rem`, hover lift (`translateY(-2px)`)
    - Selected state: primary border + primary-container background
- **Step 2a** — `info-card.screener-variant-card` (animated reveal, doctor variants):
  - 👩‍⚕️ Seul, avec secrétaire / 🧑‍⚕️ Seul, sans secrétaire / 🏥 En groupe / MSP
- **Step 2b** — `info-card.screener-variant-card` (animated reveal, patient variants):
  - 💼 Adulte actif / 🧓 Senior (60+) / 👶 Parent
- Reveal animation: `opacity + max-height` transition (280ms ease-out), NOT display:none
- Error message div + disabled CTA button (enables once persona is fully selected)

### 3. Batch screen (`#screen-batch`)

- **Progress section:**
  - Thin progress bar (4px, full width, rounded) with animated fill
  - Below bar: "Série N sur M" (left) + "≈ X min" with clock icon (right)
- `headline-medium` batch title
- `.batch-subtitle` in muted body text
- `<form>` containing question cards + error div + action row
- **Action row:** "Tout annuler" (text button, left) + "Envoyer" (filled, right)

### 4. Individual question card (`.question`)

- White card with `outline-variant` border, `16px` radius, `20px` padding
- **Question header:**
  - Numbered badge: 28×28px circle, `primary-container` fill, number in `on-primary-container`
  - Question text: 16px / 500 weight
  - `*` required marker in error red
- Optional helper text: 13px, muted, below the question label
- **Input area** (left-aligned, 40px inset on desktop):
  - `textarea` — outlined field, resizable, 110px min-height
  - `short` (text or number) — single-line outlined field
  - `radio` — vertical stack of radio cards (`.radio-option`):
    - Each option: 56px min-height, rounded-medium, border, flex row with native radio + label
    - Selected: primary-container background + primary border
    - Optional comment textarea below selected option
  - `pricing-pair` — two number fields side by side (floor / ceiling) + optional textarea

### 5. Submitting screen (`#screen-submitting`)

- Centred layout (flex column, min-height 320px)
- 48px CSS spinner (border-top animation, primary colour)
- "Envoi en cours…" text

### 6. Continue screen (`#screen-continue`)

- Centred text layout
- Green circle success icon (primary-container bg, primary colour, 80px)
- Headline: *"Bien reçu, merci"*
- Body: progress text ("Série N sur M dans la boîte.")
- `info-card` showing next batch title + estimated time
- Two-button action row: "J'arrête là" (outlined) + "Allez, 5 de plus" (filled)

### 7. Thanks screen (`#screen-thanks`)

- Large (96px) heart icon circle
- `display-small`: *"Merci, vraiment"*
- `.lead` paragraph
- `info-card` with email opt-in:
  - Label, email input, tonal button ("Envoyer")
  - Status message (hidden until submit attempt)
- Session ID footer in monospace

### 8. Error screen (`#screen-error`)

- Red error icon circle
- Headline + body explaining the retry pattern
- Error detail text (small, muted)
- "Réessayer" filled button with refresh icon

---

## Current component catalogue

### Info card (`.info-card`)
White surface, `outline-variant` border, `16px` radius, `20px` padding.
Variant: `.info-card.subtle` — `surface-container-low` bg, transparent border.
Header: icon (primary colour, 24px Material Symbol) + `title-large` text.

### Icon card (`.icon-card`)
Used only in screener. Tappable button. Vertical stack (emoji + label).
States: default (outline-variant border) → hover (lift, darker border) → selected (primary border + primary-container bg).
Mobile ≤360px: stacks to horizontal layout (icon left, label right).

### Radio option (`.radio-option`)
Used in batch questions. Horizontal layout (native radio circle + label text).
56px min-height. Selected: primary-container bg + primary border.
Uses CSS `:has()` for native checked state styling, with JS `.selected` class as fallback.

### Button variants
| Class         | Bg                    | Text                        | Usage               |
|---------------|-----------------------|-----------------------------|---------------------|
| `.btn-filled` | primary               | on-primary (white)          | Primary CTA         |
| `.btn-outlined`| transparent          | primary, 1px outline border | Secondary action    |
| `.btn-text`   | transparent           | primary                     | Destructive / cancel|
| `.btn-tonal`  | secondary-container   | on-secondary-container      | Email opt-in        |
| `.btn-large`  | modifier: taller (56px min-height) |            | Screener CTA        |

All buttons: `9999px` radius, 500 weight, 14px (large: 15px), M3 state-layer overlay via `::before`.

### Progress bar
4px height, full width, `surface-container-high` track, primary fill.
`width` transitions at 350ms cubic-bezier.

### Text field
Outlined style. `outline` border at rest → `primary` border (2px) on focus.
Focus: 3px box-shadow at 12% primary opacity. Font-size locked at 16px (prevents iOS zoom).

### Status icons
80px (96px large variant) circle. `success-icon`: primary-container/primary.
`error-icon`: error-container/error.

### Spinner
48px, 4px border, border-top primary, 800ms linear rotation.

---

## Animation and transition inventory

| Element                   | Animation                                      |
|---------------------------|------------------------------------------------|
| Screen transition         | `fadeIn` — opacity 0→1 + translateY(8px→0), 240ms ease-out |
| Screener variant reveal   | `max-height` 0→500px + opacity 0→1 + margin-top, 280ms ease-out |
| Progress bar fill         | `width`, 350ms cubic-bezier(0.2, 0, 0, 1)      |
| Button hover              | box-shadow lift, 150ms ease                    |
| Icon card hover           | translateY(-2px), 200ms ease                   |
| Radio / icon card select  | bg + border colour, 120–200ms ease             |
| Text field focus          | border-width + box-shadow, 150ms ease          |
| Spinner                   | rotate 360°, 800ms linear infinite             |

---

## Layout and responsiveness

Mobile-first. Three breakpoints:

| Breakpoint   | Changes                                                     |
|--------------|-------------------------------------------------------------|
| < 360px      | Icon cards stack vertically (icon left, label right)        |
| ≥ 480px      | Pricing pair fields go side by side                         |
| ≥ 600px      | Header taller (64px), brand tag appears, main padding increases, action rows go horizontal, email opt-in goes horizontal, question helper/input get 40px left indent |
| ≥ 905px      | Main padding increases further                              |

---

## Accessibility

- `prefers-reduced-motion`: all transitions/animations cut to 0.01ms
- `forced-colors: active`: borders added to buttons and cards
- `role="radiogroup"` on radio groups, `role="progressbar"` on progress
- `role="alert"` on error divs
- `aria-live="polite"` on batch screen
- `aria-label` on spinner
- Focus rings on all interactive elements (2px primary outline)
- All form inputs have `<label>` elements
- `novalidate` on form (custom validation via JS)

---

## What this prompt is asking you to do

Replace the Material Design 3 system with a **"Soft Organic"** design system —
nature-inspired, gently rounded, and glassmorphic. The goal is a design that bridges
the gap between patient comfort and professional polish: approachable enough for
patients, polished enough for doctors and secrétaires médicales.

Keep all behaviour identical. Touch `styles.css` (full rewrite of the design tokens
and component styles) and `index.html` (only to swap the Google Fonts `<link>` tags).
Do **not** change `app.js` or `questions.js`.

---

### Colour system — replace every `:root` colour token

Replace the current M3 navy palette with a sage-green / forest-green tonal system.
Follow M3 colour role naming so the existing CSS class references still work.

```
Primary:              #4A7C3A   (forest green)
On-primary:           #FFFFFF
Primary container:    #D4E8C6   (pale sage)
On-primary-container: #0E2006   (deep forest)

Secondary:            #55624D   (muted olive)
Secondary container:  #D8E7CC   (light olive)
On-secondary-container: #131F0D

Tertiary:             #386568   (dusty teal — use sparingly for contrast)
Tertiary container:   #BCEBEE

Error:                #BA1A1A   (keep unchanged)
Error container:      #FFDAD6   (keep unchanged)
On-error-container:   #410002   (keep unchanged)

Background:           #F0F4EC   (sage-tinted off-white)
Surface:              #FAFCF8   (near-white with green undertone)
On-surface:           #2C3128   (dark forest)
On-surface-variant:   #6B7366   (muted sage text)

Surface containers (low → high):
  Lowest:  #FFFFFF
  Low:     #F5F8F1
  Default: #EFF3EA
  High:    #E5EAE0
  Highest: #DDE2D8

Outline:              #8FA888   (sage outline)
Outline-variant:      rgba(181, 212, 160, 0.4)   (translucent sage)
```

Add a subtle radial gradient to the `<body>` or `<main>` background:

```css
background: linear-gradient(180deg, #F0F4EC 0%, #FAFCF8 100%);
```

Optionally add a decorative blurred radial accent in the top-right corner of the
intro and thanks screens (purely atmospheric, pointer-events: none):

```css
.screen::before {
  content: '';
  position: absolute;
  top: -60px; right: -60px;
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(168,200,140,0.25) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}
```

---

### Typography — swap fonts

Replace **Roboto** with two fonts:

| Role     | Font family     | Google Fonts weight range | Notes                                 |
|----------|-----------------|---------------------------|---------------------------------------|
| Display  | **Fraunces**    | 300–700, italic           | Serif with optical sizing. Use `font-style: italic` on all display/headline classes. This is the signature typographic choice — warm, editorial. |
| Body     | **Outfit**      | 300–700                   | Rounded geometric sans-serif with soft terminals. Feels approachable without being childish. |

Update the `<link>` tags in `index.html` to:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500;1,9..144,600&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

Apply globally:

```css
body {
  font-family: 'Outfit', system-ui, sans-serif;
}
.display-small,
.headline-medium,
.title-large {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 400;        /* Fraunces looks best at 400 italic */
}
```

Keep all existing M3 type scale sizes (clamp values, line-heights) — only change
`font-family`, `font-style`, and `font-weight` on the heading classes.

---

### Shape tokens — rounder everywhere

Replace the current shape scale:

```
Extra-small: 8px       (was 4px)
Small:       12px      (was 8px)
Medium:      16px      (was 12px)
Large:       20px      (was 16px)  ← cards, questions, info-cards, icon-cards
Extra-large: 28px      (unchanged)
Full:        9999px    (unchanged) ← buttons become full pill shapes
```

Key changes:
- **All cards** (`.info-card`, `.question`, `.icon-card`, `.radio-option`): `border-radius: 20px`
- **All buttons** (`.btn-filled`, `.btn-outlined`, `.btn-tonal`, `.btn-text`): keep `border-radius: 9999px` (pill)
- **Text inputs and textareas**: `border-radius: 14px` (was ~4-8px)
- **Number badges** (question numbers): make them `border-radius: 50%` (circle), use `#D4E8C6` background and `#3A6E2C` text
- **Progress bar**: keep `border-radius: 9999px`, but increase height from `4px` to `8px`

---

### Card treatment — glassmorphic

Replace opaque white cards with translucent glassmorphic cards:

```css
.info-card,
.question {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: none;                          /* remove the solid outline-variant border */
  border-radius: 20px;
  box-shadow: none;
}
```

If you need a border for `forced-colors` accessibility, add one only inside a
`@media (forced-colors: active)` block:

```css
@media (forced-colors: active) {
  .info-card, .question { border: 1px solid ButtonText; }
}
```

For the **screener icon cards** (`.icon-card`):
- Background: `rgba(255, 255, 255, 0.7)` + `backdrop-filter: blur(6px)`
- Border: `2px solid transparent` at rest
- Hover: `border-color: #93C47D` + `background: rgba(255,255,255,0.9)`
- Selected: `border-color: #4A7C3A` + `background: rgba(181,212,160,0.2)`
- Keep the emoji icons at their current size
- Make the icon container a **circle** (`border-radius: 50%`, ~48px, background `#D4E8C6`); on selected state change to `#A8C88C`

For **radio options** (`.radio-option`):
- Same glassmorphic base: `rgba(255,255,255,0.6)`, `backdrop-filter: blur(4px)`, `border-radius: 16px`
- Selected: `border: 2px solid #4A7C3A` + `background: rgba(181,212,160,0.15)`

---

### Button treatment

| Variant        | Background                                     | Text colour  | Notes                              |
|----------------|-------------------------------------------------|--------------|------------------------------------|
| `.btn-filled`  | `#4A7C3A`                                       | `#FFFFFF`    | Add `box-shadow: 0 4px 16px rgba(74,124,58,0.2)`. Hover: `translateY(-1px)` + shadow increases. |
| `.btn-outlined`| transparent                                     | `#4A7C3A`    | `border: 1.5px solid #4A7C3A`. Hover: `background: rgba(74,124,58,0.06)`. |
| `.btn-text`    | transparent                                     | `#8FA888`    | Hover: colour shifts to `#4A7C3A`. |
| `.btn-tonal`   | `#D8E7CC`                                       | `#131F0D`    | Used for email opt-in on thanks screen. |

All buttons: pill shape (`9999px`), `font-family: 'Outfit'`, `font-weight: 600`.
Keep the `::before` state-layer overlay mechanism but recolour it to
`rgba(74,124,58,0.08)` on hover and `rgba(74,124,58,0.12)` on press.

---

### Progress bar

```css
.progress-track {
  height: 8px;                                   /* was 4px */
  background: rgba(181, 212, 160, 0.3);          /* translucent sage */
  border-radius: 9999px;
}
.progress-fill {
  background: linear-gradient(90deg, #6BA354, #93C47D);  /* forest-to-sage gradient */
  border-radius: 9999px;
}
```

Keep the existing `width` transition timing.

---

### Text fields (inputs and textareas)

```css
input[type="text"],
input[type="number"],
input[type="email"],
textarea {
  border: 1.5px solid rgba(181, 212, 160, 0.4);  /* translucent sage */
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.5);           /* semi-transparent */
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: 16px;                                 /* keep ≥16px for iOS */
  color: #2C3128;
  padding: 12px 14px;
  outline: none;
  transition: border-color 0.15s ease;
}
input:focus,
textarea:focus {
  border-color: #4A7C3A;
  box-shadow: 0 0 0 3px rgba(74, 124, 58, 0.12);
}
```

---

### Status icons (success, error)

- **Success icon** (continue screen): keep circle shape, change background to `#D4E8C6`, icon colour to `#3A6E2C`
- **Error icon** (error screen): keep unchanged (`#FFDAD6` bg, `#BA1A1A` icon)
- **Thanks heart icon**: background `#D4E8C6`, keep the heart emoji or icon

---

### Spinner

Keep the 48px spinner but recolour:
- Border: `3px solid rgba(181,212,160,0.3)`
- Border-top: `3px solid #4A7C3A`

---

### Screener variant card reveal animation

The `.screener-variant-card.hidden` animation uses `display: block !important`,
`max-height`, and `opacity` transitions. **Do not change this mechanism.** Only
update the visual styling of the variant cards (background, border, radius) to
match the new glassmorphic card style.

---

### Shadows and elevation

Remove the M3 elevation shadow tokens (`--md-elevation-soft-1`, `--md-elevation-soft-2`).
Replace with a single soft shadow used only on filled buttons:

```css
--shadow-soft: 0 4px 16px rgba(74, 124, 58, 0.15);
--shadow-hover: 0 8px 24px rgba(74, 124, 58, 0.25);
```

Cards should not have box shadows — they rely on their glassmorphic translucency
for visual depth.

---

### Focus rings

Replace the current primary-blue focus ring with the new primary green:

```css
:focus-visible {
  outline: 2px solid #4A7C3A;
  outline-offset: 2px;
}
```

---

### Screen-by-screen notes

1. **Intro**: Add the decorative radial gradient blob in top-right. Info-card icons
   should use the primary green (`#4A7C3A`). The CTA "C'est parti →" button uses
   `.btn-filled` with the forest green and pill shape.

2. **Screener**: Icon cards use circular emoji containers (`#D4E8C6` bg). Selected
   state must be clearly distinct — border + background shift + emoji container darkens.
   Keep the 3-column grid at ≥375px, horizontal stack below 360px.

3. **Batch**: Progress bar is taller (8px) with the gradient fill. Question number
   badges are sage-green circles. Textareas use the rounded, translucent style.

4. **Submitting**: Spinner recoloured to forest green. Background remains the sage
   gradient.

5. **Continue**: Success icon circle uses `#D4E8C6` / `#3A6E2C`. Buttons in the
   action row use `.btn-outlined` and `.btn-filled` with the new palette.

6. **Thanks**: Heart icon circle uses `#D4E8C6`. Email opt-in input uses the
   rounded translucent field style. "Envoyer" button uses `.btn-tonal` in olive.
   Session ID footer remains monospace, colour `#8FA888`.

7. **Error**: Red palette stays the same. Only the "Réessayer" button shifts to
   `#4A7C3A` filled style (error colour is not used for the retry CTA — it is a
   positive action).

---

## Constraints (always apply, regardless of brief)

- **Do NOT change `questions.js`** — question data is locked
- **Do NOT change the state machine, routing logic, or screen structure in `app.js`**
- **Do NOT change the `.hidden` / `show()` pattern** — it is load-bearing
- **Do NOT break the `.screener-variant-card.hidden` animation** — it uses
  `display: block !important` to override the global `.hidden` rule; any redesign
  must preserve this override or replicate the reveal mechanism
- **Do NOT remove `aria-*` attributes, `role` attributes, or focus rings**
- **Do NOT change question IDs, form field `name` attributes, or `data-*` attributes**
- The questionnaire must work as a static file (no build step, no npm, no CDN dependencies
  beyond what is already loaded from Google Fonts)
- If you change the font, update the `<link>` tags in `index.html` accordingly
- The 16px minimum on `<input>` and `<textarea>` is mandatory on iOS — do not reduce it
- Test your changes against all 7 screens before declaring done

---

## Verification checklist (run after implementing)

1. All 7 screens render without layout breaks at 375px, 600px, and 900px viewport widths
2. Screener icon cards: 3 side by side at 375px, stacked vertically below 360px
3. Icon card selected state is visually distinct (not just a colour change — must be clear)
4. Screener variant panel reveal is smooth (no flash, no jump)
5. Progress bar fill is visible and animates correctly
6. Radio options have a clear selected state
7. Pricing pair fields are usable on mobile (no overflow)
8. All focus rings are visible on keyboard navigation
9. "Tout annuler" and "Envoyer" buttons are reachable without horizontal scroll on mobile
10. The thanks screen email opt-in field and button are not broken at any width
