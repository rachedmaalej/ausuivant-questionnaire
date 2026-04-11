/* AuSuivant questionnaire — application logic
 *
 * State machine, batch rendering, validation, and submission.
 * Uses native HTML elements — no framework dependency.
 */

/* ──────────────────────────── CONFIG ──────────────────────────── *
 * Replace ENDPOINT with your real backend before deploying.
 *
 * Two supported backends (see README.md for setup):
 *   1. Formspree: https://formspree.io/f/XXXXXXXX (METHOD: "formspree")
 *   2. Google Apps Script web app: https://script.google.com/macros/s/.../exec (METHOD: "apps-script")
 * ──────────────────────────────────────────────────────────────── */
const CONFIG = {
  ENDPOINT: "https://script.google.com/macros/s/AKfycbzpMQiZJ5kWcSWQsrRNoMFU0aYF70zHm7qu_82sLTX5PVZoc1rot0YnNaTvHHaztFz0/exec",
  METHOD: "apps-script", // "formspree" | "apps-script"
  STORAGE_KEY: "ausuivant-questionnaire-v1",
  STORAGE_TTL_HOURS: 24
};

/* ──────────────────────────── STATE ──────────────────────────── */
const state = {
  sessionId: null,
  currentBatchIndex: 0,
  cumulativeAnswers: {},
  practiceStructure: null,
  selectedPersona: null // "P1" | "P1b" | "P1c" | "P2" | "P3a" | "P3b" | "P3c"
};

/* ──────────────────────── DOM helpers ──────────────────────── */
const $ = (sel) => document.querySelector(sel);
const screens = {
  intro: $("#screen-intro"),
  screener: $("#screen-screener"),
  batch: $("#screen-batch"),
  submitting: $("#screen-submitting"),
  continue: $("#screen-continue"),
  thanks: $("#screen-thanks"),
  error: $("#screen-error")
};

function show(name) {
  for (const key of Object.keys(screens)) {
    screens[key].classList.toggle("hidden", key !== name);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ──────────────────────── Persistence ──────────────────────── */
function saveState() {
  try {
    localStorage.setItem(
      CONFIG.STORAGE_KEY,
      JSON.stringify({
        sessionId: state.sessionId,
        currentBatchIndex: state.currentBatchIndex,
        cumulativeAnswers: state.cumulativeAnswers,
        practiceStructure: state.practiceStructure,
        selectedPersona: state.selectedPersona,
        savedAt: Date.now()
      })
    );
  } catch (e) {
    /* ignore quota / private mode */
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const ageHours = (Date.now() - parsed.savedAt) / 36e5;
    if (ageHours > CONFIG.STORAGE_TTL_HOURS) {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch (e) {
    return null;
  }
}

function clearState() {
  try {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
  } catch (e) {
    /* ignore */
  }
}

/* ──────────────────────── UUID ──────────────────────── */
function generateSessionId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/* ──────────────────────── Question rendering ──────────────────────── */
function renderQuestion(q, indexInBatch) {
  const num = indexInBatch + 1;
  const required = q.required
    ? '<span class="question-required" aria-label="obligatoire">*</span>'
    : "";
  const helper = q.helper
    ? `<p class="question-helper">${escapeHtml(q.helper)}</p>`
    : "";

  const label = `
    <div class="question-label">
      <span class="question-number" aria-hidden="true">${num}</span>
      <span class="question-label-text">${escapeHtml(q.label)}${required}</span>
    </div>
    ${helper}
  `;

  let inputHtml = "";

  switch (q.type) {
    case "textarea":
      inputHtml = `
        <div class="question-input">
          <div class="text-field">
            <label for="q-${escapeHtml(q.id)}">Votre réponse</label>
            <textarea
              id="q-${escapeHtml(q.id)}"
              rows="5"
              data-question-id="${escapeHtml(q.id)}"
              data-required="${q.required ? "true" : "false"}"
              placeholder="Écrivez votre réponse…"
            ></textarea>
          </div>
        </div>
      `;
      break;

    case "short":
      const inputType = escapeHtml(q.inputType || "text");
      inputHtml = `
        <div class="question-input">
          <div class="text-field">
            <label for="q-${escapeHtml(q.id)}">Votre réponse</label>
            <input
              type="${inputType}"
              id="q-${escapeHtml(q.id)}"
              data-question-id="${escapeHtml(q.id)}"
              data-required="${q.required ? "true" : "false"}"
              placeholder="${inputType === "number" ? "Un nombre" : "Votre réponse"}"
            />
          </div>
        </div>
      `;
      break;

    case "pricing-pair":
      inputHtml = `
        <div class="question-input">
          <div class="pricing-row">
            <div class="text-field">
              <label for="q-${escapeHtml(q.id)}_floor">Prix raisonnable (€/mois)</label>
              <div class="pricing-suffix-wrap">
                <input
                  type="number"
                  min="0"
                  step="1"
                  id="q-${escapeHtml(q.id)}_floor"
                  data-question-id="${escapeHtml(q.id)}_floor"
                  data-required="${q.required ? "true" : "false"}"
                  placeholder="0"
                />
              </div>
            </div>
            <div class="text-field">
              <label for="q-${escapeHtml(q.id)}_ceiling">Prix où je dis non (€/mois)</label>
              <div class="pricing-suffix-wrap">
                <input
                  type="number"
                  min="0"
                  step="1"
                  id="q-${escapeHtml(q.id)}_ceiling"
                  data-question-id="${escapeHtml(q.id)}_ceiling"
                  data-required="${q.required ? "true" : "false"}"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <div class="text-field comment-field">
            <label for="q-${escapeHtml(q.id)}_reasoning">Votre raisonnement (facultatif)</label>
            <textarea
              id="q-${escapeHtml(q.id)}_reasoning"
              rows="3"
              data-question-id="${escapeHtml(q.id)}_reasoning"
              data-required="false"
              placeholder="Pourquoi ces deux prix ?"
            ></textarea>
          </div>
        </div>
      `;
      break;

    case "radio":
      const optionsHtml = q.options
        .map(
          (opt, idx) => `
        <label class="radio-option" for="q-${escapeHtml(q.id)}-${idx}">
          <input
            type="radio"
            name="${escapeHtml(q.id)}"
            value="${escapeHtml(opt.value)}"
            id="q-${escapeHtml(q.id)}-${idx}"
            data-question-id="${escapeHtml(q.id)}"
          />
          <span class="radio-label-text">${escapeHtml(opt.label)}</span>
        </label>
      `
        )
        .join("");

      const commentHtml = q.commentField
        ? `
        <div class="text-field comment-field">
          <label for="q-${escapeHtml(q.id)}_comment">Commentaire (facultatif)</label>
          <textarea
            id="q-${escapeHtml(q.id)}_comment"
            rows="3"
            data-question-id="${escapeHtml(q.id)}_comment"
            data-required="false"
            placeholder="Précisez si vous voulez…"
          ></textarea>
        </div>
      `
        : "";

      inputHtml = `
        <div class="question-input">
          <div class="radio-group" role="radiogroup" data-radio-group="${escapeHtml(q.id)}" data-required="${q.required ? "true" : "false"}">
            ${optionsHtml}
          </div>
          ${commentHtml}
        </div>
      `;
      break;

    default:
      inputHtml = `<p class="form-error">Type de question inconnu : ${escapeHtml(q.type)}</p>`;
  }

  return `<div class="question" data-question="${escapeHtml(q.id)}">${label}${inputHtml}</div>`;
}

/* ──────────────────────── Radio interaction ──────────────────────── */
function wireRadioGroups() {
  // Use native `input[type="radio"]`. The CSS `:has()` selector handles most
  // browsers, but we also add an explicit class as a fallback for older ones.
  document.querySelectorAll('.radio-option input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const groupName = radio.getAttribute("name");
      document
        .querySelectorAll(`.radio-option input[type="radio"][name="${groupName}"]`)
        .forEach((r) => {
          r.closest(".radio-option").classList.toggle("selected", r.checked);
        });
    });
  });
}

/* ──────────────────────── Persona filtering ──────────────────────── */
function getVisibleQuestions(batch, persona) {
  return batch.questions.filter((q) => {
    if (!q.personas) return true; // No filter = show to all (legacy compat)
    return q.personas.includes(persona);
  });
}

function getVisibleBatchCount(persona) {
  return window.BATCHES.filter((b) => {
    if (b.mspOnly && persona !== "P1c") return false;
    return getVisibleQuestions(b, persona).length > 0;
  }).length;
}

function getVisibleBatchPosition(currentIndex, persona) {
  // Returns the 1-indexed position of the current batch among visible batches for this persona
  let position = 0;
  for (let i = 0; i <= currentIndex; i += 1) {
    const b = window.BATCHES[i];
    if (b.mspOnly && persona !== "P1c") continue;
    if (getVisibleQuestions(b, persona).length === 0) continue;
    position += 1;
  }
  return position;
}

/* ──────────────────────── Validation ──────────────────────── */
function validateBatch(batch) {
  const errors = [];
  const visibleQuestions = getVisibleQuestions(batch, state.selectedPersona);

  for (const q of visibleQuestions) {
    if (!q.required) continue;

    if (q.type === "pricing-pair") {
      const floor = document
        .querySelector(`[data-question-id="${q.id}_floor"]`)
        ?.value?.trim();
      const ceiling = document
        .querySelector(`[data-question-id="${q.id}_ceiling"]`)
        ?.value?.trim();
      if (!floor || !ceiling) {
        errors.push(`« ${q.label.slice(0, 60)}… » — les deux prix sont requis`);
      }
    } else if (q.type === "radio") {
      let isChecked = false;
      document
        .querySelectorAll(`input[type="radio"][name="${q.id}"]`)
        .forEach((r) => {
          if (r.checked) isChecked = true;
        });
      if (!isChecked) {
        errors.push(`« ${q.label.slice(0, 60)}… » — choisissez une option`);
      }
    } else {
      const value = document
        .querySelector(`[data-question-id="${q.id}"]`)
        ?.value?.trim();
      if (!value) {
        errors.push(`« ${q.label.slice(0, 60)}… » — champ requis`);
      }
    }
  }

  return errors;
}

/* ──────────────────────── Answer collection ──────────────────────── */
function collectBatchAnswers(batch) {
  const result = {};
  const visibleQuestions = getVisibleQuestions(batch, state.selectedPersona);

  for (const q of visibleQuestions) {
    if (q.type === "pricing-pair") {
      result[`${q.id}_floor`] =
        document.querySelector(`[data-question-id="${q.id}_floor"]`)?.value?.trim() || "";
      result[`${q.id}_ceiling`] =
        document.querySelector(`[data-question-id="${q.id}_ceiling"]`)?.value?.trim() || "";
      result[`${q.id}_reasoning`] =
        document.querySelector(`[data-question-id="${q.id}_reasoning"]`)?.value?.trim() || "";
    } else if (q.type === "radio") {
      let value = "";
      document
        .querySelectorAll(`input[type="radio"][name="${q.id}"]`)
        .forEach((r) => {
          if (r.checked) value = r.value;
        });
      result[q.id] = value;
      if (q.commentField) {
        result[`${q.id}_comment`] =
          document.querySelector(`[data-question-id="${q.id}_comment"]`)?.value?.trim() || "";
      }
    } else {
      result[q.id] =
        document.querySelector(`[data-question-id="${q.id}"]`)?.value?.trim() || "";
    }
  }

  return result;
}

/* ──────────────────────── Render batch screen ──────────────────────── */
function showBatch(batchIndex) {
  const batch = window.BATCHES[batchIndex];
  if (!batch) {
    finish();
    return;
  }

  // Skip MSP-only batch if persona isn't P1c
  if (batch.mspOnly && state.selectedPersona !== "P1c") {
    showBatch(batchIndex + 1);
    return;
  }

  // Skip batch if no questions are visible for this persona
  const visibleQuestions = getVisibleQuestions(batch, state.selectedPersona);
  if (visibleQuestions.length === 0) {
    showBatch(batchIndex + 1);
    return;
  }

  state.currentBatchIndex = batchIndex;
  saveState();

  $("#batch-title").textContent = batch.title;
  $("#batch-subtitle").textContent = batch.subtitle;

  // Persona-aware progress: show "Série N sur M" where M = visible batches for this persona
  const totalVisible = getVisibleBatchCount(state.selectedPersona);
  const currentPosition = getVisibleBatchPosition(batchIndex, state.selectedPersona);
  $("#progress-text").textContent = `Série ${currentPosition} sur ${totalVisible}`;
  $("#progress-time").textContent = `≈ ${batch.estimatedMinutes} min`;
  const percent = totalVisible > 0 ? ((currentPosition - 1) / totalVisible) * 100 : 0;
  $("#progress-bar-fill").style.width = `${percent}%`;

  const container = $("#questions-container");
  container.innerHTML = visibleQuestions.map((q, i) => renderQuestion(q, i)).join("");

  const errorEl = $("#form-error");
  errorEl.classList.add("hidden");
  errorEl.innerHTML = "";

  $("#submit-label").textContent = "Envoyer";
  $("#btn-submit").disabled = false;

  show("batch");

  // Wire radios after DOM paint
  requestAnimationFrame(() => {
    wireRadioGroups();
  });
}

/* ──────────────────────── Submit ──────────────────────── */
async function submit() {
  const batch = window.BATCHES[state.currentBatchIndex];

  const errors = validateBatch(batch);
  if (errors.length > 0) {
    const errorEl = $("#form-error");
    errorEl.innerHTML =
      `<strong>Il manque quelques réponses :</strong><ul>` +
      errors.map((e) => `<li>${escapeHtml(e)}</li>`).join("") +
      "</ul>";
    errorEl.classList.remove("hidden");
    errorEl.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const batchAnswers = collectBatchAnswers(batch);

  if (batchAnswers.practice_structure) {
    state.practiceStructure = batchAnswers.practice_structure;
  }

  Object.assign(state.cumulativeAnswers, batchAnswers);
  saveState();

  show("submitting");

  try {
    await sendToBackend({
      session_id: state.sessionId,
      batch_number: batch.number,
      batch_title: batch.title,
      submitted_at: new Date().toISOString(),
      locale: "fr-FR",
      persona_id: state.selectedPersona,
      user_agent: navigator.userAgent,
      batch_answers: batchAnswers,
      cumulative_answers: state.cumulativeAnswers
    });

    showContinuePrompt();
  } catch (err) {
    console.error("Submission failed:", err);
    $("#error-detail").textContent = err.message || String(err);
    show("error");
  }
}

async function sendToBackend(payload) {
  const isAppsScript = CONFIG.METHOD === "apps-script";

  // Apps Script: use text/plain to avoid CORS preflight; the web app reads e.postData.contents
  const headers = isAppsScript
    ? { "Content-Type": "text/plain;charset=utf-8" }
    : {
        "Content-Type": "application/json",
        Accept: "application/json"
      };

  const response = await fetch(CONFIG.ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    redirect: "follow"
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return true;
}

/* ──────────────────────── Continue prompt ──────────────────────── */
function showContinuePrompt() {
  const persona = state.selectedPersona;
  const totalVisible = getVisibleBatchCount(persona);
  const currentPosition = getVisibleBatchPosition(state.currentBatchIndex, persona);

  $("#continue-progress").textContent =
    `Série ${currentPosition} sur ${totalVisible} dans la boîte.`;

  let nextIndex = state.currentBatchIndex + 1;

  // Skip MSP-only batches and empty batches
  while (nextIndex < window.BATCHES.length) {
    const next = window.BATCHES[nextIndex];
    if (next.mspOnly && persona !== "P1c") {
      nextIndex += 1;
      continue;
    }
    if (getVisibleQuestions(next, persona).length === 0) {
      nextIndex += 1;
      continue;
    }
    break;
  }

  if (nextIndex >= window.BATCHES.length) {
    finish();
    return;
  }

  const nextBatch = window.BATCHES[nextIndex];
  $("#continue-next-preview").textContent = `Prochaine série : ${nextBatch.title}.`;
  $("#continue-time").textContent = `Environ ${nextBatch.estimatedMinutes} minutes.`;

  $("#btn-continue").onclick = () => {
    showBatch(nextIndex);
  };

  show("continue");
}

/* ──────────────────────── Finish ──────────────────────── */
function finish() {
  $("#session-id-display").textContent = state.sessionId;
  show("thanks");
}

/* ──────────────────────── Email opt-in ──────────────────────── */
async function submitOptIn() {
  const email = $("#optin-email").value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const status = $("#optin-status");
    status.textContent = "Email invalide.";
    status.classList.remove("hidden");
    return;
  }

  $("#btn-optin").disabled = true;

  try {
    await sendToBackend({
      session_id: state.sessionId,
      batch_number: 0,
      batch_title: "Email opt-in for cohort summary",
      submitted_at: new Date().toISOString(),
      locale: "fr-FR",
      persona_id: state.selectedPersona,
      user_agent: navigator.userAgent,
      batch_answers: { optin_email: email },
      cumulative_answers: { ...state.cumulativeAnswers, optin_email: email }
    });
    const status = $("#optin-status");
    status.textContent = "C'est noté, merci.";
    status.classList.remove("hidden");
  } catch (err) {
    const status = $("#optin-status");
    status.textContent = "L'envoi n'a pas marché. Réessayez dans un instant.";
    status.classList.remove("hidden");
    $("#btn-optin").disabled = false;
  }
}

/* ──────────────────────── Screener ──────────────────────── */
function wireScreener() {
  const roleRadios = document.querySelectorAll('input[name="screener_role"]');
  const doctorVariant = $("#screener-doctor-variant");
  const patientVariant = $("#screener-patient-variant");
  const continueBtn = $("#btn-screener-continue");
  const errorEl = $("#screener-error");

  function clearVariant(name) {
    document.querySelectorAll(`input[name="${name}"]`).forEach((r) => {
      r.checked = false;
      r.closest(".radio-option")?.classList.remove("selected");
    });
  }

  function updateContinueState() {
    const role = document.querySelector('input[name="screener_role"]:checked')?.value;
    let isComplete = false;

    if (role === "secretaire") {
      isComplete = true;
    } else if (role === "medecin") {
      isComplete = !!document.querySelector('input[name="screener_doctor"]:checked');
    } else if (role === "patient") {
      isComplete = !!document.querySelector('input[name="screener_patient"]:checked');
    }

    continueBtn.disabled = !isComplete;
  }

  roleRadios.forEach((r) => {
    r.addEventListener("change", () => {
      const role = r.value;
      doctorVariant.classList.toggle("hidden", role !== "medecin");
      patientVariant.classList.toggle("hidden", role !== "patient");
      if (role !== "medecin") clearVariant("screener_doctor");
      if (role !== "patient") clearVariant("screener_patient");
      errorEl.classList.add("hidden");
      updateContinueState();
    });
  });

  document
    .querySelectorAll('input[name="screener_doctor"], input[name="screener_patient"]')
    .forEach((r) => r.addEventListener("change", updateContinueState));

  continueBtn.addEventListener("click", () => {
    const role = document.querySelector('input[name="screener_role"]:checked')?.value;
    let persona = null;

    if (role === "secretaire") {
      persona = "P2";
    } else if (role === "medecin") {
      persona = document.querySelector('input[name="screener_doctor"]:checked')?.value;
    } else if (role === "patient") {
      persona = document.querySelector('input[name="screener_patient"]:checked')?.value;
    }

    if (!persona) {
      errorEl.textContent = "Merci de répondre aux questions ci-dessus.";
      errorEl.classList.remove("hidden");
      return;
    }

    state.selectedPersona = persona;
    state.currentBatchIndex = 0;
    state.cumulativeAnswers = {};
    saveState();
    showBatch(0);
  });
}

/* ──────────────────────── Init ──────────────────────── */
function init() {
  // Restore session if recent
  const restored = loadState();
  if (restored && restored.sessionId) {
    state.sessionId = restored.sessionId;
    state.currentBatchIndex = restored.currentBatchIndex || 0;
    state.cumulativeAnswers = restored.cumulativeAnswers || {};
    state.practiceStructure = restored.practiceStructure || null;
    state.selectedPersona = restored.selectedPersona || null;
  } else {
    state.sessionId = generateSessionId();
  }

  $("#btn-start").addEventListener("click", () => {
    show("screener");
  });

  wireScreener();

  $("#batch-form").addEventListener("submit", (e) => {
    e.preventDefault();
    submit();
  });

  $("#btn-cancel").addEventListener("click", () => {
    if (
      confirm(
        "Sûr ? Vos réponses pour cette série seront perdues."
      )
    ) {
      clearState();
      window.location.reload();
    }
  });

  $("#btn-stop").addEventListener("click", () => {
    finish();
  });

  $("#btn-retry").addEventListener("click", () => {
    submit();
  });

  $("#btn-optin").addEventListener("click", submitOptIn);

  show("intro");
}

document.addEventListener("DOMContentLoaded", init);
