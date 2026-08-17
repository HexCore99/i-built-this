import SectionHeader from "@/components/common/section-header";
import VotingButtons from "@/components/products/voting-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/products/product-actions";
import {
  getFeaturedProducts,
  getVoteInformation,
} from "@/lib/products/product-select";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ExternalLinkIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={<div className="wrapper py-16">Loading product...</div>}
    >
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }
  const { userId } = await auth();

  const [userVoteInfo] = userId
    ? await getVoteInformation(userId, [product.id])
    : [];

  const { name, description, websiteUrl, tags, voteCount, tagline } = product;
  return (
    <div className="py-16">
      <div className="wrapper">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-muted-foreground transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Explore
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-7">
            <div className="flex items-start gap-6">
              <div className="flex-1 min-w-0">
                <div className="mb-6">
                  <SectionHeader
                    title={name}
                    icon={StarIcon}
                    description={tagline ?? ""}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="capitalize">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
            <div className="border rounded-lg p-6 bg-primary/10">
              <h2 className="text-xl font-semibold mb-4">Product Details</h2>

              <div className="space-y-3">
                {[
                  {
                    label: "Launched:",
                    value: new Date(
                      product.createdAt?.toISOString() ?? "",
                    ).toLocaleDateString(),
                    icon: CalendarIcon,
                  },
                  {
                    label: "Submitted by:",
                    value: product.submittedBy,
                    icon: UserIcon,
                  },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3 text-sm">
                    {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 ">
            <div className="sticky top-24 space-y-4">
              <div className="border rounded-lg p-6 bg-background">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    Support this product
                  </p>
                  <VotingButtons
                    productId={product.id}
                    voteCount={voteCount}
                    userId={userId}
                    userVoteInfo={userVoteInfo}
                  />
                </div>
                {voteCount > 100 && (
                  <div className="pt-6 border-t">
                    <Badge className="w-full justify-center py-4">
                      🔥Featured Product
                    </Badge>
                  </div>
                )}
              </div>
              {websiteUrl && (
                <Button
                  nativeButton={false}
                  className="w-full rounded-lg"
                  variant="outline"
                  render={
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <ExternalLinkIcon className="h-4 w-4" /> Visit Website
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const generateStaticParams = async () => {
  const products = await getFeaturedProducts();
  return products.map((product) => ({ slug: product.slug.toString() }));
};
