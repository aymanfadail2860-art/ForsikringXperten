import type { PolicyLine } from "@/components/marketing/PolicyExcerpt";

/**
 * Illustrative policy fragments used by the signature device.
 *
 * ⚠️ These are written examples, not extracts from any customer's policy, and
 * every component that renders them shows a visible "Eksempel" badge. Clause
 * numbers follow the shape a Danish policy normally uses so the fragment is
 * recognisable; the wording is ours.
 *
 * Keeping them here rather than inline means there is one place to check when
 * someone asks "where do these numbers come from".
 */

export const heroExcerpt: {
  title: string;
  lines: PolicyLine[];
  note: { heading: string; body: string };
} = {
  title: "Indboforsikring · side 7",
  lines: [
    { ref: "4.2", text: "Dækningen omfatter indbo i helårsboligen…", contextOnly: true },
    { ref: "4.3", text: "Undtaget er skade forvoldt ved grov…" },
    { ref: "4.4", text: "Selvrisiko pr. skade: 8.000 kr.", marked: true },
    { ref: "4.5", text: "Ved flere skader inden for 12 mdr…", contextOnly: true },
  ],
  note: {
    heading: "Kan du betale 8.000 kr. i morgen?",
    body: "Hvis ikke, er forsikringen billig det forkerte sted.",
  },
};

/**
 * The comparison used in the "two agreements" section. Same clause, two
 * policies, one difference that matters — this is what an advisor does, shown
 * rather than described.
 */
export const compareExcerpts: {
  label: string;
  title: string;
  lines: PolicyLine[];
}[] = [
  {
    label: "Aftale A",
    title: "Erhvervsansvar · side 3",
    lines: [
      { ref: "2.1", text: "Dækningssum pr. forsikringsår: 10 mio. kr." },
      { ref: "2.4", text: "Omfatter arbejde udført på fast ejendom" },
      { ref: "3.2", text: "Produktansvar: ikke omfattet", marked: true },
    ],
  },
  {
    label: "Aftale B",
    title: "Erhvervsansvar · side 3",
    lines: [
      { ref: "2.1", text: "Dækningssum pr. forsikringsår: 10 mio. kr." },
      { ref: "2.4", text: "Omfatter arbejde udført på fast ejendom" },
      { ref: "3.2", text: "Produktansvar: omfattet, 5 mio. kr.", marked: true },
    ],
  },
];
