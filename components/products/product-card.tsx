import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { StarIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import VotingButtons from "./voting-buttons";
import { ProductType, VoteInformation } from "@/types";

type ProductCardProps = {
  product: ProductType;
  userVoteInfo?: VoteInformation;
  userId: string | null;
};

export default function ProductCard({
  product,
  userVoteInfo,
  userId,
}: ProductCardProps) {
  // TODO: no hasVoted button is in database.
  const hasVoted = false;
  return (
    <Link href={`/products/${product.slug}`} className="h-full">
      <Card className="group card-hover hover:bg-primary-foreground/10 border-solid border-gray-400 min-h-55">
        <CardHeader className="flex-1">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {product.name}
                </CardTitle>
                {product.voteCount > minVoteCntForFeature && (
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
            <VotingButtons
              productId={product.id}
              userVoteInfo={userVoteInfo}
              voteCount={product.voteCount}
              userId={userId}
            />
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

const minVoteCntForFeature = 100;
