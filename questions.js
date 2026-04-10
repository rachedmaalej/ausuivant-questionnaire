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
    title: "Les 5 questions les plus importantes",
    subtitle:
      "Ces 5 questions sont celles qui nous aideront le plus à prendre les bonnes décisions pour AuSuivant. Vous pouvez vous arrêter après cette série si vous le souhaitez — ces réponses-là, à elles seules, ont déjà beaucoup de valeur.",
    estimatedMinutes: 8,
    questions: [
      {
        id: "pricing",
        label:
          "Imaginez un outil qui ne fait qu'une chose : gérer la file d'attente des patients sans rendez-vous. À quel prix mensuel cela commencerait à vous sembler raisonnable, et à quel prix diriez-vous « non, c'est trop » ?",
        helper:
          "Donnez deux nombres : un prix qui vous semble juste, et un prix où vous décrochez. Pas besoin d'être précis au centime près.",
        type: "pricing-pair",
        required: true
      },
      {
        id: "free_tier_cap",
        label:
          "Si cet outil était gratuit jusqu'à 20 patients par jour et payant au-delà, que penseriez-vous de ce seuil ?",
        helper:
          "Pensez à votre journée typique. 20 patients correspond à une journée moyenne pour un cabinet mixte rendez-vous + sans rendez-vous.",
        type: "radio",
        required: true,
        commentField: true,
        options: [
          { value: "too_tight", label: "Trop serré — je le dépasserais trop souvent" },
          { value: "fair", label: "Plutôt juste — ça semble équilibré" },
          { value: "too_generous", label: "Trop généreux — je ne paierais jamais" },
          { value: "depends", label: "Ça dépend — je précise en commentaire" }
        ]
      },
      {
        id: "secretary_gatekeeper",
        label:
          "Imaginez que vous installez un nouvel outil dans votre cabinet demain. Au bout d'une semaine, votre secrétaire le déteste. Qu'est-ce qui se passe concrètement ?",
        helper:
          "Décrivez ce qui se passerait, pas ce qui « devrait » se passer. Si vous exercez seul, dites simplement ce qui arriverait si l'outil vous semblait lent ou pénible.",
        type: "textarea",
        required: true
      },
      {
        id: "fin_estimee_value",
        label:
          "Si à 10h du matin un outil pouvait vous dire « vous allez sortir à 19h12 ce soir, à 15 minutes près », qu'est-ce que cela changerait pour vous, concrètement ?",
        helper:
          "Une phrase suffit. Si ça ne changerait rien du tout, dites-le simplement — c'est aussi une réponse utile.",
        type: "textarea",
        required: true
      },
      {
        id: "camera_workaround",
        label:
          "Le Quotidien du Médecin a publié un article où certains médecins libéraux expliquent installer une caméra de surveillance dans leur salle d'attente pour voir qui vient d'arriver pendant qu'ils sont en consultation. Vous en avez entendu parler ?",
        helper: "Réponse honnête : oui, non, ou jamais entendu. Si oui, racontez en commentaire.",
        type: "radio",
        required: true,
        commentField: true,
        options: [
          { value: "yes_considered", label: "Oui, j'y ai pensé moi-même ou un confrère le fait" },
          { value: "yes_heard", label: "Oui, j'en ai entendu parler" },
          { value: "no_never", label: "Non, jamais entendu" },
          { value: "no_bad_idea", label: "Non, et je trouverais ça problématique" }
        ]
      }
    ]
  },

  /* ───────────────────────── BATCH 2 ───────────────────────── */
  {
    number: 2,
    title: "5 questions sur vos outils et vos interruptions",
    subtitle:
      "Ces questions nous aident à comprendre comment vous interagissez aujourd'hui avec les outils numériques de votre cabinet — ce qui marche, ce qui vous fait perdre du temps.",
    estimatedMinutes: 7,
    questions: [
      {
        id: "current_software",
        label:
          "Quels logiciels utilisez-vous aujourd'hui dans votre cabinet, et environ combien payez-vous au total chaque mois ?",
        helper:
          "Pas besoin de liste exhaustive. Les principaux suffisent — et une estimation du coût mensuel global, même approximative.",
        type: "textarea",
        required: true
      },
      {
        id: "last_tool_adopted",
        label:
          "Le dernier nouvel outil que vous avez adopté dans votre cabinet — un logiciel, un service, une application : comment la décision s'est-elle prise ? Qui l'a proposé, qui a décidé, qui l'a installé ?",
        helper:
          "Pensez à un événement réel et récent, pas à ce qui se passerait « en général ».",
        type: "textarea",
        required: true
      },
      {
        id: "patient_arrival_awareness",
        label:
          "Quand vous êtes en consultation et qu'un patient sans rendez-vous vient d'arriver dans la salle d'attente, comment le savez-vous ?",
        helper:
          "Bruit de porte, carillon, sonnette, votre secrétaire qui vous prévient, vous jetez un œil entre deux patients ?",
        type: "textarea",
        required: true
      },
      {
        id: "doctolib_walkin",
        label:
          "Si vous utilisez Doctolib, pour quelle partie de votre activité ? Et pour les patients sans rendez-vous qui arrivent au cabinet, comment gérez-vous leur passage aujourd'hui ?",
        helper:
          "Si vous n'utilisez pas Doctolib, expliquez pourquoi et décrivez votre gestion actuelle des sans rendez-vous.",
        type: "textarea",
        required: true
      },
      {
        id: "trial_appetite",
        label:
          "Si un confrère vous recommandait un nouvel outil gratuit à essayer, combien de temps lui donneriez-vous pour vous convaincre avant d'abandonner ?",
        helper: "Un jour ? Une semaine ? Un mois ? Et qu'est-ce qui vous ferait abandonner ?",
        type: "textarea",
        required: true
      }
    ]
  },

  /* ───────────────────────── BATCH 3 ───────────────────────── */
  {
    number: 3,
    title: "5 questions sur l'organisation et le ressenti patient",
    subtitle:
      "Ces questions explorent quelques détails plus précis de votre façon de gérer votre journée et l'expérience de vos patients.",
    estimatedMinutes: 7,
    questions: [
      {
        id: "day_end_predictability",
        label:
          "Quand vous démarrez votre journée le matin, est-ce que vous savez à quelle heure vous allez la finir ?",
        helper: "",
        type: "radio",
        required: true,
        commentField: true,
        options: [
          { value: "30min", label: "Oui, à 30 minutes près" },
          { value: "1hour", label: "Environ, à une heure près" },
          { value: "2hour", label: "Vaguement, à deux heures près" },
          { value: "no_idea", label: "Aucune idée — c'est toujours une surprise" }
        ]
      },
      {
        id: "projection_shift",
        label:
          "Imaginez qu'à 14h un outil affiche « vous sortirez vers 20h30 ce soir » alors qu'à 10h il avait dit « 19h ». Qu'est-ce que vous feriez avec cette information ?",
        helper:
          "Vous changeriez quelque chose ? Vous préviendriez quelqu'un ? Ou rien ?",
        type: "textarea",
        required: true
      },
      {
        id: "leave_and_return",
        label:
          "Un patient sans rendez-vous vous demande « est-ce que je peux aller chercher mon pain, je reviens dans 20 minutes ? » alors qu'il y a 4 personnes devant lui. Si un outil garantissait qu'il recevrait un SMS 10 minutes avant son tour, ce serait pratique pour vous ou problématique ?",
        helper:
          "Pensez à votre gestion réelle, pas à ce qui « devrait » fonctionner.",
        type: "radio",
        required: true,
        commentField: true,
        options: [
          { value: "practical", label: "Pratique — ça réglerait un vrai problème" },
          { value: "depends", label: "Ça dépend — je précise en commentaire" },
          { value: "problematic", label: "Problématique — je préfère qu'ils restent sur place" }
        ]
      },
      {
        id: "aidant_dynamic",
        label:
          "À quelle fréquence la prise en charge d'un patient âgé passe-t-elle par un proche (un enfant qui appelle, qui prend le rendez-vous, qui suit le passage à distance) ?",
        helper: "Si cela arrive, dites en commentaire comment cela se passe en pratique.",
        type: "radio",
        required: true,
        commentField: true,
        options: [
          { value: "often", label: "Souvent — plusieurs fois par semaine" },
          { value: "sometimes", label: "Parfois — quelques fois par mois" },
          { value: "rarely", label: "Rarement" },
          { value: "never", label: "Jamais ou presque jamais" }
        ]
      },
      {
        id: "doctolib_complementary",
        label:
          "Si un outil ne touchait pas du tout à Doctolib, ne remplaçait rien dans votre stack, et ne s'occupait que de la file des sans rendez-vous, vous le verriez comme un outil de plus à gérer, ou comme un complément utile ?",
        helper: "",
        type: "textarea",
        required: true
      }
    ]
  },

  /* ───────────────────────── BATCH 4 ───────────────────────── */
  {
    number: 4,
    title: "5 questions sur votre pratique et un mot de la fin",
    subtitle:
      "Quelques questions de contexte sur votre cabinet, et un espace ouvert pour ce que nous aurions oublié de vous demander.",
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
            label: "Seul dans mon cabinet, avec une secrétaire (sur place ou télésecrétariat)"
          },
          {
            value: "solo_without_secretary",
            label: "Seul dans mon cabinet, sans secrétaire"
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
        label: "Quelle proportion de votre activité est en sans rendez-vous ?",
        helper: "Un pourcentage approximatif (par exemple : 30 % sans rendez-vous, 70 % rendez-vous).",
        type: "short",
        inputType: "text",
        required: true
      },
      {
        id: "daily_volume",
        label: "Combien de patients voyez-vous sur une journée typique ?",
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
          "Y a-t-il quelque chose d'important que je ne vous ai pas demandé, ou que vous voudriez ajouter ?",
        helper: "Facultatif — mais souvent la question la plus utile.",
        type: "textarea",
        required: false
      }
    ]
  },

  /* ───────────────────────── BATCH 5 (MSP only) ───────────────────────── */
  {
    number: 5,
    title: "5 questions optionnelles — spécifiques aux MSP",
    subtitle:
      "Ces questions ne sont pertinentes que si vous pratiquez dans une maison de santé pluriprofessionnelle. Si ce n'est pas votre cas, vous pouvez vous arrêter ici — vous avez déjà énormément contribué.",
    estimatedMinutes: 7,
    mspOnly: true,
    questions: [
      {
        id: "msp_walkin_org",
        label:
          "Dans votre MSP, comment s'organise l'accueil des sans rendez-vous ? Tous les médecins en voient-ils, ou seulement certains ? Comment les patients sont-ils orientés vers le bon professionnel ?",
        helper: "",
        type: "textarea",
        required: true
      },
      {
        id: "msp_prior_tools",
        label:
          "Votre MSP a-t-elle déjà utilisé un outil pour gérer la file d'attente — borne, écran, logiciel, autre ? Si oui, lequel ? Pourquoi l'avez-vous gardé ou arrêté ?",
        helper: "",
        type: "textarea",
        required: true
      },
      {
        id: "msp_decision_making",
        label:
          "Qui décide des outils logiciels dans votre MSP ? Vous individuellement, le coordinateur, le bureau, un vote collectif ?",
        helper: "",
        type: "textarea",
        required: true
      },
      {
        id: "msp_budget",
        label:
          "Le budget pour ces outils est-il par médecin, mutualisé, ou pris sur la dotation ACI ?",
        helper: "",
        type: "textarea",
        required: true
      },
      {
        id: "msp_ars_reporting",
        label:
          "Avez-vous des obligations de reporting vers l'ARS sur les flux de patients ou l'organisation ? Un outil qui produirait ces rapports automatiquement aurait-il de la valeur pour vous ?",
        helper: "",
        type: "textarea",
        required: true
      }
    ]
  }
];
