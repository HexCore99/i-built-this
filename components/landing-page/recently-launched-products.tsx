import { Calendar, RocketIcon } from "lucide-react";
import SectionHeader from "../common/section-header";
import ProductCard from "../products/product-card";
import EmtpyState from "../common/empty-state";
import { getRecentlyLaunchedProducts } from "@/lib/products/product-select";

export default async function RecentlyLaunchedProducts({}) {
  const recentlyLaunchedProducts = await getRecentlyLaunchedProducts();
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
            {recentlyLaunchedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
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
