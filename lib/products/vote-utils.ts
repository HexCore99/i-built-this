import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function updateProductVoteCount(
  productId: number,
  updateVal: number,
) {
  await db
    .update(products)
    .set({
      voteCount: sql`${products.voteCount} + ${updateVal}`,
    })
    .where(eq(products.id, productId));
}
