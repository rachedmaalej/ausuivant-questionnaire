/* AuSuivant questionnaire — multi-persona question data
 *
 * 6 personas, organized into 6 logical batches.
 *
 * Persona codes:
 *   - P1   Médecin avec secrétaire
 *   - P1b  Médecin solo (sans secrétaire)
 *   - P1c  Médecin en cabinet de groupe ou MSP
 *   - P2   Secrétaire médicale
 *   - P3a  Patient adulte actif
 *   - P3b  Patient senior
 *   - P3c  Parent qui consulte pour son enfant
 *
 * Question types:
 *   - "textarea"     long-form free text
 *   - "short"        single-line text or number
 *   - "radio"        single choice from `options` (optional `commentField`)
 *   - "pricing-pair" two number fields (floor + ceiling) plus optional reasoning
 *
 * Each question has a `personas: [...]` field listing which persona codes
 * should see it. Questions without `personas` are shown to everyone (legacy compat).
 *
 * Special batch flag:
 *   - mspOnly: true   batch only shown to P1c (legacy compat with previous version)
 *
 * Batches are skipped automatically if no question is visible for the current persona.
 */

window.BATCHES = [
  /* ═════════════════════════════════════════════════════════════════════════
     BATCH 1 — Contexte (warm-up)
     Light demographic / context questions to ease into the questionnaire.
     ═════════════════════════════════════════════════════════════════════════ */
  {
    number: 1,
    title: "Pour commencer, parlez-nous un peu de vous",
    subtitle:
      "Quelques questions de contexte pour bien situer votre quotidien. Ça prend deux minutes.",
    estimatedMinutes: 3,
    questions: [
      // ─── Doctors: practice volume + walk-in ratio ───
      {
        id: "walkin_ratio",
        label: "Quelle part de votre activité est en sans rendez-vous ?",
        helper: "Une estimation suffit. Par exemple : 30 % sans rendez-vous, 70 % rendez-vous.",
        type: "short",
        inputType: "text",
        required: true,
        personas: ["P1", "P1b", "P1c"]
      },
      {
        id: "daily_volume",
        label: "Combien de patients voyez-vous une journée typique ?",
        helper: "",
        type: "short",
        inputType: "number",
        required: true,
        personas: ["P1", "P1b", "P1c"]
      },

      // ─── Secrétaire: tenure + scope ───
      {
        id: "secretaire_tenure",
        label: "Depuis combien de temps êtes-vous secrétaire médicale ?",
        helper: "Et dans le cabinet où vous êtes actuellement, ça fait combien de temps ?",
        type: "textarea",
        required: true,
        personas: ["P2"]
      },
      {
        id: "secretaire_scope",
        label: "Combien de médecins gérez-vous ? À temps plein, à temps partiel ?",
        helper: "",
        type: "short",
        inputType: "text",
        required: true,
        personas: ["P2"]
      },
      {
        id: "secretaire_remote",
        label: "Vous travaillez sur place tous les jours, ou à distance certains jours ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P2"],
        options: [
          { value: "onsite", label: "Sur place tous les jours" },
          { value: "hybrid", label: "Mélange sur place et à distance" },
          { value: "remote", label: "Toujours à distance (télésecrétariat)" }
        ]
      },

      // ─── Patients: visit frequency + setting ───
      {
        id: "visit_frequency",
        label: "Vous allez chez le médecin sans rendez-vous souvent, ou rarement ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P3a", "P3b", "P3c"],
        options: [
          { value: "weekly", label: "Plusieurs fois par mois" },
          { value: "monthly", label: "Une fois par mois environ" },
          { value: "rarely", label: "Quelques fois par an" },
          { value: "never_almost", label: "Très rarement, presque jamais" }
        ]
      },
      {
        id: "urban_rural",
        label: "Vous y allez plutôt en ville ou à la campagne ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P3a", "P3b", "P3c"],
        options: [
          { value: "urban", label: "En ville" },
          { value: "periurban", label: "En périphérie / banlieue" },
          { value: "rural", label: "À la campagne ou en village" }
        ]
      },
      {
        id: "smartphone_use",
        label: "Vous utilisez un smartphone ? Pour quoi en général ?",
        helper: "Téléphone, WhatsApp, Doctolib, recherches sur Internet — qu'est-ce qui en revient le plus souvent ?",
        type: "textarea",
        required: true,
        personas: ["P3a", "P3b", "P3c"]
      }
    ]
  },

  /* ═════════════════════════════════════════════════════════════════════════
     BATCH 2 — La réalité quotidienne
     Open-ended day-in-the-life questions. The most important narrative source.
     ═════════════════════════════════════════════════════════════════════════ */
  {
    number: 2,
    title: "Votre quotidien, raconté simplement",
    subtitle:
      "Cette série est libre — racontez à votre façon, comme vous le diriez à un confrère.",
    estimatedMinutes: 6,
    questions: [
      // ─── Doctors: a busy day ───
      {
        id: "day_in_life",
        label:
          "Racontez-nous votre dernière journée vraiment chargée. Pas une journée idéale, pas une catastrophe — une journée chargée et représentative. Du moment où vous arrivez au cabinet jusqu'à la fin.",
        helper:
          "Pas de mauvaise réponse. Plus c'est concret et vivant, mieux c'est.",
        type: "textarea",
        required: true,
        personas: ["P1", "P1b", "P1c"]
      },
      {
        id: "interruptions_count",
        label:
          "Sur cette journée, à peu près combien de fois on vous interrompt en consultation à propos de la file d'attente ?",
        helper: "Une estimation suffit. Une, cinq, vingt fois ?",
        type: "short",
        inputType: "text",
        required: true,
        personas: ["P1", "P1b", "P1c"]
      },
      {
        id: "queue_visibility",
        label:
          "Comment savez-vous, à un instant donné, combien de patients sans rendez-vous attendent dans votre salle d'attente ?",
        helper: "Liste papier, secrétaire qui vous prévient, vous regardez par la porte ?",
        type: "textarea",
        required: true,
        personas: ["P1", "P1b", "P1c"]
      },
      {
        id: "day_end_predictability",
        label:
          "Le matin en arrivant au cabinet, vous savez à quelle heure vous allez finir ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P1", "P1b", "P1c"],
        commentField: true,
        options: [
          { value: "30min", label: "Oui, à 30 minutes près" },
          { value: "1hour", label: "À une heure près, environ" },
          { value: "2hour", label: "Vaguement, à deux heures près" },
          { value: "no_idea", label: "Aucune idée, c'est toujours une surprise" }
        ]
      },

      // ─── Secrétaire: a busy morning ───
      {
        id: "secretaire_busy_morning",
        label:
          "Racontez-nous une matinée vraiment chargée. Pas une bonne matinée, pas une catastrophe — une matinée où vous étiez bien occupée. Du moment où vous arrivez jusqu'à midi.",
        helper:
          "Plus c'est concret, mieux c'est. Aucun détail n'est trop petit.",
        type: "textarea",
        required: true,
        personas: ["P2"]
      },
      {
        id: "secretaire_paper_or_software",
        label:
          "Comment notez-vous les patients qui arrivent sans rendez-vous ? Papier, logiciel, dans votre tête ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P2"]
      },
      {
        id: "secretaire_how_long_count",
        label:
          "Combien de fois par jour, à peu près, un patient vous demande combien de temps il va attendre ?",
        helper: "Une estimation suffit.",
        type: "short",
        inputType: "text",
        required: true,
        personas: ["P2"]
      },
      {
        id: "secretaire_phone_share",
        label:
          "Sur une journée, vous passez à peu près combien de temps au téléphone par rapport au comptoir ?",
        helper: "Un pourcentage approximatif suffit. Par exemple : moitié-moitié, ou 70 % téléphone.",
        type: "short",
        inputType: "text",
        required: true,
        personas: ["P2"]
      },

      // ─── Patients: last walk-in visit ───
      {
        id: "last_visit_story",
        label:
          "Racontez-nous votre dernière visite chez un médecin sans rendez-vous, du début à la fin. Pas la consultation elle-même — juste ce qui s'est passé entre votre arrivée et le moment où vous avez vu le médecin.",
        helper:
          "Le plus naturel possible. C'est votre récit qui nous intéresse.",
        type: "textarea",
        required: true,
        personas: ["P3a", "P3b", "P3c"]
      },
      {
        id: "wait_known_in_advance",
        label:
          "Quand vous êtes arrivé, est-ce que quelqu'un vous a dit combien de temps vous alliez attendre ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P3a", "P3b", "P3c"],
        commentField: true,
        options: [
          { value: "precise", label: "Oui, on m'a donné une estimation précise" },
          { value: "vague", label: "Oui, mais c'était vague" },
          { value: "nothing", label: "Non, rien du tout" }
        ]
      },
      {
        id: "wait_duration",
        label: "Combien de temps avez-vous attendu, à peu près ?",
        helper: "",
        type: "short",
        inputType: "text",
        required: true,
        personas: ["P3a", "P3b", "P3c"]
      }
    ]
  },

  /* ═════════════════════════════════════════════════════════════════════════
     BATCH 3 — Les hypothèses du produit
     Test the highest-priority hypotheses (D-H1, D-H7, S-H1, P3a-H2, P3c-H4...)
     ═════════════════════════════════════════════════════════════════════════ */
  {
    number: 3,
    title: "Et si on imaginait un outil…",
    subtitle:
      "Quelques scénarios concrets. Premier réflexe, sans réfléchir — c'est ce qui nous est le plus utile.",
    estimatedMinutes: 6,
    questions: [
      // ─── Doctors: pricing pair (the biggest gap) ───
      {
        id: "pricing",
        label:
          "Un outil qui ne ferait qu'une chose — gérer la file d'attente des sans rendez-vous. À quel prix mensuel ça vous semble correct, et à quel prix vous décrochez ?",
        helper:
          "Deux chiffres approximatifs suffisent : un prix juste, un prix de trop. Pas besoin d'être au centime près.",
        type: "pricing-pair",
        required: true,
        personas: ["P1", "P1b", "P1c"]
      },

      // ─── Doctors: 20/day FREE tier cap ───
      {
        id: "free_tier_cap",
        label:
          "Et si c'était gratuit jusqu'à 20 patients par jour, payant au-delà ? Vous diriez quoi de ce seuil ?",
        helper:
          "20 patients/jour, c'est l'ordre de grandeur d'un cabinet mixte rendez-vous + sans rendez-vous.",
        type: "radio",
        required: true,
        personas: ["P1", "P1b", "P1c"],
        commentField: true,
        options: [
          { value: "too_tight", label: "Trop serré, je le dépasserais souvent" },
          { value: "fair", label: "Plutôt juste" },
          { value: "too_generous", label: "Trop généreux, je ne paierais jamais" },
          { value: "depends", label: "Ça dépend, je précise en commentaire" }
        ]
      },

      // ─── Doctors: fin estimée 19h12 question ───
      {
        id: "fin_estimee_value",
        label:
          "À 10h, un outil vous dit : « vous sortirez à 19h12 ce soir, à 15 minutes près ». Concrètement, ça change quoi pour vous ?",
        helper:
          "Une phrase suffit. Et si ça ne change rien, dites-le — c'est aussi une réponse utile.",
        type: "textarea",
        required: true,
        personas: ["P1", "P1b", "P1c"]
      },

      // ─── Doctors: leave-and-return (Belgian precedent) ───
      {
        id: "leave_and_return_doctor",
        label:
          "Un patient vous demande s'il peut aller chercher son pain et revenir dans 20 minutes, alors qu'il y a 4 personnes devant lui. Si un outil garantissait qu'il reçoit un SMS 10 minutes avant son tour, ce serait pratique ou problématique pour vous ?",
        helper: "Pensez à votre gestion réelle, pas à ce qui « devrait » fonctionner.",
        type: "radio",
        required: true,
        personas: ["P1", "P1b", "P1c"],
        commentField: true,
        options: [
          { value: "practical", label: "Pratique, ça réglerait un vrai problème" },
          { value: "depends", label: "Ça dépend, je précise en commentaire" },
          { value: "problematic", label: "Problématique, je préfère qu'ils restent sur place" }
        ]
      },

      // ─── Secrétaire: 5-second add patient ───
      {
        id: "secretaire_5_second_add",
        label:
          "Si on vous disait qu'ajouter un patient à la file dans un nouvel outil prend 5 secondes, vous y croyez ou vous êtes sceptique ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P2"],
        commentField: true,
        options: [
          { value: "believe", label: "J'y crois si c'est bien fait" },
          { value: "skeptical", label: "Je suis sceptique, j'ai déjà vu ça promis et pas tenu" },
          { value: "depends", label: "Ça dépend du logiciel, je précise" }
        ]
      },

      // ─── Secrétaire: QR check-in: relief or threat ───
      {
        id: "secretaire_qr_relief_or_threat",
        label:
          "Imaginez que vos patients puissent scanner un QR code en arrivant et s'inscrire eux-mêmes dans la file, sans vous solliciter. Pour vous, c'est plutôt un soulagement ou une perte de contrôle ?",
        helper: "Réponse honnête, c'est exactement ce qu'on cherche.",
        type: "textarea",
        required: true,
        personas: ["P2"]
      },

      // ─── Secrétaire: how long phone calls hidden cost ───
      {
        id: "secretaire_phone_how_long_share",
        label:
          "Sur une journée, à peu près combien d'appels téléphoniques sont juste pour demander combien de temps il faut attendre ?",
        helper: "Une estimation suffit.",
        type: "short",
        inputType: "text",
        required: true,
        personas: ["P2"]
      },

      // ─── Patients: would you leave the waiting room? ───
      {
        id: "patient_would_leave",
        label:
          "Si en arrivant on vous disait « vous êtes en position 4, environ 35 minutes d'attente, vous pouvez sortir, on vous prévient par SMS quand c'est presque votre tour », est-ce que vous quitteriez la salle d'attente ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P3a", "P3b", "P3c"],
        commentField: true,
        options: [
          { value: "yes_definitely", label: "Oui, sans hésiter" },
          { value: "yes_first_visit_no", label: "Pas la première fois, mais après oui" },
          { value: "stay_anyway", label: "Non, je resterais quand même au cas où" }
        ]
      },

      // ─── Patients: trust threshold ───
      {
        id: "patient_trust_threshold",
        label:
          "Qu'est-ce qui vous ferait NE PAS faire confiance à ce système ?",
        helper: "Pannes, retards, mauvaises expériences passées… ce qui vous vient en tête.",
        type: "textarea",
        required: true,
        personas: ["P3a", "P3b", "P3c"]
      }
    ]
  },

  /* ═════════════════════════════════════════════════════════════════════════
     BATCH 4 — Spécifique persona
     The questions only this persona can answer.
     ═════════════════════════════════════════════════════════════════════════ */
  {
    number: 4,
    title: "Quelques questions pour vous, plus spécifiquement",
    subtitle:
      "Selon votre situation, quelques détails que personne d'autre ne peut nous dire.",
    estimatedMinutes: 7,
    questions: [
      // ─── P1 only: secretary gatekeeper scenario ───
      {
        id: "secretary_gatekeeper",
        label:
          "Vous installez un nouvel outil dans votre cabinet. Au bout d'une semaine, votre secrétaire le déteste. Concrètement, qu'est-ce qui se passe ?",
        helper:
          "Ce qui se passerait vraiment, pas ce qui « devrait » se passer.",
        type: "textarea",
        required: true,
        personas: ["P1"]
      },
      {
        id: "secretary_decision_voice",
        label:
          "Quand vous adoptez un nouvel outil, votre secrétaire a-t-elle son mot à dire dans la décision ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P1"],
        commentField: true,
        options: [
          { value: "yes_central", label: "Oui, son avis est central" },
          { value: "yes_consulted", label: "Oui, je la consulte" },
          { value: "no_my_call", label: "Non, c'est moi qui décide" }
        ]
      },

      // ─── P1b only: carillon, camera, solo mode ───
      {
        id: "carillon",
        label:
          "Quand vous êtes en consultation et qu'un patient sans rendez-vous vient d'arriver, comment le savez-vous ? Carillon, sonnette, bruit de porte, vous écoutez ?",
        helper:
          "Et si demain un outil ajoutait silencieusement les patients à votre écran sans faire aucun son, vous le sauriez ?",
        type: "textarea",
        required: true,
        personas: ["P1b"]
      },
      {
        id: "camera_workaround",
        label:
          "Le Quotidien du Médecin a écrit que certains confrères installent une caméra de surveillance dans leur salle d'attente pour voir qui vient d'arriver pendant qu'ils sont en consultation. Vous en avez entendu parler ?",
        helper: "Réponse honnête. Si vous voulez préciser, le commentaire est là pour ça.",
        type: "radio",
        required: true,
        personas: ["P1b"],
        commentField: true,
        options: [
          { value: "yes_considered", label: "Oui, j'y ai pensé ou un confrère le fait" },
          { value: "yes_heard", label: "Oui, j'en ai entendu parler" },
          { value: "no_never", label: "Non, jamais entendu" },
          { value: "no_bad_idea", label: "Non, et ça me semble problématique" }
        ]
      },
      {
        id: "non_smartphone_patients",
        label:
          "Vous avez des patients qui n'ont pas de smartphone ? Quelle proportion à peu près ? Comment vous feriez avec un système basé sur le téléphone du patient ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P1b"]
      },

      // ─── P1c only: MSP routing, ACI export, decision-making ───
      {
        id: "msp_walkin_org",
        label:
          "Comment s'organise l'accueil des sans rendez-vous dans votre MSP ou votre cabinet de groupe ? Tous les médecins en voient ? Comment les patients sont orientés ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P1c"]
      },
      {
        id: "msp_routing",
        label:
          "Un patient sans rendez-vous peut-il être orienté vers un médecin disponible plutôt que celui qu'il a demandé ? Comment ça se passe en pratique ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P1c"]
      },
      {
        id: "msp_decision_making",
        label:
          "Qui décide des outils logiciels dans votre MSP ? Vous individuellement, le coordinateur, le bureau, un vote collectif ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P1c"]
      },
      {
        id: "msp_ars_reporting",
        label:
          "Vous avez des obligations de reporting vers l'ARS sur les flux de patients ? Un outil qui produirait ces rapports automatiquement, ça aurait de la valeur pour vous ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P1c"]
      },

      // ─── P2 only: audit log perception ───
      {
        id: "audit_log_perception",
        label:
          "Un outil moderne enregistre tout ce qui se passe au cours de la journée — qui ajoute un patient, à quelle heure, qui l'enlève, etc. C'est obligatoire pour la sécurité. Comment vous vous sentez quand votre logiciel garde une trace de tout ce que vous faites ?",
        helper:
          "Pas de jugement, on cherche votre ressenti honnête.",
        type: "textarea",
        required: true,
        personas: ["P2"]
      },
      {
        id: "audit_log_doctor_access",
        label:
          "Et si c'était votre médecin qui pouvait aller voir ces traces, ça change quelque chose pour vous ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P2"]
      },
      {
        id: "secretaire_learning_style",
        label:
          "Quand vous apprenez un nouvel outil, vous préférez qu'on vous le montre, qu'on vous laisse explorer, ou qu'il y ait un manuel ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P2"],
        options: [
          { value: "show_me", label: "Qu'on me le montre" },
          { value: "explore", label: "Qu'on me laisse explorer" },
          { value: "manual", label: "Qu'il y ait un manuel ou un tuto" }
        ]
      },

      // ─── P3a only: motif resentment + app rejection ───
      {
        id: "patient_motif",
        label:
          "Si on vous demandait aussi le motif de votre visite sur un formulaire en ligne, vous le donneriez ou vous trouveriez ça intrusif ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P3a"],
        commentField: true,
        options: [
          { value: "yes_no_problem", label: "Oui, sans problème" },
          { value: "yes_short", label: "Oui, mais juste un mot-clé" },
          { value: "no_intrusive", label: "Non, je trouve ça intrusif" }
        ]
      },
      {
        id: "patient_app_install",
        label:
          "Si pour utiliser ce système il fallait installer une application, vous le feriez ? Ou vous préféreriez que ça marche directement dans le navigateur ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P3a"],
        options: [
          { value: "app_ok", label: "Application OK" },
          { value: "browser_only", label: "Navigateur uniquement, sinon non" },
          { value: "depends", label: "Ça dépend du contexte" }
        ]
      },

      // ─── P3b only: aidant question + display screen ───
      {
        id: "aidant_dynamic",
        label:
          "Quand vous prenez rendez-vous chez le médecin, ou quand vous y allez, est-ce qu'un proche — votre fille, votre fils, un membre de votre famille — vous aide ? Comment ?",
        helper:
          "Et si on lui envoyait un message à elle ou lui pour dire « votre parent attend son tour, encore 20 minutes », vous trouveriez ça utile ou intrusif ?",
        type: "textarea",
        required: true,
        personas: ["P3b"]
      },
      {
        id: "patient_display_screen",
        label:
          "Si dans la salle d'attente il y avait un écran qui affichait « patient suivant : numéro 12, numéro 13… », est-ce que ça vous aiderait, ou ça vous embrouillerait ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P3b"],
        commentField: true,
        options: [
          { value: "helpful", label: "Ça m'aiderait" },
          { value: "neutral", label: "Ni l'un ni l'autre" },
          { value: "confusing", label: "Ça m'embrouillerait" }
        ]
      },
      {
        id: "patient_secretaire_anchor",
        label:
          "Quand vous arrivez chez le médecin, parler à la secrétaire fait partie de l'expérience pour vous, ou c'est juste un passage obligé ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P3b"]
      },

      // ─── P3c only: parent vs child identity, waiting outside ───
      {
        id: "parent_child_identity",
        label:
          "Quand on vous demande « le nom du patient » dans un cabinet, vous donnez le vôtre ou celui de votre enfant ? Vous trouvez ça naturel ou perturbant ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P3c"]
      },
      {
        id: "parent_called_by_name",
        label:
          "Au moment où le médecin vous appelle, il dit le nom de l'enfant ou le vôtre ? Ça vous est déjà arrivé qu'on se trompe ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P3c"]
      },
      {
        id: "parent_wait_outside",
        label:
          "Si la salle d'attente était pleine de gens malades et que vous aviez un bébé fragile, vous attendriez où, idéalement ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P3c"]
      },
      {
        id: "parent_stress_visit",
        label:
          "Quand vous emmenez votre enfant chez le médecin sans rendez-vous, c'est plus stressant ou moins stressant qu'une visite pour vous-même ? Pourquoi ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P3c"]
      }
    ]
  },

  /* ═════════════════════════════════════════════════════════════════════════
     BATCH 5 — Doctolib & complémentarité
     Only doctors and secrétaire — tests positioning vs Doctolib.
     ═════════════════════════════════════════════════════════════════════════ */
  {
    number: 5,
    title: "Doctolib, vos outils, la place du nouveau",
    subtitle:
      "On veut comprendre où ce nouvel outil se placerait dans votre stack actuelle.",
    estimatedMinutes: 5,
    questions: [
      {
        id: "current_software",
        label:
          "Quels logiciels utilisez-vous au cabinet aujourd'hui, et environ combien ça vous coûte par mois en tout ?",
        helper:
          "Les principaux suffisent. Une estimation du coût global, même approximative.",
        type: "textarea",
        required: true,
        personas: ["P1", "P1b", "P1c", "P2"]
      },
      {
        id: "doctolib_walkin",
        label:
          "Si vous utilisez Doctolib, pour quoi exactement ? Et les sans rendez-vous, vous les gérez comment aujourd'hui ?",
        helper:
          "Si vous n'êtes pas sur Doctolib, dites pourquoi et expliquez votre méthode actuelle.",
        type: "textarea",
        required: true,
        personas: ["P1", "P1b", "P1c", "P2"]
      },
      {
        id: "doctolib_complementary",
        label:
          "Imaginez un outil qui ne touche pas à Doctolib, ne remplace rien, et ne s'occupe que de la file des sans rendez-vous. Pour vous, c'est un outil de plus à gérer, ou un complément utile ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P1", "P1b", "P1c", "P2"]
      },
      {
        id: "trial_appetite",
        label:
          "Un confrère vous recommande un nouvel outil gratuit. Combien de temps vous lui donnez avant d'abandonner ? Et qu'est-ce qui vous fait décrocher ?",
        helper: "Un jour, une semaine, un mois ?",
        type: "textarea",
        required: true,
        personas: ["P1", "P1b", "P1c", "P2"]
      },
      {
        id: "last_tool_adopted",
        label:
          "Le dernier outil que vous avez adopté au cabinet : qui l'a proposé, qui a décidé, qui l'a installé ?",
        helper:
          "Pensez à un cas réel et récent, pas à ce qui se passe « en général ».",
        type: "textarea",
        required: true,
        personas: ["P1", "P1b", "P1c", "P2"]
      }
    ]
  },

  /* ═════════════════════════════════════════════════════════════════════════
     BATCH 6 — Closing
     Universal closing questions for all personas.
     ═════════════════════════════════════════════════════════════════════════ */
  {
    number: 6,
    title: "Un dernier mot",
    subtitle:
      "Deux questions pour finir. La première est souvent la plus importante.",
    estimatedMinutes: 3,
    questions: [
      {
        id: "one_thing_to_change",
        label:
          "Si vous pouviez changer UNE SEULE chose dans votre journée — ou dans votre dernière visite chez le médecin, selon votre cas — ce serait quoi ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P1", "P1b", "P1c", "P2", "P3a", "P3b", "P3c"]
      },
      {
        id: "anything_missing",
        label:
          "Quelque chose d'important qu'on ne vous a pas demandé, ou que vous voudriez ajouter ?",
        helper: "Facultatif. Mais souvent la question la plus utile.",
        type: "textarea",
        required: false,
        personas: ["P1", "P1b", "P1c", "P2", "P3a", "P3b", "P3c"]
      }
    ]
  }
];
