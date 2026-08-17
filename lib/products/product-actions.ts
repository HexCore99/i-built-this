"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { productSchema } from "./product-validation";
import { flattenError } from "zod";
import { db } from "@/db";
import { products, votes } from "@/db/schema";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { FormState } from "@/types";
import { updateProductVoteCount } from "./vote-utils";

export async function addProductAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    // get user info
    const { userId, orgId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: {},
        message: "You must be logged in",
      };
    }

    if (!orgId) {
      return {
        success: false,
        error: {},
        message: "you must be a member of an organization to submit a product",
      };
    }

    const user = await currentUser();
    const displayName = [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(" ");
    const submittedBy =
      displayName ||
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses[0]?.emailAddress ||
      "Unknown user";

    // validate the data
    const rawFormData = Object.fromEntries(formData.entries());
    const validatedData = productSchema.safeParse(rawFormData);

    if (!validatedData.success) {
      const fieldErrors = flattenError(validatedData.error).fieldErrors;
      console.log(fieldErrors);

      return {
        success: false,
        error: fieldErrors,
        message: "Invalid data",
      };
    }

    // extract validated data
    const { name, slug, tagline, description, websiteUrl, tags } =
      validatedData.data;

    const tagsArray = tags ? tags.filter((tag) => typeof tag === "string") : [];
    // create product
    await db.insert(products).values({
      name,
      slug,
      tagline,
      description,
      websiteUrl,
      tags: tagsArray,
      status: "pending",
      submittedBy,
      organizationId: orgId,
      userId,
    });
    revalidatePath("/admin");

    return {
      success: true,
      error: {},
      message: "Product added successfully! It will be reviewed shortly. ",
    };
  } catch (err) {
    console.log(err);

    if (err instanceof z.ZodError) {
      return {
        success: false,
        error: flattenError(err).fieldErrors,
        message: "validation failed please check your input",
      };
    }

    return {
      success: false,
      error: {},
      message: "Something went wrong",
    };
  }
}

export async function upvoteProductAction(productId: number) {
  try {
    const { userId } = await auth();

    // User authentication

    if (!userId) {
      return {
        success: false,
        error: {},
        message: "You must be logged in",
      };
    }

    /* =====> Voting Logic <====== */

    // check if the user already voted for this product
    const [userVote] = await db
      .select()
      .from(votes)
      .where(and(eq(votes.productId, productId), eq(votes.userId, userId)))
      .limit(1);

    switch (userVote?.voteType) {
      case undefined:
        await db.insert(votes).values({
          userId,
          productId,
          voteType: "UPVOTE",
        });
        await updateProductVoteCount(productId, +1);
        break;

      case "UPVOTE":
        // delete user row from votes and decrement vote_count by 1
        await db
          .delete(votes)
          .where(and(eq(votes.userId, userId), eq(votes.productId, productId)));

        await updateProductVoteCount(productId, -1);
        break;

      case "DOWNVOTE":
        await db
          .update(votes)
          .set({ voteType: "UPVOTE" })
          .where(and(eq(votes.userId, userId), eq(votes.productId, productId)));
        await updateProductVoteCount(productId, 2);
        break;
      default:
        throw new Error("Invalid vote type");
    }

    /* =====> END Voting Logic <====== */

    // TODO: revalidatePath is too mcuh slower, isn't there faster way?
    revalidatePath("/"); //refresh the cache

    return {
      success: true,
      message: "product upvoted successful",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: { error },
      message: "failed to upvote product",
      voteCount: 0,
    };
  }
}

export async function downVoteProductAction(productId: number) {
  try {
    const { userId } = await auth();

    // User authentication

    if (!userId) {
      return {
        success: false,
        error: {},
        message: "You must be logged in",
      };
    }

    /* =====> Voting Logic <====== */

    // check if the user already voted for this product
    const [userVote] = await db
      .select()
      .from(votes)
      .where(and(eq(votes.productId, productId), eq(votes.userId, userId)))
      .limit(1);

    switch (userVote?.voteType) {
      case undefined:
        await db.insert(votes).values({
          userId,
          productId,
          voteType: "DOWNVOTE",
        });
        await updateProductVoteCount(productId, -1);
        break;

      case "DOWNVOTE":
        // delete user row from votes and decrement vote_count by 1
        await db
          .delete(votes)
          .where(and(eq(votes.userId, userId), eq(votes.productId, productId)));

        await updateProductVoteCount(productId, 1);
        break;

      case "UPVOTE":
        await db
          .update(votes)
          .set({ voteType: "DOWNVOTE" })
          .where(and(eq(votes.userId, userId), eq(votes.productId, productId)));
        await updateProductVoteCount(productId, -2);
        break;
      default:
        throw new Error("Invalid vote type");
    }
    revalidatePath("/");
    /* =====> END Voting Logic <====== */

    return {
      success: true,
      message: "product downvoted successful",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: { error },
      message: "failed to downvote product",
      voteCount: 0,
    };
  }
}

export async function getProductBySlug(slug: string) {
  const product = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug));
  return product[0] ?? null;
}
