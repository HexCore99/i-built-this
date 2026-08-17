import { ArrowUpRight, StarIcon } from "lucide-react";
import SectionHeader from "../common/section-header";
import { Button } from "../ui/button";
import ProductCard from "../products/product-card";
import Link from "next/link";
import {
  getFeaturedProducts,
  getVoteInformation,
} from "@/lib/products/product-select";
import { auth } from "@clerk/nextjs/server";

export default async function FeaturedProducts({}) {
  const { userId } = await auth();
  const featuredProducts = await getFeaturedProducts();
  let voteInformation = null;
  if (userId) {
    voteInformation = await getVoteInformation(userId);
    console.log("===================================================");
    console.log(voteInformation);
  }

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
          {featuredProducts.map((product) => {
            const userVotingStatus = voteInformation?.find(
              (vote) => vote.productId === product.id,
            );
            return (
              <ProductCard
                key={product.id}
                product={product}
                userId={userId ?? null}
                userVoteInfo={userVotingStatus}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
