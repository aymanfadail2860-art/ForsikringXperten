/**
 * Renders a JSON-LD block. The payload is serialised server-side and never
 * contains user input, so there is nothing here for an injection to grab —
 * but `<` is still escaped to keep the script tag from being closed early.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
