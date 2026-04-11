# AuSuivant — Multi-persona Research Questionnaire

A Material Design 3 web questionnaire that surveys **6 distinct user personas** for the AuSuivant Phase 1 Discovery research. A screener on the first screen routes each respondent to a persona-specific question track. The same URL works for everyone — no separate links per persona.

- **One link, six tracks.** Médecins (3 variants), secrétaires médicales, and patients (3 variants) all start at the same URL and only see the questions relevant to their role.
- **5 questions at a time.** Progressive batches with an opt-in continue prompt — respondents can stop at any boundary without losing their work.
- **Recoverable.** Answers persist in localStorage for 24h; an accidental refresh resumes the session.
- **No build step.** Pure HTML/CSS/JS. GitHub Pages compatible. Material Design 3 styling, mobile-first.
- **Google Apps Script backend.** Submissions land in a Google Sheet with one row per batch, including a `Persona ID` column for filtering.

---

## The 6 personas

| Code | Label | Screener path |
|---|---|---|
| **P1** | Médecin avec secrétaire | Médecin → Seul, avec secrétaire |
| **P1b** | Médecin solo (sans secrétaire) | Médecin → Seul, sans secrétaire |
| **P1c** | Médecin en cabinet de groupe ou MSP | Médecin → En cabinet de groupe ou MSP |
| **P2** | Secrétaire médicale | Secrétaire médicale (no second question) |
| **P3a** | Patient adulte actif | Patient → Adulte actif |
| **P3b** | Patient senior (60+) | Patient → Senior |
| **P3c** | Parent qui consulte pour son enfant | Patient → Parent |

Each persona sees ~10–18 questions split across 3–6 batches (~6–13 minutes total).

---

## What's in this folder

```
questionnaire/
├── index.html       # the shell (intro, screener, batch, continue, thanks, error screens)
├── styles.css       # MD3 design tokens + layout
├── app.js           # state machine, screener, persona filter, validation, submission
├── questions.js     # question content + persona tags — edit this to change content
├── .nojekyll        # tells GitHub Pages not to run Jekyll
└── README.md        # you are here
```

To **change a question or add one**, edit only [questions.js](questions.js).
To **change colours or layout**, edit only [styles.css](styles.css).
To **change the backend endpoint**, edit only the `CONFIG` block at the top of [app.js](app.js).

---

## How the screener works

The first screen after the intro asks **two questions** (only the first is shown to secrétaires):

1. **Vous êtes plutôt…** — radio: Médecin / Secrétaire médicale / Patient
2. (Conditional)
   - If Médecin: **Comment exercez-vous ?** — radio: Seul avec secrétaire / Seul sans secrétaire / En cabinet de groupe ou MSP
   - If Patient: **Et plus précisément, vous êtes…** — radio: Adulte actif / Senior / Parent qui consulte pour son enfant
   - If Secrétaire: no follow-up — the continue button activates immediately

After the screener, `state.selectedPersona` is set to one of the 7 persona codes and the questionnaire shows only the questions tagged for that persona.

---

## Question schema (questions.js)

Each question lives in a batch. Each question has these fields:

| Field | Required | Description |
|---|---|---|
| `id` | always | Unique identifier — becomes the column key in the backend payload |
| `label` | always | The French question text |
| `type` | always | One of `textarea`, `short`, `radio`, `pricing-pair` |
| `required` | always | Boolean; if `true`, blocks batch submission until answered |
| `personas` | always (in this version) | Array of persona codes that should see this question, e.g. `["P1", "P1b", "P1c"]`. Cross-persona reuse is encouraged — store one question, list multiple personas |
| `helper` | optional | One-line clarification under the label |
| `hypothesis` | optional | Hypothesis code (e.g., `"D-H1"`) for traceability — not displayed to the user |
| `options` | for `radio` only | Array of `{ value, label }` pairs |
| `commentField` | for `radio` only | Set `true` to add an optional textarea below the radio group |
| `inputType` | for `short` only | `"text"` (default) or `"number"` |

### Cross-persona questions

A question with `personas: ["P1", "P1b", "P1c"]` is stored once and shown to all three doctor variants. Same backend column for the question across all three personas, so you can filter the Google Sheet by persona AND compare answers across personas trivially. Examples in this codebase:

- The `pricing` question (D-H4) is shown to P1, P1b, P1c
- The `last_visit_story` question is shown to P3a, P3b, P3c
- The closing `one_thing_to_change` question is shown to all 7 personas

### Empty batches are skipped automatically

If a batch's `questions` array contains zero questions tagged for the current persona, the batch is silently skipped — both during forward navigation (`showBatch`) and in the continue prompt's "next batch" computation. This means you can have a "Doctolib & complémentarité" batch that only doctors and secrétaires see, and patients will jump straight from the previous batch to the closing one without noticing.

### MSP-only batches

A batch with `mspOnly: true` is only shown to persona `P1c`. This is the legacy pattern from the single-persona version and still works alongside the new `personas: [...]` filter.

---

## Quick start (10 minutes) — Google Apps Script backend

The questionnaire is wired to a Google Apps Script web app that writes one row per batch to a Google Sheet. Setup is one-time.

### 1. Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new sheet
2. Name it: `AuSuivant — Multi-persona Questionnaire Responses`
3. In row 1, paste these **10 column headers** (tab-separated for easy paste):

```
Received	Session ID	Batch #	Batch Title	Submitted At	Locale	Persona ID	User Agent	Batch Answers (JSON)	Cumulative Answers (JSON)
```

4. Make row 1 bold and freeze it: select row 1 → Format → Bold → View → Freeze → 1 row

### 2. Create the Apps Script

1. With the Sheet open, click **Extensions → Apps Script**
2. Rename the project: `AuSuivant Questionnaire Endpoint`
3. Delete the default `myFunction` and paste this code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.session_id || "",
      data.batch_number || "",
      data.batch_title || "",
      data.submitted_at || "",
      data.locale || "",
      data.persona_id || "",
      data.user_agent || "",
      JSON.stringify(data.batch_answers || {}),
      JSON.stringify(data.cumulative_answers || {})
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "AuSuivant questionnaire endpoint is live" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Save the project (`Ctrl+S` or floppy disk icon)

### 3. Deploy as a web app

1. Click **Deploy → New deployment**
2. Click the gear icon → **Web app**
3. Configure:
   - **Description:** `v1 — initial deployment`
   - **Execute as:** **Me** (your account)
   - **Who has access:** **Anyone** ⚠️ Critical — must be "Anyone", not "Anyone with Google account"
4. Click **Deploy**, accept the authorisation flow ("Advanced → Go to ... (unsafe) → Allow")
5. Copy the **Web app URL** that looks like: `https://script.google.com/macros/s/AKfycbz.../exec`

### 4. Wire the URL into the questionnaire

Open [app.js](app.js) and edit the `CONFIG` block at the top:

```javascript
const CONFIG = {
  ENDPOINT: "https://script.google.com/macros/s/AKfycbz.../exec",  // paste yours
  METHOD: "apps-script",
  STORAGE_KEY: "ausuivant-questionnaire-v1",
  STORAGE_TTL_HOURS: 24
};
```

### 5. Test locally

```bash
cd "questionnaire"
python -m http.server 8000
```

Open http://localhost:8000 in a browser with DevTools console open. Walk through one persona path end-to-end and verify a row lands in your Sheet with the `Persona ID` column populated.

### 6. Deploy to GitHub Pages

```bash
git init && git branch -M main
git add .
git commit -m "Initial multi-persona questionnaire deployment"
git remote add origin https://github.com/YOUR-USERNAME/ausuivant-questionnaire.git
git push -u origin main
```

Then in the repo settings: **Settings → Pages → Source: main / `/ (root)` → Save**.

After ~1 minute, the questionnaire is live at `https://YOUR-USERNAME.github.io/ausuivant-questionnaire/`.

---

## Migrating from the single-persona version

If you previously deployed the single-persona version of this questionnaire, the upgrade requires three changes outside the repo:

### 1. Add the `Persona ID` column to your existing Sheet

The new Apps Script writes one extra column. **Insert a new column between "Locale" (column F) and "User Agent" (currently column G)** with the header `Persona ID`. Your sheet should now have 10 columns instead of 9.

If you have existing test rows from the single-persona version, delete them first to keep the sheet clean.

### 2. Update the Apps Script `doPost()` function

The new `doPost()` includes `data.persona_id || ""` between the locale and user agent rows. Replace the entire function with the version from step 2 above.

**Critical:** Apps Script requires a new deployment version when the code changes. After saving, click **Deploy → Manage deployments → pencil icon → Version: New version → Deploy**. The Web app URL stays the same — do not click "New deployment" or you'll get a different URL.

### 3. Refresh your browser

The questionnaire's localStorage key is unchanged (`ausuivant-questionnaire-v1`), so any in-progress sessions from the old version will resume — but they won't have a `selectedPersona` set, which means they'll fall through to "no questions visible" and silently finish. To avoid this for known-good test sessions, clear localStorage in the browser dev tools, or just hard-refresh the page.

---

## Sharing the link with respondents

Send a single link. Same URL for all 6 personas — the screener routes them automatically.

**Sample message in French:**

> Bonjour,
>
> Comme convenu, voici le questionnaire pour la recherche AuSuivant. La première page demande qui vous êtes (médecin, secrétaire médicale, patient) puis vous pose les questions adaptées à votre rôle. **5 questions à la fois**, vous pouvez vous arrêter quand vous voulez. Compter ~10 minutes selon votre profil.
>
> Vos réponses sont anonymisées et m'aident à concevoir un outil pour les cabinets médicaux français.
>
> Lien : https://YOUR-USERNAME.github.io/ausuivant-questionnaire/
>
> Merci infiniment pour votre temps.

The same link works for médecins, secrétaires médicales, and patients. The screener does the routing.

---

## How to add a new persona

Adding an 8th persona is a 5-minute task:

1. **Pick a code** (e.g., `P4` for "infirmière en cabinet")
2. **Add a button to the screener in [index.html](index.html)** — either as a top-level role on screen 1, or as a sub-variant under one of the existing roles
3. **Wire the persona code in `wireScreener()` in [app.js](app.js)** — add the role/sub-variant case to the `continueBtn.addEventListener("click", ...)` block
4. **Add the persona code to question definitions in [questions.js](questions.js)** — for each question this persona should see, add the code to its `personas: [...]` array (or create new questions tagged only for this persona)
5. **Test the new path** locally before pushing

No backend changes are needed — the `persona_id` column accepts any string.

---

## Editing question content

All questions live in `window.BATCHES` in [questions.js](questions.js). The structure is:

```javascript
window.BATCHES = [
  {
    number: 1,
    title: "...",
    subtitle: "...",
    estimatedMinutes: 3,
    questions: [
      {
        id: "unique_id",
        label: "...",
        type: "textarea",
        required: true,
        personas: ["P1", "P1b", "P1c"],
        helper: "..."
      },
      // ...
    ]
  },
  // more batches
];
```

### Reordering batches

Just rearrange the array. The user-facing "Série N sur M" label is computed dynamically from the batch's position among **visible** batches for the current persona — you don't need to renumber anything.

### Removing a question

Either delete the question object entirely, or remove the relevant persona codes from its `personas` array. Both work.

### The 5-question-per-batch convention

The user-facing copy promises "5 questions à la fois" but this is a soft convention — batches in this version range from 2 to 11 questions. The continue prompt between batches preserves the "stop here" UX regardless of batch size. If you want strict 5-per-batch, split larger batches manually.

---

## Privacy & data handling

This questionnaire is for **research interviews with consenting respondents**, not patient data. It is therefore **outside RGPD Article 9** (no health data), but should still follow basic RGPD obligations:

- **Lawful basis:** explicit consent (the respondent opens the link knowing what it is and clicks "C'est parti")
- **Data minimisation:** the form only asks what is necessary for product research; no clinical questions about patients
- **Storage location:** Google Sheets (your Google Workspace EU-region account is recommended for EU residency)
- **Retention:** delete responses from your backend within 24 months unless the respondent opts in to longer retention
- **Right to be forgotten:** if a respondent asks to be removed, search for their `session_id` in your backend and delete the matching rows

The optional email field at the end is opt-in only and is for sending a research summary back to the respondent.

If you collect responses from more than ~50 respondents, consider:

1. Reviewing the privacy notice with your DPO (designated under [docs/discovery/regulatory-summary.md](../docs/discovery/regulatory-summary.md))
2. Adding a clearer consent screen with retention period and right-to-erasure information
3. Using an EU-region Google Workspace account for the Sheet

---

## Troubleshooting

### "Submission failed" error
- **Check the endpoint URL** in [app.js](app.js) — full URL, not just the form ID
- **Check the browser console** (F12) for the actual error
- **Apps Script:** check that the deployment is set to **Anyone** access, not "Anyone with the link"; check that you redeployed after changing the code

### Apps Script returns CORS errors
- Make sure `METHOD: "apps-script"` is set in `CONFIG` — this switches to a CORS-safe content type
- If still failing, redeploy as a new version

### A persona's questionnaire is blank or skips immediately
- Check that at least one batch has at least one question tagged for that persona in its `personas: [...]` array
- Open browser console and run `getVisibleBatchCount("P1")` (or any persona code) to see how many batches are visible

### The progress bar shows wrong "Série N sur M"
- The numerator is computed by counting visible batches for the current persona; if the numbers look wrong, check that the persona is correctly set in `state.selectedPersona`

### A respondent reported losing answers when refreshing
- Answers persist in localStorage with a 24-hour TTL; refreshing within 24h restores everything
- After 24h, the state is cleared and they restart from the screener
- Private/incognito mode breaks localStorage persistence — answers are not restored across tab close

---

## Sample analysis after responses come in

Once responses are landing:

1. **Filter the Sheet by `Persona ID`** to see each persona's responses separately
2. **Sort by `Session ID`** within each persona to see each respondent's full journey
3. **Look at distributions, not averages:**
   - `pricing_floor` and `pricing_ceiling` — get the shape of the WTP distribution per doctor variant
   - `free_tier_cap` radio counts — how many doctors think 20/day is fair?
   - `secretary_gatekeeper` (P1) — code as themes
   - `camera_workaround` (P1b) — count the four buckets
4. **Cross-reference with [docs/discovery/desk-research-findings/synthesis.md](../docs/discovery/desk-research-findings/synthesis.md)** — for each `[interview-required]` hypothesis, see if responses move it from open to closed
5. **Update [docs/discovery/personas.md](../docs/discovery/personas.md)** with `[interview-confirmed]` / `[interview-contradicted]` tags after analysis

The questionnaire is the entire interview pipeline for this project — there are no in-person interviews. Treat each response as one full interview.
