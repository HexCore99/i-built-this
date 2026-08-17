import SectionHeader from "@/components/common/section-header";
import ProductExplorer from "@/components/products/product-explorer";
import ProductSkeleton from "@/components/products/product-skeleton";
import {
  getApprovedProducts,
  getVoteInformation,
} from "@/lib/products/product-select";
import { auth } from "@clerk/nextjs/server";
import { CompassIcon } from "lucide-react";
import { Suspense } from "react";

export default function ExplorePage() {
  return (
    <div className="py-20">
      <div className="wrapper">
        <div className="mb-12">
          <SectionHeader
            title="Explore All Products"
            icon={CompassIcon}
            description="Browse and discover amazing projects from our community"
          />
        </div>
        <Suspense fallback={<ProductSkeleton />}>
          <ExploreProducts />
        </Suspense>
      </div>
    </div>
  );
}

async function ExploreProducts() {
  const products = await getApprovedProducts();
  const { userId } = await auth();
  const voteInformation = userId
    ? await getVoteInformation(
        userId,
        products.map((product) => product.id),
      )
    : [];

  return (
    <ProductExplorer
      products={products}
      userId={userId}
      voteInformation={voteInformation}
    />
  );
}
