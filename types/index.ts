import { products } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type FormState = {
  success: boolean;
  error: Record<string, string[]>;
  message: string;
};

export type ProductType = InferSelectModel<typeof products>;
