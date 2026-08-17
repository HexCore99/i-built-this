import { Calendar, RocketIcon } from "lucide-react";
import SectionHeader from "../common/section-header";
import ProductCard from "../products/product-card";
import EmtpyState from "../common/empty-state";
import {
  getRecentlyLaunchedProducts,
  getVoteInformation,
} from "@/lib/products/product-select";
import { auth } from "@clerk/nextjs/server";

export default async function RecentlyLaunchedProducts({}) {
  const recentlyLaunchedProducts = await getRecentlyLaunchedProducts();
  const productIds = recentlyLaunchedProducts.map((product) => product.id);

  const { userId } = await auth();
  let voteInformation = undefined;
  if (userId) {
    voteInformation = await getVoteInformation(userId, productIds);
  }
  return (
    <section className="py-20">
      <div className="wrapper space-y-12">
        <SectionHeader
          title="Recently Launched"
          icon={RocketIcon}
          description="Discover the latest products from our community"
        />

        {recentlyLaunchedProducts.length > 0 ? (
          <div className="grid-wrapper">
            {recentlyLaunchedProducts.map((product) => {
              const userVoteInfo = voteInformation?.find(
                (vote) => vote.productId === product.id,
              );

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  userVoteInfo={userVoteInfo}
                  userId={userId}
                />
              );
            })}
          </div>
        ) : (
          <EmtpyState
            message="No products launced in last week, check back soon for new launches!"
            icon={Calendar}
          />
        )}
      </div>
    </section>
  );
}
