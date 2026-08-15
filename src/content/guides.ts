/**
 * Guides.
 *
 * Written to answer a question a real person actually has, in plain Danish.
 * Each guide ends up linking to the relevant product or industry page, which is
 * what makes the content cluster hold together — pillar (product) ←→ supporting
 * (guide) ←→ industry.
 *
 * Nothing here is legal advice, and nothing states a universal requirement
 * unless it genuinely is one (arbejdsskadeforsikring being the clear example).
 */

export type GuideSection = {
  heading: string;
  paragraphs: string[];
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[];
};

export type Guide = {
  slug: string;
  title: string;
  /** Question the guide answers, used as the card title and meta description. */
  summary: string;
  metaDescription: string;
  audience: "privat" | "erhverv" | "begge";
  readingMinutes: number;
  updated: string;
  intro: string;
  sections: GuideSection[];
  /** Internal links: product slugs with their segment. */
  relatedProducts: { segment: "privat" | "erhverv"; slug: string }[];
  relatedIndustries?: string[];
  relatedGuides?: string[];
};

export const guides: Guide[] = [
  {
    slug: "hvad-er-en-erhvervsansvarsforsikring",
    title: "Hvad er en erhvervsansvarsforsikring?",
    summary:
      "Hvad dækker erhvervsansvar, hvornår bliver det relevant, og hvad er forskellen på det og produktansvar?",
    metaDescription:
      "Erhvervsansvarsforsikring forklaret i almindeligt dansk: hvad den dækker, forskellen på erhvervs- og produktansvar, og hvornår dækningssummen bør ses efter.",
    audience: "erhverv",
    readingMinutes: 4,
    updated: "2026-01-15",
    intro:
      "Erhvervsansvar handler om de situationer, hvor virksomheden bliver ansvarlig for skade på andre menneskers person eller ting. Det er en af de dækninger, flest virksomheder har — og en af dem, færrest har set nærmere på, siden aftalen blev oprettet.",
    sections: [
      {
        heading: "Hvad dækker den?",
        paragraphs: [
          "Kort sagt: skader, virksomheden forvolder på andre under udførelsen af sit arbejde. Det kan være en vandskade hos en kunde, et beskadiget gulv eller en person, der kommer til skade, fordi noget gik galt.",
          "Forsikringen dækker både selve erstatningen og de omkostninger, der følger med at få afklaret, om virksomheden overhovedet er ansvarlig. Den del overses ofte, men et krav, der ender med at blive afvist, kan stadig have kostet penge at få afvist.",
        ],
        bullets: [
          "Skade på andres ting under arbejdet",
          "Personskade, som virksomheden er ansvarlig for",
          "Sagsomkostninger i forbindelse med et rejst krav",
        ],
      },
      {
        heading: "Erhvervsansvar og produktansvar er ikke det samme",
        paragraphs: [
          "Erhvervsansvar dækker, mens arbejdet udføres. Produktansvar dækker, når et produkt, virksomheden har solgt eller fremstillet, senere forvolder skade.",
          "Sælger eller producerer I fysiske produkter, er det værd at få bekræftet, at produktansvar rent faktisk er med i aftalen — det er ikke altid tilfældet, og det er en dyr antagelse at tage fejl af.",
        ],
      },
      {
        heading: "Hvad betyder dækningssummen?",
        paragraphs: [
          "Dækningssummen er det maksimale beløb, forsikringen dækker. Er summen sat, da virksomheden lavede opgaver til 100.000 kroner, passer den sjældent til opgaver til flere millioner.",
          "Nogle kunder og udbud stiller desuden krav til, hvor høj dækningssummen skal være, før I kan byde på opgaven. Det er en praktisk grund til at kende sit eget tal.",
        ],
      },
      {
        heading: "Hvornår bør aftalen gennemgås?",
        paragraphs: [
          "Når virksomheden ændrer sig. Nye fagområder, større opgaver, flere ansatte eller nye typer kunder kan alle betyde, at policens beskrivelse af virksomheden ikke længere passer til det, I faktisk laver.",
          "Dét er vigtigere, end mange tror: dækker aftalen ikke den aktivitet, skaden skete under, hjælper en høj dækningssum ikke.",
        ],
      },
    ],
    relatedProducts: [
      { segment: "erhverv", slug: "erhvervsansvar" },
      { segment: "erhverv", slug: "erhvervsforsikring" },
    ],
    relatedIndustries: ["haandvaerkere", "produktion"],
    relatedGuides: ["hvad-daekker-arbejdsskadeforsikring"],
  },
  {
    slug: "hvad-daekker-arbejdsskadeforsikring",
    title: "Hvad dækker en arbejdsskadeforsikring?",
    summary:
      "Den er lovpligtig, når virksomheden har ansatte. Her er hvad den dækker — og hvad den ikke gør.",
    metaDescription:
      "Arbejdsskadeforsikring forklaret: hvad den lovpligtige dækning omfatter, hvem der er omfattet, og hvorfor lønsum og antal ansatte skal holdes opdateret.",
    audience: "erhverv",
    readingMinutes: 4,
    updated: "2026-01-15",
    intro:
      "Har virksomheden ansatte, er arbejdsskadeforsikring lovpligtig. Den dækker personskade — ikke skader på ting. Det er den vigtigste skillelinje at have med.",
    sections: [
      {
        heading: "Hvad er dækket?",
        paragraphs: [
          "Forsikringen dækker arbejdsulykker og de erhvervssygdomme, loven omfatter. Bliver en medarbejder varigt påvirket af en skade, er det her, erstatningen for tab af erhvervsevne og godtgørelsen for varigt mén kommer fra.",
        ],
        bullets: [
          "Arbejdsulykker, der rammer ansatte",
          "Anerkendte erhvervssygdomme",
          "Tab af erhvervsevne og varigt mén",
          "Behandlingsudgifter i forbindelse med en anerkendt skade",
        ],
      },
      {
        heading: "Hvad dækker den ikke?",
        paragraphs: [
          "Den dækker ikke skader på ting — hverken virksomhedens eller andres. Den dækker heller ikke medarbejderens fritid. Sker ulykken hjemme i weekenden, er det en privat ulykkesforsikring, der er relevant.",
          "Det er værd at nævne over for medarbejdere, som tror, at de er dækket døgnet rundt gennem arbejdet. Det er de sjældent.",
        ],
      },
      {
        heading: "Er indehaveren selv dækket?",
        paragraphs: [
          "Som udgangspunkt dækker arbejdsskadeforsikringen de ansatte — ikke ejeren af virksomheden. Er du selvstændig, kan du typisk vælge at lade dig omfatte, men det er noget, der skal aftales aktivt.",
          "Det samme gælder ofte en medarbejdende ægtefælle. Det er en af de ting, der er værd at få bekræftet frem for at gå ud fra.",
        ],
      },
      {
        heading: "Hvorfor skal tallene holdes opdaterede?",
        paragraphs: [
          "Prisen og grundlaget hænger sammen med antal ansatte og lønsum. Vokser virksomheden, uden at tallene bliver rettet, passer aftalen ikke længere til virkeligheden.",
          "Bruger I vikarer, elever eller løst tilknyttede, er det også værd at få afklaret, hvordan de indgår.",
        ],
      },
    ],
    relatedProducts: [
      { segment: "erhverv", slug: "arbejdsskadeforsikring" },
      { segment: "erhverv", slug: "erhvervsforsikring" },
    ],
    relatedIndustries: ["haandvaerkere", "restauranter", "transport"],
    relatedGuides: ["hvad-er-en-erhvervsansvarsforsikring"],
  },
  {
    slug: "forsikringer-til-haandvaerkere",
    title: "Hvilke forsikringer bør en håndværker overveje?",
    summary:
      "Værktøj i bilen, ansvar hos kunden og ansatte på skiftende arbejdssteder — en gennemgang af de områder, der typisk er i spil.",
    metaDescription:
      "Hvilke forsikringer bør en håndværkervirksomhed overveje? Gennemgang af arbejdsskade, erhvervsansvar, værktøj, biler, maskiner og entreprise-relaterede forhold.",
    audience: "erhverv",
    readingMinutes: 5,
    updated: "2026-01-15",
    intro:
      "Håndværksvirksomheder har en usædvanlig spredt risiko: værdier i bilen, ansatte hos kunden og ansvar for arbejde udført et helt tredje sted. Her er de områder, der oftest er relevante at kigge på.",
    sections: [
      {
        heading: "Arbejdsskade — lovpligtig, når der er ansatte",
        paragraphs: [
          "Har virksomheden ansatte, skal der være en arbejdsskadeforsikring. Antal ansatte og lønsum skal passe med virkeligheden, og det er værd at tjekke, om lærlinge og løst tilknyttede er med, som I tror.",
        ],
      },
      {
        heading: "Erhvervsansvar — når noget går galt hos kunden",
        paragraphs: [
          "Det er her, en vandskade i en kundes bolig eller en beskadiget installation hører hjemme. Dækningssummen bør stå i forhold til de største opgaver, I tager — ikke til gennemsnittet.",
        ],
      },
      {
        heading: "Værktøj og udstyr i bilen",
        paragraphs: [
          "Værktøj i en varebil er ikke automatisk dækket af bilforsikringen. Der er typisk en selvstændig dækning med sin egen beløbsgrænse — og ofte betingelser om, hvordan bilen skal være låst, og hvor den må holde om natten.",
          "Ligger der for 150.000 kroner værktøj i bilen, og dækningen er sat til 50.000, opdages forskellen den forkerte dag.",
        ],
      },
      {
        heading: "Biler, maskiner og materiel",
        paragraphs: [
          "Ud over bilerne selv har mange virksomheder maskiner, stilladser og materialer, der står på skiftende adresser. Løsøre på et arbejdssted dækkes typisk anderledes end løsøre i firmaets egne lokaler.",
        ],
        bullets: [
          "Køretøjer: ansvar og kasko",
          "Maskiner og materiel på pladsen",
          "Materialer, der endnu ikke er monteret",
        ],
      },
      {
        heading: "Større opgaver kan stille egne krav",
        paragraphs: [
          "På større byggeopgaver kan bygherren stille konkrete krav til dækning og dækningssummer, ligesom entrepriseforhold kan komme i spil. Det er værd at få afklaret, inden kontrakten skrives under — ikke efter.",
        ],
      },
    ],
    relatedProducts: [
      { segment: "erhverv", slug: "arbejdsskadeforsikring" },
      { segment: "erhverv", slug: "erhvervsansvar" },
      { segment: "erhverv", slug: "biler-og-transport" },
    ],
    relatedIndustries: ["haandvaerkere"],
    relatedGuides: ["hvad-daekker-arbejdsskadeforsikring"],
  },
  {
    slug: "hvornaar-boer-forsikringer-gennemgaas",
    title: "Hvornår bør man gennemgå sine forsikringer?",
    summary:
      "Ikke efter en fast kalender — men når noget i dit liv eller din virksomhed har ændret sig.",
    metaDescription:
      "Hvornår er det relevant at gennemgå sine forsikringer? Konkrete situationer privat og erhverv, hvor dækningen typisk ikke længere passer til virkeligheden.",
    audience: "begge",
    readingMinutes: 3,
    updated: "2026-01-15",
    intro:
      "Forsikringer bliver sjældent forkerte på én gang. De bliver det langsomt, når livet eller virksomheden ændrer sig, og aftalen bliver stående, som den var. Her er de anledninger, der oftest betyder noget.",
    sections: [
      {
        heading: "Privat",
        paragraphs: [
          "De fleste af disse er ting, du selv kan genkende uden at åbne en police.",
        ],
        bullets: [
          "Du har skiftet bolig, bygget om eller inddraget kælder eller loft",
          "Der er kommet ny bil — eller en ung bilist på forsikringen",
          "I er flyttet sammen, eller I er blevet flere i husstanden",
          "Der er kommet dyrere elektronik, cykler eller smykker i hjemmet",
          "Du har fået solceller, varmepumpe eller ladestander",
        ],
      },
      {
        heading: "Erhverv",
        paragraphs: [
          "For virksomheder er anledningerne mere målbare — de står som regel allerede i regnskabet.",
        ],
        bullets: [
          "I er blevet flere ansatte, eller lønsummen har ændret sig",
          "Omsætningen er vokset væsentligt",
          "Der er investeret i maskiner, biler eller udstyr",
          "I har fået nye aktiviteter, nye opgavetyper eller nye adresser",
          "En kunde eller et udbud stiller krav til jeres dækning",
        ],
      },
      {
        heading: "Og ellers: med nogle års mellemrum",
        paragraphs: [
          "Selv uden en konkret ændring er det værd at se aftalerne igennem en gang imellem. Både priser og betingelser ændrer sig, og en aftale, der var fornuftig for fem år siden, er ikke nødvendigvis den rigtige i dag.",
          "Det betyder ikke, at du skal skifte noget. Det betyder bare, at valget bliver truffet bevidst.",
        ],
      },
    ],
    relatedProducts: [
      { segment: "privat", slug: "indboforsikring" },
      { segment: "erhverv", slug: "erhvervsforsikring" },
    ],
    relatedGuides: ["hvad-er-underforsikring", "hvad-betyder-selvrisiko"],
  },
  {
    slug: "forskellen-paa-hus-og-indboforsikring",
    title: "Hvad er forskellen på hus- og indboforsikring?",
    summary:
      "Den ene dækker bygningen. Den anden dækker dine ting. Her er den praktiske grænse mellem dem.",
    metaDescription:
      "Husforsikring dækker bygningen, indboforsikring dækker dine ting. Se hvor grænsen går, og hvad der typisk falder imellem de to dækninger.",
    audience: "privat",
    readingMinutes: 3,
    updated: "2026-01-15",
    intro:
      "Det er et af de mest almindelige spørgsmål, og svaret er heldigvis enkelt: husforsikringen dækker selve bygningen, og indboforsikringen dækker det, du ville tage med, hvis du flyttede.",
    sections: [
      {
        heading: "Tommelfingerreglen",
        paragraphs: [
          "Vend huset på hovedet. Det, der falder ud, er indbo. Det, der bliver siddende, er bygning.",
          "Køkkenelementer, gulve, døre og fastmonterede installationer hører til bygningen. Møbler, tøj, elektronik, cykler og køkkengrej er indbo.",
        ],
      },
      {
        heading: "Hvad hvis du bor til leje?",
        paragraphs: [
          "Så er bygningen udlejerens ansvar — du har brug for en indboforsikring, ikke en husforsikring. Indboforsikringen dækker samtidig dit private ansvar, hvis du kommer til at ødelægge noget for andre.",
        ],
      },
      {
        heading: "Det, der falder imellem",
        paragraphs: [
          "Nogle ting er ikke oplagte. Udestuen, carporten, hegnet, terrassen og drivhuset hører typisk til bygningsforsikringen — men kun hvis de rent faktisk står på policen.",
          "Er der bygget til, siden forsikringen blev tegnet, er det den slags, der er værd at få rettet.",
        ],
        bullets: [
          "Udestue, carport og udhus: bygning — hvis de er nævnt",
          "Hårde hvidevarer: som regel bygning, når de er indbygget",
          "Solceller og ladestander: bygning, men skal meldes ind",
        ],
      },
      {
        heading: "Begge dele skal passe til i dag",
        paragraphs: [
          "På husforsikringen er det boligens areal og indretning, der skal være rigtigt. På indboforsikringen er det summen — altså hvad det ville koste at genanskaffe alt, du ejer.",
          "De fleste sætter indbosummen én gang og ser den aldrig igen. Det er som regel der, forskellen på papir og virkelighed er størst.",
        ],
      },
    ],
    relatedProducts: [
      { segment: "privat", slug: "husforsikring" },
      { segment: "privat", slug: "indboforsikring" },
    ],
    relatedGuides: ["hvad-er-underforsikring"],
  },
  {
    slug: "hvad-betyder-selvrisiko",
    title: "Hvad betyder selvrisiko?",
    summary:
      "Beløbet du selv betaler ved en skade — og den knap, der påvirker prisen mest.",
    metaDescription:
      "Selvrisiko forklaret: hvad det betyder, hvordan det påvirker prisen, og hvordan du vælger et niveau, der passer til din økonomi.",
    audience: "begge",
    readingMinutes: 3,
    updated: "2026-01-15",
    intro:
      "Selvrisikoen er det beløb, du selv betaler, når en skade sker. Er selvrisikoen 5.000 kroner, og skaden koster 12.000, får du 7.000 udbetalt.",
    sections: [
      {
        heading: "Hvorfor findes den?",
        paragraphs: [
          "Den holder de helt små skader ude af systemet og gør forsikringen billigere. Jo mere af risikoen du selv tager, jo lavere bliver prisen.",
          "Det er derfor, selvrisiko er det sted, hvor prisen hurtigst kan flyttes — på godt og ondt.",
        ],
      },
      {
        heading: "Hvordan vælger man niveau?",
        paragraphs: [
          "Det handler ikke om, hvad der ser billigst ud på papiret, men om ét spørgsmål: kan du betale beløbet, hvis skaden sker i morgen?",
          "Er svaret nej, er en lav præmie med høj selvrisiko en dårlig handel — for så er forsikringen reelt ikke til rådighed, når du får brug for den.",
        ],
      },
      {
        heading: "Der kan være flere selvrisici",
        paragraphs: [
          "Mange policer har forskellige selvrisici for forskellige skadetyper. Rørskade, glasskade og tyveri kan have hver deres beløb, og nogle dækninger har slet ingen.",
          "Det er værd at kende sine egne tal, inden man har brug for dem.",
        ],
      },
    ],
    relatedProducts: [
      { segment: "privat", slug: "bilforsikring" },
      { segment: "privat", slug: "husforsikring" },
    ],
    relatedGuides: ["hvornaar-boer-forsikringer-gennemgaas"],
  },
  {
    slug: "hvad-er-underforsikring",
    title: "Hvad er underforsikring?",
    summary:
      "Når forsikringssummen er lavere end værdien — og hvorfor det kan koste mere, end forskellen lyder til.",
    metaDescription:
      "Underforsikring forklaret: hvad der sker, når forsikringssummen er sat for lavt, og hvordan erstatningen kan blive nedsat forholdsmæssigt.",
    audience: "begge",
    readingMinutes: 3,
    updated: "2026-01-15",
    intro:
      "Underforsikring betyder, at det, du har forsikret, er mere værd end den sum, der står på policen. Konsekvensen er ikke altid, hvad folk regner med.",
    sections: [
      {
        heading: "Det er ikke bare forskellen, du mangler",
        paragraphs: [
          "Mange tror, at hvis indboet er forsikret for 500.000 kroner, men er 750.000 værd, så mangler man 250.000 ved en totalskade. Det er rigtigt nok i det tilfælde.",
          "Men ved en delskade kan erstatningen blive nedsat forholdsmæssigt. Er der forsikret for to tredjedele af værdien, kan du risikere at få to tredjedele af en skade, der ellers lå langt under summen.",
        ],
      },
      {
        heading: "Hvor opstår det typisk?",
        paragraphs: [
          "Privat er det oftest indbosummen, der ikke er fulgt med — særligt efter en sammenflytning eller et par år med nye anskaffelser.",
          "For virksomheder er det typisk varelager, maskiner og løsøre, der er vokset, uden at policen er rettet.",
        ],
        bullets: [
          "Indbosummen er ikke ændret i flere år",
          "Varelageret svinger meget hen over året",
          "Nye maskiner er købt uden at blive meldt ind",
          "Bygningsværdien er ikke reguleret efter en renovering",
        ],
      },
      {
        heading: "Hvordan undgår man det?",
        paragraphs: [
          "Ved at sætte summen ud fra, hvad det ville koste at genanskaffe tingene i dag — ikke hvad de kostede dengang, og ikke hvad de kunne sælges for brugt.",
          "For virksomheder er det som regel nemmest at koble det til en fast rutine, fx i forbindelse med årsregnskabet.",
        ],
      },
    ],
    relatedProducts: [
      { segment: "privat", slug: "indboforsikring" },
      { segment: "erhverv", slug: "erhvervsforsikring" },
    ],
    relatedGuides: ["forskellen-paa-hus-og-indboforsikring", "hvad-betyder-selvrisiko"],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export function guidesForAudience(audience: "privat" | "erhverv"): Guide[] {
  return guides.filter((g) => g.audience === audience || g.audience === "begge");
}
