/**
 * Contenus des pages « Politique de confidentialité » et « Mentions légales ».
 *
 * Les passages entre [[double crochets]] sont des informations à compléter
 * par l'AGATOUR : ils s'affichent surlignés sur le site tant qu'ils restent.
 * Ces textes sont une base de travail et doivent être relus par un juriste.
 */

import type { Bi } from "@/lib/mice-data";

export type LegalBlock =
  | { type: "p"; text: Bi }
  | { type: "list"; items: Bi[] }
  | { type: "table"; head: Bi[]; rows: Bi[][] };

export type LegalSection = { id: string; title: Bi; blocks: LegalBlock[] };

export type LegalDocument = {
  updatedAt: string; // AAAA-MM-JJ
  intro: Bi;
  sections: LegalSection[];
};

const p = (fr: string, en: string): LegalBlock => ({ type: "p", text: { fr, en } });
const list = (...items: [string, string][]): LegalBlock => ({
  type: "list",
  items: items.map(([fr, en]) => ({ fr, en })),
});
const bi = (fr: string, en: string): Bi => ({ fr, en });

export const CONTACT_EMAIL = "contact@gabonmice.com";

/* ------------------------------------------------------------------ */
/* Politique de confidentialité                                         */
/* ------------------------------------------------------------------ */

export const privacyPolicy: LegalDocument = {
  updatedAt: "2026-10-28",
  intro: bi(
    "GabonMICE accorde une grande importance à la protection de vos données personnelles. Cette politique explique quelles données nous collectons lorsque vous utilisez la plateforme, pourquoi nous les utilisons, avec qui nous les partageons et comment exercer vos droits.",
    "GabonMICE takes the protection of your personal data seriously. This policy explains what data we collect when you use the platform, why we use it, who we share it with and how to exercise your rights.",
  ),
  sections: [
    {
      id: "responsable",
      title: bi("1. Responsable du traitement", "1. Data controller"),
      blocks: [
        p(
          "Le responsable du traitement des données collectées sur GabonMICE est l'AGATOUR ([[dénomination complète]]), [[adresse complète du siège]], Libreville, Gabon.",
          "The controller of the data collected on GabonMICE is AGATOUR ([[full legal name]]), [[full head office address]], Libreville, Gabon.",
        ),
        p(
          `Pour toute question relative à vos données, vous pouvez écrire à ${CONTACT_EMAIL} ou utiliser le formulaire de la page Contact.`,
          `For any question about your data, write to ${CONTACT_EMAIL} or use the form on the Contact page.`,
        ),
      ],
    },
    {
      id: "donnees",
      title: bi("2. Données collectées", "2. Data we collect"),
      blocks: [
        p(
          "Nous collectons uniquement les données que vous nous transmettez volontairement, ainsi que quelques données techniques nécessaires au fonctionnement du site :",
          "We only collect the data you choose to send us, plus a few technical data needed for the site to work:",
        ),
        {
          type: "table",
          head: [bi("Situation", "Situation"), bi("Données concernées", "Data concerned")],
          rows: [
            [
              bi("Formulaire de contact", "Contact form"),
              bi(
                "Nom, organisation, e-mail, téléphone, type d'événement, nombre de participants, message",
                "Name, organisation, email, phone, event type, number of attendees, message",
              ),
            ],
            [
              bi("Réservation ou demande de devis", "Booking or quote request"),
              bi(
                "Coordonnées, prestation concernée, dates souhaitées, nombre de participants, précisions",
                "Contact details, service concerned, preferred dates, number of attendees, details",
              ),
            ],
            [
              bi("Espace organisateur", "Organiser space"),
              bi(
                "Coordonnées, intitulé, thème, cible, dates, ville et besoins de l'événement, budget indicatif",
                "Contact details, event title, theme, audience, dates, city and needs, indicative budget",
              ),
            ],
            [
              bi("Demande de labellisation", "Labelling application"),
              bi(
                "Raison sociale, catégorie, ville, capacité, services, site web, coordonnées du contact",
                "Company name, category, city, capacity, services, website, contact details",
              ),
            ],
            [
              bi("Assistant GabonMICE AI", "GabonMICE AI assistant"),
              bi(
                "Messages que vous saisissez dans la fenêtre de discussion",
                "Messages you type in the chat window",
              ),
            ],
            [
              bi("Navigation", "Browsing"),
              bi(
                "Données techniques transmises par votre navigateur (adresse IP, type d'appareil), traitées par nos hébergeurs et prestataires techniques",
                "Technical data sent by your browser (IP address, device type), processed by our hosting and technical providers",
              ),
            ],
          ],
        },
        p(
          "Ne saisissez pas de données sensibles (santé, opinions, données bancaires…) dans les formulaires ou l'assistant : elles ne sont pas nécessaires à nos services.",
          "Please do not enter sensitive data (health, opinions, bank details…) in the forms or the assistant: they are not needed for our services.",
        ),
      ],
    },
    {
      id: "finalites",
      title: bi("3. Pourquoi nous utilisons vos données", "3. Why we use your data"),
      blocks: [
        list(
          [
            "Répondre à vos demandes d'information et vous accompagner dans l'organisation de vos événements.",
            "Answer your requests and help you organise your events.",
          ],
          [
            "Transmettre vos réservations et demandes de devis aux prestataires concernés, et assurer leur suivi.",
            "Forward your bookings and quote requests to the providers concerned, and follow them up.",
          ],
          [
            "Étudier les demandes de labellisation des prestataires et publier les fiches des prestataires labellisés.",
            "Review provider labelling applications and publish labelled provider listings.",
          ],
          [
            "Publier dans l'agenda les événements que vous nous demandez de diffuser, après validation.",
            "Publish in the calendar the events you ask us to share, after validation.",
          ],
          [
            "Vous envoyer les e-mails de confirmation liés à vos demandes.",
            "Send you confirmation emails related to your requests.",
          ],
          [
            "Assurer le bon fonctionnement, la sécurité et l'amélioration de la plateforme.",
            "Keep the platform running, secure and improving.",
          ],
        ),
        p(
          "Vos données ne sont jamais vendues ni utilisées à des fins publicitaires.",
          "Your data is never sold or used for advertising.",
        ),
      ],
    },
    {
      id: "base-legale",
      title: bi("4. Cadre légal", "4. Legal framework"),
      blocks: [
        p(
          "Les traitements sont réalisés conformément à la loi gabonaise n° 001/2011 du 25 septembre 2011 relative à la protection des données à caractère personnel. Ils reposent sur votre consentement, exprimé lorsque vous envoyez un formulaire, et sur la nécessité de traiter votre demande.",
          "Processing complies with Gabonese Law No. 001/2011 of 25 September 2011 on the protection of personal data. It is based on your consent, given when you submit a form, and on the need to handle your request.",
        ),
        p(
          "Lorsque vous êtes situé dans l'Union européenne, nous appliquons également les principes du Règlement général sur la protection des données (RGPD).",
          "If you are located in the European Union, we also apply the principles of the General Data Protection Regulation (GDPR).",
        ),
      ],
    },
    {
      id: "destinataires",
      title: bi("5. Qui reçoit vos données", "5. Who receives your data"),
      blocks: [
        list(
          [
            "Les équipes habilitées de l'AGATOUR et de GabonMICE.",
            "Authorised AGATOUR and GabonMICE staff.",
          ],
          [
            "Les prestataires labellisés concernés par votre réservation ou votre demande de devis, uniquement pour y répondre.",
            "The labelled providers concerned by your booking or quote request, only to answer it.",
          ],
          [
            "Nos prestataires techniques, qui agissent pour notre compte : Vercel (hébergement du site), SheetDB et Google (enregistrement des demandes et envoi des e-mails), Chatbase (assistant de discussion), CARTO et OpenStreetMap (fonds de carte), Google Fonts (polices de caractères).",
            "Our technical providers, acting on our behalf: Vercel (site hosting), SheetDB and Google (storing requests and sending emails), Chatbase (chat assistant), CARTO and OpenStreetMap (map tiles), Google Fonts (typefaces).",
          ],
        ),
        p(
          "Certains de ces prestataires sont établis hors du Gabon, notamment aux États-Unis et dans l'Union européenne. Nous veillons à ne leur transmettre que les données nécessaires à leur mission.",
          "Some of these providers are located outside Gabon, notably in the United States and the European Union. We only share the data they need for their task.",
        ),
      ],
    },
    {
      id: "conservation",
      title: bi("6. Durée de conservation", "6. Retention period"),
      blocks: [
        list(
          [
            "Demandes de contact, réservations et devis : [[3 ans]] à compter du dernier échange.",
            "Contact requests, bookings and quotes: [[3 years]] from the last exchange.",
          ],
          [
            "Événements répertoriés : pendant la durée de l'événement puis [[2 ans]] pour l'historique de l'agenda.",
            "Listed events: for the duration of the event, then [[2 years]] for the calendar history.",
          ],
          [
            "Dossiers de labellisation : pendant toute la durée de la labellisation puis [[5 ans]].",
            "Labelling files: for the whole labelling period, then [[5 years]].",
          ],
        ),
        p(
          "À l'issue de ces durées, les données sont supprimées ou rendues anonymes.",
          "After these periods, data is deleted or anonymised.",
        ),
      ],
    },
    {
      id: "stockage-local",
      title: bi("7. Cookies et stockage local", "7. Cookies and local storage"),
      blocks: [
        p(
          "GabonMICE n'utilise pas de cookies publicitaires ni d'outils de mesure d'audience. Le site enregistre seulement dans votre navigateur (stockage local) quelques préférences, qui ne nous sont pas transmises :",
          "GabonMICE does not use advertising cookies or audience measurement tools. The site only saves a few preferences in your browser (local storage), which are not sent to us:",
        ),
        list(
          ["La langue choisie (français ou anglais).", "Your chosen language (French or English)."],
          ["Le thème d'affichage (clair ou sombre).", "Your display theme (light or dark)."],
          [
            "Les événements que vous avez soumis depuis l'espace organisateur, pour vous les afficher en attente de validation.",
            "The events you submitted from the organiser space, to show them to you while awaiting validation.",
          ],
        ),
        p(
          "Vous pouvez effacer ces informations à tout moment depuis les réglages de votre navigateur. L'assistant de discussion (Chatbase) et les fonds de carte peuvent déposer leurs propres cookies techniques, soumis à leurs politiques respectives.",
          "You can clear this information at any time from your browser settings. The chat assistant (Chatbase) and map tiles may set their own technical cookies, governed by their respective policies.",
        ),
      ],
    },
    {
      id: "securite",
      title: bi("8. Sécurité", "8. Security"),
      blocks: [
        p(
          "Le site est servi en connexion chiffrée (HTTPS). L'accès aux demandes enregistrées est limité aux personnes habilitées. Aucun paiement n'est effectué sur la plateforme : nous ne collectons aucune donnée bancaire.",
          "The site is served over an encrypted connection (HTTPS). Access to stored requests is limited to authorised people. No payment is made on the platform: we collect no bank details.",
        ),
      ],
    },
    {
      id: "droits",
      title: bi("9. Vos droits", "9. Your rights"),
      blocks: [
        p(
          "Vous disposez d'un droit d'accès, de rectification, d'opposition et de suppression de vos données, ainsi que du droit de retirer votre consentement à tout moment.",
          "You have the right to access, correct, object to and delete your data, and to withdraw your consent at any time.",
        ),
        p(
          `Pour exercer ces droits, écrivez à ${CONTACT_EMAIL} en précisant votre demande. Nous vous répondrons dans un délai d'un mois. Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la Commission Nationale pour la Protection des Données à Caractère Personnel (CNPDCP).`,
          `To exercise these rights, write to ${CONTACT_EMAIL} with your request. We will reply within one month. If you believe your rights are not respected, you can contact the Gabonese data protection authority (CNPDCP).`,
        ),
      ],
    },
    {
      id: "modifications",
      title: bi("10. Modifications", "10. Changes"),
      blocks: [
        p(
          "Cette politique peut évoluer, notamment lors de l'ajout de nouvelles fonctionnalités. La date de dernière mise à jour figure en haut de la page.",
          "This policy may change, in particular when new features are added. The last update date is shown at the top of the page.",
        ),
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Mentions légales                                                     */
/* ------------------------------------------------------------------ */

export const legalNotice: LegalDocument = {
  updatedAt: "2026-10-28",
  intro: bi(
    "Les présentes mentions légales identifient l'éditeur et l'hébergeur de la plateforme GabonMICE et précisent les conditions d'utilisation de ses contenus et services.",
    "This legal notice identifies the publisher and host of the GabonMICE platform and sets out the conditions for using its content and services.",
  ),
  sections: [
    {
      id: "editeur",
      title: bi("1. Éditeur du site", "1. Publisher"),
      blocks: [
        list(
          [
            "Éditeur : AGATOUR ([[dénomination complète]])",
            "Publisher: AGATOUR ([[full legal name]])",
          ],
          ["Statut juridique : [[statut de l'établissement]]", "Legal status: [[legal status]]"],
          [
            "Siège : [[adresse complète]], Libreville, Gabon",
            "Head office: [[full address]], Libreville, Gabon",
          ],
          ["Téléphone : [[numéro de téléphone]]", "Phone: [[phone number]]"],
          [`E-mail : ${CONTACT_EMAIL}`, `Email: ${CONTACT_EMAIL}`],
          [
            "Directeur de la publication : [[nom et fonction]]",
            "Publication director: [[name and position]]",
          ],
        ),
      ],
    },
    {
      id: "realisation",
      title: bi("2. Conception et réalisation", "2. Design and development"),
      blocks: [
        p(
          "Le site a été conçu, développé et est maintenu par PHILA INCORPORATION, [[adresse et coordonnées]].",
          "The site was designed, developed and is maintained by PHILA INCORPORATION, [[address and contact details]].",
        ),
      ],
    },
    {
      id: "hebergement",
      title: bi("3. Hébergement", "3. Hosting"),
      blocks: [
        p(
          "Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com.",
          "The site is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States — vercel.com.",
        ),
      ],
    },
    {
      id: "plateforme",
      title: bi("4. Rôle de la plateforme", "4. Role of the platform"),
      blocks: [
        p(
          "GabonMICE est un outil d'information et de mise en relation entre les participants, les organisateurs d'événements et les prestataires du tourisme d'affaires au Gabon. L'AGATOUR transmet les réservations et demandes de devis aux prestataires concernés.",
          "GabonMICE is an information and matchmaking tool connecting participants, event organisers and business tourism providers in Gabon. AGATOUR forwards bookings and quote requests to the providers concerned.",
        ),
        p(
          "Une réservation effectuée sur la plateforme est une demande : elle devient ferme après confirmation par le prestataire. Le contrat de prestation est conclu directement entre l'utilisateur et le prestataire, qui reste responsable de l'exécution de ses services. Aucun paiement n'est réalisé sur le site.",
          "A booking made on the platform is a request: it becomes firm once confirmed by the provider. The service contract is concluded directly between the user and the provider, who remains responsible for delivering the service. No payment is made on the site.",
        ),
      ],
    },
    {
      id: "contenus",
      title: bi("5. Informations publiées", "5. Published information"),
      blocks: [
        p(
          "Les informations présentées (offres, tarifs, programmes, capacités, événements, localisations) sont fournies à titre indicatif et peuvent évoluer. Les tarifs sont ceux communiqués par les prestataires partenaires et doivent être confirmés au moment de la réservation. Les positions sur la carte interactive sont approximatives.",
          "The information shown (offers, prices, programmes, capacities, events, locations) is provided for guidance and may change. Prices are those given by partner providers and must be confirmed when booking. Positions on the interactive map are approximate.",
        ),
        p(
          "Les réponses de l'assistant GabonMICE AI sont générées automatiquement et peuvent comporter des erreurs : elles ne remplacent pas la confirmation de l'AGATOUR ou des prestataires.",
          "Answers from the GabonMICE AI assistant are generated automatically and may contain errors: they do not replace confirmation from AGATOUR or the providers.",
        ),
      ],
    },
    {
      id: "propriete",
      title: bi("6. Propriété intellectuelle", "6. Intellectual property"),
      blocks: [
        p(
          "La structure du site, ses textes, logos (dont GabonMICE et AGATOUR), photographies, vidéos et éléments graphiques sont protégés par le droit de la propriété intellectuelle. Les photographies des établissements restent la propriété de leurs auteurs ou des prestataires concernés.",
          "The site's structure, texts, logos (including GabonMICE and AGATOUR), photographs, videos and graphics are protected by intellectual property law. Photographs of establishments remain the property of their authors or the providers concerned.",
        ),
        p(
          "Toute reproduction, représentation ou réutilisation, totale ou partielle, sans autorisation écrite préalable est interdite.",
          "Any reproduction, display or reuse, in whole or in part, without prior written permission is prohibited.",
        ),
      ],
    },
    {
      id: "liens",
      title: bi("7. Liens externes", "7. External links"),
      blocks: [
        p(
          "Le site peut contenir des liens vers d'autres sites (prestataires, réseaux sociaux, partenaires). GabonMICE n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.",
          "The site may contain links to other sites (providers, social networks, partners). GabonMICE has no control over these sites and accepts no liability for their content.",
        ),
      ],
    },
    {
      id: "responsabilite",
      title: bi("8. Responsabilité", "8. Liability"),
      blocks: [
        p(
          "L'éditeur s'efforce d'assurer l'exactitude des informations et la disponibilité du site, sans pouvoir le garantir. Il ne saurait être tenu responsable d'une interruption du service, d'une erreur ou d'une omission dans les contenus, ni des dommages résultant de l'utilisation du site.",
          "The publisher strives to keep information accurate and the site available, but cannot guarantee it. It cannot be held liable for service interruptions, errors or omissions in the content, or damage resulting from use of the site.",
        ),
      ],
    },
    {
      id: "donnees-personnelles",
      title: bi("9. Données personnelles", "9. Personal data"),
      blocks: [
        p(
          "Le traitement de vos données personnelles est décrit dans notre politique de confidentialité, accessible depuis le pied de page du site.",
          "How we process your personal data is described in our privacy policy, available from the site footer.",
        ),
      ],
    },
    {
      id: "droit",
      title: bi("10. Droit applicable", "10. Governing law"),
      blocks: [
        p(
          "Les présentes mentions légales sont soumises au droit gabonais. En cas de litige, et à défaut de solution amiable, les tribunaux compétents de Libreville seront seuls compétents.",
          "This legal notice is governed by Gabonese law. In the event of a dispute, and failing an amicable solution, the competent courts of Libreville shall have sole jurisdiction.",
        ),
      ],
    },
  ],
};
