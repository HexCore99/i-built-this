import { getFeaturedProducts } from "@/lib/products/product-select";
import { param } from "drizzle-orm";
import { Suspense } from "react";

// export default function ProductPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <ProductContent params={params} />
//     </Suspense>
//   );
// }

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <h1>Product {id}</h1>;
}

export const generateStaticParams = async () => {
  const products = await getFeaturedProducts();
  return products.map((product) => ({ id: product.id.toString() }));
};
