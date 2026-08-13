import FeaturedProducts from "@/components/landing-page/featured-products";
import HeroSection from "@/components/landing-page/hero-section";
import RecentlyLaunchedProducts from "@/components/landing-page/recently-launched-products";
import { LoaderIcon } from "lucide-react";
import { Suspense } from "react";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      <Suspense
        fallback={
          <div className="wrapper flex items-center">
            <LoaderIcon className="size-4 spin-in animate-spin" />
            Loading.... Recently Launched Products
          </div>
        }
      >
        <RecentlyLaunchedProducts />
      </Suspense>
    </div>
  );
}
