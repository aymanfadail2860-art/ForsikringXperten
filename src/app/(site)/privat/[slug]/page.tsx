import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageTemplate } from "@/components/marketing/ProductPageTemplate";
import { getProduct, privateProducts } from "@/content/products";
import { buildMetadata } from "@/lib/seo/metadata";

/** Static params keep every product page prerendered and fast. */
export function generateStaticParams() {
  return privateProducts.map((product) => ({ slug: product.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct("privat", slug);
  if (!product) return {};

  return buildMetadata({
    title: product.title,
    description: product.metaDescription,
    path: `/privat/${product.slug}`,
  });
}

export default async function PrivateProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct("privat", slug);
  if (!product) notFound();

  return <ProductPageTemplate product={product} />;
}
