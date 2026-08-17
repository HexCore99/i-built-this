import { products, votes } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type FormState = {
  success: boolean;
  error: Record<string, string[]>;
  message: string;
};
// export type voteInformation = {
//   id: number;
//   userId: string;
//   productId: number;
//   voteType: string;
//   createdAt: Date;
// };

export type ProductType = InferSelectModel<typeof products>;
export type VoteInformation = InferSelectModel<typeof votes>;
