"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { productSchema } from "./product-validation";
import { flattenError } from "zod";
import { db } from "@/db";
import { products } from "@/db/schema";
import { z } from "zod";

type FormState = {
  success: boolean;
  error?: Record<string, string[]>;
  message: string;
};
export async function addProductAction(
  prevState: FormState,
  formData: FormData,
) {
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
        error: flattenError(err),
        message: "validation failed please check your input",
      };
    }

    return {
      success: false,
      error: { err },
      message: "Something went wrong",
    };
  }
}
