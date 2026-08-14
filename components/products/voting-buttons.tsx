"use client";
import { ChevronDownIcon, ChevronUpIcon, Loader2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  downVoteProductAction,
  upvoteProductAction,
} from "@/lib/products/product-actions";
import { useOptimistic, useTransition } from "react";
import { set } from "zod/v3";

export default function VotingButtons({
  productId,
  voteCount: initialVoteCount,
  hasVoted,
}: {
  hasVoted?: boolean;
  productId: number;
  voteCount: number;
}) {
  const [optimisticVoteCount, setOptimisticVoteCount] = useOptimistic(
    initialVoteCount,
    (currentVoteCount, change: number) =>
      Math.max(0, currentVoteCount + change),
  );

  const [isPending, startTransition] = useTransition();
  async function handleUpvote() {
    startTransition(async () => {
      setOptimisticVoteCount(1);
      await upvoteProductAction(productId);
    });
  }

  async function handleDownvote() {
    startTransition(async () => {
      setOptimisticVoteCount(-1);
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
        disabled={isPending}
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
        {optimisticVoteCount}
      </span>

      <Button
        onClick={handleDownvote}
        variant="ghost"
        size="icon-sm"
        disabled={isPending}
        className={cn(
          "h-8 w-8 text-primary",
          hasVoted ? "hover:text-destructive" : "opacity-50 cursor-not-allowed",
        )}
      >
        <ChevronDownIcon className="size-5" />
      </Button>
    </div>
  );
}
