import { siteConfig, reviewIsDocumentedFree } from "@/config/site";

export type FaqItem = { question: string; answer: string };

/**
 * FAQ built from the objections that actually stop people from starting:
 * cost, commitment, time, effort and what happens to their data.
 *
 * Answers must stay true regardless of which providers we work with — see
 * `siteConfig.businessModel`. Nothing here claims market-wide comparison.
 */
export const generalFaq: FaqItem[] = [
  {
    question: "Koster det noget at få gennemgået mine forsikringer?",
    answer: reviewIsDocumentedFree
      ? "Nej. Gennemgangen er gratis og uforpligtende. Du betaler først noget, hvis du selv vælger at tegne en forsikring gennem os."
      : "Du får prisen at vide, inden vi går i gang. Du forpligter dig ikke til noget ved at bede om en gennemgang.",
  },
  {
    question: "Er jeg bundet til at skifte forsikring bagefter?",
    answer:
      "Nej. Du får en gennemgang af det, du har i dag, og hvad der eventuelt kan ændres. Hvad du gør derefter, bestemmer du helt selv.",
  },
  {
    question: "Hvor lang tid tager det?",
    answer:
      "At udfylde forsikringstjekket tager typisk to til tre minutter. Selve samtalen med en rådgiver tager som regel 20–30 minutter, afhængigt af hvor mange forsikringer du har.",
  },
  {
    question: "Hvad skal jeg have klar?",
    answer:
      "Ikke noget for at komme i gang. Har du dine nuværende policer eller en oversigt fra dit selskab ved hånden til samtalen, kan vi nå længere — men det er ikke et krav.",
  },
  {
    question: "Kan I også hjælpe med virksomhedens forsikringer?",
    answer:
      "Ja. Vælg “Min virksomheds forsikringer”, når du starter tjekket, så tilpasses spørgsmålene til virksomheden — fx ansatte, biler, bygninger, driftstab og ansvar.",
  },
  {
    question: "Hvordan behandler I mine oplysninger?",
    answer:
      "Vi beder kun om det, der skal til for at kunne rådgive dig: hvad du vil have gennemgået, og hvordan vi får fat i dig. Vi beder ikke om CPR-nummer, helbredsoplysninger eller betalingsoplysninger i formularen. Du kan læse mere i vores privatlivspolitik.",
  },
  {
    question: "Skal jeg opsige mine nuværende forsikringer først?",
    answer:
      "Nej — og det bør du heller ikke. Du skal aldrig stå uden dækning. Hvis du på et tidspunkt vælger at flytte en forsikring, sker opsigelsen først, når den nye dækning er på plads.",
  },
  {
    question: "Kan I hjælpe, selvom jeg er tilfreds med mit nuværende selskab?",
    answer:
      "Ja. Mange bruger en gennemgang til at få bekræftet, at dækningen passer — eller til at opdage et hul, de ikke var opmærksomme på. Det kræver ikke, at du skifter noget.",
  },
];

/** Shorter set used on the front page so the section does not become a wall. */
export const homepageFaq: FaqItem[] = generalFaq.slice(0, 5);

/** Objections that are specific to businesses. */
export const businessFaq: FaqItem[] = [
  {
    question: "Vi har allerede aftaler flere steder — kan det lade sig gøre at samle det?",
    answer:
      "Første skridt er at få overblik over, hvad I har i dag, og hvornår aftalerne kan ændres. Om det giver mening at samle det ét sted afhænger af, hvad I har, og hvad I har brug for.",
  },
  {
    question: "Hvad skal vi have klar til en erhvervsgennemgang?",
    answer:
      "De nuværende policer, antal ansatte og en idé om, hvilke værdier virksomheden har i bygninger, biler, maskiner og løsøre. Mangler noget, finder vi det undervejs.",
  },
  {
    question: "Vi er en enkeltmandsvirksomhed. Er det relevant for os?",
    answer:
      "Ja. Selvstændige uden ansatte har typisk brug for ansvar og dækning af eget udstyr og materiel — og ofte en afklaring af, hvordan man selv er stillet ved sygdom eller ulykke.",
  },
];

/** Contact-page FAQ falls back to the general set. */
export const contactFaq = generalFaq;

export const faqSiteName = siteConfig.siteName;
