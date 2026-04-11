# Claude Code prompt — Implement Visual Icon Cards screener

## Context

You are working on the AuSuivant questionnaire at `questionnaire/` in this repo. The questionnaire is currently a single-persona survey targeting médecins libéraux. It needs to be refactored into a **multi-persona questionnaire** with a screener on a new screen that routes respondents to one of 6 persona-specific question tracks.

The screener design chosen is **Visual Icon Cards** — large tappable cards with icons replace traditional radio buttons. The screener has two steps on a single screen: Step 1 shows 3 role cards; Step 2 conditionally reveals variant cards with a smooth animation. The whole thing feels visual, approachable, and mobile-friendly.

Read every file in `questionnaire/` before you start editing anything. Understand the existing state machine, the `show()` function, the batch rendering system, the `mspOnly` pattern in `questions.js`, and the localStorage persistence layer. The refactor is **incremental** — you are adding to the existing codebase, not rewriting it.

---

## The 6 personas

| Code | Label | Screener path |
|------|-------|---------------|
| `P1` | Médecin avec secrétaire | Role: Médecin → Variant: Seul, avec secrétaire |
| `P1b` | Médecin solo | Role: Médecin → Variant: Seul, sans secrétaire |
| `P1c` | Médecin en groupe / MSP | Role: Médecin → Variant: En cabinet de groupe ou MSP |
| `P2` | Secrétaire médicale | Role: Secrétaire → (no variant question, auto-assigned) |
| `P3a` | Patient adulte actif | Role: Patient → Variant: Adulte actif |
| `P3b` | Patient senior | Role: Patient → Variant: Senior (60 ans et plus) |
| `P3c` | Parent qui consulte pour son enfant | Role: Patient → Variant: Parent |

---

## Step 1 — Add the screener screen to `index.html`

Insert a new `<section id="screen-screener">` between the existing intro screen and the batch screen (after the `</section>` that closes `screen-intro`, before `<section id="screen-batch">`).

### Visual Icon Cards markup

The screener uses large tappable cards with icons instead of radio buttons. Here is the exact markup to insert:

```html
<section id="screen-screener" class="screen hidden">
  <h1 class="display-small">Quelques questions pour vous orienter</h1>
  <p class="lead">Deux secondes — on s'assure de vous poser les bonnes questions.</p>

  <!-- Step 1: Role selection (always visible) -->
  <article class="info-card" id="screener-step1">
    <p class="screener-step-label">1 / 2</p>
    <h2 class="title-large">Quel est votre rôle ?</h2>
    <div class="icon-card-grid" id="screener-role-cards">
      <button type="button" class="icon-card" data-role="medecin">
        <span class="icon-card-icon">🩺</span>
        <span class="icon-card-label">Médecin</span>
      </button>
      <button type="button" class="icon-card" data-role="secretaire">
        <span class="icon-card-icon">📞</span>
        <span class="icon-card-label">Secrétaire</span>
      </button>
      <button type="button" class="icon-card" data-role="patient">
        <span class="icon-card-icon">🫀</span>
        <span class="icon-card-label">Patient</span>
      </button>
    </div>
  </article>

  <!-- Step 2a: Doctor variant (revealed when role=medecin) -->
  <article class="info-card screener-variant-card hidden" id="screener-doctor-variant">
    <p class="screener-step-label">2 / 2</p>
    <h2 class="title-large">Comment exercez-vous ?</h2>
    <div class="icon-card-grid" id="screener-doctor-cards">
      <button type="button" class="icon-card" data-persona="P1">
        <span class="icon-card-icon">👩‍⚕️</span>
        <span class="icon-card-label">Seul, avec secrétaire</span>
      </button>
      <button type="button" class="icon-card" data-persona="P1b">
        <span class="icon-card-icon">🧑‍⚕️</span>
        <span class="icon-card-label">Seul, sans secrétaire</span>
      </button>
      <button type="button" class="icon-card" data-persona="P1c">
        <span class="icon-card-icon">🏥</span>
        <span class="icon-card-label">En groupe / MSP</span>
      </button>
    </div>
  </article>

  <!-- Step 2b: Patient variant (revealed when role=patient) -->
  <article class="info-card screener-variant-card hidden" id="screener-patient-variant">
    <p class="screener-step-label">2 / 2</p>
    <h2 class="title-large">Vous êtes plutôt...</h2>
    <div class="icon-card-grid" id="screener-patient-cards">
      <button type="button" class="icon-card" data-persona="P3a">
        <span class="icon-card-icon">💼</span>
        <span class="icon-card-label">Adulte actif</span>
      </button>
      <button type="button" class="icon-card" data-persona="P3b">
        <span class="icon-card-icon">🧓</span>
        <span class="icon-card-label">Senior (60+)</span>
      </button>
      <button type="button" class="icon-card" data-persona="P3c">
        <span class="icon-card-icon">👶</span>
        <span class="icon-card-label">Parent</span>
      </button>
    </div>
  </article>

  <div id="screener-error" class="form-error hidden" role="alert"></div>

  <div class="action-row action-row-end">
    <button type="button" id="btn-screener-continue" class="btn btn-filled btn-large" disabled>
      <span>Voir mes questions</span>
      <span class="material-symbols-outlined btn-icon-trailing">arrow_forward</span>
    </button>
  </div>
</section>
```

Also update the `#btn-start` click action so it navigates to the screener instead of directly to `showBatch(0)`. The existing listener should change to call `show("screener")`.

---

## Step 2 — Add icon card styles to `styles.css`

Add the following styles. These must integrate with the existing M3 design system — use the existing CSS custom properties (the `--md-*` tokens defined in `:root`). Do NOT change any existing styles. Append these at the end of the file:

```css
/* ── Screener: Visual Icon Cards ── */

.screener-step-label {
  font-size: 0.75rem;
  color: var(--md-sys-color-on-surface-variant);
  margin-bottom: 0.25rem;
}

.icon-card-grid {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.icon-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
  padding: 1.25rem 0.75rem;
  border-radius: var(--card-radius, 1rem);
  border: 2px solid var(--md-sys-color-outline-variant);
  background: var(--md-sys-color-surface);
  cursor: pointer;
  transition: border-color 200ms ease, background-color 200ms ease, transform 200ms ease;
  -webkit-tap-highlight-color: transparent;
}

.icon-card:hover {
  border-color: var(--md-sys-color-outline);
  transform: translateY(-2px);
}

.icon-card:active {
  transform: translateY(0);
}

.icon-card.selected {
  border-color: var(--md-sys-color-primary);
  background: var(--md-sys-color-primary-container);
}

.icon-card-icon {
  font-size: 1.75rem;
  line-height: 1;
}

.icon-card-label {
  font-size: 0.8125rem;
  font-weight: 500;
  text-align: center;
  color: var(--md-sys-color-on-surface);
  line-height: 1.3;
}

.icon-card.selected .icon-card-label {
  color: var(--md-sys-color-on-primary-container);
}

/* Variant card reveal animation */
.screener-variant-card {
  overflow: hidden;
  transition: opacity 280ms ease-out, max-height 280ms ease-out, margin-top 280ms ease-out;
  max-height: 500px;
  opacity: 1;
  margin-top: 1rem;
}

.screener-variant-card.hidden {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
  pointer-events: none;
  /* Override the global .hidden display:none for these specific elements */
  display: block !important;
}

/* Mobile: stack cards vertically on very small screens */
@media (max-width: 360px) {
  .icon-card-grid {
    flex-direction: column;
  }
  .icon-card {
    flex-direction: row;
    padding: 1rem 1.25rem;
    gap: 0.75rem;
  }
  .icon-card-label {
    text-align: left;
  }
}
```

**Important CSS note:** The existing `.hidden` class uses `display: none`. The screener variant cards need a different hiding mechanism (opacity + max-height) to enable the reveal animation. The `.screener-variant-card.hidden` rule overrides the global `.hidden` with `display: block !important` so the transition works. Verify this doesn't break anything else — the override is scoped to `.screener-variant-card.hidden` only.

If the existing design tokens use different variable names than `--md-sys-color-*`, adapt the CSS to use whatever token names the codebase actually uses. Read `:root` in `styles.css` to find the correct names. The key colors needed are: primary, primary-container, on-primary-container, surface, on-surface, on-surface-variant, outline, outline-variant.

---

## Step 3 — Refactor `app.js` state machine

### 3.1 — Add `screener` to the screens registry

Find the `screens` object (around line 31) and add:

```js
screener: $("#screen-screener"),  // NEW
```

### 3.2 — Add `selectedPersona` to state

Find the `state` object (around line 22) and add:

```js
selectedPersona: null  // NEW: "P1" | "P1b" | "P1c" | "P2" | "P3a" | "P3b" | "P3c"
```

### 3.3 — Add `selectedPersona` to localStorage save/restore

In `saveState()`, add `selectedPersona: state.selectedPersona` to the object being saved.

In the `loadState()` restoration block inside `init()`, add: `state.selectedPersona = restored.selectedPersona || null;`

### 3.4 — Replace the `#btn-start` listener

Change the existing `#btn-start` click handler so it calls `show("screener")` instead of `showBatch(0)`.

### 3.5 — Add screener wiring function

Add this function and call it once from `init()` at startup:

```js
function wireScreener() {
  const roleCards = document.querySelectorAll('#screener-role-cards .icon-card');
  const doctorVariant = document.getElementById('screener-doctor-variant');
  const patientVariant = document.getElementById('screener-patient-variant');
  const doctorCards = document.querySelectorAll('#screener-doctor-cards .icon-card');
  const patientCards = document.querySelectorAll('#screener-patient-cards .icon-card');
  const continueBtn = document.getElementById('btn-screener-continue');
  const errorEl = document.getElementById('screener-error');

  let selectedRole = null;
  let selectedPersona = null;

  function updateContinueState() {
    continueBtn.disabled = !selectedPersona;
  }

  function clearVariantSelections() {
    doctorCards.forEach(c => c.classList.remove('selected'));
    patientCards.forEach(c => c.classList.remove('selected'));
    selectedPersona = null;
  }

  // Role card click handlers
  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      // Update selection visual
      roleCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const role = card.dataset.role;
      selectedRole = role;

      // Clear any previous variant selection
      clearVariantSelections();

      // Show/hide variant cards
      if (role === 'medecin') {
        doctorVariant.classList.remove('hidden');
        patientVariant.classList.add('hidden');
        selectedPersona = null;
      } else if (role === 'patient') {
        patientVariant.classList.remove('hidden');
        doctorVariant.classList.add('hidden');
        selectedPersona = null;
      } else if (role === 'secretaire') {
        doctorVariant.classList.add('hidden');
        patientVariant.classList.add('hidden');
        selectedPersona = 'P2'; // No variant needed
      }

      updateContinueState();
    });
  });

  // Doctor variant card click handlers
  doctorCards.forEach(card => {
    card.addEventListener('click', () => {
      doctorCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedPersona = card.dataset.persona;
      updateContinueState();
    });
  });

  // Patient variant card click handlers
  patientCards.forEach(card => {
    card.addEventListener('click', () => {
      patientCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedPersona = card.dataset.persona;
      updateContinueState();
    });
  });

  // Continue button
  continueBtn.addEventListener('click', () => {
    if (!selectedPersona) {
      errorEl.textContent = "Merci de répondre aux questions ci-dessus.";
      errorEl.classList.remove('hidden');
      return;
    }
    errorEl.classList.add('hidden');
    state.selectedPersona = selectedPersona;
    saveState();
    showBatch(0);
  });
}
```

### 3.6 — Add `getVisibleQuestions()` helper

Add this after the `showBatch` function:

```js
function getVisibleQuestions(batch, persona) {
  return batch.questions.filter(q => {
    if (!q.personas) return true;       // No filter = show to all (legacy compat)
    return q.personas.includes(persona);
  });
}
```

### 3.7 — Modify `showBatch()` to filter questions and skip empty batches

At the top of `showBatch(batchIndex)`, after getting the batch from `window.BATCHES[batchIndex]` and the null-check, add:

```js
// Skip batches with no visible questions for this persona
const visibleQuestions = getVisibleQuestions(batch, state.selectedPersona);
if (visibleQuestions.length === 0) {
  showBatch(batchIndex + 1);
  return;
}
```

Then change the rendering to use `visibleQuestions` instead of `batch.questions` when building the HTML.

### 3.8 — Modify `validateBatch()` to only validate visible questions

Replace references to `batch.questions` with:

```js
const visibleQuestions = getVisibleQuestions(batch, state.selectedPersona);
```

Then iterate over `visibleQuestions` instead of `batch.questions`.

### 3.9 — Modify `collectBatchAnswers()` to only collect visible questions

Same pattern — replace `batch.questions` with `getVisibleQuestions(batch, state.selectedPersona)`.

### 3.10 — Add `persona_id` to the backend payload

In the `submit()` function (or wherever `sendToBackend()` is called), add to the payload object:

```js
persona_id: state.selectedPersona,
```

### 3.11 — Fix the progress display for per-persona batch counts

Add this helper:

```js
function getVisibleBatchCount(persona) {
  return window.BATCHES.filter(b => getVisibleQuestions(b, persona).length > 0).length;
}
```

In `showBatch()`, replace `window.BATCHES.length` in the "Série N sur M" progress text with `getVisibleBatchCount(state.selectedPersona)`. Also compute the current visible batch number by counting how many visible batches exist up to and including the current index.

### 3.12 — Fix `showContinuePrompt()` to skip empty batches

In the logic that computes `nextIndex` for the next batch, add a skip condition:

```js
if (getVisibleQuestions(next, state.selectedPersona).length === 0) {
  nextIndex += 1;
  continue;
}
```

This goes alongside the existing `mspOnly` skip logic.

---

## Step 4 — Add `personas` field to every question in `questions.js`

Every question object in `questions.js` needs a new `personas: [...]` field listing which persona codes see that question. This is the same pattern as the existing `mspOnly: true` flag, but more flexible.

**For now, as a first pass**, add `personas: ["P1", "P1b", "P1c"]` to every existing question (since the current questionnaire is doctor-only). This makes all existing questions visible to all three doctor personas and hidden from secrétaire and patient personas.

The full per-persona content matrix (adding secrétaire and patient questions) will be done in a follow-up step. Do NOT write those questions now — just add the `personas` field to existing questions.

Example transformation:

```js
// BEFORE
{
  id: "fin_estimee_value",
  label: "À 10h, un outil vous dit...",
  type: "textarea",
  required: true
}

// AFTER
{
  id: "fin_estimee_value",
  label: "À 10h, un outil vous dit...",
  type: "textarea",
  required: true,
  personas: ["P1", "P1b", "P1c"]
}
```

Questions that should apply to ALL personas (if any exist) can omit the `personas` field entirely — the `getVisibleQuestions()` helper treats missing `personas` as "show to everyone".

---

## Step 5 — Do NOT touch these things

- **Do NOT** change the M3 design system, colors, typography, or animations. The design pass is locked.
- **Do NOT** add new question types. Only the existing 4 (textarea, short, radio, pricing-pair) are in scope.
- **Do NOT** rewrite existing question copy. The tone pass is locked.
- **Do NOT** change the email opt-in flow at the end.
- **Do NOT** add analytics or tracking.
- **Do NOT** change the backend URL or architecture. Same Sheet, same Apps Script, same Web app URL — just one new `persona_id` field in the payload.
- **Do NOT** update `AUSUIVANT-REDESIGN-GUIDE.md`.
- **Do NOT** delete any files outside `questionnaire/`.

---

## Step 6 — Update `questionnaire/README.md`

Document:
1. The new screener flow and the Visual Icon Cards design
2. The 6 personas the questionnaire supports (table with codes, labels, screener paths)
3. The new `personas: [...]` field in question definitions
4. The new `persona_id` field in the backend payload
5. The Apps Script `doPost()` update the user needs to do manually (paste the updated function that includes the `persona_id` column)
6. The Google Sheet migration step: insert a "Persona ID" column between the existing "Locale" and "User Agent" columns

---

## Verification checklist

After implementation, verify all of the following:

1. **Screener renders:** The screener screen appears when clicking "Commencer" from the intro
2. **Icon cards are tappable:** Each card highlights with `.selected` class on click
3. **Conditional reveal:** Clicking "Médecin" reveals the doctor variant cards with a smooth animation. Clicking "Patient" reveals the patient variant cards. Clicking "Secrétaire" hides both variant cards.
4. **Variant switching:** If user clicks "Médecin" then switches to "Patient", the doctor variant hides and patient variant appears. Any previous variant selection is cleared.
5. **Continue button state:** The button is disabled until a complete persona is selected (role alone is not enough for médecin and patient; role alone IS enough for secrétaire)
6. **Persona persists:** After clicking "Voir mes questions", `state.selectedPersona` is set and saved to localStorage
7. **Questions filter:** Each batch only renders questions whose `personas` array includes `state.selectedPersona`
8. **Empty batches skip:** If a batch has zero visible questions for the current persona, it is skipped silently (no blank screen, no error)
9. **Progress is correct:** "Série N sur M" shows the count of visible batches for the current persona, not the total batch count
10. **Payload includes persona_id:** Open Network tab and verify each POST to the Apps Script endpoint includes `persona_id` in the JSON body
11. **localStorage recovery:** Fill batch 1, refresh the page, verify the screener is skipped and the questionnaire resumes at the right batch with the saved persona
12. **Mobile layout:** On a 375px viewport, the 3 icon cards sit side by side comfortably. On screens below 360px, they stack vertically with a horizontal layout (icon left, label right)
13. **Existing functionality unchanged:** The MSP-only batch skip logic still works. The email opt-in at the end still works. The pricing-pair question type still renders correctly.
