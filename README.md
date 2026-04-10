# AuSuivant — Doctor Questionnaire

A Material Design 3 web questionnaire that asks French generalist doctors **5 research questions at a time**, with the option to continue for 5 more after each batch. Designed for the AuSuivant Phase 1 Discovery interviews.

- **No build step.** Pure HTML/CSS/JS, Material Web 3 components loaded from CDN.
- **GitHub Pages friendly.** Drop the folder into a repo, enable Pages, done.
- **Progressive batches.** 5 questions → submit → "another 5?" → 5 more → submit → ... up to 25 questions.
- **MSP branch.** The 5th batch only appears for doctors in a maison de santé pluriprofessionnelle.
- **Recoverable.** Answers are kept in localStorage for 24 hours; an accidental refresh doesn't lose them.
- **Pluggable backend.** Two free options documented below: Formspree (easiest) or Google Apps Script (most control, free forever).

---

## What's in this folder

```
questionnaire/
├── index.html       # the shell
├── styles.css       # MD3 custom theme + layout
├── app.js           # state machine, validation, submission
├── questions.js     # the 25 questions in 5 batches — edit this to change content
├── .nojekyll        # tells GitHub Pages not to run Jekyll
└── README.md        # you are here
```

To **change a question**, edit only [questions.js](questions.js).
To **change colours or layout**, edit only [styles.css](styles.css).
To **change the backend**, edit only the `CONFIG` block at the top of [app.js](app.js).

---

## Quick start (10 minutes)

### 1. Pick a backend

You need somewhere for the answers to land. Two recommended options:

| | **Formspree** (easiest) | **Google Apps Script** (more control) |
|---|---|---|
| Setup time | 2 min | 8 min |
| Free tier | 50 submissions/month | Unlimited |
| Where data lands | Formspree dashboard + email | Your own Google Sheet |
| Best for | First few interviews | Long-term collection |

**Pick Formspree** if you want it working in 2 minutes and have <10 doctors to interview.
**Pick Apps Script** if you want full control and your data in a spreadsheet.

You can switch later — only one variable changes in `app.js`.

### 2A. Setup with Formspree

1. Go to [formspree.io](https://formspree.io) and sign up (free).
2. Create a new form. Pick "Plain HTML form" — that's all you need.
3. Copy the form endpoint, which looks like:
   `https://formspree.io/f/xyzabc123`
4. Open [app.js](app.js) and edit the `CONFIG` block at the top:
   ```js
   const CONFIG = {
     ENDPOINT: "https://formspree.io/f/xyzabc123",  // ← paste yours
     METHOD: "formspree",
     // ...
   };
   ```
5. Save. That's it — see step 3 for deployment.

**Note on Formspree's free tier:** the limit is 50 submissions per month *per form*. Each batch counts as one submission. If a doctor completes all 5 batches, that's 5 submissions for one interview. So 50/month = ~10 doctors. Upgrade to Formspree's paid tier (~€10/month) if you go over.

### 2B. Setup with Google Apps Script

1. Go to [sheets.google.com](https://sheets.google.com) and create a new sheet. Name it whatever you like (e.g., "AuSuivant — Doctor responses").
2. In row 1, paste these column headers:
   ```
   Received   Session ID   Batch #   Batch Title   Submitted At   Locale   User Agent   Batch Answers (JSON)   Cumulative Answers (JSON)
   ```
3. Click **Extensions → Apps Script**.
4. Delete any existing code and paste this:

   ```js
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
   ```

5. Click **Deploy → New deployment**.
6. Click the gear icon → **Web app**.
7. Configure:
   - **Description:** "AuSuivant questionnaire endpoint"
   - **Execute as:** Me (your account)
   - **Who has access:** **Anyone** (this lets the public form post anonymously)
8. Click **Deploy**. You may need to authorise the script. Accept the warnings — it's your own script writing to your own sheet.
9. Copy the **Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfycbz.../exec`
10. Open [app.js](app.js) and edit the `CONFIG` block:
    ```js
    const CONFIG = {
      ENDPOINT: "https://script.google.com/macros/s/AKfycbz.../exec",  // ← paste yours
      METHOD: "apps-script",
      // ...
    };
    ```
11. Save.

**Important:** if you ever change the Apps Script code, you must **redeploy a new version** (Deploy → Manage deployments → edit → Version: New version → Deploy). The URL stays the same.

**Why "text/plain" content type?** Apps Script web apps don't handle CORS preflight gracefully for `application/json` POSTs. The `app.js` code automatically uses `text/plain;charset=utf-8` when `METHOD: "apps-script"` is set, which sidesteps the preflight. Apps Script reads the JSON body via `e.postData.contents` regardless of content type.

### 3. Deploy on GitHub Pages

1. Create a new repository on GitHub. Suggested name: `ausuivant-questionnaire`.
2. Push the contents of this folder (the **inside** of `questionnaire/`, not the folder itself) to the root of the repo.
3. In the repo, go to **Settings → Pages**.
4. Under **Source**, pick:
   - **Branch:** `main` (or whatever your default branch is)
   - **Folder:** `/ (root)`
5. Click **Save**.
6. Wait 1–2 minutes. GitHub Pages will tell you the URL — typically `https://YOUR-USERNAME.github.io/ausuivant-questionnaire/`.
7. Visit that URL. The questionnaire should load.

**Custom domain (optional):** if you want `questionnaire.ausuivant.fr`, add a `CNAME` file in the repo root containing your domain, and configure DNS as GitHub Pages instructs.

---

## Sharing the link with a doctor

Send a single link. No login, no app, no install. The questionnaire works on:

- iPhone Safari (iOS 15+)
- Android Chrome
- Desktop Chrome / Firefox / Safari / Edge (last 2 years)

**Recommended message** to a doctor (in French):

> Bonjour Docteur,
>
> Comme convenu, voici le questionnaire dont je vous parlais. **5 questions à la fois**, vous pouvez vous arrêter quand vous voulez. La première série prend ~8 minutes. Vos réponses sont anonymisées et m'aident à concevoir un outil pour les cabinets médicaux.
>
> Lien : https://YOUR-USERNAME.github.io/ausuivant-questionnaire/
>
> Merci infiniment pour votre temps.

---

## Editing questions

All 25 questions live in [questions.js](questions.js). The structure is:

```js
window.BATCHES = [
  {
    number: 1,
    title: "...",
    subtitle: "...",
    estimatedMinutes: 8,
    questions: [
      { id: "unique_id", label: "...", type: "textarea", required: true, helper: "..." },
      ...
    ]
  },
  ...
];
```

### Question types

| Type | What it renders | When to use |
|---|---|---|
| `textarea` | A multi-line text field, ~5 rows | Open-ended questions, default |
| `short` | A single-line text or number field | Pricing numbers, percentages, names |
| `radio` | A vertical radio group (set `options: [...]`); add `commentField: true` for an optional comment box | Categorical answers |
| `pricing-pair` | Two number fields side-by-side (floor + ceiling) plus an optional reasoning textarea | Use only for the WTP question |

**Question fields:**

- `id` — unique identifier; becomes the column key in the backend payload. **Don't reuse IDs across batches.**
- `label` — the question itself, in French
- `helper` — optional one-line clarification under the label
- `type` — see table above
- `required` — boolean; if true, the user can't submit the batch without answering
- `options` — for `radio` only: array of `{ value, label }` pairs
- `commentField` — for `radio` only: adds an optional textarea below the radio group
- `inputType` — for `short` only: `"text"` (default) or `"number"`

### Reordering or removing questions

Just edit the array. The `number` field on each batch is cosmetic — the order is determined by the array index. The "Série N sur 5" progress label uses the `number` field, so update it if you remove a batch.

### Adding a new batch

Add another object to the `window.BATCHES` array. Make sure it has 5 questions (or change the title to reflect a different count). The "5 at a time" UX is hardcoded only in the user-facing copy, not in the logic — you can technically have batches of any size.

### Conditional batches

The 5th batch (`mspOnly: true`) is only shown to doctors who selected "MSP" in batch 4's `practice_structure` question. If you want to add another conditional batch, the logic lives in `showContinuePrompt()` in [app.js](app.js).

---

## Customising the look

The colour scheme is in [styles.css](styles.css), at the top under `:root`. The primary colour is AuSuivant navy (`#1A3C8F`). To change it, edit `--md-sys-color-primary` and ideally also the related `-container` and `-on-primary` tokens (use [m3.material.io/theme-builder](https://m3.material.io/theme-builder) to generate a full palette from a seed colour).

A dark mode is included automatically via `@media (prefers-color-scheme: dark)`.

**Typography:** Material Web 3 ships its own typescale. The body text is `Roboto` by default; if you want a different font, override `font-family` in `body`.

---

## Privacy & data handling

This questionnaire is for **research interviews with consenting doctors**, not patient data. It is therefore **outside RGPD Article 9** (no health data), but should still follow basic RGPD obligations:

- **Lawful basis:** explicit consent (the doctor opens the link knowing what it is and clicks "Commencer")
- **Data minimisation:** the form only asks what is necessary for product research; no clinical questions
- **Storage location:** the backend you chose
  - **Formspree:** US-headquartered, but offers an EU data residency option on paid plans. Fine for non-PII research at small scale; review their DPA if you go to volume.
  - **Google Apps Script:** stores in your Google Drive. Google Workspace EU-region accounts can keep data in EU.
- **Retention:** delete responses from your backend within 24 months unless the doctor opts in to longer retention
- **Right to be forgotten:** if a doctor asks to be removed, search for their `session_id` in your backend and delete the matching rows

**This questionnaire never collects patient information.** All questions are about the doctor's own practice, opinions, and tooling. The optional email field at the end is opt-in only and is for sending a research summary back to the doctor.

If you collect responses from more than ~50 doctors, consider:
1. Reviewing the privacy notice with your DPO (designated under [docs/discovery/regulatory-summary.md](../docs/discovery/regulatory-summary.md))
2. Adding a clearer consent screen with retention period and right-to-erasure information
3. Switching to an EU-only backend (e.g., Cloudflare Workers + D1 in EU region)

---

## Troubleshooting

### "Submission failed" error
- **Check the endpoint URL** in [app.js](app.js) — it must be the full URL, not just the form ID
- **Check the browser console** (F12) for the actual error
- **Formspree:** check that your form is "active" in the dashboard and not in test mode
- **Apps Script:** check that the deployment is set to "Anyone" access, not "Anyone with the link"; check that you redeployed after changing the code

### Apps Script returns CORS errors
- Make sure `METHOD: "apps-script"` is set in `CONFIG` — this switches to a CORS-safe content type
- If still failing, redeploy as a new version (Apps Script versioning is finicky)

### The form looks unstyled / broken
- The Material Web 3 components are loaded from CDN. If the user's network blocks `esm.run`, the components won't render.
- For production use you can self-host the Material Web bundle. See the `@material/web` README at https://github.com/material-components/material-web for instructions.

### A doctor reported losing answers when refreshing
- Answers are persisted to localStorage with a 24-hour TTL. If they refreshed after 24 hours, the state was cleared.
- If they cleared their browser data manually, there's nothing we can do.
- If they used private/incognito mode, localStorage doesn't persist across closing the window.

### The progress bar shows the wrong percentage
- The bar uses `state.currentBatchIndex / window.BATCHES.length`. If you skip the MSP batch, the percentage will jump. This is intentional — the bar reflects how many batches the *individual doctor* will see, not the total possible.

---

## Sample analysis after responses come in

Once you have responses, here's a quick mental model for analysis:

1. **Sort by `session_id`** to see each doctor's full journey. Some will stop after batch 1, some will go all the way.
2. **Look at which questions cluster on confidence-revealing dimensions:**
   - `pricing_floor` and `pricing_ceiling` — get distributions, not averages
   - `free_tier_cap` radio — count the four buckets
   - `secretary_gatekeeper` and `last_tool_adopted` — code as themes (does the secrétaire really decide?)
   - `camera_workaround` — one of the strongest signals
3. **Cross-reference against the desk research synthesis** at [docs/discovery/desk-research-findings/synthesis.md](../docs/discovery/desk-research-findings/synthesis.md). For each hypothesis with `[interview-required]`, see if these responses move it from open to closed.
4. **Update [personas.md](../docs/discovery/personas.md)** with `[interview-confirmed]` / `[interview-contradicted]` tags after reading the responses.
5. **Update [feature-backlog.md §6](../docs/discovery/feature-backlog.md)** if any pain or coverage gap shifted.

The questionnaire is a complement to live interviews, not a replacement. A doctor who answers all 25 questions in writing is still less rich than one who talks for 30 minutes — but a doctor who answers 5 questions in writing is much better than nothing, and the format respects their time.
