/**
 * Insurance product taxonomy.
 *
 * This is the single source of truth for:
 *  - the /privat and /erhverv route trees
 *  - navigation and footer links
 *  - the multi-select options in the lead funnel
 *  - sitemap entries and internal linking
 *
 * Adding a product here creates its page, its funnel option and its sitemap
 * entry. Content is written for people, not for insurance professionals.
 */

export type Segment = "privat" | "erhverv";

export type Product = {
  slug: string;
  segment: Segment;
  /** Short label used in funnel checkboxes and category grids. */
  name: string;
  /** Page H1. */
  title: string;
  /** One sentence, plain Danish, used in cards and meta description. */
  summary: string;
  metaDescription: string;
  /** What the insurance area typically covers. Descriptive, never a promise. */
  covers: string[];
  /** Concrete situations where a review is usually relevant. */
  reviewTriggers: string[];
  /** Questions the reader should be able to answer about their own policy. */
  checkYourself: string[];
  /** Slugs of related products for internal linking. */
  related: string[];
};

export const privateProducts: Product[] = [
  {
    slug: "bilforsikring",
    segment: "privat",
    name: "Bil",
    title: "Bilforsikring",
    summary:
      "Bilforsikringen er ofte den, der ændrer sig mest — ny bil, færre kilometer eller en ny bilist i husstanden ændrer både pris og behov.",
    metaDescription:
      "Få gennemgået din bilforsikring. Se hvad ansvar, kasko og tilvalg dækker, og hvornår det giver mening at kigge aftalen igennem.",
    covers: [
      "Ansvarsforsikring, som er lovpligtig for alle biler",
      "Kaskoforsikring, der dækker skader på din egen bil",
      "Tilvalg som vejhjælp, friskadedækning og udvidet glasdækning",
      "Førerulykkesforsikring, hvis den er tilkøbt",
    ],
    reviewTriggers: [
      "Du har skiftet bil, eller bilen er blevet ældre",
      "Du kører markant færre eller flere kilometer end da aftalen blev lavet",
      "En ung bilist er kommet på forsikringen",
      "Du betaler for vejhjælp både på forsikringen og gennem en anden aftale",
      "Selvrisikoen passer ikke længere til din økonomi",
    ],
    checkYourself: [
      "Hvor høj er din selvrisiko, og kan du betale den, hvis skaden sker i morgen?",
      "Har du kasko på en bil, hvor kaskodækningen fylder meget af bilens værdi?",
      "Betaler du for vejhjælp to steder?",
      "Er det årlige kilometertal på aftalen stadig rigtigt?",
    ],
    related: ["indboforsikring", "ulykkesforsikring"],
  },
  {
    slug: "husforsikring",
    segment: "privat",
    name: "Hus",
    title: "Husforsikring",
    summary:
      "Husforsikringen følger boligen, ikke dine ting. Bygger du om, får du solceller eller ny tagbelægning, ændrer behovet sig.",
    metaDescription:
      "Få gennemgået din husforsikring. Se hvad bygningsdækningen typisk omfatter, og hvornår ombygning eller nye installationer bør give et gennemsyn.",
    covers: [
      "Skader på selve bygningen efter brand, storm eller vandskade",
      "Rørskade og skjulte rør og kabler, hvis dækningen er tilkøbt",
      "Svamp og insektangreb på de dele af bygningen, aftalen omfatter",
      "Udvidet dækning på fx glas, sanitet og el-skade",
    ],
    reviewTriggers: [
      "Du har bygget til, bygget om eller inddraget kælder eller loft",
      "Der er kommet solceller, varmepumpe eller ladestander på ejendommen",
      "Taget, badeværelset eller installationerne er blevet renoveret",
      "Du har købt boligen inden for det seneste år og overtog den gamle aftale",
      "Der står bygninger på grunden, som ikke er nævnt i policen",
    ],
    checkYourself: [
      "Står boligens rigtige areal på policen?",
      "Er udestue, carport og udhus med i dækningen?",
      "Har du dækning for skjulte rør og kabler?",
      "Ved du, hvad din husforsikring ikke dækker?",
    ],
    related: ["indboforsikring", "ulykkesforsikring"],
  },
  {
    slug: "indboforsikring",
    segment: "privat",
    name: "Indbo",
    title: "Indboforsikring",
    summary:
      "Indboforsikringen dækker dine ting — ikke bygningen. Den er også den, hvor summen oftest er sat for mange år siden.",
    metaDescription:
      "Få gennemgået din indboforsikring. Se hvordan indbosummen fastsættes, hvad ansvar og retshjælp betyder, og hvornår du bør tjekke dækningen.",
    covers: [
      "Dine indbo­genstande ved fx brand, tyveri og vandskade",
      "Privat ansvar, hvis du kommer til at skade andres ting eller person",
      "Retshjælp ved visse private tvister",
      "Tilvalg som elektronikdækning, cykel og udvidet rejsedækning",
    ],
    reviewTriggers: [
      "I er flyttet sammen eller flyttet fra hinanden",
      "Der er kommet dyrere elektronik, cykler eller smykker i hjemmet",
      "Du har fået børn, eller børnene er flyttet hjemmefra",
      "Indbosummen er ikke ændret i flere år",
      "Du har en rejsedækning både her og på et kreditkort",
    ],
    checkYourself: [
      "Hvad ville det koste at genanskaffe alt dit indbo i dag?",
      "Er de dyre enkeltting inden for policens beløbsgrænser?",
      "Er dine cykler dækket, og op til hvilket beløb?",
      "Har du dobbelt rejsedækning gennem kort eller forening?",
    ],
    related: ["husforsikring", "rejseforsikring"],
  },
  {
    slug: "ulykkesforsikring",
    segment: "privat",
    name: "Ulykke",
    title: "Ulykkesforsikring",
    summary:
      "En ulykkesforsikring handler om varige følger efter en ulykke. Dækningen på arbejdet erstatter sjældent den private.",
    metaDescription:
      "Få gennemgået din ulykkesforsikring. Se hvad dækningssum og méngrad betyder, og hvorfor arbejdsskadeforsikringen ikke dækker fritiden.",
    covers: [
      "Varigt mén efter en ulykke, opgjort som en procentdel af dækningssummen",
      "Behandlingsudgifter, hvis det indgår i aftalen",
      "Tandskade efter ulykke i det omfang, policen omfatter det",
      "Dødsfaldsdækning, hvis den er valgt til",
    ],
    reviewTriggers: [
      "Din dækningssum er den samme som for mange år siden",
      "Du har skiftet job til noget mere fysisk",
      "Du dyrker en sport, som kan være undtaget i aftalen",
      "Du har kun en dækning gennem arbejdet",
      "Børnene er ikke omfattet af en selvstændig dækning",
    ],
    checkYourself: [
      "Hvor stor er din dækningssum, og hvad ville 15 procent mén betyde i kroner?",
      "Dækker aftalen både arbejde og fritid?",
      "Er dine fritidsaktiviteter undtaget?",
      "Har børnene deres egen ulykkesforsikring?",
    ],
    related: ["sundhedsforsikring", "indboforsikring"],
  },
  {
    slug: "rejseforsikring",
    segment: "privat",
    name: "Rejse",
    title: "Rejseforsikring",
    summary:
      "Rejsedækning findes ofte flere steder på én gang — i indboforsikringen, på kreditkortet og i en selvstændig police.",
    metaDescription:
      "Få gennemgået din rejseforsikring. Se forskellen på det blå kort, kreditkortdækning og en selvstændig rejseforsikring.",
    covers: [
      "Sygdom og hjemtransport under rejsen",
      "Afbestilling før afrejse, hvis dækningen er tilkøbt",
      "Bagage og forsinkelse i det omfang, aftalen omfatter det",
      "Rejseansvar og i nogle aftaler erstatningsrejse",
    ],
    reviewTriggers: [
      "Du rejser uden for Europa",
      "Du har både kortdækning og rejsedækning på indboforsikringen",
      "Rejsen er længere end det antal dage, aftalen dækker",
      "Du rejser med udstyr, der er mere værd end bagagegrænsen",
      "Du har en kronisk sygdom, der kræver forhåndsgodkendelse",
    ],
    checkYourself: [
      "Hvor mange dage dækker din rejseforsikring pr. rejse?",
      "Dækker den uden for Europa?",
      "Har du afbestillingsdækning — og fra hvornår gælder den?",
      "Betaler du for den samme dækning to steder?",
    ],
    related: ["indboforsikring", "sundhedsforsikring"],
  },
  {
    slug: "sundhedsforsikring",
    segment: "privat",
    name: "Sundhed",
    title: "Sundhedsforsikring",
    summary:
      "En sundhedsforsikring giver adgang til behandling i det private. Mange har den gennem arbejdet uden at kende indholdet.",
    metaDescription:
      "Få gennemgået din sundhedsforsikring. Se hvad behandlingsdækning typisk omfatter, og hvad der sker med dækningen, hvis du skifter job.",
    covers: [
      "Undersøgelse og behandling på privathospital efter henvisning",
      "Fysioterapi, kiropraktik og lignende behandlere i det aftalte omfang",
      "Psykologhjælp, hvis det indgår i aftalen",
      "Genoptræning efter behandling",
    ],
    reviewTriggers: [
      "Du har en ordning gennem arbejdet og kender ikke indholdet",
      "Du skifter job eller bliver selvstændig",
      "Familien er ikke omfattet af din ordning",
      "Du er i tvivl, om eksisterende lidelser er undtaget",
    ],
    checkYourself: [
      "Kræver behandlingen henvisning fra egen læge?",
      "Er der ventetid, før dækningen træder i kraft?",
      "Følger ordningen med, hvis du skifter job?",
      "Er ægtefælle og børn omfattet?",
    ],
    related: ["ulykkesforsikring"],
  },
];

export const businessProducts: Product[] = [
  {
    slug: "erhvervsforsikring",
    segment: "erhverv",
    name: "Samlet erhvervsforsikring",
    title: "Erhvervsforsikring",
    summary:
      "De fleste virksomheder har flere aftaler, der er lavet på forskellige tidspunkter. Et samlet overblik viser, hvor der mangler noget, og hvor der betales dobbelt.",
    metaDescription:
      "Få gennemgået virksomhedens forsikringer samlet. Se de typiske områder — ansvar, arbejdsskade, løsøre, biler, driftstab og cyber — og hvad de dækker.",
    covers: [
      "Erhvervsansvar over for kunder og tredjepart",
      "Arbejdsskadeforsikring for ansatte",
      "Løsøre, maskiner, værktøj og varelager",
      "Bygninger, biler og driftstab afhængigt af virksomheden",
    ],
    reviewTriggers: [
      "Virksomheden har fået flere ansatte",
      "Omsætningen eller aktiviteterne har ændret sig",
      "I har investeret i nye maskiner eller nyt udstyr",
      "I er flyttet eller har fået flere adresser",
      "Aftalerne er tegnet på forskellige tidspunkter hos forskellige selskaber",
    ],
    checkYourself: [
      "Ved I, hvilke aftaler virksomheden har i dag, og hvad de dækker?",
      "Passer forsikringssummerne til de nuværende værdier?",
      "Er alle aktiviteter i virksomheden nævnt i policerne?",
      "Er der områder, ingen har taget stilling til?",
    ],
    related: ["erhvervsansvar", "arbejdsskadeforsikring", "driftstab"],
  },
  {
    slug: "arbejdsskadeforsikring",
    segment: "erhverv",
    name: "Arbejdsskade",
    title: "Arbejdsskadeforsikring",
    summary:
      "Har virksomheden ansatte, er arbejdsskadeforsikring lovpligtig. Den dækker personskade, ikke skader på ting.",
    metaDescription:
      "Få gennemgået virksomhedens arbejdsskadeforsikring. Se hvad den lovpligtige dækning omfatter, og hvornår antal ansatte og lønsum bør opdateres.",
    covers: [
      "Arbejdsulykker, der rammer virksomhedens ansatte",
      "Erhvervssygdomme i det omfang, loven omfatter dem",
      "Tab af erhvervsevne og godtgørelse for varigt mén",
      "Behandlingsudgifter i forbindelse med en anerkendt skade",
    ],
    reviewTriggers: [
      "I har ansat flere medarbejdere",
      "Lønsummen er ændret siden aftalen blev oprettet",
      "I bruger vikarer, elever eller løst tilknyttede",
      "Arbejdsopgaverne er blevet mere fysiske eller foregår nye steder",
    ],
    checkYourself: [
      "Er antal ansatte og lønsum på policen opdateret?",
      "Er indehaver og medarbejdende ægtefælle omfattet, hvis det ønskes?",
      "Er alle arbejdssteder registreret?",
    ],
    related: ["erhvervsansvar", "erhvervsforsikring"],
  },
  {
    slug: "erhvervsansvar",
    segment: "erhverv",
    name: "Erhvervsansvar",
    title: "Erhvervsansvarsforsikring",
    summary:
      "Erhvervsansvar dækker, når virksomheden bliver ansvarlig for skade på andres person eller ting under arbejdet.",
    metaDescription:
      "Få gennemgået virksomhedens erhvervsansvarsforsikring. Se forskellen på erhvervsansvar og produktansvar, og hvornår dækningen bør opdateres.",
    covers: [
      "Skade på andres ting under udførelsen af arbejdet",
      "Personskade, virksomheden bliver ansvarlig for",
      "Produktansvar, hvis det indgår i aftalen",
      "Sagsomkostninger i forbindelse med et rejst krav",
    ],
    reviewTriggers: [
      "Virksomheden har fået nye opgavetyper eller nye brancheområder",
      "I arbejder på større projekter end tidligere",
      "En kunde eller et udbud stiller krav til dækningssummen",
      "I er begyndt at sælge eller producere fysiske produkter",
    ],
    checkYourself: [
      "Hvad er dækningssummen, og passer den til jeres største opgaver?",
      "Er alle virksomhedens aktiviteter beskrevet i policen?",
      "Er produktansvar med, hvis I sælger produkter?",
    ],
    related: ["arbejdsskadeforsikring", "erhvervsforsikring"],
  },
  {
    slug: "driftstab",
    segment: "erhverv",
    name: "Driftstab",
    title: "Driftstabsforsikring",
    summary:
      "Driftstab dækker den indtjening, virksomheden mister, mens den ikke kan arbejde efter en skade.",
    metaDescription:
      "Få gennemgået virksomhedens driftstabsforsikring. Se hvordan dækningsperiode og dækningsbidrag fastsættes, og hvornår tallene bør opdateres.",
    covers: [
      "Tabt dækningsbidrag efter en dækningsberettiget skade",
      "Faste omkostninger, der løber videre under stilstand",
      "Meromkostninger ved at holde driften i gang, hvis det indgår",
      "Aftalt dækningsperiode, typisk opgjort i måneder",
    ],
    reviewTriggers: [
      "Omsætningen er vokset siden aftalen blev lavet",
      "Virksomheden er afhængig af enkelte maskiner eller ét lokale",
      "I ville have brug for lang tid til at komme i gang igen efter en brand",
      "Dækningsperioden er sat til det korteste alternativ",
    ],
    checkYourself: [
      "Hvor længe ville det reelt tage at være i normal drift igen?",
      "Er dækningsperioden lang nok til det?",
      "Er dækningsbidraget opgjort ud fra aktuelle tal?",
    ],
    related: ["erhvervsforsikring", "bygninger"],
  },
  {
    slug: "cyberforsikring",
    segment: "erhverv",
    name: "Cyber",
    title: "Cyberforsikring",
    summary:
      "Cyberforsikring handler om driftsstop, datatab og de omkostninger, der følger efter et angreb eller et databrud.",
    metaDescription:
      "Få gennemgået virksomhedens cyberforsikring. Se hvad dækningen typisk omfatter ved hackerangreb, datatab og driftsstop.",
    covers: [
      "Assistance til at genetablere systemer og data efter et angreb",
      "Driftstab som følge af nedbrud, hvis det indgår i aftalen",
      "Ansvar over for tredjepart efter et databrud",
      "Rådgivning om anmeldelse og håndtering af persondatabrud",
    ],
    reviewTriggers: [
      "Virksomheden behandler kundedata eller persondata",
      "Driften stopper, hvis IT-systemerne ligger ned",
      "I tager imod betalinger eller ordrer online",
      "I har ingen aftale om, hvem der hjælper, når noget går galt",
    ],
    checkYourself: [
      "Hvor længe kan virksomheden fungere uden IT?",
      "Hvem ringer I til den dag, systemerne er låst?",
      "Hvilke data ville det være alvorligt at miste eller lække?",
    ],
    related: ["driftstab", "erhvervsforsikring"],
  },
  {
    slug: "bygninger",
    segment: "erhverv",
    name: "Bygninger",
    title: "Erhvervsbygninger",
    summary:
      "Bygningsforsikringen følger ejendommen. Om- og tilbygninger, nye installationer og ændret brug påvirker dækningen.",
    metaDescription:
      "Få gennemgået forsikringen på virksomhedens bygninger. Se hvad bygningsdækning typisk omfatter, og hvornår ændringer bør meldes ind.",
    covers: [
      "Brand-, storm- og vandskade på bygningen",
      "Installationer, der hører til ejendommen",
      "Glas og sanitet i det omfang, aftalen omfatter det",
      "Udvidelser som fx svamp, insekt eller rørskade",
    ],
    reviewTriggers: [
      "I har bygget til eller ændret brugen af lokalerne",
      "Der er kommet solceller, ladestandere eller nye installationer",
      "I er flyttet eller har lejet flere lokaler",
      "Bygningens værdi er ikke opdateret i flere år",
    ],
    checkYourself: [
      "Er alle bygninger og arealer med i policen?",
      "Passer beskrivelsen af, hvad bygningen bruges til?",
      "Er lejede lokaler dækket der, hvor I har ansvaret?",
    ],
    related: ["driftstab", "erhvervsforsikring"],
  },
  {
    slug: "biler-og-transport",
    segment: "erhverv",
    name: "Biler og transport",
    title: "Erhvervsbiler og transport",
    summary:
      "Firmabiler, varebiler og transporteret gods er tre forskellige dækninger. Godset er sjældent dækket af bilens forsikring.",
    metaDescription:
      "Få gennemgået virksomhedens bil- og transportforsikringer. Se forskellen på ansvar, kasko, gods og værktøj i bilen.",
    covers: [
      "Ansvar og kasko på virksomhedens køretøjer",
      "Varer og gods under transport, hvis dækningen er tegnet",
      "Værktøj og udstyr i bilen i det omfang, det er omfattet",
      "Tilvalg som vejhjælp og førerulykke",
    ],
    reviewTriggers: [
      "Bilparken er vokset eller udskiftet",
      "I transporterer varer eller udstyr for kunder",
      "Der ligger dyrt værktøj i bilerne om natten",
      "Flere medarbejdere kører i de samme biler",
    ],
    checkYourself: [
      "Er værktøjet i bilen dækket — og for hvor meget?",
      "Har I dækning for det gods, I transporterer?",
      "Er alle køretøjer med på aftalen?",
    ],
    related: ["erhvervsforsikring", "erhvervsansvar"],
  },
];

export const allProducts: Product[] = [...privateProducts, ...businessProducts];

export function getProduct(segment: Segment, slug: string): Product | undefined {
  return allProducts.find((p) => p.segment === segment && p.slug === slug);
}

export function productsBySegment(segment: Segment): Product[] {
  return allProducts.filter((p) => p.segment === segment);
}

/** Options rendered in the lead funnel's product multi-select. */
export const privateFunnelOptions = [
  ...privateProducts.map((p) => ({ value: p.slug, label: p.name })),
  { value: "andet", label: "Andet" },
];

export const businessFunnelOptions = [
  { value: "arbejdsskadeforsikring", label: "Arbejdsskade" },
  { value: "erhvervsansvar", label: "Ansvar" },
  { value: "biler-og-transport", label: "Biler og transport" },
  { value: "bygninger", label: "Bygninger" },
  { value: "loesoere", label: "Løsøre og maskiner" },
  { value: "driftstab", label: "Driftstab" },
  { value: "cyberforsikring", label: "Cyber" },
  { value: "andet", label: "Andet" },
];

/** Every valid product value the funnel may submit. Used by the zod schema. */
export const validFunnelProductValues = new Set<string>([
  ...privateFunnelOptions.map((o) => o.value),
  ...businessFunnelOptions.map((o) => o.value),
]);
