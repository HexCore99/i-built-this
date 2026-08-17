import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// =====================
// Products Table
// =====================
export const products = pgTable("products", {
  id: serial("id").primaryKey(),

  name: varchar("name", {
    length: 255,
  }).notNull(),

  slug: varchar("slug", {
    length: 255,
  })
    .unique()
    .notNull(),

  tagline: varchar("tagline", {
    length: 255,
  }),

  description: text("description"),

  websiteUrl: varchar("website_url", {
    length: 500,
  }),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  approvedAt: timestamp("approved_at"),

  tags: varchar("tags").array(),

  voteCount: integer("vote_count").default(0).notNull(),

  status: varchar("status", {
    length: 50,
  })
    .default("pending")
    .notNull(),

  submittedBy: varchar("submitted_by", {
    length: 255,
  }).notNull(),

  userId: varchar("user_id", {
    length: 255,
  }).notNull(),

  organizationId: varchar("organization_id", {
    length: 255,
  }).notNull(),
});

// =====================
// Votes Table
// =====================
export const votes = pgTable(
  "votes",
  {
    id: serial("id").primaryKey(),

    userId: varchar("user_id", {
      length: 255,
    }).notNull(),

    productId: integer("product_id")
      .notNull()
      .references(() => products.id),

    voteType: varchar("vote_type", {
      length: 10,
    }).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },

  (table) => [
    uniqueIndex("unique_user_product_vote").on(table.userId, table.productId),
  ],
);
