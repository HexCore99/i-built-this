"use client";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  downVoteProductAction,
  upvoteProductAction,
} from "@/lib/products/product-actions";
import { useOptimistic, useTransition } from "react";
import { VoteInformation } from "@/types";
export default function VotingButtons({
  productId,
  userVoteInfo,
  voteCount: initialVoteCount,
  userId,
}: {
  userVoteInfo?: VoteInformation;
  productId: number;
  voteCount: number;
  userId: string | null;
}) {
  const [optimisticVoteCount, setOptimisticVoteCount] = useOptimistic(
    initialVoteCount,
    (currentVoteCount, change: number) => currentVoteCount + change,
  );

  const [isPending, startTransition] = useTransition();
  async function handleUpvote() {
    startTransition(async () => {
      switch (userVoteInfo?.voteType) {
        case undefined:
          setOptimisticVoteCount(1);
          break;
        case "UPVOTE":
          setOptimisticVoteCount(-1);
          break;
        case "DOWNVOTE":
          setOptimisticVoteCount(+2);
          break;
        default:
          throw new Error("Invalid vote type");
      }
      await upvoteProductAction(productId);
    });
  }

  async function handleDownvote() {
    startTransition(async () => {
      switch (userVoteInfo?.voteType) {
        case undefined:
          setOptimisticVoteCount(-1);
          break;
        case "DOWNVOTE":
          setOptimisticVoteCount(1);
          break;
        case "UPVOTE":
          setOptimisticVoteCount(-2);
          break;
        default:
          throw new Error("Invalid vote type");
      }

      await downVoteProductAction(productId);
    });
  }

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="flex flex-col items-center gap-1 shrink-0"
    >
      <Button
        onClick={handleUpvote}
        variant="ghost"
        size="icon-sm"
        disabled={isPending || userId === null}
        className={cn(
          "h-8 w-8 text-primary ",
          userVoteInfo?.voteType === "UPVOTE"
            ? "bg-primary/10 text-primary hover:bg-primary/20"
            : "hover:bg-primary/10 hover:text-primary",
        )}
      >
        <ChevronUpIcon className="size-5" />
      </Button>
      <span className="text-sm font-semibold transition-colors text-foreground">
        {optimisticVoteCount}
      </span>

      <Button
        onClick={handleDownvote}
        variant="ghost"
        size="icon-sm"
        disabled={isPending || userId === null}
        className={cn(
          "h-8 w-8 text-primary",

          userVoteInfo?.voteType === "DOWNVOTE"
            ? "bg-primary/10 text-primary hover:bg-primary/20"
            : "hover:bg-primary/10 hover:text-primary",
        )}
      >
        <ChevronDownIcon className="size-5" />
      </Button>
    </div>
  );
}
