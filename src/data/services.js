// Single source of truth for the four services. Used by the homepage
// Services section (labels/slugs) and by the dedicated /[service] pages
// that give Google distinct URLs to offer as sitelinks.
export const SERVICES = [
  {
    slug: "websites",
    eyebrow: "Websites",
    headA: "Sites built before",
    headB: "people leave.",
    price: "From $1,800",
    metaTitle: "Website design for small businesses — Anara Marketing Solutions",
    metaDescription:
      "Custom, mobile-first websites built to load in under two seconds and wired to Google so nearby customers find you. From $1,800 — Victoria-based, Australia-wide.",
    lead: "A website is the shopfront most of your customers see first. We build one that loads fast, reads clearly and turns a visit into a booking, a call or a walk-in.",
    body: [
      "Custom-built and mobile-first — no bloated templates, no thirty-second loads. Every page is wired to Google so the people nearby can actually find you, and written in plain language that sounds like your business, not a brochure.",
      "You get a clean, fast site you can be proud to hand out — and, if you'd like it, a care plan so it stays current without you lifting a finger.",
    ],
    included: [
      "Bespoke design — no templates",
      "Loads in under two seconds",
      "Mobile-first, built for phones",
      "Google-connected for local search",
      "Copywriting in your voice",
      "Optional monthly care plan",
    ],
  },
  {
    slug: "social",
    eyebrow: "Social",
    headA: "Posts that",
    headB: "fill the room.",
    price: "From $1,200/mo",
    metaTitle: "Social media content & management — Anara Marketing Solutions",
    metaDescription:
      "Planned, shot, written and scheduled social content by the week or month — you approve in ten minutes. From $1,200/mo. Victoria-based, Australia-wide.",
    lead: "Social done properly is a standing appointment, not a scramble. We plan it, shoot it, write it and schedule it — you approve in ten minutes.",
    body: [
      "Each month starts with a simple content plan. We come on-site to photograph the real thing — your food, your space, your makers — then turn it into reels, stories and posts that sound like you.",
      "The measure isn't follower count. It's a fuller Saturday, a busier season, a phone that rings. We report in plain English so you always know what's working.",
    ],
    included: [
      "Monthly content plan",
      "On-site photography",
      "Reels and stories",
      "Written captions",
      "Scheduled and posted for you",
      "Plain-English reporting",
    ],
  },
  {
    slug: "catalogues",
    eyebrow: "Catalogues",
    headA: "Pieces worth",
    headB: "keeping.",
    price: "From $850",
    metaTitle: "Print & digital catalogue design — Anara Marketing Solutions",
    metaDescription:
      "Press-ready catalogues, lookbooks and menus designed alongside an interactive PDF — same project, same fee. From $850. Victoria-based, Australia-wide.",
    lead: "A seasonal lookbook. A tasting card for a cellar door. A wholesale catalogue for a maker. We design print and digital together, so one project covers both.",
    body: [
      "You get press-ready artwork for your local printer and an interactive PDF to send or embed — designed as one piece, charged as one fee.",
      "We build reusable templates too, so next season's edition is a quick refresh rather than a fresh start.",
    ],
    included: [
      "Press-ready print artwork",
      "Interactive digital PDF",
      "Designed as one project",
      "Local print partner",
      "Reusable templates",
      "Photography if you need it",
    ],
  },
  {
    slug: "google",
    eyebrow: "Google",
    headA: "Found before",
    headB: "they search your name.",
    price: "From $850/mo",
    metaTitle: "Google Business Profile & local SEO — Anara Marketing Solutions",
    metaDescription:
      "Your Google Business Profile, local search and reviews set up and tended so nearby customers find you on the map and in results. From $850/mo.",
    lead: "Most local customers find you through Google before they ever type your name. We set up and tend your presence so you show up on the map and in the results — not three pages down.",
    body: [
      "We optimise your Google Business Profile, keep your hours, photos and details right, and help you gather and respond to reviews so new customers trust you at a glance.",
      "It's steady, unglamorous work that quietly brings people through the door — measured by calls, directions and visits, not vanity numbers.",
    ],
    included: [
      "Google Business Profile set up",
      "Local search optimisation",
      "Reviews gathered and answered",
      "Map and results presence",
      "Photos and details kept current",
      "Monthly check-in and report",
    ],
  },
];

export const getService = (slug) => SERVICES.find((s) => s.slug === slug);
