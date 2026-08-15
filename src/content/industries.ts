/**
 * Industry taxonomy for /brancher.
 *
 * Industry pages exist to be genuinely useful: they describe the risks that are
 * typical for the trade and which insurance areas are worth checking. They must
 * not present insurance requirements as universal legal facts — only
 * arbejdsskadeforsikring is stated as lovpligtig, because it is.
 */

export type Industry = {
  slug: string;
  /** Label in navigation and funnel select. */
  name: string;
  title: string;
  summary: string;
  metaDescription: string;
  /** Risks that are typical — described concretely, not dramatised. */
  risks: { title: string; body: string }[];
  /** Product slugs (from products.ts) worth reviewing for this industry. */
  relevantProducts: string[];
  /** Extra areas that are not standalone products in our taxonomy. */
  additionalAreas: string[];
  /** Concrete changes that usually mean the cover no longer fits. */
  changeTriggers: string[];
};

export const industries: Industry[] = [
  {
    slug: "haandvaerkere",
    name: "Håndværkere",
    title: "Forsikring til håndværkere",
    summary:
      "Håndværksvirksomheder har værdier i bilen, ansatte på skiftende arbejdssteder og ansvar for arbejde hos kunden. Tre ting, der sjældent står i én aftale.",
    metaDescription:
      "Hvilke forsikringer bør en håndværkervirksomhed overveje? Se de typiske områder — arbejdsskade, ansvar, værktøj, biler og maskiner — og hvornår aftalen bør gennemgås.",
    risks: [
      {
        title: "Skade på kundens ting under arbejdet",
        body: "En vandskade i en kundes bolig eller en beskadiget installation bliver hurtigt et krav mod virksomheden. Det er erhvervsansvaret, der skal stå for den type krav.",
      },
      {
        title: "Værktøj og udstyr i bilen",
        body: "Værktøj i en varebil er ikke automatisk dækket af bilforsikringen. Beløbsgrænser og krav til, hvordan bilen er låst og placeret om natten, er værd at kende.",
      },
      {
        title: "Ansatte på skiftende arbejdssteder",
        body: "Arbejdsskadeforsikring er lovpligtig, når virksomheden har ansatte. Både antal ansatte og lønsum skal være opdateret på aftalen.",
      },
      {
        title: "Maskiner og materiel på pladsen",
        body: "Maskiner, stilladser og materialer, der står på en byggeplads, kræver ofte en anden dækning end det, der står i firmaets lokaler.",
      },
    ],
    relevantProducts: [
      "arbejdsskadeforsikring",
      "erhvervsansvar",
      "biler-og-transport",
      "erhvervsforsikring",
    ],
    additionalAreas: [
      "Værktøjsforsikring",
      "Maskiner og materiel",
      "Løsøre på arbejdsstedet",
      "Entrepriserelaterede forhold ved større opgaver",
    ],
    changeTriggers: [
      "I har ansat flere svende eller taget lærlinge ind",
      "Bilparken er udvidet, eller der er kommet dyrere værktøj i bilerne",
      "I tager større opgaver end tidligere",
      "En bygherre stiller krav til jeres dækningssum",
      "I er begyndt på nye fagområder",
    ],
  },
  {
    slug: "restauranter",
    name: "Restauranter",
    title: "Forsikring til restauranter og caféer",
    summary:
      "Køkken, gæster og varelager samlet ét sted. Et driftsstop rammer omsætningen med det samme, fordi der ikke er noget lager at sælge fra.",
    metaDescription:
      "Hvilke forsikringer bør en restaurant eller café overveje? Se typiske områder — ansvar, arbejdsskade, løsøre, driftstab og køle-/frostvarer.",
    risks: [
      {
        title: "Brand og vandskade i køkkenet",
        body: "Køkkener har koncentreret risiko for brand. Ud over skaden på inventaret stopper driften, indtil køkkenet fungerer igen.",
      },
      {
        title: "Driftsstop rammer omsætningen straks",
        body: "En restaurant kan ikke sælge fra lager. Dækningsperioden på driftstab bør svare til den tid, det reelt tager at åbne igen.",
      },
      {
        title: "Ansvar over for gæster",
        body: "Gæster kommer til skade, og garderobe eller ejendele forsvinder. Det er ansvarsdækningen, der bliver relevant.",
      },
      {
        title: "Køle- og frostvarer",
        body: "Et strømsvigt eller et defekt køleanlæg kan koste et helt varelager. Dækningen for fordærvede varer er et selvstændigt punkt.",
      },
    ],
    relevantProducts: [
      "erhvervsansvar",
      "arbejdsskadeforsikring",
      "driftstab",
      "bygninger",
      "erhvervsforsikring",
    ],
    additionalAreas: [
      "Løsøre og inventar",
      "Køle- og frostvarer",
      "Glas og skilte",
      "Kontanter og betalingsudstyr",
    ],
    changeTriggers: [
      "I har åbnet endnu en afdeling",
      "Køkkenet eller inventaret er blevet renoveret",
      "I er begyndt med take-away eller udbringning",
      "Antallet af ansatte svinger meget hen over året",
      "Omsætningen har ændret sig væsentligt",
    ],
  },
  {
    slug: "transport",
    name: "Transport",
    title: "Forsikring til transportvirksomheder",
    summary:
      "Køretøjerne er selve driften, og godset i bilen er sjældent dækket af bilforsikringen. To dækninger, der ofte forveksles.",
    metaDescription:
      "Hvilke forsikringer bør en vognmand eller transportvirksomhed overveje? Se typiske områder — køretøjer, gods, ansvar, arbejdsskade og driftstab.",
    risks: [
      {
        title: "Gods under transport",
        body: "Bilens kaskoforsikring dækker bilen, ikke varerne i den. Godsansvar og varedækning er selvstændige aftaler med egne summer.",
      },
      {
        title: "Nedbrud på et køretøj stopper opgaver",
        body: "Er der få biler, betyder ét langvarigt nedbrud tabte ture. Det er værd at kende dækningen for driftstab og erstatningskøretøj.",
      },
      {
        title: "Chauffører og arbejdsskader",
        body: "Læsning og aflæsning er de situationer, hvor skaderne oftest sker. Arbejdsskadeforsikringen er lovpligtig, når der er ansatte.",
      },
      {
        title: "Ansvar over for kunder",
        body: "Skader ved levering, på lageret eller hos modtageren bliver et krav mod virksomheden.",
      },
    ],
    relevantProducts: [
      "biler-og-transport",
      "arbejdsskadeforsikring",
      "erhvervsansvar",
      "driftstab",
      "erhvervsforsikring",
    ],
    additionalAreas: [
      "Godsansvar",
      "Vareforsikring under transport",
      "Trailere og påhængsmateriel",
      "Lager og terminal",
    ],
    changeTriggers: [
      "I har købt flere biler eller trailere",
      "I kører nye typer gods eller nye ruter",
      "I er begyndt at køre i udlandet",
      "I har fået flere chauffører ansat",
      "En kunde stiller krav til godsansvaret",
    ],
  },
  {
    slug: "ejendom",
    name: "Ejendom",
    title: "Forsikring til ejendomme og udlejning",
    summary:
      "Ejendomme rummer både bygningsværdi og lejeindtægt. Ombygninger og ændret brug af lokalerne påvirker begge dele.",
    metaDescription:
      "Hvilke forsikringer bør en ejendomsejer eller udlejer overveje? Se typiske områder — bygninger, ansvar som ejer, huslejetab og installationer.",
    risks: [
      {
        title: "Skade på bygningen",
        body: "Brand, storm og vandskade er de store poster. Er bygningens værdi ikke opdateret, passer erstatningen ikke til genopførelsen.",
      },
      {
        title: "Tabt lejeindtægt",
        body: "Kan lejemålet ikke bruges efter en skade, stopper indtægten, mens udgifterne løber. Huslejetab er en selvstændig dækning.",
      },
      {
        title: "Ansvar som ejer",
        body: "Glatte fortove, løse fliser og faldende tagsten kan medføre krav mod ejeren af ejendommen.",
      },
      {
        title: "Rør og skjulte installationer",
        body: "Ældre rørinstallationer er en typisk skadesårsag. Om skjulte rør og kabler er med i dækningen, er værd at få bekræftet.",
      },
    ],
    relevantProducts: ["bygninger", "erhvervsansvar", "driftstab", "erhvervsforsikring"],
    additionalAreas: [
      "Huslejetab",
      "Skjulte rør og kabler",
      "Glas og sanitet",
      "Bestyrelsesansvar i foreninger",
    ],
    changeTriggers: [
      "I har købt eller solgt ejendomme",
      "Lokaler er gået fra bolig til erhverv eller omvendt",
      "Der er lavet tag-, facade- eller installationsrenovering",
      "Der er kommet solceller eller ladestandere på ejendommen",
      "Bygningsværdien er ikke reguleret i flere år",
    ],
  },
  {
    slug: "landbrug",
    name: "Landbrug",
    title: "Forsikring til landbrug",
    summary:
      "Landbrug samler driftsbygninger, maskiner, besætning og afgrøder i én virksomhed — med hver deres dækning og hver deres sum.",
    metaDescription:
      "Hvilke forsikringer bør et landbrug overveje? Se typiske områder — bygninger, maskiner, besætning, ansvar og driftstab.",
    risks: [
      {
        title: "Brand i driftsbygninger",
        body: "Bygninger med foder, halm og maskiner er en samlet risiko. Både bygning og indhold har hver sin sum på policen.",
      },
      {
        title: "Maskiner og teknik",
        body: "Moderne landbrugsmaskiner repræsenterer store værdier, og et nedbrud i sæsonen har konsekvenser ud over selve reparationen.",
      },
      {
        title: "Besætning",
        body: "Sygdom, strømsvigt i staldanlæg og ventilationssvigt kan ramme besætningen. Dækningen afhænger af den enkelte aftale.",
      },
      {
        title: "Ansatte og maskinstation",
        body: "Er der ansatte eller indlejet hjælp, gælder arbejdsskadeforsikringen. Arbejde for andre kan også udløse ansvar.",
      },
    ],
    relevantProducts: [
      "bygninger",
      "arbejdsskadeforsikring",
      "erhvervsansvar",
      "driftstab",
      "erhvervsforsikring",
    ],
    additionalAreas: [
      "Maskiner og redskaber",
      "Besætning",
      "Afgrøder og lager",
      "Løsøre i driftsbygninger",
    ],
    changeTriggers: [
      "I har købt jord, bygninger eller nye maskiner",
      "Produktionen er lagt om",
      "Der er kommet solceller eller biogasanlæg til",
      "I udfører arbejde for andre landbrug",
      "Besætningens størrelse har ændret sig",
    ],
  },
  {
    slug: "butikker",
    name: "Butikker",
    title: "Forsikring til butikker",
    summary:
      "Varelageret er butikkens største aktiv, og en lukket butik sælger ingenting. Tyveri, brand og driftsstop hænger sammen.",
    metaDescription:
      "Hvilke forsikringer bør en butik overveje? Se typiske områder — varelager, ansvar, driftstab, glas og betalingsudstyr.",
    risks: [
      {
        title: "Varelager ved brand, vand og tyveri",
        body: "Varelagerets værdi svinger hen over året. Er summen sat efter en stille måned, passer den ikke i højsæsonen.",
      },
      {
        title: "Lukket butik betyder tabt omsætning",
        body: "Efter en skade tager det tid at rydde op og få varer hjem igen. Driftstabsdækningens periode bør svare til det.",
      },
      {
        title: "Kunder i butikken",
        body: "Fald, væltede reoler og skader på kunders ting er ansvarsdækningens område.",
      },
      {
        title: "Ruder, skilte og betalingsudstyr",
        body: "Facaderuder og terminaler er en hyppig skadespost, og de er ikke altid en del af grundaftalen.",
      },
    ],
    relevantProducts: ["erhvervsansvar", "driftstab", "bygninger", "erhvervsforsikring"],
    additionalAreas: [
      "Varelager",
      "Glas og skilte",
      "Kontanter og betalingsudstyr",
      "Webshop og onlinesalg",
    ],
    changeTriggers: [
      "I har åbnet flere butikker",
      "Varelageret er vokset, eller varegruppen har ændret sig",
      "I er startet med webshop",
      "I har fået flere ansatte",
      "Butikken er blevet ombygget",
    ],
  },
  {
    slug: "kontor",
    name: "Kontor og service",
    title: "Forsikring til kontor- og servicevirksomheder",
    summary:
      "Værdien ligger i medarbejdere, data og rådgivning frem for i maskiner. Det flytter tyngden til ansvar, cyber og driftsstop.",
    metaDescription:
      "Hvilke forsikringer bør en kontor- eller servicevirksomhed overveje? Se typiske områder — ansvar, arbejdsskade, IT og cyber, løsøre og driftstab.",
    risks: [
      {
        title: "Ansvar for det leverede arbejde",
        body: "Rådgivning og serviceydelser kan medføre krav, hvis kunden lider et tab. Hvad aftalen dækker afhænger af ydelsens karakter.",
      },
      {
        title: "IT-nedbrud og databrud",
        body: "Ligger systemerne ned, stopper arbejdet. Behandler I persondata, følger der desuden pligter med, når data slipper ud.",
      },
      {
        title: "Inventar og IT-udstyr",
        body: "Computere, skærme og serverudstyr udgør ofte en større samlet værdi end forventet.",
      },
      {
        title: "Ansatte",
        body: "Arbejdsskadeforsikring er lovpligtig, når der er ansatte — også på et kontor.",
      },
    ],
    relevantProducts: [
      "erhvervsansvar",
      "arbejdsskadeforsikring",
      "cyberforsikring",
      "driftstab",
      "erhvervsforsikring",
    ],
    additionalAreas: [
      "Løsøre og IT-udstyr",
      "Netbank og betalingsbedrageri",
      "Udstyr, medarbejdere har med hjemme",
      "Bestyrelses- og ledelsesansvar",
    ],
    changeTriggers: [
      "I er blevet flere medarbejdere",
      "I er flyttet til nye lokaler",
      "I arbejder med kundedata i større omfang",
      "I har fået nye ydelser eller nye typer kunder",
      "Medarbejdere arbejder fast hjemmefra med firmaudstyr",
    ],
  },
  {
    slug: "produktion",
    name: "Produktion",
    title: "Forsikring til produktionsvirksomheder",
    summary:
      "Produktionsudstyr, varelager og leveringsaftaler hænger sammen. Står én maskine stille, forplanter det sig til hele kæden.",
    metaDescription:
      "Hvilke forsikringer bør en produktionsvirksomhed overveje? Se typiske områder — maskiner, bygninger, produktansvar, driftstab og arbejdsskade.",
    risks: [
      {
        title: "Maskinskade og nøglemaskiner",
        body: "Er produktionen afhængig af enkelte maskiner, betyder leveringstiden på reservedele lige så meget som selve reparationen.",
      },
      {
        title: "Produktansvar",
        body: "Sælger virksomheden fysiske produkter, kan et fejlbehæftet produkt medføre krav fra kunder og slutbrugere.",
      },
      {
        title: "Driftstab i en leveringskæde",
        body: "Et stop rammer også kontrakter og kunder. Dækningsperioden bør afspejle, hvor lang tid genopstart reelt tager.",
      },
      {
        title: "Arbejdsmiljø og ansatte",
        body: "Arbejde med maskiner og tunge emner giver en anden skadesprofil end kontorarbejde.",
      },
    ],
    relevantProducts: [
      "erhvervsansvar",
      "arbejdsskadeforsikring",
      "driftstab",
      "bygninger",
      "erhvervsforsikring",
    ],
    additionalAreas: [
      "Maskiner og maskinkasko",
      "Produktansvar og tilbagekaldelse",
      "Varelager og råvarer",
      "Transport af færdigvarer",
    ],
    changeTriggers: [
      "I har investeret i nye maskiner eller ny produktionslinje",
      "Omsætningen eller produktionsvolumen er steget",
      "I er begyndt at eksportere",
      "I producerer nye produkttyper",
      "I har fået flere ansatte i produktionen",
    ],
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}

/** Options for the funnel's industry select, plus a fallback. */
export const industryFunnelOptions = [
  ...industries.map((i) => ({ value: i.slug, label: i.name })),
  { value: "andet", label: "Anden branche" },
];

export const validIndustryValues = new Set<string>(
  industryFunnelOptions.map((o) => o.value),
);
