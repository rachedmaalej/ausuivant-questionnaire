/* AuSuivant questionnaire — question data
 *
 * Each batch contains 5 questions, ordered by research priority.
 * Question types:
 *   - "textarea"     long-form free text
 *   - "short"        single-line text or number
 *   - "radio"        single choice from `options` (optional `commentField`)
 *   - "pricing-pair" two number fields (floor + ceiling) plus optional reasoning
 *
 * To edit, add, or remove questions, edit this file only.
 * To reorder batches, change the order of array entries.
 * Every question must have a unique `id` — that becomes the column name in the backend.
 */

window.BATCHES = [
  /* ───────────────────────── BATCH 1 ───────────────────────── */
  {
    number: 1,
    title: "Les 5 questions essentielles",
    subtitle:
      "Si vous ne répondez qu'à une seule série, c'est celle-ci. Vos réponses ici, à elles seules, valent déjà un entretien.",
    estimatedMinutes: 8,
    questions: [
      {
        id: "pricing",
        label:
          "Un outil qui ne ferait qu'une chose — gérer la file d'attente des sans rendez-vous. À quel prix mensuel ça vous semble correct, et à quel prix vous décrochez ?",
        helper:
          "Deux chiffres approximatifs suffisent : un prix juste, un prix de trop. Pas besoin d'être au centime près.",
        type: "pricing-pair",
        required: true
      },
      {
        id: "free_tier_cap",
        label:
          "Et si c'était gratuit jusqu'à 20 patients par jour, payant au-delà ? Vous diriez quoi de ce seuil ?",
        helper:
          "20 patients/jour, c'est l'ordre de grandeur d'un cabinet mixte rendez-vous + sans rendez-vous.",
        type: "radio",
        required: true,
        commentField: true,
        options: [
          { value: "too_tight", label: "Trop serré, je le dépasserais souvent" },
          { value: "fair", label: "Plutôt juste" },
          { value: "too_generous", label: "Trop généreux, je ne paierais jamais" },
          { value: "depends", label: "Ça dépend, je précise en commentaire" }
        ]
      },
      {
        id: "secretary_gatekeeper",
        label:
          "Vous installez un nouvel outil dans votre cabinet. Au bout d'une semaine, votre secrétaire le déteste. Concrètement, qu'est-ce qui se passe ?",
        helper:
          "Ce qui se passerait vraiment, pas ce qui « devrait » se passer. Si vous exercez seul, dites simplement comment vous réagissez quand un outil vous ralentit.",
        type: "textarea",
        required: true
      },
      {
        id: "fin_estimee_value",
        label:
          "À 10h, un outil vous dit : « vous sortirez à 19h12 ce soir, à 15 minutes près ». Concrètement, ça change quoi pour vous ?",
        helper:
          "Une phrase suffit. Et si ça ne change rien, dites-le — c'est aussi une réponse utile.",
        type: "textarea",
        required: true
      },
      {
        id: "camera_workaround",
        label:
          "Le Quotidien du Médecin a écrit que certains confrères installent une caméra dans leur salle d'attente pour voir qui vient d'arriver. Vous en avez entendu parler ?",
        helper: "Réponse honnête. Si vous voulez préciser, le commentaire est là pour ça.",
        type: "radio",
        required: true,
        commentField: true,
        options: [
          { value: "yes_considered", label: "Oui, j'y ai pensé ou un confrère le fait" },
          { value: "yes_heard", label: "Oui, j'en ai entendu parler" },
          { value: "no_never", label: "Non, jamais entendu" },
          { value: "no_bad_idea", label: "Non, et ça me semble problématique" }
        ]
      }
    ]
  },

  /* ───────────────────────── BATCH 2 ───────────────────────── */
  {
    number: 2,
    title: "Vos outils, vos interruptions",
    subtitle:
      "Comment vous travaillez aujourd'hui — ce qui marche, et ce qui vous fait perdre du temps.",
    estimatedMinutes: 7,
    questions: [
      {
        id: "current_software",
        label:
          "Quels logiciels utilisez-vous au cabinet, et environ combien ça vous coûte par mois en tout ?",
        helper:
          "Les principaux suffisent. Une estimation du coût global, même approximative.",
        type: "textarea",
        required: true
      },
      {
        id: "last_tool_adopted",
        label:
          "Le dernier outil que vous avez adopté au cabinet : qui l'a proposé, qui a décidé, qui l'a installé ?",
        helper:
          "Pensez à un cas réel et récent, pas à ce qui se passe « en général ».",
        type: "textarea",
        required: true
      },
      {
        id: "patient_arrival_awareness",
        label:
          "Vous êtes en consultation. Un patient sans rendez-vous arrive dans la salle d'attente. Comment vous le savez ?",
        helper:
          "Bruit de porte, carillon, secrétaire qui vous prévient, vous jetez un œil entre deux patients ?",
        type: "textarea",
        required: true
      },
      {
        id: "doctolib_walkin",
        label:
          "Si vous utilisez Doctolib, pour quoi exactement ? Et les sans rendez-vous, vous les gérez comment aujourd'hui ?",
        helper:
          "Si vous n'êtes pas sur Doctolib, dites pourquoi et expliquez votre méthode actuelle.",
        type: "textarea",
        required: true
      },
      {
        id: "trial_appetite",
        label:
          "Un confrère vous recommande un nouvel outil gratuit. Combien de temps vous lui donnez avant d'abandonner ?",
        helper: "Un jour, une semaine, un mois ? Et qu'est-ce qui vous fait décrocher ?",
        type: "textarea",
        required: true
      }
    ]
  },

  /* ───────────────────────── BATCH 3 ───────────────────────── */
  {
    number: 3,
    title: "Votre journée, vos patients",
    subtitle:
      "Quelques détails plus précis sur votre organisation et l'expérience que vivent vos patients.",
    estimatedMinutes: 7,
    questions: [
      {
        id: "day_end_predictability",
        label:
          "Le matin en arrivant au cabinet, vous savez à quelle heure vous allez finir ?",
        helper: "",
        type: "radio",
        required: true,
        commentField: true,
        options: [
          { value: "30min", label: "Oui, à 30 minutes près" },
          { value: "1hour", label: "À une heure près, environ" },
          { value: "2hour", label: "Vaguement, à deux heures près" },
          { value: "no_idea", label: "Aucune idée, c'est toujours une surprise" }
        ]
      },
      {
        id: "projection_shift",
        label:
          "À 14h, un outil affiche : « vous sortirez vers 20h30 » alors qu'à 10h il disait « 19h ». Vous en faites quoi ?",
        helper:
          "Vous changez quelque chose ? Vous prévenez quelqu'un ? Ou rien ?",
        type: "textarea",
        required: true
      },
      {
        id: "leave_and_return",
        label:
          "Un patient vous demande s'il peut aller chercher son pain et revenir dans 20 minutes, alors qu'il y a 4 personnes devant lui. Si un outil garantissait qu'il reçoit un SMS 10 minutes avant son tour, ce serait pratique ou problématique pour vous ?",
        helper:
          "Pensez à votre gestion réelle, pas à ce qui « devrait » fonctionner.",
        type: "radio",
        required: true,
        commentField: true,
        options: [
          { value: "practical", label: "Pratique, ça réglerait un vrai problème" },
          { value: "depends", label: "Ça dépend, je précise en commentaire" },
          { value: "problematic", label: "Problématique, je préfère qu'ils restent sur place" }
        ]
      },
      {
        id: "aidant_dynamic",
        label:
          "À quelle fréquence un patient âgé est pris en charge via un proche (un enfant qui appelle, qui prend rendez-vous, qui suit le passage à distance) ?",
        helper: "Si ça arrive, dites en commentaire comment ça se passe.",
        type: "radio",
        required: true,
        commentField: true,
        options: [
          { value: "often", label: "Souvent, plusieurs fois par semaine" },
          { value: "sometimes", label: "Parfois, quelques fois par mois" },
          { value: "rarely", label: "Rarement" },
          { value: "never", label: "Jamais ou presque" }
        ]
      },
      {
        id: "doctolib_complementary",
        label:
          "Imaginez un outil qui ne touche pas à Doctolib, ne remplace rien, et ne s'occupe que de la file des sans rendez-vous. Pour vous, c'est un outil de plus à gérer, ou un complément utile ?",
        helper: "",
        type: "textarea",
        required: true
      }
    ]
  },

  /* ───────────────────────── BATCH 4 ───────────────────────── */
  {
    number: 4,
    title: "Votre cabinet, et un dernier mot",
    subtitle:
      "Quelques questions de contexte, plus un espace ouvert pour ce qu'on aurait oublié de vous demander.",
    estimatedMinutes: 5,
    questions: [
      {
        id: "practice_structure",
        label: "Comment exercez-vous ?",
        helper: "",
        type: "radio",
        required: true,
        options: [
          {
            value: "solo_with_secretary",
            label: "Seul, avec une secrétaire (sur place ou à distance)"
          },
          {
            value: "solo_without_secretary",
            label: "Seul, sans secrétaire"
          },
          {
            value: "group_practice",
            label: "En cabinet de groupe (2 médecins ou plus)"
          },
          {
            value: "msp",
            label: "En maison de santé pluriprofessionnelle (MSP)"
          },
          { value: "other", label: "Autre" }
        ]
      },
      {
        id: "walkin_ratio",
        label: "Quelle part de votre activité est en sans rendez-vous ?",
        helper: "Un pourcentage approximatif, par exemple : 30 % sans rendez-vous, 70 % rendez-vous.",
        type: "short",
        inputType: "text",
        required: true
      },
      {
        id: "daily_volume",
        label: "Combien de patients voyez-vous une journée typique ?",
        helper: "",
        type: "short",
        inputType: "number",
        required: true
      },
      {
        id: "one_thing_to_change",
        label:
          "Si vous pouviez changer UNE SEULE chose dans votre journée de demain, ce serait quoi ?",
        helper: "",
        type: "textarea",
        required: true
      },
      {
        id: "anything_missing",
        label:
          "Quelque chose d'important qu'on ne vous a pas demandé, ou que vous voudriez ajouter ?",
        helper: "Facultatif. Mais souvent la question la plus utile.",
        type: "textarea",
        required: false
      }
    ]
  },

  /* ───────────────────────── BATCH 5 (MSP only) ───────────────────────── */
  {
    number: 5,
    title: "Bonus pour les MSP",
    subtitle:
      "Ces questions ne valent que si vous exercez en maison de santé pluriprofessionnelle. Sinon, vous pouvez vous arrêter ici — vous avez déjà beaucoup donné.",
    estimatedMinutes: 7,
    mspOnly: true,
    questions: [
      {
        id: "msp_walkin_org",
        label:
          "Comment s'organise l'accueil des sans rendez-vous dans votre MSP ? Tous les médecins en voient ? Comment les patients sont orientés ?",
        helper: "",
        type: "textarea",
        required: true
      },
      {
        id: "msp_prior_tools",
        label:
          "Votre MSP a-t-elle déjà utilisé un outil pour la file d'attente — borne, écran, logiciel ? Lequel, et pourquoi vous l'avez gardé ou abandonné ?",
        helper: "",
        type: "textarea",
        required: true
      },
      {
        id: "msp_decision_making",
        label:
          "Qui décide des outils logiciels dans la MSP ? Vous, le coordinateur, le bureau, un vote collectif ?",
        helper: "",
        type: "textarea",
        required: true
      },
      {
        id: "msp_budget",
        label:
          "Le budget pour ces outils, c'est par médecin, mutualisé, ou pris sur la dotation ACI ?",
        helper: "",
        type: "textarea",
        required: true
      },
      {
        id: "msp_ars_reporting",
        label:
          "Vous avez des obligations de reporting ARS sur les flux de patients ? Un outil qui produirait ces rapports automatiquement, ça aurait de la valeur ?",
        helper: "",
        type: "textarea",
        required: true
      }
    ]
  }
];
