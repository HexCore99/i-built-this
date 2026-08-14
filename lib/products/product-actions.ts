"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { productSchema } from "./product-validation";
import { flattenError } from "zod";
import { db } from "@/db";
import { products } from "@/db/schema";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { FormState } from "@/types";

export async function addProductAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // console.log(formData);

  try {
    // get user info
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress || "anonnymous";
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
      submittedBy: userEmail,
      organizationId: orgId,
      userId,
    });

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
    const { userId, orgId } = await auth();

    // User authentication

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
    // update vote
    await db
      .update(products)
      .set({ voteCount: sql`GREATEST(0,vote_count+1)` })
      .where(eq(products.id, productId));

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
    const { userId, orgId } = await auth();

    // User authentication

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
    // update vote
    await db
      .update(products)
      .set({ voteCount: sql`GREATEST(0,vote_count-1)` })
      .where(eq(products.id, productId));

    revalidatePath("/"); //refresh the cache

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
