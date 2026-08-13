import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChevronDownIcon, ChevronUpIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { InferSelectModel } from "drizzle-orm";
import { products } from "@/db/schema";

type Product = InferSelectModel<typeof products>;
type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const hasVoted = false;
  return (
    <Link href={`/products/${product.id}`} className="h-full">
      <Card className="group card-hover hover:bg-primary-foreground/10 border-solid border-gray-400 min-h-55">
        <CardHeader className="flex-1">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {product.name}
                </CardTitle>
                {product.voteCount > 100 && (
                  <Badge className="gap-1 bg-primary  text-primary-foreground">
                    <StarIcon className="size-3 fill-current" />
                    Featured
                  </Badge>
                )}
              </div>
              <CardDescription className="line-clamp-4">
                {product.description}
              </CardDescription>
            </div>
            {/*voting buttons*/}
            <div className="flex flex-col iterms-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "h-8 w-8 text-primary ",
                  hasVoted
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "hover:bg-primary/10 hover:text-primary",
                )}
              >
                <ChevronUpIcon className="size-5" />
              </Button>
              <span className="text-sm font-semibold transition-colors text-foreground">
                {product.voteCount}
              </span>

              <Button
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "h-8 w-8 text-primary",
                  hasVoted
                    ? "hover:text-destructive"
                    : "opacity-50 cursor-not-allowed",
                )}
              >
                <ChevronDownIcon className="size-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="border-t-0 bg-transparent">
          <div className="flex items-center gap-2">
            {product.tags?.map((tag) => (
              <Badge variant="secondary" key={tag}>
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
