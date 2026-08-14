"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { ProductType } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { success } from "zod";

export const approveProductAction = async (productId: ProductType["id"]) => {
  try {
    await db
      .update(products)
      .set({ status: "approved", approvedAt: new Date() })
      .where(eq(products.id, productId));
    revalidatePath("/admin");
    return {
      success: true,
      message: "Prodcut approved successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: err,
      message: "Failed to approve product",
    };
  }
};

export const rejectProductAction = async (productId: ProductType["id"]) => {
  try {
    await db
      .update(products)
      .set({ status: "rejected" })
      .where(eq(products.id, productId));

    revalidatePath("/admin");
    return {
      success: true,
      message: "Product rejected successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: err,
      message: "Failed to reject product",
    };
  }
};
