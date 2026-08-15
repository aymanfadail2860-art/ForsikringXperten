import type { LeadType } from "@/lib/validation/lead";

/**
 * Campaign landing pages (/lp/...).
 *
 * These reuse the same design system, funnel, tracking and database as the rest
 * of the site — only the framing and the navigation change. Nothing is
 * duplicated: a landing page is a data entry here, not a new codebase.
 *
 * Navigation is reduced on purpose to remove exits from a paid click. The
 * footer legal links remain, because removing those is not a design decision.
 */

export type LandingPage = {
  slug: string;
  /** Pre-selects the funnel branch, removing the first question. */
  leadType: LeadType;
  headline: string;
  subheadline: string;
  metaTitle: string;
  metaDescription: string;
  /** Three to four concrete points — the reason this audience should care. */
  points: { title: string; body: string }[];
  /** What we will actually look at, phrased for this audience. */
  checklist: string[];
  /** Links back into the content cluster this page belongs to. */
  relatedIndustry?: string;
  relatedProducts?: { segment: "privat" | "erhverv"; slug: string }[];
};

export const landingPages: LandingPage[] = [
  {
    slug: "haandvaerker",
    leadType: "erhverv",
    headline: "Er håndværksvirksomhedens forsikringer fulgt med?",
    subheadline:
      "Værktøj i bilen, ansvar hos kunden og ansatte på skiftende arbejdssteder. Få gennemgået, om dækningen passer til det, I laver i dag.",
    metaTitle: "Forsikringstjek til håndværkere",
    metaDescription:
      "Få gennemgået håndværksvirksomhedens forsikringer — arbejdsskade, erhvervsansvar, værktøj, biler og maskiner. Uforpligtende gennemgang.",
    points: [
      {
        title: "Værktøjet i bilen",
        body: "Er det dækket — og for hvor meget? Beløbsgrænsen er sjældent den samme som værdien i bilen.",
      },
      {
        title: "Ansvar hos kunden",
        body: "En vandskade i en kundes bolig bliver hurtigt et krav. Dækningssummen bør passe til jeres største opgaver.",
      },
      {
        title: "Ansatte og lærlinge",
        body: "Arbejdsskadeforsikring er lovpligtig, og antal ansatte og lønsum skal være opdateret.",
      },
    ],
    checklist: [
      "Værktøj og udstyr i bilerne",
      "Erhvervsansvar og dækningssum",
      "Arbejdsskade for ansatte og lærlinge",
      "Maskiner og materiel på pladsen",
      "Køretøjer og vejhjælp",
    ],
    relatedIndustry: "haandvaerkere",
    relatedProducts: [
      { segment: "erhverv", slug: "erhvervsansvar" },
      { segment: "erhverv", slug: "arbejdsskadeforsikring" },
    ],
  },
  {
    slug: "restaurant",
    leadType: "erhverv",
    headline: "Hvad sker der med restauranten, hvis køkkenet står stille?",
    subheadline:
      "Brand, vandskade eller et defekt køleanlæg stopper omsætningen med det samme. Få gennemgået, om dækningen rækker.",
    metaTitle: "Forsikringstjek til restauranter og caféer",
    metaDescription:
      "Få gennemgået restaurantens forsikringer — ansvar, arbejdsskade, løsøre, driftstab og køle-/frostvarer. Uforpligtende gennemgang.",
    points: [
      {
        title: "Driftstab efter en skade",
        body: "En restaurant kan ikke sælge fra lager. Dækningsperioden bør svare til den tid, det tager at åbne igen.",
      },
      {
        title: "Køle- og frostvarer",
        body: "Et strømsvigt kan koste hele varelageret. Det er en selvstændig dækning.",
      },
      {
        title: "Gæster og personale",
        body: "Ansvar over for gæster og arbejdsskade for personalet er to forskellige dækninger.",
      },
    ],
    checklist: [
      "Driftstab og dækningsperiode",
      "Løsøre, inventar og køkkenudstyr",
      "Køle- og frostvarer",
      "Ansvar over for gæster",
      "Arbejdsskade for personalet",
    ],
    relatedIndustry: "restauranter",
    relatedProducts: [
      { segment: "erhverv", slug: "driftstab" },
      { segment: "erhverv", slug: "erhvervsansvar" },
    ],
  },
  {
    slug: "vognmand",
    leadType: "erhverv",
    headline: "Er godset i bilen dækket — eller kun bilen?",
    subheadline:
      "Kaskoforsikringen dækker køretøjet. Varerne i det er en anden aftale. Få gennemgået, hvordan I står.",
    metaTitle: "Forsikringstjek til vognmænd og transportvirksomheder",
    metaDescription:
      "Få gennemgået transportvirksomhedens forsikringer — køretøjer, godsansvar, arbejdsskade, ansvar og driftstab. Uforpligtende gennemgang.",
    points: [
      {
        title: "Gods under transport",
        body: "Godsansvar og varedækning er selvstændige aftaler med deres egne summer.",
      },
      {
        title: "Nedbrud koster ture",
        body: "Med få biler betyder ét langvarigt nedbrud tabte opgaver. Erstatningskøretøj og driftstab er værd at kende.",
      },
      {
        title: "Chauffører",
        body: "Læsning og aflæsning er der, hvor skaderne oftest sker.",
      },
    ],
    checklist: [
      "Køretøjer: ansvar og kasko",
      "Godsansvar og vareforsikring",
      "Trailere og påhængsmateriel",
      "Arbejdsskade for chauffører",
      "Driftstab ved nedbrud",
    ],
    relatedIndustry: "transport",
    relatedProducts: [
      { segment: "erhverv", slug: "biler-og-transport" },
      { segment: "erhverv", slug: "arbejdsskadeforsikring" },
    ],
  },
  {
    slug: "husejer",
    leadType: "privat",
    headline: "Har du bygget om, siden husforsikringen blev tegnet?",
    subheadline:
      "Tilbygning, nyt tag, solceller eller ladestander ændrer, hvad der skal dækkes. Få set aftalen efter.",
    metaTitle: "Forsikringstjek til husejere",
    metaDescription:
      "Få gennemgået din husforsikring og indboforsikring. Se om areal, dækning og summer stadig passer efter ombygning eller nye installationer.",
    points: [
      {
        title: "Står det rigtige areal på policen?",
        body: "Inddraget kælder eller loft ændrer boligens areal — og dermed grundlaget for dækningen.",
      },
      {
        title: "Er udestue og carport med?",
        body: "De hører til bygningsforsikringen, men kun hvis de rent faktisk er nævnt.",
      },
      {
        title: "Passer indbosummen?",
        body: "Den er hos de fleste sat én gang og aldrig set igen.",
      },
    ],
    checklist: [
      "Husforsikring: areal, tilbygninger og installationer",
      "Skjulte rør og kabler",
      "Indbosum og dyre enkeltting",
      "Solceller, varmepumpe og ladestander",
      "Selvrisiko på de enkelte dækninger",
    ],
    relatedProducts: [
      { segment: "privat", slug: "husforsikring" },
      { segment: "privat", slug: "indboforsikring" },
    ],
  },
  {
    slug: "bil",
    leadType: "privat",
    headline: "Passer bilforsikringen til den bil, du kører i nu?",
    subheadline:
      "Ny bil, færre kilometer eller en ung bilist i husstanden ændrer både pris og behov. Få aftalen set efter.",
    metaTitle: "Forsikringstjek til bilejere",
    metaDescription:
      "Få gennemgået din bilforsikring. Se om kasko, selvrisiko, kilometertal og tilvalg som vejhjælp stadig passer til din situation.",
    points: [
      {
        title: "Er kasko stadig det rigtige?",
        body: "På en ældre bil kan kaskodækningen fylde meget af bilens værdi.",
      },
      {
        title: "Betaler du for vejhjælp to steder?",
        body: "Mange har den både på forsikringen og gennem en anden aftale.",
      },
      {
        title: "Passer selvrisikoen til din økonomi?",
        body: "Det afgørende er, om du kan betale den, hvis skaden sker i morgen.",
      },
    ],
    checklist: [
      "Ansvar, kasko og selvrisiko",
      "Årligt kilometertal",
      "Vejhjælp og andre tilvalg",
      "Førerulykkesforsikring",
      "Unge bilister i husstanden",
    ],
    relatedProducts: [
      { segment: "privat", slug: "bilforsikring" },
      { segment: "privat", slug: "ulykkesforsikring" },
    ],
  },
];

export function getLandingPage(slug: string): LandingPage | undefined {
  return landingPages.find((page) => page.slug === slug);
}
