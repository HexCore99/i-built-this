import { ArrowUpRight, StarIcon } from "lucide-react";
import SectionHeader from "../common/section-header";
import { Button } from "../ui/button";
import ProductCard from "../products/product-card";
import Link from "next/link";

const featuredProducts = [
  {
    id: 1,
    name: "ParityKit",
    description: "A toolkit for creating parity products",
    tags: ["SaaS", "Pricing", "Global"],
    votes: 615,
    isFeatured: true,
  },

  {
    id: 2,
    name: "Modern Full Stack next.js Course",
    description: "Learn to build production-ready full stack apps with Next.js",
    tags: ["Next.js", "Full-Stack", "Course"],
    votes: 124,
    isFeatured: false,
  },
];

export default function FeaturedProducts({}) {
  return (
    <section className="py-20 bg-muted/20">
      <div className="wrapper">
        <div className="flex items-center justify-between mb-8">
          <SectionHeader
            title="Featured Today"
            icon={StarIcon}
            description="Top picks from our community this week"
          />
          <Button
            nativeButton={false}
            variant="outline"
            className="hidden sm:flex"
            render={<Link href="/explore" />}
          >
            View All
            <ArrowUpRight className="size-4" />
          </Button>
        </div>

        <div className="grid-wrapper">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
