import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo/jsonld";

/**
 * Breadcrumbs with matching structured data. The last item is the current
 * page and is not a link, but still appears in the JSON-LD trail.
 */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <>
      <nav aria-label="Brødkrumme">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-small text-ink-500">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-2">
                {isLast ? (
                  <span aria-current="page" className="text-ink-700">
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.path} className="hover:text-ink-800 hover:underline">
                      {crumb.name}
                    </Link>
                    <span aria-hidden="true" className="text-ink-300">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
