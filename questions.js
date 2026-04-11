/* AuSuivant questionnaire — multi-persona question data
 *
 * 2 batches × 5 questions per persona.
 *
 * Persona codes:
 *   P1   Médecin avec secrétaire
 *   P1b  Médecin solo (sans secrétaire)
 *   P1c  Médecin en cabinet de groupe / MSP
 *   P2   Secrétaire médicale
 *   P3a  Patient adulte actif
 *   P3b  Patient senior
 *   P3c  Parent qui consulte pour son enfant
 *
 * Each question has a `personas: [...]` field.
 * getVisibleQuestions() filters to exactly 5 per persona per batch.
 */

window.BATCHES = [

  /* ═══════════════════════════════════════════════════════════════════
     BATCH 1 — Les 5 questions essentielles
     Prioritised: biggest hypotheses first, personalised by variant.
     ═══════════════════════════════════════════════════════════════════ */
  {
    number: 1,
    title: "Pour commencer — 5 questions sur votre quotidien",
    subtitle: "Racontez-nous comment ça se passe vraiment. Aucune mauvaise réponse.",
    estimatedMinutes: 6,
    questions: [

      /* ─── ALL DOCTORS: 3 shared ─── */
      {
        id: "daily_volume",
        label: "Combien de patients voyez-vous une journée typique ?",
        helper: "",
        type: "short",
        inputType: "number",
        required: true,
        personas: ["P1", "P1b", "P1c"]
      },
      {
        id: "queue_visibility",
        label: "Comment savez-vous, à un instant donné, combien de patients sans rendez-vous attendent dans votre salle d'attente ?",
        helper: "Liste papier, secrétaire qui vous prévient, vous regardez par la porte ?",
        type: "textarea",
        required: true,
        personas: ["P1", "P1b", "P1c"]
      },
      {
        id: "pricing",
        label: "Un outil qui ne ferait qu'une chose — gérer la file d'attente des sans rendez-vous. À quel prix mensuel ça vous semble correct, et à quel prix vous décrochez ?",
        helper: "Deux chiffres approximatifs suffisent : un prix juste, un prix de trop.",
        type: "pricing-pair",
        required: true,
        personas: ["P1", "P1b", "P1c"]
      },

      /* ─── P1 only: 2 specific ─── */
      {
        id: "day_end_predictability",
        label: "Le matin en arrivant au cabinet, vous savez à quelle heure vous allez finir ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P1"],
        commentField: true,
        options: [
          { value: "30min",    label: "Oui, à 30 minutes près" },
          { value: "1hour",    label: "À une heure près, environ" },
          { value: "2hour",    label: "Vaguement, à deux heures près" },
          { value: "no_idea",  label: "Aucune idée, c'est toujours une surprise" }
        ]
      },
      {
        id: "secretary_gatekeeper",
        label: "Vous installez un nouvel outil dans votre cabinet. Au bout d'une semaine, votre secrétaire le déteste. Concrètement, qu'est-ce qui se passe ?",
        helper: "Ce qui se passerait vraiment, pas ce qui « devrait » se passer.",
        type: "textarea",
        required: true,
        personas: ["P1"]
      },

      /* ─── P1b only: 2 specific ─── */
      {
        id: "carillon",
        label: "Quand vous êtes en consultation et qu'un patient sans rendez-vous vient d'arriver, comment le savez-vous ? Carillon, sonnette, bruit de porte, vous écoutez ?",
        helper: "Et si demain un outil ajoutait silencieusement les patients à votre écran sans faire aucun son, vous le sauriez ?",
        type: "textarea",
        required: true,
        personas: ["P1b"]
      },
      {
        id: "non_smartphone_patients",
        label: "Vous avez des patients qui n'ont pas de smartphone ? Quelle proportion à peu près ? Comment vous feriez avec un système basé sur le téléphone du patient ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P1b"]
      },

      /* ─── P1c only: 2 specific ─── */
      {
        id: "msp_walkin_org",
        label: "Comment s'organise l'accueil des sans rendez-vous dans votre MSP ou cabinet de groupe ? Tous les médecins en voient ? Comment les patients sont orientés ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P1c"]
      },
      {
        id: "msp_routing",
        label: "Un patient sans rendez-vous peut-il être orienté vers un médecin disponible plutôt que celui qu'il a demandé ? Comment ça se passe en pratique ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P1c"]
      },

      /* ─── P2: 5 specific ─── */
      {
        id: "secretaire_busy_morning",
        label: "Racontez-nous une matinée vraiment chargée. Du moment où vous arrivez jusqu'à midi.",
        helper: "Plus c'est concret, mieux c'est. Aucun détail n'est trop petit.",
        type: "textarea",
        required: true,
        personas: ["P2"]
      },
      {
        id: "secretaire_paper_or_software",
        label: "Comment notez-vous les patients qui arrivent sans rendez-vous ? Papier, logiciel, dans votre tête ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P2"]
      },
      {
        id: "secretaire_qr_relief_or_threat",
        label: "Imaginez que vos patients puissent scanner un QR code en arrivant et s'inscrire eux-mêmes dans la file, sans vous solliciter. Pour vous, c'est plutôt un soulagement ou une perte de contrôle ?",
        helper: "Réponse honnête, c'est exactement ce qu'on cherche.",
        type: "textarea",
        required: true,
        personas: ["P2"]
      },
      {
        id: "secretaire_5_second_add",
        label: "Si on vous disait qu'ajouter un patient à la file dans un nouvel outil prend 5 secondes, vous y croyez ou vous êtes sceptique ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P2"],
        commentField: true,
        options: [
          { value: "believe",   label: "J'y crois si c'est bien fait" },
          { value: "skeptical", label: "Je suis sceptique, j'ai déjà vu ça promis et pas tenu" },
          { value: "depends",   label: "Ça dépend du logiciel, je précise" }
        ]
      },
      {
        id: "secretaire_phone_how_long_share",
        label: "Sur une journée, à peu près combien d'appels téléphoniques sont juste pour demander combien de temps il faut attendre ?",
        helper: "Une estimation suffit.",
        type: "short",
        inputType: "text",
        required: true,
        personas: ["P2"]
      },

      /* ─── ALL PATIENTS: 4 shared ─── */
      {
        id: "last_visit_story",
        label: "Racontez-nous votre dernière visite chez un médecin sans rendez-vous, du début à la fin. Pas la consultation elle-même — juste ce qui s'est passé entre votre arrivée et le moment où vous avez vu le médecin.",
        helper: "Le plus naturel possible. C'est votre récit qui nous intéresse.",
        type: "textarea",
        required: true,
        personas: ["P3a", "P3b", "P3c"]
      },
      {
        id: "wait_known_in_advance",
        label: "Quand vous êtes arrivé, est-ce que quelqu'un vous a dit combien de temps vous alliez attendre ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P3a", "P3b", "P3c"],
        commentField: true,
        options: [
          { value: "precise",  label: "Oui, on m'a donné une estimation précise" },
          { value: "vague",    label: "Oui, mais c'était vague" },
          { value: "nothing",  label: "Non, rien du tout" }
        ]
      },
      {
        id: "patient_would_leave",
        label: "Si en arrivant on vous disait « vous êtes en position 4, environ 35 minutes d'attente, vous pouvez sortir, on vous prévient par SMS quand c'est presque votre tour », est-ce que vous quitteriez la salle d'attente ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P3a", "P3b", "P3c"],
        commentField: true,
        options: [
          { value: "yes_definitely",    label: "Oui, sans hésiter" },
          { value: "yes_first_visit_no", label: "Pas la première fois, mais après oui" },
          { value: "stay_anyway",       label: "Non, je resterais quand même au cas où" }
        ]
      },
      {
        id: "patient_trust_threshold",
        label: "Qu'est-ce qui vous ferait NE PAS faire confiance à ce système ?",
        helper: "Pannes, retards, mauvaises expériences passées… ce qui vous vient en tête.",
        type: "textarea",
        required: true,
        personas: ["P3a", "P3b", "P3c"]
      },

      /* ─── P3a only: 1 specific ─── */
      {
        id: "patient_motif",
        label: "Si on vous demandait aussi le motif de votre visite sur un formulaire en ligne, vous le donneriez ou vous trouveriez ça intrusif ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P3a"],
        commentField: true,
        options: [
          { value: "yes_no_problem", label: "Oui, sans problème" },
          { value: "yes_short",      label: "Oui, mais juste un mot-clé" },
          { value: "no_intrusive",   label: "Non, je trouve ça intrusif" }
        ]
      },

      /* ─── P3b only: 1 specific ─── */
      {
        id: "aidant_dynamic",
        label: "Quand vous allez chez le médecin, est-ce qu'un proche — votre fille, votre fils, un membre de votre famille — vous aide ? Comment ?",
        helper: "Et si on lui envoyait un message pour dire « votre parent attend son tour, encore 20 minutes », vous trouveriez ça utile ou intrusif ?",
        type: "textarea",
        required: true,
        personas: ["P3b"]
      },

      /* ─── P3c only: 1 specific ─── */
      {
        id: "parent_stress_visit",
        label: "Quand vous emmenez votre enfant chez le médecin sans rendez-vous, c'est plus stressant ou moins stressant qu'une visite pour vous-même ? Pourquoi ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P3c"]
      }
    ]
  },

  /* ═══════════════════════════════════════════════════════════════════
     BATCH 2 — 5 questions de plus
     Deeper dives: product reactions, decision dynamics, closing.
     ═══════════════════════════════════════════════════════════════════ */
  {
    number: 2,
    title: "5 questions de plus — pour aller un peu plus loin",
    subtitle: "Quelques questions supplémentaires pour compléter le tableau.",
    estimatedMinutes: 5,
    questions: [

      /* ─── ALL DOCTORS: 3 shared ─── */
      {
        id: "fin_estimee_value",
        label: "À 10h, un outil vous dit : « vous sortirez à 19h12 ce soir, à 15 minutes près ». Concrètement, ça change quoi pour vous ?",
        helper: "Une phrase suffit. Et si ça ne change rien, dites-le — c'est aussi une réponse utile.",
        type: "textarea",
        required: true,
        personas: ["P1", "P1b", "P1c"]
      },
      {
        id: "doctolib_complementary",
        label: "Imaginez un outil qui ne touche pas à Doctolib, ne remplace rien, et ne s'occupe que de la file des sans rendez-vous. Pour vous, c'est un outil de plus à gérer, ou un complément utile ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P1", "P1b", "P1c"]
      },
      {
        id: "one_thing_to_change",
        label: "Si vous pouviez changer UNE SEULE chose dans votre journée, ce serait quoi ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P1", "P1b", "P1c"]
      },

      /* ─── P1 only: 2 specific ─── */
      {
        id: "interruptions_count",
        label: "Sur une journée typique, à peu près combien de fois on vous interrompt en consultation à propos de la file d'attente ?",
        helper: "Une estimation suffit. Une, cinq, vingt fois ?",
        type: "short",
        inputType: "text",
        required: true,
        personas: ["P1"]
      },
      {
        id: "leave_and_return_doctor",
        label: "Un patient vous demande s'il peut aller chercher son pain et revenir dans 20 minutes, alors qu'il y a 4 personnes devant lui. Si un outil garantissait qu'il reçoit un SMS 10 minutes avant son tour, ce serait pratique ou problématique pour vous ?",
        helper: "Pensez à votre gestion réelle, pas à ce qui « devrait » fonctionner.",
        type: "radio",
        required: true,
        personas: ["P1"],
        commentField: true,
        options: [
          { value: "practical",    label: "Pratique, ça réglerait un vrai problème" },
          { value: "depends",      label: "Ça dépend, je précise en commentaire" },
          { value: "problematic",  label: "Problématique, je préfère qu'ils restent sur place" }
        ]
      },

      /* ─── P1b only: 2 specific ─── */
      {
        id: "interruptions_count_solo",
        label: "Sur une journée typique, à peu près combien de fois vous devez interrompre une consultation pour gérer la salle d'attente ?",
        helper: "Une estimation suffit.",
        type: "short",
        inputType: "text",
        required: true,
        personas: ["P1b"]
      },
      {
        id: "camera_workaround",
        label: "Le Quotidien du Médecin a écrit que certains confrères installent une caméra de surveillance dans leur salle d'attente pour voir qui vient d'arriver pendant qu'ils sont en consultation. Vous en avez entendu parler ?",
        helper: "Réponse honnête. Si vous voulez préciser, le commentaire est là pour ça.",
        type: "radio",
        required: true,
        personas: ["P1b"],
        commentField: true,
        options: [
          { value: "yes_considered", label: "Oui, j'y ai pensé ou un confrère le fait" },
          { value: "yes_heard",      label: "Oui, j'en ai entendu parler" },
          { value: "no_never",       label: "Non, jamais entendu" },
          { value: "no_bad_idea",    label: "Non, et ça me semble problématique" }
        ]
      },

      /* ─── P1c only: 2 specific ─── */
      {
        id: "msp_decision_making",
        label: "Qui décide des outils logiciels dans votre MSP ? Vous individuellement, le coordinateur, le bureau, un vote collectif ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P1c"]
      },
      {
        id: "msp_ars_reporting",
        label: "Vous avez des obligations de reporting vers l'ARS sur les flux de patients ? Un outil qui produirait ces rapports automatiquement, ça aurait de la valeur pour vous ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P1c"]
      },

      /* ─── P2: 5 specific ─── */
      {
        id: "audit_log_perception",
        label: "Un outil moderne enregistre tout ce qui se passe — qui ajoute un patient, à quelle heure, qui l'enlève, etc. Comment vous vous sentez quand votre logiciel garde une trace de tout ce que vous faites ?",
        helper: "Pas de jugement, on cherche votre ressenti honnête.",
        type: "textarea",
        required: true,
        personas: ["P2"]
      },
      {
        id: "audit_log_doctor_access",
        label: "Et si c'était votre médecin qui pouvait aller voir ces traces, ça change quelque chose pour vous ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P2"]
      },
      {
        id: "doctolib_complementary_sec",
        label: "Imaginez un outil qui ne touche pas à Doctolib et ne s'occupe que de la file des sans rendez-vous. Pour vous, c'est un outil de plus à gérer, ou un complément utile ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P2"]
      },
      {
        id: "trial_appetite",
        label: "Un médecin vous recommande un nouvel outil gratuit. Combien de temps vous lui donnez avant d'abandonner ? Et qu'est-ce qui vous fait décrocher ?",
        helper: "Un jour, une semaine, un mois ?",
        type: "textarea",
        required: true,
        personas: ["P2"]
      },
      {
        id: "one_thing_to_change_sec",
        label: "Si vous pouviez changer UNE SEULE chose dans votre journée, ce serait quoi ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P2"]
      },

      /* ─── ALL PATIENTS: 3 shared ─── */
      {
        id: "wait_duration",
        label: "Combien de temps avez-vous attendu lors de cette dernière visite, à peu près ?",
        helper: "",
        type: "short",
        inputType: "text",
        required: true,
        personas: ["P3a", "P3b", "P3c"]
      },
      {
        id: "visit_frequency",
        label: "Vous allez chez le médecin sans rendez-vous souvent, ou rarement ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P3a", "P3b", "P3c"],
        options: [
          { value: "weekly",       label: "Plusieurs fois par mois" },
          { value: "monthly",      label: "Une fois par mois environ" },
          { value: "rarely",       label: "Quelques fois par an" },
          { value: "never_almost", label: "Très rarement, presque jamais" }
        ]
      },
      {
        id: "one_thing_to_change_patient",
        label: "Si vous pouviez changer UNE SEULE chose dans votre expérience en salle d'attente, ce serait quoi ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P3a", "P3b", "P3c"]
      },

      /* ─── P3a only: 2 specific ─── */
      {
        id: "patient_app_install",
        label: "Si pour utiliser ce système il fallait installer une application, vous le feriez ? Ou vous préféreriez que ça marche directement dans le navigateur ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P3a"],
        options: [
          { value: "app_ok",      label: "Application OK" },
          { value: "browser_only", label: "Navigateur uniquement, sinon non" },
          { value: "depends",     label: "Ça dépend du contexte" }
        ]
      },
      {
        id: "smartphone_use",
        label: "Vous utilisez un smartphone ? Pour quoi en général ?",
        helper: "Téléphone, WhatsApp, Doctolib, recherches sur Internet — qu'est-ce qui revient le plus souvent ?",
        type: "textarea",
        required: true,
        personas: ["P3a"]
      },

      /* ─── P3b only: 2 specific ─── */
      {
        id: "patient_display_screen",
        label: "Si dans la salle d'attente il y avait un écran qui affichait « patient suivant : numéro 12, numéro 13… », est-ce que ça vous aiderait, ou ça vous embrouillerait ?",
        helper: "",
        type: "radio",
        required: true,
        personas: ["P3b"],
        commentField: true,
        options: [
          { value: "helpful",   label: "Ça m'aiderait" },
          { value: "neutral",   label: "Ni l'un ni l'autre" },
          { value: "confusing", label: "Ça m'embrouillerait" }
        ]
      },
      {
        id: "patient_secretaire_anchor",
        label: "Quand vous arrivez chez le médecin, parler à la secrétaire fait partie de l'expérience pour vous, ou c'est juste un passage obligé ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P3b"]
      },

      /* ─── P3c only: 2 specific ─── */
      {
        id: "parent_child_identity",
        label: "Quand on vous demande « le nom du patient » dans un cabinet, vous donnez le vôtre ou celui de votre enfant ? Vous trouvez ça naturel ou perturbant ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P3c"]
      },
      {
        id: "parent_called_by_name",
        label: "Au moment où le médecin vous appelle, il dit le nom de l'enfant ou le vôtre ? Ça vous est déjà arrivé qu'on se trompe ?",
        helper: "",
        type: "textarea",
        required: true,
        personas: ["P3c"]
      }
    ]
  }

];
