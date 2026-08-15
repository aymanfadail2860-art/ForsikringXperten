/**
 * Consent wording.
 *
 * The full text is stored with every lead in `consent_records` (see
 * `LEAD_CONSENT_TEXT` in the lead repository). This shorter version is what
 * the checkbox shows — the two must describe the same thing. If one changes,
 * change both and bump the consent version.
 */
export const LEAD_CONSENT_SHORT =
  "Jeg giver samtykke til, at Forsikringxperten må kontakte mig om min forespørgsel " +
  "på telefon og e-mail, og at mine oplysninger behandles som beskrevet i privatlivspolitikken.";
