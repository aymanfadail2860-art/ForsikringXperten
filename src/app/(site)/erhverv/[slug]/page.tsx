import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageTemplate } from "@/components/marketing/ProductPageTemplate";
import { getProduct, businessProducts } from "@/content/products";
import { buildMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return businessProducts.map((product) => ({ slug: product.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct("erhverv", slug);
  if (!product) return {};

  return buildMetadata({
    title: product.title,
    description: product.metaDescription,
    path: `/erhverv/${product.slug}`,
  });
}

export default async function BusinessProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct("erhverv", slug);
  if (!product) notFound();

  return <ProductPageTemplate product={product} />;
}
